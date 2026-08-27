-- V48: Seed Emergency Medicine & Acute Resuscitation (EM-301) Full Curriculum

-- Ensure Subject: EM-401 / EM-301 exists with correct title and category
INSERT INTO subjects (id, semester_id, code, title, category)
VALUES ('f0f7a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a1a', 'c9d0e1f2-b3c4-5d6e-7f8a-9b0c1d2e3f4a', 'EM-401', 'Emergency Medicine & Acute Resuscitation', 'CLINICAL')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, category = EXCLUDED.category;

-- Unit 1: AHA ACLS Cardiac Arrest Algorithms & Defibrillation
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa100001-0000-0000-0000-000000000001', 'f0f7a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a1a', 'AHA ACLS Cardiac Arrest Algorithms, Defibrillation & Post-ROSC Care', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa100002-0000-0000-0000-000000000001', 'fa100001-0000-0000-0000-000000000001', 'High-Quality CPR Metrics & Waveform Capnography (EtCO2)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa100003-0000-0000-0000-000000000001', 'fa100002-0000-0000-0000-000000000001', 'Shockable VF/pVT Defibrillation & Antiarrhythmics', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa100004-0000-0000-0000-000000000001', 'fa100003-0000-0000-0000-000000000001', 'Non-Shockable PEA/Asystole & Reversible 5 Hs and 5 Ts', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa100005-0000-0000-0000-000000000001', 'fa100004-0000-0000-0000-000000000001', 'AHA ACLS Adult Cardiac Arrest Protocol, Defibrillation, Epinephrine/Amiodarone Dosing and Post-ROSC TTM', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa100006-0000-0000-0000-000000000001', 'fa100005-0000-0000-0000-000000000001', 'EXPLANATION', 1, 
'{"text": "### AHA ACLS Cardiac Arrest Protocol\n\nHigh-quality CPR mandates rate 100-120 cpm, depth 5-6 cm, full recoil, and EtCO2 monitoring (EtCO2 >=35 mmHg indicates ROSC). Shockable arrest (VF/pVT) requires immediate 200J biphasic shock, 2 minutes CPR without pulse check, Epinephrine 1 mg q3-5m after 2nd shock, and Amiodarone 300 mg after 3rd shock. Non-shockable arrest (PEA/Asystole) requires early Epinephrine 1 mg and aggressive reversal of the 5 Hs and 5 Ts."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 2: Shock Classification, Hemodynamics & Surviving Sepsis
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa100001-0000-0000-0000-000000000002', 'f0f7a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a1a', 'Shock Classification, Hemodynamics & Surviving Sepsis Bundle', 2)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa100002-0000-0000-0000-000000000002', 'fa100001-0000-0000-0000-000000000002', 'Hemodynamic Profiling of Shock States (Preload, CO, SVR)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa100003-0000-0000-0000-000000000002', 'fa100002-0000-0000-0000-000000000002', 'Surviving Sepsis Campaign 1-Hour Bundle & Norepinephrine', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa100004-0000-0000-0000-000000000002', 'fa100003-0000-0000-0000-000000000002', 'Anaphylactic Shock & IM Epinephrine 0.5 mg (1:1000) Resuscitation', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa100005-0000-0000-0000-000000000002', 'fa100004-0000-0000-0000-000000000002', 'Shock Hemodynamic Differentiation, Surviving Sepsis 1-Hour Bundle, Norepinephrine Titration and Anaphylaxis', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa100006-0000-0000-0000-000000000002', 'fa100005-0000-0000-0000-000000000002', 'EXPLANATION', 1, 
'{"text": "### Shock Classification & Sepsis Resuscitation\n\nHypovolemic (low CVP, low CO, high SVR), Cardiogenic (high CVP/PCWP, low CO, high SVR), Distributive Septic (low SVR, high/low CO). Surviving Sepsis 1-hour bundle: measure lactate, draw blood cultures, broad-spectrum IV antibiotics, 30 mL/kg balanced crystalloids, and Norepinephrine first-line vasopressor targeting MAP >= 65 mmHg. Anaphylactic shock requires immediate IM Epinephrine 0.5 mg (1:1000) in anterolateral thigh."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 3: Toxicology Toxidromes, Antidotes & Acetaminophen Nomogram
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa100001-0000-0000-0000-000000000003', 'f0f7a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a1a', 'Toxicology Toxidromes, Antidotes & Acetaminophen Nomogram', 3)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa100002-0000-0000-0000-000000000003', 'fa100001-0000-0000-0000-000000000003', 'The 5 Classic Toxidromes (Cholinergic, Anticholinergic, Opioid)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa100003-0000-0000-0000-000000000003', 'fa100002-0000-0000-0000-000000000003', 'Acetaminophen Toxicity & The Rumack-Matthew Nomogram (NAC)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa100004-0000-0000-0000-000000000003', 'fa100003-0000-0000-0000-000000000003', 'Snakebite Envenomation (20WBCT & Polyvalent ASV) & Inhalants', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa100005-0000-0000-0000-000000000003', 'fa100004-0000-0000-0000-000000000003', 'Toxicology Toxidromes, Rumack-Matthew APAP Nomogram, N-Acetylcysteine, Snakebite 20WBCT and ASV Antidote Protocols', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa100006-0000-0000-0000-000000000003', 'fa100005-0000-0000-0000-000000000003', 'EXPLANATION', 1, 
'{"text": "### Toxicology & Targeted Antidotes\n\nCholinergic (organophosphates: Atropine + 2-PAM), Anticholinergic (Physostigmine), Sympathomimetic (Benzodiazepines; avoid pure beta-blockers), Opioid (Naloxone). Acetaminophen overdose produces toxic NAPQI; plot 4-hour APAP level on Rumack-Matthew nomogram (treatment line >=150 ug/mL at 4h) and start IV N-Acetylcysteine (NAC). Snakebite envenomation uses 20WBCT to guide polyvalent ASV (10 vials initial infusion)."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 4: ATLS Primary Survey ABCDE & Massive Transfusion
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa100001-0000-0000-0000-000000000004', 'f0f7a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a1a', 'ATLS Primary Survey ABCDE & Massive Transfusion', 4)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa100002-0000-0000-0000-000000000004', 'fa100001-0000-0000-0000-000000000004', 'The ATLS Primary Survey (ABCDE) & Airway Indications', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa100003-0000-0000-0000-000000000004', 'fa100002-0000-0000-0000-000000000004', 'Tension Pneumothorax Decompression & Chest Tube Placement', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa100004-0000-0000-0000-000000000004', 'fa100003-0000-0000-0000-000000000004', 'Massive Transfusion Protocol (MTP 1:1:1) & Tranexamic Acid (TXA)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa100005-0000-0000-0000-000000000004', 'fa100004-0000-0000-0000-000000000004', 'ATLS Primary Survey, Emergency Thoracostomy, Massive Hemothorax, Pelvic Binders, MTP 1:1:1 Ratio and Tranexamic Acid', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa100006-0000-0000-0000-000000000004', 'fa100005-0000-0000-0000-000000000004', 'EXPLANATION', 1, 
'{"text": "### ATLS Trauma & Damage Control Resuscitation\n\nATLS ABCDE survey: Airway + C-spine, Breathing (immediate needle decompression in 5th ICS AAL / 2nd ICS MCL for tension pneumothorax followed by chest tube; massive hemothorax >1500 mL -> thoracotomy), Circulation (pelvic binder, MTP 1:1:1 PRBC:FFP:Platelets, IV Tranexamic Acid TXA 1g within 3 hours), Disability (GCS 3-15), Exposure (prevent hypothermia). The lethal trauma triad combines Hypothermia, Acidosis, and Coagulopathy."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;
