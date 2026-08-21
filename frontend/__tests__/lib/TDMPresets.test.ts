import {
  NTI_DRUGS,
  calculateCockcroftGaultCrCl,
  calculateAdjustedDose,
  getNTIDrugById
} from '../../lib/pharmacy/TDMPresets';

describe('TDMPresets', () => {
  it('contains at least 10 narrow therapeutic index drugs in NTI_DRUGS', () => {
    expect(NTI_DRUGS.length).toBeGreaterThanOrEqual(10);
  });

  it('accurately computes CrCl using calculateCockcroftGaultCrCl', () => {
    const maleCrCl = calculateCockcroftGaultCrCl(60, 70, 1.0, false);
    expect(maleCrCl).toBeCloseTo(77.78, 1);
    
    const femaleCrCl = calculateCockcroftGaultCrCl(60, 70, 1.0, true);
    expect(femaleCrCl).toBeCloseTo(66.11, 1);
  });

  it('adjusts dosage or interval for renal impairment using calculateAdjustedDose', () => {
    const adjusted = calculateAdjustedDose('vanco', 30, 70);
    expect(adjusted).toBeDefined();
    expect(adjusted.recommendedIntervalHours).toBeGreaterThan(12);
  });

  it('returns Vancomycin when getNTIDrugById("vancomycin") is called', () => {
    const drug = getNTIDrugById('vancomycin');
    expect(drug).toBeDefined();
    expect(drug?.name.toLowerCase()).toContain('vancomycin');
  });
});
