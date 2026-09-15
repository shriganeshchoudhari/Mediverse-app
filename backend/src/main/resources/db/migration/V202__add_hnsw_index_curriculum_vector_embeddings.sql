-- V202: Add HNSW index on curriculum_vector_embeddings for fast cosine similarity search.
--
-- Previously V192 was a placeholder (SELECT 1). This migration creates the actual index.
-- HNSW (Hierarchical Navigable Small World) reduces vector similarity search from O(N)
-- sequential scan to approximate O(log N), cutting latency from seconds to milliseconds.
--
-- Parameters:
--   m=16              — max connections per layer (default 16, good balance speed/recall)
--   ef_construction=64 — build-time search width (higher = better recall, slower build)
--
-- Uses CONCURRENTLY to avoid locking the table on a live database during deployment.
-- NOTE: CONCURRENTLY cannot run inside an explicit transaction block; Flyway runs this
-- migration outside a transaction (outOfOrder=true is already set).

SET statement_timeout = '0';
SET lock_timeout = '0';

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_curriculum_vectors_hnsw
    ON curriculum_vector_embeddings
    USING hnsw (embedding vector_cosine_ops)
    WITH (m = 16, ef_construction = 64);
