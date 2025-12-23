/**
 * Migration script: Import members from old utcode.net (Astro) to new CMS
 *
 * Usage:
 *   bun --env-file=.env run scripts/migrate-members.ts [--dry-run]
 *
 * Prerequisites:
 *   - Old utcode.net repo at ../utcode.net
 *   - DATABASE_URL env var set
 */

import { readdir, readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { createClient } from "@libsql/client";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/libsql";
import { parse as parseYaml } from "yaml";
import { member } from "../src/lib/shared/models/schema";

// Database setup
const DATABASE_URL = process.env.DATABASE_URL;
const DATABASE_AUTH_TOKEN = process.env.DATABASE_AUTH_TOKEN;

if (!DATABASE_URL) {
  console.error("ERROR: DATABASE_URL environment variable is required");
  console.error("Usage: DATABASE_URL=... bun run scripts/migrate-members.ts");
  process.exit(1);
}

const client = createClient({
  url: DATABASE_URL,
  authToken: DATABASE_AUTH_TOKEN,
});

const db = drizzle(client, { schema: { member } });

const OLD_SITE_PATH = join(import.meta.dirname, "../../utcode.net");
const MEMBERS_PATH = join(OLD_SITE_PATH, "contents/members");

interface OldMemberFrontmatter {
  nameJa: string;
  nameEn?: string;
  joinYear?: number;
  description?: string;
  faceImage?: string;
  upperBodyImage?: string;
  github?: string;
  twitter?: string;
  website?: string;
}

interface MigrationResult {
  slug: string;
  name: string;
  status: "created" | "skipped" | "error";
  reason?: string;
}

function parseFrontmatter(content: string): {
  frontmatter: OldMemberFrontmatter;
  body: string;
} {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) {
    throw new Error("Invalid frontmatter format");
  }
  return {
    frontmatter: parseYaml(match[1]) as OldMemberFrontmatter,
    body: match[2].trim(),
  };
}

function generateSlug(dirPath: string): string {
  // Extract from path like "2021/tatsuhiko-nagaya"
  const parts = dirPath.split("/");
  return parts[parts.length - 1]; // Just the slug part
}

function extractErrorMessage(error: unknown): string {
  if (!(error instanceof Error)) return String(error);
  const message = error.message;

  if (message.includes("UNIQUE constraint failed")) {
    const match = message.match(/UNIQUE constraint failed: (\S+)/);
    return match ? `Duplicate ${match[1]}` : "Unique constraint violation";
  }
  if ("cause" in error && error.cause instanceof Error) {
    return extractErrorMessage(error.cause);
  }
  if (message.startsWith("Failed query:")) {
    return "Database insert failed";
  }
  return message.length > 200 ? `${message.slice(0, 200)}...` : message;
}

async function findMemberFiles(): Promise<string[]> {
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

  await walk(MEMBERS_PATH);
  return files.sort();
}

async function memberExists(slug: string): Promise<boolean> {
  const result = await db
    .select({ id: member.id })
    .from(member)
    .where(eq(member.slug, slug))
    .limit(1);
  return result.length > 0;
}

async function migrateMember(filePath: string, dryRun: boolean): Promise<MigrationResult> {
  const relPath = filePath.replace(`${MEMBERS_PATH}/`, "");
  const dirPath = dirname(relPath);
  const slug = generateSlug(dirPath);

  let name = "";
  try {
    const content = await readFile(filePath, "utf-8");
    const { frontmatter, body } = parseFrontmatter(content);
    name = frontmatter.nameJa;

    if (await memberExists(slug)) {
      return { slug, name, status: "skipped", reason: "Already exists" };
    }

    // Build bio from description and social links
    const bioLines: string[] = [];
    if (frontmatter.description) {
      bioLines.push(frontmatter.description);
    }
    if (frontmatter.github) {
      bioLines.push(`GitHub: @${frontmatter.github}`);
    }
    if (frontmatter.twitter) {
      bioLines.push(`Twitter: @${frontmatter.twitter}`);
    }
    if (frontmatter.website) {
      bioLines.push(`Web: ${frontmatter.website}`);
    }

    const bio = bioLines.join("\n") || null;

    // Note: Images need to be uploaded separately
    // Old site uses relative paths like ./face.jpg
    const imageUrl = frontmatter.faceImage ?? frontmatter.upperBodyImage ?? null;

    if (dryRun) {
      console.log(`[DRY RUN] Would create: ${slug}`);
      console.log(`  Name: ${name}`);
      console.log(`  Bio: ${bio?.slice(0, 50) ?? "none"}...`);
      console.log(`  Page content: ${body.length} chars`);
      console.log();
      return { slug, name, status: "created" };
    }

    await db.insert(member).values({
      slug,
      name,
      bio,
      imageUrl,
      pageContent: body || null,
    });

    console.log(`✓ Created: ${slug} (${name})`);
    return { slug, name, status: "created" };
  } catch (error) {
    const reason = extractErrorMessage(error);
    return { slug, name, status: "error", reason };
  }
}

async function main(): Promise<void> {
  const dryRun = process.argv.includes("--dry-run");

  console.log("=== Member Migration ===");
  console.log(`Mode: ${dryRun ? "DRY RUN" : "LIVE"}`);
  console.log(`Source: ${MEMBERS_PATH}`);
  console.log();

  const files = await findMemberFiles();
  console.log(`Found ${files.length} members`);
  console.log();

  const results: MigrationResult[] = [];

  for (const file of files) {
    const result = await migrateMember(file, dryRun);
    results.push(result);

    if (result.status === "error") {
      console.error(`ERROR: ${result.slug} - ${result.reason}`);
    }
  }

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
