import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import EmergencyMedicineAdvLabViewer from "../../components/emergencymedicineadv/EmergencyMedicineAdvLabViewer";

describe("EmergencyMedicineAdvLabViewer Component", () => {
  it("renders with default ACLS mode and displays Ventricular Fibrillation station", () => {
    render(<EmergencyMedicineAdvLabViewer initialMode="acls" />);

    expect(screen.getByText(/Advanced Cardiac Life Support \(ACLS\): Shockable vs Non-Shockable Arrest/i)).toBeInTheDocument();
    expect(screen.getByText(/Emergency Medicine Quiz/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Ventricular/i).length).toBeGreaterThan(0);
  });

  it("switches to Shock mode and displays Septic Shock station", () => {
    render(<EmergencyMedicineAdvLabViewer initialMode="acls" />);

    const shockTab = screen.getByText(/2. Shock & Sepsis/i);
    fireEvent.click(shockTab);

    expect(screen.getByText(/Hemodynamic Shock Profiles & Sepsis Resuscitation/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Septic/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Cardiogenic/i).length).toBeGreaterThan(0);
  });

  it("toggles Emergency Medicine Quiz challenge mode", () => {
    render(<EmergencyMedicineAdvLabViewer initialMode="acls" />);

    const quizBtn = screen.getByText(/Emergency Medicine Quiz/i);
    fireEvent.click(quizBtn);

    expect(screen.getByText(/Exit Challenge/i)).toBeInTheDocument();
    expect(screen.getByText(/Emergency Resuscitation Challenge/i)).toBeInTheDocument();
  });
});
