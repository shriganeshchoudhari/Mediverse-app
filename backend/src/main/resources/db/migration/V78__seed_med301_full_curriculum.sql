-- V78: Seed Clinical Internal Medicine (MED-301) Full Curriculum

-- Ensure Subject: MED-301 exists with correct title and category
INSERT INTO subjects (id, semester_id, code, title, category)
VALUES ('f1d0a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a36', 'c7d8e9f0-b1c2-3d4e-5f6a-7b8c9d0e1f2a', 'MED-301', 'Clinical Internal Medicine: Advanced Cardiology, Pulmonology & Nephrology', 'CLINICAL')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, category = EXCLUDED.category;

-- Unit 1: Acute Coronary Syndromes, ECG Culprit Localization & Revascularization
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa400001-0000-0000-0000-000000000001', 'f1d0a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a36', 'Acute Coronary Syndromes, ECG Culprit Localization & Revascularization', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa400002-0000-0000-0000-000000000001', 'fa400001-0000-0000-0000-000000000001', 'Anterior STEMI (LAD V1-V4 Occlusion) & Emergent Primary PCI <=90 min', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa400003-0000-0000-0000-000000000001', 'fa400002-0000-0000-0000-000000000001', 'Inferior STEMI (RCA II, III, aVF) & Right Ventricular Infarct Preload Caution', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa400004-0000-0000-0000-000000000001', 'fa400003-0000-0000-0000-000000000001', 'Lateral LCx Papillary Muscle Rupture & Posterior PDA Reciprocal Signs', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa400005-0000-0000-0000-000000000001', 'fa400004-0000-0000-0000-000000000001', 'Transmural Coronary Thromboses, Right Ventricular Preload Dependencies, Papillary Muscle Chordal Ruptures, and Primary Percutaneous Coronary Revascularizations', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa400006-0000-0000-0000-000000000001', 'fa400005-0000-0000-0000-000000000001', 'EXPLANATION', 1, 
'{"text": "### Acute Coronary Syndromes (ACS)\n\nAnterior STEMI: V1-V4 ST elevation (LAD culprit, highest risk of shock/rupture -> primary PCI <=90 min). Inferior STEMI: II, III, aVF ST elevation (RCA culprit; check right-sided V4R for RV infarction -> hypotension + elevated JVP + clear lungs -> treat with IV Saline boluses; STRICTLY AVOID nitrates, morphine, diuretics!). Lateral: I, aVL, V5-V6 (LCx -> acute MR). Posterior: ST depressions V1-V3 with tall R waves (PDA -> obtain V7-V9)."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 2: Heart Failure with Reduced Ejection Fraction & 4-Pillar GDMT
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa400001-0000-0000-0000-000000000002', 'f1d0a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a36', 'Heart Failure with Reduced Ejection Fraction & 4-Pillar GDMT', 2)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa400002-0000-0000-0000-000000000002', 'fa400001-0000-0000-0000-000000000002', 'Pillar 1: ARNI (Sacubitril/Valsartan) & Mandatory 36-Hour ACEi Washout', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa400003-0000-0000-0000-000000000002', 'fa400002-0000-0000-0000-000000000002', 'Pillar 2: Evidence-Based Mortality Beta-Blockers (Metoprolol Succinate/Carvedilol)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa400004-0000-0000-0000-000000000002', 'fa400003-0000-0000-0000-000000000002', 'Pillars 3 & 4: MRA (Spironolactone) and SGLT2i (Dapagliflozin Cardiorenal Benefit)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa400005-0000-0000-0000-000000000002', 'fa400004-0000-0000-0000-000000000002', 'Neprilysin Peptidase Halts, Adrenergic Neurohormonal Counter-Regulatory Blocks, Mineralocorticoid Fibrotic Inactivations, and Renal Proximal Glycosuric Decongestions', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa400006-0000-0000-0000-000000000002', 'fa400005-0000-0000-0000-000000000002', 'EXPLANATION', 1, 
'{"text": "### HFrEF 4-Pillar GDMT (LVEF <=40%)\n\n1. ARNI (Sacubitril/Valsartan): >20% mortality reduction; mandatory 36-hour washout from ACEi to prevent fatal angioedema. 2. Beta-Blocker: Metoprolol Succinate, Carvedilol, or Bisoprolol (>30% mortality reduction; titrate when euvolemic). 3. MRA: Spironolactone or Eplerenone (>30% mortality reduction; monitor K+ and creatinine). 4. SGLT2i: Dapagliflozin or Empagliflozin (>25% CV death/HF hosp reduction REGARDLESS of diabetes status)."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 3: Advanced Acid-Base Disorders & Systematic ABG Algorithm
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa400001-0000-0000-0000-000000000003', 'f1d0a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a36', 'Advanced Acid-Base Disorders & Systematic ABG Algorithm', 3)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa400002-0000-0000-0000-000000000003', 'fa400001-0000-0000-0000-000000000003', 'Serum Anion Gap Calculation, Albumin Corrections & GOLD MARK HAGMA', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa400003-0000-0000-0000-000000000003', 'fa400002-0000-0000-0000-000000000003', 'Winter Formula Expected PaCO2 Respiratory Compensation Rules', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa400004-0000-0000-0000-000000000003', 'fa400003-0000-0000-0000-000000000003', 'Delta-Delta Ratio Mixed Disturbances & Toxic Alcohol Osmolar Gaps', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa400005-0000-0000-0000-000000000003', 'fa400004-0000-0000-0000-000000000003', 'Unmeasured Fixed Anion Dissociations, Medullary Alveolar Hyperventilations, Triple Mixed Acid-Base Dynamics, and Osmotic Xenobiotic Colligative Gradients', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa400006-0000-0000-0000-000000000003', 'fa400005-0000-0000-0000-000000000003', 'EXPLANATION', 1, 
'{"text": "### 5-Step Systematic ABG Algorithm\n\n1. pH status (Acidemia <7.35 vs Alkalemia >7.45). 2. Primary disturbance (Metabolic vs Respiratory). 3. Anion Gap = Na - (Cl + HCO3) [add 2.5 per 1 g/dL albumin drop below 4.0]. 4. Winter Formula: Expected PaCO2 = 1.5 * [HCO3] + 8 +/- 2. 5. Delta-Delta Ratio = (AG - 12) / (24 - HCO3): <0.4-0.8 indicates combined HAGMA + NAGMA; 1.0-2.0 indicates pure HAGMA; >2.0 indicates combined HAGMA + Metabolic Alkalosis (e.g., DKA + vomiting). Osmolar gap >10 in HAGMA confirms toxic alcohol ingestion (Fomepizole DOC)."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 4: Acute Kidney Injury KDIGO Staging, FeNa & Urinary Sediment
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa400001-0000-0000-0000-000000000004', 'f1d0a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a36', 'Acute Kidney Injury KDIGO Staging, FeNa & Urinary Sediment', 4)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa400002-0000-0000-0000-000000000004', 'fa400001-0000-0000-0000-000000000004', 'KDIGO AKI Stages 1-3 Creatinine & Oliguria Consensus Definitions', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa400003-0000-0000-0000-000000000004', 'fa400002-0000-0000-0000-000000000004', 'Prerenal Azotemia FeNa <1% & Concentrated Urine Microscopic Hyaline Casts', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa400004-0000-0000-0000-000000000004', 'fa400003-0000-0000-0000-000000000004', 'Ischemic ATN Muddy Brown Casts & Drug-Induced AIN Eosinophiluria/WBC Casts', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa400005-0000-0000-0000-000000000004', 'fa400004-0000-0000-0000-000000000004', 'Glomerular Filtration Rate Decelerations, Maximal Tubulo-Concentric Avidity States, Sloughed Ischemic Cylindrurias, and Interstitial Eosinophilic Infiltrations', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa400006-0000-0000-0000-000000000004', 'fa400005-0000-0000-0000-000000000004', 'EXPLANATION', 1, 
'{"text": "### Acute Kidney Injury (AKI)\n\nKDIGO: Stage 1 (1.5-1.9x Cr or >=0.3 mg/dL rise), Stage 2 (2.0-2.9x Cr), Stage 3 (>=3.0x Cr, Cr >=4.0, or RRT). Prerenal: BUN/Cr >20:1, FeNa <1%, FeUrea <35%, UNa <20, hyaline casts (intact tubules conserving sodium). ATN: BUN/Cr <15:1, FeNa >2%, UNa >40, pathognomonic muddy brown granular casts (sloughed tubular epithelial necrosis). AIN: Drug-induced (NSAIDs, penicillins, PPIs) -> fever, rash, eosinophiluria, and WBC casts with sterile pyuria."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;
