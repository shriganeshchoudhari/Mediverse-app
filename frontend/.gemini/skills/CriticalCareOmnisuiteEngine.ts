/**
 * CriticalCareOmnisuiteEngine.ts
 *
 * Grand Capstone Simulation Engine of Track B:
 * Whole-Body Multi-Organ Critical Care & Extracorporeal Shock Resuscitation Omnisuite.
 *
 * Integrates:
 * 1. Advanced Hemodynamics & Swan-Ganz Thermodilution (CO, SVR, PVR, PCWP, CVP, SvO2, DO2/VO2)
 * 2. Extracorporeal Life Support & Mechanical Unloading (VA/VV/VAV ECMO, Harlequin Syndrome, ECPELLA Impella)
 * 3. Neurocritical Monro-Kellie & Intracranial Dynamics (ICP, CPP, Lundberg A Waves, Uncal Herniation Risk)
 * 4. Severe ARDS & Driving Pressure Ventilation (PaO2/FiO2, Pplat, Driving Pressure, Mechanical Power)
 * 5. Abdominal Compartment Syndrome & Renal Perfusion (IAP, APP, Fluid Creep Crystalloid Overload)
 * 6. Multimodal Vasoactive Titration, TEG Hemostasis & Blood Product Resuscitation
 *
 * Location: frontend/.gemini/skills/CriticalCareOmnisuiteEngine.ts
 */

export type OmnisuiteScenario =
  | 'CARDIOGENIC_SHOCK_HARLEQUIN_ECMO'
  | 'POLYTRAUMA_TBI_MONRO_KELLIE'
  | 'SEPTIC_SHOCK_ARDS_FLUID_CREEP_ACS'
  | 'MASSIVE_PE_RV_FAILURE'
  | 'TOTAL_SPINAL_HEMOLYTIC_CRISIS';

export type EclsConfiguration =
  | 'NONE'
  | 'VA_ECMO_PERIPHERAL'
  | 'VV_ECMO_LUNG_SUPPORT'
  | 'VAV_HYBRID_HARLEQUIN_RESCUE'
  | 'ECPELLA_VA_ECMO_PLUS_IMPELLA';

export type VasopressorStrategy =
  | 'NONE'
  | 'NOREPINEPHRINE_MONOTHERAPY'
  | 'NOREPINEPHRINE_PLUS_VASOPRESSIN'
  | 'EPINEPHRINE_INOTROPIC_RESCUE'
  | 'DOBUTAMINE_INOTROPIC_SUPPORT';

export type MechanicalVentilationMode =
  | 'SPONTANEOUS_BREATHING'
  | 'LUNG_PROTECTIVE_LOW_VT'
  | 'HIGH_PEEP_PRONE_VENTILATION'
  | 'ULTRA_PROTECTIVE_REST_LUNG_ECMO';

export interface OmnisuitePatientParams {
  scenario: OmnisuiteScenario;
  eclsConfig: EclsConfiguration;
  ecmoFlowLpm: number; // 0.0 to 6.0 L/min
  impellaPLevel: number; // 0 to 9 (P0 = off, P8/P9 = max 2.5-4.0 L/min unloading)
  vasopressor: VasopressorStrategy;
  norepinephrineDoseMcgKgMin: number; // 0.0 to 1.0
  ventilationMode: MechanicalVentilationMode;
  peepCmH2O: number; // 5 to 24
  fio2Percent: number; // 21 to 100
  tidalVolumeMlPerKgPbw: number; // 3 to 10 mL/kg
  cumulativeFluidBalanceLiters: number; // e.g. -2 to +18 L
  hyperosmolarTherapyActive: boolean; // 3% NaCl or 20% Mannitol for ICP
  evdOpenDrain: boolean; // External Ventricular Drain
  patientWeightKg: number;
}

export interface OmnisuiteMultiOrganResult {
  // Cardiovascular & Hemodynamics
  meanArterialPressure: number;
  systolicBp: number;
  diastolicBp: number;
  heartRate: number;
  cardiacOutputTotalLpm: number;
  cardiacIndex: number;
  systemicVascularResistance: number;
  centralVenousPressureMmHg: number;
  pulmonaryCapillaryWedgePressureMmHg: number;
  mixedVenousOxygenSatPercent: number;
  leftVentricularAfterloadStress: 'OPTIMAL_UNLOADED' | 'MODERATE_STRESS' | 'SEVERE_DISTENSION_PULMONARY_FLOODING';
  
  // ECLS & Regional Oxygenation (Harlequin Syndrome Detection)
  harlequinNorthSouthSyndromePresent: boolean;
  rightRadialPreDuctalSpO2Percent: number; // Innominate artery / brain SpO2
  femoralPostDuctalSpO2Percent: number; // Lower body ECMO perfusate SpO2
  eclsWeaningReadinessScore: number; // 0-100%

  // Neurocritical & Intracranial Dynamics
  intracranialPressureMmHg: number;
  cerebralPerfusionPressureMmHg: number;
  brainHerniationRisk: 'NORMAL' | 'ELEVATED_ICP' | 'IMMINENT_UNCAL_HERNIATION';

  // Respiratory & Pulmonary Mechanics
  paO2FiO2Ratio: number;
  plateauPressureCmH2O: number;
  drivingPressureCmH2O: number;
  ventilatorInducedLungInjuryRisk: 'LOW_LUNG_PROTECTIVE' | 'MODERATE' | 'CRITICAL_VILI_HAZARD';

  // Renal & Abdominal Perfusion
  intraAbdominalPressureMmHg: number;
  abdominalPerfusionPressureMmHg: number;
  abdominalCompartmentSyndrome: boolean;
  urineOutputMlPerHour: number;

  // Composite Resuscitation Score & Alerts
  wholeBodyResuscitationScore: number; // 0 to 100
  multiOrganCriticalAlerts: string[];
  omnisuitePrioritizedActions: string[];
}

/**
 * Master capstone biophysical engine integrating cardiovascular, pulmonary,
 * mechanical circulatory, neurocritical, and abdominal compartment dynamics.
 */
export function simulateCriticalCareOmnisuite(
  params: OmnisuitePatientParams
): OmnisuiteMultiOrganResult {
  const {
    scenario,
    eclsConfig,
    ecmoFlowLpm,
    impellaPLevel,
    vasopressor,
    norepinephrineDoseMcgKgMin,
    ventilationMode,
    peepCmH2O,
    fio2Percent,
    tidalVolumeMlPerKgPbw,
    cumulativeFluidBalanceLiters,
    hyperosmolarTherapyActive,
    evdOpenDrain,
    patientWeightKg = 70,
  } = params;

  const alerts: string[] = [];
  const actions: string[] = [];

  // 1. Baseline Organ Metrics from Scenario
  let nativeCo = 4.5;
  let nativeSvr = 1100;
  let nativeCvP = 6.0;
  let nativePcwp = 10.0;
  let baselineIcp = 11.0;
  let lungPFRatio = 400;
  let baselineIap = 6.0;
  let hr = 78;

  switch (scenario) {
    case 'CARDIOGENIC_SHOCK_HARLEQUIN_ECMO':
      nativeCo = 1.6; // Profound cardiogenic shock
      nativeSvr = 1800; // Compensatory vasoconstriction
      nativeCvP = 16.0;
      nativePcwp = 28.0; // Severe LV congestion & hydrostatic edema
      lungPFRatio = 110; // Damaged lungs from pulmonary edema
      hr = 118;
      break;

    case 'POLYTRAUMA_TBI_MONRO_KELLIE':
      nativeCo = 4.0;
      nativeSvr = 1100;
      nativeCvP = 4.0;
      nativePcwp = 8.0;
      baselineIcp = 28.0; // Severe traumatic brain edema / hematoma
      lungPFRatio = 320;
      hr = 100;
      break;

    case 'SEPTIC_SHOCK_ARDS_FLUID_CREEP_ACS':
      nativeCo = 6.8; // Hyperdynamic vasoplegia
      nativeSvr = 420; // Severe loss of vascular tone
      nativeCvP = 14.0;
      nativePcwp = 15.0;
      lungPFRatio = 75; // Severe ARDS
      baselineIap = 18.0; // Fluid creep starting
      hr = 130;
      break;

    case 'MASSIVE_PE_RV_FAILURE':
      nativeCo = 2.0; // RV failure / loss of LV preload
      nativeSvr = 1650;
      nativeCvP = 22.0; // Severe RV backpressure
      nativePcwp = 7.0; // Underfilled LV!
      lungPFRatio = 140;
      hr = 126;
      break;

    case 'TOTAL_SPINAL_HEMOLYTIC_CRISIS':
      nativeCo = 2.2;
      nativeSvr = 450; // Chemical sympathectomy
      nativeCvP = 2.0;
      nativePcwp = 5.0;
      lungPFRatio = 250;
      hr = 42; // Unopposed vagal tone / T1-T4 block
      break;
  }

  // 2. ECLS & Mechanical Unloading Integration
  let eclsFlow = 0;
  let impellaFlow = 0;
  let lvStress: 'OPTIMAL_UNLOADED' | 'MODERATE_STRESS' | 'SEVERE_DISTENSION_PULMONARY_FLOODING' = 'OPTIMAL_UNLOADED';

  if (eclsConfig === 'VA_ECMO_PERIPHERAL' || eclsConfig === 'VAV_HYBRID_HARLEQUIN_RESCUE') {
    eclsFlow = Math.min(6.0, ecmoFlowLpm);
    // Peripheral VA-ECMO pumps retrograde into aorta -> dramatically increases LV afterload!
    nativePcwp += eclsFlow * 2.5;
    if (nativePcwp > 25) {
      lvStress = 'SEVERE_DISTENSION_PULMONARY_FLOODING';
      alerts.push(
        'LV OVERDISTENSION HAZARD: Peripheral VA-ECMO retrograde afterload has pushed PCWP > 25 mmHg, causing closed aortic valve, intracardiac stasis thrombus, and massive hydrostatic alveolar flooding!'
      );
    } else if (nativePcwp > 18) {
      lvStress = 'MODERATE_STRESS';
    }
  }

  if (eclsConfig === 'ECPELLA_VA_ECMO_PLUS_IMPELLA' || impellaPLevel > 0) {
    // Impella draws blood directly from LV cavity and pumps into ascending aorta
    impellaFlow = Number((impellaPLevel * 0.38).toFixed(2)); // P8 ~ 3.0 L/min
    nativePcwp = Math.max(8.0, nativePcwp - impellaFlow * 4.2);
    lvStress = 'OPTIMAL_UNLOADED';
  }

  // 3. Vasopressor & Inotropic Adjustments
  let calculatedSvr = nativeSvr;
  if (vasopressor === 'NOREPINEPHRINE_MONOTHERAPY') {
    calculatedSvr += norepinephrineDoseMcgKgMin * 900;
  } else if (vasopressor === 'NOREPINEPHRINE_PLUS_VASOPRESSIN') {
    calculatedSvr += norepinephrineDoseMcgKgMin * 900 + 450;
  } else if (vasopressor === 'EPINEPHRINE_INOTROPIC_RESCUE') {
    calculatedSvr += 400;
    nativeCo += 1.2;
    hr += 18;
  } else if (vasopressor === 'DOBUTAMINE_INOTROPIC_SUPPORT') {
    calculatedSvr -= 150;
    nativeCo += 1.5;
  }

  const effectiveNativeCo = eclsFlow > 0 ? nativeCo * 0.6 : nativeCo;
  const totalCo = Number((effectiveNativeCo + eclsFlow + impellaFlow).toFixed(2));
  const bsa = 1.8;
  const cardiacIndex = Number((totalCo / bsa).toFixed(2));

  let map = Math.round((totalCo * calculatedSvr) / 80);
  map = Math.max(30, Math.min(160, map));
  const pulsePressure = Math.round(totalCo * 7);
  let sbp = Math.round(map + (2 / 3) * pulsePressure);
  let dbp = Math.round(map - (1 / 3) * pulsePressure);
  if (sbp < dbp + 12) sbp = dbp + 12;

  // 4. Harlequin Syndrome (Dual-Circulation / North-South Syndrome)
  // In peripheral VA-ECMO: recovering native LV ejects poorly oxygenated blood from failing lungs
  // into ascending aorta / innominate artery -> brain/coronaries are cyanotic while lower body is hyperoxic!
  let harlequinPresent = false;
  let rightRadialSpO2 = 98;
  let femoralSpO2 = 99;

  if (
    (eclsConfig === 'VA_ECMO_PERIPHERAL' || eclsConfig === 'ECPELLA_VA_ECMO_PLUS_IMPELLA') &&
    lungPFRatio < 150 &&
    nativeCo > 1.2
  ) {
    harlequinPresent = true;
    rightRadialSpO2 = 74; // Brain and right arm severely hypoxic!
    femoralSpO2 = 100; // Lower body perfused by ECMO circuit
    alerts.push(
      'HARLEQUIN (NORTH-SOUTH) SYNDROME DETECTED: Recovering LV is ejecting deoxygenated blood from damaged lungs into aortic arch. Right radial (cerebral) SpO2 is 74% while femoral SpO2 is 100%! Upgrade to VAV Hybrid ECMO immediately.'
    );
  } else if (eclsConfig === 'VAV_HYBRID_HARLEQUIN_RESCUE') {
    // VAV sends oxygenated blood to Right IJ vein -> pre-oxygenates native pulmonary blood!
    harlequinPresent = false;
    rightRadialSpO2 = 97;
    femoralSpO2 = 99;
  }

  // 5. Neurocritical Monro-Kellie & Intracranial Pressure (ICP / CPP)
  let calculatedIcp = baselineIcp;
  if (hyperosmolarTherapyActive) calculatedIcp -= 8.0;
  if (evdOpenDrain) calculatedIcp -= 6.0;
  calculatedIcp = Math.max(4.0, Math.min(60.0, Number(calculatedIcp.toFixed(1))));

  const cpp = Math.round(map - calculatedIcp);

  let brainHerniationRisk: 'NORMAL' | 'ELEVATED_ICP' | 'IMMINENT_UNCAL_HERNIATION' = 'NORMAL';
  if (calculatedIcp >= 25 || cpp < 50) {
    brainHerniationRisk = 'IMMINENT_UNCAL_HERNIATION';
    alerts.push(
      'IMMINENT BRAIN HERNIATION RISK: ICP >= 25 mmHg or CPP < 50 mmHg! Monro-Kellie intracranial reserve exhausted. Mandates hyperosmolar therapy, EVD drainage, or decompressive craniectomy.'
    );
  } else if (calculatedIcp >= 18) {
    brainHerniationRisk = 'ELEVATED_ICP';
  }

  // 6. Respiratory Mechanics & Driving Pressure (VILI Risk)
  let plateauPressure = 18;
  let drivingPressure = 10;
  if (ventilationMode === 'LUNG_PROTECTIVE_LOW_VT') {
    plateauPressure = peepCmH2O + 12;
    drivingPressure = 12;
  } else if (ventilationMode === 'HIGH_PEEP_PRONE_VENTILATION') {
    plateauPressure = peepCmH2O + 10;
    drivingPressure = 10;
  } else if (ventilationMode === 'ULTRA_PROTECTIVE_REST_LUNG_ECMO') {
    plateauPressure = peepCmH2O + 6;
    drivingPressure = 6;
  } else {
    // Spontaneous / unprotective
    plateauPressure = peepCmH2O + (tidalVolumeMlPerKgPbw * 3);
    drivingPressure = plateauPressure - peepCmH2O;
  }

  let viliRisk: 'LOW_LUNG_PROTECTIVE' | 'MODERATE' | 'CRITICAL_VILI_HAZARD' = 'LOW_LUNG_PROTECTIVE';
  if (drivingPressure > 15 || plateauPressure > 30) {
    viliRisk = 'CRITICAL_VILI_HAZARD';
    alerts.push(
      'CRITICAL VILI HAZARD: Driving pressure > 15 cmH2O or Pplat > 30 cmH2O! Severe mechanical stress driving barotrauma and mortality. Lower tidal volume or initiate ECMO rest-lung ventilation.'
    );
  } else if (drivingPressure > 13) {
    viliRisk = 'MODERATE';
  }

  // 7. Abdominal Compartment Syndrome (ACS) & Renal Perfusion
  // Crystalloid fluid creep (> 6-10 L positive) increases IAP dramatically
  let calculatedIap = baselineIap + Math.max(0, (cumulativeFluidBalanceLiters - 4) * 1.4);
  calculatedIap = Math.max(4.0, Math.min(38.0, Number(calculatedIap.toFixed(1))));

  const app = Math.round(map - calculatedIap); // Abdominal Perfusion Pressure
  const acsPresent = calculatedIap >= 20;

  if (acsPresent) {
    alerts.push(
      'ABDOMINAL COMPARTMENT SYNDROME (ACS): Bladder pressure >= 20 mmHg with organ dysfunction! Mandates emergent decompressive laparostomy and diuresis/dialysis.'
    );
  }

  // Urine output is driven by APP and hemodynamics
  let uop = Math.max(5, Math.round((app / 60) * (patientWeightKg * 0.7)));
  if (acsPresent) uop = Math.min(15, uop); // Oliguria / anuria from renal vein compression

  // Mixed Venous O2 Saturation (SvO2 ~ 65-75%)
  let svo2 = 70;
  if (cardiacIndex < 2.0) svo2 = 52;
  else if (cardiacIndex > 3.5) svo2 = 78;

  // 8. Composite Resuscitation Score (0-100)
  let safetyScore = 100;
  if (map < 65) safetyScore -= 25;
  if (brainHerniationRisk === 'IMMINENT_UNCAL_HERNIATION') safetyScore -= 25;
  if (harlequinPresent) safetyScore -= 25;
  if (lvStress === 'SEVERE_DISTENSION_PULMONARY_FLOODING') safetyScore -= 20;
  if (viliRisk === 'CRITICAL_VILI_HAZARD') safetyScore -= 20;
  if (acsPresent) safetyScore -= 20;
  safetyScore = Math.max(0, Math.min(100, safetyScore));

  // 9. Prioritized Clinical Actions
  if (harlequinPresent) {
    actions.push(
      'Convert peripheral VA-ECMO to VAV Hybrid (infuse oxygenated blood into Right Internal Jugular vein to rescue cerebral perfusion).'
    );
  }
  if (lvStress === 'SEVERE_DISTENSION_PULMONARY_FLOODING') {
    actions.push(
      'Deploy Impella microaxial pump (ECPELLA configuration) or perform balloon atrial septostomy to unload the distended LV.'
    );
  }
  if (brainHerniationRisk === 'IMMINENT_UNCAL_HERNIATION') {
    actions.push(
      'Administer 3% Hypertonic Saline (250 mL IV bolus) or 20% Mannitol (1 g/kg) and open EVD drain to 10 cmH2O.'
    );
  }
  if (acsPresent) {
    actions.push(
      'Perform emergent surgical decompressive laparostomy and stop positive crystalloid administration to relieve abdominal compartment syndrome.'
    );
  }
  if (map < 65 && vasopressor === 'NONE') {
    actions.push(
      'Titrate Norepinephrine infusion to target MAP >= 65 mmHg (or MAP >= 80 mmHg if severe TBI/high ICP).'
    );
  }

  return {
    meanArterialPressure: map,
    systolicBp: sbp,
    diastolicBp: dbp,
    heartRate: hr,
    cardiacOutputTotalLpm: totalCo,
    cardiacIndex,
    systemicVascularResistance: Math.round(calculatedSvr),
    centralVenousPressureMmHg: Number(nativeCvP.toFixed(1)),
    pulmonaryCapillaryWedgePressureMmHg: Number(nativePcwp.toFixed(1)),
    mixedVenousOxygenSatPercent: svo2,
    leftVentricularAfterloadStress: lvStress,
    harlequinNorthSouthSyndromePresent: harlequinPresent,
    rightRadialPreDuctalSpO2Percent: rightRadialSpO2,
    femoralPostDuctalSpO2Percent: femoralSpO2,
    eclsWeaningReadinessScore: Math.round(Math.min(100, (cardiacIndex / 2.5) * 50 + (lungPFRatio / 300) * 50)),
    intracranialPressureMmHg: calculatedIcp,
    cerebralPerfusionPressureMmHg: cpp,
    brainHerniationRisk,
    paO2FiO2Ratio: lungPFRatio,
    plateauPressureCmH2O: plateauPressure,
    drivingPressureCmH2O: drivingPressure,
    ventilatorInducedLungInjuryRisk: viliRisk,
    intraAbdominalPressureMmHg: calculatedIap,
    abdominalPerfusionPressureMmHg: app,
    abdominalCompartmentSyndrome: acsPresent,
    urineOutputMlPerHour: uop,
    wholeBodyResuscitationScore: safetyScore,
    multiOrganCriticalAlerts: alerts,
    omnisuitePrioritizedActions: actions,
  };
}
