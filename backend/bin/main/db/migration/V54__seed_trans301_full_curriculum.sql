-- V54: Seed Transfusion Medicine & Immunohematology (TRANS-301) Full Curriculum

-- Ensure Subject: TRANS-301 exists with correct title and category
INSERT INTO subjects (id, semester_id, code, title, category)
VALUES ('f1a9a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a12', 'c5d6e7f8-a9b0-1c2d-3e4f-5a6b7c8d9e0f', 'TRANS-301', 'Transfusion Medicine & Immunohematology', 'PARA_CLINICAL')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, category = EXCLUDED.category;

-- Unit 1: ABO/Rh Genetics, Bombay Phenotype & Coombs Crossmatching
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa160001-0000-0000-0000-000000000001', 'f1a9a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a12', 'ABO/Rh Genetics, Bombay Phenotype & Coombs Crossmatching', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa160002-0000-0000-0000-000000000001', 'fa160001-0000-0000-0000-000000000001', 'ABO Carbohydrate Antigen Biosynthesis & Transferases', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa160003-0000-0000-0000-000000000001', 'fa160002-0000-0000-0000-000000000001', 'Bombay Phenotype (hh) & Anti-H Lectin Differentiation', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa160004-0000-0000-0000-000000000001', 'fa160003-0000-0000-0000-000000000001', 'Direct (DAT) vs Indirect (IAT) Coombs Tests & Major Crossmatch', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa160005-0000-0000-0000-000000000001', 'fa160004-0000-0000-0000-000000000001', 'ABO and Rh Carbohydrate Genetics, Bombay hh Phenotype, Direct/Indirect Coombs Tests and Major Compatibility Crossmatching', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa160006-0000-0000-0000-000000000001', 'fa160005-0000-0000-0000-000000000001', 'EXPLANATION', 1, 
'{"text": "### ABO/Rh Genetics & Compatibility Testing\n\nFUT1 fucosyltransferase synthesizes H substance. A-gene adds GalNAc; B-gene adds D-galactose. Bombay phenotype (hh) fails to make H substance, typing as Group O on forward typing but containing potent Anti-H antibodies (negative with Ulex europaeus anti-H lectin). Bombay patients can receive blood ONLY from other Bombay donors. Direct Antiglobulin Test (DAT) detects in vivo sensitized RBCs; Indirect Antiglobulin Test (IAT) detects in vitro serum antibodies during pre-transfusion major crossmatch (Donor RBCs + Recipient Serum)."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 2: Blood Component Therapy, Storage Lesions & Massive Transfusion 1:1:1
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa160001-0000-0000-0000-000000000002', 'f1a9a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a12', 'Blood Component Therapy, Storage Lesions & Massive Transfusion 1:1:1', 2)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa160002-0000-0000-0000-000000000002', 'fa160001-0000-0000-0000-000000000002', 'Component Storage Parameters: PRBC, Platelets, FFP & Cryo', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa160003-0000-0000-0000-000000000002', 'fa160002-0000-0000-0000-000000000002', 'RBC Storage Lesions (2,3-DPG Depletion & Potassium Leakage)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa160004-0000-0000-0000-000000000002', 'fa160003-0000-0000-0000-000000000002', 'Massive Transfusion Protocol (1:1:1 Balanced Resuscitation & TXA)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa160005-0000-0000-0000-000000000002', 'fa160004-0000-0000-0000-000000000002', 'Targeted Blood Component Dosing, Storage Lesions, Citrate Hypocalcemia, and Balanced 1:1:1 Massive Transfusion Protocol', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa160006-0000-0000-0000-000000000002', 'fa160005-0000-0000-0000-000000000002', 'EXPLANATION', 1, 
'{"text": "### Component Therapy & MTP\n\n1 unit PRBC increases adult Hb by 1.0 g/dL. Platelets stored at 20-24°C with agitation (highest bacterial risk). Cryoprecipitate is rich in Fibrinogen (>=150 mg), Factor VIII, vWF, and Factor XIII. MTP delivers balanced 1:1:1 ratio (PRBC:FFP:Platelets) + Tranexamic Acid (TXA 1g) to prevent dilutional coagulopathy. Citrate preservative binds ionized calcium, requiring IV Calcium Gluconate every 4 units."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 3: Transfusion Reactions: Differential Diagnosis of TRALI vs TACO & AHTR
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa160001-0000-0000-0000-000000000003', 'f1a9a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a12', 'Transfusion Reactions: Differential Diagnosis of TRALI vs TACO & AHTR', 3)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa160002-0000-0000-0000-000000000003', 'fa160001-0000-0000-0000-000000000003', 'TRALI (Non-Cardiogenic) vs TACO (Volume Overload)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa160003-0000-0000-0000-000000000003', 'fa160002-0000-0000-0000-000000000003', 'Acute Hemolytic Transfusion Reaction (AHTR) Emergency Management', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa160004-0000-0000-0000-000000000003', 'fa160003-0000-0000-0000-000000000003', 'FNHTR Leukoreduction & TA-GvHD Gamma-Irradiation', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa160005-0000-0000-0000-000000000003', 'fa160004-0000-0000-0000-000000000003', 'Differential Diagnosis of TRALI vs TACO, Acute Hemolytic Reaction Management, and Leukoreduction/Irradiation Protocols', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa160006-0000-0000-0000-000000000003', 'fa160005-0000-0000-0000-000000000003', 'EXPLANATION', 1, 
'{"text": "### Transfusion Reactions Differential\n\nTRALI: Anti-HLA antibodies cause non-cardiogenic pulmonary edema, fever, hypotension, normal PCWP (<=18 mmHg), and normal BNP; diuretics contraindicated. TACO: Hydrostatic volume overload causes hypertension, afebrile state, JVD, elevated PCWP (>18 mmHg), and elevated BNP; responds rapidly to IV Furosemide. AHTR: Major ABO mismatch causes IgM complement-mediated intravascular hemolysis (fever, flank pain, hemoglobinuria, DIC); immediate transfusion cessation and aggressive IV normal saline hydration."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 4: Therapeutic Apheresis, Blood Safety (NAT) & Rh HDFN Immunoprophylaxis
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa160001-0000-0000-0000-000000000004', 'f1a9a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a12', 'Therapeutic Apheresis, Blood Safety (NAT) & Rh HDFN Immunoprophylaxis', 4)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa160002-0000-0000-0000-000000000004', 'fa160001-0000-0000-0000-000000000004', 'Therapeutic Plasma Exchange (TPE) in TTP & Myasthenia', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa160003-0000-0000-0000-000000000004', 'fa160002-0000-0000-0000-000000000004', 'Blood Safety Testing (NAT Window Period Reduction)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa160004-0000-0000-0000-000000000004', 'fa160003-0000-0000-0000-000000000004', 'Rh(D) Alloimmunization, Kleihauer-Betke Test & RhoGAM Dosing', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa160005-0000-0000-0000-000000000004', 'fa160004-0000-0000-0000-000000000004', 'Therapeutic Apheresis Modalities, Viral Nucleic Acid Testing, and Rh Alloimmunization Prevention with RhoGAM', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa160006-0000-0000-0000-000000000004', 'fa160005-0000-0000-0000-000000000004', 'EXPLANATION', 1, 
'{"text": "### Apheresis, Safety & Rh HDFN\n\nTherapeutic Plasma Exchange (TPE) is first-line for TTP (clears anti-ADAMTS13 antibodies; platelet transfusions contraindicated!). NAT dramatically shortens HIV/HCV/HBV window periods. Rh(D) HDFN occurs when maternal IgG Anti-D crosses placenta causing fetal hydrops. Prophylaxis: 300 mcg RhoGAM at 28 weeks and within 72 hours of delivery. Kleihauer-Betke acid elution calculates feto-maternal hemorrhage (FMH = % fetal cells x 5000 mL); 1 vial covers 30 mL fetal whole blood (+1 safety vial)."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;
