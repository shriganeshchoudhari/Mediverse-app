import {
  calculateNihssScore,
  calculateAspectsScore,
  evaluateStrokeIntervention,
  STROKE_PRESETS,
} from '../../.gemini/skills/AcuteStrokeThrombolysisEngine';

describe('AcuteStrokeThrombolysisEngine', () => {
  describe('NIHSS Score Calculation', () => {
    it('accurately tallies all 11 items and assigns correct severity category', () => {
      const result = calculateNihssScore({
        loc1a: 0,
        locQuestions1b: 2,
        locCommands1c: 1,
        bestGaze2: 1,
        visualFields3: 2,
        facialPalsy4: 2,
        motorArmLeft5a: 0,
        motorArmRight5b: 4,
        motorLegLeft6a: 0,
        motorLegRight6b: 3,
        limbAtaxia7: 0,
        sensory8: 1,
        bestLanguage9: 2,
        dysarthria10: 0,
        extinction11: 0,
      });

      expect(result.score).toBe(18);
      expect(result.severity).toBe('MODERATE_TO_SEVERE');
    });

    it('identifies minor stroke (NIHSS 1-4) and severe stroke (NIHSS >= 21)', () => {
      const minor = calculateNihssScore({
        loc1a: 0, locQuestions1b: 0, locCommands1c: 0, bestGaze2: 0, visualFields3: 0,
        facialPalsy4: 1, motorArmLeft5a: 0, motorArmRight5b: 1, motorLegLeft6a: 0, motorLegRight6b: 0,
        limbAtaxia7: 0, sensory8: 0, bestLanguage9: 0, dysarthria10: 0, extinction11: 0,
      });
      expect(minor.score).toBe(2);
      expect(minor.severity).toBe('MINOR');

      const severe = calculateNihssScore({
        loc1a: 2, locQuestions1b: 2, locCommands1c: 2, bestGaze2: 2, visualFields3: 2,
        facialPalsy4: 3, motorArmLeft5a: 4, motorArmRight5b: 0, motorLegLeft6a: 4, motorLegRight6b: 0,
        limbAtaxia7: 0, sensory8: 2, bestLanguage9: 3, dysarthria10: 2, extinction11: 2,
      });
      expect(severe.score).toBeGreaterThanOrEqual(21);
      expect(severe.severity).toBe('SEVERE');
    });
  });

  describe('ASPECTS CT Score Calculation', () => {
    it('computes 10/10 for completely intact MCA territories', () => {
      const perfectAspects = calculateAspectsScore({
        caudate: true, lentiform: true, internalCapsule: true, insularRibbon: true,
        m1AnteriorCortex: true, m2TemporalCortex: true, m3PosteriorCortex: true,
        m4AnteriorSupraganglionic: true, m5TemporalSupraganglionic: true, m6PosteriorSupraganglionic: true,
      });
      expect(perfectAspects).toBe(10);
    });

    it('deducts 1 point per hypodense territory', () => {
      const lowAspects = calculateAspectsScore({
        caudate: false, lentiform: false, internalCapsule: true, insularRibbon: false,
        m1AnteriorCortex: false, m2TemporalCortex: false, m3PosteriorCortex: false,
        m4AnteriorSupraganglionic: true, m5TemporalSupraganglionic: true, m6PosteriorSupraganglionic: true,
      });
      expect(lowAspects).toBe(4);
    });
  });

  describe('Thrombolysis & Thrombectomy Eligibility Evaluation', () => {
    it('approves dual IV Tenecteplase + EVT for hyperacute LVO within window', () => {
      const preset = STROKE_PRESETS.find(p => p.id === 'hyperacute-m1-lvo')!;
      const result = evaluateStrokeIntervention(preset.profile);

      expect(result.isEligibleForIvLysis).toBe(true);
      expect(result.isEligibleForEvt).toBe(true);
      expect(result.contraindications.length).toBe(0);
      expect(result.recommendedThrombolytic).toBe('TENECTEPLASE');
      expect(result.tenecteplaseDoseMg).toBe(Math.min(25, Math.round(preset.profile.weightKg * 0.25 * 10) / 10));
      expect(result.clinicalActionSummary).toContain('PATIENT ELIGIBLE FOR DUAL THERAPY');
    });

    it('identifies wake-up stroke as EVT eligible but IV lysis ineligible due to >4.5h time window', () => {
      const preset = STROKE_PRESETS.find(p => p.id === 'wake-up-extended-window')!;
      const result = evaluateStrokeIntervention(preset.profile);

      expect(result.isEligibleForIvLysis).toBe(false);
      expect(result.isEligibleForEvt).toBe(true);
      expect(result.contraindications.some(c => c.includes('4.5-hour'))).toBe(true);
      expect(result.clinicalActionSummary).toContain('DIRECT TRANSFER TO ANGIOGRAPHY SUITE');
    });

    it('detects severe hypertension and prompts pre-lysis BP control', () => {
      const preset = STROKE_PRESETS.find(p => p.id === 'severe-hypertension-pretpa')!;
      const result = evaluateStrokeIntervention(preset.profile);

      expect(result.bpManagementRequired).toBe(true);
      expect(result.contraindications.some(c => c.includes('Severe hypertension'))).toBe(true);
    });

    it('blocks thrombolysis for hypoglycemic stroke mimic (BG < 50)', () => {
      const preset = STROKE_PRESETS.find(p => p.id === 'hypoglycemia-stroke-mimic')!;
      const result = evaluateStrokeIntervention(preset.profile);

      expect(result.isEligibleForIvLysis).toBe(false);
      expect(result.contraindications.some(c => c.includes('Hypoglycemia'))).toBe(true);
    });

    it('caps Alteplase dose at maximum 90 mg (for patients > 100 kg)', () => {
      const heavyPatient = {
        ...STROKE_PRESETS[0].profile,
        weightKg: 110,
      };
      const result = evaluateStrokeIntervention(heavyPatient);
      expect(result.alteplaseDoseMg.totalMg).toBe(90);
      expect(result.alteplaseDoseMg.bolusMg).toBe(9);
      expect(result.alteplaseDoseMg.infusionMg).toBe(81);
    });
  });
});
