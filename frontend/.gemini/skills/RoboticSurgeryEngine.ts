/**
 * RoboticSurgeryEngine.ts
 *
 * Biophysical & Minimally Invasive Surgical Simulation Engine for Mediverse.
 * Models robotic-assisted laparoscopy (da Vinci surgical geometry, EndoWrist 7-DOF kinematics),
 * pneumoperitoneum CO2 insufflation hydraulics, steep Trendelenburg respiratory/hemodynamic coupling,
 * electrosurgical energy biophysics (Monopolar, Bipolar, Ultrasonic Harmonic),
 * and critical laparoscopic emergencies (CO2 gas embolism, tension pneumoperitoneum,
 * capacitive coupling bowel burns, and Critical View of Safety in Calot's triangle).
 *
 * Location: frontend/.gemini/skills/RoboticSurgeryEngine.ts
 */

export type SurgicalProcedureType =
  | 'ROBOTIC_PROSTATECTOMY'
  | 'LAP_CHOLECYSTECTOMY'
  | 'ROBOTIC_PARTIAL_NEPHRECTOMY'
  | 'PELVIC_LYMPH_DISSECTION'
  | 'LAP_APPENDECTOMY';

export type PatientPosition =
  | 'STEEP_TRENDELENBURG' // -30° (RARP, pelvic surgery)
  | 'MODERATE_TRENDELENBURG' // -15°
  | 'NEUTRAL' // 0°
  | 'REVERSE_TRENDELENBURG'; // +20° (Lap cholecystectomy)

export type EnergyModality =
  | 'MONOPOLAR_CUT'
  | 'MONOPOLAR_COAG'
  | 'BIPOLAR'
  | 'ULTRASONIC_HARMONIC';

export type RoboticInstrumentType =
  | 'HOT_SHEARS_MONOPOLAR'
  | 'FENESTRATED_BIPOLAR'
  | 'PROGRASP_FORCEPS'
  | 'LARGE_NEEDLE_DRIVER'
  | 'VESSEL_SEALER';

export type SurgicalAlarm =
  | 'OPTIMAL'
  | 'CO2_GAS_EMBOLISM'
  | 'TENSION_PNEUMOPERITONEUM'
  | 'HIGH_AIRWAY_PRESSURE'
  | 'WARM_ISCHEMIA_EXCEEDED'
  | 'CAPACITIVE_COUPLING_RISK'
  | 'HYPOTENSION_IVC_COLLAPSE';

export interface RoboticSurgeryState {
  procedure: SurgicalProcedureType;
  tableTiltDeg: number; // -30 (steep Trendelenburg) to +25 (reverse Trendelenburg)
  iapMmHg: number; // Intra-abdominal pressure (normal 12 - 15 mmHg)
  co2FlowLMin: number; // Insufflation flow (0 - 40 L/min)
  totalCo2InsufflatedL: number;
  activeEnergy: EnergyModality;
  energyPowerWatts: number;
  activeInstrumentArm1: RoboticInstrumentType;
  activeInstrumentArm2: RoboticInstrumentType;
  motionScaling: '1:1' | '2:1' | '3:1';
  tremorFilterEnabled: boolean;
  warmIschemiaSeconds: number; // For partial nephrectomy, safe <1500s (25 min)
  clampApplied: boolean;
  criticalViewOfSafetyConfirmed: boolean; // For Lap Chole
  durantManeuverActive: boolean; // Rescue for gas embolism
  etCo2MmHg: number; // End-tidal CO2 (normal 35 - 45 mmHg)
  peakAirwayPressureCmH2O: number; // Normal <25, high >35
  lungComplianceMlCmH2O: number; // Drops with pneumoperitoneum + Trendelenburg
  mapMmHg: number;
  cardiacOutputLMin: number;
  centralVenousPressureMmHg: number;
  activeAlarms: SurgicalAlarm[];
}

export type RoboticPresetId =
  | 'robotic-radical-prostatectomy-steep-trendelenburg'
  | 'laparoscopic-cholecystectomy-critical-view-safety'
  | 'acute-co2-gas-embolism-emergency'
  | 'tension-pneumoperitoneum-abdominal-compartment'
  | 'stray-current-capacitive-coupling-bowel'
  | 'robotic-partial-nephrectomy-warm-ischemia';

export interface RoboticPresetInfo {
  id: RoboticPresetId;
  title: string;
  category: 'Robotic Pelvic Surgery' | 'General Laparoscopy' | 'Surgical Crisis / Complication' | 'Urologic Oncology';
  description: string;
  pathophysiology: string;
  procedure: SurgicalProcedureType;
  defaultPosition: PatientPosition;
  initialState: RoboticSurgeryState;
  surgicalSteps: string[];
  boardReviewPearls: string[];
}

// ============================================================================
// 1. BIOPHYSICAL MODELS & EQUATIONS
// ============================================================================

/**
 * Computes respiratory mechanics and hemodynamics under pneumoperitoneum and tilt
 */
export function computePneumoperitoneumHemodynamics(
  iapMmHg: number,
  tableTiltDeg: number, // Negative = Trendelenburg, Positive = Reverse Trendelenburg
  isGasEmbolism: boolean = false,
  isDurantManeuver: boolean = false
): {
  peakAirwayPressureCmH2O: number;
  lungComplianceMlCmH2O: number;
  etCo2MmHg: number;
  mapMmHg: number;
  cardiacOutputLMin: number;
  cvpMmHg: number;
  alarms: SurgicalAlarm[];
} {
  const alarms: SurgicalAlarm[] = [];

  // Baseline respiratory metrics
  const baselineCompliance = 50; // mL/cmH2O
  // Trendelenburg pushes abdominal viscera against diaphragm, reducing compliance
  const tiltDiaphragmPenalty = Math.max(0, -tableTiltDeg * 0.45);
  const iapCompliancePenalty = (iapMmHg - 5) * 1.3;
  const lungCompliance = Math.max(16, Number((baselineCompliance - tiltDiaphragmPenalty - iapCompliancePenalty).toFixed(1)));

  // Peak Airway Pressure: Ppeak = (Tidal Volume / Compliance) + Raw * Flow + PEEP
  // Approximated as proportional to compliance drop and IAP transmission
  const iapTransmitted = (iapMmHg - 8) * 1.25;
  const tiltTransmitted = Math.max(0, -tableTiltDeg * 0.38);
  const peakAirwayPressure = Math.round(18 + iapTransmitted + tiltTransmitted);

  if (peakAirwayPressure >= 35) {
    alarms.push('HIGH_AIRWAY_PRESSURE');
  }

  // Hemodynamics:
  // Normal IAP (12-15) causes mild SVR elevation and maintained/mildly reduced CO
  // High IAP (>15) compresses the IVC, reducing venous return and severely impairing CO
  let cardiacOutput = 5.0;
  let map = 75;
  let cvp = 8;
  let etCo2 = 38;

  if (iapMmHg <= 15) {
    cardiacOutput = 5.0 - (iapMmHg - 10) * 0.08;
    map = 75 + (iapMmHg - 10) * 1.5;
    cvp = 8 + (iapMmHg - 10) * 0.6;
    etCo2 = 38 + (iapMmHg - 10) * 0.8; // CO2 absorption from peritoneal cavity
  } else {
    // Excessive IAP / Tension pneumoperitoneum
    const excessIap = iapMmHg - 15;
    cardiacOutput = Math.max(1.8, 4.6 - excessIap * 0.45);
    map = Math.max(45, 82 - excessIap * 3.8); // IVC collapse leads to hypotension
    cvp = 12 + excessIap * 1.4; // False elevation of CVP from intra-thoracic pressure transmission
    etCo2 = 42 + excessIap * 1.2;
    alarms.push('TENSION_PNEUMOPERITONEUM');
    alarms.push('HYPOTENSION_IVC_COLLAPSE');
  }

  // Reverse Trendelenburg reduces venous return further
  if (tableTiltDeg > 0) {
    cardiacOutput -= tableTiltDeg * 0.03;
    map -= tableTiltDeg * 0.3;
  }

  // Steep Trendelenburg increases venous return to heart, but increases CVP
  if (tableTiltDeg < 0) {
    cvp += Math.abs(tableTiltDeg) * 0.22;
  }

  // Acute CO2 Gas Embolism Overrides
  if (isGasEmbolism) {
    alarms.push('CO2_GAS_EMBOLISM');
    if (isDurantManeuver) {
      // Durant's maneuver (Left lateral decubitus + Trendelenburg) air bubble floats to RV apex, restoring outflow
      etCo2 = 28;
      cardiacOutput = Math.min(3.8, cardiacOutput);
      map = Math.min(68, map);
    } else {
      // Gas lock in RV outflow tract leads to sudden loss of pulmonary perfusion
      etCo2 = 14; // Sudden precipitous fall in EtCO2
      cardiacOutput = Math.max(1.5, cardiacOutput * 0.35);
      map = Math.max(42, map * 0.55);
    }
  }

  if (alarms.length === 0) {
    alarms.push('OPTIMAL');
  }

  return {
    peakAirwayPressureCmH2O: peakAirwayPressure,
    lungComplianceMlCmH2O: lungCompliance,
    etCo2MmHg: Math.round(etCo2),
    mapMmHg: Math.round(map),
    cardiacOutputLMin: Number(cardiacOutput.toFixed(1)),
    cvpMmHg: Math.round(cvp),
    alarms: Array.from(new Set(alarms))
  };
}

/**
 * Calculates electrosurgical thermal spread radius in mm
 */
export function computeThermalSpreadMm(modality: EnergyModality, watts: number): number {
  switch (modality) {
    case 'MONOPOLAR_CUT':
      return Number((0.8 + watts * 0.02).toFixed(1));
    case 'MONOPOLAR_COAG':
      return Number((2.0 + watts * 0.05).toFixed(1)); // Monopolar coag has wide thermal spread (up to 4-5mm)
    case 'BIPOLAR':
      return Number((0.5 + watts * 0.015).toFixed(1)); // Localized between tines
    case 'ULTRASONIC_HARMONIC':
      return Number((0.3 + watts * 0.01).toFixed(1)); // Minimal lateral thermal injury (1-2mm)
  }
}

// ============================================================================
// 2. CURATED CLINICAL PRESETS CATALOG
// ============================================================================

export const ROBOTIC_SURGERY_PRESETS: Record<RoboticPresetId, RoboticPresetInfo> = {
  'robotic-radical-prostatectomy-steep-trendelenburg': {
    id: 'robotic-radical-prostatectomy-steep-trendelenburg',
    title: 'Robotic-Assisted Radical Prostatectomy (RARP): Steep Trendelenburg',
    category: 'Robotic Pelvic Surgery',
    description: '64yo male undergoing da Vinci multi-port RARP. Patient positioned in 30° steep Trendelenburg with 12 mmHg CO2 pneumoperitoneum. High peak airway pressure (33 cmH2O) and gradual EtCO2 rise require careful ventilatory titration.',
    pathophysiology: 'Steep Trendelenburg shifts heavy abdominal viscera cephalad against the diaphragm, reducing chest wall compliance and functional residual capacity (FRC). Intra-abdominal pressure transmits across the diaphragm, elevating peak airway pressure and risk of facial/airway edema.',
    procedure: 'ROBOTIC_PROSTATECTOMY',
    defaultPosition: 'STEEP_TRENDELENBURG',
    initialState: {
      procedure: 'ROBOTIC_PROSTATECTOMY',
      tableTiltDeg: -30,
      iapMmHg: 12,
      co2FlowLMin: 15,
      totalCo2InsufflatedL: 45,
      activeEnergy: 'MONOPOLAR_CUT',
      energyPowerWatts: 30,
      activeInstrumentArm1: 'HOT_SHEARS_MONOPOLAR',
      activeInstrumentArm2: 'FENESTRATED_BIPOLAR',
      motionScaling: '2:1',
      tremorFilterEnabled: true,
      warmIschemiaSeconds: 0,
      clampApplied: false,
      criticalViewOfSafetyConfirmed: false,
      durantManeuverActive: false,
      etCo2MmHg: 42,
      peakAirwayPressureCmH2O: 33,
      lungComplianceMlCmH2O: 22,
      mapMmHg: 82,
      cardiacOutputLMin: 4.8,
      centralVenousPressureMmHg: 16,
      activeAlarms: ['OPTIMAL']
    },
    surgicalSteps: [
      'Dock da Vinci Xi patient cart over left hip; calibrate optical 3D HD endoscope.',
      'Drop anterior bladder flap and open endopelvic fascia bilaterally.',
      'Ligate and divide dorsal venous complex (Santorini plexus) with 2-0 barbed suture.',
      'Dissect bilateral neurovascular bundles preserving erectile cavernous nerve fibers.',
      'Perform watertight vesicourethral anastomosis (Van Velthoven continuous technique).'
    ],
    boardReviewPearls: [
      'Steep Trendelenburg (>25°) prolonged for >3-4 hours markedly increases the risk of postoperative ischemic optic neuropathy (ION) and laryngeal edema.',
      'Before extubation following steep pelvic surgery, always perform a cuff-leak test to verify absence of airway edema.',
      'Tremor filtration removes normal 6-10 Hz physiological hand tremors, providing microsurgical stability.'
    ]
  },

  'laparoscopic-cholecystectomy-critical-view-safety': {
    id: 'laparoscopic-cholecystectomy-critical-view-safety',
    title: 'Laparoscopic Cholecystectomy: Critical View of Safety (CVS)',
    category: 'General Laparoscopy',
    description: '46yo female with acute calculous cholecystitis. Dissection of Calot\'s triangle to establish the Strasberg Critical View of Safety before clipping the cystic duct, preventing catastrophic common bile duct (CBD) transection.',
    pathophysiology: 'Severe inflammation and scarring in the hepatocystic triangle distort anatomical landmarks. Mistaking the common bile duct or right hepatic artery for the cystic duct leads to major vasculobiliary injury (Strasberg E).',
    procedure: 'LAP_CHOLECYSTECTOMY',
    defaultPosition: 'REVERSE_TRENDELENBURG',
    initialState: {
      procedure: 'LAP_CHOLECYSTECTOMY',
      tableTiltDeg: 20,
      iapMmHg: 14,
      co2FlowLMin: 12,
      totalCo2InsufflatedL: 32,
      activeEnergy: 'MONOPOLAR_COAG',
      energyPowerWatts: 30,
      activeInstrumentArm1: 'HOT_SHEARS_MONOPOLAR',
      activeInstrumentArm2: 'PROGRASP_FORCEPS',
      motionScaling: '1:1',
      tremorFilterEnabled: false,
      warmIschemiaSeconds: 0,
      clampApplied: false,
      criticalViewOfSafetyConfirmed: true,
      durantManeuverActive: false,
      etCo2MmHg: 39,
      peakAirwayPressureCmH2O: 22,
      lungComplianceMlCmH2O: 38,
      mapMmHg: 76,
      cardiacOutputLMin: 4.4,
      centralVenousPressureMmHg: 7,
      activeAlarms: ['OPTIMAL']
    },
    surgicalSteps: [
      'Cephalad traction on gallbladder fundus and lateral traction on infundibulum.',
      'Clear hepatocystic triangle of all fat and fibrous tissue.',
      'Dissect the lower third of the gallbladder off the cystic plate.',
      'Verify Critical View of Safety: exactly TWO structures (cystic duct & cystic artery) seen entering gallbladder base.',
      'Clip and divide cystic duct and artery only after 360° CVS confirmation.'
    ],
    boardReviewPearls: [
      'Strasberg Critical View of Safety (CVS) requires 3 criteria: (1) hepatocystic triangle cleared, (2) lower third of gallbladder dissected off liver bed, (3) exactly 2 structures enter gallbladder.',
      'Bile duct injuries (Strasberg E1-E5) occur most frequently when surgeons rely on "infundibular technique" instead of CVS.',
      'In severe frozen triangle of cholecystitis, conversion to subtotal cholecystectomy or open surgery is safe surgical judgment.'
    ]
  },

  'acute-co2-gas-embolism-emergency': {
    id: 'acute-co2-gas-embolism-emergency',
    title: 'Acute CO2 Venous Gas Embolism Emergency',
    category: 'Surgical Crisis / Complication',
    description: 'During pelvic lymphadenectomy, injury to a deep pelvic vein results in rapid entrainment of pressurized CO2 into the venous circulation. Sudden precipitous drop in EtCO2 (from 40 to 14 mmHg), tachycardia, and profound hypotension (MAP 48 mmHg).',
    pathophysiology: 'Inflow of CO2 gas into large low-pressure venous vessels creates a "gas lock" in the right ventricular outflow tract (RVOT), blocking pulmonary blood flow and causing acute right ventricular failure and cardiovascular collapse.',
    procedure: 'PELVIC_LYMPH_DISSECTION',
    defaultPosition: 'STEEP_TRENDELENBURG',
    initialState: {
      procedure: 'PELVIC_LYMPH_DISSECTION',
      tableTiltDeg: -25,
      iapMmHg: 15,
      co2FlowLMin: 20,
      totalCo2InsufflatedL: 55,
      activeEnergy: 'BIPOLAR',
      energyPowerWatts: 35,
      activeInstrumentArm1: 'FENESTRATED_BIPOLAR',
      activeInstrumentArm2: 'LARGE_NEEDLE_DRIVER',
      motionScaling: '2:1',
      tremorFilterEnabled: true,
      warmIschemiaSeconds: 0,
      clampApplied: false,
      criticalViewOfSafetyConfirmed: false,
      durantManeuverActive: false,
      etCo2MmHg: 14, // Dramatic precipitous drop!
      peakAirwayPressureCmH2O: 28,
      lungComplianceMlCmH2O: 26,
      mapMmHg: 48, // Severe shock!
      cardiacOutputLMin: 1.8,
      centralVenousPressureMmHg: 18,
      activeAlarms: ['CO2_GAS_EMBOLISM', 'HYPOTENSION_IVC_COLLAPSE']
    },
    surgicalSteps: [
      'IMMEDIATELY STOP INSUFFLATION and vent pneumoperitoneum to atmosphere.',
      'Hyperventilate with 100% FiO2 (increases oxygenation and accelerates CO2 blood reabsorption).',
      'Execute Durant\'s Maneuver: Place patient in steep Left Lateral Decubitus + Trendelenburg.',
      'Aspirate gas from right ventricle via central venous catheter if present.',
      'Administer IV fluid boluses and vasopressors to maintain right ventricular perfusion pressure.'
    ],
    boardReviewPearls: [
      'The hallmark sign of venous gas embolism under anesthesia is an abrupt, unexplained plunge in End-Tidal CO2 (EtCO2) accompanied by acute hypotension.',
      'Durant\'s maneuver (left lateral decubitus with head down) traps the gas bubble at the right ventricular apex, restoring RVOT flow.',
      'CO2 is 20 times more soluble in blood than air/nitrogen, which improves spontaneous dissolution once insufflation is halted.'
    ]
  },

  'tension-pneumoperitoneum-abdominal-compartment': {
    id: 'tension-pneumoperitoneum-abdominal-compartment',
    title: 'Tension Pneumoperitoneum & Abdominal Compartment Collapse',
    category: 'Surgical Crisis / Complication',
    description: 'Malfunctioning insufflator or stuck valve drives intra-abdominal pressure to 22 mmHg. Severe compression of the inferior vena cava plummets venous return, reducing cardiac output to 2.1 L/min, producing acute oliguria and peak airway pressures >38 cmH2O.',
    pathophysiology: 'Intra-abdominal pressures >15-18 mmHg exceed femoral and renal venous pressures, collapsing the IVC and renal microvasculature. Severe afterload increase combined with preload starvation collapses stroke volume and cardiac index.',
    procedure: 'ROBOTIC_PROSTATECTOMY',
    defaultPosition: 'STEEP_TRENDELENBURG',
    initialState: {
      procedure: 'ROBOTIC_PROSTATECTOMY',
      tableTiltDeg: -20,
      iapMmHg: 22, // Dangerous over-insufflation!
      co2FlowLMin: 40,
      totalCo2InsufflatedL: 80,
      activeEnergy: 'MONOPOLAR_CUT',
      energyPowerWatts: 30,
      activeInstrumentArm1: 'HOT_SHEARS_MONOPOLAR',
      activeInstrumentArm2: 'FENESTRATED_BIPOLAR',
      motionScaling: '2:1',
      tremorFilterEnabled: true,
      warmIschemiaSeconds: 0,
      clampApplied: false,
      criticalViewOfSafetyConfirmed: false,
      durantManeuverActive: false,
      etCo2MmHg: 51,
      peakAirwayPressureCmH2O: 39,
      lungComplianceMlCmH2O: 16,
      mapMmHg: 54,
      cardiacOutputLMin: 2.1,
      centralVenousPressureMmHg: 21,
      activeAlarms: ['TENSION_PNEUMOPERITONEUM', 'HIGH_AIRWAY_PRESSURE', 'HYPOTENSION_IVC_COLLAPSE']
    },
    surgicalSteps: [
      'Manually vent abdominal gas port; dial insufflator back to 12 mmHg.',
      'Confirm low-pressure setting and calibrate pressure sensor relief valve.',
      'Observe rapid rebound of venous return, cardiac output, and normalizing peak airway pressures.',
      'Check urine output and arterial blood gas for secondary lactic acidosis.'
    ],
    boardReviewPearls: [
      'Normal safe operating IAP in laparoscopic surgery is 12 - 15 mmHg. Pressures >20 mmHg cause iatrogenic Abdominal Compartment Syndrome (ACS).',
      'The triad of ACS under anesthesia: High peak airway pressures, acute oliguria, and unexplained refractory hypotension.',
      'Decreasing IAP to 10-12 mmHg immediately restores renal cortical perfusion and cardiac venous return.'
    ]
  },

  'stray-current-capacitive-coupling-bowel': {
    id: 'stray-current-capacitive-coupling-bowel',
    title: 'Capacitive Coupling & Insulation Failure Thermal Injury',
    category: 'Surgical Crisis / Complication',
    description: 'During pelvic lymph node dissection with monopolar electrosurgery, a microscopic break in instrument shaft insulation creates stray capacitive current arcing to an adjacent loop of ileum outside the camera visual field.',
    pathophysiology: 'Monopolar high-frequency current can jump through micro-cracks in insulation or induce current in adjacent metal trocars (capacitive coupling). Lateral thermal spread of 4-5 mm produces full-thickness bowel necrosis that presents as delayed peritonitis on postoperative day 3-5.',
    procedure: 'PELVIC_LYMPH_DISSECTION',
    defaultPosition: 'STEEP_TRENDELENBURG',
    initialState: {
      procedure: 'PELVIC_LYMPH_DISSECTION',
      tableTiltDeg: -20,
      iapMmHg: 13,
      co2FlowLMin: 15,
      totalCo2InsufflatedL: 40,
      activeEnergy: 'MONOPOLAR_COAG',
      energyPowerWatts: 45, // High voltage coag!
      activeInstrumentArm1: 'HOT_SHEARS_MONOPOLAR',
      activeInstrumentArm2: 'PROGRASP_FORCEPS',
      motionScaling: '2:1',
      tremorFilterEnabled: true,
      warmIschemiaSeconds: 0,
      clampApplied: false,
      criticalViewOfSafetyConfirmed: false,
      durantManeuverActive: false,
      etCo2MmHg: 40,
      peakAirwayPressureCmH2O: 24,
      lungComplianceMlCmH2O: 32,
      mapMmHg: 78,
      cardiacOutputLMin: 4.6,
      centralVenousPressureMmHg: 11,
      activeAlarms: ['CAPACITIVE_COUPLING_RISK']
    },
    surgicalSteps: [
      'Switch energy mode from Monopolar Coag to Bipolar or Ultrasonic Harmonic energy.',
      'Inspect entire length of bowel within 10 cm of electrosurgical instrument path.',
      'Identify blanching or thermal serosal discoloration on ileal surface.',
      'Oversew or resect injured bowel segment before concluding procedure.',
      'Replace defective insulated instrument sheath.'
    ],
    boardReviewPearls: [
      'Capacitive coupling occurs when radiofrequency current is transferred from an active electrode through intact insulation into adjacent conductive materials (metal cannula or bowel).',
      'Monopolar coagulation mode uses higher peak voltages (up to 4000V) than cutting mode (500V), dramatically increasing insulation breakdown risk.',
      'Unrecognized laparoscopic thermal bowel injuries typically present 3 to 7 days postoperatively with insidious fever, leukopenia, and peritonitis.'
    ]
  },

  'robotic-partial-nephrectomy-warm-ischemia': {
    id: 'robotic-partial-nephrectomy-warm-ischemia',
    title: 'Robotic Partial Nephrectomy: Warm Ischemia Tracking',
    category: 'Urologic Oncology',
    description: '56yo male with a 3.4 cm exophytic left renal cortex mass (cT1a). Robotic Bulldog clamping of renal artery and vein with live warm ischemia stopwatch running. Tumor excision and two-layer renorrhaphy must be completed within 25 minutes.',
    pathophysiology: 'Temporary cessation of renal blood flow causes acute cellular hypoxia, ATP depletion, and acute tubular injury. Warm ischemia time (WIT) exceeding 25-30 minutes leads to irreversible loss of functional nephron mass and chronic kidney disease.',
    procedure: 'ROBOTIC_PARTIAL_NEPHRECTOMY',
    defaultPosition: 'MODERATE_TRENDELENBURG',
    initialState: {
      procedure: 'ROBOTIC_PARTIAL_NEPHRECTOMY',
      tableTiltDeg: -15,
      iapMmHg: 12,
      co2FlowLMin: 12,
      totalCo2InsufflatedL: 38,
      activeEnergy: 'BIPOLAR',
      energyPowerWatts: 30,
      activeInstrumentArm1: 'HOT_SHEARS_MONOPOLAR',
      activeInstrumentArm2: 'LARGE_NEEDLE_DRIVER',
      motionScaling: '3:1',
      tremorFilterEnabled: true,
      warmIschemiaSeconds: 780, // 13 minutes into clamping
      clampApplied: true,
      criticalViewOfSafetyConfirmed: false,
      durantManeuverActive: false,
      etCo2MmHg: 39,
      peakAirwayPressureCmH2O: 23,
      lungComplianceMlCmH2O: 35,
      mapMmHg: 80,
      cardiacOutputLMin: 4.7,
      centralVenousPressureMmHg: 10,
      activeAlarms: ['OPTIMAL']
    },
    surgicalSteps: [
      'Mobilize colon medially; identify left ureter and gonadal vessels.',
      'Isolate main renal artery and vein; apply robotic bulldog vascular clamps.',
      'Excise 3.4 cm renal tumor with a 2-3 mm negative parenchymal margin using cold shears.',
      'Perform inner-layer caliceal and medullary vessel hemostatic renorrhaphy with 3-0 V-Loc suture.',
      'Place sliding-clip renorrhaphy outer cortical closure with Hem-o-lok clips; release bulldog clamps.'
    ],
    boardReviewPearls: [
      'Every minute of warm ischemia counts: "Every minute over 20 minutes increases risk of acute renal injury by 5%".',
      'The 3-stage trifecta for partial nephrectomy: negative surgical margins, zero surgical complications, and warm ischemia time <25 minutes.',
      'Selective arterial clamping (clamping only the tumor-feeding segmental branch) eliminates global renal parenchymal warm ischemia.'
    ]
  }
};

// Aliases
export const ROBOTIC_PRESETS = ROBOTIC_SURGERY_PRESETS;
