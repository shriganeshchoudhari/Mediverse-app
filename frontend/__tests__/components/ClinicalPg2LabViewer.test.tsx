import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ClinicalPg2LabViewer from "../../components/pg2/ClinicalPg2LabViewer";

describe("ClinicalPg2LabViewer Component", () => {
  it("renders with default MCS mode and displays Mechanical Circulatory Support station", () => {
    render(<ClinicalPg2LabViewer initialMode="mcs" />);

    expect(screen.getByText(/Advanced Mechanical Circulatory Support: IABP Timing/i)).toBeInTheDocument();
    expect(screen.getByText(/Subspecialty Consult Quiz/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Impella/i).length).toBeGreaterThan(0);
  });

  it("switches to RPGN mode and displays Rapidly Progressive Glomerulonephritis station", () => {
    render(<ClinicalPg2LabViewer initialMode="mcs" />);

    const rpgnTab = screen.getByText(/2. RPGN & ANCA Biopsy/i);
    fireEvent.click(rpgnTab);

    expect(screen.getByText(/Rapidly Progressive Glomerulonephritis: Biopsy Crescents/i)).toBeInTheDocument();
    expect(screen.getAllByText(/ANCA/i).length).toBeGreaterThan(0);
  });

  it("toggles Subspecialty Consult Quiz challenge mode", () => {
    render(<ClinicalPg2LabViewer initialMode="mcs" />);

    const quizBtn = screen.getByText(/Subspecialty Consult Quiz/i);
    fireEvent.click(quizBtn);

    expect(screen.getByText(/Exit Challenge/i)).toBeInTheDocument();
    expect(screen.getByText(/Fellowship Consult Challenge/i)).toBeInTheDocument();
  });
});
