import { CT_WINDOW_PRESETS, MRI_PULSE_SEQUENCES, getHUColor } from '../../lib/allied/RadiologyWindowPresets';

describe('RadiologyWindowPresets', () => {
  it('CT_WINDOW_PRESETS contains Brain, Bone, Lung, Soft Tissue', () => {
    const names = CT_WINDOW_PRESETS.map(p => p.name);
    expect(names.some(n => n.includes('Brain'))).toBe(true);
    expect(names.some(n => n.includes('Bone'))).toBe(true);
    expect(names.some(n => n.includes('Lung'))).toBe(true);
    expect(names.some(n => n.includes('Soft Tissue'))).toBe(true);
  });

  it('MRI_PULSE_SEQUENCES contains T1, T2, FLAIR, DWI', () => {
    const ids = MRI_PULSE_SEQUENCES.map(s => s.id);
    expect(ids.some(id => id.includes('t1'))).toBe(true);
    expect(ids.some(id => id.includes('t2'))).toBe(true);
    expect(ids.some(id => id.includes('flair'))).toBe(true);
    expect(ids.some(id => id.includes('dwi'))).toBe(true);
  });

  it('getHUColor returns valid color string', () => {
    const col = getHUColor(40, 80, 40);
    expect(typeof col).toBe('string');
    expect(col.length).toBeGreaterThan(0);
  });
});
