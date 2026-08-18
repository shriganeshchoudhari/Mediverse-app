import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import MicrobiologyLabViewer from "../../components/microbiology/MicrobiologyLabViewer";

describe("MicrobiologyLabViewer Component", () => {
  it("renders with default Bacteriology Flowcharts and controls", () => {
    render(<MicrobiologyLabViewer initialMode="bacteriology" />);

    expect(screen.getByText(/Systematic Bacteriology & Gram Flowcharts/i)).toBeInTheDocument();
    expect(screen.getByText(/Microbiology Quiz/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Staphylococcus aureus/i).length).toBeGreaterThan(0);
  });

  it("switches to Hypersensitivity Types I-IV mode and updates nodes", () => {
    render(<MicrobiologyLabViewer initialMode="bacteriology" />);

    const hyperTab = screen.getByText(/2. Hypersensitivity Types I-IV/i);
    fireEvent.click(hyperTab);

    expect(screen.getByText(/Coombs Hypersensitivity Mechanisms/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Type I: Immediate \/ Anaphylactic/i).length).toBeGreaterThan(0);
  });

  it("toggles Microbiology Quiz challenge mode", () => {
    render(<MicrobiologyLabViewer initialMode="bacteriology" />);

    const quizBtn = screen.getByText(/Microbiology Quiz/i);
    fireEvent.click(quizBtn);

    expect(screen.getByText(/Exit Challenge/i)).toBeInTheDocument();
    expect(screen.getByText(/Diagnostic Microbiology Case/i)).toBeInTheDocument();
  });
});
