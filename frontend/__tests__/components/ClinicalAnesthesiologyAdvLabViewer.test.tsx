import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ClinicalAnesthesiologyAdvLabViewer from "../../components/anesthesiologyadv/ClinicalAnesthesiologyAdvLabViewer";

describe("ClinicalAnesthesiologyAdvLabViewer Component", () => {
  it("renders with default Airway mode and displays CICO Cricothyroidotomy station", () => {
    render(<ClinicalAnesthesiologyAdvLabViewer initialMode="airway" />);

    expect(screen.getByText(/Difficult Airway Algorithms: LEMON Score, Mallampati I-IV & FONA Cricothyroidotomy/i)).toBeInTheDocument();
    expect(screen.getByText(/Anesthesia Diagnostic Quiz/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Cannot Intubate Cannot Oxygenate/i).length).toBeGreaterThan(0);
  });

  it("switches to Toxicity mode and displays LAST 20% Lipid Emulsion calculator", () => {
    render(<ClinicalAnesthesiologyAdvLabViewer initialMode="airway" />);

    const toxTab = screen.getByText(/2. LAST & Lipid Rescue/i);
    fireEvent.click(toxTab);

    expect(screen.getByText(/Local Anesthetic Systemic Toxicity \(LAST\): Bupivacaine & 20% Lipid Emulsion Rescue/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Lipid Emulsion/i).length).toBeGreaterThan(0);
  });

  it("toggles Anesthesia Diagnostic Quiz challenge mode", () => {
    render(<ClinicalAnesthesiologyAdvLabViewer initialMode="airway" />);

    const quizBtn = screen.getByText(/Anesthesia Diagnostic Quiz/i);
    fireEvent.click(quizBtn);

    expect(screen.getByText(/Exit Challenge/i)).toBeInTheDocument();
    expect(screen.getByText(/Anesthesiology Challenge/i)).toBeInTheDocument();
  });
});
