import { query } from "$app/server";
import { listMembers } from "$lib/server/database/members.server";
import { listAllArticles } from "$lib/server/database/articles.server";
import { listProjects } from "$lib/server/database/projects.server";

export const getStats = query(async () => {
  const [members, articles, projects] = await Promise.all([
    listMembers(),
    listAllArticles(),
    listProjects(),
  ]);

  return {
    members: members.length,
    articles: articles.length,
    publishedArticles: articles.filter((a) => a.published).length,
    projects: projects.length,
  };
});
