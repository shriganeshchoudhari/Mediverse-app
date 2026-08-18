import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import MetabolicPathwayViewer from "../../components/biochemistry/MetabolicPathwayViewer";

describe("MetabolicPathwayViewer Component", () => {
  it("renders with default Carbohydrate pathway nodes and state switcher", () => {
    render(<MetabolicPathwayViewer initialMode="carbohydrates" />);

    expect(screen.getByText(/Carbohydrate Crossroads & Glycogen Storage/i)).toBeInTheDocument();
    expect(screen.getByText(/Well-Fed State/i)).toBeInTheDocument();
    expect(screen.getByText(/Metabolic Quiz/i)).toBeInTheDocument();
    expect(screen.getAllByText(/PFK-1/i).length).toBeGreaterThan(0);
  });

  it("switches to Lipids & Lipoproteins mode and displays lipoprotein pathways", () => {
    render(<MetabolicPathwayViewer initialMode="carbohydrates" />);

    const lipidsTab = screen.getByText(/2. Lipids & Lipoproteins/i);
    fireEvent.click(lipidsTab);

    expect(screen.getByText(/Lipoprotein Transport & Dyslipidemias/i)).toBeInTheDocument();
    expect(screen.getByText(/Exogenous Chylomicron Pathway/i)).toBeInTheDocument();
  });

  it("toggles Metabolic Quiz challenge mode", () => {
    render(<MetabolicPathwayViewer initialMode="carbohydrates" />);

    const quizBtn = screen.getByText(/Metabolic Quiz/i);
    fireEvent.click(quizBtn);

    expect(screen.getByText(/Exit Challenge/i)).toBeInTheDocument();
    expect(screen.getByText(/Diagnostic Case Challenge/i)).toBeInTheDocument();
  });
});
