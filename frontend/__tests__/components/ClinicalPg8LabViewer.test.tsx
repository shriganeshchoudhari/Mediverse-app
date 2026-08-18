import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ClinicalPg8LabViewer } from "@/components/pg8/ClinicalPg8LabViewer";

describe("ClinicalPg8LabViewer Component", () => {
  test("renders PG-608 lab viewer header and default Vitreoretinal tab", () => {
    render(<ClinicalPg8LabViewer />);
    expect(screen.getAllByText(/Postgraduate Ophthalmology/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Vitreoretinal & Lincoff/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Lincoff Predicted Break/i).length).toBeGreaterThan(0);
  });

  test("allows switching between Medical Retina, Glaucoma, Neuro, and Quiz tabs", () => {
    render(<ClinicalPg8LabViewer />);

    // Switch to Medical Retina tab
    const retinaTabBtn = screen.getByRole("button", { name: /Medical Retina & Anti-VEGF/i });
    fireEvent.click(retinaTabBtn);
    expect(screen.getAllByText(/Central Subfield Thickness/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Faricimab/i).length).toBeGreaterThan(0);

    // Switch to Glaucoma tab
    const glaucomaTabBtn = screen.getByRole("button", { name: /Acute Glaucoma Crisis & LPI/i });
    fireEvent.click(glaucomaTabBtn);
    expect(screen.getAllByText(/Intraocular Pressure/i).length).toBeGreaterThan(0);

    // Switch to Neuro-Ophthalmology tab
    const neuroTabBtn = screen.getByRole("button", { name: /Neuro-Ophthalmology/i });
    fireEvent.click(neuroTabBtn);
    expect(screen.getAllByText(/Giant Cell Arteritis/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/ONTT/i).length).toBeGreaterThan(0);

    // Switch to Quiz tab
    const quizTabBtn = screen.getByRole("button", { name: /Diagnostic Challenge Quiz/i });
    fireEvent.click(quizTabBtn);
    expect(screen.getAllByText(/Question 1 of/i).length).toBeGreaterThan(0);
  });

  test("updates Lincoff predicted break location when RRD shape changes", () => {
    render(<ClinicalPg8LabViewer />);

    const selects = screen.getAllByRole("combobox");
    fireEvent.change(selects[0], { target: { value: "Superior Crossing 12 o'clock" } });
    expect(screen.getAllByText(/Within 1.5 clock hours of 12 o'clock/i).length).toBeGreaterThan(0);
  });
});
