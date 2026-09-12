/**
 * LvadHemodynamicRampEngine.ts
 * Advanced Critical Care Echocardiography & Mechanical Circulatory Support:
 * Left Ventricular Assist Device (HeartMate 3 MagLev) Speed Optimization,
 * RAMP Test Protocol, Apical Suction Recovery & RV Failure Hemodynamics Workstation.
 *
 * Implements:
 * 1. HeartMate 3 Rotary MagLev Pump Kinetics:
 *    - Speed: 4800 to 6400 rpm (nominal 5000-6000 rpm)
 *    - Estimated Flow: 2.0 to 8.0 L/min
 *    - Pump Power: 3.0 to 14.0 Watts (normal 3.5 - 6.0 W; > 9-10 W indicates pump thrombosis)
 *    - Pulsatility Index (PI): 1.5 to 6.5 (normal 2.5 - 4.5)
 *    - Artificial Pulse cycle (modulation every 2 sec)
 * 2. Echocardiographic RAMP Test Protocol:
 *    - Stepwise 100 rpm speed titration
 *    - LVEDD unloading slope (> 0.16 cm / 1000 rpm = normal unloading; flat = thrombus/AI)
 *    - Interventricular septal position (midline vs leftward vs rightward shift)
 *    - Aortic valve opening frequency (intermittent every 2-3 beats = optimal; permanently closed vs permanently open)
 * 3. Acute LVAD Emergencies & Hemodynamic Syndromes:
 *    - Apical Inflow Suction Event: flow drop (< 2.5 L/min), plummeting PI (< 2.0), ventricular ectopy/VT, speed reduction + volume resuscitation
 *    - Post-LVAD Right Ventricular Failure: CVP > 16-18 mmHg, CVP/PCWP > 0.63, PAPi = (sPAP - dPAP)/CVP < 1.85, leftward septal shift, inotropes + iNO
 *    - Pump Thrombosis: power spike (> 10 W), flat RAMP slope, gross hemoglobinuria, serum LDH > 1000-2500 IU/L, heparin/thrombolytics
 *    - De Novo Aortic Insufficiency: closed-loop regurgitant volume with high pump flow but low systemic forward perfusion
 * 4. 6 Clinically Validated Scenarios
 *
 * Location: frontend/.gemini/skills/LvadHemodynamicRampEngine.ts
 */

export type LvadScenarioPresetId =
  | 'RAMP_PROTOCOL_SPEED_OPTIMIZATION'
  | 'ACUTE_SUCTION_EVENT_HYPOVOLEMIA'
  | 'DECOMPENSATED_RV_FAILURE_POST_IMPLANT'
  | 'PUMP_THROMBOSIS_POWER_SPIKE_HEMOLYSIS'
  | 'DE_NOVO_AORTIC_REGURGITATION_RECIRCULATION'
  | 'INFLOW_CANNULA_MALPOSITION_VT';

export type SeptalPosition =
  | 'MIDLINE_NEUTRAL'
  | 'LEFTWARD_SHIFT_UNDERLOADED'
  | 'RIGHTWARD_SHIFT_OVERLOADED'
  | 'SEVERE_SEPTAL_BOWING';

export type AorticValveState =
  | 'INTERMITTENT_OPENING_OPTIMAL'
  | 'PERMANENTLY_CLOSED'
  | 'PERMANENTLY_OPEN'
  | 'SEVERE_AORTIC_INSUFFICIENCY';

export interface HeartMate3PumpParameters {
  speedRpm: number;
  flowLpm: number;
  powerWatts: number;
  pulsatilityIndex: number;
  artificialPulseActive: boolean;
  suctionEventActive: boolean;
  lowFlowAlarmActive: boolean;
}

export interface EchoHemodynamics {
  heartRateBpm: number;
  mapMmHg: number; // Mean arterial pressure by Doppler
  cvpMmHg: number; // Central venous pressure (normal 4 - 10 mmHg)
  papSystolicMmHg: number;
  papDiastolicMmHg: number;
  pcwpMmHg: number; // Wedge pressure (normal 8 - 14 mmHg)
  papiRatio: number; // (sPAP - dPAP) / CVP
  lveddCm: number; // LV end-diastolic diameter
  septalPosition: SeptalPosition;
  aorticValveStatus: AorticValveState;
  mitralRegurgitationSeverity: 'NONE' | 'TRACE_MILD' | 'MODERATE' | 'SEVERE';
  tapseMm: number; // Tricuspid annular plane systolic excursion (normal > 16 mm; < 12 = RV failure)
  cardiacIndexLpmM2: number;
}

export interface LaboratoryHemolysis {
  serumLdhIuL: number; // Normal 140 - 280 IU/L; > 1000 indicates thrombosis
  plasmaFreeHbMgDl: number; // Normal < 10 mg/dL; > 40 = severe hemolysis
  urineColor: 'CLEAR_YELLOW' | 'AMBER' | 'DARK_TEA_BURGUNDY';
  serumCreatinineMgDl: number;
}

export interface RampStepRecord {
  stepSpeedRpm: number;
  lveddCm: number;
  flowLpm: number;
  powerWatts: number;
  pi: number;
  septalPosition: SeptalPosition;
  aorticValveStatus: AorticValveState;
}

export interface LvadPatientState {
  scenarioId: LvadScenarioPresetId;
  elapsedSeconds: number;
  pump: HeartMate3PumpParameters;
  hemodynamics: EchoHemodynamics;
  labs: LaboratoryHemolysis;
  rampProtocolHistory: RampStepRecord[];
  activeInotropes: {
    milrinoneMcgKgMin: number;
    dobutamineMcgKgMin: number;
    inoPpm: number;
  };
  anticoagulationActive: boolean;
  administeredFluidMl: number;
  clinicalAlarms: string[];
  interventionsPerformed: string[];
}

export interface LvadScenarioDefinition {
  id: LvadScenarioPresetId;
  title: string;
  patientProfile: string;
  clinicalPresentation: string;
  baselinePump: {
    speedRpm: number;
    flowLpm: number;
    powerWatts: number;
    pulsatilityIndex: number;
  };
  baselineHemodynamics: {
    heartRateBpm: number;
    mapMmHg: number;
    cvpMmHg: number;
    papSystolicMmHg: number;
    papDiastolicMmHg: number;
    pcwpMmHg: number;
    lveddCm: number;
    septalPosition: SeptalPosition;
    aorticValveStatus: AorticValveState;
    mitralRegurg: 'NONE' | 'TRACE_MILD' | 'MODERATE' | 'SEVERE';
    tapseMm: number;
  };
  baselineLabs: {
    serumLdhIuL: number;
    plasmaFreeHbMgDl: number;
    urineColor: 'CLEAR_YELLOW' | 'AMBER' | 'DARK_TEA_BURGUNDY';
    serumCreatinineMgDl: number;
  };
  targetOptimalSpeedRpm: number;
  keyTeachingPoints: string[];
}

/**
 * 6 Clinically Validated LVAD Scenarios
 */
export const LVAD_SCENARIOS: Record<LvadScenarioPresetId, LvadScenarioDefinition> = {
  RAMP_PROTOCOL_SPEED_OPTIMIZATION: {
    id: 'RAMP_PROTOCOL_SPEED_OPTIMIZATION',
    title: 'Scenario 1: Outpatient RAMP Test for Speed Optimization in a Stable HM3 Patient',
    patientProfile: '58-year-old male with HeartMate 3 LVAD implanted 6 months ago for ischemic cardiomyopathy',
    clinicalPresentation:
      'Patient presents to the LVAD clinic for a routine RAMP study. Current speed is 5000 rpm. The aortic valve is opening with every single beat, LVEDD is 6.2 cm (underloaded LV), and mild mitral regurgitation is present. CVP is 8 mmHg and PCWP is 18 mmHg. Stepwise titration up to 5500-5600 rpm is planned to achieve optimal LV unloading with intermittent aortic valve opening.',
    baselinePump: {
      speedRpm: 5000,
      flowLpm: 4.2,
      powerWatts: 4.0,
      pulsatilityIndex: 4.2,
    },
    baselineHemodynamics: {
      heartRateBpm: 76,
      mapMmHg: 82,
      cvpMmHg: 8,
      papSystolicMmHg: 38,
      papDiastolicMmHg: 20,
      pcwpMmHg: 18,
      lveddCm: 6.2,
      septalPosition: 'LEFTWARD_SHIFT_UNDERLOADED',
      aorticValveStatus: 'PERMANENTLY_OPEN',
      mitralRegurg: 'MODERATE',
      tapseMm: 18,
    },
    baselineLabs: {
      serumLdhIuL: 210,
      plasmaFreeHbMgDl: 4,
      urineColor: 'CLEAR_YELLOW',
      serumCreatinineMgDl: 1.1,
    },
    targetOptimalSpeedRpm: 5500,
    keyTeachingPoints: [
      'The goal of a RAMP study is to find the sweet spot of pump speed: LVEDD reduction without shifting the septum into the inflow cannula.',
      'Intermittent aortic valve opening (every 2-3 beats) prevents aortic cusp fusion, commissural thrombosis, and de novo aortic regurgitation.',
      'Normal LVEDD unloading slope exceeds 0.16 cm / 1000 rpm of speed increase.',
    ],
  },

  ACUTE_SUCTION_EVENT_HYPOVOLEMIA: {
    id: 'ACUTE_SUCTION_EVENT_HYPOVOLEMIA',
    title: 'Scenario 2: Acute Apical Suction Event in a Dehydrated Patient with Gastroenteritis',
    patientProfile: '64-year-old female with HM3 LVAD presenting with 3 days of severe diarrhea and vomiting',
    clinicalPresentation:
      'Patient is brought into the ED with repeated "Low Flow" and "Suction" alarms on her HeartMate 3 controller. Speed is 5700 rpm. Pump flow has crashed from 5.1 L/min to 2.1 L/min, and PI has plummeted to 1.6. Telemetry reveals frequent PVCs and ventricular bigeminy from inflow cannula irritation of the collapsing left ventricular apex. Doppler MAP is 60 mmHg. Urgent speed step-down and IV crystalloids required!',
    baselinePump: {
      speedRpm: 5700,
      flowLpm: 2.1, // Severe low flow!
      powerWatts: 3.2,
      pulsatilityIndex: 1.6, // Low PI indicates hypovolemia
    },
    baselineHemodynamics: {
      heartRateBpm: 112,
      mapMmHg: 60,
      cvpMmHg: 3, // Hypovolemic
      papSystolicMmHg: 22,
      papDiastolicMmHg: 10,
      pcwpMmHg: 5,
      lveddCm: 3.8, // Small, collapsed LV
      septalPosition: 'SEVERE_SEPTAL_BOWING',
      aorticValveStatus: 'PERMANENTLY_CLOSED',
      mitralRegurg: 'NONE',
      tapseMm: 16,
    },
    baselineLabs: {
      serumLdhIuL: 260,
      plasmaFreeHbMgDl: 8,
      urineColor: 'AMBER',
      serumCreatinineMgDl: 1.8,
    },
    targetOptimalSpeedRpm: 5200,
    keyTeachingPoints: [
      'Suction events occur when pump speed exceeds venous return to the left ventricle, causing the ventricular septum or lateral wall to suck against the inflow cannula.',
      'A low Pulsatility Index (PI < 2.0) combined with low pump flow is classic for hypovolemia or inflow obstruction.',
      'Immediate management requires stepping down pump speed by 200-400 rpm and infusing IV crystalloids to restore LV filling.',
    ],
  },

  DECOMPENSATED_RV_FAILURE_POST_IMPLANT: {
    id: 'DECOMPENSATED_RV_FAILURE_POST_IMPLANT',
    title: 'Scenario 3: Acute Decompensated Right Ventricular Failure Post-Implant (CVP 20, PAPi 1.15)',
    patientProfile: '52-year-old male on Postoperative Day 4 following HeartMate 3 implantation',
    clinicalPresentation:
      'Patient develops worsening abdominal distension, hepatomegaly, jugular venous distension, and oliguria. Central venous pressure is elevated at 20 mmHg while PCWP is 11 mmHg (CVP/PCWP ratio = 1.82). Pulmonary Artery Pulsatility Index (PAPi) is severely depressed at 1.15. Echocardiography shows severe right ventricular dilation, severe tricuspid regurgitation, TAPSE 9 mm, and leftward septal shift compressing the LV cavity. Requires inotropic RV support and pulmonary vasodilation.',
    baselinePump: {
      speedRpm: 5600,
      flowLpm: 3.4, // Reduced flow due to poor RV delivery
      powerWatts: 4.2,
      pulsatilityIndex: 2.1,
    },
    baselineHemodynamics: {
      heartRateBpm: 104,
      mapMmHg: 68,
      cvpMmHg: 20, // Severe RV failure
      papSystolicMmHg: 35,
      papDiastolicMmHg: 12,
      pcwpMmHg: 11,
      lveddCm: 4.4,
      septalPosition: 'LEFTWARD_SHIFT_UNDERLOADED',
      aorticValveStatus: 'PERMANENTLY_CLOSED',
      mitralRegurg: 'NONE',
      tapseMm: 9, // Severe RV dysfunction
    },
    baselineLabs: {
      serumLdhIuL: 290,
      plasmaFreeHbMgDl: 6,
      urineColor: 'AMBER',
      serumCreatinineMgDl: 1.6,
    },
    targetOptimalSpeedRpm: 5300,
    keyTeachingPoints: [
      'Right ventricular failure is the primary cause of early postoperative morbidity after LVAD implantation.',
      'CVP/PCWP > 0.63 and PAPi = (sPAP - dPAP)/CVP < 1.85 are validated predictive hemodynamic markers of RV failure.',
      'Excessive LVAD speed worsens RV failure by pulling the interventricular septum leftward, disrupting RV geometric contractility.',
    ],
  },

  PUMP_THROMBOSIS_POWER_SPIKE_HEMOLYSIS: {
    id: 'PUMP_THROMBOSIS_POWER_SPIKE_HEMOLYSIS',
    title: 'Scenario 4: Suspected HeartMate 3 Pump Thrombosis with Power Spike & Gross Hemoglobinuria',
    patientProfile: '61-year-old male with HM3 LVAD who subtherapeutically discontinued Warfarin 2 weeks ago',
    clinicalPresentation:
      'Patient is admitted with dark tea-colored (burgundy) urine, jaundice, and fatigue. The LVAD controller displays a persistent power surge: 11.5 Watts (normal 4.0-5.0 W). Serum LDH is markedly elevated at 2400 IU/L and plasma free hemoglobin is 68 mg/dL. RAMP test shows a completely flat LVEDD unloading slope (< 0.05 cm/1000 rpm), confirming pump rotor drag from an intra-pump thrombus. Emergency IV unfractionated heparin protocol required.',
    baselinePump: {
      speedRpm: 5400,
      flowLpm: 6.8, // Artificially calculated high flow due to high power!
      powerWatts: 11.5, // Power spike!
      pulsatilityIndex: 3.8,
    },
    baselineHemodynamics: {
      heartRateBpm: 92,
      mapMmHg: 78,
      cvpMmHg: 12,
      papSystolicMmHg: 42,
      papDiastolicMmHg: 22,
      pcwpMmHg: 22,
      lveddCm: 6.4,
      septalPosition: 'LEFTWARD_SHIFT_UNDERLOADED',
      aorticValveStatus: 'PERMANENTLY_CLOSED',
      mitralRegurg: 'MODERATE',
      tapseMm: 15,
    },
    baselineLabs: {
      serumLdhIuL: 2400, // Massive hemolysis!
      plasmaFreeHbMgDl: 68,
      urineColor: 'DARK_TEA_BURGUNDY',
      serumCreatinineMgDl: 1.5,
    },
    targetOptimalSpeedRpm: 5400,
    keyTeachingPoints: [
      'Pump thrombosis increases mechanical friction against the MagLev rotor, triggering sudden elevation in pump power (> 9-10 Watts).',
      'The flow displayed on continuous-flow controllers is estimated from speed and power; during thrombosis, high power creates a false reading of high flow!',
      'Serum LDH > 1000-2000 IU/L and plasma free hemoglobin > 40 mg/dL confirm severe intravascular shear hemolysis.',
    ],
  },

  DE_NOVO_AORTIC_REGURGITATION_RECIRCULATION: {
    id: 'DE_NOVO_AORTIC_REGURGITATION_RECIRCULATION',
    title: 'Scenario 5: De Novo Severe Aortic Regurgitation & Closed-Loop Recirculation with Heart Failure',
    patientProfile: '67-year-old female with HM3 LVAD implanted 3 years ago on chronic high-speed support',
    clinicalPresentation:
      'Patient presents with progressive dyspnea and orthopnea. Speed is 5900 rpm. Controller displays flow of 6.2 L/min, yet patient is in NYHA Class IV heart failure with cardiac index 1.8 L/min/m2. Echocardiography demonstrates a permanently closed aortic valve with severe central regurgitation. Blood pumped by the LVAD into the ascending aorta immediately regurgitates back into the LV, creating a futile recirculation loop.',
    baselinePump: {
      speedRpm: 5900,
      flowLpm: 6.2, // High calculated loop flow
      powerWatts: 5.6,
      pulsatilityIndex: 2.3,
    },
    baselineHemodynamics: {
      heartRateBpm: 88,
      mapMmHg: 74,
      cvpMmHg: 14,
      papSystolicMmHg: 48,
      papDiastolicMmHg: 26,
      pcwpMmHg: 24,
      lveddCm: 6.8, // Dilated LV despite high speed!
      septalPosition: 'LEFTWARD_SHIFT_UNDERLOADED',
      aorticValveStatus: 'SEVERE_AORTIC_INSUFFICIENCY',
      mitralRegurg: 'SEVERE',
      tapseMm: 14,
    },
    baselineLabs: {
      serumLdhIuL: 230,
      plasmaFreeHbMgDl: 6,
      urineColor: 'CLEAR_YELLOW',
      serumCreatinineMgDl: 1.3,
    },
    targetOptimalSpeedRpm: 5400,
    keyTeachingPoints: [
      'Chronic continuous non-opening of the aortic valve causes leaflet thinning, commissural fusion, and severe de novo aortic insufficiency.',
      'Aortic regurgitation creates a closed-loop recirculation where pump flow is high but effective systemic forward output is near zero.',
      'Transcatheter aortic valve closure or surgical leaflet coaptation is required for refractory severe de novo AI.',
    ],
  },

  INFLOW_CANNULA_MALPOSITION_VT: {
    id: 'INFLOW_CANNULA_MALPOSITION_VT',
    title: 'Scenario 6: Inflow Cannula Malposition & Ventricular Arrhythmia (Septal Chattering & Monomorphic VT)',
    patientProfile: '59-year-old male with HM3 LVAD presenting with multiple ICD shocks',
    clinicalPresentation:
      'Patient is transferred from an outside hospital following three ICD shocks for sustained monomorphic ventricular tachycardia. Echocardiography demonstrates that the apical inflow cannula is angled toward the interventricular septum, causing mechanical contact during diastole ("septal chattering"). When speed is increased above 5400 rpm, premature ventricular complexes immediately fire into sustained VT.',
    baselinePump: {
      speedRpm: 5600,
      flowLpm: 4.0,
      powerWatts: 4.8,
      pulsatilityIndex: 2.8,
    },
    baselineHemodynamics: {
      heartRateBpm: 124,
      mapMmHg: 66,
      cvpMmHg: 10,
      papSystolicMmHg: 32,
      papDiastolicMmHg: 16,
      pcwpMmHg: 14,
      lveddCm: 4.6,
      septalPosition: 'SEVERE_SEPTAL_BOWING',
      aorticValveStatus: 'PERMANENTLY_CLOSED',
      mitralRegurg: 'TRACE_MILD',
      tapseMm: 17,
    },
    baselineLabs: {
      serumLdhIuL: 240,
      plasmaFreeHbMgDl: 5,
      urineColor: 'CLEAR_YELLOW',
      serumCreatinineMgDl: 1.2,
    },
    targetOptimalSpeedRpm: 5100,
    keyTeachingPoints: [
      'Inflow cannula malposition occurs when the apical ring points toward the septum or lateral wall rather than toward the mitral valve.',
      'Mechanical cannula-myocardial contact triggers intractable ventricular arrhythmias and suction events.',
      'Reducing pump speed to allow the LV to fill relieves mechanical irritation while surgical repositioning is evaluated.',
    ],
  },
};

/**
 * Calculates Pulmonary Artery Pulsatility Index (PAPi)
 * Formula: PAPi = (sPAP - dPAP) / CVP
 */
export function calculatePapi(papSystolic: number, papDiastolic: number, cvp: number): number {
  if (cvp <= 0) return 3.0; // Normal high if CVP is low
  const pulsePressure = papSystolic - papDiastolic;
  const papi = pulsePressure / cvp;
  return Number(papi.toFixed(2));
}

/**
 * Initialize patient state from an LVAD scenario preset
 */
export function initializeLvadPatientState(scenarioId: LvadScenarioPresetId): LvadPatientState {
  const scenario = LVAD_SCENARIOS[scenarioId];
  const papi = calculatePapi(
    scenario.baselineHemodynamics.papSystolicMmHg,
    scenario.baselineHemodynamics.papDiastolicMmHg,
    scenario.baselineHemodynamics.cvpMmHg
  );

  const isSuction = scenario.id === 'ACUTE_SUCTION_EVENT_HYPOVOLEMIA';
  const isLowFlow = scenario.baselinePump.flowLpm < 2.5;

  const initialRecord: RampStepRecord = {
    stepSpeedRpm: scenario.baselinePump.speedRpm,
    lveddCm: scenario.baselineHemodynamics.lveddCm,
    flowLpm: scenario.baselinePump.flowLpm,
    powerWatts: scenario.baselinePump.powerWatts,
    pi: scenario.baselinePump.pulsatilityIndex,
    septalPosition: scenario.baselineHemodynamics.septalPosition,
    aorticValveStatus: scenario.baselineHemodynamics.aorticValveStatus,
  };

  return {
    scenarioId,
    elapsedSeconds: 0,
    pump: {
      speedRpm: scenario.baselinePump.speedRpm,
      flowLpm: scenario.baselinePump.flowLpm,
      powerWatts: scenario.baselinePump.powerWatts,
      pulsatilityIndex: scenario.baselinePump.pulsatilityIndex,
      artificialPulseActive: true,
      suctionEventActive: isSuction,
      lowFlowAlarmActive: isLowFlow,
    },
    hemodynamics: {
      heartRateBpm: scenario.baselineHemodynamics.heartRateBpm,
      mapMmHg: scenario.baselineHemodynamics.mapMmHg,
      cvpMmHg: scenario.baselineHemodynamics.cvpMmHg,
      papSystolicMmHg: scenario.baselineHemodynamics.papSystolicMmHg,
      papDiastolicMmHg: scenario.baselineHemodynamics.papDiastolicMmHg,
      pcwpMmHg: scenario.baselineHemodynamics.pcwpMmHg,
      papiRatio: papi,
      lveddCm: scenario.baselineHemodynamics.lveddCm,
      septalPosition: scenario.baselineHemodynamics.septalPosition,
      aorticValveStatus: scenario.baselineHemodynamics.aorticValveStatus,
      mitralRegurgitationSeverity: scenario.baselineHemodynamics.mitralRegurg,
      tapseMm: scenario.baselineHemodynamics.tapseMm,
      cardiacIndexLpmM2: 2.4,
    },
    labs: {
      serumLdhIuL: scenario.baselineLabs.serumLdhIuL,
      plasmaFreeHbMgDl: scenario.baselineLabs.plasmaFreeHbMgDl,
      urineColor: scenario.baselineLabs.urineColor,
      serumCreatinineMgDl: scenario.baselineLabs.serumCreatinineMgDl,
    },
    rampProtocolHistory: [initialRecord],
    activeInotropes: {
      milrinoneMcgKgMin: 0,
      dobutamineMcgKgMin: 0,
      inoPpm: 0,
    },
    anticoagulationActive: scenario.id !== 'PUMP_THROMBOSIS_POWER_SPIKE_HEMOLYSIS',
    administeredFluidMl: 0,
    clinicalAlarms: isSuction
      ? ['LOW FLOW ALARM: Pump Flow < 2.5 L/min', 'SUCTION WARNING: Inflow cannula obstruction detected!']
      : scenario.id === 'PUMP_THROMBOSIS_POWER_SPIKE_HEMOLYSIS'
      ? ['POWER SPIKE ALARM: Pump Power > 10 Watts!', 'CRITICAL HEMOLYSIS: Serum LDH > 2000 IU/L!']
      : [],
    interventionsPerformed: [],
  };
}

/**
 * Titrate HeartMate 3 Pump Speed (Step +100 / -100 or manual RPM)
 */
export function titratePumpSpeed(
  state: LvadPatientState,
  newSpeedRpm: number
): { updatedState: LvadPatientState; message: string } {
  const newState: LvadPatientState = JSON.parse(JSON.stringify(state));
  const clampedSpeed = Math.max(4800, Math.min(6400, Math.round(newSpeedRpm / 100) * 100));
  const speedDelta = clampedSpeed - newState.pump.speedRpm;

  newState.pump.speedRpm = clampedSpeed;

  const hasThrombus = newState.scenarioId === 'PUMP_THROMBOSIS_POWER_SPIKE_HEMOLYSIS' && !newState.anticoagulationActive;
  const isHypovolemic = newState.hemodynamics.cvpMmHg < 6 && newState.administeredFluidMl < 500;

  // Flow & Power calculation:
  if (hasThrombus) {
    newState.pump.powerWatts = Number((10.5 + (clampedSpeed - 5400) * 0.003).toFixed(1));
    newState.pump.flowLpm = Number((6.5 + (clampedSpeed - 5400) * 0.001).toFixed(1));
  } else if (isHypovolemic && clampedSpeed >= 5400) {
    // Precipitates suction
    newState.pump.suctionEventActive = true;
    newState.pump.lowFlowAlarmActive = true;
    newState.pump.flowLpm = 2.1;
    newState.pump.pulsatilityIndex = 1.6;
    newState.hemodynamics.septalPosition = 'SEVERE_SEPTAL_BOWING';
    if (!newState.clinicalAlarms.some((a) => a.includes('SUCTION'))) {
      newState.clinicalAlarms.push('SUCTION WARNING: Inflow cannula obstruction detected!');
    }
  } else {
    // Normal response
    newState.pump.flowLpm = Number((4.5 + (clampedSpeed - 5000) * 0.0025).toFixed(1));
    newState.pump.powerWatts = Number((4.0 + (clampedSpeed - 5000) * 0.002).toFixed(1));
    newState.pump.pulsatilityIndex = Number(Math.max(2.0, 4.2 - (clampedSpeed - 5000) * 0.002).toFixed(1));

    if (clampedSpeed <= 5300 && newState.pump.suctionEventActive) {
      newState.pump.suctionEventActive = false;
      newState.pump.lowFlowAlarmActive = false;
      newState.clinicalAlarms = newState.clinicalAlarms.filter((a) => !a.includes('SUCTION') && !a.includes('LOW FLOW'));
    }
  }

  // Echocardiographic Unloading: LVEDD changes
  if (hasThrombus) {
    // Flat slope (< 0.05 cm / 1000 rpm)
    newState.hemodynamics.lveddCm = 6.4;
  } else {
    // Normal slope: 0.20 cm per 1000 rpm
    const baseLvedd = 6.2;
    const speedAbove5000 = clampedSpeed - 5000;
    newState.hemodynamics.lveddCm = Number((baseLvedd - (speedAbove5000 / 1000) * 0.20).toFixed(2));
  }

  // Aortic valve opening state:
  if (clampedSpeed < 5200) {
    newState.hemodynamics.aorticValveStatus = 'PERMANENTLY_OPEN';
    newState.hemodynamics.septalPosition = 'LEFTWARD_SHIFT_UNDERLOADED';
  } else if (clampedSpeed <= 5600) {
    newState.hemodynamics.aorticValveStatus = 'INTERMITTENT_OPENING_OPTIMAL';
    newState.hemodynamics.septalPosition = 'MIDLINE_NEUTRAL';
  } else {
    newState.hemodynamics.aorticValveStatus = 'PERMANENTLY_CLOSED';
    newState.hemodynamics.septalPosition = 'RIGHTWARD_SHIFT_OVERLOADED';
  }

  // Record in RAMP history if this speed step is unique
  if (!newState.rampProtocolHistory.some((r) => r.stepSpeedRpm === clampedSpeed)) {
    newState.rampProtocolHistory.push({
      stepSpeedRpm: clampedSpeed,
      lveddCm: newState.hemodynamics.lveddCm,
      flowLpm: newState.pump.flowLpm,
      powerWatts: newState.pump.powerWatts,
      pi: newState.pump.pulsatilityIndex,
      septalPosition: newState.hemodynamics.septalPosition,
      aorticValveStatus: newState.hemodynamics.aorticValveStatus,
    });
  }

  newState.interventionsPerformed.push(`Speed adjusted to ${clampedSpeed} rpm`);

  return {
    updatedState: newState,
    message: `HeartMate 3 speed set to ${clampedSpeed} rpm. Flow: ${newState.pump.flowLpm} L/min, Power: ${newState.pump.powerWatts} W, LVEDD: ${newState.hemodynamics.lveddCm} cm (${newState.hemodynamics.aorticValveStatus}).`,
  };
}

/**
 * Deliver IV Crystalloid Fluid Bolus (250 - 500 mL) for Suction / Hypovolemia
 */
export function deliverFluidBolus(
  state: LvadPatientState,
  volumeMl: number = 500
): { updatedState: LvadPatientState; message: string } {
  const newState: LvadPatientState = JSON.parse(JSON.stringify(state));
  newState.administeredFluidMl += volumeMl;
  newState.hemodynamics.cvpMmHg = Math.min(14, newState.hemodynamics.cvpMmHg + 4);
  newState.hemodynamics.pcwpMmHg = Math.min(18, newState.hemodynamics.pcwpMmHg + 4);
  newState.hemodynamics.mapMmHg = Math.min(90, newState.hemodynamics.mapMmHg + 8);

  // If in suction, volume expands LV and relieves suction
  if (newState.pump.suctionEventActive) {
    newState.pump.suctionEventActive = false;
    newState.pump.lowFlowAlarmActive = false;
    newState.pump.flowLpm = 4.4;
    newState.pump.pulsatilityIndex = 3.2;
    newState.hemodynamics.lveddCm = Math.max(4.6, newState.hemodynamics.lveddCm + 0.6);
    newState.hemodynamics.septalPosition = 'MIDLINE_NEUTRAL';
    newState.clinicalAlarms = newState.clinicalAlarms.filter((a) => !a.includes('SUCTION') && !a.includes('LOW FLOW'));
  }

  newState.interventionsPerformed.push(`Administered ${volumeMl} mL Crystalloid Bolus`);

  return {
    updatedState: newState,
    message: `Infused ${volumeMl} mL IV crystalloids. CVP increased to ${newState.hemodynamics.cvpMmHg} mmHg. Suction relieved, flow restored to ${newState.pump.flowLpm} L/min.`,
  };
}

/**
 * Titrate Inotrope or Pulmonary Vasodilator (Milrinone, Dobutamine, Inhaled Nitric Oxide)
 */
export function titrateInotropeOrVasodilator(
  state: LvadPatientState,
  drug: 'MILRINONE' | 'DOBUTAMINE' | 'INO',
  dose: number
): { updatedState: LvadPatientState; message: string } {
  const newState: LvadPatientState = JSON.parse(JSON.stringify(state));

  switch (drug) {
    case 'MILRINONE':
      newState.activeInotropes.milrinoneMcgKgMin = dose;
      break;
    case 'DOBUTAMINE':
      newState.activeInotropes.dobutamineMcgKgMin = dose;
      break;
    case 'INO':
      newState.activeInotropes.inoPpm = dose;
      break;
  }

  // Pulmonary vasodilation and RV inotropy improves RV failure:
  if (drug === 'INO' && dose > 0) {
    newState.hemodynamics.papSystolicMmHg = Math.max(26, newState.hemodynamics.papSystolicMmHg - 8);
    newState.hemodynamics.cvpMmHg = Math.max(8, newState.hemodynamics.cvpMmHg - 5);
    newState.hemodynamics.papiRatio = calculatePapi(
      newState.hemodynamics.papSystolicMmHg,
      newState.hemodynamics.papDiastolicMmHg,
      newState.hemodynamics.cvpMmHg
    );
    newState.hemodynamics.tapseMm = Math.min(16, newState.hemodynamics.tapseMm + 3);
  }

  if ((drug === 'MILRINONE' || drug === 'DOBUTAMINE') && dose > 0) {
    newState.hemodynamics.tapseMm = Math.min(18, newState.hemodynamics.tapseMm + 4);
    newState.hemodynamics.cvpMmHg = Math.max(8, newState.hemodynamics.cvpMmHg - 4);
    newState.hemodynamics.papiRatio = calculatePapi(
      newState.hemodynamics.papSystolicMmHg,
      newState.hemodynamics.papDiastolicMmHg,
      newState.hemodynamics.cvpMmHg
    );
    newState.pump.flowLpm = Math.min(5.5, newState.pump.flowLpm + 0.8);
    newState.hemodynamics.septalPosition = 'MIDLINE_NEUTRAL';
  }

  newState.interventionsPerformed.push(`Titrated ${drug} to ${dose}`);

  return {
    updatedState: newState,
    message: `Titrated ${drug} to ${dose}. CVP: ${newState.hemodynamics.cvpMmHg} mmHg, PAPi: ${newState.hemodynamics.papiRatio}, TAPSE: ${newState.hemodynamics.tapseMm} mm.`,
  };
}

/**
 * Administer Anticoagulation / Thrombolytic Therapy for Pump Thrombosis
 */
export function administerAnticoagulation(
  state: LvadPatientState,
  agent: 'HEPARIN_INFUSION' | 'ALTEPLASE_TPA'
): { updatedState: LvadPatientState; message: string } {
  const newState: LvadPatientState = JSON.parse(JSON.stringify(state));
  newState.anticoagulationActive = true;

  if (newState.scenarioId === 'PUMP_THROMBOSIS_POWER_SPIKE_HEMOLYSIS') {
    // Thrombus lysis: Power normalizes, hemolysis markers decrease
    newState.pump.powerWatts = 4.6;
    newState.labs.serumLdhIuL = 420;
    newState.labs.plasmaFreeHbMgDl = 14;
    newState.labs.urineColor = 'AMBER';
    newState.clinicalAlarms = newState.clinicalAlarms.filter((a) => !a.includes('POWER SPIKE') && !a.includes('HEMOLYSIS'));
  }

  newState.interventionsPerformed.push(`Initiated ${agent} Protocol`);

  return {
    updatedState: newState,
    message: `Initiated ${agent}. Rotor drag resolved; pump power normalized to 4.6 W. Hemolysis cleared.`,
  };
}

/**
 * Advance LVAD Simulation Time Step
 */
export function advanceLvadTimeStep(state: LvadPatientState, secondsStep: number = 10): LvadPatientState {
  const newState: LvadPatientState = JSON.parse(JSON.stringify(state));
  newState.elapsedSeconds += secondsStep;

  // Check for RV failure
  if (newState.hemodynamics.papiRatio < 1.85 && newState.hemodynamics.cvpMmHg > 16) {
    if (!newState.clinicalAlarms.some((a) => a.includes('RV FAILURE'))) {
      newState.clinicalAlarms.push('ACUTE RV FAILURE: CVP > 16 mmHg & PAPi < 1.85! Inotropes + iNO indicated.');
    }
  }

  return newState;
}

export interface LvadDebriefResult {
  scorePercentage: number;
  letterGrade: 'A+' | 'A' | 'B' | 'C' | 'FAIL';
  rampSpeedOptimized: boolean;
  suctionRelievedPromptly: boolean;
  rvFailureTreatedCorrectly: boolean;
  thrombosisManaged: boolean;
  facultyFeedback: string[];
}

/**
 * Objective Debriefing Rubric for LVAD RAMP & Emergency Management
 */
export function evaluateLvadDebrief(state: LvadPatientState): LvadDebriefResult {
  const scenario = LVAD_SCENARIOS[state.scenarioId];
  let score = 100;
  const facultyFeedback: string[] = [];

  // 1. RAMP Speed Optimization
  let rampSpeedOptimized = true;
  if (scenario.id === 'RAMP_PROTOCOL_SPEED_OPTIMIZATION') {
    if (state.pump.speedRpm >= 5400 && state.pump.speedRpm <= 5600) {
      facultyFeedback.push('Ideal RAMP Titration: Optimized speed to 5500-5600 rpm achieving midline septum and intermittent aortic valve opening.');
    } else {
      score -= 20;
      rampSpeedOptimized = false;
      facultyFeedback.push('Suboptimal RAMP Speed: Failed to titrate speed to achieve target LVEDD unloading and intermittent AV opening.');
    }
  }

  // 2. Suction Event Management
  let suctionRelievedPromptly = true;
  if (scenario.id === 'ACUTE_SUCTION_EVENT_HYPOVOLEMIA') {
    if (!state.pump.suctionEventActive && state.administeredFluidMl >= 250) {
      facultyFeedback.push('Lifesaving Suction Recovery: Delivered crystalloid bolus and reduced pump speed, resolving apical suction.');
    } else {
      score -= 30;
      suctionRelievedPromptly = false;
      facultyFeedback.push('Unrelieved Suction: Inflow cannula suction persisted, risking catastrophic ventricular arrhythmias and myocardial laceration.');
    }
  }

  // 3. Post-LVAD RV Failure Management
  let rvFailureTreatedCorrectly = true;
  if (scenario.id === 'DECOMPENSATED_RV_FAILURE_POST_IMPLANT') {
    if (state.activeInotropes.milrinoneMcgKgMin > 0 || state.activeInotropes.inoPpm > 0) {
      facultyFeedback.push('Targeted RV Inotropic Resuscitation: Supported RV with inotropes and pulmonary vasodilators, restoring PAPi.');
    } else {
      score -= 25;
      rvFailureTreatedCorrectly = false;
      facultyFeedback.push('Omission: Failed to initiate inotropic or pulmonary vasodilator therapy for acute decompensated RV failure.');
    }
  }

  // 4. Pump Thrombosis Management
  let thrombosisManaged = true;
  if (scenario.id === 'PUMP_THROMBOSIS_POWER_SPIKE_HEMOLYSIS') {
    if (state.anticoagulationActive) {
      facultyFeedback.push('Rapid Thrombosis Intervention: Promptly initiated therapeutic anticoagulation protocol, resolving rotor drag and power spike.');
    } else {
      score -= 30;
      thrombosisManaged = false;
      facultyFeedback.push('Critical Safety Breach: Pump thrombosis with massive hemolysis left untreated with anticoagulation.');
    }
  }

  score = Math.max(0, Math.min(100, score));

  let letterGrade: 'A+' | 'A' | 'B' | 'C' | 'FAIL' = 'FAIL';
  if (score >= 95) letterGrade = 'A+';
  else if (score >= 85) letterGrade = 'A';
  else if (score >= 75) letterGrade = 'B';
  else if (score >= 60) letterGrade = 'C';

  return {
    scorePercentage: score,
    letterGrade,
    rampSpeedOptimized,
    suctionRelievedPromptly,
    rvFailureTreatedCorrectly,
    thrombosisManaged,
    facultyFeedback,
  };
}
