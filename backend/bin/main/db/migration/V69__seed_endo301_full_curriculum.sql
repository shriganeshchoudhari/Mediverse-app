-- V69: Seed Clinical Endocrinology & Metabolic Pathophysiology (ENDO-301) Full Curriculum

-- Ensure Subject: ENDO-301 exists with correct title and category
INSERT INTO subjects (id, semester_id, code, title, category)
VALUES ('f1d0a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a27', 'c7d8e9f0-b1c2-3d4e-5f6a-7b8c9d0e1f2a', 'ENDO-301', 'Clinical Endocrinology & Metabolic Pathophysiology', 'CLINICAL')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, category = EXCLUDED.category;

-- Unit 1: Adrenal Pathophysiology: Cushing, Addison, Conn & Pheochromocytoma
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa310001-0000-0000-0000-000000000001', 'f1d0a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a27', 'Adrenal Pathophysiology: Cushing, Addison, Conn & Pheochromocytoma', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa310002-0000-0000-0000-000000000001', 'fa310001-0000-0000-0000-000000000001', 'Cushing Syndrome Algorithm (High-Dose 8 mg DST Suppression)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa310003-0000-0000-0000-000000000001', 'fa310002-0000-0000-0000-000000000001', 'Primary Adrenal Insufficiency Addison & Cosyntropin Stimulation', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa310004-0000-0000-0000-000000000001', 'fa310003-0000-0000-0000-000000000001', 'Conn Syndrome (ARR >20-30) & Pheochromocytoma Alpha-Blockade', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa310005-0000-0000-0000-000000000001', 'fa310004-0000-0000-0000-000000000001', 'Zona Glomerulosa Mineralocorticoid Pathways, Pituitary Dexamethasone Receptors, Adrenocortical Crisis Hydrocortisone Resuscitation, and Unopposed Alpha Vasoconstriction Risks', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa310006-0000-0000-0000-000000000001', 'fa310005-0000-0000-0000-000000000001', 'EXPLANATION', 1, 
'{"text": "### Adrenal Pathophysiology\n\nCushing Syndrome: 24h UFC/salivary cortisol/1 mg DST -> ACTH (<5 adrenal vs >20 pituitary/ectopic). High-dose (8 mg) DST: suppresses >50% in Cushing Disease (pituitary adenoma); fails in Ectopic SCLC. Primary Adrenal Insufficiency (Addison): Cortisol + Aldosterone deficiency, high ACTH hyperpigmentation, hyperkalemia, Cosyntropin <18 ug/dL (Crisis: IV Hydrocortisone 100 mg + Saline/Dextrose). Conn Syndrome: ARR >20-30, hypokalemic alkalosis -> surgery or Spironolactone. Pheochromocytoma: 24h urinary fractionated metanephrines; MANDATORY alpha-blocker (Phenoxybenzamine) 10-14 days BEFORE beta-blocker!"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 2: Thyroid Pathophysiology: Graves, Hashimoto, Storm & Myxedema
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa310001-0000-0000-0000-000000000002', 'f1d0a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a27', 'Thyroid Pathophysiology: Graves, Hashimoto, Storm & Myxedema', 2)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa310002-0000-0000-0000-000000000002', 'fa310001-0000-0000-0000-000000000002', 'Graves Disease (TSI, Diffuse High RAIU & Orbitopathy)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa310003-0000-0000-0000-000000000002', 'fa310002-0000-0000-0000-000000000002', 'Thyroid Storm 4-Step Emergency Protocol (Beta-Blocker/PTU/Iodine/Steroids)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa310004-0000-0000-0000-000000000002', 'fa310003-0000-0000-0000-000000000002', 'Hashimoto Lymphoma Risk & Myxedema Coma Hypothermia', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa310005-0000-0000-0000-000000000002', 'fa310004-0000-0000-0000-000000000002', 'Thyrotropin Receptor Glycosaminoglycan Accumulations, Wolff-Chaikoff Sequential Iodine Blocks, Oxyphilic Hürthle Metaplasia, and Triiodothyronine Hypometabolic Resuscitation', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa310006-0000-0000-0000-000000000002', 'fa310005-0000-0000-0000-000000000002', 'EXPLANATION', 1, 
'{"text": "### Thyroid Pathophysiology\n\nGraves Disease: TSI autoantibodies, diffuse high RAIU uptake, proptosis, pretibial myxedema. Thyroid Storm: Temp >40C, AFib, delirium -> 4-Step Protocol: (1) IV Propranolol, (2) PTU, (3) Lugol Iodine (delayed >=1h after PTU to prevent substrate fueling), (4) IV Hydrocortisone (aspirin contraindicated). Hashimoto Thyroiditis: Anti-TPO, germinal centers, Hürthle cells, Thyroid B-cell Lymphoma risk. Myxedema Coma: Hypothermia (<35C), bradycardia, coma -> IV Hydrocortisone (before T4) + IV Levothyroxine (T4)/Liothyronine (T3)."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 3: Calcium Homeostasis & Parathyroid Disorders
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa310001-0000-0000-0000-000000000003', 'f1d0a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a27', 'Calcium Homeostasis & Parathyroid Disorders', 3)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa310002-0000-0000-0000-000000000003', 'fa310001-0000-0000-0000-000000000003', 'Primary Hyperparathyroidism vs FHH (CCCR <0.01 Rule)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa310003-0000-0000-0000-000000000003', 'fa310002-0000-0000-0000-000000000003', 'Humoral Hypercalcemia of Malignancy (Squamous Cell PTHrP)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa310004-0000-0000-0000-000000000003', 'fa310003-0000-0000-0000-000000000003', 'Hypocalcemic Tetany (Chvostek, Trousseau & IV Calcium Gluconate)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa310005-0000-0000-0000-000000000003', 'fa310004-0000-0000-0000-000000000003', 'Calcium-Sensing Receptor Set-Point Kinetics, Renal Calcium Clearance Ratios, Parathyroid Hormone-Related Protein Assays, and Voltage-Gated Sodium Channel Hyperexcitability', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa310006-0000-0000-0000-000000000003', 'fa310005-0000-0000-0000-000000000003', 'EXPLANATION', 1, 
'{"text": "### Calcium Homeostasis\n\nPrimary Hyperparathyroidism (PHPT): Solitary adenoma (85%), High Ca + High/Normal PTH + High 24h Urine Ca (>200 mg/24h), stones/bones/groans. Familial Hypocalciuric Hypercalcemia (FHH): CASR mutation, High Ca + Normal/High PTH + EXTREMELY LOW Urine Ca (CCCR <0.01); Benign (DO NOT OPERATE!). Humoral Hypercalcemia of Malignancy (HHM): Squamous cell carcinoma producing PTHrP -> High Ca + SUPPRESSED intact PTH (<5 pg/mL). Hypocalcemia: Chvostek (facial twitch) and Trousseau (carpopedal spasm with BP cuff) signs, long QTc -> IV Calcium Gluconate."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 4: Multiple Endocrine Neoplasia & Pituitary Syndromes
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa310001-0000-0000-0000-000000000004', 'f1d0a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a27', 'Multiple Endocrine Neoplasia & Pituitary Syndromes', 4)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa310002-0000-0000-0000-000000000004', 'fa310001-0000-0000-0000-000000000004', 'MEN 1 Wermer (3 Ps: Pituitary, Parathyroid & Pancreas - Menin)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa310003-0000-0000-0000-000000000004', 'fa310002-0000-0000-0000-000000000004', 'MEN 2A & 2B (RET Proto-Oncogene, Medullary Thyroid Ca & Mucosal Neuromas)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa310004-0000-0000-0000-000000000004', 'fa310003-0000-0000-0000-000000000004', 'Diabetes Insipidus (Central Desmopressin Responsive vs Nephrogenic)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa310005-0000-0000-0000-000000000004', 'fa310004-0000-0000-0000-000000000004', 'Menin Tumor Suppressor Pathways, RET Receptor Tyrosine Kinase Activation, Amyloid Stroma Birefringence, and V2 Vasopressin Aquaporin Translocation', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa310006-0000-0000-0000-000000000004', 'fa310005-0000-0000-0000-000000000004', 'EXPLANATION', 1, 
'{"text": "### MEN & Diabetes Insipidus\n\nMEN 1 (Menin): 3 Ps: Pituitary (Prolactinoma), Parathyroid (Hyperplasia 95%), Pancreas (Gastrinoma Zollinger-Ellison, Insulinoma). MEN 2A (RET): 2 Ps: Parathyroid hyperplasia, Pheochromocytoma, Medullary Thyroid Carcinoma (100% calcitonin amyloid). MEN 2B (RET M918T): 1 P: Pheo, Aggressive MTC in infancy, Mucosal Neuromas (tongue/lips), Marfanoid Habitus (NO parathyroid!). Diabetes Insipidus: Water deprivation test -> Central DI responds to Desmopressin (>50% rise in urine Osm); Nephrogenic DI (Lithium) fails to respond (<10%)."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;
