-- Migration: V167__seed_bvsc_year4_curriculum
-- Description: Seed Year 4 Subjects and Modules for BVSc

INSERT INTO subjects (id, semester_id, title, code, category)
VALUES
    ('80000000-0000-0000-0003-000000000010', '20000000-0000-0000-0002-000000000077', 'Veterinary Clinical Medicine', 'VET-VCM', 'Clinical'),
    ('80000000-0000-0000-0003-000000000011', '20000000-0000-0000-0002-000000000077', 'Veterinary Surgery & Radiology', 'VET-VSR', 'Clinical'),
    ('80000000-0000-0000-0003-000000000012', '20000000-0000-0000-0002-000000000078', 'Veterinary Public Health & One Health', 'VET-VAH', 'Clinical')
ON CONFLICT (id) DO NOTHING;

-- Units
INSERT INTO units (id, subject_id, title, sort_order)
VALUES
    ('80000000-0000-0000-0004-000000000010', '80000000-0000-0000-0003-000000000010', 'General Systemic Medicine', 1),
    ('80000000-0000-0000-0004-000000000011', '80000000-0000-0000-0003-000000000011', 'General Surgery', 1),
    ('80000000-0000-0000-0004-000000000012', '80000000-0000-0000-0003-000000000012', 'Zoonoses', 1)
ON CONFLICT (id) DO NOTHING;

-- Chapters
INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES
    ('80000000-0000-0000-0005-000000000010', '80000000-0000-0000-0004-000000000010', 'Respiratory System Diseases', 1),
    ('80000000-0000-0000-0005-000000000011', '80000000-0000-0000-0004-000000000011', 'Anesthesia', 1),
    ('80000000-0000-0000-0005-000000000012', '80000000-0000-0000-0004-000000000012', 'Bacterial Zoonoses', 1)
ON CONFLICT (id) DO NOTHING;

-- Topics
INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES
    ('80000000-0000-0000-0006-000000000010', '80000000-0000-0000-0005-000000000010', 'Bovine Respiratory Disease Complex', 1),
    ('80000000-0000-0000-0006-000000000011', '80000000-0000-0000-0005-000000000011', 'Preanesthetic Medication', 1),
    ('80000000-0000-0000-0006-000000000012', '80000000-0000-0000-0005-000000000012', 'Brucellosis', 1)
ON CONFLICT (id) DO NOTHING;

-- Concepts
INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES
    ('80000000-0000-0000-0007-000000000010', '80000000-0000-0000-0006-000000000010', 'Etiology and Pathogenesis of BRD', 1),
    ('80000000-0000-0000-0007-000000000011', '80000000-0000-0000-0006-000000000011', 'Anticholinergics and Tranquilizers', 1),
    ('80000000-0000-0000-0007-000000000012', '80000000-0000-0000-0006-000000000012', 'Brucella abortus Public Health Significance', 1)
ON CONFLICT (id) DO NOTHING;

-- Learning Objects
INSERT INTO learning_objects (id, concept_id, object_type, content_payload, sort_order)
VALUES
    ('80000000-0000-0000-0008-000000000010', '80000000-0000-0000-0007-000000000010', 'text', '{"text": "Viral and bacterial components of BRD."}', 1),
    ('80000000-0000-0000-0008-000000000011', '80000000-0000-0000-0007-000000000011', 'text', '{"text": "Atropine, Xylazine, Acepromazine usage."}', 1),
    ('80000000-0000-0000-0008-000000000012', '80000000-0000-0000-0007-000000000012', 'text', '{"text": "Undulant fever in humans, prevention."}', 1)
ON CONFLICT (id) DO NOTHING;
