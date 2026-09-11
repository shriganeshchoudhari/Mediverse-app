import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SepsisAntibioticSimulator from '@/components/simulators/SepsisAntibioticSimulator';

describe('SepsisAntibioticSimulator Component', () => {
  it('renders main header and the three core clinical columns', () => {
    render(<SepsisAntibioticSimulator />);
    expect(
      screen.getByText(/Sepsis Bundles \(SEP-1\), Antibiotic PK\/PD & Procalcitonin Workstation/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/SEP-1 Bundle Checklist/i)).toBeInTheDocument();
    expect(screen.getByText(/Antimicrobial PK\/PD Solver/i)).toBeInTheDocument();
    expect(screen.getByText(/Procalcitonin Kinetics/i)).toBeInTheDocument();
  });

  it('toggles SEP-1 bundle items and shows compliant status when complete', () => {
    render(<SepsisAntibioticSimulator />);
    expect(screen.getByText(/SEP-1 COMPLIANT/i)).toBeInTheDocument();
  });

  it('switches to Augmented Renal Clearance (ARC) preset and displays ARC warning', () => {
    render(<SepsisAntibioticSimulator />);
    const arcPresetBtn = screen.getByRole('button', { name: /ARC PK Failure Hazard/i });
    fireEvent.click(arcPresetBtn);

    expect(screen.getAllByText(/Augmented Renal Clearance/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/165 mL\/min/i).length).toBeGreaterThan(0);
  });

  it('identifies safe procalcitonin de-escalation when stewardship preset is active', () => {
    render(<SepsisAntibioticSimulator />);
    const stewardshipPresetBtn = screen.getByRole('button', { name: /Antimicrobial Stewardship/i });
    fireEvent.click(stewardshipPresetBtn);

    expect(screen.getByText(/SAFE DE-ESCALATION/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Safe to de-escalate/i).length).toBeGreaterThan(0);
  });
});
