import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TherapeuticPlasmaExchangeSimulator from '../../components/simulators/TherapeuticPlasmaExchangeSimulator';

describe('TherapeuticPlasmaExchangeSimulator Component', () => {
  it('renders the title and ASFA indication badge', () => {
    render(<TherapeuticPlasmaExchangeSimulator />);
    expect(
      screen.getByText(/Therapeutic Plasma Exchange \(TPE\) Workstation/i)
    ).toBeInTheDocument();
    expect(screen.getAllByText(/ASFA 2023 Guidelines/i).length).toBeGreaterThanOrEqual(1);
  });

  it('renders the 4 clinical scenario buttons', () => {
    render(<TherapeuticPlasmaExchangeSimulator />);
    expect(screen.getByText(/1\. TTP \(Category I - FFP\)/i)).toBeInTheDocument();
    expect(screen.getByText(/2\. Myasthenia Crisis \(Albumin\)/i)).toBeInTheDocument();
    expect(screen.getByText(/3\. GBS \(Citrate Toxicity\)/i)).toBeInTheDocument();
    expect(screen.getByText(/4\. Anti-GBM \(Split Alb\/FFP\)/i)).toBeInTheDocument();
  });

  it('displays estimated patient plasma volume', () => {
    render(<TherapeuticPlasmaExchangeSimulator />);
    expect(screen.getByText(/Patient Plasma Volume \(PV\)/i)).toBeInTheDocument();
    // 70 kg, 36% Hct -> 70 * 70 * 0.64 = 3136 mL
    expect(screen.getAllByText(/3136 mL/i).length).toBeGreaterThanOrEqual(1);
  });

  it('advances the exchange volume when Advance Exchange +15 min is clicked', () => {
    render(<TherapeuticPlasmaExchangeSimulator />);
    const advanceBtn = screen.getByRole('button', { name: /Advance Exchange \+15 min/i });
    expect(advanceBtn).toBeInTheDocument();

    fireEvent.click(advanceBtn);
    // Solute removal should now be > 0%
    expect(screen.getByText(/Pathogen Cleared/i)).toBeInTheDocument();
    expect(screen.getByText(/IN PROGRESS \(15 MIN\)/i)).toBeInTheDocument();
  });

  it('switches to GBS scenario and demonstrates citrate-induced hypocalcemia', () => {
    render(<TherapeuticPlasmaExchangeSimulator />);
    const gbsBtn = screen.getByText(/3\. GBS \(Citrate Toxicity\)/i);
    fireEvent.click(gbsBtn);

    expect(screen.getByText(/Guillain-Barré Syndrome/i)).toBeInTheDocument();
    const advanceBtn = screen.getByRole('button', { name: /Advance Exchange \+45 min/i });
    fireEvent.click(advanceBtn);
    fireEvent.click(advanceBtn);

    // Citrate toxicity symptom should trigger
    expect(screen.getByText(/Symptom:/i)).toBeInTheDocument();
  });

  it('switches to Myasthenia Gravis scenario with 5% albumin replacement', () => {
    render(<TherapeuticPlasmaExchangeSimulator />);
    const mgBtn = screen.getByText(/2\. Myasthenia Crisis \(Albumin\)/i);
    fireEvent.click(mgBtn);

    expect(screen.getByText(/Myasthenia Gravis/i)).toBeInTheDocument();
    expect(
      screen.getByText(/5% Albumin is preferred to avoid transfusion-related risks/i)
    ).toBeInTheDocument();
  });
});
