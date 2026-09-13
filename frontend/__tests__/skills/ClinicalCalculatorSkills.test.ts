import { ClinicalCalculators } from '../../.gemini/skills/ClinicalCalculatorSkills';

describe('ClinicalCalculatorSkills Suite', () => {
  describe('calculateGcs', () => {
    it('correctly calculates severe GCS <= 8', () => {
      const result = ClinicalCalculators.calculateGcs(1, 2, 3);
      expect(result.totalScore).toBe(6);
      expect(result.category).toBe('SEVERE');
      expect(result.interpretation).toContain('GCS <= 8');
    });

    it('correctly calculates moderate GCS (9-12)', () => {
      const result = ClinicalCalculators.calculateGcs(3, 3, 4);
      expect(result.totalScore).toBe(10);
      expect(result.category).toBe('MODERATE');
      expect(result.interpretation).toContain('Moderate head injury');
    });

    it('correctly calculates mild GCS (13-15)', () => {
      const result = ClinicalCalculators.calculateGcs(4, 5, 6);
      expect(result.totalScore).toBe(15);
      expect(result.category).toBe('MILD');
    });
  });

  describe('calculateParkland', () => {
    it('computes 24h total and 8h/16h partition accurately', () => {
      const result = ClinicalCalculators.calculateParkland(70, 30);
      expect(result.totalFluidMl24h).toBe(8400);
      expect(result.first8HoursMl).toBe(4200);
      expect(result.next16HoursMl).toBe(4200);
      expect(result.hourlyRateFirst8h).toBe(Math.round(4200 / 8));
      expect(result.hourlyRateNext16h).toBe(Math.round(4200 / 16));
    });
  });

  describe('calculateCockcroftGault', () => {
    it('calculates CrCl for male patient', () => {
      const result = ClinicalCalculators.calculateCockcroftGault(50, 72, 1.0, false);
      expect(result.crClMlMin).toBe(90);
      expect(result.dosageAdjustmentCategory).toBe('NORMAL');
    });

    it('applies 0.85 multiplier for female patient', () => {
      const result = ClinicalCalculators.calculateCockcroftGault(50, 72, 1.0, true);
      expect(result.crClMlMin).toBe(76.5);
      expect(result.dosageAdjustmentCategory).toBe('MILD_IMPAIRMENT');
    });

    it('detects severe impairment when CrCl < 30', () => {
      const result = ClinicalCalculators.calculateCockcroftGault(80, 50, 2.5, false);
      expect(result.crClMlMin).toBeLessThan(30);
      expect(result.dosageAdjustmentCategory).toBe('SEVERE_IMPAIRMENT');
    });

    it('handles zero or negative serum creatinine safely', () => {
      const result = ClinicalCalculators.calculateCockcroftGault(50, 70, 0, false);
      expect(result.crClMlMin).toBe(0);
      expect(result.dosageAdjustmentCategory).toBe('SEVERE_IMPAIRMENT');
    });
  });

  describe('calculateCurb65', () => {
    it('classifies score 0-1 as low risk', () => {
      const result = ClinicalCalculators.calculateCurb65(false, false, false, false, false);
      expect(result.score).toBe(0);
      expect(result.riskTier).toBe('LOW');
      expect(result.thirtyDayMortalityPercent).toBe(1.5);
    });

    it('classifies score 2 as intermediate risk', () => {
      const result = ClinicalCalculators.calculateCurb65(true, true, false, false, false);
      expect(result.score).toBe(2);
      expect(result.riskTier).toBe('INTERMEDIATE');
      expect(result.thirtyDayMortalityPercent).toBe(9.2);
    });

    it('classifies score >= 3 as high risk', () => {
      const result = ClinicalCalculators.calculateCurb65(true, true, true, true, true);
      expect(result.score).toBe(5);
      expect(result.riskTier).toBe('HIGH');
      expect(result.thirtyDayMortalityPercent).toBe(22.0);
    });
  });

  describe('calculatePediatricDose', () => {
    it('calculates weight-based dosage and liquid volume', () => {
      const result = ClinicalCalculators.calculatePediatricDose(10, 30, 3, 50, 500);
      expect(result.totalDailyDoseMg).toBe(300);
      expect(result.dosePerAdministrationMg).toBe(100);
      expect(result.liquidVolumeMlPerDose).toBe(2);
      expect(result.warningAlert).toBeUndefined();
    });

    it('triggers warning and caps dose when exceeding adult maximum', () => {
      const result = ClinicalCalculators.calculatePediatricDose(80, 50, 2, 100, 1000);
      expect(result.dosePerAdministrationMg).toBe(1000);
      expect(result.warningAlert).toBeDefined();
      expect(result.warningAlert).toContain('exceeds maximum adult single dose');
    });
  });
});
