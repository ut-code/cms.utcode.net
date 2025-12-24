import type { member, projectMember } from "$lib/shared/models/schema";

export type ProjectMember = typeof projectMember.$inferSelect;
export type Member = typeof member.$inferSelect;

export type ProjectMemberWithMember = ProjectMember & {
  member: Member;
};
