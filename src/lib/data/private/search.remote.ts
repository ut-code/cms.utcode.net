import * as v from "valibot";
import { query } from "$app/server";
import { searchAllArticles } from "$lib/server/database/articles.server";
import { requireUtCodeMember } from "$lib/server/database/auth.server";
import { searchMembers } from "$lib/server/database/members.server";
import { searchProjects } from "$lib/server/database/projects.server";
import { DB_SEARCH_LIMIT } from "$lib/shared/constants";
import type { AdminSearchResult } from "$lib/shared/logic/search";

export const searchAdmin = query(
  v.string(),
  async (searchQuery: string): Promise<AdminSearchResult[]> => {
    await requireUtCodeMember();

    const [articles, projects, members] = await Promise.all([
      searchAllArticles(searchQuery, DB_SEARCH_LIMIT),
      searchProjects(searchQuery, DB_SEARCH_LIMIT),
      searchMembers(searchQuery, DB_SEARCH_LIMIT),
    ]);

    const articleResults: AdminSearchResult[] = articles.map((article) => ({
      type: "article" as const,
      id: article.id,
      slug: article.slug,
      title: article.title,
      published: article.published,
      author: article.author,
    }));

    const projectResults: AdminSearchResult[] = projects.map((project) => ({
      type: "project" as const,
      id: project.id,
      slug: project.slug,
      name: project.name,
    }));

    const memberResults: AdminSearchResult[] = members.map((member) => ({
      type: "member" as const,
      id: member.id,
      slug: member.slug,
      name: member.name,
      imageUrl: member.imageUrl,
    }));

    return [...articleResults, ...projectResults, ...memberResults];
  },
);
