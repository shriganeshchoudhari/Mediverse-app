import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import EcmoCannulationSimulator from '../../components/simulators/EcmoCannulationSimulator';

describe('EcmoCannulationSimulator Component', () => {
  it('1. renders workstation title and clinical badge', () => {
    render(<EcmoCannulationSimulator />);
    expect(screen.getByText(/ECMO Cannulation & Harlequin Syndrome Workstation/i)).toBeInTheDocument();
    expect(screen.getByText(/Track B46 • Route #247/i)).toBeInTheDocument();
  });

  it('2. displays hero 4-panel grid metrics and dual circulation status', () => {
    render(<EcmoCannulationSimulator />);
    expect(screen.getByText(/ECMO CONFIGURATION & FLOW/i)).toBeInTheDocument();
    expect(screen.getByText(/HARLEQUIN DUAL CIRCULATION/i)).toBeInTheDocument();
    expect(screen.getByText(/LV AFTERLOAD & VENTING/i)).toBeInTheDocument();
    expect(screen.getByText(/LIMB PERFUSION & SAFETY/i)).toBeInTheDocument();
  });

  it('3. navigates across all four interactive clinical tabs', () => {
    render(<EcmoCannulationSimulator />);

    // Tab 2: Harlequin Dual Circulation
    const hqTab = screen.getByRole('button', { name: /2\. Harlequin \(North-South\) Dual Circulation/i });
    fireEvent.click(hqTab);
    expect(screen.getByText(/Dual-Circulation Mechanics/i)).toBeInTheDocument();
    expect(screen.getByText(/The North-South Watershed Dilemma/i)).toBeInTheDocument();

    // Tab 3: LV Venting & Limb Perfusion
    const ventTab = screen.getByRole('button', { name: /3\. LV Venting \(ECPELLA\) & Limb Perfusion/i });
    fireEvent.click(ventTab);
    expect(screen.getByText(/LV Unloading & Limb Protection/i)).toBeInTheDocument();
    expect(screen.getByText(/The ECPELLA Mechanical Synergy/i)).toBeInTheDocument();

    // Tab 4: Pearls & Guidelines
    const pearlsTab = screen.getByRole('button', { name: /4\. Clinical Pearls & ELSO Guidelines/i });
    fireEvent.click(pearlsTab);
    expect(screen.getByText(/ELSO Management Protocol/i)).toBeInTheDocument();
    expect(screen.getByText(/Critical Practice Pitfalls/i)).toBeInTheDocument();
  });

  it('4. activates Harlequin North-South crisis preset and displays critical alert', () => {
    render(<EcmoCannulationSimulator />);
    const hqBtn = screen.getByRole('button', { name: /Harlequin North-South Crisis/i });
    fireEvent.click(hqBtn);

    expect(screen.getAllByText(/HARLEQUIN \(NORTH-SOUTH\) SYNDROME CATASTROPHE/i).length).toBeGreaterThan(0);
  });

  it('5. triggers alert for misleading left radial arterial line trap', () => {
    render(<EcmoCannulationSimulator />);
    const trapBtn = screen.getByRole('button', { name: /Left Radial Monitoring Trap/i });
    fireEvent.click(trapBtn);

    expect(screen.getAllByText(/MONITORING PRACTICE ERROR/i).length).toBeGreaterThan(0);
  });
});
