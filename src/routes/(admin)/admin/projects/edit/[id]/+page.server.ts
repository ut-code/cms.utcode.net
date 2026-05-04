import { getMembers, getProject } from "$lib/data/private/projects.remote";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
  const id = params.id ?? "";
  const [project, members] = await Promise.all([getProject(id), getMembers()]);
  return { project, members };
};
