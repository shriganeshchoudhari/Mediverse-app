-- V55: Seed Medical Genetics & Genomics (GEN-201) Full Curriculum

-- Ensure Subject: GEN-201 exists with correct title and category
INSERT INTO subjects (id, semester_id, code, title, category)
VALUES ('f1b9a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a13', 'c4d5e6f7-a8b9-0c1d-2e3f-4a5b6c7d8e9f', 'GEN-201', 'Medical Genetics & Genomics', 'PRE_CLINICAL')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, category = EXCLUDED.category;

-- Unit 1: Chromosomal Aneuploidies & Structural Rearrangements
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa170001-0000-0000-0000-000000000001', 'f1b9a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a13', 'Chromosomal Aneuploidies & Structural Rearrangements', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa170002-0000-0000-0000-000000000001', 'fa170001-0000-0000-0000-000000000001', 'Autosomal Trisomies (Down, Edwards, Patau Syndromes)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa170003-0000-0000-0000-000000000001', 'fa170002-0000-0000-0000-000000000001', 'Sex Chromosome Aneuploidies (Turner 45,X & Klinefelter 47,XXY)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa170004-0000-0000-0000-000000000001', 'fa170003-0000-0000-0000-000000000001', 'Robertsonian Translocations & Microdeletion Syndromes', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa170005-0000-0000-0000-000000000001', 'fa170004-0000-0000-0000-000000000001', 'Chromosomal Aneuploidies, Nondisjunction, Robertsonian Translocations, and Autosomal/Sex Chromosome Syndromes', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa170006-0000-0000-0000-000000000001', 'fa170005-0000-0000-0000-000000000001', 'EXPLANATION', 1, 
'{"text": "### Chromosomal Aneuploidies & Structural Rearrangements\n\nTrisomy 21 (Down): 95% meiotic nondisjunction, endocardial cushion defects, duodenal atresia, AMKL (M7 AML) risk. Trisomy 18 (Edwards): Clenched overlapping fingers, rocker-bottom feet. Trisomy 13 (Patau): Holoprosencephaly, cleft lip/palate, cutis aplasia, polydactyly. Turner (45,X): Streak ovaries, bicuspid aortic valve, coarctation, primary amenorrhea. Klinefelter (47,XXY): Tall eunuchoid stature, gynecomastia, testicular atrophy, hypergonadotropic hypogonadism. Robertsonian translocations occur between acrocentric chromosomes (13, 14, 15, 21, 22)."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 2: Mendelian & Non-Mendelian Inheritance Patterns
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa170001-0000-0000-0000-000000000002', 'f1b9a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a13', 'Mendelian & Non-Mendelian Inheritance Patterns', 2)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa170002-0000-0000-0000-000000000002', 'fa170001-0000-0000-0000-000000000002', 'Classical Mendelian Modes (AD, AR, XLR, XLD)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa170003-0000-0000-0000-000000000002', 'fa170002-0000-0000-0000-000000000002', 'Mitochondrial Inheritance & Heteroplasmy (MELAS/LHON)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa170004-0000-0000-0000-000000000002', 'fa170003-0000-0000-0000-000000000002', 'Variable Expressivity, Incomplete Penetrance & Pleiotropy', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa170005-0000-0000-0000-000000000002', 'fa170004-0000-0000-0000-000000000002', 'Autosomal and X-Linked Pedigree Analysis, Maternal Mitochondrial Heteroplasmy, and Non-Classic Genetic Phenomena', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa170006-0000-0000-0000-000000000002', 'fa170005-0000-0000-0000-000000000002', 'EXPLANATION', 1, 
'{"text": "### Mendelian & Mitochondrial Inheritance\n\nAutosomal Dominant (50% risk, vertical transmission, Marfan, Achondroplasia). Autosomal Recessive (25% risk, horizontal transmission, CFTR DeltaF508, Sickle Cell). X-Linked Recessive (carrier mothers pass to 50% sons; affected fathers have 0% affected sons and 100% carrier daughters; DMD, Hemophilia). Mitochondrial DNA: Strict maternal transmission (100% transmission from affected mothers, 0% from affected fathers; LHON, MELAS). Variable expressivity (NF1), Pleiotropy (FBN1 Marfan), Locus vs Allelic heterogeneity."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 3: Epigenetics, Genomic Imprinting & Trinucleotide Repeat Expansions
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa170001-0000-0000-0000-000000000003', 'f1b9a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a13', 'Epigenetics, Genomic Imprinting & Trinucleotide Repeat Expansions', 3)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa170002-0000-0000-0000-000000000003', 'fa170001-0000-0000-0000-000000000003', '15q11-q13 Imprinting: Prader-Willi vs Angelman Syndrome', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa170003-0000-0000-0000-000000000003', 'fa170002-0000-0000-0000-000000000003', 'Polyglutamine & Non-Coding Dynamic Trinucleotide Expansions', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa170004-0000-0000-0000-000000000003', 'fa170003-0000-0000-0000-000000000003', 'Genetic Anticipation & Parent-of-Origin Bias', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa170005-0000-0000-0000-000000000003', 'fa170004-0000-0000-0000-000000000003', 'Genomic Imprinting at 15q11-q13, Uniparental Disomy, Dynamic Trinucleotide Repeats, and Genetic Anticipation', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa170006-0000-0000-0000-000000000003', 'fa170005-0000-0000-0000-000000000003', 'EXPLANATION', 1, 
'{"text": "### Epigenetics & Trinucleotide Repeats\n\nPrader-Willi Syndrome: Loss of active paternal 15q11-q13 genes (70% paternal deletion, 25% maternal UPD) -> neonatal hypotonia -> childhood hyperphagia and morbid obesity. Angelman Syndrome: Loss of active maternal UBE3A (70% maternal deletion, 10% UBE3A mutation) -> puppet-like gait, laughter, seizures. Trinucleotide repeat expansions exhibit genetic anticipation: Huntington (CAG polyQ striatal atrophy), Fragile X (CGG hypermethylation, macroorchidism), Myotonic Dystrophy (CTG toxic RNA), Friedreich Ataxia (intronic GAA)."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 4: Molecular Cytogenetics, Next-Gen Sequencing & Genetic Counseling
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa170001-0000-0000-0000-000000000004', 'f1b9a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a13', 'Molecular Cytogenetics, Next-Gen Sequencing & Genetic Counseling', 4)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa170002-0000-0000-0000-000000000004', 'fa170001-0000-0000-0000-000000000004', 'Cytogenetic Modalities (Karyotype, FISH, CMA 1st-Tier)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa170003-0000-0000-0000-000000000004', 'fa170002-0000-0000-0000-000000000004', 'Next-Generation Sequencing (WES/WGS & Variant Tiers)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa170004-0000-0000-0000-000000000004', 'fa170003-0000-0000-0000-000000000004', 'ACMG 5-Tier Variant Classification & Genetic Counseling', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa170005-0000-0000-0000-000000000004', 'fa170004-0000-0000-0000-000000000004', 'Molecular Cytogenetics, Chromosomal Microarray First-Tier Testing, ACMG Variant Classification, and Non-Directive Genetic Counseling', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa170006-0000-0000-0000-000000000004', 'fa170005-0000-0000-0000-000000000004', 'EXPLANATION', 1, 
'{"text": "### Molecular Diagnostics & Genetic Counseling\n\nG-banded karyotype (5-10 Mb) detects large aneuploidies and translocations. FISH (100-200 kb) detects targeted microdeletions (22q11.2 DiGeorge). Chromosomal Microarray (CMA, 20-50 kb) is the definitive first-tier test for unexplained intellectual disability, autism, and multiple congenital anomalies. ACMG 5-tier classification: Class 5 (Pathogenic) to Class 1 (Benign); Class 3 (VUS) must never be used to alter medical/surgical management. Principles of genetic counseling emphasize non-directive counseling."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;
