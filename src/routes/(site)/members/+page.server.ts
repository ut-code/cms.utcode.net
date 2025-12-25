import { getPublicMembers } from "$lib/data/public/index.remote";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ url }) => {
  const members = await getPublicMembers();
  const currentPage = Number(url.searchParams.get("page")) || 1;

  return {
    members,
    currentPage,
  };
};
