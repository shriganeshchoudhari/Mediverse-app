import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import PharmacologyLabViewer from "../../components/pharmacology/PharmacologyLabViewer";

describe("PharmacologyLabViewer Component", () => {
  it("renders with default PK/PD simulator mode and PK dosing calculator", () => {
    render(<PharmacologyLabViewer initialMode="pkpd" />);

    expect(screen.getByText(/Pharmacokinetics & Receptor Dynamics Simulator/i)).toBeInTheDocument();
    expect(screen.getByText(/Interactive Pharmacokinetics & Dosing Calculator/i)).toBeInTheDocument();
    expect(screen.getByText(/Pharmacology Quiz/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Loading Dose/i).length).toBeGreaterThan(0);
  });

  it("switches to Cardiorenal & Diuretics mode and updates drug nodes", () => {
    render(<PharmacologyLabViewer initialMode="pkpd" />);

    const cardioTab = screen.getByText(/3. Cardiorenal & Diuretics/i);
    fireEvent.click(cardioTab);

    expect(screen.getByText(/Cardiovascular & Renal Pharmacology Engines/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Loop Diuretics/i).length).toBeGreaterThan(0);
  });

  it("toggles Pharmacology Quiz challenge mode", () => {
    render(<PharmacologyLabViewer initialMode="pkpd" />);

    const quizBtn = screen.getByText(/Pharmacology Quiz/i);
    fireEvent.click(quizBtn);

    expect(screen.getByText(/Exit Challenge/i)).toBeInTheDocument();
    expect(screen.getByText(/Clinical Pharmacology Challenge/i)).toBeInTheDocument();
  });
});
