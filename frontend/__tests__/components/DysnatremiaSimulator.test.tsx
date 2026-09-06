import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DysnatremiaSimulator from '../../components/simulators/DysnatremiaSimulator';

describe('DysnatremiaSimulator Component', () => {
  beforeEach(() => {
    // Mock window.alert
    jest.spyOn(window, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders simulator header, scoreboard, and all 5 tabs correctly', () => {
    render(<DysnatremiaSimulator />);

    expect(
      screen.getByText(/Dysnatremia, Hyponatremia\/Hypernatremia Kinetics & Osmotherapy Workstation/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Nephrology & Critical Care/i)).toBeInTheDocument();
    expect(screen.getByText(/Serum Sodium & Posm/i)).toBeInTheDocument();
    expect(screen.getByText(/24-Hour Projected ΔNa/i)).toBeInTheDocument();
    expect(screen.getByText(/Free Water Deficit \(FWD\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Etiology Classification/i)).toBeInTheDocument();

    // Verify 5 tab buttons
    expect(screen.getByText(/1\. Diagnostic Algorithm & Urine Studies/i)).toBeInTheDocument();
    expect(screen.getByText(/2\. Adrogué-Madias Fluid Kinetics/i)).toBeInTheDocument();
    expect(screen.getByText(/3\. Acute 3% NaCl Bolus Simulator/i)).toBeInTheDocument();
    expect(screen.getByText(/4\. ODS Safety & DDAVP Rescue/i)).toBeInTheDocument();
    expect(screen.getByText(/5\. Neuro-Osmotherapy \(ICP & TBI\)/i)).toBeInTheDocument();
  });

  it('switches clinical presets and displays emergency symptomatic hyponatremia banner', () => {
    render(<DysnatremiaSimulator />);

    // Default preset is ACUTE_SEVERE_SYMPTOMATIC_HYPONATREMIA
    expect(
      screen.getAllByText(/CRITICAL EMERGENCY: SEVERE SYMPTOMATIC HYPONATREMIA/i).length
    ).toBeGreaterThan(0);
    expect(screen.getByRole('button', { name: /Push 100 mL 3% NaCl Bolus/i })).toBeInTheDocument();

    // Switch to Chronic SIADH preset
    const presetSelect = screen.getByLabelText(/Clinical Preset/i);
    fireEvent.change(presetSelect, { target: { value: 'CHRONIC_SIADH_PARANEOPLASTIC' } });

    // Symptomatic emergency banner should now be absent
    expect(
      screen.queryByText(/CRITICAL EMERGENCY: SEVERE SYMPTOMATIC HYPONATREMIA/i)
    ).not.toBeInTheDocument();
    expect(screen.getAllByText(/HYPOTONIC EUVOLEMIC SIADH/i).length).toBeGreaterThan(0);
  });

  it('triggers emergency 3% NaCl bolus and displays confirmation alert', () => {
    render(<DysnatremiaSimulator />);

    const bolusButton = screen.getByRole('button', { name: /Push 100 mL 3% NaCl Bolus/i });
    fireEvent.click(bolusButton);

    expect(window.alert).toHaveBeenCalledWith(
      expect.stringMatching(/EMERGENCY 3% HYPERTONIC SALINE BOLUS GIVEN/i)
    );
  });

  it('switches to ODS safety tab and deploys DDAVP clamp rescue', () => {
    render(<DysnatremiaSimulator />);

    // Click Tab 4: ODS Safety
    fireEvent.click(screen.getByText(/4\. ODS Safety & DDAVP Rescue/i));

    expect(
      screen.getByText(/Osmotic Demyelination Syndrome \(ODS\) Guardrails & DDAVP Clamp/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/24-Hour Safe Correction Limit/i)).toBeInTheDocument();

    // Switch to overcorrection preset
    const presetSelect = screen.getByLabelText(/Clinical Preset/i);
    fireEvent.change(presetSelect, { target: { value: 'OVERCORRECTION_RESCUE_DDAVP' } });

    // Should display overcorrection banner and rescue button
    expect(screen.getAllByText(/OVERCORRECTION CRISIS/i).length).toBeGreaterThan(0);
    const rescueButton = screen.getByRole('button', { name: /Deploy DDAVP Clamp \+ D5W Rescue/i });
    expect(rescueButton).toBeInTheDocument();

    fireEvent.click(rescueButton);
    expect(window.alert).toHaveBeenCalledWith(
      expect.stringMatching(/DDAVP CLAMP & D5W RESCUE DEPLOYED/i)
    );
  });

  it('switches to Neuro-Osmotherapy tab and renders 3% NaCl vs 20% Mannitol comparison', () => {
    render(<DysnatremiaSimulator />);

    // Click Tab 5: Neuro-Osmotherapy
    fireEvent.click(screen.getByText(/5\. Neuro-Osmotherapy \(ICP & TBI\)/i));

    expect(
      screen.getByText(/Targeted Neuro-Osmotherapy \(ICP, Cerebral Edema & TBI\)/i)
    ).toBeInTheDocument();
    expect(screen.getAllByText(/3% Hypertonic Saline/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/20% Mannitol/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Osmotherapy Safety Ceilings/i)).toBeInTheDocument();
  });
});
