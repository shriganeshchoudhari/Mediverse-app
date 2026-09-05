/**
 * ClinicalCaseBranchingEngine.ts
 * Multi-Stage Clinical Encounters, Dynamic Hemodynamic Graph Transitions,
 * Bayesian Differential Diagnosis Ranking, and 5-Dimensional AI OSCE Rubrics.
 * Location: frontend/.gemini/skills/ClinicalCaseBranchingEngine.ts
 */

export type CardiacRhythm = 'SINUS' | 'AFIB' | 'VT' | 'BRADYCARDIA' | 'ASYSTOLE' | 'ST_ELEVATION';

export type PatientEmotionalState =
  | 'ANXIOUS'
  | 'COOPERATIVE'
  | 'AGITATED'
  | 'LETHARGIC'
  | 'OBTUNDED'
  | 'RELIEVED';

export interface ClinicalVitals {
  heartRate: number;
  systolicBp: number;
  diastolicBp: number;
  spO2: number;
  respRate: number;
  temperatureCelsius: number;
  rhythm: CardiacRhythm;
}

export type ActionType =
  | 'HISTORY'
  | 'PHYSICAL_EXAM'
  | 'INVESTIGATION'
  | 'INTERVENTION'
  | 'COMMUNICATION';

export interface BranchingAction {
  id: string;
  type: ActionType;
  label: string;
  category: string;
  costUnits: number; // financial stewardship
  timeSpentSeconds: number; // time management
  isCriticalAction: boolean;
  isContraindicated: boolean;
  vitalsDelta?: Partial<ClinicalVitals>;
  patientResponse: string;
  clinicalConsequence: string;
  subsequentStateId?: string;
}

export interface CaseNode {
  nodeId: string;
  title: string;
  narrative: string;
  vitals: ClinicalVitals;
  emotionalState: PatientEmotionalState;
  availableActionIds: string[];
}

export interface DifferentialDiagnosisItem {
  id: string;
  name: string;
  isPrimary: boolean;
  likelihoodScore: number; // 0.0 - 1.0
  supportingClues: string[];
  refutingClues: string[];
}

export interface AttendingVivaQuestion {
  id: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
  rationale: string;
}

export interface CaseScenario {
  id: string;
  title: string;
  specialty: 'CARDIOLOGY' | 'INFECTIOUS_DISEASE' | 'CRITICAL_CARE' | 'EMERGENCY_MEDICINE';
  difficulty: 'INTERMEDIATE' | 'ADVANCED' | 'FELLOWSHIP';
  clinicalPrompt: string;
  patientDemographics: {
    name: string;
    age: number;
    gender: 'MALE' | 'FEMALE';
    chiefComplaint: string;
    triageAcuity: 'RED' | 'YELLOW' | 'GREEN';
    pastMedicalHistory: string[];
    medications: string[];
    allergies: string[];
  };
  initialNodeId: string;
  nodes: Record<string, CaseNode>;
  actionsCatalog: Record<string, BranchingAction>;
  differentialCatalog: DifferentialDiagnosisItem[];
  expectedPrimaryDiagnosisId: string;
  attendingVivaQuestions: AttendingVivaQuestion[];
}

export interface CandidateCaseSession {
  scenarioId: string;
  currentNodeId: string;
  currentVitals: ClinicalVitals;
  currentEmotionalState: PatientEmotionalState;
  executedActionIds: string[];
  candidateDifferentialRankings: { diagnosisId: string; rank: number; certaintyPercent: number }[];
  elapsedSeconds: number;
  totalCostUnits: number;
  safetyViolationCount: number;
  isCompleted: boolean;
  historyLog: {
    timestamp: number;
    action: BranchingAction;
    resultingVitals: ClinicalVitals;
    nodeTransitionedTo?: string;
  }[];
}

export interface CandidatePerformanceReport {
  scenarioId: string;
  totalScore: number; // 0-100%
  passed: boolean; // >= 70%
  grade: 'HONORS' | 'PASS' | 'PROVISIONAL' | 'FAIL';
  dimensionScores: {
    diagnosticAccuracy: number; // 0 - 25
    patientSafety: number; // 0 - 25
    resourceStewardship: number; // 0 - 20
    clinicalCommunication: number; // 0 - 15
    decisionVelocity: number; // 0 - 15
  };
  criticalActionsCompleted: string[];
  missedCriticalActions: string[];
  safetyViolations: string[];
  totalCostIncurred: number;
  totalTimeElapsedSeconds: number;
  clinicalDebrief: string;
  attendingFeedbackTips: string[];
}

/**
 * Seeded Clinical Scenarios
 */
export const SEEDED_BRANCHING_SCENARIOS: Record<string, CaseScenario> = {
  'case-rv-stemi': {
    id: 'case-rv-stemi',
    title: 'Acute Inferior STEMI with Right Ventricular Infarction',
    specialty: 'CARDIOLOGY',
    difficulty: 'ADVANCED',
    clinicalPrompt:
      'A 58-year-old male presents to the Emergency Resuscitation Bay with 2 hours of crushing substernal chest pressure, severe diaphoresis, and profound nausea. You are the senior clinical resident on duty.',
    patientDemographics: {
      name: 'Ramesh Sundaram',
      age: 58,
      gender: 'MALE',
      chiefComplaint: 'Crushing central chest heaviness radiating to jaw, vomiting x2, lightheadedness',
      triageAcuity: 'RED',
      pastMedicalHistory: ['Hypertension', 'Type 2 Diabetes Mellitus', '25 pack-year tobacco use'],
      medications: ['Metformin 500 mg BD', 'Amlodipine 5 mg OD'],
      allergies: ['Penicillin (Hives/Rash)'],
    },
    initialNodeId: 'node-initial',
    expectedPrimaryDiagnosisId: 'diag-inferior-rv-stemi',
    nodes: {
      'node-initial': {
        nodeId: 'node-initial',
        title: 'Initial Emergency Triage',
        narrative:
          'Patient is visibly pale, diaphoretic, clutching his mid-chest. He appears anxious and clammy. His peripheral pulse is weak and slow.',
        vitals: {
          heartRate: 54,
          systolicBp: 96,
          diastolicBp: 64,
          spO2: 95,
          respRate: 22,
          temperatureCelsius: 36.8,
          rhythm: 'BRADYCARDIA',
        },
        emotionalState: 'ANXIOUS',
        availableActionIds: [
          'act-ecg-12lead',
          'act-focused-history',
          'act-chest-exam',
          'act-order-aspirin',
          'act-order-nitroglycerin-sublingual',
          'act-right-sided-ecg',
          'act-iv-access-fluids',
        ],
      },
      'node-nitrate-collapse': {
        nodeId: 'node-nitrate-collapse',
        title: 'Hemodynamic Collapse: Acute RV Preload Failure',
        narrative:
          'Within 90 seconds of sublingual nitroglycerin administration, the patient turns ash-gray, closes his eyes, and becomes lethargic. Monitors alarm loudly: blood pressure has collapsed precipitously!',
        vitals: {
          heartRate: 46,
          systolicBp: 62,
          diastolicBp: 38,
          spO2: 89,
          respRate: 26,
          temperatureCelsius: 36.7,
          rhythm: 'BRADYCARDIA',
        },
        emotionalState: 'OBTUNDED',
        availableActionIds: [
          'act-stat-fluid-bolus',
          'act-legs-elevate',
          'act-iv-atropine',
          'act-call-cath-lab',
          'act-order-beta-blocker',
        ],
      },
      'node-rv-confirmed-stable': {
        nodeId: 'node-rv-confirmed-stable',
        title: 'Hemodynamic Stabilization & RV Infarction Confirmed',
        narrative:
          'Right-sided precordial leads confirm 2.0 mm ST-segment elevation in lead V4R. Balanced IV crystalloids have restored right ventricular preload and normalized arterial pressure. Patient reports reduced dizziness.',
        vitals: {
          heartRate: 68,
          systolicBp: 114,
          diastolicBp: 72,
          spO2: 98,
          respRate: 16,
          temperatureCelsius: 36.9,
          rhythm: 'ST_ELEVATION',
        },
        emotionalState: 'RELIEVED',
        availableActionIds: [
          'act-order-dapt-ticagrelor',
          'act-order-high-statin',
          'act-call-cath-lab',
          'act-bedside-echo',
          'act-order-enoxaparin',
        ],
      },
      'node-cath-lab-transferred': {
        nodeId: 'node-cath-lab-transferred',
        title: 'Emergency Primary PCI Door-to-Balloon Transfer',
        narrative:
          'Interventional cardiology team has arrived in the resuscitation bay. Patient is loaded with DAPT, stabilized with IV crystalloids, and transferred directly to Cath Lab Suite 1 for primary angioplasty of the proximal Right Coronary Artery (RCA).',
        vitals: {
          heartRate: 72,
          systolicBp: 122,
          diastolicBp: 76,
          spO2: 99,
          respRate: 15,
          temperatureCelsius: 37.0,
          rhythm: 'SINUS',
        },
        emotionalState: 'RELIEVED',
        availableActionIds: [],
      },
    },
    actionsCatalog: {
      'act-ecg-12lead': {
        id: 'act-ecg-12lead',
        type: 'INVESTIGATION',
        label: 'STAT 12-Lead Standard ECG',
        category: 'Diagnostic Electrocardiology',
        costUnits: 40,
        timeSpentSeconds: 120,
        isCriticalAction: true,
        isContraindicated: false,
        patientResponse: 'Technician attaches precordial leads. Tracing prints within 2 minutes.',
        clinicalConsequence:
          'Marked 3 mm ST elevation in inferior leads II, III, aVF with reciprocal ST depression in I and aVL. Sinus bradycardia at 54 bpm.',
      },
      'act-focused-history': {
        id: 'act-focused-history',
        type: 'HISTORY',
        label: 'Focused Cardiopulmonary History (OPQRST)',
        category: 'Bedside Evaluation',
        costUnits: 0,
        timeSpentSeconds: 90,
        isCriticalAction: true,
        isContraindicated: false,
        patientResponse:
          '"Doctor, it started suddenly while having breakfast... feels like an elephant sitting on my chest. I felt like fainting when I stood up."',
        clinicalConsequence:
          'Identifies acute ischemic onset with presyncope/orthostasis, strongly pointing to right ventricular involvement or conduction bradycardia.',
      },
      'act-chest-exam': {
        id: 'act-chest-exam',
        type: 'PHYSICAL_EXAM',
        label: 'Cardiovascular & Pulmonary Examination',
        category: 'Physical Diagnosis',
        costUnits: 0,
        timeSpentSeconds: 90,
        isCriticalAction: true,
        isContraindicated: false,
        patientResponse: 'Patient allows auscultation. Lung fields are clear. Jugular venous distension noted.',
        clinicalConsequence:
          'Clear lung fields (absence of pulmonary edema / crackles) despite elevated JVP and hypotension is the classic triad of Right Ventricular Myocardial Infarction.',
      },
      'act-order-aspirin': {
        id: 'act-order-aspirin',
        type: 'INTERVENTION',
        label: 'Aspirin 300 mg Chewable STAT',
        category: 'Antiplatelet Therapy',
        costUnits: 15,
        timeSpentSeconds: 45,
        isCriticalAction: true,
        isContraindicated: false,
        patientResponse: 'Patient chews and swallows the 300 mg tablet with a sip of water.',
        clinicalConsequence:
          'Irreversible COX-1 inhibition achieves rapid platelet inhibition, significantly reducing 30-day STEMI mortality.',
      },
      'act-order-nitroglycerin-sublingual': {
        id: 'act-order-nitroglycerin-sublingual',
        type: 'INTERVENTION',
        label: 'Nitroglycerin 0.4 mg Sublingual Tablet STAT',
        category: 'Vasodilator',
        costUnits: 20,
        timeSpentSeconds: 45,
        isCriticalAction: false,
        isContraindicated: true,
        subsequentStateId: 'node-nitrate-collapse',
        vitalsDelta: { systolicBp: 62, diastolicBp: 38, heartRate: 46, spO2: 89 },
        patientResponse:
          '"Doctor, everything is going black... I feel like I am dying..." Eyes roll back, pulse fades.',
        clinicalConsequence:
          'SEVERE CLINICAL CONTRAINDICATION: In RV infarction, right ventricular stroke volume is exquisitely preload-dependent. Venodilation from nitrates collapses RV filling, plunging cardiac output and inducing severe refractory shock.',
      },
      'act-right-sided-ecg': {
        id: 'act-right-sided-ecg',
        type: 'INVESTIGATION',
        label: 'Right-Sided 12-Lead ECG (V3R & V4R leads)',
        category: 'Diagnostic Electrocardiology',
        costUnits: 40,
        timeSpentSeconds: 90,
        isCriticalAction: true,
        isContraindicated: false,
        subsequentStateId: 'node-rv-confirmed-stable',
        vitalsDelta: { systolicBp: 110, heartRate: 64 },
        patientResponse: 'Right precordial leads placed across right anterior chest wall.',
        clinicalConsequence:
          'Confirms 2 mm ST elevation in lead V4R. Diagnostic of acute Right Ventricular Infarction secondary to proximal dominant RCA occlusion. Nitrates and diuretics are strictly contraindicated!',
      },
      'act-iv-access-fluids': {
        id: 'act-iv-access-fluids',
        type: 'INTERVENTION',
        label: 'Dual 16-Gauge IV Access & 500 mL Balanced Crystalloid Infusion',
        category: 'Resuscitation Fluids',
        costUnits: 50,
        timeSpentSeconds: 60,
        isCriticalAction: true,
        isContraindicated: false,
        vitalsDelta: { systolicBp: 112, diastolicBp: 70, heartRate: 66 },
        patientResponse: 'Peripheral IVs sited; 500 mL warm Plasma-Lyte bolus rapidly infuses.',
        clinicalConsequence:
          'Restores RV preload and increases left ventricular end-diastolic filling, stabilizing systemic arterial pressure.',
      },
      'act-stat-fluid-bolus': {
        id: 'act-stat-fluid-bolus',
        type: 'INTERVENTION',
        label: 'STAT 1000 mL Normal Saline Pressure Bag Bolus',
        category: 'Emergency Hemodynamic Rescue',
        costUnits: 60,
        timeSpentSeconds: 60,
        isCriticalAction: true,
        isContraindicated: false,
        subsequentStateId: 'node-rv-confirmed-stable',
        vitalsDelta: { systolicBp: 104, diastolicBp: 66, heartRate: 62, spO2: 96 },
        patientResponse: 'Patient begins to regain consciousness as fluid infuses under pressure. Color returns.',
        clinicalConsequence:
          'Successfully rescues preload-starved right ventricle, lifting SBP from 62 to >100 mmHg.',
      },
      'act-legs-elevate': {
        id: 'act-legs-elevate',
        type: 'INTERVENTION',
        label: 'Passive Leg Raise Maneuver (Trendelenburg)',
        category: 'Bedside Hemodynamic Maneuver',
        costUnits: 0,
        timeSpentSeconds: 30,
        isCriticalAction: false,
        isContraindicated: false,
        vitalsDelta: { systolicBp: 78, diastolicBp: 48 },
        patientResponse: 'Legs elevated to 45 degrees.',
        clinicalConsequence:
          'Autotransfuses ~300 mL of venous blood from lower extremities, providing transient hemodynamic support while fluid line is primed.',
      },
      'act-iv-atropine': {
        id: 'act-iv-atropine',
        type: 'INTERVENTION',
        label: 'Atropine 0.5 mg IV Push',
        category: 'Anticholinergic Inotrope',
        costUnits: 30,
        timeSpentSeconds: 45,
        isCriticalAction: false,
        isContraindicated: false,
        vitalsDelta: { heartRate: 72 },
        patientResponse: 'Heart rate increases on monitor.',
        clinicalConsequence:
          'Relieves vagally-mediated Bezold-Jarisch reflex bradycardia commonly seen in inferior myocardial infarctions.',
      },
      'act-order-beta-blocker': {
        id: 'act-order-beta-blocker',
        type: 'INTERVENTION',
        label: 'Metoprolol 5 mg IV Push',
        category: 'Beta-Blocker',
        costUnits: 25,
        timeSpentSeconds: 45,
        isCriticalAction: false,
        isContraindicated: true,
        vitalsDelta: { heartRate: 38, systolicBp: 50 },
        patientResponse: 'Severe bradycardia worsens; telemetry alarms for sinus arrest.',
        clinicalConsequence:
          'SEVERE CONTRAINDICATION: Beta-blockers in acute cardiogenic shock, bradycardia, or acute RV infarction can induce complete AV dissociation or cardiovascular collapse.',
      },
      'act-order-dapt-ticagrelor': {
        id: 'act-order-dapt-ticagrelor',
        type: 'INTERVENTION',
        label: 'Ticagrelor 180 mg Loading Dose PO',
        category: 'Antiplatelet Therapy',
        costUnits: 45,
        timeSpentSeconds: 45,
        isCriticalAction: true,
        isContraindicated: false,
        patientResponse: 'Patient swallows two 90 mg tablets of Ticagrelor.',
        clinicalConsequence:
          'Dual antiplatelet therapy (DAPT) with Aspirin + Ticagrelor provides potent P2Y12 inhibition prior to stent deployment.',
      },
      'act-order-high-statin': {
        id: 'act-order-high-statin',
        type: 'INTERVENTION',
        label: 'Atorvastatin 80 mg PO STAT',
        category: 'High-Intensity Statin',
        costUnits: 25,
        timeSpentSeconds: 45,
        isCriticalAction: true,
        isContraindicated: false,
        patientResponse: 'Patient takes Atorvastatin with water.',
        clinicalConsequence:
          'Early high-intensity statin produces pleiotropic plaque-stabilizing and anti-inflammatory effects in acute coronary syndromes.',
      },
      'act-call-cath-lab': {
        id: 'act-call-cath-lab',
        type: 'INTERVENTION',
        label: 'Activate Cardiac Catheterization Team for Primary PCI',
        category: 'Emergency Reperfusion Activation',
        costUnits: 300,
        timeSpentSeconds: 60,
        isCriticalAction: true,
        isContraindicated: false,
        subsequentStateId: 'node-cath-lab-transferred',
        patientResponse: 'On-call interventional cardiologist and cath lab team paged immediately.',
        clinicalConsequence:
          'Critical gold-standard therapy. Reperfusion of occluded right coronary artery within 90 minutes door-to-balloon achieves survival salvage.',
      },
      'act-bedside-echo': {
        id: 'act-bedside-echo',
        type: 'INVESTIGATION',
        label: 'Bedside Point-of-Care Echocardiogram (POCUS)',
        category: 'Echocardiography',
        costUnits: 150,
        timeSpentSeconds: 180,
        isCriticalAction: false,
        isContraindicated: false,
        patientResponse: 'Ultrasound probe placed in parasternal and subcostal windows.',
        clinicalConsequence:
          'Demonstrates RV dilatation, akinesis of RV free wall, preserved LV apex, and inferior vena cava plethoric with minimal inspiratory collapse.',
      },
      'act-order-enoxaparin': {
        id: 'act-order-enoxaparin',
        type: 'INTERVENTION',
        label: 'Enoxaparin 1 mg/kg SC STAT',
        category: 'Parenteral Anticoagulant',
        costUnits: 60,
        timeSpentSeconds: 45,
        isCriticalAction: true,
        isContraindicated: false,
        patientResponse: 'Subcutaneous injection given in abdominal fat fold.',
        clinicalConsequence:
          'Inhibits Factor Xa and thrombin propagation in coronary culprit lesion.',
      },
    },
    differentialCatalog: [
      {
        id: 'diag-inferior-rv-stemi',
        name: 'Acute Inferior STEMI with Right Ventricular Infarction',
        isPrimary: true,
        likelihoodScore: 0.95,
        supportingClues: [
          'ST elevation in II, III, aVF',
          'ST elevation in V4R (right precordium)',
          'Clear lung fields despite high JVP',
          'Hypotension and bradycardia without pulmonary edema',
        ],
        refutingClues: [],
      },
      {
        id: 'diag-acute-pericarditis',
        name: 'Acute Myopericarditis',
        isPrimary: false,
        likelihoodScore: 0.15,
        supportingClues: ['Chest pain', 'ST changes'],
        refutingClues: [
          'Reciprocal ST depressions in lead I/aVL argue against pericarditis (which causes diffuse concave ST elevation and PR depression)',
        ],
      },
      {
        id: 'diag-aortic-dissection',
        name: 'Type A Aortic Dissection with Coronary Extension',
        isPrimary: false,
        likelihoodScore: 0.2,
        supportingClues: ['Severe chest pain', 'Hypotension'],
        refutingClues: [
          'Equal bilateral radial pulses',
          'Absence of aortic regurgitation murmur',
          'No mediastinal widening on bedside portable CXR',
        ],
      },
      {
        id: 'diag-pulmonary-embolism',
        name: 'Acute Massive Pulmonary Embolism',
        isPrimary: false,
        likelihoodScore: 0.25,
        supportingClues: ['Hypotension', 'Elevated JVP', 'RV strain'],
        refutingClues: [
          'Direct ST elevations >2mm in II, III, aVF with V4R elevation is pathognomonic for coronary occlusion rather than PE alone',
        ],
      },
    ],
    attendingVivaQuestions: [
      {
        id: 'viva-1',
        question:
          'Why are nitrates, morphine, and diuretics strictly contraindicated in acute right ventricular myocardial infarction?',
        options: [
          'They promote hyperkalemia and prolong the QTc interval',
          'The ischemic RV is exquisitely preload-dependent; venodilators drastically reduce RV end-diastolic volume, triggering cardiogenic shock',
          'They interfere with the antiplatelet mechanism of aspirin and ticagrelor',
          'They precipitate coronary artery spasm in the left main artery',
        ],
        correctOptionIndex: 1,
        rationale:
          'Because the infarcted right ventricle has lost active contractile force, pulmonary forward flow depends on high right atrial filling pressures (preload). Nitrates reduce preload, causing immediate systemic circulatory collapse.',
      },
      {
        id: 'viva-2',
        question:
          'What is the initial hemodynamic rescue management if a patient with RV infarction inadvertently receives a nitrate and develops profound hypotension?',
        options: [
          'Administer IV Furosemide 80 mg bolus to reduce back pressure',
          'Immediate rapid IV fluid loading with 500-1000 mL isotonic crystalloids to restore RV preload',
          'Initiate IV Nitroprusside infusion',
          'Administer IV Beta-blocker to control oxygen consumption',
        ],
        correctOptionIndex: 1,
        rationale:
          'Volume expansion with isotonic saline is the primary therapy to restore ventricular preload and overcome RV compliance failure.',
      },
    ],
  },

  'case-neutropenic-sepsis': {
    id: 'case-neutropenic-sepsis',
    title: 'Neutropenic Sepsis with Septic Shock in Oncology Patient',
    specialty: 'INFECTIOUS_DISEASE',
    difficulty: 'ADVANCED',
    clinicalPrompt:
      'A 46-year-old female receiving adjuvant chemotherapy (R-CHOP) for diffuse large B-cell lymphoma presents to the emergency room with 4 hours of high-spiking fevers, shaking rigors, and dizziness.',
    patientDemographics: {
      name: 'Sunita Mehra',
      age: 46,
      gender: 'FEMALE',
      chiefComplaint: 'Fever 39.4°C, rigors, dizziness, fatigue 10 days post-chemotherapy',
      triageAcuity: 'RED',
      pastMedicalHistory: ['DLBCL (Cycle 3 Day 10)', 'Mild Asthma'],
      medications: ['Dexamethasone 8 mg (completed Day 5)', 'Pegfilgrastim on Day 2'],
      allergies: ['No Known Drug Allergies (NKDA)'],
    },
    initialNodeId: 'node-sepsis-initial',
    expectedPrimaryDiagnosisId: 'diag-neutropenic-septic-shock',
    nodes: {
      'node-sepsis-initial': {
        nodeId: 'node-sepsis-initial',
        title: 'Initial Oncology Emergency Triage',
        narrative:
          'Patient is flushed, shivering under blankets, tachypneic and warm to the touch. Capillary refill is 3.5 seconds. Port-a-Cath site on right chest wall shows mild erythema.',
        vitals: {
          heartRate: 132,
          systolicBp: 82,
          diastolicBp: 46,
          spO2: 94,
          respRate: 28,
          temperatureCelsius: 39.4,
          rhythm: 'SINUS',
        },
        emotionalState: 'LETHARGIC',
        availableActionIds: [
          'act-stat-blood-cultures',
          'act-stat-lactate-cbc',
          'act-order-piptazo',
          'act-order-vancomycin',
          'act-30mlkg-crystalloid-bolus',
          'act-port-examination',
          'act-norepi-infusion',
        ],
      },
      'node-sepsis-stabilized': {
        nodeId: 'node-sepsis-stabilized',
        title: 'Successful 1-Hour Sepsis Bundle Execution',
        narrative:
          'Blood cultures drawn from peripheral veins and Port-a-Cath. Piperacillin-Tazobactam 4.5g IV extended infusion running along with Vancomycin. Balanced crystalloids have elevated MAP to 68 mmHg. Urine output is monitored via catheter.',
        vitals: {
          heartRate: 98,
          systolicBp: 106,
          diastolicBp: 64,
          spO2: 97,
          respRate: 18,
          temperatureCelsius: 38.2,
          rhythm: 'SINUS',
        },
        emotionalState: 'COOPERATIVE',
        availableActionIds: [
          'act-serial-lactate',
          'act-icu-admission',
        ],
      },
    },
    actionsCatalog: {
      'act-stat-blood-cultures': {
        id: 'act-stat-blood-cultures',
        type: 'INVESTIGATION',
        label: 'Blood Cultures x 2 Sets (Peripheral & Central Port)',
        category: 'Microbiology',
        costUnits: 50,
        timeSpentSeconds: 60,
        isCriticalAction: true,
        isContraindicated: false,
        patientResponse: 'Technician draws 20 mL of blood from peripheral vein and central line port.',
        clinicalConsequence:
          'Must be drawn BEFORE antimicrobial administration to identify causative pathogen (Gram-negative bacilli like Pseudomonas or MRSA).',
      },
      'act-stat-lactate-cbc': {
        id: 'act-stat-lactate-cbc',
        type: 'INVESTIGATION',
        label: 'STAT Venous Lactate, CBC with Differential, & Chemistry',
        category: 'Diagnostic Laboratory',
        costUnits: 60,
        timeSpentSeconds: 60,
        isCriticalAction: true,
        isContraindicated: false,
        patientResponse: 'Lab receives STAT tubes.',
        clinicalConsequence:
          'Reveals Absolute Neutrophil Count (ANC) = 180/uL (<500 = severe neutropenia) and Lactate = 4.4 mmol/L (tissue hypoperfusion).',
      },
      'act-order-piptazo': {
        id: 'act-order-piptazo',
        type: 'INTERVENTION',
        label: 'Piperacillin-Tazobactam 4.5 g IV STAT',
        category: 'Antipseudomonal Antimicrobial',
        costUnits: 75,
        timeSpentSeconds: 45,
        isCriticalAction: true,
        isContraindicated: false,
        vitalsDelta: { systolicBp: 86 },
        patientResponse: '4.5g Zosyn piggyback starts running via IV infusion pump.',
        clinicalConsequence:
          'Broad antipseudomonal coverage is mandatory within 1 hour in febrile neutropenia to prevent catastrophic endotoxic bacteremia.',
      },
      'act-order-vancomycin': {
        id: 'act-order-vancomycin',
        type: 'INTERVENTION',
        label: 'Vancomycin 1.5 g IV in Normal Saline',
        category: 'MRSA Glycopeptide Antimicrobial',
        costUnits: 65,
        timeSpentSeconds: 45,
        isCriticalAction: true,
        isContraindicated: false,
        patientResponse: 'Vancomycin infusion initiated with rate limit to avoid Red Man syndrome.',
        clinicalConsequence:
          'Provides coverage for line-associated MRSA and coagulase-negative Staphylococci at erythematous Port-a-Cath site.',
      },
      'act-30mlkg-crystalloid-bolus': {
        id: 'act-30mlkg-crystalloid-bolus',
        type: 'INTERVENTION',
        label: '30 mL/kg IV Balanced Crystalloid Fluid Bolus (2,000 mL)',
        category: 'Sepsis Resuscitation',
        costUnits: 80,
        timeSpentSeconds: 90,
        isCriticalAction: true,
        isContraindicated: false,
        subsequentStateId: 'node-sepsis-stabilized',
        vitalsDelta: { systolicBp: 104, diastolicBp: 62, heartRate: 102, spO2: 96 },
        patientResponse: 'Pressure infuser delivers 2 liters of balanced crystalloids.',
        clinicalConsequence:
          'Replaces massive intravascular fluid deficit caused by septic capillary leak, lifting MAP from 58 to >65 mmHg.',
      },
      'act-port-examination': {
        id: 'act-port-examination',
        type: 'PHYSICAL_EXAM',
        label: 'Detailed Examination of Central Port & Skin',
        category: 'Physical Diagnosis',
        costUnits: 0,
        timeSpentSeconds: 60,
        isCriticalAction: true,
        isContraindicated: false,
        patientResponse: 'Doctor inspects the right chest wall Port-a-Cath site.',
        clinicalConsequence:
          'Erythema and tenderness over tunnel tract indicate catheter-related bloodstream infection (CRBSI) as the primary septic nidus.',
      },
      'act-norepi-infusion': {
        id: 'act-norepi-infusion',
        type: 'INTERVENTION',
        label: 'Norepinephrine IV Infusion (0.05 mcg/kg/min titrate for MAP >= 65)',
        category: 'First-Line Vasopressor',
        costUnits: 90,
        timeSpentSeconds: 60,
        isCriticalAction: false,
        isContraindicated: false,
        vitalsDelta: { systolicBp: 112, diastolicBp: 68 },
        patientResponse: 'Infusion pump titrated to maintain Mean Arterial Pressure.',
        clinicalConsequence:
          'Alpha-1 vasoconstriction restores systemic vascular resistance in distributive vasodilatory septic shock.',
      },
      'act-serial-lactate': {
        id: 'act-serial-lactate',
        type: 'INVESTIGATION',
        label: 'Repeat Blood Lactate at 2 Hours',
        category: 'Resuscitation Monitoring',
        costUnits: 30,
        timeSpentSeconds: 60,
        isCriticalAction: true,
        isContraindicated: false,
        patientResponse: 'Blood sample drawn.',
        clinicalConsequence:
          'Lactate clears from 4.4 to 2.1 mmol/L, confirming adequate cellular resuscitation and microcirculatory perfusion.',
      },
      'act-icu-admission': {
        id: 'act-icu-admission',
        type: 'INTERVENTION',
        label: 'Transfer to Medical Intensive Care Unit (MICU)',
        category: 'Inpatient Disposition',
        costUnits: 500,
        timeSpentSeconds: 120,
        isCriticalAction: true,
        isContraindicated: false,
        patientResponse: 'Patient transferred safely to MICU Bed 4 under continuous hemodynamic monitoring.',
        clinicalConsequence:
          'Appropriate level of care for septic shock requiring vasopressors and high-dependency nursing.',
      },
    },
    differentialCatalog: [
      {
        id: 'diag-neutropenic-septic-shock',
        name: 'Neutropenic Sepsis & Septic Shock secondary to CRBSI',
        isPrimary: true,
        likelihoodScore: 0.95,
        supportingClues: [
          'ANC < 500/uL 10 days post-chemo (nadir)',
          'Fever > 38.3°C with rigors',
          'Lactate 4.4 mmol/L + SBP < 90 (Septic Shock)',
          'Erythema over Port-a-Cath site',
        ],
        refutingClues: [],
      },
      {
        id: 'diag-tumor-lysis',
        name: 'Tumor Lysis Syndrome (TLS)',
        isPrimary: false,
        likelihoodScore: 0.2,
        supportingClues: ['Recent chemotherapy'],
        refutingClues: ['Normal serum potassium, phosphate, and absence of acute renal failure'],
      },
    ],
    attendingVivaQuestions: [
      {
        id: 'viva-sepsis-1',
        question:
          'What is the international guideline target timeframe for initiating broad-spectrum empiric antimicrobials in suspected neutropenic septic shock?',
        options: [
          'Within 1 hour of hospital arrival / triage presentation (Door-to-Antibiotic <= 60 min)',
          'Within 4 hours, after obtaining CT abdomen-pelvis',
          'Within 6 hours, once microbiological blood culture growth confirms speciation',
          'Within 12 hours after completing 3 liters of fluid loading',
        ],
        correctOptionIndex: 0,
        rationale:
          'Every hour of delay in antibiotic administration in septic shock is associated with an 8% increase in mortality (Surviving Sepsis Campaign / ASCO-IDSA guidelines).',
      },
    ],
  },
};

/**
 * Initializes a new Candidate Case Session
 */
export function initializeCaseSession(scenarioId: string): CandidateCaseSession {
  const scenario = SEEDED_BRANCHING_SCENARIOS[scenarioId] || SEEDED_BRANCHING_SCENARIOS['case-rv-stemi'];
  const initialNode = scenario.nodes[scenario.initialNodeId];

  return {
    scenarioId,
    currentNodeId: scenario.initialNodeId,
    currentVitals: { ...initialNode.vitals },
    currentEmotionalState: initialNode.emotionalState,
    executedActionIds: [],
    candidateDifferentialRankings: scenario.differentialCatalog.map((diag, index) => ({
      diagnosisId: diag.id,
      rank: index + 1,
      certaintyPercent: index === 0 ? 60 : 20,
    })),
    elapsedSeconds: 0,
    totalCostUnits: 0,
    safetyViolationCount: 0,
    isCompleted: false,
    historyLog: [],
  };
}

/**
 * Executes a Clinical Action, advancing session state and vitals
 */
export function executeCaseAction(
  session: CandidateCaseSession,
  actionId: string
): { updatedSession: CandidateCaseSession; action: BranchingAction; consequence: string } {
  const scenario = SEEDED_BRANCHING_SCENARIOS[session.scenarioId];
  if (!scenario) throw new Error(`Unknown scenario: ${session.scenarioId}`);

  const action = scenario.actionsCatalog[actionId];
  if (!action) throw new Error(`Unknown action: ${actionId}`);

  // Prevent duplicate execution of same action unless fluid/repeatable
  const isDuplicate = session.executedActionIds.includes(actionId);
  const updatedExecutedIds = isDuplicate ? session.executedActionIds : [...session.executedActionIds, actionId];

  // Update vitals
  const newVitals: ClinicalVitals = {
    ...session.currentVitals,
    ...(action.vitalsDelta || {}),
  };

  // Determine node transition
  let nextNodeId = session.currentNodeId;
  if (action.subsequentStateId && scenario.nodes[action.subsequentStateId]) {
    nextNodeId = action.subsequentStateId;
  }

  // Cost and time
  const updatedCost = session.totalCostUnits + action.costUnits;
  const updatedElapsedSeconds = session.elapsedSeconds + action.timeSpentSeconds;
  const newSafetyViolations = session.safetyViolationCount + (action.isContraindicated ? 1 : 0);

  // Check if scenario finished
  const isTerminalNode =
    nextNodeId === 'node-cath-lab-transferred' ||
    (nextNodeId === 'node-sepsis-stabilized' && updatedExecutedIds.includes('act-icu-admission'));

  const updatedSession: CandidateCaseSession = {
    ...session,
    currentNodeId: nextNodeId,
    currentVitals: newVitals,
    currentEmotionalState:
      action.isContraindicated
        ? 'OBTUNDED'
        : scenario.nodes[nextNodeId]?.emotionalState || session.currentEmotionalState,
    executedActionIds: updatedExecutedIds,
    elapsedSeconds: updatedElapsedSeconds,
    totalCostUnits: updatedCost,
    safetyViolationCount: newSafetyViolations,
    isCompleted: isTerminalNode,
    historyLog: [
      ...session.historyLog,
      {
        timestamp: Date.now(),
        action,
        resultingVitals: newVitals,
        nodeTransitionedTo: nextNodeId !== session.currentNodeId ? nextNodeId : undefined,
      },
    ],
  };

  return {
    updatedSession,
    action,
    consequence: action.clinicalConsequence,
  };
}

/**
 * Calculates 5-Dimensional AI OSCE Rubric Scores
 */
export function calculateRubricScores(session: CandidateCaseSession): CandidatePerformanceReport {
  const scenario = SEEDED_BRANCHING_SCENARIOS[session.scenarioId];
  if (!scenario) throw new Error(`Unknown scenario: ${session.scenarioId}`);

  const allActions = Object.values(scenario.actionsCatalog);
  const criticalActions = allActions.filter((a) => a.isCriticalAction);

  // 1. Diagnostic Accuracy (0 - 25 pts)
  const completedCritical = criticalActions.filter((a) => session.executedActionIds.includes(a.id));
  const missedCritical = criticalActions.filter((a) => !session.executedActionIds.includes(a.id));

  // Differential rank check: is the primary diagnosis ranked #1?
  const topRankedDiag = session.candidateDifferentialRankings.find((r) => r.rank === 1);
  const correctPrimaryDiagnosed = topRankedDiag?.diagnosisId === scenario.expectedPrimaryDiagnosisId;

  let diagnosticScore = 0;
  if (criticalActions.length > 0) {
    diagnosticScore += (completedCritical.length / criticalActions.length) * 15;
  }
  if (correctPrimaryDiagnosed) {
    diagnosticScore += 10;
  } else {
    diagnosticScore += 3; // partial credit
  }
  diagnosticScore = Math.round(Math.min(25, diagnosticScore));

  // 2. Patient Safety (0 - 25 pts)
  const safetyPenalty = session.safetyViolationCount * 12.5;
  const safetyScore = Math.round(Math.max(0, 25 - safetyPenalty));

  // 3. Resource Stewardship (0 - 20 pts)
  // Target cost budget: ~500 cost units. Deduct points if runaway wasteful ordering
  let resourceScore = 20;
  if (session.totalCostUnits > 600) {
    resourceScore -= Math.min(10, Math.round((session.totalCostUnits - 600) / 100) * 2);
  }
  resourceScore = Math.max(5, resourceScore);

  // 4. Clinical Communication & Demeanor (0 - 15 pts)
  const communicationActions = session.executedActionIds.filter((id) => {
    const act = scenario.actionsCatalog[id];
    return act?.type === 'COMMUNICATION' || act?.type === 'HISTORY';
  });
  const communicationScore = Math.min(15, 8 + communicationActions.length * 3.5);

  // 5. Decision Velocity (0 - 15 pts)
  // Optimal encounter duration: 300 - 600 seconds
  let velocityScore = 15;
  if (session.elapsedSeconds > 900) {
    velocityScore = 8;
  } else if (session.elapsedSeconds > 600) {
    velocityScore = 12;
  }

  const totalScore = Math.round(
    diagnosticScore + safetyScore + resourceScore + communicationScore + velocityScore
  );
  const passed = totalScore >= 70 && safetyScore >= 12;

  let grade: CandidatePerformanceReport['grade'] = 'FAIL';
  if (totalScore >= 90 && safetyScore === 25) {
    grade = 'HONORS';
  } else if (totalScore >= 75) {
    grade = 'PASS';
  } else if (totalScore >= 65) {
    grade = 'PROVISIONAL';
  }

  // Formulate clinical debrief
  const debriefParts: string[] = [];
  if (passed) {
    debriefParts.push(
      `Outstanding clinical competence demonstrated in managing ${scenario.title}. Rapid diagnostic convergence and adherence to emergency resuscitation guidelines.`
    );
  } else {
    debriefParts.push(
      `Encounter fell below the minimum clinical competency threshold for ${scenario.title}. Review critical diagnostic protocols and avoid contraindicated maneuvers.`
    );
  }

  if (session.safetyViolationCount > 0) {
    debriefParts.push(
      `CRITICAL SAFETY HAZARD: ${session.safetyViolationCount} contraindicated intervention(s) were initiated, inducing avoidable patient hemodynamic compromise.`
    );
  }

  const tips: string[] = [
    'Always prioritize ABCDE stabilization and high-yield, specific bedside diagnostics before broad testing.',
    'In suspected inferior myocardial infarction, routinely acquire right-sided V3R-V4R leads to rule out preload-sensitive RV involvement.',
    'Early goal-directed resuscitation in septic shock mandates antimicrobials within 60 minutes of triage arrival.',
  ];

  return {
    scenarioId: session.scenarioId,
    totalScore,
    passed,
    grade,
    dimensionScores: {
      diagnosticAccuracy: diagnosticScore,
      patientSafety: safetyScore,
      resourceStewardship: resourceScore,
      clinicalCommunication: Math.round(communicationScore),
      decisionVelocity: Math.round(velocityScore),
    },
    criticalActionsCompleted: completedCritical.map((a) => a.label),
    missedCriticalActions: missedCritical.map((a) => a.label),
    safetyViolations: session.historyLog
      .filter((h) => h.action.isContraindicated)
      .map((h) => h.action.label),
    totalCostIncurred: session.totalCostUnits,
    totalTimeElapsedSeconds: session.elapsedSeconds,
    clinicalDebrief: debriefParts.join(' '),
    attendingFeedbackTips: tips,
  };
}
