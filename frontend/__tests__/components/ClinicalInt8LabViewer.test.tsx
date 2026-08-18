import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ClinicalInt8LabViewer from "../../components/int8/ClinicalInt8LabViewer";

describe("ClinicalInt8LabViewer Component", () => {
  it("renders with default MCCD mode and displays Medico-Legal Jurisprudence station", () => {
    render(<ClinicalInt8LabViewer initialMode="mccd" />);

    expect(screen.getByText(/Medico-Legal Jurisprudence: MCCD Death Certification/i)).toBeInTheDocument();
    expect(screen.getByText(/Exit Competency Quiz/i)).toBeInTheDocument();
    expect(screen.getAllByText(/MCCD/i).length).toBeGreaterThan(0);
  });

  it("switches to EPA mode and displays Entrustable Professional Activities station", () => {
    render(<ClinicalInt8LabViewer initialMode="mccd" />);

    const epaTab = screen.getByText(/2. EPAs & Portfolio/i);
    fireEvent.click(epaTab);

    expect(screen.getByText(/Entrustable Professional Activities: 13 Core EPAs, Chen's 5-Level Scale/i)).toBeInTheDocument();
    expect(screen.getAllByText(/EPAs/i).length).toBeGreaterThan(0);
  });

  it("toggles Exit Competency Quiz challenge mode", () => {
    render(<ClinicalInt8LabViewer initialMode="mccd" />);

    const quizBtn = screen.getByText(/Exit Competency Quiz/i);
    fireEvent.click(quizBtn);

    expect(screen.getByText(/Exit Challenge/i)).toBeInTheDocument();
    expect(screen.getByText(/Exit Milestone Challenge/i)).toBeInTheDocument();
  });
});
