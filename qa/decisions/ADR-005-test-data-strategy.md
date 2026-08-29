# ADR-005: Synthetic Test Data Generation and Dynamic Fixture Factory

```text
Status:        ACCEPTED
Date:          2026-08-29
Deciders:      QA Architect, Data Protection Officer (DPO), Tech Lead
```

## Context
Mediverse processes Protected Health Information (PHI) subject to HIPAA and GDPR. Real patient data cannot be copied into lower environments (DEV, QA, UAT) or test automation suites.

## Decision
Implement a pure **Synthetic Test Data Strategy** utilizing dynamic test data factories (Faker.js / Java Faker) and ephemeral database seed scripts.

## Rationale
- 100% compliant with HIPAA de-identification and GDPR Privacy by Design.
- Prevents inter-test data collisions during parallel test runs.
- Deterministic data fixtures ensure tests are repeatable and self-cleaning.
