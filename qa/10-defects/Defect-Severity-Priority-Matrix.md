# Defect Severity & Priority Matrix

```text
Document ID:       QA-DEF-002
Title:             Defect Severity, Priority & SLA Matrix
Version:           1.0.0
Status:            APPROVED
Owner:             QA Lead & Product Owner
```

---

## 1. Severity Definitions & Resolution SLAs

| Severity | Definition | Example Scenario | Resolution SLA |
| :--- | :--- | :--- | :---: |
| **S1 (Critical)** | System crash, data corruption, PHI leak, payment blocker | Patient cannot join emergency video call; DB corruption | **< 4 Hours** |
| **S2 (High)** | Major feature broken with no feasible workaround | Prescription PDF fails to generate; Doctor login fails | **< 24 Hours** |
| **S3 (Medium)** | Non-critical feature broken with available workaround | Filter by doctor rating fails; UI layout broken on iPad | **< 1 Sprint** |
| **S4 (Low)** | Cosmetic, typo, minor visual alignment discrepancy | Button font weight slightly off; minor typo in disclaimer | **Backlog** |
