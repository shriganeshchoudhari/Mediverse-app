-- V30: Seed Medical Biochemistry (BIOC-101) Full Curriculum

-- Ensure Subject: BIOC-101 exists with correct title and category
INSERT INTO subjects (id, semester_id, code, title, category)
VALUES ('d6e7f8a9-b0c1-2d3e-4f5a-6b7c8d9e0f1a', 'c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f', 'BIOC-101', 'Medical Biochemistry', 'PRE_CLINICAL')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, category = EXCLUDED.category;

-- Unit 1: Carbohydrate Metabolism & Bioenergetics
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('b1010001-0000-0000-0000-000000000001', 'd6e7f8a9-b0c1-2d3e-4f5a-6b7c8d9e0f1a', 'Carbohydrate Metabolism & Glycogenoses', 1)
ON CONFLICT DO NOTHING;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('b1010002-0000-0000-0000-000000000001', 'b1010001-0000-0000-0000-000000000001', 'Glycolysis, Gluconeogenesis & GSDs', 1)
ON CONFLICT DO NOTHING;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('b1010003-0000-0000-0000-000000000001', 'b1010002-0000-0000-0000-000000000001', 'Reciprocal Regulation by PFK-1 and FBPase-1', 1)
ON CONFLICT DO NOTHING;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('b1010004-0000-0000-0000-000000000001', 'b1010003-0000-0000-0000-000000000001', 'Von Gierke Disease & Pyruvate Dehydrogenase', 1)
ON CONFLICT DO NOTHING;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('b1010005-0000-0000-0000-000000000001', 'b1010004-0000-0000-0000-000000000001', 'Carbohydrate Crossroads, Gluconeogenesis & GSDs', 'PUBLISHED', 1)
ON CONFLICT DO NOTHING;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('b1010006-0000-0000-0000-000000000001', 'b1010005-0000-0000-0000-000000000001', 'EXPLANATION', 1, 
'{"text": "### Carbohydrate Metabolism & Bioenergetics\n\nPFK-1 is the rate-limiting enzyme of glycolysis stimulated by Fructose-2,6-bisphosphate and AMP. Von Gierke disease (Type I GSD) is caused by Glucose-6-Phosphatase deficiency, leading to severe fasting hypoglycemia, lactic acidosis, and hyperuricemia."}'::jsonb)
ON CONFLICT DO NOTHING;

-- Unit 2: Lipid & Lipoprotein Metabolism
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('b1010001-0000-0000-0000-000000000002', 'd6e7f8a9-b0c1-2d3e-4f5a-6b7c8d9e0f1a', 'Lipid Transport & Dyslipidemias', 2)
ON CONFLICT DO NOTHING;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('b1010002-0000-0000-0000-000000000002', 'b1010001-0000-0000-0000-000000000002', 'Lipoprotein Cascades & Beta-Oxidation', 1)
ON CONFLICT DO NOTHING;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('b1010003-0000-0000-0000-000000000002', 'b1010002-0000-0000-0000-000000000002', 'Apolipoproteins and Reverse Cholesterol Transport', 1)
ON CONFLICT DO NOTHING;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('b1010004-0000-0000-0000-000000000002', 'b1010003-0000-0000-0000-000000000002', 'Familial Hypercholesterolemia & MCAD Deficiency', 1)
ON CONFLICT DO NOTHING;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('b1010005-0000-0000-0000-000000000002', 'b1010004-0000-0000-0000-000000000002', 'Lipoprotein Metabolism and Familial Dyslipidemias', 'PUBLISHED', 1)
ON CONFLICT DO NOTHING;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('b1010006-0000-0000-0000-000000000002', 'b1010005-0000-0000-0000-000000000002', 'EXPLANATION', 1, 
'{"text": "### Lipid Transport & Lipoproteins\n\nChylomicrons carry dietary lipids via ApoB-48, while VLDL/LDL contain ApoB-100. Familial Hypercholesterolemia (Type IIa) is an autosomal dominant LDL-R defect resulting in severe premature CAD and Achilles tendon xanthomas."}'::jsonb)
ON CONFLICT DO NOTHING;

-- Unit 3: Amino Acid & Nitrogen Metabolism
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('b1010001-0000-0000-0000-000000000003', 'd6e7f8a9-b0c1-2d3e-4f5a-6b7c8d9e0f1a', 'Amino Acid Catabolism & Urea Cycle', 3)
ON CONFLICT DO NOTHING;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('b1010002-0000-0000-0000-000000000003', 'b1010001-0000-0000-0000-000000000003', 'Urea Cycle & Amino Acid Inborn Errors', 1)
ON CONFLICT DO NOTHING;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('b1010003-0000-0000-0000-000000000003', 'b1010002-0000-0000-0000-000000000003', 'Carbamoyl Phosphate Synthetase I and OTC', 1)
ON CONFLICT DO NOTHING;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('b1010004-0000-0000-0000-000000000003', 'b1010003-0000-0000-0000-000000000003', 'Phenylketonuria, MSUD & Alkaptonuria', 1)
ON CONFLICT DO NOTHING;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('b1010005-0000-0000-0000-000000000003', 'b1010004-0000-0000-0000-000000000003', 'Urea Cycle Detoxification and Inborn Metabolic Errors', 'PUBLISHED', 1)
ON CONFLICT DO NOTHING;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('b1010006-0000-0000-0000-000000000003', 'b1010005-0000-0000-0000-000000000003', 'EXPLANATION', 1, 
'{"text": "### Urea Cycle & Amino Acid Inborn Errors\n\nCPS-1 requires N-Acetylglutamate for activation. OTC deficiency is an X-linked cause of hyperammonemia with elevated orotic acid. Maple syrup urine disease is caused by BCKDH deficiency, blocking leucine, isoleucine, and valine catabolism."}'::jsonb)
ON CONFLICT DO NOTHING;

-- Unit 4: Molecular Genetics, Purines & Lysosomal Storage Diseases
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('b1010001-0000-0000-0000-000000000004', 'd6e7f8a9-b0c1-2d3e-4f5a-6b7c8d9e0f1a', 'Molecular Genetics & Storage Diseases', 4)
ON CONFLICT DO NOTHING;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('b1010002-0000-0000-0000-000000000004', 'b1010001-0000-0000-0000-000000000004', 'Purine Metabolism, Sphingolipidoses & Vitamins', 1)
ON CONFLICT DO NOTHING;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('b1010003-0000-0000-0000-000000000004', 'b1010002-0000-0000-0000-000000000004', 'HGPRT Salvage Pathway and Sphingolipidoses', 1)
ON CONFLICT DO NOTHING;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('b1010004-0000-0000-0000-000000000004', 'b1010003-0000-0000-0000-000000000004', 'Lesch-Nyhan Syndrome & Tay-Sachs/Gaucher', 1)
ON CONFLICT DO NOTHING;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('b1010005-0000-0000-0000-000000000004', 'b1010004-0000-0000-0000-000000000004', 'Purine Salvage, Lysosomal Storage Diseases and Vitamin Coenzymes', 'PUBLISHED', 1)
ON CONFLICT DO NOTHING;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('b1010006-0000-0000-0000-000000000004', 'b1010005-0000-0000-0000-000000000004', 'EXPLANATION', 1, 
'{"text": "### Purines, Storage Diseases & Vitamin Coenzymes\n\nLesch-Nyhan syndrome is caused by HGPRT deficiency, resulting in compulsive self-mutilation and hyperuricemia. Tay-Sachs features Hexosaminidase A deficiency and cherry-red macula with NO hepatosplenomegaly. Niacin (B3) deficiency causes Pellagra (4 D''s)."}'::jsonb)
ON CONFLICT DO NOTHING;
