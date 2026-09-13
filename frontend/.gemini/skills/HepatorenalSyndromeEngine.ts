/**
 * HepatorenalSyndromeEngine.ts
 * Hepatology, Nephrology & Critical Care Simulation Engine:
 * Hepatorenal Syndrome (HRS-AKI), SBP & Terlipressin Precision Workstation:
 * - ICA-AKI Diagnostic Criteria & Staging (Stage 1A, 1B, 2, 3)
 * - Pathophysiology: Splanchnic Arterial Vasodilation & Effective Arterial Hypovolemia
 * - 48-Hour Albumin Volume Challenge (1 g/kg/day up to 100 g/day)
 * - Differential Diagnosis: HRS-AKI vs Acute Tubular Necrosis (ATN) vs Prerenal Azotemia
 *   (UNa, FeNa, FeUrea, urinary NGAL, microscopic sediment)
 * - Vasoactive Pharmacotherapy: Terlipressin + IV Albumin vs Norepinephrine vs Midodrine/Octreotide
 * - CONFIRM Trial Black Box Warning: Hypoxemic Respiratory Failure Hazard (SpO2 monitoring)
 * - Large-Volume Paracentesis (LVP) & Post-Paracentesis Circulatory Dysfunction (PPCD) Prevention (8 g/L albumin)
 * - Spontaneous Bacterial Peritonitis (SBP) Protocol: Sort Regimen (Albumin 1.5 g/kg Day 1, 1.0 g/kg Day 3)
 * - MELD-Na / MELD 3.0 & Simultaneous Liver-Kidney Transplantation (SLKT) Triage
 */

export type IcaAkiStage =
  | 'NO_AKI'
  | 'STAGE_1A'       // SCr increase >= 0.3 mg/dL or 1.5-1.9x baseline AND current SCr < 1.5 mg/dL
  | 'STAGE_1B'       // SCr increase >= 0.3 mg/dL or 1.5-1.9x baseline AND current SCr >= 1.5 mg/dL
  | 'STAGE_2'        // SCr 2.0-2.9x baseline
  | 'STAGE_3';       // SCr >= 3.0x baseline OR SCr >= 4.0 mg/dL with acute rise >= 0.3 OR on RRT

export type RenalInjuryPhenotype =
  | 'PRERENAL_VOLUME_RESPONSIVE'   // Responds to diuretic pause & crystalloid/albumin within 48h
  | 'HRS_AKI'                      // True Hepatorenal Syndrome: functional vasoconstriction unresponsive to volume
  | 'ACUTE_TUBULAR_NECROSIS_ATN'   // Structural tubular injury (high UNa, high FeNa, high uNGAL, muddy brown casts)
  | 'CHRONIC_KIDNEY_DISEASE_CKD';  // Underlying parenchymal/glomerular disease

export type VasoactiveTherapyChoice =
  | 'NONE'
  | 'TERLIPRESSIN_PLUS_ALBUMIN'    // Gold standard V1a agonist (0.85-1.7 mg IV q6h) + Albumin (20-40 g/day)
  | 'NOREPINEPHRINE_PLUS_ALBUMIN'  // Continuous IV infusion titrated to MAP increase >= 10 mmHg + Albumin
  | 'MIDODRINE_OCTREOTIDE_ALBUMIN' // Historical oral regimen (inferior 20-30% response rate)
  | 'DIURETICS_ACTIVE_HAZARD';     // LETHAL PITFALL: Continuing furosemide/spironolactone during HRS-AKI!

export interface HepatorenalPatientParams {
  // Baseline Patient & Liver Characteristics
  baselineSerumCreatinineMgDl: number;  // 0.6 to 1.4 mg/dL
  currentSerumCreatinineMgDl: number;   // 0.8 to 6.0 mg/dL
  totalBilirubinMgDl: number;           // 1.0 to 35.0 mg/dL
  serumSodiumMeqL: number;              // 118 to 142 mEq/L
  inr: number;                          // 1.1 to 4.5
  serumAlbuminGDl: number;              // 1.8 to 4.0 g/dL
  weightKg: number;                     // 50 to 120 kg
  hasAscites: boolean;
  hasCirrhosis: boolean;

  // Hemodynamics & Oxygenation
  sbpMmHg: number;                      // 70 to 130 mmHg
  dbpMmHg: number;                      // 40 to 80 mmHg
  heartRateBpm: number;                 // 50 to 130 bpm
  spO2PercentRoomAir: number;           // 82 to 100% (CONFIRM trial warning: SpO2 < 90% is high risk!)
  hasOvertPulmonaryEdema: boolean;

  // Renal & Urinalysis Biomarkers
  urineSodiumMeqL: number;              // 4 to 80 mEq/L (< 10-15 in HRS, > 40 in ATN)
  urineCreatinineMgDl: number;          // 20 to 180 mg/dL
  urineOsmolalityMosmKg: number;        // 250 to 650 mOsm/kg
  fractionalExcretionSodiumPercent: number; // 0.1 to 3.5% (< 0.5% in HRS, > 1.5% in ATN)
  fractionalExcretionUreaPercent: number;   // 15 to 65% (< 35% in HRS, > 35% in ATN)
  urinaryNgalNgMl: number;              // 20 to 800 ng/mL (< 220 in HRS, > 220-400 in ATN)
  urineSedimentActiveOrMuddyCasts: boolean; // Muddy brown casts = ATN; Bland = HRS
  proteinuriaGramPerDay: number;        // Normal < 0.5 g/day in HRS (> 0.5 g indicates intrinsic/glomerular)

  // Fluid Challenges & Diuretic State
  diureticsWithdrawn48h: boolean;
  albuminChallenge1gPerKgGiven48h: boolean; // 1 g/kg/day x 2 days (max 100 g/day)
  creatinineImprovedWithAlbumin: boolean;

  // Interventions & Procedures
  vasoactiveTherapy: VasoactiveTherapyChoice;
  largeVolumeParacentesisLiters: number; // 0 to 15 Liters
  paracentesisAlbuminGivenGrams: number;  // Recommended 8 g per Liter removed > 5L
  asciticFluidPmnCountPerMm3: number;   // >= 250 defines Spontaneous Bacterial Peritonitis (SBP)
  sbpSortAlbuminProtocolGiven: boolean;  // 1.5 g/kg Day 1 + 1.0 g/kg Day 3
}

export interface HepatorenalSimulationResult {
  icaAkiStage: IcaAkiStage;
  renalInjuryPhenotype: RenalInjuryPhenotype;
  meanArterialPressureMmHg: number;
  meldNaScore: number;
  meld3Score: number;
  isConfirmedHrsAki: boolean;
  hasSbp: boolean;
  hasPpcdRisk: boolean;
  paracentesisAlbuminDeficitGrams: number;
  predictedAkiReversalProbabilityPercent: number;
  predicted30DayMortalityPercent: number;
  terlipressinRespiratoryHazard: boolean;
  simultaneousLiverKidneyTransplantEligible: boolean;
  resuscitationSafetyScore: number; // 0 to 100
  clinicalStatusBadge: {
    status: 'STABLE' | 'WARNING' | 'CRITICAL' | 'LETHAL_EMERGENCY';
    label: string;
    color: string;
  };
  criticalAlerts: string[];
  physiologicMechanisms: string[];
  stepByStepActionPlan: string[];
}

/**
 * Calculates MELD-Na and MELD 3.0 scores
 */
export function calculateMeldScores(params: HepatorenalPatientParams) {
  const bili = Math.max(1.0, params.totalBilirubinMgDl);
  const inr = Math.max(1.0, params.inr);
  const cr = Math.min(4.0, Math.max(1.0, params.currentSerumCreatinineMgDl));
  const na = Math.min(137, Math.max(125, params.serumSodiumMeqL));

  // Original MELD
  const meldRaw = 9.57 * Math.log(cr) + 3.78 * Math.log(bili) + 11.2 * Math.log(inr) + 6.43;
  let meldNa = Math.round(meldRaw);
  if (meldRaw > 11) {
    meldNa = Math.round(meldRaw + 1.32 * (137 - na) - (0.033 * meldRaw * (137 - na)));
  }
  meldNa = Math.min(40, Math.max(6, meldNa));

  // MELD 3.0 approximation (incorporates albumin and female sex offset)
  const alb = Math.min(3.5, Math.max(1.0, params.serumAlbuminGDl));
  const meld3 = Math.round(
    1.33 * 0 + // assuming male as baseline
    4.56 * Math.log(bili) +
    0.82 * (3.5 - alb) -
    0.24 * (3.5 - alb) * Math.log(bili) +
    9.09 * Math.log(inr) +
    11.14 * Math.log(cr) +
    1.85 * (137 - na) -
    0.076 * (137 - na) * Math.log(cr)
  );
  const boundedMeld3 = Math.min(40, Math.max(6, meld3));

  return { meldNa, meld3: boundedMeld3 };
}

/**
 * Stages AKI according to the International Club of Ascites (ICA-AKI) Criteria
 */
export function determineIcaAkiStage(baselineCr: number, currentCr: number): IcaAkiStage {
  const deltaCr = currentCr - baselineCr;
  const ratio = currentCr / Math.max(0.1, baselineCr);

  if (deltaCr < 0.3 && ratio < 1.5) {
    return 'NO_AKI';
  }

  if (ratio >= 3.0 || currentCr >= 4.0 || deltaCr >= 3.0) {
    return 'STAGE_3';
  }

  if (ratio >= 2.0) {
    return 'STAGE_2';
  }

  // Stage 1 split: 1A (< 1.5 mg/dL) vs 1B (>= 1.5 mg/dL)
  if (currentCr < 1.5) {
    return 'STAGE_1A';
  }
  return 'STAGE_1B';
}

/**
 * Classifies renal injury phenotype (Prerenal vs HRS-AKI vs ATN)
 */
export function classifyRenalPhenotype(params: HepatorenalPatientParams): RenalInjuryPhenotype {
  // If response to 48h albumin challenge occurred
  if (params.diureticsWithdrawn48h && params.albuminChallenge1gPerKgGiven48h && params.creatinineImprovedWithAlbumin) {
    return 'PRERENAL_VOLUME_RESPONSIVE';
  }

  // ATN indicators: high urine sodium, high FeNa, high uNGAL, or muddy casts
  const atnMarkers =
    (params.urineSodiumMeqL > 35 ? 1 : 0) +
    (params.fractionalExcretionSodiumPercent > 1.2 ? 1 : 0) +
    (params.urinaryNgalNgMl > 250 ? 2 : 0) +
    (params.urineSedimentActiveOrMuddyCasts ? 2 : 0) +
    (params.proteinuriaGramPerDay > 0.5 ? 1 : 0);

  if (atnMarkers >= 3) {
    return 'ACUTE_TUBULAR_NECROSIS_ATN';
  }

  // If cirrhosis, ascites, AKI, diuretics withdrawn, 48h albumin failed, and bland sediment -> HRS-AKI
  if (
    params.hasCirrhosis &&
    params.hasAscites &&
    params.diureticsWithdrawn48h &&
    params.albuminChallenge1gPerKgGiven48h &&
    !params.creatinineImprovedWithAlbumin &&
    !params.urineSedimentActiveOrMuddyCasts &&
    params.proteinuriaGramPerDay <= 0.5
  ) {
    return 'HRS_AKI';
  }

  // If 48h albumin challenge not yet completed
  if (!params.diureticsWithdrawn48h || !params.albuminChallenge1gPerKgGiven48h) {
    return 'PRERENAL_VOLUME_RESPONSIVE';
  }

  return 'HRS_AKI';
}

/**
 * Core simulation for Hepatorenal Syndrome, SBP & Terlipressin Resuscitation
 */
export function simulateHepatorenalSyndrome(params: HepatorenalPatientParams): HepatorenalSimulationResult {
  const map = Math.round((params.sbpMmHg + 2 * params.dbpMmHg) / 3);
  const icaAkiStage = determineIcaAkiStage(params.baselineSerumCreatinineMgDl, params.currentSerumCreatinineMgDl);
  const renalInjuryPhenotype = classifyRenalPhenotype(params);
  const { meldNa, meld3 } = calculateMeldScores(params);

  const criticalAlerts: string[] = [];
  const physiologicMechanisms: string[] = [];
  const stepByStepActionPlan: string[] = [];

  const isConfirmedHrsAki = renalInjuryPhenotype === 'HRS_AKI';
  const hasSbp = params.asciticFluidPmnCountPerMm3 >= 250;

  // 1. Large-Volume Paracentesis (LVP) & Post-Paracentesis Circulatory Dysfunction (PPCD)
  const hasPpcdRisk = params.largeVolumeParacentesisLiters > 5;
  const requiredAlbuminForLvp = hasPpcdRisk ? (params.largeVolumeParacentesisLiters - 5) * 8 : 0;
  const paracentesisAlbuminDeficitGrams = Math.max(0, requiredAlbuminForLvp - params.paracentesisAlbuminGivenGrams);

  if (hasPpcdRisk && paracentesisAlbuminDeficitGrams > 0) {
    criticalAlerts.push(
      `POST-PARACENTESIS CIRCULATORY DYSFUNCTION (PPCD) HAZARD: ${params.largeVolumeParacentesisLiters}L ascites removed without adequate IV Albumin replacement (Deficit: ${paracentesisAlbuminDeficitGrams}g). Splanchnic capacitance pooling will precipitate severe effective arterial hypovolemia, refractory hyponatremia, and rapid renal decompensation.`
    );
  } else if (hasPpcdRisk) {
    physiologicMechanisms.push(
      `Adequate IV Albumin (${params.paracentesisAlbuminGivenGrams}g) administered post-LVP, preventing PPCD and maintaining effective circulating volume.`
    );
  }

  // 2. SBP & The Sort Albumin Protocol
  if (hasSbp) {
    if (!params.sbpSortAlbuminProtocolGiven) {
      criticalAlerts.push(
        `SBP RENAL RESCUE FAILURE: Ascitic PMN count is ${params.asciticFluidPmnCountPerMm3}/mm³ (SBP confirmed). Failure to administer the Sort Albumin Protocol (1.5 g/kg Day 1 + 1.0 g/kg Day 3) increases HRS-AKI incidence from 10% to > 33% and triples hospital mortality.`
      );
    } else {
      physiologicMechanisms.push(
        `Sort Albumin Protocol administered for SBP: Reduces nitric oxide-induced endothelial damage and blunts systemic inflammation, protecting against acute renal failure.`
      );
    }
  }

  // 3. Diuretic Pitfall during AKI
  if (params.vasoactiveTherapy === 'DIURETICS_ACTIVE_HAZARD') {
    criticalAlerts.push(
      `LETHAL PRACTICE PITFALL: Diuretics continued during active cirrhosis AKI. Furosemide and spironolactone accelerate intravascular volume depletion, exacerbate renal hypoperfusion, and convert functional AKI to irreversible tubular necrosis.`
    );
  }

  // 4. CONFIRM Trial Terlipressin Respiratory Failure Hazard
  const terlipressinRespiratoryHazard =
    (params.vasoactiveTherapy === 'TERLIPRESSIN_PLUS_ALBUMIN') &&
    (params.spO2PercentRoomAir < 90 || params.hasOvertPulmonaryEdema);

  if (terlipressinRespiratoryHazard) {
    criticalAlerts.push(
      `CONFIRM TRIAL BLACK BOX WARNING: Terlipressin administered in a patient with severe hypoxemia (SpO2 ${params.spO2PercentRoomAir}%) or overt pulmonary edema. Terlipressin causes severe fluid mobilization and pulmonary capillary leak; high risk of fatal acute respiratory failure. Hold terlipressin until oxygenation stabilizes.`
    );
  }

  // 5. Predict AKI Reversal Probability & 30-Day Mortality
  let reversalProb = 20; // baseline for untreated HRS
  let mortality = 40;

  if (icaAkiStage === 'STAGE_1A') {
    reversalProb = 75;
    mortality = 15;
  } else if (icaAkiStage === 'STAGE_1B') {
    reversalProb = 50;
    mortality = 28;
  } else if (icaAkiStage === 'STAGE_2') {
    reversalProb = 35;
    mortality = 45;
  } else if (icaAkiStage === 'STAGE_3') {
    reversalProb = 20;
    mortality = 65;
  }

  // Adjust for vasoactive therapy
  if (params.vasoactiveTherapy === 'TERLIPRESSIN_PLUS_ALBUMIN') {
    if (!terlipressinRespiratoryHazard) {
      reversalProb = Math.min(85, reversalProb + 35);
      mortality = Math.max(12, mortality - 20);
      physiologicMechanisms.push(
        `Terlipressin (V1a receptor agonist) selectively constricts the dilated splanchnic arterial bed, redirecting sequestered mesenteric blood into the systemic circulation, raising MAP, and relieving renal vasoconstriction.`
      );
    } else {
      mortality += 25; // respiratory failure penalty
    }
  } else if (params.vasoactiveTherapy === 'NOREPINEPHRINE_PLUS_ALBUMIN') {
    reversalProb = Math.min(80, reversalProb + 30);
    mortality = Math.max(15, mortality - 18);
    physiologicMechanisms.push(
      `Norepinephrine infusion restores MAP and renal perfusion pressure, matching terlipressin efficacy in an ICU setting with central venous access.`
    );
  } else if (params.vasoactiveTherapy === 'MIDODRINE_OCTREOTIDE_ALBUMIN') {
    reversalProb = Math.min(50, reversalProb + 10);
    physiologicMechanisms.push(
      `Midodrine + Octreotide provides modest splanchnic constriction and somatostatin-mediated glucagon inhibition (lower response rate ~25%).`
    );
  } else if (params.vasoactiveTherapy === 'DIURETICS_ACTIVE_HAZARD') {
    reversalProb = Math.max(5, reversalProb - 30);
    mortality += 25;
  }

  // Adjust for SBP and PPCD
  if (hasSbp && !params.sbpSortAlbuminProtocolGiven) {
    mortality += 20;
  }
  if (hasPpcdRisk && paracentesisAlbuminDeficitGrams > 0) {
    mortality += 15;
    reversalProb = Math.max(5, reversalProb - 15);
  }

  // SLKT Eligibility (Simultaneous Liver-Kidney Transplantation)
  // OPTN Criteria: sustained AKI with dialysis or eGFR <= 25 mL/min for >= 4-6 weeks, or documented CKD
  const simultaneousLiverKidneyTransplantEligible =
    (icaAkiStage === 'STAGE_3' && meldNa >= 28) ||
    (params.currentSerumCreatinineMgDl >= 3.0 && meldNa >= 30);

  // Resuscitation Safety Score
  let safetyScore = 100;
  if (params.vasoactiveTherapy === 'DIURETICS_ACTIVE_HAZARD') safetyScore -= 40;
  if (terlipressinRespiratoryHazard) safetyScore -= 35;
  if (hasSbp && !params.sbpSortAlbuminProtocolGiven) safetyScore -= 25;
  if (hasPpcdRisk && paracentesisAlbuminDeficitGrams > 0) safetyScore -= 20;
  if (isConfirmedHrsAki && params.vasoactiveTherapy === 'NONE') safetyScore -= 30;
  safetyScore = Math.max(0, Math.min(100, safetyScore));

  // Determine Clinical Status Badge
  let clinicalStatusBadge: HepatorenalSimulationResult['clinicalStatusBadge'] = {
    status: 'STABLE',
    label: 'Compensated Cirrhotic Function',
    color: 'emerald'
  };

  if (terlipressinRespiratoryHazard || (icaAkiStage === 'STAGE_3' && meldNa >= 32)) {
    clinicalStatusBadge = {
      status: 'LETHAL_EMERGENCY',
      label: 'Critical Multi-Organ Failure / Acute Hypoxemia',
      color: 'rose'
    };
  } else if (icaAkiStage === 'STAGE_3' || icaAkiStage === 'STAGE_2' || isConfirmedHrsAki) {
    clinicalStatusBadge = {
      status: 'CRITICAL',
      label: 'Confirmed HRS-AKI: Severe Vasoconstriction',
      color: 'red'
    };
  } else if (icaAkiStage === 'STAGE_1B' || hasSbp) {
    clinicalStatusBadge = {
      status: 'WARNING',
      label: 'High-Risk AKI / Active SBP',
      color: 'amber'
    };
  }

  // Step-by-Step Clinical Action Plan
  stepByStepActionPlan.push(`1. AKI Staging: Patient meets criteria for ICA-AKI ${icaAkiStage.replace(/_/g, ' ')} (SCr ${params.currentSerumCreatinineMgDl} mg/dL vs baseline ${params.baselineSerumCreatinineMgDl} mg/dL).`);
  
  if (!params.diureticsWithdrawn48h) {
    stepByStepActionPlan.push(`2. Immediate Diuretic Hold: Stop all diuretics (furosemide/spironolactone) and eliminate potential nephrotoxins (NSAIDs, ACEi/ARBs, aminoglycosides).`);
  } else {
    stepByStepActionPlan.push(`2. Diuretic Status: Diuretics appropriately withdrawn for >= 48 hours.`);
  }

  if (!params.albuminChallenge1gPerKgGiven48h) {
    stepByStepActionPlan.push(`3. Diagnostic Albumin Challenge: Initiate IV 20% or 25% Albumin at 1 g/kg body weight per day (max 100 g/day) for 48 consecutive hours to distinguish prerenal volume responsive azotemia from HRS-AKI.`);
  } else if (isConfirmedHrsAki) {
    stepByStepActionPlan.push(`3. HRS-AKI Confirmed: 48h albumin challenge failed to reverse azotemia. Bland urine sediment and low UNa (< 15 mEq/L) confirm intense functional renal vasoconstriction.`);
    if (terlipressinRespiratoryHazard) {
      stepByStepActionPlan.push(`4. Vasoactive Override: Terlipressin is held due to severe hypoxemia/pulmonary edema. Switch to Norepinephrine infusion titrated to MAP increase >= 10 mmHg + maintenance Albumin 20-40 g/day.`);
    } else {
      stepByStepActionPlan.push(`4. Vasoactive Precision Therapy: Initiate Terlipressin 0.85 mg IV bolus q6h (or continuous infusion) + IV Albumin 20-40 g/day. Monitor SpO2 continuously.`);
    }
  }

  if (hasSbp) {
    stepByStepActionPlan.push(`5. SBP Management: Administer IV 3rd-generation cephalosporin (Ceftriaxone 2g daily) + Sort Albumin Protocol (1.5 g/kg Day 1, 1.0 g/kg Day 3) to prevent renal failure.`);
  }

  if (simultaneousLiverKidneyTransplantEligible) {
    stepByStepActionPlan.push(`6. Transplant Evaluation: Patient meets UNOS/OPTN criteria for Simultaneous Liver-Kidney Transplantation (SLKT) triage (MELD-Na ${meldNa}, Stage 3 AKI).`);
  } else {
    stepByStepActionPlan.push(`6. Liver Transplant Triage: Monitor MELD-Na (${meldNa}); refer to transplant center for expedited evaluation.`);
  }

  return {
    icaAkiStage,
    renalInjuryPhenotype,
    meanArterialPressureMmHg: map,
    meldNaScore: meldNa,
    meld3Score: meld3,
    isConfirmedHrsAki,
    hasSbp,
    hasPpcdRisk,
    paracentesisAlbuminDeficitGrams,
    predictedAkiReversalProbabilityPercent: Math.round(reversalProb),
    predicted30DayMortalityPercent: Math.round(mortality),
    terlipressinRespiratoryHazard,
    simultaneousLiverKidneyTransplantEligible,
    resuscitationSafetyScore: safetyScore,
    clinicalStatusBadge,
    criticalAlerts,
    physiologicMechanisms,
    stepByStepActionPlan
  };
}

/**
 * 5 Standard Clinical Case Presets
 */
export const HEPATORENAL_PRESETS: Record<string, HepatorenalPatientParams> = {
  classicHrsAki: {
    baselineSerumCreatinineMgDl: 0.9,
    currentSerumCreatinineMgDl: 2.6,
    totalBilirubinMgDl: 4.8,
    serumSodiumMeqL: 128,
    inr: 1.8,
    serumAlbuminGDl: 2.4,
    weightKg: 70,
    hasAscites: true,
    hasCirrhosis: true,
    sbpMmHg: 96,
    dbpMmHg: 56,
    heartRateBpm: 88,
    spO2PercentRoomAir: 96,
    hasOvertPulmonaryEdema: false,
    urineSodiumMeqL: 8,
    urineCreatinineMgDl: 95,
    urineOsmolalityMosmKg: 520,
    fractionalExcretionSodiumPercent: 0.22,
    fractionalExcretionUreaPercent: 24,
    urinaryNgalNgMl: 65,
    urineSedimentActiveOrMuddyCasts: false,
    proteinuriaGramPerDay: 0.15,
    diureticsWithdrawn48h: true,
    albuminChallenge1gPerKgGiven48h: true,
    creatinineImprovedWithAlbumin: false,
    vasoactiveTherapy: 'TERLIPRESSIN_PLUS_ALBUMIN',
    largeVolumeParacentesisLiters: 0,
    paracentesisAlbuminGivenGrams: 0,
    asciticFluidPmnCountPerMm3: 45,
    sbpSortAlbuminProtocolGiven: false
  },

  sbpTriggeredHrs: {
    baselineSerumCreatinineMgDl: 1.0,
    currentSerumCreatinineMgDl: 3.2,
    totalBilirubinMgDl: 6.2,
    serumSodiumMeqL: 124,
    inr: 2.2,
    serumAlbuminGDl: 2.1,
    weightKg: 75,
    hasAscites: true,
    hasCirrhosis: true,
    sbpMmHg: 88,
    dbpMmHg: 50,
    heartRateBpm: 104,
    spO2PercentRoomAir: 94,
    hasOvertPulmonaryEdema: false,
    urineSodiumMeqL: 9,
    urineCreatinineMgDl: 75,
    urineOsmolalityMosmKg: 490,
    fractionalExcretionSodiumPercent: 0.28,
    fractionalExcretionUreaPercent: 26,
    urinaryNgalNgMl: 110,
    urineSedimentActiveOrMuddyCasts: false,
    proteinuriaGramPerDay: 0.2,
    diureticsWithdrawn48h: true,
    albuminChallenge1gPerKgGiven48h: true,
    creatinineImprovedWithAlbumin: false,
    vasoactiveTherapy: 'TERLIPRESSIN_PLUS_ALBUMIN',
    largeVolumeParacentesisLiters: 0,
    paracentesisAlbuminGivenGrams: 0,
    asciticFluidPmnCountPerMm3: 850, // SBP confirmed!
    sbpSortAlbuminProtocolGiven: true
  },

  terlipressinRespiratoryHazardPreset: {
    baselineSerumCreatinineMgDl: 1.1,
    currentSerumCreatinineMgDl: 2.9,
    totalBilirubinMgDl: 5.5,
    serumSodiumMeqL: 126,
    inr: 2.0,
    serumAlbuminGDl: 2.2,
    weightKg: 82,
    hasAscites: true,
    hasCirrhosis: true,
    sbpMmHg: 94,
    dbpMmHg: 58,
    heartRateBpm: 92,
    spO2PercentRoomAir: 86, // Severe hypoxemia!
    hasOvertPulmonaryEdema: true, // Black box warning!
    urineSodiumMeqL: 11,
    urineCreatinineMgDl: 85,
    urineOsmolalityMosmKg: 510,
    fractionalExcretionSodiumPercent: 0.32,
    fractionalExcretionUreaPercent: 28,
    urinaryNgalNgMl: 80,
    urineSedimentActiveOrMuddyCasts: false,
    proteinuriaGramPerDay: 0.18,
    diureticsWithdrawn48h: true,
    albuminChallenge1gPerKgGiven48h: true,
    creatinineImprovedWithAlbumin: false,
    vasoactiveTherapy: 'TERLIPRESSIN_PLUS_ALBUMIN',
    largeVolumeParacentesisLiters: 0,
    paracentesisAlbuminGivenGrams: 0,
    asciticFluidPmnCountPerMm3: 60,
    sbpSortAlbuminProtocolGiven: false
  },

  postParacentesisCirculatoryDysfunction: {
    baselineSerumCreatinineMgDl: 0.8,
    currentSerumCreatinineMgDl: 2.1,
    totalBilirubinMgDl: 3.5,
    serumSodiumMeqL: 122,
    inr: 1.6,
    serumAlbuminGDl: 2.6,
    weightKg: 68,
    hasAscites: true,
    hasCirrhosis: true,
    sbpMmHg: 84,
    dbpMmHg: 48,
    heartRateBpm: 110,
    spO2PercentRoomAir: 97,
    hasOvertPulmonaryEdema: false,
    urineSodiumMeqL: 7,
    urineCreatinineMgDl: 110,
    urineOsmolalityMosmKg: 580,
    fractionalExcretionSodiumPercent: 0.15,
    fractionalExcretionUreaPercent: 20,
    urinaryNgalNgMl: 55,
    urineSedimentActiveOrMuddyCasts: false,
    proteinuriaGramPerDay: 0.1,
    diureticsWithdrawn48h: true,
    albuminChallenge1gPerKgGiven48h: false,
    creatinineImprovedWithAlbumin: false,
    vasoactiveTherapy: 'NONE',
    largeVolumeParacentesisLiters: 9.0, // 9L removed without albumin!
    paracentesisAlbuminGivenGrams: 0, // Deficit!
    asciticFluidPmnCountPerMm3: 30,
    sbpSortAlbuminProtocolGiven: false
  },

  acuteTubularNecrosisMismatch: {
    baselineSerumCreatinineMgDl: 1.0,
    currentSerumCreatinineMgDl: 3.8,
    totalBilirubinMgDl: 4.2,
    serumSodiumMeqL: 134,
    inr: 1.7,
    serumAlbuminGDl: 2.8,
    weightKg: 78,
    hasAscites: true,
    hasCirrhosis: true,
    sbpMmHg: 102,
    dbpMmHg: 64,
    heartRateBpm: 84,
    spO2PercentRoomAir: 98,
    hasOvertPulmonaryEdema: false,
    urineSodiumMeqL: 54, // High UNa
    urineCreatinineMgDl: 42,
    urineOsmolalityMosmKg: 290, // Isosthenuria
    fractionalExcretionSodiumPercent: 2.4, // High FeNa
    fractionalExcretionUreaPercent: 52, // High FeUrea
    urinaryNgalNgMl: 580, // Very high NGAL
    urineSedimentActiveOrMuddyCasts: true, // Muddy brown granular casts!
    proteinuriaGramPerDay: 0.8,
    diureticsWithdrawn48h: true,
    albuminChallenge1gPerKgGiven48h: true,
    creatinineImprovedWithAlbumin: false,
    vasoactiveTherapy: 'TERLIPRESSIN_PLUS_ALBUMIN',
    largeVolumeParacentesisLiters: 0,
    paracentesisAlbuminGivenGrams: 0,
    asciticFluidPmnCountPerMm3: 80,
    sbpSortAlbuminProtocolGiven: false
  }
};
