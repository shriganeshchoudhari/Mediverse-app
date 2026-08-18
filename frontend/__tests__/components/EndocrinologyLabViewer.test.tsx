import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import EndocrinologyLabViewer from "../../components/endocrinologyadv/EndocrinologyLabViewer";

describe("EndocrinologyLabViewer Component", () => {
  it("renders with default Adrenal mode and displays Cushing station", () => {
    render(<EndocrinologyLabViewer initialMode="adrenal" />);

    expect(screen.getByText(/Adrenal Pathophysiology: Cushing Algorithm, Addison, Conn & Pheochromocytoma/i)).toBeInTheDocument();
    expect(screen.getByText(/Endocrinology Diagnostic Quiz/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Cushing/i).length).toBeGreaterThan(0);
  });

  it("switches to Thyroid Emergencies mode and displays Storm station", () => {
    render(<EndocrinologyLabViewer initialMode="adrenal" />);

    const thyTab = screen.getByText(/2. Thyroid Emergencies/i);
    fireEvent.click(thyTab);

    expect(screen.getByText(/Thyroid Storm & Myxedema Coma Resuscitation/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Thyroid Storm/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/4-Step Sequential Protocol/i).length).toBeGreaterThan(0);
  });

  it("toggles Endocrinology Diagnostic Quiz challenge mode", () => {
    render(<EndocrinologyLabViewer initialMode="adrenal" />);

    const quizBtn = screen.getByText(/Endocrinology Diagnostic Quiz/i);
    fireEvent.click(quizBtn);

    expect(screen.getByText(/Exit Challenge/i)).toBeInTheDocument();
    expect(screen.getByText(/Endocrinology Challenge/i)).toBeInTheDocument();
  });
});
