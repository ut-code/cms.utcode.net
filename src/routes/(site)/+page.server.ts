import { getHomeArticles, getHomeProjects } from "$lib/data/public/index.remote";
import { getStats } from "$lib/data/public/stats.remote";
import { HOME_FEATURED_ARTICLES_LIMIT, HOME_FEATURED_PROJECTS_LIMIT } from "$lib/shared/constants";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
  const [stats, articles, featuredProjects] = await Promise.all([
    getStats(),
    getHomeArticles(HOME_FEATURED_ARTICLES_LIMIT),
    getHomeProjects(HOME_FEATURED_PROJECTS_LIMIT),
  ]);

  return {
    stats,
    articles,
    featuredProjects,
  };
};
