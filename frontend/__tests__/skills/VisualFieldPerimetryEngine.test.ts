import {
  getNormativeSensitivity,
  isBlindSpotPoint,
  getProbabilitySymbol,
  calculateCornealIopCorrection,
  calculateTargetIop,
  evaluateGlaucomaHemifield,
  determineHapStage,
  analyzeVisualField,
  PERIMETRY_PRESETS,
} from '../../.gemini/skills/VisualFieldPerimetryEngine';

describe('VisualFieldPerimetryEngine', () => {
  describe('Hill of Vision Normative Calculation', () => {
    it('returns high sensitivity near the fovea', () => {
      const foveal = getNormativeSensitivity(0, 0);
      expect(foveal).toBeGreaterThanOrEqual(32);
      expect(foveal).toBeLessThanOrEqual(35);
    });

    it('displays peripheral slope with lower sensitivity at high eccentricity', () => {
      const peripheral = getNormativeSensitivity(21, 21);
      const central = getNormativeSensitivity(3, 3);
      expect(peripheral).toBeLessThan(central);
      expect(peripheral).toBeGreaterThanOrEqual(16);
    });

    it('identifies physiological blind spot location correctly for OD and OS', () => {
      expect(isBlindSpotPoint(15, -3, 'OD')).toBe(true);
      expect(isBlindSpotPoint(15, 3, 'OD')).toBe(true);
      expect(isBlindSpotPoint(-15, -3, 'OD')).toBe(false);

      expect(isBlindSpotPoint(-15, -3, 'OS')).toBe(true);
      expect(isBlindSpotPoint(-15, 3, 'OS')).toBe(true);
      expect(isBlindSpotPoint(15, -3, 'OS')).toBe(false);
    });
  });

  describe('P-Value Probability Mapping', () => {
    it('maps severe deviations <= -10 dB to <0.5%', () => {
      expect(getProbabilitySymbol(-12)).toBe('<0.5%');
      expect(getProbabilitySymbol(-10)).toBe('<0.5%');
    });

    it('maps mild deviations between -3 and -5 dB to <5%', () => {
      expect(getProbabilitySymbol(-4)).toBe('<5%');
      expect(getProbabilitySymbol(-3)).toBe('<5%');
    });

    it('marks deviations > -3 dB as Not Significant (NS)', () => {
      expect(getProbabilitySymbol(-1)).toBe('NS');
      expect(getProbabilitySymbol(0)).toBe('NS');
      expect(getProbabilitySymbol(2)).toBe('NS');
    });
  });

  describe('Corneal Pachymetry & IOP Correction (Dresdner Formula)', () => {
    it('accurately identifies thin corneas (<515 µm) as understating true IOP', () => {
      const result = calculateCornealIopCorrection(22, 495);
      expect(result.cctRiskFactor).toBe('HIGH_RISK_THIN');
      expect(result.correctedIopMmHg).toBeGreaterThan(22);
      expect(result.correctedIopMmHg).toBe(24); // (545 - 495) * 0.04 = +2.0
    });

    it('identifies thick corneas (>580 µm) as overstating true IOP', () => {
      const result = calculateCornealIopCorrection(24, 595);
      expect(result.cctRiskFactor).toBe('PROTECTIVE_THICK');
      expect(result.correctedIopMmHg).toBeLessThan(24);
      expect(result.correctedIopMmHg).toBe(22); // (545 - 595) * 0.04 = -2.0
    });

    it('preserves measured IOP for average thickness cornea (545 µm)', () => {
      const result = calculateCornealIopCorrection(16, 545);
      expect(result.cctRiskFactor).toBe('AVERAGE');
      expect(result.correctedIopMmHg).toBe(16);
    });
  });

  describe('Target IOP Guidelines by Stage', () => {
    it('targets lower pressure and higher % drop for advanced stage', () => {
      const early = calculateTargetIop(24, 'STAGE_1_EARLY');
      const advanced = calculateTargetIop(24, 'STAGE_4_SEVERE');

      expect(advanced.percentageReductionNeeded).toBeGreaterThan(early.percentageReductionNeeded);
      expect(advanced.targetIopRange[1]).toBeLessThanOrEqual(early.targetIopRange[1]);
    });
  });

  describe('Clinical Presets Evaluation', () => {
    it('analyzes normal baseline preset with Stage 0 and within normal limits GHT', () => {
      const preset = PERIMETRY_PRESETS.find(p => p.id === 'normal-baseline')!;
      const points = preset.generatePoints('OD');
      const analysis = analyzeVisualField(
        points,
        preset.eye,
        'SITA_STANDARD',
        preset.measuredIop,
        preset.cct,
        preset.fixationLossesPct,
        preset.falsePositivesPct,
        preset.falseNegativesPct
      );

      expect(analysis.reliability.isReliable).toBe(true);
      expect(analysis.glaucomaHemifieldTest).toBe('WITHIN_NORMAL_LIMITS');
      expect(analysis.hapStage).toBe('STAGE_0_NORMAL');
      expect(analysis.visualFieldIndexPct).toBeGreaterThanOrEqual(95);
    });

    it('analyzes early POAG nasal step with Outside Normal Limits GHT', () => {
      const preset = PERIMETRY_PRESETS.find(p => p.id === 'early-poag-nasal-step')!;
      const points = preset.generatePoints('OD');
      const analysis = analyzeVisualField(
        points,
        preset.eye,
        'SITA_STANDARD',
        preset.measuredIop,
        preset.cct,
        preset.fixationLossesPct,
        preset.falsePositivesPct,
        preset.falseNegativesPct
      );

      expect(analysis.glaucomaHemifieldTest).toBe('OUTSIDE_NORMAL_LIMITS');
      expect(analysis.meanDeviationDb).toBeLessThan(0);
      expect(analysis.hapStage).toBe('STAGE_1_EARLY');
    });

    it('analyzes advanced glaucoma with severe depression and low VFI', () => {
      const preset = PERIMETRY_PRESETS.find(p => p.id === 'advanced-glaucoma-tunnel')!;
      const points = preset.generatePoints('OD');
      const analysis = analyzeVisualField(
        points,
        preset.eye,
        'SITA_STANDARD',
        preset.measuredIop,
        preset.cct,
        preset.fixationLossesPct,
        preset.falsePositivesPct,
        preset.falseNegativesPct
      );

      expect(analysis.meanDeviationDb).toBeLessThan(-12);
      expect(analysis.visualFieldIndexPct).toBeLessThan(50);
      expect(['STAGE_3_ADVANCED', 'STAGE_4_SEVERE', 'STAGE_5_END_STAGE']).toContain(analysis.hapStage);
    });

    it('flags high false positives as unreliable trigger-happy test', () => {
      const preset = PERIMETRY_PRESETS.find(p => p.id === 'unreliable-false-positives')!;
      const points = preset.generatePoints('OD');
      const analysis = analyzeVisualField(
        points,
        preset.eye,
        'SITA_STANDARD',
        preset.measuredIop,
        preset.cct,
        preset.fixationLossesPct,
        preset.falsePositivesPct,
        preset.falseNegativesPct
      );

      expect(analysis.reliability.isReliable).toBe(false);
      expect(analysis.reliability.falsePositivesPct).toBeGreaterThan(15);
      expect(analysis.reliability.reliabilityWarning).toContain('trigger-happy');
    });
  });
});
