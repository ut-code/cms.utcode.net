import { eq } from "drizzle-orm";
import { db } from "$lib/server/drivers/db";
import { articleSlugRedirect } from "$lib/shared/models/schema";

export type ArticleSlugRedirect = typeof articleSlugRedirect.$inferSelect;
export type NewArticleSlugRedirect = typeof articleSlugRedirect.$inferInsert;

export async function createSlugRedirect(data: NewArticleSlugRedirect) {
  const [created] = await db.insert(articleSlugRedirect).values(data).returning();
  if (!created) throw new Error("Failed to create slug redirect");
  return created;
}

export async function getRedirectByOldSlug(oldSlug: string) {
  return db.query.articleSlugRedirect.findFirst({
    where: eq(articleSlugRedirect.oldSlug, oldSlug),
  });
}

export async function deleteRedirectsByArticleId(articleId: string) {
  await db.delete(articleSlugRedirect).where(eq(articleSlugRedirect.articleId, articleId));
}
