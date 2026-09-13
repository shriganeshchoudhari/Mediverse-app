import {
  calculateHemodynamicGradients,
  auditIschemiaReperfusionWindow,
  evaluateReboaSafety,
  REBOA_SCENARIOS,
  PatientReboaState,
} from '../../.gemini/skills/ReboaPhysiologyEngine';

describe('ReboaPhysiologyEngine', () => {
  describe('calculateHemodynamicGradients', () => {
    it('computes proximal MAP, distal MAP and transverse gradient correctly', () => {
      const state = REBOA_SCENARIOS.pelvic_zone3_preboa.initialState;
      const result = calculateHemodynamicGradients(state);

      // SBP 102, DBP 62 -> MAP = (2*62 + 102)/3 = 226/3 = 75
      expect(result.proximalMap).toBe(75);
      expect(result.distalMap).toBe(38);
      expect(result.transverseGradientMmHg).toBe(37);
      expect(result.coronaryCerebralPerfusionAdequate).toBe(true);
      expect(result.afterloadStrainHazard).toBe(false);
    });

    it('identifies excessive afterload hazard when proximal SBP is dangerously high', () => {
      const highAfterloadState: PatientReboaState = {
        ...REBOA_SCENARIOS.pelvic_zone3_preboa.initialState,
        radialArtLineSbp: 180,
        radialArtLineDbp: 95,
      };
      const result = calculateHemodynamicGradients(highAfterloadState);

      expect(result.afterloadStrainHazard).toBe(true);
      expect(result.summary).toContain('EXCESSIVE AFTERLOAD HAZARD');
    });

    it('alerts to critical central hypotension when proximal MAP is inadequate', () => {
      const arrestState: PatientReboaState = {
        ...REBOA_SCENARIOS.pelvic_zone3_preboa.initialState,
        radialArtLineSbp: 55,
        radialArtLineDbp: 30,
      };
      const result = calculateHemodynamicGradients(arrestState);

      expect(result.coronaryCerebralPerfusionAdequate).toBe(false);
      expect(result.summary).toContain('CRITICAL CENTRAL HYPOTENSION');
    });
  });

  describe('auditIschemiaReperfusionWindow', () => {
    it('classifies Zone 3 pREBOA within safe duration', () => {
      const state = REBOA_SCENARIOS.pelvic_zone3_preboa.initialState; // 18 min in Zone 3 pREBOA
      const result = auditIschemiaReperfusionWindow(state);

      expect(result.ischemicRiskTier).toBe('safe');
      expect(result.maxSafeDurationMinutes).toBe(90);
      expect(result.washoutAcidosisWarning).toBeNull();
    });

    it('flags critical ischemic ceiling and reperfusion hyperkalemia risk for prolonged Zone 1 inflation', () => {
      const prolongedZone1State: PatientReboaState = {
        ...REBOA_SCENARIOS.ruptured_liver_zone1_critical_time.initialState,
        totalInflationDurationMinutes: 35, // > 30 min ceiling
        serumPotassiumMeqL: 5.2,
      };
      const result = auditIschemiaReperfusionWindow(prolongedZone1State);

      expect(result.ischemicRiskTier).toBe('critical_necrosis_imminent');
      expect(result.maxSafeDurationMinutes).toBe(30);
      expect(result.postDeflationExpectedPotassium).toBeGreaterThanOrEqual(6.0);
      expect(result.washoutAcidosisWarning).toContain('LETHAL HYPERKALEMIA HAZARD');
    });
  });

  describe('evaluateReboaSafety', () => {
    it('detects absolute contraindication of thoracic aortic transection', () => {
      const state = REBOA_SCENARIOS.thoracic_tear_contraindication.initialState;
      const verdict = evaluateReboaSafety(state);

      expect(verdict.contraindicationAlert).toContain('ABSOLUTE CONTRAINDICATION: Suspected or confirmed thoracic aortic rupture');
      expect(verdict.strategyRecommendation).toContain('ABORT / DEFLATE IMMEDIATELY');
    });

    it('flags contraindicated deployment in Zone 2 no-fly zone', () => {
      const zone2State: PatientReboaState = {
        ...REBOA_SCENARIOS.pelvic_zone3_preboa.initialState,
        balloonZone: 'zone_2_visceral_no_occlusion',
      };
      const verdict = evaluateReboaSafety(zone2State);

      expect(verdict.contraindicationAlert).toContain('CONTRAINDICATED ZONE (ZONE 2 NO-FLY)');
    });

    it('recommends transition to partial REBOA for sustained complete occlusion', () => {
      const sustainedCompleteState: PatientReboaState = {
        ...REBOA_SCENARIOS.pelvic_zone3_preboa.initialState,
        occlusionStrategy: 'complete_reboa',
        totalInflationDurationMinutes: 20,
      };
      const verdict = evaluateReboaSafety(sustainedCompleteState);

      expect(verdict.strategyRecommendation).toContain('TRANSITION TO PARTIAL REBOA (pREBOA)');
      expect(verdict.deflationProtocolSteps.length).toBeGreaterThanOrEqual(4);
    });

    it('updates damage control checklist when surgical control is achieved', () => {
      const controlledState: PatientReboaState = {
        ...REBOA_SCENARIOS.pelvic_zone3_preboa.initialState,
        ongoingSurgicalControlAchieved: true,
      };
      const verdict = evaluateReboaSafety(controlledState);

      expect(verdict.damageControlChecklist).toContain(
        'Definitive surgical/angio hemostasis achieved; safe to completely deflate balloon'
      );
    });
  });
});
