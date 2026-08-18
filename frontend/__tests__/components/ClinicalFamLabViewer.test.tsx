import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ClinicalFamLabViewer from "../../components/fam/ClinicalFamLabViewer";

describe("ClinicalFamLabViewer Component", () => {
  it("renders with default Screening mode and displays USPSTF Cancer Surveillance station", () => {
    render(<ClinicalFamLabViewer initialMode="screening" />);

    expect(screen.getByText(/Preventive Health Screening: USPSTF Cancer Surveillance/i)).toBeInTheDocument();
    expect(screen.getByText(/Family Medicine Quiz/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Colorectal/i).length).toBeGreaterThan(0);
  });

  it("switches to Chronic mode and displays Hypertension & Diabetes station", () => {
    render(<ClinicalFamLabViewer initialMode="screening" />);

    const chronicTab = screen.getByText(/2. Chronic Disease Protocols/i);
    fireEvent.click(chronicTab);

    expect(screen.getByText(/Chronic Disease Protocols: ACC\/AHA Hypertension, ADA 2024 Diabetes & ASCVD Statins/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Hypertension/i).length).toBeGreaterThan(0);
  });

  it("toggles Family Medicine Quiz challenge mode", () => {
    render(<ClinicalFamLabViewer initialMode="screening" />);

    const quizBtn = screen.getByText(/Family Medicine Quiz/i);
    fireEvent.click(quizBtn);

    expect(screen.getByText(/Exit Challenge/i)).toBeInTheDocument();
    expect(screen.getByText(/Primary Care Challenge/i)).toBeInTheDocument();
  });
});
