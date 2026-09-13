import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import OncologyGenomicsSimulator from '@/components/simulators/OncologyGenomicsSimulator';

describe('OncologyGenomicsSimulator Component Tests', () => {
  it('1. renders hero header and main title', () => {
    render(<OncologyGenomicsSimulator />);
    expect(
      screen.getByText(/Clinical Genomics, Somatic Oncology NGS & Precision Targeted Therapy/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Track C9 • Molecular Oncology & Precision Genomics/i)
    ).toBeInTheDocument();
  });

  it('2. displays patient case summary and demographic metrics', () => {
    render(<OncologyGenomicsSimulator />);
    expect(screen.getByText(/David K., 61M/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Lung Adenocarcinoma, TTF-1 Positive/i)[0]).toBeInTheDocument();
    expect(screen.getByText(/Stage IVB \(Brain and Bone Metastases\)/i)).toBeInTheDocument();
  });

  it('3. renders somatic NGS variants table with VAF and clonality', () => {
    render(<OncologyGenomicsSimulator />);
    expect(screen.getAllByText(/p.Leu858Arg \(L858R\)/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/p.Thr790Met \(T790M\)/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/Clonal \(Truncal\)/i)[0]).toBeInTheDocument();
  });

  it('4. switches tabs to Clonal Resistance Evolution', () => {
    render(<OncologyGenomicsSimulator />);
    const evoTab = screen.getByRole('button', { name: /Clonal Resistance Evolution/i });
    fireEvent.click(evoTab);
    expect(
      screen.getByText(/Clonal Architecture & Acquired Resistance Simulation/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Duration of Targeted Therapy/i)).toBeInTheDocument();
  });

  it('5. switches tabs to Molecular Tumor Board matches', () => {
    render(<OncologyGenomicsSimulator />);
    const mtbTab = screen.getByRole('button', { name: /Molecular Tumor Board \(MTB\) Matches/i });
    fireEvent.click(mtbTab);
    expect(
      screen.getByText(/Molecular Tumor Board \(MTB\) Precision Action Plan/i)
    ).toBeInTheDocument();
    expect(screen.getAllByText(/Osimertinib/i)[0]).toBeInTheDocument();
  });
});
