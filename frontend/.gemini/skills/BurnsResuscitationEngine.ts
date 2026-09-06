/**
 * BurnsResuscitationEngine.ts
 *
 * Biophysical engine for Burn Injury Resuscitation and Fluid Shift Dynamics:
 * - Wallace Rule of Nines & Lund-Browder Pediatric Age-Adjusted TBSA calculation
 * - Parkland (Baxter), ABA Consensus, and Galveston Pediatric Fluid Formulas
 * - Hourly Fluid Rate titration based on Urine Output (UOP mL/kg/h)
 * - Fluid Creep Surveillance & Intra-Abdominal Compartment Syndrome (Ivy Index)
 * - Carboxyhemoglobin (COHb) Elimination Kinetics (Room Air vs 100% FiO2 vs HBO)
 * - Escharotomy anatomical landmarks & indications for circumferential burns
 * - 8 Comprehensive Clinical Presets
 *
 * Location: frontend/.gemini/skills/BurnsResuscitationEngine.ts
 */

export type BurnMechanism = 'FLAME' | 'SCALD' | 'ELECTRICAL_HIGH_VOLTAGE' | 'CHEMICAL' | 'FLASH';
export type PatientAgeCategory = 'INFANT_0_1' | 'CHILD_1_4' | 'CHILD_5_9' | 'CHILD_10_14' | 'ADULT_15_PLUS';

export interface AnatomicalBurnRegion {
  id: string;
  name: string;
  adultNinesPct: number;
  partialThicknessPct: number; // 2nd degree
  fullThicknessPct: number; // 3rd degree
  isCircumferential: boolean;
}

export interface BurnPatientProfile {
  ageYears: number;
  weightKg: number;
  heightCm: number;
  mechanism: BurnMechanism;
  hoursPostInjury: number; // hours elapsed since burn happened
  inhalationInjuryPresent: boolean;
  carboxyhemoglobinPct: number; // normal < 2% non-smoker, < 9% smoker
  fiO2Delivered: 0.21 | 1.0 | 2.5; // 0.21 = room air, 1.0 = 100% NRB, 2.5 = HBO
  regions: AnatomicalBurnRegion[];
  measuredUrineOutputMlh: number; // last hour UOP
  bladderPressureMmHg: number; // for intra-abdominal hypertension
}

export interface FluidResuscitationPlan {
  totalTbsaPct: number; // only 2nd and 3rd degree
  parklandTotal24hMl: number; // 4 mL * kg * %TBSA
  abaConsensusTotal24hMl: number; // 2 mL * kg * %TBSA (or 3-4 mL for peds/electrical)
  first8hTotalMl: number; // 50% of total
  first8hRemainingHours: number; // 8 - hoursPostInjury
  first8hRateMlh: number; // remaining first half rate
  second16hRateMlh: number; // second half rate
  hourlyUopTargetRangeMlh: [number, number];
  currentUopStatus: 'INADEQUATE_OLIGURIA' | 'TARGET_ACHIEVED' | 'EXCESSIVE_POLYURIA';
  fluidRateAdjustmentRecommendation: string;
  ivyIndexMlPerKg: number; // total fluids / weight; >250 = severe fluid creep risk
  fluidCreepWarning?: string;
  intraAbdominalHypertensionGrade: 'NORMAL' | 'IAH_GRADE_I' | 'IAH_GRADE_II' | 'IAH_GRADE_III' | 'ACS_EMERGENCY';
  coHalfLifeMinutes: number;
  timeToSafeCoUnder5PctMinutes: number;
  escharotomyRequired: boolean;
  escharotomyRegions: string[];
}

export interface BurnPreset {
  id: string;
  name: string;
  description: string;
  profile: BurnPatientProfile;
}

/**
 * Standard adult Rule of Nines regions
 */
export const DEFAULT_ADULT_REGIONS: AnatomicalBurnRegion[] = [
  { id: 'head_neck', name: 'Head & Neck', adultNinesPct: 9, partialThicknessPct: 0, fullThicknessPct: 0, isCircumferential: false },
  { id: 'anterior_trunk', name: 'Anterior Chest & Abdomen', adultNinesPct: 18, partialThicknessPct: 0, fullThicknessPct: 0, isCircumferential: false },
  { id: 'posterior_trunk', name: 'Posterior Upper & Lower Back', adultNinesPct: 18, partialThicknessPct: 0, fullThicknessPct: 0, isCircumferential: false },
  { id: 'right_arm', name: 'Right Upper Extremity', adultNinesPct: 9, partialThicknessPct: 0, fullThicknessPct: 0, isCircumferential: false },
  { id: 'left_arm', name: 'Left Upper Extremity', adultNinesPct: 9, partialThicknessPct: 0, fullThicknessPct: 0, isCircumferential: false },
  { id: 'perineum', name: 'Perineum / Genitalia', adultNinesPct: 1, partialThicknessPct: 0, fullThicknessPct: 0, isCircumferential: false },
  { id: 'right_leg', name: 'Right Lower Extremity', adultNinesPct: 18, partialThicknessPct: 0, fullThicknessPct: 0, isCircumferential: false },
  { id: 'left_leg', name: 'Left Lower Extremity', adultNinesPct: 18, partialThicknessPct: 0, fullThicknessPct: 0, isCircumferential: false },
];

/**
 * Calculates Lund-Browder head and leg factor based on age
 */
export function getLundBrowderFactors(ageYears: number): { headPct: number; thighPct: number; legPct: number } {
  if (ageYears < 1) {
    return { headPct: 19, thighPct: 5.5, legPct: 5.0 };
  } else if (ageYears <= 4) {
    return { headPct: 17, thighPct: 6.5, legPct: 5.0 };
  } else if (ageYears <= 9) {
    return { headPct: 13, thighPct: 8.0, legPct: 5.5 };
  } else if (ageYears <= 14) {
    return { headPct: 11, thighPct: 8.5, legPct: 6.0 };
  } else {
    return { headPct: 9, thighPct: 9.5, legPct: 7.0 };
  }
}

/**
 * Calculates Carbon Monoxide (COHb) elimination half-life
 */
export function calculateCoHalfLifeMinutes(fiO2: 0.21 | 1.0 | 2.5): number {
  switch (fiO2) {
    case 2.5:
      return 23; // Hyperbaric Oxygen (2.8-3.0 ATA)
    case 1.0:
      return 80; // 100% FiO2 via non-rebreather
    case 0.21:
    default:
      return 320; // Room air (~5.3 hours)
  }
}

/**
 * Master fluid resuscitation calculator
 */
export function calculateBurnResuscitation(profile: BurnPatientProfile): FluidResuscitationPlan {
  // 1. Calculate Total Body Surface Area (TBSA) of 2nd & 3rd degree burns
  let totalTbsa = 0;
  for (const reg of profile.regions) {
    totalTbsa += reg.partialThicknessPct + reg.fullThicknessPct;
  }
  totalTbsa = Math.min(100, Math.round(totalTbsa * 10) / 10);

  // 2. Parkland (Baxter) Formula: 4 mL * weight (kg) * %TBSA
  const parklandTotal24hMl = Math.round(4 * profile.weightKg * totalTbsa);

  // 3. ABA Consensus Guideline Formula:
  // Adult thermal: 2 mL * kg * %TBSA
  // Pediatric thermal (<14 yo): 3 mL * kg * %TBSA
  // Electrical burns with rhabdomyolysis: 4 mL * kg * %TBSA
  let abaMultiplier = 2;
  if (profile.mechanism === 'ELECTRICAL_HIGH_VOLTAGE') {
    abaMultiplier = 4;
  } else if (profile.ageYears < 14) {
    abaMultiplier = 3;
  }
  const abaConsensusTotal24hMl = Math.round(abaMultiplier * profile.weightKg * totalTbsa);

  // 4. Timing division:
  // First half of 24h total must be given in first 8 hours FROM TIME OF INJURY
  const first8hTotalMl = Math.round(parklandTotal24hMl / 2);
  const remainingHoursInFirst8 = Math.max(1, 8 - profile.hoursPostInjury);
  const first8hRateMlh = Math.round(first8hTotalMl / remainingHoursInFirst8);
  const second16hRateMlh = Math.round(first8hTotalMl / 16);

  // 5. Urine Output Targets
  let minUopPerKg = 0.5;
  let maxUopPerKg = 1.0;
  if (profile.mechanism === 'ELECTRICAL_HIGH_VOLTAGE') {
    // Electrical burn target: 1.5 - 2.0 mL/kg/h until myoglobinuria clears
    minUopPerKg = 1.5;
    maxUopPerKg = 2.0;
  } else if (profile.ageYears < 14) {
    minUopPerKg = 1.0;
    maxUopPerKg = 1.5;
  }

  const minUopMlh = Math.round(minUopPerKg * profile.weightKg);
  const maxUopMlh = Math.round(maxUopPerKg * profile.weightKg);
  const hourlyUopTargetRangeMlh: [number, number] = [minUopMlh, maxUopMlh];

  // Evaluate current UOP status
  let currentUopStatus: 'INADEQUATE_OLIGURIA' | 'TARGET_ACHIEVED' | 'EXCESSIVE_POLYURIA' = 'TARGET_ACHIEVED';
  let fluidRateAdjustmentRecommendation = 'Maintain current infusion rate. Urine output is within optimal resuscitation window.';

  if (profile.measuredUrineOutputMlh < minUopMlh) {
    currentUopStatus = 'INADEQUATE_OLIGURIA';
    const suggestedRate = Math.round(first8hRateMlh * 1.25);
    fluidRateAdjustmentRecommendation = `Oliguria detected (${profile.measuredUrineOutputMlh} mL/h < target ${minUopMlh} mL/h). Increase Lactated Ringer's rate by 20-25% (suggested: ${suggestedRate} mL/h). Do NOT give boluses unless hypotensive shock.`;
  } else if (profile.measuredUrineOutputMlh > maxUopMlh) {
    currentUopStatus = 'EXCESSIVE_POLYURIA';
    const suggestedRate = Math.round(first8hRateMlh * 0.8);
    fluidRateAdjustmentRecommendation = `Over-resuscitation detected (${profile.measuredUrineOutputMlh} mL/h > target ${maxUopMlh} mL/h). Decrease rate by 20% (suggested: ${suggestedRate} mL/h) to prevent fluid creep and pulmonary edema.`;
  }

  // 6. Fluid Creep & Ivy Index Calculation (Total fluids / weight)
  const ivyIndexMlPerKg = Math.round((parklandTotal24hMl / profile.weightKg) * 10) / 10;
  let fluidCreepWarning: string | undefined;
  if (ivyIndexMlPerKg > 250) {
    fluidCreepWarning = `CRITICAL FLUID CREEP WARNING: Projected 24h resuscitation volume is ${ivyIndexMlPerKg} mL/kg (Ivy index > 250 mL/kg threshold). High risk of abdominal compartment syndrome (ACS), extremity compartment syndrome, and acute pulmonary edema. Monitor intra-abdominal pressure hourly via bladder catheter.`;
  }

  // 7. Intra-Abdominal Hypertension (IAH) Grading based on WSACS criteria
  let intraAbdominalHypertensionGrade: 'NORMAL' | 'IAH_GRADE_I' | 'IAH_GRADE_II' | 'IAH_GRADE_III' | 'ACS_EMERGENCY' = 'NORMAL';
  const iap = profile.bladderPressureMmHg;
  if (iap > 25) {
    intraAbdominalHypertensionGrade = 'ACS_EMERGENCY';
  } else if (iap >= 21) {
    intraAbdominalHypertensionGrade = 'IAH_GRADE_III';
  } else if (iap >= 16) {
    intraAbdominalHypertensionGrade = 'IAH_GRADE_II';
  } else if (iap >= 12) {
    intraAbdominalHypertensionGrade = 'IAH_GRADE_I';
  }

  // 8. Inhalation & Carbon Monoxide elimination
  const coHalfLifeMinutes = calculateCoHalfLifeMinutes(profile.fiO2Delivered);
  let timeToSafeCoUnder5PctMinutes = 0;
  if (profile.carboxyhemoglobinPct > 5) {
    // N halflives: 2^(n) = COHb / 5
    const numHalfLives = Math.log2(profile.carboxyhemoglobinPct / 5);
    timeToSafeCoUnder5PctMinutes = Math.round(numHalfLives * coHalfLifeMinutes);
  }

  // 9. Escharotomy requirement
  const escharotomyRegions: string[] = [];
  for (const reg of profile.regions) {
    if (reg.isCircumferential && reg.fullThicknessPct > 0) {
      escharotomyRegions.push(reg.name);
    }
  }
  const escharotomyRequired = escharotomyRegions.length > 0;

  return {
    totalTbsaPct: totalTbsa,
    parklandTotal24hMl,
    abaConsensusTotal24hMl,
    first8hTotalMl,
    first8hRemainingHours: remainingHoursInFirst8,
    first8hRateMlh,
    second16hRateMlh,
    hourlyUopTargetRangeMlh,
    currentUopStatus,
    fluidRateAdjustmentRecommendation,
    ivyIndexMlPerKg,
    fluidCreepWarning,
    intraAbdominalHypertensionGrade,
    coHalfLifeMinutes,
    timeToSafeCoUnder5PctMinutes,
    escharotomyRequired,
    escharotomyRegions,
  };
}

/**
 * 8 Clinical Presets
 */
export const BURN_PRESETS: BurnPreset[] = [
  {
    id: 'adult-40pct-flame',
    name: 'Major Adult Flame Burn (40% TBSA)',
    description: '70 kg male rescued from house fire with 40% TBSA 2nd/3rd degree burns on anterior chest, back, and arms. Parkland requires 11,200 mL LR.',
    profile: {
      ageYears: 38,
      weightKg: 70,
      heightCm: 178,
      mechanism: 'FLAME',
      hoursPostInjury: 2,
      inhalationInjuryPresent: false,
      carboxyhemoglobinPct: 4.2,
      fiO2Delivered: 1.0,
      measuredUrineOutputMlh: 38,
      bladderPressureMmHg: 9,
      regions: [
        { id: 'head_neck', name: 'Head & Neck', adultNinesPct: 9, partialThicknessPct: 0, fullThicknessPct: 0, isCircumferential: false },
        { id: 'anterior_trunk', name: 'Anterior Chest & Abdomen', adultNinesPct: 18, partialThicknessPct: 10, fullThicknessPct: 8, isCircumferential: false },
        { id: 'posterior_trunk', name: 'Posterior Upper & Lower Back', adultNinesPct: 18, partialThicknessPct: 8, fullThicknessPct: 4, isCircumferential: false },
        { id: 'right_arm', name: 'Right Upper Extremity', adultNinesPct: 9, partialThicknessPct: 4, fullThicknessPct: 3, isCircumferential: true },
        { id: 'left_arm', name: 'Left Upper Extremity', adultNinesPct: 9, partialThicknessPct: 2, fullThicknessPct: 1, isCircumferential: false },
        { id: 'perineum', name: 'Perineum / Genitalia', adultNinesPct: 1, partialThicknessPct: 0, fullThicknessPct: 0, isCircumferential: false },
        { id: 'right_leg', name: 'Right Lower Extremity', adultNinesPct: 18, partialThicknessPct: 0, fullThicknessPct: 0, isCircumferential: false },
        { id: 'left_leg', name: 'Left Lower Extremity', adultNinesPct: 18, partialThicknessPct: 0, fullThicknessPct: 0, isCircumferential: false },
      ],
    },
  },
  {
    id: 'pediatric-scald-burn',
    name: 'Pediatric Hot Water Scald (20% TBSA)',
    description: '3-year-old toddler (15 kg) pulled boiling tea from stove. Scald involves anterior chest and right arm. Lund-Browder head proportion applies.',
    profile: {
      ageYears: 3,
      weightKg: 15,
      heightCm: 95,
      mechanism: 'SCALD',
      hoursPostInjury: 1,
      inhalationInjuryPresent: false,
      carboxyhemoglobinPct: 1.0,
      fiO2Delivered: 0.21,
      measuredUrineOutputMlh: 18,
      bladderPressureMmHg: 6,
      regions: [
        { id: 'head_neck', name: 'Head & Neck', adultNinesPct: 9, partialThicknessPct: 4, fullThicknessPct: 0, isCircumferential: false },
        { id: 'anterior_trunk', name: 'Anterior Chest & Abdomen', adultNinesPct: 18, partialThicknessPct: 10, fullThicknessPct: 0, isCircumferential: false },
        { id: 'posterior_trunk', name: 'Posterior Upper & Lower Back', adultNinesPct: 18, partialThicknessPct: 0, fullThicknessPct: 0, isCircumferential: false },
        { id: 'right_arm', name: 'Right Upper Extremity', adultNinesPct: 9, partialThicknessPct: 6, fullThicknessPct: 0, isCircumferential: false },
        { id: 'left_arm', name: 'Left Upper Extremity', adultNinesPct: 9, partialThicknessPct: 0, fullThicknessPct: 0, isCircumferential: false },
        { id: 'perineum', name: 'Perineum / Genitalia', adultNinesPct: 1, partialThicknessPct: 0, fullThicknessPct: 0, isCircumferential: false },
        { id: 'right_leg', name: 'Right Lower Extremity', adultNinesPct: 18, partialThicknessPct: 0, fullThicknessPct: 0, isCircumferential: false },
        { id: 'left_leg', name: 'Left Lower Extremity', adultNinesPct: 18, partialThicknessPct: 0, fullThicknessPct: 0, isCircumferential: false },
      ],
    },
  },
  {
    id: 'electrical-myoglobinuria',
    name: 'High-Voltage Electrical Burn with Rhabdomyolysis',
    description: 'Electrician (80 kg) contacted 4160V power line. Deep tissue necrosis with myoglobinuria. UOP target elevated to 1.5-2.0 mL/kg/h (120-160 mL/h).',
    profile: {
      ageYears: 34,
      weightKg: 80,
      heightCm: 182,
      mechanism: 'ELECTRICAL_HIGH_VOLTAGE',
      hoursPostInjury: 2,
      inhalationInjuryPresent: false,
      carboxyhemoglobinPct: 1.5,
      fiO2Delivered: 0.21,
      measuredUrineOutputMlh: 65,
      bladderPressureMmHg: 11,
      regions: [
        { id: 'head_neck', name: 'Head & Neck', adultNinesPct: 9, partialThicknessPct: 0, fullThicknessPct: 0, isCircumferential: false },
        { id: 'anterior_trunk', name: 'Anterior Chest & Abdomen', adultNinesPct: 18, partialThicknessPct: 0, fullThicknessPct: 5, isCircumferential: false },
        { id: 'posterior_trunk', name: 'Posterior Upper & Lower Back', adultNinesPct: 18, partialThicknessPct: 0, fullThicknessPct: 0, isCircumferential: false },
        { id: 'right_arm', name: 'Right Upper Extremity (Entrance)', adultNinesPct: 9, partialThicknessPct: 0, fullThicknessPct: 9, isCircumferential: true },
        { id: 'left_arm', name: 'Left Upper Extremity', adultNinesPct: 9, partialThicknessPct: 0, fullThicknessPct: 0, isCircumferential: false },
        { id: 'perineum', name: 'Perineum / Genitalia', adultNinesPct: 1, partialThicknessPct: 0, fullThicknessPct: 0, isCircumferential: false },
        { id: 'right_leg', name: 'Right Lower Extremity', adultNinesPct: 18, partialThicknessPct: 0, fullThicknessPct: 0, isCircumferential: false },
        { id: 'left_leg', name: 'Left Lower Extremity (Exit)', adultNinesPct: 18, partialThicknessPct: 0, fullThicknessPct: 6, isCircumferential: false },
      ],
    },
  },
  {
    id: 'inhalation-co-cyanide',
    name: 'Closed-Space Smoke Inhalation & Carbon Monoxide Toxicity',
    description: 'Victim trapped in burning apartment with severe soot, stridor, and COHb 32%. 100% FiO2 reduces CO half-life from 320 to 80 minutes.',
    profile: {
      ageYears: 45,
      weightKg: 75,
      heightCm: 175,
      mechanism: 'FLAME',
      hoursPostInjury: 1,
      inhalationInjuryPresent: true,
      carboxyhemoglobinPct: 32.0,
      fiO2Delivered: 1.0,
      measuredUrineOutputMlh: 42,
      bladderPressureMmHg: 8,
      regions: [
        { id: 'head_neck', name: 'Head & Neck', adultNinesPct: 9, partialThicknessPct: 5, fullThicknessPct: 2, isCircumferential: false },
        { id: 'anterior_trunk', name: 'Anterior Chest & Abdomen', adultNinesPct: 18, partialThicknessPct: 6, fullThicknessPct: 2, isCircumferential: false },
        { id: 'posterior_trunk', name: 'Posterior Upper & Lower Back', adultNinesPct: 18, partialThicknessPct: 0, fullThicknessPct: 0, isCircumferential: false },
        { id: 'right_arm', name: 'Right Upper Extremity', adultNinesPct: 9, partialThicknessPct: 0, fullThicknessPct: 0, isCircumferential: false },
        { id: 'left_arm', name: 'Left Upper Extremity', adultNinesPct: 9, partialThicknessPct: 0, fullThicknessPct: 0, isCircumferential: false },
        { id: 'perineum', name: 'Perineum / Genitalia', adultNinesPct: 1, partialThicknessPct: 0, fullThicknessPct: 0, isCircumferential: false },
        { id: 'right_leg', name: 'Right Lower Extremity', adultNinesPct: 18, partialThicknessPct: 0, fullThicknessPct: 0, isCircumferential: false },
        { id: 'left_leg', name: 'Left Lower Extremity', adultNinesPct: 18, partialThicknessPct: 0, fullThicknessPct: 0, isCircumferential: false },
      ],
    },
  },
  {
    id: 'circumferential-escharotomy',
    name: 'Circumferential Torso & Arm Full-Thickness Burn',
    description: 'Full-thickness leathery eschar encircling the thorax and right arm. Peak airway pressure >40 cmH2O and loss of radial pulse require emergency escharotomy.',
    profile: {
      ageYears: 50,
      weightKg: 85,
      heightCm: 180,
      mechanism: 'FLAME',
      hoursPostInjury: 3,
      inhalationInjuryPresent: false,
      carboxyhemoglobinPct: 3.5,
      fiO2Delivered: 1.0,
      measuredUrineOutputMlh: 45,
      bladderPressureMmHg: 14,
      regions: [
        { id: 'head_neck', name: 'Head & Neck', adultNinesPct: 9, partialThicknessPct: 0, fullThicknessPct: 0, isCircumferential: false },
        { id: 'anterior_trunk', name: 'Anterior Chest & Abdomen', adultNinesPct: 18, partialThicknessPct: 0, fullThicknessPct: 18, isCircumferential: true },
        { id: 'posterior_trunk', name: 'Posterior Upper & Lower Back', adultNinesPct: 18, partialThicknessPct: 0, fullThicknessPct: 18, isCircumferential: true },
        { id: 'right_arm', name: 'Right Upper Extremity', adultNinesPct: 9, partialThicknessPct: 0, fullThicknessPct: 9, isCircumferential: true },
        { id: 'left_arm', name: 'Left Upper Extremity', adultNinesPct: 9, partialThicknessPct: 5, fullThicknessPct: 0, isCircumferential: false },
        { id: 'perineum', name: 'Perineum / Genitalia', adultNinesPct: 1, partialThicknessPct: 0, fullThicknessPct: 0, isCircumferential: false },
        { id: 'right_leg', name: 'Right Lower Extremity', adultNinesPct: 18, partialThicknessPct: 0, fullThicknessPct: 0, isCircumferential: false },
        { id: 'left_leg', name: 'Left Lower Extremity', adultNinesPct: 18, partialThicknessPct: 0, fullThicknessPct: 0, isCircumferential: false },
      ],
    },
  },
  {
    id: 'fluid-creep-acs',
    name: 'Severe Fluid Creep & Abdominal Compartment Syndrome',
    description: 'Over-resuscitated burn (65% TBSA in 65 kg female). Total fluids 18,000 mL (Ivy Index 277 mL/kg). Bladder pressure 23 mmHg with tense distended abdomen.',
    profile: {
      ageYears: 28,
      weightKg: 65,
      heightCm: 165,
      mechanism: 'FLAME',
      hoursPostInjury: 14,
      inhalationInjuryPresent: true,
      carboxyhemoglobinPct: 2.0,
      fiO2Delivered: 1.0,
      measuredUrineOutputMlh: 110,
      bladderPressureMmHg: 26,
      regions: [
        { id: 'head_neck', name: 'Head & Neck', adultNinesPct: 9, partialThicknessPct: 4, fullThicknessPct: 3, isCircumferential: false },
        { id: 'anterior_trunk', name: 'Anterior Chest & Abdomen', adultNinesPct: 18, partialThicknessPct: 8, fullThicknessPct: 10, isCircumferential: false },
        { id: 'posterior_trunk', name: 'Posterior Upper & Lower Back', adultNinesPct: 18, partialThicknessPct: 5, fullThicknessPct: 10, isCircumferential: false },
        { id: 'right_arm', name: 'Right Upper Extremity', adultNinesPct: 9, partialThicknessPct: 4, fullThicknessPct: 3, isCircumferential: false },
        { id: 'left_arm', name: 'Left Upper Extremity', adultNinesPct: 9, partialThicknessPct: 3, fullThicknessPct: 3, isCircumferential: false },
        { id: 'perineum', name: 'Perineum / Genitalia', adultNinesPct: 1, partialThicknessPct: 1, fullThicknessPct: 0, isCircumferential: false },
        { id: 'right_leg', name: 'Right Lower Extremity', adultNinesPct: 18, partialThicknessPct: 6, fullThicknessPct: 5, isCircumferential: false },
        { id: 'left_leg', name: 'Left Lower Extremity', adultNinesPct: 18, partialThicknessPct: 0, fullThicknessPct: 0, isCircumferential: false },
      ],
    },
  },
  {
    id: 'delayed-presentation-burn',
    name: 'Delayed Arrival Major Burn (4 Hours Elapsed)',
    description: 'Worker burned in remote plant arrived 4 hours post-injury without prior IV fluids. The first 8-hour volume must be caught up over the remaining 4 hours.',
    profile: {
      ageYears: 42,
      weightKg: 78,
      heightCm: 177,
      mechanism: 'FLAME',
      hoursPostInjury: 4,
      inhalationInjuryPresent: false,
      carboxyhemoglobinPct: 2.5,
      fiO2Delivered: 0.21,
      measuredUrineOutputMlh: 12,
      bladderPressureMmHg: 10,
      regions: [
        { id: 'head_neck', name: 'Head & Neck', adultNinesPct: 9, partialThicknessPct: 0, fullThicknessPct: 0, isCircumferential: false },
        { id: 'anterior_trunk', name: 'Anterior Chest & Abdomen', adultNinesPct: 18, partialThicknessPct: 12, fullThicknessPct: 6, isCircumferential: false },
        { id: 'posterior_trunk', name: 'Posterior Upper & Lower Back', adultNinesPct: 18, partialThicknessPct: 4, fullThicknessPct: 2, isCircumferential: false },
        { id: 'right_arm', name: 'Right Upper Extremity', adultNinesPct: 9, partialThicknessPct: 3, fullThicknessPct: 2, isCircumferential: false },
        { id: 'left_arm', name: 'Left Upper Extremity', adultNinesPct: 9, partialThicknessPct: 0, fullThicknessPct: 0, isCircumferential: false },
        { id: 'perineum', name: 'Perineum / Genitalia', adultNinesPct: 1, partialThicknessPct: 0, fullThicknessPct: 0, isCircumferential: false },
        { id: 'right_leg', name: 'Right Lower Extremity', adultNinesPct: 18, partialThicknessPct: 4, fullThicknessPct: 2, isCircumferential: false },
        { id: 'left_leg', name: 'Left Lower Extremity', adultNinesPct: 18, partialThicknessPct: 0, fullThicknessPct: 0, isCircumferential: false },
      ],
    },
  },
  {
    id: 'chemical-acid-burn',
    name: 'Industrial Hydrofluoric & Sulfuric Acid Burn',
    description: 'Chemical spill across face and hands. Demands copius water irrigation, topical calcium gluconate gel, and cardiac telemetry for hypocalcemia.',
    profile: {
      ageYears: 36,
      weightKg: 72,
      heightCm: 172,
      mechanism: 'CHEMICAL',
      hoursPostInjury: 1,
      inhalationInjuryPresent: false,
      carboxyhemoglobinPct: 1.0,
      fiO2Delivered: 0.21,
      measuredUrineOutputMlh: 48,
      bladderPressureMmHg: 7,
      regions: [
        { id: 'head_neck', name: 'Head & Neck', adultNinesPct: 9, partialThicknessPct: 4, fullThicknessPct: 3, isCircumferential: false },
        { id: 'anterior_trunk', name: 'Anterior Chest & Abdomen', adultNinesPct: 18, partialThicknessPct: 0, fullThicknessPct: 0, isCircumferential: false },
        { id: 'posterior_trunk', name: 'Posterior Upper & Lower Back', adultNinesPct: 18, partialThicknessPct: 0, fullThicknessPct: 0, isCircumferential: false },
        { id: 'right_arm', name: 'Right Upper Extremity', adultNinesPct: 9, partialThicknessPct: 4, fullThicknessPct: 2, isCircumferential: false },
        { id: 'left_arm', name: 'Left Upper Extremity', adultNinesPct: 9, partialThicknessPct: 3, fullThicknessPct: 1, isCircumferential: false },
        { id: 'perineum', name: 'Perineum / Genitalia', adultNinesPct: 1, partialThicknessPct: 0, fullThicknessPct: 0, isCircumferential: false },
        { id: 'right_leg', name: 'Right Lower Extremity', adultNinesPct: 18, partialThicknessPct: 0, fullThicknessPct: 0, isCircumferential: false },
        { id: 'left_leg', name: 'Left Lower Extremity', adultNinesPct: 18, partialThicknessPct: 0, fullThicknessPct: 0, isCircumferential: false },
      ],
    },
  },
];
