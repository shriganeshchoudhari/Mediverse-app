import React from 'react';
import { render, screen } from '@testing-library/react';
import NerveMuscleSimulator from '@/components/simulators/NerveMuscleSimulator';

describe('NerveMuscleSimulator', () => {
  it('renders membrane potential lab and ion dynamics', () => {
    render(<NerveMuscleSimulator />);
    expect(screen.getByText(/Nerve-Muscle/i)).toBeInTheDocument();
    expect(screen.getByText(/Membrane Potential Lab/i)).toBeInTheDocument();
  });
});
