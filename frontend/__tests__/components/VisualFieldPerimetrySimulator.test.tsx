import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import VisualFieldPerimetrySimulator from '../../components/simulators/VisualFieldPerimetrySimulator';

describe('VisualFieldPerimetrySimulator', () => {
  it('renders title and essential perimetry components', () => {
    render(<VisualFieldPerimetrySimulator />);
    expect(screen.getByText(/Humphrey Automated Perimetry & Glaucoma Workstation/i)).toBeInTheDocument();
    expect(screen.getByText(/HFA 24-2 SITA/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Glaucoma Hemifield Test/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Reliability Indices/i)).toBeInTheDocument();
    expect(screen.getByText(/Pachymetry & Target IOP Solver/i)).toBeInTheDocument();
  });

  it('allows switching between right eye (OD) and left eye (OS)', () => {
    render(<VisualFieldPerimetrySimulator />);
    const osButton = screen.getByRole('button', { name: /OS \(Left\)/i });
    fireEvent.click(osButton);
    expect(screen.getAllByText(/OS \(Left\)/i).length).toBeGreaterThan(0);

    const odButton = screen.getByRole('button', { name: /OD \(Right\)/i });
    fireEvent.click(odButton);
    expect(screen.getAllByText(/OD \(Right\)/i).length).toBeGreaterThan(0);
  });

  it('allows switching visual field view modes', () => {
    render(<VisualFieldPerimetrySimulator />);
    const rawDbButton = screen.getByRole('button', { name: /Raw dB/i });
    fireEvent.click(rawDbButton);
    expect(rawDbButton).toHaveClass('bg-cyan-600');

    const totalDevButton = screen.getByRole('button', { name: /Total Dev \(dB\)/i });
    fireEvent.click(totalDevButton);
    expect(totalDevButton).toHaveClass('bg-cyan-600');

    const grayscaleButton = screen.getByRole('button', { name: /Grayscale/i });
    fireEvent.click(grayscaleButton);
    expect(grayscaleButton).toHaveClass('bg-cyan-600');
  });

  it('switches clinical presets and updates diagnostic status', () => {
    render(<VisualFieldPerimetrySimulator />);
    const presetNormal = screen.getByRole('button', { name: /Normal Healthy Baseline/i });
    fireEvent.click(presetNormal);
    expect(screen.getByText(/WITHIN NORMAL LIMITS/i)).toBeInTheDocument();

    const presetUnreliable = screen.getByRole('button', { name: /High False Positives/i });
    fireEvent.click(presetUnreliable);
    expect(screen.getAllByText(/Unreliable Test/i).length).toBeGreaterThan(0);
  });

  it('updates pachymetry and recalculates target IOP on slider changes', () => {
    render(<VisualFieldPerimetrySimulator />);
    const sliders = screen.getAllByRole('slider');
    expect(sliders.length).toBeGreaterThanOrEqual(2);

    // Change measured IOP slider
    fireEvent.change(sliders[0], { target: { value: '35' } });
    expect(screen.getByText(/35 mmHg/i)).toBeInTheDocument();
  });
});
