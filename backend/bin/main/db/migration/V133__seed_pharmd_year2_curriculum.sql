-- V133__seed_pharmd_year2_curriculum.sql

-- 1. Insert Subjects
INSERT INTO subjects (id, semester_id, title, code, category)
VALUES
    ('40000000-0000-0000-0003-000000000004', '20000000-0000-0000-0002-000000000023', 'Pharmacology-I: General PK/PD, Autonomic & CNS Drugs', 'PHARM-PCOL1', 'PHARMACOLOGY'),
    ('40000000-0000-0000-0003-000000000005', '20000000-0000-0000-0002-000000000023', 'Pharmaceutical Organic & Medicinal Chemistry', 'PHARM-CHEM', 'PHARMACEUTICAL_CHEMISTRY'),
    ('40000000-0000-0000-0003-000000000006', '20000000-0000-0000-0002-000000000024', 'Pharmaceutical Microbiology & Immunology', 'PHARM-MIC', 'MICROBIOLOGY')
ON CONFLICT (id) DO NOTHING;

-- 2. Insert Units
INSERT INTO units (id, subject_id, title, sort_order)
VALUES
    ('40000000-0000-0000-0004-000000000004', '40000000-0000-0000-0003-000000000004', 'General Pharmacology', 1),
    ('40000000-0000-0000-0004-000000000005', '40000000-0000-0000-0003-000000000005', 'Organic Chemistry Basics', 1),
    ('40000000-0000-0000-0004-000000000006', '40000000-0000-0000-0003-000000000006', 'Basic Microbiology', 1)
ON CONFLICT (id) DO NOTHING;

-- 3. Insert Chapters
INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES
    ('40000000-0000-0000-0005-000000000004', '40000000-0000-0000-0004-000000000004', 'Pharmacokinetics', 1),
    ('40000000-0000-0000-0005-000000000005', '40000000-0000-0000-0004-000000000005', 'Stereochemistry', 1),
    ('40000000-0000-0000-0005-000000000006', '40000000-0000-0000-0004-000000000006', 'Bacteria', 1)
ON CONFLICT (id) DO NOTHING;

-- 4. Insert Topics
INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES
    ('40000000-0000-0000-0006-000000000004', '40000000-0000-0000-0005-000000000004', 'Absorption', 1),
    ('40000000-0000-0000-0006-000000000005', '40000000-0000-0000-0005-000000000005', 'Isomerism', 1),
    ('40000000-0000-0000-0006-000000000006', '40000000-0000-0000-0005-000000000006', 'Gram Staining', 1)
ON CONFLICT (id) DO NOTHING;

-- 5. Insert Concepts
INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES
    ('40000000-0000-0000-0007-000000000004', '40000000-0000-0000-0006-000000000004', 'Bioavailability', 1),
    ('40000000-0000-0000-0007-000000000005', '40000000-0000-0000-0006-000000000005', 'Enantiomers', 1),
    ('40000000-0000-0000-0007-000000000006', '40000000-0000-0000-0006-000000000006', 'Gram Positive vs Negative', 1)
ON CONFLICT (id) DO NOTHING;

-- 6. Insert Learning Objects
INSERT INTO learning_objects (id, concept_id, object_type, content_payload, sort_order)
VALUES
    ('40000000-0000-0000-0008-000000000004', '40000000-0000-0000-0007-000000000004', 'TEXT', 'Bioavailability is the fraction of administered drug that reaches systemic circulation.', 1),
    ('40000000-0000-0000-0008-000000000005', '40000000-0000-0000-0007-000000000005', 'TEXT', 'Enantiomers are non-superimposable mirror images.', 1),
    ('40000000-0000-0000-0008-000000000006', '40000000-0000-0000-0007-000000000006', 'TEXT', 'Difference in cell wall structure between gram positive and negative bacteria.', 1)
ON CONFLICT (id) DO NOTHING;
