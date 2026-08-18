import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ClinicalInt1LabViewer from "../../components/int1/ClinicalInt1LabViewer";

describe("ClinicalInt1LabViewer Component", () => {
  it("renders with default ACLS mode and displays Advanced Cardiac Life Support station", () => {
    render(<ClinicalInt1LabViewer initialMode="acls" />);

    expect(screen.getByText(/Advanced Cardiac Life Support \(ACLS 2025\): Shockable VF\/pVT/i)).toBeInTheDocument();
    expect(screen.getByText(/Resuscitation Quiz/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Shockable/i).length).toBeGreaterThan(0);
  });

  it("switches to Sepsis mode and displays Sepsis-3 Resuscitation station", () => {
    render(<ClinicalInt1LabViewer initialMode="acls" />);

    const sepsisTab = screen.getByText(/2. Sepsis-3 Resuscitation/i);
    fireEvent.click(sepsisTab);

    expect(screen.getByText(/Sepsis-3 Resuscitation: Surviving Sepsis Hour-1 Bundle/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Sepsis/i).length).toBeGreaterThan(0);
  });

  it("toggles Resuscitation Quiz challenge mode", () => {
    render(<ClinicalInt1LabViewer initialMode="acls" />);

    const quizBtn = screen.getByText(/Resuscitation Quiz/i);
    fireEvent.click(quizBtn);

    expect(screen.getByText(/Exit Challenge/i)).toBeInTheDocument();
    expect(screen.getByText(/Emergency Resuscitation Challenge/i)).toBeInTheDocument();
  });
});
