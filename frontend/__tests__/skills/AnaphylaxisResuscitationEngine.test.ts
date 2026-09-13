/**
 * AnaphylaxisResuscitationEngine.test.ts
 * Unit tests for AnaphylaxisResuscitationEngine.
 */

import {
  evaluateWaoCriteria,
  calculateEpiPharmacokinetics,
  evaluateRefractoryShock,
  calculateBiphasicRisk,
  validateSerumTryptase,
  ANAPHYLAXIS_SCENARIOS,
} from '../../.gemini/skills/AnaphylaxisResuscitationEngine';

describe('AnaphylaxisResuscitationEngine', () => {
  describe('evaluateWaoCriteria', () => {
    it('confirms Criterion 1: Acute skin involvement with respiratory compromise', () => {
      const state = ANAPHYLAXIS_SCENARIOS.peanut_stridor_angioedema.initialState;
      const report = evaluateWaoCriteria(state);

      expect(report.isAnaphylaxisConfirmed).toBe(true);
      expect(report.fulfilledCriteria).toContain('Criterion 1 (Acute Skin/Mucosa + Respiratory or Hypotension)');
      expect(report.severityGrade).toBe('Moderate (Respiratory/GI)');
    });

    it('confirms Criterion 3: Isolated profound hypotension after exposure to known allergen', () => {
      const state = {
        ...ANAPHYLAXIS_SCENARIOS.peanut_stridor_angioedema.initialState,
        isAllergenKnownExposure: true,
        cutaneousSigns: {
          generalizedUrticaria: false,
          pruritusFlushing: false,
          angioedemaLipsTongueUvula: false,
        },
        respiratorySigns: {
          stridorLaryngealEdema: false,
          wheezingBronchospasm: false,
          tachypneaRr: 16,
          spo2Percent: 98,
        },
        cardiovascularSigns: {
          systolicBpMmHg: 72,
          diastolicBpMmHg: 40,
          heartRateBpm: 120,
          syncopeAlteredSensorium: true,
        },
        gastrointestinalSigns: {
          severeAbdominalCramping: false,
          repetitiveVomitingDiarrhea: false,
        },
      };

      const report = evaluateWaoCriteria(state);
      expect(report.isAnaphylaxisConfirmed).toBe(true);
      expect(report.fulfilledCriteria).toContain('Criterion 3 (Hypotension Post Known Allergen)');
      expect(report.severityGrade).toBe('Severe (Hypotensive Shock)');
    });
  });

  describe('calculateEpiPharmacokinetics', () => {
    it('demonstrates superior absorption kinetics in Vastus Lateralis IM vs Deltoid and SubQ', () => {
      const vlDose = [{ doseMg: 0.3, site: 'im_vastus_lateralis' as const, minutesAgo: 8 }];
      const deltoidDose = [{ doseMg: 0.3, site: 'im_deltoid' as const, minutesAgo: 8 }];
      const subqDose = [{ doseMg: 0.3, site: 'subcutaneous' as const, minutesAgo: 8 }];

      const vlReport = calculateEpiPharmacokinetics(vlDose, 0, 70);
      const deltoidReport = calculateEpiPharmacokinetics(deltoidDose, 0, 70);
      const subqReport = calculateEpiPharmacokinetics(subqDose, 0, 70);

      expect(vlReport.absorptionRating).toBe('Optimal Fast (Vastus Lateralis)');
      expect(vlReport.timeToPeakMinutes).toBe(8);
      expect(vlReport.currentPlasmaConcentrationPgMl).toBeGreaterThan(deltoidReport.currentPlasmaConcentrationPgMl);
      expect(vlReport.currentPlasmaConcentrationPgMl).toBeGreaterThan(subqReport.currentPlasmaConcentrationPgMl);
    });

    it('accounts for continuous IV infusion contribution in refractory shock', () => {
      const report = calculateEpiPharmacokinetics([], 0.1, 70);
      expect(report.currentPlasmaConcentrationPgMl).toBeGreaterThanOrEqual(2000);
      expect(report.therapeuticAdequacy).toMatch(/Therapeutic Window/i);
    });
  });

  describe('evaluateRefractoryShock', () => {
    it('identifies refractory shock when multiple IM doses fail to restore MAP', () => {
      const state = ANAPHYLAXIS_SCENARIOS.beta_blocker_refractory_shock.initialState;
      const shockReport = evaluateRefractoryShock(state);

      expect(shockReport.isRefractoryShock).toBe(true);
      expect(shockReport.meanArterialPressureMmHg).toBeLessThan(65);
      expect(shockReport.ivEpinephrineInfusionRecommendation).toMatch(/Continuous IV Epinephrine/i);
    });

    it('mandates IV Glucagon in patients on chronic beta-blocker therapy', () => {
      const state = ANAPHYLAXIS_SCENARIOS.beta_blocker_refractory_shock.initialState;
      const shockReport = evaluateRefractoryShock(state);

      expect(shockReport.glucagonIndicated).toBe(true);
      expect(shockReport.glucagonDosing).toMatch(/MANDATORY GLUCAGON RESCUE/i);
      expect(shockReport.clinicalActionDirective).toMatch(/Glucagon/i);
    });
  });

  describe('calculateBiphasicRisk', () => {
    it('identifies High Biphasic Risk (12-24h observation) with severe hypotension and delayed epinephrine', () => {
      const state = ANAPHYLAXIS_SCENARIOS.delayed_epi_biphasic_hazard.initialState;
      const biphasicReport = calculateBiphasicRisk(state);

      expect(biphasicReport.biphasicRiskScore).toBeGreaterThanOrEqual(5);
      expect(biphasicReport.riskCategory).toBe('High Risk (12-24h ICU observation)');
      expect(biphasicReport.mandatoryObservationHours).toBe(24);
      expect(biphasicReport.riskFactorsPresent.some((r) => r.includes('Delayed initial epinephrine'))).toBe(true);
    });
  });

  describe('validateSerumTryptase', () => {
    it('validates mast cell activation when acute exceeds consensus threshold: (1.2 * baseline) + 2.0', () => {
      const baseline = 5.0; // Threshold = 1.2 * 5 + 2 = 8.0 mcg/L
      const positiveAcute = 16.0;
      const negativeAcute = 7.0;

      const posReport = validateSerumTryptase(positiveAcute, baseline);
      expect(posReport.isMastCellActivationConfirmed).toBe(true);
      expect(posReport.thresholdRequiredMcgL).toBe(8.0);
      expect(posReport.interpretation).toMatch(/CONFIRMED/i);

      const negReport = validateSerumTryptase(negativeAcute, baseline);
      expect(negReport.isMastCellActivationConfirmed).toBe(false);
    });
  });

  describe('ANAPHYLAXIS_SCENARIOS Catalog', () => {
    it('contains all 4 key clinical scenarios', () => {
      const keys = Object.keys(ANAPHYLAXIS_SCENARIOS);
      expect(keys).toHaveLength(4);
      expect(keys).toContain('peanut_stridor_angioedema');
      expect(keys).toContain('beta_blocker_refractory_shock');
      expect(keys).toContain('delayed_epi_biphasic_hazard');
      expect(keys).toContain('perioperative_cefazolin_collapse');
    });
  });
});
