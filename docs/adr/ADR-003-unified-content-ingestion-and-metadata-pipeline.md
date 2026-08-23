# ADR-003: Canonical Hierarchy Linking & Content Unification Pipeline

## Status
**ACCEPTED** (2026-08-23)

## Context
Initial ingestion of frontend TypeScript content modules into the relational database created unlinked lesson records assigned to a single root fallback concept, and assigned generic 3D targets to non-anatomical topics.

## Decision
1. **Full Relational Hierarchy Reconstruction**:
   - The ETL pipeline (`scripts/ingest-curriculum-to-db.js`) now extracts folder taxonomy to deterministically construct and insert:
     - 86 `subjects`
     - 348 `units`
     - 351 `chapters`
     - 351 `topics`
     - 351 `concepts`
     - 351 `lessons`
   - Every lesson is directly linked to its own dedicated `concept_id`, restoring the complete 10-tier tree for navigation, progress tracking, and filtering.
2. **Selective 3D Model Binding**:
   - 3D spatial model blocks (`3D_MODEL`) are exclusively attached to genuine anatomical organ systems (`HEART`, `BRAIN`, `KIDNEY`, `LUNG`, `LIVER`, `SKULL`, `EYE`, `EAR`, `SPINE`, `BONE`, `TEETH`, etc.).
   - Ethics (AETCOM), epidemiology, and social medicine modules do not receive spurious 3D tags.
3. **Headless Dynamic Retrieval**:
   - The Next.js client interacts with `/api/v1/curriculum/chapters/{id}` with graceful offline fallback to `offlineCacheManager.ts`.

## Consequences
- 100% hierarchy alignment across all 86 subject domains.
- Full structural integrity for the Socratic AI Tutor RAG engine and chapter viewer.
- Clean database governance with no orphan lessons or fallback concepts.
