import { query } from "$app/server";
import { listMembers } from "$lib/server/database/members.server";
import { listAllArticles } from "$lib/server/database/articles.server";
import { listProjects } from "$lib/server/database/projects.server";
import { requireUtCodeMember } from "$lib/server/database/auth.server";

export const getAdminStats = query(async () => {
  await requireUtCodeMember();

  const [members, articles, projects] = await Promise.all([
    listMembers(),
    listAllArticles(),
    listProjects(),
  ]);

  // Get recent items (last 5)
  const recentArticles = [...articles]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5)
    .map((a) => ({
      id: a.id,
      title: a.title,
      slug: a.slug,
      published: a.published,
      updatedAt: a.updatedAt,
      type: "article" as const,
    }));

  const recentProjects = [...projects]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 3)
    .map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      updatedAt: p.updatedAt,
      type: "project" as const,
    }));

  // Draft articles that need attention
  const draftArticles = articles
    .filter((a) => !a.published)
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 3)
    .map((a) => ({
      id: a.id,
      title: a.title,
      slug: a.slug,
      updatedAt: a.updatedAt,
    }));

  return {
    members: members.length,
    articles: articles.length,
    publishedArticles: articles.filter((a) => a.published).length,
    projects: projects.length,
    recentArticles,
    recentProjects,
    draftArticles,
  };
});
