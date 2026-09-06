/**
 * NeurosurgeryEVDEngine.ts
 * Mediverse — Stereotactic Ventriculostomy & External Ventricular Drain (EVD) Biophysical Engine
 * Location: frontend/.gemini/skills/NeurosurgeryEVDEngine.ts
 *
 * Biophysical Models:
 * - Stereotactic Kocher's Point Ventriculostomy Geometry:
 *   • Landmark coordinates: 11 cm posterior from nasion, 3 cm lateral from midline (mid-pupillary line).
 *   • Coronal angle: perpendicular to skull, aimed toward medial canthus of ipsilateral eye (normal ~90° to tangent).
 *   • Sagittal angle: aimed toward external auditory meatus / tragus (normal ~90° to tangent).
 *   • Trajectory depth: 5.5 to 6.5 cm from outer calvarium into frontal horn of lateral ventricle at the Foramen of Monro.
 *   • Deviation risks: Medial breach (septum pellucidum, fornix, ACA); Lateral breach (internal capsule hemiplegia); Deep breach (midbrain/brainstem).
 * - Hydrodynamic EVD Drainage Mechanics (Poiseuille & Hydrostatic Pressure):
 *   • Zero reference: Tragus of the ear / Foramen of Monro.
 *   • Chamber / Burette height setting: 0 to 25 cmH2O (1 mmHg ≈ 1.36 cmH2O).
 *   • Effective drainage driving pressure: ΔP = ICP (in cmH2O) - Burette Height (cmH2O).
 *   • Fluid drainage occurs ONLY when ICP_cmH2O > BuretteHeight.
 *   • Catheter lumen patency: 0% (occluded by blood clot/debris) to 100% (fully patent).
 *   • CSF Drainage Rate: Q = Patency * max(0, ΔP * FlowCoefficient) + basal choroid secretion.
 * - Complications & Pathologies:
 *   • Overdrainage & Slit Ventricle Collapse (Burette too low, risk of subdural hematoma from bridging vein stretch).
 *   • Catheter Occlusion & Intracranial Hypertension (clot obstruction, absence of CSF meniscus pulsation, rising ICP).
 *   • Aneurysmal Subarachnoid Hemorrhage (aSAH) & Acute Hydrocephalus.
 *   • Intraventricular Hemorrhage (IVH) & Casting.
 *   • Intrathecal Thrombolysis (rt-PA) clot clearance.
 *   • EVD Weaning & Challenge Clamping Protocol.
 */

export type EVDClampState = 'OPEN_DRAINING' | 'CLAMPED_MONITORING';

export type EVDAlarm =
  | 'OPTIMAL'
  | 'ACUTE_INTRACRANIAL_HYPERTENSION'
  | 'CATHETER_OCCLUSION_NO_PULSATION'
  | 'CRITICAL_OVERDRAINAGE_COLLAPSE'
  | 'TRAJECTORY_MISPLACEMENT_MEDIAL'
  | 'TRAJECTORY_MISPLACEMENT_LATERAL'
  | 'TRAJECTORY_TOO_DEEP_BRAINSTEM'
  | 'VENTRICULAR_SLIT_COLLAPSE';

export type EVDPresetId =
  | 'ANEURYSMAL_SAH_ACUTE_HYDROCEPHALUS'
  | 'SEVERE_TBI_MASS_EDEMA'
  | 'IVH_CLOTTED_CATHETER_OCCLUSION'
  | 'OVERDRAINAGE_SLIT_VENTRICLE'
  | 'NPH_CSF_TAP_TRIAL'
  | 'POST_OP_EVD_WEANING_CLAMP_TEST';

export interface EVDPresetInfo {
  id: EVDPresetId;
  title: string;
  chiefComplaint: string;
  ctImagingFinding: string;
  targetIcpMmHg: number;
  initialState: Partial<EVDInputParams>;
}

export interface TrajectoryVector {
  burrHoleFromNasionCm: number; // 11 cm normal
  burrHoleFromMidlineCm: number; // 3 cm normal
  coronalAngleDeg: number; // 90° normal (aimed at medial canthus)
  sagittalAngleDeg: number; // 90° normal (aimed at tragus)
  catheterDepthCm: number; // 5.5 to 6.5 cm normal
}

export interface EVDInputParams {
  presetId: EVDPresetId;
  trajectory: TrajectoryVector;
  chamberHeightCmH2O: number; // 0 to 25 cmH2O
  clampState: EVDClampState;
  catheterPatencyPercent: number; // 0 to 100%
  hypertonicSalineGiven: boolean; // 3% NaCl 250mL bolus
  mannitolGiven: boolean; // 20% Mannitol 1g/kg
  sterileFlushPerformed: boolean; // Gentle 1-2 mL flush to clear clot
  intrathecalTpaGiven: boolean; // 1 mg rt-PA for IVH
}

export interface EVDHydrodynamicState {
  icpMmHg: number;
  icpCmH2O: number;
  cppMmHg: number; // Cerebral Perfusion Pressure = MAP (assumed 90) - ICP
  drivingPressureCmH2O: number;
  csfDrainageRateMlHr: number;
  pulsatilityIntact: boolean;
  chamberLevelingAccurate: boolean;
  ventricleCannulated: boolean;
  trajectoryAccuracy: 'OPTIMAL_FORAMEN_MONRO' | 'MEDIAL_FORNIX_RISK' | 'LATERAL_CAPSULAR_RISK' | 'TOO_SHALLOW' | 'TOO_DEEP_MIDBRAIN';
  activeAlarms: EVDAlarm[];
  clinicalRecommendation: string;
}

export const EVD_PRESETS: Record<EVDPresetId, EVDPresetInfo> = {
  ANEURYSMAL_SAH_ACUTE_HYDROCEPHALUS: {
    id: 'ANEURYSMAL_SAH_ACUTE_HYDROCEPHALUS',
    title: 'Aneurysmal SAH with Acute Obstructive Hydrocephalus',
    chiefComplaint: 'Sudden "worst headache of life", rapid decrease in consciousness to GCS 8 (Hunt-Hess 4, Fisher 3).',
    ctImagingFinding: 'Diffuse hyperdense subarachnoid blood with ballooning temporal horns and Evan\'s index 0.38 (acute obstructive hydrocephalus).',
    targetIcpMmHg: 32,
    initialState: {
      presetId: 'ANEURYSMAL_SAH_ACUTE_HYDROCEPHALUS',
      trajectory: {
        burrHoleFromNasionCm: 11.0,
        burrHoleFromMidlineCm: 3.0,
        coronalAngleDeg: 90,
        sagittalAngleDeg: 90,
        catheterDepthCm: 6.0,
      },
      chamberHeightCmH2O: 15,
      clampState: 'OPEN_DRAINING',
      catheterPatencyPercent: 90,
      hypertonicSalineGiven: false,
      mannitolGiven: false,
      sterileFlushPerformed: false,
      intrathecalTpaGiven: false,
    },
  },
  SEVERE_TBI_MASS_EDEMA: {
    id: 'SEVERE_TBI_MASS_EDEMA',
    title: 'Severe Traumatic Brain Injury (TBI) & Refractory ICP',
    chiefComplaint: 'High-speed motor vehicle collision, decerebrate posturing, asymmetrical sluggish pupils, GCS 5.',
    ctImagingFinding: 'Bifrontal contusions, effaced basal cisterns, midline shift 7 mm, compressed lateral ventricles.',
    targetIcpMmHg: 28,
    initialState: {
      presetId: 'SEVERE_TBI_MASS_EDEMA',
      trajectory: {
        burrHoleFromNasionCm: 11.0,
        burrHoleFromMidlineCm: 3.0,
        coronalAngleDeg: 90,
        sagittalAngleDeg: 90,
        catheterDepthCm: 6.0,
      },
      chamberHeightCmH2O: 12,
      clampState: 'OPEN_DRAINING',
      catheterPatencyPercent: 100,
      hypertonicSalineGiven: false,
      mannitolGiven: false,
      sterileFlushPerformed: false,
      intrathecalTpaGiven: false,
    },
  },
  IVH_CLOTTED_CATHETER_OCCLUSION: {
    id: 'IVH_CLOTTED_CATHETER_OCCLUSION',
    title: 'Thalamic ICH with IVH Casting & Clotted EVD Obstruction',
    chiefComplaint: 'Hypertensive thalamic hemorrhage with secondary intraventricular extension; acute cessation of CSF drain with sudden ICP spike to 36 mmHg.',
    ctImagingFinding: 'Hyperdense intraventricular hematoma occupying 3rd and 4th ventricles; EVD tip enveloped in intraventricular fibrin clot.',
    targetIcpMmHg: 36,
    initialState: {
      presetId: 'IVH_CLOTTED_CATHETER_OCCLUSION',
      trajectory: {
        burrHoleFromNasionCm: 11.0,
        burrHoleFromMidlineCm: 3.0,
        coronalAngleDeg: 90,
        sagittalAngleDeg: 90,
        catheterDepthCm: 6.0,
      },
      chamberHeightCmH2O: 10,
      clampState: 'OPEN_DRAINING',
      catheterPatencyPercent: 5, // Severely clotted
      hypertonicSalineGiven: false,
      mannitolGiven: false,
      sterileFlushPerformed: false,
      intrathecalTpaGiven: false,
    },
  },
  OVERDRAINAGE_SLIT_VENTRICLE: {
    id: 'OVERDRAINAGE_SLIT_VENTRICLE',
    title: 'Iatrogenic CSF Overdrainage & Slit Ventricle Collapse',
    chiefComplaint: 'Patient with EVD positioned inadvertently below level of tragus (-5 cmH2O) develops orthostatic agitation, severe nausea, and bridging vein stretching.',
    ctImagingFinding: 'Complete bilateral collapse of lateral ventricles (slit ventricles) with early bilateral thin subdural hygromas.',
    targetIcpMmHg: 3,
    initialState: {
      presetId: 'OVERDRAINAGE_SLIT_VENTRICLE',
      trajectory: {
        burrHoleFromNasionCm: 11.0,
        burrHoleFromMidlineCm: 3.0,
        coronalAngleDeg: 90,
        sagittalAngleDeg: 90,
        catheterDepthCm: 6.0,
      },
      chamberHeightCmH2O: 2, // Dangerously low
      clampState: 'OPEN_DRAINING',
      catheterPatencyPercent: 100,
      hypertonicSalineGiven: false,
      mannitolGiven: false,
      sterileFlushPerformed: false,
      intrathecalTpaGiven: false,
    },
  },
  NPH_CSF_TAP_TRIAL: {
    id: 'NPH_CSF_TAP_TRIAL',
    title: 'Normal Pressure Hydrocephalus (NPH) Continuous Lumbar/EVD Tap',
    chiefComplaint: '74-year-old with Hakim-Adams triad (gait ataxia, urge urinary incontinence, subcortical dementia).',
    ctImagingFinding: 'Ventriculomegaly out of proportion to sulcal enlargement, Evans index 0.36, callosal angle 75°.',
    targetIcpMmHg: 12,
    initialState: {
      presetId: 'NPH_CSF_TAP_TRIAL',
      trajectory: {
        burrHoleFromNasionCm: 11.0,
        burrHoleFromMidlineCm: 3.0,
        coronalAngleDeg: 90,
        sagittalAngleDeg: 90,
        catheterDepthCm: 6.0,
      },
      chamberHeightCmH2O: 10,
      clampState: 'OPEN_DRAINING',
      catheterPatencyPercent: 100,
      hypertonicSalineGiven: false,
      mannitolGiven: false,
      sterileFlushPerformed: false,
      intrathecalTpaGiven: false,
    },
  },
  POST_OP_EVD_WEANING_CLAMP_TEST: {
    id: 'POST_OP_EVD_WEANING_CLAMP_TEST',
    title: 'EVD Weaning Trial — Challenge Clamping Protocol',
    chiefComplaint: 'Day 8 post-aneurysm clipping; CSF clear and xanthochromia clearing. Assessing readiness for catheter removal.',
    ctImagingFinding: 'Resolution of intraventricular blood; symmetric lateral ventricles with baseline Evans index 0.28.',
    targetIcpMmHg: 10,
    initialState: {
      presetId: 'POST_OP_EVD_WEANING_CLAMP_TEST',
      trajectory: {
        burrHoleFromNasionCm: 11.0,
        burrHoleFromMidlineCm: 3.0,
        coronalAngleDeg: 90,
        sagittalAngleDeg: 90,
        catheterDepthCm: 6.0,
      },
      chamberHeightCmH2O: 20,
      clampState: 'CLAMPED_MONITORING',
      catheterPatencyPercent: 100,
      hypertonicSalineGiven: false,
      mannitolGiven: false,
      sterileFlushPerformed: false,
      intrathecalTpaGiven: false,
    },
  },
};

/**
 * Evaluates ventriculostomy trajectory stereotactic accuracy.
 */
export function evaluateVentriculostomyTrajectory(t: TrajectoryVector): {
  ventricleCannulated: boolean;
  accuracy: 'OPTIMAL_FORAMEN_MONRO' | 'MEDIAL_FORNIX_RISK' | 'LATERAL_CAPSULAR_RISK' | 'TOO_SHALLOW' | 'TOO_DEEP_MIDBRAIN';
} {
  // Depth check
  if (t.catheterDepthCm < 5.0) {
    return { ventricleCannulated: false, accuracy: 'TOO_SHALLOW' };
  }
  if (t.catheterDepthCm > 7.0) {
    return { ventricleCannulated: false, accuracy: 'TOO_DEEP_MIDBRAIN' };
  }

  // Coronal angle check (normal 85-95°)
  if (t.coronalAngleDeg < 80) {
    return { ventricleCannulated: false, accuracy: 'MEDIAL_FORNIX_RISK' };
  }
  if (t.coronalAngleDeg > 100) {
    return { ventricleCannulated: false, accuracy: 'LATERAL_CAPSULAR_RISK' };
  }

  // Calvarial entry check (Kocher's Point: 11 cm posterior from nasion, 3 cm lateral)
  const nasionDelta = Math.abs(t.burrHoleFromNasionCm - 11.0);
  const midlineDelta = Math.abs(t.burrHoleFromMidlineCm - 3.0);

  if (nasionDelta <= 1.0 && midlineDelta <= 0.8 && t.sagittalAngleDeg >= 82 && t.sagittalAngleDeg <= 98) {
    return { ventricleCannulated: true, accuracy: 'OPTIMAL_FORAMEN_MONRO' };
  }

  return { ventricleCannulated: true, accuracy: 'OPTIMAL_FORAMEN_MONRO' };
}

/**
 * Main Biophysical Solver for EVD Hydrodynamics
 */
export function computeEVDHydrodynamics(params: EVDInputParams): EVDHydrodynamicState {
  const {
    presetId,
    trajectory,
    chamberHeightCmH2O,
    clampState,
    catheterPatencyPercent,
    hypertonicSalineGiven,
    mannitolGiven,
    sterileFlushPerformed,
    intrathecalTpaGiven,
  } = params;

  const preset = EVD_PRESETS[presetId];
  let baseIcpMmHg = preset.targetIcpMmHg;

  // Medical Osmotic Interventions
  if (hypertonicSalineGiven) baseIcpMmHg -= 8;
  if (mannitolGiven) baseIcpMmHg -= 6;

  // Catheter Flush / tPA Interventions
  let effectivePatency = catheterPatencyPercent;
  if (sterileFlushPerformed && effectivePatency < 50) {
    effectivePatency = Math.min(100, effectivePatency + 45);
  }
  if (intrathecalTpaGiven && effectivePatency < 80) {
    effectivePatency = Math.min(100, effectivePatency + 50);
  }

  const { ventricleCannulated, accuracy } = evaluateVentriculostomyTrajectory(trajectory);

  // If ventricle was missed or trajectory was inaccurate, drainage drops and ICP spikes
  if (!ventricleCannulated) {
    baseIcpMmHg += 10;
    effectivePatency = 0;
  }

  // Convert ICP: 1 mmHg ≈ 1.36 cmH2O
  let icpCmH2O = Math.round(baseIcpMmHg * 1.36);

  // Hydrodynamic Drainage calculation
  let drivingPressureCmH2O = icpCmH2O - chamberHeightCmH2O;
  let csfDrainageRateMlHr = 0;

  if (clampState === 'OPEN_DRAINING' && ventricleCannulated) {
    if (drivingPressureCmH2O > 0 && effectivePatency > 0) {
      // Flow = patencyFraction * (drivingPressure * factor) + basal secretion
      const flowFactor = 0.8;
      const pressureDrivenFlow = drivingPressureCmH2O * flowFactor * (effectivePatency / 100);
      csfDrainageRateMlHr = Math.round(Math.min(45, Math.max(0, pressureDrivenFlow + 5)));

      // Drainage lowers the ICP in an open system
      const reliefMmHg = Math.min(12, Math.round(csfDrainageRateMlHr * 0.35));
      baseIcpMmHg = Math.max(2, baseIcpMmHg - reliefMmHg);
      icpCmH2O = Math.round(baseIcpMmHg * 1.36);
      drivingPressureCmH2O = icpCmH2O - chamberHeightCmH2O;
    } else {
      csfDrainageRateMlHr = 0;
    }
  } else {
    // Clamped or not cannulated
    csfDrainageRateMlHr = 0;
  }

  // Pulsatility check: requires open drain or transducer with patent catheter
  const pulsatilityIntact = effectivePatency >= 20 && ventricleCannulated;

  // Cerebral Perfusion Pressure (CPP = MAP - ICP; assume MAP = 90 mmHg)
  const assumedMapMmHg = 90;
  const cppMmHg = assumedMapMmHg - baseIcpMmHg;

  // Active Alarms
  const activeAlarms: EVDAlarm[] = [];

  if (!ventricleCannulated) {
    if (accuracy === 'MEDIAL_FORNIX_RISK') activeAlarms.push('TRAJECTORY_MISPLACEMENT_MEDIAL');
    if (accuracy === 'LATERAL_CAPSULAR_RISK') activeAlarms.push('TRAJECTORY_MISPLACEMENT_LATERAL');
    if (accuracy === 'TOO_DEEP_MIDBRAIN') activeAlarms.push('TRAJECTORY_TOO_DEEP_BRAINSTEM');
  }

  if (baseIcpMmHg >= 22) {
    activeAlarms.push('ACUTE_INTRACRANIAL_HYPERTENSION');
  }

  if (!pulsatilityIntact || effectivePatency < 15) {
    activeAlarms.push('CATHETER_OCCLUSION_NO_PULSATION');
  }

  if (
    clampState === 'OPEN_DRAINING' &&
    (chamberHeightCmH2O <= 4 || presetId === 'OVERDRAINAGE_SLIT_VENTRICLE' || (chamberHeightCmH2O <= 6 && baseIcpMmHg <= 6))
  ) {
    activeAlarms.push('CRITICAL_OVERDRAINAGE_COLLAPSE');
    activeAlarms.push('VENTRICULAR_SLIT_COLLAPSE');
  }

  if (activeAlarms.length === 0) {
    activeAlarms.push('OPTIMAL');
  }

  // Clinical Recommendation
  let clinicalRecommendation = 'EVD functioning within target hydrodynamics. Continue hourly neuro checks and drainage output logging.';

  if (activeAlarms.includes('CRITICAL_OVERDRAINAGE_COLLAPSE')) {
    clinicalRecommendation = 'DANGER: Acute CSF Overdrainage. Immediately raise EVD chamber to >= 10-15 cmH2O to prevent slit ventricle collapse and bridging vein traction subdural hemorrhage.';
  } else if (activeAlarms.includes('CATHETER_OCCLUSION_NO_PULSATION')) {
    clinicalRecommendation = 'CAUTION: Catheter occlusion / absent respiratory pulsation. Perform sterile zero check. Consider gentle 1 mL sterile preservative-free saline flush or intrathecal rt-PA under sterile neurosurgical protocol.';
  } else if (activeAlarms.includes('ACUTE_INTRACRANIAL_HYPERTENSION')) {
    clinicalRecommendation = 'ALERT: Sustained Intracranial Hypertension (ICP > 20 mmHg). Verify EVD patency, confirm zero reference at tragus, administer 3% Hypertonic Saline 250mL bolus, and lower drainage chamber if clinically indicated.';
  }

  return {
    icpMmHg: baseIcpMmHg,
    icpCmH2O,
    cppMmHg,
    drivingPressureCmH2O,
    csfDrainageRateMlHr,
    pulsatilityIntact,
    chamberLevelingAccurate: true,
    ventricleCannulated,
    trajectoryAccuracy: accuracy,
    activeAlarms,
    clinicalRecommendation,
  };
}
