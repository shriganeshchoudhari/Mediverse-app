-- V47: Seed AETCOM & Medical Ethics (AETCOM-001) Full Curriculum

-- Ensure Subject: AET-101 / AETCOM-001 exists with correct title and category
INSERT INTO subjects (id, semester_id, code, title, category)
VALUES ('d9e0f1a2-b3c4-5d6e-7f8a-9b0c1d2e3f4a', 'c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f', 'AET-101', 'AETCOM & Medical Ethics', 'PRE_CLINICAL')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, category = EXCLUDED.category;

-- Unit 1: The 4 Principles of Bioethics, Informed Consent & Capacity
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa090001-0000-0000-0000-000000000001', 'd9e0f1a2-b3c4-5d6e-7f8a-9b0c1d2e3f4a', 'The 4 Principles of Bioethics, Informed Consent & Capacity', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa090002-0000-0000-0000-000000000001', 'fa090001-0000-0000-0000-000000000001', 'Autonomy, Beneficence, Non-Maleficence & Distributive Justice', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa090003-0000-0000-0000-000000000001', 'fa090002-0000-0000-0000-000000000001', 'Informed Consent Elements & Informed Refusal Rights', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa090004-0000-0000-0000-000000000001', 'fa090003-0000-0000-0000-000000000001', 'Decision-Making Capacity (CURB Criteria) & Surrogate Hierarchy', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa090005-0000-0000-0000-000000000001', 'fa090004-0000-0000-0000-000000000001', 'The 4 Principles of Bioethics, Informed Consent Requirements, CURB Capacity Assessment and Surrogate Decision-Making', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa090006-0000-0000-0000-000000000001', 'fa090005-0000-0000-0000-000000000001', 'EXPLANATION', 1, 
'{"text": "### The 4 Principles of Bioethics & Informed Consent\n\nBeauchamp & Childress bioethical principles: 1. Autonomy (patient self-determination; absolute right of competent refusal, e.g. blood in Jehovah''s Witnesses), 2. Beneficence (acting in patient''s best interest), 3. Non-maleficence (Primum non nocere), 4. Justice (fair resource distribution). Informed consent requires Disclosure, Comprehension, Voluntariness, and Capacity. Clinical decision-making capacity is assessed via CURB criteria: Communicate choice, Understand facts, Reason through options, and Believe/Appreciate personal consequences."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 2: The SPIKES Protocol for Delivering Bad News & NURSE Empathy
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa090001-0000-0000-0000-000000000002', 'd9e0f1a2-b3c4-5d6e-7f8a-9b0c1d2e3f4a', 'The SPIKES Protocol for Delivering Bad News & NURSE Empathy', 2)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa090002-0000-0000-0000-000000000002', 'fa090001-0000-0000-0000-000000000002', 'SPIKES 6-Step Framework for Breaking Difficult Diagnoses', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa090003-0000-0000-0000-000000000002', 'fa090002-0000-0000-0000-000000000002', 'The NURSE Framework for Expressing Clinical Empathy', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa090004-0000-0000-0000-000000000002', 'fa090003-0000-0000-0000-000000000002', 'Handling Family Demands to Withhold Diagnoses & Collusion', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa090005-0000-0000-0000-000000000002', 'fa090004-0000-0000-0000-000000000002', 'The SPIKES Communication Protocol, Warning Shots, NURSE Empathy Statements and Managing Family Non-Disclosure', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa090006-0000-0000-0000-000000000002', 'fa090005-0000-0000-0000-000000000002', 'EXPLANATION', 1, 
'{"text": "### The SPIKES Protocol & Clinical Empathy\n\nSPIKES protocol: Setting (privacy, eye level), Perception (ask what they know), Invitation (ask how much detail), Knowledge (warning shot + plain language), Empathy (NURSE: Name, Understand, Respect, Support, Explore), Strategy & Teach-Back. In family collusion requests (Do not tell patient), explore family fears, then ask the patient directly how they prefer to receive information."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 3: Confidentiality, Tarasoff Warning & Malpractice 4 Ds
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa090001-0000-0000-0000-000000000003', 'd9e0f1a2-b3c4-5d6e-7f8a-9b0c1d2e3f4a', 'Confidentiality, Tarasoff Warning & Malpractice 4 Ds', 3)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa090002-0000-0000-0000-000000000003', 'fa090001-0000-0000-0000-000000000003', 'Doctor-Patient Privilege & Mandatory Breach Exceptions', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa090003-0000-0000-0000-000000000003', 'fa090002-0000-0000-0000-000000000003', 'The Tarasoff Ruling (Duty to Warn & Protect)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa090004-0000-0000-0000-000000000003', 'fa090003-0000-0000-0000-000000000003', 'The 4 Ds of Medical Negligence & Res Ipsa Loquitur', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa090005-0000-0000-0000-000000000003', 'fa090004-0000-0000-0000-000000000003', 'Medical Confidentiality Boundaries, Tarasoff Mandatory Breach, Child Abuse Reporting and Tort Law Negligence (4 Ds)', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa090006-0000-0000-0000-000000000003', 'fa090005-0000-0000-0000-000000000003', 'EXPLANATION', 1, 
'{"text": "### Confidentiality & Medical Malpractice\n\nDoctor-patient confidentiality is mandatory except: 1. Tarasoff duty to warn (imminent credible threat against identifiable victim), 2. Suspected child/elder abuse (immediate reporting without parent consent), 3. Notifiable communicable infections, 4. Impaired drivers. Medical malpractice requires the 4 Ds: Duty of care, Dereliction (breach of standard), Direct causation, and Damages. Res Ipsa Loquitur (retained surgical sponge) shifts the burden of proof to the physician."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 4: End-of-Life Ethics, Double Effect & Brain Death Criteria
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa090001-0000-0000-0000-000000000004', 'd9e0f1a2-b3c4-5d6e-7f8a-9b0c1d2e3f4a', 'End-of-Life Ethics, Double Effect & Brain Death Criteria', 4)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa090002-0000-0000-0000-000000000004', 'fa090001-0000-0000-0000-000000000004', 'Withholding vs Withdrawing Life Support & DNR Orders', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa090003-0000-0000-0000-000000000004', 'fa090002-0000-0000-0000-000000000004', 'The Doctrine of Double Effect in Palliative Opioid Dosing', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa090004-0000-0000-0000-000000000004', 'fa090003-0000-0000-0000-000000000004', 'Brain Death Triad, Brainstem Reflexes & Apnea Testing', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa090005-0000-0000-0000-000000000004', 'fa090004-0000-0000-0000-000000000004', 'End-of-Life Palliative Ethics, The Doctrine of Double Effect, Brain Death Determination and Organ Donation', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa090006-0000-0000-0000-000000000004', 'fa090005-0000-0000-0000-000000000004', 'EXPLANATION', 1, 
'{"text": "### End-of-Life Ethics & Brain Death\n\nWithholding and withdrawing futile life-sustaining treatment are ethically equivalent. DNR applies solely to CPR. The Doctrine of Double Effect permits escalating opioid doses for severe terminal pain/dyspnea despite foreseen risk of hastened death, provided the sole intent is symptom relief. Brain death requires: 1. Deep coma, 2. Absence of all brainstem reflexes (pupils, corneal, doll''s eyes, cold calorics, gag, cough), 3. Positive Apnea Test (no breathing with PaCO2 >= 60 mmHg)."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;
