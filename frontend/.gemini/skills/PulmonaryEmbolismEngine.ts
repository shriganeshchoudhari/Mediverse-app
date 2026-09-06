/**
 * PulmonaryEmbolismEngine.ts
 *
 * Biophysical & Clinical Decision Engine for Acute Pulmonary Embolism (PE),
 * ESC/AHA Risk Stratification, PESI / sPESI Prognostic Scoring,
 * Echocardiographic RV Strain (RV/LV ratio, McConnell's sign, TAPSE),
 * Systemic Thrombolysis (Full-Dose vs Half-Dose tPA), Catheter-Directed
 * Thrombolysis (EKOS Ultrasound-Accelerated), and Mechanical Thrombectomy.
 *
 * Location: frontend/.gemini/skills/PulmonaryEmbolismEngine.ts
 */

export type PeRiskCategory =
  | 'HIGH_RISK_MASSIVE' // Hemodynamic instability (SBP < 90, shock, arrest)
  | 'INTERMEDIATE_HIGH_RISK' // Stable hemodynamics + BOTH RV strain AND positive biomarkers
  | 'INTERMEDIATE_LOW_RISK' // Stable hemodynamics + EITHER RV strain OR positive biomarkers
  | 'LOW_RISK'; // Stable hemodynamics + NO RV strain + NO elevated biomarkers + low sPESI

export type ReperfusionStrategy =
  | 'SYSTEMIC_THROMBOLYSIS_FULL_DOSE' // 100 mg IV Alteplase over 2 hours
  | 'SYSTEMIC_THROMBOLYSIS_HALF_DOSE' // 50 mg IV Alteplase (MOPETT trial)
  | 'CATHETER_DIRECTED_THROMBOLYSIS_EKOS' // 0.5-1.0 mg/hr tPA + ultrasound
  | 'PERCUTANEOUS_MECHANICAL_THROMBECTOMY' // Inari FlowTriever / Indigo aspiration
  | 'SURGICAL_PULMONARY_EMBOLECTOMY' // Sternotomy + CPB clot extraction
  | 'ANTICOAGULATION_ALONE_UFH_LMWH_DOAC'; // Therapeutic anticoagulation without reperfusion

export interface PePatientHemodynamics {
  systolicBpMmHg: number; // e.g. 78 or 124
  diastolicBpMmHg: number; // e.g. 52 or 78
  heartRateBpm: number; // e.g. 128
  respiratoryRateBpm: number; // e.g. 28
  oxygenSaturationPct: number; // e.g. 88
  requiresVasopressors: boolean; // Norepinephrine / Epinephrine infusion
  hasCardiacArrestOrPea: boolean; // Pulseless Electrical Activity arrest
  systolicBpBelow90DurationMinutes: number; // e.g. 25 min (> 15 min defines shock)
}

export interface PePatientDemographicsAndHistory {
  ageYears: number; // e.g. 68
  isMale: boolean;
  hasActiveCancer: boolean;
  hasChronicCardiopulmonaryDisease: boolean; // Heart failure or chronic lung disease
  hasAlteredMentalStatus: boolean; // acute confusion / syncope
  temperatureCelsius: number; // e.g. 36.4
  hasMajorBleedingContraindicationToTpa: boolean; // Recent surgery < 3 wks, CNS bleed, active hemorrhage
}

export interface PeRvStrainAndBiomarkers {
  rvToLvDiameterRatio: number; // Normal < 0.9; >= 0.9 or 1.0 indicates severe strain
  tapseMm: number; // Tricuspid Annular Plane Systolic Excursion: Normal >= 17 mm; < 16 mm is dysfunction
  hasMcConnellSign: boolean; // Mid-free wall akinesia with apical sparing
  hasParadoxicalSeptalShiftDsign: boolean; // Flattening of interventricular septum
  troponinIngMl: number; // Normal < 0.04 ng/mL; >= 0.04 is elevated
  bnpPgMl: number; // Normal < 100 pg/mL (or NT-proBNP >= 600 pg/mL)
}

export interface PeReperfusionPlan {
  selectedStrategy: ReperfusionStrategy;
  thrombolysisAdministered: boolean;
  anticoagulationInitiated: boolean; // IV Heparin or Enoxaparin
  catheterPositionedBilateral: boolean; // Bilateral PA catheters for EKOS
}

export interface PulmonaryEmbolismEvaluation {
  riskCategory: PeRiskCategory;
  spesiScore: number;
  spesiRiskClass: 'LOW_RISK' | 'HIGH_RISK';
  estimated30DayMortalityPct: number;
  hasHemodynamicInstability: boolean;
  hasRvDysfunction: boolean;
  hasMyocardialInjury: boolean;
  recommendedReperfusionStrategy: string;
  anticoagulationRecommendation: string;
  tpaDosingProtocol: string;
  contraindicationWarning: string;
  clinicalSafetyAlerts: string[];
}

/**
 * Calculates simplified Pulmonary Embolism Severity Index (sPESI)
 * Each criterion gives 1 point:
 * - Age > 80
 * - History of cancer
 * - Chronic cardiopulmonary disease
 * - Heart rate >= 110 bpm
 * - Systolic BP < 100 mmHg
 * - Arterial oxygen saturation < 90%
 */
export function calculateSpesiScore(
  hemo: PePatientHemodynamics,
  history: PePatientDemographicsAndHistory
): { score: number; riskClass: 'LOW_RISK' | 'HIGH_RISK'; mortalityPct: number } {
  let score = 0;

  if (history.ageYears > 80) score += 1;
  if (history.hasActiveCancer) score += 1;
  if (history.hasChronicCardiopulmonaryDisease) score += 1;
  if (hemo.heartRateBpm >= 110) score += 1;
  if (hemo.systolicBpMmHg < 100) score += 1;
  if (hemo.oxygenSaturationPct < 90) score += 1;

  const riskClass: 'LOW_RISK' | 'HIGH_RISK' = score === 0 ? 'LOW_RISK' : 'HIGH_RISK';
  // sPESI 0: ~ 1.0% 30-day mortality; sPESI >= 1: ~ 10.9% 30-day mortality
  const mortalityPct = score === 0 ? 1.0 : score === 1 ? 8.9 : score === 2 ? 12.5 : 22.0;

  return { score, riskClass, mortalityPct };
}

/**
 * Evaluates Right Ventricular (RV) strain on echocardiography / CTPA
 */
export function evaluateRvStrain(strain: PeRvStrainAndBiomarkers): boolean {
  return (
    strain.rvToLvDiameterRatio >= 0.9 ||
    strain.tapseMm < 16 ||
    strain.hasMcConnellSign ||
    strain.hasParadoxicalSeptalShiftDsign
  );
}

/**
 * Evaluates Myocardial Necrosis Biomarkers
 */
export function evaluateMyocardialInjury(strain: PeRvStrainAndBiomarkers): boolean {
  return strain.troponinIngMl >= 0.04 || strain.bnpPgMl >= 100;
}

/**
 * Evaluates Hemodynamic Instability per ESC/AHA guidelines
 */
export function evaluateHemodynamicInstability(hemo: PePatientHemodynamics): boolean {
  return (
    hemo.hasCardiacArrestOrPea ||
    hemo.requiresVasopressors ||
    (hemo.systolicBpMmHg < 90 && hemo.systolicBpBelow90DurationMinutes >= 15)
  );
}

/**
 * Classifies PE Risk Category according to ESC 2019 / AHA Guidelines
 */
export function classifyPeRisk(
  hemo: PePatientHemodynamics,
  strain: PeRvStrainAndBiomarkers,
  spesiRiskClass: 'LOW_RISK' | 'HIGH_RISK'
): PeRiskCategory {
  const hasInstability = evaluateHemodynamicInstability(hemo);
  if (hasInstability) {
    return 'HIGH_RISK_MASSIVE';
  }

  const hasRv = evaluateRvStrain(strain);
  const hasInjury = evaluateMyocardialInjury(strain);

  if (hasRv && hasInjury) {
    return 'INTERMEDIATE_HIGH_RISK';
  }

  if (hasRv || hasInjury || spesiRiskClass === 'HIGH_RISK') {
    return 'INTERMEDIATE_LOW_RISK';
  }

  return 'LOW_RISK';
}

/**
 * Master Workstation Evaluation Function
 */
export function evaluatePulmonaryEmbolismWorkstation(
  hemo: PePatientHemodynamics,
  history: PePatientDemographicsAndHistory,
  strain: PeRvStrainAndBiomarkers,
  plan: PeReperfusionPlan
): PulmonaryEmbolismEvaluation {
  const { score: spesi, riskClass: spesiClass, mortalityPct } = calculateSpesiScore(
    hemo,
    history
  );

  const hasInstability = evaluateHemodynamicInstability(hemo);
  const hasRv = evaluateRvStrain(strain);
  const hasInjury = evaluateMyocardialInjury(strain);

  const riskCat = classifyPeRisk(hemo, strain, spesiClass);

  // Recommended Reperfusion Strategy
  let reperfusionRec = '';
  if (riskCat === 'HIGH_RISK_MASSIVE') {
    if (history.hasMajorBleedingContraindicationToTpa) {
      reperfusionRec =
        'HIGH-RISK MASSIVE PE WITH CONTRAINDICATION TO THROMBOLYSIS: Patient in shock/arrest with absolute contraindication to systemic tPA. Immediately mobilize Interventional Cardiology / PERT for Percutaneous Mechanical Thrombectomy (Inari FlowTriever / Indigo) or emergency Surgical Pulmonary Embolectomy on CPB!';
    } else {
      reperfusionRec =
        'HIGH-RISK MASSIVE PE: Immediate primary systemic thrombolysis mandated (Alteplase 100 mg IV over 2 hours). In cardiac arrest / peri-arrest, administer accelerated 0.6 mg/kg (up to 50 mg) IV push over 15 minutes. High-flow oxygen, cautious volume loading (<= 500 mL), and Norepinephrine for RV perfusion pressure.';
    }
  } else if (riskCat === 'INTERMEDIATE_HIGH_RISK') {
    reperfusionRec =
      'INTERMEDIATE-HIGH RISK (SUBMASSIVE PE): Hemodynamically stable but exhibits BOTH RV dysfunction (RV/LV >= 0.9, TAPSE < 16mm) and myocardial injury (elevated troponin). High risk of hemodynamic collapse (up to 10% decompensation). Admit to ICU, initiate therapeutic Unfractionated Heparin (weight-based IV bolus + drip), and consider Catheter-Directed Thrombolysis (EKOS low-dose tPA 0.5-1.0 mg/hr) or half-dose systemic tPA (50 mg) if clinical worsening develops.';
  } else if (riskCat === 'INTERMEDIATE_LOW_RISK') {
    reperfusionRec =
      'INTERMEDIATE-LOW RISK PE: Therapeutic anticoagulation with LMWH (Enoxaparin 1 mg/kg SC q12h) or direct oral anticoagulant (Apixaban / Rivaroxaban). Routine thrombolysis is NOT recommended due to bleeding risk exceeding benefit. Monitor telemetry for 24–48 hours.';
  } else {
    reperfusionRec =
      'LOW-RISK PE (sPESI 0, normal RV, normal biomarkers): Early hospital discharge or outpatient anticoagulation with DOAC (Apixaban 10 mg PO BID x 7 days then 5 mg BID, or Rivaroxaban 15 mg PO BID x 21 days then 20 mg daily) is safe and recommended per Hestia / PESI criteria.';
  }

  // Anticoagulation Recommendation
  let anticoagRec = '';
  if (riskCat === 'HIGH_RISK_MASSIVE' || riskCat === 'INTERMEDIATE_HIGH_RISK') {
    anticoagRec =
      'Unfractionated Heparin (UFH) preferred: IV bolus 80 units/kg followed by continuous infusion at 18 units/kg/hr, titrated to target aPTT 1.5–2.5x control (or anti-Xa 0.3–0.7 IU/mL). UFH allows rapid titration and immediate reversal with Protamine Sulfate in the event of procedural reperfusion or bleeding.';
  } else {
    anticoagRec =
      'LMWH (Enoxaparin 1 mg/kg q12h) or direct oral anticoagulant (DOAC) is first-line, superior to Vitamin K antagonists (Warfarin) with significantly lower intracranial hemorrhage rates.';
  }

  // tPA Dosing Protocol
  let tpaProtocol = '';
  if (plan.selectedStrategy === 'SYSTEMIC_THROMBOLYSIS_FULL_DOSE') {
    tpaProtocol =
      'Full-Dose Systemic Alteplase: 100 mg IV infusion administered continuously over 2 hours. Discontinue therapeutic heparin infusion during tPA run; resume heparin without bolus once aPTT falls below 2x upper limit of normal.';
  } else if (plan.selectedStrategy === 'SYSTEMIC_THROMBOLYSIS_HALF_DOSE') {
    tpaProtocol =
      'Half-Dose ("Safe-Dose") Alteplase (MOPETT Protocol): 50 mg IV total (10 mg initial IV bolus over 1 min + 40 mg infusion over 2 hours). Proven to rapidly reverse pulmonary hypertension and reduce RV strain while reducing major bleeding and intracranial hemorrhage risk (< 0.5%).';
  } else if (plan.selectedStrategy === 'CATHETER_DIRECTED_THROMBOLYSIS_EKOS') {
    tpaProtocol =
      'EKOS Ultrasound-Accelerated Thrombolysis: Bilateral pulmonary artery infusion catheters emit 2.2 MHz acoustic ultrasound waves to unbundle fibrin strands. Low-dose Alteplase infused at 0.5 to 1.0 mg/hr per catheter (total 12 to 24 mg over 12–24 hrs). Low systemic drug levels minimize remote hemorrhagic complications.';
  } else if (plan.selectedStrategy === 'PERCUTANEOUS_MECHANICAL_THROMBECTOMY') {
    tpaProtocol =
      'Mechanical Aspiration Thrombectomy (Inari FlowTriever 20–24 Fr): Dual-aspiration catheter system physically extracts large saddle and lobar emboli without thrombolytics. Clot retrieval mesh deployed and aspirated into filtration canister.';
  } else {
    tpaProtocol =
      'Anticoagulation alone selected. Thrombolytic therapy withheld based on risk-benefit assessment.';
  }

  // Contraindications Warning
  let contraWarning = '';
  if (history.hasMajorBleedingContraindicationToTpa) {
    contraWarning =
      'ABSOLUTE CONTRAINDICATION TO SYSTEMIC THROMBOLYSIS PRESENT: Prior hemorrhagic stroke, active internal bleeding, ischemic stroke within 6 months, or recent major surgery/trauma within 3 weeks. Systemic tPA carries a > 30% risk of fatal hemorrhage. Direct catheter aspiration or surgical embolectomy required!';
  } else {
    contraWarning =
      'No absolute systemic bleeding contraindications identified. Screen for relative contraindications (oral anticoagulants, non-compressible vascular puncture, pregnancy).';
  }

  // Safety Alerts
  const alerts: string[] = [];
  if (hasInstability) {
    alerts.push(
      'HEMODYNAMIC INSTABILITY (MASSIVE PE): Persistent SBP < 90 mmHg, vasopressor requirement, or cardiac arrest indicates acute RV outflow obstruction and impending fatal cardiogenic collapse.'
    );
  }
  if (strain.rvToLvDiameterRatio >= 1.2) {
    alerts.push(
      `SEVERE RV DILATATION (RV/LV Ratio ${strain.rvToLvDiameterRatio} >= 1.2): Acute cor pulmonale with severe interventricular septal flattening (D-sign) compressing left ventricular preload.`
    );
  }
  if (strain.tapseMm < 14) {
    alerts.push(
      `CRITICAL RV SYSTOLIC DEPRESSION (TAPSE ${strain.tapseMm} mm < 14 mm): Severe longitudinal systolic failure of the right ventricle.`
    );
  }
  if (strain.hasMcConnellSign) {
    alerts.push(
      "MCCONNELL'S SIGN PRESENT: Mid-free wall akinesia with hyperdynamic apex is highly specific for acute massive/submassive pulmonary thromboembolism."
    );
  }
  if (spesi >= 2) {
    alerts.push(
      `ELEVATED sPESI SCORE (${spesi} points): Correlates with high 30-day all-cause mortality (${mortalityPct}%). Patient cannot be discharged outpatient.`
    );
  }
  if (history.hasMajorBleedingContraindicationToTpa && plan.selectedStrategy.includes('SYSTEMIC_THROMBOLYSIS')) {
    alerts.push(
      'CRITICAL MEDICATION ERROR WARNING: Systemic tPA selected despite active absolute contraindication! High probability of catastrophic hemorrhagic conversion.'
    );
  }

  return {
    riskCategory: riskCat,
    spesiScore: spesi,
    spesiRiskClass: spesiClass,
    estimated30DayMortalityPct: mortalityPct,
    hasHemodynamicInstability: hasInstability,
    hasRvDysfunction: hasRv,
    hasMyocardialInjury: hasInjury,
    recommendedReperfusionStrategy: reperfusionRec,
    anticoagulationRecommendation: anticoagRec,
    tpaDosingProtocol: tpaProtocol,
    contraindicationWarning: contraWarning,
    clinicalSafetyAlerts: alerts,
  };
}

/**
 * Pre-configured clinical scenarios for simulation
 */
export interface PePreset {
  id: string;
  name: string;
  description: string;
  hemo: PePatientHemodynamics;
  history: PePatientDemographicsAndHistory;
  strain: PeRvStrainAndBiomarkers;
  plan: PeReperfusionPlan;
}

export const PE_PRESETS: PePreset[] = [
  {
    id: 'MASSIVE_PE_CARDIOGENIC_SHOCK',
    name: 'High-Risk Massive PE in Obstructive Cardiogenic Shock',
    description:
      '56-year-old male with sudden dyspnea and collapse. BP 76/50 mmHg for 25 min on Norepinephrine. Echo shows RV/LV 1.5, TAPSE 11 mm, McConnell sign. Immediate systemic Alteplase 100 mg indicated.',
    hemo: {
      systolicBpMmHg: 76,
      diastolicBpMmHg: 50,
      heartRateBpm: 132,
      respiratoryRateBpm: 32,
      oxygenSaturationPct: 84,
      requiresVasopressors: true,
      hasCardiacArrestOrPea: false,
      systolicBpBelow90DurationMinutes: 25,
    },
    history: {
      ageYears: 56,
      isMale: true,
      hasActiveCancer: false,
      hasChronicCardiopulmonaryDisease: false,
      hasAlteredMentalStatus: true,
      temperatureCelsius: 36.6,
      hasMajorBleedingContraindicationToTpa: false,
    },
    strain: {
      rvToLvDiameterRatio: 1.5,
      tapseMm: 11,
      hasMcConnellSign: true,
      hasParadoxicalSeptalShiftDsign: true,
      troponinIngMl: 0.42,
      bnpPgMl: 850,
    },
    plan: {
      selectedStrategy: 'SYSTEMIC_THROMBOLYSIS_FULL_DOSE',
      thrombolysisAdministered: true,
      anticoagulationInitiated: true,
      catheterPositionedBilateral: false,
    },
  },
  {
    id: 'SUBMASSIVE_INTERMEDIATE_HIGH_RISK_EKOS',
    name: 'Intermediate-High Risk Submassive PE (EKOS Candidate)',
    description:
      '64-year-old female, normotensive (BP 118/74 mmHg) but tachycardia (HR 124), RV/LV 1.3, TAPSE 13 mm, and Troponin 0.28 ng/mL. Candidate for EKOS Ultrasound-Accelerated CDT or half-dose tPA.',
    hemo: {
      systolicBpMmHg: 118,
      diastolicBpMmHg: 74,
      heartRateBpm: 124,
      respiratoryRateBpm: 26,
      oxygenSaturationPct: 91,
      requiresVasopressors: false,
      hasCardiacArrestOrPea: false,
      systolicBpBelow90DurationMinutes: 0,
    },
    history: {
      ageYears: 64,
      isMale: false,
      hasActiveCancer: false,
      hasChronicCardiopulmonaryDisease: false,
      hasAlteredMentalStatus: false,
      temperatureCelsius: 37.0,
      hasMajorBleedingContraindicationToTpa: false,
    },
    strain: {
      rvToLvDiameterRatio: 1.3,
      tapseMm: 13,
      hasMcConnellSign: true,
      hasParadoxicalSeptalShiftDsign: true,
      troponinIngMl: 0.28,
      bnpPgMl: 420,
    },
    plan: {
      selectedStrategy: 'CATHETER_DIRECTED_THROMBOLYSIS_EKOS',
      thrombolysisAdministered: true,
      anticoagulationInitiated: true,
      catheterPositionedBilateral: true,
    },
  },
  {
    id: 'MASSIVE_PE_POST_OPERATIVE_CONTRAINDICATED',
    name: 'Post-Op Massive PE (Mechanical Aspiration Thrombectomy)',
    description:
      '72-year-old female post-op day 4 after total hip replacement. Sudden hypotension (BP 82/54), RV strain, absolute contraindication to systemic tPA due to recent surgery. FlowTriever aspiration indicated.',
    hemo: {
      systolicBpMmHg: 82,
      diastolicBpMmHg: 54,
      heartRateBpm: 128,
      respiratoryRateBpm: 30,
      oxygenSaturationPct: 86,
      requiresVasopressors: true,
      hasCardiacArrestOrPea: false,
      systolicBpBelow90DurationMinutes: 20,
    },
    history: {
      ageYears: 72,
      isMale: false,
      hasActiveCancer: false,
      hasChronicCardiopulmonaryDisease: false,
      hasAlteredMentalStatus: true,
      temperatureCelsius: 36.8,
      hasMajorBleedingContraindicationToTpa: true,
    },
    strain: {
      rvToLvDiameterRatio: 1.4,
      tapseMm: 12,
      hasMcConnellSign: true,
      hasParadoxicalSeptalShiftDsign: true,
      troponinIngMl: 0.35,
      bnpPgMl: 680,
    },
    plan: {
      selectedStrategy: 'PERCUTANEOUS_MECHANICAL_THROMBECTOMY',
      thrombolysisAdministered: false,
      anticoagulationInitiated: true,
      catheterPositionedBilateral: false,
    },
  },
  {
    id: 'CARDIAC_ARREST_PEA_PULMONARY_EMBOLISM',
    name: 'PEA Cardiac Arrest & Emergency Bolus Thrombolysis',
    description:
      '50-year-old male with sudden pulseless electrical activity (PEA) arrest. Bedside echo demonstrates massive RV dilatation and leftward septal compression. 50 mg IV Alteplase bolus given during CPR.',
    hemo: {
      systolicBpMmHg: 0,
      diastolicBpMmHg: 0,
      heartRateBpm: 35,
      respiratoryRateBpm: 0,
      oxygenSaturationPct: 60,
      requiresVasopressors: true,
      hasCardiacArrestOrPea: true,
      systolicBpBelow90DurationMinutes: 10,
    },
    history: {
      ageYears: 50,
      isMale: true,
      hasActiveCancer: false,
      hasChronicCardiopulmonaryDisease: false,
      hasAlteredMentalStatus: true,
      temperatureCelsius: 35.8,
      hasMajorBleedingContraindicationToTpa: false,
    },
    strain: {
      rvToLvDiameterRatio: 1.8,
      tapseMm: 8,
      hasMcConnellSign: true,
      hasParadoxicalSeptalShiftDsign: true,
      troponinIngMl: 0.85,
      bnpPgMl: 1200,
    },
    plan: {
      selectedStrategy: 'SYSTEMIC_THROMBOLYSIS_HALF_DOSE',
      thrombolysisAdministered: true,
      anticoagulationInitiated: false,
      catheterPositionedBilateral: false,
    },
  },
  {
    id: 'INTERMEDIATE_LOW_RISK_ANTICOAGULATION',
    name: 'Intermediate-Low Risk PE (Therapeutic LMWH)',
    description:
      '48-year-old male with pleuritic chest pain and segmental PE. BP 128/82, HR 105, normal echo (RV/LV 0.7, TAPSE 21 mm), mildly elevated Troponin (0.06 ng/mL). Managed with therapeutic Enoxaparin.',
    hemo: {
      systolicBpMmHg: 128,
      diastolicBpMmHg: 82,
      heartRateBpm: 105,
      respiratoryRateBpm: 20,
      oxygenSaturationPct: 96,
      requiresVasopressors: false,
      hasCardiacArrestOrPea: false,
      systolicBpBelow90DurationMinutes: 0,
    },
    history: {
      ageYears: 48,
      isMale: true,
      hasActiveCancer: false,
      hasChronicCardiopulmonaryDisease: false,
      hasAlteredMentalStatus: false,
      temperatureCelsius: 37.1,
      hasMajorBleedingContraindicationToTpa: false,
    },
    strain: {
      rvToLvDiameterRatio: 0.7,
      tapseMm: 21,
      hasMcConnellSign: false,
      hasParadoxicalSeptalShiftDsign: false,
      troponinIngMl: 0.06,
      bnpPgMl: 65,
    },
    plan: {
      selectedStrategy: 'ANTICOAGULATION_ALONE_UFH_LMWH_DOAC',
      thrombolysisAdministered: false,
      anticoagulationInitiated: true,
      catheterPositionedBilateral: false,
    },
  },
  {
    id: 'LOW_RISK_OUTPATIENT_DOAC',
    name: 'Low-Risk PE Eligible for Outpatient DOAC Care',
    description:
      '38-year-old female post-flight with subsegmental PE. sPESI 0, BP 122/78, HR 82, normal RV, normal biomarkers. Discharged on oral Apixaban.',
    hemo: {
      systolicBpMmHg: 122,
      diastolicBpMmHg: 78,
      heartRateBpm: 82,
      respiratoryRateBpm: 15,
      oxygenSaturationPct: 99,
      requiresVasopressors: false,
      hasCardiacArrestOrPea: false,
      systolicBpBelow90DurationMinutes: 0,
    },
    history: {
      ageYears: 38,
      isMale: false,
      hasActiveCancer: false,
      hasChronicCardiopulmonaryDisease: false,
      hasAlteredMentalStatus: false,
      temperatureCelsius: 36.7,
      hasMajorBleedingContraindicationToTpa: false,
    },
    strain: {
      rvToLvDiameterRatio: 0.6,
      tapseMm: 24,
      hasMcConnellSign: false,
      hasParadoxicalSeptalShiftDsign: false,
      troponinIngMl: 0.01,
      bnpPgMl: 30,
    },
    plan: {
      selectedStrategy: 'ANTICOAGULATION_ALONE_UFH_LMWH_DOAC',
      thrombolysisAdministered: false,
      anticoagulationInitiated: true,
      catheterPositionedBilateral: false,
    },
  },
  {
    id: 'HALF_DOSE_MOPETT_PROTOCOL',
    name: 'Safe-Dose Systemic Alteplase (MOPETT 50 mg Protocol)',
    description:
      '60-year-old male with submassive PE and moderate bleeding risk. Treated with 50 mg IV Alteplase (10 mg bolus + 40 mg over 2 hours) to avoid intracranial hemorrhage.',
    hemo: {
      systolicBpMmHg: 104,
      diastolicBpMmHg: 68,
      heartRateBpm: 118,
      respiratoryRateBpm: 24,
      oxygenSaturationPct: 92,
      requiresVasopressors: false,
      hasCardiacArrestOrPea: false,
      systolicBpBelow90DurationMinutes: 0,
    },
    history: {
      ageYears: 60,
      isMale: true,
      hasActiveCancer: false,
      hasChronicCardiopulmonaryDisease: true,
      hasAlteredMentalStatus: false,
      temperatureCelsius: 36.9,
      hasMajorBleedingContraindicationToTpa: false,
    },
    strain: {
      rvToLvDiameterRatio: 1.25,
      tapseMm: 14,
      hasMcConnellSign: true,
      hasParadoxicalSeptalShiftDsign: true,
      troponinIngMl: 0.18,
      bnpPgMl: 380,
    },
    plan: {
      selectedStrategy: 'SYSTEMIC_THROMBOLYSIS_HALF_DOSE',
      thrombolysisAdministered: true,
      anticoagulationInitiated: true,
      catheterPositionedBilateral: false,
    },
  },
  {
    id: 'SURGICAL_EMBOLECTOMY_REFRACTORY_SHOCK',
    name: 'Refractory Shock & Surgical Pulmonary Embolectomy',
    description:
      '44-year-old male with saddle embolus in refractory shock despite vasopressors. Clot burden extending into main PA branches. Mobilized to OR for sternotomy and CPB clot extraction.',
    hemo: {
      systolicBpMmHg: 72,
      diastolicBpMmHg: 46,
      heartRateBpm: 140,
      respiratoryRateBpm: 34,
      oxygenSaturationPct: 82,
      requiresVasopressors: true,
      hasCardiacArrestOrPea: false,
      systolicBpBelow90DurationMinutes: 45,
    },
    history: {
      ageYears: 44,
      isMale: true,
      hasActiveCancer: false,
      hasChronicCardiopulmonaryDisease: false,
      hasAlteredMentalStatus: true,
      temperatureCelsius: 36.2,
      hasMajorBleedingContraindicationToTpa: false,
    },
    strain: {
      rvToLvDiameterRatio: 1.6,
      tapseMm: 9,
      hasMcConnellSign: true,
      hasParadoxicalSeptalShiftDsign: true,
      troponinIngMl: 0.55,
      bnpPgMl: 980,
    },
    plan: {
      selectedStrategy: 'SURGICAL_PULMONARY_EMBOLECTOMY',
      thrombolysisAdministered: false,
      anticoagulationInitiated: true,
      catheterPositionedBilateral: false,
    },
  },
];
