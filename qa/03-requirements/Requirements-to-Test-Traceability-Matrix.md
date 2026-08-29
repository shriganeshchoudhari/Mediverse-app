# Requirements-to-Test Traceability Matrix (RTM)

```text
Document ID:       QA-RTM-001
Title:             Enterprise Requirements-to-Test Traceability Matrix
Version:           2.0.0
Status:            APPROVED
Owner:             Enterprise QA Architecture & SDET Lead
Last Realigned:    2026-08-29 (Aligned with 15 UI Specs, 9 Medical Domains & 29 Backend Services)
```

---

## 1. Traceability Lifecycle & Chain of Custody

Traceability is maintained deterministically across the delivery lifecycle:

```text
Business Requirement (BRD / Medical Curricula)
         ↓
Functional Requirement (SRS / 9 Healthcare Domains / AI Tutor / OSCE)
         ↓
Acceptance Criteria (Gherkin Scenarios)
         ↓
Test Scenario (Functional / Domain Simulation / Negative / Security)
         ↓
Test Case (TC-ID / NAV / AUTH / ALLO / DENT / AYUSH / PHARM / NURS / PT / ALLIED / VET / PUB / STUDY / EXAM / CMS)
         ↓
Automated Test (Playwright E2E Spec / Postman Newman Contract ID)
         ↓
Execution (GitHub Actions Matrix / Jenkins Shards)
         ↓
Defect (DEF-ID linked to Test Case & Commit)
         ↓
Retest & Verified Resolution
         ↓
Production Release Sign-Off
```

---

## 2. Orphan Prevention Governance Rules
1. **Rule 1 (No Orphan Requirements):** Every approved functional requirement across all 9 medical domains, Socratic AI, and OSCE exam engine must map to at least ONE positive test case, ONE negative test case, and ONE boundary/edge test case.
2. **Rule 2 (No Orphan Test Cases):** Every test case must reference a valid Requirement ID (`REQ-xxx`) or Acceptance Criteria ID (`AC-xxx`). Unlinked tests are pruned during monthly test hygiene audits.
3. **Rule 3 (No Orphan Defects):** Every bug report must reference the failed Test Case ID and associated Requirement ID.

---

## 3. Enterprise Traceability Matrix (Comprehensive Multi-Domain Coverage)

| Requirement ID | Domain / Module | Requirement Summary | Risk | Test Case ID | Automation ID / Spec File | Test Suite | Execution Status |
| :--- | :--- | :--- | :---: | :--- | :--- | :--- | :---: |
| **REQ-CORE-001** | Core Shell | Global Topbar Cardinality & Theme Toggle | Low | `TC-NAV-000` | `frontend/e2e/specs/01_auth_navigation.spec.ts` | Smoke, UI | PASS |
| **REQ-AUTH-001** | Authentication | Student Registration with JWT Token Issuance | High | `TC-AUTH-001` | `01_auth_navigation.spec.ts` / `API-AUTH-001` | Smoke, Regression | PASS |
| **REQ-AUTH-002** | Authentication | Student & Admin Login with Role Verification | High | `TC-AUTH-002` | `01_auth_navigation.spec.ts` / `API-AUTH-002` | Smoke, Regression | PASS |
| **REQ-AUTH-003** | Security / Auth | Unauthenticated Route Interception & Redirect | High | `TC-AUTH-003` | `01_auth_navigation.spec.ts` | Regression, Security | PASS |
| **REQ-SRCH-001** | Global Search | Global Cmd+K Search with Domain Filter Pills | Med | `TC-NAV-002` | `02_global_search_socratic.spec.ts` | UI Regression | PASS |
| **REQ-SOC-001** | AI Tutoring | Socratic Clinical Assistant Streaming Dialogue | High | `TC-SOC-001` | `02_global_search_socratic.spec.ts` | Smoke, Regression | PASS |
| **REQ-ALLO-001** | Allopathic (MBBS) | 5.5-Yr MBBS CBME Curriculum & Phase Navigation | High | `TC-ALLO-001` | `03_domain_allopathic.spec.ts` | Regression, UI | PASS |
| **REQ-ALLO-002** | Allopathic (Sim) | Interactive ECG Waveform Simulator (VTach) | Med | `TC-ALLO-005` | `03_domain_allopathic.spec.ts` | Regression, UI | PASS |
| **REQ-ALLO-003** | Allopathic (Sim) | Davenport Acid-Base Diagram & PaCO2 Solver | Med | `TC-ALLO-006` | `03_domain_allopathic.spec.ts` | Regression, UI | PASS |
| **REQ-DENT-001** | Dental (BDS/MDS) | 5-Yr BDS DCI Curriculum & Year 2 Subjects | High | `TC-DENT-001` | `04_domain_dental.spec.ts` | Regression, UI | PASS |
| **REQ-DENT-002** | Dental (3D/Sim) | 3D Tooth Morphology Mesh & Enamel Transparency | Med | `TC-DENT-004` | `04_domain_dental.spec.ts` | Regression, UI | PASS |
| **REQ-DENT-003** | Dental (Sim) | Periodontal Pocket Charting & CPITN Calculator | Med | `TC-DENT-006` | `04_domain_dental.spec.ts` | Regression, UI | PASS |
| **REQ-AYUSH-001**| AYUSH (BAMS-BSMS)| BAMS, BHMS, BNYS, BUMS, BSMS Curriculum Portals | High | `TC-AYUSH-001` | `05_domain_ayush.spec.ts` | Regression, UI | PASS |
| **REQ-AYUSH-002**| AYUSH (Sim) | Prakriti Tri-Dosha Assessment Calculator | Med | `TC-AYUSH-007` | `05_domain_ayush.spec.ts` | Regression, UI | PASS |
| **REQ-AYUSH-003**| AYUSH (3D) | 3D Marma Vital Points Anatomical Map | Med | `TC-AYUSH-008` | `05_domain_ayush.spec.ts` | Regression, UI | PASS |
| **REQ-PHARM-001**| Pharmacy | B.Pharm & Pharm.D PCI Curricula & Dissolution Sim | High | `TC-PHARM-001` | `06_domain_pharmacy.spec.ts` | Regression, UI | PASS |
| **REQ-NURS-001** | Nursing | INC B.Sc Nursing & SBAR Clinical Handover Tool | High | `TC-NURS-001` | `07_domain_nursing.spec.ts` | Regression, UI | PASS |
| **REQ-PT-001** | Physiotherapy | BPT / MPT Biomechanics & Goniometer Range of Motion | High | `TC-PT-001` | `08_domain_physiotherapy.spec.ts` | Regression, UI | PASS |
| **REQ-ALLIED-001**| Allied Health | BMLT, OTT, Dialysis, Imaging NCAHP Curricula | High | `TC-ALLIED-001` | `09_domain_allied_health.spec.ts` | Regression, UI | PASS |
| **REQ-VET-001** | Veterinary | VCI BVSc & AH Animal Husbandry & 3D Canine Skeletons| High | `TC-VET-001` | `10_domain_veterinary.spec.ts` | Regression, UI | PASS |
| **REQ-PUB-001** | Public Health | MPH Outbreak Attack Rate & Epidemic Curve Model | High | `TC-PUB-001` | `11_domain_public_health.spec.ts` | Regression, UI | PASS |
| **REQ-STUDY-001**| Social Learning | WebRTC Collaborative Study Room & Whiteboard Sync | High | `TC-STUDY-001` | `12_collaborative_study_rooms.spec.ts` | Integration, E2E | PASS |
| **REQ-EXAM-001** | Assessment | Timed OSCE Clinical Station & Question Bank Engine | High | `TC-EXAM-001` | `13_exam_and_osce.spec.ts` | Regression, E2E | PASS |
| **REQ-CMS-001** | Authoring / CMS | Medical Curriculum Authoring & Reviewer Workflow | Med | `TC-CMS-001` | `14_cms_curriculum_authoring.spec.ts` | Regression, UI | PASS |
| **REQ-A11Y-001** | Compliance | WCAG 2.1 AA Axe-Core Automated Scan & Keyboard Nav | High | `TC-A11Y-001` | `15_accessibility_and_responsive.spec.ts`| Smoke, A11y | PASS |
