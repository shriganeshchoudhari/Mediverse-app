/**
 * AkiKdigoFstEngine.ts
 * Nephrology & Critical Care: Acute Kidney Injury (AKI) KDIGO 2024 Staging,
 * Fractional Excretion of Sodium & Urea (FeNa / FeUrea) with Diuretic Correction,
 * Renal Angina Index (RAI), Furosemide Stress Test (FST), and Cumulative Fluid Overload Kinetics.
 * Location: frontend/.gemini/skills/AkiKdigoFstEngine.ts
 */

export type KdigoStage = 'STAGE_0_NO_AKI' | 'STAGE_1' | 'STAGE_2' | 'STAGE_3';
export type AkiEtiology = 'PRERENAL_AZOTEMIA' | 'INTRINSIC_ATN' | 'POSTRENAL_OBSTRUCTIVE' | 'INDETERMINATE_MIXED';
export type DiureticExposureStatus = 'DIURETIC_NAIVE' | 'PRIOR_LOOP_DIURETIC_USER';
export type RenalAnginaRiskTier = 'GENERAL_ICU' | 'TRANSPLANT_RECIPIENT' | 'VENTILATED_OR_VASOPRESSOR';

export interface KdigoInput {
  baselineCreatinineMgDl: number; // e.g. 0.6 to 2.5
  currentCreatinineMgDl: number; // e.g. 0.8 to 8.0
  hoursOverWhichCreatinineRose: number; // <=48h (for +0.3) or <=168h / 7d (for 1.5x)
  urineOutputMlKgH: number; // e.g. 0.0 to 2.0 mL/kg/h
  oliguriaDurationHours: number; // e.g. 0 to 48 hours
  rrtInitiated: boolean; // dialysis / CRRT started
}

export interface KdigoStageResult {
  creatinineStage: KdigoStage;
  urineOutputStage: KdigoStage;
  overallStage: KdigoStage;
  creatinineFoldIncrease: number;
  absoluteCreatinineDelta: number;
  stageCriteriaMetDescription: string;
  recommendedMonitoring: string;
}

export interface FractionalExcretionInput {
  serumSodiumMeqL: number; // e.g. 130 to 150 mEq/L
  urineSodiumMeqL: number; // e.g. 5 to 100 mEq/L
  serumCreatinineMgDl: number; // e.g. 0.8 to 6.0 mg/dL
  urineCreatinineMgDl: number; // e.g. 20 to 250 mg/dL
  bloodUreaNitrogenMgDl: number; // BUN e.g. 10 to 120 mg/dL
  urineUreaNitrogenMgDl: number; // UUN e.g. 100 to 1500 mg/dL
  urineOsmolalityMosmKg: number; // e.g. 250 to 900 mOsm/kg
  urineSpecificGravity: number; // e.g. 1.005 to 1.035
  recentLoopDiureticUse: boolean; // Furosemide/bumetanide within 24-48h
}

export interface FractionalExcretionResult {
  feNaPercent: number; // (UNa * SCr) / (SNa * UCr) * 100
  feUreaPercent: number; // (UUrea * SCr) / (BUN * UCr) * 100
  bunToCreatinineRatio: number; // BUN / SCr
  isFeNaConfoundedByDiuretics: boolean;
  primaryDiagnosticBiomarker: 'FeNa' | 'FeUrea';
  diagnosticConfidence: 'HIGH' | 'MODERATE' | 'INDETERMINATE';
  etiologyClassification: AkiEtiology;
  differentiationRationale: string;
  urinaryIndexSummary: {
    sodiumHandling: string;
    concentratingAbility: string;
    ureaHandling: string;
  };
}

export interface RenalAnginaInput {
  patientRiskTier: RenalAnginaRiskTier;
  baselineCreatinineMgDl: number;
  currentCreatinineMgDl: number;
  cumulativeFluidOverloadPercent: number; // e.g. 0% to 30%
}

export interface RenalAnginaResult {
  riskScore: number; // 1, 3, or 5
  injuryScore: number; // 1, 2, 4, or 8
  totalScore: number; // risk * injury (1 to 40)
  isRenalAnginaPositive: boolean; // totalScore >= 8
  day3SevereAkiRiskTier: 'LOW' | 'HIGH_PREDICTIVE';
  clinicalAction: string;
}

export interface FurosemideStressTestInput {
  patientWeightKg: number; // e.g. 50 to 120 kg
  diureticExposure: DiureticExposureStatus;
  isPatientEuvolemicResuscitated: boolean; // MUST be true to perform FST
  cumulativeTwoHourUrineMl: number; // e.g. 20 to 800 mL
}

export interface FurosemideStressTestResult {
  recommendedFurosemideDoseMg: number; // 1.0 mg/kg if naive, 1.5 mg/kg if prior user
  doseRationale: string;
  isSafetyInterlockPassed: boolean;
  safetyInterlockWarning: string | null;
  fstResponsiveness: 'RESPONSIVE' | 'NON_RESPONSIVE' | 'INVALID_PRETEST_CONDITIONS';
  twoHourUrineOutputRateMlH: number;
  progressionToStage3OrRrtProbabilityPercent: number; // Responsive <15%, Non-responsive ~85%
  therapeuticFluidReplacementGuidance: string;
  nephrologyEscalationGuidance: string;
}

export interface FluidOverloadInput {
  totalFluidIntakeLiters: number;
  totalFluidOutputLiters: number;
  hospitalAdmissionWeightKg: number;
}

export interface FluidOverloadResult {
  cumulativeNetFluidBalanceLiters: number;
  fluidOverloadPercent: number; // (Net / Weight) * 100
  overloadCategory: 'NORMAL_OR_MILD' | 'MODERATE' | 'SIGNIFICANT' | 'CRITICAL_SEVERE';
  pathophysiologicImpact: string;
}

export interface ComprehensiveAkiEvaluation {
  kdigo: KdigoStageResult;
  differentiation: FractionalExcretionResult;
  renalAngina: RenalAnginaResult;
  fst: FurosemideStressTestResult;
  fluidOverload: FluidOverloadResult;
  unifiedExecutiveSummary: string;
  clinicalPearls: string[];
}

/**
 * Calculates KDIGO AKI Staging based on serum creatinine and urine output.
 */
export function calculateKdigoStage(input: KdigoInput): KdigoStageResult {
  const foldIncrease = Math.round((input.currentCreatinineMgDl / Math.max(0.1, input.baselineCreatinineMgDl)) * 100) / 100;
  const absoluteDelta = Math.round((input.currentCreatinineMgDl - input.baselineCreatinineMgDl) * 100) / 100;

  // Creatinine Staging
  let crStage: KdigoStage = 'STAGE_0_NO_AKI';
  if (input.rrtInitiated || input.currentCreatinineMgDl >= 4.0 || foldIncrease >= 3.0) {
    crStage = 'STAGE_3';
  } else if (foldIncrease >= 2.0) {
    crStage = 'STAGE_2';
  } else if (
    (absoluteDelta >= 0.3 && input.hoursOverWhichCreatinineRose <= 48) ||
    (foldIncrease >= 1.5 && input.hoursOverWhichCreatinineRose <= 168)
  ) {
    crStage = 'STAGE_1';
  }

  // Urine Output Staging
  let uoStage: KdigoStage = 'STAGE_0_NO_AKI';
  if (
    (input.urineOutputMlKgH < 0.3 && input.oliguriaDurationHours >= 24) ||
    (input.urineOutputMlKgH === 0 && input.oliguriaDurationHours >= 12)
  ) {
    uoStage = 'STAGE_3';
  } else if (input.urineOutputMlKgH < 0.5 && input.oliguriaDurationHours >= 12) {
    uoStage = 'STAGE_2';
  } else if (input.urineOutputMlKgH < 0.5 && input.oliguriaDurationHours >= 6) {
    uoStage = 'STAGE_1';
  }

  // Overall stage is maximum of Cr and UO
  const stageWeights: Record<KdigoStage, number> = {
    STAGE_0_NO_AKI: 0,
    STAGE_1: 1,
    STAGE_2: 2,
    STAGE_3: 3,
  };

  const overallStage =
    stageWeights[crStage] >= stageWeights[uoStage] ? crStage : uoStage;

  let criteriaDesc = '';
  if (overallStage === 'STAGE_0_NO_AKI') {
    criteriaDesc = 'No criteria met for Acute Kidney Injury. Creatinine and urine output within normal physiological parameters.';
  } else if (overallStage === 'STAGE_1') {
    criteriaDesc = `KDIGO Stage 1 AKI confirmed: ${
      stageWeights[crStage] >= 1
        ? `Creatinine increase (${foldIncrease}x baseline or +${absoluteDelta} mg/dL)`
        : ''
    } ${stageWeights[uoStage] >= 1 ? `Oliguria <0.5 mL/kg/h for ${input.oliguriaDurationHours}h` : ''}`.trim();
  } else if (overallStage === 'STAGE_2') {
    criteriaDesc = `KDIGO Stage 2 AKI confirmed: ${
      stageWeights[crStage] >= 2 ? `Creatinine fold-increase (${foldIncrease}x baseline)` : ''
    } ${stageWeights[uoStage] >= 2 ? `Oliguria <0.5 mL/kg/h for ${input.oliguriaDurationHours}h (>=12h)` : ''}`.trim();
  } else {
    criteriaDesc = `KDIGO Stage 3 Severe AKI: ${
      input.rrtInitiated
        ? 'Renal replacement therapy initiated.'
        : input.currentCreatinineMgDl >= 4.0
        ? `Serum creatinine >= 4.0 mg/dL (${input.currentCreatinineMgDl} mg/dL).`
        : foldIncrease >= 3.0
        ? `Creatinine >= 3.0x baseline (${foldIncrease}x).`
        : `Severe oliguria <0.3 mL/kg/h for >=24h or anuria >=12h.`
    }`;
  }

  let monitoring = '';
  if (overallStage === 'STAGE_1') {
    monitoring = 'Discontinue nephrotoxic agents (NSAIDs, aminoglycosides, ACEi/ARBs). Ensure volume euvolemia. Monitor serum creatinine daily and hourly urine output.';
  } else if (overallStage === 'STAGE_2') {
    monitoring = 'Intensify critical care monitoring. Adjust all renal-eliminated drug dosing. Screen for renal angina index and evaluate for Furosemide Stress Test (FST). Consult Nephrology.';
  } else if (overallStage === 'STAGE_3') {
    monitoring = 'Urgent Nephrology consultation. Place dialysis catheter access. Evaluate acute indications for RRT (Acidosis, Electrolytes/Hyperkalemia, Ingestion, Overload, Uremia - AEIOU).';
  } else {
    monitoring = 'Routine clinical observation.';
  }

  return {
    creatinineStage: crStage,
    urineOutputStage: uoStage,
    overallStage,
    creatinineFoldIncrease: foldIncrease,
    absoluteCreatinineDelta: absoluteDelta,
    stageCriteriaMetDescription: criteriaDesc,
    recommendedMonitoring: monitoring,
  };
}

/**
 * Calculates Fractional Excretion of Sodium (FeNa) & Urea (FeUrea) and differentiates Prerenal vs ATN.
 */
export function calculateFractionalExcretion(input: FractionalExcretionInput): FractionalExcretionResult {
  // FeNa = (UNa * SCr) / (SNa * UCr) * 100
  const feNa =
    Math.round(
      ((input.urineSodiumMeqL * input.serumCreatinineMgDl) /
        (Math.max(1, input.serumSodiumMeqL) * Math.max(1, input.urineCreatinineMgDl))) *
        100 *
        100
    ) / 100;

  // FeUrea = (UUrea * SCr) / (BUN * UCr) * 100
  const feUrea =
    Math.round(
      ((input.urineUreaNitrogenMgDl * input.serumCreatinineMgDl) /
        (Math.max(1, input.bloodUreaNitrogenMgDl) * Math.max(1, input.urineCreatinineMgDl))) *
        100 *
        10
    ) / 10;

  // BUN / SCr ratio
  const bunCrRatio = Math.round((input.bloodUreaNitrogenMgDl / Math.max(0.1, input.serumCreatinineMgDl)) * 10) / 10;

  const isDiureticConfounded = input.recentLoopDiureticUse;
  const primaryBiomarker = isDiureticConfounded ? 'FeUrea' : 'FeNa';

  let etiology: AkiEtiology = 'INDETERMINATE_MIXED';
  let confidence: 'HIGH' | 'MODERATE' | 'INDETERMINATE' = 'HIGH';
  let rationale = '';

  if (isDiureticConfounded) {
    // Rely on FeUrea because loop diuretics force natriuresis
    if (feUrea < 35.0) {
      etiology = 'PRERENAL_AZOTEMIA';
      confidence = 'HIGH';
      rationale = `FeUrea is ${feUrea}% (<35%), confirming Prerenal Azotemia despite recent loop diuretic exposure. Loop diuretics inhibit NKCC2 in the thick ascending limb, causing high urine sodium and misleadingly elevated FeNa (${feNa}%), but proximal tubular urea reabsorption remains intact.`;
    } else if (feUrea > 50.0) {
      etiology = 'INTRINSIC_ATN';
      confidence = 'HIGH';
      rationale = `FeUrea is ${feUrea}% (>50%), confirming Intrinsic Acute Tubular Necrosis (ATN). Impaired tubular reabsorption results in failure to reclaim filtered urea despite hypoperfusion.`;
    } else {
      etiology = 'INDETERMINATE_MIXED';
      confidence = 'INDETERMINATE';
      rationale = `FeUrea is ${feUrea}% (35-50% intermediate gray zone). Findings suggest a mixed or evolving injury (e.g. prerenal transitioning to ischemic ATN).`;
    }
  } else {
    // Rely primarily on FeNa in diuretic-naive patients
    if (feNa < 1.0) {
      etiology = 'PRERENAL_AZOTEMIA';
      confidence = 'HIGH';
      rationale = `FeNa is ${feNa}% (<1.0%) with avid sodium retention (Urine Na ${input.urineSodiumMeqL} mEq/L) and high BUN:Cr ratio (${bunCrRatio}:1), confirming Prerenal Azotemia with intact tubular function.`;
    } else if (feNa > 2.0) {
      etiology = 'INTRINSIC_ATN';
      confidence = 'HIGH';
      rationale = `FeNa is ${feNa}% (>2.0%) with sodium wasting (Urine Na ${input.urineSodiumMeqL} mEq/L) and isosthenuria (${input.urineOsmolalityMosmKg} mOsm/kg), confirming Intrinsic Acute Tubular Necrosis (ATN).`;
    } else {
      etiology = 'INDETERMINATE_MIXED';
      confidence = 'MODERATE';
      rationale = `FeNa is ${feNa}% (1.0 - 2.0% border zone). Consider contrast nephropathy, acute interstitial nephritis (AIN), or prerenal azotemia superimposed on chronic kidney disease.`;
    }
  }

  return {
    feNaPercent: feNa,
    feUreaPercent: feUrea,
    bunToCreatinineRatio: bunCrRatio,
    isFeNaConfoundedByDiuretics: isDiureticConfounded,
    primaryDiagnosticBiomarker: primaryBiomarker,
    diagnosticConfidence: confidence,
    etiologyClassification: etiology,
    differentiationRationale: rationale,
    urinaryIndexSummary: {
      sodiumHandling: input.urineSodiumMeqL < 20 ? 'Avid Sodium Retention (<20 mEq/L)' : 'Tubular Sodium Wasting (>40 mEq/L)',
      concentratingAbility: input.urineOsmolalityMosmKg > 500 ? 'Hyperconcentrated Urine (>500 mOsm/kg)' : 'Isosthenuria (250-350 mOsm/kg)',
      ureaHandling: feUrea < 35 ? 'Avid Urea Retention (<35%)' : 'Impaired Urea Reabsorption (>50%)',
    },
  };
}

/**
 * Evaluates the Renal Angina Index (RAI) to predict Day-3 severe AKI.
 */
export function calculateRenalAnginaIndex(input: RenalAnginaInput): RenalAnginaResult {
  // Risk Score: Baseline ICU = 1, Transplant = 3, Ventilator/Vasopressor = 5
  let riskScore = 1;
  if (input.patientRiskTier === 'VENTILATED_OR_VASOPRESSOR') {
    riskScore = 5;
  } else if (input.patientRiskTier === 'TRANSPLANT_RECIPIENT') {
    riskScore = 3;
  } else {
    riskScore = 1;
  }

  // Injury Score: based on Cr fold increase or fluid overload %
  const crFold = input.currentCreatinineMgDl / Math.max(0.1, input.baselineCreatinineMgDl);
  const fo = input.cumulativeFluidOverloadPercent;

  let injuryScore = 1;
  if (crFold >= 3.0 || fo >= 15.0) {
    injuryScore = 8;
  } else if (crFold >= 2.0 || fo >= 10.0) {
    injuryScore = 4;
  } else if (crFold >= 1.5 || fo >= 5.0) {
    injuryScore = 2;
  } else {
    injuryScore = 1;
  }

  const totalScore = riskScore * injuryScore;
  const isPositive = totalScore >= 8;

  let clinicalAction = '';
  if (isPositive) {
    clinicalAction = `Renal Angina POSITIVE (Score ${totalScore} >= 8): High risk of persistent KDIGO Stage 3 AKI or dialysis within 72 hours. Order novel AKI biomarkers (NGAL / [TIMP-2]*[IGFBP7]), avoid all nephrotoxins, optimize perfusion pressure, and prepare for Furosemide Stress Test if euvolemic.`;
  } else {
    clinicalAction = `Renal Angina NEGATIVE (Score ${totalScore} < 8): Low likelihood of developing severe Day-3 AKI. Standard supportive care and routine surveillance.`;
  }

  return {
    riskScore,
    injuryScore,
    totalScore,
    isRenalAnginaPositive: isPositive,
    day3SevereAkiRiskTier: isPositive ? 'HIGH_PREDICTIVE' : 'LOW',
    clinicalAction,
  };
}

/**
 * Conducts the Furosemide Stress Test (FST) protocol and evaluates tubular reserve.
 */
export function evaluateFurosemideStressTest(input: FurosemideStressTestInput): FurosemideStressTestResult {
  const isNaive = input.diureticExposure === 'DIURETIC_NAIVE';
  const dosePerKg = isNaive ? 1.0 : 1.5;
  const totalDoseMg = Math.round(input.patientWeightKg * dosePerKg);

  if (!input.isPatientEuvolemicResuscitated) {
    return {
      recommendedFurosemideDoseMg: totalDoseMg,
      doseRationale: `${dosePerKg} mg/kg IV bolus (${totalDoseMg} mg) based on ${isNaive ? 'diuretic-naive' : 'prior loop diuretic user'} status.`,
      isSafetyInterlockPassed: false,
      safetyInterlockWarning: 'SAFETY CONTRAINDICATION: Patient is NOT confirmed to be euvolemic or fluid resuscitated. Administering FST in hypovolemia induces severe circulatory collapse and accelerates ischemic ATN.',
      fstResponsiveness: 'INVALID_PRETEST_CONDITIONS',
      twoHourUrineOutputRateMlH: 0,
      progressionToStage3OrRrtProbabilityPercent: 0,
      therapeuticFluidReplacementGuidance: 'Hold FST until volume resuscitation is complete and euvolemia confirmed.',
      nephrologyEscalationGuidance: 'Resuscitate with balanced crystalloids first.',
    };
  }

  const rateMlH = Math.round(input.cumulativeTwoHourUrineMl / 2);
  const isResponsive = input.cumulativeTwoHourUrineMl >= 200;

  return {
    recommendedFurosemideDoseMg: totalDoseMg,
    doseRationale: `${dosePerKg} mg/kg IV push (${totalDoseMg} mg) for patient weight of ${input.patientWeightKg} kg (${isNaive ? 'loop diuretic-naive' : 'prior loop diuretic user'}).`,
    isSafetyInterlockPassed: true,
    safetyInterlockWarning: null,
    fstResponsiveness: isResponsive ? 'RESPONSIVE' : 'NON_RESPONSIVE',
    twoHourUrineOutputRateMlH: rateMlH,
    progressionToStage3OrRrtProbabilityPercent: isResponsive ? 13.5 : 86.8,
    therapeuticFluidReplacementGuidance: isResponsive
      ? 'FST RESPONSIVE: Replace urine output mL-for-mL with balanced crystalloid (Lactated Ringer\'s / Plasmalyte) for the first 6 hours to prevent iatrogenic volume contraction.'
      : 'FST NON-RESPONSIVE: Strictly avoid excessive fluid loading. Tubules cannot clear fluid; volume loading will only worsen pulmonary edema and tissue congestion.',
    nephrologyEscalationGuidance: isResponsive
      ? 'Low risk of AKI progression or RRT requirement (<15%). Continue renal protection and monitor output.'
      : 'Extremely high risk of progression to Stage 3 AKI or dialysis (~87%). Consult Nephrology immediately, obtain urgent vascular access, and prepare for continuous renal replacement therapy (CRRT).',
  };
}

/**
 * Calculates cumulative fluid overload percentage.
 */
export function calculateFluidOverload(input: FluidOverloadInput): FluidOverloadResult {
  const netLiters = Math.round((input.totalFluidIntakeLiters - input.totalFluidOutputLiters) * 10) / 10;
  const foPercent = Math.round((netLiters / Math.max(1, input.hospitalAdmissionWeightKg)) * 100 * 10) / 10;

  let category: 'NORMAL_OR_MILD' | 'MODERATE' | 'SIGNIFICANT' | 'CRITICAL_SEVERE' = 'NORMAL_OR_MILD';
  let impact = '';

  if (foPercent >= 15.0) {
    category = 'CRITICAL_SEVERE';
    impact = `Severe pathological fluid overload (${foPercent}% >= 15%). Independently associated with a 2- to 3-fold increase in ICU mortality, prolonged mechanical ventilation, impaired renal venous return (congestive nephropathy), and intra-abdominal hypertension. Ultrafiltration/CRRT indicated.`;
  } else if (foPercent >= 10.0) {
    category = 'SIGNIFICANT';
    impact = `Significant fluid overload (${foPercent}% >= 10%). Landmark trials identify 10% as the critical tipping point where fluid accumulation transitions from protective resuscitation to lethal end-organ congestion. Diuretic challenge or ultrafiltration required.`;
  } else if (foPercent >= 5.0) {
    category = 'MODERATE';
    impact = `Moderate positive fluid balance (${foPercent}%). Monitor closely; transition from resuscitation to de-escalation/evacuation phase (ROSE conceptual framework).`;
  } else {
    category = 'NORMAL_OR_MILD';
    impact = `Euvolemic or mild positive fluid balance (${foPercent}% < 5%). Optimal hemodynamic state without end-organ congestion.`;
  }

  return {
    cumulativeNetFluidBalanceLiters: netLiters,
    fluidOverloadPercent: foPercent,
    overloadCategory: category,
    pathophysiologicImpact: impact,
  };
}

/**
 * Conducts unified comprehensive evaluation across all AKI domains.
 */
export function performComprehensiveAkiEvaluation(params: {
  kdigoInput: KdigoInput;
  fractionalExcretionInput: FractionalExcretionInput;
  renalAnginaInput: RenalAnginaInput;
  fstInput: FurosemideStressTestInput;
  fluidOverloadInput: FluidOverloadInput;
}): ComprehensiveAkiEvaluation {
  const kdigo = calculateKdigoStage(params.kdigoInput);
  const differentiation = calculateFractionalExcretion(params.fractionalExcretionInput);
  const renalAngina = calculateRenalAnginaIndex(params.renalAnginaInput);
  const fst = evaluateFurosemideStressTest(params.fstInput);
  const fluidOverload = calculateFluidOverload(params.fluidOverloadInput);

  let summary = '';
  if (kdigo.overallStage === 'STAGE_3' || fst.fstResponsiveness === 'NON_RESPONSIVE') {
    summary = `CRITICAL AKI / IMMINENT RRT INDICATION: Patient has KDIGO ${kdigo.overallStage.replace('_', ' ')} with ${
      fst.fstResponsiveness === 'NON_RESPONSIVE' ? 'Furosemide Stress Test non-responsiveness (<200 mL/2h, ~87% RRT risk)' : 'severe stage 3 renal failure'
    }. Etiology consistent with ${differentiation.etiologyClassification.replace('_', ' ')}. Immediate nephrology consultation and dialysis preparation required.`;
  } else if (differentiation.etiologyClassification === 'PRERENAL_AZOTEMIA') {
    summary = `HEMODYNAMIC PRERENAL AZOTEMIA: Reversible renal hypoperfusion confirmed by ${
      differentiation.isFeNaConfoundedByDiuretics ? `FeUrea ${differentiation.feUreaPercent}% (<35%)` : `FeNa ${differentiation.feNaPercent}% (<1%)`
    }. Tubular architecture remains structurally intact. Resuscitate with balanced crystalloid to restore renal perfusion pressure.`;
  } else {
    summary = `EVOLVING ACUTE KIDNEY INJURY: Patient exhibits KDIGO ${kdigo.overallStage.replace('_', ' ')} with ${differentiation.etiologyClassification.replace('_', ' ')} (${
      differentiation.primaryDiagnosticBiomarker
    } ${differentiation.primaryDiagnosticBiomarker === 'FeNa' ? differentiation.feNaPercent : differentiation.feUreaPercent}%). Renal Angina Index is ${
      renalAngina.totalScore
    } (${renalAngina.isRenalAnginaPositive ? 'POSITIVE' : 'NEGATIVE'}).`;
  }

  const clinicalPearls = [
    'The FeUrea Loop Diuretic Rule: When a patient has received furosemide, FeNa is invalidated (>1-2%) due to pharmacological blockade of NKCC2 in the thick ascending limb. FeUrea (<35%) is the gold standard to identify prerenal physiology because urea reabsorption occurs in the proximal tubule independent of loop diuretics.',
    'Chawla FST Diagnostic Cutoff: The Furosemide Stress Test (1.0 mg/kg in naive, 1.5 mg/kg in prior users) uses a 200 mL cutoff in the first 2 hours. Excreting <200 mL has an 87% sensitivity and 84% specificity for predicting progression to Stage 3 AKI and dialysis.',
    'FST Strict Pre-requisite: FST is a test of tubular transport capacity, NOT a treatment for volume overload. It is strictly contraindicated in unresuscitated hypovolemia where loop diuretics precipitate circulatory collapse and worsen ischemic ATN.',
    'Fluid Overload 10% Tipping Point: Accumulating net positive fluid balance >10% of admission weight is an independent driver of mortality and congestive nephropathy (elevated renal vein pressure diminishes net glomerular filtration pressure).',
    'Renal Angina Index Utility: An RAI >= 8 identifies patients with "subclinical renal ischemia" prior to overt creatinine surge, triggering early nephrotoxic drug stewardship and novel biomarker evaluation.'
  ];

  return {
    kdigo,
    differentiation,
    renalAngina,
    fst,
    fluidOverload,
    unifiedExecutiveSummary: summary,
    clinicalPearls,
  };
}

export interface AkiPreset {
  id: string;
  name: string;
  badge: string;
  description: string;
  inputs: {
    kdigo: KdigoInput;
    fractionalExcretion: FractionalExcretionInput;
    renalAngina: RenalAnginaInput;
    fst: FurosemideStressTestInput;
    fluidOverload: FluidOverloadInput;
  };
}

export const AKI_PRESETS: AkiPreset[] = [
  {
    id: 'PRERENAL_DEHYDRATION',
    name: 'Prerenal Azotemia with Dehydration (Intact Tubules)',
    badge: 'FeNa < 1% • Responsive',
    description: '62 yo male with severe gastroenteritis, volume depletion, baseline Cr 0.9 -> current 1.9 mg/dL (KDIGO 2). Diuretic naive, FeNa 0.35%, BUN:Cr 32:1, highly responsive to crystalloid.',
    inputs: {
      kdigo: { baselineCreatinineMgDl: 0.9, currentCreatinineMgDl: 1.9, hoursOverWhichCreatinineRose: 48, urineOutputMlKgH: 0.4, oliguriaDurationHours: 8, rrtInitiated: false },
      fractionalExcretion: { serumSodiumMeqL: 138, urineSodiumMeqL: 12, serumCreatinineMgDl: 1.9, urineCreatinineMgDl: 140, bloodUreaNitrogenMgDl: 62, urineUreaNitrogenMgDl: 650, urineOsmolalityMosmKg: 680, urineSpecificGravity: 1.026, recentLoopDiureticUse: false },
      renalAngina: { patientRiskTier: 'GENERAL_ICU', baselineCreatinineMgDl: 0.9, currentCreatinineMgDl: 1.9, cumulativeFluidOverloadPercent: 1.2 },
      fst: { patientWeightKg: 75, diureticExposure: 'DIURETIC_NAIVE', isPatientEuvolemicResuscitated: true, cumulativeTwoHourUrineMl: 450 },
      fluidOverload: { totalFluidIntakeLiters: 2.5, totalFluidOutputLiters: 1.8, hospitalAdmissionWeightKg: 75 }
    }
  },
  {
    id: 'DIURETIC_CONFOUNDED_PRERENAL',
    name: 'Diuretic-Confounded Prerenal Azotemia (FeUrea <35% Solves FeNa Pitfall)',
    badge: 'FeNa 2.4% (False) • FeUrea 28%',
    description: '74 yo female with acute decompensated heart failure on chronic furosemide. FeNa is falsely elevated at 2.4% due to loop natriuresis, but FeUrea is 28%, proving underlying prerenal cardiorenal hypoperfusion.',
    inputs: {
      kdigo: { baselineCreatinineMgDl: 1.1, currentCreatinineMgDl: 2.1, hoursOverWhichCreatinineRose: 72, urineOutputMlKgH: 0.45, oliguriaDurationHours: 10, rrtInitiated: false },
      fractionalExcretion: { serumSodiumMeqL: 136, urineSodiumMeqL: 52, serumCreatinineMgDl: 2.1, urineCreatinineMgDl: 68, bloodUreaNitrogenMgDl: 48, urineUreaNitrogenMgDl: 420, urineOsmolalityMosmKg: 420, urineSpecificGravity: 1.018, recentLoopDiureticUse: true },
      renalAngina: { patientRiskTier: 'GENERAL_ICU', baselineCreatinineMgDl: 1.1, currentCreatinineMgDl: 2.1, cumulativeFluidOverloadPercent: 4.5 },
      fst: { patientWeightKg: 68, diureticExposure: 'PRIOR_LOOP_DIURETIC_USER', isPatientEuvolemicResuscitated: true, cumulativeTwoHourUrineMl: 320 },
      fluidOverload: { totalFluidIntakeLiters: 4.0, totalFluidOutputLiters: 3.2, hospitalAdmissionWeightKg: 68 }
    }
  },
  {
    id: 'SEPTIC_SHOCK_ISCHEMIC_ATN',
    name: 'Septic Shock Ischemic ATN & FST Non-Responsive',
    badge: 'KDIGO 3 • FST <200 mL • Dialysis Imminent',
    description: '58 yo male in septic shock requiring noradrenaline. Cr surges from 1.0 to 3.4 mg/dL with severe oliguria. FeNa 3.8%, FeUrea 62%, FST produces only 45 mL in 2h. High probability of RRT requirement.',
    inputs: {
      kdigo: { baselineCreatinineMgDl: 1.0, currentCreatinineMgDl: 3.4, hoursOverWhichCreatinineRose: 36, urineOutputMlKgH: 0.15, oliguriaDurationHours: 18, rrtInitiated: false },
      fractionalExcretion: { serumSodiumMeqL: 142, urineSodiumMeqL: 68, serumCreatinineMgDl: 3.4, urineCreatinineMgDl: 42, bloodUreaNitrogenMgDl: 75, urineUreaNitrogenMgDl: 380, urineOsmolalityMosmKg: 310, urineSpecificGravity: 1.010, recentLoopDiureticUse: false },
      renalAngina: { patientRiskTier: 'VENTILATED_OR_VASOPRESSOR', baselineCreatinineMgDl: 1.0, currentCreatinineMgDl: 3.4, cumulativeFluidOverloadPercent: 12.8 },
      fst: { patientWeightKg: 82, diureticExposure: 'DIURETIC_NAIVE', isPatientEuvolemicResuscitated: true, cumulativeTwoHourUrineMl: 45 },
      fluidOverload: { totalFluidIntakeLiters: 16.5, totalFluidOutputLiters: 6.0, hospitalAdmissionWeightKg: 82 }
    }
  },
  {
    id: 'CRITICAL_FLUID_OVERLOAD_POST_OP',
    name: 'Severe Cumulative Fluid Overload (>15%) Post-Cardiothoracic Surgery',
    badge: 'FO 16.2% • Congestive Nephropathy',
    description: '67 yo male post-CABG with +13.0L cumulative balance (16.2% overload). Elevated renal venous pressure causes congestive AKI. Fluid overload drives pulmonary edema and prolonged mechanical ventilation.',
    inputs: {
      kdigo: { baselineCreatinineMgDl: 1.2, currentCreatinineMgDl: 2.8, hoursOverWhichCreatinineRose: 48, urineOutputMlKgH: 0.35, oliguriaDurationHours: 14, rrtInitiated: false },
      fractionalExcretion: { serumSodiumMeqL: 134, urineSodiumMeqL: 38, serumCreatinineMgDl: 2.8, urineCreatinineMgDl: 55, bloodUreaNitrogenMgDl: 58, urineUreaNitrogenMgDl: 410, urineOsmolalityMosmKg: 340, urineSpecificGravity: 1.012, recentLoopDiureticUse: true },
      renalAngina: { patientRiskTier: 'VENTILATED_OR_VASOPRESSOR', baselineCreatinineMgDl: 1.2, currentCreatinineMgDl: 2.8, cumulativeFluidOverloadPercent: 16.2 },
      fst: { patientWeightKg: 80, diureticExposure: 'PRIOR_LOOP_DIURETIC_USER', isPatientEuvolemicResuscitated: true, cumulativeTwoHourUrineMl: 110 },
      fluidOverload: { totalFluidIntakeLiters: 21.0, totalFluidOutputLiters: 8.0, hospitalAdmissionWeightKg: 80 }
    }
  }
];
