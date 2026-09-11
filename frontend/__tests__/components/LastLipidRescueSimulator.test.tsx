import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import LastLipidRescueSimulator from '@/components/simulators/LastLipidRescueSimulator';

describe('LastLipidRescueSimulator Component', () => {
  it('renders header, administration controls, telemetry, and ASRA protocol panels', () => {
    render(<LastLipidRescueSimulator />);
    expect(
      screen.getByText(/Local Anesthetic Systemic Toxicity \(LAST\) & 20% Lipid Rescue Solver/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Local Anesthetic Administration/i)).toBeInTheDocument();
    expect(screen.getByText(/Telemetry & Electrophysiology/i)).toBeInTheDocument();
    expect(screen.getByText(/ASRA 20% Lipid Protocol/i)).toBeInTheDocument();
  });

  it('switches to Bupivacaine TAP block arrest preset and reflects cardiovascular collapse', () => {
    render(<LastLipidRescueSimulator />);
    const tapPresetBtn = screen.getByRole('button', {
      name: /Bupivacaine TAP Block Accidental IV/i,
    });
    fireEvent.click(tapPresetBtn);

    expect(screen.getAllByText(/CARDIOVASCULAR COLLAPSE/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Deliver 20% Lipid Bolus/i).length).toBeGreaterThan(0);
  });

  it('delivers 20% lipid bolus and increases cumulative administered volume', () => {
    render(<LastLipidRescueSimulator />);
    const bolusBtn = screen.getByRole('button', {
      name: /Deliver 20% Lipid Bolus/i,
    });
    fireEvent.click(bolusBtn);

    expect(screen.getAllByText(/105 \/ 840 mL Max/i).length).toBeGreaterThan(0);
  });

  it('flags warning when contraindicated Lidocaine is selected as antiarrhythmic', () => {
    render(<LastLipidRescueSimulator />);
    const lidocaineBtns = screen.getAllByRole('button', { name: 'LIDOCAINE' });
    fireEvent.click(lidocaineBtns[1]);

    expect(screen.getAllByText(/Lidocaine must NEVER be used/i).length).toBeGreaterThan(0);
  });
});
