-- V36: Seed General Medicine (MED-301) Full Curriculum

-- Ensure Subject: MED-301 exists with correct title and category
INSERT INTO subjects (id, semester_id, code, title, category)
VALUES ('f3c5d6e7-f9a0-1b2c-3d4e-5f6a7b8c9d0e', 'c7d8e9f0-b1c2-3d4e-5f6a-7b8c9d0e1f2a', 'MED-301', 'General Medicine', 'CLINICAL')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, category = EXCLUDED.category;

-- Unit 1: Cardiovascular Medicine
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('f3010001-0000-0000-0000-000000000001', 'f3c5d6e7-f9a0-1b2c-3d4e-5f6a7b8c9d0e', 'Cardiovascular Medicine & Acute Coronary Syndromes', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('f3010002-0000-0000-0000-000000000001', 'f3010001-0000-0000-0000-000000000001', 'STEMI, ECG Localization & Heart Failure', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('f3010003-0000-0000-0000-000000000001', 'f3010002-0000-0000-0000-000000000001', '12-Lead ECG STEMI Territories', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('f3010004-0000-0000-0000-000000000001', 'f3010003-0000-0000-0000-000000000001', 'HFrEF GDMT 4 Pillars and Valvular Murmurs', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('f3010005-0000-0000-0000-000000000001', 'f3010004-0000-0000-0000-000000000001', 'Acute Coronary Syndromes, Reperfusion Protocols and Heart Failure', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('f3010006-0000-0000-0000-000000000001', 'f3010005-0000-0000-0000-000000000001', 'EXPLANATION', 1, 
'{"text": "### Cardiovascular Internal Medicine\n\nSTEMI localization: Anterior (V1-V4 LAD), Inferior (II, III, aVF RCA), Lateral (I, aVL, V5-V6 LCx). Door-to-balloon time goal is <90 min for PCI. HFrEF GDMT mortality reduction requires ARNI/ACEi, beta-blocker, MRA, and SGLT2 inhibitor."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 2: Pulmonology & Critical Care
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('f3010001-0000-0000-0000-000000000002', 'f3c5d6e7-f9a0-1b2c-3d4e-5f6a7b8c9d0e', 'Pulmonology, Respiratory Mechanics & Critical Care', 2)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('f3010002-0000-0000-0000-000000000002', 'f3010001-0000-0000-0000-000000000002', 'Spirometry, PE & Acid-Base Disorders', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('f3010003-0000-0000-0000-000000000002', 'f3010002-0000-0000-0000-000000000002', 'Obstructive vs Restrictive Patterns', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('f3010004-0000-0000-0000-000000000002', 'f3010003-0000-0000-0000-000000000002', 'ABG Davenport Nomogram and Wells Score', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('f3010005-0000-0000-0000-000000000002', 'f3010004-0000-0000-0000-000000000002', 'Pulmonary Function Testing, Pulmonary Embolism and Critical Care ABG', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('f3010006-0000-0000-0000-000000000002', 'f3010005-0000-0000-0000-000000000002', 'EXPLANATION', 1, 
'{"text": "### Pulmonology & Critical Care\n\nFEV1/FVC <0.70 defines obstructive lung disease. DLCO is reduced in emphysema and ILD, normal in chronic bronchitis. Winter formula for metabolic acidosis respiratory compensation: PaCO2 = 1.5 * HCO3 + 8 (+/- 2)."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 3: Nephrology & Electrolytes
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('f3010001-0000-0000-0000-000000000003', 'f3c5d6e7-f9a0-1b2c-3d4e-5f6a7b8c9d0e', 'Nephrology, Glomerular Diseases & Electrolytes', 3)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('f3010002-0000-0000-0000-000000000003', 'f3010001-0000-0000-0000-000000000003', 'AKI KDIGO, FeNa & Electrolyte Emergencies', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('f3010003-0000-0000-0000-000000000003', 'f3010002-0000-0000-0000-000000000003', 'Prerenal vs ATN FeNa Differentiation', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('f3010004-0000-0000-0000-000000000003', 'f3010003-0000-0000-0000-000000000003', 'Hyperkalemia Protocol and Glomerulonephritis', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('f3010005-0000-0000-0000-000000000003', 'f3010004-0000-0000-0000-000000000003', 'Acute Kidney Injury, Fractional Sodium Excretion and Electrolyte Protocols', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('f3010006-0000-0000-0000-000000000003', 'f3010005-0000-0000-0000-000000000003', 'EXPLANATION', 1, 
'{"text": "### Nephrology & Electrolytes\n\nFeNa <1% with BUN/Cr >20:1 indicates prerenal azotemia; FeNa >2% with muddy brown casts indicates ATN. Severe hyperkalemia requires immediate IV Calcium Gluconate for cardiac membrane stabilization followed by Insulin+Dextrose."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 4: Endocrinology & Metabolism
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('f3010001-0000-0000-0000-000000000004', 'f3c5d6e7-f9a0-1b2c-3d4e-5f6a7b8c9d0e', 'Endocrinology, Diabetes & Metabolic Emergencies', 4)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('f3010002-0000-0000-0000-000000000004', 'f3010001-0000-0000-0000-000000000004', 'DKA vs HHS & Thyroid Storm', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('f3010003-0000-0000-0000-000000000004', 'f3010002-0000-0000-0000-000000000004', 'DKA Resuscitation and Potassium Limits', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('f3010004-0000-0000-0000-000000000004', 'f3010003-0000-0000-0000-000000000004', 'Thyroid Storm, Cushing and Addison Disease', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('f3010005-0000-0000-0000-000000000004', 'f3010004-0000-0000-0000-000000000004', 'Diabetic Emergencies, Thyroid Storm and Adrenocortical Syndromes', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('f3010006-0000-0000-0000-000000000004', 'f3010005-0000-0000-0000-000000000004', 'EXPLANATION', 1, 
'{"text": "### Endocrinology & Metabolism\n\nIn DKA, hold insulin if K+ <3.3 mEq/L until potassium is supplemented. Infuse regular insulin at 0.1 U/kg/h and add D5W when glucose drops below 200 mg/dL. Thyroid storm emergency therapy requires beta-blocker, PTU, potassium iodide, and hydrocortisone."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;
