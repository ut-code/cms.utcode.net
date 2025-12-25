import { getPublicProjects } from "$lib/data/public/index.remote";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ url }) => {
  const projects = await getPublicProjects();
  const categoryParam = url.searchParams.get("category");
  const currentPage = Number(url.searchParams.get("page")) || 1;

  return {
    projects,
    categoryParam,
    currentPage,
  };
};
