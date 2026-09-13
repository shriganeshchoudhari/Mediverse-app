/**
 * CardiogenicShockEngine.ts
 * Precision Hemodynamics & Mechanical Circulatory Support (MCS) Engine.
 * Implements SCAI Shock Staging (2019/2022 Update), Biventricular Hemodynamic Indices (CPO, PAPi, PVR, SVR),
 * Vasoactive Inotropic Score (VIS), and Device Escalation (IABP, Impella CP/5.5, VA-ECMO, ECPELLA).
 * Location: frontend/.gemini/skills/CardiogenicShockEngine.ts
 */

export type ScaiStage = 'A' | 'B' | 'C' | 'D' | 'E';

export type ShockEtiology =
  | 'acute_mi_anterior'
  | 'acute_mi_inferior_rv'
  | 'acute_decompensated_hf'
  | 'fulminant_myocarditis'
  | 'post_cardiotomy_shock'
  | 'acute_mr_papillary_rupture';

export type McsDeviceType =
  | 'none'
  | 'iabp_counterpulsation'
  | 'impella_cp'
  | 'impella_5_5'
  | 'tandem_heart'
  | 'va_ecmo'
  | 'ecpella_combined'
  | 'impella_rp_rv_support';

export interface HemodynamicProfile {
  systolicBpMmHg: number;
  diastolicBpMmHg: number;
  meanArterialPressureMmHg: number;
  heartRateBpm: number;
  cardiacOutputLpm: number;
  cardiacIndexLpmM2: number;
  bodySurfaceAreaM2: number;
  centralVenousPressureMmHg: number;
  meanPulmonaryArteryPressureMmHg: number;
  pulmonaryArterySystolicMmHg: number;
  pulmonaryArteryDiastolicMmHg: number;
  pulmonaryCapillaryWedgePressureMmHg: number;
  arterialLactateMmolL: number;
  mixedVenousSatSvo2Percent: number;
  urineOutputMlKgHr: number;
  hasCardiacArrestModifier: boolean;
}

export interface InotropeVasopressorDoses {
  norepinephrineMcgKgMin: number; // 0 - 1.0
  epinephrineMcgKgMin: number; // 0 - 1.0
  dobutamineMcgKgMin: number; // 0 - 20.0
  milrinoneMcgKgMin: number; // 0 - 0.75
  vasopressinUnitsMin: number; // 0 - 0.04
  dopamineMcgKgMin: number; // 0 - 20.0
}

export interface ComputedHemodynamics {
  cardiacPowerOutputWatts: number;
  cardiacPowerIndexWattsM2: number;
  pulmonaryArteryPulsatilityIndex: number;
  systemicVascularResistanceDyneSecCm5: number;
  pulmonaryVascularResistanceWoodUnits: number;
  transpulmonaryGradientMmHg: number;
  cvpToPcwpRatio: number;
  vasoactiveInotropicScore: number;
}

export interface ScaiClassificationReport {
  stage: ScaiStage;
  stageName: string;
  stageWithModifier: string;
  hasCardiacArrestModifier: boolean;
  criteriaMet: string[];
  mortalityRiskPercent: number;
  clinicalDescription: string;
  recommendedCareSetting: string;
}

export interface RvFailureAudit {
  isRvFailurePresent: boolean;
  rvFailureSeverity: 'None' | 'Mild RV Strain' | 'Moderate RV Dysfunction' | 'Severe Biventricular Collapse';
  papiValue: number;
  cvpToPcwpRatio: number;
  findings: string[];
  warningNote: string;
}

export interface McsEscalationRecommendation {
  indicatedDevices: McsDeviceType[];
  primaryDevice: McsDeviceType;
  deviceRationale: string;
  lvUnloadingRequired: boolean;
  rvSupportRequired: boolean;
  contraindications: string[];
  hemodynamicTargets: string[];
}

export interface CardiogenicShockScenario {
  id: string;
  name: string;
  patientSummary: string;
  etiology: ShockEtiology;
  initialHemodynamics: HemodynamicProfile;
  initialVasoactives: InotropeVasopressorDoses;
  initialDevice: McsDeviceType;
  clinicalPearls: string[];
}

/**
 * 1. Compute Derived Hemodynamic Parameters
 */
export function computeHemodynamics(
  hemo: HemodynamicProfile,
  drugs: InotropeVasopressorDoses
): ComputedHemodynamics {
  const map = hemo.meanArterialPressureMmHg;
  const co = hemo.cardiacOutputLpm;
  const ci = hemo.cardiacIndexLpmM2;
  const cvp = hemo.centralVenousPressureMmHg;
  const mpap = hemo.meanPulmonaryArteryPressureMmHg;
  const pasp = hemo.pulmonaryArterySystolicMmHg;
  const padp = hemo.pulmonaryArteryDiastolicMmHg;
  const pcwp = hemo.pulmonaryCapillaryWedgePressureMmHg;

  // Cardiac Power Output (Fincke et al. JACC 2004)
  // CPO (Watts) = (MAP x CO) / 451
  const cardiacPowerOutputWatts = parseFloat(((map * co) / 451).toFixed(2));
  const cardiacPowerIndexWattsM2 = parseFloat(((map * ci) / 451).toFixed(2));

  // Pulmonary Artery Pulsatility Index: PAPi = (PASP - PADP) / CVP
  // Guard against divide-by-zero or non-positive CVP
  const effectiveCvp = Math.max(1, cvp);
  const pulmonaryArteryPulsatilityIndex = parseFloat(((pasp - padp) / effectiveCvp).toFixed(2));

  // Systemic Vascular Resistance: SVR = ((MAP - CVP) * 80) / CO
  const effectiveCo = Math.max(0.5, co);
  const systemicVascularResistanceDyneSecCm5 = Math.round(((map - cvp) * 80) / effectiveCo);

  // Pulmonary Vascular Resistance: PVR = (mPAP - PCWP) / CO (Wood Units)
  const transpulmonaryGradientMmHg = Math.max(0, mpap - pcwp);
  const pulmonaryVascularResistanceWoodUnits = parseFloat((transpulmonaryGradientMmHg / effectiveCo).toFixed(2));

  // CVP / PCWP Ratio
  const effectivePcwp = Math.max(1, pcwp);
  const cvpToPcwpRatio = parseFloat((cvp / effectivePcwp).toFixed(2));

  // Vasoactive-Inotropic Score (VIS):
  // VIS = Dopamine + Dobutamine + 100 * Epinephrine + 100 * Norepinephrine + 10 * Milrinone + 10000 * Vasopressin
  const vasoactiveInotropicScore = Math.round(
    drugs.dopamineMcgKgMin +
      drugs.dobutamineMcgKgMin +
      100 * drugs.epinephrineMcgKgMin +
      100 * drugs.norepinephrineMcgKgMin +
      10 * drugs.milrinoneMcgKgMin +
      10000 * drugs.vasopressinUnitsMin
  );

  return {
    cardiacPowerOutputWatts,
    cardiacPowerIndexWattsM2,
    pulmonaryArteryPulsatilityIndex,
    systemicVascularResistanceDyneSecCm5,
    pulmonaryVascularResistanceWoodUnits,
    transpulmonaryGradientMmHg,
    cvpToPcwpRatio,
    vasoactiveInotropicScore,
  };
}

/**
 * 2. Classify SCAI Shock Stage (2019 / 2022 Update)
 */
export function classifyScaiStage(
  hemo: HemodynamicProfile,
  drugs: InotropeVasopressorDoses,
  currentDevice: McsDeviceType
): ScaiClassificationReport {
  const criteriaMet: string[] = [];
  const vis = computeHemodynamics(hemo, drugs).vasoactiveInotropicScore;
  const numVasoactives = [
    drugs.norepinephrineMcgKgMin > 0,
    drugs.epinephrineMcgKgMin > 0,
    drugs.dobutamineMcgKgMin > 0,
    drugs.milrinoneMcgKgMin > 0,
    drugs.vasopressinUnitsMin > 0,
  ].filter(Boolean).length;

  // Check Extremis (Stage E)
  // Severe circulatory collapse, ongoing CPR, refractory PEA/VT arrest, lactate >= 8.0
  const isExtremis =
    hemo.arterialLactateMmolL >= 8.0 ||
    (hemo.systolicBpMmHg < 65 && numVasoactives >= 2) ||
    (hemo.cardiacIndexLpmM2 < 1.2 && hemo.arterialLactateMmolL >= 5.0);

  // Check Deteriorating / Refractory (Stage D)
  // Escalating vasoactives (>= 3 agents or VIS >= 30 or Norepi >= 0.3 or refractory to device)
  const isDeteriorating =
    !isExtremis &&
    (numVasoactives >= 3 ||
      vis >= 30 ||
      drugs.norepinephrineMcgKgMin >= 0.35 ||
      (currentDevice !== 'none' && hemo.arterialLactateMmolL >= 4.0) ||
      (numVasoactives >= 2 && hemo.arterialLactateMmolL >= 5.0));

  // Check Classic Cardiogenic Shock (Stage C)
  // Manifest hypoperfusion (Lactate >= 2.0 or oliguria < 0.5) with low CI / elevated PCWP,
  // OR active vasoactive / mechanical support to maintain perfusion
  const hasActiveSupport = numVasoactives > 0 || currentDevice !== 'none';
  const hasEndOrganHypoperfusion = hemo.arterialLactateMmolL >= 2.0 || hemo.urineOutputMlKgHr < 0.5;

  const isClassicShock =
    !isExtremis &&
    !isDeteriorating &&
    (hasActiveSupport ||
      (hasEndOrganHypoperfusion && (hemo.cardiacIndexLpmM2 < 2.2 || hemo.systolicBpMmHg < 90 || hemo.meanArterialPressureMmHg < 65)));

  // Check Beginning / Pre-Shock (Stage B)
  // SBP < 90 or MAP < 65 or HR >= 100, but NORMAL lactate (< 2.0), preserved organ perfusion, no inotropes
  const isBeginningShock =
    !isExtremis &&
    !isDeteriorating &&
    !isClassicShock &&
    (hemo.systolicBpMmHg < 90 || hemo.meanArterialPressureMmHg < 65 || hemo.heartRateBpm >= 100);

  let stage: ScaiStage = 'A';
  let stageName = 'Stage A (At Risk)';
  let mortalityRiskPercent = 3;
  let clinicalDescription =
    'Patient is clinically euvolemic and normotensive without evidence of hypoperfusion, but has an acute cardiac insult placing them at high risk for decompensation.';
  let recommendedCareSetting = 'Telemetry or Coronary Care Unit (CCU) observation';

  if (isExtremis) {
    stage = 'E';
    stageName = 'Stage E (Extremis)';
    mortalityRiskPercent = 67;
    clinicalDescription =
      'Circulatory collapse or near-arrest with profound uncorrectable lactic acidosis, multi-organ failure, and imminent refractory cardiac arrest.';
    recommendedCareSetting = 'Cardiac Intensive Care Unit (CICU) / Cath Lab / STAT ECMO Cannulation';
    criteriaMet.push(`Critical hyperlactatemia (${hemo.arterialLactateMmolL} mmol/L >= 8.0)`);
    if (hemo.systolicBpMmHg < 65) criteriaMet.push(`Profound hypotension (SBP ${hemo.systolicBpMmHg} < 65 mmHg)`);
  } else if (isDeteriorating) {
    stage = 'D';
    stageName = 'Stage D (Deteriorating)';
    mortalityRiskPercent = 40;
    clinicalDescription =
      'Failure to respond or stabilize despite initial therapy; ongoing hypoperfusion with escalating vasoactive requirements or failed mechanical support.';
    recommendedCareSetting = 'CICU with emergent invasive MCS device escalation';
    criteriaMet.push(`Multiple vasoactive dependence (${numVasoactives} active agents, VIS ${vis})`);
    criteriaMet.push(`Persistent hypoperfusion (Lactate ${hemo.arterialLactateMmolL} mmol/L)`);
  } else if (isClassicShock) {
    stage = 'C';
    stageName = 'Stage C (Classic Shock)';
    mortalityRiskPercent = 22;
    clinicalDescription =
      'Manifest hypoperfusion with congestion (Cold & Wet) requiring vasoactive inotropic or mechanical support to maintain perfusion pressure.';
    recommendedCareSetting = 'Cardiac ICU with pulmonary artery catheter (Swan-Ganz) monitoring';
    if (hemo.arterialLactateMmolL >= 2.0) criteriaMet.push(`Lactic acidosis (${hemo.arterialLactateMmolL} mmol/L >= 2.0)`);
    if (hemo.cardiacIndexLpmM2 < 2.2) criteriaMet.push(`Depressed cardiac index (${hemo.cardiacIndexLpmM2} L/min/m2 < 2.2)`);
    if (numVasoactives > 0) criteriaMet.push(`Vasoactive support active (${numVasoactives} agents)`);
  } else if (isBeginningShock) {
    stage = 'B';
    stageName = 'Stage B (Beginning Shock)';
    mortalityRiskPercent = 8;
    clinicalDescription =
      'Hemodynamic instability (hypotension or compensatory tachycardia) without clinical or biochemical evidence of tissue hypoperfusion.';
    recommendedCareSetting = 'Coronary Care Unit with close invasive arterial line monitoring';
    if (hemo.systolicBpMmHg < 90) criteriaMet.push(`Relative hypotension (SBP ${hemo.systolicBpMmHg} < 90 mmHg)`);
    if (hemo.heartRateBpm >= 100) criteriaMet.push(`Compensatory tachycardia (HR ${hemo.heartRateBpm} >= 100 bpm)`);
  } else {
    criteriaMet.push('Normotensive and compensated; at risk due to underlying cardiac etiology');
  }

  // Adjust mortality for Cardiac Arrest modifier
  if (hemo.hasCardiacArrestModifier) {
    mortalityRiskPercent = Math.min(95, Math.round(mortalityRiskPercent * 1.6 + 10));
    criteriaMet.push('Cardiac Arrest Modifier (+A): Resuscitated out-of-hospital or in-hospital cardiac arrest');
  }

  const stageWithModifier = hemo.hasCardiacArrestModifier ? `Stage ${stage}_CA` : `Stage ${stage}`;

  return {
    stage,
    stageName,
    stageWithModifier,
    hasCardiacArrestModifier: hemo.hasCardiacArrestModifier,
    criteriaMet,
    mortalityRiskPercent,
    clinicalDescription,
    recommendedCareSetting,
  };
}

/**
 * 3. Right Ventricular Failure Audit (PAPi & CVP/PCWP)
 */
export function auditRvFailure(hemo: HemodynamicProfile): RvFailureAudit {
  const hemoMetrics = computeHemodynamics(hemo, {
    norepinephrineMcgKgMin: 0,
    epinephrineMcgKgMin: 0,
    dobutamineMcgKgMin: 0,
    milrinoneMcgKgMin: 0,
    vasopressinUnitsMin: 0,
    dopamineMcgKgMin: 0,
  });

  const { pulmonaryArteryPulsatilityIndex: papi, cvpToPcwpRatio } = hemoMetrics;
  const { centralVenousPressureMmHg: cvp, pulmonaryCapillaryWedgePressureMmHg: pcwp } = hemo;

  const findings: string[] = [];
  let isRvFailurePresent = false;
  let rvFailureSeverity: RvFailureAudit['rvFailureSeverity'] = 'None';

  if (papi < 0.9) {
    isRvFailurePresent = true;
    rvFailureSeverity = 'Severe Biventricular Collapse';
    findings.push(`Critical PAPi (${papi} < 0.9): Severe right ventricular systolic pump exhaustion.`);
  } else if (papi < 1.2) {
    isRvFailurePresent = true;
    rvFailureSeverity = 'Moderate RV Dysfunction';
    findings.push(`Borderline/Low PAPi (${papi} < 1.2): Significant RV contractility impairment.`);
  } else if (papi < 1.8) {
    rvFailureSeverity = 'Mild RV Strain';
    findings.push(`Mild RV Strain (PAPi ${papi} between 1.2 and 1.8).`);
  } else {
    findings.push(`Normal RV contractile reserve (PAPi ${papi} >= 1.8).`);
  }

  if (cvpToPcwpRatio > 0.8) {
    isRvFailurePresent = true;
    findings.push(`Elevated CVP/PCWP ratio (${cvpToPcwpRatio} > 0.8): Disproportionate right atrial volume overload.`);
  }

  if (cvp >= 15) {
    findings.push(`Severe systemic venous congestion (CVP ${cvp} >= 15 mmHg).`);
  }

  let warningNote = 'Right ventricular function is adequate to sustain LV preload.';
  if (isRvFailurePresent) {
    warningNote =
      'WARNING: Concomitant Right Ventricular Failure detected. Isolated left-sided microaxial unloading (Impella CP) without adequate RV forward flow will cause cannula suction alarms and LV underfilling. Consider biventricular support (Impella RP + Impella CP, or VA-ECMO).';
  }

  return {
    isRvFailurePresent,
    rvFailureSeverity,
    papiValue: papi,
    cvpToPcwpRatio,
    findings,
    warningNote,
  };
}

/**
 * 4. Mechanical Circulatory Support (MCS) Escalation Recommendation
 */
export function recommendMcsEscalation(
  hemo: HemodynamicProfile,
  drugs: InotropeVasopressorDoses,
  currentDevice: McsDeviceType
): McsEscalationRecommendation {
  const metrics = computeHemodynamics(hemo, drugs);
  const scai = classifyScaiStage(hemo, drugs, currentDevice);
  const rvAudit = auditRvFailure(hemo);

  const indicatedDevices: McsDeviceType[] = [];
  let primaryDevice: McsDeviceType = 'none';
  let deviceRationale = '';
  let lvUnloadingRequired = false;
  let rvSupportRequired = rvAudit.isRvFailurePresent;
  const contraindications: string[] = [];
  const hemodynamicTargets: string[] = [
    'Target Cardiac Power Output (CPO) > 0.60 Watts',
    'Target Cardiac Index > 2.2 L/min/m2',
    'Target Mean Arterial Pressure (MAP) 65 - 80 mmHg',
    'Target PCWP < 18 mmHg (decompress left ventricle)',
    'Target Arterial Lactate < 2.0 mmol/L and clearance > 20% every 2 hours',
  ];

  // Stage A / B: No immediate mechanical support unless rapid deterioration
  if (scai.stage === 'A' || scai.stage === 'B') {
    primaryDevice = 'none';
    deviceRationale =
      'Mechanical support is not currently indicated for SCAI Stage A/B. Optimize coronary perfusion, maintain rhythm stability, and monitor serial lactate.';
    return {
      indicatedDevices: ['none'],
      primaryDevice,
      deviceRationale,
      lvUnloadingRequired: false,
      rvSupportRequired: false,
      contraindications,
      hemodynamicTargets,
    };
  }

  // Stage E or Refractory Arrest: VA-ECMO or ECPELLA
  if (scai.stage === 'E' || (hemo.arterialLactateMmolL >= 8.0 && metrics.cardiacPowerOutputWatts < 0.5)) {
    indicatedDevices.push('va_ecmo', 'ecpella_combined');
    primaryDevice = 'ecpella_combined';
    lvUnloadingRequired = true;
    deviceRationale =
      'SCAI Stage E (Extremis) or catastrophic shock mandates emergent Veno-Arterial ECMO for full biventricular and cardiopulmonary resuscitation. Because retrograde ECMO aortic flow increases LV afterload, concomitant LV venting with Impella (ECPELLA) is mandatory to prevent massive pulmonary edema and LV cavity thrombosis.';
    return {
      indicatedDevices,
      primaryDevice,
      deviceRationale,
      lvUnloadingRequired,
      rvSupportRequired,
      contraindications,
      hemodynamicTargets,
    };
  }

  // Stage C or D: Unloading and Perfusion Restoration
  // Check DanGer Shock trial criteria: STEMI cardiogenic shock with CPO < 0.6 W
  if (rvAudit.isRvFailurePresent) {
    indicatedDevices.push('ecpella_combined', 'va_ecmo', 'impella_rp_rv_support');
    primaryDevice = 'ecpella_combined';
    lvUnloadingRequired = true;
    deviceRationale =
      'Biventricular shock pattern (severely depressed CPO + low PAPi). Microaxial LV pump alone would suffer inflow starvation. Primary indication for ECPELLA or VA-ECMO with LV unloading to support both right and left ventricles.';
  } else {
    indicatedDevices.push('impella_cp', 'impella_5_5', 'iabp_counterpulsation');
    primaryDevice = 'impella_cp';
    lvUnloadingRequired = true;
    deviceRationale =
      'Isolated Left Ventricular failure with adequate RV reserve (PAPi > 1.2). DanGer Shock trial (NEJM 2024) demonstrates survival advantage for early microaxial LV unloading (Impella CP) in STEMI cardiogenic shock, directly reducing LV end-diastolic pressure and myocardial oxygen demand while generating up to 3.5 - 4.0 L/min of forward systemic flow.';
  }

  return {
    indicatedDevices,
    primaryDevice,
    deviceRationale,
    lvUnloadingRequired,
    rvSupportRequired,
    contraindications,
    hemodynamicTargets,
  };
}

/**
 * 5. Standard Clinical Scenarios Catalog
 */
export const SHOCK_SCENARIOS: Record<string, CardiogenicShockScenario> = {
  anterior_stemi_stage_c: {
    id: 'anterior_stemi_stage_c',
    name: '1. Massive Anterior STEMI with Classic Shock (SCAI Stage C)',
    patientSummary:
      '62yo male 4 hours post-proximal LAD occlusion. SBP 82/54 (MAP 63), HR 118 bpm, CI 1.6 L/min/m2, PCWP 26 mmHg, CPO 0.49 W, Arterial Lactate 3.8 mmol/L on Norepinephrine 0.15 mcg/kg/min.',
    etiology: 'acute_mi_anterior',
    initialHemodynamics: {
      systolicBpMmHg: 82,
      diastolicBpMmHg: 54,
      meanArterialPressureMmHg: 63,
      heartRateBpm: 118,
      cardiacOutputLpm: 3.2,
      cardiacIndexLpmM2: 1.6,
      bodySurfaceAreaM2: 2.0,
      centralVenousPressureMmHg: 12,
      meanPulmonaryArteryPressureMmHg: 36,
      pulmonaryArterySystolicMmHg: 48,
      pulmonaryArteryDiastolicMmHg: 28,
      pulmonaryCapillaryWedgePressureMmHg: 26,
      arterialLactateMmolL: 3.8,
      mixedVenousSatSvo2Percent: 52,
      urineOutputMlKgHr: 0.3,
      hasCardiacArrestModifier: false,
    },
    initialVasoactives: {
      norepinephrineMcgKgMin: 0.15,
      epinephrineMcgKgMin: 0,
      dobutamineMcgKgMin: 5.0,
      milrinoneMcgKgMin: 0,
      vasopressinUnitsMin: 0,
      dopamineMcgKgMin: 0,
    },
    initialDevice: 'none',
    clinicalPearls: [
      'CPO is 0.49 Watts (< 0.60 W threshold predicting high in-hospital mortality).',
      'PAPi is (48 - 28) / 12 = 1.67 (> 1.2), indicating preserved RV reserve suitable for isolated LV microaxial unloading.',
      'DanGer Shock trial protocol supports early Impella CP placement before or during primary PCI to reduce infarct size and restore systemic flow.',
    ],
  },
  biventricular_inferior_rv_mi: {
    id: 'biventricular_inferior_rv_mi',
    name: '2. Proximal RCA Occlusion with Biventricular Shock & Severe RV Failure',
    patientSummary:
      '57yo female with acute inferior STEMI and proximal RCA occlusion. SBP 78/48 (MAP 58), HR 92 bpm, CVP 20 mmHg, PCWP 18 mmHg, PASP 32, PADP 18, Lactate 4.6 mmol/L.',
    etiology: 'acute_mi_inferior_rv',
    initialHemodynamics: {
      systolicBpMmHg: 78,
      diastolicBpMmHg: 48,
      meanArterialPressureMmHg: 58,
      heartRateBpm: 92,
      cardiacOutputLpm: 2.7,
      cardiacIndexLpmM2: 1.5,
      bodySurfaceAreaM2: 1.8,
      centralVenousPressureMmHg: 20,
      meanPulmonaryArteryPressureMmHg: 24,
      pulmonaryArterySystolicMmHg: 32,
      pulmonaryArteryDiastolicMmHg: 18,
      pulmonaryCapillaryWedgePressureMmHg: 18,
      arterialLactateMmolL: 4.6,
      mixedVenousSatSvo2Percent: 48,
      urineOutputMlKgHr: 0.2,
      hasCardiacArrestModifier: false,
    },
    initialVasoactives: {
      norepinephrineMcgKgMin: 0.25,
      epinephrineMcgKgMin: 0.05,
      dobutamineMcgKgMin: 5.0,
      milrinoneMcgKgMin: 0,
      vasopressinUnitsMin: 0.03,
      dopamineMcgKgMin: 0,
    },
    initialDevice: 'none',
    clinicalPearls: [
      'PAPi is (32 - 18) / 20 = 0.70 (< 0.90 critical threshold for RV failure).',
      'CVP/PCWP ratio is 20/18 = 1.11 (> 0.86), confirming predominant right-sided congestive failure.',
      'Placing an isolated LV Impella would precipitate inflow suction collapse; biventricular support (Impella RP + CP or VA-ECMO) is required.',
    ],
  },
  post_arrest_refractory_extremis: {
    id: 'post_arrest_refractory_extremis',
    name: '3. Resuscitated VF Arrest in Refractory Shock (SCAI Stage E_CA)',
    patientSummary:
      '49yo male with witnessed VF arrest (22 min CPR, 3 shocks). Post-ROSC SBP 68/42, HR 135 bpm, Arterial pH 7.08, Lactate 9.4 mmol/L, CI 1.1 L/min/m2 on maximal triple pressors.',
    etiology: 'acute_mi_anterior',
    initialHemodynamics: {
      systolicBpMmHg: 68,
      diastolicBpMmHg: 42,
      meanArterialPressureMmHg: 51,
      heartRateBpm: 135,
      cardiacOutputLpm: 2.1,
      cardiacIndexLpmM2: 1.1,
      bodySurfaceAreaM2: 1.9,
      centralVenousPressureMmHg: 18,
      meanPulmonaryArteryPressureMmHg: 38,
      pulmonaryArterySystolicMmHg: 46,
      pulmonaryArteryDiastolicMmHg: 30,
      pulmonaryCapillaryWedgePressureMmHg: 28,
      arterialLactateMmolL: 9.4,
      mixedVenousSatSvo2Percent: 38,
      urineOutputMlKgHr: 0.05,
      hasCardiacArrestModifier: true,
    },
    initialVasoactives: {
      norepinephrineMcgKgMin: 0.45,
      epinephrineMcgKgMin: 0.20,
      dobutamineMcgKgMin: 10.0,
      milrinoneMcgKgMin: 0,
      vasopressinUnitsMin: 0.04,
      dopamineMcgKgMin: 0,
    },
    initialDevice: 'none',
    clinicalPearls: [
      'SCAI Stage E with Cardiac Arrest Modifier (E_CA): in-hospital mortality exceeds 75-80%.',
      'Extracorporeal CPR (E-CPR) / Veno-Arterial ECMO is the only viable bridge to revascularization and targeted temperature management.',
      'Mandatory LV unloading (ECPELLA) prevents progressive hydrostatic pulmonary edema caused by retrograde ECMO aortic perfusion.',
    ],
  },
  chronic_hf_decompensated_stage_b: {
    id: 'chronic_hf_decompensated_stage_b',
    name: '4. Decompensated Ischemic Cardiomyopathy (Pre-Shock Stage B)',
    patientSummary:
      '68yo male with ischemic cardiomyopathy (EF 20%). SBP 86/56 (MAP 66), HR 104 bpm, CI 2.1 L/min/m2, PCWP 22 mmHg, normal lactate 1.4 mmol/L, warm extremities.',
    etiology: 'acute_decompensated_hf',
    initialHemodynamics: {
      systolicBpMmHg: 86,
      diastolicBpMmHg: 56,
      meanArterialPressureMmHg: 66,
      heartRateBpm: 104,
      cardiacOutputLpm: 3.8,
      cardiacIndexLpmM2: 2.1,
      bodySurfaceAreaM2: 1.8,
      centralVenousPressureMmHg: 10,
      meanPulmonaryArteryPressureMmHg: 30,
      pulmonaryArterySystolicMmHg: 40,
      pulmonaryArteryDiastolicMmHg: 22,
      pulmonaryCapillaryWedgePressureMmHg: 22,
      arterialLactateMmolL: 1.4,
      mixedVenousSatSvo2Percent: 62,
      urineOutputMlKgHr: 0.8,
      hasCardiacArrestModifier: false,
    },
    initialVasoactives: {
      norepinephrineMcgKgMin: 0,
      epinephrineMcgKgMin: 0,
      dobutamineMcgKgMin: 0,
      milrinoneMcgKgMin: 0,
      vasopressinUnitsMin: 0,
      dopamineMcgKgMin: 0,
    },
    initialDevice: 'none',
    clinicalPearls: [
      'SCAI Stage B: Relative hypotension without hypoperfusion (Lactate 1.4 < 2.0, preserved urine output).',
      'Mechanical support is NOT indicated at this stage. Initiate cautious IV diuresis and inodilators (Milrinone / Dobutamine) with continuous telemetry.',
      'Closely monitor for transition to Stage C if lactate rises or urine output drops.',
    ],
  },
};
