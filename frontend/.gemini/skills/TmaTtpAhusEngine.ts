/**
 * TmaTtpAhusEngine.ts
 * Critical Care, Emergency Medicine & Hematology/Nephrology Engine:
 * Thrombotic Microangiopathies (TMA):
 * - Thrombotic Thrombocytopenic Purpura (TTP): ADAMTS13 Deficiency (< 10%) & Anti-ADAMTS13 IgG
 * - Atypical Hemolytic Uremic Syndrome (aHUS): Complement Dysregulation (Alternative Pathway / C5b-9)
 * - Shiga Toxin-Producing E. coli HUS (STEC-HUS): Diarrhea+ prodrome, Gb3 receptor cytotoxicity
 * - Secondary TMA: Malignant HTN, HELLP, Calcineurin Inhibitors, Systemic Sclerosis
 * 
 * Key Mathematical & Algorithmic Modules:
 * 1. Diagnostic Dyad (MAHA + Thrombocytopenia) vs Mythical Pentad
 * 2. Complete PLASMIC Score (0-7 points) for rapid TTP risk stratification
 * 3. Schistocyte quantification on blood film (>= 1.0-2.0% cutoff)
 * 4. ADAMTS13 Activity (< 10% vs >= 10%) & Inhibitor Bethesda Titer
 * 5. Lethal Platelet Transfusion Hazard Modeling ("Fuel to the Fire")
 * 6. Therapeutic Modalities:
 *    - Emergent Therapeutic Plasma Exchange (TPE) (1.0 - 1.5 plasma volumes)
 *    - Anti-vWF Nanobody: Caplacizumab (10 mg IV/SC)
 *    - Immunosuppression: High-dose Corticosteroids + Rituximab (375 mg/m2)
 *    - Complement C5 Inhibitor: Eculizumab / Ravulizumab for aHUS (+ Meningococcal prophylaxis)
 */

export type TmaSubtype =
  | 'IMMUNE_TTP'           // Severe ADAMTS13 < 10% + Autoantibody
  | 'CONGENITAL_TTP'       // Upshaw-Schulman syndrome (ADAMTS13 mutation without inhibitor)
  | 'ATYPICAL_HUS'         // Alternative Complement Pathway dysregulation (ADAMTS13 >= 10%)
  | 'STEC_HUS'             // Shiga-toxin E. coli (O157:H7), prodromal bloody diarrhea
  | 'SECONDARY_TMA';       // Malignant HTN, Calcineurin inhibitor, HELLP, Cancer

export interface TmaPatientParams {
  plateletCountPerMicroliter: number;     // e.g., 8,000 to 150,000 /uL (TTP typically < 30,000)
  hemoglobinGPerDl: number;               // 5.0 to 14.0 g/dL
  schistocytePercentageOnSmear: number;   // Normal < 0.2%, Significant >= 1.0%, Severe >= 2.5%
  serumLdhUL: number;                     // Normal 140-280 U/L; massive hemolysis > 1,000 U/L
  serumHaptoglobinGPerL: number;          // Normal 0.3-2.0 g/L; undetectable < 0.1 g/L
  indirectBilirubinMgPerDl: number;       // Hemolysis marker > 2.0 mg/dL
  reticulocytePercentage: number;         // Erythroid marrow response > 2.5%
  directAntiglobulinTestPositive: boolean;// Direct Coombs test: typically NEGATIVE in TMA

  // Coagulation (Differentiates from DIC)
  ptInr: number;                          // Normal <= 1.2 in TMA; prolonged in DIC
  apttSeconds: number;                    // Normal 25-35s in TMA; prolonged in DIC
  fibrinogenMgPerDl: number;              // Normal/high 200-500 in TMA; consumed < 150 in DIC

  // Renal & Metabolic
  serumCreatinineMgPerDl: number;         // TTP typically < 2.0; aHUS severe AKI > 3-5
  urineProteinOrBloodPresent: boolean;

  // Neurological & Systemic
  neurologicSymptomsPresent: boolean;     // Headache, confusion, TIA, seizure, coma (TTP > 60%)
  feverPresent: boolean;                  // Temperature >= 38.0°C (present in < 20% of TTP)
  cardiacTroponinElevated: boolean;       // Microvascular coronary thrombosis
  historyOfActiveCancer: boolean;
  historyOfSolidOrganOrStemCellTransplant: boolean;
  meanCorpuscularVolumeFLL: number;       // MCV < 90 fL scores 1 pt in PLASMIC

  // Diagnostics
  adamts13ActivityPercent: number;        // Definitive: < 10% = TTP; >= 10% rules out TTP
  adamts13InhibitorBethesdaUnits: number; // > 0.4 BU indicates neutralizing autoantibody
  stoolShigaToxinPositive: boolean;       // STEC-HUS confirmation

  // Interventions
  therapeuticPlasmaExchangeActive: boolean; // Daily 1.0-1.5 PV exchange with FFP
  caplacizumabAdministered: boolean;       // 10 mg anti-vWF nanobody
  highDoseSteroidsActive: boolean;         // Methylprednisolone 1g IV or Prednisone 1 mg/kg
  rituximabActive: boolean;                // 375 mg/m2 anti-CD20
  eculizumabComplementInhibitorActive: boolean; // Anti-C5 mAb for aHUS
  meningococcalProphylaxisCovered: boolean;// Required for C5 inhibitors
  plateletTransfusionAdministered: boolean;// LETHAL CONTRAINDICATION in TTP!
}

export interface PlasmicScoreBreakdown {
  plateletLessThan30k: boolean;         // 1 pt
  hemolysisEvidence: boolean;           // 1 pt (Retic > 2.5% OR haptoglobin undetectable OR indirect bili > 2.0)
  noActiveCancer: boolean;              // 1 pt
  noStemCellOrOrganTransplant: boolean; // 1 pt
  mcvLessThan90: boolean;               // 1 pt
  inrLessThan1_5: boolean;              // 1 pt
  creatinineLessThan2_0: boolean;       // 1 pt
  totalScore: number;                   // 0 to 7
  riskCategory: 'LOW_RISK' | 'INTERMEDIATE_RISK' | 'HIGH_RISK';
  predictedTtpProbabilityPercent: number;
}

export interface TmaSimulationOutput {
  predictedTmaSubtype: TmaSubtype;
  plasmicScore: PlasmicScoreBreakdown;
  mahaConfirmed: boolean;
  dicExcludedByCoagulation: boolean;
  pentadSymptomsCount: number; // 2 to 5 symptoms (thrombocytopenia, MAHA, neuro, renal, fever)
  classicPentadPresent: boolean; // Rare (< 5-10%), waiting is fatal
  plateletTransfusionHazardTriggered: boolean; // Acute thrombotic storm warning
  clinicalAlerts: string[];
  therapeuticDirectives: string[];
}

export const DEFAULT_TMA_PATIENT: TmaPatientParams = {
  plateletCountPerMicroliter: 14000,      // Severe thrombocytopenia (< 30k)
  hemoglobinGPerDl: 7.8,                  // Severe hemolytic anemia
  schistocytePercentageOnSmear: 3.2,      // Significant MAHA (>= 1.0%)
  serumLdhUL: 1450,                       // Markedly elevated LDH
  serumHaptoglobinGPerL: 0.05,            // Undetectable (< 0.1 g/L)
  indirectBilirubinMgPerDl: 2.8,          // > 2.0 mg/dL
  reticulocytePercentage: 4.8,            // > 2.5%
  directAntiglobulinTestPositive: false,  // Coombs negative (non-immune hemolysis)

  ptInr: 1.05,                            // Normal coagulation excludes DIC
  apttSeconds: 29,
  fibrinogenMgPerDl: 320,

  serumCreatinineMgPerDl: 1.3,            // Mild renal involvement (< 2.0 mg/dL)
  urineProteinOrBloodPresent: true,

  neurologicSymptomsPresent: true,        // Fluctuating confusion / expressive aphasia
  feverPresent: false,                    // Afebrile (full pentad absent!)
  cardiacTroponinElevated: true,          // Microvascular coronary ischemia
  historyOfActiveCancer: false,
  historyOfSolidOrganOrStemCellTransplant: false,
  meanCorpuscularVolumeFLL: 86,           // < 90 fL

  adamts13ActivityPercent: 4.0,           // Severe deficiency (< 10%)
  adamts13InhibitorBethesdaUnits: 2.4,    // High-titer autoantibody
  stoolShigaToxinPositive: false,

  therapeuticPlasmaExchangeActive: false,
  caplacizumabAdministered: false,
  highDoseSteroidsActive: false,
  rituximabActive: false,
  eculizumabComplementInhibitorActive: false,
  meningococcalProphylaxisCovered: false,
  plateletTransfusionAdministered: false
};

/**
 * Calculates PLASMIC score and evaluates clinical probability of severe ADAMTS13 deficiency
 */
export function calculatePlasmicScore(params: TmaPatientParams): PlasmicScoreBreakdown {
  const plateletLessThan30k = params.plateletCountPerMicroliter < 30000;
  const hemolysisEvidence =
    params.reticulocytePercentage > 2.5 ||
    params.serumHaptoglobinGPerL < 0.1 ||
    params.indirectBilirubinMgPerDl > 2.0;
  const noActiveCancer = !params.historyOfActiveCancer;
  const noStemCellOrOrganTransplant = !params.historyOfSolidOrganOrStemCellTransplant;
  const mcvLessThan90 = params.meanCorpuscularVolumeFLL < 90;
  const inrLessThan1_5 = params.ptInr < 1.5;
  const creatinineLessThan2_0 = params.serumCreatinineMgPerDl < 2.0;

  let totalScore = 0;
  if (plateletLessThan30k) totalScore += 1;
  if (hemolysisEvidence) totalScore += 1;
  if (noActiveCancer) totalScore += 1;
  if (noStemCellOrOrganTransplant) totalScore += 1;
  if (mcvLessThan90) totalScore += 1;
  if (inrLessThan1_5) totalScore += 1;
  if (creatinineLessThan2_0) totalScore += 1;

  let riskCategory: 'LOW_RISK' | 'INTERMEDIATE_RISK' | 'HIGH_RISK' = 'LOW_RISK';
  let predictedTtpProbabilityPercent = 4;

  if (totalScore >= 6) {
    riskCategory = 'HIGH_RISK';
    predictedTtpProbabilityPercent = 85; // High probability of ADAMTS13 < 10%
  } else if (totalScore === 5) {
    riskCategory = 'INTERMEDIATE_RISK';
    predictedTtpProbabilityPercent = 25;
  } else {
    riskCategory = 'LOW_RISK';
    predictedTtpProbabilityPercent = 4;
  }

  return {
    plateletLessThan30k,
    hemolysisEvidence,
    noActiveCancer,
    noStemCellOrOrganTransplant,
    mcvLessThan90,
    inrLessThan1_5,
    creatinineLessThan2_0,
    totalScore,
    riskCategory,
    predictedTtpProbabilityPercent
  };
}

/**
 * Simulates microvascular thrombosis, hematologic hemolysis, diagnostic differentiation,
 * and therapeutic response for TMA syndromes.
 */
export function simulateTmaSyndrome(params: TmaPatientParams): TmaSimulationOutput {
  const alerts: string[] = [];
  const directives: string[] = [];

  // 1. Confirm MAHA
  const mahaConfirmed =
    params.schistocytePercentageOnSmear >= 1.0 &&
    params.serumLdhUL > 350 &&
    params.serumHaptoglobinGPerL < 0.1 &&
    !params.directAntiglobulinTestPositive;

  if (mahaConfirmed) {
    alerts.push(`MICROANGIOPATHIC HEMOLYTIC ANEMIA (MAHA) CONFIRMED: Peripheral blood smear reveals ${params.schistocytePercentageOnSmear}% schistocytes (diagnostic threshold >= 1.0%) with LDH ${params.serumLdhUL} U/L and undetectable haptoglobin.`);
  }

  // 2. Exclude DIC by normal coagulation
  const dicExcludedByCoagulation =
    params.ptInr <= 1.3 && params.apttSeconds <= 38 && params.fibrinogenMgPerDl >= 180;

  if (dicExcludedByCoagulation) {
    directives.push('NORMAL COAGULATION PROFILE: Normal PT/INR, aPTT, and fibrinogen distinguish TMA from Disseminated Intravascular Coagulation (DIC). Clotting factor cascade is intact; microvascular thrombi are pure platelet-vWF plugs.');
  } else {
    alerts.push('COAGULOPATHY DETECTED: Prolonged INR/aPTT or low fibrinogen suggests Disseminated Intravascular Coagulation (DIC), sepsis-induced coagulopathy, or severe hepatic failure.');
  }

  // 3. Evaluate Classic Pentad
  let pentadCount = 0;
  if (params.plateletCountPerMicroliter < 100000) pentadCount++; // 1. Thrombocytopenia
  if (mahaConfirmed) pentadCount++;                             // 2. MAHA
  if (params.neurologicSymptomsPresent) pentadCount++;          // 3. Neurologic symptoms
  if (params.serumCreatinineMgPerDl > 1.4 || params.urineProteinOrBloodPresent) pentadCount++; // 4. Renal impairment
  if (params.feverPresent) pentadCount++;                       // 5. Fever

  const classicPentadPresent = pentadCount === 5;
  if (!classicPentadPresent && params.plateletCountPerMicroliter < 50000 && mahaConfirmed) {
    alerts.push(`THE PENTAD MYTH PITFALL: Classic TTP pentad (MAHA, thrombocytopenia, neuro, renal, fever) is only present in < 10% of cases. Current patient exhibits ${pentadCount}/5 criteria. WAITING FOR THE FULL PENTAD BEFORE STARTING TPE CARRIES 90% MORTALITY! The Dyad of MAHA + Thrombocytopenia is sufficient to initiate emergent therapy.`);
  }

  // 4. PLASMIC Scoring
  const plasmicScore = calculatePlasmicScore(params);
  if (plasmicScore.riskCategory === 'HIGH_RISK') {
    alerts.push(`HIGH-RISK PLASMIC SCORE (${plasmicScore.totalScore}/7): 85-90% probability of severe ADAMTS13 deficiency (< 10%). Initiate emergent Therapeutic Plasma Exchange (TPE) and systemic corticosteroid immunosuppression immediately without waiting for ADAMTS13 lab return!`);
  }

  // 5. Differential Diagnosis Subtyping
  let predictedSubtype: TmaSubtype = 'SECONDARY_TMA';

  if (params.stoolShigaToxinPositive) {
    predictedSubtype = 'STEC_HUS';
    alerts.push('STEC-HUS IDENTIFIED: Stool Shiga-toxin positive. Avoid antibiotics and antimotility agents (which increase toxin absorption and aggravate microvascular renal damage). Supportive care and dialysis as needed.');
  } else if (params.adamts13ActivityPercent < 10.0) {
    if (params.adamts13InhibitorBethesdaUnits > 0.4) {
      predictedSubtype = 'IMMUNE_TTP';
      alerts.push(`DEFINITIVE IMMUNE TTP: Severe ADAMTS13 deficiency (${params.adamts13ActivityPercent}%) with detectable neutralizing inhibitor (${params.adamts13InhibitorBethesdaUnits} Bethesda Units). Ultra-large vWF multimer cleavage failure drives widespread platelet microthrombosis.`);
    } else {
      predictedSubtype = 'CONGENITAL_TTP';
      alerts.push(`CONGENITAL TTP (UPSHAW-SCHULMAN SYNDROME): ADAMTS13 < 10% without inhibitor. Responds promptly to simple plasma infusion without requiring immunosuppressive therapy.`);
    }
  } else {
    // ADAMTS13 >= 10%
    if (params.serumCreatinineMgPerDl >= 2.5 && !params.historyOfActiveCancer) {
      predictedSubtype = 'ATYPICAL_HUS';
      alerts.push(`ATYPICAL HUS (COMPLEMENT-MEDIATED TMA): ADAMTS13 activity is preserved (${params.adamts13ActivityPercent}% >= 10%) with predominant acute renal failure (Creatinine ${params.serumCreatinineMgPerDl} mg/dL). Uncontrolled alternative complement pathway activation (C5b-9) requires urgent C5-inhibitor therapy (Eculizumab / Ravulizumab).`);
    } else {
      predictedSubtype = 'SECONDARY_TMA';
    }
  }

  // 6. Lethal Pitfall: Platelet Transfusions
  const plateletTransfusionHazardTriggered = params.plateletTransfusionAdministered;
  if (plateletTransfusionHazardTriggered) {
    alerts.push('LETHAL HEMATOLOGIC PITFALL ("FUEL TO THE FIRE"): Platelet transfusion in TTP is strictly CONTRAINDICATED! Exogenous platelets aggregate onto ultra-large vWF multimers, provoking catastrophic thrombotic storms, acute stroke, myocardial infarction, and sudden death. Restrict platelets solely to life-threatening catastrophic intracranial hemorrhage.');
  }

  // 7. Therapeutic Directives
  if (predictedSubtype === 'IMMUNE_TTP' || plasmicScore.riskCategory === 'HIGH_RISK') {
    if (!params.therapeuticPlasmaExchangeActive) {
      directives.push('EMERGENT TPE MANDATORY: Perform 1.0 to 1.5 plasma volume exchange daily with FFP/cryosupernatant to clear anti-ADAMTS13 antibodies and replenish ADAMTS13 enzyme until platelets >= 150,000 for 2 consecutive days.');
    } else {
      directives.push('TPE THERAPY IN PROGRESS: Continue daily plasma exchange; monitor platelet count trajectory, LDH normalization, and clinical neurologic response.');
    }

    if (!params.caplacizumabAdministered) {
      directives.push('CAPLACIZUMAB (ANTI-vWF NANOBODY): Administer 10 mg IV loading bolus prior to initial TPE, followed by 10 mg subcutaneous daily after each TPE session. Prevents vWF-platelet adhesion and rapid organ ischemia.');
    }

    if (!params.highDoseSteroidsActive) {
      directives.push('HIGH-DOSE GLUCOCORTICOIDS: Administer Methylprednisolone 1 g/day IV for 3 days or Prednisone 1 mg/kg/day to suppress anti-ADAMTS13 autoantibody synthesis.');
    }

    if (!params.rituximabActive) {
      directives.push('RITUXIMAB ADJUNCT: Initiate 375 mg/m2 IV weekly x 4 doses to deplete pathogenic B-cell clones, reduce refractory TPE days, and prevent long-term relapses.');
    }
  }

  if (predictedSubtype === 'ATYPICAL_HUS') {
    if (!params.eculizumabComplementInhibitorActive) {
      directives.push('COMPLEMENT C5 INHIBITION (ECULIZUMAB / RAVULIZUMAB): Initiate anti-C5 monoclonal antibody therapy within 24-48 hours. Halts alternative complement endothelial injury and reverses renal failure.');
    }
    if (!params.meningococcalProphylaxisCovered) {
      alerts.push('MENINGOCOCCAL INFECTION RISK: Terminal complement inhibition (C5 blockade) increases Neisseria meningitidis susceptibility by 1,000-2,000 fold. Administer quadrivalent (ACWY) and Serogroup B meningococcal vaccines + immediate prophylactic antibiotics (Ciprofloxacin / Penicillin).');
    }
  }

  return {
    predictedTmaSubtype: predictedSubtype,
    plasmicScore,
    mahaConfirmed,
    dicExcludedByCoagulation,
    pentadSymptomsCount: pentadCount,
    classicPentadPresent,
    plateletTransfusionHazardTriggered,
    clinicalAlerts: alerts,
    therapeuticDirectives: directives
  };
}
