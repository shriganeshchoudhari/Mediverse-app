-- =============================================================================
-- Migration: V118__seed_bds_year3_curriculum.sql
-- Description: Seeds Year 3 (Semesters 5-6)
-- =============================================================================

-- Subject: BDS-CD (Conservative Dentistry & Endodontics)
INSERT INTO subjects (id, semester_id, code, title, category) VALUES ('20000000-0000-0000-0003-000000000006', '20000000-0000-0000-0002-000000000005', 'BDS-CD', 'Conservative Dentistry & Endodontics', 'BASIC_SCIENCE') ON CONFLICT (id) DO NOTHING;

-- Chapter: Root Canal Anatomy (Canal Configurations & Vertucci Classification)
INSERT INTO units (id, subject_id, title, sort_order) VALUES ('20000000-0000-0000-0004-000000000021', '20000000-0000-0000-0003-000000000006', 'Root Canal Anatomy (Canal Configurations & Vertucci Classification) Unit', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO chapters (id, unit_id, title, sort_order) VALUES ('20000000-0000-0000-0005-000000000021', '20000000-0000-0000-0004-000000000021', 'Root Canal Anatomy (Canal Configurations & Vertucci Classification)', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO topics (id, chapter_id, title, sort_order) VALUES ('20000000-0000-0000-0006-000000000021', '20000000-0000-0000-0005-000000000021', 'Root Canal Anatomy (Canal Configurations & Vertucci Classification) Topic', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO concepts (id, topic_id, title, sort_order) VALUES ('20000000-0000-0000-0007-000000000021', '20000000-0000-0000-0006-000000000021', 'Root Canal Anatomy (Canal Configurations & Vertucci Classification) Concept', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO learning_objects (id, concept_id, object_type, content_payload, sort_order) VALUES ('20000000-0000-0000-0008-000000000021', '20000000-0000-0000-0007-000000000021', 'TEXT', 'Root Canal Anatomy (Canal Configurations & Vertucci Classification) details', 1) ON CONFLICT (id) DO NOTHING;

-- Chapter: Biomechanical Preparation (Working Length & Rotary Instrumentation)
INSERT INTO units (id, subject_id, title, sort_order) VALUES ('20000000-0000-0000-0004-000000000022', '20000000-0000-0000-0003-000000000006', 'Biomechanical Preparation (Working Length & Rotary Instrumentation) Unit', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO chapters (id, unit_id, title, sort_order) VALUES ('20000000-0000-0000-0005-000000000022', '20000000-0000-0000-0004-000000000022', 'Biomechanical Preparation (Working Length & Rotary Instrumentation)', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO topics (id, chapter_id, title, sort_order) VALUES ('20000000-0000-0000-0006-000000000022', '20000000-0000-0000-0005-000000000022', 'Biomechanical Preparation (Working Length & Rotary Instrumentation) Topic', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO concepts (id, topic_id, title, sort_order) VALUES ('20000000-0000-0000-0007-000000000022', '20000000-0000-0000-0006-000000000022', 'Biomechanical Preparation (Working Length & Rotary Instrumentation) Concept', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO learning_objects (id, concept_id, object_type, content_payload, sort_order) VALUES ('20000000-0000-0000-0008-000000000022', '20000000-0000-0000-0007-000000000022', 'TEXT', 'Biomechanical Preparation (Working Length & Rotary Instrumentation) details', 1) ON CONFLICT (id) DO NOTHING;

-- Chapter: Obturation (Cold Lateral Condensation & Warm Vertical Compaction)
INSERT INTO units (id, subject_id, title, sort_order) VALUES ('20000000-0000-0000-0004-000000000023', '20000000-0000-0000-0003-000000000006', 'Obturation (Cold Lateral Condensation & Warm Vertical Compaction) Unit', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO chapters (id, unit_id, title, sort_order) VALUES ('20000000-0000-0000-0005-000000000023', '20000000-0000-0000-0004-000000000023', 'Obturation (Cold Lateral Condensation & Warm Vertical Compaction)', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO topics (id, chapter_id, title, sort_order) VALUES ('20000000-0000-0000-0006-000000000023', '20000000-0000-0000-0005-000000000023', 'Obturation (Cold Lateral Condensation & Warm Vertical Compaction) Topic', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO concepts (id, topic_id, title, sort_order) VALUES ('20000000-0000-0000-0007-000000000023', '20000000-0000-0000-0006-000000000023', 'Obturation (Cold Lateral Condensation & Warm Vertical Compaction) Concept', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO learning_objects (id, concept_id, object_type, content_payload, sort_order) VALUES ('20000000-0000-0000-0008-000000000023', '20000000-0000-0000-0007-000000000023', 'TEXT', 'Obturation (Cold Lateral Condensation & Warm Vertical Compaction) details', 1) ON CONFLICT (id) DO NOTHING;


-- Subject: BDS-OS (Oral & Maxillofacial Surgery)
INSERT INTO subjects (id, semester_id, code, title, category) VALUES ('20000000-0000-0000-0003-000000000007', '20000000-0000-0000-0002-000000000006', 'BDS-OS', 'Oral & Maxillofacial Surgery', 'BASIC_SCIENCE') ON CONFLICT (id) DO NOTHING;

-- Chapter: Local Anaesthesia (IAN Block, Buccal & Lingual Infiltration)
INSERT INTO units (id, subject_id, title, sort_order) VALUES ('20000000-0000-0000-0004-000000000024', '20000000-0000-0000-0003-000000000007', 'Local Anaesthesia (IAN Block, Buccal & Lingual Infiltration) Unit', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO chapters (id, unit_id, title, sort_order) VALUES ('20000000-0000-0000-0005-000000000024', '20000000-0000-0000-0004-000000000024', 'Local Anaesthesia (IAN Block, Buccal & Lingual Infiltration)', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO topics (id, chapter_id, title, sort_order) VALUES ('20000000-0000-0000-0006-000000000024', '20000000-0000-0000-0005-000000000024', 'Local Anaesthesia (IAN Block, Buccal & Lingual Infiltration) Topic', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO concepts (id, topic_id, title, sort_order) VALUES ('20000000-0000-0000-0007-000000000024', '20000000-0000-0000-0006-000000000024', 'Local Anaesthesia (IAN Block, Buccal & Lingual Infiltration) Concept', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO learning_objects (id, concept_id, object_type, content_payload, sort_order) VALUES ('20000000-0000-0000-0008-000000000024', '20000000-0000-0000-0007-000000000024', 'TEXT', 'Local Anaesthesia (IAN Block, Buccal & Lingual Infiltration) details', 1) ON CONFLICT (id) DO NOTHING;

-- Chapter: Impacted Third Molars (Classification & Surgical Protocol - Winter/Pell-Gregory)
INSERT INTO units (id, subject_id, title, sort_order) VALUES ('20000000-0000-0000-0004-000000000025', '20000000-0000-0000-0003-000000000007', 'Impacted Third Molars (Classification & Surgical Protocol - Winter/Pell-Gregory) Unit', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO chapters (id, unit_id, title, sort_order) VALUES ('20000000-0000-0000-0005-000000000025', '20000000-0000-0000-0004-000000000025', 'Impacted Third Molars (Classification & Surgical Protocol - Winter/Pell-Gregory)', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO topics (id, chapter_id, title, sort_order) VALUES ('20000000-0000-0000-0006-000000000025', '20000000-0000-0000-0005-000000000025', 'Impacted Third Molars (Classification & Surgical Protocol - Winter/Pell-Gregory) Topic', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO concepts (id, topic_id, title, sort_order) VALUES ('20000000-0000-0000-0007-000000000025', '20000000-0000-0000-0006-000000000025', 'Impacted Third Molars (Classification & Surgical Protocol - Winter/Pell-Gregory) Concept', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO learning_objects (id, concept_id, object_type, content_payload, sort_order) VALUES ('20000000-0000-0000-0008-000000000025', '20000000-0000-0000-0007-000000000025', 'TEXT', 'Impacted Third Molars (Classification & Surgical Protocol - Winter/Pell-Gregory) details', 1) ON CONFLICT (id) DO NOTHING;

-- Chapter: Orthognathic Surgery (Le Fort Osteotomies & BSSO)
INSERT INTO units (id, subject_id, title, sort_order) VALUES ('20000000-0000-0000-0004-000000000026', '20000000-0000-0000-0003-000000000007', 'Orthognathic Surgery (Le Fort Osteotomies & BSSO) Unit', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO chapters (id, unit_id, title, sort_order) VALUES ('20000000-0000-0000-0005-000000000026', '20000000-0000-0000-0004-000000000026', 'Orthognathic Surgery (Le Fort Osteotomies & BSSO)', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO topics (id, chapter_id, title, sort_order) VALUES ('20000000-0000-0000-0006-000000000026', '20000000-0000-0000-0005-000000000026', 'Orthognathic Surgery (Le Fort Osteotomies & BSSO) Topic', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO concepts (id, topic_id, title, sort_order) VALUES ('20000000-0000-0000-0007-000000000026', '20000000-0000-0000-0006-000000000026', 'Orthognathic Surgery (Le Fort Osteotomies & BSSO) Concept', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO learning_objects (id, concept_id, object_type, content_payload, sort_order) VALUES ('20000000-0000-0000-0008-000000000026', '20000000-0000-0000-0007-000000000026', 'TEXT', 'Orthognathic Surgery (Le Fort Osteotomies & BSSO) details', 1) ON CONFLICT (id) DO NOTHING;

