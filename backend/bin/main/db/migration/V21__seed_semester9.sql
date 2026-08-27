-- 1. Seed Semester 9 under Year 4 (Final Professional II)
INSERT INTO semesters (id, year_id, semester_number)
VALUES ('c9d0e1f2-b3c4-5d6e-7f8a-9b0c1d2e3f4c', 'b5c6d7e8-f9a0-1b2c-3d4e-5f6a7b8c9d0e', 9)
ON CONFLICT DO NOTHING;

-- 2. Seed Subjects for Semester 9
-- Final revision
INSERT INTO subjects (id, semester_id, title, code, category)
VALUES ('f1a9b2c3-d4e5-6f7a-8b9c-0d1e2f3a4b5c', 'c9d0e1f2-b3c4-5d6e-7f8a-9b0c1d2e3f4c', 'Final revision', 'REV-403', 'Clinical')
ON CONFLICT DO NOTHING;

-- Clinical rotations
INSERT INTO subjects (id, semester_id, title, code, category)
VALUES ('f2b9c6d7-e8f9-0a1b-2c3d-4e5f6a7b8c9d', 'c9d0e1f2-b3c4-5d6e-7f8a-9b0c1d2e3f4c', 'Clinical rotations', 'ROT-403', 'Clinical')
ON CONFLICT DO NOTHING;

-- Ward work
INSERT INTO subjects (id, semester_id, title, code, category)
VALUES ('f3c9d6e7-f9a0-1b2c-3d4e-5f6a7b8c9d0e', 'c9d0e1f2-b3c4-5d6e-7f8a-9b0c1d2e3f4c', 'Ward work', 'WW-403', 'Clinical')
ON CONFLICT DO NOTHING;

-- OSCE/Practical preparation
INSERT INTO subjects (id, semester_id, title, code, category)
VALUES ('f4d9e6f7-a0b1-2c3d-4e5f-6a7b8c9d0e1f', 'c9d0e1f2-b3c4-5d6e-7f8a-9b0c1d2e3f4c', 'OSCE/Practical preparation', 'OSCE-403', 'Clinical')
ON CONFLICT DO NOTHING;

-- University examination
INSERT INTO subjects (id, semester_id, title, code, category)
VALUES ('f5e9f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a', 'c9d0e1f2-b3c4-5d6e-7f8a-9b0c1d2e3f4c', 'University examination', 'EXAM-403', 'Clinical')
ON CONFLICT DO NOTHING;


-- 3. Content for Final revision
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('f1a90001-d4e5-6f7a-8b9c-0d1e2f3a4b5c', 'f1a9b2c3-d4e5-6f7a-8b9c-0d1e2f3a4b5c', 'High-Yield Medical Review', 1)
ON CONFLICT DO NOTHING;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('f1a90002-d4e5-6f7a-8b9c-0d1e2f3a4b5c', 'f1a90001-d4e5-6f7a-8b9c-0d1e2f3a4b5c', 'Cardiology High-Yield Review', 1)
ON CONFLICT DO NOTHING;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('f1a90003-d4e5-6f7a-8b9c-0d1e2f3a4b5c', 'f1a90002-d4e5-6f7a-8b9c-0d1e2f3a4b5c', 'ECG Interpretation & Arrhythmias', 1)
ON CONFLICT DO NOTHING;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('f1a90004-d4e5-6f7a-8b9c-0d1e2f3a4b5c', 'f1a90003-d4e5-6f7a-8b9c-0d1e2f3a4b5c', 'Myocardial Infarction ECG Localization', 1)
ON CONFLICT DO NOTHING;

INSERT INTO learning_objects (id, concept_id, object_type, content_payload, sort_order)
VALUES ('f1a90005-d4e5-6f7a-8b9c-0d1e2f3a4b5c', 'f1a90004-d4e5-6f7a-8b9c-0d1e2f3a4b5c', 'TEXT', '### Myocardial Infarction ECG Localization

Locating the site of a myocardial infarction is key to predicting complications and determining the occluded coronary artery.

#### Localization Table
- **Anterior Wall**: V1 to V4 leads. Corresponds to Left Anterior Descending (LAD) artery.
- **Lateral Wall**: I, aVL, V5, V6 leads. Corresponds to Left Circumflex (LCx) artery.
- **Inferior Wall**: II, III, aVF leads. Corresponds to Right Coronary Artery (RCA).
- **Posterior Wall**: ST depressions in V1-V3 with tall R waves. Corresponds to RCA or LCx.', 1)
ON CONFLICT DO NOTHING;


-- 4. Content for Clinical rotations
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('f2b90001-e8f9-0a1b-2c3d-4e5f6a7b8c9d', 'f2b9c6d7-e8f9-0a1b-2c3d-4e5f6a7b8c9d', 'Specialty Postings', 1)
ON CONFLICT DO NOTHING;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('f2b90002-e8f9-0a1b-2c3d-4e5f6a7b8c9d', 'f2b90001-e8f9-0a1b-2c3d-4e5f6a7b8c9d', 'Emergency & Trauma Rotation', 1)
ON CONFLICT DO NOTHING;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('f2b90003-e8f9-0a1b-2c3d-4e5f6a7b8c9d', 'f2b90002-e8f9-0a1b-2c3d-4e5f6a7b8c9d', 'Triage & Primary Survey', 1)
ON CONFLICT DO NOTHING;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('f2b90004-e8f9-0a1b-2c3d-4e5f6a7b8c9d', 'f2b90003-e8f9-0a1b-2c3d-4e5f6a7b8c9d', 'ATLS Primary Survey Algorithm (ABCDE)', 1)
ON CONFLICT DO NOTHING;

INSERT INTO learning_objects (id, concept_id, object_type, content_payload, sort_order)
VALUES ('f2b90005-e8f9-0a1b-2c3d-4e5f6a7b8c9d', 'f2b90004-e8f9-0a1b-2c3d-4e5f6a7b8c9d', 'TEXT', '### ATLS Primary Survey

The primary survey is a rapid initial assessment to identify and treat life-threatening injuries in a trauma patient.

#### ABCDE Protocol
- **A**irway maintenance with cervical spine protection.
- **B**reathing and ventilation: Check for tension pneumothorax, flail chest.
- **C**irculation with hemorrhage control: Assess pulses, skin color, and external bleeding.
- **D**isability: Neurological status check (GCS, pupil size and reaction).
- **E**xposure and Environmental control: Undress patient completely, prevent hypothermia.', 1)
ON CONFLICT DO NOTHING;


-- 5. Content for Ward work
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('f3c90001-f9a0-1b2c-3d4e-5f6a7b8c9d0e', 'f3c9d6e7-f9a0-1b2c-3d4e-5f6a7b8c9d0e', 'Bedside Operations', 1)
ON CONFLICT DO NOTHING;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('f3c90002-f9a0-1b2c-3d4e-5f6a7b8c9d0e', 'f3c90001-f9a0-1b2c-3d4e-5f6a7b8c9d0e', 'Clinical Documentation & Discharge', 1)
ON CONFLICT DO NOTHING;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('f3c90003-f9a0-1b2c-3d4e-5f6a7b8c9d0e', 'f3c90002-f9a0-1b2c-3d4e-5f6a7b8c9d0e', 'SOAP Note Writing', 1)
ON CONFLICT DO NOTHING;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('f3c90004-f9a0-1b2c-3d4e-5f6a7b8c9d0e', 'f3c90003-f9a0-1b2c-3d4e-5f6a7b8c9d0e', 'SOAP Note Formatting Standards', 1)
ON CONFLICT DO NOTHING;

INSERT INTO learning_objects (id, concept_id, object_type, content_payload, sort_order)
VALUES ('f3c90005-f9a0-1b2c-3d4e-5f6a7b8c9d0e', 'f3c90004-f9a0-1b2c-3d4e-5f6a7b8c9d0e', 'TEXT', '### SOAP Notes in Ward Rounds

SOAP notes provide a structured, universal format for documenting daily patient updates in progress charts.

#### SOAP Structure
- **S (Subjective)**: Patient''s verbal statements, complaints, pain level, and current symptoms.
- **O (Objective)**: Measurable parameters (vital signs, physical exam findings, labs, imaging).
- **A (Assessment)**: Diagnostic analysis, differential diagnosis, progress status (improved, stable, worsening).
- **P (Plan)**: Future orders, modifications in drug dosing, requested lab work, or discharge timeline.', 1)
ON CONFLICT DO NOTHING;


-- 6. Content for OSCE/Practical preparation
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('f4d90001-a0b1-2c3d-4e5f-6a7b8c9d0e1f', 'f4d9e6f7-a0b1-2c3d-4e5f-6a7b8c9d0e1f', 'Clinical Skills Assessments', 1)
ON CONFLICT DO NOTHING;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('f4d90002-a0b1-2c3d-4e5f-6a7b8c9d0e1f', 'f4d90001-a0b1-2c3d-4e5f-6a7b8c9d0e1f', 'Cardiovascular OSCE Stations', 1)
ON CONFLICT DO NOTHING;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('f4d90003-a0b1-2c3d-4e5f-6a7b8c9d0e1f', 'f4d90002-a0b1-2c3d-4e5f-6a7b8c9d0e1f', 'Bedside Physical Examination', 1)
ON CONFLICT DO NOTHING;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('f4d90004-a0b1-2c3d-4e5f-6a7b8c9d0e1f', 'f4d90003-a0b1-2c3d-4e5f-6a7b8c9d0e1f', 'Jugular Venous Pressure (JVP) Measurement', 1)
ON CONFLICT DO NOTHING;

INSERT INTO learning_objects (id, concept_id, object_type, content_payload, sort_order)
VALUES ('f4d90005-a0b1-2c3d-4e5f-6a7b8c9d0e1f', 'f4d90004-a0b1-2c3d-4e5f-6a7b8c9d0e1f', 'TEXT', '### JVP OSCE Guide

Measuring the Jugular Venous Pressure is a standard bedside station evaluating venous congestion.

#### Practical Protocol
1. Position patient at 45-degree angle.
2. Turn patient''s head slightly to the left.
3. Identify internal jugular vein pulsations (double waveform pulse, non-palpable, falls on inspiration).
4. Identify highest point of pulsation.
5. Measure vertical height above sternal angle (Add 5 cm to obtain right atrial pressure). Normal JVP is < 3 cm above sternal angle.', 1)
ON CONFLICT DO NOTHING;


-- 7. Content for University examination
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('f5e90001-b8c9-0d1e-2f3a-4b5c6d7e8f9a', 'f5e9f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a', 'Assessment Strategies', 1)
ON CONFLICT DO NOTHING;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('f5e90002-b8c9-0d1e-2f3a-4b5c6d7e8f9a', 'f5e90001-b8c9-0d1e-2f3a-4b5c6d7e8f9a', 'Exam Format & Writing Protocols', 1)
ON CONFLICT DO NOTHING;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('f5e90003-b8c9-0d1e-2f3a-4b5c6d7e8f9a', 'f5e90002-b8c9-0d1e-2f3a-4b5c6d7e8f9a', 'University Theory & Case Presentation Standards', 1)
ON CONFLICT DO NOTHING;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('f5e90004-b8c9-0d1e-2f3a-4b5c6d7e8f9a', 'f5e90003-b8c9-0d1e-2f3a-4b5c6d7e8f9a', 'MBBS Theory Paper Scoring Strategy', 1)
ON CONFLICT DO NOTHING;

INSERT INTO learning_objects (id, concept_id, object_type, content_payload, sort_order)
VALUES ('f5e90005-b8c9-0d1e-2f3a-4b5c6d7e8f9a', 'f5e90004-b8c9-0d1e-2f3a-4b5c6d7e8f9a', 'TEXT', '### University Theory Scoring Strategy

Maximizing scores in MBBS theory papers requires structured responses.

#### Key Answer Writing Protocols
- **Introductory Definition**: Always start with clear WHO or standard textbook definitions.
- **Classification & Etiology**: List classifications as flowcharts.
- **Pathophysiology Flowcharts**: Use clear step-by-step schematics instead of dense text paragraphs.
- **Clinical Features**: Highlight pathognomonic symptoms and signs (use bullet points).
- **Diagnostics**: Split into baseline (routine) and gold-standard confirmatory tests.
- **Management**: Segment into medical, surgical, and supportive steps.', 1)
ON CONFLICT DO NOTHING;
