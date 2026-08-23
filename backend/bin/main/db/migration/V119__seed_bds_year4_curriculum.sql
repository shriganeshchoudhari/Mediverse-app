-- =============================================================================
-- Migration: V119__seed_bds_year4_curriculum.sql
-- Description: Seeds Year 4 (Semesters 7-8)
-- =============================================================================

-- Subject: BDS-PR (Prosthodontics including Crown & Bridge)
INSERT INTO subjects (id, semester_id, code, title, category) VALUES ('20000000-0000-0000-0003-000000000008', '20000000-0000-0000-0002-000000000007', 'BDS-PR', 'Prosthodontics including Crown & Bridge', 'BASIC_SCIENCE') ON CONFLICT (id) DO NOTHING;

-- Chapter: Complete Dentures (Jaw Relations & Occlusal Vertical Dimension)
INSERT INTO units (id, subject_id, title, sort_order) VALUES ('20000000-0000-0000-0004-000000000027', '20000000-0000-0000-0003-000000000008', 'Complete Dentures (Jaw Relations & Occlusal Vertical Dimension) Unit', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO chapters (id, unit_id, title, sort_order) VALUES ('20000000-0000-0000-0005-000000000027', '20000000-0000-0000-0004-000000000027', 'Complete Dentures (Jaw Relations & Occlusal Vertical Dimension)', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO topics (id, chapter_id, title, sort_order) VALUES ('20000000-0000-0000-0006-000000000027', '20000000-0000-0000-0005-000000000027', 'Complete Dentures (Jaw Relations & Occlusal Vertical Dimension) Topic', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO concepts (id, topic_id, title, sort_order) VALUES ('20000000-0000-0000-0007-000000000027', '20000000-0000-0000-0006-000000000027', 'Complete Dentures (Jaw Relations & Occlusal Vertical Dimension) Concept', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO learning_objects (id, concept_id, object_type, content_payload, sort_order) VALUES ('20000000-0000-0000-0008-000000000027', '20000000-0000-0000-0007-000000000027', 'TEXT', 'Complete Dentures (Jaw Relations & Occlusal Vertical Dimension) details', 1) ON CONFLICT (id) DO NOTHING;

-- Chapter: Dental Implants (Osseointegration, Planning & Surgical Protocol)
INSERT INTO units (id, subject_id, title, sort_order) VALUES ('20000000-0000-0000-0004-000000000028', '20000000-0000-0000-0003-000000000008', 'Dental Implants (Osseointegration, Planning & Surgical Protocol) Unit', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO chapters (id, unit_id, title, sort_order) VALUES ('20000000-0000-0000-0005-000000000028', '20000000-0000-0000-0004-000000000028', 'Dental Implants (Osseointegration, Planning & Surgical Protocol)', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO topics (id, chapter_id, title, sort_order) VALUES ('20000000-0000-0000-0006-000000000028', '20000000-0000-0000-0005-000000000028', 'Dental Implants (Osseointegration, Planning & Surgical Protocol) Topic', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO concepts (id, topic_id, title, sort_order) VALUES ('20000000-0000-0000-0007-000000000028', '20000000-0000-0000-0006-000000000028', 'Dental Implants (Osseointegration, Planning & Surgical Protocol) Concept', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO learning_objects (id, concept_id, object_type, content_payload, sort_order) VALUES ('20000000-0000-0000-0008-000000000028', '20000000-0000-0000-0007-000000000028', 'TEXT', 'Dental Implants (Osseointegration, Planning & Surgical Protocol) details', 1) ON CONFLICT (id) DO NOTHING;

-- Chapter: Fixed Prosthodontics (Crown Preparation & Marginal Design)
INSERT INTO units (id, subject_id, title, sort_order) VALUES ('20000000-0000-0000-0004-000000000029', '20000000-0000-0000-0003-000000000008', 'Fixed Prosthodontics (Crown Preparation & Marginal Design) Unit', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO chapters (id, unit_id, title, sort_order) VALUES ('20000000-0000-0000-0005-000000000029', '20000000-0000-0000-0004-000000000029', 'Fixed Prosthodontics (Crown Preparation & Marginal Design)', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO topics (id, chapter_id, title, sort_order) VALUES ('20000000-0000-0000-0006-000000000029', '20000000-0000-0000-0005-000000000029', 'Fixed Prosthodontics (Crown Preparation & Marginal Design) Topic', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO concepts (id, topic_id, title, sort_order) VALUES ('20000000-0000-0000-0007-000000000029', '20000000-0000-0000-0006-000000000029', 'Fixed Prosthodontics (Crown Preparation & Marginal Design) Concept', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO learning_objects (id, concept_id, object_type, content_payload, sort_order) VALUES ('20000000-0000-0000-0008-000000000029', '20000000-0000-0000-0007-000000000029', 'TEXT', 'Fixed Prosthodontics (Crown Preparation & Marginal Design) details', 1) ON CONFLICT (id) DO NOTHING;


-- Subject: BDS-OR (Orthodontics & Dentofacial Orthopaedics)
INSERT INTO subjects (id, semester_id, code, title, category) VALUES ('20000000-0000-0000-0003-000000000009', '20000000-0000-0000-0002-000000000008', 'BDS-OR', 'Orthodontics & Dentofacial Orthopaedics', 'BASIC_SCIENCE') ON CONFLICT (id) DO NOTHING;

-- Chapter: Angle Classification & Skeletal Malocclusion Assessment
INSERT INTO units (id, subject_id, title, sort_order) VALUES ('20000000-0000-0000-0004-000000000030', '20000000-0000-0000-0003-000000000009', 'Angle Classification & Skeletal Malocclusion Assessment Unit', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO chapters (id, unit_id, title, sort_order) VALUES ('20000000-0000-0000-0005-000000000030', '20000000-0000-0000-0004-000000000030', 'Angle Classification & Skeletal Malocclusion Assessment', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO topics (id, chapter_id, title, sort_order) VALUES ('20000000-0000-0000-0006-000000000030', '20000000-0000-0000-0005-000000000030', 'Angle Classification & Skeletal Malocclusion Assessment Topic', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO concepts (id, topic_id, title, sort_order) VALUES ('20000000-0000-0000-0007-000000000030', '20000000-0000-0000-0006-000000000030', 'Angle Classification & Skeletal Malocclusion Assessment Concept', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO learning_objects (id, concept_id, object_type, content_payload, sort_order) VALUES ('20000000-0000-0000-0008-000000000030', '20000000-0000-0000-0007-000000000030', 'TEXT', 'Angle Classification & Skeletal Malocclusion Assessment details', 1) ON CONFLICT (id) DO NOTHING;

-- Chapter: Cephalometric Analysis (Landmarks, Planes & ANB Interpretation)
INSERT INTO units (id, subject_id, title, sort_order) VALUES ('20000000-0000-0000-0004-000000000031', '20000000-0000-0000-0003-000000000009', 'Cephalometric Analysis (Landmarks, Planes & ANB Interpretation) Unit', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO chapters (id, unit_id, title, sort_order) VALUES ('20000000-0000-0000-0005-000000000031', '20000000-0000-0000-0004-000000000031', 'Cephalometric Analysis (Landmarks, Planes & ANB Interpretation)', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO topics (id, chapter_id, title, sort_order) VALUES ('20000000-0000-0000-0006-000000000031', '20000000-0000-0000-0005-000000000031', 'Cephalometric Analysis (Landmarks, Planes & ANB Interpretation) Topic', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO concepts (id, topic_id, title, sort_order) VALUES ('20000000-0000-0000-0007-000000000031', '20000000-0000-0000-0006-000000000031', 'Cephalometric Analysis (Landmarks, Planes & ANB Interpretation) Concept', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO learning_objects (id, concept_id, object_type, content_payload, sort_order) VALUES ('20000000-0000-0000-0008-000000000031', '20000000-0000-0000-0007-000000000031', 'TEXT', 'Cephalometric Analysis (Landmarks, Planes & ANB Interpretation) details', 1) ON CONFLICT (id) DO NOTHING;

-- Chapter: Fixed Appliance Mechanics (Bracket Systems & Arch Wire Sequences)
INSERT INTO units (id, subject_id, title, sort_order) VALUES ('20000000-0000-0000-0004-000000000032', '20000000-0000-0000-0003-000000000009', 'Fixed Appliance Mechanics (Bracket Systems & Arch Wire Sequences) Unit', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO chapters (id, unit_id, title, sort_order) VALUES ('20000000-0000-0000-0005-000000000032', '20000000-0000-0000-0004-000000000032', 'Fixed Appliance Mechanics (Bracket Systems & Arch Wire Sequences)', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO topics (id, chapter_id, title, sort_order) VALUES ('20000000-0000-0000-0006-000000000032', '20000000-0000-0000-0005-000000000032', 'Fixed Appliance Mechanics (Bracket Systems & Arch Wire Sequences) Topic', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO concepts (id, topic_id, title, sort_order) VALUES ('20000000-0000-0000-0007-000000000032', '20000000-0000-0000-0006-000000000032', 'Fixed Appliance Mechanics (Bracket Systems & Arch Wire Sequences) Concept', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO learning_objects (id, concept_id, object_type, content_payload, sort_order) VALUES ('20000000-0000-0000-0008-000000000032', '20000000-0000-0000-0007-000000000032', 'TEXT', 'Fixed Appliance Mechanics (Bracket Systems & Arch Wire Sequences) details', 1) ON CONFLICT (id) DO NOTHING;

