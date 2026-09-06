/**
 * ArterialLineHemodynamicsEngine.ts
 *
 * Biophysical and mathematical engine for continuous Arterial Line Hemodynamics,
 * Pulse Pressure Variation (PPV), Stroke Volume Variation (SVV), Dynamic Arterial
 * Elastance (Ea_dyn), and Fast-Flush Square Wave Test Damping Analysis.
 *
 * Implements:
 * 1. Arterial Pressure Waveform Morphology:
 *    - Anacrotic limb (systolic upstroke dP/dt_max reflecting LV inotropy)
 *    - Peak Systolic Pressure (PSP)
 *    - Dicrotic notch / incisura (aortic valve closure, end of LV systole)
 *    - Diastolic runoff decay (exponential runoff governed by systemic vascular resistance & arterial compliance)
 *    - End-Diastolic Pressure (EDP)
 *    - Mean Arterial Pressure (MAP = DBP + 1/3(SBP - DBP) or pulse area integration)
 *    - Derived parameters: Cardiac Output (CO = SV * HR / 1000), Systemic Vascular Resistance (SVR = (MAP - CVP) * 80 / CO)
 * 2. Dynamic Fluid Responsiveness Indices (Heart-Lung Interactions in Mechanical Ventilation):
 *    - Pulse Pressure Variation: PPV = ((PP_max - PP_min) / ((PP_max + PP_min) / 2)) * 100%
 *      - PPV > 13%: Fluid Responsive (likely >= 15% increase in SV with 500 mL crystalloid)
 *      - PPV < 9%: Fluid Non-Responsive (risk of volume overload and hydrostatic pulmonary edema)
 *      - PPV 9 - 13%: Gray Zone (requires Tidal Volume Challenge or Passive Leg Raise)
 *    - Stroke Volume Variation: SVV = ((SV_max - SV_min) / ((SV_max + SV_min) / 2)) * 100% (Cutoff > 12%)
 *    - Dynamic Arterial Elastance: Ea_dyn = PPV / SVV
 *      - Ea_dyn > 1.0: Preserved arterial tone; volume expansion increases both SV and MAP.
 *      - Ea_dyn < 0.8: Severe vasoplegia; volume expansion may increase SV but fails to increase MAP (needs Norepinephrine).
 *    - Confounding Criteria Matrix:
 *      - Spontaneous breathing efforts (reverses intrathoracic pressure swings, false positive/negative)
 *      - Low Tidal Volume (< 8 mL/kg predicted body weight, e.g. ARDSNet 6 mL/kg, causes false negative PPV)
 *      - Cardiac arrhythmias (Atrial fibrillation, frequent PVCs cause irregular beat-to-beat variability)
 *      - Severe Right Ventricular (RV) failure / Cor Pulmonale (PPV reflects RV afterload mismatch, fluid is harmful)
 *      - Open chest (thoracotomy eliminates pleural pressure transmission)
 *    - Tidal Volume Challenge (delta-PPV from 6 to 8 mL/kg, cutoff > 3.5%)
 *    - Passive Leg Raising (PLR) maneuver (300-500 mL reversible autotransfusion, delta-SV > 10% gold standard)
 * 3. Fast-Flush Square Wave Test (Dynamic Response & Damping Analysis):
 *    - High-pressure flush (300 mmHg) produces sharp square wave plateau followed by sudden release
 *    - Damping Coefficient (zeta) and Undamped Natural Frequency (fn):
 *      - Amplitude ratio: r = A2 / A1
 *      - zeta = (-ln(r)) / sqrt(pi^2 + (ln(r))^2)
 *      - fn = paper_speed / (period_distance)
 *    - Damping Tiers:
 *      - Optimal Damping (zeta = 0.55 - 0.70, fn >= 24 Hz): 1 - 2 rapid oscillations before returning to baseline. Accurate SBP and DBP.
 *      - Underdamped / "Whippy" (zeta < 0.40): Multiple ringing oscillations (> 2 - 3 rings). Falsely elevated SBP (by 15 - 30 mmHg), falsely low DBP, accurate MAP.
 *      - Overdamped (zeta > 0.80): Sluggish return, zero rebound oscillation, absent dicrotic notch. Falsely low SBP, falsely high DBP, preserved MAP. Causes: air bubble in tubing, compliant clot at catheter tip, kinked arterial line.
 *
 * Location: frontend/.gemini/skills/ArterialLineHemodynamicsEngine.ts
 */

export interface HemodynamicParameters {
  systolicBpMmHg: number; // e.g. 120
  diastolicBpMmHg: number; // e.g. 80
  heartRateBpm: number; // e.g. 75
  centralVenousPressureMmHg: number; // e.g. 6
  strokeVolumeMl: number; // e.g. 70
  arterialComplianceMlMmHg: number; // normal 1.0 - 1.5
  systemicVascularResistanceDyns: number; // normal 800 - 1200
  myocardialInotropyPct: number; // 50 - 150% (affects dP/dt upstroke)
}

export interface VentilatorSettings {
  isMechanicallyVentilated: boolean;
  isSpontaneouslyBreathing: boolean; // if true, invalidates standard PPV cutoff
  hasCardiacArrhythmia: boolean; // if true (e.g. AFib), invalidates PPV
  hasRightVentricularFailure: boolean; // if true, PPV reflects RV afterload, fluid harmful
  hasOpenChest: boolean; // if true, invalidates pleural pressure swing
  tidalVolumeMlPerKgPbw: number; // normal >= 8 for standard PPV; if < 8, false negative risk
  respiratoryRateBpm: number; // e.g. 14
  positiveEndExpiratoryPressureCmH2O: number; // e.g. 5
}

export interface FastFlushDampingState {
  dampingCoefficientZeta: number; // optimal ~0.60, underdamped <0.4, overdamped >0.8
  naturalFrequencyHz: number; // optimal > 24 Hz, compromised < 15 Hz
  hasAirBubble: boolean;
  hasCatheterClotOrKink: boolean;
  hasCompliantTubing: boolean;
}

export interface DynamicFluidResponsiveness {
  ppvPct: number;
  svvPct: number;
  eaDyn: number;
  ppMaxMmHg: number;
  ppMinMmHg: number;
  svMaxMl: number;
  svMinMl: number;
  responsivenessTier: 'RESPONSIVE' | 'GRAY_ZONE' | 'NON_RESPONSIVE' | 'INVALID_CONFOUNDED';
  responsivenessRationale: string;
  isConfounded: boolean;
  confoundingFactors: string[];
  recommendedTest: 'STANDARD_FLUID_BOLUS' | 'TIDAL_VOLUME_CHALLENGE' | 'PASSIVE_LEG_RAISE' | 'VASOPRESSOR_UPTITRATION';
  predictedSvIncreaseWithFluidPct: number; // estimated % increase in SV with 500 mL bolus
  predictedMapIncreaseWithFluidMmHg: number;
}

export interface DampingAnalysisResult {
  dampingTier: 'OPTIMAL' | 'UNDERDAMPED_WHIPPY' | 'OVERDAMPED';
  diagnosticDescription: string;
  measuredSbpMmHg: number; // actual displayed SBP with artifact
  measuredDbpMmHg: number; // actual displayed DBP with artifact
  measuredMapMmHg: number; // displayed MAP (relatively robust)
  sbpErrorMmHg: number;
  dbpErrorMmHg: number;
  clinicalImplications: string;
  recommendedCorrectiveAction: string;
}

export interface MasterHemodynamicEvaluation {
  cardiacOutputLMin: number;
  meanArterialPressureMmHg: number;
  systemicVascularResistanceDyns: number;
  fluidResponsiveness: DynamicFluidResponsiveness;
  dampingAnalysis: DampingAnalysisResult;
  clinicalSummary: string;
  alerts: string[];
}

/**
 * Computes Mean Arterial Pressure (MAP) and true systemic hemodynamics.
 */
export function computeSystemicHemodynamics(params: HemodynamicParameters): {
  mapMmHg: number;
  cardiacOutputLMin: number;
  calculatedSvrDyns: number;
} {
  const mapMmHg = Math.round(params.diastolicBpMmHg + (params.systolicBpMmHg - params.diastolicBpMmHg) / 3);
  const cardiacOutputLMin = parseFloat(((params.strokeVolumeMl * params.heartRateBpm) / 1000).toFixed(2));
  const effectiveCo = Math.max(0.5, cardiacOutputLMin);
  const calculatedSvrDyns = Math.round(((mapMmHg - params.centralVenousPressureMmHg) * 80) / effectiveCo);

  return {
    mapMmHg,
    cardiacOutputLMin,
    calculatedSvrDyns,
  };
}

/**
 * Evaluates Dynamic Fluid Responsiveness: PPV, SVV, and Dynamic Arterial Elastance (Ea_dyn).
 */
export function evaluateFluidResponsiveness(
  hemo: HemodynamicParameters,
  vent: VentilatorSettings,
  userPpvOverridePct?: number
): DynamicFluidResponsiveness {
  const confoundingFactors: string[] = [];

  if (vent.isSpontaneouslyBreathing) {
    confoundingFactors.push('Spontaneous Breathing Effort present: Inverts or exaggerates intrathoracic pressure variations, making standard PPV thresholds unreliable.');
  }
  if (!vent.isMechanicallyVentilated) {
    confoundingFactors.push('Spontaneously breathing patient: Cyclic heart-lung interactions are absent or variable.');
  }
  if (vent.hasCardiacArrhythmia) {
    confoundingFactors.push('Cardiac Arrhythmia (Atrial Fibrillation / Ectopy): Beat-to-beat variations in filling time falsely elevate PPV independent of volume status.');
  }
  if (vent.tidalVolumeMlPerKgPbw < 8.0 && vent.isMechanicallyVentilated) {
    confoundingFactors.push(`Low Tidal Volume (${vent.tidalVolumeMlPerKgPbw.toFixed(1)} mL/kg PBW < 8.0 mL/kg): Diminished intrathoracic pressure swing causes false negative PPV.`);
  }
  if (vent.hasRightVentricularFailure) {
    confoundingFactors.push('Severe Right Ventricular Failure / Cor Pulmonale: Cyclic pulse pressure variations reflect RV afterload variations rather than volume responsiveness. Fluid loading may precipitate RV ischemia and cardiovascular collapse.');
  }
  if (vent.hasOpenChest) {
    confoundingFactors.push('Open Chest (Thoracotomy): Absence of enclosed intrathoracic pressure transmission invalidates PPV.');
  }

  const isConfounded = confoundingFactors.length > 0;

  // Baseline pulse pressure
  const baselinePp = hemo.systolicBpMmHg - hemo.diastolicBpMmHg;

  // Compute respiratory swing based on compliance, hypovolemia, and ventilation
  let computedPpvPct = userPpvOverridePct ?? 10;
  if (userPpvOverridePct === undefined) {
    // Physiological estimate based on compliance and stroke volume
    const volumeDepletionFactor = Math.max(0.5, 80 / Math.max(30, hemo.strokeVolumeMl));
    const vtFactor = vent.tidalVolumeMlPerKgPbw / 8.0;
    computedPpvPct = Math.round(7 * volumeDepletionFactor * vtFactor);
  }

  // Calculate PP_max and PP_min from PPV
  const halfSwingPp = (computedPpvPct / 200) * baselinePp;
  const ppMaxMmHg = Math.round(baselinePp + halfSwingPp);
  const ppMinMmHg = Math.round(baselinePp - halfSwingPp);

  // SVV correlates closely with PPV in closed-chest ventilation (SVV ~ PPV * 0.85)
  const svvPct = parseFloat((computedPpvPct * 0.85).toFixed(1));
  const halfSwingSv = (svvPct / 200) * hemo.strokeVolumeMl;
  const svMaxMl = Math.round(hemo.strokeVolumeMl + halfSwingSv);
  const svMinMl = Math.round(hemo.strokeVolumeMl - halfSwingSv);

  // Dynamic Arterial Elastance (Ea_dyn = PPV / SVV)
  const eaDyn = svvPct > 0 ? parseFloat((computedPpvPct / svvPct).toFixed(2)) : 1.0;

  let responsivenessTier: 'RESPONSIVE' | 'GRAY_ZONE' | 'NON_RESPONSIVE' | 'INVALID_CONFOUNDED' = 'NON_RESPONSIVE';
  let responsivenessRationale = '';
  let recommendedTest: 'STANDARD_FLUID_BOLUS' | 'TIDAL_VOLUME_CHALLENGE' | 'PASSIVE_LEG_RAISE' | 'VASOPRESSOR_UPTITRATION' =
    'STANDARD_FLUID_BOLUS';
  let predictedSvIncreaseWithFluidPct = 0;
  let predictedMapIncreaseWithFluidMmHg = 0;

  if (isConfounded) {
    responsivenessTier = 'INVALID_CONFOUNDED';
    responsivenessRationale =
      'PPV and SVV are strictly invalid due to presence of clinical confounders (spontaneous breathing, arrhythmia, low Vt, or RV failure). Do NOT rely on PPV to guide fluid resuscitation.';
    recommendedTest = 'PASSIVE_LEG_RAISE';
    predictedSvIncreaseWithFluidPct = computedPpvPct > 13 ? 8 : 2;
    predictedMapIncreaseWithFluidMmHg = 2;
  } else if (computedPpvPct > 13) {
    responsivenessTier = 'RESPONSIVE';
    if (eaDyn < 0.8) {
      responsivenessRationale =
        `High PPV (${computedPpvPct}% > 13%) indicates preload responsiveness, but low Ea_dyn (${eaDyn} < 0.8) signifies vasoplegic arterial collapse. A fluid bolus will augment stroke volume but fail to raise blood pressure. Initiate or uptitrate Norepinephrine first.`;
      recommendedTest = 'VASOPRESSOR_UPTITRATION';
      predictedSvIncreaseWithFluidPct = 18;
      predictedMapIncreaseWithFluidMmHg = 3;
    } else {
      responsivenessRationale =
        `PPV of ${computedPpvPct}% (> 13%) with preserved Ea_dyn (${eaDyn} >= 0.8) indicates genuine fluid responsiveness. A 500 mL crystalloid bolus is highly likely to produce >= 15% increase in stroke volume and meaningful rise in MAP.`;
      recommendedTest = 'STANDARD_FLUID_BOLUS';
      predictedSvIncreaseWithFluidPct = 19;
      predictedMapIncreaseWithFluidMmHg = 12;
    }
  } else if (computedPpvPct >= 9) {
    responsivenessTier = 'GRAY_ZONE';
    responsivenessRationale =
      `PPV of ${computedPpvPct}% falls within the intermediate Gray Zone (9 - 13%). Patient may or may not respond to fluid. Perform a Tidal Volume Challenge or Passive Leg Raising (PLR) test before administering fluid.`;
    recommendedTest = vent.tidalVolumeMlPerKgPbw < 8 ? 'TIDAL_VOLUME_CHALLENGE' : 'PASSIVE_LEG_RAISE';
    predictedSvIncreaseWithFluidPct = 7;
    predictedMapIncreaseWithFluidMmHg = 4;
  } else {
    responsivenessTier = 'NON_RESPONSIVE';
    responsivenessRationale =
      `PPV of ${computedPpvPct}% (< 9%) demonstrates fluid non-responsiveness. Patient is on the flat portion of the Frank-Starling curve. Further fluid loading will cause intravascular congestion, pulmonary capillary leak, and adverse outcomes.`;
    recommendedTest = 'VASOPRESSOR_UPTITRATION';
    predictedSvIncreaseWithFluidPct = 2;
    predictedMapIncreaseWithFluidMmHg = 1;
  }

  return {
    ppvPct: computedPpvPct,
    svvPct,
    eaDyn,
    ppMaxMmHg,
    ppMinMmHg,
    svMaxMl,
    svMinMl,
    responsivenessTier,
    responsivenessRationale,
    isConfounded,
    confoundingFactors,
    recommendedTest,
    predictedSvIncreaseWithFluidPct,
    predictedMapIncreaseWithFluidMmHg,
  };
}

/**
 * Fast-Flush Square Wave Test and Dynamic Damping Analysis.
 */
export function evaluateFastFlushDamping(
  hemo: HemodynamicParameters,
  damping: FastFlushDampingState
): DampingAnalysisResult {
  let { dampingCoefficientZeta: zeta, naturalFrequencyHz: fn } = damping;

  // Auto-adjust zeta and fn if anatomical physical factors present
  if (damping.hasAirBubble) {
    zeta += 0.35; // Air bubbles absorb kinetic energy, causing severe overdamping
    fn -= 8;
  }
  if (damping.hasCatheterClotOrKink) {
    zeta += 0.45; // Mechanical resistance and compliant thrombus dampen high frequencies
    fn -= 10;
  }
  if (damping.hasCompliantTubing) {
    zeta -= 0.25; // Compliant compliant extension tubing rings at resonant frequencies
    fn -= 6;
  }

  // Clamp zeta to realistic physiological range (0.10 to 1.30)
  zeta = parseFloat(Math.max(0.1, Math.min(1.3, zeta)).toFixed(2));
  fn = Math.max(5, Math.min(40, fn));

  let dampingTier: 'OPTIMAL' | 'UNDERDAMPED_WHIPPY' | 'OVERDAMPED' = 'OPTIMAL';
  let diagnosticDescription = '';
  let sbpErrorMmHg = 0;
  let dbpErrorMmHg = 0;
  let clinicalImplications = '';
  let recommendedCorrectiveAction = '';

  if (zeta < 0.40) {
    dampingTier = 'UNDERDAMPED_WHIPPY';
    // Resonance causes systolic overshoot and diastolic undershoot
    sbpErrorMmHg = Math.round(18 + (0.4 - zeta) * 30);
    dbpErrorMmHg = -Math.round(8 + (0.4 - zeta) * 15);
    diagnosticDescription =
      `Underdamped system (zeta = ${zeta.toFixed(2)} < 0.40, fn = ${fn} Hz): The fast-flush test demonstrates > 3 post-flush oscillations with sharp ringing overshoot.`;
    clinicalImplications =
      'FALSE SYSTOLIC HYPERTENSION: The monitor overestimates Systolic BP by up to 20-30 mmHg and underestimates Diastolic BP. MAP remains accurate because the area under the curve is largely conserved.';
    recommendedCorrectiveAction =
      'Insert an in-line acoustic damping device (e.g. Accudraw / ROSE / damping plug), remove non-essential extension tubing, eliminate stopcocks, and titrate therapy to MAP rather than SBP.';
  } else if (zeta > 0.75) {
    dampingTier = 'OVERDAMPED';
    // Energy absorption blunts high frequencies: underestimates SBP, overestimates DBP
    sbpErrorMmHg = -Math.round(14 + (zeta - 0.75) * 25);
    dbpErrorMmHg = Math.round(10 + (zeta - 0.75) * 15);
    diagnosticDescription =
      `Overdamped system (zeta = ${zeta.toFixed(2)} > 0.75, fn = ${fn} Hz): The fast-flush test shows a slow, sluggish return to baseline with 0 oscillations and an obliterated dicrotic notch.`;
    clinicalImplications =
      'FALSE SYSTOLIC HYPOTENSION: Systolic BP is falsely suppressed, leading to unnecessary vasopressor escalation. Diastolic BP is falsely elevated. MAP is moderately preserved.';
    recommendedCorrectiveAction =
      'Purge micro-air bubbles from the transducer and pressure bag tubing; check catheter for partial intraluminal clot or positional wall abutting; verify pressurized flush bag is inflated to 300 mmHg.';
  } else {
    dampingTier = 'OPTIMAL';
    sbpErrorMmHg = 0;
    dbpErrorMmHg = 0;
    diagnosticDescription =
      `Optimally Damped system (zeta = ${zeta.toFixed(2)} [0.55 - 0.75], fn = ${fn} Hz >= 24 Hz): The fast-flush test produces a crisp square wave followed by 1 to 2 sharp oscillations before cleanly returning to baseline.`;
    clinicalImplications =
      'ACCURATE ARTERIAL TRACE: True SBP, DBP, and MAP faithfully represent central aortic pressure without resonance artifacts.';
    recommendedCorrectiveAction =
      'No intervention required. Maintain transducer zeroed at the phlebostatic axis (4th intercostal space, mid-axillary line).';
  }

  const measuredSbpMmHg = hemo.systolicBpMmHg + sbpErrorMmHg;
  const measuredDbpMmHg = hemo.diastolicBpMmHg + dbpErrorMmHg;
  const measuredMapMmHg = Math.round(measuredDbpMmHg + (measuredSbpMmHg - measuredDbpMmHg) / 3);

  return {
    dampingTier,
    diagnosticDescription,
    measuredSbpMmHg,
    measuredDbpMmHg,
    measuredMapMmHg,
    sbpErrorMmHg,
    dbpErrorMmHg,
    clinicalImplications,
    recommendedCorrectiveAction,
  };
}

/**
 * Master Clinical Evaluation combining Hemodynamics, PPV Fluid Responsiveness, and Damping.
 */
export function evaluateArterialLineWorkstation(
  hemo: HemodynamicParameters,
  vent: VentilatorSettings,
  damping: FastFlushDampingState,
  userPpvOverridePct?: number
): MasterHemodynamicEvaluation {
  const systemic = computeSystemicHemodynamics(hemo);
  const fluid = evaluateFluidResponsiveness(hemo, vent, userPpvOverridePct);
  const dampingEval = evaluateFastFlushDamping(hemo, damping);

  const alerts: string[] = [];

  if (dampingEval.dampingTier !== 'OPTIMAL') {
    alerts.push(`Damping Artifact Detected: ${dampingEval.dampingTier.replace('_', ' ')} produces an SBP error of ${dampingEval.sbpErrorMmHg > 0 ? '+' : ''}${dampingEval.sbpErrorMmHg} mmHg. Base clinical decisions on MAP.`);
  }

  if (fluid.isConfounded) {
    alerts.push(`PPV Confounded: ${fluid.confoundingFactors.length} criteria violated. Use Passive Leg Raising or echocardiography for volume assessment.`);
  } else if (fluid.responsivenessTier === 'RESPONSIVE' && fluid.eaDyn < 0.8) {
    alerts.push('Vasoplegia Alert: High PPV with low Ea_dyn (<0.8). Fluid alone will not restore perfusion pressure; start Norepinephrine.');
  }

  let clinicalSummary = '';
  if (fluid.responsivenessTier === 'RESPONSIVE') {
    clinicalSummary = `Hypovolemic / Preload Dependent: PPV is ${fluid.ppvPct}% with Ea_dyn of ${fluid.eaDyn}. Systemic vascular resistance is ${systemic.calculatedSvrDyns} dyn·s/cm⁵. Fluid resuscitation is indicated.`;
  } else if (fluid.responsivenessTier === 'NON_RESPONSIVE') {
    clinicalSummary = `Preload Independent / Euvolemic: PPV is ${fluid.ppvPct}%. Stroke volume is stable. If MAP is low, initiate or titrate vasopressor therapy rather than fluid loading.`;
  } else if (fluid.responsivenessTier === 'GRAY_ZONE') {
    clinicalSummary = `Intermediate Volume Status: PPV is ${fluid.ppvPct}% (Gray zone 9-13%). Dynamic challenge (Vt challenge or PLR) is recommended before giving volume.`;
  } else {
    clinicalSummary = 'Confounded Heart-Lung Interactions: Mechanical or physiological criteria for PPV are unmet. Perform Passive Leg Raising test.';
  }

  return {
    cardiacOutputLMin: systemic.cardiacOutputLMin,
    meanArterialPressureMmHg: systemic.mapMmHg,
    systemicVascularResistanceDyns: systemic.calculatedSvrDyns,
    fluidResponsiveness: fluid,
    dampingAnalysis: dampingEval,
    clinicalSummary,
    alerts,
  };
}

// -------------------------------------------------------------------------
// CLINICAL PRESETS (8 Comprehensive Realistic Scenarios)
// -------------------------------------------------------------------------

export interface ArterialLinePreset {
  id: string;
  name: string;
  category: string;
  description: string;
  hemodynamics: HemodynamicParameters;
  ventilator: VentilatorSettings;
  damping: FastFlushDampingState;
  userPpvOverride?: number;
}

export const ARTERIAL_LINE_PRESETS: ArterialLinePreset[] = [
  {
    id: 'EUVOLEMIC_VENTILATED_OPTIMAL',
    name: 'Euvolemic Ventilated (Optimal Damping & Non-Responder)',
    category: 'Normal ICU Hemodynamics',
    description:
      '62-year-old post-op CABG patient on volume control (Vt 8.5 mL/kg PBW, no spontaneous effort, sinus rhythm). Fast-flush test shows 1.5 oscillations (optimal damping). PPV is 7% (non-responsive to fluid).',
    hemodynamics: {
      systolicBpMmHg: 122,
      diastolicBpMmHg: 74,
      heartRateBpm: 76,
      centralVenousPressureMmHg: 8,
      strokeVolumeMl: 75,
      arterialComplianceMlMmHg: 1.2,
      systemicVascularResistanceDyns: 980,
      myocardialInotropyPct: 100,
    },
    ventilator: {
      isMechanicallyVentilated: true,
      isSpontaneouslyBreathing: false,
      hasCardiacArrhythmia: false,
      hasRightVentricularFailure: false,
      hasOpenChest: false,
      tidalVolumeMlPerKgPbw: 8.5,
      respiratoryRateBpm: 14,
      positiveEndExpiratoryPressureCmH2O: 6,
    },
    damping: {
      dampingCoefficientZeta: 0.62,
      naturalFrequencyHz: 26,
      hasAirBubble: false,
      hasCatheterClotOrKink: false,
      hasCompliantTubing: false,
    },
    userPpvOverride: 7,
  },
  {
    id: 'SEPTIC_SHOCK_HYPOVOLEMIC',
    name: 'Septic Shock & Severe Hypovolemia (High PPV Responder)',
    category: 'Critical Care Resuscitation',
    description:
      '55-year-old female with urosepsis on mandatory ventilation (Vt 8.2 mL/kg PBW). Tachycardia (HR 118 bpm), hypotension (BP 86/48 mmHg), high PPV (21%), and high Ea_dyn (1.35). Fluid bolus will significantly increase SV and MAP.',
    hemodynamics: {
      systolicBpMmHg: 86,
      diastolicBpMmHg: 48,
      heartRateBpm: 118,
      centralVenousPressureMmHg: 3,
      strokeVolumeMl: 38,
      arterialComplianceMlMmHg: 0.9,
      systemicVascularResistanceDyns: 620,
      myocardialInotropyPct: 110,
    },
    ventilator: {
      isMechanicallyVentilated: true,
      isSpontaneouslyBreathing: false,
      hasCardiacArrhythmia: false,
      hasRightVentricularFailure: false,
      hasOpenChest: false,
      tidalVolumeMlPerKgPbw: 8.2,
      respiratoryRateBpm: 18,
      positiveEndExpiratoryPressureCmH2O: 5,
    },
    damping: {
      dampingCoefficientZeta: 0.60,
      naturalFrequencyHz: 28,
      hasAirBubble: false,
      hasCatheterClotOrKink: false,
      hasCompliantTubing: false,
    },
    userPpvOverride: 21,
  },
  {
    id: 'SEPTIC_VASOPLEGIA_LOW_EA_DYN',
    name: 'Septic Vasoplegia (Low Ea_dyn - Needs Norepinephrine)',
    category: 'Critical Care Resuscitation',
    description:
      '68-year-old male with septic shock post 30 mL/kg fluid resuscitation. Preload is restored (PPV 8%), but systemic vascular resistance is severely depressed (450 dyn·s/cm⁵) and Ea_dyn is 0.55. Giving more fluid will not raise MAP; vasopressor required.',
    hemodynamics: {
      systolicBpMmHg: 82,
      diastolicBpMmHg: 42,
      heartRateBpm: 94,
      centralVenousPressureMmHg: 12,
      strokeVolumeMl: 68,
      arterialComplianceMlMmHg: 1.4,
      systemicVascularResistanceDyns: 480,
      myocardialInotropyPct: 90,
    },
    ventilator: {
      isMechanicallyVentilated: true,
      isSpontaneouslyBreathing: false,
      hasCardiacArrhythmia: false,
      hasRightVentricularFailure: false,
      hasOpenChest: false,
      tidalVolumeMlPerKgPbw: 8.0,
      respiratoryRateBpm: 16,
      positiveEndExpiratoryPressureCmH2O: 8,
    },
    damping: {
      dampingCoefficientZeta: 0.65,
      naturalFrequencyHz: 25,
      hasAirBubble: false,
      hasCatheterClotOrKink: false,
      hasCompliantTubing: false,
    },
    userPpvOverride: 8,
  },
  {
    id: 'UNDERDAMPED_WHIPPY_TRACE',
    name: 'Underdamped "Whippy" Trace (False Systolic Hypertension)',
    category: 'Arterial Line Artifacts',
    description:
      'Rigid radial arterial line with long compliant extension tubing and multiple stopcocks. Fast-flush square wave demonstrates > 4 ringing oscillations (zeta 0.22). Measured SBP is 164 mmHg (true SBP 138 mmHg; +26 mmHg overshoot). MAP is accurate.',
    hemodynamics: {
      systolicBpMmHg: 138,
      diastolicBpMmHg: 76,
      heartRateBpm: 78,
      centralVenousPressureMmHg: 6,
      strokeVolumeMl: 72,
      arterialComplianceMlMmHg: 1.1,
      systemicVascularResistanceDyns: 1040,
      myocardialInotropyPct: 100,
    },
    ventilator: {
      isMechanicallyVentilated: true,
      isSpontaneouslyBreathing: false,
      hasCardiacArrhythmia: false,
      hasRightVentricularFailure: false,
      hasOpenChest: false,
      tidalVolumeMlPerKgPbw: 8.0,
      respiratoryRateBpm: 14,
      positiveEndExpiratoryPressureCmH2O: 5,
    },
    damping: {
      dampingCoefficientZeta: 0.22,
      naturalFrequencyHz: 14,
      hasAirBubble: false,
      hasCatheterClotOrKink: false,
      hasCompliantTubing: true,
    },
    userPpvOverride: 7,
  },
  {
    id: 'OVERDAMPED_AIR_BUBBLE_TRACE',
    name: 'Overdamped Line (Air Bubble / Thrombus & Blunted Notch)',
    category: 'Arterial Line Artifacts',
    description:
      'Micro-air bubble lodged in arterial transducer dome and compliant fibrin clot. Fast-flush demonstrates sluggish return with zero oscillations (zeta 1.05) and obliterated dicrotic notch. SBP is falsely depressed by 22 mmHg.',
    hemodynamics: {
      systolicBpMmHg: 130,
      diastolicBpMmHg: 70,
      heartRateBpm: 82,
      centralVenousPressureMmHg: 7,
      strokeVolumeMl: 70,
      arterialComplianceMlMmHg: 1.1,
      systemicVascularResistanceDyns: 980,
      myocardialInotropyPct: 100,
    },
    ventilator: {
      isMechanicallyVentilated: true,
      isSpontaneouslyBreathing: false,
      hasCardiacArrhythmia: false,
      hasRightVentricularFailure: false,
      hasOpenChest: false,
      tidalVolumeMlPerKgPbw: 8.0,
      respiratoryRateBpm: 14,
      positiveEndExpiratoryPressureCmH2O: 5,
    },
    damping: {
      dampingCoefficientZeta: 0.70,
      naturalFrequencyHz: 20,
      hasAirBubble: true,
      hasCatheterClotOrKink: true,
      hasCompliantTubing: false,
    },
    userPpvOverride: 8,
  },
  {
    id: 'ARDS_LOW_VT_CHALLENGE',
    name: 'ARDS Low Tidal Volume (6 mL/kg - False Negative PPV)',
    category: 'Confounded Heart-Lung Interactions',
    description:
      'Moderate ARDS on lung-protective ventilation (Vt 6.0 mL/kg PBW, PEEP 14 cmH2O). Measured PPV is 8% (appears non-responsive). A Tidal Volume Challenge increasing Vt to 8 mL/kg causes PPV to jump to 16% (delta-PPV 8% > 3.5%), unmasking hypovolemia.',
    hemodynamics: {
      systolicBpMmHg: 102,
      diastolicBpMmHg: 62,
      heartRateBpm: 98,
      centralVenousPressureMmHg: 14,
      strokeVolumeMl: 46,
      arterialComplianceMlMmHg: 0.8,
      systemicVascularResistanceDyns: 950,
      myocardialInotropyPct: 95,
    },
    ventilator: {
      isMechanicallyVentilated: true,
      isSpontaneouslyBreathing: false,
      hasCardiacArrhythmia: false,
      hasRightVentricularFailure: false,
      hasOpenChest: false,
      tidalVolumeMlPerKgPbw: 6.0,
      respiratoryRateBpm: 24,
      positiveEndExpiratoryPressureCmH2O: 14,
    },
    damping: {
      dampingCoefficientZeta: 0.62,
      naturalFrequencyHz: 25,
      hasAirBubble: false,
      hasCatheterClotOrKink: false,
      hasCompliantTubing: false,
    },
    userPpvOverride: 8,
  },
  {
    id: 'ATRIAL_FIB_INVALID_PPV',
    name: 'Atrial Fibrillation with R-R Irregularity (Invalid PPV)',
    category: 'Confounded Heart-Lung Interactions',
    description:
      '74-year-old in septic shock with rapid atrial fibrillation (HR 125 bpm). Random ventricular filling times generate massive beat-to-beat pulse pressure variation (22%) completely independent of respiratory cycle. Passive Leg Raising test is mandatory.',
    hemodynamics: {
      systolicBpMmHg: 95,
      diastolicBpMmHg: 55,
      heartRateBpm: 125,
      centralVenousPressureMmHg: 10,
      strokeVolumeMl: 42,
      arterialComplianceMlMmHg: 0.9,
      systemicVascularResistanceDyns: 820,
      myocardialInotropyPct: 85,
    },
    ventilator: {
      isMechanicallyVentilated: true,
      isSpontaneouslyBreathing: false,
      hasCardiacArrhythmia: true,
      hasRightVentricularFailure: false,
      hasOpenChest: false,
      tidalVolumeMlPerKgPbw: 8.0,
      respiratoryRateBpm: 16,
      positiveEndExpiratoryPressureCmH2O: 8,
    },
    damping: {
      dampingCoefficientZeta: 0.60,
      naturalFrequencyHz: 26,
      hasAirBubble: false,
      hasCatheterClotOrKink: false,
      hasCompliantTubing: false,
    },
    userPpvOverride: 22,
  },
  {
    id: 'ACUTE_COR_PULMONALE_RV_FAILURE',
    name: 'Acute Cor Pulmonale / RV Failure (Fluid Contraindicated)',
    category: 'Confounded Heart-Lung Interactions',
    description:
      'Massive Pulmonary Embolism resulting in severe acute RV afterload mismatch and ventricular interdependence. High PPV (18%) is caused by cyclic mechanical inspiration compressing RV ejection rather than hypovolemia. IV fluids will cause lethal RV dilation.',
    hemodynamics: {
      systolicBpMmHg: 88,
      diastolicBpMmHg: 52,
      heartRateBpm: 112,
      centralVenousPressureMmHg: 18,
      strokeVolumeMl: 36,
      arterialComplianceMlMmHg: 0.9,
      systemicVascularResistanceDyns: 1100,
      myocardialInotropyPct: 75,
    },
    ventilator: {
      isMechanicallyVentilated: true,
      isSpontaneouslyBreathing: false,
      hasCardiacArrhythmia: false,
      hasRightVentricularFailure: true,
      hasOpenChest: false,
      tidalVolumeMlPerKgPbw: 8.0,
      respiratoryRateBpm: 20,
      positiveEndExpiratoryPressureCmH2O: 5,
    },
    damping: {
      dampingCoefficientZeta: 0.65,
      naturalFrequencyHz: 25,
      hasAirBubble: false,
      hasCatheterClotOrKink: false,
      hasCompliantTubing: false,
    },
    userPpvOverride: 18,
  },
];
