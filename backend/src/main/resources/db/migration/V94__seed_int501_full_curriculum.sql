-- V94: Seed Internship Core Clinical Postings: Emergency & Critical Care (INT-501) Full Curriculum

-- Ensure Subject: INT-501 exists with correct title and category
INSERT INTO subjects (id, semester_id, code, title, category)
VALUES ('f3f9a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a19', 'c9d0e1f2-b3c4-5d6e-7f8a-9b0c1d2e3f4c', 'INT-501', 'Internship Core Clinical Postings: Emergency & Critical Care', 'CLINICAL')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, category = EXCLUDED.category;

-- Unit 1: Advanced Cardiac Life Support (ACLS 2025 Algorithmic Pathways)
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa580001-0000-0000-0000-000000000001', 'f3f9a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a19', 'Advanced Cardiac Life Support (ACLS 2025 Algorithmic Pathways)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa580002-0000-0000-0000-000000000001', 'fa580001-0000-0000-0000-000000000001', 'Shockable VF/pVT Defibrillation & Amiodarone (300/150 mg) Sequences', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa580003-0000-0000-0000-000000000001', 'fa580002-0000-0000-0000-000000000001', 'Non-Shockable PEA/Asystole Epinephrine Protocol & Reversible 5 Hs and 5 Ts', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa580004-0000-0000-0000-000000000001', 'fa580003-0000-0000-0000-000000000001', 'Post-ROSC Targeted Temperature Management (32-36°C) & Hemodynamic Goals', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa580005-0000-0000-0000-000000000001', 'fa580004-0000-0000-0000-000000000001', 'Biphasic Syncytium Repolarizations, Epinephrine Coronary Perfusion Pressures, and Reperfusion Hypothermic Preservations', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa580006-0000-0000-0000-000000000001', 'fa580005-0000-0000-0000-000000000001', 'EXPLANATION', 1, 
'{"text": "### ACLS 2025 Algorithmic Pathways\n\nShockable Rhythms: VF/pulseless VT -> 120-200J biphasic shock -> CPR 2 min -> shock -> Epinephrine 1 mg IV q3-5 min -> shock -> Amiodarone 300 mg bolus (1st dose) / 150 mg (2nd dose). Non-Shockable: PEA/Asystole -> Epinephrine 1 mg IV stat -> CPR and treat 5 Hs and 5 Ts. Post-ROSC Care: Maintain MAP >=65 mmHg; Targeted Temperature Management (TTM 32-36°C for 24h) for comatose patients; stat Cath Lab if STEMI."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 2: Sepsis-3 Resuscitation Bundles & Septic Shock Hemodynamics
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa580001-0000-0000-0000-000000000002', 'f3f9a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a19', 'Sepsis-3 Resuscitation Bundles & Septic Shock Hemodynamics', 2)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa580002-0000-0000-0000-000000000002', 'fa580001-0000-0000-0000-000000000002', 'Sepsis-3 SOFA Consensus Definitions & Lactate Clearance Kinetics', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa580003-0000-0000-0000-000000000002', 'fa580002-0000-0000-0000-000000000002', 'Surviving Sepsis Campaign Hour-1 Bundle & 30 mL/kg Crystalloids', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa580004-0000-0000-0000-000000000002', 'fa580003-0000-0000-0000-000000000002', 'Vasopressor Hierarchy: Norepinephrine, Vasopressin & Stress Hydrocortisone', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa580005-0000-0000-0000-000000000002', 'fa580004-0000-0000-0000-000000000002', 'Endothelial Glycocalyx Disruptions, Microvascular Shuntings, Alpha-1 Adrenoceptor Vasoconstrictions, and V1 Vasopressinergic Resuscitations', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa580006-0000-0000-0000-000000000002', 'fa580005-0000-0000-0000-000000000002', 'EXPLANATION', 1, 
'{"text": "### Sepsis-3 Resuscitation Bundles\n\nSepsis-3: Acute increase in SOFA score >=2 points. Septic Shock: Persisting hypotension requiring vasopressors for MAP >=65 mmHg AND serum lactate >2 mmol/L. Hour-1 Bundle: Measure lactate, draw blood cultures x2 prior to antibiotics, administer broad-spectrum IV antibiotics <=1 hour, infuse 30 mL/kg balanced crystalloids (Lactated Ringer''s) for hypotension or lactate >=4. Vasopressors: Norepinephrine first-line -> add fixed Vasopressin (0.03 U/min) -> add IV Hydrocortisone (200 mg/d) if refractory."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 3: Trauma Primary & Secondary Surveys (ATLS ABCDE & FAST Exam)
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa580001-0000-0000-0000-000000000003', 'f3f9a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a19', 'Trauma Primary & Secondary Surveys (ATLS ABCDE & FAST Exam)', 3)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa580002-0000-0000-0000-000000000003', 'fa580001-0000-0000-0000-000000000003', 'ATLS Primary Survey ABCDE & Tension Pneumothorax Decompressions', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa580003-0000-0000-0000-000000000003', 'fa580002-0000-0000-0000-000000000003', 'Massive Transfusion Protocol (1:1:1 Balanced) & Tranexamic Acid (TXA)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa580004-0000-0000-0000-000000000003', 'fa580003-0000-0000-0000-000000000003', 'FAST Bedside Sonography (Morison''s Pouch) & E-FAST Pneumothorax M-Mode', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa580005-0000-0000-0000-000000000003', 'fa580004-0000-0000-0000-000000000003', 'Pleural Tension Decompressions, Hemorrhagic Component Balancings, Morison Hepatorenal Reflections, and Stratosphere Barcode M-Modes', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa580006-0000-0000-0000-000000000003', 'fa580005-0000-0000-0000-000000000003', 'EXPLANATION', 1, 
'{"text": "### Trauma Resuscitation & FAST Exam\n\nATLS ABCDE: Airway with inline C-spine, Breathing (decompress tension pneumo stat), Circulation (MTP 1:1:1 PRBC:FFP:Platelets + TXA 1 g IV within 3h), Disability (GCS <=8 intubate), Exposure (prevent hypothermia lethal triad). FAST 4 Views: Morison''s pouch (hepatorenal recess - most sensitive), splenorenal, suprapubic, subxiphoid pericardium. Positive FAST in unstable trauma -> emergent OR laparotomy. E-FAST: Loss of lung sliding / barcode sign confirms pneumothorax."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 4: Rapid Sequence Intubation (The 7 Ps of Airway Management)
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa580001-0000-0000-0000-000000000004', 'f3f9a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a19', 'Rapid Sequence Intubation (The 7 Ps of Airway Management)', 4)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa580002-0000-0000-0000-000000000004', 'fa580001-0000-0000-0000-000000000004', 'The 7 Ps Chronological Timeline & SOAP ME Emergency Preparation', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa580003-0000-0000-0000-000000000004', 'fa580002-0000-0000-0000-000000000004', 'Induction Agents: Etomidate (0.3 mg/kg) vs Ketamine (1.5-2 mg/kg)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa580004-0000-0000-0000-000000000004', 'fa580003-0000-0000-0000-000000000004', 'Neuromuscular Blockers (Succinylcholine vs Rocuronium) & Waveform EtCO2', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa580005-0000-0000-0000-000000000004', 'fa580004-0000-0000-0000-000000000004', 'Apneic Denitrogenation Reserves, Imidazole Gamma-Aminobutyric Augmentations, Extrajunctional Acetylcholine Effluxes, and End-Tidal Capnographies', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa580006-0000-0000-0000-000000000004', 'fa580005-0000-0000-0000-000000000004', 'EXPLANATION', 1, 
'{"text": "### Rapid Sequence Intubation (RSI)\n\nThe 7 Ps: 1. Preparation (SOAP ME); 2. Preoxygenation (100% O2 denitrogenation); 3. Pretreatment; 4. Paralysis with Induction; 5. Positioning (sniffing position); 6. Placement with Proof (continuous waveform capnography EtCO2); 7. Post-Intubation management. Induction: Etomidate (0.3 mg/kg) is hemodynamically neutral; Ketamine (1.5-2 mg/kg) bronchodilates and preserves sympathetic tone in shock. Paralytics: Succinylcholine (1.5 mg/kg) is contraindicated in burns >24h, crush, or denervation due to lethal hyperkalemic surge; use Rocuronium (1.2 mg/kg)."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;
