-- V103: Seed Postgraduate Advanced Internal Medicine & Subspecialty Consultations (PG-602) Full Curriculum

-- Ensure Subject: PG-602 exists with correct title and category
INSERT INTO subjects (id, semester_id, code, title, category)
VALUES ('f9f9a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a28', 'd0e1f2a3-c4d5-6e7f-8a9b-0c1d2e3f4a5b', 'PG-602', 'Postgraduate Advanced Internal Medicine & Subspecialty Consultations', 'CLINICAL')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, category = EXCLUDED.category;

-- Unit 1: Advanced Mechanical Circulatory Support: Impella & Intra-Aortic Balloon Pump
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa670001-0000-0000-0000-000000000001', 'f9f9a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a28', 'Advanced Mechanical Circulatory Support: Impella & Intra-Aortic Balloon Pump', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa670002-0000-0000-0000-000000000001', 'fa670001-0000-0000-0000-000000000001', 'Intra-Aortic Balloon Pump (IABP) Physiological Timing & Counterpulsation Errors', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa670003-0000-0000-0000-000000000001', 'fa670002-0000-0000-0000-000000000001', 'Impella Transvalvular Microaxial Left Ventricular Unloading (DanGer Shock)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa670004-0000-0000-0000-000000000001', 'fa670003-0000-0000-0000-000000000001', 'The ECPELLA Dual Configuration (VA-ECMO Afterload LV Venting & Edema Prevention)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa670005-0000-0000-0000-000000000001', 'fa670004-0000-0000-0000-000000000001', 'Dicrotic Counterpulsations, Transvalvular Microaxial Decompressions, Myocardial Energetics, and Synergistic Extracorporeal Venting', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa670006-0000-0000-0000-000000000001', 'fa670005-0000-0000-0000-000000000001', 'EXPLANATION', 1, 
'{"text": "### Mechanical Circulatory Support\n\nIABP Timing: Diastolic inflation at the dicrotic notch augments coronary perfusion; presystolic deflation prior to the R-wave creates vacuum afterload reduction. Late deflation is the worst error (forces LV to eject against inflated balloon). Impella Microaxial Pump: Transvalvular forward flow pump (3.5-5.5 L/min) directly pulling blood from LV into aorta, lowering LVEDP and PCWP. Proven in DanGer Shock to reduce 6-month mortality in STEMI cardiogenic shock. ECPELLA Strategy: Combining VA-ECMO with Impella unloads retrograde afterload, preventing LV distension, thrombus, and flash pulmonary edema."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 2: Rapidly Progressive Glomerulonephritis (RPGN) & Renal Biopsy Pathology
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa670001-0000-0000-0000-000000000002', 'f9f9a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a28', 'Rapidly Progressive Glomerulonephritis (RPGN) & Renal Biopsy Pathology', 2)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa670002-0000-0000-0000-000000000002', 'fa670001-0000-0000-0000-000000000002', 'Crescentic Glomerulonephritis Histopathology (>50% Glomerular Crescents)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa670003-0000-0000-0000-000000000002', 'fa670002-0000-0000-0000-000000000002', 'Type I Anti-GBM (Linear IF, Plasmapheresis) & Type II Immune Complex', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa670004-0000-0000-0000-000000000002', 'fa670003-0000-0000-0000-000000000002', 'Type III Pauci-Immune ANCA Vasculitis (c-ANCA PR3 vs p-ANCA MPO, Rituximab)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa670005-0000-0000-0000-000000000002', 'fa670004-0000-0000-0000-000000000002', 'Parietal Epithelial Proliferations, Linear Anti-Collagenous Depositions, Immune Complex Hypocomplementemias, and Pauci-Immune Neutrophil Lyses', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa670006-0000-0000-0000-000000000002', 'fa670005-0000-0000-0000-000000000002', 'EXPLANATION', 1, 
'{"text": "### RPGN & Renal Biopsy Pathology\n\nCrescentic GN: Defined by >50% glomerular crescents (parietal cells and macrophages proliferating in Bowman''s space due to GBM ruptures). Immunofluorescence Classification: Type I Anti-GBM (Goodpasture): Linear IgG/C3 along GBM; treat emergently with 14-session plasmapheresis, pulse steroids, and cyclophosphamide. Type II Immune Complex: Granular IF with low C3/C4 (Lupus IV, Cryoglobulinemia). Type III Pauci-Immune: Absent IF with c-ANCA/PR3 (GPA) or p-ANCA/MPO (MPA); treat with Rituximab (375 mg/m2/wk x 4) plus steroids, with Avacopan C5aR1 antagonism to replace toxic glucocorticoids."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 3: Neuro-ICU Tiered Intracranial Pressure (ICP) Escalation & Brain Herniation
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa670001-0000-0000-0000-000000000003', 'f9f9a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a28', 'Neuro-ICU Tiered Intracranial Pressure (ICP) Escalation & Brain Herniation', 3)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa670002-0000-0000-0000-000000000003', 'fa670001-0000-0000-0000-000000000003', 'Monro-Kellie Doctrine, CPP Targets (60-70 mmHg) & Autoregulation', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa670003-0000-0000-0000-000000000003', 'fa670002-0000-0000-0000-000000000003', 'Brain Herniation Syndromes (Uncal Blown Pupil, Kernohan Notch & Tonsillar)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa670004-0000-0000-0000-000000000003', 'fa670003-0000-0000-0000-000000000003', 'Tier 0-3 Neuro-ICU Protocols (3% Saline, Barbiturate Burst Suppression & Craniectomy)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa670005-0000-0000-0000-000000000003', 'fa670004-0000-0000-0000-000000000003', 'Intracranial Vault Compliances, Transtentorial Uncal Shifts, Osmotherapeutic Intravascular Draws, and Surgical Decompressions', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa670006-0000-0000-0000-000000000003', 'fa670005-0000-0000-0000-000000000003', 'EXPLANATION', 1, 
'{"text": "### Neuro-ICU ICP & Herniation\n\nMonro-Kellie Doctrine: Vtotal = Vbrain + Vblood + Vcsf. Target Cerebral Perfusion Pressure CPP = MAP - ICP between 60-70 mmHg; maintain ICP <20-22 mmHg. Herniation Syndromes: Uncal herniation compresses ipsilateral CN III (dilated blown pupil) and contralateral cerebral peduncle (Kernohan notch ipsilateral hemiparesis). Tonsillar herniation compresses medulla producing Cushing''s triad (hypertension, bradycardia, bradypnea). Tiered Management: Tier 1: 3% Hypertonic Saline (target Na 145-155) / 20% Mannitol + EVD CSF drainage. Tier 2: Neuromuscular blockade, mild hyperventilation bridge (PaCO2 30-35). Tier 3: Pentobarbital burst suppression or decompressive craniectomy."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 4: Targeted Biologic Immunomodulation in Rheumatologic & Autoimmune Crises
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa670001-0000-0000-0000-000000000004', 'f9f9a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a28', 'Targeted Biologic Immunomodulation in Rheumatologic & Autoimmune Crises', 4)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa670002-0000-0000-0000-000000000004', 'fa670001-0000-0000-0000-000000000004', 'Rituximab Anti-CD20 Lysis & Mandatory Pre-Treatment Hepatitis B Screening', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa670003-0000-0000-0000-000000000004', 'fa670002-0000-0000-0000-000000000004', 'Eculizumab Anti-C5 Complement Inhibition & Meningococcal Vaccination Mandate', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa670004-0000-0000-0000-000000000004', 'fa670003-0000-0000-0000-000000000004', 'Tocilizumab Anti-IL-6R & Anakinra IL-1Ra in Macrophage Activation Syndrome', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa670005-0000-0000-0000-000000000004', 'fa670004-0000-0000-0000-000000000004', 'Monoclonal Lymphocyte Depletions, Terminal Complement Blockades, Encapsulated Bacterial Risks, and Interleukin Receptor Neutralizations', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa670006-0000-0000-0000-000000000004', 'fa670005-0000-0000-0000-000000000004', 'EXPLANATION', 1, 
'{"text": "### Targeted Biologics & Autoimmune Crises\n\nRituximab: Anti-CD20 mAb depleting B-cells; indicated in ANCA vasculitis and Lupus nephritis. Mandates pre-treatment Hepatitis B screening (HBsAg, anti-HBc) with Entecavir prophylaxis to prevent fatal reactivation. Eculizumab: Anti-C5 inhibitor preventing C5b-9 MAC assembly in aHUS and PNH; black box warning for Neisseria meningitidis sepsis mandates MenACWY + MenB vaccines plus prophylactic oral penicillin/ciprofloxacin. Tocilizumab: Anti-IL-6R in Giant Cell Arteritis and CAR-T CRS; artificially normalizes CRP to zero. Anakinra: IL-1Ra in Macrophage Activation Syndrome (MAS / sHLH) halting extreme hyperferritinemic cytokine storms."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;
