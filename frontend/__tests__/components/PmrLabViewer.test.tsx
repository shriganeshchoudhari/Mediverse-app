import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import PmrLabViewer from "../../components/pmr/PmrLabViewer";

describe("PmrLabViewer Component", () => {
  it("renders with default stroke neuro-rehab simulator and Brunnstrom controls", () => {
    render(<PmrLabViewer initialMode="stroke" />);

    expect(screen.getByText(/Stroke Neuro-Rehab & Brunnstrom Motor Recovery Simulator/i)).toBeInTheDocument();
    expect(screen.getByText(/Brunnstrom Motor Recovery & Spasticity Evolution/i)).toBeInTheDocument();
    expect(screen.getByText(/PMR Quiz/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Brunnstrom Motor Recovery/i).length).toBeGreaterThan(0);
  });

  it("switches to SCI ASIA & Autonomic Dysreflexia mode and updates SBP simulator", () => {
    render(<PmrLabViewer initialMode="stroke" />);

    const sciTab = screen.getByText(/2. SCI ASIA & Autonomic/i);
    fireEvent.click(sciTab);

    expect(screen.getByText(/Spinal Cord Injury ASIA Scale & Autonomic Dysreflexia Engine/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Grade A/i).length).toBeGreaterThan(0);
  });

  it("toggles PMR Quiz challenge mode", () => {
    render(<PmrLabViewer initialMode="stroke" />);

    const quizBtn = screen.getByText(/PMR Quiz/i);
    fireEvent.click(quizBtn);

    expect(screen.getByText(/Exit Challenge/i)).toBeInTheDocument();
    expect(screen.getByText(/PMR Clinical Challenge/i)).toBeInTheDocument();
  });
});
