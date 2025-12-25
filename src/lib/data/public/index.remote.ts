import * as v from "valibot";
import { query } from "$app/server";
import {
  getPublishedArticle,
  getRecentPublishedArticles,
  getRelatedArticles,
  listPublishedArticles,
  searchPublishedArticles,
} from "$lib/server/database/articles.server";
import { getMemberBySlug, listMembers, searchMembers } from "$lib/server/database/members.server";
import {
  getProjectBySlug,
  listProjects,
  listRecentProjects,
  searchProjects,
} from "$lib/server/database/projects.server";
import type { SearchResult } from "$lib/shared/logic/search";

export const getPublicArticles = query(async () => listPublishedArticles());
export const getPublicArticle = query(v.string(), async (slug) => getPublishedArticle(slug));
export const getPublicRelatedArticles = query(
  v.object({
    articleId: v.string(),
    authorId: v.nullable(v.string()),
    limit: v.number(),
  }),
  async ({ articleId, authorId, limit }) => getRelatedArticles(articleId, authorId, limit),
);

export const getPublicProjects = query(async () => listProjects());
export const getPublicProject = query(v.string(), async (slug) => getProjectBySlug(slug));

export const getHomeArticles = query(v.number(), async (limit) =>
  getRecentPublishedArticles(limit),
);
export const getHomeProjects = query(v.number(), async (limit) => listRecentProjects(limit));

export const getPublicMembers = query(async () => listMembers());
export const getPublicMember = query(v.string(), async (slug) => getMemberBySlug(slug));

export const searchPublic = query(
  v.string(),
  async (searchQuery: string): Promise<SearchResult[]> => {
    const [articles, projects, members] = await Promise.all([
      searchPublishedArticles(searchQuery),
      searchProjects(searchQuery),
      searchMembers(searchQuery),
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

    const memberResults: SearchResult[] = members.map((member) => ({
      type: "member" as const,
      id: member.id,
      slug: member.slug,
      name: member.name,
      bio: member.bio,
    }));

    return [...articleResults, ...projectResults, ...memberResults];
  },
);
