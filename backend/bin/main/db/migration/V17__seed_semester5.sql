-- 1. Seed Year 3 (3rd Professional) under Curriculum 'mbbs-cbme-2024' (ID: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d')
INSERT INTO curriculum_years (id, curriculum_id, year_number)
VALUES ('b4c5d6e7-f8a9-0b1c-2d3e-4f5a6b7c8d9e', 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 3)
ON CONFLICT DO NOTHING;

-- 2. Seed Semester 5 under Year 3
INSERT INTO semesters (id, year_id, semester_number)
VALUES ('c7d8e9f0-b1c2-3d4e-5f6a-7b8c9d0e1f2a', 'b4c5d6e7-f8a9-0b1c-2d3e-4f5a6b7c8d9e', 5)
ON CONFLICT DO NOTHING;

-- 3. Seed Subjects for Semester 5
-- Community Medicine
INSERT INTO subjects (id, semester_id, title, code, category)
VALUES ('f1a5b2c3-d4e5-6f7a-8b9c-0d1e2f3a4b5c', 'c7d8e9f0-b1c2-3d4e-5f6a-7b8c9d0e1f2a', 'Community Medicine', 'CM-301', 'Clinical')
ON CONFLICT DO NOTHING;

-- Forensic Medicine
INSERT INTO subjects (id, semester_id, title, code, category)
VALUES ('f2b5c6d7-e8f9-0a1b-2c3d-4e5f6a7b8c9d', 'c7d8e9f0-b1c2-3d4e-5f6a-7b8c9d0e1f2a', 'Forensic Medicine', 'FM-301', 'Para-Clinical')
ON CONFLICT DO NOTHING;

-- Medicine (Introduction)
INSERT INTO subjects (id, semester_id, title, code, category)
VALUES ('f3c5d6e7-f9a0-1b2c-3d4e-5f6a7b8c9d0e', 'c7d8e9f0-b1c2-3d4e-5f6a-7b8c9d0e1f2a', 'Medicine (Introduction)', 'MED-301', 'Clinical')
ON CONFLICT DO NOTHING;

-- Surgery (Introduction)
INSERT INTO subjects (id, semester_id, title, code, category)
VALUES ('f4d5e6f7-a0b1-2c3d-4e5f-6a7b8c9d0e1f', 'c7d8e9f0-b1c2-3d4e-5f6a-7b8c9d0e1f2a', 'Surgery (Introduction)', 'SURG-301', 'Clinical')
ON CONFLICT DO NOTHING;

-- Obstetrics & Gynecology
INSERT INTO subjects (id, semester_id, title, code, category)
VALUES ('f5e5f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a', 'c7d8e9f0-b1c2-3d4e-5f6a-7b8c9d0e1f2a', 'Obstetrics & Gynecology', 'OBG-301', 'Clinical')
ON CONFLICT DO NOTHING;

-- Pediatrics
INSERT INTO subjects (id, semester_id, title, code, category)
VALUES ('f6f6a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0b', 'c7d8e9f0-b1c2-3d4e-5f6a-7b8c9d0e1f2a', 'Pediatrics', 'PED-301', 'Clinical')
ON CONFLICT DO NOTHING;

-- ENT
INSERT INTO subjects (id, semester_id, title, code, category)
VALUES ('f7a6a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0c', 'c7d8e9f0-b1c2-3d4e-5f6a-7b8c9d0e1f2a', 'ENT', 'ENT-301', 'Clinical')
ON CONFLICT DO NOTHING;

-- Ophthalmology
INSERT INTO subjects (id, semester_id, title, code, category)
VALUES ('f8b6a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0d', 'c7d8e9f0-b1c2-3d4e-5f6a-7b8c9d0e1f2a', 'Ophthalmology', 'OPH-301', 'Clinical')
ON CONFLICT DO NOTHING;


-- 4. Content for Community Medicine
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('f1a00001-d4e5-6f7a-8b9c-0d1e2f3a4b5c', 'f1a5b2c3-d4e5-6f7a-8b9c-0d1e2f3a4b5c', 'Public Health Engineering', 1)
ON CONFLICT DO NOTHING;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('f1a00002-d4e5-6f7a-8b9c-0d1e2f3a4b5c', 'f1a00001-d4e5-6f7a-8b9c-0d1e2f3a4b5c', 'Water Quality & Sanitation', 1)
ON CONFLICT DO NOTHING;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('f1a00003-d4e5-6f7a-8b9c-0d1e2f3a4b5c', 'f1a00002-d4e5-6f7a-8b9c-0d1e2f3a4b5c', 'Water Purification Methods', 1)
ON CONFLICT DO NOTHING;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('f1a00004-d4e5-6f7a-8b9c-0d1e2f3a4b5c', 'f1a00003-d4e5-6f7a-8b9c-0d1e2f3a4b5c', 'Slow Sand vs Rapid Sand Filters', 1)
ON CONFLICT DO NOTHING;

INSERT INTO learning_objects (id, concept_id, object_type, content_payload, sort_order)
VALUES ('f1a00005-d4e5-6f7a-8b9c-0d1e2f3a4b5c', 'f1a00004-d4e5-6f7a-8b9c-0d1e2f3a4b5c', 'TEXT', '### Slow Sand vs Rapid Sand Filtration

Filtration is a key process in public water supply purification.

#### Slow Sand Filter
- **Rate of Filtration**: 2 to 4 million gallons per acre per day.
- **Cleaning**: Scraping top layer (Schmutzdecke) manually every few months.
- **Efficiency**: Very high bacterial removal (99%).

#### Rapid Sand Filter
- **Rate of Filtration**: 100 to 200 million gallons per acre per day.
- **Pre-treatment**: Requires coagulation (e.g., Alum).
- **Cleaning**: Backwashing with water and air under pressure daily.', 1)
ON CONFLICT DO NOTHING;


-- 5. Content for Forensic Medicine
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('f2b00001-e8f9-0a1b-2c3d-4e5f6a7b8c9d', 'f2b5c6d7-e8f9-0a1b-2c3d-4e5f6a7b8c9d', 'Forensic Toxicology', 1)
ON CONFLICT DO NOTHING;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('f2b00002-e8f9-0a1b-2c3d-4e5f6a7b8c9d', 'f2b00001-e8f9-0a1b-2c3d-4e5f6a7b8c9d', 'Introduction to Poisons', 1)
ON CONFLICT DO NOTHING;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('f2b00003-e8f9-0a1b-2c3d-4e5f6a7b8c9d', 'f2b00002-e8f9-0a1b-2c3d-4e5f6a7b8c9d', 'Classification & General Management', 1)
ON CONFLICT DO NOTHING;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('f2b00004-e8f9-0a1b-2c3d-4e5f6a7b8c9d', 'f2b00003-e8f9-0a1b-2c3d-4e5f6a7b8c9d', 'Gastric Lavage Indications & Technique', 1)
ON CONFLICT DO NOTHING;

INSERT INTO learning_objects (id, concept_id, object_type, content_payload, sort_order)
VALUES ('f2b00005-e8f9-0a1b-2c3d-4e5f6a7b8c9d', 'f2b00004-e8f9-0a1b-2c3d-4e5f6a7b8c9d', 'TEXT', '### Gastric Lavage

Gastric lavage (stomach wash) is used to empty the stomach of toxic substances.

#### Indications
- Performed within 1 to 2 hours of ingestion of life-threatening poisons.

#### Contraindications
- **Corrosive Poisons**: High risk of esophageal perforation.
- **Hydrocarbon Ingestion**: High risk of aspiration pneumonia.
- **Unprotected Airway**: Requires endotracheal intubation first.', 1)
ON CONFLICT DO NOTHING;


-- 6. Content for Medicine (Introduction)
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('f3c00001-f9a0-1b2c-3d4e-5f6a7b8c9d0e', 'f3c5d6e7-f9a0-1b2c-3d4e-5f6a7b8c9d0e', 'Clinical Diagnosis Methods', 1)
ON CONFLICT DO NOTHING;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('f3c00002-f9a0-1b2c-3d4e-5f6a7b8c9d0e', 'f3c00001-f9a0-1b2c-3d4e-5f6a7b8c9d0e', 'Respiratory History & Examination', 1)
ON CONFLICT DO NOTHING;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('f3c00003-f9a0-1b2c-3d4e-5f6a7b8c9d0e', 'f3c00002-f9a0-1b2c-3d4e-5f6a7b8c9d0e', 'Inspection & Auscultation Techniques', 1)
ON CONFLICT DO NOTHING;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('f3c00004-f9a0-1b2c-3d4e-5f6a7b8c9d0e', 'f3c00003-f9a0-1b2c-3d4e-5f6a7b8c9d0e', 'Normal vs Adventitious Lung Sounds', 1)
ON CONFLICT DO NOTHING;

INSERT INTO learning_objects (id, concept_id, object_type, content_payload, sort_order)
VALUES ('f3c00005-f9a0-1b2c-3d4e-5f6a7b8c9d0e', 'f3c00004-f9a0-1b2c-3d4e-5f6a7b8c9d0e', 'TEXT', '### Auscultation of Lung Sounds

Auscultation determines the character of breath sounds and detects abnormal sounds.

#### Normal Breath Sounds
- **Vesicular**: Soft, low-pitched, heard over most lung fields. Inspiration is longer than expiration.
- **Bronchial**: Harsh, high-pitched, heard over trachea/manubrium. Distinct gap between inspiration and expiration.

#### Adventitious Sounds
- **Crepitations (Crackles)**: Discontinuous clicking or rattling sounds (indicates fluid in alveoli, e.g., Pneumonia).
- **Wheezes**: Continuous musical whistling sounds (indicates airway obstruction, e.g., Asthma).', 1)
ON CONFLICT DO NOTHING;


-- 7. Content for Surgery (Introduction)
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('f4d00001-a0b1-2c3d-4e5f-6a7b8c9d0e1f', 'f4d5e6f7-a0b1-2c3d-4e5f-6a7b8c9d0e1f', 'Principles of Surgery & Wound Care', 1)
ON CONFLICT DO NOTHING;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('f4d00002-a0b1-2c3d-4e5f-6a7b8c9d0e1f', 'f4d00001-a0b1-2c3d-4e5f-6a7b8c9d0e1f', 'Wound Healing & Care', 1)
ON CONFLICT DO NOTHING;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('f4d00003-a0b1-2c3d-4e5f-6a7b8c9d0e1f', 'f4d00002-a0b1-2c3d-4e5f-6a7b8c9d0e1f', 'Wound Classification & Healing Intentions', 1)
ON CONFLICT DO NOTHING;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('f4d00004-a0b1-2c3d-4e5f-6a7b8c9d0e1f', 'f4d00003-a0b1-2c3d-4e5f-6a7b8c9d0e1f', 'Primary vs Secondary Healing Intentions', 1)
ON CONFLICT DO NOTHING;

INSERT INTO learning_objects (id, concept_id, object_type, content_payload, sort_order)
VALUES ('f4d00005-a0b1-2c3d-4e5f-6a7b8c9d0e1f', 'f4d00004-a0b1-2c3d-4e5f-6a7b8c9d0e1f', 'TEXT', '### Primary vs Secondary Intention Healing

Wounds heal through distinct pathways depending on tissue loss and closure.

#### Primary Intention
- Occurs in clean, uninfected wounds with closely opposed edges (e.g., surgical incisions).
- Minimal granulation tissue, rapid epithelialization, and minimal scarring.

#### Secondary Intention
- Occurs in wounds with extensive tissue loss, irregular edges, or infection (e.g., pressure ulcers).
- Wound is left open; heals by granulation tissue filling the defect, wound contraction, and extensive scarring.', 1)
ON CONFLICT DO NOTHING;


-- 8. Content for Obstetrics & Gynecology
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('f5e00001-b8c9-0d1e-2f3a-4b5c6d7e8f9a', 'f5e5f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a', 'Basic Obstetrics', 1)
ON CONFLICT DO NOTHING;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('f5e00002-b8c9-0d1e-2f3a-4b5c6d7e8f9a', 'f5e00001-b8c9-0d1e-2f3a-4b5c6d7e8f9a', 'Antenatal Care', 1)
ON CONFLICT DO NOTHING;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('f5e00003-b8c9-0d1e-2f3a-4b5c6d7e8f9a', 'f5e00002-b8c9-0d1e-2f3a-4b5c6d7e8f9a', 'Schedule & Essential Screening', 1)
ON CONFLICT DO NOTHING;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('f5e00004-b8c9-0d1e-2f3a-4b5c6d7e8f9a', 'f5e00003-b8c9-0d1e-2f3a-4b5c6d7e8f9a', 'Antenatal Visits & Examinations', 1)
ON CONFLICT DO NOTHING;

INSERT INTO learning_objects (id, concept_id, object_type, content_payload, sort_order)
VALUES ('f5e00005-b8c9-0d1e-2f3a-4b5c6d7e8f9a', 'f5e00004-b8c9-0d1e-2f3a-4b5c6d7e8f9a', 'TEXT', '### Antenatal Visits Schedule

Systemic care of a pregnant woman is essential for ensuring maternal and fetal health.

#### Recommended Minimum Visits (WHO)
1. **First Visit**: Before 12 weeks of gestation.
2. **Second Visit**: At 20 weeks.
3. **Third Visit**: At 26 weeks.
4. **Fourth Visit**: At 30 weeks.
5. **Visits 5-8**: At 34, 36, 38, and 40 weeks.

#### Routine Screening Checks
- Maternal blood pressure and weight monitoring.
- Urine analysis for proteinuria and glucose.
- Hemoglobin level (detection of anemia) and blood group typing.', 1)
ON CONFLICT DO NOTHING;


-- 9. Content for Pediatrics
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('f6f00001-c9d0-1e2f-3a4b-5c6d7e8f9a0b', 'f6f6a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0b', 'Growth, Development & Milestones', 1)
ON CONFLICT DO NOTHING;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('f6f00002-c9d0-1e2f-3a4b-5c6d7e8f9a0b', 'f6f00001-c9d0-1e2f-3a4b-5c6d7e8f9a0b', 'Developmental Milestones', 1)
ON CONFLICT DO NOTHING;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('f6f00003-c9d0-1e2f-3a4b-5c6d7e8f9a0b', 'f6f00002-c9d0-1e2f-3a4b-5c6d7e8f9a0b', 'Motor & Social Achievements', 1)
ON CONFLICT DO NOTHING;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('f6f00004-c9d0-1e2f-3a4b-5c6d7e8f9a0b', 'f6f00003-c9d0-1e2f-3a4b-5c6d7e8f9a0b', 'Gross Motor Milestones in Infancy', 1)
ON CONFLICT DO NOTHING;

INSERT INTO learning_objects (id, concept_id, object_type, content_payload, sort_order)
VALUES ('f6f00005-c9d0-1e2f-3a4b-5c6d7e8f9a0b', 'f6f00004-c9d0-1e2f-3a4b-5c6d7e8f9a0b', 'TEXT', '### Gross Motor Milestones in the First Year

Development proceeds in a cephalocaudal (head-to-toe) direction.

#### Normal Timeline
- **3 Months**: Head holding (neck control).
- **5 Months**: Rolling over.
- **6 Months**: Sitting with support.
- **8 Months**: Sitting without support.
- **9 Months**: Standing with support (pulling to stand).
- **12 Months**: Walking without support.', 1)
ON CONFLICT DO NOTHING;


-- 10. Content for ENT
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('f7a00001-c9d0-1e2f-3a4b-5c6d7e8f9a0c', 'f7a6a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0c', 'Otology', 1)
ON CONFLICT DO NOTHING;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('f7a00002-c9d0-1e2f-3a4b-5c6d7e8f9a0c', 'f7a00001-c9d0-1e2f-3a4b-5c6d7e8f9a0c', 'Acute Otitis Media', 1)
ON CONFLICT DO NOTHING;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('f7a00003-c9d0-1e2f-3a4b-5c6d7e8f9a0c', 'f7a00002-c9d0-1e2f-3a4b-5c6d7e8f9a0c', 'Etiology & Clinical Features', 1)
ON CONFLICT DO NOTHING;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('f7a00004-c9d0-1e2f-3a4b-5c6d7e8f9a0c', 'f7a00003-c9d0-1e2f-3a4b-5c6d7e8f9a0c', 'Stages of Acute Otitis Media', 1)
ON CONFLICT DO NOTHING;

INSERT INTO learning_objects (id, concept_id, object_type, content_payload, sort_order)
VALUES ('f7a00005-c9d0-1e2f-3a4b-5c6d7e8f9a0c', 'f7a00004-c9d0-1e2f-3a4b-5c6d7e8f9a0c', 'TEXT', '### Stages of Acute Otitis Media (AOM)

AOM is an acute inflammatory condition of the middle ear cleft.

#### The Four Clinical Stages
1. **Stage of Tubal Occlusion**: Eustachian tube is blocked. Symptoms include mild earache and deafness. Tympanic membrane appears retracted.
2. **Stage of Presuppuration**: Inflammatory exudates build up. Severe earache and fever. Congestion of tympanic membrane along the handle of malleus (cartwheel appearance).
3. **Stage of Suppuration**: Pus formation under pressure. Intense throbbing pain, high fever. Tympanic membrane bulges outwards.
4. **Stage of Resolution**: Tympanic membrane ruptures, releasing pus. Earache subsides immediately.', 1)
ON CONFLICT DO NOTHING;


-- 11. Content for Ophthalmology
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('f8b00001-c9d0-1e2f-3a4b-5c6d7e8f9a0d', 'f8b6a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0d', 'Diseases of the Conjunctiva', 1)
ON CONFLICT DO NOTHING;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('f8b00002-c9d0-1e2f-3a4b-5c6d7e8f9a0d', 'f8b00001-c9d0-1e2f-3a4b-5c6d7e8f9a0d', 'Acute Conjunctivitis', 1)
ON CONFLICT DO NOTHING;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('f8b00003-c9d0-1e2f-3a4b-5c6d7e8f9a0d', 'f8b00002-c9d0-1e2f-3a4b-5c6d7e8f9a0d', 'Bacterial & Viral Conjunctivitis', 1)
ON CONFLICT DO NOTHING;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('f8b00004-c9d0-1e2f-3a4b-5c6d7e8f9a0d', 'f8b00003-c9d0-1e2f-3a4b-5c6d7e8f9a0d', 'Clinical Presentation of Bacterial Conjunctivitis', 1)
ON CONFLICT DO NOTHING;

INSERT INTO learning_objects (id, concept_id, object_type, content_payload, sort_order)
VALUES ('f8b00005-c9d0-1e2f-3a4b-5c6d7e8f9a0d', 'f8b00004-c9d0-1e2f-3a4b-5c6d7e8f9a0d', 'TEXT', '### Acute Mucopurulent Conjunctivitis

Commonly known as "pink eye", acute bacterial conjunctivitis is highly contagious.

#### Clinical Presentation
- **Symptoms**: Redness, grittiness (foreign body sensation), mucopurulent discharge, and sticking of eyelids in the morning.
- **Signs**: Conjunctival congestion (most marked in the fornices, fading towards the limbus), chemosis (swelling), and crusting along the lashes.', 1)
ON CONFLICT DO NOTHING;
