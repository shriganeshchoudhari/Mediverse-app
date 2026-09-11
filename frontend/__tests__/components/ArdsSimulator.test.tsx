import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ArdsSimulator from '../../components/simulators/ArdsSimulator';

describe('ArdsSimulator Component', () => {
  it('renders simulator title and initial default state', () => {
    render(<ArdsSimulator />);

    expect(
      screen.getByText(/ARDS Berlin Phenotyping, Driving Pressure & Mechanical Power Workstation/i)
    ).toBeInTheDocument();

    expect(screen.getByText(/Demographics & Predicted Body Weight/i)).toBeInTheDocument();
    expect(screen.getByText(/Ventilator Settings & Pressures/i)).toBeInTheDocument();
    expect(screen.getByText(/Gas Exchange & Clinical Criteria/i)).toBeInTheDocument();
  });

  it('renders all 4 standard clinical presets', () => {
    render(<ArdsSimulator />);

    expect(
      screen.getByText(/Severe ARDS with High Driving Pressure \(VILI Alert\)/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Moderate ARDS on Optimized ARDSNet Ventilation/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Hyper-Inflammatory ARDS Phenotype 2/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Refractory Severe ARDS \(EOLIA ECMO Screening\)/i)
    ).toBeInTheDocument();
  });

  it('correctly classifies Severe ARDS and flags elevated driving pressure', () => {
    render(<ArdsSimulator />);

    const severeButton = screen.getByText(
      /Severe ARDS with High Driving Pressure \(VILI Alert\)/i
    );
    fireEvent.click(severeButton);

    const severeBadges = screen.getAllByText(/SEVERE ARDS/i);
    expect(severeBadges.length).toBeGreaterThanOrEqual(1);

    expect(screen.getByText(/CRITICAL LUNG STRESS/i)).toBeInTheDocument();
  });

  it('activates PROSEVA prone positioning directive for eligible severe hypoxemia', () => {
    render(<ArdsSimulator />);

    const severeButton = screen.getByText(
      /Severe ARDS with High Driving Pressure \(VILI Alert\)/i
    );
    fireEvent.click(severeButton);

    expect(screen.getByText(/PROSEVA PRONE POSITIONING INDICATED/i)).toBeInTheDocument();
  });

  it('recalculates predicted body weight upon toggling female biological sex', () => {
    render(<ArdsSimulator />);

    const femaleButton = screen.getByRole('button', { name: /^Female$/i });
    fireEvent.click(femaleButton);

    // Height 178 cm for female -> 45.5 + 0.91 * 25.6 = 68.8 kg
    expect(screen.getByText(/PBW: 68.8 kg/i)).toBeInTheDocument();
  });
});
