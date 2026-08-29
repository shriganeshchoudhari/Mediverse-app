# [EPIC-03] Comprehensive 9 Healthcare Domain Curricula Portals

- **Domain:** `domain: allopathic`, `domain: dental`, `domain: ayush`, `domain: pharmacy`, `domain: nursing`, `domain: physiotherapy`, `domain: allied-health`, `domain: veterinary`, `domain: public-health`
- **Lead Architect:** Medical Curricula Director & Lead SDET
- **Status:** APPROVED / IN PROGRESS

## 1. Executive Summary
Deliver structured curriculum portals for 9 accredited healthcare branches (MBBS CBME, BDS DCI, BAMS/BHMS/BNYS/BUMS/BSMS NCISM, B.Pharm/Pharm.D PCI, B.Sc Nursing INC, BPT/MPT, NCAHP Allied Health, BVSc VCI, and MPH Public Health).

## 2. Child User Stories
- [x] **STORY-020 (ALLO-001):** MBBS 5.5-Year CBME Curriculum & Phase Navigation (`03_domain_allopathic.spec.ts`)
- [x] **STORY-021 (DENT-001):** BDS 5-Year DCI Curriculum & Year 2 Subjects (`04_domain_dental.spec.ts`)
- [x] **STORY-022 (AYUSH-001):** AYUSH 5-System Portals (Ayurveda, Homeopathy, Unani, Siddha, Naturopathy) (`05_domain_ayush.spec.ts`)
- [x] **STORY-023 (PHARM-001):** Pharmacy B.Pharm/Pharm.D Curricula (`06_domain_pharmacy.spec.ts`)
- [x] **STORY-024 (NURS-001):** Nursing INC Curriculum & SBAR Clinical Tool (`07_domain_nursing.spec.ts`)
- [x] **STORY-025 (PT-001):** Physiotherapy BPT Curriculum & Biomechanics (`08_domain_physiotherapy.spec.ts`)
- [x] **STORY-026 (ALLIED-001):** Allied Health NCAHP Degree Programs (`09_domain_allied_health.spec.ts`)
- [x] **STORY-027 (VET-001):** Veterinary Medicine BVSc & AH Curriculum (`10_domain_veterinary.spec.ts`)
- [x] **STORY-028 (PUB-001):** Public Health MPH Outbreak Modeling Portal (`11_domain_public_health.spec.ts`)

## 3. QA & Quality Gate Verification
- Automated Specs: `03_domain_allopathic.spec.ts` through `11_domain_public_health.spec.ts`
- 9 Domain Controller Unit Tests in `backend/src/test/java/com/curiolearn/curriculum/`
