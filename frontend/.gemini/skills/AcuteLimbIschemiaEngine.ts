/**
 * AcuteLimbIschemiaEngine.ts
 *
 * Biophysical & Clinical Decision Engine for Acute Limb Ischemia (ALI):
 * Rutherford Classification (I, IIa, IIb, III), The 6 Ps, Fogarty Balloon Catheter Embolectomy,
 * Catheter-Directed Thrombolysis (CDT), Reperfusion Injury / Compartment Syndrome Mechanics (Delta Pressure),
 * and the Reperfusion Resuscitation Catastrophe in Non-Viable Limbs.
 *
 * Location: frontend/.gemini/skills/AcuteLimbIschemiaEngine.ts
 */

export type RutherfordCategory =
  | 'CLASS_I_VIABLE'
  | 'CLASS_IIA_MARGINALLY_THREATENED'
  | 'CLASS_IIB_IMMEDIATELY_THREATENED'
  | 'CLASS_III_IRREVERSIBLE';

export type IschemiaEtiology =
  | 'EMBOLIC_CARDIAC'
  | 'IN_SITU_THROMBOSIS'
  | 'GRAFT_OCCLUSION'
  | 'POPLITEAL_ANEURYSM_THROMBUS';

export type RevascularizationStrategy =
  | 'EMERGENT_FOGARTY_EMBOLECTOMY'
  | 'CATHETER_DIRECTED_THROMBOLYSIS_CDT'
  | 'SURGICAL_BYPASS'
  | 'PRIMARY_AMPUTATION'
  | 'CONSERVATIVE_HEPARIN_ONLY';

export type SensoryDeficit =
  | 'NONE'
  | 'MINIMAL_TOES'
  | 'EXTENSIVE_FOOT_REST_PAIN'
  | 'ANESTHETIC_NUMB';

export type MotorDeficit =
  | 'NONE'
  | 'MILD_TOE_FLEXION_WEAKNESS'
  | 'MODERATE_FOOT_DROP'
  | 'COMPLETE_PARALYSIS_RIGOR';

export type DopplerSignal =
  | 'NORMAL_AUDIBLE'
  | 'MONOPHASIC_DIMINISHED'
  | 'INAUDIBLE';

export interface ALIPatientParams {
  durationOfIschemiaHours: number;
  etiology: IschemiaEtiology;
  sensoryDeficit: SensoryDeficit;
  motorDeficit: MotorDeficit;
  arterialDoppler: DopplerSignal;
  venousDoppler: DopplerSignal;
  systolicBpMmHg: number;
  diastolicBpMmHg: number;
  intracompartmentalPressureMmHg: number;
  heparinAdministered: boolean;
  heparinBolusUnits: number;
  selectedRevascularization: RevascularizationStrategy;
  fogartyBalloonOverinflation: boolean;
  fasciotomyPerformed: boolean;
  preReperfusionHydrationActive: boolean;
  urineOutputMlPerHour: number;
  serumPotassiumMeqL: number;
  serumCkUnitsL: number;
}

export interface ALISimulationResult {
  rutherfordClass: RutherfordCategory;
  rutherfordLabel: string;
  isLimbSalvageable: boolean;
  goldenHourExceeded: boolean;
  deltaPerfusionPressureMmHg: number;
  compartmentSyndromeRisk: 'LOW' | 'HIGH' | 'ESTABLISHED_COMPARTMENT_SYNDROME';
  hyperkalemiaCardiacArrestRisk: 'MINIMAL' | 'MODERATE' | 'EXTREME_LETHAL_WASHOUT';
  myoglobinuriaNephropathyRisk: 'LOW' | 'MODERATE' | 'SEVERE_CRUSH_KIDNEY';
  predictedAmputationRatePercent: number;
  revascularizationSafetyScore: number;
  criticalAlerts: string[];
  physiologicMechanisms: string[];
  stepByStepProtocol: string[];
  contraindicationFlags: {
    cdtContraindicatedDueToMotorDeficit: boolean;
    revascularizationLethalDueToClassIII: boolean;
    fasciotomyMandatedImmediately: boolean;
    fogartyVesselRuptureHazard: boolean;
  };
}

/**
 * Evaluates Rutherford Classification based on SVS/ISCVS clinical guidelines
 */
export function classifyRutherford(params: ALIPatientParams): {
  category: RutherfordCategory;
  label: string;
  isSalvageable: boolean;
} {
  // Class III: Irreversible if paralysis/rigor, profound anesthesia, and inaudible venous/arterial signals
  if (
    params.motorDeficit === 'COMPLETE_PARALYSIS_RIGOR' ||
    (params.sensoryDeficit === 'ANESTHETIC_NUMB' && params.venousDoppler === 'INAUDIBLE')
  ) {
    return {
      category: 'CLASS_III_IRREVERSIBLE',
      label: 'Class III (Irreversible / Non-Viable): Profound paralysis, anesthesia, or inaudible venous flow',
      isSalvageable: false,
    };
  }

  // Class IIb: Immediately Threatened if motor weakness (even mild toe weakness) or extensive sensory loss
  if (
    params.motorDeficit === 'MODERATE_FOOT_DROP' ||
    params.motorDeficit === 'MILD_TOE_FLEXION_WEAKNESS' ||
    params.sensoryDeficit === 'EXTENSIVE_FOOT_REST_PAIN'
  ) {
    return {
      category: 'CLASS_IIB_IMMEDIATELY_THREATENED',
      label: 'Class IIb (Immediately Threatened): Motor weakness or extensive sensory loss present; requires immediate surgery',
      isSalvageable: true,
    };
  }

  // Class IIa: Marginally Threatened if sensory loss limited to toes, no muscle weakness, inaudible arterial Doppler
  if (
    params.sensoryDeficit === 'MINIMAL_TOES' ||
    params.arterialDoppler === 'INAUDIBLE'
  ) {
    return {
      category: 'CLASS_IIA_MARGINALLY_THREATENED',
      label: 'Class IIa (Marginally Threatened): Minimal sensory deficit (toes), no motor weakness; salvageable if treated promptly',
      isSalvageable: true,
    };
  }

  // Class I: Viable
  return {
    category: 'CLASS_I_VIABLE',
    label: 'Class I (Viable): No neurological deficit, audible arterial and venous Doppler signals',
    isSalvageable: true,
  };
}

/**
 * Main simulation function for Acute Limb Ischemia
 */
export function simulateAcuteLimbIschemia(params: ALIPatientParams): ALISimulationResult {
  const { category: rutherfordClass, label: rutherfordLabel, isSalvageable: isLimbSalvageable } =
    classifyRutherford(params);

  const goldenHourExceeded = params.durationOfIschemiaHours > 6.0;
  const deltaPerfusionPressureMmHg = params.diastolicBpMmHg - params.intracompartmentalPressureMmHg;

  // Compartment Syndrome Risk
  let compartmentSyndromeRisk: ALISimulationResult['compartmentSyndromeRisk'] = 'LOW';
  if (deltaPerfusionPressureMmHg <= 30 || params.intracompartmentalPressureMmHg >= 30) {
    compartmentSyndromeRisk = 'ESTABLISHED_COMPARTMENT_SYNDROME';
  } else if (params.intracompartmentalPressureMmHg >= 20 || goldenHourExceeded) {
    compartmentSyndromeRisk = 'HIGH';
  }

  // Hyperkalemia / Systemic Washout Risk
  let hyperkalemiaCardiacArrestRisk: ALISimulationResult['hyperkalemiaCardiacArrestRisk'] = 'MINIMAL';
  if (
    params.serumPotassiumMeqL >= 6.5 ||
    (rutherfordClass === 'CLASS_III_IRREVERSIBLE' && params.selectedRevascularization !== 'PRIMARY_AMPUTATION' && params.selectedRevascularization !== 'CONSERVATIVE_HEPARIN_ONLY')
  ) {
    hyperkalemiaCardiacArrestRisk = 'EXTREME_LETHAL_WASHOUT';
  } else if (params.serumPotassiumMeqL >= 5.5 || params.serumCkUnitsL > 20000) {
    hyperkalemiaCardiacArrestRisk = 'MODERATE';
  }

  // Myoglobinuria Nephropathy Risk
  let myoglobinuriaNephropathyRisk: ALISimulationResult['myoglobinuriaNephropathyRisk'] = 'LOW';
  if (params.serumCkUnitsL > 30000 || (params.serumCkUnitsL > 10000 && params.urineOutputMlPerHour < 100)) {
    myoglobinuriaNephropathyRisk = 'SEVERE_CRUSH_KIDNEY';
  } else if (params.serumCkUnitsL > 5000) {
    myoglobinuriaNephropathyRisk = 'MODERATE';
  }

  // Contraindication Flags
  const cdtContraindicatedDueToMotorDeficit =
    (rutherfordClass === 'CLASS_IIB_IMMEDIATELY_THREATENED' || rutherfordClass === 'CLASS_III_IRREVERSIBLE') &&
    params.selectedRevascularization === 'CATHETER_DIRECTED_THROMBOLYSIS_CDT';

  const revascularizationLethalDueToClassIII =
    rutherfordClass === 'CLASS_III_IRREVERSIBLE' &&
    (params.selectedRevascularization === 'EMERGENT_FOGARTY_EMBOLECTOMY' ||
      params.selectedRevascularization === 'CATHETER_DIRECTED_THROMBOLYSIS_CDT' ||
      params.selectedRevascularization === 'SURGICAL_BYPASS');

  const fasciotomyMandatedImmediately =
    (compartmentSyndromeRisk === 'ESTABLISHED_COMPARTMENT_SYNDROME' ||
      (goldenHourExceeded && params.selectedRevascularization === 'EMERGENT_FOGARTY_EMBOLECTOMY')) &&
    !params.fasciotomyPerformed;

  const fogartyVesselRuptureHazard =
    params.selectedRevascularization === 'EMERGENT_FOGARTY_EMBOLECTOMY' && params.fogartyBalloonOverinflation;

  const criticalAlerts: string[] = [];
  const physiologicMechanisms: string[] = [];
  const stepByStepProtocol: string[] = [];

  // Critical Alerts Checks
  if (revascularizationLethalDueToClassIII) {
    criticalAlerts.push(
      'LETHAL REPERFUSION RESUSCITATION CATASTROPHE: Attempting revascularization of an irreversible (Rutherford Class III) limb! Re-establishing arterial flow into necrotic skeletal muscle unleashes a massive systemic washout of potassium (> 7.5 mEq/L), myoglobin, lactate, and free radicals, precipitating fatal asystole, malignant ventricular fibrillation, and irreversible acute kidney injury. Immediate primary amputation is mandated!'
    );
  }

  if (cdtContraindicatedDueToMotorDeficit) {
    criticalAlerts.push(
      'CONTRAINDICATED CDT HAZARD: Catheter-Directed Thrombolysis (CDT) takes 12-24 hours to achieve arterial recanalization. In Rutherford Class IIb (motor deficit), skeletal muscle necrosis is irreversible after 4-6 hours. Emergent open surgical thromboembolectomy is strictly required!'
    );
  }

  if (fogartyVesselRuptureHazard) {
    criticalAlerts.push(
      'FOGARTY CATHETER COMPLICATION: Balloon overinflation caused arterial wall shear stress exceeding intimal tensile strength, risking arterial dissection, rupture, or pseudoaneurysm formation. Always inflate gently with liquid until tactile resistance is met.'
    );
  }

  if (fasciotomyMandatedImmediately) {
    criticalAlerts.push(
      `COMPARTMENT SYNDROME CRISIS: Compartment pressure ${params.intracompartmentalPressureMmHg} mmHg with Delta Pressure ${deltaPerfusionPressureMmHg} mmHg (<= 30 mmHg) or prolonged ischemia (> 6h). Emergent 4-compartment fasciotomy (anterior, lateral, superficial & deep posterior) is mandated to prevent irreversible ischemic contracture!`
    );
  }

  if (!params.heparinAdministered) {
    criticalAlerts.push(
      'UNFRACTIONATED HEPARIN OMISSION: Immediate IV Heparin (80 units/kg bolus, target aPTT 60-80s) was omitted. This allows rapid propagate thrombosis in low-flow runoff beds, converting marginal ischemia to irreversible necrosis.'
    );
  }

  // Physiologic Mechanisms
  if (rutherfordClass === 'CLASS_I_VIABLE') {
    physiologicMechanisms.push(
      'Collateral arterial circulation maintains baseline cellular aerobic metabolism; sensory and motor axons remain functionally intact.'
    );
  } else if (rutherfordClass === 'CLASS_IIA_MARGINALLY_THREATENED') {
    physiologicMechanisms.push(
      'Ischemia has exceeded the threshold for fine distal sensory axons, but larger motor axons and myocyte membranes remain viable if recanalized promptly.'
    );
  } else if (rutherfordClass === 'CLASS_IIB_IMMEDIATELY_THREATENED') {
    physiologicMechanisms.push(
      'Severe microvascular hypoperfusion with motor axon conduction block (neuropraxia/axonotmesis) and intracellular ATP depletion. Rapidly approaching the 6-hour cellular death horizon.'
    );
  } else {
    physiologicMechanisms.push(
      'Complete myocyte autolysis, intracellular calcium overload, breakdown of sarcoplasmic reticulum, and muscle rigor. Reperfusion at this stage washes dead tissue byproducts directly into circulation.'
    );
  }

  if (deltaPerfusionPressureMmHg <= 30) {
    physiologicMechanisms.push(
      `Post-ischemic reactive hyperemia combined with capillary leakage creates tissue edema inside non-distensible fascial envelopes. When tissue pressure (${params.intracompartmentalPressureMmHg} mmHg) approaches diastolic BP (${params.diastolicBpMmHg} mmHg), capillary perfusion gradient collapses, causing secondary ischemic tissue necrosis.`
    );
  }

  // Predicted Amputation Rate
  let amputationRate = 5;
  if (rutherfordClass === 'CLASS_IIA_MARGINALLY_THREATENED') amputationRate = 15;
  if (rutherfordClass === 'CLASS_IIB_IMMEDIATELY_THREATENED') amputationRate = 35;
  if (rutherfordClass === 'CLASS_III_IRREVERSIBLE') amputationRate = 95;
  if (goldenHourExceeded) amputationRate += 20;
  if (compartmentSyndromeRisk === 'ESTABLISHED_COMPARTMENT_SYNDROME' && !params.fasciotomyPerformed) amputationRate += 30;
  if (revascularizationLethalDueToClassIII) amputationRate = 100;
  if (cdtContraindicatedDueToMotorDeficit) amputationRate += 25;
  const predictedAmputationRatePercent = Math.min(100, Math.max(2, amputationRate));

  // Revascularization Safety Score (0-100)
  let safetyScore = 100;
  if (!params.heparinAdministered) safetyScore -= 20;
  if (revascularizationLethalDueToClassIII) safetyScore -= 50;
  if (cdtContraindicatedDueToMotorDeficit) safetyScore -= 30;
  if (fogartyVesselRuptureHazard) safetyScore -= 20;
  if (fasciotomyMandatedImmediately) safetyScore -= 25;
  if (params.serumPotassiumMeqL >= 6.0 && !params.preReperfusionHydrationActive) safetyScore -= 20;
  safetyScore = Math.max(0, Math.min(100, safetyScore));

  // Step-by-Step Clinical Protocol
  stepByStepProtocol.push(
    '1. Immediate Anticoagulation: IV Unfractionated Heparin (80 units/kg bolus, then 18 units/kg/hr infusion) to stop propagation of thrombus in runoff vessels.'
  );

  if (rutherfordClass === 'CLASS_I_VIABLE') {
    stepByStepProtocol.push(
      '2. Diagnostic Imaging & Urgent Revascularization: Urgent CTA or catheter angiography to delineate inflow/runoff anatomy; schedule surgical or endovascular revascularization within 12-24h.'
    );
  } else if (rutherfordClass === 'CLASS_IIA_MARGINALLY_THREATENED') {
    stepByStepProtocol.push(
      '2. Urgent Revascularization (CDT vs Surgery): Inflow/outflow assessment. Catheter-Directed Thrombolysis (CDT with tPA 0.5-1 mg/hr) is appropriate if no motor deficit is present, or urgent surgical Fogarty embolectomy.'
    );
  } else if (rutherfordClass === 'CLASS_IIB_IMMEDIATELY_THREATENED') {
    stepByStepProtocol.push(
      '2. Emergent Open Fogarty Embolectomy: Transfer immediately to operating room. Perform common femoral / popliteal arteriotomy and Fogarty balloon thromboembolectomy. Avoid CDT due to unacceptable delay (> 12h).'
    );
    stepByStepProtocol.push(
      '3. Mandatory Compartment Pressure Surveillance: Measure compartment pressures post-reperfusion. Perform prophylactic 4-compartment fasciotomy if ischemia time > 6 hours.'
    );
  } else {
    stepByStepProtocol.push(
      '2. Primary Amputation Mandated: Do NOT attempt arterial revascularization. Perform urgent guillotine or definitive amputation to prevent fatal hyperkalemic/myoglobinuric reperfusion cardiac arrest.'
    );
  }

  if (params.serumCkUnitsL > 5000 || params.preReperfusionHydrationActive) {
    stepByStepProtocol.push(
      '4. Forced Alkaline Diuresis & Renal Protection: IV Isotonic Saline or Sodium Bicarbonate infusion targeting urine output > 200-300 mL/hr and urine pH > 6.5 to prevent myoglobin cast nephropathy.'
    );
  }

  return {
    rutherfordClass,
    rutherfordLabel,
    isLimbSalvageable,
    goldenHourExceeded,
    deltaPerfusionPressureMmHg,
    compartmentSyndromeRisk,
    hyperkalemiaCardiacArrestRisk,
    myoglobinuriaNephropathyRisk,
    predictedAmputationRatePercent,
    revascularizationSafetyScore: safetyScore,
    criticalAlerts,
    physiologicMechanisms,
    stepByStepProtocol,
    contraindicationFlags: {
      cdtContraindicatedDueToMotorDeficit,
      revascularizationLethalDueToClassIII,
      fasciotomyMandatedImmediately,
      fogartyVesselRuptureHazard,
    },
  };
}

/**
 * Standard Presets for Acute Limb Ischemia Scenarios
 */
export const ALI_PRESETS: Record<string, ALIPatientParams> = {
  viableClassI: {
    durationOfIschemiaHours: 2.5,
    etiology: 'IN_SITU_THROMBOSIS',
    sensoryDeficit: 'NONE',
    motorDeficit: 'NONE',
    arterialDoppler: 'MONOPHASIC_DIMINISHED',
    venousDoppler: 'NORMAL_AUDIBLE',
    systolicBpMmHg: 135,
    diastolicBpMmHg: 82,
    intracompartmentalPressureMmHg: 12,
    heparinAdministered: true,
    heparinBolusUnits: 5000,
    selectedRevascularization: 'CATHETER_DIRECTED_THROMBOLYSIS_CDT',
    fogartyBalloonOverinflation: false,
    fasciotomyPerformed: false,
    preReperfusionHydrationActive: false,
    urineOutputMlPerHour: 65,
    serumPotassiumMeqL: 4.2,
    serumCkUnitsL: 450,
  },
  immediatelyThreatenedClassIIb: {
    durationOfIschemiaHours: 4.5,
    etiology: 'EMBOLIC_CARDIAC',
    sensoryDeficit: 'EXTENSIVE_FOOT_REST_PAIN',
    motorDeficit: 'MILD_TOE_FLEXION_WEAKNESS',
    arterialDoppler: 'INAUDIBLE',
    venousDoppler: 'NORMAL_AUDIBLE',
    systolicBpMmHg: 140,
    diastolicBpMmHg: 85,
    intracompartmentalPressureMmHg: 18,
    heparinAdministered: true,
    heparinBolusUnits: 5000,
    selectedRevascularization: 'EMERGENT_FOGARTY_EMBOLECTOMY',
    fogartyBalloonOverinflation: false,
    fasciotomyPerformed: true,
    preReperfusionHydrationActive: true,
    urineOutputMlPerHour: 150,
    serumPotassiumMeqL: 4.8,
    serumCkUnitsL: 8500,
  },
  cdtContraindicatedTrap: {
    durationOfIschemiaHours: 5.5,
    etiology: 'EMBOLIC_CARDIAC',
    sensoryDeficit: 'EXTENSIVE_FOOT_REST_PAIN',
    motorDeficit: 'MODERATE_FOOT_DROP',
    arterialDoppler: 'INAUDIBLE',
    venousDoppler: 'NORMAL_AUDIBLE',
    systolicBpMmHg: 130,
    diastolicBpMmHg: 75,
    intracompartmentalPressureMmHg: 22,
    heparinAdministered: true,
    heparinBolusUnits: 5000,
    selectedRevascularization: 'CATHETER_DIRECTED_THROMBOLYSIS_CDT', // LETHAL DELAY TRAP!
    fogartyBalloonOverinflation: false,
    fasciotomyPerformed: false,
    preReperfusionHydrationActive: false,
    urineOutputMlPerHour: 40,
    serumPotassiumMeqL: 5.2,
    serumCkUnitsL: 14500,
  },
  lethalReperfusionClassIII: {
    durationOfIschemiaHours: 24,
    etiology: 'EMBOLIC_CARDIAC',
    sensoryDeficit: 'ANESTHETIC_NUMB',
    motorDeficit: 'COMPLETE_PARALYSIS_RIGOR', // Rigor mortis!
    arterialDoppler: 'INAUDIBLE',
    venousDoppler: 'INAUDIBLE',
    systolicBpMmHg: 110,
    diastolicBpMmHg: 65,
    intracompartmentalPressureMmHg: 45,
    heparinAdministered: true,
    heparinBolusUnits: 5000,
    selectedRevascularization: 'EMERGENT_FOGARTY_EMBOLECTOMY', // LETHAL WASHOUT DISASTER!
    fogartyBalloonOverinflation: false,
    fasciotomyPerformed: false,
    preReperfusionHydrationActive: false,
    urineOutputMlPerHour: 15,
    serumPotassiumMeqL: 7.2,
    serumCkUnitsL: 85000,
  },
  postReperfusionCompartmentSyndrome: {
    durationOfIschemiaHours: 7.5,
    etiology: 'IN_SITU_THROMBOSIS',
    sensoryDeficit: 'EXTENSIVE_FOOT_REST_PAIN',
    motorDeficit: 'MILD_TOE_FLEXION_WEAKNESS',
    arterialDoppler: 'MONOPHASIC_DIMINISHED',
    venousDoppler: 'NORMAL_AUDIBLE',
    systolicBpMmHg: 125,
    diastolicBpMmHg: 70,
    intracompartmentalPressureMmHg: 48, // Delta P = 70 - 48 = 22 mmHg (<= 30) -> CRITICAL!
    heparinAdministered: true,
    heparinBolusUnits: 5000,
    selectedRevascularization: 'EMERGENT_FOGARTY_EMBOLECTOMY',
    fogartyBalloonOverinflation: false,
    fasciotomyPerformed: false, // OMITTED FASCIOTOMY!
    preReperfusionHydrationActive: true,
    urineOutputMlPerHour: 80,
    serumPotassiumMeqL: 5.6,
    serumCkUnitsL: 32000,
  },
};
