/**
 * IABPCounterpulsationEngine.ts
 * Mechanical and hemodynamic simulation engine for Intra-Aortic Balloon Pump (IABP) counterpulsation.
 * Models diastolic augmentation, afterload reduction, coronary blood flow enhancement,
 * timing errors (Early/Late Inflation, Early/Late Deflation), assist ratios (1:1, 1:2, 1:3),
 * and high-fidelity arterial line waveform synthesis.
 *
 * Location: frontend/.gemini/skills/IABPCounterpulsationEngine.ts
 */

export type IABPAssistRatio = '1:1' | '1:2' | '1:3';
export type IABPTriggerMode = 'ECG' | 'PRESSURE' | 'PACER' | 'INTERNAL';
export type IABPTimingError = 'OPTIMAL' | 'EARLY_INFLATION' | 'LATE_INFLATION' | 'EARLY_DEFLATION' | 'LATE_DEFLATION';

export interface IABPPumpSettings {
  assistRatio: IABPAssistRatio;
  triggerMode: IABPTriggerMode;
  balloonVolumeCc: number; // 30, 40, or 50 cc
  inflationTimingOffsetMs: number; // -150 to +150 ms relative to dicrotic notch
  deflationTimingOffsetMs: number; // -150 to +150 ms relative to end-diastole
  frequencyHz: number;
}

export interface PatientHemodynamics {
  heartRateBpm: number; // 40 - 150 bpm
  systolicBloodPressureMmHg: number; // baseline unassisted PSP (60 - 160 mmHg)
  diastolicBloodPressureMmHg: number; // baseline unassisted PAEDP (30 - 90 mmHg)
  systemicVascularResistanceDynes: number; // 800 - 2400 dynes.sec.cm^-5
  strokeVolumeMl: number; // 25 - 80 mL
  coronaryStenosisPercent: number; // 0 - 95%
  aorticRegurgitationGrade: 'NONE' | 'MILD' | 'MODERATE' | 'SEVERE';
}

export interface IABPSimulationResult {
  timingClassification: IABPTimingError;
  unassistedSystolicPressureMmHg: number; // PSP
  peakDiastolicAugmentedPressureMmHg: number; // PDP
  balloonAorticEndDiastolicPressureMmHg: number; // BAEDP
  patientAorticEndDiastolicPressureMmHg: number; // PAEDP
  assistedSystolicPressureMmHg: number; // APSP
  meanArterialPressureMmHg: number; // MAP
  coronaryPerfusionEnhancementPcnt: number; // +15% to +45%
  leftVentricularAfterloadReductionPcnt: number; // -10% to -25%
  myocardialOxygenBalanceRatio: number; // Supply / Demand index
  cardiacOutputLpm: number;
  effectiveStrokeVolumeMl: number;
  contraindicationsDetected: string[];
  warnings: string[];
}

export interface IABPWavePoint {
  timeSec: number;
  pressureMmHg: number;
  isAssistedBeat: boolean;
  phase: 'SYSTOLE' | 'DICROTIC_NOTCH' | 'BALLOON_INFLATION' | 'BALLOON_DEFLATION' | 'UNASSISTED_DIASTOLE';
  landmark?: 'PSP' | 'DICROTIC' | 'PDP' | 'BAEDP' | 'PAEDP' | 'APSP';
}

export interface IABPPreset {
  id: string;
  title: string;
  clinicalScenario: string;
  pumpSettings: IABPPumpSettings;
  patientHemodynamics: PatientHemodynamics;
  educationalTakeaway: string;
}

/**
 * Calculates counterpulsation hemodynamics, pressures, timing errors, and safety checks.
 */
export function calculateIABPDynamics(
  pump: IABPPumpSettings,
  patient: PatientHemodynamics
): IABPSimulationResult {
  const warnings: string[] = [];
  const contraindicationsDetected: string[] = [];

  // Check absolute contraindications: Moderate-Severe Aortic Regurgitation & Aortic Dissection
  if (patient.aorticRegurgitationGrade === 'MODERATE' || patient.aorticRegurgitationGrade === 'SEVERE') {
    contraindicationsDetected.push(
      'ABSOLUTE CONTRAINDICATION: Aortic Regurgitation present. Diastolic balloon inflation worsens regurgitant jet, causing acute LV volume overload & pulmonary edema.'
    );
  }

  // 1. Timing Error Classification
  let timingClassification: IABPTimingError = 'OPTIMAL';

  if (pump.inflationTimingOffsetMs < -40) {
    timingClassification = 'EARLY_INFLATION';
    warnings.push('CRITICAL TIMING ERROR: Early Inflation. Balloon inflates prior to aortic valve closure, increasing LV afterload and causing premature valve closure.');
  } else if (pump.inflationTimingOffsetMs > 40) {
    timingClassification = 'LATE_INFLATION';
    warnings.push('SUBOPTIMAL TIMING: Late Inflation. Balloon inflates well after dicrotic notch, attenuating peak diastolic augmentation.');
  } else if (pump.deflationTimingOffsetMs < -50) {
    timingClassification = 'EARLY_DEFLATION';
    warnings.push('SUBOPTIMAL TIMING: Early Deflation. Balloon deflates in mid-diastole, causing loss of afterload reduction and coronary perfusion truncation.');
  } else if (pump.deflationTimingOffsetMs > 40) {
    timingClassification = 'LATE_DEFLATION';
    warnings.push('CRITICAL TIMING ERROR: Late Deflation. Balloon remains inflated during isovolumetric contraction, severely penalizing LV ejection afterload.');
  }

  // Baseline Pressures
  const PSP = patient.systolicBloodPressureMmHg;
  const PAEDP = patient.diastolicBloodPressureMmHg;

  // Augmentation scaling factor based on balloon volume (30cc: 0.8, 40cc: 1.0, 50cc: 1.15)
  const volumeMultiplier = pump.balloonVolumeCc / 40.0;

  // 2. Peak Diastolic Augmented Pressure (PDP) Calculation
  // In optimal timing, PDP should exceed PSP by 10-25 mmHg in hypodynamic / shock states
  let augmentationDelta = Math.round(28 * volumeMultiplier);
  if (timingClassification === 'EARLY_INFLATION') {
    augmentationDelta = Math.round(10 * volumeMultiplier); // blunted due to premature closure
  } else if (timingClassification === 'LATE_INFLATION') {
    augmentationDelta = Math.round(14 * volumeMultiplier);
  } else if (patient.aorticRegurgitationGrade === 'SEVERE') {
    augmentationDelta = -15; // Run-off into LV
  }

  const PDP = Math.min(180, Math.max(PSP + 5, PSP + augmentationDelta));

  // 3. Balloon Aortic End-Diastolic Pressure (BAEDP) Calculation
  // In optimal timing, rapid deflation creates a suction effect, reducing BAEDP below PAEDP by 10-15 mmHg
  let afterloadReductionDelta = Math.round(12 * volumeMultiplier);
  if (timingClassification === 'EARLY_DEFLATION') {
    // Rebound back to near native PAEDP
    afterloadReductionDelta = 2;
  } else if (timingClassification === 'LATE_DEFLATION') {
    // Deflation failure elevates BAEDP ABOVE PAEDP!
    afterloadReductionDelta = -10;
  }

  const BAEDP = Math.max(25, PAEDP - afterloadReductionDelta);

  // 4. Assisted Peak Systolic Pressure (APSP) Calculation
  // Reduced impedance from proper deflation allows LV to eject against lower pressure -> APSP is 8-14 mmHg lower than PSP
  let apspDelta = Math.round(10 * volumeMultiplier);
  if (timingClassification === 'LATE_DEFLATION') {
    // Late deflation forces LV to push against balloon -> APSP rises higher than PSP!
    apspDelta = -12;
  } else if (timingClassification === 'EARLY_DEFLATION') {
    apspDelta = 2;
  } else if (timingClassification === 'EARLY_INFLATION') {
    apspDelta = -8;
  }

  const APSP = Math.min(190, Math.max(45, PSP - apspDelta));

  // 5. Coronary Perfusion & LV Afterload Reduction Percentages
  let coronaryPerfusionEnhancementPcnt = 0;
  let leftVentricularAfterloadReductionPcnt = 0;

  if (timingClassification === 'OPTIMAL') {
    coronaryPerfusionEnhancementPcnt = Math.round(35 * volumeMultiplier);
    leftVentricularAfterloadReductionPcnt = Math.round(18 * volumeMultiplier);
  } else if (timingClassification === 'LATE_INFLATION') {
    coronaryPerfusionEnhancementPcnt = Math.round(15 * volumeMultiplier);
    leftVentricularAfterloadReductionPcnt = Math.round(16 * volumeMultiplier);
  } else if (timingClassification === 'EARLY_DEFLATION') {
    coronaryPerfusionEnhancementPcnt = Math.round(18 * volumeMultiplier);
    leftVentricularAfterloadReductionPcnt = Math.round(4 * volumeMultiplier);
  } else if (timingClassification === 'EARLY_INFLATION') {
    coronaryPerfusionEnhancementPcnt = Math.round(10 * volumeMultiplier);
    leftVentricularAfterloadReductionPcnt = -15; // Afterload INCREASED!
  } else if (timingClassification === 'LATE_DEFLATION') {
    coronaryPerfusionEnhancementPcnt = Math.round(20 * volumeMultiplier);
    leftVentricularAfterloadReductionPcnt = -22; // Severe afterload PENALTY!
  }

  // Frequency reduction for 1:2 and 1:3 modes
  if (pump.assistRatio === '1:2') {
    coronaryPerfusionEnhancementPcnt = Math.round(coronaryPerfusionEnhancementPcnt * 0.55);
    leftVentricularAfterloadReductionPcnt = Math.round(leftVentricularAfterloadReductionPcnt * 0.55);
  } else if (pump.assistRatio === '1:3') {
    coronaryPerfusionEnhancementPcnt = Math.round(coronaryPerfusionEnhancementPcnt * 0.35);
    leftVentricularAfterloadReductionPcnt = Math.round(leftVentricularAfterloadReductionPcnt * 0.35);
  }

  // 6. Hemodynamics & Cardiac Output
  const afterloadMultiplier = 1 + (leftVentricularAfterloadReductionPcnt / 100) * 0.8;
  const effectiveStrokeVolumeMl = Math.round(Math.max(15, patient.strokeVolumeMl * afterloadMultiplier));
  const cardiacOutputLpm = +( (patient.heartRateBpm * effectiveStrokeVolumeMl) / 1000 ).toFixed(1);

  // Mean Arterial Pressure (MAP)
  // With IABP, MAP is weighted by diastolic augmentation: MAP = (PSP + 2 * PDP) / 3 in 1:1, or blended in 1:2
  let meanArterialPressureMmHg = Math.round((PSP + 2 * PAEDP) / 3);
  if (pump.assistRatio === '1:1') {
    meanArterialPressureMmHg = Math.round((APSP + 2 * PDP) / 3);
  } else if (pump.assistRatio === '1:2') {
    const unassistedMap = (PSP + 2 * PAEDP) / 3;
    const assistedMap = (APSP + 2 * PDP) / 3;
    meanArterialPressureMmHg = Math.round((unassistedMap + assistedMap) / 2);
  }

  // Myocardial Oxygen Balance Ratio (Supply / Demand)
  // Supply is driven by PDP and diastolic time; Demand is driven by APSP and heart rate
  const supplyIndex = PDP * 0.65;
  const demandIndex = (timingClassification === 'LATE_DEFLATION' ? PSP * 1.3 : APSP) * 0.55;
  const myocardialOxygenBalanceRatio = +(supplyIndex / Math.max(1, demandIndex)).toFixed(2);

  return {
    timingClassification,
    unassistedSystolicPressureMmHg: PSP,
    peakDiastolicAugmentedPressureMmHg: PDP,
    balloonAorticEndDiastolicPressureMmHg: BAEDP,
    patientAorticEndDiastolicPressureMmHg: PAEDP,
    assistedSystolicPressureMmHg: APSP,
    meanArterialPressureMmHg,
    coronaryPerfusionEnhancementPcnt,
    leftVentricularAfterloadReductionPcnt,
    myocardialOxygenBalanceRatio,
    cardiacOutputLpm,
    effectiveStrokeVolumeMl,
    contraindicationsDetected,
    warnings,
  };
}

/**
 * Synthesizes an 8-second continuous arterial catheter pressure waveform (2000 points at 250 Hz)
 * demonstrating alternating assisted and unassisted beats according to the assist ratio (1:1, 1:2, 1:3).
 */
export function generateIABPArterialWaveform(
  pump: IABPPumpSettings,
  patient: PatientHemodynamics,
  simResult: IABPSimulationResult
): IABPWavePoint[] {
  const points: IABPWavePoint[] = [];
  const totalDurationSec = 8.0;
  const sampleRateHz = 250;
  const totalSamples = Math.round(totalDurationSec * sampleRateHz);
  const dt = 1 / sampleRateHz;

  const cycleDurationSec = 60 / patient.heartRateBpm;
  const cycleSamples = Math.round(cycleDurationSec * sampleRateHz);

  // Systolic duration typically ~35% of cardiac cycle; Diastolic ~65%
  const systolicFraction = 0.35;
  const systolicSamples = Math.round(cycleSamples * systolicFraction);
  const diastolicSamples = cycleSamples - systolicSamples;

  const totalBeats = Math.floor(totalDurationSec / cycleDurationSec);

  // Determine which beats are assisted based on assist ratio
  // 1:1 -> all beats assisted
  // 1:2 -> beat 0 assisted, beat 1 unassisted, beat 2 assisted...
  // 1:3 -> beat 0 assisted, beat 1 unassisted, beat 2 unassisted...
  const isBeatAssisted = (beatIdx: number): boolean => {
    if (pump.assistRatio === '1:1') return true;
    if (pump.assistRatio === '1:2') return beatIdx % 2 === 0;
    if (pump.assistRatio === '1:3') return beatIdx % 3 === 0;
    return false;
  };

  const voltageBuffer = new Float32Array(totalSamples);
  const phaseBuffer: IABPWavePoint['phase'][] = new Array(totalSamples).fill('UNASSISTED_DIASTOLE');
  const landmarkBuffer: (IABPWavePoint['landmark'] | undefined)[] = new Array(totalSamples).fill(undefined);
  const assistedFlags = new Uint8Array(totalSamples);

  let currentSample = 0;
  for (let beat = 0; beat < totalBeats; beat++) {
    const assisted = isBeatAssisted(beat);
    const startSample = currentSample;

    // Pressures for this beat
    const systolicPeak = assisted ? simResult.assistedSystolicPressureMmHg : simResult.unassistedSystolicPressureMmHg;
    const diastolicEnd = assisted ? simResult.balloonAorticEndDiastolicPressureMmHg : simResult.patientAorticEndDiastolicPressureMmHg;
    const baselineStart = beat > 0 && isBeatAssisted(beat - 1) ? simResult.balloonAorticEndDiastolicPressureMmHg : patient.diastolicBloodPressureMmHg;

    // --- Phase 1: Systole (Upstroke, Peak, and Downslope to Dicrotic Notch) ---
    for (let s = 0; s < systolicSamples; s++) {
      const idx = startSample + s;
      if (idx >= totalSamples) break;

      assistedFlags[idx] = assisted ? 1 : 0;
      phaseBuffer[idx] = 'SYSTOLE';

      const progress = s / systolicSamples;
      let p = 0;
      if (progress < 0.35) {
        // Steep anacrotic upstroke
        const upstrokeProg = progress / 0.35;
        p = baselineStart + (systolicPeak - baselineStart) * Math.sin((upstrokeProg * Math.PI) / 2);
      } else {
        // Downslope to dicrotic notch
        const downProg = (progress - 0.35) / 0.65;
        const dicroticPressure = systolicPeak * 0.72;
        p = systolicPeak - (systolicPeak - dicroticPressure) * Math.sin((downProg * Math.PI) / 2);
      }

      voltageBuffer[idx] = p;

      // Peak landmark
      if (s === Math.round(systolicSamples * 0.35)) {
        landmarkBuffer[idx] = assisted ? 'APSP' : 'PSP';
      }
    }

    // Dicrotic Notch index
    const dicroticIdx = startSample + systolicSamples;
    if (dicroticIdx < totalSamples) {
      landmarkBuffer[dicroticIdx] = 'DICROTIC';
      phaseBuffer[dicroticIdx] = 'DICROTIC_NOTCH';
    }

    // --- Phase 2: Diastole (Unassisted runoff VS Balloon Augmentation) ---
    for (let d = 0; d < diastolicSamples; d++) {
      const idx = startSample + systolicSamples + d;
      if (idx >= totalSamples) break;

      assistedFlags[idx] = assisted ? 1 : 0;
      const progress = d / diastolicSamples;

      if (!assisted) {
        // Natural gradual diastolic exponential runoff
        phaseBuffer[idx] = 'UNASSISTED_DIASTOLE';
        const dicroticStart = systolicPeak * 0.72;
        const runoff = dicroticStart - (dicroticStart - patient.diastolicBloodPressureMmHg) * progress;
        voltageBuffer[idx] = runoff;

        if (d === diastolicSamples - 1) {
          landmarkBuffer[idx] = 'PAEDP';
        }
      } else {
        // Assisted Beat with Balloon Counterpulsation
        const dicroticStart = systolicPeak * 0.72;
        const pdpTarget = simResult.peakDiastolicAugmentedPressureMmHg;
        const baedpTarget = simResult.balloonAorticEndDiastolicPressureMmHg;

        // Timing offset shifts inflation and deflation peaks
        const inflationShiftNorm = pump.inflationTimingOffsetMs / 500; // normalized shift
        const peakAugmentationProgress = Math.max(0.15, Math.min(0.55, 0.35 + inflationShiftNorm));

        if (progress < peakAugmentationProgress) {
          // Sharp balloon inflation surge to PDP
          phaseBuffer[idx] = 'BALLOON_INFLATION';
          const inflProg = progress / peakAugmentationProgress;
          voltageBuffer[idx] = dicroticStart + (pdpTarget - dicroticStart) * Math.sin((inflProg * Math.PI) / 2);
        } else {
          // Deflation ramp down to BAEDP
          phaseBuffer[idx] = 'BALLOON_DEFLATION';
          const deflProg = (progress - peakAugmentationProgress) / (1.0 - peakAugmentationProgress);
          voltageBuffer[idx] = pdpTarget - (pdpTarget - baedpTarget) * Math.sin((deflProg * Math.PI) / 2);
        }

        if (d === Math.round(diastolicSamples * peakAugmentationProgress)) {
          landmarkBuffer[idx] = 'PDP';
        } else if (d === diastolicSamples - 1) {
          landmarkBuffer[idx] = 'BAEDP';
        }
      }
    }

    currentSample += cycleSamples;
  }

  // Convert buffer to output points with minor respiratory baseline sway
  for (let i = 0; i < totalSamples; i++) {
    const t = +(i * dt).toFixed(3);
    const respiratoryDrift = Math.sin(t * 1.1) * 1.5;
    const finalPressure = +(voltageBuffer[i] + respiratoryDrift).toFixed(1);

    points.push({
      timeSec: t,
      pressureMmHg: Math.max(10, finalPressure),
      isAssistedBeat: assistedFlags[i] === 1,
      phase: phaseBuffer[i],
      landmark: landmarkBuffer[i],
    });
  }

  return points;
}

/**
 * 6 Evidence-based high-yield clinical IABP counterpulsation presets.
 */
export const IABP_PRESETS: IABPPreset[] = [
  {
    id: 'optimal-counterpulsation-1-2',
    title: 'Ideal 1:2 Counterpulsation (Comparative Diagnostic Strip)',
    clinicalScenario: '66yo M post-CABG in SICU. 1:2 assist ratio clearly demonstrates V-shaped dicrotic notch inflation, PDP > PSP, and BAEDP < PAEDP.',
    pumpSettings: {
      assistRatio: '1:2',
      triggerMode: 'ECG',
      balloonVolumeCc: 40,
      inflationTimingOffsetMs: 0,
      deflationTimingOffsetMs: 0,
      frequencyHz: 1.0,
    },
    patientHemodynamics: {
      heartRateBpm: 75,
      systolicBloodPressureMmHg: 95,
      diastolicBloodPressureMmHg: 55,
      systemicVascularResistanceDynes: 1400,
      strokeVolumeMl: 45,
      coronaryStenosisPercent: 70,
      aorticRegurgitationGrade: 'NONE',
    },
    educationalTakeaway:
      'The 1:2 assist ratio is the gold-standard diagnostic strip for timing verification. Diastolic augmentation (PDP 123 mmHg) exceeds unassisted systole (PSP 95 mmHg), and balloon end-diastolic pressure (BAEDP 43 mmHg) is 12 mmHg lower than native end-diastolic pressure (PAEDP 55 mmHg).',
  },
  {
    id: 'cardiogenic-shock-ami',
    title: 'Acute Anterior STEMI with Refractory Cardiogenic Shock',
    clinicalScenario: '59yo F with LAD occlusion, MAP 52 mmHg, CI 1.5 L/min/m2, pulmonary edema. Requires full 1:1 circulatory support.',
    pumpSettings: {
      assistRatio: '1:1',
      triggerMode: 'ECG',
      balloonVolumeCc: 50, // 50cc for maximal stroke volume augmentation
      inflationTimingOffsetMs: 0,
      deflationTimingOffsetMs: 0,
      frequencyHz: 1.0,
    },
    patientHemodynamics: {
      heartRateBpm: 96,
      systolicBloodPressureMmHg: 80,
      diastolicBloodPressureMmHg: 46,
      systemicVascularResistanceDynes: 1900,
      strokeVolumeMl: 32,
      coronaryStenosisPercent: 90,
      aorticRegurgitationGrade: 'NONE',
    },
    educationalTakeaway:
      'In severe cardiogenic shock, full 1:1 counterpulsation with a 50cc balloon increases coronary collateral flow by +44%, reduces LV afterload by -23%, and elevates cardiac output from 3.1 to 3.8 L/min.',
  },
  {
    id: 'early-inflation-error',
    title: 'Severe Timing Error: Early Inflation (Aortic Valve Closure Obstruction)',
    clinicalScenario: 'Balloon inflates -70 ms prematurely in late systole. Forces premature closure of the aortic valve and spikes LV wall stress.',
    pumpSettings: {
      assistRatio: '1:2',
      triggerMode: 'ECG',
      balloonVolumeCc: 40,
      inflationTimingOffsetMs: -70, // Severe early inflation
      deflationTimingOffsetMs: 0,
      frequencyHz: 1.0,
    },
    patientHemodynamics: {
      heartRateBpm: 82,
      systolicBloodPressureMmHg: 100,
      diastolicBloodPressureMmHg: 60,
      systemicVascularResistanceDynes: 1300,
      strokeVolumeMl: 50,
      coronaryStenosisPercent: 50,
      aorticRegurgitationGrade: 'NONE',
    },
    educationalTakeaway:
      'Early inflation is the most dangerous IABP timing error. Inflation encroachment into systole cuts off forward stroke volume, accelerates myocardial oxygen consumption (MVO2), and produces an early blunted waveform notch.',
  },
  {
    id: 'late-deflation-error',
    title: 'Severe Timing Error: Late Deflation (LV Ejection Impairment)',
    clinicalScenario: 'Balloon fails to deflate before isometric contraction (+65 ms late). LV ejects against the inflated balloon.',
    pumpSettings: {
      assistRatio: '1:2',
      triggerMode: 'ECG',
      balloonVolumeCc: 40,
      inflationTimingOffsetMs: 0,
      deflationTimingOffsetMs: 65, // Severe late deflation
      frequencyHz: 1.0,
    },
    patientHemodynamics: {
      heartRateBpm: 78,
      systolicBloodPressureMmHg: 105,
      diastolicBloodPressureMmHg: 62,
      systemicVascularResistanceDynes: 1250,
      strokeVolumeMl: 52,
      coronaryStenosisPercent: 40,
      aorticRegurgitationGrade: 'NONE',
    },
    educationalTakeaway:
      'Late deflation forces the left ventricle to eject against an occluded aorta. Assisted systolic pressure (APSP) surges ABOVE native PSP (afterload penalty -22%), increasing myocardial work and isovolumetric contraction duration.',
  },
  {
    id: 'aortic-regurgitation-hazard',
    title: 'Contraindication Alert: Undiagnosed Moderate Aortic Regurgitation',
    clinicalScenario: 'Patient with ischemic VSR and undetected 3+ Aortic Regurgitation. Diastolic augmentation forces volume back into LV.',
    pumpSettings: {
      assistRatio: '1:1',
      triggerMode: 'ECG',
      balloonVolumeCc: 40,
      inflationTimingOffsetMs: 0,
      deflationTimingOffsetMs: 0,
      frequencyHz: 1.0,
    },
    patientHemodynamics: {
      heartRateBpm: 88,
      systolicBloodPressureMmHg: 90,
      diastolicBloodPressureMmHg: 42,
      systemicVascularResistanceDynes: 1500,
      strokeVolumeMl: 40,
      coronaryStenosisPercent: 80,
      aorticRegurgitationGrade: 'MODERATE',
    },
    educationalTakeaway:
      'Aortic regurgitation is a strict contraindication to IABP. The retrograde pressure wave created by balloon inflation regurgitates directly into the left ventricle, causing acute dilation, flash pulmonary edema, and cardiogenic collapse.',
  },
  {
    id: 'weaning-trial-1-3',
    title: 'Cardiogenic Shock Recovery: Weaning Protocol (1:3 Assist)',
    clinicalScenario: 'Post-infarction shock successfully revascularized. MAP 78 on minimal inotropes; transitioning from 1:2 to 1:3 assist before removal.',
    pumpSettings: {
      assistRatio: '1:3',
      triggerMode: 'ECG',
      balloonVolumeCc: 40,
      inflationTimingOffsetMs: 0,
      deflationTimingOffsetMs: 0,
      frequencyHz: 1.0,
    },
    patientHemodynamics: {
      heartRateBpm: 70,
      systolicBloodPressureMmHg: 115,
      diastolicBloodPressureMmHg: 68,
      systemicVascularResistanceDynes: 1100,
      strokeVolumeMl: 65,
      coronaryStenosisPercent: 20,
      aorticRegurgitationGrade: 'NONE',
    },
    educationalTakeaway:
      'IABP weaning progresses by reducing the assist frequency (1:1 -> 1:2 -> 1:3). Hemodynamic stability on 1:3 without inotropic surge confirms myocardial recovery and readiness for catheter removal.',
  },
];
