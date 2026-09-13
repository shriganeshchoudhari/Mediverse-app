/**
 * DicSepsisCoagulopathyEngine.ts
 * Biophysical & Diagnostic Engine for Disseminated Intravascular Coagulation (DIC),
 * Sepsis-Induced Coagulopathy (SIC), Consumption Coagulopathy Kinetics & Component Dosing.
 *
 * References:
 * - Taylor FB Jr, Toh CH, Hoots WK, et al. Towards definition, clinical and laboratory
 *   criteria, and a scoring system for disseminated intravascular coagulation.
 *   Thromb Haemost. 2001;86(5):1327-1330.
 * - Iba T, Nisio MD, Levy JH, et al. New criteria for sepsis-induced coagulopathy (SIC)
 *   following the update of the sepsis-3 definition. BMJ Open. 2017;7(9):e017622.
 * - Levi M, Scully M. How I treat disseminated intravascular coagulation. Blood. 2018;131(8):845-854.
 * - Wada H, Matsumoto T, Yamashita Y. Diagnosis and treatment of disseminated intravascular
 *   coagulation (DIC) according to four primary guidelines. J Intensive Care. 2014;2(1):15.
 */

export interface IsthScoreBreakdown {
  plateletScore: number; // 0, 1, 2
  fibrinMarkerScore: number; // 0, 2, 3 (D-dimer / FDP)
  ptProlongationScore: number; // 0, 1, 2 (seconds over control)
  fibrinogenScore: number; // 0, 1 (< 100 mg/dL)
  totalScore: number; // 0 - 8
  isOvertDic: boolean; // >= 5
  interpretation: string;
  repeatIntervalHours: number;
}

export interface SicScoreBreakdown {
  sofaScore: number; // 0, 1, 2 (cardiovascular + respiratory)
  plateletScore: number; // 0, 1, 2
  inrScore: number; // 0, 1, 2
  totalScore: number; // 0 - 6
  isSicPositive: boolean; // >= 4 with hemostatic components >= 2
  interpretation: string;
}

export interface HemostaticState {
  plateletsKPerUl: number; // e.g. 45 (45,000/uL)
  fibrinogenMgDl: number; // e.g. 80 mg/dL
  ptSeconds: number; // e.g. 21s (control ~ 12s)
  inr: number; // e.g. 1.8
  dDimerNgMlFeu: number; // e.g. 8500 ng/mL
  dDimerNgMl?: number; // alias
  antithrombinIiiPercent: number; // 20 - 120% (normal 80-120)
  proteinCPercent: number; // 20 - 120%
}

export interface ReplacementDosingAdvice {
  plateletsUnitsRecommended: number; // apheresis pools
  plateletRationale: string;
  cryoprecipitateUnitsRecommended: number; // 10-unit pools
  fibrinogenConcentrateGramsRecommended: number; // grams
  fibrinogenRationale: string;
  ffpVolumeMlRecommended: number; // mL
  ffpRationale: string;
  antifibrinolyticsContraindicated: boolean;
  txaSafetyWarning: string;
}

export interface MicrovascularThrombosisReport {
  thrombosisRiskLevel: 'Low' | 'Moderate' | 'High' | 'Critical';
  bleedingRiskLevel: 'Low' | 'Moderate' | 'High' | 'Critical';
  primaryPhenotype: 'Fibrinolytic (Bleeding)' | 'Procoagulant (Organ Failure)' | 'Mixed Massive Consumption';
  targetOrganInjuryAlerts: string[];
  clinicalRecommendations: string[];
}

export interface DicScenario {
  id: string;
  name: string;
  underlyingCondition: string;
  patientProfile: string;
  weightKg: number;
  initialLabs: HemostaticState;
  sofaNonHematologic: number; // 0, 1, 2
  activeBleeding: boolean;
  plannedInvasiveProcedure: boolean;
  clinicalPearls: string[];
}

/**
 * 1. Calculate ISTH Overt DIC Diagnostic Score
 * Validated by Taylor et al. (2001) / SSC of ISTH:
 * - Platelet count: > 100k = 0, 50-100k = 1, < 50k = 2
 * - Fibrin-related marker (D-Dimer FEU): Normal (<500) = 0, Moderate (500-4000) = 2, Strong (>4000) = 3
 * - PT prolongation (seconds above control): < 3s = 0, 3 - 6s = 1, > 6s = 2
 * - Fibrinogen level: > 100 mg/dL (1.0 g/L) = 0, < 100 mg/dL = 1
 */
export function calculateIsthScore(
  plateletsK: number,
  dDimerNgMl: number,
  ptProlongationSeconds: number,
  fibrinogenMgDl: number
): IsthScoreBreakdown {
  // Platelets
  let plateletScore = 0;
  if (plateletsK < 50) plateletScore = 2;
  else if (plateletsK <= 100) plateletScore = 1;

  // D-Dimer / Fibrin Marker
  let fibrinMarkerScore = 0;
  if (dDimerNgMl > 4000) fibrinMarkerScore = 3;
  else if (dDimerNgMl >= 1000) fibrinMarkerScore = 2;

  // PT Prolongation
  let ptProlongationScore = 0;
  if (ptProlongationSeconds > 6) ptProlongationScore = 2;
  else if (ptProlongationSeconds >= 3) ptProlongationScore = 1;

  // Fibrinogen
  let fibrinogenScore = 0;
  if (fibrinogenMgDl < 100) fibrinogenScore = 1;

  const totalScore = plateletScore + fibrinMarkerScore + ptProlongationScore + fibrinogenScore;
  const isOvertDic = totalScore >= 5;

  let interpretation = '';
  let repeatIntervalHours = 24;

  if (isOvertDic) {
    interpretation = `ISTH Score ${totalScore}/8: Compatible with Overt DIC. High mortality risk from simultaneous microthrombosis and consumptive hemorrhage.`;
    repeatIntervalHours = 12;
  } else {
    interpretation = `ISTH Score ${totalScore}/8: Non-Overt DIC (pre-DIC). Dynamic hemostatic activation present without full system exhaustion.`;
    repeatIntervalHours = 24;
  }

  return {
    plateletScore,
    fibrinMarkerScore,
    ptProlongationScore,
    fibrinogenScore,
    totalScore,
    isOvertDic,
    interpretation,
    repeatIntervalHours,
  };
}

/**
 * 2. Calculate Sepsis-Induced Coagulopathy (SIC) Score
 * Validated by Iba et al. (2016/2019):
 * - SOFA cardiorespiratory (0, 1, 2)
 * - Platelet count: >= 150k = 0, 100-150k = 1, < 100k = 2
 * - PT-INR: <= 1.2 = 0, 1.2 - 1.4 = 1, > 1.4 = 2
 * SIC diagnosed if total >= 4 AND sum of (platelets + INR) >= 2.
 */
export function calculateSicScore(
  sofaNonHematologic: number,
  plateletsK: number,
  inr: number
): SicScoreBreakdown {
  const clampedSofa = Math.min(2, Math.max(0, sofaNonHematologic));

  let plateletScore = 0;
  if (plateletsK < 100) plateletScore = 2;
  else if (plateletsK < 150) plateletScore = 1;

  let inrScore = 0;
  if (inr > 1.4) inrScore = 2;
  else if (inr >= 1.2) inrScore = 1;

  const totalScore = clampedSofa + plateletScore + inrScore;
  const hemostaticSum = plateletScore + inrScore;
  const isSicPositive = totalScore >= 4 && hemostaticSum >= 2;

  let interpretation = '';
  if (isSicPositive) {
    interpretation = `SIC Score ${totalScore}/6 (Positive): Early sepsis-induced microvascular coagulopathy confirmed. High benefit from anticoagulation or source control.`;
  } else {
    interpretation = `SIC Score ${totalScore}/6 (Negative): Hemostatic activation does not meet threshold for Sepsis-Induced Coagulopathy.`;
  }

  return {
    sofaScore: clampedSofa,
    plateletScore,
    inrScore,
    totalScore,
    isSicPositive,
    interpretation,
  };
}

/**
 * 3. Component Replacement Calculator & Safety Audit
 * Follows British Society for Haematology (BSH) and ISTH DIC guidelines:
 * - Platelet transfusion targets: >= 50k in active bleeding or pre-procedure; >= 20k if high bleeding risk without bleeding; >= 10k prophylactic.
 * - Cryoprecipitate / Fibrinogen Concentrate: Target fibrinogen >= 150 mg/dL if bleeding.
 *   Dose (g) = (Target - Current [mg/dL]) * Plasma Volume (dL) / 100
 * - FFP: 15-25 mL/kg for INR > 1.5 with active bleeding or high-risk procedure.
 * - Antifibrinolytics (TXA) Black Box Warning: strictly contraindicated in procoagulant DIC!
 */
export function calculateReplacementDosing(
  state: HemostaticState,
  patientWeightKg: number,
  activeBleeding: boolean,
  plannedInvasiveProcedure: boolean,
  isAclOrHyperfibrinolytic: boolean = false
): ReplacementDosingAdvice {
  const { plateletsKPerUl, fibrinogenMgDl, inr } = state;

  // Estimated plasma volume in dL (Weight * 70 mL/kg * (1 - Hct 0.35) / 100)
  const plasmaVolumeDl = (patientWeightKg * 70 * 0.65) / 100;

  // 1. Platelet Dosing
  let plateletsUnitsRecommended = 0;
  let plateletRationale = '';
  const needsPlatelets = activeBleeding || plannedInvasiveProcedure;

  if (needsPlatelets) {
    if (plateletsKPerUl < 50) {
      plateletsUnitsRecommended = plateletsKPerUl < 25 ? 2 : 1;
      plateletRationale = `Target >= 50,000/uL for active hemorrhage or invasive procedure. Current ${plateletsKPerUl}k requires ${plateletsUnitsRecommended} adult apheresis unit(s).`;
    } else {
      plateletRationale = `Platelet count ${plateletsKPerUl}k meets the >= 50,000/uL threshold. No transfusion required.`;
    }
  } else {
    if (plateletsKPerUl < 10) {
      plateletsUnitsRecommended = 1;
      plateletRationale = `Prophylactic transfusion indicated for extreme thrombocytopenia (< 10,000/uL) to prevent spontaneous CNS hemorrhage.`;
    } else {
      plateletRationale = `No active bleeding. Transfusion not indicated for platelet count > 10,000-20,000/uL in non-bleeding DIC.`;
    }
  }

  // 2. Cryoprecipitate / Fibrinogen Concentrate Dosing
  let cryoprecipitateUnitsRecommended = 0;
  let fibrinogenConcentrateGramsRecommended = 0;
  let fibrinogenRationale = '';

  const targetFibrinogenMgDl = 150;
  if ((activeBleeding || plannedInvasiveProcedure) && fibrinogenMgDl < targetFibrinogenMgDl) {
    const deficitMgDl = targetFibrinogenMgDl - fibrinogenMgDl;
    // Fibrinogen dose (g) = deficit (mg/dL) * plasma volume (dL) / 1000 mg/g
    const rawGrams = (deficitMgDl * plasmaVolumeDl) / 1000;
    fibrinogenConcentrateGramsRecommended = Math.round(rawGrams * 10) / 10;
    // 1 standard cryo unit ~ 0.25 g fibrinogen (10-unit pool ~ 2.5 g)
    const rawCryoPools = Math.ceil(fibrinogenConcentrateGramsRecommended / 2.5);
    cryoprecipitateUnitsRecommended = rawCryoPools * 10;

    fibrinogenRationale = `Severe hypofibrinogenemia (${fibrinogenMgDl} mg/dL). Target >= 150 mg/dL requires ~${fibrinogenConcentrateGramsRecommended} g fibrinogen concentrate OR ${cryoprecipitateUnitsRecommended} units of Cryoprecipitate.`;
  } else {
    fibrinogenRationale =
      fibrinogenMgDl >= 150
        ? `Fibrinogen level ${fibrinogenMgDl} mg/dL is adequate (>= 150 mg/dL).`
        : `Fibrinogen is low (${fibrinogenMgDl} mg/dL) but no active bleeding or planned procedure; reserve fibrinogen replacement for hemorrhage.`;
  }

  // 3. FFP Dosing
  let ffpVolumeMlRecommended = 0;
  let ffpRationale = '';

  if ((activeBleeding || plannedInvasiveProcedure) && inr > 1.5) {
    // 15 mL/kg standard dosing
    ffpVolumeMlRecommended = Math.round((patientWeightKg * 15) / 50) * 50;
    ffpRationale = `Prolonged INR (${inr}). Infuse 15 mL/kg (${ffpVolumeMlRecommended} mL FFP) to restore multiple factor deficiencies. Monitor for TACO volume overload.`;
  } else {
    ffpRationale =
      inr <= 1.5
        ? `INR ${inr} is within acceptable limits for hemostasis.`
        : `Elevated INR (${inr}) without active bleeding; FFP is NOT recommended solely to correct lab numbers due to transfusion volume overload risk.`;
  }

  // 4. Antifibrinolytic (TXA) Safety Warning
  const antifibrinolyticsContraindicated = !isAclOrHyperfibrinolytic;
  let txaSafetyWarning = '';
  if (antifibrinolyticsContraindicated) {
    txaSafetyWarning =
      'CONTRAINDICATED: In standard septic/procoagulant DIC, administering Tranexamic Acid (TXA) or aminocaproic acid halts protective secondary fibrinolysis, precipitating widespread fatal microvascular thrombosis and bilateral renal cortical necrosis!';
  } else {
    txaSafetyWarning =
      'PERMITTED WITH CAUTION: In hyperfibrinolytic DIC (e.g. Acute Promyelocytic Leukemia or severe trauma/amniotic fluid embolism with primary fibrinolysis), TXA may be co-administered alongside platelet and fibrinogen support.';
  }

  return {
    plateletsUnitsRecommended,
    plateletRationale,
    cryoprecipitateUnitsRecommended,
    fibrinogenConcentrateGramsRecommended,
    fibrinogenRationale,
    ffpVolumeMlRecommended,
    ffpRationale,
    antifibrinolyticsContraindicated,
    txaSafetyWarning,
  };
}

/**
 * 4. Microvascular Thrombosis & End-Organ Damage Classifier
 */
export function evaluateMicrovascularInjury(
  state: HemostaticState,
  isOvert: boolean,
  activeBleeding: boolean
): MicrovascularThrombosisReport {
  const { plateletsKPerUl, fibrinogenMgDl, antithrombinIiiPercent } = state;
  const dDimerNgMl = state.dDimerNgMlFeu ?? state.dDimerNgMl ?? 0;

  let thrombosisRiskLevel: 'Low' | 'Moderate' | 'High' | 'Critical' = 'Low';
  let bleedingRiskLevel: 'Low' | 'Moderate' | 'High' | 'Critical' = 'Low';

  // Thrombosis driven by D-dimer surge and antithrombin consumption:
  if (dDimerNgMl > 6000 && antithrombinIiiPercent < 50) {
    thrombosisRiskLevel = 'Critical';
  } else if (dDimerNgMl > 3000 || antithrombinIiiPercent < 65) {
    thrombosisRiskLevel = 'High';
  } else if (dDimerNgMl > 1000) {
    thrombosisRiskLevel = 'Moderate';
  }

  // Bleeding driven by thrombocytopenia and hypofibrinogenemia:
  if (plateletsKPerUl < 30 || fibrinogenMgDl < 70 || activeBleeding) {
    bleedingRiskLevel = 'Critical';
  } else if (plateletsKPerUl < 60 || fibrinogenMgDl < 120) {
    bleedingRiskLevel = 'High';
  } else if (plateletsKPerUl < 100) {
    bleedingRiskLevel = 'Moderate';
  }

  let primaryPhenotype: 'Fibrinolytic (Bleeding)' | 'Procoagulant (Organ Failure)' | 'Mixed Massive Consumption' =
    'Mixed Massive Consumption';

  if (bleedingRiskLevel === 'Critical' && thrombosisRiskLevel !== 'Critical') {
    primaryPhenotype = 'Fibrinolytic (Bleeding)';
  } else if (thrombosisRiskLevel === 'Critical' && !activeBleeding && plateletsKPerUl >= 50) {
    primaryPhenotype = 'Procoagulant (Organ Failure)';
  }

  const targetOrganInjuryAlerts: string[] = [];
  if (thrombosisRiskLevel === 'Critical' || thrombosisRiskLevel === 'High') {
    targetOrganInjuryAlerts.push('Renal: Microvascular glomerular capillary fibrin thrombi risking oliguric Acute Kidney Injury (AKI).');
    targetOrganInjuryAlerts.push('Dermatologic: Symmetrical peripheral gangrene / Purpura Fulminans skin necrosis.');
    targetOrganInjuryAlerts.push('Pulmonary: Pulmonary microvascular occlusion compounding ARDS hypoxemic shunt.');
    targetOrganInjuryAlerts.push('Hepatic: Sinusoidal thrombosis elevating transaminases and exacerbating clotting factor synthesis failure.');
  }

  const clinicalRecommendations: string[] = [
    'Primary Mandate: Aggressive treatment and resolution of underlying etiology (source control, broad antibiotics, surgical debridement, delivery of placenta).',
    'Hemostatic Support: Transfuse blood components selectively for active bleeding or imminent invasive procedures, NOT to normalize numbers.',
    antithrombinIiiPercent < 60
      ? 'Antithrombin III Consumption: Severe AT depletion (< 60%). In refractory thrombosis or heparin resistance, consider Antithrombin concentrate.'
      : 'Maintain standard venous thromboembolism (VTE) prophylaxis with LMWH/UFH once active bleeding is controlled.',
  ];

  return {
    thrombosisRiskLevel,
    bleedingRiskLevel,
    primaryPhenotype,
    targetOrganInjuryAlerts,
    clinicalRecommendations,
  };
}

/**
 * 5. Clinical Scenarios Catalog
 */
export const DIC_SCENARIOS: Record<string, DicScenario> = {
  septic_shock_purpura: {
    id: 'septic_shock_purpura',
    name: '1. Septic Shock & Purpura Fulminans (Procoagulant Overt DIC)',
    underlyingCondition: 'Meningococcemia / Gram-Negative Septic Shock',
    patientProfile: '38yo female with fulminant septic shock, retiform purpura on extremities, oliguria, and diffuse petechiae.',
    weightKg: 70,
    initialLabs: {
      plateletsKPerUl: 28,
      fibrinogenMgDl: 65,
      ptSeconds: 23,
      inr: 2.1,
      dDimerNgMlFeu: 14500,
      antithrombinIiiPercent: 32,
      proteinCPercent: 24,
    },
    sofaNonHematologic: 2,
    activeBleeding: true,
    plannedInvasiveProcedure: false,
    clinicalPearls: [
      'Profound loss of natural anticoagulants (Protein C and Antithrombin) drives microvascular thrombosis (purpura fulminans).',
      'ISTH score 8/8 indicates catastrophic overt DIC; prioritize source control, hemodynamic vasopressors, cryoprecipitate and platelets.',
      'Tranexamic Acid is strictly contraindicated due to risk of complete renal cortical necrosis.',
    ],
  },
  placental_abruption: {
    id: 'placental_abruption',
    name: '2. Placental Abruption (Hyperacute Obstetric DIC)',
    underlyingCondition: 'Severe Concealed Abruptio Placentae',
    patientProfile: '29yo G2P1 at 36 weeks gestation with woody tense abdomen, profound vaginal bleeding, and fetal bradycardia.',
    weightKg: 78,
    initialLabs: {
      plateletsKPerUl: 62,
      fibrinogenMgDl: 42,
      ptSeconds: 19,
      inr: 1.7,
      dDimerNgMlFeu: 9800,
      antithrombinIiiPercent: 68,
      proteinCPercent: 72,
    },
    sofaNonHematologic: 1,
    activeBleeding: true,
    plannedInvasiveProcedure: true, // Emergency Cesarean delivery
    clinicalPearls: [
      'Trophoblastic tissue factor floods maternal circulation, triggering hyperacute consumption of fibrinogen.',
      'Normal term pregnancy fibrinogen is 400-600 mg/dL; a fibrinogen < 200 mg/dL is already critically abnormal in pregnancy.',
      'Immediate delivery of fetus and placenta is the definitive cure; rapidly infuse cryoprecipitate or fibrinogen concentrate.',
    ],
  },
  apl_hyperfibrinolysis: {
    id: 'apl_hyperfibrinolysis',
    name: '3. Acute Promyelocytic Leukemia (APL / Hyperfibrinolytic Phenotype)',
    underlyingCondition: 'Newly Diagnosed APML (t(15;17) PML-RARA)',
    patientProfile: '44yo male with gingival bleeding, epistaxis, and extensive ecchymoses on trunk.',
    weightKg: 82,
    initialLabs: {
      plateletsKPerUl: 22,
      fibrinogenMgDl: 85,
      ptSeconds: 17,
      inr: 1.5,
      dDimerNgMlFeu: 18000,
      antithrombinIiiPercent: 82,
      proteinCPercent: 88,
    },
    sofaNonHematologic: 0,
    activeBleeding: true,
    plannedInvasiveProcedure: false,
    clinicalPearls: [
      'Leukemic promyelocytes express excessive Annexin II and tissue factor, triggering simultaneous massive thrombin generation and rampant primary hyperfibrinolysis.',
      'Immediate administration of All-Trans Retinoic Acid (ATRA) initiates promyelocyte differentiation and terminates the procoagulant stimulus.',
      'Maintain platelet count > 30,000-50,000/uL and fibrinogen > 150 mg/dL aggressively during the first week to prevent fatal intracranial hemorrhage.',
    ],
  },
  early_sic_responder: {
    id: 'early_sic_responder',
    name: '4. Early Sepsis-Induced Coagulopathy (SIC Pre-Overt DIC)',
    underlyingCondition: 'Bacterial Lobar Pneumonia with Sepsis',
    patientProfile: '66yo male with right lower lobe pneumonia, fever 39.1°C, BP 92/58 mmHg responsive to 30 mL/kg crystalloids, no active bleeding.',
    weightKg: 74,
    initialLabs: {
      plateletsKPerUl: 118,
      fibrinogenMgDl: 340,
      ptSeconds: 15.2,
      inr: 1.35,
      dDimerNgMlFeu: 2800,
      antithrombinIiiPercent: 70,
      proteinCPercent: 65,
    },
    sofaNonHematologic: 2, // Respiratory and cardiovascular
    activeBleeding: false,
    plannedInvasiveProcedure: false,
    clinicalPearls: [
      'Meets criteria for SIC (Score 4/6: SOFA 2, Platelets 1, INR 1) before meeting Overt DIC criteria (ISTH score 3/8, non-overt).',
      'High fibrinogen (340 mg/dL) acts as an acute phase reactant, masking ongoing consumption.',
      'Early targeted antibiotic therapy and fluid resuscitation prevent transition from SIC to lethal overt DIC.',
    ],
  },
};
