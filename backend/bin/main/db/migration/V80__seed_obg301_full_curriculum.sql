-- V80: Seed Advanced Obstetrics, High-Risk Perinatology & Gynecologic Oncology (OBG-301) Full Curriculum

-- Ensure Subject: OBG-301 exists with correct title and category
INSERT INTO subjects (id, semester_id, code, title, category)
VALUES ('f1d0a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a38', 'c7d8e9f0-b1c2-3d4e-5f6a-7b8c9d0e1f2a', 'OBG-301', 'Advanced Obstetrics, High-Risk Perinatology & Gynecologic Oncology', 'CLINICAL')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, category = EXCLUDED.category;

-- Unit 1: Hypertensive Disorders of Pregnancy & Eclampsia Protocols
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa430001-0000-0000-0000-000000000001', 'f1d0a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a38', 'Hypertensive Disorders of Pregnancy & Eclampsia Protocols', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa430002-0000-0000-0000-000000000001', 'fa430001-0000-0000-0000-000000000001', 'Preeclampsia with Severe Features & Magnesium Sulfate Protocols', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa430003-0000-0000-0000-000000000001', 'fa430002-0000-0000-0000-000000000001', 'HELLP Syndrome Microangiopathic Hemolytic Anemia & Transaminitis', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa430004-0000-0000-0000-000000000001', 'fa430003-0000-0000-0000-000000000001', 'Eclamptic Seizures, Calcium Gluconate Antidote & Antihypertensives', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa430005-0000-0000-0000-000000000001', 'fa430004-0000-0000-0000-000000000001', 'Trophoblastic Spiral Arteriolar Remodel Dysfunctions, Endothelial Nitric Oxide Depletions, Magnesium NMDA Receptor Blockades, and Calcium Gluconate Reversals', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa430006-0000-0000-0000-000000000001', 'fa430005-0000-0000-0000-000000000001', 'EXPLANATION', 1, 
'{"text": "### Hypertensive Disorders of Pregnancy\n\nPreeclampsia with Severe Features: BP >=160/110, Platelets <100k, AST/ALT >2x, Creatinine >1.1, pulmonary edema, or visual symptoms -> delivery at >=34 weeks + immediate IV Magnesium Sulfate. HELLP Syndrome: Hemolysis (schistocytes, LDH >600, bilirubin >1.2), Elevated Liver enzymes, Low Platelets -> prompt delivery regardless of GA. Magnesium Sulfate: 4-6 g loading over 20 min + 1-2 g/h infusion; monitor DTRs, RR >=12, UO >=30 mL/h; Calcium Gluconate (1 g IV) is the antidote. Acute severe BP: IV Labetalol, IV Hydralazine, Oral Nifedipine."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 2: Postpartum Hemorrhage & Uterotonic Escalation Protocols
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa430001-0000-0000-0000-000000000002', 'f1d0a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a38', 'Postpartum Hemorrhage & Uterotonic Escalation Protocols', 2)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa430002-0000-0000-0000-000000000002', 'fa430001-0000-0000-0000-000000000002', 'The 4 Ts of PPH (Tone 70%, Trauma 20%, Tissue 10%, Thrombin 1%)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa430003-0000-0000-0000-000000000002', 'fa430002-0000-0000-0000-000000000002', 'Uterotonic Escalation: Oxytocin, Methergine, Carboprost & Misoprostol', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa430004-0000-0000-0000-000000000002', 'fa430003-0000-0000-0000-000000000002', 'Bakri Tamponade Balloon, B-Lynch Sutures & Massive Transfusion Protocols', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa430005-0000-0000-0000-000000000002', 'fa430004-0000-0000-0000-000000000002', 'Myometrial Interlacing Atony Arrests, Prostanoid FP-Receptor Bronchospasms, Ergot Vasoconstrictive Crises, and Hydrostatic Balloon Tamponades', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa430006-0000-0000-0000-000000000002', 'fa430005-0000-0000-0000-000000000002', 'EXPLANATION', 1, 
'{"text": "### Postpartum Hemorrhage (PPH)\n\n4 Ts: Tone (70% atony - boggy uterus), Trauma (20% lacerations/rupture), Tissue (10% retained placenta/accreta), Thrombin (1% coagulopathy). Pharmacotherapy: 1. Oxytocin (first-line). 2. Methylergonovine (Methergine 0.2 mg IM; STRICTLY CONTRAINDICATED in hypertension/preeclampsia). 3. Carboprost (Hemabate 250 mcg IM; STRICTLY CONTRAINDICATED in asthma). 4. Misoprostol (800-1000 mcg sublingual/rectal). 5. Tranexamic Acid (TXA 1 g IV within 3h). Bakri balloon (300-500 mL saline) and B-Lynch sutures for refractory atony."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 3: Electronic Fetal Monitoring & Intrapartum FHR Triage
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa430001-0000-0000-0000-000000000003', 'f1d0a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a38', 'Electronic Fetal Monitoring & Intrapartum FHR Triage', 3)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa430002-0000-0000-0000-000000000003', 'fa430001-0000-0000-0000-000000000003', 'NICHD 3-Tier Fetal Heart Rate Categories (I, II, III)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa430003-0000-0000-0000-000000000003', 'fa430002-0000-0000-0000-000000000003', 'Deceleration Pathophysiology: VEAL CHOP Mechanics', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa430004-0000-0000-0000-000000000003', 'fa430003-0000-0000-0000-000000000003', 'Sinusoidal FHR Undulation in Severe Fetal Anemia & Emergency Cesarean', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa430005-0000-0000-0000-000000000003', 'fa430004-0000-0000-0000-000000000003', 'Fetal Autonomic Baroreceptor Discharges, Intervillous Space Hypoxemic Acidemias, Sinusoidal Erythrocytic Deficiencies, and Emergent Operative Deliveries', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa430006-0000-0000-0000-000000000003', 'fa430005-0000-0000-0000-000000000003', 'EXPLANATION', 1, 
'{"text": "### Electronic Fetal Monitoring (EFM)\n\nNICHD Categories: Category I (Normal: baseline 110-160, moderate variability 6-25, no late/variable decels). Category II (Indeterminate). Category III (Abnormal: absent variability + late/variable decels, or sinusoidal pattern -> immediate emergency Cesarean). VEAL CHOP: Variable = Cord compression (reposition mother); Early = Head compression (benign); Acceleration = Oxygenated; Late = Placental insufficiency (stop oxytocin, IV fluids, oxygen)."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 4: Gynecologic Oncology & Pelvic Malignancies
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa430001-0000-0000-0000-000000000004', 'f1d0a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a38', 'Gynecologic Oncology & Pelvic Malignancies', 4)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa430002-0000-0000-0000-000000000004', 'fa430001-0000-0000-0000-000000000004', 'Cervical Cancer HPV 16/18 Oncoproteins E6/E7 & Cisplatin Chemoradiation', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa430003-0000-0000-0000-000000000004', 'fa430002-0000-0000-0000-000000000004', 'Endometrial Carcinoma Lynch Syndrome, PTEN & Postmenopausal Bleeding', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa430004-0000-0000-0000-000000000004', 'fa430003-0000-0000-0000-000000000004', 'High-Grade Serous Ovarian Cancer BRCA Mutations, CA-125 & PARP Inhibitors', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa430005-0000-0000-0000-000000000004', 'fa430004-0000-0000-0000-000000000004', 'Papillomavirus Retinoblastoma Degradations, Mismatch Repair Micosatellite Instabilities, Fallopian Fimbrial Tubal Carcinogeneses, and Synthetic Lethality Poly-ADP Blockades', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa430006-0000-0000-0000-000000000004', 'fa430005-0000-0000-0000-000000000004', 'EXPLANATION', 1, 
'{"text": "### Gynecologic Oncology\n\nCervical Cancer: HPV 16/18 E6 (p53 inactivation) and E7 (pRb inactivation); locally advanced disease receives weekly Cisplatin + radiation. Endometrial Cancer: Postmenopausal bleeding with stripe >4 mm requires Pipelle biopsy; associated with Lynch syndrome and unopposed estrogen; treated with TAH-BSO. Ovarian Cancer: High-grade serous originates in fallopian tube fimbriae (BRCA1/2 mutations, CA-125); maximal cytoreductive surgery (<1 cm) + Carboplatin/Paclitaxel + Olaparib PARP inhibitors."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;
