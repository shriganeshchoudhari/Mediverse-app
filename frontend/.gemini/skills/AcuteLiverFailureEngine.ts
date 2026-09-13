/**
 * AcuteLiverFailureEngine.ts
 * Biophysical & Prognostic Simulation Engine for Acute Liver Failure (ALF):
 * King\'s College Hospital & Clichy-Villejuif Emergency Liver Transplantation Criteria,
 * Hyperacute vs Acute vs Subacute Latency Phenotyping,
 * Arterial Ammonia Neurotoxicity & Cytotoxic Astrocytic Cerebral Edema Kinetics,
 * Rebalanced Hemostatic Coagulopathy (Factor V, INR, Platelets),
 * and Multimodal Neurocritical Care / N-Acetylcysteine (NAC) Resuscitation.
 *
 * References:
 * - O'Grady JG, et al. Early indicators of prognosis in fulminant hepatic failure.
 *   Gastroenterology. 1989;97(2):439-445.
 * - Bernal W, et al. Acute liver failure. Lancet. 2010;376(9736):190-201.
 * - European Association for the Study of the Liver (EASL). Clinical practical guidelines on the
 *   management of acute (fulminant) liver failure. J Hepatol. 2017;66(5):1047-1081.
 * - Clemmesen JO, et al. Cerebral herniation in patients with acute liver failure is correlated with
 *   arterial ammonia levels. Hepatology. 1999;29(3):648-653.
 */

export type AlfEtiology =
  | 'acetaminophen_toxicity'
  | 'viral_hepatitis_b'
  | 'viral_hepatitis_a_e'
  | 'idiosyncratic_dili'
  | 'autoimmune_hepatitis'
  | 'wilsons_disease'
  | 'budd_chiari_syndrome'
  | 'cryptogenic_indeterminate';

export type WestHavenEncephalopathyGrade = 0 | 1 | 2 | 3 | 4;

export interface PatientAlfState {
  patientAge: number;
  etiology: AlfEtiology;
  jaundiceToEncephalopathyDays: number; // Latency window: <7d (hyperacute), 8-28d (acute), >28d (subacute)
  encephalopathyGrade: WestHavenEncephalopathyGrade; // 0 to 4
  arterialPh: number; // e.g. 7.15 - 7.50
  arterialLactateMmolL: number; // e.g. 1.0 - 15.0 mmol/L
  serumCreatinineMgDl: number; // e.g. 0.6 - 8.0 mg/dL
  inr: number; // e.g. 1.2 - 12.0
  factorVPercent: number; // e.g. 5 - 100%
  totalBilirubinMgDl: number; // e.g. 1.5 - 45.0 mg/dL
  arterialAmmoniaUmolL: number; // e.g. 40 - 350 umol/L
  serumSodiumMeqL: number; // e.g. 125 - 155 mEq/L
  headOfBedElevated30Deg: boolean;
  intubatedAndMechanicallyVentilated: boolean;
  crrtActive: boolean;
  nacInfusionActive: boolean;
}

export interface KingsCollegeReport {
  isCriteriaFulfilled: boolean;
  algorithmType: 'Acetaminophen (APAP)' | 'Non-Acetaminophen (Non-APAP)';
  emergencyListingRecommended: boolean;
  mortalityWithoutTransplantPercent: number; // e.g. 20% to 92%
  fulfilledSpecificCriteria: string[];
  clinicalPrognosticRationale: string;
}

export interface ClichyVillejuifReport {
  isCriteriaMet: boolean;
  factorVCutoffPercent: number; // 20% if age < 30, 30% if age >= 30
  rationale: string;
}

export interface LatencyPhenotypeReport {
  phenotype: 'Hyperacute (< 7 days)' | 'Acute (8 - 28 days)' | 'Subacute (29 days - 26 weeks)';
  cerebralEdemaRisk: 'Very High (up to 75%)' | 'Moderate (30 - 50%)' | 'Low (< 15%)';
  spontaneousSurvivalPotential: 'Highest (50 - 60% with APAP)' | 'Moderate (20 - 30%)' | 'Poorest (< 15% without Transplant)';
  latencyComment: string;
}

export interface CerebralEdemaRiskReport {
  projectedIcpMmHg: number; // 8 - 40 mmHg
  herniationRiskPercent: number; // 0 - 100%
  cerebralPerfusionPressureMmHg: number; // MAP - ICP
  astrocyticSwellingGrade: 'Mild' | 'Moderate' | 'Severe Cytotoxic Swelling' | 'Transtentorial Herniation Imminent';
  neurocriticalTargetDeviations: string[];
  managementDirectives: string[];
}

export interface CoagulopathyReport {
  isRebalancedHemostasis: boolean;
  ffpProphylaxisPermitted: boolean;
  fibrinogenMgDl: number;
  syntheticDeficitSummary: string;
  coagulopathyWarning: string;
}

export interface AlfScenario {
  id: string;
  name: string;
  patientSummary: string;
  initialState: PatientAlfState;
  clinicalPearls: string[];
}

/**
 * 1. Evaluate King\'s College Hospital Prognostic Criteria
 */
export function evaluateKingsCriteria(state: PatientAlfState): KingsCollegeReport {
  const isApap = state.etiology === 'acetaminophen_toxicity';
  const fulfilledSpecificCriteria: string[] = [];

  if (isApap) {
    // APAP Criteria:
    // 1. Arterial pH < 7.30 after resuscitation
    // OR ALL THREE of:
    // - INR > 6.5
    // - Creatinine > 3.4 mg/dL
    // - Encephalopathy Grade 3 or 4
    // (Lactate > 3.0 after resuscitation also considered)
    if (state.arterialPh < 7.30) {
      fulfilledSpecificCriteria.push('Arterial pH < 7.30 after fluid resuscitation (single decisive criterion)');
    }

    const triadCriteria: string[] = [];
    if (state.inr > 6.5) triadCriteria.push(`Profound coagulopathy (INR ${state.inr} > 6.5)`);
    if (state.serumCreatinineMgDl > 3.4) triadCriteria.push(`Renal failure (Creatinine ${state.serumCreatinineMgDl} > 3.4 mg/dL)`);
    if (state.encephalopathyGrade >= 3) triadCriteria.push(`Advanced Encephalopathy (Grade ${state.encephalopathyGrade})`);

    const isTriadMet = triadCriteria.length === 3;
    if (isTriadMet) {
      fulfilledSpecificCriteria.push(`The Classic APAP Triad: ${triadCriteria.join(' + ')}`);
    }

    if (state.arterialLactateMmolL > 3.5) {
      fulfilledSpecificCriteria.push(`Hyperlactatemia (Lactate ${state.arterialLactateMmolL} > 3.5 mmol/L post-resuscitation)`);
    }

    const isCriteriaFulfilled = state.arterialPh < 7.30 || isTriadMet || state.arterialLactateMmolL > 3.5;
    const mortalityWithoutTransplantPercent = isCriteriaFulfilled ? 88 : 25;

    return {
      isCriteriaFulfilled,
      algorithmType: 'Acetaminophen (APAP)',
      emergencyListingRecommended: isCriteriaFulfilled,
      mortalityWithoutTransplantPercent,
      fulfilledSpecificCriteria,
      clinicalPrognosticRationale: isCriteriaFulfilled
        ? 'King\'s College APAP criteria FULFILLED. Spontaneous recovery is < 15%. Immediate UNOS Status 1A / Super-Urgent Liver Transplant listing mandatory.'
        : 'APAP King\'s College criteria not fulfilled. Continue aggressive medical resuscitation with IV N-Acetylcysteine (NAC) and CRRT.',
    };
  } else {
    // Non-APAP Criteria:
    // 1. INR > 6.5 regardless of encephalopathy grade
    // OR ANY 3 of the following 5:
    // - Age < 10 or > 40
    // - Etiology (DILI, indeterminate, autoimmune, Wilson\'s)
    // - Jaundice to encephalopathy interval > 7 days (acute/subacute)
    // - INR > 3.5
    // - Bilirubin > 17.5 mg/dL (300 umol/L)
    if (state.inr > 6.5) {
      fulfilledSpecificCriteria.push(`Profound coagulopathy alone (INR ${state.inr} > 6.5)`);
    }

    const fiveCriteria: string[] = [];
    if (state.patientAge < 10 || state.patientAge > 40) {
      fiveCriteria.push(`Unfavorable age (${state.patientAge} years: <10 or >40)`);
    }
    if (['idiosyncratic_dili', 'cryptogenic_indeterminate', 'wilsons_disease', 'autoimmune_hepatitis'].includes(state.etiology)) {
      fiveCriteria.push(`Unfavorable etiology (${state.etiology.replace(/_/g, ' ')})`);
    }
    if (state.jaundiceToEncephalopathyDays > 7) {
      fiveCriteria.push(`Prolonged latency (Jaundice-to-Encephalopathy ${state.jaundiceToEncephalopathyDays}d > 7 days)`);
    }
    if (state.inr > 3.5) {
      fiveCriteria.push(`Marked coagulopathy (INR ${state.inr} > 3.5)`);
    }
    if (state.totalBilirubinMgDl > 17.5) {
      fiveCriteria.push(`Severe hyperbilirubinemia (${state.totalBilirubinMgDl} > 17.5 mg/dL)`);
    }

    if (fiveCriteria.length >= 3) {
      fulfilledSpecificCriteria.push(`3 or more of 5 Non-APAP adverse markers met (${fiveCriteria.length}/5): ${fiveCriteria.join('; ')}`);
    }

    const isCriteriaFulfilled = state.inr > 6.5 || fiveCriteria.length >= 3;
    const mortalityWithoutTransplantPercent = isCriteriaFulfilled ? 92 : 35;

    return {
      isCriteriaFulfilled,
      algorithmType: 'Non-Acetaminophen (Non-APAP)',
      emergencyListingRecommended: isCriteriaFulfilled,
      mortalityWithoutTransplantPercent,
      fulfilledSpecificCriteria,
      clinicalPrognosticRationale: isCriteriaFulfilled
        ? 'King\'s College Non-APAP criteria FULFILLED. Spontaneous survival is dismal (< 10%). Immediate super-urgent liver transplantation listing is lifesaving.'
        : 'Non-APAP King\'s College criteria not fulfilled. Maintain intensive care monitoring, investigate Wilson\'s disease and viral serologies, and administer IV NAC.',
    };
  }
}

/**
 * 2. Evaluate Clichy-Villejuif Criteria (Hepatitis B & Viral ALF)
 */
export function evaluateClichyCriteria(state: PatientAlfState): ClichyVillejuifReport {
  const factorVCutoff = state.patientAge < 30 ? 20 : 30;
  const isEncephalopathySevere = state.encephalopathyGrade >= 3;
  const isFactorVDiminished = state.factorVPercent < factorVCutoff;

  const isCriteriaMet = isEncephalopathySevere && isFactorVDiminished;
  const rationale = isCriteriaMet
    ? `Clichy Criteria MET (Factor V ${state.factorVPercent}% < ${factorVCutoff}% cutoff for age ${state.patientAge} with Grade ${state.encephalopathyGrade} Encephalopathy). Strongly predictive of mortality without transplantation.`
    : `Clichy Criteria NOT met (Factor V: ${state.factorVPercent}% vs cutoff < ${factorVCutoff}%; Encephalopathy: Grade ${state.encephalopathyGrade}).`;

  return {
    isCriteriaMet,
    factorVCutoffPercent: factorVCutoff,
    rationale,
  };
}

/**
 * 3. Classify Latency Phenotype (Hyperacute vs Acute vs Subacute)
 */
export function classifyLatencyPhenotype(latencyDays: number): LatencyPhenotypeReport {
  if (latencyDays <= 7) {
    return {
      phenotype: 'Hyperacute (< 7 days)',
      cerebralEdemaRisk: 'Very High (up to 75%)',
      spontaneousSurvivalPotential: 'Highest (50 - 60% with APAP)',
      latencyComment: 'Rapid catastrophic hepatic necrosis. Extreme vulnerability to cytotoxic astrocytic swelling and intracranial hypertension, but superior capacity for spontaneous hepatic regeneration if bridged past the critical window.',
    };
  } else if (latencyDays <= 28) {
    return {
      phenotype: 'Acute (8 - 28 days)',
      cerebralEdemaRisk: 'Moderate (30 - 50%)',
      spontaneousSurvivalPotential: 'Moderate (20 - 30%)',
      latencyComment: 'Intermediate course typical of acute viral hepatitis B or certain drug toxicities. Moderate risk of intracranial hypertension; spontaneous regeneration is limited.',
    };
  } else {
    return {
      phenotype: 'Subacute (29 days - 26 weeks)',
      cerebralEdemaRisk: 'Low (< 15%)',
      spontaneousSurvivalPotential: 'Poorest (< 15% without Transplant)',
      latencyComment: 'Insidious progressive hepatocyte collapse with marked jaundice, ascites, and late encephalopathy. Intracranial hypertension is rare, but spontaneous recovery without liver transplantation is exceptionally poor (< 15%).',
    };
  }
}

/**
 * 4. Ammonia Neurotoxicity & Cytotoxic Cerebral Edema Kinetics
 */
export function calculateCerebralEdemaRisk(state: PatientAlfState): CerebralEdemaRiskReport {
  const {
    arterialAmmoniaUmolL,
    encephalopathyGrade,
    serumSodiumMeqL,
    headOfBedElevated30Deg,
    intubatedAndMechanicallyVentilated,
    crrtActive,
  } = state;

  // Baseline ICP driven by arterial ammonia and encephalopathy
  // Normal ICP 8-12 mmHg. Ammonia > 150 umol/L causes astrocytic glutamine accumulation
  let baseIcp = 10.0;
  if (arterialAmmoniaUmolL > 200) baseIcp += 16.0;
  else if (arterialAmmoniaUmolL > 150) baseIcp += 10.0;
  else if (arterialAmmoniaUmolL > 100) baseIcp += 5.0;

  baseIcp += encephalopathyGrade * 3.0;

  // Neuroprotective mitigations
  if (serumSodiumMeqL >= 145 && serumSodiumMeqL <= 150) baseIcp -= 4.0; // Hypertonic saline target
  if (headOfBedElevated30Deg) baseIcp -= 2.5; // Venous drainage
  if (crrtActive) baseIcp -= 3.5; // Continuous ammonia clearance
  if (intubatedAndMechanicallyVentilated && encephalopathyGrade >= 3) baseIcp -= 2.0;

  const projectedIcpMmHg = Math.max(8, Math.round(baseIcp));

  // Herniation risk percentage: non-linear spike when ICP > 20-25 mmHg
  let herniationRiskPercent = 5;
  if (projectedIcpMmHg >= 30) herniationRiskPercent = 85;
  else if (projectedIcpMmHg >= 25) herniationRiskPercent = 60;
  else if (projectedIcpMmHg >= 20) herniationRiskPercent = 35;
  else if (arterialAmmoniaUmolL >= 150) herniationRiskPercent = 20;

  let astrocyticSwellingGrade: CerebralEdemaRiskReport['astrocyticSwellingGrade'] = 'Mild';
  if (projectedIcpMmHg >= 30 || arterialAmmoniaUmolL > 220) {
    astrocyticSwellingGrade = 'Transtentorial Herniation Imminent';
  } else if (projectedIcpMmHg >= 20 || arterialAmmoniaUmolL > 150) {
    astrocyticSwellingGrade = 'Severe Cytotoxic Swelling';
  } else if (projectedIcpMmHg >= 15) {
    astrocyticSwellingGrade = 'Moderate';
  }

  // CPP = MAP - ICP (assuming mean arterial pressure ~ 75)
  const cerebralPerfusionPressureMmHg = Math.max(20, 75 - projectedIcpMmHg);

  const neurocriticalTargetDeviations: string[] = [];
  const managementDirectives: string[] = [];

  if (arterialAmmoniaUmolL > 150) {
    neurocriticalTargetDeviations.push(`Arterial ammonia critical (${arterialAmmoniaUmolL} > 150 umol/L threshold for cerebral herniation)`);
    managementDirectives.push('Initiate high-dose Continuous Renal Replacement Therapy (CRRT / CVVHDF) immediately for extracorporeal ammonia clearance.');
  }

  if (serumSodiumMeqL < 145) {
    neurocriticalTargetDeviations.push(`Serum sodium (${serumSodiumMeqL} mEq/L) below neuroprotective target (145-150 mEq/L)`);
    managementDirectives.push('Administer 3% Hypertonic Saline continuous infusion or boluses to target serum sodium 145-150 mEq/L, creating an osmotic gradient to shrink astrocytes.');
  }

  if (encephalopathyGrade >= 3 && !intubatedAndMechanicallyVentilated) {
    neurocriticalTargetDeviations.push('Grade III/IV encephalopathy without airway protection');
    managementDirectives.push('Elective endotracheal intubation mandatory. Maintain PaCO2 35-40 mmHg; avoid hypoventilation (hypercapnia causes cerebral vasodilation).');
  }

  if (!headOfBedElevated30Deg) {
    managementDirectives.push('Elevate head of bed to 30 degrees and maintain neutral neck alignment to maximize internal jugular venous drainage.');
  }

  return {
    projectedIcpMmHg,
    herniationRiskPercent,
    cerebralPerfusionPressureMmHg,
    astrocyticSwellingGrade,
    neurocriticalTargetDeviations,
    managementDirectives,
  };
}

/**
 * 5. Coagulopathy & Rebalanced Hemostasis Audit
 */
export function evaluateCoagulopathy(state: PatientAlfState): CoagulopathyReport {
  const { inr, factorVPercent } = state;
  const estimatedFibrinogen = Math.max(60, Math.round(180 - (inr - 1.5) * 25));

  const ffpProphylaxisPermitted = false; // EASL/AASLD strict rule: no prophylactic FFP!
  const coagulopathyWarning =
    'CRITICAL PARADOX: Despite elevated INR, patients with ALF maintain "Rebalanced Hemostasis" due to parallel loss of Antithrombin III and Protein C. Prophylactic FFP administration is STRICTLY CONTRAINDICATED as it obscures INR prognostic accuracy, causes fatal volume overload, and does not reduce procedure-related bleeding.';

  return {
    isRebalancedHemostasis: true,
    ffpProphylaxisPermitted,
    fibrinogenMgDl: estimatedFibrinogen,
    syntheticDeficitSummary: `Factor V (${factorVPercent}%) and INR (${inr}) demonstrate profound hepatic synthetic arrest. Platelet transfusion indicated only for active bleeding or count < 50,000 before invasive procedures.`,
    coagulopathyWarning,
  };
}

/**
 * 6. Clinical Scenarios Catalog
 */
export const ALF_SCENARIOS: Record<string, AlfScenario> = {
  severe_apap_overdose: {
    id: 'severe_apap_overdose',
    name: '1. Massive Acetaminophen Overdose (Hyperacute Acidemia & AKI)',
    patientSummary: '24yo female presenting 36 hours after ingesting 40g acetaminophen. Arterial pH 7.21, INR 7.8, Creatinine 4.1 mg/dL, arterial ammonia 210 umol/L, Grade 3 encephalopathy.',
    initialState: {
      patientAge: 24,
      etiology: 'acetaminophen_toxicity',
      jaundiceToEncephalopathyDays: 2,
      encephalopathyGrade: 3,
      arterialPh: 7.21,
      arterialLactateMmolL: 6.8,
      serumCreatinineMgDl: 4.1,
      inr: 7.8,
      factorVPercent: 12,
      totalBilirubinMgDl: 4.5,
      arterialAmmoniaUmolL: 210,
      serumSodiumMeqL: 136,
      headOfBedElevated30Deg: true,
      intubatedAndMechanicallyVentilated: true,
      crrtActive: false,
      nacInfusionActive: true,
    },
    clinicalPearls: [
      'Arterial pH < 7.30 alone triggers King\'s College emergency transplant listing. The combination of acidosis, severe AKI, and Grade 3 encephalopathy carries 90% mortality without grafting.',
      'Hyperacute APAP causes sudden hyperammonemia (> 200 umol/L) with rapid cerebral edema. Early CRRT must be initiated immediately for ammonia filtration.',
      'High-dose IV N-Acetylcysteine (NAC) must be continued regardless of time from ingestion to scavenge free radicals and improve microvascular perfusion.',
    ],
  },
  acute_hepatitis_b_fulminant: {
    id: 'acute_hepatitis_b_fulminant',
    name: '2. Fulminant Acute Hepatitis B (Non-APAP King\'s College Fulfilled)',
    patientSummary: '46yo male with acute HBV infection. Progressive jaundice for 12 days followed by sudden agitation and confusion (Grade 3 coma). INR 4.2, Bilirubin 24 mg/dL, Factor V 18%.',
    initialState: {
      patientAge: 46,
      etiology: 'viral_hepatitis_b',
      jaundiceToEncephalopathyDays: 12,
      encephalopathyGrade: 3,
      arterialPh: 7.38,
      arterialLactateMmolL: 2.2,
      serumCreatinineMgDl: 1.4,
      inr: 4.2,
      factorVPercent: 18,
      totalBilirubinMgDl: 24.0,
      arterialAmmoniaUmolL: 165,
      serumSodiumMeqL: 138,
      headOfBedElevated30Deg: true,
      intubatedAndMechanicallyVentilated: false,
      crrtActive: false,
      nacInfusionActive: false,
    },
    clinicalPearls: [
      'Fulfills Non-APAP King\'s Criteria: Age > 40, Jaundice-to-Encephalopathy > 7d, INR > 3.5, and Bilirubin > 17.5 mg/dL (4 of 5 criteria met!).',
      'Also fulfills Clichy criteria: Factor V 18% (< 30% cutoff for age >= 30) with Grade 3 encephalopathy.',
      'Initiate oral Tenofovir or Entecavir immediately; list for Super-Urgent Liver Transplantation.',
    ],
  },
  dili_subacute_failure: {
    id: 'dili_subacute_failure',
    name: '3. Idiosyncratic Drug-Induced Liver Injury (Subacute Failure)',
    patientSummary: '58yo female with pulmonary tuberculosis treated with Isoniazid/Rifampin. Deep jaundice for 5 weeks, now somnolent (Grade 2 encephalopathy). Bilirubin 31 mg/dL, INR 3.8.',
    initialState: {
      patientAge: 58,
      etiology: 'idiosyncratic_dili',
      jaundiceToEncephalopathyDays: 35,
      encephalopathyGrade: 2,
      arterialPh: 7.41,
      arterialLactateMmolL: 1.8,
      serumCreatinineMgDl: 1.1,
      inr: 3.8,
      factorVPercent: 24,
      totalBilirubinMgDl: 31.5,
      arterialAmmoniaUmolL: 95,
      serumSodiumMeqL: 141,
      headOfBedElevated30Deg: true,
      intubatedAndMechanicallyVentilated: false,
      crrtActive: false,
      nacInfusionActive: true,
    },
    clinicalPearls: [
      'Subacute ALF has low cerebral edema risk (< 15%), but lowest spontaneous recovery rate (< 15% survival without transplant).',
      'Non-APAP King\'s criteria fulfilled: Age > 40, DILI etiology, Latency > 7d, INR > 3.5, Bilirubin > 17.5 (all 5 criteria met!).',
      'Stop all hepatotoxic antimicrobials immediately; expedite transfer to tertiary transplant center.',
    ],
  },
  wilsons_fulminant_crisis: {
    id: 'wilsons_fulminant_crisis',
    name: '4. Fulminant Wilson\'s Disease with Coombs-Negative Hemolysis',
    patientSummary: '19yo female presenting with acute liver failure, massive intravascular hemolysis, dark urine, alkaline phosphatase to bilirubin ratio < 4, and Kayser-Fleischer rings.',
    initialState: {
      patientAge: 19,
      etiology: 'wilsons_disease',
      jaundiceToEncephalopathyDays: 5,
      encephalopathyGrade: 2,
      arterialPh: 7.32,
      arterialLactateMmolL: 3.1,
      serumCreatinineMgDl: 2.3,
      inr: 4.8,
      factorVPercent: 16,
      totalBilirubinMgDl: 38.0,
      arterialAmmoniaUmolL: 140,
      serumSodiumMeqL: 139,
      headOfBedElevated30Deg: true,
      intubatedAndMechanicallyVentilated: false,
      crrtActive: true,
      nacInfusionActive: false,
    },
    clinicalPearls: [
      'Fulminant Wilson\'s disease with Coombs-negative hemolytic anemia is 100% fatal without emergency liver transplantation.',
      'Hallmark lab pattern: Disproportionately low alkaline phosphatase with high bilirubin (Alk Phos / Bilirubin ratio < 4), AST > ALT, and acute renal failure.',
      'Therapeutic plasma exchange (TPE) or albumin dialysis can be used as a temporary bridge to clear circulating toxic copper prior to graft implantation.',
    ],
  },
};
