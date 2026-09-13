/**
 * HyperkalemiaShiftEngine.ts
 * Biophysical & Pharmacotherapeutic Simulation Engine for Severe Hyperkalemia:
 * Nernst Resting Membrane Potential Shift, Cardiac Sodium Channel (Nav1.5) Inactivation,
 * EKG Conduction Abnormalities (Peaked T Waves to Sine Wave),
 * Calcium Gluconate vs Chloride Stoichiometric Membrane Stabilization,
 * Transcellular Shift Kinetics (Insulin/Dextrose, High-Dose Nebulized Albuterol, Bicarbonate),
 * and Definitive Elimination (Dialysis, Cation Exchange Binders SZC/Patiromer, Kaliuresis).
 *
 * References:
 * - Palmer BF, Clegg DJ. Diagnosis and treatment of hyperkalemia. Med Clin North Am. 2017;101(3):575-586.
 * - Weisberg LS. Management of severe hyperkalemia. Crit Care Med. 2008;36(12):3246-3251.
 * - Sterns RH, Grieff M, Bernstein PL. Treatment of hyperkalemia: something old, something new.
 *   Kidney Int. 2016;89(3):546-554.
 * - Rossignol P, et al. Emergency management of severe hyperkalaemia: Guideline for best clinical practice.
 *   Eur J Emerg Med. 2020;27(5):317-328.
 */

export type CalciumFormulation = 'calcium_gluconate_10' | 'calcium_chloride_10' | 'none';
export type BinderType = 'sodium_zirconium_cyclosilicate' | 'patiromer' | 'sodium_polystyrene_sulfonate' | 'none';

export interface PatientHyperkalemiaState {
  serumPotassiumMeqL: number; // e.g. 3.5 - 10.0 mEq/L
  baselineEgfrMlMin: number;
  bloodPh: number; // 6.90 - 7.55
  serumBicarbonateMeqL: number; // 5 - 32 mEq/L
  bloodGlucoseMgDl: number; // 50 - 500 mg/dL
  ionizedCalciumMmolL: number; // 0.8 - 1.4 mmol/L
  onBetaBlocker: boolean;
  calciumAdministered: {
    formulation: CalciumFormulation;
    ampulesGiven: number; // 1 amp = 10 mL = 1 g
    minutesAgo: number;
  };
  shiftTherapiesGiven: {
    insulinRegularUnits: number; // 5 - 10 units
    dextroseGrams: number; // 25 - 50 g (D50W)
    albuterolNebulizedMg: number; // 10 - 20 mg
    sodiumBicarbonateMeq: number; // 50 - 150 mEq
  };
  eliminationActive: {
    furosemideMg: number;
    binder: BinderType;
    hemodialysisActive: boolean;
  };
}

export interface MembranePotentialReport {
  restingMembranePotentialMv: number; // Normal ~ -90 mV
  thresholdPotentialMv: number; // Normal ~ -65 mV
  relativeNavAvailabilityPercent: number; // 0 - 100%
  membraneExcitabilityStatus: 'Normal Polarized' | 'Mild Depolarization' | 'Severe Depolarization (Nav Inactivated)' | 'Sine Wave Arrest Imminent';
  isMembraneStabilizedByCalcium: boolean;
  elementalCalciumDeliveredMg: number;
  membraneStabilityDurationRemainingMin: number;
}

export interface EkgMorphologyReport {
  rhythmName: string;
  prIntervalMs: number; // normal 120-200 ms
  qrsDurationMs: number; // normal 80-100 ms
  tWaveAmplitudeMm: number; // normal 3-6 mm
  tWaveMorphology: 'Normal' | 'Peaked & Narrow-Based (Tented)' | 'Blunted/Flattened' | 'Merged (Sine Wave)';
  pWaveStatus: 'Normal Prominence' | 'Flattened / Decreased Voltage' | 'Absent (Sinoventricular Rhythm)';
  sineWaveRiskPercent: number; // 0 - 100%
  ekgSeverityGrade: 'Normal' | 'Grade I (Peaked T)' | 'Grade II (PR Prolongation / Loss of P)' | 'Grade III (Wide QRS)' | 'Grade IV (Sine Wave / Cardiac Arrest)';
}

export interface ShiftKineticsReport {
  predictedPotassiumDropMeqL: number;
  projectedPotassiumMeqL: number;
  insulinShiftEffectMeqL: number;
  albuterolShiftEffectMeqL: number;
  bicarbonateShiftEffectMeqL: number;
  hypoglycemiaRiskLevel: 'Low' | 'Moderate' | 'Severe (eGFR < 30 or Low Baseline Glucose)';
  bicarbonateFutilityAlert?: string;
  albuterolResistanceAlert?: string;
}

export interface EliminationKineticsReport {
  hourlyRemovalRateMeqHr: number;
  timeToSafePotassiumHours: number; // time to reach < 5.5 mEq/L
  primaryModality: string;
  clinicalEliminationDirective: string;
}

export interface HyperkalemiaScenario {
  id: string;
  name: string;
  patientSummary: string;
  initialState: PatientHyperkalemiaState;
  clinicalPearls: string[];
}

/**
 * 1. Nernst Equation & Cardiac Membrane Stabilization Calculation
 * Em = 61.5 * log10([K+]out / [K+]in), assuming [K+]in = 140 mEq/L
 */
export function calculateMembranePotential(
  potassiumMeqL: number,
  calciumState: PatientHyperkalemiaState['calciumAdministered']
): MembranePotentialReport {
  const intracellularK = 140.0;
  const restingMembranePotentialMv = Math.round(61.5 * Math.log10(Math.max(2.0, potassiumMeqL) / intracellularK) * 10) / 10;

  // Calcium administration calculation
  let elementalCalciumDeliveredMg = 0;
  if (calciumState.formulation === 'calcium_chloride_10') {
    elementalCalciumDeliveredMg = calciumState.ampulesGiven * 270; // 13.6 mEq ~ 270 mg Ca
  } else if (calciumState.formulation === 'calcium_gluconate_10') {
    elementalCalciumDeliveredMg = calciumState.ampulesGiven * 90; // 4.65 mEq ~ 90 mg Ca
  }

  // Calcium duration: active for ~45-60 min
  const isMembraneStabilizedByCalcium =
    calciumState.ampulesGiven > 0 &&
    elementalCalciumDeliveredMg >= 90 &&
    calciumState.minutesAgo <= 55;

  const membraneStabilityDurationRemainingMin = isMembraneStabilizedByCalcium
    ? Math.max(0, 50 - calciumState.minutesAgo)
    : 0;

  // Calcium shifts threshold potential upward (more positive) and protects Nav1.5
  const baseThreshold = -65.0;
  const thresholdPotentialMv = isMembraneStabilizedByCalcium ? -55.0 : baseThreshold;

  // Nav1.5 availability drops sharply as Em rises above -75 mV
  let relativeNavAvailabilityPercent = Math.round(
    Math.max(5, Math.min(100, 100 / (1 + Math.exp((restingMembranePotentialMv + 72) / 4.5))))
  );

  // If calcium is active, restore effective channel availability by ~35%
  if (isMembraneStabilizedByCalcium) {
    relativeNavAvailabilityPercent = Math.min(95, relativeNavAvailabilityPercent + 35);
  }

  let membraneExcitabilityStatus: MembranePotentialReport['membraneExcitabilityStatus'] = 'Normal Polarized';
  if (restingMembranePotentialMv > -68 && !isMembraneStabilizedByCalcium) {
    membraneExcitabilityStatus = 'Sine Wave Arrest Imminent';
  } else if (restingMembranePotentialMv > -78) {
    membraneExcitabilityStatus = 'Severe Depolarization (Nav Inactivated)';
  } else if (restingMembranePotentialMv > -88) {
    membraneExcitabilityStatus = 'Mild Depolarization';
  }

  return {
    restingMembranePotentialMv,
    thresholdPotentialMv,
    relativeNavAvailabilityPercent,
    membraneExcitabilityStatus,
    isMembraneStabilizedByCalcium,
    elementalCalciumDeliveredMg,
    membraneStabilityDurationRemainingMin,
  };
}

/**
 * 2. EKG Conduction & Sine Wave Morphology Assessment
 */
export function evaluateEkgMorphology(
  potassiumMeqL: number,
  isMembraneStabilized: boolean
): EkgMorphologyReport {
  // Effective potassium perceived by myocardium is lower if stabilized by calcium
  const effectiveK = isMembraneStabilized ? Math.max(4.5, potassiumMeqL - 1.6) : potassiumMeqL;

  let prIntervalMs = 160;
  let qrsDurationMs = 88;
  let tWaveAmplitudeMm = 4.0;
  let tWaveMorphology: EkgMorphologyReport['tWaveMorphology'] = 'Normal';
  let pWaveStatus: EkgMorphologyReport['pWaveStatus'] = 'Normal Prominence';
  let sineWaveRiskPercent = 0;
  let ekgSeverityGrade: EkgMorphologyReport['ekgSeverityGrade'] = 'Normal';
  let rhythmName = 'Normal Sinus Rhythm';

  if (effectiveK < 5.5) {
    ekgSeverityGrade = 'Normal';
    rhythmName = 'Normal Sinus Rhythm';
  } else if (effectiveK < 6.5) {
    ekgSeverityGrade = 'Grade I (Peaked T)';
    tWaveAmplitudeMm = 10.0 + (effectiveK - 5.5) * 4;
    tWaveMorphology = 'Peaked & Narrow-Based (Tented)';
    rhythmName = 'Sinus Rhythm with Peaked T Waves';
  } else if (effectiveK < 7.5) {
    ekgSeverityGrade = 'Grade II (PR Prolongation / Loss of P)';
    tWaveAmplitudeMm = 14.0;
    tWaveMorphology = 'Peaked & Narrow-Based (Tented)';
    prIntervalMs = Math.round(210 + (effectiveK - 6.5) * 90);
    pWaveStatus = 'Flattened / Decreased Voltage';
    rhythmName = 'First-Degree AV Block / Flattened P Waves';
    sineWaveRiskPercent = 25;
  } else if (effectiveK < 8.5) {
    ekgSeverityGrade = 'Grade III (Wide QRS)';
    tWaveAmplitudeMm = 12.0;
    tWaveMorphology = 'Peaked & Narrow-Based (Tented)';
    prIntervalMs = 320;
    qrsDurationMs = Math.round(125 + (effectiveK - 7.5) * 40);
    pWaveStatus = 'Absent (Sinoventricular Rhythm)';
    rhythmName = 'Sinoventricular Rhythm with Intraventricular Conduction Delay';
    sineWaveRiskPercent = 65;
  } else {
    ekgSeverityGrade = 'Grade IV (Sine Wave / Cardiac Arrest)';
    tWaveAmplitudeMm = 16.0;
    tWaveMorphology = 'Merged (Sine Wave)';
    qrsDurationMs = Math.round(170 + (effectiveK - 8.5) * 30);
    pWaveStatus = 'Absent (Sinoventricular Rhythm)';
    rhythmName = 'Pre-Arrest Sine-Wave Rhythm (Ventricular Flutter / Imminent VF)';
    sineWaveRiskPercent = 95;
  }

  return {
    rhythmName,
    prIntervalMs,
    qrsDurationMs,
    tWaveAmplitudeMm,
    tWaveMorphology,
    pWaveStatus,
    sineWaveRiskPercent,
    ekgSeverityGrade,
  };
}

/**
 * 3. Transcellular Shift Kinetics & Safety Stratification
 */
export function calculateShiftKinetics(state: PatientHyperkalemiaState): ShiftKineticsReport {
  const { shiftTherapiesGiven, bloodPh, bloodGlucoseMgDl, baselineEgfrMlMin, onBetaBlocker } = state;

  // 1. Regular Insulin Shift: 10 units drops K+ by ~0.8 mEq/L (0.08 per unit)
  let insulinShiftEffectMeqL = Math.min(1.2, shiftTherapiesGiven.insulinRegularUnits * 0.08);

  // 2. High-dose Albuterol: 10-20 mg neb drops K+ by ~0.6 mEq/L
  // Beta-blocker reduces efficacy by 60%
  let albuterolBaseDrop = (shiftTherapiesGiven.albuterolNebulizedMg / 20.0) * 0.65;
  let albuterolShiftEffectMeqL = onBetaBlocker ? albuterolBaseDrop * 0.35 : albuterolBaseDrop;
  albuterolShiftEffectMeqL = Math.min(0.8, Math.round(albuterolShiftEffectMeqL * 100) / 100);

  // 3. Sodium Bicarbonate: ONLY works if significant metabolic acidosis is present (pH < 7.25, HCO3 < 15)
  let bicarbonateShiftEffectMeqL = 0;
  let bicarbonateFutilityAlert: string | undefined = undefined;

  if (shiftTherapiesGiven.sodiumBicarbonateMeq > 0) {
    if (bloodPh < 7.25) {
      bicarbonateShiftEffectMeqL = Math.min(0.5, (shiftTherapiesGiven.sodiumBicarbonateMeq / 100) * 0.35);
      bicarbonateShiftEffectMeqL = Math.round(bicarbonateShiftEffectMeqL * 100) / 100;
    } else {
      bicarbonateShiftEffectMeqL = 0.0;
      bicarbonateFutilityAlert =
        'Clinical Futility Warning: Sodium bicarbonate does NOT lower serum potassium in non-acidotic patients (pH >= 7.25). Giving hypertonic bicarbonate risks hypernatremia, volume overload, and hypocalcemic tetany.';
    }
  }

  let albuterolResistanceAlert: string | undefined = undefined;
  if (onBetaBlocker && shiftTherapiesGiven.albuterolNebulizedMg > 0) {
    albuterolResistanceAlert =
      'Pharmacodynamic Blunting: Patient is receiving beta-blocker therapy, reducing albuterol-induced Na+/K+-ATPase translocation by ~65%. Synergistic insulin is mandatory.';
  }

  const predictedPotassiumDropMeqL =
    Math.round((insulinShiftEffectMeqL + albuterolShiftEffectMeqL + bicarbonateShiftEffectMeqL) * 100) / 100;

  const projectedPotassiumMeqL =
    Math.round(Math.max(2.5, state.serumPotassiumMeqL - predictedPotassiumDropMeqL) * 100) / 100;

  // Hypoglycemia Risk Stratification
  let hypoglycemiaRiskLevel: ShiftKineticsReport['hypoglycemiaRiskLevel'] = 'Low';
  if (shiftTherapiesGiven.insulinRegularUnits > 0) {
    if (baselineEgfrMlMin < 30 || bloodGlucoseMgDl < 120 || shiftTherapiesGiven.dextroseGrams < 25) {
      hypoglycemiaRiskLevel = 'Severe (eGFR < 30 or Low Baseline Glucose)';
    } else if (bloodGlucoseMgDl < 180 || shiftTherapiesGiven.dextroseGrams < 50) {
      hypoglycemiaRiskLevel = 'Moderate';
    }
  }

  return {
    predictedPotassiumDropMeqL,
    projectedPotassiumMeqL,
    insulinShiftEffectMeqL,
    albuterolShiftEffectMeqL,
    bicarbonateShiftEffectMeqL,
    hypoglycemiaRiskLevel,
    bicarbonateFutilityAlert,
    albuterolResistanceAlert,
  };
}

/**
 * 4. Elimination Kinetics & Removal Rates
 */
export function calculateEliminationKinetics(state: PatientHyperkalemiaState): EliminationKineticsReport {
  const { eliminationActive, baselineEgfrMlMin, serumPotassiumMeqL } = state;

  let hourlyRemovalRateMeqHr = 0;
  let primaryModality = 'None Active (Shifting Only)';

  if (eliminationActive.hemodialysisActive) {
    hourlyRemovalRateMeqHr += 35.0; // Standard IHD removes 30-40 mEq/hr
    primaryModality = 'Emergency Intermittent Hemodialysis (0-K or 1-K Bath)';
  }

  if (eliminationActive.furosemideMg > 0) {
    // Kaliuresis depends on residual GFR
    const renalFactor = Math.min(1.0, baselineEgfrMlMin / 60.0);
    const diureticRate = (eliminationActive.furosemideMg / 40.0) * 8.0 * renalFactor;
    hourlyRemovalRateMeqHr += diureticRate;
    if (!eliminationActive.hemodialysisActive && renalFactor > 0.3) {
      primaryModality = 'Loop Diuretic Forced Kaliuresis';
    }
  }

  if (eliminationActive.binder === 'sodium_zirconium_cyclosilicate') {
    hourlyRemovalRateMeqHr += 4.5; // Lokelma onset ~1 hour, fast gastrointestinal trap
    if (!eliminationActive.hemodialysisActive) primaryModality = 'Sodium Zirconium Cyclosilicate (Lokelma)';
  } else if (eliminationActive.binder === 'patiromer') {
    hourlyRemovalRateMeqHr += 2.0; // Veltassa slower onset ~4-7h
    if (!eliminationActive.hemodialysisActive) primaryModality = 'Patiromer (Veltassa)';
  } else if (eliminationActive.binder === 'sodium_polystyrene_sulfonate') {
    hourlyRemovalRateMeqHr += 2.5; // Kayexalate
  }

  hourlyRemovalRateMeqHr = Math.round(hourlyRemovalRateMeqHr * 10) / 10;

  // Extracellular potassium excess estimate: (K - 5.0) * ECF volume (~14L in 70kg)
  const excessMeq = Math.max(0, (serumPotassiumMeqL - 5.0) * 14.0);
  const timeToSafePotassiumHours =
    hourlyRemovalRateMeqHr > 0
      ? Math.round((excessMeq / hourlyRemovalRateMeqHr) * 10) / 10
      : 99.9;

  let clinicalEliminationDirective = '';
  if (eliminationActive.hemodialysisActive) {
    clinicalEliminationDirective =
      'Hemodialysis actively clearing potassium. Expect post-dialysis intracellular rebound within 1-2 hours; recheck lab at 2 hours post-run.';
  } else if (baselineEgfrMlMin < 15 && serumPotassiumMeqL >= 6.5) {
    clinicalEliminationDirective =
      'CRITICAL: Patient has ESRD/oligoanuria (eGFR < 15) with severe hyperkalemia. Medical therapies are TEMPORARY SHIFTS only. Emergent vascular access and nephrology consult for hemodialysis are mandatory.';
  } else if (hourlyRemovalRateMeqHr > 5) {
    clinicalEliminationDirective =
      'Adequate elimination underway. Monitor urine output, electrolytes every 2-4 hours, and maintain cardiac telemetry.';
  } else {
    clinicalEliminationDirective =
      'No definitive elimination active. Potassium will redistribute back out of cells in 2-4 hours once insulin wears off!';
  }

  return {
    hourlyRemovalRateMeqHr,
    timeToSafePotassiumHours,
    primaryModality,
    clinicalEliminationDirective,
  };
}

/**
 * 5. Clinical Scenarios Catalog
 */
export const HYPERKALEMIA_SCENARIOS: Record<string, HyperkalemiaScenario> = {
  missed_dialysis_sine_wave: {
    id: 'missed_dialysis_sine_wave',
    name: '1. Missed Hemodialysis with Sine-Wave Rhythm (Arrest Imminent)',
    patientSummary: '58yo female with ESRD on thrice-weekly hemodialysis missed 2 sessions. Found lethargic, profound bradycardia HR 38, wide-complex sine-wave rhythm on monitor.',
    initialState: {
      serumPotassiumMeqL: 8.8,
      baselineEgfrMlMin: 4,
      bloodPh: 7.22,
      serumBicarbonateMeqL: 14,
      bloodGlucoseMgDl: 135,
      ionizedCalciumMmolL: 1.05,
      onBetaBlocker: true,
      calciumAdministered: {
        formulation: 'none',
        ampulesGiven: 0,
        minutesAgo: 0,
      },
      shiftTherapiesGiven: {
        insulinRegularUnits: 0,
        dextroseGrams: 0,
        albuterolNebulizedMg: 0,
        sodiumBicarbonateMeq: 0,
      },
      eliminationActive: {
        furosemideMg: 0,
        binder: 'none',
        hemodialysisActive: false,
      },
    },
    clinicalPearls: [
      'Membrane stabilization is the absolute first step! Calcium chloride 10% 1 g IV over 2-5 min (or calcium gluconate 3 g) immediately.',
      'EKG changes should improve within 1-3 minutes; if sine-wave persists after 5 minutes, repeat calcium dose.',
      'Shifting with 10u regular insulin + 50g D50W and 20 mg albuterol is a 2-4 hour bridge to emergency emergent hemodialysis.',
    ],
  },
  crush_injury_rhabdo: {
    id: 'crush_injury_rhabdo',
    name: '2. Severe Crush Injury & Traumatic Rhabdomyolysis',
    patientSummary: '29yo construction worker pinned under concrete slab for 4 hours. Massive bilateral lower extremity swelling, tea-colored urine, K+ 7.4 mEq/L, and severe metabolic acidosis.',
    initialState: {
      serumPotassiumMeqL: 7.4,
      baselineEgfrMlMin: 42,
      bloodPh: 7.12,
      serumBicarbonateMeqL: 11,
      bloodGlucoseMgDl: 160,
      ionizedCalciumMmolL: 0.92,
      onBetaBlocker: false,
      calciumAdministered: {
        formulation: 'none',
        ampulesGiven: 0,
        minutesAgo: 0,
      },
      shiftTherapiesGiven: {
        insulinRegularUnits: 0,
        dextroseGrams: 0,
        albuterolNebulizedMg: 0,
        sodiumBicarbonateMeq: 0,
      },
      eliminationActive: {
        furosemideMg: 0,
        binder: 'none',
        hemodialysisActive: false,
      },
    },
    clinicalPearls: [
      'Crush rhabdomyolysis releases massive intracellular potassium, myoglobin, and phosphate (causing secondary hypocalcemia).',
      'Because pH is 7.12 (< 7.25), IV sodium bicarbonate 100-150 mEq is pharmacodynamically active and drives potassium into cells.',
      'Aggressive crystalloid volume expansion (aiming for urine output 200-300 mL/hr) is critical to prevent myoglobinuric acute tubular necrosis.',
    ],
  },
  ckd_spironolactone_hypoglycemia_risk: {
    id: 'ckd_spironolactone_hypoglycemia_risk',
    name: '3. Diabetic CKD on Spironolactone (Severe Hypoglycemia Risk)',
    patientSummary: '71yo male with diabetic nephropathy (eGFR 22) recently started on spironolactone for heart failure. Potassium 6.8 mEq/L, baseline blood glucose 88 mg/dL.',
    initialState: {
      serumPotassiumMeqL: 6.8,
      baselineEgfrMlMin: 22,
      bloodPh: 7.34,
      serumBicarbonateMeqL: 20,
      bloodGlucoseMgDl: 88,
      ionizedCalciumMmolL: 1.18,
      onBetaBlocker: true,
      calciumAdministered: {
        formulation: 'none',
        ampulesGiven: 0,
        minutesAgo: 0,
      },
      shiftTherapiesGiven: {
        insulinRegularUnits: 0,
        dextroseGrams: 0,
        albuterolNebulizedMg: 0,
        sodiumBicarbonateMeq: 0,
      },
      eliminationActive: {
        furosemideMg: 0,
        binder: 'none',
        hemodialysisActive: false,
      },
    },
    clinicalPearls: [
      'In patients with renal impairment (eGFR < 30) and baseline glucose < 120 mg/dL, standard 10u insulin causes iatrogenic hypoglycemia in > 50% of cases.',
      'Protocol modification: reduce regular insulin to 5 units IV and administer full 50 g dextrose (100 mL D50W) followed by D10W infusion.',
      'Discontinue spironolactone and ACE inhibitor immediately; initiate oral potassium binder (Lokelma / SZC 10 g TID).',
    ],
  },
  iatrogenic_postop_futility: {
    id: 'iatrogenic_postop_futility',
    name: '4. Post-Operative Mild Hyperkalemia (Bicarbonate Futility)',
    patientSummary: '64yo female post-colectomy receiving maintenance IV fluids with excess KCl. Serum K+ 6.1 mEq/L, normal acid-base status (pH 7.42, HCO3 24).',
    initialState: {
      serumPotassiumMeqL: 6.1,
      baselineEgfrMlMin: 65,
      bloodPh: 7.42,
      serumBicarbonateMeqL: 24,
      bloodGlucoseMgDl: 140,
      ionizedCalciumMmolL: 1.22,
      onBetaBlocker: false,
      calciumAdministered: {
        formulation: 'none',
        ampulesGiven: 0,
        minutesAgo: 0,
      },
      shiftTherapiesGiven: {
        insulinRegularUnits: 0,
        dextroseGrams: 0,
        albuterolNebulizedMg: 0,
        sodiumBicarbonateMeq: 0,
      },
      eliminationActive: {
        furosemideMg: 0,
        binder: 'none',
        hemodialysisActive: false,
      },
    },
    clinicalPearls: [
      'Administering sodium bicarbonate in a non-acidotic patient does NOT lower serum potassium and causes volume overload and alkalemia.',
      'Because GFR is preserved (eGFR 65), loop diuretic (Furosemide 40 mg IV) provides rapid kaliuresis and definitive elimination.',
      "Stop all potassium-containing IV fluids (e.g., switch Lactated Ringer's or Plasmalyte to 0.9% Normal Saline).",
    ],
  },
};
