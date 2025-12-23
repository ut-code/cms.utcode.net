import type { Handle } from "@sveltejs/kit";
import { error, redirect } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";
import { svelteKitHandler } from "better-auth/svelte-kit";
import { like } from "drizzle-orm";
import { building } from "$app/environment";
import { auth } from "$lib/server/drivers/auth";
import { db } from "$lib/server/drivers/db";
import { article } from "$lib/shared/models/schema";

const handleAuth: Handle = async ({ event, resolve }) => {
  return await svelteKitHandler({ event, resolve, auth, building });
};

// Global rate limiter for DB lookup redirects (1 request per second)
let lastDbLookup = 0;

const handleRedirect: Handle = async ({ event, resolve }) => {
  const path = event.url.pathname;

  // Format 2: /articles/YYYY/MM-DD_slug -> /articles/YYYY-MM-DD-slug
  const format2Pattern = /^\/articles\/(\d{4})\/(\d{2}-\d{2})_(.+?)\/?$/;
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

    // Global rate limit: 2 DB lookup per second
    const now = Date.now();
    if (now - lastDbLookup < 500) {
      error(429, "Too many requests");
    }
    lastDbLookup = now;

    // DB lookup: find article where slug ends with the old slug pattern
    const found = await db
      .select({ slug: article.slug })
      .from(article)
      .where(like(article.slug, `%-${oldSlug}`))
      .limit(1);
    if (found[0]) {
      redirect(301, `/articles/${found[0].slug}`);
    }
  }

  return resolve(event);
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

  // Public pages: aggressive Cloudflare caching
  // s-maxage=3600: CDN caches for 1 hour
  // stale-while-revalidate=86400: serve stale for up to 1 day while revalidating
  response.headers.set("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
  return response;
};

export const handle = sequence(handleRedirect, handleAuth, handleCache);
