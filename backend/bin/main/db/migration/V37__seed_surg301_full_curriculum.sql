-- V37: Seed General Surgery (SURG-301) Full Curriculum

-- Ensure Subject: SURG-301 exists with correct title and category
INSERT INTO subjects (id, semester_id, code, title, category)
VALUES ('f4d5e6f7-a0b1-2c3d-4e5f-6a7b8c9d0e1f', 'c7d8e9f0-b1c2-3d4e-5f6a-7b8c9d0e1f2a', 'SURG-301', 'General Surgery', 'CLINICAL')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, category = EXCLUDED.category;

-- Unit 1: Acute Abdomen & Hepatobiliary Surgery
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('f4010001-0000-0000-0000-000000000001', 'f4d5e6f7-a0b1-2c3d-4e5f-6a7b8c9d0e1f', 'Acute Abdomen, GI Emergencies & Hepatobiliary Surgery', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('f4010002-0000-0000-0000-000000000001', 'f4010001-0000-0000-0000-000000000001', 'Appendicitis, Cholecystitis & Bowel Obstruction', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('f4010003-0000-0000-0000-000000000001', 'f4010002-0000-0000-0000-000000000001', 'Alvarado (MANTRELS) Appendicitis Scoring', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('f4010004-0000-0000-0000-000000000001', 'f4010003-0000-0000-0000-000000000001', 'Graham Patch, Murphy Sign and Reynolds Pentad', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('f4010005-0000-0000-0000-000000000001', 'f4010004-0000-0000-0000-000000000001', 'Acute Abdomen, Appendicitis Scoring and Gastrointestinal Perforations', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('f4010006-0000-0000-0000-000000000001', 'f4010005-0000-0000-0000-000000000001', 'EXPLANATION', 1, 
'{"text": "### Acute Abdomen & Surgical Emergencies\n\nAlvarado score >=7 indicates definite appendicitis requiring laparoscopic appendectomy. Peptic ulcer perforation presents with board-like abdominal rigidity and subdiaphragmatic pneumoperitoneum treated with Graham omental patch. Charcot triad indicates acute cholangitis."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 2: Trauma Surgery & ATLS Resuscitation
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('f4010001-0000-0000-0000-000000000002', 'f4d5e6f7-a0b1-2c3d-4e5f-6a7b8c9d0e1f', 'Trauma Surgery, ATLS Resuscitation & Hemorrhagic Shock', 2)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('f4010002-0000-0000-0000-000000000002', 'f4010001-0000-0000-0000-000000000002', 'ABCDE Primary Survey & Shock Classes', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('f4010003-0000-0000-0000-000000000002', 'f4010002-0000-0000-0000-000000000002', 'Tension Pneumothorax & Cardiac Tamponade', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('f4010004-0000-0000-0000-000000000002', 'f4010003-0000-0000-0000-000000000002', 'FAST Exam Windows and 1:1:1 MTP Transfusion', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('f4010005-0000-0000-0000-000000000002', 'f4010004-0000-0000-0000-000000000002', 'Trauma Resuscitation, Shock Staging and Damage Control Protocols', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('f4010006-0000-0000-0000-000000000002', 'f4010005-0000-0000-0000-000000000002', 'EXPLANATION', 1, 
'{"text": "### Trauma Surgery & ATLS Protocols\n\nTension pneumothorax mandates immediate needle thoracostomy in 5th intercostal space mid-axillary line. Class III shock exhibits hypotension (SBP <90) and requires blood transfusion. Damage control resuscitation employs 1:1:1 ratio (PRBC:FFP:Platelets) and permissive hypotension."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 3: Burns & Parkland Resuscitation
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('f4010001-0000-0000-0000-000000000003', 'f4d5e6f7-a0b1-2c3d-4e5f-6a7b8c9d0e1f', 'Burns, TBSA Assessment & Parkland Fluid Resuscitation', 3)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('f4010002-0000-0000-0000-000000000003', 'f4010001-0000-0000-0000-000000000003', 'Rule of Nines & Parkland Crystalloid Dosing', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('f4010003-0000-0000-0000-000000000003', 'f4010002-0000-0000-0000-000000000003', 'Parkland Formula (4 mL * kg * %TBSA)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('f4010004-0000-0000-0000-000000000003', 'f4010003-0000-0000-0000-000000000003', 'Escharotomy and Hourly Urine Output Endpoints', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('f4010005-0000-0000-0000-000000000003', 'f4010004-0000-0000-0000-000000000003', 'Burn Depth Classification, Fluid Resuscitation and Surgical Escharotomy', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('f4010006-0000-0000-0000-000000000003', 'f4010005-0000-0000-0000-000000000003', 'EXPLANATION', 1, 
'{"text": "### Burn Resuscitation & Critical Care\n\nParkland Formula calculates 24h Ringer lactate volume = 4 mL * kg * %TBSA (2nd/3rd degree). Deliver 50% in first 8h from time of injury and remaining 50% over next 16h. Target hourly urine output in adults is 0.5-1.0 mL/kg/h. Circumferential burns require urgent escharotomy."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 4: Minimally Invasive Laparoscopy & Inguinal Hernias
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('f4010001-0000-0000-0000-000000000004', 'f4d5e6f7-a0b1-2c3d-4e5f-6a7b8c9d0e1f', 'Minimally Invasive Laparoscopy, Inguinal Hernias & Wound Healing', 4)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('f4010002-0000-0000-0000-000000000004', 'f4010001-0000-0000-0000-000000000004', 'Pneumoperitoneum & Inguinal Anatomy', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('f4010003-0000-0000-0000-000000000004', 'f4010002-0000-0000-0000-000000000004', 'Hesselbach Triangle and Direct vs Indirect Hernias', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('f4010004-0000-0000-0000-000000000004', 'f4010003-0000-0000-0000-000000000004', 'CO2 Insufflation, Durant Maneuver and Suture Selection', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('f4010005-0000-0000-0000-000000000004', 'f4010004-0000-0000-0000-000000000004', 'Laparoscopic Mechanics, Inguinal Canal Anatomy and Wound Principles', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('f4010006-0000-0000-0000-000000000004', 'f4010005-0000-0000-0000-000000000004', 'EXPLANATION', 1, 
'{"text": "### Laparoscopy & Inguinal Anatomy\n\nIndirect inguinal hernias enter deep ring lateral to inferior epigastric vessels. Direct inguinal hernias protrude medial to inferior epigastric vessels through Hesselbach triangle. CO2 is the preferred insufflation gas at 12-15 mmHg; gas embolism is managed with Durant maneuver."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;
