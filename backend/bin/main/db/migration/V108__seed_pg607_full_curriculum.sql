-- V108: Seed Postgraduate Advanced Orthopedics & Musculoskeletal Oncology (PG-607) Full Curriculum

-- Ensure Subject: PG-607 exists with correct title and category
INSERT INTO subjects (id, semester_id, code, title, category)
VALUES ('f9f9a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a33', 'd0e1f2a3-c4d5-6e7f-8a9b-0c1d2e3f4a5b', 'PG-607', 'Postgraduate Advanced Orthopedics & Musculoskeletal Oncology', 'CLINICAL')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, category = EXCLUDED.category;

-- Unit 1: Pelvic Ring Disruptions & Hemorrhage Control Protocols
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa720001-0000-0000-0000-000000000001', 'f9f9a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a33', 'Pelvic Ring Disruptions & Hemorrhage Control Protocols', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa720002-0000-0000-0000-000000000001', 'fa720001-0000-0000-0000-000000000001', 'Young-Burgess Classification (LC, APC I-III, Vertical Shear)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa720003-0000-0000-0000-000000000001', 'fa720002-0000-0000-0000-000000000001', 'Pelvic Circumferential Compression Device (Greater Trochanter Alignment)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa720004-0000-0000-0000-000000000001', 'fa720003-0000-0000-0000-000000000001', 'Preperitoneal Pelvic Packing (Retzius Space) & Angioembolization', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa720005-0000-0000-0000-000000000001', 'fa720004-0000-0000-0000-000000000001', 'Young-Burgess Ligamentous Disruptions, Presacral Venous Tamponades, Preperitoneal Retzius Packings, and Internal Iliac Embolizations', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa720006-0000-0000-0000-000000000001', 'fa720005-0000-0000-0000-000000000001', 'EXPLANATION', 1, 
'{"text": "### Pelvic Ring Disruptions & Hemorrhage Control\n\nYoung-Burgess Classification: Lateral Compression (LC-I/II/III windswept); Anterior-Posterior Compression (APC-I <2.5cm stable; APC-II >2.5cm anterior SI torn rotationally unstable; APC-III complete SI disruption vertically/rotationally unstable); Vertical Shear (complete dissociation). Hemorrhage Source: >85% presacral venous plexus and bleeding cancellous bone; 15% arterial (branches of internal iliac: superior gluteal, internal pudendal, lateral sacral). Emergency Damage Control: (1) Pelvic Circumferential Compression Device (pelvic binder) centered over the Greater Trochanters (not iliac crests) to reduce pelvic volume and promote clot tamponade; (2) Preperitoneal Pelvic Packing (PPP) via infraumbilical midline incision into the space of Retzius (pack 3-6 pads bilaterally against SI joints in <15 min); (3) Angioembolization for persistent arterial extravasation."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 2: High-Energy Open Fractures & Mangled Extremity Scoring (MESS)
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa720001-0000-0000-0000-000000000002', 'f9f9a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a33', 'High-Energy Open Fractures & Mangled Extremity Scoring (MESS)', 2)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa720002-0000-0000-0000-000000000002', 'fa720001-0000-0000-0000-000000000002', 'Gustilo-Anderson Classification (Type I to IIIC Vascular Injury)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa720003-0000-0000-0000-000000000002', 'fa720002-0000-0000-0000-000000000002', 'Empiric Antibiotic Prophylaxis (Cefazolin, Gentamicin & Penicillin G)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa720004-0000-0000-0000-000000000002', 'fa720003-0000-0000-0000-000000000002', 'Mangled Extremity Severity Score (MESS >=7 Amputation Threshold)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa720005-0000-0000-0000-000000000002', 'fa720004-0000-0000-0000-000000000002', 'Gustilo Soft-Tissue Staging, Cefazolin-Gentamicin Prophylaxis, MESS Score Amputation Thresholds, and Temporary Spanning External Fixations', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa720006-0000-0000-0000-000000000002', 'fa720005-0000-0000-0000-000000000002', 'EXPLANATION', 1, 
'{"text": "### High-Energy Open Fractures & MESS Scoring\n\nGustilo-Anderson Classification: Type I (<1 cm clean puncture, 0-2% infection); Type II (1-10 cm laceration, moderate crush, 2-7% infection); Type IIIA (>10 cm crush, adequate periosteal coverage, 10-15% infection); Type IIIB (extensive periosteal stripping and bone exposure requiring flap coverage, 20-30% infection); Type IIIC (open fracture with arterial injury requiring vascular repair, 25-50% infection). Antibiotics: Type I/II receive 1st-gen cephalosporin (Cefazolin 2g IV); Type III receive Cefazolin + Aminoglycoside (Gentamicin 5mg/kg), adding Penicillin G for farm/soil contamination. Mangled Extremity Severity Score (MESS): Evaluates skeletal injury, limb ischemia (doubled if >6h), shock, and age; MESS >=7 predicts 100% specificity for primary/secondary amputation. Surgical Timing: Urgent radical debridement within 12-24 hours with temporary spanning external fixation."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 3: Acute Compartment Syndrome (ACS) & Emergent Decompression Protocols
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa720001-0000-0000-0000-000000000003', 'f9f9a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a33', 'Acute Compartment Syndrome (ACS) & Emergent Decompression Protocols', 3)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa720002-0000-0000-0000-000000000003', 'fa720001-0000-0000-0000-000000000003', 'Pathophysiologic Ischemia Cascade & Pain on Passive Muscle Stretch', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa720003-0000-0000-0000-000000000003', 'fa720002-0000-0000-0000-000000000003', 'Delta Pressure Manometry (Delta P = Diastolic BP - ICP <=30 mmHg)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa720004-0000-0000-0000-000000000003', 'fa720003-0000-0000-0000-000000000003', 'Dual-Incision 4-Compartment Leg Fasciotomy Anatomical Release', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa720005-0000-0000-0000-000000000003', 'fa720004-0000-0000-0000-000000000003', 'Capillary Collapse Manometries, Passive Stretch Pain Pathognomonics, Delta Pressure Thresholds, and Dual-Incision Four-Compartment Releases', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa720006-0000-0000-0000-000000000003', 'fa720005-0000-0000-0000-000000000003', 'EXPLANATION', 1, 
'{"text": "### Acute Compartment Syndrome & Fasciotomy\n\nPathophysiology: Increased tissue pressure within an enclosed fascial compartment exceeds capillary perfusion pressure, causing microvascular collapse, muscle ischemia, and irreversible necrosis after 6-8 hours. Clinical Recognition: Earliest sign is pain out of proportion to injury and exquisite pain on passive stretch of muscles. Delta Pressure (Delta P): Delta P = Diastolic BP - Intracompartmental Pressure <=30 mmHg is the definitive surgical threshold. Anatomical Dual-Incision Leg Fasciotomy: (1) Anterolateral incision releases Anterior (deep peroneal nerve, anterior tibial vessels) and Lateral (superficial peroneal nerve) compartments; (2) Posteromedial incision releases Superficial Posterior (gastrocnemius/soleus) and Deep Posterior (tibial nerve, posterior tibial vessels, releases soleus bridge from tibia) compartments."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 4: Musculoskeletal Oncology: Bone Sarcomas & Limb Salvage Surgery
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa720001-0000-0000-0000-000000000004', 'f9f9a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a33', 'Musculoskeletal Oncology: Bone Sarcomas & Limb Salvage Surgery', 4)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa720002-0000-0000-0000-000000000004', 'fa720001-0000-0000-0000-000000000004', 'Enneking Surgical Staging System (Stage IA to Stage III Metastatic)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa720003-0000-0000-0000-000000000004', 'fa720002-0000-0000-0000-000000000004', 'High-Grade Osteosarcoma (Metaphyseal, Codman Triangle, MAP Chemo)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa720004-0000-0000-0000-000000000004', 'fa720003-0000-0000-0000-000000000004', 'Ewing Sarcoma (t(11;22), EWSR1-FLI1) & Chondrosarcoma Resections', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa720005-0000-0000-0000-000000000004', 'fa720004-0000-0000-0000-000000000004', 'Enneking Staging Paradigms, Codman Triangle Spiculations, EWSR1 Translocations, and Endoprosthetic Limb Salvage Reconstructions', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa720006-0000-0000-0000-000000000004', 'fa720005-0000-0000-0000-000000000004', 'EXPLANATION', 1, 
'{"text": "### Musculoskeletal Oncology & Limb Salvage\n\nEnneking Staging System: Evaluates Histologic Grade (G1 low, G2 high), Anatomic Site (T1 intracompartmental, T2 extracompartmental), and Metastases (M0 no mets, M1 distant mets). Stage IIB (G2, T2, M0) is the most common presentation of Osteosarcoma. Bone Sarcoma Subtypes: (1) Osteosarcoma: Metaphyseal (distal femur, proximal tibia), Codman triangle, sunburst periosteal reaction, malignant osteoid production, RB1/TP53 mutations; treated with neoadjuvant MAP chemotherapy (Methotrexate, Doxorubicin, Cisplatin) -> wide margin surgical resection with limb salvage -> adjuvant chemotherapy; (2) Ewing Sarcoma: Diaphyseal, onion-skin periosteal laminations, t(11;22)(q24;q12) producing EWSR1-FLI1 fusion, small round blue cells; treated with VDC/IE chemotherapy + wide resection; (3) Chondrosarcoma: Cartilaginous rings and arcs calcifications; chemoresistant and radioresistant -> primary wide surgical resection."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;
