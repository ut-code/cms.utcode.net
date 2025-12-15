import * as v from "valibot";

/**
 * Regex pattern for valid slugs: lowercase letters, numbers, and hyphens
 */
export const SLUG_PATTERN = /^[a-z0-9-]+$/;

/**
 * Valibot schema for slug validation
 */
export const SlugSchema = v.pipe(
  v.string(),
  v.minLength(1, "Slug is required"),
  v.regex(SLUG_PATTERN, "Slug must be lowercase letters, numbers, and hyphens only"),
);

/**
 * Validates a slug string
 * @param slug - The slug to validate
 * @returns true if valid, false otherwise
 */
export function validateSlug(slug: string): boolean {
  return SLUG_PATTERN.test(slug);
}

/**
 * Generates a URL-friendly slug from a title or name
 * @param text - The text to convert to a slug
 * @returns A lowercase slug with hyphens
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, ""); // trim leading/trailing hyphens
}
