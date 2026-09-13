import React from 'react';
import { render, screen } from '@testing-library/react';
import RenalFiltrationSimulator from '@/components/simulators/RenalFiltrationSimulator';

describe('RenalFiltrationSimulator', () => {
  it('renders GFR clearance lab title and controls', () => {
    render(<RenalFiltrationSimulator />);
    expect(screen.getAllByText(/Renal Filtration/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/GFR Clearance Lab/i)).toBeInTheDocument();
  });
});
