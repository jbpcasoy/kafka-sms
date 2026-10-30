# kafka-sms

An event-driven school management system built on Apache Kafka, developed by AI agents
and validated by a human on every pull request.

```
           ┌──────────────────┐   sms.student.enrolled.v1   ┌──────────────────────┐
 HTTP ───▶ │ student-service  │ ──────────────────────────▶ │ (future) enrollment, │
           └──────────────────┘          Kafka              │ attendance, grading, │
                                                            │ notification …       │
                                                            └──────────────────────┘
```

## Layout

| Path | What |
| --- | --- |
| `services/student-service/` | First service: `POST /students` publishes `sms.student.enrolled.v1` |
| `docker-compose.yml` | Kafka (KRaft, no ZooKeeper), the services, optional Kafka UI |
| `tests/e2e/` | HTTP-in, Kafka-event-out tests against the compose stack |
| `.github/workflows/ci.yml` | Lint, unit tests, then e2e on every PR |
| `.github/CODEOWNERS`, `pull_request_template.md` | Make the human validator a required reviewer |
| `CLAUDE.md` | Rules every AI agent follows in this repo |
| `docs/phone-workflow.md` | How to run the whole loop from a phone |

## Run locally

```bash
docker compose up --build -d --wait
curl -X POST localhost:8001/students -H 'Content-Type: application/json' \
  -d '{"first_name":"Ada","last_name":"Lovelace","grade_level":7}'
docker compose --profile tools up -d kafka-ui   # browse topics at http://localhost:8080
```

See [docs/phone-workflow.md](docs/phone-workflow.md) for the one-time GitHub setup and the
daily loop.
