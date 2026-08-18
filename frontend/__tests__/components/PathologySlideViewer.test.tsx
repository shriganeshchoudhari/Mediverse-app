import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import PathologySlideViewer from "../../components/pathology/PathologySlideViewer";

describe("PathologySlideViewer Component", () => {
  it("renders with default Cell Injury slide collection and microscope controls", () => {
    render(<PathologySlideViewer initialCollection="cell-injury" />);

    expect(screen.getByText(/Cellular Injury, Adaptations & Necrosis/i)).toBeInTheDocument();
    expect(screen.getByText(/Histopathology Quiz/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Coagulative Necrosis/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/4x/i).length).toBeGreaterThan(0);
  });

  it("switches to Neoplasia & Carcinoma collection and updates slides", () => {
    render(<PathologySlideViewer initialCollection="cell-injury" />);

    const neoplasiaTab = screen.getByText(/2. Neoplasia & Carcinoma/i);
    fireEvent.click(neoplasiaTab);

    expect(screen.getByText(/Neoplasia, Carcinogenesis & Oncogenes/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Invasive Ductal Carcinoma/i).length).toBeGreaterThan(0);
  });

  it("toggles Histopathology Quiz challenge mode", () => {
    render(<PathologySlideViewer initialCollection="cell-injury" />);

    const quizBtn = screen.getByText(/Histopathology Quiz/i);
    fireEvent.click(quizBtn);

    expect(screen.getByText(/Exit Challenge/i)).toBeInTheDocument();
    expect(screen.getByText(/Histopathology Case Challenge/i)).toBeInTheDocument();
  });
});
