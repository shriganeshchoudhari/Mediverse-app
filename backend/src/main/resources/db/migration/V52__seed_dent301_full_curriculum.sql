-- V52: Seed Dentistry & Maxillofacial Surgery (DENT-301) Full Curriculum

-- Ensure Subject: DENT-301 exists with correct title and category
INSERT INTO subjects (id, semester_id, code, title, category)
VALUES ('f1e8a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a10', 'c9d0e1f2-b3c4-5d6e-7f8a-9b0c1d2e3f4a', 'DENT-301', 'Dentistry & Maxillofacial Surgery', 'CLINICAL')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, category = EXCLUDED.category;

-- Unit 1: Dental Anatomy, Eruption Chronology & Tooth Notation
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa140001-0000-0000-0000-000000000001', 'f1e8a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a10', 'Dental Anatomy, Eruption Chronology & Tooth Notation', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa140002-0000-0000-0000-000000000001', 'fa140001-0000-0000-0000-000000000001', 'Enamel, Dentin, Pulp & Periodontium Histology', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa140003-0000-0000-0000-000000000001', 'fa140002-0000-0000-0000-000000000001', 'Eruption Sequences & 6-Year First Permanent Molar', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa140004-0000-0000-0000-000000000001', 'fa140003-0000-0000-0000-000000000001', 'FDI, Universal, Palmer Notation & Streptococcus mutans Caries', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa140005-0000-0000-0000-000000000001', 'fa140004-0000-0000-0000-000000000001', 'Dental Microanatomy, Eruption Chronology, FDI/Universal Systems, and Streptococcus mutans Caries Biofilm', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa140006-0000-0000-0000-000000000001', 'fa140005-0000-0000-0000-000000000001', 'EXPLANATION', 1, 
'{"text": "### Dental Anatomy, Eruption & Caries Microbiology\n\nEnamel is 96% inorganic hydroxyapatite (hardest bodily tissue, acellular, demineralizes at pH <=5.5). Dentin contains odontoblastic tubular processes. Pulp contains A-delta and C nociceptive fibers. Permanent first molar (FDI 46/36/16/26) erupts at age 6 non-succedaneously. FDI system: 1st digit = quadrant, 2nd digit = tooth. Streptococcus mutans synthesizes insoluble glucans from sucrose via glucosyltransferase, driving acidogenic demineralization."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 2: Odontogenic Fascial Space Infections & Ludwig's Angina
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa140001-0000-0000-0000-000000000002', 'f1e8a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a10', 'Odontogenic Fascial Space Infections & Ludwig''s Angina', 2)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa140002-0000-0000-0000-000000000002', 'fa140001-0000-0000-0000-000000000002', 'Mylohyoid Line Anatomic Boundary & Periapical Spread', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa140003-0000-0000-0000-000000000002', 'fa140002-0000-0000-0000-000000000002', 'Ludwig''s Angina: Bilateral Cellulitis & Airway Elevation', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa140004-0000-0000-0000-000000000002', 'fa140003-0000-0000-0000-000000000002', 'Awake Fiberoptic Intubation, Antibiotics & Danger Space 4', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa140005-0000-0000-0000-000000000002', 'fa140004-0000-0000-0000-000000000002', 'Deep Neck Fascial Spaces, Ludwig''s Angina Emergency Airway, Surgical Decompression and Descending Mediastinitis', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa140006-0000-0000-0000-000000000002', 'fa140005-0000-0000-0000-000000000002', 'EXPLANATION', 1, 
'{"text": "### Odontogenic Infections & Ludwig''s Angina\n\nMandibular molar roots below mylohyoid ridge drain into submandibular space. Ludwig''s Angina: Bilateral gangrenous cellulitis of submandibular, sublingual, and submental spaces with woody brawny induration, elevated retrodisplaced tongue, and trismus. Mandates Awake Fiberoptic Intubation / Tracheostomy in OR (paralytic induction is strictly contraindicated due to lost airway). Danger space (Space 4) extends between alar and prevertebral fascia directly to diaphragm, causing descending mediastinitis."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 3: Maxillofacial Trauma: Le Fort & Mandibular Fractures
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa140001-0000-0000-0000-000000000003', 'f1e8a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a10', 'Maxillofacial Trauma: Le Fort & Mandibular Fractures', 3)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa140002-0000-0000-0000-000000000003', 'fa140001-0000-0000-0000-000000000003', 'Le Fort I, II & III Midfacial Fractures', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa140003-0000-0000-0000-000000000003', 'fa140002-0000-0000-0000-000000000003', 'Mandibular Fractures, Angle Impaction & Coleman''s Sign', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa140004-0000-0000-0000-000000000003', 'fa140003-0000-0000-0000-000000000003', 'ZMC Tripod Fractures & ORIF along Champy''s Lines', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa140005-0000-0000-0000-000000000003', 'fa140004-0000-0000-0000-000000000003', 'Le Fort I-III Classification, Floating Maxilla, Mandibular Sublingual Hematoma, ZMC Trauma and Champy ORIF', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa140006-0000-0000-0000-000000000003', 'fa140005-0000-0000-0000-000000000003', 'EXPLANATION', 1, 
'{"text": "### Maxillofacial Trauma & Fractures\n\nLe Fort I: Horizontal floating palate. Le Fort II: Pyramidal floating maxilla with bilateral V2 infraorbital hypoesthesia and orbital rim step-off. Le Fort III: Craniofacial dysjunction with dish-face deformity, raccoon eyes, and cribriform CSF rhinorrhea. Mandibular fractures: Condyle (30%) > Angle (25%, impacted 3rd molar). Coleman''s sign (sublingual hematoma in floor of mouth) is pathognomonic. Managed with MMF or ORIF titanium miniplates along Champy''s lines."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 4: Oral Pathology, Ameloblastoma & TMJ Disorders
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa140001-0000-0000-0000-000000000004', 'f1e8a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a10', 'Oral Pathology, Ameloblastoma & TMJ Disorders', 4)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa140002-0000-0000-0000-000000000004', 'fa140001-0000-0000-0000-000000000004', 'Ameloblastoma Multilocular Neoplasm & Free Fibula Flap', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa140003-0000-0000-0000-000000000004', 'fa140002-0000-0000-0000-000000000004', 'OKC, Gorlin-Goltz Syndrome & Dentigerous Cysts', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa140004-0000-0000-0000-000000000004', 'fa140003-0000-0000-0000-000000000004', 'Premalignancy (Erythroplakia, OSMF) & TMJ Nélaton Reduction', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa140005-0000-0000-0000-000000000004', 'fa140004-0000-0000-0000-000000000004', 'Ameloblastoma Soap Bubble Resection, OKC PTCH1, Oral Potentially Malignant Disorders, and TMJ Nélaton Maneuver', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa140006-0000-0000-0000-000000000004', 'fa140005-0000-0000-0000-000000000004', 'EXPLANATION', 1, 
'{"text": "### Oral Pathology, Neoplasms & TMJ\n\nAmeloblastoma: Multilocular soap-bubble radiolucency with cortical expansion at mandibular angle; requires wide segmental mandibulectomy with 1.0-1.5 cm margins + free fibula flap. Odontogenic Keratocyst (OKC) exhibits PTCH1 mutation and high recurrence, associated with Gorlin-Goltz syndrome. Erythroplakia has >50-90% malignant potential. OSMF from areca nut causes marble blanching and severe trismus. Acute TMJ dislocation is reduced via Nélaton maneuver (downward/backward molar pressure)."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;
