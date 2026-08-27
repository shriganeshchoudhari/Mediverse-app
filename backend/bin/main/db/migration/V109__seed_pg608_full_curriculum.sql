-- V109: Seed Postgraduate Advanced Ophthalmology, Vitreoretinal Surgery & Neuro-Ophthalmology (PG-608) Full Curriculum

-- Ensure Subject: PG-608 exists with correct title and category
INSERT INTO subjects (id, semester_id, code, title, category)
VALUES ('f9f9a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a34', 'd0e1f2a3-c4d5-6e7f-8a9b-0c1d2e3f4a5b', 'PG-608', 'Postgraduate Advanced Ophthalmology, Vitreoretinal Surgery & Neuro-Ophthalmology', 'CLINICAL')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, category = EXCLUDED.category;

-- Unit 1: Rhegmatogenous Retinal Detachment (RRD) & Pars Plana Vitrectomy Protocols
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa730001-0000-0000-0000-000000000001', 'f9f9a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a34', 'Rhegmatogenous Retinal Detachment (RRD) & Pars Plana Vitrectomy Protocols', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa730002-0000-0000-0000-000000000001', 'fa730001-0000-0000-0000-000000000001', 'Lincoff Rules for Primary Retinal Break Localization', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa730003-0000-0000-0000-000000000001', 'fa730002-0000-0000-0000-000000000001', '23G/25G Pars Plana Vitrectomy, Fluid-Air Exchange & Endolaser', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa730004-0000-0000-0000-000000000001', 'fa730003-0000-0000-0000-000000000001', 'Endotamponade Pharmacodynamics (SF6, C3F8 & Silicone Oil Longevity)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa730005-0000-0000-0000-000000000001', 'fa730004-0000-0000-0000-000000000001', 'Lincoff Break Localizations, Vitreous Shaving Dynamics, Perfluoropropane Gas Endotamponades, and Prone Postoperative Convalescences', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa730006-0000-0000-0000-000000000001', 'fa730005-0000-0000-0000-000000000001', 'EXPLANATION', 1, 
'{"text": "### Rhegmatogenous Retinal Detachment & PPV\n\nPathophysiology: Dynamic vitreoretinal traction from PVD produces full-thickness breaks (horseshoe tears, giant tears >90 deg), allowing liquefied vitreous into subretinal space. Lincoff Rules: (1) Superior RRD crossing vertical meridian: primary break within 1.5 clock hours of 12 o clock; (2) Inferior asymmetric RRD: break located on the higher side; (3) Inferior symmetrical RRD: break at 6 o clock. Surgical Technique: 23G/25G Pars Plana Vitrectomy (PPV) with vitreous base shaving, fluid-air exchange (FAX), 360-degree laser retinopexy around tears. Endotamponade Selection: 20% SF6 (non-expansile, lasts 10-14 days for superior breaks); 14% C3F8 (non-expansile, lasts 6-8 weeks for inferior tears, giant tears, or PVR); Silicone oil (1000-5000 cSt, non-absorbable long-term tamponade for severe PVR Grade C or air travel). Strict prone/face-down positioning aligns gas buoyancy against tears."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 2: Neovascular AMD, Diabetic Macular Edema & Anti-VEGF Therapeutics
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa730001-0000-0000-0000-000000000002', 'f9f9a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a34', 'Neovascular AMD, Diabetic Macular Edema & Anti-VEGF Therapeutics', 2)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa730002-0000-0000-0000-000000000002', 'fa730001-0000-0000-0000-000000000002', 'Macular Neovascularization (Type 1 Sub-RPE, Type 2 Subretinal, Type 3 RAP)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa730003-0000-0000-0000-000000000002', 'fa730002-0000-0000-0000-000000000002', 'Optical Coherence Tomography (OCT) Biomarkers (SRF, IRF & CST)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa730004-0000-0000-0000-000000000002', 'fa730003-0000-0000-0000-000000000002', 'Bispecific Dual Ang-2 / VEGF-A Neutralization (Faricimab Durability)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa730005-0000-0000-0000-000000000002', 'fa730004-0000-0000-0000-000000000002', 'Choroidal Neovascularization Typologies, Subretinal Hyperreflective Materials, Faricimab Bispecific Neutralizations, and Treat-and-Extend Protocols', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa730006-0000-0000-0000-000000000002', 'fa730005-0000-0000-0000-000000000002', 'EXPLANATION', 1, 
'{"text": "### Neovascular AMD & Anti-VEGF Therapeutics\n\nMacular Neovascularization (MNV) Subtypes: Type 1 (Occult, sub-RPE neovascularization, fibrovascular PED); Type 2 (Classic, subretinal neovascularization extending above RPE into subretinal space, SHRM); Type 3 (Retinal Angiomatous Proliferation RAP, intraretinal neovascularization). Diabetic Macular Edema (DME): Pericyte loss, blood-retinal barrier breakdown, intraretinal cystoid fluid (IRF), subretinal fluid (SRF), CST >350 um. Molecular Therapeutics: (1) Faricimab (6.0 mg): first dual bispecific antibody targeting both VEGF-A and Angiopoietin-2 (Ang-2), stabilizing endothelial pericytes and extending treatment intervals up to Q16 weeks (every 4 months); (2) Aflibercept (2.0 mg / 8.0 mg HD): decoy receptor binding VEGF-A, VEGF-B, PlGF; (3) Ranibizumab (0.5 mg): monoclonal Fab fragment against VEGF-A. Treat-and-Extend protocols titrate injection intervals based on complete fluid dryness on OCT."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 3: Acute Angle-Closure Glaucoma (AACG) Crisis & Laser Iridotomy Protocols
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa730001-0000-0000-0000-000000000003', 'f9f9a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a34', 'Acute Angle-Closure Glaucoma (AACG) Crisis & Laser Iridotomy Protocols', 3)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa730002-0000-0000-0000-000000000003', 'fa730001-0000-0000-0000-000000000003', 'Pupillary Block Mechanism, Iris Bombe & Hyperopic Anatomical Predisposition', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa730003-0000-0000-0000-000000000003', 'fa730002-0000-0000-0000-000000000003', 'Medical Decompression Bundle (IV Mannitol, Acetazolamide & Topical Suppressants)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa730004-0000-0000-0000-000000000003', 'fa730003-0000-0000-0000-000000000003', 'Nd:YAG Laser Peripheral Iridotomy (LPI) & Mandatory Fellow-Eye Prophylaxis', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa730005-0000-0000-0000-000000000003', 'fa730004-0000-0000-0000-000000000003', 'Relative Pupillary Block Pathophysiology, Hyperosmotic Vitreous Dehydrations, Sphincter Ischemia Manometries, and Bilateral Laser Peripheral Iridotomies', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa730006-0000-0000-0000-000000000003', 'fa730005-0000-0000-0000-000000000003', 'EXPLANATION', 1, 
'{"text": "### Acute Angle-Closure Glaucoma & Laser Iridotomy\n\nPupillary Block Pathophysiology: In eyes with shallow AC (<2.5 mm) and hyperopia, mid-dilation (4-5 mm in dim light) maximizes iris-lens contact, trapping aqueous in posterior chamber. Pressure bows iris forward (Iris Bombe), closing trabecular meshwork (Shaffer Grade 0) -> IOP skyrockets to 50-80 mmHg. Clinical Signs: Severe ocular pain, brow ache, nausea/vomiting, colored halos, fixed mid-dilated pupil, steamy corneal edema. Medical Resuscitation: (1) IV 20% Mannitol (1.0-1.5 g/kg) hyperosmotically dehydrates vitreous; (2) IV/PO Acetazolamide 500 mg suppresses aqueous production; (3) Topical Timolol 0.5%, Brimonidine 0.2%, Dorzolamide 2%; (4) Topical Pilocarpine 1-2% only after IOP <40-50 mmHg (sphincter is ischemic at higher pressures). Definitive Laser Surgery: Nd:YAG Laser Peripheral Iridotomy (LPI) at 11 or 1 o clock creates permanent bypass. Mandatory Rule: Contralateral fellow eye has a 50% lifetime risk of angle closure; prophylactic LPI to fellow eye is mandatory."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 4: Neuro-Ophthalmology: Giant Cell Arteritis (GCA), AION & Optic Neuritis
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa730001-0000-0000-0000-000000000004', 'f9f9a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a34', 'Neuro-Ophthalmology: Giant Cell Arteritis (GCA), AION & Optic Neuritis', 4)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa730002-0000-0000-0000-000000000004', 'fa730001-0000-0000-0000-000000000004', 'Arteritic A-AION vs Non-Arteritic NAION (Crowded Disc at Risk)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa730003-0000-0000-0000-000000000004', 'fa730002-0000-0000-0000-000000000004', 'Giant Cell Arteritis Protocols (High-Dose IV Steroids & Temporal Artery Biopsy)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa730004-0000-0000-0000-000000000004', 'fa730003-0000-0000-0000-000000000004', 'Demyelinating Optic Neuritis & ONTT Trial Rules (Oral Steroid Contraindication)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa730005-0000-0000-0000-000000000004', 'fa730004-0000-0000-0000-000000000004', 'Posterior Ciliary Vasculitides, Jaw Claudication Pathognomonics, Temporal Artery Biopsy Lengths, and ONTT Trial Steroid Contradictions', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa730006-0000-0000-0000-000000000004', 'fa730005-0000-0000-0000-000000000004', 'EXPLANATION', 1, 
'{"text": "### Neuro-Ophthalmology: GCA, AION & Optic Neuritis\n\nArteritic A-AION (Giant Cell Arteritis): Vasculitis of posterior ciliary arteries in elderly (>60y). Systemic features: jaw claudication (pathognomonic), scalp tenderness, polymyalgia rheumatica (PMR). Exam: profound vision loss (CF/HM/LP), chalky white pallid disc edema, RAPD. Labs: ESR >50-100 mm/hr, CRP >2.5 mg/dL. Emergency Protocol: Immediate High-Dose IV Methylprednisolone (1 g/day x 3 days) without waiting for Temporal Artery Biopsy (TAB >=2 cm) to protect contralateral fellow eye from devastating bilateral blindness. Non-Arteritic AION (NAION): Nocturnal hypotension in crowded disc (cup-to-disc <0.1 / disc at risk), altitudinal field defect, normal ESR/CRP. Demyelinating Optic Neuritis (ONTT Trial): Young adults (20-40y, MS association); subacute monocular vision loss, pain with eye movements (90%), Marcus Gunn RAPD. Treatment: IV Methylprednisolone (1 g/day x 3 days) -> oral taper. STRICT CONTRAINDICATION: Oral Prednisone monotherapy alone is strictly contraindicated because the ONTT trial proved it DOUBLES the recurrence rate of optic neuritis!"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;
