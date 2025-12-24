import * as v from "valibot";

/**
 * Regex pattern for valid slugs: lowercase letters, numbers, and hyphens
 */
export const SLUG_PATTERN = /^[a-z0-9-]+$/;

/**
 * Regex pattern for article slugs: YYYY-MM-DD prefix required
 */
export const ARTICLE_SLUG_PATTERN = /^\d{4}-\d{2}-\d{2}-[a-z0-9-]+$/;

/**
 * Valibot schema for slug validation
 */
export const SlugSchema = v.pipe(
  v.string(),
  v.minLength(1, "Slug is required"),
  v.regex(SLUG_PATTERN, "Slug must be lowercase letters, numbers, and hyphens only"),
);

/**
 * Valibot schema for article slug validation (requires YYYY-MM-DD prefix)
 */
export const ArticleSlugSchema = v.pipe(
  v.string(),
  v.minLength(1, "Slug is required"),
  v.regex(
    ARTICLE_SLUG_PATTERN,
    "Article slug must start with YYYY-MM-DD- followed by lowercase letters, numbers, and hyphens",
  ),
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
 * Validates an article slug string (requires YYYY-MM-DD prefix)
 * @param slug - The slug to validate
 * @returns true if valid, false otherwise
 */
export function validateArticleSlug(slug: string): boolean {
  return ARTICLE_SLUG_PATTERN.test(slug);
}

/**
 * Extracts the date from an article slug
 * @param slug - The article slug (YYYY-MM-DD-title)
 * @returns Date object or null if invalid
 */
export function extractDateFromArticleSlug(slug: string): Date | null {
  const match = slug.match(/^(\d{4})-(\d{2})-(\d{2})-/);
  if (!match) return null;
  const [, year, month, day] = match;
  const date = new Date(Number(year), Number(month) - 1, Number(day));
  if (Number.isNaN(date.getTime())) return null;
  return date;
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

/**
 * Generates an article slug with YYYY-MM-DD prefix
 * @param text - The text to convert to a slug
 * @param date - The date to use for the prefix (defaults to today)
 * @returns A slug with YYYY-MM-DD prefix
 */
export function generateArticleSlug(text: string, date: Date = new Date()): string {
  const datePrefix = formatDateForSlug(date);
  const slug = generateSlug(text);
  if (!slug) return datePrefix;
  return `${datePrefix}-${slug}`;
}

/**
 * Formats a date as YYYY-MM-DD for use in slugs
 * @param date - The date to format
 * @returns Formatted date string
 */
export function formatDateForSlug(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
