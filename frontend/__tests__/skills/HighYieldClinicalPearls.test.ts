import { HIGH_YIELD_PEARL_REGISTRY } from '../../.gemini/skills/HighYieldClinicalPearls';

describe('HighYieldClinicalPearls Suite', () => {
  it('registry contains expected clinical specialty categories', () => {
    expect(HIGH_YIELD_PEARL_REGISTRY).toBeDefined();
    expect(HIGH_YIELD_PEARL_REGISTRY.cardiovascular).toBeDefined();
    expect(Array.isArray(HIGH_YIELD_PEARL_REGISTRY.cardiovascular)).toBe(true);
  });

  it('each pearl conforms to schema with topic, buzzword, and examiner trap', () => {
    for (const category of Object.keys(HIGH_YIELD_PEARL_REGISTRY)) {
      const pearls = HIGH_YIELD_PEARL_REGISTRY[category];
      for (const pearl of pearls) {
        expect(pearl.id).toBeTruthy();
        expect(pearl.topic).toBeTruthy();
        expect(pearl.domain).toBeTruthy();
        expect(pearl.buzzword).toBeTruthy();
        expect(pearl.pathophysiology).toBeTruthy();
        expect(pearl.firstLineDiagnostic).toBeTruthy();
        expect(pearl.firstLineTreatment).toBeTruthy();
        expect(pearl.examinerTrap).toBeTruthy();
      }
    }
  });

  it('has unique pearl IDs across all categories', () => {
    const allIds: string[] = [];
    for (const cat of Object.keys(HIGH_YIELD_PEARL_REGISTRY)) {
      for (const p of HIGH_YIELD_PEARL_REGISTRY[cat]) {
        allIds.push(p.id);
      }
    }
    const uniqueIds = new Set(allIds);
    expect(uniqueIds.size).toBe(allIds.length);
  });
});
