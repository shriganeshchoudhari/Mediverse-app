import {
  calculateTotalBodyWater,
  calculateCorrectedSodium,
  calculateSerumOsmolality,
  calculateFreeWaterDeficit,
  calculateAdrogueMadiasDelta,
  classifyDysnatremiaEtiology,
  evaluateDysnatremiaWorkstation,
  INFUSATE_REGISTRY,
  DYSNATREMIA_PRESETS,
} from '../../.gemini/skills/DysnatremiaEngine';

describe('DysnatremiaEngine', () => {
  it('accurately calculates Total Body Water across sexes and age groups', () => {
    // 70 kg young male: 70 * 0.6 = 42 L
    expect(calculateTotalBodyWater(70, 'MALE', 'ADULT')).toBe(42);
    // 70 kg elderly male: 70 * 0.5 = 35 L
    expect(calculateTotalBodyWater(70, 'MALE', 'ELDERLY')).toBe(35);
    // 60 kg young female: 60 * 0.5 = 30 L
    expect(calculateTotalBodyWater(60, 'FEMALE', 'ADULT')).toBe(30);
    // 60 kg elderly female: 60 * 0.45 = 27 L
    expect(calculateTotalBodyWater(60, 'FEMALE', 'ELDERLY')).toBe(27);
  });

  it('calculates Katz corrected sodium in hyperglycemia', () => {
    // Measured Na 125, glucose 500 mg/dL:
    // Excess glucose = (500 - 100) / 100 = 4; Factor = 2.4 (since > 400); Corrected = 125 + 4 * 2.4 = 134.6
    const corrected = calculateCorrectedSodium(125, 500);
    expect(corrected).toBeCloseTo(134.6, 1);

    // Normal glucose <= 100 returns unchanged
    expect(calculateCorrectedSodium(138, 90)).toBe(138);
  });

  it('computes serum osmolality and Free Water Deficit in hypernatremia', () => {
    // 2*140 + 90/18 + 14/2.8 = 280 + 5 + 5 = 290 mOsm/kg
    const osmo = calculateSerumOsmolality(140, 90, 14);
    expect(osmo).toBe(290);

    // FWD for 35 L TBW and Na 160: 35 * (160/140 - 1) = 35 * (20/140) = 5.0 L
    const fwd = calculateFreeWaterDeficit(35, 160);
    expect(fwd).toBe(5.0);

    // Normal Na has zero deficit
    expect(calculateFreeWaterDeficit(35, 138)).toBe(0);
  });

  it('calculates Adrogué-Madias delta per liter correctly', () => {
    const hypertonicSaline = INFUSATE_REGISTRY['NACL_3_PERCENT']; // 513 mEq/L
    const tbw = 35; // L
    const serumNa = 110; // mEq/L
    // Delta = (513 - 110) / (35 + 1) = 403 / 36 = 11.194 mEq/L
    const delta = calculateAdrogueMadiasDelta(hypertonicSaline, serumNa, tbw);
    expect(delta).toBeCloseTo(11.194, 2);

    // Normal saline (154 mEq/L) in patient with Na 140 and TBW 42:
    // Delta = (154 - 140) / 43 = 14 / 43 = 0.326 mEq/L
    const nsDelta = calculateAdrogueMadiasDelta(INFUSATE_REGISTRY['NACL_0_9_PERCENT'], 140, 42);
    expect(nsDelta).toBeCloseTo(0.326, 2);
  });

  it('classifies dysnatremia etiology correctly (SIADH vs Translocational vs DI)', () => {
    // SIADH
    const siadh = classifyDysnatremiaEtiology({
      serumSodium: 122,
      correctedSodium: 122,
      serumOsmolality: 260,
      glucoseMgDl: 95,
      urineSodium: 55,
      urineOsmolality: 450,
    });
    expect(siadh.etiology).toBe('HYPOTONIC_EUVOLEMIC_SIADH');

    // Hypertonic Translocational
    const translocational = classifyDysnatremiaEtiology({
      serumSodium: 124,
      correctedSodium: 136,
      serumOsmolality: 310,
      glucoseMgDl: 750,
      urineSodium: 35,
      urineOsmolality: 400,
    });
    expect(translocational.etiology).toBe('HYPERTONIC_TRANSLOCATIONAL');

    // Central Diabetes Insipidus
    const di = classifyDysnatremiaEtiology({
      serumSodium: 155,
      correctedSodium: 155,
      serumOsmolality: 325,
      glucoseMgDl: 100,
      urineSodium: 15,
      urineOsmolality: 95,
    });
    expect(di.etiology).toBe('HYPERNATREMIA_CENTRAL_DI');
  });

  it('evaluates Acute Severe Symptomatic Hyponatremia and mandates 3% NaCl bolus', () => {
    const acutePreset = DYSNATREMIA_PRESETS[0]; // ACUTE_SEVERE_SYMPTOMATIC_HYPONATREMIA
    const evalResult = evaluateDysnatremiaWorkstation(acutePreset.patient, acutePreset.regimen);

    expect(evalResult.effectiveTonicityState).toBe('HYPOTONIC');
    expect(evalResult.emergencyBolusRecommendation).toMatch(/CRITICAL SYMPTOMATIC HYPONATREMIA/i);
    expect(evalResult.emergencyBolusRecommendation).toMatch(/100 to 150 mL of 3% Hypertonic Saline/i);
  });

  it('detects high ODS risk and enforces strict 4-6 mEq/L safe correction ceiling', () => {
    const cirrhosisPreset = DYSNATREMIA_PRESETS[2]; // CIRRHOSIS_HYPOVOLEMIC_HIGH_ODS_RISK
    const evalResult = evaluateDysnatremiaWorkstation(cirrhosisPreset.patient, cirrhosisPreset.regimen);

    expect(evalResult.safe24hCorrectionLimitMeqL).toBe(6.0);
    expect(evalResult.clinicalSafetyAlerts.some((a) => a.includes('HIGH-RISK ODS'))).toBe(true);
  });

  it('identifies overcorrection and generates DDAVP + D5W rescue protocol', () => {
    // Create an aggressive 3% NaCl continuous regimen that causes overcorrection
    const patient = { ...DYSNATREMIA_PRESETS[0].patient, isHighRiskForOds: true };
    const aggressiveRegimen = {
      selectedInfusate: 'NACL_3_PERCENT' as const,
      infusionRateMlHr: 150,
      durationHours: 24,
      bolusesGiven3PercentCount: 2,
      bolusVolumeMl: 150,
      ddavpClampGiven: false,
    };

    const evalResult = evaluateDysnatremiaWorkstation(patient, aggressiveRegimen);

    expect(evalResult.isOvercorrecting).toBe(true);
    expect(evalResult.isAtRiskForOsmoticDemyelination).toBe(true);
    expect(evalResult.overcorrectionRescuePlan).toMatch(/OVERCORRECTION EMERGENCY/i);
    expect(evalResult.overcorrectionRescuePlan).toMatch(/Desmopressin \(DDAVP\) 1 to 2 mcg/i);
  });
});
