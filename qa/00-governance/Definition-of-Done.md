# Definition of Done (DoD)

```text
Document ID:       QA-DOD-001
Title:             Enterprise Definition of Done
Version:           1.0.0
Status:            APPROVED
Owner:             Enterprise QA Architecture
```

---

A user story, defect fix, or feature is considered **DONE** and eligible for release candidate packaging only when all of the following verifiable criteria are fulfilled:

```text
               ┌──────────────────────────────────────────────────┐
               │              DEFINITION OF DONE                  │
               ├──────────────────────────────────────────────────┤
               │ 1. Code & Unit Testing                           │
               │    - Unit tests written & passing (>=80% cov)    │
               │    - Static analysis / SonarQube quality gate    │
               │    - Peer code review approved by >=2 engineers  │
               ├──────────────────────────────────────────────────┤
               │ 2. Automated Test Coverage                       │
               │    - API integration test added (Postman/Newman) │
               │    - UI regression/smoke test added (Playwright) │
               │    - Tests pass in CI pipeline on PR & Merge     │
               ├──────────────────────────────────────────────────┤
               │ 3. Quality & Security Validation                 │
               │    - Zero open S1/S2 defects; zero high CVEs     │
               │    - WCAG 2.1 AA automated axe scan passed       │
               │    - Performance baseline benchmarked (p95)      │
               ├──────────────────────────────────────────────────┤
               │ 4. Governance & Documentation                    │
               │    - Traceability Matrix (RTM) updated           │
               │    - API contract / OpenAPI spec updated         │
               │    - PO / QA Sign-off recorded                   │
               └──────────────────────────────────────────────────┘
```

### Verification Checklist
- [ ] **Unit Tests:** Line coverage >=80%, Branch coverage >=85% on critical paths.
- [ ] **Code Review:** Approved by at least one Senior Engineer and one QA/SDET Engineer.
- [ ] **API Automation:** All newly exposed endpoints covered in Postman/Newman collections with schema validation.
- [ ] **UI Automation:** All primary and alternate UI flows covered in Playwright suite using Page Objects.
- [ ] **Security:** Dependency scan (npm audit, Snyk) clean; SAST clean; zero hardcoded credentials.
- [ ] **Accessibility:** Automated axe-core scan passed on Chromium with zero critical/serious violations.
- [ ] **Documentation:** API swagger docs updated; Release notes and RTM mapped.
