import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ClinicalFoundationLabViewer from "../../components/foundation/ClinicalFoundationLabViewer";

describe("ClinicalFoundationLabViewer Component", () => {
  it("renders with default Communication mode and displays SPIKES & Calgary-Cambridge station", () => {
    render(<ClinicalFoundationLabViewer initialMode="communication" />);

    expect(screen.getByText(/Doctor-Patient Communication: Calgary-Cambridge, SPIKES Protocol & Empathy \(NURSE\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Clinical Foundation Quiz/i)).toBeInTheDocument();
    expect(screen.getAllByText(/SPIKES/i).length).toBeGreaterThan(0);
  });

  it("switches to Ethics mode and displays Bioethics & Autonomy station", () => {
    render(<ClinicalFoundationLabViewer initialMode="communication" />);

    const ethTab = screen.getByText(/2. Ethics & Autonomy/i);
    fireEvent.click(ethTab);

    expect(screen.getByText(/Medical Ethics & Bioethics: The Four Principles \(Beauchamp & Childress\) & Tarasoff Ruling/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Autonomy/i).length).toBeGreaterThan(0);
  });

  it("toggles Clinical Foundation Quiz challenge mode", () => {
    render(<ClinicalFoundationLabViewer initialMode="communication" />);

    const quizBtn = screen.getByText(/Clinical Foundation Quiz/i);
    fireEvent.click(quizBtn);

    expect(screen.getByText(/Exit Challenge/i)).toBeInTheDocument();
    expect(screen.getByText(/Clinical Foundation Challenge/i)).toBeInTheDocument();
  });
});
