-- V92: Seed Clinical Postings II (CLIN-302) Full Curriculum

-- Ensure Subject: CLIN-302 exists with correct title and category
INSERT INTO subjects (id, semester_id, code, title, category)
VALUES ('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'c6d7e8f9-b0c1-2d3e-4f5a-6b7c8d9e0f1a', 'CLIN-302', 'Clinical Postings II: Inpatient Surgery & Perioperative Care', 'CLINICAL')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, category = EXCLUDED.category;

-- Unit 1: Preoperative Risk Stratification & Surgical Clearance
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa560001-0000-0000-0000-000000000001', 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'Preoperative Risk Stratification & Surgical Clearance', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa560002-0000-0000-0000-000000000001', 'fa560001-0000-0000-0000-000000000001', 'Revised Cardiac Risk Index (RCRI Lee 6-Factor Model) & ASA Classes', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa560003-0000-0000-0000-000000000001', 'fa560002-0000-0000-0000-000000000001', 'Functional Capacity METs Reserve (>=4 METs Stress Test Waiver)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa560004-0000-0000-0000-000000000001', 'fa560003-0000-0000-0000-000000000001', 'Perioperative Pharmacotherapy: ACEI Vasoplegia & SGLT2i euDKA Prevention', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa560005-0000-0000-0000-000000000001', 'fa560004-0000-0000-0000-000000000001', 'Adverse Cardiac Event Stratifications, Metabolic Flight Reserves, Vasoplegic Preventions, and Ketoacidotic Depletions', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa560006-0000-0000-0000-000000000001', 'fa560005-0000-0000-0000-000000000001', 'EXPLANATION', 1, 
'{"text": "### Preoperative Risk Stratification\n\nRCRI: 6 predictors (high-risk surgery, ischemic heart disease, CHF, stroke/TIA, insulin diabetes, creatinine >2.0 mg/dL). Class IV (>=3 predictors) carries >11% MACE risk. Functional capacity >=4 METs permits surgery without routine stress testing. Medication Holds: Continue beta-blockers/statins; HOLD ACE inhibitors on morning of surgery (prevents vasoplegic hypotension); HOLD SGLT2 inhibitors 3-4 days prior (prevents euglycemic DKA)."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 2: Postoperative Fever Differential & Evaluation Protocols
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa560001-0000-0000-0000-000000000002', 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'Postoperative Fever Differential & Evaluation Protocols', 2)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa560002-0000-0000-0000-000000000002', 'fa560001-0000-0000-0000-000000000002', 'The Chronological 5 Ws: Wind (POD 1-2), Water (POD 3), Wound (POD 5)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa560003-0000-0000-0000-000000000002', 'fa560002-0000-0000-0000-000000000002', 'Walking (POD 7-10 DVT/PE) & Wonder Drugs (Drug Fever & HIT 4T Score)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa560004-0000-0000-0000-000000000002', 'fa560003-0000-0000-0000-000000000002', 'Hyperacute Intraoperative Malignant Hyperthermia (RYR1 & IV Dantrolene)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa560005-0000-0000-0000-000000000002', 'fa560004-0000-0000-0000-000000000002', 'Atelectatic Splintings, Indwelling Coliform Bacteriurias, Surgical Incision Abscess Openings, and Ryanodine Receptor Antagonisms', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa560006-0000-0000-0000-000000000002', 'fa560005-0000-0000-0000-000000000002', 'EXPLANATION', 1, 
'{"text": "### Postoperative Fever & The 5 Ws\n\nChronology: POD 1-2 Wind (Atelectasis -> incentive spirometry), POD 3 Water (UTI -> pull Foley), POD 5 Wound (Surgical site infection -> open staples, drain, pack), POD 7-10 Walking (DVT/PE -> anticoagulation), Anytime Wonder Drugs. Malignant Hyperthermia: Intraoperative volatile anesthetics/succinylcholine trigger RYR1 calcium surge -> rising EtCO2, rigidity, extreme fever -> Stop triggers, 100% O2, IV Dantrolene 2.5 mg/kg."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 3: Surgical Drain Management & Chest Tube Physics
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa560001-0000-0000-0000-000000000003', 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'Surgical Drain Management & Chest Tube Physics', 3)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa560002-0000-0000-0000-000000000003', 'fa560001-0000-0000-0000-000000000003', 'Closed-Suction Jackson-Pratt (JP) & Blake Drains (<30 mL/24h Removal)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa560003-0000-0000-0000-000000000003', 'fa560002-0000-0000-0000-000000000003', 'Pathological Drain Analysis: Blood (>100 mL/hr), Bile & Chylous Triglycerides', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa560004-0000-0000-0000-000000000003', 'fa560003-0000-0000-0000-000000000003', '3-Chamber Chest Drainage Physics: Water Seal Tidaling vs Air Leak Bubbling', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa560005-0000-0000-0000-000000000003', 'fa560004-0000-0000-0000-000000000003', 'Negative Vacuum Evacuations, Anastomotic Biliary Leaks, Thoracic Duct Ruptures, and Pleural Air Leak Manometries', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa560006-0000-0000-0000-000000000003', 'fa560005-0000-0000-0000-000000000003', 'EXPLANATION', 1, 
'{"text": "### Surgical Drains & Chest Tube Physics\n\nJP Drains: Compressed bulb creates closed negative suction. Removal criteria: <30 mL/24h clear serosanguinous fluid. Fluid triglycerides >110 mg/dL confirms chylous leak. Chest Tubes: 3 chambers (Collection, Water Seal 2 cm H2O, Suction -20 cm H2O). Tidaling is normal; continuous bubbling in water seal indicates active parenchymal air leak. NEVER clamp a bubbling chest tube (causes Tension Pneumothorax)."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 4: Acute Wound Complications & Postoperative Emergencies
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa560001-0000-0000-0000-000000000004', 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'Acute Wound Complications & Postoperative Emergencies', 4)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa560002-0000-0000-0000-000000000004', 'fa560001-0000-0000-0000-000000000004', 'Expanding Neck Hematoma Airway Emergency (Immediate Bedside Decompression)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa560003-0000-0000-0000-000000000004', 'fa560002-0000-0000-0000-000000000004', 'Fascial Dehiscence: Salmon-Pink Serosanguinous Fluid Gush (POD 5-8)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa560004-0000-0000-0000-000000000004', 'fa560003-0000-0000-0000-000000000004', 'Abdominal Visceral Evisceration: Sterile Saline Gauze & Emergent OR Laparotomy', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa560005-0000-0000-0000-000000000004', 'fa560004-0000-0000-0000-000000000004', 'Cervical Hematoma Tracheal Unroofings, Seroma Fluid Reabsorptions, Salmon Fluid Ruptures, and Moist Saline Visceral Shields', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa560006-0000-0000-0000-000000000004', 'fa560005-0000-0000-0000-000000000004', 'EXPLANATION', 1, 
'{"text": "### Acute Wound Complications & Emergencies\n\nExpanding Neck Hematoma: Post-thyroidectomy stridor/swelling is an AIRWAY EMERGENCY -> immediately open wound at the bedside. Fascial Dehiscence: Sudden gush of salmon-pink serosanguinous fluid soaking dressings on POD 5-8. Abdominal Evisceration: Bowel extrusion through incision -> Immediately cover with STERILE SALINE-SOAKED GAUZE, keep NPO, give IV fluids/antibiotics, and transfer immediately to OR for emergent laparotomy."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;
