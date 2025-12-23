import * as v from "valibot";
import { command } from "$app/server";
import { requireUtCodeMember } from "$lib/server/database/auth.server";
import { compressImage } from "$lib/server/database/image.server";
import { deleteFile, uploadBuffer } from "$lib/server/database/storage.server";
import { ACCEPTED_IMAGE_TYPES, ALLOWED_FOLDERS } from "$lib/shared/logic/image";
import { S3KeySchema } from "$lib/shared/logic/storage";

/** Allowed folder paths for uploads */
const FolderSchema = v.optional(v.picklist([...ALLOWED_FOLDERS]));

/** Max file size: 10MB (base64 encoded ~13.7MB) */
const MAX_BASE64_SIZE = Math.ceil(10 * 1024 * 1024 * 1.37);

const UploadSchema = v.object({
  data: v.pipe(v.string(), v.maxLength(MAX_BASE64_SIZE, "File too large (max 10MB)")),
  type: v.picklist([...ACCEPTED_IMAGE_TYPES], "Unsupported image format"),
  name: v.pipe(v.string(), v.maxLength(255)),
  folder: FolderSchema,
});

export const upload = command(UploadSchema, async ({ data, type, name, folder }) => {
  await requireUtCodeMember();

  const path = folder ?? "uploads";
  const inputBuffer = Buffer.from(data, "base64");

  // Compress and convert to WebP
  const { buffer, type: outputType, extension } = await compressImage(inputBuffer, type);

  // Replace original extension with output extension
  const baseName = name.replace(/\.[^.]+$/, "");
  const outputName = `${baseName}.${extension}`;

  return await uploadBuffer(buffer, outputType, outputName, path);
});

export const remove = command(S3KeySchema, async (key) => {
  await requireUtCodeMember();
  await deleteFile(key);
});
