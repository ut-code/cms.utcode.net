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

- Svelte v5 + Remote Functions + Async
- Tailwind CSS v4
- DaisyUI v5

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
