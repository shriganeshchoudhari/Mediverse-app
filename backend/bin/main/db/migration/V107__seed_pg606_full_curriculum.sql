-- V107: Seed Postgraduate Advanced Anesthesiology, Perioperative Medicine & Pain Critical Care (PG-606) Full Curriculum

-- Ensure Subject: PG-606 exists with correct title and category
INSERT INTO subjects (id, semester_id, code, title, category)
VALUES ('f9f9a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a32', 'd0e1f2a3-c4d5-6e7f-8a9b-0c1d2e3f4a5b', 'PG-606', 'Postgraduate Advanced Anesthesiology, Perioperative Medicine & Pain Critical Care', 'CLINICAL')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, category = EXCLUDED.category;

-- Unit 1: Malignant Hyperthermia (MH) & Dantrolene Resuscitation Protocols
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa710001-0000-0000-0000-000000000001', 'f9f9a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a32', 'Malignant Hyperthermia (MH) & Dantrolene Resuscitation Protocols', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa710002-0000-0000-0000-000000000001', 'fa710001-0000-0000-0000-000000000001', 'RYR1 / CACNA1S Mutations & Calcium Flooding Pathophysiology', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa710003-0000-0000-0000-000000000001', 'fa710002-0000-0000-0000-000000000001', 'Clinical Recognition (Refractory EtCO2 Surge, Masseter Spasm & Acidosis)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa710004-0000-0000-0000-000000000001', 'fa710003-0000-0000-0000-000000000001', 'MHAUS Emergency Dantrolene (2.5 mg/kg Load) & Hyperkalemia Protocols', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa710005-0000-0000-0000-000000000001', 'fa710004-0000-0000-0000-000000000001', 'Sarcoplasmic Calcium Floods, Masseter Rigidity Spasms, Ryanodex Reconstitutions, and Calcium Blocker Contraindications', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa710006-0000-0000-0000-000000000001', 'fa710005-0000-0000-0000-000000000001', 'EXPLANATION', 1, 
'{"text": "### Malignant Hyperthermia & Dantrolene Protocol\n\nPathophysiology: Autosomal dominant RYR1 mutation triggers massive sarcoplasmic calcium release upon exposure to volatile anesthetics (Isoflurane, Sevoflurane, Desflurane) or Succinylcholine. Clinical Recognition: Earliest sign is a sudden, refractory surge in End-Tidal CO2 (EtCO2 >55-60 mmHg) despite doubling minute ventilation, followed by masseter spasm, mixed severe acidosis (pH <7.15), hyperkalemia (K+ >6.0 mEq/L), rhabdomyolysis, and fulminant hyperthermia (>42°C). MHAUS Resuscitation Protocol: (1) Turn off volatile vaporizers and discontinue succinylcholine; hyperventilate with 100% O2 at >=10 L/min; (2) Administer Dantrolene Sodium 2.5 mg/kg IV push immediately (repeat Q5-10m up to 10 mg/kg; Ryanodex 250mg in 5mL vs Dantrium 20mg in 60mL); (3) Active cooling with iced saline (stop at <38.0°C); (4) STRICTLY CONTRAINDICATE CALCIUM CHANNEL BLOCKERS (Verapamil/Diltiazem precipitate fatal hyperkalemic myocardial arrest); (5) Maintenance Dantrolene 1.0 mg/kg Q4-6H for 24-48 hours."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 2: Local Anesthetic Systemic Toxicity (LAST) & 20% Lipid Emulsion Rescue
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa710001-0000-0000-0000-000000000002', 'f9f9a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a32', 'Local Anesthetic Systemic Toxicity (LAST) & 20% Lipid Emulsion Rescue', 2)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa710002-0000-0000-0000-000000000002', 'fa710001-0000-0000-0000-000000000002', 'Myocardial NaV1.5 Blockade & Lipophilic Drug Risk Stratification', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa710003-0000-0000-0000-000000000002', 'fa710002-0000-0000-0000-000000000002', 'Biphasic LAST Cascade (CNS Excitatory Prodrome to Refractory VT/VF / Asystole)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa710004-0000-0000-0000-000000000002', 'fa710003-0000-0000-0000-000000000002', 'ASRA 2025/2026 20% Lipid Emulsion Rescue & ACLS Modifications', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa710005-0000-0000-0000-000000000002', 'fa710004-0000-0000-0000-000000000002', 'Bupivacaine Sodium Channel Blockades, Intralipid Scavenger Sinks, Low-Dose Epinephrine Modifications, and Vasopressin Contraindications', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa710006-0000-0000-0000-000000000002', 'fa710005-0000-0000-0000-000000000002', 'EXPLANATION', 1, 
'{"text": "### LAST & 20% Lipid Emulsion Protocol\n\nPathophysiology: Systemic absorption of lipophilic local anesthetics (Bupivacaine > Levobupivacaine > Ropivacaine > Lidocaine) causes high-affinity blockade of cardiac NaV1.5 channels and uncouples oxidative phosphorylation. Clinical Progression: Early CNS prodrome (metallic taste, tinnitus, perioral numbness, seizures) -> sudden cardiovascular collapse (PR/QRS widening, VT/VF, severe negative inotropy, asystole). ASRA 2025/2026 Lipid Protocol: (1) Airway and seizure control with 100% O2 and Benzodiazepines (avoid Propofol in hemodynamically unstable patients); (2) Administer 20% Lipid Emulsion (Intralipid): Initial bolus 1.5 mL/kg IV over 2-3 min (~100 mL for 70 kg) followed by 0.25 mL/kg/min infusion; repeat bolus up to 2 times and double infusion to 0.50 mL/kg/min for persistent arrest (max 12 mL/kg over 30 min); (3) ACLS Modifications: Use low-dose Epinephrine (<=1 mcg/kg); strictly avoid Vasopressin, Calcium Channel Blockers, and local anesthetics (Lidocaine)."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 3: Total Intravenous Anesthesia (TIVA), TCI PK/PD Models & Processed EEG
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa710001-0000-0000-0000-000000000003', 'f9f9a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a32', 'Total Intravenous Anesthesia (TIVA), TCI PK/PD Models & Processed EEG', 3)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa710002-0000-0000-0000-000000000003', 'fa710001-0000-0000-0000-000000000003', 'Three-Compartment Mammillary Models & Effect-Site Equilibration (ke0)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa710003-0000-0000-0000-000000000003', 'fa710002-0000-0000-0000-000000000003', 'Marsh vs Schnider Propofol & Minto Remifentanil TCI Algorithms', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa710004-0000-0000-0000-000000000003', 'fa710003-0000-0000-0000-000000000003', 'Context-Sensitive Half-Time (CSHT) & Bispectral Index (BIS 40-60 Target)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa710005-0000-0000-0000-000000000003', 'fa710004-0000-0000-0000-000000000003', 'Compartmental Mammillary Pharmacokinetics, Esterase Hydrolysis Invariances, Bispectral Index Titrations, and Burst Suppression Avoidances', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa710006-0000-0000-0000-000000000003', 'fa710005-0000-0000-0000-000000000003', 'EXPLANATION', 1, 
'{"text": "### TIVA, TCI PK/PD & Processed EEG\n\nPharmacokinetics: Three-compartment models (V1 central vascular, V2 muscle, V3 fat) linked to effect-site concentration (Ce) via ke0. Marsh model (propofol) is weight-based; Schnider model incorporates age, height, weight, and lean body mass (LBM). Minto model (remifentanil) adjusts for age and LBM. Context-Sensitive Half-Time (CSHT): Remifentanil has an invariant CSHT of 3-4 minutes regardless of infusion duration due to rapid hydrolysis by non-specific blood/tissue esterases. Propofol CSHT increases with infusion duration (~20-30 min at 4h). Processed EEG (BIS): Target range is BIS 40-60 (adequate surgical hypnosis; prevents awareness while avoiding burst suppression BSR >0 and postoperative cognitive dysfunction)."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 4: Enhanced Recovery After Surgery (ERAS) & Multimodal Opioid-Sparing Analgesia
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa710001-0000-0000-0000-000000000004', 'f9f9a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a32', 'Enhanced Recovery After Surgery (ERAS) & Multimodal Opioid-Sparing Analgesia', 4)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa710002-0000-0000-0000-000000000004', 'fa710001-0000-0000-0000-000000000004', 'ERAS Perioperative Pillars (Preop Carb Load, Normothermia & Early Ambulation)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa710003-0000-0000-0000-000000000004', 'fa710002-0000-0000-0000-000000000004', 'Goal-Directed Fluid Therapy (GDFT): Stroke Volume Variation (SVV <10-12%)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa710004-0000-0000-0000-000000000004', 'fa710003-0000-0000-0000-000000000004', 'Multimodal Analgesia (IV Lidocaine, Subanesthetic Ketamine & Regional ESP Blocks)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa710005-0000-0000-0000-000000000004', 'fa710004-0000-0000-0000-000000000004', 'Carbohydrate Catabolism Attenuations, Stroke Volume Variation Optimizations, Systemic Lidocaine Anti-Inflammations, and Opioid-Free Recoveries', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa710006-0000-0000-0000-000000000004', 'fa710005-0000-0000-0000-000000000004', 'EXPLANATION', 1, 
'{"text": "### ERAS, GDFT & Multimodal Opioid-Sparing Analgesia\n\nERAS Framework: Preoperative clear carbohydrate beverage 2 hours before surgery (reduces insulin resistance and muscle catabolism); active normothermia (>36.0°C) maintenance; early enteral feeding and mobilization within 12-24h. Goal-Directed Fluid Therapy (GDFT): Dynamic stroke volume variation (SVV <10-12%) or pulse pressure variation (PPV <13%) guides fluid administration to avoid crystalloid volume overload (<2-3 L total) that causes intestinal edema and anastomotic dehiscence. Multimodal Opioid-Sparing Bundle: (1) Systemic IV Lidocaine infusion (1.5 mg/kg bolus + 1.5-2.0 mg/kg/hr infusion) reduces visceral peritoneal pain, suppresses IL-6, and prevents postoperative ileus; (2) Subanesthetic Ketamine (0.25 mg/kg bolus + 0.1-0.2 mg/kg/hr) prevents NMDA wind-up and hyperalgesia; (3) Regional fascial plane blocks (Erector Spinae Plane ESP, TAP, Thoracic Epidural) reduce opioid requirements by >50-70%."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;
