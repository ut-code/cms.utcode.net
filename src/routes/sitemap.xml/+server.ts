import { listPublishedArticles } from "$lib/server/database/articles.server";
import { listMembers } from "$lib/server/database/members.server";
import { listProjects } from "$lib/server/database/projects.server";

const SITE = "https://cms.utcode.net";

const staticPages = [
  { path: "/", priority: "1.0", changefreq: "weekly" },
  { path: "/about", priority: "0.8", changefreq: "monthly" },
  { path: "/about/faq", priority: "0.6", changefreq: "monthly" },
  { path: "/articles", priority: "0.9", changefreq: "daily" },
  { path: "/projects", priority: "0.9", changefreq: "weekly" },
  { path: "/members", priority: "0.7", changefreq: "weekly" },
  { path: "/activities", priority: "0.7", changefreq: "monthly" },
  { path: "/join", priority: "0.8", changefreq: "monthly" },
  { path: "/join/welcome-events", priority: "0.7", changefreq: "monthly" },
  { path: "/donation", priority: "0.5", changefreq: "yearly" },
];

function escapeXml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function formatDate(date: Date) {
  return date.toISOString().split("T")[0];
}

export async function GET() {
  const [articles, projects, members] = await Promise.all([
    listPublishedArticles(1000),
    listProjects(1000),
    listMembers(1000),
  ]);

  const urls = [
    ...staticPages.map(
      (p) => `  <url>
    <loc>${SITE}${p.path}</loc>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`,
    ),
    ...articles.map(
      (a) => `  <url>
    <loc>${SITE}/articles/${escapeXml(a.slug)}</loc>
    <lastmod>${formatDate(a.updatedAt)}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`,
    ),
    ...projects.map(
      (p) => `  <url>
    <loc>${SITE}/projects/${escapeXml(p.slug)}</loc>
    <lastmod>${formatDate(p.updatedAt)}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`,
    ),
    ...members.map(
      (m) => `  <url>
    <loc>${SITE}/members/${escapeXml(m.slug)}</loc>
    <lastmod>${formatDate(m.updatedAt)}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>`,
    ),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
