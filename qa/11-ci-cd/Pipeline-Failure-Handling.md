# Pipeline Failure Handling & Triage

```text
Document ID:       QA-CICD-005
Title:             Pipeline Failure Diagnosis & Escalation Policy
Version:           1.0.0
Status:            APPROVED
Owner:             DevOps / QA Lead
```

---

## 1. Failure Protocol
1. Auto-upload Playwright trace files (`trace.zip`), failure screenshots, and Allure test logs.
2. Auto-dispatch Slack alert to `#qa-pipeline-alerts` with failing test names and commit SHA.
3. Automatically block deployment gate until green retest.
