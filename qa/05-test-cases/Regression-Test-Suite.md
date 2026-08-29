# Regression Test Suite Catalog

```text
Document ID:       QA-RTS-001
Title:             Comprehensive Multi-Domain Regression Test Suite Catalog
Version:           2.0.0
Status:            APPROVED
Owner:             Lead SDET & QA Engineers
```

---

| Test Case ID | Domain / Spec File | Feature Area Under Test | Test Type | Priority |
| :--- | :--- | :--- | :--- | :---: |
| `TC-NAV-000` | `01_auth_navigation.spec.ts` | Global Topbar, Logo, Search, Theme | Functional | P0 |
| `TC-AUTH-001` | `01_auth_navigation.spec.ts` | Registration, Password Validation, JWT | Functional | P0 |
| `TC-AUTH-002` | `01_auth_navigation.spec.ts` | Login, Admin Verification, Redirects | Functional | P0 |
| `TC-SRCH-001` | `02_global_search_socratic.spec.ts` | Cmd+K Search, Domain Pill Filters | Functional | P0 |
| `TC-SOC-001` | `02_global_search_socratic.spec.ts` | Socratic AI Clinical Query Dialogue | Functional / AI | P0 |
| `TC-ALLO-001` | `03_domain_allopathic.spec.ts` | MBBS 5.5-Yr Curriculum & Subjects | Functional | P0 |
| `TC-ALLO-005` | `03_domain_allopathic.spec.ts` | Interactive ECG Waveform Simulator | Interactive Sim | P0 |
| `TC-ALLO-006` | `03_domain_allopathic.spec.ts` | Acid-Base Davenport PaCO2 Simulator | Interactive Sim | P1 |
| `TC-DENT-001` | `04_domain_dental.spec.ts` | BDS 5-Yr Curriculum & Preclinical | Functional | P0 |
| `TC-DENT-004` | `04_domain_dental.spec.ts` | 3D Tooth Morphology & Enamel Alpha | 3D Graphics | P0 |
| `TC-DENT-006` | `04_domain_dental.spec.ts` | Periodontal Charting & CPITN Code | Interactive Sim | P1 |
| `TC-AYUSH-001` | `05_domain_ayush.spec.ts` | BAMS, BHMS, BNYS, BUMS, BSMS Tabs | Functional | P0 |
| `TC-AYUSH-007` | `05_domain_ayush.spec.ts` | Prakriti Tri-Dosha Radar Assessment | Interactive Sim | P0 |
| `TC-AYUSH-008` | `05_domain_ayush.spec.ts` | 3D Marma Vital Points Map | 3D Graphics | P1 |
| `TC-PHARM-001` | `06_domain_pharmacy.spec.ts` | B.Pharm/Pharm.D & Dissolution Solver| Functional / Sim | P0 |
| `TC-NURS-001` | `07_domain_nursing.spec.ts` | B.Sc Nursing & SBAR Clinical Tool | Functional | P0 |
| `TC-PT-001` | `08_domain_physiotherapy.spec.ts` | BPT Biomechanics & Goniometer Tool | Functional / Sim | P0 |
| `TC-ALLIED-001`| `09_domain_allied_health.spec.ts` | BMLT, OTT, Dialysis, Imaging NCAHP | Functional | P0 |
| `TC-VET-001` | `10_domain_veterinary.spec.ts` | BVSc Animal Husbandry & Canine 3D | Functional / 3D | P0 |
| `TC-PUB-001` | `11_domain_public_health.spec.ts` | MPH Epidemic Attack Rate Curve | Functional / Sim | P0 |
| `TC-STUDY-001` | `12_collaborative_study_rooms.spec.ts`| WebRTC Study Rooms & Whiteboard | Integration E2E | P0 |
| `TC-EXAM-001` | `13_exam_and_osce.spec.ts` | OSCE Timed Station & Question Bank | Assessment E2E | P0 |
| `TC-CMS-001` | `14_cms_curriculum_authoring.spec.ts` | Curriculum Editor & Review Flow | Functional | P1 |
| `TC-A11Y-001` | `15_accessibility_and_responsive.spec.ts`| WCAG 2.1 AA Axe Scan & Mobile View | A11y / Responsive| P0 |
