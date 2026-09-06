import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AdrenalCrisisSimulator from '../../components/simulators/AdrenalCrisisSimulator';

describe('AdrenalCrisisSimulator Component Tests', () => {
  it('renders the main workstation heading and scoreboard badges', () => {
    render(<AdrenalCrisisSimulator />);

    expect(
      screen.getByText(/Acute Adrenal Crisis & Steroid Equivalency Workstation/i)
    ).toBeInTheDocument();

    expect(screen.getByText(/250 mcg ACTH Stim Test/i)).toBeInTheDocument();
    expect(screen.getByText(/Steroid Equivalency Solver/i)).toBeInTheDocument();
    expect(screen.getByText(/Required Stress Coverage/i)).toBeInTheDocument();
    expect(screen.getByText(/24h Resuscitation Scoreboard/i)).toBeInTheDocument();
  });

  it('allows selecting different clinical preset scenarios', () => {
    render(<AdrenalCrisisSimulator />);

    const selects = screen.getAllByRole('combobox');
    expect(selects.length).toBeGreaterThan(0);

    // Switch to diagnostic cosyntropin workup
    fireEvent.change(selects[0], { target: { value: 'diagnostic-cosyntropin-workup' } });

    expect(
      screen.getByText(/Use Dexamethasone 4mg IV Bolus/i)
    ).toBeInTheDocument();
  });

  it('computes steroid equivalencies dynamically', () => {
    render(<AdrenalCrisisSimulator />);

    // Default 20 mg Prednisone -> Hydrocortisone
    expect(screen.getByText(/80 mg Hydrocortisone Glucocorticoid Activity/i)).toBeInTheDocument();
  });

  it('enables emergency resuscitation inputs and reflects stabilization status', () => {
    render(<AdrenalCrisisSimulator />);

    expect(screen.getByText(/Crisis Status: AVERTED \/ STABILIZED/i)).toBeInTheDocument();
    expect(screen.getByText(/Predicted 24h SBP/i)).toBeInTheDocument();
  });

  it('displays ACTH stimulation test interpretation', () => {
    render(<AdrenalCrisisSimulator />);

    expect(screen.getByText(/0-min Baseline:/i)).toBeInTheDocument();
    expect(screen.getByText(/30-min Level:/i)).toBeInTheDocument();
    expect(screen.getByText(/60-min Peak/i)).toBeInTheDocument();
  });
});
