/**
 * SubarachnoidHemorrhageEngine.test.ts
 * Unit tests for SubarachnoidHemorrhageEngine.
 */

import {
  calculateTcdVasospasm,
  evaluateDciRisk,
  auditEvdSafety,
  SAH_SCENARIOS,
  PatientSahState,
} from '../../.gemini/skills/SubarachnoidHemorrhageEngine';

describe('SubarachnoidHemorrhageEngine', () => {
  const baseState: PatientSahState = {
    patientAge: 52,
    dayPostBleed: 6,
    huntHessGrade: 2,
    gcsScore: 14,
    modifiedFisherGrade: 3,
    aneurysmStatus: 'coiled',
    systolicBpMmHg: 130,
    diastolicBpMmHg: 70,
    meanArterialPressureMmHg: 90,
    centralVenousPressureMmHg: 7,
    newFocalDeficitPresent: false,
    mcaMeanFlowVelocityCmS: 105,
    eicaMeanFlowVelocityCmS: 40,
    evdPopOffHeightCmH2o: 10,
    intracranialPressureMmHg: 12,
    csfDrainageRateMlHr: 12,
    serumSodiumMeqL: 138,
    oralNimodipineActive: true,
    inducedHypertensionActive: false,
  };

  describe('calculateTcdVasospasm (Lindegaard Ratio)', () => {
    it('identifies Normal TCD velocities', () => {
      const audit = calculateTcdVasospasm(baseState);
      expect(audit.vasospasmSeverity).toBe('Normal');
      expect(audit.lindegaardRatio).toBeCloseTo(2.62, 1);
      expect(audit.isAngiographicSpasmLikely).toBe(false);
    });

    it('identifies Hyperemia (elevated MCA but low Lindegaard Ratio)', () => {
      const scenario = SAH_SCENARIOS.hyperemia_pseudo_spasm;
      const audit = calculateTcdVasospasm(scenario.initialState);

      expect(audit.vasospasmSeverity).toBe('Hyperemia (Non-Spasm)');
      expect(audit.lindegaardRatio).toBeLessThan(3.0);
      expect(audit.isAngiographicSpasmLikely).toBe(false);
      expect(audit.findings[0]).toMatch(/HYPEREMIA/i);
    });

    it('identifies Severe Vasospasm (MCA >= 200 and LR >= 6.0)', () => {
      const scenario = SAH_SCENARIOS.peak_vasospasm_dci;
      const audit = calculateTcdVasospasm(scenario.initialState);

      expect(audit.vasospasmSeverity).toBe('Severe Vasospasm');
      expect(audit.lindegaardRatio).toBeGreaterThanOrEqual(6.0);
      expect(audit.isAngiographicSpasmLikely).toBe(true);
      expect(audit.recommendation).toMatch(/endovascular rescue/i);
    });
  });

  describe('evaluateDciRisk & Modified Fisher Scale', () => {
    it('calculates peak vasospasm window and DCI trigger on new deficit', () => {
      const scenario = SAH_SCENARIOS.peak_vasospasm_dci;
      const report = evaluateDciRisk(scenario.initialState);

      expect(report.isPeakVasospasmWindow).toBe(true);
      expect(report.dciSuspected).toBe(true);
      expect(report.overallDciRiskPercent).toBeGreaterThan(45);
      expect(report.managementDirectives.some((d) => d.includes('therapeutic hypertension'))).toBe(true);
    });

    it('contraindicates induced hypertension in unsecured aneurysm', () => {
      const scenario = SAH_SCENARIOS.unsecured_aneurysm_early;
      const report = evaluateDciRisk({
        ...scenario.initialState,
        newFocalDeficitPresent: true,
      });

      expect(report.managementDirectives.some((d) => d.includes('Aneurysm is UNSECURED'))).toBe(true);
    });
  });

  describe('auditEvdSafety', () => {
    it('verifies safe normal EVD parameters', () => {
      const audit = auditEvdSafety(baseState);
      expect(audit.isOverdraining).toBe(false);
      expect(audit.isUnderdrainingOrClogged).toBe(false);
      expect(audit.cerebralPerfusionPressureMmHg).toBe(78);
      expect(audit.safetyAlerts).toHaveLength(0);
    });

    it('detects critical overdrainage', () => {
      const state = { ...baseState, csfDrainageRateMlHr: 32, evdPopOffHeightCmH2o: 3 };
      const audit = auditEvdSafety(state);

      expect(audit.isOverdraining).toBe(true);
      expect(audit.safetyAlerts.some((a) => a.includes('OVERDRAINAGE'))).toBe(true);
    });

    it('detects clogged or underdraining EVD', () => {
      const state = { ...baseState, csfDrainageRateMlHr: 0, intracranialPressureMmHg: 26 };
      const audit = auditEvdSafety(state);

      expect(audit.isUnderdrainingOrClogged).toBe(true);
      expect(audit.safetyAlerts.some((a) => a.includes('CLOGGED'))).toBe(true);
    });
  });
});
