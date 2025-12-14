import * as v from "valibot";
import { query, command } from "$app/server";
import { requireUtCodeMember } from "$lib/server/database/auth.server";
import {
  listAllArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
  publishArticle,
  unpublishArticle,
} from "$lib/server/database/articles.server";
import { listMembers } from "$lib/server/database/members.server";

export const getArticles = query(async () => {
  await requireUtCodeMember();
  return listAllArticles();
});

export const getArticle = query(v.string(), async (id) => {
  await requireUtCodeMember();
  return getArticleById(id);
});

export const getAuthors = query(async () => {
  await requireUtCodeMember();
  return listMembers();
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
    return createArticle(data);
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
    return updateArticle(id, data);
  },
);

export const removeArticle = command(v.string(), async (id) => {
  await requireUtCodeMember();
  await deleteArticle(id);
});

export const publish = command(v.string(), async (id) => {
  await requireUtCodeMember();
  return publishArticle(id);
});

export const unpublish = command(v.string(), async (id) => {
  await requireUtCodeMember();
  return unpublishArticle(id);
});
