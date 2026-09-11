/**
 * ArdsMechanicsEngine.test.ts
 * Unit tests for Berlin ARDS definition, PBW calculations, driving pressure,
 * respiratory compliance, mechanical power, and PROSEVA/EOLIA escalation.
 */

import {
  calculatePredictedBodyWeight,
  calculatePfRatio,
  classifyBerlinArds,
  calculateRespiratoryCompliance,
  calculateDrivingPressure,
  calculateMechanicalPower,
  estimateArdsSubphenotype,
  evaluateProneEligibility,
  evaluateEcmoEligibility,
  computeArdsMechanics,
  ARDS_PRESETS,
} from '../../.gemini/skills/ArdsMechanicsEngine';

describe('ArdsMechanicsEngine Biophysics & Clinical Rules', () => {
  it('correctly calculates ARDSNet Predicted Body Weight for male and female patients', () => {
    // Male 178 cm: 50 + 0.91 * (178 - 152.4) = 50 + 0.91 * 25.6 = 50 + 23.3 = 73.3 kg
    const malePbw = calculatePredictedBodyWeight('MALE', 178);
    expect(malePbw).toBeCloseTo(73.3, 1);

    // Female 162 cm: 45.5 + 0.91 * (162 - 152.4) = 45.5 + 0.91 * 9.6 = 45.5 + 8.7 = 54.2 kg
    const femalePbw = calculatePredictedBodyWeight('FEMALE', 162);
    expect(femalePbw).toBeCloseTo(54.2, 1);
  });

  it('accurately computes PaO2/FiO2 ratio and classifies Berlin Definition severity', () => {
    // PaO2 60 on FiO2 80% (0.8) -> P/F 75 -> Severe ARDS
    const pfSevere = calculatePfRatio(60, 80);
    expect(pfSevere).toBe(75);
    expect(classifyBerlinArds(pfSevere, 12, true, true)).toBe('SEVERE_ARDS');

    // PaO2 85 on FiO2 50% (0.5) -> P/F 170 -> Moderate ARDS
    const pfMod = calculatePfRatio(85, 50);
    expect(pfMod).toBe(170);
    expect(classifyBerlinArds(pfMod, 8, true, true)).toBe('MODERATE_ARDS');

    // PaO2 100 on FiO2 40% (0.4) -> P/F 250 -> Mild ARDS
    const pfMild = calculatePfRatio(100, 40);
    expect(pfMild).toBe(250);
    expect(classifyBerlinArds(pfMild, 5, true, true)).toBe('MILD_ARDS');

    // PEEP < 5 invalidates Berlin ARDS classification
    expect(classifyBerlinArds(150, 4, true, true)).toBe('NONE_OR_AT_RISK');
  });

  it('calculates Static Respiratory Compliance and Driving Pressure with clinical risk stratification', () => {
    // Vt 500 mL, Pplat 34, PEEP 14 -> Delta P = 20 cmH2O (Critical), Crs = 500 / 20 = 25 mL/cmH2O
    const dp = calculateDrivingPressure(34, 14);
    expect(dp.drivingPressure).toBe(20);
    expect(dp.risk).toBe('CRITICAL_LUNG_STRESS');

    const crs = calculateRespiratoryCompliance(500, 34, 14);
    expect(crs).toBe(25);

    // Optimized: Pplat 22, PEEP 10 -> Delta P = 12 cmH2O (Safe)
    const dpSafe = calculateDrivingPressure(22, 10);
    expect(dpSafe.drivingPressure).toBe(12);
    expect(dpSafe.risk).toBe('SAFE_LOW_STRESS');
  });

  it('computes Mechanical Power using Gattinoni equation and flags ergotrauma threshold', () => {
    // RR 28, Vt 520 mL (0.52 L), Ppeak 42, Delta P 20
    // MP = 0.098 * 28 * 0.52 * (42 - 10) = 0.098 * 28 * 0.52 * 32 = 45.6 J/min -> High VILI
    const mp = calculateMechanicalPower(28, 520, 42, 20);
    expect(mp.powerJoulesMin).toBeGreaterThan(24);
    expect(mp.risk).toBe('ERGOTRAUMA_HIGH_VILI');

    // RR 18, Vt 325 mL (0.325 L), Ppeak 24, Delta P 10
    // MP = 0.098 * 18 * 0.325 * (24 - 5) = 0.098 * 18 * 0.325 * 19 = 10.9 J/min -> Safe
    const mpSafe = calculateMechanicalPower(18, 325, 24, 10);
    expect(mpSafe.powerJoulesMin).toBeLessThan(17);
    expect(mpSafe.risk).toBe('SAFE');
  });

  it('evaluates PROSEVA Prone Positioning and EOLIA ECMO eligibility criteria', () => {
    // P/F 120 on PEEP 12, FiO2 80% -> Prone Indicated
    expect(evaluateProneEligibility(120, 12, 80)).toBe(true);

    // P/F 180 -> Not prone eligible
    expect(evaluateProneEligibility(180, 12, 80)).toBe(false);

    // P/F 48 on FiO2 100% -> ECMO eligible
    expect(evaluateEcmoEligibility(48, 7.20, 32)).toBe(true);

    // pH 7.12 with Pplat 30 -> ECMO eligible for severe respiratory acidosis
    expect(evaluateEcmoEligibility(110, 7.12, 30)).toBe(true);
  });

  it('estimates Calfee Hyper-inflammatory Phenotype 2', () => {
    // Acidotic (HCO3 15), vasopressors needed, P/F 110 -> Phenotype 2
    const sub = estimateArdsSubphenotype(15, true, 110);
    expect(sub).toBe('HYPER_INFLAMMATORY_PHENOTYPE_2');

    // Preserved HCO3 24, no vasopressors, P/F 180 -> Phenotype 1
    const sub1 = estimateArdsSubphenotype(24, false, 180);
    expect(sub1).toBe('HYPO_INFLAMMATORY_PHENOTYPE_1');
  });

  it('computes all standard ARDS presets successfully', () => {
    for (const preset of ARDS_PRESETS) {
      const result = computeArdsMechanics(preset.input);
      expect(result.predictedBodyWeightKg).toBeGreaterThan(40);
      expect(result.tidalVolumeMlPerKgPbw).toBeGreaterThan(0);
      expect(result.ventilatorOptimizationRecommendations.length).toBeGreaterThan(0);
      expect(result.diagnosticSummary.length).toBeGreaterThan(15);
    }
  });
});
