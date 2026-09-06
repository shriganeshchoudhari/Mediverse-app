import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import RenalTubularAcidosisSimulator from '@/components/simulators/RenalTubularAcidosisSimulator';

describe('RenalTubularAcidosisSimulator Component', () => {
  it('renders main header and primary diagnostic columns', () => {
    render(<RenalTubularAcidosisSimulator />);
    expect(
      screen.getByText(/Renal Tubular Acidosis \(RTA\) & Urine Anion Gap Workstation/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Serum Electrolytes & AG/i)).toBeInTheDocument();
    expect(screen.getByText(/Urine Anion Gap & NH4\+/i)).toBeInTheDocument();
    expect(screen.getByText(/Diagnostic & Therapy Solver/i)).toBeInTheDocument();
  });

  it('displays Distal RTA Type 1 diagnosis and Potassium Citrate prescription by default', () => {
    render(<RenalTubularAcidosisSimulator />);
    expect(screen.getAllByText(/Classic Distal Renal Tubular Acidosis/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Potassium Citrate/i).length).toBeGreaterThan(0);
  });

  it('switches to Secretory Diarrhea preset and shows Negative UAG', () => {
    render(<RenalTubularAcidosisSimulator />);
    const diarrheaPresetBtn = screen.getByRole('button', { name: /GI Bicarbonate Loss/i });
    fireEvent.click(diarrheaPresetBtn);

    expect(screen.getByText(/Gastrointestinal Bicarbonate Loss/i)).toBeInTheDocument();
    expect(screen.getAllByText(/NEGATIVE UAG/i).length).toBeGreaterThan(0);
  });

  it('switches to Type 4 Hyperkalemic RTA and warns against aldosterone antagonists', () => {
    render(<RenalTubularAcidosisSimulator />);
    const type4PresetBtn = screen.getByRole('button', { name: /Type 4 Hyperkalemic/i });
    fireEvent.click(type4PresetBtn);

    expect(screen.getByText(/Hyperkalemic Renal Tubular Acidosis/i)).toBeInTheDocument();
    expect(screen.getByText(/Loop Diuretic/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Spironolactone/i).length).toBeGreaterThan(0);
  });
});
