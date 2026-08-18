import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ClinicalPg3LabViewer from "../../components/pg3/ClinicalPg3LabViewer";

describe("ClinicalPg3LabViewer Component", () => {
  it("renders with default DCL mode and displays Damage Control Laparotomy station", () => {
    render(<ClinicalPg3LabViewer initialMode="dcl" />);

    expect(screen.getByText(/Damage Control Laparotomy: Lethal Triad/i)).toBeInTheDocument();
    expect(screen.getByText(/Trauma Surgery Quiz/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Lethal Triad/i).length).toBeGreaterThan(0);
  });

  it("switches to Visceral mode and displays Complex Visceral Trauma station", () => {
    render(<ClinicalPg3LabViewer initialMode="dcl" />);

    const visceralTab = screen.getByText(/2. Visceral Trauma & Pringle/i);
    fireEvent.click(visceralTab);

    expect(screen.getByText(/Complex Visceral Trauma: Pringle Maneuver/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Pringle/i).length).toBeGreaterThan(0);
  });

  it("toggles Trauma Surgery Quiz challenge mode", () => {
    render(<ClinicalPg3LabViewer initialMode="dcl" />);

    const quizBtn = screen.getByText(/Trauma Surgery Quiz/i);
    fireEvent.click(quizBtn);

    expect(screen.getByText(/Exit Challenge/i)).toBeInTheDocument();
    expect(screen.getByText(/Trauma Fellow Challenge/i)).toBeInTheDocument();
  });
});
