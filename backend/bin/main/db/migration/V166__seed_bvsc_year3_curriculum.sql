-- Migration: V166__seed_bvsc_year3_curriculum
-- Description: Seed Year 3 Subjects and Modules for BVSc

INSERT INTO subjects (id, semester_id, title, code, category)
VALUES
    ('80000000-0000-0000-0003-000000000007', '20000000-0000-0000-0002-000000000075', 'Veterinary Pharmacology & Toxicology', 'VET-VPT', 'Para-clinical'),
    ('80000000-0000-0000-0003-000000000008', '20000000-0000-0000-0002-000000000075', 'Animal Nutrition & Feed Technology', 'VET-ANN', 'Para-clinical'),
    ('80000000-0000-0000-0003-000000000009', '20000000-0000-0000-0002-000000000076', 'Veterinary Gynaecology & Obstetrics', 'VET-VGO', 'Clinical')
ON CONFLICT (id) DO NOTHING;

-- Units
INSERT INTO units (id, subject_id, title, sort_order)
VALUES
    ('80000000-0000-0000-0004-000000000007', '80000000-0000-0000-0003-000000000007', 'General Pharmacology', 1),
    ('80000000-0000-0000-0004-000000000008', '80000000-0000-0000-0003-000000000008', 'Ruminant Nutrition', 1),
    ('80000000-0000-0000-0004-000000000009', '80000000-0000-0000-0003-000000000009', 'Veterinary Gynaecology', 1)
ON CONFLICT (id) DO NOTHING;

-- Chapters
INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES
    ('80000000-0000-0000-0005-000000000007', '80000000-0000-0000-0004-000000000007', 'Pharmacokinetics', 1),
    ('80000000-0000-0000-0005-000000000008', '80000000-0000-0000-0004-000000000008', 'Energy Metabolism', 1),
    ('80000000-0000-0000-0005-000000000009', '80000000-0000-0000-0004-000000000009', 'Estrous Cycle', 1)
ON CONFLICT (id) DO NOTHING;

-- Topics
INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES
    ('80000000-0000-0000-0006-000000000007', '80000000-0000-0000-0005-000000000007', 'Drug Absorption', 1),
    ('80000000-0000-0000-0006-000000000008', '80000000-0000-0000-0005-000000000008', 'Volatile Fatty Acids', 1),
    ('80000000-0000-0000-0006-000000000009', '80000000-0000-0000-0005-000000000009', 'Bovine Estrous Cycle', 1)
ON CONFLICT (id) DO NOTHING;

-- Concepts
INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES
    ('80000000-0000-0000-0007-000000000007', '80000000-0000-0000-0006-000000000007', 'Bioavailability', 1),
    ('80000000-0000-0000-0007-000000000008', '80000000-0000-0000-0006-000000000008', 'VFA Production in Rumen', 1),
    ('80000000-0000-0000-0007-000000000009', '80000000-0000-0000-0006-000000000009', 'Hormonal Regulation of Estrous', 1)
ON CONFLICT (id) DO NOTHING;

-- Learning Objects
INSERT INTO learning_objects (id, concept_id, object_type, content_payload, sort_order)
VALUES
    ('80000000-0000-0000-0008-000000000007', '80000000-0000-0000-0007-000000000007', 'text', '{"text": "Factors affecting drug bioavailability."}', 1),
    ('80000000-0000-0000-0008-000000000008', '80000000-0000-0000-0007-000000000008', 'text', '{"text": "Acetate, Propionate, and Butyrate."}', 1),
    ('80000000-0000-0000-0008-000000000009', '80000000-0000-0000-0007-000000000009', 'text', '{"text": "GnRH, FSH, LH, Estrogen, Progesterone."}', 1)
ON CONFLICT (id) DO NOTHING;
