# Mediverse Platform — Content Parity & Drift Audit Report

**Generated At**: 2026-08-23T14:59:48.372Z
**Audit Scope**: 3-Way Reconciliation between Frontend TS Modules, Flyway Migrations, and Docs.

---

## 📊 Executive Summary Metrics

| Metric | Value | Notes |
|---|---|---|
| **Total Frontend Subject Folders** | **86** | Located in `frontend/lib/curriculum/content/*` |
| **Total Frontend TS Lesson Modules** | **351** | Rich clinical markdown & vignettes |
| **Total Estimated Word Count** | **2,77,393** words | Authoritative medical content |
| **Modules with Clinical Vignettes** | **347** (99%) | Multi-step clinical problem solving |
| **Modules with Active Flashcards** | **0** (0%) | High-yield spaced repetition |
| **Modules with 3D Organ Targets** | **347** (99%) | Three.js anatomical model bindings |
| **Total Flyway SQL Migrations** | **184** | In `backend/src/main/resources/db/migration` |
| **DB Ingested EXPLANATION Blocks** | **703** | Canonical text blocks |
| **DB Ingested CLINICAL_CASE Blocks** | **347** | Ingested case studies |
| **DB Ingested 3D_MODEL Blocks** | **9** | Validated anatomical organ blocks |
| **Docs Curriculum Outlines** | **60** | Reference markdown outlines in `docs/curriculum/` |

---

## 📑 Detailed Subject-by-Subject Reconciliation Matrix

| Subject Directory | TS Modules | Vignettes | Flashcards | 3D Spatial | Doc Outline Present? | Parity Status |
|---|---|---|---|---|---|---|
| `aetcom` | 4 | 4/4 | 0/4 | 4/4 | ⬜ Outline Pending | 🟢 Ingested (V184) |
| `anatomy` | 6 | 6/6 | 0/6 | 6/6 | ⬜ Outline Pending | 🟢 Ingested (V184) |
| `anatomy2` | 4 | 4/4 | 0/4 | 4/4 | ⬜ Outline Pending | 🟢 Ingested (V184) |
| `anesthesiology` | 4 | 4/4 | 0/4 | 4/4 | ⬜ Outline Pending | 🟢 Ingested (V184) |
| `anesthesiologyadv` | 4 | 4/4 | 0/4 | 4/4 | ⬜ Outline Pending | 🟢 Ingested (V184) |
| `biochemistry` | 4 | 4/4 | 0/4 | 4/4 | ⬜ Outline Pending | 🟢 Ingested (V184) |
| `biochemistry2` | 4 | 4/4 | 0/4 | 4/4 | ⬜ Outline Pending | 🟢 Ingested (V184) |
| `biochemistryadv` | 4 | 4/4 | 0/4 | 4/4 | ⬜ Outline Pending | 🟢 Ingested (V184) |
| `cardiovascularadv` | 4 | 4/4 | 0/4 | 4/4 | ⬜ Outline Pending | 🟢 Ingested (V184) |
| `clin1` | 4 | 4/4 | 0/4 | 4/4 | ⬜ Outline Pending | 🟢 Ingested (V184) |
| `clin2` | 4 | 4/4 | 0/4 | 4/4 | ⬜ Outline Pending | 🟢 Ingested (V184) |
| `community` | 4 | 4/4 | 0/4 | 4/4 | ⬜ Outline Pending | 🟢 Ingested (V184) |
| `criticalcareadv` | 4 | 4/4 | 0/4 | 4/4 | ⬜ Outline Pending | 🟢 Ingested (V184) |
| `dentistry` | 4 | 4/4 | 0/4 | 4/4 | ⬜ Outline Pending | 🟢 Ingested (V184) |
| `dermatology` | 4 | 4/4 | 0/4 | 4/4 | ⬜ Outline Pending | 🟢 Ingested (V184) |
| `dermatologyadv` | 4 | 4/4 | 0/4 | 4/4 | ⬜ Outline Pending | 🟢 Ingested (V184) |
| `ece2` | 4 | 4/4 | 0/4 | 4/4 | ⬜ Outline Pending | 🟢 Ingested (V184) |
| `emergencymedicine` | 4 | 4/4 | 0/4 | 4/4 | ⬜ Outline Pending | 🟢 Ingested (V184) |
| `emergencymedicineadv` | 4 | 4/4 | 0/4 | 4/4 | ⬜ Outline Pending | 🟢 Ingested (V184) |
| `endocrinologyadv` | 4 | 4/4 | 0/4 | 4/4 | ⬜ Outline Pending | 🟢 Ingested (V184) |
| `ent` | 4 | 4/4 | 0/4 | 4/4 | ⬜ Outline Pending | 🟢 Ingested (V184) |
| `entadv` | 4 | 4/4 | 0/4 | 4/4 | ⬜ Outline Pending | 🟢 Ingested (V184) |
| `fam` | 4 | 4/4 | 0/4 | 4/4 | ⬜ Outline Pending | 🟢 Ingested (V184) |
| `forensic` | 4 | 4/4 | 0/4 | 4/4 | ⬜ Outline Pending | 🟢 Ingested (V184) |
| `forensicadv` | 4 | 4/4 | 0/4 | 4/4 | ⬜ Outline Pending | 🟢 Ingested (V184) |
| `foundation` | 4 | 4/4 | 0/4 | 4/4 | ⬜ Outline Pending | 🟢 Ingested (V184) |
| `gastroenterologyadv` | 4 | 4/4 | 0/4 | 4/4 | ⬜ Outline Pending | 🟢 Ingested (V184) |
| `genetics` | 4 | 4/4 | 0/4 | 4/4 | ⬜ Outline Pending | 🟢 Ingested (V184) |
| `hematologyadv` | 4 | 4/4 | 0/4 | 4/4 | ⬜ Outline Pending | 🟢 Ingested (V184) |
| `hospitaladmin` | 4 | 4/4 | 0/4 | 4/4 | ⬜ Outline Pending | 🟢 Ingested (V184) |
| `immunology` | 4 | 4/4 | 0/4 | 4/4 | ⬜ Outline Pending | 🟢 Ingested (V184) |
| `immunologyadv` | 4 | 4/4 | 0/4 | 4/4 | ⬜ Outline Pending | 🟢 Ingested (V184) |
| `infectiousdiseases` | 4 | 4/4 | 0/4 | 4/4 | ⬜ Outline Pending | 🟢 Ingested (V184) |
| `int1` | 4 | 4/4 | 0/4 | 4/4 | ⬜ Outline Pending | 🟢 Ingested (V184) |
| `int2` | 4 | 4/4 | 0/4 | 4/4 | ⬜ Outline Pending | 🟢 Ingested (V184) |
| `int3` | 4 | 4/4 | 0/4 | 4/4 | ⬜ Outline Pending | 🟢 Ingested (V184) |
| `int4` | 4 | 4/4 | 0/4 | 4/4 | ⬜ Outline Pending | 🟢 Ingested (V184) |
| `int5` | 4 | 4/4 | 0/4 | 4/4 | ⬜ Outline Pending | 🟢 Ingested (V184) |
| `int6` | 4 | 4/4 | 0/4 | 4/4 | ⬜ Outline Pending | 🟢 Ingested (V184) |
| `int7` | 4 | 4/4 | 0/4 | 4/4 | ⬜ Outline Pending | 🟢 Ingested (V184) |
| `int8` | 4 | 4/4 | 0/4 | 4/4 | ⬜ Outline Pending | 🟢 Ingested (V184) |
| `medicine` | 4 | 4/4 | 0/4 | 4/4 | ⬜ Outline Pending | 🟢 Ingested (V184) |
| `medicineadv` | 4 | 4/4 | 0/4 | 4/4 | ⬜ Outline Pending | 🟢 Ingested (V184) |
| `microbiology` | 4 | 4/4 | 0/4 | 4/4 | ⬜ Outline Pending | 🟢 Ingested (V184) |
| `nephrologyadv` | 4 | 4/4 | 0/4 | 4/4 | ⬜ Outline Pending | 🟢 Ingested (V184) |
| `neuroanatomy` | 4 | 4/4 | 0/4 | 4/4 | ⬜ Outline Pending | 🟢 Ingested (V184) |
| `neurologyadv` | 4 | 4/4 | 0/4 | 4/4 | ⬜ Outline Pending | 🟢 Ingested (V184) |
| `nuclearmedicine` | 4 | 4/4 | 0/4 | 4/4 | ⬜ Outline Pending | 🟢 Ingested (V184) |
| `obgyn` | 4 | 4/4 | 0/4 | 4/4 | ⬜ Outline Pending | 🟢 Ingested (V184) |
| `obgynadv` | 4 | 4/4 | 0/4 | 4/4 | ⬜ Outline Pending | 🟢 Ingested (V184) |
| `oncology` | 4 | 4/4 | 0/4 | 4/4 | ⬜ Outline Pending | 🟢 Ingested (V184) |
| `ophthalmology` | 4 | 4/4 | 0/4 | 4/4 | ⬜ Outline Pending | 🟢 Ingested (V184) |
| `ophthalmologyadv` | 4 | 4/4 | 0/4 | 4/4 | ⬜ Outline Pending | 🟢 Ingested (V184) |
| `orthopedics` | 4 | 4/4 | 0/4 | 4/4 | ⬜ Outline Pending | 🟢 Ingested (V184) |
| `orthopedicsadv` | 4 | 4/4 | 0/4 | 4/4 | ⬜ Outline Pending | 🟢 Ingested (V184) |
| `osce` | 4 | 4/4 | 0/4 | 4/4 | ⬜ Outline Pending | 🟢 Ingested (V184) |
| `pathology` | 4 | 4/4 | 0/4 | 4/4 | ⬜ Outline Pending | 🟢 Ingested (V184) |
| `pediatrics` | 4 | 4/4 | 0/4 | 4/4 | ⬜ Outline Pending | 🟢 Ingested (V184) |
| `pediatricsadv` | 4 | 4/4 | 0/4 | 4/4 | ⬜ Outline Pending | 🟢 Ingested (V184) |
| `pg1` | 4 | 4/4 | 0/4 | 4/4 | ⬜ Outline Pending | 🟢 Ingested (V184) |
| `pg10` | 4 | 4/4 | 0/4 | 4/4 | ⬜ Outline Pending | 🟢 Ingested (V184) |
| `pg11` | 4 | 4/4 | 0/4 | 4/4 | ⬜ Outline Pending | 🟢 Ingested (V184) |
| `pg12` | 4 | 0/4 | 0/4 | 0/4 | ⬜ Outline Pending | 🟢 Ingested (V184) |
| `pg2` | 4 | 4/4 | 0/4 | 4/4 | ⬜ Outline Pending | 🟢 Ingested (V184) |
| `pg3` | 4 | 4/4 | 0/4 | 4/4 | ⬜ Outline Pending | 🟢 Ingested (V184) |
| `pg4` | 4 | 4/4 | 0/4 | 4/4 | ⬜ Outline Pending | 🟢 Ingested (V184) |
| `pg5` | 4 | 4/4 | 0/4 | 4/4 | ⬜ Outline Pending | 🟢 Ingested (V184) |
| `pg6` | 4 | 4/4 | 0/4 | 4/4 | ⬜ Outline Pending | 🟢 Ingested (V184) |
| `pg7` | 4 | 4/4 | 0/4 | 4/4 | ⬜ Outline Pending | 🟢 Ingested (V184) |
| `pg8` | 4 | 4/4 | 0/4 | 4/4 | ⬜ Outline Pending | 🟢 Ingested (V184) |
| `pg9` | 4 | 4/4 | 0/4 | 4/4 | ⬜ Outline Pending | 🟢 Ingested (V184) |
| `pharmacology` | 4 | 4/4 | 0/4 | 4/4 | ⬜ Outline Pending | 🟢 Ingested (V184) |
| `pharmacologyadv` | 4 | 4/4 | 0/4 | 4/4 | ⬜ Outline Pending | 🟢 Ingested (V184) |
| `physiology` | 9 | 9/9 | 0/9 | 9/9 | ⬜ Outline Pending | 🟢 Ingested (V184) |
| `pmr` | 4 | 4/4 | 0/4 | 4/4 | ⬜ Outline Pending | 🟢 Ingested (V184) |
| `psychiatry` | 4 | 4/4 | 0/4 | 4/4 | ⬜ Outline Pending | 🟢 Ingested (V184) |
| `psychiatryadv` | 4 | 4/4 | 0/4 | 4/4 | ⬜ Outline Pending | 🟢 Ingested (V184) |
| `pulmonology` | 4 | 4/4 | 0/4 | 4/4 | ⬜ Outline Pending | 🟢 Ingested (V184) |
| `pulmonologyadv` | 4 | 4/4 | 0/4 | 4/4 | ⬜ Outline Pending | 🟢 Ingested (V184) |
| `radiology` | 4 | 4/4 | 0/4 | 4/4 | ⬜ Outline Pending | 🟢 Ingested (V184) |
| `radiologyadv` | 4 | 4/4 | 0/4 | 4/4 | ⬜ Outline Pending | 🟢 Ingested (V184) |
| `rheumatologyadv` | 4 | 4/4 | 0/4 | 4/4 | ⬜ Outline Pending | 🟢 Ingested (V184) |
| `surgery` | 4 | 4/4 | 0/4 | 4/4 | ⬜ Outline Pending | 🟢 Ingested (V184) |
| `surgeryadv` | 4 | 4/4 | 0/4 | 4/4 | ⬜ Outline Pending | 🟢 Ingested (V184) |
| `toxicology` | 4 | 4/4 | 0/4 | 4/4 | ⬜ Outline Pending | 🟢 Ingested (V184) |
| `transfusion` | 4 | 4/4 | 0/4 | 4/4 | ⬜ Outline Pending | 🟢 Ingested (V184) |

---

## 🎯 Phase 1 Actionable Roadmap & Cutover Strategy

1. **Batch 1 (Pre-Clinical Foundation)**: `anatomy`, `anatomy2`, `biochemistry`, `biochemistry2`, `physiology` (Highest maturity, priority for API cutover).
2. **Batch 2 (Para-Clinical Core)**: `pathology`, `microbiology`, `pharmacology`, `forensic`, `community`.
3. **Batch 3 (Clinical Specialties)**: `medicine`, `surgery`, `pediatrics`, `obgyn`, `orthopedics`, `ophthalmology`, `ent`, `dermatology`, `anesthesiology`.
4. **Batch 4 (Postgraduate & Super-Specialty)**: `pg1` through `pg12`, `cardiovascularadv`, `nephrologyadv`, `neurologyadv`, `oncology`.
5. **Batch 5 (Allied & Non-Allopathic Domains)**: BDS Dental, BAMS Ayurveda, B.Pharm Pharmacy, B.Sc Nursing, BPT Physiotherapy, BVSc Veterinary, MPH Public Health.

**Next Step**: Deprecate direct static imports in subject pages once `/api/v1/curriculum/subjects/{code}/chapters/{id}` is confirmed for each batch.
