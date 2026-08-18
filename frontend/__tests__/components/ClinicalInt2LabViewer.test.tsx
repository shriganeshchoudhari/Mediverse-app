import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ClinicalInt2LabViewer from "../../components/int2/ClinicalInt2LabViewer";

describe("ClinicalInt2LabViewer Component", () => {
  it("renders with default Vascular mode and displays Central Venous Lines station", () => {
    render(<ClinicalInt2LabViewer initialMode="vascular" />);

    expect(screen.getByText(/Vascular Access & Arterial Lines: Central Venous Lines/i)).toBeInTheDocument();
    expect(screen.getByText(/Procedural Skills Quiz/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Internal Jugular/i).length).toBeGreaterThan(0);
  });

  it("switches to Fluids mode and displays Paracentesis & Thoracentesis station", () => {
    render(<ClinicalInt2LabViewer initialMode="vascular" />);

    const fluidsTab = screen.getByText(/2. Paracentesis & Light's/i);
    fireEvent.click(fluidsTab);

    expect(screen.getByText(/Diagnostic Paracentesis & Thoracentesis: SAAG Calculation, SBP/i)).toBeInTheDocument();
    expect(screen.getAllByText(/SAAG/i).length).toBeGreaterThan(0);
  });

  it("toggles Procedural Skills Quiz challenge mode", () => {
    render(<ClinicalInt2LabViewer initialMode="vascular" />);

    const quizBtn = screen.getByText(/Procedural Skills Quiz/i);
    fireEvent.click(quizBtn);

    expect(screen.getByText(/Exit Challenge/i)).toBeInTheDocument();
    expect(screen.getByText(/Procedural & Ultrasound Challenge/i)).toBeInTheDocument();
  });
});
