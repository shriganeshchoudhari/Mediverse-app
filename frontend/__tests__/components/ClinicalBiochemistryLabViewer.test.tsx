import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ClinicalBiochemistryLabViewer from "../../components/biochemistryadv/ClinicalBiochemistryLabViewer";

describe("ClinicalBiochemistryLabViewer Component", () => {
  it("renders with default Amino Acids mode and displays PKU station", () => {
    render(<ClinicalBiochemistryLabViewer initialMode="amino" />);

    expect(screen.getByText(/Inborn Errors of Amino Acid Metabolism \(PKU, MSUD, Homocystinuria\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Inborn Errors Quiz/i)).toBeInTheDocument();
    expect(screen.getAllByText(/PKU/i).length).toBeGreaterThan(0);
  });

  it("switches to Glycogen Storage Diseases mode and displays GSD matrix", () => {
    render(<ClinicalBiochemistryLabViewer initialMode="amino" />);

    const gsdTab = screen.getByText(/2. Glycogen Storage/i);
    fireEvent.click(gsdTab);

    expect(screen.getByText(/Glycogen Storage Diseases \(Von Gierke, Pompe, Cori, McArdle\)/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Von Gierke/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Lactate Profile/i).length).toBeGreaterThan(0);
  });

  it("toggles Inborn Errors Quiz challenge mode", () => {
    render(<ClinicalBiochemistryLabViewer initialMode="amino" />);

    const quizBtn = screen.getByText(/Inborn Errors Quiz/i);
    fireEvent.click(quizBtn);

    expect(screen.getByText(/Exit Challenge/i)).toBeInTheDocument();
    expect(screen.getByText(/Biochemistry Metabolic Challenge/i)).toBeInTheDocument();
  });
});
