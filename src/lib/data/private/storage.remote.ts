import { command } from "$app/server";
import * as v from "valibot";
import { requireUtCodeMember } from "$lib/server/database/auth.server";
import { uploadBuffer, deleteFile } from "$lib/server/database/storage.server";
import { S3KeySchema } from "$lib/shared/logic/storage";

export const upload = command(
  v.object({
    data: v.string(), // base64
    type: v.string(), // mime type
    name: v.string(), // file name
    folder: v.optional(v.string()),
  }),
  async ({ data, type, name, folder }) => {
    await requireUtCodeMember();
    const path = folder ?? "uploads";
    const buffer = Buffer.from(data, "base64");
    return await uploadBuffer(buffer, type, name, path);
  },
);

export const remove = command(S3KeySchema, async (key) => {
  await requireUtCodeMember();
  await deleteFile(key);
});
