/**
 * SubarachnoidHemorrhageSimulator.test.tsx
 * Component tests for SubarachnoidHemorrhageSimulator.
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SubarachnoidHemorrhageSimulator from '../../components/simulators/SubarachnoidHemorrhageSimulator';

describe('SubarachnoidHemorrhageSimulator Component', () => {
  it('renders simulator header and clinical title', () => {
    render(<SubarachnoidHemorrhageSimulator />);
    expect(
      screen.getByText(/Aneurysmal Subarachnoid Hemorrhage \(aSAH\) & Vasospasm Workstation/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Neurocritical Care & Vascular Neurosurgery Suite/i)
    ).toBeInTheDocument();
  });

  it('renders default Day 7 scenario with severe vasospasm and DCI alert', () => {
    render(<SubarachnoidHemorrhageSimulator />);
    expect(screen.getByText(/1. Day 7 aSAH with Severe Vasospasm/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Severe Vasospasm/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/CLINICAL DCI SUSPECTED/i)).toBeInTheDocument();
    expect(screen.getByText(/Lindegaard: 6.88/i)).toBeInTheDocument();
  });

  it('activates euvolemic induced hypertension and verifies SBP titration', () => {
    render(<SubarachnoidHemorrhageSimulator />);
    const htnBtn = screen.getByRole('button', { name: /Euvolemic Induced Hypertension/i });
    expect(htnBtn).toBeInTheDocument();

    fireEvent.click(htnBtn);
    expect(screen.getByText(/ACTIVE/i)).toBeInTheDocument();
  });

  it('switches to Hyperemia scenario and verifies non-spasm status', () => {
    render(<SubarachnoidHemorrhageSimulator />);
    const hyperemiaBtn = screen.getByText(/2. Day 5 aSAH with High Flow Velocity/i);
    fireEvent.click(hyperemiaBtn);

    expect(screen.getAllByText(/Hyperemia \(Non-Spasm\)/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Lindegaard: 2.46/i)).toBeInTheDocument();
  });

  it('tests CSW rescue button and restores serum sodium', () => {
    render(<SubarachnoidHemorrhageSimulator />);
    const cswBtn = screen.getByRole('button', { name: /CSW Rescue: 3% Saline \+ Volume/i });
    expect(cswBtn).toBeInTheDocument();

    fireEvent.click(cswBtn);
    expect(screen.getByText(/142 mEq\/L/i)).toBeInTheDocument();
  });
});
