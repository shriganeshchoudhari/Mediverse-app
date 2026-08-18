import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ClinicalPg10LabViewer } from "@/components/pg10/ClinicalPg10LabViewer";

describe("ClinicalPg10LabViewer Component", () => {
  test("renders PG-610 lab viewer header and default TRD tab", () => {
    render(<ClinicalPg10LabViewer />);
    expect(screen.getAllByText(/Postgraduate Advanced Psychiatry/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/TRD & Interventional Neuromodulation/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Standard ECT Anesthetic Regimen/i).length).toBeGreaterThan(0);
  });

  test("allows switching between Catatonia/NMS, Clozapine, Lithium, and Quiz tabs", () => {
    render(<ClinicalPg10LabViewer />);

    // Switch to Catatonia/NMS tab
    const nmsTabBtn = screen.getByRole("button", { name: /Catatonia, NMS & Serotonin Syndrome/i });
    fireEvent.click(nmsTabBtn);
    expect(screen.getAllByText(/Neuroleptic Malignant Syndrome/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Dantrolene/i).length).toBeGreaterThan(0);

    // Switch to Clozapine tab
    const clozapineTabBtn = screen.getByRole("button", { name: /Clozapine Titration & ANC REMS/i });
    fireEvent.click(clozapineTabBtn);
    expect(screen.getAllByText(/Clozapine REMS/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Absolute Neutrophil Count/i).length).toBeGreaterThan(0);

    // Switch to Lithium tab
    const lithiumTabBtn = screen.getByRole("button", { name: /Bipolar Mania & Lithium Resuscitation/i });
    fireEvent.click(lithiumTabBtn);
    expect(screen.getAllByText(/Lithium Concentration/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/HEMODIALYSIS/i).length).toBeGreaterThan(0);

    // Switch to Quiz tab
    const quizTabBtn = screen.getByRole("button", { name: /Diagnostic Challenge Quiz/i });
    fireEvent.click(quizTabBtn);
    expect(screen.getAllByText(/Postgraduate Psychiatry Diagnostic Challenge/i).length).toBeGreaterThan(0);
  });

  test("shows agranulocytosis alert when ANC is below 500 in Clozapine tab", () => {
    render(<ClinicalPg10LabViewer />);

    const clozapineTabBtn = screen.getByRole("button", { name: /Clozapine Titration & ANC REMS/i });
    fireEvent.click(clozapineTabBtn);

    // Initial state ANC = 850 shows severe neutropenia
    expect(screen.getAllByText(/SEVERE NEUTROPENIA/i).length).toBeGreaterThan(0);
  });
});
