import { getMembers } from "$lib/data/private/members.remote";
import { getMyPreference } from "$lib/data/private/user-preferences.remote";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
  const [members, preference] = await Promise.all([getMembers(), getMyPreference()]);
  return { members, preference };
};
