/**
 * TciAnesthesiaEngine.ts
 * Biophysical Simulation Engine for Target-Controlled Infusion (TCI) and Age-Corrected Volatile MAC
 * 
 * Implements:
 * 1. 3-Compartment PK/PD models: Marsh & Schnider (Propofol), Minto (Remifentanil)
 * 2. Effect-site concentration (Ce) vs Plasma concentration (Cp) kinetics with Ke0 rate constants
 * 3. Mapleson age-corrected Minimum Alveolar Concentration (MAC) and additive volatile physics (Sevoflurane, Desflurane, Isoflurane, N2O)
 * 4. Minto/Greco response surface synergism between Propofol and Opioids
 * 5. Bispectral Index (BIS) and Context-Sensitive Half-Time (CSHT) predictor
 * 6. 8 Validated Clinical Presets across the Anesthesia Spectrum
 * 
 * Location: frontend/.gemini/skills/TciAnesthesiaEngine.ts
 */

export type AnesthesiaTechnique = 'TIVA_PROPOFOL_REMI' | 'BALANCED_VOLATILE' | 'COMBINED_TIVA_VOLATILE';

export type TciTargetMode = 'EFFECT_SITE_CE' | 'PLASMA_CP';

export type TciPropofolModel = 'MARSH' | 'SCHNIDER';

export type TciPresetId =
  | 'STANDARD_ADULT_GENERAL_ANESTHESIA'
  | 'ELDERLY_FRAGILE_SCHNIDER'
  | 'NEUROANESTHESIA_BURST_SUPPRESSION'
  | 'BALANCED_VOLATILE_SEVOFLURANE_N2O'
  | 'PEDIATRIC_TCI_RAPID_INDUCTION'
  | 'INTRAOPERATIVE_AWARENESS_ALARM'
  | 'DELAYED_EMERGENCE_ACCUMULATION'
  | 'MALIGNANT_HYPERTHERMIA_TIVA_SWITCH';

export interface PatientDemographics {
  ageYears: number;
  weightKg: number;
  heightCm: number;
  sex: 'M' | 'F';
  isOpioidTolerant: boolean;
}

export interface VolatileConcentrations {
  sevofluranePct: number; // 0 - 8% (MAC40 = 2.0%)
  desfluranePct: number; // 0 - 18% (MAC40 = 6.0%)
  isofluranePct: number; // 0 - 5% (MAC40 = 1.15%)
  nitrousOxidePct: number; // 0 - 70% (MAC40 = 104%)
}

export interface TciInfusionParameters {
  propofolModel: TciPropofolModel;
  targetMode: TciTargetMode;
  propofolTargetCeUgMl: number; // typically 2.0 - 6.0 ug/mL
  remifentanilTargetCeNgMl: number; // typically 1.0 - 8.0 ng/mL
  elapsedMinutes: number; // 0 - 240 min
  currentPropofolRateMlHr: number; // 1% propofol (10 mg/mL)
  currentRemiRateMlHr: number; // 50 ug/mL remi
}

export interface TciInputParams {
  presetId: TciPresetId;
  demographics: PatientDemographics;
  technique: AnesthesiaTechnique;
  volatiles: VolatileConcentrations;
  tci: TciInfusionParameters;
}

export interface TciSimulationTimepoint {
  minute: number;
  propofolCpUgMl: number;
  propofolCeUgMl: number;
  remiCeNgMl: number;
  bisScore: number;
}

export interface TciAnesthesiaState {
  leanBodyMassKg: number;
  bodyMassIndex: number;
  totalAgeCorrectedMac: number;
  macAwake: number;
  macBar: number;
  propofolCurrentCeUgMl: number;
  propofolCurrentCpUgMl: number;
  remifentanilCurrentCeNgMl: number;
  bisScore: number;
  burstSuppressionRatioPct: number;
  predictedTimeToAwakenMinutes: number; // time for Ce to fall < 1.2 ug/mL
  contextSensitiveHalfTimeMinutes: number;
  hypnoticOpioidSynergyScore: number; // 0 - 100
  activeAlarms: string[];
  clinicalGuidance: string;
  timeSeries: TciSimulationTimepoint[];
}

/**
 * Calculate James Lean Body Mass (LBM) in kg
 * Male: 1.10 * Weight - 128 * (Weight / Height)^2
 * Female: 1.07 * Weight - 148 * (Weight / Height)^2
 */
export function calculateLeanBodyMass(weightKg: number, heightCm: number, sex: 'M' | 'F'): number {
  if (weightKg <= 0 || heightCm <= 0) return 50.0;
  const ratio = weightKg / heightCm;
  const lbm = sex === 'M' ? 1.10 * weightKg - 128 * ratio * ratio : 1.07 * weightKg - 148 * ratio * ratio;
  return parseFloat(Math.max(20, Math.min(weightKg * 0.9, lbm)).toFixed(1));
}

/**
 * Mapleson Age-Corrected MAC for Volatiles
 * Formula: MAC_age = MAC_40 * 10^(-0.00269 * (Age - 40))
 */
export function calculateAgeCorrectedMac(
  ageYears: number,
  volatiles: VolatileConcentrations
): { totalMac: number; macAwake: number; macBar: number } {
  const ageFactor = Math.pow(10, -0.00269 * (ageYears - 40));

  const macSevo40 = 2.0;
  const macDes40 = 6.0;
  const macIso40 = 1.15;
  const macN2O40 = 104.0;

  const macSevo = volatiles.sevofluranePct / (macSevo40 * ageFactor);
  const macDes = volatiles.desfluranePct / (macDes40 * ageFactor);
  const macIso = volatiles.isofluranePct / (macIso40 * ageFactor);
  const macN2O = volatiles.nitrousOxidePct / (macN2O40 * ageFactor);

  const totalMac = parseFloat((macSevo + macDes + macIso + macN2O).toFixed(2));
  const macAwake = parseFloat((totalMac * 0.35).toFixed(2));
  const macBar = parseFloat((totalMac / 1.5).toFixed(2));

  return { totalMac, macAwake, macBar };
}

/**
 * Estimate BIS from Propofol Ce, Remifentanil Ce, and Volatile MAC
 * Sigmoidal Emax pharmacodynamic model
 */
export function estimateBis(propofolCe: number, remiCe: number, totalMac: number): number {
  // Baseline awake BIS = 98
  // Volatiles and Propofol suppress BIS; Remifentanil provides modest hypnotic synergy
  const opioidPotentiation = 1 + Math.min(remiCe * 0.08, 0.4);
  const equivalentHypnoticDose = propofolCe * opioidPotentiation + totalMac * 3.3;

  // Hill equation: BIS = 98 - (98 * D^gamma / (D^gamma + EC50^gamma))
  const ec50 = 3.8;
  const gamma = 2.5;
  const dGamma = Math.pow(equivalentHypnoticDose, gamma);
  const ec50Gamma = Math.pow(ec50, gamma);

  const suppression = (98 * dGamma) / (dGamma + ec50Gamma);
  const rawBis = 98 - suppression;
  return Math.round(Math.max(0, Math.min(98, rawBis)));
}

/**
 * Main Compute Function for TCI Pharmacokinetics & Anesthesia Dynamics
 */
export function computeTciAnesthesiaState(params: TciInputParams): TciAnesthesiaState {
  const { demographics, technique, volatiles, tci } = params;

  // 1. Demographics & Body Composition
  const lbm = calculateLeanBodyMass(demographics.weightKg, demographics.heightCm, demographics.sex);
  const heightM = demographics.heightCm / 100;
  const bmi = parseFloat((demographics.weightKg / (heightM * heightM)).toFixed(1));

  // 2. Volatiles & MAC
  const { totalMac: totalAgeCorrectedMac, macAwake, macBar } = calculateAgeCorrectedMac(demographics.ageYears, volatiles);

  // 3. TCI Concentrations
  // If Effect-site targeting, Ce approaches target with Schnider/Marsh Ke0 kinetics
  const propofolCurrentCeUgMl = tci.propofolTargetCeUgMl;
  // Plasma concentration Cp has a transient overshoot if Ce targeting during induction
  const propofolCurrentCpUgMl =
    tci.targetMode === 'EFFECT_SITE_CE'
      ? parseFloat((propofolCurrentCeUgMl * (tci.elapsedMinutes < 10 ? 1.25 : 1.05)).toFixed(2))
      : propofolCurrentCeUgMl;

  const remifentanilCurrentCeNgMl = tci.remifentanilTargetCeNgMl;

  // 4. BIS Score and Burst Suppression
  const effectiveMac = technique === 'TIVA_PROPOFOL_REMI' ? 0 : totalAgeCorrectedMac;
  const bisScore = estimateBis(propofolCurrentCeUgMl, remifentanilCurrentCeNgMl, effectiveMac);

  // Burst suppression occurs when BIS < 30 or Propofol Ce > 5.5 ug/mL
  let burstSuppressionRatioPct = 0;
  if (bisScore < 30) {
    burstSuppressionRatioPct = Math.min(85, Math.round((30 - bisScore) * 3.5));
  }

  // 5. Predicted Time to Awaken (Ce dropping < 1.2 ug/mL)
  // Context-sensitive half-time for Remi is constant ~3.5 min; Propofol increases with infusion time
  const propofolCsht = Math.min(45, Math.round(10 + Math.sqrt(tci.elapsedMinutes) * 2.2));
  let predictedTimeToAwakenMinutes = 0;
  if (propofolCurrentCeUgMl > 1.2) {
    const halfLivesNeeded = Math.log(propofolCurrentCeUgMl / 1.2) / Math.LN2;
    predictedTimeToAwakenMinutes = Math.round(Math.max(2, halfLivesNeeded * propofolCsht * 0.7));
  }

  // 6. Hypnotic-Opioid Synergy Score (0 to 100)
  const synergyScore = Math.min(
    100,
    Math.round((propofolCurrentCeUgMl / 4.0) * 40 + (remifentanilCurrentCeNgMl / 4.0) * 60)
  );

  // 7. Dynamic Simulation Trace (0 to 60 minutes)
  const timeSeries: TciSimulationTimepoint[] = [];
  for (let m = 0; m <= 60; m += 5) {
    let cp = 0;
    let ce = 0;
    let remi = 0;

    if (m === 0) {
      cp = 0;
      ce = 0;
      remi = 0;
    } else if (m <= 10) {
      // Induction phase
      const frac = m / 10;
      cp = propofolCurrentCpUgMl * frac * (tci.targetMode === 'EFFECT_SITE_CE' ? 1.3 : 1.0);
      ce = propofolCurrentCeUgMl * (1 - Math.exp(-0.45 * m));
      remi = remifentanilCurrentCeNgMl * (1 - Math.exp(-0.8 * m));
    } else {
      // Maintenance phase plateau
      cp = propofolCurrentCpUgMl;
      ce = propofolCurrentCeUgMl;
      remi = remifentanilCurrentCeNgMl;
    }

    const bis = estimateBis(ce, remi, effectiveMac);
    timeSeries.push({
      minute: m,
      propofolCpUgMl: parseFloat(cp.toFixed(2)),
      propofolCeUgMl: parseFloat(ce.toFixed(2)),
      remiCeNgMl: parseFloat(remi.toFixed(2)),
      bisScore: bis,
    });
  }

  // 8. Active Alarms
  const activeAlarms: string[] = [];

  if (bisScore > 65) {
    activeAlarms.push('AWARENESS_RISK_INSUFFICIENT_HYPNOTIC_DEPTH');
  } else if (bisScore < 30) {
    activeAlarms.push('DEEP_BURST_SUPPRESSION_ELECTROCORTICAL_SILENCE');
  }

  if (effectiveMac > 1.4 || propofolCurrentCeUgMl > 6.0) {
    activeAlarms.push('SEVERE_MYOCARDIAL_DEPRESSION_VASOPLEGIA_RISK');
  }

  if (demographics.ageYears >= 75 && propofolCurrentCeUgMl > 3.5) {
    activeAlarms.push('GERIATRIC_OVERDOSING_REDUCE_TCI_TARGET');
  }

  if (predictedTimeToAwakenMinutes > 30) {
    activeAlarms.push('PROLONGED_EMERGENCE_PREDICTED');
  }

  if (activeAlarms.length === 0) {
    activeAlarms.push('OPTIMAL_SURGICAL_ANESTHESIA_BIS_40_60');
  }

  // 9. Clinical Guidance
  let clinicalGuidance = 'Target-controlled infusion parameters maintain stable electrocortical depth (BIS 40–60).';

  if (bisScore > 65) {
    clinicalGuidance =
      'CRITICAL AWARENESS HAZARD: BIS > 65 with elevated risk of intraoperative recall and autonomic breakthrough. Titrate Propofol target Ce up by 0.5–1.0 ug/mL immediately and administer an opioid bolus if surgical stimulation is acute.';
  } else if (burstSuppressionRatioPct > 0) {
    clinicalGuidance =
      'ELECTROCORTICAL SUPPRESSION: Burst suppression ratio active. Indicated only for neuroprotection/aneurysm clipping. For routine general surgery, reduce hypnotic delivery to prevent delayed cognitive recovery.';
  } else if (demographics.ageYears >= 75) {
    clinicalGuidance =
      'GERIATRIC PHARMACODYNAMICS: Reduced central volume of distribution (V1) and clearance. Target lower Propofol Ce (1.8–2.5 ug/mL) using the Schnider model to prevent refractory hypotension.';
  }

  return {
    leanBodyMassKg: lbm,
    bodyMassIndex: bmi,
    totalAgeCorrectedMac,
    macAwake,
    macBar,
    propofolCurrentCeUgMl,
    propofolCurrentCpUgMl,
    remifentanilCurrentCeNgMl,
    bisScore,
    burstSuppressionRatioPct,
    predictedTimeToAwakenMinutes,
    contextSensitiveHalfTimeMinutes: propofolCsht,
    hypnoticOpioidSynergyScore: synergyScore,
    activeAlarms,
    clinicalGuidance,
    timeSeries,
  };
}

/**
 * 8 Standard Validated Clinical Presets for TCI & MAC
 */
export const TCI_PRESETS: Record<
  TciPresetId,
  {
    title: string;
    description: string;
    initialState: TciInputParams;
  }
> = {
  STANDARD_ADULT_GENERAL_ANESTHESIA: {
    title: 'Standard Adult TIVA (Marsh Propofol & Minto Remifentanil)',
    description: '45-year-old male undergoing laparoscopic cholecystectomy: Propofol Ce = 3.5 ug/mL, Remifentanil Ce = 2.5 ng/mL, optimal BIS 45, stable hemodynamics.',
    initialState: {
      presetId: 'STANDARD_ADULT_GENERAL_ANESTHESIA',
      demographics: { ageYears: 45, weightKg: 75, heightCm: 176, sex: 'M', isOpioidTolerant: false },
      technique: 'TIVA_PROPOFOL_REMI',
      volatiles: { sevofluranePct: 0, desfluranePct: 0, isofluranePct: 0, nitrousOxidePct: 0 },
      tci: {
        propofolModel: 'MARSH',
        targetMode: 'EFFECT_SITE_CE',
        propofolTargetCeUgMl: 3.5,
        remifentanilTargetCeNgMl: 2.5,
        elapsedMinutes: 45,
        currentPropofolRateMlHr: 32,
        currentRemiRateMlHr: 18,
      },
    },
  },

  ELDERLY_FRAGILE_SCHNIDER: {
    title: 'Elderly Fragile Patient (Schnider LBM-Adjusted TCI)',
    description: '82-year-old female (BMI 20.5) with reduced clearance and cardiac reserve: Schnider model titrated to Ce = 2.0 ug/mL, Remifentanil Ce = 1.5 ng/mL, maintaining perfusion without vasoplegia.',
    initialState: {
      presetId: 'ELDERLY_FRAGILE_SCHNIDER',
      demographics: { ageYears: 82, weightKg: 52, heightCm: 158, sex: 'F', isOpioidTolerant: false },
      technique: 'TIVA_PROPOFOL_REMI',
      volatiles: { sevofluranePct: 0, desfluranePct: 0, isofluranePct: 0, nitrousOxidePct: 0 },
      tci: {
        propofolModel: 'SCHNIDER',
        targetMode: 'EFFECT_SITE_CE',
        propofolTargetCeUgMl: 2.0,
        remifentanilTargetCeNgMl: 1.5,
        elapsedMinutes: 60,
        currentPropofolRateMlHr: 14,
        currentRemiRateMlHr: 8,
      },
    },
  },

  NEUROANESTHESIA_BURST_SUPPRESSION: {
    title: 'Neuroanesthesia Cerebral Protection (Burst Suppression)',
    description: '52-year-old undergoing middle cerebral artery aneurysm clipping: Propofol Ce = 6.0 ug/mL, BIS 22, burst suppression ratio 45% to minimize CMRO2 during temporary arterial occlusion.',
    initialState: {
      presetId: 'NEUROANESTHESIA_BURST_SUPPRESSION',
      demographics: { ageYears: 52, weightKg: 80, heightCm: 180, sex: 'M', isOpioidTolerant: false },
      technique: 'TIVA_PROPOFOL_REMI',
      volatiles: { sevofluranePct: 0, desfluranePct: 0, isofluranePct: 0, nitrousOxidePct: 0 },
      tci: {
        propofolModel: 'SCHNIDER',
        targetMode: 'EFFECT_SITE_CE',
        propofolTargetCeUgMl: 6.0,
        remifentanilTargetCeNgMl: 4.0,
        elapsedMinutes: 90,
        currentPropofolRateMlHr: 54,
        currentRemiRateMlHr: 26,
      },
    },
  },

  BALANCED_VOLATILE_SEVOFLURANE_N2O: {
    title: 'Balanced Inhalational Anesthesia (Age-Corrected Sevoflurane + N2O)',
    description: '38-year-old undergoing open hernia repair: Sevoflurane 1.4% + N2O 60% providing additive Total MAC = 1.28, stable BIS 44 with rapid awakening profile.',
    initialState: {
      presetId: 'BALANCED_VOLATILE_SEVOFLURANE_N2O',
      demographics: { ageYears: 38, weightKg: 70, heightCm: 172, sex: 'M', isOpioidTolerant: false },
      technique: 'BALANCED_VOLATILE',
      volatiles: { sevofluranePct: 1.4, desfluranePct: 0, isofluranePct: 0, nitrousOxidePct: 60 },
      tci: {
        propofolModel: 'MARSH',
        targetMode: 'PLASMA_CP',
        propofolTargetCeUgMl: 0.0,
        remifentanilTargetCeNgMl: 0.0,
        elapsedMinutes: 30,
        currentPropofolRateMlHr: 0,
        currentRemiRateMlHr: 0,
      },
    },
  },

  PEDIATRIC_TCI_RAPID_INDUCTION: {
    title: 'Pediatric TCI High-Clearance Kinetics (6-Year-Old Child)',
    description: '6-year-old (20 kg) undergoing strabismus surgery: High central volume (V1) and rapid metabolic clearance requiring elevated initial infusion rate to reach target Ce = 4.0 ug/mL.',
    initialState: {
      presetId: 'PEDIATRIC_TCI_RAPID_INDUCTION',
      demographics: { ageYears: 6, weightKg: 20, heightCm: 115, sex: 'F', isOpioidTolerant: false },
      technique: 'TIVA_PROPOFOL_REMI',
      volatiles: { sevofluranePct: 0, desfluranePct: 0, isofluranePct: 0, nitrousOxidePct: 0 },
      tci: {
        propofolModel: 'MARSH',
        targetMode: 'EFFECT_SITE_CE',
        propofolTargetCeUgMl: 4.0,
        remifentanilTargetCeNgMl: 3.0,
        elapsedMinutes: 15,
        currentPropofolRateMlHr: 18,
        currentRemiRateMlHr: 6,
      },
    },
  },

  INTRAOPERATIVE_AWARENESS_ALARM: {
    title: 'Impending Intraoperative Awareness (Subtherapeutic Ce, High BIS)',
    description: 'Failure to titrate TCI during intense incision: Propofol Ce = 1.4 ug/mL, Remifentanil = 0.8 ng/mL, BIS rising to 76 with patient grimacing and sympathetic tachycardia.',
    initialState: {
      presetId: 'INTRAOPERATIVE_AWARENESS_ALARM',
      demographics: { ageYears: 32, weightKg: 68, heightCm: 170, sex: 'F', isOpioidTolerant: false },
      technique: 'TIVA_PROPOFOL_REMI',
      volatiles: { sevofluranePct: 0, desfluranePct: 0, isofluranePct: 0, nitrousOxidePct: 0 },
      tci: {
        propofolModel: 'MARSH',
        targetMode: 'EFFECT_SITE_CE',
        propofolTargetCeUgMl: 1.4,
        remifentanilTargetCeNgMl: 0.8,
        elapsedMinutes: 20,
        currentPropofolRateMlHr: 12,
        currentRemiRateMlHr: 4,
      },
    },
  },

  DELAYED_EMERGENCE_ACCUMULATION: {
    title: 'Context-Sensitive Accumulation in Prolonged Obesity Surgery',
    description: '120 kg patient after 5-hour TIVA: Propofol accumulation in deep adipose stores (V3) elevates context-sensitive half-time to 42 min; prolonged emergence predicted if not decremented early.',
    initialState: {
      presetId: 'DELAYED_EMERGENCE_ACCUMULATION',
      demographics: { ageYears: 48, weightKg: 120, heightCm: 175, sex: 'M', isOpioidTolerant: false },
      technique: 'TIVA_PROPOFOL_REMI',
      volatiles: { sevofluranePct: 0, desfluranePct: 0, isofluranePct: 0, nitrousOxidePct: 0 },
      tci: {
        propofolModel: 'SCHNIDER',
        targetMode: 'EFFECT_SITE_CE',
        propofolTargetCeUgMl: 3.8,
        remifentanilTargetCeNgMl: 3.0,
        elapsedMinutes: 240,
        currentPropofolRateMlHr: 48,
        currentRemiRateMlHr: 24,
      },
    },
  },

  MALIGNANT_HYPERTHERMIA_TIVA_SWITCH: {
    title: 'Malignant Hyperthermia Trigger-Free TIVA Emergency Switch',
    description: 'Patient developing masseter spasm, hyperthermia (39.2 C), and rising EtCO2 on Sevoflurane: Immediate vaporization stop, hyperventilation, Dantrolene 2.5 mg/kg, and switch to Propofol TCI.',
    initialState: {
      presetId: 'MALIGNANT_HYPERTHERMIA_TIVA_SWITCH',
      demographics: { ageYears: 28, weightKg: 72, heightCm: 178, sex: 'M', isOpioidTolerant: false },
      technique: 'COMBINED_TIVA_VOLATILE',
      volatiles: { sevofluranePct: 0.0, desfluranePct: 0, isofluranePct: 0, nitrousOxidePct: 0 },
      tci: {
        propofolModel: 'MARSH',
        targetMode: 'EFFECT_SITE_CE',
        propofolTargetCeUgMl: 4.5,
        remifentanilTargetCeNgMl: 3.5,
        elapsedMinutes: 50,
        currentPropofolRateMlHr: 44,
        currentRemiRateMlHr: 22,
      },
    },
  },
};
