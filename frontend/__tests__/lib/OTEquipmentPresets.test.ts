import { WHO_SURGICAL_CHECKLIST, STERILIZATION_METHODS } from '../../lib/allied/OTEquipmentPresets';

describe('OTEquipmentPresets', () => {
  it('WHO_SURGICAL_CHECKLIST contains all 3 phases (Sign In, Time Out, Sign Out)', () => {
    const phases = WHO_SURGICAL_CHECKLIST.map(p => p.phase);
    expect(phases).toContain('Sign In');
    expect(phases).toContain('Time Out');
    expect(phases).toContain('Sign Out');
  });

  it('STERILIZATION_METHODS contains Steam Autoclave, Ethylene Oxide, Plasma', () => {
    const methods = STERILIZATION_METHODS.map(m => m.method);
    expect(methods.some(m => m.includes('Steam Autoclave'))).toBe(true);
    expect(methods.some(m => m.includes('Ethylene Oxide'))).toBe(true);
    expect(methods.some(m => m.includes('Plasma'))).toBe(true);
  });
});
