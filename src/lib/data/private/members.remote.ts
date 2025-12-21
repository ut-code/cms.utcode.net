import * as v from "valibot";
import { query, command } from "$app/server";
import { requireUtCodeMember } from "$lib/server/database/auth.server";
import {
  listMembers,
  getMemberById,
  createMember,
  updateMember,
  deleteMember,
} from "$lib/server/database/members.server";

export const getMembers = query(async () => {
  await requireUtCodeMember();
  return await listMembers();
});

export const getMember = query(v.string(), async (id) => {
  await requireUtCodeMember();
  return await getMemberById(id);
});

export const saveMember = command(
  v.object({
    slug: v.string(),
    name: v.string(),
    bio: v.nullable(v.string()),
    imageUrl: v.nullable(v.string()),
    pageContent: v.nullable(v.string()),
  }),
  async (data) => {
    await requireUtCodeMember();
    return await createMember(data);
  },
);

export const editMember = command(
  v.object({
    id: v.string(),
    data: v.object({
      slug: v.optional(v.string()),
      name: v.optional(v.string()),
      bio: v.optional(v.nullable(v.string())),
      imageUrl: v.optional(v.nullable(v.string())),
      pageContent: v.optional(v.nullable(v.string())),
    }),
  }),
  async ({ id, data }) => {
    await requireUtCodeMember();
    return await updateMember(id, data);
  },
);

export const removeMember = command(v.string(), async (id) => {
  await requireUtCodeMember();
  await deleteMember(id);
});
