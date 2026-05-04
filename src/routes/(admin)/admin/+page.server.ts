import { getAdminStats } from "$lib/data/private/stats.remote";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ url }) => {
  const stats = await getAdminStats();
  const currentPage = Number(url.searchParams.get("page")) || 1;
  return { stats, currentPage };
};
