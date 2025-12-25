import { and, desc, gte, sql } from "drizzle-orm";
import { db } from "$lib/server/drivers/db";
import { article, member, project, viewLog } from "$lib/shared/models/schema";

export async function getTotalArticleViews() {
  const result = await db
    .select({ total: sql<number>`COALESCE(SUM(${article.viewCount}), 0)` })
    .from(article);
  return result[0]?.total ?? 0;
}

export async function getTotalMemberViews() {
  const result = await db
    .select({ total: sql<number>`COALESCE(SUM(${member.viewCount}), 0)` })
    .from(member);
  return result[0]?.total ?? 0;
}

export async function getTotalProjectViews() {
  const result = await db
    .select({ total: sql<number>`COALESCE(SUM(${project.viewCount}), 0)` })
    .from(project);
  return result[0]?.total ?? 0;
}

export async function getTopArticles(limit: number) {
  return db.query.article.findMany({
    orderBy: desc(article.viewCount),
    limit,
    with: { author: true },
  });
}

export async function getTopMembers(limit: number) {
  return db.query.member.findMany({
    orderBy: desc(member.viewCount),
    limit,
  });
}

export async function getTopProjects(limit: number) {
  return db.query.project.findMany({
    orderBy: desc(project.viewCount),
    limit,
    with: { projectMembers: { with: { member: true } } },
  });
}

export async function getViewsByDay(days: number) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  startDate.setHours(0, 0, 0, 0);

  const result = await db
    .select({
      date: sql<string>`DATE(${viewLog.viewedAt})`,
      resourceType: viewLog.resourceType,
      count: sql<number>`COUNT(*)`,
    })
    .from(viewLog)
    .where(gte(viewLog.viewedAt, startDate))
    .groupBy(sql`DATE(${viewLog.viewedAt})`, viewLog.resourceType)
    .orderBy(sql`DATE(${viewLog.viewedAt})`);

  return result;
}

export async function getRecentViewTrend(days: number) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  startDate.setHours(0, 0, 0, 0);

  const result = await db
    .select({
      date: sql<string>`DATE(${viewLog.viewedAt})`,
      count: sql<number>`COUNT(*)`,
    })
    .from(viewLog)
    .where(gte(viewLog.viewedAt, startDate))
    .groupBy(sql`DATE(${viewLog.viewedAt})`)
    .orderBy(sql`DATE(${viewLog.viewedAt})`);

  return result;
}

export async function getResourceViewTrend(
  resourceType: "article" | "member" | "project",
  days: number,
) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  startDate.setHours(0, 0, 0, 0);

  const result = await db
    .select({
      date: sql<string>`DATE(${viewLog.viewedAt})`,
      count: sql<number>`COUNT(*)`,
    })
    .from(viewLog)
    .where(and(gte(viewLog.viewedAt, startDate), sql`${viewLog.resourceType} = ${resourceType}`))
    .groupBy(sql`DATE(${viewLog.viewedAt})`)
    .orderBy(sql`DATE(${viewLog.viewedAt})`);

  return result;
}

export async function getTotalViews() {
  const result = await db.select({ total: sql<number>`COUNT(*)` }).from(viewLog);
  return result[0]?.total ?? 0;
}

export async function getAnalyticsSummary() {
  const [
    totalViews,
    totalArticleViews,
    totalMemberViews,
    totalProjectViews,
    topArticles,
    topMembers,
    topProjects,
  ] = await Promise.all([
    getTotalViews(),
    getTotalArticleViews(),
    getTotalMemberViews(),
    getTotalProjectViews(),
    getTopArticles(10),
    getTopMembers(10),
    getTopProjects(10),
  ]);

  return {
    totalViews,
    totalArticleViews,
    totalMemberViews,
    totalProjectViews,
    topArticles,
    topMembers,
    topProjects,
  };
}
