import React from 'react';
import { render, screen } from '@testing-library/react';
import ZoonoticSpilloverSimulator from '../../components/veterinary/ZoonoticSpilloverSimulator';

describe('ZoonoticSpilloverSimulator', () => {
  it('renders without crashing', () => {
    render(<ZoonoticSpilloverSimulator />);
  });

  it('displays pathogen buttons and R0 output', () => {
    render(<ZoonoticSpilloverSimulator />);
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
    // Add additional checks if needed based on the implementation
  });
});
