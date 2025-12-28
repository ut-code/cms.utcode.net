import { error } from "@sveltejs/kit";
import * as v from "valibot";
import { command, query } from "$app/server";
import { requireUtCodeMember } from "$lib/server/database/auth.server";
import { getMemberByUserId } from "$lib/server/database/members.server";
import {
  addProjectMember,
  createProject,
  deleteProject,
  getProjectById,
  listProjects,
  removeProjectMember,
  transferLead as serverTransferLead,
  updateProject,
} from "$lib/server/database/projects.server";
import { purgeCache } from "$lib/server/services/cloudflare/cache.server";
import { DB_DEFAULT_LIMIT } from "$lib/shared/constants";
import type { ProjectCategory, ProjectRole } from "$lib/shared/models/schema";

// Re-export getMembers from canonical source
export { getMembers } from "./members.remote";

// Category and role values as const arrays
const PROJECT_CATEGORY_VALUES = [
  "active",
  "ended",
  "hackathon",
  "festival",
  "personal",
] as const satisfies readonly ProjectCategory[];

const PROJECT_ROLE_VALUES = ["lead", "member"] as const satisfies readonly ProjectRole[];

const categorySchema = v.picklist(PROJECT_CATEGORY_VALUES);
const roleSchema = v.picklist(PROJECT_ROLE_VALUES);

export const getProjects = query(async () => {
  await requireUtCodeMember();
  return await listProjects(DB_DEFAULT_LIMIT);
});

export const getProject = query(v.string(), async (id) => {
  await requireUtCodeMember();
  return await getProjectById(id);
});

export const saveProject = command(
  v.object({
    data: v.object({
      slug: v.string(),
      name: v.string(),
      description: v.nullable(v.string()),
      content: v.nullable(v.string()),
      coverUrl: v.nullable(v.string()),
      repoUrl: v.nullable(v.string()),
      demoUrl: v.nullable(v.string()),
      category: categorySchema,
    }),
    leadMemberId: v.string(),
  }),
  async ({ data, leadMemberId }) => {
    await requireUtCodeMember();
    const result = await createProject(data, leadMemberId);
    purgeCache().catch(console.error);
    return result;
  },
);

export const editProject = command(
  v.object({
    id: v.string(),
    data: v.object({
      slug: v.optional(v.string()),
      name: v.optional(v.string()),
      description: v.optional(v.nullable(v.string())),
      content: v.optional(v.nullable(v.string())),
      coverUrl: v.optional(v.nullable(v.string())),
      repoUrl: v.optional(v.nullable(v.string())),
      demoUrl: v.optional(v.nullable(v.string())),
      category: v.optional(categorySchema),
    }),
  }),
  async ({ id, data }) => {
    await requireUtCodeMember();

    const result = await updateProject(id, data);
    purgeCache().catch(console.error);
    return result;
  },
);

export const removeProject = command(v.string(), async (id) => {
  await requireUtCodeMember();

  await deleteProject(id);
  purgeCache().catch(console.error);
});

export const addMember = command(
  v.object({
    projectId: v.string(),
    memberId: v.string(),
    role: v.optional(roleSchema),
  }),
  async ({ projectId, memberId, role }) => {
    await requireUtCodeMember();

    await addProjectMember(projectId, memberId, role);
    purgeCache().catch(console.error);
  },
);

export const removeMember = command(
  v.object({
    projectId: v.string(),
    memberId: v.string(),
  }),
  async ({ projectId, memberId }) => {
    await requireUtCodeMember();

    await removeProjectMember(projectId, memberId);
    purgeCache().catch(console.error);
  },
);

export const transferLead = command(
  v.object({
    projectId: v.string(),
    newLeadMemberId: v.string(),
  }),
  async ({ projectId, newLeadMemberId }) => {
    const session = await requireUtCodeMember();
    const currentUserMember = await getMemberByUserId(session.user.id);
    if (!currentUserMember) throw error(404, "Current user is not a member");

    const project = await getProjectById(projectId);
    if (!project) throw error(404, "Project not found");

    const currentLead = project.projectMembers.find((pm) => pm.role === "lead");
    if (!currentLead) throw error(500, "No current lead found");

    // Authorization check: only the current lead can transfer their role
    if (currentLead.memberId !== currentUserMember.id) {
      throw error(403, "Only the current project lead can transfer the lead role");
    }

    const newLeadMember = project.projectMembers.find((pm) => pm.memberId === newLeadMemberId);
    if (!newLeadMember) throw error(400, "New lead is not a member of this project");

    if (currentLead.memberId === newLeadMemberId) {
      throw error(400, "Member is already the lead");
    }

    await serverTransferLead(projectId, currentLead.memberId, newLeadMemberId);
    purgeCache().catch(console.error);
  },
);
