import {
  calculateLaplacePressure,
  calculateOxygenationIndex,
  evaluateNeonatalHfov,
  NEONATAL_HFOV_PRESETS,
} from '../../.gemini/skills/NeonatalHfovVentilationEngine';

describe('NeonatalHfovVentilationEngine', () => {
  it('calculates Laplace alveolar collapsing pressure accurately', () => {
    // P = (2 * gamma * 10.197) / r
    // gamma = 50 mN/m, r = 50 microns -> (2 * 50 * 10.197) / 50 = 20.4 cmH2O
    const pressure = calculateLaplacePressure(50, 50);
    expect(pressure).toBe(20.4);

    // If surface tension drops to 5 mN/m with surfactant:
    const lowPressure = calculateLaplacePressure(5, 50);
    expect(lowPressure).toBe(2.0);
  });

  it('calculates Oxygenation Index (OI) and classifies severity tiers', () => {
    // Mild: mPaw 10, FiO2 40, PaO2 60 -> (10 * 0.40 * 100) / 60 = 6.67 (Mild)
    const mild = calculateOxygenationIndex(10, 40, 60);
    expect(mild.oi).toBe(6.7);
    expect(mild.severity).toBe('MILD');

    // Severe: mPaw 20, FiO2 100, PaO2 60 -> (20 * 1.0 * 100) / 60 = 33.3 (Severe)
    const severe = calculateOxygenationIndex(20, 100, 60);
    expect(severe.oi).toBe(33.3);
    expect(severe.severity).toBe('SEVERE');

    // Critical ECMO: mPaw 22, FiO2 100, PaO2 45 -> (22 * 1.0 * 100) / 45 = 48.9 (Critical)
    const critical = calculateOxygenationIndex(22, 100, 45);
    expect(critical.oi).toBe(48.9);
    expect(critical.severity).toBe('CRITICAL_ECMO_TRIGGER');
  });

  it('demonstrates counter-intuitive HFOV frequency effect on PaCO2', () => {
    const preset = NEONATAL_HFOV_PRESETS[0]; // Extreme Preterm RDS

    // Evaluation at high frequency (14 Hz)
    const highFreq = evaluateNeonatalHfov(
      preset.demographics,
      { ...preset.hfov, frequencyHz: 14 },
      preset.surfactant,
      preset.biomechanics
    );

    // Evaluation at lower frequency (8 Hz)
    const lowFreq = evaluateNeonatalHfov(
      preset.demographics,
      { ...preset.hfov, frequencyHz: 8 },
      preset.surfactant,
      preset.biomechanics
    );

    // Lower frequency must deliver HIGHER tidal volume per cycle!
    expect(lowFreq.deliveredHfovTidalVolumeMl).toBeGreaterThan(highFreq.deliveredHfovTidalVolumeMl);

    // Higher tidal volume squared yields higher DCO2 and lower PaCO2!
    expect(lowFreq.diffusionCoefficientDco2).toBeGreaterThan(highFreq.diffusionCoefficientDco2);
    expect(lowFreq.predictedPaCO2MmHg).toBeLessThan(highFreq.predictedPaCO2MmHg);
  });

  it('demonstrates surfactant effect on compliance and oxygenation', () => {
    const preSurfactant = NEONATAL_HFOV_PRESETS[0]; // Untreated RDS
    const postSurfactant = NEONATAL_HFOV_PRESETS[1]; // Post-LISA

    const preEval = evaluateNeonatalHfov(
      preSurfactant.demographics,
      preSurfactant.hfov,
      preSurfactant.surfactant,
      preSurfactant.biomechanics
    );

    const postEval = evaluateNeonatalHfov(
      postSurfactant.demographics,
      postSurfactant.hfov,
      postSurfactant.surfactant,
      postSurfactant.biomechanics
    );

    // Post-surfactant has much better oxygenation with lower FiO2
    expect(postEval.oxygenationIndexOi).toBeLessThan(preEval.oxygenationIndexOi);
    expect(postEval.surfactantEffectSummary).toContain('Surface tension reduced');
  });

  it('detects severe PPHN and alerts for inhaled Nitric Oxide / ECMO evaluation', () => {
    const pphn = NEONATAL_HFOV_PRESETS[3]; // PPHN
    const evalResult = evaluateNeonatalHfov(
      pphn.demographics,
      pphn.hfov,
      pphn.surfactant,
      pphn.biomechanics
    );

    expect(evalResult.oiSeverity === 'SEVERE' || evalResult.oiSeverity === 'CRITICAL_ECMO_TRIGGER').toBe(true);
    expect(evalResult.alerts.some((a) => a.includes('Nitric Oxide'))).toBe(true);
  });
});
