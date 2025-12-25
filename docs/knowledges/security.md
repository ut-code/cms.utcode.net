# Security Model

## Assumptions

| Role                     | Read Access                           | Write Access                                            |
| ------------------------ | ------------------------------------- | ------------------------------------------------------- |
| Public (unauthenticated) | Published articles, members, projects | None                                                    |
| ut.code(); members       | All resources (including drafts)      | Own resources only (see Ownership Model below)          |

**Design Decision**: Ownership-based access control. Users can only modify resources they own or are members of.

## Authentication

- Uses Better Auth with GitHub OAuth
- Members must belong to the `ut-code` GitHub organization
- Membership is cached for 24 hours (`CACHE_TTL_MS`)
- `UNSAFE_DISABLE_AUTH=true` bypasses all auth checks (dev only, throws error in production)
  - Mock user ID: `"mock"`, mock member ID: `"mock-member"`
  - Mock data returned from `getMemberByUserId`, `getUserPreference`, `setDefaultAuthor`

## Ownership Model

Resource-level access control is enforced via `ownership.ts`:

### Articles
- **Edit/Delete/Publish/Unpublish**: Only the article author can modify their own articles
- Enforced by: `requireArticleOwnership(session, articleId)`
- Creates: Any authenticated ut.code member can create articles (with their own member ID as author)

### Members
- **Edit/Delete**: Only the member themselves can modify their own profile
- Enforced by: `requireMemberOwnership(session, memberId)`
- Creates: Any authenticated ut.code member can create member profiles

### Projects
- **Edit/Delete**: Only project members (lead or regular members) can modify the project
- **Add/Remove Members**: Only existing project members can add or remove other members
- **Transfer Lead**: Only the current project lead can transfer leadership
- Enforced by: `requireProjectOwnership(session, projectId)`
- Creates: Any authenticated ut.code member can create projects (they become the lead)

## Endpoint Classification

### Public (no auth required)

- `public/index.remote.ts` - Published content only
  - `getPublicArticles` - published articles list
  - `getPublicArticle` - single published article
  - `getPublicRelatedArticles` - related published articles
  - `getPublicProjects` - all projects
  - `getPublicProject` - single project
  - `getPublicMembers` - all members
  - `getPublicMember` - single member
  - `searchPublic` - search published content
  - `incrementArticleViewCount` - view counter (write)

### Admin (requireUtCodeMember)

- `public/stats.remote.ts` - Dashboard stats (FIXED: now requires auth)
- `private/articles.remote.ts` - All articles CRUD
- `private/members.remote.ts` - All members CRUD
- `private/projects.remote.ts` - All projects CRUD
- `private/storage.remote.ts` - File upload/delete
- `private/auth.remote.ts` - Session check

## Security Strengths

- **No SQL Injection**: Drizzle ORM with fully parameterized queries
- **LIKE Wildcard Escaping**: `escapeLikePattern()` prevents wildcard injection in search queries
- **XSS Protected**: DOMPurify sanitizes Markdown output (`isomorphic-dompurify`)
- **Input Validation**: Valibot schemas on all endpoints
- **S3 Key Validation**: Regex prevents path traversal on delete (`S3KeySchema`)
- **Session Management**: Better Auth handles session security
- **CSRF**: SvelteKit Remote Functions use POST with same-origin enforcement
- **AuthorId Validation**: Article `authorId` must be null or match authenticated user's member ID

## Known Issues

### ~~HIGH: stats.remote.ts exposes draft count~~ FIXED

~~`getStats` returns counts including unpublished articles without auth check.~~
Now requires `requireUtCodeMember()` auth check.

### ~~MEDIUM: Storage upload lacks validation~~ FIXED

- ~~No file size limit (DoS risk)~~ Server-side 10MB limit + client-side validation
- ~~No MIME type whitelist (arbitrary file upload)~~ MIME whitelist added (jpeg, png, webp, avif, heic, gif, tiff, svg, bmp)
- ~~`folder` parameter not validated (path injection)~~ Folder allowlist added
- ✅ Server-side WebP compression via sharp (preserves SVG and animated GIF)

### ~~MEDIUM: Project role not validated~~ FIXED

~~`addMember` accepts arbitrary `role` string.~~
Now uses `v.picklist(["lead", "member"])` validation.

### ~~MEDIUM: SQL wildcard injection in LIKE queries~~ FIXED

~~User input with `%`, `_`, or `\` characters not escaped in LIKE patterns.~~
Now uses `escapeLikePattern()` utility in all search functions and redirect lookups.

### ~~MEDIUM: Article authorId not validated~~ FIXED

~~Users could set `authorId` to any member ID when creating/editing articles.~~
Now validates that `authorId` is either null or matches authenticated user's member ID via `validateAuthorId()` helper.

### ~~HIGH: No ownership verification on edits~~ FIXED

~~Any authenticated member could edit/delete any article, member profile, or project.~~
Now enforces ownership checks:
- Articles: Only author can edit/delete/publish/unpublish
- Members: Only the member themselves can edit/delete their profile
- Projects: Only project members can edit/delete/manage members
Implementation: `ownership.ts` with `requireArticleOwnership()`, `requireMemberOwnership()`, `requireProjectOwnership()`

### LOW: No rate limiting

Public endpoints can be abused:

- `incrementArticleViewCount` - view manipulation
- `searchPublic` - DoS via expensive queries

### LOW: Long membership cache

GitHub org membership cached 24h. Removed members retain access.

## Recommendations

| Priority   | Issue              | Fix                                                     | Status  |
| ---------- | ------------------ | ------------------------------------------------------- | ------- |
| ~~HIGH~~   | stats endpoint     | Add `requireUtCodeMember()` or filter to published only | ✅ DONE |
| ~~HIGH~~   | ownership controls | Add ownership verification for edit/delete operations   | ✅ DONE |
| ~~MEDIUM~~ | File upload        | Add MIME whitelist, folder allowlist, WebP compression  | ✅ DONE |
| ~~MEDIUM~~ | Project role       | Use `v.picklist(["lead", "member"])`                    | ✅ DONE |
| ~~MEDIUM~~ | Article authId     | Validate authorId matches user's member ID              | ✅ DONE |
| LOW        | Rate limiting      | Add to public endpoints                                 | TODO    |
| LOW        | Cache TTL          | Reduce to 4h or add invalidation                        | TODO    |

## Audit Date

2024-12-15 (Updated: 2025-12-24 - Added ownership verification model)
