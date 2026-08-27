-- V50: Seed Physical Medicine & Rehabilitation (PMR-401) Full Curriculum

-- Ensure Subject: PMR-401 exists with correct title and category
INSERT INTO subjects (id, semester_id, code, title, category)
VALUES ('f1d7a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0f', 'c9d0e1f2-b3c4-5d6e-7f8a-9b0c1d2e3f4a', 'PMR-401', 'Physical Medicine & Rehabilitation', 'CLINICAL')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, category = EXCLUDED.category;

-- Unit 1: Stroke Neuro-Rehabilitation & Brunnstrom Motor Recovery
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa120001-0000-0000-0000-000000000001', 'f1d7a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0f', 'Stroke Neuro-Rehabilitation & Brunnstrom Motor Recovery', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa120002-0000-0000-0000-000000000001', 'fa120001-0000-0000-0000-000000000001', 'Brunnstrom Stages of Motor Recovery (Stages 1 to 6)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa120003-0000-0000-0000-000000000001', 'fa120002-0000-0000-0000-000000000001', 'Spasticity Assessment: Modified Ashworth Scale (MAS 0 to 4)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa120004-0000-0000-0000-000000000001', 'fa120003-0000-0000-0000-000000000001', 'Botulinum Toxin A, Baclofen & Constraint-Induced Movement Therapy', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa120005-0000-0000-0000-000000000001', 'fa120004-0000-0000-0000-000000000001', 'Stroke Motor Recovery Stages, Spasticity MAS Grading, Botulinum Toxin A Injections, ITB Pumps and CIMT', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa120006-0000-0000-0000-000000000001', 'fa120005-0000-0000-0000-000000000001', 'EXPLANATION', 1, 
'{"text": "### Stroke Neuro-Rehabilitation\n\nBrunnstrom Stages: 1 (Flaccid), 2 (Synergies emerge), 3 (Voluntary synergy control / Peak Spasticity), 4-5 (Deviating out of synergy), 6 (Isolated coordination). Spasticity grading: Modified Ashworth Scale (MAS 0-4). Focal spasticity is treated with Botulinum Toxin A (cleaves SNAP-25, blocking ACh release for 3-6 months). Severe generalized spasticity uses Intrathecal Baclofen (ITB) pump. Constraint-Induced Movement Therapy (CIMT) restrains the unaffected limb >=90% of waking hours for 2 weeks."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 2: Spinal Cord Injury ASIA Impairment Scale & Autonomic Dysreflexia
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa120001-0000-0000-0000-000000000002', 'f1d7a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0f', 'Spinal Cord Injury ASIA Impairment Scale & Autonomic Dysreflexia', 2)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa120002-0000-0000-0000-000000000002', 'fa120001-0000-0000-0000-000000000002', 'ASIA Impairment Scale (AIS Grades A to E) & Sacral Sparing', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa120003-0000-0000-0000-000000000002', 'fa120002-0000-0000-0000-000000000002', 'Autonomic Dysreflexia Resuscitation Protocol (T6 Lesions)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa120004-0000-0000-0000-000000000002', 'fa120003-0000-0000-0000-000000000002', 'Neurogenic Bladder: Clean Intermittent Catheterization (CIC)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa120005-0000-0000-0000-000000000002', 'fa120004-0000-0000-0000-000000000002', 'Spinal Cord Injury Classification, ASIA AIS A-E, Autonomic Dysreflexia Emergency Management and Neurogenic Bladder', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa120006-0000-0000-0000-000000000002', 'fa120005-0000-0000-0000-000000000002', 'EXPLANATION', 1, 
'{"text": "### Spinal Cord Injury & Autonomic Dysreflexia\n\nASIA Impairment Scale: Grade A (Complete, no S4-S5 sparing), Grade B (Sensory incomplete), Grade C (Motor incomplete, >50% key muscles <3/5), Grade D (Motor incomplete, >=50% key muscles >=3/5, >90% ambulation). Autonomic Dysreflexia occurs in T6 and above lesions triggered by noxious stimuli (distended bladder >85%). Emergency protocol: Sit patient 90 degrees upright, loosen clothing, unblock/drain bladder, and apply 2% Nitroglycerin paste if SBP >150 mmHg."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 3: Lower Limb Prosthetics, Functional K-Levels & Orthotics
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa120001-0000-0000-0000-000000000003', 'f1d7a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0f', 'Lower Limb Prosthetics, Functional K-Levels & Orthotics', 3)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa120002-0000-0000-0000-000000000003', 'fa120001-0000-0000-0000-000000000003', 'Amputation Levels (BKA, AKA, Syme) & Energy Expenditure', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa120003-0000-0000-0000-000000000003', 'fa120002-0000-0000-0000-000000000003', 'Medicare Functional K-Levels (K0 to K4) & Prosthetic Feet', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa120004-0000-0000-0000-000000000003', 'fa120003-0000-0000-0000-000000000003', 'Ankle-Foot Orthoses (PLS AFO vs Solid AFO) & KAFOs', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa120005-0000-0000-0000-000000000003', 'fa120004-0000-0000-0000-000000000003', 'Lower Limb Amputation Biomechanics, Functional K-Levels K0-K4, SACH vs Dynamic Carbon Feet, and AFO/KAFO Prescriptions', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa120006-0000-0000-0000-000000000003', 'fa120005-0000-0000-0000-000000000003', 'EXPLANATION', 1, 
'{"text": "### Prosthetics & Orthotics (P&O)\n\nAmputation levels: BKA (+10-40% energy cost) vs AKA (+60-100% energy cost). Medicare K-Levels: K0 (non-ambulator), K1 (household, SACH foot), K2 (limited community, flexible keel), K3 (unlimited community, dynamic energy-storing carbon foot & microprocessor knee), K4 (high-impact athlete). Orthotics: Posterior Leaf Spring (PLS) AFO for isolated foot drop with intact knee stability; Solid AFO for spasticity/genu recurvatum; KAFO for quadriceps weakness <3/5."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 4: Gait Cycle Biomechanics & Pathological Gaits
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa120001-0000-0000-0000-000000000004', 'f1d7a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0f', 'Gait Cycle Biomechanics & Pathological Gaits', 4)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa120002-0000-0000-0000-000000000004', 'fa120001-0000-0000-0000-000000000004', 'Normal Gait Cycle Subphases (Stance 60% vs Swing 40%)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa120003-0000-0000-0000-000000000004', 'fa120002-0000-0000-0000-000000000004', 'Trendelenburg Gait Biomechanics & Contralateral Cane Offloading', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa120004-0000-0000-0000-000000000004', 'fa120003-0000-0000-0000-000000000004', 'Steppage, Hemiplegic Circumduction, Parkinsonian & Antalgic Gaits', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa120005-0000-0000-0000-000000000004', 'fa120004-0000-0000-0000-000000000004', 'Gait Kinematics, Stance and Swing Subphases, Trendelenburg Mechanism, Steppage Foot Drop, Hemiplegic and Parkinsonian Gaits', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa120006-0000-0000-0000-000000000004', 'fa120005-0000-0000-0000-000000000004', 'EXPLANATION', 1, 
'{"text": "### Gait Cycle & Pathological Gaits\n\nNormal gait: 60% Stance (Initial contact, Loading response, Mid-stance, Terminal stance, Pre-swing) + 40% Swing (Initial swing, Mid-swing, Terminal swing). Double limb support is 20%. Trendelenburg gait (Superior Gluteal Nerve / Gluteus Medius weakness) causes contralateral pelvic drop; cane held in CONTRALATERAL hand reduces abductor muscle force by >50%. Steppage gait (Deep Peroneal Nerve) presents with high knee lift and foot slap. Hemiplegic circumduction gait is caused by spastic extensor synergy."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;
