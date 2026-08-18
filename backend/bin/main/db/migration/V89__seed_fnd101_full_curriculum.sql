-- V89: Seed Foundation Course & Early Clinical Exposure (FND-101 / ECE-101) Full Curriculum

-- Ensure Subject: FND-101 exists with correct title and category
INSERT INTO subjects (id, semester_id, code, title, category)
VALUES ('d7e8f9a0-b1c2-3d4e-5f6a-7b8c9d0e1f2a', 'c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f', 'FND-101', 'Foundation Course & Early Clinical Exposure', 'PRE_CLINICAL')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, category = EXCLUDED.category;

-- Unit 1: Doctor-Patient Communication, Empathy & History-Taking Models
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa530001-0000-0000-0000-000000000001', 'd7e8f9a0-b1c2-3d4e-5f6a-7b8c9d0e1f2a', 'Doctor-Patient Communication, Empathy & History-Taking Models', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa530002-0000-0000-0000-000000000001', 'fa530001-0000-0000-0000-000000000001', 'The SPIKES 6-Step Protocol for Breaking Bad News', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa530003-0000-0000-0000-000000000001', 'fa530002-0000-0000-0000-000000000001', 'Calgary-Cambridge Medical Interview Model & Patient ICE Exploration', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa530004-0000-0000-0000-000000000001', 'fa530003-0000-0000-0000-000000000001', 'NURSE Empathetic Communication Skills & Difficult Encounter Management', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa530005-0000-0000-0000-000000000001', 'fa530004-0000-0000-0000-000000000001', 'Setting Navigations, Perception Explorations, Knowledge Warning Shots, and Empathetic Emotional Validations', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa530006-0000-0000-0000-000000000001', 'fa530005-0000-0000-0000-000000000001', 'EXPLANATION', 1, 
'{"text": "### Doctor-Patient Communication & History-Taking\n\nSPIKES Protocol: Setting (privacy), Perception (explore understanding), Invitation (ask detail level), Knowledge (clear warning shot and diagnosis), Empathy (NURSE validation of emotion), Strategy/Summary. Calgary-Cambridge: Open-to-closed questioning exploring Ideas, Concerns, and Expectations (ICE). NURSE Skills: Name, Understand, Respect, Support, Explore emotional distress before explaining detailed treatment plans."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 2: Medical Ethics, Bioethics Principles & Patient Autonomy
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa530001-0000-0000-0000-000000000002', 'd7e8f9a0-b1c2-3d4e-5f6a-7b8c9d0e1f2a', 'Medical Ethics, Bioethics Principles & Patient Autonomy', 2)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa530002-0000-0000-0000-000000000002', 'fa530001-0000-0000-0000-000000000002', 'The Four Core Principles of Biomedical Ethics (Beauchamp & Childress)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa530003-0000-0000-0000-000000000002', 'fa530002-0000-0000-0000-000000000002', 'Informed Consent, Decisional Capacity Criteria & Informed Refusal', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa530004-0000-0000-0000-000000000002', 'fa530003-0000-0000-0000-000000000002', 'Tarasoff Duty to Protect, Confidentiality Exceptions & Rule of Double Effect', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa530005-0000-0000-0000-000000000002', 'fa530004-0000-0000-0000-000000000002', 'Self-Determination Primacies, Beneficence-Autonomy Balances, Imminent Violence Warnings, and Palliative Sedation Double Effects', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa530006-0000-0000-0000-000000000002', 'fa530005-0000-0000-0000-000000000002', 'EXPLANATION', 1, 
'{"text": "### Medical Ethics & Bioethics Principles\n\nAutonomy: Patient self-determination supersedes beneficence; competent adults have the right to refuse any medical treatment (including life-saving blood products in Jehovah''s Witnesses). Decisional Capacity: Understands facts, appreciates consequences, reasons choices, expresses a choice. Tarasoff Ruling: Mandates breaching confidentiality to warn and protect an identifiable third party from imminent violent physical harm."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 3: Hospital Infection Control, PPE & Universal Precautions
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa530001-0000-0000-0000-000000000003', 'd7e8f9a0-b1c2-3d4e-5f6a-7b8c9d0e1f2a', 'Hospital Infection Control, PPE & Universal Precautions', 3)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa530002-0000-0000-0000-000000000003', 'fa530001-0000-0000-0000-000000000003', 'WHO 5 Moments for Hand Hygiene & Standard Infection Prevention', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa530003-0000-0000-0000-000000000003', 'fa530002-0000-0000-0000-000000000003', 'Transmission-Based Precautions (Contact, Droplet, Airborne AIIR Isolation)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa530004-0000-0000-0000-000000000003', 'fa530003-0000-0000-0000-000000000003', 'PPE Donning/Doffing Sequencing & Needle-Stick Injury Post-Exposure Prophylaxis', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa530005-0000-0000-0000-000000000003', 'fa530004-0000-0000-0000-000000000003', 'Touchpoint Decontaminations, Spore-Resistant Handwashings, Negative Pressure Exhausts, and Antiretroviral Prophylactic Blockades', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa530006-0000-0000-0000-000000000003', 'fa530005-0000-0000-0000-000000000003', 'EXPLANATION', 1, 
'{"text": "### Hospital Infection Control & Universal Precautions\n\nIsolation Precautions: Contact (Gown/Gloves; C. difficile requires soap and water physical washing), Droplet (Surgical Mask for Meningococcus/Flu), Airborne (N95 respirator + Negative-Pressure AIIR room with >=12 ACH for TB/Measles). PPE Doffing: Gloves -> Shield -> Gown -> Mask -> Hand hygiene. Needle-Stick PEP: Soap/water wash; 3-drug HIV PEP (Tenofovir + Emtricitabine + Dolutegravir) within 2h (max 72h) for 28 days."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 4: Vital Signs, Clinical Triage & Basic Life Assessment
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa530001-0000-0000-0000-000000000004', 'd7e8f9a0-b1c2-3d4e-5f6a-7b8c9d0e1f2a', 'Vital Signs, Clinical Triage & Basic Life Assessment', 4)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa530002-0000-0000-0000-000000000004', 'fa530001-0000-0000-0000-000000000004', 'Blood Pressure Physics, Korotkoff Sounds & Orthostatic Vital Testing', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa530003-0000-0000-0000-000000000004', 'fa530002-0000-0000-0000-000000000004', 'Glasgow Coma Scale (GCS 3-15) Scoring & Airway Intubation Rules', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa530004-0000-0000-0000-000000000004', 'fa530003-0000-0000-0000-000000000004', 'Respiratory Acidosis Dynamics (Kussmaul) & National Early Warning Score (NEWS2)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa530005-0000-0000-0000-000000000004', 'fa530004-0000-0000-0000-000000000004', 'Arterial Occlusion Pressures, Postural Baroreflex Failures, Neurological Coma Stratifications, and Track-and-Trigger Resuscitation Scores', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa530006-0000-0000-0000-000000000004', 'fa530005-0000-0000-0000-000000000004', 'EXPLANATION', 1, 
'{"text": "### Vital Signs & Clinical Triage\n\nBlood Pressure: Cuff bladder must be >=40% width and >=80% arm length; Korotkoff I = Systolic, V = Diastolic. Orthostatic hypotension: drop in Systolic >=20 mmHg or Diastolic >=10 mmHg within 3 min standing. Glasgow Coma Scale: Eye (1-4), Verbal (1-5), Motor (1-6); score <=8 defines severe TBI/coma requiring immediate endotracheal intubation. NEWS2: Aggregates vital parameters to detect inpatient clinical deterioration."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;
