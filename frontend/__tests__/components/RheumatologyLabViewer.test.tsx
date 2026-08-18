import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import RheumatologyLabViewer from "../../components/rheumatologyadv/RheumatologyLabViewer";

describe("RheumatologyLabViewer Component", () => {
  it("renders with default SLE mode and displays Anti-dsDNA station", () => {
    render(<RheumatologyLabViewer initialMode="sle" />);

    expect(screen.getByText(/Systemic Lupus Erythematosus \(SLE\), Lupus Nephritis & Antiphospholipid Syndrome/i)).toBeInTheDocument();
    expect(screen.getByText(/Rheumatology Diagnostic Quiz/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Anti-dsDNA/i).length).toBeGreaterThan(0);
  });

  it("switches to Rheumatoid Arthritis mode and displays Pannus station", () => {
    render(<RheumatologyLabViewer initialMode="sle" />);

    const raTab = screen.getByText(/2. Rheumatoid Arthritis/i);
    fireEvent.click(raTab);

    expect(screen.getByText(/Rheumatoid Arthritis Synovial Immunopathology/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Pannus/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Methotrexate/i).length).toBeGreaterThan(0);
  });

  it("toggles Rheumatology Diagnostic Quiz challenge mode", () => {
    render(<RheumatologyLabViewer initialMode="sle" />);

    const quizBtn = screen.getByText(/Rheumatology Diagnostic Quiz/i);
    fireEvent.click(quizBtn);

    expect(screen.getByText(/Exit Challenge/i)).toBeInTheDocument();
    expect(screen.getByText(/Rheumatology Challenge/i)).toBeInTheDocument();
  });
});
