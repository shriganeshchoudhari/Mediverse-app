import {
  calculateCardiacPacingDynamics,
  generatePacingECGStrip,
  PACING_PRESETS,
  PacingDials,
  IntrinsicCardiacState,
} from '../../.gemini/skills/CardiacPacingEngine';

describe('CardiacPacingEngine', () => {
  const baseDials: PacingDials = {
    mode: 'VVI',
    rateBpm: 75,
    ventricularOutputMa: 5.0,
    ventricularSensitivityMv: 2.5,
    atrialOutputMa: 3.0,
    atrialSensitivityMv: 1.0,
    avDelayMs: 180,
  };

  const baseIntrinsic: IntrinsicCardiacState = {
    intrinsicAtrialRateBpm: 80,
    intrinsicVentricularRateBpm: 32,
    hasAvDissociation: true,
    intrinsicRWaveAmplitudeMv: 8.0,
    intrinsicPWaveAmplitudeMv: 1.5,
    stimulationThresholdMa: 1.0,
    atrialStimulationThresholdMa: 1.0,
    baselineQtIntervalMs: 440,
    leadDisplaced: false,
    ambientElectromagneticNoiseMv: 0.1,
  };

  it('captures ventricle in complete heart block with adequate safety margin', () => {
    const res = calculateCardiacPacingDynamics(baseDials, baseIntrinsic);

    expect(res.isCapturingVentricular).toBe(true);
    expect(res.captureStatus).toBe('FULL_CAPTURE');
    expect(res.safetyMarginMultiplier).toBe(5.0);
    expect(res.safetyMarginStatus).toBe('HIGH');
    expect(res.effectiveHeartRateBpm).toBe(75);
    expect(res.ventricularPacingPcnt).toBe(100);
  });

  it('detects Failure to Capture when output is below stimulation threshold', () => {
    const lowOutputDials: PacingDials = {
      ...baseDials,
      ventricularOutputMa: 0.8, // threshold is 1.0 mA
    };

    const res = calculateCardiacPacingDynamics(lowOutputDials, baseIntrinsic);

    expect(res.isCapturingVentricular).toBe(false);
    expect(res.captureStatus).toBe('LOSS_OF_CAPTURE');
    expect(res.safetyMarginStatus).toBe('SUBOPTIMAL');
    expect(res.effectiveHeartRateBpm).toBe(32); // reverts to native escape
    expect(res.warnings.some(w => w.includes('Failure to Capture'))).toBe(true);
  });

  it('detects Undersensing when sensitivity dial is set higher than native R-wave', () => {
    const insensitiveDials: PacingDials = {
      ...baseDials,
      ventricularSensitivityMv: 15.0, // native R-wave is only 8.0 mV!
    };

    const res = calculateCardiacPacingDynamics(insensitiveDials, baseIntrinsic);

    expect(res.sensingStatus).toBe('UNDERSENSING');
    expect(res.warnings.some(w => w.includes('Undersensing'))).toBe(true);
  });

  it('triggers R-on-T polymorphic VT / VF when undersensing coincides with fast pacing rate', () => {
    const rOnTDials: PacingDials = {
      ...baseDials,
      rateBpm: 80,
      ventricularSensitivityMv: 12.0,
    };
    const rOnTIntrinsic: IntrinsicCardiacState = {
      ...baseIntrinsic,
      intrinsicVentricularRateBpm: 65, // competing native rate
      intrinsicRWaveAmplitudeMv: 6.0,
    };

    const res = calculateCardiacPacingDynamics(rOnTDials, rOnTIntrinsic);

    expect(res.isROnTRisk).toBe(true);
    expect(res.arrhythmiaTrigger).toBe('R_ON_T_VENTRICULAR_FIBRILLATION');
    expect(res.cardiacOutputLpm).toBe(0);
    expect(res.meanArterialPressureMmHg).toBe(12);
  });

  it('detects Oversensing and triggers asystolic pause when dial picks up EMI noise', () => {
    const oversensingDials: PacingDials = {
      ...baseDials,
      ventricularSensitivityMv: 0.5, // hyper-sensitive dial
    };
    const noisyIntrinsic: IntrinsicCardiacState = {
      ...baseIntrinsic,
      ambientElectromagneticNoiseMv: 0.8, // noise > dial sensitivity
      intrinsicVentricularRateBpm: 15,
    };

    const res = calculateCardiacPacingDynamics(oversensingDials, noisyIntrinsic);

    expect(res.sensingStatus).toBe('OVERSENSING');
    expect(res.arrhythmiaTrigger).toBe('ASYSTOLIC_PAUSE');
    expect(res.warnings.some(w => w.includes('Oversensing'))).toBe(true);
  });

  it('flags Pacemaker Syndrome in VVI mode with AV dissociation and cannon A waves', () => {
    const res = calculateCardiacPacingDynamics(baseDials, baseIntrinsic);

    expect(res.pacemakerSyndromeActive).toBe(true);
    expect(res.cannonAWavesPresent).toBe(true);
    expect(res.strokeVolumeMl).toBe(55); // dropped from 75 mL
    expect(res.warnings.some(w => w.includes('PACEMAKER SYNDROME'))).toBe(true);
  });

  it('relieves Pacemaker Syndrome and restores stroke volume when switched to DDD mode', () => {
    const dddDials: PacingDials = {
      ...baseDials,
      mode: 'DDD',
    };

    const res = calculateCardiacPacingDynamics(dddDials, baseIntrinsic);

    expect(res.pacemakerSyndromeActive).toBe(false);
    expect(res.cannonAWavesPresent).toBe(false);
    expect(res.strokeVolumeMl).toBe(75); // restored atrial kick
    expect(res.cardiacOutputLpm).toBe(5.6);
  });

  it('warns about asynchronous competitive pacing in VOO mode', () => {
    const vooDials: PacingDials = {
      ...baseDials,
      mode: 'VOO',
    };

    const res = calculateCardiacPacingDynamics(vooDials, baseIntrinsic);

    expect(res.isROnTRisk).toBe(true);
    expect(res.warnings.some(w => w.includes('Asynchronous mode'))).toBe(true);
  });

  it('synthesizes 6-second ECG strip with exactly 1500 samples and correct pacing spikes', () => {
    const simResult = calculateCardiacPacingDynamics(baseDials, baseIntrinsic);
    const strip = generatePacingECGStrip(baseDials, baseIntrinsic, simResult);

    expect(strip.length).toBe(1500); // 6.0 seconds * 250 Hz
    expect(strip[0].timeSec).toBe(0);
    expect(strip[strip.length - 1].timeSec).toBe(5.996);
    expect(strip.some(p => p.isPacingSpike)).toBe(true);
  });

  it('verifies all 6 high-yield presets produce clinically consistent simulations', () => {
    expect(PACING_PRESETS.length).toBe(6);

    for (const preset of PACING_PRESETS) {
      const res = calculateCardiacPacingDynamics(preset.dials, preset.intrinsicState);
      expect(typeof res.effectiveHeartRateBpm).toBe('number');
      expect(typeof res.cardiacOutputLpm).toBe('number');
      expect(preset.clinicalExplanation.length).toBeGreaterThan(20);
    }
  });
});
