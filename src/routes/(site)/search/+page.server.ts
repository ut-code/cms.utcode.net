import { searchPublic } from "$lib/data/public/index.remote";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ url }) => {
  const query = url.searchParams.get("q") ?? "";
  const results = query ? await searchPublic(query) : [];

  return {
    query,
    results,
  };
};
