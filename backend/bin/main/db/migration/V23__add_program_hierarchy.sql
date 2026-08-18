-- Phase 4: Multi-program scaling
-- Adds a Program layer above Curriculum so the platform can host
-- multiple degree programs (MBBS, BDS, Nursing, ...) on one codebase.

-- 1. Create Programs Table
CREATE TABLE programs (
    id UUID PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,       -- e.g. MBBS, BDS, BAMS, NURSING
    name VARCHAR(255) NOT NULL,             -- e.g. "Bachelor of Medicine and Bachelor of Surgery"
    description TEXT,
    duration_years INT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. Seed the existing program (backfill target for current curricula)
INSERT INTO programs (id, code, name, description, duration_years, is_active)
VALUES (
    gen_random_uuid(),
    'MBBS',
    'Bachelor of Medicine, Bachelor of Surgery',
    'Default program backfilled for pre-existing curricula.',
    5,
    TRUE
);

-- 3. Add program_id to curricula, backfill, then enforce NOT NULL
ALTER TABLE curricula ADD COLUMN program_id UUID REFERENCES programs(id);

UPDATE curricula
SET program_id = (SELECT id FROM programs WHERE code = 'MBBS')
WHERE program_id IS NULL;

ALTER TABLE curricula ALTER COLUMN program_id SET NOT NULL;

CREATE INDEX idx_curricula_program_id ON curricula(program_id);
