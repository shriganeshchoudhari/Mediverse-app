-- Migration: V168__seed_vci_competency_mapping
-- Description: Creates vci_competency_mapping table and seeds 30+ competencies

CREATE TABLE IF NOT EXISTS vci_competency_mapping (
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

INSERT INTO vci_competency_mapping (code, subject_code, domain, title, competency_level)
VALUES
    ('VCI-VAN-1', 'VET-VAN', 'Gross Anatomy', 'Identify and describe bones of domestic animals', 'KNOWS_HOW'),
    ('VCI-VAN-2', 'VET-VAN', 'Gross Anatomy', 'Describe the anatomy of digestive system', 'KNOWS_HOW'),
    ('VCI-VPY-1', 'VET-VPY', 'Physiology', 'Explain the physiological functions of blood', 'KNOWS'),
    ('VCI-VPY-2', 'VET-VPY', 'Physiology', 'Understand neuro-muscular physiology', 'KNOWS'),
    ('VCI-LPM-1', 'VET-LPM', 'Management', 'Demonstrate restraint of livestock', 'SHOWS_HOW'),
    ('VCI-LPM-2', 'VET-LPM', 'Management', 'Identify breeds of cattle and buffalo', 'KNOWS_HOW'),
    ('VCI-VPA-1', 'VET-VPA', 'Pathology', 'Perform post-mortem examination', 'PERFORMS'),
    ('VCI-VPA-2', 'VET-VPA', 'Pathology', 'Identify gross pathological lesions', 'SHOWS_HOW'),
    ('VCI-VMC-1', 'VET-VMC', 'Microbiology', 'Perform Gram staining', 'PERFORMS'),
    ('VCI-VMC-2', 'VET-VMC', 'Microbiology', 'Isolate and identify common pathogenic bacteria', 'SHOWS_HOW'),
    ('VCI-VPR-1', 'VET-VPR', 'Parasitology', 'Identify common helminth eggs in feces', 'SHOWS_HOW'),
    ('VCI-VPR-2', 'VET-VPR', 'Parasitology', 'Perform skin scraping examination', 'PERFORMS'),
    ('VCI-VPT-1', 'VET-VPT', 'Pharmacology', 'Calculate drug dosages', 'PERFORMS'),
    ('VCI-VPT-2', 'VET-VPT', 'Pharmacology', 'Write veterinary prescriptions', 'PERFORMS'),
    ('VCI-ANN-1', 'VET-ANN', 'Nutrition', 'Formulate balanced ration for dairy cattle', 'SHOWS_HOW'),
    ('VCI-ANN-2', 'VET-ANN', 'Nutrition', 'Identify common feed ingredients', 'KNOWS_HOW'),
    ('VCI-VGO-1', 'VET-VGO', 'Gynaecology', 'Diagnose pregnancy in bovines', 'PERFORMS'),
    ('VCI-VGO-2', 'VET-VGO', 'Gynaecology', 'Manage dystocia in large animals', 'SHOWS_HOW'),
    ('VCI-VCM-1', 'VET-VCM', 'Medicine', 'Perform general clinical examination', 'PERFORMS'),
    ('VCI-VCM-2', 'VET-VCM', 'Medicine', 'Diagnose and treat mastitis', 'SHOWS_HOW'),
    ('VCI-VCM-3', 'VET-VCM', 'Medicine', 'Diagnose metabolic diseases', 'SHOWS_HOW'),
    ('VCI-VCM-4', 'VET-VCM', 'Medicine', 'Manage colic in horses', 'KNOWS_HOW'),
    ('VCI-VCM-5', 'VET-VCM', 'Medicine', 'Treat canine parvovirus infection', 'SHOWS_HOW'),
    ('VCI-VSR-1', 'VET-VSR', 'Surgery', 'Administer local anesthesia', 'PERFORMS'),
    ('VCI-VSR-2', 'VET-VSR', 'Surgery', 'Perform ovariohysterectomy in dogs', 'SHOWS_HOW'),
    ('VCI-VSR-3', 'VET-VSR', 'Surgery', 'Suture superficial wounds', 'PERFORMS'),
    ('VCI-VSR-4', 'VET-VSR', 'Surgery', 'Interpret normal radiographs', 'SHOWS_HOW'),
    ('VCI-VSR-5', 'VET-VSR', 'Surgery', 'Manage fractures using external coaptation', 'SHOWS_HOW'),
    ('VCI-VAH-1', 'VET-VAH', 'Public Health', 'Investigate rabies outbreak', 'KNOWS_HOW'),
    ('VCI-VAH-2', 'VET-VAH', 'Public Health', 'Perform meat inspection', 'SHOWS_HOW'),
    ('VCI-VAH-3', 'VET-VAH', 'Public Health', 'Implement zoonotic disease control measures', 'KNOWS_HOW')
ON CONFLICT (code) DO NOTHING;
