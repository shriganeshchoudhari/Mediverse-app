import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ClinicalPg12LabViewer } from "@/components/pg12/ClinicalPg12LabViewer";

describe("ClinicalPg12LabViewer Component", () => {
  test("renders PG-612 lab viewer header and default PSMA tab", () => {
    render(<ClinicalPg12LabViewer />);
    expect(screen.getAllByText(/Postgraduate Advanced Nuclear Medicine/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/PSMA Theranostics & Lu-177 Pluvicto/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/VISION CRITERIA MET/i).length).toBeGreaterThan(0);
  });

  test("allows switching between PRRT, Thyroid, Cardiology, and Quiz tabs", () => {
    render(<ClinicalPg12LabViewer />);

    // Switch to PRRT tab
    const prrtTabBtn = screen.getByRole("button", { name: /PRRT Lu-177 DOTATATE & NETs/i });
    fireEvent.click(prrtTabBtn);
    expect(screen.getAllByText(/PRRT SSTR2 Staging/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Lutathera/i).length).toBeGreaterThan(0);

    // Switch to Thyroid tab
    const thyroidTabBtn = screen.getByRole("button", { name: /Thyroid I-131 Ablation & rhTSH/i });
    fireEvent.click(thyroidTabBtn);
    expect(screen.getAllByText(/ATA Recurrence Risk Category/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Thyrogen/i).length).toBeGreaterThan(0);

    // Switch to Cardiology tab
    const cardioTabBtn = screen.getByRole("button", { name: /Nuclear Cardiology MPI & ALARA/i });
    fireEvent.click(cardioTabBtn);
    expect(screen.getAllByText(/Stress Modality Selection/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Regadenoson/i).length).toBeGreaterThan(0);

    // Switch to Quiz tab
    const quizTabBtn = screen.getByRole("button", { name: /Diagnostic Challenge Quiz/i });
    fireEvent.click(quizTabBtn);
    expect(screen.getAllByText(/Postgraduate Nuclear Medicine Diagnostic Challenge/i).length).toBeGreaterThan(0);
  });

  test("triggers carcinoid crisis alert when button toggled in PRRT tab", () => {
    render(<ClinicalPg12LabViewer />);

    const prrtTabBtn = screen.getByRole("button", { name: /PRRT Lu-177 DOTATATE & NETs/i });
    fireEvent.click(prrtTabBtn);

    const toggleBtn = screen.getByRole("button", { name: /Hemodynamically Stable/i });
    fireEvent.click(toggleBtn);

    expect(screen.getAllByText(/ACUTE CARCINOID CRISIS TRIGGERED/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Octreotide/i).length).toBeGreaterThan(0);
  });
});
