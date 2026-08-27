-- V111: Seed Postgraduate Advanced Psychiatry, Neuropsychiatry & Interventional Neuromodulation (PG-610) Full Curriculum

-- Ensure Subject: PG-610 exists with correct title and category
INSERT INTO subjects (id, semester_id, code, title, category)
VALUES ('f9f9a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a36', 'd0e1f2a3-c4d5-6e7f-8a9b-0c1d2e3f4a5b', 'PG-610', 'Postgraduate Advanced Psychiatry, Neuropsychiatry & Interventional Neuromodulation', 'CLINICAL')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, category = EXCLUDED.category;

-- Unit 1: Treatment-Resistant Depression (TRD) & Interventional Neuromodulation
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa750001-0000-0000-0000-000000000001', 'f9f9a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a36', 'Treatment-Resistant Depression (TRD) & Interventional Neuromodulation', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa750002-0000-0000-0000-000000000001', 'fa750001-0000-0000-0000-000000000001', 'TRD Staging, Atypical Antipsychotic & Lithium Augmentations', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa750003-0000-0000-0000-000000000001', 'fa750002-0000-0000-0000-000000000001', 'Electroconvulsive Therapy (ECT) Seizure Titration & Anesthesia', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa750004-0000-0000-0000-000000000001', 'fa750003-0000-0000-0000-000000000001', 'Repetitive Transcranial Magnetic Stimulation (rTMS) & Esketamine REMS', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa750005-0000-0000-0000-000000000001', 'fa750004-0000-0000-0000-000000000001', 'Treatment-Resistant Depression Staging, Methohexital-Succinylcholine ECT Anesthesia, Left DLPFC rTMS Stimulations, and Intranasal Esketamine Pharmacovigilance', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa750006-0000-0000-0000-000000000001', 'fa750005-0000-0000-0000-000000000001', 'EXPLANATION', 1, 
'{"text": "### Treatment-Resistant Depression & Interventional Neuromodulation\n\nTRD Definition: Failure of >=2 adequate trials of first-line antidepressants from different pharmacologic classes for >=6-8 weeks at therapeutic doses. Augmentation Strategies: Aripiprazole (2-5 mg), Brexpiprazole, Lithium (0.6-0.8 mEq/L target), and T3 liothyronine (25-50 ug). Interventional Neuromodulation: (1) Electroconvulsive Therapy (ECT): Indicated for severe acute suicidality, psychotic depression, refractory catatonia, and food refusal inanition. Electrode placement: Right Unilateral (RUL d''Elia) to spare retrograde memory vs Bilateral Bitemporal for maximum rapid efficacy. Gold-standard anesthesia: Methohexital (0.75-1.0 mg/kg IV) due to minimal seizure threshold interference + Succinylcholine (0.5-1.0 mg/kg IV) for neuromuscular relaxation; (2) High-frequency rTMS (10 Hz over Left DLPFC) for cortical LTP activation; (3) Intranasal Esketamine (Spravato 56/84 mg): Non-competitive NMDA receptor antagonist requiring 2-hour REMS post-dose monitoring for sedation, dissociation, and blood pressure spikes."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 2: Catatonia, Neuroleptic Malignant Syndrome (NMS) & Serotonin Syndrome
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa750001-0000-0000-0000-000000000002', 'f9f9a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a36', 'Catatonia, Neuroleptic Malignant Syndrome (NMS) & Serotonin Syndrome', 2)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa750002-0000-0000-0000-000000000002', 'fa750001-0000-0000-0000-000000000002', 'Bush-Francis Catatonia Rating Scale & Lorazepam Challenge Test', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa750003-0000-0000-0000-000000000002', 'fa750002-0000-0000-0000-000000000002', 'Neuroleptic Malignant Syndrome (NMS) Rhabdomyolysis & Dantrolene Rescue', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa750004-0000-0000-0000-000000000002', 'fa750003-0000-0000-0000-000000000002', 'Hunter Serotonin Toxicity Criteria & Cyproheptadine Protocols', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa750005-0000-0000-0000-000000000002', 'fa750004-0000-0000-0000-000000000002', 'Bush-Francis Stupor Scores, Lorazepam Reversals, NMS Lead-Pipe Rhabdomyolyses, and Hunter Serotonin Clonus Differentiations', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa750006-0000-0000-0000-000000000002', 'fa750005-0000-0000-0000-000000000002', 'EXPLANATION', 1, 
'{"text": "### Catatonia, NMS & Serotonin Syndrome\n\nCatatonia: Characterized by stupor, mutism, waxy flexibility (cerea flexibilitas), catalepsy, and negativism. Lorazepam Challenge: 1-2 mg IV lorazepam produces >=50% drop in Bush-Francis Catatonia Rating Scale within 15-30 minutes; treatment is scheduled lorazepam (8-16 mg/day) or emergency ECT for malignant catatonia. Neuroleptic Malignant Syndrome (NMS): Triggered by D2 antagonism or dopamine agonist withdrawal; features hyperthermia (>38C), generalized ''lead-pipe'' muscle rigidity, hyporeflexia, and massive CK elevation (>1,000-100,000 U/L) with rhabdomyolysis/myoglobinuria; immediate cessation of offending drug, aggressive IV crystalloid hydration, Dantrolene (1-2.5 mg/kg IV) + Bromocriptine (2.5-5 mg PO Q8H). Serotonin Syndrome (SS): Hunter criteria emphasize neuromuscular excitation with hyperreflexia, spontaneous/ocular clonus, diaphoresis, mydriasis, and hyperactive bowel sounds (diarrhea); treat by stopping serotonergics, benzodiazepines, and Cyproheptadine (12 mg PO load, 2 mg Q2H)."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 3: Treatment-Refractory Schizophrenia (TRS) & Clozapine REMS Protocols
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa750001-0000-0000-0000-000000000003', 'f9f9a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a36', 'Treatment-Refractory Schizophrenia (TRS) & Clozapine REMS Protocols', 3)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa750002-0000-0000-0000-000000000003', 'fa750001-0000-0000-0000-000000000003', 'TRS Diagnostic Criteria & Therapeutic Clozapine Trough Monitoring', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa750003-0000-0000-0000-000000000003', 'fa750002-0000-0000-0000-000000000003', 'Absolute Neutrophil Count (ANC) REMS Pharmacovigilance & BEN Guidelines', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa750004-0000-0000-0000-000000000003', 'fa750003-0000-0000-0000-000000000003', 'Myocarditis, Gastrointestinal Hypomotility & Dose-Dependent Seizures', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa750005-0000-0000-0000-000000000003', 'fa750004-0000-0000-0000-000000000003', 'Treatment-Refractory Schizophrenia Diagnostic Benchmarks, ANC REMS Thresholds, Agranulocytosis Filgrastim Interventions, and Myocarditis Troponin Checks', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa750006-0000-0000-0000-000000000003', 'fa750005-0000-0000-0000-000000000003', 'EXPLANATION', 1, 
'{"text": "### Refractory Schizophrenia & Clozapine Protocols\n\nTRS Definition: Failure of >=2 adequate trials of non-clozapine antipsychotics (including second-generation) for >=6 weeks at chlorpromazine equivalent >=600 mg/day. Clozapine Efficacy: Superior for refractory positive symptoms, suicide prevention, and aggression. Target therapeutic trough level: 350-600 ng/mL. Absolute Neutrophil Count (ANC) REMS Guidelines: Baseline requirement >=1,500/uL (or >=1,000/uL for Benign Ethnic Neutropenia BEN); monitoring is Weekly for months 1-6 -> Biweekly for months 7-12 -> Monthly thereafter. REMS Actions: (1) Mild neutropenia (1,000-1,499/uL): Continue, test 3x/week; (2) Moderate/Severe neutropenia (<1,000/uL): SUSPEND IMMEDIATELY with daily CBC; (3) Agranulocytosis (<500/uL): STOP PERMANENTLY, reverse isolation, G-CSF (Filgrastim), never rechallenge. High-Yield Toxicities: Early myocarditis (troponin/CRP in first 4-6 weeks; stop if elevated), severe paralytic ileus/toxic megacolon (prophylactic PEG bowel regimen), and dose-dependent seizures (>600 mg/day; treat with valproate)."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 4: Bipolar Mania, Perinatal Psychiatry & Lithium Toxicity Resuscitation
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa750001-0000-0000-0000-000000000004', 'f9f9a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a36', 'Bipolar Mania, Perinatal Psychiatry & Lithium Toxicity Resuscitation', 4)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa750002-0000-0000-0000-000000000004', 'fa750001-0000-0000-0000-000000000004', 'Acute Bipolar Mania & Lithium Therapeutic Trough Concentration Ranges', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa750003-0000-0000-0000-000000000004', 'fa750002-0000-0000-0000-000000000004', 'Lithium Toxicity Grading & Emergent Hemodialysis Indications', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa750004-0000-0000-0000-000000000004', 'fa750003-0000-0000-0000-000000000004', 'Postpartum Psychosis Emergencies & Mood Stabilizer Teratogenicity', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa750005-0000-0000-0000-000000000004', 'fa750004-0000-0000-0000-000000000004', 'Acute Mania Therapeutic Levels, Lithium Toxicity Hemodialysis Thresholds, Postpartum Psychosis Inpatient Managements, and Valproate-Lithium Teratology Risks', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa750006-0000-0000-0000-000000000004', 'fa750005-0000-0000-0000-000000000004', 'EXPLANATION', 1, 
'{"text": "### Bipolar Mania, Perinatal Psychiatry & Lithium Toxicity\n\nLithium Concentrations: Maintenance (0.6-0.8 mEq/L); Acute mania (0.8-1.2 mEq/L); Mild toxicity (1.5-2.0 mEq/L: coarse tremor, nausea, ataxia -> hold drug, IV normal saline); Moderate toxicity (2.0-2.5 mEq/L: clonus, hyperreflexia, confusion); Severe toxicity (>2.5 mEq/L or >4.0 mEq/L acute: seizures, coma, arrhythmias -> Emergent Hemodialysis). Drug Interactions: Thiazides, NSAIDs, and ACE inhibitors decrease renal lithium clearance, triggering severe toxicity. Perinatal Psychiatry: (1) Postpartum Psychosis: High infanticide/suicide risk (5%) within 1-2 weeks postpartum; requires immediate involuntary inpatient admission and antipsychotic/ECT therapy; (2) Teratogenicity: Lithium causes Ebstein anomaly (apical tricuspid valve displacement, ~1/1000 risk); Valproate causes neural tube defects (spina bifida 1-2%) and permanent 8-10 point IQ reductions, making it strictly contraindicated in women of childbearing potential."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;
