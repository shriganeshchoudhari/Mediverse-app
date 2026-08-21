import { VETERINARY_SURGERY_CASES } from '../../lib/veterinary/VeterinarySurgeryPresets';

describe('Veterinary Surgery Presets', () => {
  it('VETERINARY_SURGERY_CASES contains Canine GDV, Bovine LDA, Equine Colic', () => {
    const caseNames = VETERINARY_SURGERY_CASES.map(c => c.name);
    expect(caseNames.some(n => n.includes('GDV'))).toBe(true);
    expect(caseNames.some(n => n.includes('Displaced Abomasum'))).toBe(true);
    expect(caseNames.some(n => n.includes('Colic') || n.includes('Colon Volvulus'))).toBe(true);
  });
});
