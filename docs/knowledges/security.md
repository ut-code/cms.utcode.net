# Security Model

## Assumptions

| Role                     | Read Access                           | Write Access  |
| ------------------------ | ------------------------------------- | ------------- |
| Public (unauthenticated) | Published articles, members, projects | None          |
| ut.code(); members       | All resources (including drafts)      | All resources |

**Design Decision**: All ut.code(); members are trusted equally. No per-resource ownership or admin roles.

## Authentication

- Uses Better Auth with GitHub OAuth
- Members must belong to the `ut-code` GitHub organization
- Membership is cached for 24 hours (`CACHE_TTL_MS`)
- `UNSAFE_DISABLE_AUTH=true` bypasses all auth checks (dev only)

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
- **XSS Protected**: DOMPurify sanitizes Markdown output (`isomorphic-dompurify`)
- **Input Validation**: Valibot schemas on all endpoints
- **S3 Key Validation**: Regex prevents path traversal on delete (`S3KeySchema`)
- **Session Management**: Better Auth handles session security
- **CSRF**: SvelteKit Remote Functions use POST with same-origin enforcement

## Known Issues

### ~~HIGH: stats.remote.ts exposes draft count~~ FIXED

~~`getStats` returns counts including unpublished articles without auth check.~~
Now requires `requireUtCodeMember()` auth check.

### MEDIUM: Storage upload lacks validation

- ~~No file size limit (DoS risk)~~ Client-side 10MB limit exists
- No MIME type whitelist (arbitrary file upload)
- `folder` parameter not validated (path injection)
- ✅ Client-side image compression added (max 1920px, JPEG quality 0.85)

### ~~MEDIUM: Project role not validated~~ FIXED

~~`addMember` accepts arbitrary `role` string.~~
Now uses `v.picklist(["lead", "member"])` validation.

### LOW: No rate limiting

Public endpoints can be abused:

- `incrementArticleViewCount` - view manipulation
- `searchPublic` - DoS via expensive queries

### LOW: Long membership cache

GitHub org membership cached 24h. Removed members retain access.

## Recommendations

| Priority   | Issue          | Fix                                                     | Status  |
| ---------- | -------------- | ------------------------------------------------------- | ------- |
| ~~HIGH~~   | stats endpoint | Add `requireUtCodeMember()` or filter to published only | ✅ DONE |
| MEDIUM     | File upload    | Add MIME whitelist, folder allowlist                    | Partial |
| ~~MEDIUM~~ | Project role   | Use `v.picklist(["lead", "member"])`                    | ✅ DONE |
| LOW        | Rate limiting  | Add to public endpoints                                 | TODO    |
| LOW        | Cache TTL      | Reduce to 4h or add invalidation                        | TODO    |

## Audit Date

2024-12-15 (Updated: 2025-12-15)
