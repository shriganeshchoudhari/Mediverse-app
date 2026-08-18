import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ClinicalPg1LabViewer from "../../components/pg1/ClinicalPg1LabViewer";

describe("ClinicalPg1LabViewer Component", () => {
  it("renders with default Hemo mode and displays Critical Care Hemodynamics station", () => {
    render(<ClinicalPg1LabViewer initialMode="hemo" />);

    expect(screen.getByText(/Critical Care Hemodynamics: Swan-Ganz Thermodilution/i)).toBeInTheDocument();
    expect(screen.getByText(/Residency Readiness Quiz/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Swan-Ganz/i).length).toBeGreaterThan(0);
  });

  it("switches to Vent mode and displays Mechanical Ventilation station", () => {
    render(<ClinicalPg1LabViewer initialMode="hemo" />);

    const ventTab = screen.getByText(/2. Ventilation & ARDS/i);
    fireEvent.click(ventTab);

    expect(screen.getByText(/Advanced Mechanical Ventilation: ARDSNet Driving Pressure/i)).toBeInTheDocument();
    expect(screen.getAllByText(/ARDS/i).length).toBeGreaterThan(0);
  });

  it("toggles Residency Readiness Quiz challenge mode", () => {
    render(<ClinicalPg1LabViewer initialMode="hemo" />);

    const quizBtn = screen.getByText(/Residency Readiness Quiz/i);
    fireEvent.click(quizBtn);

    expect(screen.getByText(/Exit Challenge/i)).toBeInTheDocument();
    expect(screen.getByText(/Residency Fellow Challenge/i)).toBeInTheDocument();
  });
});
