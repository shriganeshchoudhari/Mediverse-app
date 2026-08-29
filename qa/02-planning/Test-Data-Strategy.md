# Test Data Strategy

```text
Document ID:       QA-TDS-001
Title:             Enterprise Test Data Management & Privacy Strategy
Version:           1.0.0
Status:            APPROVED
Owner:             QA Architecture & Data Protection Officer
```

---

## 1. Privacy Mandate & Regulatory Compliance
Under HIPAA, GDPR, and enterprise security policies:
**REAL PRODUCTION PATIENT DATA SHALL NEVER BE COPIED OR MIGRATED INTO LOWER ENVIRONMENTS (DEV, QA, UAT, STAGING).**

---

## 2. Test Data Generation Models

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                      TEST DATA GENERATION MODELS                        │
├────────────────────────────────┬────────────────────────────────────────┤
│ 1. Dynamic Synthetic Data      │ Generated in-flight via Faker.js       │
│    (Recommended for E2E)       │ Example: Unique email per test run     │
├────────────────────────────────┼────────────────────────────────────────┤
│ 2. Seeded Database Fixtures    │ Deterministic baseline records         │
│    (Recommended for API/Perf)  │ Example: Static doctor specialization  │
├────────────────────────────────┼────────────────────────────────────────┤
│ 3. Masked / Synthetic Datasets │ Synthetically synthesized big data     │
│    (Recommended for Load Tests)│ Example: 100,000 synthetic patient records│
└────────────────────────────────┴────────────────────────────────────────┘
```

---

## 3. Data Isolation & Teardown Protocol
- **Test Isolation:** Every test suite must generate its own test entities (e.g. `patient_test_${Date.now()}_${randomUuid}@mediverse.org`).
- **Teardown Hook:** Tests are responsible for deleting or soft-deleting created test entities via API teardown fixtures (`afterAll` or `afterEach`).
