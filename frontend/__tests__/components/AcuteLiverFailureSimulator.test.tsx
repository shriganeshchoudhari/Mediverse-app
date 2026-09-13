/**
 * AcuteLiverFailureSimulator.test.tsx
 * Component tests for AcuteLiverFailureSimulator.
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AcuteLiverFailureSimulator from '../../components/simulators/AcuteLiverFailureSimulator';

describe('AcuteLiverFailureSimulator Component', () => {
  it('renders simulator header and clinical title', () => {
    render(<AcuteLiverFailureSimulator />);
    expect(
      screen.getByText(/Acute Liver Failure \(ALF\), King's College & Cerebral Edema Simulator/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Hepatology & Neurocritical Care Workstation/i)
    ).toBeInTheDocument();
  });

  it('renders default APAP scenario profile with super-urgent transplant recommendation', () => {
    render(<AcuteLiverFailureSimulator />);
    expect(
      screen.getByText(/1. Massive Acetaminophen Overdose/i)
    ).toBeInTheDocument();

    // Default APAP scenario has pH 7.21, Grade 3 encephalopathy -> King's met
    expect(
      screen.getAllByText(/SUPER-URGENT TRANSPLANT LISTING/i).length
    ).toBeGreaterThan(0);
    expect(screen.getByText(/King's College Hospital Prognostic Criteria/i)).toBeInTheDocument();
  });

  it('tests neuroprotective interventions (target 3% NaCl button updates sodium)', () => {
    render(<AcuteLiverFailureSimulator />);
    const hypertonicBtn = screen.getByRole('button', { name: /Target 3% Hypertonic Saline/i });
    expect(hypertonicBtn).toBeInTheDocument();

    fireEvent.click(hypertonicBtn);
    expect(screen.getAllByText(/148 mEq\/L/i).length).toBeGreaterThan(0);
  });

  it('switches to Fulminant Hepatitis B scenario and verifies Clichy criteria', () => {
    render(<AcuteLiverFailureSimulator />);
    const hbvBtn = screen.getByText(/2. Fulminant Acute Hepatitis B/i);
    fireEvent.click(hbvBtn);

    expect(screen.getByText(/Clichy-Villejuif Criteria/i)).toBeInTheDocument();
    expect(screen.getByText(/CLICHY MET/i)).toBeInTheDocument();
  });

  it('renders Rebalanced Hemostasis section and FFP contraindication warning', () => {
    render(<AcuteLiverFailureSimulator />);
    expect(screen.getByText(/Rebalanced Hemostasis & The FFP Paradox/i)).toBeInTheDocument();
    expect(
      screen.getByText(/EASL \/ AASLD Black-Box Practice Parameter:/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/profound hepatic synthetic arrest/i)
    ).toBeInTheDocument();
  });
});
