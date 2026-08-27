-- V87: Seed Human Anatomy II (ANAT-102) Full Curriculum

-- Ensure Subject: ANAT-102 exists with correct title and category
INSERT INTO subjects (id, semester_id, code, title, category)
VALUES ('e1f2a3b4-c5d6-7e8f-9a0b-1c2d3e4f5a6b', 'c4d5e6f7-a8b9-0c1d-2e3f-4a5b6c7d8e9f', 'ANAT-102', 'Human Anatomy II: Head, Neck, Neuroanatomy & Embryology', 'PRE_CLINICAL')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, category = EXCLUDED.category;

-- Unit 1: Cranial Nerves, Brainstem Nuclei & Stroke Syndromes
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa510001-0000-0000-0000-000000000001', 'e1f2a3b4-c5d6-7e8f-9a0b-1c2d3e4f5a6b', 'Cranial Nerves, Brainstem Nuclei & Stroke Syndromes', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa510002-0000-0000-0000-000000000001', 'fa510001-0000-0000-0000-000000000001', 'Lateral Medullary (Wallenberg) Syndrome & Nucleus Ambiguus (PICA)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa510003-0000-0000-0000-000000000001', 'fa510002-0000-0000-0000-000000000001', 'Medial Medullary (Dejerine / ASA) & Midbrain Weber (PCA) Syndromes', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa510004-0000-0000-0000-000000000001', 'fa510003-0000-0000-0000-000000000001', 'Functional Nuclear Columns (GSE, SVE, GVE) & Crossed Sensory Tracts', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa510005-0000-0000-0000-000000000001', 'fa510004-0000-0000-0000-000000000001', 'Branchial Motor Branchings, Cross-Sectional Medullary Infarctions, Hypoglossal Deviations, and Paramedian Midbrain Oculomotor Palsies', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa510006-0000-0000-0000-000000000001', 'fa510005-0000-0000-0000-000000000001', 'EXPLANATION', 1, 
'{"text": "### Cranial Nerves & Brainstem Syndromes\n\nWallenberg Syndrome: PICA occlusion involving Nucleus Ambiguus (loss of gag, dysphagia, hoarseness), spinal trigeminal nucleus (ipsilateral facial pain/temp loss), spinothalamic tract (contralateral body pain/temp loss), Horner syndrome. Dejerine Syndrome: ASA occlusion involving CN XII (ipsilateral tongue deviation) + contralateral hemiparesis. Weber Syndrome: PCA occlusion involving CN III (down-and-out pupil) + contralateral hemiplegia."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 2: Deep Fascial Spaces of the Head & Neck, Infratemporal Fossa & Ludwig Angina
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa510001-0000-0000-0000-000000000002', 'e1f2a3b4-c5d6-7e8f-9a0b-1c2d3e4f5a6b', 'Deep Fascial Spaces of the Head & Neck, Infratemporal Fossa & Ludwig Angina', 2)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa510002-0000-0000-0000-000000000002', 'fa510001-0000-0000-0000-000000000002', 'Retropharyngeal Danger Space & Descending Mediastinitis Anatomy', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa510003-0000-0000-0000-000000000002', 'fa510002-0000-0000-0000-000000000002', 'Submandibular Space & Ludwig Angina (Mylohyoid Ridge / Airway Block)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa510004-0000-0000-0000-000000000002', 'fa510003-0000-0000-0000-000000000002', 'Pterygopalatine Fossa Gateways & Carotid Sheath Lemierre Thrombophlebitis', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa510005-0000-0000-0000-000000000002', 'fa510004-0000-0000-0000-000000000002', 'Alar-Prevertebral Infiltration Planes, Lingual Displacements, Sphenopalatine Foramen Transmissions, and Internal Jugular Sheath Suppurations', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa510006-0000-0000-0000-000000000002', 'fa510005-0000-0000-0000-000000000002', 'EXPLANATION', 1, 
'{"text": "### Deep Fascial Spaces of the Neck\n\nDanger Space: Lies between alar and prevertebral fascia, extending from skull base directly into posterior mediastinum (T1-T4), enabling fatal descending necrotizing mediastinitis. Ludwig Angina: Bilateral cellulitis of sublingual/submandibular spaces from mandibular 2nd/3rd molars, forcing tongue upward and backward to obstruct the airway. Pterygopalatine Fossa: Communicates with middle fossa (foramen rotundum V2) and nasal cavity (sphenopalatine foramen)."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 3: Orbit, Cavernous Sinus & Otic Microanatomy
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa510001-0000-0000-0000-000000000003', 'e1f2a3b4-c5d6-7e8f-9a0b-1c2d3e4f5a6b', 'Orbit, Cavernous Sinus & Otic Microanatomy', 3)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa510002-0000-0000-0000-000000000003', 'fa510001-0000-0000-0000-000000000003', 'Cavernous Sinus Topography: CN VI in Lumen vs Lateral Wall CN III/IV/V1/V2', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa510003-0000-0000-0000-000000000003', 'fa510002-0000-0000-0000-000000000003', 'Facial Danger Triangle & Retrograde Ophthalmic Venous Thrombosis', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa510004-0000-0000-0000-000000000003', 'fa510003-0000-0000-0000-000000000003', 'Middle Ear Ossicular Chain, Tegmen Tympani & Otic Labyrinth Mechanics', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa510005-0000-0000-0000-000000000003', 'fa510004-0000-0000-0000-000000000003', 'Dural Venous Trabeculations, Abducens Free Transits, Valveless Retrograde Embolizations, and Ossicular Acoustic Leverages', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa510006-0000-0000-0000-000000000003', 'fa510005-0000-0000-0000-000000000003', 'EXPLANATION', 1, 
'{"text": "### Orbit, Cavernous Sinus & Otic Anatomy\n\nCavernous Sinus: CN VI and Internal Carotid Artery travel freely inside the venous lumen (CN VI is the earliest paralyzed in CST); lateral wall carries CN III, IV, V1, V2. Facial Danger Area: Furuncles in nasolabial fold spread backward via valveless ophthalmic veins to cavernous sinus. Middle Ear: Malleus, Incus, Stapes at oval window; tegmen tympani roof separates middle ear from temporal lobe."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 4: Clinical Embryology, Branchial Apparatus & Congenital Craniofacial Anomalies
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa510001-0000-0000-0000-000000000004', 'e1f2a3b4-c5d6-7e8f-9a0b-1c2d3e4f5a6b', 'Clinical Embryology, Branchial Apparatus & Congenital Craniofacial Anomalies', 4)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa510002-0000-0000-0000-000000000004', 'fa510001-0000-0000-0000-000000000004', 'Pharyngeal Arch Derivatives (1st-6th) & Cranial Nerve Innervations', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa510003-0000-0000-0000-000000000004', 'fa510002-0000-0000-0000-000000000004', 'Pharyngeal Pouches (1st-4th) & DiGeorge Syndrome 22q11.2 Deletion', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa510004-0000-0000-0000-000000000004', 'fa510003-0000-0000-0000-000000000004', 'Thyroglossal Duct vs Branchial Cleft Cysts & Craniofacial Dysostosis', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa510005-0000-0000-0000-000000000004', 'fa510004-0000-0000-0000-000000000004', 'Neural Crest Mesodermal Migrations, Third and Fourth Pouch Athymias, Midline Foramen Cecum Descents, and First Arch Dysostoses', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa510006-0000-0000-0000-000000000004', 'fa510005-0000-0000-0000-000000000004', 'EXPLANATION', 1, 
'{"text": "### Clinical Embryology & Branchial Apparatus\n\nPharyngeal Arches: 1st (CN V3, mastication, malleus/incus; Treacher Collins); 2nd (CN VII, facial expression, stapes/styloid; Pierre Robin). Pouches: 3rd (inferior parathyroids + thymus) and 4th (superior parathyroids); DiGeorge syndrome (22q11.2 deletion: absent thymus/T-cells, hypocalcemic tetany). Neck Masses: Thyroglossal cyst is midline and elevates with tongue protrusion; Branchial cyst is lateral along anterior SCM."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;
