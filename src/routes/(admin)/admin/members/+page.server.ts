import { getMembers } from "$lib/data/private/members.remote";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
  const allMembers = await getMembers();
  return { allMembers };
};
