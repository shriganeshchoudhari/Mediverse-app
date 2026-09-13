/**
 * CrrtCitrateClearanceSimulator.test.tsx
 * Component tests for CrrtCitrateClearanceSimulator.
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CrrtCitrateClearanceSimulator from '../../components/simulators/CrrtCitrateClearanceSimulator';

describe('CrrtCitrateClearanceSimulator Component', () => {
  it('renders simulator header and clinical title', () => {
    render(<CrrtCitrateClearanceSimulator />);
    expect(
      screen.getByText(/Continuous Renal Replacement Therapy \(CRRT\) Workstation/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/KDIGO & RCA Kinetics/i)).toBeInTheDocument();
  });

  it('renders default scenario profile and parameters', () => {
    render(<CrrtCitrateClearanceSimulator />);
    expect(
      screen.getAllByText(/1. Septic Shock & AKI Stage 3/i).length
    ).toBeGreaterThan(0);
    expect(screen.getByText(/Delivered Effluent Dose:/i)).toBeInTheDocument();
    expect(screen.getByText(/Filtration Fraction \(FF\):/i)).toBeInTheDocument();
  });

  it('switches scenario to rhabdomyolysis and updates prescription', () => {
    render(<CrrtCitrateClearanceSimulator />);
    const rhabdoBtn = screen.getByText(/2. Crush Injury & Rhabdomyolysis/i);
    fireEvent.click(rhabdoBtn);

    expect(screen.getByText(/Severe Traumatic Rhabdomyolysis \/ Pigment Nephropathy/i)).toBeInTheDocument();
  });

  it('switches modality to CVVH and hides dialysate flow slider', () => {
    render(<CrrtCitrateClearanceSimulator />);
    const cvvhBtn = screen.getByRole('button', { name: /^cvvh$/i });
    fireEvent.click(cvvhBtn);

    expect(screen.queryByText(/Dialysate Flow \(Qd - Diffusion\):/i)).not.toBeInTheDocument();
  });

  it('renders Regional Citrate Anticoagulation panel and Total Ca / Ionized Ca ratio', () => {
    render(<CrrtCitrateClearanceSimulator />);
    expect(screen.getByText(/Regional Citrate \(RCA\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Total Ca \/ Ionized Ca Ratio/i)).toBeInTheDocument();
  });
});
