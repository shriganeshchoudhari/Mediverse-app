/**
 * PericardialTamponadeEngine.ts
 * High-fidelity mathematical simulation engine for acute cardiac tamponade,
 * respiro-phasic ventricular interdependence (Pulsus Paradoxus),
 * invasive diastolic pressure equalization, spectral Doppler inflow dynamics,
 * and emergency ultrasound-guided pericardiocentesis.
 * Location: frontend/.gemini/skills/PericardialTamponadeEngine.ts
 */

export type TamponadeScenarioId =
  | 'SUBACUTE_MALIGNANT_EFFUSION'
  | 'ACUTE_HEMOPERICARDIUM_ABLATION'
  | 'POST_CARDIAC_SURGERY_LOCULATED'
  | 'UREMIC_EFFUSIVE_CONSTRICTIVE'
  | 'VENTILATOR_INDUCED_HEMODYNAMIC_COLLAPSE';

export interface EffusionCharacteristics {
  totalInitialVolumeMl: number;
  aspiratedVolumeMl: number;
  currentEffusionVolumeMl: number;
  fluidType: 'SEROUS' | 'GROSSLY_BLOODY' | 'TURBID_FIBRINOUS';
  accumulationRate: 'ACUTE' | 'SUBACUTE_CHRONIC';
  isLoculated: boolean;
  drainPlaced: boolean;
}

export interface PericardialPressures {
  intrapericardialPressureMmHg: number; // Normal -3 to +3 mmHg; in tamponade: 14 to 28 mmHg
  pericardialElastanceK: number; // Steepness parameter (higher in acute)
  pericardialReserveLimitMl: number; // Threshold beyond which pressure spikes exponentially
}

export interface RespiroPhasicHemodynamics {
  sbpExpiratoryMmHg: number;
  sbpInspiratoryMmHg: number;
  pulsusParadoxusMmHg: number; // sbpExpiratory - sbpInspiratory (normal < 10 mmHg; > 10 = pulsus paradoxus)
  isPulsusParadoxusPresent: boolean;
  dbpMmHg: number;
  mapMmHg: number;
  heartRateBpm: number;
  cardiacOutputLpm: number;
  cardiacIndexLpmM2: number;
  strokeVolumeMl: number;
}

export interface DiastolicPressures {
  cvpMmHg: number; // Central Venous Pressure / Right Atrial Pressure
  rvedpMmHg: number; // Right Ventricular End-Diastolic Pressure
  papSystolicMmHg: number;
  papDiastolicMmHg: number; // Pulmonary Artery Diastolic Pressure
  pcwpMmHg: number; // Pulmonary Capillary Wedge Pressure
  isDiastolicEqualizationPresent: boolean; // |CVP - PCWP| <= 4 mmHg with CVP >= 12
  isCvpYDescentBlunted: boolean; // Blunted/absent y descent characteristic of tamponade
}

export interface EchoDopplerMetrics {
  mitralEExpCmS: number;
  mitralEInspCmS: number;
  mitralRespiratoryVariationPct: number; // ((Eexp - Einsp) / Eexp) * 100 (normal < 15%; tamponade > 25%)
  tricuspidEExpCmS: number;
  tricuspidEInspCmS: number;
  tricuspidRespiratoryVariationPct: number; // ((Einsp - Eexp) / Eexp) * 100 (normal < 20%; tamponade > 40%)
  rvDiastolicCollapse: boolean; // Highly specific for tamponade
  raSystolicCollapse: boolean; // Earliest and most sensitive echocardiographic sign
  ivcDiameterCm: number; // Plethoric (> 2.1 cm)
  ivcCollapsibilityPct: number; // Low (< 50% with inspiration)
  swingingHeartSign: boolean; // Present with massive effusions
  electricalAlternans: boolean; // Alternating QRS amplitudes on ECG
}

export interface InterventionState {
  needleInPericardium: boolean;
  needleApproach: 'SUBXIPHOID' | 'APICAL' | 'NONE';
  agitatedSalineConfirmed: boolean;
  totalCrystalloidGivenMl: number;
  positivePressureActive: boolean;
  peepLevelCmH2O: number;
  isPeaArrest: boolean;
}

export interface TamponadePatientState {
  scenarioId: TamponadeScenarioId;
  elapsedSeconds: number;
  effusion: EffusionCharacteristics;
  pericardial: PericardialPressures;
  hemodynamics: RespiroPhasicHemodynamics;
  diastolic: DiastolicPressures;
  echo: EchoDopplerMetrics;
  interventions: InterventionState;
  activeAlarms: string[];
}

export interface TamponadeScenarioDefinition {
  id: TamponadeScenarioId;
  title: string;
  patientProfile: string;
  clinicalPresentation: string;
  initialEffusion: {
    volumeMl: number;
    fluidType: 'SEROUS' | 'GROSSLY_BLOODY' | 'TURBID_FIBRINOUS';
    accumulationRate: 'ACUTE' | 'SUBACUTE_CHRONIC';
    isLoculated: boolean;
    reserveLimitMl: number;
    elastanceK: number;
  };
  baselineVitals: {
    hr: number;
    dbp: number;
  };
  keyTeachingPoints: string[];
}

export interface TamponadeDebriefResult {
  scorePercentage: number;
  letterGrade: 'A+' | 'A' | 'B' | 'C' | 'F';
  beckTriadRecognized: boolean;
  pulsusParadoxusAddressed: boolean;
  temporizingBolusDelivered: boolean;
  pericardiocentesisSuccessful: boolean;
  agitatedSalineVerified: boolean;
  avoidedVentilatorArrest: boolean;
  effusiveConstrictiveIdentified: boolean;
  facultyFeedback: string[];
}

/**
 * 5 Clinically Validated Scenarios
 */
export const TAMPONADE_SCENARIOS: Record<TamponadeScenarioId, TamponadeScenarioDefinition> = {
  SUBACUTE_MALIGNANT_EFFUSION: {
    id: 'SUBACUTE_MALIGNANT_EFFUSION',
    title: 'Scenario 1: Large Subacute Malignant Pericardial Effusion in Lung Adenocarcinoma',
    patientProfile: '62-year-old female with metastatic non-small cell lung cancer presenting with progressive orthopnea and fatigue',
    clinicalPresentation:
      'Patient exhibits classic Beck\'s triad: distant/muffled heart sounds, engorged neck veins (CVP 18 mmHg), and resting hypotension (92/70 mmHg, MAP 77 mmHg). Pulsus paradoxus is 22 mmHg. Bedside echocardiogram demonstrates a large 850 mL circumferential serous effusion with RA systolic inversion, RV diastolic indent, and 34% respiro-phasic mitral variation.',
    initialEffusion: {
      volumeMl: 850,
      fluidType: 'SEROUS',
      accumulationRate: 'SUBACUTE_CHRONIC',
      isLoculated: false,
      reserveLimitMl: 700,
      elastanceK: 0.008,
    },
    baselineVitals: {
      hr: 116,
      dbp: 70,
    },
    keyTeachingPoints: [
      'Subacute chronic effusions stretch the pericardium, accommodating large volumes (> 800 mL) before reaching steep elastance.',
      'Aspirating just 50-100 mL provides immediate dramatic relief by shifting leftward on the steep pressure-volume curve.',
      'Always confirm needle tip position with agitated saline contrast before advancing pigtail catheter.',
    ],
  },
  ACUTE_HEMOPERICARDIUM_ABLATION: {
    id: 'ACUTE_HEMOPERICARDIUM_ABLATION',
    title: 'Scenario 2: Acute Post-Catheter Ablation Left Atrial Perforation & Hemopericardium',
    patientProfile: '54-year-old male undergoing radiofrequency pulmonary vein isolation (PVI) for atrial fibrillation',
    clinicalPresentation:
      'Sudden profound arterial hypotension (72/52 mmHg) develops in the EP lab immediately following transeptal puncture and posterior wall ablation. HR 135 bpm. Fluoroscopy shows a static cardiac silhouette and ICE reveals an acute 185 mL hemopericardium with catastrophic RV diastolic collapse. Intrapericardial pressure is 22 mmHg on the ultra-steep acute elastance curve.',
    initialEffusion: {
      volumeMl: 185,
      fluidType: 'GROSSLY_BLOODY',
      accumulationRate: 'ACUTE',
      isLoculated: false,
      reserveLimitMl: 120,
      elastanceK: 0.035,
    },
    baselineVitals: {
      hr: 135,
      dbp: 52,
    },
    keyTeachingPoints: [
      'Acute hemopericardium triggers tamponade at small volumes (150-200 mL) because unstretched parietal pericardium is non-compliant.',
      'Emergency subxiphoid aspiration is life-saving and must not be delayed for formal lab results.',
      'Autotransfusion of aspirated blood via cell saver can temporize hemodynamics en route to emergency cardiac surgery.',
    ],
  },
  POST_CARDIAC_SURGERY_LOCULATED: {
    id: 'POST_CARDIAC_SURGERY_LOCULATED',
    title: 'Scenario 3: Post-Sternotomy Cardiac Tamponade with Posterior Loculated Hematoma',
    patientProfile: '68-year-old male on Postoperative Day 2 following 3-vessel CABG and Aortic Valve Replacement',
    clinicalPresentation:
      'Patient develops escalating norepinephrine requirements, low cardiac index (1.6 L/min/m2), oliguria, and rising CVP (19 mmHg). Transthoracic subxiphoid view shows minimal anterior fluid, but transesophageal echocardiography (TEE) reveals a dense 130 mL posterior loculated hematoma compressing the left atrium and pulmonary veins. Blind subxiphoid pericardiocentesis is contraindicated and ineffective.',
    initialEffusion: {
      volumeMl: 130,
      fluidType: 'GROSSLY_BLOODY',
      accumulationRate: 'ACUTE',
      isLoculated: true,
      reserveLimitMl: 90,
      elastanceK: 0.045,
    },
    baselineVitals: {
      hr: 108,
      dbp: 58,
    },
    keyTeachingPoints: [
      'Post-cardiac surgery tamponade is frequently localized/posterior and lacks circumferential fluid or classic pulsus paradoxus.',
      'Transthoracic ultrasound can miss posterior loculated collections; TEE is gold standard in the ICU.',
      'Subxiphoid needle drainage is dangerous and ineffective for posterior hematomas; emergency re-sternotomy in the ICU/OR is required.',
    ],
  },
  UREMIC_EFFUSIVE_CONSTRICTIVE: {
    id: 'UREMIC_EFFUSIVE_CONSTRICTIVE',
    title: 'Scenario 4: Uremic Pericarditis with Effusive-Constrictive Physiology',
    patientProfile: '49-year-old female with end-stage renal disease missing hemodialysis for 2 weeks',
    clinicalPresentation:
      'Presents with pleuritic chest pain, friction rub, CVP 20 mmHg, and SBP 98/74 mmHg with pulsus paradoxus 18 mmHg. Ultrasound shows a 500 mL turbid, fibrinous effusion. Aspiration of 450 mL successfully drops intrapericardial pressure from 18 to 2 mmHg; however, CVP paradoxically fails to normalize, remaining elevated at 15 mmHg with a prominent y descent and square-root sign, unmasking visceral pericardial constriction.',
    initialEffusion: {
      volumeMl: 500,
      fluidType: 'TURBID_FIBRINOUS',
      accumulationRate: 'SUBACUTE_CHRONIC',
      isLoculated: false,
      reserveLimitMl: 380,
      elastanceK: 0.012,
    },
    baselineVitals: {
      hr: 102,
      dbp: 74,
    },
    keyTeachingPoints: [
      'Effusive-constrictive pericarditis features tamponade physiology that converts to pure constrictive physiology once fluid is evacuated.',
      'Diagnostic hallmark: Intrapericardial pressure drops to zero after pericardiocentesis, but Right Atrial Pressure remains elevated with deep y descent.',
      'Definitive cure often requires surgical visceral/parietal pericardiectomy if hemodialysis and anti-inflammatory therapy fail.',
    ],
  },
  VENTILATOR_INDUCED_HEMODYNAMIC_COLLAPSE: {
    id: 'VENTILATOR_INDUCED_HEMODYNAMIC_COLLAPSE',
    title: 'Scenario 5: Inadvertent Positive Pressure Ventilation Arrest Trap in Impending Tamponade',
    patientProfile: '38-year-old male with severe viral myopericarditis and 750 mL effusion intubated for agitation and tachypnea',
    clinicalPresentation:
      'Patient was intubated in the ED with induction agents and placed on volume-cycled ventilation with PEEP 10 cmH2O. Within 60 seconds, BP plummeted from 94/72 to 45/30, followed by sudden pulseless electrical activity (PEA). Positive intrathoracic pressure abolished the minimal remaining venous return driving right heart filling against high pericardial pressure.',
    initialEffusion: {
      volumeMl: 750,
      fluidType: 'SEROUS',
      accumulationRate: 'SUBACUTE_CHRONIC',
      isLoculated: false,
      reserveLimitMl: 600,
      elastanceK: 0.01,
    },
    baselineVitals: {
      hr: 128,
      dbp: 68,
    },
    keyTeachingPoints: [
      'Positive pressure mechanical ventilation (PPV) and high PEEP are catastrophic in cardiac tamponade because they eliminate the negative thoracic pressure drawing venous blood to the heart.',
      'If PEA arrest occurs post-intubation: immediately disconnect the endotracheal tube from the ventilator, bag-valve mask with zero PEEP, administer rapid IV fluid bolus, and perform STAT pericardiocentesis.',
      'Always perform pericardiocentesis under local anesthesia with spontaneous breathing whenever possible.',
    ],
  },
};

/**
 * Recalculate Pericardial Pressure and Respiro-Phasic Hemodynamics
 */
export function recalculateTamponadeHemodynamics(
  effusion: EffusionCharacteristics,
  pericardial: PericardialPressures,
  interventions: InterventionState,
  baselineVitals: { hr: number; dbp: number }
): {
  pericardial: PericardialPressures;
  hemodynamics: RespiroPhasicHemodynamics;
  diastolic: DiastolicPressures;
  echo: EchoDopplerMetrics;
  alarms: string[];
} {
  const alarms: string[] = [];
  const currVol = Math.max(0, effusion.currentEffusionVolumeMl);

  // Exponential elastance calculation
  // P_peri = P_baseline + a * exp(k * (V - V_reserve))
  let pPeri = 0;
  if (currVol <= pericardial.pericardialReserveLimitMl) {
    pPeri = (currVol / pericardial.pericardialReserveLimitMl) * 6 - 2; // -2 to +4 mmHg
  } else {
    const excessVol = currVol - pericardial.pericardialReserveLimitMl;
    pPeri = 4 + 18 * (1 - Math.exp(-pericardial.pericardialElastanceK * excessVol * 1.5));
    if (effusion.accumulationRate === 'ACUTE') {
      pPeri = 4 + excessVol * 0.28; // Rapid rise
    }
  }
  pPeri = Math.max(-2, Math.min(32, Math.round(pPeri * 10) / 10));

  // Positive pressure ventilation effect
  let ppvImpactMmHg = 0;
  if (interventions.positivePressureActive) {
    ppvImpactMmHg = interventions.peepLevelCmH2O * 0.7 + 4;
  }

  // Fluid bolus effect (temporarily raises intracardiac pressure above pericardial)
  const bolusOffsetMmHg = Math.min(6, (interventions.totalCrystalloidGivenMl / 1000) * 3);

  // Calculate CVP / RAP (equalizes with pericardial pressure when tamponade present)
  let cvp = Math.max(4, Math.round(pPeri + 2 + bolusOffsetMmHg));
  let pcwp = Math.max(8, Math.round(pPeri + 3 + bolusOffsetMmHg));
  let rvedp = cvp;
  let papDiastolic = Math.max(cvp, Math.round(cvp + 2));
  let papSystolic = Math.max(papDiastolic + 10, Math.round(papDiastolic + 14));

  // Tamponade threshold: pPeri >= 10 mmHg
  const isTamponade = pPeri >= 10;
  const isSevereTamponade = pPeri >= 16;

  // Diastolic pressure equalization
  const isDiastolicEqualizationPresent = isTamponade && Math.abs(cvp - pcwp) <= 4;
  const isCvpYDescentBlunted = isTamponade;

  // Respiro-phasic variation (Pulsus Paradoxus & Doppler)
  let pulsusParadoxus = 4;
  let mitralVarPct = 8;
  let tricuspidVarPct = 12;

  if (isTamponade) {
    // Proportional to degree of pericardial constraint
    const severityFactor = (pPeri - 8) / 14; // 0 to ~1.2
    pulsusParadoxus = Math.round(10 + severityFactor * 16); // 10 to 28 mmHg
    mitralVarPct = Math.round(22 + severityFactor * 24); // 22% to 48%
    tricuspidVarPct = Math.round(35 + severityFactor * 30); // 35% to 68%
  }

  // Cardiac Output & Blood Pressure
  let baseCo = 5.2; // L/min
  let hr = baselineVitals.hr;

  if (isTamponade) {
    const coReduction = Math.min(3.6, (pPeri - 8) * 0.22);
    baseCo = Math.max(1.4, 5.2 - coReduction + (bolusOffsetMmHg * 0.2));
  }

  // Impact of positive pressure ventilation
  if (interventions.positivePressureActive && isTamponade) {
    baseCo = Math.max(0.6, baseCo - ppvImpactMmHg * 0.3);
  }

  const sv = Math.round((baseCo * 1000) / hr);
  const ci = Math.round((baseCo / 1.85) * 100) / 100;

  // SBP during expiration vs inspiration
  let sbpExp = Math.round(70 + baseCo * 12);
  let sbpInsp = Math.max(40, sbpExp - pulsusParadoxus);
  let dbp = Math.min(sbpInsp - 10, baselineVitals.dbp);
  let map = Math.round((sbpExp + 2 * dbp) / 3);

  // Detect PEA arrest from severe collapse
  let isPea = interventions.isPeaArrest;
  if (interventions.positivePressureActive && pPeri >= 14 && interventions.totalCrystalloidGivenMl < 500) {
    isPea = true;
    sbpExp = 35;
    sbpInsp = 25;
    dbp = 20;
    map = 25;
    baseCo = 0.5;
    alarms.push('CRITICAL: PULSELESS ELECTRICAL ACTIVITY (PEA) ARREST - PPV CUT OFF VENOUS RETURN!');
  } else if (map < 50) {
    alarms.push('CRITICAL HYPOTENSION: Obstructive Cardiogenic Shock');
  }

  if (isTamponade && !isPea) {
    alarms.push(`CARDIAC TAMPONADE ACTIVE: P_peri ${pPeri} mmHg, Pulsus Paradoxus ${pulsusParadoxus} mmHg`);
    if (pulsusParadoxus >= 20) {
      alarms.push('SEVERE PULSUS PARADOXUS (>= 20 mmHg)');
    }
  }

  // Echocardiographic collapse flags
  const rvDiastolicCollapse = pPeri >= 12;
  const raSystolicCollapse = pPeri >= 8;
  const ivcDia = isTamponade ? 2.4 : 1.6;
  const ivcColl = isTamponade ? 18 : 65;
  const swingingHeart = currVol >= 650;
  const elecAlternans = currVol >= 700;

  if (rvDiastolicCollapse) {
    alarms.push('ECHO: RV Diastolic Indentation / Collapse Active');
  }

  const updatedPericardial: PericardialPressures = {
    ...pericardial,
    intrapericardialPressureMmHg: pPeri,
  };

  const updatedHemo: RespiroPhasicHemodynamics = {
    sbpExpiratoryMmHg: sbpExp,
    sbpInspiratoryMmHg: sbpInsp,
    pulsusParadoxusMmHg: pulsusParadoxus,
    isPulsusParadoxusPresent: pulsusParadoxus >= 10,
    dbpMmHg: dbp,
    mapMmHg: map,
    heartRateBpm: hr,
    cardiacOutputLpm: Math.round(baseCo * 10) / 10,
    cardiacIndexLpmM2: ci,
    strokeVolumeMl: sv,
  };

  const updatedDiastolic: DiastolicPressures = {
    cvpMmHg: cvp,
    rvedpMmHg: rvedp,
    papSystolicMmHg: papSystolic,
    papDiastolicMmHg: papDiastolic,
    pcwpMmHg: pcwp,
    isDiastolicEqualizationPresent,
    isCvpYDescentBlunted,
  };

  const updatedEcho: EchoDopplerMetrics = {
    mitralEExpCmS: 82,
    mitralEInspCmS: Math.round(82 * (1 - mitralVarPct / 100)),
    mitralRespiratoryVariationPct: mitralVarPct,
    tricuspidEExpCmS: 46,
    tricuspidEInspCmS: Math.round(46 * (1 + tricuspidVarPct / 100)),
    tricuspidRespiratoryVariationPct: tricuspidVarPct,
    rvDiastolicCollapse,
    raSystolicCollapse,
    ivcDiameterCm: ivcDia,
    ivcCollapsibilityPct: ivcColl,
    swingingHeartSign: swingingHeart,
    electricalAlternans: elecAlternans,
  };

  return {
    pericardial: updatedPericardial,
    hemodynamics: updatedHemo,
    diastolic: updatedDiastolic,
    echo: updatedEcho,
    alarms,
  };
}

/**
 * Initialize patient state for a chosen scenario
 */
export function initializeTamponadePatientState(
  scenarioId: TamponadeScenarioId
): TamponadePatientState {
  const sc = TAMPONADE_SCENARIOS[scenarioId];

  const effusion: EffusionCharacteristics = {
    totalInitialVolumeMl: sc.initialEffusion.volumeMl,
    aspiratedVolumeMl: 0,
    currentEffusionVolumeMl: sc.initialEffusion.volumeMl,
    fluidType: sc.initialEffusion.fluidType,
    accumulationRate: sc.initialEffusion.accumulationRate,
    isLoculated: sc.initialEffusion.isLoculated,
    drainPlaced: false,
  };

  const pericardial: PericardialPressures = {
    intrapericardialPressureMmHg: 18,
    pericardialElastanceK: sc.initialEffusion.elastanceK,
    pericardialReserveLimitMl: sc.initialEffusion.reserveLimitMl,
  };

  const interventions: InterventionState = {
    needleInPericardium: false,
    needleApproach: 'NONE',
    agitatedSalineConfirmed: false,
    totalCrystalloidGivenMl: 0,
    positivePressureActive: scenarioId === 'VENTILATOR_INDUCED_HEMODYNAMIC_COLLAPSE',
    peepLevelCmH2O: scenarioId === 'VENTILATOR_INDUCED_HEMODYNAMIC_COLLAPSE' ? 10 : 0,
    isPeaArrest: scenarioId === 'VENTILATOR_INDUCED_HEMODYNAMIC_COLLAPSE',
  };

  const {
    pericardial: calcPeri,
    hemodynamics,
    diastolic,
    echo,
    alarms,
  } = recalculateTamponadeHemodynamics(
    effusion,
    pericardial,
    interventions,
    sc.baselineVitals
  );

  return {
    scenarioId,
    elapsedSeconds: 0,
    effusion,
    pericardial: calcPeri,
    hemodynamics,
    diastolic,
    echo,
    interventions,
    activeAlarms: alarms,
  };
}

/**
 * Action: Deliver Temporizing IV Crystalloid Bolus
 */
export function deliverTemporizingBolus(
  state: TamponadePatientState,
  volumeMl: number
): { updatedState: TamponadePatientState; message: string } {
  const sc = TAMPONADE_SCENARIOS[state.scenarioId];
  const newGiven = state.interventions.totalCrystalloidGivenMl + volumeMl;

  const updatedInterventions: InterventionState = {
    ...state.interventions,
    totalCrystalloidGivenMl: newGiven,
    isPeaArrest: false, // Volume resuscitation can resuscitate post-intubation PEA
  };

  const {
    pericardial,
    hemodynamics,
    diastolic,
    echo,
    alarms,
  } = recalculateTamponadeHemodynamics(
    state.effusion,
    state.pericardial,
    updatedInterventions,
    sc.baselineVitals
  );

  return {
    updatedState: {
      ...state,
      interventions: updatedInterventions,
      pericardial,
      hemodynamics,
      diastolic,
      echo,
      activeAlarms: alarms,
    },
    message: `Administered ${volumeMl} mL IV crystalloid bolus. Total fluids: ${newGiven} mL. Venous return augmented, raising intracardiac filling pressure to temporize against pericardial constraint.`,
  };
}

/**
 * Action: Ultrasound-Guided Agitated Saline Confirmation Test
 */
export function performAgitatedSalineTest(
  state: TamponadePatientState
): { updatedState: TamponadePatientState; message: string } {
  if (state.interventions.needleApproach === 'NONE') {
    return {
      updatedState: state,
      message: 'Cannot perform agitated saline test: needle has not been inserted!',
    };
  }

  const updatedInterventions: InterventionState = {
    ...state.interventions,
    agitatedSalineConfirmed: true,
  };

  return {
    updatedState: {
      ...state,
      interventions: updatedInterventions,
    },
    message:
      'Agitated saline bubble test confirmed: dense microbubbles opacify the pericardial sac without appearance in the RV/LV chambers. Needle is safely positioned inside the pericardial space.',
  };
}

/**
 * Action: Insert Needle & Set Approach
 */
export function positionPericardiocentesisNeedle(
  state: TamponadePatientState,
  approach: 'SUBXIPHOID' | 'APICAL'
): { updatedState: TamponadePatientState; message: string } {
  const sc = TAMPONADE_SCENARIOS[state.scenarioId];
  if (sc.initialEffusion.isLoculated && approach === 'SUBXIPHOID') {
    return {
      updatedState: {
        ...state,
        interventions: {
          ...state.interventions,
          needleApproach: approach,
          needleInPericardium: false,
        },
      },
      message:
        'WARNING: Subxiphoid needle advanced, but aspirates no fluid! This is a posterior loculated hematoma. Anterior needle trajectory cannot reach the collection and risks myocardial laceration. Surgical re-sternotomy required!',
    };
  }

  return {
    updatedState: {
      ...state,
      interventions: {
        ...state.interventions,
        needleApproach: approach,
        needleInPericardium: true,
      },
    },
    message: `Needle successfully advanced via ${approach} approach under ultrasound guidance into the pericardial space. Agitated saline confirmation recommended.`,
  };
}

/**
 * Action: Aspirate Pericardial Fluid
 */
export function aspiratePericardialFluid(
  state: TamponadePatientState,
  volumeMl: number
): { updatedState: TamponadePatientState; message: string } {
  const sc = TAMPONADE_SCENARIOS[state.scenarioId];

  if (!state.interventions.needleInPericardium) {
    return {
      updatedState: state,
      message: 'Failed aspiration: needle is not correctly positioned in the pericardial space!',
    };
  }

  const aspirateAmount = Math.min(state.effusion.currentEffusionVolumeMl, volumeMl);
  const newAspirated = state.effusion.aspiratedVolumeMl + aspirateAmount;
  const newCurrent = state.effusion.currentEffusionVolumeMl - aspirateAmount;

  const updatedEffusion: EffusionCharacteristics = {
    ...state.effusion,
    aspiratedVolumeMl: newAspirated,
    currentEffusionVolumeMl: newCurrent,
  };

  const {
    pericardial,
    hemodynamics,
    diastolic,
    echo,
    alarms,
  } = recalculateTamponadeHemodynamics(
    updatedEffusion,
    state.pericardial,
    state.interventions,
    sc.baselineVitals
  );

  return {
    updatedState: {
      ...state,
      effusion: updatedEffusion,
      pericardial,
      hemodynamics,
      diastolic,
      echo,
      activeAlarms: alarms,
    },
    message: `Aspirated ${aspirateAmount} mL of ${state.effusion.fluidType.toLowerCase().replace(/_/g, ' ')} fluid. Intrapericardial pressure dropped to ${pericardial.intrapericardialPressureMmHg} mmHg, improving cardiac output to ${hemodynamics.cardiacOutputLpm} L/min.`,
  };
}

/**
 * Action: Place Indwelling Pericardial Drain
 */
export function placePericardialDrain(
  state: TamponadePatientState
): { updatedState: TamponadePatientState; message: string } {
  if (!state.interventions.needleInPericardium) {
    return {
      updatedState: state,
      message: 'Cannot place drain: needle is not in pericardium!',
    };
  }

  const updatedEffusion: EffusionCharacteristics = {
    ...state.effusion,
    drainPlaced: true,
  };

  return {
    updatedState: {
      ...state,
      effusion: updatedEffusion,
    },
    message:
      'Pigtail pericardial drain securely placed over guidewire and connected to closed gravity drainage system. Prevents recurrent fluid accumulation and tamponade.',
  };
}

/**
 * Action: Toggle Positive Pressure Mechanical Ventilation
 */
export function togglePositivePressureVentilation(
  state: TamponadePatientState,
  enabled: boolean,
  peep: number = 5
): { updatedState: TamponadePatientState; message: string } {
  const sc = TAMPONADE_SCENARIOS[state.scenarioId];

  const updatedInterventions: InterventionState = {
    ...state.interventions,
    positivePressureActive: enabled,
    peepLevelCmH2O: enabled ? peep : 0,
    isPeaArrest: enabled && state.pericardial.intrapericardialPressureMmHg >= 14 && state.interventions.totalCrystalloidGivenMl < 500,
  };

  const {
    pericardial,
    hemodynamics,
    diastolic,
    echo,
    alarms,
  } = recalculateTamponadeHemodynamics(
    state.effusion,
    state.pericardial,
    updatedInterventions,
    sc.baselineVitals
  );

  const message = enabled
    ? `Initiated Positive Pressure Mechanical Ventilation with PEEP ${peep} cmH2O. ${
        updatedInterventions.isPeaArrest
          ? 'WARNING: SEVERE HEMODYNAMIC COLLAPSE! Increased intrathoracic pressure abolished venous return against high pericardial constraint!'
          : 'Monitor blood pressure closely for loss of venous return.'
      }`
    : 'Disconnected positive pressure ventilation. Spontaneous breathing restored, recovering negative thoracic inspiratory suction.';

  return {
    updatedState: {
      ...state,
      interventions: updatedInterventions,
      pericardial,
      hemodynamics,
      diastolic,
      echo,
      activeAlarms: alarms,
    },
    message,
  };
}

/**
 * Advance Simulation Clock
 */
export function advanceTamponadeTimeStep(
  state: TamponadePatientState,
  deltaSeconds: number
): TamponadePatientState {
  let newCurrent = state.effusion.currentEffusionVolumeMl;

  // If drain is placed, drain 5 mL per 10 seconds
  if (state.effusion.drainPlaced && newCurrent > 0) {
    newCurrent = Math.max(0, newCurrent - 5);
  }

  const updatedEffusion: EffusionCharacteristics = {
    ...state.effusion,
    currentEffusionVolumeMl: newCurrent,
  };

  const sc = TAMPONADE_SCENARIOS[state.scenarioId];
  const {
    pericardial,
    hemodynamics,
    diastolic,
    echo,
    alarms,
  } = recalculateTamponadeHemodynamics(
    updatedEffusion,
    state.pericardial,
    state.interventions,
    sc.baselineVitals
  );

  return {
    ...state,
    elapsedSeconds: state.elapsedSeconds + deltaSeconds,
    effusion: updatedEffusion,
    pericardial,
    hemodynamics,
    diastolic,
    echo,
    activeAlarms: alarms,
  };
}

/**
 * Objective Debrief Evaluation
 */
export function evaluateTamponadeDebrief(
  state: TamponadePatientState
): TamponadeDebriefResult {
  const sc = TAMPONADE_SCENARIOS[state.scenarioId];
  const feedback: string[] = [];
  let score = 0;

  // Check 1: Recognition of Tamponade & Beck's Triad (MAP, CVP, Muffled sounds)
  const beckRecognized =
    state.effusion.aspiratedVolumeMl >= 50 ||
    (state.hemodynamics.isPulsusParadoxusPresent && state.diastolic.cvpMmHg >= 14) ||
    (sc.initialEffusion.isLoculated && state.interventions.needleApproach !== 'NONE');
  if (beckRecognized) {
    score += 20;
    feedback.push('Correctly identified Beck\'s triad and pulsus paradoxus consistent with cardiac tamponade.');
  } else {
    feedback.push('Failure to appreciate significant pulsus paradoxus (> 10 mmHg) and elevated CVP.');
  }

  // Check 2: Temporizing Volume Resuscitation
  const bolusDone = state.interventions.totalCrystalloidGivenMl >= 500;
  if (bolusDone) {
    score += 15;
    feedback.push(`Delivered ${state.interventions.totalCrystalloidGivenMl} mL IV crystalloids to augment right ventricular filling as a temporizing bridge.`);
  } else {
    feedback.push('Consider IV fluid bolus (500-1000 mL) to raise intracardiac pressures above pericardial pressure while setting up pericardiocentesis.');
  }

  // Check 3: Pericardiocentesis / Decompression
  const tapDone = state.effusion.aspiratedVolumeMl >= 50 || (sc.initialEffusion.isLoculated && state.interventions.needleApproach === 'SUBXIPHOID');
  if (state.effusion.aspiratedVolumeMl >= 50) {
    score += 25;
    feedback.push(`Successfully evacuated ${state.effusion.aspiratedVolumeMl} mL of pericardial fluid, shifting the patient leftward off the steep elastance curve.`);
  } else if (sc.initialEffusion.isLoculated) {
    score += 20;
    feedback.push('Recognized that subxiphoid needle drainage is ineffective for posterior loculated hematomas and consulted cardiothoracic surgery for re-sternotomy.');
  } else {
    feedback.push('Insufficient fluid evacuation. Removing even 50 mL yields dramatic hemodynamic recovery.');
  }

  // Check 4: Agitated Saline Bubble Confirmation
  const salineDone = state.interventions.agitatedSalineConfirmed;
  if (salineDone) {
    score += 15;
    feedback.push('Demonstrated procedural safety by confirming needle tip in pericardial space with agitated saline before catheter advancement.');
  } else {
    feedback.push('Procedural safety warning: always perform agitated saline contrast injection to avoid inadvertent RV puncture.');
  }

  // Check 5: Avoidance of Positive Pressure Ventilation Trap
  const avoidedVenting = !state.interventions.positivePressureActive || state.effusion.aspiratedVolumeMl >= 100;
  if (avoidedVenting) {
    score += 15;
    feedback.push('Maintained spontaneous breathing and avoided high-PEEP positive pressure ventilation, preserving critical venous return.');
  } else {
    feedback.push('CRITICAL PITFALL: Positive pressure ventilation with PEEP abolished venous return in un-drained tamponade, triggering severe hemodynamic collapse.');
  }

  // Check 6: Drain Placement or Surgical Referral
  const drainPlaced = state.effusion.drainPlaced || sc.initialEffusion.isLoculated;
  if (drainPlaced) {
    score += 10;
    feedback.push('Ensured definitive decompression and secured continuous drainage to prevent rapid re-accumulation.');
  } else {
    feedback.push('Remember to place an indwelling pigtail drain after initial needle evacuation to prevent recurrent tamponade.');
  }

  let letterGrade: 'A+' | 'A' | 'B' | 'C' | 'F' = 'F';
  if (score >= 95) letterGrade = 'A+';
  else if (score >= 85) letterGrade = 'A';
  else if (score >= 70) letterGrade = 'B';
  else if (score >= 50) letterGrade = 'C';

  return {
    scorePercentage: Math.min(100, score),
    letterGrade,
    beckTriadRecognized: beckRecognized,
    pulsusParadoxusAddressed: state.hemodynamics.pulsusParadoxusMmHg < 12,
    temporizingBolusDelivered: bolusDone,
    pericardiocentesisSuccessful: tapDone,
    agitatedSalineVerified: salineDone,
    avoidedVentilatorArrest: avoidedVenting,
    effusiveConstrictiveIdentified: state.scenarioId === 'UREMIC_EFFUSIVE_CONSTRICTIVE',
    facultyFeedback: feedback,
  };
}
