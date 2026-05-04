import { getProjects } from "$lib/data/private/projects.remote";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
  const allProjects = await getProjects();
  return { allProjects };
};
