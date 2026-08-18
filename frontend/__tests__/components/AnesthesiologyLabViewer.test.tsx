import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import AnesthesiologyLabViewer from "../../components/anesthesiology/AnesthesiologyLabViewer";

describe("AnesthesiologyLabViewer Component", () => {
  it("renders with default Mallampati airway simulator and controls", () => {
    render(<AnesthesiologyLabViewer initialMode="airway" />);

    expect(screen.getByText(/ASA Difficult Airway Algorithm & Mallampati Class I–IV Simulator/i)).toBeInTheDocument();
    expect(screen.getByText(/Mallampati Classification & ASA Difficult Airway Cascade/i)).toBeInTheDocument();
    expect(screen.getByText(/Anesthesia Quiz/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Mallampati/i).length).toBeGreaterThan(0);
  });

  it("switches to Volatile & MH mode and updates Dantrolene engine", () => {
    render(<AnesthesiologyLabViewer initialMode="airway" />);

    const mhTab = screen.getByText(/2. Volatile MAC & MH/i);
    fireEvent.click(mhTab);

    expect(screen.getByText(/Volatile Anesthetics MAC & Malignant Hyperthermia Dantrolene Crisis Engine/i)).toBeInTheDocument();
    expect(screen.getByText(/Malignant Hyperthermia \(RYR1 Crisis\) & Dantrolene Engine/i)).toBeInTheDocument();
  });

  it("toggles Anesthesia Quiz challenge mode", () => {
    render(<AnesthesiologyLabViewer initialMode="airway" />);

    const quizBtn = screen.getByText(/Anesthesia Quiz/i);
    fireEvent.click(quizBtn);

    expect(screen.getByText(/Exit Challenge/i)).toBeInTheDocument();
    expect(screen.getByText(/Anesthesiology Clinical Challenge/i)).toBeInTheDocument();
  });
});
