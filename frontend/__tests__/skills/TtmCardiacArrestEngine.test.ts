import {
  evaluateTtmCase,
  TTM_PRESETS,
} from '../../.gemini/skills/TtmCardiacArrestEngine';

describe('TtmCardiacArrestEngine', () => {
  it('correctly calculates CMRO2 reduction and shivering metabolic surge during 33°C maintenance', () => {
    // 33.0 °C is 4.0 °C below 37.0 -> 4.0 * 7% = 28% reduction in CMRO2
    // BSAS 2 -> +120% surge in oxygen consumption
    const maintenance = evaluateTtmCase({
      targetProtocol: 'TARGET_33C',
      currentCoreTempC: 33.0,
      hoursPostRosc: 12,
      shiveringScoreBsas: 2,
      rewarmingRateCDegPerHour: 0.20,
      pupillaryCornealReflexesBilateralAbsent: false,
      ssepN20BilateralAbsent: false,
      eegSuppressionOrBurstSuppression: false,
      serumNse48to72hUgL: 22,
      ctGrayWhiteRatioGwr: 1.25,
      sedationClearedForAssessment: false,
    });

    expect(maintenance.currentPhase).toBe('MAINTENANCE');
    expect(maintenance.cmro2ReductionPercent).toBe(28);
    expect(maintenance.shiveringMetabolicSurgePercent).toBe(120);
    expect(maintenance.electrolyteRisk.potassiumShiftTendency).toBe('INTRACELLULAR_HYPOKALEMIA');
    expect(maintenance.clinicalActionChecklist.some((a) => /SHIVERING ALERT/i.test(a))).toBe(true);
  });

  it('detects hazardous rapid rewarming and alerts for hyperkalemic surge', () => {
    // Rewarming at 0.50 °C/hr > 0.25 °C/hr threshold
    const rapidRewarm = evaluateTtmCase({
      targetProtocol: 'TARGET_33C',
      currentCoreTempC: 35.2,
      hoursPostRosc: 32,
      shiveringScoreBsas: 0,
      rewarmingRateCDegPerHour: 0.50,
      pupillaryCornealReflexesBilateralAbsent: false,
      ssepN20BilateralAbsent: false,
      eegSuppressionOrBurstSuppression: false,
      serumNse48to72hUgL: 28,
      ctGrayWhiteRatioGwr: 1.20,
      sedationClearedForAssessment: false,
    });

    expect(rapidRewarm.currentPhase).toBe('CONTROLLED_REWARMING');
    expect(rapidRewarm.rewarmingSafetyAssessment).toBe('HAZARDOUS_RAPID_REWARMING');
    expect(rapidRewarm.electrolyteRisk.potassiumShiftTendency).toBe('REWARMING_HYPERKALEMIA_SURGE');
    expect(rapidRewarm.clinicalActionChecklist.some((a) => /RAPID REWARMING WARNING/i.test(a))).toBe(true);
  });

  it('evaluates multimodal neuroprognostication at >= 72h indicating high likelihood of poor outcome', () => {
    const poorOutcome = evaluateTtmCase({
      targetProtocol: 'TARGET_36C',
      currentCoreTempC: 37.0,
      hoursPostRosc: 76,
      shiveringScoreBsas: 0,
      rewarmingRateCDegPerHour: 0.20,
      pupillaryCornealReflexesBilateralAbsent: true,
      ssepN20BilateralAbsent: true,
      eegSuppressionOrBurstSuppression: true,
      serumNse48to72hUgL: 85,
      ctGrayWhiteRatioGwr: 1.06,
      sedationClearedForAssessment: true,
    });

    expect(poorOutcome.neuroprognostication.isPrognosticationTimingValid).toBe(true);
    expect(poorOutcome.neuroprognostication.concordantMalignantMarkersCount).toBeGreaterThanOrEqual(5);
    expect(poorOutcome.neuroprognostication.prognosticationVerdict).toBe(
      'HIGH_LIKELIHOOD_POOR_NEUROLOGICAL_OUTCOME'
    );
    expect(poorOutcome.neuroprognostication.poorOutcomeProbabilityPercent).toBeGreaterThan(90);
  });

  it('evaluates favorable recovery potential when reflexes and SSEPs are intact at 74h', () => {
    const favorable = evaluateTtmCase({
      targetProtocol: 'TARGET_36C',
      currentCoreTempC: 36.8,
      hoursPostRosc: 74,
      shiveringScoreBsas: 0,
      rewarmingRateCDegPerHour: 0.20,
      pupillaryCornealReflexesBilateralAbsent: false,
      ssepN20BilateralAbsent: false,
      eegSuppressionOrBurstSuppression: false,
      serumNse48to72hUgL: 15,
      ctGrayWhiteRatioGwr: 1.28,
      sedationClearedForAssessment: true,
    });

    expect(favorable.neuroprognostication.isPrognosticationTimingValid).toBe(true);
    expect(favorable.neuroprognostication.prognosticationVerdict).toBe(
      'FAVORABLE_RECOVERY_POTENTIAL'
    );
    expect(favorable.neuroprognostication.poorOutcomeProbabilityPercent).toBeLessThan(20);
  });

  it('rejects premature neuroprognostication before 72 hours', () => {
    const premature = evaluateTtmCase({
      targetProtocol: 'TARGET_33C',
      currentCoreTempC: 33.0,
      hoursPostRosc: 24, // only 24h
      shiveringScoreBsas: 0,
      rewarmingRateCDegPerHour: 0.20,
      pupillaryCornealReflexesBilateralAbsent: true,
      ssepN20BilateralAbsent: true,
      eegSuppressionOrBurstSuppression: true,
      serumNse48to72hUgL: 70,
      ctGrayWhiteRatioGwr: 1.08,
      sedationClearedForAssessment: false,
    });

    expect(premature.neuroprognostication.isPrognosticationTimingValid).toBe(false);
    expect(premature.neuroprognostication.prognosticationVerdict).toBe(
      'INSUFFICIENT_DATA_EARLY'
    );
    expect(premature.clinicalActionChecklist.some((a) => /PROGNOSTICATION TIMING/i.test(a))).toBe(true);
  });
});
