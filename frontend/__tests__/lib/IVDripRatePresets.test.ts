import {
  calculateIVDripRate,
  calculateVasoactiveInfusionRate,
  VASOACTIVE_DRUGS,
  STANDARD_IV_FLUID_PRESETS
} from '../../lib/nursing/IVDripRatePresets';

describe('IVDripRatePresets', () => {
  it('calculates IV drip rate for 1000mL over 8 hours with 15 gtt/mL drop factor', () => {
    const result = calculateIVDripRate(1000, 480, 15);
    expect(result.gttPerMin).toBeCloseTo(31, 0);
    expect(result.mlPerHour).toBe(125);
  });

  it('calculates vasoactive infusion rate accurately', () => {
    const norepi = VASOACTIVE_DRUGS.find(d => d.id === 'norepi')!;
    const result = calculateVasoactiveInfusionRate(norepi, 0.1, 70, 4, 250);
    expect(result.mlPerHour).toBeGreaterThan(0);
    expect(result.actualDose).toBe(0.1);
  });

  it('contains at least 5 vasoactive medications', () => {
    expect(VASOACTIVE_DRUGS.length).toBeGreaterThanOrEqual(5);
  });

  it('contains at least 4 standard IV fluid regimens', () => {
    expect(STANDARD_IV_FLUID_PRESETS.length).toBeGreaterThanOrEqual(4);
  });
});
