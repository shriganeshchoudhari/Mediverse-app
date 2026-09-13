import React from 'react';
import { render, screen } from '@testing-library/react';
import SpirometrySimulator from '@/components/simulators/SpirometrySimulator';

describe('SpirometrySimulator', () => {
  it('renders spirometry pulmonary function lab and parameters', () => {
    render(<SpirometrySimulator />);
    expect(screen.getByText(/Spirometry/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Pulmonary Function/i).length).toBeGreaterThan(0);
  });
});
