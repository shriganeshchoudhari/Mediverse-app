import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import TransfusionLabViewer from "../../components/transfusion/TransfusionLabViewer";

describe("TransfusionLabViewer Component", () => {
  it("renders with default ABO/Rh & Bombay typing simulator and controls", () => {
    render(<TransfusionLabViewer initialMode="typing" />);

    expect(screen.getByText(/ABO\/Rh Blood Typing, Bombay Phenotype & Coombs Crossmatching/i)).toBeInTheDocument();
    expect(screen.getByText(/ABO & Rare Bombay Phenotype Compatibility/i)).toBeInTheDocument();
    expect(screen.getByText(/Transfusion Quiz/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Bombay/i).length).toBeGreaterThan(0);
  });

  it("switches to Reactions mode and displays TRALI vs TACO differential matrix", () => {
    render(<TransfusionLabViewer initialMode="typing" />);

    const rxnTab = screen.getByText(/3. TRALI vs TACO & AHTR/i);
    fireEvent.click(rxnTab);

    expect(screen.getByText(/Differential Diagnosis: TRALI vs TACO & Acute Hemolytic Reactions/i)).toBeInTheDocument();
    expect(screen.getAllByText(/TRALI/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/TACO/i).length).toBeGreaterThan(0);
  });

  it("toggles Transfusion Quiz challenge mode", () => {
    render(<TransfusionLabViewer initialMode="typing" />);

    const quizBtn = screen.getByText(/Transfusion Quiz/i);
    fireEvent.click(quizBtn);

    expect(screen.getByText(/Exit Challenge/i)).toBeInTheDocument();
    expect(screen.getByText(/Immunohematology Challenge/i)).toBeInTheDocument();
  });
});
