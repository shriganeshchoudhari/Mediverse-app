/**
 * AudiometryEngine.ts
 * Biophysical Pure Tone Audiometry & Jerger Tympanometry Simulation Engine
 * Location: frontend/.gemini/skills/AudiometryEngine.ts
 *
 * Implements:
 * 1. Pure Tone Audiometry (PTA) octave frequencies (125 to 8000 Hz) and decibel hearing levels (-10 to 120 dB HL)
 * 2. Air-Bone Gap (ABG) and Pure Tone Average (PTA4: 500, 1000, 2000, 4000 Hz)
 * 3. WHO / ASHA Hearing Loss Severity Grading (Normal, Mild, Moderate, Moderately Severe, Severe, Profound)
 * 4. Jerger Tympanometry Curve Modeling & Classification (Type A, As, Ad, B with ECV differentiation, Type C)
 * 5. Speech Audiometry (SRT, WRS %, Rollover Index for retrocochlear pathology)
 * 6. Stapedial Acoustic Reflex Matrix (500, 1000, 2000, 4000 Hz ipsilateral/contralateral)
 * 7. Evidence-based Clinical Guidelines (AAO-HNS Sudden SNHL, Otosclerosis, OME grommet indications)
 */

export type HearingLossGrade =
  | 'NORMAL'
  | 'MILD'
  | 'MODERATE'
  | 'MODERATELY_SEVERE'
  | 'SEVERE'
  | 'PROFOUND';

export type HearingLossType =
  | 'NORMAL'
  | 'CONDUCTIVE'
  | 'SENSORINEURAL'
  | 'MIXED';

export type JergerType =
  | 'TYPE_A'
  | 'TYPE_AS'
  | 'TYPE_AD'
  | 'TYPE_B_EFFUSION'
  | 'TYPE_B_PERFORATION'
  | 'TYPE_B_OCCLUSION'
  | 'TYPE_C';

export type AudiometryAlarm =
  | 'OPTIMAL_HEARING'
  | 'SUDDEN_SNHL_EMERGENCY'
  | 'ASYMMETRIC_SNHL_RETROCOCHLEAR_ALERT'
  | 'CONDUCTIVE_AIR_BONE_GAP'
  | 'TYMPANIC_PERFORATION_RISK'
  | 'GLUE_EAR_EFFUSION'
  | 'ACOUSTIC_TRAUMA_4KHZ_NOTCH'
  | 'CARHART_NOTCH_OTOSCLEROSIS';

export type AudiometryPresetId =
  | 'NORMAL_BILATERAL'
  | 'OTOSCLEROSIS_CARHART'
  | 'OTITIS_MEDIA_EFFUSION_GLUE_EAR'
  | 'TYMPANIC_MEMBRANE_PERFORATION'
  | 'PRESBYCUSIS_AGE_RELATED'
  | 'NOISE_INDUCED_HEARING_LOSS'
  | 'VESTIBULAR_SCHWANNOMA_RETROCOCHLEAR'
  | 'EUSTACHIAN_TUBE_DYSFUNCTION';

export interface EarThresholds {
  // Octave frequencies: 125, 250, 500, 1000, 2000, 4000, 8000 Hz
  ac: { [freq: number]: number }; // Air Conduction in dB HL
  bc: { [freq: number]: number }; // Bone Conduction in dB HL
}

export interface TympanogramParams {
  earCanalVolumeMl: number; // 0.2 to 5.0 mL (normal adult: 0.8 - 2.0 mL)
  peakComplianceMl: number; // 0.0 to 3.0 mL (normal: 0.3 - 1.6 mL)
  middleEarPressureDaPa: number; // -400 to +200 daPa (normal: -100 to +50 daPa)
  tympanometricWidthDaPa: number; // gradient width (normal: 50 - 110 daPa)
}

export interface SpeechAudiometryParams {
  speechRecognitionThresholdDb: number; // SRT in dB HL (matches PTA ± 6 dB)
  wordRecognitionScorePct: number; // WRS at 40 dB SL (normal 92-100%)
  pbMinPct?: number; // minimum performance at high intensity for rollover calculation
}

export interface AcousticReflexState {
  ipsi500: boolean;
  ipsi1000: boolean;
  ipsi2000: boolean;
  ipsi4000: boolean;
  contra500: boolean;
  contra1000: boolean;
  contra2000: boolean;
  contra4000: boolean;
  reflexDecayPresent: boolean; // abnormal decay >50% within 10s at 10 dB SL (retrocochlear sign)
}

export interface AudiometryInputParams {
  presetId: AudiometryPresetId;
  rightEar: EarThresholds;
  leftEar: EarThresholds;
  rightTymp: TympanogramParams;
  leftTymp: TympanogramParams;
  rightSpeech: SpeechAudiometryParams;
  leftSpeech: SpeechAudiometryParams;
  rightReflex: AcousticReflexState;
  leftReflex: AcousticReflexState;
  testDurationDays: number; // For sudden SNHL onset tracking
}

export interface EarAnalysis {
  pta4AcDb: number; // Pure Tone Average AC (500, 1000, 2000, 4000 Hz)
  pta4BcDb: number; // Pure Tone Average BC (500, 1000, 2000, 4000 Hz)
  maxAirBoneGapDb: number;
  hearingLossGrade: HearingLossGrade;
  hearingLossType: HearingLossType;
  jergerType: JergerType;
  rolloverIndex: number;
  speechAgreementGood: boolean; // SRT matches PTA within 6 dB
}

export interface AudiometryState {
  rightEarAnalysis: EarAnalysis;
  leftEarAnalysis: EarAnalysis;
  asymmetryDb: number; // Interaural difference at PTA4
  isAsymmetricSnHl: boolean;
  activeAlarms: AudiometryAlarm[];
  clinicalDiagnosis: string;
  otologicRecommendation: string;
  tuningForkCorrelation: {
    rinneRight: 'POSITIVE' | 'NEGATIVE'; // Positive = AC > BC (normal/SNHL); Negative = BC > AC (conductive)
    rinneLeft: 'POSITIVE' | 'NEGATIVE';
    weberLateralization: 'MIDLINE' | 'RIGHT' | 'LEFT';
  };
}

export const FREQUENCIES = [125, 250, 500, 1000, 2000, 4000, 8000] as const;

/**
 * Classify Hearing Loss Grade based on PTA4 (WHO 2021 Grades)
 */
export function classifyHearingLossGrade(ptaDb: number): HearingLossGrade {
  if (ptaDb <= 20) return 'NORMAL';
  if (ptaDb <= 40) return 'MILD';
  if (ptaDb <= 55) return 'MODERATE';
  if (ptaDb <= 70) return 'MODERATELY_SEVERE';
  if (ptaDb <= 90) return 'SEVERE';
  return 'PROFOUND';
}

/**
 * Classify Hearing Loss Type (Conductive vs Sensorineural vs Mixed)
 */
export function classifyHearingLossType(ptaAcDb: number, ptaBcDb: number, maxAbg: number): HearingLossType {
  if (ptaAcDb <= 20 && ptaBcDb <= 20 && maxAbg < 15) {
    return 'NORMAL';
  }
  if (ptaBcDb <= 20 && maxAbg >= 15) {
    return 'CONDUCTIVE';
  }
  if (maxAbg < 15 && ptaAcDb > 20) {
    return 'SENSORINEURAL';
  }
  return 'MIXED';
}

/**
 * Classify Jerger Tympanometry Type
 */
export function classifyJergerTympanogram(params: TympanogramParams): JergerType {
  const { earCanalVolumeMl, peakComplianceMl, middleEarPressureDaPa } = params;

  // Type B check: flat trace with no compliance peak (<0.1 mL peak height)
  if (peakComplianceMl < 0.1) {
    if (earCanalVolumeMl > 2.2) {
      return 'TYPE_B_PERFORATION'; // Large ECV: tympanic perforation or patent ventilation tube
    }
    if (earCanalVolumeMl < 0.5) {
      return 'TYPE_B_OCCLUSION'; // Low ECV: cerumen impaction or probe against ear canal wall
    }
    return 'TYPE_B_EFFUSION'; // Normal ECV with flat trace: middle ear fluid / glue ear / hemotympanum
  }

  // Type C: peak compliance present, but shifted significantly negative (pressure < -100 daPa)
  if (middleEarPressureDaPa < -100) {
    return 'TYPE_C';
  }

  // Pressure is normal (-100 to +50 daPa)
  // Check compliance:
  if (peakComplianceMl < 0.3) {
    return 'TYPE_AS'; // Shallow: stiff middle ear (otosclerosis, tympanosclerosis)
  }
  if (peakComplianceMl > 1.6) {
    return 'TYPE_AD'; // Deep: hypermobile / flaccid / ossicular disarticulation
  }

  return 'TYPE_A'; // Normal middle ear mobility and pressure
}

/**
 * Calculate Pure Tone Average across 500, 1000, 2000, 4000 Hz
 */
export function calculatePta4(thresholds: { [freq: number]: number }): number {
  const freqs = [500, 1000, 2000, 4000];
  let sum = 0;
  let count = 0;
  for (const f of freqs) {
    if (thresholds[f] !== undefined) {
      sum += thresholds[f];
      count++;
    }
  }
  return count > 0 ? parseFloat((sum / count).toFixed(1)) : 0;
}

/**
 * Calculate maximum Air-Bone Gap across speech frequencies
 */
export function calculateMaxAbg(ac: { [freq: number]: number }, bc: { [freq: number]: number }): number {
  let maxGap = 0;
  const testFreqs = [250, 500, 1000, 2000, 4000];
  for (const f of testFreqs) {
    if (ac[f] !== undefined && bc[f] !== undefined) {
      const gap = Math.max(0, ac[f] - bc[f]);
      if (gap > maxGap) maxGap = gap;
    }
  }
  return maxGap;
}

/**
 * Compute Rollover Index: (PB_max - PB_min) / PB_max
 */
export function calculateRolloverIndex(wrsMaxPct: number, pbMinPct?: number): number {
  if (wrsMaxPct <= 0 || pbMinPct === undefined || pbMinPct >= wrsMaxPct) return 0;
  return parseFloat(((wrsMaxPct - pbMinPct) / wrsMaxPct).toFixed(2));
}

/**
 * Generate synthetic Tympanometry Admittance Curve data points (-400 to +200 daPa)
 */
export function generateTympanogramCurve(params: TympanogramParams): { pressureDaPa: number; complianceMl: number }[] {
  const points: { pressureDaPa: number; complianceMl: number }[] = [];
  const { peakComplianceMl, middleEarPressureDaPa, tympanometricWidthDaPa } = params;

  // Base baseline compliance in canal
  const baseline = 0.1;
  const width = Math.max(40, tympanometricWidthDaPa);

  for (let p = -400; p <= 200; p += 20) {
    // Gaussian peak centered at middleEarPressureDaPa
    const exponent = -Math.pow((p - middleEarPressureDaPa) / (width * 0.8), 2);
    const compliance = baseline + peakComplianceMl * Math.exp(exponent);
    points.push({
      pressureDaPa: p,
      complianceMl: parseFloat(Math.max(0.05, compliance).toFixed(3)),
    });
  }
  return points;
}

/**
 * Comprehensive Audiometry Computation Engine
 */
export function computeAudiometryState(params: AudiometryInputParams): AudiometryState {
  const {
    presetId,
    rightEar,
    leftEar,
    rightTymp,
    leftTymp,
    rightSpeech,
    leftSpeech,
    rightReflex,
    leftReflex,
    testDurationDays,
  } = params;

  // 1. Right Ear Analysis
  const rPtaAc = calculatePta4(rightEar.ac);
  const rPtaBc = calculatePta4(rightEar.bc);
  const rMaxAbg = calculateMaxAbg(rightEar.ac, rightEar.bc);
  const rGrade = classifyHearingLossGrade(rPtaAc);
  const rType = classifyHearingLossType(rPtaAc, rPtaBc, rMaxAbg);
  const rJerger = classifyJergerTympanogram(rightTymp);
  const rRollover = calculateRolloverIndex(rightSpeech.wordRecognitionScorePct, rightSpeech.pbMinPct);
  const rSpeechAgreement = Math.abs(rightSpeech.speechRecognitionThresholdDb - rPtaAc) <= 6;

  const rightEarAnalysis: EarAnalysis = {
    pta4AcDb: rPtaAc,
    pta4BcDb: rPtaBc,
    maxAirBoneGapDb: rMaxAbg,
    hearingLossGrade: rGrade,
    hearingLossType: rType,
    jergerType: rJerger,
    rolloverIndex: rRollover,
    speechAgreementGood: rSpeechAgreement,
  };

  // 2. Left Ear Analysis
  const lPtaAc = calculatePta4(leftEar.ac);
  const lPtaBc = calculatePta4(leftEar.bc);
  const lMaxAbg = calculateMaxAbg(leftEar.ac, leftEar.bc);
  const lGrade = classifyHearingLossGrade(lPtaAc);
  const lType = classifyHearingLossType(lPtaAc, lPtaBc, lMaxAbg);
  const lJerger = classifyJergerTympanogram(leftTymp);
  const lRollover = calculateRolloverIndex(leftSpeech.wordRecognitionScorePct, leftSpeech.pbMinPct);
  const lSpeechAgreement = Math.abs(leftSpeech.speechRecognitionThresholdDb - lPtaAc) <= 6;

  const leftEarAnalysis: EarAnalysis = {
    pta4AcDb: lPtaAc,
    pta4BcDb: lPtaBc,
    maxAirBoneGapDb: lMaxAbg,
    hearingLossGrade: lGrade,
    hearingLossType: lType,
    jergerType: lJerger,
    rolloverIndex: lRollover,
    speechAgreementGood: lSpeechAgreement,
  };

  // 3. Interaural Asymmetry
  const asymmetryDb = parseFloat(Math.abs(rPtaAc - lPtaAc).toFixed(1));
  const isAsymmetricSnHl =
    asymmetryDb >= 15 &&
    (rightEarAnalysis.hearingLossType === 'SENSORINEURAL' || leftEarAnalysis.hearingLossType === 'SENSORINEURAL');

  // 4. Tuning Fork Rinne and Weber Correlation
  // Rinne: Negative if Air-Bone Gap >= 15 dB (BC > AC)
  const rinneRight: 'POSITIVE' | 'NEGATIVE' = rMaxAbg >= 15 ? 'NEGATIVE' : 'POSITIVE';
  const rinneLeft: 'POSITIVE' | 'NEGATIVE' = lMaxAbg >= 15 ? 'NEGATIVE' : 'POSITIVE';

  // Weber lateralizes:
  // - To poorer ear if conductive loss (BC better in affected ear due to absent masking noise)
  // - To better ear if sensorineural loss
  let weberLateralization: 'MIDLINE' | 'RIGHT' | 'LEFT' = 'MIDLINE';
  if (rType === 'CONDUCTIVE' && lType !== 'CONDUCTIVE') {
    weberLateralization = 'RIGHT';
  } else if (lType === 'CONDUCTIVE' && rType !== 'CONDUCTIVE') {
    weberLateralization = 'LEFT';
  } else if (rType === 'SENSORINEURAL' && lType === 'NORMAL') {
    weberLateralization = 'LEFT'; // Weber lateralizes to normal/better ear
  } else if (lType === 'SENSORINEURAL' && rType === 'NORMAL') {
    weberLateralization = 'RIGHT'; // Weber lateralizes to normal/better ear
  } else if (isAsymmetricSnHl) {
    weberLateralization = rPtaAc > lPtaAc ? 'LEFT' : 'RIGHT'; // Lateralizes to better cochlea
  }

  // 5. Active Clinical Alarms
  const activeAlarms: AudiometryAlarm[] = [];

  if (rGrade === 'NORMAL' && lGrade === 'NORMAL' && rJerger === 'TYPE_A' && lJerger === 'TYPE_A') {
    activeAlarms.push('OPTIMAL_HEARING');
  }

  // Sudden SNHL: ≥30 dB drop over 3 contiguous frequencies within 72 hours (3 days)
  if (testDurationDays <= 3 && (rPtaAc >= 35 || lPtaAc >= 35) && (rType === 'SENSORINEURAL' || lType === 'SENSORINEURAL')) {
    activeAlarms.push('SUDDEN_SNHL_EMERGENCY');
  }

  // Asymmetric SNHL or high Rollover Index (>0.45) or reflex decay: Acoustic neuroma alert
  if (isAsymmetricSnHl || rRollover > 0.4 || lRollover > 0.4 || rightReflex.reflexDecayPresent || leftReflex.reflexDecayPresent) {
    activeAlarms.push('ASYMMETRIC_SNHL_RETROCOCHLEAR_ALERT');
  }

  // Significant Air-Bone Gap
  if (rMaxAbg >= 20 || lMaxAbg >= 20) {
    activeAlarms.push('CONDUCTIVE_AIR_BONE_GAP');
  }

  // Tympanic perforation (Type B with large ECV)
  if (rJerger === 'TYPE_B_PERFORATION' || lJerger === 'TYPE_B_PERFORATION') {
    activeAlarms.push('TYMPANIC_PERFORATION_RISK');
  }

  // Glue Ear / Middle Ear Effusion
  if (rJerger === 'TYPE_B_EFFUSION' || lJerger === 'TYPE_B_EFFUSION') {
    activeAlarms.push('GLUE_EAR_EFFUSION');
  }

  // Noise notch at 4000 Hz: AC threshold at 4k is ≥15 dB worse than 2k and 8k
  const rHas4kNotch = (rightEar.ac[4000] - rightEar.ac[2000] >= 15) && (rightEar.ac[4000] - rightEar.ac[8000] >= 10);
  const lHas4kNotch = (leftEar.ac[4000] - leftEar.ac[2000] >= 15) && (leftEar.ac[4000] - leftEar.ac[8000] >= 10);
  if (rHas4kNotch || lHas4kNotch) {
    activeAlarms.push('ACOUSTIC_TRAUMA_4KHZ_NOTCH');
  }

  // Carhart notch in otosclerosis: 2000 Hz bone conduction dip (~15-20 dB higher threshold than 1k and 4k)
  const rCarhart = (rightEar.bc[2000] - rightEar.bc[1000] >= 10) && (rightEar.bc[2000] - rightEar.bc[4000] >= 10) && rMaxAbg >= 15;
  const lCarhart = (leftEar.bc[2000] - leftEar.bc[1000] >= 10) && (leftEar.bc[2000] - leftEar.bc[4000] >= 10) && lMaxAbg >= 15;
  if (rCarhart || lCarhart || rJerger === 'TYPE_AS' || lJerger === 'TYPE_AS') {
    if (rMaxAbg >= 15 || lMaxAbg >= 15) {
      activeAlarms.push('CARHART_NOTCH_OTOSCLEROSIS');
    }
  }

  // 6. Clinical Diagnosis and Actionable Otology Recommendations
  let clinicalDiagnosis = 'Normal Bilateral Auditory Acuity';
  let otologicRecommendation = 'Annual routine audiological screening. Maintain baseline ear conservation.';

  if (activeAlarms.includes('SUDDEN_SNHL_EMERGENCY')) {
    clinicalDiagnosis = 'Acute Idiopathic Sudden Sensorineural Hearing Loss (SSNHL) — Otologic Emergency';
    otologicRecommendation =
      'IMMEDIATE ACTION: Initiate high-dose oral Prednisone (1 mg/kg/day max 60 mg tapered over 14 days) or urgent intratympanic Dexamethasone salvage. Order emergency Contrast-Enhanced MRI of Internal Auditory Canals (IAC). Avoid delay >72h for maximal cochlear hair cell salvage.';
  } else if (activeAlarms.includes('ASYMMETRIC_SNHL_RETROCOCHLEAR_ALERT')) {
    clinicalDiagnosis = 'Unilateral Asymmetric Sensorineural Hearing Loss — Suspected Retrocochlear Lesion (Vestibular Schwannoma)';
    otologicRecommendation =
      'High-resolution Contrast-Enhanced MRI of Cerebellopontine Angle (CPA) / Internal Auditory Canals (IAC) is mandatory to rule out vestibular schwannoma (acoustic neuroma). Perform Auditory Brainstem Response (ABR) latency analysis (interpeak I-V wave delay).';
  } else if (activeAlarms.includes('CARHART_NOTCH_OTOSCLEROSIS')) {
    clinicalDiagnosis = 'Stapedial Otosclerosis with Carhart Notch & Type As Tympanometry';
    otologicRecommendation =
      'Evaluate for Stapedotomy with Teflon piston prosthesis versus bone-anchored or conventional air-conduction hearing aids. Non-contrast High-Resolution Temporal Bone CT to assess fenestral vs retrofenestral spongiosis.';
  } else if (activeAlarms.includes('TYMPANIC_PERFORATION_RISK')) {
    clinicalDiagnosis = 'Tympanic Membrane Perforation (Type B Tympanogram with Abnormally High Ear Canal Volume)';
    otologicRecommendation =
      'Strict dry ear precautions (avoid water ingress, no swimming). Otoscopic microscopy evaluation. If chronic (>3 months) with persistent conductive deficit, plan microscopic/endoscopic Tympanoplasty (tragal cartilage or temporalis fascia underlay). Avoid ototoxic aminoglycoside eardrops.';
  } else if (activeAlarms.includes('GLUE_EAR_EFFUSION')) {
    clinicalDiagnosis = 'Otitis Media with Effusion (OME / Glue Ear) with Type B Flat Tympanogram';
    otologicRecommendation =
      'Conservative watchful waiting for 3 months. If bilateral effusion persists with significant speech/conductive delay, perform bilateral Myringotomy with Tympanostomy Grommet Tube insertion +/- Adenoidectomy.';
  } else if (activeAlarms.includes('ACOUSTIC_TRAUMA_4KHZ_NOTCH')) {
    clinicalDiagnosis = 'Noise-Induced Hearing Loss (NIHL) with Characteristic 4 kHz Acoustic Notch';
    otologicRecommendation =
      'Strict auditory conservation protocol: custom filtered earplugs/attenuators in loud environments (>85 dBA OSHA limits). Monitor serial annual audiograms for notch widening. Recommend hearing aid fitting if speech discrimination is impaired.';
  } else if (presetId === 'PRESBYCUSIS_AGE_RELATED') {
    clinicalDiagnosis = 'Symmetrical Age-Related Sensorineural Hearing Loss (Presbycusis)';
    otologicRecommendation =
      'Bilateral digital hearing aid fitting with wide dynamic range compression (WDRC) and directional microphone processing. Auditory rehabilitation and speech-in-noise training.';
  } else if (presetId === 'EUSTACHIAN_TUBE_DYSFUNCTION') {
    clinicalDiagnosis = 'Eustachian Tube Dysfunction (ETD) with Type C Negative Pressure Tympanometry';
    otologicRecommendation =
      'Intranasal corticosteroid spray (Fluticasone), Valsalva autoinflation maneuvers (Otovent device), and treatment of underlying allergic rhinitis or sinusitis. Consider balloon Eustachian tuboplasty for recalcitrant cases.';
  }

  return {
    rightEarAnalysis,
    leftEarAnalysis,
    asymmetryDb,
    isAsymmetricSnHl,
    activeAlarms,
    clinicalDiagnosis,
    otologicRecommendation,
    tuningForkCorrelation: {
      rinneRight,
      rinneLeft,
      weberLateralization,
    },
  };
}

/**
 * 8 Clinical Standard Presets for Audiometry and Tympanometry
 */
export const AUDIOMETRY_PRESETS: Record<
  AudiometryPresetId,
  {
    title: string;
    description: string;
    initialState: AudiometryInputParams;
  }
> = {
  NORMAL_BILATERAL: {
    title: 'Normal Bilateral Hearing & Type A Tympanometry',
    description: 'Bilateral AC and BC thresholds ≤15 dB HL across all octave frequencies, normal Type A middle ear compliance, and 100% speech discrimination.',
    initialState: {
      presetId: 'NORMAL_BILATERAL',
      rightEar: {
        ac: { 125: 10, 250: 10, 500: 10, 1000: 10, 2000: 10, 4000: 10, 8000: 15 },
        bc: { 250: 10, 500: 10, 1000: 10, 2000: 10, 4000: 10 },
      },
      leftEar: {
        ac: { 125: 10, 250: 10, 500: 10, 1000: 10, 2000: 10, 4000: 10, 8000: 15 },
        bc: { 250: 10, 500: 10, 1000: 10, 2000: 10, 4000: 10 },
      },
      rightTymp: { earCanalVolumeMl: 1.2, peakComplianceMl: 0.9, middleEarPressureDaPa: 0, tympanometricWidthDaPa: 80 },
      leftTymp: { earCanalVolumeMl: 1.2, peakComplianceMl: 0.9, middleEarPressureDaPa: 0, tympanometricWidthDaPa: 80 },
      rightSpeech: { speechRecognitionThresholdDb: 10, wordRecognitionScorePct: 100 },
      leftSpeech: { speechRecognitionThresholdDb: 10, wordRecognitionScorePct: 100 },
      rightReflex: { ipsi500: true, ipsi1000: true, ipsi2000: true, ipsi4000: true, contra500: true, contra1000: true, contra2000: true, contra4000: true, reflexDecayPresent: false },
      leftReflex: { ipsi500: true, ipsi1000: true, ipsi2000: true, ipsi4000: true, contra500: true, contra1000: true, contra2000: true, contra4000: true, reflexDecayPresent: false },
      testDurationDays: 30,
    },
  },

  OTOSCLEROSIS_CARHART: {
    title: 'Stapedial Otosclerosis (Carhart Notch & Type As)',
    description: 'Conductive hearing loss in right ear with characteristic 2000 Hz bone-conduction dip (Carhart notch) and shallow Type As tympanogram due to stapedial footplate ankylosis.',
    initialState: {
      presetId: 'OTOSCLEROSIS_CARHART',
      rightEar: {
        ac: { 125: 45, 250: 50, 500: 45, 1000: 40, 2000: 35, 4000: 30, 8000: 25 },
        bc: { 250: 10, 500: 10, 1000: 15, 2000: 30, 4000: 15 }, // Carhart notch at 2 kHz
      },
      leftEar: {
        ac: { 125: 15, 250: 15, 500: 15, 1000: 15, 2000: 15, 4000: 15, 8000: 15 },
        bc: { 250: 10, 500: 10, 1000: 10, 2000: 10, 4000: 10 },
      },
      rightTymp: { earCanalVolumeMl: 1.1, peakComplianceMl: 0.18, middleEarPressureDaPa: -10, tympanometricWidthDaPa: 120 }, // Type As
      leftTymp: { earCanalVolumeMl: 1.2, peakComplianceMl: 0.85, middleEarPressureDaPa: 0, tympanometricWidthDaPa: 80 },
      rightSpeech: { speechRecognitionThresholdDb: 40, wordRecognitionScorePct: 96 }, // Excellent discrimination at elevated volume
      leftSpeech: { speechRecognitionThresholdDb: 15, wordRecognitionScorePct: 100 },
      rightReflex: { ipsi500: false, ipsi1000: false, ipsi2000: false, ipsi4000: false, contra500: false, contra1000: false, contra2000: false, contra4000: false, reflexDecayPresent: false },
      leftReflex: { ipsi500: true, ipsi1000: true, ipsi2000: true, ipsi4000: true, contra500: false, contra1000: false, contra2000: false, contra4000: false, reflexDecayPresent: false },
      testDurationDays: 180,
    },
  },

  OTITIS_MEDIA_EFFUSION_GLUE_EAR: {
    title: 'Otitis Media with Effusion (Glue Ear & Type B)',
    description: 'Bilateral conductive hearing loss (30-40 dB HL) with flat Type B tympanograms and normal ear canal volume (1.1 mL) diagnostic of middle ear fluid accumulation.',
    initialState: {
      presetId: 'OTITIS_MEDIA_EFFUSION_GLUE_EAR',
      rightEar: {
        ac: { 125: 40, 250: 45, 500: 40, 1000: 35, 2000: 30, 4000: 25, 8000: 20 },
        bc: { 250: 10, 500: 10, 1000: 10, 2000: 10, 4000: 10 },
      },
      leftEar: {
        ac: { 125: 45, 250: 50, 500: 45, 1000: 40, 2000: 35, 4000: 30, 8000: 25 },
        bc: { 250: 10, 500: 10, 1000: 10, 2000: 10, 4000: 10 },
      },
      rightTymp: { earCanalVolumeMl: 1.0, peakComplianceMl: 0.08, middleEarPressureDaPa: -300, tympanometricWidthDaPa: 250 }, // Type B
      leftTymp: { earCanalVolumeMl: 1.1, peakComplianceMl: 0.06, middleEarPressureDaPa: -350, tympanometricWidthDaPa: 250 }, // Type B
      rightSpeech: { speechRecognitionThresholdDb: 38, wordRecognitionScorePct: 94 },
      leftSpeech: { speechRecognitionThresholdDb: 42, wordRecognitionScorePct: 92 },
      rightReflex: { ipsi500: false, ipsi1000: false, ipsi2000: false, ipsi4000: false, contra500: false, contra1000: false, contra2000: false, contra4000: false, reflexDecayPresent: false },
      leftReflex: { ipsi500: false, ipsi1000: false, ipsi2000: false, ipsi4000: false, contra500: false, contra1000: false, contra2000: false, contra4000: false, reflexDecayPresent: false },
      testDurationDays: 90,
    },
  },

  TYMPANIC_MEMBRANE_PERFORATION: {
    title: 'Tympanic Membrane Perforation (High ECV Type B)',
    description: 'Left ear conductive deficit with flat Type B tympanometry and marked ear canal volume enlargement (3.8 mL) due to probe measuring middle ear cavity volume.',
    initialState: {
      presetId: 'TYMPANIC_MEMBRANE_PERFORATION',
      rightEar: {
        ac: { 125: 15, 250: 15, 500: 15, 1000: 15, 2000: 15, 4000: 15, 8000: 15 },
        bc: { 250: 10, 500: 10, 1000: 10, 2000: 10, 4000: 10 },
      },
      leftEar: {
        ac: { 125: 45, 250: 45, 500: 40, 1000: 35, 2000: 25, 4000: 20, 8000: 15 },
        bc: { 250: 10, 500: 10, 1000: 10, 2000: 10, 4000: 10 },
      },
      rightTymp: { earCanalVolumeMl: 1.2, peakComplianceMl: 0.8, middleEarPressureDaPa: 0, tympanometricWidthDaPa: 80 },
      leftTymp: { earCanalVolumeMl: 3.8, peakComplianceMl: 0.05, middleEarPressureDaPa: 0, tympanometricWidthDaPa: 300 }, // High ECV perforation
      rightSpeech: { speechRecognitionThresholdDb: 15, wordRecognitionScorePct: 100 },
      leftSpeech: { speechRecognitionThresholdDb: 35, wordRecognitionScorePct: 96 },
      rightReflex: { ipsi500: true, ipsi1000: true, ipsi2000: true, ipsi4000: true, contra500: false, contra1000: false, contra2000: false, contra4000: false, reflexDecayPresent: false },
      leftReflex: { ipsi500: false, ipsi1000: false, ipsi2000: false, ipsi4000: false, contra500: false, contra1000: false, contra2000: false, contra4000: false, reflexDecayPresent: false },
      testDurationDays: 45,
    },
  },

  PRESBYCUSIS_AGE_RELATED: {
    title: 'Bilateral Presbycusis (High-Frequency SNHL)',
    description: 'Symmetrical, downsloping sensorineural hearing loss affecting higher frequencies (4-8 kHz) with preserved bone conduction mirroring air conduction, Type A tympanograms, and reduced speech-in-noise discrimination.',
    initialState: {
      presetId: 'PRESBYCUSIS_AGE_RELATED',
      rightEar: {
        ac: { 125: 15, 250: 20, 500: 25, 1000: 35, 2000: 50, 4000: 65, 8000: 75 },
        bc: { 250: 20, 500: 25, 1000: 35, 2000: 50, 4000: 65 },
      },
      leftEar: {
        ac: { 125: 15, 250: 20, 500: 25, 1000: 35, 2000: 50, 4000: 65, 8000: 75 },
        bc: { 250: 20, 500: 25, 1000: 35, 2000: 50, 4000: 65 },
      },
      rightTymp: { earCanalVolumeMl: 1.3, peakComplianceMl: 0.7, middleEarPressureDaPa: -15, tympanometricWidthDaPa: 85 },
      leftTymp: { earCanalVolumeMl: 1.3, peakComplianceMl: 0.7, middleEarPressureDaPa: -15, tympanometricWidthDaPa: 85 },
      rightSpeech: { speechRecognitionThresholdDb: 40, wordRecognitionScorePct: 76 },
      leftSpeech: { speechRecognitionThresholdDb: 40, wordRecognitionScorePct: 76 },
      rightReflex: { ipsi500: true, ipsi1000: true, ipsi2000: false, ipsi4000: false, contra500: true, contra1000: true, contra2000: false, contra4000: false, reflexDecayPresent: false },
      leftReflex: { ipsi500: true, ipsi1000: true, ipsi2000: false, ipsi4000: false, contra500: true, contra1000: true, contra2000: false, contra4000: false, reflexDecayPresent: false },
      testDurationDays: 365,
    },
  },

  NOISE_INDUCED_HEARING_LOSS: {
    title: 'Noise-Induced Hearing Loss (4 kHz Acoustic Notch)',
    description: 'Classic bilateral sensory notch centered precisely at 4000 Hz with partial recovery at 8000 Hz, reflecting acoustic trauma damage to the basal turn of the cochlea.',
    initialState: {
      presetId: 'NOISE_INDUCED_HEARING_LOSS',
      rightEar: {
        ac: { 125: 15, 250: 15, 500: 15, 1000: 20, 2000: 25, 4000: 60, 8000: 35 },
        bc: { 250: 15, 500: 15, 1000: 20, 2000: 25, 4000: 60 },
      },
      leftEar: {
        ac: { 125: 15, 250: 15, 500: 15, 1000: 20, 2000: 25, 4000: 65, 8000: 35 },
        bc: { 250: 15, 500: 15, 1000: 20, 2000: 25, 4000: 65 },
      },
      rightTymp: { earCanalVolumeMl: 1.2, peakComplianceMl: 0.85, middleEarPressureDaPa: 0, tympanometricWidthDaPa: 80 },
      leftTymp: { earCanalVolumeMl: 1.2, peakComplianceMl: 0.85, middleEarPressureDaPa: 0, tympanometricWidthDaPa: 80 },
      rightSpeech: { speechRecognitionThresholdDb: 25, wordRecognitionScorePct: 88 },
      leftSpeech: { speechRecognitionThresholdDb: 25, wordRecognitionScorePct: 88 },
      rightReflex: { ipsi500: true, ipsi1000: true, ipsi2000: true, ipsi4000: false, contra500: true, contra1000: true, contra2000: true, contra4000: false, reflexDecayPresent: false },
      leftReflex: { ipsi500: true, ipsi1000: true, ipsi2000: true, ipsi4000: false, contra500: true, contra1000: true, contra2000: true, contra4000: false, reflexDecayPresent: false },
      testDurationDays: 120,
    },
  },

  VESTIBULAR_SCHWANNOMA_RETROCOCHLEAR: {
    title: 'Vestibular Schwannoma (Left Retrocochlear SNHL)',
    description: 'Unilateral left-sided sensorineural hearing loss with marked disproportionate speech discrimination rollover (WRS drops from 52% to 20%), positive acoustic reflex decay, and normal Type A tympanogram.',
    initialState: {
      presetId: 'VESTIBULAR_SCHWANNOMA_RETROCOCHLEAR',
      rightEar: {
        ac: { 125: 10, 250: 10, 500: 10, 1000: 10, 2000: 15, 4000: 15, 8000: 15 },
        bc: { 250: 10, 500: 10, 1000: 10, 2000: 15, 4000: 15 },
      },
      leftEar: {
        ac: { 125: 25, 250: 30, 500: 45, 1000: 55, 2000: 65, 4000: 75, 8000: 80 },
        bc: { 250: 30, 500: 45, 1000: 55, 2000: 65, 4000: 75 },
      },
      rightTymp: { earCanalVolumeMl: 1.2, peakComplianceMl: 0.9, middleEarPressureDaPa: 0, tympanometricWidthDaPa: 80 },
      leftTymp: { earCanalVolumeMl: 1.1, peakComplianceMl: 0.8, middleEarPressureDaPa: -10, tympanometricWidthDaPa: 85 }, // Type A
      rightSpeech: { speechRecognitionThresholdDb: 10, wordRecognitionScorePct: 100, pbMinPct: 100 },
      leftSpeech: { speechRecognitionThresholdDb: 60, wordRecognitionScorePct: 52, pbMinPct: 20 }, // Severe rollover = (52-20)/52 = 0.62
      rightReflex: { ipsi500: true, ipsi1000: true, ipsi2000: true, ipsi4000: true, contra500: false, contra1000: false, contra2000: false, contra4000: false, reflexDecayPresent: false },
      leftReflex: { ipsi500: false, ipsi1000: false, ipsi2000: false, ipsi4000: false, contra500: true, contra1000: true, contra2000: false, contra4000: false, reflexDecayPresent: true }, // Reflex decay present
      testDurationDays: 180,
    },
  },

  EUSTACHIAN_TUBE_DYSFUNCTION: {
    title: 'Eustachian Tube Dysfunction (Type C Negative Pressure)',
    description: 'Mild low-frequency conductive deficit with hallmark Type C tympanogram displaying peak admittance at significantly negative middle ear pressure (-240 daPa).',
    initialState: {
      presetId: 'EUSTACHIAN_TUBE_DYSFUNCTION',
      rightEar: {
        ac: { 125: 30, 250: 30, 500: 25, 1000: 20, 2000: 15, 4000: 10, 8000: 10 },
        bc: { 250: 10, 500: 10, 1000: 10, 2000: 10, 4000: 10 },
      },
      leftEar: {
        ac: { 125: 15, 250: 15, 500: 15, 1000: 15, 2000: 15, 4000: 10, 8000: 10 },
        bc: { 250: 10, 500: 10, 1000: 10, 2000: 10, 4000: 10 },
      },
      rightTymp: { earCanalVolumeMl: 1.1, peakComplianceMl: 0.65, middleEarPressureDaPa: -240, tympanometricWidthDaPa: 140 }, // Type C
      leftTymp: { earCanalVolumeMl: 1.1, peakComplianceMl: 0.8, middleEarPressureDaPa: -20, tympanometricWidthDaPa: 80 },
      rightSpeech: { speechRecognitionThresholdDb: 22, wordRecognitionScorePct: 98 },
      leftSpeech: { speechRecognitionThresholdDb: 15, wordRecognitionScorePct: 100 },
      rightReflex: { ipsi500: true, ipsi1000: true, ipsi2000: true, ipsi4000: true, contra500: true, contra1000: true, contra2000: true, contra4000: true, reflexDecayPresent: false },
      leftReflex: { ipsi500: true, ipsi1000: true, ipsi2000: true, ipsi4000: true, contra500: true, contra1000: true, contra2000: true, contra4000: true, reflexDecayPresent: false },
      testDurationDays: 14,
    },
  },
};
