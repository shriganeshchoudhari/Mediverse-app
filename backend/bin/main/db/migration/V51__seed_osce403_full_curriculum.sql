-- V51: Seed Objective Structured Clinical Examination (OSCE-403) Full Curriculum

-- Ensure Subject: OSCE-403 exists with correct title and category
INSERT INTO subjects (id, semester_id, code, title, category)
VALUES ('f4d9e6f7-a0b1-2c3d-4e5f-6a7b8c9d0e1f', 'c9d0e1f2-b3c4-5d6e-7f8a-9b0c1d2e3f4c', 'OSCE-403', 'Objective Structured Clinical Examination & Practical Skills', 'CLINICAL')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, category = EXCLUDED.category;

-- Unit 1: OSCE Station: Cardiovascular Precordial & Cranial Nerve Exams
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa130001-0000-0000-0000-000000000001', 'f4d9e6f7-a0b1-2c3d-4e5f-6a7b8c9d0e1f', 'OSCE Station: Cardiovascular Precordial & Cranial Nerve Exams', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa130002-0000-0000-0000-000000000001', 'fa130001-0000-0000-0000-000000000001', 'Precordial Inspection, Palpation & Auscultation Sequence', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa130003-0000-0000-0000-000000000001', 'fa130002-0000-0000-0000-000000000001', 'Dynamic Murmur Maneuvers (Valsalva vs Squatting in AS/HCM)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa130004-0000-0000-0000-000000000001', 'fa130003-0000-0000-0000-000000000001', 'Cranial Nerve II-XII Examination & Marcus Gunn RAPD', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa130005-0000-0000-0000-000000000001', 'fa130004-0000-0000-0000-000000000001', 'Precordial Auscultation Checklist, Dynamic Murmurs, Systematic Cranial Nerve Exam and Rinne/Weber Tuning Forks', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa130006-0000-0000-0000-000000000001', 'fa130005-0000-0000-0000-000000000001', 'EXPLANATION', 1, 
'{"text": "### Cardiovascular & Neurological OSCE Stations\n\nPrecordial examination follows 45-degree elevation, apex beat palpation, and auscultation across all 4 valve areas. Valsalva strain decreases most murmurs (AS, MR) but increases Hypertrophic Cardiomyopathy (HCM) and MVP. Squatting increases AS/MR and decreases HCM. Cranial nerve exam: Marcus Gunn pupil paradoxical dilation in optic neuritis; CN VII UMN shows forehead sparing; CN VIII Rinne negative (BC > AC) and Weber lateralizes to affected ear in conductive hearing loss."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 2: OSCE Station: ATLS Trauma Primary Survey & ACLS MegaCode
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa130001-0000-0000-0000-000000000002', 'f4d9e6f7-a0b1-2c3d-4e5f-6a7b8c9d0e1f', 'OSCE Station: ATLS Trauma Primary Survey & ACLS MegaCode', 2)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa130002-0000-0000-0000-000000000002', 'fa130001-0000-0000-0000-000000000002', 'ATLS ABCDE Survey & GCS Neurological Score', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa130003-0000-0000-0000-000000000002', 'fa130002-0000-0000-0000-000000000002', 'Tension Pneumothorax Needle Decompression & Chest Tube', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa130004-0000-0000-0000-000000000002', 'fa130003-0000-0000-0000-000000000002', 'AHA ACLS MegaCode Closed-Loop Resuscitation Leadership', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa130005-0000-0000-0000-000000000002', 'fa130004-0000-0000-0000-000000000002', 'ATLS Trauma Survey Checklist, Immediate Needle Decompression, Pelvic Binders, MTP and ACLS MegaCode Protocols', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa130006-0000-0000-0000-000000000002', 'fa130005-0000-0000-0000-000000000002', 'EXPLANATION', 1, 
'{"text": "### ATLS & ACLS Resuscitation Stations\n\nATLS ABCDE survey: Airway + in-line C-spine, Breathing (immediate 14G needle decompression in 5th ICS AAL for tension pneumothorax followed by 28-32 Fr chest tube; NEVER delay for X-ray), Circulation (pelvic binder, MTP 1:1:1, TXA 1g within 3 hours). ACLS MegaCode: Shockable VF/pVT mandates 200J shock, 2 minutes CPR without pulse check, Epinephrine 1 mg q3-5m, and Amiodarone 300 mg bolus. EtCO2 >=35 mmHg indicates ROSC."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 3: OSCE Station: Suture Selection, Knot Tying & ABG Analysis
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa130001-0000-0000-0000-000000000003', 'f4d9e6f7-a0b1-2c3d-4e5f-6a7b8c9d0e1f', 'OSCE Station: Suture Selection, Knot Tying & ABG Analysis', 3)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa130002-0000-0000-0000-000000000003', 'fa130001-0000-0000-0000-000000000003', 'Suture Materials (Nylon, Vicryl, PDS) & Instrument Handling', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa130003-0000-0000-0000-000000000003', 'fa130002-0000-0000-0000-000000000003', 'Vertical Mattress Suture (Far-Far Near-Near) & Square Knots', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa130004-0000-0000-0000-000000000003', 'fa130003-0000-0000-0000-000000000003', 'Arterial Blood Gas (ABG) Interpretation & Winter''s Formula', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa130005-0000-0000-0000-000000000003', 'fa130004-0000-0000-0000-000000000003', 'Surgical Suture Selection, Instrument Knot Tying, Vertical Mattress Eversion, Anion Gap and Winter''s Formula', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa130006-0000-0000-0000-000000000003', 'fa130005-0000-0000-0000-000000000003', 'EXPLANATION', 1, 
'{"text": "### Surgical Skills & ABG Interpretation\n\nSuture selection: Nylon for skin closure, Vicryl for subcutaneous fat/bowel, PDS for abdominal wall fascia. Vertical mattress (far-far, near-near) ensures skin edge eversion in high-tension wounds. ABG analysis: Anion Gap = Na - (Cl + HCO3). Winter''s formula for metabolic acidosis: Expected PaCO2 = 1.5[HCO3] + 8 +/- 2. Measured PaCO2 higher than expected indicates concomitant respiratory acidosis."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 4: OSCE Station: SPIKES Breaking Bad News & Obstetric Partograph
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa130001-0000-0000-0000-000000000004', 'f4d9e6f7-a0b1-2c3d-4e5f-6a7b8c9d0e1f', 'OSCE Station: SPIKES Breaking Bad News & Obstetric Partograph', 4)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa130002-0000-0000-0000-000000000004', 'fa130001-0000-0000-0000-000000000004', 'The SPIKES 6-Step Protocol & NURSE Empathy Framework', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa130003-0000-0000-0000-000000000004', 'fa130002-0000-0000-0000-000000000004', 'The 4 Obstetric Leopold Maneuvers (Fundal to Deep Pelvic)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa130004-0000-0000-0000-000000000004', 'fa130003-0000-0000-0000-000000000004', 'Modified WHO Partograph (Alert vs Action Line Decisions)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa130005-0000-0000-0000-000000000004', 'fa130004-0000-0000-0000-000000000004', 'SPIKES Breaking Bad News Protocol, NURSE Empathy, Leopold Abdominal Maneuvers and Partograph Labor Monitoring', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa130006-0000-0000-0000-000000000004', 'fa130005-0000-0000-0000-000000000004', 'EXPLANATION', 1, 
'{"text": "### Communication & Obstetric OSCE Stations\n\nSPIKES protocol: Setting, Perception, Invitation, Knowledge (warning shot), Empathy (NURSE: Name, Understand, Respect, Support, Explore), Strategy (teach-back). Obstetric Leopold maneuvers: 1st (fundal grip), 2nd (lateral grip for back/limbs), 3rd (Pawlik grip for presenting part), 4th (pelvic grip for flexion/descent). Modified WHO Partograph: Crossing Alert line indicates protracted active phase; crossing Action line (4 hours to right) mandates emergency Cesarean delivery."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;
