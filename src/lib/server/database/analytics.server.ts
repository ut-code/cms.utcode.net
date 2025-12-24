import { desc, sql } from "drizzle-orm";
import { db } from "$lib/server/drivers/db";
import { article, member, project } from "$lib/shared/models/schema";

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

export async function getAnalyticsSummary() {
  const [
    totalArticleViews,
    totalMemberViews,
    totalProjectViews,
    topArticles,
    topMembers,
    topProjects,
  ] = await Promise.all([
    getTotalArticleViews(),
    getTotalMemberViews(),
    getTotalProjectViews(),
    getTopArticles(10),
    getTopMembers(10),
    getTopProjects(10),
  ]);

  return {
    totalArticleViews,
    totalMemberViews,
    totalProjectViews,
    totalViews: totalArticleViews + totalMemberViews + totalProjectViews,
    topArticles,
    topMembers,
    topProjects,
  };
}
