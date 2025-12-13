<workflow>
{Read knowledge}
{Main work}
{Run bun tidy}
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

# Data Access Layer

Always import from `$lib/server/data/*` instead of using bare db/drizzle logic.

```ts
// Good
import { listMembers, createMember } from "$lib/server/data/members";

// Bad - don't use db directly
import { db } from "$lib/shared/db/db.server";
```

Admin functions automatically check auth via `getRequestEvent()`.

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
