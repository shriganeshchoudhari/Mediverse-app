-- V56: Seed Nuclear Medicine & Molecular Theranostics (NUCL-401) Full Curriculum

-- Ensure Subject: NUCL-401 exists with correct title and category
INSERT INTO subjects (id, semester_id, code, title, category)
VALUES ('f1c9a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a14', 'c9d0e1f2-b3c4-5d6e-7f8a-9b0c1d2e3f4b', 'NUCL-401', 'Nuclear Medicine & Molecular Theranostics', 'CLINICAL')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, category = EXCLUDED.category;

-- Unit 1: Radiopharmaceuticals, Decay Physics & ALARA Safety
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa180001-0000-0000-0000-000000000001', 'f1c9a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a14', 'Radiopharmaceuticals, Decay Physics & ALARA Safety', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa180002-0000-0000-0000-000000000001', 'fa180001-0000-0000-0000-000000000001', 'Diagnostic & Therapeutic Radionuclide Physics', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa180003-0000-0000-0000-000000000001', 'fa180002-0000-0000-0000-000000000001', 'Technetium-99m Generator & Fluorine-18 Positron Annihilation', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa180004-0000-0000-0000-000000000001', 'fa180003-0000-0000-0000-000000000001', 'ALARA Principles, Inverse Square Law & Beta Shielding', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa180005-0000-0000-0000-000000000001', 'fa180004-0000-0000-0000-000000000001', 'Physical Half-Lives, Mo-99 Generator Chemistry, Positron Annihilation Physics, and ALARA Radiation Protection', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa180006-0000-0000-0000-000000000001', 'fa180005-0000-0000-0000-000000000001', 'EXPLANATION', 1, 
'{"text": "### Radiopharmaceutical Physics & Safety\n\nTc-99m has T1/2 = 6.02h, 140 keV pure gamma from Mo-99 generator (limit <0.15 uCi Mo-99 per mCi Tc-99m). F-18 has T1/2 = 110 min, decays by beta+ positron emission (511 keV coincident annihilation photons at 180 degrees). I-131 (beta- and gamma, T1/2 = 8d) vs I-123 (pure gamma 159 keV, T1/2 = 13.2h). Effective half-life Teff = (Tp x Tb)/(Tp + Tb). ALARA safety: time, distance (inverse square law I proportional to 1/d^2), and shielding (lead for gamma; plastic/lucite for pure beta emitters to prevent high-Z Bremsstrahlung X-rays)."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 2: Planar Scintigraphy & SPECT-CT Organ Imaging
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa180001-0000-0000-0000-000000000002', 'f1c9a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a14', 'Planar Scintigraphy & SPECT-CT Organ Imaging', 2)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa180002-0000-0000-0000-000000000002', 'fa180001-0000-0000-0000-000000000002', 'Hepatobiliary HIDA & Acute Cholecystitis with Morphine', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa180003-0000-0000-0000-000000000002', 'fa180002-0000-0000-0000-000000000002', 'V/Q Lung Scintigraphy & Modified PIOPED II PE Criteria', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa180004-0000-0000-0000-000000000002', 'fa180003-0000-0000-0000-000000000002', '3-Phase Bone Scan (Superscan) & Renal MAG3 Scintigraphy', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa180005-0000-0000-0000-000000000002', 'fa180004-0000-0000-0000-000000000002', 'Planar Scintigraphy, HIDA Gallbladder Non-Visualization, V/Q Mismatch Criteria, and 3-Phase Bone Scintigraphy', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa180006-0000-0000-0000-000000000002', 'fa180005-0000-0000-0000-000000000002', 'EXPLANATION', 1, 
'{"text": "### Scintigraphy & SPECT-CT\n\nHIDA Scan (99mTc-Mebrofenin): Acute cholecystitis is diagnosed by non-visualization of the gallbladder at 60 min (and persisting after morphine 0.04 mg/kg) despite patent common bile duct excretion. V/Q scan: High-probability PE requires >=2 wedge-shaped segmental perfusion defects (99mTc-MAA) with normal ventilation (99mTc-DTPA aerosol). Bone scan (99mTc-MDP): 3 phases (flow, pool, delayed); osteomyelitis is positive on all 3 phases; superscan shows diffuse skeletal uptake with absent renal excretion. Renal MAG3: Lasix washout T1/2 >20 min indicates mechanical obstruction."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 3: PET-CT Oncology & Neurology: 18F-FDG & Dementia Patterns
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa180001-0000-0000-0000-000000000003', 'f1c9a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a14', 'PET-CT Oncology & Neurology: 18F-FDG & Dementia Patterns', 3)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa180002-0000-0000-0000-000000000003', 'fa180001-0000-0000-0000-000000000003', '18F-FDG Warburg Glycolysis & Hexokinase Trapping', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa180003-0000-0000-0000-000000000003', 'fa180002-0000-0000-0000-000000000003', 'Standardized Uptake Value (SUV) & Brown Fat Protocol', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa180004-0000-0000-0000-000000000003', 'fa180003-0000-0000-0000-000000000003', 'Brain Dementia Patterns (Alzheimer, FTD, Lewy Body Island Sign)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa180005-0000-0000-0000-000000000003', 'fa180004-0000-0000-0000-000000000003', '18F-FDG Warburg Glycolysis, Quantitative SUV Calculation, and Neurodegenerative Dementia PET Patterns', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa180006-0000-0000-0000-000000000003', 'fa180005-0000-0000-0000-000000000003', 'EXPLANATION', 1, 
'{"text": "### PET-CT Oncology & Brain Dementia\n\n18F-FDG is phosphorylated by hexokinase into 18F-FDG-6-phosphate, which is trapped intracellularly (Warburg effect). Patients must fast >=4-6h (glucose <150-200 mg/dL) and rest in a warm room (21-24°C) to prevent brown fat activation. Brain FDG PET patterns: Alzheimer disease shows bilateral temporoparietal and posterior cingulate hypometabolism; Frontotemporal dementia (FTD) shows frontal and anterior temporal hypometabolism; Dementia with Lewy Bodies (DLB) shows occipital visual hypometabolism with preservation of the posterior cingulate (Cingulate Island Sign)."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 4: Molecular Theranostics & Targeted Radionuclide Therapies
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa180001-0000-0000-0000-000000000004', 'f1c9a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a14', 'Molecular Theranostics & Targeted Radionuclide Therapies', 4)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa180002-0000-0000-0000-000000000004', 'fa180001-0000-0000-0000-000000000004', '177Lu-DOTATATE (Lutathera) PRRT in Neuroendocrine Tumors', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa180003-0000-0000-0000-000000000004', 'fa180002-0000-0000-0000-000000000004', '177Lu-PSMA-617 (Pluvicto) in Metastatic Prostate Cancer', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa180004-0000-0000-0000-000000000004', 'fa180003-0000-0000-0000-000000000004', 'I-131 Thyroid Radioablation & Radium-223 Alpha Therapy', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa180005-0000-0000-0000-000000000004', 'fa180004-0000-0000-0000-000000000004', 'Molecular Theranostics, 177Lu-DOTATATE PRRT with Amino Acid Renoprotection, 177Lu-PSMA-617, and I-131 Thyroid Ablation', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa180006-0000-0000-0000-000000000004', 'fa180005-0000-0000-0000-000000000004', 'EXPLANATION', 1, 
'{"text": "### Molecular Theranostics & PRRT\n\nTheranostics pairs diagnostic imaging with targeted radionuclide therapy: 68Ga-DOTATATE PET -> 177Lu-DOTATATE (Lutathera PRRT) targeting SSTR2 in neuroendocrine tumors (mandatory co-infusion of L-lysine and L-arginine to block proximal renal tubular reabsorption and prevent nephrotoxicity). 68Ga-PSMA-11 PET -> 177Lu-PSMA-617 (Pluvicto) in mCRPC (VISION trial). I-131 radioablation for Graves (10-15 mCi) and differentiated thyroid cancer (30-150 mCi after TSH >30 uIU/mL). Radium-223 is an alpha-emitting calcium mimetic for osteoblastic bone metastases."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;
