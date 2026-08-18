import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ClinicalOphthalmologyAdvLabViewer from "../../components/ophthalmologyadv/ClinicalOphthalmologyAdvLabViewer";

describe("ClinicalOphthalmologyAdvLabViewer Component", () => {
  it("renders with default Angle-Closure Glaucoma mode and displays IOP decompression simulator", () => {
    render(<ClinicalOphthalmologyAdvLabViewer initialMode="glaucoma" />);

    expect(screen.getByText(/Acute Angle-Closure Glaucoma: Pupillary Block, Pressure Lowering & Laser Iridotomy/i)).toBeInTheDocument();
    expect(screen.getByText(/Ophthalmology Diagnostic Quiz/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Acute Angle-Closure Glaucoma/i).length).toBeGreaterThan(0);
  });

  it("switches to Retinal Emergencies mode and displays CRAO and CRVO station", () => {
    render(<ClinicalOphthalmologyAdvLabViewer initialMode="glaucoma" />);

    const retTab = screen.getByText(/2. Retinal Emergencies/i);
    fireEvent.click(retTab);

    expect(screen.getByText(/Retinal Emergencies: Central Retinal Artery \(CRAO\), CRVO & Detachment/i)).toBeInTheDocument();
    expect(screen.getAllByText(/CRAO/i).length).toBeGreaterThan(0);
  });

  it("toggles Ophthalmology Diagnostic Quiz challenge mode", () => {
    render(<ClinicalOphthalmologyAdvLabViewer initialMode="glaucoma" />);

    const quizBtn = screen.getByText(/Ophthalmology Diagnostic Quiz/i);
    fireEvent.click(quizBtn);

    expect(screen.getByText(/Exit Challenge/i)).toBeInTheDocument();
    expect(screen.getByText(/Ophthalmology Challenge/i)).toBeInTheDocument();
  });
});
