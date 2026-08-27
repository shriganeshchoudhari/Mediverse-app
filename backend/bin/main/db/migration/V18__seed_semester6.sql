-- 1. Seed Semester 6 under Year 3 (ID: 'b4c5d6e7-f8a9-0b1c-2d3e-4f5a6b7c8d9e')
INSERT INTO semesters (id, year_id, semester_number)
VALUES ('c8d9e0f1-b2c3-4d5e-6f7a-8b9c0d1e2f3a', 'b4c5d6e7-f8a9-0b1c-2d3e-4f5a6b7c8d9e', 6)
ON CONFLICT DO NOTHING;

-- 2. Seed Subjects for Semester 6
-- Community Medicine II
INSERT INTO subjects (id, semester_id, title, code, category)
VALUES ('f1b5b2c3-d4e5-6f7a-8b9c-0d1e2f3a4b5d', 'c8d9e0f1-b2c3-4d5e-6f7a-8b9c0d1e2f3a', 'Community Medicine II', 'CM-302', 'Clinical')
ON CONFLICT DO NOTHING;

-- Forensic Medicine II
INSERT INTO subjects (id, semester_id, title, code, category)
VALUES ('f2c5c6d7-e8f9-0a1b-2c3d-4e5f6a7b8c9e', 'c8d9e0f1-b2c3-4d5e-6f7a-8b9c0d1e2f3a', 'Forensic Medicine II', 'FM-302', 'Para-Clinical')
ON CONFLICT DO NOTHING;

-- Medicine II
INSERT INTO subjects (id, semester_id, title, code, category)
VALUES ('f3d5d6e7-f9a0-1b2c-3d4e-5f6a7b8c9d0e', 'c8d9e0f1-b2c3-4d5e-6f7a-8b9c0d1e2f3a', 'Medicine II', 'MED-302', 'Clinical')
ON CONFLICT DO NOTHING;

-- Surgery II
INSERT INTO subjects (id, semester_id, title, code, category)
VALUES ('f4e5e6f7-a0b1-2c3d-4e5f-6a7b8c9d0e1f', 'c8d9e0f1-b2c3-4d5e-6f7a-8b9c0d1e2f3a', 'Surgery II', 'SURG-302', 'Clinical')
ON CONFLICT DO NOTHING;

-- Obstetrics & Gynecology II
INSERT INTO subjects (id, semester_id, title, code, category)
VALUES ('f5f5f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a', 'c8d9e0f1-b2c3-4d5e-6f7a-8b9c0d1e2f3a', 'Obstetrics & Gynecology II', 'OBG-302', 'Clinical')
ON CONFLICT DO NOTHING;

-- Pediatrics II
INSERT INTO subjects (id, semester_id, title, code, category)
VALUES ('f6a6a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0b', 'c8d9e0f1-b2c3-4d5e-6f7a-8b9c0d1e2f3a', 'Pediatrics II', 'PED-302', 'Clinical')
ON CONFLICT DO NOTHING;

-- ENT II
INSERT INTO subjects (id, semester_id, title, code, category)
VALUES ('f7b6a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0c', 'c8d9e0f1-b2c3-4d5e-6f7a-8b9c0d1e2f3a', 'ENT II', 'ENT-302', 'Clinical')
ON CONFLICT DO NOTHING;

-- Ophthalmology II
INSERT INTO subjects (id, semester_id, title, code, category)
VALUES ('f8c6a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0d', 'c8d9e0f1-b2c3-4d5e-6f7a-8b9c0d1e2f3a', 'Ophthalmology II', 'OPH-302', 'Clinical')
ON CONFLICT DO NOTHING;

-- Clinical postings III
INSERT INTO subjects (id, semester_id, title, code, category)
VALUES ('f9d6a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0e', 'c8d9e0f1-b2c3-4d5e-6f7a-8b9c0d1e2f3a', 'Clinical postings III', 'CLIN-302', 'Clinical')
ON CONFLICT DO NOTHING;

-- Electives
INSERT INTO subjects (id, semester_id, title, code, category)
VALUES ('f0e6a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0f', 'c8d9e0f1-b2c3-4d5e-6f7a-8b9c0d1e2f3a', 'Electives', 'ELEC-301', 'Clinical')
ON CONFLICT DO NOTHING;


-- 3. Content for Community Medicine II
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('f1b00001-d4e5-6f7a-8b9c-0d1e2f3a4b5d', 'f1b5b2c3-d4e5-6f7a-8b9c-0d1e2f3a4b5d', 'Non-Communicable Diseases', 1)
ON CONFLICT DO NOTHING;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('f1b00002-d4e5-6f7a-8b9c-0d1e2f3a4b5d', 'f1b00001-d4e5-6f7a-8b9c-0d1e2f3a4b5d', 'Epidemiology of Diabetes & Hypertension', 1)
ON CONFLICT DO NOTHING;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('f1b00003-d4e5-6f7a-8b9c-0d1e2f3a4b5d', 'f1b00002-d4e5-6f7a-8b9c-0d1e2f3a4b5d', 'Risk Factors & Prevention Levels', 1)
ON CONFLICT DO NOTHING;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('f1b00004-d4e5-6f7a-8b9c-0d1e2f3a4b5d', 'f1b00003-d4e5-6f7a-8b9c-0d1e2f3a4b5d', 'Levels of Prevention in Hypertension', 1)
ON CONFLICT DO NOTHING;

INSERT INTO learning_objects (id, concept_id, object_type, content_payload, sort_order)
VALUES ('f1b00005-d4e5-6f7a-8b9c-0d1e2f3a4b5d', 'f1b00004-d4e5-6f7a-8b9c-0d1e2f3a4b5d', 'TEXT', '### Prevention Levels for Hypertension

Hypertension control strategies span three levels of prevention:

1. **Primary Prevention**: 
   - **Population Strategy**: Dietary salt reduction, weight control, physical activity, and avoiding tobacco.
   - **High-Risk Strategy**: Identifying individuals with family history or borderline BP for targeted lifestyle modifications.
2. **Secondary Prevention**: Early detection via routine screening and prompt treatment with antihypertensive medications.
3. **Tertiary Prevention**: Preventing complications like stroke, myocardial infarction, and renal failure via rehabilitation and compliance.', 1)
ON CONFLICT DO NOTHING;


-- 4. Content for Forensic Medicine II
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('f2c00001-e8f9-0a1b-2c3d-4e5f6a7b8c9e', 'f2c5c6d7-e8f9-0a1b-2c3d-4e5f6a7b8c9e', 'Forensic Psychiatry', 1)
ON CONFLICT DO NOTHING;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('f2c00002-e8f9-0a1b-2c3d-4e5f6a7b8c9e', 'f2c00001-e8f9-0a1b-2c3d-4e5f6a7b8c9e', 'Mental Health & Jurisprudence', 1)
ON CONFLICT DO NOTHING;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('f2c00003-e8f9-0a1b-2c3d-4e5f6a7b8c9e', 'f2c00002-e8f9-0a1b-2c3d-4e5f6a7b8c9e', 'Civil & Criminal Responsibilities of Insane', 1)
ON CONFLICT DO NOTHING;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('f2c00004-e8f9-0a1b-2c3d-4e5f6a7b8c9e', 'f2c00003-e8f9-0a1b-2c3d-4e5f6a7b8c9e', 'McNaughten Rules of Criminal Responsibility', 1)
ON CONFLICT DO NOTHING;

INSERT INTO learning_objects (id, concept_id, object_type, content_payload, sort_order)
VALUES ('f2c00005-e8f9-0a1b-2c3d-4e5f6a7b8c9e', 'f2c00004-e8f9-0a1b-2c3d-4e5f6a7b8c9e', 'TEXT', '### The McNaughten Rules

These rules form the basis of the defense of insanity in criminal jurisprudence.

#### Key Principles
To establish a defense on the ground of insanity, it must be clearly proved that:
1. At the time of committing the act, the accused was laboring under such a defect of reason, from disease of the mind.
2. They did not know the nature and quality of the act they were doing.
3. Or, if they did know it, they did not know that what they were doing was wrong.', 1)
ON CONFLICT DO NOTHING;


-- 5. Content for Medicine II
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('f3d00001-f9a0-1b2c-3d4e-5f6a7b8c9d0e', 'f3d5d6e7-f9a0-1b2c-3d4e-5f6a7b8c9d0e', 'Systemic Internal Medicine', 1)
ON CONFLICT DO NOTHING;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('f3d00002-f9a0-1b2c-3d4e-5f6a7b8c9d0e', 'f3d00001-f9a0-1b2c-3d4e-5f6a7b8c9d0e', 'Gastrointestinal Disorders', 1)
ON CONFLICT DO NOTHING;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('f3d00003-f9a0-1b2c-3d4e-5f6a7b8c9d0e', 'f3d00002-f9a0-1b2c-3d4e-5f6a7b8c9d0e', 'Peptic Ulcer Disease Pathogenesis', 1)
ON CONFLICT DO NOTHING;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('f3d00004-f9a0-1b2c-3d4e-5f6a7b8c9d0e', 'f3d00003-f9a0-1b2c-3d4e-5f6a7b8c9d0e', 'Role of Helicobacter pylori in Ulcers', 1)
ON CONFLICT DO NOTHING;

INSERT INTO learning_objects (id, concept_id, object_type, content_payload, sort_order)
VALUES ('f3d00005-f9a0-1b2c-3d4e-5f6a7b8c9d0e', 'f3d00004-f9a0-1b2c-3d4e-5f6a7b8c9d0e', 'TEXT', '### Helicobacter pylori in PUD

*Helicobacter pylori* is a gram-negative flagellated spiral bacterium strongly linked to peptic ulcers.

#### Mechanisms of Damage
- **Urease Activity**: Converts urea into ammonia and bicarbonate, buffering gastric acid and creating a local alkaline niche.
- **Cytotoxins (CagA & VacA)**: CagA alters host cell signaling, causing inflammation. VacA induces vacuolation in epithelial cells.
- **Mucinase & Protease**: Degrades the protective mucus gel layer, exposing mucosal cells to corrosive gastric acid.', 1)
ON CONFLICT DO NOTHING;


-- 6. Content for Surgery II
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('f4e00001-a0b1-2c3d-4e5f-6a7b8c9d0e1f', 'f4e5e6f7-a0b1-2c3d-4e5f-6a7b8c9d0e1f', 'Systemic Surgery & Abdomen', 1)
ON CONFLICT DO NOTHING;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('f4e00002-a0b1-2c3d-4e5f-6a7b8c9d0e1f', 'f4e00001-a0b1-2c3d-4e5f-6a7b8c9d0e1f', 'Acute Appendicitis', 1)
ON CONFLICT DO NOTHING;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('f4e00003-a0b1-2c3d-4e5f-6a7b8c9d0e1f', 'f4e00002-a0b1-2c3d-4e5f-6a7b8c9d0e1f', 'Clinical Presentation & Alvarado Score', 1)
ON CONFLICT DO NOTHING;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('f4e00004-a0b1-2c3d-4e5f-6a7b8c9d0e1f', 'f4e00003-a0b1-2c3d-4e5f-6a7b8c9d0e1f', 'Alvarado Scoring Criteria', 1)
ON CONFLICT DO NOTHING;

INSERT INTO learning_objects (id, concept_id, object_type, content_payload, sort_order)
VALUES ('f4e00005-a0b1-2c3d-4e5f-6a7b8c9d0e1f', 'f4e00004-a0b1-2c3d-4e5f-6a7b8c9d0e1f', 'TEXT', '### Alvarado Score for Appendicitis

The Alvarado score is a clinical scoring system used to diagnose acute appendicitis.

#### Scoring Parameters (MANTRELS)
- **M**igration of pain to Right Iliac Fossa (1 point)
- **A**norexia (1 point)
- **N**ausea/Vomiting (1 point)
- **T**enderness in Right Iliac Fossa (2 points)
- **R**ebound tenderness (1 point)
- **E**levated temperature >= 37.3°C (1 point)
- **L**eukocytosis >= 10,000/mm³ (2 points)
- **S**hift to the left (neutrophilia) (1 point)

#### Interpretation
- **Score 5-6**: Compatible with appendicitis (observation recommended).
- **Score 7-8**: Probable appendicitis (surgical evaluation recommended).
- **Score 9-10**: Definite appendicitis (immediate surgical intervention).', 1)
ON CONFLICT DO NOTHING;


-- 7. Content for Obstetrics & Gynecology II
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('f5f00001-b8c9-0d1e-2f3a-4b5c6d7e8f9a', 'f5f5f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a', 'Gynecology & Menstrual Disorders', 1)
ON CONFLICT DO NOTHING;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('f5f00002-b8c9-0d1e-2f3a-4b5c6d7e8f9a', 'f5f00001-b8c9-0d1e-2f3a-4b5c6d7e8f9a', 'Abnormal Uterine Bleeding', 1)
ON CONFLICT DO NOTHING;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('f5f00003-b8c9-0d1e-2f3a-4b5c6d7e8f9a', 'f5f00002-b8c9-0d1e-2f3a-4b5c6d7e8f9a', 'PALM-COEIN Classification', 1)
ON CONFLICT DO NOTHING;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('f5f00004-b8c9-0d1e-2f3a-4b5c6d7e8f9a', 'f5f00003-b8c9-0d1e-2f3a-4b5c6d7e8f9a', 'Structural Etiologies (PALM)', 1)
ON CONFLICT DO NOTHING;

INSERT INTO learning_objects (id, concept_id, object_type, content_payload, sort_order)
VALUES ('f5f00005-b8c9-0d1e-2f3a-4b5c6d7e8f9a', 'f5f00004-b8c9-0d1e-2f3a-4b5c6d7e8f9a', 'TEXT', '### FIGO PALM-COEIN Classification

Abnormal Uterine Bleeding (AUB) etiologies are classified into structural and non-structural causes.

#### Structural Causes (PALM)
- **P**olyp: Benign epithelial projections.
- **A**denomyosis: Endometrial glands and stroma present within the myometrium.
- **L**eiomyoma: Benign smooth muscle tumors (fibroids), classified as submucosal or others.
- **M**alignancy & hyperplasia: Atypical endometrial changes or carcinoma.', 1)
ON CONFLICT DO NOTHING;


-- 8. Content for Pediatrics II
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('f6a00001-c9d0-1e2f-3a4b-5c6d7e8f9a0b', 'f6a6a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0b', 'Neonatology & Neonatal Care', 1)
ON CONFLICT DO NOTHING;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('f6a00002-c9d0-1e2f-3a4b-5c6d7e8f9a0b', 'f6a00001-c9d0-1e2f-3a4b-5c6d7e8f9a0b', 'Neonatal Sepsis', 1)
ON CONFLICT DO NOTHING;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('f6a00003-c9d0-1e2f-3a4b-5c6d7e8f9a0b', 'f6a00002-c9d0-1e2f-3a4b-5c6d7e8f9a0b', 'Etiology & Clinical Signs', 1)
ON CONFLICT DO NOTHING;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('f6a00004-c9d0-1e2f-3a4b-5c6d7e8f9a0b', 'f6a00003-c9d0-1e2f-3a4b-5c6d7e8f9a0b', 'Early Onset vs Late Onset Sepsis', 1)
ON CONFLICT DO NOTHING;

INSERT INTO learning_objects (id, concept_id, object_type, content_payload, sort_order)
VALUES ('f6a00005-c9d0-1e2f-3a4b-5c6d7e8f9a0b', 'f6a00004-c9d0-1e2f-3a4b-5c6d7e8f9a0b', 'TEXT', '### Neonatal Sepsis Classification

Neonatal sepsis is a systemic infection occurring in the first 28 days of life.

#### Early-Onset Sepsis (EOS)
- **Timing**: Presents within 72 hours of birth.
- **Source**: Ascending vertical transmission from the maternal genital tract.
- **Common Pathogens**: Group B Streptococcus (GBS), *Escherichia coli*.

#### Late-Onset Sepsis (LOS)
- **Timing**: Presents after 72 hours of birth.
- **Source**: Nosocomial (hospital-acquired) or community-acquired.
- **Common Pathogens**: Coagulase-negative Staphylococci, *Klebsiella pneumoniae*, *Pseudomonas*.', 1)
ON CONFLICT DO NOTHING;


-- 9. Content for ENT II
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('f7b00001-c9d0-1e2f-3a4b-5c6d7e8f9a0c', 'f7b6a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0c', 'Rhinology & Sinus Diseases', 1)
ON CONFLICT DO NOTHING;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('f7b00002-c9d0-1e2f-3a4b-5c6d7e8f9a0c', 'f7b00001-c9d0-1e2f-3a4b-5c6d7e8f9a0c', 'Acute Sinusitis', 1)
ON CONFLICT DO NOTHING;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('f7b00003-c9d0-1e2f-3a4b-5c6d7e8f9a0c', 'f7b00002-c9d0-1e2f-3a4b-5c6d7e8f9a0c', 'Pathophysiology & Maxillary Sinusitis', 1)
ON CONFLICT DO NOTHING;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('f7b00004-c9d0-1e2f-3a4b-5c6d7e8f9a0c', 'f7b00003-c9d0-1e2f-3a4b-5c6d7e8f9a0c', 'Clinical Features of Maxillary Sinusitis', 1)
ON CONFLICT DO NOTHING;

INSERT INTO learning_objects (id, concept_id, object_type, content_payload, sort_order)
VALUES ('f7b00005-c9d0-1e2f-3a4b-5c6d7e8f9a0c', 'f7b00004-c9d0-1e2f-3a4b-5c6d7e8f9a0c', 'TEXT', '### Acute Maxillary Sinusitis

The maxillary sinus is the most commonly infected paranasal sinus.

#### Clinical Presentation
- **Symptoms**: Facial pain/pressure over the cheek (worse on bending forward), nasal discharge, and nasal blockage.
- **Signs**: Tenderness over the anterior wall of maxillary sinus (canine fossa), congestion of middle meatus mucosa, and post-nasal drip.', 1)
ON CONFLICT DO NOTHING;


-- 10. Content for Ophthalmology II
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('f8c00001-c9d0-1e2f-3a4b-5c6d7e8f9a0d', 'f8c6a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0d', 'Diseases of the Lens', 1)
ON CONFLICT DO NOTHING;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('f8c00002-c9d0-1e2f-3a4b-5c6d7e8f9a0d', 'f8c00001-c9d0-1e2f-3a4b-5c6d7e8f9a0d', 'Senile Cataract', 1)
ON CONFLICT DO NOTHING;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('f8c00003-c9d0-1e2f-3a4b-5c6d7e8f9a0d', 'f8c00002-c9d0-1e2f-3a4b-5c6d7e8f9a0d', 'Pathogenesis & Surgical Options', 1)
ON CONFLICT DO NOTHING;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('f8c00004-c9d0-1e2f-3a4b-5c6d7e8f9a0d', 'f8c00003-c9d0-1e2f-3a4b-5c6d7e8f9a0d', 'Modern Cataract Surgical Techniques', 1)
ON CONFLICT DO NOTHING;

INSERT INTO learning_objects (id, concept_id, object_type, content_payload, sort_order)
VALUES ('f8c00005-c9d0-1e2f-3a4b-5c6d7e8f9a0d', 'f8c00004-c9d0-1e2f-3a4b-5c6d7e8f9a0d', 'TEXT', '### Surgical Management of Cataract

Cataract surgery is indicated when visual impairment interferes with daily activities.

#### Phacoemulsification
- The modern gold standard procedure.
- Uses ultrasonic energy to fragment and emulsify the cataractous lens nucleus through a micro-incision (2.2 to 2.8 mm).
- Foldable Intraocular Lens (IOL) is inserted into the capsular bag.

#### SICS (Manual Small Incision Cataract Surgery)
- Low-cost alternative. Large sutureless tunnel incision (6 mm) is constructed, and lens nucleus is delivered manually.', 1)
ON CONFLICT DO NOTHING;


-- 11. Content for Clinical postings III
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('f9d00001-c9d0-1e2f-3a4b-5c6d7e8f9a0e', 'f9d6a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0e', 'Advanced Surgical Ward Postings', 1)
ON CONFLICT DO NOTHING;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('f9d00002-c9d0-1e2f-3a4b-5c6d7e8f9a0e', 'f9d00001-c9d0-1e2f-3a4b-5c6d7e8f9a0e', 'Abdominal Examination', 1)
ON CONFLICT DO NOTHING;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('f9d00003-c9d0-1e2f-3a4b-5c6d7e8f9a0e', 'f9d00002-c9d0-1e2f-3a4b-5c6d7e8f9a0e', 'Inspection & Palpation of Abdomen', 1)
ON CONFLICT DO NOTHING;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('f9d00004-c9d0-1e2f-3a4b-5c6d7e8f9a0e', 'f9d00003-c9d0-1e2f-3a4b-5c6d7e8f9a0e', 'Palpating for Organomegaly', 1)
ON CONFLICT DO NOTHING;

INSERT INTO learning_objects (id, concept_id, object_type, content_payload, sort_order)
VALUES ('f9d00005-c9d0-1e2f-3a4b-5c6d7e8f9a0e', 'f9d00004-c9d0-1e2f-3a4b-5c6d7e8f9a0e', 'TEXT', '### Abdominal Palpation

Palpation confirms inspection findings and assesses organ size, tenderness, and masses.

#### Light Palpation
- Assess for muscle guarding, rigidity, and superficial tenderness.

#### Deep Palpation
- **Liver**: Begin in the Right Iliac Fossa, moving up towards the right costal margin with the patient''s respiration.
- **Spleen**: Palpate from the Right Iliac Fossa diagonally towards the Left Hypochondrium. Spleen must be enlarged to at least 2-3 times its normal size to be palpable.', 1)
ON CONFLICT DO NOTHING;


-- 12. Content for Electives
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('f0e00001-c9d0-1e2f-3a4b-5c6d7e8f9a0f', 'f0e6a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0f', 'Research Methodology Postings', 1)
ON CONFLICT DO NOTHING;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('f0e00002-c9d0-1e2f-3a4b-5c6d7e8f9a0f', 'f0e00001-c9d0-1e2f-3a4b-5c6d7e8f9a0f', 'Introduction to Clinical Research', 1)
ON CONFLICT DO NOTHING;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('f0e00003-c9d0-1e2f-3a4b-5c6d7e8f9a0f', 'f0e00002-c9d0-1e2f-3a4b-5c6d7e8f9a0f', 'Study Designs & Randomization', 1)
ON CONFLICT DO NOTHING;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('f0e00004-c9d0-1e2f-3a4b-5c6d7e8f9a0f', 'f0e00003-c9d0-1e2f-3a4b-5c6d7e8f9a0f', 'Randomized Controlled Trial (RCT) Design', 1)
ON CONFLICT DO NOTHING;

INSERT INTO learning_objects (id, concept_id, object_type, content_payload, sort_order)
VALUES ('f0e00005-c9d0-1e2f-3a4b-5c6d7e8f9a0f', 'f0e00004-c9d0-1e2f-3a4b-5c6d7e8f9a0f', 'TEXT', '### Randomized Controlled Trials (RCTs)

RCTs are the gold standard study design for establishing causal relationships.

#### Key Features of RCTs
- **Randomization**: Assigns participants to treatment or control groups by chance, minimizing confounding.
- **Blinding**: 
  - **Single Blind**: Participant doesn''t know the allocation.
  - **Double Blind**: Neither participant nor investigator knows the allocation.
  - **Triple Blind**: Participant, investigator, and data analyst do not know.', 1)
ON CONFLICT DO NOTHING;
