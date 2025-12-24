import { escapeLikePattern } from "$lib/shared/logic/sql-escape";

export function createSearchPattern(query: string): string | null {
  const trimmed = query.trim();
  if (!trimmed) return null;
  return `%${escapeLikePattern(trimmed)}%`;
}
