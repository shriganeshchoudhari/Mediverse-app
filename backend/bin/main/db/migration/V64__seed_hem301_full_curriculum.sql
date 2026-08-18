-- V64: Seed Clinical Hematology, Hemostasis & Oncology (HEM-301) Full Curriculum

-- Ensure Subject: HEM-301 exists with correct title and category
INSERT INTO subjects (id, semester_id, code, title, category)
VALUES ('f1d0a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a22', 'c7d8e9f0-b1c2-3d4e-5f6a-7b8c9d0e1f2a', 'HEM-301', 'Clinical Hematology, Hemostasis & Oncology', 'CLINICAL')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, category = EXCLUDED.category;

-- Unit 1: Primary vs Secondary Hemostasis & Platelet Disorders
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa260001-0000-0000-0000-000000000001', 'f1d0a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a22', 'Primary vs Secondary Hemostasis & Platelet Disorders', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa260002-0000-0000-0000-000000000001', 'fa260001-0000-0000-0000-000000000001', 'Immune Thrombocytopenic Purpura (ITP) vs TTP (ADAMTS13)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa260003-0000-0000-0000-000000000001', 'fa260002-0000-0000-0000-000000000001', 'Disseminated Intravascular Coagulation (DIC) Consumption', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa260004-0000-0000-0000-000000000001', 'fa260003-0000-0000-0000-000000000001', 'von Willebrand Disease, Bernard-Soulier, Glanzmann & Hemophilias', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa260005-0000-0000-0000-000000000001', 'fa260004-0000-0000-0000-000000000001', 'Platelet Adhesion and Aggregation Glycoproteins, ADAMTS13 Metalloprotease Kinetics, Fibrinogen Depletion, and Factor VIII/IX Mixing Studies', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa260006-0000-0000-0000-000000000001', 'fa260005-0000-0000-0000-000000000001', 'EXPLANATION', 1, 
'{"text": "### Primary vs Secondary Hemostasis\n\nITP: Anti-GpIIb/IIIa autoantibodies -> isolated low platelets, normal PT/PTT -> Steroids/IVIG. TTP: ADAMTS13 deficiency (<10%) -> ultra-large vWF multimers -> FAT RN Pentad (Fever, Anemia MAHA, Thrombocytopenia, Renal, Neuro). PT/PTT NORMAL! Treat with Emergent Plasma Exchange (PLEX) + Caplacizumab. Platelet transfusions strictly CONTRAINDICATED! DIC: Systemic activation -> high PT, high PTT, high D-dimer, low fibrinogen, low platelets, schistocytes. vWD: vWF defect (carries FVIII) -> high bleeding time, normal/high PTT, normal PT -> Desmopressin (DDAVP). Bernard-Soulier (GpIb defect, giant platelets) vs Glanzmann (GpIIb/IIIa defect). Hemophilia A (FVIII) / B (FIX): Elevated PTT, normal PT, deep hemarthroses; mixing study corrects."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 2: Anemia Algorithmic Diagnostic Profiling & Hemolysis
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa260001-0000-0000-0000-000000000002', 'f1d0a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a22', 'Anemia Algorithmic Diagnostic Profiling & Hemolysis', 2)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa260002-0000-0000-0000-000000000002', 'fa260001-0000-0000-0000-000000000002', 'Microcytic Anemias: Iron Deficiency, ACD & Thalassemia', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa260003-0000-0000-0000-000000000002', 'fa260002-0000-0000-0000-000000000002', 'Normocytic Hemolytic Anemias: Intravascular vs Extravascular', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa260004-0000-0000-0000-000000000002', 'fa260003-0000-0000-0000-000000000002', 'Macrocytic Megaloblastic Anemia: Vitamin B12 vs Folate Deficiencies', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa260005-0000-0000-0000-000000000002', 'fa260004-0000-0000-0000-000000000002', 'Serum Ferritin Thresholds, Mentzer Index Calculations, Corrected Reticulocyte Index, Haptoglobin Dynamics, and Methylmalonic Acid Biomarkers', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa260006-0000-0000-0000-000000000002', 'fa260005-0000-0000-0000-000000000002', 'EXPLANATION', 1, 
'{"text": "### Anemia Diagnostic Algorithms\n\nMicrocytic (MCV <80): Iron Deficiency (Low Iron, High TIBC, Ferritin <30, Transferrin Sat <15%, high RDW, pencil cells); Anemia of Chronic Disease (Low Iron, Low TIBC, Normal/High Ferritin, Hepcidin upregulation); Thalassemia Minor (Normal/High Ferritin, Mentzer Index MCV/RBC <13, Target cells, high HbA2 >3.5% in beta-thal); Sideroblastic (High Iron/Ferritin, Ringed sideroblasts). Normocytic (MCV 80-100): CRI >2% indicates active hemolysis/blood loss. Intravascular (low haptoglobin, high LDH, hemoglobinuria) vs Extravascular (spherocytes, positive Coombs DAT, splenomegaly). Macrocytic (MCV >100): Vitamin B12 deficiency (High MMA + High Homocysteine, subacute combined degeneration neuropathy) vs Folate deficiency (High Homocysteine only, normal MMA, no neuropathy)."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 3: Acute & Chronic Leukemias & Myeloproliferative Neoplasms
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa260001-0000-0000-0000-000000000003', 'f1d0a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a22', 'Acute & Chronic Leukemias & Myeloproliferative Neoplasms', 3)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa260002-0000-0000-0000-000000000003', 'fa260001-0000-0000-0000-000000000003', 'Acute Myeloid Leukemia (AML) & APL t(15;17) DIC Emergency', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa260003-0000-0000-0000-000000000003', 'fa260002-0000-0000-0000-000000000003', 'Acute Lymphoblastic Leukemia (ALL) & TdT Immunophenotyping', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa260004-0000-0000-0000-000000000003', 'fa260003-0000-0000-0000-000000000003', 'CML (BCR-ABL1), CLL (Smudge Cells) & JAK2 Myeloproliferative Neoplasms', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa260005-0000-0000-0000-000000000003', 'fa260004-0000-0000-0000-000000000003', 'Myeloperoxidase Auer Rods, All-trans Retinoic Acid Differentiation, Philadelphia Chromosome Tyrosine Kinase Inhibitors, and JAK2 V617F Panmyelosis', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa260006-0000-0000-0000-000000000003', 'fa260005-0000-0000-0000-000000000003', 'EXPLANATION', 1, 
'{"text": "### Leukemias & Myeloproliferative Neoplasms\n\nAML: >20% myeloblasts, Auer Rods (MPO+). APL t(15;17) PML-RARA -> high risk of fatal DIC -> emergency ATRA + Arsenic Trioxide (ATO) cures DIC! ALL: >20% lymphoblasts, TdT+, CD10+, pediatric peak. CML: t(9;22)(q34;q11) BCR-ABL1 constitutively active tyrosine kinase, low LAP score, full myeloid spectrum, basophilia -> Imatinib/Dasatinib. CLL: Mature CD5+ CD19+ CD23+ B-cells, Smudge/Basket cells -> BTK inhibitors (Ibrutinib). Polycythemia Vera: JAK2 V617F, low EPO, aquagenic pruritus -> phlebotomy + Hydroxyurea. Primary Myelofibrosis: Teardrop dacryocytes, dry tap marrow aspiration, massive splenomegaly."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 4: Plasma Cell Dyscrasias, Multiple Myeloma & Lymphomas
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa260001-0000-0000-0000-000000000004', 'f1d0a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a22', 'Plasma Cell Dyscrasias, Multiple Myeloma & Lymphomas', 4)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa260002-0000-0000-0000-000000000004', 'fa260001-0000-0000-0000-000000000004', 'Multiple Myeloma (CRAB Criteria) & MGUS Spectrum', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa260003-0000-0000-0000-000000000004', 'fa260002-0000-0000-0000-000000000004', 'Waldenström Macroglobulinemia IgM Hyperviscosity Syndrome', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa260004-0000-0000-0000-000000000004', 'fa260003-0000-0000-0000-000000000004', 'Hodgkin (Reed-Sternberg) vs Non-Hodgkin (DLBCL, Follicular, Burkitt)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa260005-0000-0000-0000-000000000004', 'fa260004-0000-0000-0000-000000000004', 'Serum Protein Electrophoresis M-Spike, Bence-Jones Cast Nephropathy, Reed-Sternberg CD15/CD30 Markers, and BCL2/c-MYC Oncogene Translocations', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa260006-0000-0000-0000-000000000004', 'fa260005-0000-0000-0000-000000000004', 'EXPLANATION', 1, 
'{"text": "### Plasma Cell Dyscrasias & Lymphomas\n\nMultiple Myeloma: Clonal plasma cells >=10% + CRAB criteria (Calcium >11, Renal Cr >2.0 cast nephropathy, Anemia, Bone lytic punched-out lesions on X-ray) + IgG/IgA M-spike on SPEP. MGUS: M-spike <3.0 g/dL, plasma cells <10%, NO CRAB. Waldenström: Monoclonal IgM -> Hyperviscosity syndrome (retinal sausage veins, mucosal bleeding, headache -> Plasmapheresis). Hodgkin Lymphoma: Reed-Sternberg cells (CD15+, CD30+, owl-eyed), B-symptoms, alcohol-induced lymph node pain. Non-Hodgkin: DLBCL (most common aggressive, CD20+ -> R-CHOP); Follicular (t(14;18) BCL2 overexpression, indolent waxing/waning); Burkitt (t(8;14) c-MYC, starry-sky histology, Ki-67 ~100%)."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;
