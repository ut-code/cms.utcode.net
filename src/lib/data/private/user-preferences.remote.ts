import * as v from "valibot";
import { command, query } from "$app/server";
import { requireUtCodeMember } from "$lib/server/database/auth.server";
import { getUserPreference, setDefaultAuthor } from "$lib/server/database/user-preferences.server";

export const getMyPreference = query(async () => {
  const session = await requireUtCodeMember();
  return await getUserPreference(session.user.id);
});

export const updateDefaultAuthor = command(v.nullable(v.string()), async (defaultAuthorId) => {
  const session = await requireUtCodeMember();
  return await setDefaultAuthor(session.user.id, defaultAuthorId);
});
