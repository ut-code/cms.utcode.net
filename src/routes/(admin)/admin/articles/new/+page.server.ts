import { getMembers } from "$lib/data/private/members.remote";
import { getMyPreference } from "$lib/data/private/user-preferences.remote";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
  const [authors, preference] = await Promise.all([getMembers(), getMyPreference()]);
  return { authors, preference };
};
