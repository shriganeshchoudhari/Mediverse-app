-- V197: Demote generic templated content blocks to DRAFT and enable new clinical content modalities

-- 1. Ensure status column exists on content_blocks
ALTER TABLE content_blocks ADD COLUMN IF NOT EXISTS status VARCHAR(50) NOT NULL DEFAULT 'PUBLISHED';
ALTER TABLE content_blocks ADD COLUMN IF NOT EXISTS review_notes TEXT;
CREATE INDEX IF NOT EXISTS idx_content_blocks_status ON content_blocks(status);
CREATE INDEX IF NOT EXISTS idx_content_blocks_type ON content_blocks(type);

-- 2. Demote all templated/placeholder QUIZ and FLASHCARD blocks from V187 to 'DRAFT' status
-- These will not be shown to students until regenerated or approved by faculty
UPDATE content_blocks
SET status = 'DRAFT',
    review_notes = 'Demoted by V197: Templated placeholder content requires grounded regeneration against source lesson text.'
WHERE type IN ('QUIZ', 'FLASHCARD', 'FLASHCARD_SET')
  AND (
    metadata::text LIKE '%Unrelated normal physiological baseline%'
    OR metadata::text LIKE '%Characteristic clinical, physiological%'
    OR metadata::text LIKE '%Immediate exploratory intervention without diagnostic confirmation%'
  );

-- 3. Register content type metadata descriptor comment for new clinical modalities
COMMENT ON COLUMN content_blocks.type IS 'Allowed types: EXPLANATION, SUMMARY, DIAGRAM, THREE_D, ANIMATION, FLOWCHART, VIDEO, QUIZ, FLASHCARD_SET, CLINICAL_CASE, RX_CARD, DECISION_TREE, SPOTTER_STATION, MNEMONIC, VIVA_VOICE';
