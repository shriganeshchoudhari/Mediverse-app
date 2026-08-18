import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ClinicalInt4LabViewer from "../../components/int4/ClinicalInt4LabViewer";

describe("ClinicalInt4LabViewer Component", () => {
  it("renders with default ACS mode and displays Acute Coronary Syndromes station", () => {
    render(<ClinicalInt4LabViewer initialMode="acs" />);

    expect(screen.getByText(/Acute Coronary Syndromes: STEMI Reperfusion/i)).toBeInTheDocument();
    expect(screen.getByText(/Inpatient Consult Quiz/i)).toBeInTheDocument();
    expect(screen.getAllByText(/STEMI/i).length).toBeGreaterThan(0);
  });

  it("switches to DKA mode and displays Hyperglycemic Crises station", () => {
    render(<ClinicalInt4LabViewer initialMode="acs" />);

    const dkaTab = screen.getByText(/2. DKA & HHS/i);
    fireEvent.click(dkaTab);

    expect(screen.getByText(/Hyperglycemic Crises: DKA vs HHS, Potassium Safety/i)).toBeInTheDocument();
    expect(screen.getAllByText(/DKA/i).length).toBeGreaterThan(0);
  });

  it("toggles Inpatient Consult Quiz challenge mode", () => {
    render(<ClinicalInt4LabViewer initialMode="acs" />);

    const quizBtn = screen.getByText(/Inpatient Consult Quiz/i);
    fireEvent.click(quizBtn);

    expect(screen.getByText(/Exit Challenge/i)).toBeInTheDocument();
    expect(screen.getByText(/Inpatient Medicine Challenge/i)).toBeInTheDocument();
  });
});
