/**
 * AorticStenosisEngine.ts
 *
 * Biophysical modeling and multi-modality diagnostic evaluation of Aortic Stenosis (AS).
 * Implements:
 * 1. Doppler Echocardiography Continuity Equation (AVA, AVAi, DVI)
 * 2. Invasive Cardiac Catheterization Gorlin & Hakki Equations
 * 3. Energy Loss Index (ELI) with Aortic Root Pressure Recovery Correction
 * 4. Valvuloarterial Impedance (Zva) Global LV Afterload Analysis
 * 5. 2020 ACC/AHA & 2021 ESC Valvular Heart Disease Guidelines Staging (Stage A–D3)
 * 6. Heart Team Intervention Decision Matrix (TAVI/TAVR vs SAVR vs Surveillance)
 *
 * Location: frontend/.gemini/skills/AorticStenosisEngine.ts
 */

export interface EchoParameters {
  lvotDiameterCm: number; // e.g. 2.0 cm (typical 1.8 - 2.4 cm)
  lvotVtiCm: number; // LVOT Velocity Time Integral (typical 15 - 25 cm)
  avVtiCm: number; // Aortic Valve VTI (typical 30 - 120 cm)
  lvotPeakVelocityMs: number; // Vmax LVOT (typical 0.8 - 1.2 m/s)
  avPeakVelocityMs: number; // Vmax Aortic Valve (typical 1.0 - 5.5 m/s)
  meanGradientMmHg: number; // Doppler mean transvalvular gradient
  aorticRootDiameterCm: number; // Ascending aorta / sinotubular junction for pressure recovery
}

export interface InvasiveCathParameters {
  cardiacOutputLMin: number; // Cardiac Output in L/min
  heartRateBpm: number;
  systolicEjectionPeriodSec: number; // SEP in sec/beat (typical 0.24 - 0.36)
  invasiveMeanGradientMmHg: number; // Peak-to-peak or planimetered mean gradient
}

export interface ClinicalPatientProfile {
  age: number;
  bsaM2: number;
  lvefPct: number; // Left Ventricular Ejection Fraction (%)
  strokeVolumeIndexMlM2: number; // SVI (normal > 35 mL/m²)
  systolicBpMmHg: number; // Arterial SBP for Zva calculation
  hasSymptoms: boolean; // Angina, syncope, presyncope, dyspnea / HF
  stsPromScorePct: number; // Society of Thoracic Surgeons predicted mortality %
  isBicuspid: boolean;
  transfemoralAccessFeasible: boolean;
  severeAortaCalcificationPorcelain: boolean;
  dobutamineResponse?: 'TRUE_SEVERE' | 'PSEUDO_SEVERE' | 'NO_CONTRACTILE_RESERVE';
}

export type AsSeverityGrade =
  | 'NORMAL'
  | 'AORTIC_SCLEROSIS'
  | 'MILD'
  | 'MODERATE'
  | 'SEVERE'
  | 'VERY_SEVERE';

export type AsGuidelineStage =
  | 'STAGE_A' // At Risk (bicuspid, sclerosis)
  | 'STAGE_B' // Progressive AS (mild-to-moderate)
  | 'STAGE_C1' // Asymptomatic Severe (LVEF >= 50%)
  | 'STAGE_C2' // Asymptomatic Severe with LV dysfunction (LVEF < 50%)
  | 'STAGE_D1' // Symptomatic Severe High-Gradient
  | 'STAGE_D2' // Symptomatic Low-Flow, Low-Gradient with Reduced EF
  | 'STAGE_D3'; // Symptomatic Paradoxical Low-Flow, Low-Gradient with Preserved EF

export type InterventionStrategy =
  | 'SURVEILLANCE'
  | 'SAVR_PREFERRED'
  | 'TAVI_PREFERRED'
  | 'EQUIPOISE_HEART_TEAM'
  | 'DOBUTAMINE_STRESS_ECHO_INDICATED'
  | 'BALLOON_AORTIC_VALVULOPLASTY_PALLIATIVE';

export interface AorticStenosisEvaluation {
  // Doppler metrics
  lvotAreaCm2: number;
  continuityAvaCm2: number;
  indexedAvaCm2M2: number;
  dimensionlessVelocityIndex: number; // DVI = LVOT VTI / AV VTI or LVOT Vmax / AV Vmax
  peakGradientMmHg: number; // 4 * Vmax^2 (modified Bernoulli)

  // Invasive Cath metrics
  gorlinAvaCm2: number;
  hakkiAvaCm2: number;

  // Advanced Hemodynamics
  energyLossIndexCm2M2: number;
  pressureRecoveryMmHg: number;
  valvuloarterialImpedanceMmHgMlM2: number; // Zva

  // Clinical Classification & Recommendations
  severityGrade: AsSeverityGrade;
  guidelineStage: AsGuidelineStage;
  stageTitle: string;
  stageRationale: string;
  interventionStrategy: InterventionStrategy;
  recommendationSummary: string;
  operativeRiskCategory: 'LOW' | 'INTERMEDIATE' | 'HIGH_OR_PROHIBITIVE';
}

/**
 * Master Aortic Stenosis Hemodynamic & Staging Evaluator
 */
export function evaluateAorticStenosis(
  echo: EchoParameters,
  cath: InvasiveCathParameters,
  profile: ClinicalPatientProfile
): AorticStenosisEvaluation {
  // 1. Doppler Continuity Equation
  // LVOT Area = pi * (D / 2)^2
  const lvotRadius = Math.max(0.5, echo.lvotDiameterCm / 2);
  const lvotAreaCm2 = Math.round(Math.PI * Math.pow(lvotRadius, 2) * 100) / 100;

  // Continuity AVA = (LVOT Area * LVOT VTI) / AV VTI
  const safeAvVti = Math.max(1, echo.avVtiCm);
  const rawContinuityAva = (lvotAreaCm2 * Math.max(1, echo.lvotVtiCm)) / safeAvVti;
  const continuityAvaCm2 = Math.round(rawContinuityAva * 100) / 100;

  // Indexed AVA
  const safeBsa = Math.max(0.8, profile.bsaM2);
  const indexedAvaCm2M2 = Math.round((continuityAvaCm2 / safeBsa) * 100) / 100;

  // Dimensionless Velocity Index (DVI)
  const safeAvPeak = Math.max(0.5, echo.avPeakVelocityMs);
  const dimensionlessVelocityIndex =
    Math.round((echo.lvotPeakVelocityMs / safeAvPeak) * 100) / 100;

  // Peak Gradient (Modified Bernoulli: 4 * Vmax^2)
  const peakGradientMmHg = Math.round(4 * Math.pow(echo.avPeakVelocityMs, 2) * 10) / 10;

  // 2. Invasive Catheterization Equations
  // Gorlin Equation:
  // AVA = (CO * 1000 / (HR * SEP)) / (44.3 * C * sqrt(meanGradient))
  // C = 1.0 for aortic valve
  const safeMeanGrad = Math.max(1, cath.invasiveMeanGradientMmHg);
  const safeHr = Math.max(30, cath.heartRateBpm);
  const safeSep = Math.max(0.15, cath.systolicEjectionPeriodSec);
  const flowRateMlPerSec = (cath.cardiacOutputLMin * 1000) / (safeHr * safeSep);
  const gorlinConstant = 44.3 * 1.0;
  const gorlinAvaCm2 =
    Math.round((flowRateMlPerSec / (gorlinConstant * Math.sqrt(safeMeanGrad))) * 100) / 100;

  // Hakki Equation (Rapid bedside approximation: CO / sqrt(meanGradient))
  const hakkiAvaCm2 =
    Math.round((cath.cardiacOutputLMin / Math.sqrt(safeMeanGrad)) * 100) / 100;

  // 3. Pressure Recovery & Energy Loss Index (ELI)
  // Aorta cross-sectional area: A_aorta = pi * (D_aorta / 2)^2
  const aortaRadius = Math.max(1.0, echo.aorticRootDiameterCm / 2);
  const aortaAreaCm2 = Math.PI * Math.pow(aortaRadius, 2);

  // Pressure Recovery = 4 * Vmax^2 * 2 * (AVA / A_aorta) * (1 - AVA / A_aorta)
  const areaRatio = Math.min(0.9, continuityAvaCm2 / aortaAreaCm2);
  const pressureRecoveryMmHg =
    Math.round(peakGradientMmHg * 2 * areaRatio * (1 - areaRatio) * 10) / 10;

  // Energy Loss Coefficient: ELCo = (AVA * A_aorta) / (A_aorta - AVA)
  // ELI = ELCo / BSA
  const elco =
    aortaAreaCm2 > continuityAvaCm2
      ? (continuityAvaCm2 * aortaAreaCm2) / (aortaAreaCm2 - continuityAvaCm2)
      : continuityAvaCm2;
  const energyLossIndexCm2M2 = Math.round((elco / safeBsa) * 100) / 100;

  // 4. Valvuloarterial Impedance (Zva): (SBP + MeanGradient) / SVI
  const safeSvi = Math.max(10, profile.strokeVolumeIndexMlM2);
  const valvuloarterialImpedanceMmHgMlM2 =
    Math.round(((profile.systolicBpMmHg + echo.meanGradientMmHg) / safeSvi) * 10) / 10;

  // 5. Determine Severity Grade
  let severityGrade: AsSeverityGrade = 'NORMAL';
  if (echo.avPeakVelocityMs >= 5.0 || echo.meanGradientMmHg >= 60) {
    severityGrade = 'VERY_SEVERE';
  } else if (
    continuityAvaCm2 <= 1.0 ||
    indexedAvaCm2M2 <= 0.6 ||
    echo.avPeakVelocityMs >= 4.0 ||
    echo.meanGradientMmHg >= 40
  ) {
    severityGrade = 'SEVERE';
  } else if (
    continuityAvaCm2 <= 1.5 &&
    (echo.avPeakVelocityMs >= 3.0 || echo.meanGradientMmHg >= 20)
  ) {
    severityGrade = 'MODERATE';
  } else if (echo.avPeakVelocityMs >= 2.0 || echo.meanGradientMmHg >= 10) {
    severityGrade = 'MILD';
  } else if (echo.avPeakVelocityMs > 1.5) {
    severityGrade = 'AORTIC_SCLEROSIS';
  }

  // 6. Determine AHA/ACC Guideline Stage (Stage A to D3)
  let guidelineStage: AsGuidelineStage = 'STAGE_A';
  let stageTitle = '';
  let stageRationale = '';

  const isSevereByAva = continuityAvaCm2 <= 1.0 || indexedAvaCm2M2 <= 0.6;
  const isHighGradient = echo.avPeakVelocityMs >= 4.0 || echo.meanGradientMmHg >= 40;
  const isLowFlow = profile.strokeVolumeIndexMlM2 < 35;

  if (severityGrade === 'NORMAL' || severityGrade === 'AORTIC_SCLEROSIS') {
    guidelineStage = 'STAGE_A';
    stageTitle = 'Stage A: At Risk of Aortic Stenosis';
    stageRationale =
      'Bicuspid aortic valve anatomy, aortic valve sclerosis, or normal hemodynamics without flow obstruction.';
  } else if (severityGrade === 'MILD' || severityGrade === 'MODERATE') {
    guidelineStage = 'STAGE_B';
    stageTitle = 'Stage B: Progressive Aortic Stenosis';
    stageRationale = `Moderate AS (AVA ${continuityAvaCm2} cm², Vmax ${echo.avPeakVelocityMs} m/s, Mean Grad ${echo.meanGradientMmHg} mmHg). Subclinical progressive calcification without severe hemodynamic impedance.`;
  } else if (isSevereByAva) {
    if (!profile.hasSymptoms) {
      if (profile.lvefPct >= 50) {
        guidelineStage = 'STAGE_C1';
        stageTitle = 'Stage C1: Asymptomatic Severe AS (Preserved LV Function)';
        stageRationale = `Severe AS (AVA ${continuityAvaCm2} cm², Vmax ${echo.avPeakVelocityMs} m/s) without active clinical symptoms and normal LVEF (${profile.lvefPct}%).`;
      } else {
        guidelineStage = 'STAGE_C2';
        stageTitle = 'Stage C2: Asymptomatic Severe AS with LV Dysfunction';
        stageRationale = `Severe AS with silent decompensation: depressed LVEF (${profile.lvefPct}% < 50%) in the absence of reported symptoms. Class I indication for valve replacement.`;
      }
    } else {
      // Symptomatic
      if (isHighGradient) {
        guidelineStage = 'STAGE_D1';
        stageTitle = 'Stage D1: Symptomatic Severe High-Gradient AS';
        stageRationale = `Classic severe AS triad presentation with high transvalvular gradient (Mean Grad ${echo.meanGradientMmHg} >= 40 mmHg, Vmax ${echo.avPeakVelocityMs} >= 4.0 m/s). Urgent valve replacement indicated.`;
      } else if (isLowFlow && profile.lvefPct < 50) {
        guidelineStage = 'STAGE_D2';
        stageTitle = 'Stage D2: Symptomatic Classical Low-Flow, Low-Gradient AS (Reduced LVEF)';
        stageRationale = `Low-flow low-gradient AS with systolic failure (SVI ${profile.strokeVolumeIndexMlM2} < 35 mL/m², LVEF ${profile.lvefPct}% < 50%, Mean Grad ${echo.meanGradientMmHg} < 40 mmHg). Requires Low-Dose Dobutamine Stress Echocardiography to evaluate contractile reserve.`;
      } else if (isLowFlow && profile.lvefPct >= 50) {
        guidelineStage = 'STAGE_D3';
        stageTitle = 'Stage D3: Symptomatic Paradoxical Low-Flow, Low-Gradient AS (Preserved LVEF)';
        stageRationale = `Paradoxical low flow (SVI ${profile.strokeVolumeIndexMlM2} < 35 mL/m²) despite preserved LVEF (${profile.lvefPct}%), typical of severe concentric remodeling with small LV cavity in elderly hypertensive females. Multislice CT aortic calcium scoring recommended.`;
      } else {
        guidelineStage = 'STAGE_D1';
        stageTitle = 'Stage D1: Symptomatic Severe AS';
        stageRationale =
          'Symptomatic severe aortic stenosis warranting definitive valve replacement.';
      }
    }
  }

  // 7. STS-PROM Operative Risk Stratification
  let operativeRiskCategory: 'LOW' | 'INTERMEDIATE' | 'HIGH_OR_PROHIBITIVE' = 'LOW';
  if (profile.stsPromScorePct >= 8.0 || profile.severeAortaCalcificationPorcelain) {
    operativeRiskCategory = 'HIGH_OR_PROHIBITIVE';
  } else if (profile.stsPromScorePct >= 4.0) {
    operativeRiskCategory = 'INTERMEDIATE';
  }

  // 8. Heart Team Intervention Decision Algorithm (ACC/AHA 2020 & ESC 2021)
  let interventionStrategy: InterventionStrategy = 'SURVEILLANCE';
  let recommendationSummary = '';

  if (guidelineStage === 'STAGE_A' || guidelineStage === 'STAGE_B') {
    interventionStrategy = 'SURVEILLANCE';
    recommendationSummary =
      'Routine echocardiographic surveillance every 1-2 years for Moderate AS (3-5 years for Mild AS). Educate patient on warning symptoms (angina, syncope, exertional breathlessness). Statin therapy does not retard hemodynamic AS progression.';
  } else if (guidelineStage === 'STAGE_C1') {
    // Check if very severe (Vmax >= 5.0 m/s) or rapid progression (>0.3 m/s/yr) or abnormal exercise test
    if (echo.avPeakVelocityMs >= 5.0 || echo.meanGradientMmHg >= 60) {
      interventionStrategy =
        profile.age < 65 ? 'SAVR_PREFERRED' : profile.age > 75 ? 'TAVI_PREFERRED' : 'EQUIPOISE_HEART_TEAM';
      recommendationSummary =
        'Very severe AS (Vmax >= 5.0 m/s): Early elective intervention (Class IIa) is indicated to avoid sudden cardiac death, even in the reported absence of symptoms.';
    } else {
      interventionStrategy = 'SURVEILLANCE';
      recommendationSummary =
        'Strict surveillance every 6-12 months with exercise treadmill testing to unmask latent symptoms. If exercise demonstrates symptom provocation, fall in BP, or ST depression, proceed with intervention.';
    }
  } else if (guidelineStage === 'STAGE_D2') {
    if (profile.dobutamineResponse === 'PSEUDO_SEVERE') {
      interventionStrategy = 'SURVEILLANCE';
      recommendationSummary =
        'Pseudo-severe AS confirmed on Dobutamine Stress Echo: As cardiac output increased, AVA expanded to > 1.0-1.2 cm² with minimal gradient increase. Medical heart failure GDMT optimization indicated rather than valve replacement.';
    } else if (profile.dobutamineResponse === 'TRUE_SEVERE') {
      interventionStrategy =
        operativeRiskCategory === 'HIGH_OR_PROHIBITIVE' || profile.age >= 75
          ? 'TAVI_PREFERRED'
          : 'SAVR_PREFERRED';
      recommendationSummary =
        'True severe AS with preserved contractile reserve (>20% stroke volume increase on dobutamine): AVA remains <= 1.0 cm² while mean gradient exceeds 40 mmHg. Prompt aortic valve replacement indicated with favorable operative prognosis.';
    } else if (profile.dobutamineResponse === 'NO_CONTRACTILE_RESERVE') {
      interventionStrategy = 'EQUIPOISE_HEART_TEAM';
      recommendationSummary =
        'No contractile reserve (<20% SV increase on dobutamine). High perioperative mortality, but intervention still confers improved long-term survival over medical therapy. Multidisciplinary Heart Team evaluation and CT calcium scoring required.';
    } else {
      interventionStrategy = 'DOBUTAMINE_STRESS_ECHO_INDICATED';
      recommendationSummary =
        'Perform Low-Dose Dobutamine Stress Echocardiography (up to 20 mcg/kg/min) to determine contractile reserve and distinguish true severe AS from pseudo-severe AS before committing to intervention.';
    }
  } else {
    // STAGE_C2, STAGE_D1, STAGE_D3
    if (operativeRiskCategory === 'HIGH_OR_PROHIBITIVE') {
      if (profile.transfemoralAccessFeasible) {
        interventionStrategy = 'TAVI_PREFERRED';
        recommendationSummary =
          'Transfemoral TAVI/TAVR is the treatment of choice in patients with high or prohibitive surgical risk (STS-PROM >= 8% or porcelain aorta), providing superior survival and shorter recovery.';
      } else {
        interventionStrategy = 'EQUIPOISE_HEART_TEAM';
        recommendationSummary =
          'High surgical risk with hostile femoral access: Multidisciplinary Heart Team review for alternative TAVI access (transaxillary/subclavian, transcarotid, or transcaval) versus high-risk surgical replacement.';
      }
    } else if (profile.age >= 75) {
      if (profile.transfemoralAccessFeasible && !profile.isBicuspid) {
        interventionStrategy = 'TAVI_PREFERRED';
        recommendationSummary =
          'Transfemoral TAVI is strongly preferred for patients >= 75 years of age based on PARTNER-3 and Evolut Low Risk trial equivalence/superiority in transfemoral tricuspid anatomy.';
      } else {
        interventionStrategy = 'EQUIPOISE_HEART_TEAM';
        recommendationSummary =
          'Patient >= 75 years: Evaluate anatomical feasibility for TAVI versus SAVR. If bicuspid anatomy with severe asymmetric calcification or root aneurysm, SAVR may offer superior long-term sealing.';
      }
    } else if (profile.age < 65) {
      interventionStrategy = 'SAVR_PREFERRED';
      recommendationSummary =
        'Surgical Aortic Valve Replacement (SAVR) is preferred in patients < 65 years of age or life expectancy > 20 years. Enables mechanical valve implantation (avoiding structural valve deterioration and re-intervention) and concurrent aortic root replacement if dilated.';
    } else {
      // 65 to 75 years
      interventionStrategy = 'EQUIPOISE_HEART_TEAM';
      recommendationSummary =
        'Shared decision-making by multidisciplinary Heart Team (age 65-75). Either transfemoral TAVI or SAVR is acceptable based on patient preference, vascular anatomy, valve morphology, and expected bioprosthetic longevity.';
    }
  }

  return {
    lvotAreaCm2,
    continuityAvaCm2,
    indexedAvaCm2M2,
    dimensionlessVelocityIndex,
    peakGradientMmHg,
    gorlinAvaCm2,
    hakkiAvaCm2,
    energyLossIndexCm2M2,
    pressureRecoveryMmHg,
    valvuloarterialImpedanceMmHgMlM2,
    severityGrade,
    guidelineStage,
    stageTitle,
    stageRationale,
    interventionStrategy,
    recommendationSummary,
    operativeRiskCategory,
  };
}

/**
 * 8 Clinical Scenarios for Aortic Stenosis Workstation
 */
export interface AsPreset {
  id: string;
  name: string;
  description: string;
  echo: EchoParameters;
  cath: InvasiveCathParameters;
  profile: ClinicalPatientProfile;
}

export const AS_PRESETS: AsPreset[] = [
  {
    id: 'normal-valve',
    name: 'Normal Tricuspid Aortic Valve',
    description: '35-year-old healthy athlete. Normal aortic valve orifice, pristine leaflet excursion, normal velocity and laminar transvalvular flow.',
    echo: {
      lvotDiameterCm: 2.1,
      lvotVtiCm: 20,
      avVtiCm: 22,
      lvotPeakVelocityMs: 0.95,
      avPeakVelocityMs: 1.25,
      meanGradientMmHg: 4,
      aorticRootDiameterCm: 3.2,
    },
    cath: {
      cardiacOutputLMin: 5.8,
      heartRateBpm: 68,
      systolicEjectionPeriodSec: 0.32,
      invasiveMeanGradientMmHg: 3,
    },
    profile: {
      age: 35,
      bsaM2: 1.85,
      lvefPct: 62,
      strokeVolumeIndexMlM2: 45,
      systolicBpMmHg: 118,
      hasSymptoms: false,
      stsPromScorePct: 0.4,
      isBicuspid: false,
      transfemoralAccessFeasible: true,
      severeAortaCalcificationPorcelain: false,
    },
  },
  {
    id: 'moderate-as',
    name: 'Moderate Calcific Aortic Stenosis',
    description: '68-year-old male with progressive exertional fatigue. AVA 1.2 cm², mean gradient 28 mmHg, normal LV systolic function.',
    echo: {
      lvotDiameterCm: 2.0,
      lvotVtiCm: 18,
      avVtiCm: 48,
      lvotPeakVelocityMs: 0.9,
      avPeakVelocityMs: 3.4,
      meanGradientMmHg: 28,
      aorticRootDiameterCm: 3.1,
    },
    cath: {
      cardiacOutputLMin: 4.8,
      heartRateBpm: 72,
      systolicEjectionPeriodSec: 0.30,
      invasiveMeanGradientMmHg: 27,
    },
    profile: {
      age: 68,
      bsaM2: 1.9,
      lvefPct: 58,
      strokeVolumeIndexMlM2: 38,
      systolicBpMmHg: 134,
      hasSymptoms: false,
      stsPromScorePct: 1.2,
      isBicuspid: false,
      transfemoralAccessFeasible: true,
      severeAortaCalcificationPorcelain: false,
    },
  },
  {
    id: 'severe-high-gradient-d1',
    name: 'Classic Severe High-Gradient AS (Stage D1)',
    description: '72-year-old female presenting with exertional angina, dyspnea, and lightheadedness. AVA 0.68 cm², Vmax 4.7 m/s, Mean Gradient 54 mmHg.',
    echo: {
      lvotDiameterCm: 1.9,
      lvotVtiCm: 17,
      avVtiCm: 71,
      lvotPeakVelocityMs: 0.85,
      avPeakVelocityMs: 4.7,
      meanGradientMmHg: 54,
      aorticRootDiameterCm: 2.9,
    },
    cath: {
      cardiacOutputLMin: 4.2,
      heartRateBpm: 76,
      systolicEjectionPeriodSec: 0.28,
      invasiveMeanGradientMmHg: 56,
    },
    profile: {
      age: 72,
      bsaM2: 1.72,
      lvefPct: 55,
      strokeVolumeIndexMlM2: 36,
      systolicBpMmHg: 142,
      hasSymptoms: true,
      stsPromScorePct: 2.1,
      isBicuspid: false,
      transfemoralAccessFeasible: true,
      severeAortaCalcificationPorcelain: false,
    },
  },
  {
    id: 'low-flow-low-gradient-reduced-ef-d2',
    name: 'Classical Low-Flow, Low-Gradient AS (Stage D2)',
    description: '74-year-old male with severe ischemic cardiomyopathy (LVEF 28%), SVI 24 mL/m², AVA 0.72 cm², but deceptively low mean gradient 26 mmHg. Requires Dobutamine Stress Echo.',
    echo: {
      lvotDiameterCm: 2.1,
      lvotVtiCm: 12,
      avVtiCm: 58,
      lvotPeakVelocityMs: 0.65,
      avPeakVelocityMs: 3.2,
      meanGradientMmHg: 26,
      aorticRootDiameterCm: 3.3,
    },
    cath: {
      cardiacOutputLMin: 2.9,
      heartRateBpm: 78,
      systolicEjectionPeriodSec: 0.26,
      invasiveMeanGradientMmHg: 25,
    },
    profile: {
      age: 74,
      bsaM2: 1.88,
      lvefPct: 28,
      strokeVolumeIndexMlM2: 24,
      systolicBpMmHg: 108,
      hasSymptoms: true,
      stsPromScorePct: 5.8,
      isBicuspid: false,
      transfemoralAccessFeasible: true,
      severeAortaCalcificationPorcelain: false,
      dobutamineResponse: 'TRUE_SEVERE',
    },
  },
  {
    id: 'paradoxical-low-flow-preserved-ef-d3',
    name: 'Paradoxical Low-Flow, Low-Gradient AS (Stage D3)',
    description: '81-year-old female with marked concentric LV hypertrophy, small cavity, preserved LVEF 65%, low stroke volume (SVI 27 mL/m²), AVA 0.74 cm², and Mean Gradient 31 mmHg.',
    echo: {
      lvotDiameterCm: 1.8,
      lvotVtiCm: 14,
      avVtiCm: 48,
      lvotPeakVelocityMs: 0.75,
      avPeakVelocityMs: 3.4,
      meanGradientMmHg: 31,
      aorticRootDiameterCm: 2.6,
    },
    cath: {
      cardiacOutputLMin: 3.4,
      heartRateBpm: 74,
      systolicEjectionPeriodSec: 0.27,
      invasiveMeanGradientMmHg: 30,
    },
    profile: {
      age: 81,
      bsaM2: 1.54,
      lvefPct: 65,
      strokeVolumeIndexMlM2: 27,
      systolicBpMmHg: 156,
      hasSymptoms: true,
      stsPromScorePct: 4.2,
      isBicuspid: false,
      transfemoralAccessFeasible: true,
      severeAortaCalcificationPorcelain: false,
    },
  },
  {
    id: 'pseudo-severe-as',
    name: 'Pseudo-Severe AS (Dobutamine Echo Unmasked)',
    description: '70-year-old female with dilated cardiomyopathy (LVEF 25%) and resting AVA 0.82 cm² with low gradient (22 mmHg). On Dobutamine, stroke volume rises 35% and AVA expands to 1.35 cm².',
    echo: {
      lvotDiameterCm: 2.0,
      lvotVtiCm: 11,
      avVtiCm: 42,
      lvotPeakVelocityMs: 0.6,
      avPeakVelocityMs: 3.0,
      meanGradientMmHg: 22,
      aorticRootDiameterCm: 3.0,
    },
    cath: {
      cardiacOutputLMin: 2.7,
      heartRateBpm: 70,
      systolicEjectionPeriodSec: 0.25,
      invasiveMeanGradientMmHg: 21,
    },
    profile: {
      age: 70,
      bsaM2: 1.75,
      lvefPct: 25,
      strokeVolumeIndexMlM2: 23,
      systolicBpMmHg: 110,
      hasSymptoms: true,
      stsPromScorePct: 4.8,
      isBicuspid: false,
      transfemoralAccessFeasible: true,
      severeAortaCalcificationPorcelain: false,
      dobutamineResponse: 'PSEUDO_SEVERE',
    },
  },
  {
    id: 'young-bicuspid-aortopathy',
    name: 'Young Bicuspid Aortic Valve with Aortopathy',
    description: '48-year-old active male with Sievers Type 1 L-R bicuspid aortic valve, severe stenosis (AVA 0.78 cm²), and ascending aortic aneurysm (47 mm). Clear SAVR + root indication.',
    echo: {
      lvotDiameterCm: 2.2,
      lvotVtiCm: 18,
      avVtiCm: 88,
      lvotPeakVelocityMs: 0.9,
      avPeakVelocityMs: 4.8,
      meanGradientMmHg: 58,
      aorticRootDiameterCm: 4.7,
    },
    cath: {
      cardiacOutputLMin: 5.4,
      heartRateBpm: 72,
      systolicEjectionPeriodSec: 0.31,
      invasiveMeanGradientMmHg: 59,
    },
    profile: {
      age: 48,
      bsaM2: 2.05,
      lvefPct: 60,
      strokeVolumeIndexMlM2: 42,
      systolicBpMmHg: 136,
      hasSymptoms: true,
      stsPromScorePct: 0.6,
      isBicuspid: true,
      transfemoralAccessFeasible: true,
      severeAortaCalcificationPorcelain: false,
    },
  },
  {
    id: 'high-risk-octogenarian-tavi',
    name: 'Prohibitive Risk Porcelain Aorta Octogenarian (TAVI Candidate)',
    description: '86-year-old female with extensive circumferential porcelain aorta, STS-PROM 11.2%, severe critical AS (AVA 0.55 cm², gradient 62 mmHg). Ideal transfemoral TAVR candidate.',
    echo: {
      lvotDiameterCm: 1.8,
      lvotVtiCm: 15,
      avVtiCm: 70,
      lvotPeakVelocityMs: 0.8,
      avPeakVelocityMs: 4.9,
      meanGradientMmHg: 62,
      aorticRootDiameterCm: 2.7,
    },
    cath: {
      cardiacOutputLMin: 3.6,
      heartRateBpm: 75,
      systolicEjectionPeriodSec: 0.28,
      invasiveMeanGradientMmHg: 64,
    },
    profile: {
      age: 86,
      bsaM2: 1.58,
      lvefPct: 54,
      strokeVolumeIndexMlM2: 32,
      systolicBpMmHg: 148,
      hasSymptoms: true,
      stsPromScorePct: 11.2,
      isBicuspid: false,
      transfemoralAccessFeasible: true,
      severeAortaCalcificationPorcelain: true,
    },
  },
];
