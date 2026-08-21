-- Migration: V170__link_veterinary_domain_and_stats
-- Description: Update programs table healthcare domain mappings for Veterinary and refresh stats view

UPDATE programs
SET healthcare_domain = 'VETERINARY', domain_tier = 3
WHERE code IN ('BVSC', 'MVSC');

CREATE OR REPLACE VIEW healthcare_domain_curriculum_stats AS
SELECT 
    p.healthcare_domain,
    p.domain_tier,
    COUNT(DISTINCT p.id) as total_programs,
    COUNT(DISTINCT c.id) as total_curricula,
    COUNT(DISTINCT s.id) as total_subjects
FROM programs p
LEFT JOIN curricula c ON c.program_id = p.id
LEFT JOIN curriculum_years cy ON cy.curriculum_id = c.id
LEFT JOIN semesters sem ON sem.year_id = cy.id
LEFT JOIN subjects s ON s.semester_id = sem.id
GROUP BY p.healthcare_domain, p.domain_tier;
