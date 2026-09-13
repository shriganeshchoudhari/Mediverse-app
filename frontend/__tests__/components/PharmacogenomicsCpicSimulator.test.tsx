import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import PharmacogenomicsCpicSimulator from '@/components/simulators/PharmacogenomicsCpicSimulator';

describe('PharmacogenomicsCpicSimulator Component', () => {
  it('1. renders hero header and main title', () => {
    render(<PharmacogenomicsCpicSimulator />);
    expect(
      screen.getByText(/Clinical Pharmacogenomics \(PGx\) & CPIC Precision Drug Dosing Station/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Track C4 • Precision Medicine & Clinical Pharmacogenomics/i)
    ).toBeInTheDocument();
  });

  it('2. switches clinical presets and displays patient case', () => {
    render(<PharmacogenomicsCpicSimulator />);
    const warfarinPreset = screen.getByText(/Eleanor H./i);
    fireEvent.click(warfarinPreset);
    expect(
      screen.getByText(/Non-Valvular Atrial Fibrillation/i)
    ).toBeInTheDocument();
  });

  it('3. renders CPIC Clinical Decision Support alert banner', () => {
    render(<PharmacogenomicsCpicSimulator />);
    expect(
      screen.getByText(/Clinical Decision Support • Cardiology \/ Antiplatelet post-PCI/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Avoid Clopidogrel. Use alternative P2Y12 inhibitor/i)
    ).toBeInTheDocument();
  });

  it('4. switches to CPIC gene-drug guideline matrix tab', () => {
    render(<PharmacogenomicsCpicSimulator />);
    const matrixTab = screen.getByRole('button', { name: /CPIC Gene-Drug Guideline Matrix/i });
    fireEvent.click(matrixTab);
    expect(
      screen.getByText(/CPIC Level A Gene-Drug Clinical Guideline Matrix/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Ticagrelor or Prasugrel/i)).toBeInTheDocument();
  });

  it('5. switches to mechanisms tab and displays biochemical pathways', () => {
    render(<PharmacogenomicsCpicSimulator />);
    const mechTab = screen.getByRole('button', { name: /Pharmacokinetic Mechanisms & Bioactivation/i });
    fireEvent.click(mechTab);
    expect(
      screen.getByText(/Phase I CYP450 Monooxygenases:/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Dihydropyrimidine Dehydrogenase \(DPYD\):/i)
    ).toBeInTheDocument();
  });
});
