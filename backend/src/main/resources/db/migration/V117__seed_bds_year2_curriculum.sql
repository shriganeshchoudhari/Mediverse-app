-- =============================================================================
-- Migration: V117__seed_bds_year2_curriculum.sql
-- Description: Seeds Year 2 (Semesters 3-4)
-- =============================================================================

-- Subject: BDS-OP (Oral Pathology & Oral Microbiology)
INSERT INTO subjects (id, semester_id, code, title, category) VALUES ('20000000-0000-0000-0003-000000000004', '20000000-0000-0000-0002-000000000003', 'BDS-OP', 'Oral Pathology & Oral Microbiology', 'BASIC_SCIENCE') ON CONFLICT (id) DO NOTHING;

-- Chapter: Dental Caries (Keyes Tetrad & Stephan pH Curve)
INSERT INTO units (id, subject_id, title, sort_order) VALUES ('20000000-0000-0000-0004-000000000014', '20000000-0000-0000-0003-000000000004', 'Dental Caries (Keyes Tetrad & Stephan pH Curve) Unit', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO chapters (id, unit_id, title, sort_order) VALUES ('20000000-0000-0000-0005-000000000014', '20000000-0000-0000-0004-000000000014', 'Dental Caries (Keyes Tetrad & Stephan pH Curve)', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO topics (id, chapter_id, title, sort_order) VALUES ('20000000-0000-0000-0006-000000000014', '20000000-0000-0000-0005-000000000014', 'Dental Caries (Keyes Tetrad & Stephan pH Curve) Topic', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO concepts (id, topic_id, title, sort_order) VALUES ('20000000-0000-0000-0007-000000000014', '20000000-0000-0000-0006-000000000014', 'Dental Caries (Keyes Tetrad & Stephan pH Curve) Concept', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO learning_objects (id, concept_id, object_type, content_payload, sort_order) VALUES ('20000000-0000-0000-0008-000000000014', '20000000-0000-0000-0007-000000000014', 'TEXT', 'Dental Caries (Keyes Tetrad & Stephan pH Curve) details', 1) ON CONFLICT (id) DO NOTHING;

-- Chapter: Oral Cancer (Stages, Histology & Risk Factors)
INSERT INTO units (id, subject_id, title, sort_order) VALUES ('20000000-0000-0000-0004-000000000015', '20000000-0000-0000-0003-000000000004', 'Oral Cancer (Stages, Histology & Risk Factors) Unit', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO chapters (id, unit_id, title, sort_order) VALUES ('20000000-0000-0000-0005-000000000015', '20000000-0000-0000-0004-000000000015', 'Oral Cancer (Stages, Histology & Risk Factors)', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO topics (id, chapter_id, title, sort_order) VALUES ('20000000-0000-0000-0006-000000000015', '20000000-0000-0000-0005-000000000015', 'Oral Cancer (Stages, Histology & Risk Factors) Topic', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO concepts (id, topic_id, title, sort_order) VALUES ('20000000-0000-0000-0007-000000000015', '20000000-0000-0000-0006-000000000015', 'Oral Cancer (Stages, Histology & Risk Factors) Concept', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO learning_objects (id, concept_id, object_type, content_payload, sort_order) VALUES ('20000000-0000-0000-0008-000000000015', '20000000-0000-0000-0007-000000000015', 'TEXT', 'Oral Cancer (Stages, Histology & Risk Factors) details', 1) ON CONFLICT (id) DO NOTHING;

-- Chapter: Odontogenic Cysts & Tumours (Classification & Radiological Features)
INSERT INTO units (id, subject_id, title, sort_order) VALUES ('20000000-0000-0000-0004-000000000016', '20000000-0000-0000-0003-000000000004', 'Odontogenic Cysts & Tumours (Classification & Radiological Features) Unit', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO chapters (id, unit_id, title, sort_order) VALUES ('20000000-0000-0000-0005-000000000016', '20000000-0000-0000-0004-000000000016', 'Odontogenic Cysts & Tumours (Classification & Radiological Features)', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO topics (id, chapter_id, title, sort_order) VALUES ('20000000-0000-0000-0006-000000000016', '20000000-0000-0000-0005-000000000016', 'Odontogenic Cysts & Tumours (Classification & Radiological Features) Topic', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO concepts (id, topic_id, title, sort_order) VALUES ('20000000-0000-0000-0007-000000000016', '20000000-0000-0000-0006-000000000016', 'Odontogenic Cysts & Tumours (Classification & Radiological Features) Concept', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO learning_objects (id, concept_id, object_type, content_payload, sort_order) VALUES ('20000000-0000-0000-0008-000000000016', '20000000-0000-0000-0007-000000000016', 'TEXT', 'Odontogenic Cysts & Tumours (Classification & Radiological Features) details', 1) ON CONFLICT (id) DO NOTHING;

-- Chapter: Periodontal Pathogens (Biofilm & Host Immune Response)
INSERT INTO units (id, subject_id, title, sort_order) VALUES ('20000000-0000-0000-0004-000000000017', '20000000-0000-0000-0003-000000000004', 'Periodontal Pathogens (Biofilm & Host Immune Response) Unit', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO chapters (id, unit_id, title, sort_order) VALUES ('20000000-0000-0000-0005-000000000017', '20000000-0000-0000-0004-000000000017', 'Periodontal Pathogens (Biofilm & Host Immune Response)', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO topics (id, chapter_id, title, sort_order) VALUES ('20000000-0000-0000-0006-000000000017', '20000000-0000-0000-0005-000000000017', 'Periodontal Pathogens (Biofilm & Host Immune Response) Topic', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO concepts (id, topic_id, title, sort_order) VALUES ('20000000-0000-0000-0007-000000000017', '20000000-0000-0000-0006-000000000017', 'Periodontal Pathogens (Biofilm & Host Immune Response) Concept', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO learning_objects (id, concept_id, object_type, content_payload, sort_order) VALUES ('20000000-0000-0000-0008-000000000017', '20000000-0000-0000-0007-000000000017', 'TEXT', 'Periodontal Pathogens (Biofilm & Host Immune Response) details', 1) ON CONFLICT (id) DO NOTHING;


-- Subject: BDS-PE (Periodontology)
INSERT INTO subjects (id, semester_id, code, title, category) VALUES ('20000000-0000-0000-0003-000000000005', '20000000-0000-0000-0002-000000000004', 'BDS-PE', 'Periodontology', 'BASIC_SCIENCE') ON CONFLICT (id) DO NOTHING;

-- Chapter: Periodontal Assessment (Probing Depths, BOP & Furcation Involvement)
INSERT INTO units (id, subject_id, title, sort_order) VALUES ('20000000-0000-0000-0004-000000000018', '20000000-0000-0000-0003-000000000005', 'Periodontal Assessment (Probing Depths, BOP & Furcation Involvement) Unit', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO chapters (id, unit_id, title, sort_order) VALUES ('20000000-0000-0000-0005-000000000018', '20000000-0000-0000-0004-000000000018', 'Periodontal Assessment (Probing Depths, BOP & Furcation Involvement)', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO topics (id, chapter_id, title, sort_order) VALUES ('20000000-0000-0000-0006-000000000018', '20000000-0000-0000-0005-000000000018', 'Periodontal Assessment (Probing Depths, BOP & Furcation Involvement) Topic', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO concepts (id, topic_id, title, sort_order) VALUES ('20000000-0000-0000-0007-000000000018', '20000000-0000-0000-0006-000000000018', 'Periodontal Assessment (Probing Depths, BOP & Furcation Involvement) Concept', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO learning_objects (id, concept_id, object_type, content_payload, sort_order) VALUES ('20000000-0000-0000-0008-000000000018', '20000000-0000-0000-0007-000000000018', 'TEXT', 'Periodontal Assessment (Probing Depths, BOP & Furcation Involvement) details', 1) ON CONFLICT (id) DO NOTHING;

-- Chapter: Scaling & Root Planing (Instrumentation & Technique)
INSERT INTO units (id, subject_id, title, sort_order) VALUES ('20000000-0000-0000-0004-000000000019', '20000000-0000-0000-0003-000000000005', 'Scaling & Root Planing (Instrumentation & Technique) Unit', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO chapters (id, unit_id, title, sort_order) VALUES ('20000000-0000-0000-0005-000000000019', '20000000-0000-0000-0004-000000000019', 'Scaling & Root Planing (Instrumentation & Technique)', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO topics (id, chapter_id, title, sort_order) VALUES ('20000000-0000-0000-0006-000000000019', '20000000-0000-0000-0005-000000000019', 'Scaling & Root Planing (Instrumentation & Technique) Topic', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO concepts (id, topic_id, title, sort_order) VALUES ('20000000-0000-0000-0007-000000000019', '20000000-0000-0000-0006-000000000019', 'Scaling & Root Planing (Instrumentation & Technique) Concept', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO learning_objects (id, concept_id, object_type, content_payload, sort_order) VALUES ('20000000-0000-0000-0008-000000000019', '20000000-0000-0000-0007-000000000019', 'TEXT', 'Scaling & Root Planing (Instrumentation & Technique) details', 1) ON CONFLICT (id) DO NOTHING;

-- Chapter: Osseous Surgery (Resective & Regenerative Approaches)
INSERT INTO units (id, subject_id, title, sort_order) VALUES ('20000000-0000-0000-0004-000000000020', '20000000-0000-0000-0003-000000000005', 'Osseous Surgery (Resective & Regenerative Approaches) Unit', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO chapters (id, unit_id, title, sort_order) VALUES ('20000000-0000-0000-0005-000000000020', '20000000-0000-0000-0004-000000000020', 'Osseous Surgery (Resective & Regenerative Approaches)', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO topics (id, chapter_id, title, sort_order) VALUES ('20000000-0000-0000-0006-000000000020', '20000000-0000-0000-0005-000000000020', 'Osseous Surgery (Resective & Regenerative Approaches) Topic', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO concepts (id, topic_id, title, sort_order) VALUES ('20000000-0000-0000-0007-000000000020', '20000000-0000-0000-0006-000000000020', 'Osseous Surgery (Resective & Regenerative Approaches) Concept', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO learning_objects (id, concept_id, object_type, content_payload, sort_order) VALUES ('20000000-0000-0000-0008-000000000020', '20000000-0000-0000-0007-000000000020', 'TEXT', 'Osseous Surgery (Resective & Regenerative Approaches) details', 1) ON CONFLICT (id) DO NOTHING;

