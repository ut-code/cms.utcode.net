import * as v from "valibot";
import { command, query } from "$app/server";
import {
  createArticle,
  deleteArticle,
  getArticleById,
  listAllArticles,
  publishArticle,
  unpublishArticle,
  updateArticle,
} from "$lib/server/database/articles.server";
import { requireUtCodeMember } from "$lib/server/database/auth.server";
import { purgeCache } from "$lib/server/services/cloudflare/cache.server";
import { DB_LARGE_LIMIT } from "$lib/shared/constants";

export const getArticles = query(async () => {
  await requireUtCodeMember();
  return await listAllArticles(DB_LARGE_LIMIT);
});

export const getArticle = query(v.string(), async (id) => {
  await requireUtCodeMember();
  return await getArticleById(id);
});

export const saveArticle = command(
  v.object({
    slug: v.string(),
    title: v.string(),
    content: v.string(),
    coverUrl: v.nullable(v.string()),
    authorId: v.nullable(v.string()),
    published: v.boolean(),
    publishedAt: v.nullable(v.date()),
  }),
  async (data) => {
    await requireUtCodeMember();

    const result = await createArticle(data);
    purgeCache().catch(console.error);
    return result;
  },
);

export const editArticle = command(
  v.object({
    id: v.string(),
    data: v.object({
      slug: v.optional(v.string()),
      title: v.optional(v.string()),
      content: v.optional(v.string()),
      coverUrl: v.optional(v.nullable(v.string())),
      authorId: v.optional(v.nullable(v.string())),
      published: v.optional(v.boolean()),
      publishedAt: v.optional(v.nullable(v.date())),
    }),
    createRedirect: v.optional(v.boolean()),
  }),
  async ({ id, data, createRedirect }) => {
    await requireUtCodeMember();

    // Create redirect if slug is changing and createRedirect is true
    if (data.slug !== undefined && createRedirect) {
      const currentArticle = await getArticleById(id);
      if (currentArticle && currentArticle.slug !== data.slug) {
        const { createSlugRedirect } = await import("$lib/server/database/slug-redirects.server");
        await createSlugRedirect({
          oldSlug: currentArticle.slug,
          newSlug: data.slug,
          articleId: id,
        });
      }
    }

    const result = await updateArticle(id, data);
    purgeCache().catch(console.error);
    return result;
  },
);

export const removeArticle = command(v.string(), async (id) => {
  await requireUtCodeMember();

  await deleteArticle(id);
  purgeCache().catch(console.error);
});

export const publish = command(v.string(), async (id) => {
  await requireUtCodeMember();

  const result = await publishArticle(id);
  purgeCache().catch(console.error);
  return result;
});

export const unpublish = command(v.string(), async (id) => {
  await requireUtCodeMember();

  const result = await unpublishArticle(id);
  purgeCache().catch(console.error);
  return result;
});
