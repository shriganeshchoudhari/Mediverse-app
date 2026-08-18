-- 1. Seed Semester 4 under Year 2 (ID: 'b3c4d5e6-f7a8-9b0c-1d2e-3f4a5b6c7d8e')
INSERT INTO semesters (id, year_id, semester_number)
VALUES ('c6d7e8f9-b0c1-2d3e-4f5a-6b7c8d9e0f1a', 'b3c4d5e6-f7a8-9b0c-1d2e-3f4a5b6c7d8e', 4)
ON CONFLICT DO NOTHING;

-- 2. Seed Subjects for Semester 4
-- Pathology II
INSERT INTO subjects (id, semester_id, title, code, category)
VALUES ('e5a1b2c3-d4e5-6f7a-8b9c-0d1e2f3a4b5c', 'c6d7e8f9-b0c1-2d3e-4f5a-6b7c8d9e0f1a', 'Pathology II', 'PATH-202', 'Para-Clinical')
ON CONFLICT DO NOTHING;

-- Pharmacology II
INSERT INTO subjects (id, semester_id, title, code, category)
VALUES ('e5b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'c6d7e8f9-b0c1-2d3e-4f5a-6b7c8d9e0f1a', 'Pharmacology II', 'PHARM-202', 'Para-Clinical')
ON CONFLICT DO NOTHING;

-- Microbiology II
INSERT INTO subjects (id, semester_id, title, code, category)
VALUES ('e5c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e', 'c6d7e8f9-b0c1-2d3e-4f5a-6b7c8d9e0f1a', 'Microbiology II', 'MICRO-202', 'Para-Clinical')
ON CONFLICT DO NOTHING;

-- Forensic Medicine II
INSERT INTO subjects (id, semester_id, title, code, category)
VALUES ('e5d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f', 'c6d7e8f9-b0c1-2d3e-4f5a-6b7c8d9e0f1a', 'Forensic Medicine II', 'FM-202', 'Para-Clinical')
ON CONFLICT DO NOTHING;

-- Community Medicine II
INSERT INTO subjects (id, semester_id, title, code, category)
VALUES ('e5e5f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a', 'c6d7e8f9-b0c1-2d3e-4f5a-6b7c8d9e0f1a', 'Community Medicine II', 'CM-202', 'Clinical')
ON CONFLICT DO NOTHING;

-- Clinical postings II
INSERT INTO subjects (id, semester_id, title, code, category)
VALUES ('e5f6a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0b', 'c6d7e8f9-b0c1-2d3e-4f5a-6b7c8d9e0f1a', 'Clinical postings II', 'CLIN-202', 'Clinical')
ON CONFLICT DO NOTHING;


-- 3. Content for Pathology II
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('e5a00001-d4e5-6f7a-8b9c-0d1e2f3a4b5c', 'e5a1b2c3-d4e5-6f7a-8b9c-0d1e2f3a4b5c', 'Systemic Pathology', 1)
ON CONFLICT DO NOTHING;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('e5a00002-d4e5-6f7a-8b9c-0d1e2f3a4b5c', 'e5a00001-d4e5-6f7a-8b9c-0d1e2f3a4b5c', 'Cardiovascular System Pathology', 1)
ON CONFLICT DO NOTHING;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('e5a00003-d4e5-6f7a-8b9c-0d1e2f3a4b5c', 'e5a00002-d4e5-6f7a-8b9c-0d1e2f3a4b5c', 'Atherosclerosis & Myocardial Infarction', 1)
ON CONFLICT DO NOTHING;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('e5a00004-d4e5-6f7a-8b9c-0d1e2f3a4b5c', 'e5a00003-d4e5-6f7a-8b9c-0d1e2f3a4b5c', 'Pathogenesis of Atheroma', 1)
ON CONFLICT DO NOTHING;

INSERT INTO learning_objects (id, concept_id, object_type, content_payload, sort_order)
VALUES ('e5a00005-d4e5-6f7a-8b9c-0d1e2f3a4b5c', 'e5a00004-d4e5-6f7a-8b9c-0d1e2f3a4b5c', 'TEXT', '### Pathogenesis of Atheroma

Atherosclerosis is a chronic inflammatory disease of the arterial wall.

#### Key Stages of Pathogenesis
1. **Endothelial Injury**: Caused by hemodynamic shear stress, hypercholesterolemia, toxins, or infection.
2. **Lipid Accumulation**: LDL gets oxidized and accumulates in the intima.
3. **Macrophage Recruitment & Foam Cell Formation**: Monocytes migrate into the intima, engulf oxidized LDL, and turn into foam cells.
4. **Smooth Muscle Proliferation**: SMCs migrate from the media to the intima and deposit extracellular matrix, forming a fibrous cap.', 1)
ON CONFLICT DO NOTHING;


-- 4. Content for Pharmacology II
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('e5b00001-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'e5b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'Systemic Pharmacology', 1)
ON CONFLICT DO NOTHING;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('e5b00002-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'e5b00001-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'Autonomic Nervous System Drugs', 1)
ON CONFLICT DO NOTHING;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('e5b00003-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'e5b00002-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'Cholinergic & Adrenergic Pharmacology', 1)
ON CONFLICT DO NOTHING;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('e5b00004-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'e5b00003-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'Adrenergic Agonists & Antagonists', 1)
ON CONFLICT DO NOTHING;

INSERT INTO learning_objects (id, concept_id, object_type, content_payload, sort_order)
VALUES ('e5b00005-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'e5b00004-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'TEXT', '### Adrenergic Receptor Pharmacology

Adrenergic drugs act on receptors activated by norepinephrine and epinephrine.

#### Receptor Types & Clinical Uses
- **Alpha-1 Agonists**: Nasal decongestants (e.g., Phenylephrine) via vasoconstriction.
- **Beta-1 Antagonists (Beta Blockers)**: Used for hypertension and arrhythmias (e.g., Metoprolol) by reducing cardiac output.
- **Beta-2 Agonists**: Bronchodilators for asthma (e.g., Salbutamol).', 1)
ON CONFLICT DO NOTHING;


-- 5. Content for Microbiology II
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('e5c00001-f6a7-8b9c-0d1e-2f3a4b5c6d7e', 'e5c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e', 'Systemic Bacteriology', 1)
ON CONFLICT DO NOTHING;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('e5c00002-f6a7-8b9c-0d1e-2f3a4b5c6d7e', 'e5c00001-f6a7-8b9c-0d1e-2f3a4b5c6d7e', 'Gram-Positive Cocci', 1)
ON CONFLICT DO NOTHING;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('e5c00003-f6a7-8b9c-0d1e-2f3a4b5c6d7e', 'e5c00002-f6a7-8b9c-0d1e-2f3a4b5c6d7e', 'Staphylococcus & Streptococcus', 1)
ON CONFLICT DO NOTHING;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('e5c00004-f6a7-8b9c-0d1e-2f3a4b5c6d7e', 'e5c00003-f6a7-8b9c-0d1e-2f3a4b5c6d7e', 'Pathogenesis of Staphylococcus aureus', 1)
ON CONFLICT DO NOTHING;

INSERT INTO learning_objects (id, concept_id, object_type, content_payload, sort_order)
VALUES ('e5c00005-f6a7-8b9c-0d1e-2f3a4b5c6d7e', 'e5c00004-f6a7-8b9c-0d1e-2f3a4b5c6d7e', 'TEXT', '### Staphylococcus aureus Pathogenesis

*Staphylococcus aureus* is a versatile pathogen causing pyogenic infections and food poisoning.

#### Virulence Factors
- **Coagulase**: Clots plasma, protecting the bacteria from phagocytosis.
- **Protein A**: Binds to the Fc region of IgG, preventing opsonization.
- **Toxins**: Enterotoxins (food poisoning), TSST-1 (Toxic Shock Syndrome), and Exfoliatin (Scaled Skin Syndrome).', 1)
ON CONFLICT DO NOTHING;


-- 6. Content for Forensic Medicine II
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('e5d00001-a7b8-9c0d-1e2f-3a4b5c6d7e8f', 'e5d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f', 'Medical Jurisprudence & Thanatology', 1)
ON CONFLICT DO NOTHING;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('e5d00002-a7b8-9c0d-1e2f-3a4b5c6d7e8f', 'e5d00001-a7b8-9c0d-1e2f-3a4b5c6d7e8f', 'Thanatology', 1)
ON CONFLICT DO NOTHING;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('e5d00003-a7b8-9c0d-1e2f-3a4b5c6d7e8f', 'e5d00002-a7b8-9c0d-1e2f-3a4b5c6d7e8f', 'Post-Mortem Changes', 1)
ON CONFLICT DO NOTHING;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('e5d00004-a7b8-9c0d-1e2f-3a4b5c6d7e8f', 'e5d00003-a7b8-9c0d-1e2f-3a4b5c6d7e8f', 'Rigor Mortis Timeline', 1)
ON CONFLICT DO NOTHING;

INSERT INTO learning_objects (id, concept_id, object_type, content_payload, sort_order)
VALUES ('e5d00005-a7b8-9c0d-1e2f-3a4b5c6d7e8f', 'e5d00004-a7b8-9c0d-1e2f-3a4b5c6d7e8f', 'TEXT', '### Rigor Mortis Development

Rigor mortis is the post-mortem stiffening of muscles due to depletion of ATP.

#### Timeline of Rigor Mortis
1. **Onset**: Begins 1 to 2 hours after death in involuntary muscles, then spreads to voluntary muscles (eyelids, face, neck).
2. **Complete Rigidity**: Reaches maximum stiffness around 12 hours.
3. **Resolution**: Passes off in the same order of appearance after 18 to 24 hours, returning muscles to a flaccid state.', 1)
ON CONFLICT DO NOTHING;


-- 7. Content for Community Medicine II
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('e5e00001-b8c9-0d1e-2f3a-4b5c6d7e8f9a', 'e5e5f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a', 'Epidemiology & Disease Control', 1)
ON CONFLICT DO NOTHING;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('e5e00002-b8c9-0d1e-2f3a-4b5c6d7e8f9a', 'e5e00001-b8c9-0d1e-2f3a-4b5c6d7e8f9a', 'Epidemiology of Communicable Diseases', 1)
ON CONFLICT DO NOTHING;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('e5e00003-b8c9-0d1e-2f3a-4b5c6d7e8f9a', 'e5e00002-b8c9-0d1e-2f3a-4b5c6d7e8f9a', 'Vector-borne Illnesses', 1)
ON CONFLICT DO NOTHING;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('e5e00004-b8c9-0d1e-2f3a-4b5c6d7e8f9a', 'e5e00003-b8c9-0d1e-2f3a-4b5c6d7e8f9a', 'Malaria Vector Transmission Dynamics', 1)
ON CONFLICT DO NOTHING;

INSERT INTO learning_objects (id, concept_id, object_type, content_payload, sort_order)
VALUES ('e5e00005-b8c9-0d1e-2f3a-4b5c6d7e8f9a', 'e5e00004-b8c9-0d1e-2f3a-4b5c6d7e8f9a', 'TEXT', '### Malaria Vector Control & Epidemiology

Malaria is caused by the *Plasmodium* parasite transmitted via female *Anopheles* mosquitoes.

#### Primary Interventions
- **Indoor Residual Spraying (IRS)**: Spraying insecticide on interior walls where mosquitoes rest.
- **Long-Lasting Insecticidal Nets (LLINs)**: Physical and chemical protection barrier during sleep.
- **Source Reduction**: Eliminating breeding pools (standing water) to limit larval development.', 1)
ON CONFLICT DO NOTHING;


-- 8. Content for Clinical postings II
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('e5f00001-c9d0-1e2f-3a4b-5c6d7e8f9a0b', 'e5f6a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0b', 'Clinical Medicine Postings', 1)
ON CONFLICT DO NOTHING;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('e5f00002-c9d0-1e2f-3a4b-5c6d7e8f9a0b', 'e5f00001-c9d0-1e2f-3a4b-5c6d7e8f9a0b', 'Cardiovascular History Taking & Examination', 1)
ON CONFLICT DO NOTHING;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('e5f00003-c9d0-1e2f-3a4b-5c6d7e8f9a0b', 'e5f00002-c9d0-1e2f-3a4b-5c6d7e8f9a0b', 'Pulse Examination & Heart Sounds', 1)
ON CONFLICT DO NOTHING;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('e5f00004-c9d0-1e2f-3a4b-5c6d7e8f9a0b', 'e5f00003-c9d0-1e2f-3a4b-5c6d7e8f9a0b', 'Auscultation of Normal Heart Sounds', 1)
ON CONFLICT DO NOTHING;

INSERT INTO learning_objects (id, concept_id, object_type, content_payload, sort_order)
VALUES ('e5f00005-c9d0-1e2f-3a4b-5c6d7e8f9a0b', 'e5f00004-c9d0-1e2f-3a4b-5c6d7e8f9a0b', 'TEXT', '### Auscultation of Normal Heart Sounds

Clinical assessment of cardiovascular system begins with careful chest auscultation.

#### Normal Heart Sounds
- **First Heart Sound (S1)**: Produced by closure of mitral and tricuspid (AV) valves at onset of systole. Best heard at the apex.
- **Second Heart Sound (S2)**: Produced by closure of aortic and pulmonary (semilunar) valves at onset of diastole. Best heard at base of heart (left and right 2nd intercostal spaces).', 1)
ON CONFLICT DO NOTHING;
