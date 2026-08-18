import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ClinicalNeuroanatomyLabViewer from "../../components/neuroanatomy/ClinicalNeuroanatomyLabViewer";

describe("ClinicalNeuroanatomyLabViewer Component", () => {
  it("renders with default Brainstem Strokes mode and displays Wallenberg station", () => {
    render(<ClinicalNeuroanatomyLabViewer initialMode="brainstem" />);

    expect(screen.getByText(/Brainstem Stroke Syndromes \(Wallenberg PICA, Dejerine ASA, Weber\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Neuro Localizer Quiz/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Wallenberg/i).length).toBeGreaterThan(0);
  });

  it("switches to Spinal Cord mode and displays spinal cord station", () => {
    render(<ClinicalNeuroanatomyLabViewer initialMode="brainstem" />);

    const spinalTab = screen.getByText(/2. Spinal Cord/i);
    fireEvent.click(spinalTab);

    expect(screen.getByText(/Spinal Cord Syndromes \(Brown-Séquard, ASA Infarct, Syringomyelia, SCD\)/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Brown-Séquard/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Diagnostic Pearl/i).length).toBeGreaterThan(0);
  });

  it("toggles Neuro Localizer Quiz challenge mode", () => {
    render(<ClinicalNeuroanatomyLabViewer initialMode="brainstem" />);

    const quizBtn = screen.getByText(/Neuro Localizer Quiz/i);
    fireEvent.click(quizBtn);

    expect(screen.getByText(/Exit Challenge/i)).toBeInTheDocument();
    expect(screen.getByText(/Neuroanatomy Localization Challenge/i)).toBeInTheDocument();
  });
});
