import { command } from "$app/server";
import * as v from "valibot";
import { requireUtCodeMember } from "$lib/server/database/auth.server";
import { uploadFile, deleteFile } from "$lib/server/database/storage.server";

export const upload = command(
  v.object({
    file: v.instance(File),
    folder: v.optional(v.string()),
  }),
  async ({ file, folder }) => {
    await requireUtCodeMember();
    const path = folder ?? "uploads";
    return uploadFile(file, path);
  },
);

export const remove = command(v.string(), async (key) => {
  await requireUtCodeMember();
  await deleteFile(key);
});
