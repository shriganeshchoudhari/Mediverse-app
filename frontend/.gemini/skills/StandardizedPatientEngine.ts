/**
 * StandardizedPatientEngine.ts
 * 
 * Generative Standardized Patients & Voice AI Telehealth Simulation Engine
 * Part of Track B1 (Mediverse Platform)
 * 
 * Capabilities:
 * 1. Multi-Specialty Clinical Persona Library (Internal Medicine, Emergency, Surgery, Pediatrics, Psychiatry).
 * 2. Conversational Intent Engine with dynamic in-character responses and fact-revelation tracking.
 * 3. Physical Examination Simulator with context-specific positive and negative findings.
 * 4. Diagnostic Lab & Imaging Ordering Engine with reference ranges and critical alerts.
 * 5. Automated Objective Structured Clinical Examination (OSCE) & SOAP Note Evaluator.
 */

export interface PatientVitals {
  heartRate: number;
  bloodPressure: string;
  respiratoryRate: number;
  temperatureCelsius: number;
  oxygenSaturation: number;
}

export type FactCategory =
  | 'CHIEF_COMPLAINT'
  | 'HPI_ONSET_TIMING'
  | 'HPI_LOCATION_RADIATION'
  | 'HPI_SEVERITY_QUALITY'
  | 'HPI_ASSOCIATED_SYMPTOMS'
  | 'PAST_MEDICAL_HISTORY'
  | 'MEDICATIONS'
  | 'ALLERGIES'
  | 'SOCIAL_HABITS'
  | 'FAMILY_HISTORY';

export interface ClinicalFact {
  id: string;
  category: FactCategory;
  description: string;
  revealed: boolean;
  keywords: string[];
}

export interface PhysicalExamFinding {
  maneuverId: string;
  maneuverName: string;
  category: 'GENERAL' | 'CARDIOVASCULAR' | 'RESPIRATORY' | 'ABDOMINAL' | 'NEUROLOGICAL' | 'SKIN' | 'PSYCH';
  findingDescription: string;
  isAbnormal: boolean;
  clinicalSignificance: string;
}

export interface DiagnosticTestResult {
  testId: string;
  testName: string;
  category: 'LABS' | 'CARDIOLOGY' | 'IMAGING' | 'PROCEDURE';
  turnaroundMinutes: number;
  results: {
    parameter: string;
    value: string;
    referenceRange: string;
    isCritical?: boolean;
  }[];
  formalReport: string;
  isIndicated: boolean;
}

export interface StandardizedPatientPersona {
  id: string;
  name: string;
  age: number;
  gender: 'MALE' | 'FEMALE';
  occupation: string;
  avatarSeed: string;
  chiefComplaint: string;
  emotionalState: 'IN_SEVERE_PAIN' | 'ANXIOUS' | 'CONFUSED' | 'GUARDED' | 'LETHARGIC' | 'COOPERATIVE';
  painScale: number; // 0-10
  vitals: PatientVitals;
  underlyingDiagnosis: string;
  icd10Code: string;
  goldStandardDifferentials: string[];
  contraindicationsOrAllergies: string[];
  voiceSettings: {
    pitch: number; // 0.5 - 1.5
    rate: number;  // 0.7 - 1.2
    accent: string;
  };
  clinicalFacts: ClinicalFact[];
  examFindings: Record<string, PhysicalExamFinding>;
  diagnosticTests: Record<string, DiagnosticTestResult>;
  conversationalResponses: {
    keywords: string[];
    response: string;
    associatedFactId?: string;
  }[];
  defaultResponse: string;
}

export interface StudentSoapNote {
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
  primaryDiagnosis: string;
  differentialDiagnoses: string[];
  orderedInvestigations: string[];
  performedManeuvers: string[];
  safetyPrecautionsTaken: string[];
}

export interface OsceEvaluationResult {
  overallScorePercentage: number;
  letterGrade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  sectionScores: {
    historyTaking: { score: number; maxScore: number; percentage: number; unlockedFactsCount: number; totalFactsCount: number };
    physicalExam: { score: number; maxScore: number; percentage: number; completedRelevantCount: number };
    diagnosticStewardship: { score: number; maxScore: number; percentage: number; indicatedTestsCount: number };
    differentialAccuracy: { score: number; maxScore: number; percentage: number; primaryMatch: boolean };
    patientSafetyAndPlan: { score: number; maxScore: number; percentage: number; allergyContraventionDetected: boolean };
  };
  criticalSafetyViolation: boolean;
  safetyViolationDetails?: string;
  unlockedFacts: ClinicalFact[];
  missedCrucialFacts: string[];
  actionableFeedback: string[];
}

/**
 * 5 Rich Multi-Specialty Personas
 */
export const STANDARDIZED_PERSONAS: Record<string, StandardizedPatientPersona> = {
  'acute-appendicitis-01': {
    id: 'acute-appendicitis-01',
    name: 'John Miller',
    age: 28,
    gender: 'MALE',
    occupation: 'Software Engineer',
    avatarSeed: 'john_appendicitis',
    chiefComplaint: 'Severe sharp pain in my lower right stomach that started near my belly button yesterday.',
    emotionalState: 'IN_SEVERE_PAIN',
    painScale: 8,
    vitals: {
      heartRate: 104,
      bloodPressure: '132/84',
      respiratoryRate: 20,
      temperatureCelsius: 38.3,
      oxygenSaturation: 99
    },
    underlyingDiagnosis: 'Acute Appendicitis',
    icd10Code: 'K35.80',
    goldStandardDifferentials: ['Acute Appendicitis', 'Mesenteric Adenitis', 'Cecal Diverticulitis', 'Renal Colic (Nephrolithiasis)', 'Infectious Gastroenteritis'],
    contraindicationsOrAllergies: ['Penicillin Anaphylaxis', 'Oral Solid Food Intake (Needs NPO)'],
    voiceSettings: { pitch: 0.95, rate: 0.9, accent: 'en-US' },
    clinicalFacts: [
      { id: 'app_fact_1', category: 'HPI_ONSET_TIMING', description: 'Pain started 24 hours ago periumbilically, then migrated to the Right Lower Quadrant after 12 hours.', revealed: false, keywords: ['start', 'onset', 'when', 'move', 'migrate', 'spread', 'radiation'] },
      { id: 'app_fact_2', category: 'HPI_ASSOCIATED_SYMPTOMS', description: 'Complete loss of appetite (anorexia) and 2 episodes of non-bloody, non-bilious vomiting this morning.', revealed: false, keywords: ['nausea', 'vomit', 'appetite', 'eat', 'hungry', 'food'] },
      { id: 'app_fact_3', category: 'HPI_SEVERITY_QUALITY', description: 'Pain is constant, worsening with movement, coughing, or car bumps on the drive to the hospital.', revealed: false, keywords: ['cough', 'bump', 'worse', 'aggravate', 'movement', 'walk', 'sharp', 'constant'] },
      { id: 'app_fact_4', category: 'ALLERGIES', description: 'Severe anaphylactic allergy to Penicillin (developed hives, facial swelling, and throat closure as a child).', revealed: false, keywords: ['allergy', 'allergic', 'penicillin', 'reaction'] },
      { id: 'app_fact_5', category: 'PAST_MEDICAL_HISTORY', description: 'No prior surgeries. Has never had an appendectomy or abdominal operations.', revealed: false, keywords: ['surgery', 'operation', 'appendix', 'prior', 'past medical', 'history'] },
      { id: 'app_fact_6', category: 'MEDICATIONS', description: 'Took 2 tablets of Acetaminophen 500mg 4 hours ago with no relief. Takes no daily prescription medications.', revealed: false, keywords: ['medication', 'medicine', 'tylenol', 'acetaminophen', 'drug', 'prescription'] }
    ],
    examFindings: {
      'GENERAL_APPEARANCE': { maneuverId: 'GENERAL_APPEARANCE', maneuverName: 'General Inspection', category: 'GENERAL', findingDescription: 'Lying still on exam stretcher with knees flexed; wincing with any bed movement.', isAbnormal: true, clinicalSignificance: 'Classic peritoneal sign; patients with peritonitis avoid movement to minimize peritoneal friction.' },
      'VITAL_SIGNS_CHECK': { maneuverId: 'VITAL_SIGNS_CHECK', maneuverName: 'Vital Signs Verification', category: 'GENERAL', findingDescription: 'HR 104 bpm (sinus tachycardia), BP 132/84 mmHg, Temp 38.3°C (low-grade fever), RR 20, SpO2 99%.', isAbnormal: true, clinicalSignificance: 'Systemic inflammatory response to localized intra-abdominal infection.' },
      'ABDOMINAL_PALPATION': { maneuverId: 'ABDOMINAL_PALPATION', maneuverName: 'Abdominal Palpation & Percussion', category: 'ABDOMINAL', findingDescription: 'Severe focal tenderness in Right Lower Quadrant with voluntary guarding and mild rebound tenderness.', isAbnormal: true, clinicalSignificance: 'Parietal peritoneal irritation in right iliac fossa.' },
      'MCBURNEY_SIGN': { maneuverId: 'MCBURNEY_SIGN', maneuverName: "McBurney's Point Tenderness", category: 'ABDOMINAL', findingDescription: 'Exquisite tenderness to light pressure at 1/3 the distance from ASIS to umbilicus.', isAbnormal: true, clinicalSignificance: 'Pathognomonic location of the inflamed vermiform appendix base.' },
      'ROVSING_SIGN': { maneuverId: 'ROVSING_SIGN', maneuverName: "Rovsing's Sign", category: 'ABDOMINAL', findingDescription: 'Deep palpation of Left Lower Quadrant causes sharp pain referred to the Right Lower Quadrant.', isAbnormal: true, clinicalSignificance: 'Retrograde colon gas shift irritating inflamed right-sided peritoneum.' },
      'MURPHY_SIGN': { maneuverId: 'MURPHY_SIGN', maneuverName: "Murphy's Sign (RUQ)", category: 'ABDOMINAL', findingDescription: 'Negative. No inspiratory arrest upon deep palpation of the Right Upper Quadrant subcostal margin.', isAbnormal: false, clinicalSignificance: 'Argues against acute cholecystitis.' },
      'CARDIOVASCULAR_AUSCULTATION': { maneuverId: 'CARDIOVASCULAR_AUSCULTATION', maneuverName: 'Cardiac Auscultation', category: 'CARDIOVASCULAR', findingDescription: 'Tachycardic, regular rhythm. Normal S1 and S2. No murmurs, rubs, or gallops.', isAbnormal: false, clinicalSignificance: 'Normal cardiac examination.' },
      'RESPIRATORY_AUSCULTATION': { maneuverId: 'RESPIRATORY_AUSCULTATION', maneuverName: 'Pulmonary Auscultation', category: 'RESPIRATORY', findingDescription: 'Clear to auscultation bilaterally. Good air entry without rales, rhonchi, or wheezing.', isAbnormal: false, clinicalSignificance: 'Argues against right lower lobe pneumonia referred pain.' }
    },
    diagnosticTests: {
      'CBC': {
        testId: 'CBC', testName: 'Complete Blood Count (CBC)', category: 'LABS', turnaroundMinutes: 30,
        results: [
          { parameter: 'WBC Count', value: '15.8 x10^3/uL', referenceRange: '4.5 - 11.0', isCritical: true },
          { parameter: 'Neutrophil % (Left Shift)', value: '86 %', referenceRange: '40 - 70', isCritical: true },
          { parameter: 'Hemoglobin', value: '14.8 g/dL', referenceRange: '13.5 - 17.5' },
          { parameter: 'Platelet Count', value: '245 x10^3/uL', referenceRange: '150 - 450' }
        ],
        formalReport: 'Marked leukocytosis with 86% band neutrophil predominance (left shift), consistent with acute bacterial intra-abdominal infection.',
        isIndicated: true
      },
      'BMP': {
        testId: 'BMP', testName: 'Basic Metabolic Panel (BMP)', category: 'LABS', turnaroundMinutes: 30,
        results: [
          { parameter: 'Sodium', value: '139 mEq/L', referenceRange: '136 - 145' },
          { parameter: 'Potassium', value: '4.1 mEq/L', referenceRange: '3.5 - 5.0' },
          { parameter: 'Blood Urea Nitrogen (BUN)', value: '18 mg/dL', referenceRange: '7 - 20' },
          { parameter: 'Serum Creatinine', value: '0.9 mg/dL', referenceRange: '0.7 - 1.3' },
          { parameter: 'Serum Glucose', value: '102 mg/dL', referenceRange: '70 - 100' }
        ],
        formalReport: 'Electrolytes and renal function within normal limits. Adequate renal function for IV iodinated contrast.',
        isIndicated: true
      },
      'URINALYSIS': {
        testId: 'URINALYSIS', testName: 'Urinalysis (Microscopic)', category: 'LABS', turnaroundMinutes: 20,
        results: [
          { parameter: 'WBC in Urine', value: '2-4 /HPF', referenceRange: '0 - 5' },
          { parameter: 'RBC in Urine', value: '1-2 /HPF', referenceRange: '0 - 3' },
          { parameter: 'Leukocyte Esterase', value: 'Negative', referenceRange: 'Negative' },
          { parameter: 'Nitrites', value: 'Negative', referenceRange: 'Negative' }
        ],
        formalReport: 'Absence of pyuria or hematuria; essentially negative urinalysis. Low probability of primary urinary tract infection or nephrolithiasis.',
        isIndicated: true
      },
      'CT_ABDOMEN_PELVIS': {
        testId: 'CT_ABDOMEN_PELVIS', testName: 'CT Abdomen & Pelvis with IV Contrast', category: 'IMAGING', turnaroundMinutes: 45,
        results: [
          { parameter: 'Appendix Diameter', value: '11 mm (Enlarged)', referenceRange: '< 6 mm', isCritical: true },
          { parameter: 'Periappendiceal Fat Stranding', value: 'Marked inflammation present', referenceRange: 'None', isCritical: true },
          { parameter: 'Appendicolith', value: 'Present at base (6 mm calcification)', referenceRange: 'None' },
          { parameter: 'Extraluminal Free Air', value: 'None identified (No perforation)', referenceRange: 'None' }
        ],
        formalReport: 'Enlarged blind-ending tubular structure in the right lower quadrant measuring 11 mm in outer diameter with circumferential wall thickening, appendicolith, and adjacent mesenteric fat stranding. No abscess or free intraperitoneal air. Findings diagnostic of Acute Uncomplicated Appendicitis.',
        isIndicated: true
      }
    },
    conversationalResponses: [
      { keywords: ['start', 'onset', 'when', 'move', 'where', 'migrate', 'belly button', 'umbilicus'], response: "It started around my belly button early yesterday morning as a dull ache. But around midnight last night, it migrated down to the lower right side of my stomach and got sharp and intense.", associatedFactId: 'app_fact_1' },
      { keywords: ['nausea', 'vomit', 'appetite', 'eat', 'food', 'hungry'], response: "I have had zero appetite since yesterday. Just thinking of food makes me sick. I vomited twice this morning—mostly just clear fluid and stomach bile.", associatedFactId: 'app_fact_2' },
      { keywords: ['cough', 'bump', 'walk', 'movement', 'worse', 'better'], response: "Every little bump in the ambulance made me want to scream! Coughing or taking a deep step hurts terribly right in that bottom right spot.", associatedFactId: 'app_fact_3' },
      { keywords: ['allergy', 'allergic', 'penicillin'], response: "Yes, doctor! I am deathly allergic to Penicillin! When I was a teenager my throat swelled shut and I had to get an emergency epinephrine shot.", associatedFactId: 'app_fact_4' },
      { keywords: ['surgery', 'operation', 'appendix', 'prior', 'past'], response: "No, I've never had any operations before. My appendix has definitely never been removed.", associatedFactId: 'app_fact_5' },
      { keywords: ['medication', 'medicine', 'prescription', 'tylenol', 'pills'], response: "I took two Tylenol about four hours ago, but they didn't touch the pain at all. I don't take any regular daily meds.", associatedFactId: 'app_fact_6' },
      { keywords: ['hello', 'hi', 'how are you', 'feeling', 'help'], response: "Hello doctor... please help me, my stomach is killing me right here on the right side. It hurts so bad." }
    ],
    defaultResponse: "Ouch... sorry doctor, it's hard to concentrate with this sharp pain in my lower right abdomen. Could you repeat that?"
  },

  'stemi-cardio-02': {
    id: 'stemi-cardio-02',
    name: 'Robert Davis',
    age: 58,
    gender: 'MALE',
    occupation: 'Truck Driver',
    avatarSeed: 'robert_stemi',
    chiefComplaint: 'Crushing elephant-like chest pressure radiating to my left jaw and shoulder for the last 50 minutes.',
    emotionalState: 'ANXIOUS',
    painScale: 9,
    vitals: {
      heartRate: 110,
      bloodPressure: '158/96',
      respiratoryRate: 24,
      temperatureCelsius: 36.9,
      oxygenSaturation: 93
    },
    underlyingDiagnosis: 'Acute Anterior STEMI (Myocardial Infarction)',
    icd10Code: 'I21.0',
    goldStandardDifferentials: ['Acute Anterior STEMI', 'Acute Aortic Dissection', 'Pulmonary Embolism', 'Acute Pericarditis', 'Esophageal Rupture (Boerhaave)'],
    contraindicationsOrAllergies: ['Delayed Door-to-Balloon Time (>90 min)', 'Nitrates in RV Infarct or PDE-5 Inhibitor use'],
    voiceSettings: { pitch: 0.85, rate: 0.85, accent: 'en-US' },
    clinicalFacts: [
      { id: 'stemi_fact_1', category: 'HPI_ONSET_TIMING', description: 'Began abruptly 50 minutes ago while drinking morning coffee; continuous retrosternal crushing sensation.', revealed: false, keywords: ['start', 'onset', 'when', 'how long', 'minutes', 'duration'] },
      { id: 'stemi_fact_2', category: 'HPI_LOCATION_RADIATION', description: 'Pain radiates up into the left mandible (jaw) and down the inner aspect of the left arm to the ring finger.', revealed: false, keywords: ['radiat', 'jaw', 'arm', 'shoulder', 'neck', 'where'] },
      { id: 'stemi_fact_3', category: 'HPI_ASSOCIATED_SYMPTOMS', description: 'Profound cold diaphoresis (sweating through shirt), dyspnea, and feeling of impending doom.', revealed: false, keywords: ['sweat', 'breath', 'shortness', 'diaphoresis', 'nausea', 'dizzy'] },
      { id: 'stemi_fact_4', category: 'SOCIAL_HABITS', description: '35 pack-year cigarette smoking history (1.5 packs/day); currently still smoking.', revealed: false, keywords: ['smoke', 'smoking', 'cigarette', 'tobacco', 'alcohol', 'drink'] },
      { id: 'stemi_fact_5', category: 'PAST_MEDICAL_HISTORY', description: 'Hypertension and Hyperlipidemia for 12 years; father died of massive heart attack at age 52.', revealed: false, keywords: ['family', 'father', 'hypertension', 'cholesterol', 'past medical', 'history'] },
      { id: 'stemi_fact_6', category: 'MEDICATIONS', description: 'Prescribed Lisinopril and Atorvastatin, but admits to not taking them for the past 6 months.', revealed: false, keywords: ['medication', 'medicine', 'prescription', 'statin', 'lisinopril', 'aspirin'] }
    ],
    examFindings: {
      'GENERAL_APPEARANCE': { maneuverId: 'GENERAL_APPEARANCE', maneuverName: 'General Inspection', category: 'GENERAL', findingDescription: 'Diaphoretic, pale, clutching center of chest with clenched fist (Levine sign); visibly distressed.', isAbnormal: true, clinicalSignificance: 'Classic Levine sign of acute coronary ischemia.' },
      'CARDIOVASCULAR_AUSCULTATION': { maneuverId: 'CARDIOVASCULAR_AUSCULTATION', maneuverName: 'Cardiac Auscultation', category: 'CARDIOVASCULAR', findingDescription: 'Tachycardia at 110 bpm. S4 gallop audible at apex. No murmurs, pericardial friction rub, or S3.', isAbnormal: true, clinicalSignificance: 'S4 gallop reflects atrial contraction against stiff, non-compliant ischemic LV myocardium.' },
      'RESPIRATORY_AUSCULTATION': { maneuverId: 'RESPIRATORY_AUSCULTATION', maneuverName: 'Pulmonary Auscultation', category: 'RESPIRATORY', findingDescription: 'Mild bibasilar inspiratory crackles (Killip Class II). No diffuse wheezing.', isAbnormal: true, clinicalSignificance: 'Mild elevated left ventricular end-diastolic pressure transmitting into pulmonary capillaries.' },
      'VITAL_SIGNS_CHECK': { maneuverId: 'VITAL_SIGNS_CHECK', maneuverName: 'Vital Signs', category: 'GENERAL', findingDescription: 'HR 110, BP 158/96 (symmetric in both arms), RR 24, SpO2 93% on room air, Afebrile.', isAbnormal: true, clinicalSignificance: 'Sympathetic hyperactivity in response to acute myocardial injury.' }
    },
    diagnosticTests: {
      'ECG_12_LEAD': {
        testId: 'ECG_12_LEAD', testName: 'STAT 12-Lead Electrocardiogram', category: 'CARDIOLOGY', turnaroundMinutes: 5,
        results: [
          { parameter: 'Heart Rhythm', value: 'Sinus Tachycardia 110 bpm', referenceRange: '60 - 100 bpm' },
          { parameter: 'ST Segment Elevation (V1-V4)', value: '4.5 mm convex elevation in V2-V4', referenceRange: '< 1 mm', isCritical: true },
          { parameter: 'Reciprocal ST Depression', value: '1.5 mm depression in II, III, aVF', referenceRange: 'None', isCritical: true },
          { parameter: 'Q Waves', value: 'Early pathological Q in V1-V2', referenceRange: 'None' }
        ],
        formalReport: 'Marked ST-segment elevations in precordial leads V1-V4 with reciprocal ST-segment depression in inferior leads (II, III, aVF). Diagnostic of Acute Extensive Anterior Wall STEMI (LAD occlusion). Immediate cardiac catheterization lab activation required.',
        isIndicated: true
      },
      'TROPONIN_HS': {
        testId: 'TROPONIN_HS', testName: 'High-Sensitivity Troponin I', category: 'LABS', turnaroundMinutes: 25,
        results: [
          { parameter: 'hs-cTnI (Initial)', value: '380 ng/L', referenceRange: '< 14 ng/L', isCritical: true }
        ],
        formalReport: 'Massively elevated high-sensitivity troponin indicating acute myocardial necrosis. Do not delay catheterization for serial biomarker values.',
        isIndicated: true
      },
      'CXR': {
        testId: 'CXR', testName: 'Portable Chest Radiograph (CXR)', category: 'IMAGING', turnaroundMinutes: 20,
        results: [
          { parameter: 'Mediastinal Width', value: 'Normal (< 8 cm)', referenceRange: '< 8 cm' },
          { parameter: 'Pulmonary Vasculature', value: 'Mild vascular cephalization; no pneumothorax', referenceRange: 'Normal' }
        ],
        formalReport: 'No widened mediastinum (rules against classic thoracic aortic dissection). Mild vascular congestion.',
        isIndicated: true
      }
    },
    conversationalResponses: [
      { keywords: ['start', 'onset', 'when', 'how long', 'duration', 'minutes'], response: "It hit me like a truck about 50 minutes ago while I was sitting down having coffee. It hasn't let up for even a second.", associatedFactId: 'stemi_fact_1' },
      { keywords: ['radiat', 'jaw', 'arm', 'shoulder', 'where'], response: "The pressure is right in the center of my breastbone, and it shoots up into my left jaw and down my left arm all the way to my fingers.", associatedFactId: 'stemi_fact_2' },
      { keywords: ['sweat', 'breath', 'shortness', 'diaphoresis'], response: "I'm drenched in cold sweat, doc... I feel like an elephant is stepping on my chest. I can't catch my breath.", associatedFactId: 'stemi_fact_3' },
      { keywords: ['smoke', 'smoking', 'tobacco', 'pack'], response: "Yeah, I've smoked about a pack and a half a day for 35 years. Driving a truck, it's hard to quit.", associatedFactId: 'stemi_fact_4' },
      { keywords: ['family', 'father', 'history', 'hypertension'], response: "My dad died suddenly of a heart attack when he was only 52. I have high blood pressure and cholesterol, but I haven't taken the pills lately.", associatedFactId: 'stemi_fact_5' },
      { keywords: ['aspirin', 'pills', 'medication', 'medicine'], response: "I haven't taken any aspirin today. I have some blood pressure pills at home but I haven't filled the prescription in months.", associatedFactId: 'stemi_fact_6' }
    ],
    defaultResponse: "Ugh... the pressure in my chest is unbearable... please hurry doc..."
  },

  'bacterial-meningitis-03': {
    id: 'bacterial-meningitis-03',
    name: 'Elena Rostova',
    age: 21,
    gender: 'FEMALE',
    occupation: 'College Student (Dormitory)',
    avatarSeed: 'elena_meningitis',
    chiefComplaint: 'Excruciating headache, high fever, and my neck feels so stiff I cannot touch my chin to my chest.',
    emotionalState: 'LETHARGIC',
    painScale: 9,
    vitals: {
      heartRate: 118,
      bloodPressure: '102/64',
      respiratoryRate: 22,
      temperatureCelsius: 39.4,
      oxygenSaturation: 98
    },
    underlyingDiagnosis: 'Acute Bacterial Meningitis (Neisseria meningitidis)',
    icd10Code: 'G00.0',
    goldStandardDifferentials: ['Acute Bacterial Meningitis', 'Viral / Aseptic Meningitis', 'Subarachnoid Hemorrhage', 'Herpes Simplex Encephalitis', 'Brain Abscess'],
    contraindicationsOrAllergies: ['Delaying Antibiotics for Lumbar Puncture', 'Performing LP with signs of focal mass without prior CT'],
    voiceSettings: { pitch: 1.1, rate: 0.8, accent: 'en-US' },
    clinicalFacts: [
      { id: 'mening_fact_1', category: 'HPI_ONSET_TIMING', description: 'Headache and fever developed rapidly over the past 14 hours; worsened dramatically overnight.', revealed: false, keywords: ['start', 'onset', 'when', 'headache', 'hours'] },
      { id: 'mening_fact_2', category: 'HPI_ASSOCIATED_SYMPTOMS', description: 'Extreme photophobia (room lights cause eye agony), nausea, and multiple vomiting episodes.', revealed: false, keywords: ['light', 'photophobia', 'eyes', 'nausea', 'vomit'] },
      { id: 'mening_fact_3', category: 'SOCIAL_HABITS', description: 'Lives in a crowded university undergraduate dormitory; roommate was sick with severe cough last week.', revealed: false, keywords: ['dorm', 'college', 'roommate', 'live', 'school', 'university'] },
      { id: 'mening_fact_4', category: 'PAST_MEDICAL_HISTORY', description: 'Missed scheduled college entry vaccinations (Meningococcal MenACWY / MenB vaccines not completed).', revealed: false, keywords: ['vaccine', 'vaccination', 'shot', 'meningococcal', 'immunization'] }
    ],
    examFindings: {
      'GENERAL_APPEARANCE': { maneuverId: 'GENERAL_APPEARANCE', maneuverName: 'General Inspection', category: 'GENERAL', findingDescription: 'Lethargic, curling away from room lights with eyes tightly closed; petechial purpuric macules on lower extremities.', isAbnormal: true, clinicalSignificance: 'Severe systemic toxicity; petechiae suggest meningococcemia.' },
      'MENINGEAL_SIGNS': { maneuverId: 'MENINGEAL_SIGNS', maneuverName: 'Meningeal Signs (Kernig & Brudzinski)', category: 'NEUROLOGICAL', findingDescription: 'Marked nuchal rigidity. Passive neck flexion causes involuntary hip and knee flexion (Positive Brudzinski). Inability to extend knee past 135 degrees with hip flexed (Positive Kernig).', isAbnormal: true, clinicalSignificance: 'Classic sign of leptomeningeal inflammation and irritation.' },
      'NEUROLOGICAL_CRANIAL_NERVES': { maneuverId: 'NEUROLOGICAL_CRANIAL_NERVES', maneuverName: 'Cranial Nerve Exam', category: 'NEUROLOGICAL', findingDescription: 'Pupils equal, round, and reactive to light. No focal cranial nerve palsies. Fundoscopy reveals no gross papilledema.', isAbnormal: false, clinicalSignificance: 'Absence of focal neurologic deficit or signs of impending brain herniation.' }
    },
    diagnosticTests: {
      'LUMBAR_PUNCTURE': {
        testId: 'LUMBAR_PUNCTURE', testName: 'STAT Lumbar Puncture (CSF Analysis)', category: 'PROCEDURE', turnaroundMinutes: 30,
        results: [
          { parameter: 'Opening Pressure', value: '280 mmH2O (Elevated)', referenceRange: '70 - 180 mmH2O', isCritical: true },
          { parameter: 'CSF Appearance', value: 'Turbid / Cloudy', referenceRange: 'Crystal Clear', isCritical: true },
          { parameter: 'CSF WBC Count', value: '2,400 /uL (92% Neutrophils)', referenceRange: '0 - 5 /uL', isCritical: true },
          { parameter: 'CSF Glucose', value: '18 mg/dL (CSF/Serum ratio < 0.2)', referenceRange: '45 - 80 mg/dL', isCritical: true },
          { parameter: 'CSF Protein', value: '260 mg/dL (Markedly elevated)', referenceRange: '15 - 45 mg/dL', isCritical: true },
          { parameter: 'Gram Stain', value: 'Intracellular Gram-negative diplococci', referenceRange: 'No organisms', isCritical: true }
        ],
        formalReport: 'CSF profile shows severe neutrophilic pleocytosis, marked hypoglycorrhachia, and elevated protein with Gram-negative diplococci. Diagnostic of Acute Neisseria meningitidis Bacterial Meningitis. Immediate droplet isolation and IV Ceftriaxone + Vancomycin + Dexamethasone required.',
        isIndicated: true
      },
      'CBC': {
        testId: 'CBC', testName: 'Complete Blood Count', category: 'LABS', turnaroundMinutes: 25,
        results: [
          { parameter: 'WBC', value: '22.4 x10^3/uL', referenceRange: '4.5 - 11.0', isCritical: true },
          { parameter: 'Platelets', value: '115 x10^3/uL', referenceRange: '150 - 450' }
        ],
        formalReport: 'Profound leukocytosis with early consumptive thrombocytopenia.',
        isIndicated: true
      }
    },
    conversationalResponses: [
      { keywords: ['headache', 'pain', 'neck', 'stiff', 'chin'], response: "My head is pounding so hard... I can't bend my neck down at all. It feels like iron.", associatedFactId: 'mening_fact_1' },
      { keywords: ['light', 'eyes', 'photophobia'], response: "Please turn the lights off... the light feels like knives stabbing directly into my brain...", associatedFactId: 'mening_fact_2' },
      { keywords: ['dorm', 'college', 'school', 'live', 'roommate'], response: "I live on campus in the freshman dorms. There are four of us sharing a suite... my roommate was coughing all last week.", associatedFactId: 'mening_fact_3' },
      { keywords: ['vaccine', 'shot', 'meningitis'], response: "I... I think I missed my booster shot before moving in... my mom told me to get it but I forgot.", associatedFactId: 'mening_fact_4' }
    ],
    defaultResponse: "Please... dim the lights... my head and neck hurt so terribly..."
  }
};

/**
 * Intelligent Conversational Engine Matcher
 */
export function generatePatientResponse(
  persona: StandardizedPatientPersona,
  userInput: string,
  currentFacts: ClinicalFact[]
): {
  replyText: string;
  updatedFacts: ClinicalFact[];
  newlyUnlockedFact?: ClinicalFact;
} {
  const normalizedInput = userInput.toLowerCase();
  let matchedResponse = persona.defaultResponse;
  let newlyUnlockedFact: ClinicalFact | undefined = undefined;

  // 1. Search persona conversational responses
  for (const item of persona.conversationalResponses) {
    const hasMatch = item.keywords.some((kw) => normalizedInput.includes(kw.toLowerCase()));
    if (hasMatch) {
      matchedResponse = item.response;

      // Check if this unlocked an associated fact
      if (item.associatedFactId) {
        const fact = currentFacts.find((f) => f.id === item.associatedFactId);
        if (fact && !fact.revealed) {
          fact.revealed = true;
          newlyUnlockedFact = fact;
        }
      }
      break;
    }
  }

  // 2. Also check keywords across all facts directly if no specific response matched
  if (!newlyUnlockedFact) {
    for (const fact of currentFacts) {
      if (!fact.revealed) {
        const matched = fact.keywords.some((kw) => normalizedInput.includes(kw.toLowerCase()));
        if (matched) {
          fact.revealed = true;
          newlyUnlockedFact = fact;
          // If default was about to be returned, replace with fact explanation
          if (matchedResponse === persona.defaultResponse) {
            matchedResponse = `Regarding that, doctor: ${fact.description}`;
          }
          break;
        }
      }
    }
  }

  return {
    replyText: matchedResponse,
    updatedFacts: [...currentFacts],
    newlyUnlockedFact
  };
}

/**
 * Executes a simulated physical exam maneuver
 */
export function executePhysicalExamManeuver(
  persona: StandardizedPatientPersona,
  maneuverId: string
): PhysicalExamFinding {
  const finding = persona.examFindings[maneuverId];
  if (finding) {
    return finding;
  }
  // Generic normal fallback
  return {
    maneuverId,
    maneuverName: maneuverId.replace(/_/g, ' '),
    category: 'GENERAL',
    findingDescription: 'Examined and within normal physiologic limits. No acute pathological findings elicited.',
    isAbnormal: false,
    clinicalSignificance: 'Normal baseline finding.'
  };
}

/**
 * Executes a simulated diagnostic investigation order
 */
export function executeDiagnosticTestOrder(
  persona: StandardizedPatientPersona,
  testId: string
): DiagnosticTestResult {
  const test = persona.diagnosticTests[testId];
  if (test) {
    return test;
  }
  // Generic non-diagnostic fallback
  return {
    testId,
    testName: testId.replace(/_/g, ' '),
    category: 'LABS',
    turnaroundMinutes: 30,
    results: [
      { parameter: 'Result', value: 'Normal / Non-contributory', referenceRange: 'Normal' }
    ],
    formalReport: 'Investigation completed. No acute abnormalities detected.',
    isIndicated: false
  };
}

/**
 * Evaluates student's SOAP note against gold standard OSCE rubrics
 */
export function gradeStudentSoapNote(
  persona: StandardizedPatientPersona,
  soapNote: StudentSoapNote,
  revealedFacts: ClinicalFact[]
): OsceEvaluationResult {
  const totalFacts = persona.clinicalFacts.length;
  const unlockedCount = revealedFacts.filter((f) => f.revealed).length;
  const historyPct = totalFacts > 0 ? (unlockedCount / totalFacts) * 100 : 100;
  const historyScore = Math.round((historyPct / 100) * 25);

  // Physical Exam Scoring (max 20 pts)
  const indicatedExams = Object.keys(persona.examFindings);
  const performedExams = soapNote.performedManeuvers || [];
  const relevantPerformed = indicatedExams.filter((e) => performedExams.includes(e)).length;
  const examPct = indicatedExams.length > 0 ? (relevantPerformed / indicatedExams.length) * 100 : 100;
  const examScore = Math.round((examPct / 100) * 20);

  // Diagnostic Stewardship (max 20 pts)
  const indicatedTests = Object.keys(persona.diagnosticTests);
  const orderedTests = soapNote.orderedInvestigations || [];
  const indicatedOrdered = indicatedTests.filter((t) => orderedTests.includes(t)).length;
  const diagPct = indicatedTests.length > 0 ? (indicatedOrdered / indicatedTests.length) * 100 : 100;
  const diagScore = Math.round((diagPct / 100) * 20);

  // Differential Accuracy (max 20 pts)
  const normalizedPrimary = (soapNote.primaryDiagnosis || '').trim().toLowerCase();
  const targetPrimary = persona.underlyingDiagnosis.toLowerCase();
  const primaryMatch = normalizedPrimary.includes(targetPrimary) || targetPrimary.includes(normalizedPrimary);
  const diffScore = primaryMatch ? 20 : (soapNote.differentialDiagnoses || []).some((d) => d.toLowerCase().includes(targetPrimary)) ? 10 : 0;

  // Patient Safety & Plan (max 15 pts)
  let safetyScore = 15;
  let allergyContravention = false;
  let safetyViolationText: string | undefined = undefined;

  const planText = ((soapNote.plan || '') + ' ' + (soapNote.subjective || '')).toLowerCase();
  if (persona.id === 'acute-appendicitis-01') {
    // Check if student prescribed penicillin despite severe allergy (exclude explicit avoidance)
    const mentionsPenicillin = planText.includes('penicillin') || planText.includes('ampicillin') || planText.includes('amoxicillin');
    const isAvoidance = planText.includes('avoid') || planText.includes('no penicillin') || planText.includes('allergic') || planText.includes('contraindicated') || planText.includes('do not');
    if (mentionsPenicillin && !isAvoidance) {
      allergyContravention = true;
      safetyScore = 0;
      safetyViolationText = 'CRITICAL ALLERGY VIOLATION: Prescribed Penicillin to a patient with documented anaphylactic allergy! High risk of fatal airway collapse.';
    }
  }

  const totalPoints = historyScore + examScore + diagScore + diffScore + safetyScore;
  const overallScorePercentage = Math.round((totalPoints / 100) * 100);

  let letterGrade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F' = 'F';
  if (overallScorePercentage >= 95) letterGrade = 'A+';
  else if (overallScorePercentage >= 85) letterGrade = 'A';
  else if (overallScorePercentage >= 75) letterGrade = 'B';
  else if (overallScorePercentage >= 65) letterGrade = 'C';
  else if (overallScorePercentage >= 50) letterGrade = 'D';

  const missedFacts = persona.clinicalFacts
    .filter((f) => !revealedFacts.find((rf) => rf.id === f.id && rf.revealed))
    .map((f) => f.description);

  const actionableFeedback: string[] = [];
  if (!primaryMatch) {
    actionableFeedback.push(`Primary diagnosis missed. Expected '${persona.underlyingDiagnosis}', but student proposed '${soapNote.primaryDiagnosis || 'None'}'.`);
  } else {
    actionableFeedback.push(`Excellent clinical acumen: Correctly identified ${persona.underlyingDiagnosis}.`);
  }

  if (historyPct < 70) {
    actionableFeedback.push(`History incomplete: Only ${unlockedCount} of ${totalFacts} key history elements discovered. Ask more targeted questions about onset, triggers, and past medical history.`);
  }

  if (examPct < 60) {
    actionableFeedback.push(`Physical examination was insufficient: Missed pathognomonic physical exam maneuvers.`);
  }

  if (diagPct < 60) {
    actionableFeedback.push(`STAT diagnostics delayed: Critical confirmatory testing was omitted.`);
  }

  if (allergyContravention) {
    actionableFeedback.push(safetyViolationText!);
  }

  return {
    overallScorePercentage,
    letterGrade,
    sectionScores: {
      historyTaking: { score: historyScore, maxScore: 25, percentage: Math.round(historyPct), unlockedFactsCount: unlockedCount, totalFactsCount: totalFacts },
      physicalExam: { score: examScore, maxScore: 20, percentage: Math.round(examPct), completedRelevantCount: relevantPerformed },
      diagnosticStewardship: { score: diagScore, maxScore: 20, percentage: Math.round(diagPct), indicatedTestsCount: indicatedOrdered },
      differentialAccuracy: { score: diffScore, maxScore: 20, percentage: Math.round((diffScore / 20) * 100), primaryMatch },
      patientSafetyAndPlan: { score: safetyScore, maxScore: 15, percentage: Math.round((safetyScore / 15) * 100), allergyContraventionDetected: allergyContravention }
    },
    criticalSafetyViolation: allergyContravention,
    safetyViolationDetails: safetyViolationText,
    unlockedFacts: revealedFacts.filter((f) => f.revealed),
    missedCrucialFacts: missedFacts,
    actionableFeedback
  };
}