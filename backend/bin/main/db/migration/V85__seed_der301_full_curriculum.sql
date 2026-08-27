-- V85: Seed Advanced Dermatology & Cutaneous Oncology (DER-301) Full Curriculum

-- Ensure Subject: DER-301 exists with correct title and category
INSERT INTO subjects (id, semester_id, code, title, category)
VALUES ('f1d0a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a43', 'c7d8e9f0-b1c2-3d4e-5f6a-7b8c9d0e1f2a', 'DER-301', 'Advanced Dermatology & Cutaneous Oncology', 'CLINICAL')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, category = EXCLUDED.category;

-- Unit 1: Cutaneous Emergencies & Severe Drug Reactions
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa480001-0000-0000-0000-000000000001', 'f1d0a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a43', 'Cutaneous Emergencies & Severe Drug Reactions', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa480002-0000-0000-0000-000000000001', 'fa480001-0000-0000-0000-000000000001', 'Stevens-Johnson Syndrome (SJS) & Toxic Epidermal Necrolysis (TEN)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa480003-0000-0000-0000-000000000001', 'fa480002-0000-0000-0000-000000000001', 'SCORTEN Prognostic Scoring, Nikolsky Sign & Burn ICU Care', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa480004-0000-0000-0000-000000000001', 'fa480003-0000-0000-0000-000000000001', 'SSSS Desmoglein-1 Cleavage & DRESS Syndrome (HHV-6 Reactivation)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa480005-0000-0000-0000-000000000001', 'fa480004-0000-0000-0000-000000000001', 'Cytotoxic Granulysin Epidermolyses, Staphylococcal Exfoliatin Subcorneal Splits, Eosinophilic Visceral Infiltrations, and Burn Center Barrier Protocols', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa480006-0000-0000-0000-000000000001', 'fa480005-0000-0000-0000-000000000001', 'EXPLANATION', 1, 
'{"text": "### Cutaneous Emergencies & Severe Drug Reactions\n\nSJS/TEN: Granulysin/Fas-FasL mediated full-thickness epidermal necrosis; SJS (<10% BSA) vs SJS/TEN (10-30%) vs TEN (>30% BSA); positive Nikolsky sign, severe mucosal involvement (>=2 sites); SCORTEN prognostic scoring; managed in Burn ICU. SSSS: Staph aureus exfoliative toxins ETA/ETB cleave Desmoglein-1 in stratum granulosum; mucous membranes SPARED -> IV Nafcillin. DRESS: Delayed (2-8w) hypersensitivity with HHV-6 reactivation; facial edema, eosinophilia >700/uL, hepatitis -> Systemic Corticosteroids."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 2: Autoimmune Bullous Dermatoses & Immunofluorescence
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa480001-0000-0000-0000-000000000002', 'f1d0a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a43', 'Autoimmune Bullous Dermatoses & Immunofluorescence', 2)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa480002-0000-0000-0000-000000000002', 'fa480001-0000-0000-0000-000000000002', 'Pemphigus Vulgaris (Desmoglein-3/1) & Suprabasal Acantholysis', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa480003-0000-0000-0000-000000000002', 'fa480002-0000-0000-0000-000000000002', 'Bullous Pemphigoid (BP180/BP230) & Subepidermal Tense Bullae', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa480004-0000-0000-0000-000000000002', 'fa480003-0000-0000-0000-000000000002', 'Dermatitis Herpetiformis (eTG-3 IgA) & Celiac Enteropathy (Dapsone)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa480005-0000-0000-0000-000000000002', 'fa480004-0000-0000-0000-000000000002', 'Desmosomal Cadherin Autoimmunities, Hemidesmosomal Collagen XVII Cleftings, Transglutaminase Papillary Microabscesses, and Monoclonal B-Cell Depletions', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa480006-0000-0000-0000-000000000002', 'fa480005-0000-0000-0000-000000000002', 'EXPLANATION', 1, 
'{"text": "### Autoimmune Bullous Dermatoses\n\nPemphigus Vulgaris: IgG against Desmoglein-3 and 1; suprabasal acantholysis with tombstone basal cells; flaccid bullae, oral ulcers, positive Nikolsky; DIF shows intercellular fishnet IgG/C3; treated with Steroids + Rituximab. Bullous Pemphigoid: IgG against BP180 (Col XVII) and BP230 hemidesmosomes; subepidermal blister with eosinophils; tense bullae, negative Nikolsky, mucosal sparing; DIF shows linear BMZ IgG; treated with topical Clobetasol. Dermatitis Herpetiformis: IgA against eTG-3 linked to Celiac disease; extensor papulovesicles; granular IgA in dermal papillae; treated with Dapsone + Gluten-Free Diet."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 3: Cutaneous Malignancies, Melanoma & Mohs Surgery
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa480001-0000-0000-0000-000000000003', 'f1d0a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a43', 'Cutaneous Malignancies, Melanoma & Mohs Surgery', 3)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa480002-0000-0000-0000-000000000003', 'fa480001-0000-0000-0000-000000000003', 'Malignant Melanoma Breslow Depth Staging & BRAF V600E Therapy', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa480003-0000-0000-0000-000000000003', 'fa480002-0000-0000-0000-000000000003', 'Basal Cell Carcinoma (PTCH1) & Mohs Micrographic Surgery', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa480004-0000-0000-0000-000000000003', 'fa480003-0000-0000-0000-000000000003', 'Squamous Cell Carcinoma (SCC), Actinic Keratosis & Marjolin Ulcer', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa480005-0000-0000-0000-000000000003', 'fa480004-0000-0000-0000-000000000003', 'Melanocytic Breslow Depths, Mitogen-Activated Protein Kinase Inactivations, Sonic Hedgehog Smoothened Reliances, and Micrographic Margin Assessments', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa480006-0000-0000-0000-000000000003', 'fa480005-0000-0000-0000-000000000003', 'EXPLANATION', 1, 
'{"text": "### Cutaneous Malignancies & Mohs Surgery\n\nMelanoma: ABCDE criteria; Breslow depth microstaging (<=1mm -> 1cm margin; >1mm -> 1-2cm margin + Sentinel Lymph Node Biopsy SLNB); BRAF V600E mutation treated with Dabrafenib + Trametinib; Anti-PD-1 (Pembrolizumab). Basal Cell Carcinoma: PTCH1 mutation; pearly papule with arborizing telangiectasias and palisading; Mohs micrographic surgery (100% margin examination for face/ears). Squamous Cell Carcinoma: Actinic keratosis precursor; Marjolin ulcer in chronic burn scars carries high metastatic rate."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 4: Inflammatory & Infectious Dermatoses: Psoriasis & Necrotizing Fasciitis
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa480001-0000-0000-0000-000000000004', 'f1d0a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a43', 'Inflammatory & Infectious Dermatoses: Psoriasis & Necrotizing Fasciitis', 4)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa480002-0000-0000-0000-000000000004', 'fa480001-0000-0000-0000-000000000004', 'Psoriasis Vulgaris Auspitz Sign, Koebner & IL-17A/IL-23 Biologics', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa480003-0000-0000-0000-000000000004', 'fa480002-0000-0000-0000-000000000004', 'Necrotizing Fasciitis LRINEC Score, Crepitus & Emergent Debridement', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa480004-0000-0000-0000-000000000004', 'fa480003-0000-0000-0000-000000000004', 'Atopic Dermatitis (Filaggrin / Dupilumab) & Pyoderma Gangrenosum Pathergy', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa480005-0000-0000-0000-000000000004', 'fa480004-0000-0000-0000-000000000004', 'Interleukin-17A Hyperkeratinizations, Liquefactive Fascial Necroses, Bacterial Exotoxin Superantigen Halts, and Radical Operative Debridements', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa480006-0000-0000-0000-000000000004', 'fa480005-0000-0000-0000-000000000004', 'EXPLANATION', 1, 
'{"text": "### Psoriasis Biologics & Necrotizing Soft Tissue Infections\n\nPsoriasis: IL-23/Th17/IL-17A axis; Auspitz sign (punctate bleeding), Koebner phenomenon, Munro microabscesses; treated with Secukinumab (IL-17A) or Guselkumab (IL-23). Necrotizing Fasciitis: Type I (polymicrobial) vs Type II (GAS); severe pain out of proportion, crepitus, skin anesthesia; LRINEC score >=6; IMMEDIATE RADICAL SURGICAL DEBRIDEMENT (never delay for MRI) + IV Vancomycin + Zosyn + Clindamycin (halts exotoxin synthesis). Atopic Dermatitis: Filaggrin mutation, elevated IgE -> Dupilumab (anti-IL-4Ra)."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;
