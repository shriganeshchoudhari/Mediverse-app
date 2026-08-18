-- V71: Seed Pediatric Pathophysiology & Neonatal Intensive Care (PEDS-301) Full Curriculum

-- Ensure Subject: PEDS-301 exists with correct title and category
INSERT INTO subjects (id, semester_id, code, title, category)
VALUES ('f1d0a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a29', 'c7d8e9f0-b1c2-3d4e-5f6a-7b8c9d0e1f2a', 'PEDS-301', 'Pediatric Pathophysiology & Neonatal Intensive Care', 'CLINICAL')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, category = EXCLUDED.category;

-- Unit 1: Congenital Heart Defects: Cyanotic 5 Ts vs Acyanotic Shunts
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa330001-0000-0000-0000-000000000001', 'f1d0a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a29', 'Congenital Heart Defects: Cyanotic 5 Ts vs Acyanotic Shunts', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa330002-0000-0000-0000-000000000001', 'fa330001-0000-0000-0000-000000000001', 'Cyanotic 5 Ts (Tetralogy of Fallot PROVe & TGA PGE1 Infusion)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa330003-0000-0000-0000-000000000001', 'fa330002-0000-0000-0000-000000000001', 'Truncus Arteriosus, TAPVR Snowman Sign & Tricuspid Atresia', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa330004-0000-0000-0000-000000000001', 'fa330003-0000-0000-0000-000000000001', 'Acyanotic Left-to-Right Shunts (VSD, ASD, PDA) & Coarctation of Aorta', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa330005-0000-0000-0000-000000000001', 'fa330004-0000-0000-0000-000000000001', 'Infundibular Septal Displacements, Spiraling Aorticopulmonary Transpositions, Ductal Prostaglandin Hemodynamics, and Eisenmenger Microvascular Remodelings', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa330006-0000-0000-0000-000000000001', 'fa330005-0000-0000-0000-000000000001', 'EXPLANATION', 1, 
'{"text": "### Congenital Heart Defects\n\nCyanotic 5 Ts (Right-to-Left Shunt): 1 T: Truncus Arteriosus (failure of septation, DiGeorge 22q11.2); 2 Ts: Transposition of Great Arteries (TGA - aorta from RV, pulm artery from LV, \"egg-on-a-string\" CXR -> emergency PGE1 Alprostadil infusion); 3 Ts: Tricuspid Atresia (hypoplastic RV, requires ASD+VSD); 4 Ts: Tetralogy of Fallot (PROVe: Pulmonary stenosis, RVH, Overriding aorta, VSD; \"boot-shaped\" heart, tet spells relieved by SQUATTING); 5 Ts: TAPVR (\"snowman\" sign). Acyanotic (Left-to-Right): VSD (holosystolic murmur at LLSB), ASD (fixed split S2), PDA (continuous machine murmur -> Indomethacin closure), Coarctation of Aorta (upper HTN, radio-femoral delay, rib notching, Turner syndrome)."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 2: Neonatal Respiratory Distress: Surfactant RDS, TTN & Meconium Aspiration
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa330001-0000-0000-0000-000000000002', 'f1d0a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a29', 'Neonatal Respiratory Distress: Surfactant RDS, TTN & Meconium Aspiration', 2)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa330002-0000-0000-0000-000000000002', 'fa330001-0000-0000-0000-000000000002', 'Surfactant Deficiency RDS (Hyaline Membrane Disease & DPPC)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa330003-0000-0000-0000-000000000002', 'fa330002-0000-0000-0000-000000000002', 'Transient Tachypnea of Newborn TTN (Elective C-Section Fluid Lag)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa330004-0000-0000-0000-000000000002', 'fa330003-0000-0000-0000-000000000002', 'Meconium Aspiration Syndrome MAS & Bronchopulmonary Dysplasia BPD', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa330005-0000-0000-0000-000000000002', 'fa330004-0000-0000-0000-000000000002', 'Type II Pneumocyte Dipalmitoylphosphatidylcholine Biosyntheses, Laplace Alveolar Instabilities, ENaC Fluid Resorption Kinetics, and Hyperoxic Retinal Neovascularizations', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa330006-0000-0000-0000-000000000002', 'fa330005-0000-0000-0000-000000000002', 'EXPLANATION', 1, 
'{"text": "### Neonatal Respiratory Distress\n\nSurfactant Deficiency RDS: Prematurity (<34w), Type II pneumocyte immaturity, DPPC deficiency. CXR: Diffuse reticulogranular \"ground-glass\" opacities with air bronchograms -> Antenatal Betamethasone + Postnatal Endotracheal Surfactant + CPAP. Transient Tachypnea of Newborn (TTN): Elective C-section without labor -> Delayed fluid clearance (ENaC lag). CXR: Perihilar streaking, fluid in fissures -> Self-resolves in 24-72h. Meconium Aspiration Syndrome (MAS): Post-term (>41w) fetal hypoxia -> Vagal gasping. CXR: Coarse patchy infiltrates -> Risk of PPHN (inhaled Nitric Oxide iNO). Bronchopulmonary Dysplasia (BPD): Oxygen dependency at 36w PMA."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 3: Pediatric GI Emergencies: Pyloric Stenosis, Intussusception & Volvulus
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa330001-0000-0000-0000-000000000003', 'f1d0a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a29', 'Pediatric GI Emergencies: Pyloric Stenosis, Intussusception & Volvulus', 3)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa330002-0000-0000-0000-000000000003', 'fa330001-0000-0000-0000-000000000003', 'Infantile Pyloric Stenosis (Hypochloremic Hypokalemic Alkalosis)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa330003-0000-0000-0000-000000000003', 'fa330002-0000-0000-0000-000000000003', 'Intussusception Telescoping (Currant Jelly Stools & Air Enema)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa330004-0000-0000-0000-000000000003', 'fa330003-0000-0000-0000-000000000003', 'Midgut Malrotation with Volvulus (Ladd Procedure) & NEC', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa330005-0000-0000-0000-000000000003', 'fa330004-0000-0000-0000-000000000003', 'Gastric Acid Secretory Depletions, Paradoxical Collecting Duct Acidurias, Ileocecal Invagination Lead Points, and Superior Mesenteric Embryonic Derotations', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa330006-0000-0000-0000-000000000003', 'fa330005-0000-0000-0000-000000000003', 'EXPLANATION', 1, 
'{"text": "### Pediatric GI Emergencies\n\nInfantile Hypertrophic Pyloric Stenosis (IHPS): 3-6w old, non-bilious projectile vomiting, palpable \"olive\" mass in RUQ. Pathognomonic: Hypochloremic, Hypokalemic Metabolic Alkalosis -> MUST CORRECT ELECTROLYTES WITH IV SALINE BEFORE Ramstedt pyloromyotomy! Intussusception: 6-36m old, colicky pain (legs to chest), \"currant jelly\" stools (blood+mucus), sausage mass in RUQ, US target sign -> Air or Hydrostatic Contrast Enema reduction (>85% success). Midgut Volvulus: Sudden BILIOUS (green) vomiting in newborn, Upper GI \"corkscrew\" duodenum -> Emergency Ladd Procedure. Necrotizing Enterocolitis (NEC): Preterm formula infant, pneumatosis intestinalis."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 4: Pediatric Immunodeficiencies & Inborn Errors of Metabolism
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa330001-0000-0000-0000-000000000004', 'f1d0a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a29', 'Pediatric Immunodeficiencies & Inborn Errors of Metabolism', 4)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa330002-0000-0000-0000-000000000004', 'fa330001-0000-0000-0000-000000000004', 'SCID (Absent Thymus & T Cells) vs Bruton XLA (Absent B Cells)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa330003-0000-0000-0000-000000000004', 'fa330002-0000-0000-0000-000000000004', 'Wiskott-Aldrich (WATER Triad) & Chronic Granulomatous Disease', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa330004-0000-0000-0000-000000000004', 'fa330003-0000-0000-0000-000000000004', 'Phenylketonuria PKU (Mousy Odor) & Galactosemia (Cataracts & E. Coli)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa330005-0000-0000-0000-000000000004', 'fa330004-0000-0000-0000-000000000004', 'Thymic Hypoplasia Cytokine Signaling Blocks, Bruton Tyrosine Kinase Arrests, Phenylalanine Hydroxylase Disruptions, and Galactose-1-Phosphate Toxicity Cascades', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa330006-0000-0000-0000-000000000004', 'fa330005-0000-0000-0000-000000000004', 'EXPLANATION', 1, 
'{"text": "### Immunodeficiencies & Inborn Errors\n\nSCID: IL2RG/ADA defect -> Absent T cells, ABSENT THYMIC SHADOW on CXR, severe infections in early infancy -> Bone marrow transplant. Bruton XLA: BTK defect -> Absent mature B cells (CD19/20), absent tonsils, pyogenic infections after 6-9 months -> IVIG. Wiskott-Aldrich (WAS): WATER triad (Wiskott-Aldrich, Thrombocytopenia with microplatelets, Eczema, Recurrent infections). Phenylketonuria (PKU): PAH defect -> Intellectual disability, fair skin/eyes, \"musty/mousy\" body odor -> Low phenylalanine diet. Classic Galactosemia: GALT defect -> Jaundice, hepatomegaly, bilateral \"oil-drop\" cataracts, fatal E. coli neonatal sepsis upon milk feeding -> Eliminate galactose/lactose."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;
