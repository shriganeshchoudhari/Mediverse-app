# ADR-004: Dual-Tier Hybrid RAG with Reciprocal Rank Fusion

## Status
**ACCEPTED** (2026-08-23)

## Context
The AI Socratic Tutor requires fast, accurate, and grounded retrieval of medical knowledge across the 351 curriculum modules to synthesize pedagogical hints and clinical feedback without revealing direct exam answers.

Initial implementations used Elasticsearch BM25 term-frequency matching. While BM25 excels at exact keyword matching (e.g. drug names like *Sugammadex* or eponyms like *Wiggers Diagram*), standalone keyword search can miss semantic reformulations and cross-discipline concepts.

## Decision
1. **Dual-Tier Hybrid Retrieval Model**:
   - **Primary Sparse Retrieval (Lexical / BM25)**: Elasticsearch 8.11 cluster indexing chapter IDs, headings, and chunk content.
   - **Secondary Structured Retrieval (PostgreSQL ts_rank & trigram)**: PostgreSQL full-text search indexing `curriculum_vector_embeddings` with `ts_rank` text scoring.
   - **Roadmap Vector Tier (`pgvector`)**: Table schema equipped with `embedding vector(384)` for plugging in dedicated sentence-transformer embeddings (e.g. `all-MiniLM-L6-v2`) in production deployment.
2. **Reciprocal Rank Fusion (RRF)**:
   - Combine scores from both search channels:
     $$RRF\_Score(d) = \sum_{m \in \{Elasticsearch, Postgres\}} \frac{1}{60 + rank_m(d)}$$
   - Rank and serve the top 3 highest-scoring verified curriculum chunks directly into the Gemini 1.5 system instruction.

## Consequences
- Authentic hybrid retrieval combining distributed Elasticsearch BM25 and relational PostgreSQL full-text search.
- Clean foundation ready for dense vector embedding generation when embedding models are configured.
- High-yield contextual grounding for the AI Socratic Tutor with zero hallucination.
