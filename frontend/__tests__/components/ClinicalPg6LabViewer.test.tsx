import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ClinicalPg6LabViewer } from "@/components/pg6/ClinicalPg6LabViewer";

describe("ClinicalPg6LabViewer Component", () => {
  test("renders PG-606 lab viewer header and default Malignant Hyperthermia tab", () => {
    render(<ClinicalPg6LabViewer />);
    expect(screen.getAllByText(/Postgraduate Anesthesiology/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Malignant Hyperthermia/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Dantrolene/i).length).toBeGreaterThan(0);
  });

  test("allows switching between LAST, TIVA, ERAS, and Quiz tabs", () => {
    render(<ClinicalPg6LabViewer />);

    // Switch to LAST tab
    const lastTabBtn = screen.getByRole("button", { name: /LAST & 20% Lipid Emulsion Rescue/i });
    fireEvent.click(lastTabBtn);
    expect(screen.getAllByText(/Lipid Emulsion/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Bupivacaine/i).length).toBeGreaterThan(0);

    // Switch to TIVA tab
    const tivaTabBtn = screen.getByRole("button", { name: /TIVA \/ TCI & BIS Neuromonitoring/i });
    fireEvent.click(tivaTabBtn);
    expect(screen.getAllByText(/Bispectral Index/i).length).toBeGreaterThan(0);

    // Switch to ERAS tab
    const erasTabBtn = screen.getByRole("button", { name: /ERAS & Multimodal Analgesia/i });
    fireEvent.click(erasTabBtn);
    expect(screen.getAllByText(/Stroke Volume Variation/i).length).toBeGreaterThan(0);

    // Switch to Quiz tab
    const quizTabBtn = screen.getByRole("button", { name: /Diagnostic Challenge Quiz/i });
    fireEvent.click(quizTabBtn);
    expect(screen.getAllByText(/Question 1 of/i).length).toBeGreaterThan(0);
  });

  test("calculates Dantrolene dose dynamically when patient weight changes", () => {
    render(<ClinicalPg6LabViewer />);
    const sliders = screen.getAllByRole("slider");
    // Weight slider
    fireEvent.change(sliders[0], { target: { value: "80" } });
    // 80 kg * 2.5 mg/kg = 200 mg
    expect(screen.getAllByText(/200 mg/i).length).toBeGreaterThan(0);
  });
});
