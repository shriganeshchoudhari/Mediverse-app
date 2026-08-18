import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ClinicalOrthopedicsAdvLabViewer from "../../components/orthopedicsadv/ClinicalOrthopedicsAdvLabViewer";

describe("ClinicalOrthopedicsAdvLabViewer Component", () => {
  it("renders with default Compartment Syndrome mode and displays Delta Pressure simulator", () => {
    render(<ClinicalOrthopedicsAdvLabViewer initialMode="compartment" />);

    expect(screen.getByText(/Acute Compartment Syndrome: The 6 'P's, Delta Pressure & Fasciotomy/i)).toBeInTheDocument();
    expect(screen.getByText(/Orthopedic Diagnostic Quiz/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Acute Compartment Syndrome/i).length).toBeGreaterThan(0);
  });

  it("switches to Open Fractures mode and displays Gustilo-Anderson station", () => {
    render(<ClinicalOrthopedicsAdvLabViewer initialMode="compartment" />);

    const ofTab = screen.getByText(/2. Open Fractures/i);
    fireEvent.click(ofTab);

    expect(screen.getByText(/Open Fractures: Gustilo-Anderson Classification & Limb Salvage/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Gustilo-Anderson/i).length).toBeGreaterThan(0);
  });

  it("toggles Orthopedic Diagnostic Quiz challenge mode", () => {
    render(<ClinicalOrthopedicsAdvLabViewer initialMode="compartment" />);

    const quizBtn = screen.getByText(/Orthopedic Diagnostic Quiz/i);
    fireEvent.click(quizBtn);

    expect(screen.getByText(/Exit Challenge/i)).toBeInTheDocument();
    expect(screen.getByText(/Orthopedic Surgery Challenge/i)).toBeInTheDocument();
  });
});
