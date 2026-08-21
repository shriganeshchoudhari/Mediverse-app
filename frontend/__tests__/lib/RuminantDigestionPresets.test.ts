import { RUMINANT_CHAMBERS, calculateRumenKinetics } from '../../lib/veterinary/RuminantDigestionPresets';

describe('Ruminant Digestion Presets', () => {
  it('RUMINANT_CHAMBERS has 4 chambers', () => {
    expect(RUMINANT_CHAMBERS).toHaveLength(4);
    const ids = RUMINANT_CHAMBERS.map(c => c.id);
    expect(ids).toContain('rumen');
    expect(ids).toContain('reticulum');
    expect(ids).toContain('omasum');
    expect(ids).toContain('abomasum');
  });

  it('calculateRumenKinetics computes valid pH and VFA ratios', () => {
    const kinetics = calculateRumenKinetics(70, 20);
    expect(kinetics.rumenPH).toBeGreaterThan(0);
    expect(kinetics.rumenPH).toBeLessThan(14);
    expect(kinetics.vfaRatio).toBeDefined();
    expect(kinetics.acetatePct).toBeGreaterThan(0);
  });
});
