import { query } from "$app/server";
import { listProjects } from "$lib/server/database/projects.server";

export const getProjects = query(async () => {
  return listProjects();
});
