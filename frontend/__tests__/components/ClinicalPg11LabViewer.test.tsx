import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ClinicalPg11LabViewer } from "@/components/pg11/ClinicalPg11LabViewer";

describe("ClinicalPg11LabViewer Component", () => {
  test("renders PG-611 lab viewer header and default SCI tab", () => {
    render(<ClinicalPg11LabViewer />);
    expect(screen.getAllByText(/Postgraduate Advanced Physical Medicine/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/SCI & Autonomic Dysreflexia/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/ISNCSCI Classification/i).length).toBeGreaterThan(0);
  });

  test("allows switching between TBI, Spasticity, Pediatric CP, and Quiz tabs", () => {
    render(<ClinicalPg11LabViewer />);

    // Switch to TBI tab
    const tbiTabBtn = screen.getByRole("button", { name: /TBI Cognitive Staging & Concussion/i });
    fireEvent.click(tbiTabBtn);
    expect(screen.getAllByText(/Rancho Los Amigos Cognitive Staging/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Amantadine/i).length).toBeGreaterThan(0);

    // Switch to Spasticity tab
    const spasticityTabBtn = screen.getByRole("button", { name: /Spasticity & Chemodenervation/i });
    fireEvent.click(spasticityTabBtn);
    expect(screen.getAllByText(/Modified Ashworth Scale/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Targeted Botulinum Toxin A/i).length).toBeGreaterThan(0);

    // Switch to Pediatric CP tab
    const pedTabBtn = screen.getByRole("button", { name: /Pediatric CP, Gait & Prosthetics/i });
    fireEvent.click(pedTabBtn);
    expect(screen.getAllByText(/Gross Motor Function Classification/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Ground Reaction AFO/i).length).toBeGreaterThan(0);

    // Switch to Quiz tab
    const quizTabBtn = screen.getByRole("button", { name: /Diagnostic Challenge Quiz/i });
    fireEvent.click(quizTabBtn);
    expect(screen.getAllByText(/Postgraduate PM&R Diagnostic Challenge/i).length).toBeGreaterThan(0);
  });

  test("triggers ITB withdrawal alert when button toggled in Spasticity tab", () => {
    render(<ClinicalPg11LabViewer />);

    const spasticityTabBtn = screen.getByRole("button", { name: /Spasticity & Chemodenervation/i });
    fireEvent.click(spasticityTabBtn);

    const toggleBtn = screen.getByRole("button", { name: /ITB Pump Infusing/i });
    fireEvent.click(toggleBtn);

    expect(screen.getAllByText(/INTRATHECAL BACLOFEN WITHDRAWAL CRISIS/i).length).toBeGreaterThan(0);
  });
});
