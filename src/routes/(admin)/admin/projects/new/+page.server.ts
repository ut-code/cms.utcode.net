import { getMembers } from "$lib/data/private/projects.remote";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
  const members = await getMembers();
  return { members };
};
