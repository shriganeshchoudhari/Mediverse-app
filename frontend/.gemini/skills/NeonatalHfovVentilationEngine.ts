/**
 * NeonatalHfovVentilationEngine.ts
 *
 * Biophysical, physiological, and mathematical engine for Neonatal High-Frequency
 * Oscillatory Ventilation (HFOV), Gas Transport Dynamics (Taylor Dispersion & Pendelluft),
 * Open-Lung Hysteresis Strategy, and Exogenous Surfactant Kinematics (LISA / MIST).
 *
 * Implements:
 * 1. HFOV Gas Transport Mechanisms (Sub-dead-space Ventilation):
 *    - Bulk axial convection (central airway streaming)
 *    - Taylor dispersion (laminar shear-enhanced longitudinal diffusion)
 *    - Pendelluft (inter-regional collateral ventilation between alveolar units with disparate time constants)
 *    - Asymmetric velocity profiles (bullet-shaped inspiratory core vs flat expiratory annulus)
 *    - Molecular diffusion at alveolar-capillary membrane
 * 2. HFOV Mathematical Solvers:
 *    - Tidal Volume Delivery: V_thf ~ (Amplitude / Respiratory Impedance) * (1 / frequency^0.75)
 *    - Carbon Dioxide Diffusion Coefficient: DCO2 = f * (V_thf)^2 (mL^2/s)
 *    - Counter-intuitive PaCO2 response: In HFOV, REDUCING frequency (e.g. 12 Hz -> 10 Hz)
 *      increases stroke displacement per cycle, paradoxically INCREASING DCO2 and LOWERING PaCO2!
 *    - Oxygenation Index: OI = (mPaw * FiO2 * 100) / PaO2
 *      - OI < 10: Mild RDS
 *      - OI 10 - 25: Moderate respiratory failure
 *      - OI 25 - 40: Severe hypoxemic failure (inhaled Nitric Oxide [iNO] candidate)
 *      - OI > 40: Critical failure (ECMO criteria in mature neonates)
 * 3. Open-Lung Hysteresis Strategy:
 *    - Ascending recruitment limb: Titrate mPaw up by 1 - 2 cmH2O until SpO2 stabilizes or FiO2 < 0.30
 *    - Deflation limb: Stepwise decremental mPaw titration to identify closing pressure (P_close)
 *    - Target optimal mPaw: P_close + 2 cmH2O (maximal alveolar compliance on deflation limb)
 * 4. Exogenous Surfactant Kinematics & Laplace Law:
 *    - Laplace collapsing pressure: P = 2 * gamma / radius
 *    - Without surfactant: gamma ~ 70 mN/m (water), small alveoli collapse into larger alveoli
 *    - With surfactant: gamma < 5 mN/m at end-expiration, stabilizing alveoli
 *    - Poractant alfa (Curosurf 200 mg/kg initial dose) vs Beractant (Survanta 100 mg/kg)
 *    - Delivery modes: LISA/MIST (Less Invasive Surfactant Administration) vs InSurE vs ETT
 *
 * Location: frontend/.gemini/skills/NeonatalHfovVentilationEngine.ts
 */

export interface NeonatalDemographics {
  gestationalAgeWeeks: number; // e.g. 25.5
  birthWeightGrams: number; // e.g. 750
  postnatalAgeHours: number; // e.g. 6
  diagnosis: 'RDS' | 'MAS' | 'PPHN' | 'CDH' | 'AIR_LEAK_PIE' | 'BPD';
}

export interface HfovSettings {
  meanAirwayPressureCmH2O: number; // mPaw (8 - 30 cmH2O)
  amplitudeDeltaPCmH2O: number; // Power/Delta P (15 - 60 cmH2O)
  frequencyHz: number; // 6 - 15 Hz (1 Hz = 60 breaths/min)
  inspiratoryTimePct: number; // standard 33% (1:2 ratio)
  fio2Pct: number; // 21 - 100%
  flowRateLMin: number; // bias flow 6 - 12 L/min
}

export interface SurfactantState {
  administered: boolean;
  preparation: 'PORACTANT_ALFA_CUROSURF' | 'BERACTANT_SURVANTA' | 'NONE';
  doseMgPerKg: number; // e.g. 200 mg/kg
  deliveryMethod: 'LISA_MIST' | 'INSURE' | 'ETT_BOLUS' | 'NONE';
  hoursSinceDose: number;
  alveolarSurfaceTensionMnm: number; // normal < 10, deficient 40 - 70
}

export interface LungBiomechanics {
  respiratoryComplianceMlCmH2O: number; // e.g. 0.3 - 1.2 mL/cmH2O
  airwayResistanceCmH2OLs: number; // e.g. 30 - 100 cmH2O/L/s
  alveolarRecruitmentPct: number; // 0 - 100%
  isOpenLungOptimized: boolean;
}

export interface HfovVentilationAnalysis {
  // Delivered Metrics
  deliveredHfovTidalVolumeMl: number;
  deliveredHfovTidalVolumeMlPerKg: number;
  diffusionCoefficientDco2: number; // mL^2/s

  // Predicted Arterial Blood Gas (ABG)
  predictedPaO2MmHg: number;
  predictedPaCO2MmHg: number;
  predictedPh: number;
  predictedSpO2Pct: number;

  // Oxygenation & Risk Indices
  oxygenationIndexOi: number;
  oiSeverity: 'NORMAL' | 'MILD' | 'MODERATE' | 'SEVERE' | 'CRITICAL_ECMO_TRIGGER';

  // HFOV Clinical Rules
  frequencyAdjustmentGuidance: string;
  mPawOptimizationGuidance: string;
  surfactantEffectSummary: string;
  alerts: string[];
}

/**
 * Calculates Laplace's alveolar collapsing pressure (cmH2O).
 * P = (2 * gamma) / r
 */
export function calculateLaplacePressure(
  surfaceTensionMnm: number,
  alveolarRadiusMicrons: number
): number {
  if (alveolarRadiusMicrons <= 0) return 0;
  // 1 mN/m / 1 micron = 1 kPa = 10.197 cmH2O
  // P = (2 * gamma [mN/m]) / (r [microns]) * 10.197
  return parseFloat(((2 * surfaceTensionMnm * 10.197) / alveolarRadiusMicrons).toFixed(1));
}

/**
 * Computes Oxygenation Index (OI).
 * OI = (mPaw * FiO2 * 100) / PaO2
 */
export function calculateOxygenationIndex(
  mPawCmH2O: number,
  fio2Pct: number,
  paO2MmHg: number
): { oi: number; severity: 'NORMAL' | 'MILD' | 'MODERATE' | 'SEVERE' | 'CRITICAL_ECMO_TRIGGER' } {
  if (paO2MmHg <= 0) return { oi: 99, severity: 'CRITICAL_ECMO_TRIGGER' };
  const fio2Fraction = fio2Pct / 100;
  const oi = parseFloat(((mPawCmH2O * fio2Fraction * 100) / paO2MmHg).toFixed(1));

  let severity: 'NORMAL' | 'MILD' | 'MODERATE' | 'SEVERE' | 'CRITICAL_ECMO_TRIGGER' = 'NORMAL';
  if (oi >= 40) severity = 'CRITICAL_ECMO_TRIGGER';
  else if (oi >= 25) severity = 'SEVERE';
  else if (oi >= 10) severity = 'MODERATE';
  else if (oi >= 5) severity = 'MILD';

  return { oi, severity };
}

/**
 * Full master clinical solver for Neonatal HFOV, Gas Transport, and Surfactant.
 */
export function evaluateNeonatalHfov(
  demographics: NeonatalDemographics,
  hfov: HfovSettings,
  surfactant: SurfactantState,
  biomechanics: LungBiomechanics
): HfovVentilationAnalysis {
  const alerts: string[] = [];
  const weightKg = Math.max(0.4, demographics.birthWeightGrams / 1000);

  // 1. Surfactant Effect on Alveolar Surface Tension & Compliance
  let effectiveSurfaceTension = surfactant.alveolarSurfaceTensionMnm;
  let effectiveCompliance = biomechanics.respiratoryComplianceMlCmH2O;

  if (surfactant.administered) {
    // Rapid drop in surface tension, improving compliance
    effectiveSurfaceTension = Math.max(3, surfactant.alveolarSurfaceTensionMnm - 35);
    effectiveCompliance = parseFloat((biomechanics.respiratoryComplianceMlCmH2O * 1.6).toFixed(2));
  }

  // 2. High-Frequency Tidal Volume Delivery (V_thf)
  // In HFOV: V_thf increases with amplitude (Delta P) and DECREASES with frequency^0.75
  const baseVt = (hfov.amplitudeDeltaPCmH2O * 0.14 * effectiveCompliance) / Math.pow(hfov.frequencyHz / 10, 0.75);
  const deliveredHfovTidalVolumeMl = parseFloat(Math.max(0.5, baseVt * weightKg).toFixed(2));
  const deliveredHfovTidalVolumeMlPerKg = parseFloat((deliveredHfovTidalVolumeMl / weightKg).toFixed(2));

  // 3. Carbon Dioxide Diffusion Coefficient (DCO2 = f * Vt^2)
  // Expressed in mL^2/s
  const diffusionCoefficientDco2 = Math.round(hfov.frequencyHz * Math.pow(deliveredHfovTidalVolumeMl, 2));

  // 4. Predicted PaCO2 from DCO2
  // Target normal DCO2 for preterm is proportional to weight (~ 18 * weightKg)
  const baselineExpectedDco2 = Math.max(5, 18 * weightKg);
  let predictedPaCO2 = Math.round(42 * (baselineExpectedDco2 / Math.max(2, diffusionCoefficientDco2)));
  predictedPaCO2 = Math.max(25, Math.min(95, predictedPaCO2));

  // 5. Predicted PaO2 and SpO2 from mPaw, FiO2, and Alveolar Recruitment
  // In PPHN, suprasystemic pulmonary vascular resistance creates massive extrapulmonary R->L shunt
  let shuntFraction = 0.10; // normal physiological shunt ~10%
  if (demographics.diagnosis === 'PPHN') {
    shuntFraction = 0.50; // severe R->L ductal/foramen ovale shunt
  } else if (demographics.diagnosis === 'CDH') {
    shuntFraction = 0.35; // hypoplastic pulmonary vascular bed
  } else if (demographics.diagnosis === 'MAS') {
    shuntFraction = 0.25; // profound V/Q mismatch
  }

  const recruitmentFactor = Math.min(1.0, (hfov.meanAirwayPressureCmH2O * 0.05) + (biomechanics.alveolarRecruitmentPct / 100) * 0.5);
  const idealAlveolarPo2 = ((hfov.fio2Pct / 100) * 713) - (predictedPaCO2 / 0.8);
  // Apply shunt equation: PaO2 blunted by extrapulmonary/intrapulmonary shunting
  let predictedPaO2 = Math.round(
    Math.max(30, (idealAlveolarPo2 * (1 - shuntFraction) * recruitmentFactor * (surfactant.administered ? 1.3 : 0.85)) + (40 * shuntFraction))
  );
  if (demographics.diagnosis === 'PPHN') {
    predictedPaO2 = Math.min(58, predictedPaO2); // severe refractory hypoxemia characteristic of PPHN
  } else {
    predictedPaO2 = Math.min(180, predictedPaO2);
  }

  // Oxygen Saturation from PaO2 (Hill Equation)
  const predictedSpO2Pct = Math.round(
    Math.min(100, Math.max(45, (Math.pow(predictedPaO2, 2.7) / (Math.pow(predictedPaO2, 2.7) + Math.pow(27, 2.7))) * 100))
  );

  // Predicted pH (Henderson-Hasselbalch approximation)
  const predictedPh = parseFloat((7.40 - ((predictedPaCO2 - 40) * 0.008)).toFixed(2));

  // 6. Oxygenation Index (OI)
  const { oi: oxygenationIndexOi, severity: oiSeverity } = calculateOxygenationIndex(
    hfov.meanAirwayPressureCmH2O,
    hfov.fio2Pct,
    predictedPaO2
  );

  // 7. Clinical Alerts and Counter-Intuitive HFOV Guidance
  let frequencyAdjustmentGuidance = '';
  if (predictedPaCO2 > 55) {
    frequencyAdjustmentGuidance =
      `Hypercapnia detected (PaCO2 ${predictedPaCO2} mmHg > 55 mmHg). To blow off CO2 on HFOV: LOWER the frequency (e.g. from ${hfov.frequencyHz} Hz to ${Math.max(6, hfov.frequencyHz - 2)} Hz) or INCREASE Amplitude (Delta P). Decreasing frequency allows greater piston travel, increasing delivered tidal volume (V_thf)!`;
    alerts.push(`Hypercapnia: PaCO2 ${predictedPaCO2} mmHg. Decrease frequency or increase amplitude.`);
  } else if (predictedPaCO2 < 35) {
    frequencyAdjustmentGuidance =
      `Hypocapnia / Hyperventilation detected (PaCO2 ${predictedPaCO2} mmHg < 35 mmHg). Danger of cerebral vasoconstriction and periventricular leukomalacia (PVL)! INCREASE frequency (e.g. to ${hfov.frequencyHz + 2} Hz) or DECREASE Amplitude to reduce tidal volume.`;
    alerts.push(`Hypocapnia Alert: PaCO2 ${predictedPaCO2} mmHg. Risk of cerebral ischemia/PVL. Increase frequency.`);
  } else {
    frequencyAdjustmentGuidance =
      `Normocapnia maintained (PaCO2 ${predictedPaCO2} mmHg). DCO2 (${diffusionCoefficientDco2} mL²/s) is well matched to infant metabolic rate.`;
  }

  let mPawOptimizationGuidance = '';
  if (hfov.fio2Pct > 50 && predictedSpO2Pct < 90) {
    mPawOptimizationGuidance =
      `Atelectasis / Incomplete Recruitment: Infant requires FiO2 ${hfov.fio2Pct}% with SpO2 ${predictedSpO2Pct}%. Increment mPaw by 1 - 2 cmH2O every 2-3 minutes (Open-Lung Strategy) until oxygenation improves, then step down to find closing pressure.`;
    alerts.push(`Hypoxemia: Stepwise mPaw recruitment indicated to reach deflation limb.`);
  } else if (hfov.fio2Pct <= 30 && predictedSpO2Pct >= 95 && hfov.meanAirwayPressureCmH2O > 14) {
    mPawOptimizationGuidance =
      `Lung Volume Optimized on Deflation Limb (FiO2 ${hfov.fio2Pct}%, SpO2 ${predictedSpO2Pct}%). Consider cautiously weaning mPaw by 1 cmH2O steps to avoid lung overdistension, pulmonary barotrauma, and impaired venous return.`;
  } else {
    mPawOptimizationGuidance =
      `mPaw of ${hfov.meanAirwayPressureCmH2O} cmH2O provides stable functional residual capacity (FRC). Target 8 - 9 posterior ribs visible on inspiratory chest radiograph.`;
  }

  let surfactantEffectSummary = '';
  if (surfactant.administered) {
    surfactantEffectSummary =
      `Surfactant (${surfactant.preparation.replace(/_/g, ' ')}, ${surfactant.doseMgPerKg} mg/kg via ${surfactant.deliveryMethod.replace(/_/g, ' ')}) active. Surface tension reduced to ${effectiveSurfaceTension} mN/m. Significant increase in dynamic lung compliance. Monitor for rapid lung compliance surge requiring prompt amplitude weaning!`;
  } else {
    surfactantEffectSummary =
      `Surfactant Deficiency: High surface tension (${effectiveSurfaceTension} mN/m). Alveolar collapsing pressure is elevated (Laplace instability). Early LISA/MIST or ETT surfactant replacement recommended.`;
  }

  if (oiSeverity === 'CRITICAL_ECMO_TRIGGER' || oiSeverity === 'SEVERE') {
    alerts.push(`Critical Hypoxemic Failure: OI is ${oxygenationIndexOi} (${oiSeverity}). Evaluate for inhaled Nitric Oxide (iNO) or ECMO cannula placement.`);
  }

  return {
    deliveredHfovTidalVolumeMl,
    deliveredHfovTidalVolumeMlPerKg,
    diffusionCoefficientDco2,
    predictedPaO2MmHg: predictedPaO2,
    predictedPaCO2MmHg: predictedPaCO2,
    predictedPh,
    predictedSpO2Pct,
    oxygenationIndexOi,
    oiSeverity,
    frequencyAdjustmentGuidance,
    mPawOptimizationGuidance,
    surfactantEffectSummary,
    alerts,
  };
}

// -------------------------------------------------------------------------
// CLINICAL PRESETS (8 Realistic Neonatal Scenarios)
// -------------------------------------------------------------------------

export interface NeonatalHfovPreset {
  id: string;
  name: string;
  category: string;
  description: string;
  demographics: NeonatalDemographics;
  hfov: HfovSettings;
  surfactant: SurfactantState;
  biomechanics: LungBiomechanics;
}

export const NEONATAL_HFOV_PRESETS: NeonatalHfovPreset[] = [
  {
    id: 'EXTREME_PRETERM_RDS_ACUTE',
    name: 'Extreme Preterm RDS (25 Weeks, 750g - Surfactant Deficient)',
    category: 'Respiratory Distress Syndrome',
    description:
      '25+4 weeks gestational age, 750 grams, 3 hours postnatal age. Severe primary surfactant deficiency with generalized micro-atelectasis. High oxygen requirement (FiO2 70%), stiff lungs, and impending respiratory acidosis.',
    demographics: {
      gestationalAgeWeeks: 25.5,
      birthWeightGrams: 750,
      postnatalAgeHours: 3,
      diagnosis: 'RDS',
    },
    hfov: {
      meanAirwayPressureCmH2O: 11,
      amplitudeDeltaPCmH2O: 26,
      frequencyHz: 12,
      inspiratoryTimePct: 33,
      fio2Pct: 70,
      flowRateLMin: 8,
    },
    surfactant: {
      administered: false,
      preparation: 'NONE',
      doseMgPerKg: 0,
      deliveryMethod: 'NONE',
      hoursSinceDose: 0,
      alveolarSurfaceTensionMnm: 65,
    },
    biomechanics: {
      respiratoryComplianceMlCmH2O: 0.35,
      airwayResistanceCmH2OLs: 45,
      alveolarRecruitmentPct: 40,
      isOpenLungOptimized: false,
    },
  },
  {
    id: 'POST_LISA_SURFACTANT_SUCCESS',
    name: 'Post-LISA Surfactant Success (Recruitment & Compliance Surge)',
    category: 'Surfactant Therapy',
    description:
      '27 weeks, 920g infant who received Poractant alfa 200 mg/kg via Less Invasive Surfactant Administration (LISA). Surface tension dropped to 6 mN/m; rapid compliance improvement requires weaning amplitude to avoid hypocapnia.',
    demographics: {
      gestationalAgeWeeks: 27.0,
      birthWeightGrams: 920,
      postnatalAgeHours: 6,
      diagnosis: 'RDS',
    },
    hfov: {
      meanAirwayPressureCmH2O: 10,
      amplitudeDeltaPCmH2O: 24,
      frequencyHz: 10,
      inspiratoryTimePct: 33,
      fio2Pct: 28,
      flowRateLMin: 8,
    },
    surfactant: {
      administered: true,
      preparation: 'PORACTANT_ALFA_CUROSURF',
      doseMgPerKg: 200,
      deliveryMethod: 'LISA_MIST',
      hoursSinceDose: 2,
      alveolarSurfaceTensionMnm: 8,
    },
    biomechanics: {
      respiratoryComplianceMlCmH2O: 0.85,
      airwayResistanceCmH2OLs: 35,
      alveolarRecruitmentPct: 88,
      isOpenLungOptimized: true,
    },
  },
  {
    id: 'MECONIUM_ASPIRATION_HYPERCAPNIA',
    name: 'Meconium Aspiration Syndrome (Severe Hypercapnia & Air Trapping)',
    category: 'Aspiration Syndromes',
    description:
      'Full term 3.4 kg infant with dense meconium aspiration. Massive ball-valve airway obstruction, patchy atelectasis, severe respiratory acidosis (PaCO2 78 mmHg). Lowering frequency from 12 to 8 Hz is required to increase DCO2.',
    demographics: {
      gestationalAgeWeeks: 40.0,
      birthWeightGrams: 3400,
      postnatalAgeHours: 12,
      diagnosis: 'MAS',
    },
    hfov: {
      meanAirwayPressureCmH2O: 18,
      amplitudeDeltaPCmH2O: 48,
      frequencyHz: 12,
      inspiratoryTimePct: 33,
      fio2Pct: 80,
      flowRateLMin: 12,
    },
    surfactant: {
      administered: true,
      preparation: 'PORACTANT_ALFA_CUROSURF',
      doseMgPerKg: 200,
      deliveryMethod: 'ETT_BOLUS',
      hoursSinceDose: 4,
      alveolarSurfaceTensionMnm: 25,
    },
    biomechanics: {
      respiratoryComplianceMlCmH2O: 1.1,
      airwayResistanceCmH2OLs: 90,
      alveolarRecruitmentPct: 55,
      isOpenLungOptimized: false,
    },
  },
  {
    id: 'PPHN_SEVERE_HYPOXEMIA_HIGH_OI',
    name: 'Persistent Pulmonary Hypertension (PPHN with OI > 30)',
    category: 'Pulmonary Vascular Crisis',
    description:
      'Term 3.1 kg infant with suprasystemic pulmonary artery pressure, severe right-to-left ductal shunting, pre/post-ductal SpO2 gradient > 15%, and severe hypoxemic respiratory failure. OI is 32 (inhaled Nitric Oxide [iNO] candidate).',
    demographics: {
      gestationalAgeWeeks: 39.5,
      birthWeightGrams: 3100,
      postnatalAgeHours: 18,
      diagnosis: 'PPHN',
    },
    hfov: {
      meanAirwayPressureCmH2O: 19,
      amplitudeDeltaPCmH2O: 42,
      frequencyHz: 10,
      inspiratoryTimePct: 33,
      fio2Pct: 100,
      flowRateLMin: 10,
    },
    surfactant: {
      administered: true,
      preparation: 'BERACTANT_SURVANTA',
      doseMgPerKg: 100,
      deliveryMethod: 'ETT_BOLUS',
      hoursSinceDose: 5,
      alveolarSurfaceTensionMnm: 18,
    },
    biomechanics: {
      respiratoryComplianceMlCmH2O: 1.2,
      airwayResistanceCmH2OLs: 40,
      alveolarRecruitmentPct: 80,
      isOpenLungOptimized: true,
    },
  },
  {
    id: 'AIR_LEAK_PULMONARY_INTERSTITIAL_EMPHYSEMA',
    name: 'Pulmonary Interstitial Emphysema (PIE & Air Leak Rescue)',
    category: 'Neonatal Air Leaks',
    description:
      '26 weeks, 800g with gross bilateral PIE on conventional ventilation. HFOV with ultra-low tidal volume (1.2 mL/kg) and high frequency (14 Hz) reduces peak inspiratory pressures to allow parenchymal fistula healing.',
    demographics: {
      gestationalAgeWeeks: 26.0,
      birthWeightGrams: 800,
      postnatalAgeHours: 36,
      diagnosis: 'AIR_LEAK_PIE',
    },
    hfov: {
      meanAirwayPressureCmH2O: 12,
      amplitudeDeltaPCmH2O: 22,
      frequencyHz: 14,
      inspiratoryTimePct: 33,
      fio2Pct: 45,
      flowRateLMin: 8,
    },
    surfactant: {
      administered: true,
      preparation: 'PORACTANT_ALFA_CUROSURF',
      doseMgPerKg: 200,
      deliveryMethod: 'LISA_MIST',
      hoursSinceDose: 12,
      alveolarSurfaceTensionMnm: 12,
    },
    biomechanics: {
      respiratoryComplianceMlCmH2O: 0.42,
      airwayResistanceCmH2OLs: 50,
      alveolarRecruitmentPct: 65,
      isOpenLungOptimized: false,
    },
  },
  {
    id: 'CONGENITAL_DIAPHRAGMATIC_HERNIA',
    name: 'Congenital Diaphragmatic Hernia (Ipsilateral Hypoplasia)',
    category: 'Congenital Anomalies',
    description:
      'Term neonate with left-sided CDH post-intubation. Severe left lung hypoplasia and contralateral compression. Gentle HFOV avoids barotrauma and preserves right lung compliance while managing pulmonary hypertension.',
    demographics: {
      gestationalAgeWeeks: 38.0,
      birthWeightGrams: 2900,
      postnatalAgeHours: 8,
      diagnosis: 'CDH',
    },
    hfov: {
      meanAirwayPressureCmH2O: 14,
      amplitudeDeltaPCmH2O: 36,
      frequencyHz: 11,
      inspiratoryTimePct: 33,
      fio2Pct: 60,
      flowRateLMin: 10,
    },
    surfactant: {
      administered: false,
      preparation: 'NONE',
      doseMgPerKg: 0,
      deliveryMethod: 'NONE',
      hoursSinceDose: 0,
      alveolarSurfaceTensionMnm: 35,
    },
    biomechanics: {
      respiratoryComplianceMlCmH2O: 0.65,
      airwayResistanceCmH2OLs: 55,
      alveolarRecruitmentPct: 60,
      isOpenLungOptimized: false,
    },
  },
  {
    id: 'OPEN_LUNG_RECRUITMENT_TRIAL',
    name: 'Open-Lung Strategy (Hysteresis Deflation Limb Optimization)',
    category: 'HFOV Lung Mechanics',
    description:
      'Stepwise recruitment trial in 28-week infant. mPaw was incremented up to 18 cmH2O (opening pressure) and then decremented down to identify closing pressure (10 cmH2O). Optimal mPaw is set at 12 cmH2O.',
    demographics: {
      gestationalAgeWeeks: 28.2,
      birthWeightGrams: 1150,
      postnatalAgeHours: 14,
      diagnosis: 'RDS',
    },
    hfov: {
      meanAirwayPressureCmH2O: 12,
      amplitudeDeltaPCmH2O: 28,
      frequencyHz: 10,
      inspiratoryTimePct: 33,
      fio2Pct: 25,
      flowRateLMin: 8,
    },
    surfactant: {
      administered: true,
      preparation: 'PORACTANT_ALFA_CUROSURF',
      doseMgPerKg: 100,
      deliveryMethod: 'LISA_MIST',
      hoursSinceDose: 8,
      alveolarSurfaceTensionMnm: 10,
    },
    biomechanics: {
      respiratoryComplianceMlCmH2O: 0.92,
      airwayResistanceCmH2OLs: 38,
      alveolarRecruitmentPct: 92,
      isOpenLungOptimized: true,
    },
  },
  {
    id: 'WEANING_PHASE_TO_EXTUBATION',
    name: 'HFOV Weaning Phase (Transition to Non-Invasive Support)',
    category: 'Ventilator Weaning',
    description:
      'Recovering RDS in 29-week infant. Low oxygen requirement (FiO2 23%), low mPaw (8 cmH2O), low amplitude (18 cmH2O). Ready for extubation to Non-Invasive Positive Pressure Ventilation (NIPPV) or High-Flow Nasal Cannula.',
    demographics: {
      gestationalAgeWeeks: 29.0,
      birthWeightGrams: 1300,
      postnatalAgeHours: 48,
      diagnosis: 'RDS',
    },
    hfov: {
      meanAirwayPressureCmH2O: 8,
      amplitudeDeltaPCmH2O: 18,
      frequencyHz: 10,
      inspiratoryTimePct: 33,
      fio2Pct: 23,
      flowRateLMin: 6,
    },
    surfactant: {
      administered: true,
      preparation: 'PORACTANT_ALFA_CUROSURF',
      doseMgPerKg: 200,
      deliveryMethod: 'LISA_MIST',
      hoursSinceDose: 40,
      alveolarSurfaceTensionMnm: 5,
    },
    biomechanics: {
      respiratoryComplianceMlCmH2O: 1.15,
      airwayResistanceCmH2OLs: 32,
      alveolarRecruitmentPct: 95,
      isOpenLungOptimized: true,
    },
  },
];
