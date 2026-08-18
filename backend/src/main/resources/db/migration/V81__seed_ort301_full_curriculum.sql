-- V81: Seed Advanced Orthopedic Surgery & Musculoskeletal Oncology (ORT-301) Full Curriculum

-- Ensure Subject: ORT-301 exists with correct title and category
INSERT INTO subjects (id, semester_id, code, title, category)
VALUES ('f1d0a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a39', 'c7d8e9f0-b1c2-3d4e-5f6a-7b8c9d0e1f2a', 'ORT-301', 'Advanced Orthopedic Surgery & Musculoskeletal Oncology', 'CLINICAL')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, category = EXCLUDED.category;

-- Unit 1: Acute Compartment Syndrome & Fasciotomy Protocols
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa440001-0000-0000-0000-000000000001', 'f1d0a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a39', 'Acute Compartment Syndrome & Fasciotomy Protocols', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa440002-0000-0000-0000-000000000001', 'fa440001-0000-0000-0000-000000000001', 'The 6 Ps of Ischemia & Intracompartmental Manometry', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa440003-0000-0000-0000-000000000001', 'fa440002-0000-0000-0000-000000000001', 'Delta Pressure Thresholds (Diastolic BP - Compartment Pressure <= 30 mmHg)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa440004-0000-0000-0000-000000000001', 'fa440003-0000-0000-0000-000000000001', 'Dual-Incision 4-Compartment Leg Fasciotomy & Volkmann Contracture Prevention', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa440005-0000-0000-0000-000000000001', 'fa440004-0000-0000-0000-000000000001', 'Osteofascial Microvascular Hypoperfusions, Transmural Pressure Gradient Collapses, Anterolateral-Posteromedial Dermato-Fasciotomies, and Myofibrotic Ischemic Contracture Preventions', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa440006-0000-0000-0000-000000000001', 'fa440005-0000-0000-0000-000000000001', 'EXPLANATION', 1, 
'{"text": "### Acute Compartment Syndrome (ACS)\n\nPathophysiology: Elevated tissue hydrostatic pressure in closed osteofascial space exceeding capillary closing pressure. 6 Ps: Pain out of proportion (earliest/most sensitive), Pain on passive stretch, Paresthesias, Pallor, Poikilothermia, Pulselessness (late). Diagnostic threshold: Absolute pressure >30 mmHg or Delta Pressure (Diastolic BP - Compartment Pressure) <=30 mmHg. Management: Emergent dual-incision 4-compartment leg fasciotomy (anterolateral and posteromedial incisions) within 6 hours to prevent Volkmann ischemic contracture."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 2: Open Fractures & Mangled Extremity Protocols
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa440001-0000-0000-0000-000000000002', 'f1d0a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a39', 'Open Fractures & Mangled Extremity Protocols', 2)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa440002-0000-0000-0000-000000000002', 'fa440001-0000-0000-0000-000000000002', 'Gustilo-Anderson Classification (Types I, II, IIIa, IIIb, IIIc)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa440003-0000-0000-0000-000000000002', 'fa440002-0000-0000-0000-000000000002', 'Antibiotic Escalation: Cefazolin, Gentamicin & Penicillin G Regimens', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa440004-0000-0000-0000-000000000002', 'fa440003-0000-0000-0000-000000000002', 'Operative Debridement, Pulsatile Lavage & Temporary External Fixation', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa440005-0000-0000-0000-000000000002', 'fa440004-0000-0000-0000-000000000002', 'High-Energy Periosteal Stripping Traumas, Polymicrobial Osteomyelitic Inoculations, Microvascular Free Flap Reconstructions, and Emergent Arterial Shunt Revascularizations', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa440006-0000-0000-0000-000000000002', 'fa440005-0000-0000-0000-000000000002', 'EXPLANATION', 1, 
'{"text": "### Open Fractures & Gustilo-Anderson Classification\n\nType I (<1 cm clean) & Type II (1-10 cm): IV Cefazolin. Type IIIa (>10 cm adequate coverage): Cefazolin + Gentamicin. Type IIIb (>10 cm extensive bone exposure requiring flap coverage): Cefazolin + Gentamicin + Penicillin G (if barnyard/soil contamination for Clostridium). Type IIIc: Open fracture associated with arterial injury requiring vascular repair. Emergency management: IV antibiotics within 1 hour, sterile dressing, tetanus prophylaxis, low-pressure lavage, and temporary external fixation."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 3: Pediatric Orthopedics & Hip Biomechanics
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa440001-0000-0000-0000-000000000003', 'f1d0a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a39', 'Pediatric Orthopedics & Hip Biomechanics', 3)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa440002-0000-0000-0000-000000000003', 'fa440001-0000-0000-0000-000000000003', 'Developmental Dysplasia of the Hip (DDH) & Pavlik Harness', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa440003-0000-0000-0000-000000000003', 'fa440002-0000-0000-0000-000000000003', 'Slipped Capital Femoral Epiphysis (SCFE) & In Situ Pinning', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa440004-0000-0000-0000-000000000003', 'fa440003-0000-0000-0000-000000000003', 'Legg-Calve-Perthes Disease & Pediatric Septic Hip (Kocher Criteria)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa440005-0000-0000-0000-000000000003', 'fa440004-0000-0000-0000-000000000003', 'Physeal Hypertrophic Zone Shearing Displacements, Acetabular Cartilage Dysplasias, Femoral Epiphyseal Avascular Osteonecroses, and In Situ Single Cannulated Screw Fixations', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa440006-0000-0000-0000-000000000003', 'fa440005-0000-0000-0000-000000000003', 'EXPLANATION', 1, 
'{"text": "### Pediatric Orthopedics\n\nDDH: Ortolani (+ relocation) and Barlow (+ dislocation) maneuvers; dynamic ultrasound if <6m; Pavlik harness in 100-110 deg flexion and abduction. SCFE: Obese adolescent boys (11-14y) presenting with dull groin or referred knee pain and obligatory external rotation on flexion; Klein line fails to intersect epiphysis; NEVER reduce (AVN risk); perform emergent in situ single cannulated screw fixation. Perthes: Idiopathic AVN of femoral head in boys 4-8y with crescent sign. Septic arthritis: Kocher criteria -> emergent arthrotomy."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 4: Musculoskeletal Oncology & Bone Tumors
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa440001-0000-0000-0000-000000000004', 'f1d0a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a39', 'Musculoskeletal Oncology & Bone Tumors', 4)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa440002-0000-0000-0000-000000000004', 'fa440001-0000-0000-0000-000000000004', 'High-Grade Conventional Osteosarcoma & MAP Chemotherapy', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa440003-0000-0000-0000-000000000004', 'fa440002-0000-0000-0000-000000000004', 'Ewing Sarcoma t(11;22) EWS-FLI1 & CD99 Small Round Blue Cells', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa440004-0000-0000-0000-000000000004', 'fa440003-0000-0000-0000-000000000004', 'Giant Cell Tumor Soap-Bubble Appearance, RANKL Denosumab & Chondrosarcoma', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa440005-0000-0000-0000-000000000004', 'fa440004-0000-0000-0000-000000000004', 'Neoplastic Osteoblastic Osteoid Syntheses, Neuroectodermal EWS-FLI1 Chimeric Translocations, Multinucleated Stromal RANKL Bone Resorptions, and Cartilaginous Chondrosarcoma Wide Resections', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa440006-0000-0000-0000-000000000004', 'fa440005-0000-0000-0000-000000000004', 'EXPLANATION', 1, 
'{"text": "### Musculoskeletal Oncology\n\nOsteosarcoma: Metaphysis of long bones (distal femur), sunburst periosteal reaction + Codman triangle, produces malignant osteoid; MAP neoadjuvant chemo + wide resection. Ewing Sarcoma: Diaphysis, onion skinning periosteal reaction, t(11;22) translocation, CD99+ small round blue cells. Giant Cell Tumor: Epiphysis of mature adults (20-40y), soap-bubble lytic lesion; curettage + Denosumab (RANKL inhibitor). Chondrosarcoma: Axial skeleton/pelvis of older adults, popcorn/ring-and-arc calcifications; chemo/radiation resistant -> wide surgical excision."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;
