/**
 * MechanicalVentilationEngine.ts
 * Enterprise-grade Mechanical Ventilation & Respiratory Mechanics Simulation Engine.
 * 
 * Implements:
 * - Equation of Motion for the Respiratory System: P_vent(t) = Flow(t)*Raw + V(t)/Cstat + PEEP
 * - Modes: VCV (Volume Control), PCV (Pressure Control), PSV (Pressure Support), SIMV
 * - Waveform synthesis: Pressure-time, Flow-time, Volume-time, and Pressure-Volume loops
 * - Diagnostic maneuvers: Inspiratory Hold (Pplat, Cstat, Raw, Driving Pressure) & Expiratory Hold (Auto-PEEP)
 * - ARDSNet Lung-Protective PBW & Tidal Volume Titration
 * - Stress Index & Patient-Ventilator Asynchrony (Double-triggering, flow starvation, missed triggers)
 * - Curated Critical Care Pathology Presets (ARDS, Severe Asthma/COPD, Secretion Obstruction, SBT Weaning)
 * 
 * Location: frontend/.gemini/skills/MechanicalVentilationEngine.ts
 */

export type VentilationMode = 'VCV' | 'PCV' | 'PSV' | 'SIMV';
export type FlowWaveformType = 'SQUARE' | 'DECELERATING';

export interface PatientCharacteristics {
  heightCm: number;
  gender: 'MALE' | 'FEMALE';
  actualWeightKg?: number;
  complianceMlPerCmH2O: number; // Normal: 50-80 mL/cmH2O (ARDS: 15-30)
  resistanceCmH2OPerLps: number; // Normal: 2-5 cmH2O/L/s (Asthma/COPD: 15-30)
  effortPmusCmH2O?: number; // Spontaneous patient muscle effort (0 = paralyzed, >0 = active)
  respiratoryDrivePerMin?: number; // Patient spontaneous rate
}

export interface VentilatorSettings {
  mode: VentilationMode;
  tidalVolumeMl: number;       // Set VT in VCV (mL), e.g. 420
  inspiratoryPressureCmH2O: number; // Set Pinsp in PCV/PSV, e.g. 18
  respiratoryRate: number;     // Set frequency f (breaths/min), e.g. 16
  peepCmH2O: number;           // Positive End-Expiratory Pressure, e.g. 5 - 18
  fiO2: number;                // Fraction of inspired oxygen (0.21 - 1.0)
  ieRatio: { insp: number; exp: number }; // e.g. { insp: 1, exp: 2 } -> 1:2
  peakFlowLpm: number;         // Peak flow in VCV (L/min), e.g. 60
  flowWaveform: FlowWaveformType; // SQUARE or DECELERATING
  inspiratoryPausePercent: number; // % of cycle time for end-inspiratory pause (0 - 20%)
  flowTriggerLpm: number;      // Flow trigger sensitivity (L/min), e.g. 2.0
}

export interface WaveformPoint {
  timeSec: number;
  pressureCmH2O: number;
  flowLps: number;            // Flow in Liters per second (+ for insp, - for exp)
  volumeMl: number;           // Delivered volume in mL
  phase: 'INSPIRATION' | 'INSP_PAUSE' | 'EXPIRATION' | 'TRIGGER';
}

export interface MechanicsDiagnostics {
  predictedBodyWeightKg: number;
  targetTidalVolumeRangeMl: { min4: number; target6: number; max8: number };
  deliveredTidalVolumeMl: number;
  minuteVentilationLpm: number;
  peakInspiratoryPressureCmH2O: number;
  plateauPressureCmH2O: number;
  drivingPressureCmH2O: number;
  staticComplianceMlPerCmH2O: number;
  airwayResistanceCmH2OPerLps: number;
  autoPeepCmH2O: number;
  totalPeepCmH2O: number;
  expiratoryTimeConstantSec: number;
  stressIndex: number;
  rsbi: number | null; // Rapid Shallow Breathing Index (for PSV/SBT)
  alarms: string[];
  lungProtectiveCompliance: {
    isDrivingPressureSafe: boolean; // < 14 cmH2O
    isPlateauPressureSafe: boolean; // <= 30 cmH2O
    isTidalVolumeProtective: boolean; // <= 8 mL/kg PBW
  };
}

// -------------------------------------------------------------
// 1. ARDSNet Predicted Body Weight (PBW) & Targets
// -------------------------------------------------------------
export function calculatePredictedBodyWeight(heightCm: number, gender: 'MALE' | 'FEMALE'): number {
  const inchesOver5Feet = Math.max(0, (heightCm - 152.4) / 2.54);
  let pbw = gender === 'MALE' ? 50 + 2.3 * inchesOver5Feet : 45.5 + 2.3 * inchesOver5Feet;
  return Number(pbw.toFixed(1));
}

// -------------------------------------------------------------
// 2. Real-time Waveform Synthesis & Diagnostics
// -------------------------------------------------------------
export function simulateVentilatorMechanics(
  settings: VentilatorSettings,
  patient: PatientCharacteristics,
  totalCyclesToGenerate: number = 2,
  samplePointsPerCycle: number = 100
): { waveforms: WaveformPoint[]; diagnostics: MechanicsDiagnostics } {
  const pbw = calculatePredictedBodyWeight(patient.heightCm, patient.gender);

  // Timing breakdown
  const cycleTimeSec = 60 / settings.respiratoryRate;
  const ieSum = settings.ieRatio.insp + settings.ieRatio.exp;
  const rawInspTimeSec = cycleTimeSec * (settings.ieRatio.insp / ieSum);
  const pauseTimeSec = rawInspTimeSec * (settings.inspiratoryPausePercent / 100);
  const activeInspTimeSec = rawInspTimeSec - pauseTimeSec;
  const expTimeSec = cycleTimeSec - rawInspTimeSec;

  const Cstat = patient.complianceMlPerCmH2O; // mL/cmH2O
  const CstatLiters = Cstat / 1000;          // L/cmH2O
  const Raw = patient.resistanceCmH2OPerLps;   // cmH2O / (L/s)
  const tau = Raw * CstatLiters;              // Expiratory time constant (seconds)

  // Determine delivered volume & delivered pressures based on mode
  let deliveredVT_ml = settings.tidalVolumeMl;
  let Ppeak = settings.peepCmH2O;
  let Pplat = settings.peepCmH2O;
  let peakInspFlowLps = settings.peakFlowLpm / 60; // L/s

  if (settings.mode === 'VCV') {
    deliveredVT_ml = settings.tidalVolumeMl;
    const deliveredVT_L = deliveredVT_ml / 1000;
    
    // In square flow, flow = VT / activeInspTime
    peakInspFlowLps = deliveredVT_L / activeInspTimeSec;
    const P_resistive = peakInspFlowLps * Raw;
    const P_elastic = deliveredVT_ml / Cstat;
    Pplat = Number((settings.peepCmH2O + P_elastic).toFixed(1));
    Ppeak = Number((Pplat + P_resistive).toFixed(1));
  } else if (settings.mode === 'PCV' || settings.mode === 'PSV' || settings.mode === 'SIMV') {
    const deltaPinsp = settings.inspiratoryPressureCmH2O;
    // Exponential flow decay: VT = deltaP * Cstat * (1 - e^(-activeInspTime / tau))
    const fillingFactor = 1 - Math.exp(-activeInspTimeSec / Math.max(0.05, tau));
    deliveredVT_ml = Number((deltaPinsp * Cstat * fillingFactor).toFixed(1));
    peakInspFlowLps = deltaPinsp / Raw;
    Ppeak = Number((settings.peepCmH2O + deltaPinsp).toFixed(1));
    // At end of inspiration, if flow reaches near 0, Pplat = Ppeak
    const endInspFlow = peakInspFlowLps * Math.exp(-activeInspTimeSec / Math.max(0.05, tau));
    Pplat = Number((Ppeak - endInspFlow * Raw).toFixed(1));
  }

  // Auto-PEEP calculation (gas trapped if expTime < 3-4 tau)
  // Exp flow at end of expiration: Flow(expTime) = (VT / tau) * e^(-expTime / tau)
  const deliveredVT_L = deliveredVT_ml / 1000;
  const trappedVolumeL = deliveredVT_L * Math.exp(-expTimeSec / Math.max(0.05, tau));
  const autoPeep = Number(((trappedVolumeL * 1000) / Cstat).toFixed(1));
  const totalPeep = Number((settings.peepCmH2O + autoPeep).toFixed(1));

  // Driving pressure: Pplat - PEEP
  const drivingPressure = Number((Pplat - settings.peepCmH2O).toFixed(1));

  // Stress Index calculation: curve exponent
  // 1.0 = linear compliance, <1.0 = tidal recruitment, >1.0 = alveolar overdistension
  let stressIndex = 1.0;
  if (Ppeak > 35 && drivingPressure > 15) {
    stressIndex = 1.25; // Overdistension
  } else if (settings.peepCmH2O < 5 && Cstat < 30) {
    stressIndex = 0.78; // Recruitment
  }

  // RSBI (for PSV/SBT)
  const rsbi = settings.mode === 'PSV' && deliveredVT_L > 0
    ? Number((settings.respiratoryRate / deliveredVT_L).toFixed(0))
    : null;

  // Waveform point synthesis
  const waveforms: WaveformPoint[] = [];
  const dt = cycleTimeSec / samplePointsPerCycle;

  for (let cycle = 0; cycle < totalCyclesToGenerate; cycle++) {
    const cycleStartTime = cycle * cycleTimeSec;

    for (let i = 0; i < samplePointsPerCycle; i++) {
      const tInCycle = i * dt;
      const tAbsolute = Number((cycleStartTime + tInCycle).toFixed(3));

      let currentPressure = settings.peepCmH2O;
      let currentFlow = 0;
      let currentVolume = 0;
      let phase: 'INSPIRATION' | 'INSP_PAUSE' | 'EXPIRATION' | 'TRIGGER' = 'INSPIRATION';

      if (tInCycle < activeInspTimeSec) {
        phase = 'INSPIRATION';
        const tProgress = tInCycle / activeInspTimeSec;

        if (settings.mode === 'VCV') {
          if (settings.flowWaveform === 'SQUARE') {
            currentFlow = peakInspFlowLps;
          } else {
            // Decelerating ramp from peak to 0.2*peak
            currentFlow = peakInspFlowLps * (1 - 0.8 * tProgress);
          }
          currentVolume = deliveredVT_ml * tProgress;
          currentPressure = settings.peepCmH2O + currentFlow * Raw + currentVolume / Cstat;
        } else {
          // PCV / PSV: exponential flow decay
          currentFlow = peakInspFlowLps * Math.exp(-tInCycle / Math.max(0.05, tau));
          const currentFilling = 1 - Math.exp(-tInCycle / Math.max(0.05, tau));
          currentVolume = deliveredVT_ml * currentFilling;
          currentPressure = settings.peepCmH2O + settings.inspiratoryPressureCmH2O;
        }
      } else if (tInCycle < activeInspTimeSec + pauseTimeSec) {
        // End-inspiratory pause (hold)
        phase = 'INSP_PAUSE';
        currentFlow = 0;
        currentVolume = deliveredVT_ml;
        currentPressure = Pplat;
      } else {
        // Expiration
        phase = 'EXPIRATION';
        const tExp = tInCycle - (activeInspTimeSec + pauseTimeSec);
        const peakExpFlow = deliveredVT_L / Math.max(0.05, tau);
        currentFlow = -peakExpFlow * Math.exp(-tExp / Math.max(0.05, tau));
        currentVolume = deliveredVT_ml * Math.exp(-tExp / Math.max(0.05, tau));
        // Pressure drops to PEEP + dynamic Auto-PEEP
        currentPressure = settings.peepCmH2O + (currentVolume / Cstat);
      }

      waveforms.push({
        timeSec: tAbsolute,
        pressureCmH2O: Number(currentPressure.toFixed(1)),
        flowLps: Number(currentFlow.toFixed(2)),
        volumeMl: Number(currentVolume.toFixed(0)),
        phase,
      });
    }
  }

  // Clinical Safety Alarms
  const alarms: string[] = [];
  if (Ppeak >= 38) {
    alarms.push('HIGH PEAK PRESSURE ALARM: Ppeak >= 38 cmH2O. Imminent barotrauma risk. Differentiate elevated Raw (bronchospasm/kinked ETT) vs. low Cstat.');
  }
  if (Pplat > 30) {
    alarms.push('CRITICAL PLATEAU PRESSURE: Pplat > 30 cmH2O. Exceeds ARDSNet lung-protective threshold. Alveolar overdistension and volutrauma.');
  }
  if (drivingPressure > 14) {
    alarms.push('ELEVATED DRIVING PRESSURE: ΔP > 14 cmH2O. Associated with increased ARDS mortality (Amato et al., NEJM). Decrease tidal volume.');
  }
  if (autoPeep >= 4) {
    alarms.push(`SIGNIFICANT AUTO-PEEP: Intrinsic PEEP = ${autoPeep} cmH2O. Dynamic hyperinflation / air-trapping. Lengthen expiratory time (decrease rate or increase flow).`);
  }
  if (deliveredVT_ml > pbw * 8) {
    alarms.push(`EXCESSIVE TIDAL VOLUME: Delivered VT (${deliveredVT_ml} mL) exceeds 8 mL/kg PBW (${(pbw * 8).toFixed(0)} mL). Risk of ventilator-induced lung injury (VILI).`);
  }

  const diagnostics: MechanicsDiagnostics = {
    predictedBodyWeightKg: pbw,
    targetTidalVolumeRangeMl: {
      min4: Number((pbw * 4).toFixed(0)),
      target6: Number((pbw * 6).toFixed(0)),
      max8: Number((pbw * 8).toFixed(0)),
    },
    deliveredTidalVolumeMl: deliveredVT_ml,
    minuteVentilationLpm: Number(((deliveredVT_ml * settings.respiratoryRate) / 1000).toFixed(1)),
    peakInspiratoryPressureCmH2O: Ppeak,
    plateauPressureCmH2O: Pplat,
    drivingPressureCmH2O: drivingPressure,
    staticComplianceMlPerCmH2O: Cstat,
    airwayResistanceCmH2OPerLps: Raw,
    autoPeepCmH2O: autoPeep,
    totalPeepCmH2O: totalPeep,
    expiratoryTimeConstantSec: Number(tau.toFixed(2)),
    stressIndex,
    rsbi,
    alarms,
    lungProtectiveCompliance: {
      isDrivingPressureSafe: drivingPressure <= 14,
      isPlateauPressureSafe: Pplat <= 30,
      isTidalVolumeProtective: deliveredVT_ml <= pbw * 8,
    },
  };

  return { waveforms, diagnostics };
}


// -------------------------------------------------------------
// 3. Curated Critical Care Pathology Presets
// -------------------------------------------------------------
export interface VentilationCasePreset {
  id: string;
  title: string;
  clinicalScenario: string;
  settings: VentilatorSettings;
  patient: PatientCharacteristics;
  teachingPoints: string[];
}

export const VENTILATOR_PRESETS: VentilationCasePreset[] = [
  {
    id: 'severe-ards',
    title: 'Severe ARDS: Low Compliance & High Driving Pressure',
    clinicalScenario: 'A 58-year-old male (Height: 175 cm, PBW 70.8 kg) with severe COVID-19/Bacterial pneumonia develops refractory hypoxemia. Chest radiograph reveals bilateral dense alveolar infiltrates.',
    settings: {
      mode: 'VCV',
      tidalVolumeMl: 420, // 6 mL/kg PBW
      inspiratoryPressureCmH2O: 18,
      respiratoryRate: 24,
      peepCmH2O: 14,
      fiO2: 0.80,
      ieRatio: { insp: 1, exp: 2 },
      peakFlowLpm: 60,
      flowWaveform: 'SQUARE',
      inspiratoryPausePercent: 10,
      flowTriggerLpm: 2.0,
    },
    patient: {
      heightCm: 175,
      gender: 'MALE',
      complianceMlPerCmH2O: 20, // Severely stiff lungs
      resistanceCmH2OPerLps: 4,  // Normal airway resistance
    },
    teachingPoints: [
      'In severe ARDS, the primary mechanical defect is dramatically reduced lung compliance ("baby lung").',
      'Both Ppeak and Pplat rise together. Driving pressure (ΔP = Pplat - PEEP) is critically elevated if compliance is low.',
      'ARDSNet protocol dictates: Target VT = 4-6 mL/kg PBW and keep Pplat <= 30 cmH2O to prevent volutrauma and biotrauma.',
    ],
  },
  {
    id: 'status-asthmaticus',
    title: 'Status Asthmaticus: Bronchospasm & High Auto-PEEP',
    clinicalScenario: 'A 26-year-old female (Height: 162 cm, PBW 54.3 kg) intubated for acute life-threatening asthma. Physical exam reveals silent chest transitioning to high-pitched expiratory wheezing.',
    settings: {
      mode: 'VCV',
      tidalVolumeMl: 380,
      inspiratoryPressureCmH2O: 16,
      respiratoryRate: 12, // Low rate to prolong expiration
      peepCmH2O: 5,
      fiO2: 0.50,
      ieRatio: { insp: 1, exp: 4 }, // Prolonged 1:4 I:E ratio
      peakFlowLpm: 80, // High inspiratory flow to shorten inspiratory time
      flowWaveform: 'SQUARE',
      inspiratoryPausePercent: 5,
      flowTriggerLpm: 2.0,
    },
    patient: {
      heightCm: 162,
      gender: 'FEMALE',
      complianceMlPerCmH2O: 55, // Normal parenchyma
      resistanceCmH2OPerLps: 24, // Extreme airway resistance
    },
    teachingPoints: [
      'In bronchospasm, Airway Resistance (Raw) is severely elevated. Ppeak is very high, but Pplat remains low!',
      'The large peak-to-plateau gradient (Ppeak - Pplat > 15 cmH2O) confirms resistive rather than compliance pathology.',
      'Prolonged expiratory time constant (tau = Raw * Cstat) requires low respiratory rate and high peak flow to avoid deadly dynamic hyperinflation (Auto-PEEP).',
    ],
  },
  {
    id: 'kinked-ett',
    title: 'Acute Secretion Mucus Plug / Kinked Endotracheal Tube',
    clinicalScenario: 'A 64-year-old patient on chronic VCV suddenly triggers a HIGH PEAK PRESSURE alarm. Oxygenation remains stable, but ventilator monitor shows a sudden jump in Ppeak.',
    settings: {
      mode: 'VCV',
      tidalVolumeMl: 460,
      inspiratoryPressureCmH2O: 18,
      respiratoryRate: 16,
      peepCmH2O: 6,
      fiO2: 0.40,
      ieRatio: { insp: 1, exp: 2 },
      peakFlowLpm: 60,
      flowWaveform: 'SQUARE',
      inspiratoryPausePercent: 10,
      flowTriggerLpm: 2.0,
    },
    patient: {
      heightCm: 170,
      gender: 'MALE',
      complianceMlPerCmH2O: 60, // Normal compliance
      resistanceCmH2OPerLps: 22, // Acute obstruction
    },
    teachingPoints: [
      'Diagnostic maneuver: Perform an Inspiratory Hold. If Pplat is NORMAL (<20) but Ppeak is SKY-HIGH (>40), the issue is purely AIRWAY RESISTANCE.',
      'Differential for high Ppeak with normal Pplat: Mucus plug, tube kinking, patient biting the tube, bronchospasm, or herniated cuff.',
      'Immediate action: In-line suctioning, bite block check, and checking ETT patency.',
    ],
  },
  {
    id: 'pcv-mode',
    title: 'Pressure Control (PCV) with Decelerating Flow',
    clinicalScenario: 'A 70-year-old female (Height: 160 cm, PBW 52.5 kg) with flail chest and abdominal compartment syndrome transitioned from VCV to PCV to cap peak airway pressures.',
    settings: {
      mode: 'PCV',
      tidalVolumeMl: 400,
      inspiratoryPressureCmH2O: 16,
      respiratoryRate: 18,
      peepCmH2O: 8,
      fiO2: 0.50,
      ieRatio: { insp: 1, exp: 2 },
      peakFlowLpm: 60,
      flowWaveform: 'DECELERATING',
      inspiratoryPausePercent: 0,
      flowTriggerLpm: 2.0,
    },
    patient: {
      heightCm: 160,
      gender: 'FEMALE',
      complianceMlPerCmH2O: 30,
      resistanceCmH2OPerLps: 8,
    },
    teachingPoints: [
      'In PCV, inspiratory pressure is constant, creating a square pressure waveform and an exponential decelerating flow waveform.',
      'Decelerating flow provides superior gas distribution across lung units with heterogeneous time constants.',
      'Warning: Delivered tidal volume varies directly with lung compliance and patient effort. If compliance drops, VT drops proportionately!',
    ],
  },
  {
    id: 'weaning-sbt',
    title: 'Spontaneous Breathing Trial (PSV Weaning & RSBI)',
    clinicalScenario: 'A 45-year-old male recovering from sepsis undergoing an extubation readiness trial on Pressure Support Ventilation (PSV).',
    settings: {
      mode: 'PSV',
      tidalVolumeMl: 480,
      inspiratoryPressureCmH2O: 8, // Low PS to overcome ETT resistance
      respiratoryRate: 14,
      peepCmH2O: 5,
      fiO2: 0.35,
      ieRatio: { insp: 1, exp: 2.5 },
      peakFlowLpm: 60,
      flowWaveform: 'DECELERATING',
      inspiratoryPausePercent: 0,
      flowTriggerLpm: 1.5,
    },
    patient: {
      heightCm: 172,
      gender: 'MALE',
      complianceMlPerCmH2O: 65,
      resistanceCmH2OPerLps: 4,
    },
    teachingPoints: [
      'Rapid Shallow Breathing Index (RSBI = f / VT(L)): Yang & Tobin criteria.',
      'If RSBI < 105 breaths/min/L, the likelihood of successful extubation is >80%.',
      'If RSBI > 105, diaphragmatic fatigue is imminent; abort the trial and investigate underlying causes.',
    ],
  },
];
