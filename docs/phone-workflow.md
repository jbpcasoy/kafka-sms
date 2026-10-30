# Phone-only development workflow

You write issues and review pull requests. Claude Code (the Claude app or claude.ai/code)
writes the code. Vercel builds a live preview of every PR so you can click through the
real app on your phone. Nothing reaches `main` (production) until you merge it.

```
 You (phone)            Claude Code session          GitHub + Vercel
 ───────────            ───────────────────          ───────────────
 write issue  ───────▶  branch + code + tests ─────▶ open PR
                                                      CI checks + Vercel preview link
 open preview ◀────────────────────────────────────── "Ready for review"
   ├─ comment ───────▶  fixes, pushes again ────────▶ new preview
   └─ merge ─────────────────────────────────────────▶ main → production deploy
```

## One-time setup

Use your phone's browser in **Desktop site** mode for steps 1–3; the mobile sites hide some
settings.

### 1. Supabase (database)

1. Sign up at supabase.com and create a project. Pick a region near your school and save
   the database password somewhere safe.
2. Open **SQL Editor → New query**, paste the contents of
   `supabase/migrations/20261030000000_create_students.sql` from GitHub, and tap **Run**.
3. Open **Project Settings → API Keys** (or the **Connect** button) and copy:
   - the **Project URL** (`https://xxxx.supabase.co`)
   - a **secret key** (`sb_secret_…`; on older projects this is the `service_role` key)

The secret key bypasses Row Level Security, so it must only ever go into Vercel's
environment variables. Never put it in a GitHub issue, PR or chat.

### 2. Vercel (hosting + preview links)

1. Sign up at vercel.com **with your GitHub account**.
2. **Add New → Project**, import `jbpcasoy/kafka-sms`, and keep the detected Next.js settings.
3. Before deploying, open **Environment Variables** and add both for all environments:
   - `SUPABASE_URL` = the Project URL
   - `SUPABASE_SECRET_KEY` = the secret key
4. Tap **Deploy**. Your production URL appears when it finishes.
5. Under **Settings → Deployment Protection**, make sure **Vercel Authentication** is on
   (Standard Protection). Preview links then only open for you when you're logged in to Vercel.

Vercel now comments on every PR with a preview link and adds a "Vercel" status check.

### 3. GitHub: make yourself the gate

Repo → **Settings → Rules → Rulesets → New branch ruleset**:

- Name `main protection`, Enforcement **Active**, target **Include default branch**
- **Restrict deletions**, **Block force pushes**
- **Require a pull request before merging**
  - Required approvals: **0** (Claude pushes as you, and GitHub won't let you approve
    your own PR. The **Merge** button is your approval; `CLAUDE.md` forbids agents
    from merging.)
  - **Require conversation resolution before merging**
- **Require status checks to pass**: add `lint, typecheck, test, build` and `Vercel`.
  They show up in the search box after they've run once on a PR.
- Leave the **bypass list empty** so the rules apply to you too.

Then **Settings → General → Pull Requests**: allow **squash merging** only, turn on
**Automatically delete head branches**, and leave **Allow auto-merge** off.

> If the CI check never starts (fails in seconds with no logs), GitHub Actions is blocked
> at the account level. Open the failed run on github.com to see why, and check
> **Settings → Billing and plans** and the repo's **Settings → Actions → General**.

### 4. Apps on your phone

- **GitHub** app: notifications, reading diffs, merging.
- **Claude** app: start a Claude Code session on this repo.

## Daily loop

1. **Write an issue** in the GitHub app, small enough for one PR, e.g.
   *"Add a Classes page: create a class (name, grade, teacher) and list classes."*
2. **Start a Claude Code session** on the repo and say:
   *"Implement issue #N and open a PR. Watch the PR and fix CI failures and review comments."*
3. **When the PR is ready**, open it in the GitHub app:
   - Checks: CI and Vercel both green?
   - If the PR adds a file in `supabase/migrations/`, run that SQL in the Supabase
     SQL Editor first (see "Database changes" in the PR description).
   - Tap the **Vercel preview link** and follow the "How to validate" steps.
   - Skim the **Files** tab.
4. **Decide:**
   - Not right → leave a comment. The watching session pushes a fix and you get a new preview.
   - Right → **Squash and merge**. Vercel deploys `main` to production.

## Before real student data

Previews and production share one database by default, and the app has no login yet.
Use only fake names until you've done these (each is a good issue):

1. **Login** with Supabase Auth, so only staff can open the app.
2. **Separate database for previews**: create a second Supabase project and set the
   Vercel env vars for the **Preview** environment to point at it.
3. **Automated migrations**: a GitHub Action that runs `supabase db push` on merge, so you
   don't paste SQL by hand.

## Suggested build order (one issue each)

1. Edit and delete students
2. Classes / sections, and assigning students to them
3. Teachers
4. Attendance (per class, per day)
5. Grades
6. Login with Supabase Auth, and roles (admin, teacher)
