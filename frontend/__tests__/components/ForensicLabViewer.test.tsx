import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ForensicLabViewer from "../../components/forensic/ForensicLabViewer";

describe("ForensicLabViewer Component", () => {
  it("renders with default Thanatology & PMI calculator and controls", () => {
    render(<ForensicLabViewer initialMode="thanatology" />);

    expect(screen.getByText(/Thanatology & Post-Mortem Interval/i)).toBeInTheDocument();
    expect(screen.getByText(/Interactive Post-Mortem Interval \(PMI\) Calculator/i)).toBeInTheDocument();
    expect(screen.getByText(/Forensic Quiz/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Rigor Mortis/i).length).toBeGreaterThan(0);
  });

  it("switches to Traumatology mode and updates wound nodes", () => {
    render(<ForensicLabViewer initialMode="thanatology" />);

    const traumTab = screen.getByText(/2. Traumatology & Wounds/i);
    fireEvent.click(traumTab);

    expect(screen.getByText(/Traumatology, Mechanical Wounds & Firearms/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Incised Wound vs Laceration/i).length).toBeGreaterThan(0);
  });

  it("toggles Forensic Quiz challenge mode", () => {
    render(<ForensicLabViewer initialMode="thanatology" />);

    const quizBtn = screen.getByText(/Forensic Quiz/i);
    fireEvent.click(quizBtn);

    expect(screen.getByText(/Exit Challenge/i)).toBeInTheDocument();
    expect(screen.getByText(/Medicolegal Autopsy Challenge/i)).toBeInTheDocument();
  });
});
