import { getMember } from "$lib/data/private/members.remote";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
  const member = await getMember(params.id ?? "");
  return { member };
};
