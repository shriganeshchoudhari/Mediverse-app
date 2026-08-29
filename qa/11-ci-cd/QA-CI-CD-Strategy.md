# QA CI/CD Strategy

```text
Document ID:       QA-CICD-001
Title:             Continuous Testing & Quality Engineering CI/CD Strategy
Version:           1.0.0
Status:            APPROVED
Owner:             DevOps Lead & QA Architect
```

---

## 1. Pipeline Test Execution Hierarchy

```text
[ Developer PR ] ──────> Unit Tests (Jest/JUnit) + API Smoke (Newman) (<4 min)
       │ (Merge)
[ Merge to Main ] ─────> Full Unit + Integration + UI Smoke (Playwright) (<8 min)
       │ (Deploy QA)
[ Nightly Build ] ─────> Full UI Regression + Performance + OWASP Security (<25 min)
       │ (Tag RC)
[ Staging RC ] ────────> Full E2E Allure Suite + Quality Gate Validation
       │ (Deploy Prod)
[ Production ] ────────> Zero-Impact Production Smoke + Continuous Synthetic Heartbeat
```
