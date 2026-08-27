-- V43: Seed Dermatology & Venereology (DERM-301) Full Curriculum

-- Ensure Subject: DERM-301 exists with correct title and category
INSERT INTO subjects (id, semester_id, code, title, category)
VALUES ('f6a7a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0b', 'c9d0e1f2-b3c4-5d6e-7f8a-9b0c1d2e3f4a', 'DERM-301', 'Dermatology & Venereology', 'CLINICAL')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, category = EXCLUDED.category;

-- Unit 1: Psoriasis Vulgaris & Papulosquamous Disorders
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa050001-0000-0000-0000-000000000001', 'f6a7a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0b', 'Psoriasis Vulgaris, Papulosquamous Disorders & Lichen Planus', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa050002-0000-0000-0000-000000000001', 'fa050001-0000-0000-0000-000000000001', 'Auspitz Sign, Koebner Phenomenon & Munro Abscesses', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa050003-0000-0000-0000-000000000001', 'fa050002-0000-0000-0000-000000000001', 'Psoriatic Arthritis & Nail Changes', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa050004-0000-0000-0000-000000000001', 'fa050003-0000-0000-0000-000000000001', 'Lichen Planus 6 Ps & Wickham Striae', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa050005-0000-0000-0000-000000000001', 'fa050004-0000-0000-0000-000000000001', 'Psoriasis Vulgaris, Auspitz Sign, Biologic Selection and Papulosquamous Dermatoses', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa050006-0000-0000-0000-000000000001', 'fa050005-0000-0000-0000-000000000001', 'EXPLANATION', 1, 
'{"text": "### Psoriasis Vulgaris & Papulosquamous Disorders\n\nPsoriasis is driven by the IL-23/IL-17A axis, presenting with extensor plaques, silvery scales, Auspitz sign (pinpoint bleeding), Koebner phenomenon, and Munro microabscesses. Systemic oral corticosteroids are strictly contraindicated due to risk of triggering von Zumbusch pustular psoriasis. Lichen planus features the 6 Ps on flexor surfaces and Wickham striae, associated with Hepatitis C."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 2: Bullous Dermatoses & Nikolsky Sign
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa050001-0000-0000-0000-000000000002', 'f6a7a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0b', 'Bullous Dermatoses, Pemphigus vs Pemphigoid & Nikolsky Sign', 2)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa050002-0000-0000-0000-000000000002', 'fa050001-0000-0000-0000-000000000002', 'Pemphigus Vulgaris Desmoglein-3 & Fishnet DIF', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa050003-0000-0000-0000-000000000002', 'fa050002-0000-0000-0000-000000000002', 'Bullous Pemphigoid BP180/BP230 & Linear DIF', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa050004-0000-0000-0000-000000000002', 'fa050003-0000-0000-0000-000000000002', 'Dermatitis Herpetiformis & Celiac Disease IgA', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa050005-0000-0000-0000-000000000002', 'fa050004-0000-0000-0000-000000000002', 'Autoimmune Blistering Diseases, Cleavage Planes, Immunofluorescence and Nikolsky Sign', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa050006-0000-0000-0000-000000000002', 'fa050005-0000-0000-0000-000000000002', 'EXPLANATION', 1, 
'{"text": "### Autoimmune Bullous Dermatoses\n\nPemphigus vulgaris targets Desmoglein-3, producing intraepidermal suprabasal acantholysis, flaccid bullae, oral ulcers (>90%), positive Nikolsky sign, and fishnet intercellular DIF, treated with Rituximab. Bullous pemphigoid targets hemidesmosomes (BP180/BP230), producing subepidermal tense bullae and linear BMZ DIF with negative Nikolsky sign."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 3: Malignant Melanoma & Skin Cancers
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa050001-0000-0000-0000-000000000003', 'f6a7a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0b', 'Malignant Melanoma ABCDE, Breslow Depth & Non-Melanoma Cancers', 3)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa050002-0000-0000-0000-000000000003', 'fa050001-0000-0000-0000-000000000003', 'Melanoma ABCDE Criteria & Ugly Duckling Sign', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa050003-0000-0000-0000-000000000003', 'fa050002-0000-0000-0000-000000000003', 'Breslow Thickness & Sentinel Lymph Node Biopsy', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa050004-0000-0000-0000-000000000003', 'fa050003-0000-0000-0000-000000000003', 'Basal Cell Carcinoma vs Squamous Cell Carcinoma', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa050005-0000-0000-0000-000000000003', 'fa050004-0000-0000-0000-000000000003', 'Cutaneous Malignancies, Breslow Depth Staging, Mohs Micrographic Surgery and Targeted Therapy', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa050006-0000-0000-0000-000000000003', 'fa050005-0000-0000-0000-000000000003', 'EXPLANATION', 1, 
'{"text": "### Cutaneous Oncology & Melanoma\n\nMelanoma evaluation uses ABCDE criteria (Asymmetry, Border, Color, Diameter >6mm, Evolution). Breslow depth in millimeters is the #1 prognostic indicator determining surgical margins and sentinel lymph node biopsy. BCC features pearly papules with telangiectasias (Mohs surgery); SCC features keratin pearls and actinic keratosis precursors."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 4: Severe Drug Reactions, SJS/TEN & DRESS
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa050001-0000-0000-0000-000000000004', 'f6a7a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0b', 'Severe Cutaneous Adverse Reactions, SJS, TEN & DRESS Syndrome', 4)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa050002-0000-0000-0000-000000000004', 'fa050001-0000-0000-0000-000000000004', 'SJS vs TEN TBSA Epidermal Detachment', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa050003-0000-0000-0000-000000000004', 'fa050002-0000-0000-0000-000000000004', 'SCORTEN Mortality Prognostication Engine', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa050004-0000-0000-0000-000000000004', 'fa050003-0000-0000-0000-000000000004', 'DRESS Syndrome Facial Edema & Eosinophilia', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa050005-0000-0000-0000-000000000004', 'fa050004-0000-0000-0000-000000000004', 'Severe Cutaneous Adverse Drug Reactions, SCORTEN Severity and Emergency Burn Center Triage', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa050006-0000-0000-0000-000000000004', 'fa050005-0000-0000-0000-000000000004', 'EXPLANATION', 1, 
'{"text": "### Severe Cutaneous Adverse Drug Reactions\n\nSJS (<10% TBSA), SJS/TEN overlap (10-30%), and TEN (>30% TBSA) feature Granulysin/FasL-mediated full-thickness epidermal necrosis and positive Nikolsky sign triggered by Allopurinol, Sulfa, or Anticonvulsants. Mortality is predicted by SCORTEN, requiring immediate Burn Unit transfer. DRESS presents with delayed rash, facial edema, eosinophilia, and hepatitis."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;
