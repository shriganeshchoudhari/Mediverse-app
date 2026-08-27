-- V104: Seed Postgraduate Advanced General Surgery & Trauma Critical Care (PG-603) Full Curriculum

-- Ensure Subject: PG-603 exists with correct title and category
INSERT INTO subjects (id, semester_id, code, title, category)
VALUES ('f9f9a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a29', 'd0e1f2a3-c4d5-6e7f-8a9b-0c1d2e3f4a5b', 'PG-603', 'Postgraduate Advanced General Surgery & Trauma Critical Care', 'CLINICAL')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, category = EXCLUDED.category;

-- Unit 1: Damage Control Surgery & The Lethal Triad
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa680001-0000-0000-0000-000000000001', 'f9f9a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a29', 'Damage Control Surgery & The Lethal Triad', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa680002-0000-0000-0000-000000000001', 'fa680001-0000-0000-0000-000000000001', 'Trauma Lethal Triad (Hypothermia <35°C, Acidosis pH <7.20, Coagulopathy)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa680003-0000-0000-0000-000000000001', 'fa680002-0000-0000-0000-000000000001', '3-Stage Damage Control Laparotomy Paradigm & Open Abdomen TAC', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa680004-0000-0000-0000-000000000001', 'fa680003-0000-0000-0000-000000000001', 'Abdominal Compartment Syndrome (ACS IAP >20 mmHg & Decompression)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa680005-0000-0000-0000-000000000001', 'fa680004-0000-0000-0000-000000000001', 'Physiological Vicious Cycles, Abbreviated Packing, Temporary Abdominal Containment, and Emergent Surgical Decompressions', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa680006-0000-0000-0000-000000000001', 'fa680005-0000-0000-0000-000000000001', 'EXPLANATION', 1, 
'{"text": "### Damage Control Surgery & Lethal Triad\n\nTrauma Lethal Triad: Hypothermia (<35°C), Metabolic Acidosis (pH <7.20, Base Deficit >6), Coagulopathy (TIC). Coagulation factor enzymatic activity drops 10% per 1°C temperature drop. 3-Stage DCL Paradigm: Stage 1 (Abbreviated laparotomy <60-90 min with 4-quadrant packing, vascular shunts, bowel stapling without anastomosis, and TAC / ABThera negative pressure); Stage 2 (ICU core rewarming and 1:1:1 balanced resuscitation); Stage 3 (Planned re-laparotomy in 48-72h). Abdominal Compartment Syndrome: Sustained bladder IAP >20 mmHg with new organ failure (oliguria, high airway peak pressures) requires emergency decompressive laparotomy."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 2: Complex Hepatic, Pancreaticoduodenal & Vascular Trauma
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa680001-0000-0000-0000-000000000002', 'f9f9a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a29', 'Complex Hepatic, Pancreaticoduodenal & Vascular Trauma', 2)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa680002-0000-0000-0000-000000000002', 'fa680001-0000-0000-0000-000000000002', 'Pringle Maneuver Inflow Occlusion & Hepatic Hemostasis (15-20m Limit)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa680003-0000-0000-0000-000000000002', 'fa680002-0000-0000-0000-000000000002', 'Pancreaticoduodenal Trauma (Grade III Distal Pancreatectomy vs Diverticulization)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa680004-0000-0000-0000-000000000002', 'fa680003-0000-0000-0000-000000000002', 'Temporary Intraluminal Vascular Shunts (<6h Warm Ischemia Window)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa680005-0000-0000-0000-000000000002', 'fa680004-0000-0000-0000-000000000002', 'Foramen of Winslow Inflow Clamps, Retrohepatic Outflow Tears, Pancreatic Ductal Debridements, and Intraluminal Arterial Shunts', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa680006-0000-0000-0000-000000000002', 'fa680005-0000-0000-0000-000000000002', 'EXPLANATION', 1, 
'{"text": "### Complex Visceral Trauma\n\nPringle Maneuver: Clamping hepatoduodenal ligament at Foramen of Winslow (Portal vein, Hepatic artery, Bile duct) for 15-20 min. If bleeding stops: inflow source; if bleeding continues: retrohepatic IVC or hepatic vein tear. Pancreatic Trauma: Grade III duct injury left of SMV requires distal pancreatectomy; Grade IV-V devitalizations require duodenal diverticulization or staged Whipple. Vascular Shunts: Temporary intraluminal shunts (Argyle, Javid) must be placed in transected extremity arteries within <6h warm ischemia window to prevent irreversible muscle necrosis and limb loss."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 3: Resuscitative Endovascular Balloon Occlusion of the Aorta (REBOA)
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa680001-0000-0000-0000-000000000003', 'f9f9a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a29', 'Resuscitative Endovascular Balloon Occlusion of the Aorta (REBOA)', 3)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa680002-0000-0000-0000-000000000003', 'fa680001-0000-0000-0000-000000000003', 'Aortic Anatomical Zone 1 (Thoracic T4-T12, <=30m Limit) vs Zone 3 (Infrarenal L2-L4)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa680003-0000-0000-0000-000000000003', 'fa680002-0000-0000-0000-000000000003', 'Aortic Zone 2 Paravisceral Contraindication (T12-L2, Absolute No-Inflation)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa680004-0000-0000-0000-000000000003', 'fa680003-0000-0000-0000-000000000003', 'Partial REBOA (pREBOA) & Reperfusion Injury Prevention Protocols', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa680005-0000-0000-0000-000000000003', 'fa680004-0000-0000-0000-000000000003', 'Subdiaphragmatic Endovascular Cross-Clamps, Paravisceral No-Inflation Zones, Pelvic Hemostasis, and Titrated Ischemia Weanings', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa680006-0000-0000-0000-000000000003', 'fa680005-0000-0000-0000-000000000003', 'EXPLANATION', 1, 
'{"text": "### REBOA Endovascular Resuscitation\n\nREBOA Anatomical Zones: Zone 1 (Left subclavian to celiac T4-T12): Subdiaphragmatic exsanguination; strict occlusion limit <=30 minutes. Zone 2 (Celiac to renal T12-L2): STRICTLY CONTRAINDICATED (causes fatal mesenteric and renal necrosis). Zone 3 (Infrarenal L2-L4): Pelvic fracture hemorrhage; safe occlusion up to 60 minutes. Partial REBOA (pREBOA): Controlled micro-deflation allowing low-pressure distal pulsatile flow, mitigating ischemic wash-out acidosis and hyperkalemic arrest."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 4: Viscoelastometry-Guided Massive Transfusion Protocols (TEG / ROTEM)
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa680001-0000-0000-0000-000000000004', 'f9f9a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a29', 'Viscoelastometry-Guided Massive Transfusion Protocols (TEG / ROTEM)', 4)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa680002-0000-0000-0000-000000000004', 'fa680001-0000-0000-0000-000000000004', 'TEG / ROTEM Parameters (R-Time -> FFP, Alpha-Angle -> Cryo, MA -> Platelets)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa680003-0000-0000-0000-000000000004', 'fa680002-0000-0000-0000-000000000004', 'Fibrinolysis (LY30 >3%) & The CRASH-2 Tranexamic Acid (TXA <3h) Protocol', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa680004-0000-0000-0000-000000000004', 'fa680003-0000-0000-0000-000000000004', 'Balanced 1:1:1 Resuscitation (PROPPR Trial) & Trauma Hemostatic Goals', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa680005-0000-0000-0000-000000000004', 'fa680004-0000-0000-0000-000000000004', 'Thromboelastographic Tracings, Targeted Hemostatic Fractions, Hyperfibrinolytic Shutdowns, and Balanced Damage Control Hemotherapies', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa680006-0000-0000-0000-000000000004', 'fa680005-0000-0000-0000-000000000004', 'EXPLANATION', 1, 
'{"text": "### Viscoelastometry & Massive Transfusion\n\nTEG/ROTEM Parameters: Prolonged R-time (>10 min) / CT (>240s) indicates clotting factor deficiency -> give FFP (10-15 mL/kg) or 4F-PCC. Decreased alpha-angle (<53°) / CFT indicates hypofibrinogenemia -> give Cryoprecipitate (10-20 units) or Fibrinogen Concentrate. Low MA (<50 mm) / MCF indicates platelet deficiency -> give 1 apheresis unit of Platelets. LY30 >3% indicates hyperfibrinolysis -> give Tranexamic Acid (TXA 1 g IV bolus + 1 g over 8h strictly within <3 hours of injury per CRASH-2). Balanced 1:1:1 Resuscitation: 1 PRBC : 1 FFP : 1 Platelets prevents dilutional coagulopathy."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;
