-- V60: Seed Infectious Diseases & Antimicrobial Stewardship (ID-301) Full Curriculum

-- Ensure Subject: ID-301 exists with correct title and category
INSERT INTO subjects (id, semester_id, code, title, category)
VALUES ('f1a0a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a18', 'c8d9e0f1-b2c3-4d5e-6f7a-8b9c0d1e2f3a', 'ID-301', 'Infectious Diseases & Antimicrobial Stewardship', 'CLINICAL')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, category = EXCLUDED.category;

-- Unit 1: Sepsis-3 Consensus, SOFA/qSOFA Scoring & Surviving Sepsis Hour-1 Bundle
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa220001-0000-0000-0000-000000000001', 'f1a0a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a18', 'Sepsis-3 Consensus, SOFA/qSOFA Scoring & Surviving Sepsis Hour-1 Bundle', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa220002-0000-0000-0000-000000000001', 'fa220001-0000-0000-0000-000000000001', 'Sepsis-3 Definitions, SOFA Organ Dysfunction & qSOFA Screen', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa220003-0000-0000-0000-000000000001', 'fa220002-0000-0000-0000-000000000001', 'Septic Shock Pathophysiology, Cellular Dysoxia & Vasopressors', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa220004-0000-0000-0000-000000000001', 'fa220003-0000-0000-0000-000000000001', 'Surviving Sepsis Campaign Hour-1 Bundle & Fluid Resuscitation', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa220005-0000-0000-0000-000000000001', 'fa220004-0000-0000-0000-000000000001', 'Sepsis-3 Consensus Criteria, SOFA and qSOFA Scores, Balanced Crystalloid Resuscitation, and Norepinephrine Vasopressor Protocols', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa220006-0000-0000-0000-000000000001', 'fa220005-0000-0000-0000-000000000001', 'EXPLANATION', 1, 
'{"text": "### Sepsis-3 Consensus & Surviving Sepsis Bundle\n\nSepsis: Life-threatening organ dysfunction from dysregulated host response, acute SOFA increase >=2 points. qSOFA bedside screen: RR >=22/min, Altered mentation GCS <15, SBP <=100 mmHg (>=2 points). Septic Shock: Sepsis with vasopressors needed for MAP >=65 mmHg AND serum lactate >2.0 mmol/L (>18 mg/dL) despite fluid loading. Hour-1 Bundle: 1. Measure blood lactate, 2. Obtain blood cultures prior to antibiotics, 3. Broad-spectrum IV antibiotics within 1 hour, 4. Rapid 30 mL/kg balanced crystalloids for hypotension or lactate >=4 mmol/L, 5. Norepinephrine to maintain MAP >=65 mmHg (Vasopressin 0.03 U/min second-line)."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 2: Fever of Unknown Origin & Tropical Fevers
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa220001-0000-0000-0000-000000000002', 'f1a0a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a18', 'Fever of Unknown Origin & Tropical Fevers', 2)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa220002-0000-0000-0000-000000000002', 'fa220001-0000-0000-0000-000000000002', 'Fever of Unknown Origin (FUO) Criteria & Subtypes', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa220003-0000-0000-0000-000000000002', 'fa220002-0000-0000-0000-000000000002', 'Severe Falciparum Malaria (IV Artesunate) & Dengue Plasma Leak', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa220004-0000-0000-0000-000000000002', 'fa220003-0000-0000-0000-000000000002', 'Enteric Fever (Faget Sign) & Scrub Typhus Cigarette-Burn Eschar', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa220005-0000-0000-0000-000000000002', 'fa220004-0000-0000-0000-000000000002', 'FUO Diagnostic Algorithms, Falciparum Malaria Blood Films, Dengue Warning Signs, Typhoid Rose Spots, and Scrub Typhus Doxycycline Therapy', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa220006-0000-0000-0000-000000000002', 'fa220005-0000-0000-0000-000000000002', 'EXPLANATION', 1, 
'{"text": "### FUO & Tropical Fevers\n\nClassic FUO: Temp >38.3°C (>101°F) >3 weeks with no diagnosis after 1 week inpatient workup (Infections, Malignancy, NIID). Severe Malaria (P. falciparum): Cerebral malaria, ring forms, banana gametocytes, blackwater fever -> IV Artesunate (2.4 mg/kg at 0, 12, 24h, then daily) followed by oral ACT. Dengue: Breakbone fever, tourniquet test, NS1 antigen (day 1-5), IgM (day 5+), plasma leakage (hematocrit rise >20%) -> crystalloid titration (avoid NSAIDs). Typhoid (S. Typhi): Step-ladder fever, Faget sign (relative bradycardia), rose spots -> blood culture week 1 -> Ceftriaxone or Azithromycin. Scrub Typhus (Orientia tsutsugamushi): Chigger mite bite -> painless cigarette-burn eschar, Weil-Felix OX-K -> Doxycycline (100 mg bid x 7d)."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 3: Multi-Drug Resistant ESKAPE Superbugs & Molecular Diagnostics
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa220001-0000-0000-0000-000000000003', 'f1a0a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a18', 'Multi-Drug Resistant ESKAPE Superbugs & Molecular Diagnostics', 3)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa220002-0000-0000-0000-000000000003', 'fa220001-0000-0000-0000-000000000003', 'MRSA Resistance (mecA PBP2a) & VRE (vanA/B)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa220003-0000-0000-0000-000000000003', 'fa220002-0000-0000-0000-000000000003', 'ESBL (Carbapenems) & CRE (Ceftazidime-Avibactam / Cefiderocol)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa220004-0000-0000-0000-000000000003', 'fa220003-0000-0000-0000-000000000003', 'Candida auris & Multiplex PCR / MALDI-TOF Diagnostics', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa220005-0000-0000-0000-000000000003', 'fa220004-0000-0000-0000-000000000003', 'ESKAPE Pathogen Resistance Genes, Vancomycin AUC/MIC Monitoring, Daptomycin Surfactant Binding, and Novel Beta-Lactamase Inhibitors', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa220006-0000-0000-0000-000000000003', 'fa220005-0000-0000-0000-000000000003', 'EXPLANATION', 1, 
'{"text": "### MDR ESKAPE Pathogens & Diagnostics\n\nMRSA: mecA gene encodes PBP2a with low beta-lactam affinity -> IV Vancomycin (target AUC/MIC 400-600) or Linezolid (600 mg q12h). Daptomycin is strictly contraindicated in pneumonia due to pulmonary surfactant binding and inactivation. VRE: vanA/B changes D-Ala-D-Ala to D-Ala-D-Lac -> Linezolid or Daptomycin. ESBL (CTX-M): Carbapenems (Meropenem) drug of choice. CRE (KPC, NDM-1, OXA-48): Ceftazidime-Avibactam, Meropenem-Vaborbactam, Cefiderocol, Colistin. Candida auris: MDR fungal yeast -> Echinocandins. Rapid diagnostics: FilmArray Multiplex PCR BCID panels (detects mecA, vanA, KPC within 1h) and MALDI-TOF mass spectrometry."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 4: Antimicrobial Stewardship Programs & WHO AWaRe Framework
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa220001-0000-0000-0000-000000000004', 'f1a0a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a18', 'Antimicrobial Stewardship Programs & WHO AWaRe Framework', 4)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa220002-0000-0000-0000-000000000004', 'fa220001-0000-0000-0000-000000000004', 'WHO AWaRe Classification: Access, Watch & Reserve', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa220003-0000-0000-0000-000000000004', 'fa220002-0000-0000-0000-000000000004', '48-to-72-Hour Antibiotic Time-Out, De-escalation & IV-to-Oral Switch', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa220004-0000-0000-0000-000000000004', 'fa220003-0000-0000-0000-000000000004', 'Biomarker-Guided Stewardship: Serum Procalcitonin (PCT) Kinetics', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa220005-0000-0000-0000-000000000004', 'fa220004-0000-0000-0000-000000000004', 'AWaRe Hospital Consumption Benchmarks, Prospective Audit and Feedback, Culture-Directed De-escalation, and Procalcitonin Discontinuation Rules', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa220006-0000-0000-0000-000000000004', 'fa220005-0000-0000-0000-000000000004', 'EXPLANATION', 1, 
'{"text": "### Antimicrobial Stewardship & WHO AWaRe\n\nWHO AWaRe: Access group (narrow spectrum, low resistance potential: Amoxicillin, Cefazolin, Doxycycline; target >=60% of total hospital use); Watch group (higher resistance: Fluoroquinolones, 3rd-gen cephalosporins, Carbapenems); Reserve group (last-resort: Ceftazidime-avibactam, Colistin, Linezolid; requires ID specialist sign-off). ASP Core Strategies: Prospective audit & feedback, Formulary restriction, 48-72h Antibiotic Time-Out for culture-directed de-escalation, IV-to-Oral switch. Procalcitonin (PCT) Kinetics: PCT <0.25 ug/L or >80% drop from peak confirms bacterial sepsis resolution and guides safe early antibiotic cessation (PCT remains suppressed in viral infections by IFN-gamma)."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;
