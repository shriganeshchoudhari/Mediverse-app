import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ClinicalSurgeryAdvLabViewer from "../../components/surgeryadv/ClinicalSurgeryAdvLabViewer";

describe("ClinicalSurgeryAdvLabViewer Component", () => {
  it("renders with default Acute Abdomen mode and displays SBO and Strangulation station", () => {
    render(<ClinicalSurgeryAdvLabViewer initialMode="acuteAbdomen" />);

    expect(screen.getByText(/Acute Abdomen & SBO: Mechanical Obstruction, Strangulation & Ogilvie Syndrome/i)).toBeInTheDocument();
    expect(screen.getByText(/Surgery Diagnostic Quiz/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Adhesive Small Bowel Obstruction/i).length).toBeGreaterThan(0);
  });

  it("switches to Lap Biliary CVS mode and displays Critical View of Safety station", () => {
    render(<ClinicalSurgeryAdvLabViewer initialMode="acuteAbdomen" />);

    const lapTab = screen.getByText(/2. Lap Biliary & CVS/i);
    fireEvent.click(lapTab);

    expect(screen.getByText(/Laparoscopic Biliary Surgery: The Critical View of Safety \(CVS\) & BDI Prevention/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Critical View of Safety/i).length).toBeGreaterThan(0);
  });

  it("toggles Surgery Diagnostic Quiz challenge mode", () => {
    render(<ClinicalSurgeryAdvLabViewer initialMode="acuteAbdomen" />);

    const quizBtn = screen.getByText(/Surgery Diagnostic Quiz/i);
    fireEvent.click(quizBtn);

    expect(screen.getByText(/Exit Challenge/i)).toBeInTheDocument();
    expect(screen.getByText(/Surgery Challenge/i)).toBeInTheDocument();
  });
});
