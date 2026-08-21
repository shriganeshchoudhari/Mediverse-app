-- V152__seed_iap_competency_mapping.sql
CREATE TABLE IF NOT EXISTS iap_competency_mapping (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(20) NOT NULL UNIQUE,
  subject_code VARCHAR(20) NOT NULL,
  domain VARCHAR(150) NOT NULL,
  title TEXT NOT NULL,
  competency_level VARCHAR(30) NOT NULL CHECK (competency_level IN ('KNOWS', 'KNOWS_HOW', 'SHOWS_HOW', 'PERFORMS')),
  vertical_integration TEXT[] DEFAULT '{}',
  horizontal_integration TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO iap_competency_mapping (code, subject_code, domain, title, competency_level) VALUES
('IAP-ANAT-01', 'PT-ANAT', 'Anatomy', 'Identify upper limb musculature', 'KNOWS_HOW'),
('IAP-BIO-01', 'PT-BIO', 'Biomechanics', 'Analyze gait cycle', 'SHOWS_HOW'),
('IAP-EXER-01', 'PT-EXER', 'Exercise Therapy', 'Perform passive ROM exercises', 'PERFORMS'),
('IAP-ELEC-01', 'PT-ELEC', 'Electrotherapy', 'Apply TENS safely', 'PERFORMS'),
('IAP-ORTHO-01', 'PT-ORTHO', 'Orthopedics', 'Assess ACL injury', 'SHOWS_HOW'),
('IAP-NEURO-01', 'PT-NEURO', 'Neurology', 'Evaluate stroke patient', 'SHOWS_HOW'),
('IAP-CARDIO-01', 'PT-CARDIO', 'Cardiopulmonary', 'Perform postural drainage', 'PERFORMS'),
('IAP-SPORTS-01', 'PT-SPORTS', 'Sports', 'Apply kinesiotape', 'PERFORMS')
ON CONFLICT(code) DO NOTHING;
