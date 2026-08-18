import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ClinicalEce2LabViewer from "../../components/ece2/ClinicalEce2LabViewer";

describe("ClinicalEce2LabViewer Component", () => {
  it("renders with default Safety mode and displays Swiss Cheese & RCA station", () => {
    render(<ClinicalEce2LabViewer initialMode="safety" />);

    expect(screen.getByText(/Patient Safety & Incident Analysis: Swiss Cheese Model, RCA \(Ishikawa\) & FMEA/i)).toBeInTheDocument();
    expect(screen.getByText(/ECE 2 Quality Quiz/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Swiss Cheese/i).length).toBeGreaterThan(0);
  });

  it("switches to SBAR mode and displays Interprofessional Handover station", () => {
    render(<ClinicalEce2LabViewer initialMode="safety" />);

    const sbTab = screen.getByText(/2. SBAR & TeamSTEPPS/i);
    fireEvent.click(sbTab);

    expect(screen.getByText(/Interprofessional Communication: SBAR Handover, TeamSTEPPS, CUS & Two-Challenge Rule/i)).toBeInTheDocument();
    expect(screen.getAllByText(/SBAR/i).length).toBeGreaterThan(0);
  });

  it("toggles ECE 2 Quality Quiz challenge mode", () => {
    render(<ClinicalEce2LabViewer initialMode="safety" />);

    const quizBtn = screen.getByText(/ECE 2 Quality Quiz/i);
    fireEvent.click(quizBtn);

    expect(screen.getByText(/Exit Challenge/i)).toBeInTheDocument();
    expect(screen.getByText(/Patient Safety Challenge/i)).toBeInTheDocument();
  });
});
