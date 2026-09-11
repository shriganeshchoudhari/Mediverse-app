import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import DkaHhsSimulator from '../../components/simulators/DkaHhsSimulator';

describe('DkaHhsSimulator Component', () => {
  it('renders simulator title and initial default state', () => {
    render(<DkaHhsSimulator />);

    expect(
      screen.getByText(/DKA, HHS & Two-Bag Fluid Titration Workstation/i)
    ).toBeInTheDocument();

    expect(screen.getByText(/Laboratory & Metabolic Inputs/i)).toBeInTheDocument();
    expect(screen.getByText(/Two-Bag Infusion Dynamic Solver/i)).toBeInTheDocument();
    expect(screen.getByText(/Potassium Safety Interlock Status:/i)).toBeInTheDocument();
  });

  it('renders all standard presets', () => {
    render(<DkaHhsSimulator />);

    expect(
      screen.getByText(/Severe Pediatric DKA \(High Cerebral Edema Risk\)/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Severe DKA with Hypokalemic Trap \(HOLD Insulin\)/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Severe Hyperosmolar Hyperglycemic State \(HHS\)/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/DKA Two-Bag Transition \(Glucose Falling < 200 mg\/dL\)/i)
    ).toBeInTheDocument();
  });

  it('triggers Potassium Safety Interlock when hypokalemic preset is selected', () => {
    render(<DkaHhsSimulator />);

    const hypokalemicButton = screen.getByText(
      /Severe DKA with Hypokalemic Trap \(HOLD Insulin\)/i
    );
    fireEvent.click(hypokalemicButton);

    // Should display HOLD INSULIN badge and critical warning
    const holdBadges = screen.getAllByText(/HOLD INSULIN/i);
    expect(holdBadges.length).toBeGreaterThanOrEqual(1);

    expect(
      screen.getByText(/HOLD INSULIN INFUSION IMMEDIATELY/i)
    ).toBeInTheDocument();
  });

  it('updates two-bag infusion display when Two-Bag Transition preset is selected', () => {
    render(<DkaHhsSimulator />);

    const transitionButton = screen.getByText(
      /DKA Two-Bag Transition \(Glucose Falling < 200 mg\/dL\)/i
    );
    fireEvent.click(transitionButton);

    expect(screen.getByText(/Total Rate: 200 mL\/h/i)).toBeInTheDocument();
    expect(screen.getByText(/5% Dextrose/i)).toBeInTheDocument();
    expect(screen.getByText('g/hour')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  it('displays Cerebral Edema risk and rescue intervention guidance for severe pediatric presentation', () => {
    render(<DkaHhsSimulator />);

    const pediatricButton = screen.getByText(
      /Severe Pediatric DKA \(High Cerebral Edema Risk\)/i
    );
    fireEvent.click(pediatricButton);

    expect(screen.getByText(/Cerebral Edema Risk & Neuromonitoring/i)).toBeInTheDocument();
  });
});
