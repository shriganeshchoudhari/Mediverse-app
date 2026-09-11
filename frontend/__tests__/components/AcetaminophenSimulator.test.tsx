import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import AcetaminophenSimulator from '../../components/simulators/AcetaminophenSimulator';

describe('AcetaminophenSimulator Component', () => {
  it('renders simulator title and initial default state', () => {
    render(<AcetaminophenSimulator />);

    expect(
      screen.getByText(/Acetaminophen Toxicity, Rumack-Matthew & NAC Precision Workstation/i)
    ).toBeInTheDocument();

    expect(screen.getByText(/Ingestion Parameters & Timing/i)).toBeInTheDocument();
    expect(screen.getByText(/Hepatic & Metabolic Biomarkers/i)).toBeInTheDocument();
    expect(screen.getByText(/Rumack-Matthew Nomogram Analysis \(4-24 Hours\)/i)).toBeInTheDocument();
    expect(screen.getByText(/N-Acetylcysteine \(NAC\) Precision Dosing Protocol/i)).toBeInTheDocument();
  });

  it('renders all 4 standard clinical presets', () => {
    render(<AcetaminophenSimulator />);

    expect(
      screen.getByText(/Acute Toxic Ingestion \(Nomogram Positive at 6 Hours\)/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Massive Overdose \(APAP > 2x Nomogram Line\)/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Fulminant Acute Liver Failure \(King's College Positive\)/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/NAC End of Protocol \(Stopping Criteria Evaluated\)/i)
    ).toBeInTheDocument();
  });

  it('identifies massive overdose and activates augmented NAC alert', () => {
    render(<AcetaminophenSimulator />);

    const massiveButton = screen.getByText(
      /Massive Overdose \(APAP > 2x Nomogram Line\)/i
    );
    fireEvent.click(massiveButton);

    expect(screen.getAllByText(/MASSIVE INGESTION CRITICAL/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/MASSIVE INGESTION DETECTED/i)).toBeInTheDocument();
  });

  it('triggers King\'s College Criteria transplant alert when fulminant failure preset is selected', () => {
    render(<AcetaminophenSimulator />);

    const fulminantButton = screen.getByText(
      /Fulminant Acute Liver Failure \(King's College Positive\)/i
    );
    fireEvent.click(fulminantButton);

    expect(screen.getAllByText(/TRANSPLANT CRITERIA MET/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/KING'S COLLEGE CRITERIA MET/i)).toBeInTheDocument();
    expect(screen.getByText(/Emergency liver transplant evaluation is MANDATORY/i)).toBeInTheDocument();
  });

  it('displays anaphylactoid reaction protocol when anaphylactoid checkbox is toggled', () => {
    render(<AcetaminophenSimulator />);

    const anaphylactoidCheckbox = screen.getByLabelText(
      /Non-IgE Anaphylactoid Reaction/i
    );
    fireEvent.click(anaphylactoidCheckbox);

    expect(screen.getByText(/Anaphylactoid Reaction Protocol:/i)).toBeInTheDocument();
    expect(screen.getAllByText(/NON-IgE ANAPHYLACTOID REACTION/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/DO NOT permanently discontinue NAC/i).length).toBeGreaterThanOrEqual(1);
  });

  it('confirms NAC discontinuation criteria met when stopping preset is clicked', () => {
    render(<AcetaminophenSimulator />);

    const stoppingButton = screen.getByText(
      /NAC End of Protocol \(Stopping Criteria Evaluated\)/i
    );
    fireEvent.click(stoppingButton);

    expect(screen.getAllByText(/STOP CRITERIA MET/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/NAC DISCONTINUATION CRITERIA MET/i)).toBeInTheDocument();
  });
});
