import {
  calculateHeartScore,
  evaluateEscTroponinAlgorithm,
  calculateTimiRiskScore,
  calculateGraceScore,
  evaluateAcsPharmacotherapy,
  performComprehensiveAcsEvaluation
} from '../../.gemini/skills/AcsRiskTroponinEngine';

describe('AcsRiskTroponinEngine', () => {
  describe('calculateHeartScore', () => {
    it('accurately stratifies low risk (0-3 points)', () => {
      const result = calculateHeartScore({
        history: 1, // moderately suspicious
        ecg: 0, // normal
        age: 0, // <45
        riskFactors: 1, // 1-2 risk factors
        troponin: 0 // normal
      });
      expect(result.totalScore).toBe(2);
      expect(result.riskCategory).toBe('LOW');
      expect(result.maceRatePercent).toBe(1.7);
    });

    it('accurately stratifies intermediate risk (4-6 points)', () => {
      const result = calculateHeartScore({
        history: 1,
        ecg: 1,
        age: 1, // 45-64
        riskFactors: 1,
        troponin: 1 // 1-3x URL
      });
      expect(result.totalScore).toBe(5);
      expect(result.riskCategory).toBe('INTERMEDIATE');
      expect(result.maceRatePercent).toBe(16.6);
    });

    it('accurately stratifies high risk (7-10 points)', () => {
      const result = calculateHeartScore({
        history: 2, // highly suspicious
        ecg: 2, // significant ST deviation
        age: 2, // >=65
        riskFactors: 2, // >=3 risk factors
        troponin: 1 // 1-3x URL
      });
      expect(result.totalScore).toBe(9);
      expect(result.riskCategory).toBe('HIGH');
      expect(result.maceRatePercent).toBe(50.1);
    });
  });

  describe('evaluateEscTroponinAlgorithm', () => {
    it('rules out NSTEMI via Roche hs-cTnT 0/1h with baseline < 5 ng/L and onset >= 3h', () => {
      const result = evaluateEscTroponinAlgorithm({
        assay: 'HS_CTNT_ROCHE',
        protocolTiming: 'ZERO_ONE_HOUR',
        chestPainOnsetHours: 4.5,
        baselineTroponinNgL: 3.5,
        repeatTroponinNgL: 3.7
      });
      expect(result.pathway).toBe('RULE_OUT');
      expect(result.negativePredictiveValuePercent).toBeGreaterThanOrEqual(99);
      expect(result.earlyPresenterWarning).toBe(false);
    });

    it('rules in NSTEMI via Roche hs-cTnT with delta >= 5 ng/L', () => {
      const result = evaluateEscTroponinAlgorithm({
        assay: 'HS_CTNT_ROCHE',
        protocolTiming: 'ZERO_ONE_HOUR',
        chestPainOnsetHours: 2.0,
        baselineTroponinNgL: 14.0,
        repeatTroponinNgL: 20.5 // delta 6.5
      });
      expect(result.pathway).toBe('RULE_IN');
      expect(result.deltaTroponinNgL).toBe(6.5);
      expect(result.positivePredictiveValuePercent).toBeGreaterThan(70);
    });

    it('triggers early presenter safeguard when onset < 3h and baseline is undetectable with zero delta', () => {
      const result = evaluateEscTroponinAlgorithm({
        assay: 'HS_CTNT_ROCHE',
        protocolTiming: 'ZERO_ONE_HOUR',
        chestPainOnsetHours: 1.0, // onset only 1 hour ago
        baselineTroponinNgL: 3.0,
        repeatTroponinNgL: 3.0
      });
      expect(result.earlyPresenterWarning).toBe(true);
      expect(result.pathway).toBe('OBSERVE');
      expect(result.pathwayRationale).toContain('Early Presenter Caveat');
    });

    it('classifies Abbott hs-cTnI into observe zone when non-diagnostic', () => {
      const result = evaluateEscTroponinAlgorithm({
        assay: 'HS_CTNI_ABBOTT',
        protocolTiming: 'ZERO_ONE_HOUR',
        chestPainOnsetHours: 4.0,
        baselineTroponinNgL: 18.0, // > 5 but < 52
        repeatTroponinNgL: 20.0 // delta 2.0 (< 6)
      });
      expect(result.pathway).toBe('OBSERVE');
      expect(result.clinicalAction).toContain('3-hour hs-cTnI');
    });
  });

  describe('calculateTimiRiskScore', () => {
    it('calculates TIMI 0-2 as low risk', () => {
      const result = calculateTimiRiskScore({
        age65OrOlder: false,
        threeOrMoreCadRiskFactors: true,
        knownCadStenosis50Percent: false,
        aspirinUsePast7Days: false,
        severeAnginaEpisodesPast24h: false,
        stDeviationPoint5Mm: false,
        elevatedCardiacMarkers: false
      });
      expect(result.totalScore).toBe(1);
      expect(result.riskTier).toBe('LOW');
      expect(result.fourteenDayMacePercent).toBe(4.7);
    });

    it('calculates TIMI 5 as high risk with high revascularization benefit', () => {
      const result = calculateTimiRiskScore({
        age65OrOlder: true,
        threeOrMoreCadRiskFactors: true,
        knownCadStenosis50Percent: true,
        aspirinUsePast7Days: true,
        severeAnginaEpisodesPast24h: true,
        stDeviationPoint5Mm: false,
        elevatedCardiacMarkers: false
      });
      expect(result.totalScore).toBe(5);
      expect(result.riskTier).toBe('HIGH');
      expect(result.fourteenDayMacePercent).toBe(26.2);
    });
  });

  describe('calculateGraceScore', () => {
    it('recommends immediate invasive strategy (<2 hours) for cardiogenic shock (Killip IV)', () => {
      const result = calculateGraceScore({
        ageYears: 68,
        heartRateBpm: 125,
        systolicBpMmHg: 82,
        serumCreatinineMgDl: 1.8,
        killipClass: 4, // cardiogenic shock
        cardiacArrestAtAdmission: false,
        stSegmentDeviation: true,
        elevatedCardiacMarkers: true
      });
      expect(result.riskCategory).toBe('HIGH');
      expect(result.invasiveStrategyTiming).toBe('IMMEDIATE_LESS_THAN_2H');
      expect(result.timingRationale).toContain('VERY HIGH RISK');
    });

    it('recommends early invasive strategy (<24 hours) for high GRACE score with ST deviation', () => {
      const result = calculateGraceScore({
        ageYears: 72,
        heartRateBpm: 88,
        systolicBpMmHg: 135,
        serumCreatinineMgDl: 1.4,
        killipClass: 1,
        cardiacArrestAtAdmission: false,
        stSegmentDeviation: true,
        elevatedCardiacMarkers: true
      });
      expect(result.totalScore).toBeGreaterThan(140);
      expect(result.invasiveStrategyTiming).toBe('EARLY_LESS_THAN_24H');
    });
  });

  describe('evaluateAcsPharmacotherapy', () => {
    it('strictly contraindicates Prasugrel in patients with prior stroke or TIA', () => {
      const result = evaluateAcsPharmacotherapy({
        contraindicationToAspirin: false,
        priorStrokeOrTia: true,
        ageOver75OrWeightUnder60Kg: false,
        plannedEarlyInvasiveCatheterization: true,
        rightVentricularInfarctionSuspected: false,
        recentPde5InhibitorUse: false,
        gastrointestinalBleedRiskHigh: false
      });
      expect(result.p2y12InhibitorChoice).toBe('TICAGRELOR');
      expect(result.p2y12DosingRationale).toContain('PRASUGREL STRICTLY CONTRAINDICATED');
      expect(result.criticalWarnings).toContain('Prasugrel contraindicated: Prior Stroke/TIA.');
    });

    it('strictly contraindicates Nitrates in Right Ventricular Infarction', () => {
      const result = evaluateAcsPharmacotherapy({
        contraindicationToAspirin: false,
        priorStrokeOrTia: false,
        ageOver75OrWeightUnder60Kg: false,
        plannedEarlyInvasiveCatheterization: false,
        rightVentricularInfarctionSuspected: true,
        recentPde5InhibitorUse: false,
        gastrointestinalBleedRiskHigh: false
      });
      expect(result.nitrateAndOpioidSafety).toContain('NITRATES STRICTLY CONTRAINDICATED');
      expect(result.criticalWarnings).toContain('CRITICAL CONTRAINDICATION: Nitrates prohibited in RV infarction.');
    });

    it('strictly contraindicates Nitrates with recent PDE-5 inhibitor use', () => {
      const result = evaluateAcsPharmacotherapy({
        contraindicationToAspirin: false,
        priorStrokeOrTia: false,
        ageOver75OrWeightUnder60Kg: false,
        plannedEarlyInvasiveCatheterization: false,
        rightVentricularInfarctionSuspected: false,
        recentPde5InhibitorUse: true,
        gastrointestinalBleedRiskHigh: false
      });
      expect(result.nitrateAndOpioidSafety).toContain('Recent phosphodiesterase-5 (PDE-5) inhibitor use');
      expect(result.criticalWarnings).toContain('CRITICAL CONTRAINDICATION: Nitrates prohibited with recent PDE-5 inhibitor use.');
    });
  });

  describe('performComprehensiveAcsEvaluation', () => {
    it('produces unified synthesis for confirmed NSTEMI', () => {
      const evaluation = performComprehensiveAcsEvaluation({
        heartInput: { history: 2, ecg: 2, age: 2, riskFactors: 2, troponin: 2 },
        troponinInput: {
          assay: 'HS_CTNT_ROCHE',
          protocolTiming: 'ZERO_ONE_HOUR',
          chestPainOnsetHours: 4,
          baselineTroponinNgL: 65,
          repeatTroponinNgL: 80
        },
        timiInput: {
          age65OrOlder: true,
          threeOrMoreCadRiskFactors: true,
          knownCadStenosis50Percent: true,
          aspirinUsePast7Days: true,
          severeAnginaEpisodesPast24h: true,
          stDeviationPoint5Mm: true,
          elevatedCardiacMarkers: true
        },
        graceInput: {
          ageYears: 70,
          heartRateBpm: 95,
          systolicBpMmHg: 130,
          serumCreatinineMgDl: 1.5,
          killipClass: 1,
          cardiacArrestAtAdmission: false,
          stSegmentDeviation: true,
          elevatedCardiacMarkers: true
        },
        pharmacotherapyInput: {
          contraindicationToAspirin: false,
          priorStrokeOrTia: false,
          ageOver75OrWeightUnder60Kg: false,
          plannedEarlyInvasiveCatheterization: true,
          rightVentricularInfarctionSuspected: false,
          recentPde5InhibitorUse: false,
          gastrointestinalBleedRiskHigh: true
        }
      });

      expect(evaluation.heart.riskCategory).toBe('HIGH');
      expect(evaluation.troponinEsc.pathway).toBe('RULE_IN');
      expect(evaluation.timi.totalScore).toBe(7);
      expect(evaluation.unifiedClinicalSynthesis).toContain('CONFIRMED ACUTE CORONARY SYNDROME');
      expect(evaluation.teachingPearls.length).toBeGreaterThanOrEqual(5);
    });
  });
});
