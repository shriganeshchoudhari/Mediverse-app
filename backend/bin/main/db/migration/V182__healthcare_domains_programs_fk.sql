-- V182: Add FK constraint from healthcare_domains to programs table
ALTER TABLE healthcare_domains ADD COLUMN IF NOT EXISTS primary_program_code VARCHAR(50);

-- Populate the mapping
UPDATE healthcare_domains SET primary_program_code = 'MBBS' WHERE id = 'allopathic';
UPDATE healthcare_domains SET primary_program_code = 'BDS'  WHERE id = 'dental';
UPDATE healthcare_domains SET primary_program_code = 'BAMS' WHERE id = 'ayush';
UPDATE healthcare_domains SET primary_program_code = 'PHARMD' WHERE id = 'pharmacy';
UPDATE healthcare_domains SET primary_program_code = 'BSCNURSING' WHERE id = 'nursing';
UPDATE healthcare_domains SET primary_program_code = 'BPT' WHERE id = 'physiotherapy';
UPDATE healthcare_domains SET primary_program_code = 'BSCPERF' WHERE id = 'allied';
UPDATE healthcare_domains SET primary_program_code = 'BVSC' WHERE id = 'veterinary';
UPDATE healthcare_domains SET primary_program_code = 'MPH' WHERE id = 'public-health';

-- Add FK constraint (deferred to handle any missing codes gracefully)
ALTER TABLE healthcare_domains
    ADD CONSTRAINT fk_hd_program
    FOREIGN KEY (primary_program_code)
    REFERENCES programs(code)
    ON DELETE SET NULL
    DEFERRABLE INITIALLY DEFERRED;

COMMENT ON COLUMN healthcare_domains.primary_program_code IS 'FK to programs.code — the flagship undergraduate program for this domain';
