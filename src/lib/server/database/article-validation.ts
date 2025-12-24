/**
 * Validates that authorId is either null or matches the given memberId
 * @param authorId - The authorId from article data
 * @param currentMemberId - The current user's member ID (or null if user has no member profile)
 * @returns true if valid, false otherwise
 */
export function validateAuthorId(
  authorId: string | null | undefined,
  currentMemberId: string | null,
): boolean {
  // authorId can be null (anonymous article)
  if (authorId === null || authorId === undefined) {
    return true;
  }

  // If authorId is set, user must have a member profile
  if (currentMemberId === null) {
    return false;
  }

  // authorId must match current user's member ID
  return authorId === currentMemberId;
}
