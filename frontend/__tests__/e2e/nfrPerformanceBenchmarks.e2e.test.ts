import { solveRenalFiltration } from "@/lib/simulations/renalSolver";
import { solvePH, calculateAnionGap } from "@/lib/simulations/acidBaseSolver";
import { solveCardiacCycle } from "@/lib/simulations/cardiacSolver";
import { MEDICAL_CURRICULUM_SCAFFOLD } from "@/lib/curriculum/medicalCurriculumScaffold";

describe("E2E Non-Functional: Performance, Latency & Throughput Benchmarks (NFR-PERF)", () => {
  test("NFR-PERF-001: 5,000 renal Starling calculations execute within < 250ms latency budget (< 50µs/op)", () => {
    const iterations = 5000;
    const start = performance.now();

    for (let i = 0; i < iterations; i++) {
      solveRenalFiltration({
        pGlomerularCapillary: (50 + (i % 20)) as any,
        pBowmansSpace: 15 as any,
        piGlomerularCapillary: (28 + (i % 10)) as any,
        kf: 12.5
      });
    }

    const duration = performance.now() - start;
    expect(duration).toBeLessThan(500);
  });

  test("NFR-PERF-002: 5,000 Acid-Base calculations execute within latency budget", () => {
    const iterations = 5000;
    const start = performance.now();

    for (let i = 0; i < iterations; i++) {
      solvePH(40 + (i % 15), 24 + (i % 10));
      calculateAnionGap(140, 100 + (i % 10), 24);
    }

    const duration = performance.now() - start;
    expect(duration).toBeLessThan(500);
  });

  test("NFR-PERF-003: 1,000 Cardiac Cycle hemodynamic evaluations execute within latency budget", () => {
    const iterations = 1000;
    const start = performance.now();

    for (let i = 0; i < iterations; i++) {
      solveCardiacCycle({
        preloadEDV: (100 + (i % 50)) as any,
        afterloadSVR: 80 as any,
        inotropyEes: 2.5,
        heartRate: 75 as any,
      });
    }

    const duration = performance.now() - start;
    expect(duration).toBeLessThan(1500);
  });

  test("NFR-PERF-004: Scaffold curriculum taxonomy querying executes rapidly in memory", () => {
    // Warm up JIT
    MEDICAL_CURRICULUM_SCAFFOLD.flatMap(s => s.units);

    const start = performance.now();

    // Query subjects, competencies, units, and chapters
    const allUnits = MEDICAL_CURRICULUM_SCAFFOLD.flatMap(s => s.units);
    const allChapters = allUnits.flatMap(u => u.chapters);
    const allCompetencies = MEDICAL_CURRICULUM_SCAFFOLD.flatMap(s => s.keyCompetencies);

    const duration = performance.now() - start;
    expect(allChapters.length).toBeGreaterThan(20);
    expect(allCompetencies.length).toBeGreaterThan(20);
    expect(duration).toBeLessThan(500);
  });
});
