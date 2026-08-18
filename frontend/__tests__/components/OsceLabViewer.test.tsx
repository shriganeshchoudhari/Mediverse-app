import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import OsceLabViewer from "../../components/osce/OsceLabViewer";

describe("OsceLabViewer Component", () => {
  it("renders with default precordial murmur simulator and controls", () => {
    render(<OsceLabViewer initialMode="precordial" />);

    expect(screen.getByText(/Cardiovascular Precordial & Dynamic Murmur Auscultation Station/i)).toBeInTheDocument();
    expect(screen.getByText(/Precordial Auscultation & Dynamic Maneuvers/i)).toBeInTheDocument();
    expect(screen.getByText(/OSCE Exam Quiz/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Aortic Stenosis/i).length).toBeGreaterThan(0);
  });

  it("switches to Cranial Nerve mode and updates neurological checklist", () => {
    render(<OsceLabViewer initialMode="precordial" />);

    const neuroTab = screen.getByText(/2. Cranial Nerves II–XII/i);
    fireEvent.click(neuroTab);

    expect(screen.getByText(/Cranial Nerve II–XII Systematic Examination & Reflex Station/i)).toBeInTheDocument();
    expect(screen.getAllByText(/CN VII/i).length).toBeGreaterThan(0);
  });

  it("toggles OSCE Exam Quiz challenge mode", () => {
    render(<OsceLabViewer initialMode="precordial" />);

    const quizBtn = screen.getByText(/OSCE Exam Quiz/i);
    fireEvent.click(quizBtn);

    expect(screen.getByText(/Exit Challenge/i)).toBeInTheDocument();
    expect(screen.getByText(/OSCE Station Challenge/i)).toBeInTheDocument();
  });
});
