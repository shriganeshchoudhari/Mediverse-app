-- V39: Seed Pediatrics & Neonatology (PED-301) Full Curriculum

-- Ensure Subject: PED-301 exists with correct title and category
INSERT INTO subjects (id, semester_id, code, title, category)
VALUES ('f6f6a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0b', 'c7d8e9f0-b1c2-3d4e-5f6a-7b8c9d0e1f2a', 'PED-301', 'Pediatrics', 'CLINICAL')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, category = EXCLUDED.category;

-- Unit 1: Developmental Milestones & Growth Velocity
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa010001-0000-0000-0000-000000000001', 'f6f6a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0b', 'Developmental Milestones, Growth Velocity & Anthropometry', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa010002-0000-0000-0000-000000000001', 'fa010001-0000-0000-0000-000000000001', '4 Core Milestone Domains & Shape Copying', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa010003-0000-0000-0000-000000000001', 'fa010002-0000-0000-0000-000000000001', 'Gross and Fine Motor Milestones', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa010004-0000-0000-0000-000000000001', 'fa010003-0000-0000-0000-000000000001', 'Weight Velocity and Fontanelle Closure', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa010005-0000-0000-0000-000000000001', 'fa010004-0000-0000-0000-000000000001', 'Developmental Milestones, Pediatric Growth and Drawing Progression', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa010006-0000-0000-0000-000000000001', 'fa010005-0000-0000-0000-000000000001', 'EXPLANATION', 1, 
'{"text": "### Developmental Milestones & Pediatric Growth\n\nGross motor milestones: Head control 4m, Sit 6m, Walk 12m, Tricycle 3y, Hop 4y. Fine motor shape copying: Line 2y, Circle 3y, Cross/Square 4y, Triangle 5y. Weight doubles at 5 months and triples at 1 year. Anterior fontanelle closes by 9-18 months."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 2: Neonatal Hyperbilirubinemia & Phototherapy
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa010001-0000-0000-0000-000000000002', 'f6f6a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0b', 'Neonatal Hyperbilirubinemia, Phototherapy & Exchange Transfusion', 2)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa010002-0000-0000-0000-000000000002', 'fa010001-0000-0000-0000-000000000002', 'Physiological vs Pathological & Bhutani Nomogram', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa010003-0000-0000-0000-000000000002', 'fa010002-0000-0000-0000-000000000002', 'ABO Incompatibility & Lumirubin Photoisomerization', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa010004-0000-0000-0000-000000000002', 'fa010003-0000-0000-0000-000000000002', 'Kernicterus Globus Pallidus and Exchange Transfusion', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa010005-0000-0000-0000-000000000002', 'fa010004-0000-0000-0000-000000000002', 'Neonatal Jaundice Differentiation, Phototherapy Principles and Kernicterus', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa010006-0000-0000-0000-000000000002', 'fa010005-0000-0000-0000-000000000002', 'EXPLANATION', 1, 
'{"text": "### Neonatal Hyperbilirubinemia\n\nJaundice in the first 24h of life is always pathological. Blue-green phototherapy (460-490 nm) converts unconjugated bilirubin to Lumirubin via structural photoisomerization. Severe unconjugated bilirubin deposits in the basal ganglia (globus pallidus) causing Kernicterus; double-volume exchange transfusion is 160 mL/kg."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 3: NRP & Respiratory Distress Syndrome
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa010001-0000-0000-0000-000000000003', 'f6f6a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0b', 'Neonatal Resuscitation Program, APGAR & RDS Surfactant', 3)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa010002-0000-0000-0000-000000000003', 'fa010001-0000-0000-0000-000000000003', 'NRP 8th Ed Algorithm & MR. SOPA Steps', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa010003-0000-0000-0000-000000000003', 'fa010002-0000-0000-0000-000000000003', 'APGAR Score at 1 and 5 Minutes', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa010004-0000-0000-0000-000000000003', 'fa010003-0000-0000-0000-000000000003', 'RDS Surfactant Deficiency and Ground-Glass CXR', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa010005-0000-0000-0000-000000000003', 'fa010004-0000-0000-0000-000000000003', 'Neonatal Resuscitation Program, APGAR Scoring and Hyaline Membrane Disease', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa010006-0000-0000-0000-000000000003', 'fa010005-0000-0000-0000-000000000003', 'EXPLANATION', 1, 
'{"text": "### Neonatal Resuscitation & RDS\n\nNRP 8th Ed starts PPV in 21% O2 for term neonates with HR <100 bpm. If HR <60 bpm despite effective PPV via ETT, initiate 3:1 chest compressions in 100% O2 followed by IV Epinephrine (0.02 mg/kg). Neonatal RDS results from Type II pneumocyte surfactant deficiency treated with CPAP and exogenous surfactant."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 4: Dehydration & Pediatric Respiratory Emergencies
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa010001-0000-0000-0000-000000000004', 'f6f6a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0b', 'Pediatric Gastroenteritis, Dehydration & Airway Emergencies', 4)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa010002-0000-0000-0000-000000000004', 'fa010001-0000-0000-0000-000000000004', 'WHO Dehydration Plans A, B, C & Zinc', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa010003-0000-0000-0000-000000000004', 'fa010002-0000-0000-0000-000000000004', 'Croup Steeple Sign vs Epiglottitis Thumbprint Sign', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa010004-0000-0000-0000-000000000004', 'fa010003-0000-0000-0000-000000000004', 'RSV Bronchiolitis and Severe Dehydration IV Bolus', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa010005-0000-0000-0000-000000000004', 'fa010004-0000-0000-0000-000000000004', 'WHO Dehydration Management, Croup, Epiglottitis and Pediatric Airway Control', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa010006-0000-0000-0000-000000000004', 'fa010005-0000-0000-0000-000000000004', 'EXPLANATION', 1, 
'{"text": "### Pediatric Dehydration & Airway Emergencies\n\nWHO Plan B gives 75 mL/kg ORS over 4 hours plus Zinc (20 mg/d x 14 days). Plan C gives 100 mL/kg IV Ringer lactate. Croup shows subglottic steeple sign managed with Dexamethasone. Acute epiglottitis exhibits drooling and thumbprint sign, requiring emergency OR intubation without tongue blade exam."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;
