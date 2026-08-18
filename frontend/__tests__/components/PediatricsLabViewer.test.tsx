import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import PediatricsLabViewer from "../../components/pediatrics/PediatricsLabViewer";

describe("PediatricsLabViewer Component", () => {
  it("renders with default Developmental Milestones explorer and controls", () => {
    render(<PediatricsLabViewer initialMode="milestones" />);

    expect(screen.getByText(/Developmental Milestones Age Explorer & Shape Drawing Progression/i)).toBeInTheDocument();
    expect(screen.getByText(/Chronological Age Milestone Explorer/i)).toBeInTheDocument();
    expect(screen.getByText(/Pediatrics Quiz/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Developmental Milestones/i).length).toBeGreaterThan(0);
  });

  it("switches to Neonatal Jaundice mode and updates Bhutani nomogram", () => {
    render(<PediatricsLabViewer initialMode="milestones" />);

    const jaundTab = screen.getByText(/2. Neonatal Jaundice \(AAP\)/i);
    fireEvent.click(jaundTab);

    expect(screen.getByText(/AAP Neonatal Jaundice Phototherapy & Exchange Transfusion Nomogram/i)).toBeInTheDocument();
    expect(screen.getByText(/AAP Bhutani Neonatal Jaundice Phototherapy & Exchange Nomogram/i)).toBeInTheDocument();
  });

  it("toggles Pediatrics Quiz challenge mode", () => {
    render(<PediatricsLabViewer initialMode="milestones" />);

    const quizBtn = screen.getByText(/Pediatrics Quiz/i);
    fireEvent.click(quizBtn);

    expect(screen.getByText(/Exit Challenge/i)).toBeInTheDocument();
    expect(screen.getByText(/Pediatrics & Neonatology Case Challenge/i)).toBeInTheDocument();
  });
});
