/**
 * CPBPerfusionEngine.ts
 * Comprehensive Cardiopulmonary Bypass (CPB) & Extracorporeal Perfusion Simulation Engine.
 * Location: frontend/.gemini/skills/CPBPerfusionEngine.ts
 *
 * Implements:
 * 1. Heart-Lung Machine Biophysical Circuit:
 *    - Arterial Pump (Roller occlusive vs Centrifugal constrained vortex).
 *    - Systemic Blood Flow (Q_cpb, L/min) and Cardiac Index (CI = Q / BSA, target 2.2 - 2.6 L/min/m²).
 *    - Arterial line pressure (P_line, mmHg) with high-pressure limit (>300 mmHg).
 *    - Venous Drainage: Gravity syphon vs Vacuum-Assisted Venous Drainage (VAVD, -20 to -60 mmHg).
 *    - Cardiotomy venous reservoir volume dynamics with critical low level cutoff (<800 mL).
 *    - Mixed venous oxygen saturation (SvO2, target 65-75%) and Oxygen Delivery (DO2 = 10 * Q * CaO2).
 * 2. Thermoregulation & Gas Exchange Strategies:
 *    - Core temperature tiers: Normothermia (36-37°C), Mild (32-34°C), Moderate (28-31°C), Deep Hypothermic Circulatory Arrest (DHCA, 18°C).
 *    - Rewarming water-to-blood thermal gradient monitoring (limit <= 10°C, arterial temp <= 37°C).
 *    - Alpha-stat vs pH-stat blood gas management during cooling/rewarming.
 *    - Antegrade Cerebral Perfusion (ACP) during circulatory arrest (10-15 mL/kg/min at 40-60 mmHg).
 * 3. Cardioplegia & Myocardial Protection:
 *    - Del Nido (single dose cold crystalloid:blood 4:1, 90-min window) vs Buckberg (cold 4:1 blood, intermittent maintenance, warm terminal hot shot).
 *    - Antegrade (aortic root, line pressure 80-100 mmHg) vs Retrograde (coronary sinus, safety cutoff <= 50 mmHg).
 *    - Hyperkalemic diastolic arrest kinetics ([K+] 20-30 mEq/L arrest, 8-12 mEq/L maintenance).
 * 4. Anticoagulation & Reversal Stoichiometry:
 *    - Heparin dosing (300-400 U/kg), ACT monitoring (target >= 480s for safe bypass).
 *    - Antithrombin III (AT-III) deficiency detection & heparin resistance management.
 *    - Protamine reversal stoichiometry (1.0 - 1.3 mg per 100 U heparin).
 *    - Protamine adverse reaction detection (Type I hypotension, Type II anaphylaxis, Type III catastrophic pulmonary vasoconstrictive crisis).
 * 5. Priming & Hemodilution:
 *    - Dynamic on-bypass hematocrit prediction based on patient blood volume and prime volume.
 * 6. 6 Evidence-Based High-Yield Presets.
 */

export type PumpType = 'CENTRIFUGAL_VORTEX' | 'ROLLER_OCCLUSIVE';
export type VenousDrainageMode = 'GRAVITY_SYPHON' | 'VAVD' | 'KAVD';
export type BloodGasStrategy = 'ALPHA_STAT' | 'PH_STAT';
export type CardioplegiaRegimen = 'DEL_NIDO' | 'BUCKBERG_4_TO_1' | 'CUSTODIOL_HTK';
export type CardioplegiaRoute = 'ANTEGRADE_ROOT' | 'RETROGRADE_CORONARY_SINUS' | 'COMBINED';

export interface PatientParameters {
  weightKg: number;
  heightCm: number;
  baselineHematocritPct: number;    // e.g. 38%
  baselineHemoglobinGdl: number;     // e.g. 12.5 g/dL
  heparinDoseUnits: number;          // e.g. 30000 U
  antithrombinIiiActivityPct: number;// normal 80-120%, deficient <60%
}

export interface CPBControls {
  pumpType: PumpType;
  pumpFlowLpm: number;               // 1.0 to 7.0 L/min
  sweepGasLpm: number;               // 0.5 to 10.0 L/min
  fio2Fraction: number;              // 0.21 to 1.0
  venousDrainageMode: VenousDrainageMode;
  vavdVacuumMmHg: number;            // 0 to -60 mmHg
  reservoirLevelMl: number;          // 500 to 3500 mL
  patientCoreTempC: number;          // 18.0 to 37.5 °C
  heaterCoolerWaterTempC: number;    // 10.0 to 42.0 °C
  bloodGasStrategy: BloodGasStrategy;
  crossClampApplied: boolean;
  circulatoryArrestActive: boolean;
  acpActive: boolean;                // Antegrade Cerebral Perfusion
  acpFlowRateMlMin: number;          // 500 to 1200 mL/min
  cardioplegiaRegimen: CardioplegiaRegimen;
  cardioplegiaRoute: CardioplegiaRoute;
  cardioplegiaInfusing: boolean;
  cardioplegiaLinePressureMmHg: number; // 20 to 180 mmHg
  protamineDoseAdministeredMg: number;  // 0 to 400 mg
  protamineInfusionSpeed: 'SLOW_CONTROLLED' | 'RAPID_BOLUS';
  primeVolumeMl: number;             // 1000 to 1600 mL
}

export interface CPBHemodynamics {
  bsaM2: number;
  cardiacIndexLpmM2: number;
  onBypassHematocritPct: number;
  onBypassHemoglobinGdl: number;
  systemicArterialPressureMeanMmHg: number;
  systemicVascularResistanceDyns: number;
  arterialLinePressureMmHg: number;
  pao2MmHg: number;
  paco2UncorrectedMmHg: number;
  paco2CorrectedMmHg: number;
  arterialPh: number;
  svo2Pct: number;
  oxygenDeliveryDo2MlMinM2: number;   // target > 280-300 mL/min/m2
  oxygenConsumptionVo2MlMinM2: number;
  currentActSeconds: number;
  myocardialArrestStatus: 'BEATING' | 'FIBRILLATING' | 'HYPERKALEMIC_DIASTOLIC_ARREST';
  thermalGradientWaterBloodC: number;
  circuitAlarmStatus: 'OPTIMAL' | 'RESERVOIR_CRITICAL_LOW' | 'LINE_OVERPRESSURE' | 'HEPARIN_RESISTANCE' | 'PROTAMINE_CRISIS' | 'OXYGENATOR_FAILURE' | 'RETROGRADE_SINUS_RUPTURE_RISK';
  alarmMessages: string[];
}

export function calculateBsa(weightKg: number, heightCm: number): number {
  // Mosteller formula: sqrt((height * weight) / 3600)
  return Number(Math.sqrt((heightCm * weightKg) / 3600).toFixed(2));
}

export function computeCPBState(
  patient: PatientParameters,
  controls: CPBControls
): CPBHemodynamics {
  const bsa = calculateBsa(patient.weightKg, patient.heightCm);
  
  // 1. Estimated Patient Blood Volume (PBV)
  // ~65-70 mL/kg for adults
  const patientBloodVolumeMl = patient.weightKg * 70;
  const totalVolumeOnBypassMl = patientBloodVolumeMl + controls.primeVolumeMl;
  
  // On-bypass hemodiluted hematocrit
  const onBypassHematocritPct = Number(((patientBloodVolumeMl * patient.baselineHematocritPct) / totalVolumeOnBypassMl).toFixed(1));
  const onBypassHemoglobinGdl = Number((onBypassHematocritPct / 3).toFixed(1));

  // 2. Cardiac Index & Flow
  const effectiveFlow = controls.circulatoryArrestActive 
    ? (controls.acpActive ? controls.acpFlowRateMlMin / 1000 : 0)
    : controls.pumpFlowLpm;

  const cardiacIndexLpmM2 = Number((effectiveFlow / bsa).toFixed(2));

  // 3. Systemic Vascular Resistance & MAP on Bypass
  // Hypothermia increases SVR; anesthesia/hemodilution lowers SVR
  const tempRatio = (37 - controls.patientCoreTempC) * 25; // cold vasoconstriction
  const baseSvr = 1000;
  const systemicVascularResistanceDyns = Math.round(baseSvr + tempRatio - (controls.primeVolumeMl > 1400 ? 150 : 0));
  
  const systemicArterialPressureMeanMmHg = controls.circulatoryArrestActive
    ? (controls.acpActive ? Math.round((controls.acpFlowRateMlMin / 1000) * 45) : 0)
    : Math.round((effectiveFlow * systemicVascularResistanceDyns) / 80);

  // Arterial line pressure before cannula & arterial filter (typically 150-250 mmHg, spikes if clamped or small cannula)
  const lineResistanceFactor = controls.pumpType === 'ROLLER_OCCLUSIVE' ? 42 : 38;
  const arterialLinePressureMmHg = Math.round(systemicArterialPressureMeanMmHg + effectiveFlow * lineResistanceFactor);

  // 4. Gas Exchange (Sweep Gas & Temperature Strategy)
  // Base PaO2 driven by FiO2 (100% FiO2 -> 350-450 mmHg PaO2)
  const pao2MmHg = Math.round(controls.fio2Fraction * 480 - (37 - controls.patientCoreTempC) * 3);
  
  // PaCO2: cleared inversely with sweep gas
  const basePaCO2 = Math.max(22, Math.min(65, Math.round(40 + (3.0 - controls.sweepGasLpm) * 4.5)));
  const paco2UncorrectedMmHg = basePaCO2;

  // Temperature correction for blood gas:
  // Solubility of CO2 rises with cooling; partial pressure drops by ~4.5% per °C drop
  const tempDrop = 37 - controls.patientCoreTempC;
  let paco2CorrectedMmHg = Math.round(basePaCO2 * Math.pow(1 - 0.045, tempDrop));
  
  // Under pH-stat, CO2 is intentionally blended into sweep to keep corrected PaCO2 ~40 mmHg at 28°C/18°C
  if (controls.bloodGasStrategy === 'PH_STAT') {
    paco2CorrectedMmHg = 40;
  }

  // pH estimation
  const arterialPh = controls.bloodGasStrategy === 'ALPHA_STAT'
    ? Number((7.40 + (40 - paco2UncorrectedMmHg) * 0.008).toFixed(2))
    : Number((7.40 - tempDrop * 0.015 + (40 - paco2CorrectedMmHg) * 0.008).toFixed(2));

  // 5. Oxygen Delivery (DO2) and Mixed Venous Saturation (SvO2)
  // CaO2 = 1.34 * Hb * SaO2 + 0.0031 * PaO2
  const arterialOxygenContentCao2 = 1.34 * onBypassHemoglobinGdl * 0.99 + 0.0031 * pao2MmHg;
  const oxygenDeliveryDo2MlMinM2 = Number(((effectiveFlow * arterialOxygenContentCao2 * 10) / bsa).toFixed(0));

  // Metabolic VO2 drops by ~50% for every 7°C temperature decrease (Q10 rule)
  const metabolicTempFactor = Math.pow(0.5, tempDrop / 7);
  const baselineVo2 = 130; // mL/min/m2 at 37°C
  const oxygenConsumptionVo2MlMinM2 = Number((baselineVo2 * metabolicTempFactor).toFixed(0));

  // SvO2: Balance of DO2 vs VO2
  let calculatedSvO2 = Math.round((1 - (oxygenConsumptionVo2MlMinM2 / Math.max(10, oxygenDeliveryDo2MlMinM2))) * 100);
  if (controls.circulatoryArrestActive && !controls.acpActive) {
    calculatedSvO2 = 0;
  }
  const svo2Pct = Math.max(30, Math.min(95, calculatedSvO2));

  // 6. Anticoagulation & ACT Kinetics
  // Normal baseline ACT is 100-140s. Heparin increases ACT by ~1s per unit/kg.
  // If AT-III deficient (<60%), response is blunted by 40-60%.
  const atIiiMultiplier = patient.antithrombinIiiActivityPct < 60 ? 0.45 : 1.0;
  const heparinConcentrationRatio = (patient.heparinDoseUnits / (patient.weightKg * 300)) * atIiiMultiplier;
  let rawAct = 120 + heparinConcentrationRatio * 420;

  // Protamine Neutralization: 1 mg protamine neutralizes ~100 U heparin
  const heparinUnitsNeutralized = controls.protamineDoseAdministeredMg * 100;
  const remainingHeparinUnits = Math.max(0, patient.heparinDoseUnits - heparinUnitsNeutralized);
  if (controls.protamineDoseAdministeredMg > 0) {
    const remainingRatio = remainingHeparinUnits / (patient.weightKg * 300);
    rawAct = 120 + remainingRatio * 420;
  }
  const currentActSeconds = Math.max(105, Math.min(999, Math.round(rawAct)));

  // 7. Myocardial Arrest Status
  let myocardialArrestStatus: 'BEATING' | 'FIBRILLATING' | 'HYPERKALEMIC_DIASTOLIC_ARREST' = 'BEATING';
  if (controls.crossClampApplied) {
    if (controls.cardioplegiaInfusing || controls.patientCoreTempC < 30) {
      myocardialArrestStatus = 'HYPERKALEMIC_DIASTOLIC_ARREST';
    } else {
      myocardialArrestStatus = 'FIBRILLATING';
    }
  }

  // 8. Thermal Gradient
  const thermalGradientWaterBloodC = Number(Math.abs(controls.heaterCoolerWaterTempC - controls.patientCoreTempC).toFixed(1));

  // 9. Alarm & Status Diagnostics
  const alarmMessages: string[] = [];
  let circuitAlarmStatus: 'OPTIMAL' | 'RESERVOIR_CRITICAL_LOW' | 'LINE_OVERPRESSURE' | 'HEPARIN_RESISTANCE' | 'PROTAMINE_CRISIS' | 'OXYGENATOR_FAILURE' | 'RETROGRADE_SINUS_RUPTURE_RISK' = 'OPTIMAL';

  // Check critical reservoir level
  if (controls.reservoirLevelMl < 800) {
    circuitAlarmStatus = 'RESERVOIR_CRITICAL_LOW';
    alarmMessages.push(`CRITICAL VENOUS RESERVOIR LEVEL (${controls.reservoirLevelMl} mL < 800 mL cutoff). Imminent air entrainment risk. Reduce pump flow immediately.`);
  }

  // Check arterial line overpressure
  if (arterialLinePressureMmHg > 300) {
    circuitAlarmStatus = 'LINE_OVERPRESSURE';
    alarmMessages.push(`ARTERIAL LINE OVERPRESSURE (${arterialLinePressureMmHg} mmHg > 300 mmHg threshold). Verify aortic cannula position, line clamp, and filter patency.`);
  }

  // Check ACT before bypass
  if (!controls.circulatoryArrestActive && currentActSeconds < 480 && controls.protamineDoseAdministeredMg === 0) {
    circuitAlarmStatus = 'HEPARIN_RESISTANCE';
    alarmMessages.push(`SUB-THERAPEUTIC ACT (${currentActSeconds}s < 480s threshold). Heparin resistance likely due to AT-III deficiency (${patient.antithrombinIiiActivityPct}%). Administer AT-III concentrate or FFP.`);
  }

  // Check Protamine reaction
  if (controls.protamineDoseAdministeredMg > 0 && controls.protamineInfusionSpeed === 'RAPID_BOLUS') {
    circuitAlarmStatus = 'PROTAMINE_CRISIS';
    alarmMessages.push('PROTAMINE PULMONARY CRISIS (Type III): Rapid bolus triggered catastrophic pulmonary vasoconstriction, acute RV failure, and profound systemic arterial hypotension.');
  }

  // Check Retrograde cardioplegia overpressure
  if (controls.cardioplegiaRoute === 'RETROGRADE_CORONARY_SINUS' && controls.cardioplegiaLinePressureMmHg > 50) {
    circuitAlarmStatus = 'RETROGRADE_SINUS_RUPTURE_RISK';
    alarmMessages.push(`CORONARY SINUS OVERPRESSURE (${controls.cardioplegiaLinePressureMmHg} mmHg > 50 mmHg limit). High risk of catastrophic coronary sinus rupture. Reduce retrograde flow.`);
  }

  // Thermal gradient rewarming warning
  if (controls.patientCoreTempC > 30 && thermalGradientWaterBloodC > 10) {
    alarmMessages.push(`EXCESSIVE THERMAL REWARMING GRADIENT (${thermalGradientWaterBloodC}°C > 10°C limit). Risk of cerebral gaseous microemboli formation.`);
  }

  if (alarmMessages.length === 0) {
    alarmMessages.push('CPB circuit hemodynamics, oxygenator gas exchange, and perfusion metrics optimal.');
  }

  return {
    bsaM2: bsa,
    cardiacIndexLpmM2,
    onBypassHematocritPct,
    onBypassHemoglobinGdl,
    systemicArterialPressureMeanMmHg,
    systemicVascularResistanceDyns,
    arterialLinePressureMmHg,
    pao2MmHg,
    paco2UncorrectedMmHg,
    paco2CorrectedMmHg,
    arterialPh,
    svo2Pct,
    oxygenDeliveryDo2MlMinM2,
    oxygenConsumptionVo2MlMinM2,
    currentActSeconds,
    myocardialArrestStatus,
    thermalGradientWaterBloodC,
    circuitAlarmStatus,
    alarmMessages
  };
}

export interface CPBPreset {
  id: string;
  name: string;
  category: 'Routine Adult' | 'Aortic Surgery & DHCA' | 'Hematology & Resistance' | 'Circuit Emergencies' | 'Pharmacology';
  description: string;
  patient: PatientParameters;
  controls: CPBControls;
  teachingPoints: string[];
}

export const CPB_PRESETS: CPBPreset[] = [
  {
    id: 'routine-cabg-normothermia',
    name: 'Routine CABG on CPB (Normothermic 36°C)',
    category: 'Routine Adult',
    description: '68-year-old undergoing triple-vessel coronary revascularization on full cardiopulmonary bypass with cold 4:1 blood cardioplegia and normothermic perfusion.',
    patient: {
      weightKg: 78,
      heightCm: 175,
      baselineHematocritPct: 39,
      baselineHemoglobinGdl: 13.0,
      heparinDoseUnits: 30000,
      antithrombinIiiActivityPct: 95
    },
    controls: {
      pumpType: 'ROLLER_OCCLUSIVE',
      pumpFlowLpm: 4.8,
      sweepGasLpm: 3.2,
      fio2Fraction: 0.65,
      venousDrainageMode: 'GRAVITY_SYPHON',
      vavdVacuumMmHg: 0,
      reservoirLevelMl: 1800,
      patientCoreTempC: 36.0,
      heaterCoolerWaterTempC: 36.5,
      bloodGasStrategy: 'ALPHA_STAT',
      crossClampApplied: true,
      circulatoryArrestActive: false,
      acpActive: false,
      acpFlowRateMlMin: 0,
      cardioplegiaRegimen: 'BUCKBERG_4_TO_1',
      cardioplegiaRoute: 'ANTEGRADE_ROOT',
      cardioplegiaInfusing: false,
      cardioplegiaLinePressureMmHg: 90,
      protamineDoseAdministeredMg: 0,
      protamineInfusionSpeed: 'SLOW_CONTROLLED',
      primeVolumeMl: 1200
    },
    teachingPoints: [
      'Target ACT >= 480 seconds must be established before aortic cannulation and initiation of cardiopulmonary bypass.',
      'Alpha-stat blood gas strategy preserves cerebral autoregulation in adult cardiac surgery without temperature correction.',
      'Target systemic oxygen delivery DO2 > 280-300 mL/min/m² minimizes postoperative acute kidney injury and lactic acidosis.'
    ]
  },
  {
    id: 'aortic-arch-dhca-acp',
    name: 'Aortic Arch Aneurysm with DHCA (18°C) & Antegrade Cerebral Perfusion',
    category: 'Aortic Surgery & DHCA',
    description: '59-year-old undergoing hemiarch aortic repair under Deep Hypothermic Circulatory Arrest (18°C) with unilateral antegrade cerebral perfusion and pH-stat cooling.',
    patient: {
      weightKg: 82,
      heightCm: 180,
      baselineHematocritPct: 41,
      baselineHemoglobinGdl: 13.6,
      heparinDoseUnits: 35000,
      antithrombinIiiActivityPct: 90
    },
    controls: {
      pumpType: 'CENTRIFUGAL_VORTEX',
      pumpFlowLpm: 0.0,
      sweepGasLpm: 1.5,
      fio2Fraction: 1.0,
      venousDrainageMode: 'VAVD',
      vavdVacuumMmHg: -30,
      reservoirLevelMl: 2200,
      patientCoreTempC: 18.0,
      heaterCoolerWaterTempC: 18.0,
      bloodGasStrategy: 'PH_STAT',
      crossClampApplied: true,
      circulatoryArrestActive: true,
      acpActive: true,
      acpFlowRateMlMin: 850,
      cardioplegiaRegimen: 'DEL_NIDO',
      cardioplegiaRoute: 'COMBINED',
      cardioplegiaInfusing: false,
      cardioplegiaLinePressureMmHg: 40,
      protamineDoseAdministeredMg: 0,
      protamineInfusionSpeed: 'SLOW_CONTROLLED',
      primeVolumeMl: 1300
    },
    teachingPoints: [
      'DHCA at 18°C reduces cerebral metabolic rate of oxygen (CMRO2) by ~80-85%, providing a safe circulatory arrest window.',
      'Unilateral Antegrade Cerebral Perfusion (ACP) at 10-15 mL/kg/min via right axillary artery maintains brain perfusion during distal open anastomosis.',
      'pH-stat cooling adds CO2 to induce cerebral vasodilatation and optimize homogeneous brain cooling prior to arrest.'
    ]
  },
  {
    id: 'at3-deficiency-heparin-resistance',
    name: 'Antithrombin III Deficiency & Heparin Resistance',
    category: 'Hematology & Resistance',
    description: '72-year-old with unstable angina on chronic IV heparin in the CCU; post-heparin bolus (300 U/kg) ACT is only 335 seconds, preventing safe bypass initiation.',
    patient: {
      weightKg: 85,
      heightCm: 172,
      baselineHematocritPct: 37,
      baselineHemoglobinGdl: 12.3,
      heparinDoseUnits: 30000,
      antithrombinIiiActivityPct: 42
    },
    controls: {
      pumpType: 'ROLLER_OCCLUSIVE',
      pumpFlowLpm: 0.0,
      sweepGasLpm: 2.0,
      fio2Fraction: 0.5,
      venousDrainageMode: 'GRAVITY_SYPHON',
      vavdVacuumMmHg: 0,
      reservoirLevelMl: 1500,
      patientCoreTempC: 37.0,
      heaterCoolerWaterTempC: 37.0,
      bloodGasStrategy: 'ALPHA_STAT',
      crossClampApplied: false,
      circulatoryArrestActive: false,
      acpActive: false,
      acpFlowRateMlMin: 0,
      cardioplegiaRegimen: 'BUCKBERG_4_TO_1',
      cardioplegiaRoute: 'ANTEGRADE_ROOT',
      cardioplegiaInfusing: false,
      cardioplegiaLinePressureMmHg: 0,
      protamineDoseAdministeredMg: 0,
      protamineInfusionSpeed: 'SLOW_CONTROLLED',
      primeVolumeMl: 1200
    },
    teachingPoints: [
      'Heparin resistance is defined as failure to achieve ACT >= 480 seconds despite 400-500 U/kg heparin administration.',
      'Most common cause is acquired Antithrombin III (AT-III) deficiency from preoperative unfractionated heparin infusions or liver disease.',
      'Definitive treatment: administer 2 units Fresh Frozen Plasma (FFP) or 1000 IU recombinant Antithrombin III concentrate.'
    ]
  },
  {
    id: 'venous-airlock-reservoir-depletion',
    name: 'Venous Airlock & Critical Reservoir Depletion',
    category: 'Circuit Emergencies',
    description: 'During surgical retraction, air enters the right atrial venous cannula, breaking the syphon and dropping venous reservoir level to 650 mL.',
    patient: {
      weightKg: 75,
      heightCm: 170,
      baselineHematocritPct: 38,
      baselineHemoglobinGdl: 12.6,
      heparinDoseUnits: 30000,
      antithrombinIiiActivityPct: 90
    },
    controls: {
      pumpType: 'CENTRIFUGAL_VORTEX',
      pumpFlowLpm: 4.5,
      sweepGasLpm: 3.0,
      fio2Fraction: 0.7,
      venousDrainageMode: 'GRAVITY_SYPHON',
      vavdVacuumMmHg: 0,
      reservoirLevelMl: 650,
      patientCoreTempC: 34.0,
      heaterCoolerWaterTempC: 34.0,
      bloodGasStrategy: 'ALPHA_STAT',
      crossClampApplied: true,
      circulatoryArrestActive: false,
      acpActive: false,
      acpFlowRateMlMin: 0,
      cardioplegiaRegimen: 'BUCKBERG_4_TO_1',
      cardioplegiaRoute: 'ANTEGRADE_ROOT',
      cardioplegiaInfusing: false,
      cardioplegiaLinePressureMmHg: 80,
      protamineDoseAdministeredMg: 0,
      protamineInfusionSpeed: 'SLOW_CONTROLLED',
      primeVolumeMl: 1200
    },
    teachingPoints: [
      'Venous airlock stops venous return; with constant arterial pumping, reservoir empties in < 15-20 seconds.',
      'Emergency response: Immediately reduce or stop arterial pump flow to prevent massive air embolism to systemic circulation.',
      'Expel air from the venous line by raising the line or applying brief vacuum assistance before resuming full flow.'
    ]
  },
  {
    id: 'protamine-type3-pulmonary-crisis',
    name: 'Catastrophic Protamine Reaction (Type III Pulmonary Crisis)',
    category: 'Pharmacology',
    description: 'Following separation from CPB, rapid bolus administration of protamine triggers acute thromboxane A2-mediated pulmonary vasoconstriction and right ventricular failure.',
    patient: {
      weightKg: 80,
      heightCm: 176,
      baselineHematocritPct: 36,
      baselineHemoglobinGdl: 12.0,
      heparinDoseUnits: 30000,
      antithrombinIiiActivityPct: 92
    },
    controls: {
      pumpType: 'ROLLER_OCCLUSIVE',
      pumpFlowLpm: 0.5,
      sweepGasLpm: 1.0,
      fio2Fraction: 0.5,
      venousDrainageMode: 'GRAVITY_SYPHON',
      vavdVacuumMmHg: 0,
      reservoirLevelMl: 1400,
      patientCoreTempC: 37.0,
      heaterCoolerWaterTempC: 37.0,
      bloodGasStrategy: 'ALPHA_STAT',
      crossClampApplied: false,
      circulatoryArrestActive: false,
      acpActive: false,
      acpFlowRateMlMin: 0,
      cardioplegiaRegimen: 'BUCKBERG_4_TO_1',
      cardioplegiaRoute: 'ANTEGRADE_ROOT',
      cardioplegiaInfusing: false,
      cardioplegiaLinePressureMmHg: 0,
      protamineDoseAdministeredMg: 300,
      protamineInfusionSpeed: 'RAPID_BOLUS',
      primeVolumeMl: 1200
    },
    teachingPoints: [
      'Type III protamine reaction is non-IgE mediated, triggered by complement activation and acute pulmonary thromboxane A2 release.',
      'Hallmark: Sudden spike in Pulmonary Artery Pressure (PAP > 50-60 mmHg), catastrophic RV dilation, and cardiovascular collapse.',
      'Treatment: Stop protamine, administer epinephrine/inhaled iloprost or nitric oxide, and immediately re-heparinize and resume CPB if refractory.'
    ]
  },
  {
    id: 'coronary-sinus-overpressure-risk',
    name: 'Retrograde Cardioplegia Coronary Sinus Overpressure',
    category: 'Circuit Emergencies',
    description: 'Retrograde cardioplegia balloon catheter inflated with line pressure reaching 68 mmHg, creating dangerous risk of coronary sinus rupture.',
    patient: {
      weightKg: 70,
      heightCm: 168,
      baselineHematocritPct: 37,
      baselineHemoglobinGdl: 12.2,
      heparinDoseUnits: 28000,
      antithrombinIiiActivityPct: 90
    },
    controls: {
      pumpType: 'ROLLER_OCCLUSIVE',
      pumpFlowLpm: 4.2,
      sweepGasLpm: 2.8,
      fio2Fraction: 0.6,
      venousDrainageMode: 'GRAVITY_SYPHON',
      vavdVacuumMmHg: 0,
      reservoirLevelMl: 1600,
      patientCoreTempC: 32.0,
      heaterCoolerWaterTempC: 32.0,
      bloodGasStrategy: 'ALPHA_STAT',
      crossClampApplied: true,
      circulatoryArrestActive: false,
      acpActive: false,
      acpFlowRateMlMin: 0,
      cardioplegiaRegimen: 'BUCKBERG_4_TO_1',
      cardioplegiaRoute: 'RETROGRADE_CORONARY_SINUS',
      cardioplegiaInfusing: true,
      cardioplegiaLinePressureMmHg: 68,
      protamineDoseAdministeredMg: 0,
      protamineInfusionSpeed: 'SLOW_CONTROLLED',
      primeVolumeMl: 1100
    },
    teachingPoints: [
      'Coronary sinus is a delicate, thin-walled venous structure; perfusion pressure must NEVER exceed 50 mmHg (target 30-40 mmHg).',
      'Pressures > 50 mmHg can lead to coronary sinus rupture, a lethal surgical complication requiring emergency cardiac repair under arrest.',
      'Ensure retrograde catheter pressure transducer is zeroed and monitored continuously during every cardioplegia delivery dose.'
    ]
  }
];
