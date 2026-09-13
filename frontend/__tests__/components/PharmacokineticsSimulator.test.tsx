import React from 'react';
import { render, screen } from '@testing-library/react';
import PharmacokineticsSimulator from '@/components/simulators/PharmacokineticsSimulator';

describe('PharmacokineticsSimulator', () => {
  it('renders route selector and dose inputs', () => {
    render(<PharmacokineticsSimulator />);
    expect(screen.getByText(/Route of Administration/i)).toBeInTheDocument();
    expect(screen.getByText(/Administered Dose/i)).toBeInTheDocument();
  });
});
