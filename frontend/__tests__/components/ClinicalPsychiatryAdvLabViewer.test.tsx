import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ClinicalPsychiatryAdvLabViewer from "../../components/psychiatryadv/ClinicalPsychiatryAdvLabViewer";

describe("ClinicalPsychiatryAdvLabViewer Component", () => {
  it("renders with default Emergencies mode and displays NMS and Serotonin Syndrome station", () => {
    render(<ClinicalPsychiatryAdvLabViewer initialMode="emergencies" />);

    expect(screen.getByText(/Acute Psychiatric Emergencies: NMS \(Dantrolene\), Serotonin Syndrome & Acute EPS/i)).toBeInTheDocument();
    expect(screen.getByText(/Psychiatry Diagnostic Quiz/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Neuroleptic Malignant Syndrome/i).length).toBeGreaterThan(0);
  });

  it("switches to Mood mode and displays Lithium Therapeutic Window simulator", () => {
    render(<ClinicalPsychiatryAdvLabViewer initialMode="emergencies" />);

    const moodTab = screen.getByText(/2. Mood & Lithium Window/i);
    fireEvent.click(moodTab);

    expect(screen.getByText(/Mood Disorders & Psychopharmacology: Bipolar I\/II, Lithium Narrow Window & Ebstein Anomaly/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Lithium/i).length).toBeGreaterThan(0);
  });

  it("toggles Psychiatry Diagnostic Quiz challenge mode", () => {
    render(<ClinicalPsychiatryAdvLabViewer initialMode="emergencies" />);

    const quizBtn = screen.getByText(/Psychiatry Diagnostic Quiz/i);
    fireEvent.click(quizBtn);

    expect(screen.getByText(/Exit Challenge/i)).toBeInTheDocument();
    expect(screen.getByText(/Psychiatry Challenge/i)).toBeInTheDocument();
  });
});
