/**
 * AnaphylaxisResuscitationSimulator.test.tsx
 * Component tests for AnaphylaxisResuscitationSimulator.
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AnaphylaxisResuscitationSimulator from '../../components/simulators/AnaphylaxisResuscitationSimulator';

describe('AnaphylaxisResuscitationSimulator Component', () => {
  it('renders simulator header and clinical titles', () => {
    render(<AnaphylaxisResuscitationSimulator />);
    expect(
      screen.getByText(/Anaphylaxis & Refractory Vasoplegic Shock Workstation/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Allergy, Immunology & Emergency Critical Care Suite/i)).toBeInTheDocument();
  });

  it('renders default scenario profile and confirmed WAO anaphylaxis status', () => {
    render(<AnaphylaxisResuscitationSimulator />);
    expect(
      screen.getAllByText(/1. Food Anaphylaxis with Severe Laryngeal Stridor & Angioedema/i).length
    ).toBeGreaterThan(0);
    expect(screen.getByText(/WAO Anaphylaxis Confirmed/i)).toBeInTheDocument();
    expect(screen.getByText(/Step 1: First-Line Intramuscular Epinephrine/i)).toBeInTheDocument();
  });

  it('administers IM epinephrine and updates plasma concentration', () => {
    render(<AnaphylaxisResuscitationSimulator />);
    const adminBtn = screen.getByRole('button', { name: /Administer Epinephrine/i });
    expect(adminBtn).toBeInTheDocument();

    fireEvent.click(adminBtn);
    expect(screen.getByText(/1 dose\(s\)/i)).toBeInTheDocument();
  });

  it('switches to beta-blocker refractory shock scenario and administers glucagon', () => {
    render(<AnaphylaxisResuscitationSimulator />);
    const scenarioBtn = screen.getByText(/2. Beta-Blocker Blunted Refractory Vasoplegic Shock/i);
    fireEvent.click(scenarioBtn);

    expect(screen.getAllByText(/REFRACTORY VASOPLEGIC SHOCK/i).length).toBeGreaterThan(0);
    const glucagonBtn = screen.getByRole('button', { name: /Give 5 mg IV Push/i });
    expect(glucagonBtn).toBeInTheDocument();

    fireEvent.click(glucagonBtn);
    expect(screen.getByText(/Given: 5 mg/i)).toBeInTheDocument();
  });

  it('renders Biphasic Surveillance and Serum Tryptase sections', () => {
    render(<AnaphylaxisResuscitationSimulator />);
    expect(
      screen.getByText(/Step 3: Biphasic Surveillance & Tryptase Confirmation/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Serum Tryptase Consensus Formula/i)).toBeInTheDocument();
  });
});
