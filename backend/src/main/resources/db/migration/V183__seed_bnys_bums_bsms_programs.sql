-- V183: Seed BNYS, BUMS, BSMS programs with basic 5.5-year curriculum skeleton

-- Add healthcare_domain if not present, but handled in previous migrations
ALTER TABLE programs ADD COLUMN IF NOT EXISTS healthcare_domain VARCHAR(50);
ALTER TABLE programs ADD COLUMN IF NOT EXISTS domain_tier INT;

-- 1. Insert Programs
INSERT INTO programs (id, code, name, duration_years, description, healthcare_domain, domain_tier) VALUES
('10000000-0000-0000-0000-000000000017', 'BNYS', 'Bachelor of Naturopathy & Yogic Sciences', 5.5, '5.5 years, CCYN-regulated', 'AYUSH', 3),
('10000000-0000-0000-0000-000000000018', 'BUMS', 'Bachelor of Unani Medicine & Surgery', 5.5, '5.5 years, CCIM-regulated', 'AYUSH', 3),
('10000000-0000-0000-0000-000000000019', 'BSMS', 'Bachelor of Siddha Medicine & Surgery', 5.5, '5.5 years, CCIM-regulated', 'AYUSH', 3)
ON CONFLICT (code) DO NOTHING;

-- Update existing if necessary
UPDATE programs SET healthcare_domain = 'AYUSH', domain_tier = 3 WHERE code IN ('BNYS', 'BUMS', 'BSMS');

-- 2. Insert Curricula
INSERT INTO curricula (id, program_id, name, version, is_active) VALUES
('20000000-0000-0000-0000-000000000009', '10000000-0000-0000-0000-000000000017', 'BNYS Curriculum', '1.0', TRUE),
('20000000-0000-0000-0000-000000000010', '10000000-0000-0000-0000-000000000018', 'BUMS Curriculum', '1.0', TRUE),
('20000000-0000-0000-0000-000000000011', '10000000-0000-0000-0000-000000000019', 'BSMS Curriculum', '1.0', TRUE)
ON CONFLICT (program_id, version) DO NOTHING;

-- 3. Insert Curriculum Years (5 years + internship)
-- BNYS
INSERT INTO curriculum_years (id, curriculum_id, year_number, name) VALUES
('20000000-0000-0000-0001-000000000101', '20000000-0000-0000-0000-000000000009', 1, 'First Year'),
('20000000-0000-0000-0001-000000000102', '20000000-0000-0000-0000-000000000009', 2, 'Second Year'),
('20000000-0000-0000-0001-000000000103', '20000000-0000-0000-0000-000000000009', 3, 'Third Year'),
('20000000-0000-0000-0001-000000000104', '20000000-0000-0000-0000-000000000009', 4, 'Fourth Year'),
('20000000-0000-0000-0001-000000000105', '20000000-0000-0000-0000-000000000009', 5, 'Internship')
ON CONFLICT (id) DO NOTHING;

-- BUMS
INSERT INTO curriculum_years (id, curriculum_id, year_number, name) VALUES
('20000000-0000-0000-0001-000000000111', '20000000-0000-0000-0000-000000000010', 1, 'First Professional'),
('20000000-0000-0000-0001-000000000112', '20000000-0000-0000-0000-000000000010', 2, 'Second Professional'),
('20000000-0000-0000-0001-000000000113', '20000000-0000-0000-0000-000000000010', 3, 'Third Professional'),
('20000000-0000-0000-0001-000000000114', '20000000-0000-0000-0000-000000000010', 4, 'Fourth Professional'),
('20000000-0000-0000-0001-000000000115', '20000000-0000-0000-0000-000000000010', 5, 'Internship')
ON CONFLICT (id) DO NOTHING;

-- BSMS
INSERT INTO curriculum_years (id, curriculum_id, year_number, name) VALUES
('20000000-0000-0000-0001-000000000121', '20000000-0000-0000-0000-000000000011', 1, 'First Professional'),
('20000000-0000-0000-0001-000000000122', '20000000-0000-0000-0000-000000000011', 2, 'Second Professional'),
('20000000-0000-0000-0001-000000000123', '20000000-0000-0000-0000-000000000011', 3, 'Third Professional'),
('20000000-0000-0000-0001-000000000124', '20000000-0000-0000-0000-000000000011', 4, 'Fourth Professional'),
('20000000-0000-0000-0001-000000000125', '20000000-0000-0000-0000-000000000011', 5, 'Internship')
ON CONFLICT (id) DO NOTHING;

-- 4. Insert Semesters (2 per year)
-- BNYS
INSERT INTO semesters (id, year_id, semester_number, name) VALUES
('20000000-0000-0000-0002-000000000101', '20000000-0000-0000-0001-000000000101', 1, 'Semester 1'),
('20000000-0000-0000-0002-000000000102', '20000000-0000-0000-0001-000000000101', 2, 'Semester 2'),
('20000000-0000-0000-0002-000000000103', '20000000-0000-0000-0001-000000000102', 3, 'Semester 3'),
('20000000-0000-0000-0002-000000000104', '20000000-0000-0000-0001-000000000102', 4, 'Semester 4'),
('20000000-0000-0000-0002-000000000105', '20000000-0000-0000-0001-000000000103', 5, 'Semester 5'),
('20000000-0000-0000-0002-000000000106', '20000000-0000-0000-0001-000000000103', 6, 'Semester 6'),
('20000000-0000-0000-0002-000000000107', '20000000-0000-0000-0001-000000000104', 7, 'Semester 7'),
('20000000-0000-0000-0002-000000000108', '20000000-0000-0000-0001-000000000104', 8, 'Semester 8'),
('20000000-0000-0000-0002-000000000109', '20000000-0000-0000-0001-000000000105', 9, 'Internship 1'),
('20000000-0000-0000-0002-000000000110', '20000000-0000-0000-0001-000000000105', 10, 'Internship 2')
ON CONFLICT (id) DO NOTHING;

-- BUMS
INSERT INTO semesters (id, year_id, semester_number, name) VALUES
('20000000-0000-0000-0002-000000000111', '20000000-0000-0000-0001-000000000111', 1, 'Semester 1'),
('20000000-0000-0000-0002-000000000112', '20000000-0000-0000-0001-000000000111', 2, 'Semester 2'),
('20000000-0000-0000-0002-000000000113', '20000000-0000-0000-0001-000000000112', 3, 'Semester 3'),
('20000000-0000-0000-0002-000000000114', '20000000-0000-0000-0001-000000000112', 4, 'Semester 4'),
('20000000-0000-0000-0002-000000000115', '20000000-0000-0000-0001-000000000113', 5, 'Semester 5'),
('20000000-0000-0000-0002-000000000116', '20000000-0000-0000-0001-000000000113', 6, 'Semester 6'),
('20000000-0000-0000-0002-000000000117', '20000000-0000-0000-0001-000000000114', 7, 'Semester 7'),
('20000000-0000-0000-0002-000000000118', '20000000-0000-0000-0001-000000000114', 8, 'Semester 8'),
('20000000-0000-0000-0002-000000000119', '20000000-0000-0000-0001-000000000115', 9, 'Internship 1'),
('20000000-0000-0000-0002-000000000120', '20000000-0000-0000-0001-000000000115', 10, 'Internship 2')
ON CONFLICT (id) DO NOTHING;

-- BSMS
INSERT INTO semesters (id, year_id, semester_number, name) VALUES
('20000000-0000-0000-0002-000000000121', '20000000-0000-0000-0001-000000000121', 1, 'Semester 1'),
('20000000-0000-0000-0002-000000000122', '20000000-0000-0000-0001-000000000121', 2, 'Semester 2'),
('20000000-0000-0000-0002-000000000123', '20000000-0000-0000-0001-000000000122', 3, 'Semester 3'),
('20000000-0000-0000-0002-000000000124', '20000000-0000-0000-0001-000000000122', 4, 'Semester 4'),
('20000000-0000-0000-0002-000000000125', '20000000-0000-0000-0001-000000000123', 5, 'Semester 5'),
('20000000-0000-0000-0002-000000000126', '20000000-0000-0000-0001-000000000123', 6, 'Semester 6'),
('20000000-0000-0000-0002-000000000127', '20000000-0000-0000-0001-000000000124', 7, 'Semester 7'),
('20000000-0000-0000-0002-000000000128', '20000000-0000-0000-0001-000000000124', 8, 'Semester 8'),
('20000000-0000-0000-0002-000000000129', '20000000-0000-0000-0001-000000000125', 9, 'Internship 1'),
('20000000-0000-0000-0002-000000000130', '20000000-0000-0000-0001-000000000125', 10, 'Internship 2')
ON CONFLICT (id) DO NOTHING;

-- 5. Insert Subjects (for Semester 1 of Year 1)
-- BNYS
INSERT INTO subjects (id, semester_id, code, name) VALUES
('B0000000-0000-0000-0003-000000000001', '20000000-0000-0000-0002-000000000101', 'BNYS-ANAT', 'Anatomy & Physiology'),
('B0000000-0000-0000-0003-000000000002', '20000000-0000-0000-0002-000000000101', 'BNYS-NATPATH', 'Naturopathy Diagnostics & Case Taking'),
('B0000000-0000-0000-0003-000000000003', '20000000-0000-0000-0002-000000000101', 'BNYS-YOGA', 'Yoga Therapy & Pranayama'),
('B0000000-0000-0000-0003-000000000004', '20000000-0000-0000-0002-000000000101', 'BNYS-DIET', 'Diet Therapy & Nutrition'),
('B0000000-0000-0000-0003-000000000005', '20000000-0000-0000-0002-000000000101', 'BNYS-HYDRO', 'Hydrotherapy & Electrotherapy'),
('B0000000-0000-0000-0003-000000000006', '20000000-0000-0000-0002-000000000101', 'BNYS-CLNPRAC', 'Clinical Naturopathy Practice')
ON CONFLICT (id) DO NOTHING;

-- BUMS
INSERT INTO subjects (id, semester_id, code, name) VALUES
('C0000000-0000-0000-0003-000000000001', '20000000-0000-0000-0002-000000000111', 'BUMS-KULL', 'Kulliyat — Unani Principles'),
('C0000000-0000-0000-0003-000000000002', '20000000-0000-0000-0002-000000000111', 'BUMS-MUFR', 'Ilmul Mufradat — Materia Medica'),
('C0000000-0000-0000-0003-000000000003', '20000000-0000-0000-0002-000000000111', 'BUMS-MOAK', 'Moalejat — Treatment'),
('C0000000-0000-0000-0003-000000000004', '20000000-0000-0000-0002-000000000111', 'BUMS-JARAH', 'Ilmul Jarahat — Surgery'),
('C0000000-0000-0000-0003-000000000005', '20000000-0000-0000-0002-000000000111', 'BUMS-ATFAL', 'Ilmul Atfal — Paediatrics'),
('C0000000-0000-0000-0003-000000000006', '20000000-0000-0000-0002-000000000111', 'BUMS-USOOL', 'Usool-e-Tib — Clinical Practice')
ON CONFLICT (id) DO NOTHING;

-- BSMS
INSERT INTO subjects (id, semester_id, code, name) VALUES
('D0000000-0000-0000-0003-000000000001', '20000000-0000-0000-0002-000000000121', 'BSMS-SIDD', 'Siddhanta — Siddha Principles'),
('D0000000-0000-0000-0003-000000000002', '20000000-0000-0000-0002-000000000121', 'BSMS-MARAM', 'Maruthuva Nool — Classical Texts'),
('D0000000-0000-0000-0003-000000000003', '20000000-0000-0000-0002-000000000121', 'BSMS-GUNAPM', 'Gunapadam — Siddha Materia Medica'),
('D0000000-0000-0000-0003-000000000004', '20000000-0000-0000-0002-000000000121', 'BSMS-NOI', 'Noi Naadal — Diagnosis'),
('D0000000-0000-0000-0003-000000000005', '20000000-0000-0000-0002-000000000121', 'BSMS-VARMAM', 'Varmam — Pressure Point Therapy'),
('D0000000-0000-0000-0003-000000000006', '20000000-0000-0000-0002-000000000121', 'BSMS-CLNSI', 'Clinical Siddha Practice')
ON CONFLICT (id) DO NOTHING;

-- 6. Insert Units, Chapters, Topics, Concepts, Learning Objects
-- We will use a dynamic approach with a single nested structure for basic scaffolding

-- BNYS Subjects Scaffolding
INSERT INTO units (id, subject_id, name, order_index)
SELECT gen_random_uuid(), id, 'Introduction to ' || name, 1
FROM subjects WHERE code LIKE 'BNYS-%'
ON CONFLICT DO NOTHING;

INSERT INTO chapters (id, unit_id, name, order_index)
SELECT gen_random_uuid(), id, 'Basics of ' || name, 1
FROM units WHERE name LIKE 'Introduction to %' AND subject_id IN (SELECT id FROM subjects WHERE code LIKE 'BNYS-%')
ON CONFLICT DO NOTHING;

INSERT INTO topics (id, chapter_id, name, order_index)
SELECT gen_random_uuid(), id, 'Core Principles of ' || name, 1
FROM chapters WHERE name LIKE 'Basics of %' AND unit_id IN (SELECT id FROM units WHERE subject_id IN (SELECT id FROM subjects WHERE code LIKE 'BNYS-%'))
ON CONFLICT DO NOTHING;

INSERT INTO concepts (id, topic_id, name, order_index)
SELECT gen_random_uuid(), id, 'Foundational Concept ' || name, 1
FROM topics WHERE name LIKE 'Core Principles of %' AND chapter_id IN (SELECT id FROM chapters WHERE unit_id IN (SELECT id FROM units WHERE subject_id IN (SELECT id FROM subjects WHERE code LIKE 'BNYS-%')))
ON CONFLICT DO NOTHING;

INSERT INTO learning_objects (id, concept_id, type, title, url, order_index)
SELECT gen_random_uuid(), id, 'VIDEO', 'Overview ' || name, 'https://example.com/video', 1
FROM concepts WHERE name LIKE 'Foundational Concept %' AND topic_id IN (SELECT id FROM topics WHERE chapter_id IN (SELECT id FROM chapters WHERE unit_id IN (SELECT id FROM units WHERE subject_id IN (SELECT id FROM subjects WHERE code LIKE 'BNYS-%'))))
ON CONFLICT DO NOTHING;
INSERT INTO learning_objects (id, concept_id, type, title, url, order_index)
SELECT gen_random_uuid(), id, 'DOCUMENT', 'Notes ' || name, 'https://example.com/notes', 2
FROM concepts WHERE name LIKE 'Foundational Concept %' AND topic_id IN (SELECT id FROM topics WHERE chapter_id IN (SELECT id FROM chapters WHERE unit_id IN (SELECT id FROM units WHERE subject_id IN (SELECT id FROM subjects WHERE code LIKE 'BNYS-%'))))
ON CONFLICT DO NOTHING;
INSERT INTO learning_objects (id, concept_id, type, title, url, order_index)
SELECT gen_random_uuid(), id, 'QUIZ', 'Quiz ' || name, 'https://example.com/quiz', 3
FROM concepts WHERE name LIKE 'Foundational Concept %' AND topic_id IN (SELECT id FROM topics WHERE chapter_id IN (SELECT id FROM chapters WHERE unit_id IN (SELECT id FROM units WHERE subject_id IN (SELECT id FROM subjects WHERE code LIKE 'BNYS-%'))))
ON CONFLICT DO NOTHING;


-- BUMS Subjects Scaffolding
INSERT INTO units (id, subject_id, name, order_index)
SELECT gen_random_uuid(), id, 'Introduction to ' || name, 1
FROM subjects WHERE code LIKE 'BUMS-%'
ON CONFLICT DO NOTHING;

INSERT INTO chapters (id, unit_id, name, order_index)
SELECT gen_random_uuid(), id, 'Basics of ' || name, 1
FROM units WHERE name LIKE 'Introduction to %' AND subject_id IN (SELECT id FROM subjects WHERE code LIKE 'BUMS-%')
ON CONFLICT DO NOTHING;

INSERT INTO topics (id, chapter_id, name, order_index)
SELECT gen_random_uuid(), id, 'Core Principles of ' || name, 1
FROM chapters WHERE name LIKE 'Basics of %' AND unit_id IN (SELECT id FROM units WHERE subject_id IN (SELECT id FROM subjects WHERE code LIKE 'BUMS-%'))
ON CONFLICT DO NOTHING;

INSERT INTO concepts (id, topic_id, name, order_index)
SELECT gen_random_uuid(), id, 'Foundational Concept ' || name, 1
FROM topics WHERE name LIKE 'Core Principles of %' AND chapter_id IN (SELECT id FROM chapters WHERE unit_id IN (SELECT id FROM units WHERE subject_id IN (SELECT id FROM subjects WHERE code LIKE 'BUMS-%')))
ON CONFLICT DO NOTHING;

INSERT INTO learning_objects (id, concept_id, type, title, url, order_index)
SELECT gen_random_uuid(), id, 'VIDEO', 'Overview ' || name, 'https://example.com/video', 1
FROM concepts WHERE name LIKE 'Foundational Concept %' AND topic_id IN (SELECT id FROM topics WHERE chapter_id IN (SELECT id FROM chapters WHERE unit_id IN (SELECT id FROM units WHERE subject_id IN (SELECT id FROM subjects WHERE code LIKE 'BUMS-%'))))
ON CONFLICT DO NOTHING;
INSERT INTO learning_objects (id, concept_id, type, title, url, order_index)
SELECT gen_random_uuid(), id, 'DOCUMENT', 'Notes ' || name, 'https://example.com/notes', 2
FROM concepts WHERE name LIKE 'Foundational Concept %' AND topic_id IN (SELECT id FROM topics WHERE chapter_id IN (SELECT id FROM chapters WHERE unit_id IN (SELECT id FROM units WHERE subject_id IN (SELECT id FROM subjects WHERE code LIKE 'BUMS-%'))))
ON CONFLICT DO NOTHING;
INSERT INTO learning_objects (id, concept_id, type, title, url, order_index)
SELECT gen_random_uuid(), id, 'QUIZ', 'Quiz ' || name, 'https://example.com/quiz', 3
FROM concepts WHERE name LIKE 'Foundational Concept %' AND topic_id IN (SELECT id FROM topics WHERE chapter_id IN (SELECT id FROM chapters WHERE unit_id IN (SELECT id FROM units WHERE subject_id IN (SELECT id FROM subjects WHERE code LIKE 'BUMS-%'))))
ON CONFLICT DO NOTHING;


-- BSMS Subjects Scaffolding
INSERT INTO units (id, subject_id, name, order_index)
SELECT gen_random_uuid(), id, 'Introduction to ' || name, 1
FROM subjects WHERE code LIKE 'BSMS-%'
ON CONFLICT DO NOTHING;

INSERT INTO chapters (id, unit_id, name, order_index)
SELECT gen_random_uuid(), id, 'Basics of ' || name, 1
FROM units WHERE name LIKE 'Introduction to %' AND subject_id IN (SELECT id FROM subjects WHERE code LIKE 'BSMS-%')
ON CONFLICT DO NOTHING;

INSERT INTO topics (id, chapter_id, name, order_index)
SELECT gen_random_uuid(), id, 'Core Principles of ' || name, 1
FROM chapters WHERE name LIKE 'Basics of %' AND unit_id IN (SELECT id FROM units WHERE subject_id IN (SELECT id FROM subjects WHERE code LIKE 'BSMS-%'))
ON CONFLICT DO NOTHING;

INSERT INTO concepts (id, topic_id, name, order_index)
SELECT gen_random_uuid(), id, 'Foundational Concept ' || name, 1
FROM topics WHERE name LIKE 'Core Principles of %' AND chapter_id IN (SELECT id FROM chapters WHERE unit_id IN (SELECT id FROM units WHERE subject_id IN (SELECT id FROM subjects WHERE code LIKE 'BSMS-%')))
ON CONFLICT DO NOTHING;

INSERT INTO learning_objects (id, concept_id, type, title, url, order_index)
SELECT gen_random_uuid(), id, 'VIDEO', 'Overview ' || name, 'https://example.com/video', 1
FROM concepts WHERE name LIKE 'Foundational Concept %' AND topic_id IN (SELECT id FROM topics WHERE chapter_id IN (SELECT id FROM chapters WHERE unit_id IN (SELECT id FROM units WHERE subject_id IN (SELECT id FROM subjects WHERE code LIKE 'BSMS-%'))))
ON CONFLICT DO NOTHING;
INSERT INTO learning_objects (id, concept_id, type, title, url, order_index)
SELECT gen_random_uuid(), id, 'DOCUMENT', 'Notes ' || name, 'https://example.com/notes', 2
FROM concepts WHERE name LIKE 'Foundational Concept %' AND topic_id IN (SELECT id FROM topics WHERE chapter_id IN (SELECT id FROM chapters WHERE unit_id IN (SELECT id FROM units WHERE subject_id IN (SELECT id FROM subjects WHERE code LIKE 'BSMS-%'))))
ON CONFLICT DO NOTHING;
INSERT INTO learning_objects (id, concept_id, type, title, url, order_index)
SELECT gen_random_uuid(), id, 'QUIZ', 'Quiz ' || name, 'https://example.com/quiz', 3
FROM concepts WHERE name LIKE 'Foundational Concept %' AND topic_id IN (SELECT id FROM topics WHERE chapter_id IN (SELECT id FROM chapters WHERE unit_id IN (SELECT id FROM units WHERE subject_id IN (SELECT id FROM subjects WHERE code LIKE 'BSMS-%'))))
ON CONFLICT DO NOTHING;
