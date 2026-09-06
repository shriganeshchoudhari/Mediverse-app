import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import NeuromuscularBlockadeSimulator from '@/components/simulators/NeuromuscularBlockadeSimulator';

describe('NeuromuscularBlockadeSimulator Component', () => {
  it('renders main header and primary monitoring panels', () => {
    render(<NeuromuscularBlockadeSimulator />);
    expect(
      screen.getByText(/Neuromuscular Blockade, Train-of-Four & Reversal Workstation/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/NMBA Dosing & Physiology/i)).toBeInTheDocument();
    expect(screen.getByText(/Quantitative TOF Monitor/i)).toBeInTheDocument();
    expect(screen.getByText(/Reversal Pharmacotherapy/i)).toBeInTheDocument();
  });

  it('renders 4-bar twitch labels T1 through T4', () => {
    render(<NeuromuscularBlockadeSimulator />);
    expect(screen.getByText('T1')).toBeInTheDocument();
    expect(screen.getByText('T2')).toBeInTheDocument();
    expect(screen.getByText('T3')).toBeInTheDocument();
    expect(screen.getByText('T4')).toBeInTheDocument();
  });

  it('switches to Cisatracurium in ESRD and displays Neostigmine recommendation', () => {
    render(<NeuromuscularBlockadeSimulator />);
    const cisPresetBtn = screen.getByRole('button', { name: /Hofmann Organ-Independent/i });
    fireEvent.click(cisPresetBtn);

    expect(screen.getAllByText(/Cisatracurium/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/NEOSTIGMINE/i).length).toBeGreaterThan(0);
  });

  it('displays emergency CICO alert banner when CICO preset is activated', () => {
    render(<NeuromuscularBlockadeSimulator />);
    const cicoPresetBtn = screen.getByRole('button', { name: /CRITICAL RESCUE/i });
    fireEvent.click(cicoPresetBtn);

    expect(
      screen.getByText(/CRITICAL AIRWAY CRISIS: Cannot Intubate, Cannot Oxygenate \(CICO\)/i)
    ).toBeInTheDocument();
    expect(screen.getAllByText(/16 mg\/kg/i).length).toBeGreaterThan(0);
  });

  it('warns against extubation during deep or moderate blockade', () => {
    render(<NeuromuscularBlockadeSimulator />);
    expect(screen.getByText(/EXTUBATION UNSAFE: RESIDUAL BLOCK/i)).toBeInTheDocument();
  });
});
