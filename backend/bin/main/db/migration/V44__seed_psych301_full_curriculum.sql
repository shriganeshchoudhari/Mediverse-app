-- V44: Seed Psychiatry & Behavioral Health (PSYCH-301) Full Curriculum

-- Ensure Subject: PSYCH-301 exists with correct title and category
INSERT INTO subjects (id, semester_id, code, title, category)
VALUES ('f7b7a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0c', 'c9d0e1f2-b3c4-5d6e-7f8a-9b0c1d2e3f4a', 'PSYCH-301', 'Psychiatry & Behavioral Health', 'CLINICAL')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, category = EXCLUDED.category;

-- Unit 1: Mental Status Examination & Major Depression
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa060001-0000-0000-0000-000000000001', 'f7b7a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0c', 'Mental Status Examination, Major Depression & SIGECAPS', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa060002-0000-0000-0000-000000000001', 'fa060001-0000-0000-0000-000000000001', 'MSE Thought Process vs Content & Delusions', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa060003-0000-0000-0000-000000000001', 'fa060002-0000-0000-0000-000000000001', 'DSM-5-TR SIGECAPS Major Depression Diagnostic Criteria', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa060004-0000-0000-0000-000000000001', 'fa060003-0000-0000-0000-000000000001', 'Atypical vs Melancholic vs Psychotic Depression & ECT', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa060005-0000-0000-0000-000000000001', 'fa060004-0000-0000-0000-000000000001', 'Mental Status Examination, Major Depressive Disorder and Pharmacotherapeutic Strategies', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa060006-0000-0000-0000-000000000001', 'fa060005-0000-0000-0000-000000000001', 'EXPLANATION', 1, 
'{"text": "### Mental Status Examination & Major Depression\n\nMSE systematically assesses appearance, speech, mood/affect, thought process (circumstantiality vs tangentiality vs flight of ideas), and thought content (delusions, hallucinations). Major Depressive Disorder requires >=5 of 9 SIGECAPS symptoms for >=2 weeks, including depressed mood or anhedonia. Atypical depression features leaden paralysis and mood reactivity; melancholic features respond to ECT."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 2: Bipolar Affective Disorder & Lithium Toxicity
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa060001-0000-0000-0000-000000000002', 'f7b7a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0c', 'Bipolar Affective Disorder, DIGFAST & Lithium Toxicity', 2)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa060002-0000-0000-0000-000000000002', 'fa060001-0000-0000-0000-000000000002', 'Bipolar I Mania vs Bipolar II Hypomania', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa060003-0000-0000-0000-000000000002', 'fa060002-0000-0000-0000-000000000002', 'Lithium Carbonate Therapeutic Range & Nephrogenic DI', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa060004-0000-0000-0000-000000000002', 'fa060003-0000-0000-0000-000000000002', 'Lithium Toxicity Management & Hemodialysis Indications', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa060005-0000-0000-0000-000000000002', 'fa060004-0000-0000-0000-000000000002', 'Bipolar Mood Episodes, DIGFAST Criteria, Lithium Pharmacokinetics and Emergency Dialysis', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa060006-0000-0000-0000-000000000002', 'fa060005-0000-0000-0000-000000000002', 'EXPLANATION', 1, 
'{"text": "### Bipolar Disorder & Mood Stabilizers\n\nBipolar I requires >=1 manic episode (DIGFAST >=1 week with functional impairment). Lithium (therapeutic range 0.6-1.2 mEq/L) reduces suicide risk but carries risks of Nephrogenic DI (Amiloride), hypothyroidism, and toxicity precipitated by NSAIDs/Thiazides. Emergency hemodialysis is indicated for Lithium >4.0 mEq/L or >2.5 mEq/L with severe neurotoxicity."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 3: Schizophrenia Spectrum & Neuroleptic Emergencies
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa060001-0000-0000-0000-000000000003', 'f7b7a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0c', 'Schizophrenia Spectrum, Antipsychotic EPS & NMS', 3)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa060002-0000-0000-0000-000000000003', 'fa060001-0000-0000-0000-000000000003', 'Psychosis Timeline: Brief Psychotic to Schizophrenia', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa060003-0000-0000-0000-000000000003', 'fa060002-0000-0000-0000-000000000003', 'Antipsychotic Extrapyramidal Symptoms & Tardive Dyskinesia', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa060004-0000-0000-0000-000000000003', 'fa060003-0000-0000-0000-000000000003', 'Neuroleptic Malignant Syndrome & Clozapine Agranulocytosis', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa060005-0000-0000-0000-000000000003', 'fa060004-0000-0000-0000-000000000003', 'Schizophrenia Spectrum, Antipsychotic Adverse Effects, Movement Disorders and NMS Emergency', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa060006-0000-0000-0000-000000000003', 'fa060005-0000-0000-0000-000000000003', 'EXPLANATION', 1, 
'{"text": "### Schizophrenia & Antipsychotics\n\nSchizophrenia timeline progresses from Brief Psychotic (<1mo) -> Schizophreniform (1-6mo) -> Schizophrenia (>=6mo with negative 5 As). Schizoaffective requires >=2 weeks of pure psychosis without mood symptoms. Antipsychotic EPS includes acute dystonia (Diphenhydramine), akathisia (Propranolol), and NMS (lead-pipe rigidity, fever, CK elevation -> Dantrolene)."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 4: Anxiety, OCD & Trauma-Related Disorders
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa060001-0000-0000-0000-000000000004', 'f7b7a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0c', 'Anxiety Disorders, Panic, OCD ERP & PTSD Prazosin', 4)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa060002-0000-0000-0000-000000000004', 'fa060001-0000-0000-0000-000000000004', 'Panic Disorder, Agoraphobia & GAD Buspirone', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa060003-0000-0000-0000-000000000004', 'fa060002-0000-0000-0000-000000000004', 'Obsessive-Compulsive Disorder & ERP Protocol', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa060004-0000-0000-0000-000000000004', 'fa060003-0000-0000-0000-000000000004', 'Acute Stress Disorder vs PTSD & Prazosin Nightmares', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa060005-0000-0000-0000-000000000004', 'fa060004-0000-0000-0000-000000000004', 'Anxiety Disorders, Obsessive-Compulsive Spectrum, Trauma Reaction and Pharmacological Management', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa060006-0000-0000-0000-000000000004', 'fa060005-0000-0000-0000-000000000004', 'EXPLANATION', 1, 
'{"text": "### Anxiety, OCD & PTSD\n\nPanic disorder features recurrent unexpected panic attacks and agoraphobia treated with SSRIs and CBT. OCD is managed with high-dose SSRIs (Fluoxetine 80mg) or Clomipramine combined with Exposure and Response Prevention (ERP). PTSD is diagnosed after >1 month of trauma intrusion/avoidance/hyperarousal, with Prazosin indicated for combat nightmares."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;
