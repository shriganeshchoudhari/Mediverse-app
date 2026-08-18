import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import OrthopedicsLabViewer from "../../components/orthopedics/OrthopedicsLabViewer";

describe("OrthopedicsLabViewer Component", () => {
  it("renders with default Salter-Harris fracture matrix and controls", () => {
    render(<OrthopedicsLabViewer initialMode="fractures" />);

    expect(screen.getByText(/Salter-Harris Physeal & Gustilo-Anderson Open Fracture Classifier/i)).toBeInTheDocument();
    expect(screen.getByText(/Salter-Harris Physeal Fracture Matrix/i)).toBeInTheDocument();
    expect(screen.getByText(/Orthopedics Quiz/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Salter-Harris/i).length).toBeGreaterThan(0);
  });

  it("switches to Compartment Syndrome mode and updates Delta Pressure calculator", () => {
    render(<OrthopedicsLabViewer initialMode="fractures" />);

    const compTab = screen.getByText(/2. Compartment Syndrome \(ΔP\)/i);
    fireEvent.click(compTab);

    expect(screen.getByText(/Acute Compartment Syndrome Delta Pressure \(ΔP\) Emergency Calculator/i)).toBeInTheDocument();
    expect(screen.getByText(/Acute Compartment Syndrome Delta Pressure \(ΔP\) Stryker Calculator/i)).toBeInTheDocument();
  });

  it("toggles Orthopedics Quiz challenge mode", () => {
    render(<OrthopedicsLabViewer initialMode="fractures" />);

    const quizBtn = screen.getByText(/Orthopedics Quiz/i);
    fireEvent.click(quizBtn);

    expect(screen.getByText(/Exit Challenge/i)).toBeInTheDocument();
    expect(screen.getByText(/Orthopedics & Traumatology Challenge/i)).toBeInTheDocument();
  });
});
