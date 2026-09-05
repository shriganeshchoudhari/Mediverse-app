import {
  estimatePediatricWeightKg,
  getBroselowZone,
  calculateAirwayEquipment,
  calculatePalsMedications,
  calculateDefibrillation,
  getVitalSignReferences,
  calculateApgarScore,
  RESUSCITATION_CASE_SCENARIOS,
  MR_SOPA_STEPS,
  NRP_PREDUCTAL_TARGETS,
} from '../../.gemini/skills/PediatricResuscitationEngine';

describe('PediatricResuscitationEngine', () => {
  describe('Weight Estimation & Broselow Tape Mapping', () => {
    it('estimates infant weight accurately', () => {
      // 6 months: (6 + 9) / 2 = 7.5 kg
      expect(estimatePediatricWeightKg(6)).toBe(7.5);
    });

    it('estimates young child weight accurately', () => {
      // 3 years (36 months): 2 * (3 + 5) = 16 kg
      expect(estimatePediatricWeightKg(36)).toBe(16.0);
    });

    it('estimates older child weight accurately', () => {
      // 8 years (96 months): 3 * 8 + 7 = 31 kg
      expect(estimatePediatricWeightKg(96)).toBe(31.0);
    });

    it('maps weights to correct Broselow color zones', () => {
      expect(getBroselowZone(4.0).color).toBe('GREY');
      expect(getBroselowZone(6.5).color).toBe('PINK');
      expect(getBroselowZone(10.5).color).toBe('PURPLE');
      expect(getBroselowZone(13.0).color).toBe('YELLOW');
      expect(getBroselowZone(16.0).color).toBe('WHITE');
      expect(getBroselowZone(21.0).color).toBe('BLUE');
      expect(getBroselowZone(26.0).color).toBe('ORANGE');
      expect(getBroselowZone(32.0).color).toBe('GREEN');
    });
  });

  describe('Airway & Equipment Sizing', () => {
    it('calculates ETT size and depth for a 4-year-old child', () => {
      const equipment = calculateAirwayEquipment(48); // 4 years
      // Uncuffed: 4/4 + 4 = 5.0 mm
      expect(equipment.uncuffedEttIdMm).toBe(5.0);
      // Cuffed: 4/4 + 3.5 = 4.5 mm
      expect(equipment.cuffedEttIdMm).toBe(4.5);
      // Depth: 3 * 5.0 = 15.0 cm
      expect(equipment.ettDepthAtLipCm).toBe(15.0);
      expect(equipment.suctionCatheterFr).toBe(10);
      expect(equipment.chestTubeFr).toBe(20);
    });

    it('provides standard sizing for term neonates', () => {
      const equip = calculateAirwayEquipment(0);
      expect(equip.uncuffedEttIdMm).toBe(3.5);
      expect(equip.laryngoscopeBlade).toContain('Miller 0 or 1');
    });
  });

  describe('PALS Emergency Pharmacology & Defibrillation', () => {
    const weight = 15.0; // 15 kg child

    it('calculates weight-based Epinephrine doses for arrest and anaphylaxis', () => {
      const meds = calculatePalsMedications(weight);
      const arrestEpi = meds.find((m) => m.name.includes('Cardiac Arrest'));
      expect(arrestEpi).toBeDefined();
      // 0.01 mg/kg * 15 = 0.15 mg; 0.1 mL/kg of 1:10,000 = 1.5 mL
      expect(arrestEpi!.calculatedDoseMg).toBe(0.15);
      expect(arrestEpi!.volumeMl).toBe(1.5);

      const anaphEpi = meds.find((m) => m.name.includes('Anaphylaxis'));
      expect(anaphEpi).toBeDefined();
      expect(anaphEpi!.calculatedDoseMg).toBe(0.15);
      expect(anaphEpi!.route).toContain('Intramuscular');
    });

    it('calculates Amiodarone, Atropine, and Fluid Resuscitation boluses', () => {
      const meds = calculatePalsMedications(weight);

      const amiodarone = meds.find((m) => m.name.includes('Amiodarone'));
      // 5 mg/kg * 15 = 75 mg
      expect(amiodarone!.calculatedDoseMg).toBe(75.0);

      const atropine = meds.find((m) => m.name.includes('Atropine'));
      // 0.02 mg/kg * 15 = 0.3 mg (within min 0.1 and max 0.5)
      expect(atropine!.calculatedDoseMg).toBe(0.3);

      const fluid = meds.find((m) => m.name.includes('Isotonic Fluid'));
      // 20 mL/kg * 15 = 300 mL
      expect(fluid!.calculatedDoseMg).toBe(300);
    });

    it('calculates PALS defibrillation and synchronized cardioversion joules', () => {
      const defib = calculateDefibrillation(12.0);
      // Initial shock: 2 J/kg * 12 = 24 J
      expect(defib.initialDefibJoules).toBe(24);
      // Subsequent shock: 4 J/kg * 12 = 48 J
      expect(defib.subsequentDefibJoules).toBe(48);
      // Synchronized cardioversion: 1 J/kg * 12 = 12 J
      expect(defib.synchronizedCardioversionJoules).toBe(12);
      expect(defib.paddleSize).toBe('PEDIATRIC');
    });
  });

  describe('Vital Signs & Hypotension Thresholds', () => {
    it('calculates minimum acceptable systolic BP for pediatric age brackets', () => {
      // 4 years: 70 + 2*4 = 78 mmHg
      const vitals4 = getVitalSignReferences(48);
      expect(vitals4.hypotensionThresholdMmHg).toBe(78);

      // Neonate: 60 mmHg
      const vitalsNeo = getVitalSignReferences(0);
      expect(vitalsNeo.hypotensionThresholdMmHg).toBe(60);
    });
  });

  describe('NRP Suite & APGAR Scoring', () => {
    it('evaluates APGAR scores accurately', () => {
      // Perfect score: 10
      const perfect = calculateApgarScore({
        appearance: 2,
        pulse: 2,
        grimace: 2,
        activity: 2,
        respiration: 2,
      });
      expect(perfect.totalScore).toBe(10);
      expect(perfect.clinicalCategory).toBe('NORMAL_REASSURING');

      // Severely depressed: 2
      const depressed = calculateApgarScore({
        appearance: 0,
        pulse: 1,
        grimace: 0,
        activity: 0,
        respiration: 1,
      });
      expect(depressed.totalScore).toBe(2);
      expect(depressed.clinicalCategory).toBe('SEVERELY_DEPRESSED');
      expect(depressed.actionRequired).toContain('Emergency NRP resuscitation');
    });

    it('contains valid MR. SOPA steps and preductal SpO2 targets', () => {
      expect(MR_SOPA_STEPS.length).toBe(6);
      expect(NRP_PREDUCTAL_TARGETS.length).toBe(6);
      expect(NRP_PREDUCTAL_TARGETS[0].minuteOfLife).toBe(1);
      expect(NRP_PREDUCTAL_TARGETS[0].targetSpO2RangePercent.min).toBe(60);
    });
  });

  describe('RESUSCITATION_CASE_SCENARIOS', () => {
    it('contains emergency scenarios with complete clinical pearls', () => {
      expect(RESUSCITATION_CASE_SCENARIOS.length).toBeGreaterThanOrEqual(4);
      for (const scenario of RESUSCITATION_CASE_SCENARIOS) {
        expect(scenario.id).toBeDefined();
        expect(scenario.title).toBeDefined();
        expect(scenario.vignette).toBeDefined();
        expect(scenario.expectedActions.length).toBeGreaterThan(0);
        expect(scenario.teachingPearls.length).toBeGreaterThan(0);
      }
    });
  });
});
