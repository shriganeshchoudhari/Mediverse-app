-- V82: Seed Advanced Ophthalmology & Ocular Microsurgery (OPH-301) Full Curriculum

-- Ensure Subject: OPH-301 exists with correct title and category
INSERT INTO subjects (id, semester_id, code, title, category)
VALUES ('f1d0a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a40', 'c7d8e9f0-b1c2-3d4e-5f6a-7b8c9d0e1f2a', 'OPH-301', 'Advanced Ophthalmology & Ocular Microsurgery', 'CLINICAL')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, category = EXCLUDED.category;

-- Unit 1: Acute Angle-Closure Glaucoma & Ocular Hypertension
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa450001-0000-0000-0000-000000000001', 'f1d0a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a40', 'Acute Angle-Closure Glaucoma & Ocular Hypertension', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa450002-0000-0000-0000-000000000001', 'fa450001-0000-0000-0000-000000000001', 'Pupillary Block Pathophysiology & Fixed Mid-Dilated Oval Pupil', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa450003-0000-0000-0000-000000000001', 'fa450002-0000-0000-0000-000000000001', 'Multi-Agent Pressure Decompression: Beta-Blockers, CAIs, Osmotics & Miotics', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa450004-0000-0000-0000-000000000001', 'fa450003-0000-0000-0000-000000000001', 'Nd:YAG Laser Peripheral Iridotomy (LPI) & Bilateral Prophylaxis', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa450005-0000-0000-0000-000000000001', 'fa450004-0000-0000-0000-000000000001', 'Iridocorneal Trabecular Outflow Blockades, Iris Sphincter Ischemic Oval Mid-Dilations, Carbonic Anhydrase Secretory Suppressions, and Nd:YAG Laser Iridotomies', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa450006-0000-0000-0000-000000000001', 'fa450005-0000-0000-0000-000000000001', 'EXPLANATION', 1, 
'{"text": "### Acute Angle-Closure Glaucoma (AACG)\n\nPathophysiology: Relative pupillary block in shallow anterior chambers causing iris to occlude trabecular meshwork; IOP rises to 40-70 mmHg. Clinical signs: Steamy cornea, fixed mid-dilated oval pupil (4-6 mm), ciliary flush, severe eye pain with nausea and halos. Medical Decompression: 1. Timolol 0.5% + Apraclonidine 1% + IV Acetazolamide 500 mg. 2. IV Mannitol (1-2 g/kg). 3. Topical Pilocarpine 2% once IOP <40 mmHg. Definitive cure: Bilateral Nd:YAG Laser Peripheral Iridotomy (LPI)."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 2: Retinal Vascular Emergencies & Retinal Detachment
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa450001-0000-0000-0000-000000000002', 'f1d0a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a40', 'Retinal Vascular Emergencies & Retinal Detachment', 2)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa450002-0000-0000-0000-000000000002', 'fa450001-0000-0000-0000-000000000002', 'Central Retinal Artery Occlusion (CRAO) & Cherry-Red Foveal Spot', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa450003-0000-0000-0000-000000000002', 'fa450002-0000-0000-0000-000000000002', 'Central Retinal Vein Occlusion (CRVO), Blood and Thunder & Anti-VEGF', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa450004-0000-0000-0000-000000000002', 'fa450003-0000-0000-0000-000000000002', 'Rhegmatogenous Retinal Detachment, Shafer Tobacco Dust & Vitrectomy', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa450005-0000-0000-0000-000000000002', 'fa450004-0000-0000-0000-000000000002', 'Retinal Arterial Embolic Ischemias, Choroidal Foveal Perfusion Contrasts, Venous Stagnation Neovascular Glaucomas, and Subretinal Fluid Vitreoretinal Reattachments', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa450006-0000-0000-0000-000000000002', 'fa450005-0000-0000-0000-000000000002', 'EXPLANATION', 1, 
'{"text": "### Retinal Vascular & Vitreoretinal Emergencies\n\nCRAO: Sudden painless monocular vision loss; diffuse retinal whitening with cherry-red spot at fovea; boxcarring; emergency ocular massage and paracentesis (<90-100 min). CRVO: Blood and thunder fundus with widespread flame hemorrhages and disc edema; risk of 90-day neovascular glaucoma -> anti-VEGF (Aflibercept) + PRP. Rhegmatogenous Detachment (RRD): Flashes, floaters, curtain visual field defect, Shafer sign (tobacco dust in vitreous) -> pneumatic retinopexy, scleral buckle, or vitrectomy."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 3: Uveitis, Ocular Immunology & Infectious Retinitis
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa450001-0000-0000-0000-000000000003', 'f1d0a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a40', 'Uveitis, Ocular Immunology & Infectious Retinitis', 3)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa450002-0000-0000-0000-000000000003', 'fa450001-0000-0000-0000-000000000003', 'HLA-B27 Acute Anterior Uveitis, Ciliary Flush & Sterile Hypopyon', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa450003-0000-0000-0000-000000000003', 'fa450002-0000-0000-0000-000000000003', 'Ocular Toxoplasmosis Chorioretinitis (Headlight in the Fog)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa450004-0000-0000-0000-000000000003', 'fa450003-0000-0000-0000-000000000003', 'Cytomegalovirus (CMV) Retinitis Pizza-Pie Necrosis in Advanced HIV', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa450005-0000-0000-0000-000000000003', 'fa450004-0000-0000-0000-000000000003', 'Blood-Aqueous Barrier Leukocytic Breakdowns, Parasitic Retinochoroidal Necroses, Posterior Synechial Mydriatic Preventions, and Cytomegalovirus Ganciclovir Terminations', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa450006-0000-0000-0000-000000000003', 'fa450005-0000-0000-0000-000000000003', 'EXPLANATION', 1, 
'{"text": "### Uveitis & Ocular Immunology\n\nAnterior Uveitis: HLA-B27 associated; pain, photophobia, ciliary flush, keratic precipitates, sterile hypopyon; treated with topical Prednisolone acetate 1% + Cyclopentolate/Atropine (relieves spasm, prevents synechiae). Toxoplasmosis: Headlight in the fog focal lesion adjacent to old pigmented scar; treated with Pyrimethamine + Sulfadiazine + Leucovorin. CMV Retinitis: CD4 <50/uL; pizza-pie perivascular hemorrhages and retinal necrosis; treated with IV/oral Valganciclovir."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 4: Corneal Ulcers, Keratitis & Refractive Microsurgery
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa450001-0000-0000-0000-000000000004', 'f1d0a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a40', 'Corneal Ulcers, Keratitis & Refractive Microsurgery', 4)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa450002-0000-0000-0000-000000000004', 'fa450001-0000-0000-0000-000000000004', 'Pseudomonas Contact Lens Bacterial Keratitis & Fortified Drops', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa450003-0000-0000-0000-000000000004', 'fa450002-0000-0000-0000-000000000004', 'Herpes Simplex Virus (HSV) Dendritic Ulcers & Steroid Contraindications', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa450004-0000-0000-0000-000000000004', 'fa450003-0000-0000-0000-000000000004', 'Fungal Feathery Keratitis, Acanthamoeba Radial Infiltrates & LASIK Microsurgery', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa450005-0000-0000-0000-000000000004', 'fa450004-0000-0000-0000-000000000004', 'Pseudomonal Proteolytic Stromal Meltings, Herpes Epithelial Branching End-Bulbs, Corticosteroid Amoebic Geographic Contraindications, and Femtosecond Stromal Flap Photoablations', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa450006-0000-0000-0000-000000000004', 'fa450005-0000-0000-0000-000000000004', 'EXPLANATION', 1, 
'{"text": "### Microbial Keratitis & Refractive Surgery\n\nBacterial Keratitis: Pseudomonas in contact lens wearers with rapid melting -> fortified Vancomycin/Tobramycin. HSV Keratitis: Dendritic ulcer with terminal bulbs -> Ganciclovir/Acyclovir (TOPICAL STEROIDS STRICTLY CONTRAINDICATED). Fungal Keratitis: Vegetative trauma with feathery borders -> topical Natamycin 5%. Acanthamoeba: Contact lenses in tap water with pain out of proportion -> PHMB/Chlorhexidine. Refractive surgery: LASIK (femtosecond stromal flap + excimer laser) vs PRK (surface ablation)."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;
