import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import PulmonologyAdvLabViewer from "../../components/pulmonologyadv/PulmonologyAdvLabViewer";

describe("PulmonologyAdvLabViewer Component", () => {
  it("renders with default PFT mode and displays Obstructive Disease station", () => {
    render(<PulmonologyAdvLabViewer initialMode="pft" />);

    expect(screen.getByText(/Flow-Volume Loops & Pulmonary Function Testing \(PFT\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Pulmonology Diagnostic Quiz/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Obstructive Disease/i).length).toBeGreaterThan(0);
  });

  it("switches to Ventilator Mechanics mode and displays resistance station", () => {
    render(<PulmonologyAdvLabViewer initialMode="pft" />);

    const ventTab = screen.getByText(/2. Vent Mechanics/i);
    fireEvent.click(ventTab);

    expect(screen.getByText(/Ventilator Mechanics & Pressure Alarm Troubleshooting/i)).toBeInTheDocument();
    expect(screen.getAllByText(/High Airway Resistance/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Clinical Pearl/i).length).toBeGreaterThan(0);
  });

  it("toggles Pulmonology Diagnostic Quiz challenge mode", () => {
    render(<PulmonologyAdvLabViewer initialMode="pft" />);

    const quizBtn = screen.getByText(/Pulmonology Diagnostic Quiz/i);
    fireEvent.click(quizBtn);

    expect(screen.getByText(/Exit Challenge/i)).toBeInTheDocument();
    expect(screen.getByText(/Pulmonology Challenge/i)).toBeInTheDocument();
  });
});
