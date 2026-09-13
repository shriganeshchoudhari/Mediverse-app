/**
 * TensionPneumothoraxEngine.ts
 * Critical Care, Emergency Medicine & Trauma Physiology Engine:
 * Tension Pneumothorax, Obstructive Shock Hemodynamics, Needle Thoracostomy (2nd ICS MCL vs 5th ICS AAL),
 * Finger Thoracostomy, Chest Tube Thoracostomy Mechanics (Three-Bottle Drainage System: Collection,
 * Water Seal Tidaling, Air Leak Metering, -20 cmH2O Suction), and Massive Hemothorax Autotransfusion.
 */

export type DecompressionIntervention =
  | 'NONE'
  | 'NEEDLE_2ND_ICS_MCL' // 2nd Intercostal Space, Midclavicular Line (Traditional, high failure rate)
  | 'NEEDLE_5TH_ICS_AAL' // 5th Intercostal Space, Anterior Axillary Line (ATLS 10th Ed preferred)
  | 'FINGER_THORACOSTOMY' // Simple thoracostomy in Triangle of Safety (definitive rapid release)
  | 'TUBE_THORACOSTOMY'; // Formal chest tube placement (28-36 Fr connected to 3-bottle system)

export type NeedleCatheterLength = 'STANDARD_4_5_CM' | 'EXTENDED_8_0_CM'; // 1.75 inch vs 3.25 inch

export interface TensionPneumoPatientParams {
  patientBmi: number; // e.g. 24 normal, 32 obese (chest wall thickness correlates with BMI)
  sideAffected: 'LEFT' | 'RIGHT';
  pneumothoraxTensionActive: boolean; // Tension physiology present
  intrapleuralAirVolumeMl: number; // 0 to 2500 mL air in pleural space
  hemothoraxPresent: boolean; // Co-existing hemothorax
  pleuralBloodVolumeMl: number; // 0 to 2000 mL blood
  mechanicalVentilationPositivePressure: boolean; // Positive pressure accelerates re-tension
  interventionApplied: DecompressionIntervention;
  needleLength: NeedleCatheterLength;
  chestTubeSizeFr: number; // 14 (pigtail) to 36 Fr (large bore)
  suctionPressureCmH2O: number; // standard -20 cmH2O (0 to -40)
  autotransfusionActive: boolean; // Autologous cell saver blood re-infusion
  bronchopleuralFistulaActive: boolean; // Persistent visceral pleural tear air leak
}

export interface TensionPneumoSimulationOutput {
  intrapleuralPressureCmH2O: number; // Normal -5 cmH2O, tension +15 to +30 cmH2O
  mediastinalShiftMm: number; // 0 mm normal, up to 35 mm shift to contralateral side
  inferiorVenaCavaCompressionPct: number; // 0% normal, up to 85% compression
  cardiacPreloadReductionPct: number; // 0% to 80% reduction in venous return
  systolicBp: number; // mmHg (profound obstructive shock < 70 mmHg)
  meanArterialPressure: number; // mmHg
  heartRateBpm: number; // compensatory tachycardia or terminal bradycardia
  oxygenSaturationSpO2: number; // % (severe V/Q mismatch and shunting)
  airwayPeakPressureCmH2O: number; // markedly elevated during tension in ventilated patients
  trachealDeviation: 'CENTERED' | 'SLIGHT_CONTRALATERAL' | 'SEVERE_CONTRALATERAL';
  breathSoundsIpsilateral: 'NORMAL' | 'DIMINISHED' | 'ABSENT';
  percussionNote: 'RESONANT' | 'DULL_HEMOTHORAX' | 'HYPERRESONANT_TYMPANIC';
  chestWallThicknessMm: number; // Estimated depth to parietal pleura at intervention site
  decompressionSuccess: boolean;
  decompressionFailureReason?: string;
  threeBottleDrainageState: {
    collectionChamberBloodMl: number;
    waterSealTidalingMm: number; // Fluctuation of water column (2-6 mm normal)
    airLeakGrade: 0 | 1 | 2 | 3 | 4 | 5; // 0 = none, 1 = cough only, 5 = continuous throughout cycle
    suctionBubbleStatus: 'PROPER_GENTLE_BUBBLING' | 'NO_SUCTION' | 'EXCESSIVE_VIGOROUS';
  };
  autotransfusionYieldMl: number; // Re-infused autologous blood volume
  massiveHemothoraxAlert: boolean; // >= 1500 mL initial or > 200 mL/h ongoing
  emergencyThoracotomyIndicated: boolean;
  clinicalAlerts: Array<{
    level: 'CRITICAL' | 'WARNING' | 'SUCCESS' | 'INFO';
    message: string;
    rationale: string;
  }>;
}

export const DEFAULT_TENSION_PNEUMO_PATIENT: TensionPneumoPatientParams = {
  patientBmi: 27,
  sideAffected: 'RIGHT',
  pneumothoraxTensionActive: true,
  intrapleuralAirVolumeMl: 1800,
  hemothoraxPresent: false,
  pleuralBloodVolumeMl: 0,
  mechanicalVentilationPositivePressure: true,
  interventionApplied: 'NONE',
  needleLength: 'STANDARD_4_5_CM',
  chestTubeSizeFr: 28,
  suctionPressureCmH2O: -20,
  autotransfusionActive: false,
  bronchopleuralFistulaActive: false
};

/**
 * Estimates chest wall thickness (depth from skin to pleural space) based on BMI and anatomical site.
 * 2nd ICS MCL: Thicker muscle/fat pad (~42 mm in normal BMI, >55 mm in obesity).
 * 5th ICS AAL: Thinner serratus/intercostal layer (~34 mm in normal BMI, ~42 mm in obesity).
 */
export function estimateChestWallThickness(bmi: number, site: DecompressionIntervention): number {
  const baseBmiRatio = bmi / 24;
  if (site === 'NEEDLE_2ND_ICS_MCL') {
    return Math.round(42 * baseBmiRatio);
  }
  // 5th ICS AAL / MAL / Triangle of safety
  return Math.round(33 * baseBmiRatio);
}

/**
 * Main Biophysical Simulation Function for Tension Pneumothorax & Thoracic Decompression
 */
export function computeTensionPneumothoraxPhysiology(params: TensionPneumoPatientParams): TensionPneumoSimulationOutput {
  const alerts: TensionPneumoSimulationOutput['clinicalAlerts'] = [];

  // 1. Evaluate Decompression Intervention Efficacy
  let decompressionSuccess = false;
  let decompressionFailureReason: string | undefined = undefined;
  const siteThicknessMm = estimateChestWallThickness(params.patientBmi, params.interventionApplied);

  if (params.interventionApplied === 'NONE') {
    decompressionSuccess = false;
    decompressionFailureReason = 'No thoracic decompression performed.';
  } else if (params.interventionApplied === 'NEEDLE_2ND_ICS_MCL') {
    // 2nd ICS MCL: high failure rate if needle is short (4.5 cm = 45 mm)
    const catheterLengthMm = params.needleLength === 'STANDARD_4_5_CM' ? 45 : 80;
    if (catheterLengthMm <= siteThicknessMm) {
      decompressionSuccess = false;
      decompressionFailureReason = `Catheter length (${catheterLengthMm} mm) failed to penetrate chest wall thickness (${siteThicknessMm} mm) at 2nd ICS MCL.`;
      alerts.push({
        level: 'CRITICAL',
        message: 'NEEDLE DECOMPRESSION FAILURE: Chest Wall Thickness Exceeds Catheter Length',
        rationale: `Standard 4.5 cm (1.75") needle fails in up to 50% of adults at 2nd ICS MCL due to pectoralis and chest wall thickness (${siteThicknessMm} mm). ATLS 10th edition recommends 5th ICS AAL/MAL with an 8 cm (3.25") needle.`
      });
    } else {
      decompressionSuccess = true;
      alerts.push({
        level: 'WARNING',
        message: 'Needle Thoracostomy Successful but Temporary (Bridge to Chest Tube)',
        rationale: 'Needle decompression relieves tension by venting air to atmosphere, but easily kinks, clogs with blood/tissue, or dislodges. Immediate tube or finger thoracostomy is mandatory.'
      });
    }
  } else if (params.interventionApplied === 'NEEDLE_5TH_ICS_AAL') {
    const catheterLengthMm = params.needleLength === 'STANDARD_4_5_CM' ? 45 : 80;
    if (catheterLengthMm <= siteThicknessMm) {
      decompressionSuccess = false;
      decompressionFailureReason = `Catheter length (${catheterLengthMm} mm) failed to penetrate chest wall thickness (${siteThicknessMm} mm).`;
    } else {
      decompressionSuccess = true;
      alerts.push({
        level: 'SUCCESS',
        message: '5th ICS AAL Needle Thoracostomy Successful',
        rationale: 'ATLS 10th edition preferred anatomical site: thinner chest wall and lower failure rate than 2nd ICS MCL.'
      });
    }
  } else if (params.interventionApplied === 'FINGER_THORACOSTOMY') {
    // Finger thoracostomy cuts through skin/muscle directly into pleura - 100% penetration rate
    decompressionSuccess = true;
    alerts.push({
      level: 'SUCCESS',
      message: 'Simple Finger Thoracostomy Executed (Definitive Immediate Venting)',
      rationale: 'Blunt dissection and pleural entry with finger release tension instantly, sweep adhesions, and confirm lung expansion without risk of needle kinking.'
    });
  } else if (params.interventionApplied === 'TUBE_THORACOSTOMY') {
    decompressionSuccess = true;
    alerts.push({
      level: 'SUCCESS',
      message: `Chest Tube Thoracostomy (${params.chestTubeSizeFr} Fr) Connected to 3-Bottle Drainage`,
      rationale: 'Definitive large-bore evacuation of air and blood connected to water seal and -20 cmH2O suction.'
    });
  }

  // 2. Intrapleural Mechanics & Hemodynamics
  // Normal baseline intrapleural pressure is -5 cmH2O. Tension pushes it to +15 to +30 cmH2O.
  let intrapleuralPressureCmH2O = -5;
  let remainingAirVolume = params.intrapleuralAirVolumeMl;

  if (params.pneumothoraxTensionActive && !decompressionSuccess) {
    // Active unrelieved tension
    intrapleuralPressureCmH2O = Math.round(12 + (params.intrapleuralAirVolumeMl / 2000) * 16);
    if (params.mechanicalVentilationPositivePressure) {
      intrapleuralPressureCmH2O += 6; // Positive pressure ventilation drastically amplifies tension
    }
  } else if (decompressionSuccess) {
    // Relieved
    if (params.interventionApplied === 'TUBE_THORACOSTOMY') {
      intrapleuralPressureCmH2O = params.suctionPressureCmH2O; // e.g. -20 cmH2O
      remainingAirVolume = 0;
    } else {
      intrapleuralPressureCmH2O = 0; // Atmospheric open pneumothorax
      remainingAirVolume = Math.round(params.intrapleuralAirVolumeMl * 0.15);
    }
  }

  // Mediastinal Shift (mm)
  let mediastinalShiftMm = 0;
  if (intrapleuralPressureCmH2O > 0) {
    mediastinalShiftMm = Math.min(35, Math.round(intrapleuralPressureCmH2O * 1.3));
  }

  let trachealDeviation: TensionPneumoSimulationOutput['trachealDeviation'] = 'CENTERED';
  if (mediastinalShiftMm >= 18) {
    trachealDeviation = 'SEVERE_CONTRALATERAL';
  } else if (mediastinalShiftMm >= 8) {
    trachealDeviation = 'SLIGHT_CONTRALATERAL';
  }

  // Vena Cava Compression & Obstructive Shock Hemodynamics
  let ivcCompressionPct = 0;
  let cardiacPreloadReductionPct = 0;
  let systolicBp = 120;
  let heartRateBpm = 75;
  let oxygenSaturationSpO2 = 98;
  let airwayPeakPressureCmH2O = 20;

  if (intrapleuralPressureCmH2O > 0) {
    ivcCompressionPct = Math.min(85, Math.round(intrapleuralPressureCmH2O * 3.2));
    cardiacPreloadReductionPct = Math.min(80, Math.round(ivcCompressionPct * 0.95));

    // Obstructive shock: severe drop in stroke volume and SBP
    systolicBp = Math.max(50, Math.round(120 - (cardiacPreloadReductionPct / 100) * 75));
    heartRateBpm = Math.min(155, Math.round(75 + (cardiacPreloadReductionPct / 100) * 80));
    oxygenSaturationSpO2 = Math.max(65, Math.round(98 - (mediastinalShiftMm / 35) * 28));
    airwayPeakPressureCmH2O = Math.round(20 + intrapleuralPressureCmH2O * 1.2);

    alerts.push({
      level: 'CRITICAL',
      message: `OBSTRUCTIVE SHOCK: SBP ${systolicBp} mmHg, IVC Preload Collapsed by ${cardiacPreloadReductionPct}%`,
      rationale:
        'Suprathoracic intrapleural pressure kinks the vena cava, collapses right atrial venous return, drops cardiac output, and causes impending PEA (pulseless electrical activity) arrest.'
    });
  } else {
    // Normal or relieved
    systolicBp = 118;
    heartRateBpm = 82;
    oxygenSaturationSpO2 = 96;
    airwayPeakPressureCmH2O = 22;
  }

  // Physical Exam Findings
  let breathSoundsIpsilateral: TensionPneumoSimulationOutput['breathSoundsIpsilateral'] = 'NORMAL';
  let percussionNote: TensionPneumoSimulationOutput['percussionNote'] = 'RESONANT';

  if (remainingAirVolume > 800 || intrapleuralPressureCmH2O > 0) {
    breathSoundsIpsilateral = 'ABSENT';
    percussionNote = 'HYPERRESONANT_TYMPANIC';
  } else if (remainingAirVolume > 300) {
    breathSoundsIpsilateral = 'DIMINISHED';
    percussionNote = 'HYPERRESONANT_TYMPANIC';
  }

  if (params.hemothoraxPresent && params.pleuralBloodVolumeMl > 500) {
    percussionNote = 'DULL_HEMOTHORAX';
  }

  // 3. Three-Bottle Chest Drainage Mechanics
  let collectionBloodMl = 0;
  let waterSealTidalingMm = 0;
  let airLeakGrade: TensionPneumoSimulationOutput['threeBottleDrainageState']['airLeakGrade'] = 0;
  let suctionStatus: TensionPneumoSimulationOutput['threeBottleDrainageState']['suctionBubbleStatus'] = 'NO_SUCTION';

  if (params.interventionApplied === 'TUBE_THORACOSTOMY') {
    collectionBloodMl = params.pleuralBloodVolumeMl;

    // Water Seal Tidaling: Normal 2-6 mm fluctuation with respiration
    waterSealTidalingMm = 4;
    if (params.suctionPressureCmH2O <= -10) {
      suctionStatus = 'PROPER_GENTLE_BUBBLING';
    }

    // Air leak evaluation
    if (params.bronchopleuralFistulaActive) {
      airLeakGrade = 5; // Continuous bubbling during both inspiration and expiration
      alerts.push({
        level: 'WARNING',
        message: 'CONTINUOUS AIR LEAK: Bronchopleural Fistula (Grade 5 Air Leak)',
        rationale: 'Continuous bubbling in the water seal chamber through all phases of respiration indicates an active tracheobronchial or parenchymal alveolar tear.'
      });
    } else if (remainingAirVolume > 0) {
      airLeakGrade = 2; // Intermittent bubbling on exhalation only
    }
  }

  // 4. Massive Hemothorax & Autotransfusion Assessment
  const massiveHemothoraxAlert = params.hemothoraxPresent && params.pleuralBloodVolumeMl >= 1500;
  const emergencyThoracotomyIndicated = massiveHemothoraxAlert;

  if (massiveHemothoraxAlert) {
    alerts.push({
      level: 'CRITICAL',
      message: `MASSIVE HEMOTHORAX: Initial Output ${params.pleuralBloodVolumeMl} mL (>= 1500 mL Threshold)`,
      rationale:
        'Immediate evacuation of >= 1500 mL of blood upon chest tube insertion indicates massive hemothorax from major intercostal, internal mammary, or hilar vessel laceration. Urgent emergency thoracotomy is indicated.'
    });
  }

  let autotransfusionYieldMl = 0;
  if (params.autotransfusionActive && params.interventionApplied === 'TUBE_THORACOSTOMY' && params.pleuralBloodVolumeMl > 200) {
    autotransfusionYieldMl = Math.round(params.pleuralBloodVolumeMl * 0.85); // 85% salvage efficiency after filtration
    systolicBp = Math.min(130, systolicBp + 18); // Volume resuscitation restores MAP
    alerts.push({
      level: 'SUCCESS',
      message: `Autotransfusion Active: ${autotransfusionYieldMl} mL Autologous Shed Blood Salvaged and Re-Infused`,
      rationale:
        'Immediate autotransfusion of filtered shed pleural blood delivers warm, fresh, compatible autologous RBCs with 2,3-DPG preservation during damage control resuscitation.'
    });
  }

  const meanArterialPressure = Math.round((systolicBp + 2 * (systolicBp * 0.65)) / 3);

  return {
    intrapleuralPressureCmH2O,
    mediastinalShiftMm,
    inferiorVenaCavaCompressionPct: ivcCompressionPct,
    cardiacPreloadReductionPct,
    systolicBp,
    meanArterialPressure,
    heartRateBpm,
    oxygenSaturationSpO2,
    airwayPeakPressureCmH2O,
    trachealDeviation,
    breathSoundsIpsilateral,
    percussionNote,
    chestWallThicknessMm: siteThicknessMm,
    decompressionSuccess,
    decompressionFailureReason,
    threeBottleDrainageState: {
      collectionChamberBloodMl: collectionBloodMl,
      waterSealTidalingMm,
      airLeakGrade,
      suctionBubbleStatus: suctionStatus
    },
    autotransfusionYieldMl,
    massiveHemothoraxAlert,
    emergencyThoracotomyIndicated,
    clinicalAlerts: alerts
  };
}
