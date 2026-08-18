-- V99: Seed Internship Core Clinical Postings: Community Health & Rural Outreach (INT-506) Full Curriculum

-- Ensure Subject: INT-506 exists with correct title and category
INSERT INTO subjects (id, semester_id, code, title, category)
VALUES ('f8f9a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a24', 'c9d0e1f2-b3c4-5d6e-7f8a-9b0c1d2e3f4c', 'INT-506', 'Internship Core Clinical Postings: Community Health & Rural Outreach', 'CLINICAL')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, category = EXCLUDED.category;

-- Unit 1: National Health Programs & Tuberculosis Direct Observation
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa630001-0000-0000-0000-000000000001', 'f8f9a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a24', 'National Health Programs & Tuberculosis Direct Observation', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa630002-0000-0000-0000-000000000001', 'fa630001-0000-0000-0000-000000000001', 'NTEP Tuberculosis Regimens (2HRZE/4HRE) & Upfront CBNAAT Diagnostics', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa630003-0000-0000-0000-000000000001', 'fa630002-0000-0000-0000-000000000001', 'NACP V Treat All HIV Policy: First-Line TLD Regimen & 99DOTS Tracking', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa630004-0000-0000-0000-000000000001', 'fa630003-0000-0000-0000-000000000001', 'Post-Exposure Prophylaxis (PEP <=72h for 28 Days) & Nikshay Poshan', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa630005-0000-0000-0000-000000000001', 'fa630004-0000-0000-0000-000000000001', 'Molecular Mycobacterial Amplifications, Fixed-Dose Tubercular Sterilizations, Dolutegraviric Integrase Blockades, and Post-Exposure Prophylactic Courses', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa630006-0000-0000-0000-000000000001', 'fa630005-0000-0000-0000-000000000001', 'EXPLANATION', 1, 
'{"text": "### National Health Programs (NTEP & NACP)\n\nNTEP Tuberculosis: Upfront CBNAAT/GeneXpert testing. Drug-sensitive TB treated with daily weight-banded FDCs: 2 months Intensive Phase (2HRZE: Isoniazid, Rifampicin, Pyrazinamide, Ethambutol) + 4 months Continuation Phase (4HRE). Nikshay Poshan Yojana (INR 500/m) and 99DOTS adherence. NACP HIV: ''Treat All'' policy initiates lifelong single-tablet TLD (Tenofovir 300mg + Lamivudine 300mg + Dolutegravir 50mg) immediately. Post-Exposure Prophylaxis (PEP): TLD within 72 hours for 28 days."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 2: Vector-Borne Diseases & Malaria/Dengue Outbreak Control
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa630001-0000-0000-0000-000000000002', 'f8f9a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a24', 'Vector-Borne Diseases & Malaria/Dengue Outbreak Control', 2)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa630002-0000-0000-0000-000000000002', 'fa630001-0000-0000-0000-000000000002', 'Plasmodium falciparum 3-Day ACT-SP & Gametocytocidal Primaquine', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa630003-0000-0000-0000-000000000002', 'fa630002-0000-0000-0000-000000000002', 'Plasmodium vivax Radical Cure: Chloroquine + 14-Day Primaquine (G6PD Safety)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa630004-0000-0000-0000-000000000002', 'fa630003-0000-0000-0000-000000000002', 'Severe Malaria IV Artesunate & Dengue Critical Phase Fluid Titration', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa630005-0000-0000-0000-000000000002', 'fa630004-0000-0000-0000-000000000002', 'Artemisinin Schizontocidal Clearances, Hepatic Hypnozoitocidal Eradications, Parenteral Artesunates, and Dengue Endothelial Leakages', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa630006-0000-0000-0000-000000000002', 'fa630005-0000-0000-0000-000000000002', 'EXPLANATION', 1, 
'{"text": "### Vector-Borne Diseases (NVBDCP)\n\nMalaria Regimens: P. falciparum treated with ACT-SP for 3 days + Primaquine 0.75 mg/kg single dose on Day 2 (gametocytocidal). P. vivax treated with Chloroquine 25 mg/kg over 3 days + Primaquine 0.25 mg/kg daily for 14 days (anti-hypnozoite radical cure; check G6PD status). Severe malaria: IV Artesunate 2.4 mg/kg at 0, 12, 24 hours. Dengue: NS1 antigen on Days 1-5, IgM on Day 5+; Critical Phase (Days 3-7) requires careful crystalloid titration during plasma leakage."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 3: Rural Primary Health Center & Sub-Center Outpatient Care
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa630001-0000-0000-0000-000000000003', 'f8f9a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a24', 'Rural Primary Health Center & Sub-Center Outpatient Care', 3)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa630002-0000-0000-0000-000000000003', 'fa630001-0000-0000-0000-000000000003', 'Ayushman Bharat Health & Wellness Centres (HWC Tier Delivery)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa630003-0000-0000-0000-000000000003', 'fa630002-0000-0000-0000-000000000003', 'NCD Population-Based Screening CBAC Framework (Age >=30 Years)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa630004-0000-0000-0000-000000000003', 'fa630003-0000-0000-0000-000000000003', 'NACO Syndromic STI Color-Coded Kits & eSanjeevani Teleconsultation', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa630005-0000-0000-0000-000000000003', 'fa630004-0000-0000-0000-000000000003', 'Comprehensive Primary Health Networks, Community Non-Communicable Profilings, Color-Coded Syndromic Kits, and Rural Teleconsultative Dispatches', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa630006-0000-0000-0000-000000000003', 'fa630005-0000-0000-0000-000000000003', 'EXPLANATION', 1, 
'{"text": "### Rural Primary Healthcare & HWCs\n\nAyushman Bharat: Sub-Centre HWC led by CHO + ANM/ASHA (5k pop); PHC HWC led by MBBS Medical Officer (30k pop); CHC First Referral Unit (120k pop). 12 CPHC packages. NCD Screening: CBAC checklist for all adults >=30 to detect hypertension and diabetes. NACO STI Kits: Kit 1 (Grey: Azithromycin 1g + Cefixime 400mg) for urethral discharge; Kit 2 (Green: Secnidazole 2g + Fluconazole 150mg) for vaginitis. Partner treatment mandatory."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 4: Maternal-Child Nutrition, Immunization & Epidemic Outbreak Investigation
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa630001-0000-0000-0000-000000000004', 'f8f9a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a24', 'Maternal-Child Nutrition, Immunization & Epidemic Outbreak Investigation', 4)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa630002-0000-0000-0000-000000000004', 'fa630001-0000-0000-0000-000000000004', 'Universal Immunization Programme (UIP Schedule Birth to 24 Months)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa630003-0000-0000-0000-000000000004', 'fa630002-0000-0000-0000-000000000004', 'Severe Acute Malnutrition (SAM MUAC <11.5 cm) & NRC Nutritional Resuscitation', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa630004-0000-0000-0000-000000000004', 'fa630003-0000-0000-0000-000000000004', '10-Step Outbreak Investigation (Epi-Curve, Spot Map & Well Chlorination)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa630005-0000-0000-0000-000000000004', 'fa630004-0000-0000-0000-000000000004', 'Humoral Pediatric Vaccinations, Anthropometric Wasting Rehabilitations, Unimodal Epidemic Curve Tracings, and Disinfective Super-Chlorinations', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa630006-0000-0000-0000-000000000004', 'fa630005-0000-0000-0000-000000000004', 'EXPLANATION', 1, 
'{"text": "### Maternal-Child Health & Outbreak Control\n\nUIP Immunization: Birth (BCG, OPV0, HepB); 6, 10, 14 weeks (Pentavalent, Rotavirus, fIPV, PCV); 9 months (MR1, JE1, Vit A); 16-24 months (MR2, DPT booster, OPV booster). Severe Acute Malnutrition: MUAC <11.5 cm, WHZ <-3 SD, or bilateral nutritional edema managed at NRC with F-75 starter and F-100 catch-up formulas. 10-Step Outbreak Investigation: Case definition, Epi-Curve (time), Spot Map (place), analytical case-control Odds Ratio, super-chlorination of water sources (0.5 mg/L residual chlorine), and ORS distribution."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;
