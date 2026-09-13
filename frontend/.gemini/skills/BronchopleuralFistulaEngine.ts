/**
 * BronchopleuralFistulaEngine.ts
 * Pulmonology, Critical Care & Thoracic Surgery Simulation Engine:
 * Bronchopleural Fistula (BPF) & Persistent Air Leak (PAL):
 * - Cerfolio Air Leak Classification (Continuous, Inspiratory, Expiratory, Forced)
 * - Ventilatory Steal Phenomenon & Pathophysiologic Mechanics
 * - Independent Lung Ventilation (ILV) via Double-Lumen Tube (DLT)
 * - Unilateral Asymmetric PEEP & Tidal Volume Titration
 * - Water Seal vs Chest Tube Suction Dilemma (-20 cmH2O vs -10 vs Water Seal)
 * - Interventional Bronchoscopy: One-Way Endobronchial Valves (EBV) & Autologous Blood Patch
 */

export type CerfolioAirLeakClass =
  | 'CLASS_C_CONTINUOUS'        // Throughout inspiration and expiration (large central BPF)
  | 'CLASS_I_INSPIRATORY'       // Inspiratory phase only (positive pressure driven)
  | 'CLASS_E_EXPIRATORY'        // Expiratory phase only (parenchymal alveolar leak)
  | 'CLASS_F_FORCED_EXPIRATORY';// Forced expiration / cough only (near closure)

export type FistulaAnatomicLocation =
  | 'CENTRAL_MAIN_BRONCHUS'     // Post-pneumonectomy / lobectomy bronchial stump dehiscence
  | 'LOBAR_SEGMENTAL_BRONCHUS'  // Intermediate airway fistula
  | 'PERIPHERAL_ALVEOLOPLEURAL';// Necrotizing pneumonia, ARDS barotrauma, bleb rupture

export type PleuralDrainageMode =
  | 'HIGH_SUCTION_20'           // -20 cmH2O (can worsen fistula flow)
  | 'LOW_SUCTION_10'            // -10 cmH2O
  | 'WATER_SEAL_NO_SUCTION'     // Promotes apposition if lung fully expanded
  | 'CLAMPED_HAZARD';           // LETHAL PITFALL: Clamping chest tube with BPF triggers tension pneumothorax!

export interface BpfPatientParams {
  fistulaLocation: FistulaAnatomicLocation;
  fistulaDiameterMm: number;                 // 1.0 to 15.0 mm (large central > 5 mm)
  cerfolioClass: CerfolioAirLeakClass;
  airLeakVolumeMlPerBreath: number;          // 50 to 600 mL lost per mechanical breath
  daysPostoperativeOrOnset: number;          // PAL defined as >= 5-7 days

  // Baseline Systemic Hemodynamics & Gas Exchange
  arterialPh: number;                        // 7.10 to 7.45 (severe respiratory acidosis from steal)
  paCo2MmHg: number;                         // 35 to 85 mmHg (hypercapnia from lost ventilation)
  paO2MmHg: number;                          // 50 to 120 mmHg
  spO2Percent: number;                       // 80 to 100%

  // Single-Ventilator Settings (Standard ETT)
  singleVentModeActive: boolean;
  setTidalVolumeMl: number;                  // 350 to 600 mL
  respiratoryRateBpm: number;                // 12 to 28 bpm
  peepCmH2O: number;                         // 0 to 15 cmH2O (high PEEP drives fistula!)
  peakInspiratoryPressureCmH2O: number;      // 20 to 50 cmH2O

  // Dual-Ventilator Independent Lung Ventilation (ILV)
  independentLungVentilationActive: boolean;
  dltPositionConfirmedBronchoscopically: boolean;
  fistulaLungTidalVolumeMl: number;          // Ultra-low target (100-200 mL)
  fistulaLungPeepCmH2O: number;              // Zero or low PEEP (0-3 cmH2O)
  healthyLungTidalVolumeMl: number;          // Standard lung protective (300-450 mL)
  healthyLungPeepCmH2O: number;              // Therapeutic PEEP (5-10 cmH2O)

  // Pleural & Interventional Modalities
  pleuralDrainageMode: PleuralDrainageMode;
  endobronchialValvesPlaced: boolean;        // Spiration / Zephyr one-way valves
  autologousBloodPatchInstilled: boolean;    // 50-100 mL blood patch
  surgicalStumpFlapCoverageDone: boolean;    // Latissimus / omental muscle flap
}

export interface BpfSimulationOutput {
  effectiveMinuteVentilationLPerMin: number;
  ventilatoryStealPercentage: number;        // Fraction of set tidal volume lost via fistula
  fistulaShearStressIndex: number;           // Driving gradient across fistula (0-100)
  tensionPneumothoraxRisk: 'NONE' | 'MODERATE' | 'CRITICAL_LETHAL';
  contralateralFloodingRisk: boolean;
  healingLikelihoodScorePercent: number;

  clinicalAlerts: string[];
  therapeuticDirectives: string[];
}

export const DEFAULT_BPF_PATIENT: BpfPatientParams = {
  fistulaLocation: 'CENTRAL_MAIN_BRONCHUS',
  fistulaDiameterMm: 6.5,                     // High-volume central BPF
  cerfolioClass: 'CLASS_C_CONTINUOUS',
  airLeakVolumeMlPerBreath: 320,              // 320 mL / 480 mL set lost through chest drain!
  daysPostoperativeOrOnset: 8,                // Persistent air leak (> 7 days)

  arterialPh: 7.22,                           // Respiratory acidosis
  paCo2MmHg: 64,                              // Severe hypercapnia from steal
  paO2MmHg: 68,
  spO2Percent: 89,

  singleVentModeActive: true,
  setTidalVolumeMl: 480,
  respiratoryRateBpm: 18,
  peepCmH2O: 10,                              // Exacerbates leak!
  peakInspiratoryPressureCmH2O: 38,

  independentLungVentilationActive: false,
  dltPositionConfirmedBronchoscopically: false,
  fistulaLungTidalVolumeMl: 150,
  fistulaLungPeepCmH2O: 0,
  healthyLungTidalVolumeMl: 380,
  healthyLungPeepCmH2O: 8,

  pleuralDrainageMode: 'HIGH_SUCTION_20',
  endobronchialValvesPlaced: false,
  autologousBloodPatchInstilled: false,
  surgicalStumpFlapCoverageDone: false
};

/**
 * Simulates airway-pleural pressure gradients, ventilatory steal, independent lung ventilation (ILV),
 * and interventional closure physics for bronchopleural fistulas.
 */
export function simulateBronchopleuralFistula(params: BpfPatientParams): BpfSimulationOutput {
  const alerts: string[] = [];
  const directives: string[] = [];

  // 1. Lethal Pitfall: Clamping Chest Tube in BPF
  let tensionRisk: 'NONE' | 'MODERATE' | 'CRITICAL_LETHAL' = 'NONE';
  if (params.pleuralDrainageMode === 'CLAMPED_HAZARD') {
    tensionRisk = 'CRITICAL_LETHAL';
    alerts.push('LETHAL DISASTER: CHEST TUBE MUST NEVER BE CLAMPED IN ACTIVE BRONCHOPLEURAL FISTULA! Clamping traps pressurized positive-pressure air within the pleural cavity, instantly precipitating catastrophic tension pneumothorax, mediastinal shift, acute vena caval compression, and PEA arrest.');
  }

  // 2. Ventilatory Steal Calculation
  let deliveredTotalVt = params.setTidalVolumeMl;
  let lostVt = params.airLeakVolumeMlPerBreath;

  if (params.independentLungVentilationActive) {
    deliveredTotalVt = params.fistulaLungTidalVolumeMl + params.healthyLungTidalVolumeMl;
    // Ultra-low pressure on fistula lung reduces leak dramatically
    lostVt = Math.min(params.fistulaLungTidalVolumeMl * 0.4, params.fistulaDiameterMm * 15);
  }

  // Effect of Interventions
  if (params.endobronchialValvesPlaced) {
    lostVt = lostVt * 0.25; // 75% reduction in leak
  }
  if (params.autologousBloodPatchInstilled && params.fistulaLocation === 'PERIPHERAL_ALVEOLOPLEURAL') {
    lostVt = lostVt * 0.40;
  }
  if (params.surgicalStumpFlapCoverageDone) {
    lostVt = 0; // Complete anatomical seal
  }

  const effectiveVt = Math.max(80, deliveredTotalVt - lostVt);
  const effectiveMinuteVentilationLPerMin = Math.round(((effectiveVt * params.respiratoryRateBpm) / 1000) * 10) / 10;
  const ventilatoryStealPercentage = Math.min(90, Math.round((lostVt / Math.max(1, deliveredTotalVt)) * 100));

  if (ventilatoryStealPercentage >= 40 && !params.surgicalStumpFlapCoverageDone) {
    alerts.push(`SEVERE VENTILATORY STEAL (${ventilatoryStealPercentage}%): Over 40% of inspired tidal volume is bypassing pulmonary capillary beds through the low-resistance fistulous tract into the pleural drain, creating refractory hypercapnic respiratory acidosis.`);
  }

  // 3. Fistula Shear Stress Index (Airway-to-Pleural Gradient)
  let pleuralPressureCmH2O = -20;
  if (params.pleuralDrainageMode === 'HIGH_SUCTION_20') pleuralPressureCmH2O = -20;
  else if (params.pleuralDrainageMode === 'LOW_SUCTION_10') pleuralPressureCmH2O = -10;
  else if (params.pleuralDrainageMode === 'WATER_SEAL_NO_SUCTION') pleuralPressureCmH2O = 0;

  const drivingAirwayPressure = params.independentLungVentilationActive
    ? params.fistulaLungPeepCmH2O + 8
    : params.peepCmH2O + (params.peakInspiratoryPressureCmH2O - params.peepCmH2O) * 0.5;

  const transpulmonaryGradient = Math.max(0, drivingAirwayPressure - pleuralPressureCmH2O);
  const fistulaShearStressIndex = Math.min(100, Math.round(transpulmonaryGradient * 1.8 + params.fistulaDiameterMm * 3));

  if (params.pleuralDrainageMode === 'HIGH_SUCTION_20' && params.fistulaDiameterMm > 4 && !params.surgicalStumpFlapCoverageDone) {
    alerts.push('HIGH PLEURAL SUCTION DILEMMA: Continuous -20 cmH2O wall suction maximizes the transpulmonary pressure gradient across the fistula, mechanically keeping the bronchial defect patent and preventing spontaneous granulation. Transition to water seal if the lung remains fully expanded against the chest wall.');
  }

  // 4. Contralateral Lung Flooding (Drowning) Hazard
  const contralateralFloodingRisk =
    params.fistulaLocation === 'CENTRAL_MAIN_BRONCHUS' &&
    !params.independentLungVentilationActive &&
    params.fistulaDiameterMm >= 5.0;

  if (contralateralFloodingRisk) {
    alerts.push('PULMONARY FLOODING HAZARD: High-volume central BPF risks aspirating infected, purulent pleural fluid from the post-pneumonectomy/lobectomy space into the remaining healthy contralateral lung, triggering catastrophic asphyxiation and drowning of the good lung.');
  }

  // 5. Healing Likelihood Assessment
  let healingScore = 20; // Base score
  if (params.cerfolioClass === 'CLASS_F_FORCED_EXPIRATORY') healingScore += 45;
  else if (params.cerfolioClass === 'CLASS_E_EXPIRATORY') healingScore += 30;
  else if (params.cerfolioClass === 'CLASS_I_INSPIRATORY') healingScore += 15;
  else healingScore += 5; // Continuous is lowest

  if (params.pleuralDrainageMode === 'WATER_SEAL_NO_SUCTION') healingScore += 15;
  if (params.independentLungVentilationActive) healingScore += 20;
  if (params.endobronchialValvesPlaced) healingScore += 25;
  if (params.autologousBloodPatchInstilled && params.fistulaLocation === 'PERIPHERAL_ALVEOLOPLEURAL') healingScore += 20;
  if (params.surgicalStumpFlapCoverageDone) healingScore = 98;

  healingScore = Math.max(5, Math.min(98, healingScore));

  // 6. Therapeutic Directives
  if (params.fistulaLocation === 'CENTRAL_MAIN_BRONCHUS' && !params.independentLungVentilationActive) {
    directives.push('CONSIDER INDEPENDENT LUNG VENTILATION (ILV): Place left double-lumen tube (DLT) under fiberoptic guidance. Isolate the healthy lung on therapeutic PEEP/Vt while placing the fistula lung on zero PEEP (ZEEP) and minimal driving pressure.');
  }

  if (params.fistulaDiameterMm < 5.0 && !params.endobronchialValvesPlaced && params.daysPostoperativeOrOnset >= 5) {
    directives.push('INTERVENTIONAL BRONCHOSCOPY (EBV): Bronchoscopic balloon occlusion can identify the feeding airway; deploy one-way endobronchial valves (Spiration/Zephyr) to eliminate inspiratory airflow while permitting expiratory clearance.');
  }

  if (params.fistulaLocation === 'PERIPHERAL_ALVEOLOPLEURAL' && !params.autologousBloodPatchInstilled && params.daysPostoperativeOrOnset >= 5) {
    directives.push('AUTOLOGOUS BLOOD PATCH: Instill 50-100 mL of patient autologous peripheral venous blood into the chest tube and clamp briefly (under strict supervision) to seal parenchymal alveolar gaps.');
  }

  if (params.fistulaLocation === 'CENTRAL_MAIN_BRONCHUS' && params.fistulaDiameterMm >= 6.0 && !params.surgicalStumpFlapCoverageDone) {
    directives.push('THORACIC SURGICAL RE-EXPLORATION: Large central stump dehiscence requires operative mobilization of an intercostal, latissimus dorsi, or omental pedicle flap to re-reinforce the bronchial stump.');
  }

  return {
    effectiveMinuteVentilationLPerMin,
    ventilatoryStealPercentage,
    fistulaShearStressIndex,
    tensionPneumothoraxRisk: tensionRisk,
    contralateralFloodingRisk,
    healingLikelihoodScorePercent: healingScore,
    clinicalAlerts: alerts,
    therapeuticDirectives: directives
  };
}
