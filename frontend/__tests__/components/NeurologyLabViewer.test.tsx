import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import NeurologyLabViewer from "../../components/neurologyadv/NeurologyLabViewer";

describe("NeurologyLabViewer Component", () => {
  it("renders with default Stroke mode and displays MCA station", () => {
    render(<NeurologyLabViewer initialMode="stroke" />);

    expect(screen.getByText(/Acute Ischemic Stroke Syndromes, Aphasias & Brainstem Neuro-Localization/i)).toBeInTheDocument();
    expect(screen.getByText(/Neurology Diagnostic Quiz/i)).toBeInTheDocument();
    expect(screen.getAllByText(/MCA/i).length).toBeGreaterThan(0);
  });

  it("switches to Intracranial Bleeds mode and displays Epidural station", () => {
    render(<NeurologyLabViewer initialMode="stroke" />);

    const hemTab = screen.getByText(/2. Intracranial Bleeds/i);
    fireEvent.click(hemTab);

    expect(screen.getByText(/Intracranial Bleed Comparative Morphology/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Epidural/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Subdural/i).length).toBeGreaterThan(0);
  });

  it("toggles Neurology Diagnostic Quiz challenge mode", () => {
    render(<NeurologyLabViewer initialMode="stroke" />);

    const quizBtn = screen.getByText(/Neurology Diagnostic Quiz/i);
    fireEvent.click(quizBtn);

    expect(screen.getByText(/Exit Challenge/i)).toBeInTheDocument();
    expect(screen.getByText(/Neurology Challenge/i)).toBeInTheDocument();
  });
});
