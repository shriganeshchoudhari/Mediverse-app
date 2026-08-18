import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ClinicalClin2LabViewer from "../../components/clin2/ClinicalClin2LabViewer";

describe("ClinicalClin2LabViewer Component", () => {
  it("renders with default Preop mode and displays Preoperative Risk & RCRI station", () => {
    render(<ClinicalClin2LabViewer initialMode="preop" />);

    expect(screen.getByText(/Preoperative Risk Stratification: RCRI Lee Criteria, ASA Physical Status & METs/i)).toBeInTheDocument();
    expect(screen.getByText(/Surgery Postings Quiz/i)).toBeInTheDocument();
    expect(screen.getAllByText(/RCRI/i).length).toBeGreaterThan(0);
  });

  it("switches to Fever mode and displays Postoperative Fever 5 Ws station", () => {
    render(<ClinicalClin2LabViewer initialMode="preop" />);

    const feverTab = screen.getByText(/2. Postoperative Fever/i);
    fireEvent.click(feverTab);

    expect(screen.getByText(/Postoperative Fever Differential: The 5 Ws \(Wind, Water, Wound, Walking, Wonder\) & MH/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Wind/i).length).toBeGreaterThan(0);
  });

  it("toggles Surgery Postings Quiz challenge mode", () => {
    render(<ClinicalClin2LabViewer initialMode="preop" />);

    const quizBtn = screen.getByText(/Surgery Postings Quiz/i);
    fireEvent.click(quizBtn);

    expect(screen.getByText(/Exit Challenge/i)).toBeInTheDocument();
    expect(screen.getByText(/Surgical Care Challenge/i)).toBeInTheDocument();
  });
});
