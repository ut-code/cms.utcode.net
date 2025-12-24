/**
 * Frontmatter validation schemas for migration
 */
import * as v from "valibot";

export const MemberFrontmatterSchema = v.object({
  nameJa: v.string(),
  description: v.optional(v.string()),
  image: v.optional(v.string()),
  // Legacy fields for backward compatibility during migration
  faceImage: v.optional(v.string()),
  upperBodyImage: v.optional(v.string()),
  github: v.optional(v.string()),
  twitter: v.optional(v.string()),
  website: v.optional(v.string()),
});

export const ArticleFrontmatterSchema = v.object({
  title: v.string(),
  date: v.string(),
  thumbnail: v.optional(v.object({ src: v.string() })),
  author: v.optional(v.string()),
});

export const ProjectFrontmatterSchema = v.object({
  app: v.optional(
    v.object({
      name: v.string(),
      description: v.optional(v.string()),
      url: v.optional(v.string()),
    }),
  ),
  kind: v.optional(v.string()),
  thumbnail: v.optional(v.object({ src: v.optional(v.string()) })),
  social: v.optional(v.object({ github: v.optional(v.string()) })),
  members: v.optional(v.array(v.string())),
});
