import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import UpperGiBleedingSimulator from '../../components/simulators/UpperGiBleedingSimulator';

describe('UpperGiBleedingSimulator Component Tests', () => {
  it('renders the main workstation heading and scoreboard badges', () => {
    render(<UpperGiBleedingSimulator />);

    expect(
      screen.getByText(/Acute Upper GI Bleeding, Rockall & Hemostasis Workstation/i)
    ).toBeInTheDocument();

    expect(screen.getByText(/Glasgow-Blatchford Score/i)).toBeInTheDocument();
    expect(screen.getByText(/Full Rockall Score/i)).toBeInTheDocument();
    expect(screen.getByText(/Forrest Ulcer Analysis/i)).toBeInTheDocument();
    expect(screen.getByText(/Hemostasis Scoreboard/i)).toBeInTheDocument();
  });

  it('allows switching between clinical preset cases', () => {
    render(<UpperGiBleedingSimulator />);

    const selects = screen.getAllByRole('combobox');
    expect(selects.length).toBeGreaterThan(0);

    // Switch to Cirrhotic Bleeding Esophageal Varices
    fireEvent.change(selects[0], { target: { value: 'ruptured-esophageal-varices' } });

    expect(
      screen.getByText(/Red Wale markings \/ Cherry-red spots/i)
    ).toBeInTheDocument();
  });

  it('updates Forrest ulcer classification and shows risk guidance', () => {
    render(<UpperGiBleedingSimulator />);

    expect(screen.getByText(/Class Ia: Active Spurting Hemorrhage/i)).toBeInTheDocument();
    expect(screen.getByText(/90%/i)).toBeInTheDocument();
    expect(screen.getAllByText(/YES \(Dual Therapy\)/i).length).toBeGreaterThan(0);
  });

  it('enables salvage Sengstaken-Blakemore balloon tamponade controls', () => {
    render(<UpperGiBleedingSimulator />);

    const tamponadeCheckbox = screen.getByLabelText(/Deploy Salvage Sengstaken-Blakemore Tube/i);
    fireEvent.click(tamponadeCheckbox);

    expect(screen.getByText(/Gastric Balloon Vol: 250 mL/i)).toBeInTheDocument();
    expect(screen.getByText(/Esophageal Balloon: 35 mmHg/i)).toBeInTheDocument();
  });

  it('renders pharmacotherapy selectors and antibiotic prophylaxis', () => {
    render(<UpperGiBleedingSimulator />);

    expect(screen.getByText(/Pantoprazole 80mg bolus/i)).toBeInTheDocument();
    expect(screen.getByText(/Baveno VII standard/i)).toBeInTheDocument();
    expect(screen.getByText(/Cirrhosis SBP/i)).toBeInTheDocument();
  });
});
