# Project Context & Overview

**Last Updated**: 2025-12-24

## Project Identity

**Name**: ut.code(); CMS (cms.utcode.net)
**Purpose**: Content management system for ut.code(); organization
**Status**: Production-ready with active development

## Tech Stack

- **Frontend**: Svelte v5 + SvelteKit with Async Remote Functions
- **Data**: Drizzle ORM + Valibot validation
- **Styling**: Tailwind CSS v4 + DaisyUI v5
- **Auth**: Better Auth with GitHub OAuth (requires `ut-code` org membership)
- **Database**: SQLite
- **Deployment**: Docker + Cloudflare (with cache purge on updates)
- **Tooling**: Bun runtime, devenv process compose

## Core Architecture

### Three-Layer Architecture (DAL Pattern)
```
Component → *.remote.ts (DAL) → *.server.ts (DB)
```

1. **Components** (Svelte 5): UI with async/await remote function calls
2. **DAL** (`*.remote.ts`): Auth guards via `getRequestEvent()`, exports `query`/`command`/`form`
3. **DB** (`*.server.ts`): Pure database queries, no auth logic

**Verification (2025-12-24)**:
- ✅ All `*.remote.ts` files contain auth guards (`requireUtCodeMember()`)
- ✅ All `*.server.ts` files are pure DB/infrastructure (no auth)
- ✅ `ownership.ts` (renamed from `ownership.server.ts`) is business logic, not DB layer
- ✅ Exception: `src/routes/(admin)/+layout.server.ts` (SvelteKit route-level auth guard)

### Remote Functions (`$app/server`)
- `query` - read data (cached, deduped)
- `command` - mutate data
- `form` - form submissions
- `prerender` - prerendered queries
- `getRequestEvent` - access cookies/locals

## Project Conventions (from CLAUDE.md)

### Workflow
1. Read knowledge database (`docs/knowledges/`)
2. Make decisions
3. Note decisions to knowledge database
4. Main work
5. Run `bun tidy` (must return 0 warnings/errors)
6. Update knowledge database and CLAUDE.md as needed

### Commit Format
```
{scope}: {description}
```
Scopes: `flake`, `hosts/{name}`, `modules/{name}`, `packages`, `treewide`, `meta`

Example: `modules/site: add rate limiting for redirect DB lookups`

### Commands
```sh
# Development
bun dev              # Start dev server
bun run build        # Build application (.devenv/processes.log for logs)

# Database
bun drizzle-kit      # Drizzle ORM CLI

# Testing & Checks
bun check            # All checks (test + type + lint + format)
bun test-check       # Unit tests (pure logic only)
bun type-check       # TypeScript validation
bun lint-check       # Lint validation
bun format-check     # Format validation
bun fix              # Auto-fix (format + lint)
bun tidy             # Auto-check + fix (type + format + lint)
```

**Important**: `bun <script>` ≠ `bun run <script>`
- `bun test` - Bun's built-in test runner
- `bun run test` - package.json script
- Always use `bun run build` and `bun run test`

### Coding Rules
1. **Modularized**: Split files at ~100 lines when doing too many things
2. **Explicit**: No fallbacks unless necessary
   - ❌ `rm file.txt || true`
   - ✅ `rm file.txt`
   - ❌ `env.API_URL || "http://localhost:3000"`
   - ✅ `v.parse(v.string(), env.API_URL)`
3. **Concrete**: All expressions specific and verifiable
4. **Batch**: Group operations, multiple tool calls in one message
5. **Minimal**: Remove non-relevant edits before completing
6. **Security**: Never read `.env` files, use `.env.sample` or `.env.example`
7. **Type Safety**: Never use `as` or `any`, let TypeScript infer
8. **Error Handling**: Never "fire and forget", use `.catch(console.error)` for async jobs
9. **Remote Functions**: Always use explicit arrow functions with `query()` and `command()`
   - ❌ `query(listPublishedArticles)` (function reference)
   - ✅ `query(async () => listPublishedArticles())` (explicit arrow function)
   - ❌ `query(v.string(), getPublishedArticle)` (function reference)
   - ✅ `query(v.string(), async (slug) => getPublishedArticle(slug))` (explicit arrow function)
   - Reason: Function references can cause 400 Bad Request errors due to validation issues

## Knowledge Base

Current knowledge documents in `docs/knowledges/`:

1. **security.md** - Comprehensive security audit (2025-12-24)
   - Ownership-based access control model
   - All HIGH/MEDIUM security issues resolved
   - Remaining: LOW priority rate limiting and cache TTL

2. **ui-design.md** - Design system documentation
   - Inspired by Linear, Vercel, Stripe
   - Lime green (#00D372) accent, zinc palette
   - DM Sans (body) + JetBrains Mono (code)
   - Glassmorphism cards with `hover:bg-primary/5` states

3. **data-models.md** - Complete database schema
   - 5 tables: members, articles, projects, projectMembers, Better Auth tables
   - All CRUD operations implemented
   - Project categories: active, ended, hackathon, festival, personal

4. **stats-optimization.md** - Performance optimization (2025-12-18)
   - Moved from in-memory filtering to database-level aggregation
   - COUNT(*) queries instead of fetching all records
   - LIMIT clauses for recent items

5. **project-context.md** (this file) - Consolidated overview

## Recent Development Activity (Last 10 Commits)

```
d2947d0 claude agi iteration 1
9a613db modules/site: add rate limiting for redirect DB lookups
33a43e1 modules/site: add programmatic URL redirects with DB lookup
640b520 treewide: implement TODO items and improvements
ea3d258 modules/admin: fix migration page polling and scroll behavior
5754f44 treewide: apply glassmorphism effect to card components
c7d4a1f modules/site: hide admin button from public navigation
60c551a modules/site: add member search to public search
c7ae749 meta: use sops for Docker build secrets
1b34350 modules/admin: enhance migration with URL processing and cleanup tools
```

### Recent Features
- ✅ Rate limiting for redirect DB lookups
- ✅ Programmatic URL redirects
- ✅ Glassmorphism design system applied
- ✅ Member search in public interface
- ✅ Migration tools with URL processing
- ✅ Docker secrets management via sops

## Current Priorities & TODOs

### Completed
- ✅ Security audit and ownership controls
- ✅ File upload validation (MIME whitelist, size limits, WebP compression)
- ✅ LIKE wildcard escaping in search
- ✅ Article authorId validation
- ✅ Project role validation with picklist
- ✅ Stats endpoint auth protection
- ✅ All CRUD operations for members, articles, projects

### Remaining (LOW Priority)
- ⏳ Rate limiting on public endpoints (view counting, search)
- ⏳ Reduce auth cache TTL from 24h to 4h or add invalidation

### Future Considerations
- Project category filtering UI
- Enhanced search features
- Performance monitoring

## Security Model

### Access Control
| Role                     | Read Access                           | Write Access                                            |
| ------------------------ | ------------------------------------- | ------------------------------------------------------- |
| Public (unauthenticated) | Published articles, members, projects | None                                                    |
| ut.code(); members       | All resources (including drafts)      | Own resources only (ownership-based)                    |

### Ownership Rules
- **Articles**: Only author can edit/delete/publish/unpublish
- **Members**: Only the member themselves can edit/delete their profile
- **Projects**: Only project members (lead or regular) can edit/delete/manage members

### Security Strengths
- No SQL injection (Drizzle ORM with parameterized queries)
- LIKE wildcard escaping (`escapeLikePattern()`)
- XSS protection (DOMPurify sanitizes Markdown)
- Input validation (Valibot schemas on all endpoints)
- S3 key validation (regex prevents path traversal)
- CSRF protection (SvelteKit Remote Functions POST with same-origin)
- Session management (Better Auth)

## Design Principles

1. **Content-first**: Design serves readability, minimal decoration
2. **Developer identity**: Code blocks, monospace elements, terminal aesthetics
3. **High contrast**: Clear visual hierarchy between sections
4. **Restrained color**: Accent color used sparingly for emphasis
5. **Generous spacing**: py-24 sections, max-w-6xl content width
6. **Visual variety**: Alternating section backgrounds (white, zinc-50, zinc-900)

## Available Tools

### Custom Tools
- `kiri` - Git semantic search MCP
- `ck` - Grep alternative with semantic/hybrid search
  - Modes: regex, `--sem` (semantic), `--lex` (BM25), `--hybrid`
  - Options: `-i`, `-w`, `-F`, `-C/-A/-B`, `-l`, `--topk`, `--threshold`, `--scores`

### Git Workflows
- ✅ `git unstage [file]` - unstage files (safe)
- ✅ `git uncommit` - undo last commit, keep changes staged (safe)
- ✅ `gtr` skill - git worktree management for parallel features
- ❌ `git-stash` - forbidden
- ❌ `git-reset HEAD` - dangerous, use `git unstage` instead

## Development Environment

- Uses devenv's process compose for process management
- Logs available at `.devenv/processes.log`
- Main branch: `main`
- Clean working tree (as of 2025-12-24)

## Verification Requirements

Before commit:
1. Write code with proper TypeScript types (no `as` or `any`)
2. Run `bun type-check` whenever writing code
3. Run `bun tidy` before commit (must pass with 0 warnings/errors)
4. Follow commit format: `{scope}: {description}`

## When Stuck

1. Read the library's documentation
2. Search GitHub issues (library repo)
3. Read error message more carefully
4. Ask the user

**Never give up by using workarounds or hacks.**
