import {
  CLINICAL_DRUG_DATABASE,
  DRUG_INTERACTIONS_REGISTRY,
  checkRegimenInteractions
} from '../../lib/pharmacy/DrugInteractionPresets';

describe('DrugInteractionPresets', () => {
  it('contains at least 25 clinical drugs in CLINICAL_DRUG_DATABASE', () => {
    expect(CLINICAL_DRUG_DATABASE.length).toBeGreaterThanOrEqual(25);
  });

  it('contains critical major interactions in DRUG_INTERACTIONS_REGISTRY', () => {
    expect(DRUG_INTERACTIONS_REGISTRY.length).toBeGreaterThan(0);
    const majorInteractions = DRUG_INTERACTIONS_REGISTRY.filter(i => i.severity === 'major');
    expect(majorInteractions.length).toBeGreaterThan(0);
  });

  it('detects major bleeding risk interaction for warfarin and aspirin', () => {
    const interactions = checkRegimenInteractions(['warfarin', 'aspirin']);
    expect(interactions.length).toBeGreaterThan(0);
    const hasBleedingRisk = interactions.some(i => 
      i.clinicalEffect.toLowerCase().includes('bleed') ||
      i.mechanism.toLowerCase().includes('coagulation') ||
      i.mechanism.toLowerCase().includes('platelet')
    );
    expect(hasBleedingRisk).toBe(true);
  });

  it('detects CYP3A4 inhibition and rhabdomyolysis risk for simvastatin and clarithromycin', () => {
    const interactions = checkRegimenInteractions(['simvastatin', 'clarithromycin']);
    expect(interactions.length).toBeGreaterThan(0);
    const hasRisk = interactions.some(i => 
      i.clinicalEffect.toLowerCase().includes('rhabdomyolysis') ||
      i.mechanism.toLowerCase().includes('cyp3a4')
    );
    expect(hasRisk).toBe(true);
  });
});
