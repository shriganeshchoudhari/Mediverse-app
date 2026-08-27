-- V101: Seed Internship Core Clinical Postings: Comprehensive Internship Exit Competencies & Clinical Portfolio (INT-508) Full Curriculum

-- Ensure Subject: INT-508 exists with correct title and category
INSERT INTO subjects (id, semester_id, code, title, category)
VALUES ('f9f9a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a26', 'c9d0e1f2-b3c4-5d6e-7f8a-9b0c1d2e3f4c', 'INT-508', 'Internship Core Clinical Postings: Comprehensive Internship Exit Competencies & Clinical Portfolio', 'CLINICAL')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, category = EXCLUDED.category;

-- Unit 1: Medico-Legal Jurisprudence, Death Certification & Organ Donation
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa650001-0000-0000-0000-000000000001', 'f9f9a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a26', 'Medico-Legal Jurisprudence, Death Certification & Organ Donation', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa650002-0000-0000-0000-000000000001', 'fa650001-0000-0000-0000-000000000001', 'Medical Certification of Cause of Death (MCCD Form 4/4A & UCOD Rules)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa650003-0000-0000-0000-000000000001', 'fa650002-0000-0000-0000-000000000001', 'MLC Police Intimation, Viscera Saturated Saline & Chain of Custody', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa650004-0000-0000-0000-000000000001', 'fa650003-0000-0000-0000-000000000001', 'THOTA 2014 Brainstem Death Protocol (4 Doctors & 6-Hour Apnea Testing)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa650005-0000-0000-0000-000000000001', 'fa650004-0000-0000-0000-000000000001', 'Etiological Mortalities, Visceral Preservation Toxicologies, Statutory Brainstem Decapitations, and Apneic Hypercapnic Determinations', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa650006-0000-0000-0000-000000000001', 'fa650005-0000-0000-0000-000000000001', 'EXPLANATION', 1, 
'{"text": "### Medico-Legal Jurisprudence & MCCD\n\nMCCD Death Certification: Part I captures causal sequence: (a) Immediate cause, (b) Antecedent, (c) Underlying Cause of Death (UCOD). Terminal mechanisms (''Cardiorespiratory arrest'', ''Brain death'', ''Asphyxia'') must NEVER be entered as UCOD. Part II documents contributory comorbidities. MLC Protocols: Mandatory police notification and viscera preservation in saturated saline with unbroken custody chains. THOTA Brainstem Death: Certified by 4-doctor panel with 2 apnea tests separated by 6 hours demonstrating absent breathing with PaCO2 >=60 mmHg (or rise >=20 mmHg above baseline)."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 2: Entrustable Professional Activities & Clinical Decision-Making
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa650001-0000-0000-0000-000000000002', 'f9f9a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a26', 'Entrustable Professional Activities & Clinical Decision-Making', 2)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa650002-0000-0000-0000-000000000002', 'fa650001-0000-0000-0000-000000000002', 'The 13 Core Entrustable Professional Activities (EPAs 1 to 13)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa650003-0000-0000-0000-000000000002', 'fa650002-0000-0000-0000-000000000002', 'Chen''s 5-Level Entrustment Scale (Level 4 Independent Practice Target)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa650004-0000-0000-0000-000000000002', 'fa650003-0000-0000-0000-000000000002', 'Workplace-Based Assessment Triangulation (Mini-CEX, DOPS & CbD)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa650005-0000-0000-0000-000000000002', 'fa650004-0000-0000-0000-000000000002', 'Autonomous Entrustment Benchmarks, Workplace Procedural Appraisals, Triangulated Competencies, and Licensure Certifications', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa650006-0000-0000-0000-000000000002', 'fa650005-0000-0000-0000-000000000002', 'EXPLANATION', 1, 
'{"text": "### Entrustable Professional Activities (EPAs)\n\nCore EPAs: 13 essential clinical units of practice encompassing history/exam, differential diagnosis, diagnostic ordering, prescription safety, EHR documentation, oral presentation, EBM query, SBAR handover, teamwork, urgent care initiation, informed consent, procedural dexterity, and QI. Chen''s Entrustment Scale: Level 1 (Observe), Level 2 (Direct supervision), Level 3 (Indirect supervision), Level 4 (Independent practice with distant oversight - Exit Graduation Target), Level 5 (Supervising others). WBA Portfolio: Mini-CEX, DOPS, and CbD provide objective validity evidence."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 3: Exit OSCE Master Stations: Multi-Disciplinary Clinical Simulations
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa650001-0000-0000-0000-000000000003', 'f9f9a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a26', 'Exit OSCE Master Stations: Multi-Disciplinary Clinical Simulations', 3)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa650002-0000-0000-0000-000000000003', 'fa650001-0000-0000-0000-000000000003', 'Septic Shock Resuscitation (30 mL/kg & Norepinephrine MAP >=65 mmHg)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa650003-0000-0000-0000-000000000003', 'fa650002-0000-0000-0000-000000000003', 'CICO Surgical Cricothyroidotomy (Scalpel-Bougie-Tube Protocol 6.0 ETT)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa650004-0000-0000-0000-000000000003', 'fa650003-0000-0000-0000-000000000003', 'Refractory PPH Bakri Balloon & Acute Stroke Thrombolysis (<=4.5h)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa650005-0000-0000-0000-000000000003', 'fa650004-0000-0000-0000-000000000003', 'Vasomotor Microvascular Restorations, Cricothyroidal Front-of-Neck Accesses, Hydrostatic Uterotonic Tamponades, and Thrombolytic Fibrinolyses', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa650006-0000-0000-0000-000000000003', 'fa650005-0000-0000-0000-000000000003', 'EXPLANATION', 1, 
'{"text": "### Exit OSCE Master Stations\n\nResuscitation Simulation: Sepsis bundle (lactate >4, 30 mL/kg crystalloids within 3h, broad antibiotics within 1h, Norepinephrine for MAP >=65). CICO Airway Crisis: Declare emergency, execute Scalpel-Bougie-Tube surgical cricothyroidotomy through cricothyroid membrane with 6.0 cuffed ETT. PPH Master Station: Uterotonic escalation (Oxytocin, Methergine, Carboprost, Misoprostol) and Bakri balloon tamponade (300-500 mL saline). Stroke Master Station: Non-contrast CT excluding hemorrhage + IV Alteplase 0.9 mg/kg within 4.5 hours of symptom onset."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 4: Quality Improvement, Patient Safety & Clinical Audits
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa650001-0000-0000-0000-000000000004', 'f9f9a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a26', 'Quality Improvement, Patient Safety & Clinical Audits', 4)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa650002-0000-0000-0000-000000000004', 'fa650001-0000-0000-0000-000000000004', 'Root Cause Analysis (Ishikawa 6Ms & 5 Whys Iteration)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa650003-0000-0000-0000-000000000004', 'fa650002-0000-0000-0000-000000000004', 'Plan-Do-Study-Act (PDSA) Cycles & Run Chart Interventions', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa650004-0000-0000-0000-000000000004', 'fa650003-0000-0000-0000-000000000004', 'SBAR Structured Handover Framework (Situation-Background-Assessment-Action)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa650005-0000-0000-0000-000000000004', 'fa650004-0000-0000-0000-000000000004', 'Organizational Latent Fault Analyses, Rapid Iterative Quality Cycles, Run Chart Trajectories, and Structured Interpersonal Escalations', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa650006-0000-0000-0000-000000000004', 'fa650005-0000-0000-0000-000000000004', 'EXPLANATION', 1, 
'{"text": "### Quality Improvement & Patient Safety\n\nRoot Cause Analysis: Ishikawa 6M fishbone (Manpower, Methods, Machines, Materials, Measurements, Milieu) and the 5 Whys technique identify latent institutional vulnerabilities behind sharp-end errors. PDSA Cycles: Iterative scientific improvement (Plan SMART aim, Do single-ward pilot, Study run chart data, Act hospital-wide scale). SBAR Handover: Situation (immediate crisis), Background (pertinent context), Assessment (diagnostic impression), Recommendation (timed, actionable request) prevents critical communication breakdowns."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;
