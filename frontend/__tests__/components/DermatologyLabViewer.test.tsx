import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import DermatologyLabViewer from "../../components/dermatology/DermatologyLabViewer";

describe("DermatologyLabViewer Component", () => {
  it("renders with default Psoriasis simulator and controls", () => {
    render(<DermatologyLabViewer initialMode="psoriasis" />);

    expect(screen.getByText(/Psoriasis Vulgaris \(Auspitz & Koebner\) & Papulosquamous Simulator/i)).toBeInTheDocument();
    expect(screen.getByText(/Psoriasis Area & Severity Index \(PASI\) & Biologic Selection/i)).toBeInTheDocument();
    expect(screen.getByText(/Dermatology Quiz/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Psoriasis/i).length).toBeGreaterThan(0);
  });

  it("switches to Bullous mode and updates Nikolsky matrix", () => {
    render(<DermatologyLabViewer initialMode="psoriasis" />);

    const bullTab = screen.getByText(/2. Bullous & Nikolsky/i);
    fireEvent.click(bullTab);

    expect(screen.getByText(/Bullous Dermatoses \(Pemphigus vs Pemphigoid\) & Nikolsky Matrix/i)).toBeInTheDocument();
    expect(screen.getByText(/Autoimmune Bullous Cleavage & Nikolsky Sign Matrix/i)).toBeInTheDocument();
  });

  it("toggles Dermatology Quiz challenge mode", () => {
    render(<DermatologyLabViewer initialMode="psoriasis" />);

    const quizBtn = screen.getByText(/Dermatology Quiz/i);
    fireEvent.click(quizBtn);

    expect(screen.getByText(/Exit Challenge/i)).toBeInTheDocument();
    expect(screen.getByText(/Dermatology Clinical Challenge/i)).toBeInTheDocument();
  });
});
