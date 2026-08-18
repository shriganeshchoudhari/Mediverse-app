-- V98: Seed Internship Core Clinical Postings: Surgical Postings & Trauma Call (INT-505) Full Curriculum

-- Ensure Subject: INT-505 exists with correct title and category
INSERT INTO subjects (id, semester_id, code, title, category)
VALUES ('f7f9a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a23', 'c9d0e1f2-b3c4-5d6e-7f8a-9b0c1d2e3f4c', 'INT-505', 'Internship Core Clinical Postings: Surgical Postings & Trauma Call', 'CLINICAL')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, category = EXCLUDED.category;

-- Unit 1: Acute Abdomen Surgical Triage & SBO Decision Pathways
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa620001-0000-0000-0000-000000000001', 'f7f9a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a23', 'Acute Abdomen Surgical Triage & SBO Decision Pathways', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa620002-0000-0000-0000-000000000001', 'fa620001-0000-0000-0000-000000000001', 'Alvarado (MANTRELS) Appendicitis Scoring & Early Laparoscopic Appendectomy', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa620003-0000-0000-0000-000000000001', 'fa620002-0000-0000-0000-000000000001', 'Tokyo Guidelines 2018 (TG18) for Acute Cholecystitis & Early Surgery (<=72h)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa620004-0000-0000-0000-000000000001', 'fa620003-0000-0000-0000-000000000001', 'Small Bowel Obstruction (SBO) & Closed-Loop Strangulation Red Flags', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa620005-0000-0000-0000-000000000001', 'fa620004-0000-0000-0000-000000000001', 'Appendiceal Luminal Obstructions, Sonographic Murphyan Signs, Mesenteric Swirls, and Urgent Laparotomic Resections', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa620006-0000-0000-0000-000000000001', 'fa620005-0000-0000-0000-000000000001', 'EXPLANATION', 1, 
'{"text": "### Acute Abdomen Surgical Triage\n\nAlvarado Score (MANTRELS): RLQ Tenderness (2) + Leukocytosis (2) + Migration, Anorexia, Nausea, Rebound, Fever, Left shift (1 each). Score >=7 indicates high probability of appendicitis requiring urgent appendectomy. Tokyo Guidelines (TG18): Local Murphy sign + systemic fever/WBC + gallbladder wall >=4 mm mandates early laparoscopic cholecystectomy <=72 hours. SBO Strangulation: Mesenteric whirl sign, bowel wall >3 mm, pneumatosis intestinalis requires emergent exploratory laparotomy."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 2: Thermal Burns & Fluid Resuscitation: Parkland Formula & Rule of Nines
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa620001-0000-0000-0000-000000000002', 'f7f9a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a23', 'Thermal Burns & Fluid Resuscitation: Parkland Formula & Rule of Nines', 2)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa620002-0000-0000-0000-000000000002', 'fa620001-0000-0000-0000-000000000002', 'Wallace Rule of Nines (%TBSA) & First-Degree Burn Exclusion', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa620003-0000-0000-0000-000000000002', 'fa620002-0000-0000-0000-000000000002', 'The Parkland Crystalloid Formula (4 mL x kg x %TBSA) & First 8-Hour Timing', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa620004-0000-0000-0000-000000000002', 'fa620003-0000-0000-0000-000000000002', 'Hourly Urine Output Titration (0.5-1.0 mL/kg/hr) & Fluid Creep Prevention', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa620005-0000-0000-0000-000000000002', 'fa620004-0000-0000-0000-000000000002', 'Thermal Hyperpermeabilities, Baxterian Crystalloid Replenishments, Chronological Burn Calculations, and Diuretic Hourly Titrations', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa620006-0000-0000-0000-000000000002', 'fa620005-0000-0000-0000-000000000002', 'EXPLANATION', 1, 
'{"text": "### Thermal Burns & Parkland Resuscitation\n\nRule of Nines (%TBSA): Head 9%, Torso 36%, Arms 18%, Legs 36%, Perineum 1%; 1st-degree superficial erythema is EXCLUDED. Parkland Formula: Total 24h Volume (Lactated Ringer''s) = 4 mL x kg x %TBSA. Give 50% of calculated volume in first 8 hours FROM TIME OF BURN INJURY, and remaining 50% over next 16 hours. Titrate crystalloids to urine output: 0.5-1.0 mL/kg/hr in adults (1.5-2.0 mL/kg/hr in electrical burns with myoglobinuria)."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 3: Acute Extremity Compartment Syndrome & Emergency Fasciotomy
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa620001-0000-0000-0000-000000000003', 'f7f9a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a23', 'Acute Extremity Compartment Syndrome & Emergency Fasciotomy', 3)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa620002-0000-0000-0000-000000000003', 'fa620001-0000-0000-0000-000000000003', 'The 6 Ps: Pain Out of Proportion & Pain on Passive Stretch', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa620003-0000-0000-0000-000000000003', 'fa620002-0000-0000-0000-000000000003', 'Stryker Manometry & Delta Pressure (Delta P <= 30 mmHg)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa620004-0000-0000-0000-000000000003', 'fa620003-0000-0000-0000-000000000003', 'Two-Incision Four-Compartment Lower Leg Fasciotomy Technique', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa620005-0000-0000-0000-000000000003', 'fa620004-0000-0000-0000-000000000003', 'Osteofascial Compartmental Overpressures, Myonecrotic Microcirculatory Collapses, Stryker Manometric Gradients, and Epifascial Decompressions', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa620006-0000-0000-0000-000000000003', 'fa620005-0000-0000-0000-000000000003', 'EXPLANATION', 1, 
'{"text": "### Acute Extremity Compartment Syndrome\n\nClinical Signs: Pain out of proportion and pain on passive stretch are the earliest, most sensitive signs. Pulselessness is a late sign of irreversible necrosis. Manometry: Delta pressure (Delta P = Diastolic BP - Pcomp) <= 30 mmHg confirms tissue ischemia mandating immediate surgery. Surgical Decompression: Lower leg requires two-incision four-compartment fasciotomy (anterolateral incision for anterior/lateral compartments; posteromedial incision for superficial/deep posterior compartments)."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 4: Necrotizing Soft Tissue Infections & Surgical Sepsis
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa620001-0000-0000-0000-000000000004', 'f7f9a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a23', 'Necrotizing Soft Tissue Infections & Surgical Sepsis', 4)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa620002-0000-0000-0000-000000000004', 'fa620001-0000-0000-0000-000000000004', 'Microbiology: Type I Polymicrobial vs Type II Monomicrobial GAS', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa620003-0000-0000-0000-000000000004', 'fa620002-0000-0000-0000-000000000004', 'LRINEC Score Calculation (Score >=6 Indicates High Risk)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa620004-0000-0000-0000-000000000004', 'fa620003-0000-0000-0000-000000000004', 'Emergency Radical OR Debridement & Clindamycin Toxin Shutdown', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa620005-0000-0000-0000-000000000004', 'fa620004-0000-0000-0000-000000000004', 'Deep Fascial Necroses, Streptococcal Exotoxin SpeA Pyrogenic Syntheses, Finger Sweep Dissections, and Ribosomal Clindamycin Neutralizations', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa620006-0000-0000-0000-000000000004', 'fa620005-0000-0000-0000-000000000004', 'EXPLANATION', 1, 
'{"text": "### Necrotizing Soft Tissue Infections (NSTI)\n\nLRINEC Score: CRP >=150 (4) + WBC >25k (2) + Hb <11 (2) + Na <135 (2) + Cr >1.6 (2) + Glucose >180 (1). Score >=6 indicates high risk of necrotizing fasciitis (>=8 has >90% PPV). Emergency Management: Immediate radical surgical debridement in the operating room (dishwater pus, positive finger sweep test) is the primary determinant of survival. Antibiotic Triad: IV Vancomycin + Piperacillin-Tazobactam + IV Clindamycin 900 mg q8h (shuts down bacterial toxin synthesis)."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;
