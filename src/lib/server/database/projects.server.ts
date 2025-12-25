import { and, eq, like, or, sql } from "drizzle-orm";
import { db } from "$lib/server/drivers/db";
import { type ProjectRole, project, projectMember, viewLog } from "$lib/shared/models/schema";
import { createSearchPattern } from "./utils";

export type Project = typeof project.$inferSelect;
export type NewProject = typeof project.$inferInsert;

export async function listProjects(limit: number) {
  return db.query.project.findMany({
    orderBy: (t, { desc }) => desc(t.createdAt),
    limit,
    with: {
      projectMembers: { with: { member: true } },
    },
  });
}

export async function getProjectBySlug(slug: string) {
  const result = await db.query.project.findFirst({
    where: eq(project.slug, slug),
    with: {
      projectMembers: { with: { member: true } },
    },
  });

  // Fire-and-forget: view count accuracy is not critical
  if (result) {
    Promise.all([
      db
        .update(project)
        .set({ viewCount: sql`${project.viewCount} + 1` })
        .where(eq(project.slug, slug)),
      db.insert(viewLog).values({
        resourceType: "project",
        resourceId: result.id,
      }),
    ]).catch(console.error);
  }

  return result;
}

export async function getProjectById(projectId: string) {
  return db.query.project.findFirst({
    where: eq(project.id, projectId),
    with: {
      projectMembers: { with: { member: true } },
    },
  });
}

export async function createProject(data: NewProject, leadMemberId: string) {
  const [created] = await db.insert(project).values(data).returning();
  if (!created) throw new Error("Failed to create project");
  await db.insert(projectMember).values({
    projectId: created.id,
    memberId: leadMemberId,
    role: "lead",
  });
  return created;
}

export async function updateProject(projectId: string, data: Partial<Omit<NewProject, "id">>) {
  const [updated] = await db
    .update(project)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(project.id, projectId))
    .returning();
  return updated;
}

export async function deleteProject(projectId: string) {
  await db.delete(project).where(eq(project.id, projectId));
}

export async function addProjectMember(
  projectId: string,
  memberId: string,
  role: ProjectRole = "member",
) {
  await db.insert(projectMember).values({ projectId, memberId, role });
}

export async function removeProjectMember(projectId: string, memberId: string) {
  await db
    .delete(projectMember)
    .where(and(eq(projectMember.projectId, projectId), eq(projectMember.memberId, memberId)));
}

export async function updateProjectMemberRole(
  projectId: string,
  memberId: string,
  role: ProjectRole,
) {
  await db
    .update(projectMember)
    .set({ role })
    .where(and(eq(projectMember.projectId, projectId), eq(projectMember.memberId, memberId)));
}

export async function transferLead(projectId: string, fromMemberId: string, toMemberId: string) {
  await updateProjectMemberRole(projectId, fromMemberId, "member");
  await updateProjectMemberRole(projectId, toMemberId, "lead");
}

export async function searchProjects(query: string, limit: number) {
  const searchPattern = createSearchPattern(query);
  if (!searchPattern) {
    return [];
  }

  return db.query.project.findMany({
    where: or(
      like(project.name, searchPattern),
      like(project.description, searchPattern),
      like(project.content, searchPattern),
    ),
    orderBy: (t, { desc }) => desc(t.createdAt),
    limit,
    with: {
      projectMembers: { with: { member: true } },
    },
  });
}

export async function countProjects() {
  const result = await db.select({ count: sql<number>`count(*)` }).from(project);
  return result[0]?.count ?? 0;
}

export async function getRecentProjects(limit: number) {
  return db.query.project.findMany({
    orderBy: (t, { desc }) => desc(t.updatedAt),
    limit,
  });
}

export async function listRecentProjects(limit: number) {
  return db.query.project.findMany({
    orderBy: (t, { desc }) => desc(t.createdAt),
    limit,
    with: {
      projectMembers: { with: { member: true } },
    },
  });
}
