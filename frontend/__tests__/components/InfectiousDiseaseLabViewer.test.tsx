import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import InfectiousDiseaseLabViewer from "../../components/infectiousdiseases/InfectiousDiseaseLabViewer";

describe("InfectiousDiseaseLabViewer Component", () => {
  it("renders with default Sepsis-3 qSOFA screener and controls", () => {
    render(<InfectiousDiseaseLabViewer initialMode="sepsis" />);

    expect(screen.getByText(/Sepsis-3 Consensus, SOFA\/qSOFA & Surviving Sepsis Hour-1 Bundle/i)).toBeInTheDocument();
    expect(screen.getByText(/Sepsis-3 Bedside qSOFA Screener & Hour-1 Bundle/i)).toBeInTheDocument();
    expect(screen.getByText(/Infectious Disease Quiz/i)).toBeInTheDocument();
    expect(screen.getAllByText(/qSOFA/i).length).toBeGreaterThan(0);
  });

  it("switches to Tropical Fevers mode and displays tropical fevers station", () => {
    render(<InfectiousDiseaseLabViewer initialMode="sepsis" />);

    const tropTab = screen.getByText(/2. Tropical Fevers/i);
    fireEvent.click(tropTab);

    expect(screen.getByText(/Fever of Unknown Origin & Tropical Fevers \(Malaria, Dengue, Scrub Typhus\)/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Tropical & Vector-Borne Fevers Station/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Malaria/i).length).toBeGreaterThan(0);
  });

  it("toggles Infectious Disease Quiz challenge mode", () => {
    render(<InfectiousDiseaseLabViewer initialMode="sepsis" />);

    const quizBtn = screen.getByText(/Infectious Disease Quiz/i);
    fireEvent.click(quizBtn);

    expect(screen.getByText(/Exit Challenge/i)).toBeInTheDocument();
    expect(screen.getByText(/Infectious Disease Challenge/i)).toBeInTheDocument();
  });
});
