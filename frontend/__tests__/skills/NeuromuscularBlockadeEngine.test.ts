import {
  calculateNeuromuscularState,
  formulateReversalPlan,
  NeuromuscularPatientParameters,
} from '../../.gemini/skills/NeuromuscularBlockadeEngine';

describe('NeuromuscularBlockadeEngine Tests', () => {
  it('correctly determines deep block and PTC after high-dose rocuronium', () => {
    const patient: NeuromuscularPatientParameters = {
      weightKg: 70,
      nmbaDrug: 'ROCURONIUM',
      doseMgPerKg: 1.0,
      minutesSinceDosing: 25,
      coreTemperatureCelsius: 36.8,
      hasEndStageRenalDisease: false,
      hasSevereHepaticFailure: false,
      isTakingMagnesiumOrAminoglycoside: false,
    };

    const state = calculateNeuromuscularState(patient);
    expect(state.depth).toBe('DEEP_BLOCK');
    expect(state.twitchCount).toBe(0);
    expect(state.postTetanicCount).toBeGreaterThanOrEqual(1);
    expect(state.safeForExtubation).toBe(false);
  });

  it('verifies non-depolarizing fade kinetics and TOF ratio recovery threshold', () => {
    const recoveredPatient: NeuromuscularPatientParameters = {
      weightKg: 80,
      nmbaDrug: 'ROCURONIUM',
      doseMgPerKg: 0.6,
      minutesSinceDosing: 95,
      coreTemperatureCelsius: 36.8,
      hasEndStageRenalDisease: false,
      hasSevereHepaticFailure: false,
      isTakingMagnesiumOrAminoglycoside: false,
    };

    const state = calculateNeuromuscularState(recoveredPatient);
    expect(state.depth).toBe('FULL_RECOVERY');
    expect(state.twitchCount).toBe(4);
    expect(state.tofRatio).toBeGreaterThanOrEqual(0.9);
    expect(state.safeForExtubation).toBe(true);
    expect(state.residualParalysisRisk).toBe('NONE');
  });

  it('formulates deep block Sugammadex dose (4 mg/kg) vs moderate block dose (2 mg/kg)', () => {
    const deepPatient: NeuromuscularPatientParameters = {
      weightKg: 75,
      nmbaDrug: 'ROCURONIUM',
      doseMgPerKg: 0.6,
      minutesSinceDosing: 28,
      coreTemperatureCelsius: 36.8,
      hasEndStageRenalDisease: false,
      hasSevereHepaticFailure: false,
      isTakingMagnesiumOrAminoglycoside: false,
    };

    const deepState = calculateNeuromuscularState(deepPatient);
    const deepPlan = formulateReversalPlan(deepPatient, deepState);

    expect(deepPlan.recommendedAgent).toBe('SUGAMMADEX');
    expect(deepPlan.reversalDosePerKg).toBe(4.0);
    expect(deepPlan.reversalDoseMg).toBe(300); // 4 * 75
    expect(deepPlan.clinicalSafetyAlerts.some((a) => a.includes('CONTRACEPTIVE WARNING'))).toBe(true);
  });

  it('recognizes Sugammadex ineffectiveness for Cisatracurium and mandates Neostigmine', () => {
    const cisPatient: NeuromuscularPatientParameters = {
      weightKg: 70,
      nmbaDrug: 'CISATRACURIUM',
      doseMgPerKg: 0.15,
      minutesSinceDosing: 55,
      coreTemperatureCelsius: 36.8,
      hasEndStageRenalDisease: true, // Cisatracurium safe in ESRD
      hasSevereHepaticFailure: false,
      isTakingMagnesiumOrAminoglycoside: false,
    };

    const cisState = calculateNeuromuscularState(cisPatient);
    const cisPlan = formulateReversalPlan(cisPatient, cisState);

    expect(cisPlan.isSugammadexContraindicatedOrIneffective).toBe(true);
    expect(cisPlan.recommendedAgent).toBe('NEOSTIGMINE_GLYCOPYRROLATE');
    expect(cisPlan.adjunctGlycopyrrolateMg).toBeGreaterThan(0);
    expect(
      cisPlan.clinicalSafetyAlerts.some((a) => a.includes('SUGAMMADEX IS ENTIRELY INEFFECTIVE'))
    ).toBe(true);
  });

  it('handles emergency CICO 16 mg/kg Sugammadex rescue reversal', () => {
    const cicoPatient: NeuromuscularPatientParameters = {
      weightKg: 80,
      nmbaDrug: 'ROCURONIUM',
      doseMgPerKg: 1.2,
      minutesSinceDosing: 5,
      coreTemperatureCelsius: 36.8,
      hasEndStageRenalDisease: false,
      hasSevereHepaticFailure: false,
      isTakingMagnesiumOrAminoglycoside: false,
    };

    const cicoState = calculateNeuromuscularState(cicoPatient);
    const cicoPlan = formulateReversalPlan(cicoPatient, cicoState, true);

    expect(cicoPlan.reversalDosePerKg).toBe(16.0);
    expect(cicoPlan.reversalDoseMg).toBe(1280); // 16 * 80
    expect(cicoPlan.estimatedTimeToTof90Minutes).toBeLessThanOrEqual(2.0);
  });
});
