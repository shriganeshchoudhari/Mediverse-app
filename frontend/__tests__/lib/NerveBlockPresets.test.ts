import {
  DENTAL_NERVE_BLOCKS,
  getDentalNerveBlockById,
} from '../../lib/dental/NerveBlockPresets';

describe('NerveBlockPresets Registry', () => {
  it('should define core dental nerve block techniques', () => {
    expect(DENTAL_NERVE_BLOCKS.length).toBeGreaterThanOrEqual(6);
    expect(getDentalNerveBlockById('ianb')).toBeDefined();
    expect(getDentalNerveBlockById('gow_gates')).toBeDefined();
    expect(getDentalNerveBlockById('vazirani_akinosi')).toBeDefined();
    expect(getDentalNerveBlockById('mental_incisive')).toBeDefined();
    expect(getDentalNerveBlockById('infraorbital')).toBeDefined();
    expect(getDentalNerveBlockById('greater_palatine')).toBeDefined();
  });

  it('should specify precise depth and angle parameters for IANB', () => {
    const ianb = getDentalNerveBlockById('ianb');
    expect(ianb).toBeDefined();
    expect(ianb?.idealDepthMm).toBe(22);
    expect(ianb?.idealAngleDeg).toBe(45);
    expect(ianb?.intravascularRisk).toBe('high');
    expect(ianb?.aspirationPositiveRatePercent).toBeGreaterThan(10);
    expect(ianb?.potentialComplications.some((c) => c.includes('Facial Nerve'))).toBe(true);
  });

  it('should specify Gow-Gates conduction anesthesia parameters', () => {
    const gg = getDentalNerveBlockById('gow_gates');
    expect(gg).toBeDefined();
    expect(gg?.idealDepthMm).toBe(25);
    expect(gg?.intravascularRisk).toBe('low');
    expect(gg?.clinicalPearl).toContain('gravity pooling');
  });

  it('should return undefined for invalid id', () => {
    expect(getDentalNerveBlockById('invalid-block')).toBeUndefined();
  });
});
