import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CdhPphnSimulator from '../../components/simulators/CdhPphnSimulator';

describe('CdhPphnSimulator Component Tests', () => {
  it('1. Renders workstation header and main title', () => {
    render(<CdhPphnSimulator />);
    expect(screen.getByText(/Congenital Diaphragmatic Hernia & PPHN Workstation/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Pre- vs Post-Ductal Saturation Gradient/i).length).toBeGreaterThanOrEqual(1);
  });

  it('2. Displays dual-saturation monitoring cards for Pre-Ductal and Post-Ductal SpO2', () => {
    render(<CdhPphnSimulator />);
    expect(screen.getByText(/Pre-Ductal \(Right Hand\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Post-Ductal \(Lower Extremity\)/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Ductal Saturation Gradient/i).length).toBeGreaterThanOrEqual(1);
  });

  it('3. Renders clinical case presets and switches to BMV disaster with critical alert', () => {
    render(<CdhPphnSimulator />);
    const bmvPresetBtn = screen.getByText(/2\. Delivery Room BMV Disaster/i);
    expect(bmvPresetBtn).toBeInTheDocument();

    fireEvent.click(bmvPresetBtn);
    expect(screen.getAllByText(/Bag-Mask Ventilation/i).length).toBeGreaterThan(0);
  });

  it('4. Switches between tabs and renders ventilation controls', () => {
    render(<CdhPphnSimulator />);
    const ventTabBtn = screen.getByText(/2\. Gentle Ventilation Bench/i);
    fireEvent.click(ventTabBtn);

    expect(screen.getByText(/Peak Inspiratory Pressure \(PIP\):/i)).toBeInTheDocument();
    expect(screen.getByText(/Conventional Gentle/i)).toBeInTheDocument();
  });

  it('5. Switches to Neonatal ECMO tab and renders cannulation controls', () => {
    render(<CdhPphnSimulator />);
    const ecmoTabBtn = screen.getByText(/4\. Neonatal ECMO Triage/i);
    fireEvent.click(ecmoTabBtn);

    expect(screen.getByText(/Neonatal CDH ECMO Evaluation/i)).toBeInTheDocument();
    expect(screen.getByText(/Head Ultrasound: Intraventricular Hemorrhage/i)).toBeInTheDocument();
  });
});
