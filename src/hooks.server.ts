import type { Handle } from "@sveltejs/kit";
import { error, redirect } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";
import { svelteKitHandler } from "better-auth/svelte-kit";
import { like } from "drizzle-orm";
import { building } from "$app/environment";
import { getRedirectByOldSlug } from "$lib/server/database/slug-redirects.server";
import { auth } from "$lib/server/drivers/auth";
import { db } from "$lib/server/drivers/db";
import { escapeLikePattern } from "$lib/shared/logic/sql-escape";
import { article } from "$lib/shared/models/schema";

/**
 * Simple sliding-window rate limiter.
 * Tracks request timestamps per IP and rejects when the window limit is exceeded.
 */
function createRateLimiter(windowMs: number, maxRequests: number) {
  const requests = new Map<string, number[]>();

  // Periodic cleanup to prevent memory leak
  setInterval(() => {
    const now = Date.now();
    for (const [ip, timestamps] of requests) {
      const valid = timestamps.filter((t) => now - t < windowMs);
      if (valid.length === 0) requests.delete(ip);
      else requests.set(ip, valid);
    }
  }, windowMs);

  return (ip: string): boolean => {
    const now = Date.now();
    const timestamps = (requests.get(ip) ?? []).filter((t) => now - t < windowMs);
    if (timestamps.length >= maxRequests) return false;
    timestamps.push(now);
    requests.set(ip, timestamps);
    return true;
  };
}

const authLimiter = createRateLimiter(60_000, 15);
const mutationLimiter = createRateLimiter(60_000, 60);

const handleAuth: Handle = async ({ event, resolve }) => {
  return await svelteKitHandler({ event, resolve, auth, building });
};

// Global rate limiter for DB lookup redirects (1 request per second)
let lastDbLookup = 0;

// Old project category names -> new query param values.
// long-term は旧サイト固有なので /projects 全件にフォールバック（クエリ無し）。
const OLD_PROJECT_KIND_TO_CATEGORY: Record<string, string | null> = {
  festival: "festival",
  hackathon: "hackathon",
  personal: "personal",
  "long-term": null,
  all: null,
};

const handleRedirect: Handle = async ({ event, resolve }) => {
  const path = event.url.pathname;

  // ---------------------------------------------------------------------------
  // 旧 utcode.net 互換リダイレクト (静的パターン)
  // ---------------------------------------------------------------------------

  // 旧 sitemap URL: 検索エンジン再クロール促進のため新 sitemap.xml に流す
  if (path === "/sitemap-index.xml" || path === "/sitemap-0.xml") {
    redirect(301, "/sitemap.xml");
  }

  // 旧メンバー詳細: /members/YYYY/<slug>/ -> /members/<slug>
  const oldMemberMatch = path.match(/^\/members\/\d{4}\/([^/]+)\/?$/);
  if (oldMemberMatch?.[1]) {
    redirect(301, `/members/${oldMemberMatch[1]}`);
  }

  // 旧プロジェクトのマルチセグメント URL:
  //   /projects/festival/<event>/<slug>/    -> /projects/<slug>
  //   /projects/hackathon/<date>/<slug>/    -> /projects/<slug>
  // 新 DB に slug が無い場合は /projects/[slug] が 404 を返す (過剰な lookup はしない)
  const oldProjectMultiMatch = path.match(
    /^\/projects\/(?:festival|hackathon)\/[^/]+\/([^/]+)\/?$/,
  );
  if (oldProjectMultiMatch?.[1]) {
    redirect(301, `/projects/${oldProjectMultiMatch[1]}`);
  }

  // 旧プロジェクトのカテゴリ一覧: /projects/<kind>/ -> /projects?category=<kind>
  // 末尾 / は SvelteKit の trailing slash 削除で剥がれる前提
  const oldProjectKindMatch = path.match(
    /^\/projects\/(festival|hackathon|long-term|personal|all)\/?$/,
  );
  if (oldProjectKindMatch?.[1]) {
    const newCategory = OLD_PROJECT_KIND_TO_CATEGORY[oldProjectKindMatch[1]];
    redirect(301, newCategory ? `/projects?category=${newCategory}` : "/projects");
  }

  // 旧 contact: 新サイトに contact ページ無し。最も近い /about へ
  if (path === "/contact" || path === "/contact/") {
    redirect(301, "/about");
  }

  // 旧 welcome-events 各種 -> /join/welcome-events
  if (
    path === "/welcome-events" ||
    path === "/welcome-events/" ||
    path === "/welcome-events-2025-summer" ||
    path === "/welcome-events-2025-summer/"
  ) {
    redirect(301, "/join/welcome-events");
  }

  // 旧 activities サブカテゴリ: /activities/(learn|share|develop)/ -> /activities
  if (/^\/activities\/(learn|share|develop)\/?$/.test(path)) {
    redirect(301, "/activities");
  }

  // ---------------------------------------------------------------------------
  // 旧記事 URL のリダイレクト
  // ---------------------------------------------------------------------------

  // Format 2: /articles/YYYY/MM-DD[_-]slug -> /articles/YYYY-MM-DD-slug
  // 区切りは旧 URL によって `_` だったり `-` だったりするので両方受ける
  // 例: /articles/2024/05-14-may-festival/ も拾う
  const format2Pattern = /^\/articles\/(\d{4})\/(\d{2}-\d{2})[_-](.+?)\/?$/;
  const format2Match = path.match(format2Pattern);
  if (format2Match) {
    const [, year, monthDay, slug] = format2Match;
    redirect(301, `/articles/${year}-${monthDay}-${slug}`);
  }

  // Format 1: /articles/{old-slug} -> DB lookup -> /articles/{new-slug}
  // Old slugs don't have YYYY-MM-DD prefix, new slugs do
  const format1Pattern = /^\/articles\/([^/]+?)\/?$/;
  const format1Match = path.match(format1Pattern);
  if (format1Match?.[1]) {
    const oldSlug = format1Match[1];
    // Skip if already in new format (YYYY-MM-DD-slug)
    if (/^\d{4}-\d{2}-\d{2}-/.test(oldSlug)) {
      return resolve(event);
    }
    // 旧サイトのページネーション URL (/articles/2/ 〜 /articles/8/ など) を保護。
    // 純数字で `like '%-2'` を実行すると末尾 `-2` の記事に誤マッチするので
    // ここで弾いて /articles/[slug] のロード (getPublicArticleBySlug) に 404 させる。
    if (/^\d+$/.test(oldSlug)) {
      return resolve(event);
    }

    // Global rate limit: 2 DB lookup per second
    const now = Date.now();
    if (now - lastDbLookup < 500) {
      error(429, "Too many requests");
    }
    lastDbLookup = now;

    // First check: articleSlugRedirect table (exact match)
    const slugRedirect = await getRedirectByOldSlug(oldSlug);
    if (slugRedirect) {
      redirect(301, `/articles/${slugRedirect.newSlug}`);
    }

    // Second check: find article where slug ends with the old slug pattern (legacy)
    const found = await db
      .select({ slug: article.slug })
      .from(article)
      .where(like(article.slug, `%-${escapeLikePattern(oldSlug)}`))
      .limit(1);
    if (found[0]) {
      redirect(301, `/articles/${found[0].slug}`);
    }
  }

  return resolve(event);
};

const handleRateLimit: Handle = async ({ event, resolve }) => {
  const ip = event.getClientAddress();
  const path = event.url.pathname;

  if (path.startsWith("/api/auth")) {
    if (!authLimiter(ip)) error(429, "Too many requests");
  } else if (event.request.method === "POST") {
    if (!mutationLimiter(ip)) error(429, "Too many requests");
  }

  return resolve(event);
};

const handleSecurityHeaders: Handle = async ({ event, resolve }) => {
  const response = await resolve(event);
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  return response;
};

const handleCache: Handle = async ({ event, resolve }) => {
  const response = await resolve(event);
  const path = event.url.pathname;

  // Skip if response already has Cache-Control
  if (response.headers.has("Cache-Control")) {
    return response;
  }

  // Private routes: no caching
  if (path.startsWith("/api/auth") || path.startsWith("/admin")) {
    response.headers.set("Cache-Control", "private, no-store");
    return response;
  }

  // Public pages: layered caching
  // max-age=120: browser caches for 2 minutes (snappy navigation)
  // s-maxage=3600: CDN caches for 1 hour (purged on mutations)
  // stale-while-revalidate=60: serve stale for up to 1 minute while revalidating
  response.headers.set(
    "Cache-Control",
    "public, max-age=120, s-maxage=3600, stale-while-revalidate=60",
  );
  return response;
};

export const handle = sequence(
  handleRedirect,
  handleRateLimit,
  handleAuth,
  handleSecurityHeaders,
  handleCache,
);
