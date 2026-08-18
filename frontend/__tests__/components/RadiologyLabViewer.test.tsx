import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import RadiologyLabViewer from "../../components/radiology/RadiologyLabViewer";

describe("RadiologyLabViewer Component", () => {
  it("renders with default CXR ABCDE simulator and controls", () => {
    render(<RadiologyLabViewer initialMode="cxrAbcde" />);

    expect(screen.getByText(/Systematic Chest Radiography \(CXR ABCDE\) & Silhouette Sign Simulator/i)).toBeInTheDocument();
    expect(screen.getByText(/Chest Radiograph Projection & Pathological Sign Simulator/i)).toBeInTheDocument();
    expect(screen.getByText(/Radiology Quiz/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Pneumonia/i).length).toBeGreaterThan(0);
  });

  it("switches to Head CT mode and updates Intracranial Hemorrhage matrix", () => {
    render(<RadiologyLabViewer initialMode="cxrAbcde" />);

    const ctTab = screen.getByText(/2. Head CT \(EDH\/SDH\)/i);
    fireEvent.click(ctTab);

    expect(screen.getByText(/Non-Contrast Head CT Intracranial Hemorrhage Matrix \(EDH vs SDH vs SAH\)/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Epidural \(EDH\)/i).length).toBeGreaterThan(0);
  });

  it("toggles Radiology Quiz challenge mode", () => {
    render(<RadiologyLabViewer initialMode="cxrAbcde" />);

    const quizBtn = screen.getByText(/Radiology Quiz/i);
    fireEvent.click(quizBtn);

    expect(screen.getByText(/Exit Challenge/i)).toBeInTheDocument();
    expect(screen.getByText(/Radiology Clinical Challenge/i)).toBeInTheDocument();
  });
});
