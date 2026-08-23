-- =============================================================================
-- Migration: V120__seed_bds_year5_curriculum.sql
-- Description: Seeds Year 5 (Semesters 9-10)
-- =============================================================================

-- Subject: BDS-PD (Pedodontics & Preventive Dentistry)
INSERT INTO subjects (id, semester_id, code, title, category) VALUES ('20000000-0000-0000-0003-000000000010', '20000000-0000-0000-0002-000000000009', 'BDS-PD', 'Pedodontics & Preventive Dentistry', 'BASIC_SCIENCE') ON CONFLICT (id) DO NOTHING;

-- Chapter: Primary Dentition (Chronology of Eruption & Occlusion)
INSERT INTO units (id, subject_id, title, sort_order) VALUES ('20000000-0000-0000-0004-000000000033', '20000000-0000-0000-0003-000000000010', 'Primary Dentition (Chronology of Eruption & Occlusion) Unit', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO chapters (id, unit_id, title, sort_order) VALUES ('20000000-0000-0000-0005-000000000033', '20000000-0000-0000-0004-000000000033', 'Primary Dentition (Chronology of Eruption & Occlusion)', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO topics (id, chapter_id, title, sort_order) VALUES ('20000000-0000-0000-0006-000000000033', '20000000-0000-0000-0005-000000000033', 'Primary Dentition (Chronology of Eruption & Occlusion) Topic', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO concepts (id, topic_id, title, sort_order) VALUES ('20000000-0000-0000-0007-000000000033', '20000000-0000-0000-0006-000000000033', 'Primary Dentition (Chronology of Eruption & Occlusion) Concept', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO learning_objects (id, concept_id, object_type, content_payload, sort_order) VALUES ('20000000-0000-0000-0008-000000000033', '20000000-0000-0000-0007-000000000033', 'TEXT', 'Primary Dentition (Chronology of Eruption & Occlusion) details', 1) ON CONFLICT (id) DO NOTHING;

-- Chapter: Pulp Therapy (Pulpotomy & Pulpectomy in Primary Teeth)
INSERT INTO units (id, subject_id, title, sort_order) VALUES ('20000000-0000-0000-0004-000000000034', '20000000-0000-0000-0003-000000000010', 'Pulp Therapy (Pulpotomy & Pulpectomy in Primary Teeth) Unit', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO chapters (id, unit_id, title, sort_order) VALUES ('20000000-0000-0000-0005-000000000034', '20000000-0000-0000-0004-000000000034', 'Pulp Therapy (Pulpotomy & Pulpectomy in Primary Teeth)', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO topics (id, chapter_id, title, sort_order) VALUES ('20000000-0000-0000-0006-000000000034', '20000000-0000-0000-0005-000000000034', 'Pulp Therapy (Pulpotomy & Pulpectomy in Primary Teeth) Topic', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO concepts (id, topic_id, title, sort_order) VALUES ('20000000-0000-0000-0007-000000000034', '20000000-0000-0000-0006-000000000034', 'Pulp Therapy (Pulpotomy & Pulpectomy in Primary Teeth) Concept', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO learning_objects (id, concept_id, object_type, content_payload, sort_order) VALUES ('20000000-0000-0000-0008-000000000034', '20000000-0000-0000-0007-000000000034', 'TEXT', 'Pulp Therapy (Pulpotomy & Pulpectomy in Primary Teeth) details', 1) ON CONFLICT (id) DO NOTHING;

-- Chapter: Fluoride Therapy (Systemic vs Topical & Optimal Dosing)
INSERT INTO units (id, subject_id, title, sort_order) VALUES ('20000000-0000-0000-0004-000000000035', '20000000-0000-0000-0003-000000000010', 'Fluoride Therapy (Systemic vs Topical & Optimal Dosing) Unit', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO chapters (id, unit_id, title, sort_order) VALUES ('20000000-0000-0000-0005-000000000035', '20000000-0000-0000-0004-000000000035', 'Fluoride Therapy (Systemic vs Topical & Optimal Dosing)', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO topics (id, chapter_id, title, sort_order) VALUES ('20000000-0000-0000-0006-000000000035', '20000000-0000-0000-0005-000000000035', 'Fluoride Therapy (Systemic vs Topical & Optimal Dosing) Topic', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO concepts (id, topic_id, title, sort_order) VALUES ('20000000-0000-0000-0007-000000000035', '20000000-0000-0000-0006-000000000035', 'Fluoride Therapy (Systemic vs Topical & Optimal Dosing) Concept', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO learning_objects (id, concept_id, object_type, content_payload, sort_order) VALUES ('20000000-0000-0000-0008-000000000035', '20000000-0000-0000-0007-000000000035', 'TEXT', 'Fluoride Therapy (Systemic vs Topical & Optimal Dosing) details', 1) ON CONFLICT (id) DO NOTHING;


-- Subject: BDS-OM (Oral Medicine & Radiology)
INSERT INTO subjects (id, semester_id, code, title, category) VALUES ('20000000-0000-0000-0003-000000000011', '20000000-0000-0000-0002-000000000010', 'BDS-OM', 'Oral Medicine & Radiology', 'BASIC_SCIENCE') ON CONFLICT (id) DO NOTHING;

-- Chapter: Periapical Radiography (Technique & Radiographic Interpretation)
INSERT INTO units (id, subject_id, title, sort_order) VALUES ('20000000-0000-0000-0004-000000000036', '20000000-0000-0000-0003-000000000011', 'Periapical Radiography (Technique & Radiographic Interpretation) Unit', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO chapters (id, unit_id, title, sort_order) VALUES ('20000000-0000-0000-0005-000000000036', '20000000-0000-0000-0004-000000000036', 'Periapical Radiography (Technique & Radiographic Interpretation)', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO topics (id, chapter_id, title, sort_order) VALUES ('20000000-0000-0000-0006-000000000036', '20000000-0000-0000-0005-000000000036', 'Periapical Radiography (Technique & Radiographic Interpretation) Topic', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO concepts (id, topic_id, title, sort_order) VALUES ('20000000-0000-0000-0007-000000000036', '20000000-0000-0000-0006-000000000036', 'Periapical Radiography (Technique & Radiographic Interpretation) Concept', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO learning_objects (id, concept_id, object_type, content_payload, sort_order) VALUES ('20000000-0000-0000-0008-000000000036', '20000000-0000-0000-0007-000000000036', 'TEXT', 'Periapical Radiography (Technique & Radiographic Interpretation) details', 1) ON CONFLICT (id) DO NOTHING;

-- Chapter: CBCT in Dentistry (Applications & Radiation Dose Justification)
INSERT INTO units (id, subject_id, title, sort_order) VALUES ('20000000-0000-0000-0004-000000000037', '20000000-0000-0000-0003-000000000011', 'CBCT in Dentistry (Applications & Radiation Dose Justification) Unit', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO chapters (id, unit_id, title, sort_order) VALUES ('20000000-0000-0000-0005-000000000037', '20000000-0000-0000-0004-000000000037', 'CBCT in Dentistry (Applications & Radiation Dose Justification)', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO topics (id, chapter_id, title, sort_order) VALUES ('20000000-0000-0000-0006-000000000037', '20000000-0000-0000-0005-000000000037', 'CBCT in Dentistry (Applications & Radiation Dose Justification) Topic', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO concepts (id, topic_id, title, sort_order) VALUES ('20000000-0000-0000-0007-000000000037', '20000000-0000-0000-0006-000000000037', 'CBCT in Dentistry (Applications & Radiation Dose Justification) Concept', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO learning_objects (id, concept_id, object_type, content_payload, sort_order) VALUES ('20000000-0000-0000-0008-000000000037', '20000000-0000-0000-0007-000000000037', 'TEXT', 'CBCT in Dentistry (Applications & Radiation Dose Justification) details', 1) ON CONFLICT (id) DO NOTHING;

-- Chapter: Oral Manifestations of Systemic Diseases (Diagnostic Protocol)
INSERT INTO units (id, subject_id, title, sort_order) VALUES ('20000000-0000-0000-0004-000000000038', '20000000-0000-0000-0003-000000000011', 'Oral Manifestations of Systemic Diseases (Diagnostic Protocol) Unit', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO chapters (id, unit_id, title, sort_order) VALUES ('20000000-0000-0000-0005-000000000038', '20000000-0000-0000-0004-000000000038', 'Oral Manifestations of Systemic Diseases (Diagnostic Protocol)', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO topics (id, chapter_id, title, sort_order) VALUES ('20000000-0000-0000-0006-000000000038', '20000000-0000-0000-0005-000000000038', 'Oral Manifestations of Systemic Diseases (Diagnostic Protocol) Topic', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO concepts (id, topic_id, title, sort_order) VALUES ('20000000-0000-0000-0007-000000000038', '20000000-0000-0000-0006-000000000038', 'Oral Manifestations of Systemic Diseases (Diagnostic Protocol) Concept', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO learning_objects (id, concept_id, object_type, content_payload, sort_order) VALUES ('20000000-0000-0000-0008-000000000038', '20000000-0000-0000-0007-000000000038', 'TEXT', 'Oral Manifestations of Systemic Diseases (Diagnostic Protocol) details', 1) ON CONFLICT (id) DO NOTHING;

