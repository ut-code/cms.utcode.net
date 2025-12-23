/**
 * Pure migration worker functions
 *
 * These functions handle the actual data migration logic without
 * managing state or orchestration. They receive a logger function
 * to report progress.
 */

import { readdir, readFile, stat } from "node:fs/promises";
import { basename, dirname, extname, join } from "node:path";
import { eq } from "drizzle-orm";
import * as v from "valibot";
import { parse as parseYaml } from "yaml";
import { env } from "$lib/env/env.server";
import { uploadBuffer } from "$lib/server/database/storage.server";
import { db } from "$lib/server/drivers/db";
import {
  article,
  member,
  type ProjectCategory,
  project,
  projectMember,
} from "$lib/shared/models/schema";
import type { MigrationResult } from "$lib/shared/types/migration";

export type Logger = (message: string) => void;

// Frontmatter schemas
export const MemberFrontmatterSchema = v.object({
  nameJa: v.string(),
  description: v.optional(v.string()),
  image: v.optional(v.string()),
  // Legacy fields for backward compatibility during migration
  faceImage: v.optional(v.string()),
  upperBodyImage: v.optional(v.string()),
  github: v.optional(v.string()),
  twitter: v.optional(v.string()),
  website: v.optional(v.string()),
});

export const ArticleFrontmatterSchema = v.object({
  title: v.string(),
  date: v.string(),
  thumbnail: v.optional(v.object({ src: v.string() })),
  author: v.optional(v.string()),
});

export const ProjectFrontmatterSchema = v.object({
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

// Helper functions
export function parseFrontmatter<T>(
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

export async function findMarkdownFiles(basePath: string): Promise<string[]> {
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

export function generateArticleSlug(dirPath: string): string {
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

function getMimeType(filePath: string): string {
  const ext = extname(filePath).toLowerCase();
  const mimeTypes: Record<string, string> = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".gif": "image/gif",
    ".webp": "image/webp",
    ".svg": "image/svg+xml",
  };
  return mimeTypes[ext] ?? "application/octet-stream";
}

/**
 * Process markdown content and upload embedded images
 * Replaces relative paths like ./image.webp with S3 URLs
 */
async function processContentImages(
  content: string,
  dirPath: string,
  folder: string,
  log: Logger,
): Promise<string> {
  // Match markdown images: ![alt](./path/to/image.ext)
  const imageRegex = /!\[([^\]]*)\]\(\.\/([^)]+)\)/g;
  let processedContent = content;
  const matches = [...content.matchAll(imageRegex)];

  for (const match of matches) {
    const [fullMatch, alt, relativePath] = match;
    if (!relativePath) continue;

    const imagePath = join(dirPath, relativePath);

    if (!(await fileExists(imagePath))) {
      log(`    ⊘ Image not found: ${relativePath}`);
      continue;
    }

    try {
      const buffer = await readFile(imagePath);
      const { url } = await uploadBuffer(
        buffer as Buffer,
        getMimeType(imagePath),
        basename(imagePath),
        folder,
      );
      processedContent = processedContent.replace(fullMatch, `![${alt}](${url})`);
      log(`    ✓ Uploaded: ${relativePath}`);
    } catch {
      log(`    ✗ Failed to upload: ${relativePath}`);
    }
  }

  return processedContent;
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await stat(filePath);
    return true;
  } catch {
    return false;
  }
}

// Worker functions
export async function migrateMembers(repoPath: string, log: Logger): Promise<MigrationResult> {
  log("--- Migrating Members ---");
  const membersPath = join(repoPath, "contents/members");
  const files = await findMarkdownFiles(membersPath);
  log(`Found ${files.length} member files`);

  let created = 0;
  let skipped = 0;
  let errors = 0;

  for (const file of files) {
    const relPath = file.replace(`${membersPath}/`, "");
    const parts = dirname(relPath).split("/");
    const slug = parts.at(-1);
    if (!slug) continue;

    try {
      const content = await readFile(file, "utf-8");
      const { frontmatter, body } = parseFrontmatter(content, MemberFrontmatterSchema);

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

      const bioLines: string[] = [];
      if (frontmatter.description) bioLines.push(frontmatter.description);
      if (frontmatter.github) bioLines.push(`GitHub: @${frontmatter.github}`);
      if (frontmatter.twitter) bioLines.push(`Twitter: @${frontmatter.twitter}`);
      if (frontmatter.website) bioLines.push(`Web: ${frontmatter.website}`);

      // Process pageContent images
      const dirPath = dirname(file);
      const processedBody = body ? await processContentImages(body, dirPath, "members", log) : null;

      await db.insert(member).values({
        slug,
        name: frontmatter.nameJa,
        bio: bioLines.join("\n") || null,
        imageUrl: frontmatter.image ?? frontmatter.faceImage ?? frontmatter.upperBodyImage ?? null,
        pageContent: processedBody,
      });

      log(`  ✓ Created: ${slug} (${frontmatter.nameJa})`);
      created++;
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      log(`  ✗ Error: ${slug} - ${msg}`);
      errors++;
    }
  }

  log(`Members: ${created} created, ${skipped} skipped, ${errors} errors`);
  return { created, skipped, errors };
}

export async function migrateArticles(repoPath: string, log: Logger): Promise<MigrationResult> {
  log("--- Migrating Articles ---");
  const articlesPath = join(repoPath, "contents/articles");
  const files = await findMarkdownFiles(articlesPath);
  log(`Found ${files.length} article files`);

  let created = 0;
  let skipped = 0;
  let errors = 0;

  for (const file of files) {
    const relPath = file.replace(`${articlesPath}/`, "");
    const slug = generateArticleSlug(dirname(relPath));

    try {
      const content = await readFile(file, "utf-8");
      const { frontmatter, body } = parseFrontmatter(content, ArticleFrontmatterSchema);

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

      // Process content images (upload ./image.webp -> S3 URL)
      const dirPath = dirname(file);
      const processedBody = await processContentImages(body, dirPath, "articles", log);

      await db.insert(article).values({
        slug,
        title: frontmatter.title,
        content: processedBody,
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
      errors++;
    }
  }

  log(`Articles: ${created} created, ${skipped} skipped, ${errors} errors`);
  return { created, skipped, errors };
}

export async function migrateProjects(repoPath: string, log: Logger): Promise<MigrationResult> {
  log("--- Migrating Projects ---");
  const projectsPath = join(repoPath, "contents/projects");
  const files = await findMarkdownFiles(projectsPath);
  log(`Found ${files.length} project files`);

  let created = 0;
  let skipped = 0;
  let errors = 0;

  for (const file of files) {
    const dirPath = dirname(file);
    const slug = basename(dirPath);

    try {
      const content = await readFile(file, "utf-8");
      const { frontmatter, body } = parseFrontmatter(content, ProjectFrontmatterSchema);
      const name = frontmatter.app?.name ?? slug;

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

      // Process content images
      const processedBody = body
        ? await processContentImages(body, dirPath, "projects", log)
        : null;

      const [inserted] = await db
        .insert(project)
        .values({
          slug,
          name,
          description: frontmatter.app?.description ?? null,
          content: processedBody,
          coverUrl: frontmatter.thumbnail?.src ?? null,
          repoUrl: frontmatter.social?.github ?? null,
          demoUrl: frontmatter.app?.url ?? null,
          category: mapCategory(frontmatter.kind),
        })
        .returning({ id: project.id });

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
      errors++;
    }
  }

  log(`Projects: ${created} created, ${skipped} skipped, ${errors} errors`);
  return { created, skipped, errors };
}

export interface CleanupResult {
  cleaned: number;
  skipped: number;
}

/**
 * Cleanup invalid image URLs (not starting with https://s3)
 * Sets them to NULL so fallback images are used
 */
export async function cleanupInvalidImageUrls(log: Logger): Promise<{
  members: CleanupResult;
  articles: CleanupResult;
  projects: CleanupResult;
}> {
  log("--- Cleaning Invalid Image URLs ---");

  const isValidS3Url = (url: string | null): boolean => {
    if (!url) return true; // NULL is valid (will use fallback)
    return url.startsWith("https://s3");
  };

  // Clean member images
  log("Processing member images...");
  const members = await db.select({ id: member.id, imageUrl: member.imageUrl }).from(member);
  let membersCleaned = 0;
  let membersSkipped = 0;

  for (const m of members) {
    if (isValidS3Url(m.imageUrl)) {
      membersSkipped++;
      continue;
    }
    await db.update(member).set({ imageUrl: null }).where(eq(member.id, m.id));
    log(`  ✓ Cleaned: member ${m.id} (was: ${m.imageUrl})`);
    membersCleaned++;
  }
  log(`Members: ${membersCleaned} cleaned, ${membersSkipped} skipped`);

  // Clean article covers
  log("Processing article covers...");
  const articles = await db.select({ id: article.id, coverUrl: article.coverUrl }).from(article);
  let articlesCleaned = 0;
  let articlesSkipped = 0;

  for (const a of articles) {
    if (isValidS3Url(a.coverUrl)) {
      articlesSkipped++;
      continue;
    }
    await db.update(article).set({ coverUrl: null }).where(eq(article.id, a.id));
    log(`  ✓ Cleaned: article ${a.id} (was: ${a.coverUrl})`);
    articlesCleaned++;
  }
  log(`Articles: ${articlesCleaned} cleaned, ${articlesSkipped} skipped`);

  // Clean project covers
  log("Processing project covers...");
  const projects = await db.select({ id: project.id, coverUrl: project.coverUrl }).from(project);
  let projectsCleaned = 0;
  let projectsSkipped = 0;

  for (const p of projects) {
    if (isValidS3Url(p.coverUrl)) {
      projectsSkipped++;
      continue;
    }
    await db.update(project).set({ coverUrl: null }).where(eq(project.id, p.id));
    log(`  ✓ Cleaned: project ${p.id} (was: ${p.coverUrl})`);
    projectsCleaned++;
  }
  log(`Projects: ${projectsCleaned} cleaned, ${projectsSkipped} skipped`);

  log("--- Cleanup Complete ---");
  return {
    members: { cleaned: membersCleaned, skipped: membersSkipped },
    articles: { cleaned: articlesCleaned, skipped: articlesSkipped },
    projects: { cleaned: projectsCleaned, skipped: projectsSkipped },
  };
}

export async function migrateImages(repoPath: string, log: Logger): Promise<MigrationResult> {
  log("--- Migrating Images ---");
  const s3PublicUrl = env.S3_PUBLIC_URL;

  let created = 0;
  let skipped = 0;
  let errors = 0;

  // Member images
  log("Processing member images...");
  const membersPath = join(repoPath, "contents/members");
  const memberFiles = await findMarkdownFiles(membersPath);

  for (const file of memberFiles) {
    const dirPath = dirname(file);
    const relPath = file.replace(`${membersPath}/`, "");
    const slug = dirname(relPath).split("/").at(-1);
    if (!slug) continue;

    try {
      const content = await readFile(file, "utf-8");
      const { frontmatter } = parseFrontmatter(content, MemberFrontmatterSchema);
      const imageRef = frontmatter.image ?? frontmatter.faceImage ?? frontmatter.upperBodyImage;

      if (!imageRef) continue;

      const imagePath = join(dirPath, imageRef.replace(/^\.\//, ""));
      if (!(await fileExists(imagePath))) {
        log(`  ⊘ Skipped: member/${slug} (image file not found)`);
        skipped++;
        continue;
      }

      const existingMember = (
        await db
          .select({ id: member.id, imageUrl: member.imageUrl })
          .from(member)
          .where(eq(member.slug, slug))
          .limit(1)
      )[0];

      if (!existingMember) {
        log(`  ⊘ Skipped: member/${slug} (not in database)`);
        skipped++;
        continue;
      }

      if (existingMember.imageUrl?.startsWith(s3PublicUrl)) {
        log(`  ⊘ Skipped: member/${slug} (already has S3 URL)`);
        skipped++;
        continue;
      }

      const buffer = await readFile(imagePath);
      const { url } = await uploadBuffer(
        buffer as Buffer,
        getMimeType(imagePath),
        basename(imagePath),
        "members",
      );

      await db.update(member).set({ imageUrl: url }).where(eq(member.slug, slug));
      log(`  ✓ Uploaded: member/${slug}`);
      created++;
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      log(`  ✗ Error: member/${slug} - ${msg}`);
      errors++;
    }
  }

  // Article images
  log("Processing article images...");
  const articlesPath = join(repoPath, "contents/articles");
  const articleFiles = await findMarkdownFiles(articlesPath);

  for (const file of articleFiles) {
    const dirPath = dirname(file);
    const relPath = file.replace(`${articlesPath}/`, "");
    const slug = generateArticleSlug(dirname(relPath));

    try {
      const content = await readFile(file, "utf-8");
      const { frontmatter } = parseFrontmatter(content, ArticleFrontmatterSchema);

      if (!frontmatter.thumbnail?.src) continue;

      const imagePath = join(dirPath, frontmatter.thumbnail.src.replace(/^\.\//, ""));
      if (!(await fileExists(imagePath))) {
        log(`  ⊘ Skipped: article/${slug} (image file not found)`);
        skipped++;
        continue;
      }

      const existingArticle = (
        await db
          .select({ id: article.id, coverUrl: article.coverUrl })
          .from(article)
          .where(eq(article.slug, slug))
          .limit(1)
      )[0];

      if (!existingArticle) {
        log(`  ⊘ Skipped: article/${slug} (not in database)`);
        skipped++;
        continue;
      }

      if (existingArticle.coverUrl?.startsWith(s3PublicUrl)) {
        log(`  ⊘ Skipped: article/${slug} (already has S3 URL)`);
        skipped++;
        continue;
      }

      const buffer = await readFile(imagePath);
      const { url } = await uploadBuffer(
        buffer as Buffer,
        getMimeType(imagePath),
        basename(imagePath),
        "articles",
      );

      await db.update(article).set({ coverUrl: url }).where(eq(article.slug, slug));
      log(`  ✓ Uploaded: article/${slug}`);
      created++;
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      log(`  ✗ Error: article/${slug} - ${msg}`);
      errors++;
    }
  }

  // Project images
  log("Processing project images...");
  const projectsPath = join(repoPath, "contents/projects");
  const projectFiles = await findMarkdownFiles(projectsPath);

  for (const file of projectFiles) {
    const dirPath = dirname(file);
    const slug = basename(dirPath);

    try {
      const content = await readFile(file, "utf-8");
      const { frontmatter } = parseFrontmatter(content, ProjectFrontmatterSchema);

      if (!frontmatter.thumbnail?.src) continue;

      const imagePath = join(dirPath, frontmatter.thumbnail.src.replace(/^\.\//, ""));
      if (!(await fileExists(imagePath))) {
        log(`  ⊘ Skipped: project/${slug} (image file not found)`);
        skipped++;
        continue;
      }

      const existingProject = (
        await db
          .select({ id: project.id, coverUrl: project.coverUrl })
          .from(project)
          .where(eq(project.slug, slug))
          .limit(1)
      )[0];

      if (!existingProject) {
        log(`  ⊘ Skipped: project/${slug} (not in database)`);
        skipped++;
        continue;
      }

      if (existingProject.coverUrl?.startsWith(s3PublicUrl)) {
        log(`  ⊘ Skipped: project/${slug} (already has S3 URL)`);
        skipped++;
        continue;
      }

      const buffer = await readFile(imagePath);
      const { url } = await uploadBuffer(
        buffer as Buffer,
        getMimeType(imagePath),
        basename(imagePath),
        "projects",
      );

      await db.update(project).set({ coverUrl: url }).where(eq(project.slug, slug));
      log(`  ✓ Uploaded: project/${slug}`);
      created++;
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      log(`  ✗ Error: project/${slug} - ${msg}`);
      errors++;
    }
  }

  log(`Images: ${created} uploaded, ${skipped} skipped, ${errors} errors`);
  return { created, skipped, errors };
}

export interface DeleteResult {
  deleted: number;
}

/**
 * Delete all migrated data (members, articles, projects)
 * Use this before re-running migration for a clean slate
 */
export async function deleteAllMigratedData(log: Logger): Promise<{
  members: DeleteResult;
  articles: DeleteResult;
  projects: DeleteResult;
}> {
  log("--- Deleting All Migrated Data ---");
  log("WARNING: This will delete all members, articles, and projects!");

  // Delete in order: projectMembers -> articles -> projects -> members
  // (respecting foreign key constraints)

  // Delete project members first (junction table)
  log("Deleting project members...");
  const deletedProjectMembers = await db
    .delete(projectMember)
    .returning({ id: projectMember.projectId });
  log(`  ✓ Deleted ${deletedProjectMembers.length} project member associations`);

  // Delete articles
  log("Deleting articles...");
  const deletedArticles = await db.delete(article).returning({ id: article.id });
  log(`  ✓ Deleted ${deletedArticles.length} articles`);

  // Delete projects
  log("Deleting projects...");
  const deletedProjects = await db.delete(project).returning({ id: project.id });
  log(`  ✓ Deleted ${deletedProjects.length} projects`);

  // Delete members (but not user accounts)
  log("Deleting members...");
  const deletedMembers = await db.delete(member).returning({ id: member.id });
  log(`  ✓ Deleted ${deletedMembers.length} members`);

  log("--- Delete Complete ---");
  return {
    members: { deleted: deletedMembers.length },
    articles: { deleted: deletedArticles.length },
    projects: { deleted: deletedProjects.length },
  };
}
