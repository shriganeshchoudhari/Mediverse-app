/**
 * OrganophosphateToxEngine.test.ts
 * Unit tests for Organophosphate & Carbamate Toxicology, Aging Kinetics, Atropine & Oxime Titration.
 */

import {
  calculateAcheAging,
  evaluateAtropinization,
  calculatePralidoximeDosing,
  assessIntermediateSyndromeRisk,
  OP_SCENARIOS,
  PatientToxState,
} from '../../.gemini/skills/OrganophosphateToxEngine';

describe('OrganophosphateToxEngine', () => {
  describe('calculateAcheAging', () => {
    it('models rapid aging in nerve agents (Sarin t1/2 ~ 4.5h)', () => {
      const early = calculateAcheAging('nerve_agent', 1.0);
      expect(early.estimatedAgingPercent).toBeLessThan(25);
      expect(early.oximeEfficacyRating).toContain('Efficacy');

      const late = calculateAcheAging('nerve_agent', 15.0);
      expect(late.estimatedAgingPercent).toBeGreaterThan(80);
      expect(late.oximeEfficacyRating).toBe('Ineffective (Fully Aged)');
    });

    it('recognizes that carbamates do not undergo aging', () => {
      const carbamate = calculateAcheAging('carbamate', 12.0);
      expect(carbamate.estimatedAgingPercent).toBe(0);
      expect(carbamate.reactivatableFractionPercent).toBe(100);
      expect(carbamate.clinicalAgingComment).toContain('do not undergo covalent aging');
    });

    it('calculates progressive aging in agricultural OPs (t1/2 ~ 36h)', () => {
      const op24h = calculateAcheAging('organophosphate_pesticide', 24.0);
      expect(op24h.estimatedAgingPercent).toBeGreaterThanOrEqual(30);
      expect(op24h.estimatedAgingPercent).toBeLessThanOrEqual(45);
      expect(op24h.reactivatableFractionPercent).toBeGreaterThan(50);
    });
  });

  describe('evaluateAtropinization & Doubling Protocol', () => {
    it('identifies un-atropinized patient with Killer B\'s (bronchorrhea & bradycardia)', () => {
      const state: PatientToxState = {
        toxinName: 'Malathion',
        toxinClass: 'organophosphate_pesticide',
        exposureHoursAgo: 2,
        plasmaAcheActivityPercent: 10,
        rbcAcheActivityPercent: 15,
        heartRateBpm: 44, // < 80
        systolicBpMmHg: 75, // < 80
        respiratoryRateBpm: 30,
        spo2Percent: 82,
        bronchorrheaSeverity: 'massive', // not clear
        wheezingBronchospasm: true,
        pupilDiameterMm: 1.0,
        axillaeMoisture: 'drenching_sweat', // not dry
        fasciculationsSeverity: 'generalized',
        diaphragmStrengthPercent: 50,
        seizureActivity: false,
        cumulativeAtropineMg: 0,
        pralidoximeInfusedGrams: 0,
      };

      const status = evaluateAtropinization(state);
      expect(status.isFullyAtropinized).toBe(false);
      expect(status.clearLungsAchieved).toBe(false);
      expect(status.heartRateAdequate).toBe(false);
      expect(status.dryAxillaeAchieved).toBe(false);
      expect(status.recommendedNextAtropineDoseMg).toBe(2);
      expect(status.pupilAlert).toContain('Pupil dilation');
    });

    it('confirms full atropinization once clinical endpoints are satisfied', () => {
      const state: PatientToxState = {
        toxinName: 'Malathion',
        toxinClass: 'organophosphate_pesticide',
        exposureHoursAgo: 4,
        plasmaAcheActivityPercent: 10,
        rbcAcheActivityPercent: 15,
        heartRateBpm: 92, // >= 80
        systolicBpMmHg: 110, // >= 80
        respiratoryRateBpm: 18,
        spo2Percent: 97,
        bronchorrheaSeverity: 'none', // clear
        wheezingBronchospasm: false,
        pupilDiameterMm: 2.0, // note: pupils can still be small!
        axillaeMoisture: 'dry', // dry
        fasciculationsSeverity: 'mild',
        diaphragmStrengthPercent: 70,
        seizureActivity: false,
        cumulativeAtropineMg: 28,
        pralidoximeInfusedGrams: 2,
      };

      const status = evaluateAtropinization(state);
      expect(status.isFullyAtropinized).toBe(true);
      expect(status.recommendedNextAtropineDoseMg).toBe(0);
      expect(status.recommendedContinuousInfusionMgHr).toBeGreaterThan(3.0);
      expect(status.clinicalAction).toContain('FULLY ATROPINIZED');
    });

    it('implements dose doubling sequence for non-responsive atropine boluses', () => {
      const baseState: PatientToxState = {
        toxinName: 'Malathion',
        toxinClass: 'organophosphate_pesticide',
        exposureHoursAgo: 2,
        plasmaAcheActivityPercent: 10,
        rbcAcheActivityPercent: 15,
        heartRateBpm: 50,
        systolicBpMmHg: 70,
        respiratoryRateBpm: 28,
        spo2Percent: 85,
        bronchorrheaSeverity: 'moderate',
        wheezingBronchospasm: true,
        pupilDiameterMm: 1.0,
        axillaeMoisture: 'moist',
        fasciculationsSeverity: 'moderate',
        diaphragmStrengthPercent: 60,
        seizureActivity: false,
        cumulativeAtropineMg: 2, // given 2 mg
        pralidoximeInfusedGrams: 0,
      };

      const status1 = evaluateAtropinization(baseState);
      expect(status1.recommendedNextAtropineDoseMg).toBe(4); // doubles to 4 mg

      const state2 = { ...baseState, cumulativeAtropineMg: 6 };
      const status2 = evaluateAtropinization(state2);
      expect(status2.recommendedNextAtropineDoseMg).toBe(8); // doubles to 8 mg
    });
  });

  describe('calculatePralidoximeDosing', () => {
    it('indicates 2-PAM for acute organophosphate with skeletal muscle weakness', () => {
      const aging = calculateAcheAging('organophosphate_pesticide', 3.0);
      const advice = calculatePralidoximeDosing('organophosphate_pesticide', aging, 'generalized', 40);

      expect(advice.isIndicated).toBe(true);
      expect(advice.loadingDoseGrams).toBe(2.0);
      expect(advice.maintenanceInfusionMgHr).toBeGreaterThanOrEqual(500);
      expect(advice.rationale).toContain('neuromuscular junctions');
    });

    it('withholds 2-PAM in isolated carbamate poisoning', () => {
      const aging = calculateAcheAging('carbamate', 3.0);
      const advice = calculatePralidoximeDosing('carbamate', aging, 'mild', 70);

      expect(advice.isIndicated).toBe(false);
      expect(advice.rationale).toContain('Carbamate toxicity does not age');
    });
  });

  describe('assessIntermediateSyndromeRisk', () => {
    it('identifies high IMS risk in patient with severely suppressed AChE activity', () => {
      const risk = assessIntermediateSyndromeRisk('organophosphate_pesticide', 48, 12);
      expect(risk.imsRiskLevel).toBe('High');
      expect(risk.onsetWindowHours).toContain('24 to 96');
      expect(risk.manifestations.some((m) => m.includes('Neck flexor weakness'))).toBe(true);
      expect(risk.monitoringMandate).toContain('Atropine does NOT treat IMS');
    });
  });

  describe('OP_SCENARIOS Catalog', () => {
    it('contains all 4 key toxicological scenarios', () => {
      expect(OP_SCENARIOS.severe_malathion_ingestion).toBeDefined();
      expect(OP_SCENARIOS.sarin_nerve_agent).toBeDefined();
      expect(OP_SCENARIOS.carbamate_poisoning).toBeDefined();
      expect(OP_SCENARIOS.delayed_ims_presentation).toBeDefined();
    });

    it('delayed_ims_presentation demonstrates clear lungs but profound diaphragm weakness', () => {
      const sc = OP_SCENARIOS.delayed_ims_presentation;
      const status = evaluateAtropinization(sc.initialState);
      expect(status.clearLungsAchieved).toBe(true);
      expect(sc.initialState.diaphragmStrengthPercent).toBeLessThan(30);
    });
  });
});
