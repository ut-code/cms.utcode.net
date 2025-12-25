import { getPublicMember } from "$lib/data/public/index.remote";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
  const member = await getPublicMember(params.slug);
  return { member };
};
