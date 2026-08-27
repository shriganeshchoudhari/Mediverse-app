-- V67: Seed Clinical Gastroenterology & Hepatology (GASTRO-301) Full Curriculum

-- Ensure Subject: GASTRO-301 exists with correct title and category
INSERT INTO subjects (id, semester_id, code, title, category)
VALUES ('f1d0a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a25', 'c7d8e9f0-b1c2-3d4e-5f6a-7b8c9d0e1f2a', 'GASTRO-301', 'Clinical Gastroenterology & Hepatology', 'CLINICAL')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, category = EXCLUDED.category;

-- Unit 1: Liver Cirrhosis, Portal Hypertension & Decompensated Liver Failure
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa290001-0000-0000-0000-000000000001', 'f1d0a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a25', 'Liver Cirrhosis, Portal Hypertension & Decompensated Liver Failure', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa290002-0000-0000-0000-000000000001', 'fa290001-0000-0000-0000-000000000001', 'SAAG Gradient (>=1.1 vs <1.1) & Transudate vs Exudate Ascites', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa290003-0000-0000-0000-000000000001', 'fa290002-0000-0000-0000-000000000001', 'Spontaneous Bacterial Peritonitis (ANC >250 & Albumin Rescue)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa290004-0000-0000-0000-000000000001', 'fa290003-0000-0000-0000-000000000001', 'Variceal Bleed (Octreotide/EVL) & Hepatorenal Syndrome (Terlipressin)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa290005-0000-0000-0000-000000000001', 'fa290004-0000-0000-0000-000000000001', 'Sinusoidal Hydrostatic Gradients, Peritoneal Translocation Neutrophil Counts, Splanchnic Vasoconstrictor Protocols, and MELD-Na Mortality Scoring', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa290006-0000-0000-0000-000000000001', 'fa290005-0000-0000-0000-000000000001', 'EXPLANATION', 1, 
'{"text": "### Cirrhosis & Portal Hypertension\n\nSAAG = Serum Albumin - Ascitic Albumin. SAAG >=1.1 g/dL (Portal HTN): Cirrhosis (<2.5 protein), Heart Failure (>=2.5 protein). SAAG <1.1 g/dL: Peritoneal Carcinomatosis, TB, Nephrotic syndrome. SBP: Ascitic ANC >250/uL -> IV Ceftriaxone + IV Albumin (1.5 g/kg Day 1, 1.0 g/kg Day 3, prevents Hepatorenal Syndrome). Variceal bleed: Octreotide + Ceftriaxone + EVL band ligation (target Hb 7-8 g/dL). Hepatorenal Syndrome (HRS): Splanchnic vasodilation -> severe renal vasoconstriction -> Terlipressin + Albumin (curative: Liver Transplant). Hepatic Encephalopathy: Lactulose + Rifaximin."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 2: Algorithmic Differential Diagnosis of Jaundice & Bilirubin Metabolism
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa290001-0000-0000-0000-000000000002', 'f1d0a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a25', 'Algorithmic Differential Diagnosis of Jaundice & Bilirubin Metabolism', 2)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa290002-0000-0000-0000-000000000002', 'fa290001-0000-0000-0000-000000000002', 'Unconjugated Jaundice: Gilbert (UGT1A1 TA7) vs Crigler-Najjar', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa290003-0000-0000-0000-000000000002', 'fa290002-0000-0000-0000-000000000002', 'Conjugated Jaundice: Dubin-Johnson (Black Liver) vs Rotor', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa290004-0000-0000-0000-000000000002', 'fa290003-0000-0000-0000-000000000002', 'Extrahepatic Cholestasis & Courvoisier Sign in Pancreatic Cancer', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa290005-0000-0000-0000-000000000002', 'fa290004-0000-0000-0000-000000000002', 'UGT1A1 Glucuronidation Kinetics, Epinephrine Metabolite Lysosomal Pigments, Canalicular MRP2 Transporters, and Malignant Biliary Stent Indications', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa290006-0000-0000-0000-000000000002', 'fa290005-0000-0000-0000-000000000002', 'EXPLANATION', 1, 
'{"text": "### Jaundice & Bilirubin Metabolism\n\nUnconjugated: Gilbert (homozygous TA7 promoter mutation in UGT1A1 -> mild episodic stress/fasting jaundice, normal LFTs, benign); Crigler-Najjar Type I (absent UGT1A1, fatal kernicterus, transplant); Type II (reduced UGT1A1, responds to Phenobarbital). Conjugated: Dubin-Johnson (MRP2/ABCC2 canalicular defect -> dense black pigmented liver, normal life expectancy); Rotor (OATP1B1/B3 defect -> non-pigmented normal liver). Extrahepatic Cholestasis: Painless jaundice + palpable gallbladder (Courvoisier sign) -> Pancreatic head adenocarcinoma or cholangiocarcinoma (high direct bili, high ALP/GGT, dark urine, acholic stools)."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 3: Inflammatory Bowel Disease: Crohn Disease vs Ulcerative Colitis
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa290001-0000-0000-0000-000000000003', 'f1d0a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a25', 'Inflammatory Bowel Disease: Crohn Disease vs Ulcerative Colitis', 3)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa290002-0000-0000-0000-000000000003', 'fa290001-0000-0000-0000-000000000003', 'Crohn Disease: Skip Lesions, Transmural, Non-Caseating Granulomas & ASCA', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa290003-0000-0000-0000-000000000003', 'fa290002-0000-0000-0000-000000000003', 'Ulcerative Colitis: Mucosal, Crypt Abscesses, p-ANCA & PSC Association', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa290004-0000-0000-0000-000000000003', 'fa290003-0000-0000-0000-000000000003', 'Toxic Megacolon Crisis (>6 cm) & Proctocolectomy Curative Potentials', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa290005-0000-0000-0000-000000000003', 'fa290004-0000-0000-0000-000000000003', 'Transmural Fissuring Fistulae, Neutrophilic Crypt Microabscesses, String Signs on Barium, and Onion-Skin Sclerosing Cholangitis Strictures', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa290006-0000-0000-0000-000000000003', 'fa290005-0000-0000-0000-000000000003', 'EXPLANATION', 1, 
'{"text": "### Inflammatory Bowel Disease\n\nCrohn Disease: Mouth to anus (terminal ileum in 80%), skip lesions, transmural depth, non-caseating granulomas (60%), cobblestone mucosa, string sign strictures, fistulas, ASCA+, gallstones & calcium oxalate kidney stones (surgery non-curative). Ulcerative Colitis: Colon only (continuous from rectum), mucosal/submucosal depth, crypt abscesses with neutrophils, pseudopolyps, lead-pipe colon, toxic megacolon (>6 cm, perforation risk), p-ANCA+, Primary Sclerosing Cholangitis (PSC), CURATIVE with total proctocolectomy."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 4: Acute Pancreatitis, Celiac Disease & Malabsorption Syndromes
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa290001-0000-0000-0000-000000000004', 'f1d0a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a25', 'Acute Pancreatitis, Celiac Disease & Malabsorption Syndromes', 4)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa290002-0000-0000-0000-000000000004', 'fa290001-0000-0000-0000-000000000004', 'Acute Pancreatitis: Atlanta Criteria, Lipase >=3x & Ringer Lactate', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa290003-0000-0000-0000-000000000004', 'fa290002-0000-0000-0000-000000000004', 'Celiac Disease: Anti-tTG IgA, Villous Atrophy & Dermatitis Herpetiformis', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa290004-0000-0000-0000-000000000004', 'fa290003-0000-0000-0000-000000000004', 'Whipple Disease (PAS+ Macrophages) vs Tropical Sprue', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa290005-0000-0000-0000-000000000004', 'fa290004-0000-0000-0000-000000000004', 'Premature Trypsinogen Autodigestion, Deamidated Gliadin Immunogenicity, Granular Dermal Papillary IgA Fluorescence, and Tropheryma Diastase Resistance', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa290006-0000-0000-0000-000000000004', 'fa290005-0000-0000-0000-000000000004', 'EXPLANATION', 1, 
'{"text": "### Pancreatitis & Malabsorption\n\nAcute Pancreatitis: Atlanta criteria (2 of 3: epigastric pain to back, Lipase >=3x ULN, CT imaging). Gallstones (40%) & alcohol (30%). Aggressive IV Lactated Ringer''s hydration + early enteral feeding within 24-48h. Celiac Disease: Anti-tTG IgA, anti-EMA IgA; duodenal biopsy showing villous atrophy, crypt hyperplasia, intraepithelial lymphocytosis; HLA-DQ2/DQ8; Dermatitis Herpetiformis (granular IgA at dermal papillae tips -> Dapsone + gluten-free diet). Whipple Disease: Tropheryma whipplei -> PAS-positive diastase-resistant foamy macrophages in lamina propria; arthralgias, diarrhea, neuro signs -> IV Ceftriaxone -> 1 yr TMP-SMX."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;
