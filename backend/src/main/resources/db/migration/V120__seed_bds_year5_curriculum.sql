-- =============================================================================
-- Migration: V120__seed_bds_year5_curriculum.sql
-- Description: Seeds Year 5 (Semesters 9-10)
-- =============================================================================

-- Subject: BDS-PD (Pedodontics & Preventive Dentistry)
INSERT INTO subjects (id, semester_id, code, name, description) VALUES ('20000000-0000-0000-0003-000000000010', '20000000-0000-0000-0002-000000000009', 'BDS-PD', 'Pedodontics & Preventive Dentistry', '') ON CONFLICT (code) DO NOTHING;

-- Chapter: Primary Dentition (Chronology of Eruption & Occlusion)
INSERT INTO units (id, subject_id, name) VALUES ('20000000-0000-0000-0004-000000000033', '20000000-0000-0000-0003-000000000010', 'Primary Dentition (Chronology of Eruption & Occlusion) Unit') ON CONFLICT DO NOTHING;
INSERT INTO chapters (id, unit_id, name) VALUES ('20000000-0000-0000-0005-000000000033', '20000000-0000-0000-0004-000000000033', 'Primary Dentition (Chronology of Eruption & Occlusion)') ON CONFLICT DO NOTHING;
INSERT INTO topics (id, chapter_id, name) VALUES ('20000000-0000-0000-0006-000000000033', '20000000-0000-0000-0005-000000000033', 'Primary Dentition (Chronology of Eruption & Occlusion) Topic') ON CONFLICT DO NOTHING;
INSERT INTO concepts (id, topic_id, name) VALUES ('20000000-0000-0000-0007-000000000033', '20000000-0000-0000-0006-000000000033', 'Primary Dentition (Chronology of Eruption & Occlusion) Concept') ON CONFLICT DO NOTHING;
INSERT INTO learning_objects (id, concept_id, object_type, content_payload) VALUES ('20000000-0000-0000-0008-000000000033', '20000000-0000-0000-0007-000000000033', 'TEXT', 'Primary Dentition (Chronology of Eruption & Occlusion) details') ON CONFLICT DO NOTHING;

-- Chapter: Pulp Therapy (Pulpotomy & Pulpectomy in Primary Teeth)
INSERT INTO units (id, subject_id, name) VALUES ('20000000-0000-0000-0004-000000000034', '20000000-0000-0000-0003-000000000010', 'Pulp Therapy (Pulpotomy & Pulpectomy in Primary Teeth) Unit') ON CONFLICT DO NOTHING;
INSERT INTO chapters (id, unit_id, name) VALUES ('20000000-0000-0000-0005-000000000034', '20000000-0000-0000-0004-000000000034', 'Pulp Therapy (Pulpotomy & Pulpectomy in Primary Teeth)') ON CONFLICT DO NOTHING;
INSERT INTO topics (id, chapter_id, name) VALUES ('20000000-0000-0000-0006-000000000034', '20000000-0000-0000-0005-000000000034', 'Pulp Therapy (Pulpotomy & Pulpectomy in Primary Teeth) Topic') ON CONFLICT DO NOTHING;
INSERT INTO concepts (id, topic_id, name) VALUES ('20000000-0000-0000-0007-000000000034', '20000000-0000-0000-0006-000000000034', 'Pulp Therapy (Pulpotomy & Pulpectomy in Primary Teeth) Concept') ON CONFLICT DO NOTHING;
INSERT INTO learning_objects (id, concept_id, object_type, content_payload) VALUES ('20000000-0000-0000-0008-000000000034', '20000000-0000-0000-0007-000000000034', 'TEXT', 'Pulp Therapy (Pulpotomy & Pulpectomy in Primary Teeth) details') ON CONFLICT DO NOTHING;

-- Chapter: Fluoride Therapy (Systemic vs Topical & Optimal Dosing)
INSERT INTO units (id, subject_id, name) VALUES ('20000000-0000-0000-0004-000000000035', '20000000-0000-0000-0003-000000000010', 'Fluoride Therapy (Systemic vs Topical & Optimal Dosing) Unit') ON CONFLICT DO NOTHING;
INSERT INTO chapters (id, unit_id, name) VALUES ('20000000-0000-0000-0005-000000000035', '20000000-0000-0000-0004-000000000035', 'Fluoride Therapy (Systemic vs Topical & Optimal Dosing)') ON CONFLICT DO NOTHING;
INSERT INTO topics (id, chapter_id, name) VALUES ('20000000-0000-0000-0006-000000000035', '20000000-0000-0000-0005-000000000035', 'Fluoride Therapy (Systemic vs Topical & Optimal Dosing) Topic') ON CONFLICT DO NOTHING;
INSERT INTO concepts (id, topic_id, name) VALUES ('20000000-0000-0000-0007-000000000035', '20000000-0000-0000-0006-000000000035', 'Fluoride Therapy (Systemic vs Topical & Optimal Dosing) Concept') ON CONFLICT DO NOTHING;
INSERT INTO learning_objects (id, concept_id, object_type, content_payload) VALUES ('20000000-0000-0000-0008-000000000035', '20000000-0000-0000-0007-000000000035', 'TEXT', 'Fluoride Therapy (Systemic vs Topical & Optimal Dosing) details') ON CONFLICT DO NOTHING;


-- Subject: BDS-OM (Oral Medicine & Radiology)
INSERT INTO subjects (id, semester_id, code, name, description) VALUES ('20000000-0000-0000-0003-000000000011', '20000000-0000-0000-0002-000000000010', 'BDS-OM', 'Oral Medicine & Radiology', '') ON CONFLICT (code) DO NOTHING;

-- Chapter: Periapical Radiography (Technique & Radiographic Interpretation)
INSERT INTO units (id, subject_id, name) VALUES ('20000000-0000-0000-0004-000000000036', '20000000-0000-0000-0003-000000000011', 'Periapical Radiography (Technique & Radiographic Interpretation) Unit') ON CONFLICT DO NOTHING;
INSERT INTO chapters (id, unit_id, name) VALUES ('20000000-0000-0000-0005-000000000036', '20000000-0000-0000-0004-000000000036', 'Periapical Radiography (Technique & Radiographic Interpretation)') ON CONFLICT DO NOTHING;
INSERT INTO topics (id, chapter_id, name) VALUES ('20000000-0000-0000-0006-000000000036', '20000000-0000-0000-0005-000000000036', 'Periapical Radiography (Technique & Radiographic Interpretation) Topic') ON CONFLICT DO NOTHING;
INSERT INTO concepts (id, topic_id, name) VALUES ('20000000-0000-0000-0007-000000000036', '20000000-0000-0000-0006-000000000036', 'Periapical Radiography (Technique & Radiographic Interpretation) Concept') ON CONFLICT DO NOTHING;
INSERT INTO learning_objects (id, concept_id, object_type, content_payload) VALUES ('20000000-0000-0000-0008-000000000036', '20000000-0000-0000-0007-000000000036', 'TEXT', 'Periapical Radiography (Technique & Radiographic Interpretation) details') ON CONFLICT DO NOTHING;

-- Chapter: CBCT in Dentistry (Applications & Radiation Dose Justification)
INSERT INTO units (id, subject_id, name) VALUES ('20000000-0000-0000-0004-000000000037', '20000000-0000-0000-0003-000000000011', 'CBCT in Dentistry (Applications & Radiation Dose Justification) Unit') ON CONFLICT DO NOTHING;
INSERT INTO chapters (id, unit_id, name) VALUES ('20000000-0000-0000-0005-000000000037', '20000000-0000-0000-0004-000000000037', 'CBCT in Dentistry (Applications & Radiation Dose Justification)') ON CONFLICT DO NOTHING;
INSERT INTO topics (id, chapter_id, name) VALUES ('20000000-0000-0000-0006-000000000037', '20000000-0000-0000-0005-000000000037', 'CBCT in Dentistry (Applications & Radiation Dose Justification) Topic') ON CONFLICT DO NOTHING;
INSERT INTO concepts (id, topic_id, name) VALUES ('20000000-0000-0000-0007-000000000037', '20000000-0000-0000-0006-000000000037', 'CBCT in Dentistry (Applications & Radiation Dose Justification) Concept') ON CONFLICT DO NOTHING;
INSERT INTO learning_objects (id, concept_id, object_type, content_payload) VALUES ('20000000-0000-0000-0008-000000000037', '20000000-0000-0000-0007-000000000037', 'TEXT', 'CBCT in Dentistry (Applications & Radiation Dose Justification) details') ON CONFLICT DO NOTHING;

-- Chapter: Oral Manifestations of Systemic Diseases (Diagnostic Protocol)
INSERT INTO units (id, subject_id, name) VALUES ('20000000-0000-0000-0004-000000000038', '20000000-0000-0000-0003-000000000011', 'Oral Manifestations of Systemic Diseases (Diagnostic Protocol) Unit') ON CONFLICT DO NOTHING;
INSERT INTO chapters (id, unit_id, name) VALUES ('20000000-0000-0000-0005-000000000038', '20000000-0000-0000-0004-000000000038', 'Oral Manifestations of Systemic Diseases (Diagnostic Protocol)') ON CONFLICT DO NOTHING;
INSERT INTO topics (id, chapter_id, name) VALUES ('20000000-0000-0000-0006-000000000038', '20000000-0000-0000-0005-000000000038', 'Oral Manifestations of Systemic Diseases (Diagnostic Protocol) Topic') ON CONFLICT DO NOTHING;
INSERT INTO concepts (id, topic_id, name) VALUES ('20000000-0000-0000-0007-000000000038', '20000000-0000-0000-0006-000000000038', 'Oral Manifestations of Systemic Diseases (Diagnostic Protocol) Concept') ON CONFLICT DO NOTHING;
INSERT INTO learning_objects (id, concept_id, object_type, content_payload) VALUES ('20000000-0000-0000-0008-000000000038', '20000000-0000-0000-0007-000000000038', 'TEXT', 'Oral Manifestations of Systemic Diseases (Diagnostic Protocol) details') ON CONFLICT DO NOTHING;

