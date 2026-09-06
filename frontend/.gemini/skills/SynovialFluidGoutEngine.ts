/**
 * SynovialFluidGoutEngine.ts
 * Biophysical & Diagnostic Engine for Arthrocentesis, Compensated Polarized Light Microscopy (CPLM),
 * ACR/EULAR 2015 Gout Classification, CPPD Pseudogout, and Precision Pharmacotherapy.
 * Location: frontend/.gemini/skills/SynovialFluidGoutEngine.ts
 */

export type CrystalType =
  | 'MONOSODIUM_URATE' // MSU - Gout (needle-shaped, strong negative birefringence)
  | 'CALCIUM_PYROPHOSPHATE' // CPPD - Pseudogout (rhomboid/rod, weak positive birefringence)
  | 'BASIC_CALCIUM_PHOSPHATE' // BCP / Hydroxyapatite (non-birefringent, Alizarin red +)
  | 'CHOLESTEROL' // Notched rectangular plates
  | 'NONE';

export type SynovialFluidClarity =
  | 'CLEAR_TRANSPARENT'
  | 'TRANSLUCENT_CLOUDY'
  | 'OPAQUE_PURULENT'
  | 'BLOODY_HEMARTHROTIC';

export type ArthrocentesisCategory =
  | 'NORMAL' // <200 WBC, <25% PMN
  | 'NON_INFLAMMATORY' // 200 - 2,000 WBC, <50% PMN (Osteoarthritis, trauma)
  | 'INFLAMMATORY' // 2,000 - 50,000 WBC, >50% PMN (Crystal arthritis, RA)
  | 'SEPTIC_OR_EXTREME_INFLAMMATORY'; // >50,000 WBC, >90% PMN (Bacterial infection)

export interface SynovialFluidAnalysisInput {
  volumeMl: number;
  clarity: SynovialFluidClarity;
  color: string;
  wbcCountPerMm3: number;
  neutrophilPercent: number; // % PMN
  rbcCountPerMm3: number;
  glucoseMgDl: number;
  serumGlucoseMgDl: number;
  viscosityStringCm: number; // Normal string test > 3-5 cm, inflammatory < 3 cm
  gramStainPositive: boolean;
  bacterialCulturePositive: boolean;
  crystalIdentified: CrystalType;
}

export interface CompensatedPolarizedMicroscopyState {
  crystalType: CrystalType;
  compensatorPlateInserted: boolean; // First-order Red Compensator (lambda = 530 nm gypsum plate)
  crystalOrientationAngleDeg: number; // 0 to 180 degrees relative to slow axis (45 deg)
  slowAxisAngleDeg: number; // Standard 45 degrees (South-West to North-East)
}

export interface CrystalOpticalPhenotype {
  crystalName: string;
  morphology: string;
  birefringenceType: 'STRONGLY_NEGATIVE' | 'WEAKLY_POSITIVE' | 'NON_BIREFRINGENT' | 'VARIABLE';
  colorParallelToSlowAxis: 'VIVID_YELLOW' | 'PALE_BLUE' | 'TRANSPARENT_PINK' | 'POLYCHROMATIC';
  colorPerpendicularToSlowAxis: 'VIVID_BLUE' | 'PALE_YELLOW' | 'TRANSPARENT_PINK' | 'POLYCHROMATIC';
  observedColorAtAngle: string;
  opticalMechanismExplanation: string;
}

export interface AcrEularGoutCriteriaInput {
  symptomPattern: 'FIRST_MTP_PODAGRA' | 'ANKLE_OR_MIDFOOT' | 'OTHER_JOINT';
  characteristicEpisodesCount: number; // Erythema, exquisite tenderness, difficulty walking (0, 1, 2, or 3 features)
  timeCourseTypical: boolean; // Max pain < 24h, resolution < 14d, complete intercritical recovery
  clinicalTophusPresent: boolean;
  serumUrateMgDl: number;
  msuCrystalInSynovialFluid: boolean | null; // null if not aspirated; true = SUFFICIENT CRITERION
  imagingUrateDeposition: boolean; // Ultrasound double contour sign or DECT positive
  imagingErosion: boolean; // Plain radiograph gout erosion with overhanging edge
}

export interface AcrEularGoutScoreResult {
  isSufficientCriterionMet: boolean; // Presence of MSU in symptomatic joint or tophus satisfies diagnosis immediately
  totalScore: number;
  thresholdMet: boolean; // Score >= 8
  probabilityOfGout: 'DEFINITIVE_GOUT' | 'VERY_HIGH' | 'HIGH' | 'INTERMEDIATE' | 'LOW';
  subscores: {
    clinicalJointPattern: number;
    characteristicsOfEpisode: number;
    timeCourse: number;
    tophus: number;
    serumUrate: number;
    synovialFluidMsu: number;
    imagingDeposition: number;
    imagingErosion: number;
  };
  recommendation: string;
}

export interface PatientRenalComorbidity {
  eGfrMlMin: number;
  hasActivePepticUlcer: boolean;
  hasSevereHeartFailure: boolean;
  isTakingStrongCyp3a4OrPgpInhibitor: boolean;
  hlaB5801Positive: boolean;
}

export interface GoutTherapyRegimen {
  acuteAgent: 'COLCHICINE' | 'NSAID_NAPROXEN' | 'SYSTEMIC_PREDNISONE' | 'INTRA_ARTICULAR_TRIAMCINOLONE' | 'ANAKINRA_IL1';
  acuteDosing: string;
  acuteContraindications: string[];
  ultDrug: 'ALLOPURINOL' | 'FEBUXOSTAT' | 'NONE_CURRENTLY';
  ultStartingDoseMg: number;
  ultTargetSerumUrateMgDl: number;
  ultProphylaxisDose: string;
  safetyAlerts: string[];
}

/**
 * 1. Categorize Synovial Fluid Arthrocentesis
 */
export function categorizeSynovialFluid(fluid: SynovialFluidAnalysisInput): {
  category: ArthrocentesisCategory;
  glucoseRatio: number;
  isSepticSuspicionHigh: boolean;
  clinicalInterpretation: string;
  differentialDiagnoses: string[];
} {
  const glucoseRatio = fluid.serumGlucoseMgDl > 0 ? +(fluid.glucoseMgDl / fluid.serumGlucoseMgDl).toFixed(2) : 1.0;
  let category: ArthrocentesisCategory = 'NORMAL';

  if (fluid.wbcCountPerMm3 < 200 && fluid.neutrophilPercent < 25) {
    category = 'NORMAL';
  } else if (fluid.wbcCountPerMm3 < 2000 && fluid.neutrophilPercent < 50) {
    category = 'NON_INFLAMMATORY';
  } else if (fluid.wbcCountPerMm3 <= 50000) {
    category = 'INFLAMMATORY';
  } else {
    category = 'SEPTIC_OR_EXTREME_INFLAMMATORY';
  }

  // Septic risk check
  const isSepticSuspicionHigh =
    fluid.gramStainPositive ||
    fluid.bacterialCulturePositive ||
    (fluid.wbcCountPerMm3 > 50000 && fluid.neutrophilPercent >= 85) ||
    (glucoseRatio < 0.5 && fluid.wbcCountPerMm3 > 25000);

  const differentials: string[] = [];
  if (isSepticSuspicionHigh) differentials.push('Septic Arthritis (S. aureus, N. gonorrhoeae, Streptococcus)');
  if (fluid.crystalIdentified === 'MONOSODIUM_URATE') differentials.push('Acute Gouty Arthritis');
  if (fluid.crystalIdentified === 'CALCIUM_PYROPHOSPHATE') differentials.push('Calcium Pyrophosphate Dihydrate (CPPD) / Pseudogout');
  if (category === 'INFLAMMATORY' && !differentials.length) differentials.push('Rheumatoid Arthritis', 'Reactive Arthritis', 'Psoriatic Arthritis');
  if (category === 'NON_INFLAMMATORY') differentials.push('Osteoarthritis', 'Traumatic internal joint derangement');

  let clinicalInterpretation = '';
  if (isSepticSuspicionHigh) {
    clinicalInterpretation =
      'CRITICAL: High suspicion for Septic Arthritis. Even if crystals are present, co-existent infection occurs in up to 5% of acute crystal flares. Immediate joint washout/drainage and empirical IV antibiotics indicated.';
  } else if (fluid.crystalIdentified === 'MONOSODIUM_URATE') {
    clinicalInterpretation =
      'Inflammatory joint fluid with Monosodium Urate (MSU) crystals. Pathognomonic for Acute Gouty Arthritis.';
  } else if (fluid.crystalIdentified === 'CALCIUM_PYROPHOSPHATE') {
    clinicalInterpretation =
      'Inflammatory joint fluid with Calcium Pyrophosphate (CPPD) crystals. Pathognomonic for Acute CPPD Arthritis (Pseudogout).';
  } else if (category === 'INFLAMMATORY') {
    clinicalInterpretation =
      'Inflammatory arthrocentesis without identified crystals. Evaluate for seronegative spondyloarthropathy, rheumatoid arthritis, or early infection.';
  } else {
    clinicalInterpretation =
      'Non-inflammatory synovial fluid. Consistent with osteoarthritis, mechanical cartilage breakdown, or healing trauma.';
  }

  return {
    category,
    glucoseRatio,
    isSepticSuspicionHigh,
    clinicalInterpretation,
    differentialDiagnoses: differentials,
  };
}

/**
 * 2. Compensated Polarized Light Microscopy (CPLM) Optics Solver
 * Simulates the gypsum 530nm red compensator plate.
 */
export function evaluateCrystalMicroscopy(
  crystal: CrystalType,
  crystalAngleDeg: number, // 0 to 180 deg. Slow axis is at 45 deg.
  compensatorInserted: boolean
): CrystalOpticalPhenotype {
  // Normalize angle relative to slow axis (45 deg)
  const slowAxis = 45;
  // Angular difference between crystal long axis and slow axis
  const diffAngle = Math.abs((crystalAngleDeg - slowAxis + 180) % 180);
  const isParallel = diffAngle <= 25 || diffAngle >= 155;
  const isPerpendicular = Math.abs(diffAngle - 90) <= 25;

  if (crystal === 'MONOSODIUM_URATE') {
    let observedColor = '#facc15'; // Default bright yellow
    if (!compensatorInserted) {
      observedColor = '#ffffff'; // White/glowing birefringence without compensator
    } else if (isParallel) {
      observedColor = '#eab308'; // Intense Yellow (subtractive phase retardation)
    } else if (isPerpendicular) {
      observedColor = '#3b82f6'; // Intense Royal Blue (additive phase retardation)
    } else {
      observedColor = '#ec4899'; // Magenta / pink background transition
    }

    return {
      crystalName: 'Monosodium Urate (MSU)',
      morphology: 'Needle-shaped (acicular) crystals with sharp pointed ends, often intracellular within neutrophils.',
      birefringenceType: 'STRONGLY_NEGATIVE',
      colorParallelToSlowAxis: 'VIVID_YELLOW',
      colorPerpendicularToSlowAxis: 'VIVID_BLUE',
      observedColorAtAngle: observedColor,
      opticalMechanismExplanation:
        'MSU has negative birefringence (fast refractive index parallel to long axis). When aligned parallel to the gypsum slow axis, destructive optical interference subtracts 530nm wave-shift, producing Yellow. When perpendicular, constructive wave addition produces Blue.',
    };
  }

  if (crystal === 'CALCIUM_PYROPHOSPHATE') {
    let observedColor = '#60a5fa'; // Pale blue
    if (!compensatorInserted) {
      observedColor = '#d1d5db'; // Faint white
    } else if (isParallel) {
      observedColor = '#38bdf8'; // Pale Sky Blue (additive phase retardation)
    } else if (isPerpendicular) {
      observedColor = '#fde047'; // Pale Yellow (subtractive phase retardation)
    } else {
      observedColor = '#f472b6'; // Pale Magenta / background
    }

    return {
      crystalName: 'Calcium Pyrophosphate Dihydrate (CPPD)',
      morphology: 'Rhomboid, rectangular, or short rod-shaped crystals with blunt or geometric corners.',
      birefringenceType: 'WEAKLY_POSITIVE',
      colorParallelToSlowAxis: 'PALE_BLUE',
      colorPerpendicularToSlowAxis: 'PALE_YELLOW',
      observedColorAtAngle: observedColor,
      opticalMechanismExplanation:
        'CPPD exhibits positive birefringence (slow refractive index parallel to long axis). When aligned parallel to the red plate slow axis, wave speeds sum additively, producing Blue. When perpendicular, subtractive interference yields Yellow.',
    };
  }

  if (crystal === 'BASIC_CALCIUM_PHOSPHATE') {
    return {
      crystalName: 'Basic Calcium Phosphate (BCP / Hydroxyapatite)',
      morphology: 'Submicroscopic amorphous globular clumps (1-5 µm) visible only with Alizarin Red S or electron microscopy.',
      birefringenceType: 'NON_BIREFRINGENT',
      colorParallelToSlowAxis: 'TRANSPARENT_PINK',
      colorPerpendicularToSlowAxis: 'TRANSPARENT_PINK',
      observedColorAtAngle: '#f43f5e',
      opticalMechanismExplanation:
        'Basic calcium phosphate crystals are too small to resolve individual optical lattice indices under light microscopy and lack birefringence under polarized light.',
    };
  }

  if (crystal === 'CHOLESTEROL') {
    return {
      crystalName: 'Cholesterol Crystals',
      morphology: 'Large flat rectangular or notched plates (notched corners). Chronic bursal fluid.',
      birefringenceType: 'VARIABLE',
      colorParallelToSlowAxis: 'POLYCHROMATIC',
      colorPerpendicularToSlowAxis: 'POLYCHROMATIC',
      observedColorAtAngle: '#a855f7',
      opticalMechanismExplanation:
        'Cholesterol crystals exhibit variable or multi-colored birefringence due to layered lipid crystallization in chronic effusions.',
    };
  }

  return {
    crystalName: 'No Crystals Identified',
    morphology: 'Acellular or inflammatory debris without crystalline arrays.',
    birefringenceType: 'NON_BIREFRINGENT',
    colorParallelToSlowAxis: 'TRANSPARENT_PINK',
    colorPerpendicularToSlowAxis: 'TRANSPARENT_PINK',
    observedColorAtAngle: '#ec4899',
    opticalMechanismExplanation: 'Gypsum first-order compensator background magenta (530 nm retardation).',
  };
}

/**
 * 3. 2015 ACR/EULAR Gout Classification Score Calculator
 */
export function calculateAcrEularGoutScore(input: AcrEularGoutCriteriaInput): AcrEularGoutScoreResult {
  // SUFFICIENT CRITERION: Demonstration of MSU crystals in a symptomatic joint/bursa or tophus
  if (input.msuCrystalInSynovialFluid === true) {
    return {
      isSufficientCriterionMet: true,
      totalScore: 23,
      thresholdMet: true,
      probabilityOfGout: 'DEFINITIVE_GOUT',
      subscores: {
        clinicalJointPattern: 3,
        characteristicsOfEpisode: 3,
        timeCourse: 2,
        tophus: 4,
        serumUrate: 4,
        synovialFluidMsu: 3,
        imagingDeposition: 4,
        imagingErosion: 4,
      },
      recommendation:
        'Definitive Gout (MSU crystal verified). Meets ACR/EULAR 2015 Sufficient Criterion without requiring clinical scoring threshold.',
    };
  }

  const subscores = {
    clinicalJointPattern: 0,
    characteristicsOfEpisode: 0,
    timeCourse: 0,
    tophus: 0,
    serumUrate: 0,
    synovialFluidMsu: 0,
    imagingDeposition: 0,
    imagingErosion: 0,
  };

  // 1. Joint Pattern
  if (input.symptomPattern === 'FIRST_MTP_PODAGRA') {
    subscores.clinicalJointPattern = 3;
  } else if (input.symptomPattern === 'ANKLE_OR_MIDFOOT') {
    subscores.clinicalJointPattern = 2;
  } else {
    subscores.clinicalJointPattern = 1;
  }

  // 2. Characteristics of symptomatic episode (0, 1, 2, or 3)
  if (input.characteristicEpisodesCount === 1) subscores.characteristicsOfEpisode = 1;
  else if (input.characteristicEpisodesCount === 2) subscores.characteristicsOfEpisode = 2;
  else if (input.characteristicEpisodesCount >= 3) subscores.characteristicsOfEpisode = 3;

  // 3. Time-course of episode
  if (input.timeCourseTypical) {
    subscores.timeCourse = 2;
  }

  // 4. Clinical Tophus
  if (input.clinicalTophusPresent) {
    subscores.tophus = 4;
  }

  // 5. Serum Urate
  if (input.serumUrateMgDl < 4.0) {
    subscores.serumUrate = -4; // Subtracted
  } else if (input.serumUrateMgDl < 6.0) {
    subscores.serumUrate = 0;
  } else if (input.serumUrateMgDl < 8.0) {
    subscores.serumUrate = 2;
  } else if (input.serumUrateMgDl < 10.0) {
    subscores.serumUrate = 3;
  } else {
    subscores.serumUrate = 4;
  }

  // 6. Synovial Fluid MSU (if tested and negative)
  if (input.msuCrystalInSynovialFluid === false) {
    subscores.synovialFluidMsu = -2;
  }

  // 7. Imaging: Ultrasound or DECT urate deposition
  if (input.imagingUrateDeposition) {
    subscores.imagingDeposition = 4;
  }

  // 8. Imaging: Gout-related erosions on plain radiography
  if (input.imagingErosion) {
    subscores.imagingErosion = 4;
  }

  const totalScore = Object.values(subscores).reduce((acc, curr) => acc + curr, 0);
  const thresholdMet = totalScore >= 8;

  let probabilityOfGout: 'DEFINITIVE_GOUT' | 'VERY_HIGH' | 'HIGH' | 'INTERMEDIATE' | 'LOW' = 'LOW';
  if (totalScore >= 12) probabilityOfGout = 'VERY_HIGH';
  else if (totalScore >= 8) probabilityOfGout = 'HIGH';
  else if (totalScore >= 5) probabilityOfGout = 'INTERMEDIATE';
  else probabilityOfGout = 'LOW';

  let recommendation = '';
  if (thresholdMet) {
    recommendation = `Score: ${totalScore} (Threshold >= 8 met). Classifies as Gout according to 2015 ACR/EULAR criteria. Initiate flare management and evaluate for urate-lowering therapy.`;
  } else {
    recommendation = `Score: ${totalScore} (Below threshold of 8). Unlikely to be gout or indeterminate. Re-evaluate serum urate after acute flare subsides and search for alternate diagnoses.`;
  }

  return {
    isSufficientCriterionMet: false,
    totalScore,
    thresholdMet,
    probabilityOfGout,
    subscores,
    recommendation,
  };
}

/**
 * 4. Precision Pharmacotherapy Solver for Acute Flare & Urate Lowering
 */
export function formulateGoutTherapyPlan(
  serumUrateMgDl: number,
  hasTophi: boolean,
  renalAndComorbidities: PatientRenalComorbidity
): GoutTherapyRegimen {
  const contraindications: string[] = [];
  const alerts: string[] = [];

  // Target Urate: < 6.0 mg/dL (< 360 µmol/L) standard, < 5.0 mg/dL (< 300 µmol/L) if tophaceous
  const ultTargetSerumUrateMgDl = hasTophi ? 5.0 : 6.0;

  // Evaluate Acute Flare Agent
  let acuteAgent: GoutTherapyRegimen['acuteAgent'] = 'COLCHICINE';
  let acuteDosing = '1.2 mg PO stat, followed by 0.6 mg 1 hour later, then 0.6 mg daily or BID.';

  const isColchicineContraindicated =
    (renalAndComorbidities.eGfrMlMin < 30 && renalAndComorbidities.isTakingStrongCyp3a4OrPgpInhibitor) ||
    renalAndComorbidities.eGfrMlMin < 15;

  const isNsaidContraindicated =
    renalAndComorbidities.eGfrMlMin < 45 ||
    renalAndComorbidities.hasActivePepticUlcer ||
    renalAndComorbidities.hasSevereHeartFailure;

  if (isColchicineContraindicated) {
    contraindications.push('Colchicine contraindicated due to severe renal impairment (eGFR < 15 or eGFR < 30 with CYP3A4/P-gp inhibitor).');
  }

  if (isNsaidContraindicated) {
    contraindications.push('NSAIDs contraindicated due to CKD (eGFR < 45), active peptic ulcer disease, or heart failure.');
  }

  if (!isColchicineContraindicated && renalAndComorbidities.eGfrMlMin >= 30) {
    acuteAgent = 'COLCHICINE';
    if (renalAndComorbidities.eGfrMlMin < 50) {
      acuteDosing = '1.2 mg PO stat, 0.6 mg 1 hr later; do NOT repeat course within 14 days due to CKD-related neuro-myotoxicity.';
    }
  } else if (!isNsaidContraindicated) {
    acuteAgent = 'NSAID_NAPROXEN';
    acuteDosing = 'Naproxen 500 mg PO BID with food or PPI gastroprotection for 5-7 days until flare resolves.';
  } else {
    // Both Colchicine and NSAIDs contraindicated -> Oral Corticosteroids
    acuteAgent = 'SYSTEMIC_PREDNISONE';
    acuteDosing = 'Prednisone 30-40 mg PO daily for 5 days, then taper by 5 mg every 2 days over 7-10 days.';
    alerts.push('Selected Systemic Corticosteroids: Preferred safe first-line choice in moderate-to-severe CKD or peptic ulcer disease.');
  }

  // Evaluate Urate Lowering Therapy (ULT)
  let ultDrug: GoutTherapyRegimen['ultDrug'] = 'ALLOPURINOL';
  let ultStartingDoseMg = 100;

  if (renalAndComorbidities.eGfrMlMin < 30) {
    ultStartingDoseMg = 50; // Renal dose adjustment to avoid AHS (Allopurinol Hypersensitivity Syndrome)
    alerts.push('Allopurinol starting dose reduced to 50 mg/day due to eGFR < 30 mL/min to prevent severe cutaneous adverse reactions.');
  }

  if (renalAndComorbidities.hlaB5801Positive) {
    ultDrug = 'FEBUXOSTAT';
    ultStartingDoseMg = 40;
    alerts.push('HLA-B*5801 Positive: ALLOPURINOL STRICTLY CONTRAINDICATED (high risk of Stevens-Johnson syndrome / DRESS / toxic epidermal necrolysis). Switched to Febuxostat 40 mg/day.');
  }

  const ultProphylaxisDose =
    acuteAgent === 'COLCHICINE' && renalAndComorbidities.eGfrMlMin >= 30
      ? 'Colchicine 0.6 mg PO once daily (or 0.3 mg daily in mild CKD) for 3-6 months during ULT titration.'
      : 'Low-dose Prednisone 5 mg daily or Naproxen 250 mg BID (if renal function permits) for 3-6 months.';

  return {
    acuteAgent,
    acuteDosing,
    acuteContraindications: contraindications,
    ultDrug,
    ultStartingDoseMg,
    ultTargetSerumUrateMgDl,
    ultProphylaxisDose,
    safetyAlerts: alerts,
  };
}
