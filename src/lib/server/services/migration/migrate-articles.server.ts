/**
 * Article migration worker
 */
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { eq } from "drizzle-orm";
import { db } from "$lib/server/drivers/db";
import { article, member } from "$lib/shared/models/schema";
import type { MigrationResult } from "$lib/shared/types/migration";
import {
  findMarkdownFiles,
  generateArticleSlug,
  type Logger,
  parseFrontmatter,
} from "./helpers.server";
import { processContentImages } from "./image-processor.server";
import { ArticleFrontmatterSchema } from "./schemas.server";

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
