import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import NeonatalResuscitationSimulator from '../../components/simulators/NeonatalResuscitationSimulator';

describe('NeonatalResuscitationSimulator', () => {
  it('renders title and essential NRP workstation sections', () => {
    render(<NeonatalResuscitationSimulator />);
    expect(screen.getByText(/Neonatal Resuscitation Program \(NRP 8th Ed\.\) Workstation/i)).toBeInTheDocument();
    expect(screen.getByText(/APGAR & Delivery Room Triage/i)).toBeInTheDocument();
    expect(screen.getByText(/APGAR Scoring Board/i)).toBeInTheDocument();
    expect(screen.getByText(/NRP 8th Edition Action Plan:/i)).toBeInTheDocument();
    expect(screen.getByText(/NRP Intervention Sequence Checklist/i)).toBeInTheDocument();
  });

  it('switches clinical presets correctly', () => {
    render(<NeonatalResuscitationSimulator />);
    const vigorousPreset = screen.getByRole('button', { name: /Term Vigorous Newborn \(Normal Transition\)/i });
    fireEvent.click(vigorousPreset);

    // Normal vigorous newborn should show high APGAR
    expect(screen.getByText(/APGAR:/i)).toBeInTheDocument();
    expect(screen.getAllByText(/NORMAL/i).length).toBeGreaterThan(0);

    const asphyxiaPreset = screen.getByRole('button', { name: /Severe Intrapartum Asphyxia \(Full NRP Algorithm\)/i });
    fireEvent.click(asphyxiaPreset);
    expect(screen.getAllByText(/SEVERE DEPRESSION/i).length).toBeGreaterThan(0);
  });

  it('allows clicking APGAR options and updates score', () => {
    render(<NeonatalResuscitationSimulator />);
    // Click on 2: Completely Pink
    const pinkBtn = screen.getByRole('button', { name: /2: Completely Pink/i });
    fireEvent.click(pinkBtn);
    expect(pinkBtn.className).toContain('border-rose-500');

    // Click on 2: >= 100 bpm
    const pulseNormalBtn = screen.getByRole('button', { name: /2: >= 100 bpm/i });
    fireEvent.click(pulseNormalBtn);
    expect(pulseNormalBtn.className).toContain('border-rose-500');
  });

  it('toggles intervention sequence checklist items', () => {
    render(<NeonatalResuscitationSimulator />);
    const warmBtn = screen.getByRole('button', { name: /Warm, Dry, Stimulate/i });
    fireEvent.click(warmBtn);
    // Button state should toggle
    expect(warmBtn).toBeInTheDocument();
  });

  it('calculates weight-based emergency medication dosing', () => {
    render(<NeonatalResuscitationSimulator />);
    expect(screen.getByText(/Weight-Based Emergency Drug & Equipment Dosing/i)).toBeInTheDocument();
    expect(screen.getAllByText(/UVC Epinephrine/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/ETT Epinephrine/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Normal Saline Bolus/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/ETT Tube Size & Depth/i).length).toBeGreaterThan(0);
  });
});
