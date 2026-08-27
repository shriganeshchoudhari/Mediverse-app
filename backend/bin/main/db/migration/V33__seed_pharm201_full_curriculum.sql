-- V33: Seed Pharmacology & Therapeutics (PHARM-201) Full Curriculum

-- Ensure Subject: PHARM-201 exists with correct title and category
INSERT INTO subjects (id, semester_id, code, title, category)
VALUES ('f4b5c6d7-e8f9-0a1b-2c3d-4e5f6a7b8c9d', 'c5d6e7f8-a9b0-1c2d-3e4f-5a6b7c8d9e0f', 'PHARM-201', 'Pharmacology & Therapeutics', 'PARA_CLINICAL')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, category = EXCLUDED.category;

-- Unit 1: General Pharmacokinetics & Receptor Dynamics
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('e1010001-0000-0000-0000-000000000001', 'f4b5c6d7-e8f9-0a1b-2c3d-4e5f6a7b8c9d', 'General Pharmacokinetics & Dynamics', 1)
ON CONFLICT DO NOTHING;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('e1010002-0000-0000-0000-000000000001', 'e1010001-0000-0000-0000-000000000001', 'ADME Equations & Dose-Response Curves', 1)
ON CONFLICT DO NOTHING;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('e1010003-0000-0000-0000-000000000001', 'e1010002-0000-0000-0000-000000000001', 'Clearance, Half-Life & Loading Dose', 1)
ON CONFLICT DO NOTHING;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('e1010004-0000-0000-0000-000000000001', 'e1010003-0000-0000-0000-000000000001', 'Zero vs First Order and Competitive Antagonism', 1)
ON CONFLICT DO NOTHING;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('e1010005-0000-0000-0000-000000000001', 'e1010004-0000-0000-0000-000000000001', 'Pharmacokinetics, Clearance Equations and Receptor Dynamics', 'PUBLISHED', 1)
ON CONFLICT DO NOTHING;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('e1010006-0000-0000-0000-000000000001', 'e1010005-0000-0000-0000-000000000001', 'EXPLANATION', 1, 
'{"text": "### Pharmacokinetics & Receptor Dynamics\n\nLoading dose depends only on Volume of Distribution (Vd), whereas Maintenance dose depends on Clearance (CL). Competitive antagonists shift the dose-response curve to the right (increasing EC50) without changing Emax. Zero-order elimination (PEA: Phenytoin, Ethanol, Aspirin) has a constant amount cleared per unit time due to enzyme saturation."}'::jsonb)
ON CONFLICT DO NOTHING;

-- Unit 2: Autonomic Pharmacology
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('e1010001-0000-0000-0000-000000000002', 'f4b5c6d7-e8f9-0a1b-2c3d-4e5f6a7b8c9d', 'Autonomic Pharmacology & Toxidromes', 2)
ON CONFLICT DO NOTHING;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('e1010002-0000-0000-0000-000000000002', 'e1010001-0000-0000-0000-000000000002', 'Cholinergic & Adrenergic Signal Transduction', 1)
ON CONFLICT DO NOTHING;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('e1010003-0000-0000-0000-000000000002', 'e1010002-0000-0000-0000-000000000002', 'Gq, Gi, Gs Cascades and Receptors', 1)
ON CONFLICT DO NOTHING;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('e1010004-0000-0000-0000-000000000002', 'e1010003-0000-0000-0000-000000000002', 'Organophosphate Poisoning & Antidotes', 1)
ON CONFLICT DO NOTHING;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('e1010005-0000-0000-0000-000000000002', 'e1010004-0000-0000-0000-000000000002', 'Autonomic GPCR Receptors, Adrenergics and Cholinergics', 'PUBLISHED', 1)
ON CONFLICT DO NOTHING;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('e1010006-0000-0000-0000-000000000002', 'e1010005-0000-0000-0000-000000000002', 'EXPLANATION', 1, 
'{"text": "### Autonomic Pharmacology\n\nAlpha-1 and M3 couple to Gq (IP3/DAG/Ca2+), Beta-1 and Beta-2 couple to Gs (cAMP), and M2 and Alpha-2 couple to Gi. Organophosphate poisoning causes massive muscarinic overstimulation (DUMBBELSS); immediate treatment requires IV Atropine followed by Pralidoxime."}'::jsonb)
ON CONFLICT DO NOTHING;

-- Unit 3: Cardiovascular & Renal Pharmacology
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('e1010001-0000-0000-0000-000000000003', 'f4b5c6d7-e8f9-0a1b-2c3d-4e5f6a7b8c9d', 'Cardiovascular & Renal Pharmacology', 3)
ON CONFLICT DO NOTHING;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('e1010002-0000-0000-0000-000000000003', 'e1010001-0000-0000-0000-000000000003', 'Diuretics, RAAS Inhibitors & Antiarrhythmics', 1)
ON CONFLICT DO NOTHING;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('e1010003-0000-0000-0000-000000000003', 'e1010002-0000-0000-0000-000000000003', 'Loop vs Thiazide vs Potassium-Sparing Diuretics', 1)
ON CONFLICT DO NOTHING;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('e1010004-0000-0000-0000-000000000003', 'e1010003-0000-0000-0000-000000000003', 'ACE Inhibitor Cough, ARBs & Amiodarone Toxicities', 1)
ON CONFLICT DO NOTHING;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('e1010005-0000-0000-0000-000000000003', 'e1010004-0000-0000-0000-000000000003', 'Antihypertensives, Diuretics and Vaughan Williams Antiarrhythmics', 'PUBLISHED', 1)
ON CONFLICT DO NOTHING;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('e1010006-0000-0000-0000-000000000003', 'e1010005-0000-0000-0000-000000000003', 'EXPLANATION', 1, 
'{"text": "### Cardiovascular & Renal Pharmacology\n\nLoop diuretics block NKCC2 in the TAL causing hypokalemia and ototoxicity. Thiazides block NCCT in the DCT causing hypercalcemia and HyperGLUC. ACE inhibitors elevate bradykinin causing dry cough and angioedema. Amiodarone prolongs APD with risks of pulmonary fibrosis and thyroid dysfunction."}'::jsonb)
ON CONFLICT DO NOTHING;

-- Unit 4: Antimicrobial Chemotherapy
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('e1010001-0000-0000-0000-000000000004', 'f4b5c6d7-e8f9-0a1b-2c3d-4e5f6a7b8c9d', 'Antimicrobial Chemotherapy & Toxicities', 4)
ON CONFLICT DO NOTHING;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('e1010002-0000-0000-0000-000000000004', 'e1010001-0000-0000-0000-000000000004', 'Ribosomal 30S/50S & Cell Wall Inhibitors', 1)
ON CONFLICT DO NOTHING;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('e1010003-0000-0000-0000-000000000004', 'e1010002-0000-0000-0000-000000000004', 'Aminoglycosides, Macrolides & Vancomycin', 1)
ON CONFLICT DO NOTHING;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('e1010004-0000-0000-0000-000000000004', 'e1010003-0000-0000-0000-000000000004', 'Red Man Syndrome, Tendon Rupture & SJS', 1)
ON CONFLICT DO NOTHING;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('e1010005-0000-0000-0000-000000000004', 'e1010004-0000-0000-0000-000000000004', 'Antimicrobial Classes, Mechanisms and Iconic Toxicities', 'PUBLISHED', 1)
ON CONFLICT DO NOTHING;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('e1010006-0000-0000-0000-000000000004', 'e1010005-0000-0000-0000-000000000004', 'EXPLANATION', 1, 
'{"text": "### Antimicrobial Chemotherapy\n\nBuy AT 30 (Aminoglycosides, Tetracyclines), CELL at 50 (Chloramphenicol, Clindamycin, Erythromycin, Linezolid). Vancomycin causes histamine-mediated Red Man syndrome on rapid infusion. Fluoroquinolones risk Achilles tendon rupture."}'::jsonb)
ON CONFLICT DO NOTHING;
