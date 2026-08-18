import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ClinicalInt6LabViewer from "../../components/int6/ClinicalInt6LabViewer";

describe("ClinicalInt6LabViewer Component", () => {
  it("renders with default NTEP mode and displays Tuberculosis & HIV station", () => {
    render(<ClinicalInt6LabViewer initialMode="ntep" />);

    expect(screen.getByText(/National Health Programs: NTEP TB Regimens/i)).toBeInTheDocument();
    expect(screen.getByText(/Public Health Quiz/i)).toBeInTheDocument();
    expect(screen.getAllByText(/NTEP/i).length).toBeGreaterThan(0);
  });

  it("switches to Malaria mode and displays Vector-Borne Diseases station", () => {
    render(<ClinicalInt6LabViewer initialMode="ntep" />);

    const malariaTab = screen.getByText(/2. Malaria & Dengue/i);
    fireEvent.click(malariaTab);

    expect(screen.getByText(/Vector-Borne Diseases: NVBDCP Malaria \(ACT-SP & 14d Primaquine\)/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Malaria/i).length).toBeGreaterThan(0);
  });

  it("toggles Public Health Quiz challenge mode", () => {
    render(<ClinicalInt6LabViewer initialMode="ntep" />);

    const quizBtn = screen.getByText(/Public Health Quiz/i);
    fireEvent.click(quizBtn);

    expect(screen.getByText(/Exit Challenge/i)).toBeInTheDocument();
    expect(screen.getByText(/Community Health Challenge/i)).toBeInTheDocument();
  });
});
