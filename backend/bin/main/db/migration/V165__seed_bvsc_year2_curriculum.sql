-- Migration: V165__seed_bvsc_year2_curriculum
-- Description: Seed Year 2 Subjects and Modules for BVSc

INSERT INTO subjects (id, semester_id, title, code, category)
VALUES
    ('80000000-0000-0000-0003-000000000004', '20000000-0000-0000-0002-000000000073', 'Veterinary Pathology & Oncology', 'VET-VPA', 'Para-clinical'),
    ('80000000-0000-0000-0003-000000000005', '20000000-0000-0000-0002-000000000073', 'Veterinary Microbiology & Immunology', 'VET-VMC', 'Para-clinical'),
    ('80000000-0000-0000-0003-000000000006', '20000000-0000-0000-0002-000000000074', 'Veterinary Parasitology & Vector Control', 'VET-VPR', 'Para-clinical')
ON CONFLICT (id) DO NOTHING;

-- Units
INSERT INTO units (id, subject_id, title, sort_order)
VALUES
    ('80000000-0000-0000-0004-000000000004', '80000000-0000-0000-0003-000000000004', 'General Pathology', 1),
    ('80000000-0000-0000-0004-000000000005', '80000000-0000-0000-0003-000000000005', 'General Microbiology', 1),
    ('80000000-0000-0000-0004-000000000006', '80000000-0000-0000-0003-000000000006', 'Helminthology', 1)
ON CONFLICT (id) DO NOTHING;

-- Chapters
INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES
    ('80000000-0000-0000-0005-000000000004', '80000000-0000-0000-0004-000000000004', 'Cellular Injury', 1),
    ('80000000-0000-0000-0005-000000000005', '80000000-0000-0000-0004-000000000005', 'Bacteriology', 1),
    ('80000000-0000-0000-0005-000000000006', '80000000-0000-0000-0004-000000000006', 'Nematodes', 1)
ON CONFLICT (id) DO NOTHING;

-- Topics
INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES
    ('80000000-0000-0000-0006-000000000004', '80000000-0000-0000-0005-000000000004', 'Necrosis', 1),
    ('80000000-0000-0000-0006-000000000005', '80000000-0000-0000-0005-000000000005', 'Staphylococcus', 1),
    ('80000000-0000-0000-0006-000000000006', '80000000-0000-0000-0005-000000000006', 'Haemonchus', 1)
ON CONFLICT (id) DO NOTHING;

-- Concepts
INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES
    ('80000000-0000-0000-0007-000000000004', '80000000-0000-0000-0006-000000000004', 'Types of Necrosis', 1),
    ('80000000-0000-0000-0007-000000000005', '80000000-0000-0000-0006-000000000005', 'Staph aureus Pathogenesis', 1),
    ('80000000-0000-0000-0007-000000000006', '80000000-0000-0000-0006-000000000006', 'Life Cycle of H. contortus', 1)
ON CONFLICT (id) DO NOTHING;

-- Learning Objects
INSERT INTO learning_objects (id, concept_id, object_type, content_payload, sort_order)
VALUES
    ('80000000-0000-0000-0008-000000000004', '80000000-0000-0000-0007-000000000004', 'text', '{"text": "Coagulative, Liquefactive, Caseous necrosis."}', 1),
    ('80000000-0000-0000-0008-000000000005', '80000000-0000-0000-0007-000000000005', 'text', '{"text": "Mastitis in bovines caused by Staph aureus."}', 1),
    ('80000000-0000-0000-0008-000000000006', '80000000-0000-0000-0007-000000000006', 'text', '{"text": "Barber pole worm life cycle and anemia in sheep."}', 1)
ON CONFLICT (id) DO NOTHING;
