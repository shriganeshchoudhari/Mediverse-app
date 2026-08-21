import { ECMO_CIRCUIT_CONFIGS, calculateCPBFlow, estimateBloodGas } from '../../lib/allied/ECMICircuitPresets';

describe('ECMICircuitPresets', () => {
  it('ECMO_CIRCUIT_CONFIGS contains CPB, VA-ECMO, VV-ECMO', () => {
    const types = ECMO_CIRCUIT_CONFIGS.map(c => c.type);
    expect(types).toContain('cpb');
    expect(types).toContain('va-ecmo');
    expect(types).toContain('vv-ecmo');
  });

  it('calculateCPBFlow computes correct flow for BSA 1.8 and CI 2.4 (4.32 L/min)', () => {
    const flow = calculateCPBFlow(1.8, 2.4);
    expect(flow).toBeCloseTo(4.32, 2);
  });

  it('estimateBloodGas returns physiological PaO2 and PaCO2', () => {
    const bg = estimateBloodGas(4.5, 4.0, 80);
    expect(bg.paO2MmHg).toBeGreaterThan(60);
    expect(bg.paCO2MmHg).toBeGreaterThan(20);
    expect(bg.pH).toBeGreaterThan(7.2);
  });
});
