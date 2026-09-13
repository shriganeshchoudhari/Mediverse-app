import React from 'react';
import { render, screen } from '@testing-library/react';
import EcgRhythmSimulator from '@/components/simulators/EcgRhythmSimulator';

describe('EcgRhythmSimulator', () => {
  it('renders telemetry display, heart rate controls, and diagnostic rhythms', () => {
    render(<EcgRhythmSimulator />);
    expect(screen.getByText(/LIVE TELEMETRY/i)).toBeInTheDocument();
    expect(screen.getByText(/Diagnostic Rhythms/i)).toBeInTheDocument();
    expect(screen.getByText(/Heart Rate/i)).toBeInTheDocument();
  });
});
