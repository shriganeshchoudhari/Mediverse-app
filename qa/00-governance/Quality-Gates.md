# Quality Gates Policy & Thresholds

```text
Document ID:       QA-QG-001
Title:             Continuous Delivery Quality Gate Policy
Version:           1.0.0
Status:            APPROVED
Owner:             Enterprise QA Architecture & DevSecOps
```

---

## 1. Quality Gate Architecture & Trigger Stages

Quality gates are automated validation hurdles embedded at critical pipeline transitions:

```text
[PR Opened] ──> GATE 1: Pull Request Gate (Static Analysis, Unit Tests, API Smoke)
      │
[Branch Merge] ──> GATE 2: Merge / Build Gate (Full Unit, API Regression, UI Smoke)
      │
[QA Deployment] ──> GATE 3: Integration & Component Gate (Full API Regression, UI Regression)
      │
[Staging Deploy] ──> GATE 4: Release Candidate Gate (Full E2E, Security, Performance, Allure)
      │
[Prod Deploy] ──> GATE 5: Production Gate (Production Smoke, Synthetic Heartbeat)
```

---

## 2. Quality Gate Threshold Matrix

| Gate Stage | Evaluated Metric | Hard Threshold (Blocking) | Soft Threshold (Warning) |
| :--- | :--- | :--- | :--- |
| **Gate 1: Pull Request** | Unit Test Line Coverage | >= 80% | 75% - 79% |
| | Unit Test Pass Rate | 100% | N/A |
| | Static Analysis (ESLint/Sonar) | 0 Blocker, 0 Critical | Tech Debt < 5% |
| | API Smoke Test Pass Rate | 100% | N/A |
| **Gate 2: Merge / Build** | Full Unit Test Pass Rate | 100% | N/A |
| | API Regression Pass Rate | >= 98% (0 critical) | 95% - 97% |
| | UI Smoke Test Pass Rate | 100% | N/A |
| **Gate 3: QA Env** | Full API Regression Pass | 100% | N/A |
| | Full UI Functional Pass | >= 95% (0 S1/S2 defects)| 90% - 94% |
| | Axe-Core Accessibility | 0 Critical Violations | 0 Serious Violations |
| **Gate 4: Staging (RC)** | E2E Regression Pass Rate | 100% | N/A |
| | Open Defect Count | 0 S1, 0 S2 | <= 3 S3 |
| | Performance SLA (p95) | <= 400 ms API / <= 2.5s LCP | Baseline +10% |
| | Security Vulnerability Scan | 0 High, 0 Critical CVEs | 0 Medium CVEs |
| **Gate 5: Production** | Production Smoke Pass Rate | 100% (Non-destructive) | N/A |
| | Synthetic Monitor Health | 100% over 15 mins post-deploy | Error rate < 0.01% |
