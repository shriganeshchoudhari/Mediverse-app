# Coverage Model & Metrics

```text
Document ID:       QA-COV-001
Title:             Multi-Dimensional Coverage Model
Version:           1.0.0
Status:            APPROVED
Owner:             Enterprise QA Architecture
```

---

## 1. Multi-Dimensional Quality Coverage Model

Quality coverage is evaluated across four distinct dimensions:

```text
               ┌──────────────────────────────────────────────────┐
               │           MULTI-DIMENSIONAL COVERAGE             │
               ├──────────────────────────────────────────────────┤
               │ 1. Requirement Coverage (% User Stories Mapped)  │
               │    Target: 100% of P1/P2 Requirements            │
               ├──────────────────────────────────────────────────┤
               │ 2. Code Coverage (% Unit/Branch Line Execution)  │
               │    Target: >= 80% Line, >= 85% Critical Branch   │
               ├──────────────────────────────────────────────────┤
               │ 3. API Contract Coverage (% REST Endpoints)      │
               │    Target: 100% of Exposed Routes in OpenAPI     │
               ├──────────────────────────────────────────────────┤
               │ 4. UI Journey Coverage (% Core User Workflows)   │
               │    Target: 100% of Critical Patient/Doctor Paths │
               └──────────────────────────────────────────────────┘
```
