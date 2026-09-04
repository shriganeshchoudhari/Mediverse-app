/**
 * HematologyEngine.ts
 * Biomechanical & Rheological Engine for Blood Cellular Elements & Hemostasis
 * Location: frontend/.gemini/skills/3d/HematologyEngine.ts
 *
 * Implements:
 * 1. Erythrocyte (RBC) hydrodynamic tumbling, shear stress deformability index, and oxyhemoglobin saturation.
 * 2. Leukocyte (WBC/Neutrophil) endothelial marginating, rolling, and pseudopod diapedesis dynamics.
 * 3. Thrombocyte (Platelet) discoid quiescence vs. filopodial spiny shape change upon activation.
 * 4. Fibrin monomer polymerization network branching kinetics during secondary hemostasis.
 */

export interface BloodCellState {
  /** Individual rotation angular velocities for multiple simulated erythrocytes */
  rbcRotationSpeed: [number, number, number];
  /** RBC viscoelastic deformability index (0.0 relaxed biconcave -> 1.0 deformed in microcapillary shear) */
  rbcDeformationIndex: number;
  /** Leukocyte endothelial rolling / diapedesis progress (0.0 to 1.0) */
  wbcDiapedesisProgress: number;
  /** Platelet activation level (0.0 smooth discoid -> 1.0 spiny filopodia extended) */
  plateletActivationLevel: number;
  /** Fibrin mesh cross-linking and polymerization density (0.0 none -> 1.0 mature thrombus) */
  fibrinPolymerization: number;
  /** Oxygen saturation fraction (0.75 deoxygenated dark crimson -> 1.0 fully oxygenated scarlet) */
  oxygenSaturation: number;
  /** Dynamic PBR hex color calibrated to oxyhemoglobin saturation */
  rbcColor: string;
}

/**
 * Computes the real-time rheological and hemostatic state of blood cellular elements
 *
 * @param elapsedSeconds - Monotonic simulation time in seconds
 * @param oxygenSaturation - Fraction from 0.70 to 1.0 (default: 0.98)
 * @param activationState - Hemostatic challenge level: 'resting' | 'activated' | 'clotting'
 */
export function computeBloodCellState(
  elapsedSeconds: number,
  oxygenSaturation = 0.98,
  activationState: 'resting' | 'activated' | 'clotting' = 'resting'
): BloodCellState {
  const saO2 = Math.max(0.7, Math.min(1.0, oxygenSaturation));

  // Hydrodynamic tumbling speeds for 3 reference RBCs
  const speed1 = 0.35 + 0.08 * Math.sin(elapsedSeconds * 1.3);
  const speed2 = 0.28 + 0.06 * Math.cos(elapsedSeconds * 0.9);
  const speed3 = 0.42 + 0.10 * Math.sin(elapsedSeconds * 1.7);

  // Periodic shear deformation as RBCs traverse simulated capillary narrowing
  const deform = 0.25 + 0.25 * Math.abs(Math.sin(elapsedSeconds * 0.8));

  // WBC rolling progress along vascular endothelium
  const wbcRoll = (elapsedSeconds * 0.1) % 1.0;

  // Thrombocyte activation index
  let pltActivation = 0.0;
  let fibrinDensity = 0.0;

  if (activationState === 'activated') {
    pltActivation = 0.75;
    fibrinDensity = 0.25;
  } else if (activationState === 'clotting') {
    pltActivation = 1.0;
    // Fibrin cascade polymerization progresses asymptotically
    fibrinDensity = Math.min(1.0, 0.4 + 0.6 * Math.abs(Math.sin(elapsedSeconds * 0.3)));
  }

  // Color gradient: 75% = #7f1d1d (dark venous crimson), 100% = #dc2626 (bright arterial scarlet)
  const rbcColor = saO2 > 0.92 ? '#dc2626' : saO2 > 0.82 ? '#b91c1c' : '#7f1d1d';

  return {
    rbcRotationSpeed: [speed1, speed2, speed3],
    rbcDeformationIndex: deform,
    wbcDiapedesisProgress: wbcRoll,
    plateletActivationLevel: pltActivation,
    fibrinPolymerization: fibrinDensity,
    oxygenSaturation: saO2,
    rbcColor,
  };
}
