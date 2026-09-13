import React from 'react';
import { render, screen } from '@testing-library/react';
import AcidBaseSimulator from '@/components/simulators/AcidBaseSimulator';

describe('AcidBaseSimulator', () => {
  it('renders header, Davenport lab title and arterial blood gas inputs', () => {
    render(<AcidBaseSimulator />);
    expect(screen.getAllByText(/Acid-Base/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Davenport Nomogram Lab/i)).toBeInTheDocument();
    expect(screen.getByText(/Arterial pH/i)).toBeInTheDocument();
  });
});
