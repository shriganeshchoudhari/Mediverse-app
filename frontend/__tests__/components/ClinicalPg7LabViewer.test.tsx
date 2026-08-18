import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ClinicalPg7LabViewer } from "@/components/pg7/ClinicalPg7LabViewer";

describe("ClinicalPg7LabViewer Component", () => {
  test("renders PG-607 lab viewer header and default Pelvic Ring tab", () => {
    render(<ClinicalPg7LabViewer />);
    expect(screen.getAllByText(/Postgraduate Orthopedics/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Pelvic Ring/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Greater Trochanters/i).length).toBeGreaterThan(0);
  });

  test("allows switching between Open Fractures, ACS, Oncology, and Quiz tabs", () => {
    render(<ClinicalPg7LabViewer />);

    // Switch to Open Fractures tab
    const openFxTabBtn = screen.getByRole("button", { name: /Open Fractures & MESS/i });
    fireEvent.click(openFxTabBtn);
    expect(screen.getAllByText(/Gustilo-Anderson/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/MESS Score/i).length).toBeGreaterThan(0);

    // Switch to ACS tab
    const acsTabBtn = screen.getByRole("button", { name: /Acute Compartment & Fasciotomy/i });
    fireEvent.click(acsTabBtn);
    expect(screen.getAllByText(/Delta Pressure/i).length).toBeGreaterThan(0);

    // Switch to Oncology tab
    const oncoTabBtn = screen.getByRole("button", { name: /Musculoskeletal Oncology/i });
    fireEvent.click(oncoTabBtn);
    expect(screen.getAllByText(/Enneking/i).length).toBeGreaterThan(0);

    // Switch to Quiz tab
    const quizTabBtn = screen.getByRole("button", { name: /Diagnostic Challenge Quiz/i });
    fireEvent.click(quizTabBtn);
    expect(screen.getAllByText(/Question 1 of/i).length).toBeGreaterThan(0);
  });

  test("calculates Delta pressure dynamically when compartment pressure changes", () => {
    render(<ClinicalPg7LabViewer />);
    // Switch to ACS tab
    const acsTabBtn = screen.getByRole("button", { name: /Acute Compartment & Fasciotomy/i });
    fireEvent.click(acsTabBtn);

    const sliders = screen.getAllByRole("slider");
    // Diastolic BP = 60, ICP = 45 -> Delta P = 15 mmHg
    fireEvent.change(sliders[0], { target: { value: "60" } });
    fireEvent.change(sliders[1], { target: { value: "45" } });
    expect(screen.getAllByText(/15 mmHg/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/CRITICAL ISCHEMIA/i).length).toBeGreaterThan(0);
  });
});
