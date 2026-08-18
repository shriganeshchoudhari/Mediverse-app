import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ClinicalPharmacologyLabViewer from "../../components/pharmacologyadv/ClinicalPharmacologyLabViewer";

describe("ClinicalPharmacologyLabViewer Component", () => {
  it("renders with default TDM mode and displays Vancomycin station", () => {
    render(<ClinicalPharmacologyLabViewer initialMode="tdm" />);

    expect(screen.getByText(/Therapeutic Drug Monitoring \(TDM\) & Non-Linear Elimination Kinetics/i)).toBeInTheDocument();
    expect(screen.getByText(/Pharmacology Diagnostic Quiz/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Vancomycin/i).length).toBeGreaterThan(0);
  });

  it("switches to Anticoagulation Reversal mode and displays Idarucizumab station", () => {
    render(<ClinicalPharmacologyLabViewer initialMode="tdm" />);

    const acTab = screen.getByText(/3. Anticoagulation Reversal/i);
    fireEvent.click(acTab);

    expect(screen.getByText(/Anticoagulation Reversal Protocols & Target Antidotes/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Idarucizumab/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Dabigatran/i).length).toBeGreaterThan(0);
  });

  it("toggles Pharmacology Diagnostic Quiz challenge mode", () => {
    render(<ClinicalPharmacologyLabViewer initialMode="tdm" />);

    const quizBtn = screen.getByText(/Pharmacology Diagnostic Quiz/i);
    fireEvent.click(quizBtn);

    expect(screen.getByText(/Exit Challenge/i)).toBeInTheDocument();
    expect(screen.getByText(/Clinical Pharmacology Challenge/i)).toBeInTheDocument();
  });
});
