-- V195: Remediate curriculum gaps: Seed ECE-101 curriculum tree & update AETCOM assessment questions

-- 1. Seed Units, Chapters, Topics, Concepts for ECE-101
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('e1e1e1e1-0000-0000-0000-000000000001', 'd8e9f0a1-b2c3-4d5e-6f7a-8b9c0d1e2f3a', 'Unit 1: Hospital Ward Observation & Bedside Communication', 1)
ON CONFLICT (id) DO NOTHING;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('e2e2e2e2-0000-0000-0000-000000000001', 'e1e1e1e1-0000-0000-0000-000000000001', 'Chapter 1: Patient-Doctor Interaction & Vital Signs in Clinical Setting', 1)
ON CONFLICT (id) DO NOTHING;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('e3e3e3e3-0000-0000-0000-000000000001', 'e2e2e2e2-0000-0000-0000-000000000001', 'Bedside Etiquette, Empathy & Structured Clinical Observation', 1)
ON CONFLICT (id) DO NOTHING;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('e4e4e4e4-0000-0000-0000-000000000001', 'e3e3e3e3-0000-0000-0000-000000000001', 'Early Clinical Exposure: Bedside History Taking & Vital Signs Assessment', 1)
ON CONFLICT (id) DO NOTHING;

INSERT INTO learning_objects (id, concept_id, object_type, content_payload, sort_order)
VALUES ('e5e5e5e5-0000-0000-0000-000000000001', 'e4e4e4e4-0000-0000-0000-000000000001', 'TEXT', 
'{"title": "Early Clinical Exposure (ECE-101): Hospital Protocols & Communication", "content": "Early Clinical Exposure integrates basic science knowledge with real clinical relevance. Students observe physician-patient communication, clinical handoffs, vital signs recording, and ethical bedside demeanor."}', 1)
ON CONFLICT (id) DO NOTHING;

-- 2. Update AETCOM Bioethics Quiz Metadata to Substantive Medical Ethics Questions
UPDATE content_blocks 
SET metadata = '{
  "title": "AETCOM: The 4 Principles of Bioethics, Informed Consent & Decision-Making Capacity (CURB) — Core Assessment",
  "questions": [
    {
      "question": "Which of the four Beauchamp and Childress bioethical principles is directly prioritized when a competent adult patient refuses a life-saving blood transfusion on religious grounds?",
      "options": [
        "Autonomy",
        "Beneficence",
        "Non-Maleficence",
        "Distributive Justice"
      ],
      "correctIndex": 0,
      "explanation": "Respect for Autonomy grants a competent individual the moral and legal right to accept or refuse medical treatments based on their own personal values and beliefs, even if that refusal leads to death."
    },
    {
      "question": "Under the CURB criteria for clinical decision-making capacity, which of the following confirms that a patient has decision-making capacity?",
      "options": [
        "Ability to Communicate a choice, Understand relevant information, Reason about consequences, and Believe/appreciate the clinical situation",
        "Having a high Mini-Mental State Examination (MMSE) score greater than 28/30 regardless of delirium",
        "Consent obtained from the primary caregiver without patient assent",
        "Formal judicial declaration of competence by a magistrate"
      ],
      "correctIndex": 0,
      "explanation": "Clinical capacity is task-specific and evaluated using the CURB mnemonic: Communicate a choice, Understand information, Reason through risks/benefits, and Believe/Appreciate how the decision applies to oneself."
    }
  ]
}'::jsonb
WHERE id IN (
  SELECT cb.id FROM content_blocks cb 
  JOIN lessons l ON cb.lesson_id = l.id 
  WHERE cb.type = 'QUIZ' AND l.title ILIKE '%4 Principles of Bioethics%'
);

UPDATE content_blocks 
SET metadata = '{
  "title": "AETCOM: Confidentiality, Tarasoff Duty to Warn & Medical Malpractice (The 4 Ds) — Core Assessment",
  "questions": [
    {
      "question": "Under the landmark Tarasoff ruling, when is a physician legally and ethically permitted (and mandated) to breach patient confidentiality?",
      "options": [
        "When a patient communicates an explicit, credible threat of imminent physical harm against an identifiable third party",
        "Whenever any relative of the patient requests medical records for insurance purposes",
        "When a patient admits to a minor past misdemeanor during history taking",
        "Whenever the medical team disagrees with the patient lifestyle choices"
      ],
      "correctIndex": 0,
      "explanation": "The Tarasoff duty to protect/warn arises when a clinician determines that a patient presents a serious and imminent danger of violence to a foreseeable and identifiable victim."
    },
    {
      "question": "To establish civil medical negligence (malpractice), which four legal elements (the 4 Ds) must all be proven by the plaintiff?",
      "options": [
        "Duty of care, Dereliction (breach of duty), Direct causation, and Damages",
        "Diagnosis, Documentation, Dose calculation, and Discharge",
        "Delirium, Dementia, Depression, and Disability",
        "Duty, Decision-making, Disclosure, and Documentation"
      ],
      "correctIndex": 0,
      "explanation": "A successful medical malpractice tort requires proving the 4 Ds: Duty of care existed, Dereliction (breach of the standard of care), Direct causation between breach and harm, and quantifiable Damages."
    }
  ]
}'::jsonb
WHERE id IN (
  SELECT cb.id FROM content_blocks cb 
  JOIN lessons l ON cb.lesson_id = l.id 
  WHERE cb.type = 'QUIZ' AND l.title ILIKE '%Tarasoff%'
);

UPDATE content_blocks 
SET metadata = '{
  "title": "AETCOM: End-of-Life Ethics, The Doctrine of Double Effect & Brain Death Criteria — Core Assessment",
  "questions": [
    {
      "question": "Which of the following scenarios is ethically justified under the Doctrine of Double Effect in palliative end-of-life care?",
      "options": [
        "Administering escalating doses of opioids with the primary intention of relieving intractable pain, foreseeing that it may inadvertently hasten respiratory depression",
        "Administering a lethal potassium chloride bolus with the primary intention of ending suffering",
        "Withholding all analgesics to prevent any risk of sedation",
        "Discontinuing comfort care against the family wishes to reallocate ICU beds"
      ],
      "correctIndex": 0,
      "explanation": "The Doctrine of Double Effect justifies providing aggressive symptom control (e.g., high-dose morphine) when the primary intention is pain relief, even if the unintended but foreseen side effect is earlier death."
    },
    {
      "question": "According to the American Academy of Neurology (AAN) guidelines, which prerequisite must be satisfied BEFORE conducting clinical brain death testing?",
      "options": [
        "Establishment of irreversible coma due to a known cause, normalization of core temperature (>=36°C), and absence of CNS-depressant drugs or neuromuscular blockade",
        "Presence of isoelectric EEG for 72 consecutive hours without clinical examination",
        "Confirmation of cardiac arrest and cessation of mechanical ventilation for 30 minutes",
        "Consent obtained from at least three independent medical specialists and a hospital ethics committee"
      ],
      "correctIndex": 0,
      "explanation": "Brain death determination requires establishing an irreversible cause, excluding reversible confounders (hypothermia <36°C, severe metabolic derangements, CNS-depressant medications, neuromuscular blockers), and documenting brainstem areflexia plus apnea."
    }
  ]
}'::jsonb
WHERE id IN (
  SELECT cb.id FROM content_blocks cb 
  JOIN lessons l ON cb.lesson_id = l.id 
  WHERE cb.type = 'QUIZ' AND l.title ILIKE '%Double Effect%'
);
