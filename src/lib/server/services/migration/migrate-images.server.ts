/**
 * Image migration worker - uploads existing local images to S3
 */
import { readFile } from "node:fs/promises";
import { basename, dirname, join } from "node:path";
import { eq } from "drizzle-orm";
import { env } from "$lib/env/env.server";
import { compressImage } from "$lib/server/database/image.server";
import { uploadBuffer } from "$lib/server/database/storage.server";
import { db } from "$lib/server/drivers/db";
import { article, member, project } from "$lib/shared/models/schema";
import type { MigrationResult } from "$lib/shared/types/migration";
import {
  fileExists,
  findMarkdownFiles,
  generateArticleSlug,
  getMimeType,
  type Logger,
  parseFrontmatter,
} from "./helpers.server";
import {
  ArticleFrontmatterSchema,
  MemberFrontmatterSchema,
  ProjectFrontmatterSchema,
} from "./schemas.server";

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

      const inputBuffer = await readFile(imagePath);
      const {
        buffer: compressedBuffer,
        type: outputType,
        extension,
      } = await compressImage(inputBuffer, getMimeType(imagePath));
      const baseName = basename(imagePath).replace(/\.[^.]+$/, "");
      const outputName = `${baseName}.${extension}`;

      const { url } = await uploadBuffer(compressedBuffer, outputType, outputName, "members");

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

      const inputBuffer = await readFile(imagePath);
      const {
        buffer: compressedBuffer,
        type: outputType,
        extension,
      } = await compressImage(inputBuffer, getMimeType(imagePath));
      const baseName = basename(imagePath).replace(/\.[^.]+$/, "");
      const outputName = `${baseName}.${extension}`;

      const { url } = await uploadBuffer(compressedBuffer, outputType, outputName, "articles");

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

      const inputBuffer = await readFile(imagePath);
      const {
        buffer: compressedBuffer,
        type: outputType,
        extension,
      } = await compressImage(inputBuffer, getMimeType(imagePath));
      const baseName = basename(imagePath).replace(/\.[^.]+$/, "");
      const outputName = `${baseName}.${extension}`;

      const { url } = await uploadBuffer(compressedBuffer, outputType, outputName, "projects");

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
