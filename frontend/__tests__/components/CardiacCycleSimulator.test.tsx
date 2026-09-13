import React from 'react';
import { render, screen } from '@testing-library/react';
import CardiacCycleSimulator from '@/components/simulators/CardiacCycleSimulator';

describe('CardiacCycleSimulator', () => {
  it('renders cardiac cycle title and hemodynamics metrics', () => {
    render(<CardiacCycleSimulator />);
    expect(screen.getByText(/Cardiac Cycle/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Stroke Volume/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Ejection Fraction/i)).toBeInTheDocument();
  });
});
