-- V35: Seed Community Medicine & Public Health (COMM-201) Full Curriculum

-- Ensure Subject: COMM-201 exists with correct title and category
INSERT INTO subjects (id, semester_id, code, title, category)
VALUES ('f7e8f9a0-b1c2-3d4e-5f6a-7b8c9d0e1f2a', 'c5d6e7f8-a9b0-1c2d-3e4f-5a6b7c8d9e0f', 'COMM-201', 'Community Medicine & Public Health', 'CLINICAL')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, category = EXCLUDED.category;

-- Unit 1: Epidemiological Study Designs
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('f7010001-0000-0000-0000-000000000001', 'f7e8f9a0-b1c2-3d4e-5f6a-7b8c9d0e1f2a', 'Epidemiological Study Designs & Association Metrics', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('f7010002-0000-0000-0000-000000000001', 'f7010001-0000-0000-0000-000000000001', 'Cohort, Case-Control & Experimental Studies', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('f7010003-0000-0000-0000-000000000001', 'f7010002-0000-0000-0000-000000000001', 'Odds Ratio vs Relative Risk', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('f7010004-0000-0000-0000-000000000001', 'f7010003-0000-0000-0000-000000000001', 'Attributable Risk, NNT and Study Biases', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('f7010005-0000-0000-0000-000000000001', 'f7010004-0000-0000-0000-000000000001', 'Epidemiological Study Designs, Risk Metrics and Systematic Biases', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('f7010006-0000-0000-0000-000000000001', 'f7010005-0000-0000-0000-000000000001', 'EXPLANATION', 1, 
'{"text": "### Epidemiological Study Designs\n\nCase-control studies group patients by disease status and calculate Odds Ratio (OR = ad/bc), subject to recall bias. Cohort studies group patients by exposure status and calculate Relative Risk (RR = Ie/Iu). Number Needed to Treat equals 1/ARR."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 2: Biostatistics & Diagnostic Screening
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('f7010001-0000-0000-0000-000000000002', 'f7e8f9a0-b1c2-3d4e-5f6a-7b8c9d0e1f2a', 'Biostatistics, Diagnostic Screening & ROC Curves', 2)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('f7010002-0000-0000-0000-000000000002', 'f7010001-0000-0000-0000-000000000002', '2x2 Contingency Matrix & Test Accuracy', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('f7010003-0000-0000-0000-000000000002', 'f7010002-0000-0000-0000-000000000002', 'Sensitivity (SnNOut) and Specificity (SpPIn)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('f7010004-0000-0000-0000-000000000002', 'f7010003-0000-0000-0000-000000000002', 'PPV, NPV, Prevalence and ROC Plots', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('f7010005-0000-0000-0000-000000000002', 'f7010004-0000-0000-0000-000000000002', 'Biostatistics, Diagnostic 2x2 Matrix, Predictive Values and ROC Curves', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('f7010006-0000-0000-0000-000000000002', 'f7010005-0000-0000-0000-000000000002', 'EXPLANATION', 1, 
'{"text": "### Diagnostic Screening Tests\n\nSensitivity = TP / (TP + FN) (SnNOut rules out). Specificity = TN / (TN + FP) (SpPIn rules in). PPV is directly proportional to disease prevalence. ROC curve plots Sensitivity vs 1-Specificity."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 3: Infectious Disease Dynamics & Prevention
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('f7010001-0000-0000-0000-000000000003', 'f7e8f9a0-b1c2-3d4e-5f6a-7b8c9d0e1f2a', 'Infectious Disease Dynamics & Levels of Prevention', 3)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('f7010002-0000-0000-0000-000000000003', 'f7010001-0000-0000-0000-000000000003', 'R0 Modeling & Public Health Tiers', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('f7010003-0000-0000-0000-000000000003', 'f7010002-0000-0000-0000-000000000003', 'Herd Immunity Threshold (HIT = 1 - 1/R0)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('f7010004-0000-0000-0000-000000000003', 'f7010003-0000-0000-0000-000000000003', 'The 5 Levels of Prevention', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('f7010005-0000-0000-0000-000000000003', 'f7010004-0000-0000-0000-000000000003', 'Infectious Disease Dynamics, Herd Immunity Threshold and 5 Levels of Prevention', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('f7010006-0000-0000-0000-000000000003', 'f7010005-0000-0000-0000-000000000003', 'EXPLANATION', 1, 
'{"text": "### Infectious Dynamics & Prevention\n\nHerd Immunity Threshold equals 1 - 1/R0 (Measles R0=18 -> 94.4%). Prevention levels: Primordial (social determinants), Primary (immunization), Secondary (early screening), Tertiary (rehabilitation), Quaternary (deprescribing)."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 4: Demography & Health Economics
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('f7010001-0000-0000-0000-000000000004', 'f7e8f9a0-b1c2-3d4e-5f6a-7b8c9d0e1f2a', 'Demography, Vital Health Indicators & Health Economics', 4)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('f7010002-0000-0000-0000-000000000004', 'f7010001-0000-0000-0000-000000000004', 'Vital Statistics & Global Burden of Disease', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('f7010003-0000-0000-0000-000000000004', 'f7010002-0000-0000-0000-000000000004', 'IMR, MMR and Replacement TFR (2.1)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('f7010004-0000-0000-0000-000000000004', 'f7010003-0000-0000-0000-000000000004', 'DALYs, QALYs and Cost-Effectiveness ICER', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('f7010005-0000-0000-0000-000000000004', 'f7010004-0000-0000-0000-000000000004', 'Demography, Vital Statistics, DALYs, QALYs and Health Economics', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('f7010006-0000-0000-0000-000000000004', 'f7010005-0000-0000-0000-000000000004', 'EXPLANATION', 1, 
'{"text": "### Demography & Health Economics\n\nInfant Mortality Rate (IMR per 1,000 live births) is the most sensitive population health index. Total Fertility Rate replacement is 2.1. DALY = YLL + YLD. ICER = delta Cost / delta QALY."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;
