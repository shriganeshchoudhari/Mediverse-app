import { calculateHospitalMetrics, NABH_INDICATORS } from '../../lib/public-health/HospitalOperationsPresets';

describe('HospitalOperationsPresets', () => {
  it('computes correct BOR%', () => {
    const metrics = calculateHospitalMetrics(100, 15, 5);
    expect(metrics.borPct).toBe(75);
  });

  it('contains CLABSI, CAUTI, VAP in NABH_INDICATORS', () => {
    const names = NABH_INDICATORS.map(i => i.indicatorName);
    expect(names.some(n => n.includes('CLABSI'))).toBe(true);
    expect(names.some(n => n.includes('CAUTI'))).toBe(true);
    expect(names.some(n => n.includes('VAP') || n.includes('Ventilator'))).toBe(true);
  });
});
