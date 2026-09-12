import {
  calculatePopoveniucScore,
  evaluateAdrenalSafety,
  calculateThyroidDosing,
  evaluateSupportiveCare,
  performMyxedemaEvaluation,
  MYXEDEMA_PRESETS,
} from '../../.gemini/skills/MyxedemaComaEngine';

describe('MyxedemaComaEngine', () => {
  describe('calculatePopoveniucScore', () => {
    it('diagnoses myxedema coma when score >= 60 in classical presentation', () => {
      const result = calculatePopoveniucScore(MYXEDEMA_PRESETS[0].inputs);
      expect(result.totalScore).toBeGreaterThanOrEqual(60);
      expect(result.diagnosticCategory).toBe('DIAGNOSTIC_MYXEDEMA_COMA');
      expect(result.estimatedMortalityPercent).toBe(45);
      expect(result.clinicalSummary).toContain('Diagnostic of Myxedema Coma');
    });

    it('identifies impending decompensation when score is 25-59', () => {
      const result = calculatePopoveniucScore(MYXEDEMA_PRESETS[2].inputs);
      expect(result.totalScore).toBeGreaterThanOrEqual(25);
      expect(result.totalScore).toBeLessThan(60);
      expect(result.diagnosticCategory).toBe('HIGH_RISK_IMPENDING');
      expect(result.clinicalSummary).toContain('Impending Decompensation');
    });

    it('classifies mild hypothyroid patient as unlikely for coma (score < 25)', () => {
      const mildInput = {
        ...MYXEDEMA_PRESETS[2].inputs,
        coreTemperatureCelsius: 36.8, // 0 pts
        cnsDysfunction: 'ABSENT' as const, // 0 pts
        giDysfunction: 'ABSENT' as const, // 0 pts
        heartRateBpm: 68, // 0 pts
        systolicBpMmHg: 124, // 0 pts
        diastolicBpMmHg: 78,
        hasCongestiveHeartFailure: false,
        hasPrecipitatingInfectionOrCold: false,
        serumSodiumMeqL: 138,
        serumGlucoseMgDl: 92,
        pao2MmHg: 95,
        paco2MmHg: 38,
      };
      const result = calculatePopoveniucScore(mildInput);
      expect(result.totalScore).toBeLessThan(25);
      expect(result.diagnosticCategory).toBe('UNLIKELY');
      expect(result.clinicalSummary).toContain('Myxedema Coma Unlikely');
    });
  });

  describe('evaluateAdrenalSafety', () => {
    it('flags CRITICAL LETHAL adrenal crisis risk when hydrocortisone is omitted', () => {
      const adrenal = evaluateAdrenalSafety(MYXEDEMA_PRESETS[1].inputs);
      expect(adrenal.isSteroidPretreatmentSatisfied).toBe(false);
      expect(adrenal.adrenalCrisisRiskLevel).toBe('CRITICAL_LETHAL');
      expect(adrenal.clinicalRationale).toContain('FATAL ADRENAL CRISIS TRIGGER');
    });

    it('confirms protected state when hydrocortisone is administered first', () => {
      const adrenal = evaluateAdrenalSafety(MYXEDEMA_PRESETS[0].inputs);
      expect(adrenal.isSteroidPretreatmentSatisfied).toBe(true);
      expect(adrenal.adrenalCrisisRiskLevel).toBe('SAFE_PROTECTED');
      expect(adrenal.hydrocortisoneRegimen).toContain('Hydrocortisone 100 mg IV q8h');
    });
  });

  describe('calculateThyroidDosing', () => {
    it('recommends standard 300 mcg T4 load in adult without coronary disease', () => {
      const adultInput = {
        ...MYXEDEMA_PRESETS[1].inputs,
        patientAgeYears: 52,
      };
      const dosing = calculateThyroidDosing(adultInput);
      expect(dosing.recommendedT4LoadingMcg).toBe(300);
      expect(dosing.recommendedT4DailyMaintenanceMcg).toBe(75);
      expect(dosing.cardiacWarning).toBeUndefined();
    });

    it('reduces T4 load to 200 mcg and issues cardiac warning in patients with CAD or elderly', () => {
      const dosing = calculateThyroidDosing(MYXEDEMA_PRESETS[2].inputs);
      expect(dosing.recommendedT4LoadingMcg).toBe(200);
      expect(dosing.recommendedT4DailyMaintenanceMcg).toBe(50);
      expect(dosing.cardiacWarning).toContain('CORONARY ARTERY DISEASE / ELDERLY CAUTION');
    });

    it('calculates combination T4 + T3 dosing for profound coma', () => {
      const dosing = calculateThyroidDosing(MYXEDEMA_PRESETS[0].inputs);
      expect(dosing.regimenType).toBe('COMBINATION_T4_T3');
      expect(dosing.recommendedT3LoadingMcg).toBeGreaterThan(0);
    });
  });

  describe('evaluateSupportiveCare', () => {
    it('flags active external rewarming as a lethal vasodilatory collapse hazard', () => {
      const care = evaluateSupportiveCare(MYXEDEMA_PRESETS[3].inputs);
      expect(care.rewarmingSafetyWarning).toContain('CRITICAL REWARMING HAZARD');
      expect(care.rewarmingSafetyWarning).toContain('peripheral vasodilation');
    });

    it('recommends passive external rewarming when active warming is absent', () => {
      const care = evaluateSupportiveCare(MYXEDEMA_PRESETS[0].inputs);
      expect(care.rewarmingSafetyWarning).toBeUndefined();
      expect(care.rewarmingGuidance).toContain('Passive External Rewarming');
    });

    it('mandates immediate intubation for severe hypercapnia and coma', () => {
      const care = evaluateSupportiveCare(MYXEDEMA_PRESETS[0].inputs);
      expect(care.ventilatoryGuidance).toContain('IMMEDIATE INTUBATION MANDATED');
    });

    it('recommends 3% hypertonic saline for severe symptomatic hyponatremia', () => {
      const care = evaluateSupportiveCare(MYXEDEMA_PRESETS[3].inputs);
      expect(care.hyponatremiaGuidance).toContain('3% Hypertonic Saline');
    });
  });

  describe('performMyxedemaEvaluation & Presets', () => {
    it('executes comprehensive evaluation cleanly on all 4 presets in MYXEDEMA_PRESETS', () => {
      MYXEDEMA_PRESETS.forEach(preset => {
        const result = performMyxedemaEvaluation(preset.inputs);
        expect(result.popoveniuc).toBeDefined();
        expect(result.adrenalSafety).toBeDefined();
        expect(result.thyroidDosing).toBeDefined();
        expect(result.supportiveCare).toBeDefined();
        expect(result.immediateActionChecklist.length).toBeGreaterThan(0);
        expect(result.clinicalPearls.length).toBeGreaterThan(0);
      });
    });

    it('triggers critical safety interlock when steroids omitted in Preset 2', () => {
      const result = performMyxedemaEvaluation(MYXEDEMA_PRESETS[1].inputs);
      expect(result.safetyInterlocks.some(s => s.includes('CRITICAL SAFETY INTERLOCK: Stress-dose IV Hydrocortisone'))).toBe(true);
    });
  });
});
