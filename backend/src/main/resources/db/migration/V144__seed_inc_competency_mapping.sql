-- V144__seed_inc_competency_mapping.sql

CREATE TABLE IF NOT EXISTS inc_competency_mapping (
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

INSERT INTO inc_competency_mapping (code, subject_code, domain, title, competency_level) VALUES
('INC-FON1-01', 'NURS-FON1', 'Basic Anatomy', 'Identify the structure of human body systems', 'KNOWS'),
('INC-FON2-01', 'NURS-FON2', 'Nursing Foundations', 'Perform comprehensive health assessment', 'PERFORMS'),
('INC-MSN1-01', 'NURS-MSN1', 'Medical Surgical', 'Provide care for respiratory patients', 'SHOWS_HOW'),
('INC-PHRM-01', 'NURS-PHARM', 'Pharmacology', 'Calculate drug dosages safely', 'PERFORMS'),
('INC-MSN2-01', 'NURS-MSN2', 'Critical Care', 'Assist with advanced life support', 'SHOWS_HOW'),
('INC-PED-01', 'NURS-PED', 'Pediatrics', 'Assess neonate immediately after birth', 'PERFORMS'),
('INC-MID-01', 'NURS-MID', 'Midwifery', 'Conduct normal delivery', 'PERFORMS'),
('INC-CHN-01', 'NURS-CHN', 'Community Health', 'Conduct community health survey', 'SHOWS_HOW'),
('INC-MGT-01', 'NURS-MGT', 'Nursing Management', 'Demonstrate ward management skills', 'SHOWS_HOW')
ON CONFLICT (code) DO NOTHING;
