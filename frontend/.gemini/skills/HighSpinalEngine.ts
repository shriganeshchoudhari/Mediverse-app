/**
 * HighSpinalEngine.ts
 *
 * Biophysical Simulation Engine for High Spinal Blockade & Total Spinal Catastrophe:
 * Dermatomal Sensory/Motor/Sympathetic Progression (T10 -> T4 Cardiac Accelerators -> C3-C5 Phrenic Arrest),
 * Chemical Sympathectomy & Splanchnic Venous Pooling,
 * The Bezold-Jarisch Reflex (BJR) & Paradoxical Asystolic Cardiac Arrest,
 * Pressor Hemodynamics: Phenylephrine Reflex Bradycardia Hazard vs Ephedrine vs Epinephrine 1st-Line Rescue,
 * Trendelenburg Gravitational Cephalad Spread Trap vs Leg Elevation Autotransfusion,
 * and Emergent Airway / Bag-Valve-Mask / Endotracheal Resuscitation Protocols.
 *
 * Location: frontend/.gemini/skills/HighSpinalEngine.ts
 */

export type SpinalBlockLevel =
  | 'L5_S1'
  | 'T10_UMBILICUS'
  | 'T6_XIPHOID'
  | 'T4_NIPPLE_CARDIAC_SYMPATHECTOMY'
  | 'C7_CERVICAL_HAND_WEAKNESS'
  | 'C3_PHRENIC_DIAPHRAGM_ARREST'
  | 'TOTAL_SPINAL_BRAINSTEM_APNEA';

export type BromageScore = 0 | 1 | 2 | 3; // 0=Full flexion, 1=Partial, 2=Almost complete, 3=Complete motor paralysis

export type PressorChoice =
  | 'NONE'
  | 'PHENYLEPHRINE_BOLUS'
  | 'EPHEDRINE_BOLUS'
  | 'EPINEPHRINE_LOW_DOSE'
  | 'NOREPINEPHRINE_INFUSION';

export type VagolyticAgent =
  | 'NONE'
  | 'ATROPINE_0_5_1MG'
  | 'GLYCOPYRROLATE_0_2_0_4MG';

export type PatientPositioning =
  | 'SUPINE_FLAT'
  | 'STEEP_TRENDELENBURG'
  | 'REVERSE_TRENDELENBURG'
  | 'HEAD_NEUTRAL_LEGS_ELEVATED';

export type AirwayIntervention =
  | 'NONE_ROOM_AIR'
  | 'HIGH_FLOW_OXYGEN_MASK'
  | 'BAG_VALVE_MASK_ASSISTED'
  | 'ENDOTRACHEAL_INTUBATION_VENTILATED';

export interface HighSpinalParams {
  blockLevel: SpinalBlockLevel;
  bromageScore: BromageScore;
  minutesSinceInjection: number;
  localAnestheticType: 'HYPERBARIC_BUPIVACAINE' | 'ISOBARIC_BUPIVACAINE' | 'ROPIVACAINE';
  ivFluidInfusedMl: number;
  pressorAdministered: PressorChoice;
  vagolyticAdministered: VagolyticAgent;
  positioning: PatientPositioning;
  airwayManagement: AirwayIntervention;
  weightKg: number;
  baselineHeartRate: number;
  baselineMap: number;
}

export interface HighSpinalResult {
  systolicBp: number;
  diastolicBp: number;
  meanArterialPressure: number;
  heartRate: number;
  cardiacOutputLpm: number;
  strokeVolumeMl: number;
  systemicVascularResistance: number;
  centralVenousPressureMmHg: number;
  respiratoryRate: number;
  tidalVolumeMl: number;
  minuteVentilationLpm: number;
  phrenicNerveDiaphragmExcursionPercent: number;
  spO2Percent: number;
  vocalizationStatus: 'CLEAR_SPEECH' | 'DIFFICULT_WHISPER' | 'APHONIC_SILENT';
  consciousnessLevel: 'ALERT_COGNIZANT' | 'ANXIOUS_LIGHTHEADED' | 'SOMNOLENT' | 'UNCONSCIOUS_APNEIC';
  pupilState: 'NORMAL_REACTIVE' | 'SLIGHT_MIOSIS' | 'FIXED_DILATED_TOTAL_SPINAL';
  bezoldJarischRisk: 'LOW' | 'MODERATE' | 'CRITICAL_ASYSTOLIC_ARREST';
  phenylephrineReflexBradycardiaHazard: boolean;
  trendelenburgCephaladSpreadHazard: boolean;
  airwayCompromiseUrgent: boolean;
  circulatoryCollapseUrgent: boolean;
  safetyScore: number;
  warnings: string[];
  clinicalRecommendations: string[];
}

/**
 * Evaluates high spinal progression, sympathetic denervation, Bezold-Jarisch reflex mechanics,
 * pressor response, respiratory compromise, and emergent total spinal airway management.
 */
export function simulateHighSpinalHemodynamics(params: HighSpinalParams): HighSpinalResult {
  const {
    blockLevel,
    minutesSinceInjection,
    localAnestheticType,
    ivFluidInfusedMl,
    pressorAdministered,
    vagolyticAdministered,
    positioning,
    airwayManagement,
    baselineHeartRate = 75,
    baselineMap = 90,
  } = params;

  const warnings: string[] = [];
  const recommendations: string[] = [];

  // 1. Gravitational Cephalad Migration Hazard
  let effectiveBlock = blockLevel;
  let trendelenburgHazard = false;

  if (
    positioning === 'STEEP_TRENDELENBURG' &&
    localAnestheticType === 'HYPERBARIC_BUPIVACAINE' &&
    minutesSinceInjection < 20
  ) {
    trendelenburgHazard = true;
    warnings.push(
      'LETHAL GRAVITATIONAL DISASTER: Steep Trendelenburg positioning with hyperbaric bupivacaine within 20 minutes accelerates rapid cephalad migration toward the cervical cord and brainstem!'
    );
    if (effectiveBlock === 'T10_UMBILICUS') effectiveBlock = 'T4_NIPPLE_CARDIAC_SYMPATHECTOMY';
    else if (effectiveBlock === 'T6_XIPHOID') effectiveBlock = 'C7_CERVICAL_HAND_WEAKNESS';
    else if (effectiveBlock === 'T4_NIPPLE_CARDIAC_SYMPATHECTOMY') effectiveBlock = 'C3_PHRENIC_DIAPHRAGM_ARREST';
    else if (effectiveBlock === 'C7_CERVICAL_HAND_WEAKNESS') effectiveBlock = 'TOTAL_SPINAL_BRAINSTEM_APNEA';
  }

  // 2. Sympathetic Denervation & Baseline Loss of Tone
  // SVR loss: T10: -15%, T6: -25%, T4: -40%, C7: -50%, C3: -55%, Total: -65%
  let svrDropMultiplier = 0;
  let vagalDominanceFactor = 0; // T1-T4 cardioaccelerator block
  let phrenicDepression = 0; // 0 = normal diaphragm, 1.0 = paralyzed

  switch (effectiveBlock) {
    case 'L5_S1':
      svrDropMultiplier = 0.05;
      vagalDominanceFactor = 0;
      phrenicDepression = 0;
      break;
    case 'T10_UMBILICUS':
      svrDropMultiplier = 0.15;
      vagalDominanceFactor = 0;
      phrenicDepression = 0;
      break;
    case 'T6_XIPHOID':
      svrDropMultiplier = 0.25;
      vagalDominanceFactor = 0.1;
      phrenicDepression = 0;
      break;
    case 'T4_NIPPLE_CARDIAC_SYMPATHECTOMY':
      svrDropMultiplier = 0.40;
      vagalDominanceFactor = 0.55; // Cardioaccelerator fibers (T1-T4) blocked!
      phrenicDepression = 0.05; // Intercostal paralysis, diaphragm still works
      break;
    case 'C7_CERVICAL_HAND_WEAKNESS':
      svrDropMultiplier = 0.50;
      vagalDominanceFactor = 0.80;
      phrenicDepression = 0.25; // Intercostals completely out, accessory neck muscles weakening
      break;
    case 'C3_PHRENIC_DIAPHRAGM_ARREST':
      svrDropMultiplier = 0.58;
      vagalDominanceFactor = 0.90;
      phrenicDepression = 0.90; // Phrenic nerves C3-C5 paralyzed -> Diaphragmatic arrest
      break;
    case 'TOTAL_SPINAL_BRAINSTEM_APNEA':
      svrDropMultiplier = 0.65;
      vagalDominanceFactor = 1.0;
      phrenicDepression = 1.0; // Complete apnea, brainstem depression
      break;
  }

  // 3. Venous Return, CVP, and Fluid Resuscitation
  // Baseline CVP ~ 6 mmHg. Venodilation drops CVP to ~ 1-2 mmHg.
  let cvp = 6.0 * (1.0 - svrDropMultiplier * 0.8);
  // IV fluids augment CVP: every 500 mL adds ~ 2.0 mmHg CVP (up to +6)
  const fluidCvpBoost = Math.min(6.0, (ivFluidInfusedMl / 500) * 2.0);
  cvp += fluidCvpBoost;

  // Positioning effect on preload:
  if (positioning === 'HEAD_NEUTRAL_LEGS_ELEVATED') {
    cvp += 2.5; // Autotransfusion of 300-500 mL from lower extremities
  } else if (positioning === 'REVERSE_TRENDELENBURG') {
    cvp -= 2.0; // Venous pooling exacerbated
  }

  // 4. Bezold-Jarisch Reflex (BJR) Assessment
  // Mechanoreceptors in underfilled, vigorously contracting LV trigger severe vagal bradycardia & asystole
  const severelyUnderfilled = cvp < 3.5;
  const highSympathectomy = effectiveBlock === 'T4_NIPPLE_CARDIAC_SYMPATHECTOMY' ||
    effectiveBlock === 'C7_CERVICAL_HAND_WEAKNESS' ||
    effectiveBlock === 'C3_PHRENIC_DIAPHRAGM_ARREST' ||
    effectiveBlock === 'TOTAL_SPINAL_BRAINSTEM_APNEA';

  let bezoldJarischRisk: 'LOW' | 'MODERATE' | 'CRITICAL_ASYSTOLIC_ARREST' = 'LOW';
  if (highSympathectomy && severelyUnderfilled) {
    bezoldJarischRisk = 'CRITICAL_ASYSTOLIC_ARREST';
    warnings.push(
      'BEZOLD-JARISCH REFLEX ACTIVE: Severe hypovolemia + high sympathetic block stimulating LV mechanoreceptors. High risk of instantaneous asystolic arrest!'
    );
  } else if (highSympathectomy || severelyUnderfilled) {
    bezoldJarischRisk = 'MODERATE';
  }

  // 5. Heart Rate Calculation (T1-T4 block + BJR + pressors + vagolytics)
  let calculatedHr = baselineHeartRate;
  // Loss of cardioaccelerators drops HR
  calculatedHr -= vagalDominanceFactor * 35; // Down towards 40 bpm
  if (bezoldJarischRisk === 'CRITICAL_ASYSTOLIC_ARREST') {
    calculatedHr -= 20; // Severe bradycardia into 20-30s or asystole
  }

  // Pressor effects on HR:
  let phenylephrineBradyHazard = false;
  if (pressorAdministered === 'PHENYLEPHRINE_BOLUS') {
    // Phenylephrine is pure alpha-1: increases SVR, but triggers baroreceptor vagal reflex bradycardia!
    // In T4+ block where sympathetic tone is zero, this can precipitate complete asystole!
    calculatedHr -= 15;
    if (vagalDominanceFactor >= 0.55 && calculatedHr < 50) {
      phenylephrineBradyHazard = true;
      warnings.push(
        'PRESSOR CONTRAINDICATION TRAP: Phenylephrine administered during high spinal/cardioaccelerator block (T1-T4). Pure vasoconstriction triggers baroreflex bradycardia against an underfilled heart, risking immediate asystolic arrest! Use Ephedrine or Epinephrine instead.'
      );
    }
  } else if (pressorAdministered === 'EPHEDRINE_BOLUS') {
    calculatedHr += 18; // beta-1 chronotrope
  } else if (pressorAdministered === 'EPINEPHRINE_LOW_DOSE') {
    calculatedHr += 35; // potent chronotrope & inotrope
  } else if (pressorAdministered === 'NOREPINEPHRINE_INFUSION') {
    calculatedHr += 10;
  }

  // Vagolytic reversal:
  if (vagolyticAdministered === 'ATROPINE_0_5_1MG') {
    calculatedHr += 30; // Blocks muscarinic receptors, aborts BJR
  } else if (vagolyticAdministered === 'GLYCOPYRROLATE_0_2_0_4MG') {
    calculatedHr += 18;
  }

  calculatedHr = Math.max(15, Math.min(160, Math.round(calculatedHr)));

  // 6. Systemic Vascular Resistance & Blood Pressure
  let baselineSvr = 1200;
  let calculatedSvr = baselineSvr * (1.0 - svrDropMultiplier);

  if (pressorAdministered === 'PHENYLEPHRINE_BOLUS') {
    calculatedSvr += 450;
  } else if (pressorAdministered === 'NOREPINEPHRINE_INFUSION') {
    calculatedSvr += 500;
  } else if (pressorAdministered === 'EPINEPHRINE_LOW_DOSE') {
    calculatedSvr += 380;
  } else if (pressorAdministered === 'EPHEDRINE_BOLUS') {
    calculatedSvr += 180;
  }

  // Stroke Volume (SV) is driven by preload (CVP) and inotropy:
  let strokeVolume = 70 * (cvp / 6.0);
  if (pressorAdministered === 'EPINEPHRINE_LOW_DOSE') strokeVolume *= 1.35;
  else if (pressorAdministered === 'EPHEDRINE_BOLUS') strokeVolume *= 1.15;
  strokeVolume = Math.max(20, Math.min(110, Math.round(strokeVolume)));

  // Cardiac Output (CO = HR * SV / 1000)
  const cardiacOutput = Math.max(1.0, Math.min(10.0, Number(((calculatedHr * strokeVolume) / 1000).toFixed(2))));

  // Mean Arterial Pressure (MAP normalized to baseline hemodynamic state)
  const baselineCo = (baselineHeartRate * 70) / 1000;
  const mapRatio = (cardiacOutput / baselineCo) * (calculatedSvr / baselineSvr);
  let calculatedMap = Number((baselineMap * mapRatio).toFixed(1));
  if (positioning === 'REVERSE_TRENDELENBURG') calculatedMap -= 8;

  calculatedMap = Math.max(25, Math.min(140, Math.round(calculatedMap)));

  // SBP & DBP from MAP and pulse pressure (proportional to SV):
  const pulsePressure = Math.round(strokeVolume * 0.55);
  let systolicBp = Math.round(calculatedMap + (2 / 3) * pulsePressure);
  let diastolicBp = Math.round(calculatedMap - (1 / 3) * pulsePressure);

  if (diastolicBp < 15) diastolicBp = 15;
  if (systolicBp < diastolicBp + 10) systolicBp = diastolicBp + 10;

  // 7. Respiratory Mechanics & Phrenic Nerve Function
  let diaphragmExcursion = 100 * (1.0 - phrenicDepression);
  diaphragmExcursion = Math.max(0, Math.min(100, Math.round(diaphragmExcursion)));

  let tidalVolume = 500 * (diaphragmExcursion / 100);
  let respiratoryRate = 14;

  if (effectiveBlock === 'C3_PHRENIC_DIAPHRAGM_ARREST' || effectiveBlock === 'TOTAL_SPINAL_BRAINSTEM_APNEA') {
    respiratoryRate = 0;
    tidalVolume = 0;
  } else if (effectiveBlock === 'C7_CERVICAL_HAND_WEAKNESS') {
    respiratoryRate = 22; // Tachypnea compensating for loss of intercostal muscles
    tidalVolume = 320;
  }

  // Airway Support overrides:
  let minuteVentilation = Number(((respiratoryRate * tidalVolume) / 1000).toFixed(1));
  let spO2 = 98;

  if (airwayManagement === 'ENDOTRACHEAL_INTUBATION_VENTILATED') {
    minuteVentilation = 7.0; // Controlled mechanical ventilation
    respiratoryRate = 12;
    tidalVolume = 580;
    spO2 = 100;
  } else if (airwayManagement === 'BAG_VALVE_MASK_ASSISTED') {
    minuteVentilation = 6.0;
    respiratoryRate = 12;
    tidalVolume = 500;
    spO2 = 99;
  } else if (airwayManagement === 'HIGH_FLOW_OXYGEN_MASK') {
    if (diaphragmExcursion < 30) {
      spO2 = 72; // Hypoxic arrest imminent despite oxygen mask because no minute ventilation!
      warnings.push(
        'VENTILATORY FAILURE IMMINENT: High-flow mask is insufficient during phrenic nerve/diaphragm paralysis. Patient requires assisted positive pressure ventilation (BVM / Intubation) immediately!'
      );
    } else {
      spO2 = 96;
    }
  } else {
    // Room air
    if (minuteVentilation < 2.0) spO2 = 55;
    else if (minuteVentilation < 4.0) spO2 = 82;
    else spO2 = 97;
  }

  // 8. Vocalization & Speech Ability
  // Phrenic / intercostal denervation prevents generating subglottic air pressure
  let vocalizationStatus: 'CLEAR_SPEECH' | 'DIFFICULT_WHISPER' | 'APHONIC_SILENT' = 'CLEAR_SPEECH';
  if (effectiveBlock === 'TOTAL_SPINAL_BRAINSTEM_APNEA' || effectiveBlock === 'C3_PHRENIC_DIAPHRAGM_ARREST') {
    vocalizationStatus = 'APHONIC_SILENT';
  } else if (effectiveBlock === 'C7_CERVICAL_HAND_WEAKNESS' || effectiveBlock === 'T4_NIPPLE_CARDIAC_SYMPATHECTOMY') {
    vocalizationStatus = 'DIFFICULT_WHISPER';
    warnings.push(
      'EARLY CLINICAL WARNING SIGN: Patient can only speak in a whisper ("I feel like I cannot catch my breath"). This indicates high thoracic intercostal block and impending cervical ascent!'
    );
  }

  // 9. Neurological Status & Pupil Assessment
  let consciousnessLevel: 'ALERT_COGNIZANT' | 'ANXIOUS_LIGHTHEADED' | 'SOMNOLENT' | 'UNCONSCIOUS_APNEIC' = 'ALERT_COGNIZANT';
  let pupilState: 'NORMAL_REACTIVE' | 'SLIGHT_MIOSIS' | 'FIXED_DILATED_TOTAL_SPINAL' = 'NORMAL_REACTIVE';

  if (effectiveBlock === 'TOTAL_SPINAL_BRAINSTEM_APNEA') {
    consciousnessLevel = 'UNCONSCIOUS_APNEIC';
    pupilState = 'FIXED_DILATED_TOTAL_SPINAL';
    warnings.push(
      'TOTAL SPINAL ANESTHESIA DECLARED: Unconsciousness, fixed dilated pupils, complete apnea, and cardiovascular collapse. Emergent airway control & hemodynamic life support required!'
    );
  } else if (calculatedMap < 45 || spO2 < 75) {
    consciousnessLevel = 'SOMNOLENT';
  } else if (calculatedMap < 60 || spO2 < 90) {
    consciousnessLevel = 'ANXIOUS_LIGHTHEADED';
  }

  if (effectiveBlock === 'C7_CERVICAL_HAND_WEAKNESS' || effectiveBlock === 'T4_NIPPLE_CARDIAC_SYMPATHECTOMY') {
    pupilState = 'SLIGHT_MIOSIS'; // Horner syndrome from T1 sympathetic block
  }

  // 10. Clinical Collapse Urgency Flags
  const airwayCompromiseUrgent = diaphragmExcursion < 30 && airwayManagement === 'NONE_ROOM_AIR';
  const circulatoryCollapseUrgent = calculatedMap < 50 || calculatedHr < 40;

  // 11. Safety Score
  let safetyScore = 100;
  if (trendelenburgHazard) safetyScore -= 30;
  if (phenylephrineBradyHazard) safetyScore -= 35;
  if (airwayCompromiseUrgent) safetyScore -= 35;
  if (circulatoryCollapseUrgent) safetyScore -= 25;
  if (bezoldJarischRisk === 'CRITICAL_ASYSTOLIC_ARREST') safetyScore -= 25;
  if (ivFluidInfusedMl < 500 && highSympathectomy) safetyScore -= 15;
  safetyScore = Math.max(0, Math.min(100, safetyScore));

  // 12. Clinical Recommendations
  if (highSympathectomy && cvp < 4.0) {
    recommendations.push(
      'Rapid IV crystalloid bolus (500–1000 mL) to combat splanchnic venodilation and restore ventricular preload.'
    );
    recommendations.push(
      'Head-neutral position with leg elevation (autotransfusion) to recruit peripheral blood volume without causing cephalad LA spread.'
    );
  }

  if (calculatedHr < 50 || bezoldJarischRisk === 'CRITICAL_ASYSTOLIC_ARREST') {
    recommendations.push(
      'Administer Epinephrine (10-20 mcg IV bolus, repeat q1-2min) or Atropine (0.5-1.0 mg IV) immediately to prevent asystolic cardiac arrest.'
    );
  }

  if (effectiveBlock === 'C3_PHRENIC_DIAPHRAGM_ARREST' || effectiveBlock === 'TOTAL_SPINAL_BRAINSTEM_APNEA') {
    recommendations.push(
      'Perform emergent Endotracheal Intubation with 100% O2 and mechanical ventilatory support until subarachnoid block recedes.'
    );
  }

  return {
    systolicBp,
    diastolicBp,
    meanArterialPressure: calculatedMap,
    heartRate: calculatedHr,
    cardiacOutputLpm: cardiacOutput,
    strokeVolumeMl: strokeVolume,
    systemicVascularResistance: Math.round(calculatedSvr),
    centralVenousPressureMmHg: Number(cvp.toFixed(1)),
    respiratoryRate,
    tidalVolumeMl: Math.round(tidalVolume),
    minuteVentilationLpm: minuteVentilation,
    phrenicNerveDiaphragmExcursionPercent: diaphragmExcursion,
    spO2Percent: spO2,
    vocalizationStatus,
    consciousnessLevel,
    pupilState,
    bezoldJarischRisk,
    phenylephrineReflexBradycardiaHazard: phenylephrineBradyHazard,
    trendelenburgCephaladSpreadHazard: trendelenburgHazard,
    airwayCompromiseUrgent,
    circulatoryCollapseUrgent,
    safetyScore,
    warnings,
    clinicalRecommendations: recommendations,
  };
}
