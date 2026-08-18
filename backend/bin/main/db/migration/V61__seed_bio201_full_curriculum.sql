-- V61: Seed Clinical Biochemistry & Metabolic Genetics (BIO-201 Advanced) Full Curriculum

-- Ensure Subject: BIO-201 exists with correct title and category
INSERT INTO subjects (id, semester_id, code, title, category)
VALUES ('f1b0a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a19', 'c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f', 'BIO-201', 'Clinical Biochemistry & Metabolic Genetics', 'PRE_CLINICAL')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, category = EXCLUDED.category;

-- Unit 1: Inborn Errors of Amino Acid Metabolism: PKU, MSUD, Alkaptonuria & Homocystinuria
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa230001-0000-0000-0000-000000000001', 'f1b0a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a19', 'Inborn Errors of Amino Acid Metabolism: PKU, MSUD, Alkaptonuria & Homocystinuria', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa230002-0000-0000-0000-000000000001', 'fa230001-0000-0000-0000-000000000001', 'Phenylketonuria (PAH Defect & BH4 Cofactor)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa230003-0000-0000-0000-000000000001', 'fa230002-0000-0000-0000-000000000001', 'Maple Syrup Urine Disease & Branched-Chain Amino Acids', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa230004-0000-0000-0000-000000000001', 'fa230003-0000-0000-0000-000000000001', 'Alkaptonuria Ochronosis & Homocystinuria Vascular Risk', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa230005-0000-0000-0000-000000000001', 'fa230004-0000-0000-0000-000000000001', 'Aminoacidopathies, Mousy Body Odor, Burnt Sugar Urine, Black Urine Ochronosis, Inferonasal Ectopia Lentis, and Vitamin Cofactor Replacement', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa230006-0000-0000-0000-000000000001', 'fa230005-0000-0000-0000-000000000001', 'EXPLANATION', 1, 
'{"text": "### Inborn Errors of Amino Acid Metabolism\n\nPKU: Phenylalanine hydroxylase (PAH) or BH4 defect -> accumulation of phenylalanine -> musty/mousy odor, intellectual disability, hypopigmentation (fair skin/hair) -> low-phe diet + tyrosine supplementation + sapropterin. MSUD: Branched-Chain alpha-Ketoacid Dehydrogenase (BCKAD) defect (requires Thiamine B1) -> Isoleucine, Leucine, Valine accumulation -> burnt sugar / maple syrup urine odor, neonatal ketoacidosis, cerebral edema. Alkaptonuria: Homogentisate 1,2-dioxygenase defect -> homogentisic acid accumulation -> urine turns black on standing, ochronosis (blue-black sclera/ears), severe arthropathy. Homocystinuria: Cystathionine beta-synthase (CBS) defect (requires Pyridoxine B6) -> downward-inward lens dislocation (inferonasal ectopia lentis), marfanoid habitus, massive risk of thromboembolic stroke/DVT."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 2: Glycogen Storage Diseases: Von Gierke, Pompe, Cori & McArdle
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa230001-0000-0000-0000-000000000002', 'f1b0a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a19', 'Glycogen Storage Diseases: Von Gierke, Pompe, Cori & McArdle', 2)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa230002-0000-0000-0000-000000000002', 'fa230001-0000-0000-0000-000000000002', 'Type I Von Gierke Disease (Glucose-6-Phosphatase)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa230003-0000-0000-0000-000000000002', 'fa230002-0000-0000-0000-000000000002', 'Type II Pompe Disease & Lysosomal Cardiomyopathy', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa230004-0000-0000-0000-000000000002', 'fa230003-0000-0000-0000-000000000002', 'Type III Cori (Debranching) & Type V McArdle (Myophosphorylase)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa230005-0000-0000-0000-000000000002', 'fa230004-0000-0000-0000-000000000002', 'Glycogen Storage Disease Classifications, Fasting Hypoglycemia, Lactic Acidosis, Massive Cardiomegaly, and Ischemic Forearm Exercise Testing', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa230006-0000-0000-0000-000000000002', 'fa230005-0000-0000-0000-000000000002', 'EXPLANATION', 1, 
'{"text": "### Glycogen Storage Diseases (GSDs)\n\nVon Gierke (Type I): Glucose-6-Phosphatase defect -> severe fasting hypoglycemia, profound lactic acidosis, hyperuricemia (gout), massive hepatomegaly, doll-like face -> uncooked cornstarch (avoid pure fructose/galactose). Pompe (Type II): Lysosomal Acid alpha-Glucosidase (Acid Maltase) defect -> Pompe trashes the pump -> massive hypertrophic cardiomyopathy, severe hypotonia (floppy baby) -> Alglucosidase alfa ERT. Cori (Type III): Debranching enzyme (alpha-1,6-glucosidase) defect -> limit dextrin accumulation, normal blood lactate (gluconeogenesis intact). McArdle (Type V): Muscle glycogen phosphorylase defect -> painful muscle cramps on exertion, second-wind phenomenon, myoglobinuria, flat blood lactate curve on ischemic forearm exercise."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 3: Lysosomal Storage Disorders & Sphingolipidoses
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa230001-0000-0000-0000-000000000003', 'f1b0a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a19', 'Lysosomal Storage Disorders & Sphingolipidoses', 3)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa230002-0000-0000-0000-000000000003', 'fa230001-0000-0000-0000-000000000003', 'Gaucher Disease (Glucocerebrosidase & Erlenmeyer Flask)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa230003-0000-0000-0000-000000000003', 'fa230002-0000-0000-0000-000000000003', 'Tay-Sachs (Hexosaminidase A) vs Niemann-Pick (Sphingomyelinase)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa230004-0000-0000-0000-000000000003', 'fa230003-0000-0000-0000-000000000003', 'Fabry Disease (Acroparesthesias) & Mucopolysaccharidoses (Hurler/Hunter)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa230005-0000-0000-0000-000000000003', 'fa230004-0000-0000-0000-000000000003', 'Sphingolipidoses, Crinkled Tissue Paper Histiocytes, Cherry-Red Macular Spots, Angiokeratomas, and Enzyme Replacement Therapies', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa230006-0000-0000-0000-000000000003', 'fa230005-0000-0000-0000-000000000003', 'EXPLANATION', 1, 
'{"text": "### Lysosomal Storage Disorders\n\nGaucher: Glucocerebrosidase defect -> glucocerebroside accumulation in macrophages (crinkled tissue paper appearance), massive hepatosplenomegaly, pancytopenia, bone crises, Erlenmeyer flask deformity. Tay-Sachs: Hexosaminidase A defect -> GM2 ganglioside accumulation -> cherry-red macular spot, neurodegeneration, hyperacusis, NO hepatosplenomegaly. Niemann-Pick: Acid sphingomyelinase defect -> sphingomyelin accumulation -> cherry-red macular spot PLUS prominent hepatosplenomegaly and foamy histiocytes. Fabry: alpha-Galactosidase A defect (X-linked recessive) -> Gb3 accumulation -> acroparesthesias (burning pain), angiokeratomas, hypohidrosis, progressive renal/cardiac failure. Hurler vs Hunter: Hurler (alpha-L-iduronidase) has corneal clouding; Hunter (iduronate-2-sulfatase, X-linked) has NO corneal clouding."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 4: Porphyrias, Heme Biosynthesis & Urea Cycle Disorders
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa230001-0000-0000-0000-000000000004', 'f1b0a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a19', 'Porphyrias, Heme Biosynthesis & Urea Cycle Disorders', 4)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa230002-0000-0000-0000-000000000004', 'fa230001-0000-0000-0000-000000000004', 'Acute Intermittent Porphyria (PBG Deaminase & The 5 Ps)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa230003-0000-0000-0000-000000000004', 'fa230002-0000-0000-0000-000000000004', 'Porphyria Cutanea Tarda (UROD, Blisters & Coral-Red Urine)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa230004-0000-0000-0000-000000000004', 'fa230003-0000-0000-0000-000000000004', 'Urea Cycle OTC Deficiency vs Hereditary Orotic Aciduria', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa230005-0000-0000-0000-000000000004', 'fa230004-0000-0000-0000-000000000004', 'Heme Synthetic Pathway Enzymes, Port-Wine Urine, IV Hemin Feedback, Wood Lamp Coral-Red Fluorescence, and Hyperammonemic Encephalopathy', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa230006-0000-0000-0000-000000000004', 'fa230005-0000-0000-0000-000000000004', 'EXPLANATION', 1, 
'{"text": "### Porphyrias & Urea Cycle Disorders\n\nAIP: PBG Deaminase defect -> 5 Ps: Painful abdomen, Polyneuropathy, Psychological, Port-wine urine, Precipitated by CYP450 inducers/fasting (NO rash!) -> IV Hemin + Glucose (downregulates delta-ALA synthase 1). PCT: Uroporphyrinogen Decarboxylase (UROD) defect -> uroporphyrin accumulation -> blistering photosensitivity on sun-exposed dorsal hands, tea-colored urine with coral-red fluorescence under Wood''s lamp (associated with Hepatitis C/iron overload) -> phlebotomy. OTC Deficiency: X-linked urea cycle defect -> severe hyperammonemic coma + high urinary orotic acid. Hereditary Orotic Aciduria: UMP synthase defect -> high urinary orotic acid + megaloblastic anemia refractory to B12/folate with NORMAL blood ammonia."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;
