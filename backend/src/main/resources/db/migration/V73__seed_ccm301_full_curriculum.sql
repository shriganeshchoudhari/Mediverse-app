-- V73: Seed Critical Care Medicine & Hemodynamic Monitoring (CCM-301) Full Curriculum

-- Ensure Subject: CCM-301 exists with correct title and category
INSERT INTO subjects (id, semester_id, code, title, category)
VALUES ('f1d0a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a31', 'c7d8e9f0-b1c2-3d4e-5f6a-7b8c9d0e1f2a', 'CCM-301', 'Critical Care Medicine & Hemodynamic Monitoring', 'CLINICAL')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, category = EXCLUDED.category;

-- Unit 1: Advanced Hemodynamics & Oxygen Delivery Dynamics
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa350001-0000-0000-0000-000000000001', 'f1d0a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a31', 'Advanced Hemodynamics & Oxygen Delivery Dynamics', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa350002-0000-0000-0000-000000000001', 'fa350001-0000-0000-0000-000000000001', 'Oxygen Transport Equations (DO2, VO2, O2ER & Supply Dependency)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa350003-0000-0000-0000-000000000001', 'fa350002-0000-0000-0000-000000000001', 'Swan-Ganz Pulmonary Artery Catheterization & PCWP Waveforms', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa350004-0000-0000-0000-000000000001', 'fa350003-0000-0000-0000-000000000001', 'Mixed Venous Oxygen Saturation (SvO2 vs ScvO2) In Shock States', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa350005-0000-0000-0000-000000000001', 'fa350004-0000-0000-0000-000000000001', 'Arterial Oxygen Flux Kinetics, Critical Delivery Dependency Thresholds, Thermodilution Stewart-Hamilton Equations, and Pulmonary Microvascular Pressures', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa350006-0000-0000-0000-000000000001', 'fa350005-0000-0000-0000-000000000001', 'EXPLANATION', 1, 
'{"text": "### Advanced Hemodynamics & Oxygen Delivery\n\nDO2 = CO * CaO2 * 10 (~1000 mL/min); VO2 = CO * (CaO2 - CvO2) * 10 (~250 mL/min); O2ER = VO2/DO2 (~25%). When DO2 drops below DO2crit (~330 mL/min/m2), VO2 becomes supply-dependent, triggering tissue dysoxia and lactic acidosis. Swan-Ganz Catheter: RA (0-8) -> RV (25/5) -> PA with dicrotic notch (25/10) -> PCWP Wedge (4-12 mmHg). Low SvO2 (<65%) = cardiogenic/hypovolemic shock (high extraction). High SvO2 (>80%) = severe sepsis / cyanide (extraction defect)."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 2: Acute Respiratory Distress Syndrome ARDS & Mechanical Ventilation
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa350001-0000-0000-0000-000000000002', 'f1d0a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a31', 'Acute Respiratory Distress Syndrome ARDS & Mechanical Ventilation', 2)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa350002-0000-0000-0000-000000000002', 'fa350001-0000-0000-0000-000000000002', 'Berlin Definition (Timing, Bilateral Infiltrates & PaO2/FiO2 Ratio)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa350003-0000-0000-0000-000000000002', 'fa350002-0000-0000-0000-000000000002', 'ARDSNet Low Tidal Volume Strategy (4-6 mL/kg PBW & Plateau <=30)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa350004-0000-0000-0000-000000000002', 'fa350003-0000-0000-0000-000000000002', 'Driving Pressure Optimization & Prone Positioning (PROSEVA Protocol)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa350005-0000-0000-0000-000000000002', 'fa350004-0000-0000-0000-000000000002', 'Heterogeneous Alveolar Baby-Lung Strain Dynamics, Cyclic Shear-Stress Biotraumas, Gravitational Transpulmonary Gradients, and Extracorporeal Membrane Oxygenations', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa350006-0000-0000-0000-000000000002', 'fa350005-0000-0000-0000-000000000002', 'EXPLANATION', 1, 
'{"text": "### ARDS & Mechanical Ventilation\n\nBerlin Definition: Acute <=1w, bilateral opacities, non-cardiogenic (PCWP <=18). Mild (200 < PaO2/FiO2 <= 300), Moderate (100 < PaO2/FiO2 <= 200), Severe (PaO2/FiO2 <= 100). ARDSNet Lung-Protective Strategy: Tidal volume 4-6 mL/kg PREDICTED Body Weight (PBW), Plateau Pressure Pplat <= 30 cmH2O, Driving Pressure Delta-P (Pplat - PEEP) <= 14 cmH2O. Prone Positioning (>=16h/day in PaO2/FiO2 < 150) reduces mortality by >50% (PROSEVA). Permissive hypercapnia (PaCO2 50-70) and Cisatracurium."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 3: Dynamic Fluid Responsiveness & Vasoactive Pharmacology
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa350001-0000-0000-0000-000000000003', 'f1d0a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a31', 'Dynamic Fluid Responsiveness & Vasoactive Pharmacology', 3)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa350002-0000-0000-0000-000000000003', 'fa350001-0000-0000-0000-000000000003', 'Passive Leg Raise (PLR) Dynamic Autotransfusion vs Static CVP', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa350003-0000-0000-0000-000000000003', 'fa350002-0000-0000-0000-000000000003', 'Stroke Volume Variation (SVV) & Pulse Pressure Variation (PPV)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa350004-0000-0000-0000-000000000003', 'fa350003-0000-0000-0000-000000000003', 'Norepinephrine, Vasopressin (0.03 U/min) & Inotropic Dobutamine', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa350005-0000-0000-0000-000000000003', 'fa350004-0000-0000-0000-000000000003', 'Cardiopulmonary Heart-Lung Interactions, Splanchnic Reservoir Mobilizations, Vasopressin-1 Smooth Muscle Contractions, and Beta-1 Lusitropic Restorations', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa350006-0000-0000-0000-000000000003', 'fa350005-0000-0000-0000-000000000003', 'EXPLANATION', 1, 
'{"text": "### Dynamic Fluids & Vasopressors\n\nDynamic Fluid Responsiveness: Passive Leg Raise (PLR) is the gold standard (reversible ~300-500 mL autotransfusion -> >=10-15% rise in CO confirms responsiveness; valid in spontaneous breathing/arrhythmias). Stroke Volume Variation (SVV > 12-13%) requires volume-controlled MV without spontaneous efforts. Vasoactive Drugs: Norepinephrine (Alpha-1 > Beta-1) is first-line in septic shock; add fixed Vasopressin (0.03 U/min) as catecholamine-sparing adjunct; add Dobutamine (Beta-1 inotrope) for septic cardiomyopathy."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 4: ICU Sedation, Delirium & The ABCDEF Liberation Bundle
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa350001-0000-0000-0000-000000000004', 'f1d0a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a31', 'ICU Sedation, Delirium & The ABCDEF Liberation Bundle', 4)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa350002-0000-0000-0000-000000000004', 'fa350001-0000-0000-0000-000000000004', 'Richmond Agitation-Sedation Scale (RASS Light Sedation Target 0 to -1)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa350003-0000-0000-0000-000000000004', 'fa350002-0000-0000-0000-000000000004', 'Dexmedetomidine (Alpha-2 Agonist) vs Benzodiazepine Delirium Risks', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa350004-0000-0000-0000-000000000004', 'fa350003-0000-0000-0000-000000000004', 'CAM-ICU Delirium Scoring & The ABCDEF ICU Liberation Protocol', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa350005-0000-0000-0000-000000000004', 'fa350004-0000-0000-0000-000000000004', 'Locus Coeruleus Alpha-2 Noradrenergic Modulations, GABAergic Deliriogenic Transformations, Daily Sedation Awakening Protocols, and Early Progressive Mobilizations', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa350006-0000-0000-0000-000000000004', 'fa350005-0000-0000-0000-000000000004', 'EXPLANATION', 1, 
'{"text": "### ICU Sedation, Delirium & ABCDEF\n\nPADIS Guidelines: Analgesia-first sedation, targeting LIGHT sedation (RASS 0 to -1: alert to drowsy with eye contact). Dexmedetomidine (Alpha-2 agonist) and Propofol are preferred over Benzodiazepines (which directly cause delirium). CAM-ICU evaluates acute fluctuation, inattention (SaveAHAART >2 errors), altered RASS, and disorganized thinking. The ABCDEF Liberation Bundle: Assess pain, Both SAT/SBT weaning trials, Choice of sedation, Delirium monitoring, Early mobility, Family engagement."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;
