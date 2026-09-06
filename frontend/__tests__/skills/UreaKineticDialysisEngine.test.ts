import {
  calculateWatsonVolume,
  calculateDialyzerClearance,
  calculateDaugirdasSpKtV,
  calculateEquilibratedKtV,
  calculateNormalizedPcr,
  calculateAccessRecirculation,
  computeUreaKineticState,
  DIALYSIS_PRESETS,
  DialysisPresetId,
} from '../../.gemini/skills/UreaKineticDialysisEngine';

describe('UreaKineticDialysisEngine — Daugirdas UKM & Dialysis Adequacy', () => {
  test('accurately computes Watson anthropometric volume V for males and females', () => {
    // 70 kg, 175 cm male: ~38 - 42 L
    const maleV = calculateWatsonVolume(70, 175, 'M', 55);
    expect(maleV).toBeGreaterThan(35);
    expect(maleV).toBeLessThan(45);

    // 52 kg, 155 cm female: ~26 - 31 L
    const femaleV = calculateWatsonVolume(52, 155, 'F', 55);
    expect(femaleV).toBeGreaterThan(24);
    expect(femaleV).toBeLessThan(34);
  });

  test('calculates in-vivo dialyzer urea clearance (Kd) from Qb, Qd, and KoA', () => {
    // Qb 400, Qd 600, KoA 950 -> Kd ~280 - 340 mL/min
    const kd = calculateDialyzerClearance(400, 600, 950);
    expect(kd).toBeGreaterThan(270);
    expect(kd).toBeLessThan(380);

    // Extreme boundaries
    expect(calculateDialyzerClearance(0, 500, 700)).toBe(200);
  });

  test('calculates Daugirdas second-generation spKt/V accurately', () => {
    // Pre-BUN 72, Post-BUN 21 (R = 0.291), t = 4.0 h, Pre-weight 72.5, Post-weight 70 (UF = 2.5 kg)
    const spKtV = calculateDaugirdasSpKtV(72, 21, 4.0, 72.5, 70.0);
    expect(spKtV).toBeGreaterThanOrEqual(1.4);
    expect(spKtV).toBeLessThanOrEqual(1.6);
  });

  test('evaluates equilibrated double-pool Kt/V (eKt/V) accounting for urea rebound', () => {
    const spKtV = 1.45;
    const duration = 4.0;
    const eKtV = calculateEquilibratedKtV(spKtV, duration, 'AV_FISTULA');

    // eKt/V is always less than single-pool spKt/V due to intracellular rebound
    expect(eKtV).toBeLessThan(spKtV);
    expect(eKtV).toBeGreaterThan(1.1);
  });

  test('calculates normalized Protein Catabolic Rate (nPCR)', () => {
    const npcr = calculateNormalizedPcr(72, 1.45, 4.0, 2);
    expect(npcr).toBeGreaterThan(0.9);
    expect(npcr).toBeLessThan(1.5);
  });

  test('calculates vascular access recirculation correctly', () => {
    // Systemic 80, Arterial 58, Venous 12 -> AR = (80 - 58) / (80 - 12) * 100 = 22 / 68 * 100 = ~32.4%
    const ar = calculateAccessRecirculation(80, 58, 12);
    expect(ar).toBeCloseTo(32.4, 1);
  });

  test('validates all 8 clinical presets generate sound, non-NaN biophysical states', () => {
    const presetKeys = Object.keys(DIALYSIS_PRESETS) as DialysisPresetId[];
    expect(presetKeys.length).toBe(8);

    presetKeys.forEach((key) => {
      const preset = DIALYSIS_PRESETS[key];
      const state = computeUreaKineticState(preset.initialState);

      expect(state.singlePoolKtV).toBeGreaterThan(0);
      expect(state.equilibratedKtV).toBeGreaterThan(0);
      expect(state.ureaReductionRatioPct).toBeGreaterThan(0);
      expect(state.ureaReductionRatioPct).toBeLessThanOrEqual(100);
      expect(state.ultrafiltrationRateMlKgHr).toBeGreaterThanOrEqual(0);
      expect(state.normalizedProteinCatabolicRate).toBeGreaterThan(0);
      expect(state.activeAlarms.length).toBeGreaterThan(0);
      expect(state.clinicalGuidance.length).toBeGreaterThan(10);
      expect(state.timeSeries.length).toBeGreaterThan(5);
    });
  });

  test('evaluates KDOQI Adequate High-Flux Hemodialysis preset', () => {
    const preset = DIALYSIS_PRESETS.ADEQUATE_HIGH_FLUX_HEMODIALYSIS_KDOQI;
    const state = computeUreaKineticState(preset.initialState);

    expect(state.isKdoqiAdequate).toBe(true);
    expect(state.singlePoolKtV).toBeGreaterThanOrEqual(1.2);
    expect(state.ureaReductionRatioPct).toBeGreaterThanOrEqual(65.0);
    expect(state.activeAlarms).toContain('OPTIMAL_DIALYSIS_ADEQUACY_KDOQI_COMPLIANT');
  });

  test('evaluates Underdialysis from Access Failure preset and triggers warning', () => {
    const preset = DIALYSIS_PRESETS.UNDERDIALYSIS_LOW_BLOOD_FLOW_ACCESS_FAILURE;
    const state = computeUreaKineticState(preset.initialState);

    expect(state.isKdoqiAdequate).toBe(false);
    expect(state.singlePoolKtV).toBeLessThan(1.2);
    expect(state.activeAlarms).toContain('SEVERE_UNDERDIALYSIS_BELOW_KDOQI_ADEQUACY');
  });

  test('evaluates Excessive Ultrafiltration Rate preset and triggers stunning alert', () => {
    const preset = DIALYSIS_PRESETS.EXCESSIVE_ULTRAFILTRATION_INTRA_HD_HYPOTENSION;
    const state = computeUreaKineticState(preset.initialState);

    expect(state.ultrafiltrationRateMlKgHr).toBeGreaterThan(13.0);
    expect(state.activeAlarms).toContain('EXCESSIVE_ULTRAFILTRATION_RATE_MYOCARDIAL_STUNNING_RISK');
  });

  test('evaluates Vascular Access Recirculation Needle Reversal preset', () => {
    const preset = DIALYSIS_PRESETS.ACCESS_RECIRCULATION_NEEDLE_REVERSAL;
    const state = computeUreaKineticState(preset.initialState);

    expect(state.accessRecirculationPct).toBeGreaterThan(20.0);
    expect(state.activeAlarms).toContain('PATHOLOGICAL_VASCULAR_ACCESS_RECIRCULATION_STENOSIS');
  });
});
