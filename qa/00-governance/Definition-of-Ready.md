# Definition of Ready (DoR)

```text
Document ID:       QA-DOR-001
Title:             Enterprise Definition of Ready
Version:           1.0.0
Status:            APPROVED
Owner:             Enterprise QA Architecture & Product Operations
```

---

A user story or feature backlog item is considered **READY** for sprint planning and engineering sprint intake only when:

```text
               ┌──────────────────────────────────────────────────┐
               │              DEFINITION OF READY                 │
               ├──────────────────────────────────────────────────┤
               │ 1. User Story Clarity (INVEST Principle)         │
               │    - Clear user persona, problem, & business value│
               ├──────────────────────────────────────────────────┤
               │ 2. Acceptance Criteria in Gherkin Syntax         │
               │    - Given-When-Then criteria for happy/negative │
               ├──────────────────────────────────────────────────┤
               │ 3. Testability & Scope Boundaries                │
               │    - Explicitly defined boundaries & error cases │
               │    - Pre-identified test data requirements       │
               ├──────────────────────────────────────────────────┤
               │ 4. UX & API Design Specifications                │
               │    - Figma UI/UX designs reviewed & linked       │
               │    - Data models, contracts, and APIs defined    │
               ├──────────────────────────────────────────────────┤
               │ 5. Risk & Non-Functional Specifications          │
               │    - Performance, SLA, and security expectations │
               └──────────────────────────────────────────────────┘
```

### Readiness Assessment Matrix
| Requirement Attribute | Required Specification | Gatekeeper |
| :--- | :--- | :--- |
| **Story Format** | `As a <persona>, I want <capability> so that <benefit>` | Product Owner |
| **Acceptance Criteria** | Minimum 3 Gherkin scenarios: Happy Path, Validation/Negative, Error handling | QA Analyst / SDET |
| **UI/UX Assets** | Approved Figma links with mobile/desktop viewports and error state mockups | UX Designer |
| **API Contract** | Request payload, response schemas (200, 400, 401, 403, 404, 500) | Tech Lead / Backend |
| **Test Data Feasibility**| Synthetic / mock data sources identified without PHI dependencies | QA / SDET |
| **Non-Functional SLAs** | Explicit p95 latency targets and concurrent user concurrency targets | QA Architect |
