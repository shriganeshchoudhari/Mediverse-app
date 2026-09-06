import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import EndocrineClampSimulator from '@/components/simulators/EndocrineClampSimulator';

beforeEach(() => {
  window.dispatchEvent = jest.fn();
});

describe('EndocrineClampSimulator Component', () => {
  test('renders simulator title, phenotype banner, and clamp kinetics', () => {
    render(<EndocrineClampSimulator />);
    expect(screen.getAllByText(/Hyperinsulinemic Glucose Clamp & HOMA2 Precision Solver/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Insulin Sensitivity Phenotype:/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Live Clamp Dynamics & Infusion Curves/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/DeFronzo Clamp Kinetics: Glucose & GIR Trajectory/i)).toBeInTheDocument();
  });

  test('renders all 8 clinical metabolic presets', () => {
    render(<EndocrineClampSimulator />);
    expect(screen.getByText(/Lean Healthy Individual \(High Insulin Sensitivity\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Metabolic Syndrome & Impaired Fasting Glucose/i)).toBeInTheDocument();
    expect(screen.getByText(/Type 2 Diabetes \(Severe Resistance & Beta-Cell Failure\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Elite Endurance Triathlete \(Supra-Normal Sensitivity\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Type 1 Diabetes \(Undetectable C-Peptide, Preserved Muscle M\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Severe Diabetic Ketoacidosis \(DKA Infusion & Anion Gap\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Pancreatic Neuroendocrine Tumor \(Insulinoma Whipple Triad\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Polycystic Ovary Syndrome \(PCOS & Acanthosis Nigricans\)/i)).toBeInTheDocument();
  });

  test('switches to Metabolic Syndrome preset and displays updated phenotype', () => {
    render(<EndocrineClampSimulator />);
    const metSynBtn = screen.getByRole('button', { name: /Metabolic Syndrome & Impaired Fasting Glucose/i });
    fireEvent.click(metSynBtn);
    expect(screen.getAllByText(/MODERATE METABOLIC SYNDROME/i).length).toBeGreaterThan(0);
  });

  test('switches to Severe Acute DKA Protocol and verifies DKA alarm and tab', () => {
    render(<EndocrineClampSimulator />);
    const dkaBtn = screen.getByRole('button', { name: /Severe Diabetic Ketoacidosis/i });
    fireEvent.click(dkaBtn);
    expect(screen.getAllByText(/SEVERE HIGH ANION GAP KETOACIDOSIS/i).length).toBeGreaterThan(0);

    const dkaTab = screen.getByRole('button', { name: /DKA \/ HHS Resuscitation Protocol & Anion Gap/i });
    fireEvent.click(dkaTab);
    expect(screen.getAllByText(/DKA Two-Bag Fluidics & Insulin Resuscitation/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Subcutaneous Insulin Overlap Rule/i)).toBeInTheDocument();
  });

  test('navigates to HOMA2, QUICKI & Minimal Model tab', () => {
    render(<EndocrineClampSimulator />);
    const homaTab = screen.getByRole('button', { name: /HOMA2, QUICKI & Minimal Model Diagnostics/i });
    fireEvent.click(homaTab);
    expect(screen.getAllByText(/Homeostatic Model Assessment \(HOMA2\) & QUICKI/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Bergman Minimal Model & Disposition Index \(DI\)/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Hyperbolic Compensation Curve/i).length).toBeGreaterThan(0);
  });

  test('navigates to Guidelines & DeFronzo Ominous Octet tab', () => {
    render(<EndocrineClampSimulator />);
    const guideTab = screen.getByRole('button', { name: /Guidelines & DeFronzo Ominous Octet/i });
    fireEvent.click(guideTab);
    expect(screen.getAllByText(/DeFronzo Ominous Octet of T2DM Pathophysiology/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Dawn Phenomenon vs Somogyi Rebound/i)).toBeInTheDocument();
  });

  test('resets simulator and exports consultation report', () => {
    render(<EndocrineClampSimulator />);
    const exportBtn = screen.getByRole('button', { name: /Export Clamp Consultation/i });
    fireEvent.click(exportBtn);
    expect(screen.getByText(/Report Generated!/i)).toBeInTheDocument();

    const resetBtn = screen.getByRole('button', { name: /Reset/i });
    fireEvent.click(resetBtn);
    expect(screen.getByText(/Export Clamp Consultation/i)).toBeInTheDocument();
  });
});
