import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import NephrologyLabViewer from "../../components/nephrologyadv/NephrologyLabViewer";

describe("NephrologyLabViewer Component", () => {
  it("renders with default Glomerulopathies mode and displays Minimal Change station", () => {
    render(<NephrologyLabViewer initialMode="glomerular" />);

    expect(screen.getByText(/Glomerulopathies: Nephritic vs Nephrotic Syndromes & Immunofluorescence/i)).toBeInTheDocument();
    expect(screen.getByText(/Nephrology Diagnostic Quiz/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Minimal Change/i).length).toBeGreaterThan(0);
  });

  it("switches to AKI & Urinalysis mode and displays prerenal station", () => {
    render(<NephrologyLabViewer initialMode="glomerular" />);

    const akiTab = screen.getByText(/2. AKI & Urinalysis/i);
    fireEvent.click(akiTab);

    expect(screen.getByText(/Acute Kidney Injury & Urinalysis Casts Diagnostic Profiler/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Prerenal/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Diagnostic Rule/i).length).toBeGreaterThan(0);
  });

  it("toggles Nephrology Diagnostic Quiz challenge mode", () => {
    render(<NephrologyLabViewer initialMode="glomerular" />);

    const quizBtn = screen.getByText(/Nephrology Diagnostic Quiz/i);
    fireEvent.click(quizBtn);

    expect(screen.getByText(/Exit Challenge/i)).toBeInTheDocument();
    expect(screen.getByText(/Nephrology Challenge/i)).toBeInTheDocument();
  });
});
