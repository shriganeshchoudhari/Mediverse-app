-- V146__link_nursing_domain_and_stats.sql

UPDATE programs SET healthcare_domain = 'NURSING', domain_tier = 2 WHERE code IN ('BSCNURSING', 'MSCNURSING');

-- Optionally refresh a materialized view if healthcare_domain_curriculum_stats is materialized
-- REFRESH MATERIALIZED VIEW healthcare_domain_curriculum_stats;
-- Or if it's a regular view, it will automatically reflect the updated program domains.
