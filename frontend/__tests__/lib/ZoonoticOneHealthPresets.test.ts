import { ZOONOTIC_RECORDS, calculateAdjustedR0 } from '../../lib/veterinary/ZoonoticOneHealthPresets';

describe('Zoonotic One Health Presets', () => {
  it('ZOONOTIC_RECORDS contains Rabies, Anthrax, Brucella', () => {
    const pathogenNames = ZOONOTIC_RECORDS.map(r => r.pathogenName);
    expect(pathogenNames.some(p => p.includes('Rabies'))).toBe(true);
    expect(pathogenNames.some(p => p.includes('Anthrax') || p.includes('anthracis'))).toBe(true);
    expect(pathogenNames.some(p => p.includes('Brucella'))).toBe(true);
  });

  it('calculateAdjustedR0 computes reduced R0 when interventions are active', () => {
    const baseR0 = 2.5;
    const adjusted = calculateAdjustedR0(baseR0, { vaccination: true, ppe: true, quarantine: false, vectorControl: false });
    expect(adjusted).toBeLessThan(baseR0);
  });
});
