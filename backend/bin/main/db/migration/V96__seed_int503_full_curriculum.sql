-- V96: Seed Internship Core Clinical Postings: Maternal, Neonatal & Pediatric Emergencies (INT-503) Full Curriculum

-- Ensure Subject: INT-503 exists with correct title and category
INSERT INTO subjects (id, semester_id, code, title, category)
VALUES ('f5f9a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a21', 'c9d0e1f2-b3c4-5d6e-7f8a-9b0c1d2e3f4c', 'INT-503', 'Internship Core Clinical Postings: Maternal, Neonatal & Pediatric Emergencies', 'CLINICAL')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, category = EXCLUDED.category;

-- Unit 1: Obstetric Emergencies: Postpartum Hemorrhage & Eclampsia
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa600001-0000-0000-0000-000000000001', 'f5f9a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a21', 'Obstetric Emergencies: Postpartum Hemorrhage & Eclampsia', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa600002-0000-0000-0000-000000000001', 'fa600001-0000-0000-0000-000000000001', 'Postpartum Hemorrhage 4 Ts (Tone Atony 70-80% & Uterotonic Escalation)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa600003-0000-0000-0000-000000000001', 'fa600002-0000-0000-0000-000000000001', 'Uterotonic Safety Contraindications (Carboprost Asthma & Methergine HTN)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa600004-0000-0000-0000-000000000001', 'fa600003-0000-0000-0000-000000000001', 'Severe Preeclampsia & Eclampsia MgSO4 Seizure Prophylaxis & Antidote', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa600005-0000-0000-0000-000000000001', 'fa600004-0000-0000-0000-000000000001', 'Myometrial Atony Reversals, Ergot Vasoconstrictions, Prostaglandinergic Bronchospasms, and Magnesium NMDA Blockades', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa600006-0000-0000-0000-000000000001', 'fa600005-0000-0000-0000-000000000001', 'EXPLANATION', 1, 
'{"text": "### Postpartum Hemorrhage & Eclampsia\n\nPPH 4 Ts: Tone (atony 70-80%), Tissue, Trauma, Thrombin. Uterotonics: Oxytocin 1st-line -> Methylergonovine 0.2 mg IM (BANNED in hypertension/preeclampsia) -> Carboprost 250 mcg IM (BANNED in asthma) -> Misoprostol 800-1,000 mcg PR -> TXA 1 g IV within 3h. Severe Preeclampsia/Eclampsia: Magnesium Sulfate 4-6 g IV load over 20 min -> 1-2 g/hr maintenance for 24h. Monitor patellar reflexes; treat toxicity with Calcium Gluconate 1 g IV stat."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 2: Neonatal Resuscitation Program (NRP 2025 Algorithmic Sequences)
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa600001-0000-0000-0000-000000000002', 'f5f9a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a21', 'Neonatal Resuscitation Program (NRP 2025 Algorithmic Sequences)', 2)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa600002-0000-0000-0000-000000000002', 'fa600001-0000-0000-0000-000000000002', 'NRP Golden Minute, Room Air PPV & Pre-Ductal SpO2 Monitoring', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa600003-0000-0000-0000-000000000002', 'fa600002-0000-0000-0000-000000000002', 'MR SOPA Corrective Steps for Ventilation Failure Before Compressions', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa600004-0000-0000-0000-000000000002', 'fa600003-0000-0000-0000-000000000002', 'Two-Thumb 3:1 Chest Compressions (100% O2) & Umbilical Venous Epinephrine', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa600005-0000-0000-0000-000000000002', 'fa600004-0000-0000-0000-000000000002', 'Alveolar Aeration Inductions, Pre-Ductal Oximetries, Pharyngeal Obstructive Reversals, and Umbilical Catecholaminergic Resuscitations', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa600006-0000-0000-0000-000000000002', 'fa600005-0000-0000-0000-000000000002', 'EXPLANATION', 1, 
'{"text": "### Neonatal Resuscitation Program (NRP 2025)\n\nGolden Minute: If apneic or HR <100 bpm at 30s -> start PPV at 40-60 bpm with 21% O2 (>=35w) or 21-30% (<35w). If no chest rise -> execute MR SOPA (Mask adjust, Reposition, Suction mouth/nose, Open mouth, Pressure increase, Alt airway ETT/LMA). Compressions: If HR <60 bpm persists after 30s effective PPV with chest movement -> start 3:1 compressions with 100% O2 (90 compressions + 30 breaths/min). If HR <60 persists -> Epinephrine 0.02 mg/kg IV via UVC."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 3: Pediatric Advanced Life Support (PALS Bradycardia, Shock & Arrest)
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa600001-0000-0000-0000-000000000003', 'f5f9a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a21', 'Pediatric Advanced Life Support (PALS Bradycardia, Shock & Arrest)', 3)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa600002-0000-0000-0000-000000000003', 'fa600001-0000-0000-0000-000000000003', 'Symptomatic Bradycardia (Hypoxia Cause & CPR Threshold HR <60 bpm)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa600003-0000-0000-0000-000000000003', 'fa600002-0000-0000-0000-000000000003', 'Weight-Based Defibrillation (2 J/kg -> 4 J/kg) & Pediatric Cardiac Arrest', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa600004-0000-0000-0000-000000000003', 'fa600003-0000-0000-0000-000000000003', 'Pediatric Shock: 20 mL/kg Fluid Boluses & Cold vs Warm Pressor Selection', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa600005-0000-0000-0000-000000000003', 'fa600004-0000-0000-0000-000000000003', 'Hypoxic Sinus Node Depressions, Energy Escalation Defibrillations, Volumetric Myocardial Fillings, and Inotropic Adrenoceptor Titrations', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa600006-0000-0000-0000-000000000003', 'fa600005-0000-0000-0000-000000000003', 'EXPLANATION', 1, 
'{"text": "### Pediatric Advanced Life Support (PALS 2025)\n\nSymptomatic Bradycardia: Hypoxia is the primary cause. Oxygenate and ventilate first. If HR remains <60 bpm with poor perfusion despite ventilation -> START CHEST COMPRESSIONS -> Epinephrine 0.01 mg/kg IV/IO. Defibrillation: Shockable arrest (VF/pVT) -> 1st shock 2 J/kg -> 2nd shock 4 J/kg -> subsequent >=4 J/kg (max 10 J/kg); Amiodarone 5 mg/kg. Shock: 20 mL/kg isotonic crystalloid bolus over 10-20 min; stop if hepatomegaly appears. Epinephrine for cold shock; Norepinephrine for warm shock."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 4: Pediatric Status Epilepticus & Acute Airway Obstruction
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa600001-0000-0000-0000-000000000004', 'f5f9a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a21', 'Pediatric Status Epilepticus & Acute Airway Obstruction', 4)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa600002-0000-0000-0000-000000000004', 'fa600001-0000-0000-0000-000000000004', 'Status Epilepticus Emergency Phases (0-5m Glucose, 5-10m Benzos, 10-20m Keppra)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa600003-0000-0000-0000-000000000004', 'fa600002-0000-0000-0000-000000000004', 'Non-IV Anticonvulsant Regimens: IM/IN Midazolam & Rectal Diazepam', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa600004-0000-0000-0000-000000000004', 'fa600003-0000-0000-0000-000000000004', 'Acute Croup (Steeple Sign / Dexamethasone) vs Epiglottitis (Thumbprint / OR Safety)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa600005-0000-0000-0000-000000000004', 'fa600004-0000-0000-0000-000000000004', 'Gamma-Aminobutyric Receptoral Desensitizations, Intramuscular Bioavailabilities, Subglottic Edematous Reductions, and Supraglottic Protective Intubations', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa600006-0000-0000-0000-000000000004', 'fa600005-0000-0000-0000-000000000004', 'EXPLANATION', 1, 
'{"text": "### Status Epilepticus & Upper Airway Emergencies\n\nStatus Epilepticus: Phase 1 (0-5 min) ABCs, check glucose (D10W 2 mL/kg). Phase 2 (5-10 min) Lorazepam 0.1 mg/kg IV (or IM Midazolam 0.2 mg/kg if no IV). Phase 3 (10-20 min) Levetiracetam 60 mg/kg IV or Fosphenytoin 20 mg PE/kg. Phase 4 (>20-40 min) intubation + continuous anesthetic infusion. Upper Airway: Croup (steeple sign) -> Dexamethasone 0.6 mg/kg + Racemic Epinephrine. Epiglottitis (thumbprint sign, drooling, tripod) -> DO NOT AGITATE, NO TONGUE DEPRESSOR -> emergent OR intubation with ENT present."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;
