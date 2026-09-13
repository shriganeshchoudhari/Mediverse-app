import {
  MASTER_DRUG_LIBRARY,
  calculateInfusionRate,
  evaluateDersGuardrails,
  evaluateSecondaryHydrostatics,
  computePumpStep,
  PumpChannelState
} from '../../.gemini/skills/SmartInfusionPumpEngine';

describe('SmartInfusionPumpEngine Unit Tests', () => {
  it('1. contains core high-alert medications in master drug library', () => {
    const drugs = Object.keys(MASTER_DRUG_LIBRARY);
    expect(drugs).toContain('norepinephrine');
    expect(drugs).toContain('propofol');
    expect(drugs).toContain('regular_insulin');
    expect(drugs).toContain('potassium_chloride');
    expect(drugs).toContain('heparin');
  });

  it('2. calculates weight-based mcg/kg/min infusion rate correctly', () => {
    // Norepinephrine: 16 mcg/mL concentration, 0.1 mcg/kg/min for 70 kg patient
    // total mcg/hr = 0.1 * 70 * 60 = 420 mcg/hr
    // rate = 420 / 16 = 26.25 -> 26.3 mL/hr
    const drug = MASTER_DRUG_LIBRARY['norepinephrine'];
    const rate = calculateInfusionRate(drug, 0.1, 70);
    expect(rate).toBeCloseTo(26.3, 1);
  });

  it('3. calculates insulin units/hr infusion rate correctly', () => {
    // Regular insulin 1 unit/mL, dose 6 units/hr -> 6 mL/hr
    const drug = MASTER_DRUG_LIBRARY['regular_insulin'];
    const rate = calculateInfusionRate(drug, 6.0, 80);
    expect(rate).toBe(6.0);
  });

  it('4. triggers HARD_HIGH lockout when dose exceeds hard upper ceiling', () => {
    const drug = MASTER_DRUG_LIBRARY['norepinephrine']; // hard upper is 3.0
    const evalResult = evaluateDersGuardrails(drug, 5.0);
    expect(evalResult.status).toBe('HARD_HIGH');
    expect(evalResult.severity).toBe('danger');
    expect(evalResult.allowsOverride).toBe(false);
  });

  it('5. triggers SOFT_HIGH warning when dose exceeds soft upper limit but allows override', () => {
    const drug = MASTER_DRUG_LIBRARY['norepinephrine']; // soft upper is 0.5, hard is 3.0
    const evalResult = evaluateDersGuardrails(drug, 0.8);
    expect(evalResult.status).toBe('SOFT_HIGH');
    expect(evalResult.severity).toBe('warning');
    expect(evalResult.allowsOverride).toBe(true);
  });

  it('6. verifies secondary piggyback hydrostatic height requirement (>= 24 cm)', () => {
    const adequate = evaluateSecondaryHydrostatics(30);
    expect(adequate.isPrimarySuppressed).toBe(true);
    expect(adequate.effectiveFlowSource).toBe('Secondary');

    const inadequate = evaluateSecondaryHydrostatics(15);
    expect(inadequate.isPrimarySuppressed).toBe(false);
    expect(inadequate.effectiveFlowSource).toBe('Primary_Underdosed');
  });

  it('7. models downstream occlusion pressure rise during tubing kink', () => {
    const initial: PumpChannelState = {
      channelId: 'A',
      drug: MASTER_DRUG_LIBRARY['norepinephrine'],
      programmedDose: 0.1,
      patientWeightKg: 70,
      calculatedRateMlPerHour: 26.3,
      vtbiMl: 250,
      volumeInfusedMl: 10,
      isPumping: true,
      status: 'INFUSING',
      occlusionPressurePsi: 3.0,
      occlusionLimitPsi: 10.0,
      isSecondaryActive: false,
      secondaryHeightCm: 0,
      airBubbleMicroLiters: 0,
      airAlarmThresholdMicroLiters: 50,
      overrideActive: false,
      overrideRationale: ''
    };

    let state = initial;
    for (let i = 0; i < 15; i++) {
      state = computePumpStep(state, true, false); // Tubing kinked
    }
    expect(state.occlusionPressurePsi).toBeGreaterThanOrEqual(10.0);
    expect(state.status).toBe('OCCLUDED');
  });
});
