import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import HematologyLabViewer from "../../components/hematologyadv/HematologyLabViewer";

describe("HematologyLabViewer Component", () => {
  it("renders with default Coagulation mode and displays TTP station", () => {
    render(<HematologyLabViewer initialMode="coag" />);

    expect(screen.getByText(/Coagulation Cascades, Platelet Disorders & Hemostasis/i)).toBeInTheDocument();
    expect(screen.getByText(/Hematology Diagnostic Quiz/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Thrombotic Thrombocytopenic Purpura/i).length).toBeGreaterThan(0);
  });

  it("switches to Anemia Profiler mode and displays iron deficiency station", () => {
    render(<HematologyLabViewer initialMode="coag" />);

    const anemiaTab = screen.getByText(/2. Anemia Profiler/i);
    fireEvent.click(anemiaTab);

    expect(screen.getByText(/Anemia Algorithmic Diagnostic Profiling/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Iron Deficiency/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Diagnostic Pearl/i).length).toBeGreaterThan(0);
  });

  it("toggles Hematology Diagnostic Quiz challenge mode", () => {
    render(<HematologyLabViewer initialMode="coag" />);

    const quizBtn = screen.getByText(/Hematology Diagnostic Quiz/i);
    fireEvent.click(quizBtn);

    expect(screen.getByText(/Exit Challenge/i)).toBeInTheDocument();
    expect(screen.getByText(/Hematology Challenge/i)).toBeInTheDocument();
  });
});
