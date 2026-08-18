import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import GeneticsLabViewer from "../../components/genetics/GeneticsLabViewer";

describe("GeneticsLabViewer Component", () => {
  it("renders with default Chromosomal Aneuploidy Karyotype explorer and controls", () => {
    render(<GeneticsLabViewer initialMode="aneuploidy" />);

    expect(screen.getByText(/Chromosomal Aneuploidies \(Trisomies 21, 18, 13, Turner & Klinefelter\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Chromosomal Aneuploidy Karyotype Explorer/i)).toBeInTheDocument();
    expect(screen.getByText(/Genetics Quiz/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Trisomy 21/i).length).toBeGreaterThan(0);
  });

  it("switches to Imprinting mode and displays 15q11-q13 PWS vs Angelman switch", () => {
    render(<GeneticsLabViewer initialMode="aneuploidy" />);

    const imprTab = screen.getByText(/3. Imprinting & Repeats/i);
    fireEvent.click(imprTab);

    expect(screen.getByText(/Genomic Imprinting \(15q11-q13 PWS vs AS\) & Trinucleotide Expansions/i)).toBeInTheDocument();
    expect(screen.getByText(/15q11-q13 Genomic Imprinting Switch/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Prader-Willi/i).length).toBeGreaterThan(0);
  });

  it("toggles Genetics Quiz challenge mode", () => {
    render(<GeneticsLabViewer initialMode="aneuploidy" />);

    const quizBtn = screen.getByText(/Genetics Quiz/i);
    fireEvent.click(quizBtn);

    expect(screen.getByText(/Exit Challenge/i)).toBeInTheDocument();
    expect(screen.getByText(/Medical Genetics Challenge/i)).toBeInTheDocument();
  });
});
