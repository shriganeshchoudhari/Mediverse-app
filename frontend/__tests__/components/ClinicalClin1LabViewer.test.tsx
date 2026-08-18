import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ClinicalClin1LabViewer from "../../components/clin1/ClinicalClin1LabViewer";

describe("ClinicalClin1LabViewer Component", () => {
  it("renders with default Rounds mode and displays Inpatient Presentation & SOAP station", () => {
    render(<ClinicalClin1LabViewer initialMode="rounds" />);

    expect(screen.getByText(/Inpatient Ward Rounds & SOAP Documentation: Case Presentation & Progress Notes/i)).toBeInTheDocument();
    expect(screen.getByText(/Clinical Postings Quiz/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Case Presentation/i).length).toBeGreaterThan(0);
  });

  it("switches to Cardio mode and displays JVP & Pulsus Paradoxus station", () => {
    render(<ClinicalClin1LabViewer initialMode="rounds" />);

    const cardioTab = screen.getByText(/2. Bedside Cardio & JVP/i);
    fireEvent.click(cardioTab);

    expect(screen.getByText(/Bedside Cardiovascular Signs: JVP Waveforms, Kussmaul Sign & Pulsus Paradoxus/i)).toBeInTheDocument();
    expect(screen.getAllByText(/JVP/i).length).toBeGreaterThan(0);
  });

  it("toggles Clinical Postings Quiz challenge mode", () => {
    render(<ClinicalClin1LabViewer initialMode="rounds" />);

    const quizBtn = screen.getByText(/Clinical Postings Quiz/i);
    fireEvent.click(quizBtn);

    expect(screen.getByText(/Exit Challenge/i)).toBeInTheDocument();
    expect(screen.getByText(/Bedside Clinical Challenge/i)).toBeInTheDocument();
  });
});
