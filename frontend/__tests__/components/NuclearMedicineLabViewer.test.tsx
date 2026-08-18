import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import NuclearMedicineLabViewer from "../../components/nuclearmedicine/NuclearMedicineLabViewer";

describe("NuclearMedicineLabViewer Component", () => {
  it("renders with default Radionuclide Decay Physics simulator and controls", () => {
    render(<NuclearMedicineLabViewer initialMode="physics" />);

    expect(screen.getByText(/Radiopharmaceutical Decay Physics, Half-Lives & ALARA Shielding/i)).toBeInTheDocument();
    expect(screen.getByText(/Diagnostic & Therapeutic Radionuclide Physics/i)).toBeInTheDocument();
    expect(screen.getByText(/Nuclear Med Quiz/i)).toBeInTheDocument();
    expect(screen.getAllByText(/99mTc/i).length).toBeGreaterThan(0);
  });

  it("switches to PET mode and displays Brain Dementia metabolic patterns", () => {
    render(<NuclearMedicineLabViewer initialMode="physics" />);

    const petTab = screen.getByText(/3. PET-CT & Dementia/i);
    fireEvent.click(petTab);

    expect(screen.getByText(/18F-FDG PET-CT Oncology SUV & Brain Dementia Metabolic Patterns/i)).toBeInTheDocument();
    expect(screen.getByText(/Brain 18F-FDG PET Neurodegenerative Classifier/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Alzheimer/i).length).toBeGreaterThan(0);
  });

  it("toggles Nuclear Medicine Quiz challenge mode", () => {
    render(<NuclearMedicineLabViewer initialMode="physics" />);

    const quizBtn = screen.getByText(/Nuclear Med Quiz/i);
    fireEvent.click(quizBtn);

    expect(screen.getByText(/Exit Challenge/i)).toBeInTheDocument();
    expect(screen.getByText(/Nuclear Medicine Challenge/i)).toBeInTheDocument();
  });
});
