/**
 * StatusMigrainosusCSFLeakEngine.ts
 *
 * Clinical & Biophysical Simulation Engine:
 * Refractory Status Migrainosus vs Spontaneous Intracranial Hypotension (SIH / CSF Leak),
 * Monro-Kellie Doctrine, Pachymeningeal Enhancement, Pseudo-Chiari Brain Sag,
 * Epidural Blood Patch (EBP), DHE/Triptan Coronary Vasospasm Trap,
 * and the Burr Hole Evacuation Hazard in Subdural Hygromas.
 *
 * Location: frontend/.gemini/skills/StatusMigrainosusCSFLeakEngine.ts
 */

export type HeadachePhenotype =
  | 'STATUS_MIGRAINOSUS_REFRACTORY'
  | 'INTRACRANIAL_HYPOTENSION_CSF_LEAK'
  | 'POST_DURAL_PUNCTURE_HEADACHE_PDPH'
  | 'REBOUND_INTRACRANIAL_HYPERTENSION_POST_EBP';

export type OrthostaticPostureResponse =
  | 'WORSE_UPRIGHT_RELIEVED_SUPINE'
  | 'WORSE_SUPINE_RELIEVED_UPRIGHT'
  | 'NO_POSTURAL_VARIATION';

export type MriBrainFindings =
  | 'NORMAL'
  | 'PACHYMENINGEAL_ENHANCEMENT_BRAIN_SAG'
  | 'SUBDURAL_HEMATOMA_HYGROMA'
  | 'PSEUDO_CHIARI_TONSILLAR_HERNIATION';

export type AbortiveMedicationGiven =
  | 'NONE'
  | 'TRIPTAN_WITHIN_24H'
  | 'DHE_PROTOCOL'
  | 'DOPAMINE_ANTAGONIST_KETOROLAC'
  | 'IV_MAGNESIUM_DEXAMETHASONE'
  | 'KETAMINE_INFUSION';

export type InterventionStrategy =
  | 'CONSERVATIVE_FLUIDS_CAFFEINE'
  | 'AUTOLOGOUS_EPIDURAL_BLOOD_PATCH'
  | 'SURGICAL_DURAL_REPAIR'
  | 'BURR_HOLE_DRAINAGE_HAZARD'
  | 'REPEATED_DIAGNOSTIC_LP_HAZARD';

export interface HeadachePatientParams {
  attackDurationHours: number;
  postureResponse: OrthostaticPostureResponse;
  triptanTakenWithin24h: boolean;
  csfOpeningPressureMmH2O: number;
  mriBrain: MriBrainFindings;
  cranialNervePalsy: 'NONE' | 'CN_VI_DIPLOPIA' | 'CN_VIII_TINNITUS_HYPOACUSIS';
  medicationAdministered: AbortiveMedicationGiven;
  interventionSelected: InterventionStrategy;
  bloodPatchVolumeMl: number;
  acetazolamideGiven: boolean;
}

export interface HeadacheSimulationResult {
  phenotype: HeadachePhenotype;
  phenotypeLabel: string;
  monroKellieCompliance: 'BALANCED' | 'COMPENSATORY_VENOUS_ENGORGEMENT' | 'BRAIN_SAG_CRANIAL_TRACTION' | 'REBOUND_HIGH_PRESSURE';
  reboundHypertensionRisk: boolean;
  subduralBurrHoleHazard: boolean;
  dheTriptanVasospasmHazard: boolean;
  repeatLpHazard: boolean;
  headacheIntensityScore: number;
  treatmentSafetyScore: number;
  criticalAlerts: string[];
  physiologicMechanisms: string[];
  stepByStepProtocol: string[];
  contraindicationFlags: {
    vasospasmCatastropheActive: boolean;
    subduralEvacuationContraindicated: boolean;
    repeatLpContraindicated: boolean;
    epiduralPatchMandated: boolean;
  };
}

/**
 * Classifies the headache syndrome based on posture response, CSF opening pressure, and prior interventions
 */
export function classifyHeadachePhenotype(params: HeadachePatientParams): {
  phenotype: HeadachePhenotype;
  label: string;
} {
  // Post-EBP Rebound High Pressure: worse lying flat, high opening pressure
  if (
    params.interventionSelected === 'AUTOLOGOUS_EPIDURAL_BLOOD_PATCH' &&
    params.postureResponse === 'WORSE_SUPINE_RELIEVED_UPRIGHT' &&
    params.csfOpeningPressureMmH2O > 200
  ) {
    return {
      phenotype: 'REBOUND_INTRACRANIAL_HYPERTENSION_POST_EBP',
      label: 'Rebound Intracranial Hypertension (Post-EBP): Paradoxical headache worse supine following successful dural seal',
    };
  }

  // Intracranial Hypotension: orthostatic headache, low CSF pressure (<60 mmH2O)
  if (
    params.postureResponse === 'WORSE_UPRIGHT_RELIEVED_SUPINE' ||
    params.csfOpeningPressureMmH2O < 60 ||
    params.mriBrain === 'PACHYMENINGEAL_ENHANCEMENT_BRAIN_SAG' ||
    params.mriBrain === 'PSEUDO_CHIARI_TONSILLAR_HERNIATION'
  ) {
    return {
      phenotype: 'INTRACRANIAL_HYPOTENSION_CSF_LEAK',
      label: 'Spontaneous Intracranial Hypotension (SIH) / CSF Leak: Orthostatic headache driven by CSF volume depletion',
    };
  }

  // Refractory Status Migrainosus: non-postural, prolonged attack > 72h
  return {
    phenotype: 'STATUS_MIGRAINOSUS_REFRACTORY',
    label: 'Refractory Status Migrainosus: Severe debilitating migraine lasting > 72h refractory to standard abortives',
  };
}

/**
 * Core simulation logic for Status Migrainosus & CSF Leak Workstation
 */
export function simulateHeadacheWorkstation(params: HeadachePatientParams): HeadacheSimulationResult {
  const { phenotype, label: phenotypeLabel } = classifyHeadachePhenotype(params);

  // Monro-Kellie Doctrine Stage
  let monroKellieCompliance: HeadacheSimulationResult['monroKellieCompliance'] = 'BALANCED';
  if (phenotype === 'REBOUND_INTRACRANIAL_HYPERTENSION_POST_EBP') {
    monroKellieCompliance = 'REBOUND_HIGH_PRESSURE';
  } else if (
    params.mriBrain === 'PSEUDO_CHIARI_TONSILLAR_HERNIATION' ||
    params.cranialNervePalsy !== 'NONE'
  ) {
    monroKellieCompliance = 'BRAIN_SAG_CRANIAL_TRACTION';
  } else if (params.csfOpeningPressureMmH2O < 60 || params.mriBrain === 'PACHYMENINGEAL_ENHANCEMENT_BRAIN_SAG') {
    monroKellieCompliance = 'COMPENSATORY_VENOUS_ENGORGEMENT';
  }

  // Critical Hazard 1: DHE + Triptan Synergistic Vasospasm Catastrophe
  const dheTriptanVasospasmHazard =
    params.triptanTakenWithin24h && params.medicationAdministered === 'DHE_PROTOCOL';

  // Critical Hazard 2: Burr Hole Drainage in CSF Leak Subdural Collections
  const subduralBurrHoleHazard =
    phenotype === 'INTRACRANIAL_HYPOTENSION_CSF_LEAK' &&
    params.mriBrain === 'SUBDURAL_HEMATOMA_HYGROMA' &&
    params.interventionSelected === 'BURR_HOLE_DRAINAGE_HAZARD';

  // Critical Hazard 3: Repeated Diagnostic Lumbar Puncture in Existing CSF Leak
  const repeatLpHazard =
    phenotype === 'INTRACRANIAL_HYPOTENSION_CSF_LEAK' &&
    params.interventionSelected === 'REPEATED_DIAGNOSTIC_LP_HAZARD';

  const reboundHypertensionRisk =
    params.interventionSelected === 'AUTOLOGOUS_EPIDURAL_BLOOD_PATCH' &&
    params.bloodPatchVolumeMl >= 20 &&
    !params.acetazolamideGiven;

  const criticalAlerts: string[] = [];
  const physiologicMechanisms: string[] = [];
  const stepByStepProtocol: string[] = [];

  // Evaluate Alerts
  if (dheTriptanVasospasmHazard) {
    criticalAlerts.push(
      'LETHAL VASOSPASM CATASTROPHE: IV Dihydroergotamine (DHE) administered within 24 hours of an oral/subcutaneous Triptan! Combining potent 5-HT1B/1D/alpha-adrenergic vasoconstrictors precipitates malignant coronary artery vasospasm (Prinzmetal STEMI), cerebral infarction, or peripheral limb ischemia. Strict 24-hour separation is mandated!'
    );
  }

  if (subduralBurrHoleHazard) {
    criticalAlerts.push(
      'SURGICAL EVACUATION DISASTER: Burr hole evacuation performed on subdural hygromas/hematomas secondary to CSF leak! Subdurals in SIH are caused by low intracranial pressure stretching bridging veins. Evacuation without sealing the dural tear fails because the brain immediately re-sags, causing massive recurrent hemorrhage or uncal herniation. Epidural Blood Patch is the definitive treatment!'
    );
  }

  if (repeatLpHazard) {
    criticalAlerts.push(
      'DIAGNOSTIC PRACTICE TRAP: Repeated lumbar puncture performed in a patient with active CSF leak! Creating another dural defect exacerbates CSF depletion, accelerates tonsillar herniation, and dramatically worsens the orthostatic headache. Diagnosis should be made via brain/spine MRI and CT myelography!'
    );
  }

  if (phenotype === 'INTRACRANIAL_HYPOTENSION_CSF_LEAK' && params.medicationAdministered === 'DHE_PROTOCOL') {
    criticalAlerts.push(
      'MISDIAGNOSIS PITFALL: Status migrainosus protocol (DHE/vasoconstrictors) given to a patient with spontaneous intracranial hypotension! Vasoconstriction does not replenish CSF volume and delays targeted epidural blood patching.'
    );
  }

  // Physiologic Mechanisms
  if (phenotype === 'INTRACRANIAL_HYPOTENSION_CSF_LEAK') {
    physiologicMechanisms.push(
      'Monro-Kellie Doctrine: Dural CSF leak creates intracranial volume deficit. Because skull volume is fixed, loss of CSF forces compensatory dilatation of pachymeningeal venous sinuses (diffuse pachymeningeal enhancement on MRI).'
    );
    if (params.cranialNervePalsy === 'CN_VI_DIPLOPIA') {
      physiologicMechanisms.push(
        'Downward caudal displacement ("brain sagging") stretches the abducens nerve (CN VI) across Dorello canal and the petroclival ligament, causing lateral rectus palsy and binocular horizontal diplopia.'
      );
    }
  } else if (phenotype === 'REBOUND_INTRACRANIAL_HYPERTENSION_POST_EBP') {
    physiologicMechanisms.push(
      'Rebound Intracranial Hypertension: Successful dural seal with epidural blood patch abruptly halts CSF leak, but cerebral venous sinuses remain hyperemic and CSF resorption may be temporarily overwhelmed, spiking intracranial pressure (> 250 mmH2O).'
    );
  } else {
    physiologicMechanisms.push(
      'Status Migrainosus Pathophysiology: Sustained neurogenic inflammation, trigeminovascular sensitization, and prolonged release of CGRP and substance P causing unremitting peripheral and central sensitization.'
    );
  }

  // Pain Intensity Score (0-10)
  let painScore = 8;
  if (phenotype === 'INTRACRANIAL_HYPOTENSION_CSF_LEAK') {
    painScore = params.postureResponse === 'WORSE_UPRIGHT_RELIEVED_SUPINE' ? 9 : 3;
    if (params.interventionSelected === 'AUTOLOGOUS_EPIDURAL_BLOOD_PATCH') painScore = 2;
  } else if (phenotype === 'REBOUND_INTRACRANIAL_HYPERTENSION_POST_EBP') {
    painScore = params.acetazolamideGiven ? 3 : 7;
  } else {
    // Migraine
    if (params.medicationAdministered === 'DOPAMINE_ANTAGONIST_KETOROLAC') painScore -= 3;
    if (params.medicationAdministered === 'IV_MAGNESIUM_DEXAMETHASONE') painScore -= 4;
    if (params.medicationAdministered === 'KETAMINE_INFUSION') painScore -= 5;
    if (params.medicationAdministered === 'DHE_PROTOCOL' && !dheTriptanVasospasmHazard) painScore -= 6;
  }
  const headacheIntensityScore = Math.max(1, Math.min(10, painScore));

  // Safety Score (0-100)
  let safetyScore = 100;
  if (dheTriptanVasospasmHazard) safetyScore -= 50;
  if (subduralBurrHoleHazard) safetyScore -= 40;
  if (repeatLpHazard) safetyScore -= 30;
  if (phenotype === 'INTRACRANIAL_HYPOTENSION_CSF_LEAK' && params.medicationAdministered === 'DHE_PROTOCOL') safetyScore -= 20;
  if (reboundHypertensionRisk) safetyScore -= 15;
  safetyScore = Math.max(0, Math.min(100, safetyScore));

  // Step-by-Step Clinical Protocols
  if (phenotype === 'INTRACRANIAL_HYPOTENSION_CSF_LEAK') {
    stepByStepProtocol.push('1. Immediate Postural Optimization: Strict flat bedrest and avoidance of Valsalva/bending.');
    stepByStepProtocol.push('2. Medical Triad: Liberal oral/IV hydration, oral or IV Caffeine (300-500 mg) to stimulate CSF secretion and induce cerebral vasoconstriction, plus abdominal binder.');
    stepByStepProtocol.push('3. Definitive Intervention: Autologous Epidural Blood Patch (EBP) 15-25 mL injected into lumbar/thoracic epidural space to form a gelatinous tamponade over the dural rent.');
    stepByStepProtocol.push('4. Surveillance for Subdurals: Treat underlying leak; avoid burr hole drainage unless life-threatening uncal herniation with midbrain compression is present.');
  } else if (phenotype === 'REBOUND_INTRACRANIAL_HYPERTENSION_POST_EBP') {
    stepByStepProtocol.push('1. Post-EBP Assessment: Differentiate rebound high pressure (worse lying down/morning, retro-orbital) from persistent low pressure (orthostatic).');
    stepByStepProtocol.push('2. Head Elevation: Elevate head of bed to 30 degrees to promote cerebral venous outflow.');
    stepByStepProtocol.push('3. Carbonic Anhydrase Inhibitor: Initiate Acetazolamide (Diamox) 250-500 mg BID or Topiramate to reduce choroid plexus CSF production.');
  } else {
    stepByStepProtocol.push('1. Inpatient Resuscitation: IV Normal Saline 1-2 L to correct dehydration and pre-hydrate for vasoactive drugs.');
    stepByStepProtocol.push('2. First-Line Cocktail: IV Metoclopramide 10 mg or Prochlorperazine 10 mg + IV Ketorolac 30 mg.');
    stepByStepProtocol.push('3. Recurrence Prevention: IV Dexamethasone 4-10 mg to reduce 72-hour migraine relapse.');
    stepByStepProtocol.push('4. DHE Infusion Protocol: If > 24 hours since last triptan, administer IV DHE 0.5-1 mg every 8h with antiemetic pre-treatment.');
    stepByStepProtocol.push('5. Refractory Rescue: Subanesthetic IV Ketamine infusion (0.1-0.3 mg/kg/hr) or ultrasound-guided Greater Occipital Nerve (GON) block.');
  }

  return {
    phenotype,
    phenotypeLabel,
    monroKellieCompliance,
    reboundHypertensionRisk,
    subduralBurrHoleHazard,
    dheTriptanVasospasmHazard,
    repeatLpHazard,
    headacheIntensityScore,
    treatmentSafetyScore: safetyScore,
    criticalAlerts,
    physiologicMechanisms,
    stepByStepProtocol,
    contraindicationFlags: {
      vasospasmCatastropheActive: dheTriptanVasospasmHazard,
      subduralEvacuationContraindicated: subduralBurrHoleHazard,
      repeatLpContraindicated: repeatLpHazard,
      epiduralPatchMandated: phenotype === 'INTRACRANIAL_HYPOTENSION_CSF_LEAK',
    },
  };
}

/**
 * Clinical Presets
 */
export const HEADACHE_PRESETS: Record<string, HeadachePatientParams> = {
  refractoryMigraineStandard: {
    attackDurationHours: 96,
    postureResponse: 'NO_POSTURAL_VARIATION',
    triptanTakenWithin24h: false,
    csfOpeningPressureMmH2O: 140,
    mriBrain: 'NORMAL',
    cranialNervePalsy: 'NONE',
    medicationAdministered: 'DOPAMINE_ANTAGONIST_KETOROLAC',
    interventionSelected: 'CONSERVATIVE_FLUIDS_CAFFEINE',
    bloodPatchVolumeMl: 0,
    acetazolamideGiven: false,
  },
  dheTriptanVasospasmTrap: {
    attackDurationHours: 84,
    postureResponse: 'NO_POSTURAL_VARIATION',
    triptanTakenWithin24h: true, // Took sumatriptan 4 hours ago!
    csfOpeningPressureMmH2O: 150,
    mriBrain: 'NORMAL',
    cranialNervePalsy: 'NONE',
    medicationAdministered: 'DHE_PROTOCOL', // LETHAL SYNERGISTIC VASOSPASM!
    interventionSelected: 'CONSERVATIVE_FLUIDS_CAFFEINE',
    bloodPatchVolumeMl: 0,
    acetazolamideGiven: false,
  },
  spontaneousCsfLeakOrthostatic: {
    attackDurationHours: 120,
    postureResponse: 'WORSE_UPRIGHT_RELIEVED_SUPINE',
    triptanTakenWithin24h: false,
    csfOpeningPressureMmH2O: 35, // Marked intracranial hypotension!
    mriBrain: 'PACHYMENINGEAL_ENHANCEMENT_BRAIN_SAG',
    cranialNervePalsy: 'CN_VI_DIPLOPIA',
    medicationAdministered: 'NONE',
    interventionSelected: 'AUTOLOGOUS_EPIDURAL_BLOOD_PATCH', // Target definitive treatment!
    bloodPatchVolumeMl: 20,
    acetazolamideGiven: false,
  },
  subduralHygromaBurrHoleTrap: {
    attackDurationHours: 168,
    postureResponse: 'WORSE_UPRIGHT_RELIEVED_SUPINE',
    triptanTakenWithin24h: false,
    csfOpeningPressureMmH2O: 25,
    mriBrain: 'SUBDURAL_HEMATOMA_HYGROMA',
    cranialNervePalsy: 'CN_VIII_TINNITUS_HYPOACUSIS',
    medicationAdministered: 'NONE',
    interventionSelected: 'BURR_HOLE_DRAINAGE_HAZARD', // LETHAL EVACUATION TRAP!
    bloodPatchVolumeMl: 0,
    acetazolamideGiven: false,
  },
  reboundHypertensionPostEbp: {
    attackDurationHours: 180,
    postureResponse: 'WORSE_SUPINE_RELIEVED_UPRIGHT', // Paradoxical flip!
    triptanTakenWithin24h: false,
    csfOpeningPressureMmH2O: 280, // Spiked opening pressure!
    mriBrain: 'NORMAL',
    cranialNervePalsy: 'NONE',
    medicationAdministered: 'NONE',
    interventionSelected: 'AUTOLOGOUS_EPIDURAL_BLOOD_PATCH',
    bloodPatchVolumeMl: 25,
    acetazolamideGiven: true, // Diamox rescue!
  },
};
