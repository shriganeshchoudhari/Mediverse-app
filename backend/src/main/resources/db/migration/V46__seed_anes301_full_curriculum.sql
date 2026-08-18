-- V46: Seed Anesthesiology & Critical Care (ANES-301) Full Curriculum

-- Ensure Subject: ANES-301 exists with correct title and category
INSERT INTO subjects (id, semester_id, code, title, category)
VALUES ('f0e7a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0f', 'c9d0e1f2-b3c4-5d6e-7f8a-9b0c1d2e3f4a', 'ANES-301', 'Anesthesiology & Critical Care', 'CLINICAL')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, category = EXCLUDED.category;

-- Unit 1: Preoperative Airway & ASA Difficult Airway Algorithm
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa080001-0000-0000-0000-000000000001', 'f0e7a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0f', 'Preoperative Airway Evaluation, Mallampati & ASA CICO Cascade', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa080002-0000-0000-0000-000000000001', 'fa080001-0000-0000-0000-000000000001', 'Mallampati Staging, LEMON Score & BONES Mask Criteria', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa080003-0000-0000-0000-000000000001', 'fa080002-0000-0000-0000-000000000001', 'Cormack-Lehane Laryngoscopy & Video Laryngoscopy', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa080004-0000-0000-0000-000000000001', 'fa080003-0000-0000-0000-000000000001', 'ASA 2022 CICO Algorithm & Emergency Front of Neck Access', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa080005-0000-0000-0000-000000000001', 'fa080004-0000-0000-0000-000000000001', 'Preoperative Airway Evaluation, Mallampati Classification, ASA Difficult Airway Algorithm and eFONA', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa080006-0000-0000-0000-000000000001', 'fa080005-0000-0000-0000-000000000001', 'EXPLANATION', 1, 
'{"text": "### Preoperative Airway & Difficult Airway Algorithm\n\nMallampati scoring stages glottic visibility from Class I (full uvula and pillars) to Class IV (hard palate only). BONES criteria predict difficult bag-mask ventilation. The ASA 2022 Difficult Airway Algorithm progresses through Plan A (Video Laryngoscopy <=3 attempts) -> Plan B (2nd-gen LMA) -> Plan C (2-person mask with adjuncts) -> Plan D (Emergency Front of Neck Access eFONA / Scalpel-Bougie-Tube Cricothyroidotomy in CICO crisis)."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 2: Inhalational Anesthetics, MAC & Malignant Hyperthermia
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa080001-0000-0000-0000-000000000002', 'f0e7a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0f', 'Inhalational Anesthetics, MAC & Malignant Hyperthermia', 2)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa080002-0000-0000-0000-000000000002', 'fa080001-0000-0000-0000-000000000002', 'MAC Definition, Blood:Gas Solubility & Agent Kinetics', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa080003-0000-0000-0000-000000000002', 'fa080002-0000-0000-0000-000000000002', 'Sevoflurane, Desflurane, Isoflurane & N2O Profiles', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa080004-0000-0000-0000-000000000002', 'fa080003-0000-0000-0000-000000000002', 'Malignant Hyperthermia Pathophysiology & Dantrolene Dosing', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa080005-0000-0000-0000-000000000002', 'fa080004-0000-0000-0000-000000000002', 'Inhalational Anesthetics, MAC Pharmacodynamics, Malignant Hyperthermia Crisis and Dantrolene Resuscitation', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa080006-0000-0000-0000-000000000002', 'fa080005-0000-0000-0000-000000000002', 'EXPLANATION', 1, 
'{"text": "### Volatile Anesthetics & Malignant Hyperthermia\n\n1 MAC prevents movement in 50% of patients to surgical incision (N2O 104%, Desflurane 6%, Sevoflurane 2%, Isoflurane 1.15%). Malignant Hyperthermia is an autosomal dominant RYR1 mutation triggered by volatiles and succinylcholine. Earliest sign is a sudden, dramatic rise in EtCO2 with masseter spasm and sinus tachycardia. Emergency management mandates stopping volatiles, hyperventilating with 100% O2, and rapid IV Dantrolene 2.5 mg/kg push."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 3: Neuromuscular Blockers, TOF & Sugammadex Reversal
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa080001-0000-0000-0000-000000000003', 'f0e7a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0f', 'Neuromuscular Blockers, TOF Monitoring & Sugammadex Reversal', 3)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa080002-0000-0000-0000-000000000003', 'fa080001-0000-0000-0000-000000000003', 'Depolarizing vs Non-Depolarizing Blockade Mechanisms', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa080003-0000-0000-0000-000000000003', 'fa080002-0000-0000-0000-000000000003', 'Succinylcholine Hyperkalemia & Pseudocholinesterase Apnea', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa080004-0000-0000-0000-000000000003', 'fa080003-0000-0000-0000-000000000003', 'Train-of-Four Monitoring & Sugammadex Cyclodextrin Chelation', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa080005-0000-0000-0000-000000000003', 'fa080004-0000-0000-0000-000000000003', 'Neuromuscular Blocking Agents, Train-of-Four Monitoring, Cisatracurium Hofmann Elimination and Sugammadex', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa080006-0000-0000-0000-000000000003', 'fa080005-0000-0000-0000-000000000003', 'EXPLANATION', 1, 
'{"text": "### Neuromuscular Blockade & Reversal\n\nSuccinylcholine causes depolarization and is contraindicated in burns/denervation due to hyperkalemic arrest. Cisatracurium undergoes organ-independent Hofmann elimination in ESRD. TOF monitoring requires TOF ratio >=0.9 before extubation. Sugammadex chelates Rocuronium in a 1:1 molecular complex, reversing deep blockade (4 mg/kg) and immediate RSI (16 mg/kg) without muscarinic side effects."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 4: Critical Care ARDSNet Ventilation & Proning
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa080001-0000-0000-0000-000000000004', 'f0e7a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0f', 'Critical Care ARDSNet Ventilation, Driving Pressure & Proning', 4)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa080002-0000-0000-0000-000000000004', 'fa080001-0000-0000-0000-000000000004', 'The Berlin Definition of ARDS & Severity Staging', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa080003-0000-0000-0000-000000000004', 'fa080002-0000-0000-0000-000000000004', 'ARDSNet Low Tidal Volume Protocol & Predicted Body Weight', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa080004-0000-0000-0000-000000000004', 'fa080003-0000-0000-0000-000000000004', 'Driving Pressure Optimization, Prone Positioning & ECMO', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa080005-0000-0000-0000-000000000004', 'fa080004-0000-0000-0000-000000000004', 'Mechanical Ventilation in ARDS, ARDSNet Lung-Protective Strategy, Plateau Pressures, Proning and VV-ECMO', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa080006-0000-0000-0000-000000000004', 'fa080005-0000-0000-0000-000000000004', 'EXPLANATION', 1, 
'{"text": "### ARDSNet Mechanical Ventilation & Critical Care\n\nBerlin ARDS definition classifies severity by PaO2/FiO2 ratio (Mild 201-300, Moderate 101-200, Severe <=100). ARDSNet protocol targets Low Tidal Volume (4-8 mL/kg Predicted Body Weight, starting at 6 mL/kg PBW), Plateau Pressure <=30 cmH2O, and Driving Pressure <=14 cmH2O. Prone positioning ventilation for >=16 consecutive hours/day in severe ARDS (P/F <150) reduces mortality by >50%."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;
