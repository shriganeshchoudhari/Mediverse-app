/**
 * Acid-Base Physiology & Davenport Nomogram Solver
 * 
 * Implements:
 * 1. Henderson-Hasselbalch equation and chemical equilibria
 * 2. Anion Gap, Delta Gap, and Delta Ratio (Delta-Delta) diagnostics
 * 3. Winter's formula and classic respiratory compensation rules
 * 4. Davenport nomogram buffer lines (non-bicarbonate buffer slope ~ -25 slykes) and CO2 isobars
 * 5. Automated 4-Step Clinical ABG Diagnostic Classifier
 */

export interface AcidBaseInput {
  paco2: number;           // Arterial PaCO2 in mmHg (normal 35-45)
  hco3: number;            // Serum Bicarbonate [HCO3-] in mEq/L or mmol/L (normal 22-26)
  na?: number;             // Serum Sodium [Na+] in mEq/L (normal 135-145)
  cl?: number;             // Serum Chloride [Cl-] in mEq/L (normal 96-106)
  albumin?: number;        // Serum Albumin in g/dL (normal 4.0, for AG correction)
  isChronic?: boolean;     // Respiratory disorder duration (acute vs chronic renal compensation)
}

export interface CompensationEvaluation {
  formulaName: string;
  expectedValue: number;
  minExpected: number;
  maxExpected: number;
  actualValue: number;
  measuredParameter: 'PaCO2' | 'HCO3';
  status: 'adequate' | 'under_compensated' | 'over_compensated' | 'concomitant_disorder';
  interpretation: string;
}

export interface AnionGapEvaluation {
  anionGap: number;
  isHigh: boolean;
  isNormal: boolean;
  isLow: boolean;
  deltaGap: number;
  deltaRatio: number | null;
  category: 'high_ag' | 'normal_ag' | 'low_ag' | 'not_calculated';
  interpretation: string;
  differentials: string[];
}

export interface DiagnosticStep {
  step: number;
  title: string;
  observation: string;
  conclusion: string;
  status: 'normal' | 'abnormal' | 'compensated' | 'critical';
}

export interface DavenportPoint {
  ph: number;
  hco3: number;
  paco2: number;
}

export interface DavenportIsobarPoint {
  ph: number;
  hco3: number;
}

export interface DavenportDiagramData {
  currentPoint: DavenportPoint;
  normalPoint: DavenportPoint;
  normalBufferLine: DavenportIsobarPoint[];
  currentBufferLine: DavenportIsobarPoint[];
  isobars: {
    paco2: number;
    color: string;
    points: DavenportIsobarPoint[];
  }[];
  operatingZone: string;
  zoneDescription: string;
}

export type PrimaryAcidBaseDisorder =
  | 'normal'
  | 'uncompensated_metabolic_acidosis'
  | 'compensated_metabolic_acidosis'
  | 'uncompensated_metabolic_alkalosis'
  | 'compensated_metabolic_alkalosis'
  | 'acute_respiratory_acidosis'
  | 'chronic_respiratory_acidosis'
  | 'acute_respiratory_alkalosis'
  | 'chronic_respiratory_alkalosis'
  | 'mixed_metabolic_and_respiratory_acidosis'
  | 'mixed_metabolic_and_respiratory_alkalosis'
  | 'mixed_metabolic_acidosis_and_respiratory_alkalosis'
  | 'mixed_metabolic_alkalosis_and_respiratory_acidosis'
  | 'mixed_high_ag_and_normal_ag_metabolic_acidosis'
  | 'triple_acid_base_disorder';

export interface AcidBaseAnalysisResult {
  ph: number;
  paco2: number;
  hco3: number;
  hIonNmol: number;         // [H+] in nmol/L = 10^(9-pH) or ~ 24 * (PaCO2 / HCO3)
  dissolvedCO2: number;     // 0.03 * PaCO2 in mmol/L
  phCategory: 'acidemia' | 'alkalemia' | 'normal';
  primaryDisorder: PrimaryAcidBaseDisorder;
  diagnosticLabel: string;
  clinicalSeverity: 'normal' | 'mild' | 'moderate' | 'severe' | 'life_threatening';
  compensation: CompensationEvaluation;
  anionGap: AnionGapEvaluation;
  differentials: string[];
  steps: DiagnosticStep[];
  davenport: DavenportDiagramData;
}

// CONSTANTS
export const PK_CARBONIC_ACID = 6.1;
export const CO2_SOLUBILITY = 0.03; // mmol/L/mmHg (alpha)
export const NON_BICARB_BUFFER_SLOPE = -25.0; // slykes: Δ[HCO3-]/ΔpH in mmol/L per pH unit
export const NORMAL_PH = 7.40;
export const NORMAL_PACO2 = 40.0; // mmHg
export const NORMAL_HCO3 = 24.0;  // mEq/L
export const NORMAL_AG = 12.0;    // mEq/L
export const NORMAL_ALBUMIN = 4.0; // g/dL

/**
 * 1. Henderson-Hasselbalch Solvers
 */
export function solvePH(paco2: number, hco3: number): number {
  if (paco2 <= 0 || hco3 <= 0) return 7.40;
  const dissolvedCO2 = CO2_SOLUBILITY * paco2;
  const ph = PK_CARBONIC_ACID + Math.log10(hco3 / dissolvedCO2);
  return parseFloat(ph.toFixed(3));
}

export function solveHCO3(ph: number, paco2: number): number {
  if (paco2 <= 0) return 24.0;
  const dissolvedCO2 = CO2_SOLUBILITY * paco2;
  const hco3 = dissolvedCO2 * Math.pow(10, ph - PK_CARBONIC_ACID);
  return parseFloat(hco3.toFixed(2));
}

export function solvePaCO2(ph: number, hco3: number): number {
  if (hco3 <= 0) return 40.0;
  const paco2 = hco3 / (CO2_SOLUBILITY * Math.pow(10, ph - PK_CARBONIC_ACID));
  return parseFloat(paco2.toFixed(1));
}

export function calculateHIonConcentration(ph: number): number {
  // [H+] in nmol/L (or nEq/L) = 10^(9 - pH)
  return parseFloat(Math.pow(10, 9 - ph).toFixed(1));
}

/**
 * 2. Anion Gap & Delta Calculations
 */
export function calculateAnionGap(
  na?: number,
  cl?: number,
  hco3?: number,
  albumin?: number
): AnionGapEvaluation {
  if (na === undefined || cl === undefined || hco3 === undefined) {
    return {
      anionGap: 0,
      isHigh: false,
      isNormal: true,
      isLow: false,
      deltaGap: 0,
      deltaRatio: null,
      category: 'not_calculated',
      interpretation: 'Electrolytes (Na+, Cl-) not provided for Anion Gap computation.',
      differentials: [],
    };
  }

  // Base AG = Na+ - (Cl- + HCO3-)
  let ag = na - (cl + hco3);

  // Albumin correction if albumin provided: Corrected AG = AG + 2.5 * (4.0 - Albumin)
  if (albumin !== undefined && albumin > 0 && albumin !== NORMAL_ALBUMIN) {
    ag += 2.5 * (NORMAL_ALBUMIN - albumin);
  }

  ag = parseFloat(ag.toFixed(1));
  const isHigh = ag > 12;
  const isLow = ag < 6;
  const isNormal = ag >= 6 && ag <= 12;

  const deltaGap = parseFloat((ag - NORMAL_AG).toFixed(1));
  const deltaHCO3 = parseFloat((NORMAL_HCO3 - hco3).toFixed(1));

  let deltaRatio: number | null = null;
  let deltaInterpretation = '';

  if (isHigh && deltaHCO3 > 0) {
    deltaRatio = parseFloat((deltaGap / deltaHCO3).toFixed(2));
    if (deltaRatio < 0.4) {
      deltaInterpretation = 'Delta Ratio < 0.4: Predominant Normal Anion Gap (Hyperchloremic) Acidosis with mild high AG component.';
    } else if (deltaRatio >= 0.4 && deltaRatio < 0.8) {
      deltaInterpretation = 'Delta Ratio 0.4 - 0.8: Mixed High Anion Gap (HAGMA) AND Normal Anion Gap (NAGMA/Hyperchloremic) Acidosis.';
    } else if (deltaRatio >= 0.8 && deltaRatio <= 2.0) {
      deltaInterpretation = 'Delta Ratio 0.8 - 2.0: Pure High Anion Gap Metabolic Acidosis (uncomplicated 1:1 drop in [HCO3-]).';
    } else {
      deltaInterpretation = 'Delta Ratio > 2.0: Mixed High Anion Gap Metabolic Acidosis AND Concurrent Metabolic Alkalosis (or pre-existing chronic compensated hypercapnia).';
    }
  } else if (isHigh && deltaHCO3 <= 0) {
    deltaRatio = parseFloat(deltaGap.toFixed(2));
    deltaInterpretation = 'High Anion Gap present with normal/elevated HCO3-, strongly indicating Mixed HAGMA + Metabolic Alkalosis.';
  } else {
    deltaInterpretation = isNormal
      ? 'Anion Gap is within normal physiological range (6 - 12 mEq/L).'
      : isLow
        ? 'Low Anion Gap (< 6 mEq/L): Consider hypoalbuminemia, severe hypercalcemia, lithium toxicity, or multiple myeloma (cationic paraproteinemia).'
        : 'Normal Anion Gap.';
  }

  const differentials: string[] = [];
  if (isHigh) {
    differentials.push(
      'MUDPILES / GOLDMARK (High AG):',
      '• Diabetic Ketoacidosis (DKA) / Alcoholic / Starvation Ketoacidosis',
      '• Lactic Acidosis (Type A: tissue hypoperfusion/shock; Type B: toxins, metformin, liver failure)',
      '• Uremia / Acute & Chronic Renal Failure (sulfate/phosphate retention)',
      '• Toxic Alcohols (Methanol, Ethylene Glycol, Propylene Glycol)',
      '• Salicylate (Aspirin) Intoxication'
    );
  } else if (hco3 < 22) {
    differentials.push(
      'HARDASS / USED CRAP (Normal AG / Hyperchloremic):',
      '• Severe Diarrhea / Enterocutaneous Fistula (GI bicarbonate wasting)',
      '• Renal Tubular Acidosis (Type 1 Distal, Type 2 Proximal, Type 4 Hyporeninemic)',
      '• Acetazolamide / Carbonic Anhydrase Inhibitors',
      '• Large volume 0.9% Normal Saline infusion (Dilutional hyperchloremia)',
      '• Post-hypocapnia recovery phase'
    );
  }

  return {
    anionGap: ag,
    isHigh,
    isNormal,
    isLow,
    deltaGap,
    deltaRatio,
    category: isHigh ? 'high_ag' : isLow ? 'low_ag' : 'normal_ag',
    interpretation: deltaInterpretation,
    differentials,
  };
}

/**
 * 3. Respiratory & Metabolic Compensation Rules
 */
export function calculateWinterCompensation(hco3: number, actualPaCO2: number): CompensationEvaluation {
  // Winter's Formula for Metabolic Acidosis: Expected PaCO2 = 1.5 * [HCO3-] + 8 (+/- 2)
  const target = parseFloat((1.5 * hco3 + 8).toFixed(1));
  const minExpected = parseFloat(Math.max(10, target - 2).toFixed(1));
  const maxExpected = parseFloat((target + 2).toFixed(1));

  let status: CompensationEvaluation['status'] = 'adequate';
  let interpretation = '';

  if (actualPaCO2 > maxExpected) {
    status = 'under_compensated';
    interpretation = `PaCO2 (${actualPaCO2} mmHg) is HIGHER than Winter's expected ceiling (${maxExpected} mmHg). Indicates Concomitant Respiratory Acidosis (respiratory fatigue/failure, CNS depression).`;
  } else if (actualPaCO2 < minExpected) {
    status = 'over_compensated';
    interpretation = `PaCO2 (${actualPaCO2} mmHg) is LOWER than Winter's expected floor (${minExpected} mmHg). Indicates Concomitant Respiratory Alkalosis (superimposed hyperventilation, sepsis, pain, salicylate toxicity).`;
  } else {
    status = 'adequate';
    interpretation = `PaCO2 (${actualPaCO2} mmHg) falls precisely within Winter's expected compensation range (${minExpected} - ${maxExpected} mmHg). Demonstrates appropriate respiratory compensation.`;
  }

  return {
    formulaName: "Winter's Formula: Expected PaCO₂ = 1.5 × [HCO₃⁻] + 8 ± 2",
    expectedValue: target,
    minExpected,
    maxExpected,
    actualValue: actualPaCO2,
    measuredParameter: 'PaCO2',
    status,
    interpretation,
  };
}

export function calculateMetabolicAlkalosisCompensation(hco3: number, actualPaCO2: number): CompensationEvaluation {
  // Metabolic Alkalosis Compensation: Expected PaCO2 = 40 + 0.7 * ([HCO3-] - 24) +/- 2 (or 0.7 * [HCO3-] + 21 +/- 2)
  // Max physiological respiratory hypoventilation compensation ceiling is ~55 mmHg
  const target = parseFloat((0.7 * hco3 + 21).toFixed(1));
  const minExpected = parseFloat((target - 2).toFixed(1));
  const maxExpected = parseFloat(Math.min(58, target + 2).toFixed(1));

  let status: CompensationEvaluation['status'] = 'adequate';
  let interpretation = '';

  if (actualPaCO2 > maxExpected) {
    status = 'under_compensated';
    interpretation = `PaCO2 (${actualPaCO2} mmHg) exceeds expected hypoventilation ceiling (${maxExpected} mmHg). Concomitant Respiratory Acidosis present.`;
  } else if (actualPaCO2 < minExpected) {
    status = 'over_compensated';
    interpretation = `PaCO2 (${actualPaCO2} mmHg) is lower than expected (${minExpected} mmHg). Concomitant Respiratory Alkalosis present.`;
  } else {
    status = 'adequate';
    interpretation = `PaCO2 (${actualPaCO2} mmHg) is within expected hypoventilation range (${minExpected} - ${maxExpected} mmHg). Appropriate respiratory compensation.`;
  }

  return {
    formulaName: 'Metabolic Alkalosis Compensation: Expected PaCO₂ = 0.7 × [HCO₃⁻] + 21 ± 2',
    expectedValue: target,
    minExpected,
    maxExpected,
    actualValue: actualPaCO2,
    measuredParameter: 'PaCO2',
    status,
    interpretation,
  };
}

export function calculateRespiratoryAcidosisCompensation(
  paco2: number,
  actualHCO3: number,
  isChronic: boolean
): CompensationEvaluation {
  const deltaPaCO2_10 = (paco2 - 40) / 10;
  let target = 24;
  let minExpected = 24;
  let maxExpected = 24;
  let formulaName = '';

  if (isChronic) {
    // Chronic Respiratory Acidosis: [HCO3-] increases by ~3.5 to 4 mEq/L per 10 mmHg increase in PaCO2 (+/- 3 mEq/L)
    const increase = 3.5 * deltaPaCO2_10;
    target = parseFloat((24 + increase).toFixed(1));
    minExpected = parseFloat((target - 3).toFixed(1));
    maxExpected = parseFloat(Math.min(45, target + 3).toFixed(1));
    formulaName = 'Chronic Resp Acidosis: Expected [HCO₃⁻] = 24 + 3.5 × (ΔPaCO₂ / 10) ± 3';
  } else {
    // Acute Respiratory Acidosis: [HCO3-] increases by ~1.0 mEq/L per 10 mmHg increase in PaCO2 (+/- 1.5 mEq/L)
    const increase = 1.0 * deltaPaCO2_10;
    target = parseFloat((24 + increase).toFixed(1));
    minExpected = parseFloat((target - 1.5).toFixed(1));
    maxExpected = parseFloat((target + 1.5).toFixed(1));
    formulaName = 'Acute Resp Acidosis: Expected [HCO₃⁻] = 24 + 1.0 × (ΔPaCO₂ / 10) ± 1.5';
  }

  let status: CompensationEvaluation['status'] = 'adequate';
  let interpretation = '';

  if (actualHCO3 < minExpected) {
    status = 'under_compensated';
    interpretation = `Serum [HCO3-] (${actualHCO3} mEq/L) is LOWER than expected (${minExpected} mEq/L). Indicates Acute-on-Chronic respiratory failure or Concomitant Metabolic Acidosis.`;
  } else if (actualHCO3 > maxExpected) {
    status = 'over_compensated';
    interpretation = `Serum [HCO3-] (${actualHCO3} mEq/L) is HIGHER than expected (${maxExpected} mEq/L). Indicates Concomitant Metabolic Alkalosis (e.g. diuretics, vomiting, post-hypercapnia).`;
  } else {
    status = 'adequate';
    interpretation = `Serum [HCO3-] (${actualHCO3} mEq/L) matches expected renal/cellular buffer response (${minExpected} - ${maxExpected} mEq/L).`;
  }

  return {
    formulaName,
    expectedValue: target,
    minExpected,
    maxExpected,
    actualValue: actualHCO3,
    measuredParameter: 'HCO3',
    status,
    interpretation,
  };
}

export function calculateRespiratoryAlkalosisCompensation(
  paco2: number,
  actualHCO3: number,
  isChronic: boolean
): CompensationEvaluation {
  const deltaPaCO2_10 = (40 - paco2) / 10;
  let target = 24;
  let minExpected = 24;
  let maxExpected = 24;
  let formulaName = '';

  if (isChronic) {
    // Chronic Respiratory Alkalosis: [HCO3-] decreases by ~5.0 mEq/L per 10 mmHg decrease in PaCO2 (+/- 2.5 mEq/L)
    const decrease = 5.0 * deltaPaCO2_10;
    target = parseFloat(Math.max(12, 24 - decrease).toFixed(1));
    minExpected = parseFloat((target - 2.5).toFixed(1));
    maxExpected = parseFloat((target + 2.5).toFixed(1));
    formulaName = 'Chronic Resp Alkalosis: Expected [HCO₃⁻] = 24 - 5.0 × (ΔPaCO₂ / 10) ± 2.5';
  } else {
    // Acute Respiratory Alkalosis: [HCO3-] decreases by ~2.0 mEq/L per 10 mmHg decrease in PaCO2 (+/- 1.5 mEq/L)
    const decrease = 2.0 * deltaPaCO2_10;
    target = parseFloat((24 - decrease).toFixed(1));
    minExpected = parseFloat((target - 1.5).toFixed(1));
    maxExpected = parseFloat((target + 1.5).toFixed(1));
    formulaName = 'Acute Resp Alkalosis: Expected [HCO₃⁻] = 24 - 2.0 × (ΔPaCO₂ / 10) ± 1.5';
  }

  let status: CompensationEvaluation['status'] = 'adequate';
  let interpretation = '';

  if (actualHCO3 < minExpected) {
    status = 'over_compensated';
    interpretation = `Serum [HCO3-] (${actualHCO3} mEq/L) is LOWER than expected (${minExpected} mEq/L). Indicates Concomitant Metabolic Acidosis.`;
  } else if (actualHCO3 > maxExpected) {
    status = 'under_compensated';
    interpretation = `Serum [HCO3-] (${actualHCO3} mEq/L) is HIGHER than expected (${maxExpected} mEq/L). Indicates Concomitant Metabolic Alkalosis.`;
  } else {
    status = 'adequate';
    interpretation = `Serum [HCO3-] (${actualHCO3} mEq/L) matches expected physiological compensation (${minExpected} - ${maxExpected} mEq/L).`;
  }

  return {
    formulaName,
    expectedValue: target,
    minExpected,
    maxExpected,
    actualValue: actualHCO3,
    measuredParameter: 'HCO3',
    status,
    interpretation,
  };
}

/**
 * 4. Davenport Nomogram & Buffer Line Computations
 */
export function generateIsobar(paco2: number, minPH = 6.9, maxPH = 7.8, step = 0.02): DavenportIsobarPoint[] {
  const points: DavenportIsobarPoint[] = [];
  for (let ph = minPH; ph <= maxPH + 0.001; ph += step) {
    const hco3 = solveHCO3(ph, paco2);
    if (hco3 >= 0 && hco3 <= 65) {
      points.push({
        ph: parseFloat(ph.toFixed(2)),
        hco3: parseFloat(hco3.toFixed(1)),
      });
    }
  }
  return points;
}

export function generateBufferLine(
  anchorPH = 7.40,
  anchorHCO3 = 24.0,
  slope = NON_BICARB_BUFFER_SLOPE,
  minPH = 7.0,
  maxPH = 7.8,
  step = 0.05
): DavenportIsobarPoint[] {
  const points: DavenportIsobarPoint[] = [];
  for (let ph = minPH; ph <= maxPH + 0.001; ph += step) {
    // [HCO3-] = anchorHCO3 + slope * (ph - anchorPH)
    const hco3 = anchorHCO3 + slope * (ph - anchorPH);
    if (hco3 >= 0 && hco3 <= 65) {
      points.push({
        ph: parseFloat(ph.toFixed(2)),
        hco3: parseFloat(hco3.toFixed(1)),
      });
    }
  }
  return points;
}

export function getDavenportOperatingZone(ph: number, paco2: number, hco3: number): { zone: string; desc: string } {
  const isPhNormal = ph >= 7.35 && ph <= 7.45;
  const isPaco2Normal = paco2 >= 35 && paco2 <= 45;
  const isHco3Normal = hco3 >= 22 && hco3 <= 26;

  if (isPhNormal && isPaco2Normal && isHco3Normal) {
    return {
      zone: 'Normal Physiological Operating Point',
      desc: 'Normal acid-base equilibrium on the Davenport nomogram (pH 7.35-7.45, PaCO2 35-45, HCO3 22-26).',
    };
  }

  if (ph < 7.35) {
    if (paco2 > 45 && hco3 >= 22 && hco3 <= 30) {
      return {
        zone: 'Acute Respiratory Acidosis',
        desc: 'Operating point has shifted up and to the left along the non-bicarbonate buffer line due to acute CO2 accumulation.',
      };
    }
    if (paco2 > 45 && hco3 > 30) {
      return {
        zone: 'Chronic / Compensated Respiratory Acidosis',
        desc: 'Operating point has shifted above the standard buffer line through renal bicarbonate retention, partially restoring pH.',
      };
    }
    if (hco3 < 22 && paco2 <= 40) {
      return {
        zone: 'Metabolic Acidosis (with Respiratory Compensation)',
        desc: 'Operating point has shifted down and left to lower PaCO2 isobars due to hyperventilatory compensation.',
      };
    }
    if (paco2 > 45 && hco3 < 22) {
      return {
        zone: 'Mixed Metabolic & Respiratory Acidosis',
        desc: 'Severe combined disturbance: low HCO3- from metabolic acid load combined with high PaCO2 from hypoventilation.',
      };
    }
  }

  if (ph > 7.45) {
    if (paco2 < 35 && hco3 >= 18 && hco3 <= 24) {
      return {
        zone: 'Acute Respiratory Alkalosis',
        desc: 'Operating point has shifted down and to the right along the non-bicarbonate buffer line due to hyperventilation.',
      };
    }
    if (paco2 < 35 && hco3 < 18) {
      return {
        zone: 'Chronic / Compensated Respiratory Alkalosis',
        desc: 'Operating point has shifted below the standard buffer line through renal bicarbonate excretion.',
      };
    }
    if (hco3 > 26 && paco2 >= 40) {
      return {
        zone: 'Metabolic Alkalosis (with Hypoventilatory Compensation)',
        desc: 'Operating point has shifted up and right to higher PaCO2 isobars due to compensatory respiratory depression.',
      };
    }
    if (paco2 < 35 && hco3 > 26) {
      return {
        zone: 'Mixed Metabolic & Respiratory Alkalosis',
        desc: 'Combined alkalemic surge from both renal bicarbonate retention and hyperventilatory CO2 blowout.',
      };
    }
  }

  if (isPhNormal) {
    if (paco2 > 45 && hco3 > 26) {
      return {
        zone: 'Fully Compensated Respiratory Acidosis / Metabolic Alkalosis',
        desc: 'Elevated PaCO2 and HCO3- with pH successfully returned to the physiological range (7.35-7.45).',
      };
    }
    if (paco2 < 35 && hco3 < 22) {
      return {
        zone: 'Fully Compensated Metabolic Acidosis / Respiratory Alkalosis',
        desc: 'Depressed PaCO2 and HCO3- with pH successfully maintained in the physiological range (7.35-7.45).',
      };
    }
  }

  return {
    zone: 'Complex / Mixed Acid-Base Disruption',
    desc: 'Operating coordinates reflect multi-factorial physiological disturbance.',
  };
}

/**
 * 5. Complete 4-Step ABG Diagnostic Solver
 */
export function solveAcidBase(input: AcidBaseInput): AcidBaseAnalysisResult {
  const { paco2, hco3, na, cl, albumin, isChronic = false } = input;

  const ph = solvePH(paco2, hco3);
  const hIonNmol = calculateHIonConcentration(ph);
  const dissolvedCO2 = parseFloat((CO2_SOLUBILITY * paco2).toFixed(2));

  // Step 1: Evaluate pH
  const phCategory: AcidBaseAnalysisResult['phCategory'] =
    ph < 7.35 ? 'acidemia' : ph > 7.45 ? 'alkalemia' : 'normal';

  // Step 2: Determine Primary Disturbance
  let primaryDisorder: PrimaryAcidBaseDisorder = 'normal';
  let diagnosticLabel = 'Normal Acid-Base Status';
  let clinicalSeverity: AcidBaseAnalysisResult['clinicalSeverity'] = 'normal';

  // Anion Gap & Delta Calculations
  const anionGapEval = calculateAnionGap(na, cl, hco3, albumin);

  // Compensation evaluation
  let compensationEval: CompensationEvaluation;

  if (phCategory === 'acidemia') {
    if (ph < 7.10) clinicalSeverity = 'life_threatening';
    else if (ph < 7.25) clinicalSeverity = 'severe';
    else clinicalSeverity = 'moderate';

    const metabolicComponent = hco3 < 22;
    const respiratoryComponent = paco2 > 45;

    if (metabolicComponent && respiratoryComponent) {
      // Mixed Acidosis
      primaryDisorder = 'mixed_metabolic_and_respiratory_acidosis';
      diagnosticLabel = anionGapEval.isHigh
        ? 'Mixed High Anion Gap Metabolic Acidosis AND Respiratory Acidosis'
        : 'Mixed Normal Anion Gap Metabolic Acidosis AND Respiratory Acidosis';
      compensationEval = calculateWinterCompensation(hco3, paco2);
    } else if (metabolicComponent) {
      // Primary Metabolic Acidosis
      compensationEval = calculateWinterCompensation(hco3, paco2);
      if (compensationEval.status === 'under_compensated') {
        primaryDisorder = 'mixed_metabolic_and_respiratory_acidosis';
        diagnosticLabel = 'Metabolic Acidosis with Concomitant Respiratory Acidosis (Respiratory Fatigue)';
      } else if (compensationEval.status === 'over_compensated') {
        primaryDisorder = 'mixed_metabolic_acidosis_and_respiratory_alkalosis';
        diagnosticLabel = 'Metabolic Acidosis with Concomitant Respiratory Alkalosis (e.g. Salicylate/Sepsis)';
      } else {
        primaryDisorder = 'compensated_metabolic_acidosis';
        diagnosticLabel = anionGapEval.isHigh
          ? 'High Anion Gap Metabolic Acidosis (HAGMA) with Expected Respiratory Compensation'
          : 'Normal Anion Gap (Hyperchloremic) Metabolic Acidosis (NAGMA) with Expected Respiratory Compensation';
      }
    } else if (respiratoryComponent) {
      // Primary Respiratory Acidosis
      compensationEval = calculateRespiratoryAcidosisCompensation(paco2, hco3, isChronic);
      if (compensationEval.status === 'under_compensated') {
        primaryDisorder = 'mixed_metabolic_and_respiratory_acidosis';
        diagnosticLabel = 'Respiratory Acidosis with Concomitant Metabolic Acidosis';
      } else if (compensationEval.status === 'over_compensated') {
        primaryDisorder = 'mixed_metabolic_alkalosis_and_respiratory_acidosis';
        diagnosticLabel = 'Respiratory Acidosis with Concomitant Metabolic Alkalosis';
      } else {
        primaryDisorder = isChronic
          ? 'chronic_respiratory_acidosis'
          : 'acute_respiratory_acidosis';
        diagnosticLabel = isChronic
          ? 'Chronic (Compensated) Respiratory Acidosis'
          : 'Acute Respiratory Acidosis (Uncompensated / Cellular Buffering Only)';
      }
    } else {
      primaryDisorder = 'uncompensated_metabolic_acidosis';
      diagnosticLabel = 'Uncompensated Acidemia';
      compensationEval = calculateWinterCompensation(hco3, paco2);
    }
  } else if (phCategory === 'alkalemia') {
    if (ph > 7.60) clinicalSeverity = 'life_threatening';
    else if (ph > 7.50) clinicalSeverity = 'severe';
    else clinicalSeverity = 'moderate';

    const metabolicComponent = hco3 > 26;
    const respiratoryComponent = paco2 < 35;

    if (metabolicComponent && respiratoryComponent) {
      primaryDisorder = 'mixed_metabolic_and_respiratory_alkalosis';
      diagnosticLabel = 'Mixed Metabolic Alkalosis AND Respiratory Alkalosis';
      compensationEval = calculateMetabolicAlkalosisCompensation(hco3, paco2);
    } else if (metabolicComponent) {
      compensationEval = calculateMetabolicAlkalosisCompensation(hco3, paco2);
      if (compensationEval.status === 'under_compensated') {
        primaryDisorder = 'mixed_metabolic_alkalosis_and_respiratory_acidosis';
        diagnosticLabel = 'Metabolic Alkalosis with Concomitant Respiratory Acidosis';
      } else if (compensationEval.status === 'over_compensated') {
        primaryDisorder = 'mixed_metabolic_and_respiratory_alkalosis';
        diagnosticLabel = 'Metabolic Alkalosis with Concomitant Respiratory Alkalosis';
      } else {
        primaryDisorder = 'compensated_metabolic_alkalosis';
        diagnosticLabel = 'Metabolic Alkalosis with Expected Respiratory Hypoventilation Compensation';
      }
    } else if (respiratoryComponent) {
      compensationEval = calculateRespiratoryAlkalosisCompensation(paco2, hco3, isChronic);
      if (compensationEval.status === 'over_compensated') {
        primaryDisorder = 'mixed_metabolic_acidosis_and_respiratory_alkalosis';
        diagnosticLabel = 'Respiratory Alkalosis with Concomitant Metabolic Acidosis';
      } else if (compensationEval.status === 'under_compensated') {
        primaryDisorder = 'mixed_metabolic_and_respiratory_alkalosis';
        diagnosticLabel = 'Respiratory Alkalosis with Concomitant Metabolic Alkalosis';
      } else {
        primaryDisorder = isChronic
          ? 'chronic_respiratory_alkalosis'
          : 'acute_respiratory_alkalosis';
        diagnosticLabel = isChronic
          ? 'Chronic (Compensated) Respiratory Alkalosis'
          : 'Acute Respiratory Alkalosis (e.g. Panic Attack, Acute Hyperventilation)';
      }
    } else {
      primaryDisorder = 'uncompensated_metabolic_alkalosis';
      diagnosticLabel = 'Uncompensated Alkalemia';
      compensationEval = calculateMetabolicAlkalosisCompensation(hco3, paco2);
    }
  } else {
    // Normal pH (7.35 - 7.45)
    clinicalSeverity = 'normal';
    if (anionGapEval.isHigh) {
      primaryDisorder = 'compensated_metabolic_acidosis';
      diagnosticLabel = 'High Anion Gap Acidosis with Near-Complete Compensation or Mixed Disorder';
      compensationEval = calculateWinterCompensation(hco3, paco2);
    } else if (paco2 > 45 && hco3 > 26) {
      primaryDisorder = 'chronic_respiratory_acidosis';
      diagnosticLabel = 'Fully Compensated Respiratory Acidosis (or Mixed Met Alkalosis + Resp Acidosis)';
      compensationEval = calculateRespiratoryAcidosisCompensation(paco2, hco3, true);
    } else if (paco2 < 35 && hco3 < 22) {
      primaryDisorder = 'compensated_metabolic_acidosis';
      diagnosticLabel = 'Fully Compensated Metabolic Acidosis (or Mixed Met Acidosis + Resp Alkalosis)';
      compensationEval = calculateWinterCompensation(hco3, paco2);
    } else {
      primaryDisorder = 'normal';
      diagnosticLabel = 'Normal Acid-Base Equilibrium';
      compensationEval = {
        formulaName: 'Equilibrium Baseline',
        expectedValue: 40,
        minExpected: 35,
        maxExpected: 45,
        actualValue: paco2,
        measuredParameter: 'PaCO2',
        status: 'adequate',
        interpretation: 'Values within normal physiological limits (pH 7.35-7.45, PaCO2 35-45, HCO3 22-26).',
      };
    }
  }

  // Differential Diagnoses Assembly
  const differentials: string[] = [];
  if (primaryDisorder.includes('metabolic_acidosis') || phCategory === 'acidemia' && hco3 < 22) {
    differentials.push(...anionGapEval.differentials);
  }
  if (primaryDisorder.includes('metabolic_alkalosis') || phCategory === 'alkalemia' && hco3 > 26) {
    differentials.push(
      'Metabolic Alkalosis Differential:',
      '• Saline-Responsive (Urine Cl < 20 mEq/L): Severe Vomiting, Nasogastric Suction, Diuretic therapy, Dehydration',
      '• Saline-Resistant (Urine Cl > 20 mEq/L): Primary Hyperaldosteronism (Conn syndrome), Cushing syndrome, Bartter / Gitelman syndrome, Severe Hypokalemia'
    );
  }
  if (primaryDisorder.includes('respiratory_acidosis') || paco2 > 45) {
    differentials.push(
      'Respiratory Acidosis Differential (Hypoventilation / Hypercapnia):',
      '• Chronic Obstructive Pulmonary Disease (COPD) / Emphysema / Chronic Bronchitis',
      '• Severe Asthma Exacerbation / Acute Bronchospasm',
      '• Opioid / Sedative Overdose / CNS Respiratory Depression',
      '• Neuromuscular Weakness (Guillain-Barré, Myasthenia Gravis, ALS)',
      '• Severe Kyphoscoliosis / Thoracic Cage Restriction / Morbid Obesity Hypoventilation'
    );
  }
  if (primaryDisorder.includes('respiratory_alkalosis') || paco2 < 35) {
    differentials.push(
      'Respiratory Alkalosis Differential (Hyperventilation / Hypocapnia):',
      '• Panic Attack / Severe Anxiety / Pain / Agitation',
      '• Early Sepsis / Endotoxemia (stimulates central respiratory drive)',
      '• Pulmonary Embolism / Hypoxia / High Altitude',
      '• Early Salicylate (Aspirin) Toxicity (direct medullary stimulation)',
      '• Hepatic Encephalopathy / Cirrhosis / Progesterone in Pregnancy'
    );
  }

  // Step-by-Step Rationale Array
  const steps: DiagnosticStep[] = [
    {
      step: 1,
      title: 'Analyze Arterial pH',
      observation: `pH = ${ph.toFixed(2)} ([H+] = ${hIonNmol} nmol/L, Normal: 7.35 - 7.45)`,
      conclusion: phCategory === 'acidemia'
        ? 'Acidemia present (pH < 7.35)'
        : phCategory === 'alkalemia'
          ? 'Alkalemia present (pH > 7.45)'
          : 'pH is within normal physiological limits (7.35 - 7.45)',
      status: phCategory === 'normal' ? 'normal' : 'abnormal',
    },
    {
      step: 2,
      title: 'Identify Primary Process',
      observation: `PaCO2 = ${paco2} mmHg (Normal: 35-45), [HCO3-] = ${hco3} mEq/L (Normal: 22-26)`,
      conclusion: primaryDisorder === 'normal'
        ? 'Normal arterial blood gas parameters'
        : `Primary direction points to ${primaryDisorder.replace(/_/g, ' ')}`,
      status: primaryDisorder === 'normal' ? 'normal' : 'abnormal',
    },
    {
      step: 3,
      title: 'Assess Secondary Compensation',
      observation: `${compensationEval.formulaName}: Expected ${compensationEval.measuredParameter} = ${compensationEval.minExpected} - ${compensationEval.maxExpected} (Actual = ${compensationEval.actualValue})`,
      conclusion: compensationEval.interpretation,
      status: compensationEval.status === 'adequate' ? 'compensated' : 'abnormal',
    },
    {
      step: 4,
      title: 'Evaluate Anion Gap & Delta Dynamics',
      observation: anionGapEval.category !== 'not_calculated'
        ? `Anion Gap = ${anionGapEval.anionGap} mEq/L (Normal: 8-12). ${anionGapEval.deltaRatio !== null ? `Delta Ratio = ${anionGapEval.deltaRatio}` : ''}`
        : 'Electrolytes not entered for Anion Gap computation.',
      conclusion: anionGapEval.interpretation,
      status: anionGapEval.isHigh ? 'critical' : 'normal',
    },
  ];

  // Davenport Diagram Data
  const zoneInfo = getDavenportOperatingZone(ph, paco2, hco3);
  const isobarPaco2s = [15, 20, 30, 40, 60, 80];
  const isobarColors = ['#06b6d4', '#3b82f6', '#6366f1', '#10b981', '#f59e0b', '#ef4444'];

  const davenport: DavenportDiagramData = {
    currentPoint: { ph, hco3, paco2 },
    normalPoint: { ph: NORMAL_PH, hco3: NORMAL_HCO3, paco2: NORMAL_PACO2 },
    normalBufferLine: generateBufferLine(NORMAL_PH, NORMAL_HCO3, NON_BICARB_BUFFER_SLOPE),
    currentBufferLine: generateBufferLine(ph, hco3, NON_BICARB_BUFFER_SLOPE),
    isobars: isobarPaco2s.map((p, idx) => ({
      paco2: p,
      color: isobarColors[idx] || '#64748b',
      points: generateIsobar(p),
    })),
    operatingZone: zoneInfo.zone,
    zoneDescription: zoneInfo.desc,
  };

  return {
    ph,
    paco2,
    hco3,
    hIonNmol,
    dissolvedCO2,
    phCategory,
    primaryDisorder,
    diagnosticLabel,
    clinicalSeverity,
    compensation: compensationEval,
    anionGap: anionGapEval,
    differentials,
    steps,
    davenport,
  };
}
