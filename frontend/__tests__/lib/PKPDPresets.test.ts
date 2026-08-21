import {
  calculateOneCompConcentration,
  calculatePKSteadyState,
  STANDARD_PK_DRUG_PRESETS,
  calculateMultiDoseProfile,
  PKParameters
} from '../../lib/pharmacy/PKPDPresets';

describe('PKPDPresets', () => {
  const baseParams: PKParameters = {
    dose: 1000,
    clearance: 4.5,
    volumeOfDistribution: 50,
    absorptionRateKa: 1.2,
    bioavailabilityF: 1.0,
    infusionRateR0: 1000,
    infusionDuration: 1.0,
    eliminationRateKe: 4.5 / 50,
    halfLifeHours: Math.LN2 / (4.5 / 50)
  };

  it('calculates one compartment concentration for IV bolus, constant IV infusion, and oral absorption', () => {
    // IV Bolus
    const ivBolus = calculateOneCompConcentration(baseParams, 2, 'iv_bolus');
    expect(ivBolus).toBeGreaterThan(0);

    // Constant IV infusion
    const ivInfusion = calculateOneCompConcentration(baseParams, 0.5, 'iv_infusion');
    expect(ivInfusion).toBeGreaterThan(0);

    // Oral absorption
    const oral = calculateOneCompConcentration(baseParams, 2, 'oral');
    expect(oral).toBeGreaterThan(0);
  });

  it('calculates PK steady state returning positive Cmax, Cmin, and valid accumulation factor', () => {
    const ss = calculatePKSteadyState(1000, 4.5, 50, 12, 1.0);
    expect(ss.cMaxSS).toBeGreaterThan(0);
    expect(ss.cMinSS).toBeGreaterThan(0);
    expect(ss.accumulationFactor).toBeGreaterThan(0);
  });

  it('contains at least 5 standard clinical drugs in STANDARD_PK_DRUG_PRESETS', () => {
    expect(STANDARD_PK_DRUG_PRESETS.length).toBeGreaterThanOrEqual(5);
  });

  it('calculates multi-dose profile returning multi-point time-series data', () => {
    const profile = calculateMultiDoseProfile(baseParams, 12, 4, 'iv_bolus');
    expect(profile.length).toBeGreaterThan(0);
    expect(profile[0]).toHaveProperty('time');
    expect(profile[0]).toHaveProperty('concentration');
  });
});
