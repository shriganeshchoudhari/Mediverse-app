-- Seed Curriculum
INSERT INTO curricula (id, code, name, description)
VALUES ('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'mbbs-cbme-2024', 'MBBS 2024 CBME Curriculum', 'Complete National Medical Commission (NMC) Competency-Based Medical Education (CBME) curriculum.');

-- Seed Years (Year 1)
INSERT INTO curriculum_years (id, curriculum_id, year_number)
VALUES ('b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e', 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 1);

-- Seed Semesters (Semester 1)
INSERT INTO semesters (id, year_id, semester_number)
VALUES ('c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f', 'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e', 1);

-- Seed Subjects (Human Anatomy)
INSERT INTO subjects (id, semester_id, title, code, category)
VALUES ('d4e5f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a', 'c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f', 'Human Anatomy', 'ANAT-101', 'Pre-Clinical');

-- Seed Units (General Histology)
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('e5f6a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0b', 'd4e5f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a', 'General Histology', 1);

-- Seed Chapters (Epithelial Tissue)
INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('f6a7b8c9-d0e1-2f3a-4b5c-6d7e8f9a0b1c', 'e5f6a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0b', 'Epithelial Tissue Classification', 1);

-- Seed Topics (Cellular Junctions)
INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('a7b8c9d0-e1f2-3a4b-5c6d-7e8f9a0b1c2d', 'f6a7b8c9-d0e1-2f3a-4b5c-6d7e8f9a0b1c', 'Cellular Junctions', 1);

-- Seed Concepts (Tight Junctions)
INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('b8c9d0e1-f2a3-4b5c-6d7e-8f9a0b1c2d3e', 'a7b8c9d0-e1f2-3a4b-5c6d-7e8f9a0b1c2d', 'Tight Junctions (Zonula Occludens)', 1);

-- Seed Learning Objects (Text/Markdown Lesson)
INSERT INTO learning_objects (id, concept_id, object_type, content_payload, sort_order)
VALUES ('c9d0e1f2-a3b4-5c6d-7e8f-9a0b1c2d3e4f', 'b8c9d0e1-f2a3-4b5c-6d7e-8f9a0b1c2d3e', 'TEXT', '### Tight Junctions (Zonula Occludens)

Tight junctions represent the most apical intercellular junctional complexes in epithelial tissues. They form a selective barrier that regulates the paracellular pathway for solutes and water.

#### Physiological Importance
They seal adjacent membranes together, preventing macromolecules from diffusing across tissue barriers.', 1);
