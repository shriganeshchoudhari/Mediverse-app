import {
  solveRenalFiltration,
  solveRenalClearance,
  solveFractionalSodiumExcretion,
  solveFeNa,
} from '../../lib/simulations/renalSolver';
import { asMmHg } from '../../lib/simulations/types';

describe('Renal Physiology Solver Unit Tests', () => {
  describe('solveRenalFiltration - Glomerular Filtration Dynamics', () => {
    test('computes standard baseline normal GFR of 125 mL/min with typical Starling pressures', () => {
      const result = solveRenalFiltration({
        pGlomerularCapillary: asMmHg(60),
        pBowmansSpace: asMmHg(18),
        piGlomerularCapillary: asMmHg(32),
        piBowmansSpace: asMmHg(0),
        kf: 12.5,
      });

      // NFP = (60 - 18) - (32 - 0) = 42 - 32 = 10 mmHg
      expect(result.netFiltrationPressure).toBe(10);
      // GFR = 10 * 12.5 = 125 mL/min
      expect(result.gfr).toBe(125);
      expect(Number.isNaN(result.gfr)).toBe(false);
      expect(Number.isNaN(result.netFiltrationPressure)).toBe(false);
    });

    test('handles severe urinary tract / tubular obstruction where Bowman hydrostatic pressure exceeds capillary driving force', () => {
      const result = solveRenalFiltration({
        pGlomerularCapillary: asMmHg(50),
        pBowmansSpace: asMmHg(35), // high back-pressure
        piGlomerularCapillary: asMmHg(30),
        piBowmansSpace: asMmHg(0),
        kf: 12.5,
      });

      // NFP = (50 - 35) - (30 - 0) = 15 - 30 = -15 -> Clamped to 0
      expect(result.netFiltrationPressure).toBe(0);
      expect(result.gfr).toBe(0);
    });

    test('computes hemodynamics from afferent/efferent vascular radii and systemic BP', () => {
      const normalResult = solveRenalFiltration({
        afferentRadius: 10.0,
        efferentRadius: 10.0,
        meanArterialPressure: asMmHg(100),
      });

      expect(normalResult.gfr).toBeGreaterThan(90);
      expect(normalResult.gfr).toBeLessThan(150);
      expect(normalResult.renalBloodFlow).toBeGreaterThan(1000);
      expect(normalResult.renalBloodFlow).toBeLessThan(1400);
      expect(normalResult.filtrationFraction).toBeGreaterThan(15);
      expect(normalResult.filtrationFraction).toBeLessThan(25);

      // Afferent constriction (e.g. NSAID toxic effect) lowers GFR & RBF
      const nsaidResult = solveRenalFiltration({
        afferentRadius: 7.0,
        efferentRadius: 10.0,
        meanArterialPressure: asMmHg(100),
      });
      expect(nsaidResult.gfr).toBeLessThan(normalResult.gfr);
      expect(nsaidResult.renalBloodFlow).toBeLessThan(normalResult.renalBloodFlow);

      // Efferent dilation (e.g. ACE inhibitor / ARB effect) lowers GFR
      const aceResult = solveRenalFiltration({
        afferentRadius: 10.0,
        efferentRadius: 14.0,
        meanArterialPressure: asMmHg(100),
      });
      expect(aceResult.gfr).toBeLessThan(normalResult.gfr);
    });
  });

  describe('solveRenalClearance - Clearance and Tubular Handling', () => {
    test('calculates Inulin clearance exactly matching GFR (neither reabsorbed nor secreted)', () => {
      const result = solveRenalClearance({
        urineConcentration: 125, // mg/dL
        urineFlowRate: 1.0,      // mL/min
        plasmaConcentration: 1.0,// mg/dL
        substanceName: 'Inulin',
        gfrReference: 125,
      });

      // C = (125 * 1.0) / 1.0 = 125 mL/min
      expect(result.clearance).toBe(125);
      expect(result.fractionalExcretion).toBe(100);
      expect(result.tubularHandlingDescription).toContain('equals GFR');
    });

    test('identifies net tubular reabsorption when substance clearance is below GFR (e.g. Urea / Glucose)', () => {
      const result = solveRenalClearance({
        urineConcentration: 25,  // mg/dL
        urineFlowRate: 1.0,      // mL/min
        plasmaConcentration: 1.0,// mg/dL
        substanceName: 'Urea',
        gfrReference: 125,
      });

      // C = (25 * 1.0) / 1.0 = 25 mL/min
      expect(result.clearance).toBe(25);
      expect(result.fractionalExcretion).toBe(20);
      expect(result.tubularHandlingDescription).toContain('net tubular reabsorption');
    });

    test('identifies net tubular secretion when substance clearance exceeds GFR (e.g. PAH)', () => {
      const result = solveRenalClearance({
        urineConcentration: 600, // mg/dL
        urineFlowRate: 1.0,      // mL/min
        plasmaConcentration: 1.0,// mg/dL
        substanceName: 'PAH',
        gfrReference: 125,
      });

      // C = (600 * 1.0) / 1.0 = 600 mL/min
      expect(result.clearance).toBe(600);
      expect(result.fractionalExcretion).toBe(480);
      expect(result.tubularHandlingDescription).toContain('net tubular secretion');
    });

    test('guards against division by zero when plasma concentration is zero', () => {
      const result = solveRenalClearance({
        urineConcentration: 50,
        urineFlowRate: 1.0,
        plasmaConcentration: 0,
      });

      expect(Number.isNaN(result.clearance)).toBe(false);
      expect(result.clearance).toBeGreaterThan(0);
    });
  });

  describe('solveFractionalSodiumExcretion (FeNa)', () => {
    test('diagnoses Prerenal Azotemia when FeNa < 1.0%', () => {
      // Classic prerenal: high urine concentration capacity, low urinary sodium (<20 mEq/L), high urine creatinine
      const result = solveFractionalSodiumExcretion({
        urineSodium: 14,      // mEq/L
        plasmaSodium: 140,    // mEq/L
        urineCreatinine: 160, // mg/dL
        plasmaCreatinine: 2.0,// mg/dL
      });

      // FeNa = (14 * 2.0) / (140 * 160) * 100 = 28 / 22400 * 100 = 0.125% -> 0.13%
      expect(result.feNa).toBe(0.13);
      expect(result.etiology).toBe('prerenal');
      expect(result.clinicalCategory).toContain('Prerenal Azotemia');
      expect(result.interpretation).toContain('intact tubular function');
    });

    test('diagnoses Intrinsic Acute Tubular Necrosis (ATN) when FeNa > 2.0%', () => {
      // Classic ATN: impaired tubular sodium reabsorption (UNa > 40 mEq/L), lower urine creatinine
      const result = solveFeNa({
        urineSodium: 65,      // mEq/L
        plasmaSodium: 138,    // mEq/L
        urineCreatinine: 35,  // mg/dL
        plasmaCreatinine: 3.5,// mg/dL
      });

      // FeNa = (65 * 3.5) / (138 * 35) * 100 = 227.5 / 4830 * 100 = 4.71%
      expect(result.feNa).toBe(4.71);
      expect(result.etiology).toBe('intrinsic');
      expect(result.clinicalCategory).toContain('Intrinsic');
      expect(result.interpretation).toContain('damaged tubular epithelial cells');
    });

    test('categorizes intermediate / indeterminate state for FeNa between 1.0% and 2.0%', () => {
      const result = solveFractionalSodiumExcretion({
        urineSodium: 35,
        plasmaSodium: 140,
        urineCreatinine: 50,
        plasmaCreatinine: 2.0,
      });

      // FeNa = (35 * 2.0) / (140 * 50) * 100 = 70 / 7000 * 100 = 1.0%
      expect(result.feNa).toBe(1.0);
      expect(result.etiology).toBe('intermediate_or_postrenal');
      expect(result.clinicalCategory).toContain('Indeterminate');
    });
  });
});
