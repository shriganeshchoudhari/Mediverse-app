# ADR-004: Unified Test Reporting via Allure Framework

```text
Status:        ACCEPTED
Date:          2026-08-29
Deciders:      QA Architect, SDET Lead
```

## Context
With tests executing across multiple runners (Jest, JUnit 5, Postman/Newman, Playwright), stakeholders need a single, consolidated, visual dashboard showing test history, defects, traces, videos, and flakiness trends.

## Decision
Adopt **Allure Report** as the standard test reporting framework across all test levels.

## Rationale
- Integrates out-of-the-box with Playwright (`allure-playwright`) and Newman (`newman-reporter-allure`).
- Provides deep metadata: Epics, Features, Stories, Severity, Execution Timelines, and Screenshot/Trace attachments.
- Open-source, generates static HTML deployable to GitHub Pages or S3/GCS.
