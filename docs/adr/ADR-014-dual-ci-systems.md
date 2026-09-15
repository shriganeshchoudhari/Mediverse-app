# ADR-014: Dual CI Systems — GitHub Actions vs. Jenkins CI

**Date**: September 2026  
**Status**: Accepted  
**Deciders**: DevOps Team, QA Lead  

## Context

The repository contains both GitHub Actions workflows (`.github/workflows/ci.yml`, `cd.yml`, etc.) and a Jenkins pipeline definition (`Jenkinsfile`). Having two distinct automation systems without clear ownership creates ambiguity regarding which pipeline constitutes the official quality gate for code changes.

## Decision

We establish a clear division of responsibility between the two continuous integration systems:
1. **GitHub Actions (Authoritative Pull Request & CD Gate)**:
   - Primary gating pipeline for all PRs and pushes to `main` and `develop`.
   - Executes fast-feedback quality gates: Semgrep SAST, Trivy container security scans, Spring Boot build & JaCoCo verification, Next.js lint & build, and cross-browser Playwright tests.
   - Triggers production container builds and deployment rollouts to Kubernetes.
2. **Jenkins (Nightly Deep Matrix & Heavy Regression Runner)**:
   - Reserved for long-running, resource-intensive test suites: full multi-hour Newman API collections, k6 concurrency stress tests, and Allure multi-browser report generation.
   - Does not block developer PR merges, but files nightly failure notifications.

## Consequences

- **Positive**: Developers get fast PR feedback in GitHub (< 10 minutes) while QA retains comprehensive nightly regression testing capability on self-hosted infrastructure.
- **Policy**: Passing GitHub Actions CI is the sole mandatory requirement for PR merges.
