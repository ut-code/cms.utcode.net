import * as v from "valibot";
import { command, query } from "$app/server";
import { requireUtCodeMember } from "$lib/server/database/auth.server";
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
  return await listProjects();
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
    return await createProject(data, leadMemberId);
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
    return await updateProject(id, data);
  },
);

export const removeProject = command(v.string(), async (id) => {
  await requireUtCodeMember();
  await deleteProject(id);
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
  },
);

export const transferLead = command(
  v.object({
    projectId: v.string(),
    newLeadMemberId: v.string(),
  }),
  async ({ projectId, newLeadMemberId }) => {
    await requireUtCodeMember();
    const project = await getProjectById(projectId);
    if (!project) throw new Error("Project not found");

    const currentLead = project.projectMembers.find((pm) => pm.role === "lead");
    if (!currentLead) throw new Error("No current lead found");

    const newLeadMember = project.projectMembers.find((pm) => pm.memberId === newLeadMemberId);
    if (!newLeadMember) throw new Error("New lead is not a member of this project");

    if (currentLead.memberId === newLeadMemberId) {
      throw new Error("Member is already the lead");
    }

    await serverTransferLead(projectId, currentLead.memberId, newLeadMemberId);
  },
);
