import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import OphthalmologyLabViewer from "../../components/ophthalmology/OphthalmologyLabViewer";

describe("OphthalmologyLabViewer Component", () => {
  it("renders with default Glaucoma triage engine and controls", () => {
    render(<OphthalmologyLabViewer initialMode="glaucoma" />);

    expect(screen.getByText(/Intraocular Pressure \(IOP\) & Glaucoma Emergency Triage Engine/i)).toBeInTheDocument();
    expect(screen.getByText(/Intraocular Pressure \(Goldmann Tonometry\) & Angle Classification/i)).toBeInTheDocument();
    expect(screen.getByText(/Ophthalmology Quiz/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Glaucoma/i).length).toBeGreaterThan(0);
  });

  it("switches to Slit-Lamp mode and updates corneal staining simulator", () => {
    render(<OphthalmologyLabViewer initialMode="glaucoma" />);

    const slitTab = screen.getByText(/2. Slit-Lamp & Cornea/i);
    fireEvent.click(slitTab);

    expect(screen.getByText(/Slit-Lamp Biomicroscopy & Corneal Staining Diagnostic Simulator/i)).toBeInTheDocument();
    expect(screen.getByText(/Slit-Lamp Biomicroscopy & Cobalt Blue Corneal Ulcer Staining/i)).toBeInTheDocument();
  });

  it("toggles Ophthalmology Quiz challenge mode", () => {
    render(<OphthalmologyLabViewer initialMode="glaucoma" />);

    const quizBtn = screen.getByText(/Ophthalmology Quiz/i);
    fireEvent.click(quizBtn);

    expect(screen.getByText(/Exit Challenge/i)).toBeInTheDocument();
    expect(screen.getByText(/Ophthalmology Clinical Challenge/i)).toBeInTheDocument();
  });
});
