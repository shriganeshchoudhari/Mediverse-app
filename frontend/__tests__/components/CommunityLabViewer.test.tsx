import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import CommunityLabViewer from "../../components/community/CommunityLabViewer";

describe("CommunityLabViewer Component", () => {
  it("renders with default Screening 2x2 matrix and controls", () => {
    render(<CommunityLabViewer initialMode="screening" />);

    expect(screen.getByText(/Diagnostic Screening, 2x2 Matrix & Dynamic ROC Curve/i)).toBeInTheDocument();
    expect(screen.getByText(/Interactive 2x2 Contingency Matrix & Screening Calculator/i)).toBeInTheDocument();
    expect(screen.getByText(/Public Health Quiz/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Sensitivity \(SnNOut\)/i).length).toBeGreaterThan(0);
  });

  it("switches to Infectious Dynamics mode and updates R0 simulator", () => {
    render(<CommunityLabViewer initialMode="screening" />);

    const infTab = screen.getByText(/3. R0 & Herd Immunity/i);
    fireEvent.click(infTab);

    expect(screen.getByText(/Infectious Disease Transmission & Herd Immunity Threshold/i)).toBeInTheDocument();
    expect(screen.getByText(/Basic Reproduction Number \(R0\) & Herd Immunity Threshold Simulator/i)).toBeInTheDocument();
  });

  it("toggles Public Health Quiz challenge mode", () => {
    render(<CommunityLabViewer initialMode="screening" />);

    const quizBtn = screen.getByText(/Public Health Quiz/i);
    fireEvent.click(quizBtn);

    expect(screen.getByText(/Exit Challenge/i)).toBeInTheDocument();
    expect(screen.getByText(/Public Health Challenge/i)).toBeInTheDocument();
  });
});
