import { error } from "@sveltejs/kit";
import { getArticleById } from "./articles.server";
import type { Session } from "./auth.server";
import { getMemberByUserId } from "./members.server";
import { getProjectById } from "./projects.server";

/**
 * Get the member ID associated with the current session's user.
 * Throws 403 if user has no associated member profile.
 */
export async function requireMemberId(session: Session): Promise<string> {
  const member = await getMemberByUserId(session.user.id);
  if (!member) {
    throw error(403, "User has no associated member profile");
  }
  return member.id;
}

/**
 * Verify that the current user can edit an article.
 * Only the article author can edit.
 */
export async function requireArticleOwnership(session: Session, articleId: string): Promise<void> {
  const article = await getArticleById(articleId);
  if (!article) {
    throw error(404, "Article not found");
  }

  const memberId = await requireMemberId(session);

  if (article.authorId !== memberId) {
    throw error(403, "Only the article author can edit this article");
  }
}

/**
 * Verify that the current user can edit a member profile.
 * Only the member themselves can edit their profile.
 */
export async function requireMemberOwnership(
  session: Session,
  targetMemberId: string,
): Promise<void> {
  const currentMember = await getMemberByUserId(session.user.id);
  if (!currentMember) {
    throw error(403, "User has no associated member profile");
  }

  if (currentMember.id !== targetMemberId) {
    throw error(403, "You can only edit your own member profile");
  }
}

/**
 * Verify that the current user can edit a project.
 * Project lead or any project member can edit.
 */
export async function requireProjectOwnership(session: Session, projectId: string): Promise<void> {
  const project = await getProjectById(projectId);
  if (!project) {
    throw error(404, "Project not found");
  }

  const memberId = await requireMemberId(session);

  const isProjectMember = project.projectMembers.some((pm) => pm.memberId === memberId);

  if (!isProjectMember) {
    throw error(403, "Only project members can edit this project");
  }
}
