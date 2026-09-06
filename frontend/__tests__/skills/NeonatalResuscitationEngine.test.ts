import {
  calculateApgarScore,
  evaluateNrpStatus,
  NRP_TARGET_PREDUCTAL_SPO2,
  NEONATAL_PRESETS,
} from '../../.gemini/skills/NeonatalResuscitationEngine';

describe('NeonatalResuscitationEngine', () => {
  describe('APGAR Scoring', () => {
    it('accurately scores normal vigorous newborn (score 7-10)', () => {
      const result = calculateApgarScore({
        appearanceColor: 1, // acrocyanosis
        pulseHeartRate: 2, // >100
        grimaceReflex: 2, // cough/cry
        activityTone: 2, // active
        respirationEffort: 2, // lusty cry
      });

      expect(result.totalScore).toBe(9);
      expect(result.category).toBe('NORMAL_TRANSITION');
    });

    it('identifies severely depressed neonate (score <= 3)', () => {
      const result = calculateApgarScore({
        appearanceColor: 0,
        pulseHeartRate: 1,
        grimaceReflex: 0,
        activityTone: 0,
        respirationEffort: 0,
      });

      expect(result.totalScore).toBe(1);
      expect(result.category).toBe('SEVERE_DEPRESSION');
    });
  });

  describe('Pre-Ductal SpO2 Nomogram', () => {
    it('returns standard NRP minute 1 to 10 target ranges', () => {
      expect(NRP_TARGET_PREDUCTAL_SPO2[1]).toEqual([60, 65]);
      expect(NRP_TARGET_PREDUCTAL_SPO2[2]).toEqual([65, 70]);
      expect(NRP_TARGET_PREDUCTAL_SPO2[5]).toEqual([80, 85]);
      expect(NRP_TARGET_PREDUCTAL_SPO2[10]).toEqual([85, 95]);
    });
  });

  describe('NRP 8th Edition Intervention Algorithm', () => {
    it('contraindicates bag-mask PPV when Congenital Diaphragmatic Hernia is suspected', () => {
      const cdhPreset = NEONATAL_PRESETS.find(p => p.id === 'congenital-diaphragmatic-hernia')!;
      const result = evaluateNrpStatus(cdhPreset.patient);

      expect(result.recommendedAction).toContain('Bag-mask PPV is STRICTLY CONTRAINDICATED');
      expect(result.recommendedAction).toContain('Endotracheal Intubation');
    });

    it('triggers chest compressions (3:1) when HR < 60 despite effective ventilation', () => {
      const asphyxiaPreset = NEONATAL_PRESETS.find(p => p.id === 'severe-asphyxia-full-nrp')!;
      // Test when compressions are not yet active
      const patientPreCompressions = {
        ...asphyxiaPreset.patient,
        interventions: {
          ...asphyxiaPreset.patient.interventions,
          chestCompressionsActive: false,
        },
      };
      const resultPre = evaluateNrpStatus(patientPreCompressions);
      expect(resultPre.recommendedAction).toContain('3:1 coordinated Chest Compressions');
      expect(resultPre.recommendedAction).toContain('100%');

      // When compressions are active, next step is UVC epinephrine
      const resultPost = evaluateNrpStatus(asphyxiaPreset.patient);
      expect(resultPost.recommendedAction).toContain('Administer IV Epinephrine via Umbilical Venous Catheter');
    });

    it('calculates accurate weight-based UVC Epinephrine and Normal Saline bolus', () => {
      const preset = NEONATAL_PRESETS.find(p => p.id === 'term-vigorous-normal')!;
      const result = evaluateNrpStatus(preset.patient);

      // Weight 3.4 kg
      // UVC Epi = 0.2 mL/kg -> 0.68 mL
      expect(result.epinephrineDoseUvcMl).toBe(0.68);
      // ETT Epi = 1.0 mL/kg -> 3.4 mL
      expect(result.epinephrineDoseEttMl).toBe(3.4);
      // Volume = 10 mL/kg -> 34 mL
      expect(result.normalSalineBolusMl).toBe(34);
    });

    it('identifies HIE therapeutic hypothermia eligibility for cord pH <= 7.00', () => {
      const hiePreset = NEONATAL_PRESETS.find(p => p.id === 'hie-therapeutic-hypothermia')!;
      const result = evaluateNrpStatus(hiePreset.patient);

      expect(result.therapeuticHypothermiaEligible).toBe(true);
      expect(result.sarnatHieGrade).toBe('STAGE_II_MODERATE');
    });
  });
});
