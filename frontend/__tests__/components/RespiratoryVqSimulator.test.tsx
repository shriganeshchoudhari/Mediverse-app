import React from 'react';
import { render, screen } from '@testing-library/react';
import RespiratoryVqSimulator from '@/components/simulators/RespiratoryVqSimulator';

describe('RespiratoryVqSimulator', () => {
  it('renders alveolar gas exchange and solver status', () => {
    render(<RespiratoryVqSimulator />);
    expect(screen.getByText(/Respiratory Mechanics/i)).toBeInTheDocument();
    expect(screen.getByText(/Alveolar Gas Exchange/i)).toBeInTheDocument();
  });
});
