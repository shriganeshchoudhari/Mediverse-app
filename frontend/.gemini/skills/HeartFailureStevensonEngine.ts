/**
 * HeartFailureStevensonEngine.ts
 *
 * Comprehensive Biophysical & Hemodynamic Engine for Acute Decompensated Heart Failure (ADHF):
 * - Stevenson-Nohria / Forrester 2x2 Hemodynamic Matrix (Warm/Cold, Wet/Dry: Profiles A, B, L, C)
 * - Congestive Nephropathy vs Low-Output Hypoperfusion Mechanics (RPP = MAP - CVP)
 * - DOSE Trial Loop Diuretic Equivalence & Bioavailability (Furosemide, Torsemide, Bumetanide)
 * - Natriuretic Peptide (NT-proBNP / BNP) Trajectory & >=30% Decongestion Discharge Benchmark
 * - Inotrope & Vasodilator Precision Titration Bench (Milrinone vs Dobutamine vs Nitroglycerin/Nitroprusside)
 *
 * Location: frontend/.gemini/skills/HeartFailureStevensonEngine.ts
 */

export type StevensonProfile =
  | 'PROFILE_A_WARM_DRY' // Compensated / Euvolemic, adequate perfusion
  | 'PROFILE_B_WARM_WET' // Congested, adequate perfusion (most common ~70%)
  | 'PROFILE_L_COLD_DRY' // Hypovolemic hypoperfusion (~5%, over-diuresed)
  | 'PROFILE_C_COLD_WET'; // Cardiogenic shock / advanced decompensation (~25%)

export type InotropeAgent = 'MILRINONE' | 'DOBUTAMINE' | 'NONE';
export type VasodilatorAgent = 'NITROGLYCERIN' | 'NITROPRUSSIDE' | 'NONE';

export interface HeartFailurePatientInput {
  patientAgeYears: number;
  patientWeightKg: number;
  systolicBpMmHg: number;
  diastolicBpMmHg: number;
  heartRateBpm: number;
  // Clinical Congestion Markers (Wet vs Dry)
  hasOrthopneaOrPnd: boolean;
  hasElevatedJvp: boolean; // > 8-10 cm H2O
  hasHepatojugularReflux: boolean;
  hasPulmonaryRales: boolean;
  hasLowerExtremityEdema: boolean;
  hasAscites: boolean;
  pcwpMmHg?: number; // Pulmonary capillary wedge pressure (cutoff > 18 mmHg)
  cvpMmHg?: number; // Central venous pressure (cutoff > 10-12 mmHg)
  // Clinical Perfusion Markers (Warm vs Cold)
  hasNarrowPulsePressure: boolean; // PP < 25% of SBP or < 30 mmHg
  hasCoolClammyExtremities: boolean;
  hasAlteredMentation: boolean;
  hasDilutionalHyponatremia: boolean; // Serum Na < 135 mEq/L
  serumLactateMmolL: number; // Normal < 2.0
  cardiacIndexLMinM2?: number; // Normal > 2.2 L/min/m2
  svo2Percent?: number; // Normal > 60-65%
  // Renal & Biomarker Markers
  baselineCreatinineMgDl: number;
  currentCreatinineMgDl: number;
  admissionNtProBnpPgMl: number;
  currentNtProBnpPgMl: number;
  homeOralFurosemideDoseMg: number; // e.g. 40 mg PO daily
  // Active Pharmacotherapy
  activeInotrope: InotropeAgent;
  inotropeDoseMcgKgMin: number;
  activeVasodilator: VasodilatorAgent;
  vasodilatorDoseMcgMin: number;
}

export interface StevensonClassification {
  profile: StevensonProfile;
  profileName: string;
  quadrantBadge: string;
  isWet: boolean;
  isCold: boolean;
  congestionScore: number; // 0 to 6 clinical markers + PCWP
  perfusionScore: number; // 0 to 5 clinical markers + CI
  inHospitalMortalityRiskPercent: number; // A: ~2-3%, B: ~7-10%, L: ~12-15%, C: ~25-35%
  hemodynamicSummary: string;
}

export interface CardiorenalCongestionAnalysis {
  meanArterialPressureMmHg: number;
  effectiveCvpMmHg: number;
  renalPerfusionPressureMmHg: number; // MAP - CVP
  isCongestiveNephropathyDominant: boolean;
  creatinineFoldIncrease: number;
  clinicalInterpretation: string;
}

export interface DiureticRegimenPlan {
  homeOralFurosemideDoseMg: number;
  recommendedIvFurosemideDoseMg: number; // DOSE trial 2.5x home dose
  doseRationale: string;
  equivalentTorsemideOralMg: number;
  equivalentBumetanideOralMg: number;
  potassiumMagnesiumSafetyGuidance: string;
}

export interface NatriureticPeptideTrajectory {
  admissionNtProBnpPgMl: number;
  currentNtProBnpPgMl: number;
  percentageChange: number; // negative is reduction
  isDecongestionBenchmarkMet: boolean; // >= 30% reduction
  prognosticAssessment: string;
}

export interface InotropeVasodilatorEvaluation {
  inotropeRecommendation: string;
  vasodilatorRecommendation: string;
  safetyWarnings: string[];
  mechanicalCirculatorySupportCandidate: boolean;
}

export interface HeartFailureComprehensiveOutput {
  classification: StevensonClassification;
  cardiorenal: CardiorenalCongestionAnalysis;
  diureticPlan: DiureticRegimenPlan;
  peptideTrajectory: NatriureticPeptideTrajectory;
  pharmacotherapy: InotropeVasodilatorEvaluation;
  urgentActionChecklist: string[];
  clinicalPearls: string[];
}

/**
 * Classify Acute Decompensated Heart Failure using Stevenson-Nohria 2x2 Matrix.
 */
export function classifyStevensonProfile(input: HeartFailurePatientInput): StevensonClassification {
  let congestionCount = 0;
  if (input.hasOrthopneaOrPnd) congestionCount++;
  if (input.hasElevatedJvp) congestionCount++;
  if (input.hasHepatojugularReflux) congestionCount++;
  if (input.hasPulmonaryRales) congestionCount++;
  if (input.hasLowerExtremityEdema) congestionCount++;
  if (input.hasAscites) congestionCount++;

  const isWet =
    input.pcwpMmHg !== undefined ? input.pcwpMmHg > 18 : congestionCount >= 2;

  let perfusionCount = 0;
  if (input.hasNarrowPulsePressure) perfusionCount++;
  if (input.hasCoolClammyExtremities) perfusionCount++;
  if (input.hasAlteredMentation) perfusionCount++;
  if (input.hasDilutionalHyponatremia) perfusionCount++;
  if (input.serumLactateMmolL >= 2.0) perfusionCount++;

  const isCold =
    input.cardiacIndexLMinM2 !== undefined ? input.cardiacIndexLMinM2 < 2.2 : perfusionCount >= 2;

  let profile: StevensonProfile;
  let profileName: string;
  let quadrantBadge: string;
  let mortality: number;
  let summary: string;

  if (!isCold && !isWet) {
    profile = 'PROFILE_A_WARM_DRY';
    profileName = 'Profile A: Warm & Dry';
    quadrantBadge = 'Compensated • Euvolemic';
    mortality = 2.5;
    summary =
      'Compensated / euvolemic hemodynamics with preserved forward perfusion (CI > 2.2 L/min/m2) and normal intracardiac filling pressures (PCWP <= 18 mmHg). Focus on GDMT titration.';
  } else if (!isCold && isWet) {
    profile = 'PROFILE_B_WARM_WET';
    profileName = 'Profile B: Warm & Wet';
    quadrantBadge = 'Congested • Preserved Perfusion';
    mortality = 8.5;
    summary =
      'Most common ADHF presentation (~70%). Elevated left/right-sided filling pressures (PCWP > 18 mmHg, high JVP, pulmonary/systemic edema) with intact systemic perfusion. Primary therapy: IV loop diuretics +/- vasodilators.';
  } else if (isCold && !isWet) {
    profile = 'PROFILE_L_COLD_DRY';
    profileName = 'Profile L: Cold & Dry';
    quadrantBadge = 'Hypoperfused • Low Filling Pressures';
    mortality = 14.0;
    summary =
      'Hypovolemic hypoperfusion (~5% of admissions). True volume depletion or over-diuresis with low filling pressures (PCWP < 14 mmHg) and low cardiac index. Requires cautious fluid challenge before inotropic support.';
  } else {
    profile = 'PROFILE_C_COLD_WET';
    profileName = 'Profile C: Cold & Wet';
    quadrantBadge = 'Cardiogenic Shock • Congested & Hypoperfused';
    mortality = 32.0;
    summary =
      'Severe decompensation / cardiogenic shock (~20-25%). High filling pressures (PCWP > 18 mmHg) AND critically depressed forward perfusion (CI < 2.2 L/min/m2, narrow pulse pressure, lactic acidosis). Requires inotropes, vasopressors, and mechanical circulatory support evaluation.';
  }

  return {
    profile,
    profileName,
    quadrantBadge,
    isWet,
    isCold,
    congestionScore: congestionCount,
    perfusionScore: perfusionCount,
    inHospitalMortalityRiskPercent: mortality,
    hemodynamicSummary: summary,
  };
}

/**
 * Compute Cardiorenal Congestion vs Low-Output Hypoperfusion Mechanics.
 */
export function analyzeCardiorenalCongestion(input: HeartFailurePatientInput): CardiorenalCongestionAnalysis {
  const map = Math.round((2 * input.diastolicBpMmHg + input.systolicBpMmHg) / 3);
  const cvp = input.cvpMmHg !== undefined ? input.cvpMmHg : input.hasElevatedJvp ? 14 : 6;
  const rpp = Math.max(0, map - cvp);

  const baselineCr = Math.max(0.4, input.baselineCreatinineMgDl);
  const foldIncrease = Math.round((input.currentCreatinineMgDl / baselineCr) * 100) / 100;

  // Congestive nephropathy is dominant when venous backpressure (CVP) is markedly elevated
  const isCongestiveDominant = cvp >= 12;

  let interpretation: string;
  if (isCongestiveDominant) {
    interpretation =
      `Congestive Nephropathy (Venous Hypertension): Elevated CVP (${cvp} mmHg) transmits to renal interlobular and arcuate veins, increasing renal interstitial pressure and collapsing peritubular capillaries. This severely diminishes net transglomerular filtration pressure (RPP = ${rpp} mmHg). Aggressive decongestion with loop diuretics is indicated even if creatinine transiently rises (the "Decongestion Paradox").`;
  } else if (map < 65 || input.hasNarrowPulsePressure) {
    interpretation =
      `Low-Output Prerenal Hypoperfusion: Arterial forward failure with low MAP (${map} mmHg) diminishes renal afferent arteriolar perfusion pressure. Inotropes or cautious MAP support are required to restore effective glomerular filtration.`;
  } else {
    interpretation =
      `Balanced Hemodynamics: Renal perfusion pressure is adequate (${rpp} mmHg) with low venous backpressure (${cvp} mmHg). Continue maintenance decongestion and renal monitoring.`;
  }

  return {
    meanArterialPressureMmHg: map,
    effectiveCvpMmHg: cvp,
    renalPerfusionPressureMmHg: rpp,
    isCongestiveNephropathyDominant: isCongestiveDominant,
    creatinineFoldIncrease: foldIncrease,
    clinicalInterpretation: interpretation,
  };
}

/**
 * Calculate DOSE Trial Loop Diuretic Regimen & Potency Equivalence.
 */
export function calculateDiureticPlan(homeOralFurosemideMg: number): DiureticRegimenPlan {
  const homeDose = Math.max(0, homeOralFurosemideMg);

  // DOSE trial (NEJM 2011): High-dose strategy is 2.5x the home oral dose given as IV
  // If loop-naive (home dose = 0), initial starting dose is 40-80 mg IV furosemide
  let recommendedIvMg: number;
  let rationale: string;

  if (homeDose === 0) {
    recommendedIvMg = 40;
    rationale =
      'Loop-Diuretic Naive: Recommended initial starting regimen is 40 mg to 80 mg IV Furosemide bolus, assessing 2-hour spot urine sodium (>50-70 mEq/L) and 6-hour urine output (>1000-1400 mL).';
  } else {
    recommendedIvMg = Math.round(homeDose * 2.5);
    rationale =
      `DOSE Trial High-Dose Protocol: 2.5x home oral dose (${homeDose} mg PO) = ${recommendedIvMg} mg IV Furosemide bolus every 12 hours (or continuous infusion). Produced faster dyspnea relief and greater net volume loss without long-term renal deterioration.`;
  }

  // Equivalencies: 40 mg Furosemide PO = 20 mg Furosemide IV = 20 mg Torsemide PO/IV = 1 mg Bumetanide PO/IV
  const equivTorsemide = Math.round((Math.max(40, homeDose) / 2) * 10) / 10;
  const equivBumetanide = Math.round((Math.max(40, homeDose) / 40) * 10) / 10;

  return {
    homeOralFurosemideDoseMg: homeDose,
    recommendedIvFurosemideDoseMg: recommendedIvMg,
    doseRationale: rationale,
    equivalentTorsemideOralMg: equivTorsemide,
    equivalentBumetanideOralMg: equivBumetanide,
    potassiumMagnesiumSafetyGuidance:
      'Maintain serum Potassium >= 4.0 mEq/L and Magnesium >= 2.0 mg/dL during high-intensity loop diuresis to protect against fatal ventricular arrhythmias, especially in patients with ischemic cardiomyopathy or on digoxin.',
  };
}

/**
 * Calculate Natriuretic Peptide Trajectory and Decongestion Benchmark.
 */
export function calculatePeptideTrajectory(
  admissionNtProBnp: number,
  currentNtProBnp: number
): NatriureticPeptideTrajectory {
  const adm = Math.max(10, admissionNtProBnp);
  const cur = Math.max(10, currentNtProBnp);
  const percentChange = Math.round(((cur - adm) / adm) * 1000) / 10;
  const isBenchmarkMet = percentChange <= -30; // >= 30% reduction

  let assessment: string;
  if (isBenchmarkMet) {
    assessment =
      `Optimal Decongestion Benchmark Achieved (${Math.abs(percentChange)}% reduction from admission peak). A >=30% decline in NT-proBNP independently predicts significantly lower 30-day all-cause mortality and heart failure readmission. Patient is favorable for transition to oral GDMT.`;
  } else if (percentChange < 0) {
    assessment =
      `Sub-target Decongestion (${Math.abs(percentChange)}% reduction). Does not yet meet the >=30% threshold. Residual hemodynamic congestion remains; continue inpatient decongestion and consider thiazide synergy (Metolazone) before discharge.`;
  } else {
    assessment =
      `Adverse Biomarker Trajectory (+${percentChange}% surge). Rising natriuretic peptide indicates ongoing ventricular wall stretch, worsening end-diastolic wall tension, or progressive cardiorenal failure. Urgent escalation of therapy required.`;
  }

  return {
    admissionNtProBnpPgMl: adm,
    currentNtProBnpPgMl: cur,
    percentageChange: percentChange,
    isDecongestionBenchmarkMet: isBenchmarkMet,
    prognosticAssessment: assessment,
  };
}

/**
 * Evaluate Inotrope and Vasodilator Titration with Safety Interlocks.
 */
export function evaluatePharmacotherapy(
  profile: StevensonProfile,
  input: HeartFailurePatientInput
): InotropeVasodilatorEvaluation {
  const warnings: string[] = [];
  let inotropeRec = '';
  let vasodilatorRec = '';
  let mcsCandidate = false;

  const sbp = input.systolicBpMmHg;

  if (profile === 'PROFILE_C_COLD_WET') {
    mcsCandidate = true;
    if (sbp < 85) {
      warnings.push('CRITICAL HYPOTENSION (SBP < 85 mmHg): Pure inodilators (Milrinone) will precipitate cardiovascular collapse without concomitant vasopressor (Norepinephrine).');
      inotropeRec =
        'Initiate Dobutamine (2.5 - 5.0 mcg/kg/min) + Norepinephrine to maintain MAP >= 65 mmHg. Dobutamine is preferred over Milrinone during profound hypotension due to lower vasodilation and shorter half-life.';
    } else {
      inotropeRec =
        'Milrinone (0.25 - 0.50 mcg/kg/min, omit bolus) preferred if patient is on chronic beta-blocker therapy or has severe pulmonary hypertension (PVR reduction). Reduce dose by 50% if CrCl < 30 mL/min. Alternatively, Dobutamine 2.5 - 10 mcg/kg/min.';
    }
    vasodilatorRec =
      'Vasodilators are contraindicated while systemic perfusion is compromised. Defer until SBP > 100 mmHg and inotrope has restored forward flow.';
  } else if (profile === 'PROFILE_B_WARM_WET') {
    inotropeRec = 'Inotropes are NOT indicated (warm periphery confirms preserved forward cardiac output). Inotropes in Profile B increase myocardial oxygen demand and arrhythmia mortality without clinical benefit.';
    if (sbp >= 110) {
      vasodilatorRec =
        'IV Nitroglycerin (start 20 - 40 mcg/min, titrate up to 200 mcg/min) or IV Sodium Nitroprusside (0.5 - 3.0 mcg/kg/min for severe hypertensive acute pulmonary edema). Rapidly reduces preload and LV afterload, augmenting stroke volume.';
    } else {
      vasodilatorRec =
        'Caution: SBP is borderline (90-109 mmHg). Rely primarily on IV loop diuretics for decongestion; avoid aggressive vasodilators to prevent hypotension.';
    }
  } else if (profile === 'PROFILE_L_COLD_DRY') {
    inotropeRec =
      'Hold inotropes initially. Administer a cautious 250 - 500 mL balanced crystalloid fluid challenge over 30 minutes while reassessing JVP and lung sounds. Over-diuresed state often reverses with volume alone.';
    vasodilatorRec = 'Vasodilators contraindicated (filling pressures already low).';
  } else {
    // Profile A
    inotropeRec = 'No inotropes indicated.';
    vasodilatorRec = 'Transition to oral GDMT (ARNI/ACEi, beta-blocker, MRA, SGLT2i).';
  }

  return {
    inotropeRecommendation: inotropeRec,
    vasodilatorRecommendation: vasodilatorRec,
    safetyWarnings: warnings,
    mechanicalCirculatorySupportCandidate: mcsCandidate,
  };
}

/**
 * Perform Comprehensive Heart Failure Evaluation.
 */
export function performHeartFailureEvaluation(
  input: HeartFailurePatientInput
): HeartFailureComprehensiveOutput {
  const classification = classifyStevensonProfile(input);
  const cardiorenal = analyzeCardiorenalCongestion(input);
  const diureticPlan = calculateDiureticPlan(input.homeOralFurosemideDoseMg);
  const peptideTrajectory = calculatePeptideTrajectory(
    input.admissionNtProBnpPgMl,
    input.currentNtProBnpPgMl
  );
  const pharmacotherapy = evaluatePharmacotherapy(classification.profile, input);

  const urgentActions: string[] = [
    `Hemodynamic Profile Assigned: ${classification.profileName} (${classification.quadrantBadge}).`,
    `Cardiorenal Status: RPP is ${cardiorenal.renalPerfusionPressureMmHg} mmHg (MAP ${cardiorenal.meanArterialPressureMmHg} - CVP ${cardiorenal.effectiveCvpMmHg} mmHg).`,
  ];

  if (classification.isWet) {
    urgentActions.push(
      `Administer IV Furosemide ${diureticPlan.recommendedIvFurosemideDoseMg} mg bolus (DOSE high-dose strategy). Check 2-hour spot urine sodium.`
    );
  }

  if (pharmacotherapy.vasodilatorRecommendation.includes('Nitroglycerin')) {
    urgentActions.push('Initiate IV Nitroglycerin infusion titrated for preload reduction and acute dyspnea relief.');
  }

  if (classification.profile === 'PROFILE_C_COLD_WET') {
    urgentActions.push('URGENT CARDIOGENIC SHOCK ESCALATION: Initiate inotropic support and prepare invasive arterial line / Swan-Ganz monitoring.');
    if (pharmacotherapy.mechanicalCirculatorySupportCandidate) {
      urgentActions.push('Consult Interventional Cardiology / Heart Failure specialist for Mechanical Circulatory Support (Impella / IABP / VA-ECMO).');
    }
  }

  const clinicalPearls: string[] = [
    'Stevenson-Nohria Profile B Prevalence: ~70% of ADHF patients are Warm & Wet. The primary pathophysiology is fluid redistribution and elevated filling pressures (PCWP > 18 mmHg) with preserved cardiac output (CI > 2.2 L/min/m2). Inotropes are contraindicated in Profile B.',
    'Congestive Nephropathy Dominance: Elevated venous pressure (CVP > 12 mmHg) is the predominant cause of acute worsening renal function in heart failure, not low arterial pressure. Relieving venous congestion restores the transglomerular perfusion pressure gradient.',
    'DOSE Trial Strategy (NEJM 2011): Administering 2.5x the home oral loop diuretic dose as an IV bolus provides faster symptom relief and greater net volume loss without compromising long-term renal safety.',
    'Milrinone vs Dobutamine Rule: Milrinone is preferred in patients on chronic beta-blockers and those with significant pulmonary hypertension, but requires dose reduction in renal impairment and causes vasodilation. Dobutamine is preferred in renal failure or when SBP < 85-90 mmHg.',
    'The 30% Decongestion Rule: Achieving a >=30% reduction in NT-proBNP from admission peak to discharge independently predicts significantly reduced 30-day mortality and hospital readmission.'
  ];

  return {
    classification,
    cardiorenal,
    diureticPlan,
    peptideTrajectory,
    pharmacotherapy,
    urgentActionChecklist: urgentActions,
    clinicalPearls,
  };
}

export interface AdhfPreset {
  id: string;
  name: string;
  badge: string;
  description: string;
  inputs: HeartFailurePatientInput;
}

export const ADHF_PRESETS: AdhfPreset[] = [
  {
    id: 'WARM_WET_ACUTE_PULMONARY_EDEMA',
    name: 'Profile B: Warm & Wet with Acute Pulmonary Edema (Hypertensive)',
    badge: 'Profile B • PCWP 26 • SBP 164',
    description: '66 yo male with ischemic cardiomyopathy presenting in severe orthopnea, bilateral rales, elevated JVP 14 cm H2O, SBP 164/98 mmHg. Warm extremities, lactate 1.2. Rapid response to IV loop diuresis + IV nitroglycerin.',
    inputs: {
      patientAgeYears: 66,
      patientWeightKg: 82,
      systolicBpMmHg: 164,
      diastolicBpMmHg: 98,
      heartRateBpm: 104,
      hasOrthopneaOrPnd: true,
      hasElevatedJvp: true,
      hasHepatojugularReflux: true,
      hasPulmonaryRales: true,
      hasLowerExtremityEdema: true,
      hasAscites: false,
      pcwpMmHg: 26,
      cvpMmHg: 14,
      hasNarrowPulsePressure: false,
      hasCoolClammyExtremities: false,
      hasAlteredMentation: false,
      hasDilutionalHyponatremia: false,
      serumLactateMmolL: 1.2,
      cardiacIndexLMinM2: 2.6,
      svo2Percent: 68,
      baselineCreatinineMgDl: 1.2,
      currentCreatinineMgDl: 1.5,
      admissionNtProBnpPgMl: 8400,
      currentNtProBnpPgMl: 7200,
      homeOralFurosemideDoseMg: 40,
      activeInotrope: 'NONE',
      inotropeDoseMcgKgMin: 0,
      activeVasodilator: 'NITROGLYCERIN',
      vasodilatorDoseMcgMin: 40,
    },
  },
  {
    id: 'COLD_WET_CARDIOGENIC_SHOCK',
    name: 'Profile C: Cold & Wet Cardiogenic Shock (Inotropes & MCS Candidate)',
    badge: 'Profile C • CI 1.6 • PCWP 28 • Shock',
    description: '71 yo female with non-ischemic dilated cardiomyopathy presenting in cold extremities, narrow pulse pressure (84/68 mmHg), confusion, oliguria, lactate 3.4 mmol/L, PCWP 28 mmHg, CI 1.6 L/min/m2.',
    inputs: {
      patientAgeYears: 71,
      patientWeightKg: 64,
      systolicBpMmHg: 84,
      diastolicBpMmHg: 68,
      heartRateBpm: 118,
      hasOrthopneaOrPnd: true,
      hasElevatedJvp: true,
      hasHepatojugularReflux: true,
      hasPulmonaryRales: true,
      hasLowerExtremityEdema: true,
      hasAscites: true,
      pcwpMmHg: 28,
      cvpMmHg: 18,
      hasNarrowPulsePressure: true,
      hasCoolClammyExtremities: true,
      hasAlteredMentation: true,
      hasDilutionalHyponatremia: true,
      serumLactateMmolL: 3.4,
      cardiacIndexLMinM2: 1.6,
      svo2Percent: 46,
      baselineCreatinineMgDl: 1.1,
      currentCreatinineMgDl: 2.4,
      admissionNtProBnpPgMl: 14200,
      currentNtProBnpPgMl: 15600,
      homeOralFurosemideDoseMg: 80,
      activeInotrope: 'DOBUTAMINE',
      inotropeDoseMcgKgMin: 5.0,
      activeVasodilator: 'NONE',
      vasodilatorDoseMcgMin: 0,
    },
  },
  {
    id: 'COLD_DRY_OVER_DIURESED',
    name: 'Profile L: Cold & Dry (Over-Diuresed Hypovolemic Hypoperfusion)',
    badge: 'Profile L • PCWP 11 • Fluid Challenge',
    description: '59 yo male over-diuresed outpatient with dry mucous membranes, flat JVP, cool extremities, low BP 88/60, PCWP 11 mmHg, CI 1.9. Requires cautious fluid challenge rather than inotropes.',
    inputs: {
      patientAgeYears: 59,
      patientWeightKg: 70,
      systolicBpMmHg: 88,
      diastolicBpMmHg: 60,
      heartRateBpm: 96,
      hasOrthopneaOrPnd: false,
      hasElevatedJvp: false,
      hasHepatojugularReflux: false,
      hasPulmonaryRales: false,
      hasLowerExtremityEdema: false,
      hasAscites: false,
      pcwpMmHg: 11,
      cvpMmHg: 4,
      hasNarrowPulsePressure: true,
      hasCoolClammyExtremities: true,
      hasAlteredMentation: false,
      hasDilutionalHyponatremia: false,
      serumLactateMmolL: 1.8,
      cardiacIndexLMinM2: 1.9,
      svo2Percent: 54,
      baselineCreatinineMgDl: 1.0,
      currentCreatinineMgDl: 1.9,
      admissionNtProBnpPgMl: 3200,
      currentNtProBnpPgMl: 2100,
      homeOralFurosemideDoseMg: 80,
      activeInotrope: 'NONE',
      inotropeDoseMcgKgMin: 0,
      activeVasodilator: 'NONE',
      vasodilatorDoseMcgMin: 0,
    },
  },
  {
    id: 'WARM_DRY_OPTIMAL_GDMT',
    name: 'Profile A: Warm & Dry (Compensated / GDMT Titration Candidate)',
    badge: 'Profile A • Euvolemic • NT-proBNP -45%',
    description: '64 yo male hospitalized for ADHF 4 days ago, now completely decongested on oral regimen. JVP normal, lung bases clear, no edema, NT-proBNP down 45% (from 6200 to 3400 pg/mL). Favorable for discharge.',
    inputs: {
      patientAgeYears: 64,
      patientWeightKg: 78,
      systolicBpMmHg: 122,
      diastolicBpMmHg: 76,
      heartRateBpm: 68,
      hasOrthopneaOrPnd: false,
      hasElevatedJvp: false,
      hasHepatojugularReflux: false,
      hasPulmonaryRales: false,
      hasLowerExtremityEdema: false,
      hasAscites: false,
      pcwpMmHg: 14,
      cvpMmHg: 6,
      hasNarrowPulsePressure: false,
      hasCoolClammyExtremities: false,
      hasAlteredMentation: false,
      hasDilutionalHyponatremia: false,
      serumLactateMmolL: 0.9,
      cardiacIndexLMinM2: 2.8,
      svo2Percent: 72,
      baselineCreatinineMgDl: 1.1,
      currentCreatinineMgDl: 1.2,
      admissionNtProBnpPgMl: 6200,
      currentNtProBnpPgMl: 3400,
      homeOralFurosemideDoseMg: 40,
      activeInotrope: 'NONE',
      inotropeDoseMcgKgMin: 0,
      activeVasodilator: 'NONE',
      vasodilatorDoseMcgMin: 0,
    },
  },
];
