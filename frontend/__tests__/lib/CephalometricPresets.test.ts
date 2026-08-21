import {
  CEPHALOMETRIC_LANDMARKS,
  CEPHALOMETRIC_MEASUREMENTS,
  calculateANB,
  interpretSNA,
  interpretSNB,
  getMalocclussionClass,
  getSkeletalPattern,
} from '../../lib/dental/CephalometricPresets';

describe('CephalometricPresets', () => {
  it('CEPHALOMETRIC_LANDMARKS has >= 10 entries', () => {
    expect(CEPHALOMETRIC_LANDMARKS).toBeDefined();
    expect(CEPHALOMETRIC_LANDMARKS.length).toBeGreaterThanOrEqual(10);
  });

  it('Every landmark has id, name, svgDefaultX, svgDefaultY all present and valid', () => {
    CEPHALOMETRIC_LANDMARKS.forEach(landmark => {
      expect(landmark.id).toBeDefined();
      expect(typeof landmark.id).toBe('string');
      expect(landmark.name).toBeDefined();
      expect(typeof landmark.name).toBe('string');
      expect(landmark.svgDefaultX).toBeDefined();
      expect(typeof landmark.svgDefaultX).toBe('number');
      expect(landmark.svgDefaultY).toBeDefined();
      expect(typeof landmark.svgDefaultY).toBe('number');
    });
  });

  it('CEPHALOMETRIC_MEASUREMENTS has >= 9 entries (covering Steiner analysis)', () => {
    expect(CEPHALOMETRIC_MEASUREMENTS).toBeDefined();
    expect(CEPHALOMETRIC_MEASUREMENTS.length).toBeGreaterThanOrEqual(9);
  });

  it('Every measurement has meanMale, meanFemale, sdPlus, sdMinus all as numbers', () => {
    CEPHALOMETRIC_MEASUREMENTS.forEach(measurement => {
      expect(typeof measurement.meanMale).toBe('number');
      expect(typeof measurement.meanFemale).toBe('number');
      expect(typeof measurement.sdPlus).toBe('number');
      expect(typeof measurement.sdMinus).toBe('number');
    });
  });

  it('calculateANB(82, 80) returns 2', () => {
    expect(calculateANB(82, 80)).toBe(2);
  });

  it('calculateANB(84, 80) returns 4', () => {
    expect(calculateANB(84, 80)).toBe(4);
  });

  it('interpretSNA(82) returns "normal"', () => {
    expect(interpretSNA(82)).toBe('normal');
  });

  it('interpretSNA(86) returns "prognathic"', () => {
    expect(interpretSNA(86)).toBe('prognathic');
  });

  it('interpretSNA(78) returns "retrognathic"', () => {
    expect(interpretSNA(78)).toBe('retrognathic');
  });

  it('interpretSNB(80) returns "normal"', () => {
    expect(interpretSNB(80)).toBe('normal');
  });

  it('getMalocclussionClass(2) returns "Class I"', () => {
    expect(getMalocclussionClass(2)).toBe('Class I');
  });

  it('getMalocclussionClass(5) returns "Class II"', () => {
    expect(getMalocclussionClass(5)).toBe('Class II');
  });

  it('getMalocclussionClass(-1) returns "Class III"', () => {
    expect(getMalocclussionClass(-1)).toBe('Class III');
  });

  it('getSkeletalPattern(25) returns "normodivergent"', () => {
    expect(getSkeletalPattern(25)).toBe('normodivergent');
  });

  it('getSkeletalPattern(15) returns "hypodivergent"', () => {
    expect(getSkeletalPattern(15)).toBe('hypodivergent');
  });

  it('getSkeletalPattern(35) returns "hyperdivergent"', () => {
    expect(getSkeletalPattern(35)).toBe('hyperdivergent');
  });

  it('SNA normal range is between 80-84 degrees (meanMale between 80-84)', () => {
    const sna = CEPHALOMETRIC_MEASUREMENTS.find(m => m.id === 'SNA');
    expect(sna).toBeDefined();
    if (sna) {
      expect(sna.meanMale).toBeGreaterThanOrEqual(80);
      expect(sna.meanMale).toBeLessThanOrEqual(84);
    }
  });

  it('ANB normal range is 0-4 degrees', () => {
    const anb = CEPHALOMETRIC_MEASUREMENTS.find(m => m.id === 'ANB');
    expect(anb).toBeDefined();
    if (anb) {
      // Typically mean is ~2, checking based on standard range assumption
      expect(anb.meanMale).toBeGreaterThanOrEqual(0);
      expect(anb.meanMale).toBeLessThanOrEqual(4);
    }
  });
});
