/**
 * PostOpTamponadeEngine.ts
 * Cardiology, Critical Care & Cardiac Surgery Physiology Engine:
 * Post-Cardiac Surgery Cardiac Tamponade vs Restrictive Physiology:
 * Transthoracic (TTE) vs Transesophageal Echocardiography (TEE Deep Transgastric View),
 * Localized Posterior Right/Left Atrial Hematoma, Blunted Pulsus Paradoxus in Stiff Ventricles,
 * Low Cardiac Output Syndrome (LCOS), Equalization of Diastolic Pressures (CVP, PAD, PCWP),
 * and Society of Thoracic Surgeons (STS) / CALS Emergency Resternotomy Decision Workstation.
 */

export type CardiacSurgeryProcedure =
  | 'CABG_X3' // Coronary Artery Bypass Grafting
  | 'AVR_ASCENDING_AORTA' // Aortic Valve Replacement + Ascending Aorta repair
  | 'MVR_REPAIR' // Mitral Valve Repair / Replacement
  | 'LVAD_IMPLANT' // Left Ventricular Assist Device
  | 'CONGENITAL_ADULT_REPAIR'; // Adult Congenital repair (e.g. Tetralogy revision)

export type TamponadeEtiology =
  | 'LOCALIZED_POSTERIOR_LA_HEMATOMA' // Clot behind left atrium causing pulmonary venous obstruction / LA collapse
  | 'LOCALIZED_POSTERIOR_RA_HEMATOMA' // Clot compressing right atrium / IVC inflow
  | 'CIRCUMFERENTIAL_HEMOPERICARDIUM' // Generalized tense pericardial fluid/blood
  | 'RESTRICTIVE_VENTRICULAR_STIFFNESS' // Post-CPB myocardial edema/ischemia, no discrete hematoma
  | 'POST_CPB_VASOPLEGIA' // Systemic inflammatory response syndrome with vasoplegia
  | 'ISOLATED_RV_FAILURE'; // Severe RV ischemia / air embolus / protamine reaction

export type ImagingModality =
  | 'NONE'
  | 'TTE_BEDSIDE' // Transthoracic Echocardiography (parasternal, apical, subcostal)
  | 'TEE_COMPREHENSIVE'; // Transesophageal Echocardiography (midesophageal + deep transgastric)

export type ResternotomyStage =
  | 'NONE'
  | 'CALS_CHEST_CLIPS_REMOVED' // CALS protocol: wire cut / skin reopen at bedside
  | 'STERNAL_WIRES_CUT_RETRACTOR_PLACED' // Finochietto retractor opened, clot evacuated
  | 'HEMOSTASIS_AND_STERNAL_CLOSURE'; // Bleeding controlled, definitive delayed or immediate closure

export interface PostOpTamponadePatientParams {
  procedure: CardiacSurgeryProcedure;
  hoursPostOp: number; // e.g. 1 to 24 hours
  chestTubeDrainageRateMlPerHour: number; // Normal 50-100 mL/h, high >200, sudden drop to 0-10 (clotted drain)
  chestTubeClottedOrKinked: boolean; // Sudden cessation of output despite active bleeding
  inotropicVasopressorScore: number; // VIS score 0 to 50
  mechanicalVentilationPeepCmH2O: number; // PEEP 5 to 15 cmH2O
  preExistingLvHypertrophyOrStiffness: boolean; // Stiff ventricle blunts pulsus paradoxus
  selectedEtiology: TamponadeEtiology;
  imagingPerformed: ImagingModality;
  resternotomyPerformed: ResternotomyStage;
  fluidBolusGivenMl: number; // 0 to 1000 mL crystalloid/colloid bridge
  drainMilkingOrStrippingAttempted: boolean; // High negative pressures can damage grafts/sutures
}

export interface PostOpTamponadeSimulationOutput {
  // Hemodynamic profile
  meanArterialPressureMmHg: number;
  systolicBpMmHg: number;
  diastolicBpMmHg: number;
  heartRateBpm: number;
  cardiacIndexLMinM2: number; // L/min/m2 (< 2.0 = severe LCOS)
  strokeVolumeIndexMlM2: number;
  systemicVascularResistanceDyns: number;
  mixedVenousOxygenSaturationPct: number; // SvO2 (< 55% = severe cardiogenic shock / LCOS)
  arterialLactateMmolL: number; // mmol/L
  urineOutputMlPerHour: number;

  // Pressures & Equalization
  centralVenousPressureCvpMmHg: number; // CVP
  pulmonaryArteryDiastolicPadMmHg: number; // PAD
  pulmonaryCapillaryWedgePressurePcwpMmHg: number; // PCWP
  diastolicPressureEqualizationGapMmHg: number; // |CVP - PCWP| <= 4-5 mmHg signifies equalization
  isEqualizedDiastolicPressures: boolean;

  // Pulsus Paradoxus & Waveforms
  pulsusParadoxusMmHg: number; // In post-op tamponade, often BLUNTED (< 10 mmHg or 0-6 mmHg)
  pulsusParadoxusBlunted: boolean;
  pulsusParadoxusBluntedReason: string;
  cvpWaveformMorphology: {
    xDescent: 'NORMAL' | 'PROMINENT_PRESERVED';
    yDescent: 'NORMAL' | 'BLUNTED_ABSENT' | 'PROMINENT_DEEP_DIP'; // Absent in tamponade, prominent dip in constriction/restriction
    description: string;
  };

  // Imaging Evaluation (TTE vs TEE)
  imagingFindings: {
    modalityUsed: ImagingModality;
    diagnosticQuality: 'POOR_ACOUSTIC_WINDOW' | 'EXCELLENT_ACOUSTIC_WINDOW' | 'NOT_PERFORMED';
    acousticShadowingPresent: boolean; // Sternal wires, dressings, mediastinal air
    pericardialSpaceVisualization: 'NOT_EVALUATED' | 'INADEQUATE_MISSED_POSTERIOR' | 'CLEARLY_VISUALIZED';
    localizedHematomaDetected: boolean;
    hematomaLocation: 'NONE' | 'POSTERIOR_RIGHT_ATRIUM' | 'POSTERIOR_LEFT_ATRIUM' | 'CIRCUMFERENTIAL' | 'NONE_DIFFUSE_STIFFNESS';
    hematomaSizeCm: number;
    chamberCollapse: {
      rightAtrialInversionDiastolicPct: number; // > 30% of cycle = specific
      rightVentricularDiastolicCollapse: boolean;
      leftAtrialCollapse: boolean; // Seen in localized LA hematoma on TEE!
    };
    mitralInflowRespiratoryVariationPct: number; // Pulsus surrogate on echo
    tricuspidInflowRespiratoryVariationPct: number;
    teeDeepTransgastricViewResult: string;
    clinicalEchoSummary: string;
  };

  // Resternotomy & Clinical Decision Support
  emergencyResternotomyIndicated: boolean;
  resternotomyUrgency: 'NONE' | 'URGENT_OR_REEXPLORATION' | 'IMMEDIATE_BEDSIDE_CALS_RESTERNOTOMY';
  hemodynamicRecoveryScore: number; // 0 (arrest/severe shock) to 100 (hemodynamics restored)
  chestDrainManagementSafetyAlert?: string;
  clinicalAlerts: Array<{
    level: 'CRITICAL' | 'WARNING' | 'SUCCESS' | 'INFO';
    message: string;
    rationale: string;
  }>;
  differentialDiagnosisMatrix: {
    diagnosis: 'POST_OP_TAMPONADE' | 'RESTRICTIVE_PHYSIOLOGY' | 'VASOPLEGIA' | 'ISOLATED_RV_FAILURE' | 'HYPOVOLEMIA';
    confidencePct: number;
    keyDistinguishingFeatures: string[];
    recommendedManagement: string;
  };
}

export const DEFAULT_POST_OP_PATIENT: PostOpTamponadePatientParams = {
  procedure: 'AVR_ASCENDING_AORTA',
  hoursPostOp: 4,
  chestTubeDrainageRateMlPerHour: 15,
  chestTubeClottedOrKinked: true,
  inotropicVasopressorScore: 18,
  mechanicalVentilationPeepCmH2O: 8,
  preExistingLvHypertrophyOrStiffness: true,
  selectedEtiology: 'LOCALIZED_POSTERIOR_LA_HEMATOMA',
  imagingPerformed: 'NONE',
  resternotomyPerformed: 'NONE',
  fluidBolusGivenMl: 250,
  drainMilkingOrStrippingAttempted: false
};

export function simulatePostOpTamponade(params: PostOpTamponadePatientParams): PostOpTamponadeSimulationOutput {
  const {
    procedure,
    hoursPostOp,
    chestTubeDrainageRateMlPerHour,
    chestTubeClottedOrKinked,
    inotropicVasopressorScore,
    mechanicalVentilationPeepCmH2O,
    preExistingLvHypertrophyOrStiffness,
    selectedEtiology,
    imagingPerformed,
    resternotomyPerformed,
    fluidBolusGivenMl,
    drainMilkingOrStrippingAttempted
  } = params;

  const alerts: PostOpTamponadeSimulationOutput['clinicalAlerts'] = [];

  // 1. Resternotomy state modifier
  let decompressionReliefPct = 0;
  if (resternotomyPerformed === 'CALS_CHEST_CLIPS_REMOVED') {
    decompressionReliefPct = 40; // Partial release of anterior pressure
  } else if (resternotomyPerformed === 'STERNAL_WIRES_CUT_RETRACTOR_PLACED') {
    decompressionReliefPct = 95; // Complete evacuation of hematoma & free pericardium
  } else if (resternotomyPerformed === 'HEMOSTASIS_AND_STERNAL_CLOSURE') {
    decompressionReliefPct = 100;
  }

  // 2. Base hemodynamic setup by etiology
  let baseMap = 75;
  let baseHr = 88;
  let baseCi = 2.8;
  let baseCvp = 10;
  let basePad = 12;
  let basePcwp = 11;
  let baseSvr = 1100;
  let baseSvO2 = 68;
  let baseLactate = 1.4;
  let baseUrine = 65;

  const isTamponade =
    selectedEtiology === 'LOCALIZED_POSTERIOR_LA_HEMATOMA' ||
    selectedEtiology === 'LOCALIZED_POSTERIOR_RA_HEMATOMA' ||
    selectedEtiology === 'CIRCUMFERENTIAL_HEMOPERICARDIUM';

  if (selectedEtiology === 'LOCALIZED_POSTERIOR_LA_HEMATOMA') {
    baseMap = 58;
    baseHr = 114;
    baseCi = 1.45;
    baseCvp = 19;
    basePad = 21;
    basePcwp = 20;
    baseSvr = 1650;
    baseSvO2 = 46;
    baseLactate = 4.6;
    baseUrine = 12;
  } else if (selectedEtiology === 'LOCALIZED_POSTERIOR_RA_HEMATOMA') {
    baseMap = 55;
    baseHr = 118;
    baseCi = 1.35;
    baseCvp = 22;
    basePad = 19;
    basePcwp = 18;
    baseSvr = 1750;
    baseSvO2 = 42;
    baseLactate = 5.2;
    baseUrine = 8;
  } else if (selectedEtiology === 'CIRCUMFERENTIAL_HEMOPERICARDIUM') {
    baseMap = 54;
    baseHr = 120;
    baseCi = 1.3;
    baseCvp = 20;
    basePad = 20;
    basePcwp = 20;
    baseSvr = 1800;
    baseSvO2 = 44;
    baseLactate = 5.5;
    baseUrine = 10;
  } else if (selectedEtiology === 'RESTRICTIVE_VENTRICULAR_STIFFNESS') {
    baseMap = 66;
    baseHr = 96;
    baseCi = 1.95;
    baseCvp = 17;
    basePad = 18;
    basePcwp = 19;
    baseSvr = 1350;
    baseSvO2 = 56;
    baseLactate = 2.6;
    baseUrine = 28;
  } else if (selectedEtiology === 'POST_CPB_VASOPLEGIA') {
    baseMap = 50;
    baseHr = 105;
    baseCi = 3.5;
    baseCvp = 6;
    basePad = 9;
    basePcwp = 8;
    baseSvr = 480;
    baseSvO2 = 78;
    baseLactate = 3.1;
    baseUrine = 22;
  } else if (selectedEtiology === 'ISOLATED_RV_FAILURE') {
    baseMap = 60;
    baseHr = 108;
    baseCi = 1.7;
    baseCvp = 21;
    basePad = 12;
    basePcwp = 9;
    baseSvr = 1500;
    baseSvO2 = 50;
    baseLactate = 3.8;
    baseUrine = 18;
  }

  // Effect of chest tube clotted or kinked in tamponade
  if (isTamponade && chestTubeClottedOrKinked) {
    baseMap -= 6;
    baseCi -= 0.2;
    baseCvp += 2;
    basePad += 1;
    basePcwp += 2;
    baseLactate += 0.8;
  }

  // Fluid bolus effect
  if (fluidBolusGivenMl > 0) {
    const volumeFactor = Math.min(1.0, fluidBolusGivenMl / 1000);
    if (isTamponade && decompressionReliefPct < 50) {
      baseMap += volumeFactor * 6;
      baseCvp += volumeFactor * 3;
      basePcwp += volumeFactor * 2;
      baseCi += volumeFactor * 0.15;
    } else if (selectedEtiology === 'ISOLATED_RV_FAILURE') {
      baseCvp += volumeFactor * 5;
      baseCi -= volumeFactor * 0.25;
      baseMap -= volumeFactor * 4;
    } else {
      baseMap += volumeFactor * 8;
      baseCi += volumeFactor * 0.4;
      baseCvp += volumeFactor * 2;
    }
  }

  // Inotropic / Vasopressor score effect
  if (inotropicVasopressorScore > 0) {
    const visFactor = Math.min(1.0, inotropicVasopressorScore / 40);
    baseMap += visFactor * 14;
    baseHr += visFactor * 12;
    baseSvr += visFactor * 250;
    if (!isTamponade || decompressionReliefPct > 50) {
      baseCi += visFactor * 0.5;
    }
  }

  // Mechanical PEEP effect
  if (mechanicalVentilationPeepCmH2O > 5) {
    const excessPeep = mechanicalVentilationPeepCmH2O - 5;
    baseCvp += excessPeep * 0.4;
    basePad += excessPeep * 0.3;
    basePcwp += excessPeep * 0.3;
    if (isTamponade && decompressionReliefPct < 50) {
      baseCi -= excessPeep * 0.04;
    }
  }

  // Resternotomy resolution
  if (decompressionReliefPct > 0 && isTamponade) {
    const reliefFraction = decompressionReliefPct / 100;
    baseMap = baseMap + (75 - baseMap) * reliefFraction;
    baseCi = baseCi + (2.7 - baseCi) * reliefFraction;
    baseHr = baseHr + (86 - baseHr) * reliefFraction;
    baseCvp = baseCvp + (10 - baseCvp) * reliefFraction;
    basePad = basePad + (12 - basePad) * reliefFraction;
    basePcwp = basePcwp + (11 - basePcwp) * reliefFraction;
    baseSvr = baseSvr + (1150 - baseSvr) * reliefFraction;
    baseSvO2 = baseSvO2 + (68 - baseSvO2) * reliefFraction;
    baseLactate = Math.max(1.2, baseLactate - reliefFraction * 2.8);
    baseUrine = baseUrine + (60 - baseUrine) * reliefFraction;
  }

  // Clamped final hemodynamics
  const meanArterialPressureMmHg = Math.round(Math.max(30, Math.min(130, baseMap)));
  const systolicBpMmHg = Math.round(meanArterialPressureMmHg * 1.35);
  const diastolicBpMmHg = Math.round(meanArterialPressureMmHg * 0.75);
  const heartRateBpm = Math.round(Math.max(40, Math.min(160, baseHr)));
  const cardiacIndexLMinM2 = Number(Math.max(0.8, Math.min(5.0, baseCi)).toFixed(2));
  const strokeVolumeIndexMlM2 = Math.round((cardiacIndexLMinM2 * 1000) / heartRateBpm);
  const systemicVascularResistanceDyns = Math.round(Math.max(300, Math.min(2500, baseSvr)));
  const mixedVenousOxygenSaturationPct = Math.round(Math.max(25, Math.min(90, baseSvO2)));
  const arterialLactateMmolL = Number(Math.max(0.8, Math.min(15.0, baseLactate)).toFixed(1));
  const urineOutputMlPerHour = Math.round(Math.max(0, Math.min(200, baseUrine)));

  // Pressures and equalization
  const centralVenousPressureCvpMmHg = Math.round(Math.max(2, Math.min(35, baseCvp)));
  const pulmonaryArteryDiastolicPadMmHg = Math.round(Math.max(4, Math.min(35, basePad)));
  const pulmonaryCapillaryWedgePressurePcwpMmHg = Math.round(Math.max(4, Math.min(35, basePcwp)));

  const diastolicPressureEqualizationGapMmHg = Math.abs(centralVenousPressureCvpMmHg - pulmonaryCapillaryWedgePressurePcwpMmHg);
  const isEqualizedDiastolicPressures =
    isTamponade &&
    decompressionReliefPct < 50 &&
    diastolicPressureEqualizationGapMmHg <= 4 &&
    centralVenousPressureCvpMmHg >= 15;

  let pulsusParadoxusMmHg = 0;
  let pulsusParadoxusBlunted = false;
  let pulsusParadoxusBluntedReason = "Normal respirophasic variation (< 10 mmHg).";

  if (isTamponade && decompressionReliefPct < 50) {
    if (preExistingLvHypertrophyOrStiffness || procedure === 'AVR_ASCENDING_AORTA' || selectedEtiology.startsWith('LOCALIZED')) {
      pulsusParadoxusMmHg = 4; // 4 mmHg: BLUNTED!
      pulsusParadoxusBlunted = true;
      pulsusParadoxusBluntedReason =
        "Pulsus paradoxus is blunted/absent (< 10 mmHg) due to localized atrial hematoma compression without circumferential constraint, open pericardium, post-CPB ventricular myocardial stiffness, and positive-pressure ventilation.";
    } else {
      pulsusParadoxusMmHg = 14;
      pulsusParadoxusBlunted = false;
      pulsusParadoxusBluntedReason = "Exaggerated pulsus paradoxus (> 10 mmHg) present due to circumferential pericardial constraint.";
    }
  } else {
    pulsusParadoxusMmHg = 4;
    pulsusParadoxusBlunted = false;
    pulsusParadoxusBluntedReason = "Physiological respirophasic arterial variation (< 10 mmHg).";
  }

  // CVP Waveform morphology
  let cvpMorph: PostOpTamponadeSimulationOutput['cvpWaveformMorphology'] = {
    xDescent: 'NORMAL',
    yDescent: 'NORMAL',
    description: 'Normal x and y descents on central venous pressure tracing.'
  };

  if (isTamponade && decompressionReliefPct < 50) {
    cvpMorph = {
      xDescent: 'PROMINENT_PRESERVED',
      yDescent: 'BLUNTED_ABSENT',
      description:
        'Loss of y descent (blunted passive ventricular diastolic filling due to external compression) with preserved/prominent systolic x descent. Pathognomonic for cardiac tamponade.'
    };
  } else if (selectedEtiology === 'RESTRICTIVE_VENTRICULAR_STIFFNESS') {
    cvpMorph = {
      xDescent: 'NORMAL',
      yDescent: 'PROMINENT_DEEP_DIP',
      description:
        'Prominent, sharp y descent with diastolic dip and plateau (square root sign). Distinguishes restrictive cardiomyopathy / constrictive physiology from tamponade.'
    };
  } else if (selectedEtiology === 'ISOLATED_RV_FAILURE') {
    cvpMorph = {
      xDescent: 'NORMAL',
      yDescent: 'PROMINENT_DEEP_DIP',
      description: "Elevated mean CVP with giant v waves and prominent y descent from severe tricuspid regurgitation and RV volume overload."
    };
  }

  // Imaging Evaluation (TTE vs TEE)
  let diagnosticQuality: PostOpTamponadeSimulationOutput['imagingFindings']['diagnosticQuality'] = 'NOT_PERFORMED';
  let acousticShadowingPresent = false;
  let pericardialSpaceVisualization: PostOpTamponadeSimulationOutput['imagingFindings']['pericardialSpaceVisualization'] = 'NOT_EVALUATED';
  let localizedHematomaDetected = false;
  let hematomaLocation: PostOpTamponadeSimulationOutput['imagingFindings']['hematomaLocation'] = 'NONE';
  let hematomaSizeCm = 0;
  let raInversionPct = 0;
  let rvCollapse = false;
  let laCollapse = false;
  let mitralVarPct = 8;
  let tricuspidVarPct = 12;
  let deepTransgastricResult = 'Not imaged.';
  let echoSummary = 'No echocardiographic study performed yet.';

  if (imagingPerformed === 'TTE_BEDSIDE') {
    diagnosticQuality = 'POOR_ACOUSTIC_WINDOW';
    acousticShadowingPresent = true;
    pericardialSpaceVisualization = 'INADEQUATE_MISSED_POSTERIOR';

    if (selectedEtiology === 'CIRCUMFERENTIAL_HEMOPERICARDIUM') {
      localizedHematomaDetected = true;
      hematomaLocation = 'CIRCUMFERENTIAL';
      hematomaSizeCm = 2.2;
      raInversionPct = 35;
      rvCollapse = true;
      echoSummary =
        'Bedside TTE: Moderate anterior and lateral pericardial effusion identified despite poor acoustic window. RV diastolic collapse visualized. TEE recommended for comprehensive assessment.';
    } else if (isTamponade) {
      localizedHematomaDetected = false;
      hematomaLocation = 'NONE';
      hematomaSizeCm = 0;
      echoSummary =
        'Bedside TTE FALSE NEGATIVE WARNING: Suboptimal acoustic windows due to sternotomy wires, mediastinal air, and chest dressings. No anterior effusion seen. Posterior mediastinal and left atrial spaces are obscured by acoustic shadows. TEE IS MANDATORY TO EXCLUDE LOCALIZED TAMPONADE.';
    } else if (selectedEtiology === 'ISOLATED_RV_FAILURE') {
      echoSummary = "Bedside TTE: Markedly dilated right ventricle with flattened interventricular septum (D-shaped LV in short axis). No significant pericardial fluid.";
    } else {
      echoSummary = 'Bedside TTE: Poor subcostal and parasternal acoustic windows. No large anterior pericardial fluid collection.';
    }
  } else if (imagingPerformed === 'TEE_COMPREHENSIVE') {
    diagnosticQuality = 'EXCELLENT_ACOUSTIC_WINDOW';
    acousticShadowingPresent = false;
    pericardialSpaceVisualization = 'CLEARLY_VISUALIZED';

    if (selectedEtiology === 'LOCALIZED_POSTERIOR_LA_HEMATOMA') {
      localizedHematomaDetected = true;
      hematomaLocation = 'POSTERIOR_LEFT_ATRIUM';
      hematomaSizeCm = 4.8;
      laCollapse = true;
      mitralVarPct = 18;
      deepTransgastricResult = 'Deep transgastric short/long-axis view confirms dense, organized echogenic hematoma (4.8 x 3.2 cm) compressing posterior left atrium and pulmonary venous confluence.';
      echoSummary =
        'Comprehensive TEE: LARGE LOCALIZED POSTERIOR LEFT ATRIAL HEMATOMA causing severe systolic and diastolic LA compression, pulmonary venous flow obstruction (blunted S and D waves on PV Doppler), and low cardiac output. Urgent resternotomy indicated.';
    } else if (selectedEtiology === 'LOCALIZED_POSTERIOR_RA_HEMATOMA') {
      localizedHematomaDetected = true;
      hematomaLocation = 'POSTERIOR_RIGHT_ATRIUM';
      hematomaSizeCm = 5.2;
      raInversionPct = 65;
      rvCollapse = true;
      deepTransgastricResult = 'Bicaval and transgastric views demonstrate 5.2 cm organized loculated hematoma severely compressing the RA free wall and obstructing superior/inferior vena cava inflow.';
      echoSummary =
        'Comprehensive TEE: MASSIVE LOCALIZED RIGHT ATRIAL HEMATOMA with > 50% right atrial chamber collapse, IVC plethora, and hepatic vein diastolic flow reversal. High-grade inflow obstruction.';
    } else if (selectedEtiology === 'CIRCUMFERENTIAL_HEMOPERICARDIUM') {
      localizedHematomaDetected = true;
      hematomaLocation = 'CIRCUMFERENTIAL';
      hematomaSizeCm = 2.8;
      raInversionPct = 50;
      rvCollapse = true;
      laCollapse = true;
      deepTransgastricResult = 'Circumferential dense fluid and thrombus compressing all 4 chambers.';
      echoSummary = 'Comprehensive TEE: Circumferential tense hemopericardium with biventricular and biatrial diastolic collapse.';
    } else if (selectedEtiology === 'RESTRICTIVE_VENTRICULAR_STIFFNESS') {
      localizedHematomaDetected = false;
      hematomaLocation = 'NONE_DIFFUSE_STIFFNESS';
      deepTransgastricResult = "Concentric left ventricular hypertrophy with severe diastolic dysfunction (E/e ratio 22, e prime 4 cm/s). No pericardial clot or chamber collapse.";
      echoSummary =
        'Comprehensive TEE: Excludes pericardial hematoma. Severe myocardial diastolic stiffness / restrictive filling pattern with preserved chamber volumes and no external compression.';
    } else if (selectedEtiology === 'POST_CPB_VASOPLEGIA') {
      localizedHematomaDetected = false;
      deepTransgastricResult = 'Hyperdynamic biventricular systolic function with end-systolic cavity obliteration. Completely empty pericardial space.';
      echoSummary = 'Comprehensive TEE: No pericardial effusion. Hyperdynamic LV (EF > 70%) with severe underfilling consistent with profound vasoplegia / low SVR.';
    } else if (selectedEtiology === 'ISOLATED_RV_FAILURE') {
      localizedHematomaDetected = false;
      deepTransgastricResult = "Severe RV free wall hypokinesis (TAPSE 7 mm, RV S prime 5 cm/s) with prominent systolic septal shift into LV.";
      echoSummary = 'Comprehensive TEE: Acute RV failure and cor pulmonale without external pericardial compression.';
    }
  }

  // Drainage Safety Alert
  let chestDrainManagementSafetyAlert: string | undefined = undefined;
  if (drainMilkingOrStrippingAttempted) {
    chestDrainManagementSafetyAlert =
      'CONTROVERSIAL / HAZARDOUS MANEUVER: Aggressive chest tube stripping generates transient extreme negative intrathoracic pressures (up to -300 to -400 cmH2O), which can disrupt coronary artery bypass anastomoses, provoke fresh hemorrhage, or invert lung tissue without successfully dislodging deep loculated mediastinal hematomas. Gentle tapping or sterile tube clearance is preferred, but sudden cessation of drainage requires imaging/exploration rather than vigorous stripping.';
    alerts.push({
      level: 'WARNING',
      message: 'Chest Tube Stripping Hazard',
      rationale: chestDrainManagementSafetyAlert
    });
  }

  // Clinical Alerts
  if (chestTubeClottedOrKinked && chestTubeDrainageRateMlPerHour <= 20 && isTamponade) {
    alerts.push({
      level: 'CRITICAL',
      message: 'Sudden Cessation of Chest Tube Drainage: Occult Tamponade Warning',
      rationale:
        'A sudden drop in previously active chest drain output (< 20 mL/h) combined with rising filling pressures (CVP >= 18 mmHg) and escalating vasopressor requirements strongly signals CLOTTED TUBES and occult blood accumulation in the mediastinum.'
    });
  }

  if (isEqualizedDiastolicPressures) {
    alerts.push({
      level: 'CRITICAL',
      message: 'Equalization of Diastolic Pressures (CVP ≈ PAD ≈ PCWP)',
      rationale: `CVP (${centralVenousPressureCvpMmHg} mmHg), PAD (${pulmonaryArteryDiastolicPadMmHg} mmHg), and PCWP (${pulmonaryCapillaryWedgePressurePcwpMmHg} mmHg) are equalized within ${diastolicPressureEqualizationGapMmHg} mmHg. Equalization of end-diastolic pressures in low cardiac output state is a hallmark of cardiac compression.`
    });
  }

  if (pulsusParadoxusBlunted && isTamponade) {
    alerts.push({
      level: 'WARNING',
      message: 'Blunted Pulsus Paradoxus in Post-Op Cardiac Surgery',
      rationale:
        'Do not be misled by a normal or low pulsus paradoxus (here only ' +
        pulsusParadoxusMmHg +
        ' mmHg). Post-CPB myocardial stiffness, positive-pressure mechanical ventilation, and localized posterior compression mask classic respirophasic arterial variation.'
    });
  }

  if (imagingPerformed === 'TTE_BEDSIDE' && isTamponade && !localizedHematomaDetected) {
    alerts.push({
      level: 'CRITICAL',
      message: 'False Negative Bedside TTE Pitfall',
      rationale:
        'Transthoracic echocardiography has poor sensitivity (< 50%) after cardiac surgery. Sternal wires, mediastinal air, and dressings block the acoustic window. A negative TTE must NEVER be used to rule out post-operative cardiac tamponade.'
    });
  }

  // Emergency Resternotomy Decision
  let emergencyResternotomyIndicated = false;
  let resternotomyUrgency: PostOpTamponadeSimulationOutput['resternotomyUrgency'] = 'NONE';
  let hemodynamicRecoveryScore = 20;

  if (isTamponade) {
    if (decompressionReliefPct >= 95) {
      emergencyResternotomyIndicated = false;
      resternotomyUrgency = 'NONE';
      hemodynamicRecoveryScore = 95;
      alerts.push({
        level: 'SUCCESS',
        message: 'Resternotomy Completed: Hemodynamics Restored',
        rationale:
          'Sternal wires opened, Finochietto retractor placed, and localized hematoma evacuated. Stroke volume index and cardiac index have rebounded, restoring tissue perfusion.'
      });
    } else if (decompressionReliefPct === 40) {
      emergencyResternotomyIndicated = true;
      resternotomyUrgency = 'IMMEDIATE_BEDSIDE_CALS_RESTERNOTOMY';
      hemodynamicRecoveryScore = 55;
      alerts.push({
        level: 'WARNING',
        message: 'CALS Protocol Active: Complete Sternal Retraction Required',
        rationale:
          'Skin opened and wires cut. Clot evacuation and insertion of Finochietto retractor are immediately required to relieve deep posterior compression.'
      });
    } else {
      emergencyResternotomyIndicated = true;
      if (cardiacIndexLMinM2 < 1.6 || meanArterialPressureMmHg < 55 || arterialLactateMmolL >= 4.0) {
        resternotomyUrgency = 'IMMEDIATE_BEDSIDE_CALS_RESTERNOTOMY';
        alerts.push({
          level: 'CRITICAL',
          message: 'CRITICAL INDICATION FOR EMERGENCY BEDSIDE RESTERNOTOMY',
          rationale:
            'Society of Thoracic Surgeons (STS) / CALS criteria met: Refractory LCOS, equalized filling pressures, clotted drains, or localized compression on TEE. Do not delay for operating room transport if in arrest or moribund shock!'
        });
      } else {
        resternotomyUrgency = 'URGENT_OR_REEXPLORATION';
      }
    }
  } else {
    hemodynamicRecoveryScore = selectedEtiology === 'POST_CPB_VASOPLEGIA' ? 50 : 60;
  }

  // Differential Diagnosis Matrix
  let diffDiag: PostOpTamponadeSimulationOutput['differentialDiagnosisMatrix'];
  if (isTamponade) {
    diffDiag = {
      diagnosis: 'POST_OP_TAMPONADE',
      confidencePct: imagingPerformed === 'TEE_COMPREHENSIVE' ? 98 : 88,
      keyDistinguishingFeatures: [
        'Equalized diastolic pressures (CVP ≈ PAD ≈ PCWP within 4 mmHg)',
        'Loss of y descent on CVP tracing with preserved x descent',
        'Sudden drop or cessation in chest tube drainage (clotted drain)',
        'Blunted pulsus paradoxus due to localized posterior compression and stiff myocardium',
        'Diagnostic gold standard: TEE reveals localized posterior hematoma compressing RA or LA'
      ],
      recommendedManagement:
        'Immediate emergency resternotomy / re-exploration (bedside CALS protocol if in arrest or profound shock), clot evacuation, and surgical hemostasis.'
    };
  } else if (selectedEtiology === 'RESTRICTIVE_VENTRICULAR_STIFFNESS') {
    diffDiag = {
      diagnosis: 'RESTRICTIVE_PHYSIOLOGY',
      confidencePct: 92,
      keyDistinguishingFeatures: [
        'Elevated CVP and PCWP with PROMINENT y descent (dip and plateau / square root sign)',
        'No localized hematoma or chamber collapse on comprehensive TEE',
        'Severely reduced tissue Doppler mitral annular velocities (e prime < 5 cm/s)',
        'Normal or patent chest tube drainage without acute cessation'
      ],
      recommendedManagement:
        'Avoid resternotomy (futile). Inotropic / lusitropic support with Milrinone or Levosimendan, maintain sinus rhythm, judicious diuresis, and afterload reduction.'
    };
  } else if (selectedEtiology === 'POST_CPB_VASOPLEGIA') {
    diffDiag = {
      diagnosis: 'VASOPLEGIA',
      confidencePct: 95,
      keyDistinguishingFeatures: [
        'Profoundly low systemic vascular resistance (SVR < 600 dyn·s/cm5)',
        'Preserved or elevated Cardiac Index (CI > 3.0 L/min/m2) and SvO2 > 70%',
        'Low or normal CVP and PCWP with warm, hyperemic extremities',
        'TEE confirms hyperdynamic ventricles without pericardial effusion'
      ],
      recommendedManagement:
        'Vasopressin infusion (0.03-0.04 U/min), Norepinephrine titration, Methylene Blue (1.5-2.0 mg/kg IV) or Hydroxocobalamin (5g IV) for refractory vasoplegia.'
    };
  } else if (selectedEtiology === 'ISOLATED_RV_FAILURE') {
    diffDiag = {
      diagnosis: 'ISOLATED_RV_FAILURE',
      confidencePct: 94,
      keyDistinguishingFeatures: [
        'Markedly elevated CVP (>= 18 mmHg) with LOW or normal PCWP (gradient > 8-10 mmHg)',
        'Severe RV chamber dilation and septal shift (D-shaped LV) on TEE',
        'Low pulmonary artery pulsatility index (PAPi < 1.0)',
        'No localized LA or RA hematoma'
      ],
      recommendedManagement:
        'Inhaled pulmonary vasodilators (iNO 20 ppm or inhaled epoprostenol), RV inotrope (Milrinone/Epinephrine), maintain MAP for RV perfusion, avoid fluid overloading.'
    };
  } else {
    diffDiag = {
      diagnosis: 'HYPOVOLEMIA',
      confidencePct: 90,
      keyDistinguishingFeatures: [
        'Low CVP (< 6 mmHg) and low PCWP (< 8 mmHg)',
        'High active chest tube drainage if post-op hemorrhage',
        'Responsive to fluid challenge with MAP and CI increase'
      ],
      recommendedManagement: 'Balanced crystalloid or blood component transfusion targeted to TEG/ROTEM.'
    };
  }

  return {
    meanArterialPressureMmHg,
    systolicBpMmHg,
    diastolicBpMmHg,
    heartRateBpm,
    cardiacIndexLMinM2,
    strokeVolumeIndexMlM2,
    systemicVascularResistanceDyns,
    mixedVenousOxygenSaturationPct,
    arterialLactateMmolL,
    urineOutputMlPerHour,
    centralVenousPressureCvpMmHg,
    pulmonaryArteryDiastolicPadMmHg,
    pulmonaryCapillaryWedgePressurePcwpMmHg,
    diastolicPressureEqualizationGapMmHg,
    isEqualizedDiastolicPressures,
    pulsusParadoxusMmHg,
    pulsusParadoxusBlunted,
    pulsusParadoxusBluntedReason,
    cvpWaveformMorphology: cvpMorph,
    imagingFindings: {
      modalityUsed: imagingPerformed,
      diagnosticQuality,
      acousticShadowingPresent,
      pericardialSpaceVisualization,
      localizedHematomaDetected,
      hematomaLocation,
      hematomaSizeCm,
      chamberCollapse: {
        rightAtrialInversionDiastolicPct: raInversionPct,
        rightVentricularDiastolicCollapse: rvCollapse,
        leftAtrialCollapse: laCollapse
      },
      mitralInflowRespiratoryVariationPct: mitralVarPct,
      tricuspidInflowRespiratoryVariationPct: tricuspidVarPct,
      teeDeepTransgastricViewResult: deepTransgastricResult,
      clinicalEchoSummary: echoSummary
    },
    emergencyResternotomyIndicated,
    resternotomyUrgency,
    hemodynamicRecoveryScore,
    chestDrainManagementSafetyAlert,
    clinicalAlerts: alerts,
    differentialDiagnosisMatrix: diffDiag
  };
}
