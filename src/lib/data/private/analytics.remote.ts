import * as v from "valibot";
import { query } from "$app/server";
import {
  getAnalyticsSummary,
  getRecentViewTrend,
  getViewsByDay,
} from "$lib/server/database/analytics.server";
import { requireUtCodeMember } from "$lib/server/database/auth.server";

export const getAnalytics = query(async () => {
  await requireUtCodeMember();
  return await getAnalyticsSummary();
});

export const getViewTrend = query(v.number(), async (days) => {
  await requireUtCodeMember();
  return await getRecentViewTrend(days);
});

export const getViewsByDayAndType = query(v.number(), async (days) => {
  await requireUtCodeMember();
  return await getViewsByDay(days);
});
