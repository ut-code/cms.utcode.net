import { getArticle } from "$lib/data/private/articles.remote";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
  const article = await getArticle(params.id ?? "");
  return { article };
};
