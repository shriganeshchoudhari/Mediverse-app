import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ClinicalMedicineAdvLabViewer from "../../components/medicineadv/ClinicalMedicineAdvLabViewer";

describe("ClinicalMedicineAdvLabViewer Component", () => {
  it("renders with default ACS mode and displays Inferior and Anterior STEMI station", () => {
    render(<ClinicalMedicineAdvLabViewer initialMode="acs" />);

    expect(screen.getByText(/Acute Coronary Syndromes \(ACS\): ECG Localization, Primary PCI & RV Infarct Preload/i)).toBeInTheDocument();
    expect(screen.getByText(/Medicine Diagnostic Quiz/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Anterior LAD/i).length).toBeGreaterThan(0);
  });

  it("switches to HFrEF GDMT mode and displays ARNI and Beta-Blocker station", () => {
    render(<ClinicalMedicineAdvLabViewer initialMode="acs" />);

    const hfTab = screen.getByText(/2. HFrEF 4-Pillar GDMT/i);
    fireEvent.click(hfTab);

    expect(screen.getByText(/Heart Failure with Reduced Ejection Fraction \(HFrEF\): 4-Pillar GDMT Optimization/i)).toBeInTheDocument();
    expect(screen.getAllByText(/ARNI/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Beta-Blocker/i).length).toBeGreaterThan(0);
  });

  it("toggles Medicine Diagnostic Quiz challenge mode", () => {
    render(<ClinicalMedicineAdvLabViewer initialMode="acs" />);

    const quizBtn = screen.getByText(/Medicine Diagnostic Quiz/i);
    fireEvent.click(quizBtn);

    expect(screen.getByText(/Exit Challenge/i)).toBeInTheDocument();
    expect(screen.getByText(/Internal Medicine Challenge/i)).toBeInTheDocument();
  });
});
