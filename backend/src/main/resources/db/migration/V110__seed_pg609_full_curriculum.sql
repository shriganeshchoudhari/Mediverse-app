-- V110: Seed Postgraduate Advanced Otorhinolaryngology, Head & Neck Oncology & Skull Base Surgery (PG-609) Full Curriculum

-- Ensure Subject: PG-609 exists with correct title and category
INSERT INTO subjects (id, semester_id, code, title, category)
VALUES ('f9f9a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a35', 'd0e1f2a3-c4d5-6e7f-8a9b-0c1d2e3f4a5b', 'PG-609', 'Postgraduate Advanced Otorhinolaryngology, Head & Neck Oncology & Skull Base Surgery', 'CLINICAL')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, category = EXCLUDED.category;

-- Unit 1: Advanced Laryngeal & Hypopharyngeal Carcinoma & Flap Reconstruction
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa740001-0000-0000-0000-000000000001', 'f9f9a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a35', 'Advanced Laryngeal & Hypopharyngeal Carcinoma & Flap Reconstruction', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa740002-0000-0000-0000-000000000001', 'fa740001-0000-0000-0000-000000000001', 'Laryngeal TNM Staging & Total Laryngectomy vs Organ Preservation', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa740003-0000-0000-0000-000000000001', 'fa740002-0000-0000-0000-000000000001', 'PMMC & Free Anterolateral Thigh (ALT) Microvascular Flap Reconstructions', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa740004-0000-0000-0000-000000000001', 'fa740003-0000-0000-0000-000000000001', 'Tracheoesophageal Puncture (TEP) & Blom-Singer Voice Rehabilitation', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa740005-0000-0000-0000-000000000001', 'fa740004-0000-0000-0000-000000000001', 'Extralaryngeal Cartilage Invasions, Total Pharyngolaryngectomies, PMMC Myocutaneous Transfers, and Primary Tracheoesophageal Voice Prosthetics', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa740006-0000-0000-0000-000000000001', 'fa740005-0000-0000-0000-000000000001', 'EXPLANATION', 1, 
'{"text": "### Advanced Laryngeal Carcinoma & Flap Reconstruction\n\nTNM Staging Decision Matrix: T3 (vocal cord fixation, paraglottic space invasion, minor inner cortex erosion) -> RTOG 91-11 organ-preservation concurrent chemoradiotherapy (Cisplatin + RT); T4a (gross extralaryngeal cartilage invasion through thyroid lamina into strap muscles/trachea/neck) -> Total Laryngectomy + Bilateral Neck Dissection followed by adjuvant radiation/chemoradiation (due to high risk of chondroradionecrosis and non-functional larynx with primary radiation); T4b (carotid encasement >270 deg, prevertebral space) -> unresectable. Reconstructive Flaps: Pectoralis Major Myocutaneous Flap (PMMC) pedicled on pectoral branch of thoracoacromial artery for pharyngeal patch and carotid coverage; Free Anterolateral Thigh (ALT) flap (LCFA descending branch) for circumferential pharyngolaryngectomy defects. Alaryngeal Speech: Primary Tracheoesophageal Puncture (TEP) with Blom-Singer one-way valve placement creates pulmonary-driven mucosal wave vibration for superior voice restoration."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 2: Endoscopic Sinus Surgery (FESS), Keros Anatomy & CSF Leak Repair
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa740001-0000-0000-0000-000000000002', 'f9f9a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a35', 'Endoscopic Sinus Surgery (FESS), Keros Anatomy & CSF Leak Repair', 2)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa740002-0000-0000-0000-000000000002', 'fa740001-0000-0000-0000-000000000002', 'Stepwise FESS Dissection & Skull Base Height Variations', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa740003-0000-0000-0000-000000000002', 'fa740002-0000-0000-0000-000000000002', 'Keros Cribriform Classification (Type I-III) & Lamina Papyracea', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa740004-0000-0000-0000-000000000002', 'fa740003-0000-0000-0000-000000000002', 'Hadad-Bassagasteguy Vascularized Nasoseptal Flap for Dural Closure', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa740005-0000-0000-0000-000000000002', 'fa740004-0000-0000-0000-000000000002', 'Keros Olfactory Fossa Depths, Lateral Lamella Vulnerabilities, Beta-2 Transferrin Diagnostics, and Hadad Nasoseptal Vascularized Flap Closures', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa740006-0000-0000-0000-000000000002', 'fa740005-0000-0000-0000-000000000002', 'EXPLANATION', 1, 
'{"text": "### FESS, Keros Anatomy & CSF Leak Repair\n\nKeros Classification of Cribriform Plate: Type I (depth 1-3 mm, flat roof); Type II (depth 4-7 mm, 70% of population); Type III (depth 8-16 mm, deepest olfactory fossa where lateral lamella is paper-thin 0.1 mm, representing the highest risk of intracranial penetration and CSF rhinorrhea during anterior ethmoidectomy). FESS Danger Zones: Lamina papyracea (orbital fat breach / medial rectus trauma), Anterior Ethmoidal Artery (AEA), Sphenopalatine Artery (SPA at crista ethmoidalis). CSF Rhinorrhea: Beta-2 Transferrin (or Beta-trace protein) confirms CSF presence with 100% specificity. Reconstruction: Multi-layer skull base repair utilizing an autologous fascia lata underlay and the vascularized Hadad-Bassagasteguy Nasoseptal Flap (pedicled on posterior septal branch of SPA), achieving >95% primary closure."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 3: Cholesteatoma, Mastoidectomy Techniques & Lateral Skull Base
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa740001-0000-0000-0000-000000000003', 'f9f9a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a35', 'Cholesteatoma, Mastoidectomy Techniques & Lateral Skull Base', 3)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa740002-0000-0000-0000-000000000003', 'fa740001-0000-0000-0000-000000000003', 'Enzymatic Bone Resorption & Complications (LSCC Fistula, Facial Palsy)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa740003-0000-0000-0000-000000000003', 'fa740002-0000-0000-0000-000000000003', 'Canal Wall Up vs Canal Wall Down (Modified Radical) Mastoidectomy', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa740004-0000-0000-0000-000000000003', 'fa740003-0000-0000-0000-000000000003', 'Facial Recess Posterior Tympanotomy & Cochlear Implantation', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa740005-0000-0000-0000-000000000003', 'fa740004-0000-0000-0000-000000000003', 'Attic Retraction Osteolyses, Labyrinthine Fistula Hennebert Signs, Canal Wall Down Exteriorizations, and Facial Recess Cochlear Implant Trajectories', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa740006-0000-0000-0000-000000000003', 'fa740005-0000-0000-0000-000000000003', 'EXPLANATION', 1, 
'{"text": "### Cholesteatoma, Mastoidectomy & Lateral Skull Base\n\nPathophysiology: Keratinizing squamous epithelium in pars flaccida produces matrix metalloproteinases and cytokines, inducing osteoclastic bone resorption. Complications: Incus long process erosion (80%), Lateral Semicircular Canal (LSCC) labyrinthine fistula (causes vertigo with tragal pressure [Hennebert sign] and loud noise [Tullio phenomenon]), facial nerve canal dehiscence (tympanic segment), and intracranial extension through tegmen/sigmoid plate. Mastoidectomy Approaches: (1) Canal Wall Up (CWU): preserves posterior canal wall, maintains natural anatomy, requires second-look surgery or non-EPI DWI MRI surveillance; (2) Canal Wall Down (CWD / Modified Radical): removes posterior canal wall, exteriorizes mastoid bowl with large meatoplasty (indicated for extensive disease, LSCC fistula, contracted mastoid, only-hearing ear). Facial Recess (Posterior Tympanotomy): bordered by facial nerve medially, chorda tympani laterally, and incudal buttress superiorly, providing the standard surgical corridor for Cochlear Implant round window electrode placement."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 4: Deep Neck Space Infections, Danger Space Mediastinitis & Surgical Airway
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa740001-0000-0000-0000-000000000004', 'f9f9a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a35', 'Deep Neck Space Infections, Danger Space Mediastinitis & Surgical Airway', 4)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa740002-0000-0000-0000-000000000004', 'fa740001-0000-0000-0000-000000000004', 'Deep Cervical Fascial Spaces (Parapharyngeal, Retropharyngeal & Space 4)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa740003-0000-0000-0000-000000000004', 'fa740002-0000-0000-0000-000000000004', 'Ludwig Angina Submandibular Cellulitis & Odontogenic Spreads', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa740004-0000-0000-0000-000000000004', 'fa740003-0000-0000-0000-000000000004', 'Awake Fiberoptic Intubation / Tracheostomy & Transcervical Drainage', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa740005-0000-0000-0000-000000000004', 'fa740004-0000-0000-0000-000000000004', 'Parapharyngeal Fascial Compartments, Danger Space Mediastinal Tracking, Ludwig Angina Tracheostomy Preventions, and Transcervical Decompressions', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa740006-0000-0000-0000-000000000004', 'fa740005-0000-0000-0000-000000000004', 'EXPLANATION', 1, 
'{"text": "### Deep Neck Space Infections & Surgical Airway\n\nDeep Cervical Fascial Spaces: (1) Parapharyngeal Space (PPS): pre-styloid (internal maxillary artery, fat, medial tonsillar displacement, trismus) vs post-styloid (carotid sheath, Lemierre syndrome with Fusobacterium necrophorum IJV thrombophlebitis); (2) Retropharyngeal Space: between buccopharyngeal and alar fascia (skull base to T1-T2); (3) Danger Space (Space 4): between alar and prevertebral fascia, extending from skull base directly down to the DIAPHRAGM, creating a conduit for rapidly fatal Descending Necrotizing Mediastinitis; (4) Ludwig Angina: bilateral submandibular (sublingual and submaxillary) gangrenous cellulitis from 2nd/3rd molar roots, with woody induration and tongue elevation causing acute airway obstruction. Airway Management: Awake Flexible Fiberoptic Intubation or Awake Tracheostomy under local anesthesia. STRICT CONTRAINDICATION: Paralytics or blind oral intubation abolish airway tone, precipitating immediate fatal airway collapse. Medical/Surgical: Ampicillin-Sulbactam 3g IV Q6H + Metronidazole and urgent transcervical incision and drainage."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;
