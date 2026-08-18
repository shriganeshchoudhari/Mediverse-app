-- V53: Seed Clinical Oncology & Radiotherapy (ONCO-401) Full Curriculum

-- Ensure Subject: ONCO-401 exists with correct title and category
INSERT INTO subjects (id, semester_id, code, title, category)
VALUES ('f1f8a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a11', 'c9d0e1f2-b3c4-5d6e-7f8a-9b0c1d2e3f4b', 'ONCO-401', 'Clinical Oncology & Radiotherapy', 'CLINICAL')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, category = EXCLUDED.category;

-- Unit 1: Cancer Biology, Genomic Drivers & AJCC TNM 8th Edition Staging
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa150001-0000-0000-0000-000000000001', 'f1f8a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a11', 'Cancer Biology, Genomic Drivers & AJCC TNM 8th Edition Staging', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa150002-0000-0000-0000-000000000001', 'fa150001-0000-0000-0000-000000000001', 'Hallmarks of Cancer & Genomic Driver Alterations', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa150003-0000-0000-0000-000000000001', 'fa150002-0000-0000-0000-000000000001', 'Targeted Precision Inhibitors (Osimertinib, Sotorasib, Olaparib)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa150004-0000-0000-0000-000000000001', 'fa150003-0000-0000-0000-000000000001', 'AJCC TNM 8th Edition Staging (cTNM, pTNM, yTNM Prefixes)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa150005-0000-0000-0000-000000000001', 'fa150004-0000-0000-0000-000000000001', 'Hallmarks of Cancer, Precision Driver Mutations, Synthetic Lethality and AJCC TNM 8th Edition Staging', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa150006-0000-0000-0000-000000000001', 'fa150005-0000-0000-0000-000000000001', 'EXPLANATION', 1, 
'{"text": "### Cancer Biology & TNM Staging\n\nHanahan & Weinberg hallmarks include sustained proliferation, evading apoptosis, limitless replication, and immune evasion. Targeted driver inhibitors: EGFR Osimertinib (overcomes T790M), ALK Alectinib, KRAS G12C Sotorasib, BRAF Dabrafenib+Trametinib, and BRCA PARP inhibitors (synthetic lethality). AJCC TNM 8th edition: cTNM (clinical), pTNM (pathological), yTNM (post-neoadjuvant downstaging). Stage IV represents distant metastatic M1 disease."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 2: Cytotoxic Chemotherapy, Antidotes & Checkpoint Inhibitors
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa150001-0000-0000-0000-000000000002', 'f1f8a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a11', 'Cytotoxic Chemotherapy, Antidotes & Checkpoint Inhibitors', 2)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa150002-0000-0000-0000-000000000002', 'fa150001-0000-0000-0000-000000000002', 'Antineoplastic Drug Classes & Cell-Cycle Specificity', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa150003-0000-0000-0000-000000000002', 'fa150002-0000-0000-0000-000000000002', 'Dose-Limiting Toxicities & Protective Antidotes (Mesna, Dexrazoxane)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa150004-0000-0000-0000-000000000002', 'fa150003-0000-0000-0000-000000000002', 'Immune Checkpoint Blockade (PD-1, CTLA-4) & irAE Management', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa150005-0000-0000-0000-000000000002', 'fa150004-0000-0000-0000-000000000002', 'Chemotherapy Cell-Cycle Specificity, Acrolein/Anthracycline Antidotes, and Immune Checkpoint Toxicity Escalation', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa150006-0000-0000-0000-000000000002', 'fa150005-0000-0000-0000-000000000002', 'EXPLANATION', 1, 
'{"text": "### Chemotherapy & Checkpoint Immunotherapy\n\nSignature organ toxicities & antidotes: Cyclophosphamide acrolein hemorrhagic cystitis -> Mesna; Doxorubicin free-radical cardiomyopathy -> Dexrazoxane; Cisplatin nephro/ototoxicity -> Vigorous IV hydration + Amifostine; Methotrexate -> Leucovorin folinic acid rescue. Immune checkpoint inhibitors (Anti-PD-1 Pembrolizumab, Anti-CTLA-4 Ipilimumab) release T-cell coinhibitory brakes. Grade 3-4 immune-related adverse events (irAEs) mandate permanent drug discontinuation and high-dose IV Methylprednisolone (1-2 mg/kg/day)."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 3: Radiation Biology: The 4 Rs, Linear-Quadratic Model & SBRT
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa150001-0000-0000-0000-000000000003', 'f1f8a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a11', 'Radiation Biology: The 4 Rs, Linear-Quadratic Model & SBRT', 3)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa150002-0000-0000-0000-000000000003', 'fa150001-0000-0000-0000-000000000003', 'The Classical 4 Rs of Radiobiology (Withers)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa150003-0000-0000-0000-000000000003', 'fa150002-0000-0000-0000-000000000003', 'Linear-Quadratic Model & Alpha/Beta Ratio Sensitivity', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa150004-0000-0000-0000-000000000003', 'fa150003-0000-0000-0000-000000000003', 'Precision Modalities: IMRT, VMAT, SBRT & HDR Brachytherapy', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa150005-0000-0000-0000-000000000003', 'fa150004-0000-0000-0000-000000000003', 'The 4 Rs of Radiobiology, Oxygen Enhancement Ratio, Linear-Quadratic Model, and SBRT/Brachytherapy Delivery', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa150006-0000-0000-0000-000000000003', 'fa150005-0000-0000-0000-000000000003', 'EXPLANATION', 1, 
'{"text": "### Radiation Biology & Precision Radiotherapy\n\nThe 4 Rs of Radiobiology: 1. Repair of sublethal damage (requires >=6 hours between fractions); 2. Reassortment into radiosensitive G2/M phases; 3. Reoxygenation of hypoxic core (Oxygen Enhancement Ratio ~2.5-3.0); 4. Accelerated Clonogen Repopulation (begins ~28 days into treatment; treatment breaks strictly avoided). Linear-quadratic model: early-responding tumors have high alpha/beta (~10 Gy) while late normal tissues have low alpha/beta (~2-3 Gy). Precision delivery utilizes IMRT, SBRT (1-5 ablative fractions), and HDR Brachytherapy (Ir-192)."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 4: Oncologic Emergencies: SVC, MSCC, TLS & WHO Pain Ladder
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa150001-0000-0000-0000-000000000004', 'f1f8a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a11', 'Oncologic Emergencies: SVC, MSCC, TLS & WHO Pain Ladder', 4)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa150002-0000-0000-0000-000000000004', 'fa150001-0000-0000-0000-000000000004', 'Superior Vena Cava Syndrome & Endovascular Stenting', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa150003-0000-0000-0000-000000000004', 'fa150002-0000-0000-0000-000000000004', 'Malignant Spinal Cord Compression (Dexamethasone & MRI)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa150004-0000-0000-0000-000000000004', 'fa150003-0000-0000-0000-000000000004', 'Tumor Lysis Syndrome (Cairo-Bishop, Rasburicase) & WHO Pain Ladder', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa150005-0000-0000-0000-000000000004', 'fa150004-0000-0000-0000-000000000004', 'Oncologic Emergencies (SVC, MSCC, TLS, Hypercalcemia) and Palliative WHO 3-Step Pain Management', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa150006-0000-0000-0000-000000000004', 'fa150005-0000-0000-0000-000000000004', 'EXPLANATION', 1, 
'{"text": "### Oncologic Emergencies & Palliative Care\n\nSVC Syndrome: Facial edema, neck vein distension, Pemberton sign -> Stenting or RT. Malignant Spinal Cord Compression: Back pain, motor weakness, saddle anesthesia -> Immediate IV Dexamethasone 16 mg + Urgent whole-spine MRI + Surgical decompression/RT within 24 hours. Tumor Lysis Syndrome: Cairo-Bishop criteria (high K, high PO4, high Uric Acid, low Ca) -> Aggressive IV hydration (3 L/m2/day) + Rasburicase (recombinant urate oxidase). Hypercalcemia: IV Saline + Zoledronic acid. WHO 3-Step Pain ladder: Step 1 (Non-opioids) -> Step 2 (Weak opioids) -> Step 3 (Strong opioids Morphine + bowel stimulants)."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;
