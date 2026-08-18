-- V90: Seed Early Clinical Exposure II (ECE-102) Full Curriculum

-- Ensure Subject: ECE-102 exists with correct title and category
INSERT INTO subjects (id, semester_id, code, title, category)
VALUES ('e4f5a6b7-c8d9-0e1f-2a3b-4c5d6e7f8a9b', 'c4d5e6f7-a8b9-0c1d-2e3f-4a5b6c7d8e9f', 'ECE-102', 'Early Clinical Exposure II: Systems, Safety & Reasoning', 'PRE_CLINICAL')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, category = EXCLUDED.category;

-- Unit 1: Patient Safety Culture, Error Analysis & Root Cause Analysis
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa540001-0000-0000-0000-000000000001', 'e4f5a6b7-c8d9-0e1f-2a3b-4c5d6e7f8a9b', 'Patient Safety Culture, Error Analysis & Root Cause Analysis', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa540002-0000-0000-0000-000000000001', 'fa540001-0000-0000-0000-000000000001', 'James Reason Swiss Cheese Model: Latent Conditions vs Active Slips', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa540003-0000-0000-0000-000000000001', 'fa540002-0000-0000-0000-000000000001', 'Root Cause Analysis (RCA) Ishikawa Fishbone & 5 Whys Methodology', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa540004-0000-0000-0000-000000000001', 'fa540003-0000-0000-0000-000000000001', 'Hierarchy of Safety Controls (Forcing Functions vs Policies) & FMEA', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa540005-0000-0000-0000-000000000001', 'fa540004-0000-0000-0000-000000000001', 'Blunt-End Latent System Defenses, Sharp-End Execution Slips, Root Cause Inquiries, and Engineered Forcing Function Safeguards', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa540006-0000-0000-0000-000000000001', 'fa540005-0000-0000-0000-000000000001', 'EXPLANATION', 1, 
'{"text": "### Patient Safety & Root Cause Analysis\n\nSwiss Cheese Model: Latent conditions (blunt end: staffing, EHR design, drug look-alikes) lie dormant until aligned with sharp-end frontline execution slips to produce adverse events. RCA: Multidisciplinary retrospective analysis using Ishikawa fishbone diagrams (6 domains) and 5 Whys. Hierarchy of Controls: Engineering forcing functions (physical non-Luer connectors) are strongest; administrative memos/lectures are weakest."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 2: Interprofessional Communication, SBAR Handover & Team Dynamics
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa540001-0000-0000-0000-000000000002', 'e4f5a6b7-c8d9-0e1f-2a3b-4c5d6e7f8a9b', 'Interprofessional Communication, SBAR Handover & Team Dynamics', 2)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa540002-0000-0000-0000-000000000002', 'fa540001-0000-0000-0000-000000000002', 'SBAR Structured Handover Protocol (Situation, Background, Assessment, Recommendation)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa540003-0000-0000-0000-000000000002', 'fa540002-0000-0000-0000-000000000002', 'TeamSTEPPS Psychological Safety, CUS Mnemonic & Two-Challenge Rule', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa540004-0000-0000-0000-000000000002', 'fa540003-0000-0000-0000-000000000002', 'Closed-Loop Crisis Communication & Brief-Huddle-Debrief Cadences', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa540005-0000-0000-0000-000000000002', 'fa540004-0000-0000-0000-000000000002', 'Structured Handover Syntheses, Authority Gradient Escalations, Stop-the-Line CUS Assertions, and Verbatim Closed-Loop Callouts', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa540006-0000-0000-0000-000000000002', 'fa540005-0000-0000-0000-000000000002', 'EXPLANATION', 1, 
'{"text": "### Interprofessional Communication & Team Dynamics\n\nSBAR Protocol: Situation (immediate concern), Background (context/vitals), Assessment (clinical impression), Recommendation (specific actionable request). TeamSTEPPS: CUS mnemonic (''I am Concerned, I am Uncomfortable, this is a Safety issue / Stop the Line''); Two-Challenge Rule mandates voicing a safety concern at least twice across authority gradients. Closed-Loop Communication guarantees order verification in crisis resuscitations."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 3: Diagnostic Stewardship, Evidence-Based Medicine & Likelihood Ratios
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa540001-0000-0000-0000-000000000003', 'e4f5a6b7-c8d9-0e1f-2a3b-4c5d6e7f8a9b', 'Diagnostic Stewardship, Evidence-Based Medicine & Likelihood Ratios', 3)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa540002-0000-0000-0000-000000000003', 'fa540001-0000-0000-0000-000000000003', 'Diagnostic Decision Physics: Sensitivity, Specificity, PPV & NPV Prevalence Effects', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa540003-0000-0000-0000-000000000003', 'fa540002-0000-0000-0000-000000000003', 'Likelihood Ratios (LR+/LR-) & Fagan Nomogram Bayesian Probability Transformations', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa540004-0000-0000-0000-000000000003', 'fa540003-0000-0000-0000-000000000003', 'Choosing Wisely Stewardship: Avoiding Diagnostic Cascades & Incidentaloma Harms', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa540005-0000-0000-0000-000000000003', 'fa540004-0000-0000-0000-000000000003', 'Prevalence-Dependent Predictive Accuracies, Prevalence-Independent Likelihood Shifts, Odds-to-Probability Nomograms, and Low-Value De-escalations', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa540006-0000-0000-0000-000000000003', 'fa540005-0000-0000-0000-000000000003', 'EXPLANATION', 1, 
'{"text": "### Diagnostic Stewardship & EBM\n\nSensitivity/Specificity: Independent of disease prevalence (SnNOut rules out, SpPIn rules in). PPV: Increases with higher disease prevalence. Likelihood Ratios: LR+ = Sn / (1 - Sp) (>10 rules IN); LR- = (1 - Sn) / Sp (<0.1 rules OUT); both are prevalence-independent. Fagan Transformation: Pre-Test Odds x LR = Post-Test Odds. Choosing Wisely: Eliminating low-value testing prevents harmful false-positive diagnostic cascades and incidentalomas."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 4: Clinical Reasoning, Cognitive Biases & Diagnostic Errors
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa540001-0000-0000-0000-000000000004', 'e4f5a6b7-c8d9-0e1f-2a3b-4c5d6e7f8a9b', 'Clinical Reasoning, Cognitive Biases & Diagnostic Errors', 4)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa540002-0000-0000-0000-000000000004', 'fa540001-0000-0000-0000-000000000004', 'Dual-Process Cognitive Theory: System 1 Heuristics vs System 2 Analytical Deduction', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa540003-0000-0000-0000-000000000004', 'fa540002-0000-0000-0000-000000000004', 'Anchoring Bias, Diagnostic Momentum, Availability Bias & Premature Closure', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa540004-0000-0000-0000-000000000004', 'fa540003-0000-0000-0000-000000000004', 'Cognitive De-Biasing & Metacognitive Diagnostic Time-Out Pause Checklists', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa540005-0000-0000-0000-000000000004', 'fa540004-0000-0000-0000-000000000004', 'Fast Pattern-Matching Shortcuts, Salient Recent Recall Distortions, Triage Label Inheritances, and Metacognitive Forcing Reflections', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa540006-0000-0000-0000-000000000004', 'fa540005-0000-0000-0000-000000000004', 'EXPLANATION', 1, 
'{"text": "### Clinical Reasoning & Cognitive Biases\n\nDual-Process Theory: System 1 is fast and intuitive (vulnerable to cognitive biases); System 2 is slow, deliberate, and analytical. Cognitive Biases: Anchoring (fixating on initial data), Diagnostic Momentum (uncritically accepting prior labels), Availability (overestimating based on vivid recent cases), Premature Closure (ending workup too early). Diagnostic Time-Out: Asking ''What findings do NOT fit? What else could this be?'' breaks cognitive biases."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;
