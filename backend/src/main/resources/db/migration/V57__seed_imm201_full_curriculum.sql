-- V57: Seed Clinical Immunology & Immunopathology (IMM-201) Full Curriculum

-- Ensure Subject: IMM-201 exists with correct title and category
INSERT INTO subjects (id, semester_id, code, title, category)
VALUES ('f1d9a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a15', 'c5d6e7f8-a9b0-1c2d-3e4f-5a6b7c8d9e0f', 'IMM-201', 'Clinical Immunology & Immunopathology', 'PARA_CLINICAL')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, category = EXCLUDED.category;

-- Unit 1: Innate Immunity, Complement Activation & Primary Immunodeficiencies
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa190001-0000-0000-0000-000000000001', 'f1d9a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a15', 'Innate Immunity, Complement Activation & Primary Immunodeficiencies', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa190002-0000-0000-0000-000000000001', 'fa190001-0000-0000-0000-000000000001', 'Classical, Alternative & Lectin Complement Cascades', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa190003-0000-0000-0000-000000000001', 'fa190002-0000-0000-0000-000000000001', 'Severe Combined Immunodeficiency (SCID) & Bruton Agammaglobulinemia (XLA)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa190004-0000-0000-0000-000000000001', 'fa190003-0000-0000-0000-000000000001', 'Chronic Granulomatous Disease & C1-INH Hereditary Angioedema', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa190005-0000-0000-0000-000000000001', 'fa190004-0000-0000-0000-000000000001', 'Innate Immunity Mechanisms, Complement Lytic Cascades, and Primary Immunodeficiency Disorders', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa190006-0000-0000-0000-000000000001', 'fa190005-0000-0000-0000-000000000001', 'EXPLANATION', 1, 
'{"text": "### Innate Immunity & Primary Immunodeficiencies\n\nComplement activation: Classical (C1q binding IgM/IgG -> C4b2a), Alternative (tickover/endotoxin -> C3bBb), Lectin (MBL/MASP -> C4b2a) pathways converge on C5 convertase -> C5b-9 Membrane Attack Complex (MAC). Primary immunodeficiencies: SCID (IL2RG/ADA defect -> absent T and B cells, absent thymic shadow, FTT -> emergent HSCT); XLA (BTK mutation -> absent B cells CD19+ <1%, pan-hypogammaglobulinemia); CVID (normal B cells, low Igs, bronchiectasis); CGD (NADPH oxidase defect -> catalase-positive infections, abnormal DHR flow assay); C1-INH deficiency (Hereditary Angioedema -> excess bradykinin, low C4, non-pruritic swelling without urticaria)."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 2: Gell & Coombs Hypersensitivity Reactions: Types I, II, III & IV
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa190001-0000-0000-0000-000000000002', 'f1d9a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a15', 'Gell & Coombs Hypersensitivity Reactions: Types I, II, III & IV', 2)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa190002-0000-0000-0000-000000000002', 'fa190001-0000-0000-0000-000000000002', 'Type I Immediate Hypersensitivity, Anaphylaxis & Epinephrine', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa190003-0000-0000-0000-000000000002', 'fa190002-0000-0000-0000-000000000002', 'Type II Antibody-Mediated Cytotoxic & Functional Diseases', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa190004-0000-0000-0000-000000000002', 'fa190003-0000-0000-0000-000000000002', 'Type III Immune Complex Vasculitis & Type IV Delayed Cell-Mediated Immunity', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa190005-0000-0000-0000-000000000002', 'fa190004-0000-0000-0000-000000000002', 'Gell & Coombs Classification, Anaphylaxis Management, Antibody Cytotoxicity, Immune Complex Vasculitis, and Delayed T-Cell Reactions', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa190006-0000-0000-0000-000000000002', 'fa190005-0000-0000-0000-000000000002', 'EXPLANATION', 1, 
'{"text": "### Hypersensitivity Reactions (Types I-IV)\n\nType I (Immediate / IgE): Mast cell/basophil degranulation (histamine, LTC4/D4/E4, tryptase) -> anaphylaxis, allergic asthma -> first-line IM Epinephrine 1:1000 (0.3-0.5 mg) in anterolateral thigh. Type II (Cytotoxic): IgG/IgM against cell-surface/matrix antigens (Goodpasture anti-GBM alpha3, Myasthenia Gravis anti-AChR, Graves anti-TSHR, Pemphigus anti-desmoglein 1/3). Type III (Immune Complex): Circulating antigen-antibody complexes deposit in vessels (Serum Sickness 7-14d post-exposure with fever, rash, arthralgias, low C3/C4; SLE nephritis). Type IV (Delayed-Type / T-Cell): CD4+/CD8+ T cells release IFN-gamma activating macrophages (PPD skin test 48-72h, contact dermatitis from poison ivy/nickel, GvHD)."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 3: Immunological Tolerance, HLA Associations & Autoantibody Profiles
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa190001-0000-0000-0000-000000000003', 'f1d9a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a15', 'Immunological Tolerance, HLA Associations & Autoantibody Profiles', 3)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa190002-0000-0000-0000-000000000003', 'fa190001-0000-0000-0000-000000000003', 'Central & Peripheral Tolerance (AIRE, FoxP3 Tregs, CTLA-4)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa190003-0000-0000-0000-000000000003', 'fa190002-0000-0000-0000-000000000003', 'HLA Class I/II Disease Associations (HLA-B27, DR4, DR3, DQ2/DQ8)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa190004-0000-0000-0000-000000000003', 'fa190003-0000-0000-0000-000000000003', 'Autoantibody Profiler (ANA, Anti-dsDNA, Anti-Smith, Anti-CCP, ANCA)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa190005-0000-0000-0000-000000000003', 'fa190004-0000-0000-0000-000000000003', 'Mechanisms of Self-Tolerance Breakdown, HLA Allelic Susceptibility, and Clinical Diagnostic Autoantibody Profiling', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa190006-0000-0000-0000-000000000003', 'fa190005-0000-0000-0000-000000000003', 'EXPLANATION', 1, 
'{"text": "### Autoimmunity & HLA Associations\n\nTolerance mechanisms: Central tolerance (AIRE in thymus -> negative selection; mutation -> APECED); Peripheral tolerance (FoxP3+ CD4+ CD25+ Tregs producing IL-10/TGF-beta; mutation -> IPEX). HLA associations: HLA-B27 (PAIR: Psoriatic arthritis, Ankylosing spondylitis, IBD spondylitis, Reactive arthritis); HLA-DR4 (Rheumatoid Arthritis); HLA-DQ2/DQ8 (Celiac disease); HLA-DR3 (T1DM, SLE). Diagnostic autoantibodies: Anti-Smith is most specific for SLE (>99%); Anti-dsDNA titers correlate directly with active lupus nephritis; Anti-CCP is most specific for RA (>95%); c-ANCA (PR3) for Granulomatosis with Polyangiitis; p-ANCA (MPO) for Microscopic Polyangiitis."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 4: Flow Cytometry Immunophenotyping & Targeted Monoclonal Biologics
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa190001-0000-0000-0000-000000000004', 'f1d9a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a15', 'Flow Cytometry Immunophenotyping & Targeted Monoclonal Biologics', 4)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa190002-0000-0000-0000-000000000004', 'fa190001-0000-0000-0000-000000000004', 'Flow Cytometry FSC/SSC Gating & CD Marker Subsets', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa190003-0000-0000-0000-000000000004', 'fa190002-0000-0000-0000-000000000004', 'HIV CD4+ T-Cell Staging & Opportunistic Prophylaxis', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa190004-0000-0000-0000-000000000004', 'fa190003-0000-0000-0000-000000000004', 'Monoclonal Biologics (Anti-TNF Latent TB Risk, Anti-CD20, Anti-IL-6R)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa190005-0000-0000-0000-000000000004', 'fa190004-0000-0000-0000-000000000004', 'Flow Cytometry Gating Principles, CD Lymphocyte Subset Enumeration, HIV Immune Staging, and Monoclonal Biologic Therapeutics', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa190006-0000-0000-0000-000000000004', 'fa190005-0000-0000-0000-000000000004', 'EXPLANATION', 1, 
'{"text": "### Flow Cytometry & Monoclonal Biologics\n\nFlow cytometry parameters: Forward scatter FSC (cell size) vs Side scatter SSC (internal granularity). CD markers: CD3/CD4/CD8 (T cells), CD19/CD20 (B cells), CD14 (monocytes), CD16/CD56 (NK cells), CD34 (stem cells). HIV CD4 staging: CD4 <200/uL mandates TMP-SMX for PCP; CD4 <100/uL mandates TMP-SMX for Toxoplasma; CD4 <50/uL mandates weekly Azithromycin for MAC. Monoclonal biologics: Anti-TNF-alpha (Infliximab, Adalimumab -> mandatory latent TB screening with IGRA/PPD prior to therapy due to granuloma dissolution); Anti-CD20 (Rituximab for B-cell lymphoma/RA); Anti-IL-6R (Tocilizumab for cytokine release syndrome)."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;
