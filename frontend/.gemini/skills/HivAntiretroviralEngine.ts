/**
 * HivAntiretroviralEngine.ts
 * Biophysical simulation & clinical decision engine for HIV pharmacotherapy,
 * CD4 T-cell opportunistic infection (OI) prophylaxis thresholds,
 * Antiretroviral Therapy (ART) selection, HLA-B*5701 pharmacogenomics,
 * HBV/TB drug interactions, and Immune Reconstitution Inflammatory Syndrome (IRIS).
 *
 * Location: frontend/.gemini/skills/HivAntiretroviralEngine.ts
 */

export type HivPresetId =
  | 'NEWLY_DIAGNOSED_ASYMPTOMATIC_CD4_HIGH'
  | 'ADVANCED_HIV_PCP_PROPHYLAXIS_CD4_150'
  | 'CRITICAL_CD4_UNDER_50_MULTI_OI_RISK'
  | 'CRYPTOCOCCAL_MENINGITIS_ART_TIMING_DILEMMA'
  | 'TB_HIV_COINFECTION_RIFAMYCIN_DRUG_INTERACTIONS'
  | 'HLA_B5701_POSITIVE_ABACAVIR_CONTRAINDICATION'
  | 'CHRONIC_HEPATITIS_B_HIV_COINFECTION'
  | 'VIROLOGIC_FAILURE_RESISTANCE_MUTATIONS';

export type ArtRegimenId =
  | 'BIKTARVY_BIC_TAF_FTC'
  | 'TRIUMEQ_DTG_ABC_3TC'
  | 'DOVATO_DTG_3TC_2DRUG'
  | 'TIVICAY_DESCOVY_DTG_TAF_FTC'
  | 'DARUNAVIR_RITONAVIR_DESCOVY'
  | 'EFAVIRENZ_TRUVADA_EFV_TDF_FTC';

export interface HivLaboratoryProfiles {
  cd4CountCellsPerUl: number; // 5 to 1200
  cd4Percentage: number; // 2 to 45%
  hivRnaViralLoadCopiesPerMl: number; // 20 to 2,000,000
  estimatedCrClMlMin: number; // 15 to 130
  serumCreatinineMgDl: number; // 0.6 to 4.0
  hepatitisBSurfaceAntigen: boolean; // HBsAg positive
  hepatitisCAntibody: boolean; // Anti-HCV positive
  toxoplasmaIgGPositive: boolean;
  serumCryptococcalAntigenPositive: boolean;
  tuberculosisActiveInfection: boolean;
  cryptococcalMeningitisActive: boolean;
  hlaB5701Positive: boolean;
  knownM184VMutation: boolean;
  knownK103NMutation: boolean;
}

export interface HivInputParams {
  presetId: HivPresetId;
  patientAgeYears: number;
  laboratory: HivLaboratoryProfiles;
  prescribedArtRegimen: ArtRegimenId;
  isOnRifampinTbTherapy: boolean;
  weeksSinceOiTreatmentStarted: number; // For IRIS timing (0 to 12 weeks)
}

export interface OiProphylaxisPlan {
  pcpIndicated: boolean;
  pcpAgent: string;
  toxoIndicated: boolean;
  toxoAgent: string;
  macIndicated: boolean;
  macAgent: string;
  crAgScreeningRecommended: boolean;
}

export interface ArtSafetyAnalysis {
  isRegimenAppropriate: boolean;
  regimenSafetyRating: 'PREFERRED' | 'ALTERNATIVE' | 'CONTRAINDICATED' | 'REQUIRES_DOSE_ADJUSTMENT';
  contraindicationReason?: string;
  hlaB5701Warning: boolean;
  hbvCoverageAdequate: boolean;
  renalDosingWarning: boolean;
  drugDrugInteractionWarning: boolean;
}

export interface IrisRiskAssessment {
  irisRiskCategory: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL_DELAY_ART';
  safeToStartArtNow: boolean;
  recommendedArtDelayWeeks: number;
  irisExplanation: string;
}

export interface HivAntiretroviralState {
  // 1. CD4 Staging & WHO Clinical Stage
  whoClinicalStage: 1 | 2 | 3 | 4;
  cd4Stratification: 'STAGE_1_GE_500' | 'STAGE_2_200_499' | 'STAGE_3_50_199' | 'STAGE_4_LT_50';
  isSevereImmunodeficiency: boolean;

  // 2. Opportunistic Infection Prophylaxis
  prophylaxis: OiProphylaxisPlan;

  // 3. ART Analysis
  artSafety: ArtSafetyAnalysis;

  // 4. IRIS & Timing
  iris: IrisRiskAssessment;

  // 5. Projected CD4 & Viral Load Timeline (6 months)
  projectedTrajectory: {
    month: number;
    expectedCd4: number;
    expectedViralLoadLog: number;
  }[];

  // 6. Alarms & Clinical Guidance
  activeAlarms: string[];
  clinicalGuidance: string;
}

/**
 * 1. Evaluate Opportunistic Infection Prophylaxis Requirements
 */
export function evaluateOiProphylaxis(lab: HivLaboratoryProfiles): OiProphylaxisPlan {
  const cd4 = lab.cd4CountCellsPerUl;

  // PCP: CD4 < 200 or CD4% < 14%
  const pcpIndicated = cd4 < 200 || lab.cd4Percentage < 14;
  const pcpAgent = pcpIndicated
    ? 'Trimethoprim-Sulfamethoxazole (TMP-SMX DS 1 tab PO daily). Alternatives: Dapsone 100mg PO daily, Atovaquone 1500mg daily, or aerosolized Pentamidine 300mg/month.'
    : 'None indicated (CD4 >= 200 /uL).';

  // Toxoplasma: CD4 < 100 and Toxo IgG (+)
  const toxoIndicated = cd4 < 100 && lab.toxoplasmaIgGPositive;
  const toxoAgent = toxoIndicated
    ? 'TMP-SMX DS 1 tab PO daily (provides dual PCP & Toxo coverage). Alternative: Dapsone 50mg daily + Pyrimethamine 50mg weekly + Leucovorin 25mg weekly.'
    : 'None indicated (CD4 >= 100 /uL or Toxo IgG negative).';

  // MAC: CD4 < 50
  const macIndicated = cd4 < 50;
  const macAgent = macIndicated
    ? 'Azithromycin 1200 mg PO once weekly (or Clarithromycin 500 mg PO BID). Note: modern DHHS guidelines state MAC prophylaxis may be deferred if patient initiates fully suppressive ART immediately.'
    : 'None indicated (CD4 >= 50 /uL).';

  // CrAg Screening: CD4 < 100
  const crAgScreeningRecommended = cd4 < 100;

  return {
    pcpIndicated,
    pcpAgent,
    toxoIndicated,
    toxoAgent,
    macIndicated,
    macAgent,
    crAgScreeningRecommended,
  };
}

/**
 * 2. Evaluate ART Regimen Safety & Potential Contraindications
 */
export function evaluateArtSafety(
  regimen: ArtRegimenId,
  lab: HivLaboratoryProfiles,
  isOnRifampin: boolean
): ArtSafetyAnalysis {
  let isRegimenAppropriate = true;
  let regimenSafetyRating: 'PREFERRED' | 'ALTERNATIVE' | 'CONTRAINDICATED' | 'REQUIRES_DOSE_ADJUSTMENT' = 'PREFERRED';
  let contraindicationReason: string | undefined;
  let hlaB5701Warning = false;
  let hbvCoverageAdequate = true;
  let renalDosingWarning = false;
  let drugDrugInteractionWarning = false;

  // 1. HLA-B*5701 and Abacavir (Triumeq)
  if (regimen === 'TRIUMEQ_DTG_ABC_3TC') {
    if (lab.hlaB5701Positive) {
      isRegimenAppropriate = false;
      regimenSafetyRating = 'CONTRAINDICATED';
      contraindicationReason = 'HLA-B*5701 POSITIVE: Abacavir is strictly contraindicated due to high risk of fatal multi-organ hypersensitivity reaction (HSR).';
      hlaB5701Warning = true;
    }
  }

  // 2. Hepatitis B Co-infection & 2-Drug Dovato
  if (lab.hepatitisBSurfaceAntigen) {
    if (regimen === 'DOVATO_DTG_3TC_2DRUG') {
      isRegimenAppropriate = false;
      regimenSafetyRating = 'CONTRAINDICATED';
      contraindicationReason = 'HEPATITIS B CO-INFECTION: Dovato (DTG/3TC) provides only Lamivudine monotherapy against HBV, which leads to rapid emergence of M204V/I HBV resistance mutations. Must use TDF/FTC or TAF/FTC dual-active backbone.';
      hbvCoverageAdequate = false;
    } else if (regimen === 'TRIUMEQ_DTG_ABC_3TC') {
      // 3TC is only active HBV drug in Triumeq (Abacavir has no HBV activity)
      isRegimenAppropriate = false;
      regimenSafetyRating = 'CONTRAINDICATED';
      contraindicationReason = 'HEPATITIS B CO-INFECTION: Triumeq lacks Tenofovir; 3TC monotherapy causes HBV resistance. Switch to TDF or TAF containing regimen.';
      hbvCoverageAdequate = false;
    }
  }

  // 3. Dovato in high baseline viral load
  if (regimen === 'DOVATO_DTG_3TC_2DRUG' && lab.hivRnaViralLoadCopiesPerMl > 500000) {
    if (regimenSafetyRating !== 'CONTRAINDICATED') {
      isRegimenAppropriate = false;
      regimenSafetyRating = 'CONTRAINDICATED';
      contraindicationReason = 'HIGH VIRAL LOAD (>500,000 copies/mL): 2-drug Dovato (DTG/3TC) is contraindicated due to increased virologic failure rates in clinical trials (GEMINI).';
    }
  }

  // 4. Resistance mutations (M184V / K103N)
  if (lab.knownM184VMutation) {
    if (regimen === 'DOVATO_DTG_3TC_2DRUG') {
      isRegimenAppropriate = false;
      regimenSafetyRating = 'CONTRAINDICATED';
      contraindicationReason = 'M184V RESISTANCE MUTATION: Confers >100-fold resistance to Lamivudine (3TC) and Emtricitabine (FTC). Dovato would function as Dolutegravir monotherapy, risking rapid integrase resistance.';
    }
  }

  if (lab.knownK103NMutation && regimen === 'EFAVIRENZ_TRUVADA_EFV_TDF_FTC') {
    isRegimenAppropriate = false;
    regimenSafetyRating = 'CONTRAINDICATED';
    contraindicationReason = 'K103N RESISTANCE MUTATION: Confers complete high-level class resistance to Efavirenz (NNRTI).';
  }

  // 5. Rifampin Drug Interactions
  if (isOnRifampin) {
    if (regimen === 'BIKTARVY_BIC_TAF_FTC') {
      isRegimenAppropriate = false;
      regimenSafetyRating = 'CONTRAINDICATED';
      contraindicationReason = 'RIFAMPIN INTERACTION: Potent CYP3A4 and P-gp induction reduces Bictegravir and TAF concentrations by >80%, causing virologic failure. Biktarvy cannot be dose-adjusted with Rifampin.';
      drugDrugInteractionWarning = true;
    } else if (regimen === 'TIVICAY_DESCOVY_DTG_TAF_FTC' || regimen === 'TRIUMEQ_DTG_ABC_3TC') {
      regimenSafetyRating = 'REQUIRES_DOSE_ADJUSTMENT';
      drugDrugInteractionWarning = true;
      contraindicationReason = 'RIFAMPIN CO-ADMINISTRATION: Requires increasing Dolutegravir dose from 50 mg once daily to 50 mg TWICE daily (BID) to overcome UGT1A1/CYP3A induction.';
    }
  }

  // 6. Renal Function
  if (lab.estimatedCrClMlMin < 30) {
    if (regimen === 'BIKTARVY_BIC_TAF_FTC') {
      renalDosingWarning = true;
      if (regimenSafetyRating === 'PREFERRED') regimenSafetyRating = 'ALTERNATIVE';
    }
  }

  return {
    isRegimenAppropriate,
    regimenSafetyRating,
    contraindicationReason,
    hlaB5701Warning,
    hbvCoverageAdequate,
    renalDosingWarning,
    drugDrugInteractionWarning,
  };
}

/**
 * 3. Evaluate Immune Reconstitution Inflammatory Syndrome (IRIS) & Timing
 */
export function evaluateIrisRisk(
  lab: HivLaboratoryProfiles,
  weeksSinceOiStarted: number
): IrisRiskAssessment {
  // Cryptococcal Meningitis Timing Dilemma
  if (lab.cryptococcalMeningitisActive) {
    if (weeksSinceOiStarted < 2) {
      return {
        irisRiskCategory: 'CRITICAL_DELAY_ART',
        safeToStartArtNow: false,
        recommendedArtDelayWeeks: 4,
        irisExplanation:
          'ACTIVE CRYPTOCOCCAL MENINGITIS: Starting ART within 2 weeks of antifungal induction dramatically increases mortality due to lethal intracranial hypertension from CNS Immune Reconstitution Inflammatory Syndrome (COAT trial). DEFER ART for 2 to 6 weeks until CSF fungal burden is controlled.',
      };
    }
  }

  // Active Tuberculosis
  if (lab.tuberculosisActiveInfection) {
    if (lab.cd4CountCellsPerUl < 50) {
      return {
        irisRiskCategory: 'HIGH',
        safeToStartArtNow: true,
        recommendedArtDelayWeeks: 0,
        irisExplanation:
          'TB CO-INFECTION WITH CD4 < 50 /uL: Immediate ART initiation within 2 weeks of starting anti-TB therapy improves survival despite high risk of paradoxical TB-IRIS. Provide prophylactic or therapeutic corticosteroids (Prednisone) if severe IRIS occurs.',
      };
    } else {
      return {
        irisRiskCategory: 'MODERATE',
        safeToStartArtNow: true,
        recommendedArtDelayWeeks: 2,
        irisExplanation:
          'TB CO-INFECTION WITH CD4 >= 50 /uL: ART can safely be started within 2 to 8 weeks after anti-TB therapy initiation.',
      };
    }
  }

  // Low CD4 baseline
  if (lab.cd4CountCellsPerUl < 50) {
    return {
      irisRiskCategory: 'HIGH',
      safeToStartArtNow: true,
      recommendedArtDelayWeeks: 0,
      irisExplanation:
        'HIGH IRIS RISK: Very low CD4 count (< 50 /uL) with high viral load predisposes to unmasking or paradoxical IRIS (PCP, MAC, CMV, TB). Monitor closely for sudden inflammatory flares after ART initiation.',
    };
  }

  return {
    irisRiskCategory: 'LOW',
    safeToStartArtNow: true,
    recommendedArtDelayWeeks: 0,
    irisExplanation:
      'Low IRIS risk. CD4 >= 200 /uL and no active opportunistic CNS infection; start ART immediately on day of diagnosis (Rapid Start protocol).',
  };
}

/**
 * 4. Main State Computation Function
 */
export function computeHivAntiretroviralState(params: HivInputParams): HivAntiretroviralState {
  const { laboratory: lab, prescribedArtRegimen, isOnRifampinTbTherapy, weeksSinceOiTreatmentStarted } = params;

  // 1. CD4 Staging & WHO Stage
  let cd4Stratification: 'STAGE_1_GE_500' | 'STAGE_2_200_499' | 'STAGE_3_50_199' | 'STAGE_4_LT_50' = 'STAGE_1_GE_500';
  if (lab.cd4CountCellsPerUl < 50) cd4Stratification = 'STAGE_4_LT_50';
  else if (lab.cd4CountCellsPerUl < 200) cd4Stratification = 'STAGE_3_50_199';
  else if (lab.cd4CountCellsPerUl < 500) cd4Stratification = 'STAGE_2_200_499';

  let whoClinicalStage: 1 | 2 | 3 | 4 = 1;
  if (lab.cryptococcalMeningitisActive || lab.cd4CountCellsPerUl < 50) {
    whoClinicalStage = 4; // AIDS / severe OI
  } else if (lab.tuberculosisActiveInfection || lab.cd4CountCellsPerUl < 200) {
    whoClinicalStage = 3;
  } else if (lab.cd4CountCellsPerUl < 500) {
    whoClinicalStage = 2;
  }

  const isSevereImmunodeficiency = lab.cd4CountCellsPerUl < 200;

  // 2. OI Prophylaxis
  const prophylaxis = evaluateOiProphylaxis(lab);

  // 3. ART Safety
  const artSafety = evaluateArtSafety(prescribedArtRegimen, lab, isOnRifampinTbTherapy);

  // 4. IRIS Risk
  const iris = evaluateIrisRisk(lab, weeksSinceOiTreatmentStarted);

  // 5. Projected CD4 & Viral Load Timeline
  const baselineCd4 = lab.cd4CountCellsPerUl;
  const baselineLogVl = Math.log10(Math.max(20, lab.hivRnaViralLoadCopiesPerMl));

  const projectedTrajectory = [
    { month: 0, expectedCd4: baselineCd4, expectedViralLoadLog: parseFloat(baselineLogVl.toFixed(2)) },
    {
      month: 1,
      expectedCd4: Math.round(baselineCd4 + (artSafety.isRegimenAppropriate ? 50 : 0)),
      expectedViralLoadLog: parseFloat(Math.max(1.3, baselineLogVl - (artSafety.isRegimenAppropriate ? 2.0 : 0)).toFixed(2)),
    },
    {
      month: 3,
      expectedCd4: Math.round(baselineCd4 + (artSafety.isRegimenAppropriate ? 100 : 0)),
      expectedViralLoadLog: parseFloat(Math.max(1.3, baselineLogVl - (artSafety.isRegimenAppropriate ? 3.5 : 0)).toFixed(2)),
    },
    {
      month: 6,
      expectedCd4: Math.round(baselineCd4 + (artSafety.isRegimenAppropriate ? 175 : 0)),
      expectedViralLoadLog: 1.3, // Undetectable (<20 copies/mL)
    },
  ];

  // 6. Active Alarms
  const activeAlarms: string[] = [];

  if (iris.irisRiskCategory === 'CRITICAL_DELAY_ART') {
    activeAlarms.push('CRYPTOCOCCAL_MENINGITIS_LETHAL_CNS_IRIS_DEFER_ART');
  }

  if (artSafety.hlaB5701Warning) {
    activeAlarms.push('HLA_B5701_POSITIVE_FATAL_ABACAVIR_HYPERSENSITIVITY');
  }

  if (!artSafety.hbvCoverageAdequate) {
    activeAlarms.push('HEPATITIS_B_COINFECTION_MONOTHERAPY_RESISTANCE_RISK');
  }

  if (artSafety.drugDrugInteractionWarning) {
    activeAlarms.push('RIFAMPIN_CYP3A_POTENT_INDUCTION_DRUG_INTERACTION');
  }

  if (prophylaxis.pcpIndicated) {
    activeAlarms.push('CD4_LESS_THAN_200_PCP_PROPHYLAXIS_REQUIRED');
  }

  if (prophylaxis.toxoIndicated) {
    activeAlarms.push('CD4_LESS_THAN_100_TOXOPLASMOSIS_PROPHYLAXIS_REQUIRED');
  }

  if (prophylaxis.macIndicated) {
    activeAlarms.push('CD4_LESS_THAN_50_DISSEMINATED_MAC_RISK');
  }

  if (activeAlarms.length === 0) {
    activeAlarms.push('ART_REGIMEN_SAFE_OPTIMAL_VIRAL_SUPPRESSION');
  }

  // 7. Clinical Guidance
  let clinicalGuidance =
    'Standard first-line ART (e.g. Biktarvy or Dovato) recommended for rapid start. CD4 >= 500 /uL: excellent immunological reserve, no primary opportunistic infection prophylaxis required.';

  if (!iris.safeToStartArtNow) {
    clinicalGuidance = iris.irisExplanation;
  } else if (!artSafety.isRegimenAppropriate) {
    clinicalGuidance = `REGIMEN SAFETY WARNING: ${artSafety.contraindicationReason}`;
  } else if (prophylaxis.pcpIndicated && lab.cd4CountCellsPerUl < 50) {
    clinicalGuidance =
      'SEVERE IMMUNODEFICIENCY (CD4 < 50 /uL): Initiate TMP-SMX DS daily immediately (covers PCP and Toxoplasma). Rapidly start preferred INSTI-based ART (Biktarvy or Dolutegravir + TAF/FTC). Monitor closely for IRIS (fever, lymphadenopathy, respiratory distress). Check serum CrAg and fundus for CMV retinitis.';
  } else if (prophylaxis.pcpIndicated) {
    clinicalGuidance =
      'PCP PROPHYLAXIS INDICATED: CD4 < 200 /uL warrants TMP-SMX DS 1 tab PO daily until CD4 > 200 /uL for at least 3 consecutive months on suppressive ART. Initiate INSTI-based ART immediately.';
  } else if (isOnRifampinTbTherapy) {
    clinicalGuidance =
      'TB-HIV CO-MANAGEMENT: Rifampin induces CYP3A4 and UGT1A1. If using Dolutegravir, double the dose to 50 mg BID. Biktarvy is contraindicated. Start ART within 2 weeks of anti-TB drugs if CD4 < 50.';
  }

  return {
    whoClinicalStage,
    cd4Stratification,
    isSevereImmunodeficiency,
    prophylaxis,
    artSafety,
    iris,
    projectedTrajectory,
    activeAlarms,
    clinicalGuidance,
  };
}

/**
 * 8 Standard Validated Clinical Presets
 */
export const HIV_PRESETS: Record<
  HivPresetId,
  {
    title: string;
    description: string;
    initialState: HivInputParams;
  }
> = {
  NEWLY_DIAGNOSED_ASYMPTOMATIC_CD4_HIGH: {
    title: 'Newly Diagnosed Asymptomatic HIV (CD4 520, HLA-B*5701 Neg)',
    description:
      '29-year-old male with acute HIV diagnosis: CD4 520 /uL (28%), HIV RNA 45,000 copies/mL, HBsAg negative, CrCl 105 mL/min, HLA-B*5701 negative. Eligible for standard single-tablet regimen (Biktarvy or Triumeq), no OI prophylaxis needed.',
    initialState: {
      presetId: 'NEWLY_DIAGNOSED_ASYMPTOMATIC_CD4_HIGH',
      patientAgeYears: 29,
      laboratory: {
        cd4CountCellsPerUl: 520,
        cd4Percentage: 28,
        hivRnaViralLoadCopiesPerMl: 45000,
        estimatedCrClMlMin: 105,
        serumCreatinineMgDl: 0.9,
        hepatitisBSurfaceAntigen: false,
        hepatitisCAntibody: false,
        toxoplasmaIgGPositive: false,
        serumCryptococcalAntigenPositive: false,
        tuberculosisActiveInfection: false,
        cryptococcalMeningitisActive: false,
        hlaB5701Positive: false,
        knownM184VMutation: false,
        knownK103NMutation: false,
      },
      prescribedArtRegimen: 'BIKTARVY_BIC_TAF_FTC',
      isOnRifampinTbTherapy: false,
      weeksSinceOiTreatmentStarted: 0,
    },
  },

  ADVANCED_HIV_PCP_PROPHYLAXIS_CD4_150: {
    title: 'Advanced HIV with Oral Candidiasis (CD4 140 /uL, PCP Prophylaxis)',
    description:
      '38-year-old female presenting with oral thrush and weight loss: CD4 140 /uL (11%), HIV RNA 280,000 copies/mL. Meets criteria for primary PCP prophylaxis with TMP-SMX DS. Start preferred INSTI-based ART immediately.',
    initialState: {
      presetId: 'ADVANCED_HIV_PCP_PROPHYLAXIS_CD4_150',
      patientAgeYears: 38,
      laboratory: {
        cd4CountCellsPerUl: 140,
        cd4Percentage: 11,
        hivRnaViralLoadCopiesPerMl: 280000,
        estimatedCrClMlMin: 85,
        serumCreatinineMgDl: 1.0,
        hepatitisBSurfaceAntigen: false,
        hepatitisCAntibody: false,
        toxoplasmaIgGPositive: false,
        serumCryptococcalAntigenPositive: false,
        tuberculosisActiveInfection: false,
        cryptococcalMeningitisActive: false,
        hlaB5701Positive: false,
        knownM184VMutation: false,
        knownK103NMutation: false,
      },
      prescribedArtRegimen: 'BIKTARVY_BIC_TAF_FTC',
      isOnRifampinTbTherapy: false,
      weeksSinceOiTreatmentStarted: 0,
    },
  },

  CRITICAL_CD4_UNDER_50_MULTI_OI_RISK: {
    title: 'Critical Immunodeficiency (CD4 32 /uL, Toxo IgG Pos, Multi-OI Risk)',
    description:
      '44-year-old male with profound immunosuppression: CD4 32 /uL (4%), HIV RNA 850,000 copies/mL, Toxoplasma IgG positive, CrAg negative. Requires TMP-SMX DS daily for dual PCP and Toxo prophylaxis, weekly Azithromycin for MAC, and urgent ART initiation.',
    initialState: {
      presetId: 'CRITICAL_CD4_UNDER_50_MULTI_OI_RISK',
      patientAgeYears: 44,
      laboratory: {
        cd4CountCellsPerUl: 32,
        cd4Percentage: 4,
        hivRnaViralLoadCopiesPerMl: 850000,
        estimatedCrClMlMin: 72,
        serumCreatinineMgDl: 1.1,
        hepatitisBSurfaceAntigen: false,
        hepatitisCAntibody: false,
        toxoplasmaIgGPositive: true,
        serumCryptococcalAntigenPositive: false,
        tuberculosisActiveInfection: false,
        cryptococcalMeningitisActive: false,
        hlaB5701Positive: false,
        knownM184VMutation: false,
        knownK103NMutation: false,
      },
      prescribedArtRegimen: 'BIKTARVY_BIC_TAF_FTC',
      isOnRifampinTbTherapy: false,
      weeksSinceOiTreatmentStarted: 0,
    },
  },

  CRYPTOCOCCAL_MENINGITIS_ART_TIMING_DILEMMA: {
    title: 'Cryptococcal Meningitis (Lethal CNS IRIS Risk, Defer ART 4 Weeks)',
    description:
      '35-year-old female diagnosed with acute Cryptococcal Meningitis (CSF CrAg 1:1024, opening pressure 340 mmH2O): CD4 24 /uL, receiving Amphotericin B + Flucytosine for 1 week. ART must be DEFERRED for 2-6 weeks to prevent fatal intracranial IRIS.',
    initialState: {
      presetId: 'CRYPTOCOCCAL_MENINGITIS_ART_TIMING_DILEMMA',
      patientAgeYears: 35,
      laboratory: {
        cd4CountCellsPerUl: 24,
        cd4Percentage: 3,
        hivRnaViralLoadCopiesPerMl: 420000,
        estimatedCrClMlMin: 65,
        serumCreatinineMgDl: 1.2,
        hepatitisBSurfaceAntigen: false,
        hepatitisCAntibody: false,
        toxoplasmaIgGPositive: false,
        serumCryptococcalAntigenPositive: true,
        tuberculosisActiveInfection: false,
        cryptococcalMeningitisActive: true,
        hlaB5701Positive: false,
        knownM184VMutation: false,
        knownK103NMutation: false,
      },
      prescribedArtRegimen: 'BIKTARVY_BIC_TAF_FTC',
      isOnRifampinTbTherapy: false,
      weeksSinceOiTreatmentStarted: 1, // only 1 week into amphotericin B
    },
  },

  TB_HIV_COINFECTION_RIFAMYCIN_DRUG_INTERACTIONS: {
    title: 'TB-HIV Co-Infection (Rifampin CYP3A Induction, Double Dolutegravir)',
    description:
      '41-year-old male with active pulmonary tuberculosis on Rifampin: CD4 42 /uL, HIV RNA 320,000 copies/mL. Biktarvy is contraindicated due to severe CYP3A/P-gp induction. Preferred regimen is Dolutegravir 50mg BID + TAF/FTC. Start ART within 2 weeks.',
    initialState: {
      presetId: 'TB_HIV_COINFECTION_RIFAMYCIN_DRUG_INTERACTIONS',
      patientAgeYears: 41,
      laboratory: {
        cd4CountCellsPerUl: 42,
        cd4Percentage: 5,
        hivRnaViralLoadCopiesPerMl: 320000,
        estimatedCrClMlMin: 90,
        serumCreatinineMgDl: 0.9,
        hepatitisBSurfaceAntigen: false,
        hepatitisCAntibody: false,
        toxoplasmaIgGPositive: false,
        serumCryptococcalAntigenPositive: false,
        tuberculosisActiveInfection: true,
        cryptococcalMeningitisActive: false,
        hlaB5701Positive: false,
        knownM184VMutation: false,
        knownK103NMutation: false,
      },
      prescribedArtRegimen: 'TIVICAY_DESCOVY_DTG_TAF_FTC',
      isOnRifampinTbTherapy: true,
      weeksSinceOiTreatmentStarted: 1,
    },
  },

  HLA_B5701_POSITIVE_ABACAVIR_CONTRAINDICATION: {
    title: 'HLA-B*5701 Positive (Abacavir Fatal Hypersensitivity Hazard)',
    description:
      '52-year-old male evaluated for ART: CD4 380 /uL, HIV RNA 65,000 copies/mL, HLA-B*5701 positive. Triumeq (Abacavir / Dolutegravir / Lamivudine) is strictly contraindicated due to risk of fatal hypersensitivity reaction; Biktarvy or TAF/FTC indicated.',
    initialState: {
      presetId: 'HLA_B5701_POSITIVE_ABACAVIR_CONTRAINDICATION',
      patientAgeYears: 52,
      laboratory: {
        cd4CountCellsPerUl: 380,
        cd4Percentage: 22,
        hivRnaViralLoadCopiesPerMl: 65000,
        estimatedCrClMlMin: 80,
        serumCreatinineMgDl: 1.0,
        hepatitisBSurfaceAntigen: false,
        hepatitisCAntibody: false,
        toxoplasmaIgGPositive: false,
        serumCryptococcalAntigenPositive: false,
        tuberculosisActiveInfection: false,
        cryptococcalMeningitisActive: false,
        hlaB5701Positive: true,
        knownM184VMutation: false,
        knownK103NMutation: false,
      },
      prescribedArtRegimen: 'TRIUMEQ_DTG_ABC_3TC', // prescribed contraindication to test detection
      isOnRifampinTbTherapy: false,
      weeksSinceOiTreatmentStarted: 0,
    },
  },

  CHRONIC_HEPATITIS_B_HIV_COINFECTION: {
    title: 'HIV-HBV Co-Infection (Dovato 2-Drug Contraindicated, Dual Coverage)',
    description:
      '33-year-old male with chronic active Hepatitis B: HBsAg positive, HBV DNA 4,200,000 IU/mL, CD4 280 /uL. Dovato (DTG/3TC) is contraindicated because 3TC monotherapy causes rapid HBV resistance. Must prescribe TDF/FTC or TAF/FTC with Dolutegravir or Bictegravir.',
    initialState: {
      presetId: 'CHRONIC_HEPATITIS_B_HIV_COINFECTION',
      patientAgeYears: 33,
      laboratory: {
        cd4CountCellsPerUl: 280,
        cd4Percentage: 18,
        hivRnaViralLoadCopiesPerMl: 85000,
        estimatedCrClMlMin: 95,
        serumCreatinineMgDl: 0.9,
        hepatitisBSurfaceAntigen: true,
        hepatitisCAntibody: false,
        toxoplasmaIgGPositive: false,
        serumCryptococcalAntigenPositive: false,
        tuberculosisActiveInfection: false,
        cryptococcalMeningitisActive: false,
        hlaB5701Positive: false,
        knownM184VMutation: false,
        knownK103NMutation: false,
      },
      prescribedArtRegimen: 'DOVATO_DTG_3TC_2DRUG', // testing contraindication detection
      isOnRifampinTbTherapy: false,
      weeksSinceOiTreatmentStarted: 0,
    },
  },

  VIROLOGIC_FAILURE_RESISTANCE_MUTATIONS: {
    title: 'Virologic Failure with M184V & K103N Resistance Mutations',
    description:
      '46-year-old on non-adherent NNRTI regimen with viral rebound to 38,000 copies/mL: Genotype shows M184V (high-level 3TC/FTC resistance) and K103N (Efavirenz class resistance). Requires high-barrier boosted protease inhibitor or dual-active integrase regimen.',
    initialState: {
      presetId: 'VIROLOGIC_FAILURE_RESISTANCE_MUTATIONS',
      patientAgeYears: 46,
      laboratory: {
        cd4CountCellsPerUl: 220,
        cd4Percentage: 15,
        hivRnaViralLoadCopiesPerMl: 38000,
        estimatedCrClMlMin: 75,
        serumCreatinineMgDl: 1.1,
        hepatitisBSurfaceAntigen: false,
        hepatitisCAntibody: false,
        toxoplasmaIgGPositive: false,
        serumCryptococcalAntigenPositive: false,
        tuberculosisActiveInfection: false,
        cryptococcalMeningitisActive: false,
        hlaB5701Positive: false,
        knownM184VMutation: true,
        knownK103NMutation: true,
      },
      prescribedArtRegimen: 'EFAVIRENZ_TRUVADA_EFV_TDF_FTC',
      isOnRifampinTbTherapy: false,
      weeksSinceOiTreatmentStarted: 0,
    },
  },
};
