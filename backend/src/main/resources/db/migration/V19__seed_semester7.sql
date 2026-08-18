-- 1. Seed Year 4 (Final Professional II) under Curriculum 'mbbs-cbme-2024' (ID: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d')
INSERT INTO curriculum_years (id, curriculum_id, year_number)
VALUES ('b5c6d7e8-f9a0-1b2c-3d4e-5f6a7b8c9d0e', 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 4)
ON CONFLICT DO NOTHING;

-- 2. Seed Semester 7 under Year 4
INSERT INTO semesters (id, year_id, semester_number)
VALUES ('c9d0e1f2-b3c4-5d6e-7f8a-9b0c1d2e3f4a', 'b5c6d7e8-f9a0-1b2c-3d4e-5f6a7b8c9d0e', 7)
ON CONFLICT DO NOTHING;

-- 3. Seed Subjects for Semester 7
-- General Medicine
INSERT INTO subjects (id, semester_id, title, code, category)
VALUES ('f1a7b2c3-d4e5-6f7a-8b9c-0d1e2f3a4b5c', 'c9d0e1f2-b3c4-5d6e-7f8a-9b0c1d2e3f4a', 'General Medicine', 'MED-401', 'Clinical')
ON CONFLICT DO NOTHING;

-- General Surgery
INSERT INTO subjects (id, semester_id, title, code, category)
VALUES ('f2b7c6d7-e8f9-0a1b-2c3d-4e5f6a7b8c9d', 'c9d0e1f2-b3c4-5d6e-7f8a-9b0c1d2e3f4a', 'General Surgery', 'SURG-401', 'Clinical')
ON CONFLICT DO NOTHING;

-- Obstetrics & Gynecology
INSERT INTO subjects (id, semester_id, title, code, category)
VALUES ('f3c7d6e7-f9a0-1b2c-3d4e-5f6a7b8c9d0e', 'c9d0e1f2-b3c4-5d6e-7f8a-9b0c1d2e3f4a', 'Obstetrics & Gynecology', 'OBG-401', 'Clinical')
ON CONFLICT DO NOTHING;

-- Pediatrics
INSERT INTO subjects (id, semester_id, title, code, category)
VALUES ('f4d7e6f7-a0b1-2c3d-4e5f-6a7b8c9d0e1f', 'c9d0e1f2-b3c4-5d6e-7f8a-9b0c1d2e3f4a', 'Pediatrics', 'PED-401', 'Clinical')
ON CONFLICT DO NOTHING;

-- Orthopedics
INSERT INTO subjects (id, semester_id, title, code, category)
VALUES ('f5e7f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a', 'c9d0e1f2-b3c4-5d6e-7f8a-9b0c1d2e3f4a', 'Orthopedics', 'ORTH-401', 'Clinical')
ON CONFLICT DO NOTHING;

-- Dermatology
INSERT INTO subjects (id, semester_id, title, code, category)
VALUES ('f6a7a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0b', 'c9d0e1f2-b3c4-5d6e-7f8a-9b0c1d2e3f4a', 'Dermatology', 'DERM-401', 'Clinical')
ON CONFLICT DO NOTHING;

-- Psychiatry
INSERT INTO subjects (id, semester_id, title, code, category)
VALUES ('f7b7a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0c', 'c9d0e1f2-b3c4-5d6e-7f8a-9b0c1d2e3f4a', 'Psychiatry', 'PSY-401', 'Clinical')
ON CONFLICT DO NOTHING;

-- Respiratory Medicine
INSERT INTO subjects (id, semester_id, title, code, category)
VALUES ('f8c7a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0d', 'c9d0e1f2-b3c4-5d6e-7f8a-9b0c1d2e3f4a', 'Respiratory Medicine', 'RESP-401', 'Clinical')
ON CONFLICT DO NOTHING;

-- Radiology
INSERT INTO subjects (id, semester_id, title, code, category)
VALUES ('f9d7a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0e', 'c9d0e1f2-b3c4-5d6e-7f8a-9b0c1d2e3f4a', 'Radiology', 'RAD-401', 'Clinical')
ON CONFLICT DO NOTHING;

-- Anesthesiology
INSERT INTO subjects (id, semester_id, title, code, category)
VALUES ('f0e7a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0f', 'c9d0e1f2-b3c4-5d6e-7f8a-9b0c1d2e3f4a', 'Anesthesiology', 'ANES-401', 'Clinical')
ON CONFLICT DO NOTHING;

-- Emergency Medicine
INSERT INTO subjects (id, semester_id, title, code, category)
VALUES ('f0f7a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a1a', 'c9d0e1f2-b3c4-5d6e-7f8a-9b0c1d2e3f4a', 'Emergency Medicine', 'EM-401', 'Clinical')
ON CONFLICT DO NOTHING;


-- 4. Content for General Medicine
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('f1a70001-d4e5-6f7a-8b9c-0d1e2f3a4b5c', 'f1a7b2c3-d4e5-6f7a-8b9c-0d1e2f3a4b5c', 'Endocrine & Metabolic Disorders', 1)
ON CONFLICT DO NOTHING;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('f1a70002-d4e5-6f7a-8b9c-0d1e2f3a4b5c', 'f1a70001-d4e5-6f7a-8b9c-0d1e2f3a4b5c', 'Diabetes Mellitus Management', 1)
ON CONFLICT DO NOTHING;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('f1a70003-d4e5-6f7a-8b9c-0d1e2f3a4b5c', 'f1a70002-d4e5-6f7a-8b9c-0d1e2f3a4b5c', 'Insulin Regimens & Oral Hypoglycemics', 1)
ON CONFLICT DO NOTHING;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('f1a70004-d4e5-6f7a-8b9c-0d1e2f3a4b5c', 'f1a70003-d4e5-6f7a-8b9c-0d1e2f3a4b5c', 'Basal-Bolus Insulin Therapy', 1)
ON CONFLICT DO NOTHING;

INSERT INTO learning_objects (id, concept_id, object_type, content_payload, sort_order)
VALUES ('f1a70005-d4e5-6f7a-8b9c-0d1e2f3a4b5c', 'f1a70004-d4e5-6f7a-8b9c-0d1e2f3a4b5c', 'TEXT', '### Basal-Bolus Insulin Therapy

Basal-bolus therapy mimics the physiological insulin secretion of a healthy pancreas.

#### Components
- **Basal Insulin**: Long-acting insulin (e.g., Glargine, Detemir) administered once or twice daily. Provides constant, low-level insulin to suppress hepatic glucose production overnight and between meals.
- **Bolus (Prandial) Insulin**: Rapid-acting insulin (e.g., Lispro, Aspart) administered immediately before meals. Controls postprandial blood glucose spikes.', 1)
ON CONFLICT DO NOTHING;


-- 5. Content for General Surgery
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('f2b70001-e8f9-0a1b-2c3d-4e5f6a7b8c9d', 'f2b7c6d7-e8f9-0a1b-2c3d-4e5f6a7b8c9d', 'Endocrine Surgery', 1)
ON CONFLICT DO NOTHING;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('f2b70002-e8f9-0a1b-2c3d-4e5f6a7b8c9d', 'f2b70001-e8f9-0a1b-2c3d-4e5f6a7b8c9d', 'Thyroid Disorders & Thyroidectomy', 1)
ON CONFLICT DO NOTHING;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('f2b70003-e8f9-0a1b-2c3d-4e5f6a7b8c9d', 'f2b70002-e8f9-0a1b-2c3d-4e5f6a7b8c9d', 'Thyroidectomy Complications', 1)
ON CONFLICT DO NOTHING;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('f2b70004-e8f9-0a1b-2c3d-4e5f6a7b8c9d', 'f2b70003-e8f9-0a1b-2c3d-4e5f6a7b8c9d', 'Recurrent Laryngeal Nerve Injury', 1)
ON CONFLICT DO NOTHING;

INSERT INTO learning_objects (id, concept_id, object_type, content_payload, sort_order)
VALUES ('f2b70005-e8f9-0a1b-2c3d-4e5f6a7b8c9d', 'f2b70004-e8f9-0a1b-2c3d-4e5f6a7b8c9d', 'TEXT', '### Recurrent Laryngeal Nerve (RLN) Injury

RLN injury is a critical complication of thyroid surgery due to its close anatomical proximity to the inferior thyroid artery.

#### Clinical Presentation
- **Unilateral Injury**: Hoarseness of voice and weak cough. One vocal cord is paralyzed in the paramedian position.
- **Bilateral Injury**: Dyspnea and stridor. Both vocal cords remain in the paramedian position, obstructing the airway. Emergency tracheostomy may be required.', 1)
ON CONFLICT DO NOTHING;


-- 6. Content for Obstetrics & Gynecology
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('f3c70001-f9a0-1b2c-3d4e-5f6a7b8c9d0e', 'f3c7d6e7-f9a0-1b2c-3d4e-5f6a7b8c9d0e', 'High-Risk Obstetrics', 1)
ON CONFLICT DO NOTHING;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('f3c70002-f9a0-1b2c-3d4e-5f6a7b8c9d0e', 'f3c70001-f9a0-1b2c-3d4e-5f6a7b8c9d0e', 'Preeclampsia & Eclampsia', 1)
ON CONFLICT DO NOTHING;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('f3c70003-f9a0-1b2c-3d4e-5f6a7b8c9d0e', 'f3c70002-f9a0-1b2c-3d4e-5f6a7b8c9d0e', 'Management of Eclamptic Seizures', 1)
ON CONFLICT DO NOTHING;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('f3c70004-f9a0-1b2c-3d4e-5f6a7b8c9d0e', 'f3c70003-f9a0-1b2c-3d4e-5f6a7b8c9d0e', 'Magnesium Sulfate Therapy (Pritchard Regimen)', 1)
ON CONFLICT DO NOTHING;

INSERT INTO learning_objects (id, concept_id, object_type, content_payload, sort_order)
VALUES ('f3c70005-f9a0-1b2c-3d4e-5f6a7b8c9d0e', 'f3c70004-f9a0-1b2c-3d4e-5f6a7b8c9d0e', 'TEXT', '### Magnesium Sulfate (MgSO4) Therapy

MgSO4 is the drug of choice for preventing and controlling seizures in eclampsia.

#### Pritchard Regimen Protocol
- **Loading Dose**: 4 g IV (20% solution over 5-10 minutes) + 10 g IM (5 g deep IM in each buttock as 50% solution).
- **Maintenance Dose**: 5 g IM (50% solution) every 4 hours in alternating buttocks.

#### Pre-requisites for Maintenance Dose
Before giving each maintenance dose, verify:
1. **Patellar Reflex**: Must be present.
2. **Respiratory Rate**: Must be >= 16 breaths per minute.
3. **Urine Output**: Must be >= 30 mL/hour (or >= 100 mL in 4 hours).', 1)
ON CONFLICT DO NOTHING;


-- 7. Content for Pediatrics
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('f4d70001-a0b1-2c3d-4e5f-6a7b8c9d0e1f', 'f4d7e6f7-a0b1-2c3d-4e5f-6a7b8c9d0e1f', 'Neonatal Disorders & Resuscitation', 1)
ON CONFLICT DO NOTHING;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('f4d70002-a0b1-2c3d-4e5f-6a7b8c9d0e1f', 'f4d70001-a0b1-2c3d-4e5f-6a7b8c9d0e1f', 'Neonatal Resuscitation Program (NRP)', 1)
ON CONFLICT DO NOTHING;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('f4d70003-a0b1-2c3d-4e5f-6a7b8c9d0e1f', 'f4d70002-a0b1-2c3d-4e5f-6a7b8c9d0e1f', 'Positive Pressure Ventilation (PPV)', 1)
ON CONFLICT DO NOTHING;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('f4d70004-a0b1-2c3d-4e5f-6a7b8c9d0e1f', 'f4d70003-a0b1-2c3d-4e5f-6a7b8c9d0e1f', 'Ventilation & Airway Correction (MR. SOPA)', 1)
ON CONFLICT DO NOTHING;

INSERT INTO learning_objects (id, concept_id, object_type, content_payload, sort_order)
VALUES ('f4d70005-a0b1-2c3d-4e5f-6a7b8c9d0e1f', 'f4d70004-a0b1-2c3d-4e5f-6a7b8c9d0e1f', 'TEXT', '### MR. SOPA Airway Correction Steps

If positive pressure ventilation (PPV) does not result in chest rise, perform airway corrective steps:

- **M**ask adjustment: Reapply mask for a tight seal.
- **R**eposition airway: Place head in a neutral "sniffing" position.
- **S**uction mouth and nose: Clear secretions.
- **O**pen mouth: Gently open the baby''s jaw.
- **P**ressure increase: Increase PPV pressure in small increments (max 40 cm H2O).
- **A**lternative airway: Insert an endotracheal tube or laryngeal mask airway.', 1)
ON CONFLICT DO NOTHING;


-- 8. Content for Orthopedics
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('f5e70001-b8c9-0d1e-2f3a-4b5c6d7e8f9a', 'f5e7f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a', 'Traumatology & Fractures', 1)
ON CONFLICT DO NOTHING;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('f5e70002-b8c9-0d1e-2f3a-4b5c6d7e8f9a', 'f5e70001-b8c9-0d1e-2f3a-4b5c6d7e8f9a', 'Classification & Management of Fractures', 1)
ON CONFLICT DO NOTHING;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('f5e70003-b8c9-0d1e-2f3a-4b5c6d7e8f9a', 'f5e70002-b8c9-0d1e-2f3a-4b5c6d7e8f9a', 'Open vs Closed Fracture Management', 1)
ON CONFLICT DO NOTHING;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('f5e70004-b8c9-0d1e-2f3a-4b5c6d7e8f9a', 'f5e70003-b8c9-0d1e-2f3a-4b5c6d7e8f9a', 'Gustilo-Anderson Open Fracture Classification', 1)
ON CONFLICT DO NOTHING;

INSERT INTO learning_objects (id, concept_id, object_type, content_payload, sort_order)
VALUES ('f5e70005-b8c9-0d1e-2f3a-4b5c6d7e8f9a', 'f5e70004-b8c9-0d1e-2f3a-4b5c6d7e8f9a', 'TEXT', '### Gustilo-Anderson Classification

This system classifies open fractures based on wound size, soft tissue damage, and contamination.

#### Categories
- **Type I**: Clean skin wound < 1 cm, minimal soft tissue damage, simple fracture pattern.
- **Type II**: Laceration > 1 cm, moderate soft tissue damage, minimal contamination.
- **Type III**: Extensive soft tissue damage (> 10 cm), high contamination, or high-energy trauma.
  - **Type IIIa**: Adequate soft tissue coverage of bone despite laceration.
  - **Type IIIb**: Extensive soft tissue loss with bone exposure (requires flap coverage).
  - **Type IIIc**: Associated arterial injury requiring vascular repair.', 1)
ON CONFLICT DO NOTHING;


-- 9. Content for Dermatology
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('f6a70001-c9d0-1e2f-3a4b-5c6d7e8f9a0b', 'f6a7a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0b', 'Papulosquamous Skin Disorders', 1)
ON CONFLICT DO NOTHING;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('f6a70002-c9d0-1e2f-3a4b-5c6d7e8f9a0b', 'f6a70001-c9d0-1e2f-3a4b-5c6d7e8f9a0b', 'Psoriasis Pathogenesis & Treatment', 1)
ON CONFLICT DO NOTHING;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('f6a70003-c9d0-1e2f-3a4b-5c6d7e8f9a0b', 'f6a70002-c9d0-1e2f-3a4b-5c6d7e8f9a0b', 'Psoriasis Pathology & Clinical Signs', 1)
ON CONFLICT DO NOTHING;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('f6a70004-c9d0-1e2f-3a4b-5c6d7e8f9a0b', 'f6a70003-c9d0-1e2f-3a4b-5c6d7e8f9a0b', 'Auspitz Sign & Munro Microabscesses', 1)
ON CONFLICT DO NOTHING;

INSERT INTO learning_objects (id, concept_id, object_type, content_payload, sort_order)
VALUES ('f6a70005-c9d0-1e2f-3a4b-5c6d7e8f9a0b', 'f6a70004-c9d0-1e2f-3a4b-5c6d7e8f9a0b', 'TEXT', '### Psoriasis Pathology & Clinical Signs

Psoriasis is a T-cell-mediated inflammatory dermatosis characterized by epidermal hyperproliferation.

#### Pathognomonic Signs & Pathology
- **Auspitz Sign**: Pinpoint bleeding occurs when psoriasis scales are scraped off. Caused by thinning of epidermal layer overlying elongated dermal papillae with dilated tortuous capillaries.
- **Munro Microabscesses**: Collections of neutrophils within the parakeratotic stratum corneum layer of the epidermis.', 1)
ON CONFLICT DO NOTHING;


-- 10. Content for Psychiatry
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('f7b70001-c9d0-1e2f-3a4b-5c6d7e8f9a0c', 'f7b7a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0c', 'Mood & Affective Disorders', 1)
ON CONFLICT DO NOTHING;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('f7b70002-c9d0-1e2f-3a4b-5c6d7e8f9a0c', 'f7b70001-c9d0-1e2f-3a4b-5c6d7e8f9a0c', 'Major Depressive Disorder', 1)
ON CONFLICT DO NOTHING;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('f7b70003-c9d0-1e2f-3a4b-5c6d7e8f9a0c', 'f7b70002-c9d0-1e2f-3a4b-5c6d7e8f9a0c', 'Diagnostic Criteria & DSM-5 Guidelines', 1)
ON CONFLICT DO NOTHING;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('f7b70004-c9d0-1e2f-3a4b-5c6d7e8f9a0c', 'f7b70003-c9d0-1e2f-3a4b-5c6d7e8f9a0c', 'DSM-5 Major Depression Symptoms (SIGECAPS)', 1)
ON CONFLICT DO NOTHING;

INSERT INTO learning_objects (id, concept_id, object_type, content_payload, sort_order)
VALUES ('f7b70005-c9d0-1e2f-3a4b-5c6d7e8f9a0c', 'f7b70004-c9d0-1e2f-3a4b-5c6d7e8f9a0c', 'TEXT', '### DSM-5 Criteria for Major Depression

Diagnosis requires 5 or more symptoms present during the same 2-week period, representing a change from previous functioning, including depressed mood or anhedonia.

#### SIGECAPS Mnemonic
- **S**leep: Insomnia or hypersomnia.
- **I**nterest: Markedly diminished interest or pleasure (anhedonia).
- **G**uilt: Feelings of worthlessness or excessive guilt.
- **E**nergy: Fatigue or loss of energy.
- **C**oncentration: Diminished ability to think or concentrate.
- **A**ppetite: Weight loss/gain or appetite changes.
- **P**sychomotor: Agitation or retardation.
- **S**uicidal ideation: Recurrent thoughts of death.', 1)
ON CONFLICT DO NOTHING;


-- 11. Content for Respiratory Medicine
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('f8c70001-c9d0-1e2f-3a4b-5c6d7e8f9a0d', 'f8c7a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0d', 'Obstructive Lung Diseases', 1)
ON CONFLICT DO NOTHING;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('f8c70002-c9d0-1e2f-3a4b-5c6d7e8f9a0d', 'f8c70001-c9d0-1e2f-3a4b-5c6d7e8f9a0d', 'Chronic Obstructive Pulmonary Disease (COPD)', 1)
ON CONFLICT DO NOTHING;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('f8c70003-c9d0-1e2f-3a4b-5c6d7e8f9a0d', 'f8c70002-c9d0-1e2f-3a4b-5c6d7e8f9a0d', 'Pathophysiology & Oxygen Therapy', 1)
ON CONFLICT DO NOTHING;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('f8c70004-c9d0-1e2f-3a4b-5c6d7e8f9a0d', 'f8c70003-c9d0-1e2f-3a4b-5c6d7e8f9a0d', 'Hypoxic Drive & Controlled Oxygen Delivery', 1)
ON CONFLICT DO NOTHING;

INSERT INTO learning_objects (id, concept_id, object_type, content_payload, sort_order)
VALUES ('f8c70005-c9d0-1e2f-3a4b-5c6d7e8f9a0d', 'f8c70004-c9d0-1e2f-3a4b-5c6d7e8f9a0d', 'TEXT', '### Hypoxic Drive in COPD

In patients with chronic hypercapnia (COPD), the respiratory center becomes insensitive to CO2 retention.

#### Physiological Mechanism
- **Hypoxic Drive**: Respiration is driven by arterial oxygen levels (pO2) detected by peripheral chemoreceptors, rather than by CO2 (pCO2).
- **Oxygen Therapy Risk**: Giving uncontrolled high-flow oxygen can raise pO2 above the hypoxic threshold, removing the stimulus to breathe, leading to hypoventilation, severe CO2 retention, and CO2 narcosis.
- **Delivery**: Use controlled low-flow oxygen (Venturi mask, 24% to 28% fraction of inspired oxygen) aiming for target SpO2 of 88-92%.', 1)
ON CONFLICT DO NOTHING;


-- 12. Content for Radiology
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('f9d70001-c9d0-1e2f-3a4b-5c6d7e8f9a0e', 'f9d7a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0e', 'Thoracic Imaging', 1)
ON CONFLICT DO NOTHING;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('f9d70002-c9d0-1e2f-3a4b-5c6d7e8f9a0e', 'f9d70001-c9d0-1e2f-3a4b-5c6d7e8f9a0e', 'Chest X-ray Interpretation', 1)
ON CONFLICT DO NOTHING;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('f9d70003-c9d0-1e2f-3a4b-5c6d7e8f9a0e', 'f9d70002-c9d0-1e2f-3a4b-5c6d7e8f9a0e', 'Systematic Approach & Density Check', 1)
ON CONFLICT DO NOTHING;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('f9d70004-c9d0-1e2f-3a4b-5c6d7e8f9a0e', 'f9d70003-c9d0-1e2f-3a4b-5c6d7e8f9a0e', 'The ABCDE Systematic Chest X-Ray Checklist', 1)
ON CONFLICT DO NOTHING;

INSERT INTO learning_objects (id, concept_id, object_type, content_payload, sort_order)
VALUES ('f9d70005-c9d0-1e2f-3a4b-5c6d7e8f9a0e', 'f9d70004-c9d0-1e2f-3a4b-5c6d7e8f9a0e', 'TEXT', '### ABCDE Chest X-Ray Checklist

A systematic approach ensures that key findings are not missed during radiographic interpretation.

#### Checklist Steps
- **A**irway: Inspect trachea (is it central or deviated?), carina, and main bronchi.
- **B**reathing: Inspect lung fields (opacities, consolidations, nodules, pneumothorax).
- **C**ardiac: Assess heart size (cardiothoracic ratio should be <= 50% on PA view) and mediastinal borders.
- **D**iaphragm: Check costophrenic angles (clear vs blunted indicating pleural effusion) and search for free air under the diaphragm.
- **E**verything else: Inspect bones (rib fractures, clavicle) and soft tissues.', 1)
ON CONFLICT DO NOTHING;


-- 13. Content for Anesthesiology
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('f0e70001-c9d0-1e2f-3a4b-5c6d7e8f9a0f', 'f0e7a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0f', 'Airway Management & General Anesthesia', 1)
ON CONFLICT DO NOTHING;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('f0e70002-c9d0-1e2f-3a4b-5c6d7e8f9a0f', 'f0e70001-c9d0-1e2f-3a4b-5c6d7e8f9a0f', 'Airway Management & Intubation', 1)
ON CONFLICT DO NOTHING;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('f0e70003-c9d0-1e2f-3a4b-5c6d7e8f9a0f', 'f0e70002-c9d0-1e2f-3a4b-5c6d7e8f9a0f', 'Airway Assessment & Laryngoscopy', 1)
ON CONFLICT DO NOTHING;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('f0e70004-c9d0-1e2f-3a4b-5c6d7e8f9a0f', 'f0e70003-c9d0-1e2f-3a4b-5c6d7e8f9a0f', 'Mallampati Airway Classification', 1)
ON CONFLICT DO NOTHING;

INSERT INTO learning_objects (id, concept_id, object_type, content_payload, sort_order)
VALUES ('f0e70005-c9d0-1e2f-3a4b-5c6d7e8f9a0f', 'f0e70004-c9d0-1e2f-3a4b-5c6d7e8f9a0f', 'TEXT', '### Mallampati Score

The Mallampati score estimates the ease of endotracheal intubation based on structures visible when the patient opens their mouth and protrudes their tongue.

#### Classification
- **Class I**: Soft palate, fauces, uvula, and tonsillar pillars are fully visible.
- **Class II**: Soft palate, fauces, and uvula are visible.
- **Class III**: Soft palate and base of uvula are visible.
- **Class IV**: Only the hard palate is visible (predicts a difficult airway).', 1)
ON CONFLICT DO NOTHING;


-- 14. Content for Emergency Medicine
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('f0f70001-c9d0-1e2f-3a4b-5c6d7e8f9a1a', 'f0f7a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a1a', 'Cardiopulmonary Resuscitation', 1)
ON CONFLICT DO NOTHING;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('f0f70002-c9d0-1e2f-3a4b-5c6d7e8f9a1a', 'f0f70001-c9d0-1e2f-3a4b-5c6d7e8f9a1a', 'Advanced Cardiovascular Life Support (ACLS)', 1)
ON CONFLICT DO NOTHING;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('f0f70003-c9d0-1e2f-3a4b-5c6d7e8f9a1a', 'f0f70002-c9d0-1e2f-3a4b-5c6d7e8f9a1a', 'Cardiac Arrest Algorithms', 1)
ON CONFLICT DO NOTHING;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('f0f70004-c9d0-1e2f-3a4b-5c6d7e8f9a1a', 'f0f70003-c9d0-1e2f-3a4b-5c6d7e8f9a1a', 'Shockable vs Non-Shockable Cardiac Rhythms', 1)
ON CONFLICT DO NOTHING;

INSERT INTO learning_objects (id, concept_id, object_type, content_payload, sort_order)
VALUES ('f0f70005-c9d0-1e2f-3a4b-5c6d7e8f9a1a', 'f0f70004-c9d0-1e2f-3a4b-5c6d7e8f9a1a', 'TEXT', '### ACLS Cardiac Arrest Rhythm Classification

ACLS algorithm bifurcates based on the electrocardiogram rhythm presentation.

#### Shockable Rhythms
- **Ventricular Fibrillation (VF)**: Disorganized, chaotic electrical activity.
- **Pulseless Ventricular Tachycardia (pVT)**: Rapid, wide QRS complexes without a palpable pulse.
- *Management*: Immediate high-energy shock (Defibrillation) + CPR.

#### Non-Shockable Rhythms
- **Asystole**: Absence of electrical activity ("flatline").
- **Pulseless Electrical Activity (PEA)**: Organized electrical activity on ECG but without a mechanical pulse.
- *Management*: CPR + Epinephrine (1 mg IV/IO every 3-5 minutes). Do NOT shock.', 1)
ON CONFLICT DO NOTHING;
