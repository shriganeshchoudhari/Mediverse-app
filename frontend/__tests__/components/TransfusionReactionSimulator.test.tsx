import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TransfusionReactionSimulator from '../../components/simulators/TransfusionReactionSimulator';

describe('TransfusionReactionSimulator Component', () => {
  it('1. renders the main title, subtitle, and primary metrics', () => {
    render(<TransfusionReactionSimulator />);
    expect(screen.getByText(/AHTR & TRALI vs TACO Workstation/i)).toBeInTheDocument();
    expect(screen.getByText(/Precision immunohematology & critical care simulator/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Reaction Phenotype/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/Hemodynamics & BNP/i)).toBeInTheDocument();
  });

  it('2. applies preset "AHTR Classic" and renders DAT positive & Coca-Cola urine', () => {
    render(<TransfusionReactionSimulator />);
    const ahtrBtn = screen.getByRole('button', { name: /AHTR Classic/i });
    fireEvent.click(ahtrBtn);
    expect(screen.getByText(/POSITIVE IGG C3D/i)).toBeInTheDocument();
    expect(screen.getByText(/DARK RED COCA COLA/i)).toBeInTheDocument();
  });

  it('3. applies preset "TRALI Permeability" and renders non-cardiogenic edema metrics', () => {
    render(<TransfusionReactionSimulator />);
    const traliBtn = screen.getByRole('button', { name: /TRALI Permeability/i });
    fireEvent.click(traliBtn);
    expect(screen.getByText(/Exudative \/ ARDS/i)).toBeInTheDocument();
    expect(screen.getByText(/Protein: 0.78/i)).toBeInTheDocument();
  });

  it('4. navigates across tabs: AHTR Nephropathy, TRALI vs TACO Matrix, and AABB Algorithm', () => {
    render(<TransfusionReactionSimulator />);

    // Click AHTR Tab
    const ahtrTab = screen.getByRole('button', { name: /AHTR & Pigment Nephropathy/i });
    fireEvent.click(ahtrTab);
    expect(screen.getByText(/ABO Incompatibility & Intravascular Lysis Cascade/i)).toBeInTheDocument();
    expect(screen.getByText(/Pigment Nephropathy & Forced Alkaline Diuresis/i)).toBeInTheDocument();

    // Click TRALI vs TACO Tab
    const traliTacoTab = screen.getByRole('button', { name: /TRALI vs TACO Differential/i });
    fireEvent.click(traliTacoTab);
    expect(screen.getByText(/TRALI vs TACO Master Diagnostic Matrix/i)).toBeInTheDocument();
    expect(screen.getByText(/Immune: Anti-HLA \/ HNA antibodies activate neutrophils/i)).toBeInTheDocument();

    // Click Algorithm Tab
    const algoTab = screen.getByRole('button', { name: /AABB Bedside Algorithm/i });
    fireEvent.click(algoTab);
    expect(screen.getByText(/AABB Standard Operating Procedure for Acute Transfusion Reactions/i)).toBeInTheDocument();
    expect(screen.getByText(/1. STOP Infusion & Disconnect/i)).toBeInTheDocument();
  });

  it('5. triggers "TRALI Diuretic Trap" preset and displays lethal crash alert', () => {
    render(<TransfusionReactionSimulator />);
    const trapBtn = screen.getByRole('button', { name: /TRALI Diuretic Trap/i });
    fireEvent.click(trapBtn);
    expect(screen.getByText(/CONTRAINDICATION DISASTER: Loop diuretic administered in TRALI/i)).toBeInTheDocument();
    expect(screen.getByText(/TRALI Crash Trap/i)).toBeInTheDocument();
  });
});
