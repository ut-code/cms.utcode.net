import { getArticles } from "$lib/data/private/articles.remote";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
  const allArticles = await getArticles();
  return { allArticles };
};
