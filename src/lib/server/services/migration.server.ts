/**
 * Data migration service: Import data from old utcode.net repo
 *
 * This service clones the old site repo, parses markdown files,
 * and imports members, articles, and projects into the database.
 */

import { spawn } from "node:child_process";
import { readdir, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { basename, dirname, join } from "node:path";
import { eq } from "drizzle-orm";
import * as v from "valibot";
import { parse as parseYaml } from "yaml";
import { db } from "$lib/server/drivers/db";
import {
  article,
  member,
  type ProjectCategory,
  project,
  projectMember,
} from "$lib/shared/models/schema";
import {
  completeMigration,
  failMigration,
  isRunning,
  log,
  startMigration,
} from "./migration-state.server";

const REPO_URL = "https://github.com/ut-code/utcode.net.git";

async function runCommand(cmd: string, args: string[], cwd?: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { cwd, stdio: "pipe" });
    let stderr = "";
    child.stderr?.on("data", (data: Buffer) => {
      stderr += data.toString();
    });
    child.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${cmd} failed: ${stderr}`));
    });
    child.on("error", reject);
  });
}

async function cloneRepo(): Promise<string> {
  const tempDir = join(tmpdir(), `utcode-migration-${Date.now()}`);
  log(`Cloning ${REPO_URL}...`);
  await runCommand("git", ["clone", "--depth", "1", REPO_URL, tempDir]);
  log("Repository cloned successfully");
  return tempDir;
}

function parseFrontmatter<T>(
  content: string,
  schema: v.GenericSchema<unknown, T>,
): { frontmatter: T; body: string } {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  const frontmatterStr = match?.[1];
  const bodyStr = match?.[2];
  if (!frontmatterStr || bodyStr === undefined) {
    throw new Error("Invalid frontmatter format");
  }
  const parsed = parseYaml(frontmatterStr);
  const frontmatter = v.parse(schema, parsed);
  return { frontmatter, body: bodyStr.trim() };
}

async function findMarkdownFiles(basePath: string): Promise<string[]> {
  const files: string[] = [];
  async function walk(dir: string): Promise<void> {
    try {
      const entries = await readdir(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = join(dir, entry.name);
        if (entry.isDirectory()) {
          await walk(fullPath);
        } else if (entry.name === "index.md" || entry.name === "index.mdx") {
          files.push(fullPath);
        }
      }
    } catch {
      // Directory doesn't exist, skip
    }
  }
  await walk(basePath);
  return files.sort();
}

// Member migration
const MemberFrontmatterSchema = v.object({
  nameJa: v.string(),
  description: v.optional(v.string()),
  faceImage: v.optional(v.string()),
  upperBodyImage: v.optional(v.string()),
  github: v.optional(v.string()),
  twitter: v.optional(v.string()),
  website: v.optional(v.string()),
});

async function migrateMembers(
  repoPath: string,
): Promise<{ created: number; skipped: number; errors: number }> {
  log("--- Migrating Members ---");
  const membersPath = join(repoPath, "contents/members");
  const files = await findMarkdownFiles(membersPath);
  log(`Found ${files.length} member files`);

  let created = 0;
  let skipped = 0;
  let errorCount = 0;

  for (const file of files) {
    const relPath = file.replace(`${membersPath}/`, "");
    const parts = dirname(relPath).split("/");
    const slug = parts.at(-1);
    if (!slug) continue;

    try {
      const content = await readFile(file, "utf-8");
      const { frontmatter, body } = parseFrontmatter(content, MemberFrontmatterSchema);

      // Check if exists
      const existing = await db
        .select({ id: member.id })
        .from(member)
        .where(eq(member.slug, slug))
        .limit(1);

      if (existing.length > 0) {
        log(`  ⊘ Skipped: ${slug} (already exists)`);
        skipped++;
        continue;
      }

      // Build bio
      const bioLines: string[] = [];
      if (frontmatter.description) bioLines.push(frontmatter.description);
      if (frontmatter.github) bioLines.push(`GitHub: @${frontmatter.github}`);
      if (frontmatter.twitter) bioLines.push(`Twitter: @${frontmatter.twitter}`);
      if (frontmatter.website) bioLines.push(`Web: ${frontmatter.website}`);

      await db.insert(member).values({
        slug,
        name: frontmatter.nameJa,
        bio: bioLines.join("\n") || null,
        imageUrl: frontmatter.faceImage ?? frontmatter.upperBodyImage ?? null,
        pageContent: body || null,
      });

      log(`  ✓ Created: ${slug} (${frontmatter.nameJa})`);
      created++;
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      log(`  ✗ Error: ${slug} - ${msg}`);
      errorCount++;
    }
  }

  log(`Members: ${created} created, ${skipped} skipped, ${errorCount} errors`);
  return { created, skipped, errors: errorCount };
}

// Article migration
const ArticleFrontmatterSchema = v.object({
  title: v.string(),
  date: v.string(),
  thumbnail: v.optional(v.object({ src: v.string() })),
  author: v.optional(v.string()),
});

function generateArticleSlug(dirPath: string): string {
  const parts = dirPath.split("/");
  const year = parts.at(-2) ?? "";
  const name = parts.at(-1) ?? "";
  const [monthDay = "", ...rest] = name.split("_");
  return `${year}-${monthDay}-${rest.join("-")}`;
}

function generateExcerpt(content: string, maxLength = 200): string {
  const plain = content
    .replace(/!\[.*?\]\(.*?\)/g, "")
    .replace(/\[([^\]]+)\]\(.*?\)/g, "$1")
    .replace(/#{1,6}\s+/g, "")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\n+/g, " ")
    .trim();

  if (plain.length <= maxLength) return plain;
  return `${plain.slice(0, maxLength).replace(/\s+\S*$/, "")}...`;
}

async function migrateArticles(
  repoPath: string,
): Promise<{ created: number; skipped: number; errors: number }> {
  log("--- Migrating Articles ---");
  const articlesPath = join(repoPath, "contents/articles");
  const files = await findMarkdownFiles(articlesPath);
  log(`Found ${files.length} article files`);

  let created = 0;
  let skipped = 0;
  let errorCount = 0;

  for (const file of files) {
    const relPath = file.replace(`${articlesPath}/`, "");
    const slug = generateArticleSlug(dirname(relPath));

    try {
      const content = await readFile(file, "utf-8");
      const { frontmatter, body } = parseFrontmatter(content, ArticleFrontmatterSchema);

      // Check if exists
      const existing = await db
        .select({ id: article.id })
        .from(article)
        .where(eq(article.slug, slug))
        .limit(1);

      if (existing.length > 0) {
        log(`  ⊘ Skipped: ${slug} (already exists)`);
        skipped++;
        continue;
      }

      // Resolve author
      let authorId: string | null = null;
      if (frontmatter.author) {
        const memberSlug = frontmatter.author.split("/").pop();
        if (memberSlug) {
          const authorResult = await db
            .select({ id: member.id })
            .from(member)
            .where(eq(member.slug, memberSlug))
            .limit(1);
          authorId = authorResult[0]?.id ?? null;
        }
      }

      await db.insert(article).values({
        slug,
        title: frontmatter.title,
        content: body,
        excerpt: generateExcerpt(body),
        coverUrl: frontmatter.thumbnail?.src ?? null,
        authorId,
        published: true,
        publishedAt: new Date(frontmatter.date),
        viewCount: 0,
      });

      log(`  ✓ Created: ${slug}`);
      created++;
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      log(`  ✗ Error: ${slug} - ${msg}`);
      errorCount++;
    }
  }

  log(`Articles: ${created} created, ${skipped} skipped, ${errorCount} errors`);
  return { created, skipped, errors: errorCount };
}

// Project migration
const ProjectFrontmatterSchema = v.object({
  app: v.optional(
    v.object({
      name: v.string(),
      description: v.optional(v.string()),
      url: v.optional(v.string()),
    }),
  ),
  kind: v.optional(v.string()),
  thumbnail: v.optional(v.object({ src: v.optional(v.string()) })),
  social: v.optional(v.object({ github: v.optional(v.string()) })),
  members: v.optional(v.array(v.string())),
});

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

async function migrateProjects(
  repoPath: string,
): Promise<{ created: number; skipped: number; errors: number }> {
  log("--- Migrating Projects ---");
  const projectsPath = join(repoPath, "contents/projects");
  const files = await findMarkdownFiles(projectsPath);
  log(`Found ${files.length} project files`);

  let created = 0;
  let skipped = 0;
  let errorCount = 0;

  for (const file of files) {
    const dirPath = dirname(file);
    const slug = basename(dirPath);

    try {
      const content = await readFile(file, "utf-8");
      const { frontmatter, body } = parseFrontmatter(content, ProjectFrontmatterSchema);
      const name = frontmatter.app?.name ?? slug;

      // Check if exists
      const existing = await db
        .select({ id: project.id })
        .from(project)
        .where(eq(project.slug, slug))
        .limit(1);

      if (existing.length > 0) {
        log(`  ⊘ Skipped: ${slug} (already exists)`);
        skipped++;
        continue;
      }

      // Insert project
      const [inserted] = await db
        .insert(project)
        .values({
          slug,
          name,
          description: frontmatter.app?.description ?? null,
          content: body || null,
          coverUrl: frontmatter.thumbnail?.src ?? null,
          repoUrl: frontmatter.social?.github ?? null,
          demoUrl: frontmatter.app?.url ?? null,
          category: mapCategory(frontmatter.kind),
        })
        .returning({ id: project.id });

      // Link members
      if (frontmatter.members && inserted) {
        for (const memberRef of frontmatter.members) {
          const memberSlug = memberRef.split("/").pop();
          if (!memberSlug) continue;

          const memberResult = await db
            .select({ id: member.id })
            .from(member)
            .where(eq(member.slug, memberSlug))
            .limit(1);

          if (memberResult[0]) {
            await db.insert(projectMember).values({
              projectId: inserted.id,
              memberId: memberResult[0].id,
              role: "member",
            });
          }
        }
      }

      log(`  ✓ Created: ${slug} (${name})`);
      created++;
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      log(`  ✗ Error: ${slug} - ${msg}`);
      errorCount++;
    }
  }

  log(`Projects: ${created} created, ${skipped} skipped, ${errorCount} errors`);
  return { created, skipped, errors: errorCount };
}

export function startDataMigration(): { started: boolean; message: string } {
  if (isRunning()) {
    return { started: false, message: "Migration already in progress" };
  }

  startMigration();
  log("=== Data Migration Started ===");

  // Run migration in background (fire and forget with proper error handling)
  runMigrationAsync().catch(console.error);

  return { started: true, message: "Migration started" };
}

async function runMigrationAsync(): Promise<void> {
  let repoPath: string | null = null;

  try {
    // Clone repo
    repoPath = await cloneRepo();

    // Run migrations in order (members first, then articles/projects)
    const members = await migrateMembers(repoPath);
    const articles = await migrateArticles(repoPath);
    const projects = await migrateProjects(repoPath);

    log("=== Migration Complete ===");
    completeMigration({ members, articles, projects });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    log(`=== Migration Failed: ${msg} ===`);
    failMigration(msg);
  } finally {
    // Cleanup
    if (repoPath) {
      log("Cleaning up temporary files...");
      await rm(repoPath, { recursive: true, force: true }).catch(() => {});
    }
  }
}
