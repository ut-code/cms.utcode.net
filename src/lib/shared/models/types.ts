import type { ProjectCategory } from "./schema";

// ============================================================================
// Form Data Types
// ============================================================================

export type ArticleData = {
  slug: string;
  title: string;
  content: string;
  coverUrl: string;
  authorId: string | null;
  published: boolean;
};

export type ProjectData = {
  slug: string;
  name: string;
  description: string;
  content: string;
  coverUrl: string;
  repoUrl: string;
  demoUrl: string;
  category: ProjectCategory;
  leadMemberId: string | null;
};

export type MemberData = {
  slug: string;
  name: string;
  bio: string;
  imageUrl: string;
  pageContent: string;
};

// ============================================================================
// Supporting Types
// ============================================================================

export type Author = {
  id: string;
  slug: string;
  name: string;
  imageUrl: string | null;
};

export type Member = {
  id: string;
  name: string;
  imageUrl: string | null;
};
