import { query } from "$app/server";
import { requireUtCodeMember } from "$lib/server/database/auth.server";

export const getAdminSession = query(async () => {
  return await requireUtCodeMember();
});
