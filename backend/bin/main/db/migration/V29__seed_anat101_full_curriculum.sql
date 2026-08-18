-- V29: Seed Human Anatomy & Histology (ANAT-101) Full Curriculum

-- Ensure Subject: ANAT-101 exists with correct title and category
INSERT INTO subjects (id, semester_id, code, title, category)
VALUES ('d4e5f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a', 'c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f', 'ANAT-101', 'Human Anatomy & Histology', 'PRE_CLINICAL')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, category = EXCLUDED.category;

-- Unit 1: Upper Limb & Brachial Plexus
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('a1010001-0000-0000-0000-000000000001', 'd4e5f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a', 'Upper Limb & Brachial Plexus', 1)
ON CONFLICT DO NOTHING;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('a1010002-0000-0000-0000-000000000001', 'a1010001-0000-0000-0000-000000000001', 'Brachial Plexus & Nerve Injuries', 1)
ON CONFLICT DO NOTHING;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('a1010003-0000-0000-0000-000000000001', 'a1010002-0000-0000-0000-000000000001', 'Roots to Terminal Branches', 1)
ON CONFLICT DO NOTHING;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('a1010004-0000-0000-0000-000000000001', 'a1010003-0000-0000-0000-000000000001', 'Erb Palsy, Klumpke & Radial Nerve Palsy', 1)
ON CONFLICT DO NOTHING;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('a1010005-0000-0000-0000-000000000001', 'a1010004-0000-0000-0000-000000000001', 'Brachial Plexus Architecture and Clinical Palsies', 'PUBLISHED', 1)
ON CONFLICT DO NOTHING;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('a1010006-0000-0000-0000-000000000001', 'a1010005-0000-0000-0000-000000000001', 'EXPLANATION', 1, 
'{"text": "### Upper Limb & Brachial Plexus Dissection\n\nThe brachial plexus (C5-T1) supplies motor and sensory innervation to the upper limb. Traction on the upper trunk (C5-C6) produces Erb-Duchenne palsy (waiter''s tip), while lower trunk (C8-T1) injury produces Klumpke claw hand."}'::jsonb)
ON CONFLICT DO NOTHING;

-- Unit 2: Lower Limb & Locomotor Anatomy
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('a1010001-0000-0000-0000-000000000002', 'd4e5f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a', 'Lower Limb & Joint Mechanics', 2)
ON CONFLICT DO NOTHING;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('a1010002-0000-0000-0000-000000000002', 'a1010001-0000-0000-0000-000000000002', 'Femoral Triangle & Knee Ligament Mechanics', 1)
ON CONFLICT DO NOTHING;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('a1010003-0000-0000-0000-000000000002', 'a1010002-0000-0000-0000-000000000002', 'NAVEL Anatomy and Cruciate Ligaments', 1)
ON CONFLICT DO NOTHING;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('a1010004-0000-0000-0000-000000000002', 'a1010003-0000-0000-0000-000000000002', 'ACL/PCL Pathology & Trendelenburg Gait', 1)
ON CONFLICT DO NOTHING;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('a1010005-0000-0000-0000-000000000002', 'a1010004-0000-0000-0000-000000000002', 'Femoral Triangle and Knee Biomechanics', 'PUBLISHED', 1)
ON CONFLICT DO NOTHING;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('a1010006-0000-0000-0000-000000000002', 'a1010005-0000-0000-0000-000000000002', 'EXPLANATION', 1, 
'{"text": "### Lower Limb & Knee Biomechanics\n\nThe femoral triangle contains the Femoral Nerve, Artery, Vein, Empty space, and Lymphatics (NAVEL). ACL tears occur on pivoting deceleration (Lachman test positive). Fibular neck fracture causes foot drop (common peroneal nerve)."}'::jsonb)
ON CONFLICT DO NOTHING;

-- Unit 3: Thorax & Mediastinal Compartments
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('a1010001-0000-0000-0000-000000000003', 'd4e5f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a', 'Thorax & Mediastinum', 3)
ON CONFLICT DO NOTHING;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('a1010002-0000-0000-0000-000000000003', 'a1010001-0000-0000-0000-000000000003', 'Mediastinal Divisions & Coronary Tree', 1)
ON CONFLICT DO NOTHING;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('a1010003-0000-0000-0000-000000000003', 'a1010002-0000-0000-0000-000000000003', 'Sternal Angle Landmarks and Coronary Distribution', 1)
ON CONFLICT DO NOTHING;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('a1010004-0000-0000-0000-000000000003', 'a1010003-0000-0000-0000-000000000003', 'LAD Occlusion & Mediastinal Tumors', 1)
ON CONFLICT DO NOTHING;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('a1010005-0000-0000-0000-000000000003', 'a1010004-0000-0000-0000-000000000003', 'Mediastinal Compartments and Coronary Circulation', 'PUBLISHED', 1)
ON CONFLICT DO NOTHING;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('a1010006-0000-0000-0000-000000000003', 'a1010005-0000-0000-0000-000000000003', 'EXPLANATION', 1, 
'{"text": "### Thorax & Mediastinum\n\nThe sternal angle (T4/T5) marks the bifurcation of the trachea and aortic arch level. Anterior mediastinal masses follow the 4 T''s: Thymoma, Teratoma, Thyroid goiter, and Terrible lymphoma. LAD occlusion causes anterior STEMI."}'::jsonb)
ON CONFLICT DO NOTHING;

-- Unit 4: Abdomen, Pelvis & Inguinal Canal
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('a1010001-0000-0000-0000-000000000004', 'd4e5f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a', 'Abdomen, Pelvis & Inguinal Canal', 4)
ON CONFLICT DO NOTHING;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('a1010002-0000-0000-0000-000000000004', 'a1010001-0000-0000-0000-000000000004', 'Inguinal Anatomy & Peritoneal Recesses', 1)
ON CONFLICT DO NOTHING;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('a1010003-0000-0000-0000-000000000004', 'a1010002-0000-0000-0000-000000000004', 'Direct vs Indirect Hernias', 1)
ON CONFLICT DO NOTHING;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('a1010004-0000-0000-0000-000000000004', 'a1010003-0000-0000-0000-000000000004', 'Hesselbach Triangle & Celiac/SMA Branches', 1)
ON CONFLICT DO NOTHING;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('a1010005-0000-0000-0000-000000000004', 'a1010004-0000-0000-0000-000000000004', 'Inguinal Canal and Gastrointestinal Watersheds', 'PUBLISHED', 1)
ON CONFLICT DO NOTHING;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('a1010006-0000-0000-0000-000000000004', 'a1010005-0000-0000-0000-000000000004', 'EXPLANATION', 1, 
'{"text": "### Inguinal Canal & Abdominal Watersheds\n\nIndirect inguinal hernias enter the deep ring lateral to the inferior epigastric vessels. Direct hernias pass medial to inferior epigastric vessels through Hesselbach''s triangle. Griffiths point at the splenic flexure is a major ischemic watershed."}'::jsonb)
ON CONFLICT DO NOTHING;

-- Unit 5: Head, Neck & Cranial Nerves
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('a1010001-0000-0000-0000-000000000005', 'd4e5f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a', 'Head, Neck & Cranial Nerves', 5)
ON CONFLICT DO NOTHING;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('a1010002-0000-0000-0000-000000000005', 'a1010001-0000-0000-0000-000000000005', 'Skull Base Foramina & Cavernous Sinus', 1)
ON CONFLICT DO NOTHING;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('a1010003-0000-0000-0000-000000000005', 'a1010002-0000-0000-0000-000000000005', 'Cranial Nerve Exit Pathways', 1)
ON CONFLICT DO NOTHING;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('a1010004-0000-0000-0000-000000000005', 'a1010003-0000-0000-0000-000000000005', 'Cavernous Sinus Thrombosis & Berry Aneurysms', 1)
ON CONFLICT DO NOTHING;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('a1010005-0000-0000-0000-000000000005', 'a1010004-0000-0000-0000-000000000005', 'Cranial Nerve Foramina and Cavernous Sinus Anatomy', 'PUBLISHED', 1)
ON CONFLICT DO NOTHING;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('a1010006-0000-0000-0000-000000000005', 'a1010005-0000-0000-0000-000000000005', 'EXPLANATION', 1, 
'{"text": "### Head, Neck & Cranial Nerves\n\nThe cavernous sinus houses CN III, IV, V1, V2 in its lateral wall and CN VI + Internal Carotid Artery centrally. Rupture of saccular Berry aneurysms in the Circle of Willis (AComA) causes subarachnoid hemorrhage."}'::jsonb)
ON CONFLICT DO NOTHING;

-- Unit 6: General & Systemic Histology
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('a1010001-0000-0000-0000-000000000006', 'd4e5f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a', 'General & Systemic Histology', 6)
ON CONFLICT DO NOTHING;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('a1010002-0000-0000-0000-000000000006', 'a1010001-0000-0000-0000-000000000006', 'Epithelia, ECM Collagen & Osteon Systems', 1)
ON CONFLICT DO NOTHING;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('a1010003-0000-0000-0000-000000000006', 'a1010002-0000-0000-0000-000000000006', 'Epithelial Junctions and Collagen Types', 1)
ON CONFLICT DO NOTHING;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('a1010004-0000-0000-0000-000000000006', 'a1010003-0000-0000-0000-000000000006', 'Haversian Remodeling & Special Stains', 1)
ON CONFLICT DO NOTHING;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('a1010005-0000-0000-0000-000000000006', 'a1010004-0000-0000-0000-000000000006', 'Microscopic Anatomy and Histochemical Staining', 'PUBLISHED', 1)
ON CONFLICT DO NOTHING;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('a1010006-0000-0000-0000-000000000006', 'a1010005-0000-0000-0000-000000000006', 'EXPLANATION', 1, 
'{"text": "### General & Systemic Histology\n\nType I collagen provides tensile strength in bone and tendon (mutated in osteogenesis imperfecta). Transitional epithelium (urothelium) features apical umbrella cells with uroplakins. Masson trichrome stains collagen blue, while PAS stains glycogen and basement membranes magenta."}'::jsonb)
ON CONFLICT DO NOTHING;
