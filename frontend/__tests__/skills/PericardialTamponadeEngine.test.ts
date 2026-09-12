import {
  initializeTamponadePatientState,
  deliverTemporizingBolus,
  performAgitatedSalineTest,
  positionPericardiocentesisNeedle,
  aspiratePericardialFluid,
  placePericardialDrain,
  togglePositivePressureVentilation,
  advanceTamponadeTimeStep,
  evaluateTamponadeDebrief,
  TAMPONADE_SCENARIOS,
} from '../../.gemini/skills/PericardialTamponadeEngine';

describe('PericardialTamponadeEngine', () => {
  it('initializes subacute malignant effusion with Beck\'s triad and pulsus paradoxus', () => {
    const state = initializeTamponadePatientState('SUBACUTE_MALIGNANT_EFFUSION');
    expect(state.effusion.currentEffusionVolumeMl).toBe(850);
    expect(state.pericardial.intrapericardialPressureMmHg).toBeGreaterThanOrEqual(14);
    expect(state.hemodynamics.pulsusParadoxusMmHg).toBeGreaterThanOrEqual(10);
    expect(state.hemodynamics.isPulsusParadoxusPresent).toBe(true);
    expect(state.diastolic.cvpMmHg).toBeGreaterThanOrEqual(14);
    expect(state.echo.rvDiastolicCollapse).toBe(true);
    expect(state.echo.mitralRespiratoryVariationPct).toBeGreaterThan(25);
  });

  it('demonstrates diastolic pressure equalization (|CVP - PCWP| <= 4 mmHg)', () => {
    const state = initializeTamponadePatientState('SUBACUTE_MALIGNANT_EFFUSION');
    expect(state.diastolic.isDiastolicEqualizationPresent).toBe(true);
    expect(Math.abs(state.diastolic.cvpMmHg - state.diastolic.pcwpMmHg)).toBeLessThanOrEqual(4);
    expect(state.diastolic.isCvpYDescentBlunted).toBe(true);
  });

  it('demonstrates steep elastance curve in acute hemopericardium (185 mL)', () => {
    const state = initializeTamponadePatientState('ACUTE_HEMOPERICARDIUM_ABLATION');
    expect(state.effusion.currentEffusionVolumeMl).toBe(185);
    expect(state.pericardial.intrapericardialPressureMmHg).toBeGreaterThan(15);
    expect(state.hemodynamics.mapMmHg).toBeLessThan(70);
  });

  it('delivers temporizing crystalloid bolus to augment venous return', () => {
    const initial = initializeTamponadePatientState('SUBACUTE_MALIGNANT_EFFUSION');
    const { updatedState, message } = deliverTemporizingBolus(initial, 500);
    expect(updatedState.interventions.totalCrystalloidGivenMl).toBe(500);
    expect(updatedState.diastolic.cvpMmHg).toBeGreaterThanOrEqual(initial.diastolic.cvpMmHg);
    expect(message).toContain('Administered 500 mL IV crystalloid bolus');
  });

  it('requires needle position before performing agitated saline bubble test', () => {
    const initial = initializeTamponadePatientState('SUBACUTE_MALIGNANT_EFFUSION');
    const failRes = performAgitatedSalineTest(initial);
    expect(failRes.message).toContain('Cannot perform agitated saline test');
    expect(failRes.updatedState.interventions.agitatedSalineConfirmed).toBe(false);

    const { updatedState: needlePlaced } = positionPericardiocentesisNeedle(initial, 'SUBXIPHOID');
    expect(needlePlaced.interventions.needleInPericardium).toBe(true);

    const successRes = performAgitatedSalineTest(needlePlaced);
    expect(successRes.message).toContain('Agitated saline bubble test confirmed');
    expect(successRes.updatedState.interventions.agitatedSalineConfirmed).toBe(true);
  });

  it('aspirates fluid and shifts patient leftward off the steep elastance curve', () => {
    const state = initializeTamponadePatientState('SUBACUTE_MALIGNANT_EFFUSION');
    const { updatedState: needleState } = positionPericardiocentesisNeedle(state, 'SUBXIPHOID');
    const { updatedState: tappedState, message } = aspiratePericardialFluid(needleState, 150);

    expect(tappedState.effusion.aspiratedVolumeMl).toBe(150);
    expect(tappedState.effusion.currentEffusionVolumeMl).toBe(700);
    expect(tappedState.pericardial.intrapericardialPressureMmHg).toBeLessThan(
      state.pericardial.intrapericardialPressureMmHg
    );
    expect(tappedState.hemodynamics.cardiacOutputLpm).toBeGreaterThan(
      state.hemodynamics.cardiacOutputLpm
    );
    expect(message).toContain('Aspirated 150 mL');
  });

  it('warns and blocks subxiphoid aspiration in posterior loculated hematoma', () => {
    const state = initializeTamponadePatientState('POST_CARDIAC_SURGERY_LOCULATED');
    const { updatedState, message } = positionPericardiocentesisNeedle(state, 'SUBXIPHOID');
    expect(updatedState.interventions.needleInPericardium).toBe(false);
    expect(message).toContain('WARNING: Subxiphoid needle advanced, but aspirates no fluid');
    expect(message).toContain('Surgical re-sternotomy required');
  });

  it('triggers catastrophic collapse when positive pressure ventilation with PEEP is initiated in impending tamponade', () => {
    const state = initializeTamponadePatientState('SUBACUTE_MALIGNANT_EFFUSION');
    const { updatedState, message } = togglePositivePressureVentilation(state, true, 10);
    expect(updatedState.interventions.positivePressureActive).toBe(true);
    expect(updatedState.interventions.isPeaArrest).toBe(true);
    expect(updatedState.hemodynamics.mapMmHg).toBeLessThan(40);
    expect(message).toContain('SEVERE HEMODYNAMIC COLLAPSE');

    // Disconnecting restores spontaneous breathing
    const { updatedState: recoveredState } = togglePositivePressureVentilation(updatedState, false);
    expect(recoveredState.interventions.positivePressureActive).toBe(false);
  });

  it('places indwelling pigtail drain and evacuates fluid across time steps', () => {
    const state = initializeTamponadePatientState('SUBACUTE_MALIGNANT_EFFUSION');
    const { updatedState: needleState } = positionPericardiocentesisNeedle(state, 'SUBXIPHOID');
    const { updatedState: drainState, message } = placePericardialDrain(needleState);
    expect(drainState.effusion.drainPlaced).toBe(true);
    expect(message).toContain('Pigtail pericardial drain securely placed');

    const advanced = advanceTamponadeTimeStep(drainState, 10);
    expect(advanced.effusion.currentEffusionVolumeMl).toBeLessThan(drainState.effusion.currentEffusionVolumeMl);
  });

  it('evaluates debrief score and produces structured competency report', () => {
    const state = initializeTamponadePatientState('SUBACUTE_MALIGNANT_EFFUSION');
    const { updatedState: bState } = deliverTemporizingBolus(state, 500);
    const { updatedState: nState } = positionPericardiocentesisNeedle(bState, 'SUBXIPHOID');
    const { updatedState: sState } = performAgitatedSalineTest(nState);
    const { updatedState: aState } = aspiratePericardialFluid(sState, 200);
    const { updatedState: dState } = placePericardialDrain(aState);

    const debrief = evaluateTamponadeDebrief(dState);
    expect(debrief.scorePercentage).toBeGreaterThanOrEqual(80);
    expect(['A+', 'A', 'B']).toContain(debrief.letterGrade);
    expect(debrief.beckTriadRecognized).toBe(true);
    expect(debrief.temporizingBolusDelivered).toBe(true);
    expect(debrief.pericardiocentesisSuccessful).toBe(true);
    expect(debrief.agitatedSalineVerified).toBe(true);
  });
});
