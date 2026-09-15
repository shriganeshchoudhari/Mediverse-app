-- V203: Add GIN index for full-text search on curriculum_vector_embeddings.
--
-- Previously searchPostgresFullTextRanked() computed to_tsvector() at runtime on every row,
-- causing a sequential scan with per-row text parsing. This migration adds a GENERATED STORED
-- tsvector column so that tsvector is pre-computed at insert/update time, and a GIN index
-- on that column for fast full-text lookups via the @@ operator.
--
-- After this migration, the repository query must be updated to use:
--   WHERE content_tsv @@ plainto_tsquery('english', :keyword)
--   ORDER BY ts_rank(content_tsv, plainto_tsquery('english', :keyword)) DESC
--
-- This eliminates the ILIKE '%keyword%' fallback (non-sargable) and removes the
-- runtime to_tsvector() call from the query plan.

-- Step 1: Add the generated stored tsvector column
ALTER TABLE curriculum_vector_embeddings
    ADD COLUMN IF NOT EXISTS content_tsv tsvector
        GENERATED ALWAYS AS (
            to_tsvector('english',
                COALESCE(chunk_text, '') || ' ' || COALESCE(heading, '')
            )
        ) STORED;

-- Step 2: Create GIN index on the generated column (CONCURRENTLY avoids table lock)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_curriculum_vectors_gin
    ON curriculum_vector_embeddings
    USING gin(content_tsv);
