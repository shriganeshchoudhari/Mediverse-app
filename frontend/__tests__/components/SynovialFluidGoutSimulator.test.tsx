import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SynovialFluidGoutSimulator from '@/components/simulators/SynovialFluidGoutSimulator';

describe('SynovialFluidGoutSimulator Component', () => {
  it('renders main workstation header and CPLM microscope controls', () => {
    render(<SynovialFluidGoutSimulator />);
    expect(
      screen.getByText(/Synovial Fluid Polarized Microscopy & Gout Workstation/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Compensated Polarized Microscope/i)).toBeInTheDocument();
    expect(screen.getByText(/Arthrocentesis Fluid Lab/i)).toBeInTheDocument();
    expect(screen.getByText(/2015 ACR\/EULAR Gout Score/i)).toBeInTheDocument();
  });

  it('switches to CPPD pseudogout preset when clicked', () => {
    render(<SynovialFluidGoutSimulator />);
    const cppdPresetBtn = screen.getByRole('button', { name: /CPPD Pseudogout/i });
    fireEvent.click(cppdPresetBtn);

    expect(screen.getAllByText(/Calcium Pyrophosphate Dihydrate/i).length).toBeGreaterThan(0);
  });

  it('toggles the Gypsum Red Compensator plate in and out', () => {
    render(<SynovialFluidGoutSimulator />);
    const toggleBtn = screen.getByText(/Red Plate \(530nm\) IN/i);
    fireEvent.click(toggleBtn);

    expect(screen.getByText(/Crossed Nicols Only/i)).toBeInTheDocument();
  });

  it('updates rotation angle when clicking parallel and perpendicular quick buttons', () => {
    render(<SynovialFluidGoutSimulator />);
    const perpBtn = screen.getByRole('button', { name: /Perpendicular \(135°\)/i });
    fireEvent.click(perpBtn);

    expect(screen.getAllByText(/135°/).length).toBeGreaterThan(0);

    const parallelBtn = screen.getByRole('button', { name: /Parallel \(45°\)/i });
    fireEvent.click(parallelBtn);

    expect(screen.getAllByText(/45°/).length).toBeGreaterThan(0);
  });

  it('displays critical septic arthritis alert when septic preset is active', () => {
    render(<SynovialFluidGoutSimulator />);
    const septicPresetBtn = screen.getByRole('button', { name: /CRITICAL EMERGENCY/i });
    fireEvent.click(septicPresetBtn);

    expect(screen.getByText(/CRITICAL WARNING: Septic Arthritis Alert/i)).toBeInTheDocument();
  });
});
