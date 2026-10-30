# Working rules for AI agents in this repo

@AGENTS.md

The repo owner (@jbpcasoy) is the human validator. Agents propose; the human merges.

## Workflow

1. Work from a GitHub issue. One issue = one branch = one pull request.
2. Never push to `main`. Never merge a pull request, approve one, or enable auto-merge.
3. Keep PRs small (aim for < 400 changed lines) so they can be reviewed on a phone.
4. Fill in every section of `.github/pull_request_template.md`, especially
   "How to validate (from a phone)", written as steps on the Vercel preview link.
5. Run the checks below before pushing. Never skip, delete or weaken a test to get CI green.

## Checks

```bash
npm ci && npm run lint && npm run typecheck && npm test && npm run build
```

## Stack

- Next.js 16 (App Router, `src/`, TypeScript, Tailwind), deployed on Vercel.
  Next.js 16 differs from older versions: read `node_modules/next/dist/docs/` before using
  an API you're unsure of. `cacheComponents` is on, so request-time data goes inside
  `<Suspense>` after `await connection()`.
- Supabase Postgres. Access the database only from server code via `getSupabase()` in
  `src/lib/supabase.ts` (secret key). Never expose the secret key or add `NEXT_PUBLIC_` to it.
- Every table has Row Level Security enabled. Don't add public policies without the owner asking.
- Schema changes: add a new timestamped file in `supabase/migrations/`. Never edit a merged one.
  Mention it in the PR so the owner runs it before merging.
- Mutations are Server Actions with `useActionState` forms; validate input in a pure function
  under `src/lib/` and unit-test it with Vitest (`*.test.ts` next to the code).
- UI must work at phone width first.

## Data

Student records are personal data about minors. Use obviously fake names in tests and fixtures,
and never log full records.
