/**
 * PheochromocytomaEngine.ts
 * Endocrinology, Anesthesiology & Critical Care Simulation Engine:
 * Pheochromocytoma & Paraganglioma (PPGL) Hypertensive Crisis & Alpha-Blockade:
 * - Biochemical Diagnosis: Plasma Free Metanephrines & Urinary Fractionated Metanephrines
 * - The Alpha-Blocker First Rule: Avoidance of Unopposed Alpha-1 Vasoconstriction Disaster
 * - Roizen Criteria for Adequate Preoperative Optimization (BP, Orthostasis, Volume Expansion)
 * - Intraoperative Biphasic Hemodynamics: Catecholamine Storm (Tumor Manipulation) vs Vasodilatory Collapse (Post-Ligation)
 * - Pharmacotherapy: Phenoxybenzamine vs Doxazosin, Phentolamine Rescue, Nicardipine, Esmolol, and Volume Resuscitation
 * - Genetic Syndromes: MEN 2A/2B (RET), VHL, NF1, SDHB/SDHD Paraganglioma
 */

export type AlphaBlockerChoice =
  | 'NONE'
  | 'PHENOXYBENZAMINE'            // Non-selective irreversible alpha-1/alpha-2 blocker (10-80 mg/day)
  | 'DOXAZOSIN'                   // Selective competitive alpha-1 blocker (2-16 mg/day)
  | 'BETA_BLOCKER_ALONE_HAZARD';  // LETHAL PITFALL: Beta-blocker without prior alpha-blockade causes unopposed alpha crisis!

export type BetaBlockerAdjunct =
  | 'NONE'
  | 'METOPROLOL_ORAL'             // Cardioselective beta-1 blocker (added only after alpha blockade)
  | 'PROPRANOLOL_ORAL'            // Non-selective beta-blocker
  | 'ESMOLOL_IV_INFUSION';        // Ultra-short acting IV infusion for intraoperative tachyarrhythmias

export type IntraoperativePhase =
  | 'PRE_INDUCTION_BASELINE'      // Preoperative preparation state
  | 'TUMOR_MANIPULATION_STORM'    // Massive catecholamine release -> extreme hypertensive crisis
  | 'POST_VEIN_LIGATION_COLLAPSE';// Sudden withdrawal of catecholamines -> vasodilatory shock

export type EmergencyVasodilator =
  | 'NONE'
  | 'PHENTOLAMINE_IV_BOLUS'       // Short-acting competitive alpha-antagonist (2.5-5 mg IV bolus)
  | 'NICARDIPINE_IV_INFUSION'     // Dihydropyridine CCB arterial vasodilator
  | 'NITROPRUSSIDE_IV';           // Direct NO donor

export interface PheoPatientParams {
  // Biochemical & Tumor Characteristics
  plasmaFreeNormetanephrinePgMl: number; // Normal < 148 pg/mL (PPGL > 400-4000+)
  plasmaFreeMetanephrinePgMl: number;     // Normal < 57 pg/mL (Adrenal Pheo > 200-2000+)
  tumorDiameterCm: number;                // 1.5 to 15.0 cm
  geneticSyndrome: 'SPORADIC' | 'MEN_2A' | 'MEN_2B' | 'VHL' | 'NF1' | 'SDHB_SDHD';

  // Hemodynamics
  heartRateBpm: number;                   // 50 to 180 bpm
  sbpMmHg: number;                        // 70 to 300 mmHg
  dbpMmHg: number;                        // 40 to 160 mmHg
  standingSbpDropMmHg: number;            // Orthostatic drop (Target 10-20 mmHg in Roizen criteria)

  // Preoperative Optimization & Pharmacology
  alphaBlocker: AlphaBlockerChoice;
  daysOfAlphaBlockade: number;            // Target >= 10-14 days
  betaBlocker: BetaBlockerAdjunct;
  betaBlockerStartedBeforeAlpha: boolean; // THE UNOPPOSED ALPHA DISASTER!
  highSaltDietAndHydrationGiven: boolean; // Volume expansion to restore contracted intravascular volume

  // Intraoperative Management
  intraopPhase: IntraoperativePhase;
  emergencyVasodilator: EmergencyVasodilator;
  ivFluidBolusAdministeredMl: number;     // Crystalloid/Albumin boluses for post-ligation collapse
  norepinephrineInfusionActive: boolean;  // Vasopressor rescue post-ligation
}

export interface PheoSimulationResult {
  meanArterialPressureMmHg: number;
  pulsePressureMmHg: number;
  systemicVascularResistanceDyns: number;  // SVR estimate (Normal 800-1200 dynes)
  roizenCriteriaMet: boolean;
  hasUnopposedAlphaDisaster: boolean;
  isHypertensiveEmergency: boolean;
  isVasodilatoryShock: boolean;
  predictedInHospitalComplicationRatePercent: number;
  resuscitationSafetyScore: number;       // 0 to 100
  clinicalStatusBadge: {
    status: 'STABLE' | 'WARNING' | 'CRITICAL' | 'LETHAL_EMERGENCY';
    label: string;
    color: string;
  };
  criticalAlerts: string[];
  physiologicMechanisms: string[];
  stepByStepActionPlan: string[];
}

/**
 * Calculates SVR and checks Roizen Preoperative Criteria
 */
export function evaluateRoizenCriteria(params: PheoPatientParams) {
  const map = Math.round((params.sbpMmHg + 2 * params.dbpMmHg) / 3);
  const pulsePressure = params.sbpMmHg - params.dbpMmHg;

  // Roizen Criteria:
  // 1. In-hospital BP < 130/80 mmHg supine
  // 2. Orthostatic hypotension present (standing SBP drops > 10 mmHg, but standing SBP > 90 mmHg)
  // 3. Days of alpha-blockade >= 10-14 days
  // 4. Adequate intravascular volume expansion (high salt diet & hydration)
  const bpTargetMet = params.sbpMmHg < 130 && params.dbpMmHg < 80;
  const orthostasisMet = params.standingSbpDropMmHg >= 10 && (params.sbpMmHg - params.standingSbpDropMmHg) >= 90;
  const durationMet = params.daysOfAlphaBlockade >= 10;
  const volumeMet = params.highSaltDietAndHydrationGiven;

  const roizenCriteriaMet = bpTargetMet && orthostasisMet && durationMet && volumeMet;

  // Approximate SVR
  let svr = 1000; // baseline
  if (params.intraopPhase === 'TUMOR_MANIPULATION_STORM') {
    svr = 2400;
  } else if (params.intraopPhase === 'POST_VEIN_LIGATION_COLLAPSE') {
    svr = 500;
  } else {
    svr = 1100 + (params.sbpMmHg - 120) * 10;
  }

  // Effect of alpha blockers on SVR
  if (params.alphaBlocker === 'PHENOXYBENZAMINE' || params.alphaBlocker === 'DOXAZOSIN') {
    svr -= 350;
  }

  // Unopposed alpha disaster surges SVR
  if (params.betaBlockerStartedBeforeAlpha || params.alphaBlocker === 'BETA_BLOCKER_ALONE_HAZARD') {
    svr += 900;
  }

  // Vasodilators
  if (params.emergencyVasodilator === 'PHENTOLAMINE_IV_BOLUS' || params.emergencyVasodilator === 'NITROPRUSSIDE_IV') {
    svr -= 500;
  } else if (params.emergencyVasodilator === 'NICARDIPINE_IV_INFUSION') {
    svr -= 400;
  }

  svr = Math.max(350, Math.min(3500, svr));

  return { map, pulsePressure, svr, roizenCriteriaMet };
}

/**
 * Core simulation calculation for Pheochromocytoma & Paraganglioma Crisis
 */
export function simulatePheochromocytoma(params: PheoPatientParams): PheoSimulationResult {
  const { map, pulsePressure, svr, roizenCriteriaMet } = evaluateRoizenCriteria(params);

  const criticalAlerts: string[] = [];
  const physiologicMechanisms: string[] = [];
  const stepByStepActionPlan: string[] = [];

  // 1. The Unopposed Alpha-1 Vasoconstriction Disaster Check
  const hasUnopposedAlphaDisaster =
    params.betaBlockerStartedBeforeAlpha ||
    params.alphaBlocker === 'BETA_BLOCKER_ALONE_HAZARD' ||
    (params.alphaBlocker === 'NONE' && params.betaBlocker !== 'NONE');

  if (hasUnopposedAlphaDisaster) {
    criticalAlerts.push(
      `THE UNOPPOSED ALPHA DISASTER: Beta-blocker administered BEFORE establishing adequate alpha-blockade! Blocking beta-2 mediated skeletal vasodilation unleashes unopposed alpha-1 vasoconstriction, precipitating malignant hypertensive crisis (SBP ${params.sbpMmHg} mmHg, SVR ${svr} dynes), acute pulmonary edema, hypertensive encephalopathy, aortic dissection, or cardiac arrest!`
    );
  }

  // 2. Intraoperative Phase Checks
  const isHypertensiveEmergency = params.sbpMmHg >= 180 || params.dbpMmHg >= 120;
  const isVasodilatoryShock = params.sbpMmHg < 90 || map < 65;

  if (params.intraopPhase === 'TUMOR_MANIPULATION_STORM') {
    criticalAlerts.push(
      `INTRAOPERATIVE CATECHOLAMINE STORM: Surgical manipulation of tumor spilling massive catecholamines into circulation. SBP surges to ${params.sbpMmHg} mmHg. Administer rapid IV Phentolamine boluses (2.5-5 mg) or titrate Nicardipine/Clevidipine infusion.`
    );
    physiologicMechanisms.push(
      `Mechanical compression of chromaffin tissue triggers exocytosis of stored norepinephrine and epinephrine granules, causing severe systemic vasoconstriction and ventricular ectopy.`
    );
  } else if (params.intraopPhase === 'POST_VEIN_LIGATION_COLLAPSE') {
    if (params.ivFluidBolusAdministeredMl < 1000 && !params.norepinephrineInfusionActive) {
      criticalAlerts.push(
        `POST-LIGATION VASODILATORY COLLAPSE: Ligation of tumor venous outflow causes abrupt withdrawal of circulating catecholamines against down-regulated adrenergic receptors and a contracted intravascular volume. Severe vasodilatory shock (MAP ${map} mmHg). Immediate aggressive volume resuscitation and Norepinephrine/Vasopressin required!`
      );
    } else {
      physiologicMechanisms.push(
        `Post-ligation hypotension countered with aggressive volume expansion (${params.ivFluidBolusAdministeredMl} mL) and vasopressor support, restoring venous return and end-organ perfusion.`
      );
    }
  }

  // 3. Preoperative Optimization Mechanisms
  if (params.alphaBlocker === 'PHENOXYBENZAMINE') {
    physiologicMechanisms.push(
      `Phenoxybenzamine provides irreversible covalent non-competitive alpha-1 and alpha-2 receptor blockade, blunting intraoperative hypertensive surges and allowing intravascular volume re-expansion.`
    );
  } else if (params.alphaBlocker === 'DOXAZOSIN') {
    physiologicMechanisms.push(
      `Doxazosin provides selective competitive alpha-1 blockade with lower incidence of reflex tachycardia and shorter duration of postoperative hypotension.`
    );
  }

  if (params.highSaltDietAndHydrationGiven) {
    physiologicMechanisms.push(
      `Preoperative sodium and fluid expansion counteracts chronic catecholamine-induced vasoconstrictive volume contraction, preventing profound hypotension upon tumor resection.`
    );
  }

  // 4. Predict In-Hospital Complication Risk
  let complicationRisk = 10;
  if (hasUnopposedAlphaDisaster) complicationRisk += 50;
  if (params.intraopPhase === 'TUMOR_MANIPULATION_STORM') complicationRisk += 25;
  if (params.intraopPhase === 'POST_VEIN_LIGATION_COLLAPSE' && isVasodilatoryShock) complicationRisk += 35;
  if (!roizenCriteriaMet && params.intraopPhase !== 'PRE_INDUCTION_BASELINE') complicationRisk += 20;
  if (params.tumorDiameterCm >= 6.0) complicationRisk += 10;

  const predictedInHospitalComplicationRatePercent = Math.min(95, Math.max(5, complicationRisk));

  // 5. Resuscitation Safety Score (0-100)
  let safetyScore = 100;
  if (hasUnopposedAlphaDisaster) safetyScore -= 50;
  if (params.intraopPhase === 'POST_VEIN_LIGATION_COLLAPSE' && params.ivFluidBolusAdministeredMl < 1000) safetyScore -= 25;
  if (params.alphaBlocker === 'NONE') safetyScore -= 30;
  if (!params.highSaltDietAndHydrationGiven) safetyScore -= 15;
  if (params.daysOfAlphaBlockade < 7) safetyScore -= 15;
  safetyScore = Math.max(0, Math.min(100, safetyScore));

  // Determine Clinical Status Badge
  let clinicalStatusBadge: PheoSimulationResult['clinicalStatusBadge'] = {
    status: 'STABLE',
    label: 'Optimized Preoperative State',
    color: 'emerald'
  };

  if (hasUnopposedAlphaDisaster || (params.intraopPhase === 'POST_VEIN_LIGATION_COLLAPSE' && map < 55)) {
    clinicalStatusBadge = {
      status: 'LETHAL_EMERGENCY',
      label: 'Lethal Hypertensive Storm / Vasodilatory Shock',
      color: 'rose'
    };
  } else if (params.intraopPhase === 'TUMOR_MANIPULATION_STORM' || isHypertensiveEmergency) {
    clinicalStatusBadge = {
      status: 'CRITICAL',
      label: 'Severe Catecholamine Crisis',
      color: 'red'
    };
  } else if (!roizenCriteriaMet) {
    clinicalStatusBadge = {
      status: 'WARNING',
      label: 'Suboptimal Roizen Preparation',
      color: 'amber'
    };
  }

  // Step-by-Step Action Plan
  if (hasUnopposedAlphaDisaster) {
    stepByStepActionPlan.push(`1. EMERGENCY OVERRIDE: Stop beta-blocker immediately. Administer IV Phentolamine 5 mg bolus or start IV Nitroprusside / Nicardipine to reverse unopposed alpha vasoconstriction.`);
  } else {
    stepByStepActionPlan.push(`1. Golden Pharmacology Sequence: Alpha-blocker FIRST (Phenoxybenzamine 10mg BID or Doxazosin 2mg daily) for at least 10-14 days preoperatively.`);
  }

  if (params.alphaBlocker !== 'NONE' && !hasUnopposedAlphaDisaster) {
    if (params.heartRateBpm > 85) {
      stepByStepActionPlan.push(`2. Add Beta-Blocker: Alpha-blockade is established; now safe to add Metoprolol or Propranolol to control reflex tachycardia.`);
    } else {
      stepByStepActionPlan.push(`2. Heart Rate Controlled: HR is ${params.heartRateBpm} bpm; beta-blocker is optional or held.`);
    }
  }

  if (!params.highSaltDietAndHydrationGiven) {
    stepByStepActionPlan.push(`3. Volume Expansion: Initiate high-sodium diet and vigorous IV hydration in the final 48-72 hours to correct chronic volume contraction.`);
  } else {
    stepByStepActionPlan.push(`3. Volume Status: Intravascular volume adequately expanded.`);
  }

  if (params.intraopPhase === 'TUMOR_MANIPULATION_STORM') {
    stepByStepActionPlan.push(`4. Intraop Storm Control: Deepen anesthesia; administer IV Phentolamine (2.5-5 mg) or titrate Nicardipine/Nitroprusside. Use IV Esmolol for tachyarrhythmias.`);
  } else if (params.intraopPhase === 'POST_VEIN_LIGATION_COLLAPSE') {
    stepByStepActionPlan.push(`4. Post-Ligation Resuscitation: Cease all vasodilators; infuse crystalloid / 5% albumin boluses; initiate Norepinephrine or Vasopressin to support vascular tone.`);
  } else {
    stepByStepActionPlan.push(`4. Surgical Readiness: Verify Roizen criteria (${roizenCriteriaMet ? 'MET' : 'UNMET'}). Proceed with laparoscopic adrenalectomy under invasive arterial line monitoring.`);
  }

  if (params.geneticSyndrome !== 'SPORADIC') {
    stepByStepActionPlan.push(`5. Genetic Triage: Syndrome is ${params.geneticSyndrome}. Screen for co-existing medullary thyroid carcinoma (calcitonin for MEN 2), hyperparathyroidism, or RCC (VHL).`);
  }

  return {
    meanArterialPressureMmHg: map,
    pulsePressureMmHg: pulsePressure,
    systemicVascularResistanceDyns: svr,
    roizenCriteriaMet,
    hasUnopposedAlphaDisaster,
    isHypertensiveEmergency,
    isVasodilatoryShock,
    predictedInHospitalComplicationRatePercent,
    resuscitationSafetyScore: safetyScore,
    clinicalStatusBadge,
    criticalAlerts,
    physiologicMechanisms,
    stepByStepActionPlan
  };
}

/**
 * 5 Standard Clinical Case Presets
 */
export const PHEOCYTOMA_PRESETS: Record<string, PheoPatientParams> = {
  roizenOptimizedPreop: {
    plasmaFreeNormetanephrinePgMl: 1850,
    plasmaFreeMetanephrinePgMl: 920,
    tumorDiameterCm: 4.5,
    geneticSyndrome: 'SPORADIC',
    heartRateBpm: 72,
    sbpMmHg: 122,
    dbpMmHg: 76,
    standingSbpDropMmHg: 14, // Roizen orthostasis met!
    alphaBlocker: 'PHENOXYBENZAMINE',
    daysOfAlphaBlockade: 14,
    betaBlocker: 'METOPROLOL_ORAL',
    betaBlockerStartedBeforeAlpha: false,
    highSaltDietAndHydrationGiven: true,
    intraopPhase: 'PRE_INDUCTION_BASELINE',
    emergencyVasodilator: 'NONE',
    ivFluidBolusAdministeredMl: 0,
    norepinephrineInfusionActive: false
  },

  unopposedAlphaDisaster: {
    plasmaFreeNormetanephrinePgMl: 2400,
    plasmaFreeMetanephrinePgMl: 1100,
    tumorDiameterCm: 5.2,
    geneticSyndrome: 'SPORADIC',
    heartRateBpm: 128,
    sbpMmHg: 260, // Malignant spike!
    dbpMmHg: 148,
    standingSbpDropMmHg: 0,
    alphaBlocker: 'BETA_BLOCKER_ALONE_HAZARD', // Beta-blocker without alpha!
    daysOfAlphaBlockade: 0,
    betaBlocker: 'PROPRANOLOL_ORAL',
    betaBlockerStartedBeforeAlpha: true, // The disaster!
    highSaltDietAndHydrationGiven: false,
    intraopPhase: 'PRE_INDUCTION_BASELINE',
    emergencyVasodilator: 'NONE',
    ivFluidBolusAdministeredMl: 0,
    norepinephrineInfusionActive: false
  },

  intraoperativeStorm: {
    plasmaFreeNormetanephrinePgMl: 3200,
    plasmaFreeMetanephrinePgMl: 1600,
    tumorDiameterCm: 6.8,
    geneticSyndrome: 'MEN_2A',
    heartRateBpm: 144,
    sbpMmHg: 235,
    dbpMmHg: 130,
    standingSbpDropMmHg: 12,
    alphaBlocker: 'PHENOXYBENZAMINE',
    daysOfAlphaBlockade: 12,
    betaBlocker: 'ESMOLOL_IV_INFUSION',
    betaBlockerStartedBeforeAlpha: false,
    highSaltDietAndHydrationGiven: true,
    intraopPhase: 'TUMOR_MANIPULATION_STORM',
    emergencyVasodilator: 'PHENTOLAMINE_IV_BOLUS',
    ivFluidBolusAdministeredMl: 500,
    norepinephrineInfusionActive: false
  },

  postLigationCollapse: {
    plasmaFreeNormetanephrinePgMl: 2100,
    plasmaFreeMetanephrinePgMl: 850,
    tumorDiameterCm: 5.0,
    geneticSyndrome: 'VHL',
    heartRateBpm: 112,
    sbpMmHg: 68, // Severe vasodilatory shock!
    dbpMmHg: 42,
    standingSbpDropMmHg: 10,
    alphaBlocker: 'DOXAZOSIN',
    daysOfAlphaBlockade: 11,
    betaBlocker: 'NONE',
    betaBlockerStartedBeforeAlpha: false,
    highSaltDietAndHydrationGiven: false, // Under-resuscitated volume!
    intraopPhase: 'POST_VEIN_LIGATION_COLLAPSE',
    emergencyVasodilator: 'NONE',
    ivFluidBolusAdministeredMl: 2500, // Aggressive volume resuscitation!
    norepinephrineInfusionActive: true
  },

  sdhbMalignantParaganglioma: {
    plasmaFreeNormetanephrinePgMl: 4500,
    plasmaFreeMetanephrinePgMl: 90, // Noradrenergic secretory profile typical for paraganglioma
    tumorDiameterCm: 8.5,
    geneticSyndrome: 'SDHB_SDHD',
    heartRateBpm: 84,
    sbpMmHg: 128,
    dbpMmHg: 78,
    standingSbpDropMmHg: 16,
    alphaBlocker: 'PHENOXYBENZAMINE',
    daysOfAlphaBlockade: 18,
    betaBlocker: 'METOPROLOL_ORAL',
    betaBlockerStartedBeforeAlpha: false,
    highSaltDietAndHydrationGiven: true,
    intraopPhase: 'PRE_INDUCTION_BASELINE',
    emergencyVasodilator: 'NONE',
    ivFluidBolusAdministeredMl: 0,
    norepinephrineInfusionActive: false
  }
};
