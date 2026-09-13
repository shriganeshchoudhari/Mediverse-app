/**
 * MassivePulmonaryEmbolismEngine.ts
 * Emergency Medicine, Intensive Care & Cardiology Simulation Engine:
 * Massive Pulmonary Embolism (PE) & Right Ventricular (RV) Resuscitation Workstation:
 * - ESC / AHA / CHEST Risk Stratification (High-Risk/Massive vs Intermediate-High/Submassive vs Low)
 * - RV Biomechanical Failure Cascade (The RV Death Spiral)
 * - Bedside Echocardiographic Strain Markers (RV/LV ratio >= 1.0, TAPSE < 16 mm, McConnell's Sign, 60/60 Sign, D-shaped LV)
 * - Right Coronary Artery (RCA) Perfusion Pressure Gradient (MAP - RVEDP/CVP)
 * - Hemodynamic Resuscitation Guardrail: Judicious Fluid Restriction (< 500 mL) to avoid RV overdistension
 * - Vasopressor Selection: Norepinephrine (1st-line) vs Phenylephrine Hazard
 * - Reperfusion Strategies: Systemic Fibrinolysis (Alteplase 100 mg vs 50 mg cardiac arrest push),
 *   Catheter-Directed Thrombolysis (CDT / EKOS), Mechanical Aspiration Thrombectomy (Inari / Penumbra),
 *   Surgical Pulmonary Embolectomy, and Extracorporeal VA-ECMO Bridge
 */

export type PeRiskStratification =
  | 'HIGH_RISK_MASSIVE'              // Sustained SBP < 90 mmHg, shock index > 1.0, vasopressor needed, or PEA arrest
  | 'INTERMEDIATE_HIGH_SUBMASSIVE'   // Normotensive SBP >= 90 with BOTH RV strain AND elevated troponin/BNP
  | 'INTERMEDIATE_LOW'               // Normotensive with EITHER RV strain OR elevated biomarker (not both)
  | 'LOW_RISK';                      // Normotensive, sPESI = 0, no RV strain, normal biomarkers

export type RvDeathSpiralStage =
  | 'COMPENSATED_RV_STRAIN'          // Mild afterload rise, preserved stroke volume
  | 'ACUTE_COR_PULMONALE'            // Severe RV dilation, elevated CVP, TR murmur
  | 'RV_ISCHEMIA_SEPTAL_SHIFT'       // D-shaped LV, loss of RCA systolic perfusion gradient, rising troponin
  | 'FULMINANT_CARDIOGENIC_SHOCK'    // Systemic hypotension, LV preload starvation, organ hypoperfusion
  | 'PEA_CARDIAC_ARREST';            // Complete circulatory collapse from acute RV afterload mismatch

export type VasopressorChoice =
  | 'NONE'
  | 'NOREPINEPHRINE'                 // Preferred 1st-line: restores aortic root pressure & RCA perfusion
  | 'PHENYLEPHRINE_HAZARD'           // DANGEROUS: pure alpha-1 spikes PVR, increases RV afterload, reflex bradycardia
  | 'EPINEPHRINE'                    // Potent inotrope/vasopressor for refractory shock or cardiac arrest
  | 'VASOPRESSIN_ADJUNCT';           // Adjunct 0.01-0.03 U/min: systemic vasoconstrictor + pulmonary vasodilator

export type InotropeChoice =
  | 'NONE'
  | 'DOBUTAMINE'                     // Inotrope 2.5-5 mcg/kg/min (augments RV contractility, watch BP)
  | 'MILRINONE_CAUTION';             // PDE-3 inhibitor (inotrope + pulmonary vasodilator, severe vasodilation hazard)

export type InhaledVasodilatorChoice =
  | 'NONE'
  | 'INHALED_NITRIC_OXIDE_20PPM'     // Selective pulmonary vasodilation without systemic hypotension
  | 'INHALED_EPOPROSTENOL';          // Inhaled prostacyclin (aerosolized PGI2)

export type ReperfusionStrategy =
  | 'ANTICOAGULATION_ONLY'           // IV UFH bolus 80 U/kg then 18 U/kg/h or LMWH
  | 'FULL_DOSE_SYSTEMIC_TPA_100MG'   // Alteplase 100 mg IV over 2 hours
  | 'CARDIAC_ARREST_PUSH_TPA_50MG'   // Alteplase 50 mg IV bolus push over 2 min (can repeat in 15 min during CPR)
  | 'CATHETER_DIRECTED_THROMBOLYSIS_EKOS' // Low-dose tPA 1 mg/h/catheter + ultrasound microstreaming
  | 'MECHANICAL_ASPIRATION_THROMBECTOMY'  // Inari FlowTriever / Penumbra Lightning catheter aspiration
  | 'SURGICAL_PULMONARY_EMBOLECTOMY'      // Median sternotomy & cardiopulmonary bypass clot evacuation
  | 'VA_ECMO_BRIDGE';                     // Femoral VA-ECMO to decompress RV & restore systemic MAP

export interface MassivePePatientParams {
  // Hemodynamics
  sbpMmHg: number;                   // 50 to 160 mmHg
  dbpMmHg: number;                   // 30 to 100 mmHg
  heartRateBpm: number;              // 40 to 180 bpm
  respiratoryRateBpm: number;        // 12 to 45 bpm
  spO2Percent: number;               // 70 to 100% on supplemental O2

  // Bedside Echocardiographic Markers
  rvLvDiameterRatio: number;         // Normal < 0.9, abnormal >= 1.0, severe >= 1.5
  tapseMm: number;                   // Normal 17-25 mm, severe RV dysfunction < 16 mm
  mcConnellSignPresent: boolean;     // Hyperdynamic apex with mid-free wall akinesis
  sixtySixtySignPresent: boolean;    // PAAT < 60 ms AND peak TR systolic gradient < 60 mmHg
  interventricularSeptalFlattening: boolean; // D-shaped left ventricle
  ivcDiameterMm: number;             // Normal 12-20 mm, plethoric > 21 mm
  ivcInspiratoryCollapsePercent: number; // Normal > 50%, non-reactive < 50%

  // Laboratory & Biomarkers
  cardiacTroponinElevated: boolean;  // Elevated hs-cTnI or hs-cTnT (RV subendocardial injury)
  bnpElevated: boolean;              // Elevated BNP (> 100 pg/mL) or NT-proBNP (> 600 pg/mL)
  serumLactateMmolL: number;         // Normal 0.5-2.0 mmol/L, shock > 2.0-4.0+
  arterialPh: number;                // 6.90 to 7.45

  // Resuscitation Interventions
  ivFluidAdministeredMl: number;     // 0 to 3000 mL (GUIDELINE: Keep < 500 mL!)
  vasopressor: VasopressorChoice;
  inotrope: InotropeChoice;
  inhaledVasodilator: InhaledVasodilatorChoice;
  reperfusion: ReperfusionStrategy;

  // Bleeding Risk & Contraindications
  priorHemorrhagicStroke: boolean;
  ischemicStrokeWithin3Months: boolean;
  activeInternalBleeding: boolean;
  recentMajorSurgeryOrTraumaWithin3Weeks: boolean;
  intracranialNeoplasm: boolean;
}

export interface MassivePeSimulationResult {
  riskCategory: PeRiskStratification;
  rvDeathSpiralStage: RvDeathSpiralStage;
  shockIndex: number;
  meanArterialPressureMmHg: number;
  rightCoronaryPerfusionPressureMmHg: number; // MAP - CVP (or Aortic DBP - RVEDP)
  effectiveCardiacIndexLpmPerM2: number;
  rvWallStressIndex: number; // 0 to 100
  estimated30DayMortalityPercent: number;
  majorBleedingRiskPercent: number;
  hasAbsoluteLyticContraindication: boolean;
  resuscitationSafetyScore: number; // 0 to 100
  clinicalStatusBadge: {
    status: 'STABLE' | 'WARNING' | 'CRITICAL' | 'LETHAL_EMERGENCY';
    label: string;
    color: string;
  };
  criticalAlerts: string[];
  physiologicMechanisms: string[];
  stepByStepActionPlan: string[];
}

/**
 * Calculates hemodynamic indices and RCA perfusion pressure
 */
export function calculateHemodynamicIndices(params: MassivePePatientParams) {
  const map = Math.round((params.sbpMmHg + 2 * params.dbpMmHg) / 3);
  const shockIndex = parseFloat((params.heartRateBpm / Math.max(1, params.sbpMmHg)).toFixed(2));
  
  // Approximate CVP from IVC diameter and collapsibility
  let estimatedCvp = 5;
  if (params.ivcDiameterMm > 21 && params.ivcInspiratoryCollapsePercent < 50) {
    estimatedCvp = 18;
  } else if (params.ivcDiameterMm > 21 || params.ivcInspiratoryCollapsePercent < 50) {
    estimatedCvp = 12;
  } else {
    estimatedCvp = 5;
  }

  // Right Coronary Artery (RCA) perfusion gradient:
  // Normally, RCA perfuses during both systole and diastole because RV pressure is low (25/5).
  // In massive PE, RV cavitary pressure jumps to 40-50+ mmHg, halting systolic RCA flow.
  // Diastolic RCA flow depends on: (Aortic DBP - RV Diastolic Pressure / CVP).
  const rcaPerfusionPressure = Math.max(0, params.dbpMmHg - estimatedCvp);

  return { map, shockIndex, estimatedCvp, rcaPerfusionPressure };
}

/**
 * Evaluates absolute contraindications to systemic thrombolysis
 */
export function checkLyticContraindications(params: MassivePePatientParams): boolean {
  return (
    params.priorHemorrhagicStroke ||
    params.ischemicStrokeWithin3Months ||
    params.activeInternalBleeding ||
    params.intracranialNeoplasm ||
    params.recentMajorSurgeryOrTraumaWithin3Weeks
  );
}

/**
 * Classifies PE risk category according to ESC / AHA / CHEST Guidelines
 */
export function determinePeRiskStratification(params: MassivePePatientParams): PeRiskStratification {
  const isHypotensive = params.sbpMmHg < 90 || params.vasopressor !== 'NONE';
  const hasRvStrain =
    params.rvLvDiameterRatio >= 1.0 ||
    params.tapseMm < 16 ||
    params.mcConnellSignPresent ||
    params.interventricularSeptalFlattening;
  const hasMyocardialInjury = params.cardiacTroponinElevated || params.bnpElevated;

  const shockIndex = params.heartRateBpm / Math.max(1, params.sbpMmHg);
  if (isHypotensive || shockIndex >= 1.0 || params.arterialPh < 7.20) {
    return 'HIGH_RISK_MASSIVE';
  }

  if (hasRvStrain && hasMyocardialInjury) {
    return 'INTERMEDIATE_HIGH_SUBMASSIVE';
  }

  if (hasRvStrain || hasMyocardialInjury) {
    return 'INTERMEDIATE_LOW';
  }

  return 'LOW_RISK';
}

/**
 * Core simulation calculation for Massive PE & Right Ventricular Resuscitation
 */
export function simulateMassivePulmonaryEmbolism(params: MassivePePatientParams): MassivePeSimulationResult {
  const { map, shockIndex, estimatedCvp, rcaPerfusionPressure } = calculateHemodynamicIndices(params);
  const riskCategory = determinePeRiskStratification(params);
  const hasAbsoluteLyticContraindication = checkLyticContraindications(params);

  const criticalAlerts: string[] = [];
  const physiologicMechanisms: string[] = [];
  const stepByStepActionPlan: string[] = [];

  // 1. Evaluate RV Death Spiral Stage
  let rvDeathSpiralStage: RvDeathSpiralStage = 'COMPENSATED_RV_STRAIN';
  if (params.sbpMmHg < 60 || params.arterialPh < 7.05 || (params.sbpMmHg < 80 && params.ivFluidAdministeredMl > 1500)) {
    rvDeathSpiralStage = 'PEA_CARDIAC_ARREST';
  } else if (params.sbpMmHg < 90 || params.serumLactateMmolL >= 4.0) {
    rvDeathSpiralStage = 'FULMINANT_CARDIOGENIC_SHOCK';
  } else if (params.interventricularSeptalFlattening || rcaPerfusionPressure < 30 || params.cardiacTroponinElevated) {
    rvDeathSpiralStage = 'RV_ISCHEMIA_SEPTAL_SHIFT';
  } else if (params.rvLvDiameterRatio >= 1.0 || params.tapseMm < 16) {
    rvDeathSpiralStage = 'ACUTE_COR_PULMONALE';
  }

  // 2. Base Cardiac Index & RV Wall Stress
  let baseCi = 3.0; // L/min/m2 normal
  let baseWallStress = 25; // normal baseline

  if (params.rvLvDiameterRatio >= 1.0) {
    baseCi -= 0.6;
    baseWallStress += 25;
  }
  if (params.rvLvDiameterRatio >= 1.5) {
    baseCi -= 0.5;
    baseWallStress += 20;
  }
  if (params.tapseMm < 16) {
    baseCi -= 0.4;
    baseWallStress += 15;
  }
  if (params.interventricularSeptalFlattening) {
    baseCi -= 0.4; // Septal shift impairs LV filling (ventricular interdependence)
    baseWallStress += 15;
  }

  // 3. Fluid Resuscitation Guardrail Assessment (The RV Overdistension Disaster)
  let fluidPenalty = 0;
  if (params.ivFluidAdministeredMl > 500) {
    const excess = params.ivFluidAdministeredMl - 500;
    // In dilated RV, excess fluid overstretches thin myofilaments beyond peak of Starling curve!
    fluidPenalty = Math.min(1.5, (excess / 1000) * 0.7);
    baseCi -= fluidPenalty;
    baseWallStress = Math.min(100, baseWallStress + (excess / 500) * 12);

    criticalAlerts.push(
      `RV VOLUME OVERLOAD DISASTER: ${params.ivFluidAdministeredMl} mL IV fluid administered. Excessive volume overdistends the dilated RV, worsens tricuspid regurgitation, shifts the septum leftward, and collapses LV preload.`
    );
  } else {
    physiologicMechanisms.push(
      `Judicious fluid control maintained (≤ 500 mL). Preserves RV geometric compliance and avoids catastrophic septal leftward displacement.`
    );
  }

  // 4. Vasopressor & Inotrope Effects
  if (params.vasopressor === 'PHENYLEPHRINE_HAZARD') {
    baseCi -= 0.5;
    baseWallStress = Math.min(100, baseWallStress + 20);
    criticalAlerts.push(
      `LETHAL VASOPRESSOR SELECTION: Phenylephrine is contraindicated in acute RV failure. Pure alpha-1 stimulation raises pulmonary vascular resistance (PVR), spikes RV afterload, and causes reflex bradycardia without inotropic support.`
    );
  } else if (params.vasopressor === 'NOREPINEPHRINE') {
    baseCi += 0.4;
    physiologicMechanisms.push(
      `Norepinephrine is the vasopressor of choice: restores aortic root pressure to perfuse the RCA without significantly increasing pulmonary vascular resistance.`
    );
  } else if (params.vasopressor === 'EPINEPHRINE') {
    baseCi += 0.5;
    physiologicMechanisms.push(
      `Epinephrine provides combined potent inotropic (beta-1) and vasoconstrictor (alpha-1) support for refractory cardiogenic shock or periarrest collapse.`
    );
  } else if (params.vasopressor === 'VASOPRESSIN_ADJUNCT') {
    baseCi += 0.2;
    physiologicMechanisms.push(
      `Vasopressin (0.01-0.03 U/min) restores systemic MAP while stimulating endothelial V1 receptors in pulmonary beds to promote nitric oxide-mediated pulmonary vasodilation.`
    );
  }

  if (params.inotrope === 'DOBUTAMINE') {
    baseCi += 0.35;
    physiologicMechanisms.push(
      `Dobutamine (2.5-5 mcg/kg/min) enhances RV inotropy and contractility. Monitor BP closely for peripheral vasodilation.`
    );
  } else if (params.inotrope === 'MILRINONE_CAUTION') {
    if (params.vasopressor === 'NONE' && params.sbpMmHg < 100) {
      baseCi -= 0.3;
      criticalAlerts.push(
        `MILRINONE HYPOTENSION HAZARD: Milrinone causes systemic arterial vasodilation. Without a concurrent vasopressor, it precipitates severe systemic hypotension and compromises RCA perfusion.`
      );
    } else {
      baseCi += 0.3;
      physiologicMechanisms.push(
        `Milrinone provides RV inodilator action with selective pulmonary vascular resistance reduction.`
      );
    }
  }

  if (params.inhaledVasodilator === 'INHALED_NITRIC_OXIDE_20PPM' || params.inhaledVasodilator === 'INHALED_EPOPROSTENOL') {
    baseCi += 0.3;
    baseWallStress = Math.max(10, baseWallStress - 15);
    physiologicMechanisms.push(
      `Inhaled pulmonary vasodilators selectively unload the right ventricle without inducing systemic hypotension or worsening V/Q mismatch.`
    );
  }

  // 5. Reperfusion Strategy Assessment
  let mortality = 0;
  let bleedingRisk = 2.0;

  if (riskCategory === 'HIGH_RISK_MASSIVE') {
    mortality = 45.0;
  } else if (riskCategory === 'INTERMEDIATE_HIGH_SUBMASSIVE') {
    mortality = 12.0;
  } else if (riskCategory === 'INTERMEDIATE_LOW') {
    mortality = 4.0;
  } else {
    mortality = 1.0;
  }

  // Modulate mortality and bleeding by therapy
  switch (params.reperfusion) {
    case 'ANTICOAGULATION_ONLY':
      if (riskCategory === 'HIGH_RISK_MASSIVE') {
        criticalAlerts.push(
          `INSUFFICIENT THERAPY: Massive PE with systemic hypotension treated with anticoagulation alone carries > 30-50% in-hospital mortality. Emergent revascularization (fibrinolysis, CDT, embolectomy, or ECMO) is mandated.`
        );
        mortality += 15.0;
      }
      bleedingRisk = 3.0;
      break;

    case 'FULL_DOSE_SYSTEMIC_TPA_100MG':
      if (hasAbsoluteLyticContraindication) {
        criticalAlerts.push(
          `CATASTROPHIC CONTRAINDICATION: Systemic tPA administered despite absolute contraindication. Risk of fatal intracranial hemorrhage or exsanguination is > 20%. Consider catheter embolectomy or surgical embolectomy instead.`
        );
        bleedingRisk = 25.0;
        mortality += 20.0;
      } else {
        bleedingRisk = 10.0;
        mortality = Math.max(8.0, mortality - 25.0);
        baseCi += 0.8;
        baseWallStress = Math.max(15, baseWallStress - 30);
        physiologicMechanisms.push(
          `Full-dose Alteplase (100 mg over 2h) rapidly dissolves pulmonary thromboemboli, drops PVR, relieves RV outflow obstruction, and restores LV filling.`
        );
      }
      break;

    case 'CARDIAC_ARREST_PUSH_TPA_50MG':
      bleedingRisk = 12.0;
      if (params.sbpMmHg < 60 || rvDeathSpiralStage === 'PEA_CARDIAC_ARREST') {
        mortality = Math.max(35.0, mortality - 25.0);
        physiologicMechanisms.push(
          `Cardiac arrest rescue tPA (50 mg bolus push): Essential intervention during PEA arrest from massive PE. CPR must continue for 60-90 minutes to circulate drug.`
        );
      } else {
        physiologicMechanisms.push(
          `Emergency bolus Alteplase administered for impending hemodynamic collapse.`
        );
      }
      break;

    case 'CATHETER_DIRECTED_THROMBOLYSIS_EKOS':
      bleedingRisk = 4.5;
      mortality = Math.max(5.0, mortality - 18.0);
      baseCi += 0.6;
      baseWallStress = Math.max(20, baseWallStress - 25);
      physiologicMechanisms.push(
        `Catheter-Directed Thrombolysis (EKOS): Ultrasound waves disorganize fibrin matrix, allowing low-dose tPA (1 mg/h/catheter) to achieve rapid clot lysis with significantly reduced major bleeding risk.`
      );
      break;

    case 'MECHANICAL_ASPIRATION_THROMBECTOMY':
      bleedingRisk = 3.5;
      mortality = Math.max(6.0, mortality - 20.0);
      baseCi += 0.7;
      baseWallStress = Math.max(20, baseWallStress - 25);
      physiologicMechanisms.push(
        `Mechanical Aspiration (Inari FlowTriever / Penumbra): Large-bore vacuum extraction physically removes central macro-emboli without lytic agents, ideal for patients with high bleeding risk.`
      );
      break;

    case 'SURGICAL_PULMONARY_EMBOLECTOMY':
      bleedingRisk = 8.0;
      mortality = Math.max(10.0, mortality - 22.0);
      baseCi += 0.75;
      physiologicMechanisms.push(
        `Surgical Embolectomy: Rapid cardiopulmonary bypass clot evacuation, gold standard when lytics are contraindicated or failed, or with clot-in-transit across PFO.`
      );
      break;

    case 'VA_ECMO_BRIDGE':
      bleedingRisk = 9.0;
      mortality = Math.max(12.0, mortality - 25.0);
      baseCi += 1.2;
      baseWallStress = Math.max(15, baseWallStress - 40);
      physiologicMechanisms.push(
        `Veno-Arterial (VA) ECMO: Cannulation immediately unloads the overloaded RV, decompresses the RV cavity, restores systemic MAP, and bridges to definitive revascularization.`
      );
      break;
  }

  // Adjust mortality for fluid penalty and vasopressor hazard
  if (params.ivFluidAdministeredMl > 1000) {
    mortality += 15.0;
  }
  if (params.vasopressor === 'PHENYLEPHRINE_HAZARD') {
    mortality += 20.0;
  }

  // Clamp values
  const effectiveCardiacIndexLpmPerM2 = parseFloat(Math.max(0.8, Math.min(4.5, baseCi)).toFixed(2));
  const rvWallStressIndex = Math.round(Math.min(100, Math.max(10, baseWallStress)));
  const estimated30DayMortalityPercent = parseFloat(Math.min(95, Math.max(1.0, mortality)).toFixed(1));

  // Resuscitation Safety Score (0-100)
  let safetyScore = 100;
  if (params.ivFluidAdministeredMl > 500) safetyScore -= 30;
  if (params.ivFluidAdministeredMl > 1500) safetyScore -= 20;
  if (params.vasopressor === 'PHENYLEPHRINE_HAZARD') safetyScore -= 40;
  if (riskCategory === 'HIGH_RISK_MASSIVE' && params.reperfusion === 'ANTICOAGULATION_ONLY') safetyScore -= 35;
  if (hasAbsoluteLyticContraindication && params.reperfusion === 'FULL_DOSE_SYSTEMIC_TPA_100MG') safetyScore -= 45;
  safetyScore = Math.max(0, Math.min(100, safetyScore));

  // Determine Clinical Status Badge
  let clinicalStatusBadge: MassivePeSimulationResult['clinicalStatusBadge'] = {
    status: 'STABLE',
    label: 'Compensated Hemodynamics',
    color: 'emerald'
  };

  if (rvDeathSpiralStage === 'PEA_CARDIAC_ARREST' || effectiveCardiacIndexLpmPerM2 < 1.4) {
    clinicalStatusBadge = {
      status: 'LETHAL_EMERGENCY',
      label: 'PEA Arrest / Impending Asystole',
      color: 'rose'
    };
  } else if (riskCategory === 'HIGH_RISK_MASSIVE' || rvDeathSpiralStage === 'FULMINANT_CARDIOGENIC_SHOCK') {
    clinicalStatusBadge = {
      status: 'CRITICAL',
      label: 'Massive PE: Cardiogenic Shock',
      color: 'red'
    };
  } else if (riskCategory === 'INTERMEDIATE_HIGH_SUBMASSIVE') {
    clinicalStatusBadge = {
      status: 'WARNING',
      label: 'Submassive PE: Impending RV Failure',
      color: 'amber'
    };
  }

  // Step-by-step clinical action plan
  stepByStepActionPlan.push(`1. Risk Triage: ESC Risk Category is ${riskCategory.replace(/_/g, ' ')}.`);
  if (params.ivFluidAdministeredMl > 500) {
    stepByStepActionPlan.push(`2. Immediate Fluid Hold: Cease IV fluid boluses immediately; avoid further RV overdistension.`);
  } else {
    stepByStepActionPlan.push(`2. Fluid Strategy: Maintain restrictive fluid policy (< 500 mL conservative bolus only if CVP < 8).`);
  }

  if (riskCategory === 'HIGH_RISK_MASSIVE') {
    stepByStepActionPlan.push(`3. Hemodynamic Support: Start Norepinephrine infusion immediately to maintain MAP > 65 mmHg and RCA perfusion gradient.`);
    if (hasAbsoluteLyticContraindication) {
      stepByStepActionPlan.push(`4. Emergency PERT Activation: Contraindications to lytics present. Activate Pulmonary Embolism Response Team (PERT) for catheter mechanical thrombectomy (Inari/Penumbra) or surgical embolectomy.`);
    } else if (params.sbpMmHg < 60 || rvDeathSpiralStage === 'PEA_CARDIAC_ARREST') {
      stepByStepActionPlan.push(`4. Crash Revascularization: Administer 50 mg IV bolus push Alteplase over 2 minutes; continue CPR for at least 60-90 minutes.`);
    } else {
      stepByStepActionPlan.push(`4. Emergent Thrombolysis: Administer Alteplase 100 mg IV infusion over 2 hours or prepare for catheter-directed therapies.`);
    }
  } else if (riskCategory === 'INTERMEDIATE_HIGH_SUBMASSIVE') {
    stepByStepActionPlan.push(`3. Monitoring & Anticoagulation: Therapeutic IV unfractionated heparin (UFH) preferred over LMWH due to short half-life and ready reversibility if patient decompensates.`);
    stepByStepActionPlan.push(`4. Close ICU Surveillance: Monitor in ICU/step-down; prepare for rescue thrombolysis or catheter-directed therapy (CDT) if hypotension ensues.`);
  } else {
    stepByStepActionPlan.push(`3. Standard Anticoagulation: Direct Oral Anticoagulant (DOAC) or LMWH; evaluate for safe early discharge or outpatient therapy.`);
  }

  return {
    riskCategory,
    rvDeathSpiralStage,
    shockIndex,
    meanArterialPressureMmHg: map,
    rightCoronaryPerfusionPressureMmHg: rcaPerfusionPressure,
    effectiveCardiacIndexLpmPerM2,
    rvWallStressIndex,
    estimated30DayMortalityPercent,
    majorBleedingRiskPercent: parseFloat(bleedingRisk.toFixed(1)),
    hasAbsoluteLyticContraindication,
    resuscitationSafetyScore: safetyScore,
    clinicalStatusBadge,
    criticalAlerts,
    physiologicMechanisms,
    stepByStepActionPlan
  };
}

/**
 * 5 Standard Clinical Case Presets
 */
export const MASSIVE_PE_PRESETS: Record<string, MassivePePatientParams> = {
  massiveShock: {
    sbpMmHg: 76,
    dbpMmHg: 48,
    heartRateBpm: 128,
    respiratoryRateBpm: 32,
    spO2Percent: 84,
    rvLvDiameterRatio: 1.4,
    tapseMm: 11,
    mcConnellSignPresent: true,
    sixtySixtySignPresent: true,
    interventricularSeptalFlattening: true,
    ivcDiameterMm: 25,
    ivcInspiratoryCollapsePercent: 10,
    cardiacTroponinElevated: true,
    bnpElevated: true,
    serumLactateMmolL: 4.8,
    arterialPh: 7.18,
    ivFluidAdministeredMl: 300,
    vasopressor: 'NOREPINEPHRINE',
    inotrope: 'NONE',
    inhaledVasodilator: 'INHALED_NITRIC_OXIDE_20PPM',
    reperfusion: 'FULL_DOSE_SYSTEMIC_TPA_100MG',
    priorHemorrhagicStroke: false,
    ischemicStrokeWithin3Months: false,
    activeInternalBleeding: false,
    recentMajorSurgeryOrTraumaWithin3Weeks: false,
    intracranialNeoplasm: false
  },

  fluidOverloadDisaster: {
    sbpMmHg: 68,
    dbpMmHg: 42,
    heartRateBpm: 135,
    respiratoryRateBpm: 36,
    spO2Percent: 81,
    rvLvDiameterRatio: 1.6,
    tapseMm: 9,
    mcConnellSignPresent: true,
    sixtySixtySignPresent: true,
    interventricularSeptalFlattening: true,
    ivcDiameterMm: 28,
    ivcInspiratoryCollapsePercent: 5,
    cardiacTroponinElevated: true,
    bnpElevated: true,
    serumLactateMmolL: 6.2,
    arterialPh: 7.10,
    ivFluidAdministeredMl: 2500, // Severe overdistension disaster!
    vasopressor: 'PHENYLEPHRINE_HAZARD', // Lethal vasopressor!
    inotrope: 'NONE',
    inhaledVasodilator: 'NONE',
    reperfusion: 'ANTICOAGULATION_ONLY', // Under-treated!
    priorHemorrhagicStroke: false,
    ischemicStrokeWithin3Months: false,
    activeInternalBleeding: false,
    recentMajorSurgeryOrTraumaWithin3Weeks: false,
    intracranialNeoplasm: false
  },

  submassiveIntermediateHigh: {
    sbpMmHg: 114,
    dbpMmHg: 72,
    heartRateBpm: 108,
    respiratoryRateBpm: 24,
    spO2Percent: 92,
    rvLvDiameterRatio: 1.2,
    tapseMm: 14,
    mcConnellSignPresent: true,
    sixtySixtySignPresent: true,
    interventricularSeptalFlattening: true,
    ivcDiameterMm: 22,
    ivcInspiratoryCollapsePercent: 30,
    cardiacTroponinElevated: true,
    bnpElevated: true,
    serumLactateMmolL: 2.1,
    arterialPh: 7.36,
    ivFluidAdministeredMl: 250,
    vasopressor: 'NONE',
    inotrope: 'NONE',
    inhaledVasodilator: 'NONE',
    reperfusion: 'CATHETER_DIRECTED_THROMBOLYSIS_EKOS',
    priorHemorrhagicStroke: false,
    ischemicStrokeWithin3Months: false,
    activeInternalBleeding: false,
    recentMajorSurgeryOrTraumaWithin3Weeks: false,
    intracranialNeoplasm: false
  },

  postOpHighBleedRisk: {
    sbpMmHg: 82,
    dbpMmHg: 52,
    heartRateBpm: 122,
    respiratoryRateBpm: 30,
    spO2Percent: 86,
    rvLvDiameterRatio: 1.35,
    tapseMm: 12,
    mcConnellSignPresent: true,
    sixtySixtySignPresent: false,
    interventricularSeptalFlattening: true,
    ivcDiameterMm: 24,
    ivcInspiratoryCollapsePercent: 15,
    cardiacTroponinElevated: true,
    bnpElevated: true,
    serumLactateMmolL: 3.8,
    arterialPh: 7.24,
    ivFluidAdministeredMl: 400,
    vasopressor: 'NOREPINEPHRINE',
    inotrope: 'DOBUTAMINE',
    inhaledVasodilator: 'NONE',
    reperfusion: 'MECHANICAL_ASPIRATION_THROMBECTOMY',
    priorHemorrhagicStroke: false,
    ischemicStrokeWithin3Months: false,
    activeInternalBleeding: false,
    recentMajorSurgeryOrTraumaWithin3Weeks: true, // Absolute contraindication to systemic lytics!
    intracranialNeoplasm: false
  },

  cardiacArrestPeaCrash: {
    sbpMmHg: 52,
    dbpMmHg: 32,
    heartRateBpm: 142,
    respiratoryRateBpm: 40,
    spO2Percent: 72,
    rvLvDiameterRatio: 1.7,
    tapseMm: 7,
    mcConnellSignPresent: true,
    sixtySixtySignPresent: true,
    interventricularSeptalFlattening: true,
    ivcDiameterMm: 30,
    ivcInspiratoryCollapsePercent: 0,
    cardiacTroponinElevated: true,
    bnpElevated: true,
    serumLactateMmolL: 8.5,
    arterialPh: 6.98,
    ivFluidAdministeredMl: 500,
    vasopressor: 'EPINEPHRINE',
    inotrope: 'NONE',
    inhaledVasodilator: 'NONE',
    reperfusion: 'CARDIAC_ARREST_PUSH_TPA_50MG',
    priorHemorrhagicStroke: false,
    ischemicStrokeWithin3Months: false,
    activeInternalBleeding: false,
    recentMajorSurgeryOrTraumaWithin3Weeks: false,
    intracranialNeoplasm: false
  }
};
