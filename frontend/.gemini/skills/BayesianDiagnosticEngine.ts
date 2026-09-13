/**
 * BayesianDiagnosticEngine.ts
 * Clinical Diagnostic Reasoning, Bayesian Likelihood Ratio (LR) Probability Cascades,
 * Fagan Nomogram Geometry & Pauker-Kassirer Threshold Decision Analysis.
 * 
 * Location: frontend/.gemini/skills/BayesianDiagnosticEngine.ts
 */

export interface DiagnosticTest {
  id: string;
  name: string;
  targetCondition: string;
  sensitivity: number; // 0.0 to 1.0 (e.g. 0.95 = 95%)
  specificity: number; // 0.0 to 1.0 (e.g. 0.88 = 88%)
  lrPositive: number;  // sens / (1 - spec)
  lrNegative: number;  // (1 - sens) / spec
  costUsd: number;
  invasivenessRisk: 'negligible' | 'low' | 'moderate' | 'high';
  turnaroundTime: string;
  description: string;
}

export interface CascadeStep {
  test: DiagnosticTest;
  result: 'positive' | 'negative';
  preTestProb: number;
  postTestProb: number;
  preTestOdds: number;
  postTestOdds: number;
  appliedLR: number;
}

export interface ContingencyTable {
  totalCohort: number;
  prevalence: number;
  truePositives: number;
  falsePositives: number;
  falseNegatives: number;
  trueNegatives: number;
  ppv: number; // Positive Predictive Value
  npv: number; // Negative Predictive Value
  accuracy: number;
  f1Score: number;
  numberNeededToDiagnose: number;
}

export interface PaukerKassirerThresholds {
  treatmentBenefit: number;   // B_tx: utility gain from treating diseased patient (0-100)
  treatmentHarm: number;      // R_tx: utility loss from treating non-diseased patient (0-100)
  testHarm: number;           // R_test: morbidity/cost of testing (0-100)
  testingThreshold: number;   // T_test = (R_test + R_tx * (1 - spec)) / (B_tx * sens + R_tx * (1 - spec))
  treatmentThreshold: number; // T_rx = (R_tx * spec - R_test) / (B_tx * (1 - sens) + R_tx * spec)
  simpleTestingThreshold: number; // R_tx / (B_tx + R_tx) baseline
  currentAction: 'NO_TEST_NO_TREAT' | 'TEST_INDICATED' | 'TREAT_IMMEDIATELY';
  actionRationale: string;
}

export interface DiagnosticScenario {
  id: string;
  title: string;
  condition: string;
  clinicalPresentation: string;
  defaultPreTestProb: number; // 0.0 to 1.0
  recommendedTests: DiagnosticTest[];
  clinicalGoldStandard: string;
  pitfalls: string[];
}

// Convert Probability to Odds: Odds = P / (1 - P)
export function probabilityToOdds(p: number): number {
  const clamped = Math.min(Math.max(p, 0.0001), 0.9999);
  return clamped / (1 - clamped);
}

// Convert Odds to Probability: P = Odds / (1 + Odds)
export function oddsToProbability(odds: number): number {
  if (odds <= 0) return 0;
  return odds / (1 + odds);
}

// Calculate Likelihood Ratios from Sensitivity & Specificity
export function calculateLikelihoodRatios(sensitivity: number, specificity: number): { lrPositive: number; lrNegative: number } {
  const sens = Math.min(Math.max(sensitivity, 0.001), 0.999);
  const spec = Math.min(Math.max(specificity, 0.001), 0.999);

  const lrPositive = Number((sens / (1 - spec)).toFixed(3));
  const lrNegative = Number(((1 - sens) / spec).toFixed(3));

  return { lrPositive, lrNegative };
}

// Apply a single diagnostic test in Bayesian update
export function applyBayesianUpdate(preTestProb: number, test: DiagnosticTest, result: 'positive' | 'negative'): CascadeStep {
  const preOdds = probabilityToOdds(preTestProb);
  const appliedLR = result === 'positive' ? test.lrPositive : test.lrNegative;
  const postOdds = preOdds * appliedLR;
  const postProb = oddsToProbability(postOdds);

  return {
    test,
    result,
    preTestProb: Number(preTestProb.toFixed(4)),
    postTestProb: Number(postProb.toFixed(4)),
    preTestOdds: Number(preOdds.toFixed(4)),
    postTestOdds: Number(postOdds.toFixed(4)),
    appliedLR: Number(appliedLR.toFixed(3)),
  };
}

// Apply a full sequential cascade of diagnostic tests
export function computeDiagnosticCascade(
  initialPreTestProb: number,
  sequence: { test: DiagnosticTest; result: 'positive' | 'negative' }[]
): { steps: CascadeStep[]; finalProbability: number } {
  let currentProb = initialPreTestProb;
  const steps: CascadeStep[] = [];

  for (const item of sequence) {
    const step = applyBayesianUpdate(currentProb, item.test, item.result);
    steps.push(step);
    currentProb = step.postTestProb;
  }

  return {
    steps,
    finalProbability: Number(currentProb.toFixed(4)),
  };
}

// Calculate 2x2 Natural Frequency Matrix given cohort size and prevalence
export function computeContingencyTable(
  prevalence: number,
  test: DiagnosticTest,
  totalCohort: number = 1000
): ContingencyTable {
  const diseased = totalCohort * prevalence;
  const nonDiseased = totalCohort * (1 - prevalence);

  const tp = Math.round(diseased * test.sensitivity);
  const fn = Math.round(diseased * (1 - test.sensitivity));
  const fp = Math.round(nonDiseased * (1 - test.specificity));
  const tn = Math.round(nonDiseased * test.specificity);

  const ppv = (tp + fp) > 0 ? Number((tp / (tp + fp)).toFixed(4)) : 0;
  const npv = (tn + fn) > 0 ? Number((tn / (tn + fn)).toFixed(4)) : 0;
  const accuracy = Number(((tp + tn) / totalCohort).toFixed(4));
  const precision = ppv;
  const recall = test.sensitivity;
  const f1Score = (precision + recall) > 0 ? Number(((2 * precision * recall) / (precision + recall)).toFixed(4)) : 0;

  // Number Needed to Diagnose (Youden index formulation: 1 / (Sens + Spec - 1))
  const youden = test.sensitivity + test.specificity - 1;
  const nnd = youden > 0 ? Number((1 / youden).toFixed(2)) : 999;

  return {
    totalCohort,
    prevalence,
    truePositives: tp,
    falsePositives: fp,
    falseNegatives: fn,
    trueNegatives: tn,
    ppv,
    npv,
    accuracy,
    f1Score,
    numberNeededToDiagnose: nnd,
  };
}

// Compute Pauker-Kassirer Decision Thresholds
export function computePaukerKassirerThresholds(
  treatmentBenefit: number, // 1-100 scale (gain of treating diseased)
  treatmentHarm: number,    // 1-100 scale (harm of treating healthy)
  testHarm: number,         // 0-50 scale (harm/burden of the test itself)
  test: DiagnosticTest,
  currentPreTestProb: number
): PaukerKassirerThresholds {
  const B = Math.max(treatmentBenefit, 1);
  const R = Math.max(treatmentHarm, 1);
  const C = Math.max(testHarm, 0);

  // Simplified baseline threshold without testing: T_rx = R / (B + R)
  const simpleThreshold = Number((R / (B + R)).toFixed(4));

  // Pauker-Kassirer testing threshold:
  // T_test: probability where expected utility of testing equals expected utility of doing nothing
  const denomTest = (B * test.sensitivity) + (R * (1 - test.specificity));
  const numTest = C + (R * (1 - test.specificity));
  const testingThreshold = denomTest > 0 ? Number(Math.min(Math.max(numTest / denomTest, 0), 0.99).toFixed(4)) : 0.1;

  // Pauker-Kassirer treatment threshold:
  // T_rx: probability where expected utility of testing equals expected utility of treating immediately
  const denomRx = (B * (1 - test.sensitivity)) + (R * test.specificity);
  const numRx = (R * test.specificity) - C;
  const treatmentThreshold = denomRx > 0 ? Number(Math.min(Math.max(numRx / denomRx, testingThreshold + 0.05), 0.99).toFixed(4)) : 0.85;

  let currentAction: 'NO_TEST_NO_TREAT' | 'TEST_INDICATED' | 'TREAT_IMMEDIATELY';
  let actionRationale = '';

  if (currentPreTestProb < testingThreshold) {
    currentAction = 'NO_TEST_NO_TREAT';
    actionRationale = `Pre-test probability (${(currentPreTestProb * 100).toFixed(1)}%) is below Testing Threshold (${(testingThreshold * 100).toFixed(1)}%). The burden/harm of testing outweighs potential diagnostic gain. Withhold further testing and treatment.`;
  } else if (currentPreTestProb >= treatmentThreshold) {
    currentAction = 'TREAT_IMMEDIATELY';
    actionRationale = `Pre-test probability (${(currentPreTestProb * 100).toFixed(1)}%) exceeds Treatment Threshold (${(treatmentThreshold * 100).toFixed(1)}%). The high likelihood of disease and cost of delaying care justify immediate empirical therapy without awaiting testing.`;
  } else {
    currentAction = 'TEST_INDICATED';
    actionRationale = `Pre-test probability (${(currentPreTestProb * 100).toFixed(1)}%) falls in the Pauker-Kassirer diagnostic window [${(testingThreshold * 100).toFixed(1)}% - ${(treatmentThreshold * 100).toFixed(1)}%]. Testing will provide actionable discrimination between treatment and observation.`;
  }

  return {
    treatmentBenefit: B,
    treatmentHarm: R,
    testHarm: C,
    testingThreshold,
    treatmentThreshold,
    simpleTestingThreshold: simpleThreshold,
    currentAction,
    actionRationale,
  };
}

// Master Presets Library of Clinical Diagnostic Scenarios
export const DIAGNOSTIC_SCENARIOS: DiagnosticScenario[] = [
  {
    id: 'pulmonary-embolism',
    title: 'Acute Pulmonary Embolism (PE)',
    condition: 'Venous Thromboembolism / PE',
    clinicalPresentation: '54yo female, 5 days post-op knee arthroplasty, presents with sudden pleuritic chest pain, dyspnea, and tachycardia (HR 118 bpm).',
    defaultPreTestProb: 0.30, // 30% intermediate risk Wells score
    clinicalGoldStandard: 'CT Pulmonary Angiography (CTPA) or Catheter Pulmonary Angiogram',
    pitfalls: [
      'Base-rate fallacy: In very low risk patients (Wells < 2), a positive D-dimer has a poor PPV (< 20%), leading to unnecessary radiation and contrast exposure.',
      'Age-adjusted D-dimer (age × 10 µg/L if > 50) significantly improves specificity without sacrificing sensitivity.',
    ],
    recommendedTests: [
      {
        id: 'wells-pe',
        name: 'Wells Clinical Prediction Rule (High Score)',
        targetCondition: 'Pulmonary Embolism',
        sensitivity: 0.78,
        specificity: 0.84,
        lrPositive: 4.88,
        lrNegative: 0.26,
        costUsd: 0,
        invasivenessRisk: 'negligible',
        turnaroundTime: 'Immediate',
        description: 'Validated bedside risk stratification based on clinical signs of DVT, alternative diagnosis less likely, tachycardia, immobilization, and hemoptysis.',
      },
      {
        id: 'd-dimer-elisa',
        name: 'High-Sensitivity D-Dimer (ELISA / Turbidimetric)',
        targetCondition: 'Pulmonary Embolism',
        sensitivity: 0.97,
        specificity: 0.45,
        lrPositive: 1.76,
        lrNegative: 0.07,
        costUsd: 45,
        invasivenessRisk: 'low',
        turnaroundTime: '45 mins',
        description: 'Fibrin degradation product. Outstanding negative predictive value; near-zero LR- rules out PE in low/intermediate risk patients.',
      },
      {
        id: 'ctpa',
        name: 'CT Pulmonary Angiography (CTPA)',
        targetCondition: 'Pulmonary Embolism',
        sensitivity: 0.94,
        specificity: 0.96,
        lrPositive: 23.50,
        lrNegative: 0.06,
        costUsd: 850,
        invasivenessRisk: 'moderate',
        turnaroundTime: '60 mins',
        description: 'Definitive anatomical imaging visualizing intraluminal filling defects in main, lobar, or segmental pulmonary arteries.',
      },
      {
        id: 'lower-extremity-cocus',
        name: 'Compression Point-of-Care Ultrasound (POCUS CUS)',
        targetCondition: 'Deep Vein Thrombosis (PE source)',
        sensitivity: 0.90,
        specificity: 0.95,
        lrPositive: 18.00,
        lrNegative: 0.11,
        costUsd: 220,
        invasivenessRisk: 'negligible',
        turnaroundTime: '15 mins',
        description: 'Bedside 2-point or 3-point proximal lower extremity compression test for non-compressible common femoral or popliteal veins.',
      },
    ],
  },
  {
    id: 'acute-coronary-syndrome',
    title: 'Acute Coronary Syndrome / NSTEMI',
    condition: 'Myocardial Infarction',
    clinicalPresentation: '62yo male with type 2 diabetes and hypertension presents with 2 hours of substernal chest pressure radiating to the left jaw.',
    defaultPreTestProb: 0.40,
    clinicalGoldStandard: 'Invasive Coronary Angiography (ICA) + ESC 0/1-hour hs-cTn algorithm',
    pitfalls: [
      'Early presentation (< 1 hour from chest pain onset) can yield a false-negative baseline troponin; dynamic delta kinetics are mandatory.',
      'Troponin elevation occurs in renal failure, sepsis, and myocarditis without obstructive CAD (type 2 MI).',
    ],
    recommendedTests: [
      {
        id: 'heart-score',
        name: 'HEART Score (High Risk 7-10)',
        targetCondition: 'Major Adverse Cardiac Events (MACE)',
        sensitivity: 0.96,
        specificity: 0.68,
        lrPositive: 3.00,
        lrNegative: 0.06,
        costUsd: 0,
        invasivenessRisk: 'negligible',
        turnaroundTime: 'Immediate',
        description: 'History, ECG, Age, Risk Factors, Initial Troponin scoring system for acute chest pain.',
      },
      {
        id: 'baseline-hs-ctn',
        name: 'High-Sensitivity Troponin I (0-Hour Baseline)',
        targetCondition: 'Acute Myocardial Infarction',
        sensitivity: 0.88,
        specificity: 0.90,
        lrPositive: 8.80,
        lrNegative: 0.13,
        costUsd: 65,
        invasivenessRisk: 'low',
        turnaroundTime: '30 mins',
        description: 'Quantifies sub-nanogram myocardial necrosis. Identifies patients above 99th percentile upper reference limit.',
      },
      {
        id: 'delta-1hr-hs-ctn',
        name: '1-Hour hs-cTn Delta Rule-In Algorithm',
        targetCondition: 'Acute Myocardial Infarction',
        sensitivity: 0.98,
        specificity: 0.93,
        lrPositive: 14.00,
        lrNegative: 0.02,
        costUsd: 65,
        invasivenessRisk: 'low',
        turnaroundTime: '60 mins',
        description: 'ESC validated dynamic change (delta >= 5 ng/L) distinguishing acute plaque rupture from chronic baseline elevation.',
      },
    ],
  },
  {
    id: 'giant-cell-arteritis',
    title: 'Giant Cell Arteritis (GCA / Temporal Arteritis)',
    condition: 'Large Vessel Vasculitis',
    clinicalPresentation: '71yo female presents with new-onset severe unilateral temporal headache, jaw claudication with chewing, and transient visual blurring.',
    defaultPreTestProb: 0.50,
    clinicalGoldStandard: 'Temporal Artery Biopsy (TAB) or High-Resolution Temporal Artery Ultrasound',
    pitfalls: [
      'Normal ESR/CRP can occur in 4-5% of biopsy-proven GCA; high clinical suspicion warrants prompt corticosteroid initiation to prevent irreversible blindness.',
      'Biopsy skip lesions can produce false-negative histopathology (sensitivity ~85%).',
    ],
    recommendedTests: [
      {
        id: 'jaw-claudication-sign',
        name: 'Jaw Claudication Physical Finding',
        targetCondition: 'Giant Cell Arteritis',
        sensitivity: 0.38,
        specificity: 0.98,
        lrPositive: 19.00,
        lrNegative: 0.63,
        costUsd: 0,
        invasivenessRisk: 'negligible',
        turnaroundTime: 'Immediate',
        description: 'Ischemia of masseter muscles during mastication. One of the strongest physical examination predictors of GCA.',
      },
      {
        id: 'esr-crp-panel',
        name: 'ESR (> 50 mm/hr) & High-Sensitivity CRP',
        targetCondition: 'Giant Cell Arteritis',
        sensitivity: 0.95,
        specificity: 0.70,
        lrPositive: 3.17,
        lrNegative: 0.07,
        costUsd: 35,
        invasivenessRisk: 'low',
        turnaroundTime: '2 hours',
        description: 'Acute phase reactants. Normal values make active untreated GCA very unlikely (LR- 0.07).',
      },
      {
        id: 'temporal-ultrasound-halo',
        name: 'Temporal Artery Color Doppler Ultrasound (Halo Sign)',
        targetCondition: 'Giant Cell Arteritis',
        sensitivity: 0.80,
        specificity: 0.94,
        lrPositive: 13.33,
        lrNegative: 0.21,
        costUsd: 250,
        invasivenessRisk: 'negligible',
        turnaroundTime: '45 mins',
        description: 'Non-compressible hypoechoic circumferential wall thickening (halo sign) reflecting vascular wall transmural inflammation.',
      },
      {
        id: 'temporal-artery-biopsy',
        name: 'Temporal Artery Histopathology (TAB)',
        targetCondition: 'Giant Cell Arteritis',
        sensitivity: 0.85,
        specificity: 0.99,
        lrPositive: 85.00,
        lrNegative: 0.15,
        costUsd: 1400,
        invasivenessRisk: 'moderate',
        turnaroundTime: '48 hours',
        description: 'Definitive gold standard. Demonstrates transmural mononuclear infiltrate, internal elastic lamina fragmentation, and multinucleated giant cells.',
      },
    ],
  },
  {
    id: 'acute-bacterial-meningitis',
    title: 'Acute Bacterial Meningitis in Adult',
    condition: 'Central Nervous System Infection',
    clinicalPresentation: '28yo male presents with high fever, acute severe headache, photophobia, altered mentation, and neck stiffness (Kernig positive).',
    defaultPreTestProb: 0.45,
    clinicalGoldStandard: 'CSF Gram Stain, Culture & Multiplex FilmArray PCR',
    pitfalls: [
      'Absence of classic triad (fever, neck stiffness, altered mental status) does not rule out meningitis; 95% have at least 2 of 4 signs (including headache).',
      'Never delay empiric Ceftriaxone + Vancomycin + Dexamethasone for a head CT if bacterial meningitis is strongly suspected.',
    ],
    recommendedTests: [
      {
        id: 'csf-pleocytosis-wbc',
        name: 'CSF WBC > 1,000/µL with Neutrophilic Predominance',
        targetCondition: 'Bacterial Meningitis',
        sensitivity: 0.88,
        specificity: 0.96,
        lrPositive: 22.00,
        lrNegative: 0.13,
        costUsd: 120,
        invasivenessRisk: 'moderate',
        turnaroundTime: '1 hour',
        description: 'Marked cerebrospinal fluid leukocytosis with > 80% polymorphonuclear leukocytes.',
      },
      {
        id: 'csf-blood-glucose-ratio',
        name: 'CSF-to-Serum Glucose Ratio < 0.40',
        targetCondition: 'Bacterial Meningitis',
        sensitivity: 0.80,
        specificity: 0.98,
        lrPositive: 40.00,
        lrNegative: 0.20,
        costUsd: 30,
        invasivenessRisk: 'moderate',
        turnaroundTime: '1 hour',
        description: 'Bacteria consume glucose and impair facilitated transport across blood-brain barrier. High specificity for bacterial etiology.',
      },
      {
        id: 'csf-multiplex-pcr',
        name: 'BioFire FilmArray Meningitis/Encephalitis PCR Panel',
        targetCondition: 'Specific Pathogen ID (S. pneumo, N. meningitidis, HSV, etc.)',
        sensitivity: 0.96,
        specificity: 0.99,
        lrPositive: 96.00,
        lrNegative: 0.04,
        costUsd: 480,
        invasivenessRisk: 'low',
        turnaroundTime: '1.5 hours',
        description: 'Comprehensive 14-target syndromic multiplex PCR detecting common bacterial and viral CNS pathogens in under 2 hours.',
      },
    ],
  },
];
