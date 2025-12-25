import { getPublicArticle, getPublicRelatedArticles } from "$lib/data/public/index.remote";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
  const article = await getPublicArticle(params.slug);
  const relatedArticles = article
    ? await getPublicRelatedArticles({
        articleId: article.id,
        authorId: article.authorId,
        limit: 3,
      })
    : [];

  return { article, relatedArticles };
};
