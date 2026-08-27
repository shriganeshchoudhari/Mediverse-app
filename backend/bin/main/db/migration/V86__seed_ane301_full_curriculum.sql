-- V86: Seed Advanced Anesthesiology, Perioperative Medicine & Pain Management (ANE-301) Full Curriculum

-- Ensure Subject: ANE-301 exists with correct title and category
INSERT INTO subjects (id, semester_id, code, title, category)
VALUES ('f1d0a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a44', 'c7d8e9f0-b1c2-3d4e-5f6a-7b8c9d0e1f2a', 'ANE-301', 'Advanced Anesthesiology, Perioperative Medicine & Pain Management', 'CLINICAL')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, category = EXCLUDED.category;

-- Unit 1: Difficult Airway Algorithms & Emergency Cricothyroidotomy
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa490001-0000-0000-0000-000000000001', 'f1d0a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a44', 'Difficult Airway Algorithms & Emergency Cricothyroidotomy', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa490002-0000-0000-0000-000000000001', 'fa490001-0000-0000-0000-000000000001', 'LEMON Airway Assessment & Mallampati Classification (Class I-IV)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa490003-0000-0000-0000-000000000001', 'fa490002-0000-0000-0000-000000000001', 'ASA Difficult Airway Algorithm & Video Laryngoscopy Optimization', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa490004-0000-0000-0000-000000000001', 'fa490003-0000-0000-0000-000000000001', 'Cannot Intubate Cannot Oxygenate (CICO) & Scalpel-Bougie-Tube FONA', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa490005-0000-0000-0000-000000000001', 'fa490004-0000-0000-0000-000000000001', 'Oropharyngeal Anatomical Classifications, Hyperangulated Optical Intubations, Supraglottic Gas Seals, and Emergent Front-of-Neck Access Protocols', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa490006-0000-0000-0000-000000000001', 'fa490005-0000-0000-0000-000000000001', 'EXPLANATION', 1, 
'{"text": "### Difficult Airway & Emergency Cricothyroidotomy\n\nLEMON Assessment: 3-3-2 rule, Mallampati I-IV, Cormack-Lehane grades 1-4. CICO Emergency: When Plan A (video laryngoscopy), Plan B (SAD/LMA), and Plan C (two-person BVM) fail, declare CICO and execute immediate Front-of-Neck Access (FONA) via Scalpel-Bougie-Tube Cricothyroidotomy: transverse membrane incision, bougie insertion, and railroading a size 6.0 mm cuffed tube."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 2: Local Anesthetic Systemic Toxicity & 20% Lipid Emulsion Rescue
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa490001-0000-0000-0000-000000000002', 'f1d0a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a44', 'Local Anesthetic Systemic Toxicity & 20% Lipid Emulsion Rescue', 2)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa490002-0000-0000-0000-000000000002', 'fa490001-0000-0000-0000-000000000002', 'Bupivacaine Nav1.5 Blockade & Refractory Ventricular Arrhythmias', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa490003-0000-0000-0000-000000000002', 'fa490002-0000-0000-0000-000000000002', 'ASRA 20% Lipid Emulsion (Intralipid) Resuscitation Protocol', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa490004-0000-0000-0000-000000000002', 'fa490003-0000-0000-0000-000000000002', 'ACLS Resuscitation Modifications & Benzocaine Methemoglobinemia', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa490005-0000-0000-0000-000000000002', 'fa490004-0000-0000-0000-000000000002', 'Voltage-Gated Sodium Channel Kinematics, Intravascular Lipid Sink Extractions, Low-Dose Catecholamine Adaptations, and Ferric Heme Reductions', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa490006-0000-0000-0000-000000000002', 'fa490005-0000-0000-0000-000000000002', 'EXPLANATION', 1, 
'{"text": "### Local Anesthetic Toxicity & Lipid Rescue\n\nLAST: Bupivacaine high lipid solubility and slow dissociation from Nav1.5 causes CNS neurotoxicity followed by refractory ventricular arrhythmias/asystole. ASRA Antidote: 20% Lipid Emulsion 1.5 mL/kg IV bolus over 2-3m, then 0.25 mL/kg/min infusion (max 10-12 mL/kg over 30m). ACLS Modifications: AVOID Vasopressin, Beta-Blockers, Calcium-Blockers, and Lidocaine; reduce Epinephrine to <=1 mcg/kg."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 3: Intravenous/Inhalational Anesthetics, Malignant Hyperthermia & PRIS
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa490001-0000-0000-0000-000000000003', 'f1d0a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a44', 'Intravenous/Inhalational Anesthetics, Malignant Hyperthermia & PRIS', 3)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa490002-0000-0000-0000-000000000003', 'fa490001-0000-0000-0000-000000000003', 'Propofol (PRIS), Etomidate (Adrenal Suppression) & Ketamine (NMDA)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa490003-0000-0000-0000-000000000003', 'fa490002-0000-0000-0000-000000000003', 'Malignant Hyperthermia RYR1 Mutation & End-Tidal CO2 Surge', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa490004-0000-0000-0000-000000000003', 'fa490003-0000-0000-0000-000000000003', 'MHAUS Management: Volatile Cessation & IV Dantrolene 2.5 mg/kg Push', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa490005-0000-0000-0000-000000000003', 'fa490004-0000-0000-0000-000000000003', 'GABAergic Neuronal Inactivations, Adrenal Hydroxylase Blocks, Ryanodine Sarcoplasmic Calcium Discharges, and Dantrolene Rescues', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa490006-0000-0000-0000-000000000003', 'fa490005-0000-0000-0000-000000000003', 'EXPLANATION', 1, 
'{"text": "### Anesthetic Pharmacology & Malignant Hyperthermia\n\nInduction Agents: Propofol (GABA-A, hypotension, PRIS high-dose syndrome); Etomidate (cardiostable, 11-beta-hydroxylase adrenal suppression); Ketamine (dissociative NMDA antagonist, preserves airway reflexes and BP). Malignant Hyperthermia: Autosomal dominant RYR1 mutation exposed to volatiles + succinylcholine; earliest sign is unexplained rapid rise in EtCO2; immediately turn off volatiles, hyperventilate with 100% O2, and push IV Dantrolene 2.5 mg/kg."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 4: Neuromuscular Blockade, Train-of-Four & Sugammadex Reversal
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa490001-0000-0000-0000-000000000004', 'f1d0a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a44', 'Neuromuscular Blockade, Train-of-Four & Sugammadex Reversal', 4)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa490002-0000-0000-0000-000000000004', 'fa490001-0000-0000-0000-000000000004', 'Succinylcholine (Hyperkalemia / Phase I-II) & Cisatracurium (Hofmann)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa490003-0000-0000-0000-000000000004', 'fa490002-0000-0000-0000-000000000004', 'Quantitative Train-of-Four (TOF Ratio >= 0.90) Extubation Thresholds', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa490004-0000-0000-0000-000000000004', 'fa490003-0000-0000-0000-000000000004', 'Sugammadex Cyclodextrin Encapsulation (2 / 4 / 16 mg/kg) vs Neostigmine', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa490005-0000-0000-0000-000000000004', 'fa490004-0000-0000-0000-000000000004', 'Post-Junctional Nicotinic Desensitizations, Spontaneous Hofmann Hydrolyses, Quantitative Acceleromyographic Thresholds, and Gamma-Cyclodextrin Molecular Enclosures', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa490006-0000-0000-0000-000000000004', 'fa490005-0000-0000-0000-000000000004', 'EXPLANATION', 1, 
'{"text": "### Neuromuscular Blockade & Sugammadex Reversal\n\nNMBAs: Succinylcholine raises serum K+ by 0.5 mEq/L (fatal in burns/denervation); Cisatracurium undergoes organ-independent Hofmann elimination (safe in hepatorenal failure). TOF Monitoring: Target TOF ratio >= 0.90 (90%) required before extubation to prevent residual paralysis. Reversal: Sugammadex encapsulates Rocuronium (2 mg/kg for TOF >=2, 4 mg/kg for deep block TOF 0/4 with PTC 1-2, and 16 mg/kg for immediate post-RSI rescue); Neostigmine requires >=2 twitches."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;
