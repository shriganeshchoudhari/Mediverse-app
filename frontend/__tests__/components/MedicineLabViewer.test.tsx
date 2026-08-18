import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import MedicineLabViewer from "../../components/medicine/MedicineLabViewer";

describe("MedicineLabViewer Component", () => {
  it("renders with default Cardiology STEMI 12-lead localizer and controls", () => {
    render(<MedicineLabViewer initialMode="cardiology" />);

    expect(screen.getByText(/Cardiovascular Clinical Simulator & 12-Lead STEMI Localizer/i)).toBeInTheDocument();
    expect(screen.getByText(/12-Lead ECG STEMI Territory Localizer & Culprit Artery Engine/i)).toBeInTheDocument();
    expect(screen.getByText(/Medicine Quiz/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Anterior \/ Septal \(LAD\)/i).length).toBeGreaterThan(0);
  });

  it("switches to Pulmonology ABG mode and updates Davenport engine", () => {
    render(<MedicineLabViewer initialMode="cardiology" />);

    const pulmTab = screen.getByText(/2. Pulmonology & ABG/i);
    fireEvent.click(pulmTab);

    expect(screen.getByText(/Pulmonology, ABG Davenport Nomogram & Critical Care Triage/i)).toBeInTheDocument();
    expect(screen.getByText(/Comprehensive Arterial Blood Gas \(ABG\) & Davenport Nomogram Engine/i)).toBeInTheDocument();
  });

  it("toggles Medicine Quiz challenge mode", () => {
    render(<MedicineLabViewer initialMode="cardiology" />);

    const quizBtn = screen.getByText(/Medicine Quiz/i);
    fireEvent.click(quizBtn);

    expect(screen.getByText(/Exit Challenge/i)).toBeInTheDocument();
    expect(screen.getByText(/Internal Medicine Case Challenge/i)).toBeInTheDocument();
  });
});
