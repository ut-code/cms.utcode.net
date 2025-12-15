import * as v from "valibot";
import { query, command } from "$app/server";
import {
  listPublishedArticles,
  getPublishedArticle,
  incrementViewCount,
  getRelatedArticles,
  searchPublishedArticles,
} from "$lib/server/database/articles.server";
import {
  listProjects,
  getProjectBySlug,
  searchProjects,
} from "$lib/server/database/projects.server";
import { listMembers, getMemberBySlug } from "$lib/server/database/members.server";
import type { SearchResult } from "$lib/shared/logic/search";

export const getPublicArticles = query(listPublishedArticles);
export const getPublicArticle = query(v.string(), getPublishedArticle);
export const incrementArticleViewCount = command(v.string(), incrementViewCount);
export const getPublicRelatedArticles = query(
  v.object({
    articleId: v.string(),
    authorId: v.nullable(v.string()),
    limit: v.number(),
  }),
  ({ articleId, authorId, limit }) => getRelatedArticles(articleId, authorId, limit),
);

export const getPublicProjects = query(listProjects);
export const getPublicProject = query(v.string(), getProjectBySlug);

export const getPublicMembers = query(listMembers);
export const getPublicMember = query(v.string(), getMemberBySlug);

export const searchPublic = query(
  v.string(),
  async (searchQuery: string): Promise<SearchResult[]> => {
    const [articles, projects] = await Promise.all([
      searchPublishedArticles(searchQuery),
      searchProjects(searchQuery),
    ]);

    const articleResults: SearchResult[] = articles.map((article) => ({
      type: "article" as const,
      id: article.id,
      slug: article.slug,
      title: article.title,
      excerpt: article.excerpt,
      coverUrl: article.coverUrl,
      publishedAt: article.publishedAt,
      author: article.author,
    }));

    const projectResults: SearchResult[] = projects.map((project) => ({
      type: "project" as const,
      id: project.id,
      slug: project.slug,
      name: project.name,
      description: project.description,
      coverUrl: project.coverUrl,
    }));

    return [...articleResults, ...projectResults];
  },
);
