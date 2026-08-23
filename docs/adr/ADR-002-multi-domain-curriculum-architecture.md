# ADR-002: Multi-Domain Healthcare Curriculum Architecture

## Status
**ACCEPTED** (2026-08-23)

## Context
Mediverse is designed as an all-encompassing medical and healthcare learning platform spanning 9 primary disciplines recognized by statutory Indian and international healthcare regulatory councils:
1. **Allopathic Medicine (MBBS, MD/MS)** — National Medical Commission (NMC CBME)
2. **Dental Surgery (BDS, MDS)** — Dental Council of India (DCI)
3. **Ayurvedic & Indian Systems of Medicine (BAMS, MD Ayu)** — National Commission for Indian System of Medicine (NCISM / CCIM)
4. **Pharmacy (B.Pharm, Pharm.D, M.Pharm)** — Pharmacy Council of India (PCI)
5. **Nursing (B.Sc Nursing, M.Sc Nursing)** — Indian Nursing Council (INC)
6. **Physiotherapy (BPT, MPT)** — Indian Association of Physiotherapists (IAP) / NCAHP
7. **Allied Health Sciences (Perfusion, Radiology, OT, Dialysis)** — National Commission for Allied and Healthcare Professions (NCAHP)
8. **Veterinary Science (BVSc & AH, MVSc)** — Veterinary Council of India (VCI / MSVE)
9. **Public Health & Hospital Administration (MPH, MHA)** — UGC / NMC / NABH

Prior implementations were restricted to a single MBBS curriculum tree, causing friction when scaling to other professional degrees.

## Decision
1. **Normalized Program & Hierarchy Schema**:
   - `programs` (domain, code, duration, active status)
   - `curricula` (program_id FK)
   - `curriculum_years` & `semesters` (flexible academic progression)
   - `subjects` & `units`
   - `chapters`, `topics`, `concepts`, and `lessons`
2. **Dedicated Competency Mapping Tables per Regulator**:
   - `nmc_competencies`
   - `dci_competencies`
   - `ccim_competencies`
   - `pci_competencies`
   - `inc_competencies`
   - `iap_competencies`
   - `ncahp_competencies`
   - `vci_competencies`
   - `public_health_competencies`
3. **Multi-Domain Routing & UI Scaffold**:
   - Canonical routes: `/healthcare/[domain]` and `/healthcare/[domain]/[program]`
   - Unified catalog adapter (`unifiedDomainCatalog.ts`) enabling seamless multi-domain syllabus browsing.

## Consequences
- Single unified backend architecture supporting all 9 healthcare professions.
- Full regulatory compliance with council competencies (Miller's pyramid: KNOWS, KNOWS_HOW, SHOWS_HOW, PERFORMS).
- Cross-domain horizontal and vertical integration (e.g., Pharmacology shared between MBBS, BDS, and B.Pharm with specialty adjustments).
