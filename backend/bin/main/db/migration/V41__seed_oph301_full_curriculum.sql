-- V41: Seed Ophthalmology (OPHTH-301) Full Curriculum

-- Ensure Subject: OPH-301 exists with correct title and category
INSERT INTO subjects (id, semester_id, code, title, category)
VALUES ('f8b6a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0d', 'c7d8e9f0-b1c2-3d4e-5f6a-7b8c9d0e1f2a', 'OPH-301', 'Ophthalmology', 'CLINICAL')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, category = EXCLUDED.category;

-- Unit 1: Glaucoma, IOP Dynamics & Laser Iridotomy
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa030001-0000-0000-0000-000000000001', 'f8b6a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0d', 'Glaucoma, Intraocular Pressure & Laser Iridotomy', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa030002-0000-0000-0000-000000000001', 'fa030001-0000-0000-0000-000000000001', 'POAG, C:D Ratio & ISNT Rule', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa030003-0000-0000-0000-000000000001', 'fa030002-0000-0000-0000-000000000001', 'Acute Angle-Closure Glaucoma Emergency', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa030004-0000-0000-0000-000000000001', 'fa030003-0000-0000-0000-000000000001', 'IV Mannitol, Acetazolamide & Bilateral LPI', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa030005-0000-0000-0000-000000000001', 'fa030004-0000-0000-0000-000000000001', 'Glaucoma Pathophysiology, Aqueous Dynamics and Emergency Laser Iridotomy', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa030006-0000-0000-0000-000000000001', 'fa030005-0000-0000-0000-000000000001', 'EXPLANATION', 1, 
'{"text": "### Glaucoma Pathophysiology & Management\n\nPOAG exhibits C:D ratio >0.5, ISNT rule violation, and arcuate Bjerrum scotoma treated with 1st-line Latanoprost. Acute angle-closure glaucoma presents with severe pain, halos, steamy cornea, mid-dilated fixed pupil, and IOP 50-70 mmHg, managed with IV Mannitol, Acetazolamide, and bilateral Laser Peripheral Iridotomy (LPI)."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 2: Cataracts, Phacoemulsification & Endophthalmitis
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa030001-0000-0000-0000-000000000002', 'f8b6a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0d', 'Cataracts, Phacoemulsification & Endophthalmitis', 2)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa030002-0000-0000-0000-000000000002', 'fa030001-0000-0000-0000-000000000002', 'Nuclear Sclerotic vs Posterior Subcapsular', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa030003-0000-0000-0000-000000000002', 'fa030002-0000-0000-0000-000000000002', 'Phacoemulsification & Continuous Capsulorhexis', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa030004-0000-0000-0000-000000000002', 'fa030003-0000-0000-0000-000000000002', 'Postoperative Endophthalmitis & Intravitreal Antibiotics', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa030005-0000-0000-0000-000000000002', 'fa030004-0000-0000-0000-000000000002', 'Cataract Morphologies, Ultrasonic Phacoemulsification and Endophthalmitis Protocol', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa030006-0000-0000-0000-000000000002', 'fa030005-0000-0000-0000-000000000002', 'EXPLANATION', 1, 
'{"text": "### Cataracts & Phacoemulsification\n\nNuclear cataracts cause myopic shift (second sight); posterior subcapsular cataracts result from steroid therapy causing disabling glare. Phacoemulsification uses continuous curvilinear capsulorhexis (CCC) and foldable PCIOL. Postoperative endophthalmitis (S. epidermidis) requires intravitreal Vancomycin + Ceftazidime."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 3: Slit-Lamp Biomicroscopy & Corneal Ulcers
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa030001-0000-0000-0000-000000000003', 'f8b6a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0d', 'Slit-Lamp Biomicroscopy, Microbial Keratitis & Optics', 3)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa030002-0000-0000-0000-000000000003', 'fa030001-0000-0000-0000-000000000003', 'Slit-Lamp Illumination Modes & Optical Sections', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa030003-0000-0000-0000-000000000003', 'fa030002-0000-0000-0000-000000000003', 'HSV Dendritic Ulcer vs Bacterial Hypopyon', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa030004-0000-0000-0000-000000000003', 'fa030003-0000-0000-0000-000000000003', 'Refractive Optics: Myopia, Hyperopia & Astigmatism', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa030005-0000-0000-0000-000000000003', 'fa030004-0000-0000-0000-000000000003', 'Slit-Lamp Examination, Corneal Pathology, Fluorescein Staining and Optical Principles', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa030006-0000-0000-0000-000000000003', 'fa030005-0000-0000-0000-000000000003', 'EXPLANATION', 1, 
'{"text": "### Slit-Lamp & Corneal Pathology\n\nHSV keratitis displays branching dendritic ulcers with terminal bulbs staining bright green with Fluorescein; topical steroids are strictly contraindicated. Bacterial ulcers cause hypopyon; fungal ulcers show feathery satellite lesions. Myopia is corrected with concave lenses, hyperopia with convex lenses, astigmatism with toric lenses."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 4: Retinal Vascular Emergencies & Detachments
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa030001-0000-0000-0000-000000000004', 'f8b6a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0d', 'Retinal Vascular Emergencies, CRAO, CRVO & Detachments', 4)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa030002-0000-0000-0000-000000000004', 'fa030001-0000-0000-0000-000000000004', 'CRAO Cherry-Red Spot & Boxcarring Arterioles', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa030003-0000-0000-0000-000000000004', 'fa030002-0000-0000-0000-000000000004', 'CRVO Blood and Thunder & 90-Day Glaucoma', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa030004-0000-0000-0000-000000000004', 'fa030003-0000-0000-0000-000000000004', 'Rhegmatogenous Detachment & PDR PRP Laser', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa030005-0000-0000-0000-000000000004', 'fa030004-0000-0000-0000-000000000004', 'Retinal Vascular Occlusions, Retinal Detachment and Proliferative Retinopathy', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa030006-0000-0000-0000-000000000004', 'fa030005-0000-0000-0000-000000000004', 'EXPLANATION', 1, 
'{"text": "### Retinal Emergencies & Vitreoretinal Disease\n\nCRAO causes sudden painless blindness with a cherry-red spot at the fovea surrounded by pale ischemic retina. CRVO displays dramatic blood-and-thunder hemorrhages. Rhegmatogenous retinal detachment presents with flashes, floaters, and a descending dark curtain, treated with emergency Vitrectomy. PDR requires Panretinal Photocoagulation (PRP)."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;
