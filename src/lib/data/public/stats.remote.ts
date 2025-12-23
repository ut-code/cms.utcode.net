import { query } from "$app/server";
import { listPublishedArticles } from "$lib/server/database/articles.server";
import { listMembers } from "$lib/server/database/members.server";
import { listProjects } from "$lib/server/database/projects.server";

export const getStats = query(async () => {
  const [members, articles, projects] = await Promise.all([
    listMembers(),
    listPublishedArticles(),
    listProjects(),
  ]);

  return {
    members: members.length,
    articles: articles.length,
    projects: projects.length,
  };
});
