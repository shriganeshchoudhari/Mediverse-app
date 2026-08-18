import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ClinicalPg4LabViewer from "../../components/pg4/ClinicalPg4LabViewer";

describe("ClinicalPg4LabViewer Component", () => {
  it("renders with default HIE mode and displays Neonatal HIE station", () => {
    render(<ClinicalPg4LabViewer initialMode="hie" />);

    expect(screen.getByText(/Neonatal HIE: Sarnat Staging/i)).toBeInTheDocument();
    expect(screen.getByText(/Pediatric & NICU Quiz/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Sarnat/i).length).toBeGreaterThan(0);
  });

  it("switches to PPHN mode and displays Persistent Pulmonary Hypertension station", () => {
    render(<ClinicalPg4LabViewer initialMode="hie" />);

    const pphnTab = screen.getByText(/2. PPHN & Inhaled NO/i);
    fireEvent.click(pphnTab);

    expect(screen.getByText(/Persistent Pulmonary Hypertension: Pre\/Post SpO2/i)).toBeInTheDocument();
    expect(screen.getAllByText(/PPHN/i).length).toBeGreaterThan(0);
  });

  it("toggles Pediatric & NICU Quiz challenge mode", () => {
    render(<ClinicalPg4LabViewer initialMode="hie" />);

    const quizBtn = screen.getByText(/Pediatric & NICU Quiz/i);
    fireEvent.click(quizBtn);

    expect(screen.getByText(/Exit Challenge/i)).toBeInTheDocument();
    expect(screen.getByText(/Neonatology \/ PICU Challenge/i)).toBeInTheDocument();
  });
});
