/**
 * ECMODynamicsEngine.ts
 * Comprehensive Extracorporeal Membrane Oxygenation (ECMO) simulation engine.
 * Models Veno-Venous (VV) and Veno-Arterial (VA) cannulation mechanics,
 * oxygenator gas exchange (Sweep gas & FiO2), recirculation fraction (Rf),
 * cannula hydraulics (P_drainage suction & P_pre/P_post membrane gradient),
 * Harlequin syndrome (North-South dual circulation), and LV distention / ECPELLA venting.
 *
 * Location: frontend/.gemini/skills/ECMODynamicsEngine.ts
 */

export type ECMOConfiguration = 'VV_ECMO' | 'VA_FEMORAL' | 'VA_CENTRAL' | 'V_AV_HYBRID';

export interface ECMOPumpSettings {
  configuration: ECMOConfiguration;
  bloodFlowLpm: number; // 1.0 - 7.0 L/min
  sweepGasFlowLpm: number; // 0.5 - 15.0 L/min
  oxygenatorFiO2: number; // 0.21 - 1.0 (fraction)
  drainageCannulaFr: number; // 19 - 29 Fr
  reinfusionCannulaFr: number; // 15 - 23 Fr
  cannulaTipDistanceCm: number; // 5 - 25 cm (relevant in VV ECMO)
  membraneThrombosisPcnt: number; // 0 - 100% (fouling/clotting)
  lvVentActive: boolean; // Impella ("ECPELLA") or surgical vent
}

export interface PatientState {
  weightKg: number; // 40 - 140 kg
  nativeCardiacOutputLpm: number; // 0.5 - 8.0 L/min
  nativePulmonaryShuntPcnt: number; // 10% (normal) to 80% (severe ARDS)
  nativePaO2FiO2Ratio: number; // 50 - 400 mmHg
  metabolicVo2MlMin: number; // 150 - 400 mL/min
  metabolicVco2MlMin: number; // 120 - 320 mL/min
  hemoglobinGdl: number; // 7.0 - 15.0 g/dL
  centralVenousPressureMmHg: number; // 2 - 22 mmHg
  meanArterialPressureMmHg: number; // 35 - 120 mmHg
}

export type ECMOAlarmStatus =
  | 'OPTIMAL'
  | 'HIGH_RECIRCULATION'
  | 'CANNULA_CHATTERING_SUCTION'
  | 'MEMBRANE_LUNG_THROMBOSIS'
  | 'HARLEQUIN_SYNDROME'
  | 'LV_DISTENTION_PULMONARY_EDEMA';

export interface ECMOSimulationResult {
  configuration: ECMOConfiguration;
  alarmStatus: ECMOAlarmStatus;
  recirculationFractionPcnt: number; // 0 - 60%
  effectiveECMOFlowLpm: number; // bloodFlowLpm * (1 - Rf)

  // Circuit Pressures & Hydraulics
  drainagePressureMmHg: number; // negative suction: -20 to -280 mmHg
  preMembranePressureMmHg: number; // 80 - 380 mmHg
  postMembranePressureMmHg: number; // 60 - 320 mmHg
  transmembranePressureMmHg: number; // Delta P: 10 - 120 mmHg

  // Circuit Blood Gases
  preOxygenatorSatPcnt: number; // SvO2
  postOxygenatorSatPcnt: number; // SpostO2 (normally 99-100%)
  postOxygenatorPaO2MmHg: number; // 350 - 550 mmHg

  // Systemic Blood Gases & Tissue Perfusion
  systemicSaO2Pcnt: number;
  systemicPaO2MmHg: number;
  systemicPaCO2MmHg: number;
  systemicPh: number;
  arterialLactateMmolL: number;

  // Dual-Circulation (North-South / Harlequin Syndrome in VA ECMO)
  upperBodyPaO2MmHg: number; // Right radial line (coronary/cerebral)
  upperBodySaO2Pcnt: number;
  lowerBodyPaO2MmHg: number; // Femoral line
  lowerBodySaO2Pcnt: number;
  isHarlequinActive: boolean;

  // Hemodynamic Offloading & LV Distention
  leftVentricularEndDiastolicPressureMmHg: number; // LVEDP
  aorticValveOpeningPcnt: number; // 0 (permanently closed) to 100%
  isLVDistentionSevere: boolean;

  warnings: string[];
}

export interface ECMOPreset {
  id: string;
  title: string;
  clinicalScenario: string;
  pumpSettings: ECMOPumpSettings;
  patientState: PatientState;
  educationalTakeaway: string;
}

/**
 * Calculates complete ECMO circuit hydraulics, gas exchange kinetics,
 * recirculation, dual-circulation Harlequin syndrome, and LV loading.
 */
export function calculateECMODynamics(
  pump: ECMOPumpSettings,
  patient: PatientState
): ECMOSimulationResult {
  const warnings: string[] = [];

  // 1. Recirculation Fraction (Rf) in VV ECMO
  // Occurs when reinfused oxygenated blood is directly sucked back into the drainage cannula
  // Increases sharply if cannulae are close (<10 cm) and if ECMO flow exceeds native cardiac output
  let recirculationFractionPcnt = 0;
  if (pump.configuration === 'VV_ECMO') {
    const proximityPenalty = Math.max(0, (15 - pump.cannulaTipDistanceCm) * 4.5);
    const flowRatio = pump.bloodFlowLpm / Math.max(1.0, patient.nativeCardiacOutputLpm);
    const flowRatioPenalty = Math.max(0, (flowRatio - 0.8) * 20);
    recirculationFractionPcnt = Math.min(65, Math.round(proximityPenalty + flowRatioPenalty));

    if (recirculationFractionPcnt > 35) {
      warnings.push(`HIGH RECIRCULATION (${recirculationFractionPcnt}%): Reinfused blood is immediately aspirated back into the drainage cannula without systemic transit.`);
    }
  }

  const effectiveECMOFlowLpm = +(pump.bloodFlowLpm * (1 - recirculationFractionPcnt / 100)).toFixed(2);

  // 2. Circuit Pressures & Hydraulics
  // Drainage suction pressure (P_drainage): inversely proportional to cannula size (Fr) and flow squared
  // P_drainage = - (k * Flow^1.8 / (CannulaFr - 15))
  // At 25 Fr, 4.5 L/min: ~ -55 to -70 mmHg (normal). Under hypovolemia or >6.5 L/min: < -220 mmHg (chattering)
  const drainageResistance = 25 / Math.max(1, pump.drainageCannulaFr - 15);
  let drainagePressureMmHg = -Math.round(20 + drainageResistance * Math.pow(pump.bloodFlowLpm, 1.8));

  // Hypovolemia / low CVP causes venous chatter / collapse
  if (patient.centralVenousPressureMmHg < 6) {
    drainagePressureMmHg -= Math.round((6 - patient.centralVenousPressureMmHg) * 45);
  }

  const isChatteringActive = drainagePressureMmHg < -220;
  if (isChatteringActive) {
    warnings.push(`CRITICAL CANNULA CHATTERING (P_drainage = ${drainagePressureMmHg} mmHg): Excessive negative suction causing caval vein collapse and flow cavitation.`);
  }

  // Membrane Lung Transmembrane Pressure (Delta P = P_pre - P_post)
  // Baseline Delta P ~15-25 mmHg, rises with blood flow and clot deposition
  const baselineDeltaP = Math.round(8 + pump.bloodFlowLpm * 4);
  const clotPenalty = Math.round(pump.membraneThrombosisPcnt * 0.9);
  const transmembranePressureMmHg = baselineDeltaP + clotPenalty;

  const postMembranePressureMmHg = Math.round(40 + Math.pow(pump.bloodFlowLpm, 1.6) * 12);
  const preMembranePressureMmHg = postMembranePressureMmHg + transmembranePressureMmHg;

  const isMembraneThrombosed = transmembranePressureMmHg > 65;
  if (isMembraneThrombosed) {
    warnings.push(`OXYGENATOR THROMBOSIS (Delta P = ${transmembranePressureMmHg} mmHg): Hollow-fiber clotting restricts blood flow and degrades gas exchange capacity.`);
  }

  // 3. Gas Exchange Kinetics
  // CO2 clearance: Driven primarily by Sweep Gas Flow (L/min)
  // PaCO2 = Baseline + MetabolicVCO2 / (k * SweepGasFlow)
  const effectiveSweep = Math.max(0.2, pump.sweepGasFlowLpm * (1 - pump.membraneThrombosisPcnt * 0.006));
  let systemicPaCO2MmHg = Math.round(30 + (patient.metabolicVco2MlMin * 0.28) / effectiveSweep);
  systemicPaCO2MmHg = Math.max(20, Math.min(100, systemicPaCO2MmHg));

  // pH estimation based on Henderson-Hasselbalch (assuming HCO3- ~24 mEq/L)
  const systemicPh = +(7.40 + (40 - systemicPaCO2MmHg) * 0.008).toFixed(2);

  // Oxygenation: Driven by Circuit FiO2, ECMO Flow / Cardiac Output ratio, and Shunt
  const postOxygenatorPaO2MmHg = Math.round(
    Math.max(80, (pump.oxygenatorFiO2 * 520) * (1 - pump.membraneThrombosisPcnt * 0.005))
  );
  const postOxygenatorSatPcnt = postOxygenatorPaO2MmHg > 100 ? 100 : Math.round(postOxygenatorPaO2MmHg * 0.95);

  const preOxygenatorSatPcnt = Math.min(85, Math.max(50, Math.round(65 + (pump.bloodFlowLpm - 3.0) * 4)));

  // Systemic Oxygenation (Mixed Venous + ECMO + Native Lung Shunt)
  const totalFlow = pump.configuration === 'VV_ECMO'
    ? patient.nativeCardiacOutputLpm
    : patient.nativeCardiacOutputLpm + pump.bloodFlowLpm;

  const ecmoFraction = Math.min(1.0, effectiveECMOFlowLpm / Math.max(1.0, totalFlow));
  const nativeLungEfficiency = Math.max(0.1, (100 - patient.nativePulmonaryShuntPcnt) / 100);

  let systemicSaO2Pcnt = Math.round(
    ecmoFraction * postOxygenatorSatPcnt +
    (1 - ecmoFraction) * (preOxygenatorSatPcnt + (100 - preOxygenatorSatPcnt) * nativeLungEfficiency)
  );
  systemicSaO2Pcnt = Math.max(65, Math.min(100, systemicSaO2Pcnt));

  // Convert SaO2 to PaO2 via Hill equation approximation
  const systemicPaO2MmHg = Math.round(
    systemicSaO2Pcnt >= 99 ? 120 + (postOxygenatorPaO2MmHg - 100) * 0.2 : 27 * Math.pow(systemicSaO2Pcnt / (100 - systemicSaO2Pcnt), 0.38)
  );

  // 4. Dual Circulation & Harlequin Syndrome (North-South Syndrome) in Peripheral VA ECMO
  // When native LV ejects poorly oxygenated blood (due to severe ARDS) while femoral VA ECMO
  // delivers hyperoxygenated blood retrograde, the watershed mixing zone determines regional perfusion.
  // Upper body (Right radial / carotid) receives native LV deoxygenated blood!
  let upperBodyPaO2MmHg = systemicPaO2MmHg;
  let upperBodySaO2Pcnt = systemicSaO2Pcnt;
  let lowerBodyPaO2MmHg = systemicPaO2MmHg;
  let lowerBodySaO2Pcnt = systemicSaO2Pcnt;
  let isHarlequinActive = false;

  if (pump.configuration === 'VA_FEMORAL') {
    // If native LV has significant ejection (e.g. CO > 2.5 L/min) AND native lungs are severely failed (shunt > 50%)
    if (patient.nativeCardiacOutputLpm > 2.2 && patient.nativePulmonaryShuntPcnt > 45) {
      isHarlequinActive = true;
      // Upper body receives native hypoxic pulmonary blood
      upperBodyPaO2MmHg = Math.round(45 + patient.nativePaO2FiO2Ratio * 0.15);
      upperBodySaO2Pcnt = Math.min(88, Math.max(65, Math.round(upperBodyPaO2MmHg * 1.3)));

      // Lower body receives retrograde ECMO oxygenated blood
      lowerBodyPaO2MmHg = postOxygenatorPaO2MmHg;
      lowerBodySaO2Pcnt = 100;

      warnings.push(
        `HARLEQUIN SYNDROME (NORTH-SOUTH SYNDROME): Dual circulation active! Native LV ejects hypoxic blood (${upperBodyPaO2MmHg} mmHg) to brain/coronaries while femoral ECMO perfuses lower body (${lowerBodyPaO2MmHg} mmHg).`
      );
    }
  }

  // 5. Left Ventricular Distention & Afterload in VA ECMO
  // Retrograde femoral inflow increases aortic root afterload. If LV contractility is stunned,
  // the aortic valve remains closed and LVEDP surges to dangerous levels causing pulmonary edema.
  let leftVentricularEndDiastolicPressureMmHg = 12;
  let aorticValveOpeningPcnt = 100;
  let isLVDistentionSevere = false;

  if (pump.configuration.startsWith('VA')) {
    const afterloadBurden = Math.round(pump.bloodFlowLpm * 3.5);
    const nativeInotropy = Math.max(0.5, patient.nativeCardiacOutputLpm);
    const lvedpUnvented = Math.round(14 + afterloadBurden - nativeInotropy * 2.5);

    if (pump.lvVentActive) {
      // Impella / Vent active: relieves LV distention completely
      leftVentricularEndDiastolicPressureMmHg = Math.min(16, Math.max(8, lvedpUnvented - 16));
      aorticValveOpeningPcnt = Math.round(Math.min(100, nativeInotropy * 25));
    } else {
      leftVentricularEndDiastolicPressureMmHg = Math.min(42, Math.max(12, lvedpUnvented));
      aorticValveOpeningPcnt = Math.max(0, Math.round(100 - (leftVentricularEndDiastolicPressureMmHg - 15) * 4));

      if (leftVentricularEndDiastolicPressureMmHg > 28) {
        isLVDistentionSevere = true;
        warnings.push(
          `SEVERE LV DISTENTION (LVEDP = ${leftVentricularEndDiastolicPressureMmHg} mmHg): Stunned LV cannot overcome retrograde aortic afterload. Risk of intracavitary thrombus and massive pulmonary edema. Consider ECPELLA venting.`
        );
      }
    }
  }

  // Arterial Lactate estimation
  let arterialLactateMmolL = +(1.2 + Math.max(0, (65 - systemicSaO2Pcnt) * 0.12) + (isLVDistentionSevere ? 2.5 : 0)).toFixed(1);
  if (isHarlequinActive) arterialLactateMmolL += 1.0;

  // Final Alarm Status Classification
  let alarmStatus: ECMOAlarmStatus = 'OPTIMAL';
  if (isChatteringActive) alarmStatus = 'CANNULA_CHATTERING_SUCTION';
  else if (isMembraneThrombosed) alarmStatus = 'MEMBRANE_LUNG_THROMBOSIS';
  else if (isHarlequinActive) alarmStatus = 'HARLEQUIN_SYNDROME';
  else if (isLVDistentionSevere) alarmStatus = 'LV_DISTENTION_PULMONARY_EDEMA';
  else if (recirculationFractionPcnt > 35) alarmStatus = 'HIGH_RECIRCULATION';

  return {
    configuration: pump.configuration,
    alarmStatus,
    recirculationFractionPcnt,
    effectiveECMOFlowLpm,
    drainagePressureMmHg,
    preMembranePressureMmHg,
    postMembranePressureMmHg,
    transmembranePressureMmHg,
    preOxygenatorSatPcnt,
    postOxygenatorSatPcnt,
    postOxygenatorPaO2MmHg,
    systemicSaO2Pcnt,
    systemicPaO2MmHg,
    systemicPaCO2MmHg,
    systemicPh,
    arterialLactateMmolL,
    upperBodyPaO2MmHg,
    upperBodySaO2Pcnt,
    lowerBodyPaO2MmHg,
    lowerBodySaO2Pcnt,
    isHarlequinActive,
    leftVentricularEndDiastolicPressureMmHg,
    aorticValveOpeningPcnt,
    isLVDistentionSevere,
    warnings,
  };
}

/**
 * Generates 24-hour physiological trend data for Recharts visualization.
 */
export function generateECMOTrends(
  pump: ECMOPumpSettings,
  patient: PatientState,
  simResult: ECMOSimulationResult
): { hour: number; paO2: number; paCO2: number; lactate: number; deltaP: number; map: number }[] {
  const points = [];
  for (let hour = 0; hour <= 24; hour += 2) {
    const timeProgress = hour / 24;
    // Lactate clears over 24 hours under adequate support
    const currentLactate = +(
      simResult.arterialLactateMmolL * Math.exp(-timeProgress * 0.8) +
      (Math.random() - 0.5) * 0.2
    ).toFixed(1);

    points.push({
      hour,
      paO2: Math.round(simResult.systemicPaO2MmHg + Math.sin(hour * 0.5) * 5),
      paCO2: Math.round(simResult.systemicPaCO2MmHg + Math.cos(hour * 0.4) * 2),
      lactate: Math.max(0.8, currentLactate),
      deltaP: Math.round(simResult.transmembranePressureMmHg + hour * 0.4),
      map: Math.round(patient.meanArterialPressureMmHg + Math.min(20, hour * 0.8)),
    });
  }
  return points;
}

/**
 * 6 Evidence-based high-yield clinical ECMO presets.
 */
export const ECMO_PRESETS: ECMOPreset[] = [
  {
    id: 'vv-severe-ards-optimal',
    title: 'Severe Viral ARDS on Ultra-Protective Ventilation (Optimal VV ECMO)',
    clinicalScenario: '38yo M with severe influenza ARDS, PaO2/FiO2 62, driving pressure 24 cmH2O. Cannulated femoral-jugular VV ECMO.',
    pumpSettings: {
      configuration: 'VV_ECMO',
      bloodFlowLpm: 4.8,
      sweepGasFlowLpm: 5.5,
      oxygenatorFiO2: 1.0,
      drainageCannulaFr: 25,
      reinfusionCannulaFr: 21,
      cannulaTipDistanceCm: 18,
      membraneThrombosisPcnt: 0,
      lvVentActive: false,
    },
    patientState: {
      weightKg: 78,
      nativeCardiacOutputLpm: 6.2,
      nativePulmonaryShuntPcnt: 70,
      nativePaO2FiO2Ratio: 65,
      metabolicVo2MlMin: 260,
      metabolicVco2MlMin: 210,
      hemoglobinGdl: 10.5,
      centralVenousPressureMmHg: 12,
      meanArterialPressureMmHg: 76,
    },
    educationalTakeaway:
      'VV ECMO provides complete respiratory support, allowing "lung rest" ventilation (Vt 3 mL/kg, Pplat < 24 cmH2O). With cannula tips separated by 18 cm, recirculation is low (<15%), and systemic SaO2 stabilizes at 93%.',
  },
  {
    id: 'vv-recirculation-chattering',
    title: 'Cannula Migration with High Recirculation & Venous Chattering',
    clinicalScenario: 'Femoral drainage and jugular reinfusion cannulae shifted too close (6 cm separation); hypovolemic patient with CVP 4 mmHg.',
    pumpSettings: {
      configuration: 'VV_ECMO',
      bloodFlowLpm: 5.2,
      sweepGasFlowLpm: 6.0,
      oxygenatorFiO2: 1.0,
      drainageCannulaFr: 23,
      reinfusionCannulaFr: 19,
      cannulaTipDistanceCm: 6, // Too close!
      membraneThrombosisPcnt: 0,
      lvVentActive: false,
    },
    patientState: {
      weightKg: 72,
      nativeCardiacOutputLpm: 5.8,
      nativePulmonaryShuntPcnt: 75,
      nativePaO2FiO2Ratio: 58,
      metabolicVo2MlMin: 280,
      metabolicVco2MlMin: 230,
      hemoglobinGdl: 9.0,
      centralVenousPressureMmHg: 3, // Hypovolemia
      meanArterialPressureMmHg: 68,
    },
    educationalTakeaway:
      'When cannula tips are within 10 cm, recirculation surges to >40%, causing refractory patient hypoxemia despite 100% oxygenator post-sat. Concomitant hypovolemia creates severe negative drainage suction (-250 mmHg), causing "chattering" and tubing kick.',
  },
  {
    id: 'va-cardiogenic-shock',
    title: 'Post-Infarction Cardiogenic Shock (Peripheral Femoral VA ECMO)',
    clinicalScenario: '62yo M with acute anterior STEMI, cardiac arrest, CI 1.4 L/min/m2, refractory hypotension (MAP 50) on max pressors.',
    pumpSettings: {
      configuration: 'VA_FEMORAL',
      bloodFlowLpm: 4.2,
      sweepGasFlowLpm: 4.0,
      oxygenatorFiO2: 0.8,
      drainageCannulaFr: 25,
      reinfusionCannulaFr: 17,
      cannulaTipDistanceCm: 15,
      membraneThrombosisPcnt: 0,
      lvVentActive: false,
    },
    patientState: {
      weightKg: 82,
      nativeCardiacOutputLpm: 1.6, // Stunned LV
      nativePulmonaryShuntPcnt: 25,
      nativePaO2FiO2Ratio: 220,
      metabolicVo2MlMin: 220,
      metabolicVco2MlMin: 180,
      hemoglobinGdl: 11.0,
      centralVenousPressureMmHg: 14,
      meanArterialPressureMmHg: 75,
    },
    educationalTakeaway:
      'Peripheral VA ECMO restores end-organ systemic perfusion and oxygen delivery by pumping oxygenated blood into the femoral artery, elevating MAP to 75 mmHg and normalizing lactic acidosis.',
  },
  {
    id: 'va-harlequin-north-south',
    title: 'Harlequin Syndrome / North-South Dual Circulation in VA ECMO',
    clinicalScenario: 'Patient on femoral VA ECMO with recovering LV contractility (CO 4.5 L/min) but severe secondary ARDS/pulmonary edema.',
    pumpSettings: {
      configuration: 'VA_FEMORAL',
      bloodFlowLpm: 3.5,
      sweepGasFlowLpm: 5.0,
      oxygenatorFiO2: 1.0,
      drainageCannulaFr: 25,
      reinfusionCannulaFr: 17,
      cannulaTipDistanceCm: 15,
      membraneThrombosisPcnt: 0,
      lvVentActive: false,
    },
    patientState: {
      weightKg: 80,
      nativeCardiacOutputLpm: 4.5, // Strong recovering LV
      nativePulmonaryShuntPcnt: 75, // Completely failed native lungs
      nativePaO2FiO2Ratio: 55,
      metabolicVo2MlMin: 270,
      metabolicVco2MlMin: 220,
      hemoglobinGdl: 10.0,
      centralVenousPressureMmHg: 12,
      meanArterialPressureMmHg: 82,
    },
    educationalTakeaway:
      'Dual circulation occurs when the recovering native LV ejects hypoxic blood into the ascending aorta, perfusing the coronaries and brain (Right radial SpO2 78%), while femoral ECMO perfuses the lower extremities (Femoral SpO2 100%). Solution: Upgrade to V-AV ECMO or central cannulation.',
  },
  {
    id: 'va-lv-distention-ecpella',
    title: 'Severe LV Distention on VA ECMO (Rescued by ECPELLA Venting)',
    clinicalScenario: 'Severe LV stunning with aortic valve closed; retrograde ECMO afterload drives LVEDP to 34 mmHg with pink frothy sputum.',
    pumpSettings: {
      configuration: 'VA_FEMORAL',
      bloodFlowLpm: 4.5,
      sweepGasFlowLpm: 4.5,
      oxygenatorFiO2: 0.9,
      drainageCannulaFr: 25,
      reinfusionCannulaFr: 17,
      cannulaTipDistanceCm: 15,
      membraneThrombosisPcnt: 0,
      lvVentActive: true, // ECPELLA active!
    },
    patientState: {
      weightKg: 75,
      nativeCardiacOutputLpm: 1.0,
      nativePulmonaryShuntPcnt: 40,
      nativePaO2FiO2Ratio: 160,
      metabolicVo2MlMin: 230,
      metabolicVco2MlMin: 190,
      hemoglobinGdl: 10.2,
      centralVenousPressureMmHg: 16,
      meanArterialPressureMmHg: 78,
    },
    educationalTakeaway:
      'Retrograde VA ECMO flow increases LV afterload. Without venting, an akinetic LV distends, risking intracavitary thrombosis and hemorrhagic pulmonary edema. Impella unloading ("ECPELLA") aspirates the LV, lowering LVEDP from 34 to 12 mmHg.',
  },
  {
    id: 'membrane-lung-thrombosis',
    title: 'Oxygenator Failure (Membrane Lung Fiber Thrombosis & High Delta P)',
    clinicalScenario: 'Day 12 of ECMO; progressive fibrin/clot deposition inside oxygenator hollow fibers; Delta P elevated to 82 mmHg.',
    pumpSettings: {
      configuration: 'VV_ECMO',
      bloodFlowLpm: 4.2,
      sweepGasFlowLpm: 8.0,
      oxygenatorFiO2: 1.0,
      drainageCannulaFr: 25,
      reinfusionCannulaFr: 21,
      cannulaTipDistanceCm: 16,
      membraneThrombosisPcnt: 75, // Severe fouling
      lvVentActive: false,
    },
    patientState: {
      weightKg: 76,
      nativeCardiacOutputLpm: 5.5,
      nativePulmonaryShuntPcnt: 65,
      nativePaO2FiO2Ratio: 80,
      metabolicVo2MlMin: 250,
      metabolicVco2MlMin: 200,
      hemoglobinGdl: 9.8,
      centralVenousPressureMmHg: 10,
      meanArterialPressureMmHg: 72,
    },
    educationalTakeaway:
      'An isolated surge in transmembrane pressure (Delta P > 50-60 mmHg) with worsening CO2 clearance (respiratory acidosis despite 8 L sweep) confirms oxygenator thrombosis, necessitating urgent circuit exchange.',
  },
];
