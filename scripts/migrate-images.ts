/**
 * Migration script: Upload images from old utcode.net to S3 and update database
 *
 * Usage:
 *   bun --env-file=.env run scripts/migrate-images.ts [--dry-run]
 *
 * Prerequisites:
 *   - Old utcode.net repo at ../utcode.net
 *   - S3 environment variables set (S3_ENDPOINT, S3_ACCESS_KEY, S3_SECRET_KEY, S3_BUCKET, S3_PUBLIC_URL)
 *   - DATABASE_URL env var set
 *   - Members, articles, and projects already migrated (this script updates existing records)
 */

import { readdir, readFile, stat } from "node:fs/promises";
import { join, dirname, basename, extname } from "node:path";
import { parse as parseYaml } from "yaml";
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import { Client } from "minio";
import { article, member, project } from "../src/lib/shared/models/schema";
import { eq } from "drizzle-orm";

// Environment setup
const DATABASE_URL = process.env.DATABASE_URL;
const DATABASE_AUTH_TOKEN = process.env.DATABASE_AUTH_TOKEN;
const S3_ENDPOINT = process.env.S3_ENDPOINT;
const S3_ACCESS_KEY = process.env.S3_ACCESS_KEY;
const S3_SECRET_KEY = process.env.S3_SECRET_KEY;
const S3_BUCKET = process.env.S3_BUCKET;
const S3_PUBLIC_URL = process.env.S3_PUBLIC_URL;

if (!DATABASE_URL) {
  console.error("ERROR: DATABASE_URL environment variable is required");
  process.exit(1);
}

if (!S3_ENDPOINT || !S3_ACCESS_KEY || !S3_SECRET_KEY || !S3_BUCKET || !S3_PUBLIC_URL) {
  console.error("ERROR: S3 environment variables are required");
  console.error("  S3_ENDPOINT, S3_ACCESS_KEY, S3_SECRET_KEY, S3_BUCKET, S3_PUBLIC_URL");
  process.exit(1);
}

// Database setup
const dbClient = createClient({
  url: DATABASE_URL,
  authToken: DATABASE_AUTH_TOKEN,
});

const db = drizzle(dbClient, { schema: { article, member, project } });

// S3 setup
const s3Url = new URL(S3_ENDPOINT);
const s3 = new Client({
  endPoint: s3Url.hostname,
  port: s3Url.port ? parseInt(s3Url.port, 10) : s3Url.protocol === "https:" ? 443 : 80,
  useSSL: s3Url.protocol === "https:",
  accessKey: S3_ACCESS_KEY,
  secretKey: S3_SECRET_KEY,
});

const OLD_SITE_PATH = join(import.meta.dirname, "../../utcode.net");
const MEMBERS_PATH = join(OLD_SITE_PATH, "contents/members");
const ARTICLES_PATH = join(OLD_SITE_PATH, "contents/articles");
const PROJECTS_PATH = join(OLD_SITE_PATH, "contents/projects");

interface MigrationResult {
  type: "member" | "article" | "project";
  slug: string;
  imagePath: string;
  status: "uploaded" | "skipped" | "error";
  reason?: string;
  url?: string;
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

async function uploadImage(
  filePath: string,
  folder: string,
  dryRun: boolean,
): Promise<{ url: string; key: string } | null> {
  const fileName = basename(filePath);
  const key = `${folder}/${crypto.randomUUID()}-${fileName}`;

  if (dryRun) {
    return { url: `${S3_PUBLIC_URL}/${key}`, key };
  }

  try {
    const buffer = await readFile(filePath);
    const contentType = getMimeType(filePath);

    await s3.putObject(S3_BUCKET, key, buffer, buffer.length, {
      "Content-Type": contentType,
    });

    return { url: `${S3_PUBLIC_URL}/${key}`, key };
  } catch (error) {
    console.error(`Failed to upload ${filePath}:`, error);
    return null;
  }
}

async function ensureBucket(): Promise<void> {
  const exists = await s3.bucketExists(S3_BUCKET);
  if (!exists) {
    await s3.makeBucket(S3_BUCKET);
  }

  const publicPolicy = {
    Version: "2012-10-17",
    Statement: [
      {
        Effect: "Allow",
        Principal: { AWS: ["*"] },
        Action: ["s3:GetObject"],
        Resource: [`arn:aws:s3:::${S3_BUCKET}/*`],
      },
    ],
  };
  await s3.setBucketPolicy(S3_BUCKET, JSON.stringify(publicPolicy));
}

// Member image migration
interface MemberFrontmatter {
  faceImage?: string;
  upperBodyImage?: string;
}

function parseFrontmatter<T>(content: string): { frontmatter: T; body: string } {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) {
    throw new Error("Invalid frontmatter format");
  }
  return {
    frontmatter: parseYaml(match[1]) as T,
    body: match[2].trim(),
  };
}

async function findMarkdownFiles(basePath: string): Promise<string[]> {
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

  await walk(basePath);
  return files.sort();
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await stat(filePath);
    return true;
  } catch {
    return false;
  }
}

async function migrateMemberImages(dryRun: boolean): Promise<MigrationResult[]> {
  const results: MigrationResult[] = [];
  const files = await findMarkdownFiles(MEMBERS_PATH);

  for (const file of files) {
    const dirPath = dirname(file);
    const relPath = file.replace(MEMBERS_PATH + "/", "");
    const parts = dirname(relPath).split("/");
    const slug = parts[parts.length - 1];

    try {
      const content = await readFile(file, "utf-8");
      const { frontmatter } = parseFrontmatter<MemberFrontmatter>(content);

      // Prefer faceImage, then upperBodyImage
      const imageRef = frontmatter.faceImage ?? frontmatter.upperBodyImage;
      if (!imageRef) {
        results.push({
          type: "member",
          slug,
          imagePath: "",
          status: "skipped",
          reason: "No image in frontmatter",
        });
        continue;
      }

      // Resolve relative path (./face.jpg -> /full/path/to/face.jpg)
      const imagePath = join(dirPath, imageRef.replace(/^\.\//, ""));

      if (!(await fileExists(imagePath))) {
        results.push({
          type: "member",
          slug,
          imagePath,
          status: "skipped",
          reason: "Image file not found",
        });
        continue;
      }

      // Check if member exists and needs update
      const existing = await db.select().from(member).where(eq(member.slug, slug)).limit(1);

      if (existing.length === 0) {
        results.push({
          type: "member",
          slug,
          imagePath,
          status: "skipped",
          reason: "Member not in database (run migrate-members first)",
        });
        continue;
      }

      // Skip if already has a proper S3 URL
      if (existing[0].imageUrl?.startsWith(S3_PUBLIC_URL)) {
        results.push({
          type: "member",
          slug,
          imagePath,
          status: "skipped",
          reason: "Already has S3 URL",
        });
        continue;
      }

      // Upload image
      const uploaded = await uploadImage(imagePath, "members", dryRun);
      if (!uploaded) {
        results.push({
          type: "member",
          slug,
          imagePath,
          status: "error",
          reason: "Upload failed",
        });
        continue;
      }

      // Update database
      if (!dryRun) {
        await db.update(member).set({ imageUrl: uploaded.url }).where(eq(member.slug, slug));
      }

      console.log(`${dryRun ? "[DRY RUN] " : ""}✓ Member: ${slug} -> ${uploaded.url}`);
      results.push({
        type: "member",
        slug,
        imagePath,
        status: "uploaded",
        url: uploaded.url,
      });
    } catch (error) {
      results.push({
        type: "member",
        slug,
        imagePath: "",
        status: "error",
        reason: error instanceof Error ? error.message : String(error),
      });
    }
  }

  return results;
}

// Article image migration
interface ArticleFrontmatter {
  thumbnail?: {
    src: string;
  };
}

function generateArticleSlug(dirPath: string): string {
  const parts = dirPath.split("/");
  const year = parts[parts.length - 2];
  const name = parts[parts.length - 1];
  const [monthDay, ...rest] = name.split("_");
  return `${year}-${monthDay}-${rest.join("-")}`;
}

async function migrateArticleImages(dryRun: boolean): Promise<MigrationResult[]> {
  const results: MigrationResult[] = [];
  const files = await findMarkdownFiles(ARTICLES_PATH);

  for (const file of files) {
    const dirPath = dirname(file);
    const relPath = file.replace(ARTICLES_PATH + "/", "");
    const slug = generateArticleSlug(dirname(relPath));

    try {
      const content = await readFile(file, "utf-8");
      const { frontmatter } = parseFrontmatter<ArticleFrontmatter>(content);

      if (!frontmatter.thumbnail?.src) {
        results.push({
          type: "article",
          slug,
          imagePath: "",
          status: "skipped",
          reason: "No thumbnail in frontmatter",
        });
        continue;
      }

      const imageRef = frontmatter.thumbnail.src;
      const imagePath = join(dirPath, imageRef.replace(/^\.\//, ""));

      if (!(await fileExists(imagePath))) {
        results.push({
          type: "article",
          slug,
          imagePath,
          status: "skipped",
          reason: "Image file not found",
        });
        continue;
      }

      const existing = await db.select().from(article).where(eq(article.slug, slug)).limit(1);

      if (existing.length === 0) {
        results.push({
          type: "article",
          slug,
          imagePath,
          status: "skipped",
          reason: "Article not in database (run migrate-articles first)",
        });
        continue;
      }

      if (existing[0].coverUrl?.startsWith(S3_PUBLIC_URL)) {
        results.push({
          type: "article",
          slug,
          imagePath,
          status: "skipped",
          reason: "Already has S3 URL",
        });
        continue;
      }

      const uploaded = await uploadImage(imagePath, "articles", dryRun);
      if (!uploaded) {
        results.push({
          type: "article",
          slug,
          imagePath,
          status: "error",
          reason: "Upload failed",
        });
        continue;
      }

      if (!dryRun) {
        await db.update(article).set({ coverUrl: uploaded.url }).where(eq(article.slug, slug));
      }

      console.log(`${dryRun ? "[DRY RUN] " : ""}✓ Article: ${slug} -> ${uploaded.url}`);
      results.push({
        type: "article",
        slug,
        imagePath,
        status: "uploaded",
        url: uploaded.url,
      });
    } catch (error) {
      results.push({
        type: "article",
        slug,
        imagePath: "",
        status: "error",
        reason: error instanceof Error ? error.message : String(error),
      });
    }
  }

  return results;
}

// Project image migration
interface ProjectFrontmatter {
  thumbnail?: {
    src?: string;
  };
}

async function migrateProjectImages(dryRun: boolean): Promise<MigrationResult[]> {
  const results: MigrationResult[] = [];
  const files = await findMarkdownFiles(PROJECTS_PATH);

  for (const file of files) {
    const dirPath = dirname(file);
    const slug = basename(dirPath);

    try {
      const content = await readFile(file, "utf-8");
      const { frontmatter } = parseFrontmatter<ProjectFrontmatter>(content);

      if (!frontmatter.thumbnail?.src) {
        results.push({
          type: "project",
          slug,
          imagePath: "",
          status: "skipped",
          reason: "No thumbnail in frontmatter",
        });
        continue;
      }

      const imageRef = frontmatter.thumbnail.src;
      const imagePath = join(dirPath, imageRef.replace(/^\.\//, ""));

      if (!(await fileExists(imagePath))) {
        results.push({
          type: "project",
          slug,
          imagePath,
          status: "skipped",
          reason: "Image file not found",
        });
        continue;
      }

      const existing = await db.select().from(project).where(eq(project.slug, slug)).limit(1);

      if (existing.length === 0) {
        results.push({
          type: "project",
          slug,
          imagePath,
          status: "skipped",
          reason: "Project not in database (run migrate-projects first)",
        });
        continue;
      }

      if (existing[0].coverUrl?.startsWith(S3_PUBLIC_URL)) {
        results.push({
          type: "project",
          slug,
          imagePath,
          status: "skipped",
          reason: "Already has S3 URL",
        });
        continue;
      }

      const uploaded = await uploadImage(imagePath, "projects", dryRun);
      if (!uploaded) {
        results.push({
          type: "project",
          slug,
          imagePath,
          status: "error",
          reason: "Upload failed",
        });
        continue;
      }

      if (!dryRun) {
        await db.update(project).set({ coverUrl: uploaded.url }).where(eq(project.slug, slug));
      }

      console.log(`${dryRun ? "[DRY RUN] " : ""}✓ Project: ${slug} -> ${uploaded.url}`);
      results.push({
        type: "project",
        slug,
        imagePath,
        status: "uploaded",
        url: uploaded.url,
      });
    } catch (error) {
      results.push({
        type: "project",
        slug,
        imagePath: "",
        status: "error",
        reason: error instanceof Error ? error.message : String(error),
      });
    }
  }

  return results;
}

function printSummary(results: MigrationResult[], type: string): void {
  const typeResults = results.filter((r) => r.type === type);
  const uploaded = typeResults.filter((r) => r.status === "uploaded").length;
  const skipped = typeResults.filter((r) => r.status === "skipped").length;
  const errors = typeResults.filter((r) => r.status === "error").length;

  console.log(`  ${type}: ${uploaded} uploaded, ${skipped} skipped, ${errors} errors`);
}

async function main(): Promise<void> {
  const dryRun = process.argv.includes("--dry-run");

  console.log("=== Image Migration ===");
  console.log(`Mode: ${dryRun ? "DRY RUN" : "LIVE"}`);
  console.log();

  if (!dryRun) {
    console.log("Ensuring S3 bucket exists...");
    await ensureBucket();
  }

  const results: MigrationResult[] = [];

  console.log("\n--- Members ---");
  results.push(...(await migrateMemberImages(dryRun)));

  console.log("\n--- Articles ---");
  results.push(...(await migrateArticleImages(dryRun)));

  console.log("\n--- Projects ---");
  results.push(...(await migrateProjectImages(dryRun)));

  console.log("\n=== Summary ===");
  printSummary(results, "member");
  printSummary(results, "article");
  printSummary(results, "project");

  const errors = results.filter((r) => r.status === "error");
  if (errors.length > 0) {
    console.log("\nErrors:");
    for (const e of errors) {
      console.log(`  ${e.type}/${e.slug}: ${e.reason}`);
    }
  }
}

main().catch(console.error);
