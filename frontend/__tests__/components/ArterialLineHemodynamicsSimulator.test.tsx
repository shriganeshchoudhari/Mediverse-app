import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ArterialLineHemodynamicsSimulator from '../../components/simulators/ArterialLineHemodynamicsSimulator';

describe('ArterialLineHemodynamicsSimulator Component', () => {
  beforeEach(() => {
    jest.spyOn(window, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders simulator header, scoreboard, and tabs correctly', () => {
    render(<ArterialLineHemodynamicsSimulator />);

    expect(
      screen.getByText(/Arterial Line Hemodynamics, PPV & Fluid Responsiveness Workstation/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Invasive Arterial Line/i)).toBeInTheDocument();
    expect(screen.getByText(/Displayed Arterial BP/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Pulse Pressure Variation/i).length).toBeGreaterThan(0);

    // Verify 4 tab buttons
    expect(screen.getByText(/1\. Arterial Waveform & Hemodynamics/i)).toBeInTheDocument();
    expect(screen.getByText(/2\. Dynamic Fluid Responsiveness & Ea_dyn/i)).toBeInTheDocument();
    expect(screen.getByText(/3\. Fast-Flush Square Wave & Damping/i)).toBeInTheDocument();
    expect(screen.getByText(/4\. Ventilator Interactions & Confounders/i)).toBeInTheDocument();
  });

  it('switches clinical presets and updates volume responsiveness', () => {
    render(<ArterialLineHemodynamicsSimulator />);

    const presetSelect = screen.getByLabelText(/Clinical Preset/i);
    expect(presetSelect).toBeInTheDocument();

    // Default is euvolemic non-responder
    expect(screen.getAllByText(/NON RESPONSIVE/i).length).toBeGreaterThan(0);

    // Switch to Septic Shock Hypovolemic preset
    fireEvent.change(presetSelect, { target: { value: 'SEPTIC_SHOCK_HYPOVOLEMIC' } });

    // Now should be RESPONSIVE
    expect(screen.getAllByText(/RESPONSIVE/i).length).toBeGreaterThan(0);
  });

  it('triggers fast-flush square wave test', () => {
    render(<ArterialLineHemodynamicsSimulator />);

    const flushButton = screen.getByText(/Trigger Fast-Flush Test/i);
    expect(flushButton).toBeInTheDocument();

    fireEvent.click(flushButton);

    // Button should enter flushing state
    expect(screen.getByText(/FLUSHING \(300 mmHg\)\.\.\./i)).toBeInTheDocument();
  });

  it('switches tabs and interacts with Damping Test and Confounders', () => {
    render(<ArterialLineHemodynamicsSimulator />);

    // Switch to tab 3 (Damping Test)
    fireEvent.click(screen.getByText(/3\. Fast-Flush Square Wave & Damping/i));
    expect(screen.getAllByText(/Damping Coefficient/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Air Bubble in Dome \/ Tubing/i)).toBeInTheDocument();

    // Switch to tab 4 (Confounders)
    fireEvent.click(screen.getByText(/4\. Ventilator Interactions & Confounders/i));
    expect(screen.getByText(/1\. Absence of Spontaneous Breathing Efforts/i)).toBeInTheDocument();
    expect(screen.getByText(/2\. Regular Sinus Rhythm/i)).toBeInTheDocument();
  });
});
