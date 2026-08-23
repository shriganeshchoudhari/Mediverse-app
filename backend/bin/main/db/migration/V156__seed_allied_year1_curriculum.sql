-- V156__seed_allied_year1_curriculum.sql

INSERT INTO subjects (id, semester_id, title, code, category) VALUES
('70000000-0000-0000-0003-000000000001', '20000000-0000-0000-0002-000000000061', 'Applied Anatomy & Physiology for Paramedical Sciences', 'AHS-ANAT', 'PRE_CLINICAL'),
('70000000-0000-0000-0003-000000000002', '20000000-0000-0000-0002-000000000061', 'Clinical Biochemistry & Hematology', 'AHS-BIOCHEM', 'PRE_CLINICAL'),
('70000000-0000-0000-0003-000000000003', '20000000-0000-0000-0002-000000000062', 'Medical Microbiology & Infection Control in High-Tech Units', 'AHS-MICRO', 'PRE_CLINICAL')
ON CONFLICT (id) DO NOTHING;

-- AHS-ANAT (4 lessons)
INSERT INTO units (id, subject_id, title, sort_order) VALUES ('70000000-0000-0000-0004-000000000001', '70000000-0000-0000-0003-000000000001', 'Cardiovascular Anatomy', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO chapters (id, unit_id, title, sort_order) VALUES ('70000000-0000-0000-0005-000000000001', '70000000-0000-0000-0004-000000000001', 'Heart & Vessels', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO topics (id, chapter_id, title, sort_order) VALUES ('70000000-0000-0000-0006-000000000001', '70000000-0000-0000-0005-000000000001', 'Cardiac Chambers', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO concepts (id, topic_id, title, sort_order) VALUES ('70000000-0000-0000-0007-000000000001', '70000000-0000-0000-0006-000000000001', 'Valves & Hemodynamics', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO learning_objects (id, concept_id, object_type, content_payload, sort_order) VALUES ('70000000-0000-0000-0008-000000000001', '70000000-0000-0000-0007-000000000001', 'VIDEO', '{"url": "anat1"}', 1) ON CONFLICT (id) DO NOTHING;

-- Multiply to 4 lessons (simplified for V156 generation)
INSERT INTO units (id, subject_id, title, sort_order) VALUES ('70000000-0000-0000-0004-000000000002', '70000000-0000-0000-0003-000000000001', 'Renal Anatomy', 2) ON CONFLICT (id) DO NOTHING;
INSERT INTO chapters (id, unit_id, title, sort_order) VALUES ('70000000-0000-0000-0005-000000000002', '70000000-0000-0000-0004-000000000002', 'Kidneys', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO topics (id, chapter_id, title, sort_order) VALUES ('70000000-0000-0000-0006-000000000002', '70000000-0000-0000-0005-000000000002', 'Nephrons', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO concepts (id, topic_id, title, sort_order) VALUES ('70000000-0000-0000-0007-000000000002', '70000000-0000-0000-0006-000000000002', 'Glomerular Filtration', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO learning_objects (id, concept_id, object_type, content_payload, sort_order) VALUES ('70000000-0000-0000-0008-000000000002', '70000000-0000-0000-0007-000000000002', 'TEXT', '{"content": "GFR mechanics"}', 1) ON CONFLICT (id) DO NOTHING;

INSERT INTO units (id, subject_id, title, sort_order) VALUES ('70000000-0000-0000-0004-000000000003', '70000000-0000-0000-0003-000000000001', 'Respiratory Anatomy', 3) ON CONFLICT (id) DO NOTHING;
INSERT INTO chapters (id, unit_id, title, sort_order) VALUES ('70000000-0000-0000-0005-000000000003', '70000000-0000-0000-0004-000000000003', 'Lungs', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO topics (id, chapter_id, title, sort_order) VALUES ('70000000-0000-0000-0006-000000000003', '70000000-0000-0000-0005-000000000003', 'Alveoli', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO concepts (id, topic_id, title, sort_order) VALUES ('70000000-0000-0000-0007-000000000003', '70000000-0000-0000-0006-000000000003', 'Gas Exchange', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO learning_objects (id, concept_id, object_type, content_payload, sort_order) VALUES ('70000000-0000-0000-0008-000000000003', '70000000-0000-0000-0007-000000000003', 'QUIZ', '{"q": "Identify gas exchange"}', 1) ON CONFLICT (id) DO NOTHING;

INSERT INTO units (id, subject_id, title, sort_order) VALUES ('70000000-0000-0000-0004-000000000004', '70000000-0000-0000-0003-000000000001', 'Neuroanatomy', 4) ON CONFLICT (id) DO NOTHING;
INSERT INTO chapters (id, unit_id, title, sort_order) VALUES ('70000000-0000-0000-0005-000000000004', '70000000-0000-0000-0004-000000000004', 'CNS', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO topics (id, chapter_id, title, sort_order) VALUES ('70000000-0000-0000-0006-000000000004', '70000000-0000-0000-0005-000000000004', 'Brainstem', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO concepts (id, topic_id, title, sort_order) VALUES ('70000000-0000-0000-0007-000000000004', '70000000-0000-0000-0006-000000000004', 'Autonomic Control', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO learning_objects (id, concept_id, object_type, content_payload, sort_order) VALUES ('70000000-0000-0000-0008-000000000004', '70000000-0000-0000-0007-000000000004', 'TEXT', '{"content": "ANS details"}', 1) ON CONFLICT (id) DO NOTHING;


-- AHS-BIOCHEM (4 lessons)
INSERT INTO units (id, subject_id, title, sort_order) VALUES ('70000000-0000-0000-0004-000000000005', '70000000-0000-0000-0003-000000000002', 'Clinical Chemistry', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO chapters (id, unit_id, title, sort_order) VALUES ('70000000-0000-0000-0005-000000000005', '70000000-0000-0000-0004-000000000005', 'Electrolytes', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO topics (id, chapter_id, title, sort_order) VALUES ('70000000-0000-0000-0006-000000000005', '70000000-0000-0000-0005-000000000005', 'Sodium & Potassium', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO concepts (id, topic_id, title, sort_order) VALUES ('70000000-0000-0000-0007-000000000005', '70000000-0000-0000-0006-000000000005', 'Imbalances', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO learning_objects (id, concept_id, object_type, content_payload, sort_order) VALUES ('70000000-0000-0000-0008-000000000005', '70000000-0000-0000-0007-000000000005', 'TEXT', '{"content": "Hyponatremia"}', 1) ON CONFLICT (id) DO NOTHING;

INSERT INTO units (id, subject_id, title, sort_order) VALUES ('70000000-0000-0000-0004-000000000006', '70000000-0000-0000-0003-000000000002', 'Blood Gas Analysis', 2) ON CONFLICT (id) DO NOTHING;
INSERT INTO chapters (id, unit_id, title, sort_order) VALUES ('70000000-0000-0000-0005-000000000006', '70000000-0000-0000-0004-000000000006', 'ABG Interpretation', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO topics (id, chapter_id, title, sort_order) VALUES ('70000000-0000-0000-0006-000000000006', '70000000-0000-0000-0005-000000000006', 'Acid-Base Balance', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO concepts (id, topic_id, title, sort_order) VALUES ('70000000-0000-0000-0007-000000000006', '70000000-0000-0000-0006-000000000006', 'Metabolic Acidosis', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO learning_objects (id, concept_id, object_type, content_payload, sort_order) VALUES ('70000000-0000-0000-0008-000000000006', '70000000-0000-0000-0007-000000000006', 'TEXT', '{"content": "ABG rules"}', 1) ON CONFLICT (id) DO NOTHING;

INSERT INTO units (id, subject_id, title, sort_order) VALUES ('70000000-0000-0000-0004-000000000007', '70000000-0000-0000-0003-000000000002', 'Hematology Basics', 3) ON CONFLICT (id) DO NOTHING;
INSERT INTO chapters (id, unit_id, title, sort_order) VALUES ('70000000-0000-0000-0005-000000000007', '70000000-0000-0000-0004-000000000007', 'Coagulation', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO topics (id, chapter_id, title, sort_order) VALUES ('70000000-0000-0000-0006-000000000007', '70000000-0000-0000-0005-000000000007', 'Pathways', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO concepts (id, topic_id, title, sort_order) VALUES ('70000000-0000-0000-0007-000000000007', '70000000-0000-0000-0006-000000000007', 'Intrinsic and Extrinsic', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO learning_objects (id, concept_id, object_type, content_payload, sort_order) VALUES ('70000000-0000-0000-0008-000000000007', '70000000-0000-0000-0007-000000000007', 'TEXT', '{"content": "Clotting factors"}', 1) ON CONFLICT (id) DO NOTHING;

INSERT INTO units (id, subject_id, title, sort_order) VALUES ('70000000-0000-0000-0004-000000000008', '70000000-0000-0000-0003-000000000002', 'Blood Banking', 4) ON CONFLICT (id) DO NOTHING;
INSERT INTO chapters (id, unit_id, title, sort_order) VALUES ('70000000-0000-0000-0005-000000000008', '70000000-0000-0000-0004-000000000008', 'Typing', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO topics (id, chapter_id, title, sort_order) VALUES ('70000000-0000-0000-0006-000000000008', '70000000-0000-0000-0005-000000000008', 'ABO System', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO concepts (id, topic_id, title, sort_order) VALUES ('70000000-0000-0000-0007-000000000008', '70000000-0000-0000-0006-000000000008', 'Crossmatching', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO learning_objects (id, concept_id, object_type, content_payload, sort_order) VALUES ('70000000-0000-0000-0008-000000000008', '70000000-0000-0000-0007-000000000008', 'TEXT', '{"content": "Transfusion basics"}', 1) ON CONFLICT (id) DO NOTHING;

-- AHS-MICRO (3 lessons)
INSERT INTO units (id, subject_id, title, sort_order) VALUES ('70000000-0000-0000-0004-000000000009', '70000000-0000-0000-0003-000000000003', 'Sterilization', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO chapters (id, unit_id, title, sort_order) VALUES ('70000000-0000-0000-0005-000000000009', '70000000-0000-0000-0004-000000000009', 'Autoclaving', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO topics (id, chapter_id, title, sort_order) VALUES ('70000000-0000-0000-0006-000000000009', '70000000-0000-0000-0005-000000000009', 'Pressure & Heat', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO concepts (id, topic_id, title, sort_order) VALUES ('70000000-0000-0000-0007-000000000009', '70000000-0000-0000-0006-000000000009', 'Biological Indicators', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO learning_objects (id, concept_id, object_type, content_payload, sort_order) VALUES ('70000000-0000-0000-0008-000000000009', '70000000-0000-0000-0007-000000000009', 'TEXT', '{"content": "Sterilization monitoring"}', 1) ON CONFLICT (id) DO NOTHING;

INSERT INTO units (id, subject_id, title, sort_order) VALUES ('70000000-0000-0000-0004-000000000010', '70000000-0000-0000-0003-000000000003', 'Hospital Acquired Infections', 2) ON CONFLICT (id) DO NOTHING;
INSERT INTO chapters (id, unit_id, title, sort_order) VALUES ('70000000-0000-0000-0005-000000000010', '70000000-0000-0000-0004-000000000010', 'Prevention', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO topics (id, chapter_id, title, sort_order) VALUES ('70000000-0000-0000-0006-000000000010', '70000000-0000-0000-0005-000000000010', 'Hand Hygiene', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO concepts (id, topic_id, title, sort_order) VALUES ('70000000-0000-0000-0007-000000000010', '70000000-0000-0000-0006-000000000010', 'WHO 5 Moments', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO learning_objects (id, concept_id, object_type, content_payload, sort_order) VALUES ('70000000-0000-0000-0008-000000000010', '70000000-0000-0000-0007-000000000010', 'TEXT', '{"content": "Hand hygiene protocol"}', 1) ON CONFLICT (id) DO NOTHING;

INSERT INTO units (id, subject_id, title, sort_order) VALUES ('70000000-0000-0000-0004-000000000011', '70000000-0000-0000-0003-000000000003', 'Bio-Medical Waste Management', 3) ON CONFLICT (id) DO NOTHING;
INSERT INTO chapters (id, unit_id, title, sort_order) VALUES ('70000000-0000-0000-0005-000000000011', '70000000-0000-0000-0004-000000000011', 'Segregation', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO topics (id, chapter_id, title, sort_order) VALUES ('70000000-0000-0000-0006-000000000011', '70000000-0000-0000-0005-000000000011', 'Color Coding', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO concepts (id, topic_id, title, sort_order) VALUES ('70000000-0000-0000-0007-000000000011', '70000000-0000-0000-0006-000000000011', 'Disposal Rules', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO learning_objects (id, concept_id, object_type, content_payload, sort_order) VALUES ('70000000-0000-0000-0008-000000000011', '70000000-0000-0000-0007-000000000011', 'TEXT', '{"content": "BMW guidelines"}', 1) ON CONFLICT (id) DO NOTHING;
