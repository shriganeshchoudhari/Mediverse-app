-- V31: Seed Pathology & Pathophysiology (PATH-201) Full Curriculum

-- Ensure Subject: PATH-201 exists with correct title and category
INSERT INTO subjects (id, semester_id, code, title, category)
VALUES ('f3a4b5c6-d7e8-9f0a-1b2c-3d4e5f6a7b8c', 'c5d6e7f8-a9b0-1c2d-3e4f-5a6b7c8d9e0f', 'PATH-201', 'Pathology & Pathophysiology', 'PARA_CLINICAL')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, category = EXCLUDED.category;

-- Unit 1: Cell Injury, Adaptations & Inflammation
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('c1010001-0000-0000-0000-000000000001', 'f3a4b5c6-d7e8-9f0a-1b2c-3d4e5f6a7b8c', 'Cell Injury, Adaptations & Necrosis', 1)
ON CONFLICT DO NOTHING;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('c1010002-0000-0000-0000-000000000001', 'c1010001-0000-0000-0000-000000000001', 'Cell Death, Apoptosis & Leukocyte Recruitment', 1)
ON CONFLICT DO NOTHING;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('c1010003-0000-0000-0000-000000000001', 'c1010002-0000-0000-0000-000000000001', 'Coagulative vs Liquefactive Necrosis', 1)
ON CONFLICT DO NOTHING;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('c1010004-0000-0000-0000-000000000001', 'c1010003-0000-0000-0000-000000000001', 'Metaplasia, Apoptotic Caspases & Selectins', 1)
ON CONFLICT DO NOTHING;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('c1010005-0000-0000-0000-000000000001', 'c1010004-0000-0000-0000-000000000001', 'Cellular Injury, Patterns of Necrosis and Apoptosis', 'PUBLISHED', 1)
ON CONFLICT DO NOTHING;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('c1010006-0000-0000-0000-000000000001', 'c1010005-0000-0000-0000-000000000001', 'EXPLANATION', 1, 
'{"text": "### Cellular Adaptations & Necrosis\n\nCoagulative necrosis preserves cellular outlines and occurs in all solid organ ischemic infarctions except the brain (which undergoes liquefactive necrosis). Barrett esophagus represents intestinal metaplasia with goblet cells conferring increased adenocarcinoma risk."}'::jsonb)
ON CONFLICT DO NOTHING;

-- Unit 2: Neoplasia & Carcinogenesis
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('c1010001-0000-0000-0000-000000000002', 'f3a4b5c6-d7e8-9f0a-1b2c-3d4e5f6a7b8c', 'Neoplasia, Oncogenes & Tumor Suppressors', 2)
ON CONFLICT DO NOTHING;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('c1010002-0000-0000-0000-000000000002', 'c1010001-0000-0000-0000-000000000002', 'Hallmarks of Cancer & Molecular Genetics', 1)
ON CONFLICT DO NOTHING;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('c1010003-0000-0000-0000-000000000002', 'c1010002-0000-0000-0000-000000000002', 'Oncogenes and Knudson Two-Hit Hypothesis', 1)
ON CONFLICT DO NOTHING;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('c1010004-0000-0000-0000-000000000002', 'c1010003-0000-0000-0000-000000000002', 'TP53, RB1, BRCA1/2 and TNM Staging', 1)
ON CONFLICT DO NOTHING;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('c1010005-0000-0000-0000-000000000002', 'c1010004-0000-0000-0000-000000000002', 'Hallmarks of Cancer, Oncogenes and Tumor Suppressors', 'PUBLISHED', 1)
ON CONFLICT DO NOTHING;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('c1010006-0000-0000-0000-000000000002', 'c1010005-0000-0000-0000-000000000002', 'EXPLANATION', 1, 
'{"text": "### Neoplasia & Molecular Carcinogenesis\n\nTP53 is the guardian of the genome arresting cells at G1/S via p21. Burkitt lymphoma t(8;14) translocates c-MYC, producing a starry-sky appearance. TNM staging is the most critical prognostic predictor of patient survival."}'::jsonb)
ON CONFLICT DO NOTHING;

-- Unit 3: Hemodynamics & Thrombosis
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('c1010001-0000-0000-0000-000000000003', 'f3a4b5c6-d7e8-9f0a-1b2c-3d4e5f6a7b8c', 'Hemodynamics, Thrombosis & Embolism', 3)
ON CONFLICT DO NOTHING;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('c1010002-0000-0000-0000-000000000003', 'c1010001-0000-0000-0000-000000000003', 'Virchow Triad & Embolism Syndromes', 1)
ON CONFLICT DO NOTHING;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('c1010003-0000-0000-0000-000000000003', 'c1010002-0000-0000-0000-000000000003', 'Lines of Zahn and Deep Vein Thrombosis', 1)
ON CONFLICT DO NOTHING;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('c1010004-0000-0000-0000-000000000003', 'c1010003-0000-0000-0000-000000000003', 'Fat Embolism Triad & Red vs White Infarcts', 1)
ON CONFLICT DO NOTHING;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('c1010005-0000-0000-0000-000000000003', 'c1010004-0000-0000-0000-000000000003', 'Virchow Triad, Thrombus Architecture and Embolisms', 'PUBLISHED', 1)
ON CONFLICT DO NOTHING;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('c1010006-0000-0000-0000-000000000003', 'c1010005-0000-0000-0000-000000000003', 'EXPLANATION', 1, 
'{"text": "### Hemodynamics & Thrombosis\n\nLines of Zahn confirm pre-mortem thrombus formation in flowing circulation. Fat embolism syndrome presents with hypoxemia, neurological changes, and petechial rash 24-72 hours after long bone fractures."}'::jsonb)
ON CONFLICT DO NOTHING;

-- Unit 4: Systemic Histopathology & Diagnostic Stains
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('c1010001-0000-0000-0000-000000000004', 'f3a4b5c6-d7e8-9f0a-1b2c-3d4e5f6a7b8c', 'Systemic Histopathology & Special Stains', 4)
ON CONFLICT DO NOTHING;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('c1010002-0000-0000-0000-000000000004', 'c1010001-0000-0000-0000-000000000004', 'Myocardial Infarction Timeline & Nephropathies', 1)
ON CONFLICT DO NOTHING;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('c1010003-0000-0000-0000-000000000004', 'c1010002-0000-0000-0000-000000000004', 'Post-MI Mechanical Rupture Timeline', 1)
ON CONFLICT DO NOTHING;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('c1010004-0000-0000-0000-000000000004', 'c1010003-0000-0000-0000-000000000004', 'Glomerular Crescents and Congo Red Polarized Staining', 1)
ON CONFLICT DO NOTHING;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('c1010005-0000-0000-0000-000000000004', 'c1010004-0000-0000-0000-000000000004', 'Post-MI Histological Stages and Diagnostic Histochemistry', 'PUBLISHED', 1)
ON CONFLICT DO NOTHING;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('c1010006-0000-0000-0000-000000000004', 'c1010005-0000-0000-0000-000000000004', 'EXPLANATION', 1, 
'{"text": "### Systemic Histopathology & Stains\n\nPeak risk of myocardial free wall rupture occurs between days 4-7 post-MI due to macrophage enzymatic lysis. Congo Red stain under polarized light demonstrates pathognomonic apple-green birefringence in amyloid deposits."}'::jsonb)
ON CONFLICT DO NOTHING;
