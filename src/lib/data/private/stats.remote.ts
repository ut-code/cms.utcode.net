import { query } from "$app/server";
import { getAnalyticsSummary } from "$lib/server/database/analytics.server";
import {
  countArticles,
  countPublishedArticles,
  getRecentArticles,
  getRecentDraftArticles,
} from "$lib/server/database/articles.server";
import { requireUtCodeMember } from "$lib/server/database/auth.server";
import { countMembers } from "$lib/server/database/members.server";
import { countProjects, getRecentProjects } from "$lib/server/database/projects.server";

export const getAdminStats = query(async () => {
  await requireUtCodeMember();

  const [
    membersCount,
    articlesCount,
    publishedArticlesCount,
    projectsCount,
    recentArticles,
    recentProjects,
    draftArticles,
    analytics,
  ] = await Promise.all([
    countMembers(),
    countArticles(),
    countPublishedArticles(),
    countProjects(),
    getRecentArticles(5),
    getRecentProjects(3),
    getRecentDraftArticles(3),
    getAnalyticsSummary(),
  ]);

  return {
    members: membersCount,
    articles: articlesCount,
    publishedArticles: publishedArticlesCount,
    projects: projectsCount,
    recentArticles: recentArticles.map((a) => ({
      id: a.id,
      title: a.title,
      slug: a.slug,
      published: a.published,
      updatedAt: a.updatedAt,
      type: "article" as const,
    })),
    recentProjects: recentProjects.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      updatedAt: p.updatedAt,
      type: "project" as const,
    })),
    draftArticles: draftArticles.map((a) => ({
      id: a.id,
      title: a.title,
      slug: a.slug,
      updatedAt: a.updatedAt,
    })),
    analytics,
  };
});
