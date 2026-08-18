-- V34: Seed Forensic Medicine & Toxicology (FOR-201) Full Curriculum

-- Ensure Subject: FOR-201 exists with correct title and category
INSERT INTO subjects (id, semester_id, code, title, category)
VALUES ('f6d7e8f9-a0b1-2c3d-4e5f-6a7b8c9d0e1f', 'c5d6e7f8-a9b0-1c2d-3e4f-5a6b7c8d9e0f', 'FOR-201', 'Forensic Medicine & Toxicology', 'PARA_CLINICAL')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, category = EXCLUDED.category;

-- Unit 1: Thanatology & Post-Mortem Changes
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('f6010001-0000-0000-0000-000000000001', 'f6d7e8f9-a0b1-2c3d-4e5f-6a7b8c9d0e1f', 'Thanatology & Post-Mortem Changes', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('f6010002-0000-0000-0000-000000000001', 'f6010001-0000-0000-0000-000000000001', 'Early & Late Post-Mortem Staging', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('f6010003-0000-0000-0000-000000000001', 'f6010002-0000-0000-0000-000000000001', 'Algor, Rigor & Livor Mortis', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('f6010004-0000-0000-0000-000000000001', 'f6010003-0000-0000-0000-000000000001', 'Nysten Law, Lividity Colors & Marbling', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('f6010005-0000-0000-0000-000000000001', 'f6010004-0000-0000-0000-000000000001', 'Thanatology, Post-Mortem Interval and Decomposition Staging', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('f6010006-0000-0000-0000-000000000001', 'f6010005-0000-0000-0000-000000000001', 'EXPLANATION', 1, 
'{"text": "### Thanatology & Post-Mortem Changes\n\nRigor mortis spreads from small to large muscles via Nystens law (jaw 1-2h to lower limbs 8-12h). Livor mortis becomes fixed at 6-8 hours. Cherry-red lividity indicates carbon monoxide, while bright pink indicates cyanide or hypothermia. Marbling appears at 36-48 hours via Clostridium perfringens sulfhemoglobin."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 2: Traumatology & Mechanical Injuries
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('f6010001-0000-0000-0000-000000000002', 'f6d7e8f9-a0b1-2c3d-4e5f-6a7b8c9d0e1f', 'Traumatology, Mechanical Wounds & Firearms', 2)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('f6010002-0000-0000-0000-000000000002', 'f6010001-0000-0000-0000-000000000002', 'Wound Morphology & Forensic Ballistics', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('f6010003-0000-0000-0000-000000000002', 'f6010002-0000-0000-0000-000000000002', 'Lacerations vs Incised Wounds', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('f6010004-0000-0000-0000-000000000002', 'f6010003-0000-0000-0000-000000000002', 'Gunshot Tattooing & Hanging vs Strangulation', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('f6010005-0000-0000-0000-000000000002', 'f6010004-0000-0000-0000-000000000002', 'Traumatology, Firearm Ballistics and Mechanical Asphyxia', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('f6010006-0000-0000-0000-000000000002', 'f6010005-0000-0000-0000-000000000002', 'EXPLANATION', 1, 
'{"text": "### Traumatology & Ballistics\n\nLacerations feature intact tissue bridges traversing the wound bed, distinguishing them from incised wounds. Gunpowder tattooing consists of unburnt powder grains embedded in dermis that cannot be washed away. Hanging presents with an oblique, non-continuous mark above the thyroid cartilage."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 3: Forensic Toxicology
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('f6010001-0000-0000-0000-000000000003', 'f6d7e8f9-a0b1-2c3d-4e5f-6a7b8c9d0e1f', 'Forensic Toxicology & Poisons', 3)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('f6010002-0000-0000-0000-000000000003', 'f6010001-0000-0000-0000-000000000003', 'Heavy Metals, Cyanide & Agricultural Poisons', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('f6010003-0000-0000-0000-000000000003', 'f6010002-0000-0000-0000-000000000003', 'Cyanide, CO, Arsenic & Celphos', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('f6010004-0000-0000-0000-000000000003', 'f6010003-0000-0000-0000-000000000003', 'Aldrich-Mees Lines, Burtonian Line & Antidotes', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('f6010005-0000-0000-0000-000000000003', 'f6010004-0000-0000-0000-000000000003', 'Forensic Toxicology, Asphyxiant Gases and Heavy Metal Poisoning', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('f6010006-0000-0000-0000-000000000003', 'f6010005-0000-0000-0000-000000000003', 'EXPLANATION', 1, 
'{"text": "### Forensic Toxicology\n\nCyanide inhibits cytochrome c oxidase causing histotoxic anoxia and bitter almond breath (treat with Hydroxocobalamin). Carbon monoxide causes cherry-red lividity and globus pallidus necrosis. Arsenic causes Aldrich-Mees nail lines and raindrop pigmentation."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 4: Medical Jurisprudence & Autopsy
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('f6010001-0000-0000-0000-000000000004', 'f6d7e8f9-a0b1-2c3d-4e5f-6a7b8c9d0e1f', 'Medical Jurisprudence & Autopsy Protocols', 4)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('f6010002-0000-0000-0000-000000000004', 'f6010001-0000-0000-0000-000000000004', 'Legal Inquests, Medical Negligence & Dissection', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('f6010003-0000-0000-0000-000000000004', 'f6010002-0000-0000-0000-000000000004', 'Section 174 vs 176 CrPC and Bolam Test', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('f6010004-0000-0000-0000-000000000004', 'f6010003-0000-0000-0000-000000000004', 'Virchow Technique & Saturated NaCl Preservation', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('f6010005-0000-0000-0000-000000000004', 'f6010004-0000-0000-0000-000000000004', 'Medical Jurisprudence, Inquest Laws and Autopsy Pathology', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('f6010006-0000-0000-0000-000000000004', 'f6010005-0000-0000-0000-000000000004', 'EXPLANATION', 1, 
'{"text": "### Medical Jurisprudence & Autopsy\n\nMagistrate Inquests (Section 176 CrPC) are mandatory in custodial deaths, police firing, and dowry deaths of women within 7 years of marriage. Saturated sodium chloride is the standard preservative for toxicology viscera; Formalin is strictly prohibited."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;
