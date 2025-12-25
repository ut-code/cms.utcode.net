import { and, desc, eq, like, or, sql } from "drizzle-orm";
import { db } from "$lib/server/drivers/db";
import { generateExcerpt } from "$lib/shared/logic/excerpt";
import { article, viewLog } from "$lib/shared/models/schema";
import { createSearchPattern } from "./utils";

export type Article = typeof article.$inferSelect;
export type NewArticle = typeof article.$inferInsert;
export type ArticleWithExcerpt = Article & { excerpt: string };

/**
 * 記事にexcerptを追加するヘルパー関数
 */
function addExcerpt<T extends Article>(article: T): T & { excerpt: string } {
  return {
    ...article,
    excerpt: generateExcerpt(article.content),
  };
}

/**
 * 記事配列にexcerptを追加するヘルパー関数
 */
function addExcerpts<T extends Article>(articles: T[]): (T & { excerpt: string })[] {
  return articles.map((a) => ({ ...a, excerpt: generateExcerpt(a.content) }));
}

export async function listPublishedArticles(limit = 100) {
  const articles = await db.query.article.findMany({
    where: eq(article.published, true),
    orderBy: desc(article.publishedAt),
    limit,
    with: { author: true },
  });
  return addExcerpts(articles);
}

export async function getArticleBySlug(slug: string) {
  const result = await db.query.article.findFirst({
    where: eq(article.slug, slug),
    with: { author: true },
  });
  return result ? addExcerpt(result) : null;
}

export async function getPublishedArticle(slug: string) {
  const result = await db.query.article.findFirst({
    where: and(eq(article.slug, slug), eq(article.published, true)),
    with: { author: true },
  });

  // Fire-and-forget: view count accuracy is not critical
  if (result) {
    Promise.all([
      db
        .update(article)
        .set({ viewCount: sql`${article.viewCount} + 1` })
        .where(eq(article.slug, slug)),
      db.insert(viewLog).values({
        resourceType: "article",
        resourceId: result.id,
      }),
    ]).catch(console.error);
  }

  return result ? addExcerpt(result) : null;
}

export async function listAllArticles(limit = 1000) {
  const articles = await db.query.article.findMany({
    orderBy: desc(article.createdAt),
    limit,
    with: { author: true },
  });
  return addExcerpts(articles);
}

export async function getArticleById(id: string) {
  const result = await db.query.article.findFirst({
    where: eq(article.id, id),
    with: { author: true },
  });
  return result ? addExcerpt(result) : null;
}

export async function createArticle(data: NewArticle) {
  const [created] = await db.insert(article).values(data).returning();
  if (!created) throw new Error("Failed to create article");
  return created;
}

export async function updateArticle(id: string, data: Partial<Omit<NewArticle, "id">>) {
  const [updated] = await db
    .update(article)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(article.id, id))
    .returning();
  if (!updated) throw new Error("Failed to update article");
  return updated;
}

export async function deleteArticle(id: string) {
  await db.delete(article).where(eq(article.id, id));
}

export async function publishArticle(id: string) {
  return updateArticle(id, { published: true, publishedAt: new Date() });
}

export async function unpublishArticle(id: string) {
  return updateArticle(id, { published: false, publishedAt: null });
}

export async function getRelatedArticles(
  articleId: string,
  authorId: string | null,
  limit: number,
) {
  // まず同じ著者の記事を取得（現在の記事は除外）
  const sameAuthorArticles = authorId
    ? await db.query.article.findMany({
        where: and(
          eq(article.published, true),
          eq(article.authorId, authorId),
          // 現在の記事を除外
          sql`${article.id} != ${articleId}`,
        ),
        orderBy: desc(article.publishedAt),
        limit,
        with: { author: true },
      })
    : [];

  // 不足している場合は最新の公開記事で埋める
  if (sameAuthorArticles.length < limit) {
    const needed = limit - sameAuthorArticles.length;
    const recentArticles = await db.query.article.findMany({
      where: and(
        eq(article.published, true),
        // 現在の記事と既に取得した記事を除外
        sql`${article.id} != ${articleId}`,
        authorId ? sql`${article.authorId} != ${authorId}` : undefined,
      ),
      orderBy: desc(article.publishedAt),
      limit: needed,
      with: { author: true },
    });

    return addExcerpts([...sameAuthorArticles, ...recentArticles]);
  }

  return addExcerpts(sameAuthorArticles);
}

export async function searchPublishedArticles(query: string, limit = 50) {
  const searchPattern = createSearchPattern(query);
  if (!searchPattern) {
    return [];
  }

  const articles = await db.query.article.findMany({
    where: and(
      eq(article.published, true),
      or(like(article.title, searchPattern), like(article.content, searchPattern)),
    ),
    orderBy: desc(article.publishedAt),
    limit,
    with: { author: true },
  });
  return addExcerpts(articles);
}

export async function searchAllArticles(query: string, limit = 100) {
  const searchPattern = createSearchPattern(query);
  if (!searchPattern) {
    return [];
  }

  const articles = await db.query.article.findMany({
    where: or(like(article.title, searchPattern), like(article.content, searchPattern)),
    orderBy: desc(article.createdAt),
    limit,
    with: { author: true },
  });
  return addExcerpts(articles);
}

export async function countArticles() {
  const result = await db.select({ count: sql<number>`count(*)` }).from(article);
  return result[0]?.count ?? 0;
}

export async function countPublishedArticles() {
  const result = await db
    .select({ count: sql<number>`count(*)` })
    .from(article)
    .where(eq(article.published, true));
  return result[0]?.count ?? 0;
}

export async function getRecentArticles(limit: number) {
  const articles = await db.query.article.findMany({
    orderBy: desc(article.updatedAt),
    limit,
  });
  return addExcerpts(articles);
}

export async function getRecentDraftArticles(limit: number) {
  const articles = await db.query.article.findMany({
    where: eq(article.published, false),
    orderBy: desc(article.updatedAt),
    limit,
  });
  return addExcerpts(articles);
}

export async function listDraftArticles(limit = 1000) {
  const articles = await db.query.article.findMany({
    where: eq(article.published, false),
    orderBy: desc(article.updatedAt),
    limit,
  });
  return addExcerpts(articles);
}

export async function getRecentPublishedArticles(limit: number) {
  const articles = await db.query.article.findMany({
    where: eq(article.published, true),
    orderBy: desc(article.publishedAt),
    limit,
    with: { author: true },
  });
  return addExcerpts(articles);
}
