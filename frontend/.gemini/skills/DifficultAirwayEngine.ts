/**
 * DifficultAirwayEngine.ts
 *
 * Biophysical, anatomical, and clinical decision engine for Difficult Airway Management,
 * 2015 Difficult Airway Society (DAS) Step A-D Guidelines, Awake Tracheal Intubation (ATI),
 * and Can't Intubate Can't Oxygenate (CICO) Emergency Scalpel-Bougie Cricothyroidotomy.
 *
 * Implements:
 * 1. Bedside Airway Physical Exam Predictors:
 *    - Mallampati Class (I - IV)
 *    - Cormack-Lehane Glottic View (Grade 1, 2a, 2b, 3, 4) & POGO Score (0 - 100%)
 *    - Thyromental Distance (TMD), Sternomental Distance (SMD), Inter-Incisor Gap
 *    - Upper Lip Bite Test (ULBT Class 1, 2, 3)
 *    - Cervical Spine Range of Motion (Atlanto-occipital extension)
 *    - STOP-BANG Obstructive Sleep Apnea (OSA) score (0 - 8)
 * 2. Risk Stratification Matrices:
 *    - MOANS (Difficult Mask Ventilation)
 *    - RODS (Difficult Supraglottic Airway Device)
 *    - SHORT (Difficult Emergency Front-of-Neck Access / Cricothyroidotomy)
 * 3. DAS 2015 Unanticipated Difficult Intubation Algorithm (Step A -> B -> C -> D)
 *    - Plan A: Facemask & Tracheal Intubation (Direct vs Video Laryngoscopy, BURP, Bougie, max 3+1 attempts)
 *    - Plan B: Maintaining oxygenation with 2nd-generation SAD (i-gel, ProSeal, max 2 attempts)
 *    - Plan C: Facemask bailout oxygenation (+/- Sugammadex reversal of Rocuronium)
 *    - Plan D: Emergency Front-of-Neck Access (eFONA) Scalpel-Bougie-Tube Cricothyroidotomy
 * 4. Awake Tracheal Intubation (ATI / AFIO) Sequencer & Topicalization Protocol
 *
 * Location: frontend/.gemini/skills/DifficultAirwayEngine.ts
 */

export type MallampatiClass = 'CLASS_I' | 'CLASS_II' | 'CLASS_III' | 'CLASS_IV';

export type CormackLehaneGrade = 'GRADE_1' | 'GRADE_2A' | 'GRADE_2B' | 'GRADE_3' | 'GRADE_4';

export type UlbtClass = 'CLASS_1' | 'CLASS_2' | 'CLASS_3';

export type DasPlanStatus = 'PLAN_A' | 'PLAN_B' | 'PLAN_C' | 'PLAN_D_CICO' | 'AWAKE_INTUBATION';

export interface AirwayAnatomyExam {
  mallampati: MallampatiClass;
  thyromentalDistanceCm: number; // < 6.0 cm high risk
  sternomentalDistanceCm: number; // < 12.5 cm high risk
  interIncisorGapCm: number; // mouth opening (< 3.0 cm high risk)
  ulbt: UlbtClass;
  cervicalMobilityDeg: number; // normal >= 35°, restricted < 35°
  neckCircumferenceCm: number; // > 40 cm high risk
  bmiKgM2: number;
  hasBeard: boolean;
  isEdentulous: boolean;
  hasStridorOrAirwayTumor: boolean;
  hasCervicalSpineInstability: boolean;
  hasTrismusOrLudwigPhlegmon: boolean;
  ageYears: number;
  sex: 'MALE' | 'FEMALE';
}

export interface StopBangQuestionnaire {
  snoring: boolean;
  tiredness: boolean;
  observedApnea: boolean;
  highBloodPressure: boolean;
  bmiOver35: boolean;
  ageOver50: boolean;
  neckCircumferenceOver40: boolean;
  genderMale: boolean;
}

export interface DasAlgorithmState {
  currentPlan: DasPlanStatus;
  planAAttempts: number; // max 3 (or 4 if experienced supervisor)
  planBAttempts: number; // max 2
  planCVentilationSuccessful: boolean;
  planDDeclared: boolean; // CICO
  usedVideoLaryngoscope: boolean;
  usedBougieOrStylet: boolean;
  usedSecondGenSad: boolean;
  sugammadexAdministered: boolean;
  currentSpo2Pct: number;
  cicoTimeElapsedSeconds: number;
}

export interface DifficultAirwayEvaluation {
  // Risk Indices
  stopBangScore: number;
  stopBangRisk: 'LOW' | 'INTERMEDIATE' | 'HIGH';
  cormackLehaneEstimate: CormackLehaneGrade;
  pogoScorePct: number; // 0 - 100%

  // Predictive Checklists
  difficultMaskVentilationRisk: 'LOW' | 'MODERATE' | 'HIGH';
  difficultMaskFactors: string[];
  difficultIntubationRisk: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  difficultIntubationFactors: string[];
  difficultSadRisk: 'LOW' | 'MODERATE' | 'HIGH';
  difficultSadFactors: string[];
  difficultCricothyroidotomyRisk: 'LOW' | 'MODERATE' | 'HIGH';
  difficultCricFactors: string[];

  // Primary Strategy Recommendation
  primaryStrategy: 'ROUTINE_PLAN_A' | 'VIDEO_LARYNGOSCOPY_FIRST_LINE' | 'AWAKE_TRACHEAL_INTUBATION';
  primaryStrategyRationale: string;

  // Active DAS Step Analysis
  dasAlgorithmStep: 'PLAN_A' | 'PLAN_B' | 'PLAN_C' | 'PLAN_D_CICO' | 'WAKE_PATIENT' | 'INTUBATION_SUCCESSFUL';
  dasActionPrompt: string;
  isCicoActive: boolean;
  cicoCriticalCountdownSec: number;

  // Procedural Guidance
  recommendedEquipment: string[];
  topicalizationProtocol?: string[];
  clinicalAlerts: string[];
}

/**
 * Computes STOP-BANG Score (0 - 8) for Obstructive Sleep Apnea (OSA).
 */
export function calculateStopBangScore(q: StopBangQuestionnaire): {
  score: number;
  risk: 'LOW' | 'INTERMEDIATE' | 'HIGH';
} {
  let score = 0;
  if (q.snoring) score++;
  if (q.tiredness) score++;
  if (q.observedApnea) score++;
  if (q.highBloodPressure) score++;
  if (q.bmiOver35) score++;
  if (q.ageOver50) score++;
  if (q.neckCircumferenceOver40) score++;
  if (q.genderMale) score++;

  let risk: 'LOW' | 'INTERMEDIATE' | 'HIGH' = 'LOW';
  if (score >= 5) risk = 'HIGH';
  else if (score >= 3) risk = 'INTERMEDIATE';

  return { score, risk };
}

/**
 * Estimates Cormack-Lehane grade and POGO score from anatomical bedside predictors.
 */
export function estimateGlotticView(
  mallampati: MallampatiClass,
  tmdCm: number,
  ulbt: UlbtClass,
  cervicalMobilityDeg: number
): { cormack: CormackLehaneGrade; pogoPct: number } {
  let riskPoints = 0;
  if (mallampati === 'CLASS_IV') riskPoints += 3;
  else if (mallampati === 'CLASS_III') riskPoints += 2;
  else if (mallampati === 'CLASS_II') riskPoints += 1;

  if (tmdCm < 5.0) riskPoints += 3;
  else if (tmdCm < 6.0) riskPoints += 2;

  if (ulbt === 'CLASS_3') riskPoints += 3;
  else if (ulbt === 'CLASS_2') riskPoints += 1;

  if (cervicalMobilityDeg < 25) riskPoints += 3;
  else if (cervicalMobilityDeg < 35) riskPoints += 1;

  if (riskPoints >= 8) {
    return { cormack: 'GRADE_4', pogoPct: 0 };
  } else if (riskPoints >= 5) {
    return { cormack: 'GRADE_3', pogoPct: 15 };
  } else if (riskPoints >= 3) {
    return { cormack: 'GRADE_2B', pogoPct: 40 };
  } else if (riskPoints >= 1) {
    return { cormack: 'GRADE_2A', pogoPct: 70 };
  } else {
    return { cormack: 'GRADE_1', pogoPct: 100 };
  }
}

/**
 * Full master clinical evaluation of Difficult Airway risk, DAS 2015 pathway, and CICO status.
 */
export function evaluateDifficultAirway(
  anatomy: AirwayAnatomyExam,
  stopBang: StopBangQuestionnaire,
  dasState: DasAlgorithmState
): DifficultAirwayEvaluation {
  const alerts: string[] = [];

  // 1. STOP-BANG Calculation
  const { score: stopBangScore, risk: stopBangRisk } = calculateStopBangScore(stopBang);

  // 2. Glottic View Estimate
  const { cormack: cormackLehaneEstimate, pogoPct: pogoScorePct } = estimateGlotticView(
    anatomy.mallampati,
    anatomy.thyromentalDistanceCm,
    anatomy.ulbt,
    anatomy.cervicalMobilityDeg
  );

  // 3. Difficult Mask Ventilation (MOANS)
  const maskFactors: string[] = [];
  if (anatomy.hasBeard) maskFactors.push('M: Mask seal impaired by facial beard');
  if (anatomy.bmiKgM2 >= 30 || stopBangScore >= 3) maskFactors.push('O: Obesity / Obstructive Sleep Apnea');
  if (anatomy.ageYears >= 55) maskFactors.push('A: Age \u2265 55 years (tissue laxity)');
  if (anatomy.isEdentulous) maskFactors.push('N: No teeth / edentulous (collapsed oral cavity)');
  if (anatomy.cervicalMobilityDeg < 35 || anatomy.neckCircumferenceCm > 40)
    maskFactors.push('S: Stiff lungs / restricted cervical extension');

  let difficultMaskVentilationRisk: 'LOW' | 'MODERATE' | 'HIGH' = 'LOW';
  if (maskFactors.length >= 3) difficultMaskVentilationRisk = 'HIGH';
  else if (maskFactors.length >= 1) difficultMaskVentilationRisk = 'MODERATE';

  // 4. Difficult Intubation (LEMON)
  const intubationFactors: string[] = [];
  if (anatomy.interIncisorGapCm < 3.0)
    intubationFactors.push(`Restricted mouth opening (${anatomy.interIncisorGapCm.toFixed(1)} cm < 3.0 cm)`);
  if (anatomy.thyromentalDistanceCm < 6.0)
    intubationFactors.push(`Short Thyromental Distance (${anatomy.thyromentalDistanceCm.toFixed(1)} cm < 6.0 cm)`);
  if (anatomy.sternomentalDistanceCm < 12.5)
    intubationFactors.push(`Short Sternomental Distance (${anatomy.sternomentalDistanceCm.toFixed(1)} cm < 12.5 cm)`);
  if (anatomy.mallampati === 'CLASS_III' || anatomy.mallampati === 'CLASS_IV')
    intubationFactors.push(`High Mallampati Score (${anatomy.mallampati.replace('_', ' ')})`);
  if (anatomy.ulbt === 'CLASS_3')
    intubationFactors.push('Upper Lip Bite Test Class 3 (mandible cannot bite upper lip)');
  if (anatomy.cervicalMobilityDeg < 35)
    intubationFactors.push(`Impaired neck extension (${anatomy.cervicalMobilityDeg}\u00B0 < 35\u00B0)`);
  if (anatomy.hasCervicalSpineInstability)
    intubationFactors.push('Unstable Cervical Spine: Neck extension strictly contraindicated');

  let difficultIntubationRisk: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL' = 'LOW';
  if (
    anatomy.hasTrismusOrLudwigPhlegmon ||
    anatomy.hasStridorOrAirwayTumor ||
    (anatomy.interIncisorGapCm < 2.0 && anatomy.thyromentalDistanceCm < 5.0)
  ) {
    difficultIntubationRisk = 'CRITICAL';
    alerts.push('CRITICAL AIRWAY: Severe anatomical restriction/stridor. Awake Intubation indicated.');
  } else if (intubationFactors.length >= 3) {
    difficultIntubationRisk = 'HIGH';
  } else if (intubationFactors.length >= 1) {
    difficultIntubationRisk = 'MODERATE';
  }

  // 5. Difficult Supraglottic Airway Device (RODS)
  const sadFactors: string[] = [];
  if (anatomy.interIncisorGapCm < 2.5) sadFactors.push('R: Restricted mouth opening for SAD insertion');
  if (anatomy.hasStridorOrAirwayTumor) sadFactors.push('O: Supraglottic/laryngeal obstruction');
  if (anatomy.hasTrismusOrLudwigPhlegmon) sadFactors.push('D: Disrupted/distorted pharyngeal anatomy');
  if (anatomy.cervicalMobilityDeg < 30) sadFactors.push('S: Stiff cervical spine');

  let difficultSadRisk: 'LOW' | 'MODERATE' | 'HIGH' = 'LOW';
  if (sadFactors.length >= 2) difficultSadRisk = 'HIGH';
  else if (sadFactors.length >= 1) difficultSadRisk = 'MODERATE';

  // 6. Difficult Front-of-Neck Access / Cricothyroidotomy (SHORT)
  const cricFactors: string[] = [];
  if (anatomy.neckCircumferenceCm > 44 || anatomy.bmiKgM2 > 40)
    cricFactors.push('O: Obese neck / obscured landmarks');
  if (anatomy.hasTrismusOrLudwigPhlegmon)
    cricFactors.push('T: Tumor / neck abscess distortion');

  let difficultCricothyroidotomyRisk: 'LOW' | 'MODERATE' | 'HIGH' = 'LOW';
  if (cricFactors.length >= 2) difficultCricothyroidotomyRisk = 'HIGH';
  else if (cricFactors.length === 1) difficultCricothyroidotomyRisk = 'MODERATE';

  // 7. Primary Strategy Decision: Awake Intubation vs Video Laryngoscopy vs Routine
  let primaryStrategy: 'ROUTINE_PLAN_A' | 'VIDEO_LARYNGOSCOPY_FIRST_LINE' | 'AWAKE_TRACHEAL_INTUBATION' =
    'ROUTINE_PLAN_A';
  let primaryStrategyRationale = '';
  const recommendedEquipment: string[] = [];
  let topicalizationProtocol: string[] | undefined = undefined;

  if (
    anatomy.hasTrismusOrLudwigPhlegmon ||
    anatomy.hasStridorOrAirwayTumor ||
    difficultIntubationRisk === 'CRITICAL'
  ) {
    primaryStrategy = 'AWAKE_TRACHEAL_INTUBATION';
    primaryStrategyRationale =
      'Anticipated simultaneous failure of tracheal intubation and facemask ventilation (or severe anatomical trismus/submandibular phlegmon/stridor). Induction of general anesthesia risks catastrophic CICO. Awake Tracheal Intubation (ATI) under spontaneous breathing is the safest gold standard.';

    recommendedEquipment.push('Flexible Fiberoptic Intubation Videoscope (3.8 - 4.2 mm outer diameter)');
    recommendedEquipment.push('Atomizer device with 4% Lidocaine (max 9 mg/kg total lidocaine)');
    recommendedEquipment.push('Target-Controlled Infusion (TCI) Remifentanil (Ce 1.0 - 2.0 ng/mL) or Dexmedetomidine');
    recommendedEquipment.push('Difficult Airway Trolley on standby, ENT surgeon notified');

    topicalizationProtocol = [
      '1. Pre-procedure Glycopyrrolate 0.2 mg IV (anti-sialagogue 15-20 min prior)',
      '2. Co-phenylcaine nasal spray or 4% Lidocaine nebulization 4 mL over 15 min',
      '3. Trans-tracheal injection (2 mL 4% lidocaine) OR spray-as-you-go via scope working channel',
      '4. Maintain conscious, spontaneous ventilation; verify vocal cord abduction before entering trachea',
      '5. Rail-road flexometallic / reinforced ETT (size 6.5 - 7.0 mm) with gentle 90° counter-clockwise rotation',
    ];
  } else if (
    difficultIntubationRisk === 'HIGH' ||
    difficultIntubationRisk === 'MODERATE' ||
    anatomy.hasCervicalSpineInstability ||
    difficultMaskVentilationRisk === 'HIGH'
  ) {
    primaryStrategy = 'VIDEO_LARYNGOSCOPY_FIRST_LINE';
    primaryStrategyRationale =
      'Predictors of difficult direct laryngoscopy or difficult mask ventilation present. First-line Video Laryngoscopy (with hyperangulated blade, pre-shaped rigid stylet, and ramped position) significantly improves first-pass intubation success and avoids cervical spine hyperextension.';

    recommendedEquipment.push('Hyperangulated Video Laryngoscope (e.g. GlideScope / McGrath)');
    recommendedEquipment.push('Rigid pre-curved stylet (60° angle) & Tracheal Bougie (15 Fr, 70 cm)');
    recommendedEquipment.push('2nd-Generation Supraglottic Airway Device (i-gel / ProSeal size 4/5)');
    recommendedEquipment.push('Scalpel-Bougie-Tube Emergency Front-of-Neck Access kit on top of trolley');
  } else {
    primaryStrategy = 'ROUTINE_PLAN_A';
    primaryStrategyRationale =
      'Normal baseline airway anatomy. Proceed with standard DAS Plan A induction, ensuring pre-oxygenation to ETO2 > 85%, optimal sniffing position, and backup bougie immediately accessible.';

    recommendedEquipment.push('Macintosh size 3/4 blade + Video Laryngoscope backup');
    recommendedEquipment.push('Endotracheal tubes (cuffed 7.5 & 8.0 mm)');
    recommendedEquipment.push('Tracheal Bougie with Coude tip');
    recommendedEquipment.push('2nd-Generation Supraglottic Airway Device (i-gel size 4)');
  }

  // 8. Active DAS Algorithm Step Analysis
  let dasAlgorithmStep: 'PLAN_A' | 'PLAN_B' | 'PLAN_C' | 'PLAN_D_CICO' | 'WAKE_PATIENT' | 'INTUBATION_SUCCESSFUL' =
    'PLAN_A';
  let dasActionPrompt = '';
  let isCicoActive = false;
  let cicoCriticalCountdownSec = 60;

  if (dasState.currentPlan === 'AWAKE_INTUBATION') {
    dasAlgorithmStep = 'PLAN_A';
    dasActionPrompt = 'Perform Awake Fiberoptic Intubation under topicalization and conscious sedation.';
  } else if (dasState.planDDeclared || dasState.currentPlan === 'PLAN_D_CICO') {
    dasAlgorithmStep = 'PLAN_D_CICO';
    isCicoActive = true;
    cicoCriticalCountdownSec = Math.max(0, 60 - dasState.cicoTimeElapsedSeconds);
    dasActionPrompt =
      'DECLARE CICO EMERGENCY: Call for help, 100% O2, laryngeal handshake -> execute Scalpel-Bougie-Tube Cricothyroidotomy (#10 blade transverse stab -> 90° turn -> insert bougie -> rail-road 6.0 cuffed tube).';
    alerts.push('EMERGENCY CICO DECLARED: Immediately execute Scalpel-Bougie-Tube cricothyroidotomy.');
  } else if (dasState.currentPlan === 'PLAN_C') {
    if (dasState.planCVentilationSuccessful) {
      dasAlgorithmStep = 'WAKE_PATIENT';
      dasActionPrompt =
        'Plan C Facemask Bailout Successful: Maintain oxygenation with 2-person mask technique. Reverse neuromuscular blockade (Sugammadex 16 mg/kg for immediate Rocuronium reversal) and WAKE PATIENT UP.';
    } else {
      dasAlgorithmStep = 'PLAN_D_CICO';
      isCicoActive = true;
      dasActionPrompt =
        'CANNOT OXYGENATE via facemask or SAD: DECLARE CICO IMMEDIATELY. Transition without hesitation to Plan D.';
      alerts.push('Plan C Failed: Oxygenation impossible. DECLARE CICO NOW.');
    }
  } else if (dasState.currentPlan === 'PLAN_B') {
    if (dasState.planBAttempts >= 2) {
      dasAlgorithmStep = 'PLAN_C';
      dasActionPrompt =
        'Plan B SAD Failed (max 2 attempts exceeded): Transition immediately to Plan C Facemask Bailout. Call for difficult airway assistance.';
      alerts.push('Plan B Failed: 2 SAD insertion attempts exhausted. Move to Plan C.');
    } else {
      dasAlgorithmStep = 'PLAN_B';
      dasActionPrompt =
        'Plan B Active: Insert 2nd-generation Supraglottic Airway Device (i-gel / ProSeal with gastric port). Confirm ventilation with capnography.';
    }
  } else {
    // PLAN_A
    if (dasState.planAAttempts >= 3) {
      dasAlgorithmStep = 'PLAN_B';
      dasActionPrompt =
        'Plan A Tracheal Intubation Failed (3 attempts reached): Declare Plan A failure. Switch immediately to Plan B (2nd Generation Supraglottic Airway Device).';
      alerts.push('Plan A Failed: 3 intubation attempts exhausted. Do NOT persist with laryngoscopy.');
    } else {
      dasAlgorithmStep = 'PLAN_A';
      dasActionPrompt =
        `Plan A Active (Attempt ${dasState.planAAttempts + 1} of 3): Pre-oxygenate, optimize position, consider Video Laryngoscope with bougie.`;
    }
  }

  return {
    stopBangScore,
    stopBangRisk,
    cormackLehaneEstimate,
    pogoScorePct,
    difficultMaskVentilationRisk,
    difficultMaskFactors: maskFactors,
    difficultIntubationRisk,
    difficultIntubationFactors: intubationFactors,
    difficultSadRisk,
    difficultSadFactors: sadFactors,
    difficultCricothyroidotomyRisk,
    difficultCricFactors: cricFactors,
    primaryStrategy,
    primaryStrategyRationale,
    dasAlgorithmStep,
    dasActionPrompt,
    isCicoActive,
    cicoCriticalCountdownSec,
    recommendedEquipment,
    topicalizationProtocol,
    clinicalAlerts: alerts,
  };
}

// -------------------------------------------------------------------------
// CLINICAL PRESETS (8 Comprehensive Scenarios)
// -------------------------------------------------------------------------

export interface DifficultAirwayPreset {
  id: string;
  name: string;
  category: string;
  description: string;
  anatomy: AirwayAnatomyExam;
  stopBang: StopBangQuestionnaire;
  dasState: DasAlgorithmState;
}

export const DIFFICULT_AIRWAY_PRESETS: DifficultAirwayPreset[] = [
  {
    id: 'NORMAL_AIRWAY_ROUTINE',
    name: 'Normal Airway (Routine DAS Plan A)',
    category: 'Standard Induction',
    description:
      '28-year-old male for elective arthroscopy. Mallampati Class I, normal mouth opening (4.5 cm), thyromental distance 7.5 cm, full neck extension, and low OSA risk. Standard direct or video laryngoscopy.',
    anatomy: {
      mallampati: 'CLASS_I',
      thyromentalDistanceCm: 7.5,
      sternomentalDistanceCm: 14.0,
      interIncisorGapCm: 4.5,
      ulbt: 'CLASS_1',
      cervicalMobilityDeg: 45,
      neckCircumferenceCm: 37,
      bmiKgM2: 23.5,
      hasBeard: false,
      isEdentulous: false,
      hasStridorOrAirwayTumor: false,
      hasCervicalSpineInstability: false,
      hasTrismusOrLudwigPhlegmon: false,
      ageYears: 28,
      sex: 'MALE',
    },
    stopBang: {
      snoring: false,
      tiredness: false,
      observedApnea: false,
      highBloodPressure: false,
      bmiOver35: false,
      ageOver50: false,
      neckCircumferenceOver40: false,
      genderMale: true,
    },
    dasState: {
      currentPlan: 'PLAN_A',
      planAAttempts: 0,
      planBAttempts: 0,
      planCVentilationSuccessful: true,
      planDDeclared: false,
      usedVideoLaryngoscope: false,
      usedBougieOrStylet: false,
      usedSecondGenSad: false,
      sugammadexAdministered: false,
      currentSpo2Pct: 99,
      cicoTimeElapsedSeconds: 0,
    },
  },
  {
    id: 'MORBID_OBESITY_OSA_DIFFICULT_MASK',
    name: 'Morbid Obesity & Severe OSA (Difficult Mask & Video Laryngoscopy)',
    category: 'Anatomical Risk',
    description:
      '52-year-old male with BMI 44 kg/m², STOP-BANG 7, thick neck (47 cm), beard, Mallampati Class III, and restricted extension. High risk for difficult mask ventilation (MOANS) and rapid desaturation. Ramped position and first-line video laryngoscopy indicated.',
    anatomy: {
      mallampati: 'CLASS_III',
      thyromentalDistanceCm: 5.8,
      sternomentalDistanceCm: 11.5,
      interIncisorGapCm: 3.6,
      ulbt: 'CLASS_2',
      cervicalMobilityDeg: 28,
      neckCircumferenceCm: 47,
      bmiKgM2: 44.0,
      hasBeard: true,
      isEdentulous: false,
      hasStridorOrAirwayTumor: false,
      hasCervicalSpineInstability: false,
      hasTrismusOrLudwigPhlegmon: false,
      ageYears: 52,
      sex: 'MALE',
    },
    stopBang: {
      snoring: true,
      tiredness: true,
      observedApnea: true,
      highBloodPressure: true,
      bmiOver35: true,
      ageOver50: true,
      neckCircumferenceOver40: true,
      genderMale: true,
    },
    dasState: {
      currentPlan: 'PLAN_A',
      planAAttempts: 1,
      planBAttempts: 0,
      planCVentilationSuccessful: true,
      planDDeclared: false,
      usedVideoLaryngoscope: true,
      usedBougieOrStylet: true,
      usedSecondGenSad: false,
      sugammadexAdministered: false,
      currentSpo2Pct: 94,
      cicoTimeElapsedSeconds: 0,
    },
  },
  {
    id: 'LUDWIG_ANGINA_AWAKE_FIBEROPTIC',
    name: "Ludwig's Angina & Trismus (Absolute Awake Tracheal Intubation)",
    category: 'Critical Airway',
    description:
      '34-year-old female with severe submandibular and sublingual phlegmon. Severe trismus (mouth opening 1.4 cm), elevated floor of mouth, and positional stridor. Induction of anesthesia will precipitate fatal airway loss. Mandatory Awake Fiberoptic Intubation under topicalization.',
    anatomy: {
      mallampati: 'CLASS_IV',
      thyromentalDistanceCm: 4.2,
      sternomentalDistanceCm: 10.0,
      interIncisorGapCm: 1.4,
      ulbt: 'CLASS_3',
      cervicalMobilityDeg: 15,
      neckCircumferenceCm: 42,
      bmiKgM2: 26.0,
      hasBeard: false,
      isEdentulous: false,
      hasStridorOrAirwayTumor: true,
      hasCervicalSpineInstability: false,
      hasTrismusOrLudwigPhlegmon: true,
      ageYears: 34,
      sex: 'FEMALE',
    },
    stopBang: {
      snoring: false,
      tiredness: false,
      observedApnea: false,
      highBloodPressure: false,
      bmiOver35: false,
      ageOver50: false,
      neckCircumferenceOver40: true,
      genderMale: false,
    },
    dasState: {
      currentPlan: 'AWAKE_INTUBATION',
      planAAttempts: 0,
      planBAttempts: 0,
      planCVentilationSuccessful: false,
      planDDeclared: false,
      usedVideoLaryngoscope: false,
      usedBougieOrStylet: false,
      usedSecondGenSad: false,
      sugammadexAdministered: false,
      currentSpo2Pct: 96,
      cicoTimeElapsedSeconds: 0,
    },
  },
  {
    id: 'PIERRE_ROBIN_RETROGNATHIA',
    name: 'Pierre Robin Sequence (Severe Micrognathia / Cormack 4)',
    category: 'Congenital Craniofacial',
    description:
      '19-year-old male with severe congenital retrognathia and micrognathia. Thyromental distance is only 3.8 cm, Mallampati Class IV, with glottic axis completely anterior. Direct laryngoscopy guaranteed Cormack-Lehane Grade 4 view. Requires video laryngoscopy with hyperangulated blade or fiberoptic.',
    anatomy: {
      mallampati: 'CLASS_IV',
      thyromentalDistanceCm: 3.8,
      sternomentalDistanceCm: 9.8,
      interIncisorGapCm: 3.2,
      ulbt: 'CLASS_3',
      cervicalMobilityDeg: 40,
      neckCircumferenceCm: 36,
      bmiKgM2: 20.5,
      hasBeard: false,
      isEdentulous: false,
      hasStridorOrAirwayTumor: false,
      hasCervicalSpineInstability: false,
      hasTrismusOrLudwigPhlegmon: false,
      ageYears: 19,
      sex: 'MALE',
    },
    stopBang: {
      snoring: true,
      tiredness: false,
      observedApnea: true,
      highBloodPressure: false,
      bmiOver35: false,
      ageOver50: false,
      neckCircumferenceOver40: false,
      genderMale: true,
    },
    dasState: {
      currentPlan: 'PLAN_A',
      planAAttempts: 1,
      planBAttempts: 0,
      planCVentilationSuccessful: true,
      planDDeclared: false,
      usedVideoLaryngoscope: true,
      usedBougieOrStylet: true,
      usedSecondGenSad: false,
      sugammadexAdministered: false,
      currentSpo2Pct: 98,
      cicoTimeElapsedSeconds: 0,
    },
  },
  {
    id: 'UNSTABLE_C_SPINE_TRAUMA',
    name: 'Unstable Cervical Spine Trauma (Manual In-Line Stabilization)',
    category: 'Trauma & Emergency',
    description:
      '24-year-old male after motorcycle accident with C4-C5 bilateral facet subluxation in hard cervical collar. Neck extension strictly forbidden. Must perform Manual In-Line Stabilization (MILS) and video laryngoscopy with low-profile blade to prevent quadriplegia.',
    anatomy: {
      mallampati: 'CLASS_II',
      thyromentalDistanceCm: 6.8,
      sternomentalDistanceCm: 13.5,
      interIncisorGapCm: 3.8,
      ulbt: 'CLASS_1',
      cervicalMobilityDeg: 0, // Neck extension prohibited!
      neckCircumferenceCm: 39,
      bmiKgM2: 24.5,
      hasBeard: false,
      isEdentulous: false,
      hasStridorOrAirwayTumor: false,
      hasCervicalSpineInstability: true,
      hasTrismusOrLudwigPhlegmon: false,
      ageYears: 24,
      sex: 'MALE',
    },
    stopBang: {
      snoring: false,
      tiredness: false,
      observedApnea: false,
      highBloodPressure: false,
      bmiOver35: false,
      ageOver50: false,
      neckCircumferenceOver40: false,
      genderMale: true,
    },
    dasState: {
      currentPlan: 'PLAN_A',
      planAAttempts: 0,
      planBAttempts: 0,
      planCVentilationSuccessful: true,
      planDDeclared: false,
      usedVideoLaryngoscope: true,
      usedBougieOrStylet: true,
      usedSecondGenSad: false,
      sugammadexAdministered: false,
      currentSpo2Pct: 99,
      cicoTimeElapsedSeconds: 0,
    },
  },
  {
    id: 'ACUTE_EPIGLOTTITIS_STRIDOR',
    name: 'Adult Acute Epiglottitis & Impending Airway Occlusion',
    category: 'Infectious Emergency',
    description:
      '45-year-old female with sore throat, dysphagia, drooling, and high-pitched inspiratory stridor. Lateral neck radiograph shows classic "thumbprint" sign. Immediate OR transfer with ENT surgeon scrubbed for emergency tracheostomy during inhalational induction.',
    anatomy: {
      mallampati: 'CLASS_III',
      thyromentalDistanceCm: 5.5,
      sternomentalDistanceCm: 12.0,
      interIncisorGapCm: 2.8,
      ulbt: 'CLASS_2',
      cervicalMobilityDeg: 25,
      neckCircumferenceCm: 38,
      bmiKgM2: 27.5,
      hasBeard: false,
      isEdentulous: false,
      hasStridorOrAirwayTumor: true,
      hasCervicalSpineInstability: false,
      hasTrismusOrLudwigPhlegmon: false,
      ageYears: 45,
      sex: 'FEMALE',
    },
    stopBang: {
      snoring: false,
      tiredness: false,
      observedApnea: false,
      highBloodPressure: false,
      bmiOver35: false,
      ageOver50: false,
      neckCircumferenceOver40: false,
      genderMale: false,
    },
    dasState: {
      currentPlan: 'AWAKE_INTUBATION',
      planAAttempts: 0,
      planBAttempts: 0,
      planCVentilationSuccessful: false,
      planDDeclared: false,
      usedVideoLaryngoscope: false,
      usedBougieOrStylet: false,
      usedSecondGenSad: false,
      sugammadexAdministered: false,
      currentSpo2Pct: 92,
      cicoTimeElapsedSeconds: 0,
    },
  },
  {
    id: 'FAILED_INTUBATION_SAD_RESCUE',
    name: 'Plan A Failed \u2192 Plan B 2nd Gen SAD (i-gel) Successful Rescue',
    category: 'DAS Algorithm Execution',
    description:
      '66-year-old female where 3 attempts at video laryngoscopy failed due to severe pharyngeal edema and anterior glottis. DAS Plan B executed: size 4 i-gel placed with excellent seal (leak pressure 28 cmH2O) and normal EtCO2, successfully waking patient up.',
    anatomy: {
      mallampati: 'CLASS_III',
      thyromentalDistanceCm: 5.2,
      sternomentalDistanceCm: 11.0,
      interIncisorGapCm: 3.4,
      ulbt: 'CLASS_2',
      cervicalMobilityDeg: 25,
      neckCircumferenceCm: 41,
      bmiKgM2: 32.0,
      hasBeard: false,
      isEdentulous: true,
      hasStridorOrAirwayTumor: false,
      hasCervicalSpineInstability: false,
      hasTrismusOrLudwigPhlegmon: false,
      ageYears: 66,
      sex: 'FEMALE',
    },
    stopBang: {
      snoring: true,
      tiredness: true,
      observedApnea: false,
      highBloodPressure: true,
      bmiOver35: false,
      ageOver50: true,
      neckCircumferenceOver40: true,
      genderMale: false,
    },
    dasState: {
      currentPlan: 'PLAN_B',
      planAAttempts: 3, // Exhausted
      planBAttempts: 1, // 1st attempt successful
      planCVentilationSuccessful: true,
      planDDeclared: false,
      usedVideoLaryngoscope: true,
      usedBougieOrStylet: true,
      usedSecondGenSad: true,
      sugammadexAdministered: false,
      currentSpo2Pct: 98,
      cicoTimeElapsedSeconds: 0,
    },
  },
  {
    id: 'CICO_EMERGENCY_SCALPEL_CRICOTHYROIDOTOMY',
    name: "CAN'T INTUBATE, CAN'T OXYGENATE (CICO) \u2192 Scalpel-Bougie eFONA",
    category: 'Catastrophic Emergency',
    description:
      '58-year-old male with extensive airway burns and rapidly evolving glottic edema. Plan A intubation failed (3 attempts), Plan B SAD failed (airway obstruction), and Plan C facemask impossible (SpO2 falling through 64%). Full CICO declared -> Scalpel-Bougie-Tube cricothyroidotomy performed in 40 seconds, rescuing life.',
    anatomy: {
      mallampati: 'CLASS_IV',
      thyromentalDistanceCm: 4.8,
      sternomentalDistanceCm: 10.2,
      interIncisorGapCm: 2.2,
      ulbt: 'CLASS_3',
      cervicalMobilityDeg: 20,
      neckCircumferenceCm: 45,
      bmiKgM2: 35.0,
      hasBeard: true,
      isEdentulous: false,
      hasStridorOrAirwayTumor: true,
      hasCervicalSpineInstability: false,
      hasTrismusOrLudwigPhlegmon: false,
      ageYears: 58,
      sex: 'MALE',
    },
    stopBang: {
      snoring: true,
      tiredness: true,
      observedApnea: true,
      highBloodPressure: true,
      bmiOver35: true,
      ageOver50: true,
      neckCircumferenceOver40: true,
      genderMale: true,
    },
    dasState: {
      currentPlan: 'PLAN_D_CICO',
      planAAttempts: 3,
      planBAttempts: 2,
      planCVentilationSuccessful: false,
      planDDeclared: true,
      usedVideoLaryngoscope: true,
      usedBougieOrStylet: true,
      usedSecondGenSad: true,
      sugammadexAdministered: true,
      currentSpo2Pct: 68,
      cicoTimeElapsedSeconds: 35,
    },
  },
];
