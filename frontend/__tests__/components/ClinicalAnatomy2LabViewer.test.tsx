import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ClinicalAnatomy2LabViewer from "../../components/anatomy2/ClinicalAnatomy2LabViewer";

describe("ClinicalAnatomy2LabViewer Component", () => {
  it("renders with default Cranial mode and displays Wallenberg & Dejerine station", () => {
    render(<ClinicalAnatomy2LabViewer initialMode="cranial" />);

    expect(screen.getByText(/Cranial Nerves \(I-XII\) & Brainstem Stroke Syndromes: Wallenberg, Weber & Dejerine/i)).toBeInTheDocument();
    expect(screen.getByText(/Anatomy Diagnostic Quiz/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Wallenberg/i).length).toBeGreaterThan(0);
  });

  it("switches to Spaces mode and displays Deep Cervical Fascia & Danger Space station", () => {
    render(<ClinicalAnatomy2LabViewer initialMode="cranial" />);

    const spTab = screen.getByText(/2. Cervical Spaces & Danger/i);
    fireEvent.click(spTab);

    expect(screen.getByText(/Deep Cervical Fascia & Spaces: Danger Space, Ludwig Angina & Infratemporal Fossa/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Danger Space/i).length).toBeGreaterThan(0);
  });

  it("toggles Anatomy Diagnostic Quiz challenge mode", () => {
    render(<ClinicalAnatomy2LabViewer initialMode="cranial" />);

    const quizBtn = screen.getByText(/Anatomy Diagnostic Quiz/i);
    fireEvent.click(quizBtn);

    expect(screen.getByText(/Exit Challenge/i)).toBeInTheDocument();
    expect(screen.getByText(/Anatomy Challenge/i)).toBeInTheDocument();
  });
});
