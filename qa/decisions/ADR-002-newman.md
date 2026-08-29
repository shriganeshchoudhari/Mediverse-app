# ADR-002: Adoption of Postman & Newman for API Automation

```text
Status:        ACCEPTED
Date:          2026-08-29
Deciders:      QA Architect, Backend Lead, DevOps Engineer
```

## Context
The Mediverse backend exposes extensive RESTful APIs for clinical workflows, telemedicine, appointments, authentication, and EHR integrations. We require an API test suite executable in both GUI exploratory modes and automated CI/CD pipelines.

## Decision
Adopt **Postman Collections** for authoring and **Newman CLI** (Dockerized) for headless execution in GitHub Actions and Jenkins pipelines.

## Rationale
- Low barrier to entry for developers and QA analysts.
- Seamless JSON schema validation using `tv4` and `ajv`.
- Newman CLI provides lightweight, zero-overhead execution with Allure and JUnit reporters.

## Consequences
- Collections must be checked into Git repository under version control.
- Clear environment variable isolation required to avoid leaking staging/prod secrets.
