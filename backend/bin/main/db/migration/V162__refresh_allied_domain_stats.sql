-- V162__refresh_allied_domain_stats.sql

-- Assuming healthcare_domain_curriculum_stats is a materialized view
-- Or a normal view that gets recreated. Here we do a REFRESH MATERIALIZED VIEW
-- with a safe fallback if it's a regular view or doesn't exist yet, but typically 
-- flyway expects explicit statements. If it's a standard Mediverse pattern:

DO $$ 
BEGIN
  -- Refresh the materialized view for stats to reflect the newly inserted allied health data
  IF EXISTS (SELECT 1 FROM pg_matviews WHERE matviewname = 'healthcare_domain_curriculum_stats') THEN
    REFRESH MATERIALIZED VIEW healthcare_domain_curriculum_stats;
  END IF;
END $$;
