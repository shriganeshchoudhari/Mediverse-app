import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import PsychiatryLabViewer from "../../components/psychiatry/PsychiatryLabViewer";

describe("PsychiatryLabViewer Component", () => {
  it("renders with default MSE & SIGECAPS depression evaluator and controls", () => {
    render(<PsychiatryLabViewer initialMode="mseAffective" />);

    expect(screen.getByText(/Mental Status Examination \(MSE\) & Major Depression \(SIGECAPS\) Evaluator/i)).toBeInTheDocument();
    expect(screen.getByText(/Major Depressive Disorder SIGECAPS & Subtype Matrix/i)).toBeInTheDocument();
    expect(screen.getByText(/Psychiatry Quiz/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Depression/i).length).toBeGreaterThan(0);
  });

  it("switches to Bipolar mode and updates Lithium toxicity engine", () => {
    render(<PsychiatryLabViewer initialMode="mseAffective" />);

    const bipolTab = screen.getByText(/2. Bipolar & Lithium/i);
    fireEvent.click(bipolTab);

    expect(screen.getByText(/Bipolar DIGFAST Mania & Lithium Toxicity Hemodialysis Engine/i)).toBeInTheDocument();
    expect(screen.getByText(/Lithium Carbonate Serum Concentration & Toxicity Engine/i)).toBeInTheDocument();
  });

  it("toggles Psychiatry Quiz challenge mode", () => {
    render(<PsychiatryLabViewer initialMode="mseAffective" />);

    const quizBtn = screen.getByText(/Psychiatry Quiz/i);
    fireEvent.click(quizBtn);

    expect(screen.getByText(/Exit Challenge/i)).toBeInTheDocument();
    expect(screen.getByText(/Psychiatry Clinical Challenge/i)).toBeInTheDocument();
  });
});
