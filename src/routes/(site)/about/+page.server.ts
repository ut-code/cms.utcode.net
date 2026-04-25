import { countMembers } from "$lib/server/database/members.server";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
  const memberCount = await countMembers();
  return { memberCount };
};
