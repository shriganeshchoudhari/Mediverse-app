import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ClinicalInt5LabViewer from "../../components/int5/ClinicalInt5LabViewer";

describe("ClinicalInt5LabViewer Component", () => {
  it("renders with default Abdomen mode and displays Acute Abdomen station", () => {
    render(<ClinicalInt5LabViewer initialMode="abdomen" />);

    expect(screen.getByText(/Acute Abdomen Triage: Alvarado Score/i)).toBeInTheDocument();
    expect(screen.getByText(/Trauma & Surgery Quiz/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Alvarado/i).length).toBeGreaterThan(0);
  });

  it("switches to Burns mode and displays Thermal Burns & Parkland station", () => {
    render(<ClinicalInt5LabViewer initialMode="abdomen" />);

    const burnsTab = screen.getByText(/2. Burns & Parkland/i);
    fireEvent.click(burnsTab);

    expect(screen.getByText(/Thermal Burns: Rule of Nines \(%TBSA\), Parkland Formula/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Parkland/i).length).toBeGreaterThan(0);
  });

  it("toggles Trauma & Surgery Quiz challenge mode", () => {
    render(<ClinicalInt5LabViewer initialMode="abdomen" />);

    const quizBtn = screen.getByText(/Trauma & Surgery Quiz/i);
    fireEvent.click(quizBtn);

    expect(screen.getByText(/Exit Challenge/i)).toBeInTheDocument();
    expect(screen.getByText(/Surgical & Trauma Call Challenge/i)).toBeInTheDocument();
  });
});
