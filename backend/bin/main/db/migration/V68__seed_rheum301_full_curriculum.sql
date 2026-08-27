-- V68: Seed Clinical Rheumatology & Autoimmune Disorders (RHEUM-301) Full Curriculum

-- Ensure Subject: RHEUM-301 exists with correct title and category
INSERT INTO subjects (id, semester_id, code, title, category)
VALUES ('f1d0a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a26', 'c7d8e9f0-b1c2-3d4e-5f6a-7b8c9d0e1f2a', 'RHEUM-301', 'Clinical Rheumatology & Autoimmune Disorders', 'CLINICAL')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, category = EXCLUDED.category;

-- Unit 1: Systemic Lupus Erythematosus & Antiphospholipid Syndrome
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa300001-0000-0000-0000-000000000001', 'f1d0a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a26', 'Systemic Lupus Erythematosus & Antiphospholipid Syndrome', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa300002-0000-0000-0000-000000000001', 'fa300001-0000-0000-0000-000000000001', 'Autoantibody Profiler: Anti-dsDNA, Anti-Smith, aPL & Anti-Ro', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa300003-0000-0000-0000-000000000001', 'fa300002-0000-0000-0000-000000000001', 'Lupus Nephritis Class IV Wire-Loop Glomerulonephritis', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa300004-0000-0000-0000-000000000001', 'fa300003-0000-0000-0000-000000000001', 'Antiphospholipid Syndrome & In Vitro PTT Paradox', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa300005-0000-0000-0000-000000000001', 'fa300004-0000-0000-0000-000000000001', 'Immune Complex Hypersensitivity Kinetics, Congenital Complete Heart Block Pathways, snRNP Splicing Specificities, and Antiphospholipid Thrombosis Protocols', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa300006-0000-0000-0000-000000000001', 'fa300005-0000-0000-0000-000000000001', 'EXPLANATION', 1, 
'{"text": "### SLE & Antiphospholipid Syndrome\n\nAutoantibody Profile: ANA (sensitive >95%); Anti-dsDNA (specific, correlates with Lupus Nephritis flares); Anti-Smith (most specific >99%, snRNP target); Anti-Ro/SSA (subacute cutaneous lupus, neonatal lupus with congenital complete heart block); Anti-Histone (drug-induced lupus); Antiphospholipid (Lupus anticoagulant, anticardiolipin, anti-beta2-glycoprotein I -> arterial/venous thrombosis, recurrent miscarriages, paradoxically prolonged PTT that fails mixing study correction). Lupus Nephritis Class IV (Diffuse Proliferative, wire-loop deposits, full-house IF) -> MMF / Cyclophosphamide + Steroids."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 2: Rheumatoid Arthritis, Synovial Pannus & DMARD Protocols
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa300001-0000-0000-0000-000000000002', 'f1d0a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a26', 'Rheumatoid Arthritis, Synovial Pannus & DMARD Protocols', 2)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa300002-0000-0000-0000-000000000002', 'fa300001-0000-0000-0000-000000000002', 'Invasive Synovial Pannus (TNF-alpha, IL-1, MMPs & Bone Erosions)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa300003-0000-0000-0000-000000000002', 'fa300002-0000-0000-0000-000000000002', 'Anti-CCP (ACPA) Serology & Joint Sparing Rules (MCP/PIP vs DIP)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa300004-0000-0000-0000-000000000002', 'fa300003-0000-0000-0000-000000000002', 'Methotrexate Anchor DMARD, Latent TB Screening & Felty Syndrome', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa300005-0000-0000-0000-000000000002', 'fa300004-0000-0000-0000-000000000002', 'Peptidylarginine Deiminase Neoepitopes, Atlantoaxial C1-C2 Subluxation Risks, Anti-TNF Interferon Gamma Release Assays, and Splenic Neutrophil Sequestration', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa300006-0000-0000-0000-000000000002', 'fa300005-0000-0000-0000-000000000002', 'EXPLANATION', 1, 
'{"text": "### Rheumatoid Arthritis\n\nPathophysiology: Invasive granulation tissue (Pannus) secreting TNF-alpha, IL-1, IL-6, and MMPs -> marginal bone erosions. Clinical: Symmetrical polyarthritis of MCP and PIP joints, morning stiffness >1 hour. DIP joints and thoracolumbar spine strictly SPARED! (C1-C2 subluxation risk -> pre-op cervical X-rays). Serology: Anti-Cyclic Citrullinated Peptide (Anti-CCP / ACPA >95% specific). Pharmacotherapy: Anchor DMARD Methotrexate (+ daily Folic Acid). Biologic TNF inhibitors (Infliximab, Adalimumab) require mandatory pre-treatment Latent TB screening (IGRA/PPD). Felty Syndrome: Triad of RA + Splenomegaly + Neutropenia."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 3: Systemic Sclerosis & Scleroderma Renal Crisis Emergency
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa300001-0000-0000-0000-000000000003', 'f1d0a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a26', 'Systemic Sclerosis & Scleroderma Renal Crisis Emergency', 3)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa300002-0000-0000-0000-000000000003', 'fa300001-0000-0000-0000-000000000003', 'Limited SSc (CREST Pentad, Anti-Centromere & Isolated PAH)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa300003-0000-0000-0000-000000000003', 'fa300002-0000-0000-0000-000000000003', 'Diffuse SSc (Anti-Scl-70 / Topoisomerase I & Interstitial Fibrosis)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa300004-0000-0000-0000-000000000003', 'fa300003-0000-0000-0000-000000000003', 'Scleroderma Renal Crisis (Anti-RNA Pol III, Captopril & Steroid Contraindication)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa300005-0000-0000-0000-000000000003', 'fa300004-0000-0000-0000-000000000003', 'Endothelial Obliterative Microangiopathies, Lower Esophageal Sphincter Atrophy, Renin-Driven Malignant Hyperfiltration, and Calcium Channel Vasodilator Kinetics', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa300006-0000-0000-0000-000000000003', 'fa300005-0000-0000-0000-000000000003', 'EXPLANATION', 1, 
'{"text": "### Systemic Sclerosis & Renal Crisis\n\nLimited Cutaneous SSc (CREST: Calcinosis, Raynaud, Esophagus, Sclerodactyly, Telangiectasia): Distal skin thickening, Anti-Centromere antibodies (80%), isolated Pulmonary Arterial Hypertension (PAH). Diffuse Cutaneous SSc: Proximal skin thickening, Anti-Scl-70 (anti-topoisomerase I), Interstitial Lung Disease (pulmonary fibrosis), and Scleroderma Renal Crisis. Scleroderma Renal Crisis (SRC): Malignant hypertension and acute oliguric renal failure with anti-RNA Polymerase III. Drug of choice is immediate oral ACE Inhibitors (Captopril). Corticosteroids are strictly CONTRAINDICATED as they precipitate crisis!"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 4: Spondyloarthropathies, Crystal Arthropathies & Vasculitis
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa300001-0000-0000-0000-000000000004', 'f1d0a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a26', 'Spondyloarthropathies, Crystal Arthropathies & Vasculitis', 4)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa300002-0000-0000-0000-000000000004', 'fa300001-0000-0000-0000-000000000004', 'Crystal Arthropathies: Gout (Needle Negative) vs CPPD (Rhomboid Positive)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa300003-0000-0000-0000-000000000004', 'fa300002-0000-0000-0000-000000000004', 'Ankylosing Spondylitis (HLA-B27, Sacroiliitis & Bamboo Spine)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa300004-0000-0000-0000-000000000004', 'fa300003-0000-0000-0000-000000000004', 'Giant Cell Arteritis (GCA): Jaw Claudication & Immediate Corticosteroids', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa300005-0000-0000-0000-000000000004', 'fa300004-0000-0000-0000-000000000004', 'Birefringence Compensator Angles, Entheseal Syndesmophyte Ossification, Posterior Ciliary Artery Occlusion Blindness, and Xanthine Oxidase Inhibition Protocols', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa300006-0000-0000-0000-000000000004', 'fa300005-0000-0000-0000-000000000004', 'EXPLANATION', 1, 
'{"text": "### Crystals, Spondyloarthropathies & GCA\n\nGout: Monosodium urate crystals, needle-shaped, STRONGLY NEGATIVE birefringence (yellow when parallel to compensator), 1st MTP podagra -> Acute: NSAIDs/Colchicine/Steroids; Chronic: Allopurinol/Febuxostat. Pseudogout (CPPD): Calcium pyrophosphate, rhomboid-shaped, WEAKLY POSITIVE birefringence (blue when parallel), knee joint (50%), chondrocalcinosis on X-ray. Ankylosing Spondylitis: HLA-B27, morning back stiffness improving with exercise, bamboo spine, ascending aortic regurgitation -> NSAIDs + anti-TNF. Giant Cell (Temporal) Arteritis: Age >50, jaw claudication, scalp tenderness, ESR >100 mm/h, risk of permanent blindness -> IMMEDIATE HIGH-DOSE CORTICOSTEROIDS BEFORE BIOPSY!"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;
