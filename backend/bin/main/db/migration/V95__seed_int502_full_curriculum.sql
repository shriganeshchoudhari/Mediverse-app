-- V95: Seed Internship Core Clinical Postings: Procedural Skills & Point-of-Care Ultrasound (INT-502) Full Curriculum

-- Ensure Subject: INT-502 exists with correct title and category
INSERT INTO subjects (id, semester_id, code, title, category)
VALUES ('f4f9a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a20', 'c9d0e1f2-b3c4-5d6e-7f8a-9b0c1d2e3f4c', 'INT-502', 'Internship Core Clinical Postings: Procedural Skills & Point-of-Care Ultrasound', 'CLINICAL')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, category = EXCLUDED.category;

-- Unit 1: Vascular Access & Arterial Cannulation
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa590001-0000-0000-0000-000000000001', 'f4f9a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a20', 'Vascular Access & Arterial Cannulation', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa590002-0000-0000-0000-000000000001', 'fa590001-0000-0000-0000-000000000001', 'Internal Jugular CVC (SCM Triangle & Venous Compressibility)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa590003-0000-0000-0000-000000000001', 'fa590002-0000-0000-0000-000000000001', 'Subclavian & NAVEL Femoral Triangle Central Venous Approaches', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa590004-0000-0000-0000-000000000001', 'fa590003-0000-0000-0000-000000000001', 'Ultrasound Radial Arterial Line Cannulation & Modified Allen Test', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa590005-0000-0000-0000-000000000001', 'fa590004-0000-0000-0000-000000000001', 'Sternocleidomastoid Apex Vectorings, Guidewire Dilation Disciplines, and Radial Piezoelectric Transductions', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa590006-0000-0000-0000-000000000001', 'fa590005-0000-0000-0000-000000000001', 'EXPLANATION', 1, 
'{"text": "### Vascular Access & Arterial Cannulation\n\nCentral Venous Lines: IJV is thin-walled and compressible under gentle probe pressure, lateral to the carotid artery. Subclavian approach has ~1-5% pneumothorax risk. Femoral vein lies medial to artery (NAVEL). NEVER lose control of the guidewire during Seldinger cannulation. Radial Arterial Line: Verify ulnar collateral flow via Modified Allen test; use high-frequency linear probe for beat-to-beat pressure monitoring."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 2: Diagnostic Paracentesis & Thoracentesis Fluid Analysis
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa590001-0000-0000-0000-000000000002', 'f4f9a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a20', 'Diagnostic Paracentesis & Thoracentesis Fluid Analysis', 2)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa590002-0000-0000-0000-000000000002', 'fa590001-0000-0000-0000-000000000002', 'Serum-Ascites Albumin Gradient (SAAG) Math & SBP (PMN >=250/uL)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa590003-0000-0000-0000-000000000002', 'fa590002-0000-0000-0000-000000000002', 'Thoracentesis Superior Rib Margin Vector & Neurovascular Bundle Avoidance', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa590004-0000-0000-0000-000000000002', 'fa590003-0000-0000-0000-000000000002', 'Light''s Criteria for Exudative vs Transudative Pleural Effusions', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa590005-0000-0000-0000-000000000002', 'fa590004-0000-0000-0000-000000000002', 'Sinusoidal Hydrostatic Gradients, Translocated Neutrophilic Peritonitis, Superior Costal Angles, and Lactate Dehydrogenase Permeabilities', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa590006-0000-0000-0000-000000000002', 'fa590005-0000-0000-0000-000000000002', 'EXPLANATION', 1, 
'{"text": "### Paracentesis & Thoracentesis Fluid Analysis\n\nAscitic Fluid: SAAG = Serum Albumin - Ascitic Albumin. SAAG >=1.1 g/dL indicates Portal HTN (Cirrhosis, CHF); SAAG <1.1 indicates Non-Portal (Peritoneal carcinomatosis). SBP: Ascitic PMN >=250/uL -> start IV Ceftriaxone + IV Albumin (1.5 g/kg d1, 1.0 g/kg d3). Thoracentesis: Always insert needle OVER the superior rib border to avoid subcostal VAN bundle. Light''s Criteria: Exudate if Pleural/Serum Protein >0.5, Pleural/Serum LDH >0.6, or Pleural LDH >2/3 upper normal limit."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 3: Lumbar Puncture CSF Opening Pressure & Differential Manometry
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa590001-0000-0000-0000-000000000003', 'f4f9a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a20', 'Lumbar Puncture CSF Opening Pressure & Differential Manometry', 3)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa590002-0000-0000-0000-000000000003', 'fa590001-0000-0000-0000-000000000003', 'Tuffier''s L4-L5 Line, Conus Medullaris Anatomy & Ligamentum Flavum Pops', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa590003-0000-0000-0000-000000000003', 'fa590002-0000-0000-0000-000000000003', 'Acute Bacterial Meningitis CSF Dynamics (PMN Pleocytosis & Hypoglycorrhachia)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa590004-0000-0000-0000-000000000003', 'fa590003-0000-0000-0000-000000000003', 'Viral, Fungal/TB & Subarachnoid Hemorrhage Xanthochromia Diagnostics', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa590005-0000-0000-0000-000000000003', 'fa590004-0000-0000-0000-000000000003', 'Iliac Crest Intercristal Lineations, Dural Arachnoid Punctures, Purulent Thecal Pressures, and Supernatant Bilirubin Xanthochromias', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa590006-0000-0000-0000-000000000003', 'fa590005-0000-0000-0000-000000000003', 'EXPLANATION', 1, 
'{"text": "### Lumbar Puncture & CSF Manometry\n\nSpinal Anatomy: Tuffier''s line (iliac crests) = L4 spinous process. Conus medullaris terminates at L1-L2; perform LP at L3-L4 or L4-L5. Ligamentum flavum gives 1st pop; dura/arachnoid gives 2nd pop. CSF Profiles: Bacterial Meningitis (opening pressure >25, PMNs >1,000, protein >100, glucose <40% -> start IV Vancomycin + Ceftriaxone + Dexamethasone). Viral (lymphocytes, normal glucose). Fungal/TB (lymphocytes, very low glucose <30). SAH (xanthochromia in centrifuged CSF)."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 4: Point-of-Care Ultrasound (POCUS: Cardiac, Lung & Vascular)
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa590001-0000-0000-0000-000000000004', 'f4f9a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a20', 'Point-of-Care Ultrasound (POCUS: Cardiac, Lung & Vascular)', 4)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa590002-0000-0000-0000-000000000004', 'fa590001-0000-0000-0000-000000000004', 'Focused Cardiac Echo (FoCUS): PLAX, PSAX D-Sign & IVC Collapsibility', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa590003-0000-0000-0000-000000000004', 'fa590002-0000-0000-0000-000000000004', 'Lung Ultrasound BLUE Protocol: A-Lines, Vertical B-Lines & Pulmonary Edema', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa590004-0000-0000-0000-000000000004', 'fa590003-0000-0000-0000-000000000004', 'Pneumothorax POCUS: Loss of Lung Sliding, Barcode Sign & Lung Point', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa590005-0000-0000-0000-000000000004', 'fa590004-0000-0000-0000-000000000004', 'Parasternal Long-Axis Aortographies, Interstitial Comet Tail Reverberations, Pleural Shimmering Transitions, and Stratosphere M-Modes', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa590006-0000-0000-0000-000000000004', 'fa590005-0000-0000-0000-000000000004', 'EXPLANATION', 1, 
'{"text": "### Point-of-Care Ultrasound (POCUS)\n\nCardiac FoCUS: PLAX (pericardial fluid is anterior to descending aorta). PSAX (D-shaped LV indicates RV pressure overload in PE). IVC (<2.1 cm with >50% collapse indicates normal CVP 0-5 mmHg; plethoric IVC indicates high CVP). Lung BLUE Protocol: A-lines are horizontal normal aeration artifacts; >=3 vertical B-lines per zone indicates alveolar-interstitial pulmonary edema. Pneumothorax: Loss of lung sliding, barcode/stratosphere sign on M-mode, and 100% specific lung point."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;
