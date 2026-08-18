-- 1. Seed Semester 8 under Year 4 (Final Professional II)
INSERT INTO semesters (id, year_id, semester_number)
VALUES ('c9d0e1f2-b3c4-5d6e-7f8a-9b0c1d2e3f4b', 'b5c6d7e8-f9a0-1b2c-3d4e-5f6a7b8c9d0e', 8)
ON CONFLICT DO NOTHING;

-- 2. Seed Subjects for Semester 8
-- Advanced clinical postings
INSERT INTO subjects (id, semester_id, title, code, category)
VALUES ('f1a8b2c3-d4e5-6f7a-8b9c-0d1e2f3a4b5c', 'c9d0e1f2-b3c4-5d6e-7f8a-9b0c1d2e3f4b', 'Advanced clinical postings', 'ACP-402', 'Clinical')
ON CONFLICT DO NOTHING;

-- Case discussions
INSERT INTO subjects (id, semester_id, title, code, category)
VALUES ('f2b8c6d7-e8f9-0a1b-2c3d-4e5f6a7b8c9d', 'c9d0e1f2-b3c4-5d6e-7f8a-9b0c1d2e3f4b', 'Case discussions', 'CD-402', 'Clinical')
ON CONFLICT DO NOTHING;

-- Integrated learning
INSERT INTO subjects (id, semester_id, title, code, category)
VALUES ('f3c8d6e7-f9a0-1b2c-3d4e-5f6a7b8c9d0e', 'c9d0e1f2-b3c4-5d6e-7f8a-9b0c1d2e3f4b', 'Integrated learning', 'IL-402', 'Clinical')
ON CONFLICT DO NOTHING;


-- 3. Content for Advanced clinical postings
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('f1a80001-d4e5-6f7a-8b9c-0d1e2f3a4b5c', 'f1a8b2c3-d4e5-6f7a-8b9c-0d1e2f3a4b5c', 'Ward Protocols & Patient Care', 1)
ON CONFLICT DO NOTHING;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('f1a80002-d4e5-6f7a-8b9c-0d1e2f3a4b5c', 'f1a80001-d4e5-6f7a-8b9c-0d1e2f3a4b5c', 'Grand Rounds & Ward Management', 1)
ON CONFLICT DO NOTHING;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('f1a80003-d4e5-6f7a-8b9c-0d1e2f3a4b5c', 'f1a80002-d4e5-6f7a-8b9c-0d1e2f3a4b5c', 'Clinical Presentations & Rounds', 1)
ON CONFLICT DO NOTHING;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('f1a80004-d4e5-6f7a-8b9c-0d1e2f3a4b5c', 'f1a80003-d4e5-6f7a-8b9c-0d1e2f3a4b5c', 'Patient Presentation Protocol', 1)
ON CONFLICT DO NOTHING;

INSERT INTO learning_objects (id, concept_id, object_type, content_payload, sort_order)
VALUES ('f1a80005-d4e5-6f7a-8b9c-0d1e2f3a4b5c', 'f1a80004-d4e5-6f7a-8b9c-0d1e2f3a4b5c', 'TEXT', '### Patient Presentation Protocol

Mastering patient presentations during grand rounds is key to effective clinical communication.

#### Structure of Case Presentation
1. **Demographics**: Name, age, gender, occupation, and residence.
2. **Chief Complaints**: Chronological order of symptoms with duration.
3. **History of Present Illness (HPI)**: Detailed characterization of complaints.
4. **Past, Personal, Family & Obstetric History**: Relevant historical background.
5. **Physical Examination**: Vital signs, general physical exam, and systemic evaluation.
6. **Summary & Provisional Diagnosis**: Synthesized diagnostic hypothesis.', 1)
ON CONFLICT DO NOTHING;


-- 4. Content for Case discussions
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('f2b80001-e8f9-0a1b-2c3d-4e5f6a7b8c9d', 'f2b8c6d7-e8f9-0a1b-2c3d-4e5f6a7b8c9d', 'Differential Diagnosis', 1)
ON CONFLICT DO NOTHING;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('f2b80002-e8f9-0a1b-2c3d-4e5f6a7b8c9d', 'f2b80001-e8f9-0a1b-2c3d-4e5f6a7b8c9d', 'Acute Abdomen Evaluation', 1)
ON CONFLICT DO NOTHING;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('f2b80003-e8f9-0a1b-2c3d-4e5f6a7b8c9d', 'f2b80002-e8f9-0a1b-2c3d-4e5f6a7b8c9d', 'Surgical vs Medical Abdomen', 1)
ON CONFLICT DO NOTHING;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('f2b80004-e8f9-0a1b-2c3d-4e5f6a7b8c9d', 'f2b80003-e8f9-0a1b-2c3d-4e5f6a7b8c9d', 'McBurney''s Sign & Peritonitis Indications', 1)
ON CONFLICT DO NOTHING;

INSERT INTO learning_objects (id, concept_id, object_type, content_payload, sort_order)
VALUES ('f2b80005-e8f9-0a1b-2c3d-4e5f6a7b8c9d', 'f2b80004-e8f9-0a1b-2c3d-4e5f6a7b8c9d', 'TEXT', '### McBurney''s Sign & Peritonitis

Distinguishing surgical causes of acute abdomen (e.g., acute appendicitis) from medical causes is critical.

#### Key Physical Signs
- **McBurney''s Point**: Located two-thirds of the distance from the umbilicus to the right anterior superior iliac spine (ASIS). Tenderness here indicates acute appendicitis.
- **Rebound Tenderness (Blumberg''s Sign)**: Pain upon sudden release of deep pressure, indicating localized peritonitis.
- **Abdominal Guarding & Rigidity**: Involuntary contraction of abdominal wall muscles, a cardinal sign of generalized peritonitis.', 1)
ON CONFLICT DO NOTHING;


-- 5. Content for Integrated learning
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('f3c80001-f9a0-1b2c-3d4e-5f6a7b8c9d0e', 'f3c8d6e7-f9a0-1b2c-3d4e-5f6a7b8c9d0e', 'Multidisciplinary Medicine', 1)
ON CONFLICT DO NOTHING;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('f3c80002-f9a0-1b2c-3d4e-5f6a7b8c9d0e', 'f3c80001-f9a0-1b2c-3d4e-5f6a7b8c9d0e', 'Cardiorenal Syndrome', 1)
ON CONFLICT DO NOTHING;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('f3c80003-f9a0-1b2c-3d4e-5f6a7b8c9d0e', 'f3c80002-f9a0-1b2c-3d4e-5f6a7b8c9d0e', 'Classification & Pathophysiology', 1)
ON CONFLICT DO NOTHING;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('f3c80004-f9a0-1b2c-3d4e-5f6a7b8c9d0e', 'f3c80003-f9a0-1b2c-3d4e-5f6a7b8c9d0e', 'The 5 Types of Cardiorenal Syndrome', 1)
ON CONFLICT DO NOTHING;

INSERT INTO learning_objects (id, concept_id, object_type, content_payload, sort_order)
VALUES ('f3c80005-f9a0-1b2c-3d4e-5f6a7b8c9d0e', 'f3c80004-f9a0-1b2c-3d4e-5f6a7b8c9d0e', 'TEXT', '### Cardiorenal Syndrome Classification

Cardiorenal syndrome describes disorders of the heart and kidneys where acute or chronic dysfunction in one organ induces acute or chronic dysfunction in the other.

#### The Five Types
- **Type 1 (Acute Cardiorenal)**: Acute heart failure leading to acute kidney injury (AKI).
- **Type 2 (Chronic Cardiorenal)**: Chronic cardiac dysfunction causing progressive chronic kidney disease (CKD).
- **Type 3 (Acute Renocardiac)**: Acute kidney injury or ischemia inducing acute cardiac dysfunction (e.g., arrhythmia, heart failure).
- **Type 4 (Chronic Renocardiac)**: Primary chronic kidney disease contributing to cardiac hypertrophy or coronary events.
- **Type 5 (Secondary Cardiorenal)**: Systemic condition (e.g., sepsis, diabetes, amyloidosis) causing combined heart and kidney dysfunction.', 1)
ON CONFLICT DO NOTHING;
