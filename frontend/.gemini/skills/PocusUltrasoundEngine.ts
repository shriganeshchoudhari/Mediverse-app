/**
 * PocusUltrasoundEngine.ts
 * Advanced Point-of-Care Ultrasound (POCUS) & Emergency Sonography Simulation Engine.
 * Location: frontend/.gemini/skills/PocusUltrasoundEngine.ts
 *
 * Implements:
 * 1. Tissue Acoustic Physics (Acoustic Impedance Z = rho * c, Attenuation alpha * f * z, TGC 4-zone curves).
 * 2. 5 Statutory Emergency Acoustic Windows:
 *    - Subxiphoid 4-Chamber (Cardiac Tamponade vs Normal)
 *    - RUQ Morison's Pouch (Hepatorenal Free Fluid)
 *    - LUQ Splenorenal Recess (Splenic Free Fluid)
 *    - Pelvic Suprapubic (Pouch of Douglas / Retrovesical Hemoperitoneum)
 *    - Anterior Lung Pleura (Pleural Sliding, A-lines, B-lines, Barcode sign)
 * 3. 2D B-Mode Sector/Linear Geometry & M-Mode (Motion Mode) Temporal Sweeps.
 * 4. Caliper Euclidean Pixel-to-Millimeter Conversion.
 * 5. eFAST (Extended Focused Assessment with Sonography for Trauma) Protocol Evaluator.
 */

export type ProbeType = 
  | 'CURVILINEAR_ABDOMINAL'  // 2-5 MHz, wide fan sector, deep abdominal/pelvic
  | 'PHASED_ARRAY_CARDIAC'   // 1-5 MHz, narrow footprint, wedge sector, transthoracic
  | 'LINEAR_VASCULAR_LUNG';  // 5-12 MHz, high frequency, flat rectangular field, pleura/vessels

export type AcousticWindow =
  | 'CARDIAC_SUBXIPHOID'
  | 'RUQ_MORISONS_POUCH'
  | 'LUQ_SPLENORENAL'
  | 'PELVIC_SUPRAPUBIC'
  | 'LUNG_PLEURAL';

export type PocusPathology =
  | 'NORMAL'
  | 'HEMOPERITONEUM'
  | 'PERICARDIAL_EFFUSION_TAMPONADE'
  | 'PNEUMOTHORAX'
  | 'PULMONARY_EDEMA'
  | 'HYPOVOLEMIC_COLLAPSIBLE_IVC';

export interface UltrasoundSettings {
  gainDb: number;            // 20 to 90 dB, default 50
  depthCm: number;           // 4 to 24 cm
  frequencyMhz: number;      // 2.0 to 12.0 MHz
  dynamicRangeDb: number;    // 30 to 90 dB
  tgcNear: number;           // -10 to +10 dB
  tgcMid1: number;           // -10 to +10 dB
  tgcMid2: number;           // -10 to +10 dB
  tgcFar: number;            // -10 to +10 dB
  mode: 'B_MODE' | 'M_MODE';
  isFrozen: boolean;
  showGrid: boolean;
  caliperActive: boolean;
}

export interface CaliperPoint {
  x: number;
  y: number;
}

export interface CaliperMeasurement {
  start: CaliperPoint | null;
  end: CaliperPoint | null;
  distanceMm: number | null;
}

export interface AcousticStructure {
  id: string;
  name: string;
  type: 'parenchyma' | 'fluid' | 'bone_boundary' | 'pleura' | 'wall' | 'shadow';
  echogenicity: number; // 0.0 (pure anechoic black) to 1.0 (hyperechoic white)
  centerX: number;      // normalized 0.0 to 1.0
  centerY: number;      // normalized 0.0 to 1.0
  radiusX: number;
  radiusY: number;
  rotationRad?: number;
  isPathology?: boolean;
}

export interface AcousticWindowDefinition {
  id: AcousticWindow;
  name: string;
  clinicalPurpose: string;
  recommendedProbe: ProbeType;
  defaultDepthCm: number;
  defaultFrequencyMhz: number;
  structures: AcousticStructure[];
  pathologyStructures: Partial<Record<PocusPathology, AcousticStructure[]>>;
  normalDescription: string;
  pathologyDescriptions: Partial<Record<PocusPathology, string>>;
}

/**
 * Standard Ultrasound Acoustic Registry
 */
export const ACOUSTIC_WINDOWS: Record<AcousticWindow, AcousticWindowDefinition> = {
  CARDIAC_SUBXIPHOID: {
    id: 'CARDIAC_SUBXIPHOID',
    name: 'Cardiac Subxiphoid 4-Chamber (Subcostal)',
    clinicalPurpose: 'Rapid evaluation for pericardial effusion, cardiac tamponade, and right ventricular diastolic collapse.',
    recommendedProbe: 'PHASED_ARRAY_CARDIAC',
    defaultDepthCm: 18,
    defaultFrequencyMhz: 2.5,
    structures: [
      { id: 'liver_acoustic_window', name: 'Liver Acoustic Window', type: 'parenchyma', echogenicity: 0.45, centerX: 0.5, centerY: 0.22, radiusX: 0.38, radiusY: 0.12 },
      { id: 'pericardium_outer', name: 'Hyperechoic Pericardium', type: 'wall', echogenicity: 0.95, centerX: 0.5, centerY: 0.62, radiusX: 0.34, radiusY: 0.26 },
      { id: 'right_ventricle', name: 'Right Ventricle (RV)', type: 'fluid', echogenicity: 0.08, centerX: 0.42, centerY: 0.5, radiusX: 0.14, radiusY: 0.11 },
      { id: 'left_ventricle', name: 'Left Ventricle (LV)', type: 'fluid', echogenicity: 0.08, centerX: 0.6, centerY: 0.56, radiusX: 0.16, radiusY: 0.14 },
      { id: 'interventricular_septum', name: 'Interventricular Septum', type: 'wall', echogenicity: 0.65, centerX: 0.51, centerY: 0.53, radiusX: 0.04, radiusY: 0.13, rotationRad: 0.2 },
      { id: 'right_atrium', name: 'Right Atrium (RA)', type: 'fluid', echogenicity: 0.08, centerX: 0.38, centerY: 0.72, radiusX: 0.11, radiusY: 0.09 },
      { id: 'left_atrium', name: 'Left Atrium (LA)', type: 'fluid', echogenicity: 0.08, centerX: 0.58, centerY: 0.74, radiusX: 0.12, radiusY: 0.1 }
    ],
    pathologyStructures: {
      PERICARDIAL_EFFUSION_TAMPONADE: [
        { id: 'pericardial_fluid_effusion', name: 'Anechoic Pericardial Fluid (Effusion)', type: 'fluid', echogenicity: 0.02, centerX: 0.5, centerY: 0.62, radiusX: 0.37, radiusY: 0.29, isPathology: true },
        { id: 'rv_diastolic_collapse', name: 'RV Free Wall Inward Buckling', type: 'wall', echogenicity: 0.75, centerX: 0.44, centerY: 0.48, radiusX: 0.08, radiusY: 0.07, isPathology: true }
      ]
    },
    normalDescription: 'Liver serves as acoustic window. Four chambers clearly visible. Visceral and parietal pericardium are closely apposed without anechoic separation. Normal cardiac cycle contractility.',
    pathologyDescriptions: {
      PERICARDIAL_EFFUSION_TAMPONADE: 'Broad circumferential jet-black anechoic fluid separating the visceral and parietal pericardium. Diastolic indentation/buckling of the right ventricular free wall diagnostic of cardiac tamponade physiology.',
      HYPOVOLEMIC_COLLAPSIBLE_IVC: 'Hyperdynamic small LV chamber with near-total systolic cavity obliteration ("kissing papillary muscles"), reflecting extreme hypovolemic underfilling.'
    }
  },

  RUQ_MORISONS_POUCH: {
    id: 'RUQ_MORISONS_POUCH',
    name: 'Right Upper Quadrant (Morison\'s Pouch)',
    clinicalPurpose: 'Detect free intraperitoneal fluid/hemoperitoneum in the dependent hepatorenal recess during eFAST trauma exam.',
    recommendedProbe: 'CURVILINEAR_ABDOMINAL',
    defaultDepthCm: 16,
    defaultFrequencyMhz: 3.5,
    structures: [
      { id: 'liver_parenchyma', name: 'Liver Parenchyma (Segment VI/VII)', type: 'parenchyma', echogenicity: 0.48, centerX: 0.46, centerY: 0.36, radiusX: 0.32, radiusY: 0.22 },
      { id: 'diaphragm_right', name: 'Hyperechoic Diaphragmatic Stripe', type: 'pleura', echogenicity: 0.98, centerX: 0.46, centerY: 0.15, radiusX: 0.38, radiusY: 0.05, rotationRad: -0.1 },
      { id: 'right_kidney_cortex', name: 'Right Kidney Cortex', type: 'parenchyma', echogenicity: 0.38, centerX: 0.58, centerY: 0.68, radiusX: 0.2, radiusY: 0.22, rotationRad: 0.15 },
      { id: 'right_kidney_medulla', name: 'Renal Pyramids & Central Sinus', type: 'wall', echogenicity: 0.85, centerX: 0.6, centerY: 0.68, radiusX: 0.08, radiusY: 0.11, rotationRad: 0.15 },
      { id: 'hepatorenal_interface', name: 'Morison\'s Potential Space Interface', type: 'wall', echogenicity: 0.82, centerX: 0.49, centerY: 0.52, radiusX: 0.18, radiusY: 0.03, rotationRad: 0.18 }
    ],
    pathologyStructures: {
      HEMOPERITONEUM: [
        { id: 'morisons_free_fluid', name: 'Anechoic Free Fluid Strip (Morison\'s Pouch)', type: 'fluid', echogenicity: 0.02, centerX: 0.49, centerY: 0.52, radiusX: 0.22, radiusY: 0.06, rotationRad: 0.18, isPathology: true }
      ]
    },
    normalDescription: 'Liver and right kidney are in direct contact with a razor-thin hyperechoic interface line. No fluid pooling in the inferior hepatorenal pouch or subdiaphragmatic space.',
    pathologyDescriptions: {
      HEMOPERITONEUM: 'Prominent dark, anechoic fluid stripe dissecting between the liver capsule and right Gerota\'s fascia. Positive eFAST RUQ sign indicative of acute hemoperitoneum.'
    }
  },

  LUQ_SPLENORENAL: {
    id: 'LUQ_SPLENORENAL',
    name: 'Left Upper Quadrant (Splenorenal Recess)',
    clinicalPurpose: 'Examine for splenic laceration, subdiaphragmatic hemoperitoneum, and splenorenal fluid accumulation.',
    recommendedProbe: 'CURVILINEAR_ABDOMINAL',
    defaultDepthCm: 16,
    defaultFrequencyMhz: 3.5,
    structures: [
      { id: 'spleen_parenchyma', name: 'Spleen Parenchyma', type: 'parenchyma', echogenicity: 0.44, centerX: 0.42, centerY: 0.38, radiusX: 0.26, radiusY: 0.2 },
      { id: 'diaphragm_left', name: 'Left Diaphragmatic Line', type: 'pleura', echogenicity: 0.95, centerX: 0.42, centerY: 0.16, radiusX: 0.32, radiusY: 0.05, rotationRad: 0.12 },
      { id: 'left_kidney_cortex', name: 'Left Kidney Cortex', type: 'parenchyma', echogenicity: 0.36, centerX: 0.56, centerY: 0.68, radiusX: 0.19, radiusY: 0.22, rotationRad: -0.15 },
      { id: 'left_kidney_sinus', name: 'Left Kidney Central Echo Complex', type: 'wall', echogenicity: 0.88, centerX: 0.54, centerY: 0.68, radiusX: 0.07, radiusY: 0.1, rotationRad: -0.15 },
      { id: 'splenorenal_interface', name: 'Splenorenal Potential Space', type: 'wall', echogenicity: 0.78, centerX: 0.48, centerY: 0.52, radiusX: 0.16, radiusY: 0.03, rotationRad: -0.12 }
    ],
    pathologyStructures: {
      HEMOPERITONEUM: [
        { id: 'splenorenal_free_fluid', name: 'Subsplenic / Splenorenal Free Fluid', type: 'fluid', echogenicity: 0.02, centerX: 0.46, centerY: 0.48, radiusX: 0.2, radiusY: 0.06, rotationRad: -0.1, isPathology: true }
      ]
    },
    normalDescription: 'Smooth splenic crescent with homogenous ground-glass echotexture resting snugly against upper pole of left kidney. Intact subdiaphragmatic space without mirror artifact loss.',
    pathologyDescriptions: {
      HEMOPERITONEUM: 'Anechoic black fluid separating the splenic capsule from the diaphragm and upper pole of left kidney. High suspicion for splenic injury/capsular tear with hemoperitoneum.'
    }
  },

  PELVIC_SUPRAPUBIC: {
    id: 'PELVIC_SUPRAPUBIC',
    name: 'Pelvic / Suprapubic (Pouch of Douglas)',
    clinicalPurpose: 'Examine the most dependent peritoneal space in supine patients for free pelvic blood or collection.',
    recommendedProbe: 'CURVILINEAR_ABDOMINAL',
    defaultDepthCm: 16,
    defaultFrequencyMhz: 3.5,
    structures: [
      { id: 'urinary_bladder', name: 'Urinary Bladder (Acoustic Window)', type: 'fluid', echogenicity: 0.03, centerX: 0.5, centerY: 0.44, radiusX: 0.28, radiusY: 0.22 },
      { id: 'bladder_wall', name: 'Anterior Bladder Wall', type: 'wall', echogenicity: 0.82, centerX: 0.5, centerY: 0.21, radiusX: 0.26, radiusY: 0.03 },
      { id: 'posterior_enhancement', name: 'Posterior Acoustic Enhancement Zone', type: 'parenchyma', echogenicity: 0.62, centerX: 0.5, centerY: 0.75, radiusX: 0.26, radiusY: 0.14 },
      { id: 'prostate_uterus', name: 'Prostate / Uterine Viscus', type: 'parenchyma', echogenicity: 0.48, centerX: 0.5, centerY: 0.72, radiusX: 0.16, radiusY: 0.1 }
    ],
    pathologyStructures: {
      HEMOPERITONEUM: [
        { id: 'pouch_of_douglas_fluid', name: 'Retrovesical / Douglas Free Fluid', type: 'fluid', echogenicity: 0.02, centerX: 0.5, centerY: 0.85, radiusX: 0.22, radiusY: 0.07, isPathology: true }
      ]
    },
    normalDescription: 'Distended bladder forms an anechoic triangle or rounded acoustic window with brilliant posterior enhancement. Clear retrovesical/pouch of Douglas planes.',
    pathologyDescriptions: {
      HEMOPERITONEUM: 'Irregular dark fluid pocket pooling postero-superior to the bladder dome and filling the rectovesical/Douglas recess.'
    }
  },

  LUNG_PLEURAL: {
    id: 'LUNG_PLEURAL',
    name: 'Anterior Thoracic / Pleural Zone',
    clinicalPurpose: 'Diagnose pneumothorax (absence of pleural sliding, barcode sign), pulmonary edema (B-lines), and consolidation.',
    recommendedProbe: 'LINEAR_VASCULAR_LUNG',
    defaultDepthCm: 6,
    defaultFrequencyMhz: 10.0,
    structures: [
      { id: 'chest_wall_muscles', name: 'Intercostal Musculature & Subcutaneous Fat', type: 'parenchyma', echogenicity: 0.32, centerX: 0.5, centerY: 0.15, radiusX: 0.45, radiusY: 0.08 },
      { id: 'rib_left', name: 'Upper Rib Cortical Shadow', type: 'bone_boundary', echogenicity: 0.98, centerX: 0.25, centerY: 0.28, radiusX: 0.09, radiusY: 0.05 },
      { id: 'rib_left_shadow', name: 'Left Rib Acoustic Shadow', type: 'shadow', echogenicity: 0.02, centerX: 0.25, centerY: 0.65, radiusX: 0.09, radiusY: 0.32 },
      { id: 'rib_right', name: 'Lower Rib Cortical Shadow', type: 'bone_boundary', echogenicity: 0.98, centerX: 0.75, centerY: 0.28, radiusX: 0.09, radiusY: 0.05 },
      { id: 'rib_right_shadow', name: 'Right Rib Acoustic Shadow', type: 'shadow', echogenicity: 0.02, centerX: 0.75, centerY: 0.65, radiusX: 0.09, radiusY: 0.32 },
      { id: 'pleural_line', name: 'Hyperechoic Pleural Line ("Bat Sign")', type: 'pleura', echogenicity: 0.98, centerX: 0.5, centerY: 0.34, radiusX: 0.28, radiusY: 0.015 },
      { id: 'a_line_1', name: 'A-Line 1 (Horizontal Reverberation Artifact)', type: 'wall', echogenicity: 0.52, centerX: 0.5, centerY: 0.55, radiusX: 0.24, radiusY: 0.012 },
      { id: 'a_line_2', name: 'A-Line 2 (Deep Reverberation Artifact)', type: 'wall', echogenicity: 0.34, centerX: 0.5, centerY: 0.76, radiusX: 0.22, radiusY: 0.01 }
    ],
    pathologyStructures: {
      PNEUMOTHORAX: [
        { id: 'ptx_static_pleura', name: 'Stationary Pleura with Complete Loss of Sliding', type: 'pleura', echogenicity: 1.0, centerX: 0.5, centerY: 0.34, radiusX: 0.28, radiusY: 0.02, isPathology: true }
      ],
      PULMONARY_EDEMA: [
        { id: 'b_line_rocket_1', name: 'Laser-like B-Line Rocket 1', type: 'wall', echogenicity: 0.92, centerX: 0.42, centerY: 0.66, radiusX: 0.015, radiusY: 0.32, isPathology: true },
        { id: 'b_line_rocket_2', name: 'Laser-like B-Line Rocket 2', type: 'wall', echogenicity: 0.95, centerX: 0.52, centerY: 0.66, radiusX: 0.018, radiusY: 0.32, isPathology: true },
        { id: 'b_line_rocket_3', name: 'Laser-like B-Line Rocket 3', type: 'wall', echogenicity: 0.9, centerX: 0.61, centerY: 0.66, radiusX: 0.016, radiusY: 0.32, isPathology: true }
      ]
    },
    normalDescription: 'Classical "Bat Sign" between two adjacent ribs. Glistening, shimmering pleural sliding synchronised with breathing. Repetitive horizontal A-lines signify normal aerated lung.',
    pathologyDescriptions: {
      PNEUMOTHORAX: 'Total abolition of lung sliding. Parietal and visceral pleura separated by intrapleural air, obliterating acoustic transmission. M-mode will exhibit the diagnostic "Barcode / Stratosphere" sign.',
      PULMONARY_EDEMA: 'Multiple (>3 per rib space) vertical, laser-like, well-defined hyperechoic B-lines ("lung rockets") originating from the pleural line and traversing to bottom of screen, extinguishing A-lines. Indicates alveolar-interstitial syndrome.'
    }
  }
};

/**
 * Compute overall acoustic gain factor across depth using exponential tissue attenuation
 * and 4-zone Time-Gain Compensation (TGC).
 */
export function computeAcousticGain(depthFraction: number, settings: UltrasoundSettings): number {
  const clampedDepth = Math.max(0, Math.min(1, depthFraction));
  
  // Base gain linear multiplier (gainDb from 20 to 90 dB)
  const baseGainFactor = Math.pow(10, (settings.gainDb - 50) / 30);

  // Frequency-dependent tissue attenuation (dB loss)
  const attenuationDb = 0.5 * (settings.frequencyMhz / 3.5) * (settings.depthCm * clampedDepth);
  const attenuationFactor = Math.pow(10, -attenuationDb / 20);

  // 4-zone Time-Gain Compensation interpolation
  let tgcDb = 0;
  if (clampedDepth <= 0.25) {
    const t = clampedDepth / 0.25;
    tgcDb = settings.tgcNear * (1 - t) + settings.tgcMid1 * t;
  } else if (clampedDepth <= 0.5) {
    const t = (clampedDepth - 0.25) / 0.25;
    tgcDb = settings.tgcMid1 * (1 - t) + settings.tgcMid2 * t;
  } else if (clampedDepth <= 0.75) {
    const t = (clampedDepth - 0.5) / 0.25;
    tgcDb = settings.tgcMid2 * (1 - t) + settings.tgcFar * t;
  } else {
    tgcDb = settings.tgcFar;
  }
  const tgcFactor = Math.pow(10, tgcDb / 20);

  return Math.max(0.05, Math.min(2.5, baseGainFactor * attenuationFactor * tgcFactor));
}

/**
 * Calculates Euclidean real-world distance in millimeters between two canvas points
 * using the calibrated ultrasound machine depth setting.
 */
export function calculateCaliperDistance(
  p1: CaliperPoint,
  p2: CaliperPoint,
  canvasHeight: number,
  depthCm: number
): number {
  if (canvasHeight <= 0 || depthCm <= 0) return 0;

  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const pixelDistance = Math.sqrt(dx * dx + dy * dy);

  // Depth in mm = depthCm * 10
  const mmPerPixel = (depthCm * 10) / canvasHeight;
  const distanceMm = pixelDistance * mmPerPixel;

  return Math.round(distanceMm * 10) / 10;
}

export interface MModeSweepPoint {
  depthFraction: number; // 0.0 (top) to 1.0 (bottom)
  intensity: number;     // 0 to 255
}

/**
 * Synthesize M-Mode (Motion Mode) 1D beam strip over time.
 */
export function generateMModeColumn(
  window: AcousticWindow,
  pathology: PocusPathology,
  elapsedTimeSec: number,
  samplesCount: number = 120
): MModeSweepPoint[] {
  const points: MModeSweepPoint[] = [];

  for (let i = 0; i < samplesCount; i++) {
    const depthFrac = i / (samplesCount - 1);
    let intensity = 0;

    if (window === 'LUNG_PLEURAL') {
      if (pathology === 'PNEUMOTHORAX') {
        // Barcode / Stratosphere sign: all horizontal laminar stripes throughout
        const barPattern = Math.sin(depthFrac * 85) > 0 ? 180 : 40;
        intensity = barPattern + Math.floor(Math.sin(depthFrac * 22) * 30);
      } else {
        // Normal Seashore sign:
        if (depthFrac < 0.35) {
          intensity = (Math.sin(depthFrac * 70) > 0.2 ? 160 : 35);
        } else if (Math.abs(depthFrac - 0.35) < 0.02) {
          intensity = 250;
        } else {
          // Below pleura: sandy, granular speckle from sliding lung parenchyma
          const pseudoNoise = Math.sin(depthFrac * 230 + elapsedTimeSec * 15) * 
                              Math.cos(depthFrac * 90 - elapsedTimeSec * 10);
          intensity = Math.floor(60 + Math.abs(pseudoNoise) * 110);
        }
      }
    } else if (window === 'CARDIAC_SUBXIPHOID') {
      const heartRateFreq = 1.25 * 2 * Math.PI;
      const rvMotion = Math.sin(elapsedTimeSec * heartRateFreq) * 0.04;
      const lvMotion = Math.cos(elapsedTimeSec * heartRateFreq) * 0.06;

      if (Math.abs(depthFrac - (0.42 + rvMotion)) < 0.02) {
        intensity = 220; // RV free wall
      } else if (Math.abs(depthFrac - (0.55 + lvMotion)) < 0.025) {
        intensity = 240; // Septum
      } else if (Math.abs(depthFrac - (0.75 - lvMotion)) < 0.02) {
        intensity = 230; // Posterior LV wall
      } else if (pathology === 'PERICARDIAL_EFFUSION_TAMPONADE' && depthFrac > 0.8) {
        intensity = 15; // Anechoic fluid behind heart
      } else {
        intensity = 25; // Blood cavity
      }
    } else {
      const respMotion = Math.sin(elapsedTimeSec * 0.4 * 2 * Math.PI) * 0.02;
      intensity = Math.floor(40 + (Math.sin((depthFrac + respMotion) * 35) + 1) * 60);
    }

    points.push({
      depthFraction: depthFrac,
      intensity: Math.max(0, Math.min(255, intensity))
    });
  }

  return points;
}

export interface EfastStep {
  window: AcousticWindow;
  title: string;
  anatomicalTarget: string;
  expectedNormal: string;
  positiveSign: string;
}

export const EFAST_CHECKLIST_STEPS: EfastStep[] = [
  {
    window: 'RUQ_MORISONS_POUCH',
    title: '1. RUQ / Morison\'s Pouch',
    anatomicalTarget: 'Hepatorenal space, inferior liver tip, right diaphragm',
    expectedNormal: 'No free fluid between liver and right kidney',
    positiveSign: 'Anechoic black fluid stripe in Morison\'s pouch (Hemoperitoneum)'
  },
  {
    window: 'CARDIAC_SUBXIPHOID',
    title: '2. Subxiphoid 4-Chamber View',
    anatomicalTarget: 'Pericardial sac, RV, LV, IVC caliber',
    expectedNormal: 'Visceral and parietal pericardium apposed',
    positiveSign: 'Pericardial effusion, RV diastolic collapse (Cardiac Tamponade)'
  },
  {
    window: 'LUQ_SPLENORENAL',
    title: '3. LUQ / Splenorenal Recess',
    anatomicalTarget: 'Splenorenal interface, subdiaphragmatic space',
    expectedNormal: 'Intact spleen-kidney interface without separation',
    positiveSign: 'Anechoic fluid in splenorenal recess or subphrenic space'
  },
  {
    window: 'PELVIC_SUPRAPUBIC',
    title: '4. Pelvic / Suprapubic View',
    anatomicalTarget: 'Retrovesical pouch (men), Pouch of Douglas (women)',
    expectedNormal: 'Anechoic bladder with clear surrounding planes',
    positiveSign: 'Free fluid pooling behind or above bladder dome'
  },
  {
    window: 'LUNG_PLEURAL',
    title: '5. Anterior Lung / Thoracic Apex',
    anatomicalTarget: 'Pleural line between ribs 2-4',
    expectedNormal: 'Pleural sliding with seashore sign on M-mode and A-lines',
    positiveSign: 'Loss of lung sliding, barcode sign on M-mode (Pneumothorax)'
  }
];

export interface EfastEvaluationReport {
  isComplete: boolean;
  totalViewsAssessed: number;
  totalViewsRequired: number;
  passedEvaluation: boolean;
  scorePercentage: number;
  accuracy: 'ACCURATE' | 'INCORRECT' | 'PARTIAL';
  clinicalSummary: string;
  recommendations: string[];
}

export function evaluateEfastSession(
  assessedWindows: Set<AcousticWindow>,
  userDiagnosis: string,
  actualPathology: PocusPathology
): EfastEvaluationReport {
  const totalViewsRequired = EFAST_CHECKLIST_STEPS.length;
  const totalViewsAssessed = assessedWindows.size;
  const isComplete = totalViewsAssessed >= totalViewsRequired;

  let accuracy: 'ACCURATE' | 'INCORRECT' | 'PARTIAL' = 'INCORRECT';
  let passedEvaluation = false;
  let scorePercentage = 0;

  const userDiagLower = userDiagnosis.toLowerCase();

  const isPositiveCase = actualPathology !== 'NORMAL';
  const userClaimedPositive = userDiagLower.includes('positive') || 
                              userDiagLower.includes('hemoperitoneum') || 
                              userDiagLower.includes('tamponade') || 
                              userDiagLower.includes('pneumothorax') || 
                              userDiagLower.includes('effusion');

  if (actualPathology === 'NORMAL' && !userClaimedPositive && (userDiagLower.includes('normal') || userDiagLower.includes('negative'))) {
    accuracy = 'ACCURATE';
  } else if (actualPathology === 'HEMOPERITONEUM' && (userDiagLower.includes('hemoperitoneum') || userDiagLower.includes('fluid') || userDiagLower.includes('positive'))) {
    accuracy = 'ACCURATE';
  } else if (actualPathology === 'PERICARDIAL_EFFUSION_TAMPONADE' && (userDiagLower.includes('tamponade') || userDiagLower.includes('pericardial') || userDiagLower.includes('effusion'))) {
    accuracy = 'ACCURATE';
  } else if (actualPathology === 'PNEUMOTHORAX' && (userDiagLower.includes('pneumothorax') || userDiagLower.includes('ptx') || userDiagLower.includes('barcode'))) {
    accuracy = 'ACCURATE';
  } else if (isComplete && userClaimedPositive === isPositiveCase) {
    accuracy = 'PARTIAL';
  }

  // Scoring: 50% for completing all views + 50% for correct diagnosis
  const completenessScore = Math.min(50, (totalViewsAssessed / totalViewsRequired) * 50);
  const diagScore = accuracy === 'ACCURATE' ? 50 : accuracy === 'PARTIAL' ? 25 : 0;
  scorePercentage = Math.round(completenessScore + diagScore);
  passedEvaluation = scorePercentage >= 75;

  const recommendations: string[] = [];
  if (totalViewsAssessed < totalViewsRequired) {
    recommendations.push(`Complete all ${totalViewsRequired} standard eFAST windows before declaring definitive disposition.`);
  }
  if (accuracy !== 'ACCURATE') {
    recommendations.push(`Review acoustic window differences for ${actualPathology}. Look closely for anechoic striping or M-mode dynamics.`);
  } else {
    recommendations.push('Excellent sonographic diagnosis. Immediate correlation with trauma resuscitation algorithm warranted.');
  }

  return {
    isComplete,
    totalViewsAssessed,
    totalViewsRequired,
    passedEvaluation,
    scorePercentage,
    accuracy,
    clinicalSummary: `Candidate examined ${totalViewsAssessed}/${totalViewsRequired} windows. Diagnosis evaluated as ${accuracy} for scenario: ${actualPathology}.`,
    recommendations
  };
}
