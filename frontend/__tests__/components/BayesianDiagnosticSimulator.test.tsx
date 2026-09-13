import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import BayesianDiagnosticSimulator from '@/components/simulators/BayesianDiagnosticSimulator';

describe('BayesianDiagnosticSimulator Component Tests', () => {
  it('1. renders hero header and main title', () => {
    render(<BayesianDiagnosticSimulator />);
    expect(
      screen.getByText(/Clinical Diagnostic Reasoning & Bayesian Likelihood Ratio/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Track C8 • Evidence-Based Medicine & Decision Theory/i)
    ).toBeInTheDocument();
  });

  it('2. displays scenario targets and presentation info', () => {
    render(<BayesianDiagnosticSimulator />);
    expect(screen.getAllByText(/Venous Thromboembolism \/ PE/i)[0]).toBeInTheDocument();
    expect(screen.getByText(/Wells Clinical Prediction Rule/i)).toBeInTheDocument();
  });

  it('3. switches tabs to Fagan Nomogram', () => {
    render(<BayesianDiagnosticSimulator />);
    const faganTab = screen.getByRole('button', { name: /Interactive Fagan Nomogram/i });
    fireEvent.click(faganTab);
    expect(
      screen.getByText(/Interactive Fagan Nomogram Visualizer/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/PRE-TEST PROB \(%\)/i)).toBeInTheDocument();
  });

  it('4. switches tabs to 2x2 Natural Frequency Matrix and displays metrics', () => {
    render(<BayesianDiagnosticSimulator />);
    const matrixTab = screen.getByRole('button', { name: /2×2 Natural Frequency Matrix/i });
    fireEvent.click(matrixTab);
    expect(
      screen.getByText(/2×2 Natural Frequency Matrix \(Cohort: 1,000 Patients\)/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Positive Pred Value \(PPV\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Negative Pred Value \(NPV\)/i)).toBeInTheDocument();
  });

  it('5. switches tabs to Pauker-Kassirer frontiers', () => {
    render(<BayesianDiagnosticSimulator />);
    const pkTab = screen.getByRole('button', { name: /Pauker-Kassirer Decision Frontiers/i });
    fireEvent.click(pkTab);
    expect(
      screen.getByText(/Pauker-Kassirer Threshold Decision Frontiers/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Disease Probability Continuum/i)).toBeInTheDocument();
  });
});
