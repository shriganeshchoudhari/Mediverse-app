import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ClinicalBiochemistry2LabViewer from "../../components/biochemistry2/ClinicalBiochemistry2LabViewer";

describe("ClinicalBiochemistry2LabViewer Component", () => {
  it("renders with default Repair mode and displays Xeroderma & Lynch station", () => {
    render(<ClinicalBiochemistry2LabViewer initialMode="repair" />);

    expect(screen.getByText(/DNA Replication, Repair & Telomerase: NER \(XP\), BER, MMR \(Lynch\) & BRCA1\/2 \(HR\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Biochemistry Diagnostic Quiz/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Xeroderma/i).length).toBeGreaterThan(0);
  });

  it("switches to Transcription mode and displays RNA Pol II & alpha-Amanitin station", () => {
    render(<ClinicalBiochemistry2LabViewer initialMode="repair" />);

    const txTab = screen.getByText(/2. Transcription & Splicing/i);
    fireEvent.click(txTab);

    expect(screen.getByText(/Transcription & Splicing: RNA Pol I\/II\/III \(alpha-Amanitin\), HATs & snRNPs \(SLE\)/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Amanitin/i).length).toBeGreaterThan(0);
  });

  it("toggles Biochemistry Diagnostic Quiz challenge mode", () => {
    render(<ClinicalBiochemistry2LabViewer initialMode="repair" />);

    const quizBtn = screen.getByText(/Biochemistry Diagnostic Quiz/i);
    fireEvent.click(quizBtn);

    expect(screen.getByText(/Exit Challenge/i)).toBeInTheDocument();
    expect(screen.getByText(/Biochemistry Challenge/i)).toBeInTheDocument();
  });
});
