import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ClinicalEntAdvLabViewer from "../../components/entadv/ClinicalEntAdvLabViewer";

describe("ClinicalEntAdvLabViewer Component", () => {
  it("renders with default Airway mode and displays Ludwig Angina and Quinsy station", () => {
    render(<ClinicalEntAdvLabViewer initialMode="airway" />);

    expect(screen.getByText(/Deep Neck Space Infections: Ludwig Angina, Quinsy & Danger Space Mediastinitis/i)).toBeInTheDocument();
    expect(screen.getByText(/Otolaryngology Diagnostic Quiz/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Ludwig Angina/i).length).toBeGreaterThan(0);
  });

  it("switches to Vestibular mode and displays BPPV and Meniere station", () => {
    render(<ClinicalEntAdvLabViewer initialMode="airway" />);

    const vesTab = screen.getByText(/2. Vestibular & Audiology/i);
    fireEvent.click(vesTab);

    expect(screen.getByText(/Vestibular Pathology & Neurotology: BPPV \(Epley\), Ménière Disease & Neuroma/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Ménière/i).length).toBeGreaterThan(0);
  });

  it("toggles Otolaryngology Diagnostic Quiz challenge mode", () => {
    render(<ClinicalEntAdvLabViewer initialMode="airway" />);

    const quizBtn = screen.getByText(/Otolaryngology Diagnostic Quiz/i);
    fireEvent.click(quizBtn);

    expect(screen.getByText(/Exit Challenge/i)).toBeInTheDocument();
    expect(screen.getByText(/Otolaryngology Challenge/i)).toBeInTheDocument();
  });
});
