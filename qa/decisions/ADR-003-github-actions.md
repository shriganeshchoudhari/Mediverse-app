# ADR-003: Standardizing on GitHub Actions for CI Quality Pipelines

```text
Status:        ACCEPTED
Date:          2026-08-29
Deciders:      QA Architect, DevOps Lead
```

## Context
Continuous testing must be triggered on Pull Requests, Merges, Nightly runs, and Release Candidate tags with minimal latency and native repository integration.

## Decision
Adopt **GitHub Actions** as the primary CI test orchestration engine, backed by self-hosted or GitHub-hosted Linux runners with matrix parallelization. Provide equivalent enterprise `Jenkinsfile` for air-gapped on-prem environments.

## Consequences
- Workflows defined as declarative YAML in `.github/workflows/`.
- Dependency caching (`npm`, Gradle, Playwright binaries) is mandatory to keep pipeline runtimes under 10 minutes.
