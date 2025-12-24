import { query } from "$app/server";
import { getAnalyticsSummary } from "$lib/server/database/analytics.server";
import { requireUtCodeMember } from "$lib/server/database/auth.server";

export const getAnalytics = query(async () => {
  await requireUtCodeMember();
  return await getAnalyticsSummary();
});
