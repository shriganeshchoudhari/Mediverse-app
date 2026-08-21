-- =============================================================================
-- Migration: V119__seed_bds_year4_curriculum.sql
-- Description: Seeds Year 4 (Semesters 7-8)
-- =============================================================================

-- Subject: BDS-PR (Prosthodontics including Crown & Bridge)
INSERT INTO subjects (id, semester_id, code, name, description) VALUES ('20000000-0000-0000-0003-000000000008', '20000000-0000-0000-0002-000000000007', 'BDS-PR', 'Prosthodontics including Crown & Bridge', '') ON CONFLICT (code) DO NOTHING;

-- Chapter: Complete Dentures (Jaw Relations & Occlusal Vertical Dimension)
INSERT INTO units (id, subject_id, name) VALUES ('20000000-0000-0000-0004-000000000027', '20000000-0000-0000-0003-000000000008', 'Complete Dentures (Jaw Relations & Occlusal Vertical Dimension) Unit') ON CONFLICT DO NOTHING;
INSERT INTO chapters (id, unit_id, name) VALUES ('20000000-0000-0000-0005-000000000027', '20000000-0000-0000-0004-000000000027', 'Complete Dentures (Jaw Relations & Occlusal Vertical Dimension)') ON CONFLICT DO NOTHING;
INSERT INTO topics (id, chapter_id, name) VALUES ('20000000-0000-0000-0006-000000000027', '20000000-0000-0000-0005-000000000027', 'Complete Dentures (Jaw Relations & Occlusal Vertical Dimension) Topic') ON CONFLICT DO NOTHING;
INSERT INTO concepts (id, topic_id, name) VALUES ('20000000-0000-0000-0007-000000000027', '20000000-0000-0000-0006-000000000027', 'Complete Dentures (Jaw Relations & Occlusal Vertical Dimension) Concept') ON CONFLICT DO NOTHING;
INSERT INTO learning_objects (id, concept_id, object_type, content_payload) VALUES ('20000000-0000-0000-0008-000000000027', '20000000-0000-0000-0007-000000000027', 'TEXT', 'Complete Dentures (Jaw Relations & Occlusal Vertical Dimension) details') ON CONFLICT DO NOTHING;

-- Chapter: Dental Implants (Osseointegration, Planning & Surgical Protocol)
INSERT INTO units (id, subject_id, name) VALUES ('20000000-0000-0000-0004-000000000028', '20000000-0000-0000-0003-000000000008', 'Dental Implants (Osseointegration, Planning & Surgical Protocol) Unit') ON CONFLICT DO NOTHING;
INSERT INTO chapters (id, unit_id, name) VALUES ('20000000-0000-0000-0005-000000000028', '20000000-0000-0000-0004-000000000028', 'Dental Implants (Osseointegration, Planning & Surgical Protocol)') ON CONFLICT DO NOTHING;
INSERT INTO topics (id, chapter_id, name) VALUES ('20000000-0000-0000-0006-000000000028', '20000000-0000-0000-0005-000000000028', 'Dental Implants (Osseointegration, Planning & Surgical Protocol) Topic') ON CONFLICT DO NOTHING;
INSERT INTO concepts (id, topic_id, name) VALUES ('20000000-0000-0000-0007-000000000028', '20000000-0000-0000-0006-000000000028', 'Dental Implants (Osseointegration, Planning & Surgical Protocol) Concept') ON CONFLICT DO NOTHING;
INSERT INTO learning_objects (id, concept_id, object_type, content_payload) VALUES ('20000000-0000-0000-0008-000000000028', '20000000-0000-0000-0007-000000000028', 'TEXT', 'Dental Implants (Osseointegration, Planning & Surgical Protocol) details') ON CONFLICT DO NOTHING;

-- Chapter: Fixed Prosthodontics (Crown Preparation & Marginal Design)
INSERT INTO units (id, subject_id, name) VALUES ('20000000-0000-0000-0004-000000000029', '20000000-0000-0000-0003-000000000008', 'Fixed Prosthodontics (Crown Preparation & Marginal Design) Unit') ON CONFLICT DO NOTHING;
INSERT INTO chapters (id, unit_id, name) VALUES ('20000000-0000-0000-0005-000000000029', '20000000-0000-0000-0004-000000000029', 'Fixed Prosthodontics (Crown Preparation & Marginal Design)') ON CONFLICT DO NOTHING;
INSERT INTO topics (id, chapter_id, name) VALUES ('20000000-0000-0000-0006-000000000029', '20000000-0000-0000-0005-000000000029', 'Fixed Prosthodontics (Crown Preparation & Marginal Design) Topic') ON CONFLICT DO NOTHING;
INSERT INTO concepts (id, topic_id, name) VALUES ('20000000-0000-0000-0007-000000000029', '20000000-0000-0000-0006-000000000029', 'Fixed Prosthodontics (Crown Preparation & Marginal Design) Concept') ON CONFLICT DO NOTHING;
INSERT INTO learning_objects (id, concept_id, object_type, content_payload) VALUES ('20000000-0000-0000-0008-000000000029', '20000000-0000-0000-0007-000000000029', 'TEXT', 'Fixed Prosthodontics (Crown Preparation & Marginal Design) details') ON CONFLICT DO NOTHING;


-- Subject: BDS-OR (Orthodontics & Dentofacial Orthopaedics)
INSERT INTO subjects (id, semester_id, code, name, description) VALUES ('20000000-0000-0000-0003-000000000009', '20000000-0000-0000-0002-000000000008', 'BDS-OR', 'Orthodontics & Dentofacial Orthopaedics', '') ON CONFLICT (code) DO NOTHING;

-- Chapter: Angle Classification & Skeletal Malocclusion Assessment
INSERT INTO units (id, subject_id, name) VALUES ('20000000-0000-0000-0004-000000000030', '20000000-0000-0000-0003-000000000009', 'Angle Classification & Skeletal Malocclusion Assessment Unit') ON CONFLICT DO NOTHING;
INSERT INTO chapters (id, unit_id, name) VALUES ('20000000-0000-0000-0005-000000000030', '20000000-0000-0000-0004-000000000030', 'Angle Classification & Skeletal Malocclusion Assessment') ON CONFLICT DO NOTHING;
INSERT INTO topics (id, chapter_id, name) VALUES ('20000000-0000-0000-0006-000000000030', '20000000-0000-0000-0005-000000000030', 'Angle Classification & Skeletal Malocclusion Assessment Topic') ON CONFLICT DO NOTHING;
INSERT INTO concepts (id, topic_id, name) VALUES ('20000000-0000-0000-0007-000000000030', '20000000-0000-0000-0006-000000000030', 'Angle Classification & Skeletal Malocclusion Assessment Concept') ON CONFLICT DO NOTHING;
INSERT INTO learning_objects (id, concept_id, object_type, content_payload) VALUES ('20000000-0000-0000-0008-000000000030', '20000000-0000-0000-0007-000000000030', 'TEXT', 'Angle Classification & Skeletal Malocclusion Assessment details') ON CONFLICT DO NOTHING;

-- Chapter: Cephalometric Analysis (Landmarks, Planes & ANB Interpretation)
INSERT INTO units (id, subject_id, name) VALUES ('20000000-0000-0000-0004-000000000031', '20000000-0000-0000-0003-000000000009', 'Cephalometric Analysis (Landmarks, Planes & ANB Interpretation) Unit') ON CONFLICT DO NOTHING;
INSERT INTO chapters (id, unit_id, name) VALUES ('20000000-0000-0000-0005-000000000031', '20000000-0000-0000-0004-000000000031', 'Cephalometric Analysis (Landmarks, Planes & ANB Interpretation)') ON CONFLICT DO NOTHING;
INSERT INTO topics (id, chapter_id, name) VALUES ('20000000-0000-0000-0006-000000000031', '20000000-0000-0000-0005-000000000031', 'Cephalometric Analysis (Landmarks, Planes & ANB Interpretation) Topic') ON CONFLICT DO NOTHING;
INSERT INTO concepts (id, topic_id, name) VALUES ('20000000-0000-0000-0007-000000000031', '20000000-0000-0000-0006-000000000031', 'Cephalometric Analysis (Landmarks, Planes & ANB Interpretation) Concept') ON CONFLICT DO NOTHING;
INSERT INTO learning_objects (id, concept_id, object_type, content_payload) VALUES ('20000000-0000-0000-0008-000000000031', '20000000-0000-0000-0007-000000000031', 'TEXT', 'Cephalometric Analysis (Landmarks, Planes & ANB Interpretation) details') ON CONFLICT DO NOTHING;

-- Chapter: Fixed Appliance Mechanics (Bracket Systems & Arch Wire Sequences)
INSERT INTO units (id, subject_id, name) VALUES ('20000000-0000-0000-0004-000000000032', '20000000-0000-0000-0003-000000000009', 'Fixed Appliance Mechanics (Bracket Systems & Arch Wire Sequences) Unit') ON CONFLICT DO NOTHING;
INSERT INTO chapters (id, unit_id, name) VALUES ('20000000-0000-0000-0005-000000000032', '20000000-0000-0000-0004-000000000032', 'Fixed Appliance Mechanics (Bracket Systems & Arch Wire Sequences)') ON CONFLICT DO NOTHING;
INSERT INTO topics (id, chapter_id, name) VALUES ('20000000-0000-0000-0006-000000000032', '20000000-0000-0000-0005-000000000032', 'Fixed Appliance Mechanics (Bracket Systems & Arch Wire Sequences) Topic') ON CONFLICT DO NOTHING;
INSERT INTO concepts (id, topic_id, name) VALUES ('20000000-0000-0000-0007-000000000032', '20000000-0000-0000-0006-000000000032', 'Fixed Appliance Mechanics (Bracket Systems & Arch Wire Sequences) Concept') ON CONFLICT DO NOTHING;
INSERT INTO learning_objects (id, concept_id, object_type, content_payload) VALUES ('20000000-0000-0000-0008-000000000032', '20000000-0000-0000-0007-000000000032', 'TEXT', 'Fixed Appliance Mechanics (Bracket Systems & Arch Wire Sequences) details') ON CONFLICT DO NOTHING;

