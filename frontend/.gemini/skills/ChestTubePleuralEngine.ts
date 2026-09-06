/**
 * ChestTubePleuralEngine.ts
 * Biophysical Pleural Space Dynamics & Chest Tube Water Seal Thoracostomy Engine
 * Location: frontend/.gemini/skills/ChestTubePleuralEngine.ts
 *
 * Implements:
 * 1. Pleural space mechanics: intrapleural pressure (P_pl), transpulmonary pressure (P_tp), lung volume fraction
 * 2. 3-Chamber Drainage Physics: Collection Chamber, Water Seal Chamber (tidaling & air leak grade 0-5), Suction Control Chamber (-10 to -40 cmH2O)
 * 3. Light's Criteria for Pleural Effusions (Exudate vs Transudate)
 * 4. Hemothorax surgical threshold rules (ATLS massive hemothorax criteria: >1500 mL initial or >200 mL/hr)
 * 5. Tension pneumothorax cardiovascular collapse and needle decompression kinematics
 * 6. Intrapleural pharmacotherapy: tPA + DNase (MIST-2 protocol) and Talc pleurodesis
 */

export type PleuralFluidType =
  | 'NONE'
  | 'SEROUS_TRANSUDATE'
  | 'EXUDATE_PARAPNEUMONIC'
  | 'EMPYEMA_PURULENT'
  | 'HEMOTHORAX_BLOOD'
  | 'CHYLOTHORAX_MILKY'
  | 'MALIGNANT_SEROSANGUINOUS';

export type DrainageChamberStatus =
  | 'GRAVITY_WATER_SEAL'
  | 'ACTIVE_WALL_SUCTION'
  | 'TUBE_CLAMPED';

export type AirLeakGrade = 0 | 1 | 2 | 3 | 4 | 5; // 0 = none, 1-2 = cough/forced expiration only, 3-5 = continuous tidal

export type ChestTubeAlarm =
  | 'OPTIMAL_LUNG_EXPANSION'
  | 'TENSION_PNEUMOTHORAX_CRITICAL'
  | 'MASSIVE_HEMOTHORAX_THORACOTOMY_ALERT'
  | 'BRONCHOPLEURAL_FISTULA_AIR_LEAK'
  | 'TUBE_OCCLUSION_ABSENT_TIDALING'
  | 'EMPYEMA_INTRAPLEURAL_ENZYMES_NEEDED'
  | 'OPEN_COMMUNICATING_PNEUMOTHORAX';

export type ChestTubePresetId =
  | 'TENSION_PNEUMOTHORAX_TRAUMA'
  | 'MASSIVE_HEMOTHORAX_CHEST_INJURY'
  | 'OPEN_SUCKING_CHEST_WOUND'
  | 'COMPLICATED_PARAPNEUMONIC_EMPYEMA'
  | 'MALIGNANT_PLEURAL_EFFUSION'
  | 'POST_LOBECTOMY_AIR_LEAK'
  | 'IATROGENIC_CHYLOTHORAX'
  | 'RESOLVED_LUNG_REEXPANSION';

export interface PleuralChemistryParams {
  fluidProteinGdl: number;
  serumProteinGdl: number;
  fluidLdhUL: number;
  serumLdhUL: number;
  fluidPh: number;
  fluidGlucoseMgdl: number;
  triglyceridesMgdl: number;
  hematocritPct: number; // For hemothorax (>50% peripheral hematocrit)
}

export interface ChestTubeInputParams {
  presetId: ChestTubePresetId;
  pleuralAirVolumeMl: number; // 0 to 2500 mL
  pleuralFluidVolumeMl: number; // 0 to 3000 mL
  fluidType: PleuralFluidType;
  suctionPressureCmH2O: number; // -10 to -40 cmH2O (default -20)
  drainageMode: DrainageChamberStatus;
  tubeSizeFr: number; // 14 to 36 Fr (small bore pigtail vs large bore trauma)
  isTubeClamped: boolean;
  isNeedleDecompressed: boolean;
  airLeakGrade: AirLeakGrade;
  pleuralChemistry: PleuralChemistryParams;
  hourlyDrainageRateMlHr: number; // for tracking active hemothorax
  initialDrainageVolumeMl: number;
  hasIntrapleuralEnzymes: boolean; // tPA + DNase instillation
  hasPleurodesis: boolean; // Talc
}

export interface LightsCriteriaResult {
  isExudate: boolean;
  ratioProtein: number;
  ratioLdh: number;
  ratioLdhUpperNormal: number;
  reason: string;
}

export interface ChestTubeState {
  intrapleuralPressureInspirationCmH2O: number; // e.g. -8 normal
  intrapleuralPressureExpirationCmH2O: number; // e.g. -4 normal
  meanPleuralPressureCmH2O: number;
  transpulmonaryPressureCmH2O: number;
  lungExpansionPct: number; // 0% (collapsed) to 100% (fully expanded)
  mediastinalShiftMm: number; // 0 = midline, positive = contralateral shift
  cardiacOutputLMin: number; // Normal ~5.0; reduced in tension pneumothorax
  tidalingAmplitudeCm: number; // Respiratory meniscus fluctuation in water seal (0 to 6 cm)
  isTidalingPresent: boolean;
  activeAlarms: ChestTubeAlarm[];
  lightsResult: LightsCriteriaResult;
  massiveHemothoraxTriggered: boolean;
  clinicalRecommendation: string;
  surgicalAction: string;
}

/**
 * Evaluate Light's Criteria for Pleural Fluid Analysis
 * Exudate defined by meeting ANY of:
 * 1. Pleural/Serum Protein ratio > 0.5
 * 2. Pleural/Serum LDH ratio > 0.6
 * 3. Pleural LDH > 2/3 upper limit of normal serum LDH (assumed 200 U/L -> 2/3 is ~133 U/L)
 */
export function evaluateLightsCriteria(chem: PleuralChemistryParams): LightsCriteriaResult {
  const { fluidProteinGdl, serumProteinGdl, fluidLdhUL, serumLdhUL } = chem;

  const ratioProtein = serumProteinGdl > 0 ? parseFloat((fluidProteinGdl / serumProteinGdl).toFixed(2)) : 0;
  const ratioLdh = serumLdhUL > 0 ? parseFloat((fluidLdhUL / serumLdhUL).toFixed(2)) : 0;
  const ratioLdhUpperNormal = parseFloat((fluidLdhUL / 200).toFixed(2));

  const meetsProtein = ratioProtein > 0.5;
  const meetsLdh = ratioLdh > 0.6;
  const meetsUln = fluidLdhUL > 133;

  const isExudate = meetsProtein || meetsLdh || meetsUln;

  let reason = 'Transudative (heart failure, cirrhosis, nephrotic syndrome, hypoalbuminemia)';
  if (isExudate) {
    reason = 'Exudative (parapneumonic, malignancy, pulmonary embolism, connective tissue disease, hemothorax)';
  }

  return {
    isExudate,
    ratioProtein,
    ratioLdh,
    ratioLdhUpperNormal,
    reason,
  };
}

/**
 * Main Biophysical Simulation Engine for Pleural Space & Chest Tube Thoracostomy
 */
export function computeChestTubeState(params: ChestTubeInputParams): ChestTubeState {
  const {
    presetId,
    pleuralAirVolumeMl,
    pleuralFluidVolumeMl,
    fluidType,
    suctionPressureCmH2O,
    drainageMode,
    isTubeClamped,
    isNeedleDecompressed,
    airLeakGrade,
    pleuralChemistry,
    hourlyDrainageRateMlHr,
    initialDrainageVolumeMl,
    hasIntrapleuralEnzymes,
    hasPleurodesis,
  } = params;

  // 1. Evaluate Pleural Chemistry & Light's Criteria
  const lightsResult = evaluateLightsCriteria(pleuralChemistry);

  // 2. Baseline Physiological Pressures
  let baselineInspPpl = -8.0;
  let baselineExpPpl = -4.0;

  // Total occupying volume in hemithorax (Air + Fluid)
  const totalOccupyingVolumeMl = pleuralAirVolumeMl + pleuralFluidVolumeMl;

  // Impact of suction or water seal
  const effectiveSuction =
    drainageMode === 'ACTIVE_WALL_SUCTION' && !isTubeClamped ? suctionPressureCmH2O : 0;

  // If needle decompressed, vent excess positive pressure
  let airVolumeEffective = pleuralAirVolumeMl;
  if (isNeedleDecompressed) {
    airVolumeEffective = Math.min(250, airVolumeEffective * 0.15);
  }

  // If tube is unclamped and functioning, suction accelerates air/fluid evacuation
  if (!isTubeClamped && drainageMode !== 'TUBE_CLAMPED') {
    airVolumeEffective = Math.max(0, airVolumeEffective + effectiveSuction * 10);
  }

  // Compute Intrapleural Pressures
  // Positive pressure buildup from trapped air/fluid
  const volumePressureContribution = (airVolumeEffective + pleuralFluidVolumeMl) / 75; // e.g. 1500 mL -> +20 cmH2O
  let pPlInsp = baselineInspPpl + volumePressureContribution;
  let pPlExp = baselineExpPpl + volumePressureContribution;

  // If on suction and tube open, intrapleural pressure drops toward suction limit
  if (drainageMode === 'ACTIVE_WALL_SUCTION' && !isTubeClamped && totalOccupyingVolumeMl < 500) {
    pPlInsp += suctionPressureCmH2O * 0.4;
    pPlExp += suctionPressureCmH2O * 0.4;
  }

  pPlInsp = parseFloat(pPlInsp.toFixed(1));
  pPlExp = parseFloat(pPlExp.toFixed(1));
  const meanPleuralPressureCmH2O = parseFloat(((pPlInsp + pPlExp) / 2).toFixed(1));

  // Transpulmonary Pressure P_tp = P_alv - P_pl (where alveolar pressure ~ 0 at end-respiration)
  // Positive P_tp keeps alveoli open (normal ~ +5 cmH2O)
  const transpulmonaryPressureCmH2O = parseFloat((-meanPleuralPressureCmH2O).toFixed(1));

  // Lung Expansion Percentage (100% when P_tp >= 5, falls to 0% as P_tp becomes negative or volume > 1800 mL)
  let lungExpansion = Math.max(0, Math.min(100, 100 - (totalOccupyingVolumeMl / 20)));
  if (transpulmonaryPressureCmH2O < 0) {
    lungExpansion = Math.min(lungExpansion, 15);
  }
  if (hasPleurodesis) {
    lungExpansion = Math.max(lungExpansion, 90);
  }
  const lungExpansionPct = Math.round(lungExpansion);

  // Mediastinal Shift (mm)
  // Tension pushes trachea/mediastinum to contralateral side (positive mm)
  let mediastinalShiftMm = 0;
  if (meanPleuralPressureCmH2O > 2) {
    mediastinalShiftMm = Math.round(Math.min(35, (meanPleuralPressureCmH2O - 2) * 2.2));
  }
  if (isNeedleDecompressed) {
    mediastinalShiftMm = Math.max(0, mediastinalShiftMm - 18);
  }

  // Cardiac Output (L/min)
  // Tension pneumothorax impedes venous return via IVC/RA compression
  let cardiacOutput = 5.0;
  if (mediastinalShiftMm > 5) {
    cardiacOutput -= (mediastinalShiftMm / 35) * 3.4; // Drops toward 1.6 L/min in severe tension
  }
  const cardiacOutputLMin = parseFloat(Math.max(1.2, cardiacOutput).toFixed(1));

  // Tidaling (Fluctuation in Water Seal)
  // Normal tidaling is 2-5 cm. Absent if tube clamped, obstructed, or lung 100% expanded against parietal pleura
  let tidalingAmplitudeCm = 0;
  let isTidalingPresent = false;
  if (!isTubeClamped && drainageMode !== 'ACTIVE_WALL_SUCTION') {
    if (lungExpansionPct < 98 && totalOccupyingVolumeMl > 50) {
      tidalingAmplitudeCm = parseFloat(Math.min(6.0, Math.abs(pPlExp - pPlInsp) * 0.8).toFixed(1));
      isTidalingPresent = tidalingAmplitudeCm >= 0.5;
    }
  }

  // Massive Hemothorax Criteria (ATLS):
  // Immediate initial output >= 1500 mL OR ongoing rate >= 200 mL/hr for 2-4 hours
  const massiveHemothoraxTriggered =
    fluidType === 'HEMOTHORAX_BLOOD' &&
    (initialDrainageVolumeMl >= 1500 || hourlyDrainageRateMlHr >= 200);

  // Active Clinical Alarms
  const activeAlarms: ChestTubeAlarm[] = [];

  if (pleuralAirVolumeMl >= 600 && meanPleuralPressureCmH2O >= 5 && mediastinalShiftMm >= 10 && !isNeedleDecompressed) {
    activeAlarms.push('TENSION_PNEUMOTHORAX_CRITICAL');
  }

  if (massiveHemothoraxTriggered) {
    activeAlarms.push('MASSIVE_HEMOTHORAX_THORACOTOMY_ALERT');
  }

  if (airLeakGrade >= 3) {
    activeAlarms.push('BRONCHOPLEURAL_FISTULA_AIR_LEAK');
  }

  if (isTubeClamped || (totalOccupyingVolumeMl > 600 && !isTidalingPresent && drainageMode === 'GRAVITY_WATER_SEAL')) {
    activeAlarms.push('TUBE_OCCLUSION_ABSENT_TIDALING');
  }

  if (fluidType === 'EMPYEMA_PURULENT' || (pleuralChemistry.fluidPh < 7.20 && lightsResult.isExudate)) {
    activeAlarms.push('EMPYEMA_INTRAPLEURAL_ENZYMES_NEEDED');
  }

  if (presetId === 'OPEN_SUCKING_CHEST_WOUND' && !isNeedleDecompressed && lungExpansionPct < 50) {
    activeAlarms.push('OPEN_COMMUNICATING_PNEUMOTHORAX');
  }

  if (activeAlarms.length === 0 && lungExpansionPct >= 92) {
    activeAlarms.push('OPTIMAL_LUNG_EXPANSION');
  }

  // Clinical Recommendations and Surgical Actions
  let clinicalRecommendation = 'Maintain chest tube to water seal with serial daily upright chest radiographs.';
  let surgicalAction = 'Monitor collection chamber output every 4 hours. Ensure drainage tubing free of dependent loops.';

  if (activeAlarms.includes('MASSIVE_HEMOTHORAX_THORACOTOMY_ALERT')) {
    clinicalRecommendation =
      'SURGICAL EMERGENCY: Massive Hemothorax meeting ATLS criteria (>1500 mL initial drainage or >200 mL/hr ongoing). High suspicion for intercostal artery, internal mammary, or hilar vascular disruption.';
    surgicalAction =
      'Activate Massive Transfusion Protocol (1:1:1 pRBC:FFP:Platelets). Prepare operating room immediately for urgent exploratory thoracotomy / VATS.';
  } else if (activeAlarms.includes('TENSION_PNEUMOTHORAX_CRITICAL')) {
    clinicalRecommendation =
      'IMMEDIATE LIFE THREAT: Acute Tension Pneumothorax with hemodynamic collapse. Perform immediate needle thoracostomy (14-gauge catheter at 2nd ICS midclavicular line or 5th ICS anterior axillary line) followed immediately by formal tube thoracostomy.';
    surgicalAction =
      'Emergency needle decompression; insert 28-32 Fr chest tube into 5th intercostal space anterior axillary line (Triangle of Safety). Connect to water seal at -20 cmH2O suction.';
  } else if (activeAlarms.includes('MASSIVE_HEMOTHORAX_THORACOTOMY_ALERT')) {
    clinicalRecommendation =
      'SURGICAL EMERGENCY: Massive Hemothorax meeting ATLS criteria (>1500 mL initial drainage or >200 mL/hr ongoing). High suspicion for intercostal artery, internal mammary, or hilar vascular disruption.';
    surgicalAction =
      'Activate Massive Transfusion Protocol (1:1:1 pRBC:FFP:Platelets). Prepare operating room immediately for urgent exploratory thoracotomy / VATS.';
  } else if (activeAlarms.includes('EMPYEMA_INTRAPLEURAL_ENZYMES_NEEDED')) {
    clinicalRecommendation =
      'Complicated Parapneumonic Effusion / Frank Empyema (pleural pH < 7.20, low glucose, loculated). High failure rate with drainage alone.';
    surgicalAction =
      'Initiate MIST-2 protocol: Intrapleural Alteplase (tPA 10 mg) + Dornase Alfa (DNase 5 mg) instilled BID for 3 days. If loculations persist at 72 hours, consult Thoracic Surgery for VATS decortication.';
  } else if (activeAlarms.includes('BRONCHOPLEURAL_FISTULA_AIR_LEAK')) {
    clinicalRecommendation =
      'High-grade Continuous Bronchopleural Air Leak (Grade 4-5). Risk of persistent pneumothorax and prolonged hospitalization.';
    surgicalAction =
      'Place on low-pressure suction (-10 to -20 cmH2O). Avoid high negative suction that might perpetuate fistula patency. Evaluate for bronchoscopic endobronchial valve (EBV) placement or surgical repair.';
  } else if (presetId === 'MALIGNANT_PLEURAL_EFFUSION') {
    clinicalRecommendation =
      'Malignant Pleural Effusion with high-output serosanguinous exudate. Non-curative palliative symptomatic management.';
    surgicalAction =
      'Confirm complete lung re-expansion on chest X-ray. If lung re-expands: Talc slurry pleurodesis (4-5g via tube). If trapped lung: Insert tunneled indwelling pleural catheter (PleurX) for outpatient drainage.';
  } else if (presetId === 'IATROGENIC_CHYLOTHORAX') {
    clinicalRecommendation =
      'Chylothorax from thoracic duct injury (fluid triglycerides > 110 mg/dL). Risk of profound malnutrition and immunodeficiency.';
    surgicalAction =
      'Strict non-fat diet with medium-chain triglycerides (MCT) or total parenteral nutrition (TPN). Subcutaneous Octreotide 100 mcg TID. If output > 1000 mL/day for > 5 days, plan thoracic duct ligation or lymphangiogram embolization.';
  }

  return {
    intrapleuralPressureInspirationCmH2O: pPlInsp,
    intrapleuralPressureExpirationCmH2O: pPlExp,
    meanPleuralPressureCmH2O,
    transpulmonaryPressureCmH2O,
    lungExpansionPct,
    mediastinalShiftMm,
    cardiacOutputLMin,
    tidalingAmplitudeCm,
    isTidalingPresent,
    activeAlarms,
    lightsResult,
    massiveHemothoraxTriggered,
    clinicalRecommendation,
    surgicalAction,
  };
}

/**
 * 8 Clinical Standard Presets for Chest Tube Thoracostomy & Pleural Dynamics
 */
export const CHEST_TUBE_PRESETS: Record<
  ChestTubePresetId,
  {
    title: string;
    description: string;
    initialState: ChestTubeInputParams;
  }
> = {
  TENSION_PNEUMOTHORAX_TRAUMA: {
    title: 'Tension Pneumothorax (Acute Shock)',
    description: 'Blunt chest trauma with 1-way ball-valve air trapping, severe positive intrapleural pressure (+18 cmH2O), contralateral tracheal shift, and obstructive shock (CO 1.8 L/min).',
    initialState: {
      presetId: 'TENSION_PNEUMOTHORAX_TRAUMA',
      pleuralAirVolumeMl: 1800,
      pleuralFluidVolumeMl: 50,
      fluidType: 'NONE',
      suctionPressureCmH2O: -20,
      drainageMode: 'TUBE_CLAMPED',
      tubeSizeFr: 28,
      isTubeClamped: false,
      isNeedleDecompressed: false,
      airLeakGrade: 5,
      pleuralChemistry: { fluidProteinGdl: 1.0, serumProteinGdl: 6.5, fluidLdhUL: 60, serumLdhUL: 180, fluidPh: 7.42, fluidGlucoseMgdl: 100, triglyceridesMgdl: 20, hematocritPct: 1 },
      hourlyDrainageRateMlHr: 0,
      initialDrainageVolumeMl: 0,
      hasIntrapleuralEnzymes: false,
      hasPleurodesis: false,
    },
  },

  MASSIVE_HEMOTHORAX_CHEST_INJURY: {
    title: 'Massive Hemothorax (ATLS Surgical Threshold)',
    description: 'Penetrating thoracic trauma with 1800 mL of dark blood in collection chamber and ongoing 250 mL/hr output, triggering emergency thoracotomy alert.',
    initialState: {
      presetId: 'MASSIVE_HEMOTHORAX_CHEST_INJURY',
      pleuralAirVolumeMl: 200,
      pleuralFluidVolumeMl: 1600,
      fluidType: 'HEMOTHORAX_BLOOD',
      suctionPressureCmH2O: -20,
      drainageMode: 'ACTIVE_WALL_SUCTION',
      tubeSizeFr: 32,
      isTubeClamped: false,
      isNeedleDecompressed: false,
      airLeakGrade: 1,
      pleuralChemistry: { fluidProteinGdl: 5.2, serumProteinGdl: 6.2, fluidLdhUL: 850, serumLdhUL: 220, fluidPh: 7.30, fluidGlucoseMgdl: 80, triglyceridesMgdl: 45, hematocritPct: 38 },
      hourlyDrainageRateMlHr: 260,
      initialDrainageVolumeMl: 1800,
      hasIntrapleuralEnzymes: false,
      hasPleurodesis: false,
    },
  },

  OPEN_SUCKING_CHEST_WOUND: {
    title: 'Open "Sucking" Communicating Chest Wound',
    description: 'Chest wall defect larger than 2/3 tracheal diameter with ambient air moving through wound during inspiration, requiring 3-sided dressing.',
    initialState: {
      presetId: 'OPEN_SUCKING_CHEST_WOUND',
      pleuralAirVolumeMl: 950,
      pleuralFluidVolumeMl: 100,
      fluidType: 'SEROUS_TRANSUDATE',
      suctionPressureCmH2O: -20,
      drainageMode: 'GRAVITY_WATER_SEAL',
      tubeSizeFr: 28,
      isTubeClamped: false,
      isNeedleDecompressed: false,
      airLeakGrade: 4,
      pleuralChemistry: { fluidProteinGdl: 2.1, serumProteinGdl: 6.8, fluidLdhUL: 110, serumLdhUL: 190, fluidPh: 7.38, fluidGlucoseMgdl: 95, triglyceridesMgdl: 30, hematocritPct: 4 },
      hourlyDrainageRateMlHr: 15,
      initialDrainageVolumeMl: 100,
      hasIntrapleuralEnzymes: false,
      hasPleurodesis: false,
    },
  },

  COMPLICATED_PARAPNEUMONIC_EMPYEMA: {
    title: 'Loculated Empyema (MIST-2 Protocol)',
    description: 'Post-pneumonic thick purulent effusion with pleural pH 6.95, glucose 22 mg/dL, and multiloculated fibrinous septations requiring intrapleural tPA/DNase.',
    initialState: {
      presetId: 'COMPLICATED_PARAPNEUMONIC_EMPYEMA',
      pleuralAirVolumeMl: 50,
      pleuralFluidVolumeMl: 850,
      fluidType: 'EMPYEMA_PURULENT',
      suctionPressureCmH2O: -20,
      drainageMode: 'ACTIVE_WALL_SUCTION',
      tubeSizeFr: 24,
      isTubeClamped: false,
      isNeedleDecompressed: false,
      airLeakGrade: 0,
      pleuralChemistry: { fluidProteinGdl: 4.8, serumProteinGdl: 6.0, fluidLdhUL: 1800, serumLdhUL: 210, fluidPh: 6.95, fluidGlucoseMgdl: 22, triglyceridesMgdl: 40, hematocritPct: 2 },
      hourlyDrainageRateMlHr: 30,
      initialDrainageVolumeMl: 600,
      hasIntrapleuralEnzymes: false,
      hasPleurodesis: false,
    },
  },

  MALIGNANT_PLEURAL_EFFUSION: {
    title: 'Malignant Pleural Effusion (Talc Pleurodesis)',
    description: 'High-output serosanguinous exudate from metastatic adenocarcinoma (protein ratio 0.72, LDH ratio 1.4) evaluated for chemical pleurodesis vs indwelling catheter.',
    initialState: {
      presetId: 'MALIGNANT_PLEURAL_EFFUSION',
      pleuralAirVolumeMl: 0,
      pleuralFluidVolumeMl: 1200,
      fluidType: 'MALIGNANT_SEROSANGUINOUS',
      suctionPressureCmH2O: -20,
      drainageMode: 'ACTIVE_WALL_SUCTION',
      tubeSizeFr: 20,
      isTubeClamped: false,
      isNeedleDecompressed: false,
      airLeakGrade: 0,
      pleuralChemistry: { fluidProteinGdl: 4.5, serumProteinGdl: 6.2, fluidLdhUL: 420, serumLdhUL: 210, fluidPh: 7.32, fluidGlucoseMgdl: 72, triglyceridesMgdl: 35, hematocritPct: 6 },
      hourlyDrainageRateMlHr: 45,
      initialDrainageVolumeMl: 1100,
      hasIntrapleuralEnzymes: false,
      hasPleurodesis: false,
    },
  },

  POST_LOBECTOMY_AIR_LEAK: {
    title: 'Post-Lobectomy Bronchopleural Air Leak',
    description: 'Persistent Grade 4 air leak following right upper lobectomy; continuous bubbling during inspiration and expiration with water seal evaluation.',
    initialState: {
      presetId: 'POST_LOBECTOMY_AIR_LEAK',
      pleuralAirVolumeMl: 350,
      pleuralFluidVolumeMl: 150,
      fluidType: 'SEROUS_TRANSUDATE',
      suctionPressureCmH2O: -15,
      drainageMode: 'GRAVITY_WATER_SEAL',
      tubeSizeFr: 28,
      isTubeClamped: false,
      isNeedleDecompressed: false,
      airLeakGrade: 4,
      pleuralChemistry: { fluidProteinGdl: 2.8, serumProteinGdl: 6.4, fluidLdhUL: 130, serumLdhUL: 200, fluidPh: 7.40, fluidGlucoseMgdl: 90, triglyceridesMgdl: 25, hematocritPct: 3 },
      hourlyDrainageRateMlHr: 20,
      initialDrainageVolumeMl: 150,
      hasIntrapleuralEnzymes: false,
      hasPleurodesis: false,
    },
  },

  IATROGENIC_CHYLOTHORAX: {
    title: 'Chylothorax (Thoracic Duct Disruption)',
    description: 'Milky, opalescent fluid drainage following posterior mediastinal dissection with fluid triglycerides 320 mg/dL diagnostic of chyle leak.',
    initialState: {
      presetId: 'IATROGENIC_CHYLOTHORAX',
      pleuralAirVolumeMl: 50,
      pleuralFluidVolumeMl: 900,
      fluidType: 'CHYLOTHORAX_MILKY',
      suctionPressureCmH2O: -20,
      drainageMode: 'ACTIVE_WALL_SUCTION',
      tubeSizeFr: 24,
      isTubeClamped: false,
      isNeedleDecompressed: false,
      airLeakGrade: 0,
      pleuralChemistry: { fluidProteinGdl: 3.8, serumProteinGdl: 6.1, fluidLdhUL: 160, serumLdhUL: 190, fluidPh: 7.44, fluidGlucoseMgdl: 105, triglyceridesMgdl: 320, hematocritPct: 1 },
      hourlyDrainageRateMlHr: 75,
      initialDrainageVolumeMl: 850,
      hasIntrapleuralEnzymes: false,
      hasPleurodesis: false,
    },
  },

  RESOLVED_LUNG_REEXPANSION: {
    title: 'Resolved Pneumothorax (Ready for Removal)',
    description: 'Fully re-expanded lung (100%), physiological negative intrapleural pressure (-8 cmH2O), zero air leak (Grade 0), minimal serous drainage, and successful water seal trial.',
    initialState: {
      presetId: 'RESOLVED_LUNG_REEXPANSION',
      pleuralAirVolumeMl: 0,
      pleuralFluidVolumeMl: 25,
      fluidType: 'SEROUS_TRANSUDATE',
      suctionPressureCmH2O: -20,
      drainageMode: 'GRAVITY_WATER_SEAL',
      tubeSizeFr: 24,
      isTubeClamped: false,
      isNeedleDecompressed: false,
      airLeakGrade: 0,
      pleuralChemistry: { fluidProteinGdl: 1.8, serumProteinGdl: 6.6, fluidLdhUL: 90, serumLdhUL: 180, fluidPh: 7.42, fluidGlucoseMgdl: 98, triglyceridesMgdl: 22, hematocritPct: 1 },
      hourlyDrainageRateMlHr: 5,
      initialDrainageVolumeMl: 25,
      hasIntrapleuralEnzymes: false,
      hasPleurodesis: false,
    },
  },
};
