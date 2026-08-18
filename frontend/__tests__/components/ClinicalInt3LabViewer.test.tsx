import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ClinicalInt3LabViewer from "../../components/int3/ClinicalInt3LabViewer";

describe("ClinicalInt3LabViewer Component", () => {
  it("renders with default PPH mode and displays Postpartum Hemorrhage station", () => {
    render(<ClinicalInt3LabViewer initialMode="pph" />);

    expect(screen.getByText(/Obstetric Emergencies: Postpartum Hemorrhage \(4 Ts & Uterotonics\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Emergency Resuscitation Quiz/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Postpartum Hemorrhage/i).length).toBeGreaterThan(0);
  });

  it("switches to NRP mode and displays Neonatal Resuscitation station", () => {
    render(<ClinicalInt3LabViewer initialMode="pph" />);

    const nrpTab = screen.getByText(/2. Neonatal NRP 2025/i);
    fireEvent.click(nrpTab);

    expect(screen.getByText(/Neonatal Resuscitation \(NRP 2025\): The Golden Minute/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Neonatal/i).length).toBeGreaterThan(0);
  });

  it("toggles Emergency Resuscitation Quiz challenge mode", () => {
    render(<ClinicalInt3LabViewer initialMode="pph" />);

    const quizBtn = screen.getByText(/Emergency Resuscitation Quiz/i);
    fireEvent.click(quizBtn);

    expect(screen.getByText(/Exit Challenge/i)).toBeInTheDocument();
    expect(screen.getByText(/Maternal, Neonatal & Pediatric Emergency Challenge/i)).toBeInTheDocument();
  });
});
