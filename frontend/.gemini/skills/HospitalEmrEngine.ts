/**
 * HospitalEmrEngine.ts
 * High-Fidelity Inpatient Clinical Information System & Clinical Decision Support (CDS) Engine
 * Location: frontend/.gemini/skills/HospitalEmrEngine.ts
 */

export interface InpatientAllergy {
  allergen: string;
  reactionType: 'ANAPHYLAXIS' | 'ANGIOEDEMA' | 'SEVERE_RASH' | 'MILD_INTOLERANCE';
  manifestations: string;
  severity: 'CRITICAL' | 'MODERATE' | 'MILD';
}

export interface InpatientVitalsEntry {
  timestamp: string; // e.g., '08:00'
  hr: number; // bpm
  sbp: number; // mmHg
  dbp: number; // mmHg
  rr: number; // breaths/min
  tempC: number; // Celsius
  spo2: number; // %
  painScore: number; // 0-10
  gcs: number; // 3-15
  fio2?: number; // e.g. 21% or 40%
  o2Device?: string; // 'Room Air' | 'Nasal Cannula 2L' | 'Venturi Mask 40%'
}

export interface IntakeRecord {
  id: string;
  timestamp: string;
  source: 'IV_CRYSTALLOID' | 'IV_MEDICATIONS' | 'ORAL_FLUIDS' | 'ENTERAL_TUBE' | 'BLOOD_PRODUCTS';
  description: string;
  volumeMl: number;
}

export interface OutputRecord {
  id: string;
  timestamp: string;
  source: 'URINE_FOLEY' | 'URINE_VOID' | 'SURGICAL_DRAIN' | 'EMESIS' | 'STOOL' | 'CHEST_TUBE';
  description: string;
  volumeMl: number;
}

export interface InpatientMedicationOrder {
  id: string;
  drugName: string;
  category: 'ANTIBIOTIC' | 'CARDIOVASCULAR' | 'ANALGESIC' | 'ANTICOAGULANT' | 'ELECTROLYTE' | 'DIURETIC' | 'OTHER';
  dose: string;
  route: 'IV' | 'PO' | 'SC' | 'IM' | 'INHALED';
  frequency: 'Q24H' | 'Q12H' | 'Q8H' | 'Q6H' | 'Q4H' | 'PRN' | 'CONTINUOUS_INFUSION' | 'ONCE_STAT';
  scheduleType: 'SCHEDULED' | 'PRN' | 'CONTINUOUS' | 'STAT';
  isHighAlert: boolean; // Needs dual nurse sign-off (Insulin, Heparin, Opioids)
  requiresRenalAdjustment: boolean;
  indication: string;
  orderedBy: string;
  orderedAt: string;
  status: 'ACTIVE' | 'DISCONTINUED' | 'COMPLETED';
}

export interface MarAdministrationRecord {
  orderId: string;
  drugName: string;
  scheduledTime: string; // e.g. '09:00'
  status: 'GIVEN' | 'DUE' | 'OVERDUE' | 'HELD';
  administeredAt?: string;
  administeredBy?: string;
  witnessedBy?: string; // For high-alert dual sign-off
  heldReason?: string;
  notes?: string;
}

export interface InpatientLabItem {
  id: string;
  panel: 'CBC' | 'BMP' | 'COAGS' | 'CARDIAC' | 'LIVER' | 'MICROBIOLOGY';
  testName: string;
  value: number | string;
  unit: string;
  refRange: string;
  flag?: 'HIGH' | 'LOW' | 'CRITICAL' | 'NORMAL';
  collectedAt: string;
}

export interface InpatientImagingStudy {
  id: string;
  modality: 'CXR' | 'CT' | 'MRI' | 'ULTRASOUND' | 'ECHO' | 'ECG';
  title: string;
  performedAt: string;
  indication: string;
  findings: string;
  impression: string;
  radiologist: string;
}

export interface InpatientClinicalNote {
  id: string;
  noteType: 'MD_ADMISSION_H_AND_P' | 'MD_PROGRESS_NOTE' | 'NURSE_SHIFT_NOTE' | 'PHARMACY_CONSULT' | 'DISCHARGE_SUMMARY';
  title: string;
  author: string;
  authorRole: 'ATTENDING_MD' | 'RESIDENT_MD' | 'CHARGE_RN' | 'CLINICAL_PHARMD';
  createdAt: string;
  content: {
    subjective?: string;
    objective?: string;
    assessment?: string;
    plan?: string;
    summary?: string;
  };
}

export interface BestPracticeAdvisory {
  id: string;
  type: 'SEPSIS_ALERT' | 'VTE_PROPHYLAXIS' | 'FALL_RISK' | 'GLYCEMIC_CONTROL' | 'ANTIBIOTIC_TIMEOUT';
  severity: 'INTERRUPTIVE_CRITICAL' | 'WARNING' | 'ADVISORY_INFO';
  title: string;
  triggerDescription: string;
  recommendedAction: string;
  rationale: string;
}

export interface InpatientRecord {
  id: string;
  mrn: string;
  firstName: string;
  lastName: string;
  age: number;
  gender: 'MALE' | 'FEMALE';
  dob: string;
  admissionDate: string;
  unit: string; // e.g. 'Cardiology Telemetry Step-Down'
  bed: string; // e.g. 'BED-402B'
  codeStatus: 'FULL_CODE' | 'DNR_DNI' | 'DNR_OK_INTUBATE';
  isolation: 'STANDARD' | 'CONTACT' | 'DROPLET' | 'AIRBORNE';
  attendingPhysician: string;
  primaryDiagnosis: string;
  secondaryDiagnoses: string[];
  allergies: InpatientAllergy[];
  weightKg: number;
  heightCm: number;
  serumCreatinineMgDl: number;
  calculatedEgfr: number; // mL/min/1.73m2
  baselineQtcMs: number;
  vitalsHistory: InpatientVitalsEntry[];
  intakeRecords: IntakeRecord[];
  outputRecords: OutputRecord[];
  medicationOrders: InpatientMedicationOrder[];
  marRecords: MarAdministrationRecord[];
  labResults: InpatientLabItem[];
  imagingStudies: InpatientImagingStudy[];
  clinicalNotes: InpatientClinicalNote[];
  activeBpas: BestPracticeAdvisory[];
}

// ---------------------------------------------------------------------------
// 4 HIGH-FIDELITY INPATIENT CASES
// ---------------------------------------------------------------------------

export const INPATIENT_CENSUS: InpatientRecord[] = [
  {
    id: 'pt-adhf-001',
    mrn: 'MRN-448102',
    firstName: 'Marcus',
    lastName: 'Vance',
    age: 64,
    gender: 'MALE',
    dob: '1962-04-18',
    admissionDate: '2026-09-10 (Hospital Day 2)',
    unit: 'Cardiology Telemetry Step-Down',
    bed: 'BED-402B',
    codeStatus: 'FULL_CODE',
    isolation: 'STANDARD',
    attendingPhysician: 'Dr. Sarah Al-Mansoor, MD (Cardiology)',
    primaryDiagnosis: 'Acute Decompensated Heart Failure (HFrEF, EF 20%, NYHA Class IV, Stevenson Profile B: Warm & Wet)',
    secondaryDiagnoses: [
      'Non-ischemic Dilated Cardiomyopathy',
      'Chronic Kidney Disease Stage 3a (Baseline Cr 1.4 mg/dL)',
      'Hypertension',
      'Atrial Fibrillation (Rate-controlled on Digoxin)',
    ],
    allergies: [
      {
        allergen: 'Lisinopril (ACE Inhibitors)',
        reactionType: 'ANGIOEDEMA',
        manifestations: 'Severe tongue and lip edema requiring ED intubation (2021). Strict avoidance of all ACEi and ARB classes.',
        severity: 'CRITICAL',
      },
    ],
    weightKg: 88.5,
    heightCm: 178,
    serumCreatinineMgDl: 1.5,
    calculatedEgfr: 48,
    baselineQtcMs: 462,
    vitalsHistory: [
      { timestamp: '04:00', hr: 94, sbp: 138, dbp: 86, rr: 24, tempC: 36.8, spo2: 91, painScore: 2, gcs: 15, fio2: 28, o2Device: 'Nasal Cannula 2L' },
      { timestamp: '06:00', hr: 90, sbp: 134, dbp: 84, rr: 22, tempC: 36.9, spo2: 93, painScore: 1, gcs: 15, fio2: 28, o2Device: 'Nasal Cannula 2L' },
      { timestamp: '08:00', hr: 86, sbp: 128, dbp: 80, rr: 20, tempC: 37.0, spo2: 95, painScore: 1, gcs: 15, fio2: 28, o2Device: 'Nasal Cannula 2L' },
      { timestamp: '10:00', hr: 82, sbp: 122, dbp: 78, rr: 18, tempC: 36.7, spo2: 96, painScore: 0, gcs: 15, fio2: 28, o2Device: 'Nasal Cannula 2L' },
    ],
    intakeRecords: [
      { id: 'in-1', timestamp: '06:00', source: 'IV_MEDICATIONS', description: 'Furosemide IV infusion carrier (D5W)', volumeMl: 100 },
      { id: 'in-2', timestamp: '07:30', source: 'ORAL_FLUIDS', description: 'Water with morning medication pass', volumeMl: 150 },
      { id: 'in-3', timestamp: '08:30', source: 'ORAL_FLUIDS', description: 'Low-sodium breakfast tea', volumeMl: 200 },
    ],
    outputRecords: [
      { id: 'out-1', timestamp: '06:30', source: 'URINE_VOID', description: 'Urinal post-furosemide push', volumeMl: 650 },
      { id: 'out-2', timestamp: '08:45', source: 'URINE_VOID', description: 'Urinal second diuresis void', volumeMl: 550 },
      { id: 'out-3', timestamp: '10:15', source: 'URINE_VOID', description: 'Urinal third diuresis void', volumeMl: 400 },
    ],
    medicationOrders: [
      {
        id: 'rx-vance-1',
        drugName: 'Furosemide',
        category: 'DIURETIC',
        dose: '80 mg',
        route: 'IV',
        frequency: 'Q12H',
        scheduleType: 'SCHEDULED',
        isHighAlert: false,
        requiresRenalAdjustment: true,
        indication: 'Acute Decompensated Heart Failure diuresis',
        orderedBy: 'Dr. Sarah Al-Mansoor, MD',
        orderedAt: '2026-09-10 18:00',
        status: 'ACTIVE',
      },
      {
        id: 'rx-vance-2',
        drugName: 'Carvedilol',
        category: 'CARDIOVASCULAR',
        dose: '6.25 mg',
        route: 'PO',
        frequency: 'Q12H',
        scheduleType: 'SCHEDULED',
        isHighAlert: false,
        requiresRenalAdjustment: false,
        indication: 'HFrEF guideline-directed medical therapy (maintain low-dose, do not up-titrate while decompensated)',
        orderedBy: 'Dr. Sarah Al-Mansoor, MD',
        orderedAt: '2026-09-10 18:00',
        status: 'ACTIVE',
      },
      {
        id: 'rx-vance-3',
        drugName: 'Potassium Chloride (KCl)',
        category: 'ELECTROLYTE',
        dose: '20 mEq',
        route: 'PO',
        frequency: 'Q24H',
        scheduleType: 'SCHEDULED',
        isHighAlert: true,
        requiresRenalAdjustment: true,
        indication: 'Post-diuretic hypokalemia replacement (target K+ 4.0-4.5 mEq/L)',
        orderedBy: 'Dr. Sarah Al-Mansoor, MD',
        orderedAt: '2026-09-11 08:00',
        status: 'ACTIVE',
      },
      {
        id: 'rx-vance-4',
        drugName: 'Digoxin',
        category: 'CARDIOVASCULAR',
        dose: '0.125 mg',
        route: 'PO',
        frequency: 'Q24H',
        scheduleType: 'SCHEDULED',
        isHighAlert: true,
        requiresRenalAdjustment: true,
        indication: 'Atrial fibrillation rate control & inotropic support in HFrEF',
        orderedBy: 'Dr. Sarah Al-Mansoor, MD',
        orderedAt: '2026-09-10 18:00',
        status: 'ACTIVE',
      },
    ],
    marRecords: [
      { orderId: 'rx-vance-1', drugName: 'Furosemide 80 mg IV', scheduledTime: '08:00', status: 'GIVEN', administeredAt: '08:05', administeredBy: 'Nurse Jessica Reed, RN' },
      { orderId: 'rx-vance-2', drugName: 'Carvedilol 6.25 mg PO', scheduledTime: '08:00', status: 'GIVEN', administeredAt: '08:10', administeredBy: 'Nurse Jessica Reed, RN' },
      { orderId: 'rx-vance-3', drugName: 'Potassium Chloride 20 mEq PO', scheduledTime: '12:00', status: 'DUE' },
      { orderId: 'rx-vance-4', drugName: 'Digoxin 0.125 mg PO', scheduledTime: '12:00', status: 'DUE' },
    ],
    labResults: [
      { id: 'l-v-1', panel: 'CARDIAC', testName: 'NT-proBNP', value: 12400, unit: 'pg/mL', refRange: '< 450', flag: 'CRITICAL', collectedAt: '2026-09-11 06:00' },
      { id: 'l-v-2', panel: 'BMP', testName: 'Potassium', value: 3.6, unit: 'mEq/L', refRange: '3.5 - 5.0', flag: 'NORMAL', collectedAt: '2026-09-11 06:00' },
      { id: 'l-v-3', panel: 'BMP', testName: 'Sodium', value: 134, unit: 'mEq/L', refRange: '135 - 145', flag: 'LOW', collectedAt: '2026-09-11 06:00' },
      { id: 'l-v-4', panel: 'BMP', testName: 'Creatinine', value: 1.5, unit: 'mg/dL', refRange: '0.7 - 1.3', flag: 'HIGH', collectedAt: '2026-09-11 06:00' },
      { id: 'l-v-5', panel: 'BMP', testName: 'BUN', value: 38, unit: 'mg/dL', refRange: '7 - 20', flag: 'HIGH', collectedAt: '2026-09-11 06:00' },
      { id: 'l-v-6', panel: 'CBC', testName: 'Hemoglobin', value: 13.2, unit: 'g/dL', refRange: '13.5 - 17.5', flag: 'LOW', collectedAt: '2026-09-11 06:00' },
    ],
    imagingStudies: [
      {
        id: 'img-v-1',
        modality: 'CXR',
        title: 'Chest X-Ray AP Portable',
        performedAt: '2026-09-10 19:30',
        indication: 'Worsening dyspnea and orthopnea',
        findings: 'Marked cardiomegaly with cardiothoracic ratio > 0.60. Prominent pulmonary vascular congestion, bilateral perihilar bat-wing alveolar opacities, Kerley B lines, and moderate blunting of bilateral costophrenic sulci consistent with bilateral pleural effusions.',
        impression: 'Severe acute pulmonary edema with bilateral pleural effusions on background of cardiomegaly.',
        radiologist: 'Dr. Elena Patel, MD (Diagnostic Radiology)',
      },
      {
        id: 'img-v-2',
        modality: 'ECHO',
        title: 'Transthoracic Echocardiogram (TTE)',
        performedAt: '2026-09-11 09:00',
        indication: 'Evaluate LV systolic function in acute decompensation',
        findings: 'Severely dilated left ventricle with global hypokinesis. LVEF estimated at 20-22%. Moderate-to-severe functional mitral regurgitation. Moderate tricuspid regurgitation with estimated PASP of 52 mmHg (pulmonary hypertension). IVC dilated at 2.4 cm with < 50% collapsibility (RAP ~15 mmHg).',
        impression: 'Severe non-ischemic cardiomyopathy with LVEF 20%, secondary mitral regurgitation, and severe right-sided filling pressure elevation.',
        radiologist: 'Dr. Kevin Zhao, MD (Cardiovascular Imaging)',
      },
    ],
    clinicalNotes: [
      {
        id: 'note-v-1',
        noteType: 'MD_ADMISSION_H_AND_P',
        title: 'Cardiology Inpatient Admission H&P',
        author: 'Dr. Sarah Al-Mansoor, MD',
        authorRole: 'ATTENDING_MD',
        createdAt: '2026-09-10 20:30',
        content: {
          subjective: '64yo male with ischemic/dilated cardiomyopathy (EF 20%) presenting with 5 days of worsening exertional dyspnea, 3-pillow orthopnea, and 12-lb weight gain over 10 days. Admits to dietary salt indiscretion over holiday weekend. Denies chest pain, palpitations, syncope.',
          objective: 'Vitals: BP 142/88, HR 96 irregular, RR 24, SpO2 91% on RA -> 95% on 2L NC. General: Sitting upright, mild respiratory distress. Neck: JVD to angle of mandible at 45 degrees (~12 cm H2O), positive hepatojugular reflux. CV: S1, S2, audible S3 gallop, 3/6 holosystolic murmur at apex radiating to axilla. Lungs: Bilateral bibasilar crackles extending to mid-lung zones. Extremities: 3+ pitting edema bilateral lower extremities to mid-shins.',
          assessment: '1. Acute Decompensated Heart Failure (HFrEF EF 20%), Stevenson Profile B (Warm & Wet), triggered by dietary sodium overload and progressive fluid retention.\n2. Chronic Kidney Disease Stage 3a with cardio-renal overlap.\n3. History of Lisinopril Angioedema: STRICT CONTRAINDICATION to ACEi/ARB.',
          plan: '1. Decongestion: Aggressive IV loop diuresis with Furosemide 80 mg IV q12h. Goal net negative fluid balance -1.5 to -2.0 L/day.\n2. Strict fluid restriction 1500 mL/24h, strict 2-gram sodium diet.\n3. Daily weights at 06:00, strict I&O monitoring with foley/urinal.\n4. Monitor BMP q12-24h; maintain serum K+ > 4.0 mEq/L and Mg2+ > 2.0 mg/dL.\n5. Once stabilized and euvolemic, consider initiating SGLT2 inhibitor (Dapagliflozin) and cautious titration of GDMT.',
        },
      },
    ],
    activeBpas: [
      {
        id: 'bpa-v-1',
        type: 'VTE_PROPHYLAXIS',
        severity: 'WARNING',
        title: 'VTE Chemoprophylaxis Review Required',
        triggerDescription: 'Patient hospitalized with acute medical illness (ADHF) and reduced mobility. Caprini score >= 3.',
        recommendedAction: 'Order Enoxaparin 40 mg SC daily or Heparin 5000 units SC q8h unless contraindicated.',
        rationale: 'Hospitalized heart failure patients carry high thromboembolic risk without thromboprophylaxis.',
      },
    ],
  },

  {
    id: 'pt-sepsis-002',
    mrn: 'MRN-882941',
    firstName: 'Sarah',
    lastName: 'Jenkins',
    age: 34,
    gender: 'FEMALE',
    dob: '1992-08-11',
    admissionDate: '2026-09-11 (Hospital Day 1)',
    unit: 'Medical Intensive Care Unit (MICU)',
    bed: 'MICU-BED-08',
    codeStatus: 'FULL_CODE',
    isolation: 'CONTACT',
    attendingPhysician: 'Dr. Michael Chang, MD, FCCP (Critical Care)',
    primaryDiagnosis: 'Severe Sepsis secondary to Acute Obstructive Pyelonephritis (Gram-negative bacillary urosepsis)',
    secondaryDiagnoses: [
      'Right Nephrolithiasis (6 mm distal ureteral calculus causing hydronephrosis)',
      'Acute Kidney Injury (KDIGO Stage 2, Cr 2.1 mg/dL from baseline 0.8 mg/dL)',
      'Lactic Acidosis (Initial lactate 4.2 mmol/L)',
      'Type 1 Diabetes Mellitus (on basal-bolus insulin)',
    ],
    allergies: [
      {
        allergen: 'Penicillin / Amoxicillin',
        reactionType: 'ANAPHYLAXIS',
        manifestations: 'Severe anaphylaxis: diffuse urticaria, stridor, bronchospasm, and profound hypotension requiring IM epinephrine (2018).',
        severity: 'CRITICAL',
      },
    ],
    weightKg: 65.0,
    heightCm: 165,
    serumCreatinineMgDl: 2.1,
    calculatedEgfr: 32,
    baselineQtcMs: 418,
    vitalsHistory: [
      { timestamp: '06:00', hr: 128, sbp: 82, dbp: 48, rr: 28, tempC: 39.4, spo2: 94, painScore: 8, gcs: 14, fio2: 21, o2Device: 'Room Air' },
      { timestamp: '07:00', hr: 116, sbp: 94, dbp: 56, rr: 24, tempC: 39.1, spo2: 96, painScore: 7, gcs: 15, fio2: 28, o2Device: 'Nasal Cannula 2L' },
      { timestamp: '08:00', hr: 104, sbp: 102, dbp: 62, rr: 22, tempC: 38.6, spo2: 97, painScore: 6, gcs: 15, fio2: 28, o2Device: 'Nasal Cannula 2L' },
      { timestamp: '10:00', hr: 96, sbp: 108, dbp: 66, rr: 20, tempC: 38.1, spo2: 98, painScore: 5, gcs: 15, fio2: 28, o2Device: 'Nasal Cannula 2L' },
    ],
    intakeRecords: [
      { id: 'in-s-1', timestamp: '06:15', source: 'IV_CRYSTALLOID', description: 'Plasmalyte 30 mL/kg rapid bolus (SEP-1 bundle)', volumeMl: 1950 },
      { id: 'in-s-2', timestamp: '07:30', source: 'IV_MEDICATIONS', description: 'Cefepime 2g in D5W 100mL IV piggyback', volumeMl: 100 },
      { id: 'in-s-3', timestamp: '08:15', source: 'IV_CRYSTALLOID', description: 'Plasmalyte continuous maintenance at 100 mL/h', volumeMl: 250 },
    ],
    outputRecords: [
      { id: 'out-s-1', timestamp: '07:00', source: 'URINE_FOLEY', description: 'Foley placement initial drain (cloudy, turbid)', volumeMl: 80 },
      { id: 'out-s-2', timestamp: '08:00', source: 'URINE_FOLEY', description: 'Hourly foley output (1.2 mL/kg/h)', volumeMl: 78 },
      { id: 'out-s-3', timestamp: '09:00', source: 'URINE_FOLEY', description: 'Hourly foley output (1.1 mL/kg/h)', volumeMl: 72 },
    ],
    medicationOrders: [
      {
        id: 'rx-jenk-1',
        drugName: 'Cefepime',
        category: 'ANTIBIOTIC',
        dose: '2 g',
        route: 'IV',
        frequency: 'Q12H',
        scheduleType: 'SCHEDULED',
        isHighAlert: false,
        requiresRenalAdjustment: true,
        indication: 'Empiric urosepsis coverage (4th gen cephalosporin; safe in penicillin anaphylaxis with negligible side-chain cross reactivity, but requires renal adjustment)',
        orderedBy: 'Dr. Michael Chang, MD',
        orderedAt: '2026-09-11 06:45',
        status: 'ACTIVE',
      },
      {
        id: 'rx-jenk-2',
        drugName: 'Acetaminophen (Paracetamol)',
        category: 'ANALGESIC',
        dose: '1000 mg',
        route: 'IV',
        frequency: 'Q6H',
        scheduleType: 'PRN',
        isHighAlert: false,
        requiresRenalAdjustment: false,
        indication: 'Severe pyrexia and flank pain',
        orderedBy: 'Dr. Michael Chang, MD',
        orderedAt: '2026-09-11 06:45',
        status: 'ACTIVE',
      },
      {
        id: 'rx-jenk-3',
        drugName: 'Regular Insulin (Novolin R)',
        category: 'OTHER',
        dose: 'Per Sliding Scale Protocol',
        route: 'SC',
        frequency: 'Q4H',
        scheduleType: 'PRN',
        isHighAlert: true,
        requiresRenalAdjustment: true,
        indication: 'Tight glycemic control in sepsis (target blood glucose 140-180 mg/dL)',
        orderedBy: 'Dr. Michael Chang, MD',
        orderedAt: '2026-09-11 07:00',
        status: 'ACTIVE',
      },
    ],
    marRecords: [
      { orderId: 'rx-jenk-1', drugName: 'Cefepime 2g IV', scheduledTime: '07:00', status: 'GIVEN', administeredAt: '07:15', administeredBy: 'Nurse Brian O\'Connor, BSN' },
      { orderId: 'rx-jenk-2', drugName: 'Acetaminophen 1000 mg IV', scheduledTime: '07:30', status: 'GIVEN', administeredAt: '07:35', administeredBy: 'Nurse Brian O\'Connor, BSN' },
      { orderId: 'rx-jenk-3', drugName: 'Regular Insulin SC sliding scale', scheduledTime: '11:00', status: 'DUE' },
    ],
    labResults: [
      { id: 'l-s-1', panel: 'MICROBIOLOGY', testName: 'Blood Culture x2 (Set 1 & 2)', value: 'Gram-negative bacilli observed in aerobic bottles (Preliminary)', unit: 'Text', refRange: 'No Growth', flag: 'CRITICAL', collectedAt: '2026-09-11 06:10' },
      { id: 'l-s-2', panel: 'BMP', testName: 'Lactate (Initial)', value: 4.2, unit: 'mmol/L', refRange: '0.5 - 2.0', flag: 'CRITICAL', collectedAt: '2026-09-11 06:15' },
      { id: 'l-s-3', panel: 'BMP', testName: 'Lactate (Repeat 2h post-fluid)', value: 2.1, unit: 'mmol/L', refRange: '0.5 - 2.0', flag: 'HIGH', collectedAt: '2026-09-11 08:30' },
      { id: 'l-s-4', panel: 'CBC', testName: 'White Blood Cell (WBC)', value: 22.8, unit: 'x10^3/uL', refRange: '4.5 - 11.0', flag: 'CRITICAL', collectedAt: '2026-09-11 06:15' },
      { id: 'l-s-5', panel: 'CBC', testName: 'Bands (Immature Granulocytes)', value: 18, unit: '%', refRange: '0 - 5', flag: 'HIGH', collectedAt: '2026-09-11 06:15' },
      { id: 'l-s-6', panel: 'BMP', testName: 'Creatinine', value: 2.1, unit: 'mg/dL', refRange: '0.6 - 1.1', flag: 'CRITICAL', collectedAt: '2026-09-11 06:15' },
      { id: 'l-s-7', panel: 'BMP', testName: 'Serum Glucose', value: 242, unit: 'mg/dL', refRange: '70 - 99', flag: 'HIGH', collectedAt: '2026-09-11 06:15' },
    ],
    imagingStudies: [
      {
        id: 'img-s-1',
        modality: 'CT',
        title: 'CT Abdomen & Pelvis without IV Contrast',
        performedAt: '2026-09-11 07:45',
        indication: 'Flank pain, septic shock, evaluate for obstructive uropathy',
        findings: 'Right kidney demonstrates marked perinephric fat stranding and parenchymal hypoattenuation. Moderate right hydroureteronephrosis terminating at a 6.2 mm radiopaque calculus within the distal right ureter near the ureterovesical junction (UVJ). No abscess collection or free air.',
        impression: '1. Acute right obstructive pyelonephritis secondary to 6.2 mm distal right ureteral stone.\n2. Emergent urologic decompression recommended (ureteral stent vs percutaneous nephrostomy).',
        radiologist: 'Dr. Marcus Holloway, MD (Body Imaging)',
      },
    ],
    clinicalNotes: [
      {
        id: 'note-s-1',
        noteType: 'MD_ADMISSION_H_AND_P',
        title: 'MICU Critical Care Admission Note',
        author: 'Dr. Michael Chang, MD, FCCP',
        authorRole: 'ATTENDING_MD',
        createdAt: '2026-09-11 08:30',
        content: {
          subjective: '34yo female with T1DM presenting with 3 days of severe right flank pain, rigors, nausea, and vomiting. Found in ED with temp 39.4C, HR 128, BP 82/48. Immediate 30 mL/kg balanced crystalloid bolus administered per SEP-1 protocol.',
          objective: 'Vitals post-fluid: BP 102/62, HR 104, RR 22, SpO2 97% on 2L NC. General: Toxic appearance, diaphoretic. Abdomen: Soft, non-distended, exquisite right costovertebral angle (CVA) tenderness. GU: Foley catheter in place draining cloudy urine. Neuro: Alert, oriented x 4.',
          assessment: 'Severe urosepsis from obstructive right pyelonephritis (6mm ureteral calculus). Responsive to initial 30 mL/kg fluid resuscitation, currently MAP > 65 without vasopressors. AKI KDIGO Stage 2 secondary to sepsis and post-renal obstruction.',
          plan: '1. Sepsis bundle compliance: Blood and urine cultures sent prior to Cefepime 2g IV. Repeat lactate checked at 2h improved from 4.2 to 2.1 mmol/L.\n2. Emergent Urology consult: scheduled for cystoscopy, right retrograde ureteral stent placement under fluoroscopy to decompress infected collecting system.\n3. Renal dose adjustment: will adjust Cefepime interval to 2g q24h once post-procedure renal function stabilizes.\n4. Strict hourly Foley urine output monitoring; alert MD if UOP < 0.5 mL/kg/h for 2 consecutive hours.',
        },
      },
    ],
    activeBpas: [
      {
        id: 'bpa-s-1',
        type: 'SEPSIS_ALERT',
        severity: 'INTERRUPTIVE_CRITICAL',
        title: 'SEP-1 Sepsis Bundle Alert (Severe Sepsis)',
        triggerDescription: 'Patient triggered SIRS criteria (Temp 39.4C, HR 128, RR 28, WBC 22.8) with organ dysfunction (Lactate 4.2, Cr 2.1).',
        recommendedAction: 'Ensure blood cultures obtained, IV broad spectrum antibiotics initiated within 1 hr, 30 mL/kg crystalloids completed, and repeat lactate drawn within 2-4 hours.',
        rationale: 'Early bundle compliance significantly lowers 28-day sepsis mortality.',
      },
    ],
  },

  {
    id: 'pt-postop-003',
    mrn: 'MRN-339104',
    firstName: 'David',
    lastName: 'Chen',
    age: 45,
    gender: 'MALE',
    dob: '1981-02-24',
    admissionDate: '2026-09-11 (Post-Op Day 1)',
    unit: 'Surgical Inpatient Ward',
    bed: 'SURG-312A',
    codeStatus: 'FULL_CODE',
    isolation: 'STANDARD',
    attendingPhysician: 'Dr. Gregory Vance, MD, FACS (Surgical Oncology)',
    primaryDiagnosis: 'Post-Operative Day 1 status-post Laparoscopic Right Hemicolectomy with ileocolic anastomosis',
    secondaryDiagnoses: [
      'Cecal Adenocarcinoma (cT3N0M0)',
      'Postoperative Pain (controlled on multimodal analgesia and low-dose PCA)',
      'Essential Hypertension',
    ],
    allergies: [
      {
        allergen: 'Codeine',
        reactionType: 'MILD_INTOLERANCE',
        manifestations: 'Severe nausea, intractable vomiting, dysphoria. Tolerates hydromorphone and fentanyl without issue.',
        severity: 'MILD',
      },
    ],
    weightKg: 74.0,
    heightCm: 172,
    serumCreatinineMgDl: 0.9,
    calculatedEgfr: 98,
    baselineQtcMs: 405,
    vitalsHistory: [
      { timestamp: '04:00', hr: 78, sbp: 124, dbp: 74, rr: 16, tempC: 37.1, spo2: 98, painScore: 5, gcs: 15, fio2: 21, o2Device: 'Room Air' },
      { timestamp: '06:00', hr: 74, sbp: 120, dbp: 72, rr: 15, tempC: 37.0, spo2: 98, painScore: 4, gcs: 15, fio2: 21, o2Device: 'Room Air' },
      { timestamp: '08:00', hr: 82, sbp: 126, dbp: 76, rr: 16, tempC: 37.2, spo2: 97, painScore: 3, gcs: 15, fio2: 21, o2Device: 'Room Air' },
      { timestamp: '10:00', hr: 76, sbp: 118, dbp: 70, rr: 14, tempC: 36.9, spo2: 99, painScore: 2, gcs: 15, fio2: 21, o2Device: 'Room Air' },
    ],
    intakeRecords: [
      { id: 'in-c-1', timestamp: '06:00', source: 'IV_CRYSTALLOID', description: 'D5 0.45% NaCl with 20 mEq KCl at 75 mL/h', volumeMl: 300 },
      { id: 'in-c-2', timestamp: '08:30', source: 'ORAL_FLUIDS', description: 'Clear liquid diet sips (water, apple juice)', volumeMl: 180 },
    ],
    outputRecords: [
      { id: 'out-c-1', timestamp: '06:00', source: 'SURGICAL_DRAIN', description: 'Jackson-Pratt (JP) drain serosanguinous fluid', volumeMl: 45 },
      { id: 'out-c-2', timestamp: '08:00', source: 'URINE_VOID', description: 'Spontaneous void post-foley removal', volumeMl: 320 },
      { id: 'out-c-3', timestamp: '10:00', source: 'SURGICAL_DRAIN', description: 'JP drain output (serosanguinous, no enteric odor)', volumeMl: 25 },
    ],
    medicationOrders: [
      {
        id: 'rx-chen-1',
        drugName: 'Enoxaparin (Lovenox)',
        category: 'ANTICOAGULANT',
        dose: '40 mg',
        route: 'SC',
        frequency: 'Q24H',
        scheduleType: 'SCHEDULED',
        isHighAlert: true,
        requiresRenalAdjustment: true,
        indication: 'Postoperative VTE chemoprophylaxis (ERAS protocol)',
        orderedBy: 'Dr. Gregory Vance, MD',
        orderedAt: '2026-09-11 07:00',
        status: 'ACTIVE',
      },
      {
        id: 'rx-chen-2',
        drugName: 'Acetaminophen (Ofirmev)',
        category: 'ANALGESIC',
        dose: '1000 mg',
        route: 'IV',
        frequency: 'Q6H',
        scheduleType: 'SCHEDULED',
        isHighAlert: false,
        requiresRenalAdjustment: false,
        indication: 'Multimodal non-opioid baseline analgesia',
        orderedBy: 'Dr. Gregory Vance, MD',
        orderedAt: '2026-09-10 16:00',
        status: 'ACTIVE',
      },
      {
        id: 'rx-chen-3',
        drugName: 'Hydromorphone (Dilaudid) PCA',
        category: 'ANALGESIC',
        dose: '0.2 mg demand dose (lockout 10 min, 0 basal)',
        route: 'IV',
        frequency: 'PRN',
        scheduleType: 'PRN',
        isHighAlert: true,
        requiresRenalAdjustment: false,
        indication: 'Breakthrough post-surgical incisional pain',
        orderedBy: 'Dr. Gregory Vance, MD',
        orderedAt: '2026-09-10 16:00',
        status: 'ACTIVE',
      },
    ],
    marRecords: [
      { orderId: 'rx-chen-1', drugName: 'Enoxaparin 40 mg SC', scheduledTime: '08:00', status: 'GIVEN', administeredAt: '08:15', administeredBy: 'Nurse Amanda Cole, RN', witnessedBy: 'Nurse Jessica Reed, RN' },
      { orderId: 'rx-chen-2', drugName: 'Acetaminophen 1000 mg IV', scheduledTime: '06:00', status: 'GIVEN', administeredAt: '06:05', administeredBy: 'Nurse Amanda Cole, RN' },
      { orderId: 'rx-chen-3', drugName: 'Hydromorphone PCA demand check', scheduledTime: '10:00', status: 'GIVEN', administeredAt: '10:00', administeredBy: 'Nurse Amanda Cole, RN' },
    ],
    labResults: [
      { id: 'l-c-1', panel: 'CBC', testName: 'Hemoglobin (Post-Op Day 1)', value: 11.8, unit: 'g/dL', refRange: '13.5 - 17.5', flag: 'LOW', collectedAt: '2026-09-11 05:30' },
      { id: 'l-c-2', panel: 'CBC', testName: 'White Blood Cell (WBC)', value: 9.4, unit: 'x10^3/uL', refRange: '4.5 - 11.0', flag: 'NORMAL', collectedAt: '2026-09-11 05:30' },
      { id: 'l-c-3', panel: 'BMP', testName: 'Creatinine', value: 0.9, unit: 'mg/dL', refRange: '0.7 - 1.3', flag: 'NORMAL', collectedAt: '2026-09-11 05:30' },
      { id: 'l-c-4', panel: 'BMP', testName: 'Potassium', value: 4.1, unit: 'mEq/L', refRange: '3.5 - 5.0', flag: 'NORMAL', collectedAt: '2026-09-11 05:30' },
    ],
    imagingStudies: [
      {
        id: 'img-c-1',
        modality: 'CXR',
        title: 'Postoperative Chest X-Ray PA & Lateral',
        performedAt: '2026-09-10 17:00',
        indication: 'Routine post-anesthesia clearance',
        findings: 'Clear lung fields without focal consolidation, pneumothorax, or large pleural effusions. Normal cardiomediastinal silhouette. Expected small amount of subdiaphragmatic laparoscopic gas.',
        impression: 'Uncomplicated postoperative chest examination without acute cardiopulmonary process.',
        radiologist: 'Dr. Timothy Hayes, MD',
      },
    ],
    clinicalNotes: [
      {
        id: 'note-c-1',
        noteType: 'MD_PROGRESS_NOTE',
        title: 'Surgical Oncology Post-Op Day 1 Note',
        author: 'Dr. Gregory Vance, MD, FACS',
        authorRole: 'ATTENDING_MD',
        createdAt: '2026-09-11 07:30',
        content: {
          subjective: 'POD1 following uneventful laparoscopic right hemicolectomy. Patient states pain is well controlled (3/10) with multimodal regimen and minimal PCA demands (only 4 demands overnight). Ambulated 1 lap of the unit with nursing. Tolerating sips of clear liquids. Passing flatus (+).',
          objective: 'Afebrile, vitals stable. Abdomen: Soft, mild expected tenderness adjacent to extraction site, appropriately dressing intact without strike-through. JP drain in right lower quadrant with 45 mL serosanguinous fluid overnight. Calves soft, non-tender, sequential compression devices (SCDs) in place.',
          assessment: 'POD1 s/p Laparoscopic Right Hemicolectomy for cecal adenocarcinoma. Excellent clinical recovery conforming to ERAS (Enhanced Recovery After Surgery) pathway.',
          plan: '1. Advance to full liquid / soft diet as tolerated.\n2. Transition off IV PCA to oral acetaminophen and oral oxycodone PRN.\n3. Continue Enoxaparin 40 mg SC daily for VTE prophylaxis.\n4. Encourage ambulation >= 4 times daily.\n5. Discontinue maintenance IV fluids once oral intake reaches > 1000 mL.',
        },
      },
    ],
    activeBpas: [],
  },

  {
    id: 'pt-stroke-004',
    mrn: 'MRN-712850',
    firstName: 'Eleanor',
    lastName: 'Roosevelt-Smith',
    age: 72,
    gender: 'FEMALE',
    dob: '1954-11-03',
    admissionDate: '2026-09-11 (Hospital Day 1)',
    unit: 'Neurology Step-Down Unit',
    bed: 'NEURO-204',
    codeStatus: 'FULL_CODE',
    isolation: 'STANDARD',
    attendingPhysician: 'Dr. Aris Thorne, MD, PhD (Vascular Neurology)',
    primaryDiagnosis: 'Acute Ischemic Stroke (L MCA Superior Division), NIHSS 6 (mild right arm pronator drift, expressive dysphasia)',
    secondaryDiagnoses: [
      'Atrial Fibrillation (non-valvular, non-anticoagulated prior to admission)',
      'Hypertension',
      'Hyperlipidemia',
      'High Fall Risk (Morse Score 65)',
    ],
    allergies: [
      {
        allergen: 'Aspirin (Acetylsalicylic acid)',
        reactionType: 'SEVERE_RASH',
        manifestations: 'Diffuse maculopapular rash with facial swelling (2019). Tolerates clopidogrel without adverse reactions.',
        severity: 'MODERATE',
      },
    ],
    weightKg: 62.0,
    heightCm: 160,
    serumCreatinineMgDl: 0.8,
    calculatedEgfr: 72,
    baselineQtcMs: 435,
    vitalsHistory: [
      { timestamp: '04:00', hr: 72, sbp: 168, dbp: 92, rr: 16, tempC: 36.6, spo2: 98, painScore: 0, gcs: 15, fio2: 21, o2Device: 'Room Air' },
      { timestamp: '06:00', hr: 68, sbp: 162, dbp: 88, rr: 15, tempC: 36.8, spo2: 98, painScore: 0, gcs: 15, fio2: 21, o2Device: 'Room Air' },
      { timestamp: '08:00', hr: 74, sbp: 158, dbp: 86, rr: 16, tempC: 36.7, spo2: 97, painScore: 0, gcs: 15, fio2: 21, o2Device: 'Room Air' },
      { timestamp: '10:00', hr: 70, sbp: 154, dbp: 84, rr: 15, tempC: 36.9, spo2: 99, painScore: 0, gcs: 15, fio2: 21, o2Device: 'Room Air' },
    ],
    intakeRecords: [
      { id: 'in-e-1', timestamp: '06:00', source: 'IV_CRYSTALLOID', description: '0.9% Normal Saline at 75 mL/h (avoid hypo-osmolar fluids)', volumeMl: 300 },
    ],
    outputRecords: [
      { id: 'out-e-1', timestamp: '06:30', source: 'URINE_VOID', description: 'Bedpan void with 1-assist', volumeMl: 280 },
      { id: 'out-e-2', timestamp: '09:30', source: 'URINE_VOID', description: 'Bedpan void with 1-assist', volumeMl: 220 },
    ],
    medicationOrders: [
      {
        id: 'rx-eleanor-1',
        drugName: 'Clopidogrel (Plavix)',
        category: 'ANTICOAGULANT',
        dose: '75 mg',
        route: 'PO',
        frequency: 'Q24H',
        scheduleType: 'SCHEDULED',
        isHighAlert: false,
        requiresRenalAdjustment: false,
        indication: 'Secondary stroke antiplatelet prevention (Aspirin-allergic substitute)',
        orderedBy: 'Dr. Aris Thorne, MD',
        orderedAt: '2026-09-11 04:00',
        status: 'ACTIVE',
      },
      {
        id: 'rx-eleanor-2',
        drugName: 'Atorvastatin',
        category: 'OTHER',
        dose: '80 mg',
        route: 'PO',
        frequency: 'Q24H',
        scheduleType: 'SCHEDULED',
        isHighAlert: false,
        requiresRenalAdjustment: false,
        indication: 'High-intensity statin neuroprotection and plaque stabilization',
        orderedBy: 'Dr. Aris Thorne, MD',
        orderedAt: '2026-09-11 04:00',
        status: 'ACTIVE',
      },
      {
        id: 'rx-eleanor-3',
        drugName: 'Nicardipine IV Titration',
        category: 'CARDIOVASCULAR',
        dose: 'Titrate 5-15 mg/h only if SBP > 220 or DBP > 120 mmHg',
        route: 'IV',
        frequency: 'PRN',
        scheduleType: 'PRN',
        isHighAlert: true,
        requiresRenalAdjustment: false,
        indication: 'Permissive hypertension guardrail protocol in acute ischemic stroke',
        orderedBy: 'Dr. Aris Thorne, MD',
        orderedAt: '2026-09-11 04:00',
        status: 'ACTIVE',
      },
    ],
    marRecords: [
      { orderId: 'rx-eleanor-1', drugName: 'Clopidogrel 75 mg PO', scheduledTime: '08:00', status: 'GIVEN', administeredAt: '08:10', administeredBy: 'Nurse Rachel Green, RN' },
      { orderId: 'rx-eleanor-2', drugName: 'Atorvastatin 80 mg PO', scheduledTime: '20:00', status: 'DUE' },
      { orderId: 'rx-eleanor-3', drugName: 'Nicardipine IV Titration', scheduledTime: 'PRN', status: 'HELD', heldReason: 'SBP 158 mmHg within permissive range (target < 220)' },
    ],
    labResults: [
      { id: 'l-e-1', panel: 'BMP', testName: 'Serum Glucose', value: 104, unit: 'mg/dL', refRange: '70 - 99', flag: 'NORMAL', collectedAt: '2026-09-11 03:30' },
      { id: 'l-e-2', panel: 'COAGS', testName: 'INR', value: 1.1, unit: 'Ratio', refRange: '0.8 - 1.2', flag: 'NORMAL', collectedAt: '2026-09-11 03:30' },
      { id: 'l-e-3', panel: 'CBC', testName: 'Platelet Count', value: 245, unit: 'x10^3/uL', refRange: '150 - 450', flag: 'NORMAL', collectedAt: '2026-09-11 03:30' },
      { id: 'l-e-4', panel: 'OTHER' as any, testName: 'Troponin I (hs-cTnI)', value: 12, unit: 'ng/L', refRange: '< 14', flag: 'NORMAL', collectedAt: '2026-09-11 03:30' },
    ],
    imagingStudies: [
      {
        id: 'img-e-1',
        modality: 'CT',
        title: 'Non-Contrast Head CT',
        performedAt: '2026-09-11 03:15',
        indication: 'Acute onset word-finding difficulty and right arm weakness (last known well 6 hours prior)',
        findings: 'No acute intracranial hemorrhage, subdural hematoma, or mass effect. Subtle loss of gray-white differentiation in the left insular cortex (insular ribbon sign). ASPECTS score 9.',
        impression: 'Early ischemic changes in left MCA territory without hemorrhagic transformation.',
        radiologist: 'Dr. Timothy Hayes, MD (Neuroradiology)',
      },
      {
        id: 'img-e-2',
        modality: 'MRI',
        title: 'Brain MRI with Diffusion-Weighted Imaging (DWI)',
        performedAt: '2026-09-11 08:30',
        indication: 'Characterize acute left MCA ischemic stroke volume',
        findings: 'Hyperintense signal on DWI with corresponding ADC hypointensity in left frontal-opercular and insular cortex measuring 18 mL. No midline shift. MRA shows patent distal left MCA M2 branches without flow-limiting stenosis.',
        impression: 'Confirmed acute left cortical cerebral infarction (18 mL) in left MCA superior division territory.',
        radiologist: 'Dr. Timothy Hayes, MD (Neuroradiology)',
      },
    ],
    clinicalNotes: [
      {
        id: 'note-e-1',
        noteType: 'MD_ADMISSION_H_AND_P',
        title: 'Neurology Stroke Inpatient Admission Note',
        author: 'Dr. Aris Thorne, MD, PhD',
        authorRole: 'ATTENDING_MD',
        createdAt: '2026-09-11 05:30',
        content: {
          subjective: '72yo female with HTN and newly detected Afib presenting with acute word-finding difficulty and right arm heaviness noted upon awakening. Last known well > 6 hours prior, outside IV tPA window and small core on neuroimaging without LVO.',
          objective: 'NIHSS 6 (1 for mild right facial droop, 2 for right arm drift, 1 for mild sensory loss, 2 for expressive dysphasia). Vitals: BP 162/88, HR 72 irregular. Bedside dysphagia water swallow screen FAILED (choking/coughing noted on 3 oz water).',
          assessment: 'Acute Ischemic Stroke (L MCA superior branch territory), likely cardioembolic from non-anticoagulated Afib. High aspiration risk.',
          plan: '1. Strict NPO until formal Speech-Language Pathology (SLP) video fluoroscopic swallowing study.\n2. Permissive hypertension: maintain SBP < 220 mmHg, DBP < 120 mmHg for first 24-48 hours to preserve ischemic penumbra.\n3. Aspirin allergy noted -> initiate Clopidogrel 75 mg PO/crushed.\n4. High-intensity Atorvastatin 80 mg daily.\n5. Holter monitor / telemetry to document Afib burden; initiate DOAC (Apixaban) in 3-7 days once repeat imaging excludes hemorrhagic conversion.\n6. Strict fall precautions (Morse score 65).',
        },
      },
    ],
    activeBpas: [
      {
        id: 'bpa-e-1',
        type: 'FALL_RISK',
        severity: 'WARNING',
        title: 'High Fall Risk Protocol Active',
        triggerDescription: 'Morse Fall Score 65 (> 45 is High Risk) with motor weakness and unilateral neglect.',
        recommendedAction: 'Apply yellow fall risk armband, bed alarm armed, 1-person assist for all transfers, non-skid socks.',
        rationale: 'Stroke patients with motor asymmetry have elevated hospital inpatient fall rates.',
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// CLINICAL DECISION SUPPORT (CDS) & SAFETY LOGIC
// ---------------------------------------------------------------------------

export interface CdsAlertResult {
  hasAlert: boolean;
  severity: 'HARD_STOP_CONTRAINDICATION' | 'SOFT_STOP_WARNING' | 'INFO';
  title: string;
  message: string;
  recommendation: string;
}

/**
 * Checks for drug allergy and cross-reactivity risks
 */
export function evaluateDrugAllergyRisk(drugName: string, patientAllergies: InpatientAllergy[]): CdsAlertResult {
  const normDrug = drugName.toLowerCase().trim();

  for (const allergy of patientAllergies) {
    const normAllergen = allergy.allergen.toLowerCase();

    // Direct match
    if (normDrug.includes('lisinopril') || normDrug.includes('enalapril') || normDrug.includes('ramipril') || normDrug.includes('captopril') || normDrug.includes('benazepril')) {
      if (normAllergen.includes('lisinopril') || normAllergen.includes('ace')) {
        return {
          hasAlert: true,
          severity: 'HARD_STOP_CONTRAINDICATION',
          title: 'CRITICAL CDS: ACE Inhibitor Angioedema Contraindication',
          message: `Patient has documented history of ${allergy.reactionType} to ${allergy.allergen}: "${allergy.manifestations}".`,
          recommendation: 'Do not administer ACE inhibitors or ARBs. Use alternative classes (Hydralazine + Nitrates, SGLT2i, or Calcium Channel Blockers).',
        };
      }
    }

    if (normDrug.includes('penicillin') || normDrug.includes('amoxicillin') || normDrug.includes('ampicillin') || normDrug.includes('piperacillin')) {
      if (normAllergen.includes('penicillin') || normAllergen.includes('amox')) {
        return {
          hasAlert: true,
          severity: 'HARD_STOP_CONTRAINDICATION',
          title: 'CRITICAL CDS: Penicillin Anaphylaxis Hard Stop',
          message: `Patient has documented IgE-mediated anaphylaxis to penicillin. Administering beta-lactams with identical core structures carries severe mortality risk.`,
          recommendation: 'Cancel order immediately. Use non-penicillin alternatives (e.g. Aztreonam, Fluoroquinolones, Vancomycin, or Cefepime if cross-reactivity evaluated).',
        };
      }
    }

    // Cephalosporin cross-reactivity in penicillin allergy
    if (normDrug.includes('cefazolin') || normDrug.includes('cephalexin')) {
      if (normAllergen.includes('penicillin') && allergy.reactionType === 'ANAPHYLAXIS') {
        return {
          hasAlert: true,
          severity: 'SOFT_STOP_WARNING',
          title: 'CDS WARNING: 1st Generation Cephalosporin Cross-Reactivity',
          message: 'First-generation cephalosporins share similar R1 side chains with aminopenicillins, carrying ~5-10% cross-reactivity risk in severe penicillin anaphylaxis.',
          recommendation: 'Avoid 1st generation cephalosporins. 3rd/4th generation (Ceftriaxone, Cefepime) or Carbapenems have < 1% cross-reactivity.',
        };
      }
    }

    // Codeine / Opioid intolerance
    if (normDrug.includes('codeine') && normAllergen.includes('codeine')) {
      return {
        hasAlert: true,
        severity: 'SOFT_STOP_WARNING',
        title: 'CDS ALERT: Codeine Intolerance Documented',
        message: `Patient experienced severe nausea/vomiting from codeine: "${allergy.manifestations}".`,
        recommendation: 'Consider alternative synthetic or semi-synthetic opioids (Hydromorphone, Fentanyl) with concurrent antiemetic.',
      };
    }

    // Aspirin intolerance in stroke
    if (normDrug.includes('aspirin') && normAllergen.includes('aspirin')) {
      return {
        hasAlert: true,
        severity: 'HARD_STOP_CONTRAINDICATION',
        title: 'CRITICAL CDS: Aspirin Allergy Documented',
        message: `Patient has documented severe hypersensitivity to Aspirin: "${allergy.manifestations}".`,
        recommendation: 'Avoid aspirin. Prescribe Clopidogrel 75 mg PO daily for secondary stroke prevention.',
      };
    }
  }

  return {
    hasAlert: false,
    severity: 'INFO',
    title: 'No Known Allergy Contraindication',
    message: 'Prescription does not match known patient allergy profiles.',
    recommendation: 'Safe to proceed with standard nursing verification.',
  };
}

/**
 * Checks for drug-drug interactions
 */
export function evaluateDrugInteractions(newDrugName: string, activeOrders: InpatientMedicationOrder[]): CdsAlertResult {
  const normNew = newDrugName.toLowerCase();
  const activeNames = activeOrders.map(o => o.drugName.toLowerCase());

  // Digoxin + Amiodarone
  if (normNew.includes('amiodarone') && activeNames.some(n => n.includes('digoxin'))) {
    return {
      hasAlert: true,
      severity: 'SOFT_STOP_WARNING',
      title: 'DDI WARNING: Amiodarone + Digoxin Interaction',
      message: 'Amiodarone inhibits P-glycoprotein and renal tubular excretion, doubling serum digoxin concentrations and inducing fatal digitalis toxicity.',
      recommendation: 'Reduce Digoxin dose by 50% immediately and monitor serum levels closely.',
    };
  }

  // Potassium + Spironolactone / Eplerenone
  if ((normNew.includes('spironolactone') || normNew.includes('eplerenone')) && activeNames.some(n => n.includes('potassium'))) {
    return {
      hasAlert: true,
      severity: 'SOFT_STOP_WARNING',
      title: 'DDI WARNING: Mineralocorticoid Receptor Antagonist + Potassium Supplement',
      message: 'Combining potassium-sparing diuretics with exogenous potassium chloride carries high risk of life-threatening hyperkalemia, especially in CKD.',
      recommendation: 'Recheck serum potassium; consider withholding potassium supplement once MRA is established.',
    };
  }

  // Anticoagulant + Dual Antiplatelet
  if (normNew.includes('warfarin') || normNew.includes('apixaban') || normNew.includes('rivaroxaban')) {
    if (activeNames.some(n => n.includes('clopidogrel') || n.includes('aspirin') || n.includes('ticagrelor'))) {
      return {
        hasAlert: true,
        severity: 'SOFT_STOP_WARNING',
        title: 'DDI WARNING: Concomitant Anticoagulation + Antiplatelet ("Double/Triple Therapy")',
        message: 'Combining oral anticoagulants with antiplatelet therapy substantially increases major gastrointestinal and intracranial bleeding.',
        recommendation: 'Ensure clinical indication (e.g. recent coronary stent + Afib) is documented with shortest possible duration and PPI gastroprotection.',
      };
    }
  }

  return {
    hasAlert: false,
    severity: 'INFO',
    title: 'No Significant DDI Flagged',
    message: 'No high-risk cytochrome P450 or pharmacodynamic interactions identified.',
    recommendation: 'Proceed with standard monitoring.',
  };
}

/**
 * Checks for renal dose adjustment
 */
export function evaluateRenalDoseAdjustment(drugName: string, eGfr: number): { requiresAdjustment: boolean; rationale: string; recommendedDose?: string } {
  const norm = drugName.toLowerCase();

  if (norm.includes('cefepime') && eGfr < 60) {
    if (eGfr < 30) {
      return {
        requiresAdjustment: true,
        rationale: `eGFR of ${eGfr} mL/min/1.73m2. High Cefepime concentrations cause neurotoxicity (encephalopathy, myoclonus, seizures).`,
        recommendedDose: '1g IV q24h (or 2g q24h in severe sepsis with loading dose)',
      };
    } else if (eGfr < 50) {
      return {
        requiresAdjustment: true,
        rationale: `eGFR of ${eGfr} mL/min/1.73m2 indicates moderate renal insufficiency.`,
        recommendedDose: '2g IV q24h',
      };
    }
  }

  if (norm.includes('enoxaparin') && eGfr < 30) {
    return {
      requiresAdjustment: true,
      rationale: `Low molecular weight heparins bioaccumulate when eGFR < 30 mL/min, markedly increasing major bleeding risk.`,
      recommendedDose: '30 mg SC daily (or switch to unfractionated heparin IV/SC)',
    };
  }

  if (norm.includes('furosemide') && eGfr < 30) {
    return {
      requiresAdjustment: true,
      rationale: `Decreased tubular secretion in advanced CKD requires higher bolus doses to achieve threshold natriuresis.`,
      recommendedDose: '80 - 160 mg IV q12h (higher dose needed to reach site of action)',
    };
  }

  return {
    requiresAdjustment: false,
    rationale: 'Standard dosing appropriate for current renal function.',
  };
}

/**
 * Calculates net fluid balance from intake and output records
 */
export function calculateFluidBalance(intake: IntakeRecord[], output: OutputRecord[], weightKg: number): {
  totalIntakeMl: number;
  totalOutputMl: number;
  netBalanceMl: number;
  urineTotalMl: number;
  urineMlPerKgPerHour: number;
  hasOliguriaAlert: boolean;
} {
  const totalIntakeMl = intake.reduce((sum, item) => sum + item.volumeMl, 0);
  const totalOutputMl = output.reduce((sum, item) => sum + item.volumeMl, 0);
  const netBalanceMl = totalIntakeMl - totalOutputMl;

  const urineRecords = output.filter(o => o.source === 'URINE_FOLEY' || o.source === 'URINE_VOID');
  const urineTotalMl = urineRecords.reduce((sum, item) => sum + item.volumeMl, 0);

  // Assuming an 8-hour monitoring window for standard shift calculations
  const hours = 8;
  const urineMlPerKgPerHour = weightKg > 0 ? Number((urineTotalMl / weightKg / hours).toFixed(2)) : 0;
  const hasOliguriaAlert = urineMlPerKgPerHour < 0.5;

  return {
    totalIntakeMl,
    totalOutputMl,
    netBalanceMl,
    urineTotalMl,
    urineMlPerKgPerHour,
    hasOliguriaAlert,
  };
}

/**
 * Verifies the 5 Rights of Medication Administration
 */
export interface FiveRightsChecklist {
  rightPatient: boolean;
  rightDrug: boolean;
  rightDose: boolean;
  rightRoute: boolean;
  rightTime: boolean;
  dualNurseVerified?: boolean;
}

export function verifyFiveRights(checklist: FiveRightsChecklist, isHighAlert: boolean): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!checklist.rightPatient) errors.push('Patient identity barcode mismatch.');
  if (!checklist.rightDrug) errors.push('Medication vial/capsule does not match active eMAR order.');
  if (!checklist.rightDose) errors.push('Administered dose does not match physician order.');
  if (!checklist.rightRoute) errors.push('Intended administration route invalid.');
  if (!checklist.rightTime) errors.push('Medication administered outside acceptable 60-minute window.');

  if (isHighAlert && !checklist.dualNurseVerified) {
    errors.push('High-alert medication (Insulin / Heparin / Opioid / Inotrope) requires independent dual-nurse co-signature.');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
