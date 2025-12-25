/**
 * Member migration worker
 */
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { eq } from "drizzle-orm";
import { db } from "$lib/server/drivers/db";
import { member } from "$lib/shared/models/schema";
import type { MigrationResult } from "$lib/shared/types/migration";
import { findMarkdownFiles, type Logger, parseFrontmatter } from "./helpers.server";
import { processContentImages } from "./image-processor.server";
import { MemberFrontmatterSchema } from "./schemas.server";

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
      const errorMessage = e instanceof Error ? e.message : String(e);
      log(`  ✗ Error: ${slug} - ${errorMessage}`);
      errors++;
    }
  }

  log(`Members: ${created} created, ${skipped} skipped, ${errors} errors`);
  return { created, skipped, errors };
}
