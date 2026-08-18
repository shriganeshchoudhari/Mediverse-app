import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import PediatricsAdvLabViewer from "../../components/pediatricsadv/PediatricsAdvLabViewer";

describe("PediatricsAdvLabViewer Component", () => {
  it("renders with default Congenital Heart mode and displays Tetralogy of Fallot station", () => {
    render(<PediatricsAdvLabViewer initialMode="heart" />);

    expect(screen.getByText(/Congenital Heart Defects: Cyanotic \(5 Ts: ToF, TGA\) vs Acyanotic Shunts/i)).toBeInTheDocument();
    expect(screen.getByText(/Pediatric Diagnostic Quiz/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Fallot/i).length).toBeGreaterThan(0);
  });

  it("switches to Pediatric GI mode and displays Pyloric Stenosis station", () => {
    render(<PediatricsAdvLabViewer initialMode="heart" />);

    const giTab = screen.getByText(/3. Pediatric GI/i);
    fireEvent.click(giTab);

    expect(screen.getByText(/Pediatric Surgical & GI Emergencies/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Pyloric/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Intussusception/i).length).toBeGreaterThan(0);
  });

  it("toggles Pediatric Diagnostic Quiz challenge mode", () => {
    render(<PediatricsAdvLabViewer initialMode="heart" />);

    const quizBtn = screen.getByText(/Pediatric Diagnostic Quiz/i);
    fireEvent.click(quizBtn);

    expect(screen.getByText(/Exit Challenge/i)).toBeInTheDocument();
    expect(screen.getByText(/Pediatrics Challenge/i)).toBeInTheDocument();
  });
});
