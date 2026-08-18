-- V102: Seed Postgraduate Core Clinical Foundations & Residency Readiness (PG-601) Full Curriculum

-- Ensure Curriculum Year 5 (Postgraduate Phase) exists
INSERT INTO curriculum_years (id, curriculum_id, year_number)
VALUES ('b6c7d8e9-f0a1-2b3c-4d5e-6f7a8b9c0d1e', 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 5)
ON CONFLICT (id) DO NOTHING;

-- Ensure Semester 10 (Postgraduate Residency / Fellowship Foundations) exists
INSERT INTO semesters (id, year_id, semester_number)
VALUES ('d0e1f2a3-c4d5-6e7f-8a9b-0c1d2e3f4a5b', 'b6c7d8e9-f0a1-2b3c-4d5e-6f7a8b9c0d1e', 10)
ON CONFLICT (id) DO NOTHING;

-- Ensure Subject: PG-601 exists with correct title and category
INSERT INTO subjects (id, semester_id, code, title, category)
VALUES ('f9f9a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a27', 'd0e1f2a3-c4d5-6e7f-8a9b-0c1d2e3f4a5b', 'PG-601', 'Postgraduate Core Clinical Foundations & Residency Readiness', 'CLINICAL')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, category = EXCLUDED.category;

-- Unit 1: Advanced Critical Care Hemodynamics & Multi-Organ ECMO
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa660001-0000-0000-0000-000000000001', 'f9f9a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a27', 'Advanced Critical Care Hemodynamics & Multi-Organ ECMO', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa660002-0000-0000-0000-000000000001', 'fa660001-0000-0000-0000-000000000001', 'Swan-Ganz Thermodilution Profiles (PCWP, SVR, CI & SvO2 Dynamics)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa660003-0000-0000-0000-000000000001', 'fa660002-0000-0000-0000-000000000001', 'Global Oxygen Delivery (DO2) & Extraction Kinetics (ScvO2 >=70%)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa660004-0000-0000-0000-000000000001', 'fa660003-0000-0000-0000-000000000001', 'Veno-Venous (VV) vs Veno-Arterial (VA) ECMO Mechanical Support', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa660005-0000-0000-0000-000000000001', 'fa660004-0000-0000-0000-000000000001', 'Thermodilutive Microvascular Perfusion Profiles, Global Dysoxic Extraction Kinetics, and Extracorporeal Membrane Oxygenations', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa660006-0000-0000-0000-000000000001', 'fa660005-0000-0000-0000-000000000001', 'EXPLANATION', 1, 
'{"text": "### Critical Care Hemodynamics & ECMO\n\nPulmonary Artery Catheterization: Hypovolemic (low PCWP, high SVR), Cardiogenic (high PCWP >18, low CI <2.2, low SvO2 <60%), Distributive/Septic (low SVR <800, high CI >4.0, high SvO2 >75%), Tamponade (diastolic equalization CVP=PAD=PCWP). Oxygen Dynamics: DO2 = CO * CaO2 * 10 (950-1,100 mL/min); maintain ScvO2 >=70%. ECMO Life Support: VV-ECMO provides isolated respiratory gas exchange for severe ARDS (PaO2/FiO2 <80) relying on native CO. VA-ECMO provides full circulatory support for cardiogenic shock; mandates insertion of a 6-8 Fr distal leg perfusion cannula and monitoring for Harlequin syndrome."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 2: Advanced Mechanical Ventilation, Asynchronies & Severe ARDS Protocols
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa660001-0000-0000-0000-000000000002', 'f9f9a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a27', 'Advanced Mechanical Ventilation, Asynchronies & Severe ARDS Protocols', 2)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa660002-0000-0000-0000-000000000002', 'fa660001-0000-0000-0000-000000000002', 'ARDSNet Lung-Protective Strategy (4-6 mL/kg PBW, Pplat <=30 cmH2O)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa660003-0000-0000-0000-000000000002', 'fa660002-0000-0000-0000-000000000002', 'Driving Pressure (Delta P <=14 cmH2O), Prone (>=16h/d) & Paralysis', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa660004-0000-0000-0000-000000000002', 'fa660003-0000-0000-0000-000000000002', 'Ventilator Asynchrony Waveforms (Double Triggering & Auto-PEEP)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa660005-0000-0000-0000-000000000002', 'fa660004-0000-0000-0000-000000000002', 'Alveolar Volutrauma Mitigations, Transpulmonary Prone Recruits, Driving Pressure Trajectories, and Dyssynchronous Waveform Deconstructions', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa660006-0000-0000-0000-000000000002', 'fa660005-0000-0000-0000-000000000002', 'EXPLANATION', 1, 
'{"text": "### Mechanical Ventilation & ARDS\n\nARDSNet Protocol: Tidal volume 4-6 mL/kg Predicted Body Weight (PBW). Plateau pressure Pplat <=30 cmH2O. Driving pressure Delta P (Pplat - PEEP) <=14 cmH2O is the strongest predictor of survival. Evidence-Based Adjuncts: Prone positioning >=16 hours/day for severe ARDS (P/F <150; PROSEVA trial) and 48h Cisatracurium neuromuscular blockade (ACURASYS). Asynchrony Recognition: Double-triggering causes dangerous breath-stacking barotrauma; Auto-PEEP is recognized when expiratory flow fails to reach zero baseline before the next breath, managed by reducing rate and setting I:E ratio to 1:3-1:4."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 3: Sepsis Phenotyping, Cytokine Storm & Precision Resuscitation
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa660001-0000-0000-0000-000000000003', 'f9f9a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a27', 'Sepsis Phenotyping, Cytokine Storm & Precision Resuscitation', 3)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa660002-0000-0000-0000-000000000003', 'fa660001-0000-0000-0000-000000000003', 'Sepsis-3 Clinical Phenotyping (Alpha, Beta, Gamma & Delta Phenotypes)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa660003-0000-0000-0000-000000000003', 'fa660002-0000-0000-0000-000000000003', 'Dynamic Fluid Responsiveness (Passive Leg Raise Delta SV >=10% & PPV >13%)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa660004-0000-0000-0000-000000000003', 'fa660003-0000-0000-0000-000000000003', 'The ROSE 4-Phase Resuscitation & Active Fluid De-escalation', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa660005-0000-0000-0000-000000000003', 'fa660004-0000-0000-0000-000000000003', 'Host Immune Phenotypic Subtypes, Autologous Fluid Challenge Dynamics, Frank-Starling Preload Plateaus, and Restrictive Evacuations', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa660006-0000-0000-0000-000000000003', 'fa660005-0000-0000-0000-000000000003', 'EXPLANATION', 1, 
'{"text": "### Sepsis Phenotyping & Dynamic Fluids\n\nSepsis Phenotypes: Alpha (33% mild, lowest mortality 2%), Beta (27% chronic/renal disease), Gamma (27% hyperinflammatory with pulmonary failure), Delta (13% hepatic shock, hyperlactatemia, highest mortality 32%). Dynamic Fluid Assessment: Passive Leg Raise (PLR) autologous blood challenge proves preload responsiveness if real-time Stroke Volume rises >=10%. Static CVP is completely unreliable. ROSE Framework: Resuscitation (0-3h) -> Optimization (3-24h) -> Stabilization (1-3d) -> Evacuation (Day 3+ loop diuretics/CRRT to achieve negative daily fluid balance and clear tissue edema)."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 4: ACGME Residency Core EPAs, M&M Audits & Crisis Resource Management
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa660001-0000-0000-0000-000000000004', 'f9f9a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a27', 'ACGME Residency Core EPAs, M&M Audits & Crisis Resource Management', 4)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa660002-0000-0000-0000-000000000004', 'fa660001-0000-0000-0000-000000000004', 'ACGME 6 Core Competencies & Residency Milestone Frameworks', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa660003-0000-0000-0000-000000000004', 'fa660002-0000-0000-0000-000000000004', 'M&M Cognitive Heuristic Audits (Anchoring & Premature Closure)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa660004-0000-0000-0000-000000000004', 'fa660003-0000-0000-0000-000000000004', 'Reason''s Swiss Cheese Model & Resuscitation Crisis Management (CRM)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa660005-0000-0000-0000-000000000004', 'fa660004-0000-0000-0000-000000000004', 'Graduate Milestone Trajectories, Cognitive Heuristic Deconstructions, Systemic Swiss Cheese Defenses, and Closed-Loop Resuscitations', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa660006-0000-0000-0000-000000000004', 'fa660005-0000-0000-0000-000000000004', 'EXPLANATION', 1, 
'{"text": "### Residency Competencies & Crisis Management\n\nACGME Core Competencies: 1. Patient Care, 2. Medical Knowledge, 3. Practice-Based Learning and Improvement (PBLI), 4. Interpersonal and Communication Skills, 5. Professionalism, 6. Systems-Based Practice (SBP). M&M Root-Cause Analysis: Deconstructs cognitive heuristics (anchoring bias, premature closure) and applies James Reason''s Swiss Cheese model to target latent organizational hazards rather than individual frontline human blame. Resuscitation CRM: Hands-off team leader at foot of bed, sterile cockpit, and strict closed-loop call-out and check-back communication."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;
