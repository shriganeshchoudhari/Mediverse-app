/**
 * CPETMetabolicErgometryEngine.test.ts
 * 
 * Unit tests for Cardiopulmonary Exercise Testing & Metabolic Ergometry Engine
 */

import {
  calculatePredictedVO2Peak,
  calculateMVV,
  calculateBreathingReserve,
  calculatePredictedMaxHR,
  calculateVeVco2Slope,
  detectAnaerobicThreshold,
  detectRespiratoryCompensationPoint,
  classifyExerciseLimitation,
  generateSyntheticCPETData,
  CPET_PRESETS,
} from '../../.gemini/skills/CPETMetabolicErgometryEngine';

describe('CPETMetabolicErgometryEngine', () => {
  describe('Normative Prediction Equations', () => {
    it('calculates Hansen predicted VO2 peak for adult male', () => {
      const pred = calculatePredictedVO2Peak({
        age: 35,
        sex: 'M',
        heightCm: 180,
        weightKg: 75,
        fev1L: 4.2,
        restingHr: 65,
      });

      expect(pred.vo2PredictedMlMin).toBeGreaterThan(2500);
      expect(pred.vo2PredictedMlMin).toBeLessThan(3500);
      expect(pred.vo2PredictedMlKgMin).toBeGreaterThan(32);
      expect(pred.vo2PredictedMlKgMin).toBeLessThan(46);
    });

    it('calculates Hansen predicted VO2 peak for adult female', () => {
      const pred = calculatePredictedVO2Peak({
        age: 40,
        sex: 'F',
        heightCm: 165,
        weightKg: 60,
        fev1L: 3.0,
        restingHr: 70,
      });

      expect(pred.vo2PredictedMlMin).toBeGreaterThan(1500);
      expect(pred.vo2PredictedMlMin).toBeLessThan(2500);
      expect(pred.vo2PredictedMlKgMin).toBeGreaterThan(25);
    });

    it('calculates MVV and Breathing Reserve accurately', () => {
      const mvv = calculateMVV(3.5);
      expect(mvv).toBe(140); // 3.5 * 40

      const normalBr = calculateBreathingReserve(95, mvv);
      expect(normalBr).toBeCloseTo(32.1, 1);

      const exhaustedBr = calculateBreathingReserve(132, mvv);
      expect(exhaustedBr).toBeCloseTo(5.7, 1);
      expect(exhaustedBr).toBeLessThan(15);
    });

    it('calculates age-predicted maximal heart rate', () => {
      expect(calculatePredictedMaxHR(20)).toBe(200);
      expect(calculatePredictedMaxHR(50)).toBe(170);
      expect(calculatePredictedMaxHR(70)).toBe(150);
    });
  });

  describe('Thresholds & Slopes', () => {
    it('generates synthetic data and detects AT and RCP within physiological windows', () => {
      const { data, summary } = generateSyntheticCPETData('healthy-active');

      expect(data.length).toBeGreaterThan(30);
      expect(summary.atTimeMinutes).toBeGreaterThan(3.0);
      expect(summary.rcpTimeMinutes).toBeGreaterThan(summary.atTimeMinutes);

      const detectedAt = detectAnaerobicThreshold(data);
      expect(detectedAt.timeMinutes).toBeGreaterThan(0);
      expect(detectedAt.vo2MlKgMin).toBeGreaterThan(10);

      const detectedRcp = detectRespiratoryCompensationPoint(data);
      expect(detectedRcp.timeMinutes).toBeGreaterThanOrEqual(detectedAt.timeMinutes);
    });

    it('calculates linear VE/VCO2 slope', () => {
      const { data } = generateSyntheticCPETData('healthy-active');
      const slope = calculateVeVco2Slope(data, 8.0);

      expect(slope).toBeGreaterThan(20);
      expect(slope).toBeLessThan(35);
    });
  });

  describe('Diagnostic Limitation Classifier', () => {
    it('classifies normal exercise response', () => {
      const res = classifyExerciseLimitation({
        vo2PeakPercentPred: 104,
        vo2PeakMlKgMin: 42,
        rerPeak: 1.15,
        breathingReservePercent: 32,
        veVco2Slope: 26,
        hrReserveBpm: 6,
        o2PulseMorphology: 'NORMAL_RISE',
        lowestSpo2Percent: 98,
        vo2AtPercentVo2Peak: 58,
        petco2PeakMmHg: 41,
      });

      expect(res.limitationType).toBe('NORMAL');
      expect(res.limitationExplanation).toContain('Normal physiological exercise response');
    });

    it('classifies submaximal effort when RER < 1.05 and large reserves remain', () => {
      const res = classifyExerciseLimitation({
        vo2PeakPercentPred: 72,
        vo2PeakMlKgMin: 24,
        rerPeak: 0.98,
        breathingReservePercent: 45,
        veVco2Slope: 25,
        hrReserveBpm: 35,
        o2PulseMorphology: 'NORMAL_RISE',
        lowestSpo2Percent: 99,
        vo2AtPercentVo2Peak: 62,
        petco2PeakMmHg: 39,
      });

      expect(res.limitationType).toBe('SUBMAXIMAL_EFFORT');
      expect(res.limitationExplanation).toContain('submaximal volitional effort');
    });

    it('classifies ventilatory limitation when breathing reserve < 15%', () => {
      const res = classifyExerciseLimitation({
        vo2PeakPercentPred: 52,
        vo2PeakMlKgMin: 14.8,
        rerPeak: 1.08,
        breathingReservePercent: 6.2,
        veVco2Slope: 31,
        hrReserveBpm: 38,
        o2PulseMorphology: 'NORMAL_RISE',
        lowestSpo2Percent: 88,
        vo2AtPercentVo2Peak: 52,
        petco2PeakMmHg: 44,
      });

      expect(res.limitationType).toBe('VENTILATORY');
      expect(res.limitationExplanation).toContain('mechanical ventilatory limitation');
    });

    it('classifies pulmonary vascular limitation when VE/VCO2 > 40 and PETCO2 depressed', () => {
      const res = classifyExerciseLimitation({
        vo2PeakPercentPred: 58,
        vo2PeakMlKgMin: 17,
        rerPeak: 1.12,
        breathingReservePercent: 28,
        veVco2Slope: 49,
        hrReserveBpm: 12,
        o2PulseMorphology: 'DECLINE',
        lowestSpo2Percent: 92,
        vo2AtPercentVo2Peak: 45,
        petco2PeakMmHg: 26,
      });

      expect(res.limitationType).toBe('PULMONARY_VASCULAR');
      expect(res.limitationExplanation).toContain('Pulmonary Arterial Hypertension');
    });

    it('classifies mitochondrial myopathy with premature AT and high lactate generation', () => {
      const res = classifyExerciseLimitation({
        vo2PeakPercentPred: 62,
        vo2PeakMlKgMin: 19,
        rerPeak: 1.14,
        breathingReservePercent: 35,
        veVco2Slope: 33,
        hrReserveBpm: 8,
        o2PulseMorphology: 'NORMAL_RISE',
        lowestSpo2Percent: 98,
        vo2AtPercentVo2Peak: 32, // very early AT
        petco2PeakMmHg: 35,
      });

      expect(res.limitationType).toBe('METABOLIC_MYOPATHY');
      expect(res.limitationExplanation).toContain('mitochondrial cytopathy');
    });

    it('classifies cardiovascular limitation with Weber Class staging', () => {
      const res = classifyExerciseLimitation({
        vo2PeakPercentPred: 44,
        vo2PeakMlKgMin: 12.5,
        rerPeak: 1.12,
        breathingReservePercent: 38,
        veVco2Slope: 39,
        hrReserveBpm: 24,
        o2PulseMorphology: 'ISCHEMIC_PLATEAU',
        lowestSpo2Percent: 96,
        vo2AtPercentVo2Peak: 38,
        petco2PeakMmHg: 33,
      });

      expect(res.limitationType).toBe('CARDIOVASCULAR');
      expect(res.weberClass).toBe('CLASS_C');
      expect(res.limitationExplanation).toContain('Weber CLASS C');
    });
  });

  describe('Clinical Presets', () => {
    it('has all 6 evidence-based clinical presets', () => {
      expect(CPET_PRESETS).toHaveLength(6);
      const ids = CPET_PRESETS.map(p => p.id);
      expect(ids).toContain('healthy-active');
      expect(ids).toContain('hfref-weber-c');
      expect(ids).toContain('copd-ventilatory');
      expect(ids).toContain('pah-vascular');
      expect(ids).toContain('mitochondrial-myopathy');
      expect(ids).toContain('elite-athlete');
    });

    it('produces distinct physiological profiles for COPD vs Heart Failure vs Athlete', () => {
      const copd = generateSyntheticCPETData('copd-ventilatory');
      const hf = generateSyntheticCPETData('hfref-weber-c');
      const athlete = generateSyntheticCPETData('elite-athlete');

      expect(copd.summary.limitationType).toBe('VENTILATORY');
      expect(copd.summary.breathingReservePercent).toBeLessThan(15);
      expect(copd.summary.lowestSpo2Percent).toBeLessThan(90);

      expect(hf.summary.limitationType).toBe('CARDIOVASCULAR');
      expect(hf.summary.veVco2Slope).toBeGreaterThan(35);
      expect(hf.summary.o2PulseMorphology).toBe('ISCHEMIC_PLATEAU');

      expect(athlete.summary.vo2PeakMlKgMin).toBeGreaterThan(60);
      expect(athlete.summary.vo2PeakPercentPred).toBeGreaterThan(130);
      expect(athlete.summary.limitationType).toBe('NORMAL');
    });
  });
});
