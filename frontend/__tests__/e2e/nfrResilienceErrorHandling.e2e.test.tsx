import React from "react";
import { render, screen } from "@testing-library/react";
import QuizRunner, { QuizQuestion } from "@/components/exam/QuizRunner";
import { solveRenalFiltration } from "@/lib/simulations/renalSolver";
import { solveCardiacCycle } from "@/lib/simulations/cardiacSolver";

const MINIMAL_QUESTION: QuizQuestion[] = [
  {
    id: "q-min-01",
    stem: "What is the primary pacemaker of the human heart?",
    options: ["Sinoatrial (SA) node", "Atrioventricular (AV) node", "Bundle of His", "Purkinje fibers"],
    correctIndex: 0,
    rationale: "The SA node possesses the highest intrinsic rate of automaticity.",
    competencyCode: "PY5.1"
    // Note: vitals, patientVignette, and clinicalPearl are omitted to test resilience
  }
];

describe("E2E Non-Functional: System Resilience & Graceful Degradation (NFR-RELIAB)", () => {
  test("NFR-RELIAB-001: QuizRunner gracefully renders questions with missing optional vignette/vitals metadata", () => {
    render(
      <QuizRunner
        examTitle="Resilience Baseline Test"
        questions={MINIMAL_QUESTION}
      />
    );

    expect(screen.getByText(/What is the primary pacemaker of the human heart?/i)).toBeInTheDocument();
    expect(screen.getByText(/Sinoatrial \(SA\) node/i)).toBeInTheDocument();
  });

  test("NFR-RELIAB-002: Solvers maintain numerical stability during extreme physiological shock states", () => {
    // Extreme Cardiogenic Shock: SVR = 40 mmHg, EDV = 40 mL
    const shockCardiac = solveCardiacCycle({
      preloadEDV: 40 as any,
      afterloadSVR: 40 as any,
      inotropyEes: 0.8,
      heartRate: 160 as any
    });

    expect(shockCardiac.strokeVolume).toBeGreaterThan(0);
    expect(shockCardiac.ejectionFraction).toBeGreaterThan(0);
    expect(Number.isFinite(shockCardiac.cardiacOutput)).toBe(true);

    // Severe Hypotensive Anuria: P_gc = 25 mmHg, P_bs = 15 mmHg, pi_gc = 30 mmHg
    // NFP = (25 - 15) - (30 - 0) = 10 - 30 = -20 mmHg -> Net filtration stops (GFR = 0)
    const anuriaRenal = solveRenalFiltration({
      pGlomerularCapillary: 25 as any,
      pBowmansSpace: 15 as any,
      piGlomerularCapillary: 30 as any,
      kf: 12.5
    });

    expect(anuriaRenal.gfr).toBe(0);
    expect(Number.isFinite(anuriaRenal.renalBloodFlow)).toBe(true);
  });
});
