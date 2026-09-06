import {
  calculateAbcScore,
  evaluateLethalTriad,
  evaluateDcrResuscitation,
  PatientTraumaVitals,
  ResuscitationFluidAdministered,
  ViscoelasticParameters,
} from '../../.gemini/skills/MassiveTransfusionDcrEngine';

describe('MassiveTransfusionDcrEngine Tests', () => {
  it('calculates ABC Score and Shock Index for gunshot wound resuscitation', () => {
    const traumaVitals: PatientTraumaVitals = {
      systolicBpMmHg: 82,
      diastolicBpMmHg: 46,
      heartRateBpm: 128,
      temperatureCelsius: 34.2,
      arterialPh: 7.18,
      baseDeficitMeqL: 9,
      hemoglobinGDl: 7.4,
      plateletCountPerUl: 85000,
      serumFibrinogenMgDl: 120,
      ionizedCalciumMmolL: 0.98,
      isPenetratingTrauma: true,
      isPositiveFastUltrasound: true,
      hasTraumaticBrainInjury: false,
    };

    const abc = calculateAbcScore(traumaVitals);
    // Penetrating (+1), SBP <= 90 (+1), HR >= 120 (+1), FAST+ (+1) = 4
    expect(abc.score).toBe(4);
    expect(abc.mtpActivationRecommended).toBe(true);
    expect(abc.shockIndex).toBe(1.56);
    expect(abc.shockIndexInterpretation).toContain('Severe Hemorrhagic Shock');
  });

  it('quantifies the Lethal Triad of hypothermia, acidosis, and coagulopathy', () => {
    const moribundVitals: PatientTraumaVitals = {
      systolicBpMmHg: 70,
      diastolicBpMmHg: 35,
      heartRateBpm: 135,
      temperatureCelsius: 33.1, // < 35.0 (+1)
      arterialPh: 7.12, // < 7.20 (+1)
      baseDeficitMeqL: 11,
      hemoglobinGDl: 6.2,
      plateletCountPerUl: 62000, // < 100k (+1)
      serumFibrinogenMgDl: 95,
      ionizedCalciumMmolL: 0.92,
      isPenetratingTrauma: false,
      isPositiveFastUltrasound: true,
      hasTraumaticBrainInjury: false,
    };

    const triad = evaluateLethalTriad(moribundVitals);
    expect(triad.lethalTriadScore).toBe(3);
    expect(triad.hypothermiaSeverity).toBe('MODERATE');
    expect(triad.acidosisSeverity).toBe('MODERATE');
    expect(triad.coagulopathySeverity).toBe('FULMINANT_HYPERFIBRINOLYSIS');
    expect(triad.predictedMortalityPercent).toBe(88);
  });

  it('evaluates Damage Control Resuscitation ratios, permissive hypotension, and citrate toxicity', () => {
    const patient: PatientTraumaVitals = {
      systolicBpMmHg: 86,
      diastolicBpMmHg: 52,
      heartRateBpm: 112,
      temperatureCelsius: 35.6,
      arterialPh: 7.28,
      baseDeficitMeqL: 5,
      hemoglobinGDl: 8.8,
      plateletCountPerUl: 95000,
      serumFibrinogenMgDl: 140,
      ionizedCalciumMmolL: 0.95, // Critically low
      isPenetratingTrauma: true,
      isPositiveFastUltrasound: true,
      hasTraumaticBrainInjury: false,
    };

    const fluids: ResuscitationFluidAdministered = {
      prbcUnits: 6,
      ffpUnits: 6,
      plateletPheresisUnits: 1, // 1 pack = matches 6 pRBC/FFP
      cryoprecipitateDoses: 1,
      crystalloidNormalSalineLiters: 2.5, // High crystalloid dilution hazard
      txaGivenWithin3Hours: false, // TXA missing!
      calciumChlorideGramsGiven: 0, // No calcium given despite 6 units blood!
    };

    const visco: ViscoelasticParameters = {
      rTimeMinutes: 12.5, // High R time -> FFP needed
      alphaAngleDegrees: 52, // Low angle -> Cryo needed
      maximumAmplitudeMm: 48, // Low MA -> Platelets
      ly30Percent: 5.4, // High LY30 -> TXA needed
    };

    const evalResult = evaluateDcrResuscitation(patient, fluids, visco);
    expect(evalResult.isBalancedRatioAchieved).toBe(true);
    expect(evalResult.crystalloidDilutionHazard).toBe(true);
    expect(evalResult.calciumCitrateAdequacy).toBe('CRITICAL_HYPOCALCEMIA_RISK');
    expect(evalResult.permissiveHypotensionAdherence).toBe('OPTIMAL');
    expect(evalResult.viscoelasticTherapyGuidance.some((g) => g.includes('Prolonged R-Time'))).toBe(true);
    expect(evalResult.viscoelasticTherapyGuidance.some((g) => g.includes('High LY30'))).toBe(true);
  });

  it('prohibits permissive hypotension when Traumatic Brain Injury (TBI) is present', () => {
    const tbiPatient: PatientTraumaVitals = {
      systolicBpMmHg: 85,
      diastolicBpMmHg: 48,
      heartRateBpm: 105,
      temperatureCelsius: 36.5,
      arterialPh: 7.36,
      baseDeficitMeqL: 3,
      hemoglobinGDl: 9.5,
      plateletCountPerUl: 160000,
      serumFibrinogenMgDl: 220,
      ionizedCalciumMmolL: 1.18,
      isPenetratingTrauma: false,
      isPositiveFastUltrasound: false,
      hasTraumaticBrainInjury: true, // TBI present
    };

    const fluids: ResuscitationFluidAdministered = {
      prbcUnits: 2,
      ffpUnits: 2,
      plateletPheresisUnits: 0.5,
      cryoprecipitateDoses: 0,
      crystalloidNormalSalineLiters: 0.5,
      txaGivenWithin3Hours: true,
      calciumChlorideGramsGiven: 1.0,
    };

    const visco: ViscoelasticParameters = {
      rTimeMinutes: 6.5,
      alphaAngleDegrees: 66,
      maximumAmplitudeMm: 62,
      ly30Percent: 1.2,
    };

    const evalResult = evaluateDcrResuscitation(tbiPatient, fluids, visco);
    expect(evalResult.permissiveHypotensionAdherence).toBe('TBI_HYPOTENSION_CONTRAINDICATED');
    expect(evalResult.clinicalRecommendations.some((r) => r.includes('forbidden in Traumatic Brain Injury'))).toBe(true);
  });
});
