/**
 * MalignantHyperthermiaEngine.ts
 * Biophysical, Toxicological & Anesthetic Crisis Simulation Engine
 * Modeling Malignant Hyperthermia (MH), Neuroleptic Malignant Syndrome (NMS),
 * Serotonin Syndrome (SS), Ryanodine Receptor (RYR1) Kinetics, Dantrolene Reconstitution & MHAUS Protocols.
 *
 * Adheres to:
 * - Malignant Hyperthermia Association of the United States (MHAUS) Crisis Management Guidelines
 * - Hunter Serotonin Toxicity Criteria
 * - American Psychiatric Association (APA) & Neurocritical Care Guidelines for NMS
 * - European Malignant Hyperthermia Group (EMHG) Standards
 *
 * Location: frontend/.gemini/skills/MalignantHyperthermiaEngine.ts
 */

export type HypermetabolicDisorder = 'MALIGNANT_HYPERTHERMIA' | 'NEUROLEPTIC_MALIGNANT_SYNDROME' | 'SEROTONIN_SYNDROME' | 'NORMAL_UNCOMPLICATED';

export type DantroleneFormulation = 'RYANODEX' | 'TRADITIONAL_DANTRIUM';

export interface PatientVitals {
  heartRateBpm: number;
  coreTemperatureC: number;
  endTidalCo2Mmhg: number;
  systolicBpMmhg: number;
  diastolicBpMmhg: number;
  respiratoryRateBpm: number;
  minuteVentilationLpm: number;
}

export interface NeuromuscularExam {
  rigidityType: 'NONE' | 'MASSETER_SPASM' | 'GENERALIZED_RIGIDITY' | 'LEAD_PIPE' | 'TREMOR_AND_CLONUS';
  reflexes: 'DIMINISHED' | 'NORMAL' | 'HYPERREFLEXIC_3_PLUS' | 'CLONUS_SPONTANEOUS_4_PLUS';
  pupilState: 'NORMAL' | 'MYDRIASIS' | 'SLUGGISH';
  diaphoresis: 'NONE' | 'MILD' | 'PROFUSE';
  bowelSounds: 'ABSENT' | 'NORMAL' | 'HYPERACTIVE_DIARRHEA';
  mentalStatus: 'ALERT' | 'CONFUSED_AGITATED' | 'STUPOROUS_CATATONIC' | 'COMA';
}

export interface LaboratoryProfile {
  arterialPh: number;               // Normal 7.35-7.45, severe crisis < 7.15
  paco2Mmhg: number;                // Respiratory acidosis component
  serumBicarbonateMeqL: number;     // Metabolic acidosis component
  serumPotassiumMeqL: number;       // Normal 3.5-5.0, massive release > 6.5
  creatineKinaseUPerL: number;      // Normal 50-200, rhabdomyolysis > 20,000
  myoglobinuriaPresent: boolean;    // Cola/tea-colored urine
  urineOutputMlPerHr: number;       // Target >= 1.0-2.0 mL/kg/h during myoglobinuria
  baseExcessMeqL: number;
  lactateMmolL: number;
}

export interface CrisisInterventions {
  triggeringAnestheticsDiscontinued: boolean;
  charcoalFiltersApplied: boolean;
  fiO2Percent: number;              // 21 to 100%
  minuteVentilationMultiplier: number; // 1x to 4x baseline
  activeExternalCooling: boolean;
  coldIvSalineInfused: boolean;
  dantroleneAdministeredMgPerKg: number;
  calciumChlorideGiven: boolean;
  insulinDextroseGiven: boolean;
  sodiumBicarbonateGiven: boolean;
  calciumChannelBlockerGiven: boolean; // STRICT CONTRAINDICATION WITH DANTROLENE
  bromocriptineGiven: boolean;      // For NMS
  cyproheptadineGiven: boolean;     // For Serotonin Syndrome
}

export interface DantroleneReconstitutionCalc {
  formulation: DantroleneFormulation;
  patientWeightKg: number;
  targetDoseMgPerKg: number;
  totalDoseMg: number;
  vialsRequired: number;
  sterileWaterVolumeMl: number;
  reconstitutionTimeSeconds: number;
  clinicalBurdenLabel: string;
}

export interface HypermetabolicSimulationOutput {
  activeDisorder: HypermetabolicDisorder;
  disorderConfidencePct: number;
  diagnosticEvidence: string[];
  vitals: PatientVitals;
  labs: LaboratoryProfile;
  hunterCriteriaMet: boolean;
  mhausScore: number;               // Clinical grading scale (0 to >50: almost certain)
  dantrolenePlan: DantroleneReconstitutionCalc;
  crisisStatus: 'CONTROLLED' | 'IMPROVING' | 'SEVERE_ACTIVE_CRISIS' | 'IMMINENT_CARDIAC_ARREST';
  fatalPitfallsTriggered: string[];
  recommendedActions: string[];
  mhausChecklist: { step: string; done: boolean; critical: boolean }[];
}

export class MalignantHyperthermiaEngine {
  /**
   * Calculates Dantrolene Reconstitution requirements comparing Ryanodex vs Traditional Dantrium.
   * Ryanodex: 250 mg / vial, requires 5 mL sterile water, dissolves in < 20 seconds.
   * Traditional (Dantrium/Revonto): 20 mg / vial, requires 60 mL sterile water, dissolves in 1-3 minutes.
   */
  public static calculateDantroleneNeeds(
    formulation: DantroleneFormulation,
    weightKg: number,
    doseMgPerKg: number
  ): DantroleneReconstitutionCalc {
    const totalDoseMg = Math.round(weightKg * doseMgPerKg);

    if (formulation === 'RYANODEX') {
      // 250 mg per vial
      const vials = Math.ceil(totalDoseMg / 250);
      const waterMl = vials * 5;
      const timeSec = vials * 20;

      return {
        formulation: 'RYANODEX',
        patientWeightKg: weightKg,
        targetDoseMgPerKg: doseMgPerKg,
        totalDoseMg,
        vialsRequired: vials,
        sterileWaterVolumeMl: waterMl,
        reconstitutionTimeSeconds: timeSec,
        clinicalBurdenLabel: `Ultra-rapid formulation: ${vials} vial(s) with ${waterMl} mL sterile water; ready in under ${timeSec} seconds.`
      };
    } else {
      // Traditional Dantrium: 20 mg per vial
      const vials = Math.ceil(totalDoseMg / 20);
      const waterMl = vials * 60;
      const timeSec = vials * 90; // ~1.5 min per vial

      return {
        formulation: 'TRADITIONAL_DANTRIUM',
        patientWeightKg: weightKg,
        targetDoseMgPerKg: doseMgPerKg,
        totalDoseMg,
        vialsRequired: vials,
        sterileWaterVolumeMl: waterMl,
        reconstitutionTimeSeconds: timeSec,
        clinicalBurdenLabel: `Heavy reconstitution burden: ${vials} vials requiring ${waterMl} mL (${(waterMl / 1000).toFixed(1)} L) sterile water; requires multiple clinicians vigorously shaking.`
      };
    }
  }

  /**
   * Differential Diagnosis Evaluator:
   * Differentiates Malignant Hyperthermia (MH) vs Neuroleptic Malignant Syndrome (NMS) vs Serotonin Syndrome (SS).
   */
  public static classifyDisorder(
    exam: NeuromuscularExam,
    triggers: {
      volatileAnesthetics: boolean;
      succinylcholine: boolean;
      dopamineAntagonists: boolean;
      serotonergicAgents: boolean;
    },
    etco2: number,
    onsetHours: number
  ): { disorder: HypermetabolicDisorder; confidence: number; evidence: string[] } {
    const evidence: string[] = [];

    // Hunter Serotonin Toxicity Criteria:
    // In presence of serotonergic agent:
    // 1. Spontaneous clonus OR
    // 2. Inducible clonus + agitation/diaphoresis OR
    // 3. Ocular clonus + agitation/diaphoresis OR
    // 4. Tremor + hyperreflexia OR
    // 5. Hypertonia + temp > 38C + ocular/inducible clonus
    const hasClonus = exam.reflexes === 'CLONUS_SPONTANEOUS_4_PLUS';
    const hasTremorHyperreflexia = exam.reflexes === 'HYPERREFLEXIC_3_PLUS' && exam.rigidityType === 'TREMOR_AND_CLONUS';
    const hasHyperactiveGut = exam.bowelSounds === 'HYPERACTIVE_DIARRHEA';

    if (triggers.serotonergicAgents && (hasClonus || hasTremorHyperreflexia || hasHyperactiveGut)) {
      evidence.push('Presence of potent serotonergic pharmacotherapy');
      if (hasClonus) evidence.push('Hallmark neuromuscular sign: Spontaneous/inducible ocular or peripheral clonus');
      if (hasTremorHyperreflexia) evidence.push('Prominent bilateral hyperreflexia (+3/4) and peripheral tremor');
      if (hasHyperactiveGut) evidence.push('Autonomic gastrointestinal hypermotility (hyperactive bowel sounds, diarrhea)');
      if (onsetHours <= 12) evidence.push('Rapid hyperacute onset (< 12-24 hours)');

      return {
        disorder: 'SEROTONIN_SYNDROME',
        confidence: 94,
        evidence
      };
    }

    // Malignant Hyperthermia (MH):
    // Triggered by volatile halogenated anesthetics or succinylcholine
    // Early sign: rapid unexplained surge in EtCO2 (>55 mmHg) refractory to hyperventilation
    // Masseter spasm or generalized rigidity
    if ((triggers.volatileAnesthetics || triggers.succinylcholine) && (etco2 >= 55 || exam.rigidityType === 'MASSETER_SPASM')) {
      evidence.push('Exposure to triggering volatile inhalational anesthetic or succinylcholine');
      if (etco2 >= 55) evidence.push(`Earliest pathognomonic hallmark: EtCO2 surge to ${etco2} mmHg refractory to ventilation`);
      if (exam.rigidityType === 'MASSETER_SPASM') evidence.push('Masseter muscle rigidity (jaws of steel) upon induction');
      if (exam.rigidityType === 'GENERALIZED_RIGIDITY') evidence.push('Generalized skeletal muscle contracture and hypermetabolism');

      return {
        disorder: 'MALIGNANT_HYPERTHERMIA',
        confidence: 96,
        evidence
      };
    }

    // Neuroleptic Malignant Syndrome (NMS):
    // Dopamine antagonist exposure or dopamine agonist withdrawal
    // Days of onset, "lead-pipe" rigidity, hyporeflexia, catatonia
    if (triggers.dopamineAntagonists && (exam.rigidityType === 'LEAD_PIPE' || onsetHours >= 24)) {
      evidence.push('Exposure to potent dopamine receptor (D2) antagonists (antipsychotics)');
      if (exam.rigidityType === 'LEAD_PIPE') evidence.push('Generalized "lead-pipe" plastic muscle rigidity');
      if (exam.reflexes === 'DIMINISHED' || exam.reflexes === 'NORMAL') evidence.push('Reflexes diminished or normal (contrasts with hyperreflexic serotonin syndrome)');
      if (onsetHours >= 24) evidence.push(`Subacute onset evolving over ${Math.round(onsetHours / 24)} days`);

      return {
        disorder: 'NEUROLEPTIC_MALIGNANT_SYNDROME',
        confidence: 90,
        evidence
      };
    }

    return {
      disorder: 'NORMAL_UNCOMPLICATED',
      confidence: 50,
      evidence: ['Insufficient features to establish malignant hypermetabolic crisis']
    };
  }

  /**
   * Computes MHAUS Clinical Grading Scale (Larach et al.):
   * Evaluates probability that an adverse anesthetic event represents Malignant Hyperthermia.
   */
  public static calculateMhausScore(
    rigidity: string,
    etco2: number,
    tempC: number,
    heartRate: number,
    ck: number,
    potassium: number,
    ph: number
  ): { score: number; probabilityTier: string } {
    let score = 0;

    // Muscle rigidity
    if (rigidity === 'MASSETER_SPASM') score += 15;
    else if (rigidity === 'GENERALIZED_RIGIDITY') score += 15;

    // Muscle breakdown
    if (ck > 20000) score += 15;
    else if (ck > 10000) score += 10;

    // Respiratory acidosis
    if (etco2 > 55) score += 15;
    else if (etco2 > 45) score += 10;

    // Temperature
    if (tempC >= 41.0) score += 15;
    else if (tempC >= 39.0) score += 10;

    // Cardiac involvement
    if (heartRate > 120) score += 3;

    // Metabolic acidosis
    if (ph < 7.25) score += 10;
    if (potassium > 6.0) score += 3;

    let probabilityTier = 'Almost Certain (> 50 points)';
    if (score < 10) probabilityTier = 'Almost Never (< 10 points)';
    else if (score <= 19) probabilityTier = 'Unlikely (10-19 points)';
    else if (score <= 34) probabilityTier = 'Somewhat Greater Than Likely (20-34 points)';
    else if (score <= 49) probabilityTier = 'Very Likely (35-49 points)';

    return {
      score,
      probabilityTier
    };
  }

  /**
   * Evaluates Dynamic Physiology, Acid-Base & Potassium Kinetics under Intervention.
   */
  public static simulateCrisis(
    baseVitals: PatientVitals,
    baseLabs: LaboratoryProfile,
    interventions: CrisisInterventions,
    weightKg: number
  ): {
    currentVitals: PatientVitals;
    currentLabs: LaboratoryProfile;
    status: 'CONTROLLED' | 'IMPROVING' | 'SEVERE_ACTIVE_CRISIS' | 'IMMINENT_CARDIAC_ARREST';
    fatalPitfalls: string[];
    actions: string[];
    checklist: { step: string; done: boolean; critical: boolean }[];
  } {
    const fatalPitfalls: string[] = [];
    const actions: string[] = [];

    // CRITICAL LETHAL CONTRAINDICATION:
    // Calcium channel blockers (Verapamil, Diltiazem) with Dantrolene trigger severe hyperkalemia and cardiovascular collapse
    if (interventions.calciumChannelBlockerGiven && interventions.dantroleneAdministeredMgPerKg > 0) {
      fatalPitfalls.push('LETHAL COMBINATION: Calcium Channel Blocker administered with Dantrolene! Induces catastrophic hyperkalemia and electromechanical dissociation.');
    }

    // Triggering agents ongoing
    if (!interventions.triggeringAnestheticsDiscontinued) {
      fatalPitfalls.push('CRITICAL ERROR: Volatile anesthetic / Succinylcholine continues to infuse! Sarcoplasmic reticulum Ca2+ flooding unabated.');
    }

    // Dantrolene dosing effect:
    // Target initial 2.5 mg/kg, up to 10 mg/kg cumulative
    const dantroleneEffect = Math.min(1.0, interventions.dantroleneAdministeredMgPerKg / 2.5);

    // EtCO2 dynamics
    let etco2 = baseVitals.endTidalCo2Mmhg;
    if (interventions.triggeringAnestheticsDiscontinued) {
      etco2 -= 10;
    }
    if (interventions.minuteVentilationMultiplier >= 2) {
      etco2 -= 12 * (interventions.minuteVentilationMultiplier - 1);
    }
    if (dantroleneEffect > 0) {
      etco2 -= 18 * dantroleneEffect;
    }
    etco2 = Math.max(30, Math.round(etco2));

    // Temperature dynamics
    let tempC = baseVitals.coreTemperatureC;
    if (interventions.activeExternalCooling) {
      tempC -= 0.8;
    }
    if (interventions.coldIvSalineInfused) {
      tempC -= 0.6;
    }
    if (dantroleneEffect > 0.8) {
      tempC -= 0.5;
    }
    tempC = Math.max(35.5, Math.round(tempC * 10) / 10);

    // Potassium dynamics
    let potassium = baseLabs.serumPotassiumMeqL;
    if (interventions.insulinDextroseGiven) {
      potassium -= 1.0;
    }
    if (interventions.sodiumBicarbonateGiven) {
      potassium -= 0.4;
    }
    if (interventions.calciumChannelBlockerGiven) {
      potassium += 1.5; // lethal spike
    }
    potassium = Math.max(3.2, Math.round(potassium * 10) / 10);

    // Heart rate & arrhythmias
    let hr = baseVitals.heartRateBpm;
    if (dantroleneEffect > 0.5) hr -= 25;
    if (tempC < 38.5) hr -= 15;
    if (potassium > 6.5) hr += 20;
    hr = Math.max(50, Math.min(185, Math.round(hr)));

    // pH dynamics
    let ph = baseLabs.arterialPh;
    if (interventions.sodiumBicarbonateGiven) ph += 0.12;
    if (dantroleneEffect > 0.5) ph += 0.10;
    if (etco2 < 45) ph += 0.08;
    ph = Math.max(6.85, Math.min(7.50, Math.round(ph * 100) / 100));

    // Determine status
    let status: 'CONTROLLED' | 'IMPROVING' | 'SEVERE_ACTIVE_CRISIS' | 'IMMINENT_CARDIAC_ARREST' = 'SEVERE_ACTIVE_CRISIS';

    if (potassium >= 7.5 || ph < 7.0 || interventions.calciumChannelBlockerGiven) {
      status = 'IMMINENT_CARDIAC_ARREST';
      actions.push('Administer Calcium Chloride 1000 mg IV immediately to stabilize myocardial membrane against hyperkalemia.');
      actions.push('Push Regular Insulin 10 units IV with 50 mL 50% Dextrose (D50W).');
    } else if (dantroleneEffect >= 1.0 && etco2 <= 45 && tempC <= 38.5) {
      status = 'CONTROLLED';
      actions.push('Crisis stabilized. Transition to ICU for post-crisis dantrolene maintenance (1 mg/kg q4-6h for 24-48h).');
      actions.push('Monitor CK every 6-8 hours and maintain urine output >= 2 mL/kg/h to prevent acute renal failure from myoglobinuria.');
    } else if (dantroleneEffect >= 0.5 || interventions.triggeringAnestheticsDiscontinued) {
      status = 'IMPROVING';
      actions.push('Continue Dantrolene titration up to 10 mg/kg cumulative until hypermetabolism, rigidity, and EtCO2 normalize.');
    } else {
      status = 'SEVERE_ACTIVE_CRISIS';
      actions.push('Immediately administer Dantrolene 2.5 mg/kg rapid IV push.');
      actions.push('Discontinue volatile inhalational anesthetics and hyperventilate with 100% O2 at >= 10 L/min.');
    }

    // MHAUS Emergency Checklist
    const checklist = [
      { step: 'Discontinue volatile anesthetics & succinylcholine immediately', done: interventions.triggeringAnestheticsDiscontinued, critical: true },
      { step: 'Hyperventilate with 100% O2 at >= 10 L/min or activated charcoal filters', done: interventions.fiO2Percent >= 90 && interventions.minuteVentilationMultiplier >= 2, critical: true },
      { step: 'Administer Dantrolene 2.5 mg/kg IV push rapidly', done: interventions.dantroleneAdministeredMgPerKg >= 2.5, critical: true },
      { step: 'Active core cooling (ice packs to groin/axillae/neck, cold IV saline)', done: interventions.activeExternalCooling || interventions.coldIvSalineInfused, critical: false },
      { step: 'Treat hyperkalemia (Insulin/Dextrose, Calcium Chloride, Bicarbonate)', done: interventions.insulinDextroseGiven || interventions.calciumChlorideGiven, critical: true },
      { step: 'Avoid Calcium Channel Blockers (verapamil/diltiazem contraindicated)', done: !interventions.calciumChannelBlockerGiven, critical: true },
      { step: 'Maintain urine output >= 1-2 mL/kg/h for rhabdomyolysis renal protection', done: baseLabs.urineOutputMlPerHr >= weightKg, critical: false }
    ];

    return {
      currentVitals: {
        ...baseVitals,
        heartRateBpm: hr,
        coreTemperatureC: tempC,
        endTidalCo2Mmhg: etco2
      },
      currentLabs: {
        ...baseLabs,
        arterialPh: ph,
        serumPotassiumMeqL: potassium
      },
      status,
      fatalPitfalls,
      actions,
      checklist
    };
  }

  /**
   * Pre-configured Clinical Archetypes
   */
  public static getClinicalPresets(): Record<string, {
    vitals: PatientVitals;
    exam: NeuromuscularExam;
    labs: LaboratoryProfile;
    triggers: {
      volatileAnesthetics: boolean;
      succinylcholine: boolean;
      dopamineAntagonists: boolean;
      serotonergicAgents: boolean;
    };
    onsetHours: number;
    weightKg: number;
  }> {
    return {
      hyperacute_mh: {
        vitals: {
          heartRateBpm: 138,
          coreTemperatureC: 39.6,
          endTidalCo2Mmhg: 82,
          systolicBpMmhg: 168,
          diastolicBpMmhg: 95,
          respiratoryRateBpm: 24,
          minuteVentilationLpm: 12.0
        },
        exam: {
          rigidityType: 'MASSETER_SPASM',
          reflexes: 'NORMAL',
          pupilState: 'NORMAL',
          diaphoresis: 'PROFUSE',
          bowelSounds: 'NORMAL',
          mentalStatus: 'STUPOROUS_CATATONIC'
        },
        labs: {
          arterialPh: 7.12,
          paco2Mmhg: 68,
          serumBicarbonateMeqL: 18,
          serumPotassiumMeqL: 6.8,
          creatineKinaseUPerL: 42000,
          myoglobinuriaPresent: true,
          urineOutputMlPerHr: 25,
          baseExcessMeqL: -11,
          lactateMmolL: 6.2
        },
        triggers: {
          volatileAnesthetics: true,
          succinylcholine: true,
          dopamineAntagonists: false,
          serotonergicAgents: false
        },
        onsetHours: 0.5,
        weightKg: 80
      },
      nms_haloperidol: {
        vitals: {
          heartRateBpm: 122,
          coreTemperatureC: 40.2,
          endTidalCo2Mmhg: 42,
          systolicBpMmhg: 175,
          diastolicBpMmhg: 104,
          respiratoryRateBpm: 22,
          minuteVentilationLpm: 7.5
        },
        exam: {
          rigidityType: 'LEAD_PIPE',
          reflexes: 'DIMINISHED',
          pupilState: 'NORMAL',
          diaphoresis: 'PROFUSE',
          bowelSounds: 'ABSENT',
          mentalStatus: 'STUPOROUS_CATATONIC'
        },
        labs: {
          arterialPh: 7.30,
          paco2Mmhg: 38,
          serumBicarbonateMeqL: 20,
          serumPotassiumMeqL: 4.8,
          creatineKinaseUPerL: 35000,
          myoglobinuriaPresent: true,
          urineOutputMlPerHr: 30,
          baseExcessMeqL: -5,
          lactateMmolL: 3.8
        },
        triggers: {
          volatileAnesthetics: false,
          succinylcholine: false,
          dopamineAntagonists: true,
          serotonergicAgents: false
        },
        onsetHours: 72,
        weightKg: 75
      },
      serotonin_syndrome_hunter: {
        vitals: {
          heartRateBpm: 132,
          coreTemperatureC: 38.8,
          endTidalCo2Mmhg: 39,
          systolicBpMmhg: 160,
          diastolicBpMmhg: 92,
          respiratoryRateBpm: 26,
          minuteVentilationLpm: 8.5
        },
        exam: {
          rigidityType: 'TREMOR_AND_CLONUS',
          reflexes: 'CLONUS_SPONTANEOUS_4_PLUS',
          pupilState: 'MYDRIASIS',
          diaphoresis: 'PROFUSE',
          bowelSounds: 'HYPERACTIVE_DIARRHEA',
          mentalStatus: 'CONFUSED_AGITATED'
        },
        labs: {
          arterialPh: 7.33,
          paco2Mmhg: 36,
          serumBicarbonateMeqL: 21,
          serumPotassiumMeqL: 4.2,
          creatineKinaseUPerL: 3200,
          myoglobinuriaPresent: false,
          urineOutputMlPerHr: 65,
          baseExcessMeqL: -4,
          lactateMmolL: 2.9
        },
        triggers: {
          volatileAnesthetics: false,
          succinylcholine: false,
          dopamineAntagonists: false,
          serotonergicAgents: true
        },
        onsetHours: 6,
        weightKg: 70
      },
      refractory_mh_hyperkalemia: {
        vitals: {
          heartRateBpm: 155,
          coreTemperatureC: 41.8,
          endTidalCo2Mmhg: 94,
          systolicBpMmhg: 82,
          diastolicBpMmhg: 44,
          respiratoryRateBpm: 32,
          minuteVentilationLpm: 14.5
        },
        exam: {
          rigidityType: 'GENERALIZED_RIGIDITY',
          reflexes: 'DIMINISHED',
          pupilState: 'SLUGGISH',
          diaphoresis: 'PROFUSE',
          bowelSounds: 'ABSENT',
          mentalStatus: 'COMA'
        },
        labs: {
          arterialPh: 6.94,
          paco2Mmhg: 80,
          serumBicarbonateMeqL: 12,
          serumPotassiumMeqL: 8.1, // life threatening
          creatineKinaseUPerL: 98000,
          myoglobinuriaPresent: true,
          urineOutputMlPerHr: 8,
          baseExcessMeqL: -18,
          lactateMmolL: 11.5
        },
        triggers: {
          volatileAnesthetics: true,
          succinylcholine: true,
          dopamineAntagonists: false,
          serotonergicAgents: false
        },
        onsetHours: 1.5,
        weightKg: 85
      }
    };
  }
}
