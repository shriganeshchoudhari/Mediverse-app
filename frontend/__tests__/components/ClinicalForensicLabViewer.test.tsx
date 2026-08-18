import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ClinicalForensicLabViewer from "../../components/forensicadv/ClinicalForensicLabViewer";

describe("ClinicalForensicLabViewer Component", () => {
  it("renders with default Thanatology mode and displays Rigor and Livor Mortis station", () => {
    render(<ClinicalForensicLabViewer initialMode="thanatology" />);

    expect(screen.getByText(/Thanatology & Postmortem Interval \(PMI\): Algor, Rigor, Livor Mortis & Putrefaction/i)).toBeInTheDocument();
    expect(screen.getByText(/Forensic Diagnostic Quiz/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Livor Mortis/i).length).toBeGreaterThan(0);
  });

  it("switches to Forensic Ballistics mode and displays Stellate and Stippling station", () => {
    render(<ClinicalForensicLabViewer initialMode="thanatology" />);

    const balTab = screen.getByText(/2. Forensic Ballistics/i);
    fireEvent.click(balTab);

    expect(screen.getByText(/Forensic Ballistics: Range of Fire \(Contact, Stippling, Tattooing\) & Entrance vs Exit Wounds/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Hard Contact Cranial/i).length).toBeGreaterThan(0);
  });

  it("toggles Forensic Diagnostic Quiz challenge mode", () => {
    render(<ClinicalForensicLabViewer initialMode="thanatology" />);

    const quizBtn = screen.getByText(/Forensic Diagnostic Quiz/i);
    fireEvent.click(quizBtn);

    expect(screen.getByText(/Exit Challenge/i)).toBeInTheDocument();
    expect(screen.getByText(/Forensic Pathology Challenge/i)).toBeInTheDocument();
  });
});
