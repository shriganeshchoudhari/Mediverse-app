-- V70: Seed Clinical Neurology & Stroke Localization (NEURO-301) Full Curriculum

-- Ensure Subject: NEURO-301 exists with correct title and category
INSERT INTO subjects (id, semester_id, code, title, category)
VALUES ('f1d0a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a28', 'c7d8e9f0-b1c2-3d4e-5f6a-7b8c9d0e1f2a', 'NEURO-301', 'Clinical Neurology & Stroke Localization', 'CLINICAL')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, category = EXCLUDED.category;

-- Unit 1: Acute Ischemic Stroke Syndromes & Vascular Neuro-Localization
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa320001-0000-0000-0000-000000000001', 'f1d0a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a28', 'Acute Ischemic Stroke Syndromes & Vascular Neuro-Localization', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa320002-0000-0000-0000-000000000001', 'fa320001-0000-0000-0000-000000000001', 'MCA vs ACA vs PCA (Macular Sparing & Aphasia Localization)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa320003-0000-0000-0000-000000000001', 'fa320002-0000-0000-0000-000000000001', 'Lateral Medullary (Wallenberg PICA) Nucleus Ambiguus Deficits', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa320004-0000-0000-0000-000000000001', 'fa320003-0000-0000-0000-000000000001', 'Lateral Pontine (AICA CN VII) vs Weber Midbrain CN III Palsy', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa320005-0000-0000-0000-000000000001', 'fa320004-0000-0000-0000-000000000001', 'Homunculus Somatotopic Distributions, Inferior Frontal Arcuate Conduction Circuits, Calcarine Foveal Collateral Perfusion, and Medullary Nucleus Ambiguus Innervations', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa320006-0000-0000-0000-000000000001', 'fa320005-0000-0000-0000-000000000001', 'EXPLANATION', 1, 
'{"text": "### Stroke Localization\n\nMCA: Contralateral face/arm > leg hemiplegia; Dominant hemisphere -> Broca (motor non-fluent) vs Wernicke (sensory fluent) aphasia; Non-dominant -> Hemispatial neglect. ACA: Contralateral leg > arm weakness, urinary incontinence, grasp reflex. PCA: Contralateral homonymous hemianopia with MACULAR SPARING (dual MCA supply), alexia without agraphia. Lateral Medullary (Wallenberg - PICA): Nucleus ambiguus (dysphagia, hoarseness, absent gag), ipsilateral Horner, ataxia, crossed sensory loss, MOTOR POWER 100% SPARED. Lateral Pontine (AICA): CN VII facial droop, hearing loss. Weber (Midbrain): CN III palsy + contralateral hemiplegia."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 2: Intracranial Hemorrhages & Traumatic Brain Injury
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa320001-0000-0000-0000-000000000002', 'f1d0a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a28', 'Intracranial Hemorrhages & Traumatic Brain Injury', 2)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa320002-0000-0000-0000-000000000002', 'fa320001-0000-0000-0000-000000000002', 'Epidural Hemorrhage (Middle Meningeal Artery & Lucid Interval)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa320003-0000-0000-0000-000000000002', 'fa320002-0000-0000-0000-000000000002', 'Subdural Hemorrhage (Bridging Cortical Veins & Suture Crossing)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa320004-0000-0000-0000-000000000002', 'fa320003-0000-0000-0000-000000000002', 'Subarachnoid Hemorrhage (Berry Aneurysm, Xanthochromia & Nimodipine)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa320005-0000-0000-0000-000000000002', 'fa320004-0000-0000-0000-000000000002', 'Pterion Fractures and Dural Periosteal Boundaries, Cortical Bridging Shear Strains, Saccular Aneurysm Flow Hemodynamics, and Delayed Spasmogenic Calcium Channel Blockades', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa320006-0000-0000-0000-000000000002', 'fa320005-0000-0000-0000-000000000002', 'EXPLANATION', 1, 
'{"text": "### Intracranial Hemorrhages\n\nEpidural Hemorrhage (EDH): Pterion trauma -> Middle Meningeal Artery tear -> Lucid Interval -> Uncal herniation (ipsilateral blown pupil). CT: Biconvex lenticular hyperdensity that DOES NOT cross suture lines. Subdural Hemorrhage (SDH): Bridging cortical veins tear (elderly/alcoholics with brain atrophy). CT: Crescent-shaped concave collection that CAN cross suture lines. Subarachnoid Hemorrhage (SAH): Saccular (berry) aneurysm rupture (ACom) -> \"worst headache of my life\" (thunderclap). LP: Xanthochromia (>12h). Prevent vasospasm with oral Nimodipine (Days 3-14)."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 3: Demyelinating, Neuromuscular & Movement Disorders
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa320001-0000-0000-0000-000000000003', 'f1d0a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a28', 'Demyelinating, Neuromuscular & Movement Disorders', 3)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa320002-0000-0000-0000-000000000003', 'fa320001-0000-0000-0000-000000000003', 'Multiple Sclerosis (MLF Internuclear Ophthalmoplegia & Oligoclonal Bands)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa320003-0000-0000-0000-000000000003', 'fa320002-0000-0000-0000-000000000003', 'Guillain-Barré Syndrome (Albuminocytologic Dissociation & IVIG)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa320004-0000-0000-0000-000000000003', 'fa320003-0000-0000-0000-000000000003', 'Myasthenia Gravis vs Lambert-Eaton (Fatigability vs Post-Exercise Facilitation)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa320005-0000-0000-0000-000000000003', 'fa320004-0000-0000-0000-000000000003', 'Medial Longitudinal Fasciculus Demyelination, Peripheral Myelin Ganglioside Mimicries, Acetylcholine Safety Factors, and Striatal Medium Spiny GABA Degenerations', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa320006-0000-0000-0000-000000000003', 'fa320005-0000-0000-0000-000000000003', 'EXPLANATION', 1, 
'{"text": "### Demyelinating & Movement Disorders\n\nMultiple Sclerosis (MS): CNS oligodendrocyte demyelination, Optic Neuritis, Internuclear Ophthalmoplegia (MLF lesion: impaired ipsilateral adduction with abducting nystagmus), CSF Oligoclonal IgG bands -> IV Methylprednisolone. Guillain-Barré Syndrome (GBS): Campylobacter mimicry -> Ascending flaccid paralysis + areflexia; CSF Albuminocytologic Dissociation (high protein, normal WBC) -> IVIG / Plasmapheresis. Myasthenia Gravis: Postsynaptic anti-AChR (fatigable weakness worsens with use, thymoma) -> Pyridostigmine. Lambert-Eaton (LEMS): Presynaptic anti-VGCC (Small Cell Lung Cancer, strength IMPROVES with use). Huntington: Caudate atrophy, CAG repeats, loss of GABA."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 4: Spinal Cord Syndromes & Motor Neuron Diseases
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa320001-0000-0000-0000-000000000004', 'f1d0a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a28', 'Spinal Cord Syndromes & Motor Neuron Diseases', 4)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa320002-0000-0000-0000-000000000004', 'fa320001-0000-0000-0000-000000000004', 'Brown-Séquard vs Anterior Cord Infarct (Dorsal Columns Spared)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa320003-0000-0000-0000-000000000004', 'fa320002-0000-0000-0000-000000000004', 'Central Cord Syringomyelia (Bilateral Cape-Like Pain Loss & Chiari I)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa320004-0000-0000-0000-000000000004', 'fa320003-0000-0000-0000-000000000004', 'Amyotrophic Lateral Sclerosis ALS (Combined UMN/LMN with Riluzole)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa320005-0000-0000-0000-000000000004', 'fa320004-0000-0000-0000-000000000004', 'Decussating Commissural Spinothalamic Topography, Sulcal Anterior Artery Perfusion, Corticospinal Motor Betz Degeneration, and Excitotoxic Glutamatergic Riluzole Blocks', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa320006-0000-0000-0000-000000000004', 'fa320005-0000-0000-0000-000000000004', 'EXPLANATION', 1, 
'{"text": "### Spinal Cord Syndromes & ALS\n\nBrown-Séquard: Ipsilateral UMN weakness and dorsal column (vibration/proprioception) loss, contralateral spinothalamic (pain/temp) loss. Anterior Spinal Artery (ASA) Infarction: Bilateral motor paralysis and pain/temp loss, DORSAL COLUMNS COMPLETELY SPARED (vibration/position 100% normal). Central Cord Syringomyelia: Anterior white commissure disruption -> Bilateral cape-like loss of pain/temp over shoulders/arms (Chiari I malformation). ALS: Progressive degeneration of Upper (hyperreflexia, Babinski) AND Lower (fasciculations, muscle atrophy) motor neurons with NO sensory or sphincter loss -> Riluzole."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;
