-- Migration: V164__seed_bvsc_year1_curriculum
-- Description: Seed Year 1 Subjects and Modules for BVSc

INSERT INTO subjects (id, semester_id, title, code, category)
VALUES
    ('80000000-0000-0000-0003-000000000001', '20000000-0000-0000-0002-000000000071', 'Veterinary Anatomy & Histology', 'VET-VAN', 'Pre-clinical'),
    ('80000000-0000-0000-0003-000000000002', '20000000-0000-0000-0002-000000000071', 'Veterinary Physiology & Biochemistry', 'VET-VPY', 'Pre-clinical'),
    ('80000000-0000-0000-0003-000000000003', '20000000-0000-0000-0002-000000000072', 'Livestock Production Management', 'VET-LPM', 'Para-clinical')
ON CONFLICT (id) DO NOTHING;

-- Units
INSERT INTO units (id, subject_id, title, sort_order)
VALUES
    ('80000000-0000-0000-0004-000000000001', '80000000-0000-0000-0003-000000000001', 'General Anatomy', 1),
    ('80000000-0000-0000-0004-000000000002', '80000000-0000-0000-0003-000000000002', 'General Physiology', 1),
    ('80000000-0000-0000-0004-000000000003', '80000000-0000-0000-0003-000000000003', 'Animal Housing', 1)
ON CONFLICT (id) DO NOTHING;

-- Chapters
INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES
    ('80000000-0000-0000-0005-000000000001', '80000000-0000-0000-0004-000000000001', 'Osteology', 1),
    ('80000000-0000-0000-0005-000000000002', '80000000-0000-0000-0004-000000000002', 'Blood Physiology', 1),
    ('80000000-0000-0000-0005-000000000003', '80000000-0000-0000-0004-000000000003', 'Dairy Cattle Management', 1)
ON CONFLICT (id) DO NOTHING;

-- Topics
INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES
    ('80000000-0000-0000-0006-000000000001', '80000000-0000-0000-0005-000000000001', 'Bovine Skull', 1),
    ('80000000-0000-0000-0006-000000000002', '80000000-0000-0000-0005-000000000002', 'Erythrocytes', 1),
    ('80000000-0000-0000-0006-000000000003', '80000000-0000-0000-0005-000000000003', 'Calf Rearing', 1)
ON CONFLICT (id) DO NOTHING;

-- Concepts
INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES
    ('80000000-0000-0000-0007-000000000001', '80000000-0000-0000-0006-000000000001', 'Bones of Bovine Cranium', 1),
    ('80000000-0000-0000-0007-000000000002', '80000000-0000-0000-0006-000000000002', 'Hemoglobin Synthesis', 1),
    ('80000000-0000-0000-0007-000000000003', '80000000-0000-0000-0006-000000000003', 'Colostrum Feeding', 1)
ON CONFLICT (id) DO NOTHING;

-- Learning Objects
INSERT INTO learning_objects (id, concept_id, object_type, content_payload, sort_order)
VALUES
    ('80000000-0000-0000-0008-000000000001', '80000000-0000-0000-0007-000000000001', 'text', '{"text": "Frontal, Parietal, Interparietal bones of cattle."}', 1),
    ('80000000-0000-0000-0008-000000000002', '80000000-0000-0000-0007-000000000002', 'text', '{"text": "Iron metabolism and porphyrin ring synthesis."}', 1),
    ('80000000-0000-0000-0008-000000000003', '80000000-0000-0000-0007-000000000003', 'text', '{"text": "Importance of Ig transfer in first 24 hours."}', 1)
ON CONFLICT (id) DO NOTHING;
