/**
 * AcetaminophenToxicityEngine.test.ts
 * Unit tests for Rumack-Matthew nomogram mathematics, King's College criteria,
 * NAC precision dosing, and anaphylactoid reaction management.
 */

import {
  evaluateRumackMatthewNomogram,
  evaluateKingsCollegeCriteria,
  calculateNacDosing,
  evaluateAcetaminophenCase,
  ACETAMINOPHEN_PRESETS,
} from '../../.gemini/skills/AcetaminophenToxicityEngine';

describe('AcetaminophenToxicityEngine Calculations & Clinical Decision Support', () => {
  it('correctly calculates Rumack-Matthew nomogram thresholds at standard intervals', () => {
    // At 4h: 150 mcg/mL
    const nom4 = evaluateRumackMatthewNomogram('ACUTE_SINGLE', 4, 160);
    expect(nom4.isNomogramApplicable).toBe(true);
    expect(nom4.treatmentLineThresholdMcgMl).toBe(150);
    expect(nom4.toxicityRiskTier).toBe('ABOVE_TREATMENT_LINE_TOXIC');

    // At 8h: 75 mcg/mL
    const nom8 = evaluateRumackMatthewNomogram('ACUTE_SINGLE', 8, 60);
    expect(nom8.treatmentLineThresholdMcgMl).toBe(75);
    expect(nom8.toxicityRiskTier).toBe('BELOW_TREATMENT_LINE');

    // At 12h: 37.5 mcg/mL
    const nom12 = evaluateRumackMatthewNomogram('ACUTE_SINGLE', 12, 45);
    expect(nom12.treatmentLineThresholdMcgMl).toBe(37.5);
    expect(nom12.toxicityRiskTier).toBe('ABOVE_TREATMENT_LINE_TOXIC');

    // At 16h: 18.8 mcg/mL
    const nom16 = evaluateRumackMatthewNomogram('ACUTE_SINGLE', 16, 20);
    expect(nom16.treatmentLineThresholdMcgMl).toBeCloseTo(18.8, 1);
  });

  it('identifies massive ingestion (> 2x nomogram line) and invalid time windows', () => {
    // Massive at 4h (> 300 mcg/mL)
    const massive = evaluateRumackMatthewNomogram('ACUTE_SINGLE', 4, 380);
    expect(massive.toxicityRiskTier).toBe('MASSIVE_INGESTION_CRITICAL');
    expect(massive.interpretation).toContain('MASSIVE INGESTION DETECTED');

    // Invalid < 4h
    const early = evaluateRumackMatthewNomogram('ACUTE_SINGLE', 2, 200);
    expect(early.isNomogramApplicable).toBe(false);
    expect(early.interpretation).toContain('cannot be interpreted before 4 hours');

    // Invalid chronic
    const chronic = evaluateRumackMatthewNomogram('CHRONIC_REPEATED', 10, 50);
    expect(chronic.isNomogramApplicable).toBe(false);
    expect(chronic.interpretation).toContain('NOT valid for chronic');
  });

  it('evaluates King\'s College Hospital criteria for emergency liver transplantation', () => {
    // Arterial pH < 7.30 alone triggers criteria
    const kingsPh = evaluateKingsCollegeCriteria(7.24, 2.5, 1.2, 1, 2.0);
    expect(kingsPh.criteriaMet).toBe(true);
    expect(kingsPh.phCriterionMet).toBe(true);
    expect(kingsPh.recommendation).toContain('KING\'S COLLEGE CRITERIA MET');

    // Triad: INR > 6.5, Cr > 3.4, Grade 3/4 Encephalopathy (with pH 7.35)
    const kingsTriad = evaluateKingsCollegeCriteria(7.35, 7.2, 3.8, 3, 2.0);
    expect(kingsTriad.criteriaMet).toBe(true);
    expect(kingsTriad.triadCriteriaMet).toBe(true);

    // Negative criteria
    const kingsNegative = evaluateKingsCollegeCriteria(7.40, 1.3, 0.9, 0, 1.2);
    expect(kingsNegative.criteriaMet).toBe(false);
  });

  it('calculates NAC dosing correctly with weight cap at 100 kg and handles anaphylactoid reactions', () => {
    // 70 kg patient: Bag 1 = 150*70 = 10.5g, Bag 2 = 50*70 = 3.5g, Bag 3 = 100*70 = 7.0g (Total 21.0g)
    const nac70 = calculateNacDosing(70, false, false, 80, 45, 1.1, 0, 0);
    expect(nac70.totalNacDoseGrams).toBe(21.0);
    expect(nac70.bagDetails[0].totalDoseGrams).toBe(10.5);

    // 120 kg patient: weight capped at 100 kg -> 15g + 5g + 10g = 30g
    const nac120 = calculateNacDosing(120, false, false, 80, 45, 1.1, 0, 0);
    expect(nac120.totalNacDoseGrams).toBe(30.0);

    // Anaphylactoid reaction guidance: do NOT stop permanently
    const nacAnaphylaxis = calculateNacDosing(70, false, true, 80, 45, 1.1, 0, 1);
    expect(nacAnaphylaxis.anaphylactoidManagement).toContain('NON-IgE ANAPHYLACTOID REACTION');
    expect(nacAnaphylaxis.anaphylactoidManagement).toContain('DO NOT permanently discontinue NAC');
  });

  it('validates NAC stopping criteria and mandates continuation if criteria unmet', () => {
    // Stopped: APAP < 10, ALT 48, INR 1.2, GCS 15, completed 21 hours
    const stopped = calculateNacDosing(70, false, false, 4, 48, 1.2, 0, 21);
    expect(stopped.stoppingCriteriaMet).toBe(true);
    expect(stopped.stoppingGuidance).toContain('NAC DISCONTINUATION CRITERIA MET');

    // Unmet: APAP still 35 and INR 2.4 -> DO NOT STOP
    const continuing = calculateNacDosing(70, false, false, 35, 450, 2.4, 0, 21);
    expect(continuing.stoppingCriteriaMet).toBe(false);
    expect(continuing.stoppingGuidance).toContain('DO NOT STOP NAC');
  });

  it('accurately evaluates all preset clinical cases', () => {
    for (const preset of ACETAMINOPHEN_PRESETS) {
      const result = evaluateAcetaminophenCase(preset.input);
      expect(result.diagnosticSummary.length).toBeGreaterThan(15);
      expect(result.estimatedGlutathioneRemainingPercent).toBeGreaterThanOrEqual(5);
      expect(result.estimatedGlutathioneRemainingPercent).toBeLessThanOrEqual(100);
    }
  });
});
