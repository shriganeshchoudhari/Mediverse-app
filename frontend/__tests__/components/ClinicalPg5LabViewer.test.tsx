import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ClinicalPg5LabViewer from "../../components/pg5/ClinicalPg5LabViewer";

describe("ClinicalPg5LabViewer Component", () => {
  it("renders with default TTTS mode and displays Monochorionic Twins station", () => {
    render(<ClinicalPg5LabViewer initialMode="ttts" />);

    expect(screen.getByText(/Monochorionic Twins: TTTS Quintero Staging/i)).toBeInTheDocument();
    expect(screen.getByText(/Obstetrics & Fetal Quiz/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Quintero/i).length).toBeGreaterThan(0);
  });

  it("switches to FGR mode and displays Early-Onset FGR station", () => {
    render(<ClinicalPg5LabViewer initialMode="ttts" />);

    const fgrTab = screen.getByText(/2. FGR & Ductus Venosus/i);
    fireEvent.click(fgrTab);

    expect(screen.getByText(/Early-Onset FGR: Umbilical AREDF/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Ductus Venosus/i).length).toBeGreaterThan(0);
  });

  it("toggles Obstetrics & Fetal Quiz challenge mode", () => {
    render(<ClinicalPg5LabViewer initialMode="ttts" />);

    const quizBtn = screen.getByText(/Obstetrics & Fetal Quiz/i);
    fireEvent.click(quizBtn);

    expect(screen.getByText(/Exit Challenge/i)).toBeInTheDocument();
    expect(screen.getByText(/MFM \/ Maternal Critical Care Challenge/i)).toBeInTheDocument();
  });
});
