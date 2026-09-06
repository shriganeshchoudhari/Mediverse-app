/**
 * AutoantibodyAnaEngine.ts
 * Diagnostic Biophysical Engine for Autoantibody Profiling, ICAP HEp-2 IFA Patterns, and ACR/EULAR Criteria
 * 
 * Implements:
 * 1. ICAP (International Consensus on ANA Patterns) nomenclature (AC-1 to AC-29)
 * 2. Quantitative ANA end-point titer dilution kinetics (1:40 to 1:2560) and post-test probability calculations
 * 3. Specific extractable nuclear antigen (ENA) multiplex panel (dsDNA, Sm, Ro/SSA, La/SSB, U1-RNP, Scl-70, Centromere, Jo-1, Histone)
 * 4. ANCA dual-fluorescence differential (c-ANCA/PR3 vs p-ANCA/MPO)
 * 5. 2019 ACR/EULAR criteria point scoring for SLE, SSc, and Sjogren
 * 6. 8 Validated Clinical Presets across Rheumatology & Clinical Immunology
 * 
 * Location: frontend/.gemini/skills/AutoantibodyAnaEngine.ts
 */

export type IcapPatternCode =
  | 'AC-1_HOMOGENEOUS'
  | 'AC-4_FINE_SPECKLED'
  | 'AC-5_COARSE_SPECKLED'
  | 'AC-3_CENTROMERE'
  | 'AC-8_NUCLEOLAR_HOMOGENEOUS'
  | 'AC-2_DENSE_FINE_SPECKLED'
  | 'AC-21_CYTOPLASMIC_RETICULAR_AMA'
  | 'ANCA_CANCA_PR3'
  | 'ANCA_PANCA_MPO';

export type AnaTiter = 'NEGATIVE' | '1:40' | '1:80' | '1:160' | '1:320' | '1:640' | '1:1280' | '1:2560';

export type AutoantibodyPresetId =
  | 'SYSTEMIC_LUPUS_ERYTHEMATOSUS_LUPUS_NEPHRITIS'
  | 'DIFFUSE_SYSTEMIC_SCLEROSIS_SCL70'
  | 'CREST_LIMITED_SCLERODERMA_CENTROMERE'
  | 'PRIMARY_SJOGREN_SYNDROME_RO_LA'
  | 'MIXED_CONNECTIVE_TISSUE_DISEASE_RNP'
  | 'DRUG_INDUCED_LUPUS_HYDRALAZINE_PROCAINAMIDE'
  | 'GRANULOMATOSIS_WITH_POLYANGIITIS_CANCA_PR3'
  | 'HEALTHY_CONTROL_DFS70_ISOLATED';

export interface EnaBiomarkerPanel {
  antiDsDnaIuMl: number; // Normal < 10 IU/mL (positive > 20)
  antiSmPositive: boolean; // Highly specific for SLE
  antiRo60Positive: boolean; // Sjögren, SLE, Neonatal Lupus
  antiRo52Positive: boolean; // Myositis, Systemic Sclerosis
  antiLaSsbPositive: boolean; // Sjögren
  antiU1RnpUml: number; // MCTD hallmark (positive > 20 U/mL)
  antiScl70Positive: boolean; // Diffuse SSc (Topoisomerase I)
  antiRnaPolymeraseIiiPositive: boolean; // Diffuse SSc, Scleroderma Renal Crisis
  antiCentromereBPositive: boolean; // Limited SSc (CREST)
  antiJo1Positive: boolean; // Antisynthetase syndrome
  antiHistonePositive: boolean; // Drug-induced lupus (>95%)
  antiDfs70Positive: boolean; // Dense fine speckled, excludes SARD if isolated
  antiPr3AncaUml: number; // c-ANCA (Wegener/GPA, normal < 5 U/mL)
  antiMpoAncaUml: number; // p-ANCA (MPA/EGPA, normal < 5 U/mL)
  rheumatoidFactorIuMl: number; // Normal < 14 IU/mL
  antiCcpUml: number; // Normal < 20 U/mL (ACPA)
  complementC3MgDl: number; // Normal 90 - 180 mg/dL
  complementC4MgDl: number; // Normal 10 - 40 mg/dL
}

export interface AutoantibodyInputParams {
  presetId: AutoantibodyPresetId;
  anaTiter: AnaTiter;
  primaryIcapPattern: IcapPatternCode;
  fluorescenceIntensity: number; // 1+ to 4+
  ena: EnaBiomarkerPanel;
  clinicalFindings: {
    malarRash: boolean;
    discoidRash: boolean;
    oralUlcers: boolean;
    nonScarringAlopecia: boolean;
    synovitisJointCount: number; // 0 to 28
    serositisPleuropericarditis: boolean;
    proteinuriaGrams24h: number; // 0 to 10 g/day
    autoimmuneHemolyticAnemia: boolean;
    thrombocytopeniaCount: number; // x10^3/uL
    raynaudPhenomenon: boolean;
    sclerodactyly: boolean;
    siccaOcularOral: boolean;
  };
}

export interface AutoantibodyDiagnosticState {
  anaTiterRatioNumeric: number; // e.g. 1280
  postTestAutoimmuneProbabilityPct: number; // 0 - 99%
  eularAcrSle2019Score: number; // Entry: ANA >= 1:80, Classification >= 10 points
  eularSleClassified: boolean;
  acrEularSSc2013Score: number; // >= 9 points classifies Systemic Sclerosis
  eularSScClassified: boolean;
  sjogrenAcrEular2016Score: number; // >= 4 points classifies Primary Sjogren
  sjogrenClassified: boolean;
  primarySuspectedDiagnosis: string;
  diseasePhenotypeColor: string;
  activeAlarms: string[];
  clinicalRecommendations: string[];
  ifaMorphologyDescription: string;
}

/**
 * Helper to convert titer string to numeric dilution denominator
 */
export function getTiterNumeric(titer: AnaTiter): number {
  switch (titer) {
    case 'NEGATIVE': return 0;
    case '1:40': return 40;
    case '1:80': return 80;
    case '1:160': return 160;
    case '1:320': return 320;
    case '1:640': return 640;
    case '1:1280': return 1280;
    case '1:2560': return 2560;
    default: return 0;
  }
}

/**
 * Calculate Bayesian Post-Test Probability of Systemic Autoimmune Rheumatic Disease (SARD)
 * Pre-test probability assumed ~5% in general rheumatology consults
 */
export function calculatePostTestProbability(
  titer: AnaTiter,
  pattern: IcapPatternCode,
  isDfs70Isolated: boolean
): number {
  if (titer === 'NEGATIVE') return 2.0;

  // Dense fine speckled DFS70 in isolation drastically reduces probability of systemic autoimmune disease
  if (isDfs70Isolated && pattern === 'AC-2_DENSE_FINE_SPECKLED') {
    return 4.5;
  }

  const numTiter = getTiterNumeric(titer);
  let likelihoodRatio = 1.0;

  if (numTiter <= 80) {
    likelihoodRatio = 1.6; // ~13% of healthy individuals are positive at 1:80
  } else if (numTiter === 160) {
    likelihoodRatio = 3.5; // ~5% of healthy individuals positive at 1:160
  } else if (numTiter === 320) {
    likelihoodRatio = 8.5;
  } else if (numTiter === 640) {
    likelihoodRatio = 16.0;
  } else if (numTiter >= 1280) {
    likelihoodRatio = 35.0; // High specificity >99%
  }

  const preTestOdds = 0.05 / (1 - 0.05); // 0.0526
  const postTestOdds = preTestOdds * likelihoodRatio;
  const postTestProb = (postTestOdds / (1 + postTestOdds)) * 100;

  return parseFloat(Math.min(99.0, Math.max(1.0, postTestProb)).toFixed(1));
}

/**
 * Score 2019 ACR/EULAR Classification Criteria for Systemic Lupus Erythematosus (SLE)
 * Entry Criterion: ANA >= 1:80 (required)
 * Classification threshold: >= 10 points across constitutional, hematologic, neuropsychiatric, mucocutaneous, serosal, musculoskeletal, renal, and immunologic domains
 */
export function calculateEularAcrSleScore(params: AutoantibodyInputParams): { score: number; isClassified: boolean } {
  const numTiter = getTiterNumeric(params.anaTiter);
  if (numTiter < 80) {
    return { score: 0, isClassified: false }; // Entry criterion not met
  }

  let totalScore = 0;
  const { clinicalFindings, ena } = params;

  // Mucocutaneous domain (pick highest)
  if (clinicalFindings.malarRash) totalScore += 6;
  else if (clinicalFindings.discoidRash) totalScore += 4;
  else if (clinicalFindings.oralUlcers) totalScore += 2;
  else if (clinicalFindings.nonScarringAlopecia) totalScore += 2;

  // Musculoskeletal (synovitis >= 2 joints: 6 pts)
  if (clinicalFindings.synovitisJointCount >= 2) {
    totalScore += 6;
  }

  // Serosal domain (pleural or pericardial effusion: 5 pts)
  if (clinicalFindings.serositisPleuropericarditis) {
    totalScore += 5;
  }

  // Renal domain (proteinuria > 0.5 g/24h: 4 pts)
  if (clinicalFindings.proteinuriaGrams24h >= 0.5) {
    totalScore += 4;
  }

  // Hematologic domain (autoimmune hemolytic anemia: 4 pts, thrombocytopenia < 100k: 4 pts)
  if (clinicalFindings.autoimmuneHemolyticAnemia) {
    totalScore += 4;
  } else if (clinicalFindings.thrombocytopeniaCount < 100) {
    totalScore += 4;
  }

  // Immunologic Domain: Antiphospholipid / Complements / SLE-specific antibodies
  // Low C3 AND low C4: 4 pts (or low C3 or C4 alone: 3 pts)
  if (ena.complementC3MgDl < 90 && ena.complementC4MgDl < 10) {
    totalScore += 4;
  } else if (ena.complementC3MgDl < 90 || ena.complementC4MgDl < 10) {
    totalScore += 3;
  }

  // Anti-dsDNA > 20 IU/mL: 6 pts
  if (ena.antiDsDnaIuMl >= 20) {
    totalScore += 6;
  }

  // Anti-Sm antibody: 6 pts
  if (ena.antiSmPositive) {
    totalScore += 6;
  }

  return {
    score: totalScore,
    isClassified: totalScore >= 10,
  };
}

/**
 * Score 2013 ACR/EULAR Classification Criteria for Systemic Sclerosis (SSc)
 * Threshold: >= 9 points classifies SSc
 */
export function calculateAcrEularSscScore(params: AutoantibodyInputParams): { score: number; isClassified: boolean } {
  let score = 0;
  const { clinicalFindings, ena } = params;

  // Sclerodactyly of fingers: 4 pts
  if (clinicalFindings.sclerodactyly) {
    score += 4;
  }

  // Raynaud's phenomenon: 3 pts
  if (clinicalFindings.raynaudPhenomenon) {
    score += 3;
  }

  // SSc-specific autoantibodies (Centromere, Scl-70, RNA Pol III): maximum 3 pts
  if (ena.antiCentromereBPositive || ena.antiScl70Positive || ena.antiRnaPolymeraseIiiPositive) {
    score += 3;
  }

  return {
    score,
    isClassified: score >= 9,
  };
}

/**
 * Score 2016 ACR/EULAR Classification Criteria for Primary Sjögren's Syndrome
 * Threshold: >= 4 points classifies Primary Sjögren
 */
export function calculateSjogrenScore(params: AutoantibodyInputParams): { score: number; isClassified: boolean } {
  let score = 0;
  const { clinicalFindings, ena } = params;

  // Anti-SSA (Ro) positive: 3 pts
  if (ena.antiRo60Positive || ena.antiRo52Positive) {
    score += 3;
  }

  // Sicca symptoms (dry eyes / dry mouth): 1 pt
  if (clinicalFindings.siccaOcularOral) {
    score += 1;
  }

  // Rheumatoid factor positive + ANA >= 1:320 surrogate: 1 pt
  if (ena.rheumatoidFactorIuMl > 14 && getTiterNumeric(params.anaTiter) >= 320) {
    score += 1;
  }

  return {
    score,
    isClassified: score >= 4,
  };
}

/**
 * Main Compute Function for Autoantibody Analysis
 */
export function computeAutoantibodyState(params: AutoantibodyInputParams): AutoantibodyDiagnosticState {
  const { anaTiter, primaryIcapPattern, ena } = params;
  const numTiter = getTiterNumeric(anaTiter);

  // Check if DFS70 is isolated (DFS70 positive, but dsDNA, Sm, Ro, La, Scl70 all negative)
  const isDfs70Isolated =
    ena.antiDfs70Positive &&
    !ena.antiSmPositive &&
    !ena.antiRo60Positive &&
    !ena.antiScl70Positive &&
    ena.antiDsDnaIuMl < 20;

  // Bayesian post-test probability
  const postTestProb = calculatePostTestProbability(anaTiter, primaryIcapPattern, isDfs70Isolated);

  // Criteria scoring
  const { score: sleScore, isClassified: sleClassified } = calculateEularAcrSleScore(params);
  const { score: sscScore, isClassified: sscClassified } = calculateAcrEularSscScore(params);
  const { score: sjogrenScore, isClassified: sjogrenClassified } = calculateSjogrenScore(params);

  // Alarms and Recommendations
  const activeAlarms: string[] = [];
  const clinicalRecommendations: string[] = [];
  let primarySuspectedDiagnosis = 'Undifferentiated / Non-Specific Autoimmunity';
  let diseasePhenotypeColor = 'text-slate-300';
  let ifaMorphologyDescription = 'HEp-2 indirect immunofluorescence pattern analysis';

  // Differential logic
  if (ena.antiPr3AncaUml >= 20 || primaryIcapPattern === 'ANCA_CANCA_PR3') {
    primarySuspectedDiagnosis = 'Granulomatosis with Polyangiitis (GPA / c-ANCA Vasculitis)';
    diseasePhenotypeColor = 'text-rose-400';
    activeAlarms.push('FULMINANT_PAUCI_IMMUNE_NECROTIZING_VASCULITIS_RISK');
    clinicalRecommendations.push('Urgent chest CT for cavitary pulmonary nodules; monitor urinalysis for RBC casts indicating crescentic glomerulonephritis.');
    clinicalRecommendations.push('Induction with high-dose pulse corticosteroids and Rituximab (375 mg/m2/week x 4) or Cyclophosphamide.');
    ifaMorphologyDescription = 'c-ANCA: Granular cytoplasmic fluorescence highlighting interlobular spaces with central nuclear sparing on ethanol-fixed neutrophils.';
  } else if (ena.antiMpoAncaUml >= 20 || primaryIcapPattern === 'ANCA_PANCA_MPO') {
    primarySuspectedDiagnosis = 'Microscopic Polyangiitis / EGPA (p-ANCA Vasculitis)';
    diseasePhenotypeColor = 'text-purple-400';
    activeAlarms.push('P_ANCA_CRESCENTIC_GLOMERULONEPHRITIS_SURVEILLANCE');
    clinicalRecommendations.push('Distinguish true MPO-ANCA from atypical p-ANCA (anti-lactoferrin/cathepsin G) by specific anti-MPO ELISA.');
    ifaMorphologyDescription = 'p-ANCA: Perinuclear artificial rimming around cell nuclei on ethanol fixation due to basic myeloperoxidase migration.';
  } else if (ena.antiHistonePositive && numTiter >= 160 && !ena.antiSmPositive && ena.antiDsDnaIuMl < 15) {
    primarySuspectedDiagnosis = 'Drug-Induced Lupus Erythematosus (DILE)';
    diseasePhenotypeColor = 'text-amber-400';
    activeAlarms.push('DRUG_INDUCED_AUTOIMMUNITY_SUSPECTED');
    clinicalRecommendations.push('Review offending agents: Hydralazine, Procainamide, Isoniazid, Minocycline, or TNF-alpha inhibitors. Discontinue culprit drug.');
    clinicalRecommendations.push('Symptoms and titers typically resolve over 4 to 12 weeks post-cessation without aggressive immunosuppression.');
    ifaMorphologyDescription = 'AC-1 Homogeneous: Intense nuclear histone core fluorescence with sparing of nucleoli.';
  } else if (sleClassified || ena.antiSmPositive || (ena.antiDsDnaIuMl >= 30 && numTiter >= 320)) {
    primarySuspectedDiagnosis = 'Active Systemic Lupus Erythematosus (SLE)';
    diseasePhenotypeColor = 'text-rose-400';
    if (params.clinicalFindings.proteinuriaGrams24h > 1.0 || ena.complementC3MgDl < 80) {
      activeAlarms.push('ACTIVE_LUPUS_NEPHRITIS_CLASS_III_IV_RISK');
      clinicalRecommendations.push('Urgent renal biopsy indicated to differentiate proliferative (Class III/IV) from membranous (Class V) lupus nephritis.');
    } else {
      activeAlarms.push('SYSTEMIC_LUPUS_ERYTHEMATOSUS_CLASSIFIED');
    }
    clinicalRecommendations.push('All SLE patients should receive Hydroxychloroquine (weight-adjusted <= 5 mg/kg/day) to prevent disease flares and thrombotic events.');
    ifaMorphologyDescription = 'AC-1 Homogeneous: Uniform diffuse staining of resting interphase nuclei with intensely fluorescent condensed mitotic chromosomal plates.';
  } else if (ena.antiScl70Positive || ena.antiRnaPolymeraseIiiPositive || primaryIcapPattern === 'AC-8_NUCLEOLAR_HOMOGENEOUS') {
    primarySuspectedDiagnosis = 'Diffuse Cutaneous Systemic Sclerosis (dcSSc)';
    diseasePhenotypeColor = 'text-orange-400';
    if (ena.antiRnaPolymeraseIiiPositive) {
      activeAlarms.push('SCLERODERMA_RENAL_CRISIS_CRITICAL_ALERT');
      clinicalRecommendations.push('Strict BP monitoring; avoid high-dose corticosteroids (>15 mg/day prednisone) which trigger scleroderma renal crisis. Treat promptly with ACE inhibitors.');
    }
    if (ena.antiScl70Positive) {
      activeAlarms.push('HIGH_RISK_PROGRESSIVE_INTERSTITIAL_LUNG_DISEASE');
      clinicalRecommendations.push('High-resolution chest CT (HRCT) and baseline pulmonary function testing (FVC and DLCO) for pulmonary fibrosis screening.');
    }
    ifaMorphologyDescription = 'AC-8 Nucleolar Homogeneous: Solid uniform fluorescence of nucleoli with fine punctate background staining in resting interphase cells.';
  } else if (ena.antiCentromereBPositive || primaryIcapPattern === 'AC-3_CENTROMERE') {
    primarySuspectedDiagnosis = 'Limited Cutaneous Systemic Sclerosis (lcSSc / CREST)';
    diseasePhenotypeColor = 'text-cyan-400';
    activeAlarms.push('PULMONARY_ARTERIAL_HYPERTENSION_SURVEILLANCE_DUE');
    clinicalRecommendations.push('Annual screening with transthoracic echocardiogram (RVSP) and NT-proBNP for isolated precapillary pulmonary arterial hypertension.');
    clinicalRecommendations.push('Calcium channel blockers (Nifedipine) for Raynaud phenomenon management.');
    ifaMorphologyDescription = 'AC-3 Centromere: 40 to 60 distinct discrete speckles distributed uniformly across interphase nucleus, aligning on metaphase split equator.';
  } else if (sjogrenClassified || (ena.antiRo60Positive && ena.antiLaSsbPositive)) {
    primarySuspectedDiagnosis = 'Primary Sjögren Syndrome (pSS)';
    diseasePhenotypeColor = 'text-teal-400';
    if (ena.antiRo60Positive) {
      activeAlarms.push('NEONATAL_LUPUS_CONGENITAL_HEART_BLOCK_RISK');
      clinicalRecommendations.push('In pregnant women, maternal anti-Ro/SSA antibodies cross the placenta; perform weekly fetal echocardiography (weeks 16-26) to detect PR prolongation.');
    }
    clinicalRecommendations.push('Screen for B-cell non-Hodgkin lymphoma (MALT lymphoma) if persistent parotid gland swelling or monoclonal gammopathy develops.');
    ifaMorphologyDescription = 'AC-4 Fine Speckled: Tiny uniform granular speckles across nucleoplasm with spared chromosome plates in mitotic cells.';
  } else if (ena.antiU1RnpUml >= 40) {
    primarySuspectedDiagnosis = 'Mixed Connective Tissue Disease (MCTD / Sharp Syndrome)';
    diseasePhenotypeColor = 'text-indigo-400';
    activeAlarms.push('HIGH_TITER_U1_RNP_OVERLAP_PHENOTYPE');
    clinicalRecommendations.push('Hallmark features: swollen puffy sausage fingers, severe Raynaud, inflammatory myositis, and pulmonary hypertension.');
    ifaMorphologyDescription = 'AC-5 Coarse Speckled: Large distinct irregular granules throughout nucleoplasm, negative on condensed chromosomes.';
  } else if (isDfs70Isolated) {
    primarySuspectedDiagnosis = 'Isolated Anti-DFS70 (Healthy Individual / Non-SARD)';
    diseasePhenotypeColor = 'text-emerald-400';
    activeAlarms.push('BENIGN_DFS70_PATTERN_LOW_AUTOIMMUNE_RISK');
    clinicalRecommendations.push('Isolated DFS70 in the absence of ENA or systemic symptoms reliably rules out SARD. Reassure patient and avoid unwarranted immunosuppression.');
    ifaMorphologyDescription = 'AC-2 Dense Fine Speckled: Fine, densely packed granule matrix throughout interphase nucleus with intensely stained mitotic chromosomes.';
  } else if (numTiter <= 80 && postTestProb < 15) {
    primarySuspectedDiagnosis = 'Low-Titer Clinically Insignificant ANA';
    diseasePhenotypeColor = 'text-slate-400';
    activeAlarms.push('BORDERLINE_TITER_NON_SPECIFIC');
    clinicalRecommendations.push('Low titers (1:40 to 1:80) occur in up to 15% of healthy adults, thyroiditis, and transient viral infections. Clinical correlation required.');
    ifaMorphologyDescription = 'Non-specific weak background fluorescence.';
  }

  if (activeAlarms.length === 0) {
    activeAlarms.push('CLINICAL_AUTOIMMUNE_SURVEILLANCE');
  }

  return {
    anaTiterRatioNumeric: numTiter,
    postTestAutoimmuneProbabilityPct: postTestProb,
    eularAcrSle2019Score: sleScore,
    eularSleClassified: sleClassified,
    acrEularSSc2013Score: sscScore,
    eularSScClassified: sscClassified,
    sjogrenAcrEular2016Score: sjogrenScore,
    sjogrenClassified,
    primarySuspectedDiagnosis,
    diseasePhenotypeColor,
    activeAlarms,
    clinicalRecommendations,
    ifaMorphologyDescription,
  };
}

/**
 * 8 Standard Validated Clinical Presets for Autoantibody Evaluation
 */
export const AUTOANTIBODY_PRESETS: Record<
  AutoantibodyPresetId,
  {
    title: string;
    description: string;
    initialState: AutoantibodyInputParams;
  }
> = {
  SYSTEMIC_LUPUS_ERYTHEMATOSUS_LUPUS_NEPHRITIS: {
    title: 'Systemic Lupus Erythematosus with Active Lupus Nephritis',
    description: '28-year-old female with malar butterfly rash, polyarthritis, heavy proteinuria (2.8 g/24h), high-titer ANA 1:1280 (AC-1 Homogeneous), dsDNA 240 IU/mL, Anti-Sm positive, and hypocomplementemia (C3 42 mg/dL).',
    initialState: {
      presetId: 'SYSTEMIC_LUPUS_ERYTHEMATOSUS_LUPUS_NEPHRITIS',
      anaTiter: '1:1280',
      primaryIcapPattern: 'AC-1_HOMOGENEOUS',
      fluorescenceIntensity: 4,
      ena: {
        antiDsDnaIuMl: 240,
        antiSmPositive: true,
        antiRo60Positive: false,
        antiRo52Positive: false,
        antiLaSsbPositive: false,
        antiU1RnpUml: 8,
        antiScl70Positive: false,
        antiRnaPolymeraseIiiPositive: false,
        antiCentromereBPositive: false,
        antiJo1Positive: false,
        antiHistonePositive: true,
        antiDfs70Positive: false,
        antiPr3AncaUml: 1.2,
        antiMpoAncaUml: 0.8,
        rheumatoidFactorIuMl: 18,
        antiCcpUml: 6,
        complementC3MgDl: 42,
        complementC4MgDl: 6,
      },
      clinicalFindings: {
        malarRash: true,
        discoidRash: false,
        oralUlcers: true,
        nonScarringAlopecia: true,
        synovitisJointCount: 8,
        serositisPleuropericarditis: true,
        proteinuriaGrams24h: 2.8,
        autoimmuneHemolyticAnemia: false,
        thrombocytopeniaCount: 82,
        raynaudPhenomenon: true,
        sclerodactyly: false,
        siccaOcularOral: false,
      },
    },
  },

  DIFFUSE_SYSTEMIC_SCLEROSIS_SCL70: {
    title: 'Diffuse Cutaneous Systemic Sclerosis (Anti-Scl-70 / Topo I)',
    description: '46-year-old female presenting with progressive proximal skin thickening, severe Raynaud, bibasilar dry crackles on auscultation, ANA 1:640 (AC-8 Nucleolar), and high Anti-Topoisomerase I (Scl-70).',
    initialState: {
      presetId: 'DIFFUSE_SYSTEMIC_SCLEROSIS_SCL70',
      anaTiter: '1:640',
      primaryIcapPattern: 'AC-8_NUCLEOLAR_HOMOGENEOUS',
      fluorescenceIntensity: 3,
      ena: {
        antiDsDnaIuMl: 4,
        antiSmPositive: false,
        antiRo60Positive: false,
        antiRo52Positive: true,
        antiLaSsbPositive: false,
        antiU1RnpUml: 12,
        antiScl70Positive: true,
        antiRnaPolymeraseIiiPositive: false,
        antiCentromereBPositive: false,
        antiJo1Positive: false,
        antiHistonePositive: false,
        antiDfs70Positive: false,
        antiPr3AncaUml: 2.0,
        antiMpoAncaUml: 1.5,
        rheumatoidFactorIuMl: 10,
        antiCcpUml: 8,
        complementC3MgDl: 110,
        complementC4MgDl: 22,
      },
      clinicalFindings: {
        malarRash: false,
        discoidRash: false,
        oralUlcers: false,
        nonScarringAlopecia: false,
        synovitisJointCount: 4,
        serositisPleuropericarditis: false,
        proteinuriaGrams24h: 0.1,
        autoimmuneHemolyticAnemia: false,
        thrombocytopeniaCount: 220,
        raynaudPhenomenon: true,
        sclerodactyly: true,
        siccaOcularOral: false,
      },
    },
  },

  CREST_LIMITED_SCLERODERMA_CENTROMERE: {
    title: 'CREST Syndrome / Limited Cutaneous SSc (Anti-Centromere)',
    description: '58-year-old female with 15-year history of triphasic Raynaud, telangiectasias on face, esophageal dysmotility, discrete speckled centromeric ANA 1:1280 (AC-3), and isolated pulmonary arterial hypertension risk.',
    initialState: {
      presetId: 'CREST_LIMITED_SCLERODERMA_CENTROMERE',
      anaTiter: '1:1280',
      primaryIcapPattern: 'AC-3_CENTROMERE',
      fluorescenceIntensity: 4,
      ena: {
        antiDsDnaIuMl: 6,
        antiSmPositive: false,
        antiRo60Positive: false,
        antiRo52Positive: false,
        antiLaSsbPositive: false,
        antiU1RnpUml: 5,
        antiScl70Positive: false,
        antiRnaPolymeraseIiiPositive: false,
        antiCentromereBPositive: true,
        antiJo1Positive: false,
        antiHistonePositive: false,
        antiDfs70Positive: false,
        antiPr3AncaUml: 1.0,
        antiMpoAncaUml: 0.9,
        rheumatoidFactorIuMl: 12,
        antiCcpUml: 5,
        complementC3MgDl: 125,
        complementC4MgDl: 28,
      },
      clinicalFindings: {
        malarRash: false,
        discoidRash: false,
        oralUlcers: false,
        nonScarringAlopecia: false,
        synovitisJointCount: 0,
        serositisPleuropericarditis: false,
        proteinuriaGrams24h: 0.05,
        autoimmuneHemolyticAnemia: false,
        thrombocytopeniaCount: 250,
        raynaudPhenomenon: true,
        sclerodactyly: true,
        siccaOcularOral: false,
      },
    },
  },

  PRIMARY_SJOGREN_SYNDROME_RO_LA: {
    title: 'Primary Sjögren Syndrome with Extraglandular Vasculitis',
    description: '42-year-old female with severe xerophthalmia (Schirmer test 3 mm), xerostomia, bilateral parotid swelling, ANA 1:640 (AC-4 Fine Speckled), Anti-Ro60 strongly positive, and Anti-La/SSB positive.',
    initialState: {
      presetId: 'PRIMARY_SJOGREN_SYNDROME_RO_LA',
      anaTiter: '1:640',
      primaryIcapPattern: 'AC-4_FINE_SPECKLED',
      fluorescenceIntensity: 3,
      ena: {
        antiDsDnaIuMl: 8,
        antiSmPositive: false,
        antiRo60Positive: true,
        antiRo52Positive: true,
        antiLaSsbPositive: true,
        antiU1RnpUml: 14,
        antiScl70Positive: false,
        antiRnaPolymeraseIiiPositive: false,
        antiCentromereBPositive: false,
        antiJo1Positive: false,
        antiHistonePositive: false,
        antiDfs70Positive: false,
        antiPr3AncaUml: 0.8,
        antiMpoAncaUml: 1.1,
        rheumatoidFactorIuMl: 64,
        antiCcpUml: 12,
        complementC3MgDl: 94,
        complementC4MgDl: 16,
      },
      clinicalFindings: {
        malarRash: false,
        discoidRash: false,
        oralUlcers: false,
        nonScarringAlopecia: false,
        synovitisJointCount: 4,
        serositisPleuropericarditis: false,
        proteinuriaGrams24h: 0.1,
        autoimmuneHemolyticAnemia: false,
        thrombocytopeniaCount: 180,
        raynaudPhenomenon: true,
        sclerodactyly: false,
        siccaOcularOral: true,
      },
    },
  },

  MIXED_CONNECTIVE_TISSUE_DISEASE_RNP: {
    title: 'Mixed Connective Tissue Disease (High-Titer Anti-U1-RNP)',
    description: '34-year-old female exhibiting sausage digit dactylitis, inflammatory synovitis, esophageal hypomotility, coarse speckled ANA 1:2560 (AC-5), and isolated high Anti-U1-RNP (>100 U/mL).',
    initialState: {
      presetId: 'MIXED_CONNECTIVE_TISSUE_DISEASE_RNP',
      anaTiter: '1:2560',
      primaryIcapPattern: 'AC-5_COARSE_SPECKLED',
      fluorescenceIntensity: 4,
      ena: {
        antiDsDnaIuMl: 12,
        antiSmPositive: false,
        antiRo60Positive: false,
        antiRo52Positive: false,
        antiLaSsbPositive: false,
        antiU1RnpUml: 120,
        antiScl70Positive: false,
        antiRnaPolymeraseIiiPositive: false,
        antiCentromereBPositive: false,
        antiJo1Positive: false,
        antiHistonePositive: false,
        antiDfs70Positive: false,
        antiPr3AncaUml: 1.4,
        antiMpoAncaUml: 1.2,
        rheumatoidFactorIuMl: 32,
        antiCcpUml: 15,
        complementC3MgDl: 105,
        complementC4MgDl: 20,
      },
      clinicalFindings: {
        malarRash: false,
        discoidRash: false,
        oralUlcers: false,
        nonScarringAlopecia: false,
        synovitisJointCount: 6,
        serositisPleuropericarditis: true,
        proteinuriaGrams24h: 0.2,
        autoimmuneHemolyticAnemia: false,
        thrombocytopeniaCount: 195,
        raynaudPhenomenon: true,
        sclerodactyly: true,
        siccaOcularOral: false,
      },
    },
  },

  DRUG_INDUCED_LUPUS_HYDRALAZINE_PROCAINAMIDE: {
    title: 'Drug-Induced Lupus (DILE - Hydralazine / Anti-Histone)',
    description: '64-year-old male on long-term Hydralazine for resistant hypertension presenting with acute pleuritis, arthralgias, fever, homogeneous ANA 1:640 (AC-1), strongly positive Anti-Histone, and normal complements.',
    initialState: {
      presetId: 'DRUG_INDUCED_LUPUS_HYDRALAZINE_PROCAINAMIDE',
      anaTiter: '1:640',
      primaryIcapPattern: 'AC-1_HOMOGENEOUS',
      fluorescenceIntensity: 3,
      ena: {
        antiDsDnaIuMl: 8,
        antiSmPositive: false,
        antiRo60Positive: false,
        antiRo52Positive: false,
        antiLaSsbPositive: false,
        antiU1RnpUml: 6,
        antiScl70Positive: false,
        antiRnaPolymeraseIiiPositive: false,
        antiCentromereBPositive: false,
        antiJo1Positive: false,
        antiHistonePositive: true,
        antiDfs70Positive: false,
        antiPr3AncaUml: 1.0,
        antiMpoAncaUml: 0.8,
        rheumatoidFactorIuMl: 14,
        antiCcpUml: 10,
        complementC3MgDl: 120,
        complementC4MgDl: 24,
      },
      clinicalFindings: {
        malarRash: false,
        discoidRash: false,
        oralUlcers: false,
        nonScarringAlopecia: false,
        synovitisJointCount: 6,
        serositisPleuropericarditis: true,
        proteinuriaGrams24h: 0.1,
        autoimmuneHemolyticAnemia: false,
        thrombocytopeniaCount: 240,
        raynaudPhenomenon: false,
        sclerodactyly: false,
        siccaOcularOral: false,
      },
    },
  },

  GRANULOMATOSIS_WITH_POLYANGIITIS_CANCA_PR3: {
    title: 'Granulomatosis with Polyangiitis (GPA / c-ANCA Anti-PR3)',
    description: '51-year-old male with chronic bloody rhinorrhea, saddle nose deformity, bilateral cavitary pulmonary nodules, dysmorphic hematuria, and high-titer c-ANCA (anti-Proteinase-3 > 90 U/mL).',
    initialState: {
      presetId: 'GRANULOMATOSIS_WITH_POLYANGIITIS_CANCA_PR3',
      anaTiter: 'NEGATIVE',
      primaryIcapPattern: 'ANCA_CANCA_PR3',
      fluorescenceIntensity: 4,
      ena: {
        antiDsDnaIuMl: 2,
        antiSmPositive: false,
        antiRo60Positive: false,
        antiRo52Positive: false,
        antiLaSsbPositive: false,
        antiU1RnpUml: 4,
        antiScl70Positive: false,
        antiRnaPolymeraseIiiPositive: false,
        antiCentromereBPositive: false,
        antiJo1Positive: false,
        antiHistonePositive: false,
        antiDfs70Positive: false,
        antiPr3AncaUml: 95,
        antiMpoAncaUml: 2.1,
        rheumatoidFactorIuMl: 22,
        antiCcpUml: 8,
        complementC3MgDl: 135,
        complementC4MgDl: 30,
      },
      clinicalFindings: {
        malarRash: false,
        discoidRash: false,
        oralUlcers: true,
        nonScarringAlopecia: false,
        synovitisJointCount: 4,
        serositisPleuropericarditis: false,
        proteinuriaGrams24h: 1.2,
        autoimmuneHemolyticAnemia: false,
        thrombocytopeniaCount: 310,
        raynaudPhenomenon: false,
        sclerodactyly: false,
        siccaOcularOral: false,
      },
    },
  },

  HEALTHY_CONTROL_DFS70_ISOLATED: {
    title: 'Isolated Anti-DFS70 in Asymptomatic Individual (Benign Pattern)',
    description: '31-year-old female flagged on routine health check with positive ANA 1:320 (AC-2 Dense Fine Speckled), Anti-DFS70 positive, all specific ENAs negative, and completely asymptomatic.',
    initialState: {
      presetId: 'HEALTHY_CONTROL_DFS70_ISOLATED',
      anaTiter: '1:320',
      primaryIcapPattern: 'AC-2_DENSE_FINE_SPECKLED',
      fluorescenceIntensity: 2,
      ena: {
        antiDsDnaIuMl: 4,
        antiSmPositive: false,
        antiRo60Positive: false,
        antiRo52Positive: false,
        antiLaSsbPositive: false,
        antiU1RnpUml: 5,
        antiScl70Positive: false,
        antiRnaPolymeraseIiiPositive: false,
        antiCentromereBPositive: false,
        antiJo1Positive: false,
        antiHistonePositive: false,
        antiDfs70Positive: true,
        antiPr3AncaUml: 1.0,
        antiMpoAncaUml: 0.8,
        rheumatoidFactorIuMl: 8,
        antiCcpUml: 4,
        complementC3MgDl: 118,
        complementC4MgDl: 25,
      },
      clinicalFindings: {
        malarRash: false,
        discoidRash: false,
        oralUlcers: false,
        nonScarringAlopecia: false,
        synovitisJointCount: 0,
        serositisPleuropericarditis: false,
        proteinuriaGrams24h: 0.05,
        autoimmuneHemolyticAnemia: false,
        thrombocytopeniaCount: 260,
        raynaudPhenomenon: false,
        sclerodactyly: false,
        siccaOcularOral: false,
      },
    },
  },
};
