import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import HospitalAdminLabViewer from "../../components/hospitaladmin/HospitalAdminLabViewer";

describe("HospitalAdminLabViewer Component", () => {
  it("renders with default BMWM segregation matrix and controls", () => {
    render(<HospitalAdminLabViewer initialMode="bmwm" />);

    expect(screen.getByText(/Biomedical Waste Management \(BMWM Rules 2016\) & Segregation Matrix/i)).toBeInTheDocument();
    expect(screen.getByText(/BMWM Rules 2016 Color-Coded Segregation Matrix/i)).toBeInTheDocument();
    expect(screen.getByText(/Hospital Admin Quiz/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Yellow Bag/i).length).toBeGreaterThan(0);
  });

  it("switches to Infection Control mode and displays care bundles engine", () => {
    render(<HospitalAdminLabViewer initialMode="bmwm" />);

    const hicTab = screen.getByText(/2. Infection Bundles/i);
    fireEvent.click(hicTab);

    expect(screen.getByText(/Hospital Infection Control \(HIC\), Care Bundles & WHO 5 Moments/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Evidence-Based Infection Control Care Bundles/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/CLABSI/i).length).toBeGreaterThan(0);
  });

  it("toggles Hospital Admin Quiz challenge mode", () => {
    render(<HospitalAdminLabViewer initialMode="bmwm" />);

    const quizBtn = screen.getByText(/Hospital Admin Quiz/i);
    fireEvent.click(quizBtn);

    expect(screen.getByText(/Exit Challenge/i)).toBeInTheDocument();
    expect(screen.getByText(/Healthcare Quality Challenge/i)).toBeInTheDocument();
  });
});
