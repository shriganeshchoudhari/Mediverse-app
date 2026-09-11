/**
 * DkaHhsEngine.test.ts
 * Unit tests for DKA/HHS calculations, Potassium Gate safety interlock,
 * Two-Bag titration, and Cerebral Edema risk evaluation.
 */

import {
  calculateCorrectedSodium,
  calculateEffectiveOsmolality,
  calculateTotalOsmolality,
  calculateAnionGap,
  calculateWaterDeficitLiters,
  classifyGlycemicCrisis,
  evaluatePotassiumGate,
  evaluateTwoBagInfusion,
  evaluateCerebralEdemaRisk,
  evaluateDkaResolution,
  computeDkaHhsState,
  DKA_HHS_PRESETS,
} from '../../.gemini/skills/DkaHhsEngine';

describe('DkaHhsEngine Calculations & Biophysics', () => {
  it('correctly calculates corrected sodium using Katz and Hillier factors', () => {
    // Normal glucose (100) -> no correction
    expect(calculateCorrectedSodium(140, 100)).toBe(140);

    // Glucose 300 (factor 1.6): 130 + 1.6 * 2 = 133.2
    expect(calculateCorrectedSodium(130, 300)).toBe(133.2);

    // Glucose 600 (> 400 uses factor 2.0): 130 + 2.0 * 5 = 140
    expect(calculateCorrectedSodium(130, 600)).toBe(140);
  });

  it('correctly calculates effective osmolality, total osmolality, and anion gap', () => {
    // Effective Osm: 2 * 135 + 360 / 18 = 270 + 20 = 290
    const effOsm = calculateEffectiveOsmolality(135, 360);
    expect(effOsm).toBe(290);

    // Total Osm with BUN 28: 290 + 28 / 2.8 = 300
    const totOsm = calculateTotalOsmolality(135, 360, 28);
    expect(totOsm).toBe(300);

    // Anion gap: 135 - (98 + 12) = 25
    const ag = calculateAnionGap(135, 98, 12);
    expect(ag).toBe(25);
  });

  it('strictly enforces the Potassium Gate safety interlock', () => {
    // Severe Hypokalemia (K = 2.9 mEq/L) -> MUST HOLD INSULIN
    const gateLow = evaluatePotassiumGate(2.9);
    expect(gateLow.status).toBe('HOLD_INSULIN_CRITICAL');
    expect(gateLow.action).toContain('HOLD INSULIN INFUSION IMMEDIATELY');

    // Safe range (K = 4.2 mEq/L) -> Permit insulin and replete K+
    const gateMid = evaluatePotassiumGate(4.2);
    expect(gateMid.status).toBe('PERMIT_INSULIN_REPLETE_K');
    expect(gateMid.action).toContain('SAFE FOR INSULIN INFUSION');
    expect(gateMid.action).toContain('Add 20-30 mEq K+');

    // Hyperkalemic (K = 5.6 mEq/L) -> Permit insulin and hold IV K+
    const gateHigh = evaluatePotassiumGate(5.6);
    expect(gateHigh.status).toBe('PERMIT_INSULIN_HOLD_K');
    expect(gateHigh.action).toContain('DO NOT add potassium to IV fluids');
  });

  it('evaluates Two-Bag System titration ratios and delivered dextrose concentration', () => {
    // 100 mL/h Bag 1 (0% Dextrose) + 100 mL/h Bag 2 (10% Dextrose) = 5% Dextrose delivered
    const split50 = evaluateTwoBagInfusion(100, 100, 180, 16, 'SEVERE_DKA');
    expect(split50.totalRateMlH).toBe(200);
    expect(split50.deliveredDextrosePercent).toBe(5);
    expect(split50.dextroseDeliveryRateGH).toBe(10); // 100 mL/h * 0.1 g/mL = 10 g/h
    expect(split50.recommendation).toContain('EXCELLENT TWO-BAG TITRATION');

    // Glucose <= 200 with elevated anion gap and inadequate Bag 2 (< 4% Dextrose) triggers warning
    const underDextrose = evaluateTwoBagInfusion(200, 20, 180, 18, 'SEVERE_DKA');
    expect(underDextrose.deliveredDextrosePercent).toBeLessThan(4);
    expect(underDextrose.recommendation).toContain('CRITICAL TITRATION');
  });

  it('detects Cerebral Edema Risk in pediatric patients with precipitous drop and provides rescue therapy', () => {
    // 14 yo with 110 mg/dL/h drop -> HIGH risk
    const riskHigh = evaluateCerebralEdemaRisk(110, 310, 14, 7.05, 13);
    expect(riskHigh.level).toBe('HIGH');
    expect(riskHigh.warning).toContain('HIGH CEREBRAL EDEMA RISK');
    expect(riskHigh.rescueTreatment).toContain('3% Hypertonic Saline');

    // GCS <= 9 -> IMMINENT HERNIATION
    const riskHerniation = evaluateCerebralEdemaRisk(80, 320, 16, 6.95, 8);
    expect(riskHerniation.level).toBe('IMMINENT_HERNIATION');
    expect(riskHerniation.rescueTreatment).toContain('3% Hypertonic Saline');
    expect(riskHerniation.rescueTreatment).toContain('Mannitol');
  });

  it('validates DKA resolution criteria and mandates subcutaneous basal overlap before IV shutoff', () => {
    // Glucose 180, HCO3 19, pH 7.35, AG 10, bOHB 0.6 -> ALL CRITERIA MET
    const res = evaluateDkaResolution(180, 19, 7.35, 10, 0.6);
    expect(res.isResolved).toBe(true);
    expect(res.passedCriteria.length).toBeGreaterThanOrEqual(3);
    expect(res.subqBridgeGuidance).toContain('2 to 4 HOURS BEFORE discontinuing');

    // Glucose 220 (not < 200) -> NOT RESOLVED
    const notRes = evaluateDkaResolution(220, 19, 7.35, 10, 0.6);
    expect(notRes.isResolved).toBe(false);
  });

  it('accurately computes full preset scenarios', () => {
    for (const preset of DKA_HHS_PRESETS) {
      const state = computeDkaHhsState(preset.input);
      expect(state.diagnosticSummary.length).toBeGreaterThan(10);
      expect(state.correctedSodiumMeqL).toBeGreaterThan(100);
      expect(state.effectiveOsmolalityMOsmKg).toBeGreaterThan(200);
    }
  });
});
