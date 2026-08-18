-- V38: Seed Obstetrics & Gynecology (OBG-301) Full Curriculum

-- Ensure Subject: OBG-301 exists with correct title and category
INSERT INTO subjects (id, semester_id, code, title, category)
VALUES ('f5e5f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a', 'c7d8e9f0-b1c2-3d4e-5f6a-7b8c9d0e1f2a', 'OBG-301', 'Obstetrics & Gynecology', 'CLINICAL')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, category = EXCLUDED.category;

-- Unit 1: Mechanism of Normal Labor & Partograph
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('f5010001-0000-0000-0000-000000000001', 'f5e5f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a', 'Mechanism of Normal Labor & WHO Partograph', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('f5010002-0000-0000-0000-000000000001', 'f5010001-0000-0000-0000-000000000001', 'Cardinal Movements & Partograph Tracking', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('f5010003-0000-0000-0000-000000000001', 'f5010002-0000-0000-0000-000000000001', '7 Cardinal Movements of Labor (LOA)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('f5010004-0000-0000-0000-000000000001', 'f5010003-0000-0000-0000-000000000001', 'Alert Line, Action Line and Obstructed Labor', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('f5010005-0000-0000-0000-000000000001', 'f5010004-0000-0000-0000-000000000001', 'Labor Mechanics, Cardinal Movements and WHO Partograph Assessment', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('f5010006-0000-0000-0000-000000000001', 'f5010005-0000-0000-0000-000000000001', 'EXPLANATION', 1, 
'{"text": "### Mechanism of Normal Labor & Partograph\n\nEngagement occurs at Station 0 when the biparietal diameter (9.5 cm) passes the pelvic inlet. Active phase dilation progresses at >=1.0 cm/h. Crossing the WHO Partograph Action line signifies cephalopelvic disproportion requiring emergency cesarean section."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 2: Postpartum Hemorrhage & Uterotonics
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('f5010001-0000-0000-0000-000000000002', 'f5e5f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a', 'Postpartum Hemorrhage, 4Ts & Uterotonics', 2)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('f5010002-0000-0000-0000-000000000002', 'f5010001-0000-0000-0000-000000000002', '4Ts Etiologies & Uterotonic Cascade', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('f5010003-0000-0000-0000-000000000002', 'f5010002-0000-0000-0000-000000000002', 'Uterine Atony and Drug Contraindications', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('f5010004-0000-0000-0000-000000000002', 'f5010003-0000-0000-0000-000000000002', 'Bakri Balloon, B-Lynch and Hysterectomy', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('f5010005-0000-0000-0000-000000000002', 'f5010004-0000-0000-0000-000000000002', 'Postpartum Hemorrhage Management, Uterotonic Protocols and Surgical Control', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('f5010006-0000-0000-0000-000000000002', 'f5010005-0000-0000-0000-000000000002', 'EXPLANATION', 1, 
'{"text": "### Postpartum Hemorrhage (PPH)\n\nUterine atony is the most common cause (80%). Stepwise uterotonic cascade: 1. Oxytocin -> 2. Ergometrine (avoid in hypertension) -> 3. Carboprost (avoid in asthma) -> 4. Misoprostol + TXA. Mechanical control employs Bakri balloon tamponade and B-Lynch brace sutures."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 3: Hypertensive Pregnancy & MgSO4
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('f5010001-0000-0000-0000-000000000003', 'f5e5f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a', 'Hypertensive Disorders of Pregnancy & MgSO4 Protocol', 3)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('f5010002-0000-0000-0000-000000000003', 'f5010001-0000-0000-0000-000000000003', 'Preeclampsia, HELLP & Magnesium Therapy', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('f5010003-0000-0000-0000-000000000003', 'f5010002-0000-0000-0000-000000000003', 'Preeclampsia Severe Features & Zuspan Dosing', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('f5010004-0000-0000-0000-000000000003', 'f5010003-0000-0000-0000-000000000003', 'Magnesium Toxicity, Reflex Loss and Calcium Antidote', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('f5010005-0000-0000-0000-000000000003', 'f5010004-0000-0000-0000-000000000003', 'Preeclampsia Severe Features, HELLP Syndrome and MgSO4 Seizure Prophylaxis', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('f5010006-0000-0000-0000-000000000003', 'f5010005-0000-0000-0000-000000000003', 'EXPLANATION', 1, 
'{"text": "### Preeclampsia & Magnesium Sulfate Protocol\n\nTherapeutic MgSO4 range is 4-7 mEq/L. Loss of patellar deep tendon reflexes (8-10 mEq/L) is the earliest sign of toxicity; respiratory arrest occurs at >12 mEq/L. Definitive antidote is IV 10% Calcium Gluconate (10 mL slow IV over 3-5 min)."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 4: APH & Cardiotocography CTG
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('f5010001-0000-0000-0000-000000000004', 'f5e5f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a', 'Antepartum Hemorrhage & CTG Fetal Monitoring', 4)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('f5010002-0000-0000-0000-000000000004', 'f5010001-0000-0000-0000-000000000004', 'Previa vs Abruptio & CTG Decelerations', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('f5010003-0000-0000-0000-000000000004', 'f5010002-0000-0000-0000-000000000004', 'Early vs Late vs Variable Decelerations', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('f5010004-0000-0000-0000-000000000004', 'f5010003-0000-0000-0000-000000000004', 'Placenta Previa Strict No-Digital Exam Rule', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('f5010005-0000-0000-0000-000000000004', 'f5010004-0000-0000-0000-000000000004', 'Antepartum Hemorrhage Differentiation, CTG Decelerations and Cord Prolapse', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('f5010006-0000-0000-0000-000000000004', 'f5010005-0000-0000-0000-000000000004', 'EXPLANATION', 1, 
'{"text": "### Antepartum Hemorrhage & CTG Monitoring\n\nPlacenta Previa presents with painless bright red bleeding (digital vaginal exam strictly forbidden). Placental Abruption presents with painful dark bleeding and woody hard uterus. Late decelerations reflect uteroplacental insufficiency requiring immediate intrauterine resuscitation."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;
