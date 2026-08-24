# DB Subject Reachability Audit Report
*Generated on: 2026-08-24*

## Executive Summary
This audit cross-references all **89 subject codes** present in PostgreSQL Flyway migrations against:
1. 86 TypeScript content directories
2. 21 Domain Scaffolds
3. 9 Spring Boot Curriculum Controllers

| Classification | Count | Reachability in UI |
|---|:---:|---|
| **TS Catalog & DB** | 7 | Direct Dedicated Catalog + PostgreSQL |
| **Scaffold & Backend Controller** | 1 | Dynamic `/healthcare/[domain]/[program]` portal |
| **Scaffold Dynamic Route** | 23 | Dynamic Domain Syllabus Viewer |
| **Backend Controller Only** | 3 | REST API available |
| **Truly Orphaned** | 55 | Candidate for deprecation / archival |

## Detailed Breakdown of Non-TS Subjects

| Subject Code | Title | Seeded Migration | Reachability Tier |
|---|---|---|---|
| `CLINICAL` | f8f9a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a24 | `V99__seed_int506_full_curriculum.sql` | **CONTROLLER_SERVED** |
| `BASIC_SCIENCE` | Human Anatomy & Physiology | `V132__seed_pharmd_year1_curriculum.sql` | **ORPHANED** |
| `CORE` | Varmam & Thokkanam (Pressure Points & Physical Therapies) | `V183__seed_bnys_bums_bsms_programs.sql` | **CONTROLLER_SERVED** |
| `PHARMACEUTICS` | Pharmaceutics & Dosage Form Design | `V132__seed_pharmd_year1_curriculum.sql` | **CONTROLLER_SERVED** |
| `PHARM-CHEM` | Pharmaceutical Organic & Medicinal Chemistry | `V133__seed_pharmd_year2_curriculum.sql` | **ORPHANED** |
| `PHARM-PA` | Pharmaceutical Analysis & Instrumental Methods | `V134__seed_pharmd_year3_curriculum.sql` | **ORPHANED** |
| `PHARMACOTHERAPEUTICS` | Pharmacotherapeutics-II: Infectious Diseases, Oncology | `V135__seed_pharmd_year4_curriculum.sql` | **ORPHANED** |
| `CLINICAL_PHARMACY` | Clinical Pharmacy & Ward Rounds | `V135__seed_pharmd_year4_curriculum.sql` | **ORPHANED** |
| `BIOPHARMACEUTICS` | Biopharmaceutics & Pharmacokinetics | `V135__seed_pharmd_year4_curriculum.sql` | **ORPHANED** |
| `PHARM-TDM` | Clinical Pharmacokinetics & Therapeutic Drug Monitoring | `V136__seed_pharmd_year5_curriculum.sql` | **ORPHANED** |
| `CLINICAL_RESEARCH` | Clinical Research & Pharmacovigilance | `V136__seed_pharmd_year5_curriculum.sql` | **ORPHANED** |
| `ANAT-101` | d4e5f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a | `V13__seed_mbbs_curriculum.sql` | **SCAFFOLD_SERVED** |
| `PHYS-101` | d5e6f7a8-b9c0-1d2e-3f4a-5b6c7d8e9f0a | `V14__seed_semester1_semester2.sql` | **SCAFFOLD_SERVED** |
| `BIOC-101` | d6e7f8a9-b0c1-2d3e-4f5a-6b7c8d9e0f1a | `V14__seed_semester1_semester2.sql` | **SCAFFOLD_SERVED** |
| `FND-101` | d7e8f9a0-b1c2-3d4e-5f6a-7b8c9d0e1f2a | `V14__seed_semester1_semester2.sql` | **ORPHANED** |
| `ECE-101` | d8e9f0a1-b2c3-4d5e-6f7a-8b9c0d1e2f3a | `V14__seed_semester1_semester2.sql` | **ORPHANED** |
| `AET-101` | d9e0f1a2-b3c4-5d6e-7f8a-9b0c1d2e3f4a | `V14__seed_semester1_semester2.sql` | **ORPHANED** |
| `ANAT-102` | e1f2a3b4-c5d6-7e8f-9a0b-1c2d3e4f5a6b | `V14__seed_semester1_semester2.sql` | **SCAFFOLD_SERVED** |
| `PHYS-102` | e2f3a4b5-c6d7-8e9f-0a1b-2c3d4e5f6a7b | `V14__seed_semester1_semester2.sql` | **ORPHANED** |
| `BIOC-102` | e3f4a5b6-c7d8-9e0f-1a2b-3c4d5e6f7a8b | `V14__seed_semester1_semester2.sql` | **ORPHANED** |
| `ECE-102` | e4f5a6b7-c8d9-0e1f-2a3b-4c5d6e7f8a9b | `V14__seed_semester1_semester2.sql` | **ORPHANED** |
| `PRE_CLINICAL` | e4f5a6b7-c8d9-0e1f-2a3b-4c5d6e7f8a9b | `V90__seed_ece102_full_curriculum.sql` | **ORPHANED** |
| `ADVANCED_CLINICAL` | Hemodialysis, CRRT & Peritoneal Dialysis Technology | `V158__seed_allied_year3_curriculum.sql` | **ORPHANED** |
| `PATH-201` | f3a4b5c6-d7e8-9f0a-1b2c-3d4e5f6a7b8c | `V15__seed_semester3.sql` | **SCAFFOLD_SERVED** |
| `PHARM-201` | f4b5c6d7-e8f9-0a1b-2c3d-4e5f6a7b8c9d | `V15__seed_semester3.sql` | **SCAFFOLD_SERVED** |
| `MICRO-201` | f5c6d7e8-f9a0-1b2c-3d4e-5f6a7b8c9d0e | `V15__seed_semester3.sql` | **ORPHANED** |
| `FM-201` | f6d7e8f9-a0b1-2c3d-4e5f-6a7b8c9d0e1f | `V15__seed_semester3.sql` | **ORPHANED** |
| `CM-201` | f7e8f9a0-b1c2-3d4e-5f6a-7b8c9d0e1f2a | `V15__seed_semester3.sql` | **ORPHANED** |
| `CLIN-201` | f8f9a0b1-c2d3-4e5f-6a7b-8c9d0e1f2a3b | `V15__seed_semester3.sql` | **ORPHANED** |
| `VET-VAN` | Veterinary Anatomy & Histology | `V164__seed_bvsc_year1_curriculum.sql` | **SCAFFOLD_AND_CONTROLLER_SERVED** |
| `VET-VPY` | Veterinary Physiology & Biochemistry | `V164__seed_bvsc_year1_curriculum.sql` | **SCAFFOLD_SERVED** |
| `VET-LPM` | Livestock Production Management | `V164__seed_bvsc_year1_curriculum.sql` | **SCAFFOLD_SERVED** |
| `VET-VPA` | Veterinary Pathology & Oncology | `V165__seed_bvsc_year2_curriculum.sql` | **SCAFFOLD_SERVED** |
| `VET-VMC` | Veterinary Microbiology & Immunology | `V165__seed_bvsc_year2_curriculum.sql` | **SCAFFOLD_SERVED** |
| `VET-VPR` | Veterinary Parasitology & Vector Control | `V165__seed_bvsc_year2_curriculum.sql` | **SCAFFOLD_SERVED** |
| `VET-VPT` | Veterinary Pharmacology & Toxicology | `V166__seed_bvsc_year3_curriculum.sql` | **SCAFFOLD_SERVED** |
| `VET-ANN` | Animal Nutrition & Feed Technology | `V166__seed_bvsc_year3_curriculum.sql` | **SCAFFOLD_SERVED** |
| `VET-VGO` | Veterinary Gynaecology & Obstetrics | `V166__seed_bvsc_year3_curriculum.sql` | **SCAFFOLD_SERVED** |
| `VET-VCM` | Veterinary Clinical Medicine | `V167__seed_bvsc_year4_curriculum.sql` | **SCAFFOLD_SERVED** |
| `VET-VSR` | Veterinary Surgery & Radiology | `V167__seed_bvsc_year4_curriculum.sql` | **SCAFFOLD_SERVED** |
| `VET-VAH` | Veterinary Public Health & One Health | `V167__seed_bvsc_year4_curriculum.sql` | **SCAFFOLD_SERVED** |
| `PATH-202` | e5a1b2c3-d4e5-6f7a-8b9c-0d1e2f3a4b5c | `V16__seed_semester4.sql` | **SCAFFOLD_SERVED** |
| `PHARM-202` | e5b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d | `V16__seed_semester4.sql` | **ORPHANED** |
| `MICRO-202` | e5c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e | `V16__seed_semester4.sql` | **ORPHANED** |
| `FM-202` | e5d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f | `V16__seed_semester4.sql` | **ORPHANED** |
| `CM-202` | e5e5f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a | `V16__seed_semester4.sql` | **ORPHANED** |
| `CLIN-202` | e5f6a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0b | `V16__seed_semester4.sql` | **ORPHANED** |
| `CM-301` | f1a5b2c3-d4e5-6f7a-8b9c-0d1e2f3a4b5c | `V17__seed_semester5.sql` | **ORPHANED** |
| `FM-301` | f2b5c6d7-e8f9-0a1b-2c3d-4e5f6a7b8c9d | `V17__seed_semester5.sql` | **ORPHANED** |
| `MED-301` | f3c5d6e7-f9a0-1b2c-3d4e-5f6a7b8c9d0e | `V17__seed_semester5.sql` | **SCAFFOLD_SERVED** |
| `SURG-301` | f4d5e6f7-a0b1-2c3d-4e5f-6a7b8c9d0e1f | `V17__seed_semester5.sql` | **SCAFFOLD_SERVED** |
| `OBG-301` | f5e5f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a | `V17__seed_semester5.sql` | **SCAFFOLD_SERVED** |
| `PED-301` | f6f6a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0b | `V17__seed_semester5.sql` | **SCAFFOLD_SERVED** |
| `OPH-301` | f8b6a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0d | `V17__seed_semester5.sql` | **ORPHANED** |
| `CM-302` | f1b5b2c3-d4e5-6f7a-8b9c-0d1e2f3a4b5d | `V18__seed_semester6.sql` | **ORPHANED** |
| `FM-302` | f2c5c6d7-e8f9-0a1b-2c3d-4e5f6a7b8c9e | `V18__seed_semester6.sql` | **ORPHANED** |
| `MED-302` | f3d5d6e7-f9a0-1b2c-3d4e-5f6a7b8c9d0e | `V18__seed_semester6.sql` | **ORPHANED** |
| `SURG-302` | f4e5e6f7-a0b1-2c3d-4e5f-6a7b8c9d0e1f | `V18__seed_semester6.sql` | **SCAFFOLD_SERVED** |
| `OBG-302` | f5f5f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a | `V18__seed_semester6.sql` | **ORPHANED** |
| `PED-302` | f6a6a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0b | `V18__seed_semester6.sql` | **ORPHANED** |
| `OPH-302` | f8c6a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0d | `V18__seed_semester6.sql` | **ORPHANED** |
| `CLIN-302` | f9d6a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0e | `V18__seed_semester6.sql` | **ORPHANED** |
| `ELEC-301` | f0e6a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0f | `V18__seed_semester6.sql` | **ORPHANED** |
| `MED-401` | f1a7b2c3-d4e5-6f7a-8b9c-0d1e2f3a4b5c | `V19__seed_semester7.sql` | **ORPHANED** |
| `SURG-401` | f2b7c6d7-e8f9-0a1b-2c3d-4e5f6a7b8c9d | `V19__seed_semester7.sql` | **ORPHANED** |
| `OBG-401` | f3c7d6e7-f9a0-1b2c-3d4e-5f6a7b8c9d0e | `V19__seed_semester7.sql` | **ORPHANED** |
| `PED-401` | f4d7e6f7-a0b1-2c3d-4e5f-6a7b8c9d0e1f | `V19__seed_semester7.sql` | **ORPHANED** |
| `ORTH-401` | f5e7f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a | `V19__seed_semester7.sql` | **ORPHANED** |
| `DERM-401` | f6a7a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0b | `V19__seed_semester7.sql` | **ORPHANED** |
| `PSY-401` | f7b7a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0c | `V19__seed_semester7.sql` | **ORPHANED** |
| `RESP-401` | f8c7a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0d | `V19__seed_semester7.sql` | **ORPHANED** |
| `RAD-401` | f9d7a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0e | `V19__seed_semester7.sql` | **ORPHANED** |
| `ANES-401` | f0e7a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0f | `V19__seed_semester7.sql` | **ORPHANED** |
| `EM-401` | f0f7a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a1a | `V19__seed_semester7.sql` | **ORPHANED** |
| `ACP-402` | f1a8b2c3-d4e5-6f7a-8b9c-0d1e2f3a4b5c | `V20__seed_semester8.sql` | **ORPHANED** |
| `CD-402` | f2b8c6d7-e8f9-0a1b-2c3d-4e5f6a7b8c9d | `V20__seed_semester8.sql` | **ORPHANED** |
| `IL-402` | f3c8d6e7-f9a0-1b2c-3d4e-5f6a7b8c9d0e | `V20__seed_semester8.sql` | **ORPHANED** |
| `REV-403` | f1a9b2c3-d4e5-6f7a-8b9c-0d1e2f3a4b5c | `V21__seed_semester9.sql` | **ORPHANED** |
| `ROT-403` | f2b9c6d7-e8f9-0a1b-2c3d-4e5f6a7b8c9d | `V21__seed_semester9.sql` | **ORPHANED** |
| `WW-403` | f3c9d6e7-f9a0-1b2c-3d4e-5f6a7b8c9d0e | `V21__seed_semester9.sql` | **ORPHANED** |
| `EXAM-403` | f5e9f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a | `V21__seed_semester9.sql` | **ORPHANED** |
| `PARA_CLINICAL` | f1d9a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a15 | `V57__seed_imm201_full_curriculum.sql` | **ORPHANED** |
