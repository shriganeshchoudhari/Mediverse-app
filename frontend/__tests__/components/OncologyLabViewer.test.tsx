import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import OncologyLabViewer from "../../components/oncology/OncologyLabViewer";

describe("OncologyLabViewer Component", () => {
  it("renders with default TNM staging simulator and controls", () => {
    render(<OncologyLabViewer initialMode="tnm" />);

    expect(screen.getByText(/AJCC TNM 8th Edition Staging & Precision Molecular Drivers/i)).toBeInTheDocument();
    expect(screen.getByText(/AJCC TNM 8th Edition Stage Grouping/i)).toBeInTheDocument();
    expect(screen.getByText(/Oncology Quiz/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Stage III/i).length).toBeGreaterThan(0);
  });

  it("switches to Radiobiology mode and updates the 4 Rs of radiobiology", () => {
    render(<OncologyLabViewer initialMode="tnm" />);

    const radioTab = screen.getByText(/3. Radiobiology 4 Rs & SBRT/i);
    fireEvent.click(radioTab);

    expect(screen.getByText(/Radiation Biology \(The 4 Rs\), Linear-Quadratic Model & SBRT/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Reoxygenation/i).length).toBeGreaterThan(0);
  });

  it("toggles Oncology Quiz challenge mode", () => {
    render(<OncologyLabViewer initialMode="tnm" />);

    const quizBtn = screen.getByText(/Oncology Quiz/i);
    fireEvent.click(quizBtn);

    expect(screen.getByText(/Exit Challenge/i)).toBeInTheDocument();
    expect(screen.getByText(/Oncology Challenge/i)).toBeInTheDocument();
  });
});
