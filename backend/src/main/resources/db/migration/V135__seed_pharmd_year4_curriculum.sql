-- V135__seed_pharmd_year4_curriculum.sql

-- 1. Insert Subjects
INSERT INTO subjects (id, semester_id, title, code, category)
VALUES
    ('40000000-0000-0000-0003-000000000010', '20000000-0000-0000-0002-000000000027', 'Pharmacotherapeutics-II: Infectious Diseases, Oncology', 'PHARM-PAT2', 'PHARMACOTHERAPEUTICS'),
    ('40000000-0000-0000-0003-000000000011', '20000000-0000-0000-0002-000000000027', 'Clinical Pharmacy & Ward Rounds', 'PHARM-CP', 'CLINICAL_PHARMACY'),
    ('40000000-0000-0000-0003-000000000012', '20000000-0000-0000-0002-000000000028', 'Biopharmaceutics & Pharmacokinetics', 'PHARM-BJ', 'BIOPHARMACEUTICS')
ON CONFLICT (id) DO NOTHING;

-- 2. Insert Units
INSERT INTO units (id, subject_id, title, sort_order)
VALUES
    ('40000000-0000-0000-0004-000000000010', '40000000-0000-0000-0003-000000000010', 'Infectious Diseases', 1),
    ('40000000-0000-0000-0004-000000000011', '40000000-0000-0000-0003-000000000011', 'Ward Round Participation', 1),
    ('40000000-0000-0000-0004-000000000012', '40000000-0000-0000-0003-000000000012', 'Compartment Models', 1)
ON CONFLICT (id) DO NOTHING;

-- 3. Insert Chapters
INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES
    ('40000000-0000-0000-0005-000000000010', '40000000-0000-0000-0004-000000000010', 'Pneumonia', 1),
    ('40000000-0000-0000-0005-000000000011', '40000000-0000-0000-0004-000000000011', 'Medication History', 1),
    ('40000000-0000-0000-0005-000000000012', '40000000-0000-0000-0004-000000000012', 'One-Compartment Open Model', 1)
ON CONFLICT (id) DO NOTHING;

-- 4. Insert Topics
INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES
    ('40000000-0000-0000-0006-000000000010', '40000000-0000-0000-0005-000000000010', 'CAP vs HAP', 1),
    ('40000000-0000-0000-0006-000000000011', '40000000-0000-0000-0005-000000000011', 'Patient Interview', 1),
    ('40000000-0000-0000-0006-000000000012', '40000000-0000-0000-0005-000000000012', 'IV Bolus', 1)
ON CONFLICT (id) DO NOTHING;

-- 5. Insert Concepts
INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES
    ('40000000-0000-0000-0007-000000000010', '40000000-0000-0000-0006-000000000010', 'Empiric Therapy', 1),
    ('40000000-0000-0000-0007-000000000011', '40000000-0000-0000-0006-000000000011', 'Reconciliation', 1),
    ('40000000-0000-0000-0007-000000000012', '40000000-0000-0000-0006-000000000012', 'Elimination Rate Constant', 1)
ON CONFLICT (id) DO NOTHING;

-- 6. Insert Learning Objects
INSERT INTO learning_objects (id, concept_id, object_type, content_payload, sort_order)
VALUES
    ('40000000-0000-0000-0008-000000000010', '40000000-0000-0000-0007-000000000010', 'TEXT', 'Empiric therapy covers the most likely pathogens.', 1),
    ('40000000-0000-0000-0008-000000000011', '40000000-0000-0000-0007-000000000011', 'TEXT', 'Medication reconciliation prevents drug errors at transitions of care.', 1),
    ('40000000-0000-0000-0008-000000000012', '40000000-0000-0000-0007-000000000012', 'TEXT', 'Ke is calculated from the slope of the log-linear concentration-time curve.', 1)
ON CONFLICT (id) DO NOTHING;
