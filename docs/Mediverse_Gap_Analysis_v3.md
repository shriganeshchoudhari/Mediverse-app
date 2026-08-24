# Mediverse-app - Deep-Dive Gap Analysis (v3)
*Generated: 2026-08-24*

This v3 analysis follows the successful completion of the V2 remediation plan. The core architectural gaps (routing sprawl, dual-source-of-truth, CMS disconnect) are now 100% resolved. The platform operates on a strictly API-driven paradigm.

However, a new deep-dive into the codebase reveals the following remaining strategic and functional gaps.

---

## 1. AI RAG Pipeline & Vector Search Gap (Phase 5 Incomplete)
While the `pgvector` schema (`vector(384)`) is provisioned and the JPA native SQL queries for Cosine Similarity (`<=>`) are written, **there is no runtime service to actually generate these embeddings**.
- **The Gap**: The backend `RagService` currently falls back to basic PostgreSQL `ts_vector` full-text search because `CurriculumVectorEmbedding.embedding` is never populated. 
- **The Fix**: Integrate the `text-embedding-004` Gemini API into a new `EmbeddingService.java`. We need to intercept Lesson creation/updates, convert the content into 384-dimensional vectors, and store them in the `curriculum_vector_embeddings` table.

## 2. PWA (Progressive Web App) Offline Support Gap
The `ROADMAP.md` claims "Implement Progressive Web App (PWA) configurations for offline capability" is checked off. 
- **The Gap**: A scan of the frontend `package.json` and `next.config.js` reveals NO standard PWA implementation (e.g., `next-pwa`, `serwist`, or custom service workers). 
- **The Fix**: Implement a Service Worker to cache the static Next.js assets and key API payloads, accompanied by a `manifest.json` for installability.

## 3. Automated Testing Deficit
The user-provided `Mediverse_UI_Test_Suite_Plan.xlsx` describes comprehensive UI test requirements. 
- **The Gap**: Aside from ~60 unit/e2e test files spread across the `frontend/__tests__` directory, a massive portion of the newly built features (CMS Authoring Modal, AI Generators, API-driven dynamic routes) lack integration test coverage. 
- **The Fix**: Setup Playwright (or Cypress) for true browser-based End-to-End testing to validate the new `/cms/editor` workflow and the dynamic `/healthcare/[domain]/[program]/[subject]` routing.

## 4. Legacy "Dead Code" TS Content
The V184 migration successfully ported all 86 static TypeScript content folders into the Postgres database. The frontend was then successfully rewired to consume this DB via API.
- **The Gap**: The old 86 TS folders are still sitting in `frontend/lib/curriculum/content/`, bloatng the repository and IDE search results. 
- **The Fix**: Recursively delete `frontend/lib/curriculum/content/` to finalize the migration and permanently enforce the DB as the single source of truth.

---

### Recommended Next Steps
1. **Immediate**: Delete the legacy TS content folders (Gap 4) - this is a 2-minute cleanup.
2. **High Priority**: Build the `EmbeddingService.java` to fulfill the `pgvector` RAG pipeline (Gap 1). This is the last feature blocking true "AI Engine" maturity.
3. **Medium Priority**: Implement the PWA Service Worker (Gap 2) to validate the Roadmap claim.
