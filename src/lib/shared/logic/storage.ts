import * as v from "valibot";

/**
 * Regex pattern for valid S3 keys: {uuid}/{uuid}.{ext} format
 * This prevents path traversal attacks and ensures consistent key structure
 */
export const S3_KEY_PATTERN = /^[a-f0-9-]+\/[a-f0-9-]+\.[a-zA-Z0-9]+$/;

/**
 * Valibot schema for S3 key validation
 * Ensures keys follow the {uuid}/{uuid}.{ext} format
 */
export const S3KeySchema = v.pipe(v.string(), v.regex(S3_KEY_PATTERN, "Invalid S3 key format"));

/**
 * Validates an S3 key string
 * @param key - The S3 key to validate
 * @returns true if valid, false otherwise
 */
export function validateS3Key(key: string): boolean {
  return S3_KEY_PATTERN.test(key);
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
