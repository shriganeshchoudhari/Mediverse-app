-- V58: Seed Clinical Toxicology & Poisoning Emergencies (TOX-301) Full Curriculum

-- Ensure Subject: TOX-301 exists with correct title and category
INSERT INTO subjects (id, semester_id, code, title, category)
VALUES ('f1e9a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a16', 'c7d8e9f0-b1c2-3d4e-5f6a-7b8c9d0e1f2a', 'TOX-301', 'Clinical Toxicology & Poisoning Emergencies', 'CLINICAL')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, category = EXCLUDED.category;

-- Unit 1: Clinical Toxidromes & Acute Poisoning Resuscitation
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa200001-0000-0000-0000-000000000001', 'f1e9a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a16', 'Clinical Toxidromes & Acute Poisoning Resuscitation', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa200002-0000-0000-0000-000000000001', 'fa200001-0000-0000-0000-000000000001', 'Cholinergic & Anticholinergic Autonomic Syndromes', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa200003-0000-0000-0000-000000000001', 'fa200002-0000-0000-0000-000000000001', 'Sympathomimetic vs Opioid & Sedative-Hypnotic Toxidromes', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa200004-0000-0000-0000-000000000001', 'fa200003-0000-0000-0000-000000000001', 'Poisoning Resuscitation ABCD & Decontamination Principles', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa200005-0000-0000-0000-000000000001', 'fa200004-0000-0000-0000-000000000001', 'Five Core Clinical Toxidromes, Atropinization Protocol, Naloxone Titration, and Emergency Poisoning Resuscitation', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa200006-0000-0000-0000-000000000001', 'fa200005-0000-0000-0000-000000000001', 'EXPLANATION', 1, 
'{"text": "### Clinical Toxidromes & Poisoning Resuscitation\n\nCholinergic (organophosphates): DUMBELS / SLUDGE-M -> Atropine 2-5 mg IV doubled q3-5m until pulmonary secretions dry + Pralidoxime 2-PAM. Anticholinergic (atropine, TCAs, diphenhydramine): Mad as a hatter, red as a beet, hot as a hare, dry as a bone, blind as a bat -> bone dry skin/axillae. Sympathomimetic (cocaine, amphetamines): Hyperthermia, hypertension, tachycardia, profuse diaphoresis -> IV Benzodiazepines (avoid pure beta-blockers). Opioid: Respiratory depression, miosis, coma -> Naloxone titrated to ventilation. Sedative-hypnotic: Flumazenil cautioned (risk of status epilepticus)."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 2: Signature Drug Overdoses & Targeted Antidote Protocols
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa200001-0000-0000-0000-000000000002', 'f1e9a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a16', 'Signature Drug Overdoses & Targeted Antidote Protocols', 2)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa200002-0000-0000-0000-000000000002', 'fa200001-0000-0000-0000-000000000002', 'Acetaminophen Overdose, NAPQI & Rumack-Matthew Nomogram', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa200003-0000-0000-0000-000000000002', 'fa200002-0000-0000-0000-000000000002', 'Salicylate Toxicity & Urine Alkalinization Protocol', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa200004-0000-0000-0000-000000000002', 'fa200003-0000-0000-0000-000000000002', 'TCA Cardiotoxicity (NaHCO3) & Digoxin Toxicity (Fab Dosing)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa200005-0000-0000-0000-000000000002', 'fa200004-0000-0000-0000-000000000002', 'Acetaminophen N-Acetylcysteine Protocols, Salicylate Urine Trapping, TCA Sodium Channel Blockade, and Digoxin Antibody Fab Therapy', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa200006-0000-0000-0000-000000000002', 'fa200005-0000-0000-0000-000000000002', 'EXPLANATION', 1, 
'{"text": "### Signature Drug Overdoses & Antidotes\n\nAcetaminophen (APAP): CYP2E1 NAPQI depletes glutathione -> centrilobular hepatic necrosis. Rumack-Matthew nomogram: 150 ug/mL at 4h treatment line -> IV N-acetylcysteine (NAC) restores glutathione. Salicylate: Uncoupling of oxidative phosphorylation -> mixed resp alkalosis and high anion gap met acidosis -> IV NaHCO3 urine alkalinization (pH 7.5-8.0) traps salicylate ion. TCA toxicity: Fast inward Na+ channel blockade -> wide QRS >100 ms (seizures) / >160 ms (VT/VF) + terminal R in aVR >=3 mm -> hypertonic NaHCO3 (1-2 mEq/kg). Digoxin: Na+/K+-ATPase block, hyperkalemia, bidirectional VT -> Digoxin-specific Fab fragments (Digibind)."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 3: Heavy Metal Toxicity, Chelation & Corrosive Ingestions
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa200001-0000-0000-0000-000000000003', 'f1e9a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a16', 'Heavy Metal Toxicity, Chelation & Corrosive Ingestions', 3)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa200002-0000-0000-0000-000000000003', 'fa200001-0000-0000-0000-000000000003', 'Lead Poisoning, Basophilic Stippling & Chelation (DMSA/EDTA)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa200003-0000-0000-0000-000000000003', 'fa200002-0000-0000-0000-000000000003', 'Arsenic & Mercury (Minamata) Poisoning (BAL / DMSA)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa200004-0000-0000-0000-000000000003', 'fa200003-0000-0000-0000-000000000003', 'Iron Overdose (Deferoxamine Vin Rose) & Corrosive Acids/Alkalis', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa200005-0000-0000-0000-000000000003', 'fa200004-0000-0000-0000-000000000003', 'Heavy Metal Enzyme Inactivation, Lead Burton Lines, Deferoxamine Iron Chelation, and Corrosive Ingestion Endoscopy Protocols', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa200006-0000-0000-0000-000000000003', 'fa200005-0000-0000-0000-000000000003', 'EXPLANATION', 1, 
'{"text": "### Heavy Metals & Corrosives\n\nLead: Inhibits delta-ALAD and ferrochelatase -> basophilic stippling, Burton lines, wrist drop, encephalopathy -> oral DMSA Succimer (lead 45-69 ug/dL) or IM BAL followed by IV CaNa2-EDTA (lead >=70 ug/dL; BAL first to protect CNS). Arsenic/Mercury: Bind sulfhydryl groups -> garlic breath, Mees lines, Minamata disease -> BAL or DMSA. Iron: Hemorrhagic gastritis, radio-opaque pills on X-ray, shock -> IV Deferoxamine forms ferrioxamine (vin rose urine). Corrosives: Alkali (liquefactive necrosis, deep) vs Acid (coagulation necrosis) -> strictly NPO, no emesis, no neutralizing, emergent endoscopy in 12-24h."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 4: Toxic Alcohols, Envenomations & Enhanced Toxin Elimination
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa200001-0000-0000-0000-000000000004', 'f1e9a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a16', 'Toxic Alcohols, Envenomations & Enhanced Toxin Elimination', 4)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa200002-0000-0000-0000-000000000004', 'fa200001-0000-0000-0000-000000000004', 'Methanol & Ethylene Glycol Poisoning & Fomepizole', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa200003-0000-0000-0000-000000000004', 'fa200002-0000-0000-0000-000000000004', 'Snakebite (Neurotoxic vs Vasculotoxic ASV) & Scorpion Stings', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa200004-0000-0000-0000-000000000004', 'fa200003-0000-0000-0000-000000000004', 'Enhanced Elimination Modalities (MDAC & Hemodialysis I STUMBLE)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa200005-0000-0000-0000-000000000004', 'fa200004-0000-0000-0000-000000000004', 'Toxic Alcohol Osmolar Gap Calculations, Fomepizole Antidotes, Snakebite Polyvalent ASV, and Hemodialysis Indications', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa200006-0000-0000-0000-000000000004', 'fa200005-0000-0000-0000-000000000004', 'EXPLANATION', 1, 
'{"text": "### Toxic Alcohols & Enhanced Elimination\n\nMethanol: ADH -> Formic acid -> optic papillitis, snowstorm blindness, putaminal necrosis. Ethylene glycol: ADH -> Glycolic/Oxalic acid -> calcium oxalate crystals in urine, acute kidney injury. High osmolar gap (>10) and high anion gap metabolic acidosis -> Fomepizole (competitive ADH inhibitor) + emergent Hemodialysis. Envenomations: Cobra/Krait (neurotoxic ptosis -> ASV + Neostigmine); Viper (vasculotoxic VICC -> ASV, 20WBCT); Scorpion (autonomic storm -> Prazosin). Enhanced elimination: MDAC (Theophylline, Dapsone, Carbamazepine, Phenobarbital, Quinine); Hemodialysis (I STUMBLE: Isopropanol, Salicylates, Theophylline, Uremia, Methanol, Barbiturates, Lithium, Ethylene glycol)."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;
