-- 1. Seed Semester 2 under Year 1 (which has ID 'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e')
INSERT INTO semesters (id, year_id, semester_number)
VALUES ('c4d5e6f7-a8b9-0c1d-2e3f-4a5b6c7d8e9f', 'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e', 2)
ON CONFLICT DO NOTHING;

-- 2. Seed missing Semester 1 Subjects (Semester 1 ID: 'c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f')
-- Physiology
INSERT INTO subjects (id, semester_id, title, code, category)
VALUES ('d5e6f7a8-b9c0-1d2e-3f4a-5b6c7d8e9f0a', 'c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f', 'Physiology', 'PHYS-101', 'Pre-Clinical')
ON CONFLICT DO NOTHING;
-- Biochemistry
INSERT INTO subjects (id, semester_id, title, code, category)
VALUES ('d6e7f8a9-b0c1-2d3e-4f5a-6b7c8d9e0f1a', 'c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f', 'Biochemistry', 'BIOC-101', 'Pre-Clinical')
ON CONFLICT DO NOTHING;
-- Foundation Course
INSERT INTO subjects (id, semester_id, title, code, category)
VALUES ('d7e8f9a0-b1c2-3d4e-5f6a-7b8c9d0e1f2a', 'c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f', 'Foundation Course', 'FND-101', 'Pre-Clinical')
ON CONFLICT DO NOTHING;
-- Early Clinical Exposure
INSERT INTO subjects (id, semester_id, title, code, category)
VALUES ('d8e9f0a1-b2c3-4d5e-6f7a-8b9c0d1e2f3a', 'c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f', 'Early Clinical Exposure', 'ECE-101', 'Pre-Clinical')
ON CONFLICT DO NOTHING;
-- AETCOM
INSERT INTO subjects (id, semester_id, title, code, category)
VALUES ('d9e0f1a2-b3c4-5d6e-7f8a-9b0c1d2e3f4a', 'c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f', 'AETCOM', 'AET-101', 'Pre-Clinical')
ON CONFLICT DO NOTHING;

-- 3. Seed Semester 2 Subjects (Semester 2 ID: 'c4d5e6f7-a8b9-0c1d-2e3f-4a5b6c7d8e9f')
-- Human Anatomy II
INSERT INTO subjects (id, semester_id, title, code, category)
VALUES ('e1f2a3b4-c5d6-7e8f-9a0b-1c2d3e4f5a6b', 'c4d5e6f7-a8b9-0c1d-2e3f-4a5b6c7d8e9f', 'Human Anatomy II', 'ANAT-102', 'Pre-Clinical')
ON CONFLICT DO NOTHING;
-- Physiology II
INSERT INTO subjects (id, semester_id, title, code, category)
VALUES ('e2f3a4b5-c6d7-8e9f-0a1b-2c3d4e5f6a7b', 'c4d5e6f7-a8b9-0c1d-2e3f-4a5b6c7d8e9f', 'Physiology II', 'PHYS-102', 'Pre-Clinical')
ON CONFLICT DO NOTHING;
-- Biochemistry II
INSERT INTO subjects (id, semester_id, title, code, category)
VALUES ('e3f4a5b6-c7d8-9e0f-1a2b-3c4d5e6f7a8b', 'c4d5e6f7-a8b9-0c1d-2e3f-4a5b6c7d8e9f', 'Biochemistry II', 'BIOC-102', 'Pre-Clinical')
ON CONFLICT DO NOTHING;
-- Early Clinical Exposure II
INSERT INTO subjects (id, semester_id, title, code, category)
VALUES ('e4f5a6b7-c8d9-0e1f-2a3b-4c5d6e7f8a9b', 'c4d5e6f7-a8b9-0c1d-2e3f-4a5b6c7d8e9f', 'Early Clinical Exposure II', 'ECE-102', 'Pre-Clinical')
ON CONFLICT DO NOTHING;

-- 4. Seed units & chapters for Physiology II
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('f1a2b3c4-d5e6-7f8a-9b0c-1d2e3f4a5b6c', 'e2f3a4b5-c6d7-8e9f-0a1b-2c3d4e5f6a7b', 'Renal Physiology', 1)
ON CONFLICT DO NOTHING;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('f2a3b4c5-d6e7-8f9a-0b1c-2d3e4f5a6b7c', 'f1a2b3c4-d5e6-7f8a-9b0c-1d2e3f4a5b6c', 'Renal Filtration & Clearance', 1)
ON CONFLICT DO NOTHING;
