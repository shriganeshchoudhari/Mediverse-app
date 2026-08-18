import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ClinicalRadiologyAdvLabViewer from "../../components/radiologyadv/ClinicalRadiologyAdvLabViewer";

describe("ClinicalRadiologyAdvLabViewer Component", () => {
  it("renders with default Contrast Safety mode and displays CIN station", () => {
    render(<ClinicalRadiologyAdvLabViewer initialMode="contrast" />);

    expect(screen.getByText(/Contrast Media Safety: CIN\/PC-AKI Hydration, Metformin Rules & Macrocyclic GBCAs/i)).toBeInTheDocument();
    expect(screen.getByText(/Radiology Diagnostic Quiz/i)).toBeInTheDocument();
    expect(screen.getAllByText(/CIN Hydration/i).length).toBeGreaterThan(0);
  });

  it("switches to HRCT Chest Patterns mode and displays UIP and Halo Sign station", () => {
    render(<ClinicalRadiologyAdvLabViewer initialMode="contrast" />);

    const hrctTab = screen.getByText(/2. HRCT Chest Patterns/i);
    fireEvent.click(hrctTab);

    expect(screen.getByText(/High-Resolution Chest CT \(HRCT\): UIP Honeycombing, NSIP Subpleural Sparing & The Halo Sign/i)).toBeInTheDocument();
    expect(screen.getAllByText(/UIP/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Halo Sign/i).length).toBeGreaterThan(0);
  });

  it("toggles Radiology Diagnostic Quiz challenge mode", () => {
    render(<ClinicalRadiologyAdvLabViewer initialMode="contrast" />);

    const quizBtn = screen.getByText(/Radiology Diagnostic Quiz/i);
    fireEvent.click(quizBtn);

    expect(screen.getByText(/Exit Challenge/i)).toBeInTheDocument();
    expect(screen.getByText(/Diagnostic Radiology Challenge/i)).toBeInTheDocument();
  });
});
