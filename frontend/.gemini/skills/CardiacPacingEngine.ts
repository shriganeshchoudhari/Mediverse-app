/**
 * CardiacPacingEngine.ts
 * Electrophysiology simulation engine for temporary cardiac pacemakers (transvenous/transcutaneous).
 * Models NASPE/BPEG pacing modes (VVI, VOO, AAI, AOO, DDD, DOO, DDI), pacing and sensing thresholds,
 * capture mechanics, undersensing/oversensing, R-on-T polymorphic VT/VF triggering,
 * AV synchrony / pacemaker syndrome hemodynamics, and real-time ECG waveform synthesis.
 *
 * Location: frontend/.gemini/skills/CardiacPacingEngine.ts
 */

export type PacingMode = 'VVI' | 'VOO' | 'AAI' | 'AOO' | 'DDD' | 'DOO' | 'DDI';

export interface PacingDials {
  mode: PacingMode;
  rateBpm: number; // 30 - 180 bpm
  ventricularOutputMa: number; // 0.1 - 20.0 mA
  ventricularSensitivityMv: number; // 0.5 - 20.0 mV (higher number = less sensitive!)
  atrialOutputMa: number; // 0.1 - 20.0 mA
  atrialSensitivityMv: number; // 0.2 - 10.0 mV
  avDelayMs: number; // 50 - 300 ms
}

export interface IntrinsicCardiacState {
  intrinsicAtrialRateBpm: number; // 0 (arrest) to 150 bpm
  intrinsicVentricularRateBpm: number; // 0 (asystole) to 120 bpm
  hasAvDissociation: boolean; // 3rd degree block
  intrinsicRWaveAmplitudeMv: number; // typical 4.0 - 15.0 mV
  intrinsicPWaveAmplitudeMv: number; // typical 1.0 - 4.0 mV
  stimulationThresholdMa: number; // typical 0.6 - 1.5 mA
  atrialStimulationThresholdMa: number; // typical 0.8 - 2.0 mA
  baselineQtIntervalMs: number; // typical 380 - 580 ms
  leadDisplaced: boolean;
  ambientElectromagneticNoiseMv: number; // EMI noise level (e.g., electrocautery)
}

export type CaptureStatus = 'FULL_CAPTURE' | 'INTERMITTENT_CAPTURE' | 'LOSS_OF_CAPTURE';
export type SensingStatus = 'NORMAL_SENSING' | 'UNDERSENSING' | 'OVERSENSING';
export type ArrhythmiaTrigger = 'NONE' | 'R_ON_T_VENTRICULAR_FIBRILLATION' | 'ASYSTOLIC_PAUSE' | 'VENTRICULAR_STANDSTILL';

export interface PacingSimulationResult {
  captureStatus: CaptureStatus;
  sensingStatus: SensingStatus;
  isCapturingVentricular: boolean;
  isCapturingAtrial: boolean;
  effectiveHeartRateBpm: number;
  safetyMarginMultiplier: number; // ventricularOutputMa / stimulationThresholdMa
  safetyMarginStatus: 'SUBOPTIMAL' | 'ADEQUATE' | 'HIGH';
  arrhythmiaTrigger: ArrhythmiaTrigger;
  isROnTRisk: boolean;
  pacemakerSyndromeActive: boolean;
  cardiacOutputLpm: number;
  strokeVolumeMl: number;
  meanArterialPressureMmHg: number;
  cannonAWavesPresent: boolean;
  atrialPacingPcnt: number;
  ventricularPacingPcnt: number;
  sensedBeatsPcnt: number;
  warnings: string[];
}

export interface ECGWavePoint {
  timeSec: number;
  millivolts: number;
  isPacingSpike: boolean;
  beatType: 'PACED_VENTRICULAR' | 'PACED_ATRIAL' | 'INTRINSIC' | 'FUSION' | 'VF_POLYMORPHIC' | 'NONE';
  annotation?: string;
}

export interface PacingPreset {
  id: string;
  title: string;
  patientProfile: string;
  dials: PacingDials;
  intrinsicState: IntrinsicCardiacState;
  clinicalExplanation: string;
}

/**
 * Computes pacemaker capture, sensing, hemodynamic performance, and safety metrics.
 */
export function calculateCardiacPacingDynamics(
  dials: PacingDials,
  intrinsic: IntrinsicCardiacState
): PacingSimulationResult {
  const warnings: string[] = [];

  // Effective stimulation threshold (rises sharply if lead is displaced or exit block occurs)
  const effectiveVThresholdMa = intrinsic.leadDisplaced
    ? intrinsic.stimulationThresholdMa * 3.5
    : intrinsic.stimulationThresholdMa;

  const effectiveAThresholdMa = intrinsic.leadDisplaced
    ? intrinsic.atrialStimulationThresholdMa * 3.0
    : intrinsic.atrialStimulationThresholdMa;

  // 1. Capture Assessment
  const isChamberVVentricularPaced = dials.mode.startsWith('V') || dials.mode.startsWith('D');
  const isChamberAAtrialPaced = dials.mode.startsWith('A') || dials.mode.startsWith('D');

  let isCapturingVentricular = false;
  if (isChamberVVentricularPaced) {
    if (dials.ventricularOutputMa >= effectiveVThresholdMa) {
      isCapturingVentricular = true;
    }
  }

  let isCapturingAtrial = false;
  if (isChamberAAtrialPaced) {
    if (dials.atrialOutputMa >= effectiveAThresholdMa) {
      isCapturingAtrial = true;
    }
  }

  // Safety Margin (standard recommendation: output current 2x - 3x capture threshold)
  const safetyMarginMultiplier = +(dials.ventricularOutputMa / Math.max(0.1, effectiveVThresholdMa)).toFixed(1);
  let safetyMarginStatus: 'SUBOPTIMAL' | 'ADEQUATE' | 'HIGH' = 'ADEQUATE';
  if (safetyMarginMultiplier < 2.0) {
    safetyMarginStatus = 'SUBOPTIMAL';
    if (safetyMarginMultiplier < 1.0) {
      warnings.push('CRITICAL: Ventricular output current is below capture threshold (Failure to Capture).');
    } else {
      warnings.push('WARNING: Ventricular safety margin is < 2.0x threshold. Risk of intermittent capture.');
    }
  } else if (safetyMarginMultiplier > 4.5) {
    safetyMarginStatus = 'HIGH';
  }

  let captureStatus: CaptureStatus = 'FULL_CAPTURE';
  if (!isCapturingVentricular && isChamberVVentricularPaced) {
    captureStatus = 'LOSS_OF_CAPTURE';
  } else if (safetyMarginMultiplier < 1.3 && isChamberVVentricularPaced) {
    captureStatus = 'INTERMITTENT_CAPTURE';
  }

  // 2. Sensing Assessment
  // In pacing terminology, sensitivity dial (mV) is the threshold: signals GREATER than the dial are sensed.
  // Lower mV value = MORE sensitive (senses smaller voltages).
  // Higher mV value = LESS sensitive (requires huge R-wave to be sensed).
  const isChamberVSensing = dials.mode[1] === 'V' || dials.mode[1] === 'D';
  let sensingStatus: SensingStatus = 'NORMAL_SENSING';
  let isROnTRisk = false;

  if (isChamberVSensing) {
    if (dials.ventricularSensitivityMv > intrinsic.intrinsicRWaveAmplitudeMv) {
      // Dial is set too high (e.g. 15 mV) compared to native R-wave (e.g. 6 mV). Pacemaker cannot see native R-waves!
      sensingStatus = 'UNDERSENSING';
      warnings.push('CRITICAL: Undersensing active. Pacemaker sensitivity dial exceeds native R-wave amplitude.');
      // Undersensing causes asynchronous pacing, risking R-on-T phenomenon!
      if (dials.rateBpm >= 60 && intrinsic.intrinsicVentricularRateBpm >= 40) {
        isROnTRisk = true;
        warnings.push('LETHAL WARNING: Pacing spike timing coincides with vulnerable T-wave window (R-on-T trigger).');
      }
    } else if (dials.ventricularSensitivityMv < 1.2 || dials.ventricularSensitivityMv < intrinsic.ambientElectromagneticNoiseMv) {
      // Dial is set too low (e.g., 0.5 mV) and picks up noise or P/T-waves as fake R-waves, inappropriately inhibiting pacing!
      sensingStatus = 'OVERSENSING';
      warnings.push('CRITICAL: Oversensing active. Dial detects low-voltage myopotentials/EMI, causing inappropriate pacing inhibition.');
    }
  }

  // Asynchronous modes (VOO, AOO, DOO) intentionally do not sense
  if (dials.mode.endsWith('OO') || dials.mode === 'VOO' || dials.mode === 'AOO' || dials.mode === 'DOO') {
    if (intrinsic.intrinsicVentricularRateBpm > 30) {
      isROnTRisk = true;
      warnings.push('CAUTION: Asynchronous mode active in patient with native rhythm. High risk of competitive pacing & R-on-T.');
    }
  }

  // 3. Arrhythmia & Emergency Trigger Determination
  let arrhythmiaTrigger: ArrhythmiaTrigger = 'NONE';
  if (isROnTRisk && (dials.ventricularOutputMa >= effectiveVThresholdMa || dials.mode.includes('OO'))) {
    arrhythmiaTrigger = 'R_ON_T_VENTRICULAR_FIBRILLATION';
  } else if (sensingStatus === 'OVERSENSING' && intrinsic.intrinsicVentricularRateBpm < 30) {
    arrhythmiaTrigger = 'ASYSTOLIC_PAUSE';
  } else if (captureStatus === 'LOSS_OF_CAPTURE' && intrinsic.intrinsicVentricularRateBpm < 25) {
    arrhythmiaTrigger = 'VENTRICULAR_STANDSTILL';
  }

  // 4. Effective Heart Rate
  let effectiveHeartRateBpm = intrinsic.intrinsicVentricularRateBpm;
  if (arrhythmiaTrigger === 'R_ON_T_VENTRICULAR_FIBRILLATION') {
    effectiveHeartRateBpm = 280; // chaotic VF
  } else if (arrhythmiaTrigger === 'ASYSTOLIC_PAUSE' || arrhythmiaTrigger === 'VENTRICULAR_STANDSTILL') {
    effectiveHeartRateBpm = 0;
  } else if (isCapturingVentricular) {
    effectiveHeartRateBpm = Math.max(dials.rateBpm, intrinsic.intrinsicVentricularRateBpm);
  }

  // 5. Percentages of Paced vs Sensed Beats
  let ventricularPacingPcnt = 0;
  let atrialPacingPcnt = 0;
  let sensedBeatsPcnt = 0;

  if (effectiveHeartRateBpm > 0 && arrhythmiaTrigger === 'NONE') {
    if (dials.rateBpm > intrinsic.intrinsicVentricularRateBpm && isCapturingVentricular) {
      ventricularPacingPcnt = 100;
      sensedBeatsPcnt = 0;
    } else if (intrinsic.intrinsicVentricularRateBpm >= dials.rateBpm) {
      ventricularPacingPcnt = 0;
      sensedBeatsPcnt = 100;
    } else {
      ventricularPacingPcnt = 50;
      sensedBeatsPcnt = 50;
    }

    if (dials.mode.startsWith('D') || dials.mode.startsWith('A')) {
      if (dials.rateBpm > intrinsic.intrinsicAtrialRateBpm && isCapturingAtrial) {
        atrialPacingPcnt = 100;
      }
    }
  }

  // 6. Hemodynamics & Pacemaker Syndrome Assessment
  // Pacemaker Syndrome occurs when VVI pacing disrupts AV synchrony (loss of 20-30% atrial kick contribution)
  // or triggers retrograde ventriculoatrial (VA) conduction against closed AV valves -> cannon A waves.
  const isVviWithoutAtrialSync = (dials.mode === 'VVI' || dials.mode === 'VOO') && ventricularPacingPcnt > 50;
  const pacemakerSyndromeActive = isVviWithoutAtrialSync && intrinsic.hasAvDissociation;
  const cannonAWavesPresent = pacemakerSyndromeActive;

  if (pacemakerSyndromeActive) {
    warnings.push('PACEMAKER SYNDROME: Unsynchronized ventricular pacing causes loss of atrial kick and cannon A-waves in jugular venous pulse.');
  }

  // Baseline normal stroke volume ~75 mL, reduced by 25% if AV synchrony lost, or down to 0 in VF/asystole
  let strokeVolumeMl = 75;
  if (arrhythmiaTrigger === 'R_ON_T_VENTRICULAR_FIBRILLATION' || arrhythmiaTrigger === 'ASYSTOLIC_PAUSE') {
    strokeVolumeMl = 0;
  } else if (pacemakerSyndromeActive) {
    strokeVolumeMl = 55; // 25-30% drop due to loss of atrial priming
  } else if (!isCapturingVentricular && intrinsic.intrinsicVentricularRateBpm < 40) {
    strokeVolumeMl = 85; // Compensatory high SV during extreme bradycardia
  }

  const cardiacOutputLpm = +( (effectiveHeartRateBpm * strokeVolumeMl) / 1000 ).toFixed(1);

  // Mean Arterial Pressure (MAP) estimation: MAP ~ CO * SVR / 80 (assuming baseline SVR ~1100 dynes)
  let meanArterialPressureMmHg = 0;
  if (cardiacOutputLpm > 0) {
    meanArterialPressureMmHg = Math.round(Math.min(130, Math.max(30, 20 + cardiacOutputLpm * 13.5)));
  } else {
    meanArterialPressureMmHg = 12; // circulatory arrest
  }

  return {
    captureStatus,
    sensingStatus,
    isCapturingVentricular,
    isCapturingAtrial,
    effectiveHeartRateBpm,
    safetyMarginMultiplier,
    safetyMarginStatus,
    arrhythmiaTrigger,
    isROnTRisk,
    pacemakerSyndromeActive,
    cardiacOutputLpm,
    strokeVolumeMl,
    meanArterialPressureMmHg,
    cannonAWavesPresent,
    atrialPacingPcnt,
    ventricularPacingPcnt,
    sensedBeatsPcnt,
    warnings,
  };
}

/**
 * Synthesizes a realistic 6-second pacing telemetry strip (1500 points at 250 Hz)
 * demonstrating pacing spikes, wide LBBB paced QRS, native beats, fusion, or VF.
 */
export function generatePacingECGStrip(
  dials: PacingDials,
  intrinsic: IntrinsicCardiacState,
  simResult: PacingSimulationResult
): ECGWavePoint[] {
  const points: ECGWavePoint[] = [];
  const totalDurationSec = 6.0;
  const sampleRateHz = 250;
  const totalSamples = Math.round(totalDurationSec * sampleRateHz);
  const dt = 1 / sampleRateHz;

  // In VF: synthesize chaotic fibrillatory waves
  if (simResult.arrhythmiaTrigger === 'R_ON_T_VENTRICULAR_FIBRILLATION') {
    for (let i = 0; i < totalSamples; i++) {
      const t = +(i * dt).toFixed(3);
      // Sum of non-harmonic sines producing chaotic polymorphic VT / VF
      const wave =
        Math.sin(t * 32.0) * 0.7 +
        Math.sin(t * 47.0 + 1.2) * 0.5 +
        Math.sin(t * 19.5 + 2.5) * 0.4 +
        (Math.random() - 0.5) * 0.15;

      points.push({
        timeSec: t,
        millivolts: +wave.toFixed(3),
        isPacingSpike: i % 180 === 0, // Inappropriate spikes firing during VF
        beatType: 'VF_POLYMORPHIC',
        annotation: i === 120 ? 'R-on-T Induced VF' : undefined,
      });
    }
    return points;
  }

  // In Asystole: synthesize flat baseline with occasional futile pacing spikes
  if (simResult.arrhythmiaTrigger === 'ASYSTOLIC_PAUSE' || simResult.arrhythmiaTrigger === 'VENTRICULAR_STANDSTILL') {
    for (let i = 0; i < totalSamples; i++) {
      const t = +(i * dt).toFixed(3);
      const isSpike = simResult.arrhythmiaTrigger === 'VENTRICULAR_STANDSTILL' && i % Math.round(sampleRateHz * (60 / dials.rateBpm)) === 0;
      const spikeVoltage = isSpike ? 1.8 : 0;
      const baselineDrift = Math.sin(t * 0.5) * 0.03 + (Math.random() - 0.5) * 0.02;

      points.push({
        timeSec: t,
        millivolts: +(baselineDrift + spikeVoltage).toFixed(3),
        isPacingSpike: isSpike,
        beatType: 'NONE',
        annotation: isSpike ? 'Uncaptured Spike' : undefined,
      });
    }
    return points;
  }

  // Normal pacing / intrinsic cycle synthesis
  const pacingIntervalSec = 60 / dials.rateBpm;
  const intrinsicIntervalSec = intrinsic.intrinsicVentricularRateBpm > 0 ? 60 / intrinsic.intrinsicVentricularRateBpm : 999;

  // Build beat timeline
  interface BeatEvent {
    timeSec: number;
    isPaced: boolean;
    isAtrialPaced: boolean;
    isCaptured: boolean;
  }
  const beatEvents: BeatEvent[] = [];

  let currentTime = 0.2;
  while (currentTime < totalDurationSec - 0.2) {
    const isPacerDominant = dials.rateBpm >= intrinsic.intrinsicVentricularRateBpm;
    const isPaced = isPacerDominant;
    const interval = isPaced ? pacingIntervalSec : intrinsicIntervalSec;

    beatEvents.push({
      timeSec: +currentTime.toFixed(3),
      isPaced,
      isAtrialPaced: (dials.mode.startsWith('D') || dials.mode.startsWith('A')) && isPaced,
      isCaptured: simResult.isCapturingVentricular,
    });

    currentTime += interval;
  }

  // Pre-initialize buffer
  const voltageBuffer = new Float32Array(totalSamples);
  const spikeFlags = new Uint8Array(totalSamples);
  const beatTypes: BeatEvent['isPaced'][] = new Array(totalSamples).fill(false);

  // Render each beat into the buffer
  for (const beat of beatEvents) {
    const beatSampleIdx = Math.round(beat.timeSec * sampleRateHz);

    // If atrial paced: add small atrial spike & P wave
    if (beat.isAtrialPaced && (dials.mode.startsWith('D') || dials.mode.startsWith('A'))) {
      const atrialSpikeIdx = Math.max(0, beatSampleIdx - Math.round(dials.avDelayMs * 0.001 * sampleRateHz));
      if (atrialSpikeIdx < totalSamples) {
        voltageBuffer[atrialSpikeIdx] += 1.2;
        spikeFlags[atrialSpikeIdx] = 1;
        // P-wave following spike
        for (let j = 0; j < 25; j++) {
          const idx = atrialSpikeIdx + 5 + j;
          if (idx < totalSamples) {
            voltageBuffer[idx] += 0.2 * Math.sin((j / 25) * Math.PI);
          }
        }
      }
    } else if (!beat.isPaced) {
      // Intrinsic P-wave
      const pStartIdx = beatSampleIdx - Math.round(0.16 * sampleRateHz);
      for (let j = 0; j < 25; j++) {
        const idx = pStartIdx + j;
        if (idx >= 0 && idx < totalSamples) {
          voltageBuffer[idx] += 0.18 * Math.sin((j / 25) * Math.PI);
        }
      }
    }

    // Ventricular Spike & QRS
    if (beat.isPaced) {
      // Pacing spike
      if (beatSampleIdx < totalSamples) {
        voltageBuffer[beatSampleIdx] += 2.2;
        spikeFlags[beatSampleIdx] = 1;
      }

      if (beat.isCaptured) {
        // Captured wide LBBB QRS (duration ~160 ms = 40 samples at 250 Hz)
        const qrsWidthSamples = 40;
        for (let j = 0; j < qrsWidthSamples; j++) {
          const idx = beatSampleIdx + 2 + j;
          if (idx < totalSamples) {
            const phase = j / qrsWidthSamples;
            // Negative QS / deep S wave of RV apical pacing with tall T-wave discordance
            let val = 0;
            if (phase < 0.2) val = 0.3 * (phase / 0.2); // small initial r
            else if (phase < 0.6) val = -1.3 * Math.sin(((phase - 0.2) / 0.4) * Math.PI); // deep broad S
            else val = 0.45 * Math.sin(((phase - 0.6) / 0.4) * Math.PI); // discordant upright T
            voltageBuffer[idx] += val;
          }
        }
      }
    } else {
      // Intrinsic narrow normal QRS (duration ~80 ms = 20 samples)
      const qrsWidthSamples = 20;
      for (let j = 0; j < qrsWidthSamples; j++) {
        const idx = beatSampleIdx + j;
        if (idx < totalSamples) {
          const phase = j / qrsWidthSamples;
          let val = 0;
          if (phase < 0.2) val = -0.15; // Q
          else if (phase < 0.6) val = 1.4 * Math.sin(((phase - 0.2) / 0.4) * Math.PI); // sharp R
          else if (phase < 0.8) val = -0.3; // S
          else val = 0.25 * Math.sin(((phase - 0.8) / 0.2) * Math.PI); // T wave
          voltageBuffer[idx] += val;
        }
      }
    }
  }

  // Populate output points
  for (let i = 0; i < totalSamples; i++) {
    const t = +(i * dt).toFixed(3);
    const v = +(voltageBuffer[i] + (Math.random() - 0.5) * 0.02).toFixed(3);
    const isSpike = spikeFlags[i] === 1;

    points.push({
      timeSec: t,
      millivolts: v,
      isPacingSpike: isSpike,
      beatType: isSpike ? 'PACED_VENTRICULAR' : 'INTRINSIC',
      annotation: isSpike && !simResult.isCapturingVentricular ? 'Capture Loss' : undefined,
    });
  }

  return points;
}

/**
 * High-yield clinical emergency presets for cardiac pacing education.
 */
export const PACING_PRESETS: PacingPreset[] = [
  {
    id: 'complete-heart-block',
    title: 'Complete 3rd-Degree AV Block with Stokes-Adams Syncope',
    patientProfile: '72yo M post-TAVR with complete AV dissociation, wide ventricular escape 30 bpm, MAP 52 mmHg',
    dials: {
      mode: 'VVI',
      rateBpm: 75,
      ventricularOutputMa: 5.0,
      ventricularSensitivityMv: 3.0,
      atrialOutputMa: 3.0,
      atrialSensitivityMv: 1.0,
      avDelayMs: 180,
    },
    intrinsicState: {
      intrinsicAtrialRateBpm: 88,
      intrinsicVentricularRateBpm: 30,
      hasAvDissociation: true,
      intrinsicRWaveAmplitudeMv: 8.5,
      intrinsicPWaveAmplitudeMv: 1.8,
      stimulationThresholdMa: 1.0,
      atrialStimulationThresholdMa: 1.2,
      baselineQtIntervalMs: 440,
      leadDisplaced: false,
      ambientElectromagneticNoiseMv: 0.1,
    },
    clinicalExplanation:
      'Transvenous RV apical wire placed. 5.0 mA provides a 5x safety margin above 1.0 mA threshold. VVI pacing at 75 bpm restores MAP to 78 mmHg and aborts syncope.',
  },
  {
    id: 'failure-to-capture',
    title: 'Failure to Capture (Lead Dislodgement / Micro-Displacement)',
    patientProfile: '64yo F post-cardiac surgery; RV pacing wire shifted during bed turn; output 1.2 mA < threshold 3.5 mA',
    dials: {
      mode: 'VVI',
      rateBpm: 70,
      ventricularOutputMa: 1.2,
      ventricularSensitivityMv: 2.5,
      atrialOutputMa: 2.0,
      atrialSensitivityMv: 1.0,
      avDelayMs: 160,
    },
    intrinsicState: {
      intrinsicAtrialRateBpm: 70,
      intrinsicVentricularRateBpm: 34,
      hasAvDissociation: true,
      intrinsicRWaveAmplitudeMv: 5.0,
      intrinsicPWaveAmplitudeMv: 1.2,
      stimulationThresholdMa: 3.5, // displaced lead elevated threshold
      atrialStimulationThresholdMa: 1.5,
      baselineQtIntervalMs: 460,
      leadDisplaced: true,
      ambientElectromagneticNoiseMv: 0.1,
    },
    clinicalExplanation:
      'Pacing spikes are visible on ECG with absent QRS complexes. Output dial (1.2 mA) fails to depolarize the myocardium. Increasing output to >7.0 mA or repositioning the wire is urgent.',
  },
  {
    id: 'undersensing-r-on-t',
    title: 'Undersensing & Lethal R-on-T Ventricular Fibrillation',
    patientProfile: '58yo M with anterior STEMI; sensitivity dial set to 15.0 mV (insensitive); spike fires into T-wave',
    dials: {
      mode: 'VVI',
      rateBpm: 80,
      ventricularOutputMa: 6.0,
      ventricularSensitivityMv: 15.0, // extremely insensitive dial setting!
      atrialOutputMa: 2.0,
      atrialSensitivityMv: 1.0,
      avDelayMs: 150,
    },
    intrinsicState: {
      intrinsicAtrialRateBpm: 76,
      intrinsicVentricularRateBpm: 70,
      hasAvDissociation: false,
      intrinsicRWaveAmplitudeMv: 6.0, // 6 mV < 15 mV dial threshold -> cannot be sensed
      intrinsicPWaveAmplitudeMv: 1.5,
      stimulationThresholdMa: 0.9,
      atrialStimulationThresholdMa: 1.0,
      baselineQtIntervalMs: 480,
      leadDisplaced: false,
      ambientElectromagneticNoiseMv: 0.1,
    },
    clinicalExplanation:
      'Because sensitivity is set to 15 mV, the generator is blind to the 6 mV native R-waves. It fires asynchronously. A pacing spike lands on the vulnerable T-wave repolarization downslope, triggering polymorphic VT / VF.',
  },
  {
    id: 'oversensing-asystole',
    title: 'Oversensing with Inappropriate Pacing Inhibition & Asystole',
    patientProfile: '69yo F in ICU; dial set to hyper-sensitive 0.5 mV; pectoral myopotentials/shivering falsely inhibit pacing',
    dials: {
      mode: 'VVI',
      rateBpm: 70,
      ventricularOutputMa: 4.0,
      ventricularSensitivityMv: 0.5, // hyper-sensitive dial!
      atrialOutputMa: 2.0,
      atrialSensitivityMv: 1.0,
      avDelayMs: 150,
    },
    intrinsicState: {
      intrinsicAtrialRateBpm: 60,
      intrinsicVentricularRateBpm: 15, // deep underlying sinus arrest
      hasAvDissociation: true,
      intrinsicRWaveAmplitudeMv: 7.0,
      intrinsicPWaveAmplitudeMv: 1.2,
      stimulationThresholdMa: 0.8,
      atrialStimulationThresholdMa: 1.0,
      baselineQtIntervalMs: 440,
      leadDisplaced: false,
      ambientElectromagneticNoiseMv: 0.9, // noise exceeds 0.5 mV dial threshold
    },
    clinicalExplanation:
      'The sensitivity dial (0.5 mV) is too low, sensing skeletal muscle shivering and baseline artifact. The pacemaker assumes intrinsic cardiac activity and inappropriately inhibits output, producing a 4-second asystolic pause.',
  },
  {
    id: 'torsades-overdrive',
    title: 'Overdrive Pacing for Drug-Induced Long QT & Torsades de Pointes',
    patientProfile: '45yo F on Sotalol with QTc 580 ms and recurrent pause-dependent Torsades de Pointes runs',
    dials: {
      mode: 'VOO',
      rateBpm: 105, // Overdrive rate suppresses EADs
      ventricularOutputMa: 6.0,
      ventricularSensitivityMv: 2.5,
      atrialOutputMa: 3.0,
      atrialSensitivityMv: 1.0,
      avDelayMs: 150,
    },
    intrinsicState: {
      intrinsicAtrialRateBpm: 52,
      intrinsicVentricularRateBpm: 50,
      hasAvDissociation: false,
      intrinsicRWaveAmplitudeMv: 9.0,
      intrinsicPWaveAmplitudeMv: 1.5,
      stimulationThresholdMa: 1.0,
      atrialStimulationThresholdMa: 1.2,
      baselineQtIntervalMs: 580,
      leadDisplaced: false,
      ambientElectromagneticNoiseMv: 0.1,
    },
    clinicalExplanation:
      'Rate acceleration to 105 bpm shortens ventricular repolarization, eliminates bradycardia-dependent dispersion of refractoriness, and abolishes early afterdepolarizations (EADs) preventing further Torsades.',
  },
  {
    id: 'pacemaker-syndrome',
    title: 'Pacemaker Syndrome in VVI Mode (Relieved by DDD Conversion)',
    patientProfile: '77yo M with VVI pacing at 80 bpm; reports throbbing neck fullness, lightheadedness, and MAP drops 20 mmHg',
    dials: {
      mode: 'VVI',
      rateBpm: 80,
      ventricularOutputMa: 4.5,
      ventricularSensitivityMv: 2.5,
      atrialOutputMa: 3.5,
      atrialSensitivityMv: 1.0,
      avDelayMs: 170,
    },
    intrinsicState: {
      intrinsicAtrialRateBpm: 75,
      intrinsicVentricularRateBpm: 38,
      hasAvDissociation: true,
      intrinsicRWaveAmplitudeMv: 8.0,
      intrinsicPWaveAmplitudeMv: 2.0,
      stimulationThresholdMa: 0.9,
      atrialStimulationThresholdMa: 1.1,
      baselineQtIntervalMs: 430,
      leadDisplaced: false,
      ambientElectromagneticNoiseMv: 0.1,
    },
    clinicalExplanation:
      'Unsynchronized ventricular pacing causes the atria to contract against closed tricuspid/mitral valves, generating giant cannon A-waves and losing 25% of cardiac output. Switching to dual-chamber DDD pacing restores AV synchrony.',
  },
];
