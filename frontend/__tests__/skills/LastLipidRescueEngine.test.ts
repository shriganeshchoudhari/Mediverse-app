import {
  getMaxRecommendedDoseMg,
  evaluateLastToxicity,
  LAST_PRESETS,
} from '../../.gemini/skills/LastLipidRescueEngine';

describe('LastLipidRescueEngine', () => {
  it('correctly calculates max safe weight-based doses with and without epinephrine', () => {
    // 70 kg adult
    expect(getMaxRecommendedDoseMg('BUPIVACAINE', 70, false)).toBe(140); // 2.0 mg/kg
    expect(getMaxRecommendedDoseMg('BUPIVACAINE', 70, true)).toBe(175); // 2.5 mg/kg
    expect(getMaxRecommendedDoseMg('LIDOCAINE', 70, false)).toBe(315); // 4.5 mg/kg
    expect(getMaxRecommendedDoseMg('LIDOCAINE', 70, true)).toBe(490); // 7.0 mg/kg
  });

  it('detects acute cardiovascular collapse from accidental IV Bupivacaine injection', () => {
    const collapse = evaluateLastToxicity({
      agent: 'BUPIVACAINE',
      doseAdministeredMg: 150,
      bodyWeightKg: 70,
      hasEpinephrineAdditive: false,
      intravascularAccidentalInjection: true,
      elapsedMinutesPostInjection: 3,
      lipidBolusGivenMl: 0,
      lipidInfusionRateMlMin: 0,
      lipidCumulativeDoseMl: 0,
      epinephrineDoseGivenMcg: 0,
      antiarrhythmicUsed: 'NONE',
      ecmoAlerted: false,
    });

    expect(collapse.currentPhase).toBe('CARDIOVASCULAR_COLLAPSE');
    expect(collapse.qrsDurationMs).toBeGreaterThan(120);
    expect(collapse.meanArterialPressureMmHg).toBeLessThan(60);
    expect(collapse.asraProtocolChecklist.lipidBolusRecommendedMl).toBe(105); // 1.5 mL/kg * 70
    expect(collapse.asraProtocolChecklist.maxCumulativeLipidLimitMl).toBe(840); // 12 mL/kg * 70
  });

  it('triggers warnings for contraindicated Lidocaine and excessive Epinephrine doses', () => {
    const nonCompliant = evaluateLastToxicity({
      agent: 'BUPIVACAINE',
      doseAdministeredMg: 150,
      bodyWeightKg: 70,
      hasEpinephrineAdditive: false,
      intravascularAccidentalInjection: true,
      elapsedMinutesPostInjection: 5,
      lipidBolusGivenMl: 0,
      lipidInfusionRateMlMin: 0,
      lipidCumulativeDoseMl: 0,
      epinephrineDoseGivenMcg: 1000, // Standard 1 mg ACLS dose (contraindicated in LAST!)
      antiarrhythmicUsed: 'LIDOCAINE', // Contraindicated
      ecmoAlerted: false,
    });

    expect(nonCompliant.asraProtocolChecklist.epinephrineProtocolCompliant).toBe(false);
    expect(
      nonCompliant.asraProtocolChecklist.contraindicatedDrugsTriggered.some((d) =>
        /Lidocaine must NEVER be used/i.test(d)
      )
    ).toBe(true);
    expect(
      nonCompliant.asraProtocolChecklist.contraindicatedDrugsTriggered.some((d) =>
        /High-dose Epinephrine/i.test(d)
      )
    ).toBe(true);
  });

  it('demonstrates lipid sink sequestration and post-rescue hemodynamic recovery', () => {
    const rescued = evaluateLastToxicity({
      agent: 'BUPIVACAINE',
      doseAdministeredMg: 150,
      bodyWeightKg: 70,
      hasEpinephrineAdditive: false,
      intravascularAccidentalInjection: true,
      elapsedMinutesPostInjection: 18,
      lipidBolusGivenMl: 105,
      lipidInfusionRateMlMin: 18,
      lipidCumulativeDoseMl: 300,
      epinephrineDoseGivenMcg: 50, // <= 1 mcg/kg
      antiarrhythmicUsed: 'NONE',
      ecmoAlerted: true,
    });

    expect(rescued.currentPhase).toBe('POST_RESCUE_RECOVERED');
    expect(rescued.lipidSinkSequestrationPercent).toBeGreaterThan(50);
    expect(rescued.qrsDurationMs).toBeLessThan(110);
    expect(rescued.survivalProbabilityPercent).toBeGreaterThan(80);
  });
});
