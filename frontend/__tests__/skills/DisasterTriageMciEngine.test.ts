import {
  evaluateStartTriage,
  evaluateJumpStartTriage,
  applyLifesavingIntervention,
  computeMciPerformanceMetrics,
  MCI_SCENARIOS,
  INITIAL_HICS_RESOURCES,
  MciVictim,
  InterventionType,
} from '../../.gemini/skills/DisasterTriageMciEngine';

describe('DisasterTriageMciEngine Unit Tests', () => {
  const baseAdultVictim: MciVictim = {
    id: 'test-vic-01',
    tagNumber: 'T01',
    name: 'Adult Test Patient',
    age: 35,
    isPediatric: false,
    gender: 'M',
    mechanism: 'Blunt blast injury',
    canAmbulate: false,
    isBreathing: true,
    breathingAfterAirwayOpen: true,
    respiratoryRate: 20,
    hasRadialPulse: true,
    capillaryRefillSec: 1.5,
    mentalStatus: 'ALERT_ORIENTED',
    avpu: 'ALERT',
    bleedingType: 'NONE',
    tensionPneumothoraxPresent: false,
    organophosphatePoisoning: false,
    decontaminationStatus: 'NOT_REQUIRED',
    correctTriageCategory: 'DELAYED_YELLOW',
    appliedInterventions: [],
    clinicalSummary: 'Stable trauma patient with closed lower extremity fracture.',
  };

  describe('START Adult Triage Algorithm', () => {
    it('classifies walking wounded as MINOR GREEN', () => {
      const walkingVictim = { ...baseAdultVictim, canAmbulate: true };
      const res = evaluateStartTriage(walkingVictim);
      expect(res.category).toBe('MINOR_GREEN');
      expect(res.rationale).toContain('ambulate');
    });

    it('classifies apneic patient remaining apneic after airway opening as EXPECTANT BLACK', () => {
      const deadVictim = {
        ...baseAdultVictim,
        isBreathing: false,
        breathingAfterAirwayOpen: false,
      };
      const res = evaluateStartTriage(deadVictim, true);
      expect(res.category).toBe('EXPECTANT_BLACK');
    });

    it('classifies apneic patient resuming breathing after airway opening as IMMEDIATE RED', () => {
      const salvagedAirway = {
        ...baseAdultVictim,
        isBreathing: false,
        breathingAfterAirwayOpen: true,
      };
      const res = evaluateStartTriage(salvagedAirway, true);
      expect(res.category).toBe('IMMEDIATE_RED');
      expect(res.rationale).toContain('restored immediately');
    });

    it('classifies tachypnea (RR > 30) as IMMEDIATE RED', () => {
      const tachypneic = { ...baseAdultVictim, respiratoryRate: 36 };
      const res = evaluateStartTriage(tachypneic);
      expect(res.category).toBe('IMMEDIATE_RED');
    });

    it('classifies absent radial pulse / delayed capillary refill as IMMEDIATE RED', () => {
      const shocked = {
        ...baseAdultVictim,
        hasRadialPulse: false,
        capillaryRefillSec: 3.5,
      };
      const res = evaluateStartTriage(shocked);
      expect(res.category).toBe('IMMEDIATE_RED');
      expect(res.rationale).toContain('Compromised perfusion');
    });

    it('classifies altered mental status as IMMEDIATE RED', () => {
      const confused = {
        ...baseAdultVictim,
        mentalStatus: 'CONFUSED' as const,
      };
      const res = evaluateStartTriage(confused);
      expect(res.category).toBe('IMMEDIATE_RED');
    });

    it('classifies non-ambulatory with normal RPM vitals as DELAYED YELLOW', () => {
      const res = evaluateStartTriage(baseAdultVictim);
      expect(res.category).toBe('DELAYED_YELLOW');
    });
  });

  describe('JumpSTART Pediatric Triage Algorithm', () => {
    const basePedsVictim: MciVictim = {
      id: 'test-peds-01',
      tagNumber: 'P01',
      name: 'Pediatric Test Patient',
      age: 5,
      isPediatric: true,
      gender: 'F',
      mechanism: 'Vehicle collision',
      canAmbulate: false,
      isBreathing: false,
      breathingAfterAirwayOpen: true,
      respiratoryRate: 0,
      hasRadialPulse: true,
      capillaryRefillSec: 2,
      mentalStatus: 'UNRESPONSIVE',
      avpu: 'PAIN',
      bleedingType: 'NONE',
      tensionPneumothoraxPresent: false,
      organophosphatePoisoning: false,
      decontaminationStatus: 'NOT_REQUIRED',
      correctTriageCategory: 'IMMEDIATE_RED',
      appliedInterventions: [],
      clinicalSummary: 'Apneic child with pulse.',
    };

    it('identifies apneic child with pulse and mandates 5 rescue breaths', () => {
      const res = evaluateJumpStartTriage(basePedsVictim, true, false);
      expect(res.category).toBe('IMMEDIATE_RED');
      expect(res.rationale).toContain('5 rescue breaths indicated');
    });

    it('declares EXPECTANT BLACK if child remains apneic after 5 rescue breaths', () => {
      const nonResponsiveChild = {
        ...basePedsVictim,
        breathingAfterAirwayOpen: false,
      };
      const res = evaluateJumpStartTriage(nonResponsiveChild, true, true);
      expect(res.category).toBe('EXPECTANT_BLACK');
    });

    it('classifies pediatric respiratory rate outside 15-45 window as IMMEDIATE RED', () => {
      const tachypneicChild = {
        ...basePedsVictim,
        isBreathing: true,
        respiratoryRate: 54,
      };
      const res = evaluateJumpStartTriage(tachypneicChild);
      expect(res.category).toBe('IMMEDIATE_RED');
    });

    it('classifies pediatric unresponsiveness or posturing as IMMEDIATE RED', () => {
      const posturingChild = {
        ...basePedsVictim,
        isBreathing: true,
        respiratoryRate: 24,
        avpu: 'PAIN' as const,
        mentalStatus: 'POSTURING' as const,
      };
      const res = evaluateJumpStartTriage(posturingChild);
      expect(res.category).toBe('IMMEDIATE_RED');
    });
  });

  describe('Point-of-Injury Lifesaving Interventions', () => {
    it('applies CAT tourniquet and halts arterial hemorrhage', () => {
      const bleedingVictim: MciVictim = {
        ...baseAdultVictim,
        bleedingType: 'ARTERIAL_EXSANGUINATING',
        hasRadialPulse: false,
      };

      const { updatedVictim, outcomeMessage, isAppropriate } =
        applyLifesavingIntervention(bleedingVictim, 'TOURNIQUET');

      expect(isAppropriate).toBe(true);
      expect(updatedVictim.bleedingType).toBe('CONTROLLED');
      expect(updatedVictim.hasRadialPulse).toBe(true);
      expect(outcomeMessage).toContain('arterial bleeding halted');
    });

    it('performs needle decompression and relieves tension pneumothorax', () => {
      const tensionVictim: MciVictim = {
        ...baseAdultVictim,
        tensionPneumothoraxPresent: true,
        respiratoryRate: 38,
        hasRadialPulse: false,
      };

      const { updatedVictim, outcomeMessage, isAppropriate } =
        applyLifesavingIntervention(tensionVictim, 'NEEDLE_DECOMPRESSION');

      expect(isAppropriate).toBe(true);
      expect(updatedVictim.tensionPneumothoraxPresent).toBe(false);
      expect(updatedVictim.respiratoryRate).toBe(22);
      expect(outcomeMessage).toContain('shock relieved');
    });
  });

  describe('Disaster Performance Metrics & Error Scoring', () => {
    it('calculates 100% accuracy when all victims are triaged correctly', () => {
      const victims = MCI_SCENARIOS[0].victims.map((v) => ({
        ...v,
        assignedTriageCategory: v.correctTriageCategory,
        appliedInterventions: (v.bleedingType === 'ARTERIAL_EXSANGUINATING'
          ? ['TOURNIQUET']
          : v.tensionPneumothoraxPresent
          ? ['NEEDLE_DECOMPRESSION']
          : []) as InterventionType[],
      }));

      const metrics = computeMciPerformanceMetrics(victims, INITIAL_HICS_RESOURCES);
      expect(metrics.accuracyScore).toBe(100);
      expect(metrics.correctCount).toBe(10);
      expect(metrics.underTriageCount).toBe(0);
      expect(metrics.preventableDeaths).toBe(0);
    });

    it('detects critical under-triage and logs preventable death', () => {
      const victims = MCI_SCENARIOS[0].victims.map((v) => {
        if (v.id === 'vic-102') {
          return { ...v, assignedTriageCategory: 'MINOR_GREEN' as const };
        }
        return { ...v, assignedTriageCategory: v.correctTriageCategory };
      });

      const metrics = computeMciPerformanceMetrics(victims, INITIAL_HICS_RESOURCES);
      expect(metrics.underTriageCount).toBeGreaterThan(0);
      expect(metrics.preventableDeaths).toBeGreaterThan(0);
      expect(metrics.feedback.some((f) => f.includes('CRITICAL UNDER-TRIAGE'))).toBe(true);
    });
  });
});