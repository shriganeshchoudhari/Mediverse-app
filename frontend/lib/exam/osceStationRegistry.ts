/**
 * osceStationRegistry.ts
 * Comprehensive multi-domain Objective Structured Clinical Examination (OSCE) repository.
 * Standardized according to NMC CBME, USMLE Step 2 CS, and UK GMC PLAB 2 clinical examination guidelines.
 * Location: frontend/lib/exam/osceStationRegistry.ts
 */

export type OsceDomain =
  | 'ALLOPATHIC_MBBS'
  | 'NURSING_BSC'
  | 'DENTAL_BDS'
  | 'PHYSIOTHERAPY_BPT'
  | 'AYUSH_BAMS'
  | 'PHARMACY_BPHARM';

export type OsceStationType =
  | 'PROCEDURAL'
  | 'EMERGENCY'
  | 'HISTORY_TAKING'
  | 'COMMUNICATION'
  | 'EXAMINATION';

export type OsceDimension =
  | 'COMMUNICATION'
  | 'CLINICAL_SKILL'
  | 'PATIENT_SAFETY'
  | 'DIAGNOSTIC_REASONING'
  | 'MANAGEMENT';

export interface OsceChecklistItem {
  id: string;
  dimension: OsceDimension;
  text: string;
  marks: number;
  isCriticalSafety?: boolean;
  examinerNote?: string;
}

export interface OsceStation {
  id: string;
  title: string;
  domain: OsceDomain;
  domainTitle: string;
  stationType: OsceStationType;
  timeLimitMinutes: number;
  passingScorePct: number;
  difficulty: 'Core' | 'Standard' | 'Advanced';
  candidateBrief: string;
  patientProfile: {
    name: string;
    age: number;
    gender: string;
    setting: string;
    chiefComplaint: string;
  };
  actorCues: { trigger: string; response: string }[];
  checklist: OsceChecklistItem[];
  criticalFailTriggers: string[];
  examinerGuidance: string[];
  modelDebrief: string;
}

export const OSCE_STATION_REGISTRY: OsceStation[] = [
  // 1. ALLOPATHIC MBBS - Basic Life Support & High-Quality CPR
  {
    id: 'osce-mbbs-cpr',
    title: 'Adult Basic Life Support & High-Quality Resuscitation',
    domain: 'ALLOPATHIC_MBBS',
    domainTitle: 'Allopathic Medicine (MBBS)',
    stationType: 'EMERGENCY',
    timeLimitMinutes: 7,
    passingScorePct: 75,
    difficulty: 'Core',
    candidateBrief:
      'You are in the outpatient clinic waiting area. A 55-year-old male visitor suddenly collapses to the floor. The scene is safe. Manage this patient in accordance with standard 2020-2025 AHA/ERC BLS Guidelines.',
    patientProfile: {
      name: 'Simulated Patient Mannequin (Mr. Satish Sharma)',
      age: 55,
      gender: 'Male',
      setting: 'Hospital Outpatient Lobby',
      chiefComplaint: 'Unwitnessed sudden collapse, unresponsiveness',
    },
    actorCues: [
      { trigger: 'Tap shoulders and shout: "Are you okay?"', response: 'No movement, no vocalization, eyes closed.' },
      { trigger: 'Look for breathing and check carotid pulse for 5-10s', response: 'Examiner cue: "Carotid pulse absent, agonal gasping only."' },
      { trigger: 'Call for help / AED request', response: 'Nurse assistant arrives with manual bag-valve mask and AED.' },
    ],
    checklist: [
      {
        id: 'cpr-01',
        dimension: 'PATIENT_SAFETY',
        text: 'Ensures scene safety and applies appropriate PPE before approaching patient.',
        marks: 2,
        isCriticalSafety: true,
      },
      {
        id: 'cpr-02',
        dimension: 'CLINICAL_SKILL',
        text: 'Assesses responsiveness by tapping both shoulders firmly and shouting into both ears.',
        marks: 2,
      },
      {
        id: 'cpr-03',
        dimension: 'COMMUNICATION',
        text: 'Directly mobilizes a bystander/team member: "Call Code Blue and bring the defibrillator / AED STAT!"',
        marks: 2,
      },
      {
        id: 'cpr-04',
        dimension: 'CLINICAL_SKILL',
        text: 'Simultaneously checks carotid pulse and breathing for at least 5 but no more than 10 seconds.',
        marks: 3,
        isCriticalSafety: true,
        examinerNote: 'Failure to check pulse or spending >10s is a major protocol deviation.',
      },
      {
        id: 'cpr-05',
        dimension: 'CLINICAL_SKILL',
        text: 'Initiates high-quality chest compressions on lower half of sternum with interlaced fingers.',
        marks: 4,
      },
      {
        id: 'cpr-06',
        dimension: 'CLINICAL_SKILL',
        text: 'Maintains compression rate of 100-120 bpm and depth of 5-6 cm (2-2.4 inches) with full chest recoil.',
        marks: 4,
        isCriticalSafety: true,
      },
      {
        id: 'cpr-07',
        dimension: 'MANAGEMENT',
        text: 'Performs 30:2 compression-to-ventilation ratio with head-tilt chin-lift and tight mask seal.',
        marks: 3,
      },
      {
        id: 'cpr-08',
        dimension: 'PATIENT_SAFETY',
        text: 'When AED arrives, powers ON, applies pads (anterolateral), ensures "ALL CLEAR" during rhythm analysis.',
        marks: 4,
        isCriticalSafety: true,
      },
      {
        id: 'cpr-09',
        dimension: 'MANAGEMENT',
        text: 'Delivers shock when advised and immediately resumes CPR starting with compressions without pulse check.',
        marks: 3,
      },
      {
        id: 'cpr-10',
        dimension: 'COMMUNICATION',
        text: 'Delivers structured SBAR handoff to arriving Advanced Cardiac Life Support (ACLS) code team.',
        marks: 3,
      },
    ],
    criticalFailTriggers: [
      'Failure to check carotid pulse before starting compressions',
      'Failure to shout "STAND CLEAR" before AED shock delivery',
      'Interruption of chest compressions exceeding 10 seconds',
    ],
    examinerGuidance: [
      'Candidate must demonstrate uninterrupted continuous compressions with elbows locked.',
      'Check if candidate allows full thoracic chest recoil after each downward compression stroke.',
    ],
    modelDebrief:
      'High-yield criteria: immediate recognition of cardiac arrest, prompt activation of emergency response, minimal compression pauses (<10s), depth 5-6 cm, rate 100-120/min, and immediate resumption of CPR post-shock.',
  },

  // 2. ALLOPATHIC MBBS - Acute Anaphylaxis Recognition & Emergency Epinephrine
  {
    id: 'osce-mbbs-anaphylaxis',
    title: 'Acute Anaphylaxis Emergency Recognition & Epinephrine Protocol',
    domain: 'ALLOPATHIC_MBBS',
    domainTitle: 'Allopathic Medicine (MBBS)',
    stationType: 'EMERGENCY',
    timeLimitMinutes: 7,
    passingScorePct: 75,
    difficulty: 'Standard',
    candidateBrief:
      'A 24-year-old female presents to the urgent care clinic 15 minutes after receiving an intramuscular injection of Ceftriaxone. She complains of sudden throat tightness, facial itching, and dizziness. Assess and manage.',
    patientProfile: {
      name: 'Pooja Varma',
      age: 24,
      gender: 'Female',
      setting: 'Urgent Care Treatment Room',
      chiefComplaint: 'Throat tightness, hoarseness, urticarial wheals, lightheadedness',
    },
    actorCues: [
      { trigger: 'Candidate introduces self and asks: "How are you feeling?"', response: '(Speaking in raspy, hoarse voice): "Doctor, my throat feels like it is closing up... I can barely catch my breath... my chest is itching."' },
      { trigger: 'Ask about allergies', response: '"I was told I had a rash from Amoxicillin as a child, but the doctor gave me Ceftriaxone today for a sinus infection."' },
      { trigger: 'Inspect skin and airway', response: 'Examiner cue: "Diffuse erythematous urticaria on neck and chest. Stridor heard over larynx. BP 78/48, HR 128, SpO2 91%."' },
    ],
    checklist: [
      {
        id: 'anaph-01',
        dimension: 'COMMUNICATION',
        text: 'Introduces self clearly, maintains calm reassurance, and positions patient supine with legs elevated.',
        marks: 2,
      },
      {
        id: 'anaph-02',
        dimension: 'DIAGNOSTIC_REASONING',
        text: 'Rapidly identifies dual organ system involvement (cutaneous urticaria + respiratory stridor + cardiovascular collapse).',
        marks: 3,
      },
      {
        id: 'anaph-03',
        dimension: 'CLINICAL_SKILL',
        text: 'Immediately stops the suspected offending agent and calls resuscitation team for back-up.',
        marks: 2,
        isCriticalSafety: true,
      },
      {
        id: 'anaph-04',
        dimension: 'MANAGEMENT',
        text: 'Identifies FIRST-LINE life-saving drug: Intramuscular Epinephrine (Adrenaline) 1:1,000 (1 mg/mL).',
        marks: 5,
        isCriticalSafety: true,
      },
      {
        id: 'anaph-05',
        dimension: 'PATIENT_SAFETY',
        text: 'Specifies exact correct adult dose: 0.5 mg (0.5 mL) injected into mid-anterolateral thigh (vastus lateralis).',
        marks: 4,
        isCriticalSafety: true,
        examinerNote: 'Candidate must NOT give Epinephrine IV or subcutaneously in first-line non-arrest protocol.',
      },
      {
        id: 'anaph-06',
        dimension: 'MANAGEMENT',
        text: 'Applies high-flow oxygen via non-rebreather reservoir mask at 15 L/min.',
        marks: 2,
      },
      {
        id: 'anaph-07',
        dimension: 'CLINICAL_SKILL',
        text: 'Initiates rapid crystalloid fluid resuscitation: IV 0.9% Normal Saline 1-2 Litres wide open.',
        marks: 3,
      },
      {
        id: 'anaph-08',
        dimension: 'MANAGEMENT',
        text: 'Administers second-line adjunctive therapy: IV Hydrocortisone 200 mg and IV Chlorpheniramine 10 mg.',
        marks: 3,
      },
      {
        id: 'anaph-09',
        dimension: 'PATIENT_SAFETY',
        text: 'Re-evaluates patient vitals at 5 minutes; articulates need for repeat IM Epinephrine if symptoms persist.',
        marks: 3,
      },
      {
        id: 'anaph-10',
        dimension: 'COMMUNICATION',
        text: 'Arranges minimum 6-12 hours monitoring for biphasic anaphylactic reaction and issues MedicAlert counsel.',
        marks: 3,
      },
    ],
    criticalFailTriggers: [
      'Administering IV bolus Epinephrine 1:1,000 without cardiac arrest (fatal arrhythmia risk)',
      'Administering antihistamine/steroid BEFORE Epinephrine',
      'Placing the hypotensive patient in an upright/standing position (empty ventricle syndrome)',
    ],
    examinerGuidance: [
      'Confirm candidate injects vastus lateralis, NOT gluteal or deltoid.',
      'Check that Epinephrine is prioritized over antihistamines/corticosteroids.',
    ],
    modelDebrief:
      'Anaphylaxis is an acute, life-threatening systemic hypersensitivity reaction. Intramuscular Adrenaline in mid-outer thigh (0.5 mg in adults) is the non-negotiable first-line therapy. Glucocorticoids and H1-antihistamines are strictly secondary agents.',
  },

  // 3. NURSING BSC - Pre-Operative Surgical Scrubbing & Gowning
  {
    id: 'osce-nursing-asepsis',
    title: 'Pre-Operative Surgical Scrubbing & Aseptic Gowning Technique',
    domain: 'NURSING_BSC',
    domainTitle: 'B.Sc Nursing',
    stationType: 'PROCEDURAL',
    timeLimitMinutes: 6,
    passingScorePct: 80,
    difficulty: 'Core',
    candidateBrief:
      'You are assigned as the scrub nurse for an emergency exploratory laparotomy. Demonstrate standard surgical hand antisepsis (scrubbing), drying, sterile gowning, and closed glove technique according to WHO / CDC surgical guidelines.',
    patientProfile: {
      name: 'Pre-Op Surgical Theatre Station',
      age: 42,
      gender: 'Female',
      setting: 'Operating Suite Scrub Bay',
      chiefComplaint: 'Preparation for emergency laparotomy',
    },
    actorCues: [
      { trigger: 'Candidate enters scrub bay', response: 'Examiner cue: "Scrub sink, 4% chlorhexidine sponge brush, sterile towels, and gown pack available."' },
      { trigger: 'Begin scrub procedure', response: 'Examiner monitors hand elevation and anatomical stroke counts.' },
    ],
    checklist: [
      {
        id: 'scrub-01',
        dimension: 'PATIENT_SAFETY',
        text: 'Removes all wristwatches, rings, and jewelry; checks that cap covers all hair and mask fits snugly.',
        marks: 2,
        isCriticalSafety: true,
      },
      {
        id: 'scrub-02',
        dimension: 'CLINICAL_SKILL',
        text: 'Performs pre-scrub hand wash with plain soap and running water; cleans subungual areas with nail pick.',
        marks: 3,
      },
      {
        id: 'scrub-03',
        dimension: 'CLINICAL_SKILL',
        text: 'Applies 4% Chlorhexidine Gluconate / Povidone Iodine; scrubs in 4 anatomical planes per finger, palm, and dorsum.',
        marks: 4,
      },
      {
        id: 'scrub-04',
        dimension: 'CLINICAL_SKILL',
        text: 'Scrubs forearms up to 2 inches above elbow in circular motions; keeps hands consistently ABOVE elbows.',
        marks: 4,
        isCriticalSafety: true,
      },
      {
        id: 'scrub-05',
        dimension: 'PATIENT_SAFETY',
        text: 'Rinses hands-first through running water to elbows in one direction without back-and-forth movement.',
        marks: 3,
      },
      {
        id: 'scrub-06',
        dimension: 'CLINICAL_SKILL',
        text: 'Enters OT backwards; dries hands using sterile towel bending forward to avoid contaminating towel against scrub suit.',
        marks: 3,
      },
      {
        id: 'scrub-07',
        dimension: 'CLINICAL_SKILL',
        text: 'Dries fingers to forearm using one side of towel for right arm, and flips towel for left arm.',
        marks: 3,
      },
      {
        id: 'scrub-08',
        dimension: 'CLINICAL_SKILL',
        text: 'Picks up sterile gown by neckline, steps back, allows gown to unfold without touching outside surface.',
        marks: 3,
      },
      {
        id: 'scrub-09',
        dimension: 'PATIENT_SAFETY',
        text: 'Performs closed-glove technique: hands remain INSIDE gown sleeves while donning sterile gloves.',
        marks: 5,
        isCriticalSafety: true,
      },
      {
        id: 'scrub-10',
        dimension: 'COMMUNICATION',
        text: 'Hands gown cardboard tie tag to circulating nurse, pivots 360 degrees, and secures front sterile tie.',
        marks: 2,
      },
    ],
    criticalFailTriggers: [
      'Lowering hands below elbow level after starting antiseptic scrub',
      'Hands exiting gown cuffs prior to glove application (open glove contamination)',
      'Touching unsterile water tap or sink rim with scrubbed hands',
    ],
    examinerGuidance: [
      'Scrub must be clean-to-dirty (fingers to elbows).',
      'Closed gloving technique is mandatory for surgical scrub nurses.',
    ],
    modelDebrief:
      'Surgical hand antisepsis reduces transient and resident microflora on hands and forearms. Keeping hands above elbows ensures contaminated run-off flows towards elbows away from the sterile surgical field.',
  },

  // 4. DENTAL BDS - Inferior Alveolar Nerve Block & Local Anesthesia
  {
    id: 'osce-bds-ianb',
    title: 'Inferior Alveolar Nerve Block (IANB) & Local Anesthetic Protocol',
    domain: 'DENTAL_BDS',
    domainTitle: 'Dental Surgery (BDS)',
    stationType: 'PROCEDURAL',
    timeLimitMinutes: 7,
    passingScorePct: 75,
    difficulty: 'Standard',
    candidateBrief:
      'A 32-year-old male requires endodontic treatment of mandibular right first molar (#46). Demonstrate landmark identification, aspiration technique, and administration of an Inferior Alveolar Nerve Block on a phantom head.',
    patientProfile: {
      name: 'Phantom Simulator / Patient Vikram Sethi',
      age: 32,
      gender: 'Male',
      setting: 'Dental Operatory Suite',
      chiefComplaint: 'Severe throbbing pain in lower right jaw tooth #46',
    },
    actorCues: [
      { trigger: 'Candidate palpates right retromolar area', response: 'Patient opens mouth wide. Coronoid notch and pterygomandibular raphe are clearly visible.' },
      { trigger: 'Candidate asks about medical history', response: '"No heart conditions, no asthma, no known allergies to dental injections."' },
    ],
    checklist: [
      {
        id: 'ianb-01',
        dimension: 'COMMUNICATION',
        text: 'Explains procedure, warns of lip/tongue numbness, and obtains verbal informed consent.',
        marks: 2,
      },
      {
        id: 'ianb-02',
        dimension: 'PATIENT_SAFETY',
        text: 'Verifies anesthetic cartridge: 2% Lignocaine with 1:80,000 Adrenaline, confirms expiry and absence of bubble.',
        marks: 3,
        isCriticalSafety: true,
      },
      {
        id: 'ianb-03',
        dimension: 'CLINICAL_SKILL',
        text: 'Applies topical 20% Benzocaine gel at injection site for 60 seconds with sterile cotton applicator.',
        marks: 2,
      },
      {
        id: 'ianb-04',
        dimension: 'CLINICAL_SKILL',
        text: 'Correctly palpates coronoid notch with non-dominant thumb and retracts cheek to expose pterygomandibular space.',
        marks: 4,
      },
      {
        id: 'ianb-05',
        dimension: 'CLINICAL_SKILL',
        text: 'Directs syringe from contralateral premolars (opposite side) at height 6-10 mm above mandibular occlusal plane.',
        marks: 4,
      },
      {
        id: 'ianb-06',
        dimension: 'CLINICAL_SKILL',
        text: 'Advances needle 20-25 mm until bone is gently contacted (mandibular sulcus above lingula).',
        marks: 4,
      },
      {
        id: 'ianb-07',
        dimension: 'PATIENT_SAFETY',
        text: 'Withdraws needle 1 mm and performs mandatory DOUBLE-PLANE ASPIRATION before injecting.',
        marks: 5,
        isCriticalSafety: true,
        examinerNote: 'Failure to aspirate before deposition is an immediate safety critical failure (intravascular injection risk).',
      },
      {
        id: 'ianb-08',
        dimension: 'MANAGEMENT',
        text: 'Slowly deposits 1.5 mL of solution over 60 seconds (1 mL/min rate) for Inferior Alveolar nerve.',
        marks: 3,
      },
      {
        id: 'ianb-09',
        dimension: 'MANAGEMENT',
        text: 'Withdraws needle halfway, aspirates, and deposits remaining 0.3 mL for Lingual nerve anesthesia.',
        marks: 3,
      },
      {
        id: 'ianb-10',
        dimension: 'COMMUNICATION',
        text: 'Warns patient against lip biting during recovery; checks objective signs (lip/tongue tingling) at 3-5 minutes.',
        marks: 2,
      },
    ],
    criticalFailTriggers: [
      'Injecting local anesthetic without aspiration (risk of systemic toxicity / cardiovascular collapse)',
      'Injecting without contacting bone (risk of facial nerve palsy in parotid gland capsule)',
      'Exceeding maximum calculated safe anesthetic dose',
    ],
    examinerGuidance: [
      'Syringe barrel must rest over contralateral mandibular premolars.',
      'Aspiration in 2 planes (rotating syringe 90 degrees) is standard of care.',
    ],
    modelDebrief:
      'The IANB anesthetizes the inferior alveolar, incisive, mental, and lingual nerves. Contacting bone prior to injection ensures deposition within the pterygomandibular space rather than posteriorly inside the parotid capsule which causes transient Bell palsy.',
  },

  // 5. PHYSIOTHERAPY BPT - Lumbar Radiculopathy & Straight Leg Raise Neurological Exam
  {
    id: 'osce-bpt-slr',
    title: 'Lumbar Spine Radiculopathy & Straight Leg Raise (SLR) Neurological Assessment',
    domain: 'PHYSIOTHERAPY_BPT',
    domainTitle: 'Physiotherapy (B.P.T)',
    stationType: 'EXAMINATION',
    timeLimitMinutes: 7,
    passingScorePct: 75,
    difficulty: 'Standard',
    candidateBrief:
      'A 40-year-old manual worker presents with sharp pain radiating from right lower back down the posterior thigh to lateral calf and big toe for 3 weeks. Perform a detailed physical examination, specialized neural tension tests (SLR, Bowstring), and L4-S1 neurological sensory/motor screening.',
    patientProfile: {
      name: 'Standardized Actor (Mr. Rajesh Kulkarni)',
      age: 40,
      gender: 'Male',
      setting: 'Physiotherapy Outpatient Clinic',
      chiefComplaint: 'Right buttock and shooting leg pain with numbness in dorsum of foot',
    },
    actorCues: [
      { trigger: 'Passive SLR on right leg reaches ~35-40 degrees', response: '(Grimaces and winces): "Ouch! Doctor, that shoots right down my calf to my big toe!"' },
      { trigger: 'Dorsiflex foot at 35 degrees (Bragard test)', response: '"Yes, that makes the sharp electric pain much worse!"' },
      { trigger: 'Bowstring test (press popliteal fossa with knee flexed 20 deg)', response: '"Yes, reproduces the sciatic ache right there."' },
    ],
    checklist: [
      {
        id: 'slr-01',
        dimension: 'COMMUNICATION',
        text: 'Introduces self, explains rationale of nerve stretch tests, and secures informed consent.',
        marks: 2,
      },
      {
        id: 'slr-02',
        dimension: 'CLINICAL_SKILL',
        text: 'Positions patient supine without pillow, ensures pelvis remains flat and neutral throughout.',
        marks: 2,
      },
      {
        id: 'slr-03',
        dimension: 'CLINICAL_SKILL',
        text: 'Tests the UNAFFECTED (left) leg first to establish baseline range of motion and asymptomatic tolerance.',
        marks: 2,
      },
      {
        id: 'slr-04',
        dimension: 'CLINICAL_SKILL',
        text: 'Passively raises affected (right) leg with knee fully extended and ankle relaxed until sciatica is provoked.',
        marks: 4,
      },
      {
        id: 'slr-05',
        dimension: 'DIAGNOSTIC_REASONING',
        text: 'Correctly identifies positive SLR angle (30-70 degrees) as indicative of L4-S1 nerve root traction.',
        marks: 3,
        examinerNote: 'Pain beyond 70 degrees is hamstring tightness or lumbar facet; pain <30 degrees is malingering or acute sacroiliitis.',
      },
      {
        id: 'slr-06',
        dimension: 'CLINICAL_SKILL',
        text: 'Performs confirmatory Bragard test: lowers leg slightly below pain threshold and applies passive ankle dorsiflexion.',
        marks: 4,
      },
      {
        id: 'slr-07',
        dimension: 'CLINICAL_SKILL',
        text: 'Performs Bowstring test: flexes knee to 20 degrees on thigh and applies firm pressure in popliteal fossa over tibial nerve.',
        marks: 3,
      },
      {
        id: 'slr-08',
        dimension: 'CLINICAL_SKILL',
        text: 'Screens L5 motor power: tests Great Toe Extension (Extensor Hallucis Longus) and ankle dorsiflexion against resistance.',
        marks: 3,
      },
      {
        id: 'slr-09',
        dimension: 'PATIENT_SAFETY',
        text: 'Checks for red flag "Cauda Equina" symptoms (perineal numbness, urinary retention/incontinence, bilateral deficits).',
        marks: 4,
        isCriticalSafety: true,
      },
      {
        id: 'slr-10',
        dimension: 'MANAGEMENT',
        text: 'Explains findings clearly to patient: nerve root compression likely at L4-L5; recommends gentle nerve sliders and avoids end-range flexion.',
        marks: 3,
      },
    ],
    criticalFailTriggers: [
      'Failure to inquire about bowel/bladder incontinence and saddle anesthesia (Cauda Equina miss)',
      'Aggressively forcing the leg into hyperflexion beyond severe radicular pain threshold',
    ],
    examinerGuidance: [
      'Candidate must distinguish hamstring stretch from true dural root irritation.',
      'Check if candidate tests unaffected side first.',
    ],
    modelDebrief:
      'Straight Leg Raise (Lasegue sign) stretches the sciatic nerve and L4-S1 nerve roots over herniated disc material. Pain reproduced between 30° and 70° is clinically diagnostic. Confirmatory sensitization with ankle dorsiflexion (Bragard) isolates neural from muscular etiology.',
  },

  // 6. NURSING BSC - Pediatric Febrile Seizure & Airway Management
  {
    id: 'osce-nursing-febrile-seizure',
    title: 'Pediatric Febrile Seizure Emergency Management & Parent Communication',
    domain: 'NURSING_BSC',
    domainTitle: 'B.Sc Nursing',
    stationType: 'EMERGENCY',
    timeLimitMinutes: 7,
    passingScorePct: 75,
    difficulty: 'Standard',
    candidateBrief:
      'A mother rushes into the pediatric triage with her 2-year-old child who is actively experiencing generalized tonic-clonic convulsions with a temperature of 39.4°C (103°F). The seizure started 2 minutes ago. Manage the acute emergency and communicate with the distressed mother.',
    patientProfile: {
      name: 'Master Aarav (2-year-old toddler, weight 12 kg)',
      age: 2,
      gender: 'Male',
      setting: 'Pediatric Emergency Triage',
      chiefComplaint: 'Active generalized tonic-clonic seizure with high fever',
    },
    actorCues: [
      { trigger: 'Mother screaming: "My baby is dying! Put a spoon in his mouth so he doesn\'t bite his tongue!"', response: 'Candidate must de-escalate, explain why nothing should enter mouth, and prioritize airway positioning.' },
      { trigger: 'Check airway and breathing', response: 'Child has gurgling secretions, shallow breaths, rhythmically twitching extremities. SpO2 89%.' },
      { trigger: 'Apply gentle suction and lateral recovery position', response: 'Airway clears, breathing regularizes, SpO2 rises to 95% on blow-by O2.' },
    ],
    checklist: [
      {
        id: 'peds-01',
        dimension: 'PATIENT_SAFETY',
        text: 'Immediately places child on a firm, cushioned surface in left lateral recovery position to prevent aspiration.',
        marks: 4,
        isCriticalSafety: true,
      },
      {
        id: 'peds-02',
        dimension: 'PATIENT_SAFETY',
        text: 'Firmly prevents bystanders from placing spoons, fingers, or objects into child’s mouth (prevent airway trauma/obstruction).',
        marks: 3,
        isCriticalSafety: true,
      },
      {
        id: 'peds-03',
        dimension: 'CLINICAL_SKILL',
        text: 'Loosens tight clothing around neck and clears oral secretions gently with suction.',
        marks: 2,
      },
      {
        id: 'peds-04',
        dimension: 'MANAGEMENT',
        text: 'Applies supplemental blow-by oxygen at 10-15 L/min via non-rebreather mask.',
        marks: 2,
      },
      {
        id: 'peds-05',
        dimension: 'CLINICAL_SKILL',
        text: 'Checks blood glucose stat (glucometer) to rule out hypoglycemia-induced convulsions.',
        marks: 3,
        isCriticalSafety: true,
      },
      {
        id: 'peds-06',
        dimension: 'MANAGEMENT',
        text: 'If seizure lasts >5 minutes: prepares first-line rescue benzodiazepine (Intranasal Midazolam 0.2 mg/kg = 2.4 mg OR Rectal Diazepam 0.5 mg/kg).',
        marks: 4,
      },
      {
        id: 'peds-07',
        dimension: 'MANAGEMENT',
        text: 'Administers antipyretic: Paracetamol rectal suppository (15 mg/kg = 180 mg) once seizure terminates.',
        marks: 3,
      },
      {
        id: 'peds-08',
        dimension: 'COMMUNICATION',
        text: 'Reassures mother calmly and clearly: simple febrile convulsions do not cause permanent brain damage.',
        marks: 3,
      },
      {
        id: 'peds-09',
        dimension: 'DIAGNOSTIC_REASONING',
        text: 'Checks for signs of central nervous system infection (neck stiffness, purpuric rash, bulging fontanelle).',
        marks: 3,
        isCriticalSafety: true,
      },
      {
        id: 'peds-10',
        dimension: 'COMMUNICATION',
        text: 'Provides comprehensive home discharge education: recovery position, time seizure, when to call emergency services.',
        marks: 3,
      },
    ],
    criticalFailTriggers: [
      'Inserting an object into the child’s mouth during active seizure',
      'Restraining the twitching extremities forcefully',
      'Failing to check blood glucose in a seizing child',
    ],
    examinerGuidance: [
      'Look for lateral positioning of the head and body.',
      'Candidate must calmly advise the mother against oral objects.',
    ],
    modelDebrief:
      'Simple febrile convulsions occur in children 6 months to 5 years during rapid temperature elevation. Primary nursing management is airway protection, lateral positioning, and ruling out hypoglycemia/meningitis.',
  },

  // 7. AYUSH BAMS - Nadi Pariksha & Ayurvedic Tridosha Assessment
  {
    id: 'osce-bams-nadi',
    title: 'Nadi Pariksha (Pulse Examination) & Tridosha Assessment Protocol',
    domain: 'AYUSH_BAMS',
    domainTitle: 'Ayurvedic Medicine (BAMS)',
    stationType: 'EXAMINATION',
    timeLimitMinutes: 7,
    passingScorePct: 75,
    difficulty: 'Standard',
    candidateBrief:
      'A 45-year-old male presents with chronic indigestion, joint stiffness, and fatigue. Perform classical Ayurvedic Nadi Pariksha (radial pulse examination) to assess Vata, Pitta, and Kapha balance according to Sharangadhara Samhita.',
    patientProfile: {
      name: 'Standardized Patient (Mr. Dinanath Joshi)',
      age: 45,
      gender: 'Male',
      setting: 'Ayurvedic Clinical OPD',
      chiefComplaint: 'Agnimandya (low digestive fire), Sandhishoola (joint pain), morning lethargy',
    },
    actorCues: [
      { trigger: 'Candidate asks about morning meal / timing of exam', response: '"I have been fasting since last night and have evacuated my bowels this morning."' },
      { trigger: 'Candidate palpates radial artery below styloid process', response: 'Examiner cue: "Pulse feels irregular, dry, tortuous under index finger (Sarpa Gati - snake-like), with mild heaviness under ring finger."' },
    ],
    checklist: [
      {
        id: 'nadi-01',
        dimension: 'COMMUNICATION',
        text: 'Introduces self, establishes calm environment, and explains significance of Nadi Pariksha to patient.',
        marks: 2,
      },
      {
        id: 'nadi-02',
        dimension: 'PATIENT_SAFETY',
        text: 'Verifies pre-requisite conditions: early morning (Pratah Kala), empty stomach, post-evacuation of urine/feces.',
        marks: 3,
      },
      {
        id: 'nadi-03',
        dimension: 'CLINICAL_SKILL',
        text: 'Positions patient arm in slight flexion with forearm semipronated and supported at heart level.',
        marks: 2,
      },
      {
        id: 'nadi-04',
        dimension: 'CLINICAL_SKILL',
        text: 'Uses right hand for male patient examination; places 3 fingers below radial styloid process with appropriate spacing.',
        marks: 4,
      },
      {
        id: 'nadi-05',
        dimension: 'CLINICAL_SKILL',
        text: 'Identifies classical finger anatomical positions: Index (Tarjani = Vata), Middle (Madhyama = Pitta), Ring (Anamika = Kapha).',
        marks: 4,
      },
      {
        id: 'nadi-06',
        dimension: 'CLINICAL_SKILL',
        text: 'Assesses pulse at 3 compression levels: superficial (Prakriti), mid-depth (Vikruti), and deep (Dhatu status).',
        marks: 4,
      },
      {
        id: 'nadi-07',
        dimension: 'DIAGNOSTIC_REASONING',
        text: 'Identifies Gati (movement character): Sarpa Gati (snake-like, zigzag) indicating Vata-Ama predominance.',
        marks: 3,
      },
      {
        id: 'nadi-08',
        dimension: 'DIAGNOSTIC_REASONING',
        text: 'Correlates pulse with Jihva (tongue Ama coating) and Agni status (Vishama Agni).',
        marks: 3,
      },
      {
        id: 'nadi-09',
        dimension: 'MANAGEMENT',
        text: 'Formulates Chikitsa plan: Langhana (digestive rest) + Deepana/Pachana (Trikatu/Panchakola) to digest Ama before tonification.',
        marks: 3,
      },
      {
        id: 'nadi-10',
        dimension: 'COMMUNICATION',
        text: 'Counsel on Pathya-Apathya: warm water, freshly cooked light meals, avoid day sleep (Divasvapna).',
        marks: 2,
      },
    ],
    criticalFailTriggers: [
      'Placing fingers on wrong anatomical landmarks (e.g. wrist flexor tendons instead of radial artery grove)',
      'Prescribing heavy tonifying therapies (Rasayana / Snehana) when active Ama and channel obstruction are present',
    ],
    examinerGuidance: [
      'Check fingertip sensitivity: index finger must be closest to the thumb/styloid process.',
      'Candidate must explain the three depths of palpation.',
    ],
    modelDebrief:
      'Nadi Pariksha is the foremost Ayurvedic eight-fold examination (Ashtavidha Pariksha). The index finger perceives Vata (Sarpa Gati), middle finger Pitta (Manduka Gati - frog-like), and ring finger Kapha (Hamsa Gati - swan-like).',
  },

  // 8. ALLOPATHIC MBBS - Breaking Bad News with SPIKES Protocol
  {
    id: 'osce-mbbs-spikes',
    title: 'Breaking Bad News (SPIKES Protocol) in Metastatic Malignancy',
    domain: 'ALLOPATHIC_MBBS',
    domainTitle: 'Allopathic Medicine (MBBS)',
    stationType: 'COMMUNICATION',
    timeLimitMinutes: 7,
    passingScorePct: 80,
    difficulty: 'Advanced',
    candidateBrief:
      'You are the oncology medical registrar. Mrs. Shanti Devi, a 62-year-old retired schoolteacher, had a CT scan and biopsy following progressive weight loss and persistent cough. Results confirm Stage IV Non-Small Cell Lung Carcinoma with multiple liver and bone metastases. Break this diagnosis using the SPIKES protocol.',
    patientProfile: {
      name: 'Mrs. Shanti Devi',
      age: 62,
      gender: 'Female',
      setting: 'Quiet Private Consultation Room',
      chiefComplaint: 'Follow-up consultation for CT and bronchoscopy biopsy results',
    },
    actorCues: [
      { trigger: 'Candidate asks: "What is your understanding of why we did the scans?"', response: '"I know I have lost 8 kilos and had a cough... I was hoping it was just a stubborn chest infection from the winter."' },
      { trigger: 'Candidate delivers warning shot: "I am afraid the results are more serious than we hoped."', response: '(Gasps, clasps hands, tears well up): "Oh no... please don\'t tell me it is cancer, doctor..."' },
      { trigger: 'Candidate provides empathetic silence and tissue', response: '(Takes deep breath): "Is there any hope? What do we do next?"' },
    ],
    checklist: [
      {
        id: 'spikes-01',
        dimension: 'COMMUNICATION',
        text: 'Setting: Arranges private room without interruptions, sits at eye level, asks if patient wants a family member present.',
        marks: 3,
      },
      {
        id: 'spikes-02',
        dimension: 'COMMUNICATION',
        text: 'Perception: Assesses patient’s current understanding: "Could you tell me what you know so far about your illness?"',
        marks: 3,
      },
      {
        id: 'spikes-03',
        dimension: 'COMMUNICATION',
        text: 'Invitation: Gauges how much detail the patient desires: "Would you like me to go through all the details today?"',
        marks: 3,
      },
      {
        id: 'spikes-04',
        dimension: 'COMMUNICATION',
        text: 'Knowledge (Warning Shot): Gives clear warning shot: "Unfortunately, the biopsy results show something more serious."',
        marks: 4,
        isCriticalSafety: true,
      },
      {
        id: 'spikes-05',
        dimension: 'COMMUNICATION',
        text: 'Knowledge (Clarity): Delivers diagnosis in plain language without medical jargon; pauses after stating "advanced lung cancer".',
        marks: 4,
      },
      {
        id: 'spikes-06',
        dimension: 'COMMUNICATION',
        text: 'Empathy (Emotion): Acknowledges and validates patient’s distress using empathetic silence, touch, or active listening.',
        marks: 4,
      },
      {
        id: 'spikes-07',
        dimension: 'COMMUNICATION',
        text: 'Empathy (Naming): Names the emotion: "I can see how overwhelming and shocking this news is for you."',
        marks: 3,
      },
      {
        id: 'spikes-08',
        dimension: 'MANAGEMENT',
        text: 'Strategy: Explains actionable immediate next steps: Multi-Disciplinary Team review, molecular mutation testing (EGFR/ALK).',
        marks: 3,
      },
      {
        id: 'spikes-09',
        dimension: 'MANAGEMENT',
        text: 'Summary: Confirms symptom control priorities (pain relief, palliative care involvement) and assures non-abandonment.',
        marks: 3,
      },
      {
        id: 'spikes-10',
        dimension: 'COMMUNICATION',
        text: 'Arranges early follow-up meeting with family; provides written summary and specialist nurse contact.',
        marks: 2,
      },
    ],
    criticalFailTriggers: [
      'Bluntly stating the terminal diagnosis without a warning shot or empathetic pause',
      'Giving false reassurance or claiming the advanced metastatic disease is easily curable',
      'Ignoring obvious crying or patient emotional breakdown by rapidly reading laboratory reports',
    ],
    examinerGuidance: [
      'Candidate must demonstrate comfort with emotional silence.',
      'Check if candidate uses words like "malignancy" without explanation or clearly explains "cancer".',
    ],
    modelDebrief:
      'The SPIKES protocol (Setting, Perception, Invitation, Knowledge, Empathy, Strategy/Summary) is the gold standard for communicating distressing medical information. Empathetic exploration and containment of emotion prevent severe acute psychological trauma.',
  },
];
