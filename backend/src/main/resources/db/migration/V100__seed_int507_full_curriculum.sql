-- V100: Seed Internship Core Clinical Postings: Elective Rotations & Subspecialty Postings (INT-507) Full Curriculum

-- Ensure Subject: INT-507 exists with correct title and category
INSERT INTO subjects (id, semester_id, code, title, category)
VALUES ('f9f9a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a25', 'c9d0e1f2-b3c4-5d6e-7f8a-9b0c1d2e3f4c', 'INT-507', 'Internship Core Clinical Postings: Elective Rotations & Subspecialty Postings', 'CLINICAL')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, category = EXCLUDED.category;

-- Unit 1: Inpatient Dermatology & Dermatologic Emergencies
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa640001-0000-0000-0000-000000000001', 'f9f9a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a25', 'Inpatient Dermatology & Dermatologic Emergencies', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa640002-0000-0000-0000-000000000001', 'fa640001-0000-0000-0000-000000000001', 'Stevens-Johnson Syndrome (SJS) vs TEN & SCORTEN Prognostication', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa640003-0000-0000-0000-000000000001', 'fa640002-0000-0000-0000-000000000001', 'Burn ICU Barrier Nursing, High-Dose IVIG & Cyclosporine Therapy', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa640004-0000-0000-0000-000000000001', 'fa640003-0000-0000-0000-000000000001', 'Exfoliative Erythroderma (>90% TBSA) Systemic Complications & Sepsis', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa640005-0000-0000-0000-000000000001', 'fa640004-0000-0000-0000-000000000001', 'Epidermolytic Necrolyses, Keratinocyte Apoptoses, Scortenian Stratifications, and Calcineurinic Immunomodulations', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa640006-0000-0000-0000-000000000001', 'fa640005-0000-0000-0000-000000000001', 'EXPLANATION', 1, 
'{"text": "### Inpatient Dermatology & SJS/TEN\n\nSJS/TEN Spectrum: SJS (<10% TBSA) vs SJS/TEN overlap (10-30%) vs TEN (>30% TBSA detachment with positive Nikolsky sign). SCORTEN: Age >=40, malignancy, TBSA >=10%, urea >10, glucose >14, bicarb <20, HR >=120. Score >=5 confers >90% mortality. Emergency Management: Immediate drug withdrawal, Burn ICU barrier nursing, IVIG (1-2 g/kg over 3-4 days) or Cyclosporine (3-5 mg/kg/d), non-adherent dressings without debridement, and proactive ophthalmology amniotic membrane care. Erythroderma: >90% TBSA erythema/scaling with high-output failure risk."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 2: Emergency Psychiatry & Neuroleptic Malignant Syndrome
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa640001-0000-0000-0000-000000000002', 'f9f9a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a25', 'Emergency Psychiatry & Neuroleptic Malignant Syndrome', 2)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa640002-0000-0000-0000-000000000002', 'fa640001-0000-0000-0000-000000000002', 'Neuroleptic Malignant Syndrome (Lead-Pipe Rigidity & Dantrolene)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa640003-0000-0000-0000-000000000002', 'fa640002-0000-0000-0000-000000000002', 'Serotonin Syndrome (Hunter Criteria Clonus & Cyproheptadine)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa640004-0000-0000-0000-000000000002', 'fa640003-0000-0000-0000-000000000002', 'Acute Agitation Rapid Tranquilization (B52 Protocol) & Suicide Triage', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa640005-0000-0000-0000-000000000002', 'fa640004-0000-0000-0000-000000000002', 'Striatal Dopaminergic Depletions, Sarcoplasmic Dantrolenic Calmodulations, Serotonergic Hyperreflexic Cloni, and Parenteral Behavioral Containments', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa640006-0000-0000-0000-000000000002', 'fa640005-0000-0000-0000-000000000002', 'EXPLANATION', 1, 
'{"text": "### Emergency Psychiatry (NMS & Serotonin Syndrome)\n\nNMS vs Serotonin Syndrome: NMS is triggered by D2 antagonists, presenting with severe ''lead-pipe'' rigidity, hyporeflexia, hyperthermia, and massive CK elevation (>10k); treat by stopping neuroleptics + IV Dantrolene (1-2.5 mg/kg) + Bromocriptine. Serotonin Syndrome is triggered by serotonergic agents, presenting with hyperreflexia, inducible/ocular clonus, and tremor; treat with Benzodiazepines + Cyproheptadine (12mg load). Rapid Tranquilization: IM Haloperidol 5mg + Lorazepam 2mg + Diphenhydramine 50mg (''B52'') for violent agitation."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 3: Ophthalmic Emergencies: Acute Angle-Closure Glaucoma & CRAO
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa640001-0000-0000-0000-000000000003', 'f9f9a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a25', 'Ophthalmic Emergencies: Acute Angle-Closure Glaucoma & CRAO', 3)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa640002-0000-0000-0000-000000000003', 'fa640001-0000-0000-0000-000000000003', 'Acute Angle-Closure Glaucoma (IOP 40-70 mmHg & Steamy Cornea)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa640003-0000-0000-0000-000000000003', 'fa640002-0000-0000-0000-000000000003', 'Emergency Medical IOP Cocktail & Pilocarpine 2% Dosing Rule', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa640004-0000-0000-0000-000000000003', 'fa640003-0000-0000-0000-000000000003', 'Bilateral Laser Peripheral Iridotomy & CRAO Cherry-Red Spot', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa640005-0000-0000-0000-000000000003', 'fa640004-0000-0000-0000-000000000003', 'Pupillary Block Hydrodynamics, Carbonic Anhydrase Secretory Suppressions, Osmotic Vitreal Dehydrations, and Retinal Ischemic Cherry Spots', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa640006-0000-0000-0000-000000000003', 'fa640005-0000-0000-0000-000000000003', 'EXPLANATION', 1, 
'{"text": "### Ophthalmic Emergencies (Glaucoma & CRAO)\n\nAcute Angle-Closure Glaucoma: Severe pain, haloes, steamy cornea, fixed mid-dilated pupil, IOP 40-70 mmHg. Emergency IOP Cocktail: IV Acetazolamide 500mg + topical Timolol 0.5% + Apraclonidine 1% + IV Mannitol 20% (1-2 g/kg). Administer topical Pilocarpine 2% ONLY after IOP drops <40 mmHg (ischemic iris sphincter unresponsive at higher pressures). Definitive: Bilateral Laser Peripheral Iridotomy (LPI). Central Retinal Artery Occlusion: Sudden painless vision loss, milky-white retina with foveal cherry-red spot; emergency ocular massage within <4-6 hours."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 4: Otorhinolaryngology Emergencies: Severe Epistaxis & Quinsy Airway Triage
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa640001-0000-0000-0000-000000000004', 'f9f9a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a25', 'Otorhinolaryngology Emergencies: Severe Epistaxis & Quinsy Airway Triage', 4)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa640002-0000-0000-0000-000000000004', 'fa640001-0000-0000-0000-000000000004', 'Kiesselbach Anterior (90%) vs Woodruff Posterior (10%) Epistaxis', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa640003-0000-0000-0000-000000000004', 'fa640002-0000-0000-0000-000000000004', 'Posterior Balloon Packing (Continuous SpO2 & TSS Antibiotic Prophylaxis)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa640004-0000-0000-0000-000000000004', 'fa640003-0000-0000-0000-000000000004', 'Peritonsillar Abscess (Quinsy) Guarded Needle Aspiration & I&D', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa640005-0000-0000-0000-000000000004', 'fa640004-0000-0000-0000-000000000004', 'Septal Anastomotic Tamponades, Sphenopalatine Retrochoanal Packings, Peritonsillar Cryptic Suppurations, and Guarded Carotid Needle Evacuations', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa640006-0000-0000-0000-000000000004', 'fa640005-0000-0000-0000-000000000004', 'EXPLANATION', 1, 
'{"text": "### ENT Emergencies (Epistaxis & Quinsy)\n\nEpistaxis: Anterior (90% Kiesselbach plexus on nasal septum; direct pinch + silver nitrate cautery) vs Posterior (10% Woodruff plexus / sphenopalatine artery; dual-balloon posterior catheter). Posterior packing mandates hospital admission with continuous pulse oximetry (nasopulmonary reflex) and oral Augmentin to prevent Toxic Shock Syndrome. Peritonsillar Abscess (Quinsy): Unilateral throat pain, hot potato voice, trismus, and contralateral uvular deviation. Aspirate with a guarded 19G needle (leaving only 1 cm exposed to protect internal carotid artery) + IV Ampicillin-Sulbactam + Dexamethasone."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;
