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
