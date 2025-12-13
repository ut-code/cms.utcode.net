import { query } from "$app/server";
import { listMembers } from "$lib/server/database/members.server";

export const getMembers = query(async () => {
  return listMembers();
});
