/**
 * HyperkalemiaShiftEngine.test.ts
 * Unit tests for HyperkalemiaShiftEngine.
 */

import {
  calculateMembranePotential,
  evaluateEkgMorphology,
  calculateShiftKinetics,
  calculateEliminationKinetics,
  HYPERKALEMIA_SCENARIOS,
} from '../../.gemini/skills/HyperkalemiaShiftEngine';

describe('HyperkalemiaShiftEngine', () => {
  describe('calculateMembranePotential', () => {
    it('models resting membrane depolarization in severe hyperkalemia', () => {
      const uncalcifiedState = {
        formulation: 'none' as const,
        ampulesGiven: 0,
        minutesAgo: 0,
      };
      const normalK = calculateMembranePotential(4.0, uncalcifiedState);
      const severeK = calculateMembranePotential(8.0, uncalcifiedState);

      // Resting membrane potential becomes less negative (e.g. shifts from -95 to -76 mV)
      expect(severeK.restingMembranePotentialMv).toBeGreaterThan(normalK.restingMembranePotentialMv);
      expect(severeK.relativeNavAvailabilityPercent).toBeLessThan(normalK.relativeNavAvailabilityPercent);
      expect(severeK.membraneExcitabilityStatus).toMatch(/Severe Depolarization/i);
    });

    it('demonstrates calcium chloride vs gluconate stoichiometry and membrane stabilization', () => {
      const chlorideState = {
        formulation: 'calcium_chloride_10' as const,
        ampulesGiven: 1,
        minutesAgo: 10,
      };
      const gluconateState = {
        formulation: 'calcium_gluconate_10' as const,
        ampulesGiven: 1,
        minutesAgo: 10,
      };

      const chlorideReport = calculateMembranePotential(8.0, chlorideState);
      const gluconateReport = calculateMembranePotential(8.0, gluconateState);

      expect(chlorideReport.elementalCalciumDeliveredMg).toBe(270);
      expect(gluconateReport.elementalCalciumDeliveredMg).toBe(90);
      expect(chlorideReport.isMembraneStabilizedByCalcium).toBe(true);
      expect(gluconateReport.isMembraneStabilizedByCalcium).toBe(true);
      expect(chlorideReport.relativeNavAvailabilityPercent).toBeGreaterThan(
        calculateMembranePotential(8.0, { formulation: 'none', ampulesGiven: 0, minutesAgo: 0 }).relativeNavAvailabilityPercent
      );
    });
  });

  describe('evaluateEkgMorphology', () => {
    it('identifies Grade I peaked T-waves at mild-to-moderate hyperkalemia (5.5 - 6.5 mEq/L)', () => {
      const ekg = evaluateEkgMorphology(6.0, false);
      expect(ekg.ekgSeverityGrade).toBe('Grade I (Peaked T)');
      expect(ekg.tWaveMorphology).toBe('Peaked & Narrow-Based (Tented)');
      expect(ekg.pWaveStatus).toBe('Normal Prominence');
    });

    it('identifies Grade III QRS widening and loss of P waves at K = 8.0 mEq/L', () => {
      const ekg = evaluateEkgMorphology(8.0, false);
      expect(ekg.ekgSeverityGrade).toBe('Grade III (Wide QRS)');
      expect(ekg.qrsDurationMs).toBeGreaterThanOrEqual(120);
      expect(ekg.pWaveStatus).toMatch(/Absent/i);
    });

    it('identifies Grade IV sine-wave pre-arrest pattern at K = 9.0 mEq/L', () => {
      const ekg = evaluateEkgMorphology(9.0, false);
      expect(ekg.ekgSeverityGrade).toBe('Grade IV (Sine Wave / Cardiac Arrest)');
      expect(ekg.tWaveMorphology).toBe('Merged (Sine Wave)');
      expect(ekg.sineWaveRiskPercent).toBeGreaterThanOrEqual(90);
    });

    it('mitigates perceived conduction delays when membrane is calcium-stabilized', () => {
      const unstabilized = evaluateEkgMorphology(7.5, false);
      const stabilized = evaluateEkgMorphology(7.5, true);

      expect(stabilized.qrsDurationMs).toBeLessThan(unstabilized.qrsDurationMs);
    });
  });

  describe('calculateShiftKinetics', () => {
    it('calculates regular insulin and albuterol shift synergy', () => {
      const state = {
        ...HYPERKALEMIA_SCENARIOS.crush_injury_rhabdo.initialState,
        shiftTherapiesGiven: {
          insulinRegularUnits: 10,
          dextroseGrams: 50,
          albuterolNebulizedMg: 20,
          sodiumBicarbonateMeq: 0,
        },
      };

      const shift = calculateShiftKinetics(state);
      expect(shift.insulinShiftEffectMeqL).toBeCloseTo(0.8, 1);
      expect(shift.albuterolShiftEffectMeqL).toBeGreaterThan(0.5);
      expect(shift.predictedPotassiumDropMeqL).toBeGreaterThan(1.2);
    });

    it('blunts albuterol response in patients taking beta-blockers', () => {
      const stateOnBb = {
        ...HYPERKALEMIA_SCENARIOS.missed_dialysis_sine_wave.initialState,
        onBetaBlocker: true,
        shiftTherapiesGiven: {
          insulinRegularUnits: 0,
          dextroseGrams: 0,
          albuterolNebulizedMg: 20,
          sodiumBicarbonateMeq: 0,
        },
      };

      const shift = calculateShiftKinetics(stateOnBb);
      expect(shift.albuterolResistanceAlert).toBeDefined();
      expect(shift.albuterolShiftEffectMeqL).toBeLessThan(0.3);
    });

    it('detects bicarbonate futility in non-acidotic patients', () => {
      const nonAcidotic = {
        ...HYPERKALEMIA_SCENARIOS.iatrogenic_postop_futility.initialState,
        shiftTherapiesGiven: {
          insulinRegularUnits: 0,
          dextroseGrams: 0,
          albuterolNebulizedMg: 0,
          sodiumBicarbonateMeq: 100,
        },
      };

      const shift = calculateShiftKinetics(nonAcidotic);
      expect(shift.bicarbonateShiftEffectMeqL).toBe(0);
      expect(shift.bicarbonateFutilityAlert).toMatch(/Clinical Futility Warning/i);
    });

    it('flags high hypoglycemia risk in patient with eGFR < 30 and baseline glucose < 120', () => {
      const riskyPatient = {
        ...HYPERKALEMIA_SCENARIOS.ckd_spironolactone_hypoglycemia_risk.initialState,
        shiftTherapiesGiven: {
          insulinRegularUnits: 10,
          dextroseGrams: 25,
          albuterolNebulizedMg: 0,
          sodiumBicarbonateMeq: 0,
        },
      };

      const shift = calculateShiftKinetics(riskyPatient);
      expect(shift.hypoglycemiaRiskLevel).toMatch(/Severe/i);
    });
  });

  describe('calculateEliminationKinetics', () => {
    it('models robust clearance during active hemodialysis', () => {
      const hdState = {
        ...HYPERKALEMIA_SCENARIOS.missed_dialysis_sine_wave.initialState,
        eliminationActive: {
          furosemideMg: 0,
          binder: 'none' as const,
          hemodialysisActive: true,
        },
      };

      const elim = calculateEliminationKinetics(hdState);
      expect(elim.hourlyRemovalRateMeqHr).toBeGreaterThanOrEqual(30);
      expect(elim.primaryModality).toMatch(/Emergency Intermittent Hemodialysis/i);
    });

    it('warns when anuric ESRD patient has no active elimination', () => {
      const uneliminated = HYPERKALEMIA_SCENARIOS.missed_dialysis_sine_wave.initialState;
      const elim = calculateEliminationKinetics(uneliminated);
      expect(elim.clinicalEliminationDirective).toMatch(/CRITICAL: Patient has ESRD/i);
    });
  });

  describe('HYPERKALEMIA_SCENARIOS Catalog', () => {
    it('contains all 4 key clinical scenarios', () => {
      const keys = Object.keys(HYPERKALEMIA_SCENARIOS);
      expect(keys).toHaveLength(4);
      expect(keys).toContain('missed_dialysis_sine_wave');
      expect(keys).toContain('crush_injury_rhabdo');
      expect(keys).toContain('ckd_spironolactone_hypoglycemia_risk');
      expect(keys).toContain('iatrogenic_postop_futility');
    });
  });
});
