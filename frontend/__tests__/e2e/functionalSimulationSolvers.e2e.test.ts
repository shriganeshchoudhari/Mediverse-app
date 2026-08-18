import {
  solveRenalFiltration,
  solveRenalClearance,
  solveFractionalSodiumExcretion
} from "@/lib/simulations/renalSolver";

import {
  solvePH,
  calculateAnionGap,
  calculateWinterCompensation,
  solveAcidBase
} from "@/lib/simulations/acidBaseSolver";

import {
  solveGoldmanHodgkinKatz
} from "@/lib/simulations/membraneSolver";

import {
  solveCardiacCycle
} from "@/lib/simulations/cardiacSolver";

import {
  solveAlveolarGasEquation
} from "@/lib/simulations/respiratorySolver";

describe("E2E Functional: Multi-System Physiology Simulation Engines & Diagnostic Solvers (FR-SIM)", () => {
  // 1. Renal Filtration & Clearance Engine
  describe("E2E-SIM-001: Renal Starling Forces & Clearance Engine", () => {
    test("calculates baseline Net Filtration Pressure (NFP) and GFR from Starling equilibrium", () => {
      const result = solveRenalFiltration({
        pGlomerularCapillary: 60 as any,
        pBowmansSpace: 15 as any,
        piGlomerularCapillary: 30 as any,
        piBowmansSpace: 0 as any,
        kf: 12.5
      });

      // NFP = (60 - 15) - (30 - 0) = 45 - 30 = 15 mmHg
      expect(result.netFiltrationPressure).toBe(15);
      // GFR = 12.5 * 15 = 187.5 mL/min
      expect(result.gfr).toBe(187.5);
    });

    test("accurately computes inulin and PAH clearance with tubular handling classification", () => {
      // Inulin: filtered, neither reabsorbed nor secreted -> Clearance == GFR
      const inulinClearance = solveRenalClearance({
        urineConcentration: 125,
        urineFlowRate: 1.0,
        plasmaConcentration: 1.0,
        substanceName: "Inulin",
        gfrReference: 125
      });
      expect(inulinClearance.clearance).toBe(125);
      expect(inulinClearance.tubularHandlingDescription).toContain("Freely filtered");

      // Glucose: completely reabsorbed -> Clearance = 0
      const glucoseClearance = solveRenalClearance({
        urineConcentration: 0,
        urineFlowRate: 1.0,
        plasmaConcentration: 100,
        substanceName: "Glucose",
        gfrReference: 125
      });
      expect(glucoseClearance.clearance).toBe(0);
      expect(glucoseClearance.tubularHandlingDescription).toContain("reabsorption");
    });

    test("differentiates Prerenal Azotemia vs Acute Tubular Necrosis via Fractional Excretion of Sodium (FeNa)", () => {
      // Prerenal Azotemia: avid sodium retention -> FeNa < 1%
      const prerenal = solveFractionalSodiumExcretion({
        urineSodium: 15,
        plasmaSodium: 140,
        urineCreatinine: 120,
        plasmaCreatinine: 2.0
      });
      expect(prerenal.feNa).toBeLessThan(1.0);
      expect(prerenal.clinicalCategory).toContain("Prerenal Azotemia");
      expect(prerenal.etiology).toBe("prerenal");

      // Intrinsic Acute Tubular Necrosis (ATN): damaged tubules cannot reabsorb Na -> FeNa > 2%
      const atn = solveFractionalSodiumExcretion({
        urineSodium: 60,
        plasmaSodium: 140,
        urineCreatinine: 30,
        plasmaCreatinine: 2.0
      });
      expect(atn.feNa).toBeGreaterThan(2.0);
      expect(atn.clinicalCategory).toContain("ATN");
      expect(atn.etiology).toBe("intrinsic");
    });
  });

  // 2. Acid-Base & Davenport Nomogram Engine
  describe("E2E-SIM-002: Acid-Base Davenport & ABG Diagnostic Classifier", () => {
    test("calculates pH via Henderson-Hasselbalch equation (solvePH)", () => {
      // Normal values: [HCO3-] = 24 mEq/L, PaCO2 = 40 mmHg
      const normalPh = solvePH(40, 24);
      expect(normalPh).toBeCloseTo(7.40, 2);

      // Severe Acidemia: PaCO2 = 40, [HCO3-] = 10
      const acidPh = solvePH(40, 10);
      expect(acidPh).toBeLessThan(7.10);
    });

    test("computes Anion Gap and identifies High Anion Gap Metabolic Acidosis (HAGMA)", () => {
      // Diabetic Ketoacidosis (DKA): Na = 138, Cl = 98, HCO3 = 10 -> AG = 138 - (98 + 10) = 30
      const dkaAg = calculateAnionGap(138, 98, 10);
      expect(dkaAg.anionGap).toBe(30);
      expect(dkaAg.isHigh).toBe(true);
    });

    test("calculates Winter's formula expected PaCO2 respiratory compensation", () => {
      // Winter's Formula: Expected PaCO2 = 1.5 * [HCO3-] + 8 (+/- 2)
      // For [HCO3-] = 12: Expected PaCO2 = 1.5 * 12 + 8 = 26 (+/- 2)
      const winters = calculateWinterCompensation(12, 26);
      expect(winters.expectedValue).toBe(26);
      expect(winters.minExpected).toBe(24);
      expect(winters.maxExpected).toBe(28);
      expect(winters.status).toBe("adequate");
    });

    test("classifies primary and mixed acid-base disorders accurately", () => {
      // Case 1: Pure Acute Respiratory Acidosis (COPD/Hypoventilation)
      const respAcid = solveAcidBase({ paco2: 60, hco3: 26, na: 140, cl: 102, isChronic: false });
      expect(respAcid.primaryDisorder).toBe("acute_respiratory_acidosis");

      // Case 2: Pure Metabolic Alkalosis (Severe Vomiting)
      const metAlk = solveAcidBase({ paco2: 48, hco3: 40, na: 140, cl: 90 });
      expect(metAlk.primaryDisorder).toBe("compensated_metabolic_alkalosis");
    });
  });

  // 3. Membrane Biophysics & Goldman-Hodgkin-Katz Engine
  describe("E2E-SIM-003: Goldman-Hodgkin-Katz Membrane Biophysics Engine", () => {
    test("calculates resting membrane potential under physiological ionic gradients", () => {
      const result = solveGoldmanHodgkinKatz({
        kInside: 140,
        kOutside: 4.5,
        kPermeability: 1.0,
        naInside: 12,
        naOutside: 145,
        naPermeability: 0.04,
        clInside: 4,
        clOutside: 115,
        clPermeability: 0.45,
        temperatureCelsius: 37
      });
      // Normal neuronal resting potential is typically between -75 mV and -65 mV
      expect(result.restingPotential).toBeLessThan(-65);
      expect(result.restingPotential).toBeGreaterThan(-80);
      expect(result.eK).toBeLessThan(-80); // E_K ~ -90 mV
      expect(result.eNa).toBeGreaterThan(50); // E_Na ~ +60 mV
    });
  });

  // 4. Cardiovascular Hemodynamics Engine
  describe("E2E-SIM-004: Cardiovascular Cycle & Pressure-Volume Loop Solver", () => {
    test("calculates Stroke Volume, Cardiac Output, and Ejection Fraction", () => {
      const result = solveCardiacCycle({
        preloadEDV: 120 as any,
        afterloadSVR: 80 as any,
        inotropyEes: 2.5,
        heartRate: 75 as any
      });
      expect(result.strokeVolume).toBeGreaterThanOrEqual(60);
      expect(result.strokeVolume).toBeLessThanOrEqual(80);
      expect(result.ejectionFraction).toBeGreaterThan(50);
      expect(result.cardiacOutput).toBeGreaterThan(4.5);
    });
  });

  // 5. Respiratory Gas Mechanics Engine
  describe("E2E-SIM-005: Alveolar Gas Equation & Ventilation Mechanics", () => {
    test("computes Alveolar Oxygen Tension (PAO2) via Alveolar Gas Equation", () => {
      // PAO2 = FiO2 * (P_atm - 47) - (PaCO2 / R)
      // Room air FiO2 = 0.21, P_atm = 760, PaCO2 = 40, R = 0.8 -> PAO2 ~ 100 mmHg
      const alveolar = solveAlveolarGasEquation({
        fractionInspiredO2: 0.21,
        barometricPressure: 760 as any,
        arterialPCO2: 40 as any,
        respiratoryQuotient: 0.8,
        tidalVolumeMl: 500,
        respiratoryRate: 12,
        deadSpaceFraction: 0.3
      });
      expect(alveolar.alveolarPO2).toBeGreaterThanOrEqual(95);
      expect(alveolar.alveolarPO2).toBeLessThanOrEqual(105);
      expect(alveolar.minuteVentilation).toBe(6); // 500 * 12 / 1000 = 6 L/min
    });
  });
});
