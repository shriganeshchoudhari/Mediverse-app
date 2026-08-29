# Incident QA Runbook

```text
Document ID:       QA-MON-004
Title:             Post-Incident QA & Defect Escape Investigation
Version:           1.0.0
Status:            APPROVED
Owner:             QA Lead
```

---

## 1. 5-Whys Defect Escape Analysis
Following any P1 production incident:
1. Why was the bug not caught by unit tests?
2. Why was it not caught by API/integration suites?
3. Why was it missed in manual exploratory charters?
4. What test gap must be automated within 48 hours to prevent recurrence?
