import { eq, like, or, sql } from "drizzle-orm";
import { env } from "$lib/env/env.server";
import { db } from "$lib/server/drivers/db";
import { member, viewLog } from "$lib/shared/models/schema";
import { createSearchPattern } from "./utils";

export type Member = typeof member.$inferSelect;
export type NewMember = typeof member.$inferInsert;

export const mockMember: Member = {
  id: "mock-member",
  slug: "dev-user",
  name: "Dev User",
  bio: null,
  imageUrl: null,
  pageContent: null,
  userId: "mock",
  viewCount: 0,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export async function listMembers(limit: number) {
  return db.query.member.findMany({
    orderBy: (t, { desc }) => desc(t.createdAt),
    limit,
  });
}

export async function getMemberBySlug(slug: string) {
  const result = await db.query.member.findFirst({
    where: eq(member.slug, slug),
    with: {
      projectMembers: { with: { project: true } },
    },
  });

  // Fire-and-forget: view count accuracy is not critical
  if (result) {
    Promise.all([
      db
        .update(member)
        .set({ viewCount: sql`${member.viewCount} + 1` })
        .where(eq(member.slug, slug)),
      db.insert(viewLog).values({
        resourceType: "member",
        resourceId: result.id,
      }),
    ]).catch(console.error);
  }

  return result;
}

export async function getMemberById(memberId: string) {
  return db.query.member.findFirst({
    where: eq(member.id, memberId),
    with: {
      projectMembers: { with: { project: true } },
    },
  });
}

export async function getMemberByUserId(userId: string) {
  if (env.UNSAFE_DISABLE_AUTH === "true" && userId === "mock") {
    return mockMember;
  }
  return db.query.member.findFirst({
    where: eq(member.userId, userId),
  });
}

export async function createMember(data: NewMember) {
  const [created] = await db.insert(member).values(data).returning();
  if (!created) throw new Error("Failed to create member");
  return created;
}

export async function updateMember(memberId: string, data: Partial<Omit<NewMember, "id">>) {
  const [updated] = await db
    .update(member)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(member.id, memberId))
    .returning();
  if (!updated) throw new Error("Failed to update member");
  return updated;
}

export async function deleteMember(memberId: string) {
  await db.delete(member).where(eq(member.id, memberId));
}

export async function searchMembers(query: string, limit: number) {
  const searchPattern = createSearchPattern(query);
  if (!searchPattern) {
    return [];
  }

  return db.query.member.findMany({
    where: or(like(member.name, searchPattern), like(member.bio, searchPattern)),
    orderBy: (t, { desc }) => desc(t.createdAt),
    limit,
  });
}

export async function countMembers() {
  const result = await db.select({ count: sql<number>`count(*)` }).from(member);
  return result[0]?.count ?? 0;
}
