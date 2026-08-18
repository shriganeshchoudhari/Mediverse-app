-- 1. Seed Year 2 (2nd Professional) under Curriculum 'mbbs-cbme-2024' (ID: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d')
INSERT INTO curriculum_years (id, curriculum_id, year_number)
VALUES ('b3c4d5e6-f7a8-9b0c-1d2e-3f4a5b6c7d8e', 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 2)
ON CONFLICT DO NOTHING;

-- 2. Seed Semester 3 under Year 2
INSERT INTO semesters (id, year_id, semester_number)
VALUES ('c5d6e7f8-a9b0-1c2d-3e4f-5a6b7c8d9e0f', 'b3c4d5e6-f7a8-9b0c-1d2e-3f4a5b6c7d8e', 3)
ON CONFLICT DO NOTHING;

-- 3. Seed Semester 3 Subjects
-- Pathology
INSERT INTO subjects (id, semester_id, title, code, category)
VALUES ('f3a4b5c6-d7e8-9f0a-1b2c-3d4e5f6a7b8c', 'c5d6e7f8-a9b0-1c2d-3e4f-5a6b7c8d9e0f', 'Pathology', 'PATH-201', 'Para-Clinical')
ON CONFLICT DO NOTHING;

-- Pharmacology
INSERT INTO subjects (id, semester_id, title, code, category)
VALUES ('f4b5c6d7-e8f9-0a1b-2c3d-4e5f6a7b8c9d', 'c5d6e7f8-a9b0-1c2d-3e4f-5a6b7c8d9e0f', 'Pharmacology', 'PHARM-201', 'Para-Clinical')
ON CONFLICT DO NOTHING;

-- Microbiology
INSERT INTO subjects (id, semester_id, title, code, category)
VALUES ('f5c6d7e8-f9a0-1b2c-3d4e-5f6a7b8c9d0e', 'c5d6e7f8-a9b0-1c2d-3e4f-5a6b7c8d9e0f', 'Microbiology', 'MICRO-201', 'Para-Clinical')
ON CONFLICT DO NOTHING;

-- Forensic Medicine
INSERT INTO subjects (id, semester_id, title, code, category)
VALUES ('f6d7e8f9-a0b1-2c3d-4e5f-6a7b8c9d0e1f', 'c5d6e7f8-a9b0-1c2d-3e4f-5a6b7c8d9e0f', 'Forensic Medicine', 'FM-201', 'Para-Clinical')
ON CONFLICT DO NOTHING;

-- Community Medicine
INSERT INTO subjects (id, semester_id, title, code, category)
VALUES ('f7e8f9a0-b1c2-3d4e-5f6a-7b8c9d0e1f2a', 'c5d6e7f8-a9b0-1c2d-3e4f-5a6b7c8d9e0f', 'Community Medicine', 'CM-201', 'Clinical')
ON CONFLICT DO NOTHING;

-- Clinical postings
INSERT INTO subjects (id, semester_id, title, code, category)
VALUES ('f8f9a0b1-c2d3-4e5f-6a7b-8c9d0e1f2a3b', 'c5d6e7f8-a9b0-1c2d-3e4f-5a6b7c8d9e0f', 'Clinical postings', 'CLIN-201', 'Clinical')
ON CONFLICT DO NOTHING;

-- 4. Seed units & chapters for Pathology
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('e6f7a8b9-c0d1-2e3f-4a5b-6c7d8e9f0a1b', 'f3a4b5c6-d7e8-9f0a-1b2c-3d4e5f6a7b8c', 'General Pathology', 1)
ON CONFLICT DO NOTHING;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('f7a8b9c0-d1e2-3f4a-5b6c-7d8e9f0a1b2c', 'e6f7a8b9-c0d1-2e3f-4a5b-6c7d8e9f0a1b', 'Cell Injury & Adaptation', 1)
ON CONFLICT DO NOTHING;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('a8b9c0d1-e2f3-4a5b-6c7d-8e9f0a1b2c3d', 'f7a8b9c0-d1e2-3f4a-5b6c-7d8e9f0a1b2c', 'Reversible vs Irreversible Cell Injury', 1)
ON CONFLICT DO NOTHING;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('b9c0d1e2-f3a4-5b6c-7d8e-9f0a1b2c3d4e', 'a8b9c0d1-e2f3-4a5b-6c7d-8e9f0a1b2c3d', 'Necrosis vs Apoptosis Pathways', 1)
ON CONFLICT DO NOTHING;

INSERT INTO learning_objects (id, concept_id, object_type, content_payload, sort_order)
VALUES ('c0d1e2f3-a4b5-6c7d-8e9f-0a1b2c3d4e5f', 'b9c0d1e2-f3a4-5b6c-7d8e-9f0a1b2c3d4e', 'TEXT', '### Necrosis vs Apoptosis

In pathology, cellular death occurs via two primary pathways:

1. **Necrosis**: Always pathological cell death, characterized by cell swelling, membrane rupture, and inflammation.
2. **Apoptosis**: Programmed, energy-dependent cell death, characterized by cell shrinkage, intact membranes, and phagocytosis without inflammation.', 1)
ON CONFLICT DO NOTHING;

-- 5. Seed units & chapters for Pharmacology
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('e7f8a9b0-c1d2-3e4f-5a6b-7c8d9e0f1a2b', 'f4b5c6d7-e8f9-0a1b-2c3d-4e5f6a7b8c9d', 'General Pharmacology', 1)
ON CONFLICT DO NOTHING;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('f8a9b0c0-d2e3-4f5a-6b7c-8d9e0f1a2b3c', 'e7f8a9b0-c1d2-3e4f-5a6b-7c8d9e0f1a2b', 'Routes of Drug Administration', 1)
ON CONFLICT DO NOTHING;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('a9b0c0d1-e3f4-5a6b-7c8d-9e0f1a2b3c4d', 'f8a9b0c0-d2e3-4f5a-6b7c-8d9e0f1a2b3c', 'Enteral vs Parenteral Administration', 1)
ON CONFLICT DO NOTHING;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('b0c0d1e2-f4a5-6b7c-8d9e-0f1a2b3c4d5e', 'a9b0c0d1-e3f4-5a6b-7c8d-9e0f1a2b3c4d', 'Intravenous Injection (IV)', 1)
ON CONFLICT DO NOTHING;

INSERT INTO learning_objects (id, concept_id, object_type, content_payload, sort_order)
VALUES ('c1d1e2f3-a5b6-7c8d-9e0f-0a1b2c3d4e5f', 'b0c0d1e2-f4a5-6b7c-8d9e-0f1a2b3c4d5e', 'TEXT', '### Intravenous Administration (IV)

Intravenous administration delivers the drug directly into the bloodstream:

- **Bioavailability**: Immediately 100%.
- **Onset of Action**: Rapid, making it ideal for emergencies.
- **Risks**: Infection, vascular irritation, and inability to recall the drug once administered.', 1)
ON CONFLICT DO NOTHING;
