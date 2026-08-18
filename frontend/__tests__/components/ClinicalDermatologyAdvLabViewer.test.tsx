import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ClinicalDermatologyAdvLabViewer from "../../components/dermatologyadv/ClinicalDermatologyAdvLabViewer";

describe("ClinicalDermatologyAdvLabViewer Component", () => {
  it("renders with default Emergencies mode and displays SJS and TEN station", () => {
    render(<ClinicalDermatologyAdvLabViewer initialMode="emergencies" />);

    expect(screen.getByText(/Cutaneous Emergencies: SJS\/TEN \(SCORTEN \/ Nikolsky\), SSSS & DRESS Syndrome/i)).toBeInTheDocument();
    expect(screen.getByText(/Dermatology Diagnostic Quiz/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Toxic Epidermal Necrolysis/i).length).toBeGreaterThan(0);
  });

  it("switches to Bullous mode and displays Pemphigus and Pemphigoid station", () => {
    render(<ClinicalDermatologyAdvLabViewer initialMode="emergencies" />);

    const bulTab = screen.getByText(/2. Autoimmune Bullous/i);
    fireEvent.click(bulTab);

    expect(screen.getByText(/Autoimmune Bullous Diseases: Pemphigus Vulgaris \(Desmoglein-3\/1\) & Pemphigoid \(BP180\)/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Pemphigus/i).length).toBeGreaterThan(0);
  });

  it("toggles Dermatology Diagnostic Quiz challenge mode", () => {
    render(<ClinicalDermatologyAdvLabViewer initialMode="emergencies" />);

    const quizBtn = screen.getByText(/Dermatology Diagnostic Quiz/i);
    fireEvent.click(quizBtn);

    expect(screen.getByText(/Exit Challenge/i)).toBeInTheDocument();
    expect(screen.getByText(/Dermatology Challenge/i)).toBeInTheDocument();
  });
});
