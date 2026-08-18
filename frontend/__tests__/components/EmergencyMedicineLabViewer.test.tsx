import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import EmergencyMedicineLabViewer from "../../components/emergencymedicine/EmergencyMedicineLabViewer";

describe("EmergencyMedicineLabViewer Component", () => {
  it("renders with default ACLS arrest simulator and controls", () => {
    render(<EmergencyMedicineLabViewer initialMode="acls" />);

    expect(screen.getByText(/ACLS Cardiac Arrest & Defibrillation Resuscitation Simulator/i)).toBeInTheDocument();
    expect(screen.getByText(/AHA ACLS Cardiac Arrest Algorithm & Defibrillation/i)).toBeInTheDocument();
    expect(screen.getByText(/Emergency Quiz/i)).toBeInTheDocument();
    expect(screen.getAllByText(/VF/i).length).toBeGreaterThan(0);
  });

  it("switches to Toxicology & Nomogram mode and updates APAP calculator", () => {
    render(<EmergencyMedicineLabViewer initialMode="acls" />);

    const toxTab = screen.getByText(/3. Toxicology & Antidotes/i);
    fireEvent.click(toxTab);

    expect(screen.getByText(/Toxicology Toxidromes & Rumack-Matthew APAP Nomogram Calculator/i)).toBeInTheDocument();
    expect(screen.getByText(/Acetaminophen Rumack-Matthew Nomogram Calculator/i)).toBeInTheDocument();
  });

  it("toggles Emergency Quiz challenge mode", () => {
    render(<EmergencyMedicineLabViewer initialMode="acls" />);

    const quizBtn = screen.getByText(/Emergency Quiz/i);
    fireEvent.click(quizBtn);

    expect(screen.getByText(/Exit Challenge/i)).toBeInTheDocument();
    expect(screen.getByText(/Emergency Medicine Challenge/i)).toBeInTheDocument();
  });
});
