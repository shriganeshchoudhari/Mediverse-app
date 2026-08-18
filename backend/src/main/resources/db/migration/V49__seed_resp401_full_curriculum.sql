-- V49: Seed Respiratory Medicine / Pulmonology (RESP-401) Full Curriculum

-- Ensure Subject: RESP-401 exists with correct title and category
INSERT INTO subjects (id, semester_id, code, title, category)
VALUES ('f8c7a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0d', 'c9d0e1f2-b3c4-5d6e-7f8a-9b0c1d2e3f4a', 'RESP-401', 'Respiratory Medicine & Pulmonology', 'CLINICAL')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, category = EXCLUDED.category;

-- Unit 1: Pulmonary Function Testing, Spirometry & Flow-Volume Loops
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa110001-0000-0000-0000-000000000001', 'f8c7a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0d', 'Pulmonary Function Testing, Spirometry & Flow-Volume Loops', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa110002-0000-0000-0000-000000000001', 'fa110001-0000-0000-0000-000000000001', 'Stepwise PFT Interpretation Algorithm (FEV1/FVC, FVC, TLC)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa110003-0000-0000-0000-000000000001', 'fa110002-0000-0000-0000-000000000001', 'Bronchodilator Reversibility Testing & GOLD COPD Staging', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa110004-0000-0000-0000-000000000001', 'fa110003-0000-0000-0000-000000000001', 'Flow-Volume Loop Morphologies & DLCO Differentials', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa110005-0000-0000-0000-000000000001', 'fa110004-0000-0000-0000-000000000001', 'Spirometry Interpretation, Bronchodilator Reversibility, GOLD 1-4 Staging, Flow-Volume Loops and DLCO Differentials', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa110006-0000-0000-0000-000000000001', 'fa110005-0000-0000-0000-000000000001', 'EXPLANATION', 1, 
'{"text": "### Pulmonary Function Tests & Spirometry\n\nFEV1/FVC < 0.70 establishes Obstructive defect. Bronchodilator reversibility is positive if FEV1 or FVC improves >=12% and >=200 mL (characteristic of Asthma). COPD shows fixed airflow limitation staged by post-BD FEV1 (GOLD 1 >=80%, GOLD 2 50-79%, GOLD 3 30-49%, GOLD 4 <30%). Restrictive defect has FEV1/FVC >=0.70 with TLC <80%. DLCO is reduced in Emphysema and Intrinsic ILD (IPF), but normal in Asthma and Extrinsic chest wall restriction."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 2: Tuberculosis NTEP Diagnostics, GeneXpert & MDR Regimens
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa110001-0000-0000-0000-000000000002', 'f8c7a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0d', 'Tuberculosis NTEP Diagnostics, GeneXpert & MDR Regimens', 2)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa110002-0000-0000-0000-000000000002', 'fa110001-0000-0000-0000-000000000002', 'Primary vs Reactivation TB & Granuloma Immunopathology', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa110003-0000-0000-0000-000000000002', 'fa110002-0000-0000-0000-000000000002', 'CBNAAT GeneXpert MTB/RIF & Line Probe Assay (LPA)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa110004-0000-0000-0000-000000000002', 'fa110003-0000-0000-0000-000000000002', 'NTEP 2 HRZE Regimen, Drug Toxicities & All-Oral BPaL for MDR-TB', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa110005-0000-0000-0000-000000000002', 'fa110004-0000-0000-0000-000000000002', 'Tuberculosis Pathogenesis, CBNAAT GeneXpert, First-Line 2 HRZE Regimen, Drug Toxicities and BPaL MDR-TB Therapy', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa110006-0000-0000-0000-000000000002', 'fa110005-0000-0000-0000-000000000002', 'EXPLANATION', 1, 
'{"text": "### Tuberculosis & NTEP Guidelines\n\nGeneXpert CBNAAT real-time PCR detects M. tuberculosis and Rifampicin resistance (rpoB) within 2 hours. Standard drug-sensitive TB regimen: 2 HRZE + 4 HRE daily. Drug toxicities: Isoniazid (peripheral neuropathy, co-prescribe Pyridoxine B6), Rifampicin (red-orange secretions, CYP3A4 inducer), Pyrazinamide (hyperuricemia/gout, hepatotoxicity), Ethambutol (retrobulbar optic neuritis with red-green dyschromatopsia). MDR-TB is treated with all-oral 6-month BPaL (Bedaquiline, Pretomanid, Linezolid)."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 3: Pleural Diseases, Light''s Criteria & Empyema Drainage
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa110001-0000-0000-0000-000000000003', 'f8c7a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0d', 'Pleural Diseases, Light''s Criteria & Empyema Drainage', 3)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa110002-0000-0000-0000-000000000003', 'fa110001-0000-0000-0000-000000000003', 'Diagnostic Thoracocentesis Technique & Complication Prevention', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa110003-0000-0000-0000-000000000003', 'fa110002-0000-0000-0000-000000000003', 'Light''s Criteria for Transudate vs Exudate Differentiation', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa110004-0000-0000-0000-000000000003', 'fa110003-0000-0000-0000-000000000003', 'Parapneumonic Effusion Staging & Mandatory Chest Tube Drainage', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa110005-0000-0000-0000-000000000003', 'fa110004-0000-0000-0000-000000000003', 'Thoracocentesis Landmarks, Light''s Criteria, Tuberculous Pleurisy ADA, Complicated Parapneumonic Effusion and Empyema', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa110006-0000-0000-0000-000000000003', 'fa110005-0000-0000-0000-000000000003', 'EXPLANATION', 1, 
'{"text": "### Pleural Fluid Analysis & Light''s Criteria\n\nThoracocentesis is performed over the superior rib border at 7th-8th ICS. Light''s criteria define Exudate if: Pleural/Serum Protein >0.5, Pleural/Serum LDH >0.6, or Pleural LDH >2/3 ULN serum LDH. Transudates (CHF, cirrhosis, nephrosis) meet none. Tuberculous pleurisy shows elevated ADA (>40 U/L) with lymphocytic predominance. Complicated parapneumonic effusion (pH <7.20, glucose <40 mg/dL, LDH >1000 U/L) or frank Empyema mandates immediate Tube Thoracostomy chest tube drainage."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 4: Occupational Pneumoconioses & Obstructive Sleep Apnea
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa110001-0000-0000-0000-000000000004', 'f8c7a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0d', 'Occupational Pneumoconioses & Obstructive Sleep Apnea', 4)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa110002-0000-0000-0000-000000000004', 'fa110001-0000-0000-0000-000000000004', 'Silicosis, Eggshell Calcification & Silicotuberculosis', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa110003-0000-0000-0000-000000000004', 'fa110002-0000-0000-0000-000000000004', 'Asbestosis, Ferruginous Bodies & Malignant Mesothelioma', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa110004-0000-0000-0000-000000000004', 'fa110003-0000-0000-0000-000000000004', 'Obstructive Sleep Apnea (OSA), Polysomnography & CPAP Titration', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa110005-0000-0000-0000-000000000004', 'fa110004-0000-0000-0000-000000000004', 'Occupational Pneumoconioses (Silicosis, Asbestosis, CWP, Byssinosis) and OSA Polysomnography with CPAP Management', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa110006-0000-0000-0000-000000000004', 'fa110005-0000-0000-0000-000000000004', 'EXPLANATION', 1, 
'{"text": "### Occupational Lung Diseases & Sleep Apnea\n\nSilicosis: Upper lobe fibrotic nodules with eggshell hilar calcification and 30x increased risk of Tuberculosis. Asbestosis: Lower lobe fibrosis, calcified diaphragmatic pleural plaques, ferruginous bodies, bronchogenic carcinoma and malignant mesothelioma. Coal Worker Pneumoconiosis + RA = Caplan syndrome. Byssinosis (cotton dust): Monday morning chest tightness. Obstructive Sleep Apnea (OSA) is diagnosed by Polysomnography with Apnea-Hypopnea Index (AHI >=30 events/hour for severe); nocturnal CPAP is first-line gold standard therapy."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;
