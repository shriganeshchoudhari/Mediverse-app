import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ClinicalImmunologyAdvLabViewer from "../../components/immunologyadv/ClinicalImmunologyAdvLabViewer";

describe("ClinicalImmunologyAdvLabViewer Component", () => {
  it("renders with default Hypersensitivity mode and displays Type I IgE station", () => {
    render(<ClinicalImmunologyAdvLabViewer initialMode="hypersensitivity" />);

    expect(screen.getByText(/Gell-Coombs Hypersensitivity Pathways: Types I-IV, CDC, ADCC & T-Cell Lysis/i)).toBeInTheDocument();
    expect(screen.getByText(/Immunology Diagnostic Quiz/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Type I/i).length).toBeGreaterThan(0);
  });

  it("switches to Biologics mode and displays Infliximab and Rituximab station", () => {
    render(<ClinicalImmunologyAdvLabViewer initialMode="hypersensitivity" />);

    const bioTab = screen.getByText(/2. Targeted Biologics/i);
    fireEvent.click(bioTab);

    expect(screen.getByText(/Targeted Biologics: Anti-TNF \(Infliximab\), Anti-CD20 \(Rituximab\) & Anti-C5 \(Eculizumab\)/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Rituximab/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Infliximab/i).length).toBeGreaterThan(0);
  });

  it("toggles Immunology Diagnostic Quiz challenge mode", () => {
    render(<ClinicalImmunologyAdvLabViewer initialMode="hypersensitivity" />);

    const quizBtn = screen.getByText(/Immunology Diagnostic Quiz/i);
    fireEvent.click(quizBtn);

    expect(screen.getByText(/Exit Challenge/i)).toBeInTheDocument();
    expect(screen.getByText(/Clinical Immunology Challenge/i)).toBeInTheDocument();
  });
});
