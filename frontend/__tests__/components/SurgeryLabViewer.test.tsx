import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import SurgeryLabViewer from "../../components/surgery/SurgeryLabViewer";

describe("SurgeryLabViewer Component", () => {
  it("renders with default Acute Abdomen Alvarado scoring engine and controls", () => {
    render(<SurgeryLabViewer initialMode="acuteAbdomen" />);

    expect(screen.getByText(/Acute Abdomen & Alvarado \(MANTRELS\) Appendicitis Engine/i)).toBeInTheDocument();
    expect(screen.getByText(/Alvarado \(MANTRELS\) Appendicitis Diagnostic Scoring Engine/i)).toBeInTheDocument();
    expect(screen.getByText(/Surgery Quiz/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Acute Appendicitis & Alvarado/i).length).toBeGreaterThan(0);
  });

  it("switches to Burns Parkland mode and updates formula calculator", () => {
    render(<SurgeryLabViewer initialMode="acuteAbdomen" />);

    const burnsTab = screen.getByText(/3. Burns & Parkland Formula/i);
    fireEvent.click(burnsTab);

    expect(screen.getByText(/Parkland Burn Fluid Resuscitation & Rule of Nines Calculator/i)).toBeInTheDocument();
    expect(screen.getByText(/Parkland Burn Resuscitation Formula/i)).toBeInTheDocument();
  });

  it("toggles Surgery Quiz challenge mode", () => {
    render(<SurgeryLabViewer initialMode="acuteAbdomen" />);

    const quizBtn = screen.getByText(/Surgery Quiz/i);
    fireEvent.click(quizBtn);

    expect(screen.getByText(/Exit Challenge/i)).toBeInTheDocument();
    expect(screen.getByText(/General Surgery Case Challenge/i)).toBeInTheDocument();
  });
});
