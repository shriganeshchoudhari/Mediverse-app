-- V91: Seed Clinical Postings I (CLIN-201) Full Curriculum

-- Ensure Subject: CLIN-201 exists with correct title and category
INSERT INTO subjects (id, semester_id, code, title, category)
VALUES ('f8f9a0b1-c2d3-4e5f-6a7b-8c9d0e1f2a3b', 'c5d6e7f8-a9b0-1c2d-3e4f-5a6b7c8d9e0f', 'CLIN-201', 'Clinical Postings I: Inpatient Medicine & Bedside Rounds', 'CLINICAL')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, category = EXCLUDED.category;

-- Unit 1: Inpatient Ward Rounds, Presentation Architecture & SOAP Documentation
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa550001-0000-0000-0000-000000000001', 'f8f9a0b1-c2d3-4e5f-6a7b-8c9d0e1f2a3b', 'Inpatient Ward Rounds, Presentation Architecture & SOAP Documentation', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa550002-0000-0000-0000-000000000001', 'fa550001-0000-0000-0000-000000000001', 'Morning Case Presentation Sequence (24h Vitals, Strict I/Os & Plan)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa550003-0000-0000-0000-000000000001', 'fa550002-0000-0000-0000-000000000001', 'Problem-Based Daily SOAP Progress Note Architecture & Prophylaxis', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa550004-0000-0000-0000-000000000001', 'fa550003-0000-0000-0000-000000000001', 'Discharge Medication Reconciliation, Red Flags & Safety Netting', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa550005-0000-0000-0000-000000000001', 'fa550004-0000-0000-0000-000000000001', 'Bedside Inpatient Identifications, Net Hemodynamic Balances, Systems-Based Assessments, and Outpatient Transition Reconciliations', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa550006-0000-0000-0000-000000000001', 'fa550005-0000-0000-0000-000000000001', 'EXPLANATION', 1, 
'{"text": "### Inpatient Ward Rounds & SOAP Documentation\n\nMorning Rounds: Structure into One-liner identifier -> Overnight nursing/symptom events -> 24-hour vital ranges (Tmax, BP/HR/RR ranges, strict I/Os, daily weight) -> Focused exam -> Lab/imaging trends -> Problem-based Assessment and Plan. SOAP Notes: S (patient trajectory), O (vitals, strict I/Os, labs, telemetry), A (synthesis), P (problem list, DVT/GI prophylaxis, line necessity, disposition)."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 2: Bedside Cardiovascular & Hemodynamic Physical Examination
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa550001-0000-0000-0000-000000000002', 'f8f9a0b1-c2d3-4e5f-6a7b-8c9d0e1f2a3b', 'Bedside Cardiovascular & Hemodynamic Physical Examination', 2)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa550002-0000-0000-0000-000000000002', 'fa550001-0000-0000-0000-000000000002', 'Jugular Venous Pressure (JVP) Waveform Morphology (Cannon a & Giant v Waves)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa550003-0000-0000-0000-000000000002', 'fa550002-0000-0000-0000-000000000002', 'Kussmaul Paradoxical Sign & Hepatojugular Reflux Testing', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa550004-0000-0000-0000-000000000002', 'fa550003-0000-0000-0000-000000000002', 'Pulsus Paradoxus Sphygmomanometry & Ventricular Interdependence', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa550005-0000-0000-0000-000000000002', 'fa550004-0000-0000-0000-000000000002', 'Central Venous Pulsation Physics, Inspiratory Right-Heart Resistances, Hepatic Congestions, and Pericardial Tamponade Paradoxes', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa550006-0000-0000-0000-000000000002', 'fa550005-0000-0000-0000-000000000002', 'EXPLANATION', 1, 
'{"text": "### Bedside Cardiovascular & Hemodynamic Signs\n\nJVP Waveforms: a wave (cannon a wave in AV dissociation/VT), v wave (giant holosystolic v wave in tricuspid regurgitation), steep y descent in constrictive pericarditis vs blunted y descent in tamponade. Kussmaul Sign: Paradoxical inspiratory rise in JVP in constrictive pericarditis and RV infarction. Pulsus Paradoxus: Drop in SBP >10 mmHg during inspiration, pathognomonic for Cardiac Tamponade."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 3: Bedside Pulmonary, Abdominal & Neurological Clinical Signs
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa550001-0000-0000-0000-000000000003', 'f8f9a0b1-c2d3-4e5f-6a7b-8c9d0e1f2a3b', 'Bedside Pulmonary, Abdominal & Neurological Clinical Signs', 3)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa550002-0000-0000-0000-000000000003', 'fa550001-0000-0000-0000-000000000003', 'Pulmonary Exam: Tactile Fremitus, Stony Dullness, Egophony & Bronchial Sounds', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa550003-0000-0000-0000-000000000003', 'fa550002-0000-0000-0000-000000000003', 'Abdominal Physical Signs: Shifting Dullness (>1,500 mL) & Fluid Wave (>2,000 mL)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa550004-0000-0000-0000-000000000003', 'fa550003-0000-0000-0000-000000000003', 'Toxic-Metabolic Asterixis (Flapping Tremor) & Upper Motor Neuron Clonus', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa550005-0000-0000-0000-000000000003', 'fa550004-0000-0000-0000-000000000003', 'Acoustic Lung Vibrations, Gravitational Peritoneal Fluid Shifts, Diencephalic Tone Interruptions, and Hyperreflexic Ankle Oscillations', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa550006-0000-0000-0000-000000000003', 'fa550005-0000-0000-0000-000000000003', 'EXPLANATION', 1, 
'{"text": "### Bedside Pulmonary, Abdominal & Neuro Signs\n\nConsolidation vs Effusion: Tactile fremitus is INCREASED in consolidation but DECREASED in effusion; Egophony (''E'' to ''A'') indicates consolidation. Ascites: Shifting dullness detects >1,500 mL; fluid wave detects >2,000 mL. Asterixis: Brief, involuntary loss of postural tone in outstretched dorsiflexed hands (negative myoclonus) pathognomonic for Hepatic Encephalopathy, Uremia, and CO2 retention."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 4: Clinical Fluid Management, Electrolyte Calculations & Inpatient Prescribing
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa550001-0000-0000-0000-000000000004', 'f8f9a0b1-c2d3-4e5f-6a7b-8c9d0e1f2a3b', 'Clinical Fluid Management, Electrolyte Calculations & Inpatient Prescribing', 4)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa550002-0000-0000-0000-000000000004', 'fa550001-0000-0000-0000-000000000004', 'Holiday-Segar 4-2-1 Maintenance Fluid Prescribing & Crystalloid Selection', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa550003-0000-0000-0000-000000000004', 'fa550002-0000-0000-0000-000000000004', 'Hyponatremia Correction Velocity Limits (6-8 mEq/L/24h) & ODS Prevention', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa550004-0000-0000-0000-000000000004', 'fa550003-0000-0000-0000-000000000004', 'Emergency Hyperkalemia 3-Step Resuscitation Algorithm (Calcium, Insulin, Elimination)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa550005-0000-0000-0000-000000000004', 'fa550004-0000-0000-0000-000000000004', 'Weight-Based Hydration Tonicities, Pontine Demyelination Avoidances, Myocardial Membrane Stabilizations, and Cation Exchange Clearances', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa550006-0000-0000-0000-000000000004', 'fa550005-0000-0000-0000-000000000004', 'EXPLANATION', 1, 
'{"text": "### Inpatient Fluid & Electrolyte Management\n\nMaintenance Fluids: Holiday-Segar 4-2-1 rule (Weight + 40 mL/hr for adults). 0.9% Normal Saline has 154 mEq/L Cl (hyperchloremic acidosis risk); prefer balanced crystalloids. Hyponatremia: Max correction 6-8 mEq/L in 24 hours to prevent Osmotic Demyelination Syndrome (ODS). Hyperkalemia: Step 1 = IV Calcium Gluconate (stabilize cardiac membrane); Step 2 = Regular Insulin 10 U + D50W (intracellular shift); Step 3 = Dialysis/binders."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;
