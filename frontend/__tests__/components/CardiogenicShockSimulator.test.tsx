/**
 * CardiogenicShockSimulator.test.tsx
 * Component tests for CardiogenicShockSimulator.
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CardiogenicShockSimulator from '../../components/simulators/CardiogenicShockSimulator';

describe('CardiogenicShockSimulator Component', () => {
  it('renders simulator header and clinical title', () => {
    render(<CardiogenicShockSimulator />);
    expect(
      screen.getByText(/Cardiogenic Shock & Mechanical Circulatory Support \(MCS\) Workstation/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Critical Care Cardiology & Hemodynamics Suite/i)
    ).toBeInTheDocument();
  });

  it('renders default Anterior STEMI scenario with SCAI Stage C and CPO warning', () => {
    render(<CardiogenicShockSimulator />);
    expect(screen.getByText(/1. Massive Anterior STEMI with Classic Shock/i)).toBeInTheDocument();
    expect(screen.getAllByText(/SCAI Stage C/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Cardiac Power \(CPO\)/i)).toBeInTheDocument();
  });

  it('deploys recommended Impella CP device and verifies hemodynamic improvement', () => {
    render(<CardiogenicShockSimulator />);
    const deployBtn = screen.getByRole('button', { name: /Deploy IMPELLA CP/i });
    expect(deployBtn).toBeInTheDocument();

    fireEvent.click(deployBtn);
    expect(screen.getByText(/ACTIVE: IMPELLA CP/i)).toBeInTheDocument();
  });

  it('switches to Biventricular/RV Shock scenario and verifies RV Failure and ECPELLA recommendation', () => {
    render(<CardiogenicShockSimulator />);
    const rcaBtn = screen.getByText(/2. Proximal RCA Occlusion with Biventricular Shock/i);
    fireEvent.click(rcaBtn);

    expect(screen.getByText(/Severe Biventricular Collapse Detected/i)).toBeInTheDocument();
    expect(screen.getAllByText(/ECPELLA COMBINED/i).length).toBeGreaterThan(0);
  });

  it('renders the Retrograde ECMO Afterload Trap warning banner', () => {
    render(<CardiogenicShockSimulator />);
    expect(
      screen.getByText(/The Retrograde ECMO Afterload Trap & Mandatory LV Venting/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Veno-Arterial \(VA\) ECMO returns oxygenated blood retrogradely/i)
    ).toBeInTheDocument();
  });
});
