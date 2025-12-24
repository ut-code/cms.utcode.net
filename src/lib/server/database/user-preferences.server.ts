import { eq } from "drizzle-orm";
import { db } from "$lib/server/drivers/db";
import { userPreference } from "$lib/shared/models/schema";

export type UserPreference = typeof userPreference.$inferSelect;
export type NewUserPreference = typeof userPreference.$inferInsert;

export async function getUserPreference(userId: string) {
  return db.query.userPreference.findFirst({
    where: eq(userPreference.userId, userId),
    with: { defaultAuthor: true },
  });
}

export async function setDefaultAuthor(userId: string, defaultAuthorId: string | null) {
  // Check if preference exists
  const existing = await db.query.userPreference.findFirst({
    where: eq(userPreference.userId, userId),
  });

  if (existing) {
    // Update existing preference
    const [updated] = await db
      .update(userPreference)
      .set({ defaultAuthorId, updatedAt: new Date() })
      .where(eq(userPreference.userId, userId))
      .returning();
    if (!updated) throw new Error("Failed to update user preference");
    return updated;
  }

  // Create new preference
  const [created] = await db.insert(userPreference).values({ userId, defaultAuthorId }).returning();
  if (!created) throw new Error("Failed to create user preference");
  return created;
}
