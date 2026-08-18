-- V77: Seed Clinical Forensic Pathology & Legal Toxicology (FOR-301) Full Curriculum

-- Ensure Subject: FOR-301 exists with correct title and category
INSERT INTO subjects (id, semester_id, code, title, category)
VALUES ('f1d0a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a35', 'c7d8e9f0-b1c2-3d4e-5f6a-7b8c9d0e1f2a', 'FOR-301', 'Clinical Forensic Pathology & Legal Toxicology', 'CLINICAL')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, category = EXCLUDED.category;

-- Unit 1: Thanatology & Postmortem Interval Estimation
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa390001-0000-0000-0000-000000000001', 'f1d0a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a35', 'Thanatology & Postmortem Interval Estimation', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa390002-0000-0000-0000-000000000001', 'fa390001-0000-0000-0000-000000000001', 'Algor Mortis (Henssge Nomogram Core Temperature Cooling)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa390003-0000-0000-0000-000000000001', 'fa390002-0000-0000-0000-000000000001', 'Rigor Mortis ATP Depletion & Livor Mortis 8-12 Hour Fixation', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa390004-0000-0000-0000-000000000001', 'fa390003-0000-0000-0000-000000000001', 'Putrefactive Marbling, Adipocere, Mummification & Casper Dictum', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa390005-0000-0000-0000-000000000001', 'fa390004-0000-0000-0000-000000000001', 'Newtonian Metabolic Heat Dissipations, Actomyosin Uncoupling Arrests, Gravitational Capillary Hypostases, and Clostridial Sulfhemoglobin Marblings', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa390006-0000-0000-0000-000000000001', 'fa390005-0000-0000-0000-000000000001', 'EXPLANATION', 1, 
'{"text": "### Thanatology & PMI Estimation\n\nAlgor Mortis: Cooling rate ~1.5°F (0.8°C) per hour in temperate ambient temperature; Henssge nomogram calculates 95% confidence interval for PMI. Rigor Mortis: ATP depletion locks actin-myosin (jaw in 2-4h, fully fixed at 12h, passes off 36-48h by autolysis; Nysten law). Livor Mortis: Gravitational capillary pooling (onset 30-60min, fully fixed at 8-12h; cherry-red in CO/Cyanide, chocolate-brown in Met-Hb). Putrefaction: Greenish RIF discoloration (24-36h), superficial venous marbling (36-48h), Casper dictum (1 week air = 2 weeks water = 8 weeks soil)."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 2: Forensic Ballistics & Gunshot Wound Dynamics
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa390001-0000-0000-0000-000000000002', 'f1d0a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a35', 'Forensic Ballistics & Gunshot Wound Dynamics', 2)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa390002-0000-0000-0000-000000000002', 'fa390001-0000-0000-0000-000000000002', 'Hard Contact Stellate Cranial Wounds & Subgaleal Gas Expansion', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa390003-0000-0000-0000-000000000002', 'fa390002-0000-0000-0000-000000000002', 'Close Range Thermal Flame Burns & Washable Carbonaceous Soot', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa390004-0000-0000-0000-000000000002', 'fa390003-0000-0000-0000-000000000002', 'Intermediate Gunpowder Tattooing (Stippling) & Distant Abrasion Collar', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa390005-0000-0000-0000-000000000002', 'fa390004-0000-0000-0000-000000000002', 'Subperiosteal Propellant Gas Overpressures, Thermal Follicular Singeings, Intra-Dermal Propellant Flake Implantations, and Cranial Calvarial Internal Bevelings', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa390006-0000-0000-0000-000000000002', 'fa390005-0000-0000-0000-000000000002', 'EXPLANATION', 1, 
'{"text": "### Forensic Ballistics & GSWs\n\nContact Wounds: Muzzle against skin -> expanding gas tears scalp into stellate/cruciform shape over flat bone; muzzle stamp impression. Close Range: Flame burn singeing + washable soot/fouling smudging (<few inches). Intermediate Range: Gunpowder Tattooing / Stippling (unburnt powder grains embed into viable dermis, CANNOT wash off; 1-3 feet). Distant Range (>3 feet): Absence of soot/stippling; central defect with concentric abrasion collar (friction ring) and grease collar (bullet wipe). Entrance vs Exit: Entrance has inverted edges, abrasion collar, and internal bone beveling; Exit has everted edges and external bone beveling."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 3: Mechanical Asphyxia & Neck Compression Traumatology
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa390001-0000-0000-0000-000000000003', 'f1d0a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a35', 'Mechanical Asphyxia & Neck Compression Traumatology', 3)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa390002-0000-0000-0000-000000000003', 'fa390001-0000-0000-0000-000000000003', 'Ante-Mortem Suspension Hanging (Oblique Mark & Salivary Dribbling)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa390003-0000-0000-0000-000000000003', 'fa390002-0000-0000-0000-000000000003', 'Homicidal Ligature Strangulation (Horizontal Mark & Tardieu Petechiae)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa390004-0000-0000-0000-000000000003', 'fa390003-0000-0000-0000-000000000003', 'Manual Strangulation (Throttling Hyoid Fractures) & Aquatic Drowning Diatoms', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa390005-0000-0000-0000-000000000003', 'fa390004-0000-0000-0000-000000000003', 'Jugulocarotid Constrictive Hypoxias, Circumferential Cephalic Venous Congestions, Hyoid Cornu Inward Displacements, and Closed Marrow Diatom Silica Translocations', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa390006-0000-0000-0000-000000000003', 'fa390005-0000-0000-0000-000000000003', 'EXPLANATION', 1, 
'{"text": "### Mechanical Asphyxia\n\nHanging: Oblique, non-continuous mark above thyroid cartilage, suspension apex gap, salivary dribble opposite knot (ante-mortem proof); almost always suicide. Ligature Strangulation: Horizontal, continuous, transverse mark at/below thyroid cartilage, uniform depth, severe facial congestion, cyanosis, Tardieu petechiae; almost always homicide. Manual Strangulation (Throttling): Crescentic fingernail abrasions + fingertip contusions + 60-70% hyoid bone greater horn fractures (inward/outward displacement); always homicide. Drowning: Persistent fine white mushroom of foam at mouth/nostrils, Paltauf subpleural hemorrhages, diatom test in closed femur bone marrow."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 4: Medicolegal Autopsy Toxicology & Fatal Toxidromes
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa390001-0000-0000-0000-000000000004', 'f1d0a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a35', 'Medicolegal Autopsy Toxicology & Fatal Toxidromes', 4)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa390002-0000-0000-0000-000000000004', 'fa390001-0000-0000-0000-000000000004', 'Carbon Monoxide (COHb Cherry-Red Lividity & Globus Pallidus Necrosis)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa390003-0000-0000-0000-000000000004', 'fa390002-0000-0000-0000-000000000004', 'Cyanide (Cytochrome c Oxidase Blockade, Bitter Almond & Hydroxocobalamin)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa390004-0000-0000-0000-000000000004', 'fa390003-0000-0000-0000-000000000004', 'Heavy Metals (Arsenic Mees Lines, Lead Burton Lines) & Organophosphates', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa390005-0000-0000-0000-000000000004', 'fa390004-0000-0000-0000-000000000004', 'Carboxyhemoglobin Dissociation Dysfunctions, Histotoxic Complex IV Paralysees, Heavy Metal Thiol Inactivations, and Irreversible Acetylcholinesterase Aging Phosphorylations', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa390006-0000-0000-0000-000000000004', 'fa390005-0000-0000-0000-000000000004', 'EXPLANATION', 1, 
'{"text": "### Medicolegal Autopsy Toxicology\n\nCarbon Monoxide: >200x affinity for Hb -> carboxyhemoglobin (COHb) -> bright cherry-red lividity, bilateral globus pallidus hemorrhagic necrosis (100% O2). Cyanide: Inhibits Cytochrome c Oxidase (Complex IV) -> histotoxic hypoxia, high SvO2 >90%, bright pink lividity, bitter almond odor (Hydroxocobalamin). Heavy Metals: Arsenic (garlic breath, Aldrich-Mees nail bands, raindrop skin; BAL); Lead (Burton gingival line, basophilic stippling, wrist drop; CaNa2EDTA). Organophosphates: Irreversible AChE inhibition -> SLUDGE cholinergic crisis, pinpoint pupils (Atropine + 2-PAM)."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;
