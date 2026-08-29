# Allure Reporting Strategy

```text
Document ID:       QA-REP-001
Title:             Allure Unified Quality Reporting Strategy
Version:           1.0.0
Status:            APPROVED
Owner:             Lead SDET
```

---

## 1. Unified Metadata Architecture
All Playwright and Newman tests attach:
- **Epic / Feature / Story Tags:** Linked directly to Jira requirements.
- **Severity Tag:** `BLOCKER`, `CRITICAL`, `NORMAL`, `MINOR`.
- **Diagnostic Artifacts:** Screenshots on failure, full video clips, trace archives (`trace.zip`), request/response JSON payloads.
