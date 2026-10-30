# School Management

A school management system built with Next.js and Supabase, deployed on Vercel. AI agents
write the code; a human validates every pull request on a live preview link before it merges.

## Layout

| Path | What |
| --- | --- |
| `src/app/` | Pages (Next.js App Router). `/students` lists and adds students |
| `src/lib/` | Shared logic: Supabase client, validation (with Vitest tests) |
| `supabase/migrations/` | Database schema as SQL, applied in filename order |
| `.github/workflows/ci.yml` | Lint, typecheck, test, build on every PR |
| `.github/CODEOWNERS`, `pull_request_template.md` | Make the owner the reviewer of every PR |
| `CLAUDE.md` | Rules every AI agent follows in this repo |
| `docs/phone-workflow.md` | One-time setup and the daily loop, all from a phone |

## Run locally (optional, needs a computer)

```bash
cp .env.example .env.local   # fill in your Supabase URL and secret key
npm install
npm run dev                  # http://localhost:3000
```
