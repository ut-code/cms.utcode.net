import { getPublicArticles } from "$lib/data/public/index.remote";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ url }) => {
  const articles = await getPublicArticles();
  const currentPage = Number(url.searchParams.get("page")) || 1;

  return {
    articles,
    currentPage,
  };
};
