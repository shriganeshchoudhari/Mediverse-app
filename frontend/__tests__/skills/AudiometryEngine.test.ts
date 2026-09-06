import {
  computeAudiometryState,
  calculatePta4,
  calculateMaxAbg,
  classifyHearingLossGrade,
  classifyHearingLossType,
  classifyJergerTympanogram,
  calculateRolloverIndex,
  generateTympanogramCurve,
  AUDIOMETRY_PRESETS,
  AudiometryInputParams,
} from '@/.gemini/skills/AudiometryEngine';

describe('AudiometryEngine', () => {
  describe('Mathematical Calculations & Classifications', () => {
    test('calculatePta4 averages thresholds across 500, 1000, 2000, 4000 Hz correctly', () => {
      const thresholds = { 125: 10, 250: 15, 500: 20, 1000: 30, 2000: 40, 4000: 50, 8000: 60 };
      // (20 + 30 + 40 + 50) / 4 = 35.0 dB
      expect(calculatePta4(thresholds)).toBe(35.0);
    });

    test('calculateMaxAbg detects maximum air-bone gap', () => {
      const ac = { 250: 40, 500: 45, 1000: 35, 2000: 30, 4000: 25 };
      const bc = { 250: 10, 500: 10, 1000: 15, 2000: 10, 4000: 10 };
      // Gaps: 30, 35, 20, 20, 15 -> max = 35
      expect(calculateMaxAbg(ac, bc)).toBe(35);
    });

    test('classifyHearingLossGrade respects WHO hearing grades', () => {
      expect(classifyHearingLossGrade(15)).toBe('NORMAL');
      expect(classifyHearingLossGrade(30)).toBe('MILD');
      expect(classifyHearingLossGrade(50)).toBe('MODERATE');
      expect(classifyHearingLossGrade(65)).toBe('MODERATELY_SEVERE');
      expect(classifyHearingLossGrade(85)).toBe('SEVERE');
      expect(classifyHearingLossGrade(100)).toBe('PROFOUND');
    });

    test('classifyHearingLossType correctly distinguishes conductive, sensorineural, and mixed loss', () => {
      // Normal
      expect(classifyHearingLossType(15, 10, 5)).toBe('NORMAL');
      // Conductive: BC normal (<=20), ABG >= 15
      expect(classifyHearingLossType(45, 15, 30)).toBe('CONDUCTIVE');
      // Sensorineural: ABG < 15, AC > 20
      expect(classifyHearingLossType(55, 50, 5)).toBe('SENSORINEURAL');
      // Mixed: BC > 20 and ABG >= 15
      expect(classifyHearingLossType(65, 35, 30)).toBe('MIXED');
    });

    test('classifyJergerTympanogram classifies all 6 middle ear compliance patterns', () => {
      // Type A: normal compliance and normal pressure
      expect(classifyJergerTympanogram({ earCanalVolumeMl: 1.2, peakComplianceMl: 0.8, middleEarPressureDaPa: 0, tympanometricWidthDaPa: 80 })).toBe('TYPE_A');
      // Type As: shallow compliance (<0.3)
      expect(classifyJergerTympanogram({ earCanalVolumeMl: 1.1, peakComplianceMl: 0.18, middleEarPressureDaPa: -10, tympanometricWidthDaPa: 120 })).toBe('TYPE_AS');
      // Type Ad: deep/hypermobile compliance (>1.6)
      expect(classifyJergerTympanogram({ earCanalVolumeMl: 1.4, peakComplianceMl: 2.2, middleEarPressureDaPa: 10, tympanometricWidthDaPa: 70 })).toBe('TYPE_AD');
      // Type C: negative pressure (< -100 daPa)
      expect(classifyJergerTympanogram({ earCanalVolumeMl: 1.1, peakComplianceMl: 0.7, middleEarPressureDaPa: -220, tympanometricWidthDaPa: 130 })).toBe('TYPE_C');
      // Type B - Effusion: flat trace, normal ECV (1.0 mL)
      expect(classifyJergerTympanogram({ earCanalVolumeMl: 1.0, peakComplianceMl: 0.05, middleEarPressureDaPa: -300, tympanometricWidthDaPa: 200 })).toBe('TYPE_B_EFFUSION');
      // Type B - Perforation: flat trace, large ECV (>2.2 mL)
      expect(classifyJergerTympanogram({ earCanalVolumeMl: 3.5, peakComplianceMl: 0.05, middleEarPressureDaPa: 0, tympanometricWidthDaPa: 200 })).toBe('TYPE_B_PERFORATION');
      // Type B - Occlusion: flat trace, low ECV (<0.5 mL)
      expect(classifyJergerTympanogram({ earCanalVolumeMl: 0.3, peakComplianceMl: 0.05, middleEarPressureDaPa: 0, tympanometricWidthDaPa: 200 })).toBe('TYPE_B_OCCLUSION');
    });

    test('calculateRolloverIndex calculates retrocochlear speech rollover ratio', () => {
      // (50 - 20) / 50 = 0.60
      expect(calculateRolloverIndex(50, 20)).toBe(0.60);
      // No rollover
      expect(calculateRolloverIndex(95, 95)).toBe(0);
    });

    test('generateTympanogramCurve produces points across -400 to +200 daPa', () => {
      const points = generateTympanogramCurve({ earCanalVolumeMl: 1.2, peakComplianceMl: 0.8, middleEarPressureDaPa: 0, tympanometricWidthDaPa: 80 });
      expect(points.length).toBeGreaterThan(20);
      expect(points[0].pressureDaPa).toBe(-400);
      expect(points[points.length - 1].pressureDaPa).toBe(200);
      // Peak compliance should be near middleEarPressure (0 daPa)
      const centerPoint = points.find(p => p.pressureDaPa === 0);
      expect(centerPoint?.complianceMl).toBeGreaterThan(0.7);
    });
  });

  describe('Clinical Presets & Scenario Engine', () => {
    test('NORMAL_BILATERAL preset exhibits optimal bilateral hearing and Type A curves', () => {
      const state = computeAudiometryState(AUDIOMETRY_PRESETS.NORMAL_BILATERAL.initialState);
      expect(state.rightEarAnalysis.hearingLossGrade).toBe('NORMAL');
      expect(state.leftEarAnalysis.hearingLossGrade).toBe('NORMAL');
      expect(state.rightEarAnalysis.jergerType).toBe('TYPE_A');
      expect(state.leftEarAnalysis.jergerType).toBe('TYPE_A');
      expect(state.activeAlarms).toContain('OPTIMAL_HEARING');
      expect(state.tuningForkCorrelation.rinneRight).toBe('POSITIVE');
      expect(state.tuningForkCorrelation.weberLateralization).toBe('MIDLINE');
    });

    test('OTOSCLEROSIS_CARHART preset exhibits right conductive loss, Carhart notch, and Type As', () => {
      const state = computeAudiometryState(AUDIOMETRY_PRESETS.OTOSCLEROSIS_CARHART.initialState);
      expect(state.rightEarAnalysis.hearingLossType).toBe('CONDUCTIVE');
      expect(state.rightEarAnalysis.jergerType).toBe('TYPE_AS');
      expect(state.rightEarAnalysis.maxAirBoneGapDb).toBeGreaterThanOrEqual(15);
      expect(state.activeAlarms).toContain('CARHART_NOTCH_OTOSCLEROSIS');
      expect(state.tuningForkCorrelation.rinneRight).toBe('NEGATIVE');
      expect(state.tuningForkCorrelation.weberLateralization).toBe('RIGHT');
      expect(state.clinicalDiagnosis).toContain('Stapedial Otosclerosis');
    });

    test('OTITIS_MEDIA_EFFUSION_GLUE_EAR preset triggers GLUE_EAR_EFFUSION alarm and Type B effusion', () => {
      const state = computeAudiometryState(AUDIOMETRY_PRESETS.OTITIS_MEDIA_EFFUSION_GLUE_EAR.initialState);
      expect(state.rightEarAnalysis.jergerType).toBe('TYPE_B_EFFUSION');
      expect(state.leftEarAnalysis.jergerType).toBe('TYPE_B_EFFUSION');
      expect(state.activeAlarms).toContain('GLUE_EAR_EFFUSION');
      expect(state.otologicRecommendation).toContain('Tympanostomy Grommet Tube');
    });

    test('TYMPANIC_MEMBRANE_PERFORATION preset triggers TYMPANIC_PERFORATION_RISK with high ECV', () => {
      const state = computeAudiometryState(AUDIOMETRY_PRESETS.TYMPANIC_MEMBRANE_PERFORATION.initialState);
      expect(state.leftEarAnalysis.jergerType).toBe('TYPE_B_PERFORATION');
      expect(state.activeAlarms).toContain('TYMPANIC_PERFORATION_RISK');
      expect(state.otologicRecommendation).toContain('dry ear precautions');
    });

    test('PRESBYCUSIS_AGE_RELATED preset shows symmetrical sloping SNHL', () => {
      const state = computeAudiometryState(AUDIOMETRY_PRESETS.PRESBYCUSIS_AGE_RELATED.initialState);
      expect(state.rightEarAnalysis.hearingLossType).toBe('SENSORINEURAL');
      expect(state.leftEarAnalysis.hearingLossType).toBe('SENSORINEURAL');
      expect(state.rightEarAnalysis.jergerType).toBe('TYPE_A');
      expect(state.isAsymmetricSnHl).toBe(false);
      expect(state.clinicalDiagnosis).toContain('Presbycusis');
    });

    test('NOISE_INDUCED_HEARING_LOSS preset triggers ACOUSTIC_TRAUMA_4KHZ_NOTCH alarm', () => {
      const state = computeAudiometryState(AUDIOMETRY_PRESETS.NOISE_INDUCED_HEARING_LOSS.initialState);
      expect(state.activeAlarms).toContain('ACOUSTIC_TRAUMA_4KHZ_NOTCH');
      expect(state.clinicalDiagnosis).toContain('Noise-Induced Hearing Loss');
    });

    test('VESTIBULAR_SCHWANNOMA_RETROCOCHLEAR triggers ASYMMETRIC_SNHL_RETROCOCHLEAR_ALERT with severe rollover', () => {
      const state = computeAudiometryState(AUDIOMETRY_PRESETS.VESTIBULAR_SCHWANNOMA_RETROCOCHLEAR.initialState);
      expect(state.isAsymmetricSnHl).toBe(true);
      expect(state.leftEarAnalysis.rolloverIndex).toBeGreaterThan(0.45);
      expect(state.activeAlarms).toContain('ASYMMETRIC_SNHL_RETROCOCHLEAR_ALERT');
      expect(state.clinicalDiagnosis).toContain('Vestibular Schwannoma');
      expect(state.otologicRecommendation).toContain('MRI');
    });

    test('EUSTACHIAN_TUBE_DYSFUNCTION preset classifies right ear as Type C', () => {
      const state = computeAudiometryState(AUDIOMETRY_PRESETS.EUSTACHIAN_TUBE_DYSFUNCTION.initialState);
      expect(state.rightEarAnalysis.jergerType).toBe('TYPE_C');
      expect(state.clinicalDiagnosis).toContain('Eustachian Tube Dysfunction');
    });
  });
});
