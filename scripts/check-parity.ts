#!/usr/bin/env bun
// utcode.net (旧) → cms.utcode.net (新) の互換性検証スクリプト。
//
// 検証範囲:
//   - URL の後方互換性 (リダイレクト仕様 + 旧 sitemap サンプリング)
//   - soft-404 の検出
//   - SEO メタタグ (og:locale, twitter:site)
//   - サムネ未設定記事のフォールバック画像 (`+/images/...` の残骸)
//   - 認可ガード (admin/api 系の未認証アクセス)
//
// 使い方:
//   bun scripts/check-parity.ts
//   NEW_BASE=http://localhost:5173 bun scripts/check-parity.ts

const NEW_BASE = process.env.NEW_BASE ?? "https://cms.utcode.net";
const OLD_BASE = process.env.OLD_BASE ?? "https://utcode.net";

type Result = { category: string; name: string; pass: boolean; detail: string };
const results: Result[] = [];

function record(category: string, name: string, pass: boolean, detail: string) {
  results.push({ category, name, pass, detail });
  process.stdout.write(`${pass ? "✓" : "✗"} [${category}] ${name} — ${detail}\n`);
}

type ManualResp = { status: number; location: string | null; body: string; error?: string };
type FollowResp = { status: number; finalUrl: string; body: string; error?: string };

// SSE 等の長時間レスポンスでハングしないよう個別タイムアウト。
const REQUEST_TIMEOUT_MS = 10_000;

async function fetchManual(path: string): Promise<ManualResp> {
  try {
    const res = await fetch(`${NEW_BASE}${path}`, {
      redirect: "manual",
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    // body は読まずに即 cancel (SSE 等のストリームでハングしないため)。
    // ヘッダだけ確認したいケースが多いので、必要時のみ body 読みに切替。
    const isRedirect = res.status >= 300 && res.status < 400;
    const body = isRedirect ? "" : await res.text().catch(() => "");
    return { status: res.status, location: res.headers.get("location"), body };
  } catch (e) {
    return { status: 0, location: null, body: "", error: (e as Error).message };
  }
}

async function fetchFollow(path: string): Promise<FollowResp> {
  try {
    const res = await fetch(`${NEW_BASE}${path}`, {
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    return { status: res.status, finalUrl: res.url, body: await res.text().catch(() => "") };
  } catch (e) {
    return { status: 0, finalUrl: "", body: "", error: (e as Error).message };
  }
}

type Expect =
  | { kind: "redirect"; status: 301 | 302 | 308; location: RegExp }
  | { kind: "status"; status: number }
  | { kind: "notRedirect301" }; // 誤リダイレクトされていないことの確認

async function checkCase(category: string, path: string, expect: Expect) {
  const r = await fetchManual(path);
  const got = `${r.status}${r.location ? ` → ${r.location}` : ""}`;
  switch (expect.kind) {
    case "redirect": {
      if (r.status !== expect.status) {
        record(category, path, false, `expected ${expect.status}, got ${got}`);
        return;
      }
      const loc = r.location ?? "";
      if (!expect.location.test(loc)) {
        record(category, path, false, `expected location ${expect.location}, got ${got}`);
        return;
      }
      record(category, path, true, got);
      return;
    }
    case "status": {
      if (r.status !== expect.status) {
        record(category, path, false, `expected ${expect.status}, got ${got}`);
        return;
      }
      record(category, path, true, got);
      return;
    }
    case "notRedirect301": {
      if (r.status === 301) {
        record(category, path, false, `was incorrectly 301-redirected to ${r.location}`);
        return;
      }
      record(category, path, true, got);
      return;
    }
  }
}

// === 1. リダイレクト仕様の検証 ===
async function checkRedirectSpecs() {
  // ページネーション URL は誤リダイレクトされないこと (旧 utcode.net の /articles/{2..8,10} 対策)
  for (const n of [2, 3, 4, 5, 6, 7, 8, 10]) {
    await checkCase("PAGINATION", `/articles/${n}`, { kind: "notRedirect301" });
  }

  // articles format2 の dash separator 拡張
  await checkCase("ARTICLES", "/articles/2024/05-14-may-festival/", {
    kind: "redirect",
    status: 301,
    location: /\/articles\/2024-05-14-may-festival/,
  });

  // members
  await checkCase("MEMBERS", "/members/2025/yosei-iwasaki/", {
    kind: "redirect",
    status: 301,
    location: /\/members\/yosei-iwasaki/,
  });
  await checkCase("MEMBERS", "/members/2024/some-slug/", {
    kind: "redirect",
    status: 301,
    location: /\/members\/some-slug/,
  });

  // projects (festival/hackathon マルチセグメント)
  await checkCase("PROJECTS", "/projects/festival/kf73/code-vs-code/", {
    kind: "redirect",
    status: 301,
    location: /\/projects\/code-vs-code/,
  });
  await checkCase("PROJECTS", "/projects/hackathon/2024-06-08/bowling/", {
    kind: "redirect",
    status: 301,
    location: /\/projects\/bowling/,
  });

  // projects kind
  await checkCase("PROJECTS_KIND", "/projects/festival", {
    kind: "redirect",
    status: 301,
    location: /\/projects\?category=festival/,
  });
  await checkCase("PROJECTS_KIND", "/projects/hackathon", {
    kind: "redirect",
    status: 301,
    location: /\/projects\?category=hackathon/,
  });
  await checkCase("PROJECTS_KIND", "/projects/long-term", {
    kind: "redirect",
    status: 301,
    location: /\/projects(\?|$)/,
  });

  // contact / welcome / activities
  await checkCase("MISC", "/contact/", {
    kind: "redirect",
    status: 301,
    location: /\/about/,
  });
  await checkCase("MISC", "/welcome-events/", {
    kind: "redirect",
    status: 301,
    location: /\/join\/welcome-events/,
  });
  await checkCase("MISC", "/welcome-events-2025-summer/", {
    kind: "redirect",
    status: 301,
    location: /\/join\/welcome-events/,
  });
  for (const sub of ["learn", "share", "develop"]) {
    await checkCase("MISC", `/activities/${sub}/`, {
      kind: "redirect",
      status: 301,
      location: /\/activities/,
    });
  }

  // sitemap
  await checkCase("SITEMAP", "/sitemap-index.xml", {
    kind: "redirect",
    status: 301,
    location: /\/sitemap\.xml/,
  });
  await checkCase("SITEMAP", "/sitemap-0.xml", {
    kind: "redirect",
    status: 301,
    location: /\/sitemap\.xml/,
  });

  // 既存 articles format2 (sanity check)
  await checkCase("ARTICLES", "/articles/2024/07-13_s-specialized-seminar-report-2/", {
    kind: "redirect",
    status: 301,
    location: /\/articles\/2024-07-13-s-specialized-seminar-report-2/,
  });
}

// === 2. soft-404 の検出 ===
async function checkSoft404() {
  // 存在しない project slug は 404 を返すべき (旧実装は 200 で「見つかりません」テンプレ)
  const r = await fetchFollow("/projects/this-project-totally-does-not-exist-xyz123");
  record("SOFT_404", "/projects/<missing>", r.status === 404, `status=${r.status}`);
}

// === 3. SEO メタタグ ===
async function checkMeta() {
  const r = await fetchFollow("/");
  const ogLocale =
    /(?:property|name)=["']og:locale["'][^>]*content=["']ja_JP["']/i.test(r.body) ||
    /content=["']ja_JP["'][^>]*(?:property|name)=["']og:locale["']/i.test(r.body);
  const twitterSite =
    /name=["']twitter:site["'][^>]*content=["']@[^"']+["']/i.test(r.body) ||
    /content=["']@[^"']+["'][^>]*name=["']twitter:site["']/i.test(r.body);
  record("META", "og:locale=ja_JP", ogLocale, ogLocale ? "found" : "missing on /");
  record("META", "twitter:site", twitterSite, twitterSite ? "found" : "missing on /");
}

// === 4. no-image fallback ===
async function checkNoImage() {
  // 旧 28 件のうち代表サンプル。
  // SvelteKit の hydration payload には生データ (`coverUrl: "+/images/..."`) が含まれることがあるが、
  // それは描画には使われない。実際にレンダリングされる属性 (img[src], meta[content], JSON-LD) のみ検査する。
  const samples = [
    "/articles/2019-11-03-utcode-lectures-01",
    "/articles/2021-09-24-tuk-programming-workshop",
    "/articles/2022-07-15-summer-events",
    "/articles/2019-09-30-2019a-schedule",
  ];
  const brokenPattern = /\+\/images\/no-image\.svg/;
  const renderingChecks: Array<{ name: string; re: RegExp }> = [
    { name: "img[src]", re: /<img\b[^>]*\bsrc\s*=\s*["'][^"']*\+\/images\/no-image\.svg/i },
    {
      name: "og:image",
      re: /<meta\b[^>]*\bproperty\s*=\s*["']og:image["'][^>]*\bcontent\s*=\s*["'][^"']*\+\/images\/no-image\.svg/i,
    },
    {
      name: "og:image (reverse)",
      re: /<meta\b[^>]*\bcontent\s*=\s*["'][^"']*\+\/images\/no-image\.svg["'][^>]*\bproperty\s*=\s*["']og:image["']/i,
    },
    {
      name: "twitter:image",
      re: /<meta\b[^>]*\bname\s*=\s*["']twitter:image["'][^>]*\bcontent\s*=\s*["'][^"']*\+\/images\/no-image\.svg/i,
    },
    {
      name: "twitter:image (reverse)",
      re: /<meta\b[^>]*\bcontent\s*=\s*["'][^"']*\+\/images\/no-image\.svg["'][^>]*\bname\s*=\s*["']twitter:image["']/i,
    },
  ];
  for (const path of samples) {
    const r = await fetchFollow(path);
    if (r.status !== 200) {
      record("NO_IMAGE", path, false, `article not reachable (status=${r.status})`);
      continue;
    }
    const failures = renderingChecks.filter((c) => c.re.test(r.body)).map((c) => c.name);
    // JSON-LD inside <script type="application/ld+json"> の image フィールドも検査
    const ldJsonMatch = r.body.match(
      /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/i,
    );
    if (ldJsonMatch?.[1]) {
      const imageMatch = ldJsonMatch[1].match(/"image"\s*:\s*"([^"]+)"/);
      if (imageMatch?.[1] && brokenPattern.test(imageMatch[1])) {
        failures.push("ld+json image");
      }
    }
    if (failures.length > 0) {
      record("NO_IMAGE", path, false, `broken in: ${failures.join(", ")}`);
    } else {
      record("NO_IMAGE", path, true, "ok");
    }
  }
}

// === 5. 認可ガード ===
async function checkAuth() {
  const admin = await fetchManual("/admin");
  const adminOk =
    (admin.status === 302 || admin.status === 303 || admin.status === 307) &&
    /\/login/.test(admin.location ?? "");
  record(
    "AUTH",
    "/admin redirects to /login",
    adminOk,
    `${admin.status}${admin.location ? ` → ${admin.location}` : ""}`,
  );

  const sse = await fetchManual("/api/migration/events");
  record("AUTH", "/api/migration/events 401", sse.status === 401, `status=${sse.status}`);
}

// === 6. 旧 sitemap サンプリング ===
async function checkSitemapSamples() {
  let xml: string;
  try {
    const res = await fetch(`${OLD_BASE}/sitemap-0.xml`);
    if (!res.ok) {
      record("SITEMAP_SAMPLE", "fetch old sitemap", false, `${res.status}`);
      return;
    }
    xml = await res.text();
  } catch (e) {
    record("SITEMAP_SAMPLE", "fetch old sitemap", false, `${(e as Error).message}`);
    return;
  }

  const allPaths = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((m) => {
      try {
        return new URL(m[1]).pathname;
      } catch {
        return null;
      }
    })
    .filter((p): p is string => p !== null);

  // カテゴリ別にサンプリング: 各プレフィックスから最大 N 件
  const buckets: Record<string, string[]> = {};
  for (const p of allPaths) {
    const key = p.split("/").slice(0, 3).join("/") || "/";
    const bucket = buckets[key] ?? [];
    bucket.push(p);
    buckets[key] = bucket;
  }
  const sampled: string[] = [];
  for (const paths of Object.values(buckets)) {
    sampled.push(...paths.slice(0, 3));
  }

  let pass = 0;
  let fail = 0;
  const failed: string[] = [];

  for (const path of sampled) {
    const r = await fetchManual(path);
    if (r.status === 200) {
      pass++;
      continue;
    }
    if (r.status === 301 || r.status === 308) {
      const followUrl = r.location?.startsWith("http")
        ? r.location
        : `${NEW_BASE}${r.location ?? ""}`;
      try {
        const followed = await fetch(followUrl, { redirect: "follow" });
        if (followed.ok) {
          pass++;
        } else {
          fail++;
          failed.push(`${path} → ${r.location} → ${followed.status}`);
        }
      } catch (e) {
        fail++;
        failed.push(`${path} → ${r.location} → ${(e as Error).message}`);
      }
      continue;
    }
    fail++;
    failed.push(`${path} → ${r.status}`);
  }

  const detail = `${pass}/${sampled.length} reachable${
    failed.length > 0
      ? `\n    - ${failed.slice(0, 20).join("\n    - ")}${failed.length > 20 ? `\n    - ... (${failed.length - 20} more)` : ""}`
      : ""
  }`;
  record(
    "SITEMAP_SAMPLE",
    `${sampled.length} URLs across ${Object.keys(buckets).length} buckets`,
    fail === 0,
    detail,
  );
}

async function main() {
  process.stdout.write(`Checking ${NEW_BASE} (old reference: ${OLD_BASE})\n\n`);

  process.stdout.write("--- 1. URL リダイレクト仕様 ---\n");
  await checkRedirectSpecs();

  process.stdout.write("\n--- 2. Soft-404 ---\n");
  await checkSoft404();

  process.stdout.write("\n--- 3. SEO メタタグ ---\n");
  await checkMeta();

  process.stdout.write("\n--- 4. no-image フォールバック ---\n");
  await checkNoImage();

  process.stdout.write("\n--- 5. 認可ガード ---\n");
  await checkAuth();

  process.stdout.write("\n--- 6. 旧 sitemap サンプリング ---\n");
  await checkSitemapSamples();

  const total = results.length;
  const passed = results.filter((r) => r.pass).length;
  const failed = total - passed;
  process.stdout.write(`\n=== Summary ===\n`);
  process.stdout.write(`Total: ${total}, Passed: ${passed}, Failed: ${failed}\n`);
  if (failed > 0) {
    process.stdout.write("\nFailed checks:\n");
    for (const r of results.filter((r) => !r.pass)) {
      process.stdout.write(`  ✗ [${r.category}] ${r.name} — ${r.detail}\n`);
    }
    process.exit(1);
  }
}

await main();
