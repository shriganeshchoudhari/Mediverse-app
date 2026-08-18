-- V72: Seed Emergency Medicine & Resuscitation Science (EM-301) Full Curriculum

-- Ensure Subject: EM-301 exists with correct title and category
INSERT INTO subjects (id, semester_id, code, title, category)
VALUES ('f1d0a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a30', 'c7d8e9f0-b1c2-3d4e-5f6a-7b8c9d0e1f2a', 'EM-301', 'Emergency Medicine & Resuscitation Science', 'CLINICAL')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, category = EXCLUDED.category;

-- Unit 1: Advanced Cardiac Life Support ACLS & Post-Cardiac Arrest Care
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa340001-0000-0000-0000-000000000001', 'f1d0a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a30', 'Advanced Cardiac Life Support ACLS & Post-Cardiac Arrest Care', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa340002-0000-0000-0000-000000000001', 'fa340001-0000-0000-0000-000000000001', 'Shockable Arrest (VF / pVT Defibrillation & Amiodarone Protocols)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa340003-0000-0000-0000-000000000001', 'fa340002-0000-0000-0000-000000000001', 'Non-Shockable Arrest (Asystole / PEA Epinephrine & The 5 H''s and 5 T''s)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa340004-0000-0000-0000-000000000001', 'fa340003-0000-0000-0000-000000000001', 'Post-Cardiac Arrest Care (Targeted Temperature Management 32-36C & PCI)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa340005-0000-0000-0000-000000000001', 'fa340004-0000-0000-0000-000000000001', 'Biphasic Transthoracic Waveform Defibrillations, High-Fraction Chest Recoil Hemodynamics, Adrenergic Alpha Vasoconstrictions, and Hypothermic Neuroprotections', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa340006-0000-0000-0000-000000000001', 'fa340005-0000-0000-0000-000000000001', 'EXPLANATION', 1, 
'{"text": "### ACLS Cardiac Arrest & Resuscitation\n\nShockable Rhythms (VF / Pulseless VT): Immediate high-energy defibrillation (120-200J biphasic) -> 2 min CPR -> Epinephrine 1 mg IV every 3-5 min after Shock 2 -> Amiodarone 300 mg bolus after Shock 3 (150 mg 2nd dose). Non-Shockable (Asystole / PEA): NO DEFIBRILLATION! CPR -> Epinephrine 1 mg IV immediately -> Reversible causes (The 5 H''s: Hypovolemia, Hypoxia, Hydrogen ion, Hypo/Hyperkalemia, Hypothermia; The 5 T''s: Tension PTX, Tamponade, Toxins, Thrombosis PE, Thrombosis ACS). Post-ROSC Care: Targeted Temperature Management (32-36°C for 24h), MAP >= 65 mmHg, avoid hyperoxia, emergent PCI."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 2: Shock Classification, Hemodynamic Profiles & Sepsis Resuscitation
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa340001-0000-0000-0000-000000000002', 'f1d0a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a30', 'Shock Classification, Hemodynamic Profiles & Sepsis Resuscitation', 2)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa340002-0000-0000-0000-000000000002', 'fa340001-0000-0000-0000-000000000002', 'Comparative Shock Hemodynamics (Hypovolemic, Cardiogenic, Septic, Obstructive)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa340003-0000-0000-0000-000000000002', 'fa340002-0000-0000-0000-000000000002', 'Surviving Sepsis Campaign 1-Hour Bundle (30 mL/kg Crystalloids & Norepinephrine)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa340004-0000-0000-0000-000000000002', 'fa340003-0000-0000-0000-000000000002', 'Lactate Clearance Kinetics & Advanced Vasopressor Titrations', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa340005-0000-0000-0000-000000000002', 'fa340004-0000-0000-0000-000000000002', 'Microcirculatory Cytokine Vasoplegias, Pulmonary Capillary Wedge Pressure Differentials, Lactate Metabolic Kinetics, and Alpha-1 Adrenergic Perfusion Pressures', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa340006-0000-0000-0000-000000000002', 'fa340005-0000-0000-0000-000000000002', 'EXPLANATION', 1, 
'{"text": "### Shock Classification & Sepsis Resuscitation\n\nHypovolemic: Low CO, Low PCWP, Low CVP, High SVR. Cardiogenic: Low CO, High PCWP, High CVP, High SVR. Distributive Septic: High early CO, Low PCWP, Low SVR (vasoplegia) with warm extremities. Obstructive (PE/Tamponade/Tension): Low CO, High CVP, High SVR. Surviving Sepsis 1-Hour Bundle: Measure lactate -> Blood cultures -> Broad-spectrum antibiotics within 1h -> 30 mL/kg balanced crystalloids (Lactated Ringer''s) within 3h for hypotension or lactate >= 4 -> First-line Norepinephrine (target MAP >= 65 mmHg)."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 3: Emergency Toxicology & Clinical Toxidromes
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa340001-0000-0000-0000-000000000003', 'f1d0a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a30', 'Emergency Toxicology & Clinical Toxidromes', 3)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa340002-0000-0000-0000-000000000003', 'fa340001-0000-0000-0000-000000000003', 'Anticholinergic (Physostigmine) vs Cholinergic (SLUDGE Atropine + 2-PAM)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa340003-0000-0000-0000-000000000003', 'fa340002-0000-0000-0000-000000000003', 'Opioid (Naloxone) vs Sympathomimetic Stimulant Toxidromes', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa340004-0000-0000-0000-000000000003', 'fa340003-0000-0000-0000-000000000003', 'TCA Overdose (Wide QRS & NaHCO3) & Acetaminophen Rumack-Matthew Nomogram', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa340005-0000-0000-0000-000000000003', 'fa340004-0000-0000-0000-000000000003', 'Muscarinic Acetylcholine Reversal Dynamics, Oxime Enzyme Reactivations, Fast Phase-0 Sodium Blockades, and Centrilobular Hepatic Glutathione Sparing', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa340006-0000-0000-0000-000000000003', 'fa340005-0000-0000-0000-000000000003', 'EXPLANATION', 1, 
'{"text": "### Emergency Toxicology & Toxidromes\n\nAnticholinergic: Mydriasis, hyperthermia, dry flushed skin, delirium -> Physostigmine. Cholinergic (Organophosphates): Pinpoint miosis, profuse SLUDGE secretions -> Atropine (muscarinic) + Pralidoxime 2-PAM (nicotinic). Opioid: Pinpoint miosis, bradypnea (RR <8), coma -> Naloxone. Sympathomimetic (Cocaine): Mydriasis, tachycardia, hypertension, PROFUSE SWEATING -> Benzodiazepines. TCA Overdose: Wide QRS (>100ms), terminal R in aVR -> IV Sodium Bicarbonate (target pH 7.50-7.55). Acetaminophen (APQI): Rumack-Matthew nomogram -> N-Acetylcysteine (NAC)."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 4: Acute Trauma Resuscitation, eFAST & Airway Emergencies
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa340001-0000-0000-0000-000000000004', 'f1d0a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a30', 'Acute Trauma Resuscitation, eFAST & Airway Emergencies', 4)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa340002-0000-0000-0000-000000000004', 'fa340001-0000-0000-0000-000000000004', 'ATLS Primary Survey & Tension Pneumothorax Needle Decompression', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa340003-0000-0000-0000-000000000004', 'fa340002-0000-0000-0000-000000000004', 'Cardiac Tamponade (Beck Triad & Pericardiocentesis) & Massive Hemothorax', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa340004-0000-0000-0000-000000000004', 'fa340003-0000-0000-0000-000000000004', 'eFAST Sonography Protocol & Massive Transfusion (1:1:1 Ratio with TXA)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa340005-0000-0000-0000-000000000004', 'fa340004-0000-0000-0000-000000000004', 'Tension Pleural Valvular Dynamics, Acoustic Peritoneal Refraction Waves, Dilutional Coagulopathy Prevention, and Antifibrinolytic Lysine Mimetics', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa340006-0000-0000-0000-000000000004', 'fa340005-0000-0000-0000-000000000004', 'EXPLANATION', 1, 
'{"text": "### Trauma Resuscitation & eFAST\n\nTension Pneumothorax: Hyperresonance, absent breath sounds, contralateral tracheal shift, hypotension -> Immediate Needle Thoracostomy (5th ICS anterior axillary line or 2nd ICS MCL) -> Chest tube. Cardiac Tamponade: Beck''s Triad (Hypotension, JVD, Muffled heart sounds) + Pulsus Paradoxus -> Emergency Pericardiocentesis. eFAST Sonography: 6 views (RUQ Morison, LUQ Splenorenal, Pelvis, Subxiphoid, Bilateral Pleural barcode sign for pneumothorax). Damage Control Transfusion: Balanced 1:1:1 ratio (1 PRBC : 1 FFP : 1 Platelets) to avoid Lethal Triad (Hypothermia, Coagulopathy, Acidosis) + Tranexamic Acid (TXA within 3 hours)."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;
