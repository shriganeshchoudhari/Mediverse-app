# Functional Test Design

```text
Document ID:       QA-FTD-001
Title:             Functional Test Design Framework
Version:           1.0.0
Status:            APPROVED
Owner:             Enterprise QA Architecture
```

---

## 1. Scope of Functional Design
- **Happy Path Workflows:** Standard user progression from intent to successful execution.
- **Alternate Paths:** Valid branches (e.g. paying via Saved Card vs New Card, booking Virtual vs In-Person).
- **Business Logic Rules:** Doctor availability validation, prescription expiry, multi-tenant isolation.
- **State Persistence:** Ensuring changes persist across page reloads and API reconnects.
