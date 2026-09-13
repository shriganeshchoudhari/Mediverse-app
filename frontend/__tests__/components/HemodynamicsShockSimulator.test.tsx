import React from 'react';
import { render, screen } from '@testing-library/react';
import HemodynamicsShockSimulator from '@/components/simulators/HemodynamicsShockSimulator';

describe('HemodynamicsShockSimulator', () => {
  it('renders clinical scenarios and Swan-Ganz parameters', () => {
    render(<HemodynamicsShockSimulator />);
    expect(screen.getByText(/Clinical Scenarios/i)).toBeInTheDocument();
    expect(screen.getByText(/Cardiac Output/i)).toBeInTheDocument();
    expect(screen.getByText(/Systemic Vascular Resistance/i)).toBeInTheDocument();
  });
});
