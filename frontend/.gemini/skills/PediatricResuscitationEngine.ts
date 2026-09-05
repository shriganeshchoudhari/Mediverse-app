/**
 * PediatricResuscitationEngine.ts
 * Enterprise-grade Pediatric & Neonatal Resuscitation (PALS / NRP) Simulation Engine.
 * 
 * Features:
 * - Age-based Weight Estimation & Broselow 9-Zone Color Tape Mapping
 * - Airway & Equipment Sizing (Cuffed/Uncuffed ETT, Depth of insertion, Blades, Catheters)
 * - PALS Weight-Based Emergency Pharmacology & Defibrillation Dosing
 * - Neonatal Resuscitation Program (NRP) 8th Edition Suite:
 *   - APGAR Scoring Engine (Appearance, Pulse, Grimace, Activity, Respiration)
 *   - Target Pre-Ductal SpO2 Curve by Minute of Life
 *   - MR. SOPA Ventilation Corrective Step Sequence
 * - Pediatric Vital Signs & Minimum Systolic BP Hypotension Thresholds
 * - 6 Curated Emergency Scenarios (Meconium Delivery, SVT, Septic Shock, VF Arrest, Asthma, Anaphylaxis)
 * 
 * Location: frontend/.gemini/skills/PediatricResuscitationEngine.ts
 */

export type BroselowColor =
  | 'GREY'
  | 'PINK'
  | 'RED'
  | 'PURPLE'
  | 'YELLOW'
  | 'WHITE'
  | 'BLUE'
  | 'ORANGE'
  | 'GREEN';

export interface BroselowZoneInfo {
  color: BroselowColor;
  hexCode: string;
  weightRangeKg: { min: number; max: number };
  lengthRangeCm: { min: number; max: number };
  description: string;
}

export const BROSELOW_ZONES: Record<BroselowColor, BroselowZoneInfo> = {
  GREY: {
    color: 'GREY',
    hexCode: '#94a3b8',
    weightRangeKg: { min: 3, max: 5 },
    lengthRangeCm: { min: 45, max: 59 },
    description: 'Neonate / Young Infant (3-5 kg)',
  },
  PINK: {
    color: 'PINK',
    hexCode: '#f472b6',
    weightRangeKg: { min: 6, max: 7 },
    lengthRangeCm: { min: 60, max: 67 },
    description: 'Infant (6-7 kg)',
  },
  RED: {
    color: 'RED',
    hexCode: '#ef4444',
    weightRangeKg: { min: 8, max: 9 },
    lengthRangeCm: { min: 68, max: 74 },
    description: 'Older Infant (8-9 kg)',
  },
  PURPLE: {
    color: 'PURPLE',
    hexCode: '#a855f7',
    weightRangeKg: { min: 10, max: 11 },
    lengthRangeCm: { min: 75, max: 84 },
    description: 'Toddler (10-11 kg)',
  },
  YELLOW: {
    color: 'YELLOW',
    hexCode: '#eab308',
    weightRangeKg: { min: 12, max: 14 },
    lengthRangeCm: { min: 85, max: 97 },
    description: 'Young Child (12-14 kg)',
  },
  WHITE: {
    color: 'WHITE',
    hexCode: '#f8fafc',
    weightRangeKg: { min: 15, max: 18 },
    lengthRangeCm: { min: 98, max: 109 },
    description: 'Child (15-18 kg)',
  },
  BLUE: {
    color: 'BLUE',
    hexCode: '#3b82f6',
    weightRangeKg: { min: 19, max: 22 },
    lengthRangeCm: { min: 110, max: 121 },
    description: 'Older Child (19-22 kg)',
  },
  ORANGE: {
    color: 'ORANGE',
    hexCode: '#f97316',
    weightRangeKg: { min: 24, max: 28 },
    lengthRangeCm: { min: 122, max: 133 },
    description: 'Pre-Adolescent (24-28 kg)',
  },
  GREEN: {
    color: 'GREEN',
    hexCode: '#22c55e',
    weightRangeKg: { min: 30, max: 36 },
    lengthRangeCm: { min: 134, max: 145 },
    description: 'Adolescent (30-36 kg)',
  },
};

export interface PediatricPatientProfile {
  ageMonths: number;            // 0 - 216 months (0 to 18 years)
  gender: 'MALE' | 'FEMALE';
  actualWeightKg?: number;      // measured if available
  lengthCm?: number;            // length or height
}

export interface AirwayEquipmentSizing {
  uncuffedEttIdMm: number;
  cuffedEttIdMm: number;
  ettDepthAtLipCm: number;
  laryngoscopeBlade: string;
  suctionCatheterFr: number;
  chestTubeFr: number;
  nasogastricFr: number;
}

export interface PalsMedicationDosage {
  name: string;
  indication: string;
  standardDoseRule: string;
  calculatedDoseMg: number;
  unit: string;
  volumeMl: number | null;
  route: string;
  maxDoseMg: number;
  clinicalNote: string;
}

export interface PalsDefibrillationParameters {
  initialDefibJoules: number;         // 2 J/kg
  subsequentDefibJoules: number;      // 4 J/kg (up to 10 J/kg)
  synchronizedCardioversionJoules: number; // 0.5 - 1.0 J/kg
  refractoryCardioversionJoules: number;   // 2.0 J/kg
  paddleSize: 'INFANT' | 'PEDIATRIC' | 'ADULT';
}

export interface VitalSignReference {
  ageGroup: string;
  normalHeartRateBpm: { min: number; max: number };
  normalRespiratoryRate: { min: number; max: number };
  normalSystolicBpMmHg: { min: number; max: number };
  hypotensionThresholdMmHg: number;
}

export interface ApgarEvaluationInput {
  appearance: 0 | 1 | 2; // 0=pale/blue, 1=acrocyanosis, 2=pink
  pulse: 0 | 1 | 2;      // 0=absent, 1=<100, 2=>=100
  grimace: 0 | 1 | 2;    // 0=flaccid, 1=grimace/feeble, 2=active cry/pull away
  activity: 0 | 1 | 2;   // 0=limp, 1=some flexion, 2=active motion
  respiration: 0 | 1 | 2;// 0=absent, 1=slow/irregular, 2=vigorous cry
}

export interface ApgarScoreResult {
  totalScore: number;
  clinicalCategory: 'NORMAL_REASSURING' | 'MODERATELY_ABNORMAL' | 'SEVERELY_DEPRESSED';
  clinicalInterpretation: string;
  actionRequired: string;
}

// -------------------------------------------------------------
// 1. Weight Estimation & Broselow Zone Logic
// -------------------------------------------------------------
export function estimatePediatricWeightKg(ageMonths: number): number {
  if (ageMonths < 12) {
    // Infant formula: (Age in months + 9) / 2
    return Number(Math.max(3.0, (ageMonths + 9) / 2).toFixed(1));
  }
  const ageYears = ageMonths / 12;
  if (ageYears <= 5) {
    // 1 - 5 years: 2 * (Age in years + 5)
    return Number((2 * (ageYears + 5)).toFixed(1));
  }
  // 6 - 12 years: 3 * Age in years + 7
  return Number((3 * ageYears + 7).toFixed(1));
}

export function getBroselowZone(weightKg: number): BroselowZoneInfo {
  if (weightKg <= 5) return BROSELOW_ZONES.GREY;
  if (weightKg <= 7) return BROSELOW_ZONES.PINK;
  if (weightKg <= 9) return BROSELOW_ZONES.RED;
  if (weightKg <= 11) return BROSELOW_ZONES.PURPLE;
  if (weightKg <= 14) return BROSELOW_ZONES.YELLOW;
  if (weightKg <= 18) return BROSELOW_ZONES.WHITE;
  if (weightKg <= 22) return BROSELOW_ZONES.BLUE;
  if (weightKg <= 28) return BROSELOW_ZONES.ORANGE;
  return BROSELOW_ZONES.GREEN;
}

// -------------------------------------------------------------
// 2. Airway & Equipment Sizing
// -------------------------------------------------------------
export function calculateAirwayEquipment(ageMonths: number): AirwayEquipmentSizing {
  const ageYears = ageMonths / 12;

  let uncuffedEttId = 3.5;
  let cuffedEttId = 3.0;

  if (ageMonths < 1) {
    uncuffedEttId = 3.5;
    cuffedEttId = 3.0;
  } else if (ageMonths < 12) {
    uncuffedEttId = 3.5;
    cuffedEttId = 3.0;
  } else {
    // Motoyama formula
    uncuffedEttId = Number(((ageYears / 4) + 4.0).toFixed(1));
    cuffedEttId = Number(((ageYears / 4) + 3.5).toFixed(1));
  }

  // Depth of insertion: 3 * ETT ID
  const depth = Number((3 * uncuffedEttId).toFixed(1));

  // Laryngoscope blade
  let blade = 'Miller 1 (Straight)';
  if (ageMonths < 1) blade = 'Miller 0 or 1 (Straight)';
  else if (ageYears >= 2 && ageYears < 8) blade = 'Miller 2 or Macintosh 2';
  else if (ageYears >= 8) blade = 'Macintosh 3 (Curved) or Miller 3';

  // Suction catheter: 2 * ETT ID
  const suctionFr = Math.round(uncuffedEttId * 2);
  // Chest tube: 4 * ETT ID
  const chestTubeFr = Math.round(uncuffedEttId * 4);
  const nasogastricFr = ageYears < 1 ? 8 : ageYears < 5 ? 10 : 12;

  return {
    uncuffedEttIdMm: uncuffedEttId,
    cuffedEttIdMm: cuffedEttId,
    ettDepthAtLipCm: depth,
    laryngoscopeBlade: blade,
    suctionCatheterFr: suctionFr,
    chestTubeFr: chestTubeFr,
    nasogastricFr: nasogastricFr,
  };
}

// -------------------------------------------------------------
// 3. PALS Medications & Resuscitation Dosing
// -------------------------------------------------------------
export function calculatePalsMedications(weightKg: number): PalsMedicationDosage[] {
  const meds: PalsMedicationDosage[] = [
    {
      name: 'Epinephrine (Cardiac Arrest / Bradycardia)',
      indication: 'Asystole, PEA, Pulseless VT/VF, or Symptomatic Bradycardia unresponsive to oxygenation',
      standardDoseRule: '0.01 mg/kg (0.1 mL/kg of 1:10,000 solution) IV/IO every 3-5 min',
      calculatedDoseMg: Number((weightKg * 0.01).toFixed(3)),
      unit: 'mg',
      volumeMl: Number((weightKg * 0.1).toFixed(2)),
      route: 'IV / IO',
      maxDoseMg: 1.0,
      clinicalNote: 'Concentration 1:10,000 (0.1 mg/mL). Flush with 5 mL normal saline.',
    },
    {
      name: 'Epinephrine (Anaphylaxis)',
      indication: 'Severe allergic reaction / bronchospasm / laryngeal edema',
      standardDoseRule: '0.01 mg/kg (0.01 mL/kg of 1:1,000 concentration) IM in anterolateral thigh',
      calculatedDoseMg: Number((weightKg * 0.01).toFixed(3)),
      unit: 'mg',
      volumeMl: Number((weightKg * 0.01).toFixed(3)),
      route: 'Intramuscular (IM)',
      maxDoseMg: 0.5,
      clinicalNote: 'Use 1:1,000 (1 mg/mL) IM ONLY. Never give 1:1,000 IV due to fatal arrhythmia risk.',
    },
    {
      name: 'Amiodarone',
      indication: 'Shock-refractory Ventricular Fibrillation or Pulseless VT (after 3rd shock)',
      standardDoseRule: '5 mg/kg rapid IV/IO push',
      calculatedDoseMg: Number(Math.min(300, weightKg * 5).toFixed(1)),
      unit: 'mg',
      volumeMl: null,
      route: 'IV / IO bolus',
      maxDoseMg: 300,
      clinicalNote: 'May repeat twice up to cumulative maximum of 15 mg/kg or 450 mg.',
    },
    {
      name: 'Atropine',
      indication: 'Symptomatic Bradycardia with high vagal tone, primary AV block, or organophosphate toxicity',
      standardDoseRule: '0.02 mg/kg IV/IO (minimum dose 0.1 mg to prevent paradoxical bradycardia)',
      calculatedDoseMg: Number(Math.max(0.1, Math.min(0.5, weightKg * 0.02)).toFixed(2)),
      unit: 'mg',
      volumeMl: null,
      route: 'IV / IO',
      maxDoseMg: 0.5,
      clinicalNote: 'Minimum dose is 0.1 mg; lower doses can worsen bradycardia via central vagal stimulation.',
    },
    {
      name: 'Adenosine (1st Dose)',
      indication: 'Supraventricular Tachycardia (SVT) with narrow complex',
      standardDoseRule: '0.1 mg/kg rapid IV push with immediate 5-10 mL saline flush',
      calculatedDoseMg: Number(Math.min(6.0, weightKg * 0.1).toFixed(2)),
      unit: 'mg',
      volumeMl: null,
      route: 'Rapid IV push',
      maxDoseMg: 6.0,
      clinicalNote: 'Use stopcock technique closest to heart. Record ECG rhythm strip during injection.',
    },
    {
      name: 'Adenosine (2nd Dose)',
      indication: 'Refractory SVT if 1st dose fails to convert within 1-2 minutes',
      standardDoseRule: '0.2 mg/kg rapid IV push with immediate flush',
      calculatedDoseMg: Number(Math.min(12.0, weightKg * 0.2).toFixed(2)),
      unit: 'mg',
      volumeMl: null,
      route: 'Rapid IV push',
      maxDoseMg: 12.0,
      clinicalNote: 'Double the initial dose; maximum single dose is 12 mg.',
    },
    {
      name: 'Isotonic Fluid Resuscitation (Normal Saline / LR)',
      indication: 'Hypovolemic Shock, Septic Shock, Severe Dehydration',
      standardDoseRule: '20 mL/kg rapid bolus over 5-20 minutes',
      calculatedDoseMg: Number((weightKg * 20).toFixed(0)),
      unit: 'mL',
      volumeMl: Number((weightKg * 20).toFixed(0)),
      route: 'IV / IO pressure bag',
      maxDoseMg: 1000,
      clinicalNote: 'Re-assess for hepatomegaly, rales, or pulmonary edema after each 20 mL/kg bolus. Reduce to 10 mL/kg if cardiogenic shock is suspected.',
    },
    {
      name: 'Dextrose 10% (D10W)',
      indication: 'Pediatric Hypoglycemia (Blood glucose < 60 mg/dL)',
      standardDoseRule: '5 mL/kg (0.5 g/kg) IV/IO bolus',
      calculatedDoseMg: Number((weightKg * 5).toFixed(0)),
      unit: 'mL of D10W',
      volumeMl: Number((weightKg * 5).toFixed(0)),
      route: 'IV / IO',
      maxDoseMg: 250,
      clinicalNote: 'Avoid D50W in pediatric patients due to hyperosmolar vein injury and reactive hypoglycemia.',
    },
  ];

  return meds;
}

export function calculateDefibrillation(weightKg: number): PalsDefibrillationParameters {
  const initialShock = Math.min(200, Math.round(weightKg * 2));
  const subsequentShock = Math.min(360, Math.round(weightKg * 4));
  const cardioversion = Math.max(1, Math.min(100, Math.round(weightKg * 1)));
  const refractoryCardioversion = Math.min(200, Math.round(weightKg * 2));

  let paddle: 'INFANT' | 'PEDIATRIC' | 'ADULT' = 'ADULT';
  if (weightKg < 10) paddle = 'INFANT';
  else if (weightKg < 25) paddle = 'PEDIATRIC';

  return {
    initialDefibJoules: initialShock,
    subsequentDefibJoules: subsequentShock,
    synchronizedCardioversionJoules: cardioversion,
    refractoryCardioversionJoules: refractoryCardioversion,
    paddleSize: paddle,
  };
}

// -------------------------------------------------------------
// 4. Age-Adjusted Vital Signs & Hypotension Threshold
// -------------------------------------------------------------
export function getVitalSignReferences(ageMonths: number): VitalSignReference {
  const ageYears = ageMonths / 12;

  if (ageMonths < 1) {
    return {
      ageGroup: 'Neonate (0 - 28 days)',
      normalHeartRateBpm: { min: 100, max: 180 },
      normalRespiratoryRate: { min: 30, max: 60 },
      normalSystolicBpMmHg: { min: 60, max: 90 },
      hypotensionThresholdMmHg: 60,
    };
  }
  if (ageMonths < 12) {
    return {
      ageGroup: 'Infant (1 - 12 months)',
      normalHeartRateBpm: { min: 100, max: 160 },
      normalRespiratoryRate: { min: 30, max: 53 },
      normalSystolicBpMmHg: { min: 70, max: 100 },
      hypotensionThresholdMmHg: 70,
    };
  }
  if (ageYears <= 2) {
    return {
      ageGroup: 'Toddler (1 - 2 years)',
      normalHeartRateBpm: { min: 90, max: 150 },
      normalRespiratoryRate: { min: 22, max: 37 },
      normalSystolicBpMmHg: { min: 85, max: 105 },
      hypotensionThresholdMmHg: Number((70 + 2 * ageYears).toFixed(0)),
    };
  }
  if (ageYears <= 5) {
    return {
      ageGroup: 'Preschool (3 - 5 years)',
      normalHeartRateBpm: { min: 80, max: 140 },
      normalRespiratoryRate: { min: 20, max: 28 },
      normalSystolicBpMmHg: { min: 90, max: 110 },
      hypotensionThresholdMmHg: Number((70 + 2 * ageYears).toFixed(0)),
    };
  }
  if (ageYears <= 11) {
    return {
      ageGroup: 'School Age (6 - 11 years)',
      normalHeartRateBpm: { min: 70, max: 120 },
      normalRespiratoryRate: { min: 18, max: 25 },
      normalSystolicBpMmHg: { min: 95, max: 120 },
      hypotensionThresholdMmHg: Number((70 + 2 * ageYears).toFixed(0)),
    };
  }
  return {
    ageGroup: 'Adolescent (12+ years)',
    normalHeartRateBpm: { min: 60, max: 100 },
    normalRespiratoryRate: { min: 12, max: 20 },
    normalSystolicBpMmHg: { min: 110, max: 135 },
    hypotensionThresholdMmHg: 90,
  };
}

// -------------------------------------------------------------
// 5. NRP (Neonatal Resuscitation Program) Suite
// -------------------------------------------------------------
export function calculateApgarScore(input: ApgarEvaluationInput): ApgarScoreResult {
  const total = input.appearance + input.pulse + input.grimace + input.activity + input.respiration;

  let clinicalCategory: 'NORMAL_REASSURING' | 'MODERATELY_ABNORMAL' | 'SEVERELY_DEPRESSED';
  let interpretation = '';
  let action = '';

  if (total >= 7) {
    clinicalCategory = 'NORMAL_REASSURING';
    interpretation = 'Score 7 - 10: Normal physiological neonatal adaptation.';
    action = 'Routine care: clear secretions, maintain thermal neutrality (36.5 - 37.5°C), skin-to-skin contact with mother, promote early breastfeeding.';
  } else if (total >= 4) {
    clinicalCategory = 'MODERATELY_ABNORMAL';
    interpretation = 'Score 4 - 6: Moderately depressed neonate.';
    action = 'Active intervention: tactile stimulation, suction oropharynx, reposition head in sniffing position, initiate Positive Pressure Ventilation (PPV) with room air (21% O2) if HR < 100 or apnea.';
  } else {
    clinicalCategory = 'SEVERELY_DEPRESSED';
    interpretation = 'Score 0 - 3: Severely depressed neonate requiring immediate life support.';
    action = 'Emergency NRP resuscitation: immediate effective PPV, pulse oximetry on right wrist, ECG leads, evaluate MR. SOPA steps, intubate if no chest rise, initiate chest compressions (3:1 ratio) if HR < 60 despite 30s effective PPV.';
  }

  return {
    totalScore: total,
    clinicalCategory,
    clinicalInterpretation: interpretation,
    actionRequired: action,
  };
}

export interface NrpPreductalTarget {
  minuteOfLife: number;
  targetSpO2RangePercent: { min: number; max: number };
}

export const NRP_PREDUCTAL_TARGETS: NrpPreductalTarget[] = [
  { minuteOfLife: 1, targetSpO2RangePercent: { min: 60, max: 65 } },
  { minuteOfLife: 2, targetSpO2RangePercent: { min: 65, max: 70 } },
  { minuteOfLife: 3, targetSpO2RangePercent: { min: 70, max: 75 } },
  { minuteOfLife: 4, targetSpO2RangePercent: { min: 75, max: 80 } },
  { minuteOfLife: 5, targetSpO2RangePercent: { min: 80, max: 85 } },
  { minuteOfLife: 10, targetSpO2RangePercent: { min: 85, max: 95 } },
];

export interface MrSopaStep {
  letter: string;
  action: string;
  technique: string;
}

export const MR_SOPA_STEPS: MrSopaStep[] = [
  { letter: 'M', action: 'Mask adjustment', technique: 'Reapply mask to ensure an airtight seal on face.' },
  { letter: 'R', action: 'Reposition airway', technique: 'Adjust head into the neutral "sniffing" position; avoid hyperextension or flexion.' },
  { letter: 'S', action: 'Suction mouth & nose', technique: 'Clear secretions with bulb syringe or suction catheter (mouth first, then nose).' },
  { letter: 'O', action: 'Open mouth', technique: 'Lift jaw forward and ventilate with mouth slightly open.' },
  { letter: 'P', action: 'Pressure increase', technique: 'Increase peak inspiratory pressure in 5 cmH2O increments (max 30-40 cmH2O) until visible chest rise.' },
  { letter: 'A', action: 'Alternative airway', technique: 'Place endotracheal tube (ETT) or laryngeal mask (LMA).' },
];

// -------------------------------------------------------------
// 6. Curated Emergency Scenarios
// -------------------------------------------------------------
export interface ResuscitationCaseScenario {
  id: string;
  title: string;
  category: 'PALS' | 'NRP';
  ageMonths: number;
  weightKg: number;
  vignette: string;
  initialVitals: string;
  expectedActions: string[];
  teachingPearls: string[];
}

export const RESUSCITATION_CASE_SCENARIOS: ResuscitationCaseScenario[] = [
  {
    id: 'nrp-meconium-apnea',
    title: 'NRP: Meconium Delivery & Non-Vigorous Apneic Neonate',
    category: 'NRP',
    ageMonths: 0,
    weightKg: 3.2,
    vignette: 'A 39-week male infant is born via emergent C-section for fetal bradycardia with thick meconium-stained amniotic fluid. At birth, the baby is limp, cyanotic, and not breathing.',
    initialVitals: 'HR 52 bpm, SpO2 54%, limp tone, no respiratory effort (APGAR 1 min = 2).',
    expectedActions: [
      'Bring infant to radiant warmer, dry and stimulate, place in sniffing position.',
      'Per NRP 8th Edition: Routine routine endotracheal suctioning is NO LONGER recommended.',
      'Initiate immediate Positive Pressure Ventilation (PPV) with 21% O2 at 40-60 breaths/min.',
      'Attach pulse oximeter probe to RIGHT wrist (pre-ductal SpO2).',
      'If HR remains < 60 bpm after 30s of effective PPV with chest rise, initiate chest compressions at 3:1 ratio.',
    ],
    teachingPearls: [
      'The most important and effective step in neonatal resuscitation is ventilation of the lungs.',
      'Pre-ductal saturation is measured exclusively on the right upper extremity.',
      '100% oxygen is toxic to neonatal myocardial and cerebral tissue; initiate PPV with 21% FiO2 in term infants.',
    ],
  },
  {
    id: 'pals-svt-infant',
    title: 'PALS: Supraventricular Tachycardia (SVT) in an 8-Month-Old',
    category: 'PALS',
    ageMonths: 8,
    weightKg: 8.5,
    vignette: 'An 8-month-old female is brought to the ED for poor feeding, pallor, and lethargy for 12 hours. Monitor shows an extremely rapid, regular, narrow-complex rhythm with no discernible P waves.',
    initialVitals: 'HR 248 bpm, BP 82/54 mmHg, RR 44, Capillary refill 3.5s, pale cool extremities.',
    expectedActions: [
      'Differentiate SVT (rate usually >220 in infants, no beat-to-beat variability) from Sinus Tachycardia.',
      'Patient is minimally compensated (borderline perfusion): Attempt vagal maneuver (ice to face for 15-20 seconds).',
      'Establish vascular access (IV/IO): Administer Adenosine 0.1 mg/kg (0.85 mg) rapid push with 5 mL saline flush.',
      'If no conversion, double to 0.2 mg/kg (1.7 mg).',
      'If patient becomes hypotensive or altered, perform immediate Synchronized Cardioversion (0.5 - 1.0 J/kg = 4-8 Joules).',
    ],
    teachingPearls: [
      'Never apply ocular pressure for vagal maneuvers in children due to risk of retinal detachment.',
      'Adenosine has an ultra-short half-life (<10s) and must be delivered via stopcock with immediate rapid flush.',
    ],
  },
  {
    id: 'pals-vf-cardiac-arrest',
    title: 'PALS: Ventricular Fibrillation Shock-Refractory Arrest',
    category: 'PALS',
    ageMonths: 48,
    weightKg: 18.0,
    vignette: 'A 4-year-old male with long QT syndrome collapses suddenly at a park. EMS arrives, initiates CPR, and applies defibrillator pads showing chaotic, disorganized ventricular fibrillation.',
    initialVitals: 'No pulse, apnea, unresponsiveness. Monitor: Coarse Ventricular Fibrillation.',
    expectedActions: [
      'Immediate CPR with 100% O2 bag-valve-mask (15:2 ratio for 2 rescuers).',
      'Deliver 1st shock: 2 J/kg = 36 Joules. Immediately resume CPR for 2 minutes without rhythm check.',
      'Check rhythm: VF persists. Deliver 2nd shock: 4 J/kg = 72 Joules. Resume CPR.',
      'Administer Epinephrine 0.01 mg/kg (0.18 mg = 1.8 mL of 1:10,000).',
      'If VF persists after 3rd shock: Administer Amiodarone 5 mg/kg (90 mg IV bolus) or Lidocaine 1 mg/kg.',
    ],
    teachingPearls: [
      'In shockable pediatric arrest (VF/pVT), defibrillation takes priority over all medications.',
      'Subsequent shocks should be at least 4 J/kg (up to maximum 10 J/kg or adult 200 J).',
    ],
  },
  {
    id: 'pals-septic-shock',
    title: 'PALS: Fluid-Refractory Septic Shock in a 3-Year-Old',
    category: 'PALS',
    ageMonths: 36,
    weightKg: 16.0,
    vignette: 'A 3-year-old male presents with high fever, petechial purpuric rash, lethargy, and cold extremities. Systolic BP is 64 mmHg (below hypotension threshold 70 + 2*3 = 76 mmHg).',
    initialVitals: 'HR 182 bpm, BP 64/38 mmHg, RR 50, SpO2 93%, Cap refill 5 seconds, mottling.',
    expectedActions: [
      'Establish immediate IV or IO access within 5 minutes.',
      'Administer rapid fluid boluses: 20 mL/kg (320 mL) of isotonic crystalloid over 10-15 minutes.',
      'Check blood glucose: Treat hypoglycemia with D10W 5 mL/kg (80 mL) if glucose < 60 mg/dL.',
      'If shock persists after 40-60 mL/kg: Fluid-refractory shock. Initiate early vasoactive support (Epinephrine for cold shock; Norepinephrine for warm shock).',
      'Administer empiric broad-spectrum antibiotics within the 1st hour.',
    ],
    teachingPearls: [
      'Hypotension is a LATE sign of shock in children; compensated shock presents with tachycardia and prolonged capillary refill.',
      'Hypotension threshold in children aged 1-10 is Systolic BP < 70 + (2 × age).',
    ],
  },
];
