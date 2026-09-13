/**
 * VentilatorWeaningEngine.test.ts
 * Unit tests for VentilatorWeaningEngine.
 */

import {
  calculateRsbi,
  calculateDiaphragmaticUltrasound,
  auditCuffLeak,
  evaluateSbtReadiness,
  WEANING_SCENARIOS,
  PatientWeaningState,
} from '../../.gemini/skills/VentilatorWeaningEngine';

describe('VentilatorWeaningEngine', () => {
  const baseState: PatientWeaningState = {
    patientAge: 55,
    daysIntubated: 4,
    currentSbtTechnique: 'low_level_psv',
    sbtDurationMinutes: 30,
    respiratoryRateBpm: 20,
    tidalVolumeMl: 500,
    initialSbtRsbi: 40,
    p01AirwayOcclusionPressureCmH2o: 1.8,
    rapidShallowBreathingPattern: false,
    diaphragmaticExcursionCm: 1.5,
    endInspiratoryThicknessMm: 3.0,
    endExpiratoryThicknessMm: 2.1,
    spo2Percent: 96,
    fio2Delivered: 0.35,
    heartRateBpm: 86,
    systolicBpMmHg: 124,
    diastolicBpMmHg: 74,
    cuffLeakVolumeMl: 220,
    baselineInspiratoryVtMl: 500,
    steroidProphylaxisActive: false,
  };

  describe('calculateRsbi (Yang-Tobin)', () => {
    it('calculates favorable RSBI correctly', () => {
      const audit = calculateRsbi(baseState);
      expect(audit.rsbiValue).toBe(40);
      expect(audit.isRsbiFavorable).toBe(true);
      expect(audit.isFatiguingOverTime).toBe(false);
    });

    it('identifies elevated RSBI and rapid shallow breathing pattern', () => {
      const scenario = WEANING_SCENARIOS.vidd_diaphragmatic_atrophy;
      const audit = calculateRsbi(scenario.initialState);

      expect(audit.rsbiValue).toBe(131);
      expect(audit.isRsbiFavorable).toBe(false);
      expect(audit.rsbiRateOfRisePercent).toBeGreaterThan(20);
      expect(audit.isFatiguingOverTime).toBe(true);
    });
  });

  describe('calculateDiaphragmaticUltrasound (TFdi & Excursion)', () => {
    it('verifies normal diaphragmatic function', () => {
      const audit = calculateDiaphragmaticUltrasound(baseState);
      // TFdi = ((3.0 - 2.1) / 2.1) * 100 = 42.8% -> 43%
      expect(audit.thickeningFractionPercent).toBe(43);
      expect(audit.isThickeningAdequate).toBe(true);
      expect(audit.isExcursionAdequate).toBe(true);
      expect(audit.hasVidd).toBe(false);
    });

    it('detects Ventilator-Induced Diaphragmatic Dysfunction (VIDD)', () => {
      const scenario = WEANING_SCENARIOS.vidd_diaphragmatic_atrophy;
      const audit = calculateDiaphragmaticUltrasound(scenario.initialState);

      expect(audit.thickeningFractionPercent).toBe(14);
      expect(audit.isThickeningAdequate).toBe(false);
      expect(audit.isExcursionAdequate).toBe(false);
      expect(audit.hasVidd).toBe(true);
      expect(audit.ultrasoundSummary).toMatch(/VIDD/i);
    });
  });

  describe('auditCuffLeak (Post-Extubation Stridor)', () => {
    it('identifies adequate cuff leak with low stridor risk', () => {
      const audit = auditCuffLeak(baseState);
      expect(audit.isLeakAdequate).toBe(true);
      expect(audit.cuffLeakPercentage).toBe(44);
      expect(audit.stridorRisk).toBe('Low (< 5%)');
    });

    it('identifies failed cuff leak and laryngeal edema hazard', () => {
      const scenario = WEANING_SCENARIOS.failed_cuff_leak_laryngeal_edema;
      const audit = auditCuffLeak(scenario.initialState);

      expect(audit.isLeakAdequate).toBe(false);
      expect(audit.cuffLeakPercentage).toBe(10);
      expect(audit.stridorRisk).toBe('High (> 35% - Laryngeal Edema)');
      expect(audit.steroidIndicationNote).toMatch(/Methylprednisolone/i);
    });
  });

  describe('evaluateSbtReadiness', () => {
    it('approves extubation when all criteria are satisfied', () => {
      const scenario = WEANING_SCENARIOS.successful_psv_wean;
      const report = evaluateSbtReadiness(scenario.initialState);

      expect(report.isSbtSuccessful).toBe(true);
      expect(report.readyForExtubation).toBe(true);
      expect(report.failureTriggers).toHaveLength(0);
      expect(report.actionableRecommendations[0]).toMatch(/MEETS ALL EXTUBATION CRITERIA/i);
    });

    it('aborts extubation for failed cuff leak without steroid pre-treatment', () => {
      const scenario = WEANING_SCENARIOS.failed_cuff_leak_laryngeal_edema;
      const report = evaluateSbtReadiness(scenario.initialState);

      expect(report.isSbtSuccessful).toBe(false);
      expect(report.readyForExtubation).toBe(false);
      expect(report.weaningFailureClassification).toBe('laryngeal_edema_failed_cuff_leak');
    });

    it('identifies cardiovascular weaning failure with flash pulmonary edema', () => {
      const scenario = WEANING_SCENARIOS.cardiovascular_weaning_failure;
      const report = evaluateSbtReadiness(scenario.initialState);

      expect(report.isSbtSuccessful).toBe(false);
      expect(report.weaningFailureClassification).toBe('cardiovascular_weaning_failure_diastolic_overload');
      expect(report.actionableRecommendations.some((r) => r.includes('Cardiac Weaning Failure'))).toBe(true);
    });
  });
});
