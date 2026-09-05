import {
  computeFetalMonitoringState,
  classifyNICHD,
  calculateBishopScore,
  generateCTGTimeSeries,
  CTG_PRESETS,
  FetalMonitoringInputParams,
} from '@/.gemini/skills/FetalMonitoringEngine';

const DEFAULT_PARAMS: FetalMonitoringInputParams = {
  baselineFhrBpm: 135,
  variability: 'MODERATE',
  decelerationType: 'NONE',
  hasAccelerations: true,
  contractionsPer10Min: 3,
  contractionPeakMmHg: 55,
  fetalScalpPh: 7.32,
  maternalPosition: 'LEFT_LATERAL',
  ivFluidsActive: false,
  maternalO2Active: false,
  oxytocinRateMilliunitsMin: 4,
  tocolysisGiven: false,
  gestationalWeeks: 39,
  bishopDilation: 4,
  bishopEffacement: 60,
  bishopStation: 0,
  bishopConsistency: 'MEDIUM',
  bishopPosition: 'MID',
};

describe('FetalMonitoringEngine', () => {
  describe('NICHD Classification Logic', () => {
    test('Category I: normal baseline, moderate variability, no decels', () => {
      const cat = classifyNICHD(135, 'MODERATE', 'NONE', true);
      expect(cat).toBe('CATEGORY_I');
    });

    test('Category I allows early decelerations', () => {
      const cat = classifyNICHD(140, 'MODERATE', 'EARLY', true);
      expect(cat).toBe('CATEGORY_I');
    });

    test('Category II: minimal variability or late decels with moderate variability', () => {
      const cat1 = classifyNICHD(140, 'MINIMAL', 'NONE', false);
      expect(cat1).toBe('CATEGORY_II');

      const cat2 = classifyNICHD(140, 'MODERATE', 'LATE', false);
      expect(cat2).toBe('CATEGORY_II');
    });

    test('Category III: absent variability + late decelerations', () => {
      const cat = classifyNICHD(130, 'ABSENT', 'LATE', false);
      expect(cat).toBe('CATEGORY_III');
    });

    test('Category III: sinusoidal pattern is always Category III regardless of variability', () => {
      const cat = classifyNICHD(130, 'MODERATE', 'SINUSOIDAL', false);
      expect(cat).toBe('CATEGORY_III');
    });

    test('Category III: absent variability + bradycardia', () => {
      const cat = classifyNICHD(100, 'ABSENT', 'NONE', false);
      expect(cat).toBe('CATEGORY_III');
    });
  });

  describe('Bishop Score Calculation', () => {
    test('unfavorable cervix scores <6', () => {
      const score = calculateBishopScore({
        dilationCm: 0,
        effacementPct: 20,
        station: -3,
        consistency: 'FIRM',
        position: 'POSTERIOR',
      });
      expect(score).toBe(0);
    });

    test('favorable cervix for induction scores >=8', () => {
      const score = calculateBishopScore({
        dilationCm: 5,
        effacementPct: 80,
        station: 1,
        consistency: 'SOFT',
        position: 'ANTERIOR',
      });
      // 3 + 3 + 3 + 2 + 2 = 13
      expect(score).toBe(13);
      expect(score).toBeGreaterThanOrEqual(8);
    });

    test('intermediate cervix scores correctly', () => {
      const score = calculateBishopScore({
        dilationCm: 2, // 1
        effacementPct: 50, // 1
        station: -1, // 2
        consistency: 'MEDIUM', // 1
        position: 'MID', // 1
      });
      expect(score).toBe(6);
    });
  });

  describe('Biophysical State Computation', () => {
    test('computes Montevideo Units (MVU) correctly', () => {
      // MVU = contractions in 10 min * (peak - resting tone 12)
      // 4 contractions * (62 - 12) = 200 MVU
      const state = computeFetalMonitoringState({
        ...DEFAULT_PARAMS,
        contractionsPer10Min: 4,
        contractionPeakMmHg: 62,
      });
      expect(state.montevideoUnitsMVU).toBe(200);
      expect(state.uterineTachysystole).toBe(false);
    });

    test('detects uterine tachysystole when contractions > 5 in 10 minutes', () => {
      const state = computeFetalMonitoringState({
        ...DEFAULT_PARAMS,
        contractionsPer10Min: 6,
      });
      expect(state.uterineTachysystole).toBe(true);
      expect(state.activeAlarms).toContain('UTERINE_TACHYSYSTOLE');
    });

    test('Category III emergency alarm is raised for severe tracing', () => {
      const state = computeFetalMonitoringState({
        ...DEFAULT_PARAMS,
        variability: 'ABSENT',
        decelerationType: 'LATE',
      });
      expect(state.nichdCategory).toBe('CATEGORY_III');
      expect(state.activeAlarms).toContain('CATEGORY_III_EMERGENCY');
    });
  });

  describe('Time Series Waveform Synthesis', () => {
    test('generates valid 10-minute CTG points array', () => {
      const pts = generateCTGTimeSeries(140, 'MODERATE', 'NONE', 3, 50, true);
      expect(pts.length).toBeGreaterThan(100);
      expect(pts[0].timeSeconds).toBe(0);
      expect(pts[pts.length - 1].timeSeconds).toBe(600);
      pts.forEach(p => {
        expect(p.fhrBpm).toBeGreaterThanOrEqual(60);
        expect(p.fhrBpm).toBeLessThanOrEqual(210);
        expect(p.uterineActivityMmHg).toBeGreaterThanOrEqual(10);
      });
    });
  });

  describe('Preset Catalog Integrity', () => {
    test('all 6 presets have required clinical metadata', () => {
      expect(Object.keys(CTG_PRESETS)).toHaveLength(6);
      Object.values(CTG_PRESETS).forEach(p => {
        expect(p.title).toBeTruthy();
        expect(p.description).toBeTruthy();
        expect(p.clinicalPearls).toBeTruthy();
        expect(p.category).toBeTruthy();
      });
    });
  });
});
