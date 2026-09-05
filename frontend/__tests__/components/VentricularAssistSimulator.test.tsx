import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import VentricularAssistSimulator from '@/components/simulators/VentricularAssistSimulator';

describe('VentricularAssistSimulator Component', () => {
  beforeEach(() => {
    jest.spyOn(window, 'requestAnimationFrame').mockImplementation(cb => {
      return setTimeout(() => cb(1000), 16) as unknown as number;
    });
    jest.spyOn(window, 'cancelAnimationFrame').mockImplementation(id => {
      clearTimeout(id as unknown as NodeJS.Timeout);
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders AIC console, P-level selector, PV loop canvas, and CPO vitals', () => {
    render(<VentricularAssistSimulator />);

    expect(
      screen.getByRole('heading', { name: /Clinical Scenario & Preset Selection/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/Automated Impella Controller \(AIC\) & MCS Workstation/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Cardiac Power Output/i)[0]).toBeInTheDocument();
    expect(screen.getByText(/Left Ventricular Pressure-Volume \(PV\) Loop Unloading Dynamics/i)).toBeInTheDocument();
    expect(screen.getByText(/Transvalvular Catheter Position & Microaxial Streamline Flow/i)).toBeInTheDocument();
  });

  it('switches clinical presets and updates device settings and alarms', () => {
    render(<VentricularAssistSimulator />);

    // Switch to Purge Gap Thrombus preset
    const hitBtn = screen.getByText(/Purge System Motor Gap Clot/i);
    fireEvent.click(hitBtn);

    expect(screen.getByText(/CRITICAL CONTROLLER ALARM DETECTED/i)).toBeInTheDocument();
    expect(screen.getAllByText(/PURGE_PRESSURE_HIGH/i).length).toBeGreaterThan(0);
  });

  it('allows P-level adjustment and updates rotational speed and pump flow', () => {
    render(<VentricularAssistSimulator />);

    // Click P9
    const p9Btn = screen.getByRole('button', { name: /^P9$/i });
    fireEvent.click(p9Btn);

    expect(screen.getByText(/46,000 RPM/i)).toBeInTheDocument();
    expect(screen.getAllByText(/4.0/i).length).toBeGreaterThan(0); // Impella CP flow at P9
  });

  it('handles cannula repositioning and volume bolus corrective actions', () => {
    render(<VentricularAssistSimulator />);

    // Select Ao-Ao malposition preset
    const malposBtn = screen.getByText(/Cannula Migration: Inflow Retracted/i);
    fireEvent.click(malposBtn);

    expect(screen.getByText(/Ao-Ao Position \(No LV Unloading\)/i)).toBeInTheDocument();

    // Click quick action to reposition
    const repoBtn = screen.getByRole('button', { name: /Reposition Cannula to LV/i });
    fireEvent.click(repoBtn);

    expect(screen.getByText(/Cannula successfully repositioned/i)).toBeInTheDocument();
  });

  it('dispatches Socratic AI custom event with full hemodynamic context', () => {
    const dispatchSpy = jest.spyOn(window, 'dispatchEvent');
    render(<VentricularAssistSimulator />);

    const aiBtn = screen.getByRole('button', { name: /Ask Socratic AI/i });
    fireEvent.click(aiBtn);

    expect(dispatchSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'mediverse:open-ai-with-context'
      })
    );
  });
});
