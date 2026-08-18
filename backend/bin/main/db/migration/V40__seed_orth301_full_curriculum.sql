-- V40: Seed Orthopedics & Traumatology (ORTH-301) Full Curriculum

-- Ensure Subject: ORTH-301 exists with correct title and category
INSERT INTO subjects (id, semester_id, code, title, category)
VALUES ('f5e7f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a', 'c7d8e9f0-b1c2-3d4e-5f6a-7b8c9d0e1f2a', 'ORTH-301', 'Orthopedics', 'CLINICAL')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, category = EXCLUDED.category;

-- Unit 1: Salter-Harris Physeal Fractures & Gustilo Open Fractures
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa020001-0000-0000-0000-000000000001', 'f5e7f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a', 'Salter-Harris Physeal Fractures, Gustilo Open Fractures & Splinting', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa020002-0000-0000-0000-000000000001', 'fa020001-0000-0000-0000-000000000001', 'SALTR Mnemonic & Thurston-Holland Sign', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa020003-0000-0000-0000-000000000001', 'fa020002-0000-0000-0000-000000000001', 'Gustilo-Anderson Types I, II, IIIA-C', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa020004-0000-0000-0000-000000000001', 'fa020003-0000-0000-0000-000000000001', 'Open Fracture Antibiotic and Splinting Protocol', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa020005-0000-0000-0000-000000000001', 'fa020004-0000-0000-0000-000000000001', 'Salter-Harris Physeal Classification, Gustilo Open Fractures and Splinting', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa020006-0000-0000-0000-000000000001', 'fa020005-0000-0000-0000-000000000001', 'EXPLANATION', 1, 
'{"text": "### Salter-Harris & Open Fractures\n\nSalter-Harris classification: Type I (Physis), Type II (Metaphysis Thurston-Holland, 75%), Type III (Epiphysis), Type IV (Through all 3), Type V (cRush). Gustilo Type I/II receive Cefazolin; Type III receives Cefazolin + Gentamicin + Penicillin G for soil/barnyard contamination."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 2: Acute Compartment Syndrome & 4-Compartment Fasciotomy
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa020001-0000-0000-0000-000000000002', 'f5e7f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a', 'Acute Compartment Syndrome, Delta Pressure & 4-Compartment Fasciotomy', 2)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa020002-0000-0000-0000-000000000002', 'fa020001-0000-0000-0000-000000000002', 'The 6 Ps & Stryker Needle Manometry', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa020003-0000-0000-0000-000000000002', 'fa020002-0000-0000-0000-000000000002', 'Delta Pressure Delta-P <= 30 mmHg', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa020004-0000-0000-0000-000000000002', 'fa020003-0000-0000-0000-000000000002', 'Double-Incision 4-Compartment Lower Leg Fasciotomy', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa020005-0000-0000-0000-000000000002', 'fa020004-0000-0000-0000-000000000002', 'Acute Compartment Syndrome Pathophysiology, Delta Pressure and Emergency Fasciotomy', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa020006-0000-0000-0000-000000000002', 'fa020005-0000-0000-0000-000000000002', 'EXPLANATION', 1, 
'{"text": "### Acute Compartment Syndrome\n\nPain on passive muscle stretch is the earliest and most sensitive sign. Diagnostic gold standard is Delta Pressure (DBP - Compartment Pressure <= 30 mmHg). Mandatory emergency treatment is double-incision 4-compartment fasciotomy releasing anterior, lateral, superficial posterior, and deep posterior spaces."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 3: Joint Dislocations & Peripheral Nerve Injuries
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa020001-0000-0000-0000-000000000003', 'f5e7f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a', 'Joint Dislocations, Spinal Injuries & Peripheral Nerve Associations', 3)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa020002-0000-0000-0000-000000000003', 'fa020001-0000-0000-0000-000000000003', 'Anterior vs Posterior Shoulder Dislocations', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa020003-0000-0000-0000-000000000003', 'fa020002-0000-0000-0000-000000000003', 'Posterior Hip Dislocation & AVN Prevention Window', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa020004-0000-0000-0000-000000000003', 'fa020003-0000-0000-0000-000000000003', 'Radial, Median AIN and Ulnar Nerve Fracture Associations', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa020005-0000-0000-0000-000000000003', 'fa020004-0000-0000-0000-000000000003', 'Joint Dislocations, Reduction Windows, Avascular Necrosis and Nerve Injuries', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa020006-0000-0000-0000-000000000003', 'fa020005-0000-0000-0000-000000000003', 'EXPLANATION', 1, 
'{"text": "### Dislocations & Nerve Injuries\n\nAnterior shoulder dislocation risks Axillary nerve injury; posterior shoulder dislocation follows seizures or electrocution (lightbulb sign). Posterior hip dislocation presents flexed, adducted, internally rotated and shortened, requiring closed reduction within 6 hours to prevent femoral head AVN. Midshaft humerus fracture causes Radial nerve wrist drop."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 4: Bone Tumors & Osteomyelitis
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa020001-0000-0000-0000-000000000004', 'f5e7f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a', 'Bone Tumors, Osteosarcoma, Osteomyelitis & Kocher Criteria', 4)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa020002-0000-0000-0000-000000000004', 'fa020001-0000-0000-0000-000000000004', 'Osteosarcoma Sunburst vs Ewing Onion-Skin', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa020003-0000-0000-0000-000000000004', 'fa020002-0000-0000-0000-000000000004', 'Osteoid Osteoma Aspirin Relief & Giant Cell Tumor', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa020004-0000-0000-0000-000000000004', 'fa020003-0000-0000-0000-000000000004', 'Acute Hematogenous Osteomyelitis and Kocher Septic Arthritis Criteria', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa020005-0000-0000-0000-000000000004', 'fa020004-0000-0000-0000-000000000004', 'Bone Tumors, Osteosarcoma Metaphyseal Spread, Osteomyelitis and Septic Arthritis', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa020006-0000-0000-0000-000000000004', 'fa020005-0000-0000-0000-000000000004', 'EXPLANATION', 1, 
'{"text": "### Bone Tumors & Infections\n\nOsteosarcoma arises in the metaphysis around the knee with sunburst spicules and Codman triangle, metastasizing to lungs. Ewing sarcoma arises in the diaphysis with onion-skinning and t(11;22). Osteoid osteoma presents with nocturnal pain relieved by Aspirin. Septic arthritis diagnosed by Kocher criteria (4 criteria = 99% probability -> Joint Washout)."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;
