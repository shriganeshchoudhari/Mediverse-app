/**
 * PharmacogenomicsEngine.test.ts
 * 
 * Unit tests for Clinical Pharmacogenomics (PGx) & Precision Therapeutics Engine
 */

import {
  callCYP2C19Phenotype,
  callCYP2D6Phenotype,
  callTPMTPhenotype,
  callDPYDPhenotype,
  calculateIWPCWarfarinDose,
  simulateWarfarinINRKinetics,
  evaluatePatientPGxCDS,
  PGX_PRESETS,
} from '../../.gemini/skills/PharmacogenomicsEngine';

describe('PharmacogenomicsEngine', () => {
  describe('CYP2C19 Diplotype & Phenotype Calling', () => {
    it('calls *1/*1 as Normal Metabolizer', () => {
      const dip = callCYP2C19Phenotype('*1', '*1');
      expect(dip.activityScore).toBe(2.0);
      expect(dip.phenotype).toBe('NORMAL_METABOLIZER');
    });

    it('calls *2/*2 as Poor Metabolizer', () => {
      const dip = callCYP2C19Phenotype('*2', '*2');
      expect(dip.activityScore).toBe(0.0);
      expect(dip.phenotype).toBe('POOR_METABOLIZER');
      expect(dip.phenotypeDescription).toContain('fails to activate clopidogrel prodrug');
    });

    it('calls *1/*2 as Intermediate Metabolizer', () => {
      const dip = callCYP2C19Phenotype('*1', '*2');
      expect(dip.activityScore).toBe(1.0);
      expect(dip.phenotype).toBe('INTERMEDIATE_METABOLIZER');
    });

    it('calls *17/*17 as Ultrarapid Metabolizer', () => {
      const dip = callCYP2C19Phenotype('*17', '*17');
      expect(dip.activityScore).toBe(3.0);
      expect(dip.phenotype).toBe('ULTRARAPID_METABOLIZER');
    });
  });

  describe('CYP2D6 Diplotype & Activity Score Calling', () => {
    it('calls *4/*4 as Poor Metabolizer with zero activity score', () => {
      const dip = callCYP2D6Phenotype('*4', '*4');
      expect(dip.activityScore).toBe(0.0);
      expect(dip.phenotype).toBe('POOR_METABOLIZER');
    });

    it('calls *1/*1xN duplication as Ultrarapid Metabolizer', () => {
      const dip = callCYP2D6Phenotype('*1', '*1xN');
      expect(dip.activityScore).toBeGreaterThanOrEqual(3.0);
      expect(dip.phenotype).toBe('ULTRARAPID_METABOLIZER');
      expect(dip.phenotypeDescription).toContain('lethal apnea risk');
    });

    it('calls *1/*41 as Intermediate Metabolizer', () => {
      const dip = callCYP2D6Phenotype('*1', '*41');
      expect(dip.activityScore).toBe(1.5);
      expect(dip.phenotype).toBe('NORMAL_METABOLIZER'); // CPIC: AS 1.25 - 2.25 is Normal
    });
  });

  describe('TPMT & DPYD Oncology Enzyme Calling', () => {
    it('calls TPMT *3A/*3A as Poor Metabolizer requiring 90% dose reduction', () => {
      const dip = callTPMTPhenotype('*3A', '*3A');
      expect(dip.activityScore).toBe(0.0);
      expect(dip.phenotype).toBe('POOR_METABOLIZER');
      expect(dip.phenotypeDescription).toContain('requires 90% dose reduction');
    });

    it('calls DPYD *1/*2A as Intermediate Metabolizer', () => {
      const dip = callDPYDPhenotype('*1', '*2A');
      expect(dip.activityScore).toBe(1.0);
      expect(dip.phenotype).toBe('INTERMEDIATE_METABOLIZER');
      expect(dip.phenotypeDescription).toContain('50% dose reduction strongly recommended');
    });

    it('calls DPYD *2A/*2A as Poor Metabolizer (Contraindicated)', () => {
      const dip = callDPYDPhenotype('*2A', '*2A');
      expect(dip.activityScore).toBe(0.0);
      expect(dip.phenotype).toBe('POOR_METABOLIZER');
      expect(dip.phenotypeDescription).toContain('CONTRAINDICATED');
    });
  });

  describe('IWPC Warfarin Precision Dosing Algorithm', () => {
    it('computes standard maintenance dose for wild-type patient', () => {
      const res = calculateIWPCWarfarinDose({
        age: 50,
        heightCm: 175,
        weightKg: 75,
        cyp2c9Diplotype: '*1/*1',
        vkorc1Genotype: 'G/G',
        amiodaroneCoPrescribed: false,
        targetINR: 2.5,
      });

      expect(res.predictedDailyDoseMg).toBeGreaterThanOrEqual(4.0);
      expect(res.predictedDailyDoseMg).toBeLessThanOrEqual(7.0);
      expect(res.riskCategory).toBe('STANDARD');
    });

    it('computes dramatically reduced dose for CYP2C9 *2/*3 and VKORC1 A/A', () => {
      const res = calculateIWPCWarfarinDose({
        age: 72,
        heightCm: 165,
        weightKg: 65,
        cyp2c9Diplotype: '*2/*3',
        vkorc1Genotype: 'A/A',
        amiodaroneCoPrescribed: false,
        targetINR: 2.5,
      });

      expect(res.predictedDailyDoseMg).toBeLessThanOrEqual(2.0);
      expect(res.riskCategory).toBe('HIGH_SENSITIVITY');
      expect(res.geneticExplanation).toContain('Extreme sensitivity');
    });

    it('simulates kinetic 14-day INR showing dangerous overshoot on empirical dosing', () => {
      const curve = simulateWarfarinINRKinetics('*2/*3', 'A/A', 1.4);

      const day14 = curve[curve.length - 1];
      expect(day14.inrStandardEmpirical).toBeGreaterThan(5.0); // Extreme bleeding risk
      expect(day14.inrPgxGuided).toBeLessThan(3.5); // Controlled therapeutic range
    });
  });

  describe('Clinical Decision Support (CDS) Rules', () => {
    const cyp2c19PM = callCYP2C19Phenotype('*2', '*2');
    const cyp2d6UM = callCYP2D6Phenotype('*1', '*1xN');
    const tpmtNM = callTPMTPhenotype('*1', '*1');
    const dpydNM = callDPYDPhenotype('*1', '*1');

    it('flags Clopidogrel in CYP2C19 Poor Metabolizer as CRITICAL and recommends Ticagrelor', () => {
      const cds = evaluatePatientPGxCDS('Clopidogrel 75 mg', {
        cyp2c19: cyp2c19PM,
        cyp2d6: callCYP2D6Phenotype('*1', '*1'),
        tpmt: tpmtNM,
        dpyd: dpydNM,
      });

      expect(cds.safetyStatus).toBe('ACTION_REQUIRED');
      expect(cds.alerts).toHaveLength(1);
      expect(cds.alerts[0].alternativeTherapy).toContain('Prasugrel');
      expect(cds.alerts[0].alternativeTherapy).toContain('Ticagrelor');
    });

    it('flags Codeine in CYP2D6 Ultrarapid Metabolizer as CONTRAINDICATED', () => {
      const cds = evaluatePatientPGxCDS('Codeine 30 mg', {
        cyp2c19: callCYP2C19Phenotype('*1', '*1'),
        cyp2d6: cyp2d6UM,
        tpmt: tpmtNM,
        dpyd: dpydNM,
      });

      expect(cds.safetyStatus).toBe('CONTRAINDICATED');
      expect(cds.alerts[0].clinicalAlert).toContain('Black Box');
    });

    it('flags Abacavir as CONTRAINDICATED in HLA-B*57:01 positive patient', () => {
      const cds = evaluatePatientPGxCDS('Triumeq (Abacavir/Dolutegravir/Lamivudine)', {
        cyp2c19: callCYP2C19Phenotype('*1', '*1'),
        cyp2d6: callCYP2D6Phenotype('*1', '*1'),
        tpmt: tpmtNM,
        dpyd: dpydNM,
        hlaB5701Positive: true,
      });

      expect(cds.safetyStatus).toBe('CONTRAINDICATED');
      expect(cds.alerts[0].clinicalAlert).toContain('HLA-B*57:01 positive');
      expect(cds.alerts[0].clinicalAlert).toContain('fatal systemic multi-organ hypersensitivity');
    });
  });

  describe('Clinical Presets', () => {
    it('has all 6 high-yield clinical presets', () => {
      expect(PGX_PRESETS).toHaveLength(6);
      const ids = PGX_PRESETS.map(p => p.id);
      expect(ids).toContain('post-pci-clopidogrel');
      expect(ids).toContain('pediatric-codeine-um');
      expect(ids).toContain('all-thiopurine-tpmt');
      expect(ids).toContain('colorectal-5fu-dpyd');
      expect(ids).toContain('warfarin-high-sensitivity');
      expect(ids).toContain('hiv-abacavir-hla');
    });
  });
});
