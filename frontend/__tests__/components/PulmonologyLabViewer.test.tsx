import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import PulmonologyLabViewer from "../../components/pulmonology/PulmonologyLabViewer";

describe("PulmonologyLabViewer Component", () => {
  it("renders with default spirometry engine and PFT sliders", () => {
    render(<PulmonologyLabViewer initialMode="spirometry" />);

    expect(screen.getByText(/PFT Spirometry & Flow-Volume Curve Diagnostic Engine/i)).toBeInTheDocument();
    expect(screen.getByText(/Stepwise Spirometry & DLCO Interpretation/i)).toBeInTheDocument();
    expect(screen.getByText(/Pulmonology Quiz/i)).toBeInTheDocument();
    expect(screen.getByText(/FEV1 \/ FVC Ratio/i)).toBeInTheDocument();
  });

  it("switches to Light's Criteria Pleural mode and updates fluid analyzer", () => {
    render(<PulmonologyLabViewer initialMode="spirometry" />);

    const pleuralTab = screen.getByText(/3. Light's & Pleural Tap/i);
    fireEvent.click(pleuralTab);

    expect(screen.getByText(/Pleural Diseases, Light's Criteria & Empyema Drainage Analyzer/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Pleural\/Serum Protein/i).length).toBeGreaterThan(0);
  });

  it("toggles Pulmonology Quiz challenge mode", () => {
    render(<PulmonologyLabViewer initialMode="spirometry" />);

    const quizBtn = screen.getByText(/Pulmonology Quiz/i);
    fireEvent.click(quizBtn);

    expect(screen.getByText(/Exit Challenge/i)).toBeInTheDocument();
    expect(screen.getByText(/Pulmonology Clinical Challenge/i)).toBeInTheDocument();
  });
});
