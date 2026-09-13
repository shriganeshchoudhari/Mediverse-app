import {
  DEFAULT_HYPOTHERMIA_PATIENT,
  simulateAccidentalHypothermia,
  HypothermiaPatientParams
} from '../../.gemini/skills/AccidentalHypothermiaEngine';

describe('AccidentalHypothermiaEngine', () => {
  it('1. classifies Stage III severe hypothermia with Osborn J waves and suppressed metabolism', () => {
    const output = simulateAccidentalHypothermia(DEFAULT_HYPOTHERMIA_PATIENT);

    expect(output.swissStage).toBe('STAGE_III_SEVERE');
    expect(output.osbornJWaveProminenceMm).toBeGreaterThan(3.0);
    expect(output.cerebralMetabolicRateFraction).toBeLessThan(0.40);
    expect(output.clinicalAlerts.some(a => a.includes('Osborn (J) wave'))).toBe(true);
  });

  it('2. enforces "No one is dead until warm and dead" dictum during hypothermic arrest', () => {
    const patient: HypothermiaPatientParams = {
      ...DEFAULT_HYPOTHERMIA_PATIENT,
      coreTemperatureCelsius: 22.0,
      cardiacRhythm: 'ASYSTOLE'
    };
    const output = simulateAccidentalHypothermia(patient);

    expect(output.warmAndDeadDictumMet).toBe(false);
    expect(output.clinicalAlerts.some(a => a.includes('NO ONE IS DEAD UNTIL WARM AND DEAD'))).toBe(true);
  });

  it('3. detects dangerous afterdrop and negative rewarming rate when extremities are actively warmed', () => {
    const patient: HypothermiaPatientParams = {
      ...DEFAULT_HYPOTHERMIA_PATIENT,
      rewarmingTechnique: 'ACTIVE_EXTERNAL_EXTREMITIES_TRAP'
    };
    const output = simulateAccidentalHypothermia(patient);

    expect(output.afterdropActive).toBe(true);
    expect(output.afterdropCoreTempFallDegrees).toBeGreaterThan(1.0);
    expect(output.effectiveRewarmingRateDegreesPerHour).toBeLessThan(0);
    expect(output.clinicalAlerts.some(a => a.includes('AFTERDROP'))).toBe(true);
  });

  it('4. detects rewarming shock when vasodilation occurs without warmed fluid resuscitation', () => {
    const patient: HypothermiaPatientParams = {
      ...DEFAULT_HYPOTHERMIA_PATIENT,
      rewarmingTechnique: 'ACTIVE_EXTERNAL_TRUNK_BAIR',
      warmIvFluidsAdministeredMl: 300,
      systolicBpMmHg: 70
    };
    const output = simulateAccidentalHypothermia(patient);

    expect(output.rewarmingShockDetected).toBe(true);
    expect(output.clinicalAlerts.some(a => a.includes('REWARMING SHOCK DETECTED'))).toBe(true);
  });

  it('5. flags epinephrine toxicity hazard in ACLS below 30°C', () => {
    const patient: HypothermiaPatientParams = {
      ...DEFAULT_HYPOTHERMIA_PATIENT,
      coreTemperatureCelsius: 27.0,
      aclsEpinephrineGivenBelow30C: true
    };
    const output = simulateAccidentalHypothermia(patient);

    expect(output.aclsWarning).toBeDefined();
    expect(output.aclsWarning).toContain('Epinephrine and antiarrhythmics are CONTRAINDICATED below 30°C');
  });

  it('6. advises doubling epinephrine dosing intervals between 30°C and 35°C', () => {
    const patient: HypothermiaPatientParams = {
      ...DEFAULT_HYPOTHERMIA_PATIENT,
      coreTemperatureCelsius: 32.5
    };
    const output = simulateAccidentalHypothermia(patient);

    expect(output.clinicalAlerts.some(a => a.includes('MODIFIED ACLS (30-35°C)'))).toBe(true);
    expect(output.clinicalAlerts.some(a => a.includes('DOUBLED'))).toBe(true);
  });

  it('7. achieves rapid 6-10°C/h rewarming and high survival prediction with ECLS / VA-ECMO', () => {
    const patient: HypothermiaPatientParams = {
      ...DEFAULT_HYPOTHERMIA_PATIENT,
      coreTemperatureCelsius: 21.0,
      rewarmingTechnique: 'EXTRACORPOREAL_ECLS_VA_ECMO'
    };
    const output = simulateAccidentalHypothermia(patient);

    expect(output.effectiveRewarmingRateDegreesPerHour).toBeGreaterThanOrEqual(6.0);
    expect(output.hopeScoreSurvivalProbabilityPercent).toBeGreaterThan(60);
    expect(output.clinicalAlerts.some(a => a.includes('ECLS / VA-ECMO CORE REWARMING'))).toBe(true);
  });

  it('8. confirms irreversible death (Stage V) when serum potassium exceeds 12 mmol/L', () => {
    const patient: HypothermiaPatientParams = {
      ...DEFAULT_HYPOTHERMIA_PATIENT,
      serumPotassiumMmolPerL: 14.2
    };
    const output = simulateAccidentalHypothermia(patient);

    expect(output.isPotassiumLethalThresholdMet).toBe(true);
    expect(output.swissStage).toBe('STAGE_V_DEATH');
    expect(output.hopeScoreSurvivalProbabilityPercent).toBe(0);
    expect(output.clinicalAlerts.some(a => a.includes('LETHAL POTASSIUM THRESHOLD EXCEEDED'))).toBe(true);
  });

  it('9. applies lower potassium death threshold (> 8 mmol/L) in avalanche asphyxia burial', () => {
    const patient: HypothermiaPatientParams = {
      ...DEFAULT_HYPOTHERMIA_PATIENT,
      initialExposureCause: 'AVALANCHE_BURIAL',
      serumPotassiumMmolPerL: 9.4
    };
    const output = simulateAccidentalHypothermia(patient);

    expect(output.isPotassiumLethalThresholdMet).toBe(true);
    expect(output.swissStage).toBe('STAGE_V_DEATH');
  });

  it('10. classifies Swiss Stage I mild hypothermia with vigorous shivering', () => {
    const patient: HypothermiaPatientParams = {
      ...DEFAULT_HYPOTHERMIA_PATIENT,
      coreTemperatureCelsius: 33.5,
      shiveringPresent: true,
      mentalStatus: 'CONSCIOUS_ALERT'
    };
    const output = simulateAccidentalHypothermia(patient);

    expect(output.swissStage).toBe('STAGE_I_MILD');
    expect(output.osbornJWaveProminenceMm).toBe(0);
    expect(output.swissStageLabel).toContain('Stage I (Mild)');
  });
});
