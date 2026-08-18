import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import CriticalCareLabViewer from "../../components/criticalcareadv/CriticalCareLabViewer";

describe("CriticalCareLabViewer Component", () => {
  it("renders with default Hemodynamics mode and displays Oxygen Delivery station", () => {
    render(<CriticalCareLabViewer initialMode="hemodynamics" />);

    expect(screen.getByText(/Advanced Hemodynamics: DO2\/VO2 Dynamics, Swan-Ganz Catheter & SvO2/i)).toBeInTheDocument();
    expect(screen.getByText(/Critical Care Diagnostic Quiz/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Oxygen Delivery/i).length).toBeGreaterThan(0);
  });

  it("switches to ARDS mode and displays Berlin Criteria and Low-VT station", () => {
    render(<CriticalCareLabViewer initialMode="hemodynamics" />);

    const ardsTab = screen.getByText(/2. ARDS & Ventilation/i);
    fireEvent.click(ardsTab);

    expect(screen.getByText(/ARDS Berlin Severity & ARDSNet Lung-Protective Strategy/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Berlin/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Severe/i).length).toBeGreaterThan(0);
  });

  it("toggles Critical Care Diagnostic Quiz challenge mode", () => {
    render(<CriticalCareLabViewer initialMode="hemodynamics" />);

    const quizBtn = screen.getByText(/Critical Care Diagnostic Quiz/i);
    fireEvent.click(quizBtn);

    expect(screen.getByText(/Exit Challenge/i)).toBeInTheDocument();
    expect(screen.getByText(/Critical Care Challenge/i)).toBeInTheDocument();
  });
});
