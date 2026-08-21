-- V174__seed_public_health_competency_mapping.sql

CREATE TABLE IF NOT EXISTS public_health_competency_mapping (
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

INSERT INTO public_health_competency_mapping (code, subject_code, domain, title, competency_level) VALUES
('PH-COMP-01', 'PUB-EPI', 'Epidemiology', 'Understand study designs', 'KNOWS'),
('PH-COMP-02', 'PUB-EPI', 'Epidemiology', 'Conduct outbreak investigation', 'SHOWS_HOW'),
('PH-COMP-03', 'PUB-EPI', 'Epidemiology', 'Analyze surveillance data', 'PERFORMS'),
('PH-COMP-04', 'PUB-EPI', 'Epidemiology', 'Calculate risk ratios', 'KNOWS_HOW'),
('PH-COMP-05', 'PUB-EPI', 'Epidemiology', 'Design cohort study', 'SHOWS_HOW'),

('PH-COMP-06', 'PUB-BIO', 'Biostatistics', 'Calculate mean and standard deviation', 'KNOWS_HOW'),
('PH-COMP-07', 'PUB-BIO', 'Biostatistics', 'Perform t-test', 'PERFORMS'),
('PH-COMP-08', 'PUB-BIO', 'Biostatistics', 'Understand regression analysis', 'KNOWS'),
('PH-COMP-09', 'PUB-BIO', 'Biostatistics', 'Interpret survival curves', 'KNOWS_HOW'),
('PH-COMP-10', 'PUB-BIO', 'Biostatistics', 'Use statistical software', 'SHOWS_HOW'),

('PH-COMP-11', 'PUB-HSA', 'Health Systems', 'Describe health system building blocks', 'KNOWS'),
('PH-COMP-12', 'PUB-HSA', 'Health Systems', 'Analyze health policy impact', 'SHOWS_HOW'),
('PH-COMP-13', 'PUB-HSA', 'Health Systems', 'Understand Ayushman Bharat framework', 'KNOWS'),
('PH-COMP-14', 'PUB-HSA', 'Health Systems', 'Evaluate primary care delivery', 'KNOWS_HOW'),
('PH-COMP-15', 'PUB-HSA', 'Health Systems', 'Plan health intervention', 'PERFORMS'),

('PH-COMP-16', 'PUB-ECO', 'Health Economics', 'Explain opportunity cost', 'KNOWS'),
('PH-COMP-17', 'PUB-ECO', 'Health Economics', 'Conduct cost-effectiveness analysis', 'SHOWS_HOW'),
('PH-COMP-18', 'PUB-ECO', 'Health Economics', 'Understand health financing models', 'KNOWS'),
('PH-COMP-19', 'PUB-ECO', 'Health Economics', 'Analyze health budgets', 'KNOWS_HOW'),
('PH-COMP-20', 'PUB-ECO', 'Health Economics', 'Evaluate pricing strategies', 'PERFORMS'),

('PH-COMP-21', 'PUB-HOS', 'Hospital Operations', 'Understand hospital workflows', 'KNOWS'),
('PH-COMP-22', 'PUB-HOS', 'Hospital Operations', 'Implement quality improvement', 'SHOWS_HOW'),
('PH-COMP-23', 'PUB-HOS', 'Hospital Operations', 'Prepare for NABH accreditation', 'PERFORMS'),
('PH-COMP-24', 'PUB-HOS', 'Hospital Operations', 'Manage supply chain', 'KNOWS_HOW'),
('PH-COMP-25', 'PUB-HOS', 'Hospital Operations', 'Analyze patient satisfaction data', 'SHOWS_HOW'),

('PH-COMP-26', 'PUB-GLO', 'Global Health', 'Understand IHR 2005', 'KNOWS'),
('PH-COMP-27', 'PUB-GLO', 'Global Health', 'Plan disaster response', 'SHOWS_HOW'),
('PH-COMP-28', 'PUB-GLO', 'Global Health', 'Coordinate international relief', 'KNOWS_HOW'),
('PH-COMP-29', 'PUB-GLO', 'Global Health', 'Manage infectious disease outbreaks globally', 'PERFORMS'),
('PH-COMP-30', 'PUB-GLO', 'Global Health', 'Analyze global health trends', 'SHOWS_HOW')
ON CONFLICT (code) DO NOTHING;
