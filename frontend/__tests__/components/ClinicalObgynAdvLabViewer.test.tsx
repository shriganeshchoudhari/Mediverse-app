import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ClinicalObgynAdvLabViewer from "../../components/obgynadv/ClinicalObgynAdvLabViewer";

describe("ClinicalObgynAdvLabViewer Component", () => {
  it("renders with default Preeclampsia mode and displays Severe Features and MgSO4 station", () => {
    render(<ClinicalObgynAdvLabViewer initialMode="preeclampsia" />);

    expect(screen.getByText(/Hypertensive Disorders of Pregnancy: Preeclampsia, HELLP & Magnesium Protocols/i)).toBeInTheDocument();
    expect(screen.getByText(/Obgyn Diagnostic Quiz/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Preeclampsia with Severe Features/i).length).toBeGreaterThan(0);
  });

  it("switches to PPH mode and displays Uterine Atony and Uterotonics station", () => {
    render(<ClinicalObgynAdvLabViewer initialMode="preeclampsia" />);

    const pphTab = screen.getByText(/2. PPH & Uterotonics/i);
    fireEvent.click(pphTab);

    expect(screen.getByText(/Postpartum Hemorrhage \(PPH\): The 4 'T's & Uterotonic Stepwise Escalation/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Tone/i).length).toBeGreaterThan(0);
  });

  it("toggles Obgyn Diagnostic Quiz challenge mode", () => {
    render(<ClinicalObgynAdvLabViewer initialMode="preeclampsia" />);

    const quizBtn = screen.getByText(/Obgyn Diagnostic Quiz/i);
    fireEvent.click(quizBtn);

    expect(screen.getByText(/Exit Challenge/i)).toBeInTheDocument();
    expect(screen.getByText(/Obstetrics & Gynecology Challenge/i)).toBeInTheDocument();
  });
});
