# Negative Test Design Standards

```text
Document ID:       QA-NTD-001
Title:             Negative Test Design & Fault Injection Standards
Version:           1.0.0
Status:            APPROVED
Owner:             Enterprise QA Architecture
```

---

## 1. Negative Test Categories & Assertions
1. **Authentication & Session Faults:** Expired JWT tokens, forged signatures, cross-tenant bearer tokens.
2. **Input Payload Corruption:** Missing mandatory fields, unexpected data types, malformed JSON bodies.
3. **Authorization Violations:** Patients querying Doctor schedules, Doctors editing Admin configurations.
4. **Duplicate Operations:** Replaying identical appointment booking or payment transaction requests.
