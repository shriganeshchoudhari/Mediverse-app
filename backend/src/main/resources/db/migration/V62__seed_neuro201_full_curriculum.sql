-- V62: Seed Clinical Neuroanatomy & Localization Neuropathology (NEURO-201) Full Curriculum

-- Ensure Subject: NEURO-201 exists with correct title and category
INSERT INTO subjects (id, semester_id, code, title, category)
VALUES ('f1c0a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a20', 'c4d5e6f7-a8b9-0c1d-2e3f-4a5b6c7d8e9f', 'NEURO-201', 'Clinical Neuroanatomy & Localization Neuropathology', 'PRE_CLINICAL')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, category = EXCLUDED.category;

-- Unit 1: Brainstem Vascular Stroke Syndromes & Cranial Nerve Localizers
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa240001-0000-0000-0000-000000000001', 'f1c0a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a20', 'Brainstem Vascular Stroke Syndromes & Cranial Nerve Localizers', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa240002-0000-0000-0000-000000000001', 'fa240001-0000-0000-0000-000000000001', 'Lateral Medullary (Wallenberg) Syndrome & PICA Occlusion', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa240003-0000-0000-0000-000000000001', 'fa240002-0000-0000-0000-000000000001', 'Medial Medullary (Dejerine) Syndrome & ASA Pyramidal Infarction', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa240004-0000-0000-0000-000000000001', 'fa240003-0000-0000-0000-000000000001', 'Lateral Pontine AICA Facial Droop & Midbrain Weber Syndrome', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa240005-0000-0000-0000-000000000001', 'fa240004-0000-0000-0000-000000000001', 'Crossed Brainstem Deficits, Nucleus Ambiguus Dysphagia, Horner Syndrome, Tongue Deviation Toward Lesion, and Down-and-Out Oculomotor Palsy', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa240006-0000-0000-0000-000000000001', 'fa240005-0000-0000-0000-000000000001', 'EXPLANATION', 1, 
'{"text": "### Brainstem Stroke Syndromes\n\nWallenberg (PICA): Dorsolateral medulla -> Nucleus ambiguus (CN IX, X, XI: dysphagia, hoarseness, loss of gag), Vestibular (vertigo/nystagmus), Spinal trigeminal (ipsilateral facial pain/temp loss), Spinothalamic (contralateral body pain/temp loss), Descending sympathetics (ipsilateral Horner), ICP (ataxia). Corticospinal motor tract is SPARED! Dejerine (ASA): Paramedian medulla -> Corticospinal (contralateral spastic hemiparesis), Medial lemniscus (contralateral proprioception loss), CN XII (ipsilateral tongue deviation TOWARD lesion). AICA (Lateral Pontine): Facial motor nucleus (ipsilateral facial droop - Facial droop = AICA), CN VIII (hearing loss). Weber (PCA): CN III (ipsilateral down-and-out eye, ptosis, mydriasis) + Cerebral peduncle (contralateral spastic hemiparesis)."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 2: Spinal Cord Syndromes & Motor Neuron Tract Somatotopy
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa240001-0000-0000-0000-000000000002', 'f1c0a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a20', 'Spinal Cord Syndromes & Motor Neuron Tract Somatotopy', 2)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa240002-0000-0000-0000-000000000002', 'fa240001-0000-0000-0000-000000000002', 'Brown-Séquard Hemicord Transection Dissociated Loss', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa240003-0000-0000-0000-000000000002', 'fa240002-0000-0000-0000-000000000002', 'Anterior Spinal Artery Infarction (Preserved Dorsal Columns)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa240004-0000-0000-0000-000000000002', 'fa240003-0000-0000-0000-000000000002', 'Syringomyelia Cape-like Loss & Subacute Combined Degeneration B12', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa240005-0000-0000-0000-000000000002', 'fa240004-0000-0000-0000-000000000002', 'Spinal Hemicord Hemisection, Anterior White Commissure Cavitation, Dissociated Sensory Loss, and Vitamin B12 Demyelinating Myelopathy', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa240006-0000-0000-0000-000000000002', 'fa240005-0000-0000-0000-000000000002', 'EXPLANATION', 1, 
'{"text": "### Spinal Cord Syndromes\n\nBrown-Séquard: Ipsilateral spastic paralysis below lesion (corticospinal), ipsilateral loss of vibration/proprioception below lesion (dorsal columns), contralateral loss of pain/temperature 1-2 levels below lesion (spinothalamic). ASA Infarction: Bilateral spastic paraplegia + bilateral pain/temp loss + sphincter loss; POSTERIOR DORSAL COLUMNS PRESERVED! Syringomyelia (Chiari I): Central syrinx compresses Anterior White Commissure -> bilateral ''cape-like'' loss of pain/temp over shoulders/arms with preserved touch/proprioception. Subacute Combined Degeneration (B12): Demyelination of Dorsal Columns (sensory ataxia, positive Romberg) + Lateral Corticospinal tracts (bilateral spasticity, hyperreflexia, positive Babinski). Tabes Dorsalis: Argyll Robertson pupils + sensory ataxia."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 3: Higher Cortical Syndromes, Aphasias & Visual Field Deficits
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa240001-0000-0000-0000-000000000003', 'f1c0a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a20', 'Higher Cortical Syndromes, Aphasias & Visual Field Deficits', 3)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa240002-0000-0000-0000-000000000003', 'fa240001-0000-0000-0000-000000000003', 'Aphasia Classifications: Broca, Wernicke & Conduction', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa240003-0000-0000-0000-000000000003', 'fa240002-0000-0000-0000-000000000003', 'Gerstmann Syndrome (Dominant Angular Gyrus) & Balint Syndrome', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa240004-0000-0000-0000-000000000003', 'fa240003-0000-0000-0000-000000000003', 'Visual Field Pathways: Chiasm, Meyer Loop & PCA Macular Sparing', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa240005-0000-0000-0000-000000000003', 'fa240004-0000-0000-0000-000000000003', 'Fluency and Comprehension Testing, Arcuate Fasciculus Repetition Deficits, Angular Gyrus Tetrad, and Visual Radiation Localizers', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa240006-0000-0000-0000-000000000003', 'fa240005-0000-0000-0000-000000000003', 'EXPLANATION', 1, 
'{"text": "### Higher Cortical Syndromes & Visual Pathways\n\nBroca Aphasia (Left Inferior Frontal Brodmann 44/45): Non-fluent, effortful telegraphic speech, intact comprehension, impaired repetition. Wernicke Aphasia (Left Superior Temporal Brodmann 22): Fluent ''word salad'', severely impaired comprehension, impaired repetition, right upper quadrantanopia. Conduction Aphasia (Arcuate Fasciculus): Fluent speech, intact comprehension, SEVERELY IMPAIRED REPETITION. Transcortical Aphasias: Repetition is preserved! Gerstmann Syndrome (Left Angular Gyrus): 1. Agraphia, 2. Acalculia, 3. Finger Agnosia, 4. Left-Right Disorientation. Visual Field Localizers: Optic chiasm -> Bitemporal hemianopia (pituitary adenoma); Meyer Loop (temporal) -> Contralateral upper quadrantanopia (Pie in the sky); Dorsal Baum (parietal) -> Contralateral lower quadrantanopia (Pie on the floor); Occipital cortex (PCA infarct) -> Contralateral homonymous hemianopia WITH MACULAR SPARING."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 4: Cranial Nerve Palsies, Cavernous Sinus & Neuromuscular Junction
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa240001-0000-0000-0000-000000000004', 'f1c0a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a20', 'Cranial Nerve Palsies, Cavernous Sinus & Neuromuscular Junction', 4)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa240002-0000-0000-0000-000000000004', 'fa240001-0000-0000-0000-000000000004', 'Cavernous Sinus Syndrome & Skull Base Foramina', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa240003-0000-0000-0000-000000000004', 'fa240002-0000-0000-0000-000000000004', 'Internuclear Ophthalmoplegia (MLF Demyelination in MS)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa240004-0000-0000-0000-000000000004', 'fa240003-0000-0000-0000-000000000004', 'Myasthenia Gravis vs Lambert-Eaton Myasthenic Syndrome', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa240005-0000-0000-0000-000000000004', 'fa240004-0000-0000-0000-000000000004', 'Cavernous Sinus Neurovascular Contents, Conjugate Lateral Gaze MLF Demyelination, Post-Synaptic Anti-AChR Fatigue, and Pre-Synaptic Anti-VGCC SCLC Pathology', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa240006-0000-0000-0000-000000000004', 'fa240005-0000-0000-0000-000000000004', 'EXPLANATION', 1, 
'{"text": "### Cranial Nerves, Cavernous Sinus & NMJ\n\nCavernous Sinus: CN III, IV, V1, V2 in lateral wall; CN VI and internal carotid sympathetic plexus inside lumen -> total ophthalmoplegia, proptosis, chemosis, forehead/cheek numbness. Internuclear Ophthalmoplegia (INO): Medial Longitudinal Fasciculus (MLF) lesion -> on conjugate lateral gaze, ipsilateral eye fails to adduct; contralateral abducting eye displays horizontal nystagmus; convergence remains INTACT (hallmark of MS). Myasthenia Gravis (MG): Autoantibodies against post-synaptic nicotinic AChR -> fatiguable ptosis, diplopia, proximal weakness that WORSENS with repetitive use/end of day, normal DTRs, thymoma -> Pyridostigmine. Lambert-Eaton (LEMS): Autoantibodies against pre-synaptic P/Q-type VGCC -> proximal weakness and hyporeflexia that IMPROVES with repetitive exercise, dry mouth, Small Cell Lung Carcinoma (SCLC) -> Amifampridine."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;
