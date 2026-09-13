import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import MethemoglobinSimulator from '../../components/simulators/MethemoglobinSimulator';

describe('MethemoglobinSimulator Component Tests', () => {
  it('1. Renders workstation header and main title', () => {
    render(<MethemoglobinSimulator />);
    expect(screen.getByText(/Methemoglobinemia & Sulfhemoglobinemia Workstation/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Pulse Oximetry Saturation Gap/i).length).toBeGreaterThanOrEqual(1);
  });

  it('2. Displays hero oximetry grid with SpO2, Co-Oximetry, Saturation Gap, and Blood Appearance', () => {
    render(<MethemoglobinSimulator />);
    expect(screen.getByText(/Pulse Oximeter \(SpO2\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Co-Oximetry \(SaO2\)/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Saturation Gap/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/Blood Appearance/i)).toBeInTheDocument();
  });

  it('3. Renders clinical case presets and switches to G6PD crisis with critical alert', () => {
    render(<MethemoglobinSimulator />);
    const g6pdPresetBtn = screen.getByText(/3\. G6PD Hemolysis Catastrophe/i);
    expect(g6pdPresetBtn).toBeInTheDocument();

    fireEvent.click(g6pdPresetBtn);
    expect(screen.getAllByText(/G6PD CONTRAINDICATION/i).length).toBeGreaterThan(0);
  });

  it('4. Switches between tabs and renders Methylene Blue antidote controls', () => {
    render(<MethemoglobinSimulator />);
    const antidoteTabBtn = screen.getByText(/3\. Methylene Blue & Transfusion/i);
    fireEvent.click(antidoteTabBtn);

    expect(screen.getByText(/Methylene Blue IV Dose:/i)).toBeInTheDocument();
    expect(screen.getByText(/Ascorbic Acid IV \(Vitamin C\):/i)).toBeInTheDocument();
  });

  it('5. Switches to Genetics tab and renders G6PD status controls', () => {
    render(<MethemoglobinSimulator />);
    const geneticsTabBtn = screen.getByText(/2\. Genetics & Vulnerabilities/i);
    fireEvent.click(geneticsTabBtn);

    expect(screen.getByText(/Glucose-6-Phosphate Dehydrogenase \(G6PD\) Status/i)).toBeInTheDocument();
    expect(screen.getByText(/Concurrent SSRI \/ SNRI \/ TCA Therapy/i)).toBeInTheDocument();
  });
});
