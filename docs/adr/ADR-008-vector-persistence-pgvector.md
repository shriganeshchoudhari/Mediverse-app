# ADR-008: Adoption of PostgreSQL pgvector for Medical RAG Vector Persistence

```text
Status:      ACCEPTED
Date:        2026-08-29
Deciders:    AI Platform Architect, Data Architect, Principal Enterprise Architect
Context:     Mediverse requires dense vector similarity search to ground AI Socratic responses in medical textbooks.
```

---

## 1. Context & Problem Statement
The AI Socratic Tutor and Voice Patient Simulators require dense vector embeddings (1536-dim) to retrieve peer-reviewed medical textbook chunks. We evaluated standalone vector databases (Pinecone, Milvus, Qdrant, Weaviate) vs PostgreSQL `pgvector`.

## 2. Decision
We adopt **PostgreSQL 16 with the `pgvector` extension** using **HNSW (Hierarchical Navigable Small World)** indexes as our authoritative vector storage engine.

## 3. Rationale
- **Unified Relational + Vector Persistence:** Allows transactional joins between relational curriculum metadata (`subject`, `domain`, `yearOfStudy`) and vector embeddings in a single ACID query.
- **Operational Simplicity:** Eliminates dual-system synchronization lag, additional network hops, and operational overhead of a dedicated vector database cluster.
- **HNSW Performance:** Provides $< 10\text{ms}$ nearest-neighbor retrieval latencies at Mediverse scale ($< 5\text{M}$ chunks).

## 4. Consequences & Trade-Offs
- **Positive:** Single backup/restore pipeline via Aurora PostgreSQL; zero multi-database drift.
- **Negative:** Memory limits must be allocated carefully for HNSW graph indexes in PostgreSQL shared buffers.
