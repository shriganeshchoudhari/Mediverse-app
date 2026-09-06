import {
  calculateBwpsScore,
  calculateMyxedemaScore,
  evaluateThyroidStormPharmacotherapy,
  THYROID_CRISIS_PRESETS,
} from '../../.gemini/skills/ThyroidCrisisEngine';

describe('ThyroidCrisisEngine', () => {
  describe('Burch-Wartofsky Point Scale (BWPS) Calculation', () => {
    it('scores full thyroid storm >= 45 points on high fever, delirium, tachy, AF', () => {
      const result = calculateBwpsScore({
        temperatureFahrenheit: 104.2, // 30 pts
        cnsStatus: 'MODERATE_DELIRIUM_PSYCHOSIS', // 20 pts
        giHepaticStatus: 'MODERATE_DIARRHEA_NAUSEA_PAIN', // 10 pts
        heartRateBpm: 145, // 25 pts
        heartFailureStatus: 'NONE', // 0 pts
        atrialFibrillationPresent: true, // 10 pts
        precipitatingHistoryPresent: true, // 10 pts
      });

      expect(result.totalPoints).toBe(105);
      expect(result.interpretation).toBe('HIGHLY_SUGGESTIVE_STORM');
      expect(result.clinicalSummary).toContain('Highly suggestive of Thyroid Storm');
    });

    it('identifies impending storm (25-44 points)', () => {
      const result = calculateBwpsScore({
        temperatureFahrenheit: 100.5, // 10 pts
        cnsStatus: 'MILD_AGITATION', // 10 pts
        giHepaticStatus: 'NONE', // 0 pts
        heartRateBpm: 115, // 10 pts
        heartFailureStatus: 'NONE',
        atrialFibrillationPresent: false,
        precipitatingHistoryPresent: true, // 10 pts
      });

      expect(result.totalPoints).toBe(40);
      expect(result.interpretation).toBe('IMPENDING_STORM');
    });

    it('identifies uncomplicated thyrotoxicosis as unlikely storm (<25 points)', () => {
      const result = calculateBwpsScore({
        temperatureFahrenheit: 99.2, // 5 pts
        cnsStatus: 'MILD_AGITATION', // 10 pts
        giHepaticStatus: 'NONE',
        heartRateBpm: 98, // 5 pts
        heartFailureStatus: 'NONE',
        atrialFibrillationPresent: false,
        precipitatingHistoryPresent: false,
      });

      expect(result.totalPoints).toBe(20);
      expect(result.interpretation).toBe('UNLIKELY');
    });
  });

  describe('Popoveniuc Myxedema Coma Scoring', () => {
    it('detects severe myxedema coma with score >= 60', () => {
      const result = calculateMyxedemaScore({
        temperatureCelsius: 32.5, // 20 pts
        cnsDysfunction: 'COMA', // 35 pts
        gastrointestinalDysfunction: 'ILEUS_MEGACOLON', // 20 pts
        heartRateBpm: 38, // 15 pts
        meanArterialPressureMmHg: 54, // 15 pts
        serumSodiumMeqL: 116, // 15 pts
        serumGlucoseMgDl: 48, // 15 pts
        hypoxemiaOrHypercapnia: true, // 15 pts
        precipitatingEventIdentified: true, // 10 pts
      });

      expect(result.totalPoints).toBeGreaterThanOrEqual(60);
      expect(result.interpretation).toBe('HIGHLY_SUGGESTIVE_MYXEDEMA');
    });

    it('classifies normal / mild hypothyroidism as unlikely myxedema coma', () => {
      const result = calculateMyxedemaScore({
        temperatureCelsius: 36.6,
        cnsDysfunction: 'NORMAL',
        gastrointestinalDysfunction: 'NORMAL',
        heartRateBpm: 68,
        meanArterialPressureMmHg: 85,
        serumSodiumMeqL: 140,
        serumGlucoseMgDl: 95,
        hypoxemiaOrHypercapnia: false,
        precipitatingEventIdentified: false,
      });

      expect(result.totalPoints).toBe(0);
      expect(result.interpretation).toBe('UNLIKELY');
    });
  });

  describe('Multimodal Pharmacotherapy Sequence Timing Validation', () => {
    it('catches dangerous violation when iodine is given before or without thionamide', () => {
      const evalResult = evaluateThyroidStormPharmacotherapy([
        { drug: 'SSKI_LUGOLS', minuteAdministered: 0 },
      ]);

      expect(evalResult.isIodineTimingSafe).toBe(false);
      expect(evalResult.warnings.some(w => w.includes('Jod-Basedow'))).toBe(true);
    });

    it('catches violation when iodine is given less than 60 minutes after thionamide', () => {
      const evalResult = evaluateThyroidStormPharmacotherapy([
        { drug: 'PTU', minuteAdministered: 0 },
        { drug: 'SSKI_LUGOLS', minuteAdministered: 25 },
      ]);

      expect(evalResult.isIodineTimingSafe).toBe(false);
      expect(evalResult.warnings.some(w => w.includes('TIMING VIOLATION'))).toBe(true);
    });

    it('approves complete multimodal regimen when iodine is safely delayed by >= 60 minutes', () => {
      const evalResult = evaluateThyroidStormPharmacotherapy([
        { drug: 'PTU', minuteAdministered: 0 },
        { drug: 'PROPRANOLOL', minuteAdministered: 10 },
        { drug: 'HYDROCORTISONE', minuteAdministered: 15 },
        { drug: 'SSKI_LUGOLS', minuteAdministered: 65 },
        { drug: 'CHOLESTYRAMINE', minuteAdministered: 90 },
      ]);

      expect(evalResult.isIodineTimingSafe).toBe(true);
      expect(evalResult.allEssentialStepsCompleted).toBe(true);
      expect(evalResult.warnings.length).toBe(0);
    });
  });

  describe('Clinical Presets', () => {
    it('evaluates all 8 presets without runtime error', () => {
      expect(THYROID_CRISIS_PRESETS.length).toBe(8);

      const fulminant = THYROID_CRISIS_PRESETS.find(p => p.id === 'fulminant-thyroid-storm')!;
      const bwpsFulminant = calculateBwpsScore(fulminant.bwpsParams);
      expect(bwpsFulminant.totalPoints).toBeGreaterThanOrEqual(45);

      const myxedema = THYROID_CRISIS_PRESETS.find(p => p.id === 'classical-myxedema-coma')!;
      const myxedemaScore = calculateMyxedemaScore(myxedema.myxedemaParams);
      expect(myxedemaScore.totalPoints).toBeGreaterThanOrEqual(60);
    });
  });
});
