/**
 * Accepted image MIME types for upload
 * Shared between client and server
 */
export const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/heic",
  "image/heif",
  "image/gif",
  "image/tiff",
  "image/svg+xml",
  "image/bmp",
] as const;

export type AcceptedImageType = (typeof ACCEPTED_IMAGE_TYPES)[number];

/**
 * Check if a MIME type is an accepted image type
 */
export function isAcceptedImageType(type: string): type is AcceptedImageType {
  return ACCEPTED_IMAGE_TYPES.some((t) => t === type);
}

/**
 * Extension-to-MIME mapping for when browsers don't report file.type
 * (common with HEIC/HEIF on desktop browsers)
 */
const EXTENSION_TO_MIME: Record<string, AcceptedImageType> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  avif: "image/avif",
  heic: "image/heic",
  heif: "image/heif",
  gif: "image/gif",
  tiff: "image/tiff",
  tif: "image/tiff",
  svg: "image/svg+xml",
  bmp: "image/bmp",
};

/**
 * Infer MIME type from file extension (case-insensitive).
 * Returns undefined if extension is not recognized.
 */
export function inferImageType(filename: string): AcceptedImageType | undefined {
  const ext = filename.split(".").pop()?.toLowerCase();
  if (!ext) return undefined;
  return EXTENSION_TO_MIME[ext];
}

/**
 * Allowed folder paths for uploads
 */
export const ALLOWED_FOLDERS = [
  "images",
  "uploads",
  "covers",
  "avatars",
  "articles",
  "members",
  "projects",
] as const;

export type AllowedFolder = (typeof ALLOWED_FOLDERS)[number];

/**
 * Check if a folder is allowed
 */
export function isAllowedFolder(folder: string): folder is AllowedFolder {
  return ALLOWED_FOLDERS.some((f) => f === folder);
}
