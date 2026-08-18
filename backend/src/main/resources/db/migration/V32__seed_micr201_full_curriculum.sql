-- V32: Seed Medical Microbiology & Immunology (MICR-201) Full Curriculum

-- Ensure Subject: MICR-201 exists with correct title and category
INSERT INTO subjects (id, semester_id, code, title, category)
VALUES ('f5c6d7e8-f9a0-1b2c-3d4e-5f6a7b8c9d0e', 'c5d6e7f8-a9b0-1c2d-3e4f-5a6b7c8d9e0f', 'MICR-201', 'Medical Microbiology & Immunology', 'PARA_CLINICAL')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, category = EXCLUDED.category;

-- Unit 1: Immunology & Coombs Hypersensitivity
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('d1010001-0000-0000-0000-000000000001', 'f5c6d7e8-f9a0-1b2c-3d4e-5f6a7b8c9d0e', 'Immunology & Hypersensitivity Reactions', 1)
ON CONFLICT DO NOTHING;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('d1010002-0000-0000-0000-000000000001', 'd1010001-0000-0000-0000-000000000001', 'MHC Presentation, Coombs Types I-IV & Immunodeficiency', 1)
ON CONFLICT DO NOTHING;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('d1010003-0000-0000-0000-000000000001', 'd1010002-0000-0000-0000-000000000001', 'MHC Class I vs II and ACID Hypersensitivity', 1)
ON CONFLICT DO NOTHING;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('d1010004-0000-0000-0000-000000000001', 'd1010003-0000-0000-0000-000000000001', 'Bruton XLA, SCID, DiGeorge & Wiskott-Aldrich', 1)
ON CONFLICT DO NOTHING;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('d1010005-0000-0000-0000-000000000001', 'd1010004-0000-0000-0000-000000000001', 'Innate Immunity, Hypersensitivity Types I-IV and Immunodeficiencies', 'PUBLISHED', 1)
ON CONFLICT DO NOTHING;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('d1010006-0000-0000-0000-000000000001', 'd1010005-0000-0000-0000-000000000001', 'EXPLANATION', 1, 
'{"text": "### Innate & Adaptive Immunology\n\nType I hypersensitivity is IgE-mediated mast cell degranulation. Type II is antibody-mediated cytotoxic injury (Goodpasture, Myasthenia). Type III is immune complex vasculitis (SLE). Type IV is delayed-type T-cell mediated (PPD, Contact Dermatitis). Bruton XLA is caused by BTK mutation blocking pre-B development."}'::jsonb)
ON CONFLICT DO NOTHING;

-- Unit 2: Systematic Bacteriology & Diagnostic Flowcharts
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('d1010001-0000-0000-0000-000000000002', 'f5c6d7e8-f9a0-1b2c-3d4e-5f6a7b8c9d0e', 'Systematic Bacteriology & Flowcharts', 2)
ON CONFLICT DO NOTHING;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('d1010002-0000-0000-0000-000000000002', 'd1010001-0000-0000-0000-000000000002', 'Gram-Positive Cocci & Enterobacteriaceae', 1)
ON CONFLICT DO NOTHING;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('d1010003-0000-0000-0000-000000000002', 'd1010002-0000-0000-0000-000000000002', 'Catalase, Coagulase, Hemolysis & MacConkey Agar', 1)
ON CONFLICT DO NOTHING;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('d1010004-0000-0000-0000-000000000002', 'd1010003-0000-0000-0000-000000000002', 'S. aureus, GAS, S. pneumoniae & Pseudomonas', 1)
ON CONFLICT DO NOTHING;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('d1010005-0000-0000-0000-000000000002', 'd1010004-0000-0000-0000-000000000002', 'Systematic Bacteriology and Diagnostic Laboratory Algorithms', 'PUBLISHED', 1)
ON CONFLICT DO NOTHING;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('d1010006-0000-0000-0000-000000000002', 'd1010005-0000-0000-0000-000000000002', 'EXPLANATION', 1, 
'{"text": "### Systematic Bacteriology\n\nStaphylococcus aureus is catalase and coagulase positive. Streptococcus pyogenes is beta-hemolytic and bacitracin sensitive. Pseudomonas aeruginosa is an oxidase-positive non-lactose fermenter producing pyocyanin blue-green pigment."}'::jsonb)
ON CONFLICT DO NOTHING;

-- Unit 3: Bacterial Toxins & Virulence Factors
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('d1010001-0000-0000-0000-000000000003', 'f5c6d7e8-f9a0-1b2c-3d4e-5f6a7b8c9d0e', 'Bacterial Toxins & Virulence Mechanisms', 3)
ON CONFLICT DO NOTHING;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('d1010002-0000-0000-0000-000000000003', 'd1010001-0000-0000-0000-000000000003', 'A-B Toxins, Superantigens & Endotoxin Shock', 1)
ON CONFLICT DO NOTHING;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('d1010003-0000-0000-0000-000000000003', 'd1010002-0000-0000-0000-000000000003', 'ADP-Ribosylation, SNARE Cleavage & TSST-1', 1)
ON CONFLICT DO NOTHING;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('d1010004-0000-0000-0000-000000000003', 'd1010003-0000-0000-0000-000000000003', 'Diphtheria, Cholera, Tetanus, Botulism & LPS Lipid A', 1)
ON CONFLICT DO NOTHING;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('d1010005-0000-0000-0000-000000000003', 'd1010004-0000-0000-0000-000000000003', 'Bacterial Exotoxins, Neurotoxins and Endotoxin Shock', 'PUBLISHED', 1)
ON CONFLICT DO NOTHING;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('d1010006-0000-0000-0000-000000000003', 'd1010005-0000-0000-0000-000000000003', 'EXPLANATION', 1, 
'{"text": "### Bacterial Toxins\n\nDiphtheria toxin inactivates EF-2 halting protein synthesis. Cholera toxin permanently activates Gs alpha increasing cAMP and watery diarrhea. Tetanospasmin cleaves synaptobrevin blocking glycine/GABA release, causing spastic paralysis."}'::jsonb)
ON CONFLICT DO NOTHING;

-- Unit 4: Virology & Viral Hepatitis Serology
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('d1010001-0000-0000-0000-000000000004', 'f5c6d7e8-f9a0-1b2c-3d4e-5f6a7b8c9d0e', 'Virology, HBV Serology & HIV Stages', 4)
ON CONFLICT DO NOTHING;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('d1010002-0000-0000-0000-000000000004', 'd1010001-0000-0000-0000-000000000004', 'Hepatitis B Markers, HIV CD4 Stages & Herpesviruses', 1)
ON CONFLICT DO NOTHING;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('d1010003-0000-0000-0000-000000000004', 'd1010002-0000-0000-0000-000000000004', 'HBV Window Period and HIV Opportunistic Thresholds', 1)
ON CONFLICT DO NOTHING;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('d1010004-0000-0000-0000-000000000004', 'd1010003-0000-0000-0000-000000000004', 'HBsAg, Anti-HBc, CD4 <200 PCP & CMV Retinitis', 1)
ON CONFLICT DO NOTHING;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('d1010005-0000-0000-0000-000000000004', 'd1010004-0000-0000-0000-000000000004', 'Hepatitis B Serology, HIV Opportunistic Stages and Herpesviruses', 'PUBLISHED', 1)
ON CONFLICT DO NOTHING;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('d1010006-0000-0000-0000-000000000004', 'd1010005-0000-0000-0000-000000000004', 'EXPLANATION', 1, 
'{"text": "### Virology & HBV Serology\n\nAnti-HBc IgM is the only positive marker during the Hepatitis B window period. Anti-HBs alone indicates vaccination. HIV CD4 <200 requires TMP-SMX prophylaxis for Pneumocystis jirovecii pneumonia."}'::jsonb)
ON CONFLICT DO NOTHING;
