/**
 * CompartmentSyndromeEngine.ts
 * Emergency Medicine, Orthopedic Surgery & Critical Care Physiology Engine:
 * Acute Traumatic Compartment Syndrome (ATCS), Intracompartmental Pressure (ICP) Transduction
 * (Absolute Pressure >= 30 mmHg vs Delta Pressure <= 30 mmHg [McQueen Criteria]),
 * Lower Extremity Two-Incision Four-Compartment Decompression (Anterior, Lateral, Superficial
 * & Deep Posterior Compartments), Forearm Decompression, Circumferential Burn Escharotomy,
 * and Rhabdomyolysis / Crush Injury Urine Alkalinization Renal Protection.
 */

export type AnatomicalRegion =
  | 'LOWER_LEG_TIBIA_FIBULA' // Most common: 4 compartments (Anterior, Lateral, Superficial Posterior, Deep Posterior)
  | 'FOREARM_RADIUS_ULNA' // Volar, Dorsal, Mobile Wad compartments
  | 'THIGH_FEMUR' // Anterior, Posterior, Medial
  | 'CIRCUMFERENTIAL_TORSO_LIMB_BURN'; // Full-thickness leathery burn eschar constricting thorax/extremity

export type TraumaEtiology =
  | 'CLOSED_TIBIAL_SHAFT_FRACTURE' // High-energy tibia fracture (highest risk injury)
  | 'CRUSH_INJURY_PROLONGED_COMPRESSION' // Prolonged entrapment, massive edema and rhabdomyolysis
  | 'VASCULAR_REPERFUSION_POST_EMBOLECTOMY' // Post-ischemic reperfusion tissue swelling
  | 'TIGHT_CIRCUMFERENTIAL_CAST' // Iatrogenic external constriction
  | 'FULL_THICKNESS_CIRCUMFERENTIAL_BURN' // Leathery unyielding eschar
  | 'BLEEDING_COAGULOPATHY_HEMATOMA'; // Anticoagulated patient with rapidly expanding intramuscular hematoma

export type LowerLegCompartmentId = 'ANTERIOR' | 'LATERAL' | 'SUPERFICIAL_POSTERIOR' | 'DEEP_POSTERIOR';

export type SurgicalIntervention =
  | 'NONE_CONSERVATIVE' // Cast splitting / bivalving only
  | 'CAST_BIVALVED_AND_SKIN_SPLIT' // Cast split completely to skin (reduces pressure by up to 50-85%)
  | 'SINGLE_INCISION_INCOMPLETE_FASCIOTOMY' // High risk: misses deep posterior compartment!
  | 'TWO_INCISION_FOUR_COMPARTMENT_FASCIOTOMY' // Standard gold standard complete decompression
  | 'EMERGENCY_ESCHAROTOMY_MIDAXIAL'; // Full-thickness incision through burn eschar into subcutaneous fat

export interface CompartmentPressureState {
  compartmentName: LowerLegCompartmentId | string;
  pressureMmHg: number; // Normal 0-8 mmHg, danger >= 30 mmHg
  painOnPassiveStretch: boolean; // Earliest most sensitive physical sign
  neurologicalDeficit: string; // Specific nerve affected
  ischemiaSeverity: 'NORMAL' | 'ISCHEMIC_THREATENED' | 'IRREVERSIBLE_MYONECROSIS';
  decompressed: boolean;
}

export interface CompartmentSyndromePatientParams {
  region: AnatomicalRegion;
  etiology: TraumaEtiology;
  systolicBpMmHg: number; // e.g. 115 mmHg (or 85 mmHg in trauma shock)
  diastolicBpMmHg: number; // e.g. 70 mmHg (or 45 mmHg in trauma shock)
  hoursSinceInjury: number; // 1 to 24 hours (irreversible damage after 6 hours)
  externalCastPresent: boolean;
  castBivalvedToSkin: boolean;
  measuredCompartmentPressures: {
    anteriorMmHg: number;
    lateralMmHg: number;
    superficialPosteriorMmHg: number;
    deepPosteriorMmHg: number;
  };
  surgicalProcedure: SurgicalIntervention;
  urineAlkalinizationActive: boolean; // IV NaHCO3 targeted to urine pH >= 6.5
  ivFluidRateMlPerHour: number; // Target 200-300 mL/h for myoglobin washout
}

export interface CompartmentSyndromeSimulationOutput {
  // Pressure & Perfusion Metrics
  highestIntracompartmentalPressureMmHg: number;
  deltaPressureMmHg: number; // Diastolic BP - Highest ICP (Diagnostic threshold <= 30 mmHg)
  deltaPressureDiagnosticForAcs: boolean; // Delta P <= 30 mmHg confirms ACS regardless of absolute value
  absolutePressureDiagnosticForAcs: boolean; // ICP >= 30 mmHg
  fasciotomyIndicated: boolean;

  // Compartment Breakdown
  compartmentBreakdown: CompartmentPressureState[];

  // 6 P's Clinical Exam Signs
  clinicalExam: {
    painOutOfProportion: boolean;
    painOnPassiveStretch: boolean; // Most sensitive early sign
    tenseWoodiness: boolean;
    paresthesias: boolean;
    paresisMotorDeficit: boolean; // Late sign
    pulselessnessLateSign: boolean; // Late grave sign (pulses usually preserved early!)
    palpableDistalPulses: boolean; // Dorsalis pedis / posterior tibial
  };

  // Rhabdomyolysis & Renal Kinetics
  serumCreatineKinaseUL: number; // Normal < 200, rhabdo > 5,000 to 100,000+ U/L
  urineMyoglobinPresent: boolean;
  urineColorAppearance: 'PALE_YELLOW' | 'TEA_COLORED_BROWN' | 'DARK_RED_PORT_WINE';
  urinePh: number; // Acidic < 5.6 precipitating ferrihemate vs alkalinized >= 6.5
  acuteKidneyInjuryRisk: 'LOW' | 'HIGH_CRUSH_SYNDROME_RISK' | 'ESTABLISHED_ATN';
  serumPotassiumMeqL: number; // Hyperkalemia risk from necrotic myocyte lysis

  // Surgical Quality & Volkmann Risk
  incompleteDecompressionPitfall: boolean; // True if deep posterior compartment missed!
  volkmannIschemicContractureRisk: boolean; // Claw toes / equinovarus if deep posterior missed
  limbSalvageSuccessScore: number; // 0 (amputation required) to 100 (complete limb salvage)
  clinicalAlerts: Array<{
    level: 'CRITICAL' | 'WARNING' | 'SUCCESS' | 'INFO';
    message: string;
    rationale: string;
  }>;
}

export const DEFAULT_COMPARTMENT_PATIENT: CompartmentSyndromePatientParams = {
  region: 'LOWER_LEG_TIBIA_FIBULA',
  etiology: 'CLOSED_TIBIAL_SHAFT_FRACTURE',
  systolicBpMmHg: 110,
  diastolicBpMmHg: 65,
  hoursSinceInjury: 4,
  externalCastPresent: true,
  castBivalvedToSkin: false,
  measuredCompartmentPressures: {
    anteriorMmHg: 42,
    lateralMmHg: 36,
    superficialPosteriorMmHg: 28,
    deepPosteriorMmHg: 38
  },
  surgicalProcedure: 'NONE_CONSERVATIVE',
  urineAlkalinizationActive: false,
  ivFluidRateMlPerHour: 125
};

export function simulateCompartmentSyndrome(params: CompartmentSyndromePatientParams): CompartmentSyndromeSimulationOutput {
  const {
    region,
    etiology,
    systolicBpMmHg,
    diastolicBpMmHg,
    hoursSinceInjury,
    externalCastPresent,
    castBivalvedToSkin,
    measuredCompartmentPressures,
    surgicalProcedure,
    urineAlkalinizationActive,
    ivFluidRateMlPerHour
  } = params;

  const alerts: CompartmentSyndromeSimulationOutput['clinicalAlerts'] = [];

  // 1. Surgical Decompression and Cast Removal Modifiers
  let anteriorPressure = measuredCompartmentPressures.anteriorMmHg;
  let lateralPressure = measuredCompartmentPressures.lateralMmHg;
  let supPostPressure = measuredCompartmentPressures.superficialPosteriorMmHg;
  let deepPostPressure = measuredCompartmentPressures.deepPosteriorMmHg;

  // External cast effect
  if (externalCastPresent && castBivalvedToSkin) {
    // Completely bivalving cast, padding, and dressings reduces pressure by 50-70%
    anteriorPressure = Math.round(anteriorPressure * 0.55);
    lateralPressure = Math.round(lateralPressure * 0.55);
    supPostPressure = Math.round(supPostPressure * 0.55);
    deepPostPressure = Math.round(deepPostPressure * 0.55);
    alerts.push({
      level: 'INFO',
      message: 'Cast & Dressings Bivalved to Skin',
      rationale:
        'Complete bivalving of plaster cast and cutting all cotton undercast padding down to skin relieves up to 50-80% of external constrictive pressure.'
    });
  }

  // Surgical intervention relief
  let incompleteDecompressionPitfall = false;
  let volkmannIschemicContractureRisk = false;

  let antDecompressed = false;
  let latDecompressed = false;
  let supDecompressed = false;
  let deepDecompressed = false;

  if (surgicalProcedure === 'TWO_INCISION_FOUR_COMPARTMENT_FASCIOTOMY') {
    // Complete release of all 4 compartments
    anteriorPressure = 8;
    lateralPressure = 7;
    supPostPressure = 6;
    deepPostPressure = 8;
    antDecompressed = true;
    latDecompressed = true;
    supDecompressed = true;
    deepDecompressed = true;
  } else if (surgicalProcedure === 'SINGLE_INCISION_INCOMPLETE_FASCIOTOMY') {
    // Single lateral incision: releases anterior, lateral, and superficial posterior, BUT MISSES DEEP POSTERIOR!
    anteriorPressure = 10;
    lateralPressure = 9;
    supPostPressure = 12;
    deepPostPressure = measuredCompartmentPressures.deepPosteriorMmHg; // UNRELEASED!
    antDecompressed = true;
    latDecompressed = true;
    supDecompressed = true;
    deepDecompressed = false;
    incompleteDecompressionPitfall = true;
    volkmannIschemicContractureRisk = true;
    alerts.push({
      level: 'CRITICAL',
      message: 'INCOMPLETE FASCIOTOMY PITFALL: Deep Posterior Compartment Missed!',
      rationale:
        'Single-incision approaches or failure to detach soleus origin from the tibia leaves the Deep Posterior Compartment unreleased. This produces catastrophic Volkmann ischemic contracture of the deep flexors (claw toes, equinovarus deformity) and irreversible tibial nerve sensory loss in the sole of the foot.'
    });
  } else if (surgicalProcedure === 'EMERGENCY_ESCHAROTOMY_MIDAXIAL') {
    anteriorPressure = 12;
    lateralPressure = 11;
    supPostPressure = 10;
    deepPostPressure = 12;
    antDecompressed = true;
    latDecompressed = true;
    supDecompressed = true;
    deepDecompressed = true;
  }

  // 2. Highest Pressure and Delta Pressure (McQueen Criteria)
  const highestIntracompartmentalPressureMmHg = Math.max(
    anteriorPressure,
    lateralPressure,
    supPostPressure,
    deepPostPressure
  );

  // Delta Pressure = Diastolic BP - Intracompartmental Pressure
  const deltaPressureMmHg = diastolicBpMmHg - highestIntracompartmentalPressureMmHg;

  // Diagnostic thresholds
  const absolutePressureDiagnosticForAcs = highestIntracompartmentalPressureMmHg >= 30;
  const deltaPressureDiagnosticForAcs = deltaPressureMmHg <= 30;
  const fasciotomyIndicated =
    (deltaPressureDiagnosticForAcs || absolutePressureDiagnosticForAcs) &&
    surgicalProcedure === 'NONE_CONSERVATIVE';

  // 3. Compartment Breakdown
  const getIschemiaSeverity = (p: number, decompressed: boolean) => {
    if (decompressed || p < 20) return 'NORMAL';
    if (hoursSinceInjury >= 6 && p >= 30) return 'IRREVERSIBLE_MYONECROSIS';
    return 'ISCHEMIC_THREATENED';
  };

  const compartmentBreakdown: CompartmentPressureState[] = [
    {
      compartmentName: 'ANTERIOR',
      pressureMmHg: anteriorPressure,
      painOnPassiveStretch: anteriorPressure >= 25,
      neurologicalDeficit: 'Deep Peroneal Nerve (1st Web Space Sensation & Toe Extension)',
      ischemiaSeverity: getIschemiaSeverity(anteriorPressure, antDecompressed),
      decompressed: antDecompressed
    },
    {
      compartmentName: 'LATERAL',
      pressureMmHg: lateralPressure,
      painOnPassiveStretch: lateralPressure >= 25,
      neurologicalDeficit: 'Superficial Peroneal Nerve (Dorsum of Foot Sensation & Foot Eversion)',
      ischemiaSeverity: getIschemiaSeverity(lateralPressure, latDecompressed),
      decompressed: latDecompressed
    },
    {
      compartmentName: 'SUPERFICIAL_POSTERIOR',
      pressureMmHg: supPostPressure,
      painOnPassiveStretch: supPostPressure >= 25,
      neurologicalDeficit: 'Sural Nerve (Lateral Border of Foot)',
      ischemiaSeverity: getIschemiaSeverity(supPostPressure, supDecompressed),
      decompressed: supDecompressed
    },
    {
      compartmentName: 'DEEP_POSTERIOR',
      pressureMmHg: deepPostPressure,
      painOnPassiveStretch: deepPostPressure >= 25,
      neurologicalDeficit: 'Tibial Nerve (Plantar Sole Sensation & Toe Flexion)',
      ischemiaSeverity: getIschemiaSeverity(deepPostPressure, deepDecompressed),
      decompressed: deepDecompressed
    }
  ];

  // 4. Clinical Exam: The 6 P's
  const painOutOfProportion = highestIntracompartmentalPressureMmHg >= 25 && hoursSinceInjury < 12;
  const painOnPassiveStretch = compartmentBreakdown.some(c => c.painOnPassiveStretch);
  const tenseWoodiness = highestIntracompartmentalPressureMmHg >= 30;
  const paresthesias = highestIntracompartmentalPressureMmHg >= 28 || hoursSinceInjury >= 2;
  const paresisMotorDeficit = (highestIntracompartmentalPressureMmHg >= 35 && hoursSinceInjury >= 4) || hoursSinceInjury >= 8;
  const pulselessnessLateSign = highestIntracompartmentalPressureMmHg >= systolicBpMmHg || hoursSinceInjury >= 12;
  const palpableDistalPulses = !pulselessnessLateSign;

  // 5. Rhabdomyolysis & Renal Protection Kinetics
  let ckBase = 350;
  let kBase = 4.2;

  if (highestIntracompartmentalPressureMmHg >= 30) {
    const necrosisFactor = Math.min(10, Math.max(1, hoursSinceInjury * 1.5));
    ckBase = Math.round(4000 + necrosisFactor * 6500);
    kBase = Number((4.2 + (necrosisFactor / 10) * 1.8).toFixed(1));
  } else if (surgicalProcedure === 'TWO_INCISION_FOUR_COMPARTMENT_FASCIOTOMY') {
    ckBase = 2200; // Post-decompression reperfusion washout
    kBase = 4.4;
  }

  const serumCreatineKinaseUL = ckBase;
  const serumPotassiumMeqL = kBase;
  const urineMyoglobinPresent = serumCreatineKinaseUL >= 5000;

  let urineColorAppearance: CompartmentSyndromeSimulationOutput['urineColorAppearance'] = 'PALE_YELLOW';
  if (serumCreatineKinaseUL >= 20000) {
    urineColorAppearance = 'DARK_RED_PORT_WINE';
  } else if (serumCreatineKinaseUL >= 5000) {
    urineColorAppearance = 'TEA_COLORED_BROWN';
  }

  // Urine pH & Alkalinization
  let urinePh = 5.4; // Acidic urine precipitates ferrihemate
  if (urineAlkalinizationActive) {
    urinePh = 6.8; // Targeted alkalinization
  }

  let acuteKidneyInjuryRisk: CompartmentSyndromeSimulationOutput['acuteKidneyInjuryRisk'] = 'LOW';
  if (urineMyoglobinPresent && !urineAlkalinizationActive && ivFluidRateMlPerHour < 200) {
    acuteKidneyInjuryRisk = hoursSinceInjury >= 8 ? 'ESTABLISHED_ATN' : 'HIGH_CRUSH_SYNDROME_RISK';
  }

  // 6. Limb Salvage Success Score
  let limbSalvageSuccessScore = 95;
  if (surgicalProcedure === 'NONE_CONSERVATIVE') {
    if (hoursSinceInjury >= 10) {
      limbSalvageSuccessScore = 20; // Severe myonecrosis / amputation risk
    } else if (hoursSinceInjury >= 6) {
      limbSalvageSuccessScore = 50;
    } else {
      limbSalvageSuccessScore = 75;
    }
  } else if (surgicalProcedure === 'SINGLE_INCISION_INCOMPLETE_FASCIOTOMY') {
    limbSalvageSuccessScore = 55; // High claw toe contracture
  } else if (surgicalProcedure === 'TWO_INCISION_FOUR_COMPARTMENT_FASCIOTOMY') {
    limbSalvageSuccessScore = hoursSinceInjury < 6 ? 98 : 80;
  }

  // 7. Clinical Alerts
  if (deltaPressureDiagnosticForAcs && surgicalProcedure === 'NONE_CONSERVATIVE') {
    alerts.push({
      level: 'CRITICAL',
      message: `DIAGNOSTIC DELTA PRESSURE (ΔP = ${deltaPressureMmHg} mmHg <= 30 mmHg)`,
      rationale: `Perfusion pressure (Diastolic BP ${diastolicBpMmHg} - Intracompartmental Pressure ${highestIntracompartmentalPressureMmHg} = ${deltaPressureMmHg} mmHg) is critically compromised (threshold <= 30 mmHg). EMERGENCY FASCIOTOMY IS MANDATORY to prevent irreversible myonecrosis.`
    });
  }

  if (palpableDistalPulses && fasciotomyIndicated) {
    alerts.push({
      level: 'WARNING',
      message: 'Pulselessness Fallacy: Palpable Pulses Do NOT Rule Out Compartment Syndrome',
      rationale:
        'Distal arterial pulses remain palpable because systolic blood pressure exceeds compartment pressure. Waiting for pulselessness (a late, pre-terminal sign) results in muscle necrosis and limb loss.'
    });
  }

  if (painOnPassiveStretch && surgicalProcedure === 'NONE_CONSERVATIVE') {
    alerts.push({
      level: 'CRITICAL',
      message: 'Pain on Passive Stretch: Most Sensitive Early Sign',
      rationale:
        'Passive stretch of muscles passing through the tense compartment is the earliest and most sensitive clinical finding of ischemia in conscious patients.'
    });
  }

  if (urineMyoglobinPresent && !urineAlkalinizationActive) {
    alerts.push({
      level: 'WARNING',
      message: 'Myoglobinuria / Rhabdomyolysis Nephrotoxicity Hazard',
      rationale:
        `Elevated CK (${serumCreatineKinaseUL} U/L) and myoglobinuria in acidic urine (pH ${urinePh}) precipitates ferrihemate in renal tubules, inducing acute tubular necrosis. Initiate aggressive IV hydration and Sodium Bicarbonate alkalinization to target urine pH >= 6.5.`
    });
  }

  if (surgicalProcedure === 'TWO_INCISION_FOUR_COMPARTMENT_FASCIOTOMY') {
    alerts.push({
      level: 'SUCCESS',
      message: 'Complete Two-Incision Four-Compartment Decompression Achieved',
      rationale:
        'Anterolateral incision released Anterior and Lateral compartments; Posteromedial incision detached soleus and unroofed Deep Posterior and Superficial Posterior compartments. Muscle viability preserved.'
    });
  }

  return {
    highestIntracompartmentalPressureMmHg,
    deltaPressureMmHg,
    deltaPressureDiagnosticForAcs,
    absolutePressureDiagnosticForAcs,
    fasciotomyIndicated,
    compartmentBreakdown,
    clinicalExam: {
      painOutOfProportion,
      painOnPassiveStretch,
      tenseWoodiness,
      paresthesias,
      paresisMotorDeficit,
      pulselessnessLateSign,
      palpableDistalPulses
    },
    serumCreatineKinaseUL,
    urineMyoglobinPresent,
    urineColorAppearance,
    urinePh,
    acuteKidneyInjuryRisk,
    serumPotassiumMeqL,
    incompleteDecompressionPitfall,
    volkmannIschemicContractureRisk,
    limbSalvageSuccessScore,
    clinicalAlerts: alerts
  };
}
