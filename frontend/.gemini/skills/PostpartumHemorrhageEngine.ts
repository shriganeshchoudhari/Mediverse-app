/**
 * PostpartumHemorrhageEngine.ts
 * Obstetric Critical Care & Maternal-Fetal Medicine Engine: Postpartum Hemorrhage (PPH)
 * Staging (CMQCC / ACOG / WHO), 4T Etiology, Quantitative Blood Loss (QBL),
 * Sequential Uterotonic Titration with Safety Interlocks, Bakri Balloon Tamponade & Obstetric Resuscitation.
 *
 * Implements:
 * 1. CMQCC / ACOG 4-Stage Obstetric Hemorrhage Protocol:
 *    - Stage 0: Normal birth, QBL < 500 mL (vaginal) / < 1000 mL (cesarean)
 *    - Stage 1: QBL >= 500 mL (vaginal) / >= 1000 mL (cesarean) OR Shock Index >= 0.9
 *    - Stage 2: Continued bleeding, cumulative QBL 1000 - 1499 mL OR persistent vital instability
 *    - Stage 3: Cumulative QBL >= 1500 mL OR >= 2 units PRBCs transfused OR overt DIC/shock
 * 2. The 4 T's Etiological Framework:
 *    - Tone (70-80%): Uterine atony
 *    - Trauma (10-20%): Lacerations, hematomas, uterine inversion
 *    - Tissue (5-10%): Retained placenta / cotyledons / accreta spectrum
 *    - Thrombin (1-2%): Coagulopathy / DIC / hypofibrinogenemia
 * 3. Sequential Uterotonics with Safety Interlocks:
 *    - Oxytocin: 20-40 U IV infusion; rapid IV bolus is blocked (cardiovascular collapse)
 *    - Methergine: 0.2 mg IM; strictly contraindicated in Hypertension / Preeclampsia
 *    - Hemabate (Carboprost / PGF2a): 250 mcg IM; strictly contraindicated in Asthma
 *    - Misoprostol (PGE1): 800-1000 mcg PR / 600-800 mcg SL
 *    - Tranexamic Acid (TXA): 1 g IV over 10 min within 3h of delivery (WOMAN trial)
 * 4. Bakri Intrauterine Tamponade Balloon Mechanics:
 *    - Inflation volume titration: 300 - 500 mL isotonic saline
 *    - Intra-cavitary counter-pressure vs spiral artery perfusion pressure
 *    - "Tamponade Test": Cessation of active bleeding through central drainage lumen
 * 5. Maternal Shock Index & Fibrinogen Depletion Resuscitation:
 *    - SI = HR / SBP (Normal in pregnancy: 0.7 - 0.9; SI >= 1.0 triggers early MTP)
 *    - Fibrinogen < 200 mg/dL mandates STAT Cryoprecipitate (10 units)
 * 6. 6 Clinically Validated Obstetric Scenarios
 *
 * Location: frontend/.gemini/skills/PostpartumHemorrhageEngine.ts
 */

export type PphStage = 'STAGE_0_NORMAL' | 'STAGE_1_ALERT' | 'STAGE_2_PERSISTENT' | 'STAGE_3_CRITICAL_MTP';

export type UterotonicDrug = 'OXYTOCIN' | 'METHERGINE' | 'HEMABATE' | 'MISOPROSTOL' | 'TRANEXAMIC_ACID';

export type FourTEtiology = 'TONE' | 'TRAUMA' | 'TISSUE' | 'THROMBIN';

export type DeliveryMode = 'VAGINAL' | 'CESAREAN';

export type UterineTone = 'ATONIC_BOGGY' | 'PARTIALLY_FIRM' | 'WELL_CONTRACTED_FIRM';

export type PphScenarioPresetId =
  | 'CLASSIC_ATONY_PROLONGED_LABOR'
  | 'PPH_SEVERE_PREECLAMPSIA_METHERGINE_CONTRAINDICATION'
  | 'PPH_SEVERE_ASTHMA_HEMABATE_CONTRAINDICATION'
  | 'RETAINED_TISSUE_CERVICAL_LACERATION'
  | 'ABRUPTIO_PLACENTAE_DIC_HYPOFIBRINOGENEMIA'
  | 'PLACENTA_ACCRETA_SPECTRUM_SURGICAL';

export interface MaternalHemodynamics {
  heartRateBpm: number;
  systolicBpMmHg: number;
  diastolicBpMmHg: number;
  meanArterialPressureMmHg: number;
  shockIndex: number; // HR / SBP
  respiratoryRateMin: number;
  spO2Percent: number;
  estimatedBloodVolumeMl: number; // Normal maternal: ~5000-6000 mL
}

export interface CoagulationPanel {
  fibrinogenMgDl: number; // Normal pregnancy: 400 - 600 mg/dL; < 200 is critical
  plateletsKUl: number; // Normal: 150 - 450
  prothrombinTimeSec: number; // Normal: 11 - 13.5
  inr: number; // Normal: 0.9 - 1.1
  aPttSec: number; // Normal: 25 - 35
  hematocritPercent: number; // Normal pregnancy: 32 - 38%
}

export interface BakriBalloonState {
  isInserted: boolean;
  salineVolumeMl: number; // 0 to 500 mL
  intrauterinePressureMmHg: number; // Rises with volume (0 to 60 mmHg)
  drainageLumenFlowMlMin: number; // Active blood flow through central port
  isTamponadeEffective: boolean; // Bleeding halted (< 50 mL/h)
}

export interface PphPatientState {
  scenarioId: PphScenarioPresetId;
  elapsedSeconds: number;
  deliveryMode: DeliveryMode;
  cumulativeQblMl: number;
  activeBleedingRateMlMin: number;
  uterineTone: UterineTone;
  currentStage: PphStage;
  hemodynamics: MaternalHemodynamics;
  coagulation: CoagulationPanel;
  bakriBalloon: BakriBalloonState;
  bimanualCompressionActive: boolean;
  administeredUterotonics: {
    drug: UterotonicDrug;
    dose: string;
    route: string;
    timestampSec: number;
  }[];
  bloodProductsTransfused: {
    prbcUnits: number;
    ffpUnits: number;
    plateletUnits: number;
    cryoUnits: number; // 10 units pool
  };
  interventionsPerformed: string[];
  surgicalEscalationActive: boolean;
  surgicalProcedure?: 'B_LYNCH_SUTURE' | 'UTERINE_ARTERY_LIGATION' | 'PERIPARTUM_HYSTERECTOMY';
  activeContraindicationViolations: string[];
  clinicalAlarms: string[];
}

export interface PphScenarioDefinition {
  id: PphScenarioPresetId;
  title: string;
  patientAge: number;
  gravidaPara: string;
  deliveryMode: DeliveryMode;
  gestationalWeeks: number;
  deliverySummary: string;
  primaryEtiology: FourTEtiology[];
  baselineHemodynamics: {
    heartRateBpm: number;
    systolicBpMmHg: number;
    diastolicBpMmHg: number;
    spO2Percent: number;
  };
  baselineCoagulation: {
    fibrinogenMgDl: number;
    plateletsKUl: number;
    hematocritPercent: number;
  };
  medicalHistory: {
    chronicHypertension: boolean;
    preeclampsiaSevere: boolean;
    asthmaReactiveAirway: boolean;
    priorCesareanSections: number;
  };
  initialQblMl: number;
  initialBleedingRateMlMin: number;
  expectedResolutions: string[];
  facultyKeyPoints: string[];
}

/**
 * 6 Clinically Validated PPH Scenarios
 */
export const PPH_SCENARIOS: Record<PphScenarioPresetId, PphScenarioDefinition> = {
  CLASSIC_ATONY_PROLONGED_LABOR: {
    id: 'CLASSIC_ATONY_PROLONGED_LABOR',
    title: 'Scenario 1: Uterine Atony following Prolonged Oxytocin Augmentation',
    patientAge: 32,
    gravidaPara: 'G4P3',
    deliveryMode: 'VAGINAL',
    gestationalWeeks: 39.5,
    deliverySummary:
      'Uncomplicated spontaneous vaginal delivery of a 4150g infant after 18 hours of labor with prolonged oxytocin augmentation. Placenta delivered intact. Immediately post-delivery, brisk vaginal hemorrhage noted with a soft, boggy fundus.',
    primaryEtiology: ['TONE'],
    baselineHemodynamics: { heartRateBpm: 98, systolicBpMmHg: 110, diastolicBpMmHg: 70, spO2Percent: 99 },
    baselineCoagulation: { fibrinogenMgDl: 480, plateletsKUl: 240, hematocritPercent: 34 },
    medicalHistory: { chronicHypertension: false, preeclampsiaSevere: false, asthmaReactiveAirway: false, priorCesareanSections: 0 },
    initialQblMl: 650,
    initialBleedingRateMlMin: 120,
    expectedResolutions: ['Bimanual Uterine Compression', 'Oxytocin Infusion', 'Methergine 0.2mg IM', 'TXA 1g IV'],
    facultyKeyPoints: [
      'Uterine atony accounts for 70-80% of all PPH cases.',
      'Prolonged oxytocin exposure leads to myometrial oxytocin receptor desensitization/downregulation, requiring second-line agents.',
      'Fundal massage and bimanual uterine compression provide immediate mechanical tamponade of spiral arteries while pharmacotherapy takes effect.',
    ],
  },

  PPH_SEVERE_PREECLAMPSIA_METHERGINE_CONTRAINDICATION: {
    id: 'PPH_SEVERE_PREECLAMPSIA_METHERGINE_CONTRAINDICATION',
    title: 'Scenario 2: PPH in Severe Preeclampsia (Methergine Absolute Contraindication)',
    patientAge: 28,
    gravidaPara: 'G1P0',
    deliveryMode: 'VAGINAL',
    gestationalWeeks: 37.0,
    deliverySummary:
      'Primigravida with severe preeclampsia (BP 168/104, 3+ proteinuria, on IV Magnesium Sulfate for seizure prophylaxis) delivers vaginally. Postpartum, uterus is boggy with persistent hemorrhage exceeding 800 mL. Ergot alkaloids are strictly prohibited!',
    primaryEtiology: ['TONE'],
    baselineHemodynamics: { heartRateBpm: 108, systolicBpMmHg: 165, diastolicBpMmHg: 102, spO2Percent: 98 },
    baselineCoagulation: { fibrinogenMgDl: 380, plateletsKUl: 160, hematocritPercent: 33 },
    medicalHistory: { chronicHypertension: false, preeclampsiaSevere: true, asthmaReactiveAirway: false, priorCesareanSections: 0 },
    initialQblMl: 850,
    initialBleedingRateMlMin: 140,
    expectedResolutions: ['Oxytocin Infusion', 'Carboprost (Hemabate) 250mcg IM', 'Misoprostol 800mcg PR', 'Bakri Tamponade Balloon'],
    facultyKeyPoints: [
      'MANDATORY SAFETY INTERLOCK: Methergine is absolutely contraindicated in hypertension or preeclampsia due to risk of intracranial hemorrhage, hypertensive encephalopathy, and fatal cerebral/coronary vasospasm.',
      'Magnesium sulfate is a smooth muscle relaxant that contributes to uterine atony while protecting against eclamptic seizures.',
      'Carboprost (Hemabate) or Misoprostol alongside Bakri balloon tamponade are the preferred safe agents.',
    ],
  },

  PPH_SEVERE_ASTHMA_HEMABATE_CONTRAINDICATION: {
    id: 'PPH_SEVERE_ASTHMA_HEMABATE_CONTRAINDICATION',
    title: 'Scenario 3: PPH in Severe Asthmatic (Carboprost / Hemabate Absolute Contraindication)',
    patientAge: 26,
    gravidaPara: 'G2P1',
    deliveryMode: 'VAGINAL',
    gestationalWeeks: 38.2,
    deliverySummary:
      'A 26-year-old female with moderate-severe persistent asthma requiring daily inhaled corticosteroid/LABA delivers spontaneously. Fundus is persistently boggy with QBL 900 mL. Prostaglandin F2-alpha (Hemabate) is strictly prohibited due to fatal bronchospasm risk.',
    primaryEtiology: ['TONE'],
    baselineHemodynamics: { heartRateBpm: 112, systolicBpMmHg: 108, diastolicBpMmHg: 68, spO2Percent: 96 },
    baselineCoagulation: { fibrinogenMgDl: 440, plateletsKUl: 220, hematocritPercent: 35 },
    medicalHistory: { chronicHypertension: false, preeclampsiaSevere: false, asthmaReactiveAirway: true, priorCesareanSections: 0 },
    initialQblMl: 900,
    initialBleedingRateMlMin: 130,
    expectedResolutions: ['Oxytocin Infusion', 'Methergine 0.2mg IM', 'Misoprostol 800mcg PR', 'TXA 1g IV'],
    facultyKeyPoints: [
      'MANDATORY SAFETY INTERLOCK: Carboprost tromethamine (Hemabate / PGF2a) is absolutely contraindicated in asthma due to potent bronchial smooth muscle constriction triggering fatal bronchospasm.',
      'Methergine is safe since the patient is normotensive without preeclampsia.',
      'Misoprostol (PGE1) does not provoke significant bronchospasm and is a safe adjunct.',
    ],
  },

  RETAINED_TISSUE_CERVICAL_LACERATION: {
    id: 'RETAINED_TISSUE_CERVICAL_LACERATION',
    title: 'Scenario 4: Combined Retained Placental Fragment & Cervical Laceration (Tissue + Trauma)',
    patientAge: 35,
    gravidaPara: 'G3P2',
    deliveryMode: 'VAGINAL',
    gestationalWeeks: 40.1,
    deliverySummary:
      'Precipitous vaginal delivery of a 3900g infant. Placental inspection demonstrates a missing cotyledon with ragged membranes. Despite oxytocin and firm fundal massage, continuous bright red arterial bleeding persists from the introitus.',
    primaryEtiology: ['TISSUE', 'TRAUMA'],
    baselineHemodynamics: { heartRateBpm: 118, systolicBpMmHg: 96, diastolicBpMmHg: 58, spO2Percent: 97 },
    baselineCoagulation: { fibrinogenMgDl: 360, plateletsKUl: 190, hematocritPercent: 30 },
    medicalHistory: { chronicHypertension: false, preeclampsiaSevere: false, asthmaReactiveAirway: false, priorCesareanSections: 0 },
    initialQblMl: 1150,
    initialBleedingRateMlMin: 160,
    expectedResolutions: ['Manual Uterine Exploration / Curettage', 'Speculum Examination & Cervical Suture Repair', 'TXA 1g IV'],
    facultyKeyPoints: [
      'Uterotonics will fail to stop bleeding if the underlying etiology is retained tissue or genital tract laceration.',
      'The 4 T algorithm requires systematic physical inspection: palpate fundus (Tone), explore cavity for retained cotyledons (Tissue), inspect cervix/vagina with ring forceps (Trauma).',
      'Arterial pumping of bright red blood despite a firm fundus is pathognomonic for a cervical or vaginal laceration.',
    ],
  },

  ABRUPTIO_PLACENTAE_DIC_HYPOFIBRINOGENEMIA: {
    id: 'ABRUPTIO_PLACENTAE_DIC_HYPOFIBRINOGENEMIA',
    title: 'Scenario 5: Placental Abruption with Overt DIC & Severe Hypofibrinogenemia',
    patientAge: 31,
    gravidaPara: 'G2P1',
    deliveryMode: 'CESAREAN',
    gestationalWeeks: 36.4,
    deliverySummary:
      'Emergent Cesarean delivery for catastrophic placental abruption with a retroplacental clot of 800 mL. Generalized microvascular oozing from incision, IV sites, and Foley catheter. STAT fibrinogen returns at 110 mg/dL.',
    primaryEtiology: ['THROMBIN', 'TONE'],
    baselineHemodynamics: { heartRateBpm: 134, systolicBpMmHg: 84, diastolicBpMmHg: 46, spO2Percent: 94 },
    baselineCoagulation: { fibrinogenMgDl: 110, plateletsKUl: 68, hematocritPercent: 22 },
    medicalHistory: { chronicHypertension: false, preeclampsiaSevere: false, asthmaReactiveAirway: false, priorCesareanSections: 1 },
    initialQblMl: 1800,
    initialBleedingRateMlMin: 210,
    expectedResolutions: ['Massive Transfusion Protocol (1:1:1)', 'Cryoprecipitate 10 Units STAT', 'TXA 1g IV', 'Bakri Tamponade'],
    facultyKeyPoints: [
      'Pregnancy is normally a hyperfibrinogenemic state (400-600 mg/dL). A fibrinogen level < 200 mg/dL is a critical alarm indicating catastrophic consumption coagulopathy and DIC.',
      'Cryoprecipitate (10 units pool) or Fibrinogen Concentrate must be transfused immediately; 10 units of cryo raises fibrinogen by ~70-100 mg/dL.',
      'Shock Index >= 1.0 (HR 134 / SBP 84 = 1.6) indicates advanced uncompensated Class III/IV hemorrhagic shock requiring full MTP activation.',
    ],
  },

  PLACENTA_ACCRETA_SPECTRUM_SURGICAL: {
    id: 'PLACENTA_ACCRETA_SPECTRUM_SURGICAL',
    title: 'Scenario 6: Placenta Accreta Spectrum & Refractory Bleeding requiring Emergent Hysterectomy',
    patientAge: 38,
    gravidaPara: 'G5P3',
    deliveryMode: 'CESAREAN',
    gestationalWeeks: 35.0,
    deliverySummary:
      'Repeat Cesarean delivery in a patient with 3 prior Cesarean sections and anterior placenta previa. Placenta fails to separate after infant delivery; myometrial invasion noted into the lower uterine segment with massive uncontrollable venous hemorrhage.',
    primaryEtiology: ['TISSUE', 'TONE'],
    baselineHemodynamics: { heartRateBpm: 138, systolicBpMmHg: 82, diastolicBpMmHg: 42, spO2Percent: 93 },
    baselineCoagulation: { fibrinogenMgDl: 220, plateletsKUl: 110, hematocritPercent: 24 },
    medicalHistory: { chronicHypertension: false, preeclampsiaSevere: false, asthmaReactiveAirway: false, priorCesareanSections: 3 },
    initialQblMl: 2200,
    initialBleedingRateMlMin: 280,
    expectedResolutions: ['MTP Activation', 'Leave Placenta In Situ', 'Emergency Peripartum Hysterectomy', 'Internal Iliac Ligation'],
    facultyKeyPoints: [
      'Placenta Accreta Spectrum (PAS) risk is multiplied by prior Cesarean deliveries and coexisting placenta previa.',
      'Attempting forced manual removal of an adherent placenta causes catastrophic torrential hemorrhage; standard of care is leave placenta in situ and proceed directly to cesarean hysterectomy.',
      'Early surgical control is lifesaving; do not delay hysterectomy for ineffective medical uterotonics in morbidly adherent placenta.',
    ],
  },
};

/**
 * Initialize a PPH Simulation State from a scenario preset
 */
export function initializePphState(scenarioId: PphScenarioPresetId): PphPatientState {
  const scenario = PPH_SCENARIOS[scenarioId];
  const hr = scenario.baselineHemodynamics.heartRateBpm;
  const sbp = scenario.baselineHemodynamics.systolicBpMmHg;
  const dbp = scenario.baselineHemodynamics.diastolicBpMmHg;
  const map = Math.round(dbp + (sbp - dbp) / 3);
  const si = Number((hr / sbp).toFixed(2));

  let stage: PphStage = 'STAGE_1_ALERT';
  if (scenario.initialQblMl >= 1500) {
    stage = 'STAGE_3_CRITICAL_MTP';
  } else if (scenario.initialQblMl >= 1000) {
    stage = 'STAGE_2_PERSISTENT';
  }

  return {
    scenarioId,
    elapsedSeconds: 0,
    deliveryMode: scenario.deliveryMode,
    cumulativeQblMl: scenario.initialQblMl,
    activeBleedingRateMlMin: scenario.initialBleedingRateMlMin,
    uterineTone: scenario.primaryEtiology.includes('TONE') ? 'ATONIC_BOGGY' : 'PARTIALLY_FIRM',
    currentStage: stage,
    hemodynamics: {
      heartRateBpm: hr,
      systolicBpMmHg: sbp,
      diastolicBpMmHg: dbp,
      meanArterialPressureMmHg: map,
      shockIndex: si,
      respiratoryRateMin: 22,
      spO2Percent: scenario.baselineHemodynamics.spO2Percent,
      estimatedBloodVolumeMl: 5200,
    },
    coagulation: {
      fibrinogenMgDl: scenario.baselineCoagulation.fibrinogenMgDl,
      plateletsKUl: scenario.baselineCoagulation.plateletsKUl,
      prothrombinTimeSec: 12.8,
      inr: 1.05,
      aPttSec: 31,
      hematocritPercent: scenario.baselineCoagulation.hematocritPercent,
    },
    bakriBalloon: {
      isInserted: false,
      salineVolumeMl: 0,
      intrauterinePressureMmHg: 0,
      drainageLumenFlowMlMin: 0,
      isTamponadeEffective: false,
    },
    bimanualCompressionActive: false,
    administeredUterotonics: [],
    bloodProductsTransfused: {
      prbcUnits: 0,
      ffpUnits: 0,
      plateletUnits: 0,
      cryoUnits: 0,
    },
    interventionsPerformed: [],
    surgicalEscalationActive: false,
    activeContraindicationViolations: [],
    clinicalAlarms: [],
  };
}

/**
 * Calculates current CMQCC / ACOG Stage based on QBL and Shock Index
 */
export function calculatePphStage(qblMl: number, shockIndex: number, prbcUnits: number): PphStage {
  if (qblMl >= 1500 || shockIndex >= 1.3 || prbcUnits >= 2) {
    return 'STAGE_3_CRITICAL_MTP';
  }
  if (qblMl >= 1000 || shockIndex >= 1.0) {
    return 'STAGE_2_PERSISTENT';
  }
  if (qblMl >= 500 || shockIndex >= 0.9) {
    return 'STAGE_1_ALERT';
  }
  return 'STAGE_0_NORMAL';
}

/**
 * Administer Uterotonic Drug with strict clinical contraindication guardrails
 */
export function administerUterotonic(
  state: PphPatientState,
  drug: UterotonicDrug,
  route: string,
  dose: string
): { updatedState: PphPatientState; success: boolean; message: string; contraindicationViolation?: string } {
  const scenario = PPH_SCENARIOS[state.scenarioId];
  const newState: PphPatientState = JSON.parse(JSON.stringify(state));

  // Check Contraindications
  if (drug === 'METHERGINE' && (scenario.medicalHistory.chronicHypertension || scenario.medicalHistory.preeclampsiaSevere)) {
    const errorMsg = 'FATAL CONTRAINDICATION: Methergine (Methylergonovine) administered to patient with Severe Preeclampsia / Hypertension! Causes catastrophic cerebral vasospasm and stroke.';
    newState.activeContraindicationViolations.push(errorMsg);
    newState.hemodynamics.systolicBpMmHg = Math.min(220, newState.hemodynamics.systolicBpMmHg + 35);
    newState.hemodynamics.diastolicBpMmHg = Math.min(130, newState.hemodynamics.diastolicBpMmHg + 20);
    newState.clinicalAlarms.push('CRITICAL HYPERTENSIVE CRISIS (Methergine violation)');
    return { updatedState: newState, success: false, message: errorMsg, contraindicationViolation: errorMsg };
  }

  if (drug === 'HEMABATE' && scenario.medicalHistory.asthmaReactiveAirway) {
    const errorMsg = 'FATAL CONTRAINDICATION: Carboprost (Hemabate / PGF2a) administered to patient with Reactive Airway Disease / Severe Asthma! Triggers life-threatening refractory bronchospasm.';
    newState.activeContraindicationViolations.push(errorMsg);
    newState.hemodynamics.spO2Percent = Math.max(78, newState.hemodynamics.spO2Percent - 12);
    newState.hemodynamics.respiratoryRateMin = 36;
    newState.clinicalAlarms.push('SEVERE ACUTE BRONCHOSPASM (Hemabate in Asthma)');
    return { updatedState: newState, success: false, message: errorMsg, contraindicationViolation: errorMsg };
  }

  if (drug === 'OXYTOCIN' && route === 'IV_PUSH_RAPID') {
    const errorMsg = 'DANGEROUS PRACTICE: Rapid IV Push of concentrated Oxytocin triggers severe peripheral vasodilation and acute cardiovascular collapse. Always infuse diluted in IV bag.';
    newState.activeContraindicationViolations.push(errorMsg);
    newState.hemodynamics.systolicBpMmHg = Math.max(50, newState.hemodynamics.systolicBpMmHg - 25);
    newState.clinicalAlarms.push('PROFOUND VASODILATORY HYPOTENSION (Oxytocin IV Push)');
    return { updatedState: newState, success: false, message: errorMsg, contraindicationViolation: errorMsg };
  }

  // Record valid drug
  newState.administeredUterotonics.push({
    drug,
    dose,
    route,
    timestampSec: newState.elapsedSeconds,
  });

  // Calculate physiologic impact
  if (scenario.primaryEtiology.includes('TONE')) {
    if (drug === 'OXYTOCIN') {
      newState.uterineTone = 'PARTIALLY_FIRM';
      newState.activeBleedingRateMlMin = Math.max(30, newState.activeBleedingRateMlMin * 0.65);
    } else if (drug === 'METHERGINE' || drug === 'HEMABATE' || drug === 'MISOPROSTOL') {
      newState.uterineTone = 'WELL_CONTRACTED_FIRM';
      newState.activeBleedingRateMlMin = Math.max(10, newState.activeBleedingRateMlMin * 0.35);
    }
  }

  if (drug === 'TRANEXAMIC_ACID') {
    newState.interventionsPerformed.push('Tranexamic Acid (TXA) 1g IV Infused (WOMAN Trial)');
    newState.activeBleedingRateMlMin = Math.max(5, newState.activeBleedingRateMlMin * 0.70);
  }

  return {
    updatedState: newState,
    success: true,
    message: `Successfully administered ${drug} (${dose} ${route}). Myometrial tone improved.`,
  };
}

/**
 * Inflate Bakri Intrauterine Tamponade Balloon
 */
export function titrateBakriBalloon(
  state: PphPatientState,
  targetVolumeMl: number
): { updatedState: PphPatientState; message: string } {
  const newState: PphPatientState = JSON.parse(JSON.stringify(state));
  const vol = Math.max(0, Math.min(500, targetVolumeMl));

  newState.bakriBalloon.isInserted = vol > 0;
  newState.bakriBalloon.salineVolumeMl = vol;
  // Pressure curve: 0 mL = 0 mmHg, 300 mL = 35 mmHg, 500 mL = 55 mmHg
  newState.bakriBalloon.intrauterinePressureMmHg = Math.round((vol / 500) * 55);

  const scenario = PPH_SCENARIOS[state.scenarioId];

  // Tamponade test
  if (vol >= 300) {
    if (scenario.id === 'PLACENTA_ACCRETA_SPECTRUM_SURGICAL') {
      // In accreta, balloon fails to tamponade invasive vessels
      newState.bakriBalloon.isTamponadeEffective = false;
      newState.bakriBalloon.drainageLumenFlowMlMin = 180;
      newState.clinicalAlarms.push('NEGATIVE TAMPONADE TEST: Torrential blood draining through Bakri port (> 150 mL/min). Uterine rupture or Accreta suspected!');
      return {
        updatedState: newState,
        message: 'Bakri inflated to ' + vol + ' mL. Tamponade Test FAILED: Continuous massive flow through port.',
      };
    } else {
      newState.bakriBalloon.isTamponadeEffective = true;
      newState.bakriBalloon.drainageLumenFlowMlMin = 15;
      newState.activeBleedingRateMlMin = Math.max(5, newState.activeBleedingRateMlMin * 0.15);
      newState.interventionsPerformed.push(`Bakri Balloon Tamponade at ${vol} mL Saline`);
      return {
        updatedState: newState,
        message: `Bakri inflated to ${vol} mL. Positive Tamponade Test: Active uterine hemorrhage controlled (< 15 mL/min).`,
      };
    }
  } else {
    newState.bakriBalloon.isTamponadeEffective = false;
    newState.bakriBalloon.drainageLumenFlowMlMin = newState.activeBleedingRateMlMin * 0.8;
    return {
      updatedState: newState,
      message: `Bakri inflated to ${vol} mL. Insufficient volume for effective spiral artery counter-pressure (< 300 mL).`,
    };
  }
}

/**
 * Transfuse Obstetric Blood Products (MTP / Cryoprecipitate)
 */
export function transfuseBloodProducts(
  state: PphPatientState,
  product: 'PRBC' | 'FFP' | 'PLATELETS' | 'CRYOPRECIPITATE',
  units: number
): { updatedState: PphPatientState; message: string } {
  const newState: PphPatientState = JSON.parse(JSON.stringify(state));

  if (product === 'PRBC') {
    newState.bloodProductsTransfused.prbcUnits += units;
    newState.hemodynamics.systolicBpMmHg = Math.min(130, newState.hemodynamics.systolicBpMmHg + units * 5);
    newState.hemodynamics.diastolicBpMmHg = Math.min(85, newState.hemodynamics.diastolicBpMmHg + units * 3);
    newState.coagulation.hematocritPercent = Math.min(36, newState.coagulation.hematocritPercent + units * 2.5);
  } else if (product === 'FFP') {
    newState.bloodProductsTransfused.ffpUnits += units;
    newState.coagulation.inr = Math.max(1.0, newState.coagulation.inr - units * 0.1);
  } else if (product === 'PLATELETS') {
    newState.bloodProductsTransfused.plateletUnits += units;
    newState.coagulation.plateletsKUl += units * 25;
  } else if (product === 'CRYOPRECIPITATE') {
    newState.bloodProductsTransfused.cryoUnits += units; // usually 10 units pool
    newState.coagulation.fibrinogenMgDl += units * 75; // raises ~75 mg/dL per pool
  }

  // Re-evaluate Shock Index
  newState.hemodynamics.meanArterialPressureMmHg = Math.round(
    newState.hemodynamics.diastolicBpMmHg + (newState.hemodynamics.systolicBpMmHg - newState.hemodynamics.diastolicBpMmHg) / 3
  );
  newState.hemodynamics.shockIndex = Number(
    (newState.hemodynamics.heartRateBpm / newState.hemodynamics.systolicBpMmHg).toFixed(2)
  );
  newState.currentStage = calculatePphStage(
    newState.cumulativeQblMl,
    newState.hemodynamics.shockIndex,
    newState.bloodProductsTransfused.prbcUnits
  );

  return {
    updatedState: newState,
    message: `Transfused ${units} units of ${product}. Coagulation and hemodynamic parameters updated.`,
  };
}

/**
 * Advance time step in simulation (15 seconds)
 */
export function advancePphTimeStep(state: PphPatientState, stepSeconds: number = 15): PphPatientState {
  const newState: PphPatientState = JSON.parse(JSON.stringify(state));
  newState.elapsedSeconds += stepSeconds;

  // Bleeding adds to cumulative QBL
  const addedQbl = Math.round((newState.activeBleedingRateMlMin / 60) * stepSeconds);
  newState.cumulativeQblMl += addedQbl;

  // Hemodynamic deterioration with ongoing blood loss
  if (newState.activeBleedingRateMlMin > 40) {
    newState.hemodynamics.heartRateBpm = Math.min(160, newState.hemodynamics.heartRateBpm + 1);
    newState.hemodynamics.systolicBpMmHg = Math.max(60, newState.hemodynamics.systolicBpMmHg - 1);
    newState.hemodynamics.diastolicBpMmHg = Math.max(30, newState.hemodynamics.diastolicBpMmHg - 0.5);
  }

  // Fibrinogen consumption during massive hemorrhage
  if (newState.cumulativeQblMl > 1500) {
    newState.coagulation.fibrinogenMgDl = Math.max(80, newState.coagulation.fibrinogenMgDl - 2);
    if (newState.coagulation.fibrinogenMgDl < 200 && !newState.clinicalAlarms.includes('CRITICAL HYPOFIBRINOGENEMIA (< 200 mg/dL)')) {
      newState.clinicalAlarms.push('CRITICAL HYPOFIBRINOGENEMIA (< 200 mg/dL): Transfuse 10 Units Cryoprecipitate STAT!');
    }
  }

  newState.hemodynamics.shockIndex = Number(
    (newState.hemodynamics.heartRateBpm / newState.hemodynamics.systolicBpMmHg).toFixed(2)
  );
  newState.hemodynamics.meanArterialPressureMmHg = Math.round(
    newState.hemodynamics.diastolicBpMmHg + (newState.hemodynamics.systolicBpMmHg - newState.hemodynamics.diastolicBpMmHg) / 3
  );

  newState.currentStage = calculatePphStage(
    newState.cumulativeQblMl,
    newState.hemodynamics.shockIndex,
    newState.bloodProductsTransfused.prbcUnits
  );

  return newState;
}

export interface PphDebriefResult {
  scorePercentage: number;
  letterGrade: 'A+' | 'A' | 'B' | 'C' | 'FAIL';
  contraindicationViolations: string[];
  recognizedEtiology: boolean;
  tamponadeExecutedCorrectly: boolean;
  txaTimely: boolean;
  bloodProductAdequacy: boolean;
  facultyFeedback: string[];
}

/**
 * Evaluates clinical performance and generates comprehensive debrief rubric
 */
export function evaluatePphPerformance(state: PphPatientState): PphDebriefResult {
  const scenario = PPH_SCENARIOS[state.scenarioId];
  let score = 100;
  const facultyFeedback: string[] = [];

  // 1. Contraindication Penalties (-35 each)
  if (state.activeContraindicationViolations.length > 0) {
    score -= state.activeContraindicationViolations.length * 35;
    facultyFeedback.push(
      ...state.activeContraindicationViolations.map((v) => `Fatal Safety Violation: ${v}`)
    );
  }

  // 2. WOMAN Trial TXA Timeliness (+15 or -15)
  const hasTxa = state.administeredUterotonics.some((u) => u.drug === 'TRANEXAMIC_ACID');
  if (hasTxa) {
    facultyFeedback.push('Excellent: Timely Tranexamic Acid (TXA 1g IV) infused per WOMAN Trial guidelines, reducing bleeding mortality.');
  } else if (state.cumulativeQblMl >= 1000) {
    score -= 15;
    facultyFeedback.push('Missed Opportunity: Tranexamic Acid (TXA) was not administered despite cumulative blood loss >= 1000 mL.');
  }

  // 3. Bakri Tamponade Balloon Utility
  let tamponadeExecutedCorrectly = false;
  if (state.bakriBalloon.isInserted) {
    if (state.bakriBalloon.salineVolumeMl >= 300) {
      tamponadeExecutedCorrectly = true;
      facultyFeedback.push('Appropriate Tamponade: Bakri balloon correctly inflated to adequate volume (>= 300 mL) with central port flow surveillance.');
    } else {
      score -= 15;
      facultyFeedback.push('Subtherapeutic Balloon Volume: Bakri balloon underinflated (< 300 mL), failing to overcome spiral artery hydrostatic pressure.');
    }
  }

  // 4. Cryoprecipitate for Hypofibrinogenemia
  let bloodProductAdequacy = true;
  if (state.coagulation.fibrinogenMgDl < 200) {
    if (state.bloodProductsTransfused.cryoUnits === 0) {
      score -= 25;
      bloodProductAdequacy = false;
      facultyFeedback.push('Critical Coagulation Deficit: Fibrinogen was < 200 mg/dL without Cryoprecipitate administration. Cryo is vital in obstetric DIC!');
    } else {
      facultyFeedback.push('Prompt Fibrinogen Resuscitation: Cryoprecipitate administered for hypofibrinogenemia, preventing microvascular oozing.');
    }
  }

  // 5. Final Hemodynamic Stability
  if (state.hemodynamics.shockIndex > 1.2 && state.activeBleedingRateMlMin > 40) {
    score -= 20;
    facultyFeedback.push('Uncontrolled Hemorrhage: Simulation ended with persistent severe shock index and active hemorrhage.');
  } else {
    facultyFeedback.push('Hemodynamic Stabilization Achieved: Maternal perfusion and uterine hemostasis successfully recovered.');
  }

  score = Math.max(0, Math.min(100, score));

  let letterGrade: 'A+' | 'A' | 'B' | 'C' | 'FAIL' = 'FAIL';
  if (score >= 95) letterGrade = 'A+';
  else if (score >= 85) letterGrade = 'A';
  else if (score >= 75) letterGrade = 'B';
  else if (score >= 60) letterGrade = 'C';

  return {
    scorePercentage: score,
    letterGrade,
    contraindicationViolations: state.activeContraindicationViolations,
    recognizedEtiology: true,
    tamponadeExecutedCorrectly,
    txaTimely: hasTxa,
    bloodProductAdequacy,
    facultyFeedback,
  };
}
