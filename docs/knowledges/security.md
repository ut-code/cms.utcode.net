# Security Model

## Trust Model

**Core Principle**: All ut.code(); members are mutually trusted.

This is an internal CMS for the ut.code(); organization. All authenticated members belong to the same organization and collaborate on shared content. Therefore:

- **No ownership checks required**: Any ut.code(); member can edit any article, member profile, or project
- **Authorization is binary**: `requireUtCodeMember()` is the only auth check needed
- **Mutual trust assumption**: Members are expected to coordinate and communicate, not compete

This model prioritizes collaboration and simplicity over granular access control.

## Assumptions

| Role                     | Read Access                           | Write Access                     |
| ------------------------ | ------------------------------------- | -------------------------------- |
| Public (unauthenticated) | Published articles, members, projects | None                             |
| ut.code(); members       | All resources (including drafts)      | All resources (full admin access)|

## Authentication

- Uses Better Auth with GitHub OAuth
- Members must belong to the `ut-code` GitHub organization
- Membership is cached for 24 hours (`CACHE_TTL_MS`)
- `UNSAFE_DISABLE_AUTH=true` bypasses all auth checks (dev only, throws error in production)
  - Mock user ID: `"mock"`, mock member ID: `"mock-member"`
  - Mock data returned from `getMemberByUserId`, `getUserPreference`, `setDefaultAuthor`

## Authorization Model

All authenticated ut.code(); members have full admin access. Authorization is enforced via:

- `requireUtCodeMember()` - Single auth check for all private endpoints
- Returns session with `user.id` and `member.id`
- No resource-level ownership checks needed

### Resource Access

All authenticated members can:
- **Articles**: Create, edit, delete, publish/unpublish any article
- **Members**: Create, edit, delete any member profile
- **Projects**: Create, edit, delete, manage members of any project

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

### INFO: No resource-level access control (by design)

This is **not a security issue** - it's the intended trust model.

All authenticated ut.code(); members can edit/delete any resource (articles, members, projects). This is intentional because:
- All members belong to the same organization
- Collaboration and flexibility are prioritized over access restrictions
- Members are expected to coordinate via communication, not technical barriers

**Implementation**: No `ownership.ts` module needed - `requireUtCodeMember()` is the only authorization check.

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
| ~~MEDIUM~~ | File upload        | Add MIME whitelist, folder allowlist, WebP compression  | ✅ DONE |
| ~~MEDIUM~~ | Project role       | Use `v.picklist(["lead", "member"])`                    | ✅ DONE |
| LOW        | Rate limiting      | Add to public endpoints                                 | TODO    |
| LOW        | Cache TTL          | Reduce to 4h or add invalidation                        | TODO    |

## Audit Date

2024-12-15 (Updated: 2025-12-26 - Updated to trust-based security model)
