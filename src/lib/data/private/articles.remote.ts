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

// Re-export getMembers from canonical source
export { getMembers } from "./members.remote";

export const getArticles = query(async () => {
  await requireUtCodeMember();
  return await listAllArticles();
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
    excerpt: v.nullable(v.string()),
    coverUrl: v.nullable(v.string()),
    authorId: v.nullable(v.string()),
    published: v.boolean(),
    publishedAt: v.nullable(v.date()),
  }),
  async (data) => {
    await requireUtCodeMember();
    return await createArticle(data);
  },
);

export const editArticle = command(
  v.object({
    id: v.string(),
    data: v.object({
      slug: v.optional(v.string()),
      title: v.optional(v.string()),
      content: v.optional(v.string()),
      excerpt: v.optional(v.nullable(v.string())),
      coverUrl: v.optional(v.nullable(v.string())),
      authorId: v.optional(v.nullable(v.string())),
      published: v.optional(v.boolean()),
      publishedAt: v.optional(v.nullable(v.date())),
    }),
  }),
  async ({ id, data }) => {
    await requireUtCodeMember();
    return await updateArticle(id, data);
  },
);

export const removeArticle = command(v.string(), async (id) => {
  await requireUtCodeMember();
  await deleteArticle(id);
});

export const publish = command(v.string(), async (id) => {
  await requireUtCodeMember();
  return await publishArticle(id);
});

export const unpublish = command(v.string(), async (id) => {
  await requireUtCodeMember();
  return await unpublishArticle(id);
});
