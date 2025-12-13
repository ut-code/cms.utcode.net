import { query } from "$app/server";
import { listAllArticles } from "$lib/server/database/articles.server";

export const getArticles = query(async () => {
  return listAllArticles();
});
