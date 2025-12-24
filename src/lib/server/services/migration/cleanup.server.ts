/**
 * Cleanup and deletion operations for migration
 */
import { eq } from "drizzle-orm";
import { db } from "$lib/server/drivers/db";
import { article, member, project, projectMember } from "$lib/shared/models/schema";
import type { Logger } from "./helpers.server";

export interface CleanupResult {
  cleaned: number;
  skipped: number;
}

export interface DeleteResult {
  deleted: number;
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
