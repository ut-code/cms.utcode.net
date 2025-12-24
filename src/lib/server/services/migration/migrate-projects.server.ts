/**
 * Project migration worker
 */
import { readFile } from "node:fs/promises";
import { basename, dirname, join } from "node:path";
import { eq } from "drizzle-orm";
import { db } from "$lib/server/drivers/db";
import { member, project, projectMember } from "$lib/shared/models/schema";
import type { MigrationResult } from "$lib/shared/types/migration";
import { findMarkdownFiles, type Logger, mapCategory, parseFrontmatter } from "./helpers.server";
import { processContentImages } from "./image-processor.server";
import { ProjectFrontmatterSchema } from "./schemas.server";

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
