-- V74: Seed Clinical Pharmacology & Rational Therapeutics (PHARM-301) Full Curriculum

-- Ensure Subject: PHARM-301 exists with correct title and category
INSERT INTO subjects (id, semester_id, code, title, category)
VALUES ('f1d0a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a32', 'c7d8e9f0-b1c2-3d4e-5f6a-7b8c9d0e1f2a', 'PHARM-301', 'Clinical Pharmacology & Rational Therapeutics', 'CLINICAL')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, category = EXCLUDED.category;

-- Unit 1: Pharmacokinetics, Therapeutic Drug Monitoring & Non-Linear Elimination
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa360001-0000-0000-0000-000000000001', 'f1d0a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a32', 'Pharmacokinetics, Therapeutic Drug Monitoring & Non-Linear Elimination', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa360002-0000-0000-0000-000000000001', 'fa360001-0000-0000-0000-000000000001', 'Vancomycin (AUC24/MIC >=400) & Aminoglycoside Once-Daily Dosing', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa360003-0000-0000-0000-000000000001', 'fa360002-0000-0000-0000-000000000001', 'Digoxin (0.5-0.9 ng/mL & DigiFab) and Lithium Renal Clearances', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa360004-0000-0000-0000-000000000001', 'fa360003-0000-0000-0000-000000000001', 'Phenytoin Zero-Order Michaelis-Menten Saturation & Cerebellar Ataxia', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa360005-0000-0000-0000-000000000001', 'fa360004-0000-0000-0000-000000000001', 'Concentration-Dependent Post-Antibiotic Bactericidals, Glycopeptide Nephrotoxic Trough Reductions, Sodium-Potassium ATPase Glycoside Reversals, and Hepatic Capacity-Limited Saturation Kinetics', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa360006-0000-0000-0000-000000000001', 'fa360005-0000-0000-0000-000000000001', 'EXPLANATION', 1, 
'{"text": "### Therapeutic Drug Monitoring & Kinetics\n\nVancomycin: Target AUC24/MIC >= 400-600 mg*h/L (reduces AKI vs static troughs). Aminoglycosides: Concentration-dependent killing (Cmax/MIC >= 8-10) via high-dose once-daily (5-7 mg/kg) ensuring trough <1 mcg/mL to prevent ATN/ototoxicity. Digoxin: 0.5-0.9 ng/mL in CHF (hypokalemia increases toxicity) -> DigiFab. Lithium: 0.6-1.2 mEq/L (thiazides/NSAIDs trigger toxicity) -> Hemodialysis. Phenytoin: Michaelis-Menten zero-order saturation at therapeutic levels (10-20 mcg/mL) -> small dose increase causes exponential surge and cerebellar ataxia/nystagmus."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 2: Antimicrobial Stewardship, Beta-Lactamases & Multidrug Resistance
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa360001-0000-0000-0000-000000000002', 'f1d0a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a32', 'Antimicrobial Stewardship, Beta-Lactamases & Multidrug Resistance', 2)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa360002-0000-0000-0000-000000000002', 'fa360001-0000-0000-0000-000000000002', 'MRSA mecA PBP2a & Daptomycin Surfactant Inactivation (Warning in Pneumonia)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa360003-0000-0000-0000-000000000002', 'fa360002-0000-0000-0000-000000000002', 'ESBL (Meropenem) and Carbapenem-Resistant Enterobacteriaceae (CRE)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa360004-0000-0000-0000-000000000002', 'fa360003-0000-0000-0000-000000000002', 'Pseudomonas Aeruginosa Dual Regimens & Novel Diazabicyclooctane Inhibitors', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa360005-0000-0000-0000-000000000002', 'fa360004-0000-0000-0000-000000000002', 'Penicillin-Binding Protein Allosteric Mutations, Pulmonary Surfactant Lipopeptide Neutralizations, Extended-Spectrum Hydrolysis Resistances, and Non-Beta-Lactam Diazabicyclooctane Inactivations', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa360006-0000-0000-0000-000000000002', 'fa360005-0000-0000-0000-000000000002', 'EXPLANATION', 1, 
'{"text": "### Antimicrobial Stewardship & Resistance\n\nMRSA: mecA gene encodes PBP2a -> Vancomycin, Linezolid, Ceftaroline. DAPTOMYCIN IS INACTIVATED BY PULMONARY SURFACTANT -> CONTRAINDICATED IN MRSA PNEUMONIA! ESBL: Hydrolyzes 3rd-gen cephalosporins -> Carbapenems (Meropenem) are drugs of choice. CRE (KPC/NDM-1): Hydrolyzes carbapenems -> Ceftazidime-Avibactam or Meropenem-Vaborbactam. Pseudomonas: Antipseudomonal beta-lactam (Pip-Tazo, Cefepime, Meropenem) +/- Aminoglycoside/Cipro in severe sepsis."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 3: Anticoagulation, Direct Oral Anticoagulants & Specific Antidotes
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa360001-0000-0000-0000-000000000003', 'f1d0a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a32', 'Anticoagulation, Direct Oral Anticoagulants & Specific Antidotes', 3)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa360002-0000-0000-0000-000000000003', 'fa360001-0000-0000-0000-000000000003', 'Direct Thrombin Inhibitor Dabigatran & Idarucizumab (Praxbind 5g IV)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa360003-0000-0000-0000-000000000003', 'fa360002-0000-0000-0000-000000000003', 'Factor Xa Inhibitors (Apixaban/Rivaroxaban) & Andexanet Alfa Decoy Reversal', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa360004-0000-0000-0000-000000000003', 'fa360003-0000-0000-0000-000000000003', 'Warfarin 4-Factor PCC (Kcentra) + IV Vitamin K & Protamine Sulfate for Heparin', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa360005-0000-0000-0000-000000000003', 'fa360004-0000-0000-0000-000000000003', 'Humanized Monoclonal Fab Neutralizations, Catalytically Inactive Decoy Factor Sequestrations, Unactivated Clotting Factor Replacements, and Electrostatic Heparin-Protamine Neutralizations', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa360006-0000-0000-0000-000000000003', 'fa360005-0000-0000-0000-000000000003', 'EXPLANATION', 1, 
'{"text": "### Anticoagulation & Targeted Reversal\n\nDabigatran (Direct IIa): Specific reversal with IDARUCIZUMAB (Praxbind 5g IV, humanized Fab with 350x higher affinity than thrombin). Factor Xa Inhibitors (Apixaban/Rivaroxaban): Reversal with ANDEXANET ALFA (recombinant decoy FXa protein) or 4-Factor PCC. Warfarin (VKORC1): 4-Factor PCC (Kcentra with II, VII, IX, X) + IV Vitamin K (10mg). Heparin: Protamine Sulfate (1mg per 100U UFH; partial ~60% reversal for LMWH)."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 4: Chemotherapeutic Toxicities, Targeted Biologics & Rescue Pharmacotherapy
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa360001-0000-0000-0000-000000000004', 'f1d0a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a32', 'Chemotherapeutic Toxicities, Targeted Biologics & Rescue Pharmacotherapy', 4)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa360002-0000-0000-0000-000000000004', 'fa360001-0000-0000-0000-000000000004', 'Anthracycline Cardiotoxicity & Dexrazoxane (Iron Chelation Cardioprotection)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa360003-0000-0000-0000-000000000004', 'fa360002-0000-0000-0000-000000000004', 'Cisplatin Nephro/Ototoxicity (Amifostine) & Bleomycin Pulmonary Fibrosis', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa360004-0000-0000-0000-000000000004', 'fa360003-0000-0000-0000-000000000004', 'Cyclophosphamide Acrolein Cystitis (Mesna) & Methotrexate Leucovorin Rescue', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa360005-0000-0000-0000-000000000004', 'fa360004-0000-0000-0000-000000000004', 'Myocardial Iron-Mediated Hydroxyl Radical Scavengings, Urothelial Acrolein Thioether Neutralizations, Dihydrofolate Reductase Tetrahydrofolate Rescues, and Intrathecal Vincristine Neurotoxic Fatalities', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa360006-0000-0000-0000-000000000004', 'fa360005-0000-0000-0000-000000000004', 'EXPLANATION', 1, 
'{"text": "### Chemotherapy Toxicities & Rescue\n\nDoxorubicin: Dilated cardiomyopathy via iron-dependent free radicals -> DEXRAZOXANE (iron chelator). Cisplatin: ATN nephrotoxicity and ototoxicity -> Saline hydration + AMIFOSTINE. Bleomycin: Pulmonary fibrosis (bleomycin hydrolase deficiency). Cyclophosphamide: Toxic metabolite ACROLEIN causes hemorrhagic cystitis -> MESNA (binds acrolein) + Hydration. High-Dose Methotrexate: DHFR inhibition -> LEUCOVORIN (Folinic Acid) RESCUE (bypasses DHFR to rescue normal bone marrow/GI cells). Vincristine: FATAL IF GIVEN INTRATHECALLY."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;
