# Phone-only development workflow

You write issues and review pull requests. Claude Code (claude.ai/code or the Claude app)
writes the code. GitHub Actions runs the tests. Nothing reaches `main` until you approve it.

```
 You (phone)            Claude Code session            GitHub
 ───────────            ───────────────────            ──────
 write issue  ───────▶  branch + code + tests  ──────▶ open PR
                                                        CI: lint, unit, e2e
 review PR    ◀──────────────────────────────────────── PR waiting on you
   ├─ request changes ─▶ fixes, pushes again ──────────▶ CI re-runs
   └─ approve + merge ───────────────────────────────▶ main
```

## One-time setup (all of it can be done in a mobile browser)

### 1. Protect `main` (this is the step that makes you the gate)

On github.com, open the repo → **Settings → Rules → Rulesets → New ruleset → New branch ruleset**.
Settings may sit behind the "…" menu or need "Desktop site" mode in a mobile browser.

- Name: `main protection`; Enforcement status: **Active**
- Target branches: **Include default branch**
- Turn on:
  - **Restrict deletions**
  - **Block force pushes**
  - **Require a pull request before merging**
    - Required approvals: **1**
    - **Require review from Code Owners**
    - **Dismiss stale pull request approvals when new commits are pushed**
    - **Require approval of the most recent reviewable push**
    - **Require conversation resolution before merging**
  - **Require status checks to pass**, add:
    - `student-service (lint + unit tests)`
    - `e2e (docker compose + Kafka)`
    - (The checks show up in the search box after CI has run once on a PR.)
- Bypass list: leave **empty**, so the rules apply to you too.

"Require approval of the most recent reviewable push" means whoever pushed last cannot be the
approver. Because Claude pushes under your GitHub account, you can't approve your own PR.
Pick one of these:

- **Simplest:** set Required approvals to **0** but keep "Require a pull request" and the
  status checks. The gate is then the **Merge** button: only you press it, and the
  session's rules (`CLAUDE.md`) forbid agents from merging.
- **Stricter:** keep 1 approval and have the agent work under a separate bot GitHub account
  (or GitHub App) with write access, so you approve as a different user.

### 2. Repo settings

**Settings → General → Pull Requests**: allow **squash merging** only and turn on
**Automatically delete head branches**. Leave **Allow auto-merge** off.

**Settings → Actions → General**: turn on "Require approval for all outside collaborators"
so fork PRs can't run CI against your secrets.

### 3. Phone apps

- **GitHub mobile app**: notifications, reading diffs, approving and merging.
- **Claude app** (or claude.ai/code in a browser): start a cloud session on `jbpcasoy/kafka-sms`.

## Daily loop

1. **Write an issue** in the GitHub app, small enough for one PR, e.g.
   *"Add attendance-service that consumes `sms.student.enrolled.v1` and exposes
   `POST /attendance` publishing `sms.attendance.recorded.v1`."*
2. **Start a Claude Code session** on the repo and say:
   *"Implement issue #N and open a PR. Watch the PR and fix CI failures and review comments."*
3. **Wait for the GitHub notification**, then review on your phone:
   - Checks tab: both jobs green?
   - Read the PR description's "How to validate" section and the validator checklist.
   - Files tab: skim the diff. Look hard at anything touching event contracts,
     `docker-compose.yml`, CI workflows, or `CLAUDE.md`.
4. **Decide:**
   - Not right → leave review comments or **Request changes**. The watching session picks
     them up and pushes fixes, and CI re-runs.
   - Right → **Squash and merge**.

## Suggested build order (one issue each)

1. `enrollment-service`: classes/sections, consumes `student.enrolled`
2. `attendance-service`: daily attendance events
3. `grading-service`: assessments and grades
4. `notification-service`: consumes everything, sends parent notifications (start with logs)
5. Schema Registry + Avro/Protobuf contracts, with a CI check for compatibility
6. Postgres per service (outbox pattern for publishing events)
7. Auth (Keycloak or similar) and an API gateway
8. Deployment: container images to GHCR, then a staging environment with a
   **required reviewer** (Settings → Environments) so deploys also wait for you
