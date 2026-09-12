/**
 * BrainDeathApneaEngine.ts
 * Neurocritical Care & Organ Donation Precision Simulation Engine
 * Follows American Academy of Neurology (AAN 2010 / 2023) Guidelines for Determination of Death by Neurologic Criteria (DNC).
 * Location: frontend/.gemini/skills/BrainDeathApneaEngine.ts
 */

export interface BrainDeathPrerequisites {
  coreTempC: number; // Must be >= 36.0 C (96.8 F)
  systolicBp: number; // Must be >= 100 mmHg (or MAP >= 60-65 mmHg)
  meanArterialPressure: number; // mmHg
  neuromuscularBlockadeFree: boolean; // TOF 4/4 twitches, no paralytics
  cnsDepressantsCleared: boolean; // >= 5 elimination half-lives elapsed, tox screen negative
  severeMetabolicDerangementAbsent: boolean; // No severe electrolyte crisis, severe acidosis/alkalosis, severe endocrine coma
  proximateCauseKnown: boolean; // Irreversible coma with established catastrophic etiology (e.g. trauma, ICH, anoxia)
}

export interface PrerequisiteEvaluation {
  isEligible: boolean;
  blockers: string[];
  warnings: string[];
}

export interface BrainstemReflexAssessment {
  pupillaryLightReflexRight: boolean; // true = intact/reactive, false = absent/fixed
  pupillaryLightReflexLeft: boolean; // true = intact/reactive, false = absent/fixed
  cornealReflexRight: boolean; // true = intact blink, false = absent
  cornealReflexLeft: boolean; // true = intact blink, false = absent
  oculocephalicDollEyes: boolean; // true = intact (eyes turn opposite head), false = absent (fixed relative to head)
  oculovestibularColdCaloricsRight: boolean; // true = intact nystagmus/drift, false = absent
  oculovestibularColdCaloricsLeft: boolean; // true = intact nystagmus/drift, false = absent
  facialNoxiousGrimace: boolean; // true = grimace present, false = absent
  pharyngealGagReflex: boolean; // true = gag present, false = absent
  trachealCoughReflex: boolean; // true = cough to carina suction, false = absent
  spinalReflexesPresent: boolean; // e.g. triple flexion, Lazarus sign (allowed in brain death)
}

export interface ReflexEvaluation {
  allBrainstemReflexesAbsent: boolean;
  persistentReflexes: string[];
  spinalReflexNote: string;
}

export type OxygenationMethod = 'apneic_catheter' | 'cpap_valve' | 'none';
export type PatientLungCondition = 'normal' | 'copd' | 'ards';

export interface ApneaTestState {
  elapsedMinutes: number;
  initialPaCO2: number; // baseline mmHg (target 35-45)
  currentPaCO2: number; // mmHg
  initialPaO2: number; // baseline mmHg (target >= 200 on 100% FiO2)
  currentPaO2: number; // mmHg
  initialPH: number; // baseline pH
  arterialPH: number; // starts 7.35-7.45
  spO2: number; // %
  systolicBP: number; // mmHg
  spontaneousBreathsObserved: number; // count
  isTestActive: boolean;
  aborted: boolean;
  abortReason: string | null;
  targetReached: boolean;
  log: string[];
}

export interface ApneaEvaluation {
  status: 'PENDING' | 'POSITIVE_BRAIN_DEATH' | 'NEGATIVE_SPONTANEOUS_BREATHING' | 'ABORTED_INCONCLUSIVE';
  paco2Delta: number;
  meetsPaCO2Criteria: boolean; // PaCO2 >= 60 AND delta >= 20
  spontaneousBreathingDetected: boolean;
  clinicalInterpretation: string;
  nextStepRecommendation: string;
}

export type AncillaryModality = 'angiography' | 'spect_perfusion' | 'tcd' | 'eeg';

export interface AncillaryTestResult {
  modality: AncillaryModality;
  modalityTitle: string;
  findings: string;
  isConsistentWithBrainDeath: boolean;
  keyFeature: string;
  imageRepresentation: string;
  recommendation: string;
}

export interface DonorManagementState {
  systolicBP: number; // goal >= 100 mmHg
  meanArterialPressure: number; // goal 65-75 mmHg
  urineOutputMlHr: number; // goal 100-200 mL/h (1-3 mL/kg/h)
  serumSodium: number; // mEq/L, goal 135-150
  coreTempC: number; // goal >= 36.0 C
  paO2: number; // goal >= 100 mmHg on PEEP <= 8-10
  vasopressinDoseUnitsHr: number; // 0 - 2.4 units/hr
  levothyroxineActive: boolean; // IV T4 bolus/infusion
  corticosteroidActive: boolean; // Methylprednisolone 15 mg/kg
  insulinActive: boolean; // Regular insulin for euglycemia
  fluidBolusMl: number;
}

export interface DonorOptimizationReport {
  meetsRuleOf100s: boolean;
  overallScorePercent: number;
  organViabilityYield: {
    heart: 'Optimal' | 'Marginal' | 'Non-Viable';
    lungs: 'Optimal' | 'Marginal' | 'Non-Viable';
    liver: 'Optimal' | 'Marginal' | 'Non-Viable';
    kidneys: 'Optimal' | 'Marginal' | 'Non-Viable';
  };
  interventionsNeeded: string[];
  positiveHormonalBundleCount: number;
}

/**
 * 1. Evaluate AAN Prerequisites for Brain Death Determination
 */
export function evaluatePrerequisites(prereqs: BrainDeathPrerequisites): PrerequisiteEvaluation {
  const blockers: string[] = [];
  const warnings: string[] = [];

  if (!prereqs.proximateCauseKnown) {
    blockers.push('Irreversible coma etiology is unknown or unestablished (mandatory prerequisite)');
  }

  if (prereqs.coreTempC < 36.0) {
    blockers.push(`Hypothermia (Core Temp ${prereqs.coreTempC.toFixed(1)}°C < 36.0°C) depresses brainstem reflexes`);
  }

  if (prereqs.systolicBp < 100 || prereqs.meanArterialPressure < 60) {
    blockers.push(`Hypotension (SBP ${prereqs.systolicBp} mmHg < 100 mmHg, MAP ${prereqs.meanArterialPressure} mmHg < 60 mmHg) impairs CNS perfusion`);
  }

  if (!prereqs.neuromuscularBlockadeFree) {
    blockers.push('Neuromuscular blockade present (TOF < 4/4); motor and respiratory responses cannot be assessed');
  }

  if (!prereqs.cnsDepressantsCleared) {
    blockers.push('CNS depressant / sedative drug effect not ruled out (< 5 elimination half-lives or active levels)');
  }

  if (!prereqs.severeMetabolicDerangementAbsent) {
    blockers.push('Confounding severe metabolic, acid-base, or endocrine derangement present (e.g. severe hypoglycemia, myxedema)');
  }

  if (prereqs.coreTempC >= 36.0 && prereqs.coreTempC < 36.5) {
    warnings.push('Core temperature is close to threshold; maintain active warming blankets to prevent drift below 36.0°C');
  }

  return {
    isEligible: blockers.length === 0,
    blockers,
    warnings,
  };
}

/**
 * 2. Evaluate Clinical Brainstem Reflex Examination
 */
export function evaluateBrainstemReflexes(reflexes: BrainstemReflexAssessment): ReflexEvaluation {
  const persistentReflexes: string[] = [];

  if (reflexes.pupillaryLightReflexRight || reflexes.pupillaryLightReflexLeft) {
    persistentReflexes.push('Pupillary light reflex intact (CN II/III)');
  }
  if (reflexes.cornealReflexRight || reflexes.cornealReflexLeft) {
    persistentReflexes.push('Corneal reflex intact (CN V/VII)');
  }
  if (reflexes.oculocephalicDollEyes) {
    persistentReflexes.push('Oculocephalic reflex intact (Doll’s eyes, CN VIII/III/VI)');
  }
  if (reflexes.oculovestibularColdCaloricsRight || reflexes.oculovestibularColdCaloricsLeft) {
    persistentReflexes.push('Oculovestibular reflex intact (Cold calorics, CN VIII/III/VI)');
  }
  if (reflexes.facialNoxiousGrimace) {
    persistentReflexes.push('Facial grimace to supraorbital noxious stimulation (CN V/VII)');
  }
  if (reflexes.pharyngealGagReflex) {
    persistentReflexes.push('Pharyngeal gag reflex intact (CN IX/X)');
  }
  if (reflexes.trachealCoughReflex) {
    persistentReflexes.push('Tracheal cough reflex intact (CN X)');
  }

  const allBrainstemReflexesAbsent = persistentReflexes.length === 0;

  let spinalReflexNote = 'No spinal reflexes noted.';
  if (reflexes.spinalReflexesPresent) {
    spinalReflexNote =
      'Spinal reflexes observed (e.g., triple flexion, deep tendon reflexes, Lazarus sign). These originate from the spinal cord and DO NOT invalidate the determination of brain death.';
  }

  return {
    allBrainstemReflexesAbsent,
    persistentReflexes,
    spinalReflexNote,
  };
}

/**
 * 3. Initialize Apnea Test
 */
export function initializeApneaTest(
  initialPaCO2: number = 40,
  initialPaO2: number = 240,
  initialPH: number = 7.40,
  baselineSBP: number = 115
): ApneaTestState {
  return {
    elapsedMinutes: 0,
    initialPaCO2,
    currentPaCO2: initialPaCO2,
    initialPaO2,
    currentPaO2: initialPaO2,
    initialPH,
    arterialPH: initialPH,
    spO2: 100,
    systolicBP: baselineSBP,
    spontaneousBreathsObserved: 0,
    isTestActive: true,
    aborted: false,
    abortReason: null,
    targetReached: false,
    log: [`Apnea test initiated with PaCO2 = ${initialPaCO2} mmHg, PaO2 = ${initialPaO2} mmHg, pH = ${initialPH.toFixed(2)}.`],
  };
}

/**
 * 4. Step Apnea Test Kinetics
 * Physics & Physiology:
 * - PaCO2 rises ~3.0 mmHg per minute during apnea (CO2 generation ~200 mL/min).
 * - pH drops ~0.008 per mmHg rise in PaCO2 (carbonic acid accumulation).
 * - Oxygenation decay depends on delivery method:
 *   - Apneic oxygen catheter (100% O2 @ 6 L/min at carina): slow drop (-8 to -12 mmHg/min in normal lung).
 *   - CPAP valve (100% O2 @ 10 cmH2O): even slower drop (-4 to -6 mmHg/min).
 *   - None (room air / disconnected without oxygen): catastrophic decay (-35 mmHg/min, hypoxemic arrest within 3 min).
 * - SBP decays with severe acidosis (-1.5 to -3 mmHg/min) unless supported.
 */
export function stepApneaTest(
  state: ApneaTestState,
  deltaMinutes: number,
  oxygenationMethod: OxygenationMethod = 'apneic_catheter',
  patientLung: PatientLungCondition = 'normal',
  spontaneousBreathingTriggered: boolean = false
): ApneaTestState {
  if (!state.isTestActive || state.aborted || state.targetReached) {
    return state;
  }

  const newElapsed = state.elapsedMinutes + deltaMinutes;

  // CO2 kinetics: ~3.0 mmHg/min
  const co2RiseRate = patientLung === 'copd' ? 3.4 : patientLung === 'ards' ? 3.8 : 3.0;
  const newPaCO2 = Math.round((state.currentPaCO2 + co2RiseRate * deltaMinutes) * 10) / 10;

  // pH drop: -0.008 per mmHg of delta PaCO2
  const deltaPaCO2 = newPaCO2 - state.initialPaCO2;
  const newPH = Math.max(6.90, Math.round((state.initialPH - deltaPaCO2 * 0.008) * 100) / 100);

  // PaO2 decay
  let o2DecayRate = 8.0; // mmHg/min default
  if (oxygenationMethod === 'cpap_valve') {
    o2DecayRate = patientLung === 'ards' ? 10.0 : 5.0;
  } else if (oxygenationMethod === 'apneic_catheter') {
    o2DecayRate = patientLung === 'ards' ? 18.0 : 9.0;
  } else {
    // No oxygenation: disaster
    o2DecayRate = 45.0;
  }

  const newPaO2 = Math.max(30, Math.round((state.currentPaO2 - o2DecayRate * deltaMinutes) * 10) / 10);

  // SpO2 calculation via Hill-like sigmoid
  let newSpO2 = 100;
  if (newPaO2 < 100) {
    newSpO2 = Math.min(100, Math.max(50, Math.round(100 / (1 + Math.exp(-0.06 * (newPaO2 - 45))))));
  }

  // Hemodynamic stability: acidosis drops SBP
  const bpDecayRate = newPH < 7.20 ? 2.5 : 1.0;
  const newSBP = Math.max(50, Math.round(state.systolicBP - bpDecayRate * deltaMinutes));

  const newBreaths = state.spontaneousBreathsObserved + (spontaneousBreathingTriggered ? 1 : 0);

  const updatedLog = [...state.log];

  // Check spontaneous breathing (Negative for brain death)
  if (newBreaths > 0) {
    updatedLog.push(`Minute ${newElapsed.toFixed(1)}: Spontaneous respiratory effort detected! Patient took an inspiratory breath. IMMEDIATELY RECONNECT TO VENTILATOR.`);
    return {
      ...state,
      elapsedMinutes: newElapsed,
      currentPaCO2: newPaCO2,
      currentPaO2: newPaO2,
      arterialPH: newPH,
      spO2: newSpO2,
      systolicBP: newSBP,
      spontaneousBreathsObserved: newBreaths,
      isTestActive: false,
      aborted: true,
      abortReason: 'Spontaneous respiratory effort observed (medullary respiratory center intact). Brain death refuted.',
      log: updatedLog,
    };
  }

  // Check abort safety triggers:
  // 1. Severe Hypoxemia: SpO2 < 85%
  if (newSpO2 < 85) {
    updatedLog.push(`Minute ${newElapsed.toFixed(1)}: Critical hypoxemia (SpO2 ${newSpO2}% < 85%). Apnea test aborted. Reconnected to ventilator.`);
    return {
      ...state,
      elapsedMinutes: newElapsed,
      currentPaCO2: newPaCO2,
      currentPaO2: newPaO2,
      arterialPH: newPH,
      spO2: newSpO2,
      systolicBP: newSBP,
      isTestActive: false,
      aborted: true,
      abortReason: `Critical hypoxemia (SpO2 ${newSpO2}% < 85%, PaO2 ${newPaO2} mmHg). ABG drawn before reconnection. Inconclusive if target not met.`,
      log: updatedLog,
    };
  }

  // 2. Severe Hypotension: SBP < 90 mmHg
  if (newSBP < 90) {
    updatedLog.push(`Minute ${newElapsed.toFixed(1)}: Hemodynamic collapse (SBP ${newSBP} mmHg < 90 mmHg). Apnea test aborted. Reconnected to ventilator.`);
    return {
      ...state,
      elapsedMinutes: newElapsed,
      currentPaCO2: newPaCO2,
      currentPaO2: newPaO2,
      arterialPH: newPH,
      spO2: newSpO2,
      systolicBP: newSBP,
      isTestActive: false,
      aborted: true,
      abortReason: `Hemodynamic instability (SBP ${newSBP} mmHg < 90 mmHg). Abort required for donor organ preservation.`,
      log: updatedLog,
    };
  }

  // Check AAN Target: PaCO2 >= 60 mmHg AND delta >= 20 mmHg
  const targetReached = newPaCO2 >= 60 && deltaPaCO2 >= 20;
  if (targetReached && !state.targetReached) {
    updatedLog.push(`Minute ${newElapsed.toFixed(1)}: Target reached! PaCO2 = ${newPaCO2} mmHg (Delta +${deltaPaCO2.toFixed(1)} mmHg >= 20 mmHg). Draw confirmatory ABG and reconnect.`);
  }

  return {
    ...state,
    elapsedMinutes: newElapsed,
    currentPaCO2: newPaCO2,
    currentPaO2: newPaO2,
    arterialPH: newPH,
    spO2: newSpO2,
    systolicBP: newSBP,
    targetReached,
    log: updatedLog,
  };
}

/**
 * 5. Evaluate Final Apnea Test Result
 */
export function evaluateApneaTestResult(state: ApneaTestState): ApneaEvaluation {
  const paco2Delta = Math.round((state.currentPaCO2 - state.initialPaCO2) * 10) / 10;
  const meetsPaCO2Criteria = state.currentPaCO2 >= 60 && paco2Delta >= 20;
  const spontaneousBreathingDetected = state.spontaneousBreathsObserved > 0;

  if (spontaneousBreathingDetected) {
    return {
      status: 'NEGATIVE_SPONTANEOUS_BREATHING',
      paco2Delta,
      meetsPaCO2Criteria,
      spontaneousBreathingDetected: true,
      clinicalInterpretation: 'Negative for brain death. The patient demonstrated spontaneous respiratory drive, confirming viable medullary respiratory function.',
      nextStepRecommendation: 'Brain death cannot be declared. Continue neurocritical care, treat intracranial hypertension, and re-evaluate at a later date if neurological status deteriorates.',
    };
  }

  if (state.aborted && !meetsPaCO2Criteria) {
    return {
      status: 'ABORTED_INCONCLUSIVE',
      paco2Delta,
      meetsPaCO2Criteria: false,
      spontaneousBreathingDetected: false,
      clinicalInterpretation: `Inconclusive / Incomplete Apnea Test. Test was terminated early (${state.abortReason}) before reaching target PaCO2 >= 60 mmHg (Current: ${state.currentPaCO2} mmHg, Delta: +${paco2Delta} mmHg).`,
      nextStepRecommendation: 'Mandatory Ancillary Testing required (4-Vessel Cerebral Angiography, Radionuclide Brain SPECT, TCD, or EEG) to complete brain death determination.',
    };
  }

  if (meetsPaCO2Criteria && !spontaneousBreathingDetected) {
    return {
      status: 'POSITIVE_BRAIN_DEATH',
      paco2Delta,
      meetsPaCO2Criteria: true,
      spontaneousBreathingDetected: false,
      clinicalInterpretation: `Positive Apnea Test for Brain Death. PaCO2 reached ${state.currentPaCO2} mmHg (>= 60 mmHg with delta +${paco2Delta} mmHg >= 20 mmHg) with complete apnea (0 spontaneous respiratory efforts).`,
      nextStepRecommendation: 'Apnea testing component complete. Document time of death (time confirmatory ABG was drawn). Transition to organ donor coordinator discussion or compassionate palliative extubation per family wishes.',
    };
  }

  return {
    status: 'PENDING',
    paco2Delta,
    meetsPaCO2Criteria: false,
    spontaneousBreathingDetected: false,
    clinicalInterpretation: `Test in progress (Minute ${state.elapsedMinutes.toFixed(1)}). PaCO2 is ${state.currentPaCO2} mmHg. Continue observing without ventilatory support.`,
    nextStepRecommendation: 'Maintain apneic oxygenation. Re-check ABG at 8-10 minutes if patient remains hemodynamically stable.',
  };
}

/**
 * 6. Interpret Ancillary Testing
 */
export function interpretAncillaryTest(
  modality: AncillaryModality,
  scenario: 'brain_death' | 'preserved_flow' | 'artifact'
): AncillaryTestResult {
  switch (modality) {
    case 'angiography':
      if (scenario === 'brain_death') {
        return {
          modality,
          modalityTitle: '4-Vessel Conventional Cerebral Angiography',
          findings: 'Complete non-visualization of intracranial arterial vasculature above the carotid siphon (internal carotid arteries) and above the foramen magnum (vertebral arteries). Preserved external carotid circulation.',
          isConsistentWithBrainDeath: true,
          keyFeature: 'Absent intracranial arterial filling ("Empty Skull" sign)',
          imageRepresentation: 'EMPTY_SKULL_ABSENT_CIRCULATION',
          recommendation: 'Gold-standard confirmation of cessation of cerebral blood flow. Brain death confirmed.',
        };
      }
      return {
        modality,
        modalityTitle: '4-Vessel Conventional Cerebral Angiography',
        findings: 'Patent intracranial circulation with filling of anterior, middle, and posterior cerebral arteries.',
        isConsistentWithBrainDeath: false,
        keyFeature: 'Intracranial contrast opacification present',
        imageRepresentation: 'PATENT_INTRACRANIAL_VESSELS',
        recommendation: 'Intracranial perfusion persists. Brain death cannot be declared.',
      };

    case 'spect_perfusion':
      if (scenario === 'brain_death') {
        return {
          modality,
          modalityTitle: 'Radionuclide Cerebral Scintigraphy (99mTc-HMPAO SPECT)',
          findings: 'Total absence of radiotracer uptake throughout the bilateral cerebral hemispheres, basal ganglia, brainstem, and cerebellum. Marked preservation of scalp/nasal perfusion ("Hot Nose" sign).',
          isConsistentWithBrainDeath: true,
          keyFeature: '"Hollow Skull" / "Empty Skull" sign with prominent "Hot Nose"',
          imageRepresentation: 'HOLLOW_SKULL_HOT_NOSE',
          recommendation: 'Confirms total absence of cerebral parenchymal microvascular perfusion. Brain death confirmed.',
        };
      }
      return {
        modality,
        modalityTitle: 'Radionuclide Cerebral Scintigraphy (99mTc-HMPAO SPECT)',
        findings: 'Symmetric radiopharmaceutical uptake visualized in bilateral cerebral cortices, basal ganglia, and cerebellum.',
        isConsistentWithBrainDeath: false,
        keyFeature: 'Preserved parenchymal tracer uptake',
        imageRepresentation: 'NORMAL_PERFUSION_UPTAKE',
        recommendation: 'Active cerebral parenchymal metabolism and blood flow detected. Brain death refuted.',
      };

    case 'tcd':
      if (scenario === 'brain_death') {
        return {
          modality,
          modalityTitle: 'Transcranial Doppler Ultrasonography (TCD)',
          findings: 'Bilateral insonation of middle cerebral arteries and basilar artery demonstrates classic reverberating (oscillating) flow: forward systolic flow followed immediately by equal retrograde diastolic flow, or brief systolic spikes (< 200 ms) with zero diastolic flow.',
          isConsistentWithBrainDeath: true,
          keyFeature: 'Biphasic reverberating flow / isolated systolic spikes',
          imageRepresentation: 'REVERBERATING_FLOW_SPIKES',
          recommendation: 'Indicates intracranial pressure exceeds systolic arterial pressure, causing arrest of forward cerebral microvascular flow. Consistent with brain death.',
        };
      }
      return {
        modality,
        modalityTitle: 'Transcranial Doppler Ultrasonography (TCD)',
        findings: 'Continuous forward diastolic flow with normal pulsatility index (PI 0.8-1.2) in bilateral MCAs.',
        isConsistentWithBrainDeath: false,
        keyFeature: 'Normal forward diastolic velocities',
        imageRepresentation: 'NORMAL_FORWARD_DIASTOLIC_TCD',
        recommendation: 'Persistent intracranial forward perfusion. Brain death cannot be declared.',
      };

    case 'eeg':
      if (scenario === 'brain_death') {
        return {
          modality,
          modalityTitle: 'Electroencephalogram (EEG)',
          findings: 'Electrocerebral Silence (ECS) / Isoelectric EEG. No electrical brain activity greater than 2 microvolts recorded over a 30-minute recording period at a sensitivity of 2 uV/mm with high-frequency filtering properly set.',
          isConsistentWithBrainDeath: true,
          keyFeature: 'Electrocerebral silence (< 2 uV across all 10-20 montages)',
          imageRepresentation: 'FLATLINE_ELECTROCEREBRAL_SILENCE',
          recommendation: 'Electrophysiological confirmation of absence of cortical bioelectrical activity. Supports brain death determination (must verify absence of hypothermia/sedatives).',
        };
      }
      return {
        modality,
        modalityTitle: 'Electroencephalogram (EEG)',
        findings: 'Diffuse slow theta/delta polymorphic rhythm (20-40 uV amplitude) recorded over cerebral hemispheres.',
        isConsistentWithBrainDeath: false,
        keyFeature: 'Active cortical electrical rhythm present',
        imageRepresentation: 'SLOW_DELTA_ACTIVITY',
        recommendation: 'Cortical neuronal synaptic activity persists. Brain death cannot be declared.',
      };
  }
}

/**
 * 7. Organ Donor Hemodynamic Optimization ("Rule of 100s" & Hormone Bundle)
 */
export function calculateDonorOptimization(state: DonorManagementState): DonorOptimizationReport {
  const recommendations: string[] = [];
  let scorePoints = 0;
  const maxPoints = 7;

  // 1. SBP >= 100 mmHg
  if (state.systolicBP >= 100 && state.meanArterialPressure >= 65) {
    scorePoints++;
  } else {
    recommendations.push(`Hypotension (SBP ${state.systolicBP} mmHg, MAP ${state.meanArterialPressure} mmHg): Titrate Vasopressin or Noradrenaline; infuse crystalloid bolus to maintain SBP >= 100 mmHg.`);
  }

  // 2. Urine output: 100 - 200 mL/hr (1-3 mL/kg/h)
  if (state.urineOutputMlHr >= 100 && state.urineOutputMlHr <= 250) {
    scorePoints++;
  } else if (state.urineOutputMlHr > 250) {
    recommendations.push(`Neurogenic Diabetes Insipidus polyuria (UOP ${state.urineOutputMlHr} mL/h > 250 mL/h): Start or titrate Vasopressin infusion (0.5-2.4 units/h) or DDAVP (1-2 mcg IV) to prevent severe hypernatremia and hypovolemia.`);
  } else {
    recommendations.push(`Oliguria (UOP ${state.urineOutputMlHr} mL/h < 100 mL/h): Administer 500 mL balanced crystalloid bolus; check renal perfusion pressure.`);
  }

  // 3. PaO2 >= 100 mmHg
  if (state.paO2 >= 100) {
    scorePoints++;
  } else {
    recommendations.push(`Hypoxemia (PaO2 ${state.paO2} mmHg < 100 mmHg): Perform lung recruitment maneuver, titrate PEEP to 8-10 cmH2O, and consider bronchoscopy for mucous plug clearance.`);
  }

  // 4. Core Temperature >= 36.0 C
  if (state.coreTempC >= 36.0 && state.coreTempC <= 37.5) {
    scorePoints++;
  } else {
    recommendations.push(`Poikilothermia / Hypothermia (${state.coreTempC.toFixed(1)}°C < 36.0°C): Initiate active convective air warming (Bair Hugger) and humidified heated circuit.`);
  }

  // 5. Serum Sodium 135 - 150 mEq/L
  if (state.serumSodium >= 135 && state.serumSodium <= 150) {
    scorePoints++;
  } else if (state.serumSodium > 150) {
    recommendations.push(`Hypernatremia (Na ${state.serumSodium} mEq/L > 150 mEq/L): Severe hypernatremia induces hepatocyte swelling and liver graft primary non-function. Replace free water with D5W.`);
  } else {
    recommendations.push(`Hyponatremia (Na ${state.serumSodium} mEq/L < 135 mEq/L): Infuse 0.9% Normal Saline or Plasmalyte.`);
  }

  // 6. Vasopressin
  if (state.vasopressinDoseUnitsHr >= 0.5 && state.vasopressinDoseUnitsHr <= 2.4) {
    scorePoints++;
  } else {
    recommendations.push('Vasopressin infusion not optimized (target 0.5-2.4 units/h): Essential to restore vascular tone and treat post-pituitary diabetes insipidus.');
  }

  // 7. Hormonal resuscitation bundle (T4 + Methylprednisolone + Insulin)
  let hormoneBundleCount = 0;
  if (state.levothyroxineActive) hormoneBundleCount++;
  if (state.corticosteroidActive) hormoneBundleCount++;
  if (state.insulinActive) hormoneBundleCount++;

  if (hormoneBundleCount >= 2) {
    scorePoints++;
  } else {
    recommendations.push('VIP Endocrine Replacement Bundle incomplete: Administer IV Levothyroxine (T4 20 mcg bolus + 10 mcg/h) and Methylprednisolone (15 mg/kg) to restore cellular bioenergetics.');
  }

  const overallScorePercent = Math.round((scorePoints / maxPoints) * 100);
  const meetsRuleOf100s = state.systolicBP >= 100 && state.urineOutputMlHr >= 100 && state.paO2 >= 100 && state.coreTempC >= 36.0;

  // Organ yield ratings
  const heartViability = state.systolicBP >= 100 && state.levothyroxineActive && state.vasopressinDoseUnitsHr <= 2.4 ? 'Optimal' : state.systolicBP >= 90 ? 'Marginal' : 'Non-Viable';
  const lungsViability = state.paO2 >= 100 && state.corticosteroidActive && state.urineOutputMlHr <= 250 ? 'Optimal' : state.paO2 >= 75 ? 'Marginal' : 'Non-Viable';
  const liverViability = state.serumSodium <= 150 && state.meanArterialPressure >= 65 ? 'Optimal' : state.serumSodium <= 155 ? 'Marginal' : 'Non-Viable';
  const kidneysViability = state.urineOutputMlHr >= 100 && state.urineOutputMlHr <= 250 && state.meanArterialPressure >= 65 ? 'Optimal' : state.urineOutputMlHr >= 50 ? 'Marginal' : 'Non-Viable';

  return {
    meetsRuleOf100s,
    overallScorePercent,
    organViabilityYield: {
      heart: heartViability,
      lungs: lungsViability,
      liver: liverViability,
      kidneys: kidneysViability,
    },
    interventionsNeeded: recommendations,
    positiveHormonalBundleCount: hormoneBundleCount,
  };
}
