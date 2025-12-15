import { eq } from "drizzle-orm";
import { db } from "$lib/server/drivers/db";
import { member } from "$lib/shared/models/schema";

export type Member = typeof member.$inferSelect;
export type NewMember = typeof member.$inferInsert;

export async function listMembers() {
  return db.query.member.findMany({
    orderBy: (t, { desc }) => desc(t.createdAt),
  });
}

export async function getMemberBySlug(slug: string) {
  return db.query.member.findFirst({
    where: eq(member.slug, slug),
    with: {
      projectMembers: { with: { project: true } },
    },
  });
}

export async function getMemberById(id: string) {
  return db.query.member.findFirst({
    where: eq(member.id, id),
  });
}

export async function getMemberByUserId(userId: string) {
  return db.query.member.findFirst({
    where: eq(member.userId, userId),
  });
}

export async function createMember(data: NewMember) {
  const [created] = await db.insert(member).values(data).returning();
  if (!created) throw new Error("Failed to create member");
  return created;
}

export async function updateMember(id: string, data: Partial<Omit<NewMember, "id">>) {
  const [updated] = await db
    .update(member)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(member.id, id))
    .returning();
  if (!updated) throw new Error("Failed to update member");
  return updated;
}

export async function deleteMember(id: string) {
  await db.delete(member).where(eq(member.id, id));
}

export async function linkMemberToUser(memberId: string, userId: string) {
  return updateMember(memberId, { userId });
}
