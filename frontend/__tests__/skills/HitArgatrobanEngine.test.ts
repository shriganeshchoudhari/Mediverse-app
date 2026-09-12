import {
  calculate4TsScore,
  evaluateHitSerology,
  calculateDtiDosing,
  performHitEvaluation,
  HIT_PRESETS,
} from '../../.gemini/skills/HitArgatrobanEngine';

describe('HitArgatrobanEngine', () => {
  describe('calculate4TsScore', () => {
    it('calculates High Probability (Score 7/8) for classical post-op presentation', () => {
      const result = calculate4TsScore(
        'DROP_GT_50_NADIR_GE_20',
        'DAY_5_TO_10_OR_RAPID_WITHIN_30D',
        'CONFIRMED_NEW_OR_SKIN_NECROSIS_OR_REACTION',
        'POSSIBLE_ALTERNATIVE_PRESENT'
      );
      expect(result.totalScore).toBe(7);
      expect(result.probabilityCategory).toBe('HIGH_PROBABILITY');
      expect(result.estimatedHitPrevalencePercent).toBe(58.0);
      expect(result.clinicalRecommendation).toContain('High Probability');
    });

    it('calculates Intermediate Probability (Score 4-5)', () => {
      const result = calculate4TsScore(
        'DROP_30_50_OR_NADIR_10_19', // 1
        'DAY_5_TO_10_OR_RAPID_WITHIN_30D', // 2
        'PROGRESSIVE_RECURRENT_OR_SUSPECTED', // 1
        'DEFINITE_ALTERNATIVE_PRESENT' // 0
      );
      expect(result.totalScore).toBe(4);
      expect(result.probabilityCategory).toBe('INTERMEDIATE_PROBABILITY');
      expect(result.estimatedHitPrevalencePercent).toBe(12.0);
      expect(result.clinicalRecommendation).toContain('Intermediate Probability');
    });

    it('calculates Low Probability (Score 0-3) with >99% negative predictive value', () => {
      const result = calculate4TsScore(
        'DROP_30_50_OR_NADIR_10_19', // 1
        'FALL_LT_DAY_4_NO_RECENT_HEPARIN', // 0
        'NONE', // 0
        'POSSIBLE_ALTERNATIVE_PRESENT' // 1
      );
      expect(result.totalScore).toBe(2);
      expect(result.probabilityCategory).toBe('LOW_PROBABILITY');
      expect(result.estimatedHitPrevalencePercent).toBe(0.8);
      expect(result.clinicalRecommendation).toContain('Low Probability');
      expect(result.clinicalRecommendation).toContain('Negative predictive value exceeds 99%');
    });
  });

  describe('evaluateHitSerology', () => {
    it('interprets negative ELISA when OD < 0.40', () => {
      const sero = evaluateHitSerology(0.24);
      expect(sero.elisaResult).toBe('NEGATIVE');
      expect(sero.elisaInterpretation).toContain('Excludes HIT');
    });

    it('interprets weakly positive ELISA when OD 0.40 - 0.99', () => {
      const sero = evaluateHitSerology(0.65);
      expect(sero.elisaResult).toBe('WEAK_POSITIVE');
      expect(sero.elisaInterpretation).toContain('Weakly Positive ELISA');
    });

    it('interprets strongly positive ELISA when OD >= 2.00', () => {
      const sero = evaluateHitSerology(2.45);
      expect(sero.elisaResult).toBe('STRONG_POSITIVE');
      expect(sero.elisaInterpretation).toContain('Strongly Positive ELISA');
    });

    it('confirms gold-standard HIT when SRA is positive at low heparin and inhibited at high heparin', () => {
      const sero = evaluateHitSerology(2.1, true, true);
      expect(sero.sraResult).toBe('CONFIRMED_HIT');
      expect(sero.sraInterpretation).toContain('Definitive Gold-Standard HIT Confirmed');
    });

    it('detects atypical SRA when uninhibited at high heparin', () => {
      const sero = evaluateHitSerology(1.8, true, false);
      expect(sero.sraResult).toBe('ATYPICAL');
      expect(sero.sraInterpretation).toContain('Atypical SRA Pattern');
    });
  });

  describe('calculateDtiDosing', () => {
    it('recommends standard 2.0 mcg/kg/min for Argatroban in normal liver function', () => {
      const plan = calculateDtiDosing('ARGATROBAN', 0.8, false, 80, 30);
      expect(plan.selectedAgent).toBe('ARGATROBAN');
      expect(plan.initialRecommendedDose).toBe(2.0);
      expect(plan.doseUnit).toBe('mcg/kg/min');
      expect(plan.targetApttRangeSeconds).toBe('45 - 90 s (1.5 - 3.0× baseline)');
      expect(plan.metabolicClearancePathway).toContain('Hepatic');
    });

    it('reduces Argatroban dose to 0.5 mcg/kg/min in hepatic impairment (Bilirubin > 1.5)', () => {
      const plan = calculateDtiDosing('ARGATROBAN', 2.8, true, 70, 30);
      expect(plan.initialRecommendedDose).toBe(0.5);
      expect(plan.doseAdjustmentGuidance).toContain('Hepatic Impairment');
    });

    it('recommends standard 0.15 mg/kg/h for Bivalirudin in normal renal function', () => {
      const plan = calculateDtiDosing('BIVALIRUDIN', 0.9, false, 90, 28);
      expect(plan.initialRecommendedDose).toBe(0.15);
      expect(plan.doseUnit).toBe('mg/kg/h');
    });

    it('reduces Bivalirudin dose to 0.05 mg/kg/h in severe renal impairment (CrCl < 30)', () => {
      const plan = calculateDtiDosing('BIVALIRUDIN', 1.0, false, 20, 28);
      expect(plan.initialRecommendedDose).toBe(0.05);
      expect(plan.doseAdjustmentGuidance).toContain('Severe Renal Impairment');
    });

    it('includes critical Warfarin limb gangrene safeguards', () => {
      const plan = calculateDtiDosing('ARGATROBAN', 0.8, false, 80, 30);
      expect(plan.warfarinTransitionSafeguards.some(s => s.includes('ABSOLUTELY CONTRAINDICATED'))).toBe(true);
      expect(plan.warfarinTransitionSafeguards.some(s => s.includes('Venous Limb Gangrene'))).toBe(true);
    });
  });

  describe('performHitEvaluation & Safety Interlocks', () => {
    it('triggers critical danger alert when platelet transfusion is administered', () => {
      const input = {
        ...HIT_PRESETS[0].inputs,
        isPlateletTransfusionGiven: true,
      };
      const evalResult = performHitEvaluation(input);
      expect(evalResult.safetyInterlocks.some(s => s.includes('CRITICAL DANGER (Platelet Transfusion'))).toBe(true);
      expect(evalResult.safetyInterlocks.some(s => s.includes('fuel on fire'))).toBe(true);
    });

    it('triggers critical warning when Warfarin is active in acute phase', () => {
      const input = {
        ...HIT_PRESETS[0].inputs,
        isWarfarinActiveInAcutePhase: true,
      };
      const evalResult = performHitEvaluation(input);
      expect(evalResult.safetyInterlocks.some(s => s.includes('CRITICAL WARNING (Active Warfarin'))).toBe(true);
      expect(evalResult.safetyInterlocks.some(s => s.includes('Vitamin K'))).toBe(true);
    });

    it('triggers Argatroban overdose risk warning when dose excessive in liver dysfunction', () => {
      const input = {
        ...HIT_PRESETS[3].inputs,
        currentDtiDose: 1.5, // excessive for bilirubin 3.4
      };
      const evalResult = performHitEvaluation(input);
      expect(evalResult.safetyInterlocks.some(s => s.includes('ARGATROBAN OVERDOSE RISK'))).toBe(true);
    });

    it('executes without error on all 4 presets in HIT_PRESETS', () => {
      HIT_PRESETS.forEach(preset => {
        const evalResult = performHitEvaluation(preset.inputs);
        expect(evalResult.fourTs).toBeDefined();
        expect(evalResult.serology).toBeDefined();
        expect(evalResult.dtiPlan).toBeDefined();
        expect(evalResult.immediateActionChecklist.length).toBeGreaterThan(0);
        expect(evalResult.clinicalPearls.length).toBeGreaterThan(0);
      });
    });
  });
});
