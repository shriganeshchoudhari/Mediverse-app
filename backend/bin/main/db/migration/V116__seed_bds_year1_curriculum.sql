-- =============================================================================
-- Migration: V116__seed_bds_year1_curriculum.sql
-- Description: Seeds Year 1 (Semesters 1-2) subjects/units/chapters/topics
-- =============================================================================

-- Subject: BDS-GA (General Anatomy including Embryology & Histology)
INSERT INTO subjects (id, semester_id, code, title, category) VALUES ('20000000-0000-0000-0003-000000000001', '20000000-0000-0000-0002-000000000001', 'BDS-GA', 'General Anatomy including Embryology & Histology', 'BASIC_SCIENCE') ON CONFLICT (id) DO NOTHING;

-- Chapter: Head & Neck Osteology
INSERT INTO units (id, subject_id, title, sort_order) VALUES ('20000000-0000-0000-0004-000000000001', '20000000-0000-0000-0003-000000000001', 'Head & Neck Osteology Unit', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO chapters (id, unit_id, title, sort_order) VALUES ('20000000-0000-0000-0005-000000000001', '20000000-0000-0000-0004-000000000001', 'Head & Neck Osteology', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO topics (id, chapter_id, title, sort_order) VALUES ('20000000-0000-0000-0006-000000000001', '20000000-0000-0000-0005-000000000001', 'Head & Neck Osteology Topic', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO concepts (id, topic_id, title, sort_order) VALUES ('20000000-0000-0000-0007-000000000001', '20000000-0000-0000-0006-000000000001', 'Head & Neck Osteology Concept', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO learning_objects (id, concept_id, object_type, content_payload, sort_order) VALUES ('20000000-0000-0000-0008-000000000001', '20000000-0000-0000-0007-000000000001', 'TEXT', 'Head & Neck Osteology details', 1) ON CONFLICT (id) DO NOTHING;

-- Chapter: Muscles of Mastication
INSERT INTO units (id, subject_id, title, sort_order) VALUES ('20000000-0000-0000-0004-000000000002', '20000000-0000-0000-0003-000000000001', 'Muscles of Mastication Unit', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO chapters (id, unit_id, title, sort_order) VALUES ('20000000-0000-0000-0005-000000000002', '20000000-0000-0000-0004-000000000002', 'Muscles of Mastication', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO topics (id, chapter_id, title, sort_order) VALUES ('20000000-0000-0000-0006-000000000002', '20000000-0000-0000-0005-000000000002', 'Muscles of Mastication Topic', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO concepts (id, topic_id, title, sort_order) VALUES ('20000000-0000-0000-0007-000000000002', '20000000-0000-0000-0006-000000000002', 'Muscles of Mastication Concept', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO learning_objects (id, concept_id, object_type, content_payload, sort_order) VALUES ('20000000-0000-0000-0008-000000000002', '20000000-0000-0000-0007-000000000002', 'TEXT', 'Muscles of Mastication details', 1) ON CONFLICT (id) DO NOTHING;

-- Chapter: TMJ Structure & Biomechanics
INSERT INTO units (id, subject_id, title, sort_order) VALUES ('20000000-0000-0000-0004-000000000003', '20000000-0000-0000-0003-000000000001', 'TMJ Structure & Biomechanics Unit', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO chapters (id, unit_id, title, sort_order) VALUES ('20000000-0000-0000-0005-000000000003', '20000000-0000-0000-0004-000000000003', 'TMJ Structure & Biomechanics', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO topics (id, chapter_id, title, sort_order) VALUES ('20000000-0000-0000-0006-000000000003', '20000000-0000-0000-0005-000000000003', 'TMJ Structure & Biomechanics Topic', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO concepts (id, topic_id, title, sort_order) VALUES ('20000000-0000-0000-0007-000000000003', '20000000-0000-0000-0006-000000000003', 'TMJ Structure & Biomechanics Concept', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO learning_objects (id, concept_id, object_type, content_payload, sort_order) VALUES ('20000000-0000-0000-0008-000000000003', '20000000-0000-0000-0007-000000000003', 'TEXT', 'TMJ Structure & Biomechanics details', 1) ON CONFLICT (id) DO NOTHING;

-- Chapter: Oral Histology (Enamel/Dentine/Cementum/Pulp)
INSERT INTO units (id, subject_id, title, sort_order) VALUES ('20000000-0000-0000-0004-000000000004', '20000000-0000-0000-0003-000000000001', 'Oral Histology (Enamel/Dentine/Cementum/Pulp) Unit', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO chapters (id, unit_id, title, sort_order) VALUES ('20000000-0000-0000-0005-000000000004', '20000000-0000-0000-0004-000000000004', 'Oral Histology (Enamel/Dentine/Cementum/Pulp)', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO topics (id, chapter_id, title, sort_order) VALUES ('20000000-0000-0000-0006-000000000004', '20000000-0000-0000-0005-000000000004', 'Oral Histology (Enamel/Dentine/Cementum/Pulp) Topic', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO concepts (id, topic_id, title, sort_order) VALUES ('20000000-0000-0000-0007-000000000004', '20000000-0000-0000-0006-000000000004', 'Oral Histology (Enamel/Dentine/Cementum/Pulp) Concept', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO learning_objects (id, concept_id, object_type, content_payload, sort_order) VALUES ('20000000-0000-0000-0008-000000000004', '20000000-0000-0000-0007-000000000004', 'TEXT', 'Oral Histology (Enamel/Dentine/Cementum/Pulp) details', 1) ON CONFLICT (id) DO NOTHING;

-- Chapter: Tooth Development (Odontogenesis & Amelogenesis)
INSERT INTO units (id, subject_id, title, sort_order) VALUES ('20000000-0000-0000-0004-000000000005', '20000000-0000-0000-0003-000000000001', 'Tooth Development (Odontogenesis & Amelogenesis) Unit', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO chapters (id, unit_id, title, sort_order) VALUES ('20000000-0000-0000-0005-000000000005', '20000000-0000-0000-0004-000000000005', 'Tooth Development (Odontogenesis & Amelogenesis)', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO topics (id, chapter_id, title, sort_order) VALUES ('20000000-0000-0000-0006-000000000005', '20000000-0000-0000-0005-000000000005', 'Tooth Development (Odontogenesis & Amelogenesis) Topic', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO concepts (id, topic_id, title, sort_order) VALUES ('20000000-0000-0000-0007-000000000005', '20000000-0000-0000-0006-000000000005', 'Tooth Development (Odontogenesis & Amelogenesis) Concept', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO learning_objects (id, concept_id, object_type, content_payload, sort_order) VALUES ('20000000-0000-0000-0008-000000000005', '20000000-0000-0000-0007-000000000005', 'TEXT', 'Tooth Development (Odontogenesis & Amelogenesis) details', 1) ON CONFLICT (id) DO NOTHING;

-- Chapter: Trigeminal Nerve branches & Dental Anesthesia Anatomy
INSERT INTO units (id, subject_id, title, sort_order) VALUES ('20000000-0000-0000-0004-000000000006', '20000000-0000-0000-0003-000000000001', 'Trigeminal Nerve branches & Dental Anesthesia Anatomy Unit', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO chapters (id, unit_id, title, sort_order) VALUES ('20000000-0000-0000-0005-000000000006', '20000000-0000-0000-0004-000000000006', 'Trigeminal Nerve branches & Dental Anesthesia Anatomy', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO topics (id, chapter_id, title, sort_order) VALUES ('20000000-0000-0000-0006-000000000006', '20000000-0000-0000-0005-000000000006', 'Trigeminal Nerve branches & Dental Anesthesia Anatomy Topic', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO concepts (id, topic_id, title, sort_order) VALUES ('20000000-0000-0000-0007-000000000006', '20000000-0000-0000-0006-000000000006', 'Trigeminal Nerve branches & Dental Anesthesia Anatomy Concept', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO learning_objects (id, concept_id, object_type, content_payload, sort_order) VALUES ('20000000-0000-0000-0008-000000000006', '20000000-0000-0000-0007-000000000006', 'TEXT', 'Trigeminal Nerve branches & Dental Anesthesia Anatomy details', 1) ON CONFLICT (id) DO NOTHING;


-- Subject: BDS-GP (General Human Physiology & Biochemistry)
INSERT INTO subjects (id, semester_id, code, title, category) VALUES ('20000000-0000-0000-0003-000000000002', '20000000-0000-0000-0002-000000000001', 'BDS-GP', 'General Human Physiology & Biochemistry', 'BASIC_SCIENCE') ON CONFLICT (id) DO NOTHING;

-- Chapter: Blood Coagulation Cascade & Haemostasis
INSERT INTO units (id, subject_id, title, sort_order) VALUES ('20000000-0000-0000-0004-000000000007', '20000000-0000-0000-0003-000000000002', 'Blood Coagulation Cascade & Haemostasis Unit', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO chapters (id, unit_id, title, sort_order) VALUES ('20000000-0000-0000-0005-000000000007', '20000000-0000-0000-0004-000000000007', 'Blood Coagulation Cascade & Haemostasis', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO topics (id, chapter_id, title, sort_order) VALUES ('20000000-0000-0000-0006-000000000007', '20000000-0000-0000-0005-000000000007', 'Blood Coagulation Cascade & Haemostasis Topic', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO concepts (id, topic_id, title, sort_order) VALUES ('20000000-0000-0000-0007-000000000007', '20000000-0000-0000-0006-000000000007', 'Blood Coagulation Cascade & Haemostasis Concept', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO learning_objects (id, concept_id, object_type, content_payload, sort_order) VALUES ('20000000-0000-0000-0008-000000000007', '20000000-0000-0000-0007-000000000007', 'TEXT', 'Blood Coagulation Cascade & Haemostasis details', 1) ON CONFLICT (id) DO NOTHING;

-- Chapter: Local Anaesthetic Pharmacodynamics (Na+ Channel Blockade)
INSERT INTO units (id, subject_id, title, sort_order) VALUES ('20000000-0000-0000-0004-000000000008', '20000000-0000-0000-0003-000000000002', 'Local Anaesthetic Pharmacodynamics (Na+ Channel Blockade) Unit', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO chapters (id, unit_id, title, sort_order) VALUES ('20000000-0000-0000-0005-000000000008', '20000000-0000-0000-0004-000000000008', 'Local Anaesthetic Pharmacodynamics (Na+ Channel Blockade)', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO topics (id, chapter_id, title, sort_order) VALUES ('20000000-0000-0000-0006-000000000008', '20000000-0000-0000-0005-000000000008', 'Local Anaesthetic Pharmacodynamics (Na+ Channel Blockade) Topic', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO concepts (id, topic_id, title, sort_order) VALUES ('20000000-0000-0000-0007-000000000008', '20000000-0000-0000-0006-000000000008', 'Local Anaesthetic Pharmacodynamics (Na+ Channel Blockade) Concept', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO learning_objects (id, concept_id, object_type, content_payload, sort_order) VALUES ('20000000-0000-0000-0008-000000000008', '20000000-0000-0000-0007-000000000008', 'TEXT', 'Local Anaesthetic Pharmacodynamics (Na+ Channel Blockade) details', 1) ON CONFLICT (id) DO NOTHING;

-- Chapter: Salivary Glands (Composition, Control & Xerostomia)
INSERT INTO units (id, subject_id, title, sort_order) VALUES ('20000000-0000-0000-0004-000000000009', '20000000-0000-0000-0003-000000000002', 'Salivary Glands (Composition, Control & Xerostomia) Unit', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO chapters (id, unit_id, title, sort_order) VALUES ('20000000-0000-0000-0005-000000000009', '20000000-0000-0000-0004-000000000009', 'Salivary Glands (Composition, Control & Xerostomia)', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO topics (id, chapter_id, title, sort_order) VALUES ('20000000-0000-0000-0006-000000000009', '20000000-0000-0000-0005-000000000009', 'Salivary Glands (Composition, Control & Xerostomia) Topic', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO concepts (id, topic_id, title, sort_order) VALUES ('20000000-0000-0000-0007-000000000009', '20000000-0000-0000-0006-000000000009', 'Salivary Glands (Composition, Control & Xerostomia) Concept', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO learning_objects (id, concept_id, object_type, content_payload, sort_order) VALUES ('20000000-0000-0000-0008-000000000009', '20000000-0000-0000-0007-000000000009', 'TEXT', 'Salivary Glands (Composition, Control & Xerostomia) details', 1) ON CONFLICT (id) DO NOTHING;


-- Subject: BDS-DM (Dental Materials)
INSERT INTO subjects (id, semester_id, code, title, category) VALUES ('20000000-0000-0000-0003-000000000003', '20000000-0000-0000-0002-000000000002', 'BDS-DM', 'Dental Materials', 'BASIC_SCIENCE') ON CONFLICT (id) DO NOTHING;

-- Chapter: Composite Resins (Polymerization Shrinkage)
INSERT INTO units (id, subject_id, title, sort_order) VALUES ('20000000-0000-0000-0004-000000000010', '20000000-0000-0000-0003-000000000003', 'Composite Resins (Polymerization Shrinkage) Unit', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO chapters (id, unit_id, title, sort_order) VALUES ('20000000-0000-0000-0005-000000000010', '20000000-0000-0000-0004-000000000010', 'Composite Resins (Polymerization Shrinkage)', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO topics (id, chapter_id, title, sort_order) VALUES ('20000000-0000-0000-0006-000000000010', '20000000-0000-0000-0005-000000000010', 'Composite Resins (Polymerization Shrinkage) Topic', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO concepts (id, topic_id, title, sort_order) VALUES ('20000000-0000-0000-0007-000000000010', '20000000-0000-0000-0006-000000000010', 'Composite Resins (Polymerization Shrinkage) Concept', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO learning_objects (id, concept_id, object_type, content_payload, sort_order) VALUES ('20000000-0000-0000-0008-000000000010', '20000000-0000-0000-0007-000000000010', 'TEXT', 'Composite Resins (Polymerization Shrinkage) details', 1) ON CONFLICT (id) DO NOTHING;

-- Chapter: Dental Ceramics (Feldspathic/Zirconia/E-max)
INSERT INTO units (id, subject_id, title, sort_order) VALUES ('20000000-0000-0000-0004-000000000011', '20000000-0000-0000-0003-000000000003', 'Dental Ceramics (Feldspathic/Zirconia/E-max) Unit', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO chapters (id, unit_id, title, sort_order) VALUES ('20000000-0000-0000-0005-000000000011', '20000000-0000-0000-0004-000000000011', 'Dental Ceramics (Feldspathic/Zirconia/E-max)', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO topics (id, chapter_id, title, sort_order) VALUES ('20000000-0000-0000-0006-000000000011', '20000000-0000-0000-0005-000000000011', 'Dental Ceramics (Feldspathic/Zirconia/E-max) Topic', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO concepts (id, topic_id, title, sort_order) VALUES ('20000000-0000-0000-0007-000000000011', '20000000-0000-0000-0006-000000000011', 'Dental Ceramics (Feldspathic/Zirconia/E-max) Concept', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO learning_objects (id, concept_id, object_type, content_payload, sort_order) VALUES ('20000000-0000-0000-0008-000000000011', '20000000-0000-0000-0007-000000000011', 'TEXT', 'Dental Ceramics (Feldspathic/Zirconia/E-max) details', 1) ON CONFLICT (id) DO NOTHING;

-- Chapter: Impression Materials (Elastomers & Dimensional Accuracy)
INSERT INTO units (id, subject_id, title, sort_order) VALUES ('20000000-0000-0000-0004-000000000012', '20000000-0000-0000-0003-000000000003', 'Impression Materials (Elastomers & Dimensional Accuracy) Unit', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO chapters (id, unit_id, title, sort_order) VALUES ('20000000-0000-0000-0005-000000000012', '20000000-0000-0000-0004-000000000012', 'Impression Materials (Elastomers & Dimensional Accuracy)', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO topics (id, chapter_id, title, sort_order) VALUES ('20000000-0000-0000-0006-000000000012', '20000000-0000-0000-0005-000000000012', 'Impression Materials (Elastomers & Dimensional Accuracy) Topic', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO concepts (id, topic_id, title, sort_order) VALUES ('20000000-0000-0000-0007-000000000012', '20000000-0000-0000-0006-000000000012', 'Impression Materials (Elastomers & Dimensional Accuracy) Concept', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO learning_objects (id, concept_id, object_type, content_payload, sort_order) VALUES ('20000000-0000-0000-0008-000000000012', '20000000-0000-0000-0007-000000000012', 'TEXT', 'Impression Materials (Elastomers & Dimensional Accuracy) details', 1) ON CONFLICT (id) DO NOTHING;

-- Chapter: Dental Cements (Luting Agents & Bond Strength)
INSERT INTO units (id, subject_id, title, sort_order) VALUES ('20000000-0000-0000-0004-000000000013', '20000000-0000-0000-0003-000000000003', 'Dental Cements (Luting Agents & Bond Strength) Unit', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO chapters (id, unit_id, title, sort_order) VALUES ('20000000-0000-0000-0005-000000000013', '20000000-0000-0000-0004-000000000013', 'Dental Cements (Luting Agents & Bond Strength)', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO topics (id, chapter_id, title, sort_order) VALUES ('20000000-0000-0000-0006-000000000013', '20000000-0000-0000-0005-000000000013', 'Dental Cements (Luting Agents & Bond Strength) Topic', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO concepts (id, topic_id, title, sort_order) VALUES ('20000000-0000-0000-0007-000000000013', '20000000-0000-0000-0006-000000000013', 'Dental Cements (Luting Agents & Bond Strength) Concept', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO learning_objects (id, concept_id, object_type, content_payload, sort_order) VALUES ('20000000-0000-0000-0008-000000000013', '20000000-0000-0000-0007-000000000013', 'TEXT', 'Dental Cements (Luting Agents & Bond Strength) details', 1) ON CONFLICT (id) DO NOTHING;

