-- V185: Enable pgvector extension and curriculum vector embedding store

CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS curriculum_vector_embeddings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
    block_id UUID REFERENCES content_blocks(id) ON DELETE CASCADE,
    chunk_text TEXT NOT NULL,
    heading VARCHAR(255),
    domain VARCHAR(50) DEFAULT 'ALLOPATHIC',
    embedding vector(384),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_curriculum_vectors_domain ON curriculum_vector_embeddings(domain);
CREATE INDEX IF NOT EXISTS idx_curriculum_vectors_lesson ON curriculum_vector_embeddings(lesson_id);
