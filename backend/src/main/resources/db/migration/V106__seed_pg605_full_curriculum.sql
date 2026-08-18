-- V106: Seed Postgraduate Advanced Obstetrics, Fetal Medicine & Maternal Critical Care (PG-605) Full Curriculum

-- Ensure Subject: PG-605 exists with correct title and category
INSERT INTO subjects (id, semester_id, code, title, category)
VALUES ('f9f9a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a31', 'd0e1f2a3-c4d5-6e7f-8a9b-0c1d2e3f4a5b', 'PG-605', 'Postgraduate Advanced Obstetrics, Fetal Medicine & Maternal Critical Care', 'CLINICAL')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, category = EXCLUDED.category;

-- Unit 1: Monochorionic Twin Gestations, TTTS & Fetoscopic Laser Surgery
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa700001-0000-0000-0000-000000000001', 'f9f9a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a31', 'Monochorionic Twin Gestations, TTTS & Fetoscopic Laser Surgery', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa700002-0000-0000-0000-000000000001', 'fa700001-0000-0000-0000-000000000001', 'Quintero Clinical Staging of TTTS (Stage I Oligo/Poly to Stage V Demise)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa700003-0000-0000-0000-000000000001', 'fa700002-0000-0000-0000-000000000001', 'Solomon Fetoscopic Selective Laser Photocoagulation (16-26 Weeks)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa700004-0000-0000-0000-000000000001', 'fa700003-0000-0000-0000-000000000001', 'Twin Anemia-Polycythemia Sequence (TAPS) & Vascular Angioarchitecture', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa700005-0000-0000-0000-000000000001', 'fa700004-0000-0000-0000-000000000001', 'Unbalanced Cotyledonary Shunts, Equatorial Photocoagulations, Functional Dichorionizations, and Fetal Neurological Preservations', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa700006-0000-0000-0000-000000000001', 'fa700005-0000-0000-0000-000000000001', 'EXPLANATION', 1, 
'{"text": "### Monochorionic Twins & TTTS Laser\n\nQuintero Staging: Stage I (donor DVP <2cm / recipient DVP >8cm; donor bladder visible); Stage II (donor bladder empty/not visualized >60 min); Stage III (critically abnormal Dopplers: UA AREDF / DV reversed a-wave); Stage IV (fetal hydrops in either twin); Stage V (demise). Fetoscopic Laser: Solomon technique photocoagulates all connecting AV, VA, AA, and VV anastomoses along the vascular equator at 16-26 weeks gestation, functionally dividing the placenta into two dichorionic units. TAPS: Donor MCA-PSV >1.5 MoM (anemia) with recipient <1.0 MoM (polycythemia) in the absence of oligohydramnios/polyhydramnios."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 2: Early-Onset Fetal Growth Restriction (FGR) & Doppler Surveillance
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa700001-0000-0000-0000-000000000002', 'f9f9a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a31', 'Early-Onset Fetal Growth Restriction (FGR) & Doppler Surveillance', 2)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa700002-0000-0000-0000-000000000002', 'fa700001-0000-0000-0000-000000000002', 'Umbilical Artery Absent & Reversed End-Diastolic Flow (AEDF / REDF)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa700003-0000-0000-0000-000000000002', 'fa700002-0000-0000-0000-000000000002', 'Middle Cerebral Artery Brain-Sparing & Cerebroplacental Ratio (CPR <1.08)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa700004-0000-0000-0000-000000000002', 'fa700003-0000-0000-0000-000000000002', 'Ductus Venosus a-Wave Reversal & The TRUFFLE Trial Delivery Trigger', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa700005-0000-0000-0000-000000000002', 'fa700004-0000-0000-0000-000000000002', 'Stem Villous Obliterations, Chemoreceptor Vasodilations, Right Ventricular Diastolic Failures, and Antenatal Corticosteroid Timings', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa700006-0000-0000-0000-000000000002', 'fa700005-0000-0000-0000-000000000002', 'EXPLANATION', 1, 
'{"text": "### Early-Onset FGR & Ductus Venosus\n\nDoppler Velocimetry: Umbilical Artery REDF indicates >70% placental vascular bed obliteration (deliver at 30-32 weeks). MCA vasodilation reflects brain-sparing autoregulation (CPR = MCA-PI / UA-PI <1.08). Ductus Venosus (DV): Absent or reversed a-wave during atrial contraction indicates severe right ventricular myocardial diastolic failure and metabolic acidemia. TRUFFLE Trial: Waiting for DV a-wave reversal or computerized CTG STV <3.5 ms before delivery at >=26-28 weeks maximizes intact 2-year neurological survival (administer Betamethasone 12 mg IM and MgSO4 neuroprotection prior to delivery)."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 3: Amniotic Fluid Embolism (AFE) & The A-OK Resuscitation Protocol
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa700001-0000-0000-0000-000000000003', 'f9f9a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a31', 'Amniotic Fluid Embolism (AFE) & The A-OK Resuscitation Protocol', 3)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa700002-0000-0000-0000-000000000003', 'fa700001-0000-0000-0000-000000000003', 'Biphasic AFE Pathophysiology (Phase 1 RV Failure vs Phase 2 Fulminant DIC)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa700003-0000-0000-0000-000000000003', 'fa700002-0000-0000-0000-000000000003', 'The A-OK Resuscitation Protocol (Atropine 1mg, Ondansetron 8mg, Ketorolac 30mg)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa700004-0000-0000-0000-000000000003', 'fa700003-0000-0000-0000-000000000003', 'Consumptive Coagulopathy Rescue (Cryoprecipitate Target Fibrinogen >200 mg/dL)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa700005-0000-0000-0000-000000000003', 'fa700004-0000-0000-0000-000000000003', 'Anaphylactoid Cascades, Acute Cor Pulmonale, Serotonin 5-HT3 Blockades, and Extracorporeal Resuscitations', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa700006-0000-0000-0000-000000000003', 'fa700005-0000-0000-0000-000000000003', 'EXPLANATION', 1, 
'{"text": "### Amniotic Fluid Embolism & A-OK Protocol\n\nBiphasic Pathophysiology: Phase 1 (sudden acute pulmonary vasoconstriction, acute RV failure, cardiogenic shock, and hypoxia); Phase 2 (LV failure, pulmonary edema, and fulminant DIC with massive uterine atony). The A-OK Resuscitation Protocol: Administer Atropine (0.8-1.0 mg IV vagolytic), Ondansetron (8 mg IV 5-HT3 antagonist), and Ketorolac (30 mg IV COX inhibitor) immediately upon suspected AFE to halt neurohumoral collapse and microthrombus formation. DIC Management: Execute 1:1:1 balanced MTP, maintain Fibrinogen >200 mg/dL using Cryoprecipitate, give IV TXA (1g), and mobilize VA-ECMO for refractory shock."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 4: Resuscitative Hysterotomy / Peri-Mortem Cesarean Delivery (PMCD)
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa700001-0000-0000-0000-000000000004', 'f9f9a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a31', 'Resuscitative Hysterotomy / Peri-Mortem Cesarean Delivery (PMCD)', 4)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa700002-0000-0000-0000-000000000004', 'fa700001-0000-0000-0000-000000000004', 'Aortocaval Compression Physiology (>=20 Weeks Gestation Reduces Venous Return 60%)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa700003-0000-0000-0000-000000000004', 'fa700002-0000-0000-0000-000000000004', 'The 4-Minute Incision Rule & 5-Minute Complete Delivery Standard', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa700004-0000-0000-0000-000000000004', 'fa700003-0000-0000-0000-000000000004', 'Manual Left Lateral Uterine Displacement (LUD) & Bedside Surgical Protocols', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa700005-0000-0000-0000-000000000004', 'fa700004-0000-0000-0000-000000000004', 'Inferior Vena Caval Obstructions, Bedside Laparotomies Without Prep, Venous Autotransfusions, and Maternal ROSC Restorations', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa700006-0000-0000-0000-000000000004', 'fa700005-0000-0000-0000-000000000004', 'EXPLANATION', 1, 
'{"text": "### Resuscitative Hysterotomy & PMCD\n\nPhysiological Basis: Gravid uterus >=20 weeks compresses the IVC and aorta, reducing venous return by up to 60% and rendering closed-chest CPR ineffective. Uterine evacuation increases maternal cardiac output by 30-40%, allowing ROSC. 4-Minute Rule & 5-Minute Delivery: If maternal cardiac arrest is refractory to CPR at 4 minutes, begin bedside Resuscitative Hysterotomy immediately, aiming for complete fetal extraction by 5 minutes. Execution: Perform directly at the site of arrest without moving to an OR, without sterile drapes, and without prep. Maintain continuous manual Left Lateral Uterine Displacement (LUD) during CPR."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;
