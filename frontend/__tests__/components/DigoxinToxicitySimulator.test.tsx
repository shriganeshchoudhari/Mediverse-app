import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DigoxinToxicitySimulator from '../../components/simulators/DigoxinToxicitySimulator';

describe('DigoxinToxicitySimulator Component', () => {
  it('renders the Digoxin Toxicity and DigiFab Stoichiometry title and sections', () => {
    render(<DigoxinToxicitySimulator />);

    expect(
      screen.getByText(/Digoxin Toxicity, DigiFab Stoichiometry & Arrhythmia Workstation/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Patient Exposure & Kinetics/i)).toBeInTheDocument();
    expect(screen.getByText(/Potassium & Electrophysiology/i)).toBeInTheDocument();
    expect(screen.getByText(/DigiFab Dosing Stoichiometry/i)).toBeInTheDocument();
  });

  it('correctly calculates acute massive overdose stoichiometry (16 Vials)', () => {
    render(<DigoxinToxicitySimulator />);

    const acutePresetBtn = screen.getByText(/Acute Massive Overdose \(Severe Hyperkalemia\)/i);
    fireEvent.click(acutePresetBtn);

    // Should indicate antidote is required
    expect(screen.getAllByText(/ANTIDOTE INDICATED/i).length).toBeGreaterThanOrEqual(1);

    // Stoichiometric dosing: 10 mg ingested = 16 Vials
    expect(screen.getAllByText(/16 Vials/i).length).toBeGreaterThanOrEqual(1);

    // Critical hyperkalemia check
    expect(screen.getByText(/Smith Prognostic Mortality Risk/i)).toBeInTheDocument();
  });

  it('handles therapeutic digitalis preset (0 Vials, Observe)', () => {
    render(<DigoxinToxicitySimulator />);

    const therapeuticPresetBtn = screen.getByText(/Therapeutic Level with Salvador Dali ST Depression/i);
    fireEvent.click(therapeuticPresetBtn);

    expect(screen.getAllByText(/OBSERVE \(NO FAB\)/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/0 Vials/i).length).toBeGreaterThanOrEqual(1);
  });

  it('mandates 20 vials and warns against calcium on cardiac arrest toggle', () => {
    render(<DigoxinToxicitySimulator />);

    const arrestToggleBtn = screen.getByRole('button', { name: /Hemodynamically Stable/i });
    fireEvent.click(arrestToggleBtn);

    expect(screen.getAllByText(/20 Vials/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/STONE HEART/i).length).toBeGreaterThanOrEqual(1);
  });
});
