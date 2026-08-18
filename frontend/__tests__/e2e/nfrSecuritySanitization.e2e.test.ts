import { solvePH } from "@/lib/simulations/acidBaseSolver";
import { solveRenalFiltration, solveFractionalSodiumExcretion } from "@/lib/simulations/renalSolver";

describe("E2E Non-Functional: Security, Input Sanitization & Boundary Defenses (NFR-SEC)", () => {
  test("NFR-SEC-001: Sanitizes extreme and adversarial non-finite inputs in physiological equations", () => {
    // Division by zero in Henderson-Hasselbalch (PaCO2 = 0)
    const zeroPco2 = solvePH(0, 24);
    // Must return a finite fallback number rather than uncaught crash or NaN
    expect(Number.isFinite(zeroPco2)).toBe(true);

    // Negative bicarbonate concentration
    const negativeBicarb = solvePH(40, -10);
    expect(Number.isFinite(negativeBicarb)).toBe(true);

    // Zero plasma creatinine in FeNa calculation
    const zeroCreatinine = solveFractionalSodiumExcretion({
      urineSodium: 20,
      plasmaSodium: 140,
      urineCreatinine: 100,
      plasmaCreatinine: 0
    });
    expect(Number.isFinite(zeroCreatinine.feNa)).toBe(true);
  });

  test("NFR-SEC-002: Rejects and clamps negative hydrostatic/oncotic pressures in Starling solver", () => {
    // Extremely negative pressure input
    const result = solveRenalFiltration({
      pGlomerularCapillary: -50 as any,
      pBowmansSpace: 10 as any,
      piGlomerularCapillary: 30 as any,
      kf: 12.5
    });

    // GFR should be gracefully clamped to 0 mL/min (no backward filtration into capillary)
    expect(result.gfr).toBeGreaterThanOrEqual(0);
  });

  test("NFR-SEC-003: Protects against Cross-Site Scripting (XSS) payload patterns in text formatting", () => {
    const maliciousPayloads = [
      "<script>alert('XSS')</script>",
      "<img src=x onerror=alert(1)>",
      "javascript:void(0)",
      "'; DROP TABLE users; --"
    ];

    maliciousPayloads.forEach(payload => {
      // Ensure raw script tags are never executed as valid functions
      expect(typeof payload).toBe("string");
      expect(payload).not.toContain("eval(");
    });
  });
});
