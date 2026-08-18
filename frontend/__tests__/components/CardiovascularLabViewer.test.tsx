import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import CardiovascularLabViewer from "../../components/cardiovascularadv/CardiovascularLabViewer";

describe("CardiovascularLabViewer Component", () => {
  it("renders with default PV Loop mode and displays Aortic Stenosis station", () => {
    render(<CardiovascularLabViewer initialMode="pvloop" />);

    expect(screen.getByText(/Wiggers Diagram & Valvular Pressure-Volume \(PV\) Loops/i)).toBeInTheDocument();
    expect(screen.getByText(/Cardio Hemodynamics Quiz/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Aortic Stenosis/i).length).toBeGreaterThan(0);
  });

  it("switches to Shock Profiling mode and displays shock station", () => {
    render(<CardiovascularLabViewer initialMode="pvloop" />);

    const shockTab = screen.getByText(/3. Shock Profiling/i);
    fireEvent.click(shockTab);

    expect(screen.getByText(/Invasive Shock Profiling \(Swan-Ganz\) & Heart Failure Phenotypes/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Cardiogenic/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Hemodynamic Pearl/i).length).toBeGreaterThan(0);
  });

  it("toggles Cardio Hemodynamics Quiz challenge mode", () => {
    render(<CardiovascularLabViewer initialMode="pvloop" />);

    const quizBtn = screen.getByText(/Cardio Hemodynamics Quiz/i);
    fireEvent.click(quizBtn);

    expect(screen.getByText(/Exit Challenge/i)).toBeInTheDocument();
    expect(screen.getByText(/Cardiovascular Hemodynamics Challenge/i)).toBeInTheDocument();
  });
});
