# Environment Strategy

```text
Document ID:       QA-ENV-001
Title:             Enterprise Test Environment Strategy & Promotion Lifecycle
Version:           1.0.0
Status:            APPROVED
Owner:             DevSecOps & QA Architecture
```

---

## 1. Environment Architecture & Progression Matrix

```text
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│     DEV      │ ──> │      QA      │ ──> │     UAT      │ ──> │   STAGING    │ ──> │  PRODUCTION  │
└──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘
```

| Environment | Primary Purpose | Deployment Frequency | Test Data Strategy | Allowed Test Types | Access Control |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **DEV** | Developer unit & component testing | Continuous on PR commit | Ephemeral / Mocked | Unit, Component, Local API | Developers, QA |
| **QA** | Functional & API automation regression | Automated on merge to main | Synthetic seed data | API Regression, UI E2E, Smoke | QA, Developers |
| **UAT** | Business acceptance & exploratory testing | Weekly / Post-sprint | Sanitized synthetic datasets | UAT, Exploratory, Usability | Product Owners, QA, Stakeholders |
| **STAGING** | Production-mirror release qualification | Per Release Candidate build | Masked mirror-scale synthetic | Full Regression, Perf, Security | DevOps, QA Lead, Release Eng |
| **PRODUCTION**| Live clinical operations | Scheduled release windows | Real live patient data (Zero test PHI) | Production Smoke, Synthetic Heartbeat | Strict Role-Based Access |

---

## 2. Environment Healthcheck Verification
Before initiating any automated or manual test execution, the environment must pass the automated Healthcheck Verification Probe:
- Backend Health API: `GET /api/v1/actuator/health` returns `{"status": "UP", "db": "UP", "redis": "UP"}`.
- Frontend App: `GET /` returns HTTP `200 OK` with valid HTML payload.
