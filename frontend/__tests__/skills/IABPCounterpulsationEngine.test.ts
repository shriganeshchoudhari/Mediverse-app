import {
  calculateIABPDynamics,
  generateIABPArterialWaveform,
  IABP_PRESETS,
  IABPPumpSettings,
  PatientHemodynamics,
} from '../../.gemini/skills/IABPCounterpulsationEngine';

describe('IABPCounterpulsationEngine', () => {
  const basePump: IABPPumpSettings = {
    assistRatio: '1:2',
    triggerMode: 'ECG',
    balloonVolumeCc: 40,
    inflationTimingOffsetMs: 0,
    deflationTimingOffsetMs: 0,
    frequencyHz: 1.0,
  };

  const basePatient: PatientHemodynamics = {
    heartRateBpm: 75,
    systolicBloodPressureMmHg: 95,
    diastolicBloodPressureMmHg: 55,
    systemicVascularResistanceDynes: 1400,
    strokeVolumeMl: 45,
    coronaryStenosisPercent: 70,
    aorticRegurgitationGrade: 'NONE',
  };

  it('calculates optimal 1:2 counterpulsation with PDP > PSP, BAEDP < PAEDP, and APSP < PSP', () => {
    const res = calculateIABPDynamics(basePump, basePatient);

    expect(res.timingClassification).toBe('OPTIMAL');
    expect(res.peakDiastolicAugmentedPressureMmHg).toBeGreaterThan(res.unassistedSystolicPressureMmHg);
    expect(res.balloonAorticEndDiastolicPressureMmHg).toBeLessThan(res.patientAorticEndDiastolicPressureMmHg);
    expect(res.assistedSystolicPressureMmHg).toBeLessThan(res.unassistedSystolicPressureMmHg);
    expect(res.coronaryPerfusionEnhancementPcnt).toBeGreaterThan(0);
    expect(res.leftVentricularAfterloadReductionPcnt).toBeGreaterThan(0);
    expect(res.myocardialOxygenBalanceRatio).toBeGreaterThan(1.0);
  });

  it('detects Early Inflation error when inflation offset is < -40 ms', () => {
    const earlyPump: IABPPumpSettings = {
      ...basePump,
      inflationTimingOffsetMs: -65,
    };

    const res = calculateIABPDynamics(earlyPump, basePatient);

    expect(res.timingClassification).toBe('EARLY_INFLATION');
    expect(res.leftVentricularAfterloadReductionPcnt).toBeLessThan(0); // Afterload increased
    expect(res.warnings.some(w => w.includes('Early Inflation'))).toBe(true);
  });

  it('detects Late Inflation error when inflation offset is > 40 ms', () => {
    const lateInflPump: IABPPumpSettings = {
      ...basePump,
      inflationTimingOffsetMs: 60,
    };

    const res = calculateIABPDynamics(lateInflPump, basePatient);

    expect(res.timingClassification).toBe('LATE_INFLATION');
    expect(res.coronaryPerfusionEnhancementPcnt).toBeLessThan(
      calculateIABPDynamics(basePump, basePatient).coronaryPerfusionEnhancementPcnt
    );
    expect(res.warnings.some(w => w.includes('Late Inflation'))).toBe(true);
  });

  it('detects Early Deflation error when deflation offset is < -50 ms', () => {
    const earlyDeflPump: IABPPumpSettings = {
      ...basePump,
      deflationTimingOffsetMs: -70,
    };

    const res = calculateIABPDynamics(earlyDeflPump, basePatient);

    expect(res.timingClassification).toBe('EARLY_DEFLATION');
    expect(res.leftVentricularAfterloadReductionPcnt).toBeLessThan(5);
    expect(res.warnings.some(w => w.includes('Early Deflation'))).toBe(true);
  });

  it('detects Late Deflation error and flags elevated APSP > PSP afterload penalty', () => {
    const lateDeflPump: IABPPumpSettings = {
      ...basePump,
      deflationTimingOffsetMs: 65,
    };

    const res = calculateIABPDynamics(lateDeflPump, basePatient);

    expect(res.timingClassification).toBe('LATE_DEFLATION');
    expect(res.assistedSystolicPressureMmHg).toBeGreaterThan(res.unassistedSystolicPressureMmHg);
    expect(res.leftVentricularAfterloadReductionPcnt).toBeLessThan(0);
    expect(res.warnings.some(w => w.includes('Late Deflation'))).toBe(true);
  });

  it('scales hemodynamics between 1:1, 1:2, and 1:3 assist ratios', () => {
    const res1 = calculateIABPDynamics({ ...basePump, assistRatio: '1:1' }, basePatient);
    const res2 = calculateIABPDynamics({ ...basePump, assistRatio: '1:2' }, basePatient);
    const res3 = calculateIABPDynamics({ ...basePump, assistRatio: '1:3' }, basePatient);

    expect(res1.coronaryPerfusionEnhancementPcnt).toBeGreaterThan(res2.coronaryPerfusionEnhancementPcnt);
    expect(res2.coronaryPerfusionEnhancementPcnt).toBeGreaterThan(res3.coronaryPerfusionEnhancementPcnt);
  });

  it('enhances augmentation with 50cc balloon volume over 30cc', () => {
    const res50 = calculateIABPDynamics({ ...basePump, balloonVolumeCc: 50 }, basePatient);
    const res30 = calculateIABPDynamics({ ...basePump, balloonVolumeCc: 30 }, basePatient);

    expect(res50.peakDiastolicAugmentedPressureMmHg).toBeGreaterThan(res30.peakDiastolicAugmentedPressureMmHg);
  });

  it('flags Aortic Regurgitation as an absolute contraindication', () => {
    const arPatient: PatientHemodynamics = {
      ...basePatient,
      aorticRegurgitationGrade: 'MODERATE',
    };

    const res = calculateIABPDynamics(basePump, arPatient);

    expect(res.contraindicationsDetected.length).toBeGreaterThan(0);
    expect(res.contraindicationsDetected[0]).toContain('Aortic Regurgitation');
  });

  it('generates 8-second waveform with 2000 points and distinct landmarks', () => {
    const simResult = calculateIABPDynamics(basePump, basePatient);
    const waveform = generateIABPArterialWaveform(basePump, basePatient, simResult);

    expect(waveform.length).toBe(2000); // 8 seconds * 250 Hz
    expect(waveform[0].timeSec).toBe(0);
    expect(waveform[waveform.length - 1].timeSec).toBe(7.996);

    const hasPDP = waveform.some(p => p.landmark === 'PDP');
    const hasDicrotic = waveform.some(p => p.landmark === 'DICROTIC');
    expect(hasPDP).toBe(true);
    expect(hasDicrotic).toBe(true);
  });

  it('verifies all 6 high-yield presets evaluate properly', () => {
    expect(IABP_PRESETS.length).toBe(6);

    for (const preset of IABP_PRESETS) {
      const res = calculateIABPDynamics(preset.pumpSettings, preset.patientHemodynamics);
      expect(typeof res.cardiacOutputLpm).toBe('number');
      expect(typeof res.meanArterialPressureMmHg).toBe('number');
      expect(preset.educationalTakeaway.length).toBeGreaterThan(20);
    }
  });
});
