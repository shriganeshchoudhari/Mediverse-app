-- =============================================================================
-- Migration: V116__seed_bds_year1_curriculum.sql
-- Description: Seeds Year 1 (Semesters 1-2) subjects/units/chapters/topics
-- =============================================================================

-- Subject: BDS-GA (General Anatomy including Embryology & Histology)
INSERT INTO subjects (id, semester_id, code, name, description) VALUES ('20000000-0000-0000-0003-000000000001', '20000000-0000-0000-0002-000000000001', 'BDS-GA', 'General Anatomy including Embryology & Histology', '') ON CONFLICT (code) DO NOTHING;

-- Chapter: Head & Neck Osteology
INSERT INTO units (id, subject_id, name) VALUES ('20000000-0000-0000-0004-000000000001', '20000000-0000-0000-0003-000000000001', 'Head & Neck Osteology Unit') ON CONFLICT DO NOTHING;
INSERT INTO chapters (id, unit_id, name) VALUES ('20000000-0000-0000-0005-000000000001', '20000000-0000-0000-0004-000000000001', 'Head & Neck Osteology') ON CONFLICT DO NOTHING;
INSERT INTO topics (id, chapter_id, name) VALUES ('20000000-0000-0000-0006-000000000001', '20000000-0000-0000-0005-000000000001', 'Head & Neck Osteology Topic') ON CONFLICT DO NOTHING;
INSERT INTO concepts (id, topic_id, name) VALUES ('20000000-0000-0000-0007-000000000001', '20000000-0000-0000-0006-000000000001', 'Head & Neck Osteology Concept') ON CONFLICT DO NOTHING;
INSERT INTO learning_objects (id, concept_id, object_type, content_payload) VALUES ('20000000-0000-0000-0008-000000000001', '20000000-0000-0000-0007-000000000001', 'TEXT', 'Head & Neck Osteology details') ON CONFLICT DO NOTHING;

-- Chapter: Muscles of Mastication
INSERT INTO units (id, subject_id, name) VALUES ('20000000-0000-0000-0004-000000000002', '20000000-0000-0000-0003-000000000001', 'Muscles of Mastication Unit') ON CONFLICT DO NOTHING;
INSERT INTO chapters (id, unit_id, name) VALUES ('20000000-0000-0000-0005-000000000002', '20000000-0000-0000-0004-000000000002', 'Muscles of Mastication') ON CONFLICT DO NOTHING;
INSERT INTO topics (id, chapter_id, name) VALUES ('20000000-0000-0000-0006-000000000002', '20000000-0000-0000-0005-000000000002', 'Muscles of Mastication Topic') ON CONFLICT DO NOTHING;
INSERT INTO concepts (id, topic_id, name) VALUES ('20000000-0000-0000-0007-000000000002', '20000000-0000-0000-0006-000000000002', 'Muscles of Mastication Concept') ON CONFLICT DO NOTHING;
INSERT INTO learning_objects (id, concept_id, object_type, content_payload) VALUES ('20000000-0000-0000-0008-000000000002', '20000000-0000-0000-0007-000000000002', 'TEXT', 'Muscles of Mastication details') ON CONFLICT DO NOTHING;

-- Chapter: TMJ Structure & Biomechanics
INSERT INTO units (id, subject_id, name) VALUES ('20000000-0000-0000-0004-000000000003', '20000000-0000-0000-0003-000000000001', 'TMJ Structure & Biomechanics Unit') ON CONFLICT DO NOTHING;
INSERT INTO chapters (id, unit_id, name) VALUES ('20000000-0000-0000-0005-000000000003', '20000000-0000-0000-0004-000000000003', 'TMJ Structure & Biomechanics') ON CONFLICT DO NOTHING;
INSERT INTO topics (id, chapter_id, name) VALUES ('20000000-0000-0000-0006-000000000003', '20000000-0000-0000-0005-000000000003', 'TMJ Structure & Biomechanics Topic') ON CONFLICT DO NOTHING;
INSERT INTO concepts (id, topic_id, name) VALUES ('20000000-0000-0000-0007-000000000003', '20000000-0000-0000-0006-000000000003', 'TMJ Structure & Biomechanics Concept') ON CONFLICT DO NOTHING;
INSERT INTO learning_objects (id, concept_id, object_type, content_payload) VALUES ('20000000-0000-0000-0008-000000000003', '20000000-0000-0000-0007-000000000003', 'TEXT', 'TMJ Structure & Biomechanics details') ON CONFLICT DO NOTHING;

-- Chapter: Oral Histology (Enamel/Dentine/Cementum/Pulp)
INSERT INTO units (id, subject_id, name) VALUES ('20000000-0000-0000-0004-000000000004', '20000000-0000-0000-0003-000000000001', 'Oral Histology (Enamel/Dentine/Cementum/Pulp) Unit') ON CONFLICT DO NOTHING;
INSERT INTO chapters (id, unit_id, name) VALUES ('20000000-0000-0000-0005-000000000004', '20000000-0000-0000-0004-000000000004', 'Oral Histology (Enamel/Dentine/Cementum/Pulp)') ON CONFLICT DO NOTHING;
INSERT INTO topics (id, chapter_id, name) VALUES ('20000000-0000-0000-0006-000000000004', '20000000-0000-0000-0005-000000000004', 'Oral Histology (Enamel/Dentine/Cementum/Pulp) Topic') ON CONFLICT DO NOTHING;
INSERT INTO concepts (id, topic_id, name) VALUES ('20000000-0000-0000-0007-000000000004', '20000000-0000-0000-0006-000000000004', 'Oral Histology (Enamel/Dentine/Cementum/Pulp) Concept') ON CONFLICT DO NOTHING;
INSERT INTO learning_objects (id, concept_id, object_type, content_payload) VALUES ('20000000-0000-0000-0008-000000000004', '20000000-0000-0000-0007-000000000004', 'TEXT', 'Oral Histology (Enamel/Dentine/Cementum/Pulp) details') ON CONFLICT DO NOTHING;

-- Chapter: Tooth Development (Odontogenesis & Amelogenesis)
INSERT INTO units (id, subject_id, name) VALUES ('20000000-0000-0000-0004-000000000005', '20000000-0000-0000-0003-000000000001', 'Tooth Development (Odontogenesis & Amelogenesis) Unit') ON CONFLICT DO NOTHING;
INSERT INTO chapters (id, unit_id, name) VALUES ('20000000-0000-0000-0005-000000000005', '20000000-0000-0000-0004-000000000005', 'Tooth Development (Odontogenesis & Amelogenesis)') ON CONFLICT DO NOTHING;
INSERT INTO topics (id, chapter_id, name) VALUES ('20000000-0000-0000-0006-000000000005', '20000000-0000-0000-0005-000000000005', 'Tooth Development (Odontogenesis & Amelogenesis) Topic') ON CONFLICT DO NOTHING;
INSERT INTO concepts (id, topic_id, name) VALUES ('20000000-0000-0000-0007-000000000005', '20000000-0000-0000-0006-000000000005', 'Tooth Development (Odontogenesis & Amelogenesis) Concept') ON CONFLICT DO NOTHING;
INSERT INTO learning_objects (id, concept_id, object_type, content_payload) VALUES ('20000000-0000-0000-0008-000000000005', '20000000-0000-0000-0007-000000000005', 'TEXT', 'Tooth Development (Odontogenesis & Amelogenesis) details') ON CONFLICT DO NOTHING;

-- Chapter: Trigeminal Nerve branches & Dental Anesthesia Anatomy
INSERT INTO units (id, subject_id, name) VALUES ('20000000-0000-0000-0004-000000000006', '20000000-0000-0000-0003-000000000001', 'Trigeminal Nerve branches & Dental Anesthesia Anatomy Unit') ON CONFLICT DO NOTHING;
INSERT INTO chapters (id, unit_id, name) VALUES ('20000000-0000-0000-0005-000000000006', '20000000-0000-0000-0004-000000000006', 'Trigeminal Nerve branches & Dental Anesthesia Anatomy') ON CONFLICT DO NOTHING;
INSERT INTO topics (id, chapter_id, name) VALUES ('20000000-0000-0000-0006-000000000006', '20000000-0000-0000-0005-000000000006', 'Trigeminal Nerve branches & Dental Anesthesia Anatomy Topic') ON CONFLICT DO NOTHING;
INSERT INTO concepts (id, topic_id, name) VALUES ('20000000-0000-0000-0007-000000000006', '20000000-0000-0000-0006-000000000006', 'Trigeminal Nerve branches & Dental Anesthesia Anatomy Concept') ON CONFLICT DO NOTHING;
INSERT INTO learning_objects (id, concept_id, object_type, content_payload) VALUES ('20000000-0000-0000-0008-000000000006', '20000000-0000-0000-0007-000000000006', 'TEXT', 'Trigeminal Nerve branches & Dental Anesthesia Anatomy details') ON CONFLICT DO NOTHING;


-- Subject: BDS-GP (General Human Physiology & Biochemistry)
INSERT INTO subjects (id, semester_id, code, name, description) VALUES ('20000000-0000-0000-0003-000000000002', '20000000-0000-0000-0002-000000000001', 'BDS-GP', 'General Human Physiology & Biochemistry', '') ON CONFLICT (code) DO NOTHING;

-- Chapter: Blood Coagulation Cascade & Haemostasis
INSERT INTO units (id, subject_id, name) VALUES ('20000000-0000-0000-0004-000000000007', '20000000-0000-0000-0003-000000000002', 'Blood Coagulation Cascade & Haemostasis Unit') ON CONFLICT DO NOTHING;
INSERT INTO chapters (id, unit_id, name) VALUES ('20000000-0000-0000-0005-000000000007', '20000000-0000-0000-0004-000000000007', 'Blood Coagulation Cascade & Haemostasis') ON CONFLICT DO NOTHING;
INSERT INTO topics (id, chapter_id, name) VALUES ('20000000-0000-0000-0006-000000000007', '20000000-0000-0000-0005-000000000007', 'Blood Coagulation Cascade & Haemostasis Topic') ON CONFLICT DO NOTHING;
INSERT INTO concepts (id, topic_id, name) VALUES ('20000000-0000-0000-0007-000000000007', '20000000-0000-0000-0006-000000000007', 'Blood Coagulation Cascade & Haemostasis Concept') ON CONFLICT DO NOTHING;
INSERT INTO learning_objects (id, concept_id, object_type, content_payload) VALUES ('20000000-0000-0000-0008-000000000007', '20000000-0000-0000-0007-000000000007', 'TEXT', 'Blood Coagulation Cascade & Haemostasis details') ON CONFLICT DO NOTHING;

-- Chapter: Local Anaesthetic Pharmacodynamics (Na+ Channel Blockade)
INSERT INTO units (id, subject_id, name) VALUES ('20000000-0000-0000-0004-000000000008', '20000000-0000-0000-0003-000000000002', 'Local Anaesthetic Pharmacodynamics (Na+ Channel Blockade) Unit') ON CONFLICT DO NOTHING;
INSERT INTO chapters (id, unit_id, name) VALUES ('20000000-0000-0000-0005-000000000008', '20000000-0000-0000-0004-000000000008', 'Local Anaesthetic Pharmacodynamics (Na+ Channel Blockade)') ON CONFLICT DO NOTHING;
INSERT INTO topics (id, chapter_id, name) VALUES ('20000000-0000-0000-0006-000000000008', '20000000-0000-0000-0005-000000000008', 'Local Anaesthetic Pharmacodynamics (Na+ Channel Blockade) Topic') ON CONFLICT DO NOTHING;
INSERT INTO concepts (id, topic_id, name) VALUES ('20000000-0000-0000-0007-000000000008', '20000000-0000-0000-0006-000000000008', 'Local Anaesthetic Pharmacodynamics (Na+ Channel Blockade) Concept') ON CONFLICT DO NOTHING;
INSERT INTO learning_objects (id, concept_id, object_type, content_payload) VALUES ('20000000-0000-0000-0008-000000000008', '20000000-0000-0000-0007-000000000008', 'TEXT', 'Local Anaesthetic Pharmacodynamics (Na+ Channel Blockade) details') ON CONFLICT DO NOTHING;

-- Chapter: Salivary Glands (Composition, Control & Xerostomia)
INSERT INTO units (id, subject_id, name) VALUES ('20000000-0000-0000-0004-000000000009', '20000000-0000-0000-0003-000000000002', 'Salivary Glands (Composition, Control & Xerostomia) Unit') ON CONFLICT DO NOTHING;
INSERT INTO chapters (id, unit_id, name) VALUES ('20000000-0000-0000-0005-000000000009', '20000000-0000-0000-0004-000000000009', 'Salivary Glands (Composition, Control & Xerostomia)') ON CONFLICT DO NOTHING;
INSERT INTO topics (id, chapter_id, name) VALUES ('20000000-0000-0000-0006-000000000009', '20000000-0000-0000-0005-000000000009', 'Salivary Glands (Composition, Control & Xerostomia) Topic') ON CONFLICT DO NOTHING;
INSERT INTO concepts (id, topic_id, name) VALUES ('20000000-0000-0000-0007-000000000009', '20000000-0000-0000-0006-000000000009', 'Salivary Glands (Composition, Control & Xerostomia) Concept') ON CONFLICT DO NOTHING;
INSERT INTO learning_objects (id, concept_id, object_type, content_payload) VALUES ('20000000-0000-0000-0008-000000000009', '20000000-0000-0000-0007-000000000009', 'TEXT', 'Salivary Glands (Composition, Control & Xerostomia) details') ON CONFLICT DO NOTHING;


-- Subject: BDS-DM (Dental Materials)
INSERT INTO subjects (id, semester_id, code, name, description) VALUES ('20000000-0000-0000-0003-000000000003', '20000000-0000-0000-0002-000000000002', 'BDS-DM', 'Dental Materials', '') ON CONFLICT (code) DO NOTHING;

-- Chapter: Composite Resins (Polymerization Shrinkage)
INSERT INTO units (id, subject_id, name) VALUES ('20000000-0000-0000-0004-000000000010', '20000000-0000-0000-0003-000000000003', 'Composite Resins (Polymerization Shrinkage) Unit') ON CONFLICT DO NOTHING;
INSERT INTO chapters (id, unit_id, name) VALUES ('20000000-0000-0000-0005-000000000010', '20000000-0000-0000-0004-000000000010', 'Composite Resins (Polymerization Shrinkage)') ON CONFLICT DO NOTHING;
INSERT INTO topics (id, chapter_id, name) VALUES ('20000000-0000-0000-0006-000000000010', '20000000-0000-0000-0005-000000000010', 'Composite Resins (Polymerization Shrinkage) Topic') ON CONFLICT DO NOTHING;
INSERT INTO concepts (id, topic_id, name) VALUES ('20000000-0000-0000-0007-000000000010', '20000000-0000-0000-0006-000000000010', 'Composite Resins (Polymerization Shrinkage) Concept') ON CONFLICT DO NOTHING;
INSERT INTO learning_objects (id, concept_id, object_type, content_payload) VALUES ('20000000-0000-0000-0008-000000000010', '20000000-0000-0000-0007-000000000010', 'TEXT', 'Composite Resins (Polymerization Shrinkage) details') ON CONFLICT DO NOTHING;

-- Chapter: Dental Ceramics (Feldspathic/Zirconia/E-max)
INSERT INTO units (id, subject_id, name) VALUES ('20000000-0000-0000-0004-000000000011', '20000000-0000-0000-0003-000000000003', 'Dental Ceramics (Feldspathic/Zirconia/E-max) Unit') ON CONFLICT DO NOTHING;
INSERT INTO chapters (id, unit_id, name) VALUES ('20000000-0000-0000-0005-000000000011', '20000000-0000-0000-0004-000000000011', 'Dental Ceramics (Feldspathic/Zirconia/E-max)') ON CONFLICT DO NOTHING;
INSERT INTO topics (id, chapter_id, name) VALUES ('20000000-0000-0000-0006-000000000011', '20000000-0000-0000-0005-000000000011', 'Dental Ceramics (Feldspathic/Zirconia/E-max) Topic') ON CONFLICT DO NOTHING;
INSERT INTO concepts (id, topic_id, name) VALUES ('20000000-0000-0000-0007-000000000011', '20000000-0000-0000-0006-000000000011', 'Dental Ceramics (Feldspathic/Zirconia/E-max) Concept') ON CONFLICT DO NOTHING;
INSERT INTO learning_objects (id, concept_id, object_type, content_payload) VALUES ('20000000-0000-0000-0008-000000000011', '20000000-0000-0000-0007-000000000011', 'TEXT', 'Dental Ceramics (Feldspathic/Zirconia/E-max) details') ON CONFLICT DO NOTHING;

-- Chapter: Impression Materials (Elastomers & Dimensional Accuracy)
INSERT INTO units (id, subject_id, name) VALUES ('20000000-0000-0000-0004-000000000012', '20000000-0000-0000-0003-000000000003', 'Impression Materials (Elastomers & Dimensional Accuracy) Unit') ON CONFLICT DO NOTHING;
INSERT INTO chapters (id, unit_id, name) VALUES ('20000000-0000-0000-0005-000000000012', '20000000-0000-0000-0004-000000000012', 'Impression Materials (Elastomers & Dimensional Accuracy)') ON CONFLICT DO NOTHING;
INSERT INTO topics (id, chapter_id, name) VALUES ('20000000-0000-0000-0006-000000000012', '20000000-0000-0000-0005-000000000012', 'Impression Materials (Elastomers & Dimensional Accuracy) Topic') ON CONFLICT DO NOTHING;
INSERT INTO concepts (id, topic_id, name) VALUES ('20000000-0000-0000-0007-000000000012', '20000000-0000-0000-0006-000000000012', 'Impression Materials (Elastomers & Dimensional Accuracy) Concept') ON CONFLICT DO NOTHING;
INSERT INTO learning_objects (id, concept_id, object_type, content_payload) VALUES ('20000000-0000-0000-0008-000000000012', '20000000-0000-0000-0007-000000000012', 'TEXT', 'Impression Materials (Elastomers & Dimensional Accuracy) details') ON CONFLICT DO NOTHING;

-- Chapter: Dental Cements (Luting Agents & Bond Strength)
INSERT INTO units (id, subject_id, name) VALUES ('20000000-0000-0000-0004-000000000013', '20000000-0000-0000-0003-000000000003', 'Dental Cements (Luting Agents & Bond Strength) Unit') ON CONFLICT DO NOTHING;
INSERT INTO chapters (id, unit_id, name) VALUES ('20000000-0000-0000-0005-000000000013', '20000000-0000-0000-0004-000000000013', 'Dental Cements (Luting Agents & Bond Strength)') ON CONFLICT DO NOTHING;
INSERT INTO topics (id, chapter_id, name) VALUES ('20000000-0000-0000-0006-000000000013', '20000000-0000-0000-0005-000000000013', 'Dental Cements (Luting Agents & Bond Strength) Topic') ON CONFLICT DO NOTHING;
INSERT INTO concepts (id, topic_id, name) VALUES ('20000000-0000-0000-0007-000000000013', '20000000-0000-0000-0006-000000000013', 'Dental Cements (Luting Agents & Bond Strength) Concept') ON CONFLICT DO NOTHING;
INSERT INTO learning_objects (id, concept_id, object_type, content_payload) VALUES ('20000000-0000-0000-0008-000000000013', '20000000-0000-0000-0007-000000000013', 'TEXT', 'Dental Cements (Luting Agents & Bond Strength) details') ON CONFLICT DO NOTHING;

