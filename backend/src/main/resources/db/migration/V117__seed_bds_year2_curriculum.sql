-- =============================================================================
-- Migration: V117__seed_bds_year2_curriculum.sql
-- Description: Seeds Year 2 (Semesters 3-4)
-- =============================================================================

-- Subject: BDS-OP (Oral Pathology & Oral Microbiology)
INSERT INTO subjects (id, semester_id, code, name, description) VALUES ('20000000-0000-0000-0003-000000000004', '20000000-0000-0000-0002-000000000003', 'BDS-OP', 'Oral Pathology & Oral Microbiology', '') ON CONFLICT (code) DO NOTHING;

-- Chapter: Dental Caries (Keyes Tetrad & Stephan pH Curve)
INSERT INTO units (id, subject_id, name) VALUES ('20000000-0000-0000-0004-000000000014', '20000000-0000-0000-0003-000000000004', 'Dental Caries (Keyes Tetrad & Stephan pH Curve) Unit') ON CONFLICT DO NOTHING;
INSERT INTO chapters (id, unit_id, name) VALUES ('20000000-0000-0000-0005-000000000014', '20000000-0000-0000-0004-000000000014', 'Dental Caries (Keyes Tetrad & Stephan pH Curve)') ON CONFLICT DO NOTHING;
INSERT INTO topics (id, chapter_id, name) VALUES ('20000000-0000-0000-0006-000000000014', '20000000-0000-0000-0005-000000000014', 'Dental Caries (Keyes Tetrad & Stephan pH Curve) Topic') ON CONFLICT DO NOTHING;
INSERT INTO concepts (id, topic_id, name) VALUES ('20000000-0000-0000-0007-000000000014', '20000000-0000-0000-0006-000000000014', 'Dental Caries (Keyes Tetrad & Stephan pH Curve) Concept') ON CONFLICT DO NOTHING;
INSERT INTO learning_objects (id, concept_id, object_type, content_payload) VALUES ('20000000-0000-0000-0008-000000000014', '20000000-0000-0000-0007-000000000014', 'TEXT', 'Dental Caries (Keyes Tetrad & Stephan pH Curve) details') ON CONFLICT DO NOTHING;

-- Chapter: Oral Cancer (Stages, Histology & Risk Factors)
INSERT INTO units (id, subject_id, name) VALUES ('20000000-0000-0000-0004-000000000015', '20000000-0000-0000-0003-000000000004', 'Oral Cancer (Stages, Histology & Risk Factors) Unit') ON CONFLICT DO NOTHING;
INSERT INTO chapters (id, unit_id, name) VALUES ('20000000-0000-0000-0005-000000000015', '20000000-0000-0000-0004-000000000015', 'Oral Cancer (Stages, Histology & Risk Factors)') ON CONFLICT DO NOTHING;
INSERT INTO topics (id, chapter_id, name) VALUES ('20000000-0000-0000-0006-000000000015', '20000000-0000-0000-0005-000000000015', 'Oral Cancer (Stages, Histology & Risk Factors) Topic') ON CONFLICT DO NOTHING;
INSERT INTO concepts (id, topic_id, name) VALUES ('20000000-0000-0000-0007-000000000015', '20000000-0000-0000-0006-000000000015', 'Oral Cancer (Stages, Histology & Risk Factors) Concept') ON CONFLICT DO NOTHING;
INSERT INTO learning_objects (id, concept_id, object_type, content_payload) VALUES ('20000000-0000-0000-0008-000000000015', '20000000-0000-0000-0007-000000000015', 'TEXT', 'Oral Cancer (Stages, Histology & Risk Factors) details') ON CONFLICT DO NOTHING;

-- Chapter: Odontogenic Cysts & Tumours (Classification & Radiological Features)
INSERT INTO units (id, subject_id, name) VALUES ('20000000-0000-0000-0004-000000000016', '20000000-0000-0000-0003-000000000004', 'Odontogenic Cysts & Tumours (Classification & Radiological Features) Unit') ON CONFLICT DO NOTHING;
INSERT INTO chapters (id, unit_id, name) VALUES ('20000000-0000-0000-0005-000000000016', '20000000-0000-0000-0004-000000000016', 'Odontogenic Cysts & Tumours (Classification & Radiological Features)') ON CONFLICT DO NOTHING;
INSERT INTO topics (id, chapter_id, name) VALUES ('20000000-0000-0000-0006-000000000016', '20000000-0000-0000-0005-000000000016', 'Odontogenic Cysts & Tumours (Classification & Radiological Features) Topic') ON CONFLICT DO NOTHING;
INSERT INTO concepts (id, topic_id, name) VALUES ('20000000-0000-0000-0007-000000000016', '20000000-0000-0000-0006-000000000016', 'Odontogenic Cysts & Tumours (Classification & Radiological Features) Concept') ON CONFLICT DO NOTHING;
INSERT INTO learning_objects (id, concept_id, object_type, content_payload) VALUES ('20000000-0000-0000-0008-000000000016', '20000000-0000-0000-0007-000000000016', 'TEXT', 'Odontogenic Cysts & Tumours (Classification & Radiological Features) details') ON CONFLICT DO NOTHING;

-- Chapter: Periodontal Pathogens (Biofilm & Host Immune Response)
INSERT INTO units (id, subject_id, name) VALUES ('20000000-0000-0000-0004-000000000017', '20000000-0000-0000-0003-000000000004', 'Periodontal Pathogens (Biofilm & Host Immune Response) Unit') ON CONFLICT DO NOTHING;
INSERT INTO chapters (id, unit_id, name) VALUES ('20000000-0000-0000-0005-000000000017', '20000000-0000-0000-0004-000000000017', 'Periodontal Pathogens (Biofilm & Host Immune Response)') ON CONFLICT DO NOTHING;
INSERT INTO topics (id, chapter_id, name) VALUES ('20000000-0000-0000-0006-000000000017', '20000000-0000-0000-0005-000000000017', 'Periodontal Pathogens (Biofilm & Host Immune Response) Topic') ON CONFLICT DO NOTHING;
INSERT INTO concepts (id, topic_id, name) VALUES ('20000000-0000-0000-0007-000000000017', '20000000-0000-0000-0006-000000000017', 'Periodontal Pathogens (Biofilm & Host Immune Response) Concept') ON CONFLICT DO NOTHING;
INSERT INTO learning_objects (id, concept_id, object_type, content_payload) VALUES ('20000000-0000-0000-0008-000000000017', '20000000-0000-0000-0007-000000000017', 'TEXT', 'Periodontal Pathogens (Biofilm & Host Immune Response) details') ON CONFLICT DO NOTHING;


-- Subject: BDS-PE (Periodontology)
INSERT INTO subjects (id, semester_id, code, name, description) VALUES ('20000000-0000-0000-0003-000000000005', '20000000-0000-0000-0002-000000000004', 'BDS-PE', 'Periodontology', '') ON CONFLICT (code) DO NOTHING;

-- Chapter: Periodontal Assessment (Probing Depths, BOP & Furcation Involvement)
INSERT INTO units (id, subject_id, name) VALUES ('20000000-0000-0000-0004-000000000018', '20000000-0000-0000-0003-000000000005', 'Periodontal Assessment (Probing Depths, BOP & Furcation Involvement) Unit') ON CONFLICT DO NOTHING;
INSERT INTO chapters (id, unit_id, name) VALUES ('20000000-0000-0000-0005-000000000018', '20000000-0000-0000-0004-000000000018', 'Periodontal Assessment (Probing Depths, BOP & Furcation Involvement)') ON CONFLICT DO NOTHING;
INSERT INTO topics (id, chapter_id, name) VALUES ('20000000-0000-0000-0006-000000000018', '20000000-0000-0000-0005-000000000018', 'Periodontal Assessment (Probing Depths, BOP & Furcation Involvement) Topic') ON CONFLICT DO NOTHING;
INSERT INTO concepts (id, topic_id, name) VALUES ('20000000-0000-0000-0007-000000000018', '20000000-0000-0000-0006-000000000018', 'Periodontal Assessment (Probing Depths, BOP & Furcation Involvement) Concept') ON CONFLICT DO NOTHING;
INSERT INTO learning_objects (id, concept_id, object_type, content_payload) VALUES ('20000000-0000-0000-0008-000000000018', '20000000-0000-0000-0007-000000000018', 'TEXT', 'Periodontal Assessment (Probing Depths, BOP & Furcation Involvement) details') ON CONFLICT DO NOTHING;

-- Chapter: Scaling & Root Planing (Instrumentation & Technique)
INSERT INTO units (id, subject_id, name) VALUES ('20000000-0000-0000-0004-000000000019', '20000000-0000-0000-0003-000000000005', 'Scaling & Root Planing (Instrumentation & Technique) Unit') ON CONFLICT DO NOTHING;
INSERT INTO chapters (id, unit_id, name) VALUES ('20000000-0000-0000-0005-000000000019', '20000000-0000-0000-0004-000000000019', 'Scaling & Root Planing (Instrumentation & Technique)') ON CONFLICT DO NOTHING;
INSERT INTO topics (id, chapter_id, name) VALUES ('20000000-0000-0000-0006-000000000019', '20000000-0000-0000-0005-000000000019', 'Scaling & Root Planing (Instrumentation & Technique) Topic') ON CONFLICT DO NOTHING;
INSERT INTO concepts (id, topic_id, name) VALUES ('20000000-0000-0000-0007-000000000019', '20000000-0000-0000-0006-000000000019', 'Scaling & Root Planing (Instrumentation & Technique) Concept') ON CONFLICT DO NOTHING;
INSERT INTO learning_objects (id, concept_id, object_type, content_payload) VALUES ('20000000-0000-0000-0008-000000000019', '20000000-0000-0000-0007-000000000019', 'TEXT', 'Scaling & Root Planing (Instrumentation & Technique) details') ON CONFLICT DO NOTHING;

-- Chapter: Osseous Surgery (Resective & Regenerative Approaches)
INSERT INTO units (id, subject_id, name) VALUES ('20000000-0000-0000-0004-000000000020', '20000000-0000-0000-0003-000000000005', 'Osseous Surgery (Resective & Regenerative Approaches) Unit') ON CONFLICT DO NOTHING;
INSERT INTO chapters (id, unit_id, name) VALUES ('20000000-0000-0000-0005-000000000020', '20000000-0000-0000-0004-000000000020', 'Osseous Surgery (Resective & Regenerative Approaches)') ON CONFLICT DO NOTHING;
INSERT INTO topics (id, chapter_id, name) VALUES ('20000000-0000-0000-0006-000000000020', '20000000-0000-0000-0005-000000000020', 'Osseous Surgery (Resective & Regenerative Approaches) Topic') ON CONFLICT DO NOTHING;
INSERT INTO concepts (id, topic_id, name) VALUES ('20000000-0000-0000-0007-000000000020', '20000000-0000-0000-0006-000000000020', 'Osseous Surgery (Resective & Regenerative Approaches) Concept') ON CONFLICT DO NOTHING;
INSERT INTO learning_objects (id, concept_id, object_type, content_payload) VALUES ('20000000-0000-0000-0008-000000000020', '20000000-0000-0000-0007-000000000020', 'TEXT', 'Osseous Surgery (Resective & Regenerative Approaches) details') ON CONFLICT DO NOTHING;

