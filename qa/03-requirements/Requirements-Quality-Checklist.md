# Requirements Quality Checklist

```text
Document ID:       QA-RQC-001
Title:             Requirements Quality & Testability Checklist
Version:           1.0.0
Status:            APPROVED
Owner:             Enterprise QA Architecture
```

---

## 1. INVEST Quality Verification Model
Every User Story must be evaluated against the INVEST criteria prior to sprint acceptance:

- [ ] **I - Independent:** The story can be developed and tested in isolation without hard blocked coupling.
- [ ] **N - Negotiable:** The story captures intent; specific implementation details remain flexible.
- [ ] **V - Valuable:** Delivers distinct measurable value to the user persona (patient, clinician, administrator).
- [ ] **E - Estimable:** Clear enough that engineering and QA can estimate effort with confidence.
- [ ] **S - Small:** Scoped to fit comfortably within a single 2-week iteration.
- [ ] **T - Testable:** Possesses concrete, verifiable Acceptance Criteria in Gherkin format.

---

## 2. Gherkin Acceptance Criteria Standards
Acceptance criteria must follow the standard syntax:
```gherkin
Scenario: Successful patient appointment booking
  Given the patient is authenticated with valid credentials
  And the doctor has available consultation slots on "2026-09-01"
  When the patient selects the 10:00 AM slot and confirms booking
  Then an appointment confirmation record is created with status "CONFIRMED"
  And a confirmation notification is dispatched to the patient and doctor
```
