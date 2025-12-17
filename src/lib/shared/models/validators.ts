import { createInsertSchema, createSelectSchema } from "drizzle-valibot";
import * as v from "valibot";
import {
  member,
  article,
  project,
  projectMember,
  type ProjectCategory,
  type ProjectRole,
} from "./schema";

// Category and role values as const arrays
const PROJECT_CATEGORY_VALUES = [
  "active",
  "ended",
  "hackathon",
  "festival",
  "personal",
] as const satisfies readonly ProjectCategory[];

const PROJECT_ROLE_VALUES = ["lead", "member"] as const satisfies readonly ProjectRole[];

// Category schema for proper type inference
export const categorySchema = v.picklist(PROJECT_CATEGORY_VALUES);
export const roleSchema = v.picklist(PROJECT_ROLE_VALUES);

// ============================================================================
// Insert Schemas
// ============================================================================

export const memberInsertSchema = createInsertSchema(member);
export const articleInsertSchema = createInsertSchema(article);
export const projectInsertSchema = createInsertSchema(project, {
  category: categorySchema,
});
export const projectMemberInsertSchema = createInsertSchema(projectMember);

// ============================================================================
// Select Schemas
// ============================================================================

export const memberSelectSchema = createSelectSchema(member);
export const articleSelectSchema = createSelectSchema(article);
export const projectSelectSchema = createSelectSchema(project, {
  category: categorySchema,
});
export const projectMemberSelectSchema = createSelectSchema(projectMember);

// ============================================================================
// Types
// ============================================================================

export type MemberInsert = v.InferInput<typeof memberInsertSchema>;
export type ArticleInsert = v.InferInput<typeof articleInsertSchema>;
export type ProjectInsert = v.InferInput<typeof projectInsertSchema>;
export type ProjectMemberInsert = v.InferInput<typeof projectMemberInsertSchema>;

export type MemberSelect = v.InferOutput<typeof memberSelectSchema>;
export type ArticleSelect = v.InferOutput<typeof articleSelectSchema>;
export type ProjectSelect = v.InferOutput<typeof projectSelectSchema>;
export type ProjectMemberSelect = v.InferOutput<typeof projectMemberSelectSchema>;
