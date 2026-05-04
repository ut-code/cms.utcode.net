import { getArticle } from "$lib/data/private/articles.remote";
import { getMembers } from "$lib/data/private/members.remote";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
  const id = params.id ?? "";
  const [article, authors] = await Promise.all([getArticle(id), getMembers()]);
  return { article, authors };
};
