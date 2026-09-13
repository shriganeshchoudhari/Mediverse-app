/**
 * AmnioticFluidEmbolismEngine.ts
 * Obstetrics, Maternal-Fetal Medicine & Critical Care Engine.
 * Implements Clark Diagnostic Criteria (SMFM / AFE Foundation 2016),
 * Biphasic Pathophysiology (Phase 1: Acute Cor Pulmonale & Severe RV Failure;
 * Phase 2: LV Atony & Consumptive Hyperfibrinolytic DIC),
 * Inhaled Pulmonary Vasodilators, A-OK Protocol, Hemostatic Resuscitation,
 * and VA-ECMO Extracorporeal Rescue Triage.
 * Location: frontend/.gemini/skills/AmnioticFluidEmbolismEngine.ts
 */

export type AfePhase = 'phase_1_acute_cor_pulmonale' | 'phase_2_lv_atony_and_dic' | 'post_resuscitative_recovery';

export interface PatientAfeState {
  patientAge: number;
  gestationalWeeks: number;
  peripartumTimingMinutes: number; // minutes relative to delivery (-60 to +180 min; <= 30 min meets Clark criteria)
  currentPhase: AfePhase;

  // Vital Signs & Cardiopulmonary Mechanics
  cardiorespiratoryArrest: boolean; // PEA, asystole, or severe hypotension/hypoxemia
  systolicBpMmHg: number;
  diastolicBpMmHg: number;
  heartRateBpm: number;
  spo2Percent: number;
  fio2Percent: number;

  // Echocardiography & Pulmonary Hemodynamics
  pulmonaryVascularResistanceDyns: number; // normal 50-150 dyn*s/cm5; AFE surges to 400-900
  rvLvDiameterRatio: number; // normal < 0.6; RV strain >= 0.9; severe dilation >= 1.2
  septalDShapedFlattening: boolean; // interventricular septal shift compressing LV
  leftVentricularEjectionFractionPercent: number; // normal 55-65%; Phase 2 drops to 15-30%

  // Coagulation & Hematology (Modified Pregnancy ISTH)
  plateletCountThousands: number; // normal pregnancy 150-400; AFE drops < 50
  serumFibrinogenMgDl: number; // normal pregnancy 400-600; AFE critical < 200 (often < 100)
  prothrombinTimeInr: number; // normal 0.9-1.1; AFE > 1.5-2.5
  dDimerUgl: number; // massively elevated > 10,000

  // Clinical Exclusion Criteria
  temperatureCelsius: number; // >= 38.0 C suggests sepsis/chorioamnionitis, not pure AFE
  alternativeEtiologyIdentified: boolean; // massive pulmonary thromboembolism, uterine rupture, etc.

  // Therapeutic Interventions
  inhaledPulmonaryVasodilatorActive: boolean; // Inhaled Epoprostenol or iNO
  vasopressorInotropeSupport: 'none' | 'norepinephrine_alone' | 'norepi_vasopressin_milrinone' | 'epinephrine_high_dose';
  aOkProtocolAdministered: boolean; // Atropine 1mg + Ondansetron 8mg + Ketorolac 30mg
  tranexamicAcidGiven: boolean; // TXA 1g IV
  fibrinogenReplacementUnits: number; // Cryoprecipitate units or grams of fibrinogen concentrate
  vaEcmoCannulated: boolean; // Veno-Arterial ECMO for refractory arrest/shock
}

export interface ClarkCriteriaAudit {
  cardiorespiratoryArrestOrSevereHypotension: boolean;
  overtDicDocumented: boolean;
  onsetDuringLaborOrWithin30Min: boolean;
  absenceOfFeverAndAlternativeEtiology: boolean;
  allCriteriaMet: boolean;
  diagnosticCertainty:
    | 'Definite AFE (Clark Criteria Confirmed)'
    | 'Probable AFE (Atypical Presentation)'
    | 'AFE Excluded / Alternative Etiology Likely';
  diagnosticSummary: string;
}

export interface DicAuditPregnancy {
  modifiedIsthScore: number; // 0 to 8
  isHypofibrinogenemiaCritical: boolean; // < 200 mg/dL (vital in pregnancy)
  consumptiveDicSeverity: 'None' | 'Moderate Coagulopathy' | 'Severe Overt Hyperfibrinolytic DIC';
  hemostaticSummary: string;
}

export interface RightHeartHemodynamicsAudit {
  corPulmonaleSeverity: 'Normal / Preserved' | 'Moderate RV Strain' | 'Catastrophic Acute Cor Pulmonale';
  isFluidLoadingHazardous: boolean;
  hemodynamicSummary: string;
}

export interface AfeManagementReport {
  clarkAudit: ClarkCriteriaAudit;
  dicAudit: DicAuditPregnancy;
  rvAudit: RightHeartHemodynamicsAudit;
  actionableDirectives: string[];
  contraindicatedActions: string[];
  ecmoEligibility: 'Not Indicated' | 'Consider Cannulation' | 'Immediate E-CPR / VA-ECMO Mandatory';
}

export interface AfeScenario {
  id: string;
  name: string;
  patientSummary: string;
  initialState: PatientAfeState;
  clinicalPearls: string[];
}

/**
 * 1. Audit Clark Diagnostic Criteria for AFE (SMFM 2016 Consensus)
 */
export function auditClarkCriteria(state: PatientAfeState): ClarkCriteriaAudit {
  const cardiorespiratoryArrestOrSevereHypotension =
    state.cardiorespiratoryArrest || state.systolicBpMmHg < 90 || state.spo2Percent < 90;

  // Pregnancy-modified DIC definition: Fibrinogen < 200 mg/dL, Platelets < 100k, or INR > 1.5
  const overtDicDocumented =
    state.serumFibrinogenMgDl < 200 ||
    state.plateletCountThousands < 100 ||
    state.prothrombinTimeInr > 1.5;

  const onsetDuringLaborOrWithin30Min = state.peripartumTimingMinutes <= 30;

  const absenceOfFeverAndAlternativeEtiology =
    state.temperatureCelsius < 38.0 && !state.alternativeEtiologyIdentified;

  const allCriteriaMet =
    cardiorespiratoryArrestOrSevereHypotension &&
    overtDicDocumented &&
    onsetDuringLaborOrWithin30Min &&
    absenceOfFeverAndAlternativeEtiology;

  let diagnosticCertainty: ClarkCriteriaAudit['diagnosticCertainty'] = 'Definite AFE (Clark Criteria Confirmed)';
  let diagnosticSummary = 'All 4 SMFM/Clark consensus criteria satisfied. Pathognomonic Amniotic Fluid Embolism.';

  if (allCriteriaMet) {
    diagnosticCertainty = 'Definite AFE (Clark Criteria Confirmed)';
  } else if (!absenceOfFeverAndAlternativeEtiology) {
    diagnosticCertainty = 'AFE Excluded / Alternative Etiology Likely';
    diagnosticSummary = state.temperatureCelsius >= 38.0
      ? 'Fever >= 38.0 C detected. Septic shock / chorioamnionitis or intra-amniotic infection strongly favored over pure AFE.'
      : 'Alternative primary etiology identified (e.g. massive pulmonary embolism, uterine rupture, anaphylaxis).';
  } else if (!onsetDuringLaborOrWithin30Min) {
    diagnosticCertainty = 'Probable AFE (Atypical Presentation)';
    diagnosticSummary = `Timing (${state.peripartumTimingMinutes} min post-delivery) exceeds strict 30-minute classic window. Consider delayed presentation or alternative diagnosis.`;
  } else {
    diagnosticCertainty = 'Probable AFE (Atypical Presentation)';
    diagnosticSummary = 'Incomplete criteria: Awaiting full consumptive DIC lab documentation or hemodynamic stabilization.';
  }

  return {
    cardiorespiratoryArrestOrSevereHypotension,
    overtDicDocumented,
    onsetDuringLaborOrWithin30Min,
    absenceOfFeverAndAlternativeEtiology,
    allCriteriaMet,
    diagnosticCertainty,
    diagnosticSummary,
  };
}

/**
 * 2. Calculate Pregnancy-Specific Modified ISTH DIC Score
 */
export function calculatePregnancyDic(state: PatientAfeState): DicAuditPregnancy {
  let score = 0;

  // Platelets in pregnancy
  if (state.plateletCountThousands < 50) score += 2;
  else if (state.plateletCountThousands < 100) score += 1;

  // PT / INR prolongation
  if (state.prothrombinTimeInr > 2.0) score += 2;
  else if (state.prothrombinTimeInr > 1.5) score += 1;

  // Fibrinogen in pregnancy (critical cutoff < 200 mg/dL because normal is 400-600)
  if (state.serumFibrinogenMgDl < 100) score += 3;
  else if (state.serumFibrinogenMgDl < 200) score += 2;

  // Massive D-Dimer
  if (state.dDimerUgl > 10000) score += 1;

  const isHypofibrinogenemiaCritical = state.serumFibrinogenMgDl < 200;

  let consumptiveDicSeverity: DicAuditPregnancy['consumptiveDicSeverity'] = 'None';
  let hemostaticSummary = 'Coagulation profile within physiological limits for pregnancy.';

  if (score >= 5 || state.serumFibrinogenMgDl < 150) {
    consumptiveDicSeverity = 'Severe Overt Hyperfibrinolytic DIC';
    hemostaticSummary = `Catastrophic consumptive coagulopathy (Score ${score}/8, Fibrinogen ${state.serumFibrinogenMgDl} mg/dL). Immediate cryoprecipitate / fibrinogen concentrate and TXA mandatory.`;
  } else if (score >= 3 || isHypofibrinogenemiaCritical) {
    consumptiveDicSeverity = 'Moderate Coagulopathy';
    hemostaticSummary = `Early DIC / consumption detected (Fibrinogen ${state.serumFibrinogenMgDl} < 200 mg/dL). Rapid progression expected.`;
  }

  return {
    modifiedIsthScore: score,
    isHypofibrinogenemiaCritical,
    consumptiveDicSeverity,
    hemostaticSummary,
  };
}

/**
 * 3. Evaluate Right Heart Hemodynamics & Acute Cor Pulmonale
 */
export function evaluateRightHeartHemodynamics(state: PatientAfeState): RightHeartHemodynamicsAudit {
  const { pulmonaryVascularResistanceDyns: pvr, rvLvDiameterRatio: ratio, septalDShapedFlattening: septalD } = state;

  let corPulmonaleSeverity: RightHeartHemodynamicsAudit['corPulmonaleSeverity'] = 'Normal / Preserved';
  let isFluidLoadingHazardous = false;
  let hemodynamicSummary = 'Right ventricular dimensions and pulmonary vascular resistance are within acceptable ranges.';

  if (pvr >= 400 || ratio >= 1.0 || septalD) {
    corPulmonaleSeverity = 'Catastrophic Acute Cor Pulmonale';
    isFluidLoadingHazardous = true;
    hemodynamicSummary = `Massive pulmonary vasoconstriction (PVR ${pvr} dyn*s/cm5) with severe RV dilation (RV/LV ${ratio.toFixed(2)}) and septal compression of LV. Aggressive IV fluid boluses will trigger fatal right ventricular ischemia!`;
  } else if (pvr > 250 || ratio >= 0.8) {
    corPulmonaleSeverity = 'Moderate RV Strain';
    isFluidLoadingHazardous = true;
    hemodynamicSummary = `Elevated PVR (${pvr} dyn*s/cm5) causing acute RV afterload mismatch. Restrict crystalloids and initiate targeted inodilators.`;
  }

  return {
    corPulmonaleSeverity,
    isFluidLoadingHazardous,
    hemodynamicSummary,
  };
}

/**
 * 4. Comprehensive Management & Resuscitation Directives
 */
export function generateAfeDirectives(state: PatientAfeState): AfeManagementReport {
  const clarkAudit = auditClarkCriteria(state);
  const dicAudit = calculatePregnancyDic(state);
  const rvAudit = evaluateRightHeartHemodynamics(state);

  const actionableDirectives: string[] = [];
  const contraindicatedActions: string[] = [];

  // Pulmonary Vasodilator Directive
  let pulmonaryVasodilatorDirective = 'Maintain standard mechanical ventilation.';
  if (rvAudit.corPulmonaleSeverity !== 'Normal / Preserved') {
    if (state.inhaledPulmonaryVasodilatorActive) {
      pulmonaryVasodilatorDirective = 'Inhaled pulmonary vasodilator active (Epoprostenol / iNO), successfully reducing RV afterload without systemic vasodilation.';
      actionableDirectives.push('Continue Inhaled Epoprostenol (50 ng/kg/min) or iNO (20-40 ppm) to offload the failing right ventricle.');
    } else {
      pulmonaryVasodilatorDirective = 'URGENT: Initiate Inhaled Epoprostenol (Prostacyclin) or iNO. Selective pulmonary vasodilation prevents acute RV decompression failure.';
      actionableDirectives.push('Deploy Inhaled Prostacyclin / Epoprostenol STAT.');
    }
  }

  // Vasopressor / Inotrope Directive
  let vasopressorInotropeDirective = 'Support MAP >= 65 mmHg with Norepinephrine + Vasopressin.';
  if (state.vasopressorInotropeSupport === 'epinephrine_high_dose') {
    actionableDirectives.push('High-dose Epinephrine in progress for cardiopulmonary resuscitation.');
  } else if (state.vasopressorInotropeSupport === 'norepi_vasopressin_milrinone') {
    actionableDirectives.push('Balanced multimodal support: Norepinephrine restores systemic MAP, Vasopressin spares pulmonary vasculature, Milrinone provides inotropic support.');
  } else if (state.vasopressorInotropeSupport === 'norepinephrine_alone') {
    actionableDirectives.push('Add Vasopressin (0.03 units/min) to reduce Norepinephrine requirements and avoid pulmonary vasoconstriction.');
  }

  // Hemostatic Resuscitation Directive
  let hemostaticResuscitationDirective = 'Monitor fibrinogen q30-60min.';
  if (dicAudit.isHypofibrinogenemiaCritical) {
    hemostaticResuscitationDirective = 'CRITICAL HYPOFIBRINOGENEMIA: Transfuse Cryoprecipitate (10-20 units) or Fibrinogen Concentrate (2-4g) to maintain Fibrinogen > 200 mg/dL.';
    actionableDirectives.push(hemostaticResuscitationDirective);
    if (!state.tranexamicAcidGiven) {
      actionableDirectives.push('Administer Tranexamic Acid (TXA) 1g IV over 10 min immediately to halt hyperfibrinolysis.');
    }
  }

  // A-OK Protocol
  let aOkProtocolStatus = 'A-OK Protocol (Atropine 1mg, Ondansetron 8mg, Ketorolac 30mg) not administered.';
  if (state.aOkProtocolAdministered) {
    aOkProtocolStatus = 'A-OK Protocol administered: Vagal block (Atropine), 5-HT3 blockade against pulmonary spasm (Ondansetron), and TXA2 inhibition (Ketorolac).';
    actionableDirectives.push('A-OK triple therapy active; monitoring for hemodynamics response.');
  } else {
    actionableDirectives.push('Consider A-OK regimen (Atropine 1mg, Ondansetron 8mg, Ketorolac 30mg) to blunt serotonin/thromboxane cascade.');
  }

  // Contraindications
  if (rvAudit.isFluidLoadingHazardous) {
    contraindicatedActions.push('DO NOT FLUID OVERLOAD: Aggressive crystalloid boluses will dilate the failing RV, worsen septal inversion, and precipitate asystole.');
  }
  if (!state.tranexamicAcidGiven && dicAudit.consumptiveDicSeverity === 'Severe Overt Hyperfibrinolytic DIC') {
    contraindicatedActions.push('DO NOT DELAY TXA: Hyperfibrinolysis peaks in the first 60 minutes.');
  }

  // ECMO Eligibility
  let ecmoEligibility: AfeManagementReport['ecmoEligibility'] = 'Not Indicated';
  if (state.cardiorespiratoryArrest) {
    ecmoEligibility = 'Immediate E-CPR / VA-ECMO Mandatory';
    actionableDirectives.push('E-CPR PROTOCOL ACTIVATION: Deploy cannulation team for Veno-Arterial (VA) ECMO while performing continuous high-quality chest compressions with left uterine displacement.');
  } else if (state.systolicBpMmHg < 75 && state.leftVentricularEjectionFractionPercent < 25) {
    ecmoEligibility = 'Consider Cannulation';
    actionableDirectives.push('Alert Cardiac Surgery / Perfusion for VA-ECMO salvage due to refractory biventricular failure.');
  }

  return {
    clarkAudit,
    dicAudit,
    rvAudit,
    actionableDirectives,
    contraindicatedActions,
    ecmoEligibility,
  };
}

/**
 * 5. High-Acuity Amniotic Fluid Embolism Scenarios
 */
export const AFE_SCENARIOS: Record<string, AfeScenario> = {
  peripartum_sudden_collapse_phase1: {
    id: 'peripartum_sudden_collapse_phase1',
    name: '1. Phase 1 Crisis: Peripartum Collapse & Acute Cor Pulmonale',
    patientSummary:
      '29yo G2P1 at 39 weeks in second stage of labor. Sudden gasp, agitation, generalized seizure-like tonic posturing, profound cyanosis, and pulseless electrical activity (PEA). Bedside echo shows massive RV dilation with flattened D-shaped LV.',
    initialState: {
      patientAge: 29,
      gestationalWeeks: 39,
      peripartumTimingMinutes: -5,
      currentPhase: 'phase_1_acute_cor_pulmonale',
      cardiorespiratoryArrest: true,
      systolicBpMmHg: 52,
      diastolicBpMmHg: 28,
      heartRateBpm: 42,
      spo2Percent: 68,
      fio2Percent: 100,
      pulmonaryVascularResistanceDyns: 720,
      rvLvDiameterRatio: 1.35,
      septalDShapedFlattening: true,
      leftVentricularEjectionFractionPercent: 45,
      plateletCountThousands: 110,
      serumFibrinogenMgDl: 180,
      prothrombinTimeInr: 1.4,
      dDimerUgl: 18400,
      temperatureCelsius: 37.1,
      alternativeEtiologyIdentified: false,
      inhaledPulmonaryVasodilatorActive: false,
      vasopressorInotropeSupport: 'epinephrine_high_dose',
      aOkProtocolAdministered: false,
      tranexamicAcidGiven: false,
      fibrinogenReplacementUnits: 0,
      vaEcmoCannulated: false,
    },
    clinicalPearls: [
      'Phase 1 is dominated by catastrophic pulmonary vasoconstriction (PVR > 700) and acute right heart failure.',
      'Perform manual left uterine displacement (LUD) or emergent perimortem cesarean delivery (resuscitative hysterotomy) within 4-5 minutes if no ROSC.',
      'Avoid crystalloid boluses; fluid overloading a severely failing right ventricle precipitates fatal cardiogenic shock.',
    ],
  },
  postpartum_exsanguinating_dic_phase2: {
    id: 'postpartum_exsanguinating_dic_phase2',
    name: '2. Phase 2 Crisis: Postpartum Uterine Atony & Consumptive DIC',
    patientSummary:
      '34yo G3P2 15 minutes post-delivery of healthy infant. Sudden profuse vaginal hemorrhage unresponsive to oxytocin and carboprost, bleeding from venipuncture sites, SBP 68/38 mmHg, HR 138 bpm. Fibrinogen is 75 mg/dL with severe hyperfibrinolysis.',
    initialState: {
      patientAge: 34,
      gestationalWeeks: 39,
      peripartumTimingMinutes: 15,
      currentPhase: 'phase_2_lv_atony_and_dic',
      cardiorespiratoryArrest: false,
      systolicBpMmHg: 68,
      diastolicBpMmHg: 38,
      heartRateBpm: 138,
      spo2Percent: 91,
      fio2Percent: 60,
      pulmonaryVascularResistanceDyns: 320,
      rvLvDiameterRatio: 0.95,
      septalDShapedFlattening: false,
      leftVentricularEjectionFractionPercent: 28,
      plateletCountThousands: 48,
      serumFibrinogenMgDl: 75,
      prothrombinTimeInr: 2.3,
      dDimerUgl: 34000,
      temperatureCelsius: 36.8,
      alternativeEtiologyIdentified: false,
      inhaledPulmonaryVasodilatorActive: true,
      vasopressorInotropeSupport: 'norepi_vasopressin_milrinone',
      aOkProtocolAdministered: false,
      tranexamicAcidGiven: false,
      fibrinogenReplacementUnits: 0,
      vaEcmoCannulated: false,
    },
    clinicalPearls: [
      'Phase 2 is characterized by explosive consumptive coagulopathy and secondary LV myocardial depression.',
      'Normal pregnancy fibrinogen is 400-600 mg/dL; a level of 75 mg/dL is lethal without immediate cryoprecipitate or fibrinogen concentrate.',
      'Administer IV Tranexamic Acid (TXA 1g) immediately along with massive transfusion protocol (1:1:1).',
    ],
  },
  aok_mitigated_stable: {
    id: 'aok_mitigated_stable',
    name: '3. Rapid Intervention: A-OK Protocol & Inhaled Epoprostenol Success',
    patientSummary:
      '26yo G1P0 at 40 weeks experiencing sudden restlessness, dyspnea, and transient hypotension (SBP 82 mmHg) at delivery. Rapid recognition prompted immediate A-OK administration, Inhaled Epoprostenol, and prophylactic Cryoprecipitate.',
    initialState: {
      patientAge: 26,
      gestationalWeeks: 40,
      peripartumTimingMinutes: 5,
      currentPhase: 'phase_1_acute_cor_pulmonale',
      cardiorespiratoryArrest: false,
      systolicBpMmHg: 104,
      diastolicBpMmHg: 66,
      heartRateBpm: 94,
      spo2Percent: 97,
      fio2Percent: 40,
      pulmonaryVascularResistanceDyns: 210,
      rvLvDiameterRatio: 0.72,
      septalDShapedFlattening: false,
      leftVentricularEjectionFractionPercent: 50,
      plateletCountThousands: 125,
      serumFibrinogenMgDl: 240,
      prothrombinTimeInr: 1.2,
      dDimerUgl: 8200,
      temperatureCelsius: 37.0,
      alternativeEtiologyIdentified: false,
      inhaledPulmonaryVasodilatorActive: true,
      vasopressorInotropeSupport: 'norepinephrine_alone',
      aOkProtocolAdministered: true,
      tranexamicAcidGiven: true,
      fibrinogenReplacementUnits: 10,
      vaEcmoCannulated: false,
    },
    clinicalPearls: [
      'Early A-OK blocks the anaphylactoid cascade (serotonin, thromboxane, and vagal bradycardia).',
      'Inhaled prostacyclin selectively offloads the right ventricle, preventing acute RV dilation and PEA arrest.',
      'Fibrinogen maintained > 200 mg/dL through early cryoprecipitate replacement prevents uncontrolled atonic hemorrhage.',
    ],
  },
  mimic_septic_chorioamnionitis: {
    id: 'mimic_septic_chorioamnionitis',
    name: '4. Diagnostic Mimic: Intrapartum Septic Shock (Clark Non-AFE)',
    patientSummary:
      '31yo G2P1 with prolonged rupture of membranes (28 hours). Intrapartum collapse with SBP 78/40 mmHg, tachycardia 132 bpm, but temperature is 39.2 C, purulent amniotic fluid, and fibrinogen is elevated at 520 mg/dL.',
    initialState: {
      patientAge: 31,
      gestationalWeeks: 38,
      peripartumTimingMinutes: -45,
      currentPhase: 'phase_1_acute_cor_pulmonale',
      cardiorespiratoryArrest: false,
      systolicBpMmHg: 78,
      diastolicBpMmHg: 40,
      heartRateBpm: 132,
      spo2Percent: 93,
      fio2Percent: 50,
      pulmonaryVascularResistanceDyns: 110,
      rvLvDiameterRatio: 0.52,
      septalDShapedFlattening: false,
      leftVentricularEjectionFractionPercent: 55,
      plateletCountThousands: 210,
      serumFibrinogenMgDl: 520,
      prothrombinTimeInr: 1.1,
      dDimerUgl: 3100,
      temperatureCelsius: 39.2,
      alternativeEtiologyIdentified: false,
      inhaledPulmonaryVasodilatorActive: false,
      vasopressorInotropeSupport: 'norepinephrine_alone',
      aOkProtocolAdministered: false,
      tranexamicAcidGiven: false,
      fibrinogenReplacementUnits: 0,
      vaEcmoCannulated: false,
    },
    clinicalPearls: [
      'Fever (>= 38.0 C) is an explicit exclusion criterion under Clark/SMFM criteria.',
      'Normal or elevated fibrinogen (520 mg/dL) rules out the profound consumptive DIC pathognomonic of true AFE.',
      'Primary diagnosis is severe chorioamnionitis and septic shock; treat with broad-spectrum IV antibiotics and fluid resuscitation.',
    ],
  },
};
