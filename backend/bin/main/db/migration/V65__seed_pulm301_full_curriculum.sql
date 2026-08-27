-- V65: Seed Pulmonary Pathophysiology, Critical Care & Mechanical Ventilation (PULM-301) Full Curriculum

-- Ensure Subject: PULM-301 exists with correct title and category
INSERT INTO subjects (id, semester_id, code, title, category)
VALUES ('f1d0a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a23', 'c7d8e9f0-b1c2-3d4e-5f6a-7b8c9d0e1f2a', 'PULM-301', 'Pulmonary Pathophysiology, Critical Care & Mechanical Ventilation', 'CLINICAL')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, category = EXCLUDED.category;

-- Unit 1: Flow-Volume Loops & Pulmonary Function Testing
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa270001-0000-0000-0000-000000000001', 'f1d0a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a23', 'Flow-Volume Loops & Pulmonary Function Testing', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa270002-0000-0000-0000-000000000001', 'fa270001-0000-0000-0000-000000000001', 'Obstructive (FEV1/FVC <0.70) vs Restrictive Patterns', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa270003-0000-0000-0000-000000000001', 'fa270002-0000-0000-0000-000000000001', 'Diffusion Capacity (DLCO) in Emphysema vs Asthma vs IPF', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa270004-0000-0000-0000-000000000001', 'fa270003-0000-0000-0000-000000000001', 'Fixed vs Variable Intra/Extrathoracic Airway Lesions', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa270005-0000-0000-0000-000000000001', 'fa270004-0000-0000-0000-000000000001', 'Spirometric Fractions, Scooped Expiratory Loops, Tracheal Stenosis Bilateral Plateaus, and Alveolar Gas Transfer Metrics', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa270006-0000-0000-0000-000000000001', 'fa270005-0000-0000-0000-000000000001', 'EXPLANATION', 1, 
'{"text": "### Flow-Volume Loops & Spirometry\n\nObstructive (FEV1/FVC <0.70): Coved/scooped-out expiratory loop, increased RV/TLC (air trapping). Emphysema has decreased DLCO; pure Asthma has normal/high DLCO with >12% and >200 mL bronchodilator reversibility. Restrictive (FEV1/FVC >=0.75): TLC <80%, shrunken witch''s hat loop. Intrinsic IPF has low DLCO; extrinsic chest wall/neuromuscular has normal DLCO. Upper Airway Obstructions: Fixed (tracheal stenosis, goiter) -> flattening of BOTH inspiratory and expiratory limbs. Variable Extrathoracic (vocal cord paralysis) -> flattening of INSPIRATORY limb ONLY. Variable Intrathoracic (tracheomalacia) -> flattening of EXPIRATORY limb ONLY."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 2: Mechanical Ventilation Modes, Mechanics & Troubleshooting
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa270001-0000-0000-0000-000000000002', 'f1d0a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a23', 'Mechanical Ventilation Modes, Mechanics & Troubleshooting', 2)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa270002-0000-0000-0000-000000000002', 'fa270001-0000-0000-0000-000000000002', 'VCV vs PCV Modes & Peak vs Plateau Pressures (Pplat)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa270003-0000-0000-0000-000000000002', 'fa270002-0000-0000-0000-000000000002', 'Static Compliance & Driving Pressure (Pplat - PEEP <15)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa270004-0000-0000-0000-000000000002', 'fa270003-0000-0000-0000-000000000002', 'High Peak Pressure Troubleshooting: Resistance vs Compliance', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa270005-0000-0000-0000-000000000002', 'fa270004-0000-0000-0000-000000000002', 'Inspiratory Hold Maneuvers, Alveolar Distending Pressures, Static Compliance Calculations, and Tension Pneumothorax Alarm Differentiation', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa270006-0000-0000-0000-000000000002', 'fa270005-0000-0000-0000-000000000002', 'EXPLANATION', 1, 
'{"text": "### Mechanical Ventilation Mechanics\n\nPIP: Total resistive + elastic pressure. Pplat: Measured during end-inspiratory pause (flow = 0), reflects true alveolar distending pressure (target <=30 cmH2O). Static Compliance Cstat = Vt / (Pplat - PEEP) (Normal: 50-80 mL/cmH2O). Driving Pressure Delta P = Pplat - PEEP (target <15 cmH2O). High PIP Troubleshooting: High PIP + Normal Pplat (<=30) -> Airway Resistance problem (bronchospasm, secretions, kinked ETT). High PIP + High Pplat (>30) -> Compliance problem (Tension Pneumothorax [EMERGENCY!], ARDS, Pulmonary Edema, Right Mainstem Intubation)."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 3: ARDS Pathophysiology, Berlin Criteria & Prone Rescue
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa270001-0000-0000-0000-000000000003', 'f1d0a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a23', 'ARDS Pathophysiology, Berlin Criteria & Prone Rescue', 3)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa270002-0000-0000-0000-000000000003', 'fa270001-0000-0000-0000-000000000003', 'Berlin Consensus Definition & P/F Ratio Stratification', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa270003-0000-0000-0000-000000000003', 'fa270002-0000-0000-0000-000000000003', 'ARDSNet Low Tidal Volume Protocol (4-8 mL/kg PBW)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa270004-0000-0000-0000-000000000003', 'fa270003-0000-0000-0000-000000000003', 'Prone Positioning (>=16h/day PROSEVA) & VV-ECMO Rescue', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa270005-0000-0000-0000-000000000003', 'fa270004-0000-0000-0000-000000000003', 'Predicted Body Weight Calculations, Permissive Hypercapnia Thresholds, Dorsal Alveolar Recruitment in Prone Position, and Extracorporeal Gas Exchange Indications', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa270006-0000-0000-0000-000000000003', 'fa270005-0000-0000-0000-000000000003', 'EXPLANATION', 1, 
'{"text": "### ARDS & Prone Rescue\n\nBerlin Definition: Timing within 1 week of insult; Bilateral opacities on CXR/CT; Non-cardiogenic edema. Oxygenation (on PEEP >=5): Mild (200 < P/F <= 300), Moderate (100 < P/F <= 200), Severe (P/F <= 100 mmHg). ARDSNet Protocol: Low tidal volume 4-8 mL/kg Predicted Body Weight (PBW = 50 + 0.91 x [height - 152.4] for males), Pplat <=30 cmH2O, Driving pressure <15 cmH2O, permissive hypercapnia (pH >=7.20). Prone Positioning: Indicated for severe/moderate ARDS with P/F <150 mmHg -> maintain >=16 hours/day in prone position (recruits dorsal lung units, homogenizes transpulmonary pressure, proven mortality reduction). Refractory hypoxemia -> VV-ECMO."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 4: Hypoxemia Pathophysiology, A-a Gradient & Capnography
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa270001-0000-0000-0000-000000000004', 'f1d0a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a23', 'Hypoxemia Pathophysiology, A-a Gradient & Capnography', 4)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa270002-0000-0000-0000-000000000004', 'fa270001-0000-0000-0000-000000000004', 'The 5 Mechanisms of Hypoxemia & 100% O2 Response', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa270003-0000-0000-0000-000000000004', 'fa270002-0000-0000-0000-000000000004', 'Alveolar Gas Equation & A-a Oxygen Gradient (PAO2 - PaO2)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa270004-0000-0000-0000-000000000004', 'fa270003-0000-0000-0000-000000000004', 'Capnography (EtCO2): Shark-Fin Waveforms in Bronchospasm', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa270005-0000-0000-0000-000000000004', 'fa270004-0000-0000-0000-000000000004', 'True Shunt Refractoriness, Room Air PAO2 Formulas, End-Tidal Carbon Dioxide Kinetics, and Sudden Capnographic Loss Alarms', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa270006-0000-0000-0000-000000000004', 'fa270005-0000-0000-0000-000000000004', 'EXPLANATION', 1, 
'{"text": "### Hypoxemia Mechanisms & Capnography\n\n5 Mechanisms: 1. Low FiO2 (Normal A-a, O2 responsive); 2. Hypoventilation (High PaCO2, Normal A-a, O2 responsive); 3. V/Q Mismatch (High A-a, O2 responsive); 4. Right-to-Left Shunt (High A-a, REFRACTORY to 100% O2!); 5. Diffusion Impairment (High A-a, O2 responsive). Alveolar Gas Equation: PAO2 = FiO2 x (Patm - 47) - (PaCO2 / 0.8) ~ 150 - 1.25 x PaCO2. A-a Gradient = PAO2 - PaO2 (Normal: <15). Capnography (EtCO2): Phase I (dead space), Phase II (mixing), Phase III (alveolar plateau). ''Shark-fin'' upward sloping Phase III indicates severe bronchospasm in asthma/COPD. Sudden drop to zero indicates extubation/cardiac arrest."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;
