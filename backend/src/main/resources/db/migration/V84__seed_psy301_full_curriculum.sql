-- V84: Seed Advanced Psychiatry & Clinical Psychopharmacology (PSY-301) Full Curriculum

-- Ensure Subject: PSY-301 exists with correct title and category
INSERT INTO subjects (id, semester_id, code, title, category)
VALUES ('f1d0a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a42', 'c7d8e9f0-b1c2-3d4e-5f6a-7b8c9d0e1f2a', 'PSY-301', 'Advanced Psychiatry & Clinical Psychopharmacology', 'CLINICAL')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, category = EXCLUDED.category;

-- Unit 1: Acute Psychiatric Emergencies & Tox-Syndromes
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa470001-0000-0000-0000-000000000001', 'f1d0a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a42', 'Acute Psychiatric Emergencies & Tox-Syndromes', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa470002-0000-0000-0000-000000000001', 'fa470001-0000-0000-0000-000000000001', 'Neuroleptic Malignant Syndrome (NMS) Lead-Pipe Rigidity & Dantrolene', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa470003-0000-0000-0000-000000000001', 'fa470002-0000-0000-0000-000000000001', 'Serotonin Syndrome Hunter Criteria, Clonus & Cyproheptadine', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa470004-0000-0000-0000-000000000001', 'fa470003-0000-0000-0000-000000000001', 'Acute Extrapyramidal Dystonias, Akathisia & Tardive Dyskinesia (VMAT2)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa470005-0000-0000-0000-000000000001', 'fa470004-0000-0000-0000-000000000001', 'Striatal Dopamine D2 Antagonisms, Serotonin 5-HT2A Storms, Lead-Pipe Hyporeflexias, and Ryanodine-Receptor Decompressions', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa470006-0000-0000-0000-000000000001', 'fa470005-0000-0000-0000-000000000001', 'EXPLANATION', 1, 
'{"text": "### Acute Psychiatric Emergencies & Tox-Syndromes\n\nNMS: D2 antagonism; hyperthermia >40C, lead-pipe rigidity, hyporeflexia, massive CK >1,000-50,000 U/L -> stop antipsychotic + ICU cooling + Dantrolene + Bromocriptine. Serotonin Syndrome: 5-HT excess (Hunter criteria); hyperreflexia, ocular/spontaneous clonus, tremor, diaphoresis -> Cyproheptadine (5-HT2A antagonist) + Benzodiazepines. Acute Dystonia: Rapid painful muscle spasm -> IV/IM Benztropine/Diphenhydramine. Tardive Dyskinesia: Choreoathetoid lip smacking -> Valbenazine/Deutetrabenazine (VMAT2 inhibitors)."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 2: Mood Disorders & Psychopharmacologic Teratology
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa470001-0000-0000-0000-000000000002', 'f1d0a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a42', 'Mood Disorders & Psychopharmacologic Teratology', 2)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa470002-0000-0000-0000-000000000002', 'fa470001-0000-0000-0000-000000000002', 'Bipolar I DIG FAST Mania vs Bipolar II Hypomania', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa470003-0000-0000-0000-000000000002', 'fa470002-0000-0000-0000-000000000002', 'Lithium Narrow Index (0.6-1.2), Hemodialysis & Ebstein Anomaly', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa470004-0000-0000-0000-000000000002', 'fa470003-0000-0000-0000-000000000002', 'Valproate Spina Bifida, Lamotrigine SJS & Carbamazepine SIADH', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa470005-0000-0000-0000-000000000002', 'fa470004-0000-0000-0000-000000000002', 'Inositol Monophosphatase Blockades, Apical Tricuspid Displacements, Neural Tube Epigenetic Teratogeneses, and Extracorporeal Dialysis Clearances', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa470006-0000-0000-0000-000000000002', 'fa470005-0000-0000-0000-000000000002', 'EXPLANATION', 1, 
'{"text": "### Mood Disorders & Psychopharmacology\n\nBipolar I: Mania (DIG FAST >=7 days or hospitalized) with marked impairment. Lithium: Therapeutic index 0.6-1.2 mEq/L; toxicity >1.5 mEq/L (coarse tremor, ataxia); hemodialysis indicated for >2.5 mEq/L with severe symptoms/AKI or >4.0 mEq/L; causes fetal Ebstein anomaly. Valproate: Neural tube defects (spina bifida 1-2%), hepatotoxicity, pancreatitis. Lamotrigine: Bipolar depression; requires slow titration due to SJS/TEN risk. Carbamazepine: Aplastic anemia, SIADH hyponatremia, CYP3A4 autoinduction."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 3: Psychotic Disorders & Antipsychotic Therapeutics
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa470001-0000-0000-0000-000000000003', 'f1d0a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a42', 'Psychotic Disorders & Antipsychotic Therapeutics', 3)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa470002-0000-0000-0000-000000000003', 'fa470001-0000-0000-0000-000000000003', 'Schizophrenia Diagnostic Timeline (6 Months) & Symptom Domains', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa470003-0000-0000-0000-000000000003', 'fa470002-0000-0000-0000-000000000003', 'Clozapine REMS ANC Monitoring (<500/uL Agranulocytosis Stop)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa470004-0000-0000-0000-000000000003', 'fa470003-0000-0000-0000-000000000003', 'Olanzapine Metabolic Syndrome & Risperidone Hyperprolactinemia', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa470005-0000-0000-0000-000000000003', 'fa470004-0000-0000-0000-000000000003', 'Mesolimbic Hyperdopaminergic Hallucinations, Tuberoinfundibular Lactotrophic Elevations, Myeloid Granulocytic Aplasias, and Serotonin-Dopamine Antagonisms', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa470006-0000-0000-0000-000000000003', 'fa470005-0000-0000-0000-000000000003', 'EXPLANATION', 1, 
'{"text": "### Psychotic Disorders & Antipsychotics\n\nSchizophrenia: >=2 core symptoms for >=6 months (with >=1 month active). Clozapine: Gold standard for treatment-resistant schizophrenia and suicidality; REMS tracking: severe neutropenia (ANC <500/uL) mandates permanent discontinuation and G-CSF Filgrastim; risk of myocarditis and seizures. Olanzapine: Severe metabolic syndrome (weight gain, diabetes, dyslipidemia). Risperidone: High D2 potency causing tuberoinfundibular hyperprolactinemia (galactorrhea, amenorrhea)."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 4: Substance Use Disorders & Addiction Medicine
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa470001-0000-0000-0000-000000000004', 'f1d0a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a42', 'Substance Use Disorders & Addiction Medicine', 4)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa470002-0000-0000-0000-000000000004', 'fa470001-0000-0000-0000-000000000004', 'Alcohol Withdrawal Timeline & Delirium Tremens (48-96 Hours)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa470003-0000-0000-0000-000000000004', 'fa470002-0000-0000-0000-000000000004', 'CIWA-Ar Benzodiazepines & Thiamine Before Glucose for Wernicke', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa470004-0000-0000-0000-000000000004', 'fa470003-0000-0000-0000-000000000004', 'Naltrexone Craving Reduction & Opioid Naloxone/Buprenorphine Protocols', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa470005-0000-0000-0000-000000000004', 'fa470004-0000-0000-0000-000000000004', 'GABA-A Allosteric Uncouplings, NMDA Excitotoxic Autonomic Storms, Mammillary Body Necroses, and Mu-Opioid Partial Agonisms', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa470006-0000-0000-0000-000000000004', 'fa470005-0000-0000-0000-000000000004', 'EXPLANATION', 1, 
'{"text": "### Substance Use Disorders & Addiction Medicine\n\nAlcohol Withdrawal: Tremors (6-12h) -> Hallucinosis (12-24h) -> Seizures (12-48h) -> Delirium Tremens (48-96h: delirium, fever, autonomic collapse). Managed with CIWA Benzodiazepines (Diazepam/Lorazepam). Wernicke Encephalopathy: Mammillary body necrosis; ALWAYS give Thiamine BEFORE Dextrose. Maintenance: Naltrexone (mu-antagonist blunts cravings), Acamprosate (NMDA modulator). Opioids: Overdose reversed with Naloxone; maintenance with Buprenorphine or Methadone."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;
