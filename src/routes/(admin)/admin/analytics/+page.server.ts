import { getAnalytics, getViewTrend } from "$lib/data/private/analytics.remote";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
  const [analytics, viewTrend] = await Promise.all([getAnalytics(), getViewTrend(30)]);
  return { analytics, viewTrend };
};
