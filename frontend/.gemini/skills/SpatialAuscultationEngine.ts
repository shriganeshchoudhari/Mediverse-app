/**
 * SpatialAuscultationEngine.ts
 * Biophysical Chest Auscultation, Spatial Topography & Synchronized PCG/ECG Engine
 * Track C3 - Mediverse Clinical Platform Architecture
 */

export interface AuscultationLandmark {
  id: string;
  name: string;
  x: number; // percentage of chest width (0-100)
  y: number; // percentage of chest height (0-100)
  anatomicalLocation: string;
  primaryPathologies: string[];
  recommendedChestpiece: 'bell' | 'diaphragm';
  clinicalDescription: string;
}

export const AUSCULTATION_LANDMARKS: AuscultationLandmark[] = [
  {
    id: 'aortic',
    name: 'Aortic Area',
    x: 42,
    y: 32,
    anatomicalLocation: '2nd Right Intercostal Space (RICS) at sternal border',
    primaryPathologies: ['Aortic Stenosis', 'Aortic Sclerosis', 'Aortic S2 (A2)'],
    recommendedChestpiece: 'diaphragm',
    clinicalDescription: 'Primary site for aortic valve ejection dynamics and radiation of aortic stenosis murmur.'
  },
  {
    id: 'pulmonic',
    name: 'Pulmonic Area',
    x: 58,
    y: 32,
    anatomicalLocation: '2nd Left Intercostal Space (LICS) at sternal border',
    primaryPathologies: ['Pulmonic Stenosis', 'P2 split', 'Patent Ductus Arteriosus (PDA)'],
    recommendedChestpiece: 'diaphragm',
    clinicalDescription: 'Best site to assess physiological, wide, or fixed splitting of S2 (A2-P2 interval).'
  },
  {
    id: 'erbs',
    name: "Erb's Point",
    x: 55,
    y: 42,
    anatomicalLocation: '3rd Left Intercostal Space (LICS) at sternal border',
    primaryPathologies: ['Aortic Regurgitation', 'Hypertrophic Cardiomyopathy (HOCM)'],
    recommendedChestpiece: 'diaphragm',
    clinicalDescription: 'Maximal intensity for high-pitched early diastolic decrescendo murmur of aortic regurgitation.'
  },
  {
    id: 'tricuspid',
    name: 'Tricuspid Area',
    x: 52,
    y: 56,
    anatomicalLocation: '4th Left Intercostal Space (LICS) lower left sternal border',
    primaryPathologies: ['Tricuspid Regurgitation', 'Ventricular Septal Defect (VSD)'],
    recommendedChestpiece: 'diaphragm',
    clinicalDescription: 'Evaluation of right ventricular heaves and Carvallo\'s sign (murmur intensifies with inspiration).'
  },
  {
    id: 'mitral',
    name: 'Mitral Area (Cardiac Apex)',
    x: 66,
    y: 64,
    anatomicalLocation: '5th Left Intercostal Space (LICS) midclavicular line (MCL)',
    primaryPathologies: ['Mitral Regurgitation', 'Mitral Stenosis', 'S3 Gallop', 'S4 Gallop'],
    recommendedChestpiece: 'bell',
    clinicalDescription: 'Point of maximal impulse (PMI); optimal for low-frequency S3/S4 gallops and mitral stenosis rumble.'
  },
  {
    id: 'r_base',
    name: 'Right Lung Base',
    x: 28,
    y: 78,
    anatomicalLocation: 'Posterior/lateral 8th RICS midscapular line',
    primaryPathologies: ['Fine Crackles (CHF/IPF)', 'Coarse Crackles', 'Pleural Friction Rub'],
    recommendedChestpiece: 'diaphragm',
    clinicalDescription: 'Dependent lung field evaluating congestive hydrostatic pulmonary edema and alveolar fluid.'
  },
  {
    id: 'l_base',
    name: 'Left Lung Base',
    x: 72,
    y: 78,
    anatomicalLocation: 'Posterior/lateral 8th LICS midscapular line',
    primaryPathologies: ['Fine Crackles (CHF/IPF)', 'Coarse Crackles', 'Pleural Friction Rub'],
    recommendedChestpiece: 'diaphragm',
    clinicalDescription: 'Dependent lung field evaluating congestive hydrostatic pulmonary edema and alveolar fluid.'
  },
  {
    id: 'apices',
    name: 'Trachea & Lung Apices',
    x: 50,
    y: 18,
    anatomicalLocation: 'Suprasternal notch & anterior cervical trachea',
    primaryPathologies: ['Stridor', 'Bronchial Breath Sounds', 'Carotid Bruits'],
    recommendedChestpiece: 'diaphragm',
    clinicalDescription: 'Upper airway turbulent airflow and evaluation of inspiratory stridor or laryngeal obstruction.'
  },
  {
    id: 'carotids',
    name: 'Right Carotid Artery',
    x: 39,
    y: 14,
    anatomicalLocation: 'Anterior cervical triangle over common carotid artery',
    primaryPathologies: ['Aortic Stenosis Radiation', 'Carotid Atherosclerotic Bruit'],
    recommendedChestpiece: 'diaphragm',
    clinicalDescription: 'Evaluates carotid upstroke velocity (pulsus parvus et tardus) and transmitted ejection systolic murmurs.'
  }
];

export type DynamicManeuver = 'normal' | 'inspiration' | 'expiration' | 'valsalva' | 'handgrip';

export interface AuscultationPreset {
  id: string;
  name: string;
  diagnosis: string;
  category: 'Valvular Heart Disease' | 'Heart Failure' | 'Pulmonology';
  heartRateBpm: number;
  keyAuscultationSite: string;
  optimalChestpiece: 'bell' | 'diaphragm';
  murmurDescription: string;
  radiationPattern: string;
  maneuverFindings: string;
  vitals: { hr: number; bp: string; rr: number; spo2: number };
}

export const AUSCULTATION_PRESETS: AuscultationPreset[] = [
  {
    id: 'aortic-stenosis',
    name: 'Severe Calcific Aortic Stenosis',
    diagnosis: 'Severe Aortic Stenosis (AVA 0.7 cm2, Mean Gradient 48 mmHg)',
    category: 'Valvular Heart Disease',
    heartRateBpm: 76,
    keyAuscultationSite: 'aortic',
    optimalChestpiece: 'diaphragm',
    murmurDescription: 'Harsh, rasping crescendo-decrescendo ejection systolic murmur peaking in late systole; soft/absent A2; early ejection click.',
    radiationPattern: 'Radiates strongly to both carotid arteries (R > L); transmitted to apex (Gallavardin phenomenon).',
    maneuverFindings: 'Decreases with Valsalva strain; increases with squatting; delayed weak carotid pulses (pulsus parvus et tardus).',
    vitals: { hr: 76, bp: '104/82', rr: 18, spo2: 97 }
  },
  {
    id: 'mitral-regurgitation',
    name: 'Severe Mitral Regurgitation with S3 Gallop',
    diagnosis: 'Severe Chronic Mitral Regurgitation (Regurgitant Fraction 55%)',
    category: 'Valvular Heart Disease',
    heartRateBpm: 84,
    keyAuscultationSite: 'mitral',
    optimalChestpiece: 'diaphragm',
    murmurDescription: 'Blowing, high-pitched holosystolic (pansystolic) plateau murmur obscuring S1 and persisting up to S2; prominent low-pitched S3 gallop.',
    radiationPattern: 'Radiates prominently to the left axilla and infrascapular region.',
    maneuverFindings: 'Increases with isometric handgrip (increased afterload); decreases with Valsalva strain.',
    vitals: { hr: 84, bp: '118/74', rr: 20, spo2: 95 }
  },
  {
    id: 'chf-s3-crackles',
    name: 'Decompensated Heart Failure (S3 + Bibasilar Crackles)',
    diagnosis: 'Acute Decompensated Systolic Heart Failure (LVEF 22%, Congestion)',
    category: 'Heart Failure',
    heartRateBpm: 98,
    keyAuscultationSite: 'mitral',
    optimalChestpiece: 'bell',
    murmurDescription: 'Prominent, dull low-frequency S3 ventricular gallop ("Kentucky" cadence) in early diastole; soft secondary functional MR murmur; bilateral fine end-inspiratory Velcro crackles.',
    radiationPattern: 'S3 localized to apex in left lateral decubitus; crackles present bilaterally in dependent lung bases.',
    maneuverFindings: 'S3 accentuated by passive leg raise or light exercise; crackles unaffected by coughing.',
    vitals: { hr: 98, bp: '142/90', rr: 26, spo2: 91 }
  },
  {
    id: 'aortic-regurgitation',
    name: 'Severe Chronic Aortic Regurgitation',
    diagnosis: 'Severe Aortic Insufficiency with LV Volume Overload',
    category: 'Valvular Heart Disease',
    heartRateBpm: 72,
    keyAuscultationSite: 'erbs',
    optimalChestpiece: 'diaphragm',
    murmurDescription: 'High-pitched, blowing early diastolic decrescendo murmur heard best with diaphragm at Erb\'s point with patient leaning forward in held expiration; low-frequency Austin Flint apical diastolic rumble.',
    radiationPattern: 'Radiates downward along left sternal border toward apex.',
    maneuverFindings: 'Increases with handgrip; accompanied by wide pulse pressure and bounding water-hammer pulses.',
    vitals: { hr: 72, bp: '162/48', rr: 16, spo2: 98 }
  },
  {
    id: 'acute-asthma-wheeze',
    name: 'Acute Severe Asthma with Polyphonic Wheezing',
    diagnosis: 'Acute Severe Asthma Exacerbation (PEFR 45% predicted)',
    category: 'Pulmonology',
    heartRateBpm: 110,
    keyAuscultationSite: 'r_base',
    optimalChestpiece: 'diaphragm',
    murmurDescription: 'High-pitched, musical, polyphonic expiratory and inspiratory wheezes across all lung fields; marked prolongation of expiratory phase (I:E ratio 1:3).',
    radiationPattern: 'Diffuse throughout all bronchopulmonary segments and anterior chest wall.',
    maneuverFindings: 'Forced expiration exaggerates musical wheezing; pulsus paradoxus > 12 mmHg.',
    vitals: { hr: 110, bp: '136/88', rr: 30, spo2: 92 }
  }
];

/**
 * Calculate spatial acoustic attenuation from chestpiece distance
 */
export function calculateSpatialAttenuation(
  sourcePos: { x: number; y: number },
  stethoscopePos: { x: number; y: number },
  baseAttenuationFactor: number = 14.0
): number {
  const dx = stethoscopePos.x - sourcePos.x;
  const dy = stethoscopePos.y - sourcePos.y;
  const dist = Math.sqrt(dx * dx + dy * dy);

  // Smooth inverse-distance squared falloff with biological tissue damping
  const intensity = 1.0 / (1.0 + Math.pow(dist / baseAttenuationFactor, 2));
  return parseFloat(Math.max(0.02, Math.min(1.0, intensity)).toFixed(3));
}

/**
 * Evaluate Dynamic Maneuver hemodynamic modulation
 */
export function evaluateDynamicManeuver(
  maneuver: DynamicManeuver,
  pathologyId: string
): { amplitudeMultiplier: number; clinicalMechanism: string } {
  if (maneuver === 'normal') {
    return { amplitudeMultiplier: 1.0, clinicalMechanism: 'Basal resting hemodynamics and respiratory cycle.' };
  }

  if (maneuver === 'inspiration') {
    if (pathologyId === 'aortic-stenosis' || pathologyId === 'mitral-regurgitation' || pathologyId === 'aortic-regurgitation') {
      return {
        amplitudeMultiplier: 0.85,
        clinicalMechanism: 'Negative intrathoracic pressure increases venous return to right heart while pooling blood in pulmonary bed, momentarily decreasing left ventricular stroke volume.'
      };
    }
    return {
      amplitudeMultiplier: 1.35,
      clinicalMechanism: "Carvallo's Sign: Inspiration augments right heart venous filling, amplifying right-sided murmurs and physiologic splitting of S2 (A2-P2 delay)."
    };
  }

  if (maneuver === 'expiration') {
    if (pathologyId === 'aortic-stenosis' || pathologyId === 'mitral-regurgitation' || pathologyId === 'aortic-regurgitation') {
      return {
        amplitudeMultiplier: 1.25,
        clinicalMechanism: 'Positive intrathoracic pressure compresses pulmonary vascular bed, augmenting left ventricular filling and left-sided murmur intensity.'
      };
    }
    return {
      amplitudeMultiplier: 0.85,
      clinicalMechanism: 'Decreased right ventricular stroke volume; S2 splitting narrows.'
    };
  }

  if (maneuver === 'valsalva') {
    if (pathologyId === 'acute-asthma-wheeze') {
      return { amplitudeMultiplier: 1.1, clinicalMechanism: 'Elevated airway pressures emphasize high-pitched wheezing.' };
    }
    return {
      amplitudeMultiplier: 0.55,
      clinicalMechanism: 'Phase II Valsalva strain reduces venous return and ventricular preload, decreasing intensity of most valvular murmurs (except HOCM and MVP).'
    };
  }

  if (maneuver === 'handgrip') {
    if (pathologyId === 'mitral-regurgitation' || pathologyId === 'aortic-regurgitation') {
      return {
        amplitudeMultiplier: 1.5,
        clinicalMechanism: 'Isometric handgrip sharply elevates systemic vascular resistance (SVR/afterload), worsening backward regurgitant jet volume across mitral and aortic valves.'
      };
    }
    if (pathologyId === 'aortic-stenosis') {
      return {
        amplitudeMultiplier: 0.75,
        clinicalMechanism: 'Elevated afterload reduces transvalvular systolic gradient across stenotic aortic valve, softening ejection murmur.'
      };
    }
    return {
      amplitudeMultiplier: 1.0,
      clinicalMechanism: 'Mild heart rate and mean arterial pressure elevation.'
    };
  }

  return { amplitudeMultiplier: 1.0, clinicalMechanism: 'Standard maneuver baseline.' };
}

/**
 * Synthesize Phonocardiogram (PCG) and Synchronized Lead II ECG Waveforms
 */
export function synthesizePcgEcgWaveform(params: {
  hrBpm: number;
  pathologyId: string;
  chestpiece: 'bell' | 'diaphragm';
  maneuver: DynamicManeuver;
  spatialAttenuation: number;
  samplePoints?: number;
}): { timeMs: number; pcgAmplitude: number; ecgVoltageMv: number }[] {
  const points = params.samplePoints || 600;
  const cycleMs = (60 / params.hrBpm) * 1000;
  const results: { timeMs: number; pcgAmplitude: number; ecgVoltageMv: number }[] = [];

  const { amplitudeMultiplier } = evaluateDynamicManeuver(params.maneuver, params.pathologyId);
  const netGain = params.spatialAttenuation * amplitudeMultiplier;

  // Chestpiece acoustic filter weighting
  const isBell = params.chestpiece === 'bell';
  const lowPitchFilter = isBell ? 1.4 : 0.6;   // Bell accentuates low frequency (S3, S4, MS)
  const highPitchFilter = isBell ? 0.6 : 1.3;  // Diaphragm accentuates high frequency (S1, S2, murmurs, crackles)

  const s1Time = 0.08 * cycleMs;
  const s2Time = 0.42 * cycleMs;
  const s3Time = 0.58 * cycleMs;
  const s4Time = 0.94 * cycleMs;

  for (let i = 0; i < points; i++) {
    const t = (i / points) * cycleMs;

    // 1. ECG Lead II Synthesis (Synchronized P-Q-R-S-T)
    let ecg = 0;
    // P wave: 60-120 ms before S1
    const pCenter = s1Time - 0.12 * cycleMs;
    const pDist = t - pCenter;
    ecg += 0.22 * Math.exp(-Math.pow(pDist / 18, 2));

    // QRS complex around S1: sharp Q (-0.15), R (+1.2), S (-0.25)
    const rDist = t - s1Time;
    if (Math.abs(rDist) < 35) {
      if (rDist < -6) ecg -= 0.15 * Math.exp(-Math.pow((rDist + 12) / 6, 2));
      else if (rDist <= 6) ecg += 1.25 * Math.exp(-Math.pow(rDist / 8, 2));
      else ecg -= 0.28 * Math.exp(-Math.pow((rDist - 12) / 6, 2));
    }

    // T wave: termination coincides with S2
    const tCenter = s2Time - 0.06 * cycleMs;
    const tDist = t - tCenter;
    ecg += 0.38 * Math.exp(-Math.pow(tDist / 35, 2));

    // 2. PCG Audio Synthesis (Microbar Acoustic Pressure)
    let pcg = 0;

    // S1 Sound Burst (Mitral/Tricuspid closure)
    const distS1 = Math.abs(t - s1Time);
    if (distS1 < 45) {
      const env = Math.exp(-Math.pow(distS1 / 18, 2));
      pcg += 0.75 * env * Math.sin(distS1 * 0.45) * highPitchFilter;
    }

    // S2 Sound Burst (Aortic/Pulmonic closure)
    const distS2 = Math.abs(t - s2Time);
    if (distS2 < 40) {
      const env = Math.exp(-Math.pow(distS2 / 16, 2));
      pcg += 0.85 * env * Math.sin(distS2 * 0.55) * highPitchFilter;
    }

    // Pathologic Features
    if (params.pathologyId === 'aortic-stenosis') {
      // Systolic crescendo-decrescendo murmur between S1 and S2
      if (t > s1Time + 25 && t < s2Time - 15) {
        const sysProg = (t - (s1Time + 25)) / (s2Time - 15 - (s1Time + 25));
        const envelope = Math.sin(sysProg * Math.PI); // Diamond shape
        const noise = (Math.sin(t * 1.8) * 0.6 + Math.sin(t * 3.4) * 0.4);
        pcg += 0.95 * envelope * noise * highPitchFilter;
      }
    } else if (params.pathologyId === 'mitral-regurgitation') {
      // Holosystolic plateau murmur from S1 up to S2
      if (t > s1Time + 15 && t < s2Time) {
        const envelope = 0.85 + 0.15 * Math.sin(t * 0.1);
        const noise = (Math.sin(t * 2.2) * 0.5 + Math.sin(t * 4.1) * 0.5);
        pcg += 0.9 * envelope * noise * highPitchFilter;
      }
      // Associated S3 gallop
      const distS3 = Math.abs(t - s3Time);
      if (distS3 < 35) {
        const env = Math.exp(-Math.pow(distS3 / 15, 2));
        pcg += 0.65 * env * Math.sin(distS3 * 0.28) * lowPitchFilter;
      }
    } else if (params.pathologyId === 'chf-s3-crackles') {
      // Prominent S3 gallop
      const distS3 = Math.abs(t - s3Time);
      if (distS3 < 40) {
        const env = Math.exp(-Math.pow(distS3 / 16, 2));
        pcg += 0.95 * env * Math.sin(distS3 * 0.25) * lowPitchFilter;
      }
      // Inspiratory crackles (discontinuous high frequency spikes)
      if (t > s2Time + 60 && t < cycleMs - 80) {
        if (Math.sin(t * 0.35) > 0.65) {
          pcg += 0.45 * Math.sin(t * 8.5) * highPitchFilter;
        }
      }
    } else if (params.pathologyId === 'aortic-regurgitation') {
      // Early diastolic decrescendo murmur
      if (t > s2Time + 15 && t < cycleMs - 60) {
        const diaProg = (t - (s2Time + 15)) / (cycleMs - 60 - (s2Time + 15));
        const envelope = Math.exp(-diaProg * 3.2); // Decrescendo
        const noise = (Math.sin(t * 2.8) * 0.6 + Math.sin(t * 5.2) * 0.4);
        pcg += 0.85 * envelope * noise * highPitchFilter;
      }
    } else if (params.pathologyId === 'acute-asthma-wheeze') {
      // Continuous musical wheezing in expiration (diastolic phase in our cardiac cycle model)
      if (t > s2Time) {
        const wheeze = Math.sin(t * 0.95) * 0.7 + Math.sin(t * 1.6) * 0.5;
        pcg += 0.8 * wheeze * highPitchFilter;
      }
    }

    results.push({
      timeMs: Math.round(t),
      pcgAmplitude: parseFloat((pcg * netGain).toFixed(3)),
      ecgVoltageMv: parseFloat(ecg.toFixed(3))
    });
  }

  return results;
}
