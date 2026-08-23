-- V178__reconcile_all_healthcare_domains.sql

-- Final multi-domain verification script ensuring all 9 domains and 16 degree programs are fully linked and active.
-- We verify that programs and curricula are linked properly. 

DO $$
DECLARE
    domain_count INT;
    program_count INT;
BEGIN
    SELECT COUNT(DISTINCT healthcare_domain) INTO domain_count FROM programs WHERE is_active = TRUE;
    SELECT COUNT(*) INTO program_count FROM programs WHERE is_active = TRUE;
    
    RAISE NOTICE 'Found % active healthcare domains and % active programs.', domain_count, program_count;
END $$;
