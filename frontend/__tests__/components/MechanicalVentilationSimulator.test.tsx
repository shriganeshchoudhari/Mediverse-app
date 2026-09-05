import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import MechanicalVentilationSimulator from '../../components/simulators/MechanicalVentilationSimulator';

describe('MechanicalVentilationSimulator Component', () => {
  it('renders ventilator console with title, mode buttons, and initial ARDS case', () => {
    render(<MechanicalVentilationSimulator />);

    expect(
      screen.getByRole('heading', { name: /Mechanical Ventilation & Respiratory Mechanics Workstation/i })
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Volume Control (VCV)' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Pressure Control (PCV)' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Pressure Support (PSV)' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'SIMV Mode' })).toBeInTheDocument();

    expect(screen.getByText(/Set Tidal Volume \(VT\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Driving Pressure \(ΔP\)/i)).toBeInTheDocument();
  });

  it('switches ventilator mode to PCV and displays inspiratory pressure controls', () => {
    render(<MechanicalVentilationSimulator />);

    const pcvButton = screen.getByRole('button', { name: 'Pressure Control (PCV)' });
    fireEvent.click(pcvButton);

    expect(screen.getByText(/Inspiratory Pressure \(Pinsp \/ ΔP\)/i)).toBeInTheDocument();
    expect(screen.getByText(/PCV Active/i)).toBeInTheDocument();
  });

  it('loads clinical presets and displays clinical scenario details', () => {
    render(<MechanicalVentilationSimulator />);

    // Click on Status Asthmaticus preset
    const asthmaBtn = screen.getByRole('button', { name: /Status Asthmaticus/i });
    fireEvent.click(asthmaBtn);

    expect(screen.getByText(/Case: Status Asthmaticus: Bronchospasm & High Auto-PEEP/i)).toBeInTheDocument();

    // Toggle teaching pearls
    const revealBtn = screen.getByRole('button', { name: /Reveal Respiratory Teaching/i });
    fireEvent.click(revealBtn);

    expect(screen.getByText(/Clinical & Physiological Pearls:/i)).toBeInTheDocument();
    expect(screen.getByText(/large peak-to-plateau gradient/i)).toBeInTheDocument();
  });

  it('toggles diagnostic maneuvers (Inspiratory Hold & Expiratory Hold)', () => {
    render(<MechanicalVentilationSimulator />);

    const inspHoldBtn = screen.getByRole('button', { name: /Inspiratory Hold/i });
    fireEvent.click(inspHoldBtn);
    expect(screen.getByRole('button', { name: /Inspiratory Hold: ON/i })).toBeInTheDocument();

    const expHoldBtn = screen.getByRole('button', { name: /Expiratory Hold/i });
    fireEvent.click(expHoldBtn);
    expect(screen.getByRole('button', { name: /Expiratory Hold: ON/i })).toBeInTheDocument();
  });

  it('dispatches mediverse:open-ai-with-context event when Consult Socratic AI is clicked', () => {
    const dispatchSpy = jest.spyOn(window, 'dispatchEvent');
    render(<MechanicalVentilationSimulator />);

    const aiBtn = screen.getByRole('button', { name: /Consult Socratic AI/i });
    fireEvent.click(aiBtn);

    expect(dispatchSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'mediverse:open-ai-with-context',
      })
    );

    dispatchSpy.mockRestore();
  });

  it('resets ventilator settings to standard baseline when Reset is clicked', () => {
    render(<MechanicalVentilationSimulator />);

    // First load asthma preset
    const asthmaBtn = screen.getByRole('button', { name: /Status Asthmaticus/i });
    fireEvent.click(asthmaBtn);

    // Now click reset
    const resetBtn = screen.getByRole('button', { name: /Reset/i });
    fireEvent.click(resetBtn);

    // Should return to 450 mL default VT
    expect(screen.getAllByText(/450 mL/i)[0]).toBeInTheDocument();
  });
});
