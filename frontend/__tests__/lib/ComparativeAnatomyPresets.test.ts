import { COMPARATIVE_ANATOMY_PRESETS, SPECIES_LIST } from '../../lib/veterinary/ComparativeAnatomyPresets';

describe('Comparative Anatomy Presets', () => {
  it('COMPARATIVE_ANATOMY_PRESETS contains Digestive, Skeletal, Skull', () => {
    const names = COMPARATIVE_ANATOMY_PRESETS.map(p => p.systemName);
    expect(names.some(n => n.includes('Digestive'))).toBe(true);
    expect(names.some(n => n.includes('Skeletal'))).toBe(true);
    expect(names.some(n => n.includes('Skull'))).toBe(true);
  });

  it('SPECIES_LIST contains canine, feline, equine, bovine, human', () => {
    const ids = SPECIES_LIST.map(s => s.id);
    expect(ids).toContain('canine');
    expect(ids).toContain('feline');
    expect(ids).toContain('equine');
    expect(ids).toContain('bovine');
    expect(ids).toContain('human');
  });
});
