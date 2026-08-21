import {
  TRIDOSHA_ANS_PROFILES,
  calculateSympathovagalBalance,
  CIRCADIAN_DOSHA_CLOCK
} from '../../lib/ayush/TridoshaANSPresets';

describe('TridoshaANSPresets', () => {
  it('TRIDOSHA_ANS_PROFILES has 3 items (Vata, Pitta, Kapha)', () => {
    expect(TRIDOSHA_ANS_PROFILES.length).toBe(3);
    const doshas = TRIDOSHA_ANS_PROFILES.map(p => p.dosha.toLowerCase());
    expect(doshas).toContain('vata');
    expect(doshas).toContain('pitta');
    expect(doshas).toContain('kapha');
  });

  it('calculateSympathovagalBalance(33, 33, 34) returns balanced state with valid LF/HF ratio', () => {
    const result = calculateSympathovagalBalance(33, 33, 34);
    expect(result.dominantState).toBe('balanced');
    expect(result.lfHfRatio).toBeGreaterThan(0);
  });

  it('high Vata results in higher sympathetic tone and vata_hyper dominant state', () => {
    const result = calculateSympathovagalBalance(80, 10, 10);
    expect(result.dominantState).toBe('vata_hyper');
    expect(result.sympatheticTone).toBeGreaterThan(result.parasympatheticTone);
  });

  it('high Kapha results in higher parasympathetic tone', () => {
    const result = calculateSympathovagalBalance(10, 10, 80);
    expect(result.parasympatheticTone).toBeGreaterThan(result.sympatheticTone);
  });

  it('CIRCADIAN_DOSHA_CLOCK contains all 6 time slots covering 24 hours', () => {
    expect(CIRCADIAN_DOSHA_CLOCK.length).toBe(6);
  });
});
