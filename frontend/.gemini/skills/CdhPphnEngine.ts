/**
 * CdhPphnEngine.ts
 * Neonatal Intensive Care & Pediatric Pulmonary Physiology Engine:
 * Congenital Diaphragmatic Hernia (CDH) & Persistent Pulmonary Hypertension of the Newborn (PPHN).
 *
 * Implements:
 * 1. Anatomical CDH Phenotyping (Left Bochdalek, Right Bochdalek, Bilateral, Morgagni; Liver-up vs Liver-down).
 * 2. Delivery Room Management & Gastric Decompression:
 *    - Strict avoidance of Bag-Mask Ventilation (BMV) preventing intrathoracic gastric distension & contralateral tension collapse.
 *    - Immediate intubation & continuous Replogle suction (10 Fr to continuous low intermittent suction).
 * 3. Gentle Ventilation Protocol (CDH EURO Consortium Guidelines):
 *    - Strict peak inspiratory pressure cap (PIP <= 25 cmH2O) to prevent pulmonary volutrauma / P-SILI.
 *    - Permissive hypercapnia (target PaCO2 45-60 mmHg, pH 7.25-7.40; acceptable PaCO2 65-70 if pH >= 7.25).
 *    - High-Frequency Oscillatory Ventilation (HFOV) rescue for failure of conventional gentle ventilation.
 * 4. PPHN Hemodynamics & Pre- vs Post-Ductal Saturation Gradient:
 *    - Right upper extremity (pre-ductal, prior to ductus arteriosus) vs Lower extremity (post-ductal, post-PDA mixing).
 *    - Gradient > 10% indicates hemodynamically significant right-to-left ductal shunting from severe PPHN.
 * 5. Targeted Pulmonary Vasodilator Therapy:
 *    - Inhaled Nitric Oxide (iNO 20 ppm) - selective cGMP pulmonary vasodilation & non-responder phenotyping.
 *    - Phosphodiesterase-5 Inhibitor (Sildenafil) & Inodilator (Milrinone for LV diastolic dysfunction).
 * 6. Oxygenation Index (OI) & Alveolar-Arterial Gradient (A-a DO2) Severity Stratification:
 *    - OI = (Mean Airway Pressure * FiO2 * 100) / PaO2 (post-ductal).
 * 7. Neonatal Extracorporeal Membrane Oxygenation (ECMO) Eligibility & Criteria:
 *    - OI >= 40 sustained, intractable acidosis (pH < 7.15), gestational age >= 34 weeks, weight >= 2.0 kg, cranial ultrasound IVH screening.
 * 8. Delayed Surgical Repair Stabilization Checklist (CDH EURO Consortium).
 */

export type CdhDefectType = 'LEFT_BOCHDALEK' | 'RIGHT_BOCHDALEK' | 'BILATERAL' | 'MORGAGNI';
export type VentilationMode = 'CONVENTIONAL_GENTLE' | 'CONVENTIONAL_AGGRESSIVE' | 'HFOV';
export type EcmoMode = 'NONE' | 'VA_ECMO' | 'VV_ECMO';

export interface CdhPatientParams {
  gestationalAgeWeeks: number; // e.g. 34 to 41 (normal term >= 37)
  birthWeightKg: number; // e.g. 1.8 to 4.2 kg
  defectType: CdhDefectType;
  stomachPosition: 'INTRATHORACIC' | 'INTRAABDOMINAL';
  liverHerniated: boolean; // Liver-up is a strong marker of severe pulmonary hypoplasia
  bagMaskVentilationApplied: boolean; // Lethal iatrogenic delivery room error
  ogTubeDecompression: boolean; // 10 Fr Replogle tube to continuous low suction
  ventilationMode: VentilationMode;
  pip: number; // Peak Inspiratory Pressure (cmH2O, normal gentle <= 25)
  peep: number; // Positive End-Expiratory Pressure (cmH2O, normal 3-5)
  rateBpm: number; // Respiratory rate (breaths/min, normal 30-60)
  fiO2: number; // Fractional inspired O2 (0.21 to 1.0)
  hfovMeanAirwayPressure: number; // Mean Airway Pressure in HFOV (cmH2O, normal 13-17)
  hfovAmplitude: number; // Delta-P amplitude (cmH2O, normal 25-45)
  hfovFrequencyHz: number; // Frequency in Hz (normal 10-12 Hz)
  iNoDosePpm: number; // Inhaled Nitric Oxide (ppm, normal 0-20, max 40)
  sildenafilDoseMgKgH: number; // PDE-5 inhibitor (mg/kg/h, normal 0.06-0.12)
  milrinoneDoseMcgKgMin: number; // PDE-3 inodilator (mcg/kg/min, normal 0.25-0.75)
  norepinephrineDoseMcgKgMin: number; // Vasopressor for systemic SVR target (mcg/kg/min)
  cranialUltrasoundGradeIvh: 0 | 1 | 2 | 3 | 4; // Intraventricular Hemorrhage grade
  ecmoCannulated: boolean;
  ecmoMode: EcmoMode;
}

export interface CdhHemodynamicOutput {
  preDuctalSpO2: number; // % (Right hand / pre-ductal)
  postDuctalSpO2: number; // % (Lower extremities / post-ductal)
  saturationGradient: number; // % (Pre - Post)
  preDuctalPaO2: number; // mmHg
  postDuctalPaO2: number; // mmHg
  paCO2: number; // mmHg
  arterialPh: number;
  oxygenationIndex: number; // OI = (MAP * FiO2 * 100) / PaO2
  meanAirwayPressure: number; // cmH2O
  aaGradient: number; // mmHg (A-a DO2)
  pulmonaryVascularResistanceDyn: number; // dyn*s/cm^5
  estimatedRvSystolicPressure: number; // mmHg
  systemicSystolicBp: number; // mmHg
  systemicMeanBp: number; // mmHg
  pdaShuntDirection: 'LEFT_TO_RIGHT' | 'BIDIRECTIONAL' | 'RIGHT_TO_LEFT';
  pdaShuntFractionPct: number; // % right-to-left shunt
  gastricDistentionTensionAlert: boolean;
  pneumothoraxRisk: 'LOW' | 'MODERATE' | 'CRITICAL';
  barotraumaPiliAlert: boolean;
  iNoResponseState: 'RESPONDER' | 'PARTIAL' | 'NON_RESPONDER' | 'PARADOXICAL_LV_EDEMA';
  ecmoEligibility: {
    isEligible: boolean;
    criteriaMet: string[];
    contraindications: string[];
    recommendation: string;
  };
  surgicalReadiness: {
    isStable: boolean;
    stabilityScore: number; // 0 to 100
    unmetCriteria: string[];
    verdict: string;
  };
  clinicalAlerts: Array<{
    level: 'CRITICAL' | 'WARNING' | 'SUCCESS' | 'INFO';
    message: string;
    rationale: string;
  }>;
}

export const DEFAULT_CDH_PATIENT: CdhPatientParams = {
  gestationalAgeWeeks: 38.5,
  birthWeightKg: 3.2,
  defectType: 'LEFT_BOCHDALEK',
  stomachPosition: 'INTRATHORACIC',
  liverHerniated: false,
  bagMaskVentilationApplied: false,
  ogTubeDecompression: true,
  ventilationMode: 'CONVENTIONAL_GENTLE',
  pip: 22,
  peep: 4,
  rateBpm: 45,
  fiO2: 0.50,
  hfovMeanAirwayPressure: 14,
  hfovAmplitude: 30,
  hfovFrequencyHz: 10,
  iNoDosePpm: 20,
  sildenafilDoseMgKgH: 0.0,
  milrinoneDoseMcgKgMin: 0.35,
  norepinephrineDoseMcgKgMin: 0.05,
  cranialUltrasoundGradeIvh: 0,
  ecmoCannulated: false,
  ecmoMode: 'NONE'
};

/**
 * Calculates pre- and post-ductal SpO2 from PaO2 using Hill equation for fetal hemoglobin (HbF ~70-80% in term neonates)
 */
export function calculateNeonatalSpO2(paO2: number): number {
  if (paO2 <= 0) return 0;
  const n = 2.65;
  const p50 = 21.0;
  const sat = (Math.pow(paO2, n) / (Math.pow(paO2, n) + Math.pow(p50, n))) * 100;
  return Math.min(100, Math.max(10, Math.round(sat * 10) / 10));
}

/**
 * Main Biophysical Simulation Function for Neonatal CDH & PPHN
 */
export function computeCdhPphnPhysiology(params: CdhPatientParams): CdhHemodynamicOutput {
  const alerts: CdhHemodynamicOutput['clinicalAlerts'] = [];
  const criteriaMet: string[] = [];
  const contraindications: string[] = [];
  const unmetSurgicalCriteria: string[] = [];

  // 1. Mean Airway Pressure (MAP) computation
  let meanAirwayPressure = 0;
  if (params.ventilationMode === 'HFOV') {
    meanAirwayPressure = params.hfovMeanAirwayPressure;
  } else {
    const cycleTime = 60 / Math.max(20, params.rateBpm);
    const ti = 0.35;
    const dutyCycle = Math.min(0.5, ti / cycleTime);
    meanAirwayPressure = params.peep + (params.pip - params.peep) * dutyCycle;
  }
  meanAirwayPressure = Math.round(meanAirwayPressure * 10) / 10;

  // 2. Barotrauma & Gastric Distension Assessment
  const barotraumaPiliAlert = params.ventilationMode !== 'HFOV' && params.pip > 25;
  const gastricDistentionTensionAlert = params.bagMaskVentilationApplied || (!params.ogTubeDecompression && params.stomachPosition === 'INTRATHORACIC');

  let pneumothoraxRisk: 'LOW' | 'MODERATE' | 'CRITICAL' = 'LOW';
  if (gastricDistentionTensionAlert && params.pip > 28) {
    pneumothoraxRisk = 'CRITICAL';
  } else if (gastricDistentionTensionAlert || params.pip > 25) {
    pneumothoraxRisk = 'MODERATE';
  }

  if (params.bagMaskVentilationApplied) {
    alerts.push({
      level: 'CRITICAL',
      message: 'FATAL DELIVERY ROOM ERROR: Bag-Mask Ventilation (BMV) Applied in CDH',
      rationale: 'Positive pressure mask ventilation forces gas directly into the herniated stomach and viscera in the hemithorax, causing rapid mediastinal displacement, contralateral compression, and fatal cardiac arrest. Immediate intubation without BMV is mandatory.'
    });
  }

  if (barotraumaPiliAlert) {
    alerts.push({
      level: 'WARNING',
      message: 'BAROTRAUMA HAZARD: PIP ' + params.pip + ' cmH2O Exceeds Gentle Ventilation Ceiling (<=25 cmH2O)',
      rationale: 'Hypoplastic neonatal lungs are exquisitely susceptible to ventilator-induced lung injury (P-SILI) and contralateral tension pneumothorax. CDH EURO guidelines mandate capping PIP at <=25 cmH2O with permissive hypercapnia, or transitioning to HFOV.'
    });
  }

  if (!params.ogTubeDecompression) {
    alerts.push({
      level: 'WARNING',
      message: 'Continuous Replogle Gastrointestinal Suction Missing',
      rationale: 'A 10 Fr Replogle tube to continuous low suction (-20 to -30 mmHg) must be placed immediately at birth to keep the intrathoracic stomach and bowel decompressed, preserving contralateral lung expansion.'
    });
  }

  // 3. Baseline Pulmonary Vascular Resistance (PVR) Modeling
  let basePvr = 1600;
  if (params.defectType === 'BILATERAL') basePvr += 800;
  if (params.liverHerniated) basePvr += 500;
  if (params.stomachPosition === 'INTRATHORACIC') basePvr += 200;

  if (params.peep > 6) {
    basePvr += (params.peep - 6) * 80;
  }
  if (params.pip > 25) {
    basePvr += (params.pip - 25) * 60;
  }
  if (gastricDistentionTensionAlert) {
    basePvr += 600;
  }

  // Vasodilator Pharmacodynamics
  let iNoEffect = 0;
  if (params.iNoDosePpm > 0) {
    const cappedIno = Math.min(20, params.iNoDosePpm);
    iNoEffect = (cappedIno / 20) * 350;
    if (params.iNoDosePpm > 20) {
      iNoEffect += (params.iNoDosePpm - 20) * 2;
    }
  }

  const sildenafilEffect = Math.min(0.12, params.sildenafilDoseMgKgH) * 1500;
  const milrinoneEffect = Math.min(0.75, params.milrinoneDoseMcgKgMin) * 300;

  const totalPvrReduction = iNoEffect + sildenafilEffect + milrinoneEffect;
  const pulmonaryVascularResistanceDyn = Math.max(350, Math.round(basePvr - totalPvrReduction));

  let iNoResponseState: CdhHemodynamicOutput['iNoResponseState'] = 'NON_RESPONDER';
  if (params.iNoDosePpm >= 10) {
    if (params.liverHerniated && totalPvrReduction < 250) {
      iNoResponseState = 'NON_RESPONDER';
    } else if (totalPvrReduction > 450) {
      iNoResponseState = 'RESPONDER';
    } else {
      iNoResponseState = 'PARTIAL';
    }
  }

  let systemicMeanBp = params.gestationalAgeWeeks;
  if (params.norepinephrineDoseMcgKgMin > 0) {
    systemicMeanBp += Math.min(0.4, params.norepinephrineDoseMcgKgMin) * 80;
  }
  if (gastricDistentionTensionAlert) {
    systemicMeanBp -= 16;
  }
  if (barotraumaPiliAlert) {
    systemicMeanBp -= 6;
  }
  systemicMeanBp = Math.max(20, Math.round(systemicMeanBp));
  const systemicSystolicBp = Math.round(systemicMeanBp * 1.35);

  let estimatedRvSystolicPressure = Math.round(pulmonaryVascularResistanceDyn / 24);
  if (gastricDistentionTensionAlert) estimatedRvSystolicPressure += 15;
  estimatedRvSystolicPressure = Math.max(25, Math.min(110, estimatedRvSystolicPressure));

  let pdaShuntDirection: 'LEFT_TO_RIGHT' | 'BIDIRECTIONAL' | 'RIGHT_TO_LEFT' = 'RIGHT_TO_LEFT';
  let pdaShuntFractionPct = 0;

  if (estimatedRvSystolicPressure > systemicSystolicBp + 3) {
    pdaShuntDirection = 'RIGHT_TO_LEFT';
    const excess = estimatedRvSystolicPressure - systemicSystolicBp;
    pdaShuntFractionPct = Math.min(80, Math.max(25, Math.round(25 + (excess / systemicSystolicBp) * 60)));
  } else if (Math.abs(estimatedRvSystolicPressure - systemicSystolicBp) <= 3) {
    pdaShuntDirection = 'BIDIRECTIONAL';
    pdaShuntFractionPct = 15;
  } else {
    pdaShuntDirection = 'LEFT_TO_RIGHT';
    pdaShuntFractionPct = 0;
  }

  // Gas Exchange Modeling
  let paCO2 = 48;
  if (params.ventilationMode === 'HFOV') {
    const hfovEfficiency = (params.hfovAmplitude / 30) * (10 / params.hfovFrequencyHz);
    paCO2 = Math.max(32, Math.round(52 - (hfovEfficiency - 1) * 16));
  } else {
    const minuteVentFactor = (params.rateBpm / 45) * ((params.pip - params.peep) / 18);
    paCO2 = Math.max(30, Math.round(65 / Math.max(0.5, minuteVentFactor)));
  }

  if (gastricDistentionTensionAlert) {
    paCO2 += 22;
  }

  const hco3 = 22;
  let arterialPh = 6.1 + Math.log10(hco3 / (0.03 * paCO2));
  if (gastricDistentionTensionAlert) arterialPh -= 0.15;
  if (pulmonaryVascularResistanceDyn > 1800) arterialPh -= 0.08;
  arterialPh = Math.round(arterialPh * 100) / 100;

  const pAtm = 760;
  const pH2O = 47;
  const pAO2 = (pAtm - pH2O) * params.fiO2 - (paCO2 / 0.8);

  let preDuctalPaO2 = Math.round(pAO2 * 0.45);
  if (params.liverHerniated) preDuctalPaO2 *= 0.82;
  if (gastricDistentionTensionAlert) preDuctalPaO2 *= 0.55;
  if (barotraumaPiliAlert) preDuctalPaO2 *= 0.88;
  if (params.iNoDosePpm >= 10 && iNoResponseState === 'RESPONDER') preDuctalPaO2 += 25;
  if (params.ventilationMode === 'HFOV') preDuctalPaO2 += 12;

  preDuctalPaO2 = Math.max(22, Math.min(250, Math.round(preDuctalPaO2)));

  const mixedVenousPaO2 = 24;
  let postDuctalPaO2 = preDuctalPaO2;
  if (pdaShuntDirection === 'RIGHT_TO_LEFT') {
    const shuntFraction = pdaShuntFractionPct / 100;
    postDuctalPaO2 = Math.round(preDuctalPaO2 * (1 - shuntFraction) + mixedVenousPaO2 * shuntFraction);
  } else if (pdaShuntDirection === 'BIDIRECTIONAL') {
    postDuctalPaO2 = Math.round(preDuctalPaO2 * 0.88 + mixedVenousPaO2 * 0.12);
  }
  postDuctalPaO2 = Math.max(18, Math.min(preDuctalPaO2, Math.round(postDuctalPaO2)));

  let preDuctalSpO2 = calculateNeonatalSpO2(preDuctalPaO2);
  let postDuctalSpO2 = calculateNeonatalSpO2(postDuctalPaO2);

  if (params.ecmoCannulated && params.ecmoMode === 'VA_ECMO') {
    preDuctalSpO2 = 98;
    postDuctalSpO2 = 98;
    preDuctalPaO2 = 120;
    postDuctalPaO2 = 115;
    paCO2 = 40;
    arterialPh = 7.38;
    estimatedRvSystolicPressure = Math.round(systemicSystolicBp * 0.65);
    pdaShuntDirection = 'LEFT_TO_RIGHT';
    pdaShuntFractionPct = 0;
  }

  const saturationGradient = Math.max(0, Math.round((preDuctalSpO2 - postDuctalSpO2) * 10) / 10);
  const oxygenationIndex = Math.round(((meanAirwayPressure * params.fiO2 * 100) / Math.max(15, postDuctalPaO2)) * 10) / 10;
  const aaGradient = Math.max(0, Math.round(pAO2 - postDuctalPaO2));

  if (saturationGradient >= 10) {
    alerts.push({
      level: 'CRITICAL',
      message: 'SIGNIFICANT DUCTAL SHUNT: Pre/Post-Ductal Saturation Gradient ' + saturationGradient + '% (>=10%)',
      rationale: 'Right upper extremity SpO2 (' + preDuctalSpO2 + '%) exceeds post-ductal SpO2 (' + postDuctalSpO2 + '%) by ' + saturationGradient + '%. This confirms severe suprasystemic pulmonary hypertension with massive Right-to-Left shunting of desaturated blood through the ductus arteriosus.'
    });
  } else if (saturationGradient >= 5) {
    alerts.push({
      level: 'WARNING',
      message: 'Moderate Ductal Shunt Gradient ' + saturationGradient + '% (5-9%)',
      rationale: 'Right-to-left ductal shunting remains active. Continue targeted pulmonary vasodilator optimization.'
    });
  } else {
    alerts.push({
      level: 'SUCCESS',
      message: 'Minimal Ductal Gradient (' + saturationGradient + '%) - Subsystemic Pulmonary Pressures',
      rationale: 'Absence of significant pre-to-post ductal gradient indicates transition to bidirectional or left-to-right shunt and resolving PPHN crisis.'
    });
  }

  // ECMO Eligibility Evaluation
  if (oxygenationIndex >= 40) {
    criteriaMet.push('Sustained Oxygenation Index (OI ' + oxygenationIndex + ') >= 40 despite maximal medical management');
  } else if (oxygenationIndex >= 25 && arterialPh < 7.20) {
    criteriaMet.push('Refractory hypoxemic failure (OI ' + oxygenationIndex + ') with severe metabolic acidosis (pH ' + arterialPh + ')');
  }

  if (params.gestationalAgeWeeks < 34) {
    contraindications.push('Gestational age ' + params.gestationalAgeWeeks + ' weeks is < 34 weeks (catastrophic risk of intraventricular hemorrhage from systemic heparinization)');
  }
  if (params.birthWeightKg < 2.0) {
    contraindications.push('Birth weight ' + params.birthWeightKg + ' kg is < 2.0 kg (vessel caliber too small for neonatal ECMO cannulae)');
  }
  if (params.cranialUltrasoundGradeIvh >= 3) {
    contraindications.push('Grade ' + params.cranialUltrasoundGradeIvh + ' Intraventricular Hemorrhage (IVH) - systemic anticoagulation is absolutely contraindicated');
  }

  const isEligibleForEcmo = criteriaMet.length > 0 && contraindications.length === 0;
  let ecmoRecommendation = '';
  if (params.ecmoCannulated) {
    ecmoRecommendation = 'Patient successfully cannulated on ' + params.ecmoMode + '. Lung rest ventilation settings active (PIP 18, PEEP 4-6, Rate 20-30, FiO2 0.30-0.40).';
  } else if (isEligibleForEcmo) {
    ecmoRecommendation = 'PROMPT VA-ECMO CANNULATION INDICATED: Reversible hypoplastic respiratory failure with suprasystemic PPHN refractory to gentle ventilation, iNO, and inotropes.';
  } else if (contraindications.length > 0) {
    ecmoRecommendation = 'ECMO CONTRAINDICATED: Patient does not meet safety criteria due to: ' + contraindications.join('; ') + '. Continue maximal non-invasive / HFOV medical rescue.';
  } else {
    ecmoRecommendation = 'ECMO NOT CURRENTLY INDICATED: Patient maintaining adequate oxygenation (OI < 25-40) and acid-base status on current gentle ventilation protocol.';
  }

  // Delayed Surgical Repair Readiness Checklist
  let stabilityScore = 100;
  if (saturationGradient >= 5) {
    stabilityScore -= 25;
    unmetSurgicalCriteria.push('Ductal saturation gradient ' + saturationGradient + '% exceeds 5% threshold (active PPHN shunting)');
  }
  if (estimatedRvSystolicPressure >= systemicSystolicBp * 0.85) {
    stabilityScore -= 25;
    unmetSurgicalCriteria.push('Estimated RVSP (' + estimatedRvSystolicPressure + ' mmHg) is near-systemic or suprasystemic (exceeds 85% of SBP ' + systemicSystolicBp + ' mmHg)');
  }
  if (params.fiO2 > 0.50) {
    stabilityScore -= 15;
    unmetSurgicalCriteria.push('FiO2 ' + (params.fiO2 * 100).toFixed(0) + '% exceeds 50% weaning benchmark');
  }
  if (params.ventilationMode !== 'HFOV' && params.pip > 25) {
    stabilityScore -= 20;
    unmetSurgicalCriteria.push('PIP ' + params.pip + ' cmH2O exceeds gentle ceiling (<=25 cmH2O)');
  }
  if (arterialPh < 7.25) {
    stabilityScore -= 15;
    unmetSurgicalCriteria.push('Arterial pH ' + arterialPh + ' is acidemic (< 7.25)');
  }

  stabilityScore = Math.max(0, stabilityScore);
  const isSurgicallyStable = unmetSurgicalCriteria.length === 0 && stabilityScore >= 80;
  const surgicalVerdict = isSurgicallyStable
    ? 'SURGICAL REPAIR CANDIDATE: Patient has achieved hemodynamic and pulmonary stabilization with subsystemic RV pressures and gentle ventilator requirements.'
    : 'DEFER SURGERY: Patient remains in the physiological instability window (' + unmetSurgicalCriteria.length + ' unmet stability criteria). Immediate repair in the presence of severe PPHN precipitates fatal pulmonary hypertensive crisis.';

  return {
    preDuctalSpO2,
    postDuctalSpO2,
    saturationGradient,
    preDuctalPaO2,
    postDuctalPaO2,
    paCO2,
    arterialPh,
    oxygenationIndex,
    meanAirwayPressure,
    aaGradient,
    pulmonaryVascularResistanceDyn,
    estimatedRvSystolicPressure,
    systemicSystolicBp,
    systemicMeanBp,
    pdaShuntDirection,
    pdaShuntFractionPct,
    gastricDistentionTensionAlert,
    pneumothoraxRisk,
    barotraumaPiliAlert,
    iNoResponseState,
    ecmoEligibility: {
      isEligible: isEligibleForEcmo,
      criteriaMet,
      contraindications,
      recommendation: ecmoRecommendation
    },
    surgicalReadiness: {
      isStable: isSurgicallyStable,
      stabilityScore,
      unmetCriteria: unmetSurgicalCriteria,
      verdict: surgicalVerdict
    },
    clinicalAlerts: alerts
  };
}
