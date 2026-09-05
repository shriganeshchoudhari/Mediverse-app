/**
 * VentricularAssistEngine.ts
 *
 * Biophysical & Mechanical Circulatory Support (MCS) Simulation Engine for Mediverse.
 * Models microaxial transvalvular blood pumps (Impella CP, Impella 5.5, Impella RP),
 * extracorporeal support (TandemHeart), and multi-device ECPELLA synergy.
 * Implements P-level rotational kinetics (P-1 to P-9, 25,000 to 46,000 RPM),
 * Left Ventricular Pressure-Volume (PV) loop unloading dynamics, Cardiac Power Output (CPO),
 * purge cassette fluidics (D5W with heparin/bicarbonate), suction detection,
 * and hemolysis monitoring.
 *
 * Location: frontend/.gemini/skills/VentricularAssistEngine.ts
 */

export type MCSType =
  | 'IMPELLA_CP'
  | 'IMPELLA_5_5'
  | 'IMPELLA_RP'
  | 'TANDEMHEART'
  | 'ECPELLA';

export type PLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export type CannulaPosition =
  | 'CORRECT_TRANSVALVULAR' // Inflow in LV (4cm below AoV), outflow in Ao
  | 'MIGRATED_AORTA'        // Inflow pulled into ascending aorta (Ao-Ao, no unloading)
  | 'MIGRATED_DEEP_LV'      // Inflow jammed into LV apex / papillary muscle
  | 'SUCTION_SEPTUM';       // Inflow abutting interventricular septum

export type PurgeFluidType = 'D5W_HEPARIN' | 'D5W_SODIUM_BICARBONATE';

export type MCSAlarm =
  | 'OPTIMAL'
  | 'SUCTION'
  | 'CANNULA_MALPOSITION'
  | 'PURGE_PRESSURE_HIGH'
  | 'HEMOLYSIS_ALERT'
  | 'CRITICAL_HYPOVOLEMIA';

export interface MCSState {
  deviceType: MCSType;
  pLevel: PLevel;
  rpm: number;
  pumpFlowLMin: number;
  nativeCOLMin: number;
  totalCOLMin: number;
  mapMmHg: number;
  lvedpMmHg: number;
  cvpMmHg: number;
  pcwpMmHg: number;
  cardiacPowerOutputWatts: number; // CPO = (MAP * CO) / 451 (target >0.6 W)
  cannulaPosition: CannulaPosition;
  purgeFluid: PurgeFluidType;
  purgePressureMmHg: number; // Normal 300 - 1100 mmHg
  purgeFlowMlHr: number; // Normal 2 - 30 mL/hr
  plasmaFreeHbMgDl: number; // Normal <20, >40 = severe hemolysis
  ldhUL: number; // Normal <250 U/L
  activeAlarms: MCSAlarm[];
  ecmoFlowLMin?: number; // Active in ECPELLA mode
}

export type VCSPresetId =
  | 'cardiogenic-shock-scaife-impella-cp'
  | 'ecpella-synergy-severe-distension'
  | 'acute-inflow-suction-hypovolemia'
  | 'cannula-malposition-inflow-aorta'
  | 'biventricular-failure-impella-rp'
  | 'purge-gap-thrombus-hit';

export interface VCSPresetInfo {
  id: VCSPresetId;
  title: string;
  category: 'Cardiogenic Shock' | 'ECPELLA Synergy' | 'Complication / Alarm' | 'Biventricular Support';
  description: string;
  pathophysiology: string;
  deviceType: MCSType;
  defaultPLevel: PLevel;
  initialState: MCSState;
  managementLadder: string[];
  boardReviewPearls: string[];
}

// ============================================================================
// 1. P-LEVEL ROTATIONAL KINETICS
// ============================================================================

export interface PLevelSpecs {
  rpm: number;
  impellaCpFlowLMin: number;
  impella55FlowLMin: number;
  impellaRpFlowLMin: number;
}

export const P_LEVEL_SPECS: Record<PLevel, PLevelSpecs> = {
  1: { rpm: 25000, impellaCpFlowLMin: 1.0, impella55FlowLMin: 1.2, impellaRpFlowLMin: 1.0 },
  2: { rpm: 28000, impellaCpFlowLMin: 1.5, impella55FlowLMin: 1.8, impellaRpFlowLMin: 1.5 },
  3: { rpm: 31000, impellaCpFlowLMin: 2.0, impella55FlowLMin: 2.5, impellaRpFlowLMin: 2.0 },
  4: { rpm: 34000, impellaCpFlowLMin: 2.5, impella55FlowLMin: 3.1, impellaRpFlowLMin: 2.5 },
  5: { rpm: 37000, impellaCpFlowLMin: 3.0, impella55FlowLMin: 3.7, impellaRpFlowLMin: 3.0 },
  6: { rpm: 40000, impellaCpFlowLMin: 3.3, impella55FlowLMin: 4.2, impellaRpFlowLMin: 3.3 },
  7: { rpm: 42000, impellaCpFlowLMin: 3.5, impella55FlowLMin: 4.6, impellaRpFlowLMin: 3.5 },
  8: { rpm: 44000, impellaCpFlowLMin: 3.8, impella55FlowLMin: 5.0, impellaRpFlowLMin: 3.8 },
  9: { rpm: 46000, impellaCpFlowLMin: 4.0, impella55FlowLMin: 5.5, impellaRpFlowLMin: 4.0 },
};

export function getPumpSpeedAndFlow(device: MCSType, pLevel: PLevel): { rpm: number; flowLMin: number } {
  const specs = P_LEVEL_SPECS[pLevel];
  if (device === 'IMPELLA_5_5') {
    return { rpm: specs.rpm, flowLMin: specs.impella55FlowLMin };
  } else if (device === 'IMPELLA_RP') {
    return { rpm: specs.rpm, flowLMin: specs.impellaRpFlowLMin };
  } else {
    // Impella CP, ECPELLA, or TandemHeart
    return { rpm: specs.rpm, flowLMin: specs.impellaCpFlowLMin };
  }
}

// ============================================================================
// 2. CLINICAL PRESETS CATALOG
// ============================================================================

export const MCS_PRESETS: Record<VCSPresetId, VCSPresetInfo> = {
  'cardiogenic-shock-scaife-impella-cp': {
    id: 'cardiogenic-shock-scaife-impella-cp',
    title: 'Severe Acute MI Cardiogenic Shock (SCAI Stage D)',
    category: 'Cardiogenic Shock',
    description: 'Acute extensive anterior STEMI with severe left ventricular decompensation (EF 15%), high filling pressures (LVEDP 28 mmHg), profound hypotension (MAP 54 mmHg), and critical hypoperfusion (CPO 0.38 W). Rescued with Impella CP at P-8.',
    pathophysiology: 'Profound loss of contractile myocardium leads to elevated LVEDP, pulmonary congestion, decreased stroke volume, and systemic hypoperfusion, creating a downward spiral of coronary hypoperfusion and worsening ischemia.',
    deviceType: 'IMPELLA_CP',
    defaultPLevel: 8,
    initialState: {
      deviceType: 'IMPELLA_CP',
      pLevel: 8,
      rpm: 44000,
      pumpFlowLMin: 3.8,
      nativeCOLMin: 1.2,
      totalCOLMin: 5.0,
      mapMmHg: 76,
      lvedpMmHg: 12,
      cvpMmHg: 9,
      pcwpMmHg: 14,
      cardiacPowerOutputWatts: 0.84, // (76 * 5.0) / 451 = 0.84 W (>0.6 W target)
      cannulaPosition: 'CORRECT_TRANSVALVULAR',
      purgeFluid: 'D5W_HEPARIN',
      purgePressureMmHg: 520,
      purgeFlowMlHr: 12.5,
      plasmaFreeHbMgDl: 16,
      ldhUL: 310,
      activeAlarms: ['OPTIMAL']
    },
    managementLadder: [
      'Early pre-PCI mechanical circulatory support initiation (Door-to-Unload paradigm).',
      'Titrate Impella to P-7 or P-8 to achieve Cardiac Power Output (CPO) >0.6 W.',
      'Wean high-dose vasopressors (Norepinephrine, Epinephrine) to reduce myocardial oxygen consumption (MVO2).',
      'Target LVEDP <15 mmHg and PCWP <18 mmHg.'
    ],
    boardReviewPearls: [
      'Cardiac Power Output (CPO = [MAP × CO] / 451) is the strongest hemodynamic predictor of mortality in cardiogenic shock; CPO <0.6 W predicts >50% in-hospital mortality.',
      'Impella CP continuously aspirates blood from the LV and expels it into the ascending aorta, actively decoupling LV work from systemic perfusion.',
      'Unloading the LV reduces wall stress (Laplace Law) and end-diastolic wall tension, augmenting subendocardial coronary perfusion gradient.'
    ]
  },

  'ecpella-synergy-severe-distension': {
    id: 'ecpella-synergy-severe-distension',
    title: 'ECPELLA Synergy (V-A ECMO Distension with Transvalvular Vent)',
    category: 'ECPELLA Synergy',
    description: 'Patient on V-A ECMO (4.5 L/min) develops afterload-induced left ventricular distension (LVEDP 34 mmHg), complete loss of aortic valve opening, intra-cavitary blood stasis, and hemorrhagic pulmonary edema. Impella vent decompresses the LV.',
    pathophysiology: 'V-A ECMO injects high-pressure retro-grade flow into the femoral artery, elevating LV afterload against a failing ventricle. If the LV cannot overcome this afterload, the aortic valve remains shut, causing massive cavity distension, secondary mitral regurgitation, and fatal pulmonary edema.',
    deviceType: 'ECPELLA',
    defaultPLevel: 6,
    initialState: {
      deviceType: 'ECPELLA',
      pLevel: 6,
      rpm: 40000,
      pumpFlowLMin: 3.3,
      nativeCOLMin: 0.6,
      totalCOLMin: 5.4,
      mapMmHg: 82,
      lvedpMmHg: 11, // Successfully unloaded from 34 mmHg!
      cvpMmHg: 11,
      pcwpMmHg: 13,
      cardiacPowerOutputWatts: 0.98,
      cannulaPosition: 'CORRECT_TRANSVALVULAR',
      purgeFluid: 'D5W_HEPARIN',
      purgePressureMmHg: 560,
      purgeFlowMlHr: 14.0,
      plasmaFreeHbMgDl: 22,
      ldhUL: 420,
      activeAlarms: ['OPTIMAL'],
      ecmoFlowLMin: 4.5
    },
    managementLadder: [
      'Immediate deployment of transvalvular Impella vent (ECPELLA) or atrial septostomy.',
      'Set Impella to P-5 to P-7 to actively aspirate blood across the locked aortic valve.',
      'Verify aortic valve opening or pulsatile arterial line tracing to prevent intra-ventricular thrombosis.',
      'Monitor chest X-ray for rapid clearance of hydrostatic alveolar edema.'
    ],
    boardReviewPearls: [
      'ECPELLA combines the total cardiopulmonary support of V-A ECMO with the active mechanical unloading of Impella.',
      'Without LV venting, V-A ECMO increases LV end-diastolic pressure exponentially and induces left ventricular blood stasis ("smoke" on echocardiography).',
      'Impella venting decreases left atrial pressure and prevents hydrostatic pulmonary capillary rupture.'
    ]
  },

  'acute-inflow-suction-hypovolemia': {
    id: 'acute-inflow-suction-hypovolemia',
    title: 'Acute Inflow Suction Alarm & Hypovolemia',
    category: 'Complication / Alarm',
    description: 'Patient on Impella CP at P-8 triggers persistent Suction alarms with motor current spikes, sharp flow drop (3.8 -> 1.4 L/min), and ventricular diastolic collapse caused by acute bleeding and hypovolemia (CVP 3 mmHg).',
    pathophysiology: 'When intravascular volume is depleted or right ventricular failure reduces left-sided filling, the high negative intake pressure of the microaxial impeller pulls the ventricular free wall or septum directly into the inflow cage.',
    deviceType: 'IMPELLA_CP',
    defaultPLevel: 8,
    initialState: {
      deviceType: 'IMPELLA_CP',
      pLevel: 8,
      rpm: 44000,
      pumpFlowLMin: 1.4, // Suction drops forward flow
      nativeCOLMin: 1.0,
      totalCOLMin: 2.4,
      mapMmHg: 52,
      lvedpMmHg: 4,
      cvpMmHg: 3, // Severe hypovolemia!
      pcwpMmHg: 6,
      cardiacPowerOutputWatts: 0.28,
      cannulaPosition: 'SUCTION_SEPTUM',
      purgeFluid: 'D5W_HEPARIN',
      purgePressureMmHg: 510,
      purgeFlowMlHr: 11.5,
      plasmaFreeHbMgDl: 38, // Elevated due to shear stress against tissue
      ldhUL: 580,
      activeAlarms: ['SUCTION', 'CRITICAL_HYPOVOLEMIA']
    },
    managementLadder: [
      'Immediately decrease P-level to P-2 or P-3 to release suction and avoid myocardial trauma.',
      'Administer rapid crystalloid or blood product bolus (500 - 1000 mL) to restore CVP >8 - 10 mmHg.',
      'Perform bedside echocardiography to assess RV function, volume status, and cannula position.',
      'Gradually re-escalate P-level once adequate preload is restored.'
    ],
    boardReviewPearls: [
      'Suction alarms are primarily caused by underfilling (hypovolemia, RV failure, tamponade) or mechanical abutment against the septum/papillary muscle.',
      'Persistent suction causes acute mechanical hemolysis and endocardial contusion/arrhythmias.',
      'Never ignore suction: stepping down P-level immediately breaks the mechanical vacuum.'
    ]
  },

  'cannula-malposition-inflow-aorta': {
    id: 'cannula-malposition-inflow-aorta',
    title: 'Cannula Migration: Inflow Retracted into Ascending Aorta',
    category: 'Complication / Alarm',
    description: 'The Impella catheter has retracted retrograde across the aortic valve. Both inflow and outflow now reside in the ascending aorta ("Ao-Ao" position). Left ventricular unloading is completely lost (LVEDP rebounds to 26 mmHg).',
    pathophysiology: 'Catheter slack or patient movement causes the catheter tip to migrate back into the aorta. The optical placement signal shows an isobaric aortic waveform with absence of ventricular pulsatility, and blood is merely recirculated in the aorta.',
    deviceType: 'IMPELLA_CP',
    defaultPLevel: 7,
    initialState: {
      deviceType: 'IMPELLA_CP',
      pLevel: 7,
      rpm: 42000,
      pumpFlowLMin: 2.1,
      nativeCOLMin: 1.5,
      totalCOLMin: 2.5,
      mapMmHg: 62,
      lvedpMmHg: 26, // Rebounded high LVEDP!
      cvpMmHg: 12,
      pcwpMmHg: 22,
      cardiacPowerOutputWatts: 0.34,
      cannulaPosition: 'MIGRATED_AORTA',
      purgeFluid: 'D5W_HEPARIN',
      purgePressureMmHg: 530,
      purgeFlowMlHr: 12.0,
      plasmaFreeHbMgDl: 28,
      ldhUL: 490,
      activeAlarms: ['CANNULA_MALPOSITION']
    },
    managementLadder: [
      'Reduce P-level to P-2 prior to any catheter repositioning to minimize aortic valve leaflet injury.',
      'Under fluoroscopy or transesophageal echocardiography (TEE), gently advance the catheter across the aortic valve.',
      'Position the inflow cage 4.0 - 4.5 cm into the LV cavity, oriented toward the cardiac apex away from the anterior mitral leaflet.',
      'Re-secure catheter at the femoral sheath with sterile repositioning unit.'
    ],
    boardReviewPearls: [
      'In the "Ao-Ao" position, the optical sensor reveals an aortic waveform rather than the classic wide-pulse ventricular waveform.',
      'Repositioning an Impella at full RPM risks tearing the aortic valve leaflets or chordae tendineae; always drop to P-2 first.',
      'Loss of LV unloading results in rapid rebound of pulmonary capillary wedge pressure.'
    ]
  },

  'biventricular-failure-impella-rp': {
    id: 'biventricular-failure-impella-rp',
    title: 'Refractory RV Shock with Biventricular Support (Impella CP + RP)',
    category: 'Biventricular Support',
    description: 'Acute right ventricular infarction following inferior-posterior STEMI. Severe right heart failure (CVP 22 mmHg, PAPi 0.45) refractory to inodilators. Rescued with dual microaxial biventricular support (Impella CP in LV + Impella RP in RV).',
    pathophysiology: 'Severe RV ischemic dysfunction creates right ventricular forward failure, underfilling the left heart. The addition of an Impella RP delivers blood directly from the IVC/RA into the main pulmonary artery, restoring LV preload.',
    deviceType: 'IMPELLA_RP',
    defaultPLevel: 8,
    initialState: {
      deviceType: 'IMPELLA_RP',
      pLevel: 8,
      rpm: 44000,
      pumpFlowLMin: 3.8,
      nativeCOLMin: 1.4,
      totalCOLMin: 5.2,
      mapMmHg: 78,
      lvedpMmHg: 12,
      cvpMmHg: 11, // Reduced from 22 mmHg!
      pcwpMmHg: 12,
      cardiacPowerOutputWatts: 0.90,
      cannulaPosition: 'CORRECT_TRANSVALVULAR',
      purgeFluid: 'D5W_HEPARIN',
      purgePressureMmHg: 490,
      purgeFlowMlHr: 15.0,
      plasmaFreeHbMgDl: 18,
      ldhUL: 340,
      activeAlarms: ['OPTIMAL']
    },
    managementLadder: [
      'Percutaneous Impella RP deployment via 23F femoral venous sheath.',
      'Cross tricuspid and pulmonic valves; position outlet in main pulmonary artery.',
      'Titrate Impella RP flow to 3.5 - 4.0 L/min to decompress RA/CVP (<12 mmHg).',
      'Coordinate with Left-sided support (Impella CP) to avoid pulmonary overcirculation.'
    ],
    boardReviewPearls: [
      'Pulmonary Artery Pulsatility Index (PAPi = [PASP - PADP] / CVP) <0.9 - 1.0 strongly predicts acute RV failure requiring mechanical support.',
      'Impella RP bypasses the failing RV, pumping desaturated systemic venous blood directly into the pulmonary arterial bed.',
      'Left ventricular support alone cannot succeed if RV forward failure deprives the LV of preload.'
    ]
  },

  'purge-gap-thrombus-hit': {
    id: 'purge-gap-thrombus-hit',
    title: 'Purge System Motor Gap Clot (Heparin-Induced Thrombocytopenia)',
    category: 'Complication / Alarm',
    description: 'Patient develops Heparin-Induced Thrombocytopenia (HIT). Sudden spike in purge line pressure (>1100 mmHg) with declining purge flow (<3 mL/hr) caused by fibrin/clot precipitation in the micro-gap. Rescued with Sodium Bicarbonate purge solution.',
    pathophysiology: 'The purge solution lubricates the high-speed motor bearing and prevents blood from entering the motor casing. In HIT or with inadequate purge flow, platelets and fibrin enter the micro-gap, increasing mechanical friction and triggering motor stall risk.',
    deviceType: 'IMPELLA_CP',
    defaultPLevel: 7,
    initialState: {
      deviceType: 'IMPELLA_CP',
      pLevel: 7,
      rpm: 42000,
      pumpFlowLMin: 3.5,
      nativeCOLMin: 1.5,
      totalCOLMin: 5.0,
      mapMmHg: 74,
      lvedpMmHg: 13,
      cvpMmHg: 8,
      pcwpMmHg: 14,
      cardiacPowerOutputWatts: 0.82,
      cannulaPosition: 'CORRECT_TRANSVALVULAR',
      purgeFluid: 'D5W_HEPARIN',
      purgePressureMmHg: 1180, // Alarm >1100 mmHg!
      purgeFlowMlHr: 2.2, // Critical low purge flow!
      plasmaFreeHbMgDl: 34,
      ldhUL: 520,
      activeAlarms: ['PURGE_PRESSURE_HIGH']
    },
    managementLadder: [
      'Confirm Heparin-Induced Thrombocytopenia (HIT 4T score and PF4 antibody test).',
      'Immediately replace D5W-heparin purge cassette with D5W + Sodium Bicarbonate (25 mEq/L).',
      'Switch systemic anticoagulation to direct thrombin inhibitor (Argatroban or Bivalirudin).',
      'Perform purge line de-air and purge flush procedure via the Automated Impella Controller.'
    ],
    boardReviewPearls: [
      'Normal purge pressure is 300 - 1100 mmHg; pressures >1100 mmHg signal motor gap obstruction or line kink.',
      'Sodium bicarbonate (25 or 50 mEq/L in D5W) is the standard alternative purge fluid in patients with heparin allergy or HIT.',
      'Loss of purge flow will result in blood aspiration into the motor and catastrophic pump stop within minutes.'
    ]
  }
};

export const VCS_PRESETS = MCS_PRESETS;
export type MCSPresetId = VCSPresetId;
export type MCSPresetInfo = VCSPresetInfo;

// ============================================================================
// 3. BIOPHYSICAL SOLVERS & HEADING EVALUATION
// ============================================================================

/**
 * Calculates Cardiac Power Output (CPO) in Watts
 * CPO = (MAP * Total CO) / 451
 */
export function computeCardiacPowerOutput(mapMmHg: number, totalCOLMin: number): number {
  if (mapMmHg <= 0 || totalCOLMin <= 0) return 0;
  return Number(((mapMmHg * totalCOLMin) / 451).toFixed(2));
}

/**
 * Evaluates Left Ventricular Unloading based on P-Level and Cannula Position
 */
export function evaluateLVUnloading(
  device: MCSType,
  pLevel: PLevel,
  cannulaPos: CannulaPosition,
  cvpMmHg: number,
  baseLvedp: number = 28,
  baseMap: number = 55
): {
  pumpFlowLMin: number;
  lvedpMmHg: number;
  mapMmHg: number;
  cpoWatts: number;
  alarms: MCSAlarm[];
} {
  const { flowLMin } = getPumpSpeedAndFlow(device, pLevel);
  const alarms: MCSAlarm[] = [];

  let effectiveFlow = flowLMin;
  let lvedp = baseLvedp;
  let map = baseMap;

  // Suction Condition: Low CVP (<5 mmHg) or septum abutment at P >= 4
  if ((cvpMmHg < 5 || cannulaPos === 'SUCTION_SEPTUM') && pLevel >= 4) {
    alarms.push('SUCTION');
    if (cvpMmHg < 5) alarms.push('CRITICAL_HYPOVOLEMIA');
    effectiveFlow = Math.min(1.5, flowLMin * 0.4); // Suction severely drops forward flow
  }

  // Malposition Condition: Retracted into aorta ("Ao-Ao")
  if (cannulaPos === 'MIGRATED_AORTA') {
    alarms.push('CANNULA_MALPOSITION');
    // No LV unloading occurs! LVEDP remains high
    lvedp = baseLvedp;
    effectiveFlow = Math.min(2.0, flowLMin * 0.5);
    map = baseMap + 8;
  } else if (!alarms.includes('SUCTION')) {
    // Normal / Successful Unloading
    const unloadingMagnitude = effectiveFlow * 4.2;
    lvedp = Math.max(8, Number((baseLvedp - unloadingMagnitude).toFixed(1)));
    map = Math.min(95, Number((baseMap + effectiveFlow * 6.5).toFixed(1)));
  }

  const nativeCO = 1.2;
  const totalCO = Number((nativeCO + effectiveFlow).toFixed(1));
  const cpoWatts = computeCardiacPowerOutput(map, totalCO);

  if (alarms.length === 0) {
    alarms.push('OPTIMAL');
  }

  return {
    pumpFlowLMin: Number(effectiveFlow.toFixed(1)),
    lvedpMmHg: lvedp,
    mapMmHg: map,
    cpoWatts,
    alarms
  };
}

/**
 * Pressure-Volume Loop Coordinate Generator for Real-Time Canvas
 * Generates an array of { volumeMl, pressureMmHg } defining the PV loop
 */
export function generatePVLoopCoordinates(
  lvedpMmHg: number,
  mapMmHg: number,
  pLevel: PLevel
): { volumeMl: number; pressureMmHg: number }[] {
  // As P-level rises and LVEDP falls, the loop shifts LEFTWARD and loop area shrinks (unloaded LV)
  const unloadingFactor = pLevel / 9.0;
  const edvMl = 140 - unloadingFactor * 45; // 140 -> 95 mL
  const esvMl = 80 - unloadingFactor * 35;  // 80 -> 45 mL
  const peakSysPressure = Math.max(mapMmHg + 10, 110 - unloadingFactor * 25);

  return [
    { volumeMl: edvMl, pressureMmHg: lvedpMmHg }, // End-Diastole
    { volumeMl: edvMl - 5, pressureMmHg: peakSysPressure * 0.8 }, // Isovolumetric contraction
    { volumeMl: (edvMl + esvMl) / 2, pressureMmHg: peakSysPressure }, // Peak systole
    { volumeMl: esvMl, pressureMmHg: peakSysPressure * 0.9 }, // End-Systole
    { volumeMl: esvMl, pressureMmHg: 10 }, // Isovolumetric relaxation
    { volumeMl: (edvMl + esvMl) / 2, pressureMmHg: lvedpMmHg * 0.7 }, // Early filling
    { volumeMl: edvMl, pressureMmHg: lvedpMmHg } // Close loop
  ];
}
