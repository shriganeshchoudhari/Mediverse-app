import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import EntLabViewer from "../../components/ent/EntLabViewer";

describe("EntLabViewer Component", () => {
  it("renders with default Tuning Fork simulator and controls", () => {
    render(<EntLabViewer initialMode="audiometry" />);

    expect(screen.getByText(/512 Hz Tuning Fork Simulator, Pure Tone Audiogram & Tympanometry/i)).toBeInTheDocument();
    expect(screen.getByText(/512 Hz Tuning Fork Simulator \(Rinne & Weber\)/i)).toBeInTheDocument();
    expect(screen.getByText(/ENT Quiz/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Tuning Fork/i).length).toBeGreaterThan(0);
  });

  it("switches to Otology mode and updates cholesteatoma classifier", () => {
    render(<EntLabViewer initialMode="audiometry" />);

    const otolTab = screen.getByText(/2. Otology & Cholesteatoma/i);
    fireEvent.click(otolTab);

    expect(screen.getByText(/Otoscopy & Cholesteatoma \(Safe vs Unsafe CSOM\) Classifier/i)).toBeInTheDocument();
    expect(screen.getByText(/Otoscopic Findings & Chronic Otitis Media Classification/i)).toBeInTheDocument();
  });

  it("toggles ENT Quiz challenge mode", () => {
    render(<EntLabViewer initialMode="audiometry" />);

    const quizBtn = screen.getByText(/ENT Quiz/i);
    fireEvent.click(quizBtn);

    expect(screen.getByText(/Exit Challenge/i)).toBeInTheDocument();
    expect(screen.getByText(/Otorhinolaryngology Clinical Challenge/i)).toBeInTheDocument();
  });
});
