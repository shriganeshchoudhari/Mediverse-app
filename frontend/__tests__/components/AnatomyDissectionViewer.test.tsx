import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import AnatomyDissectionViewer from "../../components/3d/AnatomyDissectionViewer";

describe("AnatomyDissectionViewer Component", () => {
  it("renders with default regional preset title and controls", () => {
    render(<AnatomyDissectionViewer initialRegionId="upper-limb" />);

    expect(screen.getByText(/Upper Limb & Brachial Plexus Dissection/i)).toBeInTheDocument();
    expect(screen.getByText(/Layers/i)).toBeInTheDocument();
    expect(screen.getByText(/Pin Quiz Mode/i)).toBeInTheDocument();
  });

  it("allows switching regional dissection presets", () => {
    render(<AnatomyDissectionViewer initialRegionId="upper-limb" />);

    // Click on Lower Limb tab
    const lowerTab = screen.getByText(/Lower Limb/i);
    fireEvent.click(lowerTab);

    expect(screen.getByText(/Lower Limb & Joint Mechanics/i)).toBeInTheDocument();
  });

  it("toggles Pin Quiz Mode and displays question banner", () => {
    render(<AnatomyDissectionViewer initialRegionId="upper-limb" />);

    const quizBtn = screen.getByText(/Pin Quiz Mode/i);
    fireEvent.click(quizBtn);

    expect(screen.getByText(/Exit Quiz/i)).toBeInTheDocument();
    expect(screen.getByText(/Target Landmark/i)).toBeInTheDocument();
  });
});
