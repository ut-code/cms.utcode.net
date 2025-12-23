/**
 * Migration script: Import projects from old utcode.net (Astro) to new CMS
 *
 * Usage:
 *   bun --env-file=.env run scripts/migrate-projects.ts [--dry-run]
 *
 * Prerequisites:
 *   - Old utcode.net repo at ../utcode.net
 *   - DATABASE_URL env var set
 */

import { readdir, readFile } from "node:fs/promises";
import { basename, dirname, join } from "node:path";
import { createClient } from "@libsql/client";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/libsql";
import { parse as parseYaml } from "yaml";
import {
  member,
  type ProjectCategory,
  project,
  projectMember,
} from "../src/lib/shared/models/schema";

// Database setup
const DATABASE_URL = process.env.DATABASE_URL;
const DATABASE_AUTH_TOKEN = process.env.DATABASE_AUTH_TOKEN;

if (!DATABASE_URL) {
  console.error("ERROR: DATABASE_URL environment variable is required");
  console.error("Usage: DATABASE_URL=... bun run scripts/migrate-projects.ts");
  process.exit(1);
}

const client = createClient({
  url: DATABASE_URL,
  authToken: DATABASE_AUTH_TOKEN,
});

const db = drizzle(client, { schema: { project, member, projectMember } });

const OLD_SITE_PATH = join(import.meta.dirname, "../../utcode.net");
const PROJECTS_PATH = join(OLD_SITE_PATH, "contents/projects");

interface OldProjectFrontmatter {
  app?: {
    name: string;
    description?: string;
    url?: string;
    platform?: string[];
    domain?: string[];
  };
  date?: string;
  kind?: "long-term" | "hackathon" | "festival" | "personal";
  status?: string;
  tags?: string[];
  thumbnail?: {
    src?: string;
  };
  social?: {
    github?: string;
  };
  members?: string[]; // format: "YYYY/member-slug"
}

interface MigrationResult {
  slug: string;
  name: string;
  status: "created" | "skipped" | "error";
  reason?: string;
}

function parseFrontmatter(content: string): {
  frontmatter: OldProjectFrontmatter;
  body: string;
} {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) {
    throw new Error("Invalid frontmatter format");
  }
  return {
    frontmatter: parseYaml(match[1]) as OldProjectFrontmatter,
    body: match[2].trim(),
  };
}

function mapCategory(kind: string | undefined): ProjectCategory {
  switch (kind) {
    case "long-term":
      return "active";
    case "hackathon":
      return "hackathon";
    case "festival":
      return "festival";
    case "personal":
      return "personal";
    default:
      return "active";
  }
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

async function findProjectFiles(): Promise<string[]> {
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

  await walk(PROJECTS_PATH);
  return files.sort();
}

async function projectExists(slug: string): Promise<boolean> {
  const result = await db
    .select({ id: project.id })
    .from(project)
    .where(eq(project.slug, slug))
    .limit(1);
  return result.length > 0;
}

async function getMemberIdBySlug(slug: string): Promise<string | null> {
  const result = await db
    .select({ id: member.id })
    .from(member)
    .where(eq(member.slug, slug))
    .limit(1);
  return result[0]?.id ?? null;
}

function extractMemberSlug(memberRef: string): string {
  // "2021/tatsuhiko-nagaya" -> "tatsuhiko-nagaya"
  const parts = memberRef.split("/");
  return parts[parts.length - 1];
}

async function migrateProject(filePath: string, dryRun: boolean): Promise<MigrationResult> {
  // Get slug from directory name
  const dirPath = dirname(filePath);
  const slug = basename(dirPath);

  let name = "";
  try {
    const content = await readFile(filePath, "utf-8");
    const { frontmatter, body } = parseFrontmatter(content);
    name = frontmatter.app?.name ?? slug;

    if (await projectExists(slug)) {
      return { slug, name, status: "skipped", reason: "Already exists" };
    }

    const description = frontmatter.app?.description ?? null;
    const demoUrl = frontmatter.app?.url ?? null;
    const repoUrl = frontmatter.social?.github ?? null;
    const coverUrl = frontmatter.thumbnail?.src ?? null;
    const category = mapCategory(frontmatter.kind);

    if (dryRun) {
      console.log(`[DRY RUN] Would create: ${slug}`);
      console.log(`  Name: ${name}`);
      console.log(`  Category: ${category}`);
      console.log(`  Description: ${description?.slice(0, 50) ?? "none"}...`);
      console.log(`  Demo: ${demoUrl ?? "none"}`);
      console.log(`  Repo: ${repoUrl ?? "none"}`);
      console.log(`  Members: ${frontmatter.members?.length ?? 0}`);
      console.log();
      return { slug, name, status: "created" };
    }

    // Insert project
    const [inserted] = await db
      .insert(project)
      .values({
        slug,
        name,
        description,
        content: body || null,
        coverUrl,
        repoUrl,
        demoUrl,
        category,
      })
      .returning({ id: project.id });

    // Link members if any
    if (frontmatter.members && inserted) {
      for (const memberRef of frontmatter.members) {
        const memberSlug = extractMemberSlug(memberRef);
        const memberId = await getMemberIdBySlug(memberSlug);
        if (memberId) {
          await db.insert(projectMember).values({
            projectId: inserted.id,
            memberId,
            role: "member",
          });
        }
      }
    }

    console.log(`✓ Created: ${slug} (${name})`);
    return { slug, name, status: "created" };
  } catch (error) {
    const reason = extractErrorMessage(error);
    return { slug, name, status: "error", reason };
  }
}

async function main(): Promise<void> {
  const dryRun = process.argv.includes("--dry-run");

  console.log("=== Project Migration ===");
  console.log(`Mode: ${dryRun ? "DRY RUN" : "LIVE"}`);
  console.log(`Source: ${PROJECTS_PATH}`);
  console.log();

  const files = await findProjectFiles();
  console.log(`Found ${files.length} projects`);
  console.log();

  const results: MigrationResult[] = [];

  for (const file of files) {
    const result = await migrateProject(file, dryRun);
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
