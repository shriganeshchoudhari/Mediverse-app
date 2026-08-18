-- V75: Seed Clinical Immunology & Advanced Immunotherapeutics (IMM-301) Full Curriculum

-- Ensure Subject: IMM-301 exists with correct title and category
INSERT INTO subjects (id, semester_id, code, title, category)
VALUES ('f1d0a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a33', 'c7d8e9f0-b1c2-3d4e-5f6a-7b8c9d0e1f2a', 'IMM-301', 'Clinical Immunology & Advanced Immunotherapeutics', 'CLINICAL')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, category = EXCLUDED.category;

-- Unit 1: Cellular Mechanisms of Hypersensitivity Types I to IV
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa370001-0000-0000-0000-000000000001', 'f1d0a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a33', 'Cellular Mechanisms of Hypersensitivity Types I to IV', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa370002-0000-0000-0000-000000000001', 'fa370001-0000-0000-0000-000000000001', 'Type I (Immediate IgE & Mast Cell Degranulation in Anaphylaxis)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa370003-0000-0000-0000-000000000001', 'fa370002-0000-0000-0000-000000000001', 'Type II (Cytotoxic Autoantibody CDC & ADCC in Goodpasture & Graves)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa370004-0000-0000-0000-000000000001', 'fa370003-0000-0000-0000-000000000001', 'Type III (Immune Complex Vasculitis in SLE) & Type IV (Delayed T-Cell Lysis)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa370005-0000-0000-0000-000000000001', 'fa370004-0000-0000-0000-000000000001', 'High-Affinity Fc-Epsilon-RI Mast Cell Degranulations, Complement-Dependent Membrane Attack Lyses, Soluble Immune Complex Microvascular Deposition Neutrophil Vasculitides, and Delayed CD4/CD8 T-Cell Granulomatous Hypersensitivities', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa370006-0000-0000-0000-000000000001', 'fa370005-0000-0000-0000-000000000001', 'EXPLANATION', 1, 
'{"text": "### Gell-Coombs Hypersensitivity Pathways\n\nType I (Immediate): IgE cross-linking on mast cells -> histamine, LTC4/D4/E4 -> Anaphylaxis (IM Epinephrine). Type II (Cytotoxic): IgG/IgM surface binding -> Complement CDC / ADCC -> Goodpasture (linear anti-GBM), AIHA, Graves, Myasthenia. Type III (Immune Complex): Circulating Ag-Ab complexes deposit in microvasculature -> C3a/C5a complement -> neutrophil vasculitis -> Lupus nephritis (lumpy-bumpy), PSGN, Serum Sickness (low C3/C4). Type IV (Delayed T-Cell): Purely cellular (NO antibodies) -> CD4+ Th1 (IFN-gamma macrophages) & CD8+ CTLs -> PPD skin test, contact dermatitis, Type 1 DM, GVHD."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 2: Targeted Biologics, Monoclonal Antibodies & Black Box Warnings
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa370001-0000-0000-0000-000000000002', 'f1d0a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a33', 'Targeted Biologics, Monoclonal Antibodies & Black Box Warnings', 2)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa370002-0000-0000-0000-000000000002', 'fa370001-0000-0000-0000-000000000002', 'Anti-TNF (Infliximab) & Mandatory Latent TB Granuloma Screening', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa370003-0000-0000-0000-000000000002', 'fa370002-0000-0000-0000-000000000002', 'Anti-CD20 (Rituximab) B-Cell Depletion & JC Virus PML Warnings', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa370004-0000-0000-0000-000000000002', 'fa370003-0000-0000-0000-000000000002', 'Anti-IL-6R (Tocilizumab) and Anti-C5 (Eculizumab Meningococcal Vaccines)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa370005-0000-0000-0000-000000000002', 'fa370004-0000-0000-0000-000000000002', 'Macrophage Granuloma Disruption Pathologies, Progressive Multifocal Leukoencephalopathy Viral Reactivations, Interleukin-6 Receptor Competitive Blockades, and Terminal Complement Membrane Attack Complex Neutralizations', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa370006-0000-0000-0000-000000000002', 'fa370005-0000-0000-0000-000000000002', 'EXPLANATION', 1, 
'{"text": "### Targeted Biologics & Monoclonal Antibodies\n\nAnti-TNF (Infliximab, Adalimumab): Neutralizes TNF-alpha required for macrophage granulomas -> Disseminated latent TB reactivation (mandatory PPD / QuantiFERON pre-screening). Anti-CD20 (Rituximab): Lyses pre-B and mature B cells via CDC/ADCC (spares plasma cells) -> JC Virus reactivation causing Progressive Multifocal Leukoencephalopathy (PML). Anti-IL-6R (Tocilizumab): Giant Cell Arteritis & CAR-T Cytokine Release Syndrome. Anti-C5 (Eculizumab): Blocks MAC (C5b-9) in PNH -> mandatory Neisseria meningitidis vaccination."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 3: Immune Checkpoint Inhibitors & Immune-Related Adverse Events
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa370001-0000-0000-0000-000000000003', 'f1d0a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a33', 'Immune Checkpoint Inhibitors & Immune-Related Adverse Events', 3)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa370002-0000-0000-0000-000000000003', 'fa370001-0000-0000-0000-000000000003', 'Central CTLA-4 (Ipilimumab) vs Peripheral PD-1 (Pembrolizumab) Blockades', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa370003-0000-0000-0000-000000000003', 'fa370002-0000-0000-0000-000000000003', 'Immune-Related Colitis, Hypophysitis & Pneumonitis Clinical Management', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa370004-0000-0000-0000-000000000003', 'fa370003-0000-0000-0000-000000000003', 'Fulminant Checkpoint Myocarditis (Troponin & Pulse Methylprednisolone)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa370005-0000-0000-0000-000000000003', 'fa370004-0000-0000-0000-000000000003', 'B7-CD28 Competitive Costimulatory Dysregulations, SHP-2 Phosphatase Dephosphorylation Reversals, Autoreactive Colonic Mucosal Infiltrations, and High-Mortality Cardiomyocyte Necroses', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa370006-0000-0000-0000-000000000003', 'fa370005-0000-0000-0000-000000000003', 'EXPLANATION', 1, 
'{"text": "### Immune Checkpoints & irAEs\n\nCTLA-4 (Ipilimumab): Central T-cell priming blockade in lymph nodes outcompeting CD28. PD-1 (Pembrolizumab, Nivolumab) & PD-L1 (Atezolizumab): Peripheral T-cell exhaustion reversal in tumor microenvironment. irAEs: Immune Colitis (watery diarrhea -> Hold ICI + Prednisone 1-2 mg/kg + Infliximab if refractory); Hypophysitis (central ACTH/TSH deficiency -> hormone replacement); Fulminant Myocarditis (troponin surge, heart block -> PERMANENTLY STOP ICI + pulse Methylprednisolone 1 g/day + Abatacept; >40% mortality)."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 4: CAR-T Cell Immunotherapy, Cytokine Release Syndrome & ICANS
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa370001-0000-0000-0000-000000000004', 'f1d0a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a33', 'CAR-T Cell Immunotherapy, Cytokine Release Syndrome & ICANS', 4)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa370002-0000-0000-0000-000000000004', 'fa370001-0000-0000-0000-000000000004', 'Synthetic scFv-CD3zeta-4-1BB Chimeric Antigen Receptor Constructs', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa370003-0000-0000-0000-000000000004', 'fa370002-0000-0000-0000-000000000004', 'ASTCT Cytokine Release Syndrome (CRS) Grading & Tocilizumab Antidote', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa370004-0000-0000-0000-000000000004', 'fa370003-0000-0000-0000-000000000004', 'Immune Effector Cell-Associated Neurotoxicity Syndrome (ICANS & Dexamethasone)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa370005-0000-0000-0000-000000000004', 'fa370004-0000-0000-0000-000000000004', 'MHC-Independent Single-Chain Variable Fragment Recognitions, Bystander Macrophage Interleukin Cascades, Endothelial Microvascular Permeability Resuscitation Protocols, and Blood-Brain Barrier Glial Translocations', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa370006-0000-0000-0000-000000000004', 'fa370005-0000-0000-0000-000000000004', 'EXPLANATION', 1, 
'{"text": "### CAR-T Therapy, CRS & ICANS\n\nCAR Construct: Extracellular scFv (CD19 / BCMA) + Transmembrane + Costimulatory (4-1BB / CD28) + CD3-zeta signaling ITAMs (MHC-independent recognition). CRS ASTCT Grading: Grade 1 (Fever alone) -> Grade 2 (Fever + Hypotension / Low-flow NC) -> Grade 3 (Fever + Vasopressor / High-flow O2) -> Grade 4 (Multiple vasopressors / Intubation). Tocilizumab (anti-IL-6R) is first-line targeted antidote. ICANS: Encephalopathy, expressive aphasia, dysgraphia -> Dexamethasone is first-line (crosses blood-brain barrier; Tocilizumab does NOT cross BBB)."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;
