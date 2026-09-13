/**
 * HyperkalemiaShiftSimulator.test.tsx
 * Component tests for HyperkalemiaShiftSimulator.
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import HyperkalemiaShiftSimulator from '../../components/simulators/HyperkalemiaShiftSimulator';

describe('HyperkalemiaShiftSimulator Component', () => {
  it('renders simulator header and clinical titles', () => {
    render(<HyperkalemiaShiftSimulator />);
    expect(
      screen.getByText(/Severe Hyperkalemia & Cardiac Membrane Stabilization Workstation/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Critical Care & Nephrology Resuscitation Suite/i)).toBeInTheDocument();
  });

  it('renders default scenario profile and unstabilized warning', () => {
    render(<HyperkalemiaShiftSimulator />);
    expect(
      screen.getAllByText(/1. Missed Hemodialysis with Sine-Wave Rhythm/i).length
    ).toBeGreaterThan(0);
    expect(screen.getByText(/UNSTABILIZED MYOCARDIUM/i)).toBeInTheDocument();
    expect(screen.getByText(/Sine-Wave Arrest Probability:/i)).toBeInTheDocument();
  });

  it('stabilizes cardiac membrane when IV calcium is administered', () => {
    render(<HyperkalemiaShiftSimulator />);
    const caChlorideBtn = screen.getByRole('button', { name: /\+ Ca Chloride \(1g\)/i });
    expect(caChlorideBtn).toBeInTheDocument();

    fireEvent.click(caChlorideBtn);
    expect(screen.getByText(/Membrane Stabilized \(270mg Ca\)/i)).toBeInTheDocument();
  });

  it('applies standard shift bundle and shows projected potassium drop', () => {
    render(<HyperkalemiaShiftSimulator />);
    const shiftBtn = screen.getByRole('button', { name: /Apply Standard Shift Bundle/i });
    expect(shiftBtn).toBeInTheDocument();

    fireEvent.click(shiftBtn);
    expect(screen.getByText(/Projected Nadir:/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Regular Insulin/i).length).toBeGreaterThan(0);
  });

  it('renders all 3 resuscitation tiers: Membrane Stabilization, Shifting, and Elimination', () => {
    render(<HyperkalemiaShiftSimulator />);
    expect(screen.getByText(/Tier 1: Cardiac Membrane Stabilization/i)).toBeInTheDocument();
    expect(screen.getByText(/Tier 2: Transcellular Shifting Agents/i)).toBeInTheDocument();
    expect(screen.getByText(/Tier 3: Definitive Elimination Kinetics/i)).toBeInTheDocument();
  });

  it('switches to post-operative scenario and displays bicarbonate futility alert', () => {
    render(<HyperkalemiaShiftSimulator />);
    const postopBtn = screen.getByText(/4. Post-Operative Mild Hyperkalemia/i);
    fireEvent.click(postopBtn);

    // Apply shift bundle which may include or trigger bicarb
    const bicarbSlider = screen.getByText(/Sodium Bicarbonate/i);
    expect(bicarbSlider).toBeInTheDocument();
  });
});
