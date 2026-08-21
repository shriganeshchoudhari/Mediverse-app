-- V161__link_allied_domain_and_stats.sql

-- Ensure all allied health programs are linked to the correct domain
UPDATE programs 
SET healthcare_domain = 'ALLIED', domain_tier = 2 
WHERE code IN ('BSCPERF', 'BSCRIT', 'BSCOTT', 'BSCDIAL');

-- You could also add any specific domain properties or flags needed for ALLIED health here
