-- V176__link_public_health_domain_and_stats.sql

UPDATE programs 
SET healthcare_domain = 'PUBLIC_HEALTH', domain_tier = 3 
WHERE code IN ('MPH', 'MHA');
