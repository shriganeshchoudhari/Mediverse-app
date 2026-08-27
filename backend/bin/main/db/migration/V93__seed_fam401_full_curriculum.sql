-- V93: Seed Family Medicine & Primary Care Postings (FAM-401) Full Curriculum

-- Ensure Subject: FAM-401 exists with correct title and category
INSERT INTO subjects (id, semester_id, code, title, category)
VALUES ('f2f9a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a18', 'c9d0e1f2-b3c4-5d6e-7f8a-9b0c1d2e3f4b', 'FAM-401', 'Family Medicine & Primary Care Postings', 'CLINICAL')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, category = EXCLUDED.category;

-- Unit 1: Preventive Health Screening & USPSTF Cancer Surveillance
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa570001-0000-0000-0000-000000000001', 'f2f9a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a18', 'Preventive Health Screening & USPSTF Cancer Surveillance', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa570002-0000-0000-0000-000000000001', 'fa570001-0000-0000-0000-000000000001', 'USPSTF Cancer Surveillance: Colorectal (45-75y), Breast & Cervical Guidelines', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa570003-0000-0000-0000-000000000001', 'fa570002-0000-0000-0000-000000000001', 'Low-Dose CT Lung Cancer Screening (50-80y & >=20 Pack-Years) & AAA Ultrasound', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa570004-0000-0000-0000-000000000001', 'fa570003-0000-0000-0000-000000000001', 'Adult Immunization Schedules: Shingrix (>=50y), Pneumococcal PCV20 & Tdap', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa570005-0000-0000-0000-000000000001', 'fa570004-0000-0000-0000-000000000001', 'Colorectal Polyp Resections, Helical Thoracic Tomographies, Aneurysmal Sonographies, and Glycoprotein Adjuvancies', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa570006-0000-0000-0000-000000000001', 'fa570005-0000-0000-0000-000000000001', 'EXPLANATION', 1, 
'{"text": "### Preventive Health Screening\n\nUSPSTF Guidelines: Colorectal cancer screening ages 45-75 (colonoscopy q10y or annual FIT). Breast cancer biennial mammography ages 40-74. Cervical cancer ages 21-29 Pap q3y; ages 30-65 hrHPV q5y or Pap q3y; stop at 65 if adequate prior negative tests. Lung cancer annual LDCT ages 50-80 with >=20 pack-years (smoke or quit <15y). AAA one-time ultrasound in men 65-75 who ever smoked. Vaccines: Shingrix (>=50y, 2 doses), PCV20 single dose (>=65y), Tdap q10y + each pregnancy."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 2: Chronic Disease Management Protocols
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa570001-0000-0000-0000-000000000002', 'f2f9a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a18', 'Chronic Disease Management Protocols', 2)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa570002-0000-0000-0000-000000000002', 'fa570001-0000-0000-0000-000000000002', 'ACC/AHA Hypertension Staging & Demographic Pharmacotherapy Selection', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa570003-0000-0000-0000-000000000002', 'fa570002-0000-0000-0000-000000000002', 'ADA 2024 Diabetes Targets: SGLT2i Cardiorenal & GLP-1 RA ASCVD Benefits', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa570004-0000-0000-0000-000000000002', 'fa570003-0000-0000-0000-000000000002', 'Primary ASCVD Statin Risk Stratification & Diabetic Microalbuminuria Protection', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa570005-0000-0000-0000-000000000002', 'fa570004-0000-0000-0000-000000000002', 'Arteriolar Vasodilatations, Efferent Glomerular Decompressions, Incretin Mimetic Augmentations, and Atherosclerotic Reductions', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa570006-0000-0000-0000-000000000002', 'fa570005-0000-0000-0000-000000000002', 'EXPLANATION', 1, 
'{"text": "### Chronic Disease Management Protocols\n\nHypertension: Stage 2 (>=140/90) starts 2 drugs. In Black patients without CKD, start CCB or Thiazide. In CKD with proteinuria (ACR >=30 mg/g), start ACEI or ARB (efferent arteriolar vasodilation). Diabetes: Target HbA1c <7.0%. Metformin first-line + SGLT2 inhibitor (Empagliflozin) for CKD/HF; GLP-1 RA (Semaglutide) for high ASCVD/obesity. Statins: High-intensity (Atorvastatin 40-80 mg) for 10y ASCVD >=20%."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 3: Comprehensive Geriatric Assessment & Beers Criteria Polypharmacy
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa570001-0000-0000-0000-000000000003', 'f2f9a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a18', 'Comprehensive Geriatric Assessment & Beers Criteria Polypharmacy', 3)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa570002-0000-0000-0000-000000000003', 'fa570001-0000-0000-0000-000000000003', 'Functional Status: Basic ADLs (DEATH) vs Instrumental IADLs (SHAFT)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa570003-0000-0000-0000-000000000003', 'fa570002-0000-0000-0000-000000000003', 'Cognitive Screening (Mini-Cog) & Fall Risk Assessment (Timed Up and Go TUG >12s)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa570004-0000-0000-0000-000000000003', 'fa570003-0000-0000-0000-000000000003', 'AGS Beers Criteria 2023: Anticholinergic, Sedative & Sulfonylurea Deprescribing', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa570005-0000-0000-0000-000000000003', 'fa570004-0000-0000-0000-000000000003', 'Executive Instrumental Degenerations, Visuospatial Clock Evaluations, Dynamic Gait Saccades, and Anticholinergic Deprescribings', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa570006-0000-0000-0000-000000000003', 'fa570005-0000-0000-0000-000000000003', 'EXPLANATION', 1, 
'{"text": "### Geriatric Assessment & Beers Polypharmacy\n\nFunctional Assessment: IADLs (finances, medications) lost first in cognitive decline; basic ADLs (eating, bathing) lost later. Mini-Cog: 3-word recall + clock drawing test (11:10). Fall Risk: Timed Up and Go (TUG) >12 seconds indicates high fall risk. Beers Criteria 2023: Avoid Diphenhydramine (delirium, urinary retention), Zolpidem/benzos (ataxia, fractures), and Glyburide (prolonged hypoglycemia)."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 4: Outpatient Triage, Red Flags & Referral Workflows
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa570001-0000-0000-0000-000000000004', 'f2f9a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a18', 'Outpatient Triage, Red Flags & Referral Workflows', 4)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa570002-0000-0000-0000-000000000004', 'fa570001-0000-0000-0000-000000000004', 'Spinal & Neurological Red Flags: Cauda Equina Syndrome & Thunderclap Headache', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa570003-0000-0000-0000-000000000004', 'fa570002-0000-0000-0000-000000000004', 'Vascular & Oncologic Red Flags: Temporal Arteritis & ALARMS Dyspepsia', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa570004-0000-0000-0000-000000000004', 'fa570003-0000-0000-0000-000000000004', 'Primary Care to Specialty Consultation Architecture & Closed-Loop Tracking', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa570005-0000-0000-0000-000000000004', 'fa570004-0000-0000-0000-000000000004', 'Cauda Equina Decompressions, Aneurysmal Subarachnoid Paracenteses, Cranial Vasculitic Resuscitation, and Consult Loop Closures', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa570006-0000-0000-0000-000000000004', 'fa570005-0000-0000-0000-000000000004', 'EXPLANATION', 1, 
'{"text": "### Outpatient Triage & Emergency Red Flags\n\nCauda Equina Syndrome: Saddle anesthesia (S2-S4), bowel/bladder incontinence, bilateral foot drop -> STAT MRI lumbar spine and emergency decompression. Thunderclap Headache: SAH -> stat non-contrast Head CT -> LP if negative. Temporal Arteritis: Jaw claudication, vision loss -> stat high-dose steroids. Dyspepsia ALARMS criteria: Anemia, weight loss, dysphagia, age >55, melena -> urgent EGD. Closed-loop specialty referrals."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;
