<workflow>
{Read knowledge database}
{Make desicions}
{Note decisions to knowledge database}
{Main work}
{Run bun tidy}
{Update knowledge database as needed}
</workflow>

# Knowledge Database

ALWAYS read relevant knowledges before you start working.

```sh
ls ./docs/knowledges
```

# Available Tools

- core: Svelte v5 + Remote Functions + Async
- data: Drizzle + Valibot
- visuals design: Tailwind CSS v4, DaisyUI v5

# TypeScript

Never use `as` or `any`. Let TypeScript infer types properly.

# Remote Functions

`$app/server` exports:

- `query` - read data (cached, deduped)
- `command` - mutate data
- `form` - form submissions
- `prerender` - prerendered queries
- `getRequestEvent` - access cookies/locals

# Data Access Layer

```
Component → *.remote.ts (DAL) → *.server.ts (DB)
```

- **DAL** (`*.remote.ts`): Auth guard via `getRequestEvent()`, exports `query`/`command`/`form`
- **DB** (`*.server.ts`): Pure DB queries, no auth

```ts
// $lib/data/members.remote.ts (auth happens here)
// public endpoint
export const getMembers = query(async () => listMembers());

// private endpoint (admin)
export const deleteMember = command(v.string(), async (id) => {
  await requireAuth();
  return removeMember(id);
});
```

```sh
# server control
bun dev # boots up the dev server.
bun run build # builds the application

# database control
bun drizzle-kit # drizzle-kit is installed.

# static checks
bun check # runs all checks, including these three:
bun type-check # runs type check
bun lint-check # runs lint check
bun format-check # runs format check
bun fix # runs all automated fixes (format+lint)
bun tidy # runs all automated checks and fixes as necessary (type+format+lint)
```
