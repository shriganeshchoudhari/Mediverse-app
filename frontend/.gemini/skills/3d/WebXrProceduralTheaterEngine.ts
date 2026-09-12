/**
 * WebXrProceduralTheaterEngine.ts
 * Biophysical, Multiplanar Ultrasound Acoustics & 6-DoF Needle Trajectory Kinematics Engine
 * Location: frontend/.gemini/skills/3d/WebXrProceduralTheaterEngine.ts
 */

export type ProcedureScenarioId = 'IJV_CENTRAL_LINE' | 'PERICARDIOCENTESIS' | 'LUMBAR_PUNCTURE';

export interface SpatialVector3 {
  x: number;
  y: number;
  z: number;
}

export interface UltrasoundProbeState {
  position: SpatialVector3;
  rotationDeg: number; // probe axial rotation (0 = transverse/short axis, 90 = longitudinal/long axis)
  tiltAngleDeg: number; // forward/backward tilt
  compressionMm: number; // 0 to 8 mm tissue compression by probe pressure
  depthCm: number; // 3 to 10 cm display depth
  gain: number; // 0 to 100%
  colorDoppler: boolean;
}

export interface NeedleTrajectoryState {
  entryPoint: SpatialVector3;
  angleDeg: number; // insertion angle relative to skin surface (e.g. 30-45 deg)
  azimuthDeg: number; // directional heading (-45 to +45 deg)
  depthMm: number; // penetration depth in millimeters
  isAspirating: boolean; // syringe plunger drawn back
}

export type PunctureStatus =
  | 'SKIN_CONTACT'
  | 'SUBCUTANEOUS_TISSUE'
  | 'TARGET_LUMEN_SUCCESS'
  | 'POSTERIOR_WALL_TRANSFIXION'
  | 'CRITICAL_ARTERY_PUNCTURE'
  | 'PERICARDIAL_ASPIRATION_SUCCESS'
  | 'MYOCARDIAL_INJURY'
  | 'SUBARACHNOID_CSF_FLOW'
  | 'PERIOSTEAL_BONE_CONTACT'
  | 'PNEUMOTHORAX_RISK';

export interface ProceduralFeedback {
  punctureStatus: PunctureStatus;
  targetDistanceMm: number; // Distance from needle tip to target center
  needleTipPos: SpatialVector3;
  flashbackActive: boolean;
  flashbackType: 'NONE' | 'VENOUS_DARK_RED' | 'ARTERIAL_PULSATILE_BRIGHT' | 'PERICARDIAL_SEROSANGUINOUS' | 'CLEAR_CSF';
  resistanceForceN: number; // Force in Newtons (tactile haptic curve)
  hasResistanceDrop: boolean; // "Pop" / Loss of resistance event
  hemodynamicDelta: {
    mapChangeMmHg: number;
    hrChangeBpm: number;
    cardiacOutputDeltaLMin: number;
  };
  safetyWarning?: string;
}

export interface UltrasoundCrossSectionData {
  scenarioId: ProcedureScenarioId;
  probeMode: 'TRANSVERSE_SHORT_AXIS' | 'LONGITUDINAL_LONG_AXIS';
  structures: Array<{
    name: string;
    type: 'VEIN' | 'ARTERY' | 'EFFUSION' | 'MYOCARDIUM' | 'BONE' | 'LIGAMENT' | 'NEEDLE';
    centerNorm: { x: number; y: number }; // 0 to 1 normalized canvas coords
    radiusXNorm: number;
    radiusYNorm: number;
    isPulsatile: boolean;
    isCompressed: boolean;
    flowVelocityCmS?: number; // For Doppler
    echogenicity: 'ANECHOIC' | 'HYPOECHOIC' | 'HYPERECHOIC' | 'ACOUSTIC_SHADOW';
  }>;
  needleVisibleInPlane: boolean;
  needleTipCoordsNorm?: { x: number; y: number };
}

export interface ProcedureScenarioConfig {
  id: ProcedureScenarioId;
  name: string;
  category: 'VASCULAR_ACCESS' | 'CRITICAL_CARE' | 'NEURAXIAL';
  targetStructure: string;
  idealAngleRangeDeg: [number, number];
  idealDepthRangeMm: [number, number];
  anatomicalDescription: string;
  keySafetyRules: string[];
}

export const PROCEDURE_SCENARIOS: Record<ProcedureScenarioId, ProcedureScenarioConfig> = {
  IJV_CENTRAL_LINE: {
    id: 'IJV_CENTRAL_LINE',
    name: 'Ultrasound-Guided Right Internal Jugular Vein (IJV) CVC',
    category: 'VASCULAR_ACCESS',
    targetStructure: 'Right Internal Jugular Vein',
    idealAngleRangeDeg: [30, 45],
    idealDepthRangeMm: [15, 25],
    anatomicalDescription:
      'The Right IJV lies anterolateral to the Common Carotid Artery beneath the apex of the triangle formed by the sternal and clavicular heads of the sternocleidomastoid muscle. The vein is thin-walled and fully compressible with probe pressure.',
    keySafetyRules: [
      'Maintain continuous real-time ultrasound needle tip tracking.',
      'Differentiate compressible IJV from non-compressible, pulsatile Common Carotid Artery.',
      'Avoid over-penetration (> 30 mm) to prevent posterior wall transfixion and pneumothorax.',
    ],
  },
  PERICARDIOCENTESIS: {
    id: 'PERICARDIOCENTESIS',
    name: 'Emergency Subxiphoid Ultrasound-Guided Pericardiocentesis',
    category: 'CRITICAL_CARE',
    targetStructure: 'Pericardial Effusion Space',
    idealAngleRangeDeg: [15, 30],
    idealDepthRangeMm: [35, 50],
    anatomicalDescription:
      'Under the infrasternal angle between the xiphoid process and left costal margin, the needle is angled 15-30 degrees toward the left shoulder to enter the anterior/inferior pericardial fluid stripe while avoiding liver and lung parenchyma.',
    keySafetyRules: [
      'Advance with continuous negative syringe aspiration.',
      'Stop needle advancement immediately upon dark serosanguinous flashback.',
      'Avoid advancing into the right ventricular myocardium (ECG ST elevation / premature ventricular complexes).',
    ],
  },
  LUMBAR_PUNCTURE: {
    id: 'LUMBAR_PUNCTURE',
    name: 'Ultrasound-Assisted Lumbar Puncture (L3-L4 / L4-L5)',
    category: 'NEURAXIAL',
    targetStructure: 'Lumbar Subarachnoid Space (CSF)',
    idealAngleRangeDeg: [5, 15],
    idealDepthRangeMm: [45, 65],
    anatomicalDescription:
      'Inserted in the midline through the intervertebral space below the termination of the conus medullaris (L1-L2). Traverses supraspinous, interspinous, and ligamentum flavum into the thecal sac.',
    keySafetyRules: [
      'Feel for the distinct tactile "pop" of the ligamentum flavum.',
      'Confirm clear, non-bloody, pulsatile cerebrospinal fluid (CSF) flow.',
      'Direct needle slightly cephalad (10-15 degrees) toward patient umbilicus.',
    ],
  },
};

/**
 * Computes real-time 2D multiplanar ultrasound cross-section
 */
export function computeUltrasoundCrossSection(
  scenarioId: ProcedureScenarioId,
  probe: UltrasoundProbeState,
  needle: NeedleTrajectoryState
): UltrasoundCrossSectionData {
  const isTransverse = Math.abs(probe.rotationDeg % 180) < 45 || Math.abs(probe.rotationDeg % 180) > 135;
  const probeMode = isTransverse ? 'TRANSVERSE_SHORT_AXIS' : 'LONGITUDINAL_LONG_AXIS';
  const compressionRatio = Math.max(0, Math.min(1, probe.compressionMm / 6.0));

  const structures: UltrasoundCrossSectionData['structures'] = [];

  if (scenarioId === 'IJV_CENTRAL_LINE') {
    // 1. Right Internal Jugular Vein (lateral, compressible)
    const ijvRadiusY = Math.max(0.02, 0.12 * (1 - compressionRatio * 0.85));
    structures.push({
      name: 'Internal Jugular Vein (IJV)',
      type: 'VEIN',
      centerNorm: { x: 0.42, y: 0.45 },
      radiusXNorm: 0.14,
      radiusYNorm: ijvRadiusY,
      isPulsatile: false,
      isCompressed: compressionRatio > 0.4,
      flowVelocityCmS: -18.5, // Toward heart (blue Doppler)
      echogenicity: 'ANECHOIC',
    });

    // 2. Common Carotid Artery (medial, non-compressible, pulsatile)
    structures.push({
      name: 'Common Carotid Artery (CCA)',
      type: 'ARTERY',
      centerNorm: { x: 0.68, y: 0.48 },
      radiusXNorm: 0.10,
      radiusYNorm: 0.10,
      isPulsatile: true,
      isCompressed: false, // Artery resists probe compression
      flowVelocityCmS: 45.0, // Toward head (red Doppler)
      echogenicity: 'ANECHOIC',
    });

    // 3. Sternocleidomastoid Muscle (superficial)
    structures.push({
      name: 'Sternocleidomastoid Muscle',
      type: 'LIGAMENT',
      centerNorm: { x: 0.50, y: 0.18 },
      radiusXNorm: 0.45,
      radiusYNorm: 0.08,
      isPulsatile: false,
      isCompressed: false,
      echogenicity: 'HYPOECHOIC',
    });
  } else if (scenarioId === 'PERICARDIOCENTESIS') {
    // 1. Pericardial Effusion Fluid Stripe
    structures.push({
      name: 'Pericardial Effusion',
      type: 'EFFUSION',
      centerNorm: { x: 0.50, y: 0.42 },
      radiusXNorm: 0.38,
      radiusYNorm: 0.16,
      isPulsatile: false,
      isCompressed: false,
      echogenicity: 'ANECHOIC',
    });

    // 2. Right Ventricular Free Wall & Cavity
    structures.push({
      name: 'Right Ventricular Myocardium',
      type: 'MYOCARDIUM',
      centerNorm: { x: 0.50, y: 0.68 },
      radiusXNorm: 0.32,
      radiusYNorm: 0.14,
      isPulsatile: true,
      isCompressed: false,
      echogenicity: 'HYPOECHOIC',
    });
  } else if (scenarioId === 'LUMBAR_PUNCTURE') {
    // 1. Superior Spinous Process (bone shadow)
    structures.push({
      name: 'L3 Spinous Process',
      type: 'BONE',
      centerNorm: { x: 0.50, y: 0.22 },
      radiusXNorm: 0.22,
      radiusYNorm: 0.08,
      isPulsatile: false,
      isCompressed: false,
      echogenicity: 'ACOUSTIC_SHADOW',
    });

    // 2. Ligamentum Flavum
    structures.push({
      name: 'Ligamentum Flavum',
      type: 'LIGAMENT',
      centerNorm: { x: 0.50, y: 0.52 },
      radiusXNorm: 0.18,
      radiusYNorm: 0.04,
      isPulsatile: false,
      isCompressed: false,
      echogenicity: 'HYPERECHOIC',
    });

    // 3. Subarachnoid Thecal Sac (CSF)
    structures.push({
      name: 'Thecal Sac (Subarachnoid Space)',
      type: 'EFFUSION',
      centerNorm: { x: 0.50, y: 0.64 },
      radiusXNorm: 0.20,
      radiusYNorm: 0.10,
      isPulsatile: false,
      isCompressed: false,
      echogenicity: 'ANECHOIC',
    });
  }

  // Determine if needle is visible in this ultrasound plane
  const needleDepthNorm = Math.min(1.0, needle.depthMm / (probe.depthCm * 10));
  const needleInPlane = needle.depthMm > 2 && Math.abs(needle.azimuthDeg) < 30;
  const needleTipCoordsNorm = needleInPlane
    ? {
        x: 0.50 + Math.sin((needle.azimuthDeg * Math.PI) / 180) * 0.3,
        y: 0.1 + needleDepthNorm * 0.8,
      }
    : undefined;

  return {
    scenarioId,
    probeMode,
    structures,
    needleVisibleInPlane: needleInPlane,
    needleTipCoordsNorm,
  };
}

/**
 * Evaluates needle penetration trajectory and safety outcome
 */
export function evaluateNeedleTrajectory(
  scenarioId: ProcedureScenarioId,
  needle: NeedleTrajectoryState
): ProceduralFeedback {
  const depth = needle.depthMm;
  const angle = needle.angleDeg;
  const azimuth = needle.azimuthDeg;

  // Calculate tip position in coordinate frame
  const radAngle = (angle * Math.PI) / 180;
  const radAzimuth = (azimuth * Math.PI) / 180;
  const tipX = needle.entryPoint.x + depth * Math.sin(radAzimuth) * Math.cos(radAngle);
  const tipY = needle.entryPoint.y - depth * Math.sin(radAngle);
  const tipZ = needle.entryPoint.z + depth * Math.cos(radAzimuth) * Math.cos(radAngle);

  const needleTipPos: SpatialVector3 = {
    x: Number(tipX.toFixed(2)),
    y: Number(tipY.toFixed(2)),
    z: Number(tipZ.toFixed(2)),
  };

  // Base resistance force
  let resistanceForceN = 0.5;
  let hasResistanceDrop = false;
  let punctureStatus: PunctureStatus = 'SKIN_CONTACT';
  let flashbackActive = false;
  let flashbackType: ProceduralFeedback['flashbackType'] = 'NONE';
  let targetDistanceMm = 20;
  let safetyWarning: string | undefined = undefined;

  const hemodynamicDelta = {
    mapChangeMmHg: 0,
    hrChangeBpm: 0,
    cardiacOutputDeltaLMin: 0,
  };

  if (scenarioId === 'IJV_CENTRAL_LINE') {
    // Target: IJV at depth 15-25mm, azimuth 0-10 deg
    const targetDepth = 20;
    targetDistanceMm = Math.abs(depth - targetDepth) + Math.abs(azimuth - 5) * 0.8;

    if (depth < 4) {
      punctureStatus = 'SKIN_CONTACT';
      resistanceForceN = 1.8;
    } else if (depth < 14) {
      punctureStatus = 'SUBCUTANEOUS_TISSUE';
      resistanceForceN = 2.4;
    } else if (depth >= 14 && depth <= 26 && azimuth >= -10 && azimuth <= 15) {
      // Successful IJV entry
      punctureStatus = 'TARGET_LUMEN_SUCCESS';
      resistanceForceN = 0.4;
      hasResistanceDrop = true;
      if (needle.isAspirating) {
        flashbackActive = true;
        flashbackType = 'VENOUS_DARK_RED';
      }
    } else if (azimuth > 18 && depth >= 14) {
      // Medial deviation into Common Carotid Artery
      punctureStatus = 'CRITICAL_ARTERY_PUNCTURE';
      resistanceForceN = 0.6;
      flashbackActive = true;
      flashbackType = 'ARTERIAL_PULSATILE_BRIGHT';
      safetyWarning = 'CRITICAL COMPLICATION: Accidental Carotid Artery Puncture! Immediate pressure required.';
      hemodynamicDelta.mapChangeMmHg = -10;
      hemodynamicDelta.hrChangeBpm = 15;
    } else if (depth > 28) {
      // Overpenetration through back wall
      punctureStatus = 'POSTERIOR_WALL_TRANSFIXION';
      resistanceForceN = 3.2;
      safetyWarning = 'WARNING: Needle penetrated posterior wall of IJV. Risk of hematoma or cervical nerve injury.';
    }
  } else if (scenarioId === 'PERICARDIOCENTESIS') {
    // Target: Pericardial effusion at depth 35-50mm
    const targetDepth = 42;
    targetDistanceMm = Math.abs(depth - targetDepth) + Math.abs(azimuth) * 0.6;

    if (depth < 15) {
      punctureStatus = 'SUBCUTANEOUS_TISSUE';
      resistanceForceN = 2.5;
    } else if (depth >= 35 && depth <= 48 && Math.abs(azimuth) <= 15) {
      // Successful pericardial entry
      punctureStatus = 'PERICARDIAL_ASPIRATION_SUCCESS';
      resistanceForceN = 0.5;
      hasResistanceDrop = true;
      if (needle.isAspirating) {
        flashbackActive = true;
        flashbackType = 'PERICARDIAL_SEROSANGUINOUS';
        // Hemodynamic decompression relief
        hemodynamicDelta.mapChangeMmHg = 18;
        hemodynamicDelta.hrChangeBpm = -16;
        hemodynamicDelta.cardiacOutputDeltaLMin = 1.2;
      }
    } else if (depth > 50) {
      // Penetration into myocardium
      punctureStatus = 'MYOCARDIAL_INJURY';
      resistanceForceN = 3.8;
      flashbackActive = true;
      flashbackType = 'ARTERIAL_PULSATILE_BRIGHT';
      safetyWarning = 'CRITICAL: Needle tip entered right ventricular myocardium! Withdraw needle immediately.';
      hemodynamicDelta.mapChangeMmHg = -25;
      hemodynamicDelta.hrChangeBpm = 28;
    }
  } else if (scenarioId === 'LUMBAR_PUNCTURE') {
    // Target: Subarachnoid space at depth 45-60mm
    const targetDepth = 52;
    targetDistanceMm = Math.abs(depth - targetDepth) + Math.abs(azimuth) * 1.2;

    if (depth < 25) {
      punctureStatus = 'SUBCUTANEOUS_TISSUE';
      resistanceForceN = 2.2;
    } else if (depth >= 25 && depth < 44) {
      // Dense ligamentum flavum
      resistanceForceN = 5.6;
    } else if (depth >= 45 && depth <= 58 && Math.abs(azimuth) <= 10) {
      // Dural puncture & CSF flow
      punctureStatus = 'SUBARACHNOID_CSF_FLOW';
      resistanceForceN = 0.3;
      hasResistanceDrop = true; // Classic dural "pop"
      flashbackActive = true;
      flashbackType = 'CLEAR_CSF';
    } else if (Math.abs(azimuth) > 15 && depth > 30) {
      // Lateral bony lamina contact
      punctureStatus = 'PERIOSTEAL_BONE_CONTACT';
      resistanceForceN = 9.0;
      safetyWarning = 'Needle contacted vertebral lamina bone. Re-orient needle to midline.';
    }
  }

  return {
    punctureStatus,
    targetDistanceMm: Number(targetDistanceMm.toFixed(1)),
    needleTipPos,
    flashbackActive,
    flashbackType,
    resistanceForceN: Number(resistanceForceN.toFixed(1)),
    hasResistanceDrop,
    hemodynamicDelta,
    safetyWarning,
  };
}

/**
 * Computes cumulative procedural accuracy and competency score
 */
export function computeProceduralCompetencyScore(params: {
  scenarioId: ProcedureScenarioId;
  attemptsCount: number;
  bestTargetDistanceMm: number;
  hasArterialPuncture: boolean;
  hasPosteriorTransfixion: boolean;
  aspiratedSuccessfully: boolean;
  timeTakenSec: number;
}): {
  score: number; // 0-100
  grade: 'A+' | 'A' | 'B' | 'C' | 'FAIL';
  feedbackItems: string[];
} {
  let score = 100;
  const feedbackItems: string[] = [];

  // Critical safety penalty
  if (params.hasArterialPuncture) {
    score -= 45;
    feedbackItems.push('Major safety violation: Inadvertent arterial puncture occurred.');
  }

  if (params.hasPosteriorTransfixion) {
    score -= 15;
    feedbackItems.push('Technique flaw: Posterior wall transfixion indicates excessive depth without needle tip tracking.');
  }

  // Target proximity
  if (params.bestTargetDistanceMm < 2.0) {
    feedbackItems.push('Excellent trajectory precision: Needle tip placed directly within target lumen center.');
  } else if (params.bestTargetDistanceMm < 5.0) {
    score -= 8;
    feedbackItems.push('Good trajectory precision within acceptable margins.');
  } else {
    score -= 25;
    feedbackItems.push('Suboptimal precision: Needle deviated from target center axis.');
  }

  // Aspiration confirmation
  if (params.aspiratedSuccessfully) {
    feedbackItems.push('Verified free aspiration of fluid/blood prior to wire advancement.');
  } else {
    score -= 20;
    feedbackItems.push('Missed step: Did not verify fluid/blood return via aspiration.');
  }

  // Efficiency
  if (params.timeTakenSec > 180) {
    score -= 5;
    feedbackItems.push('Procedure duration prolonged (> 3 min).');
  }

  score = Math.max(0, Math.min(100, score));

  let grade: 'A+' | 'A' | 'B' | 'C' | 'FAIL' = 'FAIL';
  if (score >= 95) grade = 'A+';
  else if (score >= 85) grade = 'A';
  else if (score >= 70) grade = 'B';
  else if (score >= 60) grade = 'C';

  return { score, grade, feedbackItems };
}
