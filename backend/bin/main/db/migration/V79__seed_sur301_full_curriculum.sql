-- V79: Seed Advanced General, Laparoscopic & Surgical Oncology (SUR-301) Full Curriculum

-- Ensure Subject: SUR-301 exists with correct title and category
INSERT INTO subjects (id, semester_id, code, title, category)
VALUES ('f1d0a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a37', 'c7d8e9f0-b1c2-3d4e-5f6a-7b8c9d0e1f2a', 'SUR-301', 'Advanced General, Laparoscopic & Surgical Oncology', 'CLINICAL')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, category = EXCLUDED.category;

-- Unit 1: Acute Abdomen, Bowel Obstruction & Peritonitis Traumatology
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa420001-0000-0000-0000-000000000001', 'f1d0a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a37', 'Acute Abdomen, Bowel Obstruction & Peritonitis Traumatology', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa420002-0000-0000-0000-000000000001', 'fa420001-0000-0000-0000-000000000001', 'Adhesive SBO & Closed-Loop Strangulation Ischemia Laparotomy', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa420003-0000-0000-0000-000000000001', 'fa420002-0000-0000-0000-000000000001', 'Sigmoid and Cecal Volvulus Derotation & Resection Protocols', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa420004-0000-0000-0000-000000000001', 'fa420003-0000-0000-0000-000000000001', 'Ogilvie Acute Colonic Pseudo-Obstruction Neostigmine Decompressions', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa420005-0000-0000-0000-000000000001', 'fa420004-0000-0000-0000-000000000001', 'Intraluminal Hydraulic Hydrostatic Pressures, Transmural Mesenteric Strangulations, Parasympathetic Cholinergic Agonisms, and Emergency Exploratory Laparotomies', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa420006-0000-0000-0000-000000000001', 'fa420005-0000-0000-0000-000000000001', 'EXPLANATION', 1, 
'{"text": "### Acute Abdomen & Bowel Obstruction\n\nAdhesive SBO (>60% of cases): dilated loops >3 cm, transition point on CT, treated conservatively unless strangulation occurs. Closed-Loop Strangulation: persistent tachycardia, fever, localized peritonitis, WBC >15,000, and lactate >2.5 -> mandatory emergency laparotomy and resection. Sigmoid Volvulus: coffee bean sign -> sigmoidoscopic derotation followed by elective resection. Ogilvie Syndrome: cecal dilation >10-12 cm without mechanical block -> IV Neostigmine (2 mg over 3-5 min) or colonoscopy."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 2: Laparoscopic & Biliary Surgery: The Critical View of Safety
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa420001-0000-0000-0000-000000000002', 'f1d0a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a37', 'Laparoscopic & Biliary Surgery: The Critical View of Safety', 2)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa420002-0000-0000-0000-000000000002', 'fa420001-0000-0000-0000-000000000002', 'The 3 Mandatory Criteria of Strasberg Critical View of Safety (CVS)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa420003-0000-0000-0000-000000000002', 'fa420002-0000-0000-0000-000000000002', 'Hepatocystic Calot Triangle Clearance & Safe Dissection Planes', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa420004-0000-0000-0000-000000000002', 'fa420003-0000-0000-0000-000000000002', 'Strasberg BDI Classification (Type E) & Roux-en-Y Hepaticojejunostomy', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa420005-0000-0000-0000-000000000002', 'fa420004-0000-0000-0000-000000000002', 'Hepatocystic Adipose Clearances, Cystic Plate Dissections, Iatrogenic Ductal Misidentification Preventions, and Bilioenteric Roux-en-Y Reconstructions', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa420006-0000-0000-0000-000000000002', 'fa420005-0000-0000-0000-000000000002', 'EXPLANATION', 1, 
'{"text": "### Laparoscopic Cholecystectomy & Critical View of Safety (CVS)\n\nCVS Criteria: 1. Hepatocystic (Calot) triangle completely cleared of fat/fibrous tissue. 2. Lower third of gallbladder detached from cystic plate of liver bed. 3. Two and only two structures (cystic duct and cystic artery) seen entering gallbladder. NEVER clip until CVS is 100% achieved. Strasberg Type E BDI (major common bile duct transection): presents with progressive obstructive jaundice, repaired via Roux-en-Y Hepaticojejunostomy."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 3: Upper & Lower GI Hemorrhage & Peptic Ulcer Perforation
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa420001-0000-0000-0000-000000000003', 'f1d0a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a37', 'Upper & Lower GI Hemorrhage & Peptic Ulcer Perforation', 3)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa420002-0000-0000-0000-000000000003', 'fa420001-0000-0000-0000-000000000003', 'Forrest Classification of Peptic Bleeding & Dual Endotherapy', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa420003-0000-0000-0000-000000000003', 'fa420002-0000-0000-0000-000000000003', 'High-Dose Intravenous PPI Infusions & Rebleeding Stratification', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa420004-0000-0000-0000-000000000003', 'fa420003-0000-0000-0000-000000000003', 'Peptic Perforation Pneumoperitoneum & Graham Patch Omentopexy', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa420005-0000-0000-0000-000000000003', 'fa420004-0000-0000-0000-000000000003', 'Endoscopic Micro-Vascular Hemostases, Acid-Peptic Barrier Disruptions, Subdiaphragmatic Visceral Pneumoperitoneums, and Pedicled Omental Patch Omentopexies', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa420006-0000-0000-0000-000000000003', 'fa420005-0000-0000-0000-000000000003', 'EXPLANATION', 1, 
'{"text": "### Peptic Bleeding & Perforation\n\nForrest Classification: Class Ia (Spurting, >90% rebleeding) & Ib (Oozing, ~50%) -> Dual endoscopic therapy (epinephrine + hemoclips/thermal) + high-dose IV PPI (80 mg + 8 mg/h). Class IIa (Visible vessel, ~50%) -> Endoscopic therapy. Class IIc (Spot) & III (Clean) -> Oral PPI. Peptic Perforation: sudden severe epigastric pain, board-like rigidity, subdiaphragmatic free air on CXR -> emergent exploratory laparotomy with Graham patch omentopexy."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 4: Surgical Oncology & Lymphatic Staging Protocols
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa420001-0000-0000-0000-000000000004', 'f1d0a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a37', 'Surgical Oncology & Lymphatic Staging Protocols', 4)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa420002-0000-0000-0000-000000000004', 'fa420001-0000-0000-0000-000000000004', 'Breast Sentinel Lymph Node Biopsy (SLNB Dual Tracer Mapping)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa420003-0000-0000-0000-000000000004', 'fa420002-0000-0000-0000-000000000004', 'Total Mesorectal Excision (TME) & Colon Cancer >=12 Nodes Harvest', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa420004-0000-0000-0000-000000000004', 'fa420003-0000-0000-0000-000000000004', 'Cutaneous Melanoma Breslow Depth-Directed Wide Local Excision Margins', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa420005-0000-0000-0000-000000000004', 'fa420004-0000-0000-0000-000000000004', 'Radiocolloid Gamma Lymphoscintigraphies, Mesorectal Embryologic Avascular Planes, Minimum Regional Lymphadenectomies, and Breslow Depth Margin Resections', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa420006-0000-0000-0000-000000000004', 'fa420005-0000-0000-0000-000000000004', 'EXPLANATION', 1, 
'{"text": "### Surgical Oncology & Margins\n\nBreast Cancer: SLNB dual mapping (Tc-99m + isosulfan blue); margins require no ink on tumor for invasive cancer. Rectal Cancer: Total Mesorectal Excision (TME) in Heald holy plane with CRM >1 mm reduces local recurrence to <5%; minimum >=12 lymph nodes harvest. Melanoma Margins: in situ = 0.5 cm, <1 mm = 1.0 cm, 1.01-2 mm = 1-2 cm, >2 mm = 2.0 cm + SLNB."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;
