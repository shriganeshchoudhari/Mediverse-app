/**
 * ClinicalLabInterpretationEngine.ts
 * Enterprise-grade Clinical Diagnostic Laboratory & Blood Gas (ABG/VBG) Solver Engine.
 * 
 * Features:
 * - ABG / VBG Acid-Base & Oxygenation Analysis (Winter's formula, Delta-Delta, A-a gradient, PaO2/FiO2)
 * - CBC & Anemia Classification (Mentzer index, Reticulocyte Production Index, cell line dynamics)
 * - CMP & Electrolyte Solver (Corrected Na in hyperglycemia, Corrected Ca, Serum Osmolality & Gap, BUN/Cr)
 * - Coagulation & Liver Chemistry Solver (1:1 Mixing Study simulation, De Ritis ratio, Cholestatic patterns)
 * - 12 Board-Style Curated Clinical Presets with Diagnostic Reasoning Explanations
 * 
 * Location: frontend/.gemini/skills/ClinicalLabInterpretationEngine.ts
 */

// ==========================================
// 1. ABG / VBG ACID-BASE TYPES & LOGIC
// ==========================================

export interface AbgInputParams {
  pH: number;                 // normal 7.35 - 7.45
  paCO2: number;              // mmHg, normal 35 - 45
  hco3: number;               // mEq/L, normal 22 - 26
  paO2?: number;              // mmHg, normal 75 - 100
  fiO2?: number;              // fraction 0.21 - 1.0 (0.21 = room air)
  patientAge?: number;        // years (for expected A-a gradient)
  atmosphericPressure?: number; // mmHg (default 760)
  na?: number;                // mEq/L (for Anion Gap)
  cl?: number;                // mEq/L (for Anion Gap)
  albumin?: number;           // g/dL (for Albumin-corrected AG, default 4.0)
}

export interface AbgAnalysisResult {
  primaryDisturbance: string;
  pHCategory: 'ACIDEMIA' | 'ALKALEMIA' | 'NORMAL_PH';
  rawAnionGap: number | null;
  correctedAnionGap: number | null;
  anionGapStatus: 'HIGH_AG' | 'NORMAL_AG' | 'LOW_AG' | 'NOT_CALCULABLE';
  wintersExpectedPaCO2: { min: number; max: number; target: number } | null;
  metabolicAlkalosisExpectedPaCO2: { min: number; max: number; target: number } | null;
  respiratoryAcidosisExpectedHco3: { acute: number; chronic: number } | null;
  respiratoryAlkalosisExpectedHco3: { acute: number; chronic: number } | null;
  compensationStatus: string;
  deltaDeltaRatio: number | null;
  deltaDeltaInterpretation: string | null;
  alveolarO2: number | null;
  aaGradient: number | null;
  expectedAaGradient: number | null;
  pfRatio: number | null;
  diagnosticPearls: string[];
  stepByStepRationale: string[];
}

export function evaluateAbg(params: AbgInputParams): AbgAnalysisResult {
  const {
    pH,
    paCO2,
    hco3,
    paO2 = 95,
    fiO2 = 0.21,
    patientAge = 40,
    atmosphericPressure = 760,
    na,
    cl,
    albumin = 4.0,
  } = params;

  const steps: string[] = [];
  const pearls: string[] = [];

  // Step 1: pH determination
  let pHCategory: 'ACIDEMIA' | 'ALKALEMIA' | 'NORMAL_PH';
  if (pH < 7.35) {
    pHCategory = 'ACIDEMIA';
    steps.push(`Step 1: pH is ${pH.toFixed(2)} (< 7.35), indicating systemic ACIDEMIA.`);
  } else if (pH > 7.45) {
    pHCategory = 'ALKALEMIA';
    steps.push(`Step 1: pH is ${pH.toFixed(2)} (> 7.45), indicating systemic ALKALEMIA.`);
  } else {
    pHCategory = 'NORMAL_PH';
    steps.push(`Step 1: pH is ${pH.toFixed(2)} (within 7.35 - 7.45 normal physiological range).`);
  }

  // Step 2: Primary Disturbance
  let primaryDisturbance = 'Normal Acid-Base Status';
  if (pHCategory === 'ACIDEMIA') {
    const isMetabolic = hco3 < 22;
    const isRespiratory = paCO2 > 45;

    if (isMetabolic && isRespiratory) {
      primaryDisturbance = 'Mixed Metabolic and Respiratory Acidosis';
      steps.push(`Step 2: Both elevated PaCO2 (${paCO2} mmHg) and depressed HCO3 (${hco3} mEq/L) indicate a severe combined/mixed acidosis.`);
    } else if (isMetabolic) {
      primaryDisturbance = 'Primary Metabolic Acidosis';
      steps.push(`Step 2: Low HCO3 (${hco3} mEq/L) drives acidemia -> Primary Metabolic Acidosis.`);
    } else if (isRespiratory) {
      primaryDisturbance = 'Primary Respiratory Acidosis';
      steps.push(`Step 2: Elevated PaCO2 (${paCO2} mmHg) drives acidemia -> Primary Respiratory Acidosis (alveolar hypoventilation).`);
    } else {
      primaryDisturbance = 'Unclassified Acidemia (Near-normal parameters)';
      steps.push(`Step 2: Mild acidemia with borderline PaCO2 and HCO3.`);
    }
  } else if (pHCategory === 'ALKALEMIA') {
    const isMetabolic = hco3 > 26;
    const isRespiratory = paCO2 < 35;

    if (isMetabolic && isRespiratory) {
      primaryDisturbance = 'Mixed Metabolic and Respiratory Alkalosis';
      steps.push(`Step 2: Both low PaCO2 (${paCO2} mmHg) and high HCO3 (${hco3} mEq/L) indicate a mixed alkalosis.`);
    } else if (isMetabolic) {
      primaryDisturbance = 'Primary Metabolic Alkalosis';
      steps.push(`Step 2: High HCO3 (${hco3} mEq/L) drives alkalemia -> Primary Metabolic Alkalosis.`);
    } else if (isRespiratory) {
      primaryDisturbance = 'Primary Respiratory Alkalosis';
      steps.push(`Step 2: Low PaCO2 (${paCO2} mmHg) drives alkalemia -> Primary Respiratory Alkalosis (alveolar hyperventilation).`);
    } else {
      primaryDisturbance = 'Unclassified Alkalemia';
      steps.push(`Step 2: Mild alkalemia with borderline parameters.`);
    }
  } else {
    // Normal pH but might have mixed compensation
    if (paCO2 > 45 && hco3 > 26) {
      primaryDisturbance = 'Compensated Respiratory Acidosis or Mixed Respiratory Acidosis / Metabolic Alkalosis';
      steps.push(`Step 2: Normal pH with elevated PaCO2 and HCO3 suggests compensated chronic respiratory acidosis or mixed disorder.`);
    } else if (paCO2 < 35 && hco3 < 22) {
      primaryDisturbance = 'Compensated Respiratory Alkalosis or Mixed Respiratory Alkalosis / Metabolic Acidosis';
      steps.push(`Step 2: Normal pH with depressed PaCO2 and HCO3 suggests compensated chronic respiratory alkalosis or mixed disorder.`);
    } else {
      primaryDisturbance = 'Normal Acid-Base Homeostasis';
      steps.push(`Step 2: Normal pH with physiological PaCO2 and HCO3.`);
    }
  }

  // Step 3: Anion Gap
  let rawAnionGap: number | null = null;
  let correctedAnionGap: number | null = null;
  let anionGapStatus: 'HIGH_AG' | 'NORMAL_AG' | 'LOW_AG' | 'NOT_CALCULABLE' = 'NOT_CALCULABLE';

  if (na !== undefined && cl !== undefined) {
    rawAnionGap = Number((na - (cl + hco3)).toFixed(1));
    // Albumin correction: + 2.5 * (4.0 - Albumin)
    const albCorrection = 2.5 * (4.0 - albumin);
    correctedAnionGap = Number((rawAnionGap + albCorrection).toFixed(1));

    if (correctedAnionGap > 12) {
      anionGapStatus = 'HIGH_AG';
      steps.push(`Step 3: Anion Gap = Na - (Cl + HCO3) = ${rawAnionGap} mEq/L. Albumin-corrected AG (${albumin} g/dL) is ${correctedAnionGap} mEq/L (>12) -> High Anion Gap.`);
      pearls.push('High AG Metabolic Acidosis mnemonic (GOLDMARK / MUDPILES): Glycols, Oxoproline, L-lactate, D-lactate, Methanol, Aspirin/Salicylates, Renal failure (Uremia), Ketoacidosis.');
    } else if (correctedAnionGap < 4) {
      anionGapStatus = 'LOW_AG';
      steps.push(`Step 3: Anion Gap is abnormally low (${correctedAnionGap} mEq/L). Consider severe hypoalbuminemia, multiple myeloma, lithium toxicity, or bromide toxicity.`);
    } else {
      anionGapStatus = 'NORMAL_AG';
      steps.push(`Step 3: Anion Gap = ${correctedAnionGap} mEq/L (Normal reference 8 - 12 mEq/L).`);
      if (primaryDisturbance.includes('Metabolic Acidosis')) {
        pearls.push('Normal AG Metabolic Acidosis (NAGMA / Hyperchloremic) mnemonic (HARDUP): Hyperalimentation, Acetazolamide, Renal tubular acidosis, Diarrhea, Uretero-sigmoidostomy, Pancreatic fistula.');
      }
    }
  } else {
    steps.push('Step 3: Serum Na and Cl not fully provided; Anion Gap calculation bypassed.');
  }

  // Step 4: Compensation Formulas
  let wintersExpectedPaCO2: { min: number; max: number; target: number } | null = null;
  let metabolicAlkalosisExpectedPaCO2: { min: number; max: number; target: number } | null = null;
  let respiratoryAcidosisExpectedHco3: { acute: number; chronic: number } | null = null;
  let respiratoryAlkalosisExpectedHco3: { acute: number; chronic: number } | null = null;
  let compensationStatus = 'N/A';

  if (primaryDisturbance.includes('Metabolic Acidosis') || (pHCategory === 'ACIDEMIA' && hco3 < 22)) {
    // Winter's formula: PaCO2 = 1.5 * HCO3 + 8 (+/- 2)
    const target = 1.5 * hco3 + 8;
    wintersExpectedPaCO2 = {
      min: Number((target - 2).toFixed(1)),
      max: Number((target + 2).toFixed(1)),
      target: Number(target.toFixed(1)),
    };

    if (paCO2 < wintersExpectedPaCO2.min) {
      compensationStatus = 'Concurrent Respiratory Alkalosis (Hyperventilation exceeding expected)';
      steps.push(`Step 4: Winter's formula predicted PaCO2: ${wintersExpectedPaCO2.min} - ${wintersExpectedPaCO2.max} mmHg. Actual PaCO2 (${paCO2} mmHg) is lower than predicted -> Concurrent Respiratory Alkalosis.`);
    } else if (paCO2 > wintersExpectedPaCO2.max) {
      compensationStatus = 'Concurrent Respiratory Acidosis (Relative hypoventilation / respiratory fatigue)';
      steps.push(`Step 4: Winter's formula predicted PaCO2: ${wintersExpectedPaCO2.min} - ${wintersExpectedPaCO2.max} mmHg. Actual PaCO2 (${paCO2} mmHg) is higher than predicted -> Concurrent Respiratory Acidosis.`);
    } else {
      compensationStatus = 'Adequately Compensated Metabolic Acidosis';
      steps.push(`Step 4: Actual PaCO2 (${paCO2} mmHg) matches Winter's formula expectation (${wintersExpectedPaCO2.min} - ${wintersExpectedPaCO2.max} mmHg) -> Appropriate respiratory compensation.`);
    }
  } else if (primaryDisturbance.includes('Metabolic Alkalosis') || (pHCategory === 'ALKALEMIA' && hco3 > 26)) {
    // Metabolic Alkalosis expected PaCO2 = 0.7 * HCO3 + 21 (+/- 2) (or 40 + 0.7 * (HCO3 - 24))
    const target = 0.7 * hco3 + 21;
    metabolicAlkalosisExpectedPaCO2 = {
      min: Number((target - 2).toFixed(1)),
      max: Number((target + 2).toFixed(1)),
      target: Number(target.toFixed(1)),
    };

    if (paCO2 < metabolicAlkalosisExpectedPaCO2.min) {
      compensationStatus = 'Concurrent Respiratory Alkalosis';
      steps.push(`Step 4: Expected PaCO2 is ${metabolicAlkalosisExpectedPaCO2.min} - ${metabolicAlkalosisExpectedPaCO2.max} mmHg. Actual PaCO2 (${paCO2}) is lower than expected -> Concurrent Respiratory Alkalosis.`);
    } else if (paCO2 > metabolicAlkalosisExpectedPaCO2.max) {
      compensationStatus = 'Concurrent Respiratory Acidosis';
      steps.push(`Step 4: Actual PaCO2 (${paCO2}) exceeds expected ceiling (${metabolicAlkalosisExpectedPaCO2.max}) -> Concurrent Respiratory Acidosis.`);
    } else {
      compensationStatus = 'Adequately Compensated Metabolic Alkalosis';
      steps.push(`Step 4: Actual PaCO2 (${paCO2}) aligns with expected compensatory hypoventilation range (${metabolicAlkalosisExpectedPaCO2.min} - ${metabolicAlkalosisExpectedPaCO2.max} mmHg).`);
    }
  } else if (primaryDisturbance.includes('Respiratory Acidosis') || paCO2 > 45) {
    const deltaPaCO2 = paCO2 - 40;
    const acuteExpected = Number((24 + 1 * (deltaPaCO2 / 10)).toFixed(1));
    const chronicExpected = Number((24 + 3.5 * (deltaPaCO2 / 10)).toFixed(1));
    respiratoryAcidosisExpectedHco3 = { acute: acuteExpected, chronic: chronicExpected };

    if (Math.abs(hco3 - acuteExpected) <= 2) {
      compensationStatus = 'Acute Respiratory Acidosis (1 mEq/L HCO3 rise per 10 mmHg PaCO2 elevation)';
      steps.push(`Step 4: Acute respiratory acidosis expected HCO3 ~${acuteExpected} mEq/L. Actual HCO3 (${hco3}) indicates Acute disturbance.`);
    } else if (Math.abs(hco3 - chronicExpected) <= 3) {
      compensationStatus = 'Chronic Compensated Respiratory Acidosis (3.5 mEq/L HCO3 rise per 10 mmHg PaCO2 elevation)';
      steps.push(`Step 4: Chronic expected HCO3 ~${chronicExpected} mEq/L. Actual HCO3 (${hco3}) indicates Chronic renal compensation (e.g. COPD).`);
    } else if (hco3 > chronicExpected + 3) {
      compensationStatus = 'Respiratory Acidosis with Concurrent Metabolic Alkalosis';
      steps.push(`Step 4: HCO3 (${hco3} mEq/L) exceeds chronic renal compensation ceiling -> Concurrent Metabolic Alkalosis.`);
    } else {
      compensationStatus = 'Acute-on-Chronic or Subacute Respiratory Acidosis';
      steps.push(`Step 4: HCO3 (${hco3} mEq/L) falls between acute (${acuteExpected}) and chronic (${chronicExpected}) thresholds.`);
    }
  } else if (primaryDisturbance.includes('Respiratory Alkalosis') || paCO2 < 35) {
    const deltaPaCO2 = 40 - paCO2;
    const acuteExpected = Number((24 - 2 * (deltaPaCO2 / 10)).toFixed(1));
    const chronicExpected = Number((24 - 5 * (deltaPaCO2 / 10)).toFixed(1));
    respiratoryAlkalosisExpectedHco3 = { acute: acuteExpected, chronic: chronicExpected };

    if (Math.abs(hco3 - acuteExpected) <= 2) {
      compensationStatus = 'Acute Respiratory Alkalosis (2 mEq/L HCO3 drop per 10 mmHg PaCO2 decrease)';
    } else if (Math.abs(hco3 - chronicExpected) <= 3) {
      compensationStatus = 'Chronic Compensated Respiratory Alkalosis (5 mEq/L HCO3 drop per 10 mmHg PaCO2 decrease)';
    } else {
      compensationStatus = 'Mixed Respiratory Alkalosis with Metabolic Disruption';
    }
    steps.push(`Step 4: Respiratory alkalosis renal compensation assessment: Acute expected HCO3 ~${acuteExpected}, Chronic ~${chronicExpected}. Actual: ${hco3} mEq/L.`);
  }

  // Step 5: Delta-Delta Ratio (if High Anion Gap Metabolic Acidosis)
  let deltaDeltaRatio: number | null = null;
  let deltaDeltaInterpretation: string | null = null;

  if (anionGapStatus === 'HIGH_AG' && correctedAnionGap !== null) {
    const deltaAG = correctedAnionGap - 12;
    const deltaHCO3 = 24 - hco3;

    if (deltaHCO3 > 0) {
      deltaDeltaRatio = Number((deltaAG / deltaHCO3).toFixed(2));

      if (deltaDeltaRatio < 0.4) {
        deltaDeltaInterpretation = 'Mixed High AG and Predominant Normal AG (Hyperchloremic) Acidosis';
        steps.push(`Step 5: Delta-Delta ratio = ΔAG / ΔHCO3 = ${deltaAG.toFixed(1)} / ${deltaHCO3.toFixed(1)} = ${deltaDeltaRatio} (< 0.4). Indicates concurrent Normal Anion Gap Metabolic Acidosis.`);
      } else if (deltaDeltaRatio >= 0.4 && deltaDeltaRatio < 0.8) {
        deltaDeltaInterpretation = 'Mixed High Anion Gap and Normal Anion Gap Metabolic Acidosis';
        steps.push(`Step 5: Delta-Delta ratio is ${deltaDeltaRatio} (0.4 - 0.8). Dual acidosis: both unmeasured anions and bicarbonate wasting (e.g. DKA + diarrhea).`);
      } else if (deltaDeltaRatio >= 0.8 && deltaDeltaRatio <= 2.0) {
        deltaDeltaInterpretation = 'Pure High Anion Gap Metabolic Acidosis';
        steps.push(`Step 5: Delta-Delta ratio is ${deltaDeltaRatio} (0.8 - 2.0). Uncomplicated High Anion Gap Metabolic Acidosis.`);
      } else {
        deltaDeltaInterpretation = 'High Anion Gap Acidosis with Concurrent Metabolic Alkalosis or Pre-existing High HCO3';
        steps.push(`Step 5: Delta-Delta ratio is ${deltaDeltaRatio} (> 2.0). ΔAG is disproportionately large compared to the drop in HCO3 -> Concurrent Metabolic Alkalosis (e.g. DKA with severe vomiting).`);
      }
    } else {
      deltaDeltaInterpretation = 'Significant Concurrent Metabolic Alkalosis (HCO3 >= 24 despite High AG)';
      steps.push(`Step 5: ΔHCO3 is <= 0 despite High AG (${correctedAnionGap}). Demonstrates profound underlying Metabolic Alkalosis.`);
    }
  }

  // Step 6: Oxygenation and Alveolar Gas Equation
  // PAO2 = FiO2 * (Patm - PH2O) - (PaCO2 / 0.8)
  const waterVaporPressure = 47;
  const alveolarO2 = Number((fiO2 * (atmosphericPressure - waterVaporPressure) - (paCO2 / 0.8)).toFixed(1));
  const aaGradient = Number((alveolarO2 - paO2).toFixed(1));
  // Expected A-a gradient: (Age / 4) + 4
  const expectedAaGradient = Number(((patientAge / 4) + 4).toFixed(1));
  const pfRatio = Number((paO2 / fiO2).toFixed(1));

  if (aaGradient > expectedAaGradient + 5) {
    steps.push(`Step 6: Alveolar-arterial (A-a) O2 gradient is ${aaGradient} mmHg (expected: ~${expectedAaGradient} mmHg). Elevated gradient indicates V/Q mismatch, right-to-left shunt, or diffusion impairment (e.g., PE, pneumonia, pulmonary edema, ARDS).`);
    pearls.push(`Hypoxemia with NORMAL A-a gradient suggests hypoventilation (CNS depression, neuromuscular weakness) or low inspired oxygen fraction (high altitude).`);
  } else {
    steps.push(`Step 6: A-a O2 gradient is ${aaGradient} mmHg (within normal age-adjusted range of ~${expectedAaGradient} mmHg).`);
  }

  if (pfRatio < 300) {
    let ardsGrade = 'Mild ARDS (200 - 300)';
    if (pfRatio < 100) ardsGrade = 'Severe ARDS (< 100)';
    else if (pfRatio < 200) ardsGrade = 'Moderate ARDS (100 - 200)';
    pearls.push(`PaO2/FiO2 ratio is ${pfRatio} mmHg -> Berlin criteria indicates ${ardsGrade}.`);
  }

  return {
    primaryDisturbance,
    pHCategory,
    rawAnionGap,
    correctedAnionGap,
    anionGapStatus,
    wintersExpectedPaCO2,
    metabolicAlkalosisExpectedPaCO2,
    respiratoryAcidosisExpectedHco3,
    respiratoryAlkalosisExpectedHco3,
    compensationStatus,
    deltaDeltaRatio,
    deltaDeltaInterpretation,
    alveolarO2,
    aaGradient,
    expectedAaGradient,
    pfRatio,
    diagnosticPearls: pearls,
    stepByStepRationale: steps,
  };
}


// ==========================================
// 2. CBC & ANEMIA SOLVER
// ==========================================

export interface CbcInputParams {
  hemoglobin: number;         // g/dL (normal: F 12-16, M 13.5-17.5)
  hematocrit: number;         // % (normal: F 36-48, M 40-52)
  rbc: number;                // x10^6/uL (normal 4.0 - 5.5)
  mcv: number;                // fL (normal 80 - 100)
  mch?: number;               // pg (normal 27 - 33)
  mchc?: number;              // g/dL (normal 32 - 36)
  rdw: number;                // % (normal 11.5 - 14.5)
  wbc: number;                // x10^3/uL (normal 4.0 - 11.0)
  platelets: number;          // x10^3/uL (normal 150 - 450)
  reticulocytePercent?: number; // % (normal 0.5 - 2.5)
  patientSex?: 'male' | 'female';
}

export interface CbcAnalysisResult {
  hasAnemia: boolean;
  mcvClassification: 'MICROCYTIC' | 'NORMOCYTIC' | 'MACROCYTIC' | 'NORMAL_WITHOUT_ANEMIA';
  mentzerIndex: number | null;
  mentzerInterpretation: string | null;
  reticulocyteProductionIndex: number | null;
  rpiClassification: 'HYPOPROLIFERATIVE' | 'HYPERPROLIFERATIVE' | 'NOT_AVAILABLE';
  rdwStatus: 'ELEVATED_ANISOCYTOSIS' | 'NORMAL_HOMOGENEOUS';
  wbcStatus: 'LEUKOCYTOSIS' | 'LEUKOPENIA' | 'NORMAL_WBC';
  plateletStatus: 'THROMBOCYTOPENIA' | 'THROMBOCYTOSIS' | 'NORMAL_PLATELETS';
  pancytopenia: boolean;
  differentialDiagnosis: string[];
  recommendedWorkup: string[];
  diagnosticPearls: string[];
}

export function evaluateCbc(params: CbcInputParams): CbcAnalysisResult {
  const {
    hemoglobin,
    hematocrit,
    rbc,
    mcv,
    rdw,
    wbc,
    platelets,
    reticulocytePercent,
    patientSex = 'female',
  } = params;

  const normalHbFloor = patientSex === 'male' ? 13.5 : 12.0;
  const hasAnemia = hemoglobin < normalHbFloor;

  let mcvClassification: 'MICROCYTIC' | 'NORMOCYTIC' | 'MACROCYTIC' | 'NORMAL_WITHOUT_ANEMIA';
  if (!hasAnemia) {
    mcvClassification = 'NORMAL_WITHOUT_ANEMIA';
  } else if (mcv < 80) {
    mcvClassification = 'MICROCYTIC';
  } else if (mcv > 100) {
    mcvClassification = 'MACROCYTIC';
  } else {
    mcvClassification = 'NORMOCYTIC';
  }

  // Mentzer Index: MCV / RBC
  let mentzerIndex: number | null = null;
  let mentzerInterpretation: string | null = null;
  if (rbc > 0) {
    mentzerIndex = Number((mcv / rbc).toFixed(1));
    if (mcv < 80) {
      if (mentzerIndex < 13) {
        mentzerInterpretation = 'Mentzer Index < 13: Suggestive of Thalassemia Trait (Thalassemia Minor). High RBC count relative to low MCV.';
      } else {
        mentzerInterpretation = 'Mentzer Index >= 13: Suggestive of Iron Deficiency Anemia (IDA) or Anemia of Chronic Disease.';
      }
    }
  }

  // Reticulocyte Production Index (RPI)
  let reticulocyteProductionIndex: number | null = null;
  let rpiClassification: 'HYPOPROLIFERATIVE' | 'HYPERPROLIFERATIVE' | 'NOT_AVAILABLE' = 'NOT_AVAILABLE';

  if (reticulocytePercent !== undefined) {
    // Maturation factor based on Hct: >=36: 1.0; 26-35: 1.5; 16-25: 2.0; <16: 2.5
    let maturationFactor = 1.0;
    if (hematocrit < 16) maturationFactor = 2.5;
    else if (hematocrit < 26) maturationFactor = 2.0;
    else if (hematocrit < 36) maturationFactor = 1.5;

    const normalHct = patientSex === 'male' ? 45 : 42;
    const correctedRetic = reticulocytePercent * (hematocrit / normalHct);
    reticulocyteProductionIndex = Number((correctedRetic / maturationFactor).toFixed(2));

    if (reticulocyteProductionIndex < 2.0) {
      rpiClassification = 'HYPOPROLIFERATIVE';
    } else {
      rpiClassification = 'HYPERPROLIFERATIVE';
    }
  }

  const rdwStatus = rdw > 14.5 ? 'ELEVATED_ANISOCYTOSIS' : 'NORMAL_HOMOGENEOUS';
  const wbcStatus = wbc > 11.0 ? 'LEUKOCYTOSIS' : wbc < 4.0 ? 'LEUKOPENIA' : 'NORMAL_WBC';
  const plateletStatus = platelets < 150 ? 'THROMBOCYTOPENIA' : platelets > 450 ? 'THROMBOCYTOSIS' : 'NORMAL_PLATELETS';
  const pancytopenia = hasAnemia && wbc < 4.0 && platelets < 150;

  const differential: string[] = [];
  const workup: string[] = [];
  const pearls: string[] = [];

  if (pancytopenia) {
    differential.push('Aplastic Anemia', 'Acute Leukemia / Myelodysplastic Syndrome (MDS)', 'Severe Megaloblastic Anemia (B12/Folate deficiency)', 'Splenic Sequestration / Hypersplenism', 'Bone Marrow Infiltration / Myelophthisic process');
    workup.push('Bone marrow aspiration and trephine biopsy', 'Serum B12 and folate levels', 'Flow cytometry for PNH / leukemia clones', 'Abdominal ultrasound for splenomegaly');
    pearls.push('Pancytopenia in young adults requires immediate exclusion of Aplastic Anemia and Acute Leukemia.');
  } else if (hasAnemia) {
    if (mcvClassification === 'MICROCYTIC') {
      if (mentzerIndex !== null && mentzerIndex < 13 && rdwStatus === 'NORMAL_HOMOGENEOUS') {
        differential.push('Beta-Thalassemia Minor / Alpha-Thalassemia Trait', 'Hemoglobin E disease', 'Anemia of Chronic Disease (late)');
        workup.push('Hemoglobin electrophoresis (elevated HbA2 > 3.5% confirms Beta-thal minor)', 'Ferritin to rule out concurrent iron deficiency', 'Genetic testing for alpha-globin deletions');
        pearls.push('Thalassemia traits typically have normal RDW, high RBC count (>5.0), and low MCV (<75). Do NOT administer empiric iron without ferritin confirmation.');
      } else {
        differential.push('Iron Deficiency Anemia (most common)', 'Anemia of Chronic Inflammation/Disease', 'Lead poisoning (sideroblastic)', 'Early Thalassemia trait');
        workup.push('Serum Ferritin, Iron, TIBC, and Transferrin Saturation (TSAT < 20% confirms iron deficiency)', 'Fecal occult blood test / Colonoscopy + Endoscopy for occult GI bleed in adults');
        pearls.push('Serum Ferritin < 30 ng/mL is virtually 100% specific for Iron Deficiency Anemia.');
      }
    } else if (mcvClassification === 'MACROCYTIC') {
      differential.push('Vitamin B12 Deficiency (Pernicious anemia, malabsorption)', 'Folate Deficiency (poor diet, alcoholism, methotrexate)', 'Drug-induced (Hydroxyurea, MTX, Zidovudine)', 'Myelodysplastic Syndrome (MDS)', 'Reticulocytosis / Acute hemolysis (reticulocytes are large cell volume)', 'Hypothyroidism / Liver disease');
      workup.push('Serum B12 and RBC Folate levels', 'Serum Methylmalonic Acid (MMA) and Homocysteine (both elevated in B12; only homocysteine in folate)', 'Peripheral blood smear for hypersegmented neutrophils (>5 lobes)');
      pearls.push('Always rule out B12 deficiency before treating with folate alone to prevent irreversible Subacute Combined Degeneration of the spinal cord.');
    } else if (mcvClassification === 'NORMOCYTIC') {
      if (rpiClassification === 'HYPERPROLIFERATIVE') {
        differential.push('Acute Hemolytic Anemia (Immune AIHA, Microangiopathic TTP/HUS/DIC, G6PD crisis, Hereditary Spherocytosis)', 'Acute Blood Loss (active hemorrhage)', 'Response to iron/B12 replacement');
        workup.push('Direct Antiglobulin Test (Coombs test)', 'Serum Haptoglobin (depleted in intravascular hemolysis), LDH, and Indirect Bilirubin', 'Peripheral blood smear for schistocytes (TTP/HUS) or spherocytes');
        pearls.push('Schistocytes (helmet cells) on peripheral smear + thrombocytopenia + normocytic anemia is a medical emergency: immediately evaluate for TTP (ADAMTS13 deficiency).');
      } else {
        differential.push('Anemia of Chronic Disease / Chronic Kidney Disease (decreased EPO)', 'Aplastic anemia / early marrow hypoplasia', 'Endocrine dysfunction (hypothyroidism, adrenal insufficiency)', 'Early mixed nutritional deficiency (iron + folate canceling MCV shift)');
        workup.push('Serum Creatinine, eGFR, and EPO level', 'ESR and CRP', 'Iron studies and B12/folate panel');
        pearls.push('Anemia of Chronic Disease exhibits normal-to-high ferritin with low serum iron and low TIBC (iron trapped in reticuloendothelial macrophages by hepcidin).');
      }
    }
  }

  return {
    hasAnemia,
    mcvClassification,
    mentzerIndex,
    mentzerInterpretation,
    reticulocyteProductionIndex,
    rpiClassification,
    rdwStatus,
    wbcStatus,
    plateletStatus,
    pancytopenia,
    differentialDiagnosis: differential,
    recommendedWorkup: workup,
    diagnosticPearls: pearls,
  };
}


// ==========================================
// 3. CMP & ELECTROLYTE SOLVER
// ==========================================

export interface ElectrolyteInputParams {
  sodium: number;             // mEq/L, normal 135 - 145
  potassium: number;          // mEq/L, normal 3.5 - 5.0
  chloride: number;           // mEq/L, normal 96 - 106
  bicarbonate: number;        // mEq/L, normal 22 - 26
  bun: number;                // mg/dL, normal 7 - 20
  creatinine: number;         // mg/dL, normal 0.7 - 1.3
  glucose: number;            // mg/dL, normal 70 - 100
  calcium: number;            // mg/dL, normal 8.5 - 10.5
  albumin: number;            // g/dL, normal 3.5 - 5.0
  measuredOsmolality?: number | null; // mOsm/kg, normal 275 - 295
}

export interface ElectrolyteAnalysisResult {
  correctedSodium: number;
  sodiumStatus: 'HYPONATREMIA' | 'HYPERNATREMIA' | 'EUNATREMIA';
  correctedCalcium: number;
  calciumStatus: 'HYPOCALCEMIA' | 'HYPERCALCEMIA' | 'EUCALCEMIA';
  calculatedOsmolality: number;
  osmolarGap: number | null;
  osmolarGapElevated: boolean;
  bunCreatinineRatio: number;
  akiPhenotype: 'PRE_RENAL_AZOTEMIA' | 'INTRINSIC_RENAL_ATN' | 'NORMAL_OR_POST_RENAL';
  hypokalemiaRisk: string | null;
  hyperkalemiaRisk: string | null;
  diagnosticPearls: string[];
}

export function evaluateElectrolytes(params: ElectrolyteInputParams): ElectrolyteAnalysisResult {
  const {
    sodium,
    potassium,
    chloride,
    bicarbonate,
    bun,
    creatinine,
    glucose,
    calcium,
    albumin,
    measuredOsmolality,
  } = params;

  const pearls: string[] = [];

  // Corrected Sodium in hyperglycemia: Na + 0.016 * max(0, Glucose - 100) (Katz formula)
  const excessGlucose = Math.max(0, glucose - 100);
  const correctedSodium = Number((sodium + 0.016 * excessGlucose).toFixed(1));

  let sodiumStatus: 'HYPONATREMIA' | 'HYPERNATREMIA' | 'EUNATREMIA' = 'EUNATREMIA';
  if (correctedSodium < 135) sodiumStatus = 'HYPONATREMIA';
  else if (correctedSodium > 145) sodiumStatus = 'HYPERNATREMIA';

  // Corrected Calcium in hypoalbuminemia: Ca + 0.8 * (4.0 - Albumin)
  const correctedCalcium = Number((calcium + 0.8 * (4.0 - albumin)).toFixed(1));
  let calciumStatus: 'HYPOCALCEMIA' | 'HYPERCALCEMIA' | 'EUCALCEMIA' = 'EUCALCEMIA';
  if (correctedCalcium < 8.5) calciumStatus = 'HYPOCALCEMIA';
  else if (correctedCalcium > 10.5) calciumStatus = 'HYPERCALCEMIA';

  // Calculated Serum Osmolality: 2 * Na + Glucose/18 + BUN/2.8
  const calculatedOsmolality = Number((2 * sodium + (glucose / 18) + (bun / 2.8)).toFixed(1));
  let osmolarGap: number | null = null;
  let osmolarGapElevated = false;

  if (measuredOsmolality) {
    osmolarGap = Number((measuredOsmolality - calculatedOsmolality).toFixed(1));
    osmolarGapElevated = osmolarGap > 10;
    if (osmolarGapElevated) {
      pearls.push(`Elevated Osmolar Gap (${osmolarGap} mOsm/kg > 10): Suspicious for toxic ingestion (Methanol, Ethylene glycol, Isopropanol, Propylene glycol, or Ketoacidosis).`);
    }
  }

  // BUN / Creatinine Ratio
  const bunCreatinineRatio = creatinine > 0 ? Number((bun / creatinine).toFixed(1)) : 0;
  let akiPhenotype: 'PRE_RENAL_AZOTEMIA' | 'INTRINSIC_RENAL_ATN' | 'NORMAL_OR_POST_RENAL' = 'NORMAL_OR_POST_RENAL';

  if (bunCreatinineRatio > 20 && creatinine > 1.2) {
    akiPhenotype = 'PRE_RENAL_AZOTEMIA';
    pearls.push('BUN/Cr > 20:1 with elevated creatinine indicates Pre-renal Azotemia (hypovolemia, CHF, bilateral renal artery stenosis) or upper GI hemorrhage.');
  } else if (bunCreatinineRatio < 15 && creatinine > 1.2) {
    akiPhenotype = 'INTRINSIC_RENAL_ATN';
    pearls.push('BUN/Cr < 15:1 with elevated creatinine suggests Intrinsic Acute Kidney Injury (Acute Tubular Necrosis from nephrotoxins/ischemia or acute interstitial nephritis).');
  }

  // Potassium risks
  let hypokalemiaRisk: string | null = null;
  let hyperkalemiaRisk: string | null = null;
  if (potassium < 3.5) {
    hypokalemiaRisk = potassium < 3.0 ? 'Severe Hypokalemia: High risk of cardiac arrhythmias (flattened T waves, U waves, prolonged QT, Torsades de Pointes), muscle weakness, and ileus.' : 'Mild-to-Moderate Hypokalemia: Monitor ECG and supplement potassium with magnesium.';
  } else if (potassium > 5.0) {
    hyperkalemiaRisk = potassium > 6.5 ? 'CRITICAL Hyperkalemia Emergency: Imminent risk of ventricular fibrillation / asystole. Look for peaked T waves, prolonged PR, widened QRS, sine wave. Administer IV Calcium Gluconate immediately for myocardial stabilization.' : 'Moderate Hyperkalemia: Peaked T waves, monitor telemetry and administer shifting agents (Insulin + Dextrose, Beta-2 agonists).';
  }

  if (excessGlucose > 100) {
    pearls.push(`Hyperglycemia draws water into the extracellular space, diluting measured sodium. Always evaluate Corrected Sodium (${correctedSodium} mEq/L) rather than measured.`);
  }

  return {
    correctedSodium,
    sodiumStatus,
    correctedCalcium,
    calciumStatus,
    calculatedOsmolality,
    osmolarGap,
    osmolarGapElevated,
    bunCreatinineRatio,
    akiPhenotype,
    hypokalemiaRisk,
    hyperkalemiaRisk,
    diagnosticPearls: pearls,
  };
}


// ==========================================
// 4. COAGULATION & LIVER SOLVER
// ==========================================

export interface CoagInputParams {
  pt: number;                 // seconds (normal 11.0 - 13.5)
  inr: number;                // ratio (normal 0.8 - 1.1)
  aptt: number;               // seconds (normal 25.0 - 35.0)
  thrombinTime?: number;      // seconds (normal 14.0 - 19.0)
  fibrinogen: number;         // mg/dL (normal 200 - 400)
  dDimer: number;             // ng/mL (normal < 500)
  mixingStudyAptt?: number | null; // seconds after 1:1 mix with normal pooled plasma
  ast: number;                // U/L (normal 10 - 40)
  alt: number;                // U/L (normal 7 - 56)
  alp: number;                // U/L (normal 44 - 147)
  ggt: number;                // U/L (normal 9 - 48)
  totalBilirubin: number;     // mg/dL (normal 0.2 - 1.2)
  directBilirubin: number;    // mg/dL (normal 0.0 - 0.3)
}

export interface CoagAnalysisResult {
  coagPathwayDefect: 'NORMAL' | 'ISOLATED_EXTRINSIC_PT' | 'ISOLATED_INTRINSIC_APTT' | 'COMBINED_COMMON_PATHWAY';
  mixingStudyOutcome: 'NOT_TESTED' | 'CORRECTS_FACTOR_DEFICIENCY' | 'FAILS_TO_CORRECT_INHIBITOR';
  deRitisRatio: number;
  liverEnzymePattern: 'NORMAL' | 'HEPATOCELLULAR_ALCOHOLIC' | 'HEPATOCELLULAR_VIRAL_NASH' | 'CHOLESTATIC_BILIARY' | 'ISOLATED_BONE_OR_EXTRAHEPATIC';
  hyperbilirubinemiaType: 'NONE' | 'CONJUGATED_DIRECT' | 'UNCONJUGATED_INDIRECT';
  suspicionOfDic: boolean;
  diagnosticPearls: string[];
  recommendedWorkup: string[];
}

export function evaluateCoagulation(params: CoagInputParams): CoagAnalysisResult {
  const {
    pt,
    inr,
    aptt,
    fibrinogen,
    dDimer,
    mixingStudyAptt,
    ast,
    alt,
    alp,
    ggt,
    totalBilirubin,
    directBilirubin,
  } = params;

  const pearls: string[] = [];
  const workup: string[] = [];

  // Coagulation pathway
  const ptProlonged = pt > 13.5 || inr > 1.2;
  const apttProlonged = aptt > 36.0;

  let coagPathwayDefect: 'NORMAL' | 'ISOLATED_EXTRINSIC_PT' | 'ISOLATED_INTRINSIC_APTT' | 'COMBINED_COMMON_PATHWAY' = 'NORMAL';
  if (ptProlonged && apttProlonged) {
    coagPathwayDefect = 'COMBINED_COMMON_PATHWAY';
  } else if (ptProlonged) {
    coagPathwayDefect = 'ISOLATED_EXTRINSIC_PT';
  } else if (apttProlonged) {
    coagPathwayDefect = 'ISOLATED_INTRINSIC_APTT';
  }

  // 1:1 Mixing Study
  let mixingStudyOutcome: 'NOT_TESTED' | 'CORRECTS_FACTOR_DEFICIENCY' | 'FAILS_TO_CORRECT_INHIBITOR' = 'NOT_TESTED';
  if (apttProlonged && mixingStudyAptt !== undefined && mixingStudyAptt !== null) {
    if (mixingStudyAptt <= 35.0) {
      mixingStudyOutcome = 'CORRECTS_FACTOR_DEFICIENCY';
      pearls.push('1:1 Mixing Study Corrects: Provides missing clotting factor from normal plasma -> Factor Deficiency (Factor VIII [Hemophilia A], IX [Hemophilia B], or XI).');
      workup.push('Specific clotting factor assays (Factor VIII, IX, XI, and von Willebrand panel).');
    } else {
      mixingStudyOutcome = 'FAILS_TO_CORRECT_INHIBITOR';
      pearls.push('1:1 Mixing Study FAILS to correct: Circulating inhibitor inactivates factors in added normal plasma -> Lupus Anticoagulant / Antiphospholipid Syndrome or acquired Factor VIII inhibitor.');
      workup.push('Dilute Russell Viper Venom Time (dRVVT), Anti-cardiolipin antibodies, Anti-beta-2-glycoprotein-1 antibodies.');
    }
  }

  // DIC suspicion
  const suspicionOfDic = ptProlonged && apttProlonged && fibrinogen < 150 && dDimer > 1000;
  if (suspicionOfDic) {
    pearls.push('CRITICAL ALERT: Consumptive coagulopathy (DIC). Elevated PT/INR, prolonged aPTT, consumed fibrinogen (<150 mg/dL), and sky-high D-Dimer.');
  }

  // Liver De Ritis Ratio: AST / ALT
  const deRitisRatio = alt > 0 ? Number((ast / alt).toFixed(2)) : 1.0;
  let liverEnzymePattern: 'NORMAL' | 'HEPATOCELLULAR_ALCOHOLIC' | 'HEPATOCELLULAR_VIRAL_NASH' | 'CHOLESTATIC_BILIARY' | 'ISOLATED_BONE_OR_EXTRAHEPATIC' = 'NORMAL';

  const astElevated = ast > 45;
  const altElevated = alt > 56;
  const alpElevated = alp > 147;
  const ggtElevated = ggt > 48;

  if (alpElevated) {
    if (ggtElevated) {
      liverEnzymePattern = 'CHOLESTATIC_BILIARY';
      pearls.push('Concomitant elevation of ALP and GGT confirms hepatobiliary / cholestatic origin (e.g. choledocholithiasis, primary biliary cholangitis, pancreatic head tumor).');
      workup.push('Right upper quadrant ultrasound or MRCP to evaluate for biliary ductal dilation.');
    } else {
      liverEnzymePattern = 'ISOLATED_BONE_OR_EXTRAHEPATIC';
      pearls.push('Elevated ALP with NORMAL GGT points towards bone pathology (Paget disease, bone metastases, hyperparathyroidism) or pregnancy rather than liver disease.');
    }
  } else if (astElevated || altElevated) {
    if (deRitisRatio >= 2.0 && ast < 500) {
      liverEnzymePattern = 'HEPATOCELLULAR_ALCOHOLIC';
      pearls.push('De Ritis Ratio (AST/ALT) >= 2.0 with moderate transaminase elevation (<500 U/L) is classic for Alcoholic Hepatitis (mitochondrial AST release + low ALT from pyridoxine B6 deficiency).');
    } else {
      liverEnzymePattern = 'HEPATOCELLULAR_VIRAL_NASH';
      pearls.push('AST/ALT < 1.0 typically characterizes NAFLD/NASH or Chronic Viral Hepatitis B/C.');
    }
  }

  // Hyperbilirubinemia fractionation
  let hyperbilirubinemiaType: 'NONE' | 'CONJUGATED_DIRECT' | 'UNCONJUGATED_INDIRECT' = 'NONE';
  if (totalBilirubin > 1.2) {
    const directFraction = directBilirubin / totalBilirubin;
    if (directFraction > 0.5) {
      hyperbilirubinemiaType = 'CONJUGATED_DIRECT';
      pearls.push('Conjugated Hyperbilirubinemia (Direct fraction > 50%): Indicates biliary outflow obstruction, intrahepatic cholestasis, or Dubin-Johnson/Rotor syndromes.');
    } else {
      hyperbilirubinemiaType = 'UNCONJUGATED_INDIRECT';
      pearls.push('Unconjugated Hyperbilirubinemia (Indirect fraction > 80%): Suggests hemolysis, Gilbert syndrome (reduced UDP-glucuronosyltransferase activity), or Crigler-Najjar.');
    }
  }

  return {
    coagPathwayDefect,
    mixingStudyOutcome,
    deRitisRatio,
    liverEnzymePattern,
    hyperbilirubinemiaType,
    suspicionOfDic,
    diagnosticPearls: pearls,
    recommendedWorkup: workup,
  };
}


// ==========================================
// 5. CURATED BOARD-STYLE CLINICAL PRESETS
// ==========================================

export interface ClinicalLabCasePreset {
  id: string;
  title: string;
  panel: 'ABG' | 'CBC' | 'CMP' | 'COAG';
  patientVignette: string;
  examClues: string[];
  expectedDiagnosis: string;
  abgParams?: AbgInputParams;
  cbcParams?: CbcInputParams;
  cmpParams?: ElectrolyteInputParams;
  coagParams?: CoagInputParams;
  teachingExplanation: string;
}

export const CLINICAL_LAB_PRESETS: ClinicalLabCasePreset[] = [
  {
    id: 'dka',
    title: 'Diabetic Ketoacidosis (DKA) with Winter\'s Compensation',
    panel: 'ABG',
    patientVignette: 'A 24-year-old female with Type 1 Diabetes presents to the emergency department with nausea, vomiting, diffuse abdominal pain, and rapid, deep Kussmaul respirations following a 3-day viral gastroenteritis.',
    examClues: ['Fruity breath odor', 'Tachycardia (HR 124)', 'Dry mucous membranes', 'Kussmaul breathing (RR 32)'],
    expectedDiagnosis: 'High Anion Gap Metabolic Acidosis (HAGMA) with Appropriate Respiratory Compensation (Winter\'s formula)',
    abgParams: {
      pH: 7.15,
      paCO2: 20,
      hco3: 7,
      paO2: 98,
      fiO2: 0.21,
      na: 132,
      cl: 98,
      albumin: 4.0,
      patientAge: 24,
    },
    cmpParams: {
      sodium: 132,
      potassium: 5.4,
      chloride: 98,
      bicarbonate: 7,
      bun: 42,
      creatinine: 1.8,
      glucose: 540,
      calcium: 9.0,
      albumin: 4.0,
      measuredOsmolality: 320,
    },
    teachingExplanation: 'Calculated AG = 132 - (98 + 7) = 27 mEq/L (severely elevated). Winter\'s formula: Expected PaCO2 = 1.5*(7) + 8 = 18.5 +/- 2 (range 16.5 - 20.5 mmHg). Measured PaCO2 of 20 mmHg falls squarely within the window, confirming adequate compensatory hyperventilation. Corrected Sodium is 132 + 0.016*(540-100) = 139 mEq/L.',
  },
  {
    id: 'copd-acute',
    title: 'Acute Hypercapnic Exacerbation of COPD',
    panel: 'ABG',
    patientVignette: 'A 68-year-old male with a 50 pack-year smoking history and known GOLD stage 3 COPD presents with progressive dyspnea, increased sputum purulence, and drowsiness.',
    examClues: ['Drowsy and somnolent', 'Diffuse expiratory wheezing and rhonchi', 'Pursed-lip breathing', 'Asterixis / CO2 tremor'],
    expectedDiagnosis: 'Acute-on-Chronic Respiratory Acidosis with Severe Hypoxemic Failure',
    abgParams: {
      pH: 7.24,
      paCO2: 74,
      hco3: 31,
      paO2: 52,
      fiO2: 0.21,
      na: 138,
      cl: 98,
      albumin: 3.8,
      patientAge: 68,
    },
    teachingExplanation: 'Severe hypercapnia (PaCO2 74 mmHg) with acidemia (pH 7.24). In chronic COPD, baseline HCO3 is elevated (typically 30-32 mEq/L due to chronic metabolic compensation). The acute jump in PaCO2 pushes pH down before the kidneys can synthesize further bicarbonate, demonstrating Acute-on-Chronic Respiratory Acidosis.',
  },
  {
    id: 'salicylate-toxicity',
    title: 'Salicylate (Aspirin) Overdose: Mixed Triple Disorder',
    panel: 'ABG',
    patientVignette: 'A 32-year-old male presents with tinnitus, vertigo, vomiting, hyperventilation, and confusion 6 hours after ingesting a bottle of concentrated acetylsalicylic acid tablets.',
    examClues: ['Tachypneic (RR 34)', 'Diaphoretic', 'Tinnitus (ringing in ears)', 'Warm flushed skin'],
    expectedDiagnosis: 'Mixed Respiratory Alkalosis and High Anion Gap Metabolic Acidosis',
    abgParams: {
      pH: 7.42,
      paCO2: 18,
      hco3: 11,
      paO2: 104,
      fiO2: 0.21,
      na: 140,
      cl: 102,
      albumin: 4.0,
      patientAge: 32,
    },
    teachingExplanation: 'Classic USMLE Step presentation: Salicylates directly stimulate the medullary respiratory center causing hyperventilation (Respiratory Alkalosis), while simultaneously uncoupling oxidative phosphorylation and accumulating salicylic acid / ketoacids (High AG Metabolic Acidosis). The combination creates a near-normal pH with profoundly low PaCO2 (18) and HCO3 (11).',
  },
  {
    id: 'vomiting-alkalosis',
    title: 'Pyloric Stenosis / Protracted Vomiting',
    panel: 'ABG',
    patientVignette: 'A 54-year-old male with gastric ulcer disease and outlet obstruction presents with 5 days of persistent non-bilious projectile emesis and severe lightheadedness.',
    examClues: ['Orthostatic hypotension', 'Hypotonia and muscle twitches', 'Sunken eyes and dry tongue'],
    expectedDiagnosis: 'Severe Hypokalemic Hypochloremic Metabolic Alkalosis with Compensatory Hypoventilation',
    abgParams: {
      pH: 7.56,
      paCO2: 50,
      hco3: 44,
      paO2: 82,
      fiO2: 0.21,
      na: 136,
      cl: 82,
      albumin: 4.2,
      patientAge: 54,
    },
    cmpParams: {
      sodium: 136,
      potassium: 2.7,
      chloride: 82,
      bicarbonate: 44,
      bun: 38,
      creatinine: 1.4,
      glucose: 95,
      calcium: 9.1,
      albumin: 4.2,
    },
    teachingExplanation: 'Gastric fluid contains high HCl and KCl. Vomiting results in loss of hydrogen ions, chloride, and potassium. Loss of Cl- prevents renal HCO3- excretion (chloride-responsive alkalosis). Expected compensatory PaCO2 = 0.7*(44) + 21 = 51.8 mmHg, closely matching the measured PaCO2 of 50 mmHg.',
  },
  {
    id: 'iron-deficiency-anemia',
    title: 'Severe Microcytic Iron Deficiency Anemia (IDA)',
    panel: 'CBC',
    patientVignette: 'A 42-year-old female presents with severe fatigue, exertional dyspnea, restless leg syndrome, and pica (craving ice cubes). She reports heavy menorrhagia for the past 18 months.',
    examClues: ['Conjunctival pallor', 'Koilonychia (spoon nails)', 'Angular cheilitis', 'Systolic flow murmur'],
    expectedDiagnosis: 'Microcytic Hypochromic Anemia secondary to Chronic Blood Loss (Iron Deficiency)',
    cbcParams: {
      hemoglobin: 7.2,
      hematocrit: 23,
      rbc: 3.1,
      mcv: 68,
      mch: 21,
      mchc: 28,
      rdw: 19.8,
      wbc: 6.4,
      platelets: 510,
      reticulocytePercent: 0.8,
      patientSex: 'female',
    },
    teachingExplanation: 'Classic IDA findings: MCV 68 fL (<80), Mentzer index = 68 / 3.1 = 21.9 (>13, favors iron deficiency over thalassemia), elevated RDW 19.8% (anisocytosis due to emerging microcytes alongside aging normocytes), and reactive thrombocytosis (platelets 510k, mediated by elevated circulating erythropoietin cross-stimulating megakaryocytes).',
  },
  {
    id: 'thalassemia-minor',
    title: 'Beta-Thalassemia Minor (Thalassemia Trait)',
    panel: 'CBC',
    patientVignette: 'A 28-year-old male of Greek descent attends an executive health checkup. He is completely asymptomatic, runs 5 km thrice weekly, and was previously prescribed iron supplements without any change in his blood count.',
    examClues: ['Normal physical examination', 'Mild familial splenomegaly', 'No pallor or jaundice'],
    expectedDiagnosis: 'Beta-Thalassemia Trait (Heterozygous Beta-Globin Gene Mutation)',
    cbcParams: {
      hemoglobin: 11.4,
      hematocrit: 36,
      rbc: 6.2,
      mcv: 62,
      mch: 20,
      mchc: 31,
      rdw: 13.1,
      wbc: 5.8,
      platelets: 240,
      reticulocytePercent: 1.8,
      patientSex: 'male',
    },
    teachingExplanation: 'Mentzer Index = 62 / 6.2 = 10.0 (< 13)! Characteristic features of Thalassemia minor: Disproportionately high RBC count (>6.0 million/uL) despite microcytic anemia, paired with a NORMAL RDW (13.1%, indicating uniform microcytosis from birth). Ferritin is normal. Hemoglobin electrophoresis confirms elevated HbA2 (> 3.5%).',
  },
  {
    id: 'warm-aiha',
    title: 'Warm Autoimmune Hemolytic Anemia (AIHA)',
    panel: 'CBC',
    patientVignette: 'A 38-year-old female with Systemic Lupus Erythematosus presents with acute jaundice, dark tea-colored urine, lightheadedness, and tachycardia.',
    examClues: ['Scleral icterus', 'Splenomegaly (palpable 3 cm below costal margin)', 'Severe pallor'],
    expectedDiagnosis: 'Extravascular Hemolytic Anemia with Robust Reticulocytosis (RPI > 2.5)',
    cbcParams: {
      hemoglobin: 6.5,
      hematocrit: 20,
      rbc: 2.1,
      mcv: 96,
      mch: 31,
      mchc: 34,
      rdw: 18.2,
      wbc: 11.8,
      platelets: 210,
      reticulocytePercent: 14.0,
      patientSex: 'female',
    },
    teachingExplanation: 'Normocytic anemia with sky-high reticulocyte count (14%). Maturation factor for Hct 20% is 2.0. Corrected Reticulocyte Count = 14 * (20 / 42) = 6.67%. Reticulocyte Production Index (RPI) = 6.67 / 2.0 = 3.33 (> 2.0 confirms hyperproliferative hemolytic bone marrow response). Direct Antiglobulin (Coombs) test is positive for IgG.',
  },
  {
    id: 'prerenal-aki',
    title: 'Pre-Renal Azotemia secondary to Dehydration',
    panel: 'CMP',
    patientVignette: 'An 82-year-old nursing home resident presents with lethargy, poor oral fluid intake for 4 days during a heatwave, and reduced urine output.',
    examClues: ['Dry axillae and mucous membranes', 'Poor skin turgor', 'Postural tachycardia (BP 94/60, HR 108)'],
    expectedDiagnosis: 'Pre-Renal Acute Kidney Injury (BUN/Creatinine ratio > 20:1)',
    cmpParams: {
      sodium: 148,
      potassium: 4.8,
      chloride: 109,
      bicarbonate: 24,
      bun: 58,
      creatinine: 2.1,
      glucose: 105,
      calcium: 9.8,
      albumin: 4.6,
      measuredOsmolality: 312,
    },
    teachingExplanation: 'BUN = 58, Creatinine = 2.1. BUN/Cr ratio = 58 / 2.1 = 27.6 (> 20:1). In hypovolemia, renal hypoperfusion activates the renin-angiotensin-aldosterone axis; avid proximal tubule urea reabsorption parallels sodium and water retention, driving BUN up disproportionately to creatinine.',
  },
  {
    id: 'acute-atn',
    title: 'Intrinsic Renal Acute Tubular Necrosis (ATN)',
    panel: 'CMP',
    patientVignette: 'A 65-year-old male who underwent emergency endovascular aneurysm repair with 250 mL of iodinated contrast develops oliguria on post-operative day 2.',
    examClues: ['Trace peripheral edema', 'Normotensive on low-dose vasopressors', 'Muddy brown granular casts on urinalysis'],
    expectedDiagnosis: 'Intrinsic Acute Kidney Injury (ATN with BUN/Cr < 15:1)',
    cmpParams: {
      sodium: 134,
      potassium: 5.6,
      chloride: 102,
      bicarbonate: 18,
      bun: 36,
      creatinine: 3.2,
      glucose: 110,
      calcium: 8.4,
      albumin: 3.6,
    },
    teachingExplanation: 'BUN/Cr ratio = 36 / 3.2 = 11.25 (< 15:1). Tubular epithelial cell necrosis impairs tubular reabsorption of urea; urea clearance mirrors creatinine clearance, flattening the ratio. Fractional excretion of sodium (FeNa) will typically exceed 2%.',
  },
  {
    id: 'alcoholic-hepatitis',
    title: 'Severe Acute Alcoholic Hepatitis',
    panel: 'COAG',
    patientVignette: 'A 49-year-old male with chronic alcohol use disorder presents with 2 weeks of anorexia, rapid onset deep jaundice, tender hepatomegaly, and ascites after a heavy binge.',
    examClues: ['Spider angiomas on chest', 'Palmar erythema', 'Tender right upper quadrant liver margin', 'Scleral icterus'],
    expectedDiagnosis: 'Alcoholic Hepatitis with De Ritis Ratio (AST/ALT) > 2.0 and Coagulopathy',
    coagParams: {
      pt: 19.4,
      inr: 1.85,
      aptt: 34.0,
      fibrinogen: 160,
      dDimer: 420,
      ast: 240,
      alt: 95,
      alp: 130,
      ggt: 280,
      totalBilirubin: 14.2,
      directBilirubin: 9.8,
    },
    teachingExplanation: 'AST = 240, ALT = 95. De Ritis ratio = 240 / 95 = 2.53 (> 2.0). Classic AST/ALT > 2 pattern in alcohol-induced injury is driven by alcohol-induced mitochondrial damage (releasing mitochondrial AST) and pyridoxal-5-phosphate deficiency (reducing hepatic ALT synthesis). Elevated INR (1.85) reflects impaired hepatic factor synthesis (Maddrey Discriminant Function score indicates severe disease requiring corticosteroid therapy).',
  },
  {
    id: 'hemophilia-a',
    title: 'Severe Hemophilia A (Factor VIII Deficiency)',
    panel: 'COAG',
    patientVignette: 'A 6-year-old boy presents with painful swelling and restricted range of motion in his right knee (hemarthrosis) after a minor fall while playing soccer.',
    examClues: ['Right knee effusion and warmth', 'Normal platelet count', 'History of prolonged bleeding after circumcision'],
    expectedDiagnosis: 'Intrinsic Pathway Factor VIII Deficiency (1:1 Mixing Study Corrects)',
    coagParams: {
      pt: 12.2,
      inr: 1.0,
      aptt: 68.0,
      thrombinTime: 16.0,
      fibrinogen: 280,
      dDimer: 210,
      mixingStudyAptt: 29.0, // Corrects
      ast: 22,
      alt: 18,
      alp: 110,
      ggt: 20,
      totalBilirubin: 0.7,
      directBilirubin: 0.2,
    },
    teachingExplanation: 'Isolated prolonged aPTT (68s) with normal PT/INR (1.0). In a 1:1 mixing study, equal parts patient plasma and normal pooled plasma are incubated; the aPTT normalizes to 29 seconds. This correction confirms that normal plasma supplied the missing clotting factor (Factor VIII).',
  },
  {
    id: 'lupus-anticoagulant',
    title: 'Lupus Anticoagulant / Antiphospholipid Syndrome (APS)',
    panel: 'COAG',
    patientVignette: 'A 34-year-old female with a history of two unexplained first-trimester miscarriages presents with painful left calf swelling, diagnosed with deep venous thrombosis (DVT).',
    examClues: ['Unilateral left lower extremity edema', 'Livedo reticularis on bilateral thighs', 'No bleeding diathesis despite prolonged aPTT'],
    expectedDiagnosis: 'Lupus Anticoagulant (Mixing Study FAILS to Correct due to Antiphospholipid Inhibitor)',
    coagParams: {
      pt: 12.5,
      inr: 1.05,
      aptt: 58.0,
      thrombinTime: 15.5,
      fibrinogen: 310,
      dDimer: 880,
      mixingStudyAptt: 54.0, // Fails to correct
      ast: 24,
      alt: 22,
      alp: 88,
      ggt: 22,
      totalBilirubin: 0.8,
      directBilirubin: 0.2,
    },
    teachingExplanation: 'Paradox of Lupus Anticoagulant: While it prolongs phospholipid-dependent in vitro tests like aPTT (58s), in vivo it is a powerful PRO-THROMBOTIC disorder (venous thromboembolism, arterial stroke, fetal loss). When mixed 1:1 with normal plasma, the aPTT remains prolonged (54s) because the patient\'s antiphospholipid autoantibodies inactivate the phospholipids in the test tube.',
  },
];
