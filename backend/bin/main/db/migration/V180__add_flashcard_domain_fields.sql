-- V180: Add domain and program_code columns to flashcards for multi-domain filtering
ALTER TABLE flashcards ADD COLUMN IF NOT EXISTS domain VARCHAR(50);
ALTER TABLE flashcards ADD COLUMN IF NOT EXISTS program_code VARCHAR(50);

COMMENT ON COLUMN flashcards.domain IS 'Healthcare domain this flashcard belongs to, e.g. ALLOPATHIC, DENTAL, AYUSH';
COMMENT ON COLUMN flashcards.program_code IS 'Program code, e.g. MBBS, BDS, BAMS';

CREATE INDEX IF NOT EXISTS idx_flashcards_domain ON flashcards(domain);
CREATE INDEX IF NOT EXISTS idx_flashcards_program_code ON flashcards(program_code);
