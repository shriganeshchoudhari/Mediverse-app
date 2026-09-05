/**
 * AnesthesiaMachineEngine.ts
 * 
 * Advanced Anesthesia Delivery Workstation & Volatile Vaporizer Engine
 * Simulates Circle Breathing System mechanics, Link-25 hypoxic proportioning guard,
 * Low-Flow Anesthesia kinetics, Fresh Gas Flow wash-in/wash-out time constants,
 * Age-adjusted Minimum Alveolar Concentration (MAC), alveolar-arterial uptake (FA/FI curves),
 * Carbon dioxide absorber canister exhaustion with ethyl violet indicator,
 * and clinical crisis protocols (Malignant Hyperthermia with Dantrolene dosing, pipeline O2 failure,
 * circuit disconnect, and incompetent unidirectional valve rebreathing).
 * 
 * Location: frontend/.gemini/skills/AnesthesiaMachineEngine.ts
 */

export type VolatileAgentId = 'sevoflurane' | 'desflurane' | 'isoflurane' | 'none';

export type CarrierGas = 'air_o2' | 'n2o_o2';

export type CircuitMode = 'ventilator' | 'bag_manual';

export type MACDepthState = 
  | 'AWAKE'
  | 'SEDATED'
  | 'SURGICAL_ANESTHESIA'
  | 'DEEP_ANESTHESIA'
  | 'BURST_SUPPRESSION';

export interface VolatileAgentProperties {
  id: VolatileAgentId;
  name: string;
  formula: string;
  bloodGasPartition: number;
  oilGasPartition: number;
  mac40Percent: number; // MAC at age 40 in 100% O2
  boilingPointC: number;
  vaporPressureMmHg: number; // at 20°C
  pungency: 'None' | 'Mild' | 'Moderate' | 'Severe';
  colorHex: string; // International color standard: Sevo=Yellow, Des=Blue, Iso=Purple
}

export const VOLATILE_AGENTS: Record<VolatileAgentId, VolatileAgentProperties> = {
  sevoflurane: {
    id: 'sevoflurane',
    name: 'Sevoflurane (Ultane)',
    formula: 'C4H3F7O',
    bloodGasPartition: 0.65,
    oilGasPartition: 47,
    mac40Percent: 2.05,
    boilingPointC: 58.5,
    vaporPressureMmHg: 157,
    pungency: 'None',
    colorHex: '#eab308', // Yellow
  },
  desflurane: {
    id: 'desflurane',
    name: 'Desflurane (Suprane)',
    formula: 'C3H2F6O',
    bloodGasPartition: 0.42,
    oilGasPartition: 19,
    mac40Percent: 6.0,
    boilingPointC: 22.8, // Near room temp - requires heated TEC 6 vaporizer (39°C, 2 atm)
    vaporPressureMmHg: 669,
    pungency: 'Severe',
    colorHex: '#3b82f6', // Blue
  },
  isoflurane: {
    id: 'isoflurane',
    name: 'Isoflurane (Forane)',
    formula: 'C3H2ClF5O',
    bloodGasPartition: 1.40,
    oilGasPartition: 98,
    mac40Percent: 1.15,
    boilingPointC: 48.5,
    vaporPressureMmHg: 238,
    pungency: 'Moderate',
    colorHex: '#a855f7', // Purple
  },
  none: {
    id: 'none',
    name: 'None (TIVA / Zero Volatile)',
    formula: '',
    bloodGasPartition: 0,
    oilGasPartition: 0,
    mac40Percent: 0,
    boilingPointC: 0,
    vaporPressureMmHg: 0,
    pungency: 'None',
    colorHex: '#64748b',
  },
};

export interface GasMixerSettings {
  o2FlowLMin: number;
  n2oFlowLMin: number;
  airFlowLMin: number;
  totalFgfLMin: number;
  deliveredFiO2Percent: number;
  deliveredFiN2OPercent: number;
  hypoxicGuardActive: boolean;
}

export interface VaporizerSettings {
  agent: VolatileAgentId;
  dialPercent: number;
  reservoirLevelPercent: number;
  heatedTec6Active: boolean; // For desflurane (39°C, 1500 mmHg)
}

export interface CircuitMechanics {
  circuitVolumeL: number; // standard ~5.0 - 6.0 L (canister + corrugated limbs + bag)
  aplValvePressureCmH2O: number; // 0 (spontaneous open) to 70 cmH2O
  mode: CircuitMode;
  rebreathingFraction: number; // max(0, 1 - FGF/VE)
  circuitTimeConstantMin: number; // Volume / FGF
  absorberExhaustionPercent: number; // 0 to 100%
  indicatorColor: 'WHITE' | 'VIOLET'; // Ethyl violet turns purple at pH < 10.3
  unidirectionalValveIntact: boolean; // False = stuck open valve causing rebreathing
  yPieceConnected: boolean; // False = circuit disconnect
  pipelineO2PressurePsi: number; // Normal ~50 psi, <30 psi = alarm
  cylinderO2Open: boolean; // Emergency backup E-cylinder (660 L at 2000 psi)
}

export interface PatientState {
  age: number;
  weightKg: number;
  minuteVentilationLMin: number;
  cardiacOutputLMin: number;
  
  // Anesthetic Concentrations & MAC
  inspiredVolatilePercent: number; // FI
  endTidalVolatilePercent: number; // FA
  faFiRatio: number;
  ageAdjustedMacAgent: number;
  n2oContributionMac: number;
  totalMac: number;
  depthState: MACDepthState;
  
  // Vitals & Capnometry
  etco2MmHg: number;
  fico2MmHg: number; // Should be 0; >2-4 mmHg indicates rebreathing/absorber failure
  spo2Percent: number;
  heartRateBpm: number;
  systolicBpMmHg: number;
  temperatureC: number;
  
  // Pathological flags
  malignantHyperthermiaActive: boolean;
  dantroleneAdministeredMg: number;
}

export interface AnesthesiaPreset {
  id: string;
  name: string;
  subtitle: string;
  category: string;
  description: string;
  pathophysiologyPearl: string;
  initialMixer: { o2: number; n2o: number; air: number };
  initialVaporizer: { agent: VolatileAgentId; dial: number };
  initialCircuit: Partial<CircuitMechanics>;
  patientModifiers: Partial<PatientState>;
}

/**
 * Calculates Age-Adjusted MAC using the validated Mapleson & Eger equation:
 * MAC_age = MAC_40 * 10^(-0.00269 * (Age - 40))
 * MAC decreases by ~6% per decade of life after age 40.
 */
export function calculateAgeAdjustedMAC(agent: VolatileAgentId, age: number): number {
  if (agent === 'none') return 0;
  const props = VOLATILE_AGENTS[agent];
  const ageExponent = -0.00269 * (age - 40);
  const adjusted = props.mac40Percent * Math.pow(10, ageExponent);
  return +adjusted.toFixed(2);
}

/**
 * Calculates Age-Adjusted MAC for Nitrous Oxide (Base MAC ~104% at age 40)
 */
export function calculateAgeAdjustedN2OMAC(age: number): number {
  const ageExponent = -0.00269 * (age - 40);
  const adjusted = 104 * Math.pow(10, ageExponent);
  return +adjusted.toFixed(1);
}

/**
 * Computes Link-25 Hypoxic Proportioning Guard
 * Ensures delivered FiO2 never drops below 25% when N2O is flowing.
 * If N2O is increased without adequate O2, O2 is mechanically proportioned up.
 */
export function computeHypoxicGuard(
  desiredO2LMin: number,
  desiredN2OLMin: number,
  desiredAirLMin: number
): {
  o2FlowLMin: number;
  n2oFlowLMin: number;
  airFlowLMin: number;
  totalFgfLMin: number;
  deliveredFiO2Percent: number;
  deliveredFiN2OPercent: number;
  hypoxicGuardActive: boolean;
} {
  let o2 = Math.max(0.2, desiredO2LMin);
  let n2o = Math.max(0, desiredN2OLMin);
  let air = Math.max(0, desiredAirLMin);

  let guardActive = false;

  // Hypoxic guard rule: If N2O > 0, minimum O2 flow must be at least (N2O * 0.25 / 0.75) = N2O / 3
  if (n2o > 0) {
    const minO2ForN2O = +(n2o * 0.333).toFixed(2);
    if (o2 < minO2ForN2O) {
      o2 = minO2ForN2O;
      guardActive = true;
    }
  }

  const totalFgf = +(o2 + n2o + air).toFixed(2);
  // Air contains 21% O2, 79% N2
  const o2Volume = o2 + (air * 0.21);
  const fio2 = totalFgf > 0 ? +((o2Volume / totalFgf) * 100).toFixed(1) : 21.0;
  const fin2o = totalFgf > 0 ? +((n2o / totalFgf) * 100).toFixed(1) : 0.0;

  return {
    o2FlowLMin: o2,
    n2oFlowLMin: n2o,
    airFlowLMin: air,
    totalFgfLMin: totalFgf,
    deliveredFiO2Percent: fio2,
    deliveredFiN2OPercent: fin2o,
    hypoxicGuardActive: guardActive,
  };
}

/**
 * Computes Circuit Wash-In / Wash-Out Time Constant (tau)
 * tau = Circuit Volume / Fresh Gas Flow (FGF)
 * 1 tau = 63% change, 3 tau = 95% equilibrium, 4 tau = 98% equilibrium
 */
export function calculateCircuitTimeConstant(circuitVolumeL: number, fgfLMin: number): number {
  if (fgfLMin <= 0) return 999;
  return +(circuitVolumeL / fgfLMin).toFixed(2);
}

/**
 * Computes Circle Rebreathing Fraction
 * In a circle system, rebreathing occurs when FGF < Minute Ventilation (VE)
 * Fraction = max(0, 1 - FGF / VE)
 */
export function calculateRebreathingFraction(fgfLMin: number, veLMin: number): number {
  if (veLMin <= 0) return 0;
  const fraction = Math.max(0, 1 - (fgfLMin / veLMin));
  return +fraction.toFixed(2);
}

/**
 * Solves Alveolar-to-Inspired Ratio (FA/FI) and Uptake
 * Governed by Blood:Gas solubility, Cardiac Output, and Alveolar Ventilation:
 * Low solubility (Desflurane 0.42) -> fast rise in FA/FI -> rapid induction and emergence.
 * Moderate solubility (Sevoflurane 0.65) -> intermediate rise.
 * High solubility (Isoflurane 1.40) -> slower rise.
 */
export function calculateFAFIRatio(
  agent: VolatileAgentId,
  fgfLMin: number,
  elapsedMinutes: number,
  cardiacOutputLMin: number = 5.0
): number {
  if (agent === 'none') return 0;
  const props = VOLATILE_AGENTS[agent];
  
  // Rate constant k depends inversely on blood:gas solubility and cardiac output
  // High solubility or high CO slows the rise of FA/FI
  const solubilityFactor = props.bloodGasPartition;
  const coFactor = cardiacOutputLMin / 5.0;
  const baseRate = 0.22 / (solubilityFactor * Math.sqrt(coFactor));
  
  // FGF also influences wash-in rate into circle system
  const fgfRateBoost = Math.min(1.5, Math.max(0.6, fgfLMin / 2.0));
  const effectiveK = baseRate * fgfRateBoost;

  // Mathematical asymptotic rise toward 1.0 (approaching FI)
  const ratio = 1 - Math.exp(-effectiveK * Math.max(0.1, elapsedMinutes));
  return +Math.min(0.98, Math.max(0.0, ratio)).toFixed(2);
}

/**
 * Calculates Total MAC and Depth of Anesthesia State
 * Total MAC = (FA_volatile / MAC_volatile) + (FA_N2O / MAC_N2O)
 */
export function evaluateAnestheticDepth(
  agent: VolatileAgentId,
  endTidalVolatilePercent: number,
  endTidalN2OPercent: number,
  age: number
): {
  ageAdjustedMacAgent: number;
  n2oContributionMac: number;
  totalMac: number;
  depthState: MACDepthState;
} {
  const ageAdjustedMacAgent = calculateAgeAdjustedMAC(agent, age);
  const ageAdjustedN2OMAC = calculateAgeAdjustedN2OMAC(age);

  const volatileMacFraction = ageAdjustedMacAgent > 0 
    ? endTidalVolatilePercent / ageAdjustedMacAgent 
    : 0;

  const n2oMacFraction = ageAdjustedN2OMAC > 0 
    ? endTidalN2OPercent / ageAdjustedN2OMAC 
    : 0;

  const totalMac = +(volatileMacFraction + n2oMacFraction).toFixed(2);

  let depthState: MACDepthState = 'AWAKE';
  if (totalMac < 0.3) {
    depthState = 'AWAKE';
  } else if (totalMac < 0.7) {
    depthState = 'SEDATED'; // Risk of awareness under surgical stimulation!
  } else if (totalMac <= 1.4) {
    depthState = 'SURGICAL_ANESTHESIA'; // 1.0 - 1.3 MAC: Surgical anesthesia + blunted movement
  } else if (totalMac <= 2.0) {
    depthState = 'DEEP_ANESTHESIA'; // MAC-BAR range
  } else {
    depthState = 'BURST_SUPPRESSION'; // EEG isoelectric / severe hemodynamic depression
  }

  return {
    ageAdjustedMacAgent,
    n2oContributionMac: +n2oMacFraction.toFixed(2),
    totalMac,
    depthState,
  };
}

/**
 * Emergency Dantrolene Dosing Protocol for Malignant Hyperthermia
 * Initial dose: 2.5 mg/kg IV push. Repeat every 5-10 min up to 10 mg/kg max.
 * Each vial contains 20 mg dantrolene + 3 g mannitol (reconstituted in 60 mL sterile water).
 */
export function calculateDantroleneProtocol(weightKg: number): {
  initialDoseMg: number;
  initialVialsCount: number;
  maxDoseMg: number;
  reconstitutionWaterMl: number;
} {
  const initialDoseMg = +(weightKg * 2.5).toFixed(0);
  const initialVialsCount = Math.ceil(initialDoseMg / 20);
  const maxDoseMg = +(weightKg * 10.0).toFixed(0);
  const reconstitutionWaterMl = initialVialsCount * 60;

  return {
    initialDoseMg,
    initialVialsCount,
    maxDoseMg,
    reconstitutionWaterMl,
  };
}

/**
 * 6 Evidence-Based Clinical Presets
 */
export const ANESTHESIA_PRESETS: AnesthesiaPreset[] = [
  {
    id: 'routine-low-flow',
    name: 'Routine Low-Flow Balanced Anesthesia',
    subtitle: 'Optimal Gas Conservation (FGF 0.8 L/min)',
    category: 'Standard Practice',
    description: 'Maintenance of surgical general anesthesia with Sevoflurane and Air/O2 in low fresh gas flow, preserving moisture and preventing greenhouse emission.',
    pathophysiologyPearl: 'At FGF 0.8 L/min, ~80% of expired gas is scrubbed of CO2 and rebreathed. Circuit time constant is ~6 min; dial changes must be anticipated.',
    initialMixer: { o2: 0.4, n2o: 0.0, air: 0.4 },
    initialVaporizer: { agent: 'sevoflurane', dial: 2.2 },
    initialCircuit: {
      circuitVolumeL: 5.0,
      aplValvePressureCmH2O: 0,
      mode: 'ventilator',
      absorberExhaustionPercent: 12,
      unidirectionalValveIntact: true,
      yPieceConnected: true,
      pipelineO2PressurePsi: 52,
      cylinderO2Open: false,
    },
    patientModifiers: {
      age: 42,
      weightKg: 70,
      minuteVentilationLMin: 5.2,
      cardiacOutputLMin: 5.0,
      temperatureC: 36.8,
      malignantHyperthermiaActive: false,
      dantroleneAdministeredMg: 0,
    },
  },
  {
    id: 'malignant-hyperthermia',
    name: 'Malignant Hyperthermia (MH) Crisis',
    subtitle: 'Hypermetabolic Pharmacogenetic Emergency',
    category: 'Critical Crisis',
    description: 'Triggered by halogenated volatile agent in a genetically susceptible RYR1 carrier. Rapid uncontrolled sarcoplasmic calcium dumping with massive CO2 production.',
    pathophysiologyPearl: 'Unexplained exponential surge in ETCO2 (>75 mmHg) despite hyperventilation is the earliest, most sensitive sign of MH. Requires immediate volatile cessation, 100% O2 flush at 10 L/min, and Dantrolene 2.5 mg/kg IV.',
    initialMixer: { o2: 0.5, n2o: 0.0, air: 0.5 },
    initialVaporizer: { agent: 'sevoflurane', dial: 2.5 },
    initialCircuit: {
      circuitVolumeL: 5.0,
      aplValvePressureCmH2O: 0,
      mode: 'ventilator',
      absorberExhaustionPercent: 45,
      unidirectionalValveIntact: true,
      yPieceConnected: true,
      pipelineO2PressurePsi: 50,
      cylinderO2Open: false,
    },
    patientModifiers: {
      age: 24,
      weightKg: 75,
      minuteVentilationLMin: 8.5,
      cardiacOutputLMin: 7.5,
      etco2MmHg: 84, // Severe hypercarbia
      temperatureC: 39.8, // Hyperpyrexia
      heartRateBpm: 138,
      systolicBpMmHg: 165,
      malignantHyperthermiaActive: true,
      dantroleneAdministeredMg: 0,
    },
  },
  {
    id: 'pipeline-o2-failure',
    name: 'Hospital Pipeline Oxygen Failure',
    subtitle: 'Loss of Wall Gas Supply (<30 psi)',
    category: 'Equipment Failure',
    description: 'Sudden loss of wall oxygen pressure. Oxygen fail-safe alarm sounds and nitrous oxide shuts off automatically to prevent delivering a 100% hypoxic mixture.',
    pathophysiologyPearl: 'Immediately disconnect wall pipeline hose (prevents back-leak), open the backup E-cylinder on the machine, and minimize FGF to conserve the 660-liter tank.',
    initialMixer: { o2: 1.0, n2o: 2.0, air: 0.0 },
    initialVaporizer: { agent: 'isoflurane', dial: 1.2 },
    initialCircuit: {
      circuitVolumeL: 5.0,
      aplValvePressureCmH2O: 0,
      mode: 'ventilator',
      absorberExhaustionPercent: 20,
      unidirectionalValveIntact: true,
      yPieceConnected: true,
      pipelineO2PressurePsi: 18, // Failed pipeline!
      cylinderO2Open: false,
    },
    patientModifiers: {
      age: 55,
      weightKg: 80,
      minuteVentilationLMin: 6.0,
      cardiacOutputLMin: 5.2,
      temperatureC: 36.6,
      malignantHyperthermiaActive: false,
      dantroleneAdministeredMg: 0,
    },
  },
  {
    id: 'circuit-disconnect',
    name: 'Y-Piece Circuit Disconnect',
    subtitle: 'Loss of Airway Pressure & Apnea Alarm',
    category: 'Equipment Failure',
    description: 'Accidental uncoupling at the patient endotracheal tube Y-piece. Airway pressure falls to atmospheric, capnogram waveform is immediately lost.',
    pathophysiologyPearl: 'Absence of ETCO2 waveform is the most specific indicator of breathing circuit disconnect, extubation, or cardiac arrest.',
    initialMixer: { o2: 1.0, n2o: 0.0, air: 1.0 },
    initialVaporizer: { agent: 'sevoflurane', dial: 2.0 },
    initialCircuit: {
      circuitVolumeL: 5.0,
      aplValvePressureCmH2O: 0,
      mode: 'ventilator',
      absorberExhaustionPercent: 15,
      unidirectionalValveIntact: true,
      yPieceConnected: false, // Disconnected!
      pipelineO2PressurePsi: 50,
      cylinderO2Open: false,
    },
    patientModifiers: {
      age: 48,
      weightKg: 68,
      minuteVentilationLMin: 5.5,
      cardiacOutputLMin: 4.8,
      temperatureC: 36.7,
      malignantHyperthermiaActive: false,
      dantroleneAdministeredMg: 0,
    },
  },
  {
    id: 'expiratory-valve-failure',
    name: 'Incompetent Expiratory Unidirectional Valve',
    subtitle: 'CO2 Rebreathing & Baseline Elevation',
    category: 'Circuit Pathology',
    description: 'The expiratory flutter valve is stuck open with moisture/debris. Expired gas flows retrogradely into inspiratory limb, causing elevated baseline FiCO2.',
    pathophysiologyPearl: 'Capnogram fails to return to zero during inspiration (FiCO2 > 4-8 mmHg). Unlike absorber exhaustion, increasing FGF does NOT resolve incompetent valve rebreathing.',
    initialMixer: { o2: 1.0, n2o: 0.0, air: 1.0 },
    initialVaporizer: { agent: 'sevoflurane', dial: 2.0 },
    initialCircuit: {
      circuitVolumeL: 5.0,
      aplValvePressureCmH2O: 0,
      mode: 'ventilator',
      absorberExhaustionPercent: 10,
      unidirectionalValveIntact: false, // Incompetent valve!
      yPieceConnected: true,
      pipelineO2PressurePsi: 50,
      cylinderO2Open: false,
    },
    patientModifiers: {
      age: 39,
      weightKg: 72,
      minuteVentilationLMin: 5.0,
      cardiacOutputLMin: 5.0,
      temperatureC: 36.7,
      malignantHyperthermiaActive: false,
      dantroleneAdministeredMg: 0,
    },
  },
  {
    id: 'desflurane-rapid-emergence',
    name: 'Desflurane Rapid Wash-Out & Emergence',
    subtitle: 'Ultra-Low Solubility (Blood:Gas 0.42)',
    category: 'Pharmacokinetics',
    description: 'Demonstrating the rapid kinetic wash-out of Desflurane compared to older soluble agents, allowing predictable return of airway reflexes even after prolonged cases.',
    pathophysiologyPearl: 'Because of minimal blood and tissue solubility, alveolar concentration falls steeply when vaporizer is turned off, dropping below MAC-awake (0.35 MAC) within 3 minutes at FGF 6 L/min.',
    initialMixer: { o2: 2.0, n2o: 0.0, air: 4.0 }, // 6 L/min high flow wash-out
    initialVaporizer: { agent: 'desflurane', dial: 0.0 }, // Vaporizer closed
    initialCircuit: {
      circuitVolumeL: 5.0,
      aplValvePressureCmH2O: 0,
      mode: 'ventilator',
      absorberExhaustionPercent: 30,
      unidirectionalValveIntact: true,
      yPieceConnected: true,
      pipelineO2PressurePsi: 50,
      cylinderO2Open: false,
    },
    patientModifiers: {
      age: 35,
      weightKg: 85,
      minuteVentilationLMin: 6.5,
      cardiacOutputLMin: 5.5,
      temperatureC: 36.9,
      malignantHyperthermiaActive: false,
      dantroleneAdministeredMg: 0,
    },
  },
];

/**
 * Master Simulation Step Engine
 * Given current mixer settings, vaporizer dial, circuit mechanics, and elapsed time,
 * computes exact concentrations, alveolar uptake, rebreathing, MAC, and patient vitals.
 */
export function simulateAnesthesiaStep(
  presetId: string,
  mixer: GasMixerSettings,
  vaporizer: VaporizerSettings,
  circuit: CircuitMechanics,
  patient: PatientState,
  elapsedMinutes: number
): {
  patient: PatientState;
  circuit: CircuitMechanics;
  alerts: { severity: 'INFO' | 'WARNING' | 'CRITICAL'; message: string }[];
} {
  const alerts: { severity: 'INFO' | 'WARNING' | 'CRITICAL'; message: string }[] = [];

  // 1. Pipeline Oxygen Pressure Check
  let effectiveO2Flow = mixer.o2FlowLMin;
  let pipelineFailure = false;
  if (circuit.pipelineO2PressurePsi < 30) {
    pipelineFailure = true;
    if (!circuit.cylinderO2Open) {
      alerts.push({
        severity: 'CRITICAL',
        message: 'OXYGEN PIPELINE PRESSURE CRITICAL (<30 PSI)! Open backup E-cylinder immediately!',
      });
      effectiveO2Flow = 0; // No oxygen delivering from wall
    } else {
      alerts.push({
        severity: 'WARNING',
        message: 'Running on backup E-cylinder oxygen. Wall pipeline disconnected.',
      });
    }
  }

  // 2. Circuit Disconnect Check
  if (!circuit.yPieceConnected) {
    alerts.push({
      severity: 'CRITICAL',
      message: 'APNEA / CIRCUIT DISCONNECT: Zero airway pressure detected at Y-piece!',
    });
    return {
      patient: {
        ...patient,
        inspiredVolatilePercent: 0,
        endTidalVolatilePercent: 0,
        faFiRatio: 0,
        totalMac: 0,
        depthState: 'AWAKE',
        etco2MmHg: 0,
        fico2MmHg: 0,
        spo2Percent: Math.max(70, patient.spo2Percent - 2),
      },
      circuit,
      alerts,
    };
  }

  // 3. Hypoxic Guard Calculation
  const guardedMix = computeHypoxicGuard(effectiveO2Flow, mixer.n2oFlowLMin, mixer.airFlowLMin);
  if (guardedMix.hypoxicGuardActive) {
    alerts.push({
      severity: 'WARNING',
      message: 'Hypoxic Guard active: Oxygen proportioned up to maintain FiO2 >= 25%.',
    });
  }

  // 4. Circle Rebreathing & Circuit Time Constant
  const rebreathingFraction = calculateRebreathingFraction(
    guardedMix.totalFgfLMin,
    patient.minuteVentilationLMin
  );
  const timeConstant = calculateCircuitTimeConstant(
    circuit.circuitVolumeL,
    guardedMix.totalFgfLMin
  );

  // 5. Inspired Volatile Fraction (FI) from vaporizer dial and FGF wash-in
  let inspiredVolatile = 0;
  if (vaporizer.agent !== 'none') {
    // Vaporizer output enters FGF limb
    // In low flow, FI is a weighted mix of fresh gas and rebreathed alveolar gas
    const freshGasConcentration = vaporizer.dialPercent;
    // Circuit lag modeled with time constant
    const circuitWashInFactor = 1 - Math.exp(-elapsedMinutes / Math.max(0.5, timeConstant));
    inspiredVolatile = +(freshGasConcentration * circuitWashInFactor).toFixed(2);
  }

  // 6. Alveolar-to-Inspired (FA/FI) Uptake
  const faFiRatio = calculateFAFIRatio(
    vaporizer.agent,
    guardedMix.totalFgfLMin,
    elapsedMinutes,
    patient.cardiacOutputLMin
  );
  const endTidalVolatile = +(inspiredVolatile * faFiRatio).toFixed(2);

  // 7. N2O End-Tidal Concentration
  const endTidalN2O = +(guardedMix.deliveredFiN2OPercent * 0.95).toFixed(1);

  // 8. Anesthetic Depth & MAC
  const { ageAdjustedMacAgent, n2oContributionMac, totalMac, depthState } = evaluateAnestheticDepth(
    vaporizer.agent,
    endTidalVolatile,
    endTidalN2O,
    patient.age
  );

  // 9. Capnography & Incompetent Valve / Absorber Exhaustion
  let fico2 = 0;
  let etco2 = 38;

  // If expiratory valve is incompetent, exhaled gas re-enters inspiratory limb without scrubber
  if (!circuit.unidirectionalValveIntact) {
    fico2 = 7; // Significant baseline elevation!
    alerts.push({
      severity: 'WARNING',
      message: 'Elevated FiCO2 (>6 mmHg): Incompetent unidirectional valve causing rebreathing.',
    });
  } else if (circuit.absorberExhaustionPercent > 80) {
    fico2 = Math.round(2 + (circuit.absorberExhaustionPercent - 80) * 0.25);
    alerts.push({
      severity: 'WARNING',
      message: 'CO2 Absorber Canister Exhausted! Ethyl violet indicator visible.',
    });
  }

  // 10. Malignant Hyperthermia Simulation
  let hr = 72;
  let bp = 120;
  let temp = patient.temperatureC;
  let mhActive = patient.malignantHyperthermiaActive;

  if (mhActive) {
    // If volatile agent still on, MH accelerates
    if (vaporizer.agent !== 'none' && vaporizer.dialPercent > 0) {
      etco2 = Math.min(110, 75 + Math.round(elapsedMinutes * 4));
      temp = +(Math.min(42.5, temp + 0.15)).toFixed(1);
      hr = Math.min(160, 125 + Math.round(elapsedMinutes * 3));
      bp = 155;
      alerts.push({
        severity: 'CRITICAL',
        message: 'MALIGNANT HYPERTHERMIA CRISIS: Discontinue volatile agent immediately and give Dantrolene!',
      });
    } else {
      // Volatile turned off, check if Dantrolene administered
      if (patient.dantroleneAdministeredMg >= patient.weightKg * 2.5) {
        // Controlled with Dantrolene
        etco2 = Math.max(40, patient.etco2MmHg - 5);
        temp = +(Math.max(37.0, temp - 0.2)).toFixed(1);
        hr = Math.max(80, patient.heartRateBpm - 6);
        alerts.push({
          severity: 'INFO',
          message: 'Therapeutic Dantrolene response: Hypercarbia resolving, temperature stabilizing.',
        });
        if (etco2 <= 44 && temp <= 37.5) {
          mhActive = false;
        }
      } else {
        alerts.push({
          severity: 'CRITICAL',
          message: 'Volatile stopped, but Dantrolene not yet administered! Full dose 2.5 mg/kg needed.',
        });
      }
    }
  } else {
    // Normal hemodynamics driven by MAC
    etco2 = 38;
    if (depthState === 'AWAKE' || depthState === 'SEDATED') {
      hr = 88;
      bp = 135;
      if (depthState === 'SEDATED') {
        alerts.push({
          severity: 'WARNING',
          message: 'Light Anesthesia (Total MAC < 0.7): Patient at risk of intraoperative awareness!',
        });
      }
    } else if (depthState === 'SURGICAL_ANESTHESIA') {
      hr = 68;
      bp = 115;
    } else if (depthState === 'DEEP_ANESTHESIA' || depthState === 'BURST_SUPPRESSION') {
      hr = 52;
      bp = 85;
      alerts.push({
        severity: 'WARNING',
        message: 'Deep Anesthesia (Total MAC > 1.5): Significant myocardial depression and vasodilation.',
      });
    }
  }

  // Indicator color turns violet as exhaustion exceeds 50%
  const indicatorColor = circuit.absorberExhaustionPercent > 50 ? 'VIOLET' : 'WHITE';

  // SpO2 estimation based on delivered FiO2
  const spo2 = guardedMix.deliveredFiO2Percent < 25 ? 86 : 99;

  return {
    patient: {
      ...patient,
      inspiredVolatilePercent: inspiredVolatile,
      endTidalVolatilePercent: endTidalVolatile,
      faFiRatio,
      ageAdjustedMacAgent,
      n2oContributionMac,
      totalMac,
      depthState,
      etco2MmHg: etco2,
      fico2MmHg: fico2,
      spo2Percent: spo2,
      heartRateBpm: hr,
      systolicBpMmHg: bp,
      temperatureC: temp,
      malignantHyperthermiaActive: mhActive,
    },
    circuit: {
      ...circuit,
      rebreathingFraction,
      circuitTimeConstantMin: timeConstant,
      indicatorColor,
    },
    alerts,
  };
}
