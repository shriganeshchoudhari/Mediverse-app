# Defect Lifecycle States & Transition Rules

```text
Document ID:       QA-DEF-003
Title:             Defect State Transition Governance
Version:           1.0.0
Status:            APPROVED
Owner:             QA Lead
```

---

## 1. State Rules
- **New -> Triaged:** Triaged by QA Lead and Tech Lead during daily morning triage.
- **Fixed -> Ready for QA:** Developer must attach unit/integration test link and build version.
- **Retest -> Closed:** QA verifies fix on target build and attaches execution proof (video/screenshot/API trace).
