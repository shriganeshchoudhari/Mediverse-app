/**
 * VisualFieldPerimetryEngine.ts
 *
 * Biophysical engine for Automated Static Perimetry (Humphrey Field Analyzer HFA 24-2/30-2).
 * Simulates:
 * - 24-2 Test Point Grid (54 test points spaced 6 degrees apart, avoiding central 3 degrees)
 * - Decibel (dB) sensitivity calculation (0 dB = 10,000 apostilbs / blind, 30-36 dB = peak foveal sensitivity)
 * - Reliability Indices: Fixation Losses (>20%), False Positives (>15%), False Negatives (>20%)
 * - Global Indices: Mean Deviation (MD in dB), Pattern Standard Deviation (PSD in dB), Visual Field Index (VFI %)
 * - Glaucoma Hemifield Test (GHT): Mirrors 5 paired upper/lower clusters across the horizontal raphe
 * - Hodapp-Anderson-Parrish (HAP) Glaucoma Staging (Stages 0 through 5)
 * - Corneal Pachymetry IOP Correction (Dresdner formula: adjusted IOP based on CCT vs 545 µm)
 * - Target IOP recommendation based on European Glaucoma Society (EGS) guidelines
 *
 * Location: frontend/.gemini/skills/VisualFieldPerimetryEngine.ts
 */

export interface VisualFieldPoint {
  id: number;
  x: number; // degrees from fixation (-27 to +27)
  y: number; // degrees from fixation (-27 to +27)
  quadrant: 'SUPERIOR_TEMPORAL' | 'SUPERIOR_NASAL' | 'INFERIOR_TEMPORAL' | 'INFERIOR_NASAL';
  clusterId: number; // 1 to 5 for GHT hemifield clusters, 0 for blind spot / peripheral
  measuredDb: number; // raw sensitivity: 0 to 40 dB
  ageNormalDb: number; // age-matched normative sensitivity
  totalDeviationDb: number; // measuredDb - ageNormalDb
  patternDeviationDb: number; // total deviation adjusted for general reduction
  totalDevProbability: '<5%' | '<2%' | '<1%' | '<0.5%' | 'NS'; // NS = not significant
  patternDevProbability: '<5%' | '<2%' | '<1%' | '<0.5%' | 'NS';
  isBlindSpot: boolean; // Physiological blind spot at ~15° temporal, -1.5° to -3° inferior
}

export type EyeTested = 'OD' | 'OS'; // Right Eye (OD) or Left Eye (OS)
export type TestStrategy = 'SITA_STANDARD' | 'SITA_FAST' | 'FULL_THRESHOLD';

export interface ReliabilityIndices {
  fixationLossesPct: number; // % failed Heijl-Krakau blind spot checks
  fixationLossesRatio: string; // e.g. "2/14"
  falsePositivesPct: number; // % responses when no stimulus presented (<15% acceptable)
  falseNegativesPct: number; // % non-responses to suprathreshold stimuli (<20% acceptable)
  testDurationSeconds: number;
  fovealThresholdDb: number;
  isReliable: boolean;
  reliabilityWarning?: string;
}

export type GlaucomaHemifieldResult =
  | 'WITHIN_NORMAL_LIMITS'
  | 'OUTSIDE_NORMAL_LIMITS'
  | 'BORDERLINE'
  | 'GENERAL_REDUCTION_OF_SENSITIVITY'
  | 'ABNORMALLY_HIGH_SENSITIVITY';

export type HapGlaucomaStage =
  | 'STAGE_0_NORMAL'
  | 'STAGE_1_EARLY'
  | 'STAGE_2_MODERATE'
  | 'STAGE_3_ADVANCED'
  | 'STAGE_4_SEVERE'
  | 'STAGE_5_END_STAGE';

export interface PachymetryCorrection {
  measuredIopMmHg: number;
  centralCornealThicknessUm: number; // normal ~545 µm
  correctedIopMmHg: number;
  cctRiskFactor: 'HIGH_RISK_THIN' | 'AVERAGE' | 'PROTECTIVE_THICK';
  explanation: string;
}

export interface TargetIopRecommendation {
  baselineIopMmHg: number;
  glaucomaStage: HapGlaucomaStage;
  targetIopRange: [number, number]; // [min, max] mmHg
  percentageReductionNeeded: number;
  firstLineTherapy: string;
}

export interface PerimetryAnalysisResult {
  eye: EyeTested;
  strategy: TestStrategy;
  meanDeviationDb: number; // MD
  patternStandardDeviationDb: number; // PSD
  visualFieldIndexPct: number; // VFI (0-100%)
  reliability: ReliabilityIndices;
  glaucomaHemifieldTest: GlaucomaHemifieldResult;
  hapStage: HapGlaucomaStage;
  pachymetry: PachymetryCorrection;
  targetIop: TargetIopRecommendation;
  scotomaPatternDescription: string;
  points: VisualFieldPoint[];
}

export interface PerimetryPreset {
  id: string;
  name: string;
  category: 'Normative' | 'Glaucomatous' | 'Neurological' | 'Quality Control';
  description: string;
  eye: EyeTested;
  measuredIop: number;
  cct: number;
  fixationLossesPct: number;
  falsePositivesPct: number;
  falseNegativesPct: number;
  generatePoints: (eye: EyeTested) => VisualFieldPoint[];
}

// ---------------------------------------------------------------------------
// Standard 24-2 Grid Coordinates (54 points spaced at 6-degree intervals)
// x ranges from -27 to +27, y ranges from -27 to +27
// ---------------------------------------------------------------------------
const STANDARD_24_2_COORDINATES: Array<{ x: number; y: number; cluster: number }> = [
  // y = +21
  { x: -9, y: 21, cluster: 1 }, { x: -3, y: 21, cluster: 1 }, { x: 3, y: 21, cluster: 1 }, { x: 9, y: 21, cluster: 1 },
  // y = +15
  { x: -15, y: 15, cluster: 1 }, { x: -9, y: 15, cluster: 1 }, { x: -3, y: 15, cluster: 2 }, { x: 3, y: 15, cluster: 2 }, { x: 9, y: 15, cluster: 2 }, { x: 15, y: 15, cluster: 2 },
  // y = +9
  { x: -21, y: 9, cluster: 1 }, { x: -15, y: 9, cluster: 2 }, { x: -9, y: 9, cluster: 2 }, { x: -3, y: 9, cluster: 3 }, { x: 3, y: 9, cluster: 3 }, { x: 9, y: 9, cluster: 3 }, { x: 15, y: 9, cluster: 3 }, { x: 21, y: 9, cluster: 3 },
  // y = +3
  { x: -27, y: 3, cluster: 4 }, { x: -21, y: 3, cluster: 4 }, { x: -15, y: 3, cluster: 3 }, { x: -9, y: 3, cluster: 3 }, { x: -3, y: 3, cluster: 4 }, { x: 3, y: 3, cluster: 4 }, { x: 9, y: 3, cluster: 4 }, { x: 15, y: 3, cluster: 4 }, { x: 21, y: 3, cluster: 4 },
  // y = -3
  { x: -27, y: -3, cluster: 4 }, { x: -21, y: -3, cluster: 4 }, { x: -15, y: -3, cluster: 3 }, { x: -9, y: -3, cluster: 3 }, { x: -3, y: -3, cluster: 4 }, { x: 3, y: -3, cluster: 4 }, { x: 9, y: -3, cluster: 4 }, { x: 15, y: -3, cluster: 4 }, { x: 21, y: -3, cluster: 4 },
  // y = -9
  { x: -21, y: -9, cluster: 1 }, { x: -15, y: -9, cluster: 2 }, { x: -9, y: -9, cluster: 2 }, { x: -3, y: -9, cluster: 3 }, { x: 3, y: -9, cluster: 3 }, { x: 9, y: -9, cluster: 3 }, { x: 15, y: -9, cluster: 3 }, { x: 21, y: -9, cluster: 3 },
  // y = -15
  { x: -15, y: -15, cluster: 1 }, { x: -9, y: -15, cluster: 1 }, { x: -3, y: -15, cluster: 2 }, { x: 3, y: -15, cluster: 2 }, { x: 9, y: -15, cluster: 2 }, { x: 15, y: -15, cluster: 2 },
  // y = -21
  { x: -9, y: -21, cluster: 1 }, { x: -3, y: -21, cluster: 1 }, { x: 3, y: -21, cluster: 1 }, { x: 9, y: -21, cluster: 1 },
];

/**
 * Computes normal hill of vision sensitivity (dB) as a function of eccentricity from fovea
 */
export function getNormativeSensitivity(x: number, y: number): number {
  const eccentricity = Math.sqrt(x * x + y * y);
  // Fovea is ~33-35 dB; decreases ~0.35 dB per degree of eccentricity
  const base = 34.0 - eccentricity * 0.38;
  // Nasal retina is slightly more sensitive than temporal
  const nasalBoost = x < 0 ? 0.8 : -0.5;
  return Math.max(16, Math.min(35, Math.round(base + nasalBoost)));
}

/**
 * Checks if a point falls within the physiological blind spot (optic nerve head)
 * For OD: centered at x = +15°, y = -3° (temporal field)
 * For OS: centered at x = -15°, y = -3° (temporal field)
 */
export function isBlindSpotPoint(x: number, y: number, eye: EyeTested): boolean {
  if (eye === 'OD') {
    return (x === 15 && (y === -3 || y === 3));
  } else {
    return (x === -15 && (y === -3 || y === 3));
  }
}

/**
 * Maps probability symbol based on deviation in dB
 */
export function getProbabilitySymbol(deviationDb: number): '<5%' | '<2%' | '<1%' | '<0.5%' | 'NS' {
  if (deviationDb <= -10) return '<0.5%';
  if (deviationDb <= -7) return '<1%';
  if (deviationDb <= -5) return '<2%';
  if (deviationDb <= -3) return '<5%';
  return 'NS';
}

/**
 * Corrects Intraocular Pressure based on Central Corneal Thickness using Dresdner formula
 * Correction = (545 - CCT) / 25 mmHg
 * (Thin corneas artificially lower tonometer reading; true IOP is higher)
 */
export function calculateCornealIopCorrection(measuredIop: number, cctUm: number): PachymetryCorrection {
  const diff = 545 - cctUm;
  const correction = diff * 0.04; // 1 mmHg per 25 µm deviation
  const correctedIopMmHg = Math.round((measuredIop + correction) * 10) / 10;

  let cctRiskFactor: 'HIGH_RISK_THIN' | 'AVERAGE' | 'PROTECTIVE_THICK' = 'AVERAGE';
  let explanation = `Normal CCT (545 ± 30 µm). Goldmann applanation tonometry is accurate.`;

  if (cctUm < 515) {
    cctRiskFactor = 'HIGH_RISK_THIN';
    explanation = `Thin central cornea (${cctUm} µm, <515 µm). Ocular Hypertension Treatment Study (OHTS) high-risk indicator. Measured IOP understates true intraocular pressure by ~${Math.abs(Math.round(correction * 10) / 10)} mmHg.`;
  } else if (cctUm > 580) {
    cctRiskFactor = 'PROTECTIVE_THICK';
    explanation = `Thick central cornea (${cctUm} µm, >580 µm). Increased corneal rigidity overestimates true IOP by ~${Math.round(correction * -10) / 10} mmHg.`;
  }

  return {
    measuredIopMmHg: measuredIop,
    centralCornealThicknessUm: cctUm,
    correctedIopMmHg,
    cctRiskFactor,
    explanation,
  };
}

/**
 * Determines Target IOP recommendation according to EGS / AAO guidelines
 */
export function calculateTargetIop(baselineIop: number, stage: HapGlaucomaStage): TargetIopRecommendation {
  let targetMin = 12;
  let targetMax = 18;
  let pct = 25;
  let firstLineTherapy = 'Prostaglandin Analog (Latanoprost 0.005% qhs) or Selective Laser Trabeculoplasty (SLT)';

  switch (stage) {
    case 'STAGE_0_NORMAL':
      targetMin = 14;
      targetMax = 20;
      pct = 15;
      firstLineTherapy = 'Observation or low-target drops if ocular hypertension with high CCT risk';
      break;
    case 'STAGE_1_EARLY':
      targetMin = 14;
      targetMax = 17;
      pct = 25;
      firstLineTherapy = 'Prostaglandin Analog monotherapy or primary Selective Laser Trabeculoplasty (SLT)';
      break;
    case 'STAGE_2_MODERATE':
      targetMin = 12;
      targetMax = 15;
      pct = 35;
      firstLineTherapy = 'Dual therapy (Prostaglandin + Beta-blocker / Carbonic Anhydrase Inhibitor) or SLT';
      break;
    case 'STAGE_3_ADVANCED':
      targetMin = 10;
      targetMax = 12;
      pct = 45;
      firstLineTherapy = 'Triple topical regimen or Minimally Invasive Glaucoma Surgery (MIGS) / Trabeculectomy';
      break;
    case 'STAGE_4_SEVERE':
    case 'STAGE_5_END_STAGE':
      targetMin = 8;
      targetMax = 11;
      pct = 50;
      firstLineTherapy = 'Urgent Trabeculectomy with Mitomycin C or Glaucoma Drainage Device (Ahmed/Baerveldt shunt)';
      break;
  }

  // Ensure target doesn't exceed baseline
  const calculatedMax = Math.min(targetMax, Math.round(baselineIop * (1 - pct / 100)));

  return {
    baselineIopMmHg: baselineIop,
    glaucomaStage: stage,
    targetIopRange: [Math.min(targetMin, calculatedMax - 2), calculatedMax],
    percentageReductionNeeded: pct,
    firstLineTherapy,
  };
}

/**
 * Calculates Glaucoma Hemifield Test (GHT) by comparing superior vs inferior hemifield clusters
 */
export function evaluateGlaucomaHemifield(points: VisualFieldPoint[]): GlaucomaHemifieldResult {
  const superiorClusters: { [key: number]: number[] } = { 1: [], 2: [], 3: [], 4: [] };
  const inferiorClusters: { [key: number]: number[] } = { 1: [], 2: [], 3: [], 4: [] };

  for (const pt of points) {
    if (pt.isBlindSpot) continue;
    if (pt.clusterId >= 1 && pt.clusterId <= 4) {
      if (pt.y > 0) {
        superiorClusters[pt.clusterId].push(pt.patternDeviationDb);
      } else if (pt.y < 0) {
        inferiorClusters[pt.clusterId].push(pt.patternDeviationDb);
      }
    }
  }

  // Check mean difference across corresponding clusters
  let maxAsymmetry = 0;
  let totalDepressionCount = 0;
  let totalElevatedCount = 0;

  for (let c = 1; c <= 4; c++) {
    const supArr = superiorClusters[c] || [];
    const infArr = inferiorClusters[c] || [];
    if (supArr.length > 0 && infArr.length > 0) {
      const supMean = supArr.reduce((a, b) => a + b, 0) / supArr.length;
      const infMean = infArr.reduce((a, b) => a + b, 0) / infArr.length;
      const diff = Math.abs(supMean - infMean);
      if (diff > maxAsymmetry) maxAsymmetry = diff;
    }
  }

  for (const pt of points) {
    if (pt.isBlindSpot) continue;
    if (pt.patternDeviationDb <= -7) totalDepressionCount++;
    if (pt.totalDeviationDb >= 4) totalElevatedCount++;
  }

  if (totalElevatedCount >= 10) {
    return 'ABNORMALLY_HIGH_SENSITIVITY';
  }
  if (maxAsymmetry >= 6 || totalDepressionCount >= 6) {
    return 'OUTSIDE_NORMAL_LIMITS';
  }
  if (maxAsymmetry >= 4 || totalDepressionCount >= 3) {
    return 'BORDERLINE';
  }
  const meanAllDev = points.filter(p => !p.isBlindSpot).reduce((a, b) => a + b.totalDeviationDb, 0) / (points.length - 2);
  if (meanAllDev <= -6) {
    return 'GENERAL_REDUCTION_OF_SENSITIVITY';
  }
  return 'WITHIN_NORMAL_LIMITS';
}

/**
 * Evaluates Hodapp-Anderson-Parrish (HAP) Glaucoma Staging Criteria
 */
export function determineHapStage(
  mdDb: number,
  points: VisualFieldPoint[],
  ght: GlaucomaHemifieldResult
): HapGlaucomaStage {
  if (ght === 'WITHIN_NORMAL_LIMITS' && mdDb > -2.0) {
    return 'STAGE_0_NORMAL';
  }

  const validPoints = points.filter(p => !p.isBlindSpot);
  const p05Count = validPoints.filter(p => p.patternDevProbability === '<5%' || p.patternDevProbability === '<2%' || p.patternDevProbability === '<1%' || p.patternDevProbability === '<0.5%').length;
  const p01Count = validPoints.filter(p => p.patternDevProbability === '<1%' || p.patternDevProbability === '<0.5%').length;
  const centralPointsInvolved = validPoints.some(p => Math.abs(p.x) <= 5 && Math.abs(p.y) <= 5 && p.patternDeviationDb <= -10);

  if (mdDb < -20.0 || (mdDb < -15.0 && validPoints.filter(p => p.measuredDb <= 0).length > 30)) {
    return 'STAGE_5_END_STAGE';
  }
  if (mdDb < -12.0) {
    if (centralPointsInvolved && p01Count >= 20) {
      return 'STAGE_4_SEVERE';
    }
    return 'STAGE_3_ADVANCED';
  }
  if (mdDb < -6.0 || p05Count >= 18 || p01Count >= 10) {
    return 'STAGE_2_MODERATE';
  }
  if (mdDb >= -6.0 && (p05Count >= 3 || ght === 'OUTSIDE_NORMAL_LIMITS')) {
    return 'STAGE_1_EARLY';
  }

  return 'STAGE_0_NORMAL';
}

/**
 * Master visual field analysis function
 */
export function analyzeVisualField(
  points: VisualFieldPoint[],
  eye: EyeTested,
  strategy: TestStrategy,
  measuredIop: number,
  cctUm: number,
  fixationLossesPct: number,
  falsePositivesPct: number,
  falseNegativesPct: number
): PerimetryAnalysisResult {
  const nonBlindPoints = points.filter(p => !p.isBlindSpot);
  const n = nonBlindPoints.length;

  // Mean Deviation (MD) = average of total deviations
  const sumTotalDev = nonBlindPoints.reduce((acc, pt) => acc + pt.totalDeviationDb, 0);
  const meanDeviationDb = Math.round((sumTotalDev / n) * 100) / 100;

  // General reduction factor (7th highest total deviation in standard SITA algorithm)
  const sortedDevs = [...nonBlindPoints.map(p => p.totalDeviationDb)].sort((a, b) => b - a);
  const generalReduction = sortedDevs[Math.min(6, sortedDevs.length - 1)];

  // Update pattern deviations
  for (const pt of points) {
    if (pt.isBlindSpot) {
      pt.patternDeviationDb = 0;
      pt.patternDevProbability = 'NS';
    } else {
      pt.patternDeviationDb = Math.round((pt.totalDeviationDb - generalReduction) * 10) / 10;
      pt.patternDevProbability = getProbabilitySymbol(pt.patternDeviationDb);
    }
  }

  // Pattern Standard Deviation (PSD)
  const sumSqDiff = nonBlindPoints.reduce((acc, pt) => {
    const diff = pt.totalDeviationDb - meanDeviationDb;
    return acc + diff * diff;
  }, 0);
  const patternStandardDeviationDb = Math.round(Math.sqrt(sumSqDiff / (n - 1)) * 100) / 100;

  // Visual Field Index (VFI %): 100% - normalized weighted loss
  let rawVfi = 100 + meanDeviationDb * 3.1;
  if (meanDeviationDb > -0.5) rawVfi = 99;
  const visualFieldIndexPct = Math.max(0, Math.min(100, Math.round(rawVfi)));

  // Reliability Assessment
  const isReliable = fixationLossesPct <= 20 && falsePositivesPct <= 15 && falseNegativesPct <= 20;
  let reliabilityWarning: string | undefined;
  if (falsePositivesPct > 15) {
    reliabilityWarning = 'Unreliable: High False Positive rate (>15%). Patient is "trigger-happy" resulting in artificially high thresholds.';
  } else if (fixationLossesPct > 20) {
    reliabilityWarning = 'Unreliable: Excessive Fixation Losses (>20%). Gaze tracking lost; patient looking away from central fixation.';
  } else if (falseNegativesPct > 20 && meanDeviationDb > -12) {
    reliabilityWarning = 'Unreliable: High False Negative rate (>20%). Inattention or fatigue.';
  }

  const reliability: ReliabilityIndices = {
    fixationLossesPct,
    fixationLossesRatio: `${Math.round((fixationLossesPct / 100) * 15)}/15`,
    falsePositivesPct,
    falseNegativesPct,
    testDurationSeconds: strategy === 'SITA_FAST' ? 210 : 390,
    fovealThresholdDb: Math.round(35 + (points[26]?.measuredDb ? (points[26].measuredDb - 32) : 0)),
    isReliable,
    reliabilityWarning,
  };

  const ght = evaluateGlaucomaHemifield(points);
  const hapStage = determineHapStage(meanDeviationDb, points, ght);
  const pachymetry = calculateCornealIopCorrection(measuredIop, cctUm);
  const targetIop = calculateTargetIop(pachymetry.correctedIopMmHg, hapStage);

  // Generate clinical scotoma pattern description
  let scotomaPatternDescription = 'Normal sensitivity throughout both hemifields. Hill of vision intact.';
  if (ght === 'OUTSIDE_NORMAL_LIMITS') {
    const supLoss = nonBlindPoints.filter(p => p.y > 0 && p.patternDeviationDb <= -6).length;
    const infLoss = nonBlindPoints.filter(p => p.y < 0 && p.patternDeviationDb <= -6).length;
    if (supLoss > 8 && infLoss > 8) {
      scotomaPatternDescription = 'Bi-arcuate (ring) scotoma involving superior and inferior arcuate nerve fiber bundles with central macular sparing.';
    } else if (supLoss > infLoss + 4) {
      scotomaPatternDescription = 'Superior arcuate / Bjerrum scotoma arching from blind spot and respecting the nasal horizontal raphe.';
    } else if (infLoss > supLoss + 4) {
      scotomaPatternDescription = 'Inferior arcuate scotoma and nasal step defect characteristic of localized superior rim neuroretinal loss.';
    } else {
      scotomaPatternDescription = 'Localized paracentral scotoma clusters respecting the horizontal midline.';
    }
  } else if (ght === 'ABNORMALLY_HIGH_SENSITIVITY') {
    scotomaPatternDescription = 'Abnormally high sensitivities (white scotoma artifact) secondary to patient triggering response without stimulus presentation.';
  }

  return {
    eye,
    strategy,
    meanDeviationDb,
    patternStandardDeviationDb,
    visualFieldIndexPct,
    reliability,
    glaucomaHemifieldTest: ght,
    hapStage,
    pachymetry,
    targetIop,
    scotomaPatternDescription,
    points,
  };
}

/**
 * 8 Clinical Presets
 */
export const PERIMETRY_PRESETS: PerimetryPreset[] = [
  {
    id: 'normal-baseline',
    name: 'Normal Healthy Baseline (24-2 SITA)',
    category: 'Normative',
    description: 'Physiologically normal 24-2 visual field with preserved central hill of vision, normal blind spot, and symmetric hemifields.',
    eye: 'OD',
    measuredIop: 15,
    cct: 545,
    fixationLossesPct: 5,
    falsePositivesPct: 2,
    falseNegativesPct: 3,
    generatePoints: (eye: EyeTested) => {
      return STANDARD_24_2_COORDINATES.map((coord, idx) => {
        const isBlind = isBlindSpotPoint(coord.x, coord.y, eye);
        const ageNorm = getNormativeSensitivity(coord.x, coord.y);
        const measured = isBlind ? 0 : Math.max(0, ageNorm + Math.round((Math.sin(idx) * 1.5)));
        const totalDev = measured - ageNorm;
        return {
          id: idx,
          x: coord.x,
          y: coord.y,
          quadrant: coord.y > 0 ? (coord.x < 0 ? 'SUPERIOR_NASAL' : 'SUPERIOR_TEMPORAL') : (coord.x < 0 ? 'INFERIOR_NASAL' : 'INFERIOR_TEMPORAL'),
          clusterId: coord.cluster,
          measuredDb: measured,
          ageNormalDb: ageNorm,
          totalDeviationDb: totalDev,
          patternDeviationDb: totalDev,
          totalDevProbability: getProbabilitySymbol(totalDev),
          patternDevProbability: getProbabilitySymbol(totalDev),
          isBlindSpot: isBlind,
        };
      });
    },
  },
  {
    id: 'early-poag-nasal-step',
    name: 'Early POAG - Superior Nasal Step',
    category: 'Glaucomatous',
    description: 'Early glaucomatous neuropathy presenting with superior nasal step defect sharply demarcated by the horizontal raphe.',
    eye: 'OD',
    measuredIop: 24,
    cct: 535,
    fixationLossesPct: 7,
    falsePositivesPct: 4,
    falseNegativesPct: 6,
    generatePoints: (eye: EyeTested) => {
      return STANDARD_24_2_COORDINATES.map((coord, idx) => {
        const isBlind = isBlindSpotPoint(coord.x, coord.y, eye);
        const ageNorm = getNormativeSensitivity(coord.x, coord.y);
        let measured = isBlind ? 0 : ageNorm;

        // Superior nasal step: x < 0, y in [3, 9, 15]
        if (!isBlind && coord.x <= -9 && coord.y > 0 && coord.y <= 15) {
          measured = Math.max(10, ageNorm - 14);
        }

        const totalDev = measured - ageNorm;
        return {
          id: idx,
          x: coord.x,
          y: coord.y,
          quadrant: coord.y > 0 ? (coord.x < 0 ? 'SUPERIOR_NASAL' : 'SUPERIOR_TEMPORAL') : (coord.x < 0 ? 'INFERIOR_NASAL' : 'INFERIOR_TEMPORAL'),
          clusterId: coord.cluster,
          measuredDb: measured,
          ageNormalDb: ageNorm,
          totalDeviationDb: totalDev,
          patternDeviationDb: totalDev,
          totalDevProbability: getProbabilitySymbol(totalDev),
          patternDevProbability: getProbabilitySymbol(totalDev),
          isBlindSpot: isBlind,
        };
      });
    },
  },
  {
    id: 'moderate-glaucoma-arcuate',
    name: 'Moderate Glaucoma - Arcuate (Bjerrum) Scotoma',
    category: 'Glaucomatous',
    description: 'Inferior arcuate scotoma arching from blind spot across Bjerrum area into the inferior nasal field. CCT 510 µm elevates progression risk.',
    eye: 'OD',
    measuredIop: 26,
    cct: 505,
    fixationLossesPct: 10,
    falsePositivesPct: 5,
    falseNegativesPct: 12,
    generatePoints: (eye: EyeTested) => {
      return STANDARD_24_2_COORDINATES.map((coord, idx) => {
        const isBlind = isBlindSpotPoint(coord.x, coord.y, eye);
        const ageNorm = getNormativeSensitivity(coord.x, coord.y);
        let measured = isBlind ? 0 : ageNorm;

        // Inferior arcuate arc (y < 0, spanning from x = 15 down and nasalward to x = -21)
        if (!isBlind && coord.y < 0 && coord.y >= -15) {
          if (coord.x >= -21 && coord.x <= 15) {
            measured = Math.max(4, ageNorm - 18);
          }
        }

        const totalDev = measured - ageNorm;
        return {
          id: idx,
          x: coord.x,
          y: coord.y,
          quadrant: coord.y > 0 ? (coord.x < 0 ? 'SUPERIOR_NASAL' : 'SUPERIOR_TEMPORAL') : (coord.x < 0 ? 'INFERIOR_NASAL' : 'INFERIOR_TEMPORAL'),
          clusterId: coord.cluster,
          measuredDb: measured,
          ageNormalDb: ageNorm,
          totalDeviationDb: totalDev,
          patternDeviationDb: totalDev,
          totalDevProbability: getProbabilitySymbol(totalDev),
          patternDevProbability: getProbabilitySymbol(totalDev),
          isBlindSpot: isBlind,
        };
      });
    },
  },
  {
    id: 'advanced-glaucoma-tunnel',
    name: 'Advanced Glaucoma - Subtotal Loss / Macular Island',
    category: 'Glaucomatous',
    description: 'Bi-arcuate coalescent defects with dense ring scotoma. Preserved small central 5-degree macular island and temporal crescent.',
    eye: 'OD',
    measuredIop: 32,
    cct: 520,
    fixationLossesPct: 12,
    falsePositivesPct: 3,
    falseNegativesPct: 18,
    generatePoints: (eye: EyeTested) => {
      return STANDARD_24_2_COORDINATES.map((coord, idx) => {
        const isBlind = isBlindSpotPoint(coord.x, coord.y, eye);
        const ageNorm = getNormativeSensitivity(coord.x, coord.y);
        let measured = 0;

        // Only small central island at (±3, ±3) has residual vision
        if (Math.abs(coord.x) <= 3 && Math.abs(coord.y) <= 3) {
          measured = 22;
        } else if (coord.x >= 21 && coord.y === -3) {
          measured = 14; // temporal remnant
        }

        const totalDev = measured - ageNorm;
        return {
          id: idx,
          x: coord.x,
          y: coord.y,
          quadrant: coord.y > 0 ? (coord.x < 0 ? 'SUPERIOR_NASAL' : 'SUPERIOR_TEMPORAL') : (coord.x < 0 ? 'INFERIOR_NASAL' : 'INFERIOR_TEMPORAL'),
          clusterId: coord.cluster,
          measuredDb: measured,
          ageNormalDb: ageNorm,
          totalDeviationDb: totalDev,
          patternDeviationDb: totalDev,
          totalDevProbability: getProbabilitySymbol(totalDev),
          patternDevProbability: getProbabilitySymbol(totalDev),
          isBlindSpot: isBlind,
        };
      });
    },
  },
  {
    id: 'pituitary-bitemporal-hemianopia',
    name: 'Pituitary Macroadenoma - Bitemporal Hemianopia',
    category: 'Neurological',
    description: 'Optic chiasm compression from sellar tumor causing dense visual field loss respecting the vertical meridian in the temporal hemifield.',
    eye: 'OD',
    measuredIop: 16,
    cct: 550,
    fixationLossesPct: 6,
    falsePositivesPct: 3,
    falseNegativesPct: 8,
    generatePoints: (eye: EyeTested) => {
      return STANDARD_24_2_COORDINATES.map((coord, idx) => {
        const isBlind = isBlindSpotPoint(coord.x, coord.y, eye);
        const ageNorm = getNormativeSensitivity(coord.x, coord.y);
        let measured = isBlind ? 0 : ageNorm;

        // Temporal hemifield (x > 0 for OD, x < 0 for OS) respects vertical meridian
        const isTemporal = eye === 'OD' ? coord.x > 0 : coord.x < 0;
        if (isTemporal && !isBlind) {
          measured = Math.max(0, ageNorm - 24);
        }

        const totalDev = measured - ageNorm;
        return {
          id: idx,
          x: coord.x,
          y: coord.y,
          quadrant: coord.y > 0 ? (coord.x < 0 ? 'SUPERIOR_NASAL' : 'SUPERIOR_TEMPORAL') : (coord.x < 0 ? 'INFERIOR_NASAL' : 'INFERIOR_TEMPORAL'),
          clusterId: coord.cluster,
          measuredDb: measured,
          ageNormalDb: ageNorm,
          totalDeviationDb: totalDev,
          patternDeviationDb: totalDev,
          totalDevProbability: getProbabilitySymbol(totalDev),
          patternDevProbability: getProbabilitySymbol(totalDev),
          isBlindSpot: isBlind,
        };
      });
    },
  },
  {
    id: 'naion-altitudinal',
    name: 'NAION - Inferior Altitudinal Hemifield Defect',
    category: 'Neurological',
    description: 'Non-arteritic anterior ischemic optic neuropathy (NAION) causing dense inferior altitudinal loss respecting the horizontal midline.',
    eye: 'OD',
    measuredIop: 14,
    cct: 540,
    fixationLossesPct: 8,
    falsePositivesPct: 4,
    falseNegativesPct: 10,
    generatePoints: (eye: EyeTested) => {
      return STANDARD_24_2_COORDINATES.map((coord, idx) => {
        const isBlind = isBlindSpotPoint(coord.x, coord.y, eye);
        const ageNorm = getNormativeSensitivity(coord.x, coord.y);
        let measured = isBlind ? 0 : ageNorm;

        // Altitudinal inferior field (y < 0) sharply respecting horizontal line
        if (coord.y < 0 && !isBlind) {
          measured = Math.max(0, ageNorm - 26);
        }

        const totalDev = measured - ageNorm;
        return {
          id: idx,
          x: coord.x,
          y: coord.y,
          quadrant: coord.y > 0 ? (coord.x < 0 ? 'SUPERIOR_NASAL' : 'SUPERIOR_TEMPORAL') : (coord.x < 0 ? 'INFERIOR_NASAL' : 'INFERIOR_TEMPORAL'),
          clusterId: coord.cluster,
          measuredDb: measured,
          ageNormalDb: ageNorm,
          totalDeviationDb: totalDev,
          patternDeviationDb: totalDev,
          totalDevProbability: getProbabilitySymbol(totalDev),
          patternDevProbability: getProbabilitySymbol(totalDev),
          isBlindSpot: isBlind,
        };
      });
    },
  },
  {
    id: 'unreliable-false-positives',
    name: 'Unreliable Test - High False Positives ("Trigger-Happy")',
    category: 'Quality Control',
    description: 'Patient continuously clicks response button without visual stimuli. False positives 28%, creating an artifactual "white scotoma" pattern.',
    eye: 'OD',
    measuredIop: 17,
    cct: 545,
    fixationLossesPct: 12,
    falsePositivesPct: 28,
    falseNegativesPct: 2,
    generatePoints: (eye: EyeTested) => {
      return STANDARD_24_2_COORDINATES.map((coord, idx) => {
        const isBlind = isBlindSpotPoint(coord.x, coord.y, eye);
        const ageNorm = getNormativeSensitivity(coord.x, coord.y);
        // Artificially inflated sensitivities beyond normal limits
        const measured = isBlind ? 12 : Math.min(42, ageNorm + 8);
        const totalDev = measured - ageNorm;
        return {
          id: idx,
          x: coord.x,
          y: coord.y,
          quadrant: coord.y > 0 ? (coord.x < 0 ? 'SUPERIOR_NASAL' : 'SUPERIOR_TEMPORAL') : (coord.x < 0 ? 'INFERIOR_NASAL' : 'INFERIOR_TEMPORAL'),
          clusterId: coord.cluster,
          measuredDb: measured,
          ageNormalDb: ageNorm,
          totalDeviationDb: totalDev,
          patternDeviationDb: totalDev,
          totalDevProbability: 'NS',
          patternDevProbability: 'NS',
          isBlindSpot: isBlind,
        };
      });
    },
  },
  {
    id: 'thin-cornea-ohts-high-risk',
    name: 'High-Risk Ocular Hypertension with Thin Cornea (OHTS)',
    category: 'Glaucomatous',
    description: 'Measured IOP 24 mmHg with CCT 485 µm. Corrected true IOP is 26.4 mmHg with an incipient superior paracentral scotoma.',
    eye: 'OD',
    measuredIop: 24,
    cct: 485,
    fixationLossesPct: 5,
    falsePositivesPct: 4,
    falseNegativesPct: 7,
    generatePoints: (eye: EyeTested) => {
      return STANDARD_24_2_COORDINATES.map((coord, idx) => {
        const isBlind = isBlindSpotPoint(coord.x, coord.y, eye);
        const ageNorm = getNormativeSensitivity(coord.x, coord.y);
        let measured = isBlind ? 0 : ageNorm;

        // Superior paracentral bundle at (x=-3, y=9) and (x=3, y=9)
        if (!isBlind && Math.abs(coord.x) <= 3 && coord.y === 9) {
          measured = Math.max(8, ageNorm - 16);
        }

        const totalDev = measured - ageNorm;
        return {
          id: idx,
          x: coord.x,
          y: coord.y,
          quadrant: coord.y > 0 ? (coord.x < 0 ? 'SUPERIOR_NASAL' : 'SUPERIOR_TEMPORAL') : (coord.x < 0 ? 'INFERIOR_NASAL' : 'INFERIOR_TEMPORAL'),
          clusterId: coord.cluster,
          measuredDb: measured,
          ageNormalDb: ageNorm,
          totalDeviationDb: totalDev,
          patternDeviationDb: totalDev,
          totalDevProbability: getProbabilitySymbol(totalDev),
          patternDevProbability: getProbabilitySymbol(totalDev),
          isBlindSpot: isBlind,
        };
      });
    },
  },
];
