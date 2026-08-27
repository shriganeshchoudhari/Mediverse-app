-- V105: Seed Postgraduate Advanced Pediatrics & Neonatal Intensive Care (PG-604) Full Curriculum

-- Ensure Subject: PG-604 exists with correct title and category
INSERT INTO subjects (id, semester_id, code, title, category)
VALUES ('f9f9a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a30', 'd0e1f2a3-c4d5-6e7f-8a9b-0c1d2e3f4a5b', 'PG-604', 'Postgraduate Advanced Pediatrics & Neonatal Intensive Care', 'CLINICAL')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, category = EXCLUDED.category;

-- Unit 1: Neonatal Hypoxic-Ischemic Encephalopathy (HIE) & Therapeutic Hypothermia
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa690001-0000-0000-0000-000000000001', 'f9f9a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a30', 'Neonatal Hypoxic-Ischemic Encephalopathy (HIE) & Therapeutic Hypothermia', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa690002-0000-0000-0000-000000000001', 'fa690001-0000-0000-0000-000000000001', 'Sarnat Staging & Cooling Inclusion Criteria (GA >=36w, Cord pH <=7.00)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa690003-0000-0000-0000-000000000001', 'fa690002-0000-0000-0000-000000000001', 'Therapeutic Hypothermia Protocol (33.5°C for 72h & Slow Rewarming <=0.5°C/h)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa690004-0000-0000-0000-000000000001', 'fa690003-0000-0000-0000-000000000001', 'Amplitude-Integrated EEG (aEEG) Backgrounds & Electrographic Seizures', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa690005-0000-0000-0000-000000000001', 'fa690004-0000-0000-0000-000000000001', 'Secondary Energy Failure, Targeted Core Cooling Blankets, Rebound Prevention, and Continuous Cerebral Function Monitoring', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa690006-0000-0000-0000-000000000001', 'fa690005-0000-0000-0000-000000000001', 'EXPLANATION', 1, 
'{"text": "### Neonatal HIE & Hypothermia\n\nSarnat Staging: Stage 1 (mild: hyperalert, 100% normal outcome); Stage 2 (moderate: lethargy, hypotonia, seizures, burst aEEG); Stage 3 (severe: coma, flaccid, isoelectric aEEG, >50% disability/mortality). Cooling Criteria: GA >=36 weeks, birth weight >=1,800g, age <=6 hours, cord/1h pH <=7.00 or base deficit >=16 mEq/L, and moderate-severe encephalopathy. Cooling Protocol: Maintain target core temperature at 33.5°C (33.0-34.0°C) for 72 consecutive hours. Rewarming: Rewarm slowly at <=0.5°C per hour over >=6 hours to prevent rebound seizures, cerebral hyperperfusion, and hypotension."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 2: Persistent Pulmonary Hypertension of the Newborn (PPHN) & Inhaled Nitric Oxide
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa690001-0000-0000-0000-000000000002', 'f9f9a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a30', 'Persistent Pulmonary Hypertension of the Newborn (PPHN) & Inhaled Nitric Oxide', 2)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa690002-0000-0000-0000-000000000002', 'fa690001-0000-0000-0000-000000000002', 'Pre- vs Post-Ductal SpO2 Gradient (>=10%) & Extrapulmonary Shunting', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa690003-0000-0000-0000-000000000002', 'fa690002-0000-0000-0000-000000000002', 'Oxygenation Index Calculation (OI >=25 for iNO vs OI >=40 for VA-ECMO)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa690004-0000-0000-0000-000000000002', 'fa690003-0000-0000-0000-000000000002', 'Inhaled Nitric Oxide (iNO 20 ppm) & Methemoglobinemia Monitoring', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa690005-0000-0000-0000-000000000002', 'fa690004-0000-0000-0000-000000000002', 'Ductal Shunts, cGMP Arteriolar Vasodilations, Step-Wise Weanings, and Extracorporeal Life Supports', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa690006-0000-0000-0000-000000000002', 'fa690005-0000-0000-0000-000000000002', 'EXPLANATION', 1, 
'{"text": "### PPHN & Inhaled Nitric Oxide\n\nPre- to Post-Ductal SpO2 Gradient: Difference of >=10% between right hand (pre-ductal) and foot (post-ductal) proves massive right-to-left shunting across the patent ductus arteriosus. Oxygenation Index: OI = (Mean Airway Pressure x FiO2 x 100) / PaO2. OI >=25 triggers Inhaled Nitric Oxide (iNO 20 ppm); OI >=40 with refractory hypoxemia triggers Neonatal VA-ECMO cannulation. iNO Protocol: Start at 20 ppm; wean step-wise (5 ppm -> 1 ppm) before stopping to prevent rebound pulmonary hypertension. Monitor blood Methemoglobin (keep MetHb <2.5%)."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 3: Extreme Prematurity, Non-Invasive Surfactant (LISA / MIST) & BPD Prevention
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa690001-0000-0000-0000-000000000003', 'f9f9a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a30', 'Extreme Prematurity, Non-Invasive Surfactant (LISA / MIST) & BPD Prevention', 3)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa690002-0000-0000-0000-000000000003', 'fa690001-0000-0000-0000-000000000003', 'Less Invasive Surfactant Administration (LISA / MIST on Nasal CPAP 6-8 cmH2O)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa690003-0000-0000-0000-000000000003', 'fa690002-0000-0000-0000-000000000003', 'Poractant Alfa (200 mg/kg / 2.5 mL/kg) Instillation & Compliance Recovery', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa690004-0000-0000-0000-000000000003', 'fa690003-0000-0000-0000-000000000003', 'Caffeine Citrate Protocol & Bronchopulmonary Dysplasia (BPD at 36w PMA)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa690005-0000-0000-0000-000000000003', 'fa690004-0000-0000-0000-000000000003', 'Spontaneous Inspirations, Non-Invasive Continuous Distending Pressures, Methylxanthine Stimulations, and Alveolar Preservations', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa690006-0000-0000-0000-000000000003', 'fa690005-0000-0000-0000-000000000003', 'EXPLANATION', 1, 
'{"text": "### LISA Surfactant & BPD Prevention\n\nLess Invasive Surfactant Administration (LISA / MIST): Instilling Poractant alfa (200 mg/kg = 2.5 mL/kg Curosurf) via a thin 16-18G catheter into the trachea of a spontaneously breathing preterm infant maintained on nasal CPAP (6-8 cmH2O). Avoids positive-pressure intubation and barotrauma. BPD Prevention: Defined as supplemental oxygen requirement at 36 weeks postmenstrual age (PMA). Prevented by early CPAP, LISA, caffeine citrate (20 mg/kg load, 5-10 mg/kg/d maintenance), and maintaining target SpO2 91-95%."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 4: Pediatric Septic Shock, Vasoactive-Inotropic Scores (VIS) & Corticosteroids
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa690001-0000-0000-0000-000000000004', 'f9f9a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a30', 'Pediatric Septic Shock, Vasoactive-Inotropic Scores (VIS) & Corticosteroids', 4)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa690002-0000-0000-0000-000000000004', 'fa690001-0000-0000-0000-000000000004', 'Pediatric Cold Shock (Epinephrine) vs Warm Shock (Norepinephrine)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa690003-0000-0000-0000-000000000004', 'fa690002-0000-0000-0000-000000000004', 'Vasoactive-Inotropic Score (VIS >=20 High-Risk Shock & ECMO Alert)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa690004-0000-0000-0000-000000000004', 'fa690003-0000-0000-0000-000000000004', 'Stress-Dose Hydrocortisone Protocol in Catecholamine Resistance (CIRCI)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa690005-0000-0000-0000-000000000004', 'fa690004-0000-0000-0000-000000000004', 'Myocardial Dysfunctions, Pharmacological Support Intensities, Adrenocortical Rescues, and Pediatric Extracorporeal Restorations', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa690006-0000-0000-0000-000000000004', 'fa690005-0000-0000-0000-000000000004', 'EXPLANATION', 1, 
'{"text": "### Pediatric Septic Shock & VIS\n\nCold vs Warm Shock: Cold shock (60-70% of pediatric shock: low CO, high SVR, cap refill >3s) -> first-line Epinephrine (0.05-0.3 mcg/kg/min). Warm shock (30-40%: high CO, low SVR, flash refill <1s) -> first-line Norepinephrine (0.05-0.3 mcg/kg/min). Vasoactive-Inotropic Score: VIS = Dopamine + Dobutamine + 100(Epi) + 100(Norepi) + 10,000(Vaso) + 10(Milrinone). VIS >=20 indicates critical refractory shock and triggers pediatric VA-ECMO consideration. Hydrocortisone: 1-2 mg/kg Q6H IV (or 50-100 mg/m2/d) indicated in catecholamine-resistant shock."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;
