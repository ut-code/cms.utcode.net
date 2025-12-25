import { getPublicProject } from "$lib/data/public/index.remote";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
  const project = await getPublicProject(params.slug);
  return { project };
};
