-- V45: Seed Radiodiagnosis & Imaging (RAD-301) Full Curriculum

-- Ensure Subject: RAD-301 exists with correct title and category
INSERT INTO subjects (id, semester_id, code, title, category)
VALUES ('f9d7a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0e', 'c9d0e1f2-b3c4-5d6e-7f8a-9b0c1d2e3f4a', 'RAD-301', 'Radiodiagnosis & Imaging', 'CLINICAL')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, category = EXCLUDED.category;

-- Unit 1: Systematic Chest Radiography & Silhouette Sign
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa070001-0000-0000-0000-000000000001', 'f9d7a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0e', 'Systematic Chest Radiography, RIPE, ABCDE & Silhouette Sign', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa070002-0000-0000-0000-000000000001', 'fa070001-0000-0000-0000-000000000001', 'RIPE Technical Adequacy & ABCDE Review', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa070003-0000-0000-0000-000000000001', 'fa070002-0000-0000-0000-000000000001', 'The Silhouette Sign & Lobar Consolidation Differentiation', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa070004-0000-0000-0000-000000000001', 'fa070003-0000-0000-0000-000000000001', 'Pneumothorax Deep Sulcus Sign & CHF Kerley B Lines', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa070005-0000-0000-0000-000000000001', 'fa070004-0000-0000-0000-000000000001', 'Systematic Chest Radiograph Interpretation, Silhouette Signs, Air Bronchograms and Thoracic Emergencies', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa070006-0000-0000-0000-000000000001', 'fa070005-0000-0000-0000-000000000001', 'EXPLANATION', 1, 
'{"text": "### Systematic Chest Radiography\n\nImage adequacy requires RIPE review: Rotation (clavicle equidistant), Inspiration (9-10 posterior ribs), Projection (PA vs AP portable magnification >15%), and Exposure. Systematic ABCDE review detects tracheal shift (contralateral in tension pneumothorax/effusion vs ipsilateral in atelectasis), Silhouette Sign (RML effaces right heart border; Lingula effaces left heart border; Lower lobe effaces diaphragm), Air Bronchograms, Deep Sulcus Sign in supine pneumothorax, and Kerley B lines in pulmonary edema."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 2: Non-Contrast Head CT & Neurotrauma
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa070001-0000-0000-0000-000000000002', 'f9d7a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0e', 'Non-Contrast Head CT, EDH vs SDH vs SAH & Acute Stroke', 2)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa070002-0000-0000-0000-000000000002', 'fa070001-0000-0000-0000-000000000002', 'Hounsfield Units & Fresh Blood Hyperdensity', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa070003-0000-0000-0000-000000000002', 'fa070002-0000-0000-0000-000000000002', 'Epidural vs Subdural Hematoma Suture Boundaries', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa070004-0000-0000-0000-000000000002', 'fa070003-0000-0000-0000-000000000002', 'Subarachnoid Hemorrhage & Early Stroke NCCT Signs', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa070005-0000-0000-0000-000000000002', 'fa070004-0000-0000-0000-000000000002', 'Non-Contrast Head CT in Neurotrauma, Intracranial Hemorrhages, Suture Mechanics and Stroke Triage', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa070006-0000-0000-0000-000000000002', 'fa070005-0000-0000-0000-000000000002', 'EXPLANATION', 1, 
'{"text": "### Head CT in Neurotrauma\n\nFresh blood is hyperdense (+50 to +80 HU). Epidural Hematoma (EDH) is a biconvex lens caused by middle meningeal artery laceration that CANNOT cross sutures. Subdural Hematoma (SDH) is a crescentic collection from torn bridging veins that CROSSES cranial sutures. Subarachnoid Hemorrhage (SAH) fills basal cisterns (star of death) and sulci; if CT is negative, lumbar puncture for xanthochromia is required. Early stroke shows hyperdense MCA sign and insular ribbon loss."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 3: Emergency Trauma Ultrasound E-FAST & Abdominal CT
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa070001-0000-0000-0000-000000000003', 'f9d7a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0e', 'Emergency Trauma Ultrasound E-FAST & Abdominal CT', 3)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa070002-0000-0000-0000-000000000003', 'fa070001-0000-0000-0000-000000000003', 'FAST 4 Standard Acoustic Windows & Morison Pouch', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa070003-0000-0000-0000-000000000003', 'fa070002-0000-0000-0000-000000000003', 'E-FAST Lung Sliding & Pneumothorax M-Mode Signs', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa070004-0000-0000-0000-000000000003', 'fa070003-0000-0000-0000-000000000003', 'Acute Abdominal CT Signs: Rigler & Appendicitis', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa070005-0000-0000-0000-000000000003', 'fa070004-0000-0000-0000-000000000003', 'Point-of-Care Ultrasound E-FAST Protocol, Peritoneal Recesses, Lung Sliding and Abdominal CT Pathology', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa070006-0000-0000-0000-000000000003', 'fa070005-0000-0000-0000-000000000003', 'EXPLANATION', 1, 
'{"text": "### E-FAST Ultrasound & Abdominal CT\n\nFAST examines 4 acoustic windows: Morison pouch (RUQ hepatorenal, most dependent supine space), splenorenal recess, pelvic pouch of Douglas, and subxiphoid pericardium (tamponade). Unstable trauma with positive FAST indicates immediate exploratory laparotomy. Thoracic E-FAST evaluates lung sliding (M-mode seashore sign) vs pneumothorax (M-mode barcode sign and lung point). Abdominal CT identifies Rigler sign pneumoperitoneum and appendicitis (>6mm diameter)."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 4: Radiation Protection ALARA & MRI Physics
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa070001-0000-0000-0000-000000000004', 'f9d7a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0e', 'Radiation Protection ALARA, MRI Physics & Contrast Safety', 4)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa070002-0000-0000-0000-000000000004', 'fa070001-0000-0000-0000-000000000004', 'ALARA Principles, Inverse Square Law & Lead Shielding', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa070003-0000-0000-0000-000000000004', 'fa070002-0000-0000-0000-000000000004', 'MRI Tissue Contrast Physics: T1, T2 & FLAIR', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa070004-0000-0000-0000-000000000004', 'fa070003-0000-0000-0000-000000000004', 'Diffusion-Weighted Imaging DWI in Stroke & Gadolinium NSF', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa070005-0000-0000-0000-000000000004', 'fa070004-0000-0000-0000-000000000004', 'Radiation Safety Physics, ALARA Principles, MRI Pulse Sequences, DWI Cytotoxic Edema and Contrast Risks', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa070006-0000-0000-0000-000000000004', 'fa070005-0000-0000-0000-000000000004', 'EXPLANATION', 1, 
'{"text": "### MRI Physics & Radiation Safety\n\nALARA principle utilizes Time, Distance (Inverse Square Law I = 1/d^2), and Shielding (0.5mm Pb lead aprons). Deterministic effects have dose thresholds (skin burns, cataracts); stochastic effects have no threshold (carcinogenesis). MRI sequences: T1 (fat bright, fluid dark), T2 (fluid bright), FLAIR (CSF suppressed for MS demyelinating plaques), and DWI/ADC (cytotoxic edema restricted diffusion in acute stroke within minutes). Gadolinium causes Nephrogenic Systemic Fibrosis in GFR <30 mL/min."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;
