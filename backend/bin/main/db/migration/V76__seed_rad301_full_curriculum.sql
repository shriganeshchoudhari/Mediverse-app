-- V76: Seed Clinical Diagnostic Radiology & Interventional Protocols (RAD-301) Full Curriculum

-- Ensure Subject: RAD-301 exists with correct title and category
INSERT INTO subjects (id, semester_id, code, title, category)
VALUES ('f1d0a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a34', 'c7d8e9f0-b1c2-3d4e-5f6a-7b8c9d0e1f2a', 'RAD-301', 'Clinical Diagnostic Radiology & Interventional Protocols', 'CLINICAL')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, category = EXCLUDED.category;

-- Unit 1: Contrast Media Dynamics, Nephrotoxicity & Safety Protocols
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa380001-0000-0000-0000-000000000001', 'f1d0a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a34', 'Contrast Media Dynamics, Nephrotoxicity & Safety Protocols', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa380002-0000-0000-0000-000000000001', 'fa380001-0000-0000-0000-000000000001', 'Iodinated CIN/PC-AKI Medullary Ischemia & Isotonic Saline Hydration', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa380003-0000-0000-0000-000000000001', 'fa380002-0000-0000-0000-000000000001', 'Metformin Lactic Acidosis (MALA) 48-Hour Renal Clearance Hold Rules', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa380004-0000-0000-0000-000000000001', 'fa380003-0000-0000-0000-000000000001', 'Gadolinium Group II Macrocyclic Thermodynamic Stability & NSF Prevention', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa380005-0000-0000-0000-000000000001', 'fa380004-0000-0000-0000-000000000001', 'Renal Medullary Endothelin Vasoconstrictions, Biguanide Tubular Accumulations, Free Gadolinium Toxic Transmetalations, and Non-IgE Anaphylactoid Mast Cell Premedications', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa380006-0000-0000-0000-000000000001', 'fa380005-0000-0000-0000-000000000001', 'EXPLANATION', 1, 
'{"text": "### Contrast Media Safety & Nephroprotection\n\nIodinated CIN: Medullary vasoconstriction + tubular cytotoxicity (eGFR <30-45 mL/min). Prevention: Isotonic IV hydration (Normal Saline 1 mL/kg/h 6-12h pre/post-scan). Metformin: 100% renally cleared; hold at scan in eGFR <60 and withhold for 48h to prevent fatal Metformin-Associated Lactic Acidosis (MALA). GBCAs & NSF: Free Gd3+ dissociation from linear chelates (Group I Omniscan) stimulates CD34+ fibrocytes causing irreversible fibrosis in ESRD (eGFR <30); Group II macrocyclic agents (Gadobutrol, Gadoterate) have tight cyclic cages and negligible NSF risk."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 2: High-Resolution Chest CT Patterns & Pulmonary Differential Diagnosis
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa380001-0000-0000-0000-000000000002', 'f1d0a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a34', 'High-Resolution Chest CT Patterns & Pulmonary Differential Diagnosis', 2)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa380002-0000-0000-0000-000000000002', 'fa380001-0000-0000-0000-000000000002', 'Definite UIP Pattern (Basal Subpleural Honeycombing & IPF)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa380003-0000-0000-0000-000000000002', 'fa380002-0000-0000-0000-000000000002', 'NSIP Ground-Glass Opacities & Pathognomonic Subpleural Sparing', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa380004-0000-0000-0000-000000000002', 'fa380003-0000-0000-0000-000000000002', 'Angioinvasive Aspergillosis CT Halo Sign & COP Reverse Halo Atoll Sign', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa380005-0000-0000-0000-000000000002', 'fa380004-0000-0000-0000-000000000002', 'Secondary Pulmonary Lobular Morphologies, Subpleural Fibrocystic Remodelings, Angioinvasive Coagulative Necroses, and Intra-Alveolar Masson Body Consolidations', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa380006-0000-0000-0000-000000000002', 'fa380005-0000-0000-0000-000000000002', 'EXPLANATION', 1, 
'{"text": "### HRCT Chest Patterns\n\nUIP (IPF): Strict subpleural and basal honeycombing (multi-layered thick-walled cysts) + traction bronchiectasis without extensive GGO (poor prognosis, 3-5yr survival). NSIP: Ground-glass opacities + fine reticulations with pathognomonic SUBPLEURAL SPARING (spares immediate 2-5mm rim; responsive to steroids; Scleroderma). CT Halo Sign: Nodule with GGO perimeter -> Angioinvasive Aspergillosis (infarct + alveolar hemorrhage in neutropenia; Voriconazole). Reverse Halo (Atoll): Central GGO + dense outer crescent -> Cryptogenic Organizing Pneumonia (COP) and Mucormycosis."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 3: Acute Abdomen Emergency CT Diagnostics & Hinchey Staging
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa380001-0000-0000-0000-000000000003', 'f1d0a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a34', 'Acute Abdomen Emergency CT Diagnostics & Hinchey Staging', 3)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa380002-0000-0000-0000-000000000003', 'fa380001-0000-0000-0000-000000000003', 'Pneumoperitoneum & Rigler Sign Double Bowel Wall Perforation Signs', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa380003-0000-0000-0000-000000000003', 'fa380002-0000-0000-0000-000000000003', 'Mesenteric Ischemia Triad (Pale Bowel, Pneumatosis & Portovenous Gas)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa380004-0000-0000-0000-000000000003', 'fa380003-0000-0000-0000-000000000003', 'Appendicitis MDCT Signs & Diverticulitis Hinchey I-IV Surgical Triage', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa380005-0000-0000-0000-000000000003', 'fa380004-0000-0000-0000-000000000003', 'Extraluminal Peritoneal Gas Visualizations, Transmural Mesenteric Infarction Necroses, Appendiceal Luminal Distensions, and Diverticular Abscess Catheter Drainage Protocols', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa380006-0000-0000-0000-000000000003', 'fa380005-0000-0000-0000-000000000003', 'EXPLANATION', 1, 
'{"text": "### Acute Abdomen Emergency CT\n\nPneumoperitoneum: Extraluminal free air; Rigler sign (air on both mucosal and serosal surfaces of bowel wall). Mesenteric Ischemia: Hypoenhancing pale bowel, Pneumatosis Intestinalis (intramural gas), and branching Porto-Venous Gas (ominous transmural necrosis -> emergency laparotomy). Appendicitis: Outer diameter >6mm + appendicolith + periappendiceal fat stranding. Diverticulitis Hinchey Staging: Hinchey I (pericolic phlegmon -> antibiotics), Hinchey II (pelvic abscess >4cm -> CT-guided percutaneous drainage), Hinchey III (purulent peritonitis -> surgery), Hinchey IV (feculent peritonitis -> emergency Hartmann procedure)."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 4: Emergency Interventional Radiology & Endovascular Procedures
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa380001-0000-0000-0000-000000000004', 'f1d0a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a34', 'Emergency Interventional Radiology & Endovascular Procedures', 4)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa380002-0000-0000-0000-000000000004', 'fa380001-0000-0000-0000-000000000004', 'Transcatheter Arterial Embolization (TAE) in Pelvic Fractures & GI Bleeding', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa380003-0000-0000-0000-000000000004', 'fa380002-0000-0000-0000-000000000004', 'TIPS Stenting Portal Decompression & Post-Shunt Encephalopathy', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa380004-0000-0000-0000-000000000004', 'fa380003-0000-0000-0000-000000000004', 'Infrarenal IVC Filter Placement Indications & Mandatory Retrieval Mandates', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa380005-0000-0000-0000-000000000004', 'fa380004-0000-0000-0000-000000000004', 'Internal Iliac Microcoil Hemostases, Portosystemic Pressure Gradient Stent Reductions, Ammonia Astrocyte Neurotoxicities, and Caval Thromboprophylactic Basket Retrievals', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa380006-0000-0000-0000-000000000004', 'fa380005-0000-0000-0000-000000000004', 'EXPLANATION', 1, 
'{"text": "### Emergency Interventional Radiology\n\nPelvic Trauma TAE: Embolization of internal iliac artery branches (superior gluteal, internal pudendal) with microcoils / Gelfoam for active arterial blush. TIPS: Transjugular covered ePTFE stent connecting hepatic vein to portal vein to decompress portal hypertension (refractory variceal bleeding, ascites); common complication: Hepatic Encephalopathy (30-50% due to bypassed hepatic detoxification; treated with Lactulose). IVC Filters: Deployed strictly INFRARENAL for acute DVT/PE with absolute contraindication to anticoagulation; must be retrieved promptly once anticoagulation is safe to prevent filter thrombosis/fracture."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;
