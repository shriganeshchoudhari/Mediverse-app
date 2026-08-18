import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import DentistryLabViewer from "../../components/dentistry/DentistryLabViewer";

describe("DentistryLabViewer Component", () => {
  it("renders with default tooth notation & eruption simulator and controls", () => {
    render(<DentistryLabViewer initialMode="notation" />);

    expect(screen.getByText(/Dental Anatomy, FDI\/Universal Tooth Notation & Eruption Lab/i)).toBeInTheDocument();
    expect(screen.getByText(/Tooth Notation & Eruption Chronology/i)).toBeInTheDocument();
    expect(screen.getByText(/Dentistry Quiz/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Tooth 46/i).length).toBeGreaterThan(0);
  });

  it("switches to Ludwig's Angina mode and updates airway checklist", () => {
    render(<DentistryLabViewer initialMode="notation" />);

    const infectTab = screen.getByText(/2. Ludwig's Angina/i);
    fireEvent.click(infectTab);

    expect(screen.getByText(/Odontogenic Fascial Spaces & Ludwig's Angina Emergency Airway/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Awake Fiberoptic/i).length).toBeGreaterThan(0);
  });

  it("toggles Dentistry Quiz challenge mode", () => {
    render(<DentistryLabViewer initialMode="notation" />);

    const quizBtn = screen.getByText(/Dentistry Quiz/i);
    fireEvent.click(quizBtn);

    expect(screen.getByText(/Exit Challenge/i)).toBeInTheDocument();
    expect(screen.getByText(/Dentistry Challenge/i)).toBeInTheDocument();
  });
});
