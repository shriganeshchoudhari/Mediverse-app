import { calculateKtV, CRRT_MODES } from '../../lib/allied/DialysisMachinePresets';

describe('DialysisMachinePresets', () => {
  it('calculateKtV computes adequate Kt/V (>= 1.2) for standard parameters', () => {
    // preBUN: 75, postBUN: 22, duration: 4 hours, UF: 2.5 L, postWeight: 68 kg
    const result = calculateKtV(75, 22, 4.0, 2.5, 68);
    expect(result.ktV).toBeGreaterThanOrEqual(1.2);
    expect(result.isAdequate).toBe(true);
    expect(result.urrPct).toBeGreaterThanOrEqual(65);
  });

  it('CRRT_MODES has CVVH, CVVHD, CVVHDF, SCUF', () => {
    const modes = CRRT_MODES.map(m => m.mode);
    expect(modes).toContain('CVVH');
    expect(modes).toContain('CVVHD');
    expect(modes).toContain('CVVHDF');
    expect(modes).toContain('SCUF');
  });
});
