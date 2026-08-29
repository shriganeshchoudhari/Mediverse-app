# QA Risk Register

```text
Document ID:       QA-RISK-001
Title:             Enterprise QA Risk Register — Mediverse Platform
Version:           1.0.0
Status:            ACTIVE
Owner:             QA Architect
Reviewer:          Engineering Manager, SDET Lead, SRE
Approver:          CTO
Created Date:      2026-08-29
Last Updated:      2026-08-29
Review Frequency:  Bi-weekly (Sprint Review Gate) + Monthly full review
Change History:    v1.0.0 — Initial register established
```

---

## 1. Risk Scoring Model

**Probability:**
| Level | Code | Description |
|---|---|---|
| Very Low | 1 | < 10% chance of occurrence |
| Low | 2 | 10%–30% chance |
| Medium | 3 | 31%–50% chance |
| High | 4 | 51%–70% chance |
| Very High | 5 | > 70% chance |

**Impact:**
| Level | Code | Description |
|---|---|---|
| Negligible | 1 | No effect on release or quality |
| Minor | 2 | Minor delay or quality degradation |
| Moderate | 3 | Sprint-level impact, partial feature degradation |
| Major | 4 | Release blocked or significant defect escape |
| Critical | 5 | Production outage, data breach, PHI exposure |

**Risk Score = Probability × Impact**

| Score Range | Rating |
|---|---|
| 1–4 | 🟢 LOW |
| 5–9 | 🟡 MEDIUM |
| 10–15 | 🟠 HIGH |
| 16–25 | 🔴 CRITICAL |

---

## 2. Active Risk Register

### RISK-001 — Insufficient Test Coverage for 9 Healthcare Domains
| Field | Value |
|---|---|
| **Risk ID** | RISK-001 |
| **Category** | Coverage |
| **Description** | 9 medical specialty domains (Dental, AYUSH, Nursing, Pharmacy, etc.) each have unique clinical workflows. Low test coverage in any domain may allow domain-specific defects to escape to production. |
| **Probability** | 4 — High (9 domains × limited SDET capacity) |
| **Impact** | 4 — Major (Domain-specific regression in clinical content) |
| **Risk Score** | **16 🔴 CRITICAL** |
| **Owner** | SDET Lead |
| **Mitigation** | Maintain RTM per domain; require ≥ 1 smoke + 3 regression tests per domain before sprint close. Automate domain health checks via API. |
| **Contingency** | Manual domain smoke test execution for any domain with < 3 automated specs before release. |
| **Status** | OPEN — RTM created, automation coverage still partial |
| **Due Date** | Sprint 03 Closure |

---

### RISK-002 — PHI / Medical Data Leakage via API Response
| Field | Value |
|---|---|
| **Risk ID** | RISK-002 |
| **Category** | Security / Compliance |
| **Description** | API endpoints serving patient study records, progress data, or clinical exam results may inadvertently expose Protected Health Information (PHI) or Personally Identifiable Information (PII). |
| **Probability** | 3 — Medium |
| **Impact** | 5 — Critical (HIPAA violation, reputational damage, legal liability) |
| **Risk Score** | **15 🟠 HIGH** |
| **Owner** | Security Engineer |
| **Mitigation** | SAST scan (Semgrep) on every PR targeting `/api/`. Newman collection includes PHI field assertions on all API responses (zero-tolerance for `ssn`, `dob`, `medicalRecordNumber` in plaintext). HIPAA checklist gated in PR template. |
| **Contingency** | Immediate rollback + incident response per `QA-MON-002-Incident-Runbook.md`. Security team notified within 1 hour. |
| **Status** | OPEN — SAST active; DAST scan not yet configured |
| **Due Date** | Sprint 02 Closure |

---

### RISK-003 — AI/RAG Engine Hallucination in Clinical Content
| Field | Value |
|---|---|
| **Risk ID** | RISK-003 |
| **Category** | Functional — AI Quality |
| **Description** | Socratic AI Tutor (RAG + pgvector) may generate clinically incorrect answers for medical MCQs or OSCE station guidance, leading to incorrect clinical education. |
| **Probability** | 3 — Medium |
| **Impact** | 4 — Major (Incorrect medical knowledge propagated to students) |
| **Risk Score** | **12 🟠 HIGH** |
| **Owner** | QA Architect |
| **Mitigation** | Golden answer set per domain; automated ground-truth comparison for ≥ 50 MCQs per domain per sprint. Guardrail assertion tests verify source citation is present and valid. |
| **Contingency** | Disable AI tutor feature for affected domain via feature flag. Fallback to static MCQ bank. |
| **Status** | OPEN — Ground-truth test suite not yet implemented |
| **Due Date** | Sprint 04 Closure |

---

### RISK-004 — Test Environment Instability (PostgreSQL / Redis Drift)
| Field | Value |
|---|---|
| **Risk ID** | RISK-004 |
| **Category** | Infrastructure |
| **Description** | Docker Compose test environment uses `pgvector/pgvector:pg16` on port 5433 and Redis Alpine 7 on port 6379. Schema drift between dev and QA environments can cause false test failures. |
| **Probability** | 4 — High (Observed in prior sprints) |
| **Impact** | 3 — Moderate (Test suite instability, delayed diagnosis) |
| **Risk Score** | **12 🟠 HIGH** |
| **Owner** | SRE |
| **Mitigation** | Liquibase/Flyway migration enforced on every test environment startup. Environment Strategy document (`qa/02-planning/Environment-Strategy.md`) mandates ephemeral environments per PR. |
| **Contingency** | `Environment-Failure-Runbook.md` — rebuild from seed script within 30 minutes. |
| **Status** | OPEN — Ephemeral env not yet implemented |
| **Due Date** | Sprint 02 Closure |

---

### RISK-005 — Playwright Flaky Tests Blocking CI
| Field | Value |
|---|---|
| **Risk ID** | RISK-005 |
| **Category** | Automation Quality |
| **Description** | Playwright E2E tests on WebRTC Study Rooms and 3D simulators (React Three Fiber) are inherently timing-sensitive and may become flaky in CI, causing false negatives and developer distrust. |
| **Probability** | 4 — High |
| **Impact** | 3 — Moderate (CI pipeline delays, developer trust erosion) |
| **Risk Score** | **12 🟠 HIGH** |
| **Owner** | SDET Lead |
| **Mitigation** | Flaky Test Rate KPI monitored (target < 1%). Flaky tests quarantined within 24h per `Flaky-Test-Runbook.md`. 2 retries in CI (`retries: 2`). `@flaky` tag for quarantine. |
| **Contingency** | Remove from blocking gate; move to non-blocking informational run within 48 hours. File Flaky Test Register entry immediately. |
| **Status** | OPEN — Flaky Rate at 0% (not enough tests yet); monitor after Sprint 03 |
| **Due Date** | Ongoing |

---

### RISK-006 — JaCoCo Coverage Gate Regression (Backend)
| Field | Value |
|---|---|
| **Risk ID** | RISK-006 |
| **Category** | Coverage |
| **Description** | New backend features may ship without sufficient unit tests, causing JaCoCo coverage to drop below the 80% threshold and blocking the CI pipeline unexpectedly. |
| **Probability** | 3 — Medium |
| **Impact** | 3 — Moderate (Sprint blocked, pressure to relax threshold) |
| **Risk Score** | **9 🟡 MEDIUM** |
| **Owner** | Backend Lead |
| **Mitigation** | DoD mandates test coverage PR annotation. EM must approve any threshold change via ADR process. JaCoCo delta coverage report on every PR. |
| **Contingency** | Temporary exception via EM-approved flag, with mandatory fix in next sprint. |
| **Status** | OPEN — Threshold active at 80% |
| **Due Date** | Ongoing |

---

### RISK-007 — OSCE Exam Timer Accuracy Under Load
| Field | Value |
|---|---|
| **Risk ID** | RISK-007 |
| **Category** | Performance |
| **Description** | OSCE timed examination stations rely on accurate countdown timers. Under concurrent load (> 200 simultaneous exams), server-side timing drift may grant or deny extra time to students. |
| **Probability** | 2 — Low |
| **Impact** | 4 — Major (Assessment integrity violation) |
| **Risk Score** | **8 🟡 MEDIUM** |
| **Owner** | QA Architect |
| **Mitigation** | Load test scenario targeting 200 concurrent OSCE sessions. Timer accuracy assertion ± 2 seconds tolerance. Performance test plan documented in `qa/08-performance/`. |
| **Contingency** | Disable concurrent OSCE if server clock drift > 5 seconds. Reschedule affected sessions. |
| **Status** | OPEN — Load tests not yet implemented |
| **Due Date** | Sprint 04 Closure |

---

### RISK-008 — WCAG 2.1 AA Accessibility Non-Compliance
| Field | Value |
|---|---|
| **Risk ID** | RISK-008 |
| **Category** | Compliance |
| **Description** | UI components across 9 domain portals may not meet WCAG 2.1 AA standards (color contrast, keyboard navigation, screen reader support), creating barriers for users with disabilities and potential legal exposure. |
| **Probability** | 3 — Medium |
| **Impact** | 3 — Moderate (Regulatory/reputational risk; user exclusion) |
| **Risk Score** | **9 🟡 MEDIUM** |
| **Owner** | QA Architect |
| **Mitigation** | `axe-core` integrated in Playwright specs. WCAG checklist gated on PR template. 15th spec file (`15_accessibility_and_responsive.spec.ts`) targets full WCAG coverage. |
| **Contingency** | Component fails accessibility audit → blocked from merge until fixed or ARIA-labeled. |
| **Status** | OPEN — axe integration present; full checklist doc not yet created |
| **Due Date** | Sprint 03 Closure |

---

### RISK-009 — Credential / Secret Leakage in CI Logs
| Field | Value |
|---|---|
| **Risk ID** | RISK-009 |
| **Category** | Security |
| **Description** | Test automation scripts, CI workflow logs, or Allure reports may inadvertently print bearer tokens, database passwords, or test user credentials. |
| **Probability** | 2 — Low |
| **Impact** | 5 — Critical (Credential exposure, unauthorized access) |
| **Risk Score** | **10 🟠 HIGH** |
| **Owner** | Security Engineer |
| **Mitigation** | All credentials via GitHub Secrets only. Semgrep rule to detect hardcoded secrets. `api-client.ts` uses `process.env.*` only. PR template includes "zero credentials in code" checklist item. |
| **Contingency** | Revoke leaked credential immediately. Rotate all secrets. Incident report within 24 hours. |
| **Status** | OPEN — Secret scanning not explicitly configured in GitHub |
| **Due Date** | Sprint 01 Closure |

---

### RISK-010 — Third-Party CDN / External Dependency Failure in Tests
| Field | Value |
|---|---|
| **Risk ID** | RISK-010 |
| **Category** | Infrastructure |
| **Description** | Playwright tests may fail intermittently due to third-party CDN unavailability (e.g., KaTeX fonts, Mermaid.js, or WebRTC STUN/TURN servers) rather than application code defects. |
| **Probability** | 2 — Low |
| **Impact** | 2 — Minor (False test failure, noise in CI) |
| **Risk Score** | **4 🟢 LOW** |
| **Owner** | SDET Lead |
| **Mitigation** | Mock external CDN calls in unit/integration tests. E2E tests only validate internal API. `playwright.config.ts` `actionTimeout: 10000` prevents infinite hangs. |
| **Contingency** | Mark run as environment failure (not test failure) in Allure report. |
| **Status** | MONITORED |
| **Due Date** | Ongoing |

---

## 3. Risk Summary Dashboard

| Risk ID | Title | Probability | Impact | Score | Rating | Owner | Status |
|---|---|:---:|:---:|:---:|---|---|---|
| RISK-001 | Domain Coverage Gap | 4 | 4 | **16** | 🔴 CRITICAL | SDET Lead | OPEN |
| RISK-002 | PHI/Data Leakage | 3 | 5 | **15** | 🟠 HIGH | Security Eng | OPEN |
| RISK-003 | AI Hallucination | 3 | 4 | **12** | 🟠 HIGH | QA Architect | OPEN |
| RISK-004 | Env Instability | 4 | 3 | **12** | 🟠 HIGH | SRE | OPEN |
| RISK-005 | Flaky Tests in CI | 4 | 3 | **12** | 🟠 HIGH | SDET Lead | OPEN |
| RISK-006 | JaCoCo Gate Breach | 3 | 3 | **9** | 🟡 MEDIUM | Backend Lead | OPEN |
| RISK-007 | OSCE Timer Accuracy | 2 | 4 | **8** | 🟡 MEDIUM | QA Architect | OPEN |
| RISK-008 | WCAG Non-Compliance | 3 | 3 | **9** | 🟡 MEDIUM | QA Architect | OPEN |
| RISK-009 | Credential Leakage | 2 | 5 | **10** | 🟠 HIGH | Security Eng | OPEN |
| RISK-010 | CDN Dependency Failure | 2 | 2 | **4** | 🟢 LOW | SDET Lead | MONITORED |

> **Risk Appetite Statement:** Mediverse has zero tolerance for CRITICAL risks. All CRITICAL risks must have a mitigation action in the current sprint. HIGH risks must have an owner and target date. MEDIUM risks are reviewed monthly.
