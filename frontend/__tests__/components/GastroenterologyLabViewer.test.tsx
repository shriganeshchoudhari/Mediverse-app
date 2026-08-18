import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import GastroenterologyLabViewer from "../../components/gastroenterologyadv/GastroenterologyLabViewer";

describe("GastroenterologyLabViewer Component", () => {
  it("renders with default Cirrhosis mode and displays SBP station", () => {
    render(<GastroenterologyLabViewer initialMode="cirrhosis" />);

    expect(screen.getByText(/Cirrhosis, Portal Hypertension, SAAG Ascites Gradient & SBP Management/i)).toBeInTheDocument();
    expect(screen.getByText(/Gastroenterology Diagnostic Quiz/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Spontaneous Bacterial Peritonitis/i).length).toBeGreaterThan(0);
  });

  it("switches to Jaundice Differential mode and displays Gilbert station", () => {
    render(<GastroenterologyLabViewer initialMode="cirrhosis" />);

    const jaundTab = screen.getByText(/2. Jaundice Differential/i);
    fireEvent.click(jaundTab);

    expect(screen.getByText(/Differential Diagnosis of Jaundice & Bilirubin Metabolism/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Gilbert/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Diagnostic Rule/i).length).toBeGreaterThan(0);
  });

  it("toggles Gastroenterology Diagnostic Quiz challenge mode", () => {
    render(<GastroenterologyLabViewer initialMode="cirrhosis" />);

    const quizBtn = screen.getByText(/Gastroenterology Diagnostic Quiz/i);
    fireEvent.click(quizBtn);

    expect(screen.getByText(/Exit Challenge/i)).toBeInTheDocument();
    expect(screen.getByText(/Gastroenterology Challenge/i)).toBeInTheDocument();
  });
});
