import { getHomeArticles, getHomeProjects } from "$lib/data/public/index.remote";
import { getStats } from "$lib/data/public/stats.remote";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
  const stats = await getStats();
  const articles = await getHomeArticles(3);
  const allProjects = await getHomeProjects(5);

  return {
    stats,
    articles,
    allProjects,
  };
};
