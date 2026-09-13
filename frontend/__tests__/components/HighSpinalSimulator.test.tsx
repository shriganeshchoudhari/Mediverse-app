import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import HighSpinalSimulator from '../../components/simulators/HighSpinalSimulator';

describe('HighSpinalSimulator Component', () => {
  it('1. renders the main title, subtitle, and primary metrics', () => {
    render(<HighSpinalSimulator />);
    expect(screen.getByText(/High Spinal & Total Spinal Workstation/i)).toBeInTheDocument();
    expect(screen.getByText(/Precision biophysical simulator for cephalad local anesthetic spread/i)).toBeInTheDocument();
    expect(screen.getByText(/Sensory Level/i)).toBeInTheDocument();
    expect(screen.getByText(/Vitals & BJR Radar/i)).toBeInTheDocument();
  });

  it('2. applies preset "BJR Asystolic Shock" and updates BJR risk badge', () => {
    render(<HighSpinalSimulator />);
    const bjrBtn = screen.getByRole('button', { name: /BJR Asystolic Shock/i });
    fireEvent.click(bjrBtn);
    expect(screen.getByText(/CRITICAL ASYSTOLIC ARREST/i)).toBeInTheDocument();
  });

  it('3. switches to "Total Spinal Rescue" and renders intubation ventilation status', () => {
    render(<HighSpinalSimulator />);
    const totalBtn = screen.getByRole('button', { name: /Total Spinal Rescue/i });
    fireEvent.click(totalBtn);
    expect(screen.getByText(/Total Spinal \(Brainstem Cisterns/i)).toBeInTheDocument();
    expect(screen.getByText(/ETT Ventilated/i)).toBeInTheDocument();
  });

  it('4. navigates across tabs: Anatomy, Pressor Paradox, and ASRA Protocol', () => {
    render(<HighSpinalSimulator />);

    // Click Anatomy Tab
    const anatomyTab = screen.getByRole('button', { name: /Neuraxial Dermatome Mapping/i });
    fireEvent.click(anatomyTab);
    expect(screen.getByText(/Dermatomal Block Progression Ladder/i)).toBeInTheDocument();
    expect(screen.getByText(/Baricity & The Trendelenburg Gravity Trap/i)).toBeInTheDocument();

    // Click Pressor Paradox Tab
    const pressorTab = screen.getByRole('button', { name: /The Pressor Paradox & BJR/i });
    fireEvent.click(pressorTab);
    expect(screen.getByText(/The Bezold-Jarisch Reflex \(BJR\) in Spinal Anesthesia/i)).toBeInTheDocument();
    expect(screen.getAllByText(/The Phenylephrine Pressor Trap/i).length).toBeGreaterThanOrEqual(1);

    // Click Protocol Tab
    const protocolTab = screen.getByRole('button', { name: /ASRA \/ SOAP Emergency Protocol/i });
    fireEvent.click(protocolTab);
    expect(screen.getByText(/Total Spinal Emergency Management Algorithm/i)).toBeInTheDocument();
    expect(screen.getByText(/Step 1: Declare & Call/i)).toBeInTheDocument();
  });

  it('5. triggers Phenylephrine Trap preset and shows critical pressor warning', () => {
    render(<HighSpinalSimulator />);
    const phenyBtn = screen.getByRole('button', { name: /Phenylephrine Trap/i });
    fireEvent.click(phenyBtn);
    expect(screen.getByText(/PRESSOR CONTRAINDICATION TRAP/i)).toBeInTheDocument();
  });
});
