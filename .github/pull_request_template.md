## What changed

<!-- One or two sentences. Link the issue: Closes #123 -->

## Why

## Kafka contract changes

<!-- New/changed topics or event fields. Write "None" if there are none.
     Breaking changes need a new topic version (e.g. .v2), not an edit to .v1. -->

## How to validate (from a phone)

<!-- Concrete steps the reviewer can follow: which CI job proves it,
     which file to read, what output to expect. -->

## Validator checklist

- [ ] CI is green (lint, unit tests, e2e)
- [ ] The change does only what the linked issue asked
- [ ] Event contracts are backward compatible, or versioned
- [ ] No secrets, credentials or personal student data in code, tests or logs
- [ ] Tests cover the new behaviour
