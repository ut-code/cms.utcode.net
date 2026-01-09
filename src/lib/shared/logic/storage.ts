import * as v from "valibot";
import { ALLOWED_FOLDERS } from "./image";

/**
 * Regex pattern for valid S3 keys: {folder}/{uuid}-{filename}.{ext} format
 * Example: articles/a1b2c3d4-e5f6-7890-abcd-ef1234567890-cover.webp
 * This prevents path traversal attacks and ensures consistent key structure
 */
export const S3_KEY_PATTERN = /^[a-z]+\/[a-f0-9-]+-[^/]+\.[a-zA-Z0-9]+$/;

/**
 * Valibot schema for S3 key validation
 * Ensures keys follow the {folder}/{uuid}-{filename}.{ext} format
 */
export const S3KeySchema = v.pipe(
  v.string(),
  v.regex(S3_KEY_PATTERN, "Invalid S3 key format"),
  v.check((key) => {
    const folder = key.split("/")[0];
    return ALLOWED_FOLDERS.some((f) => f === folder);
  }, "Invalid folder"),
);

/**
 * Validates an S3 key string
 * @param key - The S3 key to validate
 * @returns true if valid, false otherwise
 */
export function validateS3Key(key: string): boolean {
  return S3_KEY_PATTERN.test(key) && ALLOWED_FOLDERS.some((f) => f === key.split("/")[0]);
}

/**
 * Extracts file extension from an S3 key
 * @param key - The S3 key
 * @returns The file extension or null if invalid
 */
export function getExtensionFromKey(key: string): string | null {
  const match = key.match(/\.([a-zA-Z0-9]+)$/);
  return match?.[1] ?? null;
}

/**
 * Extracts S3 key from a full S3 URL
 * @param url - The full S3 URL (e.g., http://localhost:9000/dev/articles/uuid-file.webp)
 * @param baseUrl - The S3 public URL base (e.g., http://localhost:9000/dev)
 * @returns The S3 key or null if invalid
 */
export function extractS3KeyFromUrl(url: string, baseUrl: string): string | null {
  if (!url.startsWith(baseUrl)) return null;
  const key = url.slice(baseUrl.length + 1); // +1 for the trailing slash
  return validateS3Key(key) ? key : null;
}
