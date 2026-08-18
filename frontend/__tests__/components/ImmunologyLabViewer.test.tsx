import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ImmunologyLabViewer from "../../components/immunology/ImmunologyLabViewer";

describe("ImmunologyLabViewer Component", () => {
  it("renders with default Primary Immunodeficiency Explorer and controls", () => {
    render(<ImmunologyLabViewer initialMode="pid" />);

    expect(screen.getByText(/Primary Immunodeficiencies \(SCID, XLA, CVID, CGD & HAE\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Primary Immunodeficiency Explorer/i)).toBeInTheDocument();
    expect(screen.getByText(/Immunology Quiz/i)).toBeInTheDocument();
    expect(screen.getAllByText(/SCID/i).length).toBeGreaterThan(0);
  });

  it("switches to Hypersensitivity mode and displays Gell & Coombs matrix", () => {
    render(<ImmunologyLabViewer initialMode="pid" />);

    const hyperTab = screen.getByText(/2. Hypersensitivity \(I-IV\)/i);
    fireEvent.click(hyperTab);

    expect(screen.getByText(/Gell & Coombs Hypersensitivity Matrix \(Types I, II, III & IV\)/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Gell & Coombs Hypersensitivity Matrix/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Type I/i).length).toBeGreaterThan(0);
  });

  it("toggles Immunology Quiz challenge mode", () => {
    render(<ImmunologyLabViewer initialMode="pid" />);

    const quizBtn = screen.getByText(/Immunology Quiz/i);
    fireEvent.click(quizBtn);

    expect(screen.getByText(/Exit Challenge/i)).toBeInTheDocument();
    expect(screen.getByText(/Clinical Immunology Challenge/i)).toBeInTheDocument();
  });
});
