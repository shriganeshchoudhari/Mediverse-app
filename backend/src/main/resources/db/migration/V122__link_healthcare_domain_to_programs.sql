-- =============================================================================
-- Migration: V122__link_healthcare_domain_to_programs.sql
-- Description: Fixes GAP-C3 — links healthcare_domains table to programs table
--              via FK bridge and creates domain curriculum statistics view.
-- =============================================================================

-- 1. Ensure programs table has healthcare_domain column (defensive, V114 adds it)
ALTER TABLE programs ADD COLUMN IF NOT EXISTS healthcare_domain VARCHAR(50) DEFAULT 'ALLOPATHIC';
ALTER TABLE programs ADD COLUMN IF NOT EXISTS domain_tier INTEGER DEFAULT 1;

-- 2. Update all known program domain mappings
UPDATE programs SET healthcare_domain = 'ALLOPATHIC', domain_tier = 1 WHERE code = 'MBBS';
UPDATE programs SET healthcare_domain = 'DENTAL', domain_tier = 1 WHERE code = 'BDS';
UPDATE programs SET healthcare_domain = 'DENTAL', domain_tier = 1 WHERE code = 'MDS';
UPDATE programs SET healthcare_domain = 'AYUSH', domain_tier = 1 WHERE code = 'BAMS';

-- 3. Create domain curriculum statistics view (bridges healthcare_domains → programs → subjects → learning_objects)
CREATE OR REPLACE VIEW healthcare_domain_curriculum_stats AS
SELECT
    hd.id                                   AS domain_id,
    hd.name                                 AS domain_name,
    hd.tier                                 AS domain_tier,
    COUNT(DISTINCT p.id)                    AS program_count,
    COUNT(DISTINCT c.id)                    AS curriculum_count,
    COUNT(DISTINCT s.id)                    AS subject_count,
    COUNT(DISTINCT ch.id)                   AS chapter_count,
    COUNT(DISTINCT lo.id)                   AS lesson_count
FROM healthcare_domains hd
LEFT JOIN programs p
    ON UPPER(p.healthcare_domain) = UPPER(hd.id)
    AND p.is_active = TRUE
LEFT JOIN curricula c ON c.program_id = p.id
LEFT JOIN curriculum_years cy ON cy.curriculum_id = c.id
LEFT JOIN semesters sem ON sem.year_id = cy.id
LEFT JOIN subjects sub ON sub.semester_id = sem.id
LEFT JOIN units u ON u.subject_id = sub.id
LEFT JOIN chapters ch ON ch.unit_id = u.id
LEFT JOIN topics t ON t.chapter_id = ch.id
LEFT JOIN concepts con ON con.topic_id = t.id
LEFT JOIN learning_objects lo ON lo.concept_id = con.id
GROUP BY hd.id, hd.name, hd.tier;

-- 4. Update lesson_count in healthcare_domains from the view
UPDATE healthcare_domains hd
SET lesson_count = (
    SELECT COALESCE(s.lesson_count, 0)
    FROM healthcare_domain_curriculum_stats s
    WHERE s.domain_id = hd.id
)
WHERE EXISTS (
    SELECT 1 FROM healthcare_domain_curriculum_stats s WHERE s.domain_id = hd.id
);
