-- V83: Seed Advanced Otolaryngology & Head/Neck Surgical Oncology (ENT-301) Full Curriculum

-- Ensure Subject: ENT-301 exists with correct title and category
INSERT INTO subjects (id, semester_id, code, title, category)
VALUES ('f1d0a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a41', 'c7d8e9f0-b1c2-3d4e-5f6a-7b8c9d0e1f2a', 'ENT-301', 'Advanced Otolaryngology & Head/Neck Surgical Oncology', 'CLINICAL')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, category = EXCLUDED.category;

-- Unit 1: Deep Neck Space Infections & Airway Emergencies
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa460001-0000-0000-0000-000000000001', 'f1d0a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a41', 'Deep Neck Space Infections & Airway Emergencies', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa460002-0000-0000-0000-000000000001', 'fa460001-0000-0000-0000-000000000001', 'Ludwig Angina Submandibular Phlegmon & Awake Airway Security', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa460003-0000-0000-0000-000000000001', 'fa460002-0000-0000-0000-000000000001', 'Peritonsillar Abscess (Quinsy) Trismus & Uvular Deviation', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa460004-0000-0000-0000-000000000001', 'fa460003-0000-0000-0000-000000000001', 'Danger Space Retropharyngeal Spread & Descending Necrotizing Mediastinitis', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa460005-0000-0000-0000-000000000001', 'fa460004-0000-0000-0000-000000000001', 'Odontogenic Sublingual-Submandibular Cellulitides, Retrolingual Airway Occlusions, Retrovisceral Danger Space Mediastinites, and Awake Fiberoptic Intubations', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa460006-0000-0000-0000-000000000001', 'fa460005-0000-0000-0000-000000000001', 'EXPLANATION', 1, 
'{"text": "### Deep Neck Space Infections\n\nLudwig Angina: Bilateral submandibular and sublingual phlegmon from 2nd/3rd lower molar; woody induration, elevated tongue, stridor -> AWAKE fiberoptic intubation or tracheostomy + IV Unasyn + surgical drainage. Quinsy (Peritonsillar Abscess): Trismus, hot potato voice, contralateral uvular deviation -> needle aspiration/I&D + IV antibiotics. Retropharyngeal Abscess: Widened prevertebral space on lateral X-ray tracking down Danger Space (Space 4) into posterior mediastinum causing mediastinitis."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 2: Vestibular Pathology, Peripheral Vertigo & Neurotology
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa460001-0000-0000-0000-000000000002', 'f1d0a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a41', 'Vestibular Pathology, Peripheral Vertigo & Neurotology', 2)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa460002-0000-0000-0000-000000000002', 'fa460001-0000-0000-0000-000000000002', 'Benign Paroxysmal Positional Vertigo (BPPV) & Epley Maneuver', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa460003-0000-0000-0000-000000000002', 'fa460002-0000-0000-0000-000000000002', 'Ménière Disease Endolymphatic Hydrops & Low-Frequency SNHL', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa460004-0000-0000-0000-000000000002', 'fa460003-0000-0000-0000-000000000002', 'Vestibular Schwannoma Acoustic Neuroma & Cerebellopontine Angle MRI', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa460005-0000-0000-0000-000000000002', 'fa460004-0000-0000-0000-000000000002', 'Canalithiasis Gravitational Cupular Deflections, Endolymphatic Sac Resorption Disruptions, Cerebellopontine Acoustic Neuromas, and Particle Repositioning Maneuvers', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa460006-0000-0000-0000-000000000002', 'fa460005-0000-0000-0000-000000000002', 'EXPLANATION', 1, 
'{"text": "### Vestibular Pathology & Neurotology\n\nBPPV: Posterior canal canalithiasis; brief vertigo (<1 min) on head turn; Dix-Hallpike confirms torsional nystagmus with latency; cured by Epley canalith repositioning maneuver. Ménière Disease: Endolymphatic hydrops; episodic vertigo (20m-12h), fluctuating low-frequency SNHL, roaring tinnitus, aural fullness; treated with dietary salt restriction (<2 g/day) + HCTZ. Vestibular Schwannoma: Benign CN VIII tumor at CPA; unilateral progressive high-frequency SNHL and poor speech discrimination; diagnosed by Gadolinium MRI."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 3: Otology, Middle Ear Disorders & Cholesteatoma
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa460001-0000-0000-0000-000000000003', 'f1d0a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a41', 'Otology, Middle Ear Disorders & Cholesteatoma', 3)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa460002-0000-0000-0000-000000000003', 'fa460001-0000-0000-0000-000000000003', 'Attic Cholesteatoma Keratin Pocket & Enzymatic Bone Osteolysis', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa460003-0000-0000-0000-000000000003', 'fa460002-0000-0000-0000-000000000003', 'Labyrinthine Fistula & Tympanomastoidectomy (CWU vs CWD)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa460004-0000-0000-0000-000000000003', 'fa460003-0000-0000-0000-000000000003', 'Otosclerosis Stapes Fixation, Carhart Notch at 2000Hz & Stapedotomy', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa460005-0000-0000-0000-000000000003', 'fa460004-0000-0000-0000-000000000003', 'Pars Flaccida Keratinizing Destructions, Semicircular Canal Labyrinthine Fistulae, Stapedial Annular Ankyloses, and Tympanomastoidectomies', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa460006-0000-0000-0000-000000000003', 'fa460005-0000-0000-0000-000000000003', 'EXPLANATION', 1, 
'{"text": "### Otology & Middle Ear Disorders\n\nCholesteatoma: Expansile keratinizing squamous cyst in attic (pars flaccida); painless foul otorrhea, conductive hearing loss; collagenase bone erosion of incus and lateral canal (positive fistula test -> vertigo on pneumatic otoscopy); treated with Tympanomastoidectomy (CWU/CWD). Otosclerosis: Stapes footplate fixation at oval window in young adults; conductive loss with Carhart notch (dip in bone conduction at 2,000 Hz); treated with Stapedotomy and piston prosthesis."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 4: Head & Neck Surgical Oncology & Neck Dissections
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa460001-0000-0000-0000-000000000004', 'f1d0a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a41', 'Head & Neck Surgical Oncology & Neck Dissections', 4)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa460002-0000-0000-0000-000000000004', 'fa460001-0000-0000-0000-000000000004', 'HPV-16 Oropharyngeal OPSCC p16 Positivity & Chemoradiation', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa460003-0000-0000-0000-000000000004', 'fa460002-0000-0000-0000-000000000004', 'Glottic Laryngeal Carcinoma & Vocal Cord Laser Microsurgery', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa460004-0000-0000-0000-000000000004', 'fa460003-0000-0000-0000-000000000004', 'Cervical Lymph Node Levels (I-VI) & Radical vs Modified MRND Types I-III', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa460005-0000-0000-0000-000000000004', 'fa460004-0000-0000-0000-000000000004', 'Papillomavirus E6-E7 Lymphoepithelial Carcinogeneses, True Glottic Vocal Cord Hoarsenesses, Spinal Accessory Nerve Sparing Dissections, and Functional Neck Lymphadenectomies', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa460006-0000-0000-0000-000000000004', 'fa460005-0000-0000-0000-000000000004', 'EXPLANATION', 1, 
'{"text": "### Head & Neck Surgical Oncology\n\nHPV-Positive OPSCC: High-risk HPV-16; strong p16 overexpression; tonsils/base of tongue; cystic Level II node in non-smokers; highly radiosensitive with superior survival -> Cisplatin + IMRT. Glottic Larynx Ca: True vocal cords; early hoarseness; sparse lymphatics (low nodal spread) -> laser microsurgery or radiation. Neck Dissections: Radical (levels I-V + sacrifices CN XI, IJV, SCM); MRND Type I (preserves CN XI); MRND Type II (+ IJV); MRND Type III/Functional (preserves all 3: CN XI, IJV, SCM)."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;
