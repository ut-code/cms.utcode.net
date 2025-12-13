import { eq, desc, and } from "drizzle-orm";
import { db } from "$lib/shared/db/db.server";
import { article } from "$lib/shared/models/schema";
import { requireOrgMember } from "./auth.server";

export type Article = typeof article.$inferSelect;
export type NewArticle = typeof article.$inferInsert;

// ============================================================================
// Public - no auth required
// ============================================================================

export async function listPublishedArticles() {
  return db.query.article.findMany({
    where: eq(article.published, true),
    orderBy: desc(article.publishedAt),
    with: { author: true },
  });
}

export async function getPublishedArticle(slug: string) {
  return db.query.article.findFirst({
    where: and(eq(article.slug, slug), eq(article.published, true)),
    with: { author: true },
  });
}

// ============================================================================
// Admin - org member required (auth checked internally via getRequestEvent)
// ============================================================================

export async function listAllArticles() {
  await requireOrgMember();
  return db.query.article.findMany({
    orderBy: desc(article.createdAt),
    with: { author: true },
  });
}

export async function getArticle(slug: string) {
  await requireOrgMember();
  return db.query.article.findFirst({
    where: eq(article.slug, slug),
    with: { author: true },
  });
}

export async function getArticleById(id: string) {
  await requireOrgMember();
  return db.query.article.findFirst({
    where: eq(article.id, id),
    with: { author: true },
  });
}

export async function createArticle(data: NewArticle) {
  await requireOrgMember();
  const [created] = await db.insert(article).values(data).returning();
  return created;
}

export async function updateArticle(id: string, data: Partial<Omit<NewArticle, "id">>) {
  await requireOrgMember();
  const [updated] = await db
    .update(article)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(article.id, id))
    .returning();
  return updated;
}

export async function deleteArticle(id: string) {
  await requireOrgMember();
  await db.delete(article).where(eq(article.id, id));
}

export async function publishArticle(id: string) {
  return updateArticle(id, { published: true, publishedAt: new Date() });
}

export async function unpublishArticle(id: string) {
  return updateArticle(id, { published: false, publishedAt: null });
}
