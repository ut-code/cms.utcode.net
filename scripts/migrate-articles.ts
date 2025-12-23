/**
 * Migration script: Import articles from old utcode.net (Astro) to new CMS
 *
 * Usage:
 *   bun run scripts/migrate-articles.ts [--dry-run]
 *
 * Options:
 *   --dry-run   Preview migration without writing to database
 *
 * Prerequisites:
 *   - Old utcode.net repo at ../utcode.net
 *   - DATABASE_URL and DATABASE_AUTH_TOKEN env vars set
 */

import { readdir, readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { createClient } from "@libsql/client";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/libsql";
import { parse as parseYaml } from "yaml";
import { article, member } from "../src/lib/shared/models/schema";

// Create database client directly (not using SvelteKit path aliases)
const DATABASE_URL = process.env.DATABASE_URL;
const DATABASE_AUTH_TOKEN = process.env.DATABASE_AUTH_TOKEN;

if (!DATABASE_URL) {
  console.error("ERROR: DATABASE_URL environment variable is required");
  console.error("Usage: DATABASE_URL=... bun run scripts/migrate-articles.ts");
  process.exit(1);
}

const client = createClient({
  url: DATABASE_URL,
  authToken: DATABASE_AUTH_TOKEN,
});

const db = drizzle(client, { schema: { article, member } });

const OLD_SITE_PATH = join(import.meta.dirname, "../../utcode.net");
const ARTICLES_PATH = join(OLD_SITE_PATH, "contents/articles");

interface OldArticleFrontmatter {
  title: string;
  date: string;
  categories?: string[];
  thumbnail?: {
    src: string;
    position?: string;
    fit?: string;
    bg?: string;
  };
  author?: string; // format: "YYYY/member-slug"
}

interface MigrationResult {
  slug: string;
  title: string;
  status: "created" | "skipped" | "error";
  reason?: string;
}

function parseFrontmatter(content: string): {
  frontmatter: OldArticleFrontmatter;
  body: string;
} {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) {
    throw new Error("Invalid frontmatter format");
  }
  return {
    frontmatter: parseYaml(match[1]) as OldArticleFrontmatter,
    body: match[2].trim(),
  };
}

function generateSlug(dirPath: string): string {
  // Extract from path like "2022/07-15_summer-events"
  const parts = dirPath.split("/");
  const year = parts[parts.length - 2];
  const name = parts[parts.length - 1];
  // Convert "07-15_summer-events" to "2022-07-15-summer-events"
  const [monthDay, ...rest] = name.split("_");
  return `${year}-${monthDay}-${rest.join("-")}`;
}

function extractMemberSlug(authorRef: string | undefined): string | undefined {
  if (!authorRef) return undefined;
  // "2021/tatsuhiko-nagaya" -> "tatsuhiko-nagaya"
  const parts = authorRef.split("/");
  return parts[parts.length - 1];
}

function generateExcerpt(content: string, maxLength = 200): string {
  // Remove markdown formatting and get first paragraph
  const plain = content
    .replace(/!\[.*?\]\(.*?\)/g, "") // remove images
    .replace(/\[([^\]]+)\]\(.*?\)/g, "$1") // convert links to text
    .replace(/#{1,6}\s+/g, "") // remove headings
    .replace(/\*\*([^*]+)\*\*/g, "$1") // remove bold
    .replace(/\*([^*]+)\*/g, "$1") // remove italic
    .replace(/`([^`]+)`/g, "$1") // remove code
    .replace(/\n+/g, " ") // normalize newlines
    .trim();

  if (plain.length <= maxLength) return plain;
  return `${plain.slice(0, maxLength).replace(/\s+\S*$/, "")}...`;
}

async function findArticleFiles(): Promise<string[]> {
  const files: string[] = [];

  async function walk(dir: string): Promise<void> {
    const entries = await readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      if (entry.isDirectory()) {
        await walk(fullPath);
      } else if (entry.name === "index.md" || entry.name === "index.mdx") {
        files.push(fullPath);
      }
    }
  }

  await walk(ARTICLES_PATH);
  return files.sort();
}

async function getMemberIdBySlug(slug: string): Promise<string | null> {
  const result = await db
    .select({ id: member.id })
    .from(member)
    .where(eq(member.slug, slug))
    .limit(1);
  return result[0]?.id ?? null;
}

async function articleExists(slug: string): Promise<boolean> {
  const result = await db
    .select({ id: article.id })
    .from(article)
    .where(eq(article.slug, slug))
    .limit(1);
  return result.length > 0;
}

function extractErrorMessage(error: unknown): string {
  if (!(error instanceof Error)) return String(error);

  // Drizzle errors include full SQL with params - extract just the error type
  const message = error.message;

  // Check for common SQLite/Drizzle errors
  if (message.includes("UNIQUE constraint failed")) {
    const match = message.match(/UNIQUE constraint failed: (\S+)/);
    return match ? `Duplicate ${match[1]}` : "Unique constraint violation";
  }
  if (message.includes("FOREIGN KEY constraint failed")) {
    return "Foreign key constraint failed (invalid reference)";
  }
  if (message.includes("NOT NULL constraint failed")) {
    const match = message.match(/NOT NULL constraint failed: (\S+)/);
    return match ? `Missing required field: ${match[1]}` : "Missing required field";
  }

  // libsql/turso error format: "Failed query: ... \n params: ..." followed by cause
  // Try to extract meaningful error from the cause chain
  if ("cause" in error && error.cause) {
    const cause = error.cause;
    if (cause instanceof Error) {
      return extractErrorMessage(cause);
    }
    return String(cause);
  }

  // For "Failed query" messages, the actual error may be truncated
  if (message.startsWith("Failed query:")) {
    // Look for error details after params
    const paramsIdx = message.indexOf("params:");
    if (paramsIdx !== -1) {
      // Find any error info after the params section
      const afterParams = message.slice(paramsIdx);
      const errorMatch = afterParams.match(/error[:\s]+(.+)/i);
      if (errorMatch) {
        return errorMatch[1].slice(0, 200);
      }
    }
    return "Database insert failed (check connection/migration)";
  }

  // For other errors, truncate if it contains SQL params
  if (message.includes("params:")) {
    const idx = message.indexOf("params:");
    return message.slice(0, idx).trim();
  }

  // Truncate very long messages
  if (message.length > 200) {
    return `${message.slice(0, 200)}...`;
  }

  return message;
}

async function migrateArticle(filePath: string, dryRun: boolean): Promise<MigrationResult> {
  const relPath = filePath.replace(`${ARTICLES_PATH}/`, "");
  const dirPath = dirname(relPath);
  const slug = generateSlug(dirPath);

  let title = "";
  try {
    // Parse file first to get title for error reporting
    const content = await readFile(filePath, "utf-8");
    const { frontmatter, body } = parseFrontmatter(content);
    title = frontmatter.title;

    // Check if already exists
    if (await articleExists(slug)) {
      return { slug, title, status: "skipped", reason: "Already exists" };
    }

    // Resolve author
    const memberSlug = extractMemberSlug(frontmatter.author);
    const authorId = memberSlug ? await getMemberIdBySlug(memberSlug) : null;

    // Parse date
    const publishedAt = new Date(frontmatter.date);

    // Generate excerpt
    const excerpt = generateExcerpt(body);

    // Note: thumbnail images are not migrated automatically
    // They would need to be uploaded to S3 separately
    const coverUrl = frontmatter.thumbnail?.src ?? null;

    if (dryRun) {
      console.log(`[DRY RUN] Would create: ${slug}`);
      console.log(`  Title: ${frontmatter.title}`);
      console.log(`  Date: ${publishedAt.toISOString()}`);
      console.log(`  Author: ${memberSlug ?? "none"} -> ${authorId ?? "null"}`);
      console.log(`  Excerpt: ${excerpt.slice(0, 50)}...`);
      console.log();
      return { slug, title, status: "created" };
    }

    // Insert into database
    await db.insert(article).values({
      slug,
      title: frontmatter.title,
      content: body,
      excerpt,
      coverUrl,
      authorId,
      published: true,
      publishedAt,
      viewCount: 0,
    });

    console.log(`✓ Created: ${slug}`);
    return { slug, title, status: "created" };
  } catch (error) {
    const reason = extractErrorMessage(error);
    return { slug, title, status: "error", reason };
  }
}

async function main(): Promise<void> {
  const dryRun = process.argv.includes("--dry-run");

  console.log("=== Article Migration ===");
  console.log(`Mode: ${dryRun ? "DRY RUN" : "LIVE"}`);
  console.log(`Source: ${ARTICLES_PATH}`);
  console.log();

  const files = await findArticleFiles();
  console.log(`Found ${files.length} articles`);
  console.log();

  const results: MigrationResult[] = [];

  for (const file of files) {
    const result = await migrateArticle(file, dryRun);
    results.push(result);

    if (result.status === "error") {
      console.error(`ERROR: ${result.slug} - ${result.reason}`);
    }
  }

  // Summary
  const created = results.filter((r) => r.status === "created").length;
  const skipped = results.filter((r) => r.status === "skipped").length;
  const errors = results.filter((r) => r.status === "error").length;

  console.log("=== Summary ===");
  console.log(`Created: ${created}`);
  console.log(`Skipped: ${skipped}`);
  console.log(`Errors: ${errors}`);

  if (errors > 0) {
    console.log("\nErrors:");
    for (const r of results.filter((r) => r.status === "error")) {
      console.log(`  ${r.slug}: ${r.reason}`);
    }
  }
}

main().catch(console.error);
