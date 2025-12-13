import { query } from "$app/server";
import { requireOrgMember } from "$lib/server/database/auth.server";

export const getAdminSession = query(async () => {
  return requireOrgMember();
});
