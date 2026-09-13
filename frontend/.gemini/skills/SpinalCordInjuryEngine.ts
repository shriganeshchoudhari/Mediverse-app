/**
 * SpinalCordInjuryEngine.ts
 * Neurotrauma, Neurocritical Care & Emergency Medicine Physiology Engine:
 * Acute Traumatic Spinal Cord Injury (SCI), Neurogenic Shock vs Spinal Shock,
 * Bulbocavernosus Reflex (S2-S4), AANS/CNS Mean Arterial Pressure (MAP) Augmentation Protocol
 * (85-90 mmHg Target for 7 Days), Vasopressor Hemodynamics, ASIA Impairment Scale (AIS A-E),
 * Incomplete Cord Syndromes, Autonomic Dysreflexia (AD), and Steroid Harms.
 */

export type SpinalLesionLevel =
  | 'C1_C3_HIGH_CERVICAL' // Ventilator-dependent, phrenic nerve loss (C3-C5), complete sympathectomy
  | 'C4_C5_MID_CERVICAL'  // Diaphragm preserved partially (C3-C5), quadriplegia, sympathectomy
  | 'C6_C7_LOW_CERVICAL'  // Wrist extension / triceps partial, quadriplegia, sympathectomy
  | 'T1_T4_UPPER_THORACIC' // Paraplegia, cardiac accelerans sympathetic loss (T1-T4), bradycardia risk
  | 'T6_MID_THORACIC'     // Critical watershed: lesions >= T6 risk Autonomic Dysreflexia & neurogenic shock
  | 'T10_T12_LOWER_THORACIC' // Sympathetic cardiac outflow preserved; neurogenic shock does NOT occur!
  | 'L1_L2_LUMBAR'        // Conus medullaris / upper cauda equina
  | 'CAUDA_EQUINA_L3_S5'; // Lower motor neuron, saddle anesthesia, bowel/bladder incontinence

export type AsiaImpairmentGrade = 'A' | 'B' | 'C' | 'D' | 'E';

export type IncompleteCordSyndrome =
  | 'NONE_COMPLETE_TRANSECTION'
  | 'CENTRAL_CORD_SYNDROME'    // Upper extremities > lower extremities weakness
  | 'ANTERIOR_CORD_SYNDROME'   // Loss of motor + spinothalamic (pain/temp); dorsal column vibration/proprioception spared
  | 'BROWN_SEQUARD_SYNDROME'   // Ipsilateral motor/vibration loss + contralateral pain/temp loss
  | 'POSTERIOR_CORD_SYNDROME'  // Rare: isolated dorsal column loss
  | 'CONUS_MEDULLARIS';        // Mixed UMN/LMN, symmetric saddle anesthesia, early bowel/bladder

export type VasopressorChoice =
  | 'NONE'
  | 'NOREPINEPHRINE' // Balanced alpha-1 and beta-1: First-line vasopressor for neurogenic shock
  | 'EPINEPHRINE'    // Strong inotrope and vasoconstrictor
  | 'DOPAMINE'       // Inotropic support, risk of tachyarrhythmias
  | 'PHENYLEPHRINE'; // Pure alpha-1: HIGH RISK of reflex vagal bradycardia / asystole in high SCI!

export interface SciPatientParams {
  lesionLevel: SpinalLesionLevel;
  hoursPostInjury: number; // 1 to 168 hours (7 days)
  bulbocavernosusReflexPresent: boolean; // S2-S4: Absence indicates Spinal Shock; return indicates end of spinal shock
  sacralSensationS4S5Present: boolean;   // S4-S5 light touch / pinprick
  voluntaryAnalContractionPresent: boolean; // Motor S4-S5
  motorScoreAverageBelowLesion: number; // 0 (plegic) to 5 (normal)
  sensoryScoreBelowLesion: number; // 0 (absent), 1 (impaired), 2 (normal)
  incompleteSyndrome: IncompleteCordSyndrome;

  // Hemodynamics
  systolicBpMmHg: number;
  diastolicBpMmHg: number;
  heartRateBpm: number;
  vasopressor: VasopressorChoice;
  vasopressorDoseMcgPerMin: number; // e.g. 0-30 mcg/min
  ivFluidsAdministeredMl: number;   // 0-4000 mL

  // Autonomic Dysreflexia Trigger (Only in lesions >= T6 when spinal shock resolved)
  bladderDistensionFoleyKinked: boolean;
  fecalImpactionPresent: boolean;
  highDoseMethylprednisoloneAdministered: boolean; // NASCIS protocol
}

export interface SciSimulationOutput {
  // Hemodynamic & Perfusion Analysis
  meanArterialPressureMmHg: number;
  targetMapMet: boolean; // MAP >= 85 mmHg (AANS/CNS Guidelines)
  spinalCordPerfusionPressureMmHg: number; // MAP - Spinal Venous/CSF Pressure (~10-15 mmHg)
  isNeurogenicShock: boolean; // Hypotension (MAP < 65) + Bradycardia (HR < 60) in lesion >= T6
  isSpinalShockActive: boolean; // BCR absent -> Spinal Shock Active; BCR present -> Spinal Shock Resolved
  vasopressorAssessment: {
    appropriateChoice: boolean;
    reflexBradycardiaHazard: boolean; // True if Phenylephrine used in high lesion
    warningMessage?: string;
  };

  // ASIA Impairment Scale Classification
  asiaGrade: AsiaImpairmentGrade;
  asiaGradeDescription: string;
  functionalPrognosis: string;

  // Autonomic Dysreflexia State
  autonomicDysreflexiaActive: boolean;
  autonomicDysreflexiaSeverity: 'NONE' | 'MILD_HEADACHE' | 'HYPERTENSIVE_EMERGENCY_STROKE_RISK';
  adSymptomsAboveLesion: string[]; // Flushing, diaphoresis, severe pounding headache, nasal congestion, bradycardia
  adSymptomsBelowLesion: string[]; // Pale, cool, cutis anserina (goosebumps), arteriolar vasoconstriction

  // Steroid Toxicity / NASCIS Risk
  steroidAdverseOutcomes: {
    indicated: boolean; // false by current AANS/CNS Class III guidelines
    sepsisRiskMultiplier: number;
    pneumoniaRiskMultiplier: number;
    giBleedRiskMultiplier: number;
  };

  // Clinical Alerts & Evidence-Based Recommendations
  clinicalAlerts: string[];
  immediateInterventions: string[];
}

export const DEFAULT_SCI_PATIENT: SciPatientParams = {
  lesionLevel: 'C4_C5_MID_CERVICAL',
  hoursPostInjury: 4,
  bulbocavernosusReflexPresent: false, // In acute spinal shock
  sacralSensationS4S5Present: false,
  voluntaryAnalContractionPresent: false,
  motorScoreAverageBelowLesion: 0,
  sensoryScoreBelowLesion: 0,
  incompleteSyndrome: 'NONE_COMPLETE_TRANSECTION',
  systolicBpMmHg: 78,
  diastolicBpMmHg: 45,
  heartRateBpm: 46, // Paradoxical bradycardia (loss of sympathetic outflow)
  vasopressor: 'NONE',
  vasopressorDoseMcgPerMin: 0,
  ivFluidsAdministeredMl: 1000,
  bladderDistensionFoleyKinked: false,
  fecalImpactionPresent: false,
  highDoseMethylprednisoloneAdministered: false
};

/**
 * Simulates neurotrauma physiology, hemodynamics, and clinical classifications for acute SCI.
 */
export function simulateSpinalCordInjury(params: SciPatientParams): SciSimulationOutput {
  const alerts: string[] = [];
  const interventions: string[] = [];

  // 1. Lesion Level Sympathetic Autonomic Integrity
  const isHighLesion = [
    'C1_C3_HIGH_CERVICAL',
    'C4_C5_MID_CERVICAL',
    'C6_C7_LOW_CERVICAL',
    'T1_T4_UPPER_THORACIC',
    'T6_MID_THORACIC'
  ].includes(params.lesionLevel);

  // 2. Spinal Shock Assessment (Bulbocavernosus Reflex S2-S4)
  const isSpinalShockActive = !params.bulbocavernosusReflexPresent;
  if (isSpinalShockActive) {
    alerts.push('SPINAL SHOCK ACTIVE: Absent bulbocavernosus reflex (S2-S4). Transient flaccid areflexia obscures definitive long-term neurological prognosis.');
  } else {
    alerts.push('SPINAL SHOCK RESOLVED: Return of bulbocavernosus reflex indicates recovery of spinal cord reflex arcs; spasticity and reflex autonomic responses now emergent.');
  }

  // 3. Hemodynamics & Neurogenic Shock Computation
  let calculatedMap = Math.round((params.systolicBpMmHg + 2 * params.diastolicBpMmHg) / 3);
  let effectiveHr = params.heartRateBpm;

  // Vasopressor effect
  let vasopressorAppropriate = true;
  let reflexBradycardiaHazard = false;
  let vasopressorWarning: string | undefined = undefined;

  if (params.vasopressor === 'NOREPINEPHRINE') {
    // Balanced alpha-1 vasoconstriction + beta-1 inotropy/chronotropy
    const mapBoost = Math.min(35, Math.round(params.vasopressorDoseMcgPerMin * 1.6));
    calculatedMap += mapBoost;
    effectiveHr = Math.min(95, effectiveHr + Math.round(params.vasopressorDoseMcgPerMin * 0.8));
  } else if (params.vasopressor === 'PHENYLEPHRINE') {
    // Pure alpha-1: increases SVR but induces reflex vagal bradycardia
    const mapBoost = Math.min(30, Math.round(params.vasopressorDoseMcgPerMin * 1.4));
    calculatedMap += mapBoost;
    if (isHighLesion) {
      // High SCI has no sympathetic cardiac accelerans to oppose vagal bradycardia!
      reflexBradycardiaHazard = true;
      effectiveHr = Math.max(30, effectiveHr - Math.round(params.vasopressorDoseMcgPerMin * 1.1));
      vasopressorAppropriate = false;
      vasopressorWarning = 'PHENYLEPHRINE HAZARD: Pure alpha-1 vasoconstriction stimulates baroreceptors causing severe reflex vagal bradycardia and asystolic arrest in high SCI lacking sympathetic cardiac outflow!';
      alerts.push(vasopressorWarning);
    }
  } else if (params.vasopressor === 'EPINEPHRINE') {
    const mapBoost = Math.min(40, Math.round(params.vasopressorDoseMcgPerMin * 2.0));
    calculatedMap += mapBoost;
    effectiveHr = Math.min(120, effectiveHr + Math.round(params.vasopressorDoseMcgPerMin * 1.5));
  } else if (params.vasopressor === 'DOPAMINE') {
    const mapBoost = Math.min(30, Math.round(params.vasopressorDoseMcgPerMin * 1.2));
    calculatedMap += mapBoost;
    effectiveHr = Math.min(130, effectiveHr + Math.round(params.vasopressorDoseMcgPerMin * 1.8));
  }

  // Check for Neurogenic Shock: Hypotension + Bradycardia in lesion >= T6
  const isNeurogenicShock = isHighLesion && calculatedMap < 65 && effectiveHr < 60;
  if (isNeurogenicShock) {
    alerts.push('NEUROGENIC SHOCK: Loss of sympathetic vasomotor tone and cardiac accelerans (T1-T4) produces unopposed vagal tone: severe hypotension, bradycardia, and vasodilation.');
  }

  // MAP Augmentation Assessment (AANS/CNS Target: MAP >= 85 mmHg for 7 days)
  const targetMapMet = calculatedMap >= 85 && calculatedMap <= 95;
  const csfPressureEst = 12; // mmHg baseline spinal subarachnoid pressure
  const spinalCordPerfusionPressure = Math.max(0, calculatedMap - csfPressureEst);

  if (calculatedMap < 85) {
    alerts.push(`SUB-TARGET CORD PERFUSION: Current MAP (${calculatedMap} mmHg) is below the AANS/CNS guideline threshold of 85-90 mmHg. Risk of secondary ischemic cord infarction.`);
    interventions.push('Titrate IV Norepinephrine or Epinephrine infusion to achieve target MAP 85-90 mmHg continuously for 7 days (168 hours).');
  } else if (calculatedMap > 95 && !params.bladderDistensionFoleyKinked && !params.fecalImpactionPresent) {
    alerts.push(`ELEVATED MAP (${calculatedMap} mmHg): Exceeds target window (85-90 mmHg). Wean vasopressors gradually to prevent myocardial strain and excessive afterload.`);
  } else {
    alerts.push(`OPTIMAL CORD PERFUSION: Target MAP (85-90 mmHg) maintained (Current MAP: ${calculatedMap} mmHg). Spinal Cord Perfusion Pressure: ${spinalCordPerfusionPressure} mmHg.`);
  }

  // 4. Autonomic Dysreflexia (AD) Assessment (Only if lesion >= T6 AND Spinal Shock Resolved)
  let autonomicDysreflexiaActive = false;
  let adSeverity: 'NONE' | 'MILD_HEADACHE' | 'HYPERTENSIVE_EMERGENCY_STROKE_RISK' = 'NONE';
  const adSymptomsAbove: string[] = [];
  const adSymptomsBelow: string[] = [];

  if (isHighLesion && !isSpinalShockActive && (params.bladderDistensionFoleyKinked || params.fecalImpactionPresent)) {
    autonomicDysreflexiaActive = true;
    adSeverity = 'HYPERTENSIVE_EMERGENCY_STROKE_RISK';
    // Blood pressure surges drastically
    calculatedMap += 45;
    effectiveHr = Math.max(34, effectiveHr - 18); // Compensatory baroreceptor vagal bradycardia

    adSymptomsAbove.push('Pounding, throbbing bilateral headache');
    adSymptomsAbove.push('Profuse facial and upper torso diaphoresis');
    adSymptomsAbove.push('Flushed erythematous skin above lesion level');
    adSymptomsAbove.push('Significant sinus bradycardia and nasal congestion');

    adSymptomsBelow.push('Intense arteriolar vasoconstriction');
    adSymptomsBelow.push('Pale, cold, clammy lower extremities');
    adSymptomsBelow.push('Cutis anserina (piloerection / goosebumps)');

    alerts.push('AUTONOMIC DYSREFLEXIA (AD) CRISIS: Noxious pelvic visceral stimulus triggers uninhibited sympathetic hyperactivation below T6, causing malignant hypertension, while baroreceptor vagal discharge causes bradycardia and flushing above the lesion.');
    interventions.push('IMMEDIATELY sit patient upright (90 degrees) to induce orthostatic venous pooling.');
    interventions.push('Loosen all tight clothing, abdominal binders, and anti-embolic stockings.');
    if (params.bladderDistensionFoleyKinked) {
      interventions.push('URGENT: Check Foley catheter for kinks, obstruction, or distended bladder. Irrigate or replace catheter gently.');
    }
    if (params.fecalImpactionPresent) {
      interventions.push('Perform gentle digital rectal evacuation using 2% lidocaine jelly to anesthetize the rectal vault.');
    }
    interventions.push('If SBP remains > 150 mmHg: Administer rapid-onset vasodilator (Nitropaste 1-2 inches, Nifedipine bite-and-swallow, or IV Nicardipine/Hydralazine).');
  }

  // 5. ASIA Impairment Scale (AIS) Classification
  let asiaGrade: AsiaImpairmentGrade = 'A';
  let asiaGradeDescription = '';
  let functionalPrognosis = '';

  const sacralSparing = params.sacralSensationS4S5Present || params.voluntaryAnalContractionPresent;

  if (!sacralSparing) {
    // Grade A: Complete
    asiaGrade = 'A';
    asiaGradeDescription = 'Grade A (Complete): No sensory or motor function preserved in the sacral segments S4-S5 (Zone of Partial Preservation may exist).';
    functionalPrognosis = 'Permanent complete loss of motor and sensory function below the lesion level; high risk of chronic wheelchair dependency and neurogenic bowel/bladder.';
  } else if (params.sacralSensationS4S5Present && !params.voluntaryAnalContractionPresent && params.motorScoreAverageBelowLesion < 1) {
    // Grade B: Sensory Incomplete
    asiaGrade = 'B';
    asiaGradeDescription = 'Grade B (Sensory Incomplete): Sensory but NOT motor function preserved below the neurological level, including sacral segments S4-S5.';
    functionalPrognosis = 'Preserved sensation conveys improved prognostic likelihood of partial motor recovery compared to complete transection.';
  } else if (params.motorScoreAverageBelowLesion > 0 && params.motorScoreAverageBelowLesion < 3) {
    // Grade C: Motor Incomplete (More than half of key muscles have grade < 3)
    asiaGrade = 'C';
    asiaGradeDescription = 'Grade C (Motor Incomplete): Motor function is preserved below the neurological level, and more than half of key muscle functions have a muscle grade < 3 (non-functional against gravity).';
    functionalPrognosis = 'Significant motor sparing; rehabilitation potential for assisted transfers and limited functional ambulation with orthoses.';
  } else if (params.motorScoreAverageBelowLesion >= 3 && params.motorScoreAverageBelowLesion < 5) {
    // Grade D: Motor Incomplete (At least half of key muscles have grade >= 3)
    asiaGrade = 'D';
    asiaGradeDescription = 'Grade D (Motor Incomplete): Motor function is preserved below the neurological level, and at least half (half or more) of key muscle functions have a muscle grade >= 3 (active movement against gravity).';
    functionalPrognosis = 'Favorable ambulation prognosis; over 75-80% of patients achieve functional community or household ambulation with physical therapy.';
  } else if (params.motorScoreAverageBelowLesion === 5 && params.sensoryScoreBelowLesion === 2) {
    asiaGrade = 'E';
    asiaGradeDescription = 'Grade E (Normal): Motor and sensory functions are fully normal in all segments.';
    functionalPrognosis = 'Normal neurological baseline without residual deficits.';
  } else {
    // Fallback based on sacral sparing
    asiaGrade = sacralSparing ? 'C' : 'A';
    asiaGradeDescription = sacralSparing ? 'Grade C (Incomplete Motor/Sensory)' : 'Grade A (Complete)';
    functionalPrognosis = sacralSparing ? 'Moderate recovery potential' : 'Guarded motor prognosis';
  }

  // Incomplete Cord Syndromes
  if (params.incompleteSyndrome === 'CENTRAL_CORD_SYNDROME') {
    alerts.push('CENTRAL CORD SYNDROME: Disproportionate motor impairment in upper extremities compared to lower extremities, typical of hyperextension injury in stenotic cervical spine.');
  } else if (params.incompleteSyndrome === 'ANTERIOR_CORD_SYNDROME') {
    alerts.push('ANTERIOR CORD SYNDROME: Bilateral motor paralysis and spinothalamic loss (pain/temperature) with preserved dorsal columns (proprioception and light touch spared). High mortality and poor motor recovery.');
  } else if (params.incompleteSyndrome === 'BROWN_SEQUARD_SYNDROME') {
    alerts.push('BROWN-SÉQUARD SYNDROME: Hemicord transection: ipsilateral motor paralysis and dorsal column sensory loss, with contralateral loss of pain and temperature 1-2 segments below lesion. Best prognosis for ambulation.');
  }

  // 6. High-Dose Methylprednisolone (NASCIS Protocol) Risk Stratification
  const steroidAdverseOutcomes = {
    indicated: false, // AANS/CNS Guidelines: High-dose steroids not recommended (Class III evidence)
    sepsisRiskMultiplier: params.highDoseMethylprednisoloneAdministered ? 2.8 : 1.0,
    pneumoniaRiskMultiplier: params.highDoseMethylprednisoloneAdministered ? 3.2 : 1.0,
    giBleedRiskMultiplier: params.highDoseMethylprednisoloneAdministered ? 2.5 : 1.0
  };

  if (params.highDoseMethylprednisoloneAdministered) {
    alerts.push('METHYLPREDNISOLONE TOXICITY WARNING: High-dose steroids (NASCIS 30 mg/kg bolus + 5.4 mg/kg/h) are NOT recommended by AANS/CNS/AANS guidelines. They provide no significant functional benefit while dramatically multiplying risks of fatal sepsis (2.8x), severe pneumonia (3.2x), and severe GI ulcer bleeding (2.5x).');
  }

  return {
    meanArterialPressureMmHg: calculatedMap,
    targetMapMet,
    spinalCordPerfusionPressureMmHg: spinalCordPerfusionPressure,
    isNeurogenicShock,
    isSpinalShockActive,
    vasopressorAssessment: {
      appropriateChoice: vasopressorAppropriate,
      reflexBradycardiaHazard,
      warningMessage: vasopressorWarning
    },
    asiaGrade,
    asiaGradeDescription,
    functionalPrognosis,
    autonomicDysreflexiaActive,
    autonomicDysreflexiaSeverity: adSeverity,
    adSymptomsAboveLesion: adSymptomsAbove,
    adSymptomsBelowLesion: adSymptomsBelow,
    steroidAdverseOutcomes,
    clinicalAlerts: alerts,
    immediateInterventions: interventions
  };
}
