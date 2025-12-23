import { relations, sql } from "drizzle-orm";
import { boolean, index, integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";

// ============================================================================
// Better Auth Tables
// ============================================================================

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  utCodeMemberAt: timestamp("utcode_member_at", { mode: "date", withTimezone: true }),
  createdAt: timestamp("created_at", { mode: "date", withTimezone: true })
    .default(sql`now()`)
    .notNull(),
  updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true })
    .default(sql`now()`)
    .notNull(),
});

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at", { mode: "date", withTimezone: true }).notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at", { mode: "date", withTimezone: true })
      .default(sql`now()`)
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true })
      .default(sql`now()`)
      .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [index("session_userId_idx").on(table.userId)],
);

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at", {
      mode: "date",
      withTimezone: true,
    }),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at", {
      mode: "date",
      withTimezone: true,
    }),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at", { mode: "date", withTimezone: true })
      .default(sql`now()`)
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true })
      .default(sql`now()`)
      .notNull(),
  },
  (table) => [index("account_userId_idx").on(table.userId)],
);

export const verification = pgTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at", { mode: "date", withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { mode: "date", withTimezone: true })
      .default(sql`now()`)
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true })
      .default(sql`now()`)
      .notNull(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)],
);

// ============================================================================
// CMS Tables
// ============================================================================

export const member = pgTable(
  "member",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id")
      .unique()
      .references(() => user.id, { onDelete: "set null" }),
    slug: text("slug").notNull().unique(),
    name: text("name").notNull(),
    bio: text("bio"),
    imageUrl: text("image_url"),
    pageContent: text("page_content"),
    createdAt: timestamp("created_at", { mode: "date", withTimezone: true })
      .default(sql`now()`)
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true })
      .default(sql`now()`)
      .notNull(),
  },
  (table) => [index("member_userId_idx").on(table.userId)],
);

export const article = pgTable(
  "article",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    slug: text("slug").notNull().unique(),
    title: text("title").notNull(),
    content: text("content").notNull(),
    excerpt: text("excerpt"),
    coverUrl: text("cover_url"),
    authorId: text("author_id").references(() => member.id, {
      onDelete: "set null",
    }),
    published: boolean("published").default(false).notNull(),
    publishedAt: timestamp("published_at", { mode: "date", withTimezone: true }),
    viewCount: integer("view_count").notNull().default(0),
    createdAt: timestamp("created_at", { mode: "date", withTimezone: true })
      .default(sql`now()`)
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true })
      .default(sql`now()`)
      .notNull(),
  },
  (table) => [index("article_authorId_idx").on(table.authorId)],
);

// Project categories - keys defined first for type-safe iteration
export const PROJECT_CATEGORY_KEYS = [
  "active",
  "ended",
  "hackathon",
  "festival",
  "personal",
] as const;

export type ProjectCategory = (typeof PROJECT_CATEGORY_KEYS)[number];

export const PROJECT_CATEGORIES: Record<ProjectCategory, string> = {
  active: "稼働中プロジェクト",
  ended: "終了済みプロジェクト",
  hackathon: "ハッカソン",
  festival: "学園祭",
  personal: "個人プロジェクト",
};

// Project roles - keys defined first for type-safe iteration
export const PROJECT_ROLE_KEYS = ["lead", "member"] as const;

export type ProjectRole = (typeof PROJECT_ROLE_KEYS)[number];

export const PROJECT_ROLES: Record<ProjectRole, string> = {
  lead: "リード",
  member: "メンバー",
};

export const project = pgTable("project", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  description: text("description"),
  content: text("content"),
  coverUrl: text("cover_url"),
  repoUrl: text("repo_url"),
  demoUrl: text("demo_url"),
  category: text("category").$type<ProjectCategory>().notNull().default("active"),
  createdAt: timestamp("created_at", { mode: "date", withTimezone: true })
    .default(sql`now()`)
    .notNull(),
  updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true })
    .default(sql`now()`)
    .notNull(),
});

export const projectMember = pgTable(
  "project_member",
  {
    projectId: text("project_id")
      .notNull()
      .references(() => project.id, { onDelete: "cascade" }),
    memberId: text("member_id")
      .notNull()
      .references(() => member.id, { onDelete: "cascade" }),
    role: text("role").notNull().default("member"), // "lead" | "member"
  },
  (table) => [index("projectMember_pk").on(table.projectId, table.memberId)],
);

// ============================================================================
// Relations
// ============================================================================

export const userRelations = relations(user, ({ one, many }) => ({
  member: one(member, { fields: [user.id], references: [member.userId] }),
  sessions: many(session),
  accounts: many(account),
}));

export const memberRelations = relations(member, ({ one, many }) => ({
  user: one(user, { fields: [member.userId], references: [user.id] }),
  articles: many(article),
  projectMembers: many(projectMember),
}));

export const articleRelations = relations(article, ({ one }) => ({
  author: one(member, { fields: [article.authorId], references: [member.id] }),
}));

export const projectRelations = relations(project, ({ many }) => ({
  projectMembers: many(projectMember),
}));

export const projectMemberRelations = relations(projectMember, ({ one }) => ({
  project: one(project, {
    fields: [projectMember.projectId],
    references: [project.id],
  }),
  member: one(member, {
    fields: [projectMember.memberId],
    references: [member.id],
  }),
}));
