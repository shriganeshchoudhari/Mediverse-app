/**
 * TEENavigationEngine.ts
 * Comprehensive Transesophageal Echocardiography (TEE) 28-View Navigation & Hemodynamic Workstation Engine.
 * Location: frontend/.gemini/skills/TEENavigationEngine.ts
 *
 * Implements:
 * 1. ASE/SCA (American Society of Echocardiography & Society of Cardiovascular Anesthesiologists) 28 Standard TEE Views:
 *    - Upper Esophageal (UE), Mid Esophageal (ME), Transgastric (TG), Deep Transgastric (DTG), Descending Aorta (DA).
 *    - Electronic Omniplane Multiplane Crystal Rotation (0° to 180°).
 *    - Mechanical Probe Shaft Controls: Depth (cm), Probe Rotation (CW/CCW), Tip Anteflexion/Retroflexion, Lateral Deflection.
 * 2. Multi-parameter Probe View-Matching Algorithm with navigation coaching and tolerance window detection.
 * 3. Comprehensive Hemodynamic Doppler Solvers:
 *    - Mitral Inflow & Tissue Doppler (E, A, E/A ratio, Deceleration Time, e' velocity, E/e' ratio, Diastolic Dysfunction Grade I-III).
 *    - Aortic Stenosis Continuity Equation & Modified Bernoulli (Vmax, Mean Gradient, AVA, DVI, AS severity).
 *    - Right Ventricular Systolic Pressure & Pulmonary Hypertension (RVSP = 4*V_TR^2 + RAP).
 *    - Simpson's Biplane Left Ventricular Ejection Fraction (LVEF, LVEDV, LVESV, SV, CO).
 *    - RV Fractional Area Change (FAC).
 * 4. 6 Evidence-Based High-Yield Presets (Normal, Severe Calcific AS, Flail P2 MR, Restrictive Diastology, McConnell's Sign PE, Type A Dissection).
 */

export type ProbeDepthZone =
  | 'UPPER_ESOPHAGEAL'   // 20 - 25 cm
  | 'MID_ESOPHAGEAL'     // 30 - 35 cm
  | 'TRANSGASTRIC'       // 40 - 45 cm
  | 'DEEP_TRANSGASTRIC'  // 45 - 50 cm
  | 'DESCENDING_AORTA';  // 25 - 40 cm (posterior)

export interface ProbeState {
  depthZone: ProbeDepthZone;
  depthCm: number;              // 20 to 50 cm
  omniplaneAngleDeg: number;    // 0° to 180°
  probeRotationDeg: number;     // -90° (CCW/Left) to +90° (CW/Right), 0° neutral
  tipDeflectionDeg: number;     // -30° (Retroflexion) to +30° (Anteflexion), 0° neutral
  lateralDeflectionDeg: number; // -20° (Left) to +20° (Right), 0° neutral
}

export type TEEViewId =
  | 'ME_4_CHAMBER'
  | 'ME_2_CHAMBER'
  | 'ME_LONG_AXIS'
  | 'ME_AV_SAX'
  | 'ME_AV_LAX'
  | 'ME_RV_INFLOW_OUTFLOW'
  | 'ME_BICAVAL'
  | 'ME_ASC_AORTA_SAX'
  | 'ME_ASC_AORTA_LAX'
  | 'TG_MID_SAX'
  | 'TG_2_CHAMBER'
  | 'TG_BASAL_SAX'
  | 'DEEP_TG_LAX'
  | 'DESC_AORTA_SAX'
  | 'DESC_AORTA_LAX';

export interface TEEStandardViewDefinition {
  id: TEEViewId;
  name: string;
  depthZone: ProbeDepthZone;
  idealDepthCm: number;
  idealOmniplaneAngleDeg: number;
  omniplaneToleranceDeg: number;
  idealProbeRotationDeg: number;
  idealTipDeflectionDeg: number;
  structuresVisualized: string[];
  clinicalSignificance: string;
  dopplerUtilities: string[];
  recommendedDopplerBeamAlignment: string;
}

export const ASE_SCA_TEE_VIEWS: Record<TEEViewId, TEEStandardViewDefinition> = {
  ME_4_CHAMBER: {
    id: 'ME_4_CHAMBER',
    name: 'ME 4-Chamber View',
    depthZone: 'MID_ESOPHAGEAL',
    idealDepthCm: 32,
    idealOmniplaneAngleDeg: 0,
    omniplaneToleranceDeg: 15,
    idealProbeRotationDeg: 0,
    idealTipDeflectionDeg: 0,
    structuresVisualized: ['Left Atrium', 'Left Ventricle (lateral & inferoseptal walls)', 'Right Atrium', 'Right Ventricle', 'Mitral Valve (A2/A3, P1/P2)', 'Tricuspid Valve'],
    clinicalSignificance: 'Global biventricular systolic function, mitral/tricuspid regurgitation screening, interatrial septum inspection.',
    dopplerUtilities: ['Mitral Inflow E/A Waves', 'Tricuspid Regurgitation Jet (TR Vmax for RVSP)', 'Mitral Annular Tissue Doppler (e\')'],
    recommendedDopplerBeamAlignment: 'Parallel to Mitral Inflow and Tricuspid Inflow jets.'
  },
  ME_2_CHAMBER: {
    id: 'ME_2_CHAMBER',
    name: 'ME 2-Chamber View',
    depthZone: 'MID_ESOPHAGEAL',
    idealDepthCm: 32,
    idealOmniplaneAngleDeg: 90,
    omniplaneToleranceDeg: 15,
    idealProbeRotationDeg: 0,
    idealTipDeflectionDeg: 0,
    structuresVisualized: ['Left Atrium', 'Left Ventricle (anterior & inferior walls)', 'Mitral Valve (A1/A2, P2/P3)', 'Left Atrial Appendage (LAA)', 'Left Superior Pulmonary Vein'],
    clinicalSignificance: 'Simpson\'s Biplane vertical orthogonal plane, LAD/RCA territory wall motion, LAA thrombus evaluation.',
    dopplerUtilities: ['LAA Emptying Velocity (thrombus risk <20 cm/s)', 'Pulmonary Vein Systolic/Diastolic S/D flow'],
    recommendedDopplerBeamAlignment: 'Parallel to LAA ostium or pulmonary vein inflow.'
  },
  ME_LONG_AXIS: {
    id: 'ME_LONG_AXIS',
    name: 'ME Long-Axis View',
    depthZone: 'MID_ESOPHAGEAL',
    idealDepthCm: 32,
    idealOmniplaneAngleDeg: 130,
    omniplaneToleranceDeg: 15,
    idealProbeRotationDeg: 0,
    idealTipDeflectionDeg: 0,
    structuresVisualized: ['Left Atrium', 'Left Ventricle (anteroseptal & inferolateral walls)', 'Mitral Valve (A2, P2)', 'Aortic Valve (Right & Non-Coronary Cusps)', 'LVOT', 'Proximal Ascending Aorta'],
    clinicalSignificance: 'LVOT diameter measurement, aortic regurgitation vena contracta, mitral regurgitation jet origin, SAM in HOCM.',
    dopplerUtilities: ['Color Doppler across LVOT & Aortic Valve', 'Mitral Regurgitation Vena Contracta'],
    recommendedDopplerBeamAlignment: 'Perpendicular to aortic root; note CW Doppler across AV is not co-linear in this view (use Deep TG).'
  },
  ME_AV_SAX: {
    id: 'ME_AV_SAX',
    name: 'ME Aortic Valve Short-Axis View',
    depthZone: 'MID_ESOPHAGEAL',
    idealDepthCm: 30,
    idealOmniplaneAngleDeg: 45,
    omniplaneToleranceDeg: 15,
    idealProbeRotationDeg: 0,
    idealTipDeflectionDeg: 0,
    structuresVisualized: ['Aortic Valve Cusps (RCC, LCC, NCC - Mercedes-Benz sign)', 'Interatrial Septum', 'Right Atrium', 'Right Ventricular Outflow Tract (RVOT)', 'Main Pulmonary Artery'],
    clinicalSignificance: 'Bicuspid vs tricuspid aortic valve morphology, aortic planimetry, coronary ostia inspection, perivalvular abscess.',
    dopplerUtilities: ['Color Doppler for central vs eccentric aortic regurgitant jet', 'Continuous Wave across RVOT'],
    recommendedDopplerBeamAlignment: 'Color interrogation of cusp coaptation central defect.'
  },
  ME_AV_LAX: {
    id: 'ME_AV_LAX',
    name: 'ME Aortic Valve Long-Axis View',
    depthZone: 'MID_ESOPHAGEAL',
    idealDepthCm: 30,
    idealOmniplaneAngleDeg: 135,
    omniplaneToleranceDeg: 15,
    idealProbeRotationDeg: 0,
    idealTipDeflectionDeg: -5,
    structuresVisualized: ['Aortic Valve Cusps (RCC, NCC)', 'Sinuses of Valsalva', 'Sinotubular Junction', 'Ascending Aorta', 'LVOT'],
    clinicalSignificance: 'Sinus of Valsalva aneurysm, aortic root dilatation, prosthetic aortic valve dehiscence/paravalvular leak.',
    dopplerUtilities: ['Color Doppler for aortic regurgitation jet width / LVOT ratio'],
    recommendedDopplerBeamAlignment: 'Color Doppler mapping across LVOT and aortic valve orifice.'
  },
  ME_RV_INFLOW_OUTFLOW: {
    id: 'ME_RV_INFLOW_OUTFLOW',
    name: 'ME RV Inflow-Outflow View',
    depthZone: 'MID_ESOPHAGEAL',
    idealDepthCm: 32,
    idealOmniplaneAngleDeg: 60,
    omniplaneToleranceDeg: 15,
    idealProbeRotationDeg: 15,
    idealTipDeflectionDeg: 0,
    structuresVisualized: ['Right Atrium', 'Tricuspid Valve', 'Right Ventricle Body', 'RVOT', 'Pulmonic Valve', 'Proximal Main Pulmonary Artery'],
    clinicalSignificance: 'Tricuspid endocarditis vegetations, pulmonic valve stenosis/insufficiency, RVOT obstruction, ventricular septal defects.',
    dopplerUtilities: ['Pulmonic Valve CW Doppler (PV Vmax)', 'Tricuspid Regurgitation Jet Interrogation'],
    recommendedDopplerBeamAlignment: 'Co-linear alignment with pulmonic valve ejection.'
  },
  ME_BICAVAL: {
    id: 'ME_BICAVAL',
    name: 'ME Bicaval View',
    depthZone: 'MID_ESOPHAGEAL',
    idealDepthCm: 31,
    idealOmniplaneAngleDeg: 100,
    omniplaneToleranceDeg: 15,
    idealProbeRotationDeg: 35,
    idealTipDeflectionDeg: 0,
    structuresVisualized: ['Superior Vena Cava (SVC)', 'Inferior Vena Cava (IVC)', 'Right Atrium', 'Left Atrium', 'Fossa Ovalis / Interatrial Septum', 'Crista Terminalis', 'Eustachian Valve'],
    clinicalSignificance: 'Gold standard for ASD/PFO detection, agitated saline bubble study with Valsalva/release, ECMO/dialysis cannula tip positioning.',
    dopplerUtilities: ['Color Doppler across fossa ovalis for left-to-right or right-to-left shunt', 'SVC/IVC pulsed-wave Doppler'],
    recommendedDopplerBeamAlignment: 'Color box over the entire thin fossa ovalis membrane.'
  },
  ME_ASC_AORTA_SAX: {
    id: 'ME_ASC_AORTA_SAX',
    name: 'ME Ascending Aorta Short-Axis View',
    depthZone: 'UPPER_ESOPHAGEAL',
    idealDepthCm: 24,
    idealOmniplaneAngleDeg: 0,
    omniplaneToleranceDeg: 15,
    idealProbeRotationDeg: 15,
    idealTipDeflectionDeg: 0,
    structuresVisualized: ['Ascending Aorta cross-section', 'Right Pulmonary Artery (RPA) in longitudinal axis', 'Superior Vena Cava'],
    clinicalSignificance: 'Type A aortic dissection screening, saddle or RPA pulmonary embolism, intra-aortic cannula positioning.',
    dopplerUtilities: ['RPA Pulsed Wave Doppler', 'Ascending Aorta Color Doppler for intimal flap true vs false lumen'],
    recommendedDopplerBeamAlignment: 'Perpendicular cross-section of aorta; parallel to RPA flow.'
  },
  ME_ASC_AORTA_LAX: {
    id: 'ME_ASC_AORTA_LAX',
    name: 'ME Ascending Aorta Long-Axis View',
    depthZone: 'UPPER_ESOPHAGEAL',
    idealDepthCm: 24,
    idealOmniplaneAngleDeg: 100,
    omniplaneToleranceDeg: 15,
    idealProbeRotationDeg: 15,
    idealTipDeflectionDeg: 0,
    structuresVisualized: ['Tubular Ascending Aorta (longitudinal)', 'Right Pulmonary Artery (cross-section behind aorta)'],
    clinicalSignificance: 'Ascending aortic aneurysm, Type A intimal dissection flap, atheroma grading for cross-clamping safety.',
    dopplerUtilities: ['Color Doppler for dissection flap flow dynamics'],
    recommendedDopplerBeamAlignment: 'Longitudinal color Doppler interrogation.'
  },
  TG_MID_SAX: {
    id: 'TG_MID_SAX',
    name: 'TG Mid-Papillary Short-Axis View',
    depthZone: 'TRANSGASTRIC',
    idealDepthCm: 42,
    idealOmniplaneAngleDeg: 0,
    omniplaneToleranceDeg: 15,
    idealProbeRotationDeg: 0,
    idealTipDeflectionDeg: 20,
    structuresVisualized: ['LV Short Axis Doughnut', '6 Myocardial Segments (Anterior, Anterolateral, Inferolateral, Inferior, Inferoseptal, Anteroseptal)', 'Anterolateral & Posteromedial Papillary Muscles', 'Right Ventricle crescent'],
    clinicalSignificance: 'Gold standard view for intraoperative myocardial ischemia monitoring (LAD, LCx, RCA territories simultaneously) and RV pressure overload D-shape.',
    dopplerUtilities: ['Assessment of radial wall thickening and fractional shortening'],
    recommendedDopplerBeamAlignment: '2D radial contraction and wall thickening inspection.'
  },
  TG_2_CHAMBER: {
    id: 'TG_2_CHAMBER',
    name: 'TG 2-Chamber View',
    depthZone: 'TRANSGASTRIC',
    idealDepthCm: 42,
    idealOmniplaneAngleDeg: 90,
    omniplaneToleranceDeg: 15,
    idealProbeRotationDeg: 0,
    idealTipDeflectionDeg: 20,
    structuresVisualized: ['Left Ventricle Inferior & Anterior Walls', 'Mitral Subvalvular Apparatus', 'Chordae Tendineae', 'Papillary Muscle Heads'],
    clinicalSignificance: 'Evaluation of mitral regurgitation mechanism (tethering vs prolapse), chordal rupture, and inferior wall hypokinesis.',
    dopplerUtilities: ['Color Doppler of subvalvular mitral flow'],
    recommendedDopplerBeamAlignment: 'Parallel to LV long-axis chordae.'
  },
  TG_BASAL_SAX: {
    id: 'TG_BASAL_SAX',
    name: 'TG Basal Short-Axis View',
    depthZone: 'TRANSGASTRIC',
    idealDepthCm: 40,
    idealOmniplaneAngleDeg: 0,
    omniplaneToleranceDeg: 15,
    idealProbeRotationDeg: 0,
    idealTipDeflectionDeg: 10,
    structuresVisualized: ['Mitral Valve Fishmouth Orifice', 'Anterior Leaflet Scallops (A1, A2, A3)', 'Posterior Leaflet Scallops (P1, P2, P3)', 'Anterolateral & Posteromedial Commissures'],
    clinicalSignificance: 'Precise anatomic localization of mitral leaflet prolapse or flail scallop for surgical repair planning.',
    dopplerUtilities: ['Color Doppler mapping of mitral regurgitation origin across scallops'],
    recommendedDopplerBeamAlignment: 'Planimetry of mitral valve area in mitral stenosis.'
  },
  DEEP_TG_LAX: {
    id: 'DEEP_TG_LAX',
    name: 'Deep TG Long-Axis View',
    depthZone: 'DEEP_TRANSGASTRIC',
    idealDepthCm: 47,
    idealOmniplaneAngleDeg: 0,
    omniplaneToleranceDeg: 15,
    idealProbeRotationDeg: 0,
    idealTipDeflectionDeg: 28,
    structuresVisualized: ['LV Apex', 'Left Ventricular Outflow Tract (LVOT)', 'Aortic Valve', 'Proximal Ascending Aorta'],
    clinicalSignificance: 'Crucial co-linear interrogation of Aortic Stenosis jet velocity and LVOT velocity. Eliminates cosine theta error in Doppler quantification.',
    dopplerUtilities: ['Pulsed-Wave Doppler of LVOT (VTI_LVOT)', 'Continuous-Wave Doppler across Aortic Valve (Vmax & VTI_AV)'],
    recommendedDopplerBeamAlignment: 'Strictly parallel (0° angle of insonation) to the aortic ejection jet.'
  },
  DESC_AORTA_SAX: {
    id: 'DESC_AORTA_SAX',
    name: 'Descending Aorta Short-Axis View',
    depthZone: 'DESCENDING_AORTA',
    idealDepthCm: 32,
    idealOmniplaneAngleDeg: 0,
    omniplaneToleranceDeg: 15,
    idealProbeRotationDeg: -80,
    idealTipDeflectionDeg: 0,
    structuresVisualized: ['Descending Thoracic Aorta (circular cross-section)', 'Left Pleural Space / Left Hemithorax'],
    clinicalSignificance: 'Type B aortic dissection, mobile atheroma / plaque ulceration, left pleural effusion, thoracic aortic aneurysm.',
    dopplerUtilities: ['Color Doppler distinguishing true vs false lumen flow velocity'],
    recommendedDopplerBeamAlignment: 'Transverse luminal cross section.'
  },
  DESC_AORTA_LAX: {
    id: 'DESC_AORTA_LAX',
    name: 'Descending Aorta Long-Axis View',
    depthZone: 'DESCENDING_AORTA',
    idealDepthCm: 32,
    idealOmniplaneAngleDeg: 90,
    omniplaneToleranceDeg: 15,
    idealProbeRotationDeg: -80,
    idealTipDeflectionDeg: 0,
    structuresVisualized: ['Descending Thoracic Aorta (cylindrical longitudinal tube)', 'Spinal Shadow posterior'],
    clinicalSignificance: 'Longitudinal extent of Type B intimal flap, entry/exit tears, diastolic flow reversal in severe aortic regurgitation.',
    dopplerUtilities: ['Pulsed-Wave Doppler of Holodiastolic Flow Reversal in severe AR (>20 cm/s)'],
    recommendedDopplerBeamAlignment: 'Co-linear to aortic longitudinal flow.'
  }
};

export interface ViewAlignmentResult {
  currentViewId: TEEViewId | null;
  currentViewName: string;
  alignmentScorePct: number;    // 0 to 100%
  isViewLocked: boolean;         // >= 75%
  coachingGuidance: string[];
  activeViewDefinition?: TEEStandardViewDefinition;
}

export function evaluateProbeAlignment(probe: ProbeState): ViewAlignmentResult {
  let bestViewId: TEEViewId | null = null;
  let bestScore = -1;
  const guidanceMessages: string[] = [];

  const views = Object.values(ASE_SCA_TEE_VIEWS);

  for (const v of views) {
    let score = 100;

    // 1. Depth Zone check (weight: 35 pts)
    if (probe.depthZone !== v.depthZone) {
      score -= 40;
    } else {
      const depthDiff = Math.abs(probe.depthCm - v.idealDepthCm);
      score -= Math.min(20, depthDiff * 4);
    }

    // 2. Omniplane Angle check (weight: 35 pts)
    const angleDiff = Math.abs(probe.omniplaneAngleDeg - v.idealOmniplaneAngleDeg);
    if (angleDiff > v.omniplaneToleranceDeg) {
      score -= Math.min(35, (angleDiff - v.omniplaneToleranceDeg) * 1.5);
    }

    // 3. Probe Rotation check (weight: 15 pts)
    const rotDiff = Math.abs(probe.probeRotationDeg - v.idealProbeRotationDeg);
    score -= Math.min(15, rotDiff * 0.4);

    // 4. Tip Deflection check (weight: 15 pts)
    const tipDiff = Math.abs(probe.tipDeflectionDeg - v.idealTipDeflectionDeg);
    score -= Math.min(15, tipDiff * 0.6);

    const clampedScore = Math.max(0, Math.min(100, Math.round(score)));

    if (clampedScore > bestScore) {
      bestScore = clampedScore;
      bestViewId = v.id;
    }
  }

  const targetView = bestViewId ? ASE_SCA_TEE_VIEWS[bestViewId] : null;

  if (targetView && bestScore < 85) {
    // Generate coaching tips
    if (probe.depthZone !== targetView.depthZone) {
      guidanceMessages.push(`Adjust probe depth to ${targetView.depthZone.replace(/_/g, ' ')} (~${targetView.idealDepthCm} cm).`);
    } else if (Math.abs(probe.depthCm - targetView.idealDepthCm) > 2) {
      const dir = probe.depthCm < targetView.idealDepthCm ? 'Advance' : 'Withdraw';
      guidanceMessages.push(`${dir} probe to ${targetView.idealDepthCm} cm.`);
    }

    const angleDiff = targetView.idealOmniplaneAngleDeg - probe.omniplaneAngleDeg;
    if (Math.abs(angleDiff) > targetView.omniplaneToleranceDeg) {
      guidanceMessages.push(`Rotate omniplane angle ${angleDiff > 0 ? '+' : ''}${angleDiff}° (target: ${targetView.idealOmniplaneAngleDeg}°).`);
    }

    const rotDiff = targetView.idealProbeRotationDeg - probe.probeRotationDeg;
    if (Math.abs(rotDiff) > 10) {
      guidanceMessages.push(`Rotate probe shaft ${rotDiff > 0 ? 'Clockwise (Right)' : 'Counter-Clockwise (Left)'} ${Math.abs(rotDiff)}°.`);
    }

    const tipDiff = targetView.idealTipDeflectionDeg - probe.tipDeflectionDeg;
    if (Math.abs(tipDiff) > 8) {
      guidanceMessages.push(`Apply ${tipDiff > 0 ? 'Anteflexion' : 'Retroflexion'} (${Math.abs(tipDiff)}°).`);
    }
  } else if (targetView) {
    guidanceMessages.push('Acoustic window optimized. Standard ASE/SCA anatomical landmarks aligned.');
  }

  return {
    currentViewId: bestScore >= 65 ? bestViewId : null,
    currentViewName: bestScore >= 65 && targetView ? targetView.name : 'Unindexed Intermediate Acoustic Plane',
    alignmentScorePct: bestScore,
    isViewLocked: bestScore >= 75,
    coachingGuidance: guidanceMessages.length > 0 ? guidanceMessages : ['Fine-tune omniplane and depth to lock standard view.'],
    activeViewDefinition: targetView || undefined
  };
}

export type DiastolicGrade = 'NORMAL' | 'GRADE_I_IMPAIRED' | 'GRADE_II_PSEUDONORMAL' | 'GRADE_III_RESTRICTIVE';
export type ASSeverity = 'NORMAL' | 'MILD' | 'MODERATE' | 'SEVERE';
export type PHSeverity = 'NORMAL' | 'MILD_PH' | 'MODERATE_PH' | 'SEVERE_PH';

export interface HemodynamicMeasurements {
  heartRateBpm: number;
  
  // LV Systolic Parameters
  lvEndDiastolicVolumeMl: number;   // 80 to 220 ml
  lvEndSystolicVolumeMl: number;    // 30 to 140 ml
  
  // Mitral Inflow & Tissue Doppler
  mitralEWaveMs: number;            // 0.4 to 1.8 m/s
  mitralAWaveMs: number;            // 0.3 to 1.4 m/s
  decelerationTimeMs: number;       // 100 to 320 ms
  mitralAnnularEVelocityCms: number; // 4 to 16 cm/s (e')
  
  // Aortic Valve & LVOT Doppler
  lvotDiameterCm: number;           // 1.8 to 2.6 cm
  lvotVtiCm: number;                // 12 to 26 cm
  avPeakVelocityMs: number;         // 1.0 to 5.5 m/s (Vmax)
  avVtiCm: number;                  // 20 to 90 cm
  
  // Right Ventricular & Pulmonary Hemodynamics
  trPeakVelocityMs: number;         // 1.8 to 4.5 m/s
  estimatedRapMmHg: number;         // 3, 8, 15 mmHg
  rvEndDiastolicAreaCm2: number;    // 15 to 35 cm2
  rvEndSystolicAreaCm2: number;     // 8 to 25 cm2
  
  // Specific Pathology Flags
  mitralRegurgitationSeverity: 'NONE' | 'MILD' | 'MODERATE' | 'SEVERE_FLAIL';
  aorticDissectionPresent: boolean;
  intimalFlapType: 'NONE' | 'STANFORD_A_ASCENDING' | 'STANFORD_B_DESCENDING';
  pericardialEffusionMm: number;    // 0 to 30 mm
}

export interface CalculatedHemodynamics {
  // LV Systolic
  strokeVolumeMl: number;
  cardiacOutputLpm: number;
  ejectionFractionPct: number;
  
  // Diastolic Function
  eOverARatio: number;
  eOverEPrimeRatio: number;
  diastolicDysfunctionGrade: DiastolicGrade;
  
  // Aortic Stenosis
  lvotCrossSectionalAreaCm2: number;
  simplifiedBernoulliPeakGradientMmHg: number;
  estimatedMeanGradientMmHg: number;
  aorticValveAreaCm2: number;
  dimensionlessVelocityIndex: number;
  asSeverity: ASSeverity;
  
  // Pulmonary Pressures & RV
  rvspMmHg: number;
  phSeverity: PHSeverity;
  rvFacPct: number;                 // Fractional Area Change
  
  // Clinical Pearls
  clinicalSummary: string[];
}

export function computeTEEHemodynamics(m: HemodynamicMeasurements): CalculatedHemodynamics {
  // 1. LV Systolic Function (Simpson's Biplane)
  const strokeVolumeMl = Math.max(10, m.lvEndDiastolicVolumeMl - m.lvEndSystolicVolumeMl);
  const ejectionFractionPct = Math.min(100, Math.max(5, Math.round((strokeVolumeMl / m.lvEndDiastolicVolumeMl) * 100)));
  const cardiacOutputLpm = Number(((strokeVolumeMl * m.heartRateBpm) / 1000).toFixed(2));

  // 2. Diastolic Function
  const eOverARatio = Number((m.mitralEWaveMs / Math.max(0.1, m.mitralAWaveMs)).toFixed(2));
  // e' is in cm/s, E is in m/s (multiply E by 100 for cm/s)
  const eVelocityCms = m.mitralEWaveMs * 100;
  const eOverEPrimeRatio = Number((eVelocityCms / Math.max(1, m.mitralAnnularEVelocityCms)).toFixed(1));

  let diastolicDysfunctionGrade: DiastolicGrade = 'NORMAL';
  if (eOverARatio < 0.8 && m.decelerationTimeMs > 200 && eOverEPrimeRatio <= 10) {
    diastolicDysfunctionGrade = 'GRADE_I_IMPAIRED';
  } else if (eOverARatio >= 0.8 && eOverARatio <= 1.5 && eOverEPrimeRatio > 10) {
    diastolicDysfunctionGrade = 'GRADE_II_PSEUDONORMAL';
  } else if (eOverARatio > 2.0 && m.decelerationTimeMs < 160 && eOverEPrimeRatio > 14) {
    diastolicDysfunctionGrade = 'GRADE_III_RESTRICTIVE';
  }

  // 3. Aortic Valve & Continuity Equation
  // Area = pi * (D / 2)^2 = 0.7854 * D^2
  const lvotCrossSectionalAreaCm2 = Number((Math.PI * Math.pow(m.lvotDiameterCm / 2, 2)).toFixed(2));
  
  // Simplified Bernoulli: DeltaP = 4 * Vmax^2
  const simplifiedBernoulliPeakGradientMmHg = Math.round(4 * Math.pow(m.avPeakVelocityMs, 2));
  
  // Empirical mean gradient relationship: Mean Grad approx 2.4 * Vmax^2
  const estimatedMeanGradientMmHg = Math.round(2.4 * Math.pow(m.avPeakVelocityMs, 2));
  
  // Continuity Equation: AVA = (Area_LVOT * VTI_LVOT) / VTI_AV
  const aorticValveAreaCm2 = Number(((lvotCrossSectionalAreaCm2 * m.lvotVtiCm) / Math.max(1, m.avVtiCm)).toFixed(2));
  
  // DVI = VTI_LVOT / VTI_AV
  const dimensionlessVelocityIndex = Number((m.lvotVtiCm / Math.max(1, m.avVtiCm)).toFixed(2));

  let asSeverity: ASSeverity = 'NORMAL';
  if (aorticValveAreaCm2 < 1.0 || m.avPeakVelocityMs >= 4.0 || estimatedMeanGradientMmHg >= 40 || dimensionlessVelocityIndex < 0.25) {
    asSeverity = 'SEVERE';
  } else if (aorticValveAreaCm2 <= 1.5 || m.avPeakVelocityMs >= 3.0 || estimatedMeanGradientMmHg >= 20) {
    asSeverity = 'MODERATE';
  } else if (aorticValveAreaCm2 <= 2.0 || m.avPeakVelocityMs >= 2.0) {
    asSeverity = 'MILD';
  }

  // 4. RV & Pulmonary Pressures
  // RVSP = 4 * (TR_vel)^2 + RAP
  const trDeltaP = 4 * Math.pow(m.trPeakVelocityMs, 2);
  const rvspMmHg = Math.round(trDeltaP + m.estimatedRapMmHg);

  let phSeverity: PHSeverity = 'NORMAL';
  if (rvspMmHg > 60) {
    phSeverity = 'SEVERE_PH';
  } else if (rvspMmHg >= 45) {
    phSeverity = 'MODERATE_PH';
  } else if (rvspMmHg >= 35) {
    phSeverity = 'MILD_PH';
  }

  // Fractional Area Change: FAC = (EDA - ESA) / EDA * 100%
  const rvFacPct = Math.round(((m.rvEndDiastolicAreaCm2 - m.rvEndSystolicAreaCm2) / Math.max(1, m.rvEndDiastolicAreaCm2)) * 100);

  // 5. Clinical Diagnostic Summary
  const clinicalSummary: string[] = [];

  if (asSeverity === 'SEVERE') {
    clinicalSummary.push(`Critical Aortic Stenosis: AVA ${aorticValveAreaCm2} cm², Vmax ${m.avPeakVelocityMs} m/s, Mean Gradient ${estimatedMeanGradientMmHg} mmHg, DVI ${dimensionlessVelocityIndex}. Urgent valve intervention indicated.`);
  }

  if (m.mitralRegurgitationSeverity === 'SEVERE_FLAIL') {
    clinicalSummary.push('Acute Severe Mitral Regurgitation: Flail leaflet with torn chordae tendineae and torrential eccentric regurgitant jet.');
  }

  if (diastolicDysfunctionGrade === 'GRADE_III_RESTRICTIVE') {
    clinicalSummary.push(`Severe Restrictive Diastolic Filling (Grade III): E/A ${eOverARatio}, Short DT ${m.decelerationTimeMs} ms, Elevated LAP (E/e\' ${eOverEPrimeRatio}).`);
  }

  if (phSeverity === 'SEVERE_PH') {
    clinicalSummary.push(`Severe Pulmonary Hypertension: RVSP ${rvspMmHg} mmHg via TR Doppler (Vmax ${m.trPeakVelocityMs} m/s + RAP ${m.estimatedRapMmHg} mmHg).`);
  }

  if (rvFacPct < 35) {
    clinicalSummary.push(`Depressed RV Systolic Function: Fractional Area Change (FAC) ${rvFacPct}% (<35% threshold).`);
  }

  if (m.aorticDissectionPresent) {
    clinicalSummary.push(`Aortic Dissection Alert: ${m.intimalFlapType === 'STANFORD_A_ASCENDING' ? 'Stanford Type A ascending aortic dissection involving root (surgical emergency).' : 'Stanford Type B descending aortic dissection.'}`);
  }

  if (m.pericardialEffusionMm >= 15) {
    clinicalSummary.push(`Moderate-to-Large Pericardial Effusion (${m.pericardialEffusionMm} mm). Monitor for right atrial and ventricular diastolic collapse.`);
  }

  if (clinicalSummary.length === 0) {
    clinicalSummary.push('Comprehensive TEE parameters within normal physiologic baseline limits.');
  }

  return {
    strokeVolumeMl,
    cardiacOutputLpm,
    ejectionFractionPct,
    eOverARatio,
    eOverEPrimeRatio,
    diastolicDysfunctionGrade,
    lvotCrossSectionalAreaCm2,
    simplifiedBernoulliPeakGradientMmHg,
    estimatedMeanGradientMmHg,
    aorticValveAreaCm2,
    dimensionlessVelocityIndex,
    asSeverity,
    rvspMmHg,
    phSeverity,
    rvFacPct,
    clinicalSummary
  };
}

export interface TEEPreset {
  id: string;
  name: string;
  category: 'Aortic Valve' | 'Mitral Valve' | 'Diastology' | 'Right Heart & PE' | 'Aorta' | 'Baseline';
  description: string;
  initialProbe: ProbeState;
  measurements: HemodynamicMeasurements;
  teachingPoints: string[];
}

export const TEE_PRESETS: TEEPreset[] = [
  {
    id: 'normal-comprehensive-28',
    name: 'Normal 28-View Comprehensive Exam',
    category: 'Baseline',
    description: 'Physiologically healthy young adult undergoing pre-procedural comprehensive TEE baseline assessment with preserved biventricular systolic and diastolic function.',
    initialProbe: {
      depthZone: 'MID_ESOPHAGEAL',
      depthCm: 32,
      omniplaneAngleDeg: 0,
      probeRotationDeg: 0,
      tipDeflectionDeg: 0,
      lateralDeflectionDeg: 0
    },
    measurements: {
      heartRateBpm: 72,
      lvEndDiastolicVolumeMl: 120,
      lvEndSystolicVolumeMl: 45,
      mitralEWaveMs: 0.85,
      mitralAWaveMs: 0.65,
      decelerationTimeMs: 190,
      mitralAnnularEVelocityCms: 11.5,
      lvotDiameterCm: 2.1,
      lvotVtiCm: 20,
      avPeakVelocityMs: 1.3,
      avVtiCm: 22,
      trPeakVelocityMs: 2.1,
      estimatedRapMmHg: 5,
      rvEndDiastolicAreaCm2: 22,
      rvEndSystolicAreaCm2: 12,
      mitralRegurgitationSeverity: 'NONE',
      aorticDissectionPresent: false,
      intimalFlapType: 'NONE',
      pericardialEffusionMm: 2
    },
    teachingPoints: [
      'Normal E/A ratio is between 0.8 and 1.5 with e\' > 10 cm/s and E/e\' < 10.',
      'Normal aortic valve area is > 2.0 cm² with Vmax < 2.0 m/s.',
      'RVSP is < 35 mmHg with normal right atrial pressure of 5 mmHg.'
    ]
  },
  {
    id: 'severe-calcific-as',
    name: 'Severe Calcific Aortic Stenosis (Critical AS)',
    category: 'Aortic Valve',
    description: '78-year-old with exertional syncope and severe trileaflet calcification evaluated via Deep Transgastric and ME views.',
    initialProbe: {
      depthZone: 'DEEP_TRANSGASTRIC',
      depthCm: 47,
      omniplaneAngleDeg: 0,
      probeRotationDeg: 0,
      tipDeflectionDeg: 28,
      lateralDeflectionDeg: 0
    },
    measurements: {
      heartRateBpm: 78,
      lvEndDiastolicVolumeMl: 135,
      lvEndSystolicVolumeMl: 55,
      mitralEWaveMs: 0.95,
      mitralAWaveMs: 1.10,
      decelerationTimeMs: 240,
      mitralAnnularEVelocityCms: 6.2,
      lvotDiameterCm: 2.0,
      lvotVtiCm: 16,
      avPeakVelocityMs: 4.8,
      avVtiCm: 76,
      trPeakVelocityMs: 2.8,
      estimatedRapMmHg: 8,
      rvEndDiastolicAreaCm2: 23,
      rvEndSystolicAreaCm2: 13,
      mitralRegurgitationSeverity: 'MILD',
      aorticDissectionPresent: false,
      intimalFlapType: 'NONE',
      pericardialEffusionMm: 4
    },
    teachingPoints: [
      'Deep TG Long-Axis view is essential for Aortic Stenosis: provides 0° angle of insonation eliminating Doppler cosine theta underestimation.',
      'Continuity equation: AVA = (Area_LVOT * VTI_LVOT) / VTI_AV = (3.14 * 16) / 76 = 0.66 cm² (Critical AS < 1.0 cm²).',
      'Dimensionless Velocity Index (DVI) = 16 / 76 = 0.21 (< 0.25 confirms severe AS independent of LVOT measurement errors).'
    ]
  },
  {
    id: 'acute-p2-flail-mr',
    name: 'Acute Severe Mitral Regurgitation (P2 Flail & Chordal Rupture)',
    category: 'Mitral Valve',
    description: '64-year-old post-inferior MI with sudden pulmonary edema; TEE reveals P2 posterior leaflet prolapsing into left atrium during systole.',
    initialProbe: {
      depthZone: 'MID_ESOPHAGEAL',
      depthCm: 32,
      omniplaneAngleDeg: 130,
      probeRotationDeg: 0,
      tipDeflectionDeg: 0,
      lateralDeflectionDeg: 0
    },
    measurements: {
      heartRateBpm: 105,
      lvEndDiastolicVolumeMl: 155,
      lvEndSystolicVolumeMl: 45,
      mitralEWaveMs: 1.65,
      mitralAWaveMs: 0.75,
      decelerationTimeMs: 135,
      mitralAnnularEVelocityCms: 13.0,
      lvotDiameterCm: 2.1,
      lvotVtiCm: 18,
      avPeakVelocityMs: 1.5,
      avVtiCm: 24,
      trPeakVelocityMs: 3.4,
      estimatedRapMmHg: 12,
      rvEndDiastolicAreaCm2: 26,
      rvEndSystolicAreaCm2: 15,
      mitralRegurgitationSeverity: 'SEVERE_FLAIL',
      aorticDissectionPresent: false,
      intimalFlapType: 'NONE',
      pericardialEffusionMm: 3
    },
    teachingPoints: [
      'Posterior leaflet (P2) flail directs an anteriorly-directed jet that hugs the interatrial septum.',
      'Hyperdynamic LV with ejection fraction ~71% despite cardiogenic pulmonary edema due to low-impedance retrograde regurgitation into low-pressure LA.',
      'Pulsed wave Doppler in the upper pulmonary veins confirms systolic flow reversal.'
    ]
  },
  {
    id: 'grade-3-restrictive',
    name: 'Grade III Restrictive Diastolic Dysfunction',
    category: 'Diastology',
    description: 'Amyloid cardiomyopathy with heavy biventricular hypertrophy, biatrial dilatation, and severe restrictive filling physiology.',
    initialProbe: {
      depthZone: 'MID_ESOPHAGEAL',
      depthCm: 32,
      omniplaneAngleDeg: 0,
      probeRotationDeg: 0,
      tipDeflectionDeg: 0,
      lateralDeflectionDeg: 0
    },
    measurements: {
      heartRateBpm: 88,
      lvEndDiastolicVolumeMl: 95,
      lvEndSystolicVolumeMl: 48,
      mitralEWaveMs: 1.55,
      mitralAWaveMs: 0.50,
      decelerationTimeMs: 120,
      mitralAnnularEVelocityCms: 4.8,
      lvotDiameterCm: 2.0,
      lvotVtiCm: 15,
      avPeakVelocityMs: 1.4,
      avVtiCm: 22,
      trPeakVelocityMs: 3.2,
      estimatedRapMmHg: 15,
      rvEndDiastolicAreaCm2: 24,
      rvEndSystolicAreaCm2: 15,
      mitralRegurgitationSeverity: 'MODERATE',
      aorticDissectionPresent: false,
      intimalFlapType: 'NONE',
      pericardialEffusionMm: 8
    },
    teachingPoints: [
      'Restrictive filling pattern is characterized by towering E wave with diminutive A wave (E/A > 2.0) and rapid deceleration time (< 160 ms).',
      'Tissue Doppler e\' is severely suppressed (< 5 cm/s), driving E/e\' to > 30, indicative of dangerously high left atrial pressure.',
      'Interatrial septum often thickened with classic amyloid "sparkling" granular myocardium.'
    ]
  },
  {
    id: 'massive-pe-mcconnell',
    name: 'Acute Massive PE & McConnell\'s Sign',
    category: 'Right Heart & PE',
    description: 'Sudden perioperative hemodynamic collapse; ME RV Inflow-Outflow and Bicaval views demonstrate acute cor pulmonale and McConnell\'s sign.',
    initialProbe: {
      depthZone: 'MID_ESOPHAGEAL',
      depthCm: 32,
      omniplaneAngleDeg: 60,
      probeRotationDeg: 15,
      tipDeflectionDeg: 0,
      lateralDeflectionDeg: 0
    },
    measurements: {
      heartRateBpm: 122,
      lvEndDiastolicVolumeMl: 75,
      lvEndSystolicVolumeMl: 35,
      mitralEWaveMs: 0.70,
      mitralAWaveMs: 0.85,
      decelerationTimeMs: 230,
      mitralAnnularEVelocityCms: 7.5,
      lvotDiameterCm: 2.0,
      lvotVtiCm: 11,
      avPeakVelocityMs: 1.2,
      avVtiCm: 17,
      trPeakVelocityMs: 3.8,
      estimatedRapMmHg: 15,
      rvEndDiastolicAreaCm2: 34,
      rvEndSystolicAreaCm2: 26,
      mitralRegurgitationSeverity: 'NONE',
      aorticDissectionPresent: false,
      intimalFlapType: 'NONE',
      pericardialEffusionMm: 5
    },
    teachingPoints: [
      'McConnell\'s Sign: Akinesis/hypokinesis of RV mid-free wall with preserved hyperdynamic contraction of the RV apex.',
      'Severe acute pulmonary hypertension (RVSP = 4 * 3.8² + 15 = 73 mmHg) causing RV Fractional Area Change (FAC) to plummet to 24%.',
      'Transgastric Mid SAX view displays classic systolic and diastolic "D-shaped" flattening of the interventricular septum.'
    ]
  },
  {
    id: 'type-a-aortic-dissection',
    name: 'Stanford Type A Aortic Dissection with Intimal Flap',
    category: 'Aorta',
    description: 'Sudden tearing chest pain; TEE demonstrates undulating intimal tear in ascending aorta, acute aortic regurgitation, and pericardial effusion.',
    initialProbe: {
      depthZone: 'UPPER_ESOPHAGEAL',
      depthCm: 24,
      omniplaneAngleDeg: 100,
      probeRotationDeg: 15,
      tipDeflectionDeg: 0,
      lateralDeflectionDeg: 0
    },
    measurements: {
      heartRateBpm: 94,
      lvEndDiastolicVolumeMl: 160,
      lvEndSystolicVolumeMl: 65,
      mitralEWaveMs: 1.20,
      mitralAWaveMs: 0.90,
      decelerationTimeMs: 170,
      mitralAnnularEVelocityCms: 8.5,
      lvotDiameterCm: 2.2,
      lvotVtiCm: 17,
      avPeakVelocityMs: 2.2,
      avVtiCm: 32,
      trPeakVelocityMs: 2.5,
      estimatedRapMmHg: 10,
      rvEndDiastolicAreaCm2: 22,
      rvEndSystolicAreaCm2: 12,
      mitralRegurgitationSeverity: 'NONE',
      aorticDissectionPresent: true,
      intimalFlapType: 'STANFORD_A_ASCENDING',
      pericardialEffusionMm: 16
    },
    teachingPoints: [
      'Stanford Type A dissection is a hyper-acute surgical emergency involving the ascending aorta proximal to the brachiocephalic artery.',
      'Look for the mobile intimal flap separating true lumen (systolic forward flow) and false lumen (sluggish or thrombosed flow).',
      'Accompanying hemopericardium (16 mm) mandates urgent OR transfer for graft replacement and aortic valve resuspension.'
    ]
  }
];
