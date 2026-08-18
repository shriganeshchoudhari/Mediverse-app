import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ClinicalPg9LabViewer } from "@/components/pg9/ClinicalPg9LabViewer";

describe("ClinicalPg9LabViewer Component", () => {
  test("renders PG-609 lab viewer header and default Larynx tab", () => {
    render(<ClinicalPg9LabViewer />);
    expect(screen.getAllByText(/Postgraduate Otorhinolaryngology/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Larynx & Flap Reconstruction/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Laryngeal T Stage/i).length).toBeGreaterThan(0);
  });

  test("allows switching between FESS, Otology, Deep Neck, and Quiz tabs", () => {
    render(<ClinicalPg9LabViewer />);

    // Switch to FESS tab
    const fessTabBtn = screen.getByRole("button", { name: /FESS & Hadad Nasoseptal Flap/i });
    fireEvent.click(fessTabBtn);
    expect(screen.getAllByText(/Keros/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Hadad-Bassagasteguy/i).length).toBeGreaterThan(0);

    // Switch to Otology tab
    const otologyTabBtn = screen.getByRole("button", { name: /Cholesteatoma & Mastoidectomy/i });
    fireEvent.click(otologyTabBtn);
    expect(screen.getAllByText(/Mastoidectomy/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Facial Recess/i).length).toBeGreaterThan(0);

    // Switch to Deep Neck tab
    const deepNeckTabBtn = screen.getByRole("button", { name: /Deep Neck Infections & Airway/i });
    fireEvent.click(deepNeckTabBtn);
    expect(screen.getAllByText(/Danger Space/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Awake Flexible Fiberoptic/i).length).toBeGreaterThan(0);

    // Switch to Quiz tab
    const quizTabBtn = screen.getByRole("button", { name: /Diagnostic Challenge Quiz/i });
    fireEvent.click(quizTabBtn);
    expect(screen.getAllByText(/Question 1 of/i).length).toBeGreaterThan(0);
  });

  test("updates surgical recommendation when T-stage changes in Larynx tab", () => {
    render(<ClinicalPg9LabViewer />);

    const selects = screen.getAllByRole("combobox");
    fireEvent.change(selects[0], { target: { value: "T3" } });
    expect(screen.getAllByText(/Organ Preservation CRT/i).length).toBeGreaterThan(0);
  });
});
