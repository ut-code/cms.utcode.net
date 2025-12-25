import { query } from "$app/server";
import { countPublishedArticles } from "$lib/server/database/articles.server";
import { countMembers } from "$lib/server/database/members.server";
import { countProjects } from "$lib/server/database/projects.server";

export const getStats = query(async () => {
  const [members, articles, projects] = await Promise.all([
    countMembers(),
    countPublishedArticles(),
    countProjects(),
  ]);

  return {
    members,
    articles,
    projects,
  };
});
