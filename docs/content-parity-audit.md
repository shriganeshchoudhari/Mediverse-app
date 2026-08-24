# Content Parity Audit
Generated: 2026-08-24T18:00:09.649Z

## Source inventory
- TS content subject folders: **86**
- Distinct subject codes found across all Flyway seed migrations: **246**
- Migration files containing subject inserts: **128** / 185 total migrations
- docs/curriculum/*.md files (legacy, physiology-only): **60**

## V184 ingestion (TS -> DB ETL) coverage
- Lessons inserted by V184: **351**
- Content block type distribution (V184 only):
  - EXPLANATION: 351
  - CLINICAL_CASE: 347
- Average content blocks per lesson (V184 set): **1.99**

## Subjects present in TS but with NO matching subject-code insert anywhere in migrations
(code derived the same way V184 derives it: folder name upper-cased, first 10 chars)
- None — every TS subject folder has a corresponding DB subject code (likely all via V184).

## Total: 0 of 86 TS subjects unmatched in DB

## Interpretation
- If V184 covers all/most TS folders, the DB is NOT missing content — the gap is purely that the *frontend* reads from TS files instead of the API that already serves this same DB-ingested content.
- Any subjects listed as unmatched above need either a manual seed migration or a re-run of scripts/ingest-curriculum-to-db.js before they can be safely cut over.
- Content-block type distribution above shows how far lesson depth is from the 14-type vision (EXPLANATION-heavy skew expected).