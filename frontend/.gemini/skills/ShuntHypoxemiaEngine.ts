/**
 * ShuntHypoxemiaEngine.ts
 * 
 * Pulmonology, Critical Care & Respiratory Physiology Engine
 * Part of Track A70: The Grand Capstone of Track A (Mediverse Platform)
 * 
 * Core Capabilities:
 * 1. Alveolar Gas Equation (PAO2) across atmospheric pressure / altitude and respiratory exchange ratio (R).
 * 2. Alveolar-Arterial (A-a) Oxygen Gradient calculation and age-adjusted normative thresholds.
 * 3. Five Mechanisms of Hypoxemia Differential Classifier:
 *    - Low PiO2 (Altitude / Hypobaric hypoxia)
 *    - Hypoventilation (Depressed minute ventilation with normal A-a gradient)
 *    - V/Q Mismatch (Dead-space / low V/Q responsive to supplemental O2)
 *    - Right-to-Left Shunt (Intrapulmonary or intracardiac, refractory to 100% O2)
 *    - Diffusion Impairment (Alveolocapillary membrane thickening, exertional desaturation)
 * 4. Classic Berggren Shunt Fraction (Qs/Qt) Solver:
 *    - End-capillary, arterial, and mixed-venous oxygen content (Cc'O2, CaO2, CvO2).
 *    - 100% Oxygen (Hyperoxia) Challenge test modeling.
 * 5. Global Oxygen Delivery (DO2), Consumption (VO2), and Oxygen Extraction Ratio (OER):
 *    - Critical DO2 threshold (DO2,crit) and anaerobic threshold warning.
 * 6. P/F Ratio & Berlin ARDS Severity Classification.
 * 7. Bohr-Enghoff Dead Space Fraction (VD/VT).
 */

export type HypoxemiaMechanism =
  | 'LOW_FIO2_ALTITUDE'
  | 'HYPOVENTILATION'
  | 'VQ_MISMATCH'
  | 'RIGHT_TO_LEFT_SHUNT'
  | 'DIFFUSION_IMPAIRMENT'
  | 'NORMAL_OXYGENATION';

export type ARDSSeverity =
  | 'NONE'
  | 'MILD'
  | 'MODERATE'
  | 'SEVERE';

export interface RespiratoryParameters {
  age: number; // years (e.g. 18 - 95)
  barometricPressure: number; // mmHg (sea level = 760, 4500m = ~430)
  waterVaporPressure?: number; // mmHg at 37°C, default 47
  fiO2: number; // 0.21 - 1.00
  paO2: number; // mmHg (arterial PO2)
  paCO2: number; // mmHg (arterial PCO2)
  respiratoryQuotient: number; // R, default 0.8 (0.7 - 1.0)
  hemoglobin: number; // g/dL (e.g. 7.0 - 20.0)
  saO2: number; // arterial O2 saturation % (e.g. 50 - 100)
  svO2: number; // mixed venous O2 saturation % (e.g. 30 - 85, default 70-75)
  pvO2?: number; // mixed venous PO2 mmHg, default 40
  cardiacOutput: number; // L/min (e.g. 2.0 - 12.0)
  bodySurfaceArea?: number; // m2, default 1.8
  peCO2?: number; // Mixed expired PCO2 for Bohr dead space, mmHg (optional)
  diffusionDefectPresent?: boolean;
}

export interface OxygenContentMetrics {
  caO2: number; // Arterial oxygen content (mL O2 / dL blood)
  cvO2: number; // Mixed venous oxygen content (mL O2 / dL blood)
  ccO2: number; // End-capillary oxygen content (mL O2 / dL blood)
  cAVDifference: number; // Arteriovenous O2 difference (mL O2 / dL blood)
}

export interface ShuntCalculationResult {
  pAO2: number; // Alveolar PO2 (mmHg)
  aaGradient: number; // A-a gradient (mmHg)
  expectedAaGradient: number; // Age-adjusted expected normal A-a gradient (mmHg)
  isAaElevated: boolean;
  pfRatio: number; // PaO2 / FiO2 ratio (mmHg)
  ardsClassification: ARDSSeverity;
  shuntFraction: number; // Qs/Qt percentage (e.g. 3% - 50%)
  hyperoxiaPredictedPaO2: number; // Predicted PaO2 on 100% FiO2 given this shunt
  isRefractoryToOxygen: boolean; // Shunt > 20% leads to blunted response to 100% FiO2
  oxygenContent: OxygenContentMetrics;
  do2: number; // Oxygen delivery (mL/min)
  vo2: number; // Oxygen consumption (mL/min)
  oer: number; // Oxygen extraction ratio (%)
  isCriticalDO2: boolean; // True if DO2 < critical threshold (~330 mL/min for 70kg)
  vdVtFraction?: number; // Dead space fraction if PeCO2 provided
  primaryMechanism: HypoxemiaMechanism;
  differentialAnalysis: string[];
  clinicalRecommendations: string[];
}

/**
 * Calculates Alveolar Partial Pressure of Oxygen (PAO2) using the Alveolar Gas Equation:
 * PAO2 = (P_atm - P_H2O) * FiO2 - (PaCO2 / R)
 */
export function calculatePAO2(
  barometricPressure: number,
  fiO2: number,
  paCO2: number,
  respiratoryQuotient: number = 0.8,
  waterVaporPressure: number = 47
): number {
  const pAtm = Math.max(250, barometricPressure);
  const pH2O = Math.max(0, waterVaporPressure);
  const r = Math.max(0.6, Math.min(1.2, respiratoryQuotient));
  const fO2 = Math.max(0.15, Math.min(1.0, fiO2));
  
  const pAO2 = (pAtm - pH2O) * fO2 - (paCO2 / r);
  return Math.max(0, parseFloat(pAO2.toFixed(1)));
}

/**
 * Expected normal A-a gradient on room air (FiO2 0.21) based on age:
 * Normal = (Age / 4) + 4
 */
export function calculateExpectedAaGradient(age: number, fiO2: number = 0.21): number {
  const safeAge = Math.max(1, Math.min(120, age));
  const baseline = (safeAge / 4) + 4;
  
  // On supplemental oxygen, normal A-a gradient widens approximately by (FiO2 - 0.21) * 55
  if (fiO2 > 0.21) {
    const hyperoxiaOffset = (fiO2 - 0.21) * 55;
    return parseFloat((baseline + hyperoxiaOffset).toFixed(1));
  }
  return parseFloat(baseline.toFixed(1));
}

/**
 * Calculates Blood Oxygen Content in mL O2 / dL blood:
 * CxO2 = (1.34 * Hb * (SxO2 / 100)) + (0.0031 * PxO2)
 */
export function calculateOxygenContent(
  hemoglobin: number,
  saturationPercent: number,
  partialPressure: number
): number {
  const hb = Math.max(1.0, hemoglobin);
  const sat = Math.max(0, Math.min(100, saturationPercent)) / 100;
  const pp = Math.max(0, partialPressure);

  const boundO2 = 1.34 * hb * sat;
  const dissolvedO2 = 0.0031 * pp;
  return parseFloat((boundO2 + dissolvedO2).toFixed(2));
}

/**
 * Solves Berggren Shunt Equation (Qs/Qt):
 * Qs / Qt = (Cc'O2 - CaO2) / (Cc'O2 - CvO2)
 * Where:
 * - Cc'O2 is calculated assuming 100% saturation at alveolar PO2 (PAO2)
 * - CaO2 is arterial oxygen content
 * - CvO2 is mixed venous oxygen content
 */
export function calculateShuntFraction(
  ccO2: number,
  caO2: number,
  cvO2: number
): number {
  const numerator = ccO2 - caO2;
  const denominator = ccO2 - cvO2;

  if (denominator <= 0.001 || numerator <= 0) {
    return 3.0; // Physiological lower bound (~3%)
  }

  const fraction = (numerator / denominator) * 100;
  // Bound between physiological min (2-3%) and physical max (85%)
  return parseFloat(Math.max(2.0, Math.min(85.0, fraction)).toFixed(1));
}

/**
 * Predicts PaO2 if the patient is placed on 100% FiO2 given their current shunt fraction (Qs/Qt)
 * In pure V/Q mismatch (shunt ~3-5%), PaO2 climbs to 500-600 mmHg.
 * In 20% shunt, PaO2 peaks at ~180-220 mmHg.
 * In 35% shunt (severe ARDS), PaO2 remains blunted at ~65-95 mmHg despite 100% FiO2.
 */
export function predictPaO2OnHyperoxia(
  shuntFractionPercent: number,
  hemoglobin: number,
  cAVDifference: number = 4.5,
  pAtm: number = 760,
  paCO2: number = 40
): number {
  const qsQt = Math.max(2.0, Math.min(85.0, shuntFractionPercent)) / 100;
  const pAO2Hyperoxia = (pAtm - 47) * 1.0 - (paCO2 / 0.8);
  const ccO2Hyperoxia = 1.34 * hemoglobin * 1.0 + 0.0031 * pAO2Hyperoxia;
  
  const contentDeficit = (qsQt * cAVDifference) / Math.max(0.05, 1 - qsQt);
  const targetCaO2 = ccO2Hyperoxia - contentDeficit;
  
  // If targetCaO2 >= max bound hemoglobin capacity (1.34 * Hb), then PaO2 is in dissolved phase:
  const maxBound = 1.34 * hemoglobin;
  if (targetCaO2 > maxBound) {
    const dissolvedO2 = targetCaO2 - maxBound;
    const predictedPaO2 = dissolvedO2 / 0.0031;
    return parseFloat(Math.min(650, Math.max(40, predictedPaO2)).toFixed(0));
  } else {
    // Under-saturated hemoglobin: estimate PaO2 from Hill equation inverse
    const satFrac = Math.max(0.4, Math.min(0.99, targetCaO2 / maxBound));
    const p50 = 26.8;
    const predictedPaO2 = p50 * Math.pow(satFrac / (1 - satFrac), 1 / 2.7);
    return parseFloat(Math.max(30, Math.min(150, predictedPaO2)).toFixed(0));
  }
}

/**
 * Evaluates the five classic mechanisms of hypoxemia
 */
export function classifyHypoxemiaMechanism(
  barometricPressure: number,
  fiO2: number,
  paO2: number,
  paCO2: number,
  aaGradient: number,
  expectedAa: number,
  shuntFraction: number,
  diffusionDefect?: boolean
): HypoxemiaMechanism {
  if (paO2 >= 80 && aaGradient <= expectedAa * 1.3) {
    return 'NORMAL_OXYGENATION';
  }

  // 1. Low inspired PO2 (Altitude or low FiO2)
  const piO2 = (barometricPressure - 47) * fiO2;
  if (piO2 < 120 && aaGradient <= expectedAa * 1.35) {
    return 'LOW_FIO2_ALTITUDE';
  }

  // 2. Hypoventilation (High PaCO2 with NORMAL A-a gradient)
  if (paCO2 > 45 && aaGradient <= expectedAa * 1.35) {
    return 'HYPOVENTILATION';
  }

  // 3. Shunt (Elevated A-a gradient and true anatomical or physiological shunt >= 20%)
  if (shuntFraction >= 20.0) {
    return 'RIGHT_TO_LEFT_SHUNT';
  }

  // 4. Diffusion Impairment
  if (diffusionDefect && aaGradient > expectedAa * 1.3) {
    return 'DIFFUSION_IMPAIRMENT';
  }

  // 5. V/Q Mismatch (Elevated A-a gradient with shunt < 20% and responsive to O2)
  if (aaGradient > expectedAa * 1.35) {
    return 'VQ_MISMATCH';
  }

  return 'NORMAL_OXYGENATION';
}

/**
 * Classifies Berlin Definition for ARDS based on PaO2 / FiO2 ratio
 */
export function classifyARDS(pfRatio: number): ARDSSeverity {
  if (pfRatio > 300) return 'NONE';
  if (pfRatio > 200) return 'MILD';
  if (pfRatio > 100) return 'MODERATE';
  return 'SEVERE';
}

/**
 * Main Comprehensive Respiratory Physiology Evaluation
 */
export function analyzeRespiratoryPhysiology(params: RespiratoryParameters): ShuntCalculationResult {
  const {
    age,
    barometricPressure,
    waterVaporPressure = 47,
    fiO2,
    paO2,
    paCO2,
    respiratoryQuotient = 0.8,
    hemoglobin,
    saO2,
    svO2,
    pvO2 = 40,
    cardiacOutput,
    bodySurfaceArea = 1.8,
    peCO2,
    diffusionDefectPresent = false
  } = params;

  // 1. Alveolar PO2
  const pAO2 = calculatePAO2(barometricPressure, fiO2, paCO2, respiratoryQuotient, waterVaporPressure);

  // 2. A-a Gradient
  const aaGradient = parseFloat(Math.max(0, pAO2 - paO2).toFixed(1));
  const expectedAaGradient = calculateExpectedAaGradient(age, fiO2);
  const isAaElevated = aaGradient > expectedAaGradient * 1.25;

  // 3. Oxygen Contents (CaO2, CvO2, Cc'O2)
  const caO2 = calculateOxygenContent(hemoglobin, saO2, paO2);
  const cvO2 = calculateOxygenContent(hemoglobin, svO2, pvO2);
  // End capillary assumes 100% saturation and PO2 equal to PAO2
  const ccO2 = calculateOxygenContent(hemoglobin, 100, pAO2);
  const cAVDifference = parseFloat(Math.max(0.5, caO2 - cvO2).toFixed(2));

  // 4. Shunt Fraction
  const shuntFraction = calculateShuntFraction(ccO2, caO2, cvO2);

  // 5. Hyperoxia Challenge Prediction
  const hyperoxiaPredictedPaO2 = predictPaO2OnHyperoxia(shuntFraction, hemoglobin, cAVDifference, barometricPressure, paCO2);
  const isRefractoryToOxygen = shuntFraction >= 20.0 || hyperoxiaPredictedPaO2 < 200;

  // 6. Oxygen Delivery & Consumption
  // DO2 = CO (L/min) * CaO2 (mL/dL) * 10 = mL/min
  const do2 = parseFloat((cardiacOutput * caO2 * 10).toFixed(0));
  // VO2 = CO (L/min) * (CaO2 - CvO2) * 10 = mL/min
  const vo2 = parseFloat((cardiacOutput * cAVDifference * 10).toFixed(0));
  // OER = VO2 / DO2 * 100
  const oer = do2 > 0 ? parseFloat(((vo2 / do2) * 100).toFixed(1)) : 25.0;
  const isCriticalDO2 = do2 < 330; // Critical supply-dependence threshold

  // 7. P/F Ratio & ARDS
  const pfRatio = parseFloat((paO2 / fiO2).toFixed(0));
  const ardsClassification = classifyARDS(pfRatio);

  // 8. Bohr-Enghoff Dead Space Fraction (VD/VT)
  let vdVtFraction: number | undefined = undefined;
  if (peCO2 !== undefined && paCO2 > 0) {
    vdVtFraction = parseFloat(Math.max(0, Math.min(0.9, (paCO2 - peCO2) / paCO2)).toFixed(2));
  }

  // 9. Primary Mechanism
  const primaryMechanism = classifyHypoxemiaMechanism(
    barometricPressure,
    fiO2,
    paO2,
    paCO2,
    aaGradient,
    expectedAaGradient,
    shuntFraction,
    diffusionDefectPresent
  );

  // 10. Differential Analysis
  const differentialAnalysis: string[] = [];
  if (primaryMechanism === 'HYPOVENTILATION') {
    differentialAnalysis.push('Hypercapnia with Normal A-a Gradient confirms Pure Alveolar Hypoventilation.');
    differentialAnalysis.push('Lungs are parenchymally intact; underlying etiology resides in CNS respiratory depression (opioid / sedative overdose), neuromuscular weakness (myasthenia gravis, Guillain-Barré), or severe chest wall restriction.');
  } else if (primaryMechanism === 'LOW_FIO2_ALTITUDE') {
    differentialAnalysis.push(`Reduced ambient Barometric Pressure (${barometricPressure} mmHg) lowers inspired PO2 (PiO2) despite normal A-a gradient.`);
    differentialAnalysis.push('Consistent with high-altitude hypobaric hypoxia or hypoxic gas mixture delivery.');
  } else if (primaryMechanism === 'RIGHT_TO_LEFT_SHUNT') {
    differentialAnalysis.push(`Intrapulmonary / Intracardiac Shunt fraction calculated at ${shuntFraction}% (normal < 5%).`);
    differentialAnalysis.push(`Marked hypoxemia that is REFRACTORY to 100% O2 challenge (Predicted PaO2 on 100% FiO2 is only ${hyperoxiaPredictedPaO2} mmHg).`);
    differentialAnalysis.push('Etiology: Severe alveolar flooding/collapse (ARDS, dense lobar pneumonia, complete atelectasis) or anatomical right-to-left intracardiac defect (Eisenmenger, PFO with elevated right heart pressures).');
  } else if (primaryMechanism === 'VQ_MISMATCH') {
    differentialAnalysis.push(`Elevated A-a Gradient (${aaGradient} mmHg vs expected ${expectedAaGradient} mmHg) with responsive shunt (${shuntFraction}%).`);
    differentialAnalysis.push('Classic Low V/Q regions (COPD exacerbation, asthma bronchospasm, mild pulmonary edema, pulmonary embolism). PaO2 typically corrects dramatically with moderate supplemental oxygen.');
  } else if (primaryMechanism === 'DIFFUSION_IMPAIRMENT') {
    differentialAnalysis.push(`Elevated A-a Gradient driven by thickened alveolocapillary membrane or reduced transit time.`);
    differentialAnalysis.push('Classic interstitial lung disease (idiopathic pulmonary fibrosis, sarcoidosis); typically marked by exertional desaturation and reduced DLCO.');
  } else {
    differentialAnalysis.push('Oxygenation indices and A-a gradient are within expected physiologic limits.');
  }

  // 11. Actionable Clinical Recommendations
  const clinicalRecommendations: string[] = [];
  if (primaryMechanism === 'HYPOVENTILATION') {
    clinicalRecommendations.push('Prioritize immediate restoration of minute ventilation: administer targeted reversal (e.g. IV Naloxone for opioids, Flumazenil for benzodiazepines with caution) or initiate Non-Invasive Positive Pressure Ventilation (NIV / BiPAP) / endotracheal intubation.');
    clinicalRecommendations.push('Supplemental oxygen alone will correct PaO2 but does NOT relieve progressive hypercapnic narcosis and respiratory acidosis.');
  } else if (primaryMechanism === 'RIGHT_TO_LEFT_SHUNT') {
    if (ardsClassification === 'SEVERE' || ardsClassification === 'MODERATE') {
      clinicalRecommendations.push('Initiate Lung-Protective Mechanical Ventilation: Tidal volume 4-6 mL/kg PBW, plateau pressure < 30 cmH2O, driving pressure < 14 cmH2O.');
      clinicalRecommendations.push('Implement PEEP titration to recruit non-aerated consolidated alveoli and reduce true shunt fraction.');
      if (pfRatio < 150) {
        clinicalRecommendations.push('Strong indication for Prone Positioning (minimum 16 hours/day) and early neuromuscular blockade if ventilator dyssynchrony persists.');
      }
      if (pfRatio < 80) {
        clinicalRecommendations.push('If refractory hypoxemia persists despite lung-protective ventilation and prone positioning, evaluate for Veno-Venous (VV) ECMO candidate criteria (CESAR / EOLIA trial parameters).');
      }
    }
  } else if (primaryMechanism === 'VQ_MISMATCH') {
    clinicalRecommendations.push('Titrate supplemental oxygen to target SpO2 92-96% (or 88-92% in patients at risk for hypercapnic respiratory failure / COPD).');
    clinicalRecommendations.push('Administer bronchodilators, systemic corticosteroids, or diuretics depending on underlying obstructive or cardiogenic etiology.');
  } else if (primaryMechanism === 'LOW_FIO2_ALTITUDE') {
    clinicalRecommendations.push('Administer supplemental oxygen, initiate rapid descent or hyperbaric Gamow chamber therapy, and consider acetazolamide / dexamethasone for acute mountain sickness.');
  }

  // DO2 Warnings
  if (isCriticalDO2) {
    clinicalRecommendations.push(`CRITICAL WARNING: Oxygen Delivery DO2 (${do2} mL/min) has fallen below critical threshold. High risk of supply-dependent VO2, tissue dysoxia, and lactic acidosis.`);
  } else if (oer > 40) {
    clinicalRecommendations.push(`Elevated Oxygen Extraction Ratio (${oer}%): Tissues are extracting high fraction of delivered oxygen. Augment cardiac output or optimize hemoglobin.`);
  }

  return {
    pAO2,
    aaGradient,
    expectedAaGradient,
    isAaElevated,
    pfRatio,
    ardsClassification,
    shuntFraction,
    hyperoxiaPredictedPaO2,
    isRefractoryToOxygen,
    oxygenContent: {
      caO2,
      cvO2,
      ccO2,
      cAVDifference
    },
    do2,
    vo2,
    oer,
    isCriticalDO2,
    vdVtFraction,
    primaryMechanism,
    differentialAnalysis,
    clinicalRecommendations
  };
}

/**
 * 4 Pre-Configured Clinical Case Scenarios for Instant Benchmarking
 */
export const SHUNT_CLINICAL_PRESETS: {
  id: string;
  name: string;
  badge: string;
  description: string;
  params: RespiratoryParameters;
}[] = [
  {
    id: 'severe-ards-refractory-shunt',
    name: 'Severe ARDS with True Refractory Shunt',
    badge: 'Critical Care / ARDS',
    description: 'Bilateral alveolar flooding and diffuse microatelectasis. Massive intrapulmonary shunt refractory to FiO2 1.00; severe oxygenation deficit.',
    params: {
      age: 58,
      barometricPressure: 760,
      fiO2: 0.80,
      paO2: 64,
      paCO2: 48,
      respiratoryQuotient: 0.8,
      hemoglobin: 11.5,
      saO2: 89,
      svO2: 62,
      pvO2: 34,
      cardiacOutput: 5.2,
      bodySurfaceArea: 1.85,
      peCO2: 22
    }
  },
  {
    id: 'copd-exacerbation-vq-mismatch',
    name: 'Severe COPD Exacerbation (V/Q Mismatch)',
    badge: 'Pulmonology',
    description: 'Bronchospasm, mucous plugging, and low V/Q units. Significant A-a widening that responds to modest supplemental oxygen titration.',
    params: {
      age: 67,
      barometricPressure: 760,
      fiO2: 0.28,
      paO2: 56,
      paCO2: 58,
      respiratoryQuotient: 0.8,
      hemoglobin: 15.2,
      saO2: 88,
      svO2: 68,
      pvO2: 38,
      cardiacOutput: 4.8,
      bodySurfaceArea: 1.78,
      peCO2: 28
    }
  },
  {
    id: 'opioid-overdose-hypoventilation',
    name: 'Acute Opioid Overdose (Pure Hypoventilation)',
    badge: 'Emergency / Toxicology',
    description: 'Profound central respiratory depression with severe hypercapnia. Lungs are structurally pristine: A-a gradient is perfectly normal.',
    params: {
      age: 29,
      barometricPressure: 760,
      fiO2: 0.21,
      paO2: 52,
      paCO2: 72,
      respiratoryQuotient: 0.8,
      hemoglobin: 14.0,
      saO2: 84,
      svO2: 66,
      pvO2: 36,
      cardiacOutput: 5.0,
      bodySurfaceArea: 1.80
    }
  },
  {
    id: 'high-altitude-hypobaric-hypoxia',
    name: 'High Altitude Hypobaric Hypoxia (4,500m)',
    badge: 'Environmental Medicine',
    description: 'Extreme mountain environment (P_atm 430 mmHg). Low inspired PO2 with compensatory hyperventilation; A-a gradient remains normal.',
    params: {
      age: 34,
      barometricPressure: 430,
      fiO2: 0.21,
      paO2: 44,
      paCO2: 25,
      respiratoryQuotient: 0.8,
      hemoglobin: 16.8,
      saO2: 81,
      svO2: 60,
      pvO2: 32,
      cardiacOutput: 6.2,
      bodySurfaceArea: 1.82
    }
  }
];