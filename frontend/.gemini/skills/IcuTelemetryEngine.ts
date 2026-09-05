/**
 * IcuTelemetryEngine.ts
 * Real-Time Multi-Bed ICU Telemetry, Physiological Waveform Synthesizers,
 * Dynamic Multi-Tier Alarm Detection, and Emergency Critical Care Interventions.
 * Location: frontend/.gemini/skills/IcuTelemetryEngine.ts
 */

export type IcuUnit = 'MICU' | 'CCU' | 'SICU' | 'NEURO_ICU';

export type CardiacRhythmType =
  | 'NORMAL_SINUS'
  | 'SINUS_TACHYCARDIA'
  | 'SINUS_BRADYCARDIA'
  | 'ATRIAL_FIBRILLATION'
  | 'VENTRICULAR_TACHYCARDIA'
  | 'VENTRICULAR_FIBRILLATION'
  | 'ASYSTOLE'
  | 'AV_BLOCK_3RD_DEGREE'
  | 'ST_ELEVATION_ANTERIOR';

export type AlarmSeverity = 'CRISIS' | 'WARNING' | 'ADVISORY';

export interface TelemetryAlarm {
  id: string;
  bedId: string;
  level: AlarmSeverity;
  title: string;
  parameter: string;
  currentValue: string | number;
  threshold: string | number;
  timestamp: number;
  acknowledged: boolean;
}

export interface IcuVitals {
  heartRate: number;
  systolicBp: number;
  diastolicBp: number;
  meanArterialPressure: number;
  spO2: number;
  respRate: number;
  temperatureCelsius: number;
  cvpMmHg?: number;
  etCo2MmHg?: number;
}

export interface AlarmThresholds {
  hrHigh: number;
  hrLow: number;
  sbpHigh: number;
  sbpLow: number;
  spo2Low: number;
  rrHigh: number;
  rrLow: number;
}

export interface IcuBed {
  bedId: string;
  patientName: string;
  mrn: string;
  age: number;
  gender: 'M' | 'F';
  diagnosis: string;
  unit: IcuUnit;
  rhythm: CardiacRhythmType;
  vitals: IcuVitals;
  alarmLimits: AlarmThresholds;
  activeAlarms: TelemetryAlarm[];
  isSilenced: boolean;
  silenceRemainingSeconds: number;
  waveformSamples: {
    ecg: number[];
    pleth: number[];
    art: number[];
  };
}

export type BedInterventionType =
  | 'defibrillate_200j'
  | 'atropine_1mg'
  | 'norepinephrine_titrate'
  | 'amiodarone_150mg'
  | 'crystalloid_bolus_1000ml'
  | 'oxygen_titrate_100'
  | 'cpr_chest_compressions';

/**
 * Computes Mean Arterial Pressure (MAP = (2 * DBP + SBP) / 3)
 */
export function calculateMap(sbp: number, dbp: number): number {
  return Math.round((2 * dbp + sbp) / 3);
}

/**
 * Synthesizes Lead II ECG microvolt potentials
 */
export function generateEcgWaveform(
  rhythm: CardiacRhythmType,
  hr: number,
  sampleCount = 120
): number[] {
  const samples: number[] = [];
  const beatPeriodSamples = Math.max(20, Math.round((60 / hr) * (sampleCount / 3)));

  for (let i = 0; i < sampleCount; i++) {
    const phase = (i % beatPeriodSamples) / beatPeriodSamples; // 0 to 1

    let v = 0;

    switch (rhythm) {
      case 'ASYSTOLE':
        // Flatline with subtle baseline drift
        v = Math.sin(i * 0.05) * 0.02 + (Math.random() - 0.5) * 0.03;
        break;

      case 'VENTRICULAR_FIBRILLATION':
        // Chaotic fibrillatory oscillation
        v =
          Math.sin(i * 0.45) * 0.45 +
          Math.sin(i * 0.78) * 0.35 +
          Math.sin(i * 1.15) * 0.2 +
          (Math.random() - 0.5) * 0.15;
        break;

      case 'VENTRICULAR_TACHYCARDIA':
        // Wide, fast monomorphic sinusoidal peaks
        v = Math.sin(phase * Math.PI * 2) * 1.1 + Math.sin(phase * Math.PI * 4) * 0.3;
        break;

      case 'ATRIAL_FIBRILLATION': {
        // Coarse fibrillatory f-waves + irregular QRS
        const fWaves = Math.sin(i * 0.8) * 0.08 + Math.cos(i * 1.3) * 0.05;
        if (phase >= 0.35 && phase < 0.38) {
          v = -0.15; // Q
        } else if (phase >= 0.38 && phase < 0.43) {
          v = 1.25; // R
        } else if (phase >= 0.43 && phase < 0.46) {
          v = -0.3; // S
        } else if (phase >= 0.55 && phase < 0.7) {
          v = Math.sin(((phase - 0.55) / 0.15) * Math.PI) * 0.22; // T
        } else {
          v = fWaves;
        }
        break;
      }

      case 'ST_ELEVATION_ANTERIOR': {
        // Elevated ST segment (+0.35 mV above isoelectric)
        if (phase >= 0.12 && phase < 0.22) {
          v = Math.sin(((phase - 0.12) / 0.1) * Math.PI) * 0.18; // P
        } else if (phase >= 0.32 && phase < 0.35) {
          v = -0.12; // Q
        } else if (phase >= 0.35 && phase < 0.4) {
          v = 1.35; // R
        } else if (phase >= 0.4 && phase < 0.43) {
          v = -0.15; // S
        } else if (phase >= 0.43 && phase < 0.72) {
          // Marked elevated ST plateaus directly into peaked T
          v = 0.42 + Math.sin(((phase - 0.43) / 0.29) * Math.PI) * 0.45;
        } else {
          v = 0.0;
        }
        break;
      }

      case 'AV_BLOCK_3RD_DEGREE': {
        // Complete AV dissociation: regular P waves marching through slow ventricular escape
        const pPhase = (i % 25) / 25;
        const pWave = pPhase < 0.3 ? Math.sin((pPhase / 0.3) * Math.PI) * 0.2 : 0;
        let qrsWave = 0;
        if (phase >= 0.38 && phase < 0.46) {
          qrsWave = 0.9;
        } else if (phase >= 0.55 && phase < 0.75) {
          qrsWave = Math.sin(((phase - 0.55) / 0.2) * Math.PI) * 0.25;
        }
        v = pWave + qrsWave;
        break;
      }

      case 'NORMAL_SINUS':
      case 'SINUS_TACHYCARDIA':
      case 'SINUS_BRADYCARDIA':
      default: {
        // Classic P-Q-R-S-T
        if (phase >= 0.12 && phase < 0.22) {
          v = Math.sin(((phase - 0.12) / 0.1) * Math.PI) * 0.18; // P
        } else if (phase >= 0.34 && phase < 0.37) {
          v = -0.12; // Q
        } else if (phase >= 0.37 && phase < 0.42) {
          v = 1.3; // R
        } else if (phase >= 0.42 && phase < 0.45) {
          v = -0.28; // S
        } else if (phase >= 0.55 && phase < 0.72) {
          v = Math.sin(((phase - 0.55) / 0.17) * Math.PI) * 0.26; // T
        } else {
          v = 0.0;
        }
        break;
      }
    }

    samples.push(Number(v.toFixed(3)));
  }

  return samples;
}

/**
 * Synthesizes Plethysmograph (pulse oximetry) waveform
 */
export function generatePlethWaveform(hr: number, spo2: number, sampleCount = 120): number[] {
  const samples: number[] = [];
  const beatPeriod = Math.max(15, Math.round((60 / hr) * (sampleCount / 3)));
  const amplitudeScale = Math.max(0.3, spo2 / 100);

  for (let i = 0; i < sampleCount; i++) {
    const phase = (i % beatPeriod) / beatPeriod;
    let v = 0;

    if (phase < 0.25) {
      // Systolic upstroke
      v = Math.sin((phase / 0.25) * (Math.PI / 2));
    } else if (phase >= 0.25 && phase < 0.45) {
      // Dicrotic notch descent
      v = 1.0 - (phase - 0.25) * 1.5;
    } else if (phase >= 0.45 && phase < 0.58) {
      // Dicrotic wave reflection
      v = 0.7 + Math.sin(((phase - 0.45) / 0.13) * Math.PI) * 0.15;
    } else {
      // Diastolic runoff
      v = 0.7 * (1.0 - (phase - 0.58) / 0.42);
    }

    samples.push(Number(Math.max(0, v * amplitudeScale).toFixed(3)));
  }

  return samples;
}

/**
 * Synthesizes Arterial Line invasive blood pressure pulse wave
 */
export function generateArtLineWaveform(
  hr: number,
  sbp: number,
  dbp: number,
  sampleCount = 120
): number[] {
  const samples: number[] = [];
  const beatPeriod = Math.max(15, Math.round((60 / hr) * (sampleCount / 3)));
  const pulsePressure = sbp - dbp;

  for (let i = 0; i < sampleCount; i++) {
    const phase = (i % beatPeriod) / beatPeriod;
    let normPressure = 0;

    if (phase < 0.2) {
      // Sharp systolic upstroke
      normPressure = Math.sin((phase / 0.2) * (Math.PI / 2));
    } else if (phase >= 0.2 && phase < 0.38) {
      // Systolic runoff to dicrotic notch
      normPressure = 1.0 - (phase - 0.2) * 1.8;
    } else if (phase >= 0.38 && phase < 0.5) {
      // Dicrotic notch & aortic valve closure wave
      normPressure = 0.68 + Math.sin(((phase - 0.38) / 0.12) * Math.PI) * 0.12;
    } else {
      // Diastolic runoff
      normPressure = 0.68 * Math.exp(-((phase - 0.5) * 3.2));
    }

    const mmVal = Math.round(dbp + normPressure * pulsePressure);
    samples.push(mmVal);
  }

  return samples;
}

/**
 * Evaluates active alarms for an ICU bed against clinical thresholds and rhythm criteria
 */
export function evaluateBedAlarms(bed: IcuBed): TelemetryAlarm[] {
  const alarms: TelemetryAlarm[] = [];
  const { vitals, alarmLimits, rhythm, bedId } = bed;

  // 1. Life-Threatening Arrhythmia Alarms (CRISIS)
  if (rhythm === 'VENTRICULAR_FIBRILLATION') {
    alarms.push({
      id: `${bedId}-vf`,
      bedId,
      level: 'CRISIS',
      title: 'VENTRICULAR FIBRILLATION',
      parameter: 'ECG',
      currentValue: 'V-Fib',
      threshold: 'Lethal Arrest',
      timestamp: Date.now(),
      acknowledged: false,
    });
  } else if (rhythm === 'ASYSTOLE') {
    alarms.push({
      id: `${bedId}-asystole`,
      bedId,
      level: 'CRISIS',
      title: 'ASYSTOLE / CARDIAC ARREST',
      parameter: 'ECG',
      currentValue: '0 bpm',
      threshold: 'Asystole',
      timestamp: Date.now(),
      acknowledged: false,
    });
  } else if (rhythm === 'VENTRICULAR_TACHYCARDIA') {
    alarms.push({
      id: `${bedId}-vt`,
      bedId,
      level: 'CRISIS',
      title: 'SUSTAINED VENTRICULAR TACHYCARDIA',
      parameter: 'ECG',
      currentValue: `${vitals.heartRate} bpm`,
      threshold: 'V-Tach',
      timestamp: Date.now(),
      acknowledged: false,
    });
  } else if (rhythm === 'AV_BLOCK_3RD_DEGREE') {
    alarms.push({
      id: `${bedId}-chb`,
      bedId,
      level: 'CRISIS',
      title: '3RD DEGREE COMPLETE HEART BLOCK',
      parameter: 'ECG',
      currentValue: `${vitals.heartRate} bpm`,
      threshold: 'AV Dissociation',
      timestamp: Date.now(),
      acknowledged: false,
    });
  }

  // 2. Hemodynamic & Vitals Threshold Alarms
  // Heart Rate
  if (vitals.heartRate > alarmLimits.hrHigh) {
    const isExtreme = vitals.heartRate >= 150;
    alarms.push({
      id: `${bedId}-hr-high`,
      bedId,
      level: isExtreme ? 'CRISIS' : 'WARNING',
      title: isExtreme ? 'EXTREME TACHYCARDIA' : 'HIGH HEART RATE',
      parameter: 'HR',
      currentValue: `${vitals.heartRate} bpm`,
      threshold: `> ${alarmLimits.hrHigh}`,
      timestamp: Date.now(),
      acknowledged: false,
    });
  } else if (vitals.heartRate < alarmLimits.hrLow) {
    const isExtreme = vitals.heartRate <= 40;
    alarms.push({
      id: `${bedId}-hr-low`,
      bedId,
      level: isExtreme ? 'CRISIS' : 'WARNING',
      title: isExtreme ? 'EXTREME BRADYCARDIA' : 'LOW HEART RATE',
      parameter: 'HR',
      currentValue: `${vitals.heartRate} bpm`,
      threshold: `< ${alarmLimits.hrLow}`,
      timestamp: Date.now(),
      acknowledged: false,
    });
  }

  // Blood Pressure / MAP
  if (vitals.meanArterialPressure < 65) {
    const isSevere = vitals.meanArterialPressure < 55;
    alarms.push({
      id: `${bedId}-map-low`,
      bedId,
      level: isSevere ? 'CRISIS' : 'WARNING',
      title: isSevere ? 'PROFOUND HYPOTENSION (SHOCK)' : 'LOW MAP (< 65 mmHg)',
      parameter: 'MAP',
      currentValue: `${vitals.meanArterialPressure} mmHg`,
      threshold: '< 65 mmHg',
      timestamp: Date.now(),
      acknowledged: false,
    });
  } else if (vitals.systolicBp > alarmLimits.sbpHigh) {
    alarms.push({
      id: `${bedId}-sbp-high`,
      bedId,
      level: 'WARNING',
      title: 'HYPERTENSIVE CRISIS',
      parameter: 'NIBP',
      currentValue: `${vitals.systolicBp} mmHg`,
      threshold: `> ${alarmLimits.sbpHigh}`,
      timestamp: Date.now(),
      acknowledged: false,
    });
  }

  // SpO2 Pulse Oximetry
  if (vitals.spO2 < alarmLimits.spo2Low) {
    const isMalignant = vitals.spO2 < 85;
    alarms.push({
      id: `${bedId}-spo2-low`,
      bedId,
      level: isMalignant ? 'CRISIS' : 'WARNING',
      title: isMalignant ? 'CRITICAL HYPOXEMIA' : 'DESATURATION',
      parameter: 'SpO2',
      currentValue: `${vitals.spO2}%`,
      threshold: `< ${alarmLimits.spo2Low}%`,
      timestamp: Date.now(),
      acknowledged: false,
    });
  }

  // Respiratory Rate
  if (vitals.respRate > alarmLimits.rrHigh) {
    alarms.push({
      id: `${bedId}-rr-high`,
      bedId,
      level: 'WARNING',
      title: 'TACHYPNEA',
      parameter: 'RESP',
      currentValue: `${vitals.respRate} /min`,
      threshold: `> ${alarmLimits.rrHigh}`,
      timestamp: Date.now(),
      acknowledged: false,
    });
  }

  return alarms;
}

/**
 * Applies a clinical bedside emergency intervention to an ICU bed
 */
export function applyBedIntervention(
  bed: IcuBed,
  intervention: BedInterventionType
): { updatedBed: IcuBed; resultMessage: string } {
  let updatedRhythm = bed.rhythm;
  const updatedVitals: IcuVitals = { ...bed.vitals };
  let resultMessage = '';

  switch (intervention) {
    case 'defibrillate_200j': {
      if (bed.rhythm === 'VENTRICULAR_FIBRILLATION' || bed.rhythm === 'VENTRICULAR_TACHYCARDIA') {
        updatedRhythm = 'SINUS_TACHYCARDIA';
        updatedVitals.heartRate = 118;
        updatedVitals.systolicBp = 104;
        updatedVitals.diastolicBp = 66;
        updatedVitals.meanArterialPressure = calculateMap(104, 66);
        updatedVitals.spO2 = 94;
        resultMessage = '200J Biphasic Shock delivered. Successful cardioversion to Sinus Tachycardia.';
      } else {
        resultMessage = 'Inappropriate shock: Rhythm is not shockable (no V-Fib/pulseless VT).';
      }
      break;
    }

    case 'atropine_1mg': {
      if (bed.rhythm === 'AV_BLOCK_3RD_DEGREE' || bed.rhythm === 'SINUS_BRADYCARDIA') {
        updatedRhythm = 'NORMAL_SINUS';
        updatedVitals.heartRate = 78;
        updatedVitals.systolicBp = 122;
        updatedVitals.diastolicBp = 76;
        updatedVitals.meanArterialPressure = calculateMap(122, 76);
        resultMessage = 'Atropine 1 mg IV administered. Vagolytic response restored normal sinus nodal conduction (78 bpm).';
      } else {
        resultMessage = 'Atropine administered: Minimal effect on non-bradycardic rhythm.';
      }
      break;
    }

    case 'amiodarone_150mg': {
      if (bed.rhythm === 'VENTRICULAR_TACHYCARDIA' || bed.rhythm === 'ATRIAL_FIBRILLATION') {
        updatedRhythm = 'NORMAL_SINUS';
        updatedVitals.heartRate = 84;
        updatedVitals.systolicBp = 118;
        updatedVitals.diastolicBp = 74;
        updatedVitals.meanArterialPressure = calculateMap(118, 74);
        resultMessage = 'Amiodarone 150 mg IV bolus infused. Restored normal sinus rhythm.';
      } else {
        resultMessage = 'Amiodarone infused: Maintenance antiarrhythmic level active.';
      }
      break;
    }

    case 'norepinephrine_titrate': {
      updatedVitals.systolicBp = Math.min(160, updatedVitals.systolicBp + 32);
      updatedVitals.diastolicBp = Math.min(100, updatedVitals.diastolicBp + 18);
      updatedVitals.meanArterialPressure = calculateMap(
        updatedVitals.systolicBp,
        updatedVitals.diastolicBp
      );
      resultMessage = `Norepinephrine titrated upwards: Arterial pressure restored to ${updatedVitals.systolicBp}/${updatedVitals.diastolicBp} (MAP ${updatedVitals.meanArterialPressure} mmHg).`;
      break;
    }

    case 'crystalloid_bolus_1000ml': {
      updatedVitals.systolicBp = Math.min(140, updatedVitals.systolicBp + 24);
      updatedVitals.diastolicBp = Math.min(88, updatedVitals.diastolicBp + 14);
      updatedVitals.meanArterialPressure = calculateMap(
        updatedVitals.systolicBp,
        updatedVitals.diastolicBp
      );
      updatedVitals.heartRate = Math.max(65, updatedVitals.heartRate - 16);
      resultMessage = `1,000 mL balanced crystalloid bolus infused: Preload replenished, SBP lifted to ${updatedVitals.systolicBp} mmHg.`;
      break;
    }

    case 'oxygen_titrate_100': {
      updatedVitals.spO2 = Math.min(100, updatedVitals.spO2 + 13);
      updatedVitals.respRate = Math.max(14, updatedVitals.respRate - 8);
      resultMessage = `FiO2 titrated to 100% with PEEP adjustment: Oxygen saturation rescued to ${updatedVitals.spO2}%.`;
      break;
    }

    case 'cpr_chest_compressions': {
      if (bed.rhythm === 'ASYSTOLE' || bed.rhythm === 'VENTRICULAR_FIBRILLATION') {
        updatedVitals.meanArterialPressure = 45; // perfusion generated by CPR
        resultMessage = 'High-quality chest compressions initiated (100-120/min, 5-6 cm depth). Generating artificial perfusion.';
      } else {
        resultMessage = 'CPR not indicated: Patient has spontaneous perfusing rhythm.';
      }
      break;
    }
  }

  // Refresh waveforms with new vitals and rhythm
  const ecg = generateEcgWaveform(updatedRhythm, updatedVitals.heartRate);
  const pleth = generatePlethWaveform(updatedVitals.heartRate, updatedVitals.spO2);
  const art = generateArtLineWaveform(
    updatedVitals.heartRate,
    updatedVitals.systolicBp,
    updatedVitals.diastolicBp
  );

  const updatedBed: IcuBed = {
    ...bed,
    rhythm: updatedRhythm,
    vitals: updatedVitals,
    waveformSamples: { ecg, pleth, art },
    activeAlarms: [], // will re-evaluate
  };

  updatedBed.activeAlarms = evaluateBedAlarms(updatedBed);

  return { updatedBed, resultMessage };
}

/**
 * Seeded 6-Bed Intensive Care Unit Roster
 */
export const SEEDED_ICU_BEDS: IcuBed[] = [
  {
    bedId: 'BED-01',
    patientName: 'Ramesh Sundaram',
    mrn: 'MED-99201',
    age: 58,
    gender: 'M',
    diagnosis: 'Acute Anterior STEMI with Runs of V-Tach',
    unit: 'CCU',
    rhythm: 'VENTRICULAR_TACHYCARDIA',
    vitals: {
      heartRate: 168,
      systolicBp: 86,
      diastolicBp: 52,
      meanArterialPressure: calculateMap(86, 52),
      spO2: 91,
      respRate: 24,
      temperatureCelsius: 37.1,
      cvpMmHg: 14,
      etCo2MmHg: 32,
    },
    alarmLimits: {
      hrHigh: 120,
      hrLow: 50,
      sbpHigh: 160,
      sbpLow: 90,
      spo2Low: 92,
      rrHigh: 28,
      rrLow: 10,
    },
    activeAlarms: [],
    isSilenced: false,
    silenceRemainingSeconds: 0,
    waveformSamples: {
      ecg: generateEcgWaveform('VENTRICULAR_TACHYCARDIA', 168),
      pleth: generatePlethWaveform(168, 91),
      art: generateArtLineWaveform(168, 86, 52),
    },
  },
  {
    bedId: 'BED-02',
    patientName: 'Sunita Mehra',
    mrn: 'MED-88412',
    age: 46,
    gender: 'F',
    diagnosis: 'Septic Shock (Neutropenic) on Norepinephrine',
    unit: 'MICU',
    rhythm: 'SINUS_TACHYCARDIA',
    vitals: {
      heartRate: 128,
      systolicBp: 78,
      diastolicBp: 44,
      meanArterialPressure: calculateMap(78, 44),
      spO2: 94,
      respRate: 26,
      temperatureCelsius: 39.2,
      cvpMmHg: 4,
      etCo2MmHg: 29,
    },
    alarmLimits: {
      hrHigh: 115,
      hrLow: 55,
      sbpHigh: 150,
      sbpLow: 90,
      spo2Low: 92,
      rrHigh: 25,
      rrLow: 10,
    },
    activeAlarms: [],
    isSilenced: false,
    silenceRemainingSeconds: 0,
    waveformSamples: {
      ecg: generateEcgWaveform('SINUS_TACHYCARDIA', 128),
      pleth: generatePlethWaveform(128, 94),
      art: generateArtLineWaveform(128, 78, 44),
    },
  },
  {
    bedId: 'BED-03',
    patientName: 'Vikram Malhotra',
    mrn: 'MED-77192',
    age: 72,
    gender: 'M',
    diagnosis: '3rd-Degree AV Block with Ventricular Escape',
    unit: 'CCU',
    rhythm: 'AV_BLOCK_3RD_DEGREE',
    vitals: {
      heartRate: 34,
      systolicBp: 92,
      diastolicBp: 48,
      meanArterialPressure: calculateMap(92, 48),
      spO2: 95,
      respRate: 16,
      temperatureCelsius: 36.6,
      cvpMmHg: 16,
    },
    alarmLimits: {
      hrHigh: 110,
      hrLow: 45,
      sbpHigh: 160,
      sbpLow: 90,
      spo2Low: 92,
      rrHigh: 24,
      rrLow: 10,
    },
    activeAlarms: [],
    isSilenced: false,
    silenceRemainingSeconds: 0,
    waveformSamples: {
      ecg: generateEcgWaveform('AV_BLOCK_3RD_DEGREE', 34),
      pleth: generatePlethWaveform(34, 95),
      art: generateArtLineWaveform(34, 92, 48),
    },
  },
  {
    bedId: 'BED-04',
    patientName: 'Ananya Roy',
    mrn: 'MED-66324',
    age: 34,
    gender: 'F',
    diagnosis: 'Severe ARDS on Mechanical Ventilation',
    unit: 'MICU',
    rhythm: 'NORMAL_SINUS',
    vitals: {
      heartRate: 104,
      systolicBp: 116,
      diastolicBp: 70,
      meanArterialPressure: calculateMap(116, 70),
      spO2: 83,
      respRate: 32,
      temperatureCelsius: 37.8,
      etCo2MmHg: 48,
    },
    alarmLimits: {
      hrHigh: 120,
      hrLow: 50,
      sbpHigh: 150,
      sbpLow: 90,
      spo2Low: 88,
      rrHigh: 28,
      rrLow: 8,
    },
    activeAlarms: [],
    isSilenced: false,
    silenceRemainingSeconds: 0,
    waveformSamples: {
      ecg: generateEcgWaveform('NORMAL_SINUS', 104),
      pleth: generatePlethWaveform(104, 83),
      art: generateArtLineWaveform(104, 116, 70),
    },
  },
  {
    bedId: 'BED-05',
    patientName: 'David Miller',
    mrn: 'MED-55102',
    age: 65,
    gender: 'M',
    diagnosis: 'Post-Op AAA Repair with Hypovolemia',
    unit: 'SICU',
    rhythm: 'SINUS_TACHYCARDIA',
    vitals: {
      heartRate: 122,
      systolicBp: 84,
      diastolicBp: 50,
      meanArterialPressure: calculateMap(84, 50),
      spO2: 96,
      respRate: 22,
      temperatureCelsius: 36.3,
      cvpMmHg: 2,
    },
    alarmLimits: {
      hrHigh: 110,
      hrLow: 50,
      sbpHigh: 150,
      sbpLow: 90,
      spo2Low: 92,
      rrHigh: 25,
      rrLow: 8,
    },
    activeAlarms: [],
    isSilenced: false,
    silenceRemainingSeconds: 0,
    waveformSamples: {
      ecg: generateEcgWaveform('SINUS_TACHYCARDIA', 122),
      pleth: generatePlethWaveform(122, 96),
      art: generateArtLineWaveform(122, 84, 50),
    },
  },
  {
    bedId: 'BED-06',
    patientName: 'Fatima Sheikh',
    mrn: 'MED-44919',
    age: 52,
    gender: 'F',
    diagnosis: 'Severe TBI with Intracranial Hypertension (Cushing)',
    unit: 'NEURO_ICU',
    rhythm: 'SINUS_BRADYCARDIA',
    vitals: {
      heartRate: 48,
      systolicBp: 196,
      diastolicBp: 104,
      meanArterialPressure: calculateMap(196, 104),
      spO2: 98,
      respRate: 12,
      temperatureCelsius: 37.0,
      etCo2MmHg: 34,
    },
    alarmLimits: {
      hrHigh: 110,
      hrLow: 55,
      sbpHigh: 160,
      sbpLow: 90,
      spo2Low: 92,
      rrHigh: 24,
      rrLow: 8,
    },
    activeAlarms: [],
    isSilenced: false,
    silenceRemainingSeconds: 0,
    waveformSamples: {
      ecg: generateEcgWaveform('SINUS_BRADYCARDIA', 48),
      pleth: generatePlethWaveform(48, 98),
      art: generateArtLineWaveform(48, 196, 104),
    },
  },
];

// Initialize active alarms on seeded beds
SEEDED_ICU_BEDS.forEach((bed) => {
  bed.activeAlarms = evaluateBedAlarms(bed);
});
