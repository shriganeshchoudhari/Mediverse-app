-- V97: Seed Internship Core Clinical Postings: Inpatient Medicine & Subspecialty Consults (INT-504) Full Curriculum

-- Ensure Subject: INT-504 exists with correct title and category
INSERT INTO subjects (id, semester_id, code, title, category)
VALUES ('f6f9a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a22', 'c9d0e1f2-b3c4-5d6e-7f8a-9b0c1d2e3f4c', 'INT-504', 'Internship Core Clinical Postings: Inpatient Medicine & Subspecialty Consults', 'CLINICAL')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, category = EXCLUDED.category;

-- Unit 1: Acute Coronary Syndromes & Inpatient Cardiology Consults
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa610001-0000-0000-0000-000000000001', 'f6f9a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a22', 'Acute Coronary Syndromes & Inpatient Cardiology Consults', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa610002-0000-0000-0000-000000000001', 'fa610001-0000-0000-0000-000000000001', 'STEMI Door-to-Balloon (<=90m) & NSTEMI Early Invasive Risk Stratification', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa610003-0000-0000-0000-000000000001', 'fa610002-0000-0000-0000-000000000001', 'Dual Antiplatelet Protocols: Ticagrelor vs Prasugrel (Stroke Ban)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa610004-0000-0000-0000-000000000001', 'fa610003-0000-0000-0000-000000000001', 'High-Intensity Statin Therapy (Atorvastatin 80 mg) & Secondary Prevention', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa610005-0000-0000-0000-000000000001', 'fa610004-0000-0000-0000-000000000001', 'Transmural Infarction Reperfusion Timings, Platelet Receptor Antagonisms, and Pleiotropic Endothelial Reductions', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa610006-0000-0000-0000-000000000001', 'fa610005-0000-0000-0000-000000000001', 'EXPLANATION', 1, 
'{"text": "### Acute Coronary Syndromes (ACS)\n\nSTEMI Reperfusion: Door-to-balloon time <=90 min for on-site Primary PCI (<=120 min if transfer); if transfer >120 min, give IV fibrinolytics <=30 min. NSTEMI: Early invasive angiography <=24 hours for high-risk features (GRACE >140, refractory ischemia). Pharmacotherapy: Aspirin 325 mg + Ticagrelor 180 mg (or Prasugrel 60 mg; STRICTLY CONTRAINDICATED in prior stroke/TIA) + UFH (aPTT 50-70s) + Atorvastatin 80 mg daily."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 2: Hyperglycemic Crises: Diabetic Ketoacidosis & HHS
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa610001-0000-0000-0000-000000000002', 'f6f9a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a22', 'Hyperglycemic Crises: Diabetic Ketoacidosis & HHS', 2)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa610002-0000-0000-0000-000000000002', 'fa610001-0000-0000-0000-000000000002', 'DKA vs HHS Diagnostic Discrimination & Two-Bag Fluid Resuscitation', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa610003-0000-0000-0000-000000000002', 'fa610002-0000-0000-0000-000000000002', 'Potassium-First Safety Rule (HOLD Insulin if K <3.3) & Insulin Drip', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa610004-0000-0000-0000-000000000002', 'fa610003-0000-0000-0000-000000000002', 'Dextrose Addition at Glucose <200 & DKA Resolution SubQ Overlap', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa610005-0000-0000-0000-000000000002', 'fa610004-0000-0000-0000-000000000002', 'Beta-Hydroxybutyric Acidemias, Osmolar Fluid Shifts, Hypokalemic Arrhythmia Preventative Holds, and Subcutaneous Glargine Transitions', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa610006-0000-0000-0000-000000000002', 'fa610005-0000-0000-0000-000000000002', 'EXPLANATION', 1, 
'{"text": "### Hyperglycemic Crises (DKA & HHS)\n\nDKA vs HHS: DKA has gap >12, HCO3 <18, pH <7.30, positive ketones; HHS has glucose >600, Osm >320, normal gap. Potassium Rule: If K+ <3.3 mEq/L, HOLD insulin and infuse IV potassium until K+ >=3.3 mEq/L. Two-Bag Fluid: 0.9% NS -> 0.45% NS; add 5% Dextrose when glucose <200 mg/dL in DKA (<300 in HHS). DKA Resolution: Gap <=12, HCO3 >=18, pH >7.30; administer SubQ basal insulin 2 hours prior to stopping IV drip."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 3: Acute Kidney Injury KDIGO Staging & Emergent Dialysis AEIOU
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa610001-0000-0000-0000-000000000003', 'f6f9a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a22', 'Acute Kidney Injury KDIGO Staging & Emergent Dialysis AEIOU', 3)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa610002-0000-0000-0000-000000000003', 'fa610001-0000-0000-0000-000000000003', 'KDIGO Clinical Stages 1-3 & Oliguria Benchmarks', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa610003-0000-0000-0000-000000000003', 'fa610002-0000-0000-0000-000000000003', 'Prerenal Azotemia (FeNa <1%) vs Acute Tubular Necrosis (FeNa >2%)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa610004-0000-0000-0000-000000000003', 'fa610003-0000-0000-0000-000000000003', 'Emergent Indications for Renal Replacement Therapy (AEIOU Criteria)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa610005-0000-0000-0000-000000000003', 'fa610004-0000-0000-0000-000000000003', 'Glomerular Filtration Reductions, Fractional Natriuretic Conservations, Granular Cylindrurias, and Extracorporeal Dialytic Clearances', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa610006-0000-0000-0000-000000000003', 'fa610005-0000-0000-0000-000000000003', 'EXPLANATION', 1, 
'{"text": "### Acute Kidney Injury & Emergent Dialysis\n\nKDIGO Staging: Stage 1 (1.5-1.9x Cr), Stage 2 (2.0-2.9x Cr), Stage 3 (>=3x baseline Cr or Cr >=4.0 mg/dL or RRT / anuria >=12h). Workup: Prerenal (BUN/Cr >20:1, FeNa <1%, urine Na <20) vs ATN (FeNa >2%, muddy brown granular casts). Emergent Dialysis Indications (AEIOU): Acidosis (pH <7.10), Electrolytes (refractory K+ >6.5 with ECG changes), Intoxications (SLIME: salicylate, lithium, toxic alcohols), Overload (refractory pulmonary edema), Uremia (pericarditis, encephalopathy)."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 4: Cirrhotic Decompensation: Encephalopathy & Variceal Bleeding
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa610001-0000-0000-0000-000000000004', 'f6f9a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a22', 'Cirrhotic Decompensation: Encephalopathy & Variceal Bleeding', 4)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa610002-0000-0000-0000-000000000004', 'fa610001-0000-0000-0000-000000000004', 'Hepatic Encephalopathy (West Haven Grades & Lactulose/Rifaximin)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa610003-0000-0000-0000-000000000004', 'fa610002-0000-0000-0000-000000000004', 'Acute Variceal Bleeding Bundle (Restrictive Transfusion & Octreotide)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa610004-0000-0000-0000-000000000004', 'fa610003-0000-0000-0000-000000000004', 'Prophylactic Ceftriaxone & Endoscopic Band Ligation (EVL <=12h)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa610005-0000-0000-0000-000000000004', 'fa610004-0000-0000-0000-000000000004', 'Portosystemic Hyperammonemias, Splanchnic Vasoconstrictive Hemostases, Bacterial Translocation Prophylaxes, and Endoscopic Ligations', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa610006-0000-0000-0000-000000000004', 'fa610005-0000-0000-0000-000000000004', 'EXPLANATION', 1, 
'{"text": "### Cirrhotic Decompensation\n\nHepatic Encephalopathy: Lactulose acidifies the colon to trap NH3 as non-absorbable NH4+ (titrated to 2-3 soft stools/day) + Rifaximin 550 mg PO BID to eliminate urease gut bacteria. Variceal Bleeding Bundle: Restrictive transfusion (target Hb 7-8 g/dL) + Octreotide 50 mcg IV bolus and 50 mcg/hr infusion + prophylactic IV Ceftriaxone 1 g daily for 7 days + urgent EGD with Endoscopic Variceal Band Ligation (EVL) <=12 hours. Hepatorenal Syndrome: Terlipressin + IV Albumin."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;
