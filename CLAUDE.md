# Working rules for AI agents in this repo

The repo owner (@jbpcasoy) is the human validator. Agents propose; the human merges.

## Workflow

1. Work from a GitHub issue. One issue = one branch = one pull request.
2. Never push to `main`. Never merge a pull request, approve one, or enable auto-merge.
3. Keep PRs small (aim for < 400 changed lines) so they can be reviewed on a phone.
4. Fill in every section of `.github/pull_request_template.md`, especially
   "How to validate (from a phone)".
5. Run the checks below before pushing. Never skip, delete or weaken a test to get CI green.

## Checks

```bash
cd services/<service>
uv sync && uv run ruff check . && uv run ruff format --check . && uv run pytest -q
```

End-to-end (needs Docker): `docker compose up --build -d --wait && uv run --with pytest --with confluent-kafka pytest -q tests/e2e`

## Architecture

- One service per bounded context under `services/<name>/` (Python 3.12, FastAPI, confluent-kafka, uv).
  Planned contexts: student, enrollment, attendance, grading, notification.
- Services talk to each other only via Kafka events, never by calling each other's HTTP APIs
  or sharing a database.
- Topic names: `sms.<entity>.<past-tense-verb>.v<N>`, e.g. `sms.student.enrolled.v1`.
  A breaking payload change means a new `.vN+1` topic, not an edit.
- Every event uses the `EventEnvelope` shape (`event_id`, `event_type`, `occurred_at`, `payload`).
  Key messages by the aggregate id (e.g. `student_id`) so per-entity ordering holds.
- Consumers must be idempotent: dedupe on `event_id`.
- Each new service gets: a Dockerfile, an entry in `docker-compose.yml`, a CI job in
  `.github/workflows/ci.yml`, and a Dependabot entry.

## Data

Student records are personal data about minors. Use obviously fake names in tests and fixtures,
and never log full payloads containing personal fields.
