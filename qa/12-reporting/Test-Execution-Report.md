# Test Execution Report — Sprint / Release Template

```text
Document ID:       QA-REP-005
Title:             Test Execution Report — Sprint/Release Template
Version:           1.0.0
Status:            TEMPLATE
Owner:             SDET Lead / QA Architect
Reviewer:          Engineering Manager
Approver:          Engineering Manager
Created Date:      2026-08-29
Last Updated:      2026-08-29
Review Frequency:  Generated per Sprint and per Release
Change History:    v1.0.0 — Template established
```

---

## How to Use This Template

This template is filled in at the **end of each sprint** (Sprint Execution Report) and at each **release gate** (Release Execution Report). Replace all `{{ }}` placeholders with actual values.

Allure report data, GitHub Actions run logs, and JaCoCo reports are the primary data sources.

---

# TEST EXECUTION REPORT

**Report Type:** `{{ Sprint Execution | Release Execution }}`  
**Report ID:** `TER-{{ SPRINT-NN | vX.Y.Z }}`  
**Sprint / Release:** `{{ Sprint 01 | v1.0.0 }}`  
**Date Range:** `{{ YYYY-MM-DD }}` — `{{ YYYY-MM-DD }}`  
**Prepared By:** `{{ Name, Role }}`  
**Reviewed By:** `{{ Name, Role }}`  
**Distribution:** Engineering Team, Product Management, CTO

---

## 1. Executive Summary

| Metric | Value | Target | Status |
|---|---|---|---|
| Total Test Cases Executed | `{{ N }}` | — | — |
| Passed | `{{ N }}` | — | — |
| Failed | `{{ N }}` | 0 blocking failures | `{{ 🟢/🔴 }}` |
| Skipped / Blocked | `{{ N }}` | — | — |
| **Overall Pass Rate** | `{{ N% }}` | ≥ 95% | `{{ 🟢/🔴 }}` |
| Backend Code Coverage (JaCoCo) | `{{ N% }}` | ≥ 80% | `{{ 🟢/🔴 }}` |
| Automation Coverage | `{{ N% }}` | ≥ 85% regression | `{{ 🟢/🔴 }}` |
| Defects Found (This Sprint) | `{{ N }}` | — | — |
| Defects Resolved | `{{ N }}` | — | — |
| Defect Escape Rate | `{{ N% }}` | < 2% | `{{ 🟢/🔴 }}` |
| Flaky Test Rate | `{{ N% }}` | < 1% | `{{ 🟢/🔴 }}` |

**Overall Quality Assessment:** `{{ 🟢 RELEASE READY | 🟡 CONDITIONAL | 🔴 NOT READY }}`

**Summary Narrative:**
> `{{ 2–3 sentences summarizing the sprint quality outcome, key findings, and overall confidence level. }}`

---

## 2. Test Suite Results by Type

### 2.1 Smoke Tests (CI Gate)

| Suite | Browser | Total | Pass | Fail | Skip | Duration |
|---|---|---|---|---|---|---|
| Smoke | Chromium | `{{ }}` | `{{ }}` | `{{ }}` | `{{ }}` | `{{ }}` |
| Production Heartbeat | Chromium | `{{ }}` | `{{ }}` | `{{ }}` | `{{ }}` | `{{ }}` |

**Smoke Gate Status:** `{{ ✅ PASSED | ❌ FAILED }}`

### 2.2 Regression Tests (Multi-Browser)

| Suite | Browser | Total | Pass | Fail | Skip | Duration |
|---|---|---|---|---|---|---|
| Regression | Chromium | `{{ }}` | `{{ }}` | `{{ }}` | `{{ }}` | `{{ }}` |
| Regression | Firefox | `{{ }}` | `{{ }}` | `{{ }}` | `{{ }}` | `{{ }}` |
| Regression | WebKit | `{{ }}` | `{{ }}` | `{{ }}` | `{{ }}` | `{{ }}` |
| Regression | Mobile Chrome | `{{ }}` | `{{ }}` | `{{ }}` | `{{ }}` | `{{ }}` |
| Regression | Mobile Safari | `{{ }}` | `{{ }}` | `{{ }}` | `{{ }}` | `{{ }}` |

### 2.3 API Tests (Newman)

| Collection | Folder | Requests | Pass | Fail | Duration |
|---|---|---|---|---|---|
| Mediverse_API_Regression | Actuator Health | `{{ }}` | `{{ }}` | `{{ }}` | `{{ }}` |
| Mediverse_API_Regression | Auth / Identity | `{{ }}` | `{{ }}` | `{{ }}` | `{{ }}` |
| Mediverse_API_Regression | Healthcare Domains | `{{ }}` | `{{ }}` | `{{ }}` | `{{ }}` |
| Mediverse_API_Regression | Socratic AI MCQ | `{{ }}` | `{{ }}` | `{{ }}` | `{{ }}` |
| Mediverse_API_Regression | OSCE Exam Engine | `{{ }}` | `{{ }}` | `{{ }}` | `{{ }}` |
| **TOTAL** | | `{{ }}` | `{{ }}` | `{{ }}` | `{{ }}` |

### 2.4 Backend Unit & Integration Tests (JUnit 5 / JaCoCo)

| Package | Test Classes | Tests Run | Pass | Fail | Line Coverage |
|---|---|---|---|---|---|
| `com.curiolearn.auth` | `{{ N }}` | `{{ }}` | `{{ }}` | `{{ }}` | `{{ N% }}` |
| `com.curiolearn.domain.*` | `{{ N }}` | `{{ }}` | `{{ }}` | `{{ }}` | `{{ N% }}` |
| `com.curiolearn.ai` | `{{ N }}` | `{{ }}` | `{{ }}` | `{{ }}` | `{{ N% }}` |
| `com.curiolearn.osce` | `{{ N }}` | `{{ }}` | `{{ }}` | `{{ }}` | `{{ N% }}` |
| **OVERALL** | **29** | `{{ }}` | `{{ }}` | `{{ }}` | **`{{ N% }}`** |

**JaCoCo Gate (80%):** `{{ ✅ PASSED | ❌ FAILED }}`

---

## 3. Defect Summary

### 3.1 Defects Found This Sprint

| ID | Title | Severity | Priority | Domain | Status |
|---|---|---|---|---|---|
| `{{ #N }}` | `{{ Title }}` | `{{ S1–S4 }}` | `{{ P1–P4 }}` | `{{ Domain }}` | `{{ Open/Fixed }}` |

### 3.2 Defect Metrics

| Metric | Value | Formula |
|---|---|---|
| Total Defects Found | `{{ N }}` | All severities |
| Critical (S1) Open | `{{ N }}` | Must = 0 for release |
| High (S2) Open | `{{ N }}` | Must = 0 for release |
| Defect Density | `{{ N }}/KLoC` | Defects ÷ KLoC |
| MTTR (All) | `{{ N }}` hours | Avg resolution time |
| MTTR (S1) | `{{ N }}` hours | Target < 4h |

### 3.3 Carryover Defects (from prior sprint)

| ID | Title | Severity | Age (Days) | Owner |
|---|---|---|---|---|
| `{{ #N }}` | `{{ Title }}` | `{{ S1–S4 }}` | `{{ N }}` | `{{ Name }}` |

---

## 4. Test Coverage Analysis

### 4.1 Domain Coverage

| Domain | Spec Files | Test Cases | Automated | Coverage % |
|---|---|---|---|---|
| Allopathic MBBS | `{{ N }}` | `{{ N }}` | `{{ N }}` | `{{ N% }}` |
| Dental BDS | `{{ N }}` | `{{ N }}` | `{{ N }}` | `{{ N% }}` |
| AYUSH | `{{ N }}` | `{{ N }}` | `{{ N }}` | `{{ N% }}` |
| Pharmacy | `{{ N }}` | `{{ N }}` | `{{ N }}` | `{{ N% }}` |
| Nursing | `{{ N }}` | `{{ N }}` | `{{ N }}` | `{{ N% }}` |
| Physiotherapy | `{{ N }}` | `{{ N }}` | `{{ N }}` | `{{ N% }}` |
| Allied Health | `{{ N }}` | `{{ N }}` | `{{ N }}` | `{{ N% }}` |
| Veterinary | `{{ N }}` | `{{ N }}` | `{{ N }}` | `{{ N% }}` |
| Public Health | `{{ N }}` | `{{ N }}` | `{{ N }}` | `{{ N% }}` |

### 4.2 RTM Coverage Status

| Priority | Total Requirements | Tested | Coverage % | Status |
|---|---|---|---|---|
| P1 | `{{ N }}` | `{{ N }}` | `{{ N% }}` | `{{ 🟢/🔴 }}` |
| P2 | `{{ N }}` | `{{ N }}` | `{{ N% }}` | `{{ 🟢/🟡 }}` |
| P3 | `{{ N }}` | `{{ N }}` | `{{ N% }}` | `{{ 🟡 }}` |

---

## 5. CI/CD Pipeline Health

| Workflow | Runs | Pass | Fail | Avg Duration | Status |
|---|---|---|---|---|---|
| Smoke Tests Gate | `{{ N }}` | `{{ N }}` | `{{ N }}` | `{{ N }}` min | `{{ 🟢/🔴 }}` |
| Full Regression Suite | `{{ N }}` | `{{ N }}` | `{{ N }}` | `{{ N }}` min | `{{ 🟢/🔴 }}` |
| Newman API Tests | `{{ N }}` | `{{ N }}` | `{{ N }}` | `{{ N }}` min | `{{ 🟢/🔴 }}` |
| Nightly Suite | `{{ N }}` | `{{ N }}` | `{{ N }}` | `{{ N }}` min | `{{ 🟢/🔴 }}` |

---

## 6. Known Issues & Risks

| # | Issue / Risk | Impact | Mitigation | Owner |
|---|---|---|---|---|
| 1 | `{{ Description }}` | `{{ Impact }}` | `{{ Mitigation }}` | `{{ Owner }}` |

---

## 7. Recommendations

1. `{{ Recommendation 1 }}`
2. `{{ Recommendation 2 }}`
3. `{{ Recommendation 3 }}`

---

## 8. Sign-Off

| Role | Name | Decision | Date |
|---|---|---|---|
| QA Architect / SDET Lead | `{{ Name }}` | `{{ Approve / Conditional / Reject }}` | `{{ Date }}` |
| Engineering Manager | `{{ Name }}` | `{{ Approve / Conditional / Reject }}` | `{{ Date }}` |
| Product Manager | `{{ Name }}` | `{{ Approve / Conditional / Reject }}` | `{{ Date }}` |

**Release Decision:** `{{ 🟢 APPROVED FOR RELEASE | 🟡 CONDITIONAL APPROVAL | 🔴 RELEASE BLOCKED }}`

**Conditions (if applicable):**
> `{{ List conditions that must be met before release proceeds. }}`

---

## 9. Appendices

### Appendix A — Allure Report Link
`{{ https://shriganeshchoudhari.github.io/Mediverse-app/reports/allure/<run_id>/index.html }}`

### Appendix B — JaCoCo Report Location
`backend/build/reports/jacoco/test/html/index.html` (from CI artifact)

### Appendix C — Newman HTML Report
`automation/postman/reports/html/newman-report-<timestamp>.html` (from CI artifact)
