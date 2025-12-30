import * as v from "valibot";
import { command, query } from "$app/server";
import { requireUtCodeMember } from "$lib/server/database/auth.server";
import {
  createMember,
  deleteMember,
  getMemberById,
  listMembers,
  updateMember,
} from "$lib/server/database/members.server";
import { purgeCache } from "$lib/server/services/cloudflare/cache.server";
import { DB_MEMBERS_LIMIT } from "$lib/shared/constants";

export const getMembers = query(async () => {
  await requireUtCodeMember();
  return await listMembers(DB_MEMBERS_LIMIT);
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
    githubUrl: v.nullable(v.string()),
    twitterUrl: v.nullable(v.string()),
    websiteUrl: v.nullable(v.string()),
    pageContent: v.nullable(v.string()),
  }),
  async (data) => {
    await requireUtCodeMember();
    const result = await createMember(data);
    purgeCache().catch(console.error);
    return result;
  },
);

export const editMember = command(
  v.object({
    id: v.string(),
    data: v.object({
      slug: v.string(),
      name: v.string(),
      bio: v.nullable(v.string()),
      imageUrl: v.nullable(v.string()),
      githubUrl: v.nullable(v.string()),
      twitterUrl: v.nullable(v.string()),
      websiteUrl: v.nullable(v.string()),
      pageContent: v.nullable(v.string()),
    }),
  }),
  async ({ id, data }) => {
    await requireUtCodeMember();

    const result = await updateMember(id, data);
    purgeCache().catch(console.error);
    return result;
  },
);

export const removeMember = command(v.string(), async (id) => {
  await requireUtCodeMember();

  await deleteMember(id);
  purgeCache().catch(console.error);
});
