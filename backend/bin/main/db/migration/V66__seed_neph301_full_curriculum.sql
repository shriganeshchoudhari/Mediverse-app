-- V66: Seed Clinical Nephrology & Acid-Base Electrophysiology (NEPH-301) Full Curriculum

-- Ensure Subject: NEPH-301 exists with correct title and category
INSERT INTO subjects (id, semester_id, code, title, category)
VALUES ('f1d0a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a24', 'c7d8e9f0-b1c2-3d4e-5f6a-7b8c9d0e1f2a', 'NEPH-301', 'Clinical Nephrology & Acid-Base Electrophysiology', 'CLINICAL')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, category = EXCLUDED.category;

-- Unit 1: Glomerulopathies: Nephritic vs Nephrotic Syndromes
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa280001-0000-0000-0000-000000000001', 'f1d0a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a24', 'Glomerulopathies: Nephritic vs Nephrotic Syndromes', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa280002-0000-0000-0000-000000000001', 'fa280001-0000-0000-0000-000000000001', 'Nephrotic Syndromes: MCD, FSGS, Membranous & Diabetic Nephropathy', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa280003-0000-0000-0000-000000000001', 'fa280002-0000-0000-0000-000000000001', 'Nephritic Syndromes: PSGN, IgA Berger & RPGN Crescents', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa280004-0000-0000-0000-000000000001', 'fa280003-0000-0000-0000-000000000001', 'Immunofluorescence Patterns: Linear vs Granular vs Pauci-Immune', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa280005-0000-0000-0000-000000000001', 'fa280004-0000-0000-0000-000000000001', 'Podocyte Effacement, Anti-PLA2R Antibodies, Kimmelstiel-Wilson Nodules, Synpharyngitic Hematuria, and Anti-GBM Linear Fluorescence', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa280006-0000-0000-0000-000000000001', 'fa280005-0000-0000-0000-000000000001', 'EXPLANATION', 1, 
'{"text": "### Glomerulopathies\n\nNephrotic (>3.5 g/24h proteinuria, hypoalbuminemia <3.0, fatty casts/Maltese cross): MCD (pediatric, normal LM, podocyte effacement on EM -> Prednisone); FSGS (segmental sclerosis, HIV/heroin/APOL1); Membranous (anti-PLA2R+, spike-and-dome on EM, highest renal vein thrombosis risk); Diabetic (Kimmelstiel-Wilson nodules -> ACEi/ARBs). Nephritic (hematuria, dysmorphic RBCs, RBC casts, hypertension): PSGN (1-3 weeks post-strep, low C3, subepithelial humps); IgA Berger (synpharyngitic hematuria 1-2 days during URI, mesangial IgA, normal C3); RPGN (Bowman crescents -> Type I Goodpasture linear IF, Type II Lupus granular IF, Type III ANCA pauci-immune)."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 2: Acute Kidney Injury & Urinalysis Casts Diagnostic Profiler
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa280001-0000-0000-0000-000000000002', 'f1d0a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a24', 'Acute Kidney Injury & Urinalysis Casts Diagnostic Profiler', 2)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa280002-0000-0000-0000-000000000002', 'fa280001-0000-0000-0000-000000000002', 'Prerenal Azotemia vs Intrinsic ATN Indices (FeNa, FeUrea, BUN/Cr)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa280003-0000-0000-0000-000000000002', 'fa280002-0000-0000-0000-000000000002', 'Urinalysis Casts: Muddy Brown, RBC, WBC, Fatty & Hyaline', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa280004-0000-0000-0000-000000000002', 'fa280003-0000-0000-0000-000000000002', 'Acute Interstitial Nephritis (AIN) & Rhabdomyolysis Myoglobinuria', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa280005-0000-0000-0000-000000000002', 'fa280004-0000-0000-0000-000000000002', 'Fractional Excretion of Sodium Equations, Muddy Brown Epithelial Casts, Drug-Induced Interstitial Eosinophiluria, and Heme-Positive Dipstick Rhabdomyolysis', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa280006-0000-0000-0000-000000000002', 'fa280005-0000-0000-0000-000000000002', 'EXPLANATION', 1, 
'{"text": "### AKI & Urinalysis\n\nPrerenal: BUN/Cr >20:1, FeNa <1.0%, FeUrea <35%, UNa <20, Urine Osm >500, Hyaline casts (reverses with IV fluids). Intrinsic ATN: BUN/Cr <15:1, FeNa >2.0%, UNa >40, Urine Osm <350, Muddy brown granular casts. Acute Interstitial Nephritis (AIN): Drug hypersensitivity (NSAIDs, penicillins, PPIs) -> triad: fever, rash, eosinophils, WBC casts without bacteria. Rhabdomyolysis: Heme-positive dipstick with NO RBCs on microscopy, CK >10,000 -> aggressive crystalloids."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 3: Renal Tubular Acidoses & Tubular Transport
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa280001-0000-0000-0000-000000000003', 'f1d0a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a24', 'Renal Tubular Acidoses & Tubular Transport', 3)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa280002-0000-0000-0000-000000000003', 'fa280001-0000-0000-0000-000000000003', 'Type 1 Distal RTA (Impaired H+ Secretion, Stones, Urine pH >5.5)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa280003-0000-0000-0000-000000000003', 'fa280002-0000-0000-0000-000000000003', 'Type 2 Proximal RTA (Fanconi Bicarbonate Wasting) & Type 4 RTA', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa280004-0000-0000-0000-000000000003', 'fa280003-0000-0000-0000-000000000003', 'Urine Anion Gap (UAG = UNa + UK - UCl) & Hypo/Hyperkalemia', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa280005-0000-0000-0000-000000000003', 'fa280004-0000-0000-0000-000000000003', 'Alpha-Intercalated Cell Failure, Calcium Phosphate Nephrocalcinosis, Proximal Solute Glucosuria Fanconi Syndromes, and Hyperkalemic Hypoaldosteronism', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa280006-0000-0000-0000-000000000003', 'fa280005-0000-0000-0000-000000000003', 'EXPLANATION', 1, 
'{"text": "### Renal Tubular Acidoses\n\nNormal Anion Gap Metabolic Acidosis. Type 1 Distal: Inability of alpha-intercalated cells to secrete H+ -> urine pH >5.5 always, positive UAG, hypokalemia, nephrocalcinosis / CaPO4 stones (Sjögren, Amphotericin B). Type 2 Proximal: Impaired proximal HCO3- reabsorption -> hypokalemia, negative UAG, Fanconi syndrome (glucosuria, phosphaturia, rickets; Myeloma, Tenofovir). Type 4 Hyperkalemic: Aldosterone deficiency/resistance -> HYPERKALEMIA, urine pH <5.5, positive UAG (diabetic nephropathy, ACEi)."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 4: Sodium, Water Homeostasis & Potassium Electrophysiology
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa280001-0000-0000-0000-000000000004', 'f1d0a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a24', 'Sodium, Water Homeostasis & Potassium Electrophysiology', 4)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa280002-0000-0000-0000-000000000004', 'fa280001-0000-0000-0000-000000000004', 'Hyponatremia Algorithm: SIADH vs ODS Prevention (<8 mEq/L/24h)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa280003-0000-0000-0000-000000000004', 'fa280002-0000-0000-0000-000000000004', 'Hyperkalemia ECG Progression: Peaked T to Sine-Wave & IV Calcium', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa280004-0000-0000-0000-000000000004', 'fa280003-0000-0000-0000-000000000004', 'Hypokalemia U Waves, Torsades Risk & Magnesium Repletion', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa280005-0000-0000-0000-000000000004', 'fa280004-0000-0000-0000-000000000004', 'Euvolemic Natriuresis Criteria, Pontine Demyelination Quadriplegia Prevention, Myocardial Membrane Stabilization Protocols, and Intracellular Potassium Shifting Kinetics', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa280006-0000-0000-0000-000000000004', 'fa280005-0000-0000-0000-000000000004', 'EXPLANATION', 1, 
'{"text": "### Electrolytes & Electrophysiology\n\nSIADH: Euvolemic hypotonic hyponatremia, concentrated urine (Osm >100, UNa >40, low uric acid). Fluid restriction, Vaptans. Rapid correction (>8 mEq/L/24h) causes Osmotic Demyelination Syndrome (ODS / central pontine myelinolysis -> locked-in syndrome). Hyperkalemia (K+ >5.5): Peaked T -> PR prolongation -> QRS widening -> Sine-wave. Step 1: IV Calcium Gluconate (membrane stabilization); Step 2: Insulin + D50, Albuterol; Step 3: Diuretics/Dialysis. Hypokalemia (K+ <3.5): U waves, flat T waves, Torsades risk -> KCl + Magnesium."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;
