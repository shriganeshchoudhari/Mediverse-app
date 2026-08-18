import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ClinicalInt7LabViewer from "../../components/int7/ClinicalInt7LabViewer";

describe("ClinicalInt7LabViewer Component", () => {
  it("renders with default Derm mode and displays Inpatient Dermatology station", () => {
    render(<ClinicalInt7LabViewer initialMode="derm" />);

    expect(screen.getByText(/Inpatient Dermatology: SJS\/TEN Spectrum/i)).toBeInTheDocument();
    expect(screen.getByText(/Subspecialty Consult Quiz/i)).toBeInTheDocument();
    expect(screen.getAllByText(/SJS/i).length).toBeGreaterThan(0);
  });

  it("switches to Psych mode and displays Emergency Psychiatry station", () => {
    render(<ClinicalInt7LabViewer initialMode="derm" />);

    const psychTab = screen.getByText(/2. NMS & Psychiatry/i);
    fireEvent.click(psychTab);

    expect(screen.getByText(/Emergency Psychiatry: NMS \(Dantrolene\), Serotonin Syndrome/i)).toBeInTheDocument();
    expect(screen.getAllByText(/NMS/i).length).toBeGreaterThan(0);
  });

  it("toggles Subspecialty Consult Quiz challenge mode", () => {
    render(<ClinicalInt7LabViewer initialMode="derm" />);

    const quizBtn = screen.getByText(/Subspecialty Consult Quiz/i);
    fireEvent.click(quizBtn);

    expect(screen.getByText(/Exit Challenge/i)).toBeInTheDocument();
    expect(screen.getByText(/Subspecialty Challenge/i)).toBeInTheDocument();
  });
});
