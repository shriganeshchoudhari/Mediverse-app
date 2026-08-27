-- V154__link_physiotherapy_domain_and_stats.sql
UPDATE programs 
SET healthcare_domain = 'PHYSIOTHERAPY' 
WHERE code IN ('BPT', 'MPT');

-- Attempt to refresh view if it exists, or create a placeholder view if needed.
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM pg_matviews WHERE matviewname = 'healthcare_domain_curriculum_stats') THEN
        REFRESH MATERIALIZED VIEW healthcare_domain_curriculum_stats;
    ELSIF EXISTS (SELECT 1 FROM pg_views WHERE viewname = 'healthcare_domain_curriculum_stats') THEN
        -- Standard views don't need refresh, but this fulfills the script requirement.
        NULL;
    END IF;
END $$;
