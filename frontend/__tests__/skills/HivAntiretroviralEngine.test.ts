import {
  evaluateOiProphylaxis,
  evaluateArtSafety,
  evaluateIrisRisk,
  computeHivAntiretroviralState,
  HIV_PRESETS,
} from '../../.gemini/skills/HivAntiretroviralEngine';

describe('HivAntiretroviralEngine', () => {
  describe('evaluateOiProphylaxis', () => {
    it('requires no primary prophylaxis for CD4 >= 200', () => {
      const result = evaluateOiProphylaxis({
        cd4CountCellsPerUl: 500,
        cd4Percentage: 25,
        hivRnaViralLoadCopiesPerMl: 50000,
        estimatedCrClMlMin: 90,
        serumCreatinineMgDl: 1.0,
        hepatitisBSurfaceAntigen: false,
        hepatitisCAntibody: false,
        toxoplasmaIgGPositive: true,
        serumCryptococcalAntigenPositive: false,
        tuberculosisActiveInfection: false,
        cryptococcalMeningitisActive: false,
        hlaB5701Positive: false,
        knownM184VMutation: false,
        knownK103NMutation: false,
      });

      expect(result.pcpIndicated).toBe(false);
      expect(result.toxoIndicated).toBe(false);
      expect(result.macIndicated).toBe(false);
      expect(result.crAgScreeningRecommended).toBe(false);
    });

    it('triggers PCP prophylaxis for CD4 < 200', () => {
      const result = evaluateOiProphylaxis({
        cd4CountCellsPerUl: 160,
        cd4Percentage: 12,
        hivRnaViralLoadCopiesPerMl: 120000,
        estimatedCrClMlMin: 90,
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
      });

      expect(result.pcpIndicated).toBe(true);
      expect(result.pcpAgent).toMatch(/Trimethoprim-Sulfamethoxazole/i);
      expect(result.toxoIndicated).toBe(false);
      expect(result.macIndicated).toBe(false);
    });

    it('triggers Toxoplasma prophylaxis and CrAg screening for CD4 < 100 with Toxo IgG (+)', () => {
      const result = evaluateOiProphylaxis({
        cd4CountCellsPerUl: 65,
        cd4Percentage: 6,
        hivRnaViralLoadCopiesPerMl: 400000,
        estimatedCrClMlMin: 90,
        serumCreatinineMgDl: 1.0,
        hepatitisBSurfaceAntigen: false,
        hepatitisCAntibody: false,
        toxoplasmaIgGPositive: true,
        serumCryptococcalAntigenPositive: false,
        tuberculosisActiveInfection: false,
        cryptococcalMeningitisActive: false,
        hlaB5701Positive: false,
        knownM184VMutation: false,
        knownK103NMutation: false,
      });

      expect(result.pcpIndicated).toBe(true);
      expect(result.toxoIndicated).toBe(true);
      expect(result.crAgScreeningRecommended).toBe(true);
      expect(result.macIndicated).toBe(false);
    });

    it('triggers MAC prophylaxis for CD4 < 50', () => {
      const result = evaluateOiProphylaxis({
        cd4CountCellsPerUl: 25,
        cd4Percentage: 3,
        hivRnaViralLoadCopiesPerMl: 700000,
        estimatedCrClMlMin: 85,
        serumCreatinineMgDl: 1.1,
        hepatitisBSurfaceAntigen: false,
        hepatitisCAntibody: false,
        toxoplasmaIgGPositive: false,
        serumCryptococcalAntigenPositive: false,
        tuberculosisActiveInfection: false,
        cryptococcalMeningitisActive: false,
        hlaB5701Positive: false,
        knownM184VMutation: false,
        knownK103NMutation: false,
      });

      expect(result.pcpIndicated).toBe(true);
      expect(result.macIndicated).toBe(true);
      expect(result.macAgent).toMatch(/Azithromycin/i);
    });
  });

  describe('evaluateArtSafety', () => {
    it('contraindicates Triumeq (Abacavir) when HLA-B*5701 is positive', () => {
      const safety = evaluateArtSafety(
        'TRIUMEQ_DTG_ABC_3TC',
        {
          cd4CountCellsPerUl: 350,
          cd4Percentage: 20,
          hivRnaViralLoadCopiesPerMl: 40000,
          estimatedCrClMlMin: 95,
          serumCreatinineMgDl: 0.9,
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
        false
      );

      expect(safety.isRegimenAppropriate).toBe(false);
      expect(safety.regimenSafetyRating).toBe('CONTRAINDICATED');
      expect(safety.hlaB5701Warning).toBe(true);
      expect(safety.contraindicationReason).toMatch(/HLA-B\*5701/i);
    });

    it('contraindicates Dovato when Hepatitis B Surface Antigen is positive', () => {
      const safety = evaluateArtSafety(
        'DOVATO_DTG_3TC_2DRUG',
        {
          cd4CountCellsPerUl: 300,
          cd4Percentage: 18,
          hivRnaViralLoadCopiesPerMl: 60000,
          estimatedCrClMlMin: 90,
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
        false
      );

      expect(safety.isRegimenAppropriate).toBe(false);
      expect(safety.hbvCoverageAdequate).toBe(false);
      expect(safety.contraindicationReason).toMatch(/HEPATITIS B/i);
    });

    it('flags Rifampin drug interactions with Biktarvy and Dolutegravir', () => {
      const lab = {
        cd4CountCellsPerUl: 80,
        cd4Percentage: 8,
        hivRnaViralLoadCopiesPerMl: 250000,
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
      };

      const biktarvy = evaluateArtSafety('BIKTARVY_BIC_TAF_FTC', lab, true);
      expect(biktarvy.isRegimenAppropriate).toBe(false);
      expect(biktarvy.contraindicationReason).toMatch(/RIFAMPIN/i);

      const dtg = evaluateArtSafety('TIVICAY_DESCOVY_DTG_TAF_FTC', lab, true);
      expect(dtg.regimenSafetyRating).toBe('REQUIRES_DOSE_ADJUSTMENT');
      expect(dtg.contraindicationReason).toMatch(/TWICE daily/i);
    });
  });

  describe('evaluateIrisRisk', () => {
    it('mandates deferral of ART for acute Cryptococcal Meningitis', () => {
      const iris = evaluateIrisRisk(
        {
          cd4CountCellsPerUl: 24,
          cd4Percentage: 3,
          hivRnaViralLoadCopiesPerMl: 400000,
          estimatedCrClMlMin: 70,
          serumCreatinineMgDl: 1.1,
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
        1
      );

      expect(iris.irisRiskCategory).toBe('CRITICAL_DELAY_ART');
      expect(iris.safeToStartArtNow).toBe(false);
      expect(iris.recommendedArtDelayWeeks).toBe(4);
      expect(iris.irisExplanation).toMatch(/CRYPTOCOCCAL MENINGITIS/i);
    });
  });

  describe('Clinical Presets', () => {
    it('handles NEWLY_DIAGNOSED_ASYMPTOMATIC_CD4_HIGH with safe ART and no OI prophylaxis', () => {
      const state = computeHivAntiretroviralState(HIV_PRESETS.NEWLY_DIAGNOSED_ASYMPTOMATIC_CD4_HIGH.initialState);
      expect(state.cd4Stratification).toBe('STAGE_1_GE_500');
      expect(state.prophylaxis.pcpIndicated).toBe(false);
      expect(state.artSafety.isRegimenAppropriate).toBe(true);
      expect(state.activeAlarms).toContain('ART_REGIMEN_SAFE_OPTIMAL_VIRAL_SUPPRESSION');
    });

    it('handles ADVANCED_HIV_PCP_PROPHYLAXIS_CD4_150 requiring TMP-SMX', () => {
      const state = computeHivAntiretroviralState(HIV_PRESETS.ADVANCED_HIV_PCP_PROPHYLAXIS_CD4_150.initialState);
      expect(state.prophylaxis.pcpIndicated).toBe(true);
      expect(state.activeAlarms).toContain('CD4_LESS_THAN_200_PCP_PROPHYLAXIS_REQUIRED');
    });

    it('handles CRYPTOCOCCAL_MENINGITIS_ART_TIMING_DILEMMA with critical deferral alarm', () => {
      const state = computeHivAntiretroviralState(HIV_PRESETS.CRYPTOCOCCAL_MENINGITIS_ART_TIMING_DILEMMA.initialState);
      expect(state.iris.safeToStartArtNow).toBe(false);
      expect(state.activeAlarms).toContain('CRYPTOCOCCAL_MENINGITIS_LETHAL_CNS_IRIS_DEFER_ART');
      expect(state.clinicalGuidance).toMatch(/DEFER ART/i);
    });

    it('handles HLA_B5701_POSITIVE_ABACAVIR_CONTRAINDICATION with safety alarm', () => {
      const state = computeHivAntiretroviralState(HIV_PRESETS.HLA_B5701_POSITIVE_ABACAVIR_CONTRAINDICATION.initialState);
      expect(state.artSafety.isRegimenAppropriate).toBe(false);
      expect(state.activeAlarms).toContain('HLA_B5701_POSITIVE_FATAL_ABACAVIR_HYPERSENSITIVITY');
    });

    it('handles CHRONIC_HEPATITIS_B_HIV_COINFECTION with HBV resistance alarm', () => {
      const state = computeHivAntiretroviralState(HIV_PRESETS.CHRONIC_HEPATITIS_B_HIV_COINFECTION.initialState);
      expect(state.artSafety.isRegimenAppropriate).toBe(false);
      expect(state.activeAlarms).toContain('HEPATITIS_B_COINFECTION_MONOTHERAPY_RESISTANCE_RISK');
    });
  });
});
