-- V42: Seed Otorhinolaryngology / ENT (ENT-301) Full Curriculum

-- Ensure Subject: ENT-301 exists with correct title and category
INSERT INTO subjects (id, semester_id, code, title, category)
VALUES ('f7a6a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0c', 'c7d8e9f0-b1c2-3d4e-5f6a-7b8c9d0e1f2a', 'ENT-301', 'ENT', 'CLINICAL')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, category = EXCLUDED.category;

-- Unit 1: Tuning Fork Tests & Pure Tone Audiometry
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa040001-0000-0000-0000-000000000001', 'f7a6a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0c', 'Tuning Fork Hearing Tests, Audiometry & Tympanometry', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa040002-0000-0000-0000-000000000001', 'fa040001-0000-0000-0000-000000000001', '512 Hz Rinne & Weber Test Protocol', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa040003-0000-0000-0000-000000000001', 'fa040002-0000-0000-0000-000000000001', 'Pure Tone Audiometry & Air-Bone Gap', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa040004-0000-0000-0000-000000000001', 'fa040003-0000-0000-0000-000000000001', 'Jerger Tympanometry Types A, As, Ad, B, C', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa040005-0000-0000-0000-000000000001', 'fa040004-0000-0000-0000-000000000001', 'Tuning Fork Tests, Audiogram Interpretation and Tympanometry Curves', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa040006-0000-0000-0000-000000000001', 'fa040005-0000-0000-0000-000000000001', 'EXPLANATION', 1, 
'{"text": "### Audiometry & Tuning Fork Tests\n\n512 Hz tuning fork tests differentiate conductive vs sensorineural hearing loss: Rinne negative (BC > AC) and Weber lateralizing to the affected ear indicate CHL. Pure Tone Audiometry identifies air-bone gap, noise dip at 4 kHz, and Carhart notch at 2 kHz in Otosclerosis. Jerger Type B tympanogram indicates glue ear."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 2: Otitis Media, Cholesteatoma & Vestibular Disorders
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa040001-0000-0000-0000-000000000002', 'f7a6a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0c', 'Otitis Media, Cholesteatoma & Peripheral Vestibular Disorders', 2)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa040002-0000-0000-0000-000000000002', 'fa040001-0000-0000-0000-000000000002', 'Safe Tubotympanic vs Unsafe Atticoantral CSOM', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa040003-0000-0000-0000-000000000002', 'fa040002-0000-0000-0000-000000000002', 'Cholesteatoma Bone Erosion & Mastoidectomy', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa040004-0000-0000-0000-000000000002', 'fa040003-0000-0000-0000-000000000002', 'Meniere Disease & BPPV Epley Maneuver', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa040005-0000-0000-0000-000000000002', 'fa040004-0000-0000-0000-000000000002', 'Chronic Suppurative Otitis Media, Cholesteatoma and Vestibular Dizziness Triage', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa040006-0000-0000-0000-000000000002', 'fa040005-0000-0000-0000-000000000002', 'EXPLANATION', 1, 
'{"text": "### Otology & Cholesteatoma\n\nAtticoantral CSOM features attic perforation, foul-smelling cheesy discharge, and osteolytic bone destruction causing facial palsy and labyrinthine fistula, requiring Modified Radical Mastoidectomy. BPPV is diagnosed with Dix-Hallpike and cured with the Epley maneuver."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 3: Epistaxis & Sinusitis
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa040001-0000-0000-0000-000000000003', 'f7a6a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0c', 'Epistaxis Kiesselbach & Woodruff Plexus, Rhinosinusitis & Mucormycosis', 3)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa040002-0000-0000-0000-000000000003', 'fa040001-0000-0000-0000-000000000003', 'Kiesselbach 4-Artery Anastomosis & Cautery', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa040003-0000-0000-0000-000000000003', 'fa040002-0000-0000-0000-000000000003', 'Woodruff Posterior Epistaxis & Foley Pack', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa040004-0000-0000-0000-000000000003', 'fa040003-0000-0000-0000-000000000003', 'Invasive Fungal Mucormycosis and DKA Black Eschar', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa040005-0000-0000-0000-000000000003', 'fa040004-0000-0000-0000-000000000003', 'Epistaxis Hemostasis Cascade, Little Area Anatomy and Invasive Sinus Fungal Infections', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa040006-0000-0000-0000-000000000003', 'fa040005-0000-0000-0000-000000000003', 'EXPLANATION', 1, 
'{"text": "### Epistaxis & Rhinology\n\nKiesselbach plexus anastomoses Anterior Ethmoidal, Sphenopalatine, Greater Palatine, and Superior Labial arteries. Treatment follows Trotter pinch -> Silver Nitrate chemical cautery -> Merocel pack. Invasive Mucormycosis in DKA presents with black necrotic eschar, requiring emergency debridement and IV Amphotericin B."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 4: Deep Neck Infections & Tracheostomy
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa040001-0000-0000-0000-000000000004', 'f7a6a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0c', 'Deep Neck Space Infections, Quinsy, Ludwig & Tracheostomy', 4)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa040002-0000-0000-0000-000000000004', 'fa040001-0000-0000-0000-000000000004', 'Peritonsillar Abscess Quinsy & Medial Pterygoid Trismus', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa040003-0000-0000-0000-000000000004', 'fa040002-0000-0000-0000-000000000004', 'Ludwig Angina Submandibular Cellulitis', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa040004-0000-0000-0000-000000000004', 'fa040003-0000-0000-0000-000000000004', 'Surgical Tracheostomy 2nd-3rd Ring Technique', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa040005-0000-0000-0000-000000000004', 'fa040004-0000-0000-0000-000000000004', 'Peritonsillar Abscess, Ludwig Angina, Airway Obstruction and Tracheostomy Principles', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa040006-0000-0000-0000-000000000004', 'fa040005-0000-0000-0000-000000000004', 'EXPLANATION', 1, 
'{"text": "### Deep Neck Infections & Airway\n\nPeritonsillar abscess (Quinsy) causes trismus from medial pterygoid spasm and contralateral uvula deviation, drained via needle aspiration. Ludwig angina is bilateral submandibular cellulitis from mandibular molars. Tracheostomy is performed between 2nd and 3rd tracheal rings, strictly avoiding the 1st ring."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;
