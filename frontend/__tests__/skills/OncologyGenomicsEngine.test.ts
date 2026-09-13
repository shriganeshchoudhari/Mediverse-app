import {
  calculateVaf,
  assessClonality,
  assignAmpTier,
  evaluateImmunogenomics,
  simulateClonalEvolution,
  ONCOLOGY_CASES,
} from '../../.gemini/skills/OncologyGenomicsEngine';

describe('OncologyGenomicsEngine Unit Tests', () => {
  it('1. computes Variant Allele Fraction (VAF %) accurately', () => {
    // 500 alt reads out of 2000 total reads = 25.00%
    expect(calculateVaf(500, 2000)).toBe(25.0);
    // 0 alt reads = 0%
    expect(calculateVaf(0, 1000)).toBe(0);
    // Edge case: 0 total reads -> 0
    expect(calculateVaf(10, 0)).toBe(0);
  });

  it('2. assesses clonality based on tumor purity and heterozygous somatic expectation', () => {
    // Tumor purity = 60%, expected clonal VAF = 30%.
    // VAF = 31% -> Clonal (fraction ~1.03)
    const clonal = assessClonality(31, 60);
    expect(clonal.isSubclonal).toBe(false);
    expect(clonal.clonalFraction).toBeGreaterThan(0.65);

    // VAF = 3.5% -> Subclonal (fraction ~0.12)
    const subclonal = assessClonality(3.5, 60);
    expect(subclonal.isSubclonal).toBe(true);
    expect(subclonal.clonalFraction).toBeLessThan(0.65);
  });

  it('3. assigns AMP/ASCO/CAP actionability tiers correctly', () => {
    // EGFR L858R in lung -> Tier I Level A
    const egfr = assignAmpTier('EGFR', 'L858R', 'Lung Adenocarcinoma');
    expect(egfr.ampTier).toBe('Tier I (Strong Clinical Significance)');
    expect(egfr.evidenceLevel).toBe('Level A');

    // KRAS G12C in colorectal -> Tier II Level C (off-label / emerging combination)
    const krasCrc = assignAmpTier('KRAS', 'G12C', 'Colorectal Cancer');
    expect(krasCrc.ampTier).toBe('Tier II (Potential Clinical Significance)');
    expect(krasCrc.evidenceLevel).toBe('Level C');

    // Unknown gene mutation -> Tier III (VUS)
    const vus = assignAmpTier('POT1', 'S270N', 'Lung Cancer');
    expect(vus.ampTier).toBe('Tier III (VUS)');
    expect(vus.evidenceLevel).toBe('None');
  });

  it('4. evaluates immunogenomics triad (TMB, MSI, PD-L1)', () => {
    // MSI-High -> Highly Favorable
    const msiHigh = evaluateImmunogenomics(4.0, 'MSI-High (dMMR)', 0);
    expect(msiHigh.immunotherapyResponse).toBe('Highly Favorable');
    expect(msiHigh.tmbStatus).toBe('TMB-Low (< 6 mut/Mb)');

    // TMB-High (18 mut/Mb) and PD-L1 60% -> Highly Favorable
    const hypermut = evaluateImmunogenomics(18.0, 'MSI-Stable (pMMR)', 60);
    expect(hypermut.immunotherapyResponse).toBe('Highly Favorable');

    // TMB-Low, MSS, PD-L1 0% -> Unfavorable / Cold
    const cold = evaluateImmunogenomics(2.1, 'MSI-Stable (pMMR)', 0);
    expect(cold.immunotherapyResponse).toBe('Unfavorable / Resistance Expected');
  });

  it('5. simulates clonal evolution and secondary resistance curves', () => {
    // 1st gen TKI: initial driver shrinks, T790M resistance grows
    const sim1st = simulateClonalEvolution(65, 32.5, 2.0, 12, '1st-Gen TKI (Erlotinib)');
    expect(sim1st.months).toContain(12);
    // At month 12, resistant clone should have grown from 2.0%
    const finalResistant = sim1st.resistantClonePct[sim1st.resistantClonePct.length - 1];
    expect(finalResistant).toBeGreaterThan(10.0);

    // Driver clone should have shrunk
    const finalDriver = sim1st.driverClonePct[sim1st.driverClonePct.length - 1];
    expect(finalDriver).toBeLessThan(32.5);
  });

  it('6. validates clinical case scenarios library', () => {
    expect(ONCOLOGY_CASES.length).toBeGreaterThanOrEqual(3);
    const nsclc = ONCOLOGY_CASES.find(c => c.id === 'nsclc-egfr-evolution');
    expect(nsclc).toBeDefined();
    expect(nsclc?.variants.some(v => v.gene === 'EGFR')).toBe(true);
    expect(nsclc?.variants.some(v => v.isSubclonal)).toBe(true);
  });
});
