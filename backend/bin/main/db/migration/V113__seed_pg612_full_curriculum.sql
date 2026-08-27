-- V113: Seed Postgraduate Advanced Nuclear Medicine, Theranostics & Radioligand Oncology (PG-612) Full Curriculum

-- Ensure Subject: PG-612 exists with correct title and category
INSERT INTO subjects (id, semester_id, code, title, category)
VALUES ('f9f9a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a38', 'd0e1f2a3-c4d5-6e7f-8a9b-0c1d2e3f4a5b', 'PG-612', 'Postgraduate Advanced Nuclear Medicine, Theranostics & Radioligand Oncology', 'CLINICAL')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, category = EXCLUDED.category;

-- Unit 1: Theranostics Paradigm, PSMA PET Staging & Lu-177 Vipivotide Tetraxetan
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa770001-0000-0000-0000-000000000001', 'f9f9a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a38', 'Theranostics Paradigm, PSMA PET Staging & Lu-177 Vipivotide Tetraxetan', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa770002-0000-0000-0000-000000000001', 'fa770001-0000-0000-0000-000000000001', 'PSMA Molecular Target Biology & Diagnostic Ga-68/F-18 PET Imaging', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa770003-0000-0000-0000-000000000001', 'fa770002-0000-0000-0000-000000000001', 'VISION Trial Eligibility Criteria & FDG-PSMA Discordant Biology', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa770004-0000-0000-0000-000000000001', 'fa770003-0000-0000-0000-000000000001', 'Lu-177 Pluvicto Beta-RLT Administration & Ac-225 Targeted Alpha Therapy', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa770005-0000-0000-0000-000000000001', 'fa770004-0000-0000-0000-000000000001', 'Theranostics Paradigm, PSMA PET Staging, Lu-177 Vipivotide Tetraxetan & Alpha-Radioligand Protocols', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa770006-0000-0000-0000-000000000001', 'fa770005-0000-0000-0000-000000000001', 'EXPLANATION', 1, 
'{"text": "### PSMA Theranostics & Lu-177 Pluvicto\n\nTheranostic Paradigm: Pairs diagnostic PET imaging (68Ga-PSMA-11 or 18F-DCFPyL) with targeted beta/alpha particulate radioimmunotherapy. Prostate-Specific Membrane Antigen (PSMA) is a transmembrane glutamate carboxypeptidase II upregulated 100-1000 fold in mCRPC.\n\nVISION Trial & Patient Selection: Indicated for progressive mCRPC post-ARPI (abiraterone/enzalutamide) and taxane chemotherapy. Key imaging eligibility: Tumor lesion PSMA uptake greater than normal liver parenchyma (SUVmax > liver mean). Discordant lesions (PSMA negative but 18F-FDG positive) represent dedifferentiated or neuroendocrine clones with primary resistance.\n\nLu-177 Vipivotide Tetraxetan (Pluvicto): Administered at 7.4 GBq (200 mCi) IV every 6 weeks for up to 6 cycles. 177Lu emits medium-energy beta particles (Emax 0.498 MeV; tissue path length 1-2 mm) with physical half-life t1/2 = 6.65 days. Toxicities: Xerostomia (salivary gland non-target uptake; manage with cryotherapy cooling packs), myelosuppression (Grade 3-4 anemia 13%, thrombocytopenia 8%), and renal monitoring (BED <= 23 Gy). Targeted Alpha Therapy (Ac-225 PSMA-617): Ultra-high LET (~100 keV/um) delivering lethal double-strand DNA cluster breaks over 40-100 um to overcome beta resistance."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 2: Peptide Receptor Radionuclide Therapy (PRRT) & Lu-177 DOTATATE Protocols
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa770001-0000-0000-0000-000000000002', 'f9f9a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a38', 'Peptide Receptor Radionuclide Therapy (PRRT) & Lu-177 DOTATATE Protocols', 2)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa770002-0000-0000-0000-000000000002', 'fa770001-0000-0000-0000-000000000002', 'Somatostatin Receptor Subtype 2 (SSTR2) & Krenning Staging Criteria', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa770003-0000-0000-0000-000000000002', 'fa770002-0000-0000-0000-000000000002', 'NETTER-1 Trial Regimen & Lu-177 Oxodotreotide Administration', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa770004-0000-0000-0000-000000000002', 'fa770003-0000-0000-0000-000000000002', 'Megalin-Cubilin Amino Acid Radioprotection & Carcinoid Crisis Rescue', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa770005-0000-0000-0000-000000000002', 'fa770004-0000-0000-0000-000000000002', 'Peptide Receptor Radionuclide Therapy (PRRT), Lu-177 DOTATATE, SSTR2 Biology & Renal Amino Acid Protection', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa770006-0000-0000-0000-000000000002', 'fa770005-0000-0000-0000-000000000002', 'EXPLANATION', 1, 
'{"text": "### PRRT Lu-177 DOTATATE for Neuroendocrine Tumors\n\nSSTR2 Overexpression: Somatostatin receptor subtype 2 is highly expressed on well-differentiated GEP-NETs (Grade 1/2, Ki-67 <= 20%). Diagnostic staging with 68Ga-DOTATATE (Netspot) or 64Cu-DOTATATE (Detectnet) requires Krenning score >= Grade 3 (uptake > liver) or Grade 4 (uptake > spleen) for PRRT qualification.\n\nNETTER-1 Protocol: 177Lu-oxodotreotide (Lutathera) 7.4 GBq (200 mCi) IV every 8 weeks for 4 cycles (cumulative 29.6 GBq / 800 mCi). Discontinue long-acting somatostatin analogs (Octreotide LAR) for 4-6 weeks prior to prevent receptor competition.\n\nRenal Radioprotection: Radiopeptides filtered at glomerulus are reabsorbed via megalin and cubilin endocytic receptors in proximal tubules. Mandatory co-infusion of positive amino acid solution (2.5% L-lysine and 2.5% L-arginine in 1L NS over 4 hours starting 30-60 min pre-infusion) competitively saturates megalin/cubilin, reducing renal cortical absorbed dose by 40-60%.\n\nHigh-Yield Complications: Acute carcinoid crisis (tumor lysis releasing massive serotonin/bradykinin -> hypotension, bronchospasm, flush; treat immediately with IV Octreotide 100-500 ug bolus + infusion) and secondary myeloid neoplasms (t-MDS / t-AML lifetime risk 1.5-2.0%)."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 3: Thyroid Oncology, I-131 Radioactive Iodine Ablation & Recombinant TSH
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa770001-0000-0000-0000-000000000003', 'f9f9a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a38', 'Thyroid Oncology, I-131 Radioactive Iodine Ablation & Recombinant TSH', 3)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa770002-0000-0000-0000-000000000003', 'fa770001-0000-0000-0000-000000000003', 'Sodium-Iodide Symporter (NIS) Kinetics & I-131 Decay Radiobiology', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa770003-0000-0000-0000-000000000003', 'fa770002-0000-0000-0000-000000000003', 'ATA Recurrence Risk Stratification & Remnant Ablation Dosing', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa770004-0000-0000-0000-000000000003', 'fa770003-0000-0000-0000-000000000003', 'rhTSH Thyrogen Stimulation, NRC Release Criteria & Redifferentiation', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa770005-0000-0000-0000-000000000003', 'fa770004-0000-0000-0000-000000000003', 'Differentiated Thyroid Cancer, I-131 Radioactive Iodine Remnant Ablation, rhTSH & Radiation Safety', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa770006-0000-0000-0000-000000000003', 'fa770005-0000-0000-0000-000000000003', 'EXPLANATION', 1, 
'{"text": "### Thyroid Cancer & I-131 Radioactive Iodine Ablation\n\nSodium-Iodide Symporter (NIS): Basolateral transmembrane symporter cotransporting 2 Na+ and 1 I- into thyroid follicular cells. I-131 decay: beta emission (Emax 0.606 MeV; tissue depth 0.8 mm) provides cell death; 364 keV gamma photon allows whole-body scintigraphy (t1/2 = 8.02 days).\n\nATA Risk-Stratified Dosing Post-Thyroidectomy: (1) Low Risk (<=4 cm, N0, no ETE): RAI not routinely indicated (selective ablation 30 mCi); (2) Intermediate Risk (microscopic ETE, N1, aggressive histology): Remnant ablation / adjuvant therapy 30-100 mCi (1.1-3.7 GBq); (3) High Risk (gross T4 invasion, R2 resection, distant M1): Therapeutic RAI 100-200 mCi (3.7-7.4 GBq).\n\nTSH Stimulation: Requires TSH > 30 mIU/L. Method A: Levothyroxine withdrawal x 4-6 weeks (causes severe hypothyroidism); Method B (preferred): Recombinant human TSH (rhTSH / Thyrogen 0.9 mg IM on Days 1 and 2, 131-I on Day 3) maintains euthyroid status with equivalent ablation efficacy (ESTIMABL1 / HiLo trials). Combine with 2-week Low-Iodine Diet (<50 ug/day).\n\nNRC Release Criteria (10 CFR 35.75): Patient released when dose rate at 1m <= 7.0 mrem/hr or retained activity < 33 mCi. Salivary protection: start sour lemon candies at 24 hours post-dose. RAI-Refractory redifferentiation: BRAF/MEK inhibitors (Dabrafenib/Trametinib) restore NIS basolateral expression."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 4: Nuclear Cardiology, Myocardial Perfusion SPECT/PET & Radiation Physics
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa770001-0000-0000-0000-000000000004', 'f9f9a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a38', 'Nuclear Cardiology, Myocardial Perfusion SPECT/PET & Radiation Physics', 4)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa770002-0000-0000-0000-000000000004', 'fa770001-0000-0000-0000-000000000004', 'SPECT Sestamibi / Tetrofosmin vs PET Rb-82 & Coronary Flow Reserve', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa770003-0000-0000-0000-000000000004', 'fa770002-0000-0000-0000-000000000004', 'Bruce Treadmill Exercise vs Regadenoson Pharmacologic Stress', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa770004-0000-0000-0000-000000000004', 'fa770003-0000-0000-0000-000000000004', 'Polar Map Perfusion Defect Patterns & ALARA Health Physics Regulations', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa770005-0000-0000-0000-000000000004', 'fa770004-0000-0000-0000-000000000004', 'Nuclear Cardiology, Myocardial Perfusion SPECT/PET, Regadenoson Stress & Radiation Health Physics', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa770006-0000-0000-0000-000000000004', 'fa770005-0000-0000-0000-000000000004', 'EXPLANATION', 1, 
'{"text": "### Nuclear Cardiology & Radiation Dosimetry\n\nRadiopharmaceuticals: 99mTc-Sestamibi (Cardiolite) passively diffuses and binds mitochondrial inner membrane; minimal redistribution. 201Tl-Chloride is a K+ analogue actively pumped via Na+/K+ ATPase with continuous dynamic redistribution. PET MPI with 82Rb-Chloride (t1/2 75s) or 13N-Ammonia (t1/2 10 min) enables absolute quantification of Myocardial Blood Flow (MBF) and Coronary Flow Reserve (CFR = Stress MBF / Rest MBF; normal > 2.5, < 2.0 indicates multivessel CAD or microvascular dysfunction).\n\nStress Modalities: (1) Bruce Exercise: Target >= 85% maximal predicted heart rate; (2) Regadenoson (Lexiscan 0.4 mg IV push): Selective A2A adenosine agonist inducing coronary hyperemia with minimal A1/A2B/A3 bronchospasm. Reversal agent: Aminophylline 100-200 mg IV slow push. LBBB Rule: Patients with LBBB or paced rhythm must undergo pharmacologic vasodilator stress (not exercise/dobutamine) to prevent false-positive septal perfusion defects. Caffeine abstinence for >=12-24 hours mandatory.\n\nScintigraphic Interpretation: Reversible defect (stress defect + rest normal = inducible ischemia); Fixed defect (stress defect + rest defect = infarct scar); Soft tissue attenuation artifact (gated wall motion and thickening normal).\n\nHealth Physics & ALARA: Cardinal principles: Time, Distance (inverse square law I2 = I1 * [d1/d2]^2), Shielding (lead for gamma, low-Z plastic/acrylic for beta to prevent Bremsstrahlung). NRC Annual Occupational Limits (10 CFR 20): Whole body TEDE <= 50 mSv/year (5 rem/year); Lens <= 150 mSv/year; Extremities <= 500 mSv/year."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;
