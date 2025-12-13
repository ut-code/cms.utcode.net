import { eq } from "drizzle-orm";
import { db } from "$lib/shared/db/db.server";
import { member } from "$lib/shared/models/schema";
import { requireOrgMember } from "./auth";

export type Member = typeof member.$inferSelect;
export type NewMember = typeof member.$inferInsert;

// ============================================================================
// Public - no auth required
// ============================================================================

export async function listMembers() {
  return db.query.member.findMany({
    orderBy: (t, { desc }) => desc(t.createdAt),
  });
}

export async function getMember(slug: string) {
  return db.query.member.findFirst({
    where: eq(member.slug, slug),
  });
}

// ============================================================================
// Admin - org member required (auth checked internally via getRequestEvent)
// ============================================================================

export async function getMemberById(id: string) {
  await requireOrgMember();
  return db.query.member.findFirst({
    where: eq(member.id, id),
  });
}

export async function getMemberByUserId(userId: string) {
  await requireOrgMember();
  return db.query.member.findFirst({
    where: eq(member.userId, userId),
  });
}

export async function createMember(data: NewMember) {
  await requireOrgMember();
  const [created] = await db.insert(member).values(data).returning();
  return created;
}

export async function updateMember(id: string, data: Partial<Omit<NewMember, "id">>) {
  await requireOrgMember();
  const [updated] = await db
    .update(member)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(member.id, id))
    .returning();
  return updated;
}

export async function deleteMember(id: string) {
  await requireOrgMember();
  await db.delete(member).where(eq(member.id, id));
}

export async function linkMemberToUser(memberId: string, userId: string) {
  return updateMember(memberId, { userId });
}
