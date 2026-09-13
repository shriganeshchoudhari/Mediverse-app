import {
  translateCyp2d6Diplotype,
  translateCyp2c19Diplotype,
  translateDpydDiplotype,
  translateSlco1b1Diplotype,
  calculateIwpcWarfarinDose,
  evaluateCpicGuideline,
  CLINICAL_PGX_PRESETS
} from '../../.gemini/skills/PharmacogenomicsCpicEngine';

describe('PharmacogenomicsCpicEngine Unit Tests', () => {
  describe('CYP2D6 Star-Allele Translation', () => {
    it('1. correctly identifies *1/*1 as Normal Metabolizer (AS 2.0)', () => {
      const res = translateCyp2d6Diplotype('*1', '*1');
      expect(res.phenotype).toBe('NM');
      expect(res.activityScore).toBe(2.0);
    });

    it('2. correctly identifies *4/*5 as Poor Metabolizer (AS 0.0)', () => {
      const res = translateCyp2d6Diplotype('*4', '*5');
      expect(res.phenotype).toBe('PM');
      expect(res.activityScore).toBe(0.0);
    });

    it('3. correctly identifies *1/*1xN as Ultrarapid Metabolizer (AS 3.0)', () => {
      const res = translateCyp2d6Diplotype('*1', '*1xN');
      expect(res.phenotype).toBe('UM');
      expect(res.activityScore).toBe(3.0);
    });
  });

  describe('CYP2C19 Phenotype Translation', () => {
    it('4. identifies *2/*2 as Poor Metabolizer (loss of function)', () => {
      const res = translateCyp2c19Diplotype('*2', '*2');
      expect(res.phenotype).toBe('PM');
    });

    it('5. identifies *1/*17 as Rapid Metabolizer', () => {
      const res = translateCyp2c19Diplotype('*1', '*17');
      expect(res.phenotype).toBe('RM');
    });

    it('6. identifies *17/*17 as Ultrarapid Metabolizer', () => {
      const res = translateCyp2c19Diplotype('*17', '*17');
      expect(res.phenotype).toBe('UM');
    });
  });

  describe('DPYD Fluoropyrimidine Toxicity Risk', () => {
    it('7. translates *1/*2A as Intermediate Metabolizer (AS 1.0)', () => {
      const res = translateDpydDiplotype('*1', '*2A');
      expect(res.phenotype).toBe('IM');
      expect(res.activityScore).toBe(1.0);
    });

    it('8. translates *2A/*13 as Poor Metabolizer (AS 0.0 - Complete deficiency)', () => {
      const res = translateDpydDiplotype('*2A', '*13');
      expect(res.phenotype).toBe('PM');
      expect(res.activityScore).toBe(0.0);
    });
  });

  describe('IWPC Warfarin Precision Dosing Algorithm', () => {
    it('9. computes marked dose reduction for VKORC1 A/A and CYP2C9 *3/*3 with Amiodarone', () => {
      const patient = CLINICAL_PGX_PRESETS.find(p => p.id === 'case-warfarin-bleeding')!;
      const iwpc = calculateIwpcWarfarinDose(patient);
      expect(iwpc.predictedDailyDoseMg).toBeLessThan(3.0);
      expect(iwpc.percentReductionFromStandard).toBeGreaterThan(40);
    });
  });

  describe('CPIC Guideline Rules Engine', () => {
    it('10. recommends alternative P2Y12 inhibitor for Clopidogrel with CYP2C19 *2/*2', () => {
      const pciPatient = CLINICAL_PGX_PRESETS.find(p => p.id === 'case-clopidogrel-pci')!;
      const rec = evaluateCpicGuideline('Clopidogrel', pciPatient);
      expect(rec.cpicLevel).toBe('A');
      expect(rec.recommendationSummary).toMatch(/Avoid Clopidogrel/i);
      expect(rec.alternativeMedications).toContain('Ticagrelor (Brilinta)');
    });

    it('11. contraindicates Codeine in CYP2D6 Ultrarapid Metabolizer', () => {
      const pedsPatient = CLINICAL_PGX_PRESETS.find(p => p.id === 'case-codeine-um')!;
      const rec = evaluateCpicGuideline('Codeine', pedsPatient);
      expect(rec.recommendationSummary).toMatch(/CONTRAINDICATED/i);
    });

    it('12. contraindicates Abacavir when HLA-B*57:01 is positive', () => {
      const hivPatient = CLINICAL_PGX_PRESETS.find(p => p.id === 'case-abacavir-hiv')!;
      const rec = evaluateCpicGuideline('Abacavir', hivPatient);
      expect(rec.recommendationSummary).toMatch(/CONTRAINDICATED/i);
    });
  });
});
