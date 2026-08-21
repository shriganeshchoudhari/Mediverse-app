-- V179: Add enrolled_program and healthcare_domain columns to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS enrolled_program VARCHAR(50);
ALTER TABLE users ADD COLUMN IF NOT EXISTS healthcare_domain VARCHAR(50);

COMMENT ON COLUMN users.enrolled_program IS 'Program code student is enrolled in, e.g. MBBS, BDS, BAMS, PHARMD, BSCNURSING, BPT, BVSC, MPH';
COMMENT ON COLUMN users.healthcare_domain IS 'Healthcare domain, e.g. ALLOPATHIC, DENTAL, AYUSH, PHARMACY, NURSING, PHYSIOTHERAPY, ALLIED, VETERINARY, PUBLIC_HEALTH';
