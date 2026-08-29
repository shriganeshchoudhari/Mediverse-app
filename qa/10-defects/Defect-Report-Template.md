# Defect Report Template

```text
Document ID:       QA-DEF-004
Title:             Standard Defect Report Template
Version:           1.0.0
Status:            APPROVED
Owner:             QA Lead
```

---

```markdown
## Defect Summary
[Brief, descriptive summary of the defect]

## Classification
- **Severity:** [S1 Critical | S2 High | S3 Medium | S4 Low]
- **Priority:** [P1 Urgent | P2 High | P3 Medium | P4 Low]
- **Environment:** [QA | Staging | UAT | Production]
- **Build / Release Version:** [e.g., v2.4.0-rc3]
- **Requirement ID:** [e.g., REQ-BOOK-001]
- **Test Case ID:** [e.g., TC-BOOK-002]

## Steps to Reproduce
1. Log in as patient `patient.test@mediverse.org`
2. Navigate to `/appointments/book`
3. Select Dr. John Doe, Date: 2026-09-01, Slot: 10:00 AM
4. Click 'Confirm Appointment'

## Expected Result
Appointment is confirmed with status `CONFIRMED` and confirmation modal is displayed.

## Actual Result
UI displays error spinner indefinitely; Backend returns HTTP 500 Internal Server Error.

## Evidence & Diagnostics
- **Screenshot / Video:** [Attach link / Allure Trace link]
- **API Request Payload:** `POST /api/v1/appointments`
- **Backend Logs / Stacktrace:**
  ```text
  java.lang.NullPointerException: Cannot invoke DoctorSlot.isAvailable() at AppointmentService.java:142
  ```
```
