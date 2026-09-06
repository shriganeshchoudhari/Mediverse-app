import {
  computeStewartAcidBase,
  calculateCorrectedAnionGap,
  STEWART_PRESETS,
  StewartInputParams,
} from '@/.gemini/skills/StewartAcidBaseEngine';

const DEFAULT_PARAMS: StewartInputParams = {
  presetId: 'NORMAL_PLASMA_HOMEOSTASIS',
  naMeqL: 140,
  kMeqL: 4.0,
  caMeqL: 2.2,
  mgMeqL: 1.8,
  clMeqL: 105,
  lactateMeqL: 1.0,
  albuminGDL: 4.2,
  phosphateMgDL: 3.5,
  pco2MmHg: 40,
  fluidInfusion: 'NONE',
  fluidVolumeLiters: 0,
};

describe('StewartAcidBaseEngine', () => {
  describe('Classical & Albumin-Corrected Anion Gap', () => {
    test('standard albumin (4.0 g/dL) results in identical classical and corrected AG', () => {
      const { classicalAg, correctedAg } = calculateCorrectedAnionGap(140, 4, 104, 24, 4.0);
      expect(classicalAg).toBe(16);
      expect(correctedAg).toBe(16);
    });

    test('hypoalbuminemia (2.0 g/dL) increases corrected AG by +5 mEq/L', () => {
      // 2.5 * (4.0 - 2.0) = +5.0
      const { classicalAg, correctedAg } = calculateCorrectedAnionGap(140, 4, 104, 24, 2.0);
      expect(classicalAg).toBe(16);
      expect(correctedAg).toBe(21);
    });
  });

  describe('Stewart Physico-Chemical Homeostasis & Strong Ion Difference', () => {
    test('normal physiological plasma yields SID ~42 mEq/L and SIG ~0 mEq/L', () => {
      const state = computeStewartAcidBase(DEFAULT_PARAMS);
      expect(state.sidApparentMeqL).toBeCloseTo(42.0, 0);
      expect(state.sigMeqL).toBeCloseTo(0.0, 0);
      expect(state.ph).toBeGreaterThanOrEqual(7.35);
      expect(state.ph).toBeLessThanOrEqual(7.45);
      expect(state.activeAlarms).toContain('OPTIMAL_ACID_BASE');
    });

    test('saline resuscitation preset produces hyperchloremic strong ion acidosis', () => {
      const state = computeStewartAcidBase({
        ...DEFAULT_PARAMS,
        ...STEWART_PRESETS.SALINE_RESUSCITATION_HYPERCHLOREMIC.initialState,
        presetId: 'SALINE_RESUSCITATION_HYPERCHLOREMIC',
      });
      expect(state.sidApparentMeqL).toBeLessThan(34);
      expect(state.ph).toBeLessThan(7.30);
      expect(state.activeAlarms).toContain('SEVERE_HYPERCHLOREMIC_ACIDOSIS');
      expect(state.clinicalRecommendation).toContain('HYPERCHLOREMIC STRONG ION ACIDOSIS');
      expect(state.clinicalRecommendation).toContain('Plasma-Lyte');
    });

    test('infusion of 0.9% normal saline dilutes SID and lowers pH', () => {
      const baseline = computeStewartAcidBase({
        ...DEFAULT_PARAMS,
        fluidInfusion: 'NONE',
        fluidVolumeLiters: 0,
      });
      const withSaline = computeStewartAcidBase({
        ...DEFAULT_PARAMS,
        fluidInfusion: 'NORMAL_SALINE_09',
        fluidVolumeLiters: 4,
      });
      expect(withSaline.sidApparentMeqL).toBeLessThan(baseline.sidApparentMeqL);
      expect(withSaline.ph).toBeLessThan(baseline.ph);
    });
  });

  describe('Unmeasured Anions & Strong Ion Gap (SIG)', () => {
    test('severe DKA presents with markedly elevated SIG (unmeasured ketoacids)', () => {
      const state = computeStewartAcidBase({
        ...DEFAULT_PARAMS,
        ...STEWART_PRESETS.DKA_UNMEASURED_ANIONS.initialState,
        presetId: 'DKA_UNMEASURED_ANIONS',
      });
      expect(state.sigMeqL).toBeGreaterThanOrEqual(10);
      expect(state.activeAlarms).toContain('UNMEASURED_ANIONS_HIGH_SIG');
      expect(state.ph).toBeLessThan(7.20);
      expect(state.clinicalRecommendation).toContain('HIGH STRONG ION GAP');
    });

    test('septic shock with hypoalbuminemia unmasks occult tissue acidosis via high SIG', () => {
      const state = computeStewartAcidBase({
        ...DEFAULT_PARAMS,
        ...STEWART_PRESETS.SEPTIC_SHOCK_HYPOALBUMINEMIA_MASK.initialState,
        presetId: 'SEPTIC_SHOCK_HYPOALBUMINEMIA_MASK',
      });
      expect(state.sigMeqL).toBeGreaterThanOrEqual(4.0);
      expect(state.activeAlarms).toContain('HYPOALBUMINEMIC_ALKALOSIS_MASK');
      expect(state.clinicalRecommendation).toContain('MASKED ACIDOSIS');
    });

    test('severe ESRD uremic acidosis displays high SIG and metabolic acidosis', () => {
      const state = computeStewartAcidBase({
        ...DEFAULT_PARAMS,
        ...STEWART_PRESETS.UREMIC_ACIDOSIS_ESRD.initialState,
        presetId: 'UREMIC_ACIDOSIS_ESRD',
      });
      expect(state.sigMeqL).toBeGreaterThanOrEqual(4.0);
      expect(state.activeAlarms).toContain('UNMEASURED_ANIONS_HIGH_SIG');
    });
  });

  describe('Hypochloremic Contraction Alkalosis', () => {
    test('vomiting-induced hypochloremia widens SID and produces profound alkalosis', () => {
      const state = computeStewartAcidBase({
        ...DEFAULT_PARAMS,
        ...STEWART_PRESETS.CONTRACTION_ALKALOSIS_VOMITING.initialState,
        presetId: 'CONTRACTION_ALKALOSIS_VOMITING',
      });
      expect(state.sidApparentMeqL).toBeGreaterThan(48);
      expect(state.ph).toBeGreaterThan(7.50);
      expect(state.activeAlarms).toContain('CONTRACTION_HYPOCHLOREMIC_ALKALOSIS');
      expect(state.clinicalRecommendation).toContain('HYPOCHLOREMIC CONTRACTION ALKALOSIS');
    });
  });
});
